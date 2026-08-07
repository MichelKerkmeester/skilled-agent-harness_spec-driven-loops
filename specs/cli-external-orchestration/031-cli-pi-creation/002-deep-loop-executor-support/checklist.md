---
title: "Verification Checklist: Pi deep-loop executor support"
description: "Verification checklist for widening EXECUTOR_KINDS to 6 members and scaffolding cli-pi's fail-closed fan-out adapter across the 5 hand-synced runtime files and their tests."
trigger_phrases:
  - "cli-pi executor support checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 25 items verified with evidence via LUNA implementation + GLM-5.2 review"
    next_safe_action: "Commit"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["All 25 checklist items met - 4 gated tasks correctly stay blocked, not this checklist"]
---
# Verification Checklist: Pi deep-loop executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Phase 001's `implementation-summary.md` (once it exists) re-read for the confirmed non-interactive invocation syntax, exit-code semantics, and model roster before any command-construction code is written. [EVIDENCE: confirmed via `../001-pi-contract-pin/implementation-summary.md`]
- [x] CHK-002 [P0] Whether Pi exposes any sandbox/permission-flag equivalent is confirmed, or explicitly documented as UNKNOWN/absent, before `EXECUTOR_KIND_FLAG_SUPPORT['cli-pi']` includes `sandboxMode`. [EVIDENCE: no sandbox/permission flag in `pi --help`; sandboxMode left unsupported]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] `EXECUTOR_KINDS` contains exactly 6 members (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-pi`); no existing member removed or reordered. [EVIDENCE: EXECUTOR_KINDS has exactly 6 members, confirmed via `executor-config.vitest.ts`]
- [x] CHK-004 [P0] `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` both carry a `cli-pi` row; strict typecheck reports no missing-property error against the `Record<ExecutorKind, ...>`/`satisfies Record<ExecutorKind, ...>` constraints. [EVIDENCE: `tsc --noEmit --composite false -p tsconfig.json` exit 0]
- [x] CHK-005 [P1] `PI_SUPPORTED_MODELS` contains zero fabricated model ids — either empty, or a single explicitly-commented placeholder that is never mistaken for a real, dispatchable id. [EVIDENCE: PI_SUPPORTED_MODELS is empty (no fabricated ids)]
- [x] CHK-006 [P0] `buildPiLineageCommand` is registered in `LINEAGE_COMMAND_ADAPTERS`; `buildLineageCommand({kind:'cli-pi', ...})` no longer throws `Unknown fan-out executor kind: cli-pi`. [EVIDENCE: buildPiLineageCommand registered, confirmed via `fanout-run.vitest.ts`]
- [x] CHK-007 [P0] `buildPiLineageCommand`/`isPiBinaryAvailable` fails closed (`command -v pi` preflight) before any command array is constructed, mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable` exactly. [EVIDENCE: isPiBinaryAvailable preflight confirmed via `fanout-run.vitest.ts` absent-binary case]
- [x] CHK-008 [P0] A code comment on `buildPiLineageCommand`/`isPiBinaryAvailable` documents that the guard's success/availability signal does not rely on subprocess exit code alone (REQ-007), citing the `cursor-agent` exit-0-on-auth-failure precedent as the reason. [EVIDENCE: code comment documents the exit-code constraint, confirmed via GLM-5.2 independent review]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] `executor-config.vitest.ts` passes, including new `cli-pi` acceptance/flag-support cases. [EVIDENCE: `executor-config.vitest.ts` passes (188 tests total across the 3 files)]
- [x] CHK-010 [P0] `executor-audit.vitest.ts` passes, including new `cli-pi` audit-map cases, including an explicit case documenting the still-absent session-env/env-prefix rows. [EVIDENCE: `executor-audit.vitest.ts` passes with absent-row cases]
- [x] CHK-011 [P0] `fanout-run.vitest.ts` passes, including a new `cli-pi` absent-binary fail-closed case mirroring the existing `cli-codex`/`cli-cursor` ones (lines 957, 1074). [EVIDENCE: `fanout-run.vitest.ts` passes with new cli-pi absent-binary case]
- [x] CHK-012 [P1] `remediation.vitest.ts` passes with `cli-pi` present in both `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` sets. [EVIDENCE: `remediation.vitest.ts` passes: 26/27 (1 pre-existing unrelated failure, confirmed via git stash)]
- [x] CHK-013 [P0] Zero pre-existing assertions for `native`/`cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-cursor` changed value or were deleted (regression guard). [EVIDENCE: zero diffs in existing 5 kinds' assertions, confirmed via full vitest run + GLM-5.2 review]
- [x] CHK-014 [P1] Strict typecheck on `executor-config.ts` and `executor-audit.ts` exits 0. [EVIDENCE: `tsc --noEmit` exit 0 on both changed .ts modules]
- [x] CHK-015 [P0] A fail-closed `isPiModelAllowed()` test exists and passes, proving every candidate model is rejected while `PI_SUPPORTED_MODELS` is empty/placeholder-only (SC-006). [EVIDENCE: isPiModelAllowed() rejects every candidate incl. empty string, test passes]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All 5 named production files (`executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, `profile-validator.cjs`) updated; none skipped. [EVIDENCE: all 5 named files updated, confirmed via `git diff --stat HEAD` (9 files changed)]
- [x] CHK-FIX-002 [P1] `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` edits landed in the same change (parity, REQ-009). [EVIDENCE: both KNOWN_EXECUTORS edits landed in the same diff]
- [x] CHK-FIX-003 [P0] Where phase 001 has NOT yet landed a concrete headless-syntax answer, `buildPiLineageCommand`'s command-construction body is explicitly marked `[B]` blocked in `tasks.md` (T013/T014/T017/T022) rather than shipped with a guessed flag — this is the single load-bearing honesty check of this phase. [EVIDENCE: T013/T014/T017/T022 explicitly marked [B] in tasks.md, not guessed]
- [x] CHK-FIX-004 [P1] Matrix axes (`kind` × `EXECUTOR_KIND_FLAG_SUPPORT` field membership × `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` policy) are listed in `plan.md`'s AFFECTED SURFACES section before completion is claimed. [EVIDENCE: matrix axes listed in plan.md Affected Surfaces section]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P1] `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` stays absent, or contains only a live-confirmed prefix — no guessed `PI_` wildcard that could leak unrelated env vars into a dispatched `pi` subprocess. [EVIDENCE: EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi'] stays absent, confirmed via `executor-audit.vitest.ts`]
- [x] CHK-017 [P1] No credential value (API key, OAuth token, or any Pi auth artifact) is hardcoded or logged anywhere in the new code. [EVIDENCE: no credential value in the diff, confirmed via `git diff HEAD` review]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-018 [P0] `spec.md` REQ items each map to a completed (or explicitly `[B]` blocked) task in `tasks.md` with evidence. [EVIDENCE: spec.md REQ items map to tasks.md items with evidence]
- [x] CHK-019 [P1] Every TBD left unresolved (headless invocation syntax, exit-code semantics, session-env var, model roster, sandbox-flag mapping) is documented in `implementation-summary.md` with what would confirm it, not silently dropped. [EVIDENCE: every unresolved item documented in implementation-summary.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P1] All phase files (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`, plus `implementation-summary.md` once built) present in `002-deep-loop-executor-support/`. [EVIDENCE: all phase files present including implementation-summary.md]
- [x] CHK-021 [P1] Any scratch/temp files used during implementation live in `scratch/` only and are cleaned before completion. [EVIDENCE: scratch/ untouched, empty]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete. Implemented via GPT-5.6-LUNA (xhigh, codex exec), independently re-verified (188/188 + 26/27 with 1 pre-existing unrelated failure confirmed via git stash, typecheck exit 0), and independently reviewed by GLM-5.2 (devin) with an APPROVE verdict and no required changes. The 4 phase-001-gated tasks (T013/T014/T017/T022) correctly stay `[B]` blocked in tasks.md rather than shipping a guessed invocation syntax - this is the intended, honest outcome, not a gap in this checklist.

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`

