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
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive and the completion criteria"
    next_safe_action: "Start after 002-builtin-runner and 004-doctrine land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-consumers-and-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| D3 | "simplify" is a stage-two keyword only. Stage one carries "comment hygiene", "yagni" and "over-engineering" |
| D4 | Commands never come from a surface block. Quality declarations carry checklists only |
| D5 | `.skilled/agents/code.md` is canonical. The Claude fork is hand-synced, and the Codex and Pi trees are generated |
| D6 | Code comments state the durable reason only, with no packet, phase, REQ, ADR or task id |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs --all` prints `all mirrors in sync` and exits 0
- [ ] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs` prints `# fail 0`
- [ ] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0
- [ ] `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0` and exits 0
- [ ] `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs --test-name-pattern F15` prints `# fail 0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/005-consumers-and-routing --strict --no-recursive` prints `RESULT: PASSED`
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
| Packet documents authored | Done | This folder: spec, plan, tasks, acceptance criteria, decision record, goal and implementation summary |
| Design citations re-checked | Done | Corrections are in plan.md section 3 |
| Implementation | Pending | tasks.md, starting at T001 |

### Deviations and findings

| Item | Note |
|------|------|
| Benchmark replay in the design | The Lane C harness is retired. The successor gate and the canaries replace it (ADR-006) |
| Metadata gate and `quality` | The design says the gate allows `quality`. It allows `surface_detection` only. Phase 5 adds the key |
| Stage-one CI canary | Returns `single` today. AC-018 stays Unmet until an operator decision |
| Packet location | Under `015-quality-agnostic-gate`, not the `014` child the design recommended. Gate 3 is the operator's |
<!-- /ANCHOR:log -->
