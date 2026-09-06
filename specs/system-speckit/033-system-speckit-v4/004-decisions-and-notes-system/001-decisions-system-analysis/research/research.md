---
title: "Research Synthesis: Constitutional Memory Deprecation (Workstream B)"
trigger_phrases: []
---
# Research Synthesis: Constitutional Memory Deprecation (Workstream B)

**Lineage:** grok-46-xhigh-b (`cli-cursor` / `cursor-grok-4.6-xhigh`)
**Session:** `fanout-grok-46-xhigh-b-1787723787313-4bzy0g`
**Spec:** `specs/system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/001-decisions-system-analysis`
**Stop reason:** `max_iterations` (10/10; `stopPolicy: max-iterations`; convergence was telemetry only)
**Scope:** Workstream B only. Workstream A (templates) is cross-context and is not synthesized here.
**Mode:** Report-only — no product implementation in this lineage.
**resource-map.md:** absent at init (`resource_map_present: false`); no placeholder reference invented.

---

## 1. METADATA

- **Research ID:** RESEARCH-037-B-grok-46-xhigh-b
- **Feature/Spec:** `specs/system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/001-decisions-system-analysis` (Workstream B)
- **Status:** Complete (lineage synthesis; packet memory-save skipped by fan-out containment)
- **Date Started:** 2026-08-26
- **Date Completed:** 2026-08-26
- **Researcher(s):** fan-out lineage grok-46-xhigh-b
- **Shared fact (accepted, not re-derived):** `validate.sh` delegates to a Node orchestrator where ANCHORS (`<!-- ANCHOR:id -->`), not headings, are the contract. Any anchor/frontmatter/required-doc change is VERSIONED (manifest + content-router + spec-doc-structure.ts + golden snapshot + dist together) or shipped packets regress.

---

## 2. INVESTIGATION REPORT

This lineage asked whether "constitutional memory" can be fully deprecated and replaced with a separate, more-active decisions/notes system bound to specs and skills.

Three systems exist today:

1. **Constitutional files + DB tier** — 20 markdown files under `.opencode/skills/system-spec-kit/constitutional/` plus `IMPORTANCE_TIERS.constitutional` (`searchBoost: 3.0`, `alwaysSurface: true`, `decay: false`, `maxTokens: 2000`). [SOURCE: constitutional/README.md] [SOURCE: mcp-server/lib/scoring/importance-tiers.ts:33-42]
2. **Spec continuity + ADRs** — resume ladder reads `handover.md` then `_memory.continuity` **inside `implementation-summary.md` only**; L3/L3+ ADRs live in `decision-record.md` via content-router. [SOURCE: resume-ladder.ts:957-1027] [SOURCE: content-router.ts:23-32,1086-1094]
3. **DB learned-triggers** — 30-day TTL in `learned-feedback.ts`. Live row count **UNKNOWN** (dispatch asserted 0). [SOURCE: learned-feedback.ts:92-96]

Enforcement is **not** in the 20 files. Gate 3 is `gate-3-classifier.ts`. Comment hygiene is `check-comment-hygiene.sh` plus a plugin hook. The constitutional README forbids rules driving runtime. [SOURCE: constitutional/README.md:86-88]

The three every-turn advisor directives (`HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE`) are **hardcoded** in advisor `render.ts` and are not read from `constitutional/*.md`. [SOURCE: system-skill-advisor/mcp-server/lib/render.ts:93-121,441-461]

`shouldAlwaysSurface()` has **no production search-pipeline callers**. Real injection is `includeConstitutional` plus SQL/`vectorSearch`. Unsetting `alwaysSurface` is not a deprecation lever. [SOURCE: importance-tiers.ts:194-196] [SOURCE: vector-index-queries.ts:409-441] [SOURCE: stage1-candidate-gen.ts:1373-1403]

SessionStart `session-prime.ts` does **not** load constitutional files. MCP `primeSessionIfNeeded` still SQL-fetches `importance_tier = 'constitutional' LIMIT 10` on the first tool call with a sessionId and attaches **response hints**, not the next-turn system prompt. [SOURCE: memory-surface.ts:407-463]

---

## 3. EXECUTIVE OVERVIEW

**Verdict:** Deprecate the constitutional *retrieval/indexing/learn-command system* completely. Do not keep it as a live search tier. Keep-rules-as-docs is an optional leftover-markdown choice during (or after) rehome, not a reason to keep the tier.

**Replacement:** a small git-tracked `.opencode/DECISIONS.md` on the vendor always-on bus (Cursor `alwaysApply: true` and/or a short CLAUDE.md `@` pointer), with per-spec ADRs remaining the system of record, and `memory_search` remaining on-demand over spec docs with `includeConstitutional` default **false**.

**Do not deprecate:** AGENTS.md/CLAUDE.md, Gate 3 classifier, comment-hygiene checker, per-spec ADRs, resume-ladder continuity, `render.ts` disposition capsules, spec-doc `memory_search`.

**Shipped-packet regressions:** none of the ranked plumbing changes touch spec-doc anchors, frontmatter, or required-doc manifests. A new required packet `decisions.md` **would** regress and is ruled out.

---

## 4. CORE ARCHITECTURE

### 4.1 Active vs static (Q-B1)

**Active** means injected into the model context by the runtime with no tool call. [SOURCE: https://code.claude.com/docs/en/memory.md] [SOURCE: https://cursor.com/docs/context/rules]

- Claude Code: `CLAUDE.md` loads at launch; `@path` imports expand at launch (they do **not** save tokens; max 4 hops); auto `MEMORY.md` loads the first 200 lines or 25KB every conversation.
- Cursor: `.mdc` with `alwaysApply: true` is included in every Agent request; root `AGENTS.md` is always-on.
- This repo already uses that bus (`.cursor/rules/skill-routing.md` and `sk-vision.md` are `alwaysApply: true`). Cursor `beforeSubmitPrompt` advisor delivery is **dormant under the tested CLI build**. [SOURCE: .cursor/rules/skill-routing.md:16-17]

Constitutional files sit on a **search** bus. They become visible only after `memory_search`/`memory_index_scan` with `includeConstitutional`, or as MCP first-tool-call hints. That is static relative to the vendor always-on bus.

Owner 2026-05-31 banned Claude native `~/.claude/**/memory/` to avoid a split brain, then put "always-surface" rules into a search index that is not always-on. That substitution is the core design failure Workstream B corrects. [SOURCE: constitutional/memory-system-spec-kit-only.md:22-38]

Token budgets: Claude target under 200 lines per CLAUDE.md; Cursor rules under 500, always-apply far below. Dumping 20 constitutional files into AGENTS.md fails those budgets. Constitutional `maxTokens: 2000` is a **search** cap, not a prompt cap. [SOURCE: importance-tiers.ts:33-41]

### 4.2 Four stores, three jobs (Q-B3)

| Job | Current store | After redesign |
| --- | --- | --- |
| Every-turn steering (how to work) | AGENTS.md/CLAUDE.md + `render.ts` capsules + Cursor alwaysApply | Keep |
| Per-packet decisions (what we decided here) | `decision-record.md` / L2 implementation-summary decisions | Keep (system of record) |
| Packet resume | `_memory.continuity` in implementation-summary only | Keep |
| Search-time "always-surface" rules | `constitutional/*.md` + DB tier | **Deprecate as a store** |
| Learned search boosts | `learned_triggers` 30-day TTL | **Retire or ignore** (not a decisions log) |
| Native Claude MEMORY.md | banned | Stay banned |

This-run ADR census (read-only): **536** `decision-record.md` files, **1462** `## ADR-` headings. Dispatch said 616 — different census; unique-ID count **UNKNOWN**. A global roll-up must be a digest of standing items plus pointers, not a dump.

Cheap prior-decision query already exists: `memory_search` over spec docs. `includeConstitutional` default true **pollutes** ADR queries. Flipping it to false is a query-quality win even before full deprecation. [SOURCE: retrieval-rescue.vitest.ts:176-190]

---

## 5. TECHNICAL SPECIFICATIONS

### 5.1 Every-turn home without MCP (Q-B2)

| Home | MCP? | Reliability |
| --- | --- | --- |
| Git-tracked auto-loaded file (AGENTS.md/CLAUDE.md, Cursor alwaysApply) | No | Highest |
| `render.ts` injection (advisor hook) | No (not Spec Memory MCP) | High on Claude/OpenCode/Pi; **Cursor CLI dormant**; cadence dedup (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` default ON) is not strictly every turn [SOURCE: directive-lifecycle.ts:37-40] |
| Hybrid | No | **Recommended** |
| `memory_search` | Yes | Disqualified as every-turn home |

`render.ts` is the right store for **disposition** (three thermostat lines) and the wrong store for a **decisions log** (needs a TypeScript edit + advisor rebuild per decision; lifecycle dedup fights a growing digest).

### 5.2 Advisor integration (Q-B6)

Today's brief has two layers. Layer 1 is the dynamic skill route. Layer 2 is the three hardcoded capsules. Timeout fallback currently emits only a stale marker and **drops Layer 2** (small gap). [SOURCE: render.ts:103-117,441-476] [SOURCE: skill-advisor-hook.md:21-45]

Do **not** have the advisor MCP-read the decisions store: that reintroduces an MCP round-trip, couples skill-routing latency to the memory daemon, and still misses Cursor CLI. Optional: one **hash-free** pointer line (`Active decisions live in DECISIONS.md (git).`) so cadence dedup still treats it as constant.

Keep the capsules even if AGENTS.md already inlines similar text: `render.ts` comments that they fire when AGENTS.md is absent from a subagent's context. [SOURCE: render.ts:104-105]

### 5.3 Placement (Q-B7)

| Layer | Path | Binding |
| --- | --- | --- |
| Always-on digest | `.opencode/DECISIONS.md` + `.cursor/rules/decisions.mdc` (`alwaysApply: true`) + optional CLAUDE `@.opencode/DECISIONS.md` | Git. No MCP. No spec-doc manifest. |
| Per-spec system of record | Existing `decision-record.md` (L3+) / implementation-summary decisions (L2) | content-router + validate.sh anchors. **No new required packet file.** |
| On-demand query | `memory_search` with `includeConstitutional: false`; optional later `/memory:decisions` alias | MCP when searched |

Skill binding is citations (`SKILL.md` → `DECISIONS.md#id`) plus path-scoped vendor rules for Fable/goal leftovers — not a new advisor lane and not `importance_tier: constitutional` on skill roots.

Write path: operator/agent appends a short digest entry (and a packet ADR via existing `/memory:save` → content-router `decision`). No indexer required for the digest to be active.

---

## 6. CONSTRAINTS & LIMITATIONS

- **Versioned spec-doc contract:** do not add a required packet `decisions.md`. That would require manifest + content-router + spec-doc-structure.ts + golden snapshot + dist together.
- **Always-on token budgets:** digest must stay tiny (Claude <200 lines always-on; Cursor always-apply <<500).
- **Owner native-memory ban:** do not revive `~/.claude/**/memory/MEMORY.md`.
- **Cursor CLI advisor dormancy:** always-on files must carry the digest even if hooks never fire.
- **Shipped packets:** validators key on anchors, not constitutional rows. Plumbing can move without packet golden-snapshot churn **if** no required-doc is added.
- **Live DB counts:** UNKNOWN in this lineage (containment forbids mutating DB tooling).
- **BARTER.md / catalog link census:** incomplete; AGENTS.md/CLAUDE.md confirmed 6 paths × 2 files = 12 links.
- **Workstream A:** out of this lineage. Template merge of tasks.md + checklist.md must not be designed here.

---

## 7. INTEGRATION PATTERNS

### 7.1 What stays wired

- Gate 3 classifier, comment-hygiene.sh, git hooks.
- AGENTS.md/CLAUDE.md body (already always-on).
- content-router `decision` category and resume-ladder.
- Advisor `render.ts` three capsules (until an optional later dedup).

### 7.2 What unwires

- Default-ON `includeConstitutional` on `memory_search` / `memory_quick_search` / `memory_context`. [SOURCE: tool-schemas.ts:221-267,761] [SOURCE: memory-tools.ts:81]
- Indexer scanning `constitutional/` (`memory_index_scan`).
- MCP prime SQL `getConstitutionalMemories()` / `injectSessionPrimeHints`. [SOURCE: memory-surface.ts:153-187,407-463]
- `/memory:learn` constitutional CRUD (`.opencode/commands/memory/learn.md`).
- `IMPORTANCE_TIERS.constitutional` after writers are gone.
- `learned_triggers` independently via `SPECKIT_LEARN_FROM_SELECTION=false` once live count is confirmed.

### 7.3 Freshness (Q-B5)

Today's aging model is inverted: the constitutional tier never forgets (`decay: false`); ADRs accumulate with no global supersession; learned-triggers TTL is the wrong pattern for binding decisions. [SOURCE: importance-tiers.ts:33-70]

Replacement: two sections, not one decay flag.

- **Standing** — no decay; supersede by editing the digest / AGENTS.md; git is the audit log. Matches Cursor/CC.
- **Recent (rolling N)** — dated ADRs with explicit `supersedes: ADR-NNN`; drop from digest but keep in packet `decision-record.md`.

Do **not** apply FSRS / `decay: true` to in-force ADRs. Steal `last_confirmed` frontmatter as a CI-grep freshness hint, not a DB tier. [SOURCE: constitutional/comment-hygiene.md:4-6]

External analogue: RFCs are superseded by later RFCs (explicit), not decayed. Cursor rules stay until edited.

---

## 8. IMPLEMENTATION GUIDE

Safe sequence (fail-closed tests first):

1. **Observe** — metric for constitutional-row impressions vs total searches; confirm `learned_triggers` count (still UNKNOWN here).
2. **Flip search default** — `includeConstitutional` default `false` on search/context/quick_search. Keep the parameter. Tests: `gate-d-regression-constitutional-memory.vitest.ts`, stage1 tests, `token-budget-constitutional-sync.vitest.ts`.
3. **Stop indexing** constitutional dirs (`memory_index_scan` default false). Checkpoints.js already special-cases constitutional paths.
4. **Kill prime SQL** — `getConstitutionalMemories()` return `[]`; drop `injectSessionPrimeHints` constitutional count.
5. **Freeze then retarget or delete `/memory:learn`** — docs + `memory-learn-command-docs.vitest.ts`.
6. **Drop `IMPORTANCE_TIERS.constitutional`** after no writers. Rewrite or delete DB rows by `file_path LIKE '%/constitutional/%'`.
7. **Learned-triggers independently** — flag-off, later drop column.
8. **Delete or archive `constitutional/*.md` last** — after link retarget (section 9) and unique content is in the digest.

Rehome unique content into the digest (keep small): native-memory ban, bash-truncation trap, recorded-failure-must-route, maybe main-branch-direct-push. Skill-scope Fable/goal/co-occurrence via path-scoped vendor rules. Retarget the 6 AGENTS.md/CLAUDE.md links.

---

## 9. CODE EXAMPLES & SNIPPETS

Surfaces to change (names only; this lineage does not implement):

| Rank | Surface |
| --- | --- |
| 1 | `tool-schemas.ts`, `memory-tools.ts`, `memory-context` handler, `cli.js`, Stage 1, `vector-index-queries.ts` (`includeConstitutional` default false) |
| 2 | new `.opencode/DECISIONS.md`; `.cursor/rules/decisions.mdc`; one CLAUDE.md `@` line |
| 3 | `memory-surface.ts` `getConstitutionalMemories` / `primeSessionIfNeeded`; `context-server.ts` `injectSessionPrimeHints` |
| 4 | `.opencode/commands/memory/learn.md`, presentation asset, SKILL.md / install-guides / feature-catalog |
| 5 | `memory_index_scan` schema/handler, `checkpoints.js` constitutional path guard |
| 6 | AGENTS.md, CLAUDE.md, BARTER.md (if present), skill README (link retarget) |
| 7 | `importance-tiers.ts`, vector-index SQL, stage1 injection block |
| 8 | `render.ts` `renderAdvisorTimeoutFallback` (optional); optional stable pointer line |
| 9 | `learned-feedback.ts`, `SPECKIT_LEARN_FROM_SELECTION`, `/memory:manage` expire/clear |
| 10 | optional `/memory:decisions` as `memory_search` scoped to `decision-record.md` |

Do **not** touch: `gate-3-classifier.ts`, `check-comment-hygiene.sh`, content-router, resume-ladder, spec-doc templates/manifest (Workstream A).

---

## 10. TESTING & DEBUGGING

Memory MCP tests **will** fail if defaults flip without updates:

- `mcp-server/tests/gate-d-regression-constitutional-memory.vitest.ts`
- `token-budget-constitutional-sync.vitest.ts`
- stage1 tests that pass `includeConstitutional: true`
- `memory-tools.vitest.ts`
- `scoring-gaps.vitest.ts` (`shouldAlwaysSurface`)
- `memory-learn-command-docs.vitest.ts`

None of these are shipped-packet validators. Spec-packet golden snapshots stay green unless a required-doc is added (ruled out).

Negative control for implementation: ADR-shaped `memory_search` should stop returning constitutional files once the default is false.

---

## 11. RECOMMENDATIONS

Ranked by (value × risk). Machine-contract-safe: no required-doc / anchor / frontmatter change.

| Rank | Change | Value | Risk | Exact surfaces |
| --- | --- | --- | --- | --- |
| 1 | Default `includeConstitutional` to **false** on search/context/quick_search | High (stops ADR-query pollution; makes the tier inert) | Med (update constitutional tests in §10) | `tool-schemas.ts`, `memory-tools.ts`, `memory-context` handler, `cli.js`, Stage 1, `vector-index-queries.ts` |
| 2 | Add `.opencode/DECISIONS.md` + Cursor `alwaysApply` rule (+ optional CLAUDE `@` import) with **Standing** (native-memory ban, bash-truncation trap, recorded-failure-must-route, maybe main-branch-push) and **Recent** pointers to packet ADRs | High (active decisions surface, no MCP) | Low-med (token budget; keep tiny) | new files; `.cursor/rules/decisions.mdc`; one line in CLAUDE.md |
| 3 | Stop MCP prime constitutional SQL | Med | Low | `memory-surface.ts`; `context-server.ts` |
| 4 | Freeze then retarget or delete `/memory:learn` | Med | Med | `.opencode/commands/memory/learn.md` + docs tests |
| 5 | Stop indexer scanning `constitutional/` | Med | Low | `memory_index_scan`, `checkpoints.js` |
| 6 | Rehome unique content; retarget 6 AGENTS.md/CLAUDE.md links | High for correctness after delete | Med (missed links in BARTER.md / catalogs — census incomplete) | root docs, skill README |
| 7 | Drop `IMPORTANCE_TIERS.constitutional` + rewrite/delete DB rows | Cleanup | Med (SQL migrations, scoring tests) | `importance-tiers.ts`, vector-index SQL, stage1 |
| 8 | Keep `render.ts` 3 capsules; optional stable pointer; fix timeout fallback to include directives | Low-med | Low | `render.ts` |
| 9 | Learned-triggers: confirm 0 rows then flag-off / later drop column | Low if unused | Low | `learned-feedback.ts`, `SPECKIT_LEARN_FROM_SELECTION` |
| 10 | Optional `/memory:decisions` as `memory_search` scoped to `decision-record.md` with constitutional off | Med (cheap prior-decision query) | Low | new command or search.md route; **not** a new DB |

### Full-deprecation vs keep-rules-as-docs

- **Deprecate the system** (tier, flag, learn command, prime SQL, indexer path) **regardless.**
- **Keep the files as unindexed docs** only during the rehome window, or permanently for the six long-form files AGENTS.md still wants to cite **if** those long forms are not inlined. That is "keep some markdown," not "keep constitutional memory."
- **Delete the folder** once citations move and unique standing entries live in DECISIONS.md. Trigger-phrase search for those files going away is intended.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Constitutional markdown as the enforcement plane | Gate 3 classifier, comment-hygiene checker, and root docs enforce; README forbids rules driving runtime | `gate-3-classifier.ts`; `constitutional/README.md:86-88` | 1 |
| Unsetting `alwaysSurface` as deprecation | `shouldAlwaysSurface` has no production search-pipeline callers; `includeConstitutional` SQL remains | `importance-tiers.ts:194-196`; `vector-index-queries.ts:409-441` | 1, 5, 10 |
| `@`-imports to "save tokens" while loading constitutional files | Vendor docs: imports still load at launch | https://code.claude.com/docs/en/memory.md | 2 |
| Revive Claude native MEMORY.md | Owner ban 2026-05-31; would re-split the store | `constitutional/memory-system-spec-kit-only.md:22-38` | 2, 10 |
| MCP round-trip as every-turn decisions path | Requires a tool call; fail-open when daemon cold | `skill-advisor-hook.md:21-25` | 3, 8 |
| `render.ts` as the decisions store | TS edit per decision; lifecycle dedup fights a growing log | `render.ts:93-117`; `directive-lifecycle.ts:37-40` | 3, 8 |
| New required spec-doc (`decisions.md` per packet) as every-turn surface | Versioned template contract; shipped packets regress; packet files are not auto-loaded | Shared fact; `content-router.ts:23-32` | 3, 9, 10 |
| New SQLite decisions table | Duplicates packet ADRs; new validators | `content-router.ts:23-32` | 4 |
| Auto-roll every ADR into DECISIONS.md | Blows Claude 200-line / Cursor always-apply budgets (1462 headings) | Iter 2 budgets; iter 4 census | 4 |
| Merge ADRs into constitutional markdown | Keeps the failed search bus | Iter 1 | 4 |
| `learned_triggers` as a decisions log | 30-day TTL, selection-gated, 0.7x search boost — not a log | `learned-feedback.ts:92-96` | 4 |
| Big-bang delete of `constitutional/` on day one | Root-doc links and `/memory:learn` still expect the folder | `AGENTS.md:39-41`; `commands/memory/learn.md` | 5 |
| Dump all 20 files into AGENTS.md | Token budget; AGENTS.md already large | Iter 2 F-B2.3 | 6 |
| Assume "~16 links" are all in AGENTS.md | Only 6 paths × 2 root docs confirmed | `AGENTS.md:39-41` | 6 |
| FSRS / `IMPORTANCE_TIERS.normal.decay` on in-force ADRs | Would hide still-binding decisions | `importance-tiers.ts:33-70` | 7 |
| 30-day TTL on standing rules | Learned-triggers pattern is wrong for binding decisions | `learned-feedback.ts:92-96` | 7 |
| Silent overwrite of old ADRs | Breaks packet history / shipped-packet text | content-router `insert-new-adr` | 7 |
| Advisor hook `memory_search` every prompt | Reintroduces MCP; couples routing latency; misses Cursor CLI | `skill-advisor-hook.md:21-25`; `skill-routing.md:16-17` | 8 |
| Inline DECISIONS.md into advisor `additionalContext` | Token + timeout + Cursor CLI miss | `render.ts:441-476` | 8 |
| Reuse `constitutional/` as an indexed digest | Keeps the failed bus | Iter 1 | 9 |
| Advisor `matchedDocs` harvest as every-turn surface | Only on recommend; not every runtime | `skill-advisor-hook.md` | 9 |
| Keep-the-tier-but-fix-alwaysSurface | Flag is unused; the bus is wrong | Iter 1 F-B1.4 | 10 |
| Keep 20 files as the always-on store | Token budgets | Iter 2 | 10 |
| `specs/_global/decision-record.md` as always-on | Not loaded by Cursor/Claude unless imported | Iter 9 | 9 |

---

## 12. OPEN QUESTIONS

Key questions Q-B1–Q-B7 are answered. Remaining UNKNOWN follow-ups (not blockers for the verdict):

1. Live SQLite row counts for `learned_triggers` and indexed constitutional records (dispatch asserted 0 learned-trigger rows; this lineage did not query the DB).
2. Full citation census outside AGENTS.md/CLAUDE.md (BARTER.md, install-guides, feature-catalog playbooks).
3. Unique ADR-ID count vs 1462 headings vs dispatch 616.

---

## 13. FUTURE-PROOFING & MAINTENANCE

- Digest CI: keep `.opencode/DECISIONS.md` under N lines; require `supersedes:` IDs to exist in packet `decision-record.md`.
- `last_reviewed` on standing entries; grep reviews older than N days.
- Do not reintroduce a third indexed copy of rules that already live in AGENTS.md.
- If Workstream A later merges checklist files, that is a **separate** versioned contract and must not add a global decisions required-doc as a side effect.

---

## 14. API REFERENCE

Surfaces that constitute the constitutional system (to retire) vs the replacement:

| API / flag | Today | After |
| --- | --- | --- |
| `includeConstitutional` | default true on search/context | default false; keep parameter |
| `shouldAlwaysSurface()` | exported; test-only callers | delete with the tier |
| `getConstitutionalMemories()` | SQL LIMIT 10 on first MCP tool call | return `[]` then delete |
| `/memory:learn` | CRUD `constitutional/` | freeze / retarget to digest / delete |
| `SPECKIT_LEARN_FROM_SELECTION` | learned-triggers writer | `'false'` then drop column |
| `memory_search` | spec docs + constitutional injection | spec docs; optional decisions alias |
| content-router `decision` | L3 ADR insert / L2 decisions | **unchanged** |
| advisor `renderAdvisorBrief` | 3 hardcoded capsules | keep; optional hash-free pointer |

---

## 15. TROUBLESHOOTING GUIDE

| Symptom after implementation | Likely cause | Fix |
| --- | --- | --- |
| ADR search still returns constitutional files | a caller still passes `includeConstitutional: true` or Stage 1 injects SQL | grep remaining call sites; flip Stage 1 |
| AGENTS.md links 404 | files deleted before retarget | restore from git; finish rank 6 first |
| Subagent loses hygiene/governor/proof lines | capsules removed from `render.ts` while AGENTS.md is out of that context | keep capsules (rank 8) |
| Cursor CLI ignores digest | relied on `beforeSubmitPrompt` | alwaysApply `.mdc` must carry or point at the digest |
| Shipped `validate.sh --strict` fails | someone added a required spec-doc or changed anchors | revert; this research forbids that path |
| Digest blows token budget | auto-rolled ADRs | Standing + Recent pointers only |

---

## 16. ACKNOWLEDGEMENTS

### Internal sources
- `.opencode/skills/system-spec-kit/constitutional/` (20 files + README)
- `mcp-server/lib/scoring/importance-tiers.ts`
- `mcp-server/lib/search/vector-index-queries.ts`, `stage1-candidate-gen.ts`, `learned-feedback.ts`
- `mcp-server/hooks/memory-surface.ts`, `mcp-server/lib/resume/resume-ladder.ts`, `mcp-server/lib/routing/content-router.ts`
- `system-skill-advisor/mcp-server/lib/render.ts`, `hooks/skill-advisor-hook.md`, `hooks/lib/directive-lifecycle.ts`
- AGENTS.md / CLAUDE.md; `.cursor/rules/skill-routing.md`
- `.opencode/commands/memory/learn.md`

### External sources
- https://code.claude.com/docs/en/memory.md
- https://cursor.com/docs/context/rules

### Note
`resource-map.md` was not present at init; no placeholder reference is synthesized.

---

## 17. APPENDIX — Iteration trail

| Iter | Ratio | Focus | Outcome |
| --- | --- | --- | --- |
| 1 | 0.92 | Inventory + dispatch claims | Three systems real; enforcement not in files; `alwaysSurface` decorative; MCP prime live |
| 2 | 0.78 | Q-B1 active vs static | Vendor always-on bus vs search bus; native MEMORY.md stays banned |
| 3 | 0.70 | Q-B2 every-turn home | Hybrid digest + `render.ts` capsules |
| 4 | 0.62 | Q-B3 stores | Minimal set of 3; 536/1462 ADR census; search pollution |
| 5 | 0.58 | Q-B4 plumbing | 8-step sequence; spec packets do not regress |
| 6 | 0.55 | Q-B4 rehome | Unique loss is a handful of standing items, not all 20 |
| 7 | 0.48 | Q-B5 freshness | Standing vs Recent; no FSRS on ADRs |
| 8 | 0.40 | Q-B6 advisor | Keep capsules; no MCP read; optional hash-free pointer |
| 9 | 0.35 | Q-B7 placement | `.opencode/DECISIONS.md` + alwaysApply; no new spec-doc |
| 10 | 0.28 | Verdict | Full-deprecation of the **system**; keep-as-docs is leftover markdown |

Workstream A findings were not written to this `research.md`.
