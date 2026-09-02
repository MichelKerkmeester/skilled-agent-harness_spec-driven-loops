#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-obsidian :: Official App-Backed CLI Workflow
# Preflight → create → append → property → read back → delete, via `obsidian`.
# Requires a RUNNING Obsidian desktop app; the official CLI does not launch one.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
NOTE_NAME="${NOTE_NAME:-mcp-obsidian-official-cli-demo}"
VAULT="${VAULT:-}"
KEEP_NOTE="${KEEP_NOTE:-0}"

# ── Helpers ──────────────────────────────────────────────────────────────────
info()    { echo "[official] → $*"; }
success() { echo "[official] ✓ $*"; }
warn()    { echo "[official] ⚠ $*"; }
error()   { echo "[official] ✗ $*" >&2; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { error "$1 not found on PATH"; exit 1; }
}

# The official CLI reports in-app failures on stdout and still exits 0, so the
# exit status cannot be used to detect them. Every call goes through this wrapper,
# which turns the CLI's own error text back into a non-zero status.
obs() {
  local out
  if [ -n "$VAULT" ]; then
    out="$(obsidian vault="$VAULT" "$@" 2>/dev/null)"
  else
    out="$(obsidian "$@" 2>/dev/null)"
  fi
  case "$out" in
    "Error: "*|"Vault not found."*)
      error "obsidian $*: $out"
      return 1
      ;;
  esac
  printf '%s\n' "$out"
}

# ── Cleanup ──────────────────────────────────────────────────────────────────
# CREATED_NAME is the name the CLI actually used, which is not always the name
# requested: on a collision `create` makes a numbered sibling instead of failing.
CREATED_NAME=""
cleanup() {
  if [ -n "$CREATED_NAME" ] && [ "$KEEP_NOTE" != "1" ]; then
    info "removing demo note: $CREATED_NAME"
    obs delete file="${CREATED_NAME%.md}" permanent >/dev/null 2>&1 || \
      warn "could not delete $CREATED_NAME — remove it by hand"
  fi
}
trap cleanup EXIT INT TERM

# ── Preflight ────────────────────────────────────────────────────────────────
# This is the ONLY place the exit status is trustworthy. `version` fails at the
# launcher when the app is unreachable, before any in-app handler runs.
preflight() {
  info "checking the official CLI"
  require_cmd obsidian

  if ! obsidian version >/dev/null 2>&1; then
    error "Obsidian desktop is not running. The official CLI is a remote control"
    error "for a live app and will not start one. Launch Obsidian and retry:"
    error "  open -a Obsidian && until obsidian version >/dev/null 2>&1; do sleep 1; done"
    exit 1
  fi
  success "CLI live: $(obsidian version)"

  if [ -n "$VAULT" ]; then
    obs vaults | grep -qxF "$VAULT" || { error "vault not found: $VAULT"; exit 1; }
    success "vault confirmed: $VAULT"
  else
    info "vault: using the CLI default ($(obs vault | awk -F'\t' '$1=="name"{print $2}'))"
  fi
}

# ── Tasks ────────────────────────────────────────────────────────────────────
create_note() {
  info "creating note: $NOTE_NAME"
  local out
  out="$(obs create name="$NOTE_NAME" content="Created by the mcp-obsidian official-CLI example.")"
  # `create` prints "Created: <actual name>.md". Read the name back rather than
  # assuming it matches the request, or later calls target the wrong file.
  CREATED_NAME="${out#Created: }"
  if [ "$CREATED_NAME" != "$NOTE_NAME.md" ]; then
    warn "name collision: requested '$NOTE_NAME.md', got '$CREATED_NAME'"
  fi
  success "created: $CREATED_NAME"
}

mutate_note() {
  local target="${CREATED_NAME%.md}"
  # Always name the target. With file=/path= omitted the CLI acts on whatever
  # note the person is currently looking at in the app.
  info "appending a line"
  obs append file="$target" content="- appended at $(date -u +%FT%TZ)" >/dev/null
  info "setting a frontmatter property"
  obs property:set file="$target" name=source value=mcp-obsidian-example >/dev/null
  success "note mutated"
}

read_back() {
  local target="${CREATED_NAME%.md}"
  info "reading back"
  echo "─────────────────────────────────────────"
  obs read file="$target"
  echo "─────────────────────────────────────────"
  success "round trip verified"
}

show_app_only_capabilities() {
  # These are the reason to choose this CLI over the headless one: the app holds
  # a resolved index that the raw markdown files do not contain.
  info "app-only surfaces (unavailable to a filesystem CLI):"
  echo "  tags in vault:  $(obs tags total 2>/dev/null || echo 'n/a')"
  echo "  markdown files: $(obs files ext=md total 2>/dev/null || echo 'n/a')"
  echo "  enabled plugins: $(obs plugins:enabled 2>/dev/null | wc -l | tr -d ' ')"
}

# ── Main ─────────────────────────────────────────────────────────────────────
main() {
  echo "══════════════════════════════════════════"
  echo " mcp-obsidian :: official app-backed CLI"
  echo "══════════════════════════════════════════"
  preflight
  create_note
  mutate_note
  read_back
  show_app_only_capabilities
  echo ""
  echo "══════════════════════════════════════════"
  echo " Done. This required a running Obsidian app."
  echo " For app-free work use examples/headless-notes-workflow.sh."
  echo "══════════════════════════════════════════"
}

main "$@"
