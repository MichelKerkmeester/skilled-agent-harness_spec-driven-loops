---
title: "Implementation Summary"
description: "The tracked footprint under specs/ is measured per folder kind and three Proposed options wait for the operator; nothing was deleted, moved or untracked."
trigger_phrases:
  - "specs artifact tracking decision implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision"
    last_updated_at: "2026-11-12T11:44:50Z"
    last_updated_by: "code-worker"
    recent_action: "Measured the tracked footprint and wrote the three-option decision record"
    next_safe_action: "The operator chooses an option; until then all three stay Proposed and no file moves"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/scratch/artifact-inventory.md"
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/decision-record.md"
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/tasks.md"
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "code-017-specs-artifact-tracking-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which tracking option the operator chooses; all three stay Proposed"
      - "Under option B, whether existing tracked loop state is untracked or only new writes ignored"
      - "Under option C, where the archives move to"
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
| **Spec Folder** | 017-specs-artifact-tracking-decision |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The tracked footprint of the loop-state folders under `specs/` now has a measured table, and the tracking policy now has three written options instead of an unexamined default. Nothing was deleted, moved or untracked, because the choice belongs to the operator.

### Phase 17: specs-artifact-tracking-decision

`scratch/artifact-inventory.md` records files and bytes for the whole tracked tree, for `specs/` and for each of the four loop-state folder kinds, plus the union across those four. The union is the figure to quote for checkout size, because the four patterns nest and their rows overlap. The file also carries the branch, the commit and the date, and the script that produced the table, so a later reader can rerun it rather than trust a copied number.

`decision-record.md` lists three options: keep everything tracked, stop tracking new loop state, and move archives out of the repository. Each carries `Status: Proposed`, says what it changes, what it costs and what it leaves open. The record names the operator as decider and points at the inventory instead of repeating its figures.

The measurement was taken at `8b10b60540`, two commits after the commit named in `spec.md`. File counts are unchanged from that earlier figure. Byte totals are 146121 larger in both the repository row and the `specs/` row, and the four category rows and the union row are unchanged, so the growth sits under `specs/` outside the four loop-state folders.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/scratch/artifact-inventory.md` | Created | Seven measured rows with files and bytes, the overlap note and the command |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/decision-record.md` | Created | Three Proposed options, the no-action clause and the operator as decider |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/tasks.md` | Modified | Task state only |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/graph-metadata.json` | Modified | Re-derived by the validator's repair tool so the source fingerprint and synopsis match the current docs |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision/implementation-summary.md` | Modified | This summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The measurement ran first, from the repository root, and its output became the table. The header took the branch, the commit and the date from the same run. The command block holds the script verbatim so the table can be reproduced.

The two documents were then written against the task checks. Each check ran after its task, and the packet was validated last with `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh ... --strict --quiet`. No tracked file in the packet changed while the measurement and the document checks ran: `git diff --name-only` printed nothing before the task boxes were ticked.

No task was skipped. None of the eleven tasks pushes a branch or opens a pull request, so the whole list was buildable here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recorded the current commit rather than copying the earlier figure | The table must be reproducible, and a reader who reruns the script needs to know which tree the numbers describe |
| Kept the per-category rows as bare folder names with a separate path-pattern column | The four names stay greppable and the exact glob stays visible beside the number it produced |
| Published the union row and the overlap note beside the per-category rows | The four patterns nest, so a reader who adds the rows gets a larger total than the tree holds |
| Left every option `Proposed` and implemented none | The operator owns the tracking policy, and untracking files changes what every job checks out |
| Split option B into two variants in its cost | Ignoring new writes and untracking existing files produce different checkouts, and the record states that choice must be settled first |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 `rg -c '^\- \*\*(Branch\|HEAD\|Measured)\*\*:' .../scratch/artifact-inventory.md` | `3` |
| T002 `rg -c 'cat-file --batch-check' .../scratch/artifact-inventory.md` | `4` |
| T003 `rg -c '^\| (all tracked files\|specs/\|research\|review\|scratch\|z_archive) \|' .../scratch/artifact-inventory.md` | `6` |
| T004 `rg -c '^\| union \|'` and `rg -c '^\*\*Overlap\*\*:'` | `1` and `1` |
| T005 `rg -c '^### Option'` and `rg -c '\*\*Status\*\*: Proposed'` on `decision-record.md` | `3` and `3` |
| T006 `rg -c 'Delete, move and untrack nothing'`, `rg -c 'stops catching no regression'`, `rg -c '\*\*Decider\*\*.*operator'` | `1`, `1` and `1` |
| T007 `rg -c 'scratch/artifact-inventory.md'` and `rg -c '1665212310'` on `decision-record.md` | `2` and `0` |
| T008 `git ls-files \| wc -l` at `8b10b60540` | `134068`, matching the spec's count; a fresh run of the script reproduced all seven rows, which compared identical to the file's rows |
| T009 `rg -c '\*\*Status\*\*: (Accepted\|Rejected)' .../decision-record.md` | `0`, no match |
| T010 `git diff --name-only -- <packet>` | Printed nothing, run before the task boxes were ticked |
| T011 `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict --quiet` | `RESULT: PASSED (errors=0 warnings=1)`, exit 0. The one warning is the advisory that a decision record is present at Level 1 |
| `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <packet> --apply` | `repaired=1 failed=0`, which re-derived `graph-metadata.json` after strict validation reported a stale source fingerprint and a drifted synopsis |
| Final state `git status --short` | Five paths in this packet: the two new documents are untracked, and `tasks.md`, `implementation-summary.md` and `graph-metadata.json` are modified. Every one is inside the packet. The other 40 entries in the worktree belong to sibling packets and workflows, and this build wrote none of them |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The numbers age with the tree.** Every packet that writes under `specs/` changes them. The header names the commit and the date, and the command is in the file, so rerun it rather than quoting the table for a different tree.
2. **The byte counts are index blob sizes.** They measure what a clone transfers, not what a checkout costs after packing or compression, and they say nothing about how long a checkout takes.
3. **No runner collection was executed to prove the absence.** That no test runner collects the loop-state folders rests on phase 007's finding. This build searched the repository's vitest configs for a `specs/` include and found none, but it did not run a collection to prove the absence.
4. **The operator's choice is open.** All three options are `Proposed` and this phase implements none of them, so the tracking policy is unchanged.
5. **Strict validation reports one advisory warning.** The packet declares Level 1 and a decision record is present, which the validator treats as a hint toward Level 3. Raising the level would add required documents without changing the outcome, so the warning stays.
<!-- /ANCHOR:limitations -->

---
