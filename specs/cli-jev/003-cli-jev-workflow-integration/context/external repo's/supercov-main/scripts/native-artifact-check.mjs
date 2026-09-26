import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { nativeTarballName } from "./native-package-names.mjs";
import { compareVersions, glibcFloor } from "./elf-glibc-floor.mjs";

const repository = resolve(import.meta.dirname, "..");
const mainPackage = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8"));
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);
// The wheel's distribution name is the PyPI project name with its hyphens
// normalised, read from where pip reads it.
const distribution = readFileSync(resolve(repository, "pyproject.toml"), "utf8")
  .match(/^name = "([^"]+)"$/m)[1]
  .replaceAll("-", "_");

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const rustTarget = option("--target");
const binary = option("--binary");
const tarball = option("--tarball");
// The wheel and gem directories are optional here so the packed-install gate
// can check an npm tarball on its own; the release-set verifier is where their
// absence is refused, since a release must carry all three.
const wheels = option("--wheels");
const gems = option("--gems");
const output = option("--out");
if (!rustTarget || !binary || !tarball || !output) {
  throw new Error(
    "usage: native-artifact-check.mjs --target <target> --binary <path> --tarball <path> [--wheels <directory>] [--gems <directory>] --out <json>",
  );
}
const target = registry.targets.find(candidate => candidate.rustTarget === rustTarget);
assert(target, `unknown native Rust target: ${rustTarget}`);
assert.equal(basename(binary), target.executable, `${rustTarget} executable name`);
assert.equal(
  basename(tarball),
  nativeTarballName(target.package, mainPackage.version),
  `${rustTarget} npm tarball name`,
);
assert(statSync(binary).isFile(), `binary is not a regular file: ${binary}`);
assert(statSync(tarball).isFile(), `tarball is not a regular file: ${tarball}`);
const help = spawnSync(resolve(binary), ["help"], { encoding: "utf8" });
assert.equal(help.status, 0, help.stderr || help.stdout);
const binaryBytes = readFileSync(binary);
const compressedBytes = gzipSync(binaryBytes, { level: 9 }).byteLength;
const compressedGate = 15 * 1024 * 1024;
assert(
  compressedBytes <= compressedGate,
  `${rustTarget} compressed binary is ${compressedBytes} bytes, above the ${compressedGate}-byte gate`,
);

// A Linux binary inherits the glibc of the machine that built it as its
// floor, and the 0.0.36 packages -- built on Ubuntu 24.04 -- demanded 2.39,
// which shut out Debian 12, Ubuntu 22.04, RHEL 9 and Amazon Linux 2023. The
// wheel platform tag names the floor this release promises; the binary has
// to honour it, and a musl binary has to be static.
if (target.platform === "linux") {
  const { floor } = glibcFloor(binaryBytes);
  if (target.libc === "musl") {
    assert.equal(floor, null, `${rustTarget} is a musl build but depends on glibc ${floor}`);
  } else {
    const [, major, minor] = target.wheelPlatform.match(/^manylinux_(\d+)_(\d+)_/);
    const promised = `${major}.${minor}`;
    assert(
      floor === null || compareVersions(floor, promised) <= 0,
      `${rustTarget} requires glibc ${floor}, above the ${promised} this release promises`,
    );
  }
}

function digest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}
function record(path) {
  assert(statSync(path).isFile(), `not a regular file: ${path}`);
  return { file: basename(path), bytes: statSync(path).size, sha256: digest(path) };
}

// Every channel ships this same binary; the wheel and the gem are checked in
// by name and digest so the release set can prove the whole set is present.
const wheel = wheels
  ? record(resolve(wheels, `${distribution}-${mainPackage.version}-py3-none-${target.wheelPlatform}.whl`))
  : undefined;
const gem =
  gems && target.gemPlatform
    ? record(resolve(gems, `supercov-${mainPackage.version}-${target.gemPlatform}.gem`))
    : undefined;

const result = {
  schemaVersion: 3,
  package: target.package,
  version: mainPackage.version,
  rustTarget,
  platform: target.platform,
  arch: target.arch,
  ...(target.libc ? { libc: target.libc } : {}),
  executable: target.executable,
  binary: {
    file: basename(binary),
    bytes: binaryBytes.byteLength,
    gzipBytes: compressedBytes,
    sha256: digest(binary),
  },
  npmTarball: record(tarball),
  ...(wheel ? { wheel } : {}),
  ...(gem ? { gem } : {}),
};
writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(
  `[native-artifact] ${rustTarget} binary=${result.binary.bytes} gzip=${compressedBytes} npm=${result.npmTarball.bytes}${wheel ? ` wheel=${wheel.bytes}` : ""}${gem ? ` gem=${gem.bytes}` : ""}`,
);
