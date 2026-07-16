READ-ONLY deep-context verification seat. Analyze via Read/Grep only. Return ONLY the findings JSON as your FINAL message (after BINDING lines). Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = VERIFY + line-resolve the deep-loop runtime CODE sites (the [HARD] wiring — live TS/CJS that would break dispatch if a token is missed).

## shared current_focus — iteration 2 of 10 — SLICE cluster 3a: runtime code
Read these three files IN FULL and report EVERY exact line where `cli-devin`, `devin`, `DEVIN`, `DEVIN_`, or a Devin-specific const/type appears, with the precise edit needed:
1. `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` — EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT / SUPPORTED_DIMENSIONS, DEVIN_SUPPORTED_MODELS, DevinSupportedModel type, DevinPermissionMode type, any `kind === 'cli-devin'` guard/validation branch.
2. `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` — EXECUTOR_BINARY_BY_KIND, EXECUTOR_SESSION_ENV_BY_KIND, EXECUTOR_STATE_ENV_BY_KIND, EXECUTOR_DEFAULT_HOME_DIR_BY_KIND, EXECUTOR_ENV_PREFIX_BY_KIND, buildLineageCommand branch, effectivePermission ternary, any other cli-devin reference.
3. `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` — SPECKIT_*_STATE_DIR_BY_KIND maps, buildLineageCommand cli-devin branch, any DEVIN env handling.

For EACH site: confirm the exact line number(s), whether removal is a clean delete (whole map entry / whole branch) or an in-line edit, and whether removing it leaves any dangling reference (e.g. a type still referenced elsewhere). Also note any cli-devin reference in NEIGHBORING runtime files you encounter (e.g. multi-seat-dispatch.cjs, fanout-merge.cjs, executor-audit tests).

## known-context
- Iter 1 (both seats agreed) flagged: executor-config.ts (lines ~7,40,46-48,194,243-254), executor-audit.ts (~47,51,59,67,75,92,330,435), fanout-run.cjs (~114,330). VERIFY these exact numbers and find any missed sites.
- swe-1.6 is cognition-exclusive (DEVIN_SUPPORTED_MODELS includes swe-1.6) — note if the code hard-codes swe-1.6 anywhere.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path": "...", "symbol": "exact const/type/branch name", "kind": "integration_point",
    "reuse": "remove", "evidence": "path:line(s)", "relevance": 0.0,
    "classification": "active-wiring", "verified": true,
    "editType": "delete-map-entry|delete-branch|delete-const|inline-edit",
    "notes": "exact edit + any dangling-reference risk" }
] }
```
BINDING lines first (gatherSubject, slice=runtime-code, mode=context, specFolder=.opencode/specs/cli-external-orchestration/022-cli-devin-deprecation). Tool budget ~8-12.
