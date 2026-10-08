---
title: "Plan: Gate 3 menu parity"
description: "How this phase will be built."
trigger_phrases:
  - "gate 3 menu parity"
  - "gate 3 choice consistency plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Gate 3 menu parity

<!-- ANCHOR:plan -->

## 1. Technical Context

Gate 3 is the spec folder choice question asked when a mutation is about to happen. It offers four options, each with a stable English sentence:
- A: Use an existing spec folder
- B: Create a new spec folder
- C: Use a related folder, phase child, or series parent for a different change to the same artifact as an existing packet **in the same track**
- D: Skip

The phrase "in the same track" sets a boundary for option C, clarifying that related work must stay in the same track directory. This phrase is correctly defined in `GATE_3_CHOICE_RELATED` but was dropped or never included in 33 presentation files and any compiled contracts that carry the menu.

## 2. Approach

### 2.1 Inventory and Locate

- Search all `.skilled/commands/**/assets/*-presentation.txt` files (confirmed: 33 lack "in the same track").
- Search all `.skilled/skills/` and `.skilled/` for compiled contracts or YAML that embed Gate 3 menus.
- Search hook test files for hardcoded Gate 3 menu text.

### 2.2 Edit 9 Presentation Files

- In each of the 9 named presentation files, locate the option C line that names "related folder" or "phase child" or "series parent".
- Replace it with the exact wording from `GATE_3_CHOICE_RELATED`: "Use a related folder, phase child, or a series parent for a different change to the same artifact as an existing packet in the same track".
- Example files: `speckit-plan-presentation.txt:73`, `create-skill-presentation.txt:89`.

### 2.3 Regenerate 3 Deep Contracts

- The 3 deep contracts (`deep-ai-council.contract.md`, `deep-research.contract.md`, `deep-review.contract.md`) are generated from presentation sources.
- Run `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` to regenerate all contracts from their presentation sources.
- Verify the regenerated contracts contain "in the same track" in option C by running `.skilled/scripts/check-contract-drift.cjs` or similar.

### 2.4 Write Parity Test

- Write a test or script that:
  - Reads `GATE_3_CHOICE_RELATED` from the constants.
  - Scans each of the 12 named files for the option C menu.
  - Confirms each menu matches the constant exactly.
  - Reports any divergence by file and line.
  - Returns non-zero exit if any file fails.

## 3. Affected Surfaces

### Files to Modify

| Surface | Count | Details |
|---------|-------|---------|
| Presentation files | 9 | Named files that lack "in the same track" in option C |
| Compiled contracts | 3 | `deep-ai-council`, `deep-research`, `deep-review`, regenerated from presentation sources |
| Hook tests | 0 | Do not modify (byte-identity baseline must be preserved) |
| New parity test | 1 | Script to scan and verify all 12 files |

### Files to Create or Add To

| File | Purpose |
|------|---------|
| New test (location TBD) | Parity test that scans the 12 named files and matches each against the constant |

### Files to Read

| File | Purpose |
|------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Understand how to regenerate contracts |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:300-324` | Understand the byte-identity baseline (do not edit) |

## 4. Testing Strategy

### Pre-commit Checks

- Run the parity test on all presentation and contract files.
- Confirm no presentation diverges from the constant.
- Confirm gate 3 menu appears in the correct location in each file (usually around line 73 for presentation files).

### Test Coverage

- Unit test: parity test confirms each file matches.
- Integration test: hook tests that use Gate 3 pass with the constants.
- Regression test: check that no other code path breaks due to the change.

## 5. Dependencies

- No dependencies on other phases.
- No changes to runtime behavior; only presentation text changes.

## 6. Rollback

- Revert the commits that replaced the hardcoded text.
- `git log --oneline | head -5` to find the commit before the change.
- `git revert <commit-hash>` for each change, or `git reset --hard <parent-commit>` if not yet pushed.

## 7. Confidence and Risks

### Low Risk

- The constants already carry the correct text.
- The change is text-only in presentation files.
- No code behavior changes.
- Test coverage is straightforward: grep for the phrase and assert it exists.

### Mitigation

- Test the parity script on a sample of files before applying to all 33.
- Validate presentation file syntax after each replacement.
- If a compiled contract is in binary format, document it clearly and validate with the builder.

## 8. Metadata and References

- **Research evidence**: `../../014-spec-auto-healing-research/research/research.md` section 8.4, V8, V42
- **Constants location**: `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` lines 149-152
- **Sample presentation**: `.skilled/commands/speckit/assets/speckit-plan-presentation.txt` line 73 (research example) or `.skilled/commands/create/assets/create-skill-presentation.txt` line 89 (a file needing edit)

<!-- /ANCHOR:plan -->
