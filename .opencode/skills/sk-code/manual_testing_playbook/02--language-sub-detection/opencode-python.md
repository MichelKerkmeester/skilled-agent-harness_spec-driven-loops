---
title: "LS-002: OPENCODE Python Sub-Detection"
description: "Verify that within OPENCODE surface, Python file extensions trigger loading of python/* references (not typescript, shell, or config)."
version: 3.5.0.3
---

# LS-002: OPENCODE Python Sub-Detection

## 1. OVERVIEW

Verify language sub-detection for `.py` files within OPENCODE surface. The Python ref set MUST load; TypeScript/Shell/Config sets MUST NOT.

Sub-detection rules defined in SKILL.md lines 78-90.

## 2. SCENARIO CONTRACT

**Realistic user request**: Add a `--json-output` flag to the skill advisor CLI for machine-readable results.

**Exact prompt**:
```
Update the skill_advisor.py argparse block at .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py to add a --json-output flag that emits results as JSON.
```

**Expected detection**:
- Surface: `OPENCODE`
- Sub-language: `PYTHON` (target file `.py`, also Python-specific signal: `argparse`)

**Expected references loaded**:
- `references/opencode/python/style_guide.md`
- `references/opencode/python/quality_standards.md`
- `references/opencode/python/quick_reference.md`
- `references/opencode/shared/code_organization.md`
- `references/opencode/shared/universal_patterns.md`

**Expected assets loaded**:
- `assets/opencode/checklists/python_checklist.md`
- `assets/opencode/checklists/universal_checklist.md`

**Expected NOT loaded**: any of `references/opencode/{typescript,shell,config}/*`.

## 3. TEST EXECUTION

### Preconditions

1. Target file exists: `bash: test -f .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
2. Python sub-language reference set intact: 3 files under `references/opencode/python/`.

### Exact Command Sequence

1. Invoke sk-code with the prompt.
2. Capture loaded refs to `/tmp/skc-LS002-loaded-refs.txt`.
3. Verify: 3 python/* + 2 shared/* refs loaded; 0 typescript/shell/config refs.

### Pass/Fail Criteria

- **PASS** iff: 3 python/* refs + 2 shared/* refs loaded AND 0 other-sub-language refs.
- **FAIL** iff: any typescript/shell/config ref leaks, OR fewer than 3 python/* refs loaded.

### Failure Triage

1. If a typescript/* ref leaks: the extension detector is mis-firing on the `.py` extension.
2. If python signals not detected: verify `argparse`, `pytest`, `def `, docstring patterns in SKILL.md sub-detection table.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` (sub-detection table).
- `.opencode/skills/sk-code/code-implement/references/opencode/python/{style_guide,quality_standards,quick_reference}.md`.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
