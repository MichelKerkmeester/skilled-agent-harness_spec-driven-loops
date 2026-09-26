import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const start = resolve(root, "README.md");
const requiredTopLevel = [
  resolve(root, "CONTRIBUTING.md"),
  resolve(root, "SECURITY.md"),
  resolve(root, "CHANGELOG.md"),
];

function markdownFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...markdownFiles(path));
    else if (extname(path).toLowerCase() === ".md") out.push(resolve(path));
  }
  return out;
}

const requiredDocs = markdownFiles(resolve(root, "docs"));
const required = new Set([...requiredTopLevel, ...requiredDocs]);
const visited = new Set();
const queue = [start];
const broken = [];

const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

while (queue.length) {
  const file = queue.shift();
  if (!file || visited.has(file)) continue;
  visited.add(file);
  const text = readFileSync(file, "utf8");
  const base = dirname(file);

  for (const match of text.matchAll(linkPattern)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:)/i.test(raw)) continue;
    const withoutAnchor = raw.split("#", 1)[0];
    if (!withoutAnchor) continue;
    const target = resolve(base, normalize(decodeURIComponent(withoutAnchor)));
    if (!existsSync(target)) {
      broken.push(`${file.slice(root.length + 1)} -> ${raw}`);
      continue;
    }
    if (extname(target).toLowerCase() === ".md") queue.push(target);
  }
}

for (const file of required) {
  if (!visited.has(file)) broken.push(`Not reachable from README.md: ${file.slice(root.length + 1)}`);
}

const readme = readFileSync(start, "utf8");
const requiredText = [
  "**Author/Developer:** [Alan Guice (Badgids)](https://github.com/badgids)",
  "**License:** [MIT License](LICENSE)",
  "## The lazy skill loader we all wanted, but were too lazy to make",
  "— All the skills, none of the bloat",
  "## Table of contents",
];
for (const text of requiredText) {
  if (!readme.includes(text)) broken.push(`README.md is missing required text: ${text}`);
}

const tokenSaverDoc = readFileSync(resolve(root, "docs", "token-saver.md"), "utf8");
for (const text of [
  "Recovery IDs do not survive a Pi restart, `/reload`, `/resume`, `/new`, or `/fork`.",
  "Session shutdown also restores Token Saver's deferred tools",
  "one error or non-routine result blocks effort reduction",
]) {
  if (!tokenSaverDoc.includes(text)) broken.push(`docs/token-saver.md is missing required safety text: ${text}`);
}

if (broken.length) {
  console.error("Documentation check failed:\n" + broken.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log(`Documentation links are valid. ${required.size} required documentation files are reachable from README.md.`);
