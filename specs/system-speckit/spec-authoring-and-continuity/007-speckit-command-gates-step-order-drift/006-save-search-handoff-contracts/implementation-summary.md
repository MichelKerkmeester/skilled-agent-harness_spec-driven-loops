---
title: "Implementation Summary"
description: "Lifecycle saves now write continuity through one writer call, and save, search and handoff each state one contract that matches their scripts."
trigger_phrases:
  - "save search handoff contracts implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/006-save-search-handoff-contracts"
    last_updated_at: "2026-11-14T14:42:46Z"
    last_updated_by: "generate-context"
    recent_action: "Phase 6 implemented and verified at 2a9575030b"
    next_safe_action: "Implement phase 7, 007-shared-blocks-and-retired-mechanisms"
    packet_purpose: "Purpose: An agent that follows `/speckit:save`, `/speckit:search`, `/speckit:handoff` or a lifecycle save step reads one contract per command, and that contract matches what `generate-context.js`, `rg-wrapper.mjs`, `lookup-trigger-index.mjs` and `session-relaunch.cjs` accept and print."
    blockers: []
    key_files:
      - ".skilled/commands/speckit/assets/speckit-save-context-tail.yaml"
      - ".skilled/commands/speckit/save.md"
      - ".skilled/commands/speckit/handoff.md"
      - ".skilled/commands/speckit/search.md"
      - ".skilled/commands/speckit/assets/save-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-save-search-handoff-contracts"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "d2e0387a-2438-42c0-be5e-086960b0c90f"
      workspace: "/Users/michelkerkmeester/worktrees/public/381-speckit-command-gates-step-order-drift"
      savedAt: "2026-11-14T14:42:46Z"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-save-search-handoff-contracts |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every lifecycle save now writes continuity, and the save, search and handoff commands each state one contract that matches the script they call.

### Phase 6: save-search-handoff-contracts

The shared save tail names one writer call: the JSON is piped to `generate-context.js --stdin --full-auto --session-id <id> --runtime <slug> {spec_path}`. Before this phase the lifecycle saves passed a temp file with no `--full-auto`, so the writer ran as plan-only and wrote no continuity while each step reported that it had. The tail also says the writer refreshes `description.json` and `graph-metadata.json` itself and names `validate.sh {spec_path} --strict` as the one check after it. Its `anchor_requirements` block is gone.

Plan, implement and complete each run one save step. The three intermediate checkpoint saves and the three closing steps that offered a second save are removed, and each workflow's closeout text sits in `termination.message`. The save steps hold no write block of their own and point at the tail.

`save.md` names one writing mode, full-auto, with the canonical call. The save display has rows for blockers, advisories, pending decisions and orphaned sessions, a full-auto result block built from the writer's own output lines and no trigger editor.

`search.md` documents `--limit` on both lanes, runs path-only and count searches through the wrapper and routes a query that starts with `--` to the raw recipe before any wrapper run. Exit 2 or higher has one meaning, the error display. The search display has a row shape for each wrapper recipe.

`handoff.md` states its four STATUS lines once, in one table, and labels its runtime list as the `session-relaunch.cjs --runtime` values. It says that `prepare` refuses `dsh`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-save-context-tail.yaml` | Modified | One `invocation` key with the canonical call, one post-save statement, no anchor block |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modified | One save step each, no checkpoint save, no inline write block, no closing save offer |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modified | The closeout block drops its second-save prompt |
| `.skilled/commands/speckit/save.md`, `assets/save-presentation.txt` | Modified | One full-auto mode, labelled runtime list, plan rows and the full-auto result block |
| `.skilled/commands/speckit/search.md`, `assets/search-presentation.txt` | Modified | `--limit` on both lanes, wrapper for path and count, phrase routing, row shapes |
| `.skilled/commands/speckit/handoff.md` | Modified | Canonical call in Step 2, one STATUS table, labelled runtime list |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modified | T-EM7 no longer requires the anchor block |
| `.skilled/skills/system-spec-kit/shared/tests/boolean-expr.test.ts`, `shared/tests/README.md` | Modified | The `after:` timing assertion reads the tail's `post_save_write` block, and the README row says so |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fourteen dispatches went to DeepSeek V4.1 Flash on the Mistral provider through OpenCode, one file each and one at a time in worktree 381. Twelve used the markdown persona and two, the test edits, used the code persona.

The orchestrating session wrote the full target text of every file first, applied it to the worktree, ran every acceptance command and the tests on it and restored the files before any dispatch. Each dispatch was then compared byte for byte with its expected file, and the queue checked that no other file changed. The session then ran every acceptance command and the tests again on the final tree.

The `@review` gate returned APPROVED with no P0 or P1 finding and two suggestions. One, an inaccurate reason in the new `search.md` routing sentence, was fixed with a fourteenth dispatch before the commit. The other is the first limitation below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The tail's bare `writer:` key is removed | REQ-001 asks for one call shape. A second key that names the script with no arguments is the shape the spec measured as drift |
| `termination.after_step` in complete is `13.5`, not the save step | `step_13_5_autopilot_archive_verify` runs after the save under autopilot. Ending at step 13 would tell an agent to skip it. The message names both end points. This departs from the letter of T014 |
| The checkpoint of complete's save step now offers Done and View Summary | Its old options, Continue and Finish Now, led to the removed closing step and named another continuity refresh |
| `shared_tail_note` is reworded in all three workflows | The note said the anchor requirements live in the tail, and this phase removes them |
| Plan's `mode_overrides.confirm.user_response_handling` line is deleted whole | It only overrode the removed closing step, so nothing reads it |
| The Session ref row renders only when the writer printed `session_ref skipped` | The writer prints no line when it mints the pointer, and the display may only quote lines the writer printed |
| `search.md` and the search display now separate the wrapper's `--json` from ripgrep's | Path-only and count runs need the wrapper's JSON record, and the old rule forbade `--json` with those modes without saying which flag it meant |
| The row for `boolean-expr.test.ts` in `shared/tests/README.md` was updated | It described the assertion this phase moved to the tail |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Canonical writer call | PASS: no `/tmp/save-context-data` path under the command folder. The call prints on 1 line in the tail, 2 in `save.md` and 1 in `handoff.md`. `apply/full-auto` prints nothing |
| Tail post-save statement, key name and anchors | PASS: the two old sentences, `pre_index` and both anchor keys print nothing. `validate.sh` prints 1 and `invocation:` prints line 15 |
| Search phrase routing and exit 2 | PASS: `as a flag and exits` prints nothing and the routing pattern prints one line |
| Search path and count modes, `--limit` | PASS: `run their recipe directly` prints nothing. The cap line, the count row shape, the example recipe line, the argument hint and the lane line each print 1 |
| Save display | PASS: one line each for Blockers, Advisories and Orphans, two for Decisions, one `SPECKIT:SAVE FULL-AUTO`, and no trigger editor, anchor row or `refresh-graph` |
| Handoff | PASS: the STATUS count prints 4, `find` prints nothing, two lines name DSH and one names `session-relaunch.cjs --runtime` |
| One save step per workflow | PASS: `write_continuity`, `handover_check`, `checkpoint__`, `Run /speckit:save` and `memory-save` print nothing. Each workflow prints 1 save step and 1 termination message |
| YAML parse | PASS: `parsed 4` |
| Mode tags | PASS: `untagged: 0` and `autopilot_ask: 0` over the three lifecycle workflows |
| `test-phase-command-workflows.js` | PASS: `Result: passed=139 failed=0`. The baseline was 151. Six checkpoint entries left the lists and each carried two assertions |
| `boolean-expr.test.ts` | PASS: `pass 1` and `fail 0`, before and after |
| `speckit-goal-offer-contract.test.cjs` | PASS: `pass 5` and `fail 0` |
| `speckit-autopilot-contract.vitest.ts` | PASS: `Tests  4 passed (4)` |
| `command-catalog-mirror-check.cjs` | PASS: `STATUS=OK` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`speckit-plan.yaml` still says step 7 in four places.** Its `purpose` line and three `Steps 1-7` lines name a step count that is now six. They sit outside the save and closing steps this phase owns, and phase 8 aligns step counts.
2. **No lifecycle save was run end to end.** The checks prove what the tail and the steps say. They do not prove an agent pipes the JSON with all four flags.
3. **Step counts in the routers, the README and the presentation files are stale.** Plan now has 12 step keys, implement 15 and complete 21. Phase 8 aligns the counts.
4. **Two script gaps are documented, not fixed.** `session-relaunch.cjs` has no `dsh` runtime, and `rg-wrapper.mjs` has no end-of-options marker. The scripts are out of scope for this packet.
5. **Two checklist commands print more than their text said.** The consumer inventory still prints six lines from the deep command assets, whose keys only contain the string `write_continuity`. The producer inventory still prints bare script-name mentions in `save.md` and `README.txt`. Both checklist lines now say so.
6. **The create and design commands keep their own `write_continuity` and `anchor_requirements` blocks.** They are outside this packet.
7. **The filled example in the search display has no `HIDDEN` slot on its status line.** The requirement named only its recipe line.
<!-- /ANCHOR:limitations -->

---


