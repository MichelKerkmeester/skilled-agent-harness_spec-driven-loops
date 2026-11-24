#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: BLADEBRO INSTALL WRAPPER
# ───────────────────────────────────────────────────────────────
# Operator-invoked install of the Bladebro CLI at the version this packet
# pins. It installs through npm with lifecycle scripts off, checks the JS
# launcher and the native binary against the SHA-256 digests recorded for that
# release and removes the install again when a digest does not match. Workflows must never call this implicitly:
# installing is always an explicit operator decision.
#
# Exit Codes:
#   0 - Installed and verified, or an existing install was left alone
#   1 - Invalid option, unsupported platform, missing prerequisite, failed
#       install, digest mismatch or failed verification
set -euo pipefail

readonly PINNED_VERSION="4.8.2"
# Digests of the v4.8.2 macOS native binaries, recorded from the release
# sidecars. A platform without a recorded digest is refused, because an
# unverifiable binary is the thing this wrapper exists to prevent.
readonly DIGEST_DARWIN_ARM64="7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8"
readonly DIGEST_DARWIN_X64="d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3"
# Digests of the two JS files the npm launcher runs before it hands over to the
# native binary: bin.js, and binary.cjs, which resolves the binary path. They
# are platform-independent, recorded from the installed 4.8.2 package.
readonly DIGEST_LAUNCHER_BIN_JS="14717680d950c7256756e904c9dfddd218e761b53cbc758f229583be0b45ae60"
readonly DIGEST_LAUNCHER_BINARY_CJS="b123650d1119d7bbb71022dffb28983713d4eabcc76ae0cc81d456806a0e2baa"

# The CLI contacts its release registry on --version unless told not to.
export BLADE_NO_UPDATE_CHECK=1

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

usage() {
  cat <<EOF
Bladebro CLI install wrapper

USAGE:
    install.sh [-h|--help]

WHAT THIS SCRIPT DOES:
    1. Gates on macOS arm64 or x64, the two platforms with a recorded digest.
       Every other platform is refused.
    2. No-ops when a bladebro binary is already on PATH, whatever its version.
    3. Runs: npm install -g --ignore-scripts bladebro@${PINNED_VERSION}
       No package lifecycle script runs before the digests are checked.
    4. Checks the SHA-256 of the native binary and of the JS launcher files
       (bin.js, binary.cjs) against the recorded digests. On a missing file or
       a mismatch it runs npm uninstall -g bladebro and exits 1.
    5. Verifies that bladebro --version reports ${PINNED_VERSION}. This is the
       first time any installed code runs.

NOTES:
    - Never runs npm update or bladebro -u. An update is a new install the
      operator approves separately.
    - Rollback: npm uninstall -g bladebro, then remove the data root that
      bladebro doctor reports, once no needed named session remains.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage >&2; exit 1 ;;
  esac
done

# Print the native binary path the npm launcher resolves, or nothing.
# Args: $1=platform package name, e.g. bladebro-darwin-arm64
#       $2=installed bladebro package directory
native_binary_path() {
  local platform_pkg="$1"
  local pkg_dir="$2"
  # Resolve the same way the launcher does, so a hoisted optional dependency
  # is found as well as a nested one.
  node -e 'try{const p=require("path");console.log(p.join(p.dirname(require.resolve(process.argv[1]+"/package.json",{paths:[process.argv[2]]})),"bladebro"))}catch{}' \
    "$platform_pkg" "$pkg_dir"
}

# Remove the install after a failed check and exit 1.
# Args: $1=reason printed before the uninstall
remove_install() {
  info "Removing the $1 install: npm uninstall -g bladebro"
  npm uninstall -g bladebro || err "Uninstall failed; run it by hand"
  exit 1
}

# Compare a file's SHA-256 with the recorded digest, removing the install on a
# missing file or a mismatch.
# Args: $1=file path, $2=expected digest, $3=label for messages
verify_digest() {
  local file="$1"
  local expected="$2"
  local label="$3"
  local actual
  if [ ! -f "$file" ]; then
    err "$label not found at $file"
    remove_install "incomplete"
  fi
  actual="$(shasum -a 256 "$file" | awk '{print $1}')"
  if [ "$actual" != "$expected" ]; then
    err "Digest mismatch for $label: $file"
    info "expected $expected"
    info "actual   $actual"
    remove_install "unverified"
  fi
  ok "$label digest matches the recorded ${PINNED_VERSION} value"
}

log "== mcp-bladebro installer (pin ${PINNED_VERSION}) =="

os="$(uname -s)"
arch="$(uname -m)"
if [ "$os" != "Darwin" ]; then
  err "Unsupported platform: $os. Only macOS has a recorded digest for ${PINNED_VERSION}."
  info "Install by hand only after recording that platform's digest from the release sidecar."
  exit 1
fi
case "$arch" in
  arm64|aarch64) platform_pkg="bladebro-darwin-arm64"; expected_digest="$DIGEST_DARWIN_ARM64" ;;
  x86_64)        platform_pkg="bladebro-darwin-x64";   expected_digest="$DIGEST_DARWIN_X64" ;;
  *) err "Unsupported architecture: $arch (supported: arm64, x86_64)"; exit 1 ;;
esac
ok "Platform: macOS $arch ($platform_pkg)"

# An existing install is never replaced, because replacing it is an update.
if command -v bladebro >/dev/null 2>&1; then
  version="$(bladebro --version 2>/dev/null | head -1 || true)"
  ok "bladebro already installed: $(command -v bladebro) (${version:-version unavailable})"
  case "$version" in
    *"v${PINNED_VERSION}"*) ;;
    *) warn "Installed version differs from the pin ${PINNED_VERSION}; this wrapper does not change it." ;;
  esac
  info "Nothing to do. Run scripts/doctor.sh to check the digest and the MCP server."
  exit 0
fi

command -v node >/dev/null 2>&1 || { err "node not found: Node.js 14 or later runs the npm launcher"; exit 1; }
command -v npm >/dev/null 2>&1 || { err "npm not found: required to install the package"; exit 1; }
command -v shasum >/dev/null 2>&1 || { err "shasum not found: required to check the digest"; exit 1; }

log "-- Installing --"
# Lifecycle scripts stay off so no package code runs before the digest checks.
# The pinned release declares none, and the native binary still arrives
# through its exact-pinned optional dependency.
info "npm install -g --ignore-scripts bladebro@${PINNED_VERSION}"
if ! npm install -g --ignore-scripts "bladebro@${PINNED_VERSION}"; then
  err "npm install failed; see the output above"
  exit 1
fi

# Locate the install through npm itself, not PATH: npm's global bin folder is
# not on PATH in every shell, and a PATH miss here must not read as a broken
# install that gets uninstalled.
pkg_dir="$(npm root -g)/bladebro"
launcher="$(npm prefix -g)/bin/bladebro"

# Every check runs before the first --version call below, the first point at
# which installed code executes.
log "-- Digest check --"
verify_digest "$pkg_dir/bin.js" "$DIGEST_LAUNCHER_BIN_JS" "Launcher bin.js"
verify_digest "$pkg_dir/binary.cjs" "$DIGEST_LAUNCHER_BINARY_CJS" "Launcher binary.cjs"
native="$(native_binary_path "$platform_pkg" "$pkg_dir")"
if [ -z "$native" ] || [ ! -f "$native" ]; then
  err "Native binary $platform_pkg not found. Optional dependencies must stay enabled."
  remove_install "incomplete"
fi
verify_digest "$native" "$expected_digest" "Native binary $platform_pkg"

log "-- Verification --"
version="$("$launcher" --version 2>&1 | head -1 || true)"
case "$version" in
  *"v${PINNED_VERSION}"*) ok "bladebro: $launcher ($version)" ;;
  *) err "bladebro --version did not report ${PINNED_VERSION}: ${version:-no output}"; exit 1 ;;
esac
if ! command -v bladebro >/dev/null 2>&1; then
  warn "$(dirname "$launcher") is not on PATH in this shell"
  info "Add it to your shell profile before calling bladebro by name."
fi

log ""
ok "Install complete. Run scripts/doctor.sh next, and re-check flags with 'bladebro help --json'."
exit 0
