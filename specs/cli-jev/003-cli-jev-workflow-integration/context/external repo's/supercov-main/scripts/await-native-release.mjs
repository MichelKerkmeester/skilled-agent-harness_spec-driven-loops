#!/usr/bin/env node
// Wait until every native package is READABLE, not merely published.
//
// The primary package declares an exact-version optional dependency on the
// platform package for the machine installing it. Publishing the natives first
// is necessary and not sufficient: npm's registry serves reads through a cache,
// and a version is visible to `npm publish` minutes before it is visible to
// `npm install`. On 0.0.50 the gap was four minutes --
// `@supercov/cli-linux-x64-gnu@0.0.50` logged as published at 21:58:26 and the
// registry document did not carry it until 22:02:36.
//
// Anyone installing in that window resolves the primary package, fails to find
// its binary, and -- because the dependency is optional -- installs anyway. The
// launcher then exits 1 with a clear message, which is a bad first run rather
// than a wrong measurement, but it is avoidable: hold the primary package back
// until a reader would find every one of them.
//
// Reads go straight to the registry with caches defeated. `npm view` keeps a
// cache of its own on top of the registry's, which is what made the gap look
// like a missing publish rather than a slow one.
//
// Usage: node scripts/await-native-release.mjs [directory] [--timeout-seconds N]
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const directory = resolve(args.find((a) => !a.startsWith("--")) ?? "native-release");
const flag = args.indexOf("--timeout-seconds");
const timeoutSeconds = flag === -1 ? 600 : Number(args[flag + 1]);
const releaseSet = JSON.parse(readFileSync(resolve(directory, "release-set.json"), "utf8"));

async function readable({ package: name, version }) {
  const url = `https://registry.npmjs.org/${name.replace("/", "%2F")}?t=${Date.now()}`;
  const response = await fetch(url, {
    headers: { "cache-control": "no-cache", pragma: "no-cache" },
  });
  if (!response.ok) return false;
  const document = await response.json();
  return Boolean(document.versions?.[version]);
}

const started = Date.now();
const waiting = new Map(releaseSet.packages.map((p) => [`${p.package}@${p.version}`, p]));
let delay = 2000;

while (waiting.size > 0) {
  for (const [specifier, entry] of [...waiting]) {
    let found = false;
    try {
      found = await readable(entry);
    } catch (error) {
      // A read that fails is a read that has not succeeded yet. The timeout is
      // what decides, not one bad response.
      console.log(`[native-release] ${specifier}: ${error.message}`);
    }
    if (found) {
      waiting.delete(specifier);
      console.log(
        `[native-release] ${specifier} readable after ${Math.round((Date.now() - started) / 1000)}s`,
      );
    }
  }
  if (waiting.size === 0) break;
  if (Date.now() - started > timeoutSeconds * 1000) {
    console.error(
      `[native-release] still not readable after ${timeoutSeconds}s: ${[...waiting.keys()].join(", ")}`,
    );
    console.error(
      "[native-release] the primary package was not published, so nothing resolves to a version whose binaries cannot be fetched.",
    );
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, delay));
  delay = Math.min(delay * 2, 15000);
}

console.log(
  `[native-release] all ${releaseSet.packages.length} platform packages readable in ${Math.round((Date.now() - started) / 1000)}s`,
);
