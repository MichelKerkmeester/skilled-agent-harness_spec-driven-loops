# Deep-Research Iteration 9 — K2.5 final recommendation matrix + cross-axis synthesis prep

## BINDING CONTRACT (pre-answered)

- **Gate 3**: **A) Use existing** = `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/`. Do NOT ask.
- **Skill routing**: Do NOT invoke other skills. You ARE the iteration.
- **Sub-agent dispatch**: FORBIDDEN. LEAF.
- **Mode**: Execute directly.

## STATE

Iteration: 9 of 10
Answered: K2.4, K1.1, K1.2, K1.3, K1.4, K1.5, K1.6, K2.1, K2.2, K2.3 (10/11)
Remaining: **K2.5** (this iter — final recommendation) — THIS IS THE LAST QUESTION
Stuck: 0

After this iteration we expect convergence. Iter-10 is reserved for cross-axis synthesis if needed.

## CRITICAL CONTEXT FROM ITER-8

- Recommended path: rename server `spec_kit_memory` → `mk-memory` (hyphen, NOT underscore).
- Keep all 59 raw tool names unchanged.
- Avoids Gemini policy-parser underscore ambiguity.

## FOCUS

**K2.5 — Final naming recommendation matrix, given chars-saved × migration-churn × runtime-risk trade-off.**

This iteration produces a definitive recommendation table AND a cross-axis cohesion summary (which Track-1 ports compose well together → proposed downstream implementation packets).

## REQUIRED OUTPUTS

### Part A — Final Naming Recommendation Matrix (closes K2.5)

| Option | Server | Tools | Net char delta per tool (vs current `mcp__mk_spec_memory__memory_context`) | Migration callsites affected | Gemini compat | Risk level | Recommended? |
|--------|--------|-------|------------------------------------------------------------------------------|-------------------------------|----------------|------------|--------------|
| Status quo | `spec_kit_memory` | unchanged | 0 | 0 | AMBIGUOUS | LOW (no-op) | — |
| Recommendation A: server-only rename | `mk-memory` | unchanged | -6 | 166 (per K2.4) | OK | LOW | **YES** |
| Option B: server + drop memory_ prefix | `mk-memory` | `memory_*` → bare names | -13 to -19 | 166 + ~120 tool refs | OK | MEDIUM | Defer |
| Option C: bare `mk` server | `mk` | unchanged | -13 | 166 | OK but generic | MEDIUM | No (collides if mk_code later) |
| Option D: split into multiple servers | `mk-memory`, `mk-code-graph`, `mk-skill-graph`, etc. | drop family prefixes | varies | 166 + 200+ | OK | HIGH | No (over-engineering for now) |

**Final K2.5 recommendation**: confirm Option A (server-only rename `spec_kit_memory` → `mk-memory`) is the right starting move. Note Option B as a possible follow-on once Option A migration is proven.

### Part B — Cross-Axis Cohesion Summary (synthesis prep)

For each Track-1 port axis (K1.1–K1.6), list:
- **Composes with**: which other axes this axis depends on or enables.
- **Suggested implementation packet**: a downstream packet that bundles this axis + composing axes.
- **ROI × effort score**: subjective ranking for synthesis prioritization.

Expected proposed downstream packets (roughly):
1. **028 — Memoization + dependency-DAG indexing foundation** (K1.1, K1.4 chunk fingerprints) — HIGH ROI, MEDIUM effort. Establishes the memo substrate + chunked embeddings.
2. **029 — Causal-graph lifecycle (tombstones + sweep)** (K1.2) — MEDIUM ROI, LOW effort. Self-contained.
3. **030 — Statediff reconciliation layer** (K1.3) — MEDIUM ROI, HIGH effort. Touches many handlers.
4. **031 — Auto causal-edge derivation (deterministic Phase 1)** (K1.5 Phase 1 only — frontmatter promoter, no LLM) — HIGH ROI, LOW effort. Defer LLM-based Phase 2.
5. **032 — MCP namespace rename (`spec_kit_memory` → `mk-memory`)** (K2.x) — LOW effort, HIGH visibility/UX impact, 166-callsite migration.

For each, list:
- Primary files affected (3-5 paths).
- Estimated LOC (rough).
- Dependencies (which packets must ship first).
- Test impact (any existing tests likely to break).

### Part C — Convergence Signal

Append the canonical iteration record with `newInfoRatio` that REFLECTS CONVERGENCE. If most findings in this iteration recap prior axes (low new info), set ratio in 0.15–0.30 range so the 3-signal vote can fire STOP for iter-10.

## CONSTRAINTS

- LEAF. Max 12 tool calls (mostly NO new file reads — this is synthesis prep, work from prior iterations).
- Cite back to iter-001..008 findings where appropriate.
- No special regex chars in JSONL `focus`.

## OUTPUT CONTRACT

1. `research/iterations/iteration-009.md` — Focus, Actions Taken, Part A (Final Recommendation Matrix), Part B (Cross-Axis Cohesion + Proposed Packets), Part C (Convergence Signal), Verdict on K2.5, Questions Answered, Questions Remaining, Next Focus (synthesis or stop).

2. JSONL appended `{"type":"iteration","iteration":9,...,"focus":"k2-5-final-recommendation-and-synthesis-prep","newInfoRatio":<0.15-0.30 for convergence signal>,"answeredQuestions":["K2.5"]}`.

3. `research/deltas/iter-009.jsonl`.

Stop: 10 min wall, ≤12 tool calls.

Go.
