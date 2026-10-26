---
id: CQ-008
category: quality_gate
title: 'Restraint prompt routes to the quality gate and the Design Restraint Ladder'
description: "This scenario validates QUALITY routing for `CQ-008`. It confirms the restraint prompt `apply yagni to this change` resolves a single route to `sk-code-quality`, matches `CODE_QUALITY` at stage two, and lands on the Design Restraint Ladder before any code is added."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - ../shared/references/universal/code-quality-standards.md
  - references/code-style-guide.md
version: 1.0.0.0
---

# CQ-008: Restraint Prompt Routes To The Quality Gate

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CQ-008`.

---

## 1. OVERVIEW

This scenario validates `QUALITY` routing for `CQ-008`. A request to apply yagni asks whether code should exist at all, so it belongs to the quality mode rather than to an implementation surface. The scenario confirms that the prompt `apply yagni to this change` resolves a single route to `sk-code-quality`, that the mode's stage-two projection reports `CODE_QUALITY`, and that the workflow sends the author to the Design Restraint Ladder before a gate fix adds code.

### Why This Matters

A restraint request that reaches the quality mode without reaching the ladder turns "apply yagni" into a style check and can end with more code than the change needs. Stage one carries a restraint class of its own, so the prompt already resolves the mode. The remaining risk sits at stage two and in the workflow, where a missing keyword leaves `surfaceIntents` empty and the ladder step goes unstated.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CQ-008` classifies as `QUALITY`, reports `CODE_QUALITY` at stage two, and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt resolves intent `QUALITY`, reports `CODE_QUALITY` in `surfaceIntents`, and resolves every path in `expected_resources`.
- Real user request: `apply yagni to this change`
- Prompt: `apply yagni to this change`

**Exact prompt**:

```text
apply yagni to this change
```

- Expected execution process: the hub's stage-one restraint class selects `sk-code-quality` as a single route, stage two matches the restraint words in the `CODE_QUALITY` keyword list, and the mode's workflow applies the Design Restraint Ladder in the universal standards before it adds any code for a gate fix.
- Expected signals: stage one prints `"selectionKind":"single"` with target `sk-code-quality`, the stage-two replay prints `["CODE_QUALITY"]`, and every path in `expected_resources` exists under the skill root.
- Desired user-visible outcome: the gate answers a restraint request by walking the ladder and stopping at the first rung that holds, rather than by adding code.
- Pass/fail: PASS if both routing stages agree and every listed path exists, and FAIL if stage one selects another target, stage two reports no intent, or a listed path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `apply yagni to this change`

### Commands

1. `sed -n '1,12p' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md`
2. `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "apply yagni to this change"`
3. `node -p 'JSON.stringify(require(process.cwd() + "/.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs").routeSkillResources({skillRoot: process.cwd() + "/.skilled/skills/sk-code", taskText: "apply yagni to this change"}).surfaceIntents)'`
4. `rg -n '"CODE_QUALITY": +\{' .skilled/skills/sk-code/ROUTER.md`
5. `rg -n 'Design Restraint Ladder' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
6. `for p in references/runner-contract.md ../shared/references/universal/code-quality-standards.md references/code-style-guide.md; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: QUALITY` in the frontmatter. Step 2 prints `"selectionKind":"single"` with `sk-code-quality` in `targets`. Step 3 prints `["CODE_QUALITY"]`. Step 4 prints one line that carries `yagni`, `restraint` and `bloat`. Step 5 prints the workflow line that applies the ladder in `SKILL.md`, and the ladder heading with its related citations in the universal standards. Step 6 prints `OK` for all three paths.

### Evidence

Command transcript from steps 1 to 6, the resolved frontmatter block, the stage-one JSON route, the stage-two `surfaceIntents` value, and the keyword line with its ladder heading.

### Pass / Fail

- **Pass**: stage one selects `sk-code-quality` as a single route, stage two reports `CODE_QUALITY`, and every `expected_resources` path exists under the skill root.
- **Fail**: stage one selects another target or a bundle, stage two reports an empty `surfaceIntents`, or a listed path is missing.

### Failure Triage

1. Re-run step 2 on its own. A target other than `sk-code-quality` means the hub vocabulary lost its restraint class, so the prompt carries no quality signal at stage one.
2. Re-run step 3 once step 2 passes. An empty `surfaceIntents` means the restraint words never reached the `CODE_QUALITY` keyword list, which leaves the prompt matched to the mode and to no intent.
3. Diff the keyword list read in step 4 against the prose intent table in the same file. A word present in one list only is the drift to repair.
4. Re-run step 6 for the path that failed, and confirm whether the file was renamed or the path moved under `../shared/references/universal/`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | Thin `INTENT_SIGNALS`/`RESOURCE_MAP` projection this scenario reads |
| [SKILL.md](../../SKILL.md) §3 | The workflow step that applies the Design Restraint Ladder |
| [ROUTER.md](../../../ROUTER.md) §11 | The `CODE_QUALITY` keyword list stage two reads |
| [code-quality-standards.md](../../../shared/references/universal/code-quality-standards.md) | The Design Restraint Ladder itself |

---

## 5. SOURCE METADATA

- Group: sk-code-quality routing
- Playbook ID: CQ-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/restraint-prompt.md`
