---
id: OB-015
category: cross_cli_dispatch
title: 'Large-prompt stress test'
description: "This scenario validates prompt-length robustness for `OB-015`. It focuses on confirming a long, scene-setting VERIFICATION prompt still resolves the correct intent and resource set once its single keyword-bearing sentence is buried in unrelated backstory."
expected_surface: OBSIDIAN
expected_intent: VERIFICATION
expected_resources:
  - references/verification.md
  - assets/verification-checklist.md
  - references/screenshot-harness.md
  - references/workflow-verify.md
  - references/release/release-verification.md
version: 1.0.0.0
---

# OB-015: Large-prompt stress test

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-015`.

---

## 1. OVERVIEW

This scenario validates prompt-length robustness for `OB-015`. It focuses on confirming that a long,
multi-paragraph prompt — most of it unrelated backstory — still resolves `VERIFICATION` correctly
once the one operative sentence is reached, and still loads the same evidence set `OB-006`'s short
form loads. This scenario's objective is prompt-length robustness, not classification correctness in
isolation (`OB-006` already covers that).

### Why This Matters

Real operator prompts are rarely as clean as a scenario file's terse example — an operator narrating
context, prior attempts, and unrelated observations before finally stating the ask is common. A
classifier that only works on clean, short prompts is not proven to work on the messier prompts
operators actually send.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact long-form prompt for `OB-015` still classifies as `VERIFICATION` and
resolves the same resource set as its short-form counterpart.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `VERIFICATION`, and every
  path in `expected_resources`, despite the prompt's length and unrelated framing.
- Real user request: see the full prompt below (~1,400 characters, ending in the operative ask).
- Prompt: see below.

**Exact prompt**:
```text
I've been working on this Obsidian plugin for a while now and wanted to give you some background before asking my actual question. The Note Database plugin lets a vault owner treat a folder of notes as rows in a database-style view, with renderers for tables, boards, galleries, lists, calendars, timelines, and charts. It's built with esbuild, tested with vitest, and linted with eslint plus eslint-plugin-obsidianmd. I've spent the last two days working through a batch of changes: I renamed a couple of .db-* classes across styles.css and every fixture that referenced them, I touched RowPipeline.ts to support a new computed column, and I also poked at the calendar renderer's mobile layout branch while I was in there, though I didn't change any public API surface. None of this was destructive — I kept a clean diff and didn't touch anything under src/views/modals/. I also double-checked that I didn't invent any .db-* class that isn't already declared in styles.css or referenced somewhere in src/. Before I open a PR, I want to be sure this is actually safe to merge — can you run tsc, build, vitest, and screenshots:verify for me, and tell me where the lint problem count stands against the recorded 115-problem baseline?
```

- Expected execution process: the hub detects `OBSIDIAN`, the `VERIFICATION` `INTENT_SIGNALS`
  keywords (`verify`, `tsc`, `vitest`, `screenshots:verify`, ...) match the closing sentence despite
  the preceding backstory, and every path this scenario lists under `expected_resources` resolves
  under the skill root — matching `OB-006`'s resolved set exactly.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and the
  resolved set matches `OB-006`'s set despite roughly 20x the prompt length.
- Desired user-visible outcome: the bundled workflow runs the five gate commands, reports the
  `vitest`/`screenshots:verify` counts, states the lint delta against the 115-problem baseline, and
  does not get distracted into re-litigating the backstory (the rename, the column type, the mobile
  layout poke) as if those were new asks.
- Pass/fail: PASS if every listed path exists, the resolved set matches `OB-006`'s, and the
  frontmatter surface/intent are `OBSIDIAN`/`VERIFICATION`; FAIL if any listed path is missing, the
  resolved set diverges from `OB-006`'s, or the backstory is treated as new scope.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: the ~1,400-character block in §2.

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/large-prompt-stress.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"VERIFICATION":/,/\],/p'`
3. `for p in references/verification.md assets/verification-checklist.md references/screenshot-harness.md references/workflow-verify.md references/release/release-verification.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`
4. `diff <(sed -n '/^expected_resources:/,/^version:/p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/verification-routing.md) <(sed -n '/^expected_resources:/,/^version:/p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/large-prompt-stress.md)`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: VERIFICATION`. Step 2 shows the
`VERIFICATION` `RESOURCE_MAP` entry. Step 3 prints `OK` for all five paths. Step 4 prints no diff
output, confirming this scenario's `expected_resources` set is identical to `OB-006`'s.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; input/output token counts for the
full ~1,400-character prompt versus `OB-006`'s short form; wall-clock latency comparison.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, step 4 shows no diff against `OB-006`'s set, and
  the frontmatter's `expected_surface`/`expected_intent` match `OBSIDIAN`/`VERIFICATION`.
- **Fail**: any listed path is missing, step 4 shows a diff, or the response treats backstory details
  as new scope.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If step 4 shows a diff, determine whether the long prompt's extra detail legitimately narrowed the
   resource set (acceptable) or whether length alone caused a keyword to be missed (a regression).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../intent-detection/verification-routing.md` | The short-form `VERIFICATION` baseline this scenario's resolved set must match |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §3 | The measured gate baseline this scenario's prompt cites at length |

---

## 5. SOURCE METADATA

- Group: Cross-CLI Dispatch
- Playbook ID: OB-015
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cross-cli-dispatch/large-prompt-stress.md`
