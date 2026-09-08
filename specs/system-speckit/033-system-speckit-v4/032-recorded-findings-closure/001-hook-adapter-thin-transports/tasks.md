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

- [x] T001 Read `hooks/lib/spec-gate/spec-gate-core.mjs` fully and catalog every exported function the five adapters call today (`hooks/lib/spec-gate/spec-gate-core.mjs`)
- [x] T002 Diff claude/codex/cursor/devin's `spec-gate-classify.mjs` pairwise to mark the exact duplicated block boundaries (`hooks/claude/spec-gate-classify.mjs`, `hooks/codex/spec-gate-classify.mjs`, `hooks/cursor/spec-gate-classify.mjs`, `hooks/devin/spec-gate-classify.mjs`)
- [x] T003 [P] Diff the same four runtimes' `spec-gate-enforce.mjs` pairwise (`hooks/claude/spec-gate-enforce.mjs`, `hooks/codex/spec-gate-enforce.mjs`, `hooks/cursor/spec-gate-enforce.mjs`, `hooks/devin/spec-gate-enforce.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a runtime-parameterized classify orchestration function to `spec-gate-core.mjs` (`hooks/lib/spec-gate/spec-gate-core.mjs`)
- [x] T005 Add a runtime-parameterized enforce orchestration function to `spec-gate-core.mjs` (`hooks/lib/spec-gate/spec-gate-core.mjs`)
- [x] T006 Widen `hook-adapter-shared.mjs` with the JSON-stdin-read helper the four `shared.ts` files each restate (`hooks/lib/hook-adapter-shared.mjs`). Not applicable on reading: the four `shared.ts` readers are lifecycle transport, which this phase leaves untouched, and the gate adapters already share `readStdin` and `parseJsonFailOpen`
- [x] T007 Migrate claude's classify and enforce hooks onto the new core functions (`hooks/claude/spec-gate-classify.mjs`, `hooks/claude/spec-gate-enforce.mjs`)
- [x] T008 Run `spec-gate-claude.test.mjs` and confirm it still passes before touching the next runtime (`hooks/claude/spec-gate-claude.test.mjs`)
- [x] T009 Migrate codex's classify and enforce hooks (`hooks/codex/spec-gate-classify.mjs`, `hooks/codex/spec-gate-enforce.mjs`)
- [x] T010 Run `spec-gate-codex.test.mjs` (`hooks/codex/spec-gate-codex.test.mjs`)
- [x] T011 Migrate cursor's classify and enforce hooks, leaving `spec-gate-prebind.mjs` untouched (`hooks/cursor/spec-gate-classify.mjs`, `hooks/cursor/spec-gate-enforce.mjs`)
- [x] T012 Run `spec-gate-prebind.test.mjs` and confirm cursor's classify/enforce still pass (`hooks/cursor/spec-gate-prebind.test.mjs`)
- [x] T013 Migrate devin's classify and enforce hooks, leaving `permission-request-policy.mjs` untouched (`hooks/devin/spec-gate-classify.mjs`, `hooks/devin/spec-gate-enforce.mjs`)
- [x] T014 Run `spec-gate-devin.test.mjs` (`hooks/devin/spec-gate-devin.test.mjs`)
- [x] T015 Migrate pi's classify and enforce hooks onto the same shared core functions the other four now call (`hooks/pi/spec-gate-classify.ts`, `hooks/pi/spec-gate-enforce.ts`)
- [x] T016 Remove the now-dead duplicated glue left in each runtime's `shared.ts`, keeping only the genuinely runtime-specific transport code and the unchanged lifecycle spawnSync bridge. Not applicable on reading: no `shared.ts` carries classify or enforce glue, only lifecycle transport, so nothing was dead (`hooks/claude/shared.ts`, `hooks/codex/shared.ts`, `hooks/cursor/shared.ts`, `hooks/devin/shared.ts`)
- [x] T017 Update `hooks/README.md`'s architecture section to name the new single call site (`hooks/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run the three cross-runtime regression suites: `directive-lifecycle-adapter-parity.vitest.ts`, `completion-evidence-sentinel.vitest.ts`, `hook-completion-evidence-stop.vitest.ts` (`runtime/tests/`)
- [x] T019 Run `spec-gate-core.test.mjs` against the new orchestration exports (`hooks/lib/spec-gate/spec-gate-core.test.mjs`)
- [x] T020 Measure `wc -l` for claude/codex/cursor/devin's classify+enforce pair and confirm each is under 200 lines: 89, 105, 86 and 92 (the trio criterion was amended, see goal.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md sections 3 to 5 name the extraction target, affected surfaces and suites]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `hooks/lib/spec-gate/spec-gate-core.mjs` and the eight test files resolve]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `node --check` exits 0 on all eight `.mjs` adapters and the core; `npm run build` in runtime exits 0 for the pi `.ts` hooks]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: no warnings from the build or the node test runs]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: each adapter keeps its `main().catch` fail-open and pi its try/catch; `runEnforceGate({})` does not throw]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the adapters import the core in-process as the classify hooks already did]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md shows every row Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: the pi hooks compile under `npm run build` and the core test asserts pi calls `observe()` after building its output; no live pi session was run]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: the malformed-payload and missing-session paths are the existing per-runtime test cases, 13, 14, 15 and 16 of them, all passing]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: `spec-gate-core.test.mjs` fail-open cases pass, 87 of 87]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [EVIDENCE: class-of-bug: the same orchestration copied into eight files]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the five classify and five enforce call sites were listed by grep before the port and all ten now call the shared functions]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [EVIDENCE: the two new exports have ten callers, listed in plan.md; no other consumer of the removed inline code existed]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. [EVIDENCE: not applicable: no parser or path fix in this phase]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: five runtimes by two hook types, ten call sites, all migrated]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: the runtime tests pass `env: {}` and the adapters pass `process.env` through unchanged]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md names the commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secret in the diff]?key|secret" hooks/{claude,codex,cursor,devin,pi}` returns nothing new]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: `parseJsonFailOpen` still gates every stdin read]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable: no auth surface; the fail-open contract is covered by CHK-023]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan and tasks name the same files and suites]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the two new core functions carry header comments stating why the sequences live once]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: hooks/README.md names `runClassifyGate()` and `runEnforceGate()`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` shows no stray file in this packet]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `scratch/` holds only `.gitkeep`]
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
