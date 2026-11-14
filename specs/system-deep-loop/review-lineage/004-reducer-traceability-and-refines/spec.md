---
title: "Feature Specification: Correct deep-review reducer dead ends and refinement counting"
description: "The deep-review reducer turns deferred traceability checks into BLOCKED dead ends and counts an explicitly linked refinement as a second finding. The packet plans the smallest reducer change, one optional refines field, and three regression tests."
trigger_phrases:
  - "reducer traceability and refines"
  - "false blocked traceability entries"
  - "double counted refinement finding"
  - "deep review findings registry count"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Correct deep-review reducer dead ends and refinement counting

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/385-epic-review-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`parseIterationFile` maps the `Traceability Checks` section to dead ends when an iteration has no `Dead Ends` section (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:349`). `buildExhaustedApproaches` then prints every deferred or partial protocol line as `### ... -- BLOCKED` with `Do NOT retry` (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1807-1834`). Separately, `buildFindingRegistry` keeps two findings that share an id but differ in content (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:954-982`), so a refinement row that names its target is counted as a new open finding.

### Purpose
Make the reducer show only real dead ends as BLOCKED and fold an explicitly linked refinement into its canonical finding, without changing the behavior of an id reuse that carries no link.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured read-only on the review run at `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/review/`:

```text
$ rg -c 'BLOCKED \(iteration' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/review/deep-review-strategy.md
75
$ rg -c '^### .*(checklist_evidence|feature_catalog_code|agent_cross_runtime|playbook_capability).*BLOCKED' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/review/deep-review-strategy.md
33
$ jq '[.openFindings[] | select(.findingId=="R1-P2-001")] | length' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/review/deep-review-findings-registry.json
2
$ jq '[.openFindings[] | select(.severity=="P2")] | length' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/review/deep-review-findings-registry.json
3
```

The review report states two active P2 findings while the registry holds three P2 rows (`review/review-report.md:13`). Iteration 8 records `R1-P2-001` again with `"refinementOf":"R1-P2-001"` in `review/deltas/iter-008.jsonl:1`, and the reducer reads that `findingDetails` row as the only structured source for the refinement.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stop mapping `Traceability Checks` to `deadEnds` in `parseIterationFile`, while keeping explicit `Dead Ends` and `Ruled Out` entries in the exhausted list.
- Add an optional `refines` value to structured iteration findings, read from `findingDetails[]` and `type:"finding"` delta rows.
- Fold a finding that names a resolvable `refines` target into that target, updating `lastSeen`, title, description and transitions, and not adding a second open finding.
- Add one short line to the iteration prompt contract that says when to write `refines`.
- Add a failing-first test for the false BLOCKED output, the refines fold and the unlinked id reuse guard.

### Out of Scope
- Parsing a `Refines:` line from the numbered markdown narrative. The structured `findingDetails[]` row is the primary source, and the reported run carries the link there.
- Changing the conflict behavior for an unlinked id reuse. Two genuinely different findings with one id still both survive.
- Changing `buildTraceabilityRollup`, the `traceabilityChecks` schema, or the dashboard.
- Rewriting the evidence review's derived files.
- Changing any merge, fan-out or synthesis consumer of the findings registry.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Remove the traceability fallback, carry `refines`, fold linked refinements and ignore no-op severity transitions in the churn buckets |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` | Create | Three regression cases: no false BLOCKED, refines folds, unlinked id reuse keeps both |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | One line that says when a finding names the id it refines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Given an iteration markdown file with a `Traceability Checks` section and no `Dead Ends` section, When `parseIterationFile` runs, Then its `deadEnds` array is empty and `buildExhaustedApproaches` prints no BLOCKED entry for a deferred or partial traceability status. |
| REQ-002 | Given an iteration markdown file with an explicit `Dead Ends` entry, When the reducer regenerates the strategy, Then that entry still prints as `### ... -- BLOCKED`. |
| REQ-003 | Given a structured finding row with `refines` naming an existing open finding, When `buildFindingRegistry` runs, Then the target keeps one registry entry, its `lastSeen` becomes the refinement run, its title and description take the refinement text, its transitions gain one refinement transition, and no second open finding appears. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Given a structured finding row that reuses an existing id, differs in content and has no `refines`, When the registry is built, Then both findings remain open exactly as they do today. |
| REQ-005 | Given a `refines` value that names no registry entry, When the registry is built, Then the row is inserted through today's path and the reducer does not throw. |
| REQ-006 | The iteration prompt contract at `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` carries one line saying that `refines` is for an existing finding and must be omitted for a new finding. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` exits 0 with the three named cases passing.
- **SC-002**: The traceability-only fixture produces no `checklist_evidence` entry in the strategy exhausted section, and the explicit dead-end fixture still produces one BLOCKED entry.
- **SC-003**: The refines fixture yields `openFindingsCount` 1 with `lastSeen` 2, and the unlinked reuse fixture yields 2.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node.js built-in `node:test` runner and the existing reducer module export | Tests cannot run without it | The runner is already used by `deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` |
| Risk | Dropping the traceability fallback under-reports a genuinely blocked traceability protocol | Medium | The structured `traceabilityChecks.results` rollup still records blocked and fail statuses in `registry.traceability` |
| Risk | A same-severity refinement transition is counted as severity churn | Medium | The churn filters ignore transitions whose `from` equals `to`, and the refines test asserts `severityChanged` is empty |
| Risk | A refines target is missing because the target finding was never inserted | Low | The row falls back to today's insert path and the fallback test covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fold path uses one existing `Map.get` lookup per finding and adds no file read. The markdown change removes one section lookup.
- **NFR-P02**: The reducer's existing single pass over iteration files and delta records stays single pass.

### Security
- **NFR-S01**: No new input is executed. `refines` is normalized as text and compared with registry keys.
- **NFR-S02**: No new file path, network call or credential is introduced.

### Reliability
- **NFR-R01**: A missing or unknown `refines` value reduces exactly as the same run does today.
- **NFR-R02**: An iteration with neither `Dead Ends` nor `Traceability Checks` renders `[No exhausted approach categories yet]`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an iteration with no `Dead Ends` and no `Traceability Checks` adds nothing and the strategy renders `[No exhausted approach categories yet]`.
- Maximum input: an iteration with six deferred traceability protocols adds zero BLOCKED entries, and an explicit `Dead Ends` section with six entries adds six.
- Failure path: a `refines` value that names no open finding inserts the row through the ordinary path instead of throwing or dropping it.
- Same-severity refinement: the target keeps its severity, gains a refinement transition, stays in `persistentSameSeverity` and does not enter `severityChanged`.
- Severity-changing refinement: the transition records the old and new severity once and `lastSeen` still advances.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One reducer file, one new test file and one prompt template line |
| Risk | 8/25 | Finding counts and strategy output change, and the fix has no data migration |
| Research | 6/20 | The evidence run and every reader of `deadEnds` and traceability were read |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
