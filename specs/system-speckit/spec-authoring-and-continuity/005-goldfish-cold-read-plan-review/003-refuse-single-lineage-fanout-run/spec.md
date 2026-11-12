---
title: "Feature Specification: Phase 3: refuse-single-lineage-fanout-run"
description: "Refuse implicit one-lineage research and review fan-out while preserving an explicit opt-in for direct callers."
trigger_phrases:
  - "refuse single lineage fanout run"
  - "phase 3 refuse single lineage fanout run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: refuse-single-lineage-fanout-run

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-bind-single-entry-executors-to-single-path |
| **Successor** | 004-name-file-in-plan-phase-lines |
| **Handoff Criteria** | The Phase 2 single-executor route is in place; the guard and explicit opt-in pass focused tests; all listed direct callers are updated. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build the confirmed recommendations of the fresh-context plan-check research specification.

**Scope Boundary**: The implementation change is limited to the six files listed below. It adds one preflight refusal and its explicit opt-in, updates existing tests and the direct-run operator procedure, and does not add a runner, hook, schema, or workflow file.

**Dependencies**:
- Phase 2 must route a one-lineage `--executors` matrix through `config.executor` before this guard is enabled. Otherwise, the normal command path would be refused.
- Use the existing Node.js, TSX, and Vitest runtime dependencies; add no package.

**Deliverables**:
- A research/review one-lineage refusal in the fan-out runner and a registered `--allow-single-lineage` opt-in for intentional direct calls.
- Negative and positive regression coverage, plus updates to existing one-lineage test and runbook callers.
- Focused unit and stress verification for the guard and its callers.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runner expands a count-1 executor into one runnable lineage, as the measured helper output shows. After expansion, the research and review runner has no cardinality refusal before its normal preflight path, so a direct one-lineage call can continue as fan-out without directing the caller to the single-executor workflow.

### Purpose
Refuse implicit one-lineage research and review fan-out before side effects, while allowing a caller that deliberately invokes the direct runner to opt in explicitly.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The runner uses this repository helper to expand executor entries. This read-only probe shows the current one-entry result; it does not start a lineage process.

```text
$ node --import './.skilled/skills/system-deep-loop/runtime/node_modules/tsx/dist/loader.mjs' --input-type=module <<'NODE'
import { expandLineages } from './.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts';
const lineages = expandLineages({ executors: [{ label: 'single', kind: 'native', count: 1 }] });
console.log(JSON.stringify({ lineageCount: lineages.length, labels: lineages.map((lineage) => lineage.label) }));
NODE
{"lineageCount":1,"labels":["single"]}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Register the explicit `--allow-single-lineage` opt-in in the runner’s known flags.
- Refuse `research` and `review` runs when expanded lineage count is one and the opt-in is absent, before directory creation, ledger writes, or spawning.
- Direct the refusal message to the corresponding `/deep:research` or `/deep:review` single-executor workflow; do not mention the escape flag or suggest changing a count.
- Update existing direct one-lineage unit, stress, timestamp-window, and runbook callers to pass the opt-in when they intentionally exercise fan-out. In the unit file that is the shared launch helper plus the one recorded-run case that bypasses it.

### Out of Scope
- Refusing a matrix that expands to two or more lineages; the known count-2 bypass remains a separately tracked limitation.
- Changing one-lineage routing in command workflows; Phase 2 owns routing the normal command path through `config.executor`.
- Adding a single-executor runner, hook, schema rule, or workflow file; the guard stays in the existing runner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Modify | Register `allowSingleLineage` and refuse unapproved single-lineage research/review runs immediately after expansion. |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Modify | Add refusal and opt-in regression cases; pass the opt-in to existing direct one-lineage runs that still exercise fan-out. |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts | Modify | Pass the opt-in from the shared one-executor adapter fixture. |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | Modify | Pass the opt-in to existing one-lineage research/review stress cases. |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | Modify | Pass the opt-in to the one-lineage review fixture. |
| .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md | Modify | Add the opt-in to the intentional one-lineage direct runner procedure. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reject a research or review fan-out run when its executor matrix expands to one lineage and the explicit opt-in is absent. | A focused unit test observes input-validation exit code 3, an error naming the matching single-executor workflow, and no lineage directory, status ledger, summary, or spawn marker. The error does not name the opt-in or suggest raising a count. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Preserve intentional direct one-lineage fan-out through the registered `--allow-single-lineage` opt-in, and update the known direct callers. | A focused opt-in test reaches its stub executor; the unit, timestamp-window, and CLI-adapter stress tests pass; the runbook command includes `--allow-single-lineage`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An unapproved one-lineage research/review call is rejected before any lineage directory, ledger, summary, or subprocess is created, as asserted in `fanout-run.vitest.ts`.
- **SC-002**: A one-lineage direct call with `--allow-single-lineage` proceeds through the runner preflight, and all listed unit/stress callers and the runbook procedure use the explicit opt-in where required.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 single-entry routing | Without it, the proper deep command can reach the new refusal with a one-lineage matrix. | Do not enable this phase until Phase 2 routes that matrix through `config.executor`. |
| Risk | An existing direct caller may rely on an unguarded one-lineage fan-out. | Medium: the caller would stop before launching. | Update each listed test fixture and the repin runbook; run the unit and CLI-adapter stress suites. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A because this local CLI preflight has no response-time target.
- **NFR-P02**: N/A because this packet sets no throughput target for executor matrices.

### Security
- **NFR-S01**: N/A because this change adds no authentication or authorization boundary.
- **NFR-S02**: N/A because this change adds no persisted or transmitted data.

### Reliability
- **NFR-R01**: N/A because the runner is not a service with an availability target.
- **NFR-R02**: N/A because this packet sets no service error-rate target.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: An empty executor array expands to zero lineages, so the one-lineage guard does not fire. This packet leaves existing empty-input handling unchanged.
- Maximum input: This packet adds no maximum matrix size. Expanded counts of two or more keep the runner's existing limits and behavior.
- Failure path: A research or review matrix that expands to one lineage without the opt-in raises inputError, which exits with code 3 before capability preflight or run side effects. The message points to the matching single-executor workflow and omits the opt-in and count.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Scores follow `assets/complexity-decision-matrix.md`.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Six implementation files are listed in scope. The runner change reaches its unit tests, stress fixtures, timestamp test and operator runbook. |
| Risk | 10/25 | The change adds one CLI option and an early refusal. It changes no authentication boundary, stored data or schema. |
| Research | 15/20 | The prior research and source checks identify the guard location and direct callers; the recorded unit and stress suites pass (tasks T013-T015). |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. The `--count=2` bypass is a known out-of-scope limitation recorded in section 3.
<!-- /ANCHOR:questions -->

---

