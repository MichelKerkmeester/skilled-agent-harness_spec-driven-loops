---
title: "Feature Specification: Phase 13: UX and alignment pass"
description: "Phase 017 left four overlay engine P2s and one older apply failure open, the doctor surfaces tell the operator what happened without always saying why or what to run next, and the drift guards fail on an archived research script. This phase fixes all of it in Skilled, runs both alignment commands and fixes every finding."
trigger_phrases:
  - "ux and alignment pass"
  - "phase 13 ux and alignment pass"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: UX and alignment pass

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/506-ux-and-alignment-pass` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 17 |
| **Predecessor** | 012-review-round-2-fixes |
| **Successor** | 014-overlay-folder-readmes |
| **Handoff Criteria** | The branch merges into local Skilled main with every gate at or above its baseline and a final review APPROVED with no P0 or P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the overlay framework/root layout packet. It runs in Skilled. An ai-speckit session runs Barter's half in parallel and hands upstream-caused items over through a scratch file.

**Scope Boundary**: Skilled code and docs only. Barter's overlays, hooks and docs belong to the ai-speckit session.

**Dependencies**:
- Phase 011's push and re-pin, so both repositories start from `542748515e8`.
- The handoff file the ai-speckit session writes, read before the final review and again at the end.

**Deliverables**:
- The engine fixes, the UX changes, the alignment and drift fixes and the vitest fix, each committed with its test, and one merge into local main.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 017 left four P2s in the overlay engine's cache handling and its README role, and an apply that turns a folder into a file or a link still fails. The drift guards exit 1 on main because of one archived research script, and the deep-loop suite has a case that reads the operator's own Pi settings.

### Purpose
Every open engine item is fixed at source with a test, every doctor-facing message says what happened, why and what to run next, and both alignment commands and every drift guard come back clean.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh   (main, 65751f8d61a)
- specs/system-deep-loop/.../research_archive/20261120T125555Z/lineages/opus/.executor-state/post.sh:1 [SH-SHEBANG] [ERROR] Missing canonical bash shebang.
FAIL: alignment-drift  (verify_alignment_drift.py --check-router)
run-all-drift-guards: 1 guard(s) FAILED

$ npx vitest run --no-coverage   (system-deep-loop/runtime, main)
Test Files  1 failed | 210 passed (211)
Tests  1 failed | 3887 passed | 11 skipped (3899)
FAIL tests/unit/executor-config.vitest.ts > ... ships no default provider and keeps its default model first among the enabled models
AssertionError: expected 'openai/gpt-6-luna' to be 'llmgateway/deepseek-v4.1-flash-1017'
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the four open P2s from phase 017 and the folder-to-file or link change in one apply, each with a red test first.
- Amend phase 014's README contract and `references/overlays.md` for the `retained` README change.
- Run a UX pass over the engine and `/doctor:*` output, hook refusal messages, onboarding docs and the `/doctor:*` setup and confirm steps, inventory first.
- Run `/local-skilled-alignment` on the `opus-high` preset and `/local-doc-alignment` over the doctor skill, the doctor commands and the overlay layout, plus the drift guards and `doctor:runtime-mirrors`, and fix every finding.
- Reproduce the fanout salvage-miss vitest case, harden the deep-loop cases that read ambient settings, and fix every upstream item in the ai-speckit handoff.

### Out of Scope
- Barter's overlays, hooks and docs - the ai-speckit session owns them.
- Pushing Skilled - the operator pushes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` and its tests | Modify | The cache P2s, the README role, folder-to-file apply and the engine messages |
| `.skilled/commands/doctor/**`, `.skilled/hooks/**`, `.skilled/scripts/git-hooks/**`, `.skilled/skills/sk-git/scripts/hooks/**` | Modify | Doctor output, setup steps and hook refusal messages |
| `INSTALL-SKILLED.md`, `README.md`, `.skilled/skills/system-skilled-doctor/**` | Modify | Onboarding docs and the overlay reference |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` and its test | Modify | Archived deep-loop run scripts under `specs/` are run records |
| `.skilled/skills/system-deep-loop/runtime/**` | Modify | The vitest cases that read ambient settings |
| `014-overlay-folder-readmes/scratch/overlay-readme-contract.md`, this folder | Modify | The contract amendment and this phase's record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each engine item has a test that failed before its fix and passes after, and the engine suite stays at 362 or more passing with 0 failing |
| REQ-002 | `run-all-drift-guards.sh` exits 0 on the merged main |
| REQ-003 | The final `@review` over the branch returns APPROVED with no P0 or P1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every alignment finding, P2 included, is fixed or recorded with the reason it is not |
| REQ-005 | Every UX message changed says what happened, why and the exact next command, with one vocabulary |
| REQ-006 | The deep-loop suite passes in full on the merged main, and the salvage-miss case is reproduced or its inputs are hardened |
| REQ-007 | Each handoff item is fixed or recorded with the reason it is not |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every gate in `plan.md` reports at or above its baseline on the merged main.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The ai-speckit handoff file | Upstream items arrive late | Read it before the final review and again at the end |
| Risk | Message rewording breaks tests that match the old text | Med | Update the matching assertions in the same commit and keep each suite's count at or above baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A repin backup copies no cache files, so its size does not grow with the caches below a destination.
- **NFR-P02**: N/A: no other path changes its cost.

### Security
- **NFR-S01**: No change widens what the overlay edit guard or the commit gate allows.
- **NFR-S02**: N/A: no credential or network path changes.

### Reliability
- **NFR-R01**: A cache the engine cannot delete no longer fails an apply whose content succeeded.
- **NFR-R02**: A content delete failure still fails the apply.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an overlay entry with no cache files ships and backs up as before.
- Maximum input: a skill-root destination with thousands of cache files backs up none of them.
- Failure path: a cache folder without write permission leaves a notice naming the folder and the rerun command, and the exit code follows the content result.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 30 files across the engine, doctor commands, hooks, docs and the deep-loop runtime |
| Risk | 12/25 | Messages that tests and Barter's hooks match on |
| Research | 8/20 | The alignment runs and the vitest reproduction |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator's settings decide every choice: fix every finding, P2 included.
<!-- /ANCHOR:questions -->

---
