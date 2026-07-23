---
title: "Verification Checklist: Devin deep-loop executor support"
description: "Verification checklist for restoring cli-devin as a typed deep-loop executor kind across the 5 hand-synced runtime files and their tests."
trigger_phrases: ["cli-devin executor support checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md P0/P1 items for phase 002 compile and regression gates"
    next_safe_action: "Verify items in order once tasks.md T001-T025 are implemented."
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin deep-loop executor support

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [ ] CHK-001 [P0] Phase 001's `implementation-summary.md` re-read for the confirmed 4-mode permission contract, flag surface, and model roster before any code is written.
- [ ] CHK-002 [P0] Devin's session-id env var and `--sandbox` boolean mapping either confirmed or explicitly marked TBD (not guessed) before `executor-audit.ts`/`fanout-run.cjs` are touched.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-003 [P0] `EXECUTOR_KINDS` contains exactly 5 members (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-devin`); no existing member removed or reordered.
- [ ] CHK-004 [P0] `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` both carry a `cli-devin` row; strict typecheck reports no missing-property error against the `Record<ExecutorKind, ...>` / `satisfies Record<ExecutorKind, ...>` constraints.
- [ ] CHK-005 [P1] `DevinPermissionMode` has exactly 4 members (`normal`/`accept-edits`/`bypass`/`autonomous`); the archived 2-mode (`auto`/`dangerous`) shape does not reappear anywhere in the diff.
- [ ] CHK-006 [P0] `buildDevinLineageCommand` is registered in `LINEAGE_COMMAND_ADAPTERS`; `buildLineageCommand({kind:'cli-devin', ...})` no longer throws `Unknown fan-out executor kind`.
- [ ] CHK-007 [P0] `buildDevinLineageCommand` fails closed (`command -v devin` preflight) before any command array is constructed, mirroring `isCodexBinaryAvailable` exactly.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-008 [P0] `executor-config.vitest.ts` passes, including new `cli-devin` acceptance/flag-support cases.
- [ ] CHK-009 [P0] `executor-audit.vitest.ts` passes, including new `cli-devin` audit-map cases.
- [ ] CHK-010 [P0] `fanout-run.vitest.ts` passes, including a new `cli-devin` command-construction case and a new absent-binary fail-closed case mirroring the existing `cli-codex` one.
- [ ] CHK-011 [P1] `remediation.vitest.ts` passes with `cli-devin` present in both `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` sets.
- [ ] CHK-012 [P0] Zero pre-existing assertions for `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` changed value or were deleted (regression guard).
- [ ] CHK-013 [P1] Strict typecheck on `executor-config.ts` and `executor-audit.ts` exits 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [ ] CHK-014 [P0] All 5 named production files (`executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, `profile-validator.cjs`) updated; none skipped.
- [ ] CHK-015 [P1] `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` edits landed in the same change (parity, REQ-009).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-016 [P1] `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-devin']` allowlists only confirmed prefixes (`COGNITION_`, and `DEVIN_` only if confirmed) — no overly broad wildcard that could leak unrelated env vars to a dispatched Devin subprocess.
- [ ] CHK-017 [P1] No credential value (API key, OAuth token) is hardcoded or logged anywhere in the new code.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-018 [P0] `spec.md` REQ items each map to a completed task in `tasks.md` with evidence.
- [ ] CHK-019 [P1] Any TBD left unresolved (session-env var, exact `--sandbox` mapping) is documented in `implementation-summary.md` with what would confirm it, not silently dropped.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-020 [P1] All phase files (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`, plus `implementation-summary.md` once built) present in `002-deep-loop-executor-support/`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Phase not yet started — Status: Planned. All items above are pending implementation-time verification.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
