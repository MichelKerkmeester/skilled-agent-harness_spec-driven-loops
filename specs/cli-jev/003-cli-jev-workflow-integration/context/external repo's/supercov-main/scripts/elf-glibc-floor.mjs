#!/usr/bin/env node
// The glibc version a Linux binary demands, read from the ELF version
// requirement table (.gnu.version_r) -- what the dynamic loader will actually
// check, not what `strings` happens to find.
//
// A binary built on a hosted Ubuntu runner inherits that runner's glibc as its
// floor: the 0.0.36 Linux packages required GLIBC_2.39, which is Ubuntu 24.04,
// and so refused to start on Debian 12, Ubuntu 22.04, RHEL 9 and Amazon Linux
// 2023 -- the base images of most Node containers among them. The release now
// links against an older glibc on purpose, and this is how a check proves that
// each shipped binary really has the floor its wheel tag and its documentation
// claim, on every host including the macOS and Windows machines that cannot
// run the binary.
//
// Usage: node scripts/elf-glibc-floor.mjs <binary>            prints the floor
//        node scripts/elf-glibc-floor.mjs <binary> --max 2.28 exits 1 above it
import { readFileSync } from "node:fs";

export function glibcFloor(bytes) {
  const data = Buffer.from(bytes);
  if (data.readUInt32BE(0) !== 0x7f454c46) throw new Error("not an ELF file");
  if (data[4] !== 2) throw new Error("expected a 64-bit ELF file");
  const little = data[5] === 1;
  const u16 = (offset) => (little ? data.readUInt16LE(offset) : data.readUInt16BE(offset));
  const u32 = (offset) => (little ? data.readUInt32LE(offset) : data.readUInt32BE(offset));
  const u64 = (offset) =>
    Number(little ? data.readBigUInt64LE(offset) : data.readBigUInt64BE(offset));

  const sectionHeaders = u64(0x28);
  const sectionSize = u16(0x3a);
  const sectionCount = u16(0x3c);
  const namesIndex = u16(0x3e);
  const sections = [];
  for (let index = 0; index < sectionCount; index += 1) {
    const at = sectionHeaders + index * sectionSize;
    sections.push({
      name: u32(at),
      type: u32(at + 4),
      offset: u64(at + 24),
      size: u64(at + 32),
      link: u32(at + 40),
      info: u32(at + 44),
    });
  }
  const stringAt = (table, offset) => {
    const start = table.offset + offset;
    return data.subarray(start, data.indexOf(0, start)).toString("utf8");
  };
  const names = sections[namesIndex];
  const verneed = sections.find((section) => stringAt(names, section.name) === ".gnu.version_r");
  if (!verneed) return { libraries: {}, floor: null };
  const strings = sections[verneed.link];

  // Each Verneed entry names a library and chains Vernaux entries naming the
  // symbol versions required from it.
  const libraries = {};
  let at = verneed.offset;
  for (let entry = 0; entry < verneed.info; entry += 1) {
    const count = u16(at + 2);
    const library = stringAt(strings, u32(at + 4));
    let aux = at + u32(at + 8);
    const versions = [];
    for (let index = 0; index < count; index += 1) {
      versions.push(stringAt(strings, u32(aux + 8)));
      aux += u32(aux + 12);
    }
    libraries[library] = versions;
    const next = u32(at + 12);
    if (next === 0) break;
    at += next;
  }

  const glibc = Object.values(libraries)
    .flat()
    .filter((version) => version.startsWith("GLIBC_"))
    .map((version) => version.slice("GLIBC_".length));
  glibc.sort(compareVersions);
  return { libraries, floor: glibc.at(-1) ?? null };
}

export function compareVersions(left, right) {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [path, flag, maximum] = process.argv.slice(2);
  if (!path) {
    console.error("usage: node scripts/elf-glibc-floor.mjs <binary> [--max <version>]");
    process.exit(2);
  }
  const { libraries, floor } = glibcFloor(readFileSync(path));
  for (const [library, versions] of Object.entries(libraries)) {
    console.log(`${library}: ${versions.join(" ")}`);
  }
  console.log(`glibc floor: ${floor ?? "none (statically linked)"}`);
  if (flag === "--max" && floor !== null && compareVersions(floor, maximum) > 0) {
    console.error(`glibc floor ${floor} exceeds the permitted ${maximum}`);
    process.exit(1);
  }
}
