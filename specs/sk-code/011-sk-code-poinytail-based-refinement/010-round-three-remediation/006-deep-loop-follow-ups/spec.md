---
title: "Feature Specification: Phase 6: deep-loop-follow-ups"
description: "The deep-review reducer reads only `- **F###**:` finding bullets, so an iteration written in the agent's numbered shape reaches the registry with no findings, and the cli-pi environment filter drops the PI_BLACKHOLE_PASSIVE variable the cli-pi skill tells dispatchers to set."
trigger_phrases:
  - "deep loop follow ups"
  - "phase 6 deep loop follow ups"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: deep-loop-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/006-deep-loop-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-opencode-and-guards |
| **Successor** | 007-spec-kit-hook-deadlines |
| **Handoff Criteria** | A numbered-shape iteration reduces to its findings, a cli-pi child receives PI_BLACKHOLE_PASSIVE, and both runtime suites pass with the new cases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Round-three remediation child specification.

**Scope Boundary**: The deep-review reducer in `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, the cli-pi environment filter in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, their two test files, the cli-pi `SKILL.md` gotcha and dispatch envelope, one changelog entry for each of the two packets, and the header comment of the deep-review review-mode contract, handed to this child by the orchestrator. No agent file.

**Dependencies**:
- Round-two follow-ups 4 and 5 in `../../009-round-two-follow-ups/goal.md` (Deviations and findings table)
- Follow-up 5 in `../../009-round-two-follow-ups/003-deep-review-case-rule/plan.md` section 6, and that phase's reducer test

**Deliverables**:
- The reducer reads the numbered finding shape the deep-review agent writes, without counting its evidence lines
- The cli-pi environment filter passes `PI_BLACKHOLE_PASSIVE` and still strips unlisted variables
- Tests for both, a cli-pi doc alignment, and version bumps with changelog entries for cli-pi (1.5.14.0) and the deep-loop runtime (1.9.3.0)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`parseFindingsBlock` in `reduce-state.cjs` (line 258 when read) keeps only trimmed lines that match `^-\s+\*\*F\d+\*\*`, but Step 7 of `.skilled/agents/deep-review.md` tells the agent to write `N. **Title** -- file:line -- Description` with Finding class, Scope proof, Affected surface hints and Case lines under it. A fixture in that shape reduces to `findings=0` today, so an iteration that recorded only summary counts shows placeholder findings instead of its real ones. Separately, `isAllowedExecutorEnvKey` in `executor-audit.ts` (line 207) passes cli-pi only the `LLMGATEWAY_` and `CLINE_` prefixes and the common list, so `PI_BLACKHOLE_PASSIVE=true`, which the cli-pi skill (line 199) tells dispatchers to set so pi-blackhole does not compact a child mid-run, never reaches the child.

### Purpose
A deep-review iteration in the agent's own shape reaches the registry with its real findings, and a cli-pi child receives the one variable that keeps it from being compacted mid-run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read numbered findings at the left margin in `reduce-state.cjs`, with the id `R<iteration>-<severity>-<NNN>`, and keep the `- **F###**:` shape unchanged
- Use a numbered narrative finding only for an iteration that recorded no delta finding rows and no `findingDetails`, so a live run is not counted twice
- Pass the single variable `PI_BLACKHOLE_PASSIVE` through the cli-pi environment filter
- Five reducer tests and three environment tests
- Align the cli-pi `SKILL.md` gotcha and the dispatch envelope in `references/providers-and-models.md`
- Bump cli-pi to 1.5.14.0 and the deep-loop runtime to 1.9.3.0, each with a changelog entry
- Reword the header of `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` so the review mode's `review-core.md` owns the severity ids and their meaning, and the contract keeps its own loop rules

### Out of Scope
- `.skilled/agents/deep-review.md` and its mirrors - this child owns no agent file, and Step 7 already describes the shape the reducer now reads
- `lib/deep-loop/iteration-findings.cjs`, the separate numbered-line counter - it already counts numbered lines, and its indented-line hardening is a separate follow-up
- The `- **F###**:` narrative path for an iteration that also has structured rows - its behaviour is unchanged on purpose
- Running the Hermes generator in write mode - the orchestrator runs it once after every build

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Numbered finding parser, block reader, run id plumbing, structured-run fallback rule |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Five tests for both shapes, evidence lines, resolution by id and the structured-row rule |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Exact-key pass-through for `PI_BLACKHOLE_PASSIVE` on cli-pi |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modify | Three tests: filter, other kinds, spawned child |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.3.0.md` | Create | Runtime changelog entry |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Gotcha sentence and version 1.5.14.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Dispatch envelope sets the variable, one bullet explains it |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.14.0.md` | Create | cli-pi changelog entry |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modify | Header comment points to `review-core.md` for severity meanings; no YAML key changes |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | Modify | The contract row says the same as the new header |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modify | Version 1.11.3.0 to 1.11.4.0 |
| `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.4.0.md` | Create | deep-review changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Numbered findings are read | `parseIterationFile` on `scratch/fixtures/iteration-001.md` prints `findings=2 ids=R1-P1-001,R1-P2-001` |
| REQ-002 | Evidence lines are not findings | The fixture's Finding class, Scope proof, Affected surface hints, Case and JSON lines add no finding (REQ-001 count is 2), and the vitest case `does not count the evidence lines` passes |
| REQ-003 | The F### shape still works | The vitest cases `still reads the F### bullet shape` and `reduces an iteration to the same findings when each finding carries a Case line` pass |
| REQ-004 | Reducer readers keep passing | The seven runtime reducer test files pass 151 tests (146 before plus 5), and the out-of-runtime reducer tests match their baselines |
| REQ-005 | PI_BLACKHOLE_PASSIVE reaches a cli-pi child | `buildExecutorDispatchEnv` for cli-pi returns `PI_BLACKHOLE_PASSIVE`, the spawned-child test reads `passive: 'true'` and `unlisted: null`, and every other kind still drops it |
| REQ-006 | Executor suites and types pass | The four executor-audit test files pass 62 tests (59 before plus 3) and `npm run typecheck` in the runtime exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | cli-pi docs say what the code does | The `SKILL.md` gotcha names the filter pass-through, the envelope sets `PI_BLACKHOLE_PASSIVE=true`, and both files stay `VALID` with 0 issues |
| REQ-008 | Versions and changelogs | cli-pi `SKILL.md` reads `version: 1.5.14.0`, both new changelog entries exist and validate with 0 issues |
| REQ-009 | No double counting on real runs | Across the repository's 164 review folders, only the two folders whose numbered iterations have no structured rows change their open-finding count |
| REQ-010 | The deep-review contract defers severity meanings | The contract header names `.skilled/skills/sk-code/sk-code-review/references/review-core.md` as owner of the severity ids and meanings, no longer claims to be the source of truth for them, and its parsed `severities` block still reads `P0:true P1:true P2:true` |
| REQ-011 | The deep-review README and version follow | The README row no longer calls the YAML the source of truth for severities and links `review-core.md`, `SKILL.md` reads `version: 1.11.4.0`, and the README, `SKILL.md` and the new changelog entry validate with 0 issues |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An iteration written exactly as Step 7 of the deep-review agent prescribes reaches the findings registry with one entry per finding and none per evidence line
- **SC-002**: A cli-pi child dispatched by the deep-loop fan-out receives `PI_BLACKHOLE_PASSIVE`, and no other unlisted variable
- **SC-003**: Nothing around the edit regresses: the out-of-runtime reducer tests, the leaf manifests, the runtime mirrors and the compiled routes read as before
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Numbered narratives restate findings that delta rows already hold, with titles worded differently, so they escape the dedup key | High | A numbered finding is used only for an iteration with no structured rows; measured on 164 real folders, 162 unchanged |
| Risk | Two real folders gain findings, one of which may restate another iteration's finding | Low | Both folders had iterations with summary counts only, so the narrative replaces placeholder slots; recorded in plan.md |
| Dependency | Hermes copy of cli-pi `SKILL.md` | `--check` reports drift until regenerated | The orchestrator runs the Hermes generator after all builds |
| Dependency | Compiled deep-review command contract (`.skilled/commands/deep/assets/compiled/deep-review.contract.md`) records a digest of the YAML | `check-contract-drift.cjs` already exits 2 on a stale agent digest and will also see the YAML | The orchestrator re-mints with `compile-command-contracts.cjs --command deep/review --write` after all builds |
| Dependency | Compiled-route manifest for cli-external-orchestration | It could read stale after the `SKILL.md` edit | The builder records it; the re-mint belongs to the orchestrator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The id format, the structured-row rule and the exact-key filter are recorded as decisions in plan.md section 3.
<!-- /ANCHOR:questions -->

---
