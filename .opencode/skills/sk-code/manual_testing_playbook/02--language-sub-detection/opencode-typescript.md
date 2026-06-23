---
title: "LS-001: OPENCODE TypeScript Sub-Detection"
description: "Verify that within OPENCODE surface, TypeScript file extensions trigger loading of typescript/* references (not python, shell, or config)."
version: 3.5.0.3
---

# LS-001: OPENCODE TypeScript Sub-Detection

## 1. OVERVIEW

This scenario verifies the language sub-detection layer within OPENCODE. When the target file extension is `.ts`, `.tsx`, `.mts`, or `.d.ts`, sk-code MUST load the `references/opencode/typescript/*` set and corresponding `assets/opencode/checklists/typescript_checklist.md`, while excluding python, shell, and config sub-language references.

Sub-detection rules are defined in SKILL.md lines 78-90 and `references/stack_detection.md:50-62`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to harden the executor-config parser to throw early when an invalid model is supplied for cli-codex.

**Exact prompt**:
```
Refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-codex.
```

**Expected detection**:
- Surface: `OPENCODE`
- Sub-language: `TYPESCRIPT` (target file `.ts`)

**Expected references loaded** (must be EXACTLY this set, no more, no less from the language tier):
- `references/opencode/typescript/style_guide.md`
- `references/opencode/typescript/quality_standards.md`
- `references/opencode/typescript/quick_reference.md`
- `references/opencode/shared/code_organization.md`
- `references/opencode/shared/universal_patterns.md`

**Expected assets loaded**:
- `assets/opencode/checklists/typescript_checklist.md`
- `assets/opencode/checklists/universal_checklist.md`

**Expected NOT loaded**: any of `references/opencode/{python,shell,config}/*`, any of `assets/opencode/checklists/{python,shell,config}_checklist.md`.

## 3. TEST EXECUTION

### Preconditions

1. Target file exists: `bash: test -f .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
2. TypeScript sub-language reference set intact: `bash: ls .opencode/skills/sk-code/references/opencode/typescript/ | sort` returns exactly `quality_standards.md style_guide.md quick_reference.md` (in some sort order).

### Exact Command Sequence

1. **Invoke sk-code** with the prompt.
2. **Capture loaded refs** to `/tmp/skc-LS001-loaded-refs.txt`.
3. **Verify**: 3 typescript/* + 2 shared/* refs loaded; 0 python/shell/config refs loaded.

### Pass/Fail Criteria

- **PASS** iff: exactly 3 typescript/* refs + 2 shared/* refs in load set AND 0 other-sub-language refs.
- **FAIL** iff: any python/shell/config sub-language ref is loaded, OR fewer than 3 typescript/* refs loaded.

### Failure Triage

1. If a python/shell/config ref leaks: verify the file extension parsing in SKILL.md sub-detection table.
2. If quick_reference.md is missing: check whether the quick-reference always-load rule in `resource_loading.md` is intact.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` (lines 78-90 — sub-detection table).
- `.opencode/skills/sk-code/references/stack_detection.md` (lines 50-62).
- `.opencode/skills/sk-code/references/opencode/typescript/{style_guide,quality_standards,quick_reference}.md`.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
