---
title: "Implementation Summary: Phase 010 — Apply the deferred plugin-doc research recommendations"
description: "Resolved the items phase 009 deferred on the shipped mcp-obsidian docs: two dataview evidence upgrades (file.day two-trigger correction with official-docs citation, inline-field single-line official-docs citation), the advanced-canvas interdimensional-edge caveat tightened to serialization-code-confirmed / byte-unverified across five files, the claudian positive Claude-provider MCP path resolved to a definitive negative plus an explicit UNKNOWN, and the two optional notion-bases items (an explicit not-split decision plus a version bump on the phase-008 calendar-recipe file). Also cleared the 007 TEMPLATE_HEADERS error and reconciled its continuity. Every changed shipped doc validates 0 issues; this folder and 007 pass validate.sh --strict with Errors:0."
trigger_phrases:
  - "015 plugin doc recs followup summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/010-plugin-doc-recs-followup"
    last_updated_at: "2026-08-23T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Resolved deferred plugin-doc items and the 007 header fix; linked successor 011"
    next_safe_action: "None — 011 migration-playbook refresh authored; packet ready for review"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-010-plugin-doc-recs-followup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-plugin-doc-recs-followup |
| **Completed** | Every deferred plugin-doc item resolved with confirmed evidence; the 007 header error cleared; only intentional residuals remain (byte-unverified canvas endpoint, claudian positive-path UNKNOWN) |
| **Level** | 2 |
| **Actual Effort** | ~3 hours (facts-sheet authoring + coherent-set tightening + 007 header fix + validation + phase package) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase resolves the items phase 009 deferred on the shipped `mcp-obsidian` docs, authored from a primary-source-confirmed facts sheet. Each fact was confirmed against the official Dataview documentation or the installed plugin `main.js` before authoring, so this phase applies confirmed wording rather than re-deciding any claim.

### Resolved per plugin

| Plugin | Resolved | Notes |
|--------|----------|-------|
| **dataview** | 2 evidence upgrades | `file.day` §5 note now states the two confirmed triggers — a filename date (`yyyy-mm-dd`/`yyyymmdd`) or a `Date` field/inline field — and cites the official Dataview "Metadata on Pages" documentation; the unreal folder trigger is dropped, and the field-table row and guardrail bullet are tightened to match. The single-line inline-field rule in §4 now cites the official Dataview "Adding Metadata" documentation ("All content after the `::` is the value of the field until the next line break."); the claim itself is unchanged. |
| **advanced-canvas** | endpoint caveat tightened (5 files) | The cross-portal ("interdimensional") edge caveat now reads "confirmed from the plugin's own serialization code, only not yet byte-verified against a captured `.canvas` file (none exists — the vault is read-only)" across `advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`, and the feature-catalog card. The documented `portalId-nodeId` encoding is unchanged. |
| **claudian** | positive MCP path resolved | For the Claude Code provider, the docs now state the definitive negative — Claudian authors no on-disk MCP file; it removes the legacy `.claude/mcp.json` at init and passes an in-memory `mcpServers` array (empty by default), confirmed from installed `realclaudian` v2.2.4 — and state the positive add-a-server surface as an explicit UNKNOWN, naming no file path. Applied in `data-model.md` (§5 body, §1 storage row, guardrail bullet), `workflows.md` §5, and the feature-catalog card. The per-CLI schema `VERIFY` tags for the other providers are preserved. |
| **notion-bases** | 2 optional items resolved | P2-7 recorded as an explicit not-split decision (see Key Decisions); P2-8 version bump applied to the phase-008 calendar-recipe file `workflows.md` (`0.1.0.0` → `0.1.1.0`). |

### Sibling packet fix

The `007-excalidraw-deprecation` packet's `tasks.md` used non-canonical phase headers (`Map`/`Remove`); they now read the canonical `Setup`/`Implementation`, with content preserved. Its generated `description.json`/`graph-metadata.json` were refreshed, and its continuity `last_updated_at` reconciled so `CONTINUITY_FRESHNESS` stays within budget after the refresh advanced `derived.last_save_at`. `007` now passes `validate.sh --strict` with Errors:0, RESULT: PASSED.

### Files Changed (shipped docs)

| Surface | Files |
|---------|-------|
| `references/plugins/dataview/` | `data-model.md` |
| `references/plugins/advanced-canvas/` | `advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md` |
| `references/plugins/claudian/` | `data-model.md`, `workflows.md` |
| `references/plugins/notion-bases/` | `workflows.md` |
| `feature-catalog/plugins/` | `advanced-canvas.md`, `claudian.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each deferred item's confirmed wording was authored from the facts sheet, then validated. Repeated caveats were tightened as coherent sets so no stale instance survives: the advanced-canvas endpoint caveat across five files and the claudian positive-path resolution across the reference and catalog docs, each followed by a residual grep confirming no "inferred" or dangling-`VERIFY` wording remained on the resolved claims. Every changed doc was validated with `validate_document.py` immediately after its edits. The `007` header fix was applied, its metadata regenerated with `generate-description.js` + `backfill-graph-metadata.js`, and its continuity timestamp reconciled before re-validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| notion-bases P2-7: do NOT split `data-model.md` | Keeping the `ViewConfig`/advanced-schema surface next to the core column schema it extends reads better than a separate `advanced-config.md`; a split would fragment that context and add a new leaf to the mcp-tooling hub inventory for marginal navigability gain. |
| claudian positive MCP path stated as UNKNOWN | The installed minified build shows the negative definitively (runtime `mcpServers` array, legacy file removed) but does not expose how a server reaches that array; documenting a definitive negative plus an explicit UNKNOWN is honest, whereas naming a path would invent one. |
| advanced-canvas caveat tightened, encoding unchanged | The plugin's serialization code confirms the `portalId-nodeId` endpoint form, so the caveat drops "inferred"; the only residual gap is a byte-check against a captured `.canvas`, which cannot be done under a read-only vault, so the wording says exactly that. |
| notion-bases version bump scoped to `workflows.md` only | Only that doc was changed (in phase 008) without a bump; the convention is applied to the doc actually changed, not swept across unrelated files. |
| Reconcile 007's continuity after the required metadata refresh | Refreshing 007's generated metadata advances `derived.last_save_at`; without a matching continuity `last_updated_at`, `CONTINUITY_FRESHNESS` would flag a stale lag, so the continuity timestamp was reconciled to keep 007's strict validation clean. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` — 8 reference docs | `Total issues: 0` on each |
| `validate_document.py` — 2 catalog cards | `Total issues: 0` on each |
| `validate.sh 010-plugin-doc-recs-followup --strict` | `RESULT: PASSED`, `Errors: 0` |
| `validate.sh 007-excalidraw-deprecation --strict` | `TEMPLATE_HEADERS` pass, `CONTINUITY_FRESHNESS` pass, `RESULT: PASSED`, `Errors: 0` (exit 0) |
| Residual grep — advanced-canvas | no "inferred"/"confirm against a real portal file" wording remains on the endpoint caveat |
| Scope containment | `git status` shows only the named `mcp-obsidian/` docs, this phase folder, and `007`'s tasks/metadata/continuity; the parent `015/spec.md` was not modified; the deep-loop runtime and `compiled-routing` were left as-is |
| Vault safety | read-only — no vault write, no `.env`/token read, no `.canvas` created |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advanced-canvas endpoint encoding stays byte-unverified.** The `portalId-nodeId` composite endpoint is confirmed from the plugin's own serialization code, but a byte-check against a captured portal `.canvas` file cannot be done — the vault is read-only and no such file exists — so the docs say exactly that rather than claiming a byte-verified encoding.
2. **The claudian positive Claude-provider MCP path stays UNKNOWN.** The installed minified build shows Claudian passes an in-memory `mcpServers` array and removes the legacy `.claude/mcp.json`, but does not expose how an operator adds a server so it reaches that array; the docs state this as an explicit UNKNOWN rather than naming a file path.
3. **The per-CLI MCP schema `VERIFY` tags remain by design.** Only the positive Claude-provider path was resolved; the Codex/OpenCode/Grok/Pi MCP-config path/shape `VERIFY` tags stay, since each still needs a live-install check.
4. **The parent phase-map refresh is the orchestrator's step.** This phase does not modify the parent `015/spec.md` or `graph-metadata.json`; discoverability of this phase is via its own generated metadata.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY (~100 lines)
- Core + Level 2 addendum
- Honest framing: deferred items resolved, intentional residuals named
-->
