---
id: OC-002
category: language_standards
title: 'Python standards routing'
description: "This scenario validates PYTHON routing for `OC-002`. It confirms a `.py` argparse/docstring review prompt loads the Python style guide, quality standards, and quick reference triad instead of a generic implementation checklist."
expected_surface: OPENCODE
expected_intent: PYTHON
expected_resources:
  - references/python/style-guide.md
  - references/python/quality-standards.md
  - references/python/quick-reference.md
version: 1.0.0.0
---

# OC-002: Python standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-002`.

---

## 1. OVERVIEW

This scenario validates `PYTHON` routing for `OC-002`. It focuses on confirming that the exact prompt
below classifies as `PYTHON` and loads the full 3-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

A Python review mis-routed to the generic `IMPLEMENTATION` universal-patterns tier would skip the docstring and quality-standards conventions in `references/python/`, letting an argparse helper pass review without the language-specific checks the prompt explicitly asked for.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-002` classifies as `PYTHON` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `PYTHON`, and every path in
  `expected_resources`.
- Real user request: `Review this python .py argparse helper for docstring and quality standards.`
- Prompt: `Review this python .py argparse helper for docstring and quality standards.`

**Exact prompt**:
```text
Review this python .py argparse helper for docstring and quality standards.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `PYTHON`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `PYTHON` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `PYTHON` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `PYTHON`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this python .py argparse helper for docstring and quality standards.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/python-standards.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"PYTHON"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"PYTHON": \[/,/\],/p'`
4. `for p in references/python/style-guide.md references/python/quality-standards.md references/python/quick-reference.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: PYTHON` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["PYTHON"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["PYTHON"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["PYTHON"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `PYTHON`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `PYTHON`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/python/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["PYTHON"]` excerpt to see
   whether the drift is a stale scenario file or a stale `SKILL.md` map.

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
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `PYTHON` resource set |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `language-standards/python-standards.md`
