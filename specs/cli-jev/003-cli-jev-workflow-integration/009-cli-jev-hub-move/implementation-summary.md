---
title: "Implementation Summary: Move cli-jev into the cli-classifier Hub (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one commit that moves the cli-jev hub under the proposed cli-classifier hub, guarded by a route replay baseline, and it waits on 008 and on a Deem arm result the operator keeps."
trigger_phrases:
  - "cli-jev hub move summary"
  - "cli-jev hub move status"
  - "cli-jev move planned"
  - "cli-jev replay results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move"
    last_updated_at: "2026-09-27T09:40:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the planning documents from the round-3 synthesis, section 14"
    next_safe_action: "Record the route replay baseline once 008 and question 49 clear"
    blockers:
      - "008-cli-classifier-hub is Planned"
      - "Research open question 49: no Deem arm result kept yet"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the move wait on a Deem result the operator keeps (research question 49)"
      - "Where do the hub's two changelog files land if 008 holds the same versions"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Move cli-jev into the cli-classifier Hub (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-cli-jev-hub-move |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no file has moved, no replay has run and no commit exists for it.

### Phase 9: cli-jev-hub-move

The plan moves the `cli-jev` hub under `cli-classifier` (proposed, phase 008) as mode `cli-jev` over its packet `cli-usage`, beside `cli-deem` (proposed, phase 008), the way system-deep-loop runs mode `research` over packet `deep-research`. A replay of the 7 canary cases and 3 hub-routing scenarios is recorded first. One commit then moves all 81 hub files with `git mv`, merges the hub-level files, registers the mode and updates the seven literal lists, the rollout package, the mirrors, the agents, the READMEs and the regenerated advisor graph and trigger index. If any replayed prompt routes differently afterward, the commit is reverted. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-27 from `../007-classifier-deep-research/research/research.md` section 14 (`### 009-cli-jev-hub-move (new)`) and R23 in section 12. Every literal list section 14 names was reopened at the worktree HEAD first, and the footprint was recounted: 81 hub files, 59 in `cli-usage`, and 48 files outside `specs/` that name `cli-jev`. The build waits on 008 and on the operator keeping a Deem arm result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The baseline replay runs before any file moves | After the move the old hub id no longer routes, so the only baseline is the one taken first |
| The whole hub moves with `git mv`, and hub-level files merge | A lineage's plan to move `cli-usage` alone and then `rm -rf` the hub deletes 22 files, among them the playbook, benchmark, changelog and shared folders (What Not To Build row 104) |
| One commit for the move and every list | One `git revert` then restores the hub, its files and every list together, which is what the kill criterion needs |
| The replay compares `action`, `selectionKind` and `packetId` | The hub and mode ids change by design and the policy hash changes with the merged registry. The routed packet and outcome must not change |
| Changelogs and dated benchmark reports stay as written | They record what happened at a path that no longer exists, and section 14 keeps changelogs unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, replay and hub check | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase may never run.** R23's keep rule retires `cli-deem` and cancels this move when no Deem arm prints a result the operator keeps.
2. **The disposition of colliding hub-level files is open.** Which of the 22 hub-level files merge depends on what 008 places in the `cli-classifier` root, so the table is written at build time.
3. **Counts can drift.** The 81 and 48 are from 2026-09-27. The build recounts them at its own HEAD.
<!-- /ANCHOR:limitations -->

---
