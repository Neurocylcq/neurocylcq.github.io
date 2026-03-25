import type { CSSProperties, ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./apps.module.css";

export default function Apps(): ReactNode {
  const iconStyle = (vars: Record<string, string>): CSSProperties => vars as CSSProperties;

  return (
    <Layout title="Apps | Neurocylcq" description="Categorized app launcher for fast navigation.">
      <main className={styles.mainContent}>
        <section className={styles.heroBanner}>
          <div className="container">
            <p className={styles.heroKicker}>App Launcher</p>
            <Heading as="h1" className={styles.heroTitle}>Categorized Quick Navigation</Heading>
            <p className={styles.heroSubtitle}>
              Choose an app card by category to jump directly to the target page.
            </p>
          </div>
        </section>

        <section className="container">
          <div className={styles.quickJumpPanel}>
            <Heading as="h2">Main Destinations</Heading>
            <div className={styles.jumpLinks}>
              <Link to="/notes">Notes</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/apps">Apps</Link>
              <Link to="/about">About</Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid}>
            <section className={styles.categorySection}>
              <Heading as="h3" className={styles.categoryTitle}>Knowledge</Heading>
              <div className={styles.cardGrid}>
                <Link
                  className={styles.appCard}
                  to="/notes/machine-learning"
                  data-icon="🧠"
                  style={iconStyle({ "--bg-icon-size": "4.5rem", "--bg-icon-right": "-0.05rem", "--bg-icon-top": "54%" })}>
                  <strong>Machine Learning</strong>
                  <p>Open the ML note space for models, training, and experiments.</p>
                </Link>
                <Link
                  className={styles.appCard}
                  to="/notes/computer-science"
                  data-icon="🧩"
                  style={iconStyle({ "--bg-icon-size": "4.2rem", "--bg-icon-right": "0.1rem", "--bg-icon-top": "50%" })}>
                  <strong>Computer Science</strong>
                  <p>Jump to algorithms, systems, and CS fundamentals.</p>
                </Link>
                <Link
                  className={styles.appCard}
                  to="/notes/status-system"
                  data-icon="🏷️"
                  style={iconStyle({ "--bg-icon-size": "4.4rem", "--bg-icon-right": "0.05rem", "--bg-icon-top": "52%", "--bg-icon-rotate": "-8deg" })}>
                  <strong>Status System</strong>
                  <p>Check note confidence labels: Draft, Reviewed, Archived.</p>
                </Link>
              </div>
            </section>

            <section className={styles.categorySection}>
              <Heading as="h3" className={styles.categoryTitle}>Publishing</Heading>
              <div className={styles.cardGrid}>
                <Link
                  className={styles.appCard}
                  to="/blog"
                  data-icon="📝"
                  style={iconStyle({ "--bg-icon-size": "4.4rem", "--bg-icon-right": "0.05rem", "--bg-icon-top": "53%" })}>
                  <strong>Blog</strong>
                  <p>View reviewed posts and long-form technical writing.</p>
                </Link>
                <Link
                  className={styles.appCard}
                  to="/blog/tags"
                  data-icon="🔖"
                  style={iconStyle({ "--bg-icon-size": "4.25rem", "--bg-icon-right": "0.12rem", "--bg-icon-top": "50%" })}>
                  <strong>Blog Tags</strong>
                  <p>Navigate blog content by topic tags quickly.</p>
                </Link>
                <Link
                  className={styles.appCard}
                  to="/blog/writing-standards"
                  data-icon="✅"
                  style={iconStyle({ "--bg-icon-size": "4.1rem", "--bg-icon-right": "0.15rem", "--bg-icon-top": "50%" })}>
                  <strong>Writing Standards</strong>
                  <p>Read editorial boundaries between Notes and Blog.</p>
                </Link>
              </div>
            </section>

            <section className={styles.categorySection}>
              <Heading as="h3" className={styles.categoryTitle}>Project & External</Heading>
              <div className={styles.cardGrid}>
                <Link
                  className={styles.appCard}
                  to="/projects"
                  data-icon="🗂️"
                  style={iconStyle({ "--bg-icon-size": "4.35rem", "--bg-icon-right": "0.1rem", "--bg-icon-top": "51%" })}>
                  <strong>Projects Wiki</strong>
                  <p>Open project documentation and architecture history.</p>
                </Link>
                <Link
                  className={styles.appCard}
                  to="/projects/sample-project"
                  data-icon="🛠️"
                  style={iconStyle({ "--bg-icon-size": "4.45rem", "--bg-icon-right": "0.02rem", "--bg-icon-top": "52%", "--bg-icon-rotate": "-6deg" })}>
                  <strong>Sample Project</strong>
                  <p>Reference wiki template structure for new projects.</p>
                </Link>
                <a
                  className={styles.appCard}
                  href="https://github.com/Neurocylcq"
                  data-icon="🌐"
                  style={iconStyle({ "--bg-icon-size": "4.55rem", "--bg-icon-right": "-0.02rem", "--bg-icon-top": "50%", "--bg-icon-opacity": "0.12" })}>
                  <strong>GitHub</strong>
                  <p>Open external profile and repositories.</p>
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}
