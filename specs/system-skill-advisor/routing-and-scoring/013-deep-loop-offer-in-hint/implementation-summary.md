---
title: "Implementation Summary"
description: "The advisor brief now names the three deep-loop offer options beside the ask policy. Tests pass, but four F6 sessions did not ask the full offer more often than before."
trigger_phrases:
  - "deep loop offer in hint implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint"
    last_updated_at: "2026-11-23T17:27:55Z"
    last_updated_by: "generate-context"
    recent_action: "Reworded option A as recommended and resampled F6 four times"
    next_safe_action: "Wait for the operator to keep, reword or revert the brief change"
    packet_purpose: "Purpose: A session that sees a `/deep:research` or `/deep:review` command with policy `ask` in the brief can ask the three-option offer without opening the command doc first."
    blockers:
      - "SC-002 unmet in F6 sampling"
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md"
      - "specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md"
      - ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-deep-loop-offer-in-hint"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "5789dc27-c573-44e7-afdc-52d0e17986b0"
      workspace: "/Users/michelkerkmeester/worktrees/public/527-deep-loop-offer-in-hint"
      savedAt: "2026-11-23T17:27:55Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-deep-loop-offer-in-hint |
| **Completed** | Not yet. Built and tested, SC-002 unmet |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The brief head for a deep-loop command with policy `ask` now reads `system-deep-loop → /deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop)`. Every other command label is unchanged, and a dispatched child still gets `(parent-named only)` with no options.

### Carry the deep-loop offer in the advisor hint

A session that sees the brief now learns the three offer options without opening the command doc. Across eight F6 runs, none asked all three options in one question. After A was marked recommended, three of four sessions preferred `:auto`, against one of four before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modified | `commandLabel` appends the options after `/deep:research` or `/deep:review` when the policy word is `ask` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts` | Modified | Two deep-loop goldens take the new head, plus a child-session case and a doctor-companion case |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts` | Modified | Accepts a policy word followed by the options |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | Modified | Expects the new non-child deep-research head |
| `.skilled/hooks/injection-contract.md` | Modified | Shows the deep-loop variant of the head |
| `scratch/behaviour/F6-1.md` to `F6-8.md` | Created | Runs 1 to 4 on the first wording, runs 5 to 8 after A was marked recommended |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The advisor was built, the brief command printed the new head, and the full suite ran green. The change was committed as `c4198c6f8cc`, a behaviour arena was built from that commit, and F6 ran four times there with `claude -p`, `claude-sonnet-5-5`, bypass permissions and a $0.75 cap per run, resetting the arena between runs. Two runs defaulted to `:confirm`, so option A gained the `(Recommended)` marker in `9dcaaea6b8f`, the suite was rerun and F6 ran four more times from that commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Scope the options to `/deep:research` and `/deep:review` only | Only those two commands have a fixed three-option offer. The operator chose this with the plan |
| Mark option A `(Recommended)` | Two of the first four runs defaulted to `:confirm`. The command's own offer marks A recommended, and the operator chose this after the first sample |
| No spec-folder placeholder in option A | The brief cannot know the Gate 3 answer, and a placeholder makes the head longer, also in Pi where the operator sees it. The operator chose this |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Advisor `npm run build` | exit 0 |
| `BRIEF` command from `spec.md` | First line: `Advisor: live; use system-deep-loop → /deep:review (ask: A /deep:review:auto, B /deep:review:confirm, C no loop) 0.95/0.12 pass.` |
| Advisor `npx vitest run` | 180 files, 2624 passed, 4 skipped, 0 failed. The baseline was 2622 passed, and the two new cases account for the difference |
| Golden test diff | Only the two deep-loop `expectedHead` lines change, and two cases are added |
| F6, four runs at `c4198c6f8cc` | 0 of 4 asked the full offer. Run 2 recommended `/deep:review:auto` over `:confirm`, and run 4 quoted A and B from the brief but recommended B. Neither offered C. Runs 1 and 3 asked only for the target and defaulted to `:confirm`. No run composed `--extend=3`. Costs $0.153, $0.121, $0.050 and $0.021, $0.35 in all |
| Suite after the rewording, at `9dcaaea6b8f` | 180 files, 2624 passed, 4 skipped, 0 failed |
| F6, four runs at `9dcaaea6b8f` | 0 of 4 asked the full offer, and none offered C. Runs 6 and 7 offered `/deep:review:auto` as recommended against `:confirm`. Run 5 proposed `/deep:review:auto` with `--extend=3` on a named packet, with no other options. Run 8 asked only for the target. Costs $0.184, $0.112, $0.036 and $0.043, $0.37 in all |
| Packet 012's rate after its routing-step edit, for comparison | 1 of 4 asked the full offer |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **SC-002 is unmet.** In eight runs, no F6 session asked all three options in one question. Every session asked for the review target first, and in `claude -p` the question tool is not available, so each one asked in plain text. Four samples cannot separate a real effect from noise.
2. **No session offered option C.** Every session that named options treated the choice as `:auto` against `:confirm` and left out the no-loop answer.
<!-- /ANCHOR:limitations -->

---


