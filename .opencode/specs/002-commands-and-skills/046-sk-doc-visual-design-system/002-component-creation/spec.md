---
title: "SK-Doc-Visual Additional Section and Component Extraction"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: SK-Doc-Visual Additional Section and Component Extraction

## EXECUTIVE SUMMARY
This phase prepares implementation-ready Level 3 documentation for extracting additional section and component previews from `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html`.
The plan preserves current preview conventions (`../variables/*` and `../variables/template-defaults.js`) and scopes work to planning artifacts only.

**Key Decisions**: Source-anchored extraction with line citations, consistent file naming across section/component previews.

**Critical Dependencies**: Canonical source template and existing preview conventions in `.opencode/skill/sk-doc-visual/assets/sections/` and `.opencode/skill/sk-doc-visual/assets/components/`.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planning complete, implementation pending |
| **Created** | 2026-02-28 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Current extracted previews cover only a subset of the canonical README template, leaving twelve documentation sections and five reusable components without standalone previews.
Without a source-cited extraction plan, implementation can drift from `readme-guide-v2.html` and break established preview conventions.

### Purpose
Define a complete, evidence-backed implementation plan for expanding preview coverage while deferring HTML implementation work to the next phase.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Author Level 3 planning documentation in `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/`.
- Define extraction requirements and matrices for 12 sections and 5 components.
- Define implementation phases, task breakdown, verification gates, and ADR conventions.
- Create `memory/.gitkeep` and `scratch/.gitkeep`.

### Out of Scope
- Creating or modifying preview HTML files in `.opencode/skill/sk-doc-visual/assets/sections/`.
- Creating or modifying preview HTML files in `.opencode/skill/sk-doc-visual/assets/components/`.
- Creating `implementation-summary.md` before implementation completion.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/README.md` | Modify | Phase purpose and document map |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/spec.md` | Modify | Requirements and extraction matrix |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/plan.md` | Modify | Phased implementation and rollback |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/tasks.md` | Modify | Pending tasks grouped by phase |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/checklist.md` | Modify | Plan-stage verification status |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/decision-record.md` | Modify | ADR for extraction conventions |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/memory/.gitkeep` | Create | Preserve memory folder |
| `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/scratch/.gitkeep` | Create | Preserve scratch folder |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Section extraction targets must be fully enumerated. | `spec.md` includes all 12 required section IDs with source line citations and planned output file names. |
| REQ-002 | Component extraction targets must be fully enumerated. | `spec.md` includes `toc-link`, `site-nav-link`, `main-grid/sidebar shell`, `scroll-progress`, and `copy-code interaction contract` with source evidence. |
| REQ-003 | Planning-only boundary must be explicit. | `spec.md`, `plan.md`, and `tasks.md` state that no HTML implementation occurs in this phase. |
| REQ-004 | Existing preview conventions must be preserved. | Plan references shared head imports (`../variables/*`) and `../variables/template-defaults.js` from existing preview files. |
| REQ-005 | Level 3 docs must be complete without placeholders. | `README.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` contain no placeholder text. |
| REQ-006 | Phase validation must run after documentation updates. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation` executed and output captured. |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Implementation tasks must be granular and executable. | `tasks.md` contains actionable unchecked tasks for setup, extraction, file creation, and verification. |
| REQ-008 | ADR must define naming and extraction conventions. | `decision-record.md` includes accepted ADR with alternatives and rollback plan. |
| REQ-009 | Checklist must reflect plan-stage reality. | `checklist.md` keeps implementation checks pending and marks only planning evidence as complete. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: All required Level 3 planning documents exist in `002-component-creation` with no placeholders.
- **SC-002**: Extraction matrices include all requested sections/components with explicit source line citations.
- **SC-003**: Validation command executes against the phase folder and results are reported.
- **SC-004**: Plan clearly preserves current preview conventions and defers implementation work.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html` | High | Use line-cited extraction matrices tied to canonical source. |
| Dependency | Existing preview conventions in `assets/sections` and `assets/components` | Medium | Mirror import and script conventions from existing previews. |
| Risk | Source line drift after upstream template edits | Medium | Re-run source grep checks before implementation starts. |
| Risk | Scope creep into implementation during planning | Medium | Keep all implementation checklist items pending and explicitly out of scope in docs. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Maintainability
- **NFR-M01**: Every extraction target references canonical source lines.
- **NFR-M02**: Planned file naming is deterministic and follows existing asset naming conventions.

### Reliability
- **NFR-R01**: Documentation validates with Spec Kit validator for this phase path.

### Traceability
- **NFR-T01**: Checklist and ADR link back to requirement IDs and extraction tables.

## 8. EDGE CASES
### Source Edge Cases
- Section heading text may differ from section ID; section ID remains source of truth.
- Component behavior spans CSS, markup, and script; extraction notes must capture all three.

### Process Edge Cases
- If template lines shift before implementation, re-baseline matrix citations first.
- If a component has no standalone behavior in isolation, document adapter wrapper requirements before extraction.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | 6 planning docs + 17 extraction targets |
| Risk | 9/25 | Multi-surface extraction (CSS + markup + JS contracts) |
| Research | 17/20 | Requires source-line mapping and convention alignment |
| Multi-Agent | 5/15 | Single-agent planning workflow |
| Coordination | 8/15 | Depends on prior phase conventions and next implementation phase |
| **Total** | **54/100** | **Level 3** |

## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Extracted files diverge from canonical source structure | High | Medium | Require matrix and line references before implementation. |
| R-002 | Shared preview scaffolding is copied inconsistently | Medium | Medium | Enforce baseline from existing preview files and ADR naming convention. |
| R-003 | Plan-stage docs accidentally imply implementation completion | Medium | Medium | Keep tasks/checklist implementation items unchecked until execution phase. |

## 11. USER STORIES
### US-001: Implementation Engineer Preparation (Priority: P0)
**As a** maintainer of `sk-doc-visual`, **I want** a source-cited extraction plan, **so that** I can implement additional previews without reverse-engineering the README template again.

**Acceptance Criteria**:
1. **Given** this spec, **When** implementation starts, **Then** each target section/component maps to explicit source lines.
2. **Given** this spec, **When** file creation begins, **Then** naming and shared imports are already defined.
3. **Given** a review request, **When** the reviewer checks matrix rows, **Then** each row resolves to a concrete source citation.

### US-002: Reviewer Auditability (Priority: P1)
**As a** reviewer, **I want** clear planning boundaries and verification gates, **so that** I can distinguish planning completion from implementation completion.

**Acceptance Criteria**:
1. **Given** this phase output, **When** reviewing checklist state, **Then** implementation checks are still pending.
2. **Given** this phase output, **When** reviewing ADR, **Then** naming and extraction decisions are documented with alternatives.
3. **Given** this phase output, **When** planning handoff occurs, **Then** tasks are grouped and executable without additional discovery.

## 12. OPEN QUESTIONS
- None at plan stage; implementation can proceed once this plan is approved.
<!-- /ANCHOR:questions -->

## 13. EXTRACTION EVIDENCE MATRIX

### 13.1 Additional Section Targets
| # | Section ID | Source Line | Planned Preview File | Notes |
|---|------------|-------------|----------------------|-------|
| 1 | `spec-kit-documentation` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:608` | `.opencode/skill/sk-doc-visual/assets/sections/spec-kit-documentation-section.html` | Tables + validation automation blocks |
| 2 | `memory-engine` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:765` | `.opencode/skill/sk-doc-visual/assets/sections/memory-engine-section.html` | Includes pipeline and cognitive feature cards |
| 3 | `agent-network` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:864` | `.opencode/skill/sk-doc-visual/assets/sections/agent-network-section.html` | Agent table and routing narrative |
| 4 | `command-architecture` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:934` | `.opencode/skill/sk-doc-visual/assets/sections/command-architecture-section.html` | Command namespace tables |
| 5 | `skills-library` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1001` | `.opencode/skill/sk-doc-visual/assets/sections/skills-library-section.html` | Skill detection matrix |
| 6 | `gate-system` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1043` | `.opencode/skill/sk-doc-visual/assets/sections/gate-system-section.html` | Gate cards and execution flow |
| 7 | `code-mode-mcp` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1077` | `.opencode/skill/sk-doc-visual/assets/sections/code-mode-mcp-section.html` | Includes code-window interaction |
| 8 | `extensibility` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1135` | `.opencode/skill/sk-doc-visual/assets/sections/extensibility-section.html` | List-based extensibility guidance |
| 9 | `configuration` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1157` | `.opencode/skill/sk-doc-visual/assets/sections/configuration-section.html` | Provider cards + JSON snippet |
| 10 | `usage-examples` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1205` | `.opencode/skill/sk-doc-visual/assets/sections/usage-examples-section.html` | Two code-window examples |
| 11 | `troubleshooting` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1266` | `.opencode/skill/sk-doc-visual/assets/sections/troubleshooting-section.html` | Quick-fix table + diagnostics block |
| 12 | `related-documents` | `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1362` | `.opencode/skill/sk-doc-visual/assets/sections/related-documents-section.html` | Link cards and changelog grid |

### 13.2 Additional Component Targets
| Component | Source Evidence | Planned Preview File | Extraction Contract |
|-----------|-----------------|----------------------|---------------------|
| `toc-link` | CSS definition `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:105`; right-sidebar usage `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1422` | `.opencode/skill/sk-doc-visual/assets/components/toc-link.html` | Include base, hover, and active states with `::before` marker behavior. |
| `site-nav-link` | CSS definition `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:134`; left-sidebar usage `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:264` | `.opencode/skill/sk-doc-visual/assets/components/site-nav-link.html` | Include active state and icon slot variant. |
| `main-grid/sidebar shell` | Grid/sidebar CSS `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:62`; responsive breakpoints `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:83`; shell markup `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:256`; sidebars `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:259` and `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1418` | `.opencode/skill/sk-doc-visual/assets/components/main-grid-shell.html` | Demonstrate desktop, tablet, and mobile shell behavior. |
| `scroll-progress` | CSS and element `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:186` and `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:205`; update script `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1467` | `.opencode/skill/sk-doc-visual/assets/components/scroll-progress.html` | Include fixed top bar and width-update script contract. |
| `copy-code interaction contract` | Code-window button markup `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:323`; query selectors `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1506`; clipboard action `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html:1512` | `.opencode/skill/sk-doc-visual/assets/components/copy-code-interaction.html` | Preserve button aria label, icon swap, success class, and timeout reset behavior. |

### 13.3 Existing Preview Convention Baseline
| Convention | Evidence | Required Reuse |
|------------|----------|----------------|
| Shared variable imports | `.opencode/skill/sk-doc-visual/assets/sections/hero-section.html:8` | Keep `../variables/fluid-typography.css`, `colors.css`, `typography.css`, `layout.css` in new previews. |
| Template defaults script | `.opencode/skill/sk-doc-visual/assets/sections/hero-section.html:17` | Keep `<script src="../variables/template-defaults.js" defer></script>`. |
| Component preview scaffold parity | `.opencode/skill/sk-doc-visual/assets/components/code-window.html:8` and `.opencode/skill/sk-doc-visual/assets/components/code-window.html:17` | Use same head/bootstrap structure for newly added component previews. |

### 13.4 Extraction Evidence Commands Used
- `grep` pattern for section IDs in `readme-guide-v2.html` confirms all 12 requested sections and their line numbers.
- `grep` pattern for component selectors and behavior confirms CSS, markup, and script anchors for all 5 requested components.

## RELATED DOCUMENTS
- See `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` for execution sequencing and quality gates.
