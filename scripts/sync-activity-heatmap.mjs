import fs from "node:fs";
import https from "node:https";

const USER = "Neurocylcq";
const YEARS = [2026, 2025, 2024, 2023];

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode || 0, headers: res.headers, data });
        });
      })
      .on("error", reject);

    req.setTimeout(45000, () => {
      req.destroy(new Error("request timeout"));
    });
  });
}

async function getWithRetry(url, headers = {}, retries = 4) {
  let lastErr;
  for (let i = 0; i < retries; i += 1) {
    try {
      return await get(url, headers);
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 900 * (i + 1)));
    }
  }
  throw lastErr;
}

function monthRange(year) {
  const out = [];
  for (let month = 1; month <= 12; month += 1) {
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const toDate = new Date(Date.UTC(year, month, 0));
    const to = `${year}-${String(month).padStart(2, "0")}-${String(toDate.getUTCDate()).padStart(2, "0")}`;
    out.push({ from, to });
  }
  return out;
}

function parseGithub(svg) {
  const out = new Map();
  // Legacy format: count is present directly on each day cell.
  const legacy = /data-count="(\d+)"[^>]*data-date="([0-9\-]+)"/g;
  let match;
  while ((match = legacy.exec(svg)) !== null) {
    out.set(match[2], Number(match[1]));
  }

  if (out.size > 0) {
    return out;
  }

  // Current format: each day cell is followed by a <tool-tip> with natural-language count text.
  const modern = /data-date="([0-9]{4}-[0-9]{2}-[0-9]{2})"[\s\S]*?<tool-tip[^>]*>([^<]*)<\/tool-tip>/g;
  while ((match = modern.exec(svg)) !== null) {
    const date = match[1];
    const tip = match[2].trim();
    let value = 0;

    if (!/no contributions/i.test(tip)) {
      const num = tip.match(/(\d+)\s+contribution/i);
      if (num) {
        value = Number(num[1]);
      }
    }

    out.set(date, value);
  }

  return out;
}

function parseGitee(jsChunk) {
  const out = new Map();
  const re = /data-content=\\?'([^']+)'/g;
  let match;
  while ((match = re.exec(jsChunk)) !== null) {
    const normalized = match[1].replace(/\s+/g, "");
    const parsed = normalized.match(/(\d+)个贡献：([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    if (parsed) {
      out.set(parsed[2], Number(parsed[1]));
    }
  }
  return out;
}

function dateRange(year) {
  const days = [];
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const end = new Date(`${year}-12-31T00:00:00Z`);
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function toLevel(total, maxTotal) {
  if (!maxTotal || total <= 0) {
    return 0;
  }
  const ratio = total / maxTotal;
  if (ratio < 0.2) {
    return 1;
  }
  if (ratio < 0.45) {
    return 2;
  }
  if (ratio < 0.7) {
    return 3;
  }
  return 4;
}

async function main() {
  const baseHeaders = {
    "User-Agent": "Mozilla/5.0",
    Referer: `https://gitee.com/${USER}`,
    "X-Requested-With": "XMLHttpRequest",
  };

  const output = {};

  for (const year of YEARS) {
    const githubByDate = new Map();
    for (const { from, to } of monthRange(year)) {
      try {
        const ghResp = await getWithRetry(
          `https://github.com/users/${USER}/contributions?from=${from}&to=${to}`,
          { "User-Agent": "Mozilla/5.0" },
        );
        const monthData = parseGithub(ghResp.data);
        for (const [date, value] of monthData.entries()) {
          githubByDate.set(date, value);
        }
      } catch (err) {
        console.warn(`github month fetch failed ${from}..${to}:`, err.message || err);
      }
    }

    let giteeByDate = new Map();
    try {
      const gtResp = await getWithRetry(`https://gitee.com/${USER}/contribution_calendar?year=${year}`, baseHeaders);
      if (gtResp.status >= 400) {
        throw new Error(`HTTP ${gtResp.status}`);
      }
      giteeByDate = parseGitee(gtResp.data);
      if (giteeByDate.size === 0) {
        console.warn(`gitee parser returned 0 entries for ${year}`);
      }
    } catch (err) {
      console.warn(`gitee year fetch failed ${year}:`, err.message || err);
    }

    const days = dateRange(year).map((date) => {
      const github = githubByDate.get(date) || 0;
      const gitee = giteeByDate.get(date) || 0;
      return { date, github, gitee, total: github + gitee };
    });

    const maxTotal = days.reduce((mx, d) => Math.max(mx, d.total), 0);
    for (const day of days) {
      day.level = toLevel(day.total, maxTotal);
    }

    output[String(year)] = { maxTotal, days };
  }

  fs.writeFileSync("src/data/activity-heatmap.json", JSON.stringify(output));
  console.log("synced src/data/activity-heatmap.json", YEARS.join(", "));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
