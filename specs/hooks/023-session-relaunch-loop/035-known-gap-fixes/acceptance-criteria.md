---
title: "Acceptance Criteria: Close eight known gaps in the session relaunch loop"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "known gap fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/035-known-gap-fixes"
    last_updated_at: "2026-10-25T22:10:00Z"
    last_updated_by: "evidence-worker"
    recent_action: "Marked AC-017 Met from the final gate"
    next_safe_action: "Commit, then pin the fix SHA in CHK-FIX-007 and mark the packet Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Close eight known gaps in the session relaunch loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/035-known-gap-fixes
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a claim seed whose note path holds the spec-folder marker, When the nudge reads the seed's note path and spec folder, Then both equal what `parseClaimSeed` returns for the same seed | New test `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:747` failed before the fix (`scratch/gap1-red.txt`, exit 1, nudge read `/tmp/odd` against `parseClaimSeed`) and passes after it (`scratch/gap1-green.txt`, 71 pass 0 fail, exit 0); still green in the final gate, node 934 pass 0 fail, exit 0, in `scratch/final-green-clean.txt`, `scratch/final-green-claude0.txt` and `scratch/final-green-hostile.txt` | Met | - |
| AC-002 | REQ-002 | Given a Pi launch with `--provider X` or `X/model` and a recorded provider other than `X`, When `live_model_voids_launch_effort` runs with no usable live effort, Then it succeeds and the launch effort is dropped; and Given a Hermes runtime or an empty launch model, Then it fails as before | New test `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1529` covers `--provider` and `X/model`: red in `scratch/gap2-red.txt` (launch `--thinking low` kept, exit 1), green in `scratch/gap2-green.txt` (179 pass 0 fail, exit 0) beside the Hermes rows; the test lives in `skilled-loop.test.cjs`, not `skilled-loop-shell.test.cjs`. Still green in the final gate: node 934 pass 0 fail, exit 0, in `scratch/final-green-clean.txt`, `-claude0.txt` and `-hostile.txt` | Met | - |
| AC-003 | REQ-003 | Given its runtime's concern off, When `prepare` runs inside and outside `skilled-loop`, Then each exits 2 before reading or editing the note, writes no record, prints no manual claim, leaves the note's bytes unchanged and names the deciding switch: the kill or master key, the falsy runtime flag, or both enable flags when nothing turned it on (amended 2026-10-25) | In and out of the loop: `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:437` (one identical refusal, no claim, no record), red in `scratch/gap3-red.txt` (outside exit 3, exit 1), green in `scratch/gap3-green.txt` (151 pass, exit 0). Deciding switch and note bytes: tests `prepare refusal names the flag that turned session relaunch off` (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:475`, four cases, exit 2 and exact stderr) and `a refused prepare leaves the note bytes unchanged` (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2461`), both red in `scratch/review-fix-prepare-red.txt` (0 pass 2 fail, exit 1: the generic message under a kill switch, and the note rewritten) and green in `scratch/review-fix-prepare-green.txt` (2 pass 0 fail, exit 0); the final gate stays green in all three variants, node 934 pass 0 fail, exit 0 (`scratch/final-green-clean.txt`, `-claude0.txt`, `-hostile.txt`) | Met | - |
| AC-004 | REQ-004 | Given the concern off and then on, When `keep`, `claim`, `cancel`, `complete` and `history` run, Then their output and exit status match the pre-change suite | The existing keep, claim, cancel, complete and history CLI tests pass in `scratch/gap3-green.txt:154` (151 of 151), in the closeout run `scratch/closeout-node.txt` (932 pass 0 fail) and in the final gate, node 934 pass 0 fail, exit 0, in `scratch/final-green-clean.txt`, `-claude0.txt` and `-hostile.txt` | Met | - |
| AC-005 | REQ-005 | Given the validator sources, When the G5 test scans every git call `validate.sh` makes directly or through a script it runs, Then each carries `-c core.fsmonitor=false` | New tests `.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:140` and `:147` trace the file set from `validate.sh`, the orchestrator, every `validator-registry.json` rule (opt-in ones included) and their imported, sourced or invoked helpers (92 files), then checks every git call in it. Red in `scratch/ac005-red.txt` (1 failed 1 passed, exit 1) naming the two `continuity-freshness.ts` git calls (pre-fix lines 312 and 329), the only misses; green in `scratch/ac005-green.txt` (2 passed, exit 0) after `.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:317` and `:334` spread the `GIT_NO_FSMONITOR` constant and the cli dist was rebuilt. The existing continuity-freshness suites still pass (cli 11 passed 1 skipped, runtime 7 passed, exit 0) | Met | - |
| AC-006 | REQ-006 | Given `SYSTEM_SESSION_RELAUNCH_ENABLED=1` and `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, When the resolver answers for each runtime, Then Claude is off and Pi, OpenCode and Codex are on; and Given the per-runtime flag only in `hook-flags.env` with the opposite value in the environment, Then the environment wins | Row `global on, claude off` (`.skilled/hooks/shared/hook-flags.test.cjs:509`, in the table test at `:497`) gives off for Claude and on for Pi, OpenCode and Codex: red in `scratch/g7-red.txt`, green in `scratch/g7-green.txt`, `scratch/closeout-hookflags.txt` and the final gate (hook-flags 28 pass 0 fail, exit 0, in `scratch/final-green-clean.txt`, `-claude0.txt` and `-hostile.txt`). The table has no env-against-file row for the same per-runtime flag, so the closeout probe `scratch/closeout-resolver-probe.txt` showed env `CLAUDE=1` over file `CLAUDE=0` and env `CLAUDE=0` over file `CLAUDE=1` win in the cjs, mjs and sh readers for all seven runtimes, exit 0 | Met | - |
| AC-007 | REQ-007 | Given a per-runtime flag and the global flag both truthy, When `SYSTEM_SESSION_RELAUNCH_DISABLED=1` or the master switch is set, Then every runtime is off | Kill and master rows in `.skilled/hooks/shared/hook-flags.test.cjs:511` and `:512` give off for every runtime (`scratch/closeout-hookflags.txt`); `scratch/closeout-resolver-probe.txt` adds the both-truthy case (global 1 and CLAUDE 1 with DISABLED or master 1): off for all seven runtimes in three readers | Met | - |
| AC-008 | REQ-008 | Given one table of runtime, env and file inputs, When the `.cjs`, `.mjs`, `.ts` and `.sh` readers each answer, Then every row gives the same answer in all four | The same seven-row table runs through `hook-flags.cjs`, `.mjs`, `.ts` and `.sh` with a deepEqual per reader (`.skilled/hooks/shared/hook-flags.test.cjs:497`): red in `scratch/g7-red.txt` (27 pass 1 fail), green in `scratch/g7-green.txt:28`, `scratch/closeout-hookflags.txt` and the final gate (28 pass 0 fail, exit 0, in all three `scratch/final-green-*.txt` variants) | Met | - |
| AC-009 | REQ-009 | Given the global flag on and one adapter's runtime flag `0`, When that adapter's hook runs, Then it emits and arms nothing; and every `isHookEnabled` session-relaunch caller names its runtime | Adapter test `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:373` red in `scratch/g7-red.txt` (context-nudge emitted the nudge) and green in `scratch/g7-green.txt` (exit 0); the closeout `rg` of `isHookEnabled(` outside tests shows a runtime on all 12 callers across claude, codex, hermes, pi, the OpenCode plugin and `prepare` | Met | - |
| AC-010 | REQ-010 | Given the session-relaunch README, When the Codex goal paragraph is read, Then it says a manual claim binds the note's packet and no line says no Codex receiver is handed a packet | `rg` for the old sentence in the session-relaunch README exits 1 with no output at closeout; the Codex paragraph (`.skilled/hooks/session-relaunch/README.md:188`) says a manual claim exports the note's packet as `SESSION_RELAUNCH_GOAL_PACKET`; `scratch/doc-validate.txt` shows the README VALID, 0 issues | Met | - |
| AC-011 | REQ-011 | Given the parent goal, When `goal.cjs packet specs/hooks/023-session-relaunch-loop` runs, Then it prints `packet_budget=ok` and the binding table has a row for every child that holds a `goal.md` | At closeout `goal.cjs packet` printed `packet_durable_chars=3997` and `packet_budget=ok`; the parent binding rows 001 to 011 and 033 to 035 (`specs/hooks/023-session-relaunch-loop/goal.md:80` is the 035 row) match the 14 children holding a `goal.md` on disk. `check-goal.cjs` still reports `missing-binding-row` for 012 to 032, which hold no `goal.md` (spec.md open question, parked for the operator) | Met | - |
| AC-012 | REQ-012 | Given the root README, When it is read, Then one short section says the handover ships off and shows the global and per-runtime switches, and no headline section features it | At closeout `rg` for `Endless Sessions` and `endless-sessions` in `README.md` prints nothing; the one section is `#### In-Session Handover` (`README.md:975`), which says it ships off and shows the global flag, the per-runtime `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` flag and the kill switches; every link that pointed at the old anchors now points at `#in-session-handover`; the feature list keeps one line saying it is off by default; `scratch/g8-doc-validate.txt` shows `README.md` VALID, 0 issues | Met | - |
| AC-013 | REQ-013 | Given ENV-REFERENCE.md, `.env.example`, `hook-flags.env.example`, `doctor-env.yaml`, the three hook READMEs and the three session-relaunch playbooks, When each is grepped, Then each names the per-runtime flags | At closeout `rg -c` for the per-runtime flag gives at least 1 hit in each of the ten files: ENV-REFERENCE.md 2 (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:100`), `.env.example` 2, `hook-flags.env.example` 1, `doctor-env.yaml` 1, session-relaunch README 4, shared README 2, hooks README 3 and each playbook 1; `scratch/g8-doc-validate.txt` shows each VALID and the yaml parses | Met | - |
| AC-014 | REQ-014 | Given the change set, When the relaunch node suites, the Pi vitest, the hook-flags tests and the validator tests run, Then each exits 0 at or above its baseline (928, 59, 27) with no assertion weakened, and `bash -n` and `shellcheck` on `skilled-loop` exit 0 | `scratch/closeout-node.txt:936` 932 pass 0 fail (baseline 928), `scratch/closeout-vitest.txt` 59 passed (baseline 59), `scratch/closeout-hookflags.txt` 28 pass 0 fail (baseline 27), `scratch/closeout-shell.txt` bash -n and shellcheck 0, `scratch/closeout-envdrift.txt` 5 of 5, `scratch/closeout-cite-drift-test.txt` 67 pass exit 0; the closeout files carry no exit line, so exit 0 there rests on the orchestrator's report and the 0 fail counts. The final gate from the final tree carries exit lines: in `scratch/final-green-clean.txt`, `scratch/final-green-claude0.txt` and `scratch/final-green-hostile.txt` (per-suite logs `scratch/final-green-<variant>-*.txt`) node 934 pass 0 fail, hook-flags 28 pass 0 fail, Pi vitest 59 passed, validator vitests 13 passed 1 skipped, env drift 5 of 5, `bash -n` on `skilled-loop` and `hook-flags.sh` and `shellcheck` 0, every one exit 0 | Met | - |
| AC-015 | REQ-015 | Given a runtime name with surrounding spaces, or `MK_HOOKS_DISABLED=1` in the environment or the file, When `hook-flags.sh` answers for session-relaunch, Then it trims the runtime and treats the alias as the master switch, giving the same answers as `hook-flags.cjs` | Rows `a runtime name with surrounding spaces still finds its switch` and `the legacy master alias beats every opt-in` (env and file) in `.skilled/hooks/shared/hook-flags.test.cjs:516` to `:518`: red in `scratch/review-fix-sh-red.txt` (27 pass 1 fail, exit 1, shell gave off for a spaced `pi` and on under `MK_HOOKS_DISABLED=1`), green in `scratch/review-fix-sh-green.txt` (28 pass 0 fail, exit 0, direct probes on and off, the spaced probe on under `/bin/bash` 3.2 as well, `bash -n` and `shellcheck` 0) | Met | - |
| AC-016 | REQ-016 | Given shell lines with git after `if`, `elif`, `while` or `until`, or behind `VAR=value` prefixes, When the validator git-call matcher reads them, Then it flags each call that lacks `core.fsmonitor=false` and flags no comment, echo string or `gitignore_check` line | Matcher at `.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:129` to `:131`: the probe in `scratch/review-fix-matcher-red.txt` missed six of seven wanted calls under the old regex (wrong=6, probe exit 1) and `scratch/review-fix-matcher-green.txt` caught all seven with no false flag (wrong=0, probe exit 0, at most 1 ms on lines up to 20,003 characters); the vitest passes, 2 passed, exit 0. The red file's vitest exit line was lost, so the red half rests on the probe | Met | - |
| AC-017 | REQ-017 | Given a clean environment, then `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported, then all seven per-runtime flags `0` plus `SYSTEM_SESSION_RELAUNCH_DISABLED=1` and `SYSTEM_HOOKS_DISABLED=1` exported, When the relaunch node suites, the Pi vitest and the hook-flags tests run, Then each exits 0 at or above its baseline | Red: `scratch/final-gate-claude0.txt:3` node exit 1, 836 pass 98 fail in `scratch/final-gate-claude0-node.txt`, with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported; then `scratch/final-tree-hostile.txt` with the goal kill switches also exported: node 930 pass 4 fail, exit 1 (the four `skilled-loop` goal-hop tests in `scratch/final-tree-hostile-node.txt`), Pi vitest 38 failed 21 passed, exit 1. Fix: `.skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs` derives every switch name from `.skilled/hooks/shared/hook-flags.cjs` and drops them plus `HOOK_FLAGS_CONFIG`; every relaunch sandbox, the OpenCode plugin test and the Pi vitest (`.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:62`) strip first and then set their own flags. Green: `scratch/hermetic-green-clean.txt`, `-claude0.txt` and `-hostile.txt` 934 pass 0 fail, EXIT=0 each; `scratch/hermetic-green-hostile-hookflags.txt` and `-clean-hookflags.txt` 28 pass, exit 0; `scratch/hostile-pi-vitest-green.txt` 59 passed and `scratch/hostile-goalhops-green.txt` 187 pass 0 fail (neither file records an exit line). Final gate in `scratch/final-green-clean.txt`, `-claude0.txt` and `-hostile.txt`: node 934 of 934, hook-flags 28 of 28, Pi vitest 59 of 59, validator vitests 13 passed 1 skipped, env drift 5 of 5, `bash -n` and `shellcheck` 0, every exit 0. The hostile run exports all seven per-runtime flags `0`, `SYSTEM_SESSION_RELAUNCH_DISABLED=1`, `SYSTEM_HOOKS_DISABLED=1`, `MK_HOOKS_DISABLED=1`, `MK_GOAL_DISABLED=1` and `OPENCODE_GOAL_DISABLED=1` (`scratch/final-green-hostile.txt:2` to `:13`) | Met | - |
| AC-018 | REQ-018 | Given the session-relaunch README, When the Pi bullet is read, Then it says a recorded provider other than the launch provider is a model switch and that a launch naming no provider keeps the launch thinking level on a same-model provider change | `.skilled/hooks/session-relaunch/README.md:43` states both, matching `live_model_voids_launch_effort` in `.skilled/bin/skilled-loop:244`; `scratch/amend-doc-validate.txt` shows the README VALID, 0 issues, exit 0 | Met | - |
| AC-019 | REQ-019 | Given no tsconfig covers `hook-flags.ts`, When a strict ad-hoc `tsc --noEmit` runs on it and the Pi extension for the HEAD copy and the working tree, Then the working tree has no error the HEAD copy lacks | `scratch/tsc-hookflags.txt:2`: working tree 53 errors, HEAD copy 54, and the normalized diff holds one line, a HEAD-only `import.meta` error. Every remaining error is environmental (node types not resolved, Pi handler parameters implicit any) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

No, not until the commit lands. All nineteen criteria are Met with observed evidence, AC-017 from the three final gate runs. The fix SHA is still to be pinned in CHK-FIX-007 when the change is committed, and the packet then moves to Complete.
<!-- /ANCHOR:closure -->
