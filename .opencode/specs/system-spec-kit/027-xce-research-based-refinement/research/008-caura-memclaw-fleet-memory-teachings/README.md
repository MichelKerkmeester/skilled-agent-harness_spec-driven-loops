# Research Phase 008: caura-memclaw (MemClaw) Fleet-Memory Teachings

Deep-research pass mining the vendored `external/caura-memclaw-main` ("MemClaw — fleet memory for AI agents") for design teachings transferable to the **local, single-user Spec Kit Memory system**, mapped to 027 children 002-008, ending in a sub-packet proposal for 027.

> **Numbering note:** Research-folder `008-` per operator direction. As a **separate research packet it owns its own iteration sequence `001-020`** (research-folder `007` is unused; `006-peck-source-deep-mining/` is a separate concurrent run). The new child this run proposes is numbered `015-` (the next free slot after the concurrent `006-peck` proposals `009-011` and `007-gem-team` proposals `012-014`; re-check at scaffold time — see `sub-packet-proposals.md`).

## Contents

| Path | Purpose |
|---|---|
| `research.md` | Final synthesis: per-surface mechanism + transferable teachings + negative knowledge (written at convergence). |
| `sub-packet-proposals.md` | Proposal for a new 027 child (and/or amendments to 002-008) derived from the teachings. |
| `deep-research-config.json` | Runtime configuration (immutable). |
| `deep-research-state.jsonl` | Append-only combined lineage state. |
| `deep-research-strategy.md` | Strategy, question tracker, reducer-owned ANCHOR sections. |
| `deep-research-dashboard.md` | Reducer-generated observability dashboard. |
| `findings-registry.json` | Reducer-generated findings registry. |
| `iterations/` | Per-iteration narratives `001-020` (agent read-only analysis output). |
| `deltas/` | Per-iteration JSONL deltas `001-020`. |
| `prompts/` | Dispatched prompt + stdout(`.out`)/stderr(`.err`) artifacts per iteration. |
| `integration/` | Follow-on 5-iteration study (`001-005`): how to integrate this proposal + its impact on existing skills/commands/agents/hooks, with UX + automation as top priorities. See `integration/research.md` + `integration/integration-plan.md`. |

## Method

Orchestrator-driven **parallel fan-out**: each iteration dispatches a fresh READ-ONLY `cli-opencode` `openai/gpt-5.5-fast --variant high` agent scoped to one narrow angle of MemClaw. Executors analyze only — the orchestrator writes every artifact (sidesteps the project Gate-3 executor-write block; compaction-safe; honors the standing parallel-fan-out preference). Width 4 per round; orphans killed between rounds.

## Discipline

MemClaw is **multi-tenant, fleet-scale, Postgres/pgvector, event-driven**. Spec Kit Memory is **single-user, local, file-based (SQLite + vector store)**. Every teaching is judged for transferability under that mismatch — ADOPT / ADAPT / REJECT / DEFER, with risk. Fleet-scale features with no single-user analog are recorded as negative knowledge, not adopted. MemClaw is Apache-2.0; teachings are design inspiration only (no code copying).
