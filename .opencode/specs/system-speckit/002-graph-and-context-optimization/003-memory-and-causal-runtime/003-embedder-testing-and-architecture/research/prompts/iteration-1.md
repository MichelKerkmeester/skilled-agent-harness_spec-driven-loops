DEEP-RESEARCH

# Deep-Research Iteration 1 — 016 Coverage and Hygiene Audit

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/24 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: UNSHIPPED-A — verify 008-rerank-sidecar-arc REQ/SC/D-NNN claims against actual code; specifically 008/006-cocoindex-dedup (just promoted) and 008/007-spec-memory-mps-rerank-promotion (cpu-mps-tuning follow-on); plus multi-model serving commit 9349f5f4a.

Research Topic: Coverage and hygiene audit across 013-embedder-testing-and-architecture umbrella (arcs 001-008, all phase children). Surface UNSHIPPED, DEAD, BUGGED, MISSED findings with file/line evidence.

Iteration: 1 of 10

Focus Area: UNSHIPPED-A — verify the just-promoted arc 008 (rerank-sidecar) against its spec/REQ/SC/D-NNN claims AND verify follow-on packets named by 008 actually exist.

Remaining Key Questions: 24 unanswered (Q1-Q24). Categories: UNSHIPPED (Q1-Q6), DEAD (Q7-Q12), BUGGED (Q13-Q19), MISSED (Q20-Q24).

Last 3 Iterations Summary: (none yet)

## STATE FILES

All paths are relative to the repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/deltas/iter-001.jsonl

## RESEARCH FRAMING

This is a COVERAGE + HYGIENE audit. NOT a P0/P1/P2 code review. Surface findings in FOUR categories. Quality criteria:

1. **UNSHIPPED** — spec docs or commit messages CLAIM work was done, code does not actually do it.
   - REQ rows marked complete but no corresponding code/test
   - SC criteria in spec.md lacking verification evidence in implementation-summary.md
   - tasks.md `[x]` rows with no matching commit
   - `D-NNN` decisions describing behavior the code doesn't implement
   - Benchmark recommendations not acted on
   - Cross-referenced "future packets" that should have shipped but didn't

2. **DEAD** — unreachable / unused code, env vars, config fields, or doc references.
   - Functions with caller count 0 (only def + tests)
   - Env vars set but never read, or read but never set
   - Config dataclass fields populated but unconsumed
   - SKILL.md/README.md references to non-existent files/features
   - Backcompat shims that no caller triggers
   - z_archive paths cited as authoritative

3. **BUGGED** — logic errors or contract drift behind plausible-looking code.
   - Config dataclass defaults differing from runtime helper defaults (the `da33c866d` dispatch-default drift template — look for siblings)
   - Allowlist gates checking wrong consumer's flag (the `_ensure_rerank_sidecar_for_mcp` allowlist bug fixed in same commit — look for siblings)
   - HTTP request fields producer sends that consumer ignores (or vice versa)
   - Comments that contradict the code below them
   - Tests codifying the buggy behavior so the bug looks "tested"
   - Conflicting defaults documented across docs / Config / runtime helpers
   - Stale frozen-time hashes (e.g., `effective_config_hash`) no longer matching content

4. **MISSED** — spec items that quietly disappeared.
   - Open Questions never answered
   - Risks listed without a mitigation that was actually implemented
   - "Follow-on packet" promises with no follow-on packet existing
   - Manual playbook scenarios marked SKIPPED ("needs MCP infra") where infra has since been built
   - Deferred P2 advisories from prior deep-reviews that accidentally regressed

## ITERATION 1 SPECIFIC FOCUS

Begin with **arc 008-rerank-sidecar-arc** (the most-recently shipped surface, 7 phase children 001-007). Plus inspect commit `9349f5f4a` (multi-model serving + per-consumer model selection — landed today 2026-05-21).

**Target list for iter 1 (focus most heavily on 008/006 and 008/007, then sample 008/001-005):**

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/spec.md`
2. `008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/` — all spec docs + verify REQ/SC/D-NNN against code in `.opencode/skills/system-rerank-sidecar/` and `.opencode/skills/mcp-coco-index/`
3. `008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/` — verify this IS the `cpu-mps-tuning` follow-on the user dispatch text mentioned, and verify all claims
4. `git show --stat 9349f5f4a` and `git show 9349f5f4a -- '*.py'` — cross-check the multi-model-serving commit against spec docs

**Code surfaces to probe:**
- `.opencode/skills/system-rerank-sidecar/mcp_server/` (FastAPI sidecar serving Qwen/Qwen3-Reranker-0.6B)
- `.opencode/skills/system-spec-kit/mcp_server/src/handlers/` (spec-memory rerank wiring)
- `.opencode/skills/mcp-coco-index/mcp_server/` (cocoindex rerank wiring after dedup)

**Grep recipes to use (use `rg` from repo root):**
- `rg -n '_ensure_rerank_sidecar_for_mcp|_ensure_rerank_sidecar' --type py` — verify the allowlist bug fix landed
- `rg -n 'effective_config_hash|frozen_at' --type py` — find frozen-time hashes
- `rg -n 'RERANK_SIDECAR_|RERANK_MODEL_|RERANK_ENABLED' --type py --type sh` — env vars to cross-check
- `rg -n 'def __post_init__|@dataclass' .opencode/skills/system-rerank-sidecar/mcp_server/` — Config dataclass discovery
- `git log --oneline --no-merges -- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/` — arc commit history
- `git log --oneline --no-merges -- .opencode/skills/system-rerank-sidecar/` — sidecar code commit history

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 6-10 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do NOT implement fixes. Report findings only.
- Read-only against source code. Writes confined to `<target>/research/`.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects.
- Findings should be CONCRETE with file:line + grep evidence. Mark uncertain findings as `SUSPECTED` rather than `CONFIRMED`.
- Do NOT generalize. Each finding row should reference specific files and lines.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/iterations/iteration-001.md`. Structure:
   - `## Focus` (1 paragraph)
   - `## Actions Taken` (numbered list of tool calls + 1-line summary each)
   - `## Findings` (4-column table: `Finding ID | Category | File:line + grep evidence | Recommended action`)
   - `## Questions Answered` (which of Q1-Q24 got partial or full answers)
   - `## Questions Remaining` (which of Q1-Q24 still open)
   - `## Next Focus` (1 paragraph — what iter 2 should pivot to)

2. **Canonical JSONL iteration record** APPENDED to the state log. Use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1 estimate based on # of new findings>,"status":"insight|thought|exhausted","focus":"<short string>","graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator. Example:
```bash
echo '{"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"insight","focus":"008-rerank-sidecar audit"}' >> .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/deep-research-state.jsonl
```

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/deltas/iter-001.jsonl`. One `{"type":"iteration",...}` record first, then per-finding records:

```json
{"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"insight","focus":"008-rerank-sidecar audit"}
{"type":"finding","id":"f-iter001-001","category":"UNSHIPPED","label":"...","iteration":1}
{"type":"finding","id":"f-iter001-002","category":"DEAD","label":"...","iteration":1}
```

Each finding record SHOULD also include `file_evidence`, `recommended_action`, and `confidence` (CONFIRMED|SUSPECTED) fields.

All three artifacts are REQUIRED.

## SCOPE GUARD

- Read-only against source. Any source-code mutation outside `<target>/research/` is an out-of-scope violation.
- Spec folder is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture` (pre-approved). Skip Gate 3.
- Do NOT modify the umbrella's `spec.md`, the arc spec.md files, or any phase-child spec docs. Only `<target>/research/*` is writable.
