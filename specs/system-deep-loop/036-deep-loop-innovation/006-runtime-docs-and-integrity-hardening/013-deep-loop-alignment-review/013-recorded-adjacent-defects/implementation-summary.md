---
title: "Implementation Summary"
description: "Seven defects earlier phases recorded as another surface's problem, closed at their producers, so the packet's own decision that nothing is deferred holds."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/013-recorded-adjacent-defects"
    last_updated_at: "2026-09-16T06:55:32Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the recorded adjacent defects and filled the packet record"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-recorded-adjacent-defects"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 013-recorded-adjacent-defects |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The seven defects earlier phases recorded as belonging to another surface are closed. The runtime compiles again, because the executor config gained the field its own flag-support table had already declared and the runner had already been validating and forwarding. A comment promising a containment revert now describes the detect-record-quarantine the guard actually performs. The reducer names an unrecognised severity once per distinct value before dropping its findings, where it used to drop them in silence. The collapse rule reaches all six agent trees, so it reaches the rater who assigns the severity. A stress scenario checks all six trees in its sandbox instead of two and a duplicate. Every command reference resolves. And the push gate now asserts the commit being pushed carries the routing bytes the guard approved, which is the exact failure that published silently three times.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Directly rather than by dispatch, because each fix was small, the measurements were already taken, and several touched surfaces a delegate had been told to stay out of. Each defect was reproduced before being touched and re-measured with the command that exposed it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the severity silence in the normalizer, not its five callers | The drop is correct and the silence is the defect, so the seam they share is where it belongs |
| Do not restate the persona name grammar in the schema | The dispatcher validates it and builds the skill argument from the same rule; a second copy would drift from the first |
| Add a push check rather than change the existing one | The working-tree guard validates what the author can fix, which is right; what was missing is whether the commit matches it |
| Remove the dead diagram block rather than repoint it | A refactor merged those templates into a form library with no one-to-one successor, and nothing read the block |
| Do the work in a phase rather than as loose fixes | The packet's decision says nothing is deferred, so recording these was itself the deviation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck | exit 0, where it had been failing on an undeclared field |
| Persona on a kind that does not declare it | rejected at parse; accepted on the kind that does |
| Out-of-scale severity | named once, then dropped; the pre-change module was silent on the same input |
| Collapse rule across the trees | present in all six; mirror sync, both generator checks and the roster check all green |
| Command references | resolve across sixty-one asset files, where ten had been dangling |
| Push parity check | fires on the commit that broke routing, quiet on a clean one |
| Contract drift | regenerated after the agent edit; three commands OK |
| Full deep-loop suite | 154 files, 2680 passed, 8 skipped, exit 0 |
| An intermittent failure seen once | a concurrent-append test in the jsonl repair suite lost one record on one of five full runs; it passed three of three in isolation and on the re-run, and nothing in this change touches that code |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The push check compares bytes, not behaviour.** It asserts the pushed commit matches the tree the guard validated. A commit whose routing bytes match a tree the guard never validated still passes, which is why the guard itself stays first.
2. **One recorded defect needed no work.** A scenario said to reference a pruned benchmark sentinel no longer does; the phase that recorded it had already resolved it while choosing not to restore the superseded file.
3. **The diagram templates are gone rather than repointed.** The refactor that merged them into a form library left no one-to-one successor, so a mapping would have been invented. The dead declaration was removed and the library README remains the live index.
4. **One intermittent failure is recorded, not fixed.** A test that probes concurrent salvage-shaped appends lost a unique record on one full run out of five, passing three of three in isolation and on the immediate re-run. It may be a load-sensitive harness or a real race that surfaces rarely, and nothing here touches that code, so it is reported rather than guessed at.
<!-- /ANCHOR:limitations -->

---


