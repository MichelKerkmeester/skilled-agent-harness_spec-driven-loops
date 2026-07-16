---
title: "Feature Specification: Validation, security, and quality gates"
description: "Create the fixture corpus and enforce security, CSP, dependency-license, accessibility, and performance gates before rich document adapters are allowed."
trigger_phrases:
  - "document diff validation corpus"
  - "document diff security gate"
  - "document diff license audit"
  - "document diff performance budget"
importance_tier: "critical"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/003-validation-security-and-quality-gates"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded the cross-cutting quality-gate phase"
    next_safe_action: "Freeze the seed corpus and gate definitions before rich-adapter work"
    blockers:
      - "Phase 001 command-owned audit closure"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-003-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which provisional performance budgets must be adjusted after the first measurements?"
    answered_questions:
      - "Rich adapters cannot start until security and license gates pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Validation, security, and quality gates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 scaffold; upgrade before high-risk implementation |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 7 |
| **Predecessor** | `../002-core-diff-and-snapshot-mvp/spec.md` |
| **Successor** | `../004-html-docx-and-move-detection/spec.md` |
| **Handoff Criteria** | The corpus, security, license, accessibility, and performance gates are executable and green for the surfaces they unlock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase turns research hypotheses into enforceable product gates. A seed subset should be prepared alongside phase 002 setup; the full corpus and gates must pass before phases 004, 005, or 007 accept untrusted rich documents.

**Scope Boundary**: Own tests, fixtures, security hardening, audits, and measured budgets. Do not add new format capabilities except test harness adapters needed to exercise existing surfaces.

**Dependencies**:

- Phase 001 research corpus and provisional metrics.
- The phase 002 core interfaces and first report renderer.
- Authoritative license files for direct and transitive dependencies.

**Deliverables**:

- At least 33 fixture pairs across research-defined categories.
- Hostile-input and XSS battery.
- CSP hash, zero-network, and zero-JavaScript checks.
- Direct and transitive dependency license gate.
- Keyboard, screen-reader, contrast, RTL/CJK, and no-color-only checks.
- Measured quality, performance, memory, and report-size baselines.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Rich document extraction can hide changes, manufacture noise, or execute hostile content. The research defines targets, but implementation must convert those targets into reproducible fixtures and hard gates before higher-risk adapters are admitted.

### Purpose

Create the evidence system that proves the diff is useful, local, secure, accessible, license-compatible, and fast enough for each capability tier.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Basic text, Markdown, HTML, DOCX, PDF, move/replacement, normalization, edge, negative, hostile-container, accessibility, and OCR-confidence fixtures.
- Expected canonical models, expected diff actions, expected fidelity warnings, and false-positive labels.
- Input limits, magic-byte checks, MIME verification, password-protection rejection, parser isolation tests, and resource-limit tests.
- Output escaping, unsafe-URI stripping, restrictive CSP, fixed-script hash verification, and no-network tests.
- WCAG 2.1 AA-oriented keyboard, semantics, skip navigation, visible focus, color-independent indicators, and Unicode/RTL/CJK checks.
- Lockfile and transitive-license audit for allowed MIT, BSD, Apache-2.0, and DOMPurify dual-license choices.
- p95 extraction, diff, report, peak-memory, and report-size measurements.

### Out of Scope

- Adding HTML, DOCX, PDF, or OCR production support; later adapter phases own that work.
- Weakening a gate to make an adapter pass without evidence.
- Claiming rich-format fidelity percentages not measured by the corpus.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Future `create-diff` fixture and test roots | Create | Corpus, expected outputs, security battery, accessibility checks, performance harness, and license audit |
| Future package configuration and CI | Create/Modify | Supported runtimes, test matrices, audit commands, and thresholds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Build the research-defined fixture corpus with frozen expected results. | At least 33 pairs cover every listed category and identify intended changes, accepted warnings, and noise. |
| REQ-002 | Enforce the four-layer security model. | Hostile inputs cannot execute content, escape parser limits, access external resources, or enter reports unescaped. |
| REQ-003 | Audit CSP and fixed inline-script hashing. | The exact bundled script runs only with its generated SHA-256 CSP hash; modified script bytes are blocked. |
| REQ-004 | Establish dependency and license gates. | Direct and transitive audits report no disallowed licenses and preserve required notices. |
| REQ-005 | Establish accessibility gates. | Essential review works by keyboard and without JavaScript, and changes are not communicated by color alone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Measure quality and noise. | Change detection is at least 95% and false positives are at most 5% on the accepted corpus, or thresholds are revised with evidence before adapter work. |
| REQ-007 | Measure provisional performance budgets. | p95 time, peak memory, and report size are recorded by tier; any budget revision is explicit and evidence-backed. |
| REQ-008 | Make the gates reusable by every later phase. | Rich-adapter and OCR test jobs consume the same corpus, security, license, accessibility, and performance contracts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every research-defined format tier has positive, negative, fidelity-warning, and hostile-input evidence.
- **SC-002**: Source-controlled payloads produce zero script execution and zero network requests.
- **SC-003**: License, accessibility, and performance results are machine-readable and block regression.
- **SC-004**: Phases 004, 005, and 007 cannot start until their applicable gates are green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 interfaces | Full integration gates need a runnable core | Prepare fixture metadata and expected outputs early, then bind to the core |
| Risk | Corpus overfits implementation | Tests can reward one parser's quirks instead of user-visible correctness | Define expected semantic changes and fidelity warnings independently of library output |
| Risk | Provisional budgets are unrealistic | Good behavior could be rejected or slow behavior normalized | Record hardware and fixture size; revise thresholds only from measured evidence |
| Risk | License audit misses transitive packages | Distribution could ship incompatible obligations | Audit lockfile closure and notices, not only direct package manifests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which CI runners represent the macOS, Linux, and Windows performance baseline without excessive variance?
- Which accessibility checks require manual screen-reader evidence in addition to automation?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Research corpus and budgets: `../001-research-and-requirements/research/research.md`
- Core MVP: `../002-core-diff-and-snapshot-mvp/spec.md`
- First gated rich adapters: `../004-html-docx-and-move-detection/spec.md`
