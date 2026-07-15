---
title: "Implementation Plan: HTML, DOCX, and move-aware review"
description: "Add gated structural adapters in isolation, implement deterministic tree mapping, then enhance the report with side-by-side review and fidelity diagnostics."
trigger_phrases:
  - "HTML DOCX diff plan"
  - "move detection implementation plan"
importance_tier: "critical"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/004-html-docx-and-move-detection"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the rich-structure phase scaffold"
    next_safe_action: "Verify phase 003 unlock evidence"
    blockers:
      - "Phase 003 applicable gates"
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: HTML, DOCX, and move-aware review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on the phase 002 portable core |
| **Libraries** | rehype or cheerio, DOMPurify, mammoth |
| **Isolation** | Worker thread or subprocess with enforced timeout and memory ceiling |
| **Testing** | Phase 003 structural, hostile-container, move, accessibility, and performance fixtures |

### Overview

Implement adapters behind the existing canonical interface, never inside the diff engine. Land extraction and isolation first, then the deterministic mapping algorithm, then report enhancements that consume the new diff actions and fidelity diagnostics.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 003 gates for HTML, DOCX, dependencies, and report security are green.
- [ ] Phase 002 core APIs and report fallback are stable.
- [ ] Resource limits and parser termination behavior are testable on all supported platforms.

### Definition of Done

- [ ] Structural and hostile HTML/DOCX fixtures pass.
- [ ] Move and replacement mapping is deterministic for repeated and reordered content.
- [ ] Reports preserve CSP, no-network, accessibility, and zero-JS behavior.
- [ ] Measured adapter performance stays within approved phase 003 budgets.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Isolated format adapters feeding a shared canonical tree and mapping pipeline.

### Key Components

- **HTML adapter**: Parse, sanitize, map semantics, and emit layout-loss diagnostics.
- **DOCX adapter worker**: Convert with mammoth, sanitize with cheerio or DOMPurify, enforce limits, and retain warnings.
- **Tree mapper**: Unique hashes, duplicate contextual matching, similarity candidates, and deterministic assignment.
- **Report enhancement**: Side-by-side layout, move links, fidelity dashboard, and fixed-script progressive enhancement.

### Data Flow

Untrusted rich input is validated and parsed in isolation, returned as canonical data plus diagnostics, mapped against the other tree, and rendered through the existing escaped report boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Adapter registry | Text and Markdown only | Add HTML and DOCX capability-tier entries | Capability matrix tests |
| Parser execution | In-process low-risk formats | Add isolated rich parser path | Timeout, memory, and kill tests |
| Diff result | Add, delete, replacement | Add deterministic move actions and provenance | Move/repeated-content fixtures |
| HTML report | Unified static review | Add side-by-side enhancement and fidelity dashboard | CSP, accessibility, and no-JS tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Verify phase 003 unlock evidence and dependency licenses.
- [ ] Choose worker or subprocess isolation from cross-platform evidence.
- [ ] Freeze HTML, DOCX, move, and fidelity expected outputs.

### Phase 2: Implementation

- [ ] Add HTML and DOCX extraction with diagnostics and isolation.
- [ ] Add exact, contextual duplicate, similarity, and deterministic assignment stages.
- [ ] Add first-class move actions, side-by-side enhancement, and fidelity dashboard.

### Phase 3: Verification

- [ ] Run structural, hostile, move, repeatability, accessibility, and performance gates.
- [ ] Manually review representative reports with and without JavaScript.
- [ ] Record residual fidelity limits and adapter-specific warnings.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Adapter mapping, sanitization, similarity, assignment | TypeScript test runner |
| Golden | HTML/DOCX canonical models, moves, warnings, report hunks | Phase 003 fixtures |
| Isolation | Timeout, memory ceiling, termination, external access | Worker/subprocess harness |
| Browser | Side-by-side, CSP script hash, keyboard, no-JS fallback | Headless and manual browser |
| Performance | HTML/DOCX extraction, diff, report, memory | Shared benchmark runner |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 gates | Internal gate | Blocked until executed | No rich adapter implementation |
| Phase 002 core | Internal | Planned | Adapters have no stable target |
| DOMPurify, rehype/cheerio, mammoth | External | Researched | Adapter design or license notices must change if verification fails |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Isolation cannot be enforced, hostile fixtures execute, move mapping is unstable, or report fallback regresses.
- **Procedure**: Disable the affected adapter or move feature from the capability registry, keep the prior core behavior, preserve failing fixtures, and return the phase to active planning.
<!-- /ANCHOR:rollback -->

