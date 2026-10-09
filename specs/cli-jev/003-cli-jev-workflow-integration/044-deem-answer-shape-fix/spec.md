---
title: "Feature Specification: Phase 44: deem-answer-shape-fix"
description: "cli-deem expects noul and score answers in shapes the real local Deem server never sends, and two scorers read judgment output one level too shallow, so their Deem arms can never measure. This phase makes every reader follow the real tools."
trigger_phrases:
  - "deem answer shape fix"
  - "cli-deem noul value"
  - "deem score level"
  - "judgment envelope depth"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 44: deem-answer-shape-fix

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 44 of 44 |
| **Predecessor** | 043-label-finding-fixes |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: the cli-deem suite passes more than 34 tests, the client gets a number or a known key from the local server for `noul`, `choice` and `score`, the 027 and 026 suites pass with envelope-shaped stubs, the cross-family review leaves no open P0 or P1, and `validate.sh --strict` passes on this phase and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 44** of the cli-jev workflow integration specification.

**Scope Boundary**: the three readers that disagree with the real tools, their tests, the cli-deem docs that describe the answer shape, and the correction of 043's record. The operator asked for the fix on 2026-10-02.

**Dependencies**:
- The local Deem server at `127.0.0.1:8300`, model `deem-0.8-v1`, for the post-fix check.
- The installed `jev` CLI's print code, read without a call.

**Deliverables**:
- `cli-deem` passes `noul` and `score` answers through in the server's shape and still maps `choice` text to its key.
- 027's stop rater and 026's completion-claim Deem arm read `answers.answer`.
- Test stubs that print what the real tools print.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The local Deem server answers `noul` with `{"noul": <number>}` and `score` with a numeric `score`, index-keyed `probabilities` and a `legend`. `cli-deem` reads `value` for `noul` and a `level` label for `score`, so every real `noul` and `score` call exits 1. 043 recorded this as a server fault. Separately, real `cli-deem` and `jev` print the full `answers.answer` envelope, but 027's stop rater reads `score` and 026's Deem arm reads `noul` at the top level. Each test stub prints the shape its code expects, so every suite passes while no real call can be measured.

### Purpose
Every Deem and Jev judgment the scorers ask reaches a measured answer on the real tools, and the tests fail if a reader drifts from the real shape again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `cli-deem.mjs` `translateAnswer`: `noul` and `score` pass through in the server's shape after a range check. `choice` keeps its text-to-key map.
- 027's stop rater, both arms, and 026's `parseNoul` read `answers.answer`.
- Each changed suite's stubs print the real shapes, with a case where the old shape fails.
- The cli-deem docs that describe the answer shape, a cli-deem changelog entry and its version.
- 043's log row and implementation summary, which blame the server.

### Out of Scope
- A live scorer run with `--deem` or `--jev`. It needs the operator's separate yes.
- Scorers that already read `answers.answer`. The sweep found them correct.
- The Deem server itself. It follows the shape the Jev reference clients use.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Modify | `translateAnswer` for `noul` and `score` |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Modify | Real-shape fake answers and old-shape failure cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Modify | Both arms read `answers.answer` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Modify | Envelope stubs |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Modify | `parseNoul` reads `answers.answer` |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Modify | Envelope stub for `cli-deem` |
| `.skilled/skills/cli-classifier/cli-deem/` docs | Modify | README, SKILL.md, wire contract, catalog, playbook, new changelog entry |
| `../043-label-finding-fixes/goal.md` and `implementation-summary.md` | Modify | Correct the recorded cause |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `cli-deem noul` and `cli-deem score` exit 0 on the real server's answer shapes and print the server's number unchanged |
| REQ-002 | `cli-deem` exits 1 on a `noul` outside [0, 1], a `score` outside [0, levels - 1] and the old `value` and `level` shapes |
| REQ-003 | 027's stop rater and 026's completion-claim Deem arm read the number from `answers.answer`, and a top-level-only answer counts as unmeasured |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every changed suite's stub prints the shape the real tool prints |
| REQ-005 | The cli-deem docs describe the shapes the server sends, and 043's record names the client as the cause |
| REQ-006 | One DeepSeek V4.1 Flash review covers the changes. P0 and P1 are fixed and P2 recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cli-deem noul`, `choice` and `score` against the local server each exit 0 and print a number or a known key.
- **SC-002**: Each changed suite passes from the final state with more tests than its baseline and 0 failing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller relied on `score` being an integer position | Med | Both `score` consumers already round a float, as the Jev shape requires |
| Risk | Another Deem server version answers in the old shape | Low | The client exits 1 with a named reason instead of misreading |
| Dependency | The local Deem server for the post-fix check | Low | It answered on 2026-10-02 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No scorer's default run makes a model call.

### Security
- **NFR-S01**: No script holds, reads or prints a credential.
- **NFR-S02**: Only the local Deem server is called, and nothing leaves the machine.

### Reliability
- **NFR-R01**: An answer in an unexpected shape is an exit 1 or an unmeasured row, never a misread number.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A `noul` of exactly 0 or 1 and a `score` of exactly 0 or levels - 1 pass.
- A `score` answer with no `probabilities` still passes.

### Error Scenarios
- An old-shape answer exits 1 in `cli-deem` and counts as unmeasured in the scorers.
- A body that does not parse counts as unmeasured, as before.

### State Transitions
- Not applicable. Each call is independent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three scripts, three test files and the cli-deem docs |
| Risk | 8/25 | Offline scorers and a local client |
| Research | 4/20 | The cause and its reach were traced before planning |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator asked for the fix on 2026-10-02.
<!-- /ANCHOR:questions -->

---
