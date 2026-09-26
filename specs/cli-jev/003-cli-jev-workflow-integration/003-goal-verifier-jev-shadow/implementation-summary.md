---
title: "Implementation Summary: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode"
description: "Planned, not built: the phase documents are written, the operator's labeled set does not exist yet and no scorer, measurement or plugin change has been made."
trigger_phrases:
  - "goal verifier jev summary"
  - "jev shadow mode status"
  - "labeled set scorer status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow"
    last_updated_at: "2026-09-26T19:00:00Z"
    last_updated_by: "phase-author"
    recent_action: "Authored spec, plan, tasks and goal as a Planned build phase"
    next_safe_action: "Operator writes the labeled set (T001); the scorer can be built on a synthetic fixture first"
    blockers:
      - "The operator's labeled set of 30 to 50 rows does not exist yet"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can the provider and model be read per call from a choice answer's JSON?"
      - "Is the labeled set committed?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-goal-verifier-jev-shadow |
| **Completed** | Not started (Planned) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned: its documents are written and no code, fixture or measurement exists.

### Phase 3: goal-verifier-jev-shadow

The plan has two slices. First, an offline scorer gives the OpenCode goal verifier its first error rates on your labeled set, and a key-gated Jev arm is scored against them. Second, a shadow `jev` mode follows only if that arm clears the keep threshold. Without a Jev key, every path behaves as it does today.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Written | The requirements and proof plan, the build approach, the ordered tasks, the phase goal and this status record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`create.sh --phase` scaffolded the folder on 2026-09-26. The documents were then written from research R2 and the proposed-phase entry in `../001-deep-research/research/research.md`. The plugin, core and test seams they cite were reopened against the worktree the same day.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The scorer drives the plugin's own `maybeVerifyGoal` through `__test` | The heuristic function is not exported, and this measures the real verifier with no plugin edit in slice 1 |
| The wrapper rule holds rows the heuristic stopped at its length or blocking check | Those checks run first, so every blocking-pattern match is held without copying a regex that neither module exports |
| The shadow gate is checked once per session | This is the operator's rule. A keyless session then shows one enablement line and nothing per verification |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests, measurement | Not run. Nothing is built |
| `validate.sh --strict` on this phase | Recorded by the authoring run, not claimed here |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocked on the labeled set.** Only the operator can write it. The scorer can be built and tested on a synthetic fixture before it exists.
2. **The heuristic's error rates and Jev's latency are UNKNOWN.** The scorer and 002's per-call record measure them.
<!-- /ANCHOR:limitations -->

---
