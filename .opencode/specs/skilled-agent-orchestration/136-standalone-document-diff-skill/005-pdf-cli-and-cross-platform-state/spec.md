---
title: "Feature Specification: Text PDF, lifecycle CLI, and cross-platform state"
description: "Add truthful text-PDF extraction and production snapshot lifecycle controls to the portable document diff core, including a stable CLI and secure operating-system state storage."
trigger_phrases:
  - "document diff PDF"
  - "snapshot lifecycle CLI"
  - "cross-platform document snapshots"
  - "document diff retention"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-standalone-document-diff-skill/005-pdf-cli-and-cross-platform-state"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded the research-backed PDF and lifecycle phase"
    next_safe_action: "Wait for validation gates and rich-format contracts, then run phase intake"
    blockers:
      - "Phase 003 gates must pass before this adapter and state lifecycle are released"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-005-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which PDF fixtures define acceptable reading-order fidelity for v1?"
    answered_questions:
      - "Text PDFs are supported with explicit fidelity warnings; OCR remains conditional and separate."
      - "Snapshot defaults are ten versions and thirty days, with dry-run cleanup."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Text PDF, lifecycle CLI, and cross-platform state

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 scaffold; re-evaluate at implementation intake |
| **Priority** | P1 |
| **Status** | Draft; gated by phase 003 and stable phase 004 contracts |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 7 |
| **Predecessor** | `../004-html-docx-and-move-detection/spec.md` |
| **Successor** | `../006-opencode-skill-and-accessibility/spec.md` |
| **Handoff Criteria** | Text PDFs compare truthfully and snapshot capture, inspection, retention, and cleanup work safely on supported operating systems |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase extends the portable core with limited text-PDF support and turns the initial snapshot mechanism into a safe, inspectable lifecycle available through the standalone CLI.

**Scope Boundary**: Extract available PDF text and basic position hints without promising visual fidelity. Add lifecycle and state management for snapshots. OCR, pixel comparison, and OpenCode orchestration remain outside this phase.

**Dependencies**:

- Phase 003 security, dependency, license, accessibility, and performance gates.
- Stable canonical model, fidelity diagnostics, and adapter isolation from phases 002 and 004.
- Node.js 22+ support and the selected PDF extraction libraries.

**Deliverables**:

- Text-PDF adapter with page provenance, reading-order heuristics, and explicit limitations.
- Stable capture, compare, explicit compare, list, cleanup, status, and configuration CLI.
- Platform-correct state directories and secure snapshot permissions.
- Content addressing, atomic writes, locking, retention, integrity checks, and dry-run cleanup.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

PDF text extraction and automatic snapshots both fail in subtle ways when their limitations are hidden. Reading order can be ambiguous, while state stored outside Git can race, leak sensitive content, follow hostile links, or grow without limits.

### Purpose

Provide honest text-PDF comparison and a predictable local CLI whose snapshot state is safe, recoverable, bounded, and portable across supported operating systems.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- PDF text extraction with page references, basic coordinates when available, deterministic ordering, and fidelity diagnostics.
- CLI commands for capture, compare, explicit before/after pairs, list, cleanup, status, and configuration.
- XDG state directories on Linux, Application Support on macOS, and LOCALAPPDATA on Windows.
- SHA-256 content addressing and deduplication.
- Temporary write, flush, atomic rename, and recoverable per-document locking.
- Default retention of ten versions and thirty days, configurable with dry-run cleanup.
- Owner-only permissions where supported, Windows ACL checks, integrity validation, orphan cleanup, and disk-space checks.
- Real-path normalization and refusal of unsafe symlink or reparse-point transitions.

### Out of Scope

- OCR for scanned PDFs; phase 007 owns the conditional adapter.
- Pixel-level or layout-perfect PDF comparison; v1 reports extraction uncertainty instead.
- OpenCode edit hooks and skill packaging; phase 006 owns the wrapper.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Future portable package PDF adapter | Create | Extract text PDFs into canonical nodes with page provenance |
| Future portable package snapshot store and CLI | Create or modify | Add lifecycle commands, platform paths, atomicity, locks, retention, and integrity checks |
| Phase 003 fixture corpus | Modify | Add text-PDF, state failure, permission, race, and cleanup fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Extract text PDFs into the canonical model without claiming visual fidelity. | Fixtures preserve page provenance, produce deterministic order, and surface reading-order or unsupported-content warnings. |
| REQ-002 | Store snapshots in platform-correct private state locations. | Linux, macOS, and Windows tests resolve the expected directories and reject unsafe permission or path conditions. |
| REQ-003 | Make capture atomic, content-addressed, and concurrency-safe. | Fault-injection and concurrent capture tests leave no partial committed snapshot, deduplicate identical content, and recover stale locks safely. |
| REQ-004 | Enforce bounded retention and safe cleanup. | Default ten-version and thirty-day policy is deterministic; dry-run lists exactly what cleanup would delete before mutation. |
| REQ-005 | Expose a stable standalone CLI. | Capture, compare, explicit compare, list, cleanup, status, and config commands return documented exit codes and machine-readable diagnostics. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Detect corruption, low disk space, and abandoned temporary state. | Injected failures produce actionable errors and never overwrite the source document or a valid previous snapshot. |
| REQ-007 | Keep PDF dependencies isolated and license-audited. | Removing the PDF adapter leaves core text and Markdown behavior intact; phase 003 dependency and license gates pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every text-PDF fixture produces deterministic output with page-level provenance and explicit fidelity warnings where required.
- **SC-002**: Snapshot crash, race, retention, permission, symlink, and integrity fixtures pass on Linux, macOS, and Windows CI.
- **SC-003**: Cleanup dry-run and actual cleanup select the same snapshot set, and neither operation touches source documents.
- **SC-004**: The CLI remains usable without OpenCode and preserves the portable public contract.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 quality gates | Unsafe dependencies or unbounded operations could reach local documents | Block release until applicable gates pass |
| Risk | Ambiguous PDF reading order | A structural diff could misrepresent the source | Preserve page and position evidence and show fidelity warnings |
| Risk | Cross-platform filesystem differences | Atomicity, permissions, and path checks may diverge | Test each supported OS and keep platform policies behind one state interface |
| Risk | Cleanup deletes valid evidence | Users could lose the only before state | Require deterministic selection, dry-run, locks, and integrity checks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which PDF fixture set defines the v1 boundary between supported reading order and an explicit fidelity warning?
- Which CLI output fields must be frozen for downstream skill automation before phase 006 begins?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Research synthesis: `../001-research-and-requirements/research/research.md`
- Quality gates: `../003-validation-security-and-quality-gates/spec.md`
- Rich-format contracts: `../004-html-docx-and-move-detection/spec.md`
- Conditional OCR adapter: `../007-optional-ocr-adapter/spec.md`
