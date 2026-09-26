import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import {
  nativeChecksumName,
  nativeTarballName,
} from "./native-package-names.mjs";

const repository = resolve(import.meta.dirname, "..");
const directory = resolve(process.argv[2] ?? "native-release");
const output = resolve(process.argv[3] ?? resolve(directory, "release-set.json"));
const mainPackage = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8"));
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);
const distribution = readFileSync(resolve(repository, "pyproject.toml"), "utf8")
  .match(/^name = "([^"]+)"$/m)[1]
  .replaceAll("-", "_");

assert.deepEqual(
  mainPackage.optionalDependencies,
  Object.fromEntries(
    registry.targets
      .map(target => [target.package, mainPackage.version])
      .sort(([left], [right]) => left.localeCompare(right)),
  ),
  "primary package optionalDependencies must contain every exact-version native package",
);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function tarEntries(path) {
  const archive = gunzipSync(readFileSync(path));
  const entries = new Map();
  for (let offset = 0; offset + 512 <= archive.byteLength;) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) break;
    const string = (start, length) => header
      .subarray(start, start + length)
      .toString("utf8")
      .replace(/\0.*$/s, "");
    const name = [string(345, 155), string(0, 100)].filter(Boolean).join("/");
    const sizeText = string(124, 12).trim();
    const size = Number.parseInt(sizeText || "0", 8);
    assert(Number.isSafeInteger(size), `invalid tar entry size for ${name}`);
    const mode = Number.parseInt(string(100, 8).trim() || "0", 8);
    const type = string(156, 1) || "0";
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    assert(dataEnd <= archive.byteLength, `truncated tar entry: ${name}`);
    if (type === "0") {
      assert(!entries.has(name), `duplicate tar entry: ${name}`);
      entries.set(name, { data: archive.subarray(dataStart, dataEnd), mode });
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}

const packages = [];
for (const target of registry.targets) {
  const tarballName = nativeTarballName(target.package, mainPackage.version);
  const tarball = resolve(directory, tarballName);
  const checksumPath = resolve(directory, nativeChecksumName(target.package));
  assert(statSync(tarball).isFile(), `missing native tarball: ${tarballName}`);
  assert(
    statSync(checksumPath).isFile(),
    `missing native checksum metadata: ${basename(checksumPath)}`,
  );
  const checksum = JSON.parse(readFileSync(checksumPath, "utf8"));
  assert.equal(checksum.schemaVersion, 3, `${target.package} checksum schema`);
  assert.equal(checksum.package, target.package, `${target.package} package identity`);
  assert.equal(checksum.version, mainPackage.version, `${target.package} package version`);
  assert.equal(checksum.rustTarget, target.rustTarget, `${target.package} Rust target`);
  assert.equal(checksum.platform, target.platform, `${target.package} platform`);
  assert.equal(checksum.arch, target.arch, `${target.package} architecture`);
  assert.equal(checksum.libc, target.libc, `${target.package} libc`);
  assert.equal(checksum.executable, target.executable, `${target.package} executable`);
  assert.equal(checksum.npmTarball.file, tarballName, `${target.package} tarball name`);
  assert.equal(checksum.npmTarball.bytes, statSync(tarball).size, `${target.package} tarball size`);
  assert.equal(checksum.npmTarball.sha256, sha256(tarball), `${target.package} tarball digest`);
  assert(
    checksum.binary.gzipBytes <= 15 * 1024 * 1024,
    `${target.package} exceeds the compressed binary gate`,
  );
  // The wheel and the gem carry this same binary for PyPI and RubyGems; the
  // set is complete only when each target's files are present as recorded.
  const recorded = (kind, record, name) => {
    assert.equal(record?.file, name, `${target.package} ${kind} name`);
    const path = resolve(directory, name);
    assert(statSync(path).isFile(), `missing ${kind}: ${name}`);
    assert.equal(statSync(path).size, record.bytes, `${target.package} ${kind} size`);
    assert.equal(sha256(path), record.sha256, `${target.package} ${kind} digest`);
  };
  recorded(
    "wheel",
    checksum.wheel,
    `${distribution}-${mainPackage.version}-py3-none-${target.wheelPlatform}.whl`,
  );
  if (target.gemPlatform) {
    recorded("gem", checksum.gem, `supercov-${mainPackage.version}-${target.gemPlatform}.gem`);
  } else {
    assert.equal(checksum.gem, undefined, `${target.package} has no RubyGems platform yet records a gem`);
  }
  const entries = tarEntries(tarball);
  const manifestEntry = entries.get("package/package.json");
  const binaryEntry = entries.get(`package/bin/${target.executable}`);
  assert(manifestEntry, `${target.package} tarball is missing package.json`);
  assert(binaryEntry, `${target.package} tarball is missing bin/${target.executable}`);
  const manifest = JSON.parse(manifestEntry.data.toString("utf8"));
  assert.equal(manifest.name, target.package, `${target.package} packed manifest name`);
  assert.equal(manifest.version, mainPackage.version, `${target.package} packed manifest version`);
  assert.deepEqual(manifest.os, [target.platform], `${target.package} packed OS selector`);
  assert.deepEqual(manifest.cpu, [target.arch], `${target.package} packed CPU selector`);
  assert.deepEqual(
    manifest.libc,
    target.libc ? [target.libc === "gnu" ? "glibc" : target.libc] : undefined,
    `${target.package} packed libc selector`,
  );
  assert.equal(binaryEntry.data.byteLength, checksum.binary.bytes, `${target.package} packed binary size`);
  assert.equal(sha256Bytes(binaryEntry.data), checksum.binary.sha256, `${target.package} packed binary digest`);
  if (target.platform !== "win32") {
    assert(binaryEntry.mode & 0o111, `${target.package} packed binary is not executable`);
  }
  packages.push({
    package: target.package,
    version: mainPackage.version,
    rustTarget: target.rustTarget,
    tarball: checksum.npmTarball,
    binary: checksum.binary,
    wheel: checksum.wheel,
    ...(checksum.gem ? { gem: checksum.gem } : {}),
  });
}

const releaseSet = {
  schemaVersion: 1,
  version: mainPackage.version,
  packages,
};
writeFileSync(output, `${JSON.stringify(releaseSet, null, 2)}\n`);
console.log(
  `[native-release] verified ${packages.length} exact-version platform artifacts, ${packages.length} wheels, ${packages.filter(entry => entry.gem).length} gems`,
);
