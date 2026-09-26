import assert from "node:assert/strict";

export function nativePackageStem(packageName) {
  assert.match(
    packageName,
    /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/,
    `invalid npm package name: ${packageName}`,
  );
  return packageName.startsWith("@")
    ? packageName.slice(1).replace("/", "-")
    : packageName;
}

export function nativeTarballName(packageName, version) {
  return `${nativePackageStem(packageName)}-${version}.tgz`;
}

export function nativeChecksumName(packageName) {
  return `${nativePackageStem(packageName)}.checksums.json`;
}
