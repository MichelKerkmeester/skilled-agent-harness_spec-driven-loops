---
title: "Goal: churn cumulative arm"
description: "Phase 005 of the fan-out containment work: Detect a neighbour that dirties the shared checkout slowly, not only in bursts."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/005-churn-cumulative-arm"
    last_updated_at: "2026-09-14T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-max"
    recent_action: "Landed the cumulative churn arm and verified the two touched test files"
    next_safe_action: "Commit once the orchestrator's full-suite run exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-005-churn-cumulative-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: churn cumulative arm

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Detect a neighbour that dirties the shared checkout slowly, as a safety net for the opt-in restore remedy; under the preserve default nothing depends on it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The churn detector keeps a cumulative count of newly dirty out-of-lineage paths across heartbeats and trips when it crosses a second threshold, alongside the existing per-window burst threshold. |
| D2 | A detection still latches preserve and is final. |
| D3 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] A neighbour dirtying one path per heartbeat for more windows than the cumulative threshold trips the detector, with a test that fails against the burst-only detector
- [x] A burst still trips within one window as before
- [x] The threshold is settable per run and defaults to a documented value
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; the detector accumulates across heartbeats, `containment.churnCumulativeThreshold` defaults to 12, and the ledger event carries both counts and both thresholds |
| Red-first proof | Done | The two new cases failed against the burst-only detector: `expected [] to have a length of 1 but got +0` and `expected undefined to be 12` |
| Touched test files plus typecheck | Green | `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts tests/unit/executor-config.vitest.ts`: exit 0, 237 passed; `npm run typecheck`: exit 0 |
| Observed ledger event | Confirmed | Standalone run of the same fixture: `newly_dirty_paths: 1`, `cumulative_dirty_paths: 4`, `churn_cumulative_threshold: 3`, restore still latched |
| Full runtime suite | Green | `npm test` in the runtime: 156 files, 2668 passed, 7 skipped, exit 0, 1294 s |

### Deviations and findings

| Item | Note |
|------|------|
| Parent numbers differ from shipped ones | The parent's REQ-004 and plan name twelve paths per window and forty cumulative; the per-window default shipped since the detector landed is three, and this phase fixed the cumulative default at twelve. Reconciling the parent text is outside this phase's write authority |
| `churnThreshold: 0` narrowed | It used to disable the detector outright; it now disarms only the per-window arm, so the cumulative arm keeps sampling. Zero on both arms is still a no-op sampler |
| Adjacent, not fixed | The parent phase map still marks this phase `draft`; the status sync belongs to the packet tooling, not to this phase's files |
<!-- /ANCHOR:log -->
