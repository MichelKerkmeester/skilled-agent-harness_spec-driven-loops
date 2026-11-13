---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. A plain request now gets its command offered on 23 of 45 tune rows, up from 9, and all 16 plain chat rows carry their command in the capture. Every floor held at every check. Plain reach on the holdout split is 1 of 44, so the gains do not transfer to unseen wording. Every acceptance criterion is Met."
trigger_phrases:
  - "plain offer reach implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach"
    last_updated_at: "2026-11-13T06:10:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the build evidence and deviations"
    next_safe_action: "Commit the phase, then take holdout reach and the fallback path to research segment three"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-plain-offer-reach"
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
| **Spec Folder** | 012-plain-offer-reach |
| **Completed** | 2026-11-13. AC-001 to AC-011 are `Met` |
| **Commit** | Not committed. The code is in the working tree over `HEAD` `99b68d8b3d` |
| **Level** | 2 |
| **Verified on** | `scratch/before.txt`, `scratch/after-final.txt` and `scratch/after-final-policy.txt` all ran on the working tree over `99b68d8b3d` on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A plain request now gets its command offered on 23 of 45 tune rows in the committed command capture, up from 9. All 16 plain chat rows carry their command in the capture, where 4 did before. Every floor held at every check.

### Wave A: the doctor hand-off names the command

The doctor hand-off used to insert `/doctor:helper` even when the helper's ranker had already found the exact command. It now inserts the command the ranker put first when that command runs without asking, and the helper otherwise. `matchDoctorProblem` returns the ranker's `runnable`, and `runnableDoctorBridgeId` in `fusion.ts` maps it to a `command-doctor-*` row with policy `run` that the projection holds. `stopped converging` is now a strong cue. A prompt that asks for a `repair path` or says `I have a problem`, with no ranked command and no passing skill, gets the helper. Three rows of the doctor slice were relabelled to the command now offered.

### Wave B: six task-shaped aliases on the sk-doc hub

The `sk-doc` hub gained `agent definition`, `specialist persona file`, `before and after my rewrite`, `intent file`, `prompt shortcut` and `confirm flag`. Exactly five tune rows changed route and no canary prompt moved.

### Wave C: the needs-a-mode label

A hub that withholds its command because the prompt names no single mode now says so. `routeNeedsMode` in `command-attach.ts` returns true for a `defer` or `clarify` route on a hub in `MODE_COMMANDS`. `needsMode` crosses the schema, the `AdvisorRecommendation` type, the recommend handler and the CLI fallback reader, and the renderer prints `<hub> (needs a mode)` when the top carries no command. The hook guide describes the label.

### Wave D: deep pairs

Each deep mode gained one plain-wording anchor in `PHRASE_BOOSTS` and one matching alias on the deep-loop hub: `find out everything`, `findings stop changing` and `several models`. The three deep tune rows now top `system-deep-loop` and attach `/deep:research`, `/deep:review` and `/deep:ai-council`. `nm-system-deep-loop-01` keeps its route and attaches nothing.

### Wave E: create anchors

One narrow anchor per wrong-top create row: `prompt shortcut`, `intent file` and `test script package`. `/create:command` and `/create:goal` now attach to their rows and `create-manual-testing-playbook` hits at top 1.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `MS` is `.skilled/bin/lib/compiled-routing/013-live-activation/activation`. `MA` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation`.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/lib/scorer/doctor-helper-handoff.ts`, `ADV/tests/doctor-helper-handoff.vitest.ts` | Modified | `runnable` on a match, the `stopped converg` cue and `genericRepairCue` |
| `ADV/lib/scorer/fusion.ts` | Modified | `runnableDoctorBridgeId` and the hand-off inserting the named command |
| `ADV/tests/scorer/doctor-handoff-command.vitest.ts` | Created | The named command, the ask fallback, the repair request and two silence cases |
| `ADV/scripts/routing-accuracy/doctor-prompts.jsonl` | Modified | Three hand-off rows relabelled |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modified | The named command, the ask fallback and the repair request |
| `.skilled/skills/sk-doc/hub-router.json`, `MS/sk-doc/manifest.json`, `MA/sk-doc/manifest.json` | Modified | Six aliases and the refreshed manifests |
| `ADV/lib/command-attach.ts`, `ADV/tests/command-attach.vitest.ts` | Modified | `routeNeedsMode` |
| `ADV/schemas/advisor-tool-schemas.ts`, `ADV/lib/subprocess.ts` | Modified | `needsMode` on a recommendation |
| `ADV/handlers/advisor-recommend.ts`, `ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modified | `needsMode` set in the compiled route enrichment |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`, `ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modified | `needsMode` kept from the CLI |
| `ADV/lib/render.ts`, `ADV/tests/command-brief-golden.vitest.ts` | Modified | The `(needs a mode)` label and two new golden heads |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | The label described |
| `ADV/lib/scorer/lanes/explicit.ts` | Modified | Three deep anchors and three create anchors |
| `.skilled/skills/system-deep-loop/hub-router.json`, `MS/system-deep-loop/manifest.json`, `MA/system-deep-loop/manifest.json` | Modified | Three aliases and the refreshed manifests |
| `ADV/scripts/routing-accuracy/command-routing-baseline.json` | Modified | Recaptured after waves A, B to D and E |
| `ADV/lib/prompt-policy.ts` | Modified | Scope amendment: one shared pattern reads `sk-`, `system-`, `cli-` and `mcp-` skill names as explicit skill markers |
| `ADV/tests/legacy/advisor-prompt-policy.vitest.ts` | Modified | Scope amendment: cases for the new skill name families |
| `scratch/` | Created | Before and after numbers, route tables, row state, live heads, the floor check script, worker briefs and logs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coordinator recorded the before numbers, the route tables and the plain row state (T001 to T003) at `99b68d8b3d`, after phase 011 was committed. Workers built the waves in order A, then B, C and D side by side, then E. `scratch/briefs/` holds 21 briefs and `scratch/logs/` one log pair per brief. After each measured step the coordinator ran `scratch/floorcheck.sh` and wrote `after-A.txt`, `after-BCD.txt` and `after-E.txt`. T030 to T033 ran from the final state and wrote `after-final.txt`, `chat-after.json` and `live-heads.txt`. After the prompt policy fix the coordinator reran the full floor check into `after-final-policy.txt` and the three live heads into the end of `live-heads.txt`.

Plain tune line per step (`.attachedMetrics.plain.tune`):

| After | own | attached | combined | Plan expectation |
|-------|-----|----------|----------|------------------|
| Before | 2 | 7 | 9 | 9 |
| A | 7 | 7 | 14 | 14 |
| B, C and D | 7 | 13 | 20 | 20 after D |
| E | 8 | 15 | 23 | 23 |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The hand-off names only a `run` command and keeps the helper for an `ask` command | The helper explains the choice before anything changes, which an `ask` command needs |
| `needsMode` is a new optional field, not a reuse of `compiledRoute` | The CLI fallback and the OpenCode plugin drop `compiledRoute` before the brief renders |
| Wave E ran | `after-BCD.txt` and `after-A.txt` hold identical `FLOOR`, `TYPED` and `EVAL` lines, so the deep wave left the floors unchanged |
| Wave E was kept | `after-E.txt` holds the same `FLOOR`, `TYPED` and `EVAL` lines as `after-BCD.txt` and ends `wave E: kept` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Before (`before.txt`) | After (`after-final.txt`, then `after-final-policy.txt`) |
|-------|-----------------------|---------------------------|
| `FLOOR` typed recall | `{"correct":24,"total":44}` | `{"correct":24,"total":44}`. Same in `after-A.txt`, `after-BCD.txt` and `after-E.txt` |
| `FLOOR` false offers | `{"count":0,"total":35}` | `{"count":0,"total":35}` at every check |
| `TYPED` attached false offers and typed block | `{"count":0,"total":35}` and `{"own":24,"attached":20,"combined":44,"total":44}` | Identical at every check |
| `PLAIN` tune | `{"own":2,"attached":7,"combined":9,"total":45}` | `{"own":8,"attached":15,"combined":23,"total":45}` |
| `PLAIN` holdout | `{"own":0,"attached":0,"combined":0,"total":44}` | `{"own":1,"attached":0,"combined":1,"total":44}` |
| `EVAL` | `[160,50,21,5]` | `[160,50,21,5]` at every check |
| `TC` and `PY` | Exit 0 | Exit 0 at every check |
| `PAR`, `RS` and `VDS` | 2, 4 and 2 passed | 2, 4 and 2 passed at every check |
| `BINT` | `ℹ fail 0` | `ℹ pass 104 ℹ fail 0` at every check |
| Guard and sync | `0` and all 55 served copies match | The same at every check |
| `HUBOK` for both hubs | Fresh, identical, parent-skill-check OK | Fresh, identical, parent-skill-check OK |
| Focused suites `VCA`, `VGT`, `VDHT`, `VFHT`, `VARC`, `VHFT`, `VSCH` and `VEX` | Run one by one, all passed | 9 test files passed, 200 tests passed |
| `DBC` | `fresh` | `fresh` |
| Advisor suite | 177 files passed, 1672 tests passed and 6 skipped | 179 files passed, 1699 tests passed and 6 skipped, exit 0, in `after-final-policy.txt`. `after-final.txt` read 178 files and 1691 tests before the prompt policy fix, and `after-A.txt` read 178 files and 1685 tests |

Other evidence:

- Chat rows (`scratch/chat-after.json`): 16 of 16 carry their command, 4 at top 1, 2 more in the top three and 10 by an attached command. The same count over `scratch/plain-before.json` gives 4 of 16.
- Route tables: the `sk-doc` diff changes exactly `cmd-create-agent-plain-tune-01`, `-02`, `cmd-create-command-plain-tune-01`, `cmd-create-diff-plain-tune-01` and `cmd-create-goal-plain-tune-01`. The deep-loop diff changes exactly the three deep tune rows from `defer` to their mode. `nm-system-deep-loop-01` reads `{"action":"route","t":["research"]}` in both tables. Both after tables keep 154 and 139 lines.
- Boundaries, rerun read-only: `git diff --quiet HEAD` over `AGENTS.md`, `.skilled/commands/create`, both `ROUTER.md` files and both canary fixtures exits 0. The added-comment scan over `.skilled` and the `package.json` scan print nothing.
- Live heads (`scratch/live-heads.txt`): all three exact prompts match after the prompt policy fix. See the T033 row below.
- Floors after the fix (`scratch/after-final-policy.txt`): every `FLOOR`, `TYPED`, `PLAIN` and `EVAL` line equals `after-final.txt`, and `RESULT: green`.
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Waves B, C and D each end with a recapture and a floor check (`after-B.txt`, `after-C.txt` and `after-D.txt`) | B, C and D were built side by side and measured by one capture and one floor check, `scratch/after-BCD.txt`. There is no `after-B.txt`, `after-C.txt` or `after-D.txt`. T011, T012, T020, T023 and T024 were satisfied by that merged step | The operator said "increase parallelism" on 2026-11-13. Per-wave attribution for B, C and D is by row id from the single capture. The total, 20, matched the plan's prediction for wave D |
| T025 compares `after-C.txt` with `after-D.txt` | T025 compared `after-A.txt` with `after-BCD.txt`. The `FLOOR`, `TYPED` and `EVAL` lines are identical, so wave E ran | No separate C and D files exist |
| Each floor check is a worker task | Every floor check ran through the coordinator's script `scratch/floorcheck.sh` | The coordinator owned the gate between waves |
| T011 recaptures after wave B | The T011 worker had started before its runner was stopped and was killed. The merged recapture behind `after-BCD.txt` replaced it | Same parallelism change |
| T033 reads three live heads from the exact prompts | The first run matched two of three. The exact prompt `use the system-deep-loop skill` printed `Advisor: prompt skipped.` The rerun after the fix matched all three | The prompt policy knew only `sk-` names as explicit skill markers. The coordinator fixed it at the source as a scope amendment under goal decision D1, not an operator decision, in `prompt-policy.ts` and its test |
| `spec.md` recorded that the advisor CLI answered from the Python scorer | At build time the CLI answered from the native scorer | Likely cause, inferred and not confirmed: the built `dist` was stale when the planner ran |

The first T033 run skipped the exact prompt `use the system-deep-loop skill`. The prompt policy returned `{"fire":false,"reason":"below_prompt_policy_threshold","metalinguisticMentions":[]}`, because it read only `sk-` names as explicit skill markers. `prompt-policy.ts` now reads `sk-`, `system-`, `cli-` and `mcp-` names through one shared pattern. The rerun, read through the worktree's own daemon, printed these three heads at the end of `scratch/live-heads.txt`:

```text
Advisor: live; use system-deep-loop (needs a mode) 0.91/0.12 pass.
Advisor: live; use sk-doc (needs a mode) 0.91/0.12 pass.
Advisor: live; use system-skilled-doctor → /doctor:agents-md check (run) 0.80/0.26 pass.
```

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gains do not transfer to unseen wording.** Plain reach on the holdout split is 1 of 44, where it was 0. The aliases and anchors were chosen from tune rows, and the holdout line shows they do not generalise. This is carried to research segment three.
2. **OpenCode does not see the label or the attached commands.** The OpenCode plugin's recommendation mapper drops `command`, `policy` and `needsMode`. Phase 013 wave 7b fixes it.
3. **The local fallback scorer loses most of this phase.** With `SPECKIT_IPC_SOCKET_DIR` pointing at a fresh folder while the worktree daemon runs, a second daemon does not start and the hook answers from the local fallback scorer with freshness `stale`. That path keeps a typed command and loses the mode label, the doctor hand-off and plain offers (`scratch/live-heads.txt`, the degraded-path note). This is carried to research segment three.
<!-- /ANCHOR:limitations -->

---
