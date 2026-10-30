---
title: "SKL-012 -- Refuse a hub candidate"
description: "This scenario validates the hub refusal for `SKL-012`. It focuses on the named reason, the absent write and the handoff to the parent-hub scaffold."
version: 1.0.1.0
---

# SKL-012 -- Refuse a hub candidate

This document captures the operator contract for `SKL-012`.

---

## 1. OVERVIEW

This scenario validates the refusal path of the conversion. A skill that declares a hub, or that nests packet `SKILL.md` files, is a hub candidate. Convert names the reason, writes nothing and points at `/create:skill-parent`.

### Why This Matters

A hub conversion lands on eleven surfaces and five of them have no gate, so a conversion that guesses can leave a hub whose modes no request reaches. Worse, it can rewrite routing that the hub's own registry still describes, which makes the next check report a fault the operator cannot trace. The refusal keeps the guess out of the write path and hands the decision to the command that owns hub structure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-012` and inspect the reason, the untouched tree and the handoff line.

- Objective: refuse a hub candidate with a named reason, write nothing and hand off to the parent-hub scaffold
- Realistic user request: `Convert the field-notes skill into the Skilled format. Both of its modes share one folder, so convert them as one skill.`
- Prompt: `Convert the field-notes skill into the Skilled format. Both of its modes share one folder, so convert them as one skill.`
- Expected execution process: confirm the declared-hub fixture, plan the conversion, compare the tree, then plan the nested-packet fixture and compare the tree again.
- Expected signals: the declared hub prints `HUB_DECLARATION: Hub declaration mode-registry.json is present; conversion does not modify hubs.` and exits 1. The nested-packet fixture, which carries no declaration, prints `NESTED_PACKETS: Nested SKILL.md packets make this a hub candidate.` and exits 1. A `local-` prefixed name prints `RESERVED_PREFIX` and an `agent-` prefixed one prints `PERSONA_PREFIX`, each with no write. The tree listing is byte-identical after each attempt. Through the command, the run ends with `STATUS=FAIL` and the same reason, followed by `Next: /create:skill-parent <the parent skill folder>`.
- Desired user-visible outcome: a refusal the operator can act on, with the tree untouched and the hub path named.
- Pass/fail: PASS if each candidate prints a distinct named reason, no file changes and the hub refusal names the parent-hub command. FAIL if any attempt writes, a refusal shares a reason with another case, or a hub candidate is converted.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Convert the field-notes skill into the Skilled format. Both of its modes share one folder, so convert them as one skill.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-012 | Refuse a hub candidate | Refuse a declared hub and a nested packet tree with a named reason and no write | `Convert the field-notes skill into the Skilled format. Both of its modes share one folder, so convert them as one skill.` | 1. `bash: ls .skilled/skills/field-notes/mode-registry.json` -> 2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan field-notes` -> 3. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/field-notes` -> 4. `bash: ls .skilled/skills/field-notes-nested/modes/fixture-mode/SKILL.md` -> 5. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan field-notes-nested` -> 6. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/field-notes-nested` | Step 1: the declaration is present and there is no nested packet. Step 2: `HUB_DECLARATION: Hub declaration mode-registry.json is present; conversion does not modify hubs.`, exit 1. Step 3: no output. Step 4: the second fixture nests a packet and declares no hub. Step 5: `NESTED_PACKETS: Nested SKILL.md packets make this a hub candidate.`, exit 1. Step 6: no output | The prompt, both fixtures, both refusal lines with their exit statuses, the unchanged tree listings and the handoff line the command prints after the refusal | PASS if each candidate prints its own named reason, nothing changes and the hub refusal names `/create:skill-parent`. FAIL if any attempt writes, two cases share one reason, or a hub candidate is converted | 1. When the reason is `NESTED_PACKETS`, find the nested `SKILL.md` and confirm the folder is meant to be a hub. 2. When it is `HUB_DECLARATION`, read the named declaration rather than deleting it. 3. When it is `RESERVED_PREFIX` or `PERSONA_PREFIX`, rename the skill instead of converting it under that name. 4. When a refusal wrote anyway, treat the run as failed and read the backup path before anything else |

### Commands

1. `bash: ls .skilled/skills/field-notes/mode-registry.json`
2. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan field-notes`
3. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/field-notes`
4. `bash: ls .skilled/skills/field-notes-nested/modes/fixture-mode/SKILL.md`
5. `bash: node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan field-notes-nested`
6. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills/field-notes-nested`

### Expected

Step 1 proves the first fixture declares a hub and nests nothing, so the declaration is the only reason left to refuse it. Step 2 proves the declaration is read before any transform and that the reason names it. Step 3 proves the refusal wrote nothing. Steps 4 to 6 prove the same for a nested packet tree, whose refusal reason is a different code, so the two cases stay apart.

### Evidence

Capture the prompt, both fixture listings, each refusal line with its exit status, the before-and-after tree listing, the workflow status line with its reason and the parent-hub line.

### Pass / Fail

- **Pass**: every candidate prints its own named reason, nothing changes on disk, the workflow status carries the same reason and the hub refusal names the `/create:skill-parent` line.
- **Fail**: a refused candidate is written, two refusal cases share one reason, a nested packet is treated as a single skill, or a hub candidate is converted.

### Failure Triage

1. On `NESTED_PACKETS`, find the nested `SKILL.md` and confirm the folder is meant to be a hub.
2. On `HUB_DECLARATION`, read the named declaration rather than deleting it.
3. On `RESERVED_PREFIX` or `PERSONA_PREFIX`, rename the skill instead of converting under that name.
4. When a refusal wrote anyway, read the backup path the run printed before judging the result.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`skill-format-check-and-convert.md`](../../../feature-catalog/skill-format-conversion/skill-format-check-and-convert.md) | Catalog entry for the check and convert command |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`sk-skill-convert.cjs`](../../../../../commands/doctor/scripts/sk-skill-convert.cjs) | Preflight refusal table and the named refusal reasons |
| [`sk-skill-surface.cjs`](../../../../../commands/doctor/scripts/lib/sk-skill-surface.cjs) | Location classification and name collision inspection |
| [`upgrading-a-skill-to-v4.md`](../../references/skill/upgrading-a-skill-to-v4.md) | The count-distinct-jobs rule and the parent-hub path |
| [`parent-skills-nested-packets.md`](../../references/parent-skill/parent-skills-nested-packets.md) | Hub surfaces and the five that carry no gate |
| [`sk-skill-convert.test.cjs`](../../../../../commands/doctor/scripts/tests/sk-skill-convert.test.cjs) | Refusal coverage, including the nested packet and reserved prefix cases |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-012
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/refuse-a-hub-candidate.md`
