---
title: "Verification Checklist: Remove the Superset/Copilot hook bridge"
description: "Verification evidence for the Superset/Copilot bridge removal: deletes, surgical edits, priming survival, parity test, live-tree grep gate, and local purge."
trigger_phrases:
  - "superset removal checklist"
  - "copilot hook bridge verification"
  - "remove superset-notify checklist"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
    last_updated_at: "2026-07-12T11:02:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Remove the Superset/Copilot Hook Bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Manifest confirmed against the live tree
  - **Evidence**: `git grep` + `git ls-files` enumerated 11 tracked files (6 delete + 5 edit) + 1 untracked local; the 501 raw "superset" hits were shown to be mostly the set/type-theory word
- [x] CHK-002 [P0] Delete-vs-edit split decided per file
  - **Evidence**: `session-start.sh` / `user-prompt-submitted.sh` read in full — they call `session-prime.js` / `user-prompt-submit.js`, so classified edit-not-delete
- [x] CHK-003 [P1] Rollback anchored before mutation
  - **Evidence**: `.github/hooks/superset-notify.json` copied to `scratchpad/superset-notify.root.json.bak` (784 bytes) before any `rm`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The 6 pure-superset artifacts removed (REQ-001)
  - **Evidence**: `git status` shows `D` for `superset-notify.sh`, 3 `superset-notify.json`, the webhook `README.md`, and `copilot-hook-wiring.vitest.ts`
- [x] CHK-011 [P0] Spec-kit Copilot priming preserved (REQ-002)
  - **Evidence**: `grep -c session-prime.js session-start.sh` = 2 (0 superset); `grep -c user-prompt-submit.js user-prompt-submitted.sh` = 2 (0 superset)
- [x] CHK-012 [P1] Docs updated to current state
  - **Evidence**: `hook_system.md` superset clause removed; `sk-code/hooks.md` 3 sites rewritten to "no checked-in wrapper config"; dangling link removed from `advisor-fixtures/README.md`
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Hook-parity test passes after dropping the Copilot arm (REQ-003)
  - **Evidence**: `vitest run --config vitest.stress.config.ts hooks-parity-stress.vitest.ts` → Test Files 1 passed, Tests 2 passed
- [x] CHK-021 [P0] Deleted wiring test leaves no orphan
  - **Evidence**: `git grep copilot-hook-wiring` (excl specs/z_archive) = 0 after removing the `advisor-fixtures/README.md:74` link
- [x] CHK-022 [P1] No dangling live reference to the bridge (REQ-004)
  - **Evidence**: `git grep 'superset-notify' / '.superset/hooks/copilot-hook'` (excl specs/z_archive) = 0
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded
  - **Evidence**: `cross-consumer` removal — a checked-in subsystem (config + wrapper + tests + docs) with multiple consumers across three skills
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: all 4 `superset-notify.json` producers (root untracked + 3 propagated skill copies) + the `superset-notify.sh` wrapper located and removed/purged
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the removed artifacts
  - **Evidence**: `git grep -l superset-notify` swept 7 consumer sites (2 scripts, 2 docs, 2 tests, 1 README); live grep gate = 0
- [x] CHK-FIX-004 [P0] Adversarial/edge cases considered
  - **Evidence**: N/A for a pure removal — no security/path/parser/redaction logic changed; the reference sweep matched only `superset-notify` and the `.superset/hooks/copilot-hook` call path, never the bare word `superset`
- [x] CHK-FIX-005 [P1] Scope of the sweep listed before completion
  - **Evidence**: 11 tracked files enumerated in spec.md §3 + a 12th (`advisor-fixtures/README.md`) added during the orphan check, recorded as a deviation
- [x] CHK-FIX-006 [P1] Global-state / cross-runtime variant checked
  - **Evidence**: parity test asserts Claude + OpenCode arms still wire correctly after the Copilot arm removal (2/2 pass)
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix range
  - **Evidence**: `validate.sh --strict` on 004 = Errors 0; evidence pinned to the path-scoped removal commit
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No machine-local hook paths left dangling in tracked code
  - **Evidence**: all `~/.superset/hooks/copilot-hook.sh` invocations removed from tracked files (live grep = 0)
- [x] CHK-031 [P1] Scope discipline: only bridge files + the 004 spec folder staged
  - **Evidence**: `git add` restricted to the 12 bridge paths + `027/004`; the ~34 concurrent/daemon churn files were never staged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/summary synchronized with the shipped removal
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` all reflect the executed 6-delete/6-edit/purge
- [x] CHK-041 [P1] Frozen history preserved (REQ-006)
  - **Evidence**: 5 `specs/**` (incl z_archive) `superset-notify.json` copies left tracked; the "superset"-word false positives untouched
- [x] CHK-042 [P1] Local purge complete (REQ-005)
  - **Evidence**: root `.github/hooks/superset-notify.json` rm'd (disk absent); `grep -c superset-notify .git/info/exclude` = 0
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp/backup files in scratchpad only
  - **Evidence**: the root-config backup lives at `scratchpad/superset-notify.root.json.bak`, outside the repo tree
- [x] CHK-051 [P2] `.github/hooks/scripts/` left consistent
  - **Evidence**: after deleting `superset-notify.sh`, the two lifecycle scripts remain; directory non-empty and functional
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-12
**Verified By**: AI Assistant (Claude Opus 4.8)
<!-- /ANCHOR:summary -->
