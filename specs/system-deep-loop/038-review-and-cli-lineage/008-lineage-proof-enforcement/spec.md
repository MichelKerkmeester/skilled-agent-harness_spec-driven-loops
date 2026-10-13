---
title: "Feature Specification: Phase 8: lineage-proof-enforcement"
description: "The fan-out runner reports a CLI lineage fulfilled without checking its route proof, without running the reducer and without bounding its citations. A lineage with no dashboard merges on a warning, and the state log can carry every iteration twice."
trigger_phrases:
  - "lineage proof enforcement"
  - "phase 8 lineage proof enforcement"
  - "fanout fulfilled without route proof"
  - "lineage missing dashboard merged"
  - "duplicate state log rows lineage"
  - "citation past end of file lineage"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: lineage-proof-enforcement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-12 |
| **Branch** | `scaffold/008-lineage-proof-enforcement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-lineage-reducer-compliance |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, with the fixture tests failing against the current runner and merge and passing after |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Review and CLI lineage specification.

**Scope Boundary**: Make the fan-out runner and merge refuse a CLI lineage whose proof is incomplete. Route proof, reducer output, one state row per iteration and in-bounds citations are the four proofs. Reducer path handling stays as phase 006 left it, and the dashboard stamp check stays as phase 007 left it.

**Dependencies**:
- Phase 007, which added the dashboard stamp check this phase tightens
- The live run kept at `AI Systems/Moneybird Accountant/specs/011-skill-routing-research/003-research-expansion/research/` in the consuming repository, the evidence every finding below was checked against

**Deliverables**:
- A lineage gate in the runner that runs the iteration verifier before a lineage counts as fulfilled
- A merge that refuses a research lineage with no reducer dashboard, or a runner that runs the reducer itself
- A named producer for the duplicate state rows, fixed at that producer
- A citation-bounds check on lineage findings

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A four-lineage cli-pi research run on 2026-10-12 reported 4 of 4 fulfilled. Two of the four lineages, `deepseek-3` and `deepseek-4`, left no `deep-research-dashboard.md`, so the reducer never ran for them, and the merge accepted both on a warning. Lineage `deepseek-4` holds 11 state rows for 5 iterations. The first 5 are the gateway projection, which keeps 7 fields and drops route proof. The last 5 are the leaf's own direct writes of the same records with route proof restored, and the leaf says so in its own stdout. One merged finding cites `references/2026/README.md:83` in a file that has 81 lines.

Four code paths let that through. The runner sets a lineage to `fulfilled` on the completed event at `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:265-272` and never calls `verify-iteration.cjs`, which owns the route-proof check at `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:243-259`. The runner never calls `reduce-state.cjs`, and `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:719` maps a missing dashboard to `unverified`, which `:1486-1494` merges with a warning. The projection at `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:214-224` drops the leaf's route-proof fields, which is what moved the leaf to write them in a second time. Nothing in the deep-loop runtime checks a cited line against the length of the cited file.

### Purpose
A CLI lineage counts as fulfilled only when its route proof, its reducer output, its one-row-per-iteration state log and its citations all check out, and the merge refuses one that does not.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Call the iteration verifier for every iteration of a CLI lineage before the runner returns it as fulfilled
- Close the missing-dashboard gap, either by refusing it at merge or by running the reducer in the runner, chosen during implementation with the reason recorded
- Stop the duplicate state rows at their producer, the projection that drops route proof, and make the runner reject a state log with two rows for one iteration
- Check each lineage citation against the cited file's line count, in the verifier or the merge
- Fixtures built from the 2026-10-12 run shapes, each failing against the current code

### Out of Scope
- Reducer output-path handling. Phase 006 fixed it.
- The dashboard stamp test itself. Phase 007 owns it and this phase only changes what a missing dashboard means.
- Whether a cited line supports its claim. A bounds check proves the line exists, nothing more.
- Model choice for lineages. The defect is that the runtime accepts the result, not which model produced it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Run the iteration verifier per iteration before the worker returns at `:3984`, and reject duplicate iteration rows |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Treat a missing research dashboard as unproven provenance at `:719` and `:1486-1494`, unless the runner runs the reducer |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Carry the route-proof fields through the iteration row at `:214-224` |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | Add a citation-bounds check, if the verifier is where it lands |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Fixtures for an unproven lineage and a duplicated state log |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge-reducer-provenance.vitest.ts` | Modify | A missing-dashboard fixture that the merge refuses |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | A past-end citation fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The runner does not report a CLI lineage fulfilled unless the iteration verifier passes for every iteration 1 to the lineage's iteration count |
| REQ-002 | A research lineage with a registry and no reducer dashboard is refused at merge, or the runner runs the reducer so the dashboard always exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The state-log projection keeps the route-proof fields, so a leaf following the contract never has a reason to append its record a second time |
| REQ-004 | The runner rejects a lineage whose state log holds two `type: iteration` rows for one iteration |
| REQ-005 | A lineage citation whose line number exceeds the cited file's line count is reported before merge |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replaying the 2026-10-12 `deepseek-4` lineage shape through the runner gate rejects it, where today it is reported fulfilled
- **SC-002**: The existing deep-loop unit suite still passes, with the delta accounted for by the added cases
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `verify-iteration.cjs` exports `verify` at `:578` | The runner gate is built on it | Call the exported function in process, not through a child process |
| Risk | The verifier accepts route proof from the delta when the state row lacks it, at `:466-483` | The `deepseek-4` shape would pass a plain verifier call, because its deltas carry route proof | REQ-004 carries the duplicate-row case on its own, so the gate does not rely on the verifier alone |
| Risk | Refusing a missing dashboard rejects runs that worked before | Med | Prefer running the reducer in the runner if the reducer is cheap per lineage, and record the measured cost |
| Risk | Changing the projection shape breaks a reader of the state log | Med | Inventory every reader of the projected iteration row before the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The added per-lineage checks read only files already inside the lineage folder plus each cited file once

### Security
- **NFR-S01**: The citation check resolves paths inside the repository root and treats a path outside it as unresolvable, never reading outside the root

### Reliability
- **NFR-R01**: A check that cannot read a file reports that lineage as unproven rather than raising and aborting every other lineage
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A lineage with zero iterations: the verifier gate has nothing to run and the forced-depth check already owns this case
- A citation with a line range such as `:83-84`: the range end is bounded, not only the start
- A citation of a URL or of prose: no line to bound, so it is skipped

### Error Scenarios
- The cited file is missing: reported as an unresolvable citation, distinct from past-end
- The reducer fails inside the runner, if that option is chosen: the lineage is rejected with the reducer's own exit and stderr

### State Transitions
- A retried lineage: the gate runs again on the retry's artifacts, never on the failed attempt's
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Four runtime files and three test files in one skill |
| Risk | 12/25 | Changes what counts as a fulfilled lineage for every fan-out run |
| Research | 8/20 | The producer of the duplicates is located, the reducer option still needs a cost measurement |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Refuse a missing dashboard at merge, or run the reducer in the runner? Phase 007 chose detection because the runner would duplicate the workflow's reducer call. A missing dashboard on two of four lineages says the workflow's call does not run reliably, which weakens that reason. Decide after measuring the reducer's cost per lineage.
- The two runs carry different counts. In the official rerun (`002-official-rerun`), three lineages duplicated their records: 35 iteration rows on disk for 20 real iterations, while merged metrics report 30 and the closeout counts 20. In the expansion run (`003-research-expansion`), only `deepseek-4` duplicated: 29 rows across four lineages, 11 of them in `deepseek-4`, and a closeout of 20.
<!-- /ANCHOR:questions -->
