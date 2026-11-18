---
title: "Implementation Summary"
description: "Built 2026-11-18: the pasted-reply strip rule now needs an attribution header and cuts at the last task marker, proven by 17 shared fixture rows, with 0 corpus changes and the follow-up bench unmoved."
trigger_phrases:
  - "strip rule boundary edges implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/006-strip-rule-boundary-edges"
    last_updated_at: "2026-11-18T18:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the strip-rule edges"
    next_safe_action: "Build phase 007, the Python scorer port"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 100
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-strip-rule-boundary-edges |
| **Completed** | 2026-11-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A pasted reply is now dropped only when an attribution header shows the assistant wrote it, and the cut lands at the last `Now:` or `Task:` marker. A user's own `>`-quoted requirement stays in the scored text, a `Task:` line inside the pasted reply no longer cuts too early, and `Assistant response:` counts as a header.

### Phase 6: strip-rule-boundary-edges

`PASTED_REPLY_CUE` lost its quote alternative and gained an `assistant` or `claude` plus `response`, `reply` or `answer` branch. `TASK_MARKER` is global, and `stripPastedReplyOnce` takes the last match. The exported `stripLeadingPastedReply` keeps its name, its loop and its three callers. Seventeen cases live in one fixture that the TypeScript test reads now and the Python test reads from phase 007.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/prompt-policy.ts` | Modify | New cue, global marker and last-marker cut, each with a one-line reason comment |
| `runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Modify | Reads the shared fixture and checks each row plus a second pass returning the same text |
| `runtime/tests/fixtures/pasted-reply-strip-cases.json` | Create | 17 input and expected-output rows, one with an `ideal` field for the known miss |
| `runtime/tests/fixtures/README.md` | Modify | Tree row and key-files row for the new fixture, by conductor amendment |

No baseline file changed, because no routing moved.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor recorded the baselines, then four GPT-6 Luna `xhigh` `fast` leaves wrote the fixture with its README row, the test block, the cue and the last-marker cut, one change each. The conductor ran the red run, the choosing procedure, the typecheck, the build, the corpus count, the gates, the bench, the probes, comment hygiene and a read-only Luna refutation pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A quote or `>` alone is not a cue | It shows text is quoted, not that the assistant wrote it. The old cue stripped a user's own `>`-quoted requirement |
| Marker rule: last-marker, remaining miss `two-markers-in-user-task` | Steps 1 and 2 of the fixed procedure tied: each candidate missed one row and changed only `rr-paste-208` of 701 corpus rows and 0 of 24 harder rows. Step 3 decided it: first-marker's miss routes `sk-doc` where the ideal text routes `sk-code`, while last-marker's miss still routes `sk-code` |
| The README gets the fixture's two rows | It lists every fixture and its readers. Added to Files to Change by amendment before the edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red run, T007 | 5 failed and 18 passed, exactly the five planned rows |
| `POLICY` after the build | Exit 0, 23 of 23 |
| Typecheck and build | Both exit 0, build at 17:39:39 |
| `COUNT` | Unchanged: `{"jsonl":701,"jsonlChanged":["rr-paste-208"],"harder":24,"harderChanged":[]}` |
| `GATES` | Exit 0, 11 files, 67 of 67 |
| `BENCH` | Exit 0, `N` 9, `H` 5, `Hsame` 2, `C` 19, the same as before; the calibration baseline did not change |
| Probes on a daemon started 17:40:11 | The 002 probe text and the `Assistant response:` input both list `sk-code` first, not degraded |
| Comment hygiene | `rg` printed nothing |
| Refutation pass (Luna `xhigh`, read-only) | REFUTED with two findings, both checked and kept as known limitations below: a quote-only pasted reply is not stripped, which is decision D2 pinned by `quote-led-straight`, and a literal `Claude reply:` heading in user prose would be treated as a header. No backtracking risk and no fixed-point defect found |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A user's own two-marker task loses its first part.** `Earlier you replied: Done. Task: Refactor the session store module. Now: also update its tests.` scores as `also update its tests.`. It still routes `sk-code`, the same as the ideal text. The fixture row `two-markers-in-user-task` keeps the ideal in its `ideal` field.
2. **A quote-only pasted reply passes through.** A reply pasted in quote marks with no header keeps its skill names in the scored text. The rule cannot tell it from a user's own quoted requirement.
3. **A literal `Claude reply:` or `Assistant response:` heading at the start of user prose counts as a header.** No corpus prompt does this.
<!-- /ANCHOR:limitations -->

---
