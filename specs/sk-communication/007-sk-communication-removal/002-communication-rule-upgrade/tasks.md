---
title: "Tasks: Phase 2: communication-rule-upgrade"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "communication rule upgrade tasks"
  - "plain-language re-render checks"
  - "communication prose tasks"
  - "phase 2 verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: communication-rule-upgrade

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

- [x] T001 Read `communication.md` §4, `communication-prose.md`, the relevant `REPO RULES.md` rows, `AGENTS.md` §8 and the Human Voice Rules source before editing. [EVIDENCE: communication.md, communication-prose.md, root rules, AGENTS.md and HVR source reviewed]
- [x] T002 Confirm phase 1's removal paths and active-reference cleanup state; preserve the parent brief's history exclusions. [EVIDENCE: removal-path command exited 0; scoped live-reference sweep reviewed]
- [x] T003 [P] Identify each router sentence that became false and record why any `REPO RULES.md` or `AGENTS.md` edit is needed. [EVIDENCE: git diff ecf2897455 -- REPO RULES.md and AGENTS.md produced no stdout, exit 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the obsolete skill/command route in `.skilled/repo-rules/communication.md` §4 with a direct plain-language re-render instruction that keeps every claim, number, caveat and uncertainty statement. [EVIDENCE: `4 now directs a complete re-render and preserves claims, order and strength]
- [x] T005 Add source-level sentence guidance in `.skilled/repo-rules/communication-prose.md` that prevents clipped machine-register output and preserves the connective meaning a reader needs. [EVIDENCE: rg output confirms complete connected sentence guidance and a terse-register rule]
- [x] T006 [P] Keep protected spans such as code, quotations, paths and identifiers byte-exact, and point to the Human Voice Rules without copying their rubric. [EVIDENCE: `4 lists protected spans as byte-exact; HVR source exists and both rules link to it]
- [x] T007 Correct `REPO RULES.md` trigger rows only where a statement became false after phase 1. [EVIDENCE: root routing diff is empty, exit 0; no sentence needed correction]
- [x] T008 [P] Correct `AGENTS.md` §8 only where a sentence became false; retain every root-level communication instruction that remains true. [EVIDENCE: AGENTS.md diff is empty, exit 0; `8 remains accurate]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the non-historical live-reference grep excluding generated retrieval snapshots; allow the existing prompt-set pointer to a retained historical decision record. [EVIDENCE: prompt-set.json:84 was the sole match; its target exists, exit 0.]
- [x] T010 Run Codex, Hermes and Pi prompt sync plus Hermes skill sync with `--check`; record all four statuses. [EVIDENCE: all four mirror checks passed: 32 prompts per runtime and 71 Hermes skill copies]
- [x] T011 Regenerate the trigger index and run its freshness check after final spec/frontmatter and fixture edits. [EVIDENCE: the orchestrator ran `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --quiet` (exit 0), then `--check --quiet` (exit 0); no indexed path remains under `.skilled/skills/sk-communication/`. The same check on main reported `fresh: false` with 37 missing documents, so regeneration also absorbed pre-existing index drift.]
- [x] T012 Run the focused advisor route-exclusions Vitest test, the touched sk-doc test and the sk-doc script test suite. [EVIDENCE: focused advisor test passed 10/10; skill-root test and sk-doc script suite passed]
- [x] T013 Run validate.sh recursively with --strict; quote its observed summary and report any still-open criterion separately. [EVIDENCE: final run reported RESULT: PASSED, exit 0.]
- [x] T014 [P] Review the scoped diff for false-only router edits, wording-source ownership, protected-span requirements and untouched history. [EVIDENCE: root routing diff empty; history paths unchanged; protected spans and HVR links confirmed.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and verification tasks have evidence, including T011's passing trigger-index regeneration and freshness check.
- [x] No `[B]` blocked tasks remain.
- [x] AC-001 through AC-010 are `Met` with observed evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Acceptance Criteria**: See `acceptance-criteria.md`.
- **Parent coordination**: See `../spec.md`.
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

- [x] CHK-001 [P0] Requirements are documented in `spec.md`, REQ-001 through REQ-006. [EVIDENCE: `spec.md` lists REQ-001 through REQ-006.]
- [x] CHK-002 [P0] Rule ownership, fidelity constraints and repository checks are defined in `plan.md`. [EVIDENCE: `plan.md` §§1-5 define scope, ownership, fidelity and checks.]
- [x] CHK-003 [P1] Phase 1, the Human Voice Rules source and verification owners are identified. [EVIDENCE: T001 records review of phase 1 and the HVR source; task rows assign each verification.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `git diff --check ecf2897455 --` reports no whitespace errors in the scoped rule and router changes. [EVIDENCE: implementation-summary.md records the baseline whitespace check with no output and exit 0.]
- [x] CHK-011 [P0] The new rule text preserves claims, numbers, caveats, uncertainty and protected bytes. [EVIDENCE: AC-001 and T004/T006/T014 record the preservation review.]
- [x] CHK-012 [P1] No runtime control flow, command, package or tool requirement is introduced. [EVIDENCE: T014 confirms phase 2 changed documentation only.]
- [x] CHK-013 [P1] Root routing changes are limited to sentences that became false. [EVIDENCE: T007-T008 record empty root-rule diffs and no false sentence to correct.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every phase acceptance criterion has a task row that will record its evidence. [EVIDENCE: AC-001 through AC-010 map to T004-T013.]
- [x] CHK-021 [P0] The required live-reference `git grep` prints nothing outside historical paths. [EVIDENCE: T009 and AC-005 record the sole retained historical pointer at prompt-set.json:84 and confirm its target exists.]
- [x] CHK-022 [P1] Mirror, trigger-index and advisor test commands pass from the final state. [EVIDENCE: T010 mirrors, T011 trigger-index generation/check and T012 advisor test all passed; each command exited 0.]
- [x] CHK-023 [P1] The touched sk-doc test and script test runner pass. [EVIDENCE: T012 records the skill-root metadata test and sk-doc script suite passing.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every changed file maps to `spec.md` scope; inspect `git diff ecf2897455 --` for all rule and router changes. [EVIDENCE: T014 records the scoped diff review against `spec.md`.]
- [x] CHK-FIX-002 [P0] The live consumer inventory has no remaining reference to the deleted skill, commands or plugin. [EVIDENCE: T009 and AC-005 record only prompt-set.json:84, a pointer to an existing historical record.]
- [x] CHK-FIX-003 [P0] The whole-reply rule, sentence-level rule and their trigger rows agree on ownership and behavior. [EVIDENCE: AC-001 through AC-003 record the rule behavior and HVR ownership review.]
- [x] CHK-FIX-004 [P1] A caveated reply retains all factual claims and protected spans under the new re-render instruction. [EVIDENCE: AC-001 and T006/T014 record claims, caveats and protected-span review.]
- [x] CHK-FIX-005 [P1] The prose review covers sentence source, whole-reply output and root routing as separate axes. [EVIDENCE: plan.md affected-surfaces matrix and T014 review cover all three.]
- [x] CHK-FIX-006 [P1] No runtime code reads process-wide state or adds an environment-dependent behavior in this phase. [EVIDENCE: T014 confirms the phase changes are documentation-only.]
- [x] CHK-FIX-007 [P1] Evidence uses the explicit baseline `ecf2897455` and scoped working diff, not a moving branch-relative range. [EVIDENCE: T014 records review against the explicit baseline.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential, private reply content or test canary is added to the rule or routing documents. [EVIDENCE: T014 records the scoped content review.]
- [x] CHK-031 [P0] Protected code, quotation, path and identifier spans are explicitly preserved byte-for-byte. [EVIDENCE: AC-001 and T006/T014 record the preservation contract and review.]
- [x] CHK-032 [P1] No auth, authorization or tool-permission behavior changes. [EVIDENCE: T014 confirms phase 2 changes only communication guidance.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree on the content-preservation and source-ownership contract. [EVIDENCE: AC-001 through AC-004 and T014 confirm cross-document alignment.]
- [x] CHK-041 [P1] No Human Voice Rules rubric is copied into either communication rule. [EVIDENCE: AC-003 records that both rules reference the HVR source without copying its rubric.]
- [x] CHK-042 [P2] Historical specs outside this authorized packet and historical changelogs remain untouched; the only changelog deletion is the skill-specific package directory listed in phase 1 scope. [EVIDENCE: T014 records the scoped history review.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No task-created temporary files are left in the packet or rule folders. [EVIDENCE: final filesystem scan found no temporary files in either folder.]
- [x] CHK-051 [P1] No scratch or generated test output is added to historical folders. [EVIDENCE: T014 records the history review; the scoped changes are confined to the authorized packet and active source files.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02. All 11 P0, 14 P1 and 1 P2 checklist items have evidence; CHK-022 is met by the final mirror, trigger-index and advisor results.
<!-- /ANCHOR:summary -->

---
