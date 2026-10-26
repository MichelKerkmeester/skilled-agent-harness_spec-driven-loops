---
title: "Goal: Phase 5: consumers-and-routing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "consumers and routing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/005-consumers-and-routing"
    last_updated_at: "2026-10-26T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase against the durable directive and recorded the landing log"
    next_safe_action: "Hand the phase to the conductor for the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-consumers-and-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stage one carries comment hygiene alone. The yagni and over-engineering prose replays measured a false positive, so both words sit at stage two only (ADR-003 amendment)"
---
# Goal: Phase 5: consumers-and-routing

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the quality run verdict readable by the workflows that act on it, and make sk-code-quality reachable from the requests that need it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run verdict has three readers: `workflow-verify.md` step 2, the @code RETURN `Quality Gate` field, and `sk-code-review` as input evidence. A fourth reader is an amendment |
| D2 | `sk-code-review` no longer claims the "quality gate" trigger. `sk-code-quality` keeps it |
| D3 | "simplify" is a stage-two keyword only. Stage one carries "comment hygiene". Amendment 2026-10-26: "yagni" and "over-engineering" moved to stage two as well, because both pulled sk-code to 0.82 or above on prose prompts, and ADR-003 records the measurement |
| D4 | Commands never come from a surface block. Quality declarations carry checklists only |
| D5 | `.skilled/agents/code.md` is canonical. The Claude fork is hand-synced, and the Codex and Pi trees are generated |
| D6 | Code comments state the durable reason only, with no packet, phase, REQ, ADR or task id |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0
- [x] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` prints `# fail 0`
- [x] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0
- [x] `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0` and exits 0
- [x] `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs --test-name-pattern F15` prints `# fail 0`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing --strict --no-recursive` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet documents authored | Done | This folder: spec, plan, tasks, acceptance criteria, decision record, goal and implementation summary |
| Design citations re-checked | Done | Corrections are in plan.md section 3 |
| Implementation | Done | Tasks T001 to T040 and T059, with the version carriers T033 to T035 |
| First review round | Done | T029 amended, so stage one kept comment hygiene alone. The CI canary was measured as `single` and became AC-018's waiver |
| Second review round | Done | T060 to T065, one per finding, each with the run that proves it. T061 records two CI keyword attempts and their rejection |
| Verification | Done | T041 to T058. The drift guards, the metadata gate, the graph compiler, the mirror check, the canaries, the strict validator and the document validator all passed on the final tree |
| Completion criteria | Done | The six commands above printed `all mirrors in sync`, `# fail 0` three times, `all 4 guards PASSED`, `failed=0` and `RESULT: PASSED`, each with exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Benchmark replay in the design | The Lane C harness is retired. The successor gate and the canaries replace it (ADR-006) |
| Metadata gate and `quality` | The design says the gate allows `quality`. It allows `surface_detection` only. Phase 5 adds the key |
| Stage-one CI canary | Amended 2026-10-26. Stage one stays `single` with the target `sk-code-quality`, and stage two returns `CI_WORKFLOW` with the four CI references, so the CI standards still reach the quality run. Both keyword fixes were tried and rejected, so the CI vocabulary is unchanged from the base commit and AC-018 closes as a waiver under ADR-006 that the operator confirmed on 2026-10-26 |
| Packet location | Under `015-quality-agnostic-gate`, not the `014` child the design recommended. Gate 3 is the operator's |
| Cross-consumer class | The phase is classed `cross-consumer`. Each reader, declaration and vocabulary move crosses a file boundary, so every consumer in spec.md section 3 was checked against it. The fix inventories the plan calls N/A stay N/A, because the phase fixes no defect of its own |
| Hub changelog sentence | `.skilled/skills/sk-code/changelog/v3.7.0.0.md` names a `ci.yml` keyword this phase rejected. That file is outside this phase's write scope and needs one fix at landing |
| Private quality row | A malformed `quality` row in a private `local-*` outside skill is skipped by the metadata gate and fails the quality run closed with exit 3. Recorded as a known limitation |
<!-- /ANCHOR:log -->
