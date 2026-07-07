---
title: "Feature Specification: Phase 001 - Mode Routing Core (Wave)"
description: "Real cli-opencode dispatch and grading of 5 mode-routing scenarios (MR-001, MR-002, MR-003, MR-004, MR-006) against the sk-design manual_testing_playbook's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 001 mode routing core"
  - "MR-001 MR-002 MR-003 MR-004 MR-006"
  - "mode routing dispatch wave"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/001-mode-routing-core"
    last_updated_at: "2026-07-07T17:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed 5 dispatches and grading"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files:
      - "/tmp/skd-MR001-response.jsonl"
      - "/tmp/skd-MR002-response.jsonl"
      - "/tmp/skd-MR003-response.jsonl"
      - "/tmp/skd-MR004-response.jsonl"
      - "/tmp/skd-MR006-response.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mode-routing-core-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 001 - Mode Routing Core (Wave)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-design `manual_testing_playbook`'s `01--mode-routing` category has never been dispatched for real. The automated Lane C skill-benchmark harness force-classifies every `MR-*` scenario as `browser` and routes it out of live-mode scoring entirely, so no genuine end-to-end evidence exists that a generic visual-direction prompt, a static token-system prompt, a temporal motion prompt, a QA-audit prompt, or an explicit `motion:` mode-hint prompt actually resolve through the `sk-design` hub to their documented `workflowMode` and packet in a real `cli-opencode` session.

### Purpose

Dispatch the 5 assigned scenarios (`MR-001`, `MR-002`, `MR-003`, `MR-004`, `MR-006`) for real via `cli-opencode` (`openai/gpt-5.5-fast --variant medium`) using the validated Gate-3-bypass dispatch recipe, then grade each strictly against that scenario's own file's Pass/Fail Criteria — never a generic bar.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe (`skill_advisor.py --threshold 0.8`) for each of the 5 assigned scenarios' exact clean prompt.
- Real `cli-opencode` dispatch of each scenario's exact prompt plus the validated dispatch-note addendum (with the no-target clause applied where the prompt names a hypothetical local UI surface).
- Capture of the full JSON-lines stdout per dispatch under `/tmp/skd-<id>-response.jsonl`.
- Grading of each dispatch against its own scenario file's Pass/Fail Criteria section, citing the specific criterion line.

### Out of Scope

- MR-005 and MR-007 (assigned to other waves per the phase-parent's children table).
- Fixing anything a dispatch reveals as broken — this wave records findings only; remediation is a follow-up decision made by the user after reviewing the parent's `verdict-matrix.md`.
- Re-litigating the phase-018/019/021/022 playbook architecture or coverage decisions.

### Dispatches Executed

| Dispatch ID | Scenario | Exact Prompt (abridged) |
|---|---|---|
| MR-001 | Interface Mode Routing | "Make this SaaS pricing page look less generic and give it a distinctive visual direction." |
| MR-002 | Foundations Mode Routing | "Create an OKLCH color token system, typography scale, spacing rhythm, and responsive grid for this dashboard." |
| MR-003 | Motion Mode Routing | "Design the hover micro-interactions and reduced-motion fallback for this command menu." |
| MR-004 | Audit Mode Routing | "Audit this checkout UI for WCAG contrast, keyboard focus, responsive issues, and design slop." |
| MR-006 | Mode Hint Override to Motion | "motion: make the menu transition feel bolder and more deliberate." |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 assigned dispatches run for real through `cli-opencode` | 5/5 `/tmp/skd-<id>-response.jsonl` transcripts captured |
| REQ-002 | Every verdict traces to the scenario's own Pass/Fail Criteria | `dispatch-log.md` cites the specific criterion line per dispatch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Advisor probe recorded before every real dispatch | Each dispatch's advisor top-1 + confidence noted before the orchestrator call |
| REQ-004 | Findings honestly reported even when a scenario doesn't cleanly PASS | `MR-004`'s advisor-tier discrepancy documented, not smoothed over |
| REQ-005 | Dispatches run strictly sequentially, never backgrounded or parallelized | 5 separate foreground `Bash` calls, one dispatch resolved before the next starts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** each has a PASS/PARTIAL/FAIL verdict citing the exact scenario-file criterion line it was graded against.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor probe and live orchestrator routing can diverge (confirmed in `MR-004`) | Medium | Both are captured and graded independently against the scenario's own AND-logic Pass/Fail Criteria rather than assumed to agree |
| Dependency | Validated Gate-3-bypass dispatch recipe (smoke-tested 5x before phase 023 started) | High | Recipe followed verbatim, no re-derivation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding for this wave — the dispatch recipe, grading protocol, and phase-parent structure were confirmed by the operator before phase 023 started.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Phase**: `../` (`023-full-manual-playbook-execution`, phase parent)
- **Sibling Precedent**: `../../022-benchmark-rerun-and-coverage-fill/` (documentation shape template)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Dispatch Log**: See `dispatch-log.md`
