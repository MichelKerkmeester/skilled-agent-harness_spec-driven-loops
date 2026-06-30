---
title: "Decision Record: FIX-5 / Host Hard Identity Escalation Trigger"
status: "Parked — trigger-gated"
deciders: "operator + research (research/research.md §5, §8b)"
date: "2026-06-30"
---
# Decision Record: FIX-5 / Host Hard Identity Escalation Trigger

## Context

The research (`../../research/research.md`) established two structural-prevention ceilings for GPT deep-skill mis-dispatch:

1. **Host-runtime hard identity** — a dispatch-primitive change binding `agent_slug` as runtime identity (auto-load, reject unknown, stamp provenance). Architectural, not PR-sized (research §8b, F33-F35).
2. **FIX-5** — native→CLI subprocess executor, process isolation (research §5).

The agent-layer fix (phases 001-003: route-proof validation + deep.md + orchestrate field + pre-route headers) is attempted first because of its smaller blast radius. This decision record defines **when** the agent-layer fix is proven insufficient and this phase (005) is unparked.

## Decision

**005 stays PARKED unless and until phase 004's GPT first-dispatch smoke fires this trigger:**

> After phases 001 + 002 + 003 land, run one GPT-backed `cli-opencode` first dispatch per deep mode against a tiny packet (phase 004 procedure). **If, for any mode, the GPT dispatch produces a route-mismatched artifact** — i.e., the iteration/delta record's `mode`/`target_agent`/`agent_definition_loaded`/echoed `Resolved route` does not match the requested mode, OR a `dispatch_failure`/`jsonl_wrong_type`/missing-artifact signal fires while the native/Claude baseline passes — **then the agent-layer fix is insufficient and 005 is mandatory.**

This trigger is observable against real dispatch behavior (per research §5), so it does NOT depend on the missing operator-asserted mis-route taxonomy.

## Alternatives Considered

- **Unpark immediately (do not attempt agent-layer first):** rejected — larger blast radius; the agent-layer fix may suffice at much lower cost (research F36).
- **Never unpark (accept agent-layer as the ceiling):** viable only if phase 004's smoke passes for all modes; then 005 stays permanently parked and is closed.

## Consequences

- If triggered: choose at unpark time between minimal 4-agent hard identity vs full FIX-5 process isolation (open question in `spec.md` §5).
- If not triggered: 005 is closed as "agent-layer fix sufficient"; host hard identity / FIX-5 remain documented structural ceilings, not implemented.

## Residual Risk

Host internals are not inspectable from this workspace (F31), so the hard-identity change is specified at the contract surface only; implementation effort/feasibility must be re-confirmed at unpark time against the actual OpenCode host.
