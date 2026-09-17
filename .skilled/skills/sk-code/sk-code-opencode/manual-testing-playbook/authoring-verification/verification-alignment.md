---
id: OC-008
category: authoring_verification
title: 'Verification alignment routing'
description: "This scenario validates VERIFICATION routing for `OC-008`. It confirms a completion-claim/type-check/alignment-drift prompt loads the alignment-verification-automation reference and the drift-guard scripts README instead of a generic implementation or quality resource."
expected_surface: OPENCODE
expected_intent: VERIFICATION
expected_resources:
  - references/shared/alignment-verification-automation.md
  - assets/scripts/README.md
version: 1.0.0.0
---

# OC-008: Verification alignment routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-008`.

---

## 1. OVERVIEW

This scenario validates `VERIFICATION` routing for `OC-008`. It focuses on confirming that the exact prompt
below classifies as `VERIFICATION` and loads the full 2-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

Per `SKILL.md` §3, alignment drift is a verification gate: three drift guards (`verify_alignment_drift.py`, `verify_stack_folders.py`, and the router-sync suite) run through `scripts/run-all-drift-guards.sh` before any completion claim. A verification prompt mis-routed away from `references/shared/alignment-verification-automation.md` could let a completion claim skip that gate entirely.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-008` classifies as `VERIFICATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `VERIFICATION`, and every path in
  `expected_resources`.
- Real user request: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`
- Prompt: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`

**Exact prompt**:
```text
Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `VERIFICATION`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `VERIFICATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `VERIFICATION` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `VERIFICATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Verify the alignment drift gate and completion claim type-check signals before saying the change is passing.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/verification-alignment.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"VERIFICATION"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"VERIFICATION": \[/,/\],/p'`
4. `for p in references/shared/alignment-verification-automation.md assets/scripts/README.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: VERIFICATION` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["VERIFICATION"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["VERIFICATION"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["VERIFICATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `VERIFICATION`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `VERIFICATION`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/shared/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["VERIFICATION"]` excerpt to see
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
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `VERIFICATION` resource set |
| [SKILL.md](../../SKILL.md) §3 | The alignment-drift-is-a-verification-gate rule this scenario's resources enforce |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `authoring-verification/verification-alignment.md`
