---
title: "Implementation Plan: Conditional local OCR adapter"
description: "Evaluate OCR against explicit gates first; only after a go decision, add a local isolated worker with pinned assets, visible confidence, and strict resource limits."
trigger_phrases:
  - "OCR adapter plan"
  - "scanned document implementation"
  - "OCR go no-go"
importance_tier: "normal"
contextType: "implementation"
status: "conditional"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/007-optional-ocr-adapter"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the decision-first optional OCR scaffold"
    next_safe_action: "Evaluate measured phase 003 and 005 evidence"
    blockers:
      - "Mandatory OCR release gates"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-007-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Conditional local OCR adapter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x on Node.js 22+ with optional Tesseract.js worker |
| **Framework** | Isolated optional adapter behind the portable capability registry |
| **Storage** | Existing snapshot state plus pre-provisioned checksummed language assets |
| **Testing** | OCR accuracy fixtures, offline checks, resource attacks, determinism, license audit, and adapter isolation |

### Overview

Run a formal gate before adding product code. If the gate passes, render bounded PDF pages locally, recognize text with pinned language assets, attach confidence and layout diagnostics, and feed only the resulting typed nodes into the existing canonical core.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 003 OCR fixture, security, license, accessibility, and performance evidence is complete.
- [ ] Phase 005 page rendering, resource bounds, and error contracts are stable.
- [ ] Supported languages, assets, checksums, licenses, and distribution path are documented.
- [ ] Accuracy, confidence, time, memory, and determinism thresholds are approved.

### Definition of Done

- [ ] The go or no-go decision and evidence are recorded.
- [ ] For a go, all functional, offline, resource, license, determinism, and fidelity gates pass.
- [ ] For a no-go, no OCR product dependency or runtime asset remains and unsupported guidance is verified.
- [ ] Required v1 behavior is unchanged in either outcome.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Optional isolated adapter with fail-closed capability registration.

### Key Components

- **Gate evaluator**: Compares measured evidence with approved release thresholds.
- **Page renderer**: Produces bounded raster pages through the phase 005 PDF boundary.
- **OCR worker pool**: Runs local recognition with pinned workers and language assets.
- **Confidence mapper**: Preserves page and region provenance, confidence, and reading-order warnings.
- **Capability registry**: Reports available, unavailable, or unsupported without changing core behavior.

### Data Flow

The capability check verifies adapter and language assets before extraction. Approved input is bounded, rendered page by page, processed by a limited worker pool, and mapped into canonical nodes with confidence sidecars. Timeouts, limits, absent assets, and low-confidence output fail closed or continue with explicit warnings according to the frozen contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| PDF adapter | Extracts text PDFs | Expose bounded page rendering for optional OCR | Contract tests and resource fixtures |
| Capability registry | Reports format support | Add conditional OCR state | Present, absent, and unsupported tests |
| Canonical extraction | Accepts adapter nodes | Consume OCR nodes and confidence sidecars only | Determinism and isolation tests |
| Reports | Display fidelity | Show confidence and layout uncertainty | Accessibility and fixture review |
| Packaging | Ships dependencies | Add pinned optional worker and language assets only after go | Offline install and license audit |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Measure accuracy, confidence, determinism, performance, security, licensing, and distribution.
- [ ] Record the decision and stop without product code on any failed mandatory gate.

### Phase 2: Implementation

- [ ] Add bounded page rendering and local OCR workers.
- [ ] Pin and verify language assets and licenses.
- [ ] Map text, provenance, confidence, and warnings into the canonical model.
- [ ] Register conditional capability and actionable absent-adapter behavior.
- [ ] Render confidence and fidelity diagnostics accessibly.
- [ ] Keep snapshots, diffing, and reports delegated to existing services.

### Phase 3: Verification

- [ ] Run offline, hostile, resource, multilingual, determinism, and isolation suites.
- [ ] Verify required v1 output remains unchanged with OCR absent.
- [ ] Publish simple capability and limitation guidance.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Gate | Accuracy, confidence, page time, memory, determinism, license | Recorded benchmark corpus |
| Fixture | Clean scans, noise, skew, columns, multilingual, repeated content | Phase 003 corpus |
| Security | Malformed files, decompression, pixel bombs, timeouts, worker failure | Bounded isolated test processes |
| Offline | Clean install and run with network disabled | Network monitor and package fixture |
| Isolation | Adapter present, absent, disabled, missing language | Capability and regression tests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 OCR evidence | Internal | Required | Automatic no-go until complete |
| Phase 005 PDF rendering | Internal | Required | No bounded input surface |
| Tesseract.js and language data | External | Conditional | OCR remains unsupported if license, packaging, or performance fails |
| Offline distribution path | Packaging | Conditional | Runtime downloads would violate product direction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any mandatory gate fails, OCR creates misleading output, resource ceilings are unreliable, or packaging requires network access.
- **Procedure**: Unregister and remove the optional adapter and assets, retain required format support, and return the documented unsupported-capability guidance for scanned documents.
<!-- /ANCHOR:rollback -->
