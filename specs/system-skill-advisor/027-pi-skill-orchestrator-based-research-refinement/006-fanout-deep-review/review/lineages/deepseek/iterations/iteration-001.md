# Iteration 1: D1 Correctness — phase 2/3 hooks, deadlines, CLI fallback

## Focus

- **Dimension**: correctness (D1). Secondary lens: maintainability where dead or misleading code surfaced while tracing correctness paths.
- **Scope**: the phase 2 and phase 3 changed files from `goal-file-manifest.txt`:
  - spec-kit hook adapters and the Claude shim (`claude/user-prompt-submit.ts`, `codex/shared.ts`, `cursor/shared.ts`, `devin/shared.ts`)
  - advisor hook entry points (`hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts`), the CLI fallback caller (`hooks/lib/skill-advisor-cli-fallback.ts`), the runtime gate (`runtime/lib/skill-advisor-brief.ts`)
  - runtime CLI stale-daemon retry (`runtime/skill-advisor-cli.ts`), handler enrichment skip (`runtime/handlers/advisor-recommend.ts`), option schemas (`runtime/schemas/advisor-tool-schemas.ts`, `runtime/tools/advisor-recommend.ts`, `runtime/skill-advisor-cli-manifest.ts`)
  - runtime label source (`runtime/lib/advisor-runtime-values.ts`), diagnostics bounded log (`runtime/lib/metrics.ts`), lifecycle context (`hooks/lib/directive-lifecycle.ts`)
  - tests: `skill-advisor-cli-stale-daemon-retry.vitest.ts`, `handlers/advisor-recommend-compiled-route-option.vitest.ts` (read as behavioral evidence, not executed)
- **Method**: static read with nested-deadline arithmetic checked by hand (2800 ms adapter > 2500 ms shim kill > 2200 ms advisor budget), symbol-level caller search for every exported helper touched by phase 3, and re-read of cited evidence before recording.

## Scorecard

- Dimensions covered: correctness, maintainability (surface only)
- Files reviewed: 18
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (severity-weighted new = 2.0 over accumulated = 2.0; telemetry only, `stopPolicy=max-iterations`)

## Findings

### P0, Blocker

None. No correctness failure, security vulnerability, or spec contradiction found in the phase 2/3 surface.

### P1, Required

None.

### P2, Suggestion

- **F001**: Dead exported fallback-gate helper has no caller, `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:160`.
  `shouldTrySkillAdvisorCliFallback()` is exported from the hook-side CLI caller, but a repo-wide symbol search over `.skilled`, `.opencode` and `.pi` (source and compiled output) finds only its own definition and its `runtime/dist` twin — no import in `hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts`, `runtime/lib/skill-advisor-brief.ts`, the OpenCode plugin, or any test. The phase 3 spec moved the hook to the CLI front door directly, which removed the last consumer of a helper that existed to decide whether a layered native result should trigger a CLI retry. Today the export is dead surface that invites a future caller to re-introduce the retired layering. Recommendation: delete the export (and rebuild the dist copy), or wire it to a live consumer with a test if the layered path is still wanted somewhere.

- **F002**: Operator-set budget above the shim kill ceiling is silently ineffective, `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105-117`.
  The shim sets the child budget `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS = 2500 - 300` only when the variable is unset or empty, then spawns with `timeout: CHILD_TIMEOUT_MS` (2500) regardless. The advisor applies the operator value as its real CLI budget (`positiveIntFromEnv` → `claudeHookTimeoutMs()` → `buildCliBrief`). If an operator exports `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=5000`, the advisor believes it has 5000 ms, the shim kills the child at 2500 ms, and the turn produces `{}` — the exact lost-guardrail outcome phase 002 exists to eliminate, now reachable through the documented variable. The nested-deadline guarantee holds only for the unset/default case. Recommendation: clamp the pass-through to `CHILD_TIMEOUT_MS - margin` (and say so next to the variable), or document the 2500 ms ceiling explicitly. Severity is P2 because the default path is correct and the trigger is an operator override above the ceiling.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `003-hook-path-cli-spawn-trim/spec.md` REQ-001/REQ-005 vs. `handlers/advisor-recommend.ts:504`, `:573` and `skill-advisor-cli.ts:1421-1441` | Verified in this iteration for phase 3 R2/R5 claims: handler skip present on cached and fresh paths; CLI retries once on `-32602` naming `includeCompiledRoute`; daemon maps ZodError to `-32602` (`advisor-server.ts:293-294`) so a real older daemon is caught; unrelated invalid-params does not retry (test asserts exit 64). Deferred to iteration 3 for the full sweep across phases 002-005. |
| checklist_evidence | pending | hard | -- | Level 1 child phase; checklist presence checked in iteration 3. |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: correctness (maintainability observations recorded as P2)
- Novelty justification: first pass over this surface, so all findings are new by construction. Two P2 advisories, no P0/P1. The phase 2/3 mechanisms that the generation chain depends on were verified end-to-end: (a) nested deadline ordering 2800/2500/2200; (b) stale-daemon option retry condition and daemon error mapping; (c) casual-prompt gate reconnected ahead of the CLI call with injected `buildCliBrief` still reached only when the gate fires; (d) runtime label propagation through each adapter's `SPECKIT_RUNTIME` and the `ADVISOR_RUNTIME_VALUES` tuple; (e) Pi's dual import candidates (`.pi/extensions` loader path vs. realpath) with the fallback covering symbol resolution; (f) handler enrichment skipped on both cache hit and miss for `includeCompiledRoute: false` without leaking a previously enriched payload.

## Ruled Out

- **Shim's bounded stdin/stdout handling**: checked the `MAX_STDIN_BYTES + 1` chunk arithmetic, `INPUT_OVERFLOW` throw, `ENOBUFS`/`ETIMEDOUT`/`NONZERO_EXIT`/`INVALID_JSON` fail-open branches, and the absolute-file override guard — no boundary defect. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:42-146`)
- **Pi directive dedup eviction**: `MAX_TRACKED_SESSIONS`/`MAX_CAPTURED_SESSIONS` eviction only runs for unseen sessions and always leaves room for the incoming key; headless-brief normalization lets an identical directives block dedup with or without a head. (`hooks/pi/prompt-advisor.ts:18-32`, `:131-154`)
- **Local-scorer fallback recursion**: `runLocalScorer` forces the local env for one spawn and restores the prior value in `finally`; the retry only runs when `warmOnly` is false and rethrows the original failure otherwise. (`runtime/skill-advisor-cli.ts:1380-1400`, `:1442-1453`)
- **`metrics.ts` bounded-log comment**: the comment says the read-trim-rewrite amortizes, while the full read runs on every append. Cap is 200 records (~300 short lines), read cost is negligible and the trim/rename is crash-safe via temp-file rename. Not recorded as a finding; wording nit only. (`runtime/lib/metrics.ts:302-320`)

## Dead Ends

- **Searching for a Pi import-path defect**: the apparently dead `../../.skilled/...` first candidate is deliberate — the extension is loaded through the `.pi/extensions/prompt-advisor.ts` symlink (primary path resolves from the symlink location of record) and the `../../runtime/dist/...` fallback resolves from the realpath under `.skilled/.../hooks/pi/`. Phase 002 R7 requires a test for both. Not a defect.
- **Expecting the CLI's internal cold-start arithmetic to overrun the hook**: the hook-side caller owns its own kill timer at the caller budget and settles on signal/exit; any CLI-side overrun is bounded by that timer, which is inside the shim's kill. No finding.

## Recommended Next Focus

Iteration 2: D2 Security over the phase 3/4/5 output surfaces — `runtime/tools/advisor-recommend.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/skill-advisor-cli-manifest.ts`, `runtime/lib/render.ts`, `.opencode/plugins/system-skill-advisor.js`, `runtime/lib/metrics.ts` (diagnostic log content/paths), and the `containment`-adjacent path handling in `skill-advisor-cli-fallback.ts` and `workspace-root` resolution. Then iteration 3 covers D3 traceability + D4 maintainability across the deep-loop YAML `step_convergence_report`, `.pi/extensions/pi-cache-optimizer/index.ts`, docs and tests.

Review verdict: PASS
