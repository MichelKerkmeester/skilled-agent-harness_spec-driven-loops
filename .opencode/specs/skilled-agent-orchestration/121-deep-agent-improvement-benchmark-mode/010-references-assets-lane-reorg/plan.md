---
title: "Implementation Plan: references + assets lane reorg"
description: "Move the 14 references docs and the assets into three lane subdirs (agent-improvement, model-benchmark, shared), then repoint every SKILL path literal and refresh skill graph-metadata."
trigger_phrases:
  - "references-assets-lane-reorg plan"
  - "lane reorg plan"
  - "deep-agent-improvement reorg plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/010-references-assets-lane-reorg"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 010 plan for references and assets lane reorg"
    next_safe_action: "git mv references and assets into lane subdirs"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/references"
      - ".opencode/skills/deep-agent-improvement/assets"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-references-assets-lane-reorg"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: references + assets lane reorg

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + JSON assets, no runtime code |
| **Framework** | OpenCode skill layout (references/, assets/) |
| **Storage** | Files on disk + skill graph-metadata.json |
| **Testing** | grep sweeps + skill-load read-through |

### Overview
Regroup the function-organized references and assets trees into the three lanes the prose already names. Each move is a `git mv` to preserve history, followed by a SKILL.md literal rewrite and a graph-metadata refresh. No doc bodies change.

### Lane Mapping

References (14 docs):
- model-benchmark: `benchmark_operator_guide.md`, `evaluator_contract.md`, `mixed_executor_methodology.md`
- agent-improvement: `integration_scanning.md`, `mirror_drift_policy.md`, `profiling_audit_log.md`, `candidate_proposal_format.md`, `target_onboarding.md`, `score_dimensions.md`
- shared: `loop_protocol.md`, `quick_reference.md`, `promotion_gate_contract.md`, `promotion_rules.md`, `rollback_runbook.md`

Assets:
- model-benchmark: `benchmark-profiles/`, `benchmark-fixtures/`
- agent-improvement: `improvement_charter.md`, `improvement_config.json`, `improvement_config_reference.md`, `improvement_strategy.md`, `target_manifest.jsonc`, `target-profiles/`
- shared: none of the current assets fit shared, so the dir starts empty or is omitted
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Lane mapping recorded for every references and assets file
- [ ] SKILL.md path-literal inventory captured by grep
- [ ] graph-metadata moved-path list identified

### Definition of Done
- [ ] All 14 references docs under a lane subdir
- [ ] All assets under a lane subdir
- [ ] grep for old function-dir and flat-asset literals in SKILL.md returns zero hits
- [ ] graph-metadata paths refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lane-organized skill layout: `references/{lane}/` and `assets/{lane}/` where lane is one of agent-improvement, model-benchmark, shared.

### Key Components
- **references/{lane}/**: per-lane doc grouping that mirrors the SKILL.md two-lane prose
- **assets/{lane}/**: per-lane runtime config, charter, manifests, and benchmark fixtures/profiles
- **SKILL.md literals**: every resource map and inline path string repointed to the lane path

### Data Flow
The skill router reads SKILL.md resource literals to load docs and assets, so the literals must match the new on-disk lane paths exactly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture grep inventory of references/ and assets/ literals in SKILL.md
- [ ] Confirm lane mapping against actual file list

### Phase 2: Core Implementation
- [ ] git mv references docs into the three lane subdirs
- [ ] git mv assets into the lane subdirs
- [ ] Rewrite SKILL.md path literals to the new lane paths
- [ ] Refresh skill graph-metadata moved paths

### Phase 3: Verification
- [ ] grep for old function-dir literals in SKILL.md returns zero
- [ ] grep for old flat-asset literals in SKILL.md returns zero
- [ ] Read-through of SKILL.md resource map resolves to existing files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path sweep | Old literals gone from SKILL.md | rg |
| Resolution | New literals point at existing files | ls / read-through |
| Manual | Skill loads and router resolves resources | Read SKILL.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 009-skill-md-two-lane | Internal | Green | Lane prose must exist before disk mirrors it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A SKILL path literal cannot resolve after the move, or a doc is misclassified.
- **Procedure**: `git mv` the file back to its prior path and revert the matching SKILL.md literal edit. Moves are history-preserving so revert is clean.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
