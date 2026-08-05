#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mcp-obsidian :: MCP Roundtrip (documented reference)
# Documents the Code Mode call_tool_chain pattern against the `obsidian` manual:
# read a note, append a section, write it back — over the Local REST API.
#
# This script is a REFERENCE, not a driver: Code Mode calls execute inside the
# AI runtime (mcp__code_mode__call_tool_chain), not from bash. It prints the
# exact TypeScript to run and preflights the app-backed prerequisites.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
NOTE_PATH="${NOTE_PATH:-Daily/$(date -u +%Y-%m-%d).md}"
BASE_URL="${OBSIDIAN_BASE_URL:-http://127.0.0.1:27123}"

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo "[mcp] → $*"; }
success() { echo "[mcp] ✓ $*"; }
warn()    { echo "[mcp] ⚠ $*"; }
error()   { echo "[mcp] ✗ $*" >&2; }

# ── Preflight (app-backed prerequisites) ──────────────────────────────────────
# The obsidian-mcp-server talks to a RUNNING Obsidian app via the Local REST API
# plugin. This preflight checks the prerequisites without needing Code Mode.
preflight() {
  info "Checking app-backed prerequisites for the obsidian MCP..."

  if [[ -z "${OBSIDIAN_API_KEY:-}" ]]; then
    warn "OBSIDIAN_API_KEY is UNSET — the Local REST API requires a bearer token."
    warn "Copy it from Obsidian → Settings → Local REST API, then export OBSIDIAN_API_KEY."
  else
    success "OBSIDIAN_API_KEY is set"
  fi

  if command -v curl &>/dev/null; then
    info "Probing Local REST API at: $BASE_URL"
    # -k accepts the plugin's self-signed cert; a non-empty body means the app
    # is running with the plugin enabled. A failure here means: app closed, or
    # plugin disabled, or wrong port — route the task to notesmd-cli instead.
    # Skipping cert verification is safe only because BASE_URL is loopback; never
    # send the bearer token to a non-127.0.0.1 host with verification disabled.
    if curl -sk --max-time 5 -H "Authorization: Bearer ${OBSIDIAN_API_KEY:-}" "$BASE_URL/" >/dev/null 2>&1; then
      success "Local REST API responded — app is running"
    else
      warn "Local REST API did not respond. Is the Obsidian app open with the vault + plugin enabled?"
      warn "Headless alternative: use notesmd-cli (see headless-notes-workflow.sh)."
    fi
  else
    warn "curl not found — skipping the live REST API probe."
  fi
}

# ── The documented Code Mode call ─────────────────────────────────────────────
print_code_mode_example() {
  cat <<'TS'

─────────────────────────────────────────────────────────────────────────────
 Run this inside the AI runtime via mcp__code_mode__call_tool_chain.
 Tool naming: obsidian.obsidian_<tool>  (one `obsidian_` after the dot).
 Parameter names (path, content) are representative — VERIFY with tool_info().
─────────────────────────────────────────────────────────────────────────────

const result = await call_tool_chain({
  code: `
    // 1. Read the current note (creates nothing if absent — handle 404).
    let existing;
    try {
      existing = await obsidian.obsidian_get_note({ path: "Daily/2026-08-02.md" });
    } catch (e) {
      // Only a genuine "note absent" is safe to treat as empty. An auth,
      // transport, or server error must re-throw — otherwise a failed read
      // would overwrite a real note with empty + marker content.
      const notFound = e?.status === 404 || /not[_ ]?found/i.test(e?.message ?? "");  // VERIFY error shape with tool_info()
      if (!notFound) throw e;
      existing = { content: "" };   // Note does not exist yet
    }

    // 2. Append a section (idempotent: skip if the marker is already present).
    const marker = "## Follow-ups";
    const body = existing.content.includes(marker)
      ? existing.content
      : existing.content + "\n\n## Follow-ups\n- [ ] Review the mcp-obsidian mode";

    // 3. Write it back.
    const written = await obsidian.obsidian_write_note({
      path: "Daily/2026-08-02.md",
      content: body,
    });

    return { readBytes: existing.content.length, written };
  `,
});

─────────────────────────────────────────────────────────────────────────────
 Enumerate the full 14-tool surface first with:  await list_tools();
 Confirm a signature with:  await tool_info("obsidian.obsidian_get_note");
─────────────────────────────────────────────────────────────────────────────
TS
}

# ── Main ──────────────────────────────────────────────────────────────────────
main() {
  echo ""
  echo "══════════════════════════════════════════"
  echo " MCP Roundtrip (reference) — obsidian manual"
  echo " Note: $NOTE_PATH | Base URL: $BASE_URL"
  echo "══════════════════════════════════════════"

  preflight
  print_code_mode_example

  echo ""
  echo "══════════════════════════════════════════"
  echo " This is documentation: execute the TypeScript above via Code Mode,"
  echo " not from bash. If the app is closed, use notesmd-cli instead."
  echo "══════════════════════════════════════════"
}

main "$@"
