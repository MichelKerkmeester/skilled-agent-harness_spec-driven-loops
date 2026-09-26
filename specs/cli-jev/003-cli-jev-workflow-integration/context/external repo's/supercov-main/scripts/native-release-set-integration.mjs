import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  nativeChecksumName,
  nativeTarballName,
} from "./native-package-names.mjs";

const repository = resolve(import.meta.dirname, "..");
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-native-release-set-"));
const version = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8")).version;
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);
const distribution = readFileSync(resolve(repository, "pyproject.toml"), "utf8")
  .match(/^name = "([^"]+)"$/m)[1]
  .replaceAll("-", "_");
function digest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
function verify(directory = temporary) {
  return spawnSync(
    process.execPath,
    [resolve(repository, "scripts/verify-native-release-set.mjs"), directory],
    { cwd: repository, encoding: "utf8" },
  );
}

try {
  for (const [index, target] of registry.targets.entries()) {
    const tarballName = nativeTarballName(target.package, version);
    const binary = resolve(temporary, `binary-${index}`, target.executable);
    mkdirSync(resolve(binary, ".."), { recursive: true });
    const bytes = Buffer.from(`deterministic native binary ${index}\n`);
    writeFileSync(binary, bytes);
    if (target.platform !== "win32") chmodSync(binary, 0o755);
    const staged = spawnSync(
      process.execPath,
      [
        resolve(repository, "scripts/package-native.mjs"),
        "--target", target.rustTarget,
        "--binary", binary,
        "--out", resolve(temporary, "staged"),
      ],
      { cwd: repository, encoding: "utf8" },
    );
    assert.equal(staged.status, 0, staged.stderr || staged.stdout);
    const packed = spawnSync(
      "npm",
      [
        "pack",
        resolve(temporary, "staged", target.package),
        "--pack-destination", temporary,
        "--ignore-scripts",
        "--loglevel", "error",
      ],
      { cwd: repository, encoding: "utf8" },
    );
    assert.equal(packed.status, 0, packed.stderr || packed.stdout);
    const tarball = resolve(temporary, tarballName);
    // The wheel and the gem stand in for the real ones: what the verifier
    // checks is that each is present, named for its platform, and unchanged.
    const stub = (name, contents) => {
      const path = resolve(temporary, name);
      writeFileSync(path, contents);
      return { file: name, bytes: contents.byteLength, sha256: digest(contents) };
    };
    const wheel = stub(
      `${distribution}-${version}-py3-none-${target.wheelPlatform}.whl`,
      Buffer.from(`deterministic wheel ${index}\n`),
    );
    const gem = target.gemPlatform
      ? stub(`supercov-${version}-${target.gemPlatform}.gem`, Buffer.from(`deterministic gem ${index}\n`))
      : undefined;
    writeFileSync(
      resolve(temporary, nativeChecksumName(target.package)),
      `${JSON.stringify({
        schemaVersion: 3,
        package: target.package,
        version,
        rustTarget: target.rustTarget,
        platform: target.platform,
        arch: target.arch,
        ...(target.libc ? { libc: target.libc } : {}),
        executable: target.executable,
        binary: {
          file: target.executable,
          bytes: bytes.byteLength,
          gzipBytes: 50 + index,
          sha256: digest(bytes),
        },
        npmTarball: {
          file: tarballName,
          bytes: statSync(tarball).size,
          sha256: digest(readFileSync(tarball)),
        },
        wheel,
        ...(gem ? { gem } : {}),
      }, null, 2)}\n`,
    );
  }
  const valid = verify();
  assert.equal(valid.status, 0, valid.stderr || valid.stdout);
  const releaseSet = JSON.parse(readFileSync(resolve(temporary, "release-set.json"), "utf8"));
  assert.equal(releaseSet.version, version);
  assert.equal(releaseSet.packages.length, registry.targets.length);

  const repackaged = resolve(temporary, "repackaged");
  const repackage = spawnSync(
    process.execPath,
    [
      resolve(repository, "scripts/repackage-native-release.mjs"),
      temporary,
      repackaged,
    ],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(repackage.status, 0, repackage.stderr || repackage.stdout);
  const validRepackaged = verify(repackaged);
  assert.equal(
    validRepackaged.status,
    0,
    validRepackaged.stderr || validRepackaged.stdout,
  );

  // A wheel that no longer matches its record is refused before the set is;
  // the first target is whole, so the failure names the second target's wheel.
  const damagedWheel = resolve(
    temporary,
    `${distribution}-${version}-py3-none-${registry.targets[1].wheelPlatform}.whl`,
  );
  const wheelBytes = readFileSync(damagedWheel);
  writeFileSync(damagedWheel, "damaged");
  const invalidWheel = verify();
  assert.notEqual(invalidWheel.status, 0);
  assert.match(invalidWheel.stderr, /wheel size|wheel digest/);
  writeFileSync(damagedWheel, wheelBytes);

  const damaged = resolve(
    temporary,
    nativeTarballName(registry.targets[0].package, version),
  );
  writeFileSync(damaged, "damaged");
  const invalid = verify();
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /tarball size|tarball digest/);
  console.log("[native-release] complete-set, wheel, gem and corruption gates passed");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
