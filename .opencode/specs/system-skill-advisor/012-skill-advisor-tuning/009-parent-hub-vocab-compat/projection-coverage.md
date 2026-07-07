# Advisor Projection-Surface Coverage Check

**Read-only measurement.** This artifact measures one gap: whether every parent-hub `mode-registry.json` alias reaches at least one field the advisor scorer actually consumes from its projection. The existing drift guard (`parent-hub-vocab-sync.cjs`) validates registry aliases against `hub-router.json` typed vocabulary and computes *graph trigger-phrase* coverage, but it never checks the scorer's projected surface. An alias can therefore be typed everywhere the guard looks (registry + hub-router + clean vocab-sync) yet have no direct phrase anchor the advisor can score on — "typed-but-unprojected".

**Source-truth caveat.** The advisor daemon runs a compiled `dist/` build, not these `.ts`/`.json` sources. Every line pin below is re-verified against the live TypeScript at analysis time, but pins drift; re-verify at gated-patch time and against the compiled bundle. The measurement below was computed by a read-only probe that mirrors the scorer's own `phraseVariants`/`matchesPhraseBoundary` semantics against the on-disk hub JSON + SKILL.md — it wrote nothing, ran no daemon, and executed no indexing/git/validate command.

**Method note.** "Projected direct anchor" = some projected phrase variant `P` satisfies `matchesPhraseBoundary(alias, P)` (i.e. `P` is a whole-word span of the alias), matching how the explicit/derived lanes fire when a user's whole prompt *is* the alias. This is the deterministic phrase-anchor test; token-overlap, BM25, and embedding lanes give softer partial credit and are noted where relevant, not counted as anchors.

---

## 1. What this measures

| Aspect | Value |
|--------|-------|
| Question | Does each `mode-registry.json` alias reach ≥1 scorer-consumed projected field (`intentSignals` / `derivedTriggers` / `derivedKeywords` / SKILL.md `keywords`), or is it typed-but-unprojected? |
| Hubs sampled | `sk-code`, `sk-design`, `deep-loop-workflows` (all three `{mode-registry, hub-router, graph-metadata}.json` + `SKILL.md`) |
| Guard under test | `.../deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` |
| Mutation class | READ-ONLY. No file created/edited except this report. `mcp_server/` read only, never written. |

---

## 2. Consumed-surface inventory

Every field the scorer projects from a hub, with re-verified `file:line`. Projection is assembled twice with identical field shape: the **SQLite path** (`projectionFromRow`, reads `skill_nodes` columns + `derived` JSON) and the **filesystem-fallback path** (`loadFilesystemProjection`, reads `graph-metadata.json`). `SKILL.md` keywords are read from disk via `parseSkillMarkdown` in **both** paths, never from the DB.

| Projected field | Source | SQLite pin | Filesystem pin (`:639`) | Consumed by (phrase-anchor lane) | Also consumed by (soft lanes) |
|-----------------|--------|------------|--------------------------|----------------------------------|-------------------------------|
| `intentSignals` | graph `intent_signals` (top-level column) | `projection.ts:232` | `projection.ts:679` | explicit `explicit.ts:327` | lexical `:70`, bm25 `:157`, semantic `:185` |
| `keywords` | SKILL.md `<!-- Keywords: … -->` comment via `parseSkillMarkdown` (`:195`/`:652`), parsed at `skill-markdown.ts:53-56` | `projection.ts:230` | `projection.ts:677` | explicit `explicit.ts:327` | lexical `:71`, bm25 `:155` |
| `derivedTriggers` | `derived.trigger_phrases` | `projection.ts:213-215` | `projection.ts:661-663` | derived `derived.ts:62` | bm25 `:158`, semantic `:186` |
| `derivedKeywords` | `derived.key_topics` ∪ `derived.entities` ∪ `derived.key_files` ∪ `derived.source_docs` | `projection.ts:216-221` | `projection.ts:664-669` | derived `derived.ts:62` (ONLY lane) | — |
| `domains` | graph `domains` | `projection.ts:231` | `projection.ts:678` | *(none — not a phrase anchor)* | lexical `:69/:82`, bm25 `:156`, semantic `:184` |

**Entities are dropped for all three hubs.** `sanitizeDerivedMetadata` filters `entities` to `typeof entry === 'string'` (`metadata-sanitizer.ts:60-67`), then `stringArray` filters again (`projection.ts:159-161`). All three hubs type `entities` as **objects** (`{name,kind,path,source}`), so the string filter yields `[]` — entity *names* like `sk-code`, `motion_dev`, `deep-loop-runtime` never reach `derivedKeywords`. Probe confirms: sk-code 4 entities → 0 kept; sk-design 2 → 0; deep-loop 3 → 0. Therefore effective `derivedKeywords = key_topics ∪ key_files ∪ source_docs`.

**Path-shaped keywords over-match risk.** `key_files` (absolute paths) and `source_docs` (doc names) pass `pathLike` sanitize (`metadata-sanitizer.ts:69-82`) then `phraseVariants`→`normalizeText` (`text.ts:19-27`) which strips `/._-` to spaces — e.g. `.../code-review/SKILL.md` becomes token phrase `code review skill md`. These land in `derivedKeywords` and are matched by the derived lane. This is why a coverage guard must NOT force `key_files`/`source_docs` into strict alias-typing (§4).

**Nested `derived.intent_signals` is orphaned.** The scorer reads only the *top-level* `intent_signals` column (`projection.ts:232`); the nested `derived.intent_signals` array (e.g. sk-code `graph-metadata.json:183-189` `implement code`/`fix bug`/`refactor`) is never projected. Not load-bearing for alias coverage but confirms a dead metadata field.

### Degraded-vs-healthy source — a coverage check must confirm HEALTHY

`loadAdvisorProjection` (`projection.ts:705`) distinguishes three cases (comment `:695-704`):

| Case | `source` tag | Meaning | Coverage-check implication |
|------|--------------|---------|-----------------------------|
| SQLite read OK | `sqlite` (`:630`) | indexed projection; may **lag** on-disk `graph-metadata.json` until reindex | The live runtime surface. Assert `source==='sqlite'` to claim the check matches production. |
| DB absent | `filesystem` (`:644/:692`) | legitimate first run; reads `graph-metadata.json` directly | On-disk truth. |
| SQLite read **threw** | `filesystem-fallback` (`:717`) + `fallbackReason` (`:718`) + `console.warn` (`:713`) | corrupt DB / schema drift; daemon degraded | A coverage pass/fail here measures the *fallback*, not the real surface — must be rejected as inconclusive. |

Because a coverage guard reading `graph-metadata.json` directly matches the *filesystem* projection exactly (same fields, same sanitizer), it is a faithful proxy for the fallback paths and a **conservative** proxy for the SQLite path (which can be staler, never fresher). To assert the *live* surface, the guard must also confirm `source==='sqlite'` and `!embeddingStaleness.stale` (`readAdvisorEmbeddingStaleness`, `projection.ts:545`, invoked `:612`) — though embedding staleness gates only the semantic lane, not the embedding-independent explicit/derived phrase anchors this report measures.

---

## 3. Per-mode coverage

Per hub: `|I|`=projected `intent_signals`, `|T|`=`derived.trigger_phrases`, `|K|`=`derivedKeywords`, `|kw|`=SKILL.md keywords, `|V|`=hub-router vocabulary classes (what the guard checks). "Unprojected" = no whole-word phrase anchor in `I∪T∪K∪kw`. Every unprojected alias below is also `aliasInRegistry=true` and `aliasTypedInHubRouter=true` (so vocab-sync passes it clean).

**sk-code** — `|I|=64 |T|=20 |K|=53 |kw|=30 |V|=88`

| Mode | Aliases | Unprojected | Dark (no anchor, no boost) | Boost-only (explicit.ts static table) |
|------|---------|-------------|-----------------------------|----------------------------------------|
| quality | 13 | 4 | `comment hygiene check`, `p0 p1 p2 author check` | `surface checklist` (TOKEN `checklist`) |
| code-review | 10 | 2 | — | `reviewer` (TOKEN `reviewer`), `pr-state gates` (TOKEN `pr`) |
| code-webflow | 3 | 0 | — | — (`webflow implementation` anchored by intent `webflow`) |
| code-opencode | 3 | 0 | — | — (`opencode system code` anchored by intent `opencode`) |

**sk-design** — `|I|=17 |T|=48 |K|=18 |kw|=110 |V|=158`

| Mode | Aliases | Unprojected | Dark | Boost-only |
|------|---------|-------------|------|------------|
| interface | 20 | 7 | `landing page direction`, `hero redesign`, `bolder`, `quieter`, `distill`, `clarify`, `delight` | — |
| foundations | 20 | 8 | `theme tokens`, `container queries`, `data visualization`, `chart type`, `data tables`, `token starter` | `context adaptation` (TOKEN `context`) |
| motion | 15 | 5 | `interaction states`, `hover state`, `focus state`, `loading state` | `motion budget` (TOKEN `motion`) |
| audit | 14 | 1 | `ai tell` | — |
| md-generator | 16 | 2 | `render design preview`, `source of truth` | — |
| design-mcp-open-design | 8 | 2 | `open-design` (hyphenated; spaced `open design` IS projected) | `od mcp` (TOKEN `mcp`) |

**deep-loop-workflows** — `|I|=9 |T|=23 |K|=27 |kw|=28 |V|=42`

| Mode | Aliases | Unprojected | Dark | Boost-only |
|------|---------|-------------|------|------------|
| research | 6 | 0 | — | — |
| review | 6 | 1 | `release-readiness` | — |
| ai-council | 5 | 1 | — | `planning council` (PHRASE `planning council` + TOKEN `council`) |
| agent-improvement | 6 | 2 | `agent scoring`, `promote or rollback agent change` | — |
| model-benchmark | 4 | 2 | — | `benchmark a model` (PHRASE), `prompt framework benchmark` (PHRASE) |
| skill-benchmark | 3 | 2 | `benchmark a skill` | `skill routing benchmark` (TOKEN `routing`) |
| ai-system-improvement | 3 | 1 | `package ai system benchmark` | — |

**Totals:** 155 aliases; 117 have a projection-derived phrase anchor; **38 have none**, of which **10 are rescued only by a hardcoded `explicit.ts` boost table** and **28 are genuinely dark** (rely only on soft token-overlap `derived.ts:86` / BM25 / embedding, or the hub's broad identity signals). The guard checks **0** of the 38 against the scorer surface.

---

## 4. Surface-appropriate strictness (rule a future gated guard should enforce)

The coverage guard must apply different strictness per vocabulary surface — uniform alias-typing would create false positives from path/doc noise and generic single words.

| Surface | Rule | Rationale (evidence) |
|---------|------|----------------------|
| **ALIAS** (`mode-registry.json` `aliases`) | STRICT: each alias must (a) map to mode ownership — already checked by vocab-sync `orphan-alias`/`ownership-drift` (`parent-hub-vocab-sync.cjs:349-361`) — AND (b) reach ≥1 phrase-anchor field (`intentSignals`/`derivedTriggers`/`derivedKeywords`/`keywords`), **except** declared alias-only transform verbs. | The (b) assertion is the missing check. Transform verbs `bolder/quieter/distill/clarify/delight` are declared `interfaceAliases`+`aliasOnly` (`sk-design/mode-registry.json:30-32`); projecting these common English words as intent signals would over-match every prompt — their darkness is correct-by-design and must be **exempted**, not flagged. |
| **KEYWORD** (`derived.key_topics`, SKILL.md keywords) | Collision / over-match checks ONLY. Not required to be alias-typed. | Keywords legitimately exceed the alias set (sk-design has 110 SKILL.md keywords vs 93 aliases); demanding 1:1 alias-typing would be noise. |
| **ENTITY / path** (`derived.key_files`, `source_docs`, `entities`) | Collision / over-match checks ONLY; never alias-typing. | `key_files` are absolute paths, `source_docs` are doc names; `normalizeText` (`text.ts:19-27`) turns them into token phrases (e.g. `code review skill md`) that would over-match `review`-shaped prompts. `entities` are objects already dropped by the sanitizer (`metadata-sanitizer.ts:60-67`), so alias-typing them is meaningless. |
| **filesystem-fallback path** | The same coverage assertion applies unchanged, because `loadFilesystemProjection` (`projection.ts:639`) projects the identical field shape from `graph-metadata.json`. The guard must additionally reject `source==='filesystem-fallback'` (`:717`) as inconclusive and prefer `source==='sqlite'` for a live-surface claim. | Fallback = degraded SQLite read; coverage measured on it describes the fallback, not production (§2). |

---

## 5. Findings & recommended assertions (recommendations only — no edits)

**F1 — 28 genuinely-dark aliases pass the guard but have no scorer phrase anchor.** Concrete list (hub/mode: alias): sk-code/quality: `comment hygiene check`, `p0 p1 p2 author check`; sk-design/interface: `landing page direction`, `hero redesign`, `bolder`, `quieter`, `distill`, `clarify`, `delight`; sk-design/foundations: `theme tokens`, `container queries`, `data visualization`, `chart type`, `data tables`, `token starter`; sk-design/motion: `interaction states`, `hover state`, `focus state`, `loading state`; sk-design/audit: `ai tell`; sk-design/md-generator: `render design preview`, `source of truth`; sk-design/design-mcp-open-design: `open-design`; deep-loop/review: `release-readiness`; deep-loop/agent-improvement: `agent scoring`, `promote or rollback agent change`; deep-loop/skill-benchmark: `benchmark a skill`; deep-loop/ai-system-improvement: `package ai system benchmark`.

**F2 — Of these, the transform verbs (`bolder/quieter/distill/clarify/delight`) are correct-by-design exemptions**, not defects (§4). A guard that flags them without honoring `transformVerbRouting.aliasOnly` would emit false positives. Net *defect* candidates ≈ 23.

**F3 — 10 aliases route only via a hand-maintained static boost table** (`explicit.ts` `PHRASE_BOOSTS`/`TOKEN_BOOSTS`), not the projection: e.g. `benchmark a model`/`prompt framework benchmark`/`planning council` (PHRASE), `surface checklist`/`reviewer`/`pr-state gates`/`od mcp`/`motion budget`/`context adaptation`/`skill routing benchmark` (TOKEN). These are reachable but brittle — the projection does not cover them, so a projection-only coverage guard would still flag them; treat boost-coverage as a mitigating annotation, not a pass.

**F4 — Hyphenation inconsistency.** `open-design` is dark while sibling alias `open design` is projected (`sk-design/graph-metadata.json` intent `open design`), because `phraseVariants` (`text.ts:40-50`) expands hyphen→space but not space→hyphen, and the alias literal keeps its hyphen. Same class: any alias whose only projected form differs by a hyphen the variant expansion doesn't reach.

**Recommended per-mode assertions for the future (gated) guard:**
- **A1** For each registry alias not in `transformVerbRouting.aliasOnly`, assert `∃ P ∈ (intentSignals ∪ derivedTriggers ∪ derivedKeywords ∪ keywords)` with `matchesPhraseBoundary(alias, P)`; else emit `typed-but-unprojected` (P2 — routing-soft, not a hard drift).
- **A2** Read the projection through the same `phraseVariants`/sanitizer pipeline (drop object-shaped entities; expand hyphen/underscore variants) so the check matches runtime, not raw JSON.
- **A3** Gate the assertion on `source==='sqlite' && !embeddingStaleness.stale`; on `filesystem-fallback` report `inconclusive`, not pass/fail.
- **A4** Keep KEYWORD/ENTITY/path surfaces on collision/over-match checks only (no alias-typing requirement).
- **A5** Optionally annotate (not fail) aliases covered solely by `explicit.ts` boosts, to flag projection debt.

---

## 6. Coverage note — what was actually read

| File | Lines relied on |
|------|-----------------|
| `mcp_server/lib/scorer/projection.ts` | field maps `:213-221`, `:230-232`; SQLite assembly `:596-633`; filesystem-fallback `:639-693` (maps `:661-669`,`:677-679`); degraded fallback `:695-721`; embedding staleness `:545-561` |
| `mcp_server/lib/scorer/lanes/explicit.ts` | consume `intentSignals`+`keywords` `:327`; `skillNameVariants` `:322`; `PHRASE_BOOSTS`/`TOKEN_BOOSTS` `:18-236`; `lower.includes` `:267`, token loop `:273-277` |
| `mcp_server/lib/scorer/lanes/derived.ts` | consume `derivedTriggers`+`derivedKeywords` `:62`; `matchesPhraseBoundary` `:72-76`; token-overlap `:86` |
| `mcp_server/lib/scorer/lanes/{lexical,bm25,semantic-shadow}.ts` | `domains`/`intentSignals`/`keywords`/`derivedTriggers` consumption (lexical `:69-71`, bm25 `:155-158`, semantic `:184-186`) |
| `mcp_server/lib/scorer/text.ts` | `phraseVariants` `:40-50`, `matchesPhraseBoundary` `:63-68`, `normalizeText` `:19-27`, `scoreTokenOverlap` `:79-100` |
| `mcp_server/lib/skill-graph/metadata-sanitizer.ts` | entities string-filter `:60-67`; path sanitize `:69-82` |
| `mcp_server/lib/utils/skill-markdown.ts` | `<!-- Keywords -->` parse `:53-56` |
| `deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | `graphTriggerPhrases` `:130-137`; registry aliases `:165-180`; orphan/ownership `:349-361`; collisions `:363-379`; `triggerPhraseCoverage` `:397-403` |
| `{sk-code,sk-design,deep-loop-workflows}/{mode-registry,hub-router,graph-metadata}.json` + `SKILL.md` | all aliases, `vocabularyClasses`, `derived`/`intent_signals`, `<!-- Keywords -->` |
