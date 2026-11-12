---
title: "Implementation Summary: Phase 8: embedder-setup-and-cost"
description: "Planned, not built. The phase will make the embedder that meaning matching needs visible, guided and measured for a user who installs Skilled into their own repository."
trigger_phrases:
  - "embedder setup and cost implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost"
    last_updated_at: "2026-11-12T20:22:20Z"
    last_updated_by: "template-author"
    recent_action: "Planned the phase, no build started"
    next_safe_action: "Build after phases 005 to 007, in the waves tasks.md lists"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-embedder-setup-and-cost"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 8: embedder-setup-and-cost

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-embedder-setup-and-cost |
| **Completed** | Not completed. Planned on 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and no code has changed. When it is built, a user who installs Skilled into their own repository will see whether meaning matching is on, set it up through `/doctor:skill-advisor embedder` and read its measured cost in the install guides.

### Phase 8: embedder-setup-and-cost

The plan is in `spec.md`, `plan.md` and `tasks.md`. The operator answered the four planning questions on 2026-11-12, and `spec.md` section 10 records each answer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/measured-2026-11-12.txt` | Created | The planning measurements that `spec.md` quotes |
| `scratch/embed-probe.mjs`, `scratch/cli-timing.cjs` | Created | The two read-only probes behind those measurements |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning run read the code by symbol, called the running Ollama read-only and ran the default and real-embedding captures, the scorer floor and the policy rollup. It started, stopped and installed nothing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The embedder setup is a normal `/doctor:install` step behind a yes | Operator answer of 2026-11-12, "Set up by default, behind a yes" |
| After a yes the route pulls the model and starts the server, never installs Ollama | Operator answer of 2026-11-12, "Pull and start, never install (Recommended)" |
| The off state shows in `/doctor:setup`, status and a JSON warning | Operator answer of 2026-11-12, "Doctor, status and JSON warning (Recommended)" |
| The prompt embedding deadline is 750 ms | Operator answer of 2026-11-12, "750 ms (Recommended)" |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning measurements | `scratch/measured-2026-11-12.txt`, quoted in `spec.md` Measured Behavior |
| Build verification | Not run. Tasks T037 to T044 hold it |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cold and idle numbers are not yet measured here.** They need the model unloaded, which the planning run did not cause. The operator's first reading stands in until T033 runs the committed script after the 5 minute unload.
<!-- /ANCHOR:limitations -->

---
