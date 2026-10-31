---
title: "Goal: Phase 8: verification-and-closeout"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Plan this phase against its completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: verification-and-closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove every claim this packet makes from the final state and close it, or report exactly what does not hold and why.

### Decisions

Frozen choices. Changing one is an amendment. The parent directive in
`../goal.md` outranks everything here; name a conflict rather than resolving it.

| ID | Decision |
|----|----------|
| D1 | Every claim is proven from the final state, never carried forward from the phase that first made it |
| D2 | A run counts as evidence only after its output and its exit status are read. An exit code alone proves nothing |
| D3 | The latency delta against the phase 002 baseline is reported as numbers whether or not it sits inside budget |
| D4 | Anything that does not hold is reported as a blocker with evidence, never closed with a caveat |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Recursive strict validate over the parent prints RESULT: PASSED and exits 0
- [x] Every phase reports its acceptance criteria closeable
- [x] Every runtime cold-boots with no advisor MCP server and the routing brief still arrives
- [x] All nine capabilities answer through the CLI from the final state
- [x] The prompt-hook latency delta against the phase 002 baseline is reported per runtime
- [x] The advisor test suite and the repository gates run from the final state with their output read
- [x] The parent goal's DONE WHEN table carries evidence in every row
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
| Phase planned | Done | `plan.md`, `tasks.md` |
| Phase executed | Done | Seven criteria re-run from the final state; `latency-delta.md` and `implementation-summary.md` carry the numbers |
| Acceptance rows closed | Done | 8 of 8 Met in `acceptance-criteria.md`, each naming the evidence |

### Deviations and findings

| Item | Note |
|------|------|
| | |
<!-- /ANCHOR:log -->
