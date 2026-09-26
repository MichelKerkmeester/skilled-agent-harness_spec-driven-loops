#!/usr/bin/env node
// Gemini CLI installs an extension from a GitHub release, and it wants
// gemini-extension.json at the root of what it downloads. The repository root
// is the CLI, not an extension, and a release with many assets makes Gemini
// fall back to the source tarball, so the extension ships as its own archive.
// Gemini takes the first asset named for the user's platform (darwin., linux.,
// win32.), which is why the same archive goes up under three names.
//
// Everything in it is built from plugins/supercov at release time: the same
// skills, and the Claude Code commands rewritten as Gemini's TOML commands.
// Nothing is kept twice in the repository, so nothing can drift.
//
//   node scripts/gemini-extension.mjs <out-dir>
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const repository = resolve(import.meta.dirname, "..");
const plugin = resolve(repository, "plugins/supercov");
export const PLATFORMS = ["darwin", "linux", "win32"];

/** A Claude Code command file as a Gemini command: its description and prompt. */
export function geminiCommand(markdown) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(markdown.replace(/\r\n?/g, "\n"));
  if (!match) throw new Error("command file has no frontmatter");
  const [, frontmatter, body] = match;
  const description = /^description: (.*)$/m.exec(frontmatter)?.[1]?.trim();
  if (!description) throw new Error("command file has no description");
  const prompt = body.trim().replaceAll("$ARGUMENTS", "{{args}}");
  if (prompt.includes("'''")) throw new Error("command prompt cannot hold ''' in a TOML literal string");
  // A TOML basic string takes JSON's escapes; a multi-line literal takes the
  // prompt exactly as written.
  return `description = ${JSON.stringify(description)}\nprompt = '''\n${prompt}\n'''\n`;
}

export function buildExtension(directory) {
  const manifest = JSON.parse(readFileSync(resolve(plugin, "plugin.json"), "utf8"));
  rmSync(directory, { recursive: true, force: true });
  mkdirSync(resolve(directory, "commands/supercov"), { recursive: true });
  const extension = { name: manifest.name, version: manifest.version, description: manifest.description };
  writeFileSync(resolve(directory, "gemini-extension.json"), `${JSON.stringify(extension, null, 2)}\n`);
  cpSync(resolve(plugin, "skills"), resolve(directory, "skills"), { recursive: true });
  cpSync(resolve(repository, "LICENSE"), resolve(directory, "LICENSE"));
  // commands/supercov/coverage.toml is /supercov:coverage, the name the
  // command has in Claude Code.
  for (const name of readdirSync(resolve(plugin, "commands")).filter((file) => file.endsWith(".md"))) {
    const toml = geminiCommand(readFileSync(resolve(plugin, "commands", name), "utf8"));
    writeFileSync(resolve(directory, "commands/supercov", `${basename(name, ".md")}.toml`), toml);
  }
  return extension;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const out = process.argv[2];
  if (!out) {
    console.error("usage: node scripts/gemini-extension.mjs <out-dir>");
    process.exit(1);
  }
  const staging = resolve(out, "gemini-extension");
  const { name, version } = buildExtension(staging);
  for (const platform of PLATFORMS) {
    const archive = resolve(out, `${platform}.${name}.tar.gz`);
    // COPYFILE_DISABLE keeps macOS tar from adding ._ metadata files.
    const tar = spawnSync("tar", ["-czf", archive, "-C", staging, "."], {
      stdio: "inherit",
      env: { ...process.env, COPYFILE_DISABLE: "1" },
    });
    if (tar.status !== 0) process.exit(tar.status ?? 1);
    console.log(`[gemini-extension] ${basename(archive)} (${name} ${version})`);
  }
}
