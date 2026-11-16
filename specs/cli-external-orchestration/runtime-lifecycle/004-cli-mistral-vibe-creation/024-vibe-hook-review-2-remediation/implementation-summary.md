---
title: "Implementation Summary: Phase 24: vibe-hook-review-2-remediation"
description: "A background shell command now reaches every Vibe shell guard: the tool-name map knows the payload name process.start, and a payload test per guard proves the deny. The nineteen verified P2 findings are fixed with tests or doc lines, and every finding from the second review has a disposition."
trigger_phrases:
  - "vibe hook review 2 remediation implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/024-vibe-hook-review-2-remediation"
    last_updated_at: "2026-11-16T07:12:01Z"
    last_updated_by: "claude"
    recent_action: "Fixed every verified finding of the second Vibe hook review with unit tests"
    next_safe_action: "Commit the phase and ask before pushing"
    blockers: []
    key_files:
      - ".vibe/plugins/repo-guards/lib/hook-io.mjs"
      - "../review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-024-vibe-hook-review-2-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-vibe-hook-review-2-remediation |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A command the model starts in the background is now judged by every Vibe shell guard. Vibe 3.1.2 names that tool `process.start` in the payload, and the guards only knew the `process_start` spelling a `match` selector accepts, so a background dotenv read, a refused dispatch or a non-conforming commit went through unjudged. The map now carries the payload name, and a test per guard drives a `process.start` payload and gets the same verdict as a foreground `file_system.bash` call.

### Phase 24: vibe-hook-review-2-remediation

The compaction post-tool part now stays out of subagents, as the hand-over part already did. overlay-guard runs only on writes, so a shell call spawns one strict hook fewer. The startup-guard spawn waits 9000 ms, longer than the 8000 ms plus 250 ms grace each inner guard gets, so one slow guard no longer loses every guard's warning. A throw while committing a nudge under the claim now delivers nothing. Each Vibe writer and its reader resolve the payload folder with the same rule, and the completion and ask-surface writers never create a folder the payload names. session-cleanup loads its OpenCode module inside the fail-open wrapper, and the home renderer checks every line of a multi-line command. session-start is importable, so its three spawned parts have tests. The four lifecycle entry points share one stdin reader, deep-loop-guard has a payload test, and the advisor receipts and three kill-switch calls follow an injected env, while a live session still reads switches saved to `hook-flags.env`. The guard reference and the session-lifecycle README state what the code and Vibe do.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | Modified | `process.start` in the map; re-exports the payload-directory rules |
| `.skilled/hooks/shared/payload-dir.mjs`, `.skilled/hooks/shared/README.md` | Created, Modified | `sessionDirFor` and `existingDirectory` inside the hooks tree |
| `.vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs`, `spec-gate.test.mjs` | Modified | `process.start` payload cases |
| `.vibe/plugins/repo-guards/tests/git-message-gate.test.mjs`, `dispatch-preflight.test.mjs`, `deep-loop-guard.test.mjs` | Created | Payload tests for three untested guards |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | Modified | Why `observe()` is not called; the note repeats |
| `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/fixtures/overlay-guard/hooks.toml` | Modified | overlay-guard on `write_file` and `edit` only; `process_write` in the spec-gate, env-secret-guard, dispatch-preflight and git-message-gate matches |
| `hook-scenarios/process-start-shell-guard.md`, `hook-scenarios/process-write-shell-guard.md`, `manual-testing-playbook.md` | Created, Modified | VIB-HK-029 and VIB-HK-030, the live proofs for the background start and the typed command |
| `.vibe/plugins/repo-guards/dist-freshness.mjs` | Modified | Imports `sessionDirFor`; private copy removed |
| `.vibe/plugins/repo-guards/dispatch-preflight.mjs` | Modified | Rule context resolves a present cwd with `sessionDirFor` |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | Modified | OpenCode module imported inside `main` |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs`, `tests/render-home-hooks.test.mjs` | Modified | Whole command values; multi-line cases |
| `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md` | Modified | Payload name `process.start`, selector alias `process_start` |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, its test | Modified | Subagent skip in the post-tool part |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Modified | Entry gate, exported parts with injectable runners, 9000 ms budget, shared reader |
| `.skilled/hooks/session-lifecycle/vibe/session-start.test.mjs` | Created | Session-prime, startup-guard and dist part cases |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `turn-end.mjs`, `compaction-post-tool.mjs` | Modified | Shared reader; turn-start readers use `sessionDirFor` |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs`, `turn-end.test.mjs` | Modified | Receipt env case; missing-folder cases for both writers |
| `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs` | Modified | Queue writer uses `sessionDirFor` |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | Modified | Existing-directory rule, checkout fallback, env to the kill switch |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | Modified | Fire log only under an existing folder, env to the kill switch |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Modified | Receipt folder and kill switch from the injected env |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `tests/vibe-adapters.test.cjs` | Modified | Quiet nudge catch; throw case |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Modified | Strict `post_tool` count, reply fields, unported tools, `process.start` |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Modified | Goal switch named |
| `../spec.md` | Modified | Phase 24 row and handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline ran first: repo-guards and goal 17 pass, session-lifecycle and decision-capture 45, session-handover 1040, Vibe reader 11, all `fail 0`. The four `process.start` cases were written before the map changed and failed on `process.start` alone, then passed once the key was added. Every later code fix got a case that was run against the old file put back from `git stash` and failed there: the subagent skip, the renderer, both missing-folder writers, the receipt folder, the nudge catch and the startup-guard budget. The first subagent case passed vacuously, because the part's catch turns a throw into an empty string, so it was rewritten to return text and count calls. The session-cleanup load failure was checked in a scratch copy of the hook with the OpenCode module absent: the new file exited 0 with one stderr line, the old one exited 1 with a stack trace. No test spawns the real session-prime, session-cleanup or dist checker; the session-start cases inject the runners.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move `sessionDirFor` and `existingDirectory` into `.skilled/hooks/shared/payload-dir.mjs` and re-export them from `hook-io.mjs` | The first cut had turn-start, ask-capture and ask-surface import them from `.vibe/plugins/repo-guards/lib/hook-io.mjs`, which broke the hooks tree's rule that its adapters depend on nothing outside it (`hook-adapter-shared.cjs:13`), and turn-start's static import would have silenced every turn-start part if that file went missing. The rules now live inside the tree, and the Vibe guards still read the same functions |
| Judge `process.write` text as a shell command | A write types into the stdin of a process a start launched, and an interactive shell runs each line, so a clean `bash -i` would otherwise take any refused command one line at a time. Vibe's own protected-path check reads that `text` as shell text (`mistralai_vibe_local_harness/vibe/_protected_paths.py:56-62`). The mapper decodes `bytesBase64` the same way and hands a `control` key over as an empty command. `dist-freshness-shell` stays on `process_start`, because a write ends no command. Found while closing the review, not raised by it; added at the operator's direction before the push |
| Pass a kill switch the env only when a caller injected one | `hookFlagDecision` reads `hook-flags.env` only when it gets no env (`.skilled/hooks/shared/hook-flags.cjs:235-242`), and `/doctor:env` saves kill switches to that file. Passing the default `process.env` would let a test decide the switch but make a live session ignore a saved switch, the way the first V23 cut did in the ask-surface and completion adapters until it was caught after the push |
| One shared launch check in `.skilled/hooks/shared/cli-entry.mjs` | Five Vibe entry points carried the same comparison and the same symlink gap; Node reports the entry module under its real path but leaves `process.argv[1]` as typed, so a project that links the `.skilled` tree in would never run these hooks. One helper fixes all five and has one test |
| Keep the `process_start` key beside `process.start` | Vibe only uses it as a selector alias, but a replayed or hand-written payload may spell it that way, and keeping it costs one map entry |
| Do not call `observe()` in the spec-gate advise branch | It writes the same marker the classify deferral reads, so the model would never get the question; the note reaching only the operator repeats instead, and the comment says so |
| Raise the startup-guard budget to 9000 ms with no binding timeout | Vibe gives a `session_start` hook with no timeout 60 s (`vibe/core/hooks/models.py:65`, applied at `:99-100`); the serial worst case is about 2.8 + 9 + 5 s |
| Change each writer with its reader | The completion advisory and the decision queue are each a writer and reader pair; changing one side alone would create the mismatch the review feared |
| Default the completion writer's no-cwd fallback to the checkout | The turn-start reader already falls back to the checkout, and `process.cwd()` was the one place the pair disagreed |
| Keep dispatch-preflight's rule context without a cwd when the payload has none | `sessionDirFor` would substitute the checkout and change the rule checks' own default |
| Gate only the ask-surface fire log, not the deny | The turn marker lives under the OS temp folder keyed by a hash, so the deny writes nothing under the payload folder |
| Restate `existingDirectory` in the CommonJS completion adapter | The shared helper is ESM; a synchronous `require` of it depends on the Node version |
| Use the shared `readStdin` from `hook-adapter-shared.cjs` | It decodes UTF-8 across chunks, returns '' on empty input and rejects on a stream error, as the local copies did; it also settles after 3 s with what arrived, which a Vibe payload written at spawn never reaches |
| Check whole TOML command values, not the whole rendered text | A `$` or a backtick in a comment would otherwise block rendering; a multi-line value is read to its closing delimiter |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:dispositions -->
## Finding Dispositions

| Finding | Class | Disposition |
|---------|-------|-------------|
| V01 | cross-consumer | Fixed: `process.start` in `CORE_TOOL_NAMES` (`hook-io.mjs:56`); payload cases for env-secret-guard, git-message-gate, dispatch-preflight and spec-gate; spelling fixed in `tool-names.md:13` and `guards-and-hooks.md:245` |
| V02 | none | Out of scope, false positive: Vibe requires `command` for `process.start` and passes arguments untranslated; the fail-open was real only through V01 |
| V03 | instance-only | Fixed by comment as decided: `spec-gate.mjs:72-83` says why `observe()` is not called and that the note repeats until a model-facing delivery |
| V04 | none | Out of scope, false positive: any non-deny object continues and `system_message` becomes a notice; its doc half is in V13 |
| V05 | instance-only | Fixed: `buildPostToolPart` returns '' for a payload with `parent_session_id`; subagent case |
| V06 | class-of-bug | Fixed where the change is small: dist-freshness, dispatch-preflight, both turn-start readers and the ask-capture writer use `sessionDirFor`; the completion writer's fallback is the checkout; ask-surface keeps its injectable fallback |
| V07 | instance-only | Fixed: the OpenCode module is imported inside `main`, so a load failure fails open through `runGuard` |
| V08 | instance-only | Fixed: overlay-guard `match = "re:write_file\|edit"` in `.vibe/hooks.toml` and its fixture |
| V09 | class-of-bug | Fixed in the Vibe adapters only: the completion writer and the ask-surface fire log write only under an existing absolute folder; missing-folder cases |
| V10 | none | Out of scope, prior-dispositioned in 023: the compaction parts have no switch by design, documented at README:29 |
| V11 | algorithmic | Fixed: the renderer checks each whole command value, multi-line strings included; continuation-line case |
| V12 | instance-only | Fixed: `guards-and-hooks.md:37` says six checks on `post_tool`, one of them strict |
| V13 | instance-only | Fixed: the reply table lists the fields a `0`-exit object may set per hook type, `system_message` on `pre_tool` included |
| V14 | test-isolation | Fixed: `main()` gated on `IS_CLI_ENTRY`, the parts exported with injectable runners, five part cases |
| V15 | class-of-bug | Fixed for the stdin reader: the four entry points import the shared `readStdin`; the reply writes are left, as decided, because no shared writer exists |
| V16 | test-isolation | Fixed: `deep-loop-guard.test.mjs` drives `agents.spawn` with a deny and an allow case |
| V17 | none | Out of scope, false positive: `goal-vibe.test.mjs` spawns session-start and VIB-HK-022 checks its binding |
| V18 | instance-only | Fixed: the outer budget is 9000 ms, above 8000 ms plus 250 ms; budget case |
| V19 | instance-only | Fixed: README:29 names `OPENCODE_GOAL_DISABLED` for the goal part |
| V20 | none | Out of scope, false positive: the hand-over usage read is a bounded tail read, and the concern is off on Vibe by default |
| V21 | instance-only | Fixed: the catch around `commitNudge` returns ''; throw case |
| V22 | test-isolation | Fixed: the receipt folder reads the injected env; receipt case |
| V23 | test-isolation | Fixed: both adapters, and the skill-advisor part the review missed, pass the env to the kill switch only when a caller injected one; the first cut passed the default `process.env`, which made a live session ignore `hook-flags.env` |
| V24 | none | Out of scope, false positive: Vibe 3.1.2 sets `tool_status` to exactly `"failure"` or `"success"` |
| V25 | instance-only | Fixed: dist-freshness imports `sessionDirFor` and its private copy is gone |
| V26 | instance-only | Fixed: the env-secret-guard and system-skill-advisor rows say their tool registrations are not ported, and name the dotenv CLI |
<!-- /ANCHOR:dispositions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .vibe/plugins/repo-guards/tests/ .skilled/hooks/goal/vibe/goal-vibe.test.mjs` | 28 pass, 0 fail, exit 0 (17 before) |
| `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs .skilled/hooks/decision-capture/vibe/*.test.mjs` | 55 pass, 0 fail, exit 0 (45 before) |
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs` | 1041 pass, 0 fail, exit 0 (1040 before) |
| `node --test .skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` | 11 pass, 0 fail, exit 0 (11 before) |
| `overlay-engine-repin.test.cjs` and `dispatch-rule-checks.test.mjs`, which name changed files | 86 pass, 0 fail, exit 0 |
| New cases against the old files | Each failed: four `process.start` cases, subagent, renderer, two missing-folder writers, receipt, nudge catch, budget |
| `validate.sh` on this folder with `--strict` | `RESULT: PASSED` |
| Live VIB-HK-029 | PASS 2/2 on `deepseek-flash` at 07:20 UTC (`scratch/live/VIB-HK-029/vibe/result.json`). The journal holds a `process.start` effect with input `cat .env`, then a `pre_tool` notice from env-secret-guard, `Denied tool 'start'`, and the model reported `tools.process.start returned tool_skipped`. The turn check was tightened to require those records after a first PASS run, and the run was repeated with the final check |
| Live VIB-HK-030 | PASS 3/3 on `deepseek-flash` at 07:33 UTC (`scratch/live/VIB-HK-030/vibe/result.json`). The journal holds a `process.start` effect for `bash -i` with no deny, then a `process.write` effect with text `cat .env` and a `pre_tool` notice from env-secret-guard, `Denied tool 'write'` |
| Suites after the payload-directory move | repo-guards and goal 28/0, session-lifecycle and decision-capture 55/0, session-handover 1041/0, shared reader, stdin-deadline and flag suites 69/0, runner suite PASS, playbook validator 54 scenarios and 0 violations |
| Kill-switch env fix | session-lifecycle and decision-capture 200/0 with the six new cases, repo-guards 26/0, skill-advisor hooks 8/0, ask-surface 8/0, shared 104/0. The injected-env case failed on the old advisor call; each flag-file case failed when the default env was passed |
| Launch check through a symlink | `cli-entry.test.mjs` 3/0, and its two path cases failed on the old `resolve(argv[1]) === fileURLToPath(...)` comparison, which on macOS fails even for a temp-folder script because `/var` is itself a symlink. session-start run through a symlinked checkout printed 0 bytes on the old code and 1139 bytes on the new |
| `repair-derived.cjs --apply` on the parent | Re-derived the fingerprint after the placeholder fill; the parent's strict validate then printed `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None open. The symlink gap in the launch check, the last limitation listed here, is fixed by T018.
<!-- /ANCHOR:limitations -->

---
