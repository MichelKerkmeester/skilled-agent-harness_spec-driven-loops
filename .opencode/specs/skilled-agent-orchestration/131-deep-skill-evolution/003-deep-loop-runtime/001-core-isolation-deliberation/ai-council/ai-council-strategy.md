---
title: "AI Council Strategy: Deep-Loop Core Script Isolation"
description: "Round 001 charter — 4-seat deliberation evaluating whether to relocate 18 production files from system-spec-kit/mcp_server/ into owning deep-* skill folders."
trigger_phrases:
  - "deep-loop isolation council strategy"
  - "117 round-001 charter"
importance_tier: "important"
contextType: "decision"
---

# AI Council Strategy — Round 001

## Topic

Deep-review and deep-research skills depend on 18 production files inside `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` and `mcp_server/handlers/coverage-graph/`. Dependency survey confirms 100% deep-* consumption with zero non-deep callers. No prior ADR justifies the placement. Should those files relocate into the owning deep-* skill folders?

## Convergence Rule

**2-of-3 across advocate seats A/B/C** + adjudicator (Seat D) synthesis. If A/B/C unanimous, D records consensus. If 2-of-3, D applies majority. If 3-way split, D reasons independently and notes "no convergence among advocates."

## Seats (single CLI per round per sk-ai-council §0)

All seats use `cli-codex gpt-5.5 -c service_tier=fast` (ONE CLI). Reasoning-effort varies for diversity.

| Seat | Lens | Reasoning | Mandate |
|------|------|-----------|---------|
| **A — Isolation Architect** | Architectural purity | xhigh | Argue FOR full relocation. Frame around encapsulation, ownership clarity, independent skill lifecycle, easier external contributions to deep-* without spec-kit landlord overhead. |
| **B — Status-Quo Defender** | Pragmatic stability | xhigh | Argue AGAINST relocation. Frame around MCP tool ID stability, shared SQLite DB lifecycle, test infrastructure colocation, PR churn cost, operator muscle memory. |
| **C — Pragmatist** | Middle-ground engineering | high (reasoning diversity) | Argue FOR SPLIT. Keep MCP handler registration + DB schema in spec-kit (they're MCP server-bound); relocate pure lib helpers (executor-config, prompt-pack, post-dispatch-validate, etc.) into deep-* skills. Contract-first split. |
| **D — Adjudicator** | Independent synthesis | xhigh | Read A/B/C as quoted blocks. Apply 2-of-3 rule. Issue final recommendation with risk register. Does NOT advocate. |

## Input Evidence — Dependency Map (shared by all 4 seats)

### Currently in `system-spec-kit/mcp_server/` (the suspected misplacement)

**A. `lib/deep-loop/` — 10 files (executor + state + scoring)**
- `executor-config.ts` — schema + parsing for per-iteration executor settings
- `executor-audit.ts` — appends `executor` block to iteration JSONL records (non-native executor provenance)
- `prompt-pack.ts` — renders the iteration prompt template
- `post-dispatch-validate.ts` — validates iteration outputs (markdown + JSONL + delta)
- `atomic-state.ts` — atomic state log writes
- `jsonl-repair.ts` — recovers corrupt JSONL state lines
- `loop-lock.ts` — single-writer locking
- `permissions-gate.ts` — permission scope checks
- `bayesian-scorer.ts` — convergence scoring
- `fallback-router.ts` — executor fallback decision matrix

**B. `handlers/coverage-graph/` — 5 files (MCP tool registration)**
- `convergence.ts` — graph convergence handler (called by both deep-review + deep-research YAML)
- `upsert.ts` — graph event upsert handler
- `query.ts` — graph query handler
- `status.ts` — graph readiness handler
- `index.ts` — MCP tool registration (exposes `mcp__mk_spec_memory__deep_loop_graph_*` tools)

**C. `lib/coverage-graph/` — 3 files (SQLite schema + signal extraction)**
- `coverage-graph-db.ts` — SQLite schema + allow-list (just extended in 116/007)
- `coverage-graph-query.ts` — query builders
- `coverage-graph-signals.ts` — convergence signal extraction

**Consumer summary**: 100% deep-* (zero non-deep callers in handlers or lib code; verified by grep)

### Already isolated inside deep-* skills (justifiably owned)

- `deep-review/scripts/reduce-state.cjs` — state reducer (the 116 arc added searchDebt fields)
- `deep-review/assets/` — config + strategy + prompt templates + review contract YAML
- `deep-review/references/` — protocol documentation (state_format.md, convergence.md, loop_protocol.md)
- Same shape for `deep-research/` mirror

### Shared utilities (justifiably stay, ambiguous ownership)

- `system-spec-kit/shared/review-research-paths.cjs` — `resolveArtifactRoot()` used by both deep-* reducers
- `system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` — resource-map emission helper used by both reducers

### Call sites in workflow YAML (the "consumer surfaces" arguing for relocation)

From `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`:
- Line ~118: `resolveArtifactRoot()` (shared utility)
- Line ~418, ~461: `mcp__mk_spec_memory__deep_loop_graph_convergence` (MCP tool — handler in spec-kit)
- Line ~656, ~672, ~692: executor-config / prompt-pack / executor-audit module loads
- Line ~898: post-dispatch-validate output schema check
- Line ~1015: `mcp__mk_spec_memory__deep_loop_graph_upsert` (MCP tool)

From `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`: mirror pattern at lines ~413, ~543, ~554, ~572, ~589, ~590, ~635, ~636, ~681, ~869.

## Constraints (binding on all seats)

1. **MCP tool ID stability**: `mcp__mk_spec_memory__deep_loop_graph_*` is documented as stable per CLAUDE.md §1. Any relocation MUST preserve tool IDs (handler registration moves but tool name stays).
2. **Shared SQLite DB**: coverage-graph data lives in `deep-loop-graph.sqlite`. If the schema-owner code moves, the DB connection lifecycle MUST stay coherent.
3. **Test infrastructure**: vitest tests for these surfaces live under `mcp_server/tests/deep-loop/`. If files move, tests move (or import paths update).
4. **Planning only**: this packet does NOT execute moves. The output is an ADR + (if applicable) a migration outline for a follow-on packet.

## Output Contract per seat

Each seat writes to `ai-council/seats/round-001/seat-<NNN>-<role>.md` with:

```markdown
---
round: 1
seat: <NNN>
executor: cli-codex
lens: <role>
model: gpt-5.5
reasoning: <xhigh|high>
status: complete
timestamp: <ISO-8601>
---

# Seat <NNN> — <role>

## Position
<one-paragraph thesis>

## Argument
<3-5 paragraphs of reasoning anchored to the dependency map>

## Risks of the opposing positions
<what the opposing seats might say and why this seat's framing is stronger>

## Migration outline (if recommendation is ISOLATE or SPLIT)
<file-by-file move map preserving MCP tool IDs; otherwise "N/A — KEEP">

---

Recommendation: ISOLATE | KEEP | SPLIT
```

The final-line `Recommendation:` is REQUIRED for the helper parser.

## Schedule

- Seat A dispatched first (Isolation Architect, xhigh) — ~10-15 min
- Seat B (Status-Quo Defender, xhigh) — ~10-15 min
- Seat C (Pragmatist, high) — ~8-12 min
- Seat D (Adjudicator, xhigh, with A/B/C as quoted input) — ~10-15 min

Total wall-clock: ~50-60 min. Sequential dispatches with kill-between per memory rule.
