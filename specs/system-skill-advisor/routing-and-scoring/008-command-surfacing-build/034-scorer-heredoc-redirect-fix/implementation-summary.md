---
title: "Implementation Summary: Phase 34: scorer-heredoc-redirect-fix"
description: "The transcript scorer no longer reads a comparison inside a heredoc body as a write. The rescore removes the untuned arm's only decline start, so the B-5 trigger does not fire and the verdict stays Not shown on p alone."
trigger_phrases:
  - "scorer heredoc redirect fix implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/034-scorer-heredoc-redirect-fix"
    last_updated_at: "2026-11-16T06:00:39Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 034: fix 4bb83364145 and 2199af49c56, rescore logged, B-5 not fired"
    next_safe_action: "Review segment five ranks 1 to 4 and plan the measurement-build phase"
    packet_purpose: "Purpose: The scorer reads only real redirects as writes, and the arm's verdict and B-5 trigger are restated from a rescore with the fixed scorer."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/034-scorer-heredoc-redirect-fix/implementation-summary.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/034-scorer-heredoc-redirect-fix/scratch/rescore-evidence.txt"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
    session_dedup:
      fingerprint: "sha256:fa0517b9a257a42132ae366a6f1e7abb7c386bde5a30b2e131df1e51d4eb6821"
      session_id: "scaffold-034-scorer-heredoc-redirect-fix"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-16T06:00:39Z"
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
| **Spec Folder** | 034-scorer-heredoc-redirect-fix |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The transcript scorer no longer turns a comparison inside a heredoc body into a write. That misread was the whole of the untuned arm's one decline start. With it gone the B-5 trigger does not fire, and the arm reads Not shown on its p value alone.

### Phase 34: scorer-heredoc-redirect-fix

`redirectTargets` now strips heredoc bodies before it looks for `>`, as the read and write parsers already did. A Python line such as `if len(x)>0:` inside `python3 - <<'PY'` is the program's input, not a shell redirect, so it no longer gives the scorer a write in the checkout. Without that write, DSH's run 1 of `fresh-decline-refusal-02` is what the fixed start rule calls a lookup: it read `/create:sk-skill` after declining the offered `/deep:review` and wrote nothing.

The gate review then found two gaps in the shared heredoc pattern. An empty body ran on to a later line that reused the end word and hid the redirects between. A backslash-quoted end word such as `\PY` did not match at all. Both are fixed in the one pattern the three parsers share.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | `redirectTargets` strips heredoc bodies (`4bb83364145`). `HEREDOC_BODY` accepts an empty body and a backslash-quoted end word (`2199af49c56`) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | Six cases: body comparison, opening-line redirect, the DSH start shape, an empty body before a real redirect, a redirect after the end line, a backslash end word |
| `scratch/heredoc-probe.mjs`, `scratch/heredoc-reach.mjs`, `scratch/rescore.py` | Created | The probe, the reach count over 033's lines and the rescore with the 026 filters |
| `scratch/before.txt`, `scratch/after.txt`, `scratch/boundaries.txt` | Created | Gate output before and after the fix, and the boundary checks |
| `scratch/summary-before.json`, `scratch/summary-rescore.json`, `scratch/rescore-evidence.txt`, `scratch/rescore-diff.txt` | Created | The reproduction of 033, the rescore and its two changed lines |
| `../goal.md` | Modified | Rows `Arm verdict, rescored` and `B-5 trigger, rescored` through the goal log command |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The before state came first: suite 2313 passed, floors 24/44, 0/35 and 2/44, eval `[160,49,21,5]`, the probe showing the false start and 12 arm lines whose only checkout writes were heredoc misreads. The unfixed scorer then rescored 033's 401 lines byte for byte, so any later change belongs to the fix. After the fix the suite, floors and eval were rerun, the reach count fell to 0 on all five runtimes, and `rescore.py` rescored the same lines with the filters read straight from the 026 task list. A gate review approved with two P2s on the shared pattern. Both were fixed, the gates were rerun and the rescore came out byte-identical to the first one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the parser that names a write, not each reader of the boundary | `startedCommand`, `followedBeforeWrite` and `workflowPath` all read the same first-write boundary, so one fix at the producer covers them |
| Prove the unfixed scorer reproduces 033 before rescoring | A store that changed since 033 would otherwise look like an effect of the fix. `cmp` exit 0 rules that out |
| Apply the review's two P2s in this phase | The empty-body gap became a regression in `redirectTargets` the moment it adopted the pattern, and both fixes are one line in the pattern the fix already used |
| Log new rescored rows and leave 033's rows in place | The goal log is append-only, and a reader needs both the first verdict and why it changed |
| Do not build B-5 | The rule fixed before the arm (P036) builds it only on a decline start or more skill-only starts on than off. The rescore prints 0 of 80 and 0 of 40 against 0 of 40 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probe | Before: `body ["0:"] started /create:sk-skill`. After: `body [] started null`, opening-line redirect still `notes.txt` |
| New tests | Six cases pass. The first three fail with the scorer at `3d794f1df74` |
| Advisor suite | 185 files, 2319 passed, 6 skipped, 0 failed (`after.txt`) |
| Floors and eval | `24/44`, `0/35`, `2/44` and `[160,49,21,5]`, equal before and after |
| Reproduction | `cmp summary-before.json 033/summary-arm.json` exit 0 |
| Rescore | 45 evidence lines with 033's line kinds. Two lines changed: pooled decline starts on 1 to 0 of 80, `starts dsh on decline` 1 to 0 of 16. Followed, paired, pooled counts and p=0.0769 unchanged |
| Rescore after the review fixes | `summary-rescore.json` byte-identical to the first rescore |
| Boundaries | 033's scratch unchanged, the fix commits touch only the scorer and its test, `hook-flags.env` absent |
| Gate review | APPROVED 95/100, no P0 or P1. Both P2s fixed in `2199af49c56` |
| Acceptance criteria | 5 of 5 Met (`acceptance-criteria.md`). Checklist P0 12 of 12, P1 13 of 13 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An arrow function in a quoted inline script can still read as a redirect.** DSH's run 2 of the same row holds `node -e` code with `(a,b)=>b[1]-a[1]` inside escaped quotes, and `=>` still yields the target `b[1]-a[1]`. It sets no start, because that run read no command document, and it changes no 033 number. A false write of this kind can only add a start, never hide one. It belongs to a later scorer phase.
2. **The reach count sees only the heredoc forms the shared pattern matches.** Its 0 on all five runtimes says nothing about a heredoc shape the pattern misses.
3. **`before.txt` records an empty suite exit code.** Its pipeline lost the status. The suite line itself reads 0 failed, and `after.txt` records exit 0.
<!-- /ANCHOR:limitations -->

---
