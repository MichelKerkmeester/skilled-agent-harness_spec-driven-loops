# Iteration 10: Verdict and ranked recommendations (Workstream B)

## Focus
Close Q-B1–Q-B7 with a full-deprecation vs keep-rules-as-docs verdict and a single ranked list of machine-contract-safe recommendations (value × risk). Broaden rather than stop: this is the max-iterations synthesis iteration, not an early STOP.

## Actions Taken
- Read iterations 001–009, strategy, constitutional README, AGENTS.md link set.
- No new implementation; no repo tooling outside the lineage.

## Findings

### F-B10.1 Verdict: deprecate the constitutional *system*; do not keep it as a live retrieval tier
**Full deprecation of the retrieval/indexing/learn-command system is justified.** Evidence:

- Enforcement does not live in the 20 files (Gate 3 classifier, comment-hygiene checker, root docs) [iter 1].
- `alwaysSurface` is unused by the search pipeline [iter 1].
- Files are not on the every-turn bus; CC/Cursor always-on files are [iter 2].
- Owner already banned the vendor always-on memory store and substituted a search index [iter 2, `memory-system-spec-kit-only.md`].
- Advisor every-turn text is hardcoded in `render.ts`, not read from the folder [iter 1, 8].
- Learned-triggers are a different, unused-looking relevance feature [iter 1, 4].

**Keep-rules-as-docs is an optional last-step choice, not a reason to keep the tier.** After plumbing is off (iter 5), the markdown files can be archived or deleted **once** unique content is rehomed (iter 6). Keeping them unindexed as a doc garden is acceptable **only** if AGENTS.md links still need a long-form home and nobody runs `/memory:learn`. It still costs drift (triple copies of comment-hygiene).

**Do not keep the 20 files as the always-on store** (would blow Claude 200-line / Cursor always-apply budgets) [iter 2, 6].

What is **not** deprecated: AGENTS.md/CLAUDE.md, hooks/classifiers, per-spec ADRs, resume-ladder continuity, `render.ts` disposition capsules, `memory_search` of spec docs.

### F-B10.2 Ranked recommendations (value × risk)

| Rank | Change | Value | Risk | Exact surfaces |
| --- | --- | --- | --- | --- |
| 1 | Default `includeConstitutional` to **false** on search/context/quick_search | High (stops ADR-query pollution; makes the tier inert) | Med (update constitutional tests listed in iter 5) | `tool-schemas.ts`, `memory-tools.ts`, `memory-context` handler, `cli.js`, Stage 1, `vector-index-queries.ts` |
| 2 | Add `.opencode/DECISIONS.md` + Cursor `alwaysApply` rule (+ optional CLAUDE `@` import) with **Standing** (native-memory ban, bash-truncation trap, recorded-failure-must-route, maybe main-branch-push) and **Recent** pointers to packet ADRs | High (finally an active decisions surface, no MCP) | Low-med (token budget; keep tiny) | new files; `.cursor/rules/decisions.mdc`; one line in CLAUDE.md |
| 3 | Stop MCP prime constitutional SQL | Med | Low | `memory-surface.ts` `getConstitutionalMemories` / `primeSessionIfNeeded`; `context-server.ts` `injectSessionPrimeHints` |
| 4 | Freeze then retarget or delete `/memory:learn` | Med | Med (docs + `memory-learn-command-docs.vitest.ts`) | `.opencode/commands/memory/learn.md`, presentation asset, SKILL.md / install-guides / feature-catalog |
| 5 | Stop indexer scanning `constitutional/` (`includeConstitutional` scan default false) | Med | Low | `memory_index_scan` schema/handler, `checkpoints.js` constitutional path guard |
| 6 | Rehome unique content (iter 6 table); retarget 6 AGENTS.md/CLAUDE.md links | High for correctness after delete | Med (missed links in BARTER.md / catalogs — census incomplete) | AGENTS.md, CLAUDE.md, BARTER.md (if present), skill README |
| 7 | Drop `IMPORTANCE_TIERS.constitutional` + rewrite/delete DB rows | Cleanup | Med (SQL migrations, scoring tests) | `importance-tiers.ts`, vector-index SQL, stage1 injection block |
| 8 | Keep `render.ts` 3 capsules; optional stable pointer line; fix timeout fallback to include directives | Low-med | Low | `render.ts` `renderAdvisorTimeoutFallback` |
| 9 | Learned-triggers: confirm 0 rows then flag-off / later drop column | Low if unused | Low | `learned-feedback.ts`, `SPECKIT_LEARN_FROM_SELECTION`, `/memory:manage` expire/clear |
| 10 | Optional `/memory:decisions` as `memory_search` scoped to `decision-record.md` with constitutional off | Med (cheap prior-decision query) | Low | new command or search.md route; **not** a new DB |

**Shipped-packet regressions:** none of ranks 1–5, 7–10 change spec-doc anchors/frontmatter/required-docs. Rank 2 must **not** add a required packet `decisions.md`. Rank 6 is doc-link retarget only. If Workstream A later merges checklist files, that is a **separate** versioned contract (out of this lineage's writeup except as cross-context).

### F-B10.3 Full-deprecation vs keep-as-docs — decision rule
- **Deprecate the system (tier, flag, learn command, prime SQL, indexer path) regardless.**
- **Keep the files as unindexed docs** only during the rehome window, or permanently for the six long-form files AGENTS.md still wants to cite (comment-hygiene, regression-baseline, finding-is-a-hypothesis, main-branch-direct-push, cli-dispatch, gate-tool-routing) **if** those long forms are not inlined. That is "keep some markdown," not "keep constitutional memory."
- **Delete the folder** once citations move and unique standing entries live in DECISIONS.md. Trigger-phrase search for those files goes away; that is intended.

## Questions Answered
All Q-B1–Q-B7 have evidence-backed recommendations. Live DB counts remain UNKNOWN.

## Dead Ends
- Keep-the-tier-but-fix-alwaysSurface.
- Native Claude MEMORY.md as the replacement.
- New spec-doc required file for global decisions.

## Assessment
- newInfoRatio: 0.28
- noveltyJustification: Verdict + ranked table are the new synthesis; underlying evidence was gathered in 001–009. Ratio is telemetry under max-iterations stop policy.
- confidence: high on deprecate-the-system; medium on exact leftover-doc set (BARTER.md census incomplete).

## Recommended Next Focus
None — maxIterations 10 reached. Synthesis owns `research.md`.
