---
title: "LS-005: SKILLED JavaScript Sub-Detection"
description: "Verify that within SKILLED surface, JavaScript file extensions trigger loading of javascript/* references (not typescript, python, shell, rust, or config)."
version: 1.5.1.0
---

# LS-005: SKILLED JavaScript Sub-Detection

## 1. OVERVIEW

Verify language sub-detection for `.js`, `.mjs` and `.cjs` files within SKILLED. The JAVASCRIPT row is the first row of the sub-detection table in section 3 of `shared/references/stack-detection.md`, and it sits directly above TYPESCRIPT, so the two rows compete for the same prompts. A `.cjs` file must resolve to JavaScript and must not pull the TypeScript trio.

The JavaScript reference set is split: `style-guide.md` and `quick-reference.md` are files, while `quality-standards/` is a folder of topic parts. The load set is therefore graded per path, not by counting three files.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants the benchmark report renderer to print its usage line instead of throwing when it is called with neither of its two argument shapes.

**Exact prompt**:
```
Add a guard to main in .skilled/skills/sk-code/benchmark/scripts/render-report.cjs so an argv with neither --check nor a source path prints the usage line instead of throwing.
```

Prompt: `Add a guard to main in .skilled/skills/sk-code/benchmark/scripts/render-report.cjs so an argv with neither --check nor a source path prints the usage line instead of throwing.`

**Expected detection**:
- Surface: `SKILLED` (target path contains `/.skilled/`)
- Sub-language: `JAVASCRIPT` (target file extension `.cjs`, declared in the JAVASCRIPT row's `.js`, `.mjs`, `.cjs` extension list)

**Expected references loaded**:
- `sk-code-skilled/references/javascript/style-guide.md`
- `sk-code-skilled/references/javascript/quick-reference.md`
- `sk-code-skilled/references/javascript/quality-standards/`
- `sk-code-skilled/references/shared/`

**Expected assets loaded**:
- `sk-code-skilled/assets/checklists/javascript-checklist.md`
- `sk-code-skilled/assets/checklists/universal-checklist.md`

**Expected NOT loaded**: any of `sk-code-skilled/references/{typescript,python,shell,rust,config}/`, and `sk-code-skilled/assets/checklists/{typescript,python,shell,config}-checklist.md`.

---

## 3. TEST EXECUTION

### Preconditions

1. Target file exists: `bash: test -f .skilled/skills/sk-code/benchmark/scripts/render-report.cjs`.
2. The JavaScript sub-language reference set is intact: `bash: ls .skilled/skills/sk-code/sk-code-skilled/references/javascript/` lists `quality-standards`, `quick-reference.md` and `style-guide.md`.
3. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Add a guard to main in .skilled/skills/sk-code/benchmark/scripts/render-report.cjs so an argv with neither --check nor a source path prints the usage line instead of throwing." --threshold 0.8 > /tmp/skc-LS005-advisor.txt
   ```
2. **Verify**: sk-code is the top-1 candidate and its `passes_threshold` is true.
3. **Invoke sk-code** with the exact prompt.
4. **Capture loaded refs** to `/tmp/skc-LS005-loaded-refs.txt`.
5. **Verify**: the three javascript paths plus `sk-code-skilled/references/shared/` loaded; 0 typescript/python/shell/rust/config paths loaded.

### Expected Signals

Expected signals: `SURFACE: SKILLED` then `LANGUAGE: JAVASCRIPT`; exactly one entry under `sk-code-skilled/references/javascript/quality-standards/`, plus `style-guide.md`, `quick-reference.md` and `sk-code-skilled/references/shared/`; 0 other-sub-language refs.

### Pass/Fail Criteria

- **PASS** iff: sub-language == JAVASCRIPT AND `style-guide.md`, `quick-reference.md` and at least one `quality-standards/` part are in the load set AND `sk-code-skilled/references/shared/` is in the load set AND 0 typescript/python/shell/rust/config refs are loaded.
- **FAIL** iff: any other-sub-language ref is loaded, the prompt resolves to TYPESCRIPT because `.cjs` was not recognised, or one of the two flat javascript files is missing from the load set.

Evidence: `/tmp/skc-LS005-advisor.txt` (advisor probe output) and `/tmp/skc-LS005-loaded-refs.txt` (loaded-refs transcript).

### Failure Triage

1. If the route lands on TYPESCRIPT: confirm the JAVASCRIPT row's extension list in `shared/references/stack-detection.md` section 3 still reads `.js`, `.mjs`, `.cjs`, and that no earlier row claims `.cjs`.
2. If `quality-standards/` is empty in the load set: confirm the folder still holds topic parts in `sk-code-skilled/references/javascript/quality-standards/`, because the split-folder convention means there is no single `quality-standards.md` to load.
3. If a config ref leaks: a `.cjs` file is not config, so check that the CONFIG row's extensions stay `.json`, `.jsonc`, `.yaml`, `.yml`.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/sk-code/shared/references/stack-detection.md` (section 3, the JAVASCRIPT row).
- `.skilled/skills/sk-code/ROUTER.md` (section 4, the language overlay).
- `.skilled/skills/sk-code/sk-code-skilled/references/javascript/` — the expected-loaded JavaScript references.
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md` — the JavaScript checklist.
- `.skilled/skills/sk-code/benchmark/scripts/render-report.cjs` — the target file the prompt names.

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that names `ROUTER.md` as the owner of the stage-two resource maps the language overlay lives in.

---

## 5. SOURCE METADATA

- Group: Language Sub-Detection
- Playbook ID: LS-005
- **Created**: 2026-10-28
- **Critical path**: No
- **Destructive**: No (read-only routing test; the guard edit is described and not applied)
- **Sandbox**: production read-only; do not edit `render-report.cjs` during the routing test.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
