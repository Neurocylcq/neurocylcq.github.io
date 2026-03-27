'use client';

import Link from 'next/link';
import { useMemo, useState, type CSSProperties } from 'react';
import heatmapData from '@/data/activity-heatmap.json';
import styles from './page.module.css';

const HEATMAP_COLUMNS = 26;
const MAX_YEAR_TABS = 4;
const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

const YEARS = (() => {
  const years = Object.keys(store)
    .map((year) => Number(year))
    .filter((year) => Number.isFinite(year) && year <= CURRENT_YEAR)
    .sort((a, b) => b - a)
    .slice(0, MAX_YEAR_TABS);

  if (years.length > 0) {
    return years;
  }

  return Array.from({ length: MAX_YEAR_TABS }, (_, i) => CURRENT_YEAR - i);
})();

type MonthMarker = {
  label: string;
  row: number;
};

function edgeAlpha(index: number, total: number): number {
  const rows = Math.max(1, Math.ceil(total / HEATMAP_COLUMNS));
  const col = index % HEATMAP_COLUMNS;
  const row = Math.floor(index / HEATMAP_COLUMNS);
  const cx = (HEATMAP_COLUMNS - 1) / 2;
  const cy = (rows - 1) / 2;
  const dx = cx === 0 ? 0 : Math.abs(col - cx) / cx;
  const dy = cy === 0 ? 0 : Math.abs(row - cy) / cy;
  const norm = Math.min(1, Math.sqrt((dx * dx + dy * dy) / 2));
  return Math.max(0.015, Math.pow(1 - norm, 1.75) * 0.92);
}

function levelBaseRgb(level: number): string {
  if (level <= 0) return '170, 190, 212';
  if (level === 1) return '169, 209, 246';
  if (level === 2) return '114, 175, 225';
  if (level === 3) return '63, 127, 184';
  return '31, 79, 125';
}

function getMonthMarkers(days: HeatDay[], totalRows: number): MonthMarker[] {
  const minGap = 2;
  const seenMonths = new Set<number>();
  const usedRows = new Set<number>();
  const markers: MonthMarker[] = [];

  for (let i = 0; i < days.length; i += 1) {
    const month = Number(days[i].date.slice(5, 7));
    if (!Number.isFinite(month) || month < 1 || month > 12 || seenMonths.has(month)) {
      continue;
    }

    seenMonths.add(month);
    const baseRow = Math.floor(i / HEATMAP_COLUMNS) + 1;
    let row = Math.max(1, Math.min(totalRows, baseRow));
    while (usedRows.has(row) && row < totalRows) {
      row += 1;
    }

    const prevRow = markers[markers.length - 1]?.row;
    if (prevRow && row - prevRow < minGap) {
      continue;
    }

    usedRows.add(row);
    markers.push({ label: MONTHS[month - 1], row });
  }

  return markers;
}

function formatTooltipDate(date: string): string {
  const [y, m, d] = date.split('-').map((v) => Number(v));
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const month = dt.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${month} ${d}`;
}

function tooltipLine(day: HeatDay): string {
  const humanDate = formatTooltipDate(day.date);
  if (day.total <= 0) {
    return `No contributions on ${humanDate}`;
  }

  if (day.gitee > 0 && day.github > 0) {
    return `${day.total} contributions on ${humanDate} | ${day.gitee} Gitee + ${day.github} GitHub`;
  }

  if (day.gitee > 0) {
    return `${day.total} contributions on ${humanDate} | ${day.gitee} Gitee`;
  }

  return `${day.total} contributions on ${humanDate} | ${day.github} GitHub`;
}

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(YEARS[0] ?? CURRENT_YEAR);
  const [hoveredDay, setHoveredDay] = useState<HeatDay | null>(null);

  const yearData = useMemo(() => store[String(activeYear)] ?? { maxTotal: 0, days: [] }, [activeYear]);
  const heatmapRows = useMemo(
    () => Math.max(1, Math.ceil(yearData.days.length / HEATMAP_COLUMNS)),
    [yearData.days.length],
  );
  const monthMarkers = useMemo(() => getMonthMarkers(yearData.days, heatmapRows), [yearData.days, heatmapRows]);

  return (
    <main className={styles.mainContent}>
      <section className={styles.heroBanner}>
        <div className={styles.container}>
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
                <h1 className={styles.heroTitle}>Neurocylcq</h1>
                <p className={styles.heroSubtitle}>
                  Builder and learner focused on Machine Learning, Computer Science, and practical engineering workflows.
                </p>
                <div className={styles.profileLinks}>
                  <a href="https://github.com/neurocylcq" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a href="https://gitee.com/neurocylcq" target="_blank" rel="noreferrer">
                    Gitee
                  </a>
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
                      className={year === activeYear ? styles.yearBtnActive : styles.yearBtn}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.heatmapBoard}>
                <div
                  className={styles.monthRail}
                  style={{ gridTemplateRows: `repeat(${heatmapRows}, minmax(0, 1fr))` }}
                  aria-hidden="true"
                >
                  {monthMarkers.map((month) => (
                    <span key={`${month.label}-${month.row}`} className={styles.monthLabel} style={{ gridRow: `${month.row} / span 1` }}>
                      {month.label}
                    </span>
                  ))}
                </div>
                <div className={styles.mergeHeatmap} aria-label={`Merged GitHub and Gitee activity for ${activeYear}`}>
                  {yearData.days.map((day, i) => {
                    const alpha = edgeAlpha(i, yearData.days.length);
                    const rgb = levelBaseRgb(day.level);
                    const style: CSSProperties = {
                      borderColor: `rgba(${rgb}, ${alpha.toFixed(3)})`,
                      backgroundColor: `rgba(${rgb}, ${day.level === 0 ? (alpha * 0.16).toFixed(3) : alpha.toFixed(3)})`,
                    };
                    return (
                      <button
                        key={day.date}
                        type="button"
                        className={`${styles.heatCell} ${styles[`level${day.level}` as keyof typeof styles]}`}
                        style={style}
                        aria-label={tooltipLine(day)}
                        onMouseOver={() => setHoveredDay(day)}
                        onFocus={() => setHoveredDay(day)}
                        onMouseOut={() => setHoveredDay((prev) => (prev?.date === day.date ? null : prev))}
                        onBlur={() => setHoveredDay((prev) => (prev?.date === day.date ? null : prev))}
                      />
                    );
                  })}
                </div>
              </div>

              <div className={styles.heatTooltip} role="status" aria-live="polite">
                <span className={styles.heatTooltipLine}>
                  {hoveredDay ? tooltipLine(hoveredDay) : 'Hover or focus any block to inspect activity details.'}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.missionPanel}>
          <p className={styles.heroKicker}>About This Site</p>
          <h2>What This Workspace Is For</h2>
          <p className={styles.heroSubtitle}>A personal technical workspace built for quick capture and quick reuse.</p>
          <p className={styles.disclaimer}>
            A large part of these notes has not been strictly validated. Treat them as working memory that may include
            errors, omissions, or outdated conclusions.
          </p>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h2>Scope</h2>
            <p>Machine Learning, Computer Science, and practical project engineering.</p>
          </article>
          <article className={styles.card}>
            <h2>Audience</h2>
            <p>Primarily future-self documentation, with optional public reuse.</p>
          </article>
          <article className={styles.card}>
            <h2>Constraint</h2>
            <p>Speed first in Docs, rigor first in curated outputs.</p>
          </article>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.dualGrid}>
          <div className={styles.panel}>
            <h2>How To Read Notes</h2>
            <p>Use confidence labels before reusing technical conclusions.</p>
            <div className={styles.statusTags}>
              <span className={styles.tagDraft}>Draft</span>
              <span className={styles.tagReviewed}>Reviewed</span>
              <span className={styles.tagArchived}>Archived</span>
            </div>
            <Link href="/docs">Open Docs</Link>
          </div>

          <div className={styles.panel}>
            <h2>Where To Go Next</h2>
            <p>Pick your entry based on task type.</p>
            <ul className={styles.quickList}>
              <li>
                <Link href="/apps">Frontend Apps</Link>
              </li>
              <li>
                <Link href="/docs">Docs Overview</Link>
              </li>
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
