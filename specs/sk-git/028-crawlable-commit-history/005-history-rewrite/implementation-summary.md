---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
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
    recent_action: "Built build-commit-plan.py and its unittest coverage"
    next_safe_action: "Build the remaining phase 5 scripts, then judge the 100-row sample"
    blockers: []
    key_files:
      - "scripts/build-commit-plan.py"
      - "scripts/tests/test_build_commit_plan.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-history-rewrite"
      parent_session_id: null
    completion_pct: 20
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

The retrofit now has its frozen plan. One pinned tip yields exactly one
seven-digit ordinal per commit plus a packet where the cascade finds one, so
`git filter-repo` can stamp messages from a file instead of recomputing a
mapping inside the rewrite callback and racing the moving branch.

### Phase 5: history-rewrite

`build-commit-plan.py` walks `skilled/v4.0.0.0` in reverse topological order
and resolves each commit to a packet with a four-rule cascade: a `Refs:` or
`Spec:` body line to an existing packet, a numeric scope with one matching
touched packet, a unique touched packet under a scope consistent with its
track, or the dominant touched packet by changed-file count. It reads subject,
body and changed paths in one `git log` pass, excludes rolling and generated
spec files from the touch signal, and emits one JSON object per line with the
deciding rule and the candidate packets. A run is byte-reproducible from the
tip alone, which is what lets the plan be frozen before the rewrite.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/build-commit-plan.py` | Created | Old SHA to ordinal and packet plan, with the deciding rule and candidates |
| `scripts/tests/test_build_commit_plan.py` | Created | One shaped commit per cascade rule plus determinism, ordinal and merge checks |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`python3 -m py_compile` and `python3 -m unittest` were run against both files.
The unit suite builds a throwaway repository whose commits exercise each
cascade rule and asserts the assigned packet, consecutive ordinals from
`0000001`, and byte-identical plan and sample output across two runs. A real
run over the pinned tip `abce4946679f3601da4fbaecfa37408cc49a55c7` wrote 9,121
rows and reproduced byte-identically on a second run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Existence is checked against the pinned tip's tree | Reproducibility: the plan must be derivable from the SHA, not from whichever worktree happens to be checked out |
| The packet is the deepest numbered directory on a changed path | Phases nest, and the `Spec:` trailer is meant to carry the full nested packet path |
| Excluded files never contribute to the touch count | Rolling `goal.md` and generated metadata brush many unrelated commits and would mislabel them |
| File-count ties break by depth then lexicographic order | Keeps the dominant-packet choice deterministic so a rerun cannot shift a mapping |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m py_compile` (both files) | PASS, exit 0 |
| `python3 -m unittest .../test_build_commit_plan.py` | PASS, 8 tests, OK |
| Real run over the pinned tip | PASS, 9,121 rows, summary `refs 124 / scope-dir 353 / unique-touch 724 / dominant-touch 2456 / none 5464 / ties 0` |
| Real-repo determinism | PASS, two runs byte-identical (`plan.jsonl`, `plan.jsonl.sample.jsonl`) |
| `--sample 100 --seed 28` | PASS, 100 rows, each carrying subject and changed paths |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `Refs:`/`Spec:` rule requires the packet to exist at the tip.** Two of
every three trailer paths on this tip name packets that were renamed, archived
or introduced on another branch, so those commits fall through to the touch
signals. If the operator wants a dangling trailer path preserved instead, the
existence check is the single line to relax.
<!-- /ANCHOR:limitations -->

---


