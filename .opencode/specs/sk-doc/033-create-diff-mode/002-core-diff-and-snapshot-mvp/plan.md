---
title: "Implementation Plan: Core document diff and snapshot MVP"
description: "Build the portable TypeScript core in test-driven slices: canonical model, text and Markdown adapters, deterministic diffing, safe unified HTML, and basic snapshots."
trigger_phrases:
  - "document diff MVP plan"
  - "canonical diff implementation"
  - "text markdown adapter plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/002-core-diff-and-snapshot-mvp"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the MVP implementation scaffold"
    next_safe_action: "Confirm package location and seed fixtures"
    blockers:
      - "Phase 001 command-owned audit closure"
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-002-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Package root selection"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Core document diff and snapshot MVP

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x on Node.js 22+; Node 24 LTS development default |
| **Libraries** | jsdiff, unified, remark-parse; Node crypto and filesystem primitives |
| **Storage** | Content-addressed local files; full platform lifecycle deferred to phase 005 |
| **Testing** | Node test runner or repository-standard TypeScript runner, deterministic fixtures, browser security checks |

### Overview

Build vertical slices from a frozen expected-output fixture to canonical extraction, diff actions, HTML rendering, and snapshot comparison. Keep the core independent of OpenCode so every later adapter and orchestration path uses the same deterministic interfaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 001 audit blocker is cleared.
- [ ] Package location and export boundary are approved.
- [ ] Seed text and Markdown fixtures define expected canonical and diff outputs.
- [ ] Runtime and dependency license constraints are recorded.

### Definition of Done

- [ ] All phase acceptance criteria and deterministic tests pass on Node 22 and 24.
- [ ] Generated reports make zero network requests and execute no source-controlled payload.
- [ ] Explicit-pair comparison and basic capture preserve source bytes.
- [ ] Phase documents reflect the implemented package paths and measured results.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Ports and adapters around a deterministic functional core.

### Key Components

- **Canonical model**: Typed tree, hashes, provenance, metadata, and fidelity diagnostics.
- **Text and Markdown adapters**: Convert supported inputs to the canonical model.
- **Diff engine**: Maps canonical nodes and produces stable change actions.
- **Report renderer**: Converts the diff model to escaped self-contained HTML.
- **Snapshot manager**: Captures immutable source bytes and resolves the baseline for comparison.

### Data Flow

Input paths are validated, source bytes are captured or read, adapters create canonical documents, the core computes a deterministic diff, and the renderer writes a new report without modifying either input.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Portable package | Does not yet exist | Create stable API, adapters, core, renderer, and basic state boundary | Unit and integration fixtures |
| Source filesystem | Holds user documents | Read only; snapshot writes go to owned state | Byte-hash source before and after |
| Generated HTML | Review artifact | Write escaped static report | Browser CSP and no-network checks |
| OpenCode skill | Future consumer | No implementation in this phase | Public API remains runtime-independent |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Select package root and configure Node 22/24 TypeScript builds.
- [ ] Freeze seed fixtures and expected canonical JSON.
- [ ] Pin mandatory MVP dependencies and commit the lockfile.

### Phase 2: Implementation

- [ ] Implement canonical types, normalization, occurrence identities, and hashes.
- [ ] Implement text and Markdown extraction.
- [ ] Implement deterministic add, delete, and replacement diff actions.
- [ ] Implement safe unified HTML rendering and basic snapshots.
- [ ] Expose public library and initial CLI interfaces.

### Phase 3: Verification

- [ ] Run deterministic repeatability and source-integrity tests.
- [ ] Verify the zero-JavaScript report and restrictive CSP foundation in a browser.
- [ ] Run the supported Node runtime matrix and record measured baseline performance.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Normalization, hashing, adapters, diff actions, escaping | TypeScript test runner |
| Golden fixture | Canonical JSON, diff model, and stable HTML output | Checked-in fixtures |
| Integration | Capture, explicit compare, report write | Temporary isolated state directory |
| Security smoke | XSS strings, CSP, no external requests | Headless browser or local browser harness |
| Cross-runtime | Node 22 and Node 24 | CI matrix |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 audit closure | Internal gate | Blocked | Production implementation cannot start |
| Seed fixtures | Internal gate | Planned | TDD and repeatability claims cannot be proved |
| jsdiff | External, BSD-3-Clause | Researched | Core diff implementation must be reconsidered if API or license verification changes |
| unified and remark-parse | External, MIT | Researched | Markdown structural extraction would need a replacement |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The canonical model cannot represent text and Markdown deterministically, the report security boundary fails, or the package becomes coupled to OpenCode.
- **Procedure**: Remove the unshipped package scaffold and generated fixtures, preserve the research packet, and revise the phase contract before restarting implementation.
<!-- /ANCHOR:rollback -->

