#!/usr/bin/env node

// The agent skill and the docs' `supercov-example` blocks tell agents which
// commands to run. Nothing tied those commands to the CLI, so a renamed
// subcommand or flag (2.0.0 removed `supercov clean`) would have kept being
// recommended. This asks the binary itself: every subcommand word and flag in
// those commands must appear in the help for that command, and every
// `docs <topic>` must be a bundled guide.
//
// `--help` alone cannot decide it: `supercov quality --bogus --help` exits 0,
// because help short-circuits parsing. The help text is what names the real
// subcommands and flags, so that is what each command is checked against.
//
// It also holds the skill to the Agent Skills format, since the agents that
// load it validate the same rules.

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";

const repository = resolve(import.meta.dirname, "..");
const binary =
  process.env.SUPERCOV_RUST_BINARY ??
  resolve(repository, "target/debug", `supercov${process.platform === "win32" ? ".exe" : ""}`);

if (!existsSync(binary)) {
  console.error(`[agent-commands] ${binary} is missing; run cargo build -p supercov first`);
  process.exit(1);
}

const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

function supercov(args) {
  const result = spawnSync(binary, args, { cwd: repository, encoding: "utf8" });
  return { status: result.status, text: `${result.stdout}\n${result.stderr}` };
}

// --- Where commands are written ------------------------------------------

const skills = readdirSync(resolve(repository, "plugins"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((plugin) => {
    const root = resolve(repository, "plugins", plugin.name, "skills");
    return existsSync(root)
      ? readdirSync(root).map((skill) => resolve(root, skill, "SKILL.md"))
      : [];
  })
  .filter(existsSync);

// Plugin commands are Claude Code only, so they sit outside skills/ and are
// not held to the Agent Skills format, but the commands in them still are.
const commands = readdirSync(resolve(repository, "plugins"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((plugin) => {
    const root = resolve(repository, "plugins", plugin.name, "commands");
    return existsSync(root)
      ? readdirSync(root).filter((name) => name.endsWith(".md")).map((name) => resolve(root, name))
      : [];
  });

const docs = readdirSync(resolve(repository, "docs"))
  .filter((name) => name.endsWith(".md"))
  .map((name) => resolve(repository, "docs", name));

/** Each code span and each line of each fenced block, with its line number. */
function codeFragments(path, { examplesOnly }) {
  const fragments = [];
  const lines = readFileSync(path, "utf8").split("\n");
  let fence = null;
  lines.forEach((line, index) => {
    const opening = /^\s*(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence === null && opening) {
      fence = { marker: opening[1], keep: !examplesOnly || /\bsupercov-example\b/.test(opening[2]) };
      return;
    }
    if (fence !== null) {
      if (line.trim().startsWith(fence.marker)) fence = null;
      else if (fence.keep) fragments.push({ text: line, line: index + 1 });
      return;
    }
    if (examplesOnly) return;
    for (const span of line.matchAll(/`([^`]+)`/g)) fragments.push({ text: span[1], line: index + 1 });
  });
  return fragments;
}

// --- Reading a command ----------------------------------------------------

const STOP = new Set(["&&", "||", ";", "|", ">", ">>", "2>&1"]);
const COMMAND = /^(?:github\.com\/supercorp-ai\/supercov\/cmd\/)?supercov(?:@[\w.-]+)?$/;

/** Every Supercov invocation in a fragment, as the arguments after `supercov`. */
function invocations(text) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const found = [];
  tokens.forEach((token, index) => {
    if (!COMMAND.test(token)) return;
    const previous = tokens[index - 1];
    const starts =
      index === 0 ||
      previous === "npx" ||
      previous === "-y" ||
      STOP.has(previous) ||
      /^[A-Z_][A-Z0-9_]*=/.test(previous) ||
      (previous === "run" && tokens[index - 2] === "go");
    if (!starts) return;
    const args = [];
    for (const argument of tokens.slice(index + 1)) {
      if (STOP.has(argument) || argument.startsWith("#") || argument === "--") break;
      args.push(argument);
    }
    found.push(args);
  });
  return found;
}

/** A value, path, location, run id, placeholder or `$ARGUMENTS`, rather than a subcommand word. */
const isValue = (token) =>
  /[/.:<>$]/.test(token) || /^\d+$/.test(token) || token === "latest" || /^(run|q)_/.test(token);

const mentions = (help, word) =>
  new RegExp(`(^|[\\s\\[(|,])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[\\s\\]),|=])`, "m").test(help);

const topics = new Set(
  supercov(["docs"]).text.split("\n").map((line) => line.trim()).filter((line) => /^[a-z-]+$/.test(line)),
);
const helps = new Map();

function check(where, args) {
  const firstFlag = args.findIndex((token) => token.startsWith("-"));
  const positional = firstFlag === -1 ? args : args.slice(0, firstFlag);
  const flags = args
    .filter((token) => token.startsWith("-"))
    .map((flag) => flag.split("=")[0])
    .filter((flag) => !["--help", "-h"].includes(flag));
  const words = positional.filter((token) => !isValue(token));

  if (words[0] === "docs") {
    const topic = positional[1];
    if (topic && !isValue(topic) && !topics.has(topic)) fail(where, `\`docs ${topic}\` is not a bundled guide`);
    return;
  }

  // Help for exactly this command, with placeholders given a concrete value.
  const helpArgs = positional.length === 0 ? ["help"] : [...positional.map((token) => token.replace(/^<.*>$/, "x")), "--help"];
  const key = helpArgs.join(" ");
  if (!helps.has(key)) helps.set(key, supercov(helpArgs));
  const help = helps.get(key);
  if (help.status !== 0) {
    fail(where, `\`supercov ${args.join(" ")}\`: \`supercov ${key}\` exited ${help.status}: ${help.text.trim().split("\n")[0]}`);
    return;
  }
  for (const word of words) {
    if (!mentions(help.text, word)) fail(where, `\`supercov ${args.join(" ")}\`: "${word}" is not in \`supercov ${key}\``);
  }
  for (const flag of flags) {
    if (!mentions(help.text, flag)) fail(where, `\`supercov ${args.join(" ")}\`: ${flag} is not in \`supercov ${key}\``);
  }
}

let checked = 0;
for (const [paths, examplesOnly] of [[skills, false], [commands, false], [docs, true]]) {
  for (const path of paths) {
    for (const fragment of codeFragments(path, { examplesOnly })) {
      for (const args of invocations(fragment.text)) {
        checked += 1;
        check(`${relative(repository, path)}:${fragment.line}`, args);
      }
    }
  }
}

// --- The skill and plugin format ------------------------------------------

const version = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8")).version;
for (const skill of skills) {
  const where = relative(repository, skill);
  const text = readFileSync(skill, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) {
    fail(where, "missing YAML frontmatter");
    continue;
  }
  const [, frontmatter, body] = match;
  const field = (name) => new RegExp(`^${name}: (.*)$`, "m").exec(frontmatter)?.[1]?.trim();
  const name = field("name");
  const description = field("description");
  if (name !== basename(dirname(skill))) fail(where, `name "${name}" must match its directory`);
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) fail(where, `name "${name}" is not a valid skill name`);
  if (!description || description.length > 1024) fail(where, "description must be 1 to 1024 characters");
  if (/[<>]/.test(frontmatter)) fail(where, "frontmatter must not contain angle brackets");
  if (body.split("\n").length > 500) fail(where, "body must stay under 500 lines");
}

// Each plugin carries three manifests: Claude Code reads .claude-plugin/,
// Codex reads .codex-plugin/ for its listing, and Cursor and Copilot read the
// portable Agent Plugins plugin.json. All must name the release they ship
// with and describe the plugin the same way.
const PORTABLE_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const license = readFileSync(resolve(repository, "LICENSE"), "utf8");
const pluginDirectories = readdirSync(resolve(repository, "plugins"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => resolve(repository, "plugins", entry.name));
for (const directory of pluginDirectories) {
  const manifests = [".claude-plugin/plugin.json", "plugin.json", ".codex-plugin/plugin.json"].map((name) =>
    resolve(directory, name),
  );
  const [claude, portable, codex] = manifests.map((path) => {
    if (!existsSync(path)) {
      fail(relative(repository, path), "is missing");
      return null;
    }
    const plugin = JSON.parse(readFileSync(path, "utf8"));
    if (plugin.version !== version) {
      fail(relative(repository, path), `version ${plugin.version} must match package.json ${version}`);
    }
    return plugin;
  });
  if (!claude || !portable || !codex) continue;
  if (portable.$schema !== PORTABLE_SCHEMA) fail(relative(repository, manifests[1]), `$schema must be ${PORTABLE_SCHEMA}`);
  for (const [index, plugin] of [[1, portable], [2, codex]]) {
    for (const key of ["name", "description"]) {
      if (plugin[key] !== claude[key]) fail(relative(repository, manifests[index]), `${key} must match .claude-plugin/plugin.json`);
    }
  }
  const listing = codex.interface ?? {};
  for (const asset of new Set([listing.logo, listing.composerIcon, ...(listing.screenshots ?? [])].filter(Boolean))) {
    if (!existsSync(resolve(directory, asset))) fail(relative(repository, manifests[2]), `${asset} does not exist`);
  }
  // The plugin folder is copied on its own into each agent's plugin cache, so
  // it carries the repository's license with it.
  const copied = resolve(directory, "LICENSE");
  if (!existsSync(copied) || readFileSync(copied, "utf8") !== license) {
    fail(relative(repository, copied), "must be a copy of the repository's LICENSE");
  }
}

// Each agent finds the plugin through its own marketplace file: Claude Code
// through .claude-plugin/, Codex through .agents/plugins/, Cursor through
// .cursor-plugin/.
const marketplaces = [
  [".claude-plugin/marketplace.json", (plugin) => plugin.source, ".claude-plugin/plugin.json"],
  [".agents/plugins/marketplace.json", (plugin) => plugin.source.path, ".codex-plugin/plugin.json"],
  [".cursor-plugin/marketplace.json", (plugin) => plugin.source, "plugin.json"],
];
for (const [path, source, manifest] of marketplaces) {
  const marketplace = JSON.parse(readFileSync(resolve(repository, path), "utf8"));
  for (const plugin of marketplace.plugins) {
    const directory = resolve(repository, source(plugin));
    if (!existsSync(resolve(directory, manifest))) {
      fail(path, `${plugin.name} source ${source(plugin)} has no ${manifest}`);
      continue;
    }
    const described = JSON.parse(readFileSync(resolve(directory, manifest), "utf8"));
    if (plugin.name !== described.name) fail(path, `${plugin.name} must be named ${described.name}, as its manifest is`);
    if (plugin.description !== undefined && plugin.description !== described.description) {
      fail(path, `${plugin.name} description must match its manifest`);
    }
    if (plugin.logo && !existsSync(resolve(directory, plugin.logo))) fail(path, `${plugin.logo} does not exist`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  console.error(`[agent-commands] ${failures.length} problem(s) in ${checked} command(s)`);
  process.exit(1);
}
console.log(`[agent-commands] ${checked} command(s) across ${skills.length} skill(s), ${commands.length} plugin command(s) and the docs' examples match the CLI`);
