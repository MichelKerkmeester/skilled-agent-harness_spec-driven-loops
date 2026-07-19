---
title: "132 -- description.json schema field validation"
description: "This scenario validates description.json schema field validation for `132`. It focuses on Confirm per-folder description metadata matches schema contract."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-description-json-schema-field-validation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 132 -- description.json schema field validation

## 1. OVERVIEW

This scenario validates description.json schema field validation for `132`. It focuses on Confirm per-folder description metadata matches schema contract.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm per-folder description metadata matches schema contract.
- Real user request: `` Please validate description.json schema field validation against specId and tell me whether the expected signals are present: description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration. ``
- Prompt: `Validate description.json schema field validation and repair behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 9 fields are present with the exact string / array-of-strings / number matrix, save updates sequence/history, and regeneration repairs corrupted fields

---

## 3. TEST EXECUTION

### Prompt

```
Validate description.json schema field validation and repair behavior.
```

### Commands

1. Create sandbox spec folder via create.sh → verify description.json generated
2. Assert 9 required fields: specId, folderSlug, parentChain, memorySequence, memoryNameHistory, specFolder, description, keywords, lastUpdated
3. Verify the full 9-field type matrix: strings (`specId`, `folderSlug`, `specFolder`, `description`, `lastUpdated`), arrays of strings (`parentChain`, `memoryNameHistory`, `keywords`), number (`memorySequence`)
4. Save memory → verify `memorySequence` and `memoryNameHistory` update
5. Corrupt a field → verify regeneration repairs it

### Expected

description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration

### Evidence

BLOCKED before executing the scenario commands: the scenario requires writes outside this file, but the run instructions allowed writes only to this file.

Scenario commands that require out-of-scope writes:

```text
1. Create sandbox spec folder via create.sh → verify description.json generated
4. Save memory → verify `memorySequence` and `memoryNameHistory` update
5. Corrupt a field → verify regeneration repairs it
```

Observed `create.sh` read output confirming it is a real write workflow:

```text
5: # Creates spec folder with templates based on documentation level.
20: # Also creates scratch/ directories.
```

Observed search output confirming write operations and description generation in `create.sh`:

```text
Found 27 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/spec/create.sh:
  Line 386:     mkdir -p "$subfolder_path/scratch"
  Line 641:     mkdir -p "$child_path" "$child_path/scratch"
  Line 665:     desc_script="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
  Line 819: mkdir -p "$SPECS_DIR"
  Line 1079:         mkdir -p "$FEATURE_DIR"
  Line 1310:     # ── Generate description.json for parent ──
  Line 1313:     _DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
  Line 1317:         CREATED_FILES+=("description.json")
  Line 1333:         mkdir -p "$_child_path" "$_child_path/scratch"
  Line 1351:         # Generate description.json for child phase
  Line 1357:             _child_created_files+=("description.json")
  Line 1546: mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"
  Line 1573: # 6.5. GENERATE PER-FOLDER description.json
  Line 1576: _DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
  Line 1580:     CREATED_FILES+=("description.json")
  Line 1596:     mkdir -p "$FEATURE_DIR/spec-sections"
```

Because the scenario's required create/save/corrupt/regenerate steps would create or modify files outside `.opencode/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/description-json-schema-field-validation.md`, the expected schema/update/repair signals were not observed in this constrained run.

### Pass / Fail

- **BLOCKED**: The scenario could not be executed under the allowed write-path constraint because its commands require creating a sandbox spec folder, saving memory, corrupting a field, and regenerating metadata outside the single permitted file.

### Failure Triage

Verify create.sh generates description.json → Check 9-field schema validation, especially arrays-of-strings enforcement for `parentChain`, `memoryNameHistory`, and `keywords` → Inspect regeneration trigger and repair logic

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/spec-folder-description-discovery.md](../../feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 132
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/description-json-schema-field-validation.md`
