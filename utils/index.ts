
/**
 * Replaces full URLs created by WordPress with API URLs we need in our Headless site.
 */
export const scrub = (text: string) => {
  if (!text) return "";
  let newText: string;
  newText = text.replace(/src="https:\/\//g, `src="/api/proxy/`);
  newText = newText.replace(/src="http:\/\//g, `src="/api/proxy/`);
  newText = newText.replace(
    /(?=(width|height|style|srcset)\=")(.*?)(?=" )./g,
    ""
  );
  return newText;
};

/**
 * Deep-copy an object, but only types that are compatible with JSON.
 */
export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}
