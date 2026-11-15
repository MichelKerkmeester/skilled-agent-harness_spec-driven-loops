---
title: "Implementation Summary: Phase 23: vibe-review-remediation"
description: "The Vibe hook playbook's three stale live verdicts were traced to the scenarios and the runner, fixed and rerun on the shipped code with the model recorded; the compaction detector, the hand-over withdraw and the docs the review found wrong were corrected."
trigger_phrases:
  - "vibe review remediation implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation"
    last_updated_at: "2026-11-15T19:30:46Z"
    last_updated_by: "generate-context"
    recent_action: "Reran VIB-HK-004 to 008 live, all PASS"
    next_safe_action: "Await operator go-ahead to push phase 023"
    packet_purpose: "Purpose: The Vibe playbook's live evidence holds for the code on the branch, names the model each run used, and the detector and docs match what the code does."
    blockers: []
    key_files: []
    session_ref:
      runtime: "claude"
      sessionId: "425e79e1-c5de-4edb-b8bb-77ee620d2538"
      workspace: "/Users/michelkerkmeester/worktrees/public/383-mistral-vibe-runtime"
      savedAt: "2026-11-15T19:30:46Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 023-vibe-review-remediation |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 022's live verdicts hold for the code on the branch again. Three of them had last passed before the automatic hand-over tier changed the hooks they judge, and all three failed when rerun. None of the failures was in a hook: one scenario sent a message while Vibe was still compacting, one let the model ask an extra question, and one never made the tool call the binding answers. The runner also had no model pinned, so a run's model depended on Vibe's routed default.

### Phase 23: vibe-review-remediation

Every Vibe run from the conversation runner now starts on `deepseek-flash`, and its `result.json` names the model Vibe actually resolved, read from the session's own metadata, so a pin that did not take shows up in the record. VIB-HK-005, 006 and 007 now force or wait for the event each one judges. The compaction detector remembers every compaction it consumed in one catch-up, treats an empty journal folder as size 0, and only writes its state under a payload folder that already exists. An armed hand-over is withdrawn only by a turn the operator typed. The goal, lifecycle and mode docs describe what the code does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | Modified | Pin `deepseek-flash` in the Vibe home; record `vibe_model` |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` | Modified | Cover the pin, a second pin and the recorded model |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool.md` | Modified | One turn reads both files and writes `answer.txt`; the probe pin replaces the runner's |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-compaction-reinjection.md` | Modified | Wait for the finished compaction checkpoint; ask for the goal without tools |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/turn-start-save-nudge.md` | Modified | Seed the uploader module and name it |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md` | Modified | Point at the verdict table and say a verdict holds only for the code it ran on |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | Modified | Seen list, empty journal folder, existing payload folder, rationale comments |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` | Modified | Four new cases |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modified | Header names the withdraw step and the five text parts |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Modified | Save reminder part, watermark rationale, switches |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Modified | Withdraw only on a typed prompt |
| `.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs` | Modified | Blank-prompt case |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modified | Reflow one over-width comment |
| `.skilled/hooks/goal/README.md`, `.skilled/hooks/goal/vibe/README.md` | Modified | Vibe's compaction re-injection and the hand-over packet variable |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Modified | The 18 bindings by event; a run proves only the code it ran on |
| `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md` | Modified | The hand-over parts in the composers |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modified | Vibe in the hand-over runtime lists |
| `022-vibe-hook-playbook-and-live-scenarios/` records, `../spec.md` | Modified | Live-verdict claims |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every code change came with a test that fails on the old file and passes on the new one, except the empty-restore case, which pins behavior that was already right. The scenario edits were checked by parsing each conversation script, running HK-005's setup in an empty folder and the playbook validator. All edits landed before the live batch, because the runner fails a run whose checkout changes under it. The batch then ran VIB-HK-004 to 008 one after another on `deepseek-flash`.

All five passed on the first run, on `f8dcf4940db` plus this phase's changes. Merging origin/main as `c96ff28ef4e` then brought the Vibe hand-over hardening, which changed `turn-start.mjs`, `compaction-context.mjs` and `handover-parts.mjs`, so VIB-HK-003 to 007 ran again on the merged code. VIB-HK-006 timed out once: the re-injection landed, but an open question about what to pick up next sent the model searching the machine for the packet. Its last message now asks for the goal without tools, and it passed 3/3. Each `result.json` under 022's `scratch/live/` names the model Vibe resolved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the watermark ahead of the text, even for an empty restore | A session with no goal and no open note is the common case. Leaving its compaction unconsumed would re-detect it every turn and re-arm the advisor directive each time. Only a transient read failure loses text, and the next compaction re-injects anyway. |
| Pin the model in the home config, not with a launch flag | A flag would override VIB-HK-007's probe pin. The config pin is replaced by a scenario that needs another model. |
| Record the model from the session's `meta.json` | The value Vibe resolved is the evidence; the value the runner wrote is only intent. |
| Leave the hand-over `arm` cwd and the relaunch state directory alone | Both are shared with the Claude and Codex adapters. `skilled-loop` refuses a cwd it cannot enter, and `ensureStateDir` refuses a directory the user does not own. |
| Rerun VIB-HK-004 and 008 although they passed at 17:42 and 17:50 | Those reruns ran unpinned on GLM-5.3 Flash; the record now names the model. |
| Add the typed-prompt check to the merged `withdrawBeforeTurnStart` as well | The merge brought a second withdraw path from the hand-over hardening. Guarding only one path would leave the finding open, so the merge resolution guards both, and the blank-prompt test covers both. |
| Rerun VIB-HK-003 to 007 after the merge | The merge changed the hooks they judge, and a verdict holds only for the code it ran on. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:dispositions -->
## Finding Dispositions

| Finding | Class | Disposition |
|---------|-------|-------------|
| R2-P1-001 | matrix/evidence | Fixed: rows labeled before the reruns, then replaced by the rerun results |
| R1-P1-001 | algorithmic | No change by design: the watermark stays ahead of the text; the reason is in the code comment and README, and a test pins the empty restore |
| R1-P1-002--02fa7ff472c2 | algorithmic | No change: only the watermark consumes a compaction; comment added at the size write |
| R1-P1-002--adb007ab580f | algorithmic | No change: a roll or an append changes the summed size; comment added on `measureJournal` |
| R4-P1-001 | instance-only | Fixed in `goal/vibe/README.md` |
| R1-P2-001--ac2d8f414c3b | algorithmic | Fixed: every consumed id joins the seen list; catch-up test |
| R1-P2-001--4e51b4609c93 | instance-only | Documented: the 64-id bound and why it is enough |
| R1-P2-002 | instance-only | Fixed: an empty journal folder measures 0; test |
| R3-P2-001--4cabe1421439, R3-P2-002--a2160734b6d7 | class-of-bug | Fixed: the state folder must exist as a directory; missing-folder test |
| R3-P2-003 | instance-only | Deferred: the cost was asserted, not measured |
| R3-P2-001--09922ec53397 | cross-consumer | No change: the same `arm` call is in the Claude and Codex adapters, and `skilled-loop` checks the cwd before entering it |
| R3-P2-002--26cf29d2e12e | cross-consumer | No change: `ensureStateDir` uses a uid-suffixed name, re-inspects through a symlink and sets mode 0700 |
| R4-P2-003--f6d51a8e69ea | instance-only | Fixed: a typed prompt is required. Merging origin/main brought an early withdraw step, `withdrawBeforeTurnStart`, and the same check now guards it; the blank-prompt test covers both paths |
| R4-P2-005 | instance-only | Fixed the comment; the template literal belongs to another change and is left |
| R4-P2-001--3e1b6633d712 | instance-only | Fixed the `turn-start.mjs` header |
| R4-P2-002--a0bfc4ef4adc | test-isolation | Fixed: empty-restore test |
| R4-P2-003--8f1aef762f06 | instance-only | Fixed: the README names each part's switch, and that the compaction parts have none |
| R4-P2-004 | instance-only | Kept as the contract, with the reason added |
| R2-P2-001--d5b1ccf53ad4 | instance-only | Fixed in `goal/README.md` |
| R4-P2-001--e3447f5b13ad, R4-P2-002--c3535226947a | instance-only | Fixed in `guards-and-hooks.md` |
| R5-P2-001--1704af684955 | instance-only | Fixed in the dispatch-mode catalog page |
| R5-P2-001--dee4b5181343 | instance-only | Fixed in the spec-kit feature catalog |
| R5-P2-002--9e111e07ef17 | test-isolation | Covered by the empty-restore unit test, not a live scenario |
| R5-P2-002--88730f1859ce | matrix/evidence | Fixed: the parent row names the real cause |
| R2-P2-002--64b3ed5e25dc | matrix/evidence | Fixed: the parent is In Progress until this phase closes |
| R2-P2-002--cd69769ad494 | instance-only | Fixed: the playbook points at the verdict table |
| R2-P2-001--75c34f8b3f37 | matrix/evidence | Fixed by the three-turn rerun of VIB-HK-006 |
| S-1, S-2, S-3, S-4 | matrix/evidence | Fixed in the scenarios and the runner, then rerun |
<!-- /ANCHOR:dispositions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs` | 38 pass, 0 fail |
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs` | 1011 pass, 0 fail (1010 before, plus the blank-prompt case) |
| `node .../scripts/tests/run-conversation-scenario.test.cjs` | `PASS conversation runner suite` |
| `node --test .vibe/plugins/repo-guards/tests/ .skilled/hooks/goal/vibe/goal-vibe.test.mjs` | 17 pass, 0 fail |
| Playbook validator on the Vibe package | `scenarios=52 violations=0 warnings=0` |
| Live, before the merge (`f8dcf4940db` plus this phase) | VIB-HK-004 to 008 PASS: 2/2, 2/2, 3/3, 3/3 (`compaction-probe`, re-injection in a `post_tool_call` at sequence 74 after the compaction at 50), 2/2; 19:20 to 19:27 UTC |
| Live, after the merge (`c96ff28ef4e` plus the doc fixes) | VIB-HK-003 PASS 2/2, 004 PASS 2/2, 005 PASS 2/2, 007 PASS 3/3 (`compaction-probe`), 19:40 to 19:53 UTC; 006 FAIL 2/3 on a turn timeout, then PASS 3/3 at 19:54 UTC with the bounded prompt; all others `deepseek-flash` |
| Merged tree unit gates | hand-over 1027 pass, lifecycle 41 pass, repo-guards and goal 17 pass, runner suite PASS, playbook `violations=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **VIB-HK-027 was not rerun.** Both withdraw paths changed, and VIB-HK-027 covers the automatic hand-over tier another lane owns. The hand-over suite covers both paths with and without a prompt.
2. **Rows other than 004 to 008 carry no recorded model.** They ran before the pin and after the last change to their hooks, so their verdicts stand, but the model they ran on is not recorded.
3. **Skill-advisor uptake inside Vibe is untested.** The review deferred it; it needs its own scenario.
<!-- /ANCHOR:limitations -->

---
