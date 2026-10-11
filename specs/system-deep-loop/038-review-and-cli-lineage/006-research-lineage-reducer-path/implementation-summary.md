---
title: "Implementation Summary"
description: "A fan-out research lineage now refreshes its own registry, dashboard and strategy, because the reducer takes an explicit artifact folder and both research workflows pass the lineage folder to it."
trigger_phrases:
  - "research lineage reducer path implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path"
    last_updated_at: "2026-10-09T14:01:32Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Reducer flag and workflow wiring shipped and verified"
    next_safe_action: "None for the path fix; the skipped-reducer case continues in 007-lineage-reducer-compliance"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-research-lineage-reducer-path"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-research-lineage-reducer-path |
| **Completed** | 2026-10-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fan-out research lineage now keeps its own registry, dashboard and strategy current. Before this change, each lineage's reducer refreshed the base research folder instead, so the lineage's projections stayed at their starting state and the fan-out merge read stale data.

### Phase 6: research-lineage-reducer-path

The deep-research reducer takes `--artifact-dir <path>`, the same flag the deep-review reducer already had. Both research workflows now bind `reducer_artifact_arg` to the lineage folder whenever a fan-out lineage is active and pass it on every per-iteration reducer call. Single-executor runs bind it to an empty string, so their behavior does not change. The synthesis calls that run on the merged base folder after fan-out stay as they were.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modified | Accept an explicit artifact folder through the CLI and `reduceResearchState` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modified | Prove outputs land in the given folder and not in the base folder |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Bind the argument and pass it on 2 per-iteration reducer calls |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modified | Bind the argument and pass it on 3 per-iteration reducer calls |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Regenerated | Source digests follow the YAML edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two sequential delegates, each a fresh Claude Haiku 5.5 agent at max effort with a one-change brief. A Sonnet prompt-improver scored both briefs first, 36/50 and 34/50, and its fixes went in before dispatch. The orchestrator read each diff and reran each check before sending the next brief. The fix was then run on real data: the stale lineage from the 2026-10-09 Ponytail research run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copy the deep-review `step_bind_reducer_artifact_arg` pattern exactly | Review already solved the same bug, so one mechanism serves both loops |
| Exit 1 when `--artifact-dir` has no value | The research reducer already uses exit 1 for usage errors; review uses 3 |
| Leave the four synthesis reducer calls unchanged | They run on the merged base folder after fan-out, where the base folder is correct |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reducer syntax, `node --check` | PASS, exit 0 |
| Missing flag value | PASS, exit 1 with `[deep-research] --artifact-dir requires a path value` |
| Reducer unit tests | PASS, 22/22 (21 before plus the new case) |
| Baseline set, 8 test files | PASS, 85/85 (84 before plus the new case), no regressions |
| Compiled contract against its sources | PASS, in sync after regeneration |
| Real stale lineage, `reduce-state.cjs <spec> --artifact-dir <lineage>` | PASS, exit 0, 10 iterations, 0 corruption; registry rewritten 15:27 to 16:19, dashboard created, base folder untouched |
| Live fan-out run, two cli-pi DeepSeek V4.1 Flash lineages, one iteration each (`research/lineages/`) | PASS, runner status ok 2/2, 0 containment advisories. `proof-b` ran the reducer: registry, dashboard and strategy written together in its lineage folder; no registry in the base `research/` folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A lineage can skip the reducer entirely.** In the live proof run, `proof-a` never ran the reducer and wrote a dashboard and registry by hand in a different shape. The path fix cannot help a lineage that does not call the reducer; that is tracked as its own phase, `../007-lineage-reducer-compliance/`. The proof run's evidence is kept in `research/lineages/`, without its containment snapshots and lock folders.
2. **The equals form is ignored.** `--artifact-dir=<path>` is dropped with other `--` tokens and the reducer falls back to the base folder. The workflows use the space form, so they are not affected.
3. **sk-code's drift check exits 1 before and after this change.** The cause is invalid JSON in `specs/hooks/022-smart-rule-injection/graph-metadata.json`, which was already modified before this work and is outside this phase.
<!-- /ANCHOR:limitations -->

---
