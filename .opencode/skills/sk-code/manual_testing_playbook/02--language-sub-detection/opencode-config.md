---
title: "LS-004: OPENCODE JSON/JSONC Sub-Detection"
description: "Verify that within OPENCODE surface, JSON/JSONC extensions trigger loading of config/* references."
version: 3.5.0.3
---

# LS-004: OPENCODE JSON/JSONC Sub-Detection

## 1. OVERVIEW

Verify language sub-detection for `.json` / `.jsonc` files within OPENCODE. Config ref set loads; other sub-language sets do not.

## 2. SCENARIO CONTRACT

**Realistic user request**: Add a derived metadata field to a packet's graph-metadata.json.

**Exact prompt**:
```
Add a derived.last_active_child_id field to the graph-metadata.json file with value "001-spec".
```

**Expected detection**:
- Surface: `OPENCODE`
- Sub-language: `CONFIG` (target `.json`, signals: `schema`, `descriptor`-style edits)

**Expected references loaded**:
- `references/opencode/config/style_guide.md`
- `references/opencode/config/quality_standards.md`
- `references/opencode/config/quick_reference.md`
- `references/opencode/shared/code_organization.md`
- `references/opencode/shared/universal_patterns.md`

**Expected assets loaded**:
- `assets/opencode/checklists/config_checklist.md`
- `assets/opencode/checklists/universal_checklist.md`

**Expected NOT loaded**: any `references/opencode/{typescript,python,shell}/*`.

## 3. TEST EXECUTION

### Preconditions

1. Target file exists at the specified path (or any equivalent `.json` under `.opencode/`).
2. Config sub-language reference set intact: 3 files under `references/opencode/config/`.

### Exact Command Sequence

1. Invoke sk-code with the prompt.
2. Capture loaded refs to `/tmp/skc-LS004-loaded-refs.txt`.
3. Verify: 3 config/* + 2 shared/* refs loaded; 0 other-sub-language refs.

### Pass/Fail Criteria

- **PASS** iff: 3 config/* refs + 2 shared/* refs loaded AND 0 other-sub-language refs.
- **FAIL** iff: any typescript/python/shell ref leaks.

### Failure Triage

1. Verify `.json` and `.jsonc` are mapped to CONFIG in SKILL.md sub-detection table.
2. Verify the package descriptor / graph-metadata files are not accidentally classified as typescript by an over-broad TS marker.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` (sub-detection table).
- `.opencode/skills/sk-code/opencode/references/config/{style_guide,quality_standards,quick_reference}.md`.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
