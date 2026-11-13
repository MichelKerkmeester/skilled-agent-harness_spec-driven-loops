---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. The committed after arm now answers brief delivery on 119 of 144 lines, up from 24, with no model run and every offer field unchanged. The scorer prints the predicted offer, delivery and safety counts on all six runtimes, Claude's g2 start rate reads 3 of 6, the restore resets a turn to HEAD and every floor held. Every acceptance criterion is Met."
trigger_phrases:
  - "attribution and install reach implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach"
    last_updated_at: "2026-11-13T07:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the build evidence, the wave 8 measurements and the deviations"
    next_safe_action: "Commit the phase, then plan the next behaviour arm with the new restore and the Codex preflight"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-attribution-and-install-reach"
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
| **Spec Folder** | 013-attribution-and-install-reach |
| **Completed** | 2026-11-13. AC-001 to AC-014 are `Met` |
| **Commit** | Not committed. The code is in the working tree over `HEAD` `d6b6d3bdea` |
| **Level** | 2 |
| **Verified on** | `scratch/after.txt`, `scratch/runs-post-attributed.jsonl`, the three `scratch/summary-*-after.json` files and `scratch/delivery-leg.txt` all ran on the working tree over `d6b6d3bdea` on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A behaviour arm now says whether the advisor brief reached each runtime. The brief-only backfill of the committed after arm answers delivery on 119 of 144 lines, where it answered 24, and it changes no offer field. On the install side the default `embed` leaves Claude Code a one-line `CLAUDE.md` pointer and `/doctor:setup` reports when a brief cannot arrive.

### Phase 13: attribution-and-install-reach

The Claude, Pi, Devin and DSH session readers now return `injected`, the text a hook or harness put into the session, beside unchanged `records`. `briefDelivered` reads it for Pi, Devin and DSH, answers `false` for a Codex project whose hooks are unapproved and keeps OpenCode `unknown`. The runner passes the shared reader at run time, and `--backfill --brief-only` recomputes delivery on a finished log without replaying any offer.

The scorer counts an offer on every scored row, splits a capped offer out, renames `offerUnknown` to `offerFieldAbsent` and adds `offerReached`, `deliveryUnknown`, `offerSeen` and `offerDeclined`. A loop started without its init now counts as unsafe, and a typed command Claude Code expands itself counts as a start. The runner restores each turn to HEAD through the new `worktree-restore.mjs`, reports `leftoverPaths` and refuses a Codex arm whose hooks are unapproved before any turn.

`embed` replaces a folded `CLAUDE.md` with `@AGENTS.md`, or creates that pointer when the run writes another file. A10 reports a missing pointer as INFO. `/doctor:setup` runs a seventh leg, delivery, which is DEGRADED and never FAIL when a prompt hook is missing or unapproved. The OpenCode plugin's recommendation mapper keeps `command`, `policy`, `ownerSkillId` and `needsMode`, so an OpenCode brief names the command and policy a hook brief names.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RAD` is `ADV/scripts/routing-accuracy`, `SR` is `.skilled/hooks/shared/session-readers`, `SRT` is `.skilled/hooks/shared/tests/session-readers` and `DD` is `.skilled/commands/doctor`.

| File | Action | Purpose |
|------|--------|---------|
| `SR/claude.mjs`, `SR/pi.mjs`, `SR/devin.mjs`, `SR/dsh.mjs` | Modified | Each ok result also carries `injected` |
| `SR/index.mjs` | Modified | `loadSession` passes `injected` through when a reader returns it |
| `SR/*.d.mts`, `SR/*.d.mts.map` | Regenerated | Written by `session-reader-declarations.mjs` only |
| `SR/README.md` | Modified | `injected` and its source per runtime |
| `SRT/claude.test.mjs`, `pi.test.mjs`, `devin.test.mjs`, `dsh.test.mjs`, `injected-text.test.mjs` | Modified | One injected-context case each |
| `RAD/command-offer.mjs`, `ADV/tests/command-offer.vitest.ts` | Modified | `codexHookApproval`, delivery from injected context and the `briefOnly` backfill |
| `RAD/worktree-restore.mjs`, `ADV/tests/worktree-restore.vitest.ts` | Created | The turn restore to HEAD and its temporary repository test |
| `RAD/run-command-behaviour.mjs` | Modified | Restore through the new module, `--brief-only`, the reader at run time and the Codex preflight |
| `RAD/score-command-transcripts.mjs`, `ADV/tests/command-transcript-score.vitest.ts` | Modified | Offer accounting, the safety fold, `offerSeenIn` and host-expanded starts |
| `RAD/capture-command-routing-baseline.mjs` | Modified | One comment on what the row `offered` flag means |
| `RAD/README.md` | Modified | The new keys, flags, refusal and restore |
| `DD/scripts/agents-md-embed.cjs`, `DD/scripts/tests/agents-md-embed.test.cjs` | Modified | The pointer write, two amended assertions and one new case |
| `DD/scripts/agents-md-check.cjs`, `DD/scripts/tests/agents-md-check.test.cjs` | Modified | INFO `pointer missing` and the corrected A10 comment |
| `DD/agents-md.md`, `DD/assets/doctor-agents-md-embed.yaml` | Modified | The default now leaves a pointer |
| `DD/assets/doctor-setup.yaml`, `DD/assets/doctor-setup-presentation.txt`, `DD/setup.md` | Modified | The delivery leg and seven legs |
| `INSTALL-SKILLED.md` | Modified | The pointer and the delivery leg |
| `.opencode/plugins/system-skill-advisor.js`, `ADV/tests/system-skill-advisor-plugin.vitest.ts`, `.opencode/plugins/README.md` | Modified | The mapper keeps the four command fields, two cases pin the OpenCode head and the README row names the mapper |
| `scratch/` | Created | Before and after numbers, the attributed log, the summaries, the delivery leg output, worker briefs and logs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Small-model workers ran wave 0 (T001, T002) and waves 1 to 7 and 7b (T003 to T032, T039, T040). `scratch/briefs/` holds 34 briefs and `scratch/logs/` one log pair per brief. A verifying session then reran each task's verify command from the final working tree and ticked a task only when the output matched. It made no code fix, because every verify matched.

It then ran `npm run build` in `ADV`, the brief-only backfill (T033), the three summaries (T034), the two delivery checks and the OpenCode probe (T035), every floor (T036, written to `scratch/after.txt`) and the boundary checks (T037). Every vitest command ran as `env -u AI_SESSION_CHILD npx vitest run`, because two brief test files fail when the child marker is set.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure with `--brief-only`, not the plain backfill | The plain backfill replays every offer in a temporary arena and warms a daemon there, so it could rewrite the offers it is meant to keep |
| 95 rows move, not 96 | One DSH line has no session id, so its delivery stays `unknown` |
| OpenCode stays `unknown` | No marker exists for the committed arm, and a plugin-side marker proves the plugin ran rather than that the host delivered |
| A missing `CLAUDE.md` pointer is INFO | A FINDING would turn this repository's own check and every fixture loop red |
| Two embed assertions changed | Scope item E reverses the removal they pinned, a logic-sync resolved in favour of the scope the coordinator set |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T033 brief-only backfill | `{"ok":true,"lines":144,...}`, exit 0. Delivery: claude `true` 24, codex `false` 24, devin `true` 24, dsh `true` 23 and `unknown` 1, opencode `unknown` 24, pi `true` 24. `wc -l` of answered lines prints 119. The offer `diff` prints nothing, and a `diff` of every field except `briefDelivered` and `briefBackfilled` prints nothing too |
| T034 after-arm summary | `{"claude":[3,0,1,3,0,0,0],"codex":[3,0,0,0,0,0,0],"devin":[3,0,1,3,0,0,2],"dsh":[3,0,2,3,0,0,0],"opencode":[3,2,0,3,24,0,2],"pi":[3,1,1,3,0,0,1]}`, equal to SC-002. The post and pre `startRate` lines equal their before files and Claude g2 reads `3 of 6` |
| T035 delivery leg | Hook check `ok claude`, `ok codex`, `ok cursor`, `ok devin`, exit 0. Codex check `WARN codex-hooks-unapproved .`, exit 1, so the leg reads DEGRADED on this checkout. Both config digests read `ac6ef2b5...385d52`. The probe prints `opencode plugin names command=true names policy=true` for the real answer and the fixture |
| T036 `FLOOR` | `{"correct":24,"total":44}` and `{"count":0,"total":35}`, equal to before |
| T036 `EVAL` | `[160,50,21,5]`, equal to before |
| T036 `TC`, `SRD --check`, `RV`, `SRM` | Exit 0, `20 file(s) current`, 32 routes validated, 256 mirrors in sync |
| T036 `VALL` | 179 files passed, 1713 tests passed and 6 skipped, exit 0. Before: 178 files, 1691 passed |
| T036 `VSR` and `DALL` | `pass 90`, `fail 0` and `pass 1164`, `fail 0`. Before: 85 and 1162 |
| T036 `VO` and `VT` | 19 passed and 58 passed. Before: 11 and 49 |
| T037 boundaries | `AGENTS.md` and `.skilled/commands/create` unchanged, the comment label scan and the package scan print nothing, the status lists only files named in the tasks and `codex-preflight.jsonl` is absent |
| T029 Codex preflight | `{"ok":false,"code":"codex-hooks-unapproved",...}`, exit 2, no run line written |
| T039 OpenCode head | `VPL` 97 passed after the edit. The worker's log shows 2 failed and 95 passed of 97 before it. `NPL` `pass 42`, `fail 0` |
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Phase 013 waits for phase 012 | Phases 012 and 013 were built side by side | The operator said "increase parallelism" on 2026-11-13. Phase 012's commit `d6b6d3bdea` touches none of the files this phase changed |
| Wave 0 records green before numbers | The T001 worker wrote a RED GATE: `VALL` reported 10 failed in two brief test files | The worker ran with `AI_SESSION_CHILD=1`, and the renderer labels a child session `(parent-named only)`. The coordinator reran without the marker, got 178 files and 1691 tests passed, and recorded the correction in `scratch/before.txt` |
| Wave 7b starts after waves 4 to 7 | Wave 7b ran in parallel with waves 4 to 7 | Its gate was phase 012's commit, `d6b6d3bdea`, not the earlier waves, and it touched different files |
| The wave 0 dispatch call ends cleanly | That call exited 2 with a syntax error after its workers had finished | The coordinator edited the dispatch helper while a runner used it. Both wave 0 outputs were already written and match their verify lines |
| T020's status lists only `.mjs`, `.d.mts` and `.d.mts.map` under `SR` | The final status also lists `SR/README.md` | T026 edits that README in wave 4, after T020 in wave 3. This is a task-order effect, not a stray write |
| T007's `rg -n "writeFile\|appendFile"` prints only the backfill write | It prints that write and the `node:fs` import line | The import line was already at `HEAD`. No new write was added |
| SC-002 reads `SP/summary-after.json` | The file is `scratch/summary-post-after.json` | T034 names the three files per arm. The values match |
| T039's probe count is 1 | The worker's raw probe printed 0. With `env -u AI_SESSION_CHILD` it printed 1 | Same child-marker cause as wave 0. The verifying session ran without the marker and got 1 for the fixture and 2 in T035 |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode delivery stays `unknown`.** Its plugin adds the brief in memory and the store keeps no copy, so 24 lines of the after arm cannot be answered. Revisit when an OpenCode arm is next planned.
2. **An approved Codex hook still reads `unknown`.** How Codex stores a hook's context once approved is UNKNOWN, so only `unapproved` maps to `false`. This checkout's own Codex hook is unapproved, so its delivery leg reads DEGRADED until the operator approves it in `/hooks`.
3. **Codex host expansion is UNKNOWN.** Only Claude's `<command-name>` tag counts as a start, so a Codex typed start may be undercounted.
4. **Two brief test files fail under `AI_SESSION_CHILD=1`.** Run the advisor suite without the marker until the review remediation phase isolates them.
5. **The restore test has no case for a lone untracked file.** The plan's restore matrix names it as its own turn action, while `worktree-restore.vitest.ts` covers an untracked file only inside the untracked `out/` folder and as the pre-dirty `note.txt`. CHK-FIX-004, a P1 row, stays open for that reason.
<!-- /ANCHOR:limitations -->

---
