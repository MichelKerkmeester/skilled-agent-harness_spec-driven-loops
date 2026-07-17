---
title: "Implementation Plan: Text PDF, lifecycle CLI, and cross-platform state"
description: "Implement the PDF adapter behind an isolated boundary, then harden the snapshot store and expose its lifecycle through a deterministic standalone CLI."
trigger_phrases:
  - "PDF adapter plan"
  - "snapshot lifecycle implementation"
  - "document diff CLI plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode/005-pdf-cli-and-cross-platform-state"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the PDF, CLI, and snapshot lifecycle scaffold"
    next_safe_action: "Wait for validation gates, then run implementation intake"
    blockers:
      - "Phase 003 gates and stable phase 004 contracts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-005-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Text PDF, lifecycle CLI, and cross-platform state

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x on Node.js 22+; Node.js 24 LTS development default |
| **Framework** | Portable npm package and command-line entry point |
| **Storage** | Local operating-system state directory with content-addressed immutable blobs and metadata |
| **Testing** | Unit, fixture, fault-injection, concurrency, CLI integration, and three-platform CI |

### Overview

Add PDF text extraction through an adapter that preserves page evidence and reports fidelity limits. In parallel, promote snapshots into an atomic, locked, content-addressed store with explicit lifecycle commands and deterministic retention.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 003 applicable security, license, and performance gates pass.
- [ ] Phase 002 canonical model and phase 004 adapter isolation contracts are stable.
- [ ] Text-PDF and filesystem failure fixtures have expected outcomes.
- [ ] CLI command, exit-code, and machine-output schemas are approved.

### Definition of Done

- [ ] PDF extraction, state lifecycle, and CLI acceptance criteria pass.
- [ ] Linux, macOS, Windows, race, crash, permission, and cleanup tests pass.
- [ ] No operation modifies a source document.
- [ ] Documentation and dependency records match shipped behavior.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Ports and adapters around the portable canonical core.

### Key Components

- **PDF adapter**: Extracts page text and position hints, then emits canonical nodes and diagnostics.
- **State resolver**: Chooses the private platform directory and validates paths and permissions.
- **Snapshot store**: Writes immutable blobs and metadata atomically with integrity hashes.
- **Lock and cleanup service**: Serializes per-document mutations and applies deterministic retention.
- **CLI facade**: Maps stable commands, options, diagnostics, and exit codes to the public core API.

### Data Flow

Capture resolves and validates the source path, hashes bytes, acquires the document lock, writes a temporary blob and metadata, flushes them, and commits through atomic rename. Compare loads verified snapshots or explicit files, runs extraction and diffing, and writes the self-contained report. Cleanup computes a locked deletion plan, displays it in dry-run mode, and deletes only validated state paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Canonical extractor registry | Routes format adapters | Register isolated PDF adapter | Adapter contract and removal tests |
| Snapshot API | Provides basic MVP capture | Add atomic persistence, locks, integrity, and lifecycle | Fault-injection and concurrency tests |
| CLI | Exposes portable user workflow | Freeze commands, schemas, and exit codes | End-to-end CLI tests |
| Security and fixture gates | Certify hostile and boundary behavior | Add PDF and filesystem cases | Phase 003 gate rerun |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Freeze CLI, state schema, retention, and failure semantics.
- [ ] Add text-PDF, path, permission, lock, crash, and cleanup fixtures.

### Phase 2: Implementation

- [ ] Implement deterministic page-aware extraction.
- [ ] Emit reading-order and fidelity diagnostics.
- [ ] Prove adapter isolation and resource limits.
- [ ] Implement platform resolution, private permissions, content addressing, atomicity, and locking.
- [ ] Implement retention, integrity, orphan recovery, and disk checks.
- [ ] Expose capture, compare, list, cleanup, status, and configuration commands.

### Phase 3: Verification

- [ ] Run three-platform, security, license, accessibility, and performance gates.
- [ ] Verify failure recovery and source immutability.
- [ ] Freeze user and machine-readable CLI documentation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | PDF ordering, retention selection, path policy, lock recovery, exit codes | Project test runner |
| Fixture | Text PDFs, repeated headers, columns, malformed files, ambiguous order | Phase 003 corpus |
| Fault injection | Partial writes, flush or rename errors, corruption, low disk, stale locks | Temporary isolated state roots |
| Integration | Every CLI command and explicit-pair fallback | Spawned CLI processes |
| Matrix | Linux, macOS, Windows with Node.js 22 and 24 | CI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 gates | Internal | Required | PDF and state features cannot release |
| Phase 004 adapter isolation | Internal | Required | PDF could couple format behavior into the core |
| pdf-parse or PDF.js selection | External | To confirm at intake | Adapter implementation and license footprint remain open |
| Platform CI | Infrastructure | Required | Cross-platform safety claims remain unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: PDF extraction is misleading, state writes are unsafe, cleanup selection diverges, or any supported platform gate fails.
- **Procedure**: Disable the PDF adapter and affected mutation commands through capability registration, preserve explicit-pair comparison and valid existing snapshots, and revert the versioned state writer without deleting user state.
<!-- /ANCHOR:rollback -->
