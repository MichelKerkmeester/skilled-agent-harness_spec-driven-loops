---
title: "Iteration 9: Consumers/breakage analysis + ranked deprecation checklist + retarget set + dist/daemon note"
trigger_phrases: []
---
# Iteration 9: Consumers/breakage analysis + ranked deprecation checklist + retarget set + dist/daemon note

## Focus
Every consumer that loses steering or breaks; the ordered deprecation checklist honoring the constraints; the exact load-bearing retarget set; dist rebuild + daemon restart evidence.

## Findings

### F9.1 Consumers — steering impact
- **NO steering loss**: the 3 every-turn directives (comment hygiene, governor, terminal-proof) are hardcoded in `system-skill-advisor/mcp-server/lib/render.ts:105,112,117` and delivered every turn via the advisor brief + fallback (`:444,452,459`) — independent of the constitutional layer. The rule content is also inlined in the root docs (Iter 5 F5.2). [SOURCE: file:render.ts:105-121,444,452,459; file:CLAUDE.md:41,71,72,90,116,363]
- **Decorative steering removed (no loss)**: compaction auto-surface (`context-server.ts:1069`, `compact-inject.ts:419-427`) surfaces constitutional rows that duplicate root-doc content; after deprecation the compaction block renders only triggered memories. [SOURCE: file:context-server.ts:1069, file:compact-inject.ts:419]
- **memory-system-spec-kit-only rule STAYS** — the native-memory ban remains enforced by... (rule is doc; ban's real enforcement is the spec-kit-only memory MCP wiring which stays). [SOURCE: owner direction + Iter 6 H4]

### F9.2 Consumers — breakage inventory (what breaks if code changes land without the paired change)
| Consumer | Breaks when | Paired change |
|---|---|---|
| `/memory:learn` command + learn-presentation | tier removed / folder semantics changed | retire or repurpose command (D1-D2) |
| CLI `scan` path (cli.ts:489) | schema drops includeConstitutional | safe: ALLOW_UNKNOWN_PARAMETERS ignores unknown props (tool-schemas.ts:217,392); still remove flag (A6) |
| memory_search/context callers passing includeConstitutional | param removed | safe: unknown params allowed; remove flag usage |
| context-server compaction/resume envelope | constitutional removed from AutoSurfaceResult | update envelope shape + context-server.vitest.ts (B3/E-tail) |
| formatters/search-results envelope consumers (search-presentation, token-budget test) | constitutionalCount removed | update presentation + tests (A14/E3/D5) |
| memory-crud guard tests + governance audit consumers | E_CONSTITUTIONAL_SELF_EDIT removed | rewrite guard tests (E5) |
| checkpoint restore governance | TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH removed | update checkpoint tests (C2) |
| bulk-delete protection logic | constitutional tier gone from protected set | update tests (C3) |
| active-row-predicate lane 'constitutional' | lane removed | update active-row tests (A8) |
| eval-metrics constitutional channels | channels removed | update eval tests (E9 tail) |
| DB: 21 rows + vectors + projections | deletion | indexer flip FIRST (C1) or rows resurrect on next scan |
| daemon/CLI dist | dist stale vs source | rebuild dist; spec-memory.cjs exits 69 when stale (see F9.4) |
| memory-index scan status displays | constitutional counters removed | update presentation + tests (C1) |
| feature-catalog / memory-system.md / playbooks | doc rewrites | rewrite together (F5-F8) |
[SOURCE: Iter 1-8 cross-references]

### F9.3 RANKED DEPRECATION CHECKLIST (ordered; constraints honored)
Constraints: enforcement stays in hooks/render.ts; KEEP memory-system-spec-kit-only; KEEP continuity (spec-folder + MCP); no new DECISIONS.md surface.

1. **Search-surface flags**: flip schema defaults (tool-schemas.ts:221,267,761) + drop hardcoded `includeConstitutional: true` at tools/memory-tools.ts:81, cli.ts:489, shadow-evaluation-runtime.ts:200, active-row-predicate.ts:61. (A4-A8)
2. **Indexer**: flip `include_constitutional` default false + remove findConstitutionalFiles discovery + counters + warn-only path + error text (memory-index.ts:216-2183) + schema/tool-schemas description + mcp-server/README.md:109. (C1, F4) — MUST precede DB delete.
3. **DB**: delete 21 constitutional rows + vector embeddings + active_memory_projection rows + FTS entries (H6). Keep learned_triggers (0 rows) untouched (H7).
4. **Pipeline/query machinery**: remove stage1 injection block + CONSTITUTIONAL_INJECT_LIMIT (stage1-candidate-gen.ts:30,847-1472); remove constitutional merge + tier branch + isConstitutional + get_constitutional_memories(_public) (vector-index-queries.ts:437-522; vector-index-store.ts:1963-2048). (A9-A11)
5. **Tier config**: remove constitutional from ImportanceTier union/config/getSearchableTiersFilter/DOC_TYPE_TIERS + delete shouldAlwaysSurface + getConstitutionalFilter (importance-tiers.ts:21-42,181-183,194-208,259). (A12-A13)
6. **Surface hooks**: remove constitutional from memory-surface (cache/fetch/prime/enrich), compact-inject renderConstitutionalMemories, context-server autoSurfacedContext, response-hints, mutation-feedback constitutionalCacheCleared, session-prime docstring. (B1-B7)
7. **Formatters/envelope**: remove constitutionalCount + "(M constitutional)" summary + canonical source-kind 'constitutional' (search-results.ts:997-1381; memory-search.ts:205-391). (A14-A15)
8. **Guards/audits**: remove memory_update constitutional guard + E_CONSTITUTIONAL_SELF_EDIT + checkpoint TIER_DOWNGRADE audit + bulk-delete constitutional protection + storage helper branches. (C2-C5)
9. **Commands**: retire /memory:learn (or repurpose to plain-doc authoring) + presentation assets; strip constitutional rows from manage tier displays; remove search constitutional display contract; rewrite memory README prose; drop tier_reference mentions in speckit/create YAMLs. (D1-D8)
10. **Tests**: update/delete per E1-E9 contracts (must-assert list in Iter 3).
11. **Docs**: render.ts:457 docstring rename; injection-contract.md:195-199 rewrite; SKILL.md:8,94; mcp-server READMEs; feature-catalog 47 lines; memory-system.md; other references; playbook scenarios re-verified; README.md:403,475,781,978. (F1-F8, G2)
12. **Folder**: per H1-H5 verdicts (strip importanceTier frontmatter from kept files; delete fully-inlined; rehome unique long-forms; KEEP memory-system-spec-kit-only; delete or rewrite folder README). (H1-H5)
13. **Root-doc links**: retarget the 18 links (G1) — see F9.4.
14. **Dist rebuild + daemon restart + verification**: rebuild `mcp-server/dist`; restart the spec-memory daemon; run the post-deprecation test gate; re-run one live search to confirm zero constitutional rows surface. (F9.4)

### F9.4 Dist rebuild + daemon restart — confirmed required
- `dist/` is MIXED: `dist/handlers/memory-search.js:905` and `dist/lib/search/vector-index-queries.js:293` carry the flipped `= false`, but `dist/handlers/memory-index.js:323` still has `include_constitutional = true`, and `dist/handlers/memory-context.js:875,903` still forward the flag. The committed flip is NOT fully reflected in dist. [SOURCE: grep dist, Iter 9]
- `.opencode/bin/spec-memory.cjs` runs `mcp-server/dist/spec-memory-cli.js` and "Checks dist freshness and exits 69 when stale" — the daemon/CLI path is dist-bound, so the committed search flip has NO effect until `dist` is rebuilt and the daemon restarted. [SOURCE: file:.opencode/bin/README.md:105]

### F9.5 Load-bearing link retarget set (exact)
The 18 root-doc links (6 files x 3 docs):
- comment-hygiene.md ← CLAUDE:41, AGENTS:41, BARTER:59
- regression-baseline-and-delta.md ← CLAUDE:71, AGENTS:71, BARTER:89
- finding-is-a-hypothesis.md ← CLAUDE:72, AGENTS:72, BARTER:90
- main-branch-direct-push.md ← CLAUDE:90, AGENTS:90, BARTER:108
- cli-dispatch-skill-preload.md ← CLAUDE:116, AGENTS:116, BARTER:134
- gate-tool-routing.md ← CLAUDE:363, AGENTS:363, BARTER:357 (short path in BARTER)
Retarget options:
- **Option 1 (recommended, zero-move):** keep the constitutional folder as an UNINDEXED reference docs home (strip `importanceTier: constitutional` frontmatter from kept files; memory-index no longer scans it — C1). All 18 links remain valid with zero edits. No new surface created.
- **Option 2 (delete folder):** rehome each long-form into the corresponding root-doc section (or a `references/rules/` doc) and retarget the links to the new anchors. More churn; needed only if the folder must physically disappear.
Recommendation: Option 1 for the 11 unique-content files + memory-system-spec-kit-only; delete the 8 fully-inlined files (6 root-linked + deep-skill-workflow-required + recursion-control essence rehomed); retarget those 6 links ONLY if their files are deleted. [SOURCE: Iter 6 F6.6 + Iter 5 F5.1]

## Sources Consulted
- dist/ greps, .opencode/bin/README.md, tool-schemas.ts, Iter 1-8 artifacts

## Assessment
- newInfoRatio: 0.65 — breakage map + checklist + dist evidence new.
- Novelty justification: dist mixed-state evidence and daemon exit-69 contract pin the "rebuild + restart" note to concrete files.
- Confidence: high (grep-verified dist state; README contract cited).

## Reflection
- Worked: dist grep showed exactly which compiled files carry the stale `true`.
- Ruled out: restarting the daemon or rebuilding dist (out of scope — lineage read-only).

## Recommended Next Focus
Iter 10: Final verification sweep — missed surfaces (skill_advisor.py:2001, schemas/tool-input-schemas.ts, configs, stress-test, .spec-gate-state, plugins, other skills), plus assertions finalization.
