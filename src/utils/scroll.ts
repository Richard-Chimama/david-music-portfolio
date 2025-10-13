export function smoothScrollToId(id: string, offset: number = 0) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) {
    try {
      window.location.hash = id;
    } catch {}
    return;
  }
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
  try {
    history.pushState(null, '', `#${id}`);
  } catch {}
}