---
title: "Feature Specification: Phase 2: multiplexed-rule-split"
description: "Five CANONICAL_SAVE_* registry rows share one script and an env-var round trip instead of one script each, so a row's script_path is not the one-to-one contract the registry implies."
trigger_phrases:
  - "multiplexed validator rule split"
  - "canonical save script split"
  - "registry script path mapping"
  - "orchestrator env round trip"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: multiplexed-rule-split

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/002-multiplexed-rule-split` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 16 |
| **Predecessor** | 001-hook-adapter-thin-transports |
| **Successor** | 003-playbook-provenance-lines |
| **Handoff Criteria** | validator-registry.json maps each CANONICAL_SAVE_* row to its own script, validate.sh --help still lists all 39 rows and validate-runs-every-registry-rule.vitest.ts passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Recorded findings closure specification.

**Scope Boundary**: `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save.sh` and `check-canonical-save-helper.cjs`, the five `CANONICAL_SAVE_*` rows in `cli/lib/validator-registry.json` and the `check-canonical-save.sh` special case in `lib/validation/orchestrator.ts`. The five `ts:spec-doc-structure` rows are assessed but not split (see Out of Scope).

**Dependencies**:
- `cli/tests/validate-runs-every-registry-rule.vitest.ts` and `cli/tests/canonical-save-validation.vitest.ts`, the regression floor this phase must keep green.
- `lib/validation/orchestrator.ts`'s `REGISTRY_SHELL_RULE_WRAPPER` and `resolveRegistryRuleScript`, which resolve every `rules/*.sh` `script_path` value. New files must resolve the same way existing ones do.

**Deliverables**:
- Five new single-purpose rule scripts, one per `CANONICAL_SAVE_*` row, replacing `check-canonical-save.sh`'s switch.
- `validator-registry.json`'s five `CANONICAL_SAVE_*` rows each pointing at their own script.
- `orchestrator.ts`'s `check-canonical-save.sh`-specific env round trip removed, since no row needs it once each script is self-identifying.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validator-registry.json` names 39 rule rows, and its `script_path` field reads as a one-to-one pointer from a rule id to the script that implements it. Five of those rows - `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`, `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`, `CANONICAL_SAVE_LINEAGE_REQUIRED`, `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`, `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS` - all point at `rules/check-canonical-save.sh` (`cli/lib/validator-registry.json:327-364`), which itself defers to a `switch (selectedRule)` inside `check-canonical-save-helper.cjs:118-226` that runs one of the five cases. To make that work, `orchestrator.ts` special-cases the script by basename and round-trips the row's id through an environment variable: `if [[ "$(basename "$rule_script")" == "check-canonical-save.sh" ]]; then SPECKIT_CANONICAL_SAVE_RULE="$rule_id" ...` (`lib/validation/orchestrator.ts:146-149`). Lane 005 round one confirmed this as F8 ("ten rows collapse onto two implementations") and round three's F3-04 named the same helper-switch shape in the metadata-shape family. Both rounds recorded it as a non-change pending proof that per-row attribution already holds, not proof that it should stay multiplexed forever.

### Purpose
Give each `CANONICAL_SAVE_*` registry row its own script, so `script_path` means what it says for every row and the orchestrator no longer needs a basename special case to route one rule id through five behaviors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extracting the five `switch` cases in `check-canonical-save-helper.cjs:118-226` into five standalone Node modules, one per rule id.
- Extracting the shared helpers `check-canonical-save-helper.cjs:1-117` (`readJson`, `normalizePacketId`, `derivePacketIdFromPath`, `readContinuityPacketPointer`, `emit`, the two env-tunable constants) into one shared module the five new scripts require.
- Writing five new `rules/check-canonical-save-*.sh` wrappers, each with its own `run_check` naming its own rule (mirroring the existing single-rule shell scripts such as `check-toc-policy.sh`).
- Updating `validator-registry.json`'s five `CANONICAL_SAVE_*` rows to point at their own new script.
- Removing the `check-canonical-save.sh` basename special case from `orchestrator.ts:146-149`, since every row becomes self-identifying.
- Deleting `check-canonical-save.sh` and `check-canonical-save-helper.cjs` once no registry row references them.
- Updating `cli/rules/README.md`'s file tree and rule-description table.

### Out of Scope
- The five `ts:spec-doc-structure` rows (`FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`). Unlike the shell multiplex, `runSpecDocStructureRule` already dispatches each rule id to its own dedicated function (`validateFrontmatterMemoryBlock`, `validateMergeLegality`, `validateSpecDocSufficiency`, `validateCrossAnchorContamination`, `validatePostSaveFingerprint` at `lib/validation/spec-doc-structure.ts:1249-1264`). The shared surface is one dispatch entry point in a TypeScript module, not a shell switch feeding through an env round-trip. Giving the registry a `ts:module#exportName` addressing scheme to make this a literal 1:1 mapping is an `orchestrator.ts` dispatch-mechanism change with no research backing the cost, so this phase records the attribution as already sound (five distinct functions, five distinct messages) rather than splitting it.
- Any row outside the two multiplexed families (34 of the 39 registry rows already map one script to one row and are untouched).
- The grandfathering-window logic F3-09 already removed from `check-canonical-save.sh`'s header - that fix stays, it is simply carried into whichever new script now owns `CANONICAL_SAVE_LINEAGE_REQUIRED`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-shared.cjs` | Create | Shared helpers extracted from `check-canonical-save-helper.cjs:1-117` |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-root-spec.sh` (+ matching `.cjs`) | Create | `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`'s own script |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-source-docs.sh` (+ matching `.cjs`) | Create | `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`'s own script |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-lineage.sh` (+ matching `.cjs`) | Create | `CANONICAL_SAVE_LINEAGE_REQUIRED`'s own script |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-packet-identity.sh` (+ matching `.cjs`) | Create | `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`'s own script |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-description-graph-freshness.sh` (+ matching `.cjs`) | Create | `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`'s own script |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save.sh` | Delete | Replaced by the five scripts above |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-helper.cjs` | Delete | Logic moved into the shared module and the five per-row modules |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | Point each `CANONICAL_SAVE_*` row's `script_path` at its own new script |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Remove the `check-canonical-save.sh` basename special case (lines 146-149) |
| `.opencode/skills/system-spec-kit/runtime/cli/rules/README.md` | Modify | Update the file tree and rule-description table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the five `CANONICAL_SAVE_*` registry rows has its own `script_path` value, and no two rows share a script. |
| REQ-002 | `orchestrator.ts` no longer special-cases `check-canonical-save.sh` by basename. The env round trip (`SPECKIT_CANONICAL_SAVE_RULE`) is removed because no row needs it. |
| REQ-003 | `validate.sh --help` still lists all 39 registry rows after the split, with the same rule ids. |
| REQ-004 | `validate-runs-every-registry-rule.vitest.ts` passes, proving every row still fires under the new scripts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `canonical-save-validation.vitest.ts`'s five per-row tests pass with unchanged outcomes, now exercising five separate scripts instead of one multiplexed helper. |
| REQ-006 | The `ts:spec-doc-structure` family's per-row attribution is documented as already sound (five dedicated functions dispatched from one entry point) rather than split, with the reasoning recorded here rather than silently dropped. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -c "import json; ..."` (or equivalent) over `validator-registry.json` shows five distinct `script_path` values for the five `CANONICAL_SAVE_*` rows, with no other row sharing a script.
- **SC-002**: `bash validate.sh --help` output is unchanged in rule count and rule ids (39 rows, same ids) before and after the split.
- **SC-003**: `npx vitest run validate-runs-every-registry-rule canonical-save-validation` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `CANONICAL_SAVE_LINEAGE_REQUIRED`'s grandfathering-cutoff behavior (`SPECKIT_CANONICAL_SAVE_CUTOFF`) and `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`'s slack window (`SPECKIT_CANONICAL_SAVE_FRESHNESS_SLACK_MS`) are env-tunable. Splitting the file could silently drop an env read if the constant is not carried into the shared module | Medium: a dropped env read would change grandfathering/slack behavior silently | Move both constants into `check-canonical-save-shared.cjs` verbatim and assert their names appear in the new module via grep before deleting the old helper |
| Risk | `orchestrator.ts`'s `REGISTRY_SHELL_RULE_WRAPPER` sources `$rule_script` and calls `run_check "$folder" "$level"` (two args) for every non-canonical-save row. The five new scripts must accept exactly that two-arg call, not the three-arg form the old multiplexed script used | Medium: a script expecting a third arg would silently read an empty `$3` | Each new script's `run_check` takes only `folder` and `level`, hardcoding its own rule name instead of reading a `selected_rule` parameter |
| Dependency | `canonical-save-validation.vitest.ts` already exercises each row individually via `SPECKIT_RULES` filtering (not `SPECKIT_CANONICAL_SAVE_RULE`), so it is expected to pass unmodified | Low | Confirmed by reading the test file: it never references `SPECKIT_CANONICAL_SAVE_RULE` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Five small scripts spawn five `node` processes instead of one script spawning `node` once per row (the multiplex already ran once per row via five separate `run_check` calls from the orchestrator, so process count is unchanged).
- **NFR-P02**: No new I/O. Each new module reads the same `description.json`/`graph-metadata.json` files the old helper read.

### Security
- **NFR-S01**: No new file-system write capability is introduced. Every new script stays read-only against the target folder, matching the original.

### Reliability
- **NFR-R01**: A missing shared module (`check-canonical-save-shared.cjs`) must fail each of the five new scripts the same way the old helper's missing-file branch failed (`RULE_STATUS=fail`, not a crash).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder that is not a live packet root: all five new scripts must keep the "not applicable" pass behavior the old switch's `isLivePacketRoot` guard produced.
- A folder with `graph-metadata.json` but no `description.json` (or vice versa): each new script's own case must reproduce the old switch's null-safe reads.

### Error Scenarios
- Missing shared module: each new script fails closed with a clear message, mirroring the old helper's `[[ ! -f "$CANONICAL_SAVE_HELPER" ]]` branch.
- Malformed JSON in `description.json`/`graph-metadata.json`: `readJson`'s existing try/catch-to-null behavior must be preserved verbatim in the shared module.

### State Transitions
- Grandfathering cutoff (`CANONICAL_SAVE_LINEAGE_REQUIRED`): a `last_save_at` before `SPECKIT_CANONICAL_SAVE_CUTOFF` still passes. On/after still fails, unchanged by the split.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 11 new files, 2 deleted files, 3 modified files, all inside `cli/rules/` and two registry/orchestrator touchpoints |
| Risk | 10/25 | Registry-driven dispatch is well-tested (`validate-runs-every-registry-rule.vitest.ts`). Risk is mostly the env-constant carry-over named above |
| Research | 8/20 | The multiplex shape, its exact line ranges and its test coverage are already fully characterized by lane 005's three rounds |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The `ts:spec-doc-structure` scope decision is resolved in Out of Scope above, not left open.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
