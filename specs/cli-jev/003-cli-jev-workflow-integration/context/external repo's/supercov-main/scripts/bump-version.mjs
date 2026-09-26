#!/usr/bin/env node
// Move Supercov's own version across the five files that carry it.
//
// Nothing here bumps by substring. A dependency pin can share the release's
// prefix -- `ra_ap_syntax` is pinned at 0.0.349, which starts with 0.0.34 -- and
// a substring bump rewrites it to a version that does not exist. That fails
// nowhere locally and everywhere on the release runners, after the tag is
// already pushed.
//
// Nor does it bump by quoted occurrence any more. That worked while Supercov's
// version was one no dependency shared, and stopped at 1.0.0: the lockfile
// carries 31 third-party ranges like "^1.0.0" and two crates sit at 1.0.0
// exactly, so a quoted replacement across those files would rewrite other
// people's versions. Each file is edited where Supercov's version actually
// lives -- package.json at its own version and native-package pins, the two
// lockfiles only inside the entries we own -- and every file has a known number
// of references. Any other count means the world changed and the bump stops
// rather than guessing.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// One native package per platform the release publishes.
const NATIVE_PACKAGES = 8;

// Our own crates, as Cargo.lock names them.
const CRATES = ["supercov", "supercov-contracts", "supercov-engine"];

const escaped = (version) => version.replaceAll(".", "\\.");

/**
 * package.json, where Supercov's version is the top-level `version` and the pin
 * on each native package. It stopped being the only quoted version in the file
 * at 2.0.0, when the peer range `"vitest": ">=2.0.0"` began to end in the same
 * characters, so the file is walked line by line like the lockfile.
 */
export function replacePackageJson(text, from, to) {
  const version = new RegExp(`^ {2}"version": "${escaped(from)}",?$`);
  const pin = new RegExp(`^ {4}"@supercov/cli-[a-z0-9-]+": "${escaped(from)}",?$`);
  let count = 0;
  const lines = text.split("\n").map((line) => {
    if (!version.test(line) && !pin.test(line)) return line;
    count += 1;
    return line.replace(`"${from}"`, `"${to}"`);
  });
  return { text: lines.join("\n"), count };
}

/**
 * package-lock.json, where only some entries are ours: the root version, the
 * root package, its optional dependencies, and the `@supercov/*` packages. The
 * enclosing key decides, so this walks lines and tracks it, which also keeps
 * npm's exact formatting rather than reserialising the file.
 */
function replaceLockfile(text, from, to) {
  let key = null;
  let count = 0;
  const ours = () => key === "" || key?.startsWith("node_modules/@supercov/");
  const lines = text.split("\n").map((line, index) => {
    const entry = /^ {4}"(.*)": \{$/.exec(line);
    if (entry) key = entry[1];
    // The top-level version, before `packages` opens.
    const top = index < 5 && new RegExp(`^ {2}"version": "${from}",$`).test(line);
    const version = ours() && new RegExp(`^ {6}"version": "${from}",?$`).test(line);
    // A pin on one of our native packages is ours wherever it appears.
    const pin = new RegExp(`^ +"@supercov/[a-z0-9-]+": "${from}",?$`).test(line);
    if (!top && !version && !pin) return line;
    count += 1;
    return line.replace(`"${from}"`, `"${to}"`);
  });
  return { text: lines.join("\n"), count };
}

/** Cargo.lock, where our crates sit in `[[package]]` blocks beside everyone else's. */
export function replaceCargoLock(text, from, to) {
  let count = 0;
  let mine = false;
  const lines = text.split("\n").map((line) => {
    const name = /^name = "(.*)"$/.exec(line);
    if (name) mine = CRATES.includes(name[1]);
    if (!mine || line !== `version = "${from}"`) return line;
    count += 1;
    return `version = "${to}"`;
  });
  return { text: lines.join("\n"), count };
}

/**
 * Cargo.toml, where three versions are Supercov's own: the workspace's, and
 * the two workspace crates it pins by path. Every other quoted version in the
 * file belongs to somebody else, including any that happens to equal this
 * release's own -- `tree-sitter-kotlin-ng` sat at 1.1.0 when Supercov did, and
 * bumping it would have pinned a version of it that does not exist.
 */
export function replaceCargoToml(text, from, to) {
  let count = 0;
  const lines = text.split("\n").map((line) => {
    if (line === `version = "${from}"`) {
      count += 1;
      return `version = "${to}"`;
    }
    if (!CRATES.some((crate) => line.startsWith(`${crate} = { version = "=${from}"`))) {
      return line;
    }
    count += 1;
    return line.replace(`"=${from}"`, `"=${to}"`);
  });
  return { text: lines.join("\n"), count };
}

const FILES = [
  { name: "package.json", expected: 1 + NATIVE_PACKAGES, replace: replacePackageJson },
  { name: "package-lock.json", expected: 18, replace: replaceLockfile },
  { name: "Cargo.toml", expected: 3, replace: replaceCargoToml },
  { name: "Cargo.lock", expected: 3, replace: replaceCargoLock },
  { name: "plugins/supercov/.claude-plugin/plugin.json", expected: 1, replace: replacePackageJson },
  { name: "plugins/supercov/plugin.json", expected: 1, replace: replacePackageJson },
  { name: "plugins/supercov/.codex-plugin/plugin.json", expected: 1, replace: replacePackageJson },
];

export function bump(from, to, root = resolve(import.meta.dirname, "..")) {
  const planned = [];
  for (const { name, expected, replace } of FILES) {
    const path = resolve(root, name);
    const before = readFileSync(path, "utf8");
    const { text: after, count } = replace(before, from, to);
    if (count !== expected) {
      throw new Error(
        `${name}: ${count} reference(s) to ${from}, expected ${expected}; refusing to bump into a file that does not look as expected`,
      );
    }
    // Position by position, every quoted three-part version in the file. The
    // ones that moved must be exactly the ones we meant to move, and each must
    // have gone from this release's version to the next. This is what catches a
    // third-party pin sharing the release's prefix, and now also catches a
    // third-party version that happens to equal the release's own.
    // `"=1.0.0"` is how Cargo pins an exact version, and `ra_ap_syntax` is
    // pinned that way, so the optional `=` has to be part of the anchor.
    const pins = (value) => value.match(/(?<="=?)[0-9]+\.[0-9]+\.[0-9]+(?=")/g) ?? [];
    const pinsBefore = pins(before);
    const pinsAfter = pins(after);
    const moved = pinsBefore.filter(
      (pin, index) => pin !== pinsAfter[index],
    ).length;
    if (
      pinsAfter.length !== pinsBefore.length ||
      moved !== expected ||
      pinsBefore.some(
        (pin, index) =>
          pin !== pinsAfter[index] && !(pin === from && pinsAfter[index] === to),
      )
    ) {
      throw new Error(`${name}: a version other than Supercov's own would change; refusing`);
    }
    planned.push({ path, after, name, expected });
  }
  for (const { path, after } of planned) writeFileSync(path, after);

  // The lockfile records a tarball URL beside each native package's version,
  // and npm installs what the URL says. Those two drifted apart for twenty
  // releases -- the entries read 0.0.38 while the URLs still fetched 0.0.18 --
  // and every plain `npm ci` then installed binaries the launcher refused.
  // A quoted-version replacement cannot fix them, because the version in the
  // URL is not the one being bumped; name them after the release directly.
  const lockPath = resolve(root, "package-lock.json");
  const lock = readFileSync(lockPath, "utf8");
  const urls = /("resolved": "https:\/\/registry\.npmjs\.org\/@supercov\/(cli-[a-z0-9-]+)\/-\/\2)-[0-9.]+(\.tgz")/g;
  const matches = lock.match(urls) ?? [];
  if (matches.length !== NATIVE_PACKAGES) {
    throw new Error(
      `package-lock.json: ${matches.length} native tarball URL(s), expected ${NATIVE_PACKAGES}; refusing to bump`,
    );
  }
  writeFileSync(lockPath, lock.replace(urls, `$1-${to}$3`));

  return planned
    .map(({ name, expected }) => `${name}: ${expected} -> ${to}`)
    .concat(`package-lock.json: ${NATIVE_PACKAGES} native tarball URL(s) -> ${to}`);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [from, to] = process.argv.slice(2);
  const semver = /^[0-9]+\.[0-9]+\.[0-9]+$/;
  if (!semver.test(from ?? "") || !semver.test(to ?? "")) {
    console.error("usage: node scripts/bump-version.mjs <from> <to>   e.g. 0.0.35 0.0.36");
    process.exit(2);
  }
  try {
    for (const line of bump(from, to)) console.log(`[bump-version] ${line}`);
  } catch (error) {
    console.error(`[bump-version] ${error.message}`);
    process.exit(1);
  }
}
