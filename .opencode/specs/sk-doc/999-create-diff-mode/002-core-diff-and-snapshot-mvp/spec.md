---
title: "Feature Specification: Core document diff and snapshot MVP"
description: "Build the portable TypeScript core with text and Markdown extraction, a canonical typed tree, deterministic diffing, a safe unified HTML report, and basic snapshots."
trigger_phrases:
  - "document diff core"
  - "text markdown diff"
  - "canonical document tree"
  - "basic document snapshots"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/002-core-diff-and-snapshot-mvp"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded the research-backed MVP phase"
    next_safe_action: "Run phase intake, confirm package location, and establish the seed fixture subset"
    blockers:
      - "Phase 001 command-owned research audit must be closed before production implementation starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-002-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which repository path should host the portable npm package?"
    answered_questions:
      - "Use Node.js 22+ and TypeScript, with Node 24 LTS as the development default."
      - "The first supported formats are plain text and Markdown."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Core document diff and snapshot MVP

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 scaffold; re-evaluate at implementation intake |
| **Priority** | P0 |
| **Status** | Draft; implementation blocked on phase 001 audit closure |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 7 |
| **Predecessor** | `../001-research-and-requirements/spec.md` |
| **Successor** | `../003-validation-security-and-quality-gates/spec.md` |
| **Handoff Criteria** | Deterministic text and Markdown comparison produces a safe self-contained report and verified basic snapshots |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the first product implementation phase. It converts the phase 001 architecture into the smallest portable core that can compare plain text and Markdown outside Git.

**Scope Boundary**: Build only the mandatory core, text and Markdown adapters, unified static report, explicit-pair comparison, and basic snapshot path. Rich adapters, full security certification, move detection, and the OpenCode wrapper stay in later phases.

**Dependencies**:

- Phase 001 synthesis and accepted decision record.
- A seed text/Markdown fixture subset established before core algorithm work.
- Node.js 22+ support, Node 24 LTS development default, TypeScript 5.x.

**Deliverables**:

- Portable `create-diff` package skeleton and public core interfaces.
- Ordered canonical typed tree with deterministic hashes and fidelity diagnostics.
- Plain-text and Markdown adapters.
- Deterministic add, delete, and replacement diffing through jsdiff.
- Self-contained unified HTML report with zero-JavaScript fallback.
- Basic capture and explicit before/after comparison flow.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research has selected an architecture, but no reusable comparison engine exists. Before rich formats or an agent wrapper can be trusted, the project needs a deterministic core that proves the canonical model, basic diff semantics, report generation, and snapshot boundary on the lowest-noise formats.

### Purpose

Deliver a portable MVP that compares text and Markdown locally and emits the same safe HTML artifact later adapters and the skill wrapper will reuse.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- TypeScript package structure and stable public API for extraction, diffing, snapshots, and report rendering.
- Canonical node kinds, occurrence identity, content hashes, subtree hashes, source references, and fidelity warnings.
- Unicode NFC, newline, and whitespace normalization.
- Plain-text passthrough and Markdown-to-mdast extraction.
- jsdiff-backed deterministic add, delete, and replacement actions.
- Unified HTML report with inlined CSS, escaped source content, restrictive CSP foundation, anchors, summaries, and no network dependencies.
- Basic content-addressed snapshot capture plus explicit `--before` and `--after` fallback.

### Out of Scope

- HTML, DOCX, PDF, and OCR adapters; later phases own their fidelity and isolation contracts.
- Full move detection; phase 004 owns contextual mapping and repeated-content handling.
- Complete retention CLI and cross-platform state behavior; phase 005 owns lifecycle management.
- OpenCode skill triggers and automatic AI-edit integration; phase 006 owns orchestration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Future `create-diff` package root | Create | Portable TypeScript core, adapters, report renderer, and tests; exact repository path is selected at phase intake |
| `../001-research-and-requirements/research/research.md` | Read only | Architecture and contract source; command-owned research artifacts remain untouched |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement the ordered canonical typed tree and deterministic hashing contract. | Repeated runs over identical fixtures produce byte-equivalent canonical JSON and hashes. |
| REQ-002 | Implement plain-text and Markdown adapters with truthful diagnostics. | Fixture tests preserve supported structure and report unsupported constructs without silent loss. |
| REQ-003 | Implement deterministic add, delete, and replacement diff actions. | Intentional changes in the seed corpus are detected and unchanged content remains stable. |
| REQ-004 | Render a self-contained unified HTML report. | The report works from `file://`, makes no network requests, escapes source content, and remains usable with JavaScript disabled. |
| REQ-005 | Preserve source files and support snapshots plus explicit pairs. | Capture never overwrites the source; explicit before/after comparison works without stored state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Expose the research-defined core API and initial CLI experience. | Public interfaces cover capture, compare, explicit compare, extraction, diff, and render; `npx create-diff compare file.md` is testable. |
| REQ-007 | Support Node 22 and 24 with pinned dependencies. | CI and local tests pass on both supported runtime lines with a committed lockfile. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Text and Markdown fixture comparisons are deterministic and detect all intentional seed changes.
- **SC-002**: The generated report is a single local HTML file with no external assets and a functional zero-JavaScript view.
- **SC-003**: Source documents remain byte-for-byte unchanged during capture and comparison.
- **SC-004**: The portable API works without OpenCode and becomes the only engine used by later phases.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 audit closure | Starting against unverified command state would break the approved workflow boundary | Keep implementation blocked while allowing documentation and fixture planning |
| Dependency | Seed validation fixtures | Algorithm work without expected outputs can encode misleading behavior | Establish minimal text and Markdown fixtures before diff implementation |
| Risk | Canonical model becomes format-specific | Later adapters would fork semantics or claim false equivalence | Keep format sidecars outside structural hashes and preserve fidelity warnings |
| Risk | HTML content escapes the security boundary | A local report could execute hostile source content | Escape all source text and carry the restrictive CSP contract from the first renderer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which repository location best preserves npm portability while allowing the OpenCode skill to consume the package locally?
- Which exact seed fixtures from phase 003 must land before core algorithm implementation begins?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Research synthesis: `../001-research-and-requirements/research/research.md`
- Validation and security phase: `../003-validation-security-and-quality-gates/spec.md`
