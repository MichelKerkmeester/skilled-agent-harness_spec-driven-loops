---
title: "Implementation Summary"
description: "Five scripts turn the frozen plan into a rehearsed rewrite: 9,123 commits stamped on a mirror with six invariants passing, 109 tags following their commits, and 1,704 citations ready to remap. Only the operator's window remains."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/005-history-rewrite"
    last_updated_at: "2026-09-11T09:20:38Z"
    last_updated_by: "code-implementer"
    recent_action: "Pushed the rewritten history and the citation remap on the operator's yes"
    next_safe_action: "Owners rebase the 58 other branches onto the new base and stamp them with stamp-branch.sh"
    blockers: []
    key_files:
      - "scripts/rewrite-run.sh"
      - "scripts/build-commit-plan.py"
      - "scripts/remap-citations.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-history-rewrite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-history-rewrite |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rewrite is rehearsed, not imagined. A mirror of the live repository now carries all 9,123 commits with their planned trailers, every tree, author and date unchanged, 109 release tags following their commits, and not one old hash prefix left in a message. Twenty seconds per run.

### Phase 5: history-rewrite

You get five scripts and one runbook. The plan builder walks the pinned tip in topological order and gives every commit an ordinal, and a packet where the cascade finds one: 61 percent of history, with a hand-judged error rate of 3.6 percent. The runner clones a bare backup and a mirror, refuses a plan with gaps, stamps the trailers in a commit callback, remaps hash citations inside messages in a second pass, and proves six invariants before it prints anything about pushing. The remapper fixes citations under specs and the skills from the commit map, dry-run first, and refuses to finish with residue. The branch stamper gives the 58 other branches their ordinals once their owners rebase them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/build-commit-plan.py` | Created | Ordinals and packets from a pinned SHA, with the sample for hand review |
| `scripts/stamp-callback.py` | Created | Trailer formatting and hash remapping for the callbacks |
| `scripts/rewrite-run.sh` | Created | Clones, coverage, two passes, invariants, rehearse mode, on-line tag filter |
| `scripts/remap-citations.py` | Created | Prefix-exact citation remap with a residue check |
| `scripts/tests/*.py` | Created | 8, 12 and 4 cases, including a five-commit rehearsal |
| `.opencode/skills/sk-git/scripts/stamp-branch.sh` | Created | Ordinals for a rebased branch's unique commits, 24-case harness |
| `scratch/sample-judgment.md` | Created | The hand judgment of 100 plan rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four cli-pi dispatches on DeepSeek V4.1 Flash, one script each, serial after the operating system killed three that ran together. The conductor re-ran every suite, judged the plan sample by hand, and ran two full-scale rehearsals in the session scratchpad: the first found 31 ordinals git could not extract and a header the remapper refused, the second, with the fixes and the 109 on-line tags, passed every invariant. The plan builder's first cut refused 2,086 single-packet commits on a confirmation rule; the decision record was amended so that only a positive contradiction refuses, and the unmapped share fell from 60 to 38.6 percent.

The window ran on 2026-09-11. The first pin was overtaken by one commit and the operator said so; the rewrite was re-pinned on 6358770875, rehearsed again on 9,163 commits, and pushed on a fresh yes after a last fetch confirmed the pin held. Origin main became a1faf0914a and skilled/v4.0.0.0 became 6358770875, with 104 forced ref updates including 109 tags. The citation remap then landed as ordinal 0009164 on the rewritten line, stamped by the live hook, touching 1,714 files and 1,737 tokens with zero residue, and the executor hub's routing manifest was re-minted as 0009165 because three of those citations sat in its benchmark reports. The main checkout's working tree was never touched; its branch refs were moved to the rewritten commits and it follows the two later commits on its next fast-forward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Only the 109 tags on the rewritten lines are rewritten | The other 40 point at commits with no plan row; dragging them in would pull unrelated history through the callback |
| A subject-shaped final line such as `chore: ...` is prose | Treating it as a trailer buried the keys where git's parser does not look, 31 times in 9,123 |
| Refuse the single-touch rule only on a positive contradiction | The confirmation rule left 60 percent of history without a packet for no better reason than a shortened scope |
| The window is one script run plus hand-typed push lines | A script that pushes cannot wait for a yes; the runner prints the lines and stops |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| unittest suites for plan, callback and remap | 8, 13 and 4 cases, all OK |
| stamp-branch.test.sh | PASS=24 FAIL=0 |
| Full-scale rehearsal with 109 tags | INVARIANTS: PASS, 111,686 messages checked, tags 149 = 149, residue 0 |
| Plan determinism | two runs byte-identical |
| Citation remap dry run against the real map | 1,704 tokens recognized, 1,672 files would change, 10,092 decoys skipped |
| Hand judgment of the plan sample | 2 of 55 mapped rows wrong |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fifty-eight branches and 28 worktrees keep old ancestry.** Their owners rebase onto the new base and run stamp-branch.sh; dependabot's two branches need re-creating. The pre-rewrite backup stays in the session scratchpad until CI is green.
2. **Two ordinals still hide from git's parser.** Two legacy messages end in `config: ...`; the token was added to the prose list after the second rehearsal, so the next run covers them.
3. **The plan is stale the moment the branch moves.** Five sessions moved it today. The window rebuilds the plan from the pinned tip.
4. **Off-line branches keep old ancestry.** Fifty-eight branches and 28 worktrees reference the old commits until their owners rebase and stamp them, and the mirror keeps those objects alive meanwhile.
<!-- /ANCHOR:limitations -->

---
