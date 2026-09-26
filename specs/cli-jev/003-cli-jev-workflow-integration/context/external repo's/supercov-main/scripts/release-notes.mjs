#!/usr/bin/env node
// The changelog is the single source of a release's public notes. The publish
// workflow prints the tagged version's section into the GitHub release, and
// package preflight fails the release before it is tagged when the section is
// missing, so no version can ship without notes a reader can scan.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repository = resolve(import.meta.dirname, "..");

export function releaseNotes(version, changelog = readFileSync(resolve(repository, "CHANGELOG.md"), "utf8")) {
  // A Windows checkout arrives with CRLF line endings, and every consumer of
  // these notes -- the shape gate in preflight, the word count, the release
  // body -- reasons about lines. Normalise once here so no caller has to know.
  const lines = changelog.replace(/\r\n?/g, "\n").split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${version}`);
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  const body = (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
  return body === "" ? null : body;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const version =
    process.argv[2] ?? JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8")).version;
  const notes = releaseNotes(version);
  if (notes === null) {
    console.error(`CHANGELOG.md has no "## ${version}" section`);
    process.exit(1);
  }
  process.stdout.write(notes + "\n");
}
