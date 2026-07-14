---
title: "Feature Specification: HTML, DOCX, and move-aware review"
description: "Add structural HTML and isolated DOCX extraction, deterministic move and replacement detection, side-by-side review, and fidelity diagnostics after quality gates pass."
trigger_phrases:
  - "HTML document diff"
  - "DOCX document diff"
  - "document move detection"
  - "side by side diff report"
importance_tier: "critical"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-standalone-document-diff-skill/004-html-docx-and-move-detection"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded the gated rich-structure phase"
    next_safe_action: "Wait for phase 003 security and license gates, then finalize adapter intake"
    blockers:
      - "Phase 003 applicable security, license, and fixture gates must pass"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What measured similarity threshold best separates replacement from delete plus add?"
    answered_questions:
      - "HTML is structural and DOCX is adapter-tier, not full-fidelity."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: HTML, DOCX, and move-aware review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 scaffold; upgrade before high-risk parser implementation |
| **Priority** | P0 |
| **Status** | Draft; gated by phase 003 |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 7 |
| **Predecessor** | `../003-validation-security-and-quality-gates/spec.md` |
| **Successor** | `../005-pdf-cli-and-cross-platform-state/spec.md` |
| **Handoff Criteria** | HTML and DOCX produce truthful structural diffs, moves are deterministic, and side-by-side review preserves the static fallback |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase expands the proven core to higher-risk structured formats. It also completes the v1 move algorithm and report fidelity experience defined by research.

**Scope Boundary**: Add HTML and DOCX adapters, worker isolation, move/replacement mapping, side-by-side enhancement, and fidelity dashboard. Do not add PDF, OCR, or OpenCode orchestration.

**Dependencies**:

- Phase 002 canonical model, diff actions, renderer, and public API.
- Phase 003 HTML/DOCX fixture, security, license, accessibility, and performance gates.
- DOMPurify, rehype or cheerio, and mammoth license and version verification.

**Deliverables**:

- Structural HTML adapter that strips active content and preserves explicit warnings.
- DOCX adapter through mammoth and cheerio in a limited worker or subprocess.
- Unique-hash, repeated-content contextual, and similarity-based node mapping.
- First-class move and replacement actions.
- Side-by-side report enhancement and fidelity dashboard.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Text-only extraction cannot represent headings, lists, tables, links, repeated blocks, or moves in HTML and DOCX reliably. These formats also contain active content and complex containers that must not enter the core process or generated report without isolation and diagnostics.

### Purpose

Provide useful structural review for HTML and DOCX while clearly exposing fidelity limits and keeping parser failures or hostile content contained.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- HTML parsing, sanitization, safe semantic attributes, active-element removal, and layout-loss warnings.
- DOCX conversion, external-resource disablement, timeout and memory limits, tracked-change and unsupported-construct warnings.
- Worker or subprocess isolation for untrusted HTML and DOCX parsing.
- Exact unique subtree anchors, deterministic duplicate matching, similarity candidates, one-to-one assignment, and delete/add fallback.
- Side-by-side alignment, synchronized-scroll enhancement, keyboard shortcuts, collapsed unchanged sections, and CSS-only fallback.
- Per-node capability badges, warning table, provenance, move links, and fidelity summary.

### Out of Scope

- Visual layout equivalence or pixel comparison.
- Text PDF and scanned PDF extraction.
- Runtime downloads or cloud parsing.
- Weakening phase 003 gates to accommodate parser behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Future HTML and DOCX adapter modules | Create | Isolated extraction, sanitization, canonical mapping, and diagnostics |
| Future move-mapping module | Create | Deterministic exact, contextual, and similarity matching |
| Future report renderer and fixtures | Modify | Side-by-side enhancement, fidelity dashboard, move navigation, and tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement structural HTML extraction with sanitization. | Active content and unsafe URIs are removed; supported structure maps to canonical nodes; layout loss is diagnosed. |
| REQ-002 | Implement isolated DOCX extraction. | Parser runs within time and memory limits, cannot read external resources, and preserves mammoth warnings as fidelity diagnostics. |
| REQ-003 | Implement deterministic move and replacement mapping. | Unique, repeated, reordered, and partially edited blocks produce stable one-to-one actions across repeated runs. |
| REQ-004 | Add the side-by-side report without breaking static review. | Essential content, navigation, and warnings remain available when JavaScript is disabled or rejected by CSP. |
| REQ-005 | Add a truthful fidelity dashboard. | Every limited or unsupported construct is visible with severity and provenance; no score implies visual equivalence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Meet phase 003 quality and performance gates. | HTML and DOCX fixtures stay within approved detection, noise, time, memory, and report-size limits. |
| REQ-007 | Preserve deterministic portable interfaces. | New adapters and change actions are available through the same core API and CLI without OpenCode dependencies. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: HTML and DOCX fixture pairs produce stable structural changes and explicit fidelity warnings.
- **SC-002**: Hostile HTML and DOCX fixtures execute no payload and remain inside resource limits.
- **SC-003**: Moves, replacements, repeated identical content, and below-threshold changes match the research contract.
- **SC-004**: Side-by-side and unified reports remain self-contained, accessible, and useful without JavaScript.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Gate | Phase 003 security and license result | Rich parser implementation cannot start if red | Keep this phase blocked and resolve the gate rather than bypassing it |
| Risk | DOCX conversion hides tracked changes or layout | Review may look more complete than it is | Emit construct-level warnings and never claim visual fidelity |
| Risk | Repeated content maps inconsistently | Move results become non-deterministic | Use contextual one-to-one assignment with explicit tie-breakers |
| Risk | Progressive enhancement becomes required | CSP or no-JS users lose review content | Keep unified static report and anchor navigation authoritative |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which similarity threshold and token weighting pass the move/replacement fixture corpus with the lowest noise?
- Should parser isolation use worker threads or subprocesses after measuring termination and memory enforcement on all platforms?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Gate phase: `../003-validation-security-and-quality-gates/spec.md`
- Research algorithm: `../001-research-and-requirements/research/research.md`

