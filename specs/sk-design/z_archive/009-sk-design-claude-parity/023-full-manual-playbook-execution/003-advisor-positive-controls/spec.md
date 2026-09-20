---
title: "Feature Specification: Phase 003 - Advisor Positive Controls (Wave)"
description: "Real cli-opencode dispatch and grading of 5 of the AI-001 6-probe positive-design-control battery (P1, P2, P3, P4, P6) against the sk-design manual_testing_playbook's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 003 advisor positive controls"
  - "AI-001 P1 P2 P3 P4 P6"
  - "positive design controls dispatch wave"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/003-advisor-positive-controls"
    last_updated_at: "2026-07-07T18:40:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed 5 dispatches and grading"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files:
      - "/tmp/skd-AI-001-P1-response.jsonl"
      - "/tmp/skd-AI-001-P2-response.jsonl"
      - "/tmp/skd-AI-001-P3-response.jsonl"
      - "/tmp/skd-AI-001-P4-response.jsonl"
      - "/tmp/skd-AI-001-P6-response.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-positive-controls-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 003 - Advisor Positive Controls (Wave)

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

`AI-001: Positive Design Controls` defines a single 6-probe battery (P1-P6) verifying that the advisor picks the single public `sk-design` identity — never a child mode as a separate identity — for every positive design-family prompt, and that the hub then resolves each probe to its documented `workflowMode` and packet. This battery has never been dispatched for real; no genuine end-to-end evidence exists for any of its 6 probes.

### Purpose

Dispatch 5 of the 6 assigned probes (`P1` interface, `P2` foundations, `P3` motion, `P4` audit, `P6` `design-mcp-open-design` transport) for real via `cli-opencode` (`openai/gpt-5.5-fast --variant medium`) using the validated Gate-3-bypass dispatch recipe, then grade each strictly against `AI-001`'s own Pass/Fail Criteria. `P5` (live-URL `md-generator` extraction) is intentionally excluded — it is dispatched separately in the serial md-generator wave because it triggers a real live-URL extraction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe (`skill_advisor.py --threshold 0.8`) for each of the 5 assigned probes' exact clean prompt.
- Real `cli-opencode` dispatch of each probe's exact prompt plus the validated dispatch-note addendum (with the no-target clause applied only where the prompt names a hypothetical local UI surface).
- Capture of the full JSON-lines stdout per dispatch under `/tmp/skd-AI-001-P<n>-response.jsonl`.
- Grading of each dispatch against `AI-001`'s own Pass/Fail Criteria section, citing the specific criterion line.

### Out of Scope

- `P5` (live-URL `md-generator` extraction) — dispatched separately in the serial md-generator wave.
- Fixing anything a dispatch reveals as broken — this wave records findings only; remediation is a follow-up decision made by the user after reviewing the parent's `verdict-matrix.md`.
- Reverting the real, out-of-repo system side effect `P6`'s dispatch produced (see Risks) — flagged for the user/parent orchestrator to decide, not silently undone by this wave.

### Dispatches Executed

| Dispatch ID | Probe | Exact Prompt |
|---|---|---|
| AI-001-P1 | Interface | "Make this onboarding page look less generic and give it a distinctive interface direction." |
| AI-001-P2 | Foundations | "Create an OKLCH palette, typography scale, and spacing system for this analytics dashboard." |
| AI-001-P3 | Motion | "Design the transition choreography and reduced-motion fallback for this modal." |
| AI-001-P4 | Audit | "Audit this settings screen for WCAG contrast, keyboard focus, and design slop." |
| AI-001-P6 | design-mcp-open-design transport | "Wire Open Design's MCP server into opencode so I can drive od cli from the terminal." |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 assigned dispatches run for real through `cli-opencode` | 5/5 `/tmp/skd-AI-001-P<n>-response.jsonl` transcripts captured |
| REQ-002 | Every verdict traces to `AI-001`'s own Pass/Fail Criteria | `dispatch-log.md` cites the specific criterion line per dispatch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Advisor probe recorded before every real dispatch | Each dispatch's advisor top-1 + confidence noted before the orchestrator call |
| REQ-004 | Findings honestly reported even when a probe doesn't cleanly PASS | `P6`'s advisor-tier loss to `sk-code` AND its real system side effect both documented, not smoothed over |
| REQ-005 | Dispatches run strictly sequentially, never backgrounded or parallelized | 5 separate foreground `Bash` calls, one dispatch resolved before the next starts |
| REQ-006 | No-target-clause decision made per probe, not defaulted | `P6` correctly received the empty clause (not a hypothetical local UI surface); an initial mis-dispatch with the wrong clause was caught and re-run before grading |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** each has a PASS/PARTIAL/FAIL verdict citing the exact `AI-001` criterion line it was graded against.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor probe and live orchestrator routing can diverge (confirmed in `P6`, and, at the live-orchestrator's own internal-advisor-tool level, in `P1`/`P3`) | Medium | All are captured and graded independently against `AI-001`'s own AND-logic Pass/Fail Criteria rather than assumed to agree |
| Risk | `P6`'s dispatch performed a real, out-of-repo system mutation (launched the Open Design desktop app; wrote `mcp.open-design` into the user's global `~/.config/opencode/opencode.json`) despite the dispatch note framing the call as a standalone, no-op evaluation | High | Documented explicitly in `dispatch-log.md` and `implementation-summary.md`; repo `git status --porcelain` confirmed clean (no repo file touched); the global-config change itself was additive/corrective (it added a missing `OD_DATA_DIR` to an already-present entry, not a destructive overwrite) but is flagged for the user to review and decide whether to keep or revert |
| Dependency | Validated Gate-3-bypass dispatch recipe (smoke-tested 5x before phase 023 started) | High | Recipe followed verbatim; one probe (`P6`) initially used the wrong no-target-clause branch and was caught and re-dispatched before grading, per the recipe's own decision rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to revert `P6`'s real global `~/.config/opencode/opencode.json` MCP-entry change is an operator decision, not made by this wave — flagged in Risks and Known Limitations for review.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Phase**: `../` (`023-full-manual-playbook-execution`, phase parent)
- **Sibling Precedent**: `../001-mode-routing-core/` (documentation shape template; same wave pattern)
- **Constituent Scenario**: `.opencode/skills/sk-design/manual_testing_playbook/advisor-integration/positive-design-controls.md` (`AI-001`)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Dispatch Log**: See `dispatch-log.md`
