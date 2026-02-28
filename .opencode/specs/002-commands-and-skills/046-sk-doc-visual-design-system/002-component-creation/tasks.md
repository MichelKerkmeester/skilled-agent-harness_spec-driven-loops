---
title: "Tasks"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: SK-Doc-Visual Additional Extraction (Phase 002)

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Task format: `T### [P?] Description (target path)`.
All tasks below are intentionally pending because this is plan stage only.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Re-verify section and component source line anchors in `readme-guide-v2.html`.
- [ ] T002 Confirm scaffold conventions from existing previews (`../variables/*` and `template-defaults.js`).
- [ ] T003 Create implementation branch checkpoint for phase 002 extraction work.
- [ ] T004 [P] Build per-target extraction notes for all 12 sections and 5 components.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Section Extraction
- [ ] T005 Create `spec-kit-documentation-section.html` from source section `#spec-kit-documentation`.
- [ ] T006 Create `memory-engine-section.html` from source section `#memory-engine`.
- [ ] T007 Create `agent-network-section.html` from source section `#agent-network`.
- [ ] T008 Create `command-architecture-section.html` from source section `#command-architecture`.
- [ ] T009 Create `skills-library-section.html` from source section `#skills-library`.
- [ ] T010 Create `gate-system-section.html` from source section `#gate-system`.
- [ ] T011 Create `code-mode-mcp-section.html` from source section `#code-mode-mcp`.
- [ ] T012 Create `extensibility-section.html` from source section `#extensibility`.
- [ ] T013 Create `configuration-section.html` from source section `#configuration`.
- [ ] T014 Create `usage-examples-section.html` from source section `#usage-examples`.
- [ ] T015 Create `troubleshooting-section.html` from source section `#troubleshooting`.
- [ ] T016 Create `related-documents-section.html` from source section `#related-documents`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Component Extraction
- [ ] T017 Create `toc-link.html` with base, hover, and active state parity.
- [ ] T018 Create `site-nav-link.html` with active and icon-capable variants.
- [ ] T019 Create `main-grid-shell.html` covering `.main-grid`, `.sidebar`, and `.right-sidebar` layout behavior.
- [ ] T020 Create `scroll-progress.html` with fixed top bar style and scroll width updates.
- [ ] T021 Create `copy-code-interaction.html` that preserves `.code-window` button query contract and clipboard behavior.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: File Creation and Wiring
- [ ] T022 Ensure every new preview file includes `../variables/*` imports.
- [ ] T023 Ensure every new preview file includes `../variables/template-defaults.js`.
- [ ] T024 [P] Apply naming consistency checks across all newly created files.
- [ ] T025 Keep source-derived IDs/classes unchanged unless documented in ADR addendum.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification
- [ ] T026 Open every new section preview and perform visual smoke checks.
- [ ] T027 Open every new component preview and confirm state/interaction parity.
- [ ] T028 Verify copy-code interaction feedback and reset behavior.
- [ ] T029 Verify scroll-progress width updates on page scroll.
- [ ] T030 Update checklist evidence and complete all required P0/P1 items.
- [ ] T031 Create `implementation-summary.md` after implementation is complete.
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All implementation tasks T001-T031 marked `[x]`.
- [ ] No `[B]` tasks remain.
- [ ] Section/component outputs match source structure and interactions.
- [ ] Checklist evidence complete for completion claim.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Specification source: `spec.md`.
- Implementation sequencing: `plan.md`.
- Verification gates: `checklist.md`.
- Convention rationale: `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
