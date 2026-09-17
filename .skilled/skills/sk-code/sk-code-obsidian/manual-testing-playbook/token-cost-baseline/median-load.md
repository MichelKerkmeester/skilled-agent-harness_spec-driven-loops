---
id: OB-018
category: token_cost_baseline
title: 'Median: three-resource load'
description: "This scenario validates the token-cost median for `OB-018`. It focuses on confirming a typical, moderately scoped CODE_QUALITY question about src/data/'s folder-doc and banner obligations resolves to exactly three references, the middle tier between OB-017's floor and OB-019's ceiling."
expected_surface: OBSIDIAN
expected_intent: CODE_QUALITY
expected_resources:
  - references/folder-docs.md
  - references/comment-grammar.md
  - references/standards/code-standards.md
version: 1.0.0.0
---

# OB-018: Median -- three-resource load

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-018`.

---

## 1. OVERVIEW

This scenario validates the token-cost median for `OB-018`. It focuses on confirming that a typical,
moderately scoped question — whether `src/data/` (128 files, no folder doc today) meets the
folder-doc threshold and what banner grammar its future `CODE.md` should describe — resolves to
exactly three reference files, sitting between `OB-017`'s one-resource floor and `OB-019`'s
comprehensive ceiling.

### Why This Matters

Most real questions land in this middle tier, not at either extreme; establishing a concrete median
gives an operator a realistic cost expectation for ordinary, non-narrow, non-audit-scale requests,
and a regression that pushes typical questions toward the ceiling's cost is a genuine budget concern
even when no single scenario individually fails.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-018` resolves to exactly three `expected_resources`
paths, all references, no assets.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `CODE_QUALITY`, and
  resolves to exactly three paths in `expected_resources`.
- Real user request: `Before I add MODULE banners to every file in src/data/, does that folder already meet the folder-doc threshold, and what should the banner grammar look like once we do?`
- Prompt: `Before I add MODULE banners to every file in src/data/, does that folder already meet the folder-doc threshold, and what should the banner grammar look like once we do?`

**Exact prompt**:
```text
Before I add MODULE banners to every file in src/data/, does that folder already meet the folder-doc threshold, and what should the banner grammar look like once we do?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `CODE_QUALITY` `INTENT_SIGNALS`
  keywords (`folder docs`, `module banner`, ...) match the prompt, and the three paths in
  `expected_resources` resolve under the skill root.
- Expected signals: `expected_resources` contains exactly three paths, and all three exist under
  `sk-code-obsidian/`.
- Desired user-visible outcome: the bundled workflow states `src/data/` is in `SKILL.md` §3b's
  measured folder-doc-obligation list, describes the target `MODULE:` banner and numbered
  box-drawing grammar, and cites the general code-standards reference for how the two conventions
  compose — without pulling in unrelated evidence like the class-grammar or verification-gate
  references a wider audit would need.
- Pass/fail: PASS if all three listed paths exist and the frontmatter surface/intent are
  `OBSIDIAN`/`CODE_QUALITY`; FAIL if any path is missing, the count is not exactly three, or the
  frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Before I add MODULE banners to every file in src/data/, does that folder already meet the folder-doc threshold, and what should the banner grammar look like once we do?`

### Commands

1. `sed -n '1,16p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/median-load.md`
2. `grep -c '^  - ' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/median-load.md`
3. `for p in references/folder-docs.md references/comment-grammar.md references/standards/code-standards.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: CODE_QUALITY`. Step 2 prints `3`,
confirming the median count. Step 3 prints `OK` for all three paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; input/output token counts for
this scenario's run, recorded alongside `OB-017` and `OB-019` for the floor/median/ceiling
comparison.

### Pass / Fail

- **Pass**: all three `expected_resources` paths exist, step 2 prints `3`, and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`CODE_QUALITY`.
- **Fail**: any path is missing, step 2 prints anything other than `3`, or the frontmatter
  surface/intent disagree.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If step 2 no longer prints `3`, a path was added or removed from this scenario's own list — adjust
   the prompt's scope or restore the three-resource baseline before comparing against `OB-017`/`OB-019`
   again.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `floor-single-resource.md` | The floor tier in this category's token-cost progression |
| `ceiling-load-all.md` | The ceiling tier in this category's token-cost progression |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §3b | The `src/data/` folder-doc obligation and the target banner-grammar state this scenario's answer must state honestly |

---

## 5. SOURCE METADATA

- Group: Token Cost Baseline
- Playbook ID: OB-018
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `token-cost-baseline/median-load.md`
