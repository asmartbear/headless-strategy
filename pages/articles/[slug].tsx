import Link from "next/link";
import { Layout } from "../../components";
import styles from "../../styles/post.module.scss";
import { GetServerSideProps } from "next";
import { WPPost, getPostBySlug, MAP_TAGID_TO_NAME } from "../../server/rest";
import { ParsedUrlQuery } from "querystring";

interface MyProps {
  post: WPPost,
  content: string,
}

const Post = ({ post, content }: MyProps) => {

  const tagSpans = post.tags.map( tagId => <span className={styles.metadataValue}>&#x1F3F7;<a href={`/tags/${tagId}`}>{(MAP_TAGID_TO_NAME[tagId] ?? String(tagId)).toLocaleUpperCase()}</a>&nbsp;&nbsp;</span> )

  return (
    <Layout className={styles.post}>
      <header>
        <Link href="/">
          <h2 className={styles.sitetitle}>
            Product Strategy
          </h2>
        </Link>
      </header>
      <article className={styles.article}>
        {/**
        <span> </span>
        <span className={styles.metadata}>VIEW ON: </span>
        <span className={styles.metadataValue}>
          <a href={post?.link} target="_blank">
            {post?.site}
          </a>
        </span>
         */}
        <h1 className={styles.blogtitle} dangerouslySetInnerHTML={{ __html: post?.title?.rendered }} />
        <span className={styles.metadata}>LAST UPDATED: </span>
        <span className={styles.metadataValue}>
          {new Date(post.modified_gmt).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span><br/>
        {tagSpans}
        <div className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </article>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<MyProps,ParsedUrlQuery> = async (ctx) => {
  const post = await getPostBySlug((ctx as any).params["slug"]);
  let content = post?.content?.rendered;
  content = content.replace(/\bclass="sidebar"/g, `class="${styles.sidebar}"`);
  return { props: { post, content } };
};

export default Post;
