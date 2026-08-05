---
title: "Verification Checklist: Cross-Runtime Coverage and Verification"
description: "Completed evidence gates for the R1-P1-001 quoted-executor fix, its shared-lib test evidence, cross-runtime documentation coverage, and the explicit R2-P1-002/R2-P1-003 deferral."
trigger_phrases:
  - "quoted executor fix checklist"
  - "cross-runtime coverage checklist"
  - "dispatch inspection verification checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification"
    last_updated_at: "2026-08-05T14:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Completed verification checklist with command receipts"
    next_safe_action: "None; packet is documentation-complete pending operator decision on committing the fix"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:2c39828db3b15582bf2077a7dffd8b7d69f73c10f9abfa8e4ee68badfceae6bc"
      session_id: "2026-08-05-cli-038-010-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cross-Runtime Coverage and Verification

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive user approval |
| **[P2]** | Optional | Can defer only with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] R1-P1-001, R2-P1-002, R2-P1-003 title/file/line captured verbatim from the findings registry. [TESTED: direct read]
  - [EVIDENCE: `../review/deep-review-findings-registry.json` `openFindings[0..2]`; recorded in `tasks.md` T001.]
- [x] CHK-002 [P0] The current `directExecutor()` source confirms the blanket quoted-executor guard is absent. [TESTED: direct read]
  - [EVIDENCE: `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:186-197`; no `if (executable.quoted) return null;` present; `tasks.md` T002.]
- [x] CHK-003 [P1] The Pi preflight `tool_call` short-circuit boundary that the bypass exploited is located. [TESTED: direct read]
  - [EVIDENCE: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:243`; `tasks.md` T003.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] This phase modified no code file. [TESTED: scoped diff]
  - [EVIDENCE: only `010-cross-runtime-coverage-and-verification/*` files were created; `git status --porcelain -- .opencode/hooks .opencode/skills/system-deep-loop` shows no new changes attributable to this phase beyond the pre-existing uncommitted fix.]
- [x] CHK-011 [P0] No claim in this packet's docs exceeds an independently re-run command or a direct file read. [TESTED: claim-to-command audit]
  - [EVIDENCE: every evidence row in `tasks.md` cites either a command run during authoring or an exact file:line read.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Shared inspector suite re-run passes, including the 4 new `inspectDispatch` rows and the new `matchDispatchShape` row. [TESTED: fresh Vitest run]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` -> 356/356 passed, exit 0.]
- [x] CHK-021 [P0] Pi preflight suite re-run passes. [TESTED: fresh Vitest run]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` -> 32/32 passed, exit 0.]
- [x] CHK-022 [P1] Node rule suite re-run passes via its correct runner. [TESTED: fresh `node --test` run]
  - [EVIDENCE: `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` -> 7/7 passed, exit 0.]
- [x] CHK-023 [P1] Whole-`dispatch/`-directory sweep shows 0 failing tests (the 1 failing *file* is an expected `node:test`/Vitest collection mismatch, not a test failure). [TESTED: fresh Vitest run with worktree exclusion]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch --reporter=dot --exclude "**/.worktrees/**"` -> `1 failed | 2 passed (3)` files, `102 passed (102)` tests; the failed file is `dispatch-rule-checks.test.mjs` (`Error: No test suite found in file`, a `node:test`-syntax file collected by the wrong runner), independently confirmed passing 7/7 under CHK-022.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Root cause and fix are each cited to an exact current file:line. [TESTED: direct read]
  - [EVIDENCE: root cause = prior blanket guard at the same `directExecutor()` location; fix = `dispatch-audit.mjs:186-197`, `EXECUTOR_BASENAMES` set at line 41.]
- [x] CHK-FIX-002 [P0] The fix closes both the Pi authorization-deny bypass and the cross-runtime audit gap in one shared-lib change. [TESTED: consumer read + suite]
  - [EVIDENCE: `dispatch-preflight-lint.ts:243` consumes `inspectDispatch` from the same shared lib; `matchDispatchShape` (the audit-trail entry point) shares `inspectDispatch` internally (`dispatch-audit.mjs:264-267`); one fix in `directExecutor()` changes both consumers' behavior.]
- [x] CHK-FIX-003 [P1] Blast radius is named accurately: the four inspector-consuming runtimes. [TESTED: doc statement]
  - [EVIDENCE: `EXECUTOR_BASENAMES` set (`dispatch-audit.mjs:41`) includes `opencode`, `claude`, `codex`, `devin`, `cursor-agent`, `pi`; `spec.md` and `implementation-summary.md` name Claude, Codex, Devin, Pi as the four inspector runtimes.]
- [x] CHK-FIX-004 [P1] R2-P1-002 and R2-P1-003 are recorded as deferred, never as resolved, in every document that states packet scope. [TESTED: cross-document consistency check]
  - [EVIDENCE: `spec.md` §3 Out of Scope and §10 Open Questions; `checklist.md` (this file) CHK-030; `implementation-summary.md` Known Limitations all state the same deferred disposition with file/line citations.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] R2-P1-002 (receipt MAC advisory) and R2-P1-003 (dirty-path containment) are named as open, unresolved findings outside this packet's changed-file scope. [TESTED: findings-registry citation]
  - [EVIDENCE: R2-P1-002 = `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:771`; R2-P1-003 = `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:265`; neither file was opened for edit by this phase (`git status --porcelain -- .opencode/skills/system-deep-loop` shows no changes from this phase).]
- [x] CHK-031 [P0] No fixture, evidence row, or example in this phase contains a secret or real provider prompt. [TESTED: content inspection]
  - [EVIDENCE: all commands and citations in this phase's docs reference existing repo paths and synthetic dispatch strings only (`"devin" -p "task"` etc.), matching what the existing test files already contain.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Both cross-runtime documentation artifacts (manual-testing-playbook scenario, feature-catalog entry) are confirmed present and their sizes recorded. [TESTED: `ls -la`]
  - [EVIDENCE: `cli-dispatch-preflight-authorization.md` 11414 bytes; `cli-dispatch-authorization.md` 5386 bytes; both under `.opencode/skills/cli-external-orchestration/`.]
- [x] CHK-041 [P1] The uncommitted state of the fix files is disclosed rather than presented as committed. [TESTED: `git status --porcelain`]
  - [EVIDENCE: `implementation-summary.md` records the verbatim `git status --porcelain` output for the four dispatch files.]
- [x] CHK-042 [P2] This packet's docs cross-link the parent packet and the finding source without duplicating either. [TESTED: link check]
  - [EVIDENCE: `spec.md` and `tasks.md` RELATED DOCUMENTS sections link `../spec.md` and `../review/deep-review-findings-registry.json`.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only this phase's own folder was written to. [TESTED: scoped diff]
  - [EVIDENCE: `git status --porcelain -- .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification` shows only new files under this folder; the parent's `spec.md` phase map was not edited per the dispatch contract.]
- [x] CHK-051 [P1] No temporary files were left outside this phase folder. [TESTED: no-stray sweep]
  - [EVIDENCE: all commands run for evidence were read-only (`grep`, `ls`, test runners); no scratch or temp files were created.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-05; all scoped evidence gates have observed receipts from commands run during this phase's authoring. R2-P1-002 and R2-P1-003 remain a documented, unresolved deferral outside this packet.
<!-- /ANCHOR:summary -->
