---
title: "Implementation Summary"
description: "Planned, not started. Nothing in the deep-loop writer lock has changed. The packet will reproduce the lost-record failure of run 40107240026 first and fix the lock only if the reproduction confirms the inferred cause."
trigger_phrases:
  - "writer lock stale reclaim race implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/041-writer-lock-stale-reclaim-race"
    last_updated_at: "2026-10-25T07:30:00Z"
    last_updated_by: "claude"
    recent_action: "Opened the packet and wrote its plan. No lock change has been made"
    next_safe_action: "Run tasks T001 to T005: save the baselines and reproduce before any lock change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-writer-lock-stale-reclaim-race"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 041-writer-lock-stale-reclaim-race |
| **Completed** | Not completed. The packet was opened on 2026-10-25 |
| **Level** | 2 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This packet is a plan to find out why `jsonl-repair.vitest.ts` lost a record on main (run 40107240026, expected 9, got 8) and, if the suspected cause holds, to fix the shared writer lock so two writers can never hold it at once. The suspected cause is INFERRED and has not been reproduced.

### Fix the stale-lock reclaim race in the shared deep-loop writer lock

The packet reproduces the failure on the unchanged code first, with a deterministic test of the suspected interleaving and a 200-round loop of the CI case. Only a failing reproduction allows a change to `cli-guards.cjs`. If the reproduction confirms the cause, the reclaim path will remove only the lock file it judged stale. If it refutes the cause, the lock stays as it is and the operator decides what to look at next.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/system-deep-loop/041-writer-lock-stale-reclaim-race/` | Created | This packet's docs. No code file has changed |
| `specs/system-deep-loop/graph-metadata.json` | Modified | The packet scaffold script added this packet to the track's list of children |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

It has not been delivered. The only work so far is opening the packet. A read-only investigation (`specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`) read the lock code and named the suspected cause, and this packet re-checked the CI facts and the cited lines before writing the plan. The order of delivery is in `tasks.md`: save the baselines, reproduce, decide the cause status, fix, then verify against the baselines.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Open this as its own packet | The operator ruled that the lock fix is a separate change from the CI efficiency program |
| Level 2 | The level script returned Level 1 for about 250 lines and Level 0 for fewer. The level matrix puts 100 to 499 lines at Level 2 and counts a multi-process reproduction as a testing need, so Level 2 won. It also gives the packet an `acceptance-criteria.md` |
| Reproduce before any lock change | The cause is inferred. Without a failing reproduction there is no way to show a fix works, so `REQ-001` gates `REQ-002` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The two lock files on the unchanged code, `npx vitest run --no-coverage tests/unit/cli-guards-writer-lock.vitest.ts tests/unit/jsonl-repair.vitest.ts` | 2 files and 18 tests passed on 2026-10-25. This is a baseline read, not a result of the fix |
| Any test of the fix | None. Nothing is built |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cause is inferred.** The ENOENT branch followed by the unconditional removal is the suspect, and no run has confirmed it. Task T005 decides.
2. **The fix branch is not chosen.** The operator names it before the first lock change.
3. **A narrow window may remain.** The candidate shape that compares before it removes narrows the stale-body window and does not close it. `plan.md` section 3 names what is left for each candidate.
<!-- /ANCHOR:limitations -->

---
