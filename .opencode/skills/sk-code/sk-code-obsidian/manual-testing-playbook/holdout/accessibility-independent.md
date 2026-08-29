---
id: OB-H06
category: holdout
title: 'Holdout -- independent probe for an unmapped reference'
description: "Holdout scenario OB-H06: an independent, keyword-blind probe authored against no fitted scenario at all, testing whether references/accessibility.md surfaces even though SKILL.md's own INTENT_SIGNALS block wires it to no declared intent group."
expected_surface: OBSIDIAN
expected_intent: UNMAPPED
expected_resources:
  - references/accessibility.md
version: 1.0.0.0
---

# OB-H06: Independent probe for an unmapped reference

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H06`.

---

## 1. OVERVIEW

Independent generalization probe, distinct in kind from `OB-H01`..`OB-H05`. Those five decontaminate
an existing fitted scenario's wording; this one has no fitted counterpart at all —
`references/accessibility.md` exists as a real, shipped file, but `SKILL.md` §2b's own
`INTENT_SIGNALS`/`RESOURCE_MAP` block never names it under any of the five declared intent groups.
This probe measures whether a genuinely unmapped reference still surfaces for a plainly relevant,
keyword-blind question, or whether it is permanently unreachable because nothing routes to it.

### Why This Matters

A reference file that exists on disk but is wired into no intent group is a real coverage gap, not a
stale-filename typo like the ones this packet's honesty note already tracks. If
`accessibility.md` never surfaces for any prompt, it is effectively dead evidence — present in the
tree but unreachable by the router this packet documents.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact keyword-blind prompt for `OB-H06` still surfaces
`references/accessibility.md` despite the file having no declared `INTENT_SIGNALS` entry.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN` and the response cites
  `references/accessibility.md`, despite the file being unmapped in `SKILL.md` §2b.
- Real user request: `Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?`
- Prompt: `Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?`

**Exact prompt**:
```text
Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?
```

- Expected execution process: the hub detects `OBSIDIAN`; the prompt matches no literal
  `INTENT_SIGNALS` keyword from any of the five declared groups, yet the underlying concept
  (screen-reader/keyboard-navigation behavior) should still surface `accessibility.md` on general
  relevance grounds, not a declared keyword match.
- Expected signals: `references/accessibility.md` exists under `sk-code-obsidian/` and is cited in
  the response.
- Desired user-visible outcome: the bundled workflow states what `accessibility.md` documents about
  screen-reader and keyboard-navigation behavior for the table view, and does not silently fall back
  to `DEFAULT_RESOURCE` alone as if the prompt were a true zero-relevance case like `OB-012`.
- Pass/fail: PASS if `references/accessibility.md` exists and is cited; FAIL if the path is missing
  or the response falls back to `DEFAULT_RESOURCE` without citing accessibility evidence at all.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Someone using a screen reader flagged that they can't tell which row is selected in the table view — is that a known gap, and where's the guidance on how this plugin should behave for them?`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are — by frontmatter/path agreement plus a live-dispatch citation check, not by a mechanical
command transcript, since this probe's entire point is whether an unmapped file is reachable at all.

### Commands

1. `sed -n '1,14p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md`
2. `test -e .opencode/skills/sk-code/sk-code-obsidian/references/accessibility.md && echo "OK references/accessibility.md" || echo "MISS references/accessibility.md"`
3. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | grep -c accessibility`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: UNMAPPED`. Step 2 prints `OK`. Step
3 prints `0`, confirming `accessibility.md` is genuinely absent from every `INTENT_SIGNALS` keyword
group — the fact this probe exists to test.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the live-dispatch transcript
showing whether `accessibility.md` was cited.

### Pass / Fail

- **Pass**: `references/accessibility.md` exists, step 3 confirms it is unmapped in
  `INTENT_SIGNALS`, and a live dispatch of the exact prompt cites `accessibility.md`.
- **Fail**: the path is missing, or a live dispatch falls back to `DEFAULT_RESOURCE` alone without
  citing accessibility evidence for a plainly accessibility-shaped question.

### Failure Triage

1. Re-run step 2 and confirm whether `accessibility.md` was renamed or removed under `references/`.
2. If step 3 no longer prints `0`, `SKILL.md` §2b has since wired `accessibility.md` into a declared
   `INTENT_SIGNALS` group — move this scenario's coverage into `intent-detection/` under that new
   entry instead of keeping it here as an "unmapped" probe.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | The `INTENT_SIGNALS` block this probe confirms has no accessibility entry |
| [SKILL.md](../../SKILL.md) §2 | The `REFERENCE MAP` table row for `accessibility.md` (absent — another drift instance beyond the packet's documented stale-filename cases) |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/accessibility-independent.md`
