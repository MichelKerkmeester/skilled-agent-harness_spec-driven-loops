---
title: "Implementation Summary: LUNA review remediation for the sk-prefix rename"
description: "Three review findings closed: both catalog inventories re-aligned to the sk-create-* keys with a parity guard, the manifest-freshness gate made fail-closed with tests, and one authoritative current-state record published over the divergent closeout evidence."
trigger_phrases:
  - "LUNA review remediation"
  - "catalog registry parity"
  - "freshness fail-closed"
  - "current-state verification"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/010-luna-review-remediation"
    last_updated_at: "2026-07-29T17:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented all three phases via cli-codex GPT-5.6-SOL agents; conductor-verified each; sanitized evidence paths; evidenced checklist"
    next_safe_action: "Commit the packet by explicit pathspec, then pin evidence to that commit (CHK-FIX-007)"
    blockers: []
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-luna-review-remediation |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three findings from the GPT-5.6-LUNA deep review (verdict CONDITIONAL: two P1, one P2) are closed. Each phase ran as an isolated cli-codex GPT-5.6-SOL high/fast agent, verified by the conductor before the next started.

### Catalog registry parity (R1-P1)

Both live sk-doc catalog pages — `feature-catalog.md` and `packet-authored-registry-routing/packet-authored-registry-routing.md` — now publish the twelve canonical `sk-create-*` workflowMode keys instead of the pre-rename unprefixed forms, and the shared `sk-create-skill-parent` distinction is preserved. A new `check_workflow_mode_parity` (CHECK d) in `validate_catalog_package.py` parses both inventories and fails if either drifts from `mode-registry.json`, so this cannot silently regress.

### Fail-closed manifest freshness (R4-P2)

`findManifestDirs()` in `ci-leaf-manifest-freshness.cjs` no longer swallows an unreadable subtree. It returns `{ roots, failures }`; `run()` renders traversal failures in both text and JSON and counts them toward a nonzero exit. Every attempted subtree is now read, intentionally excluded before descent, or reported as a stable failure. A new regression suite covers injected `EACCES`, multiple failures, pre-descent exclusions, and the clean path, restoring mocked `fs` in `finally`.

### One authoritative current-state record (R3-P1)

`current-state-verification.md` reruns route-gold, compiled-routing parity, root-metadata, and leaf-freshness into `evidence/*.json`, records each command and true result, and explicitly supersedes the phase 008 snapshot. Forward-pointers were appended to the parent spec and the 008/009 records without rewriting their historical observations.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/feature-catalog/feature-catalog.md` | Modified | Canonical `sk-create-*` inventory |
| `sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md` | Modified | Canonical `sk-create-*` inventory |
| `sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modified | Registry-parity guard (CHECK d) |
| `sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | Modified | Fail-closed traversal |
| `sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs` | Created | Traversal-failure regression suite |
| `010-luna-review-remediation/current-state-verification.md` | Created | Authoritative current-state record |
| `010-luna-review-remediation/evidence/*.json` | Created | Six captured gate reruns |
| `030 spec.md`, `008/009 implementation-summary.md` | Modified | Append-only forward-pointers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three cli-codex GPT-5.6-SOL (high reasoning, fast tier, workspace-write) agents ran one per phase, serially under single-dispatch discipline. The Opus conductor verified each phase against real symptoms before dispatching the next — scope, stale-key removal and the parity verdict for phase 1; an independent run of the injected-`EACCES` test for phase 2; evidence honesty, supersession and pointer placement for phase 3 — then sanitized operator-specific paths out of the durable evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Traversal failures returned as structured `{roots, failures}` and counted toward exit | An unreadable subtree must never let the freshness gate report clean |
| The current-state record documents pre-existing gate failures rather than fixing them | Kept remediation to R1/R3/R4; the drift and stale imports are separate, out-of-scope rename fallout |
| Metadata finalized via the scripts generators, not the mcp-server dist | The mcp-server dist is externally broken (v4 pi-hook version skew); the scripts generators are unaffected |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Honest state — the remediation's own work passes; several adjacent gates carry pre-existing, out-of-scope failures.

| Check | Result |
|-------|--------|
| Catalog 12-key registry parity (CHECK d) | PASS — both pages, 0 stale keys |
| `validate_document.py` both catalog pages | PASS |
| Freshness regression: injected `EACCES` → nonzero exit | PASS |
| Freshness clean input | PASS — `checked=11 fresh=11 failed=0` |
| Invalid `--skills-dir` still exits 2 | PASS |
| `node --check` freshness script + test | PASS |
| sk-doc route-gold | PASS — aggregate 98, 32/32 matches |
| Lane C vitest suite | FAIL — pre-existing (stale `sk-code-router-sync.vitest.ts:206` import + others), out of scope |
| compiled-routing parity | FAIL — pre-existing `BLOCKED-BY-COMPILED-DRIFT`, 32 drift rows |
| root-metadata gate | FAIL — pre-existing, 9/11, 2 owner-mode rename-drift |
| catalog package validator `--strict` | FAIL — pre-existing, 19 `missing_source_path` |
| `validate.sh --strict` | BLOCKED — external stale mcp-server dist |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`validate.sh --strict` is blocked** by a stale `system-spec-kit/mcp-server` dist (external v4 pi-hook version skew). Rebuild on `main`/CI; do not rebuild in this worktree.
2. **Discovered follow-up — compiled-routing drift.** sk-doc compiled routing is fully drifted post-rename (32 drift rows, `BLOCKED-BY-COMPILED-DRIFT`). Pre-existing rename fallout needing compiled-routing regeneration; outside this packet's scope.
3. **Discovered follow-up — stale test import.** `sk-code-router-sync.vitest.ts:206` still imports a removed pre-rename `sk-doc/create-skill/...` path; a one-line fix, out of this packet's scope.
4. **Pre-existing adjacent failures** left untouched: root-metadata owner-mode rename drift (2/11) and the package validator's 19 `missing_source_path` references.
5. **CHK-FIX-007 open:** evidence is not yet pinned to a commit because the packet is uncommitted. Pin after committing.
<!-- /ANCHOR:limitations -->
