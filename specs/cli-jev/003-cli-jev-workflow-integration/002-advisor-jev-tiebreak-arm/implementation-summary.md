---
title: "Implementation Summary: Offline Advisor Jev Tie-Break Arm (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one read-only script that measures a Jev choice against the advisor's near-tie order, and no result exists."
trigger_phrases:
  - "advisor jev tie-break summary"
  - "score-jev-tiebreak status"
  - "jev arm planned"
  - "jev tie-break results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm"
    last_updated_at: "2026-09-26T20:40:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the planning documents"
    next_safe_action: "Build the advisor dist, then write the zero-call census and baseline column"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How many held-out rows are movable"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Offline Advisor Jev Tie-Break Arm (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-advisor-jev-tiebreak-arm |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no code, report or measurement exists for it.

### Phase 2: advisor-jev-tiebreak-arm

The plan is one read-only script, `score-jev-tiebreak.mjs`, beside the advisor's routing-accuracy evals. By default it counts how many held-out rows have the gold skill inside the advisor's near-tie cluster but not first, and scores the scorer's own order, with zero Jev calls. Behind `--jev`, and only when `jev 0.6.2` is on PATH and `jev auth status` exits 0, it asks a Jev `choice` inside each cluster and scores both orders on the same rows. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Authored | Planning documents for this phase. No code file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written from recommendation R1 and proposed phase 002 in `../001-deep-research/research/research.md`, with the key gate from the parent goal's decision D5.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new script instead of extending `score-outcome-rerank.mjs` | That script promises a read-only eval of outcome weights and its flip rule decides that flag, so a network arm inside it would change what it means. A separate file deletes cleanly |
| The default run makes zero calls | The census can end the work at zero movable rows before anything is billed, and a keyless machine sees no new behavior |
| Every gate failure exits 0 with census and baseline intact | Dormant is the normal state without a key, so the report says which gate stopped the arm instead of failing the run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and measurement | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder at authoring time. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No numbers exist yet.** Movable rows, both columns, stability and per-call latency are all UNKNOWN until the census and one keyed run.
2. **The arm needs an operator step.** A Jev key must be set before `--jev` does anything. Without one the arm prints `jev arm skipped: no credential`.
<!-- /ANCHOR:limitations -->

---
