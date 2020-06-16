import fetch from "node-fetch";

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
 * Loads a post from WordPress, given its unique slug, or throws exception if it cannot be found or if there's an error communicating with WordPress.
 */
export async function getPostBySlug( slug:string ): Promise<WPPost> {
    const url = `${WP_URL}/wp-json/wp/v2/posts?slug=${slug}`;
    const response = await fetch(url);
    if ( ! response.ok ) throw new Error("error fetching from WordPress: " + response.statusText)
    const posts: WPPost[] = await response.json();
    if ( posts.length === 0 ) throw new Error("couldn't find post with slug=" + slug)
    return posts[0]
}

