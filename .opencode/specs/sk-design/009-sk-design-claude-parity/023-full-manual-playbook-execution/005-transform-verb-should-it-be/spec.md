---
title: "Feature Specification: Wave 005 - Transform Verb 'should it be' Framing"
description: "Executes 5 manual-playbook dispatches (TV-002-V2/V3/V4, TV-003, TV-004) verifying sk-design's transformVerbRouting split between audit-framed and interface-framed transform verbs, plus the foundations excluded-aliases boundary."
trigger_phrases:
  - "wave 005 transform verb should it be"
  - "TV-002 TV-003 TV-004 dispatch results"
  - "should it be audit routing"
  - "clarify alias only foundations excluded aliases"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be"
    last_updated_at: "2026-07-07T17:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Ran all 5 assigned dispatches (TV-002-V2/V3/V4, TV-003, TV-004) and graded verdicts"
    next_safe_action: "Roll up into parent 023 verdict-matrix.md"
    blockers: []
    key_files:
      - "dispatch-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-005-should-it-be"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Wave 005 - Transform Verb "should it be" Framing

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

The sk-design manual-testing-playbook category `03--transform-verb-framing` has three scenario files (`should-it-be-audit.md`, `clarify-alias-only.md`, `foundations-excluded-aliases.md`) that assert precise routing contracts for `transformVerbRouting` in `mode-registry.json`: "should it be"-framed transform verbs must resolve to `audit`; `clarify` must resolve to `interface` (as an alias-only entry excluded from command projection parity); and `typeset`/`colorize` must never resolve to `foundations` solely by themselves. None of these assertions had been exercised against the real `opencode run` orchestrator dispatch path — only reasoned about from the registry source.

### Purpose

Run the 5 dispatches assigned to this wave (three of `TV-002`'s four variants plus the full `TV-003` and `TV-004` scenarios) through the validated advisor-probe-then-live-dispatch recipe, capture the full JSON-lines transcript for each, and grade PASS/FAIL strictly against each scenario file's own Pass/Fail Criteria section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe (`skill_advisor.py --threshold 0.8`) for each of the 5 dispatches, using the exact clean scenario prompt text.
- Live orchestrator dispatch (`opencode run --model openai/gpt-5.5-fast --variant medium --format json`) for each of the 5 dispatches, with the standard dispatch-note addendum appended verbatim.
- Grading each dispatch PASS/FAIL against its constituent scenario file's own "Pass/Fail Criteria" section, citing the specific criterion line.
- Documenting all 5 dispatches in `dispatch-log.md` with prompt, advisor result, resolved mode/packet/resources, verdict, and rationale.

### Out of Scope

- `TV-002-V1` (`Should it be bolder, or is the current hierarchy already strong enough?`) — assigned to a different wave/agent in this same parallel run, not this wave's responsibility.
- Any remediation of the routing gaps this wave's dispatches surfaced (`design-foundations`'s own vocabulary guardrails colliding with `mode-registry.json`'s `clarify` alias; the `typeset`/`colorize` excluded-alias boundary being overridden by the hub's own "Bundle Rule for Build/UI Work"; the complete non-routing on TV-002-V4). Fixing `mode-registry.json`, `hub-router.json`, or `sk-design/SKILL.md` is a separate, later remediation packet's job — this wave only observes and grades.
- Root-index (`manual_testing_playbook.md`) updates — a rollup task owned by the parent `023-full-manual-playbook-execution` packet, not this child wave.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be/dispatch-log.md` | Create | Per-dispatch row: prompt, advisor result, resolved mode/packet, verdict, rationale |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be/{spec,plan,tasks,checklist,implementation-summary}.md` | Create | Level 2 spec-folder documentation for this wave |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every assigned dispatch runs the validated recipe (advisor probe, then live dispatch, one at a time) | 5/5 dispatches have both an advisor-probe result and a full live-dispatch JSON-lines transcript saved under `/tmp/skd-*` |
| REQ-002 | Every dispatch is graded strictly against its own scenario file's Pass/Fail Criteria | `dispatch-log.md` cites the specific criterion line for every verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Failures are diagnosed via the scenario's own Failure Triage steps, not generic guessing | Rationale column names the matching triage step where applicable (TV-002-V4's "advisor loses" match) |
| REQ-004 | Spec-folder shape mirrors the sibling `022-benchmark-rerun-and-coverage-fill/` Level 2 structure | `validate.sh --strict` passes with Errors:0 |
| REQ-005 | Any disagreement between the standalone advisor-probe result and the live-dispatch resolved mode is documented, not silently reconciled | `dispatch-log.md`'s Summary section names the probe-vs-live disagreement observed on TV-002-V2/V3 and the both-fail case on TV-002-V4 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** each has a recorded advisor-probe result, a saved live-dispatch transcript, and a PASS/FAIL verdict citing the scenario's own criterion.
- **SC-002**: **Given** a dispatch fails, **Then** the rationale identifies the specific root cause (routing collision, missing resource, or advisor-signal gap) grounded in the actual transcript, not assumption.
- **SC-003**: **Given** this wave's docs are complete, **Then** `validate.sh --strict` on this folder returns Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model non-determinism across runs (single sample per dispatch) | Low-Medium | Each verdict is grounded in the actual captured transcript, not assumed behavior; re-running could show variance but the captured evidence is what's graded |
| Risk | Advisor-probe script and live-dispatch routing can disagree (confirmed in this wave: TV-002-V2/V3) | Low | Documented explicitly as a cross-cutting finding in `dispatch-log.md` rather than silently reconciled |
| Dependency | `skill_advisor.py` script and `opencode run` CLI both reachable from repo root | High | Both confirmed working via a sanity-check dispatch (TV-002-V1 advisor probe returned a clean win before running the assigned variants) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all 5 assigned dispatches ran and graded to a definitive PASS/FAIL verdict; no ambiguity required operator input for this wave's own scope.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `dispatch-log.md`'s one-row-per-dispatch shape (dispatch_id, scenario_id, exact prompt, advisor result, resolved mode/packet, verdict, rationale) is reusable by sibling waves in the same `023-full-manual-playbook-execution` parallel run and by the parent rollup.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- TV-002-V4 is the edge case where BOTH the advisor probe AND the live dispatch failed to route to `sk-design` at all — distinct from TV-002-V2/V3 where only the probe failed but live dispatch still self-corrected.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 sequential live dispatches + grading against 3 scenario files |
| Risk | 3/25 | Read-only evaluation dispatches; no repo files touched by the dispatches themselves |
| Research | 6/20 | Cross-referencing each transcript against its scenario's exact Pass/Fail Criteria wording and Failure Triage steps |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Scenario files**: `.opencode/skills/sk-design/manual_testing_playbook/03--transform-verb-framing/{should-it-be-audit,clarify-alias-only,foundations-excluded-aliases}.md`
- **Parent packet**: `../` (`023-full-manual-playbook-execution`)
- **Precedent Level 2 shape**: `../../022-benchmark-rerun-and-coverage-fill/`
- **Dispatch Evidence**: See `dispatch-log.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
