---
title: "Feature Specification: md-generator upgrade via the styles library"
description: "Deep-research investigation (10 iterations, GPT 5.6 SOL xhigh via cli-opencode) into how the 1,290-style Refero library can upgrade the sk-design design-md-generator mode — as exemplars, section-schema calibration, token grounding, quality baselines, and validation fixtures — with smart integrations and out-of-the-box ideas."
trigger_phrases:
  - "md generator upgrade research"
  - "design-md-generator styles"
  - "improve DESIGN.md output"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade"
    last_updated_at: "2026-07-18T11:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the md-generator upgrade research charter"
    next_safe_action: "Dispatch the SOL-xhigh research loop over the md-generator topic"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-md-gen-upgrade-011-002"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Which upgrade lever (exemplars, schema calibration, token grounding, validation) gives the most quality lift per build cost?"
    answered_questions:
      - "The investigation runs as a deep-research loop, building on the 001 retrieval findings."
---

# Feature Specification: md-generator upgrade via the styles library

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete — 5 iterations to stall-convergence, ranked nine-lever synthesis delivered |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-research-utilization/` (retrieval substrate findings) |
| **Successor** | `../003-global-modes-utilization/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design `design-md-generator` mode (backend `formatters-v3` + the DESIGN.md section schema at `.opencode/skills/sk-design/design-md-generator/`) generates design documents without any grounding in real, high-quality design systems. The 1,290-style library is exactly that grounding — 1,290 hand-shipped DESIGN.md + token bundles — but nothing connects the two. The 001 research established a retrieval substrate; this phase asks the narrower, deeper question of how that corpus should actually improve md-generator output.

### Purpose
Run a deep-research loop that investigates how the styles library can upgrade the md-generator mode — as few-shot exemplars, section-schema calibration, token-vocabulary grounding, consistency/quality baselines, and validation fixtures — and produces ranked, evidence-backed upgrade strategies with rough build costs, including smart integrations and out-of-the-box ideas that go beyond plain retrieval.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 10-iteration deep-research investigation of the md-generator upgrade question, executed by GPT 5.6 SOL (xhigh) via cli-opencode.
- A synthesized `research/research.md` with ranked upgrade levers, evidence (against `formatters-v3` + real corpus DESIGN.md), and rough costs.
- Explicit out-of-the-box / smart-integration ideas, not only incremental retrieval hookups.

### Out of Scope
- Implementing any upgrade (later phases).
- Changing the extraction, the library contents, or the md-generator runtime in this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-md-generator-upgrade/research/**` | Create | Deep-research loop state, iterations, and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research converges | The loop reaches legal convergence or its iteration ceiling and writes `research/research.md`. |
| REQ-002 | Ranked, evidence-backed upgrade levers | The synthesis ranks md-generator upgrade strategies, each grounded in concrete evidence (the `formatters-v3` schema, real corpus DESIGN.md, section shapes) with a rough build cost. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Concrete integration points | Recommendations name where in the md-generator pipeline each lever attaches (schema, prompt, backend, validation). |
| REQ-004 | Anti-slop discipline | The research states how exemplars ground output without averaging real styles into generic DESIGN.md. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with a ranked upgrade-lever list.
- **SC-002**: Each top lever carries evidence (schema/corpus) and a rough cost.
- **SC-003**: The parent phase-map can select md-generator implementation phases from the output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research stays abstract | Medium | The loop must cite the `formatters-v3` schema and real corpus files, and give build costs, not just themes. |
| Risk | Reinvents 001 | Low | The charter points the loop at 001's retrieval findings so it builds on the substrate rather than redoing it. |
| Dependency | The extracted library + md-generator backend | Low | Consumed read-only as the subject. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should exemplars be embedded at prompt time, at schema-calibration time, or as a validation oracle?
- Can the corpus define a measurable DESIGN.md quality baseline the generator is scored against?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Prior research**: `../001-research-utilization/research/lineages/sol/research.md`
- **Subject backend**: `.opencode/skills/sk-design/design-md-generator/`
- **Source corpus**: `.opencode/skills/sk-design/styles/`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
