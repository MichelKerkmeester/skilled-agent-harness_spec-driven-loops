---
id: OB-017
category: token_cost_baseline
title: 'Floor: single-resource load'
description: "This scenario validates the token-cost floor for `OB-017`. It focuses on confirming the cheapest realistic STACK_STANDARDS question resolves to exactly one reference file, establishing the minimum context cost this packet can impose."
expected_surface: OBSIDIAN
expected_intent: STACK_STANDARDS
expected_resources:
  - references/obsidian-plugin-api.md
version: 1.0.0.0
---

# OB-017: Floor -- single-resource load

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-017`.

---

## 1. OVERVIEW

This scenario validates the token-cost floor for `OB-017`. It focuses on confirming the cheapest
realistic evidence load this packet can produce: a narrow `isDesktopOnly` question that resolves to
exactly one reference file, `obsidian-plugin-api.md`, with nothing else pulled in. This is the floor
anchor for `OB-018`'s median and `OB-019`'s ceiling in the same category.

### Why This Matters

Establishing the floor gives an operator a concrete cost baseline: any scenario that claims to be
"lightweight" should cost no less than this, and any regression that makes even this narrowest
possible question pull in extra references is a measurable context-budget regression, not a vague
one.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-017` resolves to exactly one `expected_resources` path.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `STACK_STANDARDS`, and
  resolves to exactly one path in `expected_resources`.
- Real user request: `Does isDesktopOnly: false in manifest.json actually forbid any API, or is it just a listing flag?`
- Prompt: `Does isDesktopOnly: false in manifest.json actually forbid any API, or is it just a listing flag?`

**Exact prompt**:
```text
Does isDesktopOnly: false in manifest.json actually forbid any API, or is it just a listing flag?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `STACK_STANDARDS` `INTENT_SIGNALS`
  keyword `"manifest.json"` matches the prompt, and the single path in `expected_resources` resolves
  under the skill root with nothing else pulled in.
- Expected signals: `expected_resources` contains exactly one path, and it exists under
  `sk-code-obsidian/`.
- Desired user-visible outcome: the bundled workflow answers narrowly from `obsidian-plugin-api.md`
  alone — `isDesktopOnly: false` means nothing in the tree may assume a desktop-only API — without
  pulling in the class-grammar or stylesheet-ownership evidence a broader stack-standards question
  would need.
- Pass/fail: PASS if the single listed path exists and the frontmatter surface/intent are
  `OBSIDIAN`/`STACK_STANDARDS`; FAIL if the path is missing, more than one path is listed, or the
  frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Does isDesktopOnly: false in manifest.json actually forbid any API, or is it just a listing flag?`

### Commands

1. `sed -n '1,13p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/floor-single-resource.md`
2. `grep -c '^  - ' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/floor-single-resource.md`
3. `test -e .opencode/skills/sk-code/sk-code-obsidian/references/obsidian-plugin-api.md && echo "OK references/obsidian-plugin-api.md" || echo "MISS references/obsidian-plugin-api.md"`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: STACK_STANDARDS`. Step 2 prints `1`,
confirming exactly one `expected_resources` entry. Step 3 prints `OK`.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; input/output token counts for
this scenario's run, recorded for comparison against `OB-018` and `OB-019`.

### Pass / Fail

- **Pass**: the single `expected_resources` path exists, step 2 prints `1`, and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`STACK_STANDARDS`.
- **Fail**: the path is missing, step 2 prints anything other than `1`, or the frontmatter
  surface/intent disagree.

### Failure Triage

1. Re-run step 3 and confirm whether `obsidian-plugin-api.md` was renamed or removed under
   `references/`.
2. If step 2 prints more than `1`, a second path was added to this scenario's own list by mistake —
   this scenario's entire purpose is to hold the floor at exactly one resource; remove the extra
   entry rather than reclassifying the scenario as a median case.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `median-load.md` | The next tier in this category's token-cost progression |
| `ceiling-load-all.md` | The top tier in this category's token-cost progression |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Token Cost Baseline
- Playbook ID: OB-017
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `token-cost-baseline/floor-single-resource.md`
