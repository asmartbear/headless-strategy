import Link from "next/link";
import { Layout } from "../../components";
import styles from "../../styles/post.module.scss";
import { GetServerSideProps } from "next";
import { WPPost, getPostBySlug, MAP_TAGID_TO_NAME } from "../../server/rest";
import { ParsedUrlQuery } from "querystring";

interface MyProps {
  post: WPPost,

  /**
   * If true, displays all components on the page, otherwise just the bare-bones of the content.
   */
  full: boolean,
}

const Post = ({ post, full }: MyProps) => {

  const tagSpans = full ? post.tags.map( tagId => <span className="metadataValue">&#x1F3F7;<a href={`/tags/${tagId}`}>{(MAP_TAGID_TO_NAME[tagId] ?? String(tagId)).toLocaleUpperCase()}</a>&nbsp;&nbsp;</span> ) : [];
  const tagLastUpdated = full ? <div>
      <span className="metadata">LAST UPDATED: </span>
      <span className="metadataValue">
        {new Date(post.modified_gmt).toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span><br/>{tagSpans}
    </div> : [];

  const extraFooterChildren = [
    <span>[<a href={`${process.env.WP_URL}/wp-admin/post.php?post=${post.id}&action=edit`} target="_blank">Edit in WP</a>]</span>
  ];

  return (
    <Layout className={styles.post} extraFooterChildren={extraFooterChildren}>
      <header>
        <Link href="/">
          <h2 className={styles.sitetitle}>
            Product Strategy
          </h2>
        </Link>
      </header>
      <article className="article">
        <h1 className="blogtitle" dangerouslySetInnerHTML={{ __html: post?.title?.rendered }} />
        {tagLastUpdated}
        <div className="content"
          dangerouslySetInnerHTML={{ __html: post?.content?.rendered }}
        ></div>
      </article>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<MyProps,ParsedUrlQuery> = async (ctx) => {
  const slug = String(ctx.params["slug"]);
  const post = await getPostBySlug(slug);
  const full = slug !== "home";   // special case of the home page
  return { props: { post, full } };
};

export default Post;
