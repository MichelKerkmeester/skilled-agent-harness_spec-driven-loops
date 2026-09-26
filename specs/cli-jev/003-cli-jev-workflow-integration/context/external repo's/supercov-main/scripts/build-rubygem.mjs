#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repository = resolve(import.meta.dirname, "..");
const version = JSON.parse(readFileSync(resolve(repository, "package.json"))).version;
const registry = JSON.parse(
  readFileSync(resolve(repository, "npm/native-targets.json"), "utf8"),
);

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

// A gem can be built for any target from any host -- the release matrix builds
// each binary on its own runner and packages it there -- so the platform and
// the executable's name come from the target being packaged, never from the
// machine doing the packaging.
const rustTarget = option("--target") ?? process.env.SUPERCOV_RUST_TARGET;
const target = rustTarget
  ? registry.targets.find((entry) => entry.rustTarget === rustTarget)
  : undefined;
if (rustTarget && !target) {
  throw new Error(`no native target registered for ${rustTarget}`);
}

function localGemPlatform() {
  if (process.platform === "darwin" && process.arch === "arm64") return "arm64-darwin";
  if (process.platform === "darwin" && process.arch === "x64") return "x86_64-darwin";
  throw new Error(
    "pass --target <rust target>, or set SUPERCOV_GEM_PLATFORM, when packaging outside macOS arm64/x64",
  );
}

const executableName = target?.executable ?? (process.platform === "win32" ? "supercov.exe" : "supercov");
const binary = resolve(
  option("--binary") ??
    process.env.SUPERCOV_RELEASE_BINARY ??
    resolve(repository, "target", "release", executableName),
);

function rubyString(value) {
  return JSON.stringify(value);
}

const platform =
  option("--platform") ??
  process.env.SUPERCOV_GEM_PLATFORM ??
  target?.gemPlatform ??
  localGemPlatform();
if (target && !target.gemPlatform && !option("--platform") && !process.env.SUPERCOV_GEM_PLATFORM) {
  // Ruby has no platform string for this target; the release set must skip it
  // rather than publish a gem whose platform lies about what it contains.
  throw new Error(`${rustTarget} has no RubyGems platform and cannot be packaged as a gem`);
}
const outputRoot = resolve(repository, "target", "rubygems");
const staging = resolve(outputRoot, `supercov-${version}-${platform}`);
const output = resolve(outputRoot, `supercov-${version}-${platform}.gem`);

rmSync(staging, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
mkdirSync(resolve(staging, "exe"), { recursive: true });
mkdirSync(resolve(staging, "lib"), { recursive: true });
mkdirSync(resolve(staging, "libexec"), { recursive: true });
copyFileSync(resolve(repository, "packaging", "rubygems", "exe", "supercov"), resolve(staging, "exe", "supercov"));
copyFileSync(binary, resolve(staging, "libexec", executableName));
copyFileSync(resolve(repository, "LICENSE"), resolve(staging, "LICENSE"));
copyFileSync(resolve(repository, "README.md"), resolve(staging, "README.md"));
chmodSync(resolve(staging, "exe", "supercov"), 0o755);
chmodSync(resolve(staging, "libexec", executableName), 0o755);
writeFileSync(
  resolve(staging, "lib", "supercov.rb"),
  `# frozen_string_literal: true\n\nmodule Supercov\n  VERSION = ${rubyString(version)}\nend\n`,
);

const gemspec = `Gem::Specification.new do |spec|
  spec.name = "supercov"
  spec.version = ${rubyString(version)}
  spec.platform = Gem::Platform.new(${rubyString(platform)})
  spec.summary = "Coverage, security and code quality for coding agents"
  spec.description = "Runs the project's existing tests, measures line, branch and MC/DC coverage, and points coding agents at untested code, security risks and code smells."
  spec.authors = ["Supercorp"]
  spec.email = ["hello@supercorp.ai"]
  spec.homepage = "https://github.com/supercorp-ai/supercov"
  spec.license = "MIT"
  spec.required_ruby_version = Gem::Requirement.new(">= 2.6")
  # The gnu and musl platform suffixes only resolve on RubyGems 3.3.22 and
  # newer; older resolvers see "x86_64-linux" and would install the wrong gem.
  spec.required_rubygems_version = Gem::Requirement.new(">= 3.3.22")
  spec.files = ["LICENSE", "README.md", "exe/supercov", "lib/supercov.rb", ${rubyString(`libexec/${executableName}`)}]
  spec.bindir = "exe"
  spec.executables = ["supercov"]
  spec.require_paths = ["lib"]
  spec.metadata = {
    "bug_tracker_uri" => "https://github.com/supercorp-ai/supercov/issues",
    "source_code_uri" => "https://github.com/supercorp-ai/supercov",
  }
end
`;
writeFileSync(resolve(staging, "supercov.gemspec"), gemspec);

mkdirSync(outputRoot, { recursive: true });
// On Windows `gem` is a batch file, which only a command interpreter can start.
const gemCommand =
  process.platform === "win32"
    ? [process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", "gem.cmd", "build", "supercov.gemspec", "--output", output]]
    : ["gem", ["build", "supercov.gemspec", "--output", output]];
const built = spawnSync(gemCommand[0], gemCommand[1], { cwd: staging, encoding: "utf8" });
assert.equal(built.status, 0, built.stderr || built.stdout);
console.log(`[rubygem] built ${output}`);
