
/**
 * Replaces full URLs created by WordPress with API URLs we need in our Headless site.
 */
export function scrub(text: string): string {
  if (!text) return "";

  // Transform links to stay with our Headless system
  text = text.replace(/\bhref="https:\/\/strategyprod.wpengine.com\//g, `href="/articles/`);

  // Transform images to use our proxy
  text = text.replace(/src="https:\/\//g, `src="/api/proxy/`);
  text = text.replace(/src="http:\/\//g, `src="/api/proxy/`);
  text = text.replace(
    /(?=(width|height|style|srcset)\=")(.*?)(?=" )./g,
    ""
  );
  return text;
};

/**
 * Deep-copy an object, but only types that are compatible with JSON.
 */
export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}
