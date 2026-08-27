# Iteration 1: Inventory the three memory systems and confirm dispatch claims

## Focus
Confirm, with file:line evidence, the dispatch's load-bearing claims about Workstream B: three memory systems exist; enforcement is not in the 20 constitutional markdown files; the three every-turn directives are hardcoded in advisor `render.ts`; the constitutional tier's `alwaysSurface` flag is decorative relative to the search pipeline; SessionStart does not inject constitutional files into the prompt; `/memory:learn` is a constitutional-file CRUD router.

## Actions Taken
- Read constitutional README + glob of `.opencode/skills/system-spec-kit/constitutional/` (20 rules + README).
- Read `importance-tiers.ts`, `render.ts` directive constants, `memory-surface.ts` `primeSessionIfNeeded` / `getConstitutionalMemories`, Claude `session-prime.ts`, `resume-ladder.ts`, `learned-feedback.ts`, `/memory:learn` command, Gate 3 classifier, Stage 1 constitutional injection, `vector-index-queries.ts`.
- Grep for `shouldAlwaysSurface(` callers, `includeConstitutional`, comment-hygiene checkers.

## Findings

### F-B1.1 Three systems are real and separable
[SOURCE: .opencode/skills/system-spec-kit/constitutional/README.md:22-26]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:957-1027]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/learned-feedback.ts:11-16,92-96]

| System | What it is | When it fires |
| --- | --- | --- |
| Constitutional files + DB tier | 20 markdown rules in `constitutional/`, indexed as `importance_tier='constitutional'` with `searchBoost: 3.0`, `alwaysSurface: true`, `decay: false`, `maxTokens: 2000` | On `memory_search`/`memory_index_scan` when `includeConstitutional` is true; on first MCP tool-call prime; **not** every prompt turn |
| Spec continuity | Resume ladder reads `handover.md` then `_memory.continuity` **inside `implementation-summary.md` only**, then spec-doc fallback | `/speckit:resume` / `memory_context({mode:"resume"})` |
| Learned triggers | Separate `memory_index.learned_triggers` column, 30-day TTL, isolated from FTS5 | Only after `memory_validate` selections; query weight 0.7x |

Live learned-trigger row count: **UNKNOWN** (no in-repo dump; dispatch asserts 0). Code exists and is default-ON (`SPECKIT_LEARN_FROM_SELECTION` graduated).

### F-B1.2 Enforcement is not in the rule files
[SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:1-11]
[SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-comment-hygiene.sh]
[SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:93-96]
[SOURCE: .opencode/skills/system-spec-kit/constitutional/README.md:86-88]

Gate 3's machine contract is `gate-3-classifier.ts`, not `constitutional/gate-enforcement.md`. Comment hygiene is a post-edit/pre-commit checker (`check-comment-hygiene.sh`) wired through the plugin quality hook. The constitutional README itself forbids "constitutional rules -> runtime code behavior not enforced elsewhere."

**Implication:** deleting the 20 markdown files does not by itself disable Gate 3, comment-hygiene, or CLI-dispatch preload. Those live in classifiers, hooks, and root-doc prose (CLAUDE.md/AGENTS.md).

### F-B1.3 The three every-turn directives are hardcoded in advisor render.ts
[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:93-121]
[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:441-461]

`HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, and `TERMINAL_PROOF_DIRECTIVE` are exported string constants. `renderAdvisorBrief` concatenates `DIRECTIVES_LABEL +` those three after the capped advisor sentence. `renderAdvisorFallbackDirective` emits the same three when no skill recommendation exists. Nothing in this path reads `constitutional/*.md`.

Comment-hygiene appears twice: once as this always-on capsule, once as a filesystem checker. The markdown rule is a third copy.

### F-B1.4 `alwaysSurface` is decorative in the live search path
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/scoring/importance-tiers.ts:33-42,194-196]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/scoring-gaps.vitest.ts:236-254]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-queries.ts:409-441]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:1373-1403]

`shouldAlwaysSurface('constitutional')` is true, but Grep of production `.ts`/`.js` shows **no search-pipeline caller** — only the unit test and the function definition. Actual injection is the `includeConstitutional` boolean (default true) plus `get_constitutional_memories()` / Stage 1 "if zero constitutional candidates, vectorSearch with `tier: 'constitutional', useDecay: false`". The flag documents intent; the boolean + SQL path does the work. Unsetting `alwaysSurface` in `IMPORTANCE_TIERS` would not change retrieval unless callers were added.

### F-B1.5 Cold-start vs first-tool-call priming (dispatch claim refined)
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:202-235]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/memory-surface.ts:407-463,153-187]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:815-844]

Dispatch said "cold-start injection is DEAD CODE." Precise split:
- **SessionStart hook (`session-prime.ts`) does not load constitutional rows.** Startup injects a fallback surface + recovery-tool list + optional cached session continuity. Confirmed.
- **MCP first-tool-call prime is live:** `primeSessionIfNeeded` calls `getConstitutionalMemories()` (SQL `importance_tier = 'constitutional' LIMIT 10`) and `injectSessionPrimeHints` attaches a count string onto the **tool-response envelope**, not the next-turn system prompt. Requires a non-empty `sessionId`; otherwise returns null.
- So: constitutional files are not an every-turn prompt feature. They are search-time + first-MCP-call hint payload. The "dead" part is SessionStart file-injection, not the MCP helper.

### F-B1.6 `/memory:learn` is the constitutional CRUD surface
[SOURCE: .opencode/commands/memory/learn.md:1-24,40-48]
Destination is `.opencode/skills/system-spec-kit/constitutional/`. Empty args = overview; other text = proposed new rule. Deprecating the system implies retiring this command or retargeting it at the replacement store.

### F-B1.7 Four overlapping "stores" of steering (working inventory for angle c)
Not yet a consolidation recommendation. Observed surfaces that currently hold durable steering/decisions:

1. `constitutional/*.md` + `memory_index` rows with `importance_tier='constitutional'`
2. Packet docs: `decision-record.md` ADRs + `_memory.continuity` (resume reads only the implementation-summary copy)
3. `memory_index.learned_triggers` (TTL 30d)
4. Every-turn hardcoded capsules in `render.ts` plus the same rules inlined in CLAUDE.md/AGENTS.md (and BARTER.md per dispatch)

No single active decisions surface exists. Spec ADRs are the only per-packet decision log; they are not auto-loaded every turn.

## Questions Answered
- Partial Q-B4: enforcement location confirmed (hooks/classifiers/root docs, not the 20 files). Priming split confirmed. `/memory:learn` ownership confirmed. Blast-radius list still open.
- Partial Q-B6: advisor already injects three directives without reading constitutional files.

## Questions Remaining
Q-B1, Q-B2, Q-B3, remainder of Q-B4 (rehome map + lost steering), Q-B5, remainder of Q-B6 (should the brief read a new store), Q-B7, and the full-deprecation vs keep-rules-as-docs verdict.

## Dead Ends
- Treating `alwaysSurface: true` as a live retrieval switch — it is not wired. Changing the flag is not a deprecation lever.
- Treating SessionStart as the constitutional injection path — it is not; MCP first-call prime + search injection are.

## Ruled Out
- "Constitutional markdown is the enforcement plane" — false; README even disallows that dependency direction.
- "Unsetting alwaysSurface deprecates the tier" — false; `includeConstitutional` + SQL paths remain.

## SCOPE VIOLATIONS
None. Spec.md anchoring, generate-context.js, validate.sh, git writes, and research `reduce-state.cjs` (resolves artifact root to spec_folder/research/) were not run.

## Assessment
- newInfoRatio: 0.92
- noveltyJustification: First pass; all seven findings are new to this packet and several refine dispatch wording (dead SessionStart vs live MCP prime; decorative alwaysSurface).
- confidence: high on code-path claims; live DB counts UNKNOWN.

## Reflection
Direct source reads of render.ts / resume-ladder / memory-surface beat catalog prose. Catalog still useful as a map, not as proof.

## Recommended Next Focus
Angle (a): always-loaded memory patterns (Claude Code native memory + @-imports, Cursor rules) — what makes them active every turn vs this static constitutional system. Need file:line of Cursor/Claude loaders plus external product docs.
