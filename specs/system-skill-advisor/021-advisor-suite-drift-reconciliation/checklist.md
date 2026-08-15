---
title: "Verification Checklist: Advisor Suite Drift Reconciliation"
description: "Verification items for the guardrailed suite-drift reconciliation."
trigger_phrases:
  - "advisor suite drift checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/021-advisor-suite-drift-reconciliation"
    last_updated_at: "2026-08-15T17:14:48Z"
    last_updated_by: "claude-code"
    recent_action: "LUNA-MAX reconciled 6 clusters; default suite 40->4 failures; diff reviewed clean"
    next_safe_action: "Owner decision on the 4 residual reds (2 real regressions, corpus floor, env)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Advisor Suite Drift Reconciliation

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

- [x] CHK-001 [P0] Baseline captured before any change
  - **Evidence**: `vitest run` reported `40 failed / 827 passed`
- [x] CHK-002 [P0] Executor OAuth verified before dispatch
  - **Evidence**: `codex login status` logged in
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scorer source changes are renames, not tuned behavior
  - **Evidence**: `explicit.ts` / `fusion.ts` / `lexical.ts` re-point `mcp-chrome-devtools`→`mcp-tooling` with weights unchanged (`0.95`, `1`, `0.75`)
- [x] CHK-011 [P0] Cross-language copies agree
  - **Evidence**: `deep-improvement` removed from Python to match TS (0 standalone refs in `explicit.ts`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Full suite re-run, before and after recorded
  - **Evidence**: `40 failed -> 4 failed` (`871 passed / 7 skipped`)
- [x] CHK-021 [P0] Typecheck clean
  - **Evidence**: `tsc --noEmit` exit `0`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No gate weakened
  - **Evidence**: `git diff` shows no `.skip`/`.todo` added, no leak assertion removed, no floor/threshold lowered
- [x] CHK-FIX-002 [P0] Baselines regenerated via owning tooling
  - **Evidence**: `capture-scorer-eval-baseline.mjs --write`; new `capture-local-native-divergence-ledger.mjs`; no hand-edited baseline bytes
- [x] CHK-FIX-003 [P0] Ratchet counts moved up, not down
  - **Evidence**: `python-ts-parity` `pythonCorrect` `106->110` (accuracy improved, locked in)
- [x] CHK-FIX-004 [P1] Real regressions left red, not masked
  - **Evidence**: 2 stress regressions (`660` vs `500`; plugin-bridge fallback) + `advisor-validate` floor + env failures left red and flagged
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Env no-leak assertions intact
  - **Evidence**: only launcher-derived `SPECKIT_IPC_SOCKET_DIR` added; `AWS_SECRET_ACCESS_KEY`/`RANDOM_PARENT_ENV` leak checks preserved
- [x] CHK-031 [P0] No file outside scope changed
  - **Evidence**: `git status` shows only `.opencode/skills/system-skill-advisor/` (23 files)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Packet records what was reconciled vs left red
  - **Evidence**: `spec.md` + `implementation-summary.md` list the six clusters and the residuals
- [x] CHK-041 [P1] Residual reds attributed
  - **Evidence**: each residual tagged real-regression / corpus-floor / env in `implementation-summary.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Dispatch artifacts kept in scratch, not the repo
  - **Evidence**: `luna-drift-prompt.txt` / `luna-drift-out.txt` kept under the session scratchpad, not the repo
- [x] CHK-052 [P0] `validate.sh --strict` exits clean
  - **Evidence**: `validate.sh` on this packet reports `Errors: 0`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-15
<!-- /ANCHOR:summary -->
