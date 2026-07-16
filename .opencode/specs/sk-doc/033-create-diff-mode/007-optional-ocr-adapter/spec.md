---
title: "Feature Specification: Conditional local OCR adapter"
description: "Add scanned-document support only if the validated security, license, distribution, accuracy, and performance gates prove that a bounded local OCR adapter is viable."
trigger_phrases:
  - "document diff OCR"
  - "scanned document comparison"
  - "local Tesseract adapter"
  - "conditional OCR phase"
importance_tier: "normal"
contextType: "implementation"
status: "conditional"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/007-optional-ocr-adapter"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded the conditional OCR phase"
    next_safe_action: "Evaluate the phase 003 and 005 evidence against the OCR go or no-go gate"
    blockers:
      - "OCR remains optional until security, licensing, distribution, performance, and accuracy gates pass"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-007-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do measured OCR results satisfy every release gate?"
    answered_questions:
      - "OCR must use local, pre-provisioned assets and must never download language data at runtime."
      - "A failed go or no-go decision leaves scanned documents explicitly unsupported rather than weakening v1."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Conditional local OCR adapter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 conditional scaffold; re-evaluate after go or no-go |
| **Priority** | P2 |
| **Status** | Conditional; implementation starts only after all OCR gates pass |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 7 |
| **Predecessor** | `../006-opencode-skill-and-accessibility/spec.md` |
| **Successor** | `../008-fidelity-safety-a11y-hardening/spec.md` (post-review remediation) |
| **Handoff Criteria** | Either ship a bounded local OCR capability with visible confidence and fidelity warnings, or record a no-go and keep scanned input explicitly unsupported |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a conditional extension, not a requirement for the core v1. It begins only after the fixture corpus, hostile-input controls, dependency and license audit, distribution plan, and text-PDF pipeline provide evidence that local OCR can be shipped honestly.

**Scope Boundary**: Render scanned PDF pages locally, run pre-provisioned OCR, map recognized text into the canonical model, and expose confidence and layout uncertainty. Do not add cloud OCR, runtime downloads, pixel diffs, or unsupported accuracy claims.

**Dependencies**:

- Phase 003 OCR-specific security, license, accessibility, and performance evidence.
- Phase 005 PDF rendering, resource limits, CLI, and snapshot lifecycle.
- A documented go or no-go decision with measured thresholds.

**Deliverables**:

- Go or no-go decision with evidence.
- Optional PDF.js page renderer and Tesseract.js worker integration if approved.
- Pre-provisioned language asset and license manifest.
- Page, region, confidence, reading-order, and fidelity diagnostics.
- Scanned-document fixtures, adversarial tests, and bounded resource behavior.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Scanned documents contain no reliable text layer, but OCR is expensive, error-prone, language-dependent, and easy to misrepresent. Shipping it without measured controls could produce misleading changes, unsafe resource use, unlicensed assets, or unexpected network access.

### Purpose

Make scanned-document comparison available only when a local, bounded, licensed, and transparent OCR adapter meets the research-defined release gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Formal go or no-go evaluation before implementation.
- Local page rendering through the approved PDF adapter boundary.
- Tesseract.js worker with pre-provisioned, checksummed language data.
- No runtime downloads and no network access.
- Per-page and per-region confidence, reading-order warnings, layout-loss warnings, and provenance.
- CPU, memory, file-size, page-count, pixel-count, worker-count, and timeout limits.
- Actionable unsupported-capability response when the adapter or language data is absent.
- Accuracy, determinism, malformed-input, decompression, and resource-exhaustion fixtures.

### Out of Scope

- Cloud OCR, telemetry, remote model calls, or asset downloads.
- Pixel, image, font, signature, annotation, or exact visual comparison.
- Silent correction of low-confidence text.
- Blocking required v1 delivery if the OCR gate produces a no-go decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Future optional OCR adapter | Create conditionally | Render pages, run local OCR, and emit canonical nodes plus diagnostics |
| Future language asset manifest | Create conditionally | Pin checksums, licenses, versions, and supported languages |
| Phase 003 fixture corpus | Modify | Add scanned, multilingual, low-quality, hostile, and resource-limit fixtures |
| Capability registry and docs | Modify conditionally | Report OCR as available, unavailable, or unsupported without ambiguity |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Make an evidence-backed go or no-go decision before product code. | The decision records measured accuracy, determinism, security, license, distribution, and performance results against approved thresholds. |
| REQ-002 | Keep all OCR execution and assets local. | Network monitoring records zero requests; missing assets produce an actionable unsupported-capability result. |
| REQ-003 | Enforce strict resource bounds. | Oversized, malformed, decompression-heavy, and slow fixtures stop within documented limits without corrupting state. |
| REQ-004 | Surface confidence and fidelity limitations. | Reports show page or region confidence and never present low-confidence OCR as exact source text. |
| REQ-005 | Preserve adapter isolation and deterministic output. | Removing OCR leaves required formats unchanged; repeated runs with pinned assets produce stable canonical output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Ship a complete dependency, language-data, checksum, and license manifest. | A clean offline install can verify every binary or data asset and its redistributable license. |
| REQ-007 | Cover representative scanned-document conditions. | The corpus includes multilingual text, skew, noise, columns, handwriting exclusion, low contrast, and repeated content with expected diagnostics. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The go or no-go decision is reproducible from recorded fixtures and metrics.
- **SC-002**: If approved, OCR runs offline with pinned assets and respects every resource limit.
- **SC-003**: Low-confidence text, reading-order ambiguity, unsupported languages, and layout loss are visible in the report.
- **SC-004**: If rejected, the required product remains complete and scanned input fails with simple, actionable guidance.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 and 005 evidence | No safe basis for OCR release | Keep the phase blocked until evidence is complete |
| Risk | OCR text appears authoritative | Users may approve changes that never existed in the scan | Display confidence and fidelity warnings beside affected content |
| Risk | Language assets trigger downloads or license issues | Local-only and distribution guarantees fail | Pre-provision, checksum, audit, and test offline |
| Risk | Malformed images exhaust resources | Local denial of service | Enforce page, pixel, memory, CPU, worker, and timeout ceilings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which languages and minimum confidence thresholds can pass the fixture corpus without overstating fidelity?
- Does the final distribution model permit pre-provisioning every required language asset and license notice?
- What measured page-time and memory ceilings preserve an acceptable local user experience?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Research synthesis: `../001-research-and-requirements/research/research.md`
- Quality and gate corpus: `../003-validation-security-and-quality-gates/spec.md`
- PDF, CLI, and state phase: `../005-pdf-cli-and-cross-platform-state/spec.md`
- Required OpenCode skill phase: `../006-opencode-skill-and-accessibility/spec.md`
