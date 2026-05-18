export function scrollToElementId(
  id: string,
  behavior: ScrollBehavior = 'smooth',
): void {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  const headerOffset = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'),
  ) || 0;

  const top =
    element.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({ top, behavior });
}
