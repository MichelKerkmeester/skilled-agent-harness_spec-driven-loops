---
title: "Tasks: Phase 13: gate1-instruction-parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate 1 instruction parity"
  - "runtime instruction file drift"
  - "codex nodeterm block boundary"
  - "trigger index lookup pointer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: gate1-instruction-parity

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

- [ ] T001 Investigate whether the Pi CLI reads a root-level `AGENTS.md` automatically, using vendor documentation first and a live probe as fallback (`.pi/SYNC.md`)
- [ ] T002 Record the investigation's answer and its source in `.pi/SYNC.md`, alongside the sibling runtime manifests it already cross-references
- [ ] T003 [P] Confirm the current nodeterm marker boundaries in `.codex/AGENTS.md` have not moved since spec time, before any generator writes near them
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the Gate 1 pointer generator script under `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/`, reading the Gate 1 lookup line from root `AGENTS.md` (currently `AGENTS.md:83`)
- [ ] T005 Generator writes the Codex pointer block into `.codex/AGENTS.md`, placed strictly outside the nodeterm markers found in T003
- [ ] T006 Generator writes the shared Gate 1 pointer into `.cursor/rules/skill-routing.md`
- [ ] T007 [P] Add a `--check` mode to the generator that reports drift without writing, mirroring `sync-runtime-mirrors.cjs --check`
- [ ] T008 [B] If T001 finds Pi does not read root `AGENTS.md` automatically, wire the Gate 1 pointer into `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` (or `session-start-context.ts`, whichever fits the existing injection shape better) - blocked on T001's answer
- [ ] T009 Add the `gate1_instruction_parity` entry to `staleness_signals` in `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml`
- [ ] T010 Add the matching phase 0 discovery activity in the same file, reading all five runtimes' real surfaces
- [ ] T011 Update `.cursor/SYNC.md` to describe the generated block now living alongside the hand-authored content in `rules/skill-routing.md`
- [ ] T012 Correct the single-surface claim at `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:87`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the generator's `--check` mode against the repository and confirm zero drift
- [ ] T014 Diff `.codex/AGENTS.md`'s nodeterm-marked region before and after the generator run and confirm it is byte-identical
- [ ] T015 Run the doctor workflow's phase 0 discovery (`/doctor speckit-retrieval`) and confirm the `gate1_instruction_parity` signal reports the expected per-runtime reach
- [ ] T016 Update `spec.md`, `plan.md` and this document's own state to reflect what shipped
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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-006]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3 names the generate-and-check pattern and the three key components]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md section 6 names the doctor workflow, the Pi investigation and the nodeterm ownership boundary as the three dependencies]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: the generator script's own npm-run-check output, once T004 lands]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: a clean run of the generator's `--check` mode from T013]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: the generator fails closed on a missing or unreadable instruction file per NFR-R02, verified by a deliberately-missing-file test run]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: side-by-side structural comparison with `sync-runtime-mirrors.cjs`'s generate-plus-check shape]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, every AC-ID row Met or Waived with an ADR]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: the doctor workflow phase 0 run from T015, with its printed per-runtime report attached]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: a run against a repository state where the nodeterm markers have moved, confirming the generator fails closed rather than writing at a guessed offset]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: a run with `.codex/AGENTS.md` temporarily removed, confirming the doctor check reports MISSING rather than a false pass]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: this phase's findings are documentation/coverage gaps (cross-consumer: one canonical line, five consuming surfaces), not a code defect with a matrix of inputs]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: `rg -n "trigger index lookup" AGENTS.md .codex .cursor .devin .pi` before and after, showing exactly one producer (root AGENTS.md) and five consumers]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: the Files to Change table in spec.md section 3 names every consuming surface touched]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable. This phase touches no parser, path-redaction or security-sensitive code path]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: the five-runtime table in spec.md's problem statement is the full matrix. No additional axis exists]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. The generator reads only checked-in files, no environment variables or global state]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: the closing commit SHA, once implementation lands, is recorded in implementation-summary.md]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: the generator and pointer content contain only a repo-relative path reference, verified by reading the generated block]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: the generator validates the nodeterm marker boundaries exist before writing, per NFR-R02]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No authentication or authorization surface exists in this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: this document's task list matches plan.md's phases and spec.md's requirements one for one]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: the generator script's header comment states its source, target and the nodeterm-boundary invariant it must never violate]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: `runtime/cli/retrieval/README.md:87` and `.cursor/SYNC.md` updated per T011 and T012]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` on this packet's folder shows no stray file outside `scratch/`]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` is empty or holds only the `.gitkeep` placeholder at completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
