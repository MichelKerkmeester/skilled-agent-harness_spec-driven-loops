---
id: OC-003
category: language_standards
title: 'Shell standards routing'
description: "This scenario validates SHELL routing for `OC-003`. It confirms a bash `.sh` review prompt loads the shell style guide, the priority-blocker and shellcheck-backed quality standards, and the shell quick reference instead of a generic checklist."
expected_surface: OPENCODE
expected_intent: SHELL
expected_resources:
  - references/shell/style-guide/overview-structure-and-naming.md
  - references/shell/style-guide/variables-functions-and-output.md
  - references/shell/quality-standards/overview-and-priority-blockers.md
  - references/shell/quality-standards/validation-security-and-shellcheck.md
  - references/shell/quick-reference/template-variables-and-loops.md
  - references/shell/quick-reference/functions-strings-and-checklist.md
version: 1.0.0.0
---

# OC-003: Shell standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-003`.

---

## 1. OVERVIEW

This scenario validates `SHELL` routing for `OC-003`. It focuses on confirming that the exact prompt
below classifies as `SHELL` and loads the full 6-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

A shell review mis-routed to a generic checklist would miss the shellcheck-backed validation-security standard and the priority-blocker triage order in `references/shell/quality-standards/`, letting an unsafe `.sh` wrapper pass an author-side review without the shell-specific gate ever running.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-003` classifies as `SHELL` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `SHELL`, and every path in
  `expected_resources`.
- Real user request: `Check this shell script bash .sh wrapper against standards before release.`
- Prompt: `Check this shell script bash .sh wrapper against standards before release.`

**Exact prompt**:
```text
Check this shell script bash .sh wrapper against standards before release.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `SHELL`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `SHELL` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `SHELL` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `SHELL`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check this shell script bash .sh wrapper against standards before release.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/shell-standards.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"SHELL"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"SHELL": \[/,/\],/p'`
4. `for p in references/shell/style-guide/overview-structure-and-naming.md references/shell/style-guide/variables-functions-and-output.md references/shell/quality-standards/overview-and-priority-blockers.md references/shell/quality-standards/validation-security-and-shellcheck.md references/shell/quick-reference/template-variables-and-loops.md references/shell/quick-reference/functions-strings-and-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: SHELL` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["SHELL"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["SHELL"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["SHELL"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `SHELL`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `SHELL`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/shell/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["SHELL"]` excerpt to see
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
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `SHELL` resource set |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `language-standards/shell-standards.md`
