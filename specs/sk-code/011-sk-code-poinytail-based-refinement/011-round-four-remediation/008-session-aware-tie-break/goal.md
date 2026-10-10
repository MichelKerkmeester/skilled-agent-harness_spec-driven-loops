---
title: "Goal: Phase 8: session-aware-tie-break"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break"
    last_updated_at: "2026-10-10T18:40:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-008-session-aware-tie-break"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: session-aware-tie-break

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let the caller pass the session's detected surface to the sk-code compiled front door as `--surface-hint`, so that on a keyword tie the hinted surface leads the bundle while targets, bundle kind, workflow-mode order and every unhinted route stay as they are.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hint is applied at serve time by an exported `applySurfaceHint` in the sk-code canary router, after the route decision is validated, and the runtime engine and the sk-code canary harness both call it. `evaluateCanary` does not change. |
| D2 | The front door flag is `--surface-hint <SURFACE>`. A value is a detection label or a `workflowMode`, matched case-insensitively against the hub's declared surface destinations, and any other value is ignored with nothing written to stdout or stderr. |
| D3 | Each authored closure file under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` is edited first and copied byte for byte over its runtime copy. `compiled-route-sync.cjs` runs only as `--verify`. |
| D4 | The caller step sits in a paragraph after the lockstep compiled-routing blockquote in `SKILL.md`, plus one sentence in `ROUTER.md`, and the hub ships release 2.2.7.0. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `# pass 6` and `# fail 0` and exits 0.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/canary-assert.cjs` prints `OK surface-hint-webflow-testing route orderedBundle sk-code-webflow,sk-code-opencode` and `cases 18 failures 0` and exits 0, and `cmp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` prints nothing and exits 0.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/all-canaries.cjs | grep FAIL | grep -v 'FAIL 004-cli-external-orchestration jev-transport-single'` prints nothing and exits 1, and the same script's output contains `001-sk-code cases 18 failures 0`.
- [ ] `for p in 009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs 009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs 014-runtime-engine/lib/compiled-route.cjs 014-runtime-engine/lib/resolve.cjs; do cmp specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/$p .skilled/bin/lib/compiled-routing/$p; done` prints nothing and exits 0.
- [ ] `grep -c -F -- '--surface-hint' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md` prints `.skilled/skills/sk-code/SKILL.md:1` and `.skilled/skills/sk-code/ROUTER.md:1` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Surface-hint tests pass | Pass | Verifier rerun: exit 0, `# pass 6`, `# fail 0` (`# fail 3` before the code change) |
| Canary pins the hint in both fixture copies | Pass | `OK surface-hint-webflow-testing route orderedBundle sk-code-webflow,sk-code-opencode`, `cases 18 failures 0`, `cmp` of both copies exit 0 |
| Every hub canary keeps its baseline | Pass | No FAIL line beyond the baseline `jev-transport-single`, `001-sk-code cases 18 failures 0`, diff against baseline is `cases 13` to `cases 18` only |
| Runtime closure files match their authored copies | Pass | Four `cmp` runs print nothing, exit 0 |
| Hub caller step present in `SKILL.md` and `ROUTER.md` | Pass | `SKILL.md:1`, `ROUTER.md:1` |
| Strict validation of this folder passes | Pass | `RESULT: PASSED` after the verifier's repair-derived run |

### Deviations and findings

| Item | Note |
|------|------|
| `ROUTER.md` has no front door call | Only `SKILL.md` calls `compiled-route.cjs` today, so `ROUTER.md` gains one caller sentence in its Core Principle paragraph rather than a changed step |
| `.skilled/bin/README.md` assigned to this child | No child owned it, and its front door row documents the flag this child adds, so the orchestrator assigned the planner's handoff here as T060 (`scratch/handoff-readme.json`). It passed its check |
| Phase 1 front door baseline | The orchestrator re-minted sk-code after planning, so the front door test passed at baseline (pass 1, fail 0) instead of failing. The admission test (28 pass, 1 fail) and the manifest test (26 pass, 16 fail) fail at baseline with a fresh manifest too |
| Verifier result | No defects, fix-units.json is `[]`. A direct `compiledRoute(hub, prompt, null)` call throws, the resolver catches it, and no shipped caller passes null |
| Reviewer result | No defects, `review-findings.json` is `[]`. Callers outside this child never pass the hint yet: the advisor's `advisor-recommend` handler, and the sk-code playbook and feature catalog examples |
| Orchestrator steps | Done on 2026-10-10: re-mint and archive copy (`cmp=0`, guard `sk-code fresh`), Hermes `PASS: 70 Hermes skill copies in sync`, trigger index `stale documents   : 0`. T049, T055 and T056 then passed as expected |
<!-- /ANCHOR:log -->
