# Iteration 4: READMEs + SKILL.md + hooks + skill-advisor render.ts + feature-catalog + manual-testing

## Focus
Documentation/hook/advisor surfaces referencing constitutional memory: render.ts hardcoded directives, injection-contract stale claims, SKILL.md, READMEs, feature-catalog, memory-system reference, manual-testing scenarios.

## Findings

### F4.1 system-skill-advisor render.ts — hardcoded directives (enforcement STAYS)
- `mcp-server/lib/render.ts:105` `HYGIENE_DIRECTIVE`; `:112` `GOVERNOR_DIRECTIVE`; `:117` `TERMINAL_PROOF_DIRECTIVE`; `:121` `DIRECTIVES_LABEL` — the every-turn directive capsule is HARDCODED here, not read from constitutional/*.md (confirmed). `:444,452,459` — appended to every advisor brief + fallback. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:105,112,117,121,452]
- `render.ts:457` — docstring "Render the **constitutional** context retained when no advisor brief is available" — STALE naming only; the fallback is the hardcoded directive capsule. Action: rename docstring (KEEP enforcement). Class: TODO (rename) / enforcement stays.
- `hooks/injection-contract.md:65-67` — documents advisor directive injection (canonical owner render.ts; OpenCode bridge fallback emitter mirrors same 3 directives) — accurate, no action beyond wording. [SOURCE: file:.opencode/hooks/injection-contract.md:65]

### F4.2 hooks/injection-contract.md — STALE cold-start claim (confirmed)
- `:195-199` — "Session Start Context **Injects:** a startup or resume brief: **constitutional-memory reminders on cold start**, or a cached compaction/resume payload. Owning module: `system-spec-kit/mcp-server/hooks/claude/session-prime.ts`." — CONTRADICTS session-prime.ts:188-236 (no constitutional fetch; fallback surface only; verified Iter 1 F1.6). Action: rewrite §4 Session Start Context to drop the constitutional-reminders claim. Class: TODO. [SOURCE: file:.opencode/hooks/injection-contract.md:195-199]

### F4.3 system-spec-kit SKILL.md
- `SKILL.md:8` — Keywords list includes `constitutional-tier`. `:94` — "The rest of the package is deliberately NOT routable: `scripts/`, `mcp-server/`, `shared/`, `templates/`, `constitutional/`, `changelog/`..." — constitutional/ is already excluded from the leaf manifest (router never surfaces it). Action: drop `constitutional-tier` keyword; the `constitutional/` exclusion line becomes moot when folder is deleted (or stays as a "no longer exists" note). Class: TODO (keyword) / KEEP (routing exclusion is correct). [SOURCE: file:.opencode/skills/system-spec-kit/SKILL.md:8,94]

### F4.4 mcp-server READMEs
- `mcp-server/README.md:109` — "memory_index_scan defaults includeConstitutional=true for .opencode/skills/*/constitutional/" — must flip/remove with code default. [SOURCE: file:mcp-server/README.md:109]
- `mcp-server/INSTALL-GUIDE.md:5,705,854` (3 matches; :705 = includeConstitutional schema doc) — update/remove. [SOURCE: file:mcp-server/INSTALL-GUIDE.md:5,705,854]
- `mcp-server/hooks/README.md:71,93` — memory-surface.ts "surfaces constitutional or triggered memory" description. [SOURCE: file:mcp-server/hooks/README.md:71,93]
- Sub-READMEs with constitutional references: `lib/search/README.md:178` (retrieval-directives), `lib/scoring/README.md:21`, `lib/utils/README.md:59,85-91`, `core/README.md:24,71`, `handlers/README.md:119,124,188`, `schemas/README.md:71,124`, `tests/README.md:87`, `scripts/README.md:57`, `scripts/migrations/README.md:30`, `lib/search/README.md` (learned-feedback line 180 from Iter 1 F1.x). [SOURCE: per-file grep, Iter 4]

### F4.5 feature-catalog/feature-catalog.md (47 matches)
Load-bearing narrative lines describing the constitutional feature set (all need rewrite/removal):
- `:105` parameter surface "constitutional inclusion"; `:107` `constitutional_results.slice(0, limit)`; `:223` "Constitutional memory injection appends up to 5 constitutional rows"; `:379` "constitutional cache... invalidated on write"; `:383` "constitutional files get 1.0"; `:395` "protected manual or constitutional fields"; `:495` bulk-delete protection for constitutional/critical; `:557` document-type weighting constitutional=1.0; `:705` scanner sources include constitutional files; `:715` "constitutional stats"; `:816` checkpoint restore clears constitutional caches; `:886` scan roots include constitutional dirs; `:1224` constitutional-memory cache scoping; `:1248` E4 limit overflow; `:1356` v28 partial unique index "non-deprecated, non-constitutional"; `:2054` FSRS tier-axis constitutional no-decay; `:3016-3020` hybrid decay policy constitutional context type; plus ~15 more lines (3093-4588 incl. expert-knowledge injection PI-A4, constitutional tier descriptions). [SOURCE: file:feature-catalog/feature-catalog.md:105,107,223,379,383,395,495,557,705,715,816,886,1224,1248,1356,2054,3016,3020]
- Action: rewrite each line to describe post-deprecation behavior (no constitutional tier/injection/cache). Class: TODO. This is the governance doc for the features — high-visibility but low-code-risk.

### F4.6 references/memory/memory-system.md (17 matches) — the memory-system architecture doc
- `:36` Constitutional row in storage table; `:54` Constitutional Rules discovery row (`meta-cognitive` / `constitutional` / `findConstitutionalFiles()`); `:69` merged+indexed together; `:96` "Stored in constitutional/ folder, auto-indexed on MCP server startup"; `:146` L7 scan includes constitutional files; `:163` `includeConstitutional` default true (index_scan); `:189,207` memory_search/context params default true; `:235-236` "constitutional memories still appear first" / exclude example; `:258` example comment; `:393` tier table row (1.0, never decays); `:487` folder path; `:502` `constitutional-rule-staleness.cjs` script; `:509-514` rule authoring steps with `importanceTier: constitutional` frontmatter; `:645` classifyTier constitutional exemption. [SOURCE: file:references/memory/memory-system.md:36,54,69,96,146,163,189,207,235,258,393,487,502,509,645]
- Action: full §rewrite — this is the canonical memory-system doc; remove the constitutional tier from all tables/examples; note rules rehomed as plain docs (unindexed). Class: TODO.

### F4.7 Other system-spec-kit references
- `references/memory/trigger-config.md:110,126,136,149,172,180` (constitutional trigger rows); `references/memory/save-workflow.md:367,370,559`; `references/debugging/troubleshooting.md:65,142,145,371-375`; `references/workflows/quick-reference.md:119`; `README.md:461,598`. [SOURCE: per-file grep, Iter 4]

### F4.8 Manual-testing playbook — constitutional scenarios (10+ files)
- `context-preservation/passive-context-enrichment.md:3-233` (20) — full scenario asserting constitutional memories surface in every tool response hints + session priming (PASS record at :233 documents live behavior). [SOURCE: file:manual-testing-playbook/context-preservation/passive-context-enrichment.md:3,15,22,75,233]
- `tooling-and-scripts/constitutional-memory-manager-command.md` (27) — /memory:learn scenario. [SOURCE: file:.../constitutional-memory-manager-command.md:3]
- `retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection-pi-a4.md` (33) — PI-A4 injection scenario. [SOURCE: file:.../constitutional-memory-as-expert-knowledge-injection-pi-a4.md:6]
- `memory-quality-and-indexing/constitutional-sufficiency-gate-exemption.md` (15) — warn-only gate scenario. [SOURCE: file:.../constitutional-sufficiency-gate-exemption.md:3]
- `retrieval-enhancements/dual-scope-memory-auto-surface-tm-05.md` (3); `tooling-and-scripts/memory-manage-command-routing.md` (3, includes tier display); `memory-maintenance-and-migration-clis.md:180`; `session-boost-graduated.md:234`; `query-expansion-r12.md:225`; `query-decomposition:83,213`; `hyde:80,181`; `graph-concept-routing:116`; `progressive-disclosure-v1:58-129` (6); `mutation-hook-result-contract-expansion:76-137` (6); `empty-result-recovery-v1:99-193` (4); `final-token-metadata-recomputation:74-104` (3); `context-server-success-envelope-finalization:73-88` (3); `result-provenance:81,92`; `llm-reformulation:75,143`; `embedder-list-registry-inventory:72-84` (3); `validation-signals-as-retrieval-metadata-s3` (1); `tool-level-ttl-cache.md:73,79` (from Iter 1 includeConstitutional list); `4-stage-pipeline-refactor-r6.md:106,234,252` (from Iter 1). [SOURCE: per-file grep, Iter 4]
- Action: scenarios are behavior fixtures — each must be re-verified/rewritten to the post-deprecation behavior or marked obsolete. Class: TODO (rewrite) — note playbooks are tests-in-docs; the PASS records at :233 etc. document pre-deprecation behavior.

### F4.9 system-skill-advisor other surfaces
- `skill_advisor.py:2001` (1 constitutional mention — likely docstring/keyword); `feature-catalog/auto-indexing/doc-frontmatter-harvest.md:24`; `manual-testing-playbook/auto-indexing/doc-frontmatter-harvest.md:215`; `changelog/v0.8.0.md:17`; `mcp-server/scripts/check-skill-doc-frontmatter.mjs:15,30`; `mcp-server/lib/skill-graph/doc-frontmatter.ts:30`; `mcp-server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:31`; `mcp-server/tests/skill-doc-harvest.vitest.ts:117`. [SOURCE: grep, Iter 4]
- `skill_advisor.py:2001` detail deferred to Iter 10 verification sweep.

### F4.10 system-spec-kit changelogs + benchmarks
- `changelog/v3.7.0.0.md:72,334`, `changelog/v3.6.0.0.md:95,211` — historical records: KEEP (history, do not rewrite). `benchmarks/2026-05-20--run--unspecified/benchmark-report.md:22,210` + SOURCE.md:29,51 — benchmark history: KEEP. [SOURCE: per-file grep, Iter 4]

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts`, `.opencode/hooks/injection-contract.md`, `.opencode/skills/system-spec-kit/SKILL.md`, feature-catalog, references/memory/*, manual-testing-playbook/*, mcp-server READMEs, changelogs, benchmarks

## Assessment
- newInfoRatio: 0.85 — docs surface mapped; some lines only count-verified (F4.7, F4.9 tail).
- Novelty justification: fourth disjoint surface; render.ts/injection-contract confirmed as the enforcement-vs-stale-doc boundary.
- Confidence: high for F4.1-F4.6; medium for count-only entries (flagged).

## Reflection
- Worked: files_with_matches on md trees + targeted context greps.
- Ruled out: reading every playbook in full — scenario headers + key lines suffice for classification.

## Recommended Next Focus
Iter 5: ROOT DOCS — CLAUDE.md / AGENTS.md / BARTER.md / .claude/CLAUDE.md constitutional links + inlined-rule appendix; separate load-bearing from spec-history refs.
