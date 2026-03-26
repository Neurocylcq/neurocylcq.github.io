import fs from 'node:fs';
import path from 'node:path';

const CONFIG = {
  MAIN_BRANCH: "master",
  DEPLOY_BRANCH: "gh-pages",
  BUILD_DIR: path.resolve(process.cwd(), "build"),
  DEPLOY_TARGET: "docs",
  WORK_TREE: ".gh-pages-temp",
};

// 执行命令
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

// 执行命令并获取输出
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

// 🔥 核心修复：基于文件内容校验和检查增量（忽略时间/权限）
async function hasIncrementalChanges() {
  const targetPath = path.join(CONFIG.WORK_TREE, CONFIG.DEPLOY_TARGET);
  const output = await runAndGetOutput([
    "rsync",
    "-avn",
    "--checksum", // ✅ 只校验文件内容，最关键修复
    "--delete",
    `${CONFIG.BUILD_DIR}/`,
    `${targetPath}/`
  ]);
  // 只有真实文件增删改才返回true
  const lines = output.split("\n").filter(line => 
    line && !line.includes("sending incremental file list") && !line.includes("total size")
  );
  return lines.length > 0;
}

// 检查文件夹
function dirExists(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

// ==============================================
// 主流程
// ==============================================
console.log("===== One-Click Deployment =====\n");

// 1. 主分支检查
const branch = await getBranch();
console.log("Current branch:", branch);
if (branch !== CONFIG.MAIN_BRANCH) await run(["git", "checkout", CONFIG.MAIN_BRANCH]);

// 2. 提交master修改
console.log("\n→ Checking for local changes...");
const hasChanges = await hasGitChanges();
if (hasChanges) {
  await run(["git", "add", "."]);
  await run(["git", "commit", "-m", "chore: update source"]);
  await run(["git", "push"]);
} else {
  console.log("ℹ️ No local changes, skip commit");
}

// 3. 构建检查
console.log("\n→ Checking build directory...");
if (!dirExists(CONFIG.BUILD_DIR)) {
  await run(["bun", "run", "build"]);
}
console.log("✅ Build ready");

// 4. 准备gh-pages工作树
console.log("\n→ Preparing deploy environment...");
try { fs.rmSync(CONFIG.WORK_TREE, { recursive: true, force: true }); } catch {}
await run(["git", "worktree", "prune"]);
await run(["git", "worktree", "add", CONFIG.WORK_TREE, CONFIG.DEPLOY_BRANCH]);
await run(["git", "pull"], CONFIG.WORK_TREE);

// 5. 🔥 真实增量检查（内容不变则跳过）
console.log("\n→ Checking incremental changes...");
const hasChangesToDeploy = await hasIncrementalChanges();
const targetPath = path.join(CONFIG.WORK_TREE, CONFIG.DEPLOY_TARGET);

if (hasChangesToDeploy) {
  console.log("✅ Real content changes found, syncing...");
  // 同步也用checksum，只同步内容变化的文件
  await run(["rsync", "-av", "--checksum", "--delete", `${CONFIG.BUILD_DIR}/`, `${targetPath}/`]);
  
  await run(["git", "add", "."], CONFIG.WORK_TREE);
  await run(["git", "commit", "-m", "deploy: update website"], CONFIG.WORK_TREE);
  await run(["git", "push"], CONFIG.WORK_TREE);
} else {
  console.log("ℹ️ No real content changes → SKIP gh-pages deploy");
}

// 6. 清理
console.log("\n→ Cleaning up...");
await run(["git", "worktree", "remove", "--force", CONFIG.WORK_TREE]);
try { fs.rmSync(CONFIG.WORK_TREE, { recursive: true, force: true }); } catch {}

console.log("\n🎉 ALL DONE!");