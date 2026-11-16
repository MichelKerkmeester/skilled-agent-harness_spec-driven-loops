---
id: CB-CR-007
category: compiled_routing
stage: routing
title: "sk-code quality gate on a CI workflow edit routes the quality mode with the CI surface at stage one and adds the CI standards at stage two"
description: "This scenario validates two things. The compiled sk-code route for one prompt is a surface bundle of `sk-code-quality` and `sk-code-ci`. The stage-two surface replay adds the four CI references under the intent `CI_WORKFLOW`."
route_shape: surfaceBundle
expected_intent: sk-code-quality
expected_bundle: [sk-code-quality, sk-code-ci]
expected_resources:
  - sk-code-ci/references/ci-workflow-standards.md
  - sk-code-ci/references/trigger-and-filter-rules.md
  - sk-code-ci/references/job-shape-rules.md
  - sk-code-ci/references/protected-set.md
expected_workflow_mode: sk-code-quality+sk-code-ci
expected_leaf_resources:
  - workflow_mode: sk-code-quality
    leaf_resource_id: references/code-style-guide.md
  - workflow_mode: sk-code-quality
    leaf_resource_id: references/runner-contract.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-quality
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 19544bb1d6125b36914780b226c3f367381aa1046dbd26b925eca731c8f6c0fb
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-10-26
version: 1.0.3.0
---

# sk-code quality gate on a CI workflow edit routes the quality mode with the CI surface at stage one and adds the CI standards at stage two

## 1. OVERVIEW

A quality gate request names an edited GitHub Actions workflow file. The words `quality gate` score the quality mode. The workflow path scores the CI surface. The router keeps workflow modes and surfaces in two separate windows. So the CI surface stays beside the quality mode, though the quality mode scores 8 and the CI surface 4. Stage one returns a surface bundle with `sk-code-quality` first and `sk-code-ci` second. Stage two reads the same prompt against the surface vocabulary and adds the CI standards as read-only evidence. The scenario proves both halves. On stage one the compiled engine serves `surfaceBundle` with those two targets. On stage two the surface replay serves `["CI_WORKFLOW"]` with the four CI references.

### Why This Matters

The two stages answer different questions. Stage one picks the mode that acts and the surface whose standards apply. Stage two attaches the standards that edit must satisfy. Recording both keeps the process mode first and the CI surface beside it. A later change that drops either stage-one target shows up as a failed scenario. So does a stage-two replay that drops the CI intent or one of its references.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
run the quality gate on my edited .github/workflows/ci.yml
```

**Expected route**:
- Stage one: a surface bundle whose targets are `sk-code-quality` and then `sk-code-ci`, with `selectionKind` set to `surfaceBundle`.
- Route shape: `surfaceBundle`.
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
| 2 | The decision carries `"selectionKind":"surfaceBundle"`. |
| 2 | The decision carries exactly two targets. The first has `packetId` set to `sk-code-quality` and `packetKind` set to `workflow`. The second has `packetId` set to `sk-code-ci` and `packetKind` set to `surface`. |
| 3 | The stage-two replay prints `["CI_WORKFLOW"]` for `surfaceIntents`. |
| 3 | The stage-two `resources` list holds all four CI references: `sk-code-ci/references/ci-workflow-standards.md`, `sk-code-ci/references/trigger-and-filter-rules.md`, `sk-code-ci/references/job-shape-rules.md` and `sk-code-ci/references/protected-set.md`. |

### Pass/Fail Criteria

- **PASS** iff all three hold. The status shows `servingAuthority: compiled`. The stage-one decision prints `"selectionKind":"surfaceBundle"` with exactly two targets, `sk-code-quality` first and `sk-code-ci` second. The stage-two replay prints `["CI_WORKFLOW"]` with all four CI references present in `resources`.
- **FAIL** iff the serving authority is not `compiled`, the stage-one decision is not a `surfaceBundle` of `sk-code-quality` then `sk-code-ci` (a `defer`, a `single`, a missing or extra target or a different packet), the stage-two replay omits `CI_WORKFLOW`, the stage-two `resources` list misses any of the four CI references or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

### Failure Triage

1. If the stage-one decision is not a `surfaceBundle`, confirm that the quality words score the quality mode and that the workflow path scores the CI surface. Then confirm that the router selects workflow modes and surfaces in separate windows.
2. If a stage-one target is a different packet, confirm the quality and CI vocabularies in `hub-router.json` and the mode registry.
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
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` - Stage-one router, which selects workflow modes and surfaces in separate windows.
- `specs/sk-code/quality-and-review-modes/002-quality-agnostic-gate/005-consumers-and-routing/decision-record.md` - ADR-006, which waived the stage-one CI bundle while stage one returned a single route. Stage one now returns that bundle.

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
- **Last validated**: 2026-11-16
