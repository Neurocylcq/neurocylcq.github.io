import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const CONFIG = {
  MAIN_BRANCH: "master",
  DEPLOY_BRANCH: "gh-pages",
  BUILD_DIR: path.resolve(process.cwd(), "build"),
  DEPLOY_TARGET: "docs",
  WORK_TREE: ".gh-pages-temp",
};

// ------------------------------
// 基础工具函数
// ------------------------------
async function run(args, cwd) {
  console.log(`→ ${args.join(' ')}`);
  const proc = Bun.spawn(args, { stdout: "inherit", stderr: "inherit", cwd });
  await proc.exited;
  return proc.exitCode === 0;
}

async function runAndGetOutput(args, cwd) {
  const proc = Bun.spawn(args, { stdout: "pipe", stderr: "pipe", cwd });
  const text = await new Response(proc.stdout).text();
  await proc.exited;
  return text.trim();
}

async function getBranch() {
  const text = await runAndGetOutput(["git", "branch", "--show-current"]);
  return text.trim();
}

async function hasGitChanges() {
  const text = await runAndGetOutput(["git", "status", "--porcelain"]);
  return text.length > 0;
}

function dirExists(dir) {
  return fsSync.existsSync(dir) && fsSync.statSync(dir).isDirectory();
}

// ------------------------------
// 🔥 核心：纯 Bun 实现 - 计算文件哈希（精准判断内容）
// ------------------------------
async function getFileHash(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// ------------------------------
// 🔥 核心：纯 Bun 实现 - 递归遍历目录
// ------------------------------
async function walkDir(dir, base = dir) {
  const entries = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(base, fullPath);
    if (entry.isDirectory()) {
      entries.push(...await walkDir(fullPath, base));
    } else if (entry.isFile()) {
      entries.push(relPath);
    }
  }
  return entries;
}

// ------------------------------
// 🔥 核心：纯 Bun 实现 - 增量同步（复制变更+删除多余）
// ------------------------------
async function syncIncremental(src, dest) {
  if (!dirExists(dest)) await fs.mkdir(dest, { recursive: true });

  const srcFiles = new Set(await walkDir(src));
  const destFiles = new Set(await walkDir(dest));
  const changes = [];

  // 1. 删除目标多余文件
  for (const file of destFiles) {
    if (!srcFiles.has(file)) {
      const destPath = path.join(dest, file);
      await fs.unlink(destPath);
      changes.push(`🗑️  ${file}`);
    }
  }

  // 2. 同步新增/修改文件（哈希对比，只同步内容变化）
  for (const file of srcFiles) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const dir = path.dirname(destPath);

    if (!dirExists(dir)) await fs.mkdir(dir, { recursive: true });

    // 无文件 → 新增
    if (!fsSync.existsSync(destPath)) {
      await fs.copyFile(srcPath, destPath);
      changes.push(`➕  ${file}`);
      continue;
    }

    // 有文件 → 对比哈希，不同才覆盖
    const srcHash = await getFileHash(srcPath);
    const destHash = await getFileHash(destPath);
    if (srcHash !== destHash) {
      await fs.copyFile(srcPath, destPath);
      changes.push(`🔄  ${file}`);
    }
  }

  return changes;
}

// ==============================================
// 主流程
// ==============================================
console.log("===== One-Click Deployment =====\n");

// 1. 主分支检查
const branch = await getBranch();
console.log("Current branch:", branch);
if (branch !== CONFIG.MAIN_BRANCH) await run(["git", "checkout", CONFIG.MAIN_BRANCH]);

// 2. 检查并提交 master 分支修改
console.log("\n→ Checking for local changes...");
if (await hasGitChanges()) {
  console.log("✅ Committing changes to master...");
  await run(["git", "add", "."]);
  await run(["git", "commit", "-m", "chore: update source"]);
  await run(["git", "push"]);
} else {
  console.log("ℹ️ No changes → skip master commit");
}

// 3. 检查 build 目录，不存在则构建
console.log("\n→ Checking build directory...");
if (!dirExists(CONFIG.BUILD_DIR)) {
  console.log("🔨 Building project...");
  await run(["bun", "run", "build"]);
}
console.log("✅ Build ready");

// 4. 准备 gh-pages 工作树
console.log("\n→ Preparing deploy environment...");
try { await fs.rm(CONFIG.WORK_TREE, { recursive: true, force: true }); } catch {}
await run(["git", "worktree", "prune"]);
await run(["git", "worktree", "add", CONFIG.WORK_TREE, CONFIG.DEPLOY_BRANCH]);
await run(["git", "pull"], CONFIG.WORK_TREE);

// 5. 🔥 纯 Bun 增量同步 + 变更检查
const targetDir = path.join(CONFIG.WORK_TREE, CONFIG.DEPLOY_TARGET);
console.log("\n→ Checking incremental changes (content hash)...");

const changes = await syncIncremental(CONFIG.BUILD_DIR, targetDir);
if (changes.length > 0) {
  console.log(`✅ Found ${changes.length} changes, deploying...`);
  await run(["git", "add", "."], CONFIG.WORK_TREE);
  await run(["git", "commit", "-m", "deploy: update website"], CONFIG.WORK_TREE);
  await run(["git", "push"], CONFIG.WORK_TREE);
} else {
  console.log("ℹ️ NO CHANGES IN FILE CONTENT → SKIP DEPLOY");
}

// 6. 清理临时文件
console.log("\n→ Cleaning up...");
await run(["git", "worktree", "remove", "--force", CONFIG.WORK_TREE]);
try { await fs.rm(CONFIG.WORK_TREE, { recursive: true, force: true }); } catch {}

console.log("\n🎉 DEPLOY FINISHED!");