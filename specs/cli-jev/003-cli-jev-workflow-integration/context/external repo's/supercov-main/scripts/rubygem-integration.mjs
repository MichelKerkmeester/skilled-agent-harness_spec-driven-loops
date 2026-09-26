#!/usr/bin/env node

import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"))).version;
const temporary = mkdtempSync(resolve(tmpdir(), "supercov-rubygem-"));

// `Gem::Platform.local` is versioned -- "arm64-darwin-22" -- while a published
// platform is the family, "arm64-darwin"; and a glibc Ruby calls itself
// "x86_64-linux", which RubyGems treats as the same platform as
// "x86_64-linux-gnu". A gem matches when the local platform is, or begins
// with, the family under either spelling.
function Gem_matches(platform, localPlatform) {
  const families = [platform, platform.replace(/-linux-gnu$/, "-linux")];
  return families.some(
    (family) => localPlatform === family || localPlatform.startsWith(`${family}-`),
  );
}

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
  const gemDirectory = resolve(repository, "target", "rubygems");
  const built = readdirSync(gemDirectory).filter(
    (entry) => entry.startsWith(`supercov-${version}-`) && entry.endsWith(".gem"),
  );
  // A release job names the target whose gem it just built, and RubyGems is
  // told that platform outright: the runner's Ruby may call itself
  // "x86_64-linux" while the gem says "x86_64-linux-gnu", and a musl gem is
  // built on a glibc runner, where its static binary still runs. Without a
  // target -- a developer's machine -- the gem for the local platform is the
  // one to install, and Ruby is asked which platform that is rather than
  // mapping Node's names onto RubyGems' own.
  const registry = JSON.parse(
    readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
  );
  const rustTarget = option("--target");
  const localPlatform = run("ruby", ["-e", "print Gem::Platform.local.to_s"]).stdout.trim();
  let platform;
  if (rustTarget) {
    const target = registry.targets.find((entry) => entry.rustTarget === rustTarget);
    assert(target?.gemPlatform, `${rustTarget} has no RubyGems platform`);
    platform = target.gemPlatform;
  } else {
    const matching = registry.targets
      .map((target) => target.gemPlatform)
      .filter(Boolean)
      .filter((candidate) => Gem_matches(candidate, localPlatform));
    assert.equal(
      matching.length,
      1,
      `expected exactly one registered gem platform for ${localPlatform}, found ${matching}`,
    );
    platform = matching[0];
  }
  const gems = built.filter((entry) => entry === `supercov-${version}-${platform}.gem`);
  assert.equal(gems.length, 1, `expected supercov-${version}-${platform}.gem, found ${built}`);

  const gemHome = resolve(temporary, "gem-home");
  const bindir = resolve(temporary, "bin");
  // On Windows both `gem` and the installed shim are batch files, which only a
  // command interpreter can start.
  const windows = process.platform === "win32";
  const shell = (command, args) =>
    windows
      ? [process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command, ...args]]
      : [command, args];
  run(...shell(windows ? "gem.cmd" : "gem", [
    "install",
    "--local",
    "--platform",
    platform,
    "--no-document",
    "--install-dir",
    gemHome,
    "--bindir",
    bindir,
    resolve(gemDirectory, gems[0]),
  ]));

  const project = resolve(temporary, "project");
  cpSync(resolve(repository, "tests/fixtures/no-build-node"), project, {
    recursive: true,
    filter: (source) => !source.endsWith("/.supercov"),
  });
  // RubyGems activates an executable only for a platform the host claims, and
  // it decides that when the shim runs, not when the gem installs. A musl gem
  // is built on a glibc runner, where its shim refuses even though its static
  // binary runs there; for such a gem the installed wrapper -- the file the
  // shim would have loaded -- is run directly, which still proves the packaged
  // wrapper and binary with a real coverage run.
  const activatable = Gem_matches(platform, localPlatform);
  const launch = activatable
    ? shell(resolve(bindir, windows ? "supercov.bat" : "supercov"), ["--", process.execPath, "--test"])
    : ["ruby", [resolve(gemHome, "gems", `supercov-${version}-${platform}`, "exe", "supercov"), "--", process.execPath, "--test"]];
  const covered = run(...launch, {
    cwd: project,
    env: { ...process.env, GEM_HOME: gemHome, GEM_PATH: gemHome },
  });
  assert.match(covered.stdout, /\[coverage\] evidence:/);
  console.log(`[rubygem] supercov ${version} installed and completed a real run`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
