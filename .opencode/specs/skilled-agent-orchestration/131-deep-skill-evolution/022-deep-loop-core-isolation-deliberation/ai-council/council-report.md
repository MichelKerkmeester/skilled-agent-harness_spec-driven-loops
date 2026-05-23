---
title: "AI Council Report: Deep-Loop Core Script Isolation (Round 001)"
description: "Final synthesized council report — SPLIT ruling — 4-seat cli-codex gpt-5.5 deliberation."
topic: "Should deep-loop / coverage-graph runtime files relocate from system-spec-kit/mcp_server/ into the owning deep-* skill folders?"
spec_folder: "skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation"
rounds: 1
council_complete: true
final_ruling: "SPLIT"
ruling_source: "Seat D — Adjudicator (independent)"
plan_confidence: 92
timestamp: "2026-05-22T17:10:00Z"
---

# AI Council Report — Round 001 — Deep-Loop Core Script Isolation

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|---------------|-------------------|------------------|------------|
| seat-001 (A) | Isolation Architect | cli-codex gpt-5.5 xhigh | Advocate for full relocation | 94 |
| seat-002 (B) | Status-Quo Defender | cli-codex gpt-5.5 xhigh | Advocate for current placement | 88 |
| seat-003 (C) | Pragmatist | cli-codex gpt-5.5 high | Advocate for MCP-binding split | 91 |
| seat-004 (D) | Adjudicator | cli-codex gpt-5.5 xhigh | Synthesize + independent ruling | 92 |

### Seat 001 — Isolation Architect / cli-codex

Recommendation: ISOLATE. Argues that the current placement is an ownership inversion: deep-* skills consume 18 production files inside `system-spec-kit/mcp_server/` with no non-deep callers, and the placement is accumulated drift unjustified by any ADR. Proposes a peer `deep-loop-runtime/` skill that hosts the relocated code while preserving MCP tool IDs and DB lifecycle through adapters. Confidence 94/100.

### Seat 002 — Status-Quo Defender / cli-codex

Recommendation: KEEP. Argues that MCP-tool-registering code conventionally lives in the MCP server's source tree (mirroring other handler families like `mcp_server/handlers/memory/`, `mcp_server/handlers/skill/`); that the SQLite connection lifecycle requires the schema-owner code to stay with the connection manager; that the test colocation under `mcp_server/tests/` makes splitting source and tests across packages awkward; and that the documentation alternative (ADR + CLAUDE.md note explaining the cross-skill dependency) achieves the goal without irreversible churn. Confidence 88/100.

### Seat 003 — Pragmatist / cli-codex

Recommendation: SPLIT. Argues that the binary ISOLATE/KEEP framing misses the actual seam, which is MCP-bound vs pure-runtime. MCP-handler files and the DB-schema owner stay in `system-spec-kit/mcp_server/` (they have a real binding to the server); pure runtime libraries (executor-config, prompt-pack, post-dispatch-validate, etc.) and graph interpretation helpers (query, signals) move to a neutral `deep-loop-runtime/` skill that both deep-review and deep-research import from. Confidence 91/100.

### Seat 004 — Adjudicator / cli-codex

Recommendation: SPLIT (independent reasoning, not majority-following — no 2-of-3 majority existed). Seat D's framing: the decisive distinction is MCP-bound vs pure-runtime, not deep-specific vs spec-kit-specific. The strongest single argument across all three advocates was the DB lifecycle point paired with MCP tool ownership: stable public tool IDs and the single SQLite connection owner are hard contracts; physical placement of pure libraries is an internal organization choice. Confidence 92/100.

## Task Classification

Architectural decision (planning-only). Output: ADR + migration outline for a follow-on implementation packet. No code changes in this packet.

## Strategy Comparison

See `deliberations/round-001.md` §Comparison table for per-dimension side-by-side. All seats agree on:
- 100% deep-* consumption is factual
- MCP tool IDs must stay stable (non-negotiable)
- DB lifecycle has a single owner
- Either keep everything or move only to a neutral peer skill (not into `deep-review` directly)

## Deliberation Notes

Seat D's adjudication identified a "hidden agreement" axis: all seats actually agreed on (1) the factual baseline, (2) MCP tool ID preservation, (3) DB lifecycle coherence, (4) the no-false-ownership constraint. Where they disagreed was on the *boundary* — A drew the boundary at "deep-* consumption", B drew it at "current location", and C drew it at "MCP server binding". Seat D ruled that C's boundary is the sharpest because it matches actual ownership signals rather than caller demographics.

The 3-way advocate split + adjudicator decision is a HIGHER-confidence outcome than 3-of-3 unanimous would have been; each lens stress-tested the others.

## Winning Strategy

SPLIT along the MCP-binding boundary, executed via a new `deep-loop-runtime/` peer skill.

## Recommended Plan

1. **This packet** (117) captures the ruling. No code changes here.
2. **Follow-on implementation packet** (target: `skilled-agent-orchestration/118-deep-loop-runtime-extraction/`):
   - Create `.opencode/skills/deep-loop-runtime/` with `SKILL.md` declaring scope
   - Move 10 `lib/deep-loop/*.ts` files → `deep-loop-runtime/lib/deep-loop/`
   - Move `coverage-graph-query.ts` + `coverage-graph-signals.ts` → `deep-loop-runtime/lib/coverage-graph/`
   - KEEP `coverage-graph-db.ts` + all 5 `handlers/coverage-graph/*.ts` + tool registration files in `system-spec-kit/mcp_server/`
   - Update 4 workflow YAML files with new import paths
   - Split tests by ownership (runtime tests → deep-loop-runtime; MCP/DB tests → system-spec-kit)
   - Verification gates: MCP tool registration unchanged, SQLite lifecycle intact, full vitest passes
3. **Constraints honored by the implementation**:
   - `mcp__mk_spec_memory__deep_loop_graph_*` tool IDs preserved verbatim
   - DB connection lifecycle stays in MCP server
   - No file moves outside the Seat D migration outline

## Implementation Steps

(In the follow-on packet, not this one.)

1. Scaffold `deep-loop-runtime/` skill with SKILL.md + lib/ + tests/
2. Git-mv files per Seat D's migration outline (preserves history)
3. Update imports in YAML + remaining source
4. Run full vitest suite — verify zero regressions
5. Verify `mcp tools list` shows all 4 `deep_loop_graph_*` tools registered with unchanged IDs

## Prerequisites

This packet's ADR (`decision-record.md` ADR-001) lands first; the follow-on implementation packet cites it.

## Cross-References

- `decision-record.md` — ADR-001 capturing the SPLIT ruling
- `ai-council/seats/round-001/seat-A-isolation-architect.md` — full ISOLATE argument
- `ai-council/seats/round-001/seat-B-status-quo-defender.md` — full KEEP argument
- `ai-council/seats/round-001/seat-C-pragmatist.md` — full SPLIT argument (advocate)
- `ai-council/seats/round-001/seat-D-adjudicator.md` — full adjudication + migration outline + risk register
- `ai-council/deliberations/round-001.md` — round synthesis
- `ai-council/ai-council-strategy.md` — round charter + dependency map

## Dropped Alternatives

- **ISOLATE (Seat A)**: dropped. Strongest weakness: groups MCP-handler files and the DB-schema owner with the pure runtime libs. MCP tool dispatch and server-managed SQLite lifecycle are stronger ownership signals than caller count.
- **KEEP (Seat B)**: dropped. Strongest weakness: uses the legitimate server-binding argument to defend the pure runtime libraries as well; those files don't need the MCP host to own them.

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| MCP tool ID stability | Critical | Tool registration files (`tools/index.ts`, `tool-schemas.ts`) stay in `system-spec-kit/mcp_server/`; regression test asserts all 4 tool IDs register unchanged |
| DB lifecycle coherence | High | `coverage-graph-db.ts` stays with the server-owned SQLite lifecycle |
| PR churn / merge conflicts | Medium | Move files in one scoped follow-on packet; mechanical YAML import updates; reviewable file map |
| Future cross-consumer use cases | Medium | `deep-loop-runtime/SKILL.md` declares shared infrastructure scope explicitly |
| Reversibility | Medium | SPLIT is more reversible than ISOLATE — server-bound files stable, moved files can be re-exported or moved again without changing public IDs |
| Test coverage gaps | High | Split tests by responsibility — runtime unit tests with `deep-loop-runtime`, MCP/handler/DB lifecycle tests with `system-spec-kit` |

## Planning-Only Boundary

This packet does NOT move any file. Execution = follow-on packet. The ruling captured here is the authority that follow-on packet cites.

## Plan Confidence

**92/100**. The file responsibilities divide cleanly enough to act. SPLIT preserves the two hardest constraints (stable MCP tool IDs + single DB lifecycle owner). Lower than 100 because: (a) introducing a new peer skill (`deep-loop-runtime`) adds one ownership layer to the repo; (b) import-hygiene discipline is required at the new boundary; (c) the implementation packet might surface secondary refactor needs (e.g. import-path adapters) that this packet didn't anticipate.
