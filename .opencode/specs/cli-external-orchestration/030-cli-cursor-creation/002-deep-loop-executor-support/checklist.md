---
title: "Verification Checklist: Cursor deep-loop executor support"
description: "Verification checklist for adding cli-cursor as a typed deep-loop executor kind."
trigger_phrases: ["cli-cursor executor support checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 002 (Planned)"
    next_safe_action: "Author phase 003"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor deep-loop executor support

All items below are unchecked — this phase is Planned, not yet implemented.

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
- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P1] Phase 001 contract facts re-read before touching the runtime maps
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-004 [P0] `EXECUTOR_KINDS` widened to include `'cli-cursor'`; both `Record<ExecutorKind,...>` matrices gain a matching row and `executor-config.ts` compiles
- [ ] CHK-005 [P0] `EXECUTOR_BINARY_BY_KIND['cli-cursor']` is `'cursor-agent'` (the canonical binary, not the `agent` alias)
- [ ] CHK-006 [P1] No fabricated model id in `CURSOR_SUPPORTED_MODELS`; the auth-gated roster is marked extensible/TBD
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-007 [P0] `buildLineageCommand({kind:'cli-cursor',...})` returns the confirmed `cursor-agent -p ... --model ...` shape
- [ ] CHK-008 [P0] Fail-closed test: with `cursor-agent` absent from a scoped `PATH`, `buildCursorLineageCommand` throws before any spawn, ignoring the always-0 `-p` exit code
- [ ] CHK-009 [P0] Focused Vitest run passes with zero regressions in `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertions
- [ ] CHK-010 [P1] `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` both contain `'cli-cursor'` after the same commit
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [ ] CHK-011 [P0] Consumer inventory: the existing kinds' rows in all 5 files are confirmed unchanged (widening-only)
- [ ] CHK-012 [P1] Evidence pinned to the phase's commit SHA once landed, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-013 [P0] No credential/token embedded; `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-cursor']` is a prefix allowlist (`CURSOR_`), not a hardcoded key
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-014 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` cross-references synchronized
- [ ] CHK-015 [P1] The `SandboxMode → approval-flag` mapping and session-env-var decisions are recorded (confirmed or TBD) before implementation
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-016 [P1] Temp files in `scratch/` only; cleaned before completion
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 7 | [ ]/7 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
