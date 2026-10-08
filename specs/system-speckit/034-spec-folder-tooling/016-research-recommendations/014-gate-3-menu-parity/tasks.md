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

- [ ] All 33 presentation files have been identified
- [ ] All compiled contracts carrying Gate 3 menus have been located
- [ ] Parity test runs and validates all files
- [ ] No presentation file has been modified without testing
- [ ] No regression in hook tests or runtime behavior

---

## Implementation Tasks

### T001: Inventory All Presentation Files

- [ ] List all `.skilled/commands/**/assets/*-presentation.txt` files
- [ ] For each file, extract the option C text for Gate 3
- [ ] Count how many include "in the same track"
- [ ] Document findings in a CSV or list file
- **Files affected**: `.skilled/commands/*/assets/*-presentation.txt`

### T002: Locate Compiled Contracts

- [ ] Search `.skilled/skills/` for YAML or JSON carrying Gate 3 menus
- [ ] Search `.skilled/commands/` for contract files
- [ ] Search hook registration files (location TBD)
- [ ] Document each location and format found
- **Files affected**: Location TBD

### T003: Identify Hook Test Files (Read-Only)

- [ ] Locate the hook test suite at `.skilled/skills/system-spec-kit/runtime/tests/hooks/`
- [ ] Note that `spec-gate-core.test.mjs:300-324` has a byte-identity baseline that must not change
- [ ] Document for reference (no edits planned)
- **Files reviewed**: `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`

### T004: Edit 9 Presentation Files

- [ ] For each of these 9 files, locate the option C menu line and replace with exact wording from GATE_3_CHOICE_RELATED:
  - `.skilled/commands/create/assets/create-feature-catalog-presentation.txt`
  - `.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt`
  - `.skilled/commands/create/assets/create-skill-parent-presentation.txt`
  - `.skilled/commands/create/assets/create-skill-presentation.txt`
  - `.skilled/commands/deep/assets/deep-ai-council-presentation.txt`
  - `.skilled/commands/deep/assets/deep-research-presentation.txt`
  - `.skilled/commands/deep/assets/deep-review-presentation.txt`
  - `.skilled/commands/speckit/assets/speckit-complete-presentation.txt`
  - `.skilled/commands/speckit/assets/speckit-plan-presentation.txt`
- [ ] Verify each file is readable and syntax is valid
- **Verification**: All 9 files contain "in the same track" in option C

### T005: Regenerate 3 Compiled Contracts from Sources

- [ ] Read the compilation pipeline in `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`
- [ ] Run the script to regenerate all contracts from the source presentations
- [ ] Verify the 3 deep contracts now contain "in the same track" in option C
- [ ] Validate with contract-drift check if available
- **Affected**: `deep-ai-council.contract.md`, `deep-research.contract.md`, `deep-review.contract.md`
- **Command**: `node compile-command-contracts.cjs` (verify exact command)

### T006: Write Parity Test

- [ ] Create a test or script that:
  - Reads `GATE_3_CHOICE_RELATED` from constants
  - Scans each of the 12 named files for the option C menu line
  - Confirms each matches the constant exactly
  - Reports divergence by file and line
  - Returns non-zero exit on any mismatch
- [ ] Document the test location and how to run it
- **Files to create**: New test file (location TBD)

### T007: Run Parity Test on All 12 Files

- [ ] Execute the parity test against all 9 presentation files
- [ ] Execute the parity test against all 3 compiled contracts
- [ ] Confirm every file passes
- [ ] Fix any failures and retest
- **Verification**: Test exits with status 0

### T008: Validate Phase

- [ ] Run `validate.sh --strict` on the spec folder
- [ ] Verify spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md are all internally consistent
- [ ] Confirm hook tests still pass (baseline unchanged)
- **Verification**: All checks pass

### T009: Documentation and Handoff

- [ ] Update implementation-summary.md to reflect completion
- [ ] Prepare a summary of changes for the parent spec changelog
- [ ] Confirm the 12 file names are documented in plan.md or spec.md
- **Files affected**: implementation-summary.md

---

## Verification Checklist Details

- [ ] Hook test location verified in T003
- [ ] All 9 presentation files edited in T004 with verified format
- [ ] 3 deep contracts regenerated in T005 from sources
- [ ] Parity test created and documented in T006
- [ ] Parity test passes on all 12 files in T007
- [ ] Phase validation passes in T008
- [ ] Documentation complete in T009

<!-- /ANCHOR:tasks -->
