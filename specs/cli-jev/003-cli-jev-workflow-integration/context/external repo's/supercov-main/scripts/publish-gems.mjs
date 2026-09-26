#!/usr/bin/env node
// Push every gem in a directory that RubyGems does not already have, so a
// release that stopped halfway can be run again without failing on the gems it
// did publish. Credentials come from the environment the workflow prepared
// through RubyGems' trusted publishing; nothing here holds a token.
//
// Usage: node scripts/publish-gems.mjs <directory>
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8")).version;
// --dry-run reports what would be pushed and pushes nothing.
const dryRun = process.argv.includes("--dry-run");
const directory = resolve(process.argv.find((argument, index) => index >= 2 && !argument.startsWith("--")) ?? "native-release");

const gems = readdirSync(directory)
  .filter((entry) => entry.startsWith(`supercov-${version}-`) && entry.endsWith(".gem"))
  .sort();
assert(gems.length > 0, `no supercov ${version} gems in ${directory}`);

const response = await fetch("https://rubygems.org/api/v1/versions/supercov.json", {
  headers: { "user-agent": "supercov-release (https://github.com/supercorp-ai/supercov)" },
});
assert(response.ok, `rubygems.org answered ${response.status} for the version list`);
const published = new Set(
  (await response.json()).map((entry) => `${entry.number}-${entry.platform}`),
);

for (const gem of gems) {
  const platform = gem.slice(`supercov-${version}-`.length, -".gem".length);
  if (published.has(`${version}-${platform}`)) {
    console.log(`[rubygems] supercov ${version} (${platform}) already exists; skipped`);
    continue;
  }
  if (dryRun) {
    console.log(`[rubygems] would push supercov ${version} (${platform})`);
    continue;
  }
  const pushed = spawnSync("gem", ["push", resolve(directory, gem)], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  process.stdout.write(pushed.stdout);
  if (pushed.status !== 0) {
    process.stderr.write(pushed.stderr);
    throw new Error(`failed to push ${gem}`);
  }
  console.log(`[rubygems] pushed supercov ${version} (${platform})`);
}
