---
id: PR-008
category: resource_loading
title: 'References-only resource isolation'
description: "This scenario validates references-only resource loading for `PR-008`. It focuses on confirming a LANGUAGE_STANDARDS naming-convention prompt loads only `references/` files with zero `assets/` checklists, since this is the one declared intent whose RESOURCE_MAP set carries no asset."
expected_surface: PI_REMOTE
expected_intent: LANGUAGE_STANDARDS
expected_resources:
  - references/design-system/token-library.md
  - references/design-system/component-tokens.md
  - references/design-system/theme-remap.md
  - references/design-system/scoped-style-ownership.md
  - references/design-system/css-class-naming-bem.md
  - references/svelte/svelte.md
  - references/conventions/comment-grammar.md
  - references/conventions/folder-docs.md
version: 1.0.0.0
---

# PR-008: References-only resource isolation

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-008`.

---

## 1. OVERVIEW

This scenario validates resource-loading isolation for `PR-008`. It focuses on confirming that a
`LANGUAGE_STANDARDS` naming-convention question loads exclusively the eight `references/` paths in its
`RESOURCE_MAP` entry and pulls zero `assets/` checklists — the one declared intent on this surface whose
full resource set carries no asset, since a "how does the grammar work" answer never needs a pre-flight
or audit checklist.

### Why This Matters

Every other declared intent on this surface (`IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`,
`VERIFICATION`, `ACCESSIBILITY`) pairs at least one `assets/` checklist with its references, because each
of those is an action a workflow executes and then proves. `LANGUAGE_STANDARDS` is the one pure-answer
intent — nothing to check off, only a convention to cite correctly. A router that loads a checklist
alongside a naming explanation signals resource-loading drift: it is treating an explanation as an
executable action.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-008` classifies as `LANGUAGE_STANDARDS` and resolves only the
eight declared reference paths, with zero asset paths present.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `LANGUAGE_STANDARDS`, and
  every path in `expected_resources` resolves while no `assets/` path is loaded.
- Real user request: `Explain how the kebab-case file naming grammar and the BEM block--element CSS class grammar line up, and where a new per-surface component token name would live in that model.`
- Prompt: `Explain how the kebab-case file naming grammar and the BEM block--element CSS class grammar line up, and where a new per-surface component token name would live in that model.`

**Exact prompt**:
```text
Explain how the kebab-case file naming grammar and the BEM block--element CSS class grammar line up, and where a new per-surface component token name would live in that model.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `LANGUAGE_STANDARDS` `INTENT_SIGNALS`
  keyword (`kebab-case`, ...) matches the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root while no `assets/*` path is loaded.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/` and every one
  sits under `references/`; zero `assets/` paths appear in the loaded set.
- Desired user-visible outcome: the answer names the kebab-case source grammar, the BEM `block--element`
  class grammar, and the `--model-sheet-*`/`--slash-*`/`--diff-*` component-token family naming, without
  proposing a pre-flight or audit checklist step the prompt never asked for.
- Pass/fail: PASS if every listed path exists, every listed path sits under `references/`, and the
  frontmatter surface/intent are `PI_REMOTE`/`LANGUAGE_STANDARDS`; FAIL if any listed path is missing, an
  `assets/` path is loaded, or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Explain how the kebab-case file naming grammar and the BEM block--element CSS class grammar line up, and where a new per-surface component token name would live in that model.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/resource-loading/references-only-load.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"LANGUAGE_STANDARDS":/,/\],/p'`
3. `for p in references/design-system/token-library.md references/design-system/component-tokens.md references/design-system/theme-remap.md references/design-system/scoped-style-ownership.md references/design-system/css-class-naming-bem.md references/svelte/svelte.md references/conventions/comment-grammar.md references/conventions/folder-docs.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`
4. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"LANGUAGE_STANDARDS":/,/\],/p' | grep -c 'assets/'`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: LANGUAGE_STANDARDS`. Step 2 shows the
`LANGUAGE_STANDARDS` `RESOURCE_MAP` entry this scenario's set mirrors in full. Step 3 prints `OK` for all
eight paths. Step 4 prints `0`, confirming the `LANGUAGE_STANDARDS` entry contains no `assets/` path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["LANGUAGE_STANDARDS"]`
excerpt; the asset-count grep result.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under `references/`, no `assets/` path is present in
  the `LANGUAGE_STANDARDS` set, and the frontmatter's `expected_surface`/`expected_intent` match
  `PI_REMOTE`/`LANGUAGE_STANDARDS`.
- **Fail**: any listed path is missing, an `assets/` path appears in the `LANGUAGE_STANDARDS` set, or the
  frontmatter surface/intent disagree with `PI_REMOTE`/`LANGUAGE_STANDARDS`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. If step 4 reports a nonzero count, diff the `SKILL.md` `RESOURCE_MAP["LANGUAGE_STANDARDS"]` entry
   against this scenario's `expected_resources` to see whether an asset was newly added to the intent, or
   whether the drift belongs to a different intent's map that was misread.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli resource loading
- Playbook ID: PR-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `resource-loading/references-only-load.md`
