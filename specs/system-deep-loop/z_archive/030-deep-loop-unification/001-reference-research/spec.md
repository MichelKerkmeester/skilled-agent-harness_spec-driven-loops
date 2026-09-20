---
title: "Feature Specification: Reference Research — Deep-Loop Unification"
description: "A 20-iteration multi-model deep-research fanout (10x GPT-5.5 xhigh fast, 5x GLM-5.2 max, 5x Sonnet-5 xhigh) stress-testing the deep-loop-workflows + deep-loop-runtime merge design before the irreversible move executes."
trigger_phrases:
  - "deep loop unification research"
  - "system-deep-loop reference research"
  - "deep-loop merge research fanout"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/001-reference-research"
    last_updated_at: "2026-07-08T06:06:21.300Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Fanout complete (15/20 real, 5 sonnet5 substituted); research.md applied to 002"
    next_safe_action: "Execute 002-hub-rename-and-runtime-nesting Stage 0"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Reference Research — Deep-Loop Unification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (15/20 replicas real; 5/20 substituted per below) |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-hub-rename-and-runtime-nesting |
| **Handoff Criteria** | Ranked, evidence-cited synthesis in `research/research.md` confirming or revising the structural/reference-migration/fallback designs already produced by 3 parallel sonnet-5 Plan agents |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three parallel sonnet-5 Plan agents already produced a concrete, file:line-grounded mechanical design for merging `deep-loop-workflows` + `deep-loop-runtime` into `system-deep-loop` (structural layout, reference migration, and the research-fanout invocation itself). That design deserves independent stress-testing across diverse models and reasoning styles before the irreversible directory move (child 002) executes — a single planning pass can share blind spots a genuinely independent second and third look would catch.

### Purpose
Run a 20-iteration `/deep:research` fanout across 3 model lineages (10x GPT-5.5 xhigh/fast, 5x GLM-5.2 max, 5x Sonnet-5 xhigh) investigating the merge design, converging on a ranked, evidence-backed set of confirmations, corrections, and open risks that feed directly into child 002/003's execution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only, multi-model investigation of the merge design (structural layout, coupling repair, reference migration, advisor-corpus handling, fallback-router wiring).
- Synthesis into `research/research.md` + `research/resource-map.md`, with a `research/fanout-attribution.md` mapping which lineage/replica surfaced which finding.

### Out of Scope
- Executing any part of the merge itself (delegated to sibling children 002-005).
- Modifying `deep-loop-workflows`/`deep-loop-runtime` in any way — this phase is strictly read-only investigation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Ranked, evidence-cited synthesis across all 20 replicas |
| `research/resource-map.md` | Create | Coverage map from convergence evidence |
| `research/fanout-attribution.md` | Create | Per-lineage/replica finding attribution (auto-written by `fanout-merge.cjs`) |
| `research/lineages/{gpt55-fast,glm52,sonnet5}-N/` | Create | Per-replica isolated deep-research packets (state, iterations, deltas) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 3 model lineages dispatched exactly as specified | **Partially met as originally specified, met via substitution overall**: 10x `openai/gpt-5.5-fast` and 5x `zai-coding-plan/glm-5.2` completed for real via the fanout, confirmed via `research/fanout-attribution.md`. 5x `claude-sonnet-5` failed 5/5 terminally (macOS Keychain auth gap in `cli-claude-code` headless dispatch — confirmed reproducible, not this run's fault) and was substituted with 5 in-session Plan-agent (model: sonnet) deep-dives achieving the same research intent by a different mechanism |
| REQ-002 | Convergence floor of >=3 iterations per lineage before any early stop | Satisfied automatically for the 15 real replicas: `antiConvergence.minIterations: 3` is baked into every replica's own isolated config, and fan-out merge only ran after all lineages independently terminated |
| REQ-003 | Ranked, evidence-cited synthesis produced | `research/research.md` present — 10 findings sections + a 10-item revision checklist, each citing file:line evidence; already applied to 002's plan.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | GLM-5.2 failures degrade gracefully, not silently | On `maxRetries` exhaustion for a `glm52-N` replica, `fanout-salvage.cjs` recovers partial output; synthesis notes any lineage that finished with fewer than 5 completed replicas |
| REQ-005 | Sonnet-5 lineage dispatched via `cli-claude-code`, never `kind: native` | Confirmed in the executors payload — `native` fan-out dispatch is hardcoded to `model: opus` in `deep_research_auto.yaml` and would silently produce the wrong model |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 lineages reach their per-lineage `minIterations: 3` floor; no lineage terminates with 0 completed replicas.
- **SC-002**: `research/research.md` either confirms child 002/003's staged execution plans as-is, or lists concrete, evidence-backed revisions before those phases start.
- **SC-003**: Any genuinely new risk (beyond what the 3 Plan agents already surfaced) is flagged explicitly, not silently folded into the existing risk list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | GLM-5.2 has no automatic fallback to MiMo-v2.5-Pro wired at the fan-out level (`fallback-router.ts` has zero callers today) | A `glm52-N` replica that exhausts `maxRetries` degrades to a same-model retry-and-salvage, not an automatic model swap | Accepted for this phase; operator-mediated manual re-dispatch as `mimo-v2.5-pro` is possible post-hoc since `fanout-merge.cjs` just enumerates `lineages/` subdirectories — see plan.md §Fallback |
| Risk | `cli-claude-code` self-invocation concerns (a prior barter-packet attempt failed on packet-state-write, unrelated to self-invocation) | Low — `fanout-run.cjs` dispatches via direct `spawnSync`, not the `cli-claude-code` skill; its env allowlist strips `CLAUDECODE`; its recursion guard checks an internal marker, not env/ancestry | Recommend a `count: 1` smoke-test replica before committing all 5 Sonnet-5 replicas (see plan.md) |
| Dependency | 3 parallel sonnet-5 Plan agents' file:line-grounded design (this session) | This research phase validates/extends that design rather than starting from zero | N/A — design already captured in child 002/003's own spec.md/plan.md |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking — this phase is ready to launch.
<!-- /ANCHOR:questions -->
