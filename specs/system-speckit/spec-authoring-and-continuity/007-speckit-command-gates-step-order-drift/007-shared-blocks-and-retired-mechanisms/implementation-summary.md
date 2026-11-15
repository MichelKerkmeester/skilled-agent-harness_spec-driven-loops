---
title: "Implementation Summary"
description: "The lifecycle workflows read five shared blocks from one include, and every path, key, step and timer left in them resolves or is used by a step."
trigger_phrases:
  - "shared blocks and retired mechanisms implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms"
    last_updated_at: "2026-11-14T16:15:33Z"
    last_updated_by: "generate-context"
    recent_action: "Phase 7 implemented and verified at 40a11edf58"
    next_safe_action: "Run /speckit:implement on phase 8"
    packet_purpose: "Purpose: Each block that the lifecycle workflows share lives in one file, and every path, key, step and timer left in those workflows resolves or is used by a step."
    blockers: []
    key_files:
      - ".skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml"
      - ".skilled/commands/speckit/assets/speckit-plan.yaml"
      - ".skilled/commands/speckit/assets/speckit-implement.yaml"
      - ".skilled/commands/speckit/assets/speckit-complete.yaml"
      - ".skilled/skills/system-spec-kit/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:79b21af314eb33efa0afe82944d523e4587c1e8c3cefd02814d65d105b51f382"
      session_id: "scaffold-007-shared-blocks-and-retired-mechanisms"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "7d6d5694-6f2f-49e3-badd-e5c0396985cc"
      workspace: "/Users/michelkerkmeester/worktrees/public/381-speckit-command-gates-step-order-drift"
      savedAt: "2026-11-14T16:15:33Z"
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
| **Spec Folder** | 007-shared-blocks-and-retired-mechanisms |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The plan, implement and complete workflows now read their goal contract, standard checkpoint options, documentation levels, phase decomposition and predicate grammar from one shared file, and every path, key, step and timer left in them resolves or is used by a step.

### Phase 7: shared-blocks-and-retired-mechanisms

`assets/speckit-lifecycle-shared.yaml` holds five blocks once: `predicate_grammar`, `checkpoint_options` (the `standard` set), `goal_prompting`, `documentation_levels` and `phase_decomposition`. Each workflow keeps the key and points at the include with `shared_tail` and a `shared_tail_note`, the form the save step already uses. Plan and complete carry five pointers each and implement carries four, because it has no phase decomposition. Implement keeps its own `code_review` option set beside its pointer. The two drifted copies are settled: the levels carry the `LOC` unit and the first-child prompt reads `Continue with first child`.

The workflows no longer cite a path that does not resolve. The goal script, `check-prerequisites.sh`, `prevent-overengineering.md`, the sk-create-goal references, the deep research workflow and the sk-code and system-spec-kit references are written from the repository root, and complete names `specs/` where it named `.opencode/specs/`.

What no step used is gone: the four preflight and postflight scoring steps with their checkpoint entries, the wall-clock fields `recovery_s`, `timebox_minutes` and `session_preference_s`, the two `10 minutes` escalation triggers, the philosophy and `autonomous_execution` blocks, every banner rule line and three ephemeral comment ids. Implement now has 13 step keys and complete has 19. Plan keeps 12.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-lifecycle-shared.yaml` | Created | Holds the five shared blocks once |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modified | Pointers in place of the shared blocks, repository-rooted paths, no scoring step, timer, prose block or banner |
| `.skilled/commands/speckit/plan.md`, `implement.md`, `complete.md` | Modified | One Owned Assets row for the include |
| `.skilled/skills/system-spec-kit/command-metadata.json` | Modified | The include is a load resource for plan, implement and complete, beside the save tail |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Modified | Pins `packet_goal` once in the include and the pointer in each workflow |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | Modified | The `create.sh --phase` assertion reads the include and requires the pointer in plan and complete |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md`, `manual-testing-playbook.md` | Modified | The scenario commands and source rows name the include |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-folder-literal-naming-ai-derived-slugs.md` | Modified | One source row names the include as the home of the literal phase names activity |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Thirty-one dispatches went to DeepSeek V4.1 Flash on the Mistral provider through OpenCode, one file each and one at a time in worktree 381. Twenty-nine used the markdown persona and two, the test edits, used the code persona. Every one matched its expected file byte for byte on the first try.

The orchestrating session wrote the full target text of every file first, applied it to the worktree, ran every acceptance command, the checklist commands and the tests on it and restored the files before any dispatch. That run found four defects in the first target text, all fixed before dispatch: a dead `prevent-overengineering.md` path in plan, a structure test that pinned a string the move relocates, a load condition in complete that said `<spec-folder>` where the requirement wants `specs/`, and three em dashes on lines the change rewrites or moves.

The include was created in three append parts. Each workflow got one dispatch that ran a given script to delete the banner rule lines, then three to six dispatches of exact replacements. The session ran every acceptance command and the tests again on the final tree.

The `@review` gate (Opus, read-only) returned APPROVED with no P0 or P1 finding and seven suggestions. It ran every acceptance command and eight test suites itself. Three suggestions were taken with three more dispatches before the commit: the halt condition key, the neutral grammar literal and two bare file names in complete that the acceptance pattern does not catch. The other four are recorded under Key Decisions and Known Limitations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `test-phase-command-workflows.js` was edited, although `plan.md` lists it as unchanged | It asserted that plan and complete hold the `create.sh --phase` call. The call moves into the include, so the assertion now reads the include and requires the pointer in both workflows. The spec's 2026-11-14 decision lets a phase update a test it invalidates |
| Three more readers were repointed: two command lines in the goal-hook playbook, one line in the cli-claude-code root playbook and two rows in the literal-naming feature catalog | The consumer inventory (T004) found them. Each named the plan or complete workflow for text that now lives in the include, and the playbook command would have found nothing there |
| The include is listed in `command-metadata.json` for plan, implement and complete | The operator approved this on 2026-11-14 through the question tool. The file lists the save tail as a load resource, and an agent that loads by metadata would otherwise never open the include |
| `predicate_grammar` is a key with four string children and the example literal `<field> == TRUE` | A key can be pointed at and a header comment cannot. The first build kept plan's `intake_only == TRUE`, and the review gate pointed out that implement has no such field |
| `phase_decomposition` stays nested under `optional_workflows` in plan and complete and points at a top-level include key | References such as `optional_workflows.phase_decomposition` keep resolving in the workflow |
| Section title comments such as `# USER INPUTS` stay, and the banner that carried AGENT AVAILABILITY becomes a plain comment line | REQ-014 allows a one-line title comment. Only the rule lines go |
| The `halt.when` prose in implement and complete becomes `halt.trigger` | REQ-009 allows no prose `when`. The first build used `after`, and the review gate pointed out that the grammar says `after` is never evaluated, which would leave the halt with no condition. `trigger` is the key the escalation and debug blocks already use for a prose condition |
| `memory_saved` becomes `continuity_saved` | The save tail uses continuity wording. Phase 6 had already removed every `memory_action` key |
| No rule moved into `rules` from the removed prose blocks | The review gate checked every deleted line. Three phrases have no restatement: `maintain audit trail` and a general `choose conservative approach` in complete, and `document alternatives` in plan. Both the session and the reviewer judge them posture text that no step or gate reads, which is how finding B11 classifies these blocks. An operator who reads any of them as a rule can add a rule id |
| Three em dashes were replaced with a comma or a colon | Two sat in the phase naming activity that moves into the new file, and one sat on the complete line whose paths are rewritten. The dispatch contract bans an em dash in added text |
| `checkpoint_protocol.autonomous_behavior` in complete keeps `timeout_seconds: 0` | No requirement names it, and a zero timeout is not a wait |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal script and prerequisites paths | PASS: `[^/]bin/goal\.cjs` and `[^/]check-prerequisites\.sh` print nothing with exit 1. The include holds 5 lines with the rooted goal script and the workflows hold 6 with the rooted prerequisites script |
| `.opencode/specs` in complete | PASS: prints nothing with exit 1 |
| Blocks live once | PASS: `packet_goal`, `standard` and `level_1_baseline` print nothing in the workflows. The include prints 1 `packet_goal`, three `loc_guidance` lines ending `LOC"` and one first-child prompt |
| Pointers | PASS: 5 in plan, 4 in implement, 5 in complete. Each pointed key prints 1 in the include. `shared_tail_note` and `shared_tail` counts match per file: 6, 5 and 6 |
| Routers | PASS: each of the three routers prints 1 for the include |
| Predicate grammar | PASS: `when: "` and `YAML PREDICATE GRAMMAR CONTRACT` print nothing, and each workflow prints 1 pointer |
| Retired vocabulary, scoring steps and timers | PASS: the three searches print nothing with exit 1 |
| Dead partial paths | PASS: the six-pattern search prints nothing with exit 1 |
| Prose blocks, banners and comment ids | PASS: the three searches print nothing with exit 1 |
| Measured Behavior command from `spec.md` | PASS: prints nothing with exit 1 |
| YAML parse | PASS: js-yaml exits 0 for the include and each workflow, and PyYAML prints `pyyaml parsed 4` |
| Mode tags | PASS: `untagged: 0` and `autopilot_ask: 0` |
| `test-phase-command-workflows.js` | PASS: `Result: passed=131 failed=0`. The baseline was 139. Four scoring steps left the checkpoint lists and each carried two assertions |
| `speckit-goal-offer-contract.test.cjs` | PASS: `pass 5` and `fail 0`, before and after |
| `boolean-expr.test.ts` | PASS: `pass 1` and `fail 0` |
| `speckit-autopilot-contract.vitest.ts` | PASS: `Tests  4 passed (4)` |
| `speckit-review-dispatch-contract.test.cjs`, `gate-3-menu-parity.test.mjs`, `yaml-intake-event-payloads.vitest.ts` | PASS: `pass 5`, `pass 17` and `Tests  7 passed (7)`, no failure |
| Command metadata readers | PASS: `command-catalog-mirror-check.cjs` prints `STATUS=OK`, its test prints `pass 14`, `ci-skill-root-metadata.cjs` prints `checked=14 passed=14 failed=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No lifecycle command was run end to end on the new files.** The checks prove the text and the tests. They do not prove that an agent resolves each pointer.
2. **One checklist command prints a line.** The comment-id search still prints `speckit-complete.yaml:245`, the `## ADR-001` heading inside the decision record scaffold. It is template text in a block scalar, it was there before this phase and it is not a comment. The checklist line now says so.
3. **Step counts in the routers, the README and the presentation files are stale.** Implement now has 13 step keys and complete 19. Phase 8 aligns the counts.
4. **The plan and complete presentation files still hold the first-child prompt.** The spec leaves that copy to phase 8.
5. **The README tree does not list the include yet.** The checklist leaves that entry to phase 8.
6. **The `principle`, `approach` and `mandate` keys under `mode_overrides.confirm` now override nothing.** Their base keys sat in the removed prose blocks. No step reads them, and the review gate rated it cosmetic. It belongs to the mode contract, outside this phase.
7. **The goal-hook scenario still names `AGENTS.md` for the fence sentence.** `rg` finds the sentence in the include and in `budget-and-handoff.md` and not in `AGENTS.md`. The claim predates this phase, which only repointed the workflow path on those lines.
8. **Three pointers have no test.** The goal offer test pins `#goal_prompting` and the structure test pins `#phase_decomposition`. `#checkpoint_options`, `#documentation_levels` and `#predicate_grammar` are checked only by the acceptance commands.
9. **`spec.md` states a test baseline of 150.** The baseline when this phase started was 139, after phase 6.
10. **The literal-naming feature catalog and its playbook are stale beyond the row this phase fixed.** The catalog says four workflow files carry the activity, and the playbook greps `spec_kit_plan_auto.yaml`, a file that no longer exists. Both predate this packet and are outside it.
<!-- /ANCHOR:limitations -->

---


