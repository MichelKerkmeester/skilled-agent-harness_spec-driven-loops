---
id: OB-019
category: token_cost_baseline
title: 'Ceiling: full pre-release audit load'
description: "This scenario validates the token-cost ceiling for `OB-019`. It focuses on confirming a full pre-release audit request — spanning architecture, class grammar, folder docs, comment grammar, mobile behavior, verification, accessibility, and the API boundary — resolves the packet's near-complete evidence set as the top tier above OB-017's floor and OB-018's median."
expected_surface: OBSIDIAN
expected_intent: IMPLEMENTATION+CODE_QUALITY+DEBUGGING+VERIFICATION+STACK_STANDARDS
expected_resources:
  - references/view-renderer-architecture.md
  - references/data-layer.md
  - references/db-class-naming.md
  - references/stylesheet-ownership.md
  - references/folder-docs.md
  - references/comment-grammar.md
  - references/mobile-and-touch.md
  - references/verification.md
  - references/obsidian-plugin-api.md
  - references/accessibility.md
  - references/screenshot-harness.md
  - references/standards/platform-support.md
  - references/standards/code-standards.md
version: 1.0.0.0
---

# OB-019: Ceiling -- full pre-release audit load

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-019`.

---

## 1. OVERVIEW

This scenario validates the token-cost ceiling for `OB-019`. It focuses on confirming that a
deliberately broad, all-domains pre-release audit request resolves the packet's near-complete
evidence set — thirteen reference files spanning every intent this surface declares plus
`accessibility.md`, a reference not wired to any `INTENT_SIGNALS` group at all — establishing the
top tier above `OB-017`'s one-resource floor and `OB-018`'s three-resource median.

### Why This Matters

An operator signing off on a release plausibly asks for everything at once rather than filing five
separate narrow questions. Proving the ceiling case works — and stays bounded to this packet's real
files rather than silently including a stale `SKILL.md`-mapped path that does not exist — is what
keeps a full-audit request from either under-delivering or hallucinating a reference.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-019` resolves all thirteen `expected_resources` paths.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN` and resolves every path in
  `expected_resources`, spanning all five declared intents plus the accessibility reference.
- Real user request: `Give me a full pre-release audit of this plugin — architecture, the .db-* grammar, folder docs, comment grammar, mobile behavior, the verification gate, accessibility, and the Obsidian API boundary — everything I need before I sign off on shipping.`
- Prompt: `Give me a full pre-release audit of this plugin — architecture, the .db-* grammar, folder docs, comment grammar, mobile behavior, the verification gate, accessibility, and the Obsidian API boundary — everything I need before I sign off on shipping.`

**Exact prompt**:
```text
Give me a full pre-release audit of this plugin — architecture, the .db-* grammar, folder docs, comment grammar, mobile behavior, the verification gate, accessibility, and the Obsidian API boundary — everything I need before I sign off on shipping.
```

- Expected execution process: the hub detects `OBSIDIAN`, the prompt's breadth touches keywords from
  every declared `INTENT_SIGNALS` group at once, and all thirteen paths this scenario lists under
  `expected_resources` resolve under the skill root — including `references/accessibility.md`, which
  `SKILL.md` §2b's `INTENT_SIGNALS`/`RESOURCE_MAP` block does not wire to any intent group, surfaced
  here on the strength of the explicit "accessibility" mention rather than a declared keyword match.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and the
  count (thirteen) is materially larger than `OB-018`'s median (three).
- Desired user-visible outcome: the bundled workflow produces a structured, section-by-section
  pre-release brief covering renderer architecture, the `.db-*` grammar with its
  769-orphaned/427-referenced split, the folder-doc obligation list, the comment-grammar target
  state, mobile/`is-phone` behavior, the measured gate baseline (`vitest` 386/49, `screenshots:verify`
  180, `lint` 115), accessibility posture, and the API boundary — without inventing a file that does
  not exist in the shipped tree.
- Pass/fail: PASS if all thirteen listed paths exist and the frontmatter surface matches `OBSIDIAN`;
  FAIL if any listed path is missing or the response fabricates a reference not present in the
  shipped tree.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Give me a full pre-release audit of this plugin — architecture, the .db-* grammar, folder docs, comment grammar, mobile behavior, the verification gate, accessibility, and the Obsidian API boundary — everything I need before I sign off on shipping.`

### Commands

1. `sed -n '1,26p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`
2. `grep -c '^  - ' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`
3. `for p in references/view-renderer-architecture.md references/data-layer.md references/db-class-naming.md references/stylesheet-ownership.md references/folder-docs.md references/comment-grammar.md references/mobile-and-touch.md references/verification.md references/obsidian-plugin-api.md references/accessibility.md references/screenshot-harness.md references/standards/platform-support.md references/standards/code-standards.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN`. Step 2 prints `13`, confirming the ceiling count. Step 3
prints `OK` for all thirteen paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; input/output token counts for
this scenario's run, recorded alongside `OB-017` and `OB-018` for the floor/median/ceiling
comparison; confirmation that no path outside this list was cited.

### Pass / Fail

- **Pass**: all thirteen `expected_resources` paths exist, step 2 prints `13`, and the frontmatter's
  `expected_surface` is `OBSIDIAN`.
- **Fail**: any path is missing, step 2 prints a different count, or the response cites a reference
  not present in the shipped tree.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If the response cites a path outside this list, check whether it is a real file this scenario
   should have included (update the list) or an invented path mirroring `SKILL.md` §2b's stale
   `RESOURCE_MAP` (a hallucination that must be corrected, not documented as if real).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `floor-single-resource.md` | The floor tier in this category's token-cost progression |
| `median-load.md` | The median tier in this category's token-cost progression |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises across all five intents |
| [SKILL.md](../../SKILL.md) §2 | The full `REFERENCE MAP` table, whose real files this scenario's ceiling set draws from |

---

## 5. SOURCE METADATA

- Group: Token Cost Baseline
- Playbook ID: OB-019
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `token-cost-baseline/ceiling-load-all.md`
