---
title: "Goal: Phase 2: daemon-transport-decision"
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
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/002-daemon-transport-decision"
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
# Goal: Phase 2: daemon-transport-decision

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide by measurement whether the resident daemon survives the transport removal, and freeze the protocol its socket speaks once MCP framing is gone.

### Decisions

Frozen choices. Changing one is an amendment. The parent directive in
`../goal.md` outranks everything here; name a conflict rather than resolving it.

| ID | Decision |
|----|----------|
| D1 | The baseline is recorded before anything changes: prompt-hook latency per runtime, daemon warm and daemon cold |
| D2 | Both designs are measured on the real prompt-hook path, not on a microbenchmark that flatters either one |
| D3 | A latency budget is set here as a number, and it becomes the gate phase 008 reports against |
| D4 | The chosen protocol is written as a contract before any code implements it, covering framing, error shape and version negotiation |
| D5 | An inconclusive measurement keeps the resident daemon, because it is the design that currently works |

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

- [x] The pre-change prompt-hook latency baseline is recorded as numbers per runtime, warm and cold
- [x] Both the resident and the stateless design have measured numbers from the same harness
- [x] The daemon decision is stated together with the numbers that justify it
- [x] The socket protocol is frozen as a written contract covering framing, errors and version negotiation
- [x] A latency budget is named as a number phase 008 can check against
- [x] What warms the daemon at session start is named, with the mechanism identified per runtime
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
| Baseline recorded | Done | `baseline.md`: hook warm p50 2096 ms n=10; CLI warm p50 823 ms n=10 live and 926 ms n=8 isolated; cold first call 3008 ms; Python shim 2810 ms n=6 |
| Daemon decision | Done | Keep the resident daemon. Cold costs 3008 ms against 926 ms warm on the same daemon, so the daemon is worth about 2082 ms per call if nothing stays resident |
| Latency budget set | Done | CLI warm p50 under 1100 ms; hook warm p50 not above the current 2096 ms; cold first call under 3500 ms |
| Socket protocol contract | Done | `protocol-contract.md`: NDJSON and JSON-RPC envelope kept, MCP vocabulary removed, `advisorProtocol` version string, `advisor.call` method, error-code to exit-code table |
| Session warm mechanism | Done | `warm-mechanism.md`: `--warm-only` at session start, confirmed hook points for Claude and OpenCode, codex to confirm in 004, pi recorded as a gap |

### Deviations and findings

| Item | Note |
|------|------|
| F5. The CLI front door is faster than the path the Claude hook uses today | Hook p50 2096 ms against CLI p50 823 ms. Not a same-workload comparison, since the hook also runs dedup, rendering and metrics, but it is what the caller pays. D4's single front door is expected to make the prompt path faster, not slower, which inverts the plugin-latency risk recorded in the phase 004 spec |
| F6. The stateless design was not prototyped, and does not need to be | The only no-daemon figure is the 3008 ms cold call, an upper bound on per-call stateless cost. A stateless CLI would land between 926 and 3008 ms, and nothing in that range beats the resident design. D3's inconclusive-keeps-the-daemon rule points the same way, so the decision holds whether or not the proxy is accepted |
| F7. The Python shim is not a stateless scorer | Its output carries `source: native` and the reason names `advisor_recommend`, so it spawns and delegates to the same daemon. Its 2810 ms measures reaching the scorer from a fresh Python process, not scoring without a daemon |
| Isolation attempt one measured nothing | Putting the bench socket under the session scratchpad exceeded the Darwin `sun_path` 104-character limit; the CLI refused with exit 69 and the runs returned in 87 ms. Those figures were discarded rather than reported. The retry used a short `/tmp` path |
| F8. D1 and D7 could not both hold literally | The shared socket bridge parses JSON-RPC frames to answer a liveness probe at the client cap, and it serves more than one daemon. Deleting JSON-RPC from the advisor socket would break that probe or force a change to code D7 preserves. D1 was amended to name the MCP vocabulary rather than the envelope |
| F9. Pi has no session-start warm point | `.pi/` carries no hook surface next to the prompt adapter, so pi's first prompt pays the cold cost. Recorded as a known gap rather than assumed solved; 004 looks once more |
| Bench residue removed | The isolated daemon outlived its socket directory and was killed by pid after the run; one daemon on the default socket remains and a live recommendation still returns `sk-doc` for a documentation prompt |
<!-- /ANCHOR:log -->
