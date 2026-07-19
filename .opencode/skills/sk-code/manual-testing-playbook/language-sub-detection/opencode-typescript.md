---
title: "LS-001: OPENCODE TypeScript Sub-Detection"
description: "Verify that within OPENCODE surface, TypeScript file extensions trigger loading of typescript/* references (not python, shell, or config)."
version: 3.5.0.3
---

# LS-001: OPENCODE TypeScript Sub-Detection

## 1. OVERVIEW

This scenario verifies the language sub-detection layer within OPENCODE. When the target file extension is `.ts`, `.tsx`, `.mts`, or `.d.ts`, sk-code MUST load the `code-opencode/references/typescript/*` set and corresponding `code-opencode/assets/checklists/typescript-checklist.md`, while excluding python, shell, and config sub-language references.

Sub-detection rules are defined in SKILL.md lines 78-90 and `references/stack-detection.md:50-62`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to harden the executor-config parser to throw early when an invalid model is supplied for cli-opencode.

**Exact prompt**:
```
Refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/mcp-server/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.
```

**Expected detection**:
- Surface: `OPENCODE`
- Sub-language: `TYPESCRIPT` (target file `.ts`)

**Expected references loaded** (must be EXACTLY this set, no more, no less from the language tier):
- `code-opencode/references/typescript/style-guide/overview-strict-and-naming.md`
- `code-opencode/references/typescript/quality-standards/overview-and-type-system.md`
- `code-opencode/references/typescript/quick-reference/template-naming-and-types.md`
- `code-opencode/references/shared/code-organization/overview-and-module-organization.md`
- `code-opencode/references/shared/universal-patterns/naming-and-commenting.md`

**Expected assets loaded**:
- `code-opencode/assets/checklists/typescript-checklist.md`
- `code-opencode/assets/checklists/universal-checklist.md`

**Expected NOT loaded**: any of `code-opencode/references/{python,shell,config}/*`, any of `code-opencode/assets/checklists/{python,shell,config}_checklist.md`.

## 3. TEST EXECUTION

### Preconditions

1. Target file exists: `bash: test -f .opencode/skills/system-spec-kit/mcp-server/lib/deep-loop/executor-config.ts`
2. TypeScript sub-language reference set intact: `bash: ls .opencode/skills/sk-code/code-opencode/references/typescript/ | sort` returns exactly `quality-standards.md style-guide.md quick-reference.md` (in some sort order).

### Exact Command Sequence

1. **Invoke sk-code** with the prompt.
2. **Capture loaded refs** to `/tmp/skc-LS001-loaded-refs.txt`.
3. **Verify**: 3 typescript/* + 2 shared/* refs loaded; 0 python/shell/config refs loaded.

### Pass/Fail Criteria

- **PASS** iff: exactly 3 typescript/* refs + 2 shared/* refs in load set AND 0 other-sub-language refs.
- **FAIL** iff: any python/shell/config sub-language ref is loaded, OR fewer than 3 typescript/* refs loaded.

### Failure Triage

1. If a python/shell/config ref leaks: verify the file extension parsing in SKILL.md sub-detection table.
2. If quick-reference.md is missing: check whether the quick-reference always-load rule in `resource-loading.md` is intact.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` (lines 78-90 — sub-detection table).
- `.opencode/skills/sk-code/shared/references/stack-detection.md` (lines 50-62).
- `.opencode/skills/sk-code/code-opencode/references/typescript/{style_guide,quality_standards,quick_reference}.md`.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
