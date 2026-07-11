---
title: "Implementation Plan: Parent-skill logic deep review"
description: "Dispatch one Fable-5 xhigh review round over the parent-hub doctrine, its four implementations, and the advisor integration; capture the report and summarize."
trigger_phrases:
  - "parent skill logic review plan"
  - "014 sk-doc phase 022 plan"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/022-parent-skill-logic-review"
    last_updated_at: "2026-07-07T15:48:20.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-022 plan"
    next_safe_action: "Collect review-report.md; summarize; validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Parent-skill logic deep review

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Skill/hub config (SKILL.md, mode-registry.json, hub-router.json, graph-metadata.json); advisor TS scorer |
| **Framework** | Fable-5 xhigh single-round review |
| **Storage** | review-report.md in this folder |
| **Testing** | Findings verified against real files (file:line); CONFIRMED vs SUSPECTED |

### Overview
One exhaustive Fable-5 review round. The agent reads the create-skill parent-skill doctrine, the four hub implementations, and the advisor integration, then writes a prioritized, evidence-backed report with a cross-hub consistency matrix. No fixes are applied — this phase produces the analysis.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The doctrine, four hubs, and advisor all present and located
- [x] Fable-5 agent dispatched at maximum reasoning depth

### Definition of Done
- [ ] review-report.md written with prioritized file:line findings + cross-hub matrix
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-round deep review (Fable-5, xhigh) with adversarial verification of every claim against the source files.

### Key Components
- **Doctrine read**: create-skill SKILL + references + parent_skill templates.
- **Implementation read**: sk-doc / sk-code / sk-design / deep-loop-workflows hub metadata.
- **Advisor read**: skill-graph discovery + scorer + advisorRouting consumption.
- **Report**: prioritized findings, cross-hub matrix, advisor section, recommended fixes.

### Data Flow
1. Extract the canonical parent-hub contract from create-skill.
2. Diff each of the four hubs against it and against each other.
3. Trace advisor discovery/routing end-to-end for the hubs.
4. Write review-report.md; summarize.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the doctrine, four hubs, advisor; create the review folder

### Phase 2: Implementation
- [x] Dispatch the Fable-5 xhigh review round
- [ ] Agent writes review-report.md

### Phase 3: Verification
- [ ] Confirm the report covers all dimensions + carries prioritized file:line findings
- [ ] `validate.sh`; commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence check | Every finding | file:line citation; CONFIRMED vs SUSPECTED |
| Coverage check | Report completeness | doctrine + 4 hubs + advisor sections present |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Fable-5 agent | Internal | Running | No report |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: report is thin or unfounded.
- **Procedure**: re-run the review with tighter scope; the phase is analysis-only, so nothing to revert in the code.
<!-- /ANCHOR:rollback -->
