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
    recent_action: "Authored checklist.md"
    next_safe_action: "Verify items once tasks.md T001-T027 land; gated items depend on phase 001"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

- [ ] CHK-001 [P0] Phase 001's `implementation-summary.md` (once it exists) re-read for the confirmed non-interactive invocation syntax, exit-code semantics, and model roster before any command-construction code is written.
- [ ] CHK-002 [P0] Whether Pi exposes any sandbox/permission-flag equivalent is confirmed, or explicitly documented as UNKNOWN/absent, before `EXECUTOR_KIND_FLAG_SUPPORT['cli-pi']` includes `sandboxMode`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] `EXECUTOR_KINDS` contains exactly 6 members (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-pi`); no existing member removed or reordered.
- [ ] CHK-004 [P0] `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` both carry a `cli-pi` row; strict typecheck reports no missing-property error against the `Record<ExecutorKind, ...>`/`satisfies Record<ExecutorKind, ...>` constraints.
- [ ] CHK-005 [P1] `PI_SUPPORTED_MODELS` contains zero fabricated model ids — either empty, or a single explicitly-commented placeholder that is never mistaken for a real, dispatchable id.
- [ ] CHK-006 [P0] `buildPiLineageCommand` is registered in `LINEAGE_COMMAND_ADAPTERS`; `buildLineageCommand({kind:'cli-pi', ...})` no longer throws `Unknown fan-out executor kind: cli-pi`.
- [ ] CHK-007 [P0] `buildPiLineageCommand`/`isPiBinaryAvailable` fails closed (`command -v pi` preflight) before any command array is constructed, mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable` exactly.
- [ ] CHK-008 [P0] A code comment on `buildPiLineageCommand`/`isPiBinaryAvailable` documents that the guard's success/availability signal does not rely on subprocess exit code alone (REQ-007), citing the `cursor-agent` exit-0-on-auth-failure precedent as the reason.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] `executor-config.vitest.ts` passes, including new `cli-pi` acceptance/flag-support cases.
- [ ] CHK-010 [P0] `executor-audit.vitest.ts` passes, including new `cli-pi` audit-map cases, including an explicit case documenting the still-absent session-env/env-prefix rows.
- [ ] CHK-011 [P0] `fanout-run.vitest.ts` passes, including a new `cli-pi` absent-binary fail-closed case mirroring the existing `cli-codex`/`cli-cursor` ones (lines 957, 1074).
- [ ] CHK-012 [P1] `remediation.vitest.ts` passes with `cli-pi` present in both `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` sets.
- [ ] CHK-013 [P0] Zero pre-existing assertions for `native`/`cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-cursor` changed value or were deleted (regression guard).
- [ ] CHK-014 [P1] Strict typecheck on `executor-config.ts` and `executor-audit.ts` exits 0.
- [ ] CHK-015 [P0] A fail-closed `isPiModelAllowed()` test exists and passes, proving every candidate model is rejected while `PI_SUPPORTED_MODELS` is empty/placeholder-only (SC-006).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] All 5 named production files (`executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, `profile-validator.cjs`) updated; none skipped.
- [ ] CHK-FIX-002 [P1] `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` edits landed in the same change (parity, REQ-009).
- [ ] CHK-FIX-003 [P0] Where phase 001 has NOT yet landed a concrete headless-syntax answer, `buildPiLineageCommand`'s command-construction body is explicitly marked `[B]` blocked in `tasks.md` (T013/T014/T017/T022) rather than shipped with a guessed flag — this is the single load-bearing honesty check of this phase.
- [ ] CHK-FIX-004 [P1] Matrix axes (`kind` × `EXECUTOR_KIND_FLAG_SUPPORT` field membership × `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` policy) are listed in `plan.md`'s AFFECTED SURFACES section before completion is claimed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P1] `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` stays absent, or contains only a live-confirmed prefix — no guessed `PI_` wildcard that could leak unrelated env vars into a dispatched `pi` subprocess.
- [ ] CHK-017 [P1] No credential value (API key, OAuth token, or any Pi auth artifact) is hardcoded or logged anywhere in the new code.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-018 [P0] `spec.md` REQ items each map to a completed (or explicitly `[B]` blocked) task in `tasks.md` with evidence.
- [ ] CHK-019 [P1] Every TBD left unresolved (headless invocation syntax, exit-code semantics, session-env var, model roster, sandbox-flag mapping) is documented in `implementation-summary.md` with what would confirm it, not silently dropped.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P1] All phase files (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`, plus `implementation-summary.md` once built) present in `002-deep-loop-executor-support/`.
- [ ] CHK-021 [P1] Any scratch/temp files used during implementation live in `scratch/` only and are cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Phase not yet started — Status: Planned. All items above are pending implementation-time verification, and several (CHK-006 through CHK-008, CHK-011, CHK-FIX-003) are additionally gated on `../001-pi-contract-pin` landing a confirmed non-interactive invocation contract first.

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet started.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`

