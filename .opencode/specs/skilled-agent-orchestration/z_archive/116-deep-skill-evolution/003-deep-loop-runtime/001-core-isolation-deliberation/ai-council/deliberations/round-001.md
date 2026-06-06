---
round: 1
topic: "Deep-Loop Core Script Isolation"
spec_folder: "skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation"
executor: "cli-codex"
model: "gpt-5.5"
seats: 4
convergence: "3-way-split-no-advocate-majority"
ruling: "SPLIT"
ruling_source: "Seat D — Adjudicator (independent)"
override_advocate_majority: false
timestamp: "2026-05-22T17:10:00Z"
---

# Round 001 — Deliberation Synthesis

## Composition

| Seat | Lens | Reasoning | Recommendation | Confidence |
|------|------|-----------|----------------|------------|
| A | Isolation Architect | cli-codex gpt-5.5 xhigh | ISOLATE | 94/100 |
| B | Status-Quo Defender | cli-codex gpt-5.5 xhigh | KEEP | 88/100 |
| C | Pragmatist | cli-codex gpt-5.5 high | SPLIT | 91/100 |
| D | Adjudicator | cli-codex gpt-5.5 xhigh | SPLIT (independent) | 92/100 |

## Convergence Application

Per sk-ai-council 2-of-3 rule across advocates (A/B/C): **no majority** — 3-way split (ISOLATE / KEEP / SPLIT). Adjudicator (Seat D) reasoned independently and ruled **SPLIT**. No `OVERRIDE` flag applies because there was no majority to override.

Seat D's independent reasoning aligns with Seat C's position but was reached through Seat D's own audit, not by following C. Seat D's framing was: "MCP-bound vs pure-runtime is a sharper seam than deep-specific vs spec-kit-specific."

## Comparison

| Dimension | A (ISOLATE) | B (KEEP) | C (SPLIT) | D (Adjudicator) |
|-----------|-------------|----------|-----------|-----------------|
| MCP handler placement | Move to deep-* | Keep in mcp_server | Keep in mcp_server | **Keep in mcp_server** |
| `coverage-graph-db.ts` (DB lifecycle) | Move | Keep | Keep | **Keep** |
| `lib/deep-loop/*.ts` (10 files) | Move | Keep | Move to deep-* | **Move to deep-loop-runtime/** |
| `lib/coverage-graph/{query,signals}.ts` | Move | Keep | Move | **Move to deep-loop-runtime/** |
| MCP tool IDs | Preserve | N/A (no move) | Preserve | **Preserve (binding)** |
| New skill needed | Yes (deep-loop-runtime or per-skill) | No | Maybe (Option C1) | **Yes — deep-loop-runtime as peer skill** |
| Test colocation | Move with files | Keep | Split | **Split by responsibility** |

## Agreements (across all 4 seats)

1. **Files are 100% deep-* consumed**: no non-deep callers anywhere. Factual baseline shared by all.
2. **MCP tool ID stability is non-negotiable**: `mcp__mk_spec_memory__deep_loop_graph_*` names must NOT change. Any migration outline that proposes renaming is invalid.
3. **DB lifecycle coherence**: `deep-loop-graph.sqlite` has a single owner (the MCP server). Whoever owns the schema must own the connection lifecycle.
4. **No false ownership**: if anything moves, the destination must NOT be `deep-review` (which would create a false owner over code that `deep-research` also uses). Either keep in `system-spec-kit/mcp_server/` OR create a neutral `deep-loop-runtime/` peer skill.
5. **Partial moves done wrong are worse than no move**: the boundary matters more than the count of files moved.

## Disagreements

| Disagreement | A | B | C/D |
|--------------|---|---|------|
| Are MCP handlers "deep-* internals" or "MCP server infrastructure"? | Deep-* internals | MCP server infrastructure | MCP server infrastructure |
| Is the DB lifecycle binding strong enough to keep schema-owner code? | No — can move with adapter | Yes — schema and lifecycle inseparable | Yes — schema with lifecycle owner |
| Is partial relocation actually worse than full? | Yes — leaves inverted half | No — depends on boundary | No — boundary justifies the split |
| Is the cost (PR churn, test rewrites) worth the architectural cleanup? | Yes — clarity wins | No — cost > benefit, doc instead | Partial — cost worth it for pure libs only |

## Critique Across Seats

**Seat A's blind spot**: Treats coverage-graph handlers and `coverage-graph-db.ts` as movable on the same basis as the pure libs. Seat D identifies this as misreading the ownership signal — MCP-tool-registration and SQLite-connection-lifecycle are stronger ownership signals than caller count.

**Seat B's blind spot**: Uses the MCP-server-binding argument too broadly. The argument is correct for handlers + DB, but incorrectly extends to the pure runtime libraries that have no MCP host binding. Seat D scopes B's framing to where it actually applies.

**Seat C's blind spot**: Acknowledged but narrow — introduces a new inter-skill dependency (deep-loop-runtime), which means import-hygiene discipline. Seat D accepted this as easier to test than full relocation's wider impact surface.

## Convergence Decision

**Ruling: SPLIT** (Seat D, independent reasoning, confidence 92/100).

This packet captures the ruling. The actual file moves are deferred to a **follow-on implementation packet** (target: `skilled-agent-orchestration/118-deep-loop-runtime-extraction` or similar), which inherits the migration outline from Seat D and the test-split policy.

## Convergence Quality

- 3-way advocate split + adjudicator decision is a HIGHER-confidence outcome than 3-of-3 unanimous would have been on this question. Each lens stress-tested the others. The ruling earned its position rather than inheriting it.
- All seats produced cited reasoning anchored to specific files. No seat hallucinated paths or invented constraints.
- The MCP tool ID stability constraint was honored by every seat's migration outline (A, C, D) or rendered moot (B).
