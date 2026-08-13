# Iteration 2: D2 Security — Fail-open posture, master-switch silencing, plugin boundaries

## Focus
- Dimension: security
- Files: `.pi/extensions/{mcp-route-guard,task-dispatch-guard,completion-evidence,prompt-advisor,goal-context,git-preflight-advisory,spec-gate-enforce}.ts`, `.opencode/hooks/goal/cursor/goal-inject.mjs`, `.opencode/hooks/permission-policy/devin/permission-request-policy.mjs`, `.opencode/plugins/{mk-cli-dispatch-audit,mk-post-edit-quality,mk-skill-advisor,mk-spec-gate,mk-codex-hooks-watchdog}.js`, `.opencode/hooks/task-dispatch/claude/fable-subagent-guard.mjs`, `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`, `.opencode/bin/install-codex-hooks.mjs`, `.claude/settings.json`

## Scorecard
- Dimensions covered: security
- Files reviewed: 16
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F002**: SessionStart-wired Codex hook installer runs unconditionally and is outside the kill-switch surface, `.claude/settings.json` (SessionStart wiring) / `.opencode/bin/install-codex-hooks.mjs`. The installer reconciles versioned hooks into the user-global `~/.codex/hooks.json`; it is invoked from the Claude `SessionStart` hook chain and contains no `isHookEnabled` guard. This is a maintenance tool rather than a hook adapter (it does not inject or block per-turn content), so it is not a violation of the adapter kill-switch contract — but it is a write-capable utility wired into a per-session event that the master switch `MK_HOOKS_DISABLED` cannot silence. Recommendation: document the exclusion in `injection-contract.md` (or gate with the master switch if the intent is a full enforcement-layer silence).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | pi adapters, plugins | Fail-open posture verified |
| checklist_evidence | pending | hard | — | deferred to traceability iteration |

## Assessment
- New findings ratio: 1.00 (single new P2)
- Dimensions addressed: security
- Novelty justification: Verified every sampled adapter fails open (all Pi adapters wrap work in try/catch returning `undefined`/`approve()`; task-dispatch pi `:62` returns only `{reason}`, never `block`; completion pi `:80-82` fail-open; goal cursor `:60` `allow()`; permission-policy devin `:153` emits allow when disabled). Master switch reaches all plugins (`isHookEnabled` checks `MK_HOOKS_DISABLED` first). No secrets exposure in guard core or shared adapter helper (grep for api_key/secret/token: zero hits). Every Claude-settings-wired adapter file carries `isHookEnabled` except `install-codex-hooks.mjs` (installer, F002).

## Ruled Out
- P0/P1: No blocking-capable adapter bypasses the guard; `task-dispatch` pi is intentionally advisory-only and never returns `block: true`. Ruled out.
- Secrets exposure in `hook-adapter-shared.cjs` and `hook-flags.cjs`: grep for `api_key|apiKey|secret|token` returned zero. Ruled out.
- `install-codex-hooks.mjs` as an adapter-scope violation: it is an installer, not a per-turn hook adapter; the kill-switch contract applies to adapters. Downgraded from a potential P1 to P2 documentation gap.

## Dead Ends
- None.

## Recommended Next Focus
D3 Traceability — spec_code protocol: verify spec.md/plan.md/tasks.md claims against shipped implementation (guard count, symlink count, matrix accuracy, README/implementation-summary consistency).

Review verdict: PASS
