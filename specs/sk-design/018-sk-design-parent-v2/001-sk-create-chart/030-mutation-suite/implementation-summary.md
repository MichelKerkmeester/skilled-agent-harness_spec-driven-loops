---
title: "Implementation Summary"
description: "The corpus check now has a mutation suite of its own and a blocking gate in CI."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite"
    last_updated_at: "2026-09-09T20:01:11Z"
    last_updated_by: "claude-conductor"
    recent_action: "Turned the hand-run mutations into a suite and put the corpus check in CI"
    next_safe_action: "Extend coverage to the families this line of work never touched"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-030-mutation-suite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-mutation-suite |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The corpus check is the packet's contract: 3,435 lines, forty-two families, about 7,300 assertions
over every shipped form. It had no tests of its own, and nothing in CI ran it. Two reviews of the
work built on it found twenty-one assertions that passed for a reason other than the one their
message gave. Each was fixed by hand and re-proved by hand, in a scratch file.

### The suite

Thirty-seven cases, each breaking exactly one thing and expecting one named family to say one
specific thing about it. Cases patch a shipped file and read it back through the real checker as an
extra, so the corpus itself is never touched and a crashed run cannot leave the packet dirty. The
handful that read the palette or the carried reference copy the package instead.

The harness refuses a case that would prove nothing: a patch whose anchor is missing, a base that
already fails the family it is about to be mutated for, or a failure from a family other than the
one named. That is not decoration — it caught three cases on the way in.

### The gate

`check-corpus.cjs` and the suite run on any change under the packet. The corpus step gates on the
affirmative `RESULT: PASSED` marker rather than on an exit code, because a run that refuses to start
also exits zero. It blocks, unlike the repository's advisory job, because the packet is green with
no backlog behind it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/tests/corpus-mutations.test.cjs` | Created | The harness and thirty-seven cases |
| `.github/workflows/chart-corpus.yml` | Created | The blocking gate |
| `scripts/check-corpus.cjs` | Modified | One assertion the suite found too weak |
| `scripts/tests/apply-design-md.test.cjs` | Modified | The browser case skips out loud |
| `changelog/v1.14.0.0.md`, `SKILL.md`, `README.md` | Created / Modified | Version 1.14.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cases were added in tranches so a bad anchor surfaced immediately rather than at the end. Three
aborted on the way in, and each was a real defect in the case rather than in the checker: two
anchors that did not exist, and one mutation that removed a sentinel comment when the rule it was
aimed at reads the declaration underneath.

The suite was then checked against the fixes it exists to guard, by reverting three of them in turn.
Two produced failing cases. The third produced none, which meant that fix had no coverage at all —
so the case that isolates it was written: the only form with a single key site, where counting the
helper's own declaration as a call is the difference between firing and staying silent.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Patches against the real checker, not fixture files | A fixture is a copy that goes stale the moment a form changes. A patch fails loudly when its anchor moves, which is the behaviour worth having. |
| The harness aborts rather than passing when a case is unsound | A case that asserts nothing is the exact defect this file exists to catch, and it would be indistinguishable from a case that works. |
| The gate reads for the marker, not the exit code | A stale build refuses to run, prints nothing, and exits zero. Requiring the affirmative line is the only way that failure is visible. |
| It blocks rather than reporting | The repository keeps an advisory job for checks with a known backlog. This packet is green, so a red run here means something broke today and is worth stopping for. |
| The browser case skips out loud | A silent skip and a pass read identically in a log, and only one of them means the code ran. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test scripts/tests/` | PASS. 47 tests, 0 failures, 0 skipped locally. |
| Reverting three repaired assertions | PASS. Three failing cases each time; the third only after its missing case was written. |
| Harness refusal | PASS. Three unsound cases aborted on the way in. |
| The workflow's steps, run as written | PASS. Both steps green; the marker gate refuses output carrying no verdict. |
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0`. |
| Render gate and captures | PASS. 40 rendered, 0 failed, 0 stale. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Coverage follows the work, not the corpus.** The thirty-seven cases cover the families this line of work repaired or added. The other families are covered only where a case happened to reach them, and there is no check that a new family arrives with a case. That is the obvious next step and is deliberately not claimed here.
2. **The render gate is not in CI.** It drives an installed browser. The one test that needs one says it is skipping rather than passing quietly.
<!-- /ANCHOR:limitations -->

---


