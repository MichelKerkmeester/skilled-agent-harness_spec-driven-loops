---
title: "Decision Record: Runtime Agent Gateway Alignment"
description: "Why the deep-loop leaf agents must call the append gateway directly, which agents are affected, and the per-mode gateway command that replaces the direct *-state.jsonl append."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment"
    last_updated_at: "2026-08-25T07:26:58Z"
    last_updated_by: "claude"
    recent_action: "Recorded the leaf-calls-the-gateway decision and the affected-agent scope"
    next_safe_action: "Execute the guard-first migration"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Runtime Agent Gateway Alignment

## Context

The `.agents` audit surfaced that the deep-loop leaf agent prompts still instruct a direct `*-state.jsonl` bash-append, while the 012 runtime-enablement work made the event ledger authoritative and the projection file read-only. This record settles two questions the fix depends on: **who** appends (leaf vs. orchestrator), and **which agents** carry the defect.

## Decision 1 — The leaf calls the gateway directly

**Decision:** each affected leaf agent records its iteration event by calling `append-mode-event.cjs` itself, not by writing `*-state.jsonl` and relying on later reconciliation.

**Evidence over the alternative.** One might argue the leaf writes the projection directly and the orchestrator reconciles it into the ledger. The shipped, tested contract refutes that:

- `deep-research/references/state/state-jsonl.md` (v1.14.0.3): "Canonical records are written by calling the append gateway, not by writing to the file… writing to `deep-research-state.jsonl` directly bypasses all four of those properties… it is now a projection of the ledger rather than the place writes land." It also addresses leaves specifically: "Leaf agents may record `idea_observed` through the gateway."
- `deep-research/SKILL.md`: the iteration actor writes `iterations/iteration-NNN.md` **and** records the delta "through the append gateway (`append-mode-event.cjs …`)" in the same breath — same actor, the leaf.
- Orchestrator YAMLs: `state_write_protocol: mechanism: "append-gateway"`, "never fall back to a direct file write," with exactly three exempt sites (lifecycle run-now/pause sentinels) — the leaf iteration append is not exempt.
- `012-runtime-enablement/002-deep-research-enablement/implementation-summary.md`: "Post-flip fan-out leaves write through the gateway; the legacy file is a pure projection the guard verifies." `deep-research-postflip-fanout.vitest.ts` runs three leaves and reads every event back from the ledger in order.

A direct leaf write is unauthorized, unfenced, and unreceipted; it diverges the projection from the ledger and is what the direct-append guard exists to catch. The leaf must call the gateway.

## Decision 2 — Affected scope is four agents, not five

**Decision:** migrate `deep-research`, `deep-review`, `deep-alignment`, and `ai-council`. Leave `deep-improvement`.

**Why.** `deep-improvement` is a proposal-only mutator: it writes one packet-local candidate, returns structured metadata, and stops before any scoring, promotion, or state append. It appends no iteration record to a `*-state.jsonl`, so it has nothing to migrate. The other four each instruct a direct iteration append today (`deep-alignment` most explicitly, with a literal `printf '%s\n' '<json>' >> alignment/deep-alignment-state.jsonl`).

## Decision 3 — Per-mode gateway command (pinned from the orchestrator YAMLs)

| Agent | Gateway command |
|-------|-----------------|
| `deep-research` | `append-mode-event.cjs --mode research --run-directory <dir> --event-json <file>` |
| `deep-review` | `append-mode-event.cjs --mode review --run-directory <dir> --event-json <file>` |
| `deep-alignment` | `append-mode-event.cjs --mode alignment --run-directory <dir> --event-json <file>` |
| `ai-council` | `append-mode-event.cjs --mode ai-council --run-directory <dir> --event-json <file>` |

Exit 0 = durable; exit 2 = refused (halt and name the failed check); no direct-write fallback.

## Decision 4 — Scope stays on the agent prompts

**Decision:** change only the leaf agent files. Do not edit the runtime, the ledger, the orchestrator YAMLs, or the mode SKILLs in this packet.

**Why.** The runtime and orchestrator already enforce the gateway; the defect is solely that the agent prompts lag. `deep-research` SKILL.md already carries gateway language; review/alignment/council SKILLs are silent on the write mechanism (not contradictory), so the agent fix is internally coherent without touching them. Adding gateway language to those SKILLs is a related follow-up, deliberately out of this packet to keep the blast radius on the 24 agent files the audit named.

## Decision 5 — `--event-json` takes one record, not the multi-line delta

**Decision:** the gateway command names a single-record event file: `--event-json <record file>`, where the file holds exactly one JSON object. It is NOT the multi-line `deltas/iter-NNN.jsonl` (record on line 1 + finding/observation rows).

**Why — a real defect caught in verification.** The first canonical pattern pointed `--event-json` at `research/deltas/iter-NNN.jsonl` and described that delta file as "the gateway event payload." That is wrong: `append-mode-event.cjs` does `JSON.parse(fs.readFileSync(eventJsonPath))` — it parses the whole file as ONE object, so a multi-line delta throws on the trailing lines. The orchestrator YAML's own template confirms the shape: `--event-json <record file>`. The flaw had propagated to all migrated files before it was caught; every affected file now names `<record file>` and defines it as the single canonical iteration record, keeping the multi-line delta as a separate reducer artifact. A guard rule (D) fails any file whose `--event-json` points at a `deltas/` or `-state.jsonl` path, so the correction is provable and stays enforced.

## Consequences

- A dispatched leaf now produces a durable, authorized, receipted ledger record; the projection stays consistent with the ledger.
- The change is prompt-only and fully reversible (`git checkout` restores the prior prompts); it alters behavior on the next dispatch, with no data migration.
- Cross-runtime parity becomes a maintained invariant: the doc-level guard can run in CI to catch a future runtime drifting back to a direct write.
