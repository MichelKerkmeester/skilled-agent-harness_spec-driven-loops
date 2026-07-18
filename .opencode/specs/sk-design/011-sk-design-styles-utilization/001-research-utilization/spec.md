---
title: "Feature Specification: Styles-library utilization research"
description: "Deep-research investigation (10 iterations, GPT 5.6 SOL xhigh via cli-opencode) into smart ways to index, retrieve, and consume the ~1,290-style Refero library across the sk-design hub and its five nested modes, producing ranked, evidence-backed utilization strategies."
trigger_phrases:
  - "styles utilization research"
  - "how to use the style library"
  - "design library retrieval research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/001-research-utilization"
    last_updated_at: "2026-07-18T09:22:48Z"
    last_updated_by: "claude"
    recent_action: "Research converged at 8 iterations; ranked strategies synthesized"
    next_safe_action: "Seed packet-011 implementation phases from the Phase A/B/C sequence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-utilization-011-001"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which utilization strategies rank highest on leverage versus build cost?"
    answered_questions:
      - "The investigation runs as a deep-research loop, not a one-shot."
---

# Feature Specification: Styles-library utilization research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete — 8 iterations to stall-convergence, ranked synthesis delivered |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None; first child |
| **Successor** | `../002-*` (planned — pending convergence) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The extracted styles library (`.opencode/skills/sk-design/styles/`, ~1,290 real design systems as DESIGN.md + token files) is unused by the sk-design runtime. Before building anything, the smart ways to exploit it — and the traps — must be established with evidence rather than guessed.

### Purpose
Run a deep-research loop that investigates how the hub and its five modes (interface, foundations, motion, audit, md-generator) should index, retrieve, and consume the library, and produces ranked, evidence-backed utilization strategies with rough build costs, so the parent can author the right implementation phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 10-iteration deep-research investigation of the utilization question, executed by GPT 5.6 SOL (xhigh) agents through cli-opencode.
- A synthesized `research/research.md` with ranked strategies, evidence, and open risks.

### Out of Scope
- Implementing any strategy (later phases).
- Changing the extraction or the library contents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research-utilization/research/**` | Create | Deep-research loop state, iterations, and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research converges | The loop reaches legal convergence or its iteration ceiling and writes `research/research.md`. |
| REQ-002 | Ranked, evidence-backed strategies | The synthesis ranks utilization strategies, each with concrete evidence (files, patterns, precedents) and a rough build cost. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Covers hub + all five modes | Recommendations address the hub plus interface, foundations, motion, audit, and md-generator, not just one. |
| REQ-004 | Anti-slop discipline | The research states how to reference real styles without averaging them into generic output. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with a ranked strategy list.
- **SC-002**: Each top strategy carries evidence and a rough cost.
- **SC-003**: The parent phase-map can select implementation phases from the output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research stays abstract | Medium | The loop must cite concrete files/patterns and give build costs, not just themes. |
| Dependency | The extracted library | Low | Consumed read-only as the subject corpus; the extraction run may still be in flight. |
| Dependency | cli-opencode + GPT 5.6 SOL | Low | Same dispatch path proven for the earlier deep review. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which retrieval substrate (static index, tokens store, on-demand grep) best fits the modes' access patterns?
- How should "reference vs synthesize" be gated to keep output distinctive?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Source corpus**: `.opencode/skills/sk-design/styles/`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
