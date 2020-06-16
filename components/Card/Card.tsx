import Link from "next/link";
import styles from "./Card.module.scss";
import { WPPost } from "../../server/rest";

interface MyProps {
  post: WPPost,
}

export const Card = ({post}:MyProps) => (
  <Link href="/articles/[slug]" as={`/articles/${post.slug}`}>
    <div className={styles.card}>
      <h3
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <div
        className={styles.excerpt}
        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
      ></div>
      <div className={styles.bar}></div>
    </div>
  </Link>
);
