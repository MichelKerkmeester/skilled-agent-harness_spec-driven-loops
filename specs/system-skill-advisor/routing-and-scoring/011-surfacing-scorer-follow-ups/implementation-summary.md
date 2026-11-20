---
title: "Implementation Summary"
description: "The advisor now surfaces a command from close wording, stops reading a word inside a hyphenated name, keeps ticket-status wording out of code review and reads command bridges from the generated JSON at runtime. Four other reported items closed with no code change."
trigger_phrases:
  - "surfacing scorer follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups"
    last_updated_at: "2026-11-18T08:21:46Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed second-round advisor items 3, 5 and 6; kept doctor command order"
    next_safe_action: "Verify the operator yes, then commit worktree 472"
    packet_purpose: "Purpose: Success means the four first-round gaps and three second-round items are fixed and tested, and the remaining claims are closed with a recorded verdict or operator decision."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts"
    session_dedup:
      fingerprint: "sha256:2da70597bc2c43491d942f4501091923926f69b03b9aac5427748d7ecfea6ba2"
      session_id: "3ae3d8e4-7b9e-4e6b-a563-896588eb48b6"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3ae3d8e4-7b9e-4e6b-a563-896588eb48b6"
      workspace: "/Users/michelkerkmeester/worktrees/public/472-vendored-layout-and-scorer-fixes"
      savedAt: "2026-11-18T08:21:46Z"
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
| **Spec Folder** | 011-surfacing-scorer-follow-ups |
| **Completed** | 2026-11-17, second round 2026-11-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

"re-pin the vendored skilled tree" now surfaces `/doctor:overlay repin`. Before, it surfaced nothing. "link this project to ai-speckit" no longer routes to system-spec-kit, and "move my clickup ticket to in review" now goes to mcp-tooling, not code review.

### Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

A project that vendors Skilled reported eight advisor gaps. Four are fixed in code. A command phrase of three or more content words now matches when those words and its leading word sit close together in your prompt, at a lower score than an exact match. A single word joined to another by a hyphen no longer counts as a mention. The `review` boost skips ticket-status wording. Command bridges now load from `command-bridges.generated.json` at runtime, so regenerating the JSON is enough and the advisor needs no rebuild.

The other four closed with no code change in the first round. You kept the short-prompt abstention rule and the command tie-break, both earlier recorded decisions. Per-lane scores were already returned with `includeAttribution`. The freshness claim is not confirmed for the native scorer.

### Second round, 2026-11-18

A second report brought four more advisor items, and you chose to fix all four. "grab the figma frame for the partners dashboard" and "get the dashboard design from figma" now go to mcp-tooling: a read verb ahead of Figma, Refero or Mobbin with no build verb is a design read, and the `dashboard` boost is skipped when a design tool is named. "implement the dashboard from figma" stays with sk-code. On a short prompt, a rival that only reached the confidence floor no longer ties a real match into abstention, unless a command matched one of its own full phrases, so "skill budget audit" still reaches `/doctor:skill-advisor skill-budget`. With `includeAttribution`, the CLI JSON now also fills `laneContributions`.

The command-order item stays as it was. A rule that lists a doctor command first when it outscores its skill flipped 12 designed doctor prompts, and you kept skill-first, so "re-pin the vendored skilled tree" still lists `/doctor:overlay repin` second.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Close-wording command match, hyphen-joined word rule, ticket-status guard on the `review` boost |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/command-bridge-loader.ts` | Created | Renders the bridges JSON the way the deriver renders the compiled block |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modified | `COMMAND_BRIDGES` prefers the loaded JSON and falls back to the compiled block |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/command-phrase-tolerance.vitest.ts` | Created | Close-wording match, scattered words, leading word, exact-only skill rows |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/review-status-wording.vitest.ts` | Created | Ticket status skips the boost, code review keeps it |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/command-bridge-loader.vitest.ts` | Created | JSON equals compiled block, JSON edit applies, bad JSON falls back |
| `.skilled/skills/system-skill-advisor/runtime/tests/name-mention-scoring.vitest.ts` | Modified | Hyphen-joined word cases |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Second round: design-tool read rule and the `dashboard` boost skip |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Modified | Second round: a floor-only rival no longer ties a real top, with the `floorTiesCount` option |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | Second round: passes a full-phrase command match to both scoring passes |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modified | Second round: `laneContributions` beside `laneBreakdown` |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modified | Second round: schema allows `laneContributions` |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/dashboard-design-source.vitest.ts` | Created | Second round: boost skip, design reads, build prompts |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/advisor-quality-049-003.vitest.ts` | Modified | Second round: the new floor rule and its guards |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts` | Modified | Second round: `laneContributions` only with attribution |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md`, `feature-catalog/cli-surface/advisor-recommend.md` | Modified | Second round: name `laneContributions` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each new test ran and failed before its fix, then passed after it. Then `npm run build` exited 0, and the whole advisor suite ran. The worktree's advisor daemon was stopped so the CLI checks ran on the new build with a cache miss. Last, the vendoring project's prompt set ran read-only on the clean build and the fixed build, and the rows were compared. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Close-wording matching applies to command rows only, with three or more content words and the phrase's leading word present | A first version without the leading-word rule read "agents md sections are stale" as the bridge phrase "which agents md sections are stale" and broke a doctor hand-off test. |
| Keep the compiled bridge block as the fallback | Deleting generated code was not needed. A missing or malformed JSON still gives a working advisor. |
| Item 2 keeps current behavior (operator, 2026-11-17) | Commit `1c80022452b` chose it so a floored skill cannot top a vague prompt, and the cited prompt does not reproduce in Skilled. |
| Item 3 keeps current behavior (operator, 2026-11-17) | Packet 007's research kept the 0.08 tie-break, and the command is still offered beside its owner. No same-owner precedence rule was added. |
| Second round: keep skill-first for doctor commands (operator, 2026-11-18, ADR-001) | A lead-when-it-outscores rule flipped 12 pinned doctor prompts, and no margin or ownership rule singled out the repin prompt. |
| Second round: change the floor rule, with a full-phrase command exception (operator, 2026-11-18, ADR-001) | Without the exception, "skill budget audit" went to sk-code on one word. The skills' abstention runs in a doctor-free pass, so the full pass passes the match to it. |
| Second round: a design read moves the route, not just the `dashboard` boost | sk-code's own `from figma` alias won the Figma prompts here, so skipping the boost alone left them on sk-code. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor vitest before the change | 2389 passed, 6 failed, 8 skipped. The 6 were load-flaky CLI and hook tests that passed on later runs. |
| Advisor vitest after the change | PASS: 188 files, 2407 passed, 0 failed, 8 skipped |
| Typecheck and build | PASS: `tsc --noEmit` exit 0, `npm run build` exit 0 |
| CLI on the new build, cache miss | "re-pin the vendored skilled tree" surfaces the repin command at 0.8323. "review my code" stays sk-code at 0.9494. |
| Vendoring project prompt set | Top-1 19/36 before and after. Commands 1/7 to 2/7. mcp-02 now hits. fp-04 and fp-05 lost hits that came only from the hyphen bug. |
| Second round: advisor vitest | Clean baseline on `82aaab5abbc`: 2407 passed, 0 failed, after building the new worktree's skill graph. After: 189 files, 2414 passed, 0 failed, 8 skipped. Typecheck and build exit 0. |
| Second round: vendoring prompt set | Top-1 19/36 to 20/36: mcp-03 moved from sk-code to mcp-tooling. Commands 2/7 both, extra set 4/9 both. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A running advisor keeps its old bridges.** The daemon's source signature does not cover the bridges JSON, and the deriver still has to run to regenerate it. After regenerating, restart the advisor daemon.
2. **Paraphrases with different words still miss.** "bring our skilled copy up to date with upstream" shares too few words with any bridge phrase. Add such wording as a bridge phrase.
3. **The repin command still lists second.** That is the kept skill-first order: the command is offered after `system-skilled-doctor`, not dropped.
4. **The design-read rule is a word rule.** It needs a read verb ahead of Figma, Refero or Mobbin, and any build verb turns it off, so "read the figma specs and build the page" stays with sk-code.
<!-- /ANCHOR:limitations -->

---
