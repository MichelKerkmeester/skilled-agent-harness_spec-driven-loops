# Iteration 5: FooterMode / Config Persistence Maintainability

## Focus

Audit the versioned JSON config lifecycle (`parseFooterStatsMode` :1299, `parsePersistedCacheOptimizerConfig` :1307, `readPersistedFooterMode` :1317, `writePersistedFooterMode` :1335, `resolveFooterStatsMode` :1346), the in-process module cache, and whether the config surface can host the per-model remediations surfaced in iterations 2 and 4.

## Findings

**F5-1. No staleness bug: both command paths update the in-process cache and persist atomically.**
The CLI path (:8392-8395) and the interactive menu path (:9143-9146) both `await writePersistedFooterMode(nextMode)` (temp+rename atomic write, :1341-1343) and then set `persistedFooterStatsMode = nextMode`. `footerStatsMode()` reads the module var (:1355-1360), so the change is live immediately and survives reloads via the file. The tested precedence (config > env > default `total`) is verified by review-findings tests ("persistent configuration overrides the environment mode"). No stale-cache or race window beyond benign last-writer-wins. [SOURCE: index.ts:1335-1362, 8392-8395, 9143-9146]

**F5-2. All-or-nothing schema validation silently discards a corrupted or future config with no user-visible signal and no self-heal.**
`parsePersistedCacheOptimizerConfig` (:1307-1315) returns `undefined` if `version !== 1` OR if `footerMode` is present but invalid. `readPersistedFooterMode` (:1317-1333) then logs only a `console.warn` (suppressed for ENOENT) and falls back to env/default. A hand-edited config with a typo (`footerMode: "Total"`) or any future v2 file is silently ignored — the user gets default behavior with no notification and the corrupt file is never rewritten. For a config that will need per-model knobs (F2-2's prompt_cache_key opt-out, F4-1's repair scope), the strict `version !== 1` gate also means an older binary reading a v2 config drops everything silently — there is no forward-compat reader or migration path. [SOURCE: index.ts:1307-1333]

**F5-3. The config schema is single-key (footerMode only) — it cannot host the per-model toggles this research surfaced.**
`PersistedCacheOptimizerConfigV1` (:142-145) holds only `footerMode`. The concrete remediations from earlier iterations — a per-model `prompt_cache_key` injection opt-out (F2-2), and per-model control of the Anthropic TTL-repair scope (F4-1) — have no config surface today; both are expressible only via the global process env vars (`PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY`, `PI_CACHE_OPTIMIZER_OPENAI_CACHE_KEY`) or a persistent file schema that does not exist. The versioned-config mechanism is sound but under-utilized: it is a one-field config with a versioning ceremony designed for growth. [SOURCE: index.ts:142-145, 134-138]

**F5-4. Config/stats separation and write hygiene are sound.**
Config lives at `pi-cache-optimizer-config.json` in `STATE_DIR` beside the stats file (:132), written via temp+rename with pid+timestamp temp names (:1341-1343), and the module cache is kept in sync by the writer. No maintainability defect found in the write path itself. [SOURCE: index.ts:130-133, 1341-1343]

## Ruled Out

- A stale in-process footer-mode cache after `/cache-optimizer config footer-mode`: disproved — both write paths set the module var. Corrected from an initial hypothesis.

## Assessment

- **newInfoRatio**: 0.60 — F5-1/F5-4 are confirmations of sound design; F5-2 (silent discard, no forward-compat) and F5-3 (single-key schema can't host surfaced remediations) are the novel maintainability findings.
- **Confidence**: High for all four (direct control-flow proof).

## Reflection

- What worked: reading both command write paths confirmed in-process cache sync, killing the staleness hypothesis cheaply.
- What failed: nothing material — this iteration was largely confirmatory with two real maintainability findings.
- Ruled out: stale-cache bug.

## Recommended Next Focus

Iteration 6: test coverage breadth audit — inventory which provider paths are actually exercised in `tests/` (hook-guards, ownership-composition, review-findings) vs assumed, and confirm whether any non-DeepSeek provider usage normalization (OpenAI/Anthropic/Gemini raw readers, mimo/minimax/qwen/glm adapters) is tested at all.
