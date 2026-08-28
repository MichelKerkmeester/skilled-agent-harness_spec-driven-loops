---
id: OB-004
category: code_quality
title: 'Folder docs routing'
description: "This scenario validates CODE_QUALITY routing for `OB-004`. It focuses on confirming a folder-documentation-threshold prompt loads the folder-docs reference and checklist together with the comment-grammar and banner evidence they cross-reference."
expected_surface: OBSIDIAN
expected_intent: CODE_QUALITY
expected_resources:
  - references/folder-docs.md
  - assets/folder-docs-checklist.md
  - references/comment-grammar.md
  - assets/comment-banner-checklist.md
  - references/standards/code-standards.md
version: 1.0.0.0
---

# OB-004: Folder docs routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-004`.

---

## 1. OVERVIEW

This scenario validates CODE_QUALITY routing for `OB-004`. It focuses on confirming that a prompt
asking whether a folder owes a `README.md`/`CODE.md` pair classifies as `CODE_QUALITY` and loads the
folder-docs threshold rule alongside its checklist and the comment-grammar/banner evidence those
documents cross-reference, since a folder doc's `CODE.md` half restates the same banner grammar.

### Why This Matters

The pairing threshold is three or more direct source files, or any child folder that itself
contains source — a rule easy to misapply by counting recursively instead of directly, or by
missing that a folder with only two direct files but one source-carrying child still qualifies.
`folder-docs.md` names the folders that owe docs today measured against the live tree
(`src`, `src/data`, `src/views`, `src/views/modals`, `tools`, `tools/screenshots`,
`tools/screenshots/scenarios`, plus a `README.md`-only obligation for `src/__tests__` and
`src/data/__tests__`); loading it with `folder-docs-checklist.md` is what stops a workflow from
skipping a folder that qualifies only through the child-folder clause.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-004` classifies as `CODE_QUALITY` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `CODE_QUALITY`, and every
  path in `expected_resources`.
- Real user request: `Does tools/screenshots/scenarios/ owe a README.md and CODE.md pair under the folder-doc threshold, and if so what goes in each?`
- Prompt: `Does tools/screenshots/scenarios/ owe a README.md and CODE.md pair under the folder-doc threshold, and if so what goes in each?`

**Exact prompt**:
```text
Does tools/screenshots/scenarios/ owe a README.md and CODE.md pair under the folder-doc threshold, and if so what goes in each?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `CODE_QUALITY` `INTENT_SIGNALS`
  keywords (`folder docs`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `CODE_QUALITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow states that `tools/screenshots/scenarios/`
  qualifies (named explicitly in §3b's measured list) and drafts a `README.md`/`CODE.md` pair rather
  than a single merged file, citing the same threshold for any sibling folder the prompt might expand
  to next.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Does tools/screenshots/scenarios/ owe a README.md and CODE.md pair under the folder-doc threshold, and if so what goes in each?`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/folder-docs-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p'`
3. `for p in references/folder-docs.md assets/folder-docs-checklist.md references/comment-grammar.md assets/comment-banner-checklist.md references/standards/code-standards.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: CODE_QUALITY`. Step 2 shows the
`CODE_QUALITY` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all
five paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`CODE_QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["CODE_QUALITY"]`
   excerpt — the two sets are not required to be identical (`expected_resources` is a curated core
   subset, not an exact mirror).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../SKILL.md) §3b | The measured folder-doc obligation list this scenario's prompt checks against |

---

## 5. SOURCE METADATA

- Group: code-obsidian routing
- Playbook ID: OB-004
- Canonical root source: [manual-testing-playbook.md](manual-testing-playbook.md)
- Feature file path: `folder-docs-routing.md`
