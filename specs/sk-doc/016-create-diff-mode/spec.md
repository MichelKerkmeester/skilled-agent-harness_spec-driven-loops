---
title: "Feature Specification: AI Document Diff Engine and sk-doc Create-Diff Mode"
description: "Phase parent for researching and defining a portable, local-first document diff engine surfaced through the sk-doc create-diff mode."
trigger_phrases:
  - "standalone document diff skill"
  - "AI document before and after"
  - "document diff without git"
  - "local HTML diff report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded six implementation phases from the completed research synthesis"
    next_safe_action: "Close phase 001 audit, then intake phases 002-003"
    blockers:
      - "Phase 001 still records a command-owned deep-loop state audit before production implementation"
    key_files:
      - "spec.md"
      - "001-research-and-requirements/research/research.md"
      - "002-core-diff-and-snapshot-mvp/spec.md"
      - "003-validation-security-and-quality-gates/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-research-preparation"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Which repository path should host the portable npm package?"
      - "Which measured fixture thresholds should become release blockers?"
      - "Will the optional OCR adapter pass its later go or no-go gate?"
    answered_questions:
      - "The primary artifact is a self-contained local HTML report."
      - "The comparison is semantic and structural, with explicit fidelity warnings."
      - "The core is portable and the OpenCode skill is an orchestration wrapper."
      - "Use TypeScript on Node.js 22+, with Node.js 24 LTS as the development default."
      - "Deliver the required product in phases 002 through 006; keep OCR conditional in phase 007."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Detailed requirements, decisions, tasks, validation, and continuity live in child phases.
-->

# Feature Specification: AI Document Diff Engine and sk-doc Create-Diff Mode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P1 |
| **Status** | Active — create-diff mode delivered (v1) via a self-contained embedded engine; see phase 006 and `001-research-and-requirements/decision-record.md` ADR-003 |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Track** | `skilled-agent-orchestration` |
| **Predecessor** | None |
| **Successor** | `002-core-diff-and-snapshot-mvp` |
| **Handoff Criteria** | Research-backed child contracts are scaffolded and strict-valid; production work starts only after the remaining phase 001 command audit closes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

AI-assisted document edits often happen outside a Git repository. The user can inspect the final file, but lacks a dependable before-versus-after view that explains what the AI added, removed, moved, or structurally changed.

### Purpose

Define a local-first skill and portable core that automatically preserves a baseline before an AI edit and generates a clear, self-contained review artifact afterward, without requiring Git or a hosted service.

> This parent stays lean. Phase 001 owns the research evidence; phases 002 through 007 own detailed implementation and gate contracts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Research-backed implementation for plain text, Markdown, HTML, DOCX, and text PDFs, with explicit capability and fidelity tiers.
- A deterministic typed document model, semantic and structural diffing, contextual move detection, and self-contained HTML review reports.
- Automatic local snapshots, explicit before and after fallback, retention, cleanup, integrity, permissions, and cross-platform state handling.
- A portable TypeScript API and CLI provided by the create-diff engine, surfaced as the create-diff nested child mode of the sk-doc parent hub.
- Fixture, security, privacy, accessibility, dependency, licensing, performance, and hostile-input gates.
- Conditional scanned-document OCR only after a measured go or no-go decision.

### Out of Scope

- Promising equal fidelity for every document format or treating extracted text as pixel-perfect layout.
- Cloud synchronization, collaborative review, telemetry, remote processing, or a hosted application.
- Replacing Git or a document-management system with unbounded version history.
- Cloud OCR, runtime language downloads, or making optional OCR a blocker for required v1 delivery.

### Aggregate File Scope

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research-and-requirements/` | Create | 001 | Level 3 research charter and deep-research handoff |
| `002-core-diff-and-snapshot-mvp/` | Create | 002 | Portable core, typed tree, text and Markdown, unified HTML, and basic snapshots |
| `003-validation-security-and-quality-gates/` | Create | 003 | Fixture corpus and measurable security, CSP, license, accessibility, and performance gates |
| `004-html-docx-and-move-detection/` | Create | 004 | Isolated HTML and DOCX adapters, richer report views, fidelity diagnostics, and move detection |
| `005-pdf-cli-and-cross-platform-state/` | Create | 005 | Text-PDF support, portable CLI, and safe cross-platform snapshot lifecycle |
| `006-opencode-skill-and-accessibility/` | Create | 006 | sk-doc create-diff nested child mode wrapper, automatic edit capture, fallback, and accessibility refinement |
| `007-optional-ocr-adapter/` | Create conditionally | 007 | Decision-first local OCR adapter with pinned assets and resource bounds |
| `008-fidelity-safety-a11y-hardening/` | Create | 008 | Post-review remediation: strict decode, allowlist safety gate, legend/scroll accessibility, and code-opencode script alignment |
| `009-create-diff-command/` | Create | 009 | The `/create:diff` slash command for OpenCode and Codex (full sibling command pattern) |
| `010-fluid-responsive-report/` | Create | 010 | Container-query fluid type/rhythm layer for the HTML report, tuned for IDE preview-pane widths |
| `015-multi-file-boundary-dividers/` | Create | 015 | Validated aggregate-file start/end bands that remain visible through collapsed context |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research-and-requirements/` | Architecture, capability tiers, evidence synthesis, and phase decomposition | Research complete; command-state audit pending |
| 2 | `002-core-diff-and-snapshot-mvp/` | Portable typed-tree core, text and Markdown, deterministic diff, unified HTML, and basic snapshots | Draft; blocked on phase 001 audit |
| 3 | `003-validation-security-and-quality-gates/` | Fixture corpus, hostile inputs, CSP, licenses, accessibility, and performance thresholds | Draft; seed fixtures may start with phase 002 intake |
| 4 | `004-html-docx-and-move-detection/` | Isolated HTML and DOCX adapters, contextual moves, side-by-side and fidelity views | Draft; gated by phase 003 |
| 5 | `005-pdf-cli-and-cross-platform-state/` | Text PDFs, lifecycle CLI, atomic state, locks, retention, and platform controls | Draft; gated by phases 003 and 004 contracts |
| 6 | `006-opencode-skill-and-accessibility/` | Thin sk-doc create-diff nested-mode wrapper, automatic capture, explicit fallback, and accessibility refinement | Implemented (v1) — self-contained embedded engine shipped (ADR-003); separate-package gating superseded |
| 7 | `007-optional-ocr-adapter/` | Offline OCR decision and optional bounded adapter | Conditional; go or no-go after phases 003 and 005 |
| 8 | `008-fidelity-safety-a11y-hardening/` | Post-review hardening: strict decode, allowlist validator, legend/scroll accessibility, code-opencode alignment | Complete |
| 9 | `009-create-diff-command/` | `/create:diff` command (router + presentation + auto/confirm YAML) for OpenCode and Codex | Complete |
| 10 | `010-fluid-responsive-report/` | Container-query fluid type/rhythm layer for the HTML report, tuned for IDE preview-pane widths | Complete |
| 15 | `015-multi-file-boundary-dividers/` | Semantic file-start and file-end bands for validated aggregate document pairs | Complete |

### Phase Transition Rules

> **v1 delivery note (ADR-003):** the create-diff mode ships a self-contained embedded engine (text, Markdown, HTML, DOCX, text-PDF), so phases 002–005 as a *separately-packaged npm engine* are superseded for v1 — their functional intent is realized in-skill at the delivered fidelity tiers. Richer-fidelity adapters and phase 007 OCR remain optional future work.

- Phase 001 remains command-owned. Close its recorded state audit before production implementation begins.
- After that audit, phase 002 implementation intake and phase 003 seed-corpus work may overlap, but phase 003 release gates must pass before rich adapters or OCR release.
- Phase 004 consumes the stable core and full phase 003 gates; phase 005 consumes the stable adapter and fidelity contracts.
- Phase 006 wraps only the frozen portable API and CLI from phases 002 through 005.
- Phase 007 is decision-first and optional. A no-go result is valid and does not block required v1 completion.
- Every child must pass strict validation at intake and closure. The parent map remains the coordination truth; detailed execution stays in children.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Packet preparation | Phase 001 research | Charter, non-goals, stop conditions, resource map, and metadata are present | Child strict validation and parent recursive strict validation |
| Phase 001 research | Phases 002 and 003 intake | Architecture, tiers, dependencies, risks, thresholds, and decomposition are synthesized; command-state audit closes | Canonical research synthesis, phase 001 strict validation, and audit evidence |
| Phase 002 core | Phase 003 full gates | Deterministic core, text and Markdown, unified report, and basic snapshots are fixture-testable | Phase 002 acceptance suite and seed corpus evidence |
| Phase 003 gates | Phase 004 rich adapters | Hostile-input, CSP, license, accessibility, performance, and fixture gates pass | Recorded corpus results and phase 003 checklist evidence |
| Phase 004 rich adapters | Phase 005 PDF and state | Adapter isolation, fidelity diagnostics, contextual moves, and report views are stable | HTML and DOCX fixture results plus direct contract tests |
| Phase 005 portable surface | Phase 006 sk-doc create-diff mode | CLI, API, state lifecycle, capability messages, and exit codes are frozen | Three-platform CLI and lifecycle evidence |
| Phases 003 and 005 | Phase 007 OCR decision | Accuracy, security, license, offline distribution, determinism, and resource evidence is complete | Recorded go or no-go decision against approved thresholds |
| Shipped report renderer | Phase 015 boundary dividers | Aggregate delimiter grammar is balanced and explicit; no command-file changes are required | Both report views, report validator, full renderer suite, and child strict validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which repository path and npm packaging boundary should host the portable core?
- Which measured corpus thresholds should be frozen as release blockers during phase 003 intake?
- Which OpenCode edit surfaces guarantee pre-write capture, and which require an explicit capture step?
- Does the optional OCR adapter pass every later go or no-go condition?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Research synthesis: `001-research-and-requirements/research/research.md`
- Core MVP: `002-core-diff-and-snapshot-mvp/spec.md`
- Validation gates: `003-validation-security-and-quality-gates/spec.md`
- HTML, DOCX, and moves: `004-html-docx-and-move-detection/spec.md`
- PDF, CLI, and state: `005-pdf-cli-and-cross-platform-state/spec.md`
- sk-doc create-diff mode: `006-opencode-skill-and-accessibility/spec.md`
- Conditional OCR: `007-optional-ocr-adapter/spec.md`
- Machine metadata: `description.json` and `graph-metadata.json`
