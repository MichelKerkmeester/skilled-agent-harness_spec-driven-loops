---
title: "Implementation Summary: references + assets lane reorg"
description: "references/ and assets/ physically reorganized from function dirs into agent-improvement, model-benchmark, and shared lane subdirs, with every path literal repointed and both lanes verified."
trigger_phrases:
  - "references-assets-lane-reorg summary"
  - "lane reorg implementation summary"
  - "deep-agent-improvement reorg summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/010-reorganize-two-lane-references-assets"
    last_updated_at: "2026-05-29T10:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Moved references and assets into lane subdirs, repointed all literals"
    next_safe_action: "Build phase 013 scripts physical reorg"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/references"
      - ".opencode/skills/deep-agent-improvement/assets"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-010-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-reorganize-two-lane-references-assets |
| **Completed** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill's references and assets are now organized by lane instead of by function. Anyone opening `references/` or `assets/` sees three subdirs (`agent-improvement/`, `model-benchmark/`, `shared/`) that match the two-lane model, rather than the old function dirs (integration, promotion-gates, scoring, workflow).

### References (14 docs)

Flattened into lanes (function subdir dropped, filename kept): `agent-improvement/` holds integration_scanning, mirror_drift_policy, profiling_audit_log, candidate_proposal_format, target_onboarding, score_dimensions; `model-benchmark/` holds benchmark_operator_guide, evaluator_contract, mixed_executor_methodology; `shared/` holds loop_protocol, quick_reference, promotion_gate_contract, promotion_rules, rollback_runbook.

### Assets

`benchmark-profiles/` and `benchmark-fixtures/` moved into `assets/model-benchmark/`; the agent-improvement loop assets (improvement_charter, improvement_config, improvement_config_reference, improvement_strategy, target_manifest.jsonc, target-profiles) moved into `assets/agent-improvement/`. No shared assets exist, so no `shared/` asset subdir was created.

### Literal repointing (the blast radius)

Every consumer of the moved paths was updated: the SKILL.md RESOURCE_MAP, DEFAULT_RESOURCE, and RUNTIME_ASSETS; both Lane B YAMLs and both Lane A YAMLs; both deep commands; README.md; the skill graph-metadata; scripts (run-benchmark default profilesDir, dispatch-model config join, optin-scorer test); the feature catalog and manual testing playbook; reference cross-links; and the benchmark profile's INTERNAL fixtureDir so fixtures resolve from the new location. The moved markdown assets had `../references/` links that broke one dir deeper and were corrected to `../../references/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/**` | Moved (git mv) | 14 docs flattened into agent-improvement, model-benchmark, shared |
| `assets/**` | Moved (git mv) | benchmark assets to model-benchmark, loop assets to agent-improvement |
| SKILL.md, README.md, graph-metadata.json | Modified | Repoint RESOURCE_MAP, DEFAULT_RESOURCE, RUNTIME_ASSETS, asset tables |
| 4 command YAMLs + 2 command .md | Modified | Repoint config, profile, and fixtures paths |
| scripts (run-benchmark, dispatch-model, optin-scorer test) | Modified | Repoint default asset paths |
| feature_catalog + manual_testing_playbook + reference cross-links | Modified | Repoint asset and reference path mentions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A references reorg agent and an assets reorg agent ran in sequence (single writer on SKILL.md), then an independent verifier ran a residual-path grep, a both-lane benchmark smoke against the moved profile, a RESOURCE_MAP resolution check, vitest, validate, and advisor routing. The orchestrator re-ran the 5dim smoke independently to confirm fixtures resolve from the new location.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flatten references into lanes, drop the function subdir | Lane visibility is the goal, and a flat lane dir reads cleaner than nested function dirs |
| Keep improvement_config in agent-improvement, shared by both lanes | It is the agent-improvement-owned runtime config, and the Lane B YAMLs intentionally point at the same template |
| Update the profile-internal fixtureDir | Without it materialize cannot find fixtures from the new location, which would silently zero out scoring |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residual old-path grep (skill + commands) | PASS, 0 in-scope (only a frozen historical review iteration retains an old string) |
| Lane B smoke pattern + 5dim via moved profile | PASS, both reach benchmark-complete, fixtures materialized (3) |
| SKILL RESOURCE_MAP + DEFAULT_RESOURCE + RUNTIME_ASSETS resolve | PASS, 13 distinct paths exist, 0 missing |
| vitest | PASS, 13 files, 133 tests |
| validate.sh --strict on 010 + --recursive on parent | PASS, 0 errors, 0 warnings |
| advisor routing | PASS, benchmark phrasing still routes to deep-model-benchmark |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scripts not yet lane-separated.** The 16 scripts in `scripts/` are still flat. The scripts physical reorg is phase 013, the last and highest-risk phase.
2. **Pre-existing relative-link depth in some reference docs.** A few `../README.md` and `../scripts/` links inside reference docs were already mis-depthed before the move and were left as-is since the reorg did not change their depth.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
