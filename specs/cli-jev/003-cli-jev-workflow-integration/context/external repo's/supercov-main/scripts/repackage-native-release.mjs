#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { gzipSync, gunzipSync } from "node:zlib";
import {
  nativeChecksumName,
  nativePackageStem,
  nativeTarballName,
} from "./native-package-names.mjs";

const repository = resolve(import.meta.dirname, "..");
const source = resolve(process.argv[2] ?? "native-release");
const output = resolve(process.argv[3] ?? "native-release-repackaged");
assert.notEqual(source, output, "source and output directories must differ");
assert(!existsSync(output), `refusing to replace output directory: ${output}`);

const mainPackage = JSON.parse(
  readFileSync(resolve(repository, "package.json"), "utf8"),
);
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);

function digestBytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function filesUnder(directory) {
  const files = [];
  const pending = [directory];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = resolve(current, entry.name);
      if (entry.isDirectory()) pending.push(path);
      else if (entry.isFile()) files.push(path);
    }
  }
  return files;
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
    const size = Number.parseInt(string(124, 12).trim() || "0", 8);
    assert(Number.isSafeInteger(size), `invalid tar entry size for ${name}`);
    const type = string(156, 1) || "0";
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    assert(dataEnd <= archive.byteLength, `truncated tar entry: ${name}`);
    if (type === "0") entries.set(name, archive.subarray(dataStart, dataEnd));
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}

function run(program, arguments_, options = {}) {
  const result = spawnSync(program, arguments_, {
    cwd: repository,
    encoding: "utf8",
    ...options,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function legacyPackageFor(packageName) {
  const match = /^@supercov\/cli-(.+)$/.exec(packageName);
  assert(match, `cannot derive legacy native package from ${packageName}`);
  return `supercov-${match[1]}`;
}

const sourceChecksums = filesUnder(source)
  .filter(path => path.endsWith(".checksums.json"))
  .map(path => ({ path, value: JSON.parse(readFileSync(path, "utf8")) }));
mkdirSync(output, { recursive: true });

for (const target of registry.targets) {
  const matches = sourceChecksums.filter(
    entry => entry.value.rustTarget === target.rustTarget,
  );
  assert.equal(matches.length, 1, `expected one source artifact for ${target.rustTarget}`);
  const sourceEntry = matches[0];
  const checksum = sourceEntry.value;
  assert.equal(checksum.schemaVersion, 3, `${target.rustTarget} checksum schema`);
  assert(
    [target.package, legacyPackageFor(target.package)].includes(checksum.package),
    `${target.rustTarget} unexpected source package ${checksum.package}`,
  );
  assert.equal(checksum.version, mainPackage.version, `${target.rustTarget} version`);
  assert.equal(checksum.platform, target.platform, `${target.rustTarget} platform`);
  assert.equal(checksum.arch, target.arch, `${target.rustTarget} architecture`);
  assert.equal(checksum.libc, target.libc, `${target.rustTarget} libc`);
  assert.equal(checksum.executable, target.executable, `${target.rustTarget} executable`);

  const sourceTarball = resolve(dirname(sourceEntry.path), checksum.npmTarball.file);
  const sourceBytes = readFileSync(sourceTarball);
  assert.equal(sourceBytes.byteLength, checksum.npmTarball.bytes, `${target.rustTarget} source tarball size`);
  assert.equal(digestBytes(sourceBytes), checksum.npmTarball.sha256, `${target.rustTarget} source tarball digest`);
  const entries = tarEntries(sourceTarball);
  const sourceManifest = JSON.parse(
    entries.get("package/package.json")?.toString("utf8") ?? "null",
  );
  assert.equal(sourceManifest?.name, checksum.package, `${target.rustTarget} source manifest`);
  const binary = entries.get(`package/bin/${target.executable}`);
  assert(binary, `${target.rustTarget} source binary is missing`);
  assert.equal(binary.byteLength, checksum.binary.bytes, `${target.rustTarget} binary size`);
  assert.equal(digestBytes(binary), checksum.binary.sha256, `${target.rustTarget} binary digest`);

  // The wheel and the gem carry this same binary and are already named for
  // their platforms; they pass through once their records agree.
  for (const [kind, record] of [["wheel", checksum.wheel], ["gem", checksum.gem]]) {
    if (!record) continue;
    const bytes = readFileSync(resolve(dirname(sourceEntry.path), record.file));
    assert.equal(bytes.byteLength, record.bytes, `${target.rustTarget} ${kind} size`);
    assert.equal(digestBytes(bytes), record.sha256, `${target.rustTarget} ${kind} digest`);
    writeFileSync(resolve(output, record.file), bytes);
  }

  const temporary = mkdtempSync(resolve(tmpdir(), "supercov-native-repackage-"));
  try {
    const binaryPath = resolve(temporary, target.executable);
    writeFileSync(binaryPath, binary);
    if (target.platform !== "win32") chmodSync(binaryPath, 0o755);
    const packageRoot = run(process.execPath, [
      resolve(repository, "scripts/package-native.mjs"),
      "--target", target.rustTarget,
      "--binary", binaryPath,
      "--out", resolve(temporary, "package"),
    ]);
    const packOutput = JSON.parse(run("npm", [
      "pack",
      packageRoot,
      "--pack-destination", output,
      "--ignore-scripts",
      "--loglevel", "error",
      "--json",
    ]));
    assert.equal(packOutput.length, 1, `${target.rustTarget} npm pack result`);
    const tarballName = nativeTarballName(target.package, mainPackage.version);
    assert.equal(packOutput[0].filename, tarballName, `${target.rustTarget} tarball name`);
    const tarball = resolve(output, tarballName);
    const tarballBytes = readFileSync(tarball);
    writeFileSync(
      resolve(output, nativeChecksumName(target.package)),
      `${JSON.stringify({
        schemaVersion: 3,
        package: target.package,
        version: mainPackage.version,
        rustTarget: target.rustTarget,
        platform: target.platform,
        arch: target.arch,
        ...(target.libc ? { libc: target.libc } : {}),
        executable: target.executable,
        binary: {
          file: target.executable,
          bytes: binary.byteLength,
          gzipBytes: gzipSync(binary, { level: 9 }).byteLength,
          sha256: digestBytes(binary),
        },
        npmTarball: {
          file: tarballName,
          bytes: tarballBytes.byteLength,
          sha256: digestBytes(tarballBytes),
        },
        wheel: checksum.wheel,
        ...(checksum.gem ? { gem: checksum.gem } : {}),
        repackagedFrom: {
          package: checksum.package,
          npmTarballSha256: checksum.npmTarball.sha256,
        },
      }, null, 2)}\n`,
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
  console.log(
    `[native-release] ${checksum.package} -> ${target.package} (${nativePackageStem(target.package)})`,
  );
}
