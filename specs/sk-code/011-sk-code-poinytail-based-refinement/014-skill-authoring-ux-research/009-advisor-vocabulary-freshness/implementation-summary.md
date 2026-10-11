---
title: "Implementation Summary"
description: "The router intent-signal check and the compiled skill graph are fresh again, and both now fail CI when they drift: the freshness panel gained a --strict mode that names the regenerate command."
trigger_phrases:
  - "advisor vocabulary freshness implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/009-advisor-vocabulary-freshness"
    last_updated_at: "2026-10-10T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-014-009-advisor-vocabulary-freshness"
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
| **Spec Folder** | 009-advisor-vocabulary-freshness |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The router intent-signal check and the compiled skill graph are fresh again, and both now fail CI when they drift: the freshness panel gained a --strict mode that names the regenerate command.

### Phase 9: advisor-vocabulary-freshness

`generate-router-intent-signals.cjs --write --hub cli-classifier` carried the 23 missing ROUTER.md intents into cli-classifier's graph-metadata.json, so the all-hub check moves from RESULT: FAILED (missing=23) to RESULT: PASSED. `skill_graph_compiler.py --export-json` regenerated the tracked skill-graph.json, clearing STALE COMPILED. The freshness panel keeps exit 0 by default for /doctor; `--strict` exits 1 when the compiled graph is stale or unreadable or has a ghost or missing skill, ignoring SQLite findings that CI cannot see, and an unknown argument exits 2. The stale line now names the compiler command. The routing drift workflow runs both checks and triggers on the panel script.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/graph-metadata.json` | Modify | Generated intent-signal carry |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Regenerated compiled graph |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | --strict and the regenerate command |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` | Modify | Strict-mode cases; one stale-line literal updated |
| `.github/workflows/routing-registry-drift.yml` | Modify | Two CI steps and trigger paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran both generators in write mode. Two DeepSeek V4.1 Flash max builds through cli-pi on the LLM gateway ran in parallel on disjoint files: the panel with its tests, and the workflow. The orchestrator reran every check and ran the panel tests against the committed script to see the new cases fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strict ignores SQLite | CI has no local SQLite index, so SQLite findings would fail every run for the wrong reason |
| Generated files only through their generators | A hand edit to graph-metadata intent_signals or skill-graph.json would drift again at the next run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `generate-router-intent-signals.cjs --check` | checked=7, missing=0, RESULT: PASSED (baseline missing=23, FAILED) |
| `skill-graph-freshness.cjs --strict` | STALE COMPILED: none, exit 0 (baseline STALE COMPILED, generated 2026-10-02) |
| Panel vitest | 14 passed; against the committed panel 2 failed |
| Workflow grep and PyYAML parse | 2; exit 0 |
| cli-classifier doctor and leaf manifest, ci-skill-derived-freshness, compiler --validate-only | pass |
| Advisor vitest | 1024 passed, 0 failed |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The new CI steps run only after the branch merges, so their first real run is on main.
<!-- /ANCHOR:limitations -->

---
