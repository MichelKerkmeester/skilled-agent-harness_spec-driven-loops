---
title: "Feature Specification: Phase 13: devin-compaction-fallback-budget"
description: "The Devin post-compaction hook cut its recovery notice to 4099 bytes and dropped the recovery pointer whenever the history engine's build output was missing, which is every CI run, so Spec-Kit Check stayed red on main."
trigger_phrases:
  - "devin compaction fallback budget"
  - "phase 13 devin compaction fallback budget"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: devin-compaction-fallback-budget

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/427-devin-compaction-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-opencode-model-carry |
| **Successor** | None |
| **Handoff Criteria** | The Devin compaction cases pass with and without the history engine's build output, and Spec-Kit Check is green on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the history lookup hand-over integration specification. It fixes the one red CI check left after phases 11 and 12 merged.

**Scope Boundary**: The Devin post-compaction hook's section fitter and the compaction adapter test file. Nothing in the history engine, the Pi or DSH adapters, or the CI workflow changes.

**Dependencies**:
- `fitRecoverySections` in `.skilled/hooks/session-handover/history/lib/lookup-offer.ts`, whose behavior the hook now copies.

**Deliverables**:
- A Devin hook whose recovery notice stays within 4096 bytes with the recovery pointer whole, whether or not the history engine is built.
- Tests that fail on the old hook when the build output is absent and pass on the new one.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` loaded its section fitter from the history engine's build output, `history/dist/lookup-offer.js`, which is gitignored. When that file is missing, the hook fell back to cutting the joined text at 4096 bytes and appending `...`, so the notice came out at 4099 bytes and lost the `## Recovery` pointer. Spec-Kit Check runs the runtime suite before it builds the history engine, so the Devin case failed on every main push while it passed on any machine that had the build.

### Purpose
The Devin hook fits its notice the same way everywhere: at most 4096 bytes, only the summary shortened, the recovery pointer whole.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
With `history/dist/` moved aside in a fresh worktree, the CI command on the compaction test file:
```text
$ cd .opencode/skills/system-spec-kit/runtime && npx vitest run --config ../vitest.config.ts --project root tests/compaction-adapters.vitest.ts
     × keeps the recovery pointer whole when a long summary fills the budget 2ms
 FAIL  |root| runtime/tests/compaction-adapters.vitest.ts > Devin post-compaction context > keeps the recovery pointer whole when a long summary fills the budget
AssertionError: expected 4099 to be less than or equal to 4096
 Test Files  1 failed (1)
      Tests  1 failed | 11 passed (12)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the hook's build-output fitter and its byte-cut fallback with one in-file fitter that matches `fitRecoverySections` branch for branch.
- Cut on a character boundary so a multi-byte summary never ends in a replacement character.
- Add a multi-byte case and a parity case that compares the hook's fitter with the engine's TypeScript fitter on five inputs.

### Out of Scope
- Reordering the Spec-Kit Check steps so the history engine builds first. It would turn CI green while a fresh checkout without the build kept dropping the pointer.
- `relaunch-core.cjs` and `history-lookup-entry.test.cjs`, which also load the build output. They belong to the hand-over claim path, which needs the built engine by design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | Modify | Drop the build-output `require`, add the in-file fitter |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts` | Modify | Add the multi-byte case and the five parity cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Devin notice stays within 4096 bytes with the recovery pointer whole when the history engine is not built | With `history/dist/` absent, the compaction test file prints `Tests  18 passed (18)` |
| REQ-002 | The new tests catch the old hook | With `history/dist/` absent and the old hook restored, the same file prints `Tests  5 failed | 13 passed (18)` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The hook's fitter gives the same text as the engine's fitter | The five parity cases pass |
| REQ-004 | No other runtime case regresses | The runtime root project and the history engine suites pass with the build present |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The compaction test file passes with and without `history/dist/`.
- **SC-002**: Spec-Kit Check is green on the main push that carries this fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `fitRecoverySections` in `lookup-offer.ts` | A later change there leaves the hook's copy behind | The parity cases fail as soon as the two fitters disagree |
| Risk | The hook's fitter differs from the engine's on an input the cases miss | Low | The five cases cover every branch: no summary, fits whole, summary shortened, kept sections over budget, multi-byte cut |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The handoff asked to fix the fallback. Removing the build-output path instead was chosen so the same code runs locally and in CI, and the operator is told so before the merge.
<!-- /ANCHOR:questions -->

---
