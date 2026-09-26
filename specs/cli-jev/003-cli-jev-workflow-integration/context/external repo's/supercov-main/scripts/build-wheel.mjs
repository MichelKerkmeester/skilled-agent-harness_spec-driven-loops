#!/usr/bin/env node
// Assemble the PyPI wheel for one target around the binary that target's
// release job already built and validated -- the same file the npm package and
// the gem carry, so every channel ships one binary per platform and a checksum
// proves it.
//
// A `bindings = "bin"` wheel is a zip holding the executable under
// `<distribution>-<version>.data/scripts/` and the metadata under `.dist-info/`;
// this writes exactly the layout maturin writes, with the metadata read from
// pyproject.toml so the two never disagree. maturin stays the build backend in
// pyproject.toml for anyone who installs from source. It is not used here
// because it would compile the binary a second time, and because a Linux wheel
// may only claim a manylinux tag its binary honours: before writing a wheel for
// a gnu target this reads the binary's glibc floor from its ELF version table
// and refuses a tag the binary does not satisfy.
//
// Usage: node scripts/build-wheel.mjs --target <rust target> --binary <path> --out <directory>
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";

import { compareVersions, glibcFloor } from "./elf-glibc-floor.mjs";

const repository = resolve(import.meta.dirname, "..");

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const rustTarget = option("--target");
const binaryPath = option("--binary");
const outDirectory = resolve(option("--out") ?? resolve(repository, "target", "wheels"));
if (!rustTarget || !binaryPath) {
  console.error("usage: node scripts/build-wheel.mjs --target <rust target> --binary <path> [--out <directory>]");
  process.exit(2);
}
const registry = JSON.parse(readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"));
const target = registry.targets.find((entry) => entry.rustTarget === rustTarget);
if (!target) throw new Error(`no native target registered for ${rustTarget}`);
if (!target.wheelPlatform) throw new Error(`${rustTarget} has no wheel platform tag`);

const version = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8")).version;
const project = readProjectTable(readFileSync(resolve(repository, "pyproject.toml"), "utf8"));
const binary = readFileSync(resolve(binaryPath));

// The tag is a promise about where the binary runs; keep it.
if (target.wheelPlatform.startsWith("manylinux_")) {
  const [, major, minor] = target.wheelPlatform.match(/^manylinux_(\d+)_(\d+)_/);
  const permitted = `${major}.${minor}`;
  const { floor } = glibcFloor(binary);
  if (floor !== null && compareVersions(floor, permitted) > 0) {
    throw new Error(
      `${rustTarget}: the binary requires glibc ${floor} but ${target.wheelPlatform} promises ${permitted}`,
    );
  }
} else if (target.wheelPlatform.startsWith("musllinux_")) {
  const { floor } = glibcFloor(binary);
  if (floor !== null) {
    throw new Error(`${rustTarget}: a musllinux wheel must not depend on glibc, this binary needs ${floor}`);
  }
}

const distribution = project.name.replaceAll("-", "_");
const prefix = `${distribution}-${version}`;
const tag = `py3-none-${target.wheelPlatform}`;
const files = [
  {
    path: `${prefix}.data/scripts/${target.executable}`,
    contents: binary,
    mode: 0o100755,
  },
  {
    path: `${prefix}.dist-info/METADATA`,
    contents: Buffer.from(metadata(project, version), "utf8"),
    mode: 0o100644,
  },
  {
    path: `${prefix}.dist-info/WHEEL`,
    contents: Buffer.from(
      `Wheel-Version: 1.0\nGenerator: supercov build-wheel (${version})\nRoot-Is-Purelib: false\nTag: ${tag}\n`,
      "utf8",
    ),
    mode: 0o100644,
  },
  {
    path: `${prefix}.dist-info/licenses/LICENSE`,
    contents: readFileSync(resolve(repository, "LICENSE")),
    mode: 0o100644,
  },
];
const record = files
  .map(({ path, contents }) => `${path},sha256=${urlsafeSha256(contents)},${contents.byteLength}`)
  .concat(`${prefix}.dist-info/RECORD,,`)
  .join("\n")
  .concat("\n");
files.push({
  path: `${prefix}.dist-info/RECORD`,
  contents: Buffer.from(record, "utf8"),
  mode: 0o100644,
});

mkdirSync(outDirectory, { recursive: true });
const output = resolve(outDirectory, `${prefix}-${tag}.whl`);
writeFileSync(output, zip(files));
console.log(`[wheel] built ${output}`);

// ---------------------------------------------------------------- metadata

// The `[project]` table of pyproject.toml: quoted strings, arrays of quoted
// strings, and the `[project.urls]` sub-table -- everything the wheel's
// METADATA needs, and nothing more, so a shape this does not read fails
// loudly instead of being silently dropped.
function readProjectTable(toml) {
  const values = {};
  const urls = {};
  let table = null;
  let pendingKey = null;
  let pendingItems = null;
  for (const raw of toml.split(/\r?\n/)) {
    const line = raw.trim();
    if (pendingKey !== null) {
      if (line.startsWith("]")) {
        (table === "project" ? values : urls)[pendingKey] = pendingItems;
        pendingKey = null;
        continue;
      }
      pendingItems.push(unquote(line.replace(/,$/, "")));
      continue;
    }
    if (line === "" || line.startsWith("#")) continue;
    const header = line.match(/^\[(.+)\]$/);
    if (header) {
      table = header[1];
      continue;
    }
    if (table !== "project" && table !== "project.urls") continue;
    const assignment = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.*)$/);
    if (!assignment) throw new Error(`pyproject.toml: cannot read line ${JSON.stringify(raw)}`);
    const [, key, value] = assignment;
    const into = table === "project" ? values : urls;
    if (value === "[") {
      pendingKey = key;
      pendingItems = [];
    } else if (value.startsWith("[")) {
      into[key] = value
        .slice(1, value.lastIndexOf("]"))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map(unquote);
    } else {
      into[key] = unquote(value);
    }
  }
  for (const key of ["name", "description", "readme", "requires-python", "license", "keywords", "classifiers"]) {
    if (values[key] === undefined) throw new Error(`pyproject.toml: [project] has no ${key}`);
  }
  return { ...values, urls };
}

function unquote(text) {
  const match = text.match(/^"(.*)"$/);
  if (!match) throw new Error(`pyproject.toml: expected a quoted string, found ${text}`);
  return match[1];
}

// The field order maturin writes, so the two METADATA files compare equal.
function metadata(project, version) {
  const lines = [`Metadata-Version: 2.4`, `Name: ${project.name}`, `Version: ${version}`];
  for (const classifier of project.classifiers) lines.push(`Classifier: ${classifier}`);
  lines.push(`License-File: LICENSE`);
  lines.push(`Summary: ${project.description}`);
  lines.push(`Keywords: ${project.keywords.join(",")}`);
  lines.push(`License-Expression: ${project.license}`);
  lines.push(`Requires-Python: ${project["requires-python"]}`);
  lines.push(`Description-Content-Type: text/markdown; charset=UTF-8; variant=GFM`);
  for (const [label, url] of Object.entries(project.urls)) lines.push(`Project-URL: ${label}, ${url}`);
  // maturin ends the body with one more newline than the README has; matching
  // it is what lets the two METADATA files compare byte for byte.
  const readme = readFileSync(resolve(repository, project.readme), "utf8");
  return `${lines.join("\n")}\n\n${readme}\n`;
}

function urlsafeSha256(contents) {
  return createHash("sha256").update(contents).digest("base64url");
}

// ---------------------------------------------------------------- the zip

// A plain zip writer: deflated entries, Unix modes in the external attributes
// so the script is executable once installed, and a fixed timestamp so the same
// inputs make the same bytes on every host. Node has no zip writer of its own,
// and reaching for a `zip` executable would tie this to whichever host has one.
function zip(entries) {
  const locals = [];
  const central = [];
  let offset = 0;
  for (const { path, contents, mode } of entries) {
    const name = Buffer.from(path, "utf8");
    const deflated = deflateRawSync(contents, { level: 9 });
    const checksum = crc32(contents);
    const local = Buffer.alloc(30 + name.byteLength);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed: 2.0, deflate
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(8, 8); // method: deflate
    local.writeUInt16LE(0, 10); // time: 00:00:00
    local.writeUInt16LE(0x21, 12); // date: 1980-01-01
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(deflated.byteLength, 18);
    local.writeUInt32LE(contents.byteLength, 22);
    local.writeUInt16LE(name.byteLength, 26);
    local.writeUInt16LE(0, 28);
    name.copy(local, 30);
    locals.push(local, deflated);

    const header = Buffer.alloc(46 + name.byteLength);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(0x031e, 4); // made by: Unix, zip spec 3.0
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(0, 8);
    header.writeUInt16LE(8, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt16LE(0x21, 14);
    header.writeUInt32LE(checksum, 16);
    header.writeUInt32LE(deflated.byteLength, 20);
    header.writeUInt32LE(contents.byteLength, 24);
    header.writeUInt16LE(name.byteLength, 28);
    header.writeUInt16LE(0, 30); // extra
    header.writeUInt16LE(0, 32); // comment
    header.writeUInt16LE(0, 34); // disk
    header.writeUInt16LE(0, 36); // internal attributes
    // External attributes carry the Unix mode in the high 16 bits. A plain
    // shift lands in a signed 32-bit int and comes out negative for any mode
    // with the regular-file bit set; `>>> 0` reads it back as unsigned.
    header.writeUInt32LE((mode << 16) >>> 0, 38);
    header.writeUInt32LE(offset, 42);
    name.copy(header, 46);
    central.push(header);
    offset += local.byteLength + deflated.byteLength;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.byteLength, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...locals, directory, end]);
}
