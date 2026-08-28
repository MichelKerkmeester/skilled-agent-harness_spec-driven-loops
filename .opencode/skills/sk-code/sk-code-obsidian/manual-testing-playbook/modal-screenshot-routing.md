---
id: OB-002
category: implementation
title: 'Modal screenshot routing'
description: "This scenario validates IMPLEMENTATION routing for `OB-002`. It focuses on confirming an unphotographed-modal screenshot-scenario prompt loads the renderer architecture, the fixture harness, and the fixture-authoring/screenshot-coverage/modal-coverage checklists together."
expected_surface: OBSIDIAN
expected_intent: IMPLEMENTATION
expected_resources:
  - references/view-renderer-architecture.md
  - references/screenshot-harness.md
  - assets/fixture-authoring-checklist.md
  - assets/screenshot-coverage-checklist.md
  - assets/modal-coverage-checklist.md
version: 1.0.0.0
---

# OB-002: Modal screenshot routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-002`.

---

## 1. OVERVIEW

This scenario validates IMPLEMENTATION routing for `OB-002`. It focuses on confirming that once the
hub resolves the `OBSIDIAN` surface, a prompt asking for a new screenshot scenario against an
unphotographed modal loads the renderer/modal architecture, the fixture-and-verify harness contract,
and all three checklists that guard a new fixture (`fixture-authoring`, `screenshot-coverage`,
`modal-coverage`) — not on capturing the screenshot itself.

### Why This Matters

`src/views/modals/` holds seventeen files, and all seventeen are unphotographed today because the
surface inventory that seeded the screenshot harness used a non-recursing `ls src/views/*.ts` that
never reached the `modals/` subfolder. Loading `screenshot-harness.md` and `modal-coverage-checklist.md`
together with `fixture-authoring-checklist.md` is what stops a bundled workflow from writing a fixture
that references an invented `.db-*` class or leaves the modal off the 180-entry manifest count.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-002` classifies as `IMPLEMENTATION` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `IMPLEMENTATION`, and
  every path in `expected_resources`.
- Real user request: `Add a screenshot scenario for FormulaModal.ts — it's one of the seventeen modals in src/views/modals/ with no fixture yet.`
- Prompt: `Add a screenshot scenario for FormulaModal.ts — it's one of the seventeen modals in src/views/modals/ with no fixture yet.`

**Exact prompt**:
```text
Add a screenshot scenario for FormulaModal.ts — it's one of the seventeen modals in src/views/modals/ with no fixture yet.
```

- Expected execution process: the hub detects `OBSIDIAN`, the `IMPLEMENTATION` `INTENT_SIGNALS`
  keywords (`build`, `implement`, ...) match the prompt alongside the modal-coverage context, and
  every path this scenario lists under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `IMPLEMENTATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow adds a `FormulaModal` fixture to
  `tools/screenshots/scenarios/`, registers it so `screenshots:verify`'s entry count grows past 180,
  and can show the opened PNG rather than trusting the capture's exit code as proof.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `IMPLEMENTATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a screenshot scenario for FormulaModal.ts — it's one of the seventeen modals in src/views/modals/ with no fixture yet.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/modal-screenshot-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"IMPLEMENTATION":/,/\],/p'`
3. `for p in references/view-renderer-architecture.md references/screenshot-harness.md assets/fixture-authoring-checklist.md assets/screenshot-coverage-checklist.md assets/modal-coverage-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: IMPLEMENTATION`. Step 2 shows the
`IMPLEMENTATION` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all
five paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["IMPLEMENTATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`IMPLEMENTATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`IMPLEMENTATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Confirm `FormulaModal.ts` is still absent from `tools/screenshots/` (`grep -ril FormulaModal
   tools/screenshots/`); if it now has a fixture, the prompt's premise is stale and a different
   unphotographed modal from `src/views/modals/` should replace it in a future revision.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../SKILL.md) §5 (ESCALATE IF) | The rule this scenario's prompt satisfies: a `src/views/modals/` change ships with a new scenario in the same change |

---

## 5. SOURCE METADATA

- Group: code-obsidian routing
- Playbook ID: OB-002
- Canonical root source: [manual-testing-playbook.md](manual-testing-playbook.md)
- Feature file path: `modal-screenshot-routing.md`
