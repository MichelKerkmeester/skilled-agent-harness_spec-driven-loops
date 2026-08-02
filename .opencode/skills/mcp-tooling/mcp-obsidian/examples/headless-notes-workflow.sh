#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-obsidian :: Headless Notes Workflow
# Operates a vault with no running app: list-vaults → search → create → read back
# Uses notesmd-cli exclusively (filesystem-native, no Obsidian app required).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
VAULT="${VAULT:-}"                          # Optional: target a specific vault by name
NOTE_TITLE="${NOTE_TITLE:-Standup $(date -u +%Y-%m-%d)}"  # Idempotent per-day title
SEARCH_TERM="${SEARCH_TERM:-Standup}"

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  if [[ $exit_code -ne 0 ]]; then
    echo "[notes] ⚠ Exited with error code: $exit_code"
  fi
}
trap cleanup EXIT INT TERM

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo "[notes] → $*"; }
success() { echo "[notes] ✓ $*"; }
warn()    { echo "[notes] ⚠ $*"; }
error()   { echo "[notes] ✗ $*" >&2; }

require_cmd() {
  if ! command -v "$1" &>/dev/null; then
    error "Required command not found: $1"
    error "Install notesmd-cli: brew tap yakitrak/yakitrak && brew install yakitrak/yakitrak/notesmd-cli"
    exit 1
  fi
}

# ── Vault flag helper ─────────────────────────────────────────────────────────
# notesmd-cli's exact --vault flag name is unconfirmed (VERIFY with --help).
# When VAULT is empty, commands run against the default vault.
vault_args() {
  if [[ -n "$VAULT" ]]; then
    printf -- '--vault\n%s\n' "$VAULT"
  fi
}

# ── Preflight ─────────────────────────────────────────────────────────────────
preflight() {
  require_cmd notesmd-cli

  info "Running preflight checks..."
  # Confirm at least one vault is registered; list-vaults also shows the default.
  if ! notesmd-cli list-vaults; then
    error "No vaults registered. Add one: notesmd-cli add-vault <path>"
    exit 1
  fi
  success "notesmd-cli available; vault(s) registered"
}

# ── Read before write ─────────────────────────────────────────────────────────
find_existing() {
  info "Searching titles for: $SEARCH_TERM"
  # An empty result is VALID — it means no such note exists yet.
  local hits
  hits="$(notesmd-cli $(vault_args) search "$SEARCH_TERM" 2>/dev/null || true)"
  if [[ -z "$hits" ]]; then
    info "No existing note matched '$SEARCH_TERM' (this is fine)."
  else
    info "Existing matches:"
    echo "$hits"
  fi
}

# ── Create idempotently ───────────────────────────────────────────────────────
create_note() {
  info "Ensuring note exists: $NOTE_TITLE"

  # Idempotency: if a note with this exact title already exists, do not recreate.
  local exact
  exact="$(notesmd-cli $(vault_args) search "$NOTE_TITLE" 2>/dev/null || true)"
  if echo "$exact" | grep -qxF "$NOTE_TITLE" 2>/dev/null; then
    warn "Note already exists — skipping create (idempotent)."
    return 0
  fi

  # NOTE: the exact flag for supplying body content on `create` is unconfirmed.
  # Confirm with: notesmd-cli create --help
  notesmd-cli $(vault_args) create "$NOTE_TITLE"
  success "Created: $NOTE_TITLE"
}

# ── Read back ─────────────────────────────────────────────────────────────────
read_back() {
  info "Reading note back to confirm:"
  notesmd-cli $(vault_args) print "$NOTE_TITLE" || warn "Could not print '$NOTE_TITLE' (VERIFY note path)."
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo "══════════════════════════════════════════"
  echo " Headless Notes Workflow (notesmd-cli)"
  echo " Vault: ${VAULT:-<default>} | Note: $NOTE_TITLE"
  echo "══════════════════════════════════════════"

  preflight
  echo ""
  find_existing
  echo ""
  create_note
  echo ""
  read_back

  echo ""
  echo "══════════════════════════════════════════"
  echo " Done. This ran entirely headless — no Obsidian app required."
  echo "══════════════════════════════════════════"
}

main "$@"
