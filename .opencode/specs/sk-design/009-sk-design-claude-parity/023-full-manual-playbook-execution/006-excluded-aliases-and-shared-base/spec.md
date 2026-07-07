---
title: "Feature Specification: Wave 006 - Excluded Aliases & Shared Reference Base"
description: "Manual-testing-playbook wave executing TV-005, SR-002 (3-probe battery), and SR-003 against the live sk-design orchestrator via cli-opencode, grading each against its scenario file's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 006 excluded aliases shared base"
  - "TV-005 SR-002 SR-003"
  - "excluded aliases shared reference base playbook wave"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base"
    last_updated_at: "2026-07-07T15:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-006-excluded-aliases-shared-base"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Wave 006 - Excluded Aliases & Shared Reference Base

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

The sk-design `manual_testing_playbook` has never been exercised end-to-end against the real `cli-opencode` orchestrator for two specific behavioral guarantees: that `harden` and `polish` are excluded from `audit` transform-verb aliasing (`TV-005`), and that the four non-md-generator design modes correctly use `backendKind: reference-base` while the shared reference base itself is never invoked as a user-facing workflow (`SR-002`, `SR-003`). Prior validation covered these claims only at the registry/static-config level; no session had dispatched the exact scenario prompts through a live model and observed the resulting mode resolution, packet loads, and tool surface.

### Purpose

Execute this wave's 5 assigned dispatches (`TV-005`, `SR-002-P1`, `SR-002-P2`, `SR-002-P3`, `SR-003`) against the live `sk-design` orchestrator using the validated dispatch recipe (deterministic advisor probe + real `opencode run` orchestrator call), capture full JSON-lines transcripts, and grade each strictly against its own scenario file's Pass/Fail Criteria section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read the 3 constituent scenario files in full as ground truth (`audit-excluded-aliases.md`, `reference-base-backend-modes.md`, `shared-base-not-workflow.md`).
- Run the deterministic advisor probe (`skill_advisor.py`) for each of the 5 dispatches, using each scenario's exact clean prompt with no addendum.
- Dispatch each of the 5 exact prompts to the live orchestrator (`opencode run --model openai/gpt-5.5-fast --variant medium --format json`) with the validated addendum appended, one at a time, sequentially.
- Capture full JSON-lines stdout per dispatch under `/tmp/skd-<dispatch-id>-response.jsonl`.
- Grade each dispatch PASS / PARTIAL / FAIL / SKIP strictly against its constituent scenario file's own Pass/Fail Criteria section, citing the specific criterion line.
- Author this Level 2 spec-folder (spec/plan/tasks/checklist/implementation-summary) plus a `dispatch-log.md` documenting every dispatch's exact prompt, advisor result, resolved mode/packet/resources, verdict, and rationale.

### Out of Scope

- Modifying any `sk-design` skill source files (`mode-registry.json`, `hub-router.json`, `SKILL.md`, mode packets) — this wave is read-only evaluation, not remediation.
- Grading dispatches outside this wave's 5 assigned dispatch IDs (other waves cover the remaining playbook scenarios).
- Rolling up the parent `023-full-manual-playbook-execution` verdict-matrix or implementation-summary — that is a separate, later task (`#56` in the tracking list) owned by the orchestrating session after all waves complete.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/spec.md` | Create | This spec |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/plan.md` | Create | Implementation plan |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/tasks.md` | Create | Task breakdown |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/checklist.md` | Create | Verification checklist |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/implementation-summary.md` | Create | Final summary |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/006-excluded-aliases-and-shared-base/dispatch-log.md` | Create | Per-dispatch evidence table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 assigned dispatches run against the live orchestrator, one at a time | 5 JSON-lines transcripts saved under `/tmp/skd-*-response.jsonl` |
| REQ-002 | Every dispatch graded strictly against its scenario file's own Pass/Fail Criteria | `dispatch-log.md` cites the specific criterion line per verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Advisor probe run before each orchestrator dispatch with the clean, unmodified prompt | Advisor top-1 skill + confidence recorded per dispatch |
| REQ-004 | Spec-folder shape mirrors phase `022-benchmark-rerun-and-coverage-fill`'s Level 2 structure | Same 5 files + frontmatter/anchor conventions, validated `--strict` |
| REQ-005 | Advisor-vs-orchestrator divergences are surfaced, not silently absorbed into a verdict | Any dispatch where the standalone advisor probe's top-1 differs from `sk-design` is called out explicitly in `dispatch-log.md`, with the verdict still grounded in the live orchestrator dispatch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** each has a saved advisor-probe result and a saved orchestrator JSON-lines transcript.
- **SC-002**: **Given** each transcript, **Then** the verdict (PASS/PARTIAL/FAIL/SKIP) traces to a specific quoted Pass/Fail Criteria line from the owning scenario file.
- **SC-003**: **Given** the spec folder is complete, **Then** `validate.sh --strict` returns Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The deterministic advisor probe disagrees with the scenario's "Expected advisor behavior" prose (e.g. returns `sk-code` top-1 instead of `sk-design`) | Low | The scenario's actual Pass/Fail Criteria section grades the live orchestrator's mode resolution, not the standalone advisor script; discrepancies are recorded as observations in `dispatch-log.md` but do not by themselves fail a dispatch unless the criteria explicitly ties to advisor confidence |
| Risk | `opencode run` hangs on stdin | Low | Every dispatch command ends with `</dev/null` per the validated recipe |
| Dependency | `skill_advisor.py` (system-skill-advisor) and `opencode run` CLI (cli-opencode) both available and functioning | High | Confirmed working across all 5 dispatches in this wave |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All 5 dispatches produced unambiguous transcripts gradable against their scenario's own criteria.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `dispatch-log.md` is written as a single evidence table (one row per dispatch) so future re-runs of this wave, or audits of the verdicts, can diff against a fixed shape without re-reading full transcripts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- `SR-002` is a 3-probe battery under one scenario ID; each probe (P1/P2/P3) is graded and logged as an independent dispatch row, but all 3 must individually satisfy the scenario's single shared Pass/Fail Criteria section for the parent scenario to read as fully covered.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 sequential live dispatches + grading, no source-code changes |
| Risk | 2/25 | Read-only evaluation; no mutating tool surface exercised |
| Research | 6/20 | Read 3 scenario files in full plus resolved-packet SKILL.md content surfaced inline by each dispatch |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Sibling waves**: `../001-mode-routing-core/` through `../010-md-generator-serial-pipeline/` (the other 9 waves of the same parent execution)
- **Constituent scenarios**: `../../../../../../skills/sk-design/manual_testing_playbook/03--transform-verb-framing/audit-excluded-aliases.md`, `../../../../../../skills/sk-design/manual_testing_playbook/05--shared-reference-base/reference-base-backend-modes.md`, `../../../../../../skills/sk-design/manual_testing_playbook/05--shared-reference-base/shared-base-not-workflow.md`
- **Structural precedent**: `../../022-benchmark-rerun-and-coverage-fill/` (Level 2 shape mirrored for this wave)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Per-Dispatch Evidence**: See `dispatch-log.md`
