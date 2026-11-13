---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. Every behaviour run line now records the offered command, its policy and brief delivery, the scorer reports an attributable start rate and Codex and DSH have install steps with read-only doctor checks. AC-008 is Superseded by ADR-001 and every other criterion is Met."
trigger_phrases:
  - "reachability and attribution implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution"
    last_updated_at: "2026-11-13T04:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed phase 10 with the implementation summary"
    next_safe_action: "Operator approves the Codex hooks for one arena, then run one Codex smoke row"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-reachability-and-attribution"
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
| **Spec Folder** | 010-reachability-and-attribution |
| **Completed** | 2026-11-13. AC-001 to AC-007 and AC-009 to AC-014 are `Met`. AC-008 is `Superseded` by ADR-001 |
| **Commit** | `a57ce61a13` landed this phase's code. Phase 007's after arm ran its 144 turns at `ae06ccb118`, which contains it |
| **Level** | 2 |
| **Verified on** | The working tree over `HEAD` `ae06ccb118` on 2026-11-13, with other phases' uncommitted edits under `.skilled` present at the time |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A behaviour run now says what the advisor offered and whether the brief reached the model, so a declined command and a command that was never offered are two separate numbers. Codex and DSH, the two runtimes that could not receive a brief on a normal install, now have install steps and a doctor check that tells the user when the advisor's hook is not wired or not approved.

### Attribution

The new module `command-offer.mjs` replays the Claude prompt hook inside a run's checkout after the turn and reads the first slash command and its `run`, `start` or `ask` policy from the brief head. It decides `briefDelivered` from Claude's raw transcript or Pi's records and answers `"unknown"` for the other runtimes. The runner writes `offeredCommand`, `offeredPolicy` and `briefDelivered` on every line and gained a `--backfill <log> --out <new-log>` mode that refuses `same_path` and a holdout row before it writes. The scorer resolves `/doctor:git hooks` to `doctor/git.md`, keeps capped runs out of the start rate as `cappedStartRows`, counts `offered`, `startedOfOffered` and `offerUnknown`, flags `armIncomplete` and counts rows, starts and writes per policy in `byPolicy`.

### Reachability

`INSTALL-SKILLED.md` now tells a Codex user to approve the project hooks through `/hooks` and lists DSH among seven runtimes. `codex-hook-approval-check.cjs` reads the Codex config and prints `PASS codex-hooks-approved` or `WARN codex-hooks-unapproved` without printing a hash or writing a file, and `/doctor:runtime-mirrors` runs it. `hook-wiring-check.cjs` reports `hook-missing <runtime>` for a target repository whose Claude, Codex, Cursor or Devin hook file lacks the prompt entry, and `/doctor:symlink check` runs it. The DSH bundle registers the prompt advisor unless its row flag is `false`.

### Cold Start

The cold first prompt was measured before any change. Both measurements read fail-open 0 of 5, so the warm-up and the probe timeout were not built.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `DS` is `.skilled/commands/doctor/scripts`.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/scripts/routing-accuracy/command-offer.mjs` | Created | `parseOffer`, `replayOffer`, `briefDelivered` and `backfillRunLog` |
| `ADV/tests/command-offer.vitest.ts` | Created | Cases for the four functions |
| `ADV/scripts/routing-accuracy/run-command-behaviour.mjs` | Modified | Three fields per run line and the `--backfill` mode |
| `ADV/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | Argued route, capped apart, offered counts, incomplete arm and per-policy counts |
| `ADV/tests/command-transcript-score.vitest.ts` | Modified | One case per scorer change |
| `ADV/scripts/routing-accuracy/README.md` | Modified | The fields, the mode and the summary keys |
| `INSTALL-SKILLED.md` | Modified | The Codex `/hooks` step and DSH |
| `.dsh/plugins/repo-guards/index.mjs`, `tests/bundle.test.mjs`, `README.md`, `adapters/README.md` | Modified | The advisor stays on unless its row flag is `false` |
| `DS/codex-hook-approval-check.cjs`, `DS/tests/codex-hook-approval-check.test.cjs` | Created | Read-only Codex approval check |
| `DS/hook-wiring-check.cjs`, `DS/tests/hook-wiring-check.test.cjs` | Created | Read-only prompt-hook wiring check |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `doctor-symlink-check.yaml` | Modified | Call the two checks |
| `DS/README.markdown` | Modified | List the two checks |
| `scratch/` | Created | Before numbers, socket key, cold-start probe and results, backfill fixture, attributed log and summary, worker briefs and logs, `closing-evidence.txt` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran T001 itself. DeepSeek v4.1 flash workers at max effort, reached through OpenCode Go, then built T002 to T023 in six waves. `scratch/briefs/` holds 22 briefs and the worker logs in `scratch/logs/` name the provider `opencode-go` and the model `deepseek-v4.1-flash-1017`. The orchestrator verified each wave, ran the true cold-start arena behind the T024 to T026 drop, ran T027 to T030 and T033 and recorded the closing evidence in `scratch/closing-evidence.txt` on 2026-11-13. T034 reran every local check listed below from the repository root.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replay the Claude prompt hook after the turn to read the offer | The renderer is shared by every runtime, and a replay after the restore cannot warm the daemon for the turn it describes |
| `briefDelivered` is decided only from Claude's raw transcript and Pi's records | Those are the stores where the brief is visible today. The rest read `"unknown"` rather than a guess |
| Keep capped runs out of the start rate | A run that hit its cap never had the chance to start the command |
| Drop T024 to T026 | Both cold-start measurements read fail-open 0 of 5 |
| Move T031 and T032 to the packet's operator list (ADR-001) | Approving Codex hooks writes the operator's own `~/.codex/config.toml`. Taken autonomously under the goal's rule D1, not by the operator |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Rows marked "rerun" ran from the repository root during closure on 2026-11-13. The other rows quote `scratch/closing-evidence.txt` or the named scratch file.

| Check | Result |
|-------|--------|
| `FLOOR` (rerun) | `{"correct":24,"total":44}` and `{"count":0,"total":35}` |
| `npm run typecheck` in `ADV` (rerun) | Exit 0 |
| `VT` and `VO` (rerun) | 49 passed and 11 passed, exit 0 |
| `node --test $CKT $HWT` (rerun) | tests 6, pass 6, fail 0 |
| `DCT` (rerun) | tests 43, pass 43, fail 0 |
| DSH bundle test (rerun) | tests 5, pass 5, fail 0 |
| `sync-hook-registrations.cjs --check` (rerun) | `PASS: 4 registration files match the 35-hook registry`, exit 0 |
| `node $HW --root .` (rerun) | `ok claude`, `ok codex`, `ok cursor`, `ok devin`, exit 0 |
| `node $CK --root .` with `shasum -a 256 ~/.codex/config.toml` around it (rerun) | `WARN codex-hooks-unapproved .` and the repair line, exit 1. The digest prefix read `ac6ef2b5ae14` before and after |
| Codex check on an after-arm arena and on the operator-approved main checkout | `WARN codex-hooks-unapproved <arena>` and `PASS codex-hooks-approved`. The config digest read `c27a6a3a9d46` before and after |
| `rg -c "offeredCommand\|offeredPolicy\|briefDelivered" $R` (rerun) | 5 |
| Keys of the 144 after-arm lines (rerun) | All 144 hold the three fields. The 24 Codex lines read `[true,true,true]` for the three `has` checks |
| Backfill fixture `jq` and the same-path call (rerun) | `{"offerBackfilled":true,"briefDelivered":"unknown","offerError":null,"has":true}`, then a line with `"offerError":"no_checkout"`. Same path printed `same_path` and exited 2 |
| Before arm backfill (rerun) | 144 lines in and out, `git diff --quiet HEAD -- $PRE` exit 0. `claude` and `pi` read `true` on 24 lines each, the other four runtimes read `unknown` on 24 each |
| Summary keys on `PRE` (rerun) | Claude `{"offered":0,"startedOfOffered":0,"offerUnknown":12}`. OpenCode `{"startRate":"2 of 7","cappedStartRows":5}`. `armIncomplete` list `[]`. Claude `byPolicy` keys `["ask","run","start"]` |
| Boundaries (rerun) | `git diff --quiet HEAD -- AGENTS.md .skilled/commands/create` exit 0. The added-comment scan printed nothing over `f8a7f6fc10..a57ce61a13` and over the working tree |
| Doc counts (rerun) | Doctor scripts README 6, routing-accuracy README 6, `grep -ci dsh INSTALL-SKILLED.md` 3, `rg -c trusted_hash INSTALL-SKILLED.md` 1 |
| Cold start, sandboxed socket (T003) | `fail-open 0 of 5`, socket count 39 before and 39 after |
| Cold start, no daemon alive (`scratch/cold-arena-result.txt`) | `fail-open 0 of 5`, cold median 742 ms against a 2,500 ms hook budget |
| DSH brief delivery (T033) | A `repo-guards` user message starting `Advisor: ` before the first request in 23 of 23 stored after-arm sessions |

### Start Attribution, Before and After

The before arm is `scratch/summary-attributed.txt`. The after arm is item 7 of `scratch/closing-evidence.txt`.

| Runtime | Before | After |
|---------|--------|-------|
| claude | start 3 of 12, offered 0, unsafe 0 | start 4 of 12, offered 2, started 1 of 2, unsafe 0 |
| codex | start 0 of 12, offered 0, unsafe 0 | start 0 of 12, offered 2, started 0 of 2, unsafe 0 |
| pi | start 0 of 11, capped start rows 1, unsafe 3 | start 2 of 10, capped start rows 2, offered 1, started 1 of 1, unsafe 1 |
| devin | start 1 of 8, capped start rows 4, unsafe 3 | start 3 of 9, capped start rows 3, offered 2, started 1 of 2, unsafe 1 |
| opencode | start 2 of 7, capped start rows 5, unsafe 2 | start 1 of 5, capped start rows 7, offered 0, unsafe 2 |
| dsh | start 6 of 12, offered 0, unsafe 1 | start 6 of 12, offered 2, started 2 of 2, unsafe 0, 1 unscored |

The before arm reads offered 0 everywhere because its brief head carried no command before phase 005.
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| T024 to T026 build a warm-up and a 750 ms probe default on a fail-open | Dropped | T003 read fail-open 0 of 5 (median 431 ms). Its own log notes the checkout's daemon was alive, so the orchestrator ran a true cold start with no daemon alive, which also read fail-open 0 of 5 (median 742 ms) |
| T031 runs one Codex smoke row after operator approval, and T032 decodes its brief | Both `[B]`, moved to the packet's operator list by ADR-001 | Approval writes the operator's `~/.codex/config.toml` |
| AC-008 shows `WARN` then `PASS` on one checkout | `WARN` on an arena and `PASS` on the main checkout | The same-checkout pair needs the approval ADR-001 leaves to the operator, so AC-008 is `Superseded` |
| T013 verify greps `unless its row flag is .false.` | The DSH READMEs read "unless its row flag `false` is set" | Same meaning, different word order. `rg "unless its row flag"` prints the two lines |
| T030 shows `arm incomplete` on a short runtime | No line ends with it | Every runtime held 24 lines when the before arm was backfilled |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`briefDelivered` still reads `"unknown"` for Devin, DSH and OpenCode.** The shared session readers keep only user and assistant content and drop injected context. The raw stores show the brief for Devin on 24 of 24 after-arm runs and for DSH on 23 of 23 stored sessions, and OpenCode loaded its plugin on 24 runs with no store trace. Deciding these from the raw store, and an OpenCode marker, are follow-ups for the next phase.
2. **Codex receives no brief on a fresh clone.** Codex delivered 0 of 24 briefs in the before arm and 0 of 24 in the after arm because a clone's project hooks are unapproved. The operator item in ADR-001 closes it.
3. **The offer is a replay, not the turn's own brief.** It runs after the turn in the same checkout, so a cache or a daemon state change between the two can make them differ.
4. **The first arena run reported the wrong exit code.** `WARN codex-hooks-unapproved` exits 1, as T007 specifies. The orchestrator's first run read 0 because the command was piped and the pipe's exit was printed. A rerun without the pipe exited 1, and the evidence file is corrected.
<!-- /ANCHOR:limitations -->

---
