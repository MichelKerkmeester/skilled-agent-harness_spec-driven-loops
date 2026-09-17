---
id: OB-014
category: cross_cli_dispatch
title: 'Short-prompt baseline across CLI runtimes'
description: "This scenario validates cross-CLI stability for `OB-014`. It focuses on confirming a terse, five-word IMPLEMENTATION prompt resolves the same surface, intent, and resource set regardless of which CLI runtime drives the hub."
expected_surface: OBSIDIAN
expected_intent: IMPLEMENTATION
expected_resources:
  - references/view-renderer-architecture.md
  - references/data-layer.md
version: 1.0.0.0
---

# OB-014: Short-prompt baseline across CLI runtimes

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-014`.

---

## 1. OVERVIEW

This scenario validates cross-CLI stability for `OB-014`. It focuses on confirming that a terse,
minimal `IMPLEMENTATION`-shaped prompt resolves the same surface, intent, and resource set whether
the hub is driven by `cli-opencode` or `cli-claude-code`, since this packet's evidence must be
CLI-agnostic — nothing in `SKILL.md` §1/§2b conditions detection or routing on which runtime issues
the request.

### Why This Matters

A short prompt gives the classifier the least context to work with; if cross-CLI drift exists
anywhere in the pipeline, it shows up first at the floor of prompt length, not at the ceiling. This
scenario is deliberately terser than `OB-001`'s full sentence to isolate that risk.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact short prompt for `OB-014` resolves identically across at least two CLI
runtimes.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `IMPLEMENTATION`, and
  every path in `expected_resources`, identically across `cli-opencode` and `cli-claude-code`.
- Real user request: `New column type for the row pipeline.`
- Prompt: `New column type for the row pipeline.`

**Exact prompt**:
```text
New column type for the row pipeline.
```

- Expected execution process: the hub detects `OBSIDIAN` from the task's plugin-repository context
  regardless of runtime; `"new column type"` and `"row pipeline"` match `IMPLEMENTATION`
  `INTENT_SIGNALS` keywords; every path this scenario lists under `expected_resources` resolves
  under the skill root, on both runtimes.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and both
  CLI runtimes report the same surface/intent pair for the identical prompt text.
- Desired user-visible outcome: both runtimes point the bundled workflow at the same renderer and
  data-layer evidence, with no runtime-specific resource drift.
- Pass/fail: PASS if every listed path exists, both runtimes agree on surface/intent, and the
  frontmatter surface/intent are `OBSIDIAN`/`IMPLEMENTATION`; FAIL if any listed path is missing or
  the two runtimes disagree on surface or intent for the identical prompt.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `New column type for the row pipeline.`

### Commands

1. `sed -n '1,14p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/short-prompt-baseline.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"IMPLEMENTATION":/,/\],/p'`
3. `for p in references/view-renderer-architecture.md references/data-layer.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`
4. Dispatch the exact prompt to `cli-opencode` and `cli-claude-code` in separate turns and diff their reported surface/intent/resource output.

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: IMPLEMENTATION`. Step 2 shows the
`IMPLEMENTATION` `RESOURCE_MAP` entry. Step 3 prints `OK` for both paths. Step 4's two transcripts
report matching surface/intent/resource output.

### Evidence

Command transcript from steps 1-3; the two CLI transcripts from step 4, saved to
`/tmp/ob-014-cli-opencode.txt` and `/tmp/ob-014-cli-claude-code.txt`; input/output token counts for
each transcript.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, both CLI transcripts agree on
  `OBSIDIAN`/`IMPLEMENTATION`, and the frontmatter surface/intent match.
- **Fail**: any listed path is missing, or the two runtimes' transcripts disagree on surface or
  intent for the identical prompt text.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If the two runtimes disagree, capture both raw transcripts and diff them line by line before
   assuming which runtime is wrong — a runtime-specific prompt-preprocessing step (not this packet's
   evidence) is the more likely fault line.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | The `OBSIDIAN` surface-detection trigger, which is CLI-agnostic |

---

## 5. SOURCE METADATA

- Group: Cross-CLI Dispatch
- Playbook ID: OB-014
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cross-cli-dispatch/short-prompt-baseline.md`
