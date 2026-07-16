---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Scaffold only. This phase plans a report-only freshness decay queue over the shipped FSRS retrievability number and is not yet built."
trigger_phrases:
  - "freshness decay queue"
  - "fsrs retrievability"
  - "auto-refresh queue"
  - "staleness maintenance queue"
  - "report-only freshness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/004-novel-research/006-novel-freshness-decay-queue"
    last_updated_at: "2026-07-06T18:49:47.475Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded planned phase docs for the queue"
    next_safe_action: "Build the freshness decay detector after the engine lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-novel-freshness-decay-queue |
| **Status** | PLANNED, scaffold only, not yet implemented |
| **Completed** | Not yet, PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built in this phase yet. The folder is a PLANNED scaffold and the section below describes the intended build, not shipped work. No code, table or registry entry exists yet.

### Freshness Decay Auto-Refresh Queue (planned)

The plan adds one report-only detector at `freshness-decay.ts` that reads the SHIPPED per-memory `retrievability` from `computeMemoryState` (`tier-classifier.ts:325-328`) and owns no decay math. Any memory below the configured COLD to DORMANT staleness threshold (`tier-classifier.ts:39-41`) will emit one row into a new report-only `refresh-queue.ts` table mirrored on the `learned_feedback_audit` governance in `learned-feedback.ts`. The detector will register with `fixClass: none` so it can never apply a body edit, and the rows will surface through the B1 sweep report behind a default-off flag.

### Files Changed

No files changed yet. The table below lists the intended targets for the build phase.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/detectors/freshness-decay.ts` | Planned create | Read the shipped retrievability and emit report-only queue rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/refresh-queue.ts` | Planned create | The `refresh_queue` table and accessor mirrored on `learned_feedback_audit` |
| `.opencode/skills/system-spec-kit/scripts/detectors/detector-registry.ts` | Planned modify | Register `freshness.decay` with `fixClass: none` behind a default-off flag |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. This phase is PLANNED and blocked on 026-shared-safe-fix-engine and 011-scheduled-dq-sweep. The build will ship the detector behind a default-off flag, prove the report-only contract on a decayed-fixture corpus and leave the shipped FSRS retrievability math untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the shipped retrievability, own no decay math | The FSRS number is already computed live in `computeMemoryState`, so the queue wires atop it rather than forking a second formula |
| Register the detector with `fixClass: none` | Holds the no-body-refresh rail mechanically, the frozen safe allow-list never contains it so no apply path exists |
| Mirror the `learned_feedback_audit` governance | Reuses the proven age eligibility and TTL shape from `learned-feedback.ts` rather than inventing a new queue lifecycle |
| Default-off behind a flag | Keeps the legacy corpus from gaining a new always-on signal, matching the B3 feedback-edge precedent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run yet. The rows below are the planned gates for the build phase.

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder | Doc structure PASS, feature not yet built |
| `vitest` detector and queue tests | Not yet written, PLANNED |
| Apply run over a decayed fixture leaves the git working tree clean | Not yet run, PLANNED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This phase is a PLANNED scaffold. The detector, the `refresh_queue` table and the registry entry do not exist yet.
2. **Blocked on upstream phases.** The build cannot start until 026-shared-safe-fix-engine lands the registry and 011-scheduled-dq-sweep lands the report-mode fan-out.
3. **Report-only by contract.** Even once built, the detector will never auto-refresh, re-embed or rewrite a memory body. A human refreshes the body, the detector only queues the candidate.
<!-- /ANCHOR:limitations -->
