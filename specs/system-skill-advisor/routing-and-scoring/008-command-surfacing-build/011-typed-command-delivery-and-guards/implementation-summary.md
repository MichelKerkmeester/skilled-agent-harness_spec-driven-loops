---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. A typed tracked command now reaches the model on the top recommendation with its policy, 44 of 44 typed rows, and three guards run in their checks: a command visibility count, hook health in the advisor status and a head length test with a brief cost script. Every acceptance criterion is Met."
trigger_phrases:
  - "typed command delivery implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards"
    last_updated_at: "2026-11-13T05:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed phase 11 and marked every criterion Met"
    next_safe_action: "Commit the phase, then take the hook health UX question to research segment three"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-typed-command-delivery-and-guards"
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
| **Spec Folder** | 011-typed-command-delivery-and-guards |
| **Completed** | 2026-11-13. AC-001 to AC-012 are `Met` |
| **Commit** | Not committed. The code is in the working tree over `HEAD` `731967bc25` |
| **Level** | 2 |
| **Verified on** | The before numbers ran at `c909693acb`. The after numbers ran on the working tree over `731967bc25` on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user who types a tracked slash command now sees that command on the top recommendation, with its `run`, `start` or `ask` policy and its owner skill. Before this phase 7 of the 44 typed corpus rows reached the model with no command and 8 more reached it with a command but no policy. The committed command capture now reads 44 of 44.

### Typed Delivery

The deriver writes a `TRACKED_COMMANDS` table into the generated block of `command-attach.ts`. It holds one row per bridge entry, whether or not the bridge is active, with `policy`, `ownerSkillId` and `scorerRow`. The deriver check prints `fresh`. Two helpers in `command-attach.ts` read it. `typedCommandIn` finds the longest tracked command typed as its own token. `typedCommandForTop` returns that row when the top recommendation is the command's owner or its command row.

`fusion.ts` gained `rankTypedCommandOwnerFirst`. When the prompt types a command with no scorer row of its own and the owner passes the threshold below rank 1, the owner moves to rank 1 and every other entry keeps its order. This is what moves `/create:goal` and `/create:skill-parent` to their owner. `advisor-recommend.ts` gained `attachTypedCommand`, which sets `command`, `policy` and `ownerSkillId` on the top recommendation on both the cached and the uncached return path. A command attached by a hub's compiled route now takes its policy from `TRACKED_COMMANDS`, which gives the eight commands with no active bridge their policy.

### Measurement

The command capture reports `attachedMetrics.typed` with `own`, `attached`, `combined` and `total`, and `attachedMetrics.typedRows` keyed by row id with `expected_command`, `top`, `carried`, `command` and `policy`. It writes no prompt text. The committed baseline was recaptured with `--write`.

### Guards

- `sync-runtime-mirrors.cjs --check` prints `visibility claude 32/44, cursor 44/44` and fails with a `COLLAPSE` line when a command folder other than `create/` holds a `skill.md`.
- `advisor_status` carries `hookHealth` with `invocations`, `rollingP95Ms`, `rollingFailOpenRate` and `rollingCacheHitRate` when the diagnostics file holds records. The `/doctor:setup` advisor leg shows it without changing the leg's status.
- `INSTALL-SKILLED.md` has one prove-it command that prints the top skill id for a sample prompt.
- `command-head-length.vitest.ts` renders the head for every tracked command and every command row and fails on a head over 320 bytes or a truncated one.
- `measure-brief-cost.mjs` prints brief bytes and estimated tokens for each typed row, refuses a holdout row and removes its sandbox.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SRM` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors`.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modified | Emit `TRACKED_COMMANDS` in the generated block |
| `ADV/lib/command-attach.ts` | Modified | `TrackedCommand`, the regenerated block, `typedCommandIn` and `typedCommandForTop` |
| `ADV/tests/command-attach.vitest.ts` | Modified | Cases for the two helpers |
| `ADV/lib/scorer/fusion.ts` | Modified | `rankTypedCommandOwnerFirst` after the doctor helper handoff |
| `ADV/tests/scorer/typed-command-owner.vitest.ts` | Created | Cases for the ordering step |
| `ADV/handlers/advisor-recommend.ts` | Modified | `attachTypedCommand` on both return paths and the policy for hub-attached commands |
| `ADV/tests/handlers/advisor-recommend-typed-command.vitest.ts` | Created | Cases for `attachTypedCommand` |
| `ADV/tests/command-head-length.vitest.ts` | Created | Head length over every tracked command and command row |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modified | `attachedMetrics.typed` and `typedRows` |
| `ADV/scripts/routing-accuracy/command-routing-baseline.json` | Modified | Recaptured with the typed block |
| `ADV/scripts/measure-brief-cost.mjs` | Created | Brief bytes and estimated tokens per typed row |
| `SRM/sync-runtime-mirrors.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs`, `SRM/README.md` | Modified | Visibility line and collapse guard |
| `ADV/schemas/advisor-tool-schemas.ts`, `ADV/handlers/advisor-status.ts`, `ADV/tests/handlers/advisor-status.vitest.ts` | Modified | `hookHealth` in the status output |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modified | Hook health under the advisor leg |
| `INSTALL-SKILLED.md` | Modified | One prove-it step |
| `ADV/scripts/routing-accuracy/README.md`, `ADV/scripts/command-bridges/README.md` | Modified | The typed block, the cost script and the new table |
| `ADV/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | Recaptured by its own script, see Deviations |
| `ADV/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Recaptured by its own script, see Deviations |
| `scratch/` | Created | Before and after numbers, typed row state, real heads, brief cost, hook health, suite output, worker briefs and logs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran T001 and T002 at `c909693acb`, after phases 005, 008 and 010 were committed. Workers then built T003 to T021 in six waves. `scratch/briefs/` holds 19 briefs and `scratch/logs/` holds one log pair per task. The orchestrator verified each wave, ran T022 to T024 and wrote the after numbers to `scratch/after.txt` on 2026-11-13.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the typed gap in delivery, with one ordering step for the two rows whose top was wrong | Five of the seven rows already had the owner on top. Moving scores would break pins such as the `/speckit:resume` owner gold label |
| One generated `TRACKED_COMMANDS` table, not a second policy map | The handler, the ordering step and the capture all need policy, owner and scorer row together |
| A typed command outranks a hub's compiled route command | The user typed it, which is stronger evidence than a routed mode |
| Count the policy the system delivers, not the corpus label | Three corpus labels disagree with the generated tables, and fixing labels changes the corpus hash the baseline is pinned to |
| Head limit of 320 bytes | It is the renderer's own single-head cap of 80 tokens at 4 characters per token. The research's 140-byte guard does not exist in code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every number below quotes `scratch/before.txt`, `scratch/after.txt` or the named scratch file. The rows marked "rerun" ran again from the repository root during closure.

| Check | Before | After |
|-------|--------|-------|
| `FLOOR` typed recall | `{"correct":24,"total":44}` | `{"correct":24,"total":44}` |
| `FLOOR` false offers | `{"count":0,"total":35}` | `{"count":0,"total":35}` |
| `attachedMetrics.typed` | Not measured | `{"own":24,"attached":20,"combined":44,"total":44}` (rerun on the committed baseline) |
| `slash_variant.reached_top3` | 5 | 5 |
| `typed_reach_top3` | `{"correct":27,"total":44}` | `{"correct":27,"total":44}` |
| `agreement` | `{"correct":7,"total":9}` | `{"correct":7,"total":9}` |
| `false_offer_attached` | `{"count":0,"total":35}` | `{"count":0,"total":35}` |
| `attachedMetrics.plain` | tune combined 9 of 45, holdout 0 of 44 | Unchanged |
| `EVAL` | `[159,50,20,5]` | `[160,50,21,5]` |
| `TC` and `PY` | Exit 0 | Exit 0 |
| `DBC` | `fresh` | `fresh` (rerun) |
| `RS` and `PAR` | 4 passed and 2 passed | 4 passed and 2 passed |
| `VCA` | 6 passed | 8 passed |
| `VFT`, `VART` and `VHT` | Did not exist | 4 passed, 4 passed and 120 passed |
| `VST` | 47 passed | 49 passed |
| `node --test $SRMT` | pass 6, fail 0 | pass 8, fail 0 |
| `node $SRM --check` | Exit 0 | `visibility claude 32/44, cursor 44/44`, exit 0 (rerun) |
| `DCT` | pass 10, fail 0 | pass 10, fail 0 |
| `npm test` in `ADV` | Not run | 177 test files passed, 1672 tests passed and 6 skipped, exit 0 (`scratch/suite-after.txt`) |

Other evidence:

- Real heads (`scratch/typed-heads.json`): the Claude prompt hook ran in a sandboxed socket directory on all 44 typed rows. All 44 heads carry the row's command and a policy.
- Brief cost (`scratch/brief-cost.json`): 44 rows, total 12,771 bytes, median 299 bytes, largest 328 bytes and smallest 244 bytes. Every row's estimated tokens equal its bytes divided by 4, rounded up.
- Hook health (`scratch/hook-health.json`): 3 invocations, `rollingP95Ms` 68, `rollingFailOpenRate` 0 and `rollingCacheHitRate` 0.667.
- Boundaries (rerun): `git diff --quiet HEAD -- AGENTS.md .skilled/commands/create` exits 0 and the added-comment scan over `.skilled` prints nothing.
- Cost script refusals (T006 log): a holdout id printed `holdout_row` and exited 2, and no `ssa-cost-` directory was left.
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| The scorer eval baseline stays as it was | Recaptured with `capture-scorer-eval-baseline.mjs --write` from `[159,50,20,5]` to `[160,50,21,5]` | The phase improved two pinned numbers, so the ratchet was raised by its own script and not edited by hand. The file is outside the task list |
| The local and native divergence ledger stays as it was | Recaptured with `capture-local-native-divergence-ledger.mjs --write --summary`. The summary reported added `[]`, resolved `[]` and changed `["rr-iter2-046"]` and moved `scoringInstant` to 2026-11-13 | Row `rr-iter2-046` now has native top `system-deep-loop`, its gold label, where it had `system-spec-kit`, because a typed command now puts its owner first. The script's default reason named a different cause, so the row's reason text was then edited by hand to state this one. The file is outside the task list |
| T023 reads hook health from records the T020 and T021 hook runs wrote | Those runs wrote no records. Three Claude hook runs with `SKILL_ADVISOR_DEBUG=1` wrote three, and `advisor_status` then printed `rollingP95Ms` of type `number` (68 ms over 3 invocations) | The hook writes diagnostic records only when `SKILL_ADVISOR_DEBUG` is set, so the task's premise was wrong |
| T023 reads the status in a fresh `SPECKIT_IPC_SOCKET_DIR` | The read went through the worktree's own daemon | The sandboxed call failed with `backend unavailable: daemon launcher exited with code 0` while that daemon was running. The cause is inferred, one daemon per workspace, and not confirmed. Confirming it needs the worktree daemon stopped and the sandboxed call run again |
| Wave 1 verifies against a fresh advisor build | T007 verified its documented command with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` and T006 measured fail-open briefs | Concurrent wave 1 source edits left `dist` stale until the wave 5 rebuild. T021 measured the real briefs after it |
| T020 sandboxes only the socket directory | Its script also points `SYSTEM_SKILL_ADVISOR_DB_DIR` into the sandbox and unsets `AI_SESSION_CHILD` for the hook | Another daemon held the shared advisor DB lease, and a child session renders `start` and `ask` as `parent-named only` |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hook health shows only after a debug run.** The hook writes diagnostic records only when `SKILL_ADVISOR_DEBUG` is set, so the `/doctor:setup` advisor leg shows hook health only for an operator who has run with it set. This is carried to research segment three as a UX question.
2. **Claude Code shows 32 of 44 tracked commands.** The mirror check prints `visibility claude 32/44, cursor 44/44`. The 12 hidden Claude commands come from `skill.md` in the `create` command folder, which is logged as waiting on the operator. This phase reports the count and does not fix it.
3. **Three typed heads disagree with their corpus policy label.** `scratch/typed-heads.json` shows `cmd-design-extract-typed-01`, `cmd-doctor-env-typed-01` and `cmd-doctor-update-typed-01` with `labelAgrees` false. Which side is right is a policy call for the operator.
4. **`rollingP95Ms` counts cache-hit invocations only.** The status handler documents this beside the field.
5. **The feature catalog still names `COMMAND_POLICIES`.** `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` describes the old policy source. It is outside this phase's file list.
<!-- /ANCHOR:limitations -->

---
