#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  chmodSync,
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { nativePackageFor } from "../bin/native.js";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"))).version;
const wheelDistribution = "supercov_cli";
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-pypi-wheel-"));
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { encoding: "utf8", ...options });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

try {
  const wheelDirectory = resolve(repository, "target", "wheels");
  const built = readdirSync(wheelDirectory).filter(
    (entry) => entry.startsWith(`${wheelDistribution}-${version}-`) && entry.endsWith(".whl"),
  );
  // A release job names the target whose wheel it just built; without one, a
  // developer's machine, the one wheel present is the one to install.
  const rustTarget = option("--target");
  const target = rustTarget
    ? registry.targets.find((entry) => entry.rustTarget === rustTarget)
    : undefined;
  if (rustTarget) assert(target, `no native target registered for ${rustTarget}`);
  const wheels = target
    ? built.filter((entry) => entry === `${wheelDistribution}-${version}-py3-none-${target.wheelPlatform}.whl`)
    : built;
  assert.equal(
    wheels.length,
    1,
    `expected one supercov-cli ${version} wheel${target ? ` for ${target.wheelPlatform}` : ""}, found ${built}`,
  );
  // pip installs a wheel only for a platform the host claims. A musl wheel is
  // built on a glibc runner, where its static binary runs but pip refuses the
  // tag; for such a wheel pip is told the platform outright and installs into
  // a directory, and the script it placed there is what runs. The host's own
  // target is the one the npm launcher would pick for this machine.
  const foreign = target !== undefined && nativePackageFor().packageName !== target.package;

  const environment = { ...process.env };
  delete environment.SUPERCOV_RUST_BINARY;

  // The wheel requires CPython 3.12 or newer, which `python3` need not be on a
  // developer machine; SUPERCOV_PYTHON names the interpreter to use. A venv
  // puts its executables under Scripts/ on Windows and bin/ everywhere else.
  const interpreter = process.env.SUPERCOV_PYTHON ?? "python3";
  const windows = process.platform === "win32";
  let scripts;
  if (foreign) {
    const installed = resolve(temporary, "installed");
    run(interpreter, [
      "-m",
      "pip",
      "install",
      "--disable-pip-version-check",
      "--platform",
      target.wheelPlatform,
      "--only-binary=:all:",
      "--target",
      installed,
      resolve(wheelDirectory, wheels[0]),
    ]);
    scripts = resolve(installed, "bin");
  } else {
    run(interpreter, ["-m", "venv", resolve(temporary, "venv")]);
    scripts = resolve(temporary, "venv", windows ? "Scripts" : "bin");
    const python = resolve(scripts, windows ? "python.exe" : "python");
    run(python, [
      "-m",
      "pip",
      "install",
      "--disable-pip-version-check",
      resolve(wheelDirectory, wheels[0]),
    ]);
  }

  const project = resolve(temporary, "project");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), project, {
    recursive: true,
  });
  const executable = resolve(scripts, windows ? "supercov.exe" : "supercov");
  if (!windows) chmodSync(executable, 0o755);
  const covered = run(executable, ["--", process.execPath, "--test"], {
    cwd: project,
    env: environment,
  });
  assert.match(covered.stdout, /\[coverage\] evidence:/);
  console.log(`[pypi-wheel] supercov ${version} installed and completed a real run`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
