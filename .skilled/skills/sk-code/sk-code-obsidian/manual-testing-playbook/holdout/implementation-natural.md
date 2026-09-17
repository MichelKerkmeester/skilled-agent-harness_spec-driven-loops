---
id: OB-H01
category: holdout
title: 'Holdout -- IMPLEMENTATION via natural phrasing'
description: "Holdout scenario OB-H01: the fitted IMPLEMENTATION answer (OB-001) restated in phrasing a real operator would use, with no literal INTENT_SIGNALS keyword from any group, measuring whether intent detection survives unseen wording."
expected_surface: OBSIDIAN
expected_intent: IMPLEMENTATION
expected_resources:
  - references/view-renderer-architecture.md
  - references/data-layer.md
  - references/db-class-naming.md
version: 1.0.0.0
---

# OB-H01: IMPLEMENTATION held out (decontaminated phrasing)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H01`.

---

## 1. OVERVIEW

Generalization probe. The correct answer is the same underlying evidence `OB-001` exercises, but the
request is phrased the way a real operator would ask without the router's literal keyword vocabulary
— no "new column type", no "row pipeline", no "implement", no "build". It measures whether
`IMPLEMENTATION` classification survives unseen wording instead of memorized triggers.

### Why This Matters

`OB-H01` guards the router decision for the Holdout category's `IMPLEMENTATION` case. A regression
here silently degrades classification for realistically phrased requests without failing any of the
literal-keyword scenarios in `intent-detection/`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact decontaminated prompt for `OB-H01` still classifies as `IMPLEMENTATION`.

- Objective: confirm the router selects `IMPLEMENTATION` for a keyword-blind phrasing of the same
  underlying request `OB-001` exercises.
- Real user request: `Our board view needs a way to show a percentage the way the numbers already work — can you get that added where the row data actually gets shaped?`
- Prompt: `Our board view needs a way to show a percentage the way the numbers already work — can you get that added where the row data actually gets shaped?`

**Exact prompt**:
```text
Our board view needs a way to show a percentage the way the numbers already work — can you get that added where the row data actually gets shaped?
```

- Expected execution process: the hub detects `OBSIDIAN`; despite avoiding every literal
  `IMPLEMENTATION` keyword, the request's underlying shape (a new computed display type in the data
  pipeline that feeds a renderer) still resolves `IMPLEMENTATION`, and every path this scenario lists
  under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, matching
  `OB-001`'s underlying evidence despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow recognizes this as the same kind of request
  `OB-001` covers and reaches for the renderer/data-layer/class-grammar evidence without needing the
  literal trigger words.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Our board view needs a way to show a percentage the way the numbers already work — can you get that added where the row data actually gets shaped?`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are — by frontmatter/path agreement, not by a live command transcript. It carries no
command-sequence run beyond confirming the file's own contract, since its purpose is generalization
measurement rather than mechanism verification already covered by `OB-001`.

### Commands

1. `sed -n '1,14p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/implementation-natural.md`
2. `for p in references/view-renderer-architecture.md references/data-layer.md references/db-class-naming.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: IMPLEMENTATION`. Step 2 prints `OK`
for all three paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the routed intent from a live
dispatch of the exact prompt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists and the frontmatter's `expected_surface`/
  `expected_intent` match `OBSIDIAN`/`IMPLEMENTATION`.
- **Fail**: any listed path is missing, or a live dispatch of the exact prompt resolves an intent
  other than `IMPLEMENTATION`.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a live dispatch resolves the wrong intent, compare this prompt's wording against `OB-001`'s
   literal-keyword form to isolate which phrase difference broke classification, rather than
   reintroducing the literal keywords into this holdout.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../intent-detection/renderer-feature-routing.md` | The fitted `OB-001` scenario this holdout decontaminates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` this holdout deliberately avoids matching literally |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/implementation-natural.md`
