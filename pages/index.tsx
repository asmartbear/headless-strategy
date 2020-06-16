import { Layout, Card } from "../components";
import styles from "../styles/index.module.scss";
import { NextComponentType, NextPageContext, GetStaticProps } from "next";
import { ServerRepo } from "../server/repo";

const Home = ({ posts }) => {
  const Cards: NextComponentType<
    NextPageContext,
    {},
    { posts?: Array<any> }
  > = ({ posts }) => {
    return (
      <div className={styles.cards}>
        {posts.map((post) => (
          <Card key={post.uid} post={post}></Card>
        ))}
      </div>
    );
  };

  return (
    <Layout className={styles.home}>
      <header>
        <h1>WP Engine Product Strategy</h1>
        <p className={styles.description}>
          A hyperlinked Wunderkammer.
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
        */}
        <Cards posts={posts} />
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const posts = await ServerRepo.Posts();
  return { props: { posts }, unstable_revalidate: 15 };
};

export default Home;
