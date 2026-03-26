import { $, fs, path } from 'bun';

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
const CONFIG = {
  MAIN_BRANCH: 'main',
  DEPLOY_BRANCH: 'gh-pages',
  BUILD_DIR: 'build',
  TARGET_DIR: 'doc',
};

// -----------------------------------------------------------------------------
// Git Utils
// -----------------------------------------------------------------------------
const git = {
  async exec(cmd) {
    console.log(`→ ${cmd}`);
    return await $`${cmd.split(' ')}`.quiet().nothrow();
  },

  async currentBranch() {
    return (await this.exec('git branch --show-current')).text().trim();
  },

  async hasChanges() {
    return (await this.exec('git status --porcelain')).text().trim().length > 0;
  },
};

// -----------------------------------------------------------------------------
// File Sync
// -----------------------------------------------------------------------------
async function exists(path) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function syncBuildToTarget() {
  const { BUILD_DIR, TARGET_DIR } = CONFIG;

  console.log(`\n→ Syncing ${BUILD_DIR} → ${TARGET_DIR}`);

  if (!await exists(BUILD_DIR)) {
    console.error('❌ Build folder missing');
    process.exit(1);
  }

  if (!await exists(TARGET_DIR)) {
    await fs.cp(BUILD_DIR, TARGET_DIR, { recursive: true });
    return;
  }

  const buildFiles = new Set(await fs.readdir(BUILD_DIR));
  const targetFiles = await fs.readdir(TARGET_DIR);

  for (const file of targetFiles) {
    if (!buildFiles.has(file)) {
      const p = path.join(TARGET_DIR, file);
      await fs.rm(p, { recursive: true, force: true });
    }
  }

  for (const file of buildFiles) {
    const src = path.join(BUILD_DIR, file);
    const dst = path.join(TARGET_DIR, file);
    await fs.cp(src, dst, { recursive: true, force: true, overwrite: true });
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
console.log('===== One-Click Deployment (GitHub Pages) =====\n');

const currentBranch = await git.currentBranch();
if (currentBranch !== CONFIG.MAIN_BRANCH) {
  await git.exec(`git checkout ${CONFIG.MAIN_BRANCH}`);
  console.log(`✅ Switched to ${CONFIG.MAIN_BRANCH}`);
}

const needsBuild = await git.hasChanges() || !await exists(CONFIG.BUILD_DIR);
if (needsBuild) {
  console.log('\n→ Building project...');
  await git.exec('bun run build');
} else {
  console.log('\n→ Using cached build');
}

if (await git.hasChanges()) {
  console.log('\n→ Committing source code...');
  await git.exec('git add .');
  await git.exec('git commit -m "chore: update source code"');
  await git.exec('git push');
}

await git.exec(`git checkout ${CONFIG.DEPLOY_BRANCH}`);
await syncBuildToTarget();

if (await git.hasChanges()) {
  console.log('\n→ Deploying...');
  await git.exec(`git add ${CONFIG.TARGET_DIR}`);
  await git.exec('git commit -m "deploy: update website"');
  await git.exec('git push');
} else {
  console.log('\n→ No changes to deploy');
}

await git.exec(`git checkout ${CONFIG.MAIN_BRANCH}`);

console.log('\n✅ Done!');