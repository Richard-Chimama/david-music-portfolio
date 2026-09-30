type ContentfulEnvironment = "development" | "production";

type ContentfulConfig = {
	environment: ContentfulEnvironment;
	spaceId: string;
	accessToken: string;
	environmentId: string;
};

function getContentfulEnvironment(): ContentfulEnvironment {
	return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"
		? "production"
		: "development";
}

function getRequiredEnvValue(names: string[], label: string): string {
	const value = names.map((name) => process.env[name]).find(Boolean);
	if (!value) {
		throw new Error(`Missing Contentful ${label} configuration.`);
	}
	return value;
}

export function getContentfulConfig(): ContentfulConfig {
	const environment = getContentfulEnvironment();
	const suffix = environment === "production" ? "PROD" : "DEV";

	return {
		environment,
		spaceId: getRequiredEnvValue(
			[`CONTENTFUL_SPACE_ID_${suffix}`, "CONTENTFUL_SPACE_ID"],
			"space ID",
		),
		accessToken: getRequiredEnvValue(
			[`CONTENTFUL_ACCESS_TOKEN_${suffix}`, "CONTENTFUL_ACCESS_TOKEN"],
			"access token",
		),
		environmentId:
			process.env[`CONTENTFUL_ENVIRONMENT_${suffix}`] ||
			process.env.CONTENTFUL_ENVIRONMENT ||
			"master",
	};
}

export async function getContentfulEntries(contentType?: string): Promise<unknown> {
	const config = getContentfulConfig();
	const params = new URLSearchParams({
		limit: "100",
		include: "2",
	});

	if (contentType) {
		params.set("content_type", contentType);
	}

	const url = `https://cdn.contentful.com/spaces/${encodeURIComponent(config.spaceId)}/environments/${encodeURIComponent(config.environmentId)}/entries?${params}`;
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${config.accessToken}`,
		},
		next: { revalidate: 60 },
	});

	if (!response.ok) {
		throw new Error(`Contentful request failed with status ${response.status}.`);
	}

	return response.json();
}
