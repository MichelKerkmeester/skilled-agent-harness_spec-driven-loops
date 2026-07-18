---
title: "Feature Specification: global styles utilization across sk-design modes"
description: "Deep-research investigation (10 iterations, GPT 5.6 SOL xhigh via cli-opencode) into how the 1,290-style library should be utilized globally across the sk-design hub and its non-md-generator modes — interface, foundations, motion, audit, plus the open-design transport — with smart integrations and out-of-the-box ideas beyond the 001 baseline pipeline."
trigger_phrases:
  - "global styles utilization research"
  - "styles across design modes"
  - "sk-design hub library integration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/003-global-modes-utilization"
    last_updated_at: "2026-07-18T11:00:00Z"
    last_updated_by: "claude"
    recent_action: "Research converged at 6 iters; per-mode strategies delivered"
    next_safe_action: "Seed per-mode implementation phases from the shared-seam-first sequence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-global-modes-011-003"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Which modes gain the most from the library, and through what integration shape each?"
    answered_questions:
      - "The investigation runs as a deep-research loop, extending the 001 retrieval substrate."
---

# Feature Specification: global styles utilization across sk-design modes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete — 6 iterations to stall-convergence, ranked six-consumer synthesis delivered |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-md-generator-upgrade/` (prior phase; shared substrate in `../001-research-utilization/`) |
| **Successor** | `../004-retrieval-substrate/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 001 research settled a shared retrieval substrate and md-generator gets its own deep dive in 002, but the other sk-design modes — `design-interface`, `design-foundations`, `design-motion`, `design-audit`, plus the `design-mcp-open-design` transport — have no defined way to exploit the 1,290-style library. Each has a different job (composition, token foundations, motion, critique, external design references), so a single generic hookup under-serves them. The global integration shape is unspecified.

### Purpose
Run a deep-research loop that investigates how the library should be utilized globally across the hub and its non-md-generator modes — as shared reference material, retrieval-backed exemplars, foundation token sources, and audit baselines — and produces ranked, evidence-backed per-mode integration strategies with rough build costs, emphasizing smart integrations and out-of-the-box ideas that extend beyond the 001 baseline pipeline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 10-iteration deep-research investigation of the global/per-mode utilization question, executed by GPT 5.6 SOL (xhigh) via cli-opencode.
- A synthesized `research/research.md` with ranked per-mode integration strategies, evidence (against each mode's contract), and rough costs.
- Explicit out-of-the-box / smart-integration ideas beyond the 001 baseline retrieval pipeline.

### Out of Scope
- md-generator upgrades (owned by 002).
- Implementing any strategy (later phases); changing the library or mode runtimes in this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `003-global-modes-utilization/research/**` | Create | Deep-research loop state, iterations, and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research converges | The loop reaches legal convergence or its iteration ceiling and writes `research/research.md`. |
| REQ-002 | Ranked, evidence-backed per-mode strategies | The synthesis ranks integration strategies per mode, each grounded in that mode's actual contract with a rough build cost. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Covers the non-md-generator modes + hub | Recommendations address interface, foundations, motion, audit, the hub, and the open-design transport — not just one. |
| REQ-004 | Extends 001, not duplicates it | The research references the 001 substrate and adds per-mode and out-of-the-box ideas on top. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with ranked per-mode integration strategies.
- **SC-002**: Each top strategy carries evidence (the mode's contract) and a rough cost.
- **SC-003**: The parent phase-map can select per-mode implementation phases from the output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research stays generic across modes | Medium | The loop must inspect each mode's real contract and give per-mode integration shapes, not one blanket answer. |
| Risk | Overlaps 001/002 | Low | The charter scopes this to the non-md-generator modes and points at 001 as the shared substrate. |
| Dependency | The extracted library + mode contracts | Low | Consumed read-only as the subject. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `design-audit` want the corpus as a comparison baseline, and `design-foundations` as a token source, or something else?
- What out-of-the-box uses (e.g. drift detection, taste calibration, reference galleries) does the corpus unlock beyond retrieval?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Prior research**: `../001-research-utilization/research/lineages/sol/research.md`
- **Subject modes**: `.opencode/skills/sk-design/{design-interface,design-foundations,design-motion,design-audit,design-mcp-open-design}/`
- **Source corpus**: `.opencode/skills/sk-design/styles/`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
