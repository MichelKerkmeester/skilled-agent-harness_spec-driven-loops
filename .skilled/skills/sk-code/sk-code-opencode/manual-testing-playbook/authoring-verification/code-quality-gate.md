---
id: OC-007
category: authoring_verification
title: 'Code quality gate routing'
description: "This scenario validates CODE_QUALITY routing for `OC-007`. It confirms a lint/format/naming/code-smell prompt loads the full nine-file authoring checklist set — universal plus JavaScript, TypeScript, Python, Shell, and the four-part Rust checklist — instead of a single-language subset."
expected_surface: OPENCODE
expected_intent: CODE_QUALITY
expected_resources:
  - assets/checklists/universal-checklist.md
  - assets/checklists/javascript-checklist.md
  - assets/checklists/typescript-checklist.md
  - assets/checklists/python-checklist.md
  - assets/checklists/shell-checklist.md
  - assets/checklists/rust-checklist/overview-and-p0-parity.md
  - assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md
  - assets/checklists/rust-checklist/p1-required.md
  - assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md
version: 1.0.0.0
---

# OC-007: Code quality gate routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-007`.

---

## 1. OVERVIEW

This scenario validates `CODE_QUALITY` routing for `OC-007`. It focuses on confirming that the exact prompt
below classifies as `CODE_QUALITY` and loads the full 9-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

`CODE_QUALITY` is the shared post-implementation gate across every language this surface owns. If the router drops the four-file Rust checklist from the resolved set, a Rust change could clear the quality gate without the P0 safety/boundary-discipline and P1/P2 checks that trio enforces.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-007` classifies as `CODE_QUALITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `CODE_QUALITY`, and every path in
  `expected_resources`.
- Real user request: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`
- Prompt: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`

**Exact prompt**:
```text
Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `CODE_QUALITY`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `CODE_QUALITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `CODE_QUALITY` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/code-quality-gate.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"CODE_QUALITY"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"CODE_QUALITY": \[/,/\],/p'`
4. `for p in assets/checklists/universal-checklist.md assets/checklists/javascript-checklist.md assets/checklists/typescript-checklist.md assets/checklists/python-checklist.md assets/checklists/shell-checklist.md assets/checklists/rust-checklist/overview-and-p0-parity.md assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md assets/checklists/rust-checklist/p1-required.md assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CODE_QUALITY` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["CODE_QUALITY"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["CODE_QUALITY"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `CODE_QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `CODE_QUALITY`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `assets/checklists/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["CODE_QUALITY"]` excerpt to see
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
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `CODE_QUALITY` resource set |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `authoring-verification/code-quality-gate.md`
