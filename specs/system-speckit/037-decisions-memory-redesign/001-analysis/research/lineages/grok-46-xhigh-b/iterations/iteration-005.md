# Iteration 5: Deprecation sequence and blast radius (plumbing)

## Focus
Angle (d) part 1: ordered retirement of DB constitutional tier, `/memory:learn`, session-prime constitutional fetch, `includeConstitutional` plumbing, learned-triggers — without claiming shipped-packet spec-doc regressions (those files do not depend on the constitutional tier).

## Actions Taken
- Inventoried `includeConstitutional` defaults in tool-schemas, memory-tools, memory-index, memory-context, cli.js, indexing API, spec-memory-cli-fallback, eval-reporting.
- Inventoried SQL `importance_tier = 'constitutional'` in memory-surface, vector-index-store/queries, stage1, checkpoints, confidence-tracker, tier-classifier.
- Listed `/memory:learn` command + catalog/docs references.
- Noted `importance-tiers.ts` constitutional config and tests.

## Findings

### F-B5.1 Constitutional plumbing is a flag-shaped tree, not a single switch
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:221-267,761]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tools/memory-tools.ts:81]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-queries.ts:409-441]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:1373-1403]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/memory-surface.ts:153-187,407-463]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/scoring/importance-tiers.ts:33-42]
[SOURCE: .opencode/commands/memory/learn.md:1-24]

Default-ON surfaces: `memory_search` / `memory_quick_search` (`includeConstitutional: true`), `memory_index_scan` (scan constitutional dirs), `memory_context` (`!== false`), CLI `cli.js` true. Default-OFF / forced-false: `spec-memory-cli-fallback.ts`, `indexing.js`, `eval-reporting.js`, some context-server paths. Session prime SQL ignores the flag and always queries `importance_tier = 'constitutional' LIMIT 10`.

Shipped **spec packets** do not regress if this tree is removed: validators key on anchors/frontmatter/required-docs (shared fact), not on constitutional rows. Blast radius is **memory MCP + advisor-adjacent hooks + docs/commands**, not `validate.sh` golden snapshots — unless a test fixture indexes constitutional files.

### F-B5.2 Safe sequence (value × risk, fail-closed tests first)
Order matters because search injection and prime still read the same rows the indexer writes.

1. **Observe (low risk):** add a metric for constitutional-row impressions vs total searches; confirm learned_triggers row count (dispatch 0 is still UNKNOWN here). Do not skip this in implementation even though this research lineage cannot query the live DB.
2. **Flip search default (medium risk, high value):** `includeConstitutional` default `false` on `memory_search` / `memory_context` / `memory_quick_search`. Keep the parameter. ADR queries stop being polluted (iter 4). Tests: `gate-d-regression-constitutional-memory.vitest.ts`, stage1 tests, token-budget-constitutional-sync.
3. **Stop indexing new constitutional files:** `memory_index_scan({ includeConstitutional: false })` default; `/memory:learn` create path writes files but they no longer enter `memory_index` (or the command is frozen). Checkpoints.js already special-cases constitutional paths (`isIndexableConstitutionalMemoryPath`).
4. **Kill prime SQL:** `getConstitutionalMemories()` in `memory-surface.ts` return `[]`; drop `injectSessionPrimeHints` constitutional count. SessionStart already does not inject files (iter 1). Low user-visible risk.
5. **Retire `/memory:learn` or retarget:** command currently CRUD-writes `constitutional/`. Either delete the command + presentation asset + catalog lifecycle docs, or retarget to the new digest (`DECISIONS.md`). Docs blast: SKILL.md, install-guides, commands/README, feature-catalog constitutional-memory-* playbooks, `memory-learn-command-docs.vitest.ts`.
6. **Drop the tier from `IMPORTANCE_TIERS`:** only after no writers produce `importance_tier='constitutional'`. `shouldAlwaysSurface` can die with it. Migration: rewrite existing DB rows to `important` or delete by `file_path LIKE '%/constitutional/%'`.
7. **Learned-triggers:** independent. If live count is 0, disable `SPECKIT_LEARN_FROM_SELECTION` (already has `'false'` kill) then remove `learned_triggers` column usage in a later cleanup. Do not couple to constitutional deprecation except in the "dead retrieval features" epic.
8. **Delete or archive `constitutional/*.md` last** — after link retarget (part 2). Deleting first breaks AGENTS.md/CLAUDE.md links (iter 6).

### F-B5.3 What not to touch (false blast radius)
- Gate 3 classifier, comment-hygiene.sh, git hooks, CLAUDE.md/AGENTS.md body copy — these ARE the enforcement/always-on plane. Removing constitutional files does not disable them.
- Spec-doc templates, content-router `decision` category, resume-ladder — stay.
- Advisor `render.ts` capsules — stay until a later optional dedup with AGENTS.md.

### F-B5.4 Test/CI files that will fail if the default flips without updates
Expect failures in: `mcp-server/tests/gate-d-regression-constitutional-memory.vitest.ts`, `token-budget-constitutional-sync.vitest.ts`, `stage1-*.vitest.ts` that pass `includeConstitutional: true`, `memory-tools.vitest.ts`, `scoring-gaps.vitest.ts` (`shouldAlwaysSurface`), `memory-learn-command-docs.vitest.ts`. None of these are shipped-packet validators.

## Questions Answered
Partial Q-B4: plumbing sequence and blast radius for MCP/hooks/commands. Rehome of 20 files and lost-steering still open (iter 6).

## Ruled Out
- Big-bang delete of `constitutional/` on day one (root-doc links + /memory:learn + indexer still expect the folder).
- Using `alwaysSurface: false` as the deprecation mechanism (iter 1: decorative).

## Assessment
- newInfoRatio: 0.58
- noveltyJustification: First sequenced blast-radius map with default-ON vs default-OFF call sites and an explicit "spec packets do not regress" boundary vs memory tests that will.
- confidence: high on call-site list; live DB row counts still UNKNOWN.

## Recommended Next Focus
Angle (d) part 2: rehome 20 rules' content and the ~16 root-doc links; what unique steering is lost if files vanish.
