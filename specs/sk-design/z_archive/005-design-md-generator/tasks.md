---
title: "Implementation Tasks: Reconstruct the sk-design md-generator mode"
description: "Task breakdown for the Level-2 md-generator reconstruction packet, covering source inventory, extraction and write contracts, validation boundaries, and documentation-only evidence."
trigger_phrases:
  - "md-generator reconstruction tasks"
  - "design extraction task list"
  - "DESIGN.md pipeline tasks"
  - "source faithful token extraction tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/005-design-md-generator"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful md-generator packet"
    next_safe_action: "Review packet against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/references/"
      - ".opencode/skills/sk-design/design-md-generator/assets/"
      - ".opencode/skills/sk-design/design-md-generator/backend/"
      - ".opencode/specs/sk-design/005-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-md-generator-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Implementation Tasks: Reconstruct the sk-design md-generator mode
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[P0]` — blocking source-fidelity or pipeline requirement.
- `[P1]` — required behavior or evidence that may be deferred only with an explicit owner decision.
- `[P2]` — optional enhancement or conditional evidence path.
- `[DOC]` — packet documentation task; it does not claim runtime execution.
- Task IDs are stable within this reconstruction packet and map to the source contract, not to a code change.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] [DOC] Confirm the request is measured extraction, validation, report, study, or re-extraction; route brief-only new direction work away from `md-generator`.
- [ ] T002 [P0] [DOC] Inventory the intact `SKILL.md`, all non-vendored reference and asset paths, the private extraction procedure, and the backend surface.
- [ ] T003 [P0] [DOC] Record the mandatory v3 format, writing style, and cardinal-rules resources plus conditional references selected by phase.
- [ ] T004 [P0] [DOC] Record Node 20+, `ts-node`, Playwright Chromium, source reachability, wait strategy, output allowlist, and overwrite guard as runtime prerequisites.
- [ ] T005 [P1] [DOC] Record run context fields: public mode, procedure or fallback, phase, source URL or artifact, output paths, readiness, references, and value-origin risks.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T101 [P0] [DOC] Map `extract.ts` argument parsing, HTTPS normalization, root supplementation, page/concurrency defaults, fast mode, interaction flags, waits, extra URLs, merge behavior, and output policy.
- [ ] T102 [P0] [DOC] Map the five viewport crawl, same-domain priority-page selection, lazy-load scrolling, cookie dismissal, transient HTTP handling, dropdown capture, bounded modal exploration, and screenshots.
- [ ] T103 [P0] [DOC] Map DOM, CSS, pseudo-element, gradient, SVG, font, logo, framework, icon, motion, dark-mode, interaction, and accessibility collection.
- [ ] T104 [P0] [DOC] Map color normalization and clustering, typography grouping, spacing base and scale, radii, shadow classification, component states, layouts, breakpoints, gradients, and stability layers.
- [ ] T105 [P0] [DOC] Map `tokens.json`, raw data, extraction report, screenshots, and conditional dark-mode artifact writes.
- [ ] T106 [P0] [DOC] Map deterministic v3 formatting for Colors, Spacing & Shapes, Surfaces, Quick Start, and `FACTS`; record the prose-only boundary.
- [ ] T107 [P0] [DOC] Map prompt fencing and source-origin rules for measured, brief-provided, inferred, and absent data.
- [ ] T108 [P0] [DOC] Map validator checks, scoring thresholds, critical failures, Quick Start fidelity, claims provenance, and conditional section rules.
- [ ] T109 [P1] [DOC] Map guided-run preflight and optional report, preview, proof, render-safety, and overwrite-safe paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T201 [P0] [DOC] Compare every packet `##` and `###` heading, marker, and anchor with the passing `004-design-audit` sibling.
- [ ] T202 [P0] [DOC] Confirm the reconstruction banner, metadata table, exact spec-folder value, four trigger phrases, and continuity fields in all four files.
- [ ] T203 [P0] [DOC] Confirm source references cite real paths and exclude vendored `node_modules` from the reading scope.
- [ ] T204 [P1] [DOC] Check that the packet distinguishes documented source behavior from unrun extraction, authoring, validation, report, preview, proof, and test execution.
- [ ] T205 [P1] [DOC] Check that open questions are limited to runtime inputs and do not invent a product decision.
- [ ] T206 [P1] [DOC] Record line counts and verify that only the four requested packet files were written.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All four packet files are present under `005-design-md-generator` and no metadata sidecars are created.
- [ ] The four files preserve the sibling’s exact section-header order, anchor names, template markers, and Level-2 markers.
- [ ] Source-faithful content covers live extraction, token stability, deterministic write, prose boundary, validation, optional evidence, safety, and rollback.
- [ ] The packet’s checklist remains honest about unrun runtime verification.
- [ ] The final handoff reports only the four written files and their line counts.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Intact source: `.opencode/skills/sk-design/design-md-generator/`
- Passing structural sibling: `.opencode/specs/sk-design/004-design-audit/`
<!-- /ANCHOR:cross-refs -->
