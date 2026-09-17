---
id: OC-004
category: config_hooks
title: 'Config schema routing'
description: "This scenario validates CONFIG routing for `OC-004`. It confirms a JSONC descriptor/config-schema review prompt loads the config style guide, quality standards, quick reference, and the config-checklist asset instead of a generic implementation checklist."
expected_surface: OPENCODE
expected_intent: CONFIG
expected_resources:
  - references/config/style-guide.md
  - references/config/quality-standards.md
  - references/config/quick-reference.md
  - assets/checklists/config-checklist.md
version: 1.0.0.0
---

# OC-004: Config schema routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-004`.

---

## 1. OVERVIEW

This scenario validates `CONFIG` routing for `OC-004`. It focuses on confirming that the exact prompt
below classifies as `CONFIG` and loads the full 4-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

Config drift is load-bearing: `graph-metadata.json`/`description.json` shape drives skill discovery per `SKILL.md` §3. A schema review mis-routed away from `references/config/` and `assets/checklists/config-checklist.md` could approve a descriptor that silently breaks discovery.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-004` classifies as `CONFIG` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `CONFIG`, and every path in
  `expected_resources`.
- Real user request: `Review the jsonc descriptor config schema for a skill and point out schema issues.`
- Prompt: `Review the jsonc descriptor config schema for a skill and point out schema issues.`

**Exact prompt**:
```text
Review the jsonc descriptor config schema for a skill and point out schema issues.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `CONFIG`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `CONFIG` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `CONFIG` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `CONFIG`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review the jsonc descriptor config schema for a skill and point out schema issues.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/config-hooks/config-schema.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"CONFIG"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"CONFIG": \[/,/\],/p'`
4. `for p in references/config/style-guide.md references/config/quality-standards.md references/config/quick-reference.md assets/checklists/config-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CONFIG` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["CONFIG"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["CONFIG"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["CONFIG"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `CONFIG`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `CONFIG`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/config/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["CONFIG"]` excerpt to see
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
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `CONFIG` resource set |
| [SKILL.md](../../SKILL.md) §3 | The descriptors-are-load-bearing rule this scenario's config resources enforce |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `config-hooks/config-schema.md`
