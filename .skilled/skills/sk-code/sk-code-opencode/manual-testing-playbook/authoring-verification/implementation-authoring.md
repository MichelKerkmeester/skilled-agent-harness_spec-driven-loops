---
id: OC-006
category: authoring_verification
title: 'Implementation authoring routing'
description: "This scenario validates IMPLEMENTATION routing for `OC-006`. It confirms a new skill-authoring module prompt loads the language-agnostic universal-patterns and code-organization tier plus all four authoring checklists (agent, command, skill, MCP server) instead of a single-checklist subset."
expected_surface: OPENCODE
expected_intent: IMPLEMENTATION
expected_resources:
  - references/shared/universal-patterns/naming-and-commenting.md
  - references/shared/universal-patterns/organization-security-and-examples.md
  - references/shared/code-organization/overview-and-module-organization.md
  - references/shared/code-organization/imports-and-exports.md
  - references/shared/code-organization/directory-and-test-conventions.md
  - assets/checklists/agent-authoring.md
  - assets/checklists/command-authoring.md
  - assets/checklists/skill-authoring.md
  - assets/checklists/mcp-server-authoring.md
version: 1.0.0.0
---

# OC-006: Implementation authoring routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-006`.

---

## 1. OVERVIEW

This scenario validates `IMPLEMENTATION` routing for `OC-006`. It focuses on confirming that the exact prompt
below classifies as `IMPLEMENTATION` and loads the full 9-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

New OpenCode component authoring spans naming/commenting and code-organization conventions plus four distinct checklist shapes (agent, command, skill, MCP server). If the router narrows to only one checklist, an author could ship a new skill module without ever checking the command- or MCP-server-specific authoring contract the prompt explicitly asked for.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-006` classifies as `IMPLEMENTATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `IMPLEMENTATION`, and every path in
  `expected_resources`.
- Real user request: `Implement a new OpenCode skill-authoring module and include command-authoring and mcp server authoring considerations.`
- Prompt: `Implement a new OpenCode skill-authoring module and include command-authoring and mcp server authoring considerations.`

**Exact prompt**:
```text
Implement a new OpenCode skill-authoring module and include command-authoring and mcp server authoring considerations.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `IMPLEMENTATION`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `IMPLEMENTATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `IMPLEMENTATION` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Implement a new OpenCode skill-authoring module and include command-authoring and mcp server authoring considerations.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/implementation-authoring.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"IMPLEMENTATION"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"IMPLEMENTATION": \[/,/\],/p'`
4. `for p in references/shared/universal-patterns/naming-and-commenting.md references/shared/universal-patterns/organization-security-and-examples.md references/shared/code-organization/overview-and-module-organization.md references/shared/code-organization/imports-and-exports.md references/shared/code-organization/directory-and-test-conventions.md assets/checklists/agent-authoring.md assets/checklists/command-authoring.md assets/checklists/skill-authoring.md assets/checklists/mcp-server-authoring.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: IMPLEMENTATION` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["IMPLEMENTATION"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["IMPLEMENTATION"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["IMPLEMENTATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `IMPLEMENTATION`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `IMPLEMENTATION`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/shared/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["IMPLEMENTATION"]` excerpt to see
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
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `IMPLEMENTATION` resource set |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `authoring-verification/implementation-authoring.md`
