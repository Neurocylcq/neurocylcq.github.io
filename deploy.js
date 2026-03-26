import fs from 'node:fs';
import path from 'node:path';

const CONFIG = {
  MAIN_BRANCH: "master",
  DEPLOY_BRANCH: "gh-pages",
  BUILD_DIR: path.resolve(process.cwd(), "build"),
  DEPLOY_TARGET: "docs",
  WORK_TREE: ".gh-pages-temp",
};

// 执行命令（数组传参，无空格BUG）
async function run(args, cwd) {
  console.log(`→ ${args.join(' ')}`);
  const proc = Bun.spawn(args, {
    stdout: "inherit",
    stderr: "inherit",
    cwd,
  });
  await proc.exited;
  return proc.exitCode === 0;
}

// 执行命令并获取输出（用于检查差异）
async function runAndGetOutput(args, cwd) {
  const proc = Bun.spawn(args, {
    stdout: "pipe",
    stderr: "pipe",
    cwd,
  });
  const text = await new Response(proc.stdout).text();
  await proc.exited;
  return text.trim();
}

// 获取当前分支
async function getBranch() {
  const proc = Bun.spawn(["git", "branch", "--show-current"], { stdout: "pipe" });
  const text = await new Response(proc.stdout).text();
  return text.trim();
}

// 检查Git是否有未提交的修改
async function hasGitChanges() {
  const text = await runAndGetOutput(["git", "status", "--porcelain"]);
  return text.length > 0;
}

// 🔥 新增：检查 build 和 gh-pages/docs 是否有文件差异（增量检查）
async function hasIncrementalChanges() {
  const targetPath = path.join(CONFIG.WORK_TREE, CONFIG.DEPLOY_TARGET);
  // rsync  dry-run 模式，只检查不修改，判断是否有变更
  const output = await runAndGetOutput([
    "rsync",
    "-avn",  // n = dry-run 模拟同步
    "--delete",
    `${CONFIG.BUILD_DIR}/`,
    `${targetPath}/`
  ]);
  // 输出包含文件列表则代表有变更
  return output.includes("files to consider") || output.split("\n").length > 5;
}

// 检查文件夹
function dirExists(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

// ==============================================
// 主流程
// ==============================================
console.log("===== One-Click Deployment =====\n");

// 1. 确保在主分支
const branch = await getBranch();
console.log("Current branch:", branch);
if (branch !== CONFIG.MAIN_BRANCH) await run(["git", "checkout", CONFIG.MAIN_BRANCH]);

// 2. 检查代码修改 → 有则提交master
console.log("\n→ Checking for local changes...");
const hasChanges = await hasGitChanges();
if (hasChanges) {
  console.log("✅ Found changes, committing to master...");
  await run(["git", "add", "."]);
  await run(["git", "commit", "-m", "chore: update source"]);
  await run(["git", "push"]);
} else {
  console.log("ℹ️ No local changes, skip commit");
}

// 3. 检查build目录 → 不存在则构建
console.log("\n→ Checking build directory...");
if (dirExists(CONFIG.BUILD_DIR)) {
  console.log("✅ Build exists, skip build");
} else {
  console.log("🔨 Building project...");
  await run(["bun", "run", "build"]);
  if (!dirExists(CONFIG.BUILD_DIR)) {
    console.error("❌ Build failed");
    process.exit(1);
  }
  console.log("✅ Build completed");
}

// 4. 准备gh-pages临时环境
console.log("\n→ Preparing deploy environment...");
try { fs.rmSync(CONFIG.WORK_TREE, { recursive: true, force: true }); } catch {}
await run(["git", "worktree", "prune"]);
await run(["git", "worktree", "add", CONFIG.WORK_TREE, CONFIG.DEPLOY_BRANCH]);
await run(["git", "pull"], CONFIG.WORK_TREE);

// -------------------------------------------------------------------------
// 🔥 核心：检查是否有增量变更，无变更直接跳过部署
// -------------------------------------------------------------------------
console.log("\n→ Checking incremental changes...");
const hasChangesToDeploy = await hasIncrementalChanges();
const targetPath = path.join(CONFIG.WORK_TREE, CONFIG.DEPLOY_TARGET);

if (hasChangesToDeploy) {
  console.log("✅ Found incremental changes, starting sync...");
  // 执行真实增量同步
  await run(["rsync", "-av", "--delete", `${CONFIG.BUILD_DIR}/`, `${targetPath}/`]);

  // 提交并推送gh-pages
  console.log("\n→ Deploying to gh-pages...");
  await run(["git", "add", "."], CONFIG.WORK_TREE);
  await run(["git", "commit", "-m", "deploy: update website"], CONFIG.WORK_TREE);
  await run(["git", "push"], CONFIG.WORK_TREE);
  console.log("✅ gh-pages updated successfully!");
} else {
  console.log("ℹ️ No incremental changes, skip deploy to gh-pages");
}

// 5. 强制清理临时文件
console.log("\n→ Cleaning up...");
await run(["git", "worktree", "remove", "--force", CONFIG.WORK_TREE]);
try { fs.rmSync(CONFIG.WORK_TREE, { recursive: true, force: true }); } catch {}

console.log("\n🎉 ALL DONE!");
console.log("📌 master branch: up to date");
console.log("📌 gh-pages branch: synced if changes found");