import { Logo } from "../Logo/Logo";

import styles from "./Footer.module.scss";

interface MyProps {
  extraFooterChildren?: JSX.Element[],
}

export const Footer = (p:MyProps) => {
  return (
  <nav className={styles.footer}>
    <div className={styles.linkContainer}>
      <Logo />
    </div>
    <div className={styles.legalContainer}>
      <span className={`${styles.copyright}`}>
        © 2010–2020 WP Engine, Inc. All Rights Reserved.
      </span>
      <span className={`${styles.legal} fe`}>
        WP ENGINE®, TORQUE®, EVERCACHE®, and the cog logo service marks are owned by WP Engine, Inc.<br />
        Some icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a>.
      </span>
    </div>
    <div className={styles.legalContainer}>
      {p.extraFooterChildren ?? []}
    </div>
  </nav>
  );
}
