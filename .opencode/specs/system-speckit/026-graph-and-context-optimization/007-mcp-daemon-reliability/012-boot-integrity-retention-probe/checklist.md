---
title: "Verification Checklist: boot integrity-check + retention durability + probe fix"
description: "Verification checklist for marker-gated boot FTS integrity detection, retention-sweep durability, and the liveness-probe deepProbe reap fix."
trigger_phrases:
  - "boot integrity retention probe checklist"
  - "deepProbe reap retention durability verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented boot integrity-check, retention durability, probe deepProbe fix"
    next_safe_action: "Run strict packet validation"
    blockers: []
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000012a4"
      session_id: "007-012-boot-integrity-retention-probe-checklist"
      parent_session_id: null
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Boot Integrity-Check + Retention Durability + Probe Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md.
- [x] CHK-002 [P0] Required files read before editing.
- [x] CHK-003 [P1] Sibling packets 009/010 and the corruption runbook reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Boot integrity-check runs ONLY when the `.unclean-shutdown` marker is present.
- [x] CHK-011 [P0] No auto rebuild/`.recover`/swap added; the check is detect-only.
- [x] CHK-012 [P0] The marker path is derived from `vectorIndex.getDbPath()` (correct under `MEMORY_DB_PATH`).
- [x] CHK-013 [P1] Retention durability work runs only when rows were deleted, outside the delete tx, each step guarded.
- [x] CHK-014 [P1] `incremental_vacuum` runs only when `auto_vacuum == INCREMENTAL`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm run build --workspace=@spec-kit/mcp-server` (tsc) passes.
- [x] CHK-021 [P0] Targeted vitest suites pass (385+ green).
- [x] CHK-022 [P0] Bridge reap decision requires a deepProbe JSON-RPC initialize reply.
- [x] CHK-023 [P1] `DEFAULT_PROBE_TIMEOUT_MS` is 5000 and clamped strictly below the 7000ms launcher grace.
- [x] CHK-024 [P1] Strict spec validation exits 0. (PASS 2026-05-29 — validate.sh --strict exit 0.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: boot integrity + at-rest durability + hung-daemon detection.
- [x] CHK-FIX-002 [P0] Producer inventory: DB open writes the marker; clean close deletes it after TRUNCATE.
- [x] CHK-FIX-003 [P0] Consumer inventory: boot reads the marker; the probe reads the JSON-RPC reply; the sweep reads the delete count.
- [x] CHK-FIX-004 [P0] Adversarial: P1 connect-ok reap regression fixed via deepProbe; marker-dir divergence fixed via getDbPath.
- [x] CHK-FIX-005 [P1] Regression tests cover boot integrity-check, deepProbe reap, and retention durability.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced.
- [x] CHK-031 [P0] No new network or external command surface.
- [x] CHK-032 [P1] The crash marker is a local zero-content file; no data files recovered.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/implementation-summary authored.
- [x] CHK-041 [P1] Status set to implemented.
- [x] CHK-042 [P2] Out-of-scope bans and deferred auto-recover documented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet created under `007-mcp-daemon-reliability/012-boot-integrity-retention-probe`.
- [x] CHK-051 [P1] No `030-*` folder created or used.
- [x] CHK-052 [P1] No `description.json` or `graph-metadata.json` generated.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-29 (tsc + vitest + probe/marker + strict-validate all PASS)
<!-- /ANCHOR:summary -->
