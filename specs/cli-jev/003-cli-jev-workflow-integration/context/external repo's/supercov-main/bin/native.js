import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const mainPackage = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const packages = new Map([
  ["darwin-arm64", ["@supercov/cli-darwin-arm64", "supercov"]],
  ["darwin-x64", ["@supercov/cli-darwin-x64", "supercov"]],
  ["linux-arm64-gnu", ["@supercov/cli-linux-arm64-gnu", "supercov"]],
  ["linux-x64-gnu", ["@supercov/cli-linux-x64-gnu", "supercov"]],
  ["linux-arm64-musl", ["@supercov/cli-linux-arm64-musl", "supercov"]],
  ["linux-x64-musl", ["@supercov/cli-linux-x64-musl", "supercov"]],
  ["win32-arm64", ["@supercov/cli-win32-arm64", "supercov.exe"]],
  ["win32-x64", ["@supercov/cli-win32-x64", "supercov.exe"]],
]);

function linuxLibc() {
  const report = process.report?.getReport?.();
  return report?.header?.glibcVersionRuntime ? "gnu" : "musl";
}

export function nativePackageFor(
  platform = process.platform,
  arch = process.arch,
  libc = platform === "linux" ? linuxLibc() : undefined,
) {
  const key = [platform, arch, ...(libc ? [libc] : [])].join("-");
  const selected = packages.get(key);
  if (!selected) {
    throw new Error(
      `no native Supercov binary is published for platform=${platform} arch=${arch}${libc ? ` libc=${libc}` : ""}`,
    );
  }
  return { packageName: selected[0], executable: selected[1] };
}

function checkedExecutable(path, source) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(`${source} does not contain a regular Supercov executable at ${path}`);
  }
  return path;
}

export function resolveNativeBinary({ allowLocalDevelopment = true } = {}) {
  if (process.env.SUPERCOV_RUST_BINARY) {
    const override = resolve(process.env.SUPERCOV_RUST_BINARY);
    return checkedExecutable(override, "SUPERCOV_RUST_BINARY");
  }

  const { packageName, executable } = nativePackageFor();
  try {
    const packagePath = require.resolve(`${packageName}/package.json`);
    const platformPackage = JSON.parse(readFileSync(packagePath, "utf8"));
    if (platformPackage.name !== packageName) {
      throw new Error(
        `resolved ${packageName} but its manifest declares ${String(platformPackage.name)}`,
      );
    }
    if (platformPackage.version !== mainPackage.version) {
      throw new Error(
        `native package version mismatch: supercov is ${mainPackage.version} but ${packageName} is ${String(platformPackage.version)}`,
      );
    }
    return checkedExecutable(
      resolve(dirname(packagePath), "bin", executable),
      packageName,
    );
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "MODULE_NOT_FOUND")) {
      throw error;
    }
  }

  const local = resolve(root, "target", "debug", executable);
  if (allowLocalDevelopment && existsSync(resolve(root, "Cargo.toml")) && existsSync(local)) {
    return checkedExecutable(local, "local Rust development build");
  }
  throw new Error(
    `the optional native package ${packageName}@${mainPackage.version} is missing; reinstall supercov with optional dependencies enabled`,
  );
}
