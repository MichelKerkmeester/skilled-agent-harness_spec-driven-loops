---
title: "Implementation Summary: Phase 13: root-cause-and-ux-research"
description: "A ten-iteration deep-research run found that most of the epic's errors come from hand-synced copies with no reader that fails when they part, and that the default compiled-route rebuild fails on main."
trigger_phrases:
  - "root cause and ux research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research"
    last_updated_at: "2026-10-10T19:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Wrote the checked synthesis and ranked phases"
    next_safe_action: "Operator reviews the ranked phases and picks which to build"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t2-root-cause-ux-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 13: root-cause-and-ux-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-root-cause-and-ux-research |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a checked list of why the epic kept breaking and what to fix first for people who adopt this framework. Most errors trace to one shape: two copies of one fact, kept in step by hand, with no check that fails when they part.

### Phase 13: root-cause-and-ux-research

The research found one failure nobody had recorded. The default compiled-route rebuild fails on main, because the authored cli-classifier harness under `specs/sk-doc/z_archive/` still names a removed mode. The epic's check read only the served copy, so it passed. The same line causes 15 of the 16 manifest test failures. The synthesis ranks nine single-file fixes by what an external user would hit first.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Checked synthesis, rejected ideas and ranked phases |
| `research/lineages/dsflash-llmgw/` | Created | The lineage's iterations, state and own report |
| `research/deep-research-config.json`, `findings-registry.json`, `resource-map.md` | Created | Run config and merged outputs |
| `../spec.md` | Modified | One phase-map row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The /deep:research auto workflow spawned one cli-pi lineage through its fan-out step, DeepSeek V4.1 Flash at max effort on the llmgateway route, ten iterations in 30 minutes. The orchestrator then merged the registry, emitted the resource map, re-checked each load-bearing claim by reading the line or running the command, and corrected four lineage claims.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the fan-out step with one lineage | The brief points at the round-three lineage, which ran this way; Pi then runs the loop and the orchestrator owns synthesis |
| Rank the stale harness line first | It breaks a documented command for every adopter, and the fix is one deleted line |
| Defer the surface hint | The advisor handler has no session-surface value to pass, so the change is larger than the lineage claimed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineage iterations | `grep -c '"type":"iteration"'` on the lineage state log printed 10 |
| Run summary | `succeeded: 1`, `completed_with_containment_advisory: 0` |
| Compiled-route check | `compiled-route-sync.cjs --check` exit 1, `--verify` exit 0 |
| Manifest tests | `tests 42`, `pass 26`, `fail 16`; TAP attribution put 15 on the closure error |
| SOURCE tags | Every tag in `research/research.md` resolves |
| Strict validation | See the goal log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 1's full effect is inferred.** In a scratch copy the closure error cleared, but the move-simulation then failed for every hub, which may come from the copy's location. Running the manifest test after phase 1 settles it.
2. **Three incidents stay UNKNOWN.** The validator run that parsed link-shaped task text, the wildcard deletion and the scratch commit have no recorded run output.
3. **The synthesis close-out event was not appended.** `synthesis-closeout.cjs` produced a `synthesis_complete` event scoped to the lineage run, which the lineage had already recorded, and the fan-out root has no run of its own to append to.
<!-- /ANCHOR:limitations -->

---
