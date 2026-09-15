---
title: "Implementation Summary"
description: "Both DeepSeek V4.1 Flash tiers joined the two enforced Devin allowlists, the fan-out fixture now binds itself to the source array, and the permission-mode guidance names a silent failure it had not warned about."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/005-deepseek-v4-1-flash"
    last_updated_at: "2026-09-15T18:35:32Z"
    last_updated_by: "claude-conductor"
    recent_action: "Added both V4.1 tiers to the two allowlists, bound the fixture to the source, amended the permission-mode note"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-deepseek-v4-1-flash"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 5 of 5 |
| **Status** | Complete |
| **Completed** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Devin serves a DeepSeek V4.1 Flash family that this repository's two enforced allowlists did not
carry, so a fan-out naming either tier was refused before a request left the machine. A direct
`devin -p` call reached it, because a direct call does not consult the allowlist, which is why the
gap had not surfaced. Both tiers are now on both lists.

The lists are kept in step by hand, so the fan-out fixture that walks them was the real exposure.
It restated the roster as a literal, which meant a new id could land on the source array and never
be exercised. The fixture now asserts its own list equals `DEVIN_SUPPORTED_MODELS`, so the two
cannot drift apart without the suite failing.

The same run exposed a second defect in the skill's own guidance. It tells a caller to use `auto`
for read-only research. Under `auto` the dispatch refused its own shell call, reported almost
nothing and exited zero, which is the silent-failure shape the skill warns about one paragraph
earlier for a different mode. The note now names what `auto` refuses and what it costs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `executor-config.ts` | Modified | Both tiers on the source array, sorted, with verification comments |
| `fanout-run.cjs` | Modified | The mirrored Set, kept byte-identical |
| `fanout-run.vitest.ts` | Modified | The fixture walks the whole roster and asserts parity with the source |
| `cli-devin/SKILL.md` | Modified | The permission-mode note names the observed failure |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gap was found by use rather than by audit. The operator asked for a crawl on DeepSeek V4.1
Flash Max through `cli-devin`, and checking the id against the live CLI before dispatching showed a
family the repository's roster did not carry.

Two things went wrong on the way and both are recorded because they cost time. A concurrent session
edited the same arrays mid-edit, so the two inserts duplicated each other and left four repeated
entries. Both lists were deduplicated and re-sorted, then compared element by element. Separately, a
first suite run reported two Devin default-model failures that a rerun against the settled state
did not reproduce. The cause was the same concurrent session writing during a 195-second run, not a
source defect, and the rerun is the evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The default model does not move | V4.1 prices higher on output than V4 Flash, so it is a deliberate pick rather than a drop-in default, and the default belongs to the lane that owns it |
| The max tier claims a dispatch test, the high tier does not | Only the max tier returned a live model response here. The precedent in this file is to say which is which rather than to imply both |
| The fixture derives its expectation instead of restating it | A hand-listed fixture is one more copy to keep in step, and it was already one behind |
| The roster table and the GLM-5.3 rows are not claimed here | Another session landed them while this ran. Claiming them would misreport who did what |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three guard suites together, from the final state | 3 files, 258 tests, all passing |
| Both lists compared element by element | 20 ids each, identical, sorted, no duplicate |
| A first run reporting two failures | Not reproducible on rerun. Traced to concurrent writes during the run, not to source |
| `validate.sh --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The high tier is list-verified only.** It appears verbatim in live `devin models list` output
   and no dispatch test was run against it, which the source comment states rather than glosses.
2. **The two lists are still kept in step by hand.** This phase tightened the test that catches
   drift rather than removing the duplication. Generating one from the other is a larger change
   than a roster addition should carry.
<!-- /ANCHOR:limitations -->

---


