import assert from "node:assert/strict";
import {
  chmodSync,
  cpSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { nativePackageFor } from "../bin/native.js";
import { assertionMapSmoke } from './assertion-map-js-smoke.mjs';
import { nativeChecksumName } from "./native-package-names.mjs";

const repository = resolve(import.meta.dirname, "..");

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function run(program, arguments_, options = {}) {
  const result = spawnSync(program, arguments_, { encoding: "utf8", ...options });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function runNpm(arguments_, options = {}) {
  if (process.platform !== "win32") return run("npm", arguments_, options);
  return run(
    process.env.ComSpec ?? "cmd.exe",
    ["/d", "/s", "/c", "npm.cmd", ...arguments_],
    options,
  );
}

if (process.argv.includes("--npm-preflight")) {
  process.stdout.write(`${runNpm(["--version"])}\n`);
  process.exit(0);
}

const temporary = mkdtempSync(resolve(tmpdir(), "supercov-native-package-"));

try {
  const targetRegistry = JSON.parse(
    readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
  );
  const selected = nativePackageFor();
  const requestedTarget = option("--target");
  const target = requestedTarget
    ? targetRegistry.targets.find(entry => entry.rustTarget === requestedTarget)
    : targetRegistry.targets.find(entry => entry.package === selected.packageName);
  assert(target, `runtime loader target ${selected.packageName} is absent from native-targets.json`);
  assert.equal(
    target.package,
    selected.packageName,
    `packed-install test must run on its native host (${target.package} requested, ${selected.packageName} selected)`,
  );
  for (const entry of targetRegistry.targets) {
    assert.deepEqual(
      nativePackageFor(entry.platform, entry.arch, entry.libc),
      { packageName: entry.package, executable: entry.executable },
    );
  }
  assert.throws(
    () => nativePackageFor("freebsd", "x64"),
    /no native Supercov binary is published/,
  );
  const packageRoot = run(process.execPath, [
    resolve(repository, "scripts/package-native.mjs"),
    "--target", target.rustTarget,
    "--binary", option("--binary") ?? resolve(repository, `target/release/${target.executable}`),
    "--out", resolve(temporary, "platform"),
  ]);
  const platformPack = JSON.parse(
    runNpm(["pack", "--ignore-scripts", "--json"], { cwd: packageRoot }),
  )[0].filename;
  const artifactMetadata = resolve(temporary, nativeChecksumName(target.package));
  run(process.execPath, [
    resolve(repository, "scripts/native-artifact-check.mjs"),
    "--target", target.rustTarget,
    "--binary", resolve(packageRoot, "bin", target.executable),
    "--tarball", resolve(packageRoot, platformPack),
    "--out", artifactMetadata,
  ]);
  const artifact = JSON.parse(readFileSync(artifactMetadata, "utf8"));
  assert.equal(artifact.schemaVersion, 3);
  assert.equal(artifact.package, target.package);
  assert.equal(
    artifact.version,
    JSON.parse(readFileSync(resolve(repository, "package.json"))).version,
  );

  const mainRoot = resolve(temporary, "main");
  // Stage exactly the primary package's allowlist, including assertion schema and agent instructions.
  const primary = JSON.parse(readFileSync(resolve(repository, "package.json"), "utf8"));
  for (const file of [...primary.files, "package.json", "LICENSE"])
    cpSync(resolve(repository, file), resolve(mainRoot, file), { recursive: true });
  const mainPack = JSON.parse(
    runNpm(["pack", "--ignore-scripts", "--json"], { cwd: mainRoot }),
  )[0].filename;

  const consumer = resolve(temporary, "consumer");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), consumer, { recursive: true });
  const consumerPackage = JSON.parse(readFileSync(resolve(consumer, "package.json"), "utf8"));
  consumerPackage.dependencies = {
    supercov: `file:${resolve(mainRoot, mainPack)}`,
    [target.package]: `file:${resolve(packageRoot, platformPack)}`,
  };
  writeFileSync(resolve(consumer, "package.json"), `${JSON.stringify(consumerPackage, null, 2)}\n`);
  runNpm(["install", "--ignore-scripts"], { cwd: consumer });
  // Invoke the JavaScript bin target that npm's generated shell/cmd shim
  // delegates to. The generated `.cmd` file is not a native executable and
  // cannot be passed directly to spawnSync on Windows.
  const executable = resolve(consumer, "node_modules/supercov/bin/supercov.js");
  const covered = spawnSync(process.execPath, [executable, "--", process.execPath, "--test"], {
    cwd: consumer,
    encoding: "utf8",
    env: process.env,
  });
  // Under `node --test` each file runs in a child whose stderr the runner
  // captures and reports on STDOUT, so a failing test -- or a preload that
  // failed to load in that child -- is visible only there. Show both streams.
  assert.equal(
    covered.status,
    0,
    `supercov exited ${covered.status}\n--- stderr ---\n${covered.stderr}\n--- stdout ---\n${covered.stdout}`,
  );
  assert.match(covered.stdout, /\[coverage\] evidence:/);
  // The gate captures both streams so a failure can report them. When a run is
  // being measured, its timing lines are the point of running it at all.
  if (process.env.SUPERCOV_PHASE_TIMING === "1") {
    process.stdout.write(covered.stdout);
    process.stderr.write(covered.stderr);
  }

  const consumerEnv = { ...process.env };
  delete consumerEnv.SUPERCOV_RUST_BINARY;
  for (const typescript of [false, true]) {
    assertionMapSmoke({ root: resolve(consumer, typescript ? 'map-ts' : 'map-js'), launcher: executable, env: consumerEnv, typescript });
  }
  for (const file of primary.files.filter(file => file.startsWith('docs/'))) {
    const topic = file.slice(5, -3);
    assert.equal(run(process.execPath, [executable, 'docs', topic], { cwd: consumer, env: consumerEnv }),
      asLaunchedFromNpm(readFileSync(resolve(consumer, 'node_modules/supercov', file), 'utf8')).trim());
  }
  const installedSchema = JSON.parse(readFileSync(resolve(consumer, 'node_modules/supercov/schemas/assertions.schema.json'), 'utf8'));
  assert.deepEqual(JSON.parse(run(process.execPath, [executable, 'assertions', 'schema'], { cwd: consumer, env: consumerEnv })), installedSchema);

  const installedPackage = resolve(consumer, "node_modules", target.package);
  const installedManifest = resolve(installedPackage, "package.json");
  const validManifest = readFileSync(installedManifest, "utf8");
  const wrongVersion = JSON.parse(validManifest);
  wrongVersion.version = "0.0.0-invalid";
  writeFileSync(installedManifest, `${JSON.stringify(wrongVersion, null, 2)}\n`);
  const mismatched = spawnSync(process.execPath, [executable, "help"], {
    cwd: consumer,
    encoding: "utf8",
    env: process.env,
  });
  assert.equal(mismatched.status, 1);
  assert.match(mismatched.stderr, /native package version mismatch/);
  writeFileSync(installedManifest, validManifest);

  const installedBinary = resolve(installedPackage, "bin", target.executable);
  unlinkSync(installedBinary);
  const missingBinary = spawnSync(process.execPath, [executable, "help"], {
    cwd: consumer,
    encoding: "utf8",
    env: process.env,
  });
  assert.equal(missingBinary.status, 1);
  assert.match(missingBinary.stderr, /does not contain a regular Supercov executable/);
  cpSync(resolve(packageRoot, "bin", target.executable), installedBinary);
  if (process.platform !== "win32") chmodSync(installedBinary, 0o755);

  const hiddenPackage = `${installedPackage}.missing`;
  renameSync(installedPackage, hiddenPackage);
  const missingPackage = spawnSync(process.execPath, [executable, "help"], {
    cwd: consumer,
    encoding: "utf8",
    env: process.env,
  });
  assert.equal(missingPackage.status, 1);
  assert.match(missingPackage.stderr, /optional native package .* is missing/);
  renameSync(hiddenPackage, installedPackage);
  console.log(`[native-package] packed install and execution passed with ${target.package}`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}

// `supercov docs` prints a guide's commands the way the reader started it; from
// npm a bare `supercov <args>` in a shell block or inline code gains `npx`.
// Recorded `text` blocks are printed as written.
function asLaunchedFromNpm(markdown) {
  let fence = null;
  return markdown.split(/(?<=\n)/).map((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('```')) {
      fence = fence === null ? ['sh', 'bash', 'shell', 'console'].includes(trimmed.replace(/^`+/, '').trim().split(/\s+/)[0]) : null;
      return line;
    }
    if (fence === true) return line.replace(/^(\s*(?:\$ )?)supercov /, '$1npx supercov ');
    if (fence === false) return line;
    return line.split('`').map((piece, index) => index % 2 === 1 && piece.startsWith('supercov ') ? `npx ${piece}` : piece).join('`');
  }).join('');
}
