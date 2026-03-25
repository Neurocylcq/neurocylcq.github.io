import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./about.module.css";
import heatmapData from "../data/activity-heatmap.json";

const YEARS = [2026, 2025, 2024, 2023];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type HeatDay = {
  date: string;
  github: number;
  gitee: number;
  total: number;
  level: number;
};

type HeatYear = {
  maxTotal: number;
  days: HeatDay[];
};

type HeatmapStore = Record<string, HeatYear>;

const store = heatmapData as HeatmapStore;

function edgeAlpha(index: number, total: number): number {
  const columns = 26;
  const rows = Math.max(1, Math.ceil(total / columns));
  const col = index % columns;
  const row = Math.floor(index / columns);
  const cx = (columns - 1) / 2;
  const cy = (rows - 1) / 2;

  const dx = cx === 0 ? 0 : Math.abs(col - cx) / cx;
  const dy = cy === 0 ? 0 : Math.abs(row - cy) / cy;
  const norm = Math.min(1, Math.sqrt((dx * dx + dy * dy) / 2));

  // Center stronger, edges softer.
  return Math.max(0.06, 0.5 - norm * 0.44);
}

function levelBaseRgb(level: number): string {
  if (level <= 0) return "170, 190, 212";
  if (level === 1) return "169, 209, 246";
  if (level === 2) return "114, 175, 225";
  if (level === 3) return "63, 127, 184";
  return "31, 79, 125";
}

function formatTooltipDate(date: string): string {
  const [y, m, d] = date.split("-").map((v) => Number(v));
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const month = dt.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${month} ${d}th`;
}

function tooltipText(day: HeatDay): string {
  const humanDate = formatTooltipDate(day.date);
  if (day.total <= 0) {
    return `no contributions on ${humanDate}`;
  }

  if (day.gitee > 0 && day.github > 0) {
    return `${day.total} contributions on ${humanDate}\n${day.gitee} gitee | ${day.github} github`;
  }

  if (day.gitee > 0) {
    return `${day.total} contributions on ${humanDate} | gitee`;
  }

  return `${day.total} contributions on ${humanDate} | github`;
}

export default function About(): ReactNode {
  const [activeYear, setActiveYear] = useState(YEARS[0]);
  const yearData = useMemo(() => store[String(activeYear)] ?? { maxTotal: 0, days: [] }, [activeYear]);

  return (
    <Layout title="About | Neurocylcq" description="Personal profile, public activity, and site operating model.">
      <main className={styles.mainContent}>
        <section className={styles.heroBanner}>
          <div className="container">
            <p className={styles.heroKicker}>About Me</p>
            <div className={styles.identityGrid}>
              <div className={styles.profileBlock}>
                <img
                  src="https://avatars.githubusercontent.com/neurocylcq"
                  alt="Neurocylcq avatar"
                  className={styles.avatar}
                  loading="lazy"
                />
                <div>
                  <Heading as="h1" className={styles.heroTitle}>Neurocylcq</Heading>
                  <p className={styles.heroSubtitle}>
                    Builder and learner focused on Machine Learning, Computer Science, and practical engineering workflows.
                  </p>
                  <div className={styles.profileLinks}>
                    <a href="https://github.com/neurocylcq" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://gitee.com/neurocylcq" target="_blank" rel="noreferrer">Gitee</a>
                  </div>
                </div>
              </div>

              <aside className={styles.heroHeatmapCard}>
                <div className={styles.heatmapHead}>
                  <strong>Activity Heatmap</strong>
                  <div className={styles.yearSwitch}>
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setActiveYear(year)}
                        className={year === activeYear ? styles.yearBtnActive : styles.yearBtn}>
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.monthRow}>
                  {MONTHS.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
                <div className={styles.mergeHeatmap} aria-label={`Merged GitHub and Gitee activity for ${activeYear}`}>
                  {yearData.days.map((day, i) => {
                    const alpha = edgeAlpha(i, yearData.days.length);
                    const rgb = levelBaseRgb(day.level);
                    const style: CSSProperties = {
                      borderColor: `rgba(${rgb}, ${alpha.toFixed(3)})`,
                      backgroundColor: `rgba(${rgb}, ${day.level === 0 ? (alpha * 0.18).toFixed(3) : alpha.toFixed(3)})`,
                    };
                    return (
                    <span
                      key={day.date}
                      className={styles[`level${day.level}` as keyof typeof styles]}
                      style={style}
                      title={tooltipText(day)}
                    />
                    );
                  })}
                </div>
                <div className={styles.legendRow}>
                  <span>Less</span>
                  <div className={styles.legendScale}>
                    <i className={styles.level0} />
                    <i className={styles.level1} />
                    <i className={styles.level2} />
                    <i className={styles.level3} />
                    <i className={styles.level4} />
                  </div>
                  <span>More</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.missionPanel}>
            <p className={styles.heroKicker}>About This Site</p>
            <Heading as="h2">What This Workspace Is For</Heading>
            <p className={styles.heroSubtitle}>
              A personal technical workspace for capture, refinement, and publication.
            </p>
            <p className={styles.disclaimer}>
              Notes are personal understanding and may include mistakes, omissions, or outdated details.
            </p>
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
