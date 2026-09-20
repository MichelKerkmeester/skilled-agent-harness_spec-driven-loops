---
title: "Feature Specification: Wave 008 - Parity-Proof and Fallback-Start"
description: "Executes PB-006, PB-007, and the FR-001 foundations/interface/motion no-card-fallback trio against the real cli-opencode orchestrator, grading each strictly against its own scenario file's Pass/Fail Criteria."
trigger_phrases:
  - "wave 008 parity proof fallback start"
  - "PB-006 PB-007 FR-001"
  - "polish gate selection proof"
  - "variation set selection proof"
  - "no card matches fallback"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start"
    last_updated_at: "2026-07-07T17:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb-fr-wave-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Wave 008 - Parity-Proof and Fallback-Start

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

The larger 023 manual-playbook-execution packet needs every `manual_testing_playbook` scenario actually dispatched through the real `cli-opencode` orchestrator (not just read or reasoned about) and graded strictly against that scenario file's own Pass/Fail Criteria. Wave 008 owns five of those dispatches: two parity-behavior proofs (`PB-006`, `PB-007`) confirming shared/private procedure-card selection discipline across modes, and the first three of the five `FR-001` no-card-matches-fallback checks (foundations, interface, motion) confirming modes correctly report `Procedure applied: none - ...` instead of inventing or over-loading a procedure card.

### Purpose

Run each assigned dispatch through the validated two-step recipe (deterministic advisor probe, then a real `opencode run` orchestrator dispatch with the standalone-evaluation addendum), capture the full JSON-lines transcript, and grade PASS/PARTIAL/FAIL against the constituent scenario file's own criteria with a cited line. `FR-001` only ships an exact prompt for the foundations case; the interface and motion variants are authored-to-pattern (mode hint + narrow advisory question + explicit procedure-card check + no card-trigger words), matching the file's own pattern rather than being verbatim scenario text.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe + real orchestrator dispatch for `PB-006` (`shared-polish-gate-selection-proof.md`), using its exact prompt verbatim.
- Advisor probe + real orchestrator dispatch for `PB-007` (`interface-variation-set-selection-proof.md`), using its exact prompt verbatim.
- Advisor probe + real orchestrator dispatch for `FR-001-foundations` (`no-card-matches-fallback.md`), using its exact prompt verbatim.
- Advisor probe + real orchestrator dispatch for `FR-001-interface` and `FR-001-motion`, using narrow advisory prompts authored to the file's own pattern (no exact prompt text exists in the source file for these two variants).
- Grading each of the 5 dispatches PASS/PARTIAL/FAIL strictly against its scenario file's own Pass/Fail Criteria section, with a cited criterion line.
- `dispatch-log.md` recording one row per dispatch: dispatch id, scenario id, exact prompt used, advisor top-1/confidence, resolved mode/packet/resources, verdict, and one-line rationale.

### Out of Scope

- The remaining four dispatches in wave "008-parity-proof-and-fallback-start" (`FR-001-audit`, `FR-001-md-generator`) belong to a sibling dispatch and are not owned by this document.
- Any repo mutation to `sk-design` itself — every dispatch in this wave is a standalone evaluation call per the addendum; no `sk-design` source file is edited as part of grading.
- Root-index (`manual_testing_playbook.md`) or `README.md` sync — this wave only executes and grades already-authored scenarios, it does not author new ones or touch the index.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start/spec.md` | Create | This document |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start/plan.md` | Create | Implementation plan |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start/tasks.md` | Create | Task breakdown |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start/checklist.md` | Create | Verification checklist |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start/implementation-summary.md` | Create | Final summary + verdicts |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start/dispatch-log.md` | Create | Per-dispatch evidence table |
| `/tmp/skd-PB006-response.jsonl`, `/tmp/skd-PB007-response.jsonl`, `/tmp/skd-FR001-foundations-response.jsonl`, `/tmp/skd-FR001-interface-response.jsonl`, `/tmp/skd-FR001-motion-response.jsonl` | Create | Raw JSON-lines transcripts (scratch evidence, not committed) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every dispatch follows the validated two-step recipe (advisor probe, then real orchestrator run) with no deviation | 5/5 dispatches ran advisor probe first, then `timeout 300 opencode run ... </dev/null` with the addendum |
| REQ-002 | Each dispatch's full JSON-lines transcript is captured and parsed for `text`/`tool` lines before grading | 5/5 `/tmp/skd-*-response.jsonl` files exist and were parsed for their final answer plus tool-call sequence |
| REQ-003 | Each verdict cites the specific Pass/Fail Criteria line from the scenario's own file, not a generic bar | 5/5 verdicts in `dispatch-log.md` cite an exact criterion phrase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `FR-001-interface` and `FR-001-motion` prompts are authored to the file's own pattern, not invented freely | Each prompt is `<mode>: explain whether <narrow advisory question>. Keep it advisory and state whether a procedure card applies before answering.`, mirroring the foundations exact prompt shape, with no card-trigger words for that mode |
| REQ-005 | The `NO_TARGET_CLAUSE` decision is made per-prompt by reading the prompt's own text, not defaulted | Each of the 5 dispatches documents which clause form applied and why in `dispatch-log.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** each has a saved transcript, an advisor-probe result, and a verdict citing the scenario file's own criterion line.
- **SC-002**: **Given** the FR-001 trio, **Then** all three responses state the mode-specific `Procedure applied: none - baseline <mode> workflow` fallback line before substantial output, per FR-001's own Pass/Fail Criteria.
- **SC-003**: **Given** PB-006 and PB-007, **Then** each verdict is checked against its own file's disjunctive FAIL triggers, not just its PASS description, since a scenario can partially satisfy PASS while still tripping a named FAIL condition.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `opencode run` hangs on stdin if `</dev/null` is omitted | High | Every dispatch command in this wave includes the trailing `</dev/null` redirect, confirmed by non-zero-line output on all 5 runs |
| Risk | Grading drifts to a generic bar instead of the scenario file's own criteria | Medium | Each verdict in `dispatch-log.md` and `implementation-summary.md` cites an exact phrase from that file's Pass/Fail Criteria section |
| Risk | A response partially satisfies PASS wording while still tripping a disjunctive FAIL clause (seen in `PB-007`) | Medium | Graded as `PARTIAL`, not silently rounded up to `PASS`, with the specific missing criterion named |
| Dependency | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` being runnable from repo root | High | Confirmed working for all 5 probes (3 non-empty results, 2 empty `[]` results below threshold, both documented) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. `FR-001-audit` and `FR-001-md-generator` are explicitly out of scope for this document (owned by a sibling dispatch in the same wave) and are not a gap in this wave's own five assigned dispatches.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `dispatch-log.md`'s per-dispatch row shape (dispatch_id, scenario_id, exact prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale) is reusable for any future manual-playbook wave that needs the same evidence-first grading discipline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- An advisor probe returning `[]` (no skill clears the 0.8 threshold) is not itself a failure signal for `FR-001` scenarios, since their own Pass/Fail Criteria never requires an advisor-confidence floor — only `PB-007` names an explicit advisor-confidence PASS bar.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 5 real dispatches + 5 transcripts + strict per-file grading, no source-code changes |
| Risk | 3/25 | Read-only evaluation calls against a live orchestrator; no mutating tool expected or observed |
| Research | 7/20 | Required reading 3 scenario files plus 4 supporting `SKILL.md`/procedure-card sources to grade accurately |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Sibling wave-generation precedent**: `../022-benchmark-rerun-and-coverage-fill/` (Level 2 structural template followed by this document)
- **Scenario sources**: `.opencode/skills/sk-design/manual_testing_playbook/parity-behavior/shared-polish-gate-selection-proof.md`, `.opencode/skills/sk-design/manual_testing_playbook/parity-behavior/interface-variation-set-selection-proof.md`, `.opencode/skills/sk-design/manual_testing_playbook/fallback-and-resilience/no-card-matches-fallback.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Per-dispatch evidence**: See `dispatch-log.md`
