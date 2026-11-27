---
title: "Implementation Summary"
description: "The five channel design documents pass every check that runs in the unit worktree, the contract freeze holds against the build's base commit and two reference-tree checks wait for the gitignored tinychannels tree."
trigger_phrases:
  - "adapter and record contracts implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts"
    last_updated_at: "2026-11-27T18:00:00Z"
    last_updated_by: "unit-orchestrator-011-002"
    recent_action: "Verified the five design documents and closed the acceptance rows"
    next_safe_action: "Provision the reference tree in the worktree, then run T002 and T011"
    blockers:
      - "T002 and T011 need specs/system-skilled-bots/context/, which is gitignored and absent from the unit worktree"
    key_files:
      - "design/capabilities.md"
      - "design/records.md"
      - "design/inbound-sequence.md"
      - "design/conformance-rules.md"
      - "design/operator-runbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-011-002-adapter-contracts"
      parent_session_id: null
    completion_pct: 90
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-adapter-and-record-contracts |
| **Completed** | 2026-11-27, with T002 and T011 blocked |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The build children of the messaging phase now have one design to follow for the adapter seam, the channel records, the acknowledge order, the conformance rules and the operator steps. Every check that can run in the unit worktree prints the count its task names, and no contract file has changed since this phase's base commit.

### Phase 2: adapter-and-record-contracts

The five documents in `design/` were written before the build started and committed before the unit worktree was cut. This build run confirmed them rather than rewriting them. You can build `channel.ts`, the index, the queue and the five transports from these documents without making a design choice of your own. The capability matrix gives eight keys and three facts per transport. The records document gives each record's lifecycle, the derived secret names and the backoff table. The inbound sequence gives the acknowledge order per transport. The conformance rules number R1 to R5 over 25 cases, and the runbook gives a preflight, a health and a rotation step per transport.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `goal.md` | Modified | Re-records the base commit at build start and logs the run and its three deviations |
| `tasks.md` | Modified | Marks the verified tasks, blocks T002, T011 and CHK-003 with the reason and fixes the summary totals |
| `acceptance-criteria.md` | Modified | Marks the nine rows Met with the observed output |
| `spec.md` | Modified | Moves the status from Draft to In Progress |
| `implementation-summary.md` | Modified | This summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The unit orchestrator ran T001 and T003 to T010 and every checklist command in the unit worktree and read each output and exit status. T009 first printed `contracts/decisions.md`. The build-plan commit `caeafe3a7f0` had changed it after the old base and before this phase started. Under the goal's re-record rule the base moved to `b04f9f9718e` and T009 then printed nothing. No worker was dispatched. Wave 0 is three reads and wave 1's five documents were already present and passing, so a rewrite would have added risk and no content. No runtime code changed, so the runtime gate was not run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify the committed documents instead of dispatching five writers | T004 to T008 already printed their counts against the committed files, so a rewrite could only move a count or let reference wording in |
| Move the base commit to the worktree's cut point | The goal says to re-record the base when the contracts change before the phase starts, and the only change came from the build-plan commit, not from this phase |
| Block T002 and T011 instead of reading the reference tree from another checkout | The orchestrator's brief bars reading the primary checkout, and T011 is the clean-room check, so it must run against the real tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 | PASS, 6 |
| T002 | BLOCKED, the `context/` tree is not in the worktree |
| T003 | PASS, no output and exit 1 |
| T004 | PASS, 11 and 14 |
| T005 | PASS, 9, 8 and 1 |
| T006 | PASS, 5 and 4 |
| T007 | PASS, 5, then `18 R1 R2` and `7 R3 R4 R5` |
| T008 | PASS, 12 and 12 |
| T009 | PASS, no output and exit 0 against base `b04f9f9718e` |
| T010 | PASS, 2 and one line |
| T011 | BLOCKED, the `context/` tree is not in the worktree |
| CHK-010, CHK-011, CHK-030 to CHK-032, CHK-040 to CHK-042, CHK-050, CHK-051 | PASS, each printed what it says |
| Acceptance rows | 9 Met, 0 Unmet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The line-copy check has not run.** T011 compares the design's lines against the GPL tinychannels sources, and no run of it is recorded. Put `specs/system-skilled-bots/context/tinychannels-main/` into the worktree, then run T002 and T011.
2. **T002's second path may be wrong.** It names `context/tinychannels-conformance/src/lib.rs`, while `plan.md` and `spec.md` name `context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs`. One of the two will fail even once the tree is present.
<!-- /ANCHOR:limitations -->
