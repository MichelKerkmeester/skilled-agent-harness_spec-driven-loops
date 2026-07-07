---
title: "Feature Specification: Wave 009 - Fallback & Hub-Manager Intake Dispatches"
description: "Executes the FR-001-audit, FR-002-motion, HM-001, HM-002, HM-003, and HM-004 manual-testing-playbook scenarios for sk-design via real opencode run dispatches, grading each against its scenario file's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 009 fallback and hub intake"
  - "sk-design manual playbook wave 009"
  - "FR-001 FR-002 HM-001 HM-002 HM-003 HM-004"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/009-fallback-and-hub-intake"
    last_updated_at: "2026-07-07T17:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-009-fallback-hub-intake"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Wave 009 - Fallback & Hub-Manager Intake Dispatches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-design `manual_testing_playbook` documents real-orchestrator scenarios but none of the fallback-and-resilience (`07--fallback-and-resilience/`) or hub-manager-intake (`08--hub-manager-intake/`) scenarios had ever been run through a real `opencode run` dispatch against the live GPT-5.5-fast executor. Six scenarios in this wave (`FR-001`'s `audit` variant, `FR-002`'s `motion` variant, `HM-001` through `HM-004`) needed a real dispatch, a captured JSON-lines transcript, and a verdict graded strictly against each scenario file's own Pass/Fail Criteria.

### Purpose

Execute the six assigned dispatches one at a time using the validated dispatch recipe (deterministic advisor probe, then a real `opencode run` orchestrator call with the standard evaluation addendum), capture full JSON-lines transcripts, and grade each dispatch strictly against its scenario file's own Pass/Fail Criteria section — never a generic bar.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read all 6 constituent scenario files in `07--fallback-and-resilience/` and `08--hub-manager-intake/` in full before dispatching.
- Run the advisor probe (`skill_advisor.py --threshold 0.8`) for each dispatch's clean exact prompt and record top-1 skill + confidence.
- Run the real orchestrator dispatch (`opencode run --model openai/gpt-5.5-fast --variant medium --format json`) for each of the 6 assigned dispatch IDs, using the exact addendum recipe, appending the hypothetical-local-target clause only where the scenario names a hypothetical local UI surface (not for the hub-intake premise questions, which are explicitly exempted).
- For `FR-001-audit`, author a narrow advisory `audit`-mode prompt following the same structural pattern as the scenario file's own `foundations` exact prompt (the file gives only the foundations variant verbatim), since the scenario's own text does not supply an audit-specific exact prompt; flag this authored-not-quoted status explicitly in the dispatch log.
- Capture full JSON-lines stdout under `/tmp/skd-<dispatch-id>-response.jsonl` for each dispatch.
- Grade each dispatch PASS / PARTIAL / FAIL / SKIP strictly against its scenario file's own Pass/Fail Criteria, citing the specific criterion line.
- Author this Level 2 spec-folder documentation plus a `dispatch-log.md` at the folder root.

### Out of Scope

- `FR-002`'s `md-generator` variant (owned by the serial wave `010-md-generator-serial-pipeline`).
- `FR-001`'s `foundations`, `interface`, and `md-generator` variants (owned by wave `008-parity-proof-and-fallback-start` and other concurrent waves).
- Any edits to `manual_testing_playbook.md`, `SKILL.md`, `mode-registry.json`, or `hub-router.json` — this wave is execution/grading only, no playbook or registry authoring.
- Cleanup of the real Open Design project/run that `HM-004`'s dispatch created against a live daemon (see Known Limitations in `implementation-summary.md`) — out of scope for this documentation-only packet; flagged for operator awareness.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/009-fallback-and-hub-intake/{spec,plan,tasks,checklist,implementation-summary,dispatch-log}.md` | Create | This wave's Level 2 spec-folder documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 assigned dispatches executed one at a time via the validated recipe | 6 full JSON-lines transcripts captured under `/tmp/skd-<id>-response.jsonl` |
| REQ-002 | Every verdict traces to the scenario file's own Pass/Fail Criteria line | `dispatch-log.md` cites the exact criterion for each of the 6 verdicts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `FR-001-audit`'s authored prompt is explicitly flagged as authored-to-pattern, not scenario-verbatim | Noted in both `spec.md` scope and `dispatch-log.md` |
| REQ-004 | Real external side effects (HM-004's live Open Design daemon call) are surfaced, not hidden | Documented in `implementation-summary.md` Known Limitations |
| REQ-005 | Standalone advisor-probe instability observed during the run is recorded, not silently normalized away | Noted per dispatch in `dispatch-log.md` and summarized in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the 6 assigned dispatches, **Then** each has a captured transcript and a verdict citing the scenario file's own Pass/Fail Criteria.
- **SC-002**: **Given** `FR-001-audit`'s prompt gap in the scenario file, **Then** the authored substitute prompt is clearly flagged as such, matching the wave-008 authored-to-pattern precedent.
- **SC-003**: **Given** `HM-004`'s dispatch performed a real mutating call against a live Open Design daemon, **Then** that side effect is documented, not silently omitted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Standalone `skill_advisor.py` probe scores were unstable across repeated runs (native daemon intermittently unavailable, falling back to a noisier local scorer) | Low | Recorded observed probe results as-is for the record; graded the real dispatch's actual behavior (mode resolution, tool calls, proof lines) against the scenario's Pass/Fail Criteria, not the standalone probe's score |
| Risk | `HM-004`'s dispatch hit a live, running Open Design MCP daemon (task brief flagged this as a possible SKIP/timeout, but the daemon was live) and created a real project + started a real generation run | Medium | Documented as a known side effect; graded the dispatch's pairing/ordering behavior per `HM-004`'s own criteria, which is unaffected by whether the daemon happened to be live |
| Dependency | Wave 008's authored FR-001 interface/motion variants (referenced by the parent orchestrator as the pattern to follow for `FR-001-audit`) | Low | Wave 008's folder was empty at time of writing (concurrent parallel execution); authored the `audit` variant independently, following the same structural pattern as the scenario file's own `foundations` exact prompt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to clean up the real Open Design project (`linear-grounded-settings-page`) and run (`b8362f10-b306-4254-83d7-2bfc343183dc`) that `HM-004`'s dispatch created against the live daemon is an operator decision, not made in this phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The dispatch recipe (deterministic advisor probe -> real orchestrator dispatch with standard addendum -> transcript capture -> criteria-cited grading) used here is the same recipe used across all `023-full-manual-playbook-execution` waves, keeping grading methodology consistent across the full 55-dispatch run.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- `HM-003`'s standalone advisor probe routed to `mcp-figma` (keyword pull on "Figma export") rather than `sk-design`; the real dispatch's internal routing correctly loaded both `mcp-figma` (transport) and `design-audit` (acceptance authority), matching the hub's own `Transports and Consumers` contract even though the standalone probe alone would have suggested a miss.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 6 real dispatches, no source-code or playbook edits, documentation-only packet |
| Risk | 3/25 | Read-only/advisory dispatches; one dispatch (`HM-004`) had an unplanned real external side effect |
| Research | 6/20 | Required reading 6 scenario files plus hub `SKILL.md`, mode-registry, and transport-packet sections to grade accurately |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Sibling waves**: `../008-parity-proof-and-fallback-start/` (FR-001's other variants), `../010-md-generator-serial-pipeline/` (FR-002's md-generator variant)
- **Precedent**: `../../022-benchmark-rerun-and-coverage-fill/` (Level 2 documentation shape this wave mirrors)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Per-dispatch log**: See `dispatch-log.md`
