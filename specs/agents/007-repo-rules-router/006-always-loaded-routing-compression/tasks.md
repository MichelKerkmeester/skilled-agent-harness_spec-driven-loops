---
title: "Tasks: Phase 6: Always-Loaded Routing Compression"
description: "Ordered tasks for compressing four AGENTS.md routing sections on an independent review: dispatch and verify the review, classify every decommissioned-server reference, correct the skill before cutting the always-loaded inventory, apply three verdicts and deliberately skip the fourth, then sweep for dangling references and measure the byte delta."
trigger_phrases:
  - "routing compression tasks"
  - "review verification"
  - "reference classification"
  - "dangling sweep"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: Always-Loaded Routing Compression

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

- [x] T001 Dispatch an independent review of the four candidates, briefed with evidence and constraints and without the first reader's conclusions
- [x] T002 Re-open the review's load-bearing citations: the dead command's deletion commit, the prior audit's falsified justification, the byte cost, and the magicpath skill's ownership of the naming rule
- [x] T003 Correct the review's own line-count figure before using it
- [x] T004 Classify every `sequential thinking` reference in the repo as misleading, behavioral, historical, or a different meaning
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Remove the decommissioned server from `mcp-code-mode/SKILL.md`, keeping the one note that explains why it went
- [x] T006 Correct the three roster mentions in `mcp-code-mode/README.md`
- [x] T007 Add the `cli`-manual exception to `naming-convention.md` as Mistake 0
- [x] T008 Candidate A: leave the Gate 2 artifact trigger untouched, and record why
- [x] T009 Candidate B: rewrite the search rows as capabilities with tools as examples; drop the scaffolding line and the row `root-cause.md` already owns
- [x] T010 Candidate C: delete the registration inventory, keep the two unique statements, say "enumerate at runtime" once
- [x] T011 Candidate D: drop the dead command and the Flow cells that restate a command's own arguments
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Sweep for dangling references to every removed phrase, in both directions
- [x] T013 Resolve every command path, capability route and `repo-rules/` link still named in `AGENTS.md`
- [x] T014 Confirm the two unique sentences survive and are still unique
- [x] T015 Measure the byte delta against the prior commit
- [x] T016 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Adjacent defects recorded rather than fixed
- [x] `scratch/` holds only intentional working files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **Approval precondition**: `../004-research-adoption/adoption-decisions.md` section 4
- **Why a second lens was used**: `../../../../repo-rules/delegation-and-orchestration.md` section 4
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
- [x] CHK-003 [P0] Operator approval for the `AGENTS.md` edits recorded
- [x] CHK-004 [P0] Review claims re-verified rather than adopted
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No sentence unique to the repository was deleted; uniqueness checked before each cut
- [x] CHK-011 [P0] The skill was corrected before the always-loaded inventory was cut
- [x] CHK-012 [P1] Each candidate is a separate hunk and reverts independently
- [x] CHK-013 [P1] Compression kept the lookup affordance rather than trading it for abstraction
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Dangling-reference sweep clean in both directions
- [x] CHK-022 [P1] Reference classes covered: misleading, behavioral, historical, different-meaning
- [x] CHK-023 [P1] Every command named in the always-loaded document resolves
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Three of the four candidates turned out to be correctness defects rather than bloat, so these rows are load-bearing here.

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug` for the stale-content pattern, `cross-consumer` for the skill-versus-document disagreement
- [x] CHK-FIX-002 [P0] Same-class producer inventory: every `sequential thinking` reference enumerated and classified before any edit
- [x] CHK-FIX-003 [P0] Consumer inventory: every command path, capability route and rule link re-resolved after the cuts
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser or redaction surface; recorded rather than skipped
- [x] CHK-FIX-005 [P1] Matrix axes listed: 4 candidates x 3 verdict types; 4 reference classes x 2 actions
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file
- [x] CHK-031 [P0] Not applicable - the changed files are read, not executed; the executable surface that names the retired server was deliberately left alone
- [x] CHK-032 [P1] No cut weakens a gate or a hard blocker; the one gate under review was kept unchanged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] The surviving Sequential Thinking mention explains why the server went, rather than describing it as live
- [x] CHK-042 [P1] Parent Phase Documentation Map updated with the phase-6 row and handoff criteria
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



