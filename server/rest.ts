import fetch from "node-fetch";

/**
 * Mapping of tag IDs to text.  We could pull that from WordPress of course.
 */
export const MAP_TAGID_TO_NAME: Record<number,string> = {
    2: "Metrics",
    3: "Growth",
}

/**
 * Typescript type of a WordPress Post object
 */
export interface WPPost {

    /**
     * Unique post ID.
     */
    id: number,

    /**
     * Unique textual slug that is normally used to access this post.
     */
    slug: string,
    
    /**
     * ID of the author of the post.
     */
    author: number,

    /**
     * One-line title, almost always displayed, often part of `<title></title>`.
     */
    title: {
        rendered: string,
    },

    /**
     * Short version of the content, e.g. for listings.
     */
    excerpt: {
        rendered: string,
    },

    /**
     * Body of the post.
     */
    content: {
        rendered: string,
    },

    /**
     * Created-on timestamp.
     */
    date_gmt: string,

    /**
     * Last-modified timestamp.
     */
    modified_gmt: string,

    /**
     * IDs of post categories that this post belongs to.
     */
    categories: number[],

    /**
     * IDs of post tags that this post belongs to.
     */
    tags: number[],

    /**
     * Either `'post'` or `'page'`.
     */
    type: string,
}

/**
 * The base URL to the WordPress site with the content.
 */
const WP_URL = process.env.WP_URL;

/**
 * Loads a post from WordPress, given its unique ID, or throws exception if it cannot be found or if there's an error communicating with WordPress.
 */
export async function getPostById( id:number ): Promise<WPPost> {
    const url = `${WP_URL}/wp-json/wp/v2/posts/${id}`;
    const response = await fetch(url);
    if ( ! response.ok ) throw new Error("error fetching from WordPress: " + response.statusText)
    const post = transformPost(await response.json());
    post.content.rendered = await transformFull(post.content.rendered);
    return post;
}

/**
 * Loads a post from WordPress, given its unique slug, or throws exception if it cannot be found or if there's an error communicating with WordPress.
 */
export async function getPostBySlug( slug:string, postType:string = "posts" ): Promise<WPPost> {
    const url = `${WP_URL}/wp-json/wp/v2/${postType}?slug=${slug}`;
    const response = await fetch(url);
    if ( ! response.ok ) throw new Error("error fetching from WordPress: " + response.statusText)
    const posts: WPPost[] = await response.json();
    if ( posts.length === 0 ) throw new Error("couldn't find post with slug=" + slug)
    const post = transformPost(posts[0])
    post.content.rendered = await transformFull(post.content.rendered);
    return post;
}

/**
 * Loads posts from WordPress, given unique tag IDs.
 */
export async function getPostsByTagId( id:number ): Promise<WPPost[]> {
    const url = `${WP_URL}/wp-json/wp/v2/posts?tags=${id}`;
    const response = await fetch(url);
    if ( ! response.ok ) throw new Error("error fetching from WordPress: " + response.statusText)
    const posts: WPPost[] = await response.json();
    return posts.map( post => transformPost(post) );
}

/**
 * Transforms raw fields from the REST API into fields that we want.
 */
function transformPost( post:WPPost ): WPPost {
    if ( post ) {
        post.content.rendered = transformForHeadless(post.content.rendered);
    }
    return post;
}

/**
 * Converts WordPress HTML into Headless HTML, transforming links, images, and special sequences.
 */
function transformForHeadless(html: string): string {
    if (!html) return "";
    
    // Transform links to stay with our Headless system
    html = html.replace(/\bhref="https?:\/\/\w+\.wpengine\.com\//g, `href="/articles/`);

    // Replace external links with an indication that it will take you away from the site.
    html = html.replace(REGEXP_EXTERNAL_LINK, (_, href, target) => {
        return `<a href="${href}" target="_blank">${target}<img class="external-link" src="/images/external-link-symbol.svg" /></a>`;
    });
  
    // Transform images to use our proxy
    html = html.replace(/src="https?:\/\//g, `src="/api/proxy/`);
    html = html.replace(/(?=(width|height|style|srcset)\=")(.*?)(?=" )./g, "");
  
    // Done!
    return html;
};

/**
 * Converts full content that also might require making further requests to WordPress.
 */
async function transformFull(html: string): Promise<string> {
    
    // Transform sidebar indicators into actual sidebars.  First, load the set of referenced slugs.
    // Also save the locations of the beginning `<p>` tag for each slug.
    const sidebarSlugs: string[] = [];
    const sidebarPTagStarts: number[] = [];
    let match: RegExpExecArray;
    while ((match = REGEXP_SIDEBAR.exec(html)) !== null) {
        sidebarSlugs.push(match[1])
        sidebarPTagStarts.push(html.substring(0, match.index).lastIndexOf('<p>'))
    }

    // Load content for all sidebar slugs simultaneously
    const sidebarPosts = await Promise.all( sidebarSlugs.map( slug => getPostBySlug(slug,"sidebar") ) )

    // Compute sidebar HTML
    const sidebarHtml = new Map<string,string>();
    for ( let i = 0 ; i < sidebarSlugs.length ; ++i ) {
        const slug = sidebarSlugs[i];
        const post = sidebarPosts[i];
        sidebarHtml.set(slug,`<div id="sidebar-${slug}" class="sidebar"><b>${post.title.rendered}</b><br/>${post.content.rendered}</div>`);
    }

    // Insert slug divs into the text, in reverse order so our offsets will be correct as we modify the string
    for ( let i = sidebarPTagStarts.length ; --i >= 0 ; ) {
        const idx = sidebarPTagStarts[i];
        html = html.substring(0, idx) + sidebarHtml.get(sidebarSlugs[i]) + html.substring(idx);
    }
    
    // Replace the in-line HTML with a reference to the sidebar article.
    html = html.replace(REGEXP_SIDEBAR, (_, slug, anchor) => {
        return `${anchor}<b id="sidebar-${slug}-ref">*</b>`;
    });

    // Done!
    return html;
};

  const REGEXP_SIDEBAR = /<a href="\/articles\/sidebar\/([^\/"]+)\/?">([^<]+)<\/a>/g;
  const REGEXP_EXTERNAL_LINK = /<a href="(http[^"]+)">([^<]+)<\/a>/g;