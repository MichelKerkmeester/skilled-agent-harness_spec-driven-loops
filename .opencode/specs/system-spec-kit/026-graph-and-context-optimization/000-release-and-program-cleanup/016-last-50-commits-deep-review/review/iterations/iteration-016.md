# Iteration 016 — correctness / A2-deepen (settle latent findings)

## Dispatcher
- **Run:** 16 (parallel-worker slot; dispatch-assigned)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness | **Angle:** A2-deepen (settle latent F-A2-01 + F-A2-03)
- **Budget profile:** adjudicate (target 8-10 tool calls; used 8)
- **Review target:** git range `a9e9bdb0a5^..HEAD`, A2 surface in `system-spec-kit/mcp_server`
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-016.md` + `deltas/iter-016.jsonl`. Did NOT touch `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, or `deep-review-config.json`.

## Files Reviewed
- `handlers/memory-save.ts:2877` — re-confirmed skip-guard tests only `importance_tier === 'deprecated'` (carried from iter-003; not re-read in full this pass, anchor stable).
- `lib/search/hybrid-search.ts:2061` — search filter `importance_tier NOT IN ('deprecated', 'archived')` (the contract the guard diverges from).
- `lib/search/vector-index-schema.ts:2609` — **canonical create-table CHECK constraint** on `importance_tier`.
- `lib/storage/schema-downgrade.ts:135` — downgrade-path CHECK constraint (same tier set).
- `lib/search/vector-index-mutations.ts:500-560` — parameterized `importance_tier = ?` writer (`update_memory` path); guard logic.
- `lib/search/auto-promotion.ts:210-300` — `executeAutoPromotion` (upward-only) tier-write `.run(check.newTier, ...)`.
- `lib/storage/lineage-state.ts:453-470,1380` — `markHistoricalPredecessor` CASE writer + supersede deprecated writer.
- `handlers/chunking-orchestrator.ts:490-545` — chunk-reindex tier writer (`parsed.importanceTier`).
- `lib/cognitive/tier-classifier.ts:496,536` — `shouldArchive()` definition + export.
- `tool-schemas.ts:301` — `update_memory` MCP input schema (`importanceTier` enum + `additionalProperties:false`).
- `cli.ts:250` — `validTiers` allow-list.
- `handlers/save/response-builder.ts:488-552` — `classifySaveErrorCode` full precedence ladder.
- `formatters/search-results.ts:235,239`, `utils/validators.ts:125,129` — the only production throw-sites of literal `'access denied'`.
- `lib/errors/core.ts:307`, `core/db-state.ts:234` — EACCES/permanent-error handling vocabulary.

## Findings — New
No new findings. This is a deepen/settle pass on two pre-existing P2s (F-A2-01, F-A2-03). Both settle as **dormant P2 — neither rises to P1.** No severity change requested to shared registry (parallel-safety; settle verdicts recorded here + in delta for the reducer to reconcile).

### P0 Findings
None.

### P1 Findings
None. Both decider hypotheses (live archived-tier guard gap; OS-EACCES misroute into E089) were tested against actual writers/constraints and **refuted** (see Verdicts + Ruled Out).

### P2 Findings (re-affirmed, settled)

1. **[SETTLED — DORMANT] F-A2-01: background-enrichment skip-guard omits `archived` tier** — `handlers/memory-save.ts:2877` — The deferred-enrichment skip guard tests only `row.importance_tier === 'deprecated'`, while search hides BOTH `'deprecated'` and `'archived'` (`lib/search/hybrid-search.ts:2061`). The guard gap is real **but unreachable** — no code path persists `importance_tier='archived'`, and three independent layers make such a write impossible (see Verdict A). Held at **P2 latent**; does NOT rise to P1.
   - Finding class: latent-correctness / contract-divergence (dead path)
   - Scope proof: declared A2 target `handlers/memory-save.ts:2877`; counterevidence in declared cross-ref search/storage layers.
   - Affected surface hints: `handlers/memory-save.ts:2877` (guard); divergent contract at `hybrid-search.ts:2061`; activation would require adding `'archived'` to the tier CHECK at `vector-index-schema.ts:2609` AND a writer AND the MCP enum at `tool-schemas.ts:301`.

2. **[SETTLED — BENIGN] F-A2-03: `classifySaveErrorCode` E089 matches generic `'access denied'`** — `handlers/save/response-builder.ts:526` — The E089 (VALIDATION) branch matches `lower.includes('access denied')`. The hypothesized misroute (OS permission error captured as validation) does **not** occur: Node EACCES messages use `'permission denied'` (not `'access denied'`), and the only production throw-sites of the literal `'access denied'` are intentional path-safety validators that correctly belong in E089 (see Verdict B). Held at **P2 advisory** (over-broad-by-shape, currently harmless); does NOT rise to P1.
   - Finding class: correctness / error-classification over-broad-match (currently inert)
   - Scope proof: declared A2 target `handlers/save/response-builder.ts:526`; throw-site census in declared error/validation surfaces.
   - Affected surface hints: `response-builder.ts:511-530` precedence (DB E088 ordered before E089); throw-sites `formatters/search-results.ts:235,239`, `utils/validators.ts:125,129`; consumers pattern-matching E089 vs E081.

## Verdicts (deepen deciders)

### Verdict A — F-A2-01: DORMANT P2 (does NOT rise to P1)
**Decider question:** Does ANY code path (archiver, migration, retention sweep, importer, MCP handler) WRITE `importance_tier='archived'`?
**Answer: NO writer exists anywhere in `mcp_server` source.** Triple-locked barrier:

1. **Storage-layer CHECK constraint blocks it structurally.** The canonical create-table DDL `lib/search/vector-index-schema.ts:2609` declares `importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'))`. `'archived'` is absent → any INSERT/UPDATE setting it throws a SQLite CHECK violation. Same constraint at `lib/storage/schema-downgrade.ts:135`. No migration ever ADDs `'archived'` to the set (audit at `vector-index-schema.ts:1815` only checks for `constitutional` support; no archived-loosening `ALTER`).
2. **MCP boundary rejects it.** `tool-schemas.ts:301` (`update_memory`) declares `importanceTier` enum = the same 6 tiers with `additionalProperties:false`; `cli.ts:250` `validTiers` = same 6. `'archived'` cannot enter via the only user-facing tier-write tool.
3. **Census of every non-test `importance_tier` writer** (grep `SET importance_tier` / `importance_tier = ?` across `mcp_server`):
   - Literal writers → only `'deprecated'` (reconsolidation.ts:518, lineage-state.ts:1380, vector-index-schema.ts:509, pe-gating.ts:246) or `'critical'` (confidence-tracker.ts:264).
   - `lib/storage/lineage-state.ts:457` CASE → only `'deprecated'` or preserves `'constitutional'`.
   - `lib/search/auto-promotion.ts:247` → binds `check.newTier`; `executeAutoPromotion` doc + rules are "upward only, never demotes" (`normal→important→critical`) — never `'archived'`.
   - `lib/search/vector-index-mutations.ts:533` → binds `nextImportanceTier` derived from caller `importanceTier`; reachable only via the MCP enum (already rejects `'archived'`) and CHECK-constrained at commit.
   - `handlers/chunking-orchestrator.ts:500` → binds `parsed.importanceTier` from the parse/classify pipeline (one of the 6 valid tiers; CHECK-rejected otherwise).
   - The two `importance_tier: 'archived'` matches in the tree are **test fixtures only** (`tests/gate-d-regression-constitutional-memory.vitest.ts:149`, `tests/gate-d-regression-embedding-semantic-search.vitest.ts:52`) — they seed rows directly with `INSERT OR REPLACE` style fixtures, not via production writers, and are not part of the reviewed runtime path.
   - `lib/cognitive/tier-classifier.ts:496` `shouldArchive()` returns a boolean and is referenced ONLY by tests (`tier-classifier.vitest.ts`, `unit-tier-classifier-types.vitest.ts`) — **not wired to any persisting UPDATE.** Confirmed unwired/dormant.

**Conclusion:** The guard gap at memory-save.ts:2877 is a genuine contract divergence vs hybrid-search.ts:2061, but it guards a state that cannot be reached. To activate, someone would have to (a) add `'archived'` to the CHECK at vector-index-schema.ts:2609, (b) add it to the MCP enum at tool-schemas.ts:301, AND (c) wire `shouldArchive` (or another writer) to persist it — three coordinated changes. Stays **P2 latent** with that explicit activation trigger. Not P1.

### Verdict B — F-A2-03: BENIGN P2 (does NOT rise to P1)
**Decider question:** Does the `'access denied'` substring capture OS permission errors and misroute recovery?
**Answer: NO real misroute today.** Precedence + vocabulary settle it:

1. **Precedence (response-builder.ts:497-532):** E085 → E086 → E087 → E088 (DB/save-flow) → E089 (validation+path-safety) → E081. The DB branch (511-520: `sqlite`, `database error`, `database is locked` via E087 above it) is ordered **before** E089, so genuine DB-file errors win their code first.
2. **Node EACCES vocabulary:** Node fs throws `"EACCES: permission denied, open '<path>'"` — token `permission denied`, which the E089 branch does NOT match (`lower.includes('access denied')` is false for it). A real EACCES on the DB file therefore falls through to **E081 (honest catch-all)**, not E089. The codebase's own convention confirms the split: `lib/errors/core.ts:307` keys path-safety on `/access denied/i`, while `tests/errors-comprehensive.vitest.ts:204` maps `EACCES → "Permission denied."` — two distinct vocabularies.
3. **The only production throw-sites of literal `'access denied'`** are intentional path-safety validators: `formatters/search-results.ts:235,239` and `utils/validators.ts:125,129` (`'Access denied: Path outside allowed directories'` / `'Access denied: Invalid path pattern'`). These ARE validation/path-safety failures and correctly belong in E089.

**Conclusion:** No current writer produces an `'access denied'` message for a non-validation cause. The match is over-broad by *shape* (a future/third-party throw that hand-writes "access denied" for a non-validation reason would misroute), but no such site exists. Real misroute impact today = **none.** Stays **P2 advisory** (worth tightening to a more specific token like `'access denied: path'` if hardened later). Not P1.

## Traceability Checks
- **Iteration number:** Dispatch assigned slot 16 under an explicit parallel-safety contract (workers write only their own `iteration-NNN.md` + `iter-NNN.jsonl`; shared `deep-review-state.jsonl` is NOT updated per-worker). Shared state JSONL currently holds 2 `type:"iteration"` lines and 10 iteration artifacts exist — the JSONL-derived count (3) does NOT match the dispatch slot. Recorded as an ambiguity edge case; honored the dispatch slot (16) because the parallel-safety contract forbids me from appending to shared state and because `iteration-016.md` was absent (no collision). See Edge Cases #1.
- **Tier-write census closed:** every non-test `SET importance_tier` / `importance_tier = ?` writer in `mcp_server` enumerated and verified to be incapable of producing `'archived'` (Verdict A.3).
- **CHECK constraint verified in real schema (not just tests):** `vector-index-schema.ts:2609` + `schema-downgrade.ts:135`.
- **Error-code precedence verified:** full `classifySaveErrorCode` body read at response-builder.ts:495-533; DB branch precedes validation branch.

## Integration Evidence
- None requiring an external-surface naming claim. All evidence is intra-target code reads within `system-spec-kit/mcp_server` (handlers/lib/utils/formatters/tool-schemas/cli). No command/workflow/skill/MCP-tool/runtime-mirror coverage asserted this pass.

## Edge Cases
1. **Iteration-number mismatch (ambiguity).** Dispatch slot = 16; JSONL-derived = 3 (only 2 shared `type:"iteration"` lines); 10 iteration artifacts present. Cause = parallel-worker design where shared state is not updated by leaf workers. Safest in-scope resolution: honor dispatch slot, write only the two dispatch-named files, flag the mismatch here. No shared-state write attempted.
2. **Test fixtures seed `importance_tier: 'archived'` directly.** `gate-d-regression-*.vitest.ts` insert archived-tier rows bypassing production writers (and the MCP enum). This is test-only and does not represent a runtime writer — but it does prove the search-layer filter (hybrid-search.ts:2061) is *exercised* against archived rows, while the enrichment skip-guard (memory-save.ts:2877) is NOT covered for the archived case. Re-affirms the iter-003 carry-forward to A6 (test integrity): no test asserts the enrichment skip behavior for an archived row, because production cannot create one. Not a finding; coverage observation.
3. **F-A2-03 future-activation shape.** If any future or third-party throw-site emits a non-validation error containing the literal `'access denied'`, it would misroute to E089. No such site exists today; flagged so a later error-corpus pass (A7) can decide whether to tighten the substring to `'access denied: path'`.

## Confirmed-Clean Surfaces
- **`importance_tier` write surface (runtime):** no writer can persist `'archived'`; CHECK constraint + MCP enum + writer census all agree. Clean (guard gap is dead-path latent only).
- **Save-error classification routing for OS-permission errors:** EACCES → `permission denied` → E081 catch-all (honest), not E089. Clean.
- **Path-safety → E089 routing:** the deliberate `'Access denied: ...'` validators route correctly to E089. Clean.

## Ruled Out
- **F-A2-01 → P1 ("live archived-tier guard gap"):** REFUTED. No writer persists `'archived'`; storage CHECK constraint (vector-index-schema.ts:2609), MCP enum (tool-schemas.ts:301), and full writer census all block it. `shouldArchive` is unwired. Stays P2 latent.
- **F-A2-03 → P1 ("OS-EACCES misrouted to validation E089"):** REFUTED. Node EACCES messages use `permission denied` (not matched by E089); DB branch precedes E089; only deliberate path-safety throws carry the literal `'access denied'` and correctly belong in E089. Stays P2 advisory.

## Next Focus
- **Dimension:** correctness/traceability | **Angle:** A6 (test integrity for the archived-row enrichment skip) and A7 (error-code contract honesty / `access denied` substring tightening).
- **Focus area:** A6 — confirm there is intentionally NO enrichment-skip test for archived rows because production cannot create them (document the dead-path rationale so the guard is not "fixed" without first wiring a writer + CHECK + enum). A7 — decide whether to tighten E089 `'access denied'` to `'access denied: path'` to remove the latent over-broad-by-shape risk.
- **Reason:** Both A2 P2s are now settled as dormant/benign with explicit activation triggers; the remaining value is documenting the dead-path rationale (A6) and a cheap defensive tightening (A7), neither of which changes current behavior or severity.
- **Rotation status:** A2 fully settled (iter-003 found, iter-016 deepened). Carry-forwards: F-A2-01 → A6; F-A2-03 → A7.
- **Blocked/productive carry-forward:** Productive. No blocked approaches introduced.
- **Required evidence (A6/A7):** test-suite search for any archived-row enrichment assertion; throw-site corpus for any non-validation `'access denied'` producer.
