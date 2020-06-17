import Link from "next/link";
import { Layout } from "../components";
import styles from "../styles/index.module.scss";
import { NextComponentType, NextPageContext, GetStaticProps } from "next";
import { getPostBySlug, WPPost } from "../server/rest";
import { ParsedUrlQuery } from "querystring";

interface MyProps {
  post: WPPost,
}

const Home = (p:MyProps) => {

  return (
    <Layout className={styles.home}>
      <header>
        <h1>WP Engine Product Strategy</h1>
        <p className={styles.description}>
          A Hyperlinked Wunderkammer
        </p>
      </header>
      <main className={styles.main}>
        {/*
        <header className="m0a">
          <h2>Decoupled Digital Experiences.</h2>
          <p className={styles.description}>
            Check out these free resources to learn how you can pair your
            favorite frontend framework with your existing WordPress site, all
            on WP Engine.
          </p>
        </header>
        <Cards posts={posts} />
        */}
        <article className="article">
          {/* <h1 className="blogtitle" dangerouslySetInnerHTML={{ __html: p.post?.title?.rendered }} /> */}
          <div className="content"
            dangerouslySetInnerHTML={{ __html: p.post.content.rendered }}
          ></div>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<MyProps,ParsedUrlQuery> = async (ctx) => {
  const home = await getPostBySlug("home");    // content for the home page
  return { props: { post: home } };
};

export default Home;
