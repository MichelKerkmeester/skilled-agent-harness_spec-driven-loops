# Iteration 1: D1 Correctness — Guard core semantics and adapter entry placement

## Focus
- Dimension: correctness
- Files: `.opencode/hooks/shared/hook-flags.{cjs,mjs,ts,test.cjs}`, `.opencode/hooks/dispatch/cursor/post-tool-use.mjs`, `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, `.opencode/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs`, `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-enforce.mjs`, `.pi/extensions/completion-evidence.ts`, `.pi/extensions/mcp-route-guard.ts`, `.opencode/plugins/mk-{goal,deep-loop-guard,spec-memory,speckit-completion,completion-sentinel,dist-freshness,codex-hooks-watchdog}.js`

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 13
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F001**: Cursor post-tool proxy spawns child processes for a disabled concern instead of skipping them at the parent, `.opencode/hooks/dispatch/cursor/post-tool-use.mjs:101`. The parent short-circuits only when BOTH `dispatch` and `post-edit-quality` are off (`if (!isHookEnabled('dispatch') && !isHookEnabled('post-edit-quality')) return approve();`). When exactly one concern is disabled, a `Write` or `Shell` event still `spawnSync`s the child (`claude-posttooluse.cjs` / `dispatch-audit-posttooluse.mjs`), which then no-ops at its own entry guard (`post-edit-quality/claude/claude-posttooluse.cjs:89`, `dispatch/claude/dispatch-audit-posttooluse.mjs:45`). Behaviorally correct (child guards are authoritative), but each disabled concern still costs a subprocess spawn per event. Recommendation: at the parent, gate each branch on its own `isHookEnabled(concern)` before spawning.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | shared/hook-flags.cjs, cursor proxy | Guard contract holds; minor efficiency gap |
| checklist_evidence | pending | hard | — | deferred to traceability iteration |

## Assessment
- New findings ratio: 1.00 (single new P2)
- Dimensions addressed: correctness
- Novelty justification: First pass over the guard core and entry placement; verified 7/7 tests pass (`node --test` exit 0), alias table matches the repo's env sweep (all `MK_*_DISABLED` / `SPECKIT_*_DISABLED` names found in-tree are either canonical derivations or registered legacy aliases), and every sampled adapter places `isHookEnabled` before any payload parsing or work (spec-gate claude `:56` before parse; completion pi `:53` before handler registration; dispatch pi `:22`/`:227`; git-preflight pi `:38`; goal cursor `:59`; mk-deep-loop-guard `:57`; dist-freshness `:132`; codex-watchdog `:64`).

## Ruled Out
- `isTruthy(1)` numeric handling: test suite explicitly asserts numeric `1` is falsey (`hook-flags.test.cjs:60`) and `process.env` values are always strings, so no P1/P0. Ruled out as intended strict-string parsing.
- `.mjs`/`.ts` facade drift: `.mjs`/`.ts` re-export via `createRequire` and the parity test passes (`hook-flags.test.cjs:63-77`). Ruled out.
- Master-switch bypass in `mk-goal.js`/`mk-spec-memory.js`: both use `options.enabled !== false && isHookEnabled(concern)` — master switch reaches them. Ruled out.

## Dead Ends
- None.

## Recommended Next Focus
D2 Security — fail-open posture of advisory adapters, master-switch silencing across all six runtimes, and the `permission-policy`/`codex-watchdog`/`dist-freshness` plugin boundaries.

Review verdict: PASS
