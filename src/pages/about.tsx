import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./about.module.css";

export default function About(): ReactNode {
  return (
    <Layout title="About | Neurocylcq" description="Purpose, scope, and quality contract of this workspace.">
      <main className={styles.mainContent}>
        <section className={styles.heroBanner}>
          <div className="container">
            <p className={styles.heroKicker}>About</p>
            <Heading as="h1" className={styles.heroTitle}>What This Site Is For</Heading>
            <p className={styles.heroSubtitle}>
              A personal technical workspace for capture, refinement, and publication.
            </p>
            <p className={styles.disclaimer}>
              Notes are personal understanding and may include mistakes, omissions, or outdated details.
            </p>
          </div>
        </section>

        <section className="container">
          <div className={styles.missionPanel}>
            <Heading as="h2">Role of This Site</Heading>
            <p>
              This site is a working knowledge system: not a polished encyclopedia, not a random bookmark dump.
            </p>
            <ul className={styles.quickList}>
              <li>Capture ideas quickly while learning.</li>
              <li>Preserve project decisions and context.</li>
              <li>Publish stable write-ups when confidence is sufficient.</li>
            </ul>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid}>
            <article className={styles.card}>
              <Heading as="h2">Scope</Heading>
              <p>Machine Learning, Computer Science, and practical project engineering.</p>
            </article>

            <article className={styles.card}>
              <Heading as="h2">Audience</Heading>
              <p>Primarily future-self documentation, with optional public reuse.</p>
            </article>

            <article className={styles.card}>
              <Heading as="h2">Constraint</Heading>
              <p>Speed first in Notes, rigor first in Blog.</p>
            </article>
          </div>
        </section>

        <section className="container">
          <div className={styles.timelinePanel}>
            <Heading as="h2">Quality Contract</Heading>
            <ol className={styles.timelineList}>
              <li><strong>Notes:</strong> fast retrieval, evolving understanding, explicit status tags.</li>
              <li><strong>Blog:</strong> reviewed claims, clearer argumentation, stronger validation.</li>
              <li><strong>Projects:</strong> architecture logs, implementation history, operational memory.</li>
            </ol>
          </div>
        </section>

        <section className="container">
          <div className={styles.dualGrid}>
            <div className={styles.panel}>
              <Heading as="h2">How To Read Notes</Heading>
              <p>Use status badges as confidence hints before reusing technical conclusions.</p>
              <div className={styles.statusTags}>
                <span className="note-status note-status--draft">Draft</span>
                <span className="note-status note-status--reviewed">Reviewed</span>
                <span className="note-status note-status--archived">Archived</span>
              </div>
              <Link to="/notes/status-system">Open Status Guide</Link>
            </div>

            <div className={styles.panel}>
              <Heading as="h2">Where To Go Next</Heading>
              <p>Pick your entry based on task type.</p>
              <ul className={styles.quickList}>
                <li><Link to="/apps">Frontend Apps</Link></li>
                <li><Link to="/notes">Notes Overview</Link></li>
                <li><Link to="/blog">Blog Overview</Link></li>
                <li><Link to="/projects">Projects Wiki</Link></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
