# 027 Research Phase Index

This folder is organized by research phase. Each numbered folder contains the iteration artifacts, JSONL deltas, prompts, and synthesis files for one research pass over the 027 XCE-derived Spec Kit refinement packet.

## Phase Map

| Phase | Folder | Iterations | Purpose | Primary Outputs |
|---|---|---:|---|---|
| 001 | `001-xce-adoption-matrix/` | 001-010 | Initial XCE feature triage and adoption matrix. | `sub-packet-proposals.md`, `iterations/`, `deltas/`, `prompts/` |
| 002 | `002-implementation-risk-cross-validation/` | 011-020 | Cross-validate candidate implementation packets and record risk amendments. | `findings.md`, `sub-packet-amendments.md`, `iterations/`, `deltas/`, `prompts/` |
| 003 | `003-memory-causal-expansion/` | 021-039 | Explore memory-backend, causal-graph, trigger, and feedback-reducer teachings beyond the original code-graph scope. | `iterations/`, `deltas/`, `prompts/` |
| 004 | `004-continuation-revalidation/` | 040-060 | Revalidate 027 against local spec-kit reality, root/path drift, and deep-research workflow hygiene. | `iterations/`, `deltas/` |
| 005 | `005-live-rescope-coco-purge/` | 061-080 | Current canonical Continuation 22 synthesis against closed 026, CocoIndex deprecation, and live system-spec-kit state. | `research.md`, `deep-research-*`, `findings-registry.json`, `resource-map.md`, `iterations/`, `deltas/`, `prompts/` |
| 006 | `006-peck-source-deep-mining/` | 001-018 | Mine peck-master's actual SOURCE (agent prompts, CLI commands, reflect skill, revim benchmark harness) for net-new adoptable mechanisms beyond T1-T4, and re-evaluate the deferred T1 coverage gate. Folder-scoped: 001-013 discovery (gpt-5.5-fast) + 014-018 cross-model verify (MiniMax-M3). | `research.md`, `sub-packet-proposal.md`, `deep-research-*`, `iterations/`, `deltas/`, `prompts/` |
| 008 | `008-caura-memclaw-fleet-memory-teachings/` | 001-020 | Mine the vendored `external/caura-memclaw-main` (MemClaw fleet-memory system) for teachings transferable to the local Spec Kit Memory system; sub-packet proposal for 027. | `research.md`, `sub-packet-proposals.md`, `deep-research-*`, `findings-registry.json`, `iterations/`, `deltas/`, `prompts/` |
| 010 | `010-openltm-memory-architecture-teachings/` | 001-010 | Mine the vendored `external/OpenLtm-main` (OpenLTM — open-source single-user LTM plugin; Bun/TS/SQLite/FTS5) for memory-architecture teachings transferable to the local system-spec-kit Memory system; what it does differently + what to copy. gpt-5.5-fast xhigh, orchestrator-writes parallel fan-out. | `research.md`, `sub-packet-proposals.md`, `deep-research-*`, `findings-registry.json`, `iterations/`, `deltas/`, `prompts/` |

> **Numbering:** research-folder `007` and `009+` are unused; folder `008` is operator-chosen. Phases **006 and 008 are separate packets with their own folder-scoped iteration sequences** (`006` = `001-018`: 001-013 discovery + 014-018 cross-model; `008` = `001-020`) — the modern convention. The older phases 001-005 used a single global iteration sequence (`001-080`). Treat iteration numbers as **folder-scoped** going forward.

## Current Canonical Synthesis

- **Memory re-plan (phases 002-008):** use `005-live-rescope-coco-purge/research.md` — the latest planning verdict; supersedes earlier XCE-adoption framing for 027 planning purposes.
- **Verification discipline + T1 (proposed new children 001):** use `006-peck-source-deep-mining/research.md` + `006-peck-source-deep-mining/sub-packet-proposal.md` — a distinct peck-source axis, orthogonal to (and non-conflicting with) the memory re-plan.
- **caura-memclaw memory hardening (proposed new child 010 + amendments to 002-008):** findings + proposal in `008-caura-memclaw-fleet-memory-teachings/{research.md, sub-packet-proposals.md}`; **integration + impact study** (how to integrate it; impact on skills/commands/agents/hooks; UX + automation first) in `008-caura-memclaw-fleet-memory-teachings/integration/{research.md, integration-plan.md}`. Mostly validates/sharpens the memory re-plan and reframes 008 (defer active reducers; most substrate already exists). Numbered 010 to avoid collision with peck (001) + gem-team (009).
- **OpenLTM memory-architecture teachings (research phase 010, 15 iterations):** findings + proposals in `010-openltm-memory-architecture-teachings/{research.md, sub-packet-proposals.md}`. Verdict: OpenLTM is weaker at retrieval/decay (our fused search + FSRS supersede its FTS-primary recall + fixed half-lives). **Iters 011-015 re-tiered everything under the key architectural fact that we are spec-documentation-based while OpenLTM is row-based** (its DB is the truth; ours is a derived index): the write-side row mechanics (`learn/reinforce`, per-row provenance/audit, row dedup) are **ROW-COUPLED → REJECT** for us. Surviving high-fit adoptions: **pre-index secret redaction** (amend `002-memory-write-safety`), **per-doc content-fingerprint indexing + FTS-trigger sync**, doc-anchor-keyed retrieval observability, continuity/session resilience (restore panel + authored-continuity PreCompact snapshot), and opt-in capture reshaped to suggest **handover/continuity doc-patches** (never silent memory rows). See `research.md` §8.

## Future Research Runs

Create the next run as a new numbered folder (research-folder `011+` is free; `006`, `008`, `010` are taken) instead of returning to a flat root-level `iterations/`, `deltas/`, or `prompts/` layout. When runs may execute concurrently, treat iteration numbers as **folder-scoped** (do not assume a single global sequence) to avoid cross-run renumber churn.
