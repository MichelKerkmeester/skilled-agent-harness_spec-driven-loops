# Iteration 002 — cluster 3a: deep-loop runtime code (VERIFIED)

**Pool:** native-a + native-b (sonnet) · **Focus:** verify + line-resolve `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`.

## Agreement: 1.0 (both seats identical line numbers + edit types)
**20 verified edit sites.** Implementation-ready touch list for the runtime code:

**`executor-config.ts`** (8 sites): EXECUTOR_KINDS:7 (drop token) · EXECUTOR_KIND_FLAG_SUPPORT['cli-devin']:40 · DEVIN_SUPPORTED_MODELS:46 (hard-codes swe-1.6) · DevinSupportedModel:47 · DevinPermissionMode:48 · resolveDevinPermissionMode fn:160-168 · model-required guard:194-198 · model-whitelist guard:242-255 · JSDoc 'gemini/devin':320.

**`executor-audit.ts`** (5 sites): BINARY_BY_KIND:51 · SESSION_ENV_BY_KIND:59 · STATE_ENV_BY_KIND:67 · DEFAULT_HOME_DIR_BY_KIND:75 · ENV_PREFIXES_BY_KIND:92 — all clean map-entry deletes.

**`fanout-run.cjs`** (5 sites, COUPLED): SPECKIT_STATE_ENV_BY_KIND:114 · buildLineageCommand cli-devin branch:330-342 (hard-codes `swe-1.6` at 336) · resolveDevinPermissionMode import:377 · resolvedDevinPermission local:432 · effectivePermission ternary:435→`resolvedPermission`.

## New findings vs iter-1
- **`resolveDevinPermissionMode` is a whole exported function** (not just types) — imported by fanout-run.cjs:377. Lines 377/432/435 are a coupled triad: remove together or permission resolution silently corrupts. [HARD]
- **New file:** `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` — swe-1.6 fixtures (`cognition-free`). Conditional edit (only if fallback-router is retained and swe-1.6 dropped).
- **swe-1.6 runtime footprint confirmed:** hard-coded ONLY at `fanout-run.cjs:336` (cli-devin branch default) + listed in `DEVIN_SUPPORTED_MODELS:46`. Both removed with the cli-devin code. No residual swe-1.6 literal in runtime code after.
- No `*.vitest.ts` for executor-config/executor-audit reference cli-devin (grep clean).

## Decision/Gap
- swe-1.6 confirmed cognition-exclusive at the runtime level too. Resolution still pending (iter 4 will check sk-prompt-small-model + any cli-opencode path).

new-agreement-eligible=4 (3 verified + 1 new file) → **CONTINUE**.
