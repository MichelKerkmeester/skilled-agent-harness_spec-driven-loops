---
id: OB-H06
category: holdout
title: 'Holdout -- independent probe for a keyword-blind accessibility question'
description: "Holdout scenario OB-H06: an independent, keyword-blind probe authored against no fitted scenario at all, testing whether references/accessibility.md surfaces for a plainly relevant question that avoids the word its STACK_STANDARDS keyword declares."
expected_surface: OBSIDIAN
expected_intent: STACK_STANDARDS
expected_resources:
  - references/accessibility.md
version: 1.0.0.0
---

# OB-H06: Independent probe for a keyword-blind accessibility question

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H06`.

---

## 1. OVERVIEW

Independent generalization probe, distinct in kind from `OB-H01`..`OB-H05`. Those five decontaminate
an existing fitted scenario's wording. This one has no fitted counterpart at all.
`references/accessibility.md` is wired into the `STACK_STANDARDS` group of `SKILL.md` §2b, and that
group selects it on the keyword `accessibility`. The probe asks a plainly relevant question that
never uses that word, so it measures whether the file still surfaces when the declared keyword is
absent.

### Why This Matters

A reference wired to an intent is reachable only through that intent's vocabulary. If a
screen-reader question never reaches `accessibility.md`, the file is present and wired but still
dead evidence for the people most likely to need it. The probe keeps that recall gap visible
instead of letting the keyword hide it.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact keyword-blind prompt for `OB-H06` still surfaces
`references/accessibility.md` although it contains no `STACK_STANDARDS` keyword.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN` and the response cites
  `references/accessibility.md`, although the prompt carries no keyword from any of the five
  declared groups.
- Real user request: `Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?`
- Prompt: `Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?`

**Exact prompt**:
```text
Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?
```

- Expected execution process: the hub detects `OBSIDIAN`. The prompt matches no literal
  `INTENT_SIGNALS` keyword from any of the five declared groups, because `STACK_STANDARDS` declares
  `accessibility` and the prompt says "screen reader" instead. The underlying concept
  (screen-reader and keyboard-navigation behavior) should still surface `accessibility.md` on
  general relevance grounds, not on a declared keyword match.
- Expected signals: `references/accessibility.md` exists under `sk-code-obsidian/`, sits in the
  `STACK_STANDARDS` list of `SKILL.md` §2b, and is cited in the response.
- Desired user-visible outcome: the bundled workflow states what `accessibility.md` documents about
  screen-reader and keyboard-navigation behavior for the table view, and does not silently fall back
  to `DEFAULT_RESOURCE` alone as if the prompt were a true zero-relevance case like `OB-012`.
- Pass/fail: PASS if `references/accessibility.md` exists, is wired in §2b and is cited; FAIL if the
  path is missing, is not wired, or the response falls back to `DEFAULT_RESOURCE` without citing
  accessibility evidence at all.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are, by frontmatter/path agreement plus a live-dispatch citation check, not by a mechanical
command transcript. Its point is whether a wired file is still reachable once the declared keyword
is missing from the question.

### Commands

1. `sed -n '1,14p' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md`
2. `test -e .skilled/skills/sk-code/sk-code-obsidian/references/accessibility.md && echo "OK references/accessibility.md" || echo "MISS references/accessibility.md"`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -c 'references/accessibility.md'`
4. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -c 'screen reader'`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: STACK_STANDARDS`. Step 2 prints `OK`. Step
3 prints `1`, confirming `accessibility.md` is wired into the `RESOURCE_MAP`. Step 4 prints `0`,
confirming the prompt's own vocabulary is absent from every `INTENT_SIGNALS` keyword group, which is
what keeps the probe keyword-blind.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the live-dispatch transcript
showing whether `accessibility.md` was cited.

### Pass / Fail

- **Pass**: `references/accessibility.md` exists, step 3 prints `1`, step 4 prints `0`, and a live
  dispatch of the exact prompt cites `accessibility.md`.
- **Fail**: the path is missing, step 3 prints `0`, or a live dispatch falls back to
  `DEFAULT_RESOURCE` alone without citing accessibility evidence for a plainly accessibility-shaped
  question.

### Failure Triage

1. Re-run step 2 and confirm whether `accessibility.md` was renamed or removed under `references/`.
2. If step 3 prints `0`, the file has dropped out of the `STACK_STANDARDS` list in `SKILL.md` §2b.
   Restore the entry. Router check 1b of `verify_router_sync.cjs` fails for the same reason.
3. If step 4 no longer prints `0`, a keyword now matches the prompt and the probe has stopped being
   keyword-blind. Write a new keyword-blind prompt, and move this one into `intent-detection/` under
   `STACK_STANDARDS`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | The `INTENT_SIGNALS` block whose `STACK_STANDARDS` keywords this probe avoids, and the `RESOURCE_MAP` block that wires `accessibility.md` |
| [SKILL.md](../../SKILL.md) §2 | The `REFERENCE MAP` table, which has no row for `accessibility.md`, so the file is reached through the §2b map instead |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/accessibility-independent.md`
