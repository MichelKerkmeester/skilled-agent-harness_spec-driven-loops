---
id: CB-CR-008
category: compiled_routing
stage: routing
title: "sk-code quality gate on a rails app routes the quality mode alone"
description: "This scenario validates that the compiled sk-code route for one prompt is a single route to `sk-code-quality` even when the stack is outside the surface vocabulary."
route_shape: single
expected_intent: sk-code-quality
expected_bundle: [sk-code-quality]
expected_resources:
  - sk-code-quality/references/code-style-guide.md
  - sk-code-quality/references/runner-contract.md
expected_workflow_mode: sk-code-quality
expected_leaf_resources:
  - workflow_mode: sk-code-quality
    leaf_resource_id: references/code-style-guide.md
  - workflow_mode: sk-code-quality
    leaf_resource_id: references/runner-contract.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-quality
evidence_serving_authority: pending
evidence_flag_state: pending
evidence_fallback_cause: pending
evidence_manifest_digest: pending
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-10-26
version: 1.0.0.0
---

# sk-code quality gate on a rails app routes the quality mode alone

## 1. OVERVIEW

A quality gate request names a rails app and asks to run the gate before a completion claim. The quality words score the quality mode, and the unknown stack adds no surface packet, so the hub routes `sk-code-quality` alone. The scenario proves the compiled engine serves `single` with exactly `[sk-code-quality]` for this prompt.

### Why This Matters

A stack outside the surface vocabulary still gets the author gate. The quality mode records the surface as `unknown`, applies the universal floor and runs its built-in checks, and it neither defers nor attaches a guessed surface packet. This replay fails if the unknown stack turns the route into a defer or a bundle.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
quality gate for my rails app before I claim done
```

**Expected route**:
- Bundle: `[sk-code-quality]`, one workflow mode and nothing after it.
- Route shape: `single`.
- First target: `sk-code-quality`.

---

## 3. TEST EXECUTION

### Preconditions

1. `.skilled/skills/sk-code/sk-code-quality/SKILL.md` resolves on disk.
2. `.skilled/bin/compiled-route.cjs` and `.skilled/bin/compiled-route-status.cjs` resolve on disk.
3. The hub reports `servingAuthority` set to `compiled`.

### Exact Command Sequence

1. Capture the serving status:
   ```
   node .skilled/bin/compiled-route-status.cjs --hub sk-code
   ```
2. Capture the compiled decision:
   ```
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"
   ```

### Expected Signals

| Step | Signal |
|---|---|
| 1 | The status line carries `servingAuthority` set to `compiled`. |
| 2 | The decision carries `"selectionKind":"single"`. |
| 3 | The single target carries `workflowMode` set to `sk-code-quality`. |

### Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled` and the decision prints `"selectionKind":"single"` with one target whose `workflowMode` is `sk-code-quality`.
- **FAIL** iff the serving authority is not `compiled`, the decision is a `surfaceBundle`, a `defer` or a different single target, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

### Failure Triage

1. If the decision is a `defer`, confirm that `quality gate` is in the hub quality vocabulary and that the prompt still carries it.
2. If the decision is a `surfaceBundle`, confirm that the unknown stack matches no surface declaration.
3. If the decision names another mode, read the hub vocabulary classes for the words that scored it and compare them with the quality aliases.
4. If the compiled path is structurally broken, run the status command and read its `causeCode`.

---

## 4. SOURCE FILES

- `manual-testing-playbook.md` - Root directory page and scenario summary.
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md` - Quality mode contract and its unknown-surface handling.
- `.skilled/skills/sk-code/shared/references/stack-detection.md` - Surface detection order and the unknown fallback.
- `.skilled/skills/sk-code/hub-router.json` - Hub vocabulary classes and the quality mode signal.
- `.skilled/bin/compiled-route.cjs` - Compiled route front door.

---

## 5. SOURCE METADATA

- Group: Compiled Routing
- Playbook ID: CB-CR-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `compiled-routing/workflow-alone-quality-rails-compiled-routing.md`
- **Created**: 2026-10-26
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: not needed
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
