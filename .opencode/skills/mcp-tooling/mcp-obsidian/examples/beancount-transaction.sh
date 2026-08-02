#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-obsidian :: Beancount Transaction (file-layer plugin operation)
# Appends a balanced transaction to a .beancount ledger, then validates with
# bean-check. Demonstrates the file-layer model: operate the beancount-finance
# plugin by editing the DATA it renders, not by driving its UI.
#
# See ../references/plugins/beancount-finance/beancount-finance.md for the data model.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
# Default to a scratch ledger under the scratchpad so the example is self-
# contained and idempotent. Override LEDGER to point at a real vault ledger.
LEDGER="${LEDGER:-${TMPDIR:-/tmp}/mcp-obsidian-example.beancount}"
TXN_DATE="${TXN_DATE:-$(date -u +%Y-%m-%d)}"
PAYEE="${PAYEE:-Grocery Store}"
NARRATION="${NARRATION:-Weekly shop}"
AMOUNT="${AMOUNT:-42.50}"
CURRENCY="${CURRENCY:-USD}"
EXPENSE_ACCT="${EXPENSE_ACCT:-Expenses:Food:Groceries}"
ASSET_ACCT="${ASSET_ACCT:-Assets:Bank:Checking}"

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo "[beancount] → $*"; }
success() { echo "[beancount] ✓ $*"; }
warn()    { echo "[beancount] ⚠ $*"; }
error()   { echo "[beancount] ✗ $*" >&2; }

# ── Ensure the ledger exists with its accounts opened ─────────────────────────
# Beancount requires accounts to be `open`ed before they are used. This block is
# idempotent: it only writes the opening directives once.
ensure_ledger() {
  if [[ ! -f "$LEDGER" ]]; then
    info "Creating scratch ledger: $LEDGER"
    {
      printf '2026-01-01 open %s %s\n' "$ASSET_ACCT"   "$CURRENCY"
      printf '2026-01-01 open %s %s\n' "$EXPENSE_ACCT" "$CURRENCY"
      printf '\n'
    } > "$LEDGER"
    success "Ledger initialized with opened accounts"
  else
    info "Using existing ledger: $LEDGER"
  fi
}

# ── Append a balanced transaction ─────────────────────────────────────────────
# The two postings sum to zero: the expense is positive, the asset is negative.
append_transaction() {
  local neg_amount="-${AMOUNT}"

  info "Appending transaction: $PAYEE — $NARRATION ($AMOUNT $CURRENCY)"
  {
    printf '%s * "%s" "%s"\n' "$TXN_DATE" "$PAYEE" "$NARRATION"
    printf '  %-28s %8s %s\n' "$EXPENSE_ACCT" "$AMOUNT"     "$CURRENCY"
    printf '  %-28s %8s %s\n' "$ASSET_ACCT"   "$neg_amount" "$CURRENCY"
    printf '\n'
  } >> "$LEDGER"
  success "Transaction appended"
}

# ── Validate with bean-check ──────────────────────────────────────────────────
validate_ledger() {
  if ! command -v bean-check &>/dev/null; then
    warn "bean-check not found — skipping validation."
    warn "Install Beancount: pipx install beancount   (provides bean-check)"
    warn "NOTE: bean-check may be on PATH interactively but not for GUI/agent"
    warn "runtimes — export the install prefix if a headless run cannot find it."
    return 0
  fi

  info "Validating ledger with bean-check..."
  if bean-check "$LEDGER"; then
    success "Ledger is valid — postings balance and accounts resolve"
  else
    error "bean-check reported errors — the transaction likely does not balance"
    error "or references an unopened account. Inspect: $LEDGER"
    exit 1
  fi
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo "══════════════════════════════════════════"
  echo " Beancount Transaction (file-layer)"
  echo " Ledger: $LEDGER"
  echo "══════════════════════════════════════════"

  ensure_ledger
  append_transaction
  validate_ledger

  echo ""
  info "Tail of the ledger:"
  tail -n 6 "$LEDGER"

  echo ""
  echo "══════════════════════════════════════════"
  echo " Done. The Beancount Ledger plugin re-renders this ledger"
  echo " when its dashboard is opened/reloaded in the app."
  echo "══════════════════════════════════════════"
}

main "$@"
