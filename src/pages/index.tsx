import { useEffect, type ReactNode } from "react";
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <p className={styles.heroKicker}>Personal Knowledge Workspace</p>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <p className={styles.disclaimer}>
          Notes reflect personal understanding and may contain mistakes.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/notes">
            Start Notes
          </Link>
          <Link className="button button--secondary button--lg" to="/blog">
            Read Blog
          </Link>
          <Link className="button button--outline button--lg" to="/projects">
            Browse Projects
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
          }
        });
      },
      { threshold: 0.16 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title={`${siteConfig.title} | Home`}
      description="Personal notes, formal blog posts, and project wiki documentation.">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <section className="container">
          <div className={styles.statsRow} data-reveal>
            <div className={`${styles.statItem} ${styles.enterOne}`}>
              <p className={styles.statLabel}>Primary Workspace</p>
              <p className={styles.statValue}>Notes</p>
            </div>
            <div className={`${styles.statItem} ${styles.enterTwo}`}>
              <p className={styles.statLabel}>Formal Channel</p>
              <p className={styles.statValue}>Blog</p>
            </div>
            <div className={`${styles.statItem} ${styles.enterThree}`}>
              <p className={styles.statLabel}>Project Memory</p>
              <p className={styles.statValue}>Wiki</p>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid} data-reveal>
            <article className={styles.card}>
              <Heading as="h2">Machine Learning Notes</Heading>
              <p>Fast, practical notes about models, training, and experiments.</p>
              <Link to="/notes/machine-learning">Open Category</Link>
            </article>

            <article className={styles.card}>
              <Heading as="h2">Computer Science Notes</Heading>
              <p>Algorithms, systems, and core CS concepts organized for quick review.</p>
              <Link to="/notes/computer-science">Open Category</Link>
            </article>

            <article className={styles.card}>
              <Heading as="h2">Projects Wiki</Heading>
              <p>Design decisions, architecture notes, and implementation references.</p>
              <Link to="/projects">Open Wiki</Link>
            </article>
          </div>
        </section>

        <section className="container">
          <div className={styles.dualGrid} data-reveal>
            <div className={styles.policyPanel}>
              <Heading as="h2">Quality Policy</Heading>
              <p>
                Notes prioritize speed of capture and personal comprehension. Blog posts are
                curated, revised, and expected to include stronger validation and references.
              </p>
              <div className={styles.policyActions}>
                <Link to="/notes">Go to Notes</Link>
                <Link to="/blog/writing-standards">Read Writing Standards</Link>
              </div>
            </div>

            <div className={styles.statusPanel}>
              <Heading as="h2">Note Status System</Heading>
              <p>Each note can be marked with one of these states:</p>
              <div className={styles.statusTags}>
                <span className="note-status note-status--draft">Draft</span>
                <span className="note-status note-status--reviewed">Reviewed</span>
                <span className="note-status note-status--archived">Archived</span>
              </div>
              <Link to="/notes/status-system">View Status Guide</Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.timelinePanel} data-reveal>
            <Heading as="h2">Publishing Flow</Heading>
            <ol>
              <li>Capture ideas quickly in Notes.</li>
              <li>Refine and validate selected topics.</li>
              <li>Publish finalized content to Blog.</li>
            </ol>
          </div>
        </section>

        <section className="container">
          <div className={styles.policyPanel} data-reveal>
            <Heading as="h2">Recent Entry Points</Heading>
            <p>Use these paths to jump straight into your current workflows.</p>
            <ul>
              <li><Link to="/notes/machine-learning/ml-foundations">ML Foundations</Link></li>
              <li><Link to="/notes/computer-science/cs-foundations">CS Foundations</Link></li>
              <li><Link to="/projects/sample-project">Sample Project Wiki</Link></li>
            </ul>
          </div>
        </section>

        <section className="container">
          <div className={styles.quickLinks}>
            <Heading as="h2">Quick Access</Heading>
            <ul>
              <li><Link to="/notes">Notes Overview</Link></li>
              <li><Link to="/blog">All Blog Posts</Link></li>
              <li><Link to="/projects">Projects Index</Link></li>
              <li><Link to="/about">About This Site</Link></li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}
