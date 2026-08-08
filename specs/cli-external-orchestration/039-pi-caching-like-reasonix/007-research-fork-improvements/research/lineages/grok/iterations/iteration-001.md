# Iteration 001 — Correctness: ownership boundary and silent paths

## Focus

Where can correctness still fail at the ownership boundary or inside each fork's mutation/telemetry paths?

## Actions Taken

- Read `isDeepPiOwned` / hook guards in `.pi/extensions/pi-cache-optimizer/index.ts`
- Read `isDeepPiModel` / drift warning / command path in `.pi/extensions/deep-pi/extensions/deeppi.ts` and `eligibility.ts`
- Read cost-math / usage recording in `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts`
- Cross-checked sibling 003/006 problem statements against live fork source

## Findings

1. **Duplicated ownership allowlists (correctness + sync risk).** `pi-cache-optimizer` hardcodes `isDeepPiOwned` as `provider === "deepseek" && (id === "deepseek-v4-flash" || id === "deepseek-v4-pro")` while `deep-pi` maintains a separate `DEEPPI_MODEL_IDS` set consumed by `isDeepPiModel`. There is no shared module or generated constant binding the two. Adding a third DeepSeek-direct id requires two independent edits; a one-sided update creates an orphan route (optimizer mutates while deep-pi is dormant, or neither acts). [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279-1281] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-18]

2. **Asymmetric drift signaling.** `deep-pi` warns once per session for unrecognized `deepseek` + `deepseek-v*` ids (`warnOnUnrecognizedModel`). `pi-cache-optimizer` has no complementary signal when a new DeepSeek-direct id is *not* in `isDeepPiOwned` — it will continue mutating that route under the broader `isDeepSeekLikeModel` advisory path only, while still treating ownership as false. New DeepSeek releases can silently reintroduce dual-mutation or no-optimizer gaps until both forks are updated. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:16-30] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1275-1281]

3. **`session_shutdown` remains unguarded by design.** The optimizer's global cleanup (`flushPersistCacheStats`, env restore, cache-hint teardown) always runs, including after DeepPi-owned sessions. Spec 003 documents this as intentional model-agnostic cleanup. Residual risk: if a session transitions models or if any DeepPi-owned path ever accumulated optimizer state before a guard, shutdown still flushes the shared stats file — worth a focused transition test (not currently a confirmed defect). [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7286-7295] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/spec.md:102]

4. **Six model-specific hooks are guarded; model resolution paths differ.** `session_start` uses `ctx.model` directly; `model_select` uses `event.model` (valid on that event); other hooks use `resolveRouteModel(ctx.model, ctx) ?? ctx.model`. Spec 003 already corrected the false `event.model` assumption for non-select hooks. Remaining correctness improvement: a single helper that resolves "active ownership model" identically for all six guarded hooks would prevent future divergence if a new hook is added with the wrong field. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7279-7541]

5. **Telemetry cost-math hardening is present but session-scoped.** `recordUsage` increments `costMathErrors` when `model.cost` or `usage.cost` is missing and does not corrupt totals — confirmed. Counters reset on `session_start` via `resetTelemetry`, so multi-session correctness depends on operator noticing in-session `/deeppi` / footer before reset. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:47-68] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:46-49]

## Questions Answered

- Ownership predicates are currently aligned on the same two ids, but they are independently defined — the primary correctness improvement is shared single-source-of-truth ownership.

## Questions Remaining

- Test coverage for model-transition + session_shutdown flush interactions
- How to surface deep-pi counters across sessions (telemetry angle)
- Cold-start cache-write behavior for newly added models (cost angle)

## Ruled Out

- Re-opening the narrow `provider === "deepseek"` predicate to blanket `isDeepSeekLikeModel` exclusion — that would orphan `opencode/deepseek-v4-flash-free` again (already decided in 003). [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/spec.md:86-91]

## Next Focus

Test-coverage inventory and gap analysis for both forks.

## Assessment

newInfoRatio high: duplicated allowlists and asymmetric drift signaling are concrete, source-backed improvement opportunities beyond the known open limitations. Convergence telemetry only; continue.
