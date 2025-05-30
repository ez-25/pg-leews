import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          PLAY
        </h1>
        <ol>
          <li>
            playground 
          </li>
          <li></li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/demo/hichart/gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gold (Mock)
          </a>
          <a
            className={styles.secondary}
            href="/demo/hichart/goldcsv"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gold (CSV)
          </a>
          <a
            className={styles.secondary}
            href="/demo/hichart/usdkrw"
            target="_blank"
            rel="noopener noreferrer"
          >
            USD/KRW
          </a>
          <a
            className={styles.secondary}
            href="/demo/table"
            target="_blank"
            rel="noopener noreferrer"
          >
            Table
          </a>
          <a
            className={styles.secondary}
            href="/demo/table/table-custom"
            target="_blank"
            rel="noopener noreferrer"
          >
            Table Custom
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <h1>footer</h1>
      </footer>
    </div>
  );
}
