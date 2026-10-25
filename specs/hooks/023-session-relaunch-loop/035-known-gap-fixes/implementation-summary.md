---
title: "Implementation Summary: Close eight known gaps in the session relaunch loop"
description: "All eight known gaps and the four pre-commit review findings are closed with failing-first tests, the session-relaunch concern can now be switched per runtime, and the test sandboxes no longer read the operator's shell. The packet stays In Progress until the change is committed and its SHA pinned."
trigger_phrases:
  - "known gap fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/035-known-gap-fixes"
    last_updated_at: "2026-10-25T21:18:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Pinned fix commit 6541f9284e and closed the packet"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/shared/hook-flags.cjs"
      - ".skilled/hooks/shared/hook-flags.sh"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/bin/skilled-loop"
      - ".skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts"
      - ".skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-035-known-gap-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Author goals for children 012 to 032 or split the parent goal, so check-goal stops reporting missing binding rows"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary: Close eight known gaps in the session relaunch loop

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-known-gap-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-25, fix commit `6541f9284e` on origin/main |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now keep in-session handover on for one runtime and off for another: `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` overrides the global flag for that runtime whenever it holds a value, and the kill switches still beat both. Seven more gaps closed beside it, each code fix with a test that failed first.

### Close eight known gaps in the session relaunch loop

The nudge now reads a claim seed through the core `parseClaimSeed`, so a note path holding the spec-folder marker parses one way everywhere. On Pi, a recorded provider that differs from the launch provider counts as a model switch for both `--provider X` and `X/model`, so the launch effort is dropped. `prepare` refuses inside and outside the loop whenever its runtime's concern is off, and prints no manual claim. The session-relaunch README Codex paragraph now says a manual claim exports the note's packet. The parent goal binds 033, 034 and 035 inside the 4,000-character budget. The root README has one short In-Session Handover section in place of the two Endless Sessions sections, and every operator surface names the per-runtime flags.

Every git call the spec validator reaches now passes `-c core.fsmonitor=false`. A new test traces that set from the code: `validate.sh`, the orchestrator, every `validator-registry.json` rule including the opt-in ones, and the helpers they import, source or run, 92 files in all. It failed first on the two git calls in `cli/validation/continuity-freshness.ts`, the only misses, and passes now that both spread the same `GIT_NO_FSMONITOR` constant the neighbouring helpers use.

### Review fixes under the 2026-10-25 scope amendment

A pre-commit review found four issues, and the operator approved fixing them in this packet. The `prepare` refusal now names the switch that decided, such as `SYSTEM_SESSION_RELAUNCH_DISABLED` or `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED`, exits 2 and runs before the note is read, so a refused `prepare` leaves the note's bytes unchanged. The shell reader now trims the runtime name and treats `MK_HOOKS_DISABLED` as the master switch, as the node readers do. The validator git-call matcher now catches git after `if`, `elif`, `while` and `until` and behind `VAR=value` prefixes. The session-relaunch README Pi bullet now states the provider rule and the no-provider limit.

The full gate then showed that the relaunch test sandboxes read the operator's shell. With `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported, 98 of 934 node tests failed. A shared helper, `.skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs`, now drops every relaunch, per-runtime, kill, master and goal switch and `HOOK_FLAGS_CONFIG` before a sandbox sets its own flags. It takes every name from `.skilled/hooks/shared/hook-flags.cjs`, so a runtime or alias the resolver adds is dropped too. Every relaunch sandbox, the OpenCode plugin test and the Pi vitest use it, and the `hook-flags.test.cjs` probes also drop `MK_HOOKS_DISABLED` and the goal names where they spawn readers. The full gate now passes in a clean environment, with the Claude flag off and with every switch exported.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Seed helpers delegate to `parseClaimSeed` |
| `.skilled/bin/skilled-loop` | Modified | `live_model_voids_launch_effort` compares the launch provider with the recorded one |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `prepare` checks the concern for its resolved runtime before it branches or reads the note, and names the deciding switch |
| `.skilled/hooks/shared/hook-flags.cjs`, `.mjs`, `.ts`, `.sh` | Modified | Per-runtime enable flag: `isHookEnabled(concern, env, config, { runtime })` and `hook_enabled <concern> [runtime]`; the shell reader trims the runtime and honours `MK_HOOKS_DISABLED` |
| `.skilled/hooks/session-relaunch/claude/*.mjs`, `codex/*.mjs`, `hermes/*.mjs`, `pi/session-relaunch.ts`, `.opencode/plugins/session-relaunch.js` | Modified | Each caller names its runtime |
| `.skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs` | Created | Drops every inherited relaunch, per-runtime, kill, master and goal switch and `HOOK_FLAGS_CONFIG`, names taken from the resolver |
| Every relaunch suite under `.skilled/hooks/session-relaunch/tests/`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`, `.skilled/hooks/session-relaunch/tests/README.md` | Modified | Each sandbox strips inherited switches before it sets its own; the tests README names the helper |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`, `skilled-loop.test.cjs`, `session-relaunch-cli.test.cjs`, `claude-adapters.test.cjs`, `.skilled/hooks/shared/hook-flags.test.cjs` | Modified | Failing-first tests for the parser, Pi provider, `prepare` refusal and note bytes, adapter silence and the four-reader precedence table |
| `check-source-tags-helper.mjs`, `check-ac-coverage.sh`, `check-spec-doc-integrity.sh`, sk-doc `cite-drift-scan.mjs` and its test | Modified | Git calls pass `-c core.fsmonitor=false`; the test's git shim reads past `-c` and `-C` |
| `.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts` | Modified | Both git calls spread `GIT_NO_FSMONITOR`; cli dist rebuilt |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts` | Created | Traces the validator file set and fails on any git call without the option, after control keywords and `VAR=value` prefixes too |
| `README.md`, `.env.example`, ENV-REFERENCE.md, `hook-flags.env.example`, `doctor-env.yaml`, three hook READMEs, `handoff.md`, three playbooks | Modified | Default-off and per-runtime documentation, and the Pi provider rule; ENV-REFERENCE count recounted to 188/192 |
| `specs/hooks/023-session-relaunch-loop/goal.md` and `spec.md` | Modified | Binding rows 033 to 035 and the phase 35 row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first (928 node, 59 vitest, 27 hook-flags, shell lint 0). Each code gap then got a red run and a green run saved in `scratch/` (gap1, gap2, gap3, g7). The orchestrator reran every gate from the final state: `closeout-node.txt` 932 pass, `closeout-vitest.txt` 59, `closeout-hookflags.txt` 28, `closeout-shell.txt` 0, `closeout-envdrift.txt` 5 of 5. Those runs used the operator's local `hook-flags.env` with ENABLED=1 and CLAUDE_ENABLED=0. A live check gave Claude off and the other six runtimes on.

The review fixes followed the same red-then-green order (`scratch/review-fix-*.txt`). The full gate from the amended tree passed in a clean environment (`scratch/final-gate-clean.txt`), but with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported the node leg failed 98 tests (`scratch/final-gate-claude0.txt`, exit 1). After the first hermetic fix, the hostile run with the goal kill switches also exported still failed four `skilled-loop` goal-hop tests and 38 Pi vitest cases (`scratch/final-tree-hostile.txt`, exit 1). A temporary probe, reported by the orchestrator with no saved log, showed `goal-handover.test.cjs` failing 5 of 8 with `OPENCODE_GOAL_DISABLED=1` before the goal names were dropped and 8 of 8 passing after. The final gate then ran in three environments (`scratch/final-green-clean.txt`, `-claude0.txt`, `-hostile.txt`, per-suite logs `scratch/final-green-<variant>-*.txt`), every leg exit 0 in each. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A set per-runtime flag decides its runtime, falsy included | An operator who writes `CLAUDE_ENABLED=0` means off even while the global flag is on |
| An empty per-runtime value counts as not set | A blanked line in `hook-flags.env` hands the answer back to the global flag instead of silently turning a runtime off |
| The nudge calls `parseClaimSeed` instead of keeping its own split | Two parsers already disagreed once, and one owner cannot |
| Record the 012 to 032 binding gap instead of adding rows | Those children hold no `goal.md`, the validator rejects a row with no target and 21 rows would break the 4,000-character budget |
| With relaunch off, `prepare` refuses before it checks `--session`, the note's path or the note itself, and only a missing `--handoff` is reported first | The refusal is the answer the operator needs, and a usage error for a missing note still names the one argument `prepare` cannot run without (judgement call) |
| A Pi launch naming no provider is a documented limit, not code | With a bare launch model there is no launch provider to compare, so the README states the limit instead of guessing one (judgement call) |
| `hook-flags.ts` is type-checked by an ad-hoc strict `tsc` run on the HEAD copy and the working tree | No tsconfig covers the file, so a before-and-after comparison is the only way to show no new error (judgement call) |
| Hermetic sandboxes go through one shared fixture, `tests/fixtures/relaunch-env.cjs`, not a strip list per suite | The fixture derives every name from `hook-flags.cjs` (the runtimes through `runtimeEnableFlag`, the global flag, the kill switch and its aliases, the master switch and its aliases), so a new runtime or alias is dropped without a test edit; the Pi vitest and the OpenCode plugin test use it too |
| The fixture also drops the goal concern's kill switch and aliases | The brief named only the relaunch and master switches, but a hop can start the next session on the goal command, which refuses while the goal concern is off, and the hostile run showed the goal hops failing on those switches (judgement call) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relaunch node suites, clean environment | PASS: `scratch/final-green-clean.txt` 934 pass 0 fail, exit 0 (baseline 928) |
| Relaunch node suites, `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported | PASS: `scratch/final-green-claude0.txt` 934 pass 0 fail, exit 0; red before the fix in `scratch/final-gate-claude0-node.txt` (836 pass 98 fail, exit 1) |
| Relaunch suites, every relaunch, master and goal switch exported | PASS: `scratch/final-green-hostile.txt` 934 pass 0 fail, exit 0, with all seven per-runtime flags `0`, `SYSTEM_SESSION_RELAUNCH_DISABLED=1`, `SYSTEM_HOOKS_DISABLED=1`, `MK_HOOKS_DISABLED=1`, `MK_GOAL_DISABLED=1` and `OPENCODE_GOAL_DISABLED=1`; red before the goal names were dropped in `scratch/final-tree-hostile.txt` (930 pass 4 fail, exit 1) |
| Pi vitest | PASS: 59 passed, exit 0, in all three `scratch/final-green-*.txt` runs; red under the hostile environment in `scratch/final-tree-hostile.txt` (38 failed 21 passed) |
| Hook-flags tests | PASS: 28 pass 0 fail, exit 0, in all three final runs (baseline 27) |
| Validator vitests | PASS: 13 passed 1 skipped, exit 0, in all three final runs |
| Wrapper and shell reader lint | PASS: `bash -n` on `skilled-loop` and `hook-flags.sh` and `shellcheck` 0 in all three final runs |
| ENV-REFERENCE drift | PASS: 5 of 5, exit 0, in all three final runs |
| Review fixes red then green | PASS: `scratch/review-fix-prepare-*.txt`, `scratch/review-fix-sh-*.txt` and `scratch/review-fix-matcher-*.txt` |
| `hook-flags.ts` types | PASS: `scratch/tsc-hookflags.txt` 53 errors against 54 at HEAD, no new error |
| README validation | PASS: `scratch/amend-doc-validate.txt` VALID, 0 issues, exit 0 |
| Strict validation | See `scratch/pre-commit-validate.txt` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A Pi launch with no `--provider` cannot compare providers.** With a bare model name there is no launch provider, so a provider change on that hop keeps the launch effort. The session-relaunch README states this limit.
2. **`hook-flags.sh` ignores per-concern legacy aliases for concerns other than session-relaunch.** Session-relaunch has no such alias, so its answer is unaffected. This follow-up was not done.
3. **The git-call matcher does not catch `env VAR=x git`.** A git call behind the `env` command is not flagged. This follow-up was not done.
4. **The `goal.cjs` refusal always names `OPENCODE_GOAL_DISABLED`.** It names that switch even when the master switch decided. This follow-up was not done.
5. **The parent `check-goal` still fails.** It reports `missing-binding-row` for 012 to 032, which hold no `goal.md`.

### Left for the operator

- Parent 023 goal rows for children 012 to 032, which hold no `goal.md`: author those goals or split the parent goal.
- Deleting the eight untracked Claude transcripts under `033-research-remediation/001-model-effort-atomic-replay/scratch/`.
- Parent 023 goal D6 still says phase work runs in an sk-git worktree, while phases 033 to 035 ran on `main`.
<!-- /ANCHOR:limitations -->

---
