# RCAF DEEP REVIEW — ITERATION 7 — references + graph-metadata + edge cases

## ROLE
Expert reviewer. Concise findings, file:line evidence.

## CONTEXT
Iter 7 of 10. Cumulative F-001..F-026. Status: 0 P0 / 13 P1 / 11 P2. CONVERGED last 2 iters (1 + 1 finding). Continue per user 10-iter directive.

## ACTION

**Focus**: edge cases + adversarial sweep.

**Step 1: references/ accuracy audit**
For each:
- `.opencode/skills/deep-loop-runtime/references/script_interface_contract.md`
- `.../references/coverage_graph_schema.md`
- `.../references/state_format.md`
- `.../references/integration_points.md`

Cross-reference each claim against the actual code:
- script_interface_contract.md: do the documented args + exit codes exactly match what's in scripts/*.cjs?
- coverage_graph_schema.md: does the schema description match what coverage-graph-db.ts actually CREATEs?
- state_format.md: does the JSONL field set match what atomic-state.ts + jsonl-repair.ts actually read/write?
- integration_points.md: are all the listed consumers accurate post-118?

Cite file:line. P1 for documentation-vs-code mismatch; P2 for outdated examples.

**Step 2: graph-metadata.json accuracy**
Read `.opencode/skills/deep-loop-runtime/graph-metadata.json`. Verify:
- `trigger_phrases` actually appear in SKILL.md frontmatter (no drift)
- `key_topics` are accurate
- `entities` list is complete (covers deep-review, deep-research, system-spec-kit consumers correctly)
- `depends_on` reflects actual external dependencies (zod, better-sqlite3, etc.)
- `related_to` correctly cites deep-review + deep-research
- `causal_summary` is honest

Cite file:line. P1 for inaccuracy; P2 for missing entries.

**Step 3: Edge cases + adversarial sweep**
Search for things prior iters may have missed:
- Are there any unused imports / dead code in `lib/deep-loop/` or `lib/coverage-graph/` post-move?
- Do any `lib/*.ts` files import from `system-spec-kit/mcp_server/` (broken post-isolation)?
- Does `scripts/*.cjs` handle SIGTERM / SIGINT gracefully (or do they leak DB connections)?
- Are there any TODO / FIXME / HACK comments in the new code that need addressing?
- Does the SQLite file have a deterministic creation path or does it race-create?
- Are `.gitkeep` files needed anywhere or did codex leave any orphan placeholders?
- Are there any version drifts between SKILL.md frontmatter, changelog/v1.0.0.md, and graph-metadata.json?

Cite file:line. P1 for actual issues; P2 for hardening gaps.

**Step 4: Write findings (F-027+) + delta JSONL**

Standard structure. After writing:
`ITER-7 DONE: <P0>/<P1>/<P2>, dimensions=adversarial+edge-cases`
