DEEP-RESEARCH

# Deep-Research Iteration 2 — 016 Coverage and Hygiene Audit

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: ~6 of 24 partial answers (Q1-Q6 partially answered for arc 008; Q13-Q19 partially answered for arc 008; Q20-Q24 partially answered for arc 008)
Last 2 ratios: 0.72 -> N/A | Stuck count: 0
Resource map: not present; skipping coverage gate.
Last focus: arc 008-rerank-sidecar (parent + 006 + 007). 8 findings emitted (MISSED×2, UNSHIPPED×2, BUGGED×4).
Next focus: arc 008/001-005 (the launcher/cross-encoder side) + spec-memory rerank wiring in `.opencode/skills/system-spec-kit/mcp_server/src/handlers/`. Verify HOLD-path packets 004/005 are consistent with current code defaults and search-flags routing.

Research Topic: Coverage and hygiene audit across 016-embedder-testing-and-architecture umbrella (arcs 001-008, all phase children). Surface UNSHIPPED, DEAD, BUGGED, MISSED findings with file/line evidence.

Iteration: 2 of 10

Focus Area: BUGGED-A + UNSHIPPED-B — arc 008/001-005 (the pre-006 launcher and cross-encoder + HOLD-path benchmark) plus spec-memory rerank wiring.

## STATE FILES

All paths are relative to the repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/findings-registry.json
- Prior iteration outputs: research/iterations/iteration-001.md, research/deltas/iter-001.jsonl
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deltas/iter-002.jsonl

## RESEARCH FRAMING

(unchanged from iter 1 - 4 categories: UNSHIPPED, DEAD, BUGGED, MISSED)

1. **UNSHIPPED** — spec docs / commits CLAIM work was done, code does not actually do it.
2. **DEAD** — unreachable/unused code, env vars, config fields, doc references.
3. **BUGGED** — logic errors or contract drift behind plausible-looking code (Config defaults differ from helper defaults; allowlist gates check wrong consumer's flag; HTTP fields one side sends another ignores; comments contradict code below them).
4. **MISSED** — Open Questions never answered; risks without implemented mitigation; "follow-on packet" promises with no follow-on; deferred P2 advisories that regressed.

## ITERATION 2 SPECIFIC FOCUS

Avoid the surface iter 1 already covered (008/006 + 008/007 + commit 9349f5f4a). Pivot to the EARLIER arc 008 packets that pre-date the sidecar dedup:

1. `008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder/` — verify the flag-routing fix is still in current code at `.opencode/skills/system-spec-kit/mcp_server/src/handlers/search/` AND `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` and `search-flags.ts`. Did 9349f5f4a regress it?
2. `008-rerank-sidecar-arc/002-system-rerank-sidecar-skill/` — verify SKILL.md + scripts + start.sh + README still match the live sidecar. Look for orphaned env var references and obsolete launcher commands.
3. `008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers/` — verify the `ensure_rerank_sidecar.py` exists, has callers, and the wiring still fires. cli-codex iter 1 found the `_ensure_rerank_sidecar_for_mcp` allowlist fix landed — confirm 003's broader launcher integration is still wired (skill-advisor + code-index launchers).
4. `008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/` — HOLD path. Verify the benchmark report still matches what's on disk; verify the HOLD decision is reflected in current `cross-encoder.ts` defaults.
5. `008-rerank-sidecar-arc/005-promote-qwen-as-default/` — HOLD path (eventually unwound by 006). Verify what survived. Are there stale Qwen-promotion references in spec-memory mcp_server code?
6. Spot-check spec-memory rerank handler at `.opencode/skills/system-spec-kit/mcp_server/src/handlers/memory_search.ts` and friends — does rerank still route through cross-encoder.ts + local-reranker.ts + the HTTP sidecar in the correct fallback order?

**Code surfaces to probe:**
- `.opencode/skills/system-rerank-sidecar/scripts/` (cli.py, rerank_sidecar.py, ensure_rerank_sidecar.py, start.sh)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/src/handlers/memory_search.ts` (or wherever memory search rerank dispatches)
- `.opencode/skills/mcp-coco-index/mcp_server/` (cocoindex side after dedup)

**Grep recipes to use (from repo root):**
- `rg -n 'ensure_rerank_sidecar' --type ts --type py` — caller count
- `rg -n 'use-model.sh|USE_MODEL' --type sh --type py --type ts` — verify the model swapper is wired
- `rg -n 'RERANK_SIDECAR_PORT|RERANK_SIDECAR_URL|RERANK_SIDECAR_HOST' --type ts --type py --type sh` — env var consumer count
- `rg -n 'cross-encoder/ms-marco|Qwen3-Reranker' --type ts --type py --type md` — find stale model name pins
- `rg -n 'local-reranker|LocalReranker' --type ts` — verify the local fallback still exists
- `git log --oneline --no-merges -- .opencode/skills/system-spec-kit/mcp_server/lib/search/` — search lib commit history

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 6-10 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Do NOT re-emit findings already in `research/deltas/iter-001.jsonl`. If you see the same issue, add `seenInIter: 1` rather than re-creating.
- Do NOT implement fixes. Report findings only.
- Read-only against source code. Writes confined to `<target>/research/`.
- When emitting the iteration JSONL record, include an optional `graphEvents` array.
- Mark uncertain findings as `SUSPECTED` rather than `CONFIRMED`.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/iterations/iteration-002.md`. Structure:
   - `## Focus` (1 paragraph)
   - `## Actions Taken` (numbered list of tool calls + 1-line summary each)
   - `## Findings` (4-column table: `Finding ID | Category | File:line + grep evidence | Recommended action`)
   - `## Questions Answered` (which of Q1-Q24 got partial/full answers this iter)
   - `## Questions Remaining` (open questions)
   - `## Next Focus` (1 paragraph — pivot for iter 3)

2. **Canonical JSONL iteration record** APPENDED to the state log. Use `"type":"iteration"` EXACTLY.

```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"insight|thought|exhausted","focus":"<short string>","graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator:
```bash
echo '{"type":"iteration","iteration":2,...}' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deep-research-state.jsonl
```

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deltas/iter-002.jsonl`. Same shape as iter-001.

All three artifacts are REQUIRED. If you fail to write any of them, the deep-research workflow stalls.

## SCOPE GUARD

- Read-only against source. Any source-code mutation outside `<target>/research/` is an out-of-scope violation.
- Spec folder is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture` (pre-approved). Skip Gate 3.
- Do NOT modify the umbrella's `spec.md`, the arc spec.md files, or any phase-child spec docs. Only `<target>/research/*` is writable.
- Iteration N's prompt MUST output iteration-NNN.md and iter-NNN.jsonl with N=2.
