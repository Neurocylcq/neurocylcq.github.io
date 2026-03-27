'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type RevealState = {
  typedTitle: string;
  typedTagline: string;
  titleDone: boolean;
};

const titleText = 'Neurocylcq';
const taglineText = 'Personal Knowledge Workspace';

export default function HomePage() {
  const [typing, setTyping] = useState<RevealState>({
    typedTitle: '',
    typedTagline: '',
    titleDone: false,
  });

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    const typeText = (
      text: string,
      speed: number,
      onTick: (value: string) => void,
      onDone: () => void,
      startDelay = 0,
    ) => {
      let index = 0;
      const run = () => {
        if (!active) {
          return;
        }
        index += 1;
        onTick(text.slice(0, index));
        if (index < text.length) {
          timer = window.setTimeout(run, speed);
          return;
        }
        onDone();
      };
      timer = window.setTimeout(run, startDelay);
    };

    setTyping({ typedTitle: '', typedTagline: '', titleDone: false });

    typeText(titleText, 70, (value) => {
      setTyping((prev) => ({ ...prev, typedTitle: value }));
    }, () => {
      setTyping((prev) => ({ ...prev, titleDone: true }));
      typeText(
        taglineText,
        24,
        (value) => setTyping((prev) => ({ ...prev, typedTagline: value })),
        () => {},
        260,
      );
    });

    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
          }
        }
      },
      { threshold: 0.15 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.mainContent}>
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <p className={styles.heroKicker}>Personal Knowledge Workspace</p>
          <h1 className={`${styles.heroTitle} ${styles.typeShell}`}>
            {typing.typedTitle}
            <span
              className={styles.typingCursor}
              aria-hidden="true"
              style={{ visibility: typing.titleDone ? 'hidden' : 'visible' }}
            >
              |
            </span>
          </h1>
          <p className={`${styles.heroSubtitle} ${styles.typeShell}`}>
            {typing.typedTagline}
            <span className={styles.typingCursor} aria-hidden="true">
              |
            </span>
          </p>
          <p className={styles.disclaimer}>
            This site is mainly a personal, grab-and-go notebook. Many entries may not
            be rigorously validated and can contain errors.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.primaryBtn} href="/docs">
              Start Docs
            </Link>
            <Link className={styles.secondaryBtn} href="/apps">
              Open Apps
            </Link>
            <Link className={styles.secondaryBtn} href="/about">
              About Me
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={`${styles.statsRow} ${styles.reveal}`}>
          <div className={`${styles.statItem} ${styles.enterOne}`}>
            <p className={styles.statLabel}>Primary Workspace</p>
            <p className={styles.statValue}>Docs</p>
          </div>
          <div className={`${styles.statItem} ${styles.enterTwo}`}>
            <p className={styles.statLabel}>Navigation Hub</p>
            <p className={styles.statValue}>Apps</p>
          </div>
          <div className={`${styles.statItem} ${styles.enterThree}`}>
            <p className={styles.statLabel}>Personal Profile</p>
            <p className={styles.statValue}>About</p>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={`${styles.grid} ${styles.reveal}`}>
          <article className={styles.card}>
            <h2>Machine Learning Notes</h2>
            <p>Fast notes about models, training, and experiments.</p>
            <Link href="/docs">Open Docs</Link>
          </article>
          <article className={styles.card}>
            <h2>Computer Science Notes</h2>
            <p>Algorithms, systems, and CS foundations for quick review.</p>
            <Link href="/docs">Open Docs</Link>
          </article>
          <article className={styles.card}>
            <h2>Workspace Profile</h2>
            <p>Background, activity heatmap, and site operating model.</p>
            <Link href="/about">Open About</Link>
          </article>
        </div>
      </section>

      <section className={styles.container}>
        <div className={`${styles.policyPanel} ${styles.reveal}`}>
          <h2>Quick Access</h2>
          <ul>
            <li>
              <Link href="/docs">Documentation</Link>
            </li>
            <li>
              <Link href="/apps">Apps Launcher</Link>
            </li>
            <li>
              <Link href="/about">About Page</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
