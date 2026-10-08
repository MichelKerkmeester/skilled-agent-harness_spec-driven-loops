---
title: "Tasks: Gate 3 menu parity"
description: "Concrete tasks for building this phase."
trigger_phrases:
  - "gate 3 menu parity tasks"
  - "gate 3 constants parity"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Gate 3 menu parity

<!-- ANCHOR:tasks -->

## Verification Checklist

- [x] All 9 Gate 3 presentation files and 3 compiled contracts have been identified (the 12 paths are the `GATE_3_MENU_FILES` list in the parity test)
- [x] All compiled contracts carrying Gate 3 menus have been located (`rg 'C\) *Related'` finds exactly 3 under `.skilled/commands/deep/assets/compiled/`)
- [x] Parity test runs and validates all files (`node --test` on `gate-3-menu-parity.test.mjs`: 12 pass, 0 fail)
- [x] No presentation file has been modified without testing (each of the 12 option C lines is asserted by the parity test)
- [x] No regression in hook tests or runtime behavior (all hook tests: 184 tests, 181 pass, 0 fail)

---

## Implementation Tasks

### T001: Inventory All Presentation Files

- [x] List all `.skilled/commands/**/assets/*-presentation.txt` files
- [x] For each file, extract the option C text for Gate 3
- [x] Count how many include "in the same track" (before the build: none of the 9 named files)
- [x] Document findings (recorded in implementation-summary.md instead of a separate list file)
- **Files affected**: `.skilled/commands/*/assets/*-presentation.txt`

### T002: Locate Compiled Contracts

- [x] Search `.skilled/skills/` for YAML or JSON carrying Gate 3 menus (none carry a compiled menu; three reference docs carry prose copies, recorded as a follow-up)
- [x] Search `.skilled/commands/` for contract files (3 deep contracts; `speckit-implement.yaml:52` carries a short inline copy, recorded as a follow-up)
- [x] Search hook registration files (the hook renders from the constants directly, so nothing to change)
- [x] Document each location and format found (implementation-summary.md)
- **Files affected**: the 3 deep compiled contracts

### T003: Identify Hook Test Files (Read-Only)

- [x] Locate the hook test suite at `.skilled/skills/system-spec-kit/runtime/tests/hooks/`
- [x] Note that `spec-gate-core.test.mjs:300-324` has a byte-identity baseline that must not change
- [x] Document for reference (no edits made; `git diff` on the file is empty)
- **Files reviewed**: `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`

### T004: Edit 9 Presentation Files

- [x] For each of these 9 files, locate the option C menu line and replace with exact wording from GATE_3_CHOICE_RELATED:
  - `.skilled/commands/create/assets/create-feature-catalog-presentation.txt`
  - `.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt`
  - `.skilled/commands/create/assets/create-skill-parent-presentation.txt`
  - `.skilled/commands/create/assets/create-skill-presentation.txt`
  - `.skilled/commands/deep/assets/deep-ai-council-presentation.txt`
  - `.skilled/commands/deep/assets/deep-research-presentation.txt`
  - `.skilled/commands/deep/assets/deep-review-presentation.txt`
  - `.skilled/commands/speckit/assets/speckit-complete-presentation.txt`
  - `.skilled/commands/speckit/assets/speckit-plan-presentation.txt`
- [x] Verify each file is readable and syntax is valid (one changed line per file)
- **Verification**: All 9 files contain "in the same track" in option C

### T005: Regenerate 3 Compiled Contracts from Sources

- [x] Read the compilation pipeline in `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`
- [x] Run the script to regenerate all contracts from the source presentations
- [x] Verify the 3 deep contracts now contain "in the same track" in option C
- [x] Validate with contract-drift check (each contract diff is the option C line plus its source sha256 and compiledBodyDigest)
- **Affected**: `deep-ai-council.contract.md`, `deep-research.contract.md`, `deep-review.contract.md`
- **Command**: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --write --command deep/<name>`

### T006: Write Parity Test

- [x] Create a test that:
  - Reads `GATE_3_CHOICE_RELATED` from constants
  - Scans each of the 12 named files for the option C menu line
  - Confirms each matches the constant exactly
  - Reports divergence by file and line
  - Returns non-zero exit on any mismatch
- [x] Document the test location and how to run it (header comment of the test file)
- **Files created**: `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs`

### T007: Run Parity Test on All 12 Files

- [x] Execute the parity test against all 9 presentation files
- [x] Execute the parity test against all 3 compiled contracts
- [x] Confirm every file passes
- [x] Fix any failures and retest (review round 1 found the assertion matched anywhere in the file; it now asserts on the option C line, and a planted stale line fails 1 of 12)
- **Verification**: Test exits with status 0

### T008: Validate Phase

- [x] Run `validate.sh --strict` on the spec folder
- [x] Verify spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md are all internally consistent
- [x] Confirm hook tests still pass (baseline unchanged)
- **Verification**: All checks pass

### T009: Documentation and Handoff

- [x] Update implementation-summary.md to reflect completion
- [x] Prepare a summary of changes for the parent spec changelog (no changelog folder exists under the parent or the track; the summary lives in implementation-summary.md)
- [x] Confirm the 12 file names are documented in plan.md or spec.md
- **Files affected**: implementation-summary.md

---

## Verification Checklist Details

- [x] Hook test location verified in T003
- [x] All 9 presentation files edited in T004 with verified format
- [x] 3 deep contracts regenerated in T005 from sources
- [x] Parity test created and documented in T006
- [x] Parity test passes on all 12 files in T007
- [x] Phase validation passes in T008
- [x] Documentation complete in T009

<!-- /ANCHOR:tasks -->
