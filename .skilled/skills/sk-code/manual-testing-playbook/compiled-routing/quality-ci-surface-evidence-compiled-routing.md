---
id: CB-CR-007
category: compiled_routing
stage: routing
title: "sk-code quality gate on a CI workflow edit routes the quality mode at stage one and adds the CI standards at stage two"
description: "This scenario validates that the compiled sk-code route for one prompt is a single route to `sk-code-quality`, and that the stage-two surface replay adds the four CI references under the intent `CI_WORKFLOW`."
route_shape: single
expected_intent: sk-code-quality
expected_resources:
  - sk-code-ci/references/ci-workflow-standards.md
  - sk-code-ci/references/trigger-and-filter-rules.md
  - sk-code-ci/references/job-shape-rules.md
  - sk-code-ci/references/protected-set.md
expected_workflow_mode: sk-code-quality
expected_leaf_resources:
  - workflow_mode: sk-code-ci
    leaf_resource_id: references/ci-workflow-standards.md
  - workflow_mode: sk-code-ci
    leaf_resource_id: references/trigger-and-filter-rules.md
  - workflow_mode: sk-code-ci
    leaf_resource_id: references/job-shape-rules.md
  - workflow_mode: sk-code-ci
    leaf_resource_id: references/protected-set.md
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

# sk-code quality gate on a CI workflow edit routes the quality mode at stage one and adds the CI standards at stage two

## 1. OVERVIEW

A quality gate request names an edited GitHub Actions workflow file. The words `quality gate` score the quality mode, so stage one returns a single route to `sk-code-quality`. The workflow path adds no second stage-one target. Stage two reads the same prompt against the surface vocabulary and adds the CI standards as read-only evidence, so the quality mode carries them without a second route. The scenario proves both halves: the compiled engine serves `single` with one target on stage one, and the surface replay serves `["CI_WORKFLOW"]` with the four CI references on stage two.

### Why This Matters

The two stages answer different questions. Stage one picks the one mode that acts, and stage two attaches the standards that edit must satisfy. Recording both keeps the process mode primary, so a later change that returns a second stage-one target, or a stage-two replay that drops the CI intent or one of its references, shows up as a failed scenario. The stage-one waiver recorded in the consumers phase accepts a single route there and puts the CI proof on stage two.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
run the quality gate on my edited .github/workflows/ci.yml
```

**Expected route**:
- Stage one: a single route whose one target is `sk-code-quality`, with `selectionKind` set to `single`.
- Route shape: `single`.
- Stage two: surface intent `CI_WORKFLOW` with the four CI references under `sk-code-ci`.

---

## 3. TEST EXECUTION

### Preconditions

1. `.skilled/skills/sk-code/sk-code-quality/SKILL.md` and `.skilled/skills/sk-code/sk-code-ci/SKILL.md` resolve on disk.
2. `.skilled/bin/compiled-route.cjs` and `.skilled/bin/compiled-route-status.cjs` resolve on disk.
3. The hub reports `servingAuthority` set to `compiled`.

### Exact Command Sequence

1. Capture the serving status:
   ```
   node .skilled/bin/compiled-route-status.cjs --hub sk-code
   ```
2. Capture the stage-one compiled decision:
   ```
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"
   ```
3. Capture the stage-two surface replay:
   ```
   node -e "const {routeSkillResources}=require('./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs'); const r=routeSkillResources({skillRoot:'.skilled/skills/sk-code',taskText:'run the quality gate on my edited .github/workflows/ci.yml'}); console.log(JSON.stringify(r.surfaceIntents)); console.log(JSON.stringify(r.resources))"
   ```

### Expected Signals

| Step | Signal |
|---|---|
| 1 | The status line carries `servingAuthority` set to `compiled`. |
| 2 | The decision carries `"selectionKind":"single"`. |
| 3 | The decision carries exactly one target, with `packetId` set to `sk-code-quality` and `packetKind` set to `workflow`. |
| 4 | The stage-two replay prints `["CI_WORKFLOW"]` for `surfaceIntents`. |
| 5 | The stage-two `resources` list holds all four CI references: `sk-code-ci/references/ci-workflow-standards.md`, `sk-code-ci/references/trigger-and-filter-rules.md`, `sk-code-ci/references/job-shape-rules.md` and `sk-code-ci/references/protected-set.md`. |

### Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled`, the stage-one decision prints `"selectionKind":"single"` with one target whose `packetId` is `sk-code-quality`, and the stage-two replay prints `["CI_WORKFLOW"]` with all four CI references present in `resources`.
- **FAIL** iff the serving authority is not `compiled`, the stage-one decision is not a `single` route to `sk-code-quality` (a `defer`, a second target or a different packet), the stage-two replay omits `CI_WORKFLOW`, the stage-two `resources` list misses any of the four CI references, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

### Failure Triage

1. If the stage-one decision is not a `single`, confirm that the quality words score the quality mode alone and that no CI surface rule attaches a second stage-one target.
2. If the stage-one target is a different packet, confirm the quality vocabulary in `hub-router.json` and the mode registry.
3. If the stage-two replay prints an empty or different `surfaceIntents`, confirm the `CI_WORKFLOW` keyword row in the `ROUTER.md` intent signals covers a `.github/workflows/` path.
4. If a CI reference is missing from `resources`, confirm the `CI_WORKFLOW` entry in the `ROUTER.md` resource map still names all four files.
5. If the compiled path is structurally broken, run the status command and read its `causeCode`.

---

## 4. SOURCE FILES

- `manual-testing-playbook.md` - Root directory page and scenario summary.
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md` - Quality mode contract and its CI checklist row.
- `.skilled/skills/sk-code/sk-code-ci/SKILL.md` - CI surface contract and its job-shape references.
- `.skilled/skills/sk-code/ROUTER.md` - Surface intent signals and the four-reference CI resource map.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` - Stage-two surface replay used by step 3.
- `.skilled/bin/compiled-route.cjs` - Compiled route front door.
- `specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing/decision-record.md` - ADR-006, which records the stage-one single-route decision and the CI waiver.

---

## 5. SOURCE METADATA

- Group: Compiled Routing
- Playbook ID: CB-CR-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `compiled-routing/quality-ci-surface-evidence-compiled-routing.md`
- **Created**: 2026-10-26
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: not needed
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
