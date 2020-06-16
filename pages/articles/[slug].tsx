import { Layout } from "../../components";
import styles from "../../styles/post.module.scss";
import { GetServerSideProps } from "next";
import { scrub } from "../../utils";
import { WPPost, getPostBySlug } from "../../server/rest";
import { ParsedUrlQuery } from "querystring";

interface MyProps {
  post: WPPost,
}

const Post = ({ post }: MyProps) => {
  return (
    <Layout className={styles.post}>
      <header>
        <h2 className={styles.sitetitle}>
          WP Engine Product Strategy
        </h2>
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
        <h1 className={styles.blogtitle} dangerouslySetInnerHTML={{ __html: scrub(post?.title?.rendered) }} />
        <span className={styles.metadata}>LAST UPDATED: </span>
        <span className={styles.metadataValue}>
          {new Date(post.modified_gmt).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <div className={styles.content}
          dangerouslySetInnerHTML={{ __html: scrub(post?.content?.rendered) }}
        ></div>
      </article>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<MyProps,ParsedUrlQuery> = async (ctx) => {
  const post = await getPostBySlug((ctx as any).params["slug"]);
  return { props: { post } };
};

export default Post;
