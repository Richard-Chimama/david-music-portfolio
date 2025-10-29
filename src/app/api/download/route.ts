import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const trackId = searchParams.get('track');

    if (!token || !trackId) {
      return NextResponse.json(
        { error: 'Token and track ID are required' },
        { status: 400 }
      );
    }

    // TODO: Validate token against database
    // For now, we'll accept any token for development
    console.log('Download requested for track:', trackId, 'with token:', token);

    // Map track ID to actual file
    const trackFiles: Record<string, string> = {
      '1': 'track1.mp3',
      '2': 'track2.mp3',
      '3': 'track3.mp3',
      '4': 'track4.mp3',
    };

    const fileName = trackFiles[trackId];
    if (!fileName) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    try {
      // Read the full audio file from public/audio directory
      const filePath = join(process.cwd(), 'public', 'audio', fileName);
      const fileBuffer = await readFile(filePath);

      // TODO: Log download in database for analytics
      console.log('File downloaded:', fileName);

      // Return the file with appropriate headers
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json(
        { error: 'File not found or cannot be read' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}