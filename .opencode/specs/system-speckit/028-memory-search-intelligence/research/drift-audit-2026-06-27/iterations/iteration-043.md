# Iteration 43 — kimi

**Angle:** Sweep `sk-prompt-models` profile registry and model cards for non-fixture opencode-go fallback paths left after the benchmark fixture hits.

**Findings:** 6

- **[P1] drift** `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md:165` — MiMo model card still recommends removed opencode-go free fallback
  - evidence: `fallback_target` | `null` | No automatic pool fallback defined; use `opencode/mimo-v2.5-free` (opencode-go) for cheap iteration when the primary pool is exhausted
  - fix: Delete the opencode-go fallback recommendation; cli-opencode v1.3.15.0 removed the free MiMo gateway path from operational surfaces.
- **[P1] drift** `.opencode/skills/sk-prompt-models/assets/model_profiles.json:192` — Registry still encodes removed opencode-go MiMo free path
  - evidence: "notes": "...Free cheap-iteration path: opencode/mimo-v2.5-free (opencode-go gateway, v2.5 tier). Context window 1,000,000 tokens..."
  - fix: Remove the opencode/mimo-v2.5-free (opencode-go gateway) sentence from the mimo-v2.5-pro executor notes and from capability.notes at line 206.
- **[P0] misalignment** `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:13-17` — Fallback router type expects model-level quota_pool that does not exist
  - evidence: `export type ModelProfile = { readonly id: string; readonly quota_pool: string; readonly fallback_target: string | null; };`
  - fix: Update ModelProfile to match model_profiles.json schema: derive the effective pool from `primary_quota_pool` and `executors[].quota_pool`, not a top-level `quota_pool` field.
- **[P0] drift** `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:9-14` — Fallback router tests exercise stale cli-devin registry
  - evidence: `{ id: 'deepseek-v4-pro', quota_pool: 'cognition-pro', fallback_target: null }`, plus `swe-1.6`, `kimi-k2.6`, `qwen3.6` — none of which match the current model_profiles.json.
  - fix: Rewrite the test fixture registry to use current model_profiles.json entries and pools (deepseek-api, opencode-go, kimi-for-coding, minimax-token-plan, xiaomi-token-plan).
- **[P1] misalignment** `.opencode/skills/sk-prompt-models/references/quota_fallback.md:99-141` — Quota-fallback algorithm documents schema incompatible with registry
  - evidence: Algorithm reads `failed.quota_pool` and pseudocode uses `failed.quota_pool` / `target.quota_pool`, but model_profiles.json stores pools inside `executors[].quota_pool` and `primary_quota_pool`.
  - fix: Update the documented algorithm and pseudocode to read the effective pool from `primary_quota_pool` (or active executor pool), matching the actual registry schema.
- **[P1] misalignment** `.opencode/skills/sk-prompt-models/references/models/deepseek-v4-pro.md:158` — DeepSeek profile lists cognition-pro pool absent from registry
  - evidence: `quota_pool` | `cognition-pro` (primary), `deepseek-api` (direct), `opencode-go` (go provider)`
  - fix: Remove `cognition-pro`; only list pools actually declared in model_profiles.json#deepseek-v4-pro (deepseek-api and opencode-go).
