const fs = require("fs");
const path = require("path");

const VALID_STATUS = new Set(["draft", "reviewed", "archived"]);

function walkMarkdownFiles(rootDir) {
  const out = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
        out.push(full);
      }
    }
  }
  return out;
}

function getFrontMatterStatus(source) {
  // Normalize BOM and Windows line endings to parse frontmatter consistently across platforms.
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return null;
  }
  const end = normalized.indexOf("\n---", 4);
  if (end < 0) {
    return null;
  }
  const frontmatter = normalized.slice(4, end);
  const match = frontmatter.match(/^status:\s*([a-zA-Z-]+)\s*$/m);
  return match ? match[1].toLowerCase() : null;
}

module.exports = function notesStatusValidator(context) {
  return {
    name: "notes-status-validator",
    async loadContent() {
      const docsDir = path.join(context.siteDir, "docs");
      const files = walkMarkdownFiles(docsDir);
      const missingStatus = [];
      const invalidStatus = [];

      for (const file of files) {
        const source = fs.readFileSync(file, "utf8");
        const status = getFrontMatterStatus(source);
        const rel = path.relative(context.siteDir, file);

        if (!status) {
          missingStatus.push(rel);
          continue;
        }

        if (!VALID_STATUS.has(status)) {
          invalidStatus.push(`${rel} => ${status}`);
        }
      }

      if (missingStatus.length === 0 && invalidStatus.length === 0) {
        return;
      }

      const lines = [
        "Notes status validation failed.",
        "Each file in docs/ must define frontmatter status: draft | reviewed | archived.",
      ];

      if (missingStatus.length > 0) {
        lines.push("", "Missing status:");
        missingStatus.forEach((file) => lines.push(`- ${file}`));
      }

      if (invalidStatus.length > 0) {
        lines.push("", "Invalid status values:");
        invalidStatus.forEach((line) => lines.push(`- ${line}`));
      }

      throw new Error(lines.join("\n"));
    },
  };
};
