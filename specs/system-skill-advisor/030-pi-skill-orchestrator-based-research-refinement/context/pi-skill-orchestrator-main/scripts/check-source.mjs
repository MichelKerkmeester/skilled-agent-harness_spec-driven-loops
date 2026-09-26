import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const srcDir = resolve("src");
const files = readdirSync(srcDir)
  .filter((name) => name.endsWith(".ts"))
  .sort();

if (files.length === 0) {
  console.error("No TypeScript source files found in src/.");
  process.exit(1);
}

const forbidden = [
  { pattern: /\/home\/badgids/i, reason: "developer-specific home path" },
  { pattern: /\/mnt\/c\/users\/badgids/i, reason: "developer-specific Windows path" },
  { pattern: /Badgids-PC/i, reason: "developer-specific host name" },
  { pattern: /enableSkillCommands/, reason: "Pi global skill-command setting mutation" },
  { pattern: /settings\.json/, reason: "Pi global settings access" },
  { pattern: /(?:node:)?child_process/, reason: "subprocess execution" },
  { pattern: /\bfetch\s*\(/, reason: "network access" },
  { pattern: /from\s+["'](?:node:)?https?["']/, reason: "network access" },
  { pattern: /from\s+["'](?:node:)?net["']/, reason: "network access" },
  { pattern: /\bcompactCatalog\b/, reason: "obsolete eager-catalog option" },
];

let failed = false;
for (const name of files) {
  const file = resolve(srcDir, name);
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "--check", file],
    { stdio: "inherit" },
  );
  if (result.status !== 0) failed = true;

  const source = readFileSync(file, "utf8");
  for (const rule of forbidden) {
    if (!rule.pattern.test(source)) continue;
    console.error(`${name}: forbidden ${rule.reason} pattern matched: ${rule.pattern}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`Checked ${files.length} production TypeScript files and release safety invariants.`);
