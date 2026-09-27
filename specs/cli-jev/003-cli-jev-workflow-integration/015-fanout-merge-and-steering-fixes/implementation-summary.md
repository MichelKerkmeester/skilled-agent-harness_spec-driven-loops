---
title: "Implementation Summary: Fan-out Merge Under-count and Per-Iteration Steering"
description: "Planned. Nothing is built yet. The phase will fix the fan-out merge so a short lineage registry is rebuilt from the lineage's own evidence, and point each CLI lineage iteration at its steer.md."
trigger_phrases:
  - "implementation summary"
  - "fanout merge fix status"
  - "steering line status"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned phase documents"
    next_safe_action: "Run the diagnosis replay (T003 and T004) and record its table here"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Fan-out Merge Under-count and Per-Iteration Steering

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-fanout-merge-and-steering-fixes |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no code, test or owner file has changed.

### Fan-out Merge Under-count and Per-Iteration Steering

When built, the merge will stop reporting fewer findings than your research lineages recorded. A lineage that wrote a short summary registry will be rebuilt from its own iteration files, graph events and delta records, and any finding it cannot rebuild will show up as a counted gap. Each CLI lineage will also be told to read its `steer.md` before every iteration, so a lead's review reaches the next iteration.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None | None | Nothing is built. `spec.md` section 3 lists the files the build will change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The plan is diagnosis first, then the merge fix with regression tests, then the prompt line, then a replay over temp copies of the three rounds' lineages. `plan.md` section 4 names each step's check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read delta `finding` records instead of widening the markdown parser | A read-only count on 2026-09-27 found delta records whose per-iteration count matches the state log for most count-only findings in all three rounds, while the markdown shapes vary by lineage |
| Rebuild per iteration and count the rest as a gap | Today one unmatched iteration throws, the lineage falls back to its short registry and the gap reads 0 |
| Keep the registry when it holds more findings than the rebuild | Replacing 9 hand-written findings with 0 rebuilt ones would lose findings, as round 3 grok would |
| Steer CLI lineages through `buildLoopPrompt` only | A CLI lineage runs every iteration in one subprocess from that one prompt. Native lineages use a different input and are left for a separate design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Diagnosis replay (T003) | Not run by the build yet. The authoring leaf ran `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs --loop-type research --artifact-dir <temp copy>` once per round on 2026-09-27. It exited 0 each time, and the merged registries held `sourceFindings` 85, 74 and 65 with `reconstructionGaps` 0 |
| Merge and prompt tests | Not run. Nothing is built |
| Post-fix replay (T013) | Not run. Nothing is built |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Steering reach stays unmeasured.** The parent goal allows no model call in this phase, so no live fan-out run checks that iterations read `steer.md`. The next real research run's iteration sources show it.
2. **Some findings cannot be rebuilt.** Where a lineage's `findingsCount` matches none of its own evidence, as in round 3 grok, the merge can only count the gap.
<!-- /ANCHOR:limitations -->

---
