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
    last_updated_at: "2026-11-17T22:04:54Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed advisor items 1, 4, 5 and 6, closed items 2, 3, 7 and 8"
    next_safe_action: "Verify the operator yes, then commit worktree 470"
    packet_purpose: "Purpose: Success means four gaps are fixed and tested, and four more are closed with a recorded verdict or decision."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/command-bridge-loader.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts"
    session_dedup:
      fingerprint: "sha256:d6a9dbfee4fa1983162ae819ed5893f179441c62bfb74a6da0f16612c7b6092e"
      session_id: "3ae3d8e4-7b9e-4e6b-a563-896588eb48b6"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3ae3d8e4-7b9e-4e6b-a563-896588eb48b6"
      workspace: "/Users/michelkerkmeester/worktrees/public/470-surfacing-scorer-follow-ups"
      savedAt: "2026-11-17T22:04:54Z"
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
| **Completed** | 2026-11-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

"re-pin the vendored skilled tree" now surfaces `/doctor:overlay repin`. Before, it surfaced nothing. "link this project to ai-speckit" no longer routes to system-spec-kit, and "move my clickup ticket to in review" now goes to mcp-tooling, not code review.

### Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

A project that vendors Skilled reported eight advisor gaps. Four are fixed in code. A command phrase of three or more content words now matches when those words and its leading word sit close together in your prompt, at a lower score than an exact match. A single word joined to another by a hyphen no longer counts as a mention. The `review` boost skips ticket-status wording. Command bridges now load from `command-bridges.generated.json` at runtime, so regenerating the JSON is enough and the advisor needs no rebuild.

The other four close with no code change. You kept the short-prompt abstention rule and the command tie-break, both earlier recorded decisions. Per-lane scores were already returned with `includeAttribution`. The freshness claim is not confirmed for the native scorer.

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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A running advisor keeps its old bridges.** The daemon's source signature does not cover the bridges JSON, and the deriver still has to run to regenerate it. After regenerating, restart the advisor daemon.
2. **Paraphrases with different words still miss.** "bring our skilled copy up to date with upstream" shares too few words with any bridge phrase. Add such wording as a bridge phrase.
<!-- /ANCHOR:limitations -->

---
