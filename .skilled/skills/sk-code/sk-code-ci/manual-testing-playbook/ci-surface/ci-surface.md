---
id: ci-surface-ci-standards
category: ci_surface
stage: routing
title: 'CI workflow standards routing'
description: "This scenario validates CI_WORKFLOW routing. It confirms a request to review a GitHub Actions workflow loads the four rule references, the rule index, the trigger and filter rules, the job shape rules and the protected set, instead of an unrelated resource set."
expected_intent: CI_WORKFLOW
expected_resources:
  - references/ci-workflow-standards.md
  - references/trigger-and-filter-rules.md
  - references/job-shape-rules.md
  - references/protected-set.md
version: 1.0.0.0
---

# CI workflow standards routing

This document captures the routing-recall contract, execution process, source anchors and metadata for the `sk-code-ci` scenario.

---

## 1. OVERVIEW

This scenario validates `CI_WORKFLOW` routing. It confirms that the exact prompt below classifies as `CI_WORKFLOW` and loads the four routed references instead of a generic or mismatched resource set, per `SKILL.md` section 2b's machine-readable router.

### Why This Matters

A workflow diff that reaches the hub with no CI surface reviews as an unknown surface and loads none of the repository's workflow rules. The four references carry the rule index, the trigger and filter rules, the job shape rules and the protected set, so a request routed elsewhere risks approving a change that breaks a rule or weakens a protected workflow.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt classifies as `CI_WORKFLOW` and resolves the declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `CI_WORKFLOW` and every path in `expected_resources`.
- Real user request: `review the github actions workflow yaml`
- Prompt: `review the github actions workflow yaml`

**Exact prompt**:
```text
review the github actions workflow yaml
```

- Expected execution process: the hub resolves the prompt to the `surfaceBundle` `[sk-code-review, sk-code-ci]`, the `CI_WORKFLOW` keywords in `INTENT_SIGNALS` match the prompt and every path this scenario lists under `expected_resources` resolves under the packet root.
- Expected signals: every path in `expected_resources` exists under `sk-code-ci/`, and each one documents `CI_WORKFLOW` routing per `SKILL.md` section 2 or 2b.
- Desired user-visible outcome: the bundled workflow cites the routed rule references as the evidence for the review.
- Pass/fail: PASS if every listed path exists and the router emits it. FAIL if any listed path is missing or the frontmatter intent disagrees with `CI_WORKFLOW`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `review the github actions workflow yaml`

### Commands

1. `sed -n '/^---$/,/^---$/p' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-ci/SKILL.md | grep -F '"CI_WORKFLOW"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-ci/SKILL.md`
4. `for p in references/ci-workflow-standards.md references/trigger-and-filter-rules.md references/job-shape-rules.md references/protected-set.md; do test -e ".skilled/skills/sk-code/sk-code-ci/$p" && echo "OK $p" || echo "MISS $p"; done`
5. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4`
6. `node -e 'const {compiledRoute}=require("./.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"); const r=compiledRoute("sk-code","review the github actions workflow yaml",{}); console.log(r.selectionKind, r.targets.map(t=>t.workflowMode).join(", "))'`

### Expected

Step 1 shows `expected_intent: CI_WORKFLOW` and the four `expected_resources`. Step 2 shows the keyword list this prompt matches. Step 3 shows the `RESOURCE_MAP` array this scenario's list mirrors. Step 4 prints `OK` for every path. Step 5 prints a `PASS` line for check 4. Step 6 prints `surfaceBundle sk-code-review, sk-code-ci`.

### Evidence

Command transcript from steps 1 to 6 and the resolved frontmatter block.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the packet root and the router emits it.
- **Fail**: any listed path is missing, or the router does not emit one.

### Failure Triage

1. Re-run step 4 for the path that failed and confirm whether it was renamed or removed under `references/`.
2. Diff this scenario's `expected_resources` against the step 3 map to see whether the drift is a stale scenario or a stale `SKILL.md` map.
3. Confirm the parent hub's `ROUTER.md` carries the same four paths under `CI_WORKFLOW` with the `sk-code-ci/` prefix.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) section 2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) section 2 | Reference map prose for the `CI_WORKFLOW` resource set |

---

## 5. SOURCE METADATA

- Group: sk-code-ci routing
- Playbook ID: ci-surface-ci-standards
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `ci-surface/ci-surface.md`
