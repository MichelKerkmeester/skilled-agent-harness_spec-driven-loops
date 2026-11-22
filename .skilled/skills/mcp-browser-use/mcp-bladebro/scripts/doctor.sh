#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: BLADEBRO DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only diagnostics for the Bladebro CLI and MCP surfaces. It installs
# nothing, updates nothing and never prints cookie or credential values. Every
# bladebro call runs with BLADE_NO_UPDATE_CHECK=1, the binary's own switch, so
# no check reaches the release registry. The MCP probe speaks a minimal
# JSON-RPC handshake over stdio and closes the process again.
#
# Exit Codes:
#   0 - Healthy, or only warnings (including a missing CLI)
#   1 - The native binary digest does not match the pinned release, or the
#       registered Code Mode manual is missing from .utcp_config.json
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

readonly PINNED_VERSION="4.8.2"
readonly DIGEST_DARWIN_ARM64="7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8"
readonly DIGEST_DARWIN_X64="d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3"

export BLADE_NO_UPDATE_CHECK=1
export BLADE_PLAIN=1

_c_red=$'\033[31m'; _c_grn=$'\033[32m'; _c_ylw=$'\033[33m'; _c_dim=$'\033[2m'; _c_rst=$'\033[0m'
log()  { printf '%s\n' "$*"; }
info() { printf '%s%s%s\n' "$_c_dim" "$*" "$_c_rst"; }
ok()   { printf '%s✓ %s%s\n' "$_c_grn" "$*" "$_c_rst"; }
warn() { printf '%s! %s%s\n' "$_c_ylw" "$*" "$_c_rst" >&2; }
err()  { printf '%s✗ %s%s\n' "$_c_red" "$*" "$_c_rst" >&2; }

case "${1:-}" in
  "") ;;
  -h|--help)
    log "Usage: doctor.sh   Read-only Bladebro diagnostics; takes no options."
    exit 0 ;;
  *) err "Unknown option: $1"; exit 1 ;;
esac

status=0

log "== mcp-bladebro doctor (read-only) =="

os="$(uname -s)"
arch="$(uname -m)"
platform_pkg=""
expected_digest=""
case "$os/$arch" in
  Darwin/arm64|Darwin/aarch64) platform_pkg="bladebro-darwin-arm64"; expected_digest="$DIGEST_DARWIN_ARM64" ;;
  Darwin/x86_64)               platform_pkg="bladebro-darwin-x64";   expected_digest="$DIGEST_DARWIN_X64" ;;
esac
if [ -n "$platform_pkg" ]; then
  ok "Platform: macOS $arch ($platform_pkg)"
else
  warn "Platform: $os $arch has no recorded ${PINNED_VERSION} digest; the digest check is skipped"
fi

log "-- bladebro CLI --"
if ! command -v bladebro >/dev/null 2>&1; then
  warn "bladebro not on PATH"
  info "Install (operator yes required): bash scripts/install.sh"
  log ""
  log "Doctor is read-only. For setup, see install.sh and INSTALL-GUIDE.md."
  exit 0
fi
version="$(bladebro --version 2>/dev/null | head -1 || true)"
case "$version" in
  *"v${PINNED_VERSION}"*) ok "bladebro: $(command -v bladebro) ($version)" ;;
  "") warn "bladebro: $(command -v bladebro) (version unavailable)" ;;
  *)  warn "bladebro: $(command -v bladebro) ($version) differs from the pin ${PINNED_VERSION}; re-verify flags with 'bladebro help --json'" ;;
esac

# The digest is recorded for the pinned release only, so a version drift makes
# a mismatch expected rather than suspicious.
log "-- Native binary digest --"
if [ -z "$platform_pkg" ]; then
  info "Skipped: no recorded digest for this platform"
elif ! command -v shasum >/dev/null 2>&1; then
  warn "shasum not found; cannot check the digest"
else
  launcher="$(command -v bladebro)"
  pkg_dir="$(cd "$(dirname "$(readlink -f "$launcher")")" && pwd)"
  native="$(node -e 'try{const p=require("path");console.log(p.join(p.dirname(require.resolve(process.argv[1]+"/package.json",{paths:[process.argv[2]]})),"bladebro"))}catch{}' "$platform_pkg" "$pkg_dir" 2>/dev/null || true)"
  if [ -z "$native" ] || [ ! -f "$native" ]; then
    warn "Native binary $platform_pkg not found beside $pkg_dir (standalone install, or optional dependencies disabled)"
  else
    actual_digest="$(shasum -a 256 "$native" | awk '{print $1}')"
    if [ "$actual_digest" = "$expected_digest" ]; then
      ok "Digest matches the recorded ${PINNED_VERSION} value"
    else
      case "$version" in
        *"v${PINNED_VERSION}"*)
          err "Digest mismatch on the pinned ${PINNED_VERSION} binary: $native"
          info "expected $expected_digest"
          info "actual   $actual_digest"
          status=1 ;;
        *) warn "Digest differs from the ${PINNED_VERSION} record, as expected for $version; record that release's digest before relying on it" ;;
      esac
    fi
  fi
fi

log "-- bladebro doctor (update check off) --"
doctor_out="$(bladebro doctor 2>&1 || true)"
summary="$(printf '%s\n' "$doctor_out" | grep -E 'PASSED|FAILED' | head -1 || true)"
if [ -n "$summary" ]; then
  info "${summary#"${summary%%[![:space:]]*}"}"
  info "The two update-check advisories are expected here: the check is switched off."
  printf '%s\n' "$doctor_out" | grep -E '^[[:space:]]*(✗|⚠)' \
    | grep -vE 'PASSED|FAILED|BLADE_NO_UPDATE_CHECK|could not check for updates' | head -10 || true
else
  warn "bladebro doctor gave no summary line"
  printf '%s\n' "$doctor_out" | head -5 >&2
fi

# Spawn `bladebro mcp`, send initialize and tools/list over stdio, then close
# stdin. A watchdog kills the child if it survives EOF, so the probe never
# hangs and never leaves a process behind.
log "-- MCP handshake (stdio probe) --"
probe_out="$(mktemp)"; probe_err="$(mktemp)"
trap 'rm -f "$probe_out" "$probe_err"' EXIT

REQ_INIT='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"mcp-bladebro-doctor","version":"1.0.0"}}}'
REQ_NOTE='{"jsonrpc":"2.0","method":"notifications/initialized"}'
REQ_LIST='{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

(
  { printf '%s\n' "$REQ_INIT"; sleep 1; printf '%s\n' "$REQ_NOTE" "$REQ_LIST"; sleep 3; } \
    | bladebro mcp >"$probe_out" 2>"$probe_err"
) &
probe_pid=$!
waited=0
while kill -0 "$probe_pid" 2>/dev/null && [ "$waited" -lt 30 ]; do
  sleep 0.5
  waited=$((waited + 1))
done
kill "$probe_pid" 2>/dev/null || true
wait "$probe_pid" 2>/dev/null || true

if grep -q '"capabilities"' "$probe_out" 2>/dev/null; then
  ok "MCP initialize responded"
else
  warn "No initialize response from 'bladebro mcp'"
  [ -s "$probe_err" ] && head -5 "$probe_err" >&2
fi

if grep -q '"tools":\[' "$probe_out" 2>/dev/null; then
  found=""
  for tool in act see state run vision; do
    grep -q "\"name\":\"$tool\"" "$probe_out" && found="$found $tool"
  done
  if [ "$found" = " act see state run vision" ]; then
    ok "tools/list: act, see, state, run, vision"
  else
    warn "tools/list differs from the five documented tools (found:${found:- none}); version drift, re-check references/cli-reference.md"
  fi
else
  warn "No tools/list response captured"
fi

log "-- Code Mode manual (registered) --"
UTCP="$HERE/../../../../../.utcp_config.json"
if [ -f "$UTCP" ]; then
  if grep -q '"name"[[:space:]]*:[[:space:]]*"bladebro"' "$UTCP" 2>/dev/null; then
    ok "Code Mode 'bladebro' manual registered in .utcp_config.json"
    info "Confirm callables with Code Mode discovery before invoking; see references/mcp-wiring.md"
  else
    err "No 'bladebro' manual in .utcp_config.json; registration has regressed"
    info "Restore it from assets/utcp-bladebro-manual.md (operator-invoked; doctor never writes)."
    status=1
  fi
else
  warn ".utcp_config.json not found at the expected repo root; cannot check the 'bladebro' manual"
fi

log ""
log "Doctor is read-only. For setup, see install.sh and INSTALL-GUIDE.md."
exit "$status"
