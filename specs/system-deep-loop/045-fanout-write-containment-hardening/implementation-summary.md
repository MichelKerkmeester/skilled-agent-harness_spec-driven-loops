---
title: "Implementation Summary"
description: "Planned stub. Nothing is built yet; this document records what shipped once the containment hardening phases land."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening"
    last_updated_at: "2026-09-08T18:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Left this document as a planned stub; no phase has run"
    next_safe_action: "Fill this document after Phase 1 lands, one section per shipped phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-045-fanout-write-containment-hardening"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 045-fanout-write-containment-hardening |
| **Status** | In Progress |
| **Completed** | Not completed |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The packet is planned and this document is the place its result will be recorded, one section per shipped phase.

### harden fan-out write containment for shared checkouts

When this ships, you will be able to run a multi-hour deep-loop fan-out on your main checkout and keep working in it. A lane that writes outside its own directory will leave your files exactly where you put them and drop a copy of what it wrote into a quarantine you can read, instead of rewinding your uncommitted work to the last commit. A lane that finished its research or its review will be reported as finished even when containment has something to say about it.

The phase that follows removes the question rather than answering it: each lineage gets its own worktree, so a write outside its directory really is that lineage's write and the main checkout is never touched at all.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Not yet changed | Planned | The scope table in `spec.md` lists the fifteen files this packet expects to touch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The plan sequences three implementation changes: the quarantine and baseline work with the outcome separation and the caller migration first, per-lineage worktrees second, concurrent-editor detection optionally third. Verification is the deep-loop runtime Vitest suite plus two manual runs on a real checkout, one with a second session editing and one against an uncommitted packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve and quarantine by default, restore opt-in | The guard cannot attribute a write on a shared checkout, and an unattributable finding must not be met with an irreversible remedy |
| Restore targets the pre-dispatch bytes, not HEAD | HEAD is where the last commit left the file, not where the operator left it; rolling back to HEAD discards work the lane never touched |
| Detached ephemeral worktrees outside the numbered namespace | The numbered allocator issues never-reused values for day-scale human workspaces; a fan-out creates hour-scale sandboxes at a rate that would make the namespace unreadable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop runtime Vitest suite | **GREEN.** 151 files passed, 2550 tests passed, 7 skipped, 0 failed, exit 0. Three stale cross-package paths in the suite had to be corrected first, all reaching into system-spec-kit and all predating this work: a tsx loader path that has never existed, a nested vitest borrowed from another skill's install rather than this package's own, and an optimizer manifest path left behind when the file moved |
| Containment unit suite | 54 passed |
| Fan-out and pool unit suites | 223 passed, 1 skipped across four files |
| End-to-end stress reproduction | 19 passed, 1 skipped. The out-of-scope file keeps the lane's bytes, git reports it modified, the ledger records `preserved_in_head`, and the lane settles `completed_with_containment_advisory` with exit 0 |
| Manual shared-checkout run | **PASSED** on the real main checkout with other sessions live. The lane detected 7 out-of-scope paths and preserved all 7: 3 tracked as `preserved_in_head` (a skill-advisor vitest config belonging to another session, plus two probe files edited mid-lane after the baseline snapshot) and 4 untracked as `preserved_untracked` (three files inside another packet's live research lineage, and a playbook run record). Probe file ended at blob 12da3741, 299 lines, neither the 298-line baseline nor HEAD's 284. The lane settled `fulfilled` with `output.status: completed_with_containment_advisory`; run summary `succeeded 1, failed 0, all_failed false, completed_with_containment_advisory 1` |
| Manual uncommitted-packet worktree run | Not run. The worktree phase is held pending two specification gaps recorded against the packet's third open question |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Preserve leaves a dirty tree** A run that trips containment no longer cleans up after itself. The finding is recorded at severity error and counted in the run summary, so it is reported rather than silent, but the operator is the one who decides what to do with it.
2. **Quarantine is bounded** A file over 2 MiB or a lane over 64 MiB stops storing content and keeps only hashes and patches. The truncation is recorded per path; recovery for those paths depends on the patch applying cleanly.
3. **Containment does not run when an earlier gate rejects the lane** Artefact validation and the stop-policy check now precede containment, so a lane that fails either produces no containment finding at all. This is the intended ordering, since a lane that did not do its work should be judged on that first, but it means an out-of-scope write by a failing lane goes unreported.
4. **One unreproduced lane rejection, recorded as an observation rather than a defect** A live forced-depth lane was rejected for `duplicate state records for iterations: 1,1,1,1,1`. A second lane under the same stop policy produced a clean log, exactly one iteration record, and settled fulfilled. The validator filters by record type and only counts iteration records, so events carrying an iteration number are not the cause. The first lane's artifacts were deleted during cleanup before the second run, so the original evidence no longer exists. Treat this as unexplained and unreproduced, not as a known leaf defect; if it recurs, keep the lineage directory.
5. **Baseline capture copies the whole dirty working set, not just what the lane touches** It cannot know in advance which paths a lane will write, so it captures every dirty path outside the lineage directory before dispatch. A measured live run on a busy shared checkout captured 893 files at 8.2 MB into one lineage directory, including in-progress files belonging to eight other packets. The per-file and per-lane bounds cap the size but not the scope, and the cost scales with how dirty the checkout is rather than with what the lane does.
6. **Worktree isolation depends on path rewriting** An executor that resolves a path relative to the original checkout could still write outside its worktree. The rewrite covers the prompt pack and the dispatch flags; anything an executor derives on its own is out of reach.
<!-- /ANCHOR:limitations -->

---
