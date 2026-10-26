---
id: CB-CR-005
category: compiled_routing
stage: routing
title: "sk-code bug fix in a TypeScript file routes the skilled surface alone"
description: "This scenario validates that a bug fix naming only a .ts file routes single to `sk-code-skilled` instead of deferring."
route_shape: single
expected_intent: sk-code-skilled
expected_bundle: [sk-code-skilled]
expected_resources:
  - sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md
  - sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md
expected_workflow_mode: sk-code-skilled
expected_leaf_resources:
  - workflow_mode: sk-code-skilled
    leaf_resource_id: references/typescript/style-guide/overview-strict-and-naming.md
  - workflow_mode: sk-code-skilled
    leaf_resource_id: references/typescript/quality-standards/overview-and-type-system.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-skilled
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 663f1ef350f40caed2baaf929eaeb29ab61cc9f279f9577410dcabe4088d2e03
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-10-25
version: 1.0.1.0
---

# sk-code bug fix in a TypeScript file routes the skilled surface alone

## 1. OVERVIEW

A bug-fix request names a `.ts` file and no workflow mode. The words that carry it are `bug` and the `.ts` extension, both in the `sk-code-skilled` runtime vocabulary. The scenario proves the compiled engine serves `single` with exactly `[sk-code-skilled]` for this prompt.

### Why This Matters

Before `bug` and `.ts` joined that vocabulary, this prompt deferred, so an everyday fix request reached no packet. The bare word `fix` stays out of the vocabulary on purpose, because routing matches by substring and `fix` also matches `prefix` and `fixture`. This replay fails if a later vocabulary change drops either word or lets the prompt defer again.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
fix this bug in foo.ts
```

**Expected route**:
- Bundle: `[sk-code-skilled]`, one surface and nothing after it.
- Route shape: `single`.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Capture the serving status:
   ```
   node .skilled/bin/compiled-route-status.cjs --hub sk-code
   ```
2. Capture the compiled decision:
   ```
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix this bug in foo.ts"
   ```

### Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled` and the decision prints `"selectionKind":"single"` with one target whose `workflowMode` is `sk-code-skilled`.
- **FAIL** iff the serving authority is not `compiled`, the decision is a `defer`, a `surfaceBundle` or a different single target, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

---

## 4. SOURCE FILES

- `manual-testing-playbook.md` - Root directory page and scenario summary.
- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` - Skilled surface contract and the vocabulary that carries `bug` and `.ts`.
- `.skilled/skills/sk-code/ROUTER.md` - Surface intent signals and the resource map.
- `.skilled/bin/compiled-route.cjs` - Compiled route front door.

---

## 5. SOURCE METADATA

- Group: Compiled Routing
- Playbook ID: CB-CR-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `compiled-routing/surface-alone-bug-fix-compiled-routing.md`
- **Created**: 2026-10-25
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: not needed
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
