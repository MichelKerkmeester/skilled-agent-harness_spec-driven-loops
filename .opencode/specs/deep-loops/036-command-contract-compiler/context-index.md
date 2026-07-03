# Context Index — 036 carved from 035

> Migration bridge. This packet was carved out of `035-gpt-reliability-fixes` on 2026-07-03 after the 035 phase-003 design pass returned a research-sized feasibility verdict.

## Why the carve

The 035 restructure (see `../035-gpt-reliability-fixes/context-index.md`) collapsed the plan into a unified command-contract architecture (GAP-58). When phase 003 (the contract compiler) reached its design-first step, the GPT design pass — grounded in the real `/deep:review` 14-file authority chain — returned: *"Not realistically one normal implementation phase"* (schema+compiler M, deterministic loader L, drift guard + CI M-L, retrofit of all commands + 14 agents L). This matches the plan-review's own GAP-53/54 (the compiler and pacing/resume are research-sized). The user approved carving it here rather than forcing it into one 035 phase.

## What moved from 035 → 036

| From 035 | To 036 |
|---|---|
| phase 003 command-contract-compiler | this packet's core (compiler + drift guard + setup loader + fold-in) |
| phase 005 retrofit + pacing/resume | this packet (retrofit all commands + 14 agents; pacing/resume) |
| 035 phase-002 deferred `AGENTS.md` bridge | this packet (behind the rollout flag) |
| 035 phase-001 deferred REQ-007 rollout wiring | this packet (manifest capture + comparator + emitter integration) |

## What stays in 035 (the acute fixes)

- **001** acceptance + rollout core — done (harness hardening + the rollout resolver/config).
- **002** Gate-3 precedence + validator — done (GAP-16 blocker closed).
- **004** dispatch receipts + progress — the GAP-23 blocker; the last 035 phase. Built as standalone mechanisms that 036's compiled contract will reference.

035 phases 003 and 005 are removed; their intent lives here. The seed design is `001-contract-compiler-design/design.md`.
