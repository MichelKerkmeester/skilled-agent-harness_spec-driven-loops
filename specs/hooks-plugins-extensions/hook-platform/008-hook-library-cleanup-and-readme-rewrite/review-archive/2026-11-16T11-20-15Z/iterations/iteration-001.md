# Deep Review — Iteration 001

## Dispatcher

- Mode: `review`; target agent: `@deep-review`; execution: single review iteration.
- Review target: `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite` (spec-folder target, 349 live files from `reviewScopeFiles`).
- Focus: correctness. Path existence after the phase 3 literal renames, and the behavior of the phase 6 worktree-guard and `quietOnSuccess` changes.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- Budget: 24 tool calls, stayed inside it.

## Dimension

Correctness — logic errors, broken invariants, off-by-one, wrong return values, and stale path or import resolution.

## Files Reviewed

- `.skilled/bin/install-codex-hooks.mjs:243-275` — `assertSafeRepoAnchor` worktree guard.
- `.skilled/bin/install-codex-hooks.mjs:317-344` — `main`, `--check` bypass and check-drift exit.
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:34-66` — `quietOnSuccess` check list and notification path.
- `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs:22-73` — `quietOnSuccess`, command resolution and failure text.
- Six Pi adapters, import blocks: `.skilled/hooks/completion-evidence/pi/completion-evidence.ts:12`, `.skilled/hooks/goal/pi/goal-context.ts:5-12`, `.skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts:8`, `.skilled/hooks/session-handover/pi/session-handover.ts:13`, `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts:11-12`, `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:9`.
- `.skilled/hooks/shared/` module listing — `hook-flags.mjs`, `hook-flags.cjs`, `dsh/dsh-llm.mjs` and `dsh/session-role.mjs` exist.
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/goal.md:49` — D2 amendment this phase implements.
- `005-closeout-follow-up-fixes/implementation-summary.md:57-80` and `006-codex-check-and-advisory-fixes/implementation-summary.md:59-80` — the claims checked against code.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

No finding has a case that produces a wrong result on this dimension. The observations that fell outside the declared scope or are frozen by decision are recorded under Edge Cases and Ruled Out rather than promoted to findings.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` (core) | pass | Root goal D2 amendment (`goal.md:49`) requires the Codex check to run in a worktree and Pi/DSH to show it only on failure. Code matches: `install-codex-hooks.mjs:322-324` passes the guard when `args.check`; `pi/session-start-advisories.ts:46-47,59` and `dsh/session-start-advisories.mjs:36-37,65-67` carry `quietOnSuccess` and suppress only zero-exit results. Phase 5's removed `.ts` fallback is supported by zero live-code hits for `hook-flags.ts`. |

`checklist_evidence` was not run this iteration and is left for the traceability pass rather than recorded as pending.

## Integration Evidence

- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` → `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` exit 0.
- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` → `PASS: 257 mirrors across 10 trees are in sync.` exit 0.
- Dead folder check: `.skilled/hooks/{git,codex-watchdog,hook-install,dispatch,task-dispatch,completion}` all report MISSING; `git ls-files .skilled/hooks/shared/hook-flags.ts` prints nothing; `ls -d .skilled/hooks/codex-global-hooks-check` exits 0.
- `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.pi/`, `.dsh/`, `.opencode/` registration surfaces are covered by the two sync checks above, which are the declared registration and mirror authorities.

## Edge Cases

- Two dated benchmark probe scripts still name the removed `dispatch/` folder: `.skilled/skills/cli-classifier/cli-jev/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.sh:18` and `preflight-probe2.sh:13` point at `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs`. They are historical raw evidence from a September run and are not in `reviewScopeFiles`; D3 keeps historical artifacts as written. Recorded as context, not a finding.
- `goal-context.ts` and `prompt-advisor.ts` import no hook flags at all; the phase 5 line "six Pi adapters, one import each" describes the edit set, not six hook-flag consumers. No dangling specifier follows from it.
- Pi uses concern `session-lifecycle` for the primary-reconcile check while DSH uses `primary-reconcile`. D1 freezes concern keys for operator-config compatibility, so the difference is recorded and not changed.
- A linked worktree still judges orphans against its own tree (phase 6 known limitation 1); that is why `--check` is the only mode allowed through the guard.

## Confirmed-Clean Surfaces

- Installer: `assertSafeRepoAnchor(repoAbs, args.allowWorktree || args.check)` skips the guard only for a check; the reconcile and `--dry-run` paths still reach the guard because `args.check` is false there (`install-codex-hooks.mjs:324,362-365`).
- Installer: `--check` reports drift on stderr and sets exit 1, and prints `OK` only on an unchanged document (`install-codex-hooks.mjs:336-343`), so the adapters have a failure signal to surface.
- DSH: `quietOnSuccess` resolves empty only when `!error`, and a failing check resolves `stderr || stdout || error.stderr` (`session-start-advisories.mjs:64-71`).
- Pi: a zero-code result is skipped for `quietOnSuccess`, all other results keep their first non-empty stream (`session-start-advisories.ts:57-61`).
- No live code file (`*.mjs`, `*.cjs`, `*.js`, `*.ts`) outside `specs/` references the removed `hook-flags.ts`; all relative imports inspected resolve to files on disk.

## Ruled Out

- Stale renamed-folder references in live code: the scoped `git grep` returned only the two historical benchmark probes above, both outside review scope.
- Dead or duplicate hook registrations: both sync checks PASS over 35 registry hooks, 22 Pi extensions and 257 mirrors.
- Broken package import after the fallback removal: the five adapters that use hook flags import `hook-flags.mjs`, which exists; the other two use only builtins and the Pi package.

## Next Focus

Iteration 2, security: the installer's atomic write, backup and `--check` paths (`.skilled/bin/install-codex-hooks.mjs:281-300,367-380`), the fail-open catch branches and 5s timeouts in the Pi and DSH advisories, and whether any changed hook reads a user-controlled path or environment value without validation.

## Verdict

PASS, no advisories. No active P0 or P1; the correctness surface for path existence and the phase 6 behavior change is clean.

Review verdict: PASS
