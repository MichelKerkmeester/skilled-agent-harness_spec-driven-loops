---
title: "Implementation Plan: Phase 6: goal-conformance-check"
description: "This plan defines four goal conformance checks, isolated fixtures and a read-only corpus report. The implementation route stays conditional on phase 001."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: goal-conformance-check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS JavaScript on Node.js |
| **Framework** | None |
| **Storage** | None; read-only file scan |
| **Testing** | Node.js built-in test runner with node --test |

### Overview
The planned checker covers binding-row completeness, template placeholders, the three-to-seven criterion count and the parent durable-slice budget. It follows the repo-rule checker's per-check output pattern and calls goal-slice.cjs for budget measurement (.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:435-465; .skilled/hooks/goal/lib/goal-slice.cjs:59-63,277-285,431-446).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [ ] Phase 001 records the owner choice for the missing checks (specs/sk-doc/060-create-goal-mode/spec.md:157).
- [ ] Phase 005's cut-fixture and chat-slice evidence meets the incoming handoff (specs/sk-doc/060-create-goal-mode/spec.md:146).
- [ ] Phase 002 has created the sk-create-goal packet before its script path is used (specs/sk-doc/060-create-goal-mode/spec.md:122).

### Definition of Done
- [ ] One positive fixture passes and six negative controls fail for their named reasons.
- [ ] The row-removal control fails even when the phase name remains elsewhere.
- [ ] The live-corpus report prints counts and makes no edits.
- [ ] The phase folder passes validate.sh --strict.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
If phase 001 selects the mode-local route, use a standalone read-only Node.js checker with fixture-backed tests. If it selects a validator amendment, record the amendment request in this phase's existing implementation-summary.md and retain the same fixtures; the validator itself remains outside this phase's write scope.

### Key Components
- **check-goal.cjs**: Enumerates active goal documents and reports four check results.
- **Fixture suite**: Supplies one valid packet and one isolated defect for each check, with separate placeholder cases for objective, decision and criterion fields.
- **goal-slice.cjs**: Supplies durable-slice extraction and the declared budget (.skilled/hooks/goal/lib/goal-slice.cjs:59-63,277-285,431-446).
- **Phase records**: Update this phase's spec.md, tasks.md, acceptance-criteria.md, goal.md and implementation-summary.md with the selected route, observed evidence and closeout state.

### Data Flow
Read phase-parent goals and their direct child directories under active specs. Parse the binding anchor's table rows, then inspect the objective, decision cells and completion-criteria bullets. Call goal-slice.cjs to measure the parent slice and limit. Print counts and named findings to stdout. The checker does not repair files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
This phase adds a read-only goal check. The existing validator and goal-slice helper remain the source contracts.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| spec-doc-structure.ts | Measures the goal budget and resolves listed binding targets (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080) | Read as baseline; do not modify | Four fixture cases cover the missing checks |
| goal-slice.cjs | Exports durable-slice and budget helpers (.skilled/hooks/goal/lib/goal-slice.cjs:59-63,277-285,431-446) | Reuse for parent budget measurement | Over-budget fixture fails at the declared limit |
| Active goal corpus | Contains the known gap patterns (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:39-45) | Read only | Report scanned and finding counts |

Required inventories:
- Same-class source: rg -n 'validateGoalDocument|bindingRowTarget' .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts.
- Helper source: rg -n 'extractDurableSlice|resolveGoalBudget' .skilled/hooks/goal/lib/goal-slice.cjs.
- Matrix axes: binding row present or absent; template placeholder present or absent; criterion count below, within or above 3-7; parent durable slice at or above the configured limit.
- Row invariant: a binding passes only when its matching child row appears inside the BINDING table. A mention in another section never counts (specs/sk-doc/z_archive/040-create-repo-rules/009-hub-routing-guardrails/implementation-summary.md:85-88,104).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. **Resolve inputs.** Read phase 001's ownership decision and confirm phase 005's incoming handoff. Check the phase-002 mode packet exists with test -f .skilled/skills/sk-doc/sk-create-goal/SKILL.md. Observable result: the chosen owner route and accepted input evidence are recorded.
2. **Build fixtures and tests.** Add one valid case and six isolated cases: a missing binding row, separate objective, decision and criterion placeholders, an out-of-range criterion count and an over-budget parent. Keep the child identifier in a non-row location in the binding negative control. On the local-checker route, run node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs. On the amendment route, retain the fixtures and use the validator owner's documented test entry point if supplied; if none is available, record the fixture run as blocked instead of claiming a pass. Observable result: seven controls have observed outcomes, including six expected failures with named reasons.
3. **Implement the selected route.** For the local-checker route, create .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs with one result per check, modelled on .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:435-465. Import extractDurableSlice and resolveGoalBudget from goal-slice.cjs (.skilled/hooks/goal/lib/goal-slice.cjs:431-446). If phase 001 selects the validator-amendment route, record an amendment request for .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080 in this phase's existing implementation-summary.md and retain the fixtures; do not edit the validator here. Observable result: the selected route and owner are explicit, and the fixture suite remains available.
4. **Scan the live corpus.** On the local-checker route, run node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs with no arguments. Scan active specs goal.md files, exclude specs paths containing z_archive, and report goals_scanned, phase_parents_scanned and the finding count for each check. On the amendment route, use its documented read-only scan entry point only if the amended validator is available; otherwise record the corpus report as blocked. Observable result: the selected route reports counts and leaves existing findings unchanged.
5. **Close the phase.** Run bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/006-goal-conformance-check --strict. Inspect the output and exit status. Update this phase's spec.md status, tasks.md checkboxes, acceptance-criteria.md evidence rows, goal.md progress log and implementation-summary.md with observed results; leave the objective and criteria unchanged. Provide phase 007 with the fixture verdicts. Observable result: strict validation output is recorded and the outgoing handoff names each negative reason plus the positive fixture.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | One valid fixture and six isolated defect fixtures | node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs |
| Integration | Active specs goal corpus, with z_archive excluded | node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs |
| Manual | Confirm stdout includes scan totals and four finding counts, and reports findings without repairs | Read the command output and inspect the fixture report |
| Packet | This phase's six spec documents | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/006-goal-conformance-check --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 checker ownership decision (specs/sk-doc/060-create-goal-mode/spec.md:157) | Internal | Unresolved | Select local checker or record the system-spec-kit amendment route |
| Phase 005 budget and chat-slice handoff (specs/sk-doc/060-create-goal-mode/spec.md:146) | Internal | Pending handoff | Phase 006 must not start without the cut-fixture evidence |
| Phase 002 sk-create-goal packet (specs/sk-doc/060-create-goal-mode/spec.md:122) | Internal | Planned | Script and fixture paths do not exist until the mode packet is scaffolded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: A fixture exposes a false pass, a live scan writes to a goal file, or the chosen check conflicts with phase 001's owner decision.
- **Procedure**: Remove only the new checker, test and fixture files from this phase's change set. Restore the phase notes to the selected owner route, rerun the fixture command and strict phase validator, then confirm the live corpus remains unchanged.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Setup → Implementation → Verification

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 ownership decision, phase 005 incoming handoff and phase 002 packet | Implementation |
| Implementation | Accepted setup and selected owner route | Verification |
| Verification | Fixture suite and read-only corpus report | Handoff to phase 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | One source and handoff review |
| Core Implementation | Medium | One checker, fixture and test pass |
| Verification | Medium | Fixture run, corpus report and strict validation |
| **Total** | | **One bounded implementation cycle; no hour estimate recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
### Pre-deployment Checklist
- [ ] No deployment or data migration is part of this phase.
- [ ] The live-corpus command runs without write operations.
- [ ] The fixture command uses only its named fixture inputs.

### Rollback Procedure
1. Remove the new checker and fixture artifacts from the phase change.
2. Restore the phase's recorded owner route.
3. Rerun the fixture command and strict validator, then confirm goal files were not changed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->

---
