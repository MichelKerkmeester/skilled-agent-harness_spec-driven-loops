---
title: "Goal: Research remediation after phase 032"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "research remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation"
    last_updated_at: "2026-10-25T13:42:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-research-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Research remediation after phase 032

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The relaunch loop carries the sender's model and effort as one set, honours a withdraw under one lock, gives manual claims the live settings and goal packet, rejects malformed hop counts, tests its four uncovered paths, dates the after-compaction pointer, names each refused claim state and arms Pi only once it has settled.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One child phase per research item, in the order of the phase map. Each code change lands with a test that failed before it |
| D2 | Phase 001 moves model and effort only. The Pi and Hermes provider logic in `skilled-loop` stays as it is |
| D3 | Implementation runs in four waves: 001, 005, 007, 008 and 009 first, then 002, then 004, then 003 and 006 |
| D4 | The Claude live hop runs Claude Code's own models, launched as `claude-sonnet-5-5` at effort `low`. Codex and Pi live hops use `gpt-6-luna` |
| D5 | Cursor process counting and transcript answer capture in the pointer are dropped and get no phase |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-model-effort-atomic-replay | `001-model-effort-atomic-replay/goal.md` |
| 002-consume-locked-withdraw | `002-consume-locked-withdraw/goal.md` |
| 003-manual-claim-live-settings | `003-manual-claim-live-settings/goal.md` |
| 004-manual-claim-goal-binding | `004-manual-claim-goal-binding/goal.md` |
| 005-persisted-hops-validation | `005-persisted-hops-validation/goal.md` |
| 006-relaunch-coverage-gaps | `006-relaunch-coverage-gaps/goal.md` |
| 007-compaction-pointer-staleness | `007-compaction-pointer-staleness/goal.md` |
| 008-claim-error-per-state | `008-claim-error-per-state/goal.md` |
| 009-pi-arm-on-agent-settled | `009-pi-arm-on-agent-settled/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All nine child folders print `RESULT: PASSED` under `validate.sh --strict`, with every row in their `acceptance-criteria.md` files Met
- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation --recursive --strict` prints `RESULT: PASSED`
- [ ] A Claude Code session launched through `skilled-loop` with `--model claude-sonnet-5-5 --effort low` and switched to Opus at medium effort relaunches with Opus and `--effort medium`, shown in its recorded receiver process arguments
- [ ] A live Pi hop armed on `agent_settled` is recorded with its `relaunch.log` hop line
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` and `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` both exit 0, with neither pass count below its count before phase 001
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
| Parent and nine children scaffolded, briefs written | Done | `scratch/briefs/` holds nine briefs |

### Deviations and findings

| Item | Note |
|------|------|
| Child level | `recommend-level.sh` scored every child Level 0 or 1. All nine are Level 2 so each has the `acceptance-criteria.md` the goal workflow and the briefs need |
| D4 and parent D7 | Parent D7 names `gpt-6-luna` for live runs; the Claude hop runs Claude Code models, as phase 031's harness did |
<!-- /ANCHOR:log -->
