---
title: "Tasks: Phase 5: advisor-negation-and-routing"
description: "Ordered tasks that guard the advisor explicit lane against a negated write, add the design-document and chart-colour phrases to the modes that own them, reopen the v4.0.1.0 release entry and prove each step with the scorer test, the parity set, the route replays and the packet gate."
trigger_phrases:
  - "advisor negation and routing tasks"
  - "negated write scorer tasks"
  - "borderline route tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: advisor-negation-and-routing

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `ADV` is `.skilled/skills/system-skill-advisor/runtime`, `SD` is `.skilled/skills/sk-doc`, `SDS` is `.skilled/skills/sk-design`, `REL` is `.skilled/changelog/skilled/v4.0.1.0.md` and `P` is `specs/sk-design/021-deprecate-fundamentals/005-advisor-negation-and-routing`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the labeled case rr-iter3-146 sits in the corpus and records the pre-fix sk-doc win at 0.8445 over sk-code 0.8377 (`$ADV`). Verify: `rg -n 'rr-iter3-146' $ADV` prints the case. Evidence: `scratch/facts.md` section 1 records the case, its gold sk-code label and the pre-fix scores.
- [x] T002 Confirm the two borderline prompts return sk-code before the change (`$SD` and `$SDS`). Verify: `rg -n '0.9451|0.9159' scratch/facts.md` prints both pre-fix scores. Evidence: `scratch/facts.md` section 2 records sk-code 0.9451 for the design-document prompt and sk-code 0.9159 for the chart-colour prompt.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Negation fix

- [x] T003 Add the `NEGATED_WRITE` pattern and the `affirmedWriteText()` helper to the explicit lane (`$ADV/lib/scorer/lanes/explicit.ts`). Verify: `rg -n 'NEGATED_WRITE|affirmedWriteText' $ADV/lib/scorer/lanes/explicit.ts` prints both names. Evidence: `scratch/facts.md` section 1 records the pattern, the helper and the three write-surface tests it guards.
- [x] T004 Add the scorer test with three affirmed and four negated prompts (`$ADV/tests/scorer/negated-write-surface.vitest.ts`). Verify: `(cd $ADV && npx vitest run tests/scorer/negated-write-surface.vitest.ts)` exits 0. Evidence: `scratch/facts.md` section 1 records the new test and its seven prompts covering both apostrophe forms, `do not edit` and `without changing`.
- [x] T005 Rebuild the runtime and rerun the parity, baseline and live replay (`$ADV`). Verify: `(cd $ADV && npm run build)` exits 0 and the live advisor returns sk-code 0.8377 first for rr-iter3-146. Evidence: `scratch/facts.md` section 1 records tsAlsoCorrect 103 -> 104, the regression list without rr-iter3-146, the ledger 75 -> 74, the full corpus 157 at 0.8051, the holdout 50, the ambiguity 20, the legacy parity 108 -> 109 and the suite at 1371 passed with 1 pre-existing failure.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Borderline routes

- [x] T006 Add "document for clarity" to `$SD/graph-metadata.json` intent signals and derived trigger phrases, the `create-quality-control-aliases` class to `$SD/hub-router.json` and the `DOC_QUALITY` intent to `$SD/ROUTER.md`. Verify: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "Review this design document for clarity."` prints a single `sk-create-quality-control` route. Evidence: `scratch/facts.md` section 2 records sk-doc 0.949 first and a single `sk-create-quality-control` route.
- [x] T007 Add "chart color system" and "chart colour system" to `$SDS/graph-metadata.json` derived trigger phrases. Verify: `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "review the chart colour system"` prints a single `sk-design-chart` route. Evidence: `scratch/facts.md` section 2 records sk-design 0.9268 first and a single `sk-design-chart` route.
- [x] T008 Run the five protected route replays and the routing gate set (`$SD` and `$SDS`). Verify: design review findings, review this design, review this screen, code review and what padding should this have keep their prior selection. The `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $SD` check and the same check on `$SDS` print OK. Evidence: `scratch/facts.md` section 2 records the five protected routes unchanged, intent signals missing=0 orphans=0, the compiled-route guard fresh, sync 55/55, vocabulary reach PASSED, parent-skill-check OK on both hubs, Hermes 65/65 and advisor parity unchanged.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Release notes

- [ ] T009 Update the v4.0.1.0 entry so open design values point at `sk-code-frontend`, fold the branch work into the release and republish the tag (`$REL`). Verify: `rg -n 'Open Design Values|Retired Surfaces|sk-code-frontend' $REL` prints the corrected heading and the retirement section. The published v4.0.1.0 release body matches the entry. Evidence: Pending. `scratch/facts.md` section 3 records the stale heading and the tag at `10474a9567`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [x] T010 Run the advisor suite and record the legacy pin (`$ADV`). Verify: `(cd $ADV && npm test)` prints 1371 passed, 1 failed and 8 skipped. The one failure is the same legacy pin as main. Evidence: `scratch/facts.md` section 1 records the suite result and the same legacy pin on main.
- [x] T011 Run the accuracy and routing gate set (`$ADV`, `$SD` and `$SDS`). Verify: `rg -n '"correct": 157' $ADV/scripts/routing-accuracy/scorer-eval-baseline.json` prints the full-corpus count and the two replays return their target modes. Evidence: `scratch/facts.md` sections 1 and 2 record tsAlsoCorrect 104, the full corpus 157, the holdout 50, the ambiguity 20 and both target routes.
- [x] T012 Run the packet validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`. Evidence: the final validation run prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The packet gate prints `RESULT: PASSED` and every acceptance row is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent phase map**: See `../spec.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: `spec.md` carries REQ-001 to REQ-004 and `acceptance-criteria.md` maps each one to a row.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: `plan.md` names the negation fix, the borderline routes and the release notes and maps each one to the gate run.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `npm run build`, the parity set and the route replays all ran during the phase.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run build` exits 0 in the advisor runtime. Evidence: `scratch/facts.md` section 1 records the results after the build.
- [x] CHK-011 [P0] `npx vitest run tests/scorer/negated-write-surface.vitest.ts` exits 0. Evidence: `scratch/facts.md` section 1 records the new test with its seven prompts.
- [x] CHK-012 [P1] Every edited JSON file parses. Evidence: the parent-skill checks and the route replays read the edited graph metadata and hub routers and passed.
- [x] CHK-013 [P1] The edits follow the lane and router patterns. Evidence: the explicit lane is the only scorer file changed and both hubs keep their existing intent and alias shape.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The negation fix returns sk-code first for rr-iter3-146. Evidence: `scratch/facts.md` section 1 records sk-code 0.8377 first.
- [x] CHK-021 [P0] The design-document prompt returns sk-doc first. Evidence: `scratch/facts.md` section 2 records sk-doc 0.949 first with a single `sk-create-quality-control` route.
- [x] CHK-022 [P0] The chart-colour prompt returns sk-design first. Evidence: `scratch/facts.md` section 2 records sk-design 0.9268 first with a single `sk-design-chart` route.
- [x] CHK-023 [P1] The five protected routes keep their prior selection. Evidence: `scratch/facts.md` section 2 records design review findings, review this design, review this screen, code review and what padding should this have unchanged.
- [ ] CHK-024 [P1] The release entry and tag are republished. Evidence: Pending.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding names one class. Evidence: the negation case is class-of-bug and the two borderline routes are instance-only vocabulary gaps, recorded in `implementation-summary.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `rg -n 'NEGATED_WRITE|affirmedWriteText'` finds the explicit lane only and the two route phrases sit in the hub metadata that owns each one.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the new scorer test, the parity set, the eval baseline, the live advisor and both hub replays cover every consumer the plan names.
- [x] CHK-FIX-004 [P0] Adversarial cases cover both apostrophe forms, `do not edit` and `without changing`. Evidence: `scratch/facts.md` section 1 records the four negated prompts.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion. Evidence: `plan.md` names the negation form and write-surface axes with three affirmed and four negated rows.
- [x] CHK-FIX-006 [P1] Hostile environment variant is not applicable. Evidence: the edited scorer files read no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the baseline commit `10474a9567` recorded in `scratch/facts.md`. Evidence: `scratch/facts.md` records the baseline commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change edits scorer code, routing JSON and Markdown and carries no credential.
- [x] CHK-031 [P0] Input validation is not applicable. Evidence: no parser or path handler is edited.
- [x] CHK-032 [P1] Auth and authz are not applicable. Evidence: the change adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized. Evidence: `spec.md`, `plan.md` and `tasks.md` name the four fixes, the three workstreams and the gate set.
- [x] CHK-041 [P1] Comment hygiene holds. Evidence: the packet validator reports the comment-hygiene check as a pass.
- [x] CHK-042 [P2] README updated. Evidence: not applicable, because no reference file is added, renamed or removed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: `scratch/` holds `facts.md` and the dispatch briefs. It holds no working copy of an edited file.
- [x] CHK-051 [P1] `scratch/` holds no stray output before close. Evidence: the scratch folder is untracked dispatch material and holds no stray output.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---
