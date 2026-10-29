---
title: "LS-001: SKILLED TypeScript Sub-Detection"
description: "Verify that within SKILLED surface, TypeScript file extensions trigger loading of typescript/* references (not python, shell, or config)."
version: 1.5.5.0
---

# LS-001: SKILLED TypeScript Sub-Detection

## 1. OVERVIEW

This scenario verifies the language sub-detection layer within SKILLED. When the target file extension is `.ts`, `.tsx`, `.mts`, or `.d.ts`, sk-code MUST load the `sk-code-skilled/references/typescript/*` set and corresponding `sk-code-skilled/assets/checklists/typescript-checklist.md`, while excluding python, shell, and config sub-language references.

Sub-detection rules are defined in section 3 of `shared/references/stack-detection.md`.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to harden the executor-config parser to throw early when an invalid model is supplied for cli-opencode.

**Exact prompt**:
```
Refactor the parseExecutorConfig function in .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.
```

Prompt: `Refactor the parseExecutorConfig function in .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.`

**Expected detection**:
- Surface: `SKILLED`
- Sub-language: `TYPESCRIPT` (target file `.ts`)

**Expected references loaded** (must be EXACTLY this set, no more, no less from the language tier):
- `sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md`
- `sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md`
- `sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md`

**Expected assets loaded**:
- `sk-code-skilled/assets/checklists/typescript-checklist.md`
- `sk-code-skilled/assets/checklists/universal-checklist.md`

**Expected NOT loaded**: any of `sk-code-skilled/references/{python,shell,config}/*`, any of `sk-code-skilled/assets/checklists/{python,shell,config}_checklist.md`.

---

## 3. TEST EXECUTION

### Preconditions

1. Target file exists: `bash: test -f .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
2. TypeScript sub-language reference set intact: `bash: ls .skilled/skills/sk-code/sk-code-skilled/references/typescript/` lists exactly the three folders `quality-standards`, `quick-reference` and `style-guide`, and each folder holds at least one topic part.

### Exact Command Sequence

1. **Invoke sk-code** with the prompt.
2. **Capture loaded refs** to `/tmp/skc-LS001-loaded-refs.txt`.
3. **Verify**: 3 typescript/* + 2 shared/* refs loaded; 0 python/shell/config refs loaded.

### Expected Signals

Expected signals: exactly 3 `typescript/*` refs plus 2 `shared/*` refs load, and 0 python/shell/config refs load.

### Pass/Fail Criteria

- **PASS** iff: exactly 3 typescript/* refs + 2 shared/* refs in load set AND 0 other-sub-language refs.
- **FAIL** iff: any python/shell/config sub-language ref is loaded, OR fewer than 3 typescript/* refs loaded.

Evidence: `/tmp/skc-LS001-loaded-refs.txt` (loaded-refs transcript).

### Failure Triage

1. If a python/shell/config ref leaks: verify the TYPESCRIPT row and the CONFIG row in `shared/references/stack-detection.md` section 3.
2. If a quick-reference part is missing: check the LANGUAGE row of the load tiers and the language overlay in `ROUTER.md` section 4, which names the three folders for each language.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/sk-code/shared/references/stack-detection.md` (section 3, SKILLED language sub-detection).
- `.skilled/skills/sk-code/ROUTER.md` — the hub's routing and load-discipline rules.
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/` — the three expected-loaded TypeScript reference folders, `style-guide/`, `quality-standards/` and `quick-reference/`, each split into topic parts.

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that names `ROUTER.md` as the owner of the stage-two resource maps the language overlay lives in.

---

## 5. SOURCE METADATA

- Group: Language Sub-Detection
- Playbook ID: LS-001
- **Created**: 2026-05-04
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
