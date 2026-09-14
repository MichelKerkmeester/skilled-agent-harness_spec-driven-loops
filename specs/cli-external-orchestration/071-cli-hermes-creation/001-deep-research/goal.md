---
title: "Goal: research Hermes as a cli runtime"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/001-deep-research"
    last_updated_at: "2026-09-14T18:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the phase directive, angles and resource map; fan-out launched"
    next_safe_action: "Verify both lineages reached their caps, then merge and synthesize"
    blockers: []
    key_files:
      - "research-angles.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-001-deep-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: research Hermes as a cli runtime

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A synthesized, evidence-cited research report says what Hermes can and cannot do
as a `cli-external-orchestration` runtime compared with the six existing ones, and recommends the
phase plan the integration should follow.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to `../goal.md`.

| ID | Decision |
|----|----------|
| P1 | Two `cli-devin` lineages: `deepseek` on `deepseek-v4-flash-max` for 10 iterations, `swe2` on `swe-2-max` for 5; stop policy `max-iterations`, so convergence is telemetry only |
| P2 | Every iteration works one of the ten angles in `research-angles.md`; `resource-map.md` is known context, not a discovery |
| P3 | Lineages read the installed Hermes source and run read-only `hermes` commands; they never change `~/.hermes` and never write outside their lineage directory |
| P4 | Online sources are fetched live and dated; documentation-only claims are marked as such |
| P5 | The deliverable is a comparison and a ranked recommendation, not a description of Hermes |

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |
| Research inputs | `research-angles.md`, `resource-map.md` |

The parent directive in the packet root `goal.md` binds above this file.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/lineages/deepseek/iterations/` holds 10 iteration files and `research/lineages/swe2/iterations/` holds 5, each lineage's synthesis recording `maxIterationsReached`
- [x] `research/research.md` exists, carries ranked findings with resolving citations, a capability comparison table against the six runtimes, and a recommended phase plan
- [x] Every one of the ten angles has at least one finding or an explicit UNKNOWN in the synthesis
- [x] No file outside `research/` was changed by the run, shown by `git status`
- [x] The findings and recommendations were presented to the operator in chat, not only as a path
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Angles and resource map authored | Done | `research-angles.md`, `resource-map.md` |
| Fan-out run | Done | `research/orchestration-summary.json`: 2 of 2 succeeded; 10 and 5 iteration files; both `maxIterationsReached` |
| Merge and synthesis | Done | `research/findings-registry.json` (90 findings), `research/research.md` |
| Citation verification | Done | 14 of 14 resolve; `research/research.md` section 7 |
| Operator confirmation of the phase plan | Done | Confirmed in chat 2026-09-14 (recommended plan, LLM Gateway credential path); parent `goal.md` log |

### Deviations and findings

| Item | Note |
|------|------|
| Model id for "DeepSeek v4.1 flash max" | On the `cli-devin` route the roster id is `deepseek-v4-flash-max`; the `v4.1` naming exists only on the LLM Gateway, cli-pi and opencode routes. Dispatch uses the devin id. |
| No smoke dispatch ran | The local Hermes install has no configured provider; the angles file allowed a smoke only with one. Every dispatch claim is source-verified; the contract pin phase carries the live proof. |
| Fabricated state-log timestamps | Both lineages invented ISO timestamps; the runner flagged 8 anomalies. File mtimes carry the real order. |
<!-- /ANCHOR:log -->
