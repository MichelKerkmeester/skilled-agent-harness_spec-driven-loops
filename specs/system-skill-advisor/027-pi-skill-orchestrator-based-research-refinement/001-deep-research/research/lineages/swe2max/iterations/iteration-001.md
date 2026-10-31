# Iteration 001 — Orchestrator core: lazy catalog, scope stub, pull-based skill_search

## Focus

Map the pi-skill-orchestrator's core mechanism surface: how the eager catalog is removed,
what the scope stub contains, how `skill_search`/`skill` tools pull metadata on demand,
and the bounded result contract. Orchestrator side of RQ1 and RQ2; seeds RQ5/RQ6.

## Actions Taken

- Read `docs/architecture.md` (125 lines) — design intent and context model.
- Read `src/catalog.ts` (189 lines) — skill-record hygiene and catalog strip logic.
- Read `src/scope.ts` (124 lines) — scope model, stub renderer, global fallback pool.
- Read `src/search.ts` (53 lines) — ranking function and result bound.
- Read `src/index.ts` (951 lines) — `before_agent_start` rewrite, tool registrations.
- Counted advisor-side catalog surface: 16 skills under `.claude/skills` (and `.skilled/skills`),
  name+description ≈ 2.6 KB before bodies — the eager block a Pi equivalent would carry.

## Findings

### F1 — The prompt never carries the catalog; it carries a constant-size stub [CONFIRMED]

`before_agent_start` resolves the active scope and calls `replaceNativeSkillCatalog`
(`src/index.ts:286-302`). The replacement is `renderScopeCatalog` output — five lines:
scope label, candidate count, "metadata intentionally omitted" notice, and fixed
`skill_search`/`skill` instructions (`src/scope.ts:104-117`). Size is O(1) in skill count;
the count is a number, not a list. If no native catalog exists the stub is appended
(`src/index.ts:321-325`).

### F2 — Catalog removal is conservative and multi-block aware [CONFIRMED]

`nativeSkillCatalogRanges` scans every `<available_skills>` block, requires either a known
skill `<name>` or Pi's preamble associated with that block (`src/catalog.ts:95-134`),
removes all of them, and inserts exactly one stub at the first removed position
(`src/catalog.ts:140-157`). When nothing is recognized as safely removable but
`containsPotentialNativeSkillCatalog` still flags a catalog-like block, the extension
warns once and returns the prompt unchanged rather than deleting unknown content
(`src/index.ts:309-318`, `src/catalog.ts:170-189`).

### F3 — Model pulls bounded metadata through `skill_search` [CONFIRMED]

Tool params: `query` (required), `limit` (integer 1–8, default 5), `scope`
(`active`|`global`) (`src/index.ts:588-595`). Ranking is `rankSkillRecordsBySearch`
(`src/index.ts:651`, `src/search.ts:41-53`): scores name-exact 200, name-prefix 80,
name-substring 60, description-substring 35, per-token name-exact 45 / name-contains 24,
description-token 8, word-boundary 4 (`src/search.ts:27-37`). Pure lexical scoring; no
embeddings, no recency, no usage stats.

### F4 — Zero-match auto-fallback + authorization set on fallback results [CONFIRMED]

When the active scope is `restricted` and active search returns zero matches, one
automatic global fallback runs (`src/index.ts:669-685`). `authorizeFallback` replaces
`fallbackRootNames` with exactly the names returned (`src/index.ts:617-620`); the set is
cleared on every new search (`src/index.ts:602`) and on every scope change
(`src/index.ts:196, 381-383, 419-420, 813`). The `skill` tool refuses an outside-scope
root not in `allowedNames` ∪ `fallbackRootNames` (`src/index.ts:723-734`).

### F5 — `skill` tool enforces authorization and loads a dependency bundle [CONFIRMED]

Loading a `disable-model-invocation` skill is refused (`src/index.ts:716-722`, flag
surfaced as `modelVisible` at `src/catalog.ts:38`). `loadBundle` → `loadRoots` resolves
`resolveDependencyGraph` per root (`src/index.ts:49-91`): DFS with cycle capture,
missing-name collection, auto-detected deps filtered to model-visible candidates
(`src/dependencies.ts:50-93`, esp. 77-83). Detection is 5 regex families over skill bodies
with a 64-char negation lookback (`src/dependencies.ts:8-38`).

### F6 — Description bounds are layered [CONFIRMED]

Index-time: control chars stripped, whitespace collapsed, 1024-char cap
(`src/catalog.ts:4-14`). Render-time: `catalogDescriptionMax` clamped 0–240 chars,
`0` = names only, ellipsis truncation (`src/index.ts:603-608`). Result count clamped
1–8, default 5 (`src/search.ts:46`, `src/index.ts:590`).

## Advisor-side anchor for RQ1 (preliminary)

This repo holds 16 skills in `.claude/skills` (and a mirrored set in `.skilled/skills`).
Name+description lines total ≈2.6 KB (~0.7–0.9 K tokens) before any body is read — the
eager block the orchestrator removes from Pi's prompt and the advisor's brief competes
with on Pi. Pi's native block also carries file locations (per `docs/architecture.md:11`),
making its eager cost higher than Claude's.

## Questions Answered

- RQ1 (orchestrator side): The extension spends ~5 stub lines per turn instead of the
  whole catalog; the stub replaces Pi's native block, it does not add to it.
- RQ2 (orchestrator side): Pull design = `skill_search` (bounded metadata) then `skill`
  (one root + deps). Failure surface: model may never search; ranking is lexical only.
- RQ5 (partial): Ranking signals enumerated — all lexical, weights fixed in code.
- RQ6 (partial): Bounds are 5/8 results + 0–240-char descriptions + 1024-char index cap.

## Questions Remaining

- RQ1 advisor side: token cost of the advisor brief per runtime; does the advisor's hook
  output coexist with a native skill block on Pi?
- RQ3: how profiles/groups config is authored (`src/profiles.ts`), group semantics.
- RQ4: whether `enhances`/`depends_on` edges exist in the advisor's skill graph.
- RQ7: atomic writes in `profiles.ts`, version-compat tests.

## Ruled Out

- Reading `src/ui.ts`, `src/autocomplete.ts`, `src/shortcuts.ts` in depth — TUI surface,
  not model-context routing. (Scope discipline; autocomplete is intentionally separate
  per `docs/architecture.md:82-88`.)

## Next Focus

Iteration 2: `src/profiles.ts`, `docs/groups-and-profiles.md`, `docs/dependencies.md`,
`docs/token-saver.md`, `src/skill-io.ts` — scope configuration model, dependency bundle
rendering, token-saver boundaries (RQ3, RQ4, RQ6 detail).
