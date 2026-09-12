---
title: "Implementation Summary"
description: "One conditional described a successful empty result as a transport outage. That single wrong message cost three investigations in one session before it was recognised as the defect."
trigger_phrases:
  - "no match diagnostic summary"
  - "misleading error message fixed"
  - "advisor suite fully green"
  - "negative control evidence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/027-empty-recommendation-diagnostic"
    last_updated_at: "2026-09-12T14:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "No-match case reports honestly; advisor suite fully green at 868 passed, 0 failed"
    next_safe_action: "Nothing outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01V4wzp8qRJRvyXdqxAYuJTi"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether skipped should split into two statuses rather than one status with two reasons"
    answered_questions:
      - "Was there a pi cold-start defect? No. The symptom was this message plus a prompt with nothing to recommend"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-empty-recommendation-diagnostic |
| **Completed** | 2026-09-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor hook reports three outcomes: it routes, it fails open, or it skips. Skipping covered two situations that have nothing in common. The advisor could not be reached, or the advisor answered and no skill cleared the confidence threshold. Both emitted the same diagnostics, naming an error code and an unavailable marker, even when the call exited zero against a live daemon that simply had nothing to say.

The branch lives in `hooks/lib/skill-advisor-cli-fallback.ts`, in the result builder that turns a CLI response into a hook result. A live advisor with no match now says exactly that. It carries a reason and a no-match message, and no error code or class, because nothing failed. An unreachable advisor keeps the wording it had.

### Why this was worth a packet

That message is the only explanation a reader gets when no brief appears, and it named a failure that had not happened. In this session it produced a reproducible five-of-five "cold-start defect" on a path that was working correctly the whole time, and it survived three separate hypotheses about transport, node interpreters and environment before the message itself was recognised as the thing that was wrong. A diagnostic that lies is worse than no diagnostic, because it is followed.
### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/lib/skill-advisor-cli-fallback.ts` | Modified | No-match split out of the outage diagnostics; result builder exported as a test seam |
| `runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` | Created | Three outcomes: no match, unreachable, clean route |
| `changelog/v0.11.1.0.md` | Created | The skill's record of this fix and the preceding one, with its version bumped to match |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Consumers were searched before the marker changed; no test and no runtime caller asserted on it. The first attempt invented an error code, and the compiler refused it, which was the right answer rather than a reason to widen the type. The honest shape carries no code at all.

The test deserves its own note. A diagnostic message is the easiest kind of change to write a passing test for after the fact, because the test is written against what the code now does. So it was run against the old branch as well, where it fails, and then against the restored branch, where it passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Carry a reason instead of an error code | Nothing failed. Naming a failure class is what made a successful result read as an outage |
| Leave the `skipped` status alone | It is accurate, since no brief was injected either way, and callers branch on it today |
| Export the builder rather than add a daemon fixture | The builder is pure. This package already has one daemon-dependent suite that passes alone and fails in a full run |
| Run the test against the old branch before trusting it | A test written after a fix proves nothing until it has been seen to fail |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Inert prompt through the real hook | PASS — reports a no-match, no error code |
| Two routable prompts | PASS — route to `sk-git` and `sk-doc`, unchanged |
| Negative control against the old branch | PASS — the new test fails there, 1 of 3 |
| Restored branch | PASS — 3 of 3 |
| Hooks and parity suites | PASS — 148 tests |
| Full advisor suite | PASS — 868 passed, 0 failed, 7 skipped of 875 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The threshold is untouched.** Whether an inert prompt should route to something rather than nothing is a routing question, and this packet only fixes how the outcome is described.
2. **`skipped` still covers two reasons.** Splitting it into two statuses would be a wider contract change than this defect needs, and callers branch on it today.
<!-- /ANCHOR:limitations -->

---
