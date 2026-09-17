---
id: OB-012
category: unknown_fallback
title: 'Zero-keyword prompt fallback'
description: "This scenario validates the DEFAULT_RESOURCE fallback for `OB-012`. It focuses on confirming a prompt that matches no INTENT_SIGNALS keyword from any of the five declared groups still resolves the surface's default evidence rather than an empty or error state."
expected_surface: OBSIDIAN
expected_intent: UNKNOWN
expected_resources:
  - references/obsidian-plugin-api.md
  - references/comment-grammar.md
version: 1.0.0.0
---

# OB-012: Zero-keyword prompt fallback

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-012`.

---

## 1. OVERVIEW

This scenario validates the `DEFAULT_RESOURCE` fallback for `OB-012`. It focuses on confirming that
a prompt matching none of the five declared `INTENT_SIGNALS` groups (`IMPLEMENTATION`,
`CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `STACK_STANDARDS`) still resolves the surface's
`DEFAULT_RESOURCE` evidence — `SKILL.md` §2b's own real-file equivalent is
`references/obsidian-plugin-api.md` plus `references/comment-grammar.md` — rather than an empty or
error state.

### Why This Matters

A prompt with no keyword hit is not a rare edge case for a plugin this size; a genuinely orienting
question from someone new to the codebase easily avoids every literal trigger word. If the fallback
silently returns nothing, the operator gets no evidence at all instead of the minimum floor the
packet promises; if it silently guesses an intent instead of falling back honestly, it risks loading
the wrong evidence with false confidence.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-012` matches zero `INTENT_SIGNALS` keywords from any of
the five declared groups and resolves the `DEFAULT_RESOURCE` set.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, matches no keyword from any of
  the five `INTENT_SIGNALS` groups, and resolves exactly the `DEFAULT_RESOURCE` real-file set.
- Real user request: `This plugin lets a vault owner treat a folder of notes like rows in a spreadsheet — can you get me oriented on how the pieces fit together before I touch anything?`
- Prompt: `This plugin lets a vault owner treat a folder of notes like rows in a spreadsheet — can you get me oriented on how the pieces fit together before I touch anything?`

**Exact prompt**:
```text
This plugin lets a vault owner treat a folder of notes like rows in a spreadsheet — can you get me oriented on how the pieces fit together before I touch anything?
```

- Expected execution process: the hub detects `OBSIDIAN` from the task's plugin-repository context,
  no `INTENT_SIGNALS` keyword from any of the five groups matches the prompt, and the workflow falls
  back to `DEFAULT_RESOURCE`'s two real files rather than guessing an intent or returning nothing.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and neither
  path is intent-specific — both are the packet's always-available default evidence.
- Desired user-visible outcome: the bundled workflow gives a short, honest orientation grounded in
  the Obsidian API boundary and the comment-grammar target state, and states plainly that it did not
  detect a specific task intent from the prompt rather than silently picking one.
- Pass/fail: PASS if both listed paths exist, the frontmatter surface is `OBSIDIAN`, and the intent
  is explicitly the fallback state rather than a guessed specific intent; FAIL if either path is
  missing or the workflow silently commits to one of the five declared intents without cause.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This plugin lets a vault owner treat a folder of notes like rows in a spreadsheet — can you get me oriented on how the pieces fit together before I touch anything?`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/^DEFAULT_RESOURCE/,/^\]/p'`
3. `for p in references/obsidian-plugin-api.md references/comment-grammar.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: UNKNOWN`. Step 2 shows `SKILL.md`
§2b's stale `DEFAULT_RESOURCE` block (`references/obsidian-api-boundary.md`,
`references/comment-grammar.md`); this scenario's own `expected_resources` swaps the first path for
the real file `references/obsidian-plugin-api.md` per the packet's own honesty note. Step 3 prints
`OK` for both real paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the raw `DEFAULT_RESOURCE`
excerpt from step 2 alongside this scenario's corrected real-file set.

### Pass / Fail

- **Pass**: both `expected_resources` paths exist under the skill root, and the frontmatter's
  `expected_surface` is `OBSIDIAN` with `expected_intent: UNKNOWN` (no specific intent guessed).
- **Fail**: either path is missing, or the frontmatter records a specific `INTENT_SIGNALS` intent
  instead of the fallback state.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/`.
2. If the prompt now scores a specific intent, check whether the `INTENT_SIGNALS` keyword lists in
   `SKILL.md` §2b grew a new literal term that now accidentally matches this prompt's wording, and
   rephrase the prompt to stay keyword-blind rather than reclassifying the scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `DEFAULT_RESOURCE` and `INTENT_SIGNALS` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Unknown Fallback
- Playbook ID: OB-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `unknown-fallback/zero-keyword-prompt.md`
