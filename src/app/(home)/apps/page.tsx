import Link from 'next/link';
import styles from './page.module.css';

export default function AppsPage() {
  return (
    <main className={styles.mainContent}>
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <p className={styles.heroKicker}>App Launcher</p>
          <h1 className={styles.heroTitle}>Categorized Quick Navigation</h1>
          <p className={styles.heroSubtitle}>Choose an app card by category to jump directly to the target page.</p>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.quickJumpPanel}>
          <h2>Main Destinations</h2>
          <div className={styles.jumpLinks}>
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/apps">Apps</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.grid}>
          <section className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>Knowledge</h3>
            <div className={styles.cardGrid}>
              <Link className={styles.appCard} href="/docs" data-icon="🧠">
                <strong>Machine Learning</strong>
                <p>Open the ML note space for models, training, and experiments.</p>
              </Link>
              <Link className={styles.appCard} href="/docs" data-icon="🧩">
                <strong>Computer Science</strong>
                <p>Jump to algorithms, systems, and CS fundamentals.</p>
              </Link>
              <Link className={styles.appCard} href="/docs" data-icon="🏷️">
                <strong>Status System</strong>
                <p>Check note confidence labels and writing state.</p>
              </Link>
            </div>
          </section>

          <section className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>Publishing</h3>
            <div className={styles.cardGrid}>
              <Link className={styles.appCard} href="/blog" data-icon="📝">
                <strong>Blog</strong>
                <p>View reviewed posts and long-form technical writing.</p>
              </Link>
              <Link className={styles.appCard} href="/blog/tags" data-icon="🔖">
                <strong>Blog Tags</strong>
                <p>Navigate blog content by topic tags quickly.</p>
              </Link>
              <Link className={styles.appCard} href="/blog/writing-standards" data-icon="✅">
                <strong>Writing Standards</strong>
                <p>Read editorial boundaries between docs and blog.</p>
              </Link>
            </div>
          </section>

          <section className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>Project and External</h3>
            <div className={styles.cardGrid}>
              <Link className={styles.appCard} href="/projects" data-icon="🗂️">
                <strong>Projects Wiki</strong>
                <p>Open project documentation and architecture history.</p>
              </Link>
              <Link className={styles.appCard} href="/projects/sample" data-icon="🛠️">
                <strong>Sample Project</strong>
                <p>Reference wiki template structure for new projects.</p>
              </Link>
              <a className={styles.appCard} href="https://github.com/Neurocylcq" data-icon="🌐">
                <strong>GitHub</strong>
                <p>Open external profile and repositories.</p>
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
