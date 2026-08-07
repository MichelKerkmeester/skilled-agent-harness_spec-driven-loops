# Research Phase 010: OpenLTM Memory-Architecture Teachings

Deep-research pass mining the vendored `external/OpenLtm-main` (**OpenLTM** — an open-source long-term-memory plugin for AI coding agents; Bun + TypeScript; SQLite WAL + FTS5 BM25 + optional sqlite-vec; pluggable embedding providers; lifecycle hooks; janitor; typed knowledge graph; MIT) for design teachings transferable to the **local, single-user system-spec-kit Memory system** — ending in concrete sub-packet proposals for 027.

> **Numbering note:** Research-folder `010-` (next free after `009-gem-team-integration-impact`). As a separate research packet it owns its own iteration sequence `001-010`.

## The operator's question

*What does OpenLTM do **differently** than us, and what could we **copy / learn from** to improve system-spec-kit memory (or related systems)?* Both are local SQLite-backed single-user memory systems, so the architecture mismatch is small — a teaching only survives if it is a genuine **delta** over our existing FSRS decay, causal edges, trigger matching, and self-maintaining index.

## Contents

| Path | Purpose |
|---|---|
| `research.md` | Final synthesis: per-subsystem OpenLTM-vs-system-spec-kit comparison + ranked transferable teachings + negative knowledge (written at convergence). |
| `sub-packet-proposals.md` | Concrete ADOPT/ADAPT change proposals mapped to system-spec-kit surfaces (and/or a new 027 child). |
| `deep-research-config.json` | Runtime configuration (immutable). |
| `deep-research-state.jsonl` | Append-only lineage state. |
| `deep-research-strategy.md` | Strategy, question tracker, reducer-owned ANCHOR sections. |
| `deep-research-dashboard.md` | Reducer-generated observability dashboard. |
| `findings-registry.json` | Reducer-generated findings registry. |
| `iterations/` | Per-iteration narratives `001-010` (orchestrator-written from read-only executor analysis). |
| `deltas/` | Per-iteration JSONL deltas `001-010`. |
| `prompts/` | Dispatched prompt (`.prompt.md`) + stdout (`.out`) / stderr (`.err`) artifacts per iteration. |

## Method

Orchestrator-driven **parallel fan-out**: each iteration dispatches a fresh READ-ONLY `cli-opencode` `openai/gpt-5.5-fast --variant xhigh` analyst scoped to one narrow OpenLTM subsystem. Executors analyze only — **the orchestrator writes every artifact** (sidesteps the project Gate-3 executor-write block; compaction-safe; honors the standing parallel-fan-out preference). Width 5 per round; narrow per-subsystem scope keeps each dispatch under the xhigh timeout.

## Discipline

OpenLTM and system-spec-kit Memory are both **single-user, local, SQLite-backed**. The mismatch is design, not scale — so each teaching is judged for whether it is genuinely **new or better** than our FSRS decay / causal edges / co-activation / self-maintaining index: ADOPT / ADAPT / REJECT / DEFER, with risk. Where our design already covers or supersedes a mechanism, that is recorded as negative knowledge, not adopted. OpenLTM is MIT; teachings are design inspiration only (no code copying).
