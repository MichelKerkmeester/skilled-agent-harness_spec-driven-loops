---
title: "Feature Specification: sk-design Claude-Parity Review Remediation"
description: "Fix all 11 active findings (8 P1, 3 P2) from the 009 packet's 10-iteration deep review: prompt-data isolation, output/artifact-policy gaps, renderer CSS-value-safety, transition-parser correctness, and traceability alignment in the design-md-generator backend."
trigger_phrases:
  - "review remediation"
  - "sk-design claude parity remediation"
  - "design-md-generator fixes"
  - "phase 014"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/014-review-remediation"
    last_updated_at: "2026-07-06T18:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Created phase folder and spec.md"
    next_safe_action: "Read affected source files, then implement Seam B first"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-design Claude-Parity Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `014-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 10-iteration deep review of the sk-design Claude-parity packet (`.opencode/specs/sk-design/009-sk-design-claude-parity/review/review-report.md`) returned verdict CONDITIONAL with 8 P1 and 3 P2 active findings, all concentrated in the `design-md-generator` backend: missing component facts in the WRITE prompt, unsanitized prompt-data and CSS-value injection surfaces, an output-path guard that doesn't enforce the documented spec-folder/sandbox boundary, a comma-splitting bug in transition-shorthand parsing, and a feature-catalog claim that doesn't match code behavior.

### Purpose
Move the 009 packet from CONDITIONAL to PASS by remediating all 11 active findings without expanding scope beyond the reviewed md-generator and traceability surfaces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Seam A: prompt-data isolation + component facts (P1-001, P1-003)
- Seam B: shared output/artifact-policy resolver (P1-002, P1-005, overlaps P1-004)
- Seam C: renderer CSS-value safety via new `render-safety.ts` (P1-006, P1-008)
- Seam D: transition-shorthand parser correctness (P1-007)
- Seam E: traceability alignment between feature catalog and code (P1-004)
- P2 advisories: procedure-card schema lint wiring (P2-001), duplicate benchmark artifact naming (P2-002), missing tests for focused extraction modules (P2-003)

### Out of Scope
- Any read-only design mode (interface/foundations/motion/audit) gaining write/execute capability - explicitly forbidden by the review's traceability findings
- New features beyond the 11 findings
- Re-litigating the ruled-out P0 compound-risk hypothesis (P1-002 + P1-003 -> arbitrary file write); it stays ruled out per iterations 6 and 9

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts` | Create | Shared output-path resolver (Seam B) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts` | Create | CSS-value sanitizer helpers (Seam C) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts` | Modify | Data-only prompt encoder + component facts (Seam A) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts` | Modify | Use shared output-policy resolver (Seam B) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts` | Modify | Use shared output-policy resolver (Seam B) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts` | Modify | Use output-policy resolver + render-safety sanitizers (Seam B, C, E) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts` | Modify | Use output-policy resolver + render-safety sanitizers (Seam B, C, E) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts` | Modify | Use output-policy resolver (Seam B) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts` | Modify | Fix transition comma-splitting (Seam D) |
| `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md` | Modify | Align overwrite-behavior claim with code (Seam E) |
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Modify | Wire schema lint into canon checker (P2-001) |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md` | Modify | Resolve duplicate benchmark artifact naming (P2-002) |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/*` | Modify/Create | Regression tests for all seams + P2-003 test coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

None. No P0 findings in the source review.

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix P1-001: WRITE prompt omits component facts | `build-write-prompt.ts` surfaces deterministic component facts to the prompt |
| REQ-002 | Fix P1-002: output guard doesn't enforce spec-folder/sandbox | `extract.ts` resolves output paths through the shared policy resolver, rejecting paths outside spec-folder/sandbox |
| REQ-003 | Fix P1-003: extracted values enter WRITE prompt without isolation | `build-write-prompt.ts` labels extracted data as data, not instructions, via encoder |
| REQ-004 | Fix P1-004: catalog promises overwrite protection code doesn't implement | `report-gen.ts`/`preview-gen.ts`/`proof.ts` implement the guard OR the catalog doc is corrected to match code (code fix chosen) |
| REQ-005 | Fix P1-005: guided-run validates against one cwd, executes from another | `guided-run.ts` resolves output and extraction cwd consistently via the shared resolver |
| REQ-006 | Fix P1-006: dark-mode CSS variables injected unescaped | `report-gen.ts` routes dark-mode values through `render-safety.ts` |
| REQ-007 | Fix P1-007: transition shorthand comma-splitting bug | `css-analyzer.ts` parses `cubic-bezier(...)`/`steps(...)` without corrupting the transition list |
| REQ-008 | Fix P1-008: report/preview renderers inject unsanitized CSS tokens | `report-gen.ts`/`preview-gen.ts` route source-derived CSS tokens through `render-safety.ts` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 P1 findings have a code fix with a regression test proving the original failure mode is closed.
- **SC-002**: All 3 P2 advisories are resolved or the fix is proven complete by direct evidence.
- **SC-003**: Backend test suite (`backend/tests/*`) passes with new regression tests included.
- **SC-004**: No reviewed read-only design mode gains write/execute authority as a side effect of shared-resolver refactoring.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared output-policy resolver used by 5 files | If resolver semantics are wrong, all 5 consumers break at once | Write resolver tests first, adversarial cases (relative path, path traversal, missing spec folder) before wiring consumers |
| Risk | Seam A (prompt encoder) and Seam C (renderer safety) touch overlapping test fixtures | Medium | Sequence Seam B first (per review Plan Seed), then A, then C |
| Risk | Over-fixing beyond the 11 findings (scope creep) | Low-Medium | Stick to Files to Change list; anything else is a separate follow-up |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding - spec folder placement (nested phase 014) and fix scope (all 11 findings) were confirmed via AskUserQuestion before this spec was written.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No meaningful throughput regression in md-generator extraction/write pipeline from added sanitization/resolution steps.

### Security
- **NFR-S01**: Output-policy resolver enforces spec-folder or approved sandbox boundary on every write path; no path escapes.
- **NFR-S02**: CSS-value sanitizers never allow source-derived strings to break out of their intended CSS declaration context.

### Reliability
- **NFR-R01**: All existing backend tests continue to pass after refactor.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/missing component facts: encoder must not throw, should omit the section gracefully.
- Malicious/instruction-like extracted strings (e.g. text containing "ignore previous instructions"): must render as inert data in the prompt.
- CSS values containing `url(...)`, `expression(...)`, or unbalanced quotes: sanitizer must escape or reject, never pass through raw.

### Error Scenarios
- Output path resolves outside spec-folder/sandbox: resolver throws/rejects, caller surfaces a clear error instead of writing.
- `cubic-bezier(a, b, c, d)` inside a `transition` shorthand: parser must treat the whole function call as one segment, not split on internal commas.

### State Transitions
- Existing output artifacts (`report.html`, `preview.html`, `proof-data.json`, `proof.html`): explicit overwrite guard or `--force` flag semantics decided once in Seam B/E and applied consistently.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~13 files touched across 5 seams, 2 new modules |
| Risk | 12/25 | No auth/breaking API surface; path/security-adjacent but read-only reviewed target now the write target |
| Research | 4/20 | Investigation already complete via the 10-iteration review; this is remediation, not discovery |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Source Review**: `.opencode/specs/sk-design/009-sk-design-claude-parity/review/review-report.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
