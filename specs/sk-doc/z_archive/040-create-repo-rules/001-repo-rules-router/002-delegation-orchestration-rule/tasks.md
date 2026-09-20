---
title: "Tasks: Phase 2: Delegation and Orchestration Rule"
description: "Ordered tasks for writing the seventh repo rule: inventory existing delegation coverage, draft the posture, briefing, single-opinion, returns and not-this sections, wire two router rows, then verify shape, forbidden tokens, links and row counts."
trigger_phrases:
  - "delegation rule tasks"
  - "orchestrate posture drafting"
  - "router wiring tasks"
  - "forbidden token scan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: Delegation and Orchestration Rule

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

- [x] T001 Inventory existing delegation coverage: `rg -n 'delegat|dispatch|orchestrat' 'REPO RULES.md' repo-rules/ AGENTS.md`, and record what each hit already binds
- [x] T002 Record the concrete delegation failures this repository has had, with enough detail that each rule clause can name one
- [x] T003 [P] Record the current row counts of the router's trigger and index tables
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft `repo-rules/delegation-and-orchestration.md`: `Fires when`, one binding rule sentence, numbered body, self-check
- [x] T005 Write the posture section - what changes about your role the moment work leaves your hands
- [x] T006 Write the briefing section - a brief carries evidence, frozen scope, and the shape of an acceptable answer
- [x] T007 Write the one-model-is-one-opinion section, including the delegator's own opinion, and say what to do instead
- [x] T008 Write the accepting-returns section, cross-referencing `evidence-and-proof.md` rather than restating it
- [x] T009 Write the "what this rule is NOT" section so it cannot be read as licence to over-delegate
- [x] T010 Add the trigger-table row and the index row to `REPO RULES.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Structural check: `Fires when`, exactly one binding sentence under `## THE RULE`, numbered body, closing self-check
- [x] T012 Forbidden-token scan: no model uid, CLI flag, env var, or version string in the file
- [x] T013 Format conformance: numbered headers uppercase and dividers present, matching phase 1
- [x] T014 Resolve every link in the new file and both new router links against the filesystem
- [x] T015 Confirm both router tables went from 6 rows to 7 and that no existing rule file changed
- [x] T016 Clause audit: every obligation names the failure it prevents; list them and check each one
- [x] T017 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `git diff --stat` shows exactly two paths: the new rule file and `REPO RULES.md`
- [x] `scratch/` cleaned of anything that is not an intentional working file
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **Rule shape reference**: `../../../../repo-rules/evidence-and-proof.md`
- **Executor mechanics (deliberately not duplicated)**: `.opencode/skills/cli-external-orchestration/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Overlap inventory complete, so the rule expands rather than duplicates existing coverage
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The file follows the six siblings' shape exactly - no new section type invented
- [x] CHK-011 [P0] No executor mechanics: nothing in the file is invalidated by a CLI version bump
- [x] CHK-012 [P1] Cross-references point at the owning file instead of restating its content
- [x] CHK-013 [P1] Every clause names the failure it prevents
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Link resolution passed for every link in the file and both router rows
- [x] CHK-022 [P1] Delegation targets covered: CLI executor, subagent, fan-out lineage, deep-loop leaf
- [x] CHK-023 [P1] Both directions covered: composing a brief, and accepting what comes back
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase adds doctrine rather than fixing a defect, so the rows below record the classification and the overlap inventory that stands in for a producer sweep.

- [x] CHK-FIX-001 [P0] Finding class recorded as `class-of-bug`: the uncovered action is delegation in general, not one bad dispatch
- [x] CHK-FIX-002 [P0] Same-class producer inventory run across `AGENTS.md` and all `repo-rules/` files for delegation language
- [x] CHK-FIX-003 [P0] Consumer inventory run: every document that links into `repo-rules/` re-checked after the router edit
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser, or redaction surface; recorded rather than skipped
- [x] CHK-FIX-005 [P1] Matrix axes listed: 4 delegation targets x 2 directions
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, tokens, or account identifiers in the new file
- [x] CHK-031 [P0] Not applicable - the file is read by an agent, not executed
- [x] CHK-032 [P1] The rule does not instruct an agent to relax a permission mode or bypass a gate; verified by reading it against `AGENTS.md` section 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] The rule's header line states it expands `AGENTS.md` and never overrides it, like every sibling
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated from Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



