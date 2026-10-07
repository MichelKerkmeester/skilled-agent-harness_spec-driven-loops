---
title: "Decision Record: FIX-5 / Host Hard Identity Escalation Trigger"
description: "Decision record defining the escalation trigger that would unpark FIX-5 host hard identity, and its final closure as agent-layer fix sufficient."
trigger_phrases:
  - "host hard identity decision"
  - "fix-5 escalation trigger"
  - "process isolation decision"
status: "Closed — agent-layer fix sufficient (2026-07-01, see Final Resolution)"
deciders: "operator + research (research/research.md §5, §8b) + phase 013 gate evaluation"
date: "2026-06-30"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/005-host-hard-identity-fix5"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "operator"
    recent_action: "FIX-5 closed as agent-layer fix sufficient; no trigger met"
    next_safe_action: "None, the packet is archived"
    blockers: []
---
# Decision Record: FIX-5 / Host Hard Identity Escalation Trigger

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

## Context

<!-- ANCHOR:adr-001-context -->
The research (`../001-deep-agent-router-and-orchestration/research/research.md`) established two structural-prevention ceilings for GPT deep-skill mis-dispatch:

1. **Host-runtime hard identity** — a dispatch-primitive change binding `agent_slug` as runtime identity (auto-load, reject unknown, stamp provenance). Architectural, not PR-sized (research §8b, F33-F35).
2. **FIX-5** — native→CLI subprocess executor, process isolation (research §5).

The agent-layer fix (phases 001-003: route-proof validation + deep.md + orchestrate field + pre-route headers) is attempted first because of its smaller blast radius. This decision record defines **when** the agent-layer fix is proven insufficient and this phase (005) is unparked.
<!-- /ANCHOR:adr-001-context -->

## Decision

<!-- ANCHOR:adr-001-decision -->
**005 stays PARKED unless and until phase 004's GPT first-dispatch smoke fires this trigger:**

> After phases 001 + 002 + 003 land, run one GPT-backed `cli-opencode` first dispatch per deep mode against a tiny packet (phase 004 procedure). **If, for any mode, the GPT dispatch produces a route-mismatched artifact** — i.e., the iteration/delta record's `mode`/`target_agent`/`agent_definition_loaded`/echoed `Resolved route` does not match the requested mode, OR a `dispatch_failure`/`jsonl_wrong_type`/missing-artifact signal fires while the native/Claude baseline passes — **then the agent-layer fix is insufficient and 005 is mandatory.**

This trigger is observable against real dispatch behavior (per research §5), so it does NOT depend on the missing operator-asserted mis-route taxonomy.
<!-- /ANCHOR:adr-001-decision -->

## Alternatives Considered

<!-- ANCHOR:adr-001-alternatives -->
- **Unpark immediately (do not attempt agent-layer first):** rejected — larger blast radius; the agent-layer fix may suffice at much lower cost (research F36).
- **Never unpark (accept agent-layer as the ceiling):** viable only if phase 004's smoke passes for all modes; then 005 stays permanently parked and is closed.
<!-- /ANCHOR:adr-001-alternatives -->

## Consequences

<!-- ANCHOR:adr-001-consequences -->
- If triggered: choose at unpark time between minimal 4-agent hard identity vs full FIX-5 process isolation (open question in `spec.md` §5).
- If not triggered: 005 is closed as "agent-layer fix sufficient"; host hard identity / FIX-5 remain documented structural ceilings, not implemented.
<!-- /ANCHOR:adr-001-consequences -->

## Residual Risk

Host internals are not inspectable from this workspace (F31), so the hard-identity change is specified at the contract surface only; implementation effort/feasibility must be re-confirmed at unpark time against the actual OpenCode host.

## Final Resolution (2026-07-01, Phase 013)

Phase 004's original smoke never reached a clean pass or disproof (phase 005 findings: 0/4 command-owned smokes reached a real leaf dispatch, blocked upstream by `cli-opencode`'s self-invocation guard). Research (`../007-gpt-behavioral-hardening-research/research/research.md`, 6 lineages across 2 rounds) sharpened this decision's trigger into a cross-validated negative gate (very high confidence, 6/6): *"unpark only if, after the cheaper fixes land and the benchmark runs, GPT still shows semantic wrong-mode artifacts, a route-proof mismatch, or disproportionate stuck/latency failures on any mode while Claude passes."*

**Phase 012's benchmark** (`../012-gpt-claude-benchmark/benchmark-results.md`) finally cleared the precondition that blocked phases 004/005 (confirmed a genuine, `OPENCODE_PID`-free external shell — this Claude Code session itself) and ran live smoke dispatches across all 4 deep modes for both GPT-5.5-fast and Claude, after phases 008-011 landed. Result, applying the gate:

- **Semantic wrong-mode artifacts: zero observed**, across every completed GPT cell.
- **Route-proof mismatches: zero observed.**
- **Disproportionate stuck/latency failures**: GPT was measurably slower (3-10x) on every dispatch that completed, and 2 cells (`/deep:research` and `/deep:review`'s full command-level completion) did not finish within the benchmark's smoke window. Neither was confirmed as genuinely *stuck* (hung indefinitely, erroring) versus simply needing more wall-clock time than the smoke window allotted — and critically, **FIX-5 (subprocess/process-isolation) would not address raw model inference latency in any case**; that gap is a property of the underlying LLM, not of dispatch identity or process boundaries. Even under the loosest reading of this trigger, FIX-5 is not the applicable remedy for it.

**Decision: 006/FIX-5 is CLOSED as "agent-layer fix sufficient."** No trigger condition was met on grounds FIX-5 would actually address. Host-runtime hard identity and full process-isolation remain documented, specified structural ceilings (this record, `spec.md` §5) but are not implemented, per the "Never unpark" alternative already anticipated above.

This closes the FIX-5 escalation question for this packet. Any future report of GPT semantic wrong-mode artifacts or a route-proof mismatch (the two triggers this benchmark found zero evidence for) would warrant reopening this decision with fresh evidence — this closure is not a permanent architectural ban on host-identity work, only a statement that the evidence gathered here doesn't currently justify it.
