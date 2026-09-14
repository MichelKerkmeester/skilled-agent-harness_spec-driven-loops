---
title: "Tasks: Phase 4: sk-communication-upgrade"
description: "Ordered task list: the eight engine items in rising risk, the two rewrite-command declarations and the package gate that certifies the final state."
trigger_phrases:
  - "skill upgrade tasks"
  - "engine item tasks"
  - "provider instruction reply base"
  - "command mirror sync"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: sk-communication-upgrade

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

- [x] T001 Re-read the four frozen invariants in the package source rather than in the skill's description of them
  - evidence: src/fidelity/validator.ts:184, src/fidelity/semantics.ts:62, src/config/local-provider.ts:222, src/runtime/external-cli-projection.ts:205
- [x] T002 Capture the baseline package gate result before any edit, so afterwards has a before
  - evidence: scratch/gate-before.txt, exit status 0
- [x] T003 List the eight authorised items and their owning surfaces, from phase 002's allocation table
  - evidence: scratch/allocated-items.md
- [x] T004 Confirm the wording standard's reply base exists and the engine can name it, because phase 007 is a hard prerequisite
  - evidence: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md, named by src/config/copy-editing-instruction.ts:9
- [x] T005 Run the duplication search for the instruction literal and for rubric text while recording the current state
  - evidence: scratch/duplication-search.txt, three copies before, one after
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The eight engine items land in rising risk order inside `.opencode/skills/sk-communication/cli-communication-projection/`. The paths below are relative to that directory. The document companions follow.

- [x] T006 Collapse the instruction and its temperature into one declaration and point both profiles and the fixture at it (`src/config/local-provider.ts`, `src/runtime/external-cli-projection.ts`, `test/providers/helpers.ts`)
  - evidence: src/config/copy-editing-instruction.ts:33, src/config/local-provider.ts:14,222,225, src/runtime/external-cli-projection.ts:5,205,208, test/providers/helpers.ts:5,119
- [x] T007 Correct the instruction's target noun so it names the role the profiles actually declare (`src/config/local-provider.ts`)
  - evidence: src/config/copy-editing-instruction.ts:35, the framing names the assistant message, asserted at test/config/copy-editing-instruction.test.ts:37
- [x] T008 Move the five pass markers inside the guard whose comparisons they describe or run those comparisons unconditionally (`src/fidelity/validator.ts`)
  - evidence: src/fidelity/validator.ts:212,224,225,226,227, all inside the guard at 184
- [x] T009 Record the kind of change a candidate made on the accepted projection record, from values the comparisons already compute (`src/contracts/projection.ts`)
  - evidence: src/contracts/projection.ts:32, src/fidelity/types.ts:220, built at src/fidelity/validator.ts:267
- [x] T010 Give the change-kind field a no-op value, so an unchanged candidate is visible instead of passing silently (`src/contracts/projection.ts`)
  - evidence: src/fidelity/validator.ts:267, tested at test/config/copy-editing-instruction.test.ts:70
- [x] T011 Add the claim-based omission comparison inside the existing guard, rejecting an absent claim, caveat or requirement (`src/fidelity/semantics.ts`, `src/fidelity/validator.ts`)
  - evidence: src/fidelity/semantics.ts:186, veto wired at src/fidelity/validator.ts:229, reason code at src/fidelity/types.ts:49
- [x] T012 Set both provider profiles to provider-default thinking mode (`src/config/local-provider.ts`, `src/runtime/external-cli-projection.ts`)
  - evidence: src/config/local-provider.ts:226, src/runtime/external-cli-projection.ts:209
- [x] T013 Resolve the provider instruction to the wording standard's reply base instead of the thirteen-word literal (`src/config/local-provider.ts`)
  - Conductor correction 2026-09-14: the leaf added a packed copy of the standard under the package's docs/ with a fallback reader, which is a second home. Removed. The instruction now resolves lazily through `resolveCopyEditingInstruction()` at profile build, so the release rehearsal's clean packed import passes without a copy. Gate rerun: 82 files, 455 tests, exit 0.
  - evidence: src/config/copy-editing-instruction.ts:9,35, the skill file read at load
- [x] T014 Declare the pass performed, as rewording without reordering, in the in-context command (`.opencode/commands/rewrite/response.md`)
  - evidence: .opencode/commands/rewrite/response.md, the PURPOSE section declares a copy edit that rewords without reordering, cutting or adding, and returns the exact original on any fidelity failure
- [x] T015 Declare the same pass in the external-agent command (`.opencode/commands/rewrite/response-by-external-agent.md`)
  - evidence: .opencode/commands/rewrite/response-by-external-agent.md, the PURPOSE section declares the same pass, and the instruction note names the reply base as its source
- [x] T016 Sync both Claude-runtime mirrors in the same change (`.claude/commands/rewrite/`)
  - evidence: both mirrors copied from their sources, diff of each .claude/commands/rewrite/ mirror against its source printed nothing
- [x] T017 Restate the wording-standard section and its exclusions, one row shorter once phase 007 lands (`.opencode/skills/sk-communication/SKILL.md`)
  - evidence: .opencode/skills/sk-communication/SKILL.md, the wording-standard section carries the reply-base instruction, one exclusion row with its ownership reason and the no-op record, and the version reads 1.3.0.0
- [x] T018 Record the changed capability in the feature catalog (`.opencode/skills/sk-communication/feature-catalog/`)
  - evidence: feature-catalog.md and feature-catalog/provider-and-privacy/provider-adapters-and-execution.md record the one instruction declaration, the reply base as instruction, the claim-omission check and the no-op record
- [x] T019 Add a version entry to the skill's changelog (`.opencode/skills/sk-communication/changelog/`)
  - evidence: .opencode/skills/sk-communication/changelog/v1.3.0.0.md, the entry records the part-one engine changes and these document changes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Re-run the duplication search and confirm one home for the standard and no second instruction copy
  - evidence: scratch/duplication-search.txt, one hit after the edits
- [x] T021 Confirm both command documents name their pass in their own text and diff both mirrors against their source
  - evidence: both commands name their pass in their own PURPOSE text, and both mirror diffs against their sources printed nothing
- [x] T022 Exercise the omission check: a dropped caveat is rejected and a compressed pair of claims is read against the check
  - evidence: test/config/copy-editing-instruction.test.ts:89,105,133
- [x] T023 Exercise the no-op path and confirm the record shows the no-op value rather than a pass
  - evidence: test/config/copy-editing-instruction.test.ts:59,70
- [x] T024 Confirm both profiles resolve to a byte-identical instruction and to provider-default thinking mode
  - evidence: test/config/copy-editing-instruction.test.ts:36,45
- [x] T025 Exercise the failed paths and confirm each returns the exact original bytes
  - evidence: test/config/copy-editing-instruction.test.ts:128,166
- [x] T026 Confirm the enablement default and the advisor route exclusion are unchanged
  - evidence: SKILL.md, projection stays off by default behind COMMUNICATION_PROJECTION_ENABLED and the skill stays off advisor routing on the recommender's exclusion list, both confirmed by search
- [x] T027 Run the package gate from the final state and read its output and exit status
  - evidence: scratch/check-after.out, exit status 0, 82 test files, 455 tests
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Baseline package gate result and duplication-search result captured
- [ ] CHK-004 [P0] Phase 007's reply base exists before the instruction item starts
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The package gate passes from the final state, with output and exit status read
- [ ] CHK-011 [P0] No voice or tone rubric is written into a command, an asset or a presentation contract
- [ ] CHK-012 [P1] Each engine change describes behavior the code actually has
- [ ] CHK-013 [P1] The two provider profiles read one declaration for the instruction and its temperature
- [ ] CHK-014 [P1] The skill keeps its existing routing shape rather than gaining a second one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] A rewrite of a caveated reply checked for claim preservation
- [ ] CHK-022 [P0] An unchanged candidate recorded as a no-op rather than as a pass carrying five unearned markers
- [ ] CHK-023 [P1] Both runtime mirrors diffed against their source
- [ ] CHK-024 [P1] Every failed path still returns the exact original bytes
- [ ] CHK-025 [P1] A dropped caveat and a compressed pair of claims both exercised against the omission comparison
- [ ] CHK-026 [P1] Both provider profiles read provider-default thinking mode
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the eight items carries an adopted row while the four engine rows cite their decision record entry
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: every place the instruction literal or a rubric could have been copied
- [ ] CHK-FIX-003 [P0] Consumer inventory run: every reader of the changed symbols and every document pointing at the wording standard
- [ ] CHK-FIX-004 [P0] Adversarial cases exercised: a dropped caveat, a compressed pair of claims and a reorder that inverts a cause
- [ ] CHK-FIX-005 [P1] Matrix axes listed: provider profile by runtime mirror, four rows
- [ ] CHK-FIX-006 [P1] The enablement flag read from a hostile default, confirming off stays off
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit, not to a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential value appears in any document or in the package source while credentials stay references
- [ ] CHK-031 [P0] Protected spans stay unmodifiable: a quotation, an error string, a command, a path, an identifier
- [ ] CHK-032 [P1] Telemetry stays content-free, unchanged by this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Any touched code comment states present behavior rather than past approaches
- [ ] CHK-042 [P1] The feature catalog and changelog describe the shipped behavior
- [ ] CHK-043 [P2] The skill README reflects the changed rewrite contract
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
| P0 Items | 14 | 0/14 |
| P1 Items | 17 | 0/17 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---
