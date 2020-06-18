import { Navbar } from "../Navbar/Navbar";
import Head from "next/head";
import styles from "./Layout.module.scss";
import { Footer } from "../Footer/Footer";
import { useSession } from 'next-auth/client'

interface LayoutProps {
  className?: string;
  extraFooterChildren?: JSX.Element[],
}

export const Layout: React.FunctionComponent<LayoutProps> = ({
  className,
  extraFooterChildren,
  children,
}) => {

  // Auth
  const [ session, loading ] = useSession()
  // const notAuthedContent = !session ? <div className={styles.auth}>
  //   Not signed in. <a href="/api/auth/signin">Sign in</a>.
  // </div> : null;
  const notAuthedContent = !session ? <div className={styles.auth}>
    Not signed in.
    <form method='post' action='/api/auth/callback/credentials'>
      <input name='secret' type='password' defaultValue='' />
      <button type='submit'>Sign in</button>
    </form>
  </div> : null;

  return (
    <div className={styles.layout}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        {/* <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script> */}
        {/* <script src="/util.js"></script> */}
      </Head>
      <Navbar />
      <div className={`${styles.main} ${className}`}>
        {notAuthedContent ?? children}
      </div>
      <div className={styles.backgroundContainer}>
        <div className={styles.backgroundGradient}></div>
        <div className={styles.imageContainer}>
          <img className={styles.backgroundImage} src="/images/vaporwave.png" />
        </div>
      </div>
      <Footer extraFooterChildren={extraFooterChildren} />
    </div>
  );
}
