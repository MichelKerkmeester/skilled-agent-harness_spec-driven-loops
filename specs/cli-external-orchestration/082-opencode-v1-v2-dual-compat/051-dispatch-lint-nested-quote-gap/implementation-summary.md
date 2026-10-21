---
title: "Implementation Summary"
description: "The Pi dispatch lint no longer lets an executor mention authorize from inside a quote, backtick, $( ) or ${ } span. One context-stack scanner, run under every reading the text could have, replaced two scan helpers, closing 039's last recorded P1 and 18 more leaks three review rounds found."
trigger_phrases:
  - "dispatch lint nested quote gap implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/051-dispatch-lint-nested-quote-gap"
    last_updated_at: "2026-10-21T20:30:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Three review rounds closed, the post-round deep-loop P1 fixed, suites at baseline"
    next_safe_action: "Push to main and record CI on the pushed commit and the tip"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "051-dispatch-lint-nested-quote-gap"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 051-dispatch-lint-nested-quote-gap |
| **Status** | In Progress |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A mention like `cli-devin` in the operator's text authorizes a Pi dispatch only when it is plain text. The old scan kept one backtick flag, so in `$(echo "`printf ")"`" cli-devin)` the quote inside the backtick closed the outer double quote and the mention authorized. 040 shipped that as a recorded P1.

### Phase 51: dispatch-lint-nested-quote-gap

`isEnclosedOrUnresolved` replaces `isInsideQuote` and `isInsideExpansion`. It keeps a stack of frames (`$(`, a bare `(` inside it, `${`, backtick, `"`, `'`), reads each character by the POSIX rules of the frame on top, and denies when the stack goes past 32 or text ends with a frame open (one trailing prose apostrophe excepted). `isEnclosedInAnyReading` runs it four ways, with and without shell comments and with curly quotes read as quotes and as literals, and refuses a mention any reading encloses. A `case` inside a substitution is unresolvable. Only listed English contractions count as prose apostrophes, so a possessive is a shell quote. A `[user]` marker inside an open span empties the text instead of cutting it. A `/deep:` phrase's executor value must itself be plain text.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified | The scanner, the four readings, the contraction list, the turn-marker check and the deep-loop executor position |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modified | 34 deny rows, each failing on base `82df5375ba`, and 11 allow rows |
| `.skilled/hooks/dispatch/README.md` | Modified | The lint's row states the enclosure rule instead of the closed gap |
| `../039-sk-code-opencode-alignment-audit/review.md` | Modified | `b09-hooks-dispatch-R01` fixed; §2 P1 is 47/47/18/0 |
| `../040-dispatch-lint-held-fixes/implementation-summary.md` | Modified | The gap is closed, and the review rounds' P2 and P3 items are recorded |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `scratch/` | Created | This phase's packet, its suite, mutation and corpus scripts and their output |
| `../spec.md` | Modified | The phase map row for 051 and its handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max (through `cli-pi` on `llmgateway`) wrote the scanner and each fix round from one-change briefs. Separate read-only DeepSeek sessions reviewed after each round. The orchestrator corrected two places where the first writer left the brief (a single quote opened a frame inside double quotes, and the apostrophe exemption returned before the enclosure result), reflowed one comment, and wrote the final one-line deep-loop fix itself. Luna was not used.

Round 1 found seven leaks (comments, `case`, in-word apostrophes, curly and straight quote mixes, `${`). Round 2 found five (comments and `case` after `)`, the turn marker, possessives). Round 3, a fresh reviewer, found the scanner held under 164 texts, and found that `deepLoopExecutors` checked the `/deep:` position instead of the executor's. That fix landed after round 3, as the coordinator's rule allows for a P1 that changes a result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the scan under four readings and deny if any encloses | Operator text is not known to be shell, and each reading pairs quotes the others do not; a union can only add denies |
| Fail closed on unclosed frames and depth past 32 | A misread closer usually leaves something open at the end, and a false deny is P2 by policy |
| List contraction words instead of any in-word apostrophe | A possessive or a crafted `foo'cli-devin'` is a shell quote; the listed contractions stay a documented carve-out |
| Empty the text when `[user]` sits inside an open span | Cutting there drops the opener; keeping the whole text could let an earlier turn authorize |
| Record the review rounds' P2 and P3 items instead of fixing them | The directive allows three fix rounds and then only P1s that change a result |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lint vitest file | 259 passed |
| Mutation against base `82df5375ba` | 34 failed, exactly the deny rows, 225 passed (`scratch/mutation/base-engine-final.txt`) |
| Pi corpus, 476 texts x 2 commands | 0 verdicts moved (`scratch/pi-corpus-diff.txt`) |
| Audit and rule-check engines | Unchanged since base, so the 260-command corpus cannot move |
| Suites, baseline to after | Hooks node 872 to 872, hooks vitest 401 to 452, plugins 516, battery 51, rule-checks 42, audit 124 |
| Review rows checker | 0 open P0/P1; §2 P1 table 47/47/18/0 matches the rows |
| Read-only reviews | Round 1 FAIL (7 P1), round 2 FAIL (5 P1), round 3 FAIL (1 P1, fixed after) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The listed contractions are a carve-out.** `it's cli-devin'` reads as prose though a shell would quote the mention.
2. **The final deep-loop fix had no fourth review.** Its eight round-3 texts deny and its rows fail on base.
3. **P2 false denies and P3 notes are recorded in 040's known gaps.**
4. **The baseline audit count printed 620.** That run collected the test file five times through temporary symlinks; 124 is the real count, and `dispatch/lib` is unchanged.
<!-- /ANCHOR:limitations -->

---
