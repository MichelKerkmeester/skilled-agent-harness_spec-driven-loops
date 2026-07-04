---
title: "LS-003: OPENCODE Shell Sub-Detection"
description: "Verify that within OPENCODE surface, shell-script extensions trigger loading of shell/* references (not typescript, python, or config)."
version: 3.5.0.2
---

# LS-003: OPENCODE Shell Sub-Detection

## 1. OVERVIEW

Verify language sub-detection for `.sh` / `.bash` files within OPENCODE. Shell ref set loads; TypeScript/Python/Config sets do not.

## 2. SCENARIO CONTRACT

**Realistic user request**: Harden a validation script with strict mode and a cleanup trap.

**Exact prompt**:
```
Add set -euo pipefail and a trap to .opencode/skills/system-spec-kit/scripts/spec/validate.sh to clean up the temp dir on exit.
```

**Expected detection**:
- Surface: `OPENCODE`
- Sub-language: `SHELL` (target `.sh`, signals: `set -euo pipefail`, `trap`)

**Expected references loaded**:
- `references/opencode/shell/style_guide.md`
- `references/opencode/shell/quality_standards.md`
- `references/opencode/shell/quick_reference.md`
- `references/opencode/shared/code_organization.md`
- `references/opencode/shared/universal_patterns.md`

**Expected assets loaded**:
- `assets/opencode/checklists/shell_checklist.md`
- `assets/opencode/checklists/universal_checklist.md`

**Expected NOT loaded**: any `references/opencode/{typescript,python,config}/*`.

## 3. TEST EXECUTION

### Preconditions

1. Target file exists: `bash: test -f .opencode/skills/system-spec-kit/scripts/spec/validate.sh`
2. Shell sub-language reference set intact: 3 files under `references/opencode/shell/`.

### Exact Command Sequence

1. Invoke sk-code with the prompt.
2. Capture loaded refs to `/tmp/skc-LS003-loaded-refs.txt`.
3. Verify: 3 shell/* + 2 shared/* refs loaded; 0 typescript/python/config refs.

### Pass/Fail Criteria

- **PASS** iff: 3 shell/* refs + 2 shared/* refs loaded AND 0 other-sub-language refs.
- **FAIL** iff: any typescript/python/config ref leaks.

### Failure Triage

1. Verify `.sh` and shebang signals (`#!/bin/bash`, `#!/usr/bin/env bash`) in SKILL.md sub-detection table.
2. Verify `pipefail` is in the SHELL signal keywords list.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` (sub-detection table).
- `.opencode/skills/sk-code/code-implement/references/opencode/shell/{style_guide,quality_standards,quick_reference}.md`.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
