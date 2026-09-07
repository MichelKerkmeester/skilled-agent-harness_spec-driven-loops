---
title: "Tasks: Phase 1: hook-adapter-thin-transports"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook adapter task breakdown"
  - "spec gate migration tasks"
  - "adapter verification checklist"
  - "runtime trio line count"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: hook-adapter-thin-transports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `hooks/lib/spec-gate/spec-gate-core.mjs` fully and catalog every exported function the five adapters call today (`hooks/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T002 Diff claude/codex/cursor/devin's `spec-gate-classify.mjs` pairwise to mark the exact duplicated block boundaries (`hooks/claude/spec-gate-classify.mjs`, `hooks/codex/spec-gate-classify.mjs`, `hooks/cursor/spec-gate-classify.mjs`, `hooks/devin/spec-gate-classify.mjs`)
- [ ] T003 [P] Diff the same four runtimes' `spec-gate-enforce.mjs` pairwise (`hooks/claude/spec-gate-enforce.mjs`, `hooks/codex/spec-gate-enforce.mjs`, `hooks/cursor/spec-gate-enforce.mjs`, `hooks/devin/spec-gate-enforce.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a runtime-parameterized classify orchestration function to `spec-gate-core.mjs` (`hooks/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T005 Add a runtime-parameterized enforce orchestration function to `spec-gate-core.mjs` (`hooks/lib/spec-gate/spec-gate-core.mjs`)
- [ ] T006 Widen `hook-adapter-shared.mjs` with the JSON-stdin-read helper the four `shared.ts` files each restate (`hooks/lib/hook-adapter-shared.mjs`)
- [ ] T007 Migrate claude's classify and enforce hooks onto the new core functions (`hooks/claude/spec-gate-classify.mjs`, `hooks/claude/spec-gate-enforce.mjs`)
- [ ] T008 Run `spec-gate-claude.test.mjs` and confirm it still passes before touching the next runtime (`hooks/claude/spec-gate-claude.test.mjs`)
- [ ] T009 Migrate codex's classify and enforce hooks (`hooks/codex/spec-gate-classify.mjs`, `hooks/codex/spec-gate-enforce.mjs`)
- [ ] T010 Run `spec-gate-codex.test.mjs` (`hooks/codex/spec-gate-codex.test.mjs`)
- [ ] T011 Migrate cursor's classify and enforce hooks, leaving `spec-gate-prebind.mjs` untouched (`hooks/cursor/spec-gate-classify.mjs`, `hooks/cursor/spec-gate-enforce.mjs`)
- [ ] T012 Run `spec-gate-prebind.test.mjs` and confirm cursor's classify/enforce still pass (`hooks/cursor/spec-gate-prebind.test.mjs`)
- [ ] T013 Migrate devin's classify and enforce hooks, leaving `permission-request-policy.mjs` untouched (`hooks/devin/spec-gate-classify.mjs`, `hooks/devin/spec-gate-enforce.mjs`)
- [ ] T014 Run `spec-gate-devin.test.mjs` (`hooks/devin/spec-gate-devin.test.mjs`)
- [ ] T015 Migrate pi's classify and enforce hooks onto the same shared core functions the other four now call (`hooks/pi/spec-gate-classify.ts`, `hooks/pi/spec-gate-enforce.ts`)
- [ ] T016 Remove the now-dead duplicated glue left in each runtime's `shared.ts`, keeping only the genuinely runtime-specific transport code and the unchanged lifecycle spawnSync bridge (`hooks/claude/shared.ts`, `hooks/codex/shared.ts`, `hooks/cursor/shared.ts`, `hooks/devin/shared.ts`)
- [ ] T017 Update `hooks/README.md`'s architecture section to name the new single call site (`hooks/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run the three cross-runtime regression suites: `directive-lifecycle-adapter-parity.vitest.ts`, `completion-evidence-sentinel.vitest.ts`, `hook-completion-evidence-stop.vitest.ts` (`runtime/tests/`)
- [ ] T019 Run `spec-gate-core.test.mjs` against the new orchestration exports (`hooks/lib/spec-gate/spec-gate-core.test.mjs`)
- [ ] T020 Measure `wc -l` for claude/codex/cursor/devin's classify+enforce+shared trio and confirm each is under 200 lines
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md sections 3-5 name the extraction target, affected surfaces and test suites]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `ls hooks/lib/spec-gate/spec-gate-core.mjs` and the eight named test files all resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: the runtime's existing lint command exits 0 on the touched `.mjs`/`.ts` files]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: `node --check` on each modified `.mjs` file and a clean TypeScript build for `.ts` files]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: each runtime's own try/catch around the shared call still exists post-migration]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: the migrated files match the in-process-import shape `spec-gate-core.mjs` already documents]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every AC row Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: pi extension smoke test transcript per hooks/pi/README.md]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: malformed-payload and session-file-lookup-failure paths exercised per spec.md's Edge Cases section]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: a forced `classifyIntent` throw still yields each runtime's own fail-open response]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: this is a `cross-consumer` refactor across 5 runtimes, recorded in plan.md's affected-surfaces table]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: plan.md's `rg -n "classifyIntent|evaluateMutation"` inventory lists all 5 call sites]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: plan.md's affected-surfaces table names every consumer, including the explicitly-unchanged lifecycle hooks and live registrations]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: not applicable: this phase does not touch path, parser, or redaction logic. N/A recorded here rather than left blank]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md states the 5 runtimes x 2 hook types = 10 call site matrix]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: `process.env` passthrough tested via each runtime's existing test fixtures, which already vary env]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table pins the commit SHA once implementation lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: `rg -n "sk-|api[_-]?key|secret" hooks/{claude,codex,cursor,devin,pi}` returns nothing new]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: `parseJsonFailOpen` continues to gate every stdin read after the widen in hook-adapter-shared.mjs]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: this phase carries no auth surface. The Gate-3 fail-open contract is the analogous control and is covered by CHK-023]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same 14-file scope and the same 8 test suites]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: the new shared functions in spec-gate-core.mjs carry the same header-comment convention the file already uses]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: hooks/README.md's architecture section names the new call site]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray files outside `scratch/` for this packet]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` shows only `.gitkeep` at closure]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
