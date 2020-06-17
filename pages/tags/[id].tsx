import Link from "next/link";
import { Layout, Card } from "../../components";
import styles from "../../styles/index.module.scss";
import { NextComponentType, NextPageContext, GetServerSideProps } from "next";
import { getPostsByTagId, WPPost, MAP_TAGID_TO_NAME } from "../../server/rest";
import { ParsedUrlQuery } from "querystring";

interface MyProps {
    tagId: number,
    posts: WPPost[],
}

const TagList = (p:MyProps) => {

  const cards = p.posts.map( post => <Card key={post.id} post={post} /> );

  return (
    <Layout className={styles.home}>
      <header>
        <h1>Product Strategy</h1>
        <p className={styles.description}>
            Articles tagged &#x1F3F7;{MAP_TAGID_TO_NAME[p.tagId] ?? p.tagId}
        </p>
      </header>
      <main className={styles.main}>
        <div className={styles.cards}>
          {cards}
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<MyProps,ParsedUrlQuery> = async (ctx) => {
    const tagId = Number(ctx.params.id);
    const posts = await getPostsByTagId(tagId);
    return { props: { posts, tagId } };
};

export default TagList;
