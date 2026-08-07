---
title: "Implementation Plan: Anti-Convergence Floor for Deep-Loop-Workflows Research Mode"
description: "Documents the completed minIterations and convergenceMode guard work for deep-research convergence stops."
trigger_phrases:
  - "anti-convergence floor"
  - "min iterations guard"
  - "convergence mode off"
  - "research floor deep loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/001-anti-convergence-floor"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Anti-Convergence Floor for Deep-Loop-Workflows Research Mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-loop workflow assets, JSON config, YAML command steps |
| **Framework** | `deep-loop-workflows` research mode with `deep-loop-runtime` convergence checks |
| **Storage** | `deep_research_config.json` config and JSONL event output |
| **Testing** | Config-load validation plus research-loop convergence guard checks |

### Overview
This completed work added a minimum-iteration floor to research-mode convergence handling so a run cannot stop after a single shallow candidate when `minIterations` requires more iterations. It also added `convergenceMode:"off"` as a convergence-stop escape hatch while preserving hard caps, pause handling, and halt behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: `step_check_convergence` lacked a minimum iteration floor.
- [x] Success criteria measurable: STOP behavior differs for `minIterations:1` versus `minIterations:3`.
- [x] Dependencies identified: this leaf precedes the convergence-profile and cross-mode contract leaves.

### Definition of Done
- [x] `minIterations` and `convergenceMode` are defined in the research config contract.
- [x] `step_check_convergence` blocks convergence STOP before the configured floor.
- [x] `min_iterations_guard_pass` is available as a distinct JSONL event.
- [x] Config validation rejects or normalizes `minIterations > maxIterations` safely.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven stop-policy guard: the JSON config owns the operator controls and the YAML convergence step applies them before allowing a STOP decision.

### Key Components
- **`deep_research_config.json`**: Adds `minIterations` with default 3 and `convergenceMode` with `default` or `off` values.
- **`deep_research_auto.yaml`**: Applies the floor in `step_check_convergence` and emits `min_iterations_guard_pass` when the floor clears.
- **Config validation**: Ensures `minIterations <= maxIterations` and fail-opens older configs with a safe default.

### Data Flow
The research config loads `minIterations` and `convergenceMode`, the convergence step receives the current `iterationCount`, and STOP is allowed only when convergence is enabled and the iteration floor has cleared. When the guard clears, the run emits a `min_iterations_guard_pass` record for downstream attribution.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Research config | Owns run limits and convergence controls | Add `minIterations` and `convergenceMode` fields | Config accepts `minIterations:3` and `convergenceMode:"off"` |
| Convergence YAML step | Decides whether convergence can stop a run | Block STOP when `iterationCount < minIterations` | Iterations 1 and 2 continue when floor is 3 |
| JSONL events | Exposes guard state to dashboards | Emit `min_iterations_guard_pass` | Event includes `iterationCount` and `minIterations` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed leaf spec and capture the research-mode scope.
- [x] Identify the config and YAML command files named by the spec.
- [x] Preserve cross-mode work for later leaves.

### Phase 2: Core Implementation
- [x] Add `minIterations` defaulting to 3 in `deep_research_config.json`.
- [x] Add `convergenceMode` with `default` and `off` options.
- [x] Update `step_check_convergence` to prevent convergence STOP before the floor.
- [x] Emit `min_iterations_guard_pass` separately from quality-guard events.

### Phase 3: Verification
- [x] Validate `minIterations <= maxIterations` at config load.
- [x] Confirm `convergenceMode:"off"` disables only convergence STOP.
- [x] Confirm hard caps, pause, and halt paths remain active.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config validation | `minIterations`, `maxIterations`, and `convergenceMode` combinations | Config-load validation |
| Behavior check | STOP blocked before floor and allowed after floor | Research-mode convergence step run |
| Event check | `min_iterations_guard_pass` event payload | JSONL output inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| No predecessor leaf | Internal | Complete | This leaf establishes semantics used by leaves 002 and 003 |
| Convergence-profile ADR | Internal successor | Complete | Must preserve the `minIterations` stop-guard meaning |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research runs stop incorrectly, config load rejects valid older configs, or JSONL guard events are malformed.
- **Procedure**: Revert the `deep_research_config.json` and `deep_research_auto.yaml` changes for this leaf, then restore the previous convergence-stop behavior while retaining a follow-up issue for the missing floor.
<!-- /ANCHOR:rollback -->
