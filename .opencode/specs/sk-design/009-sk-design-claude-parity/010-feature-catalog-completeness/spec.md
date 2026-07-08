---
title: "Feature Specification: Phase 010 — Feature Catalog and Snippet Completeness"
description: "Level 2 specification for planning sk-doc-conformant feature_catalog/ packages for the sk-design hub and its four uncataloged modes, plus a completeness audit of the one existing catalog."
trigger_phrases:
  - "feature catalog completeness"
  - "sk-design feature catalog"
  - "procedure card system catalog"
  - "phase 010"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-agent"
    recent_action: "Authored 18 feature_catalog files across 4 packages; 0 validator issues."
    next_safe_action: "Complete: no further action needed for Phase 010."
---
# Feature Specification: Phase 010 — Feature Catalog and Snippet Completeness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — planning and implementation both closed |
| **Created** | 2026-07-06 |
| **Phase Folder** | `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/` |
| **Parent Packet** | `.opencode/specs/sk-design/009-sk-design-claude-parity/` |
| **Writable Scope** | Phase 010 documentation, plus the five `.opencode/skills/sk-design/**/feature_catalog/**` packages named in the Planned Catalog Package Layout table below. Scope was extended from documentation-only to implementation by explicit operator decision after this spec was first authored (see the note under REQ-005 in §4) |
| **Depends On** | Sequenced after `009-readme-alignment/` in the phase roadmap (inferred from phase ordering, not a verified hard gate); no README content from that phase was read to author this plan |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../009-readme-alignment/spec.md |
| **Successor Phase** | ../011-manual-testing-playbook-alignment/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only one of the six `sk-design` packages — `design-md-generator` — has a `feature_catalog/` package (`design-md-generator/feature_catalog/feature_catalog.md`, 7 categories). The parent hub and four of the five public modes (`design-interface`, `design-foundations`, `design-motion`, `design-audit`) have shipped real, verified capabilities with no discoverable capability inventory: the hub's manager-shell contract (context-first intake, visible plan, proof gates, verifier cadence, transport-vs-taste separation from Phase 002) and the private procedure-card system (14 cards across 5 owners from Phase 003) exist only in `SKILL.md` prose and `shared/procedure_card_schema.md`, not in a stable, per-feature reference an operator or agent can cite. The one existing catalog also predates the Phase 003/004 procedure-card layer and has not been audited against it, so its completeness is unverified.

### Purpose
Plan — without implementing — a complete set of sk-doc-template-conformant `feature_catalog/` packages: new packages for the hub and the four uncataloged modes, and an audit-and-augment plan for the existing `design-md-generator` catalog. This phase defines the exact root/category/feature-file layout, the source evidence each planned entry will cite, and the acceptance criteria a later implementation phase must satisfy, so that work can proceed without re-deriving scope.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan a new hub-level `feature_catalog/` package under `.opencode/skills/sk-design/feature_catalog/` documenting the manager-shell contract (Phase 002) and the private procedure-card system (Phase 003) as capabilities.
- Plan new `feature_catalog/` packages for `design-interface`, `design-foundations`, `design-motion`, and `design-audit`.
- Plan an audit-and-augment pass for the existing `design-md-generator/feature_catalog/` package: verify its 7 categories against current `SKILL.md`/README capability lists and identify the concrete completeness gap (no entry for the mode's private procedure card).
- Use `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` (root scaffold) and `feature_catalog_snippet_template.md` (per-feature scaffold) as the authoring contract for every planned file.
- Define category directory numbering (`NN--category-name`) and per-feature filenames for all six packages so a later implementation phase has an unambiguous file list.
- Name the acceptance/verification command for planned files (`validate_document.py` auto-detects `*/feature_catalog/*` paths as document type `feature_catalog`).
- Keep every planned entry in "current reality" language — shipped behavior only, no packet/phase-number references inside catalog prose.

### Out of Scope
- **Superseded by operator decision (2026-07-06 remediation):** this phase originally deferred `feature_catalog/` file creation to a future implementation phase. The operator explicitly decided to finish the implementation inside this phase instead of reverting it. All 18 planned/audited files across `design-foundations`, `design-motion`, `design-audit`, and the `design-md-generator` augmentation are now written, template-conformant, and validated (see §5 Success Criteria and `implementation-summary.md`). The hub and `design-interface` packages were already completed correctly in an earlier out-of-band session and were left untouched by this remediation.
- Editing `.opencode/skills/sk-design/SKILL.md`, any mode `README.md`/`SKILL.md`, `mode-registry.json`, `hub-router.json`, `procedures/**`, or `shared/**`.
- Editing `.opencode/skills/sk-doc/**` templates or scripts.
- Editing `.opencode/commands/design/**` (design command asset refactor is Phase 013).
- Editing the parent `009-sk-design-claude-parity/spec.md`, sibling phase folders, `external/**`, or `research/**`.
- Dispatching sub-agents or using nested Task execution.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 010 scope, requirements, success criteria, and planned catalog layout |
| `plan.md` | Create | Planning-phase execution plan, quality gates, dependencies, and rollback |
| `tasks.md` | Create | Audit, drafting, and verification task breakdown |
| `checklist.md` | Create | P0/P1/P2 evidence gates for this planning phase |
| `description.json` | Create (generated) | Phase metadata for memory/search discovery, generated last |
| `graph-metadata.json` | Create (generated) | Phase graph metadata and dependency linkage, generated last |
| `.opencode/skills/sk-design/feature_catalog/**` | Already complete (out-of-band, untouched by this remediation) | Hub-level catalog: manager-shell + procedure-card-system categories |
| `.opencode/skills/sk-design/design-interface/feature_catalog/**` | Already complete (out-of-band, untouched by this remediation) | Aesthetic-direction process, delivery gates, procedure cards |
| `.opencode/skills/sk-design/design-foundations/feature_catalog/**` | Done this remediation | Token system, adaptation/data discipline, procedure cards (6 files) |
| `.opencode/skills/sk-design/design-motion/feature_catalog/**` | Done this remediation | Restraint gate/choreography, build cards, procedure cards (5 files) |
| `.opencode/skills/sk-design/design-audit/feature_catalog/**` | Done this remediation | Findings-first review, AI-tell catalog, procedure cards (5 files) |
| `.opencode/skills/sk-design/design-md-generator/feature_catalog/**` | Done this remediation (audit + augment) | Added `08--procedure-cards/md-generator-procedure-card-inventory.md` and a new root "9. PROCEDURE CARDS" section; confirmed existing 7 categories unmodified in substance (9 files total) |

### Planned Catalog Package Layout

This table is the file-list contract a later implementation phase must satisfy. Every root catalog file is new except the `design-md-generator` root, which already exists and only needs an added section plus a new category.

| Package | Root Catalog Path | Planned Category Dirs | Planned Feature Files | Source Evidence |
|---------|--------------------|------------------------|------------------------|------------------|
| Hub | `.opencode/skills/sk-design/feature_catalog/feature_catalog.md` | `01--manager-shell/`, `02--procedure-card-system/` | `context-first-intake-and-visible-plan.md`, `proof-gates-and-verifier-cadence.md`, `transport-vs-taste-separation.md`, `procedure-card-schema-and-selection.md`, `procedure-card-inventory.md` | `.opencode/skills/sk-design/SKILL.md` §2, §7; `.opencode/skills/sk-design/shared/procedure_card_schema.md` |
| `design-interface` | `.opencode/skills/sk-design/design-interface/feature_catalog/feature_catalog.md` | `01--aesthetic-direction-process/`, `02--delivery-gates/`, `03--procedure-cards/` | `two-pass-grounding-and-critique.md`, `register-and-dials-intake.md`, `mechanical-delivery-gates.md`, `interface-writing-rules.md`, `interface-procedure-card-inventory.md` | `design-interface/README.md` §2, §4; `design-interface/procedures/*.md` (6 cards) |
| `design-foundations` | `.opencode/skills/sk-design/design-foundations/feature_catalog/feature_catalog.md` | `01--token-system/`, `02--adaptation-and-data/`, `03--procedure-cards/` | `oklch-color-and-token-system.md`, `typography-and-spacing-scale.md`, `context-adaptation-matrix.md`, `data-visualization-discipline.md`, `foundations-procedure-card-inventory.md` | `design-foundations/README.md` §2, §4; `design-foundations/procedures/*.md` (3 cards) |
| `design-motion` | `.opencode/skills/sk-design/design-motion/feature_catalog/feature_catalog.md` | `01--restraint-gate-and-choreography/`, `02--build-cards/`, `03--procedure-cards/` | `motion-restraint-gate.md`, `choreography-and-reduced-motion.md`, `motion-fill-in-cards.md`, `motion-procedure-card-inventory.md` | `design-motion/README.md` §2, §3; `design-motion/procedures/interaction_states_pass.md` (1 card) |
| `design-audit` | `.opencode/skills/sk-design/design-audit/feature_catalog/feature_catalog.md` | `01--findings-first-review/`, `02--ai-tell-catalog/`, `03--procedure-cards/` | `findings-first-report-and-scoring.md`, `register-gated-severity.md`, `ai-fingerprint-tell-catalog.md`, `audit-procedure-card-inventory.md` | `design-audit/README.md` §2, §4; `design-audit/procedures/*.md` (2 cards) |
| `design-md-generator` (existing) | `.opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md` (update) | Add `08--procedure-cards/` alongside existing `01`-`07` | Add `md-generator-procedure-card-inventory.md`; add root "9. PROCEDURE CARDS" section | `design-md-generator/procedures/design_system_extraction.md` (1 card) |

Planned new-file total: 28 new files across the five new packages (5 root catalogs + 23 per-feature files: hub 5, `design-interface` 5, `design-foundations` 5, `design-motion` 4, `design-audit` 4), plus 1 updated root catalog and 1 new feature file in the existing `design-md-generator` package — 29 new files overall across all six packages.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every `sk-design` package with zero `feature_catalog/` today gets a named, path-explicit planned package in this spec | Planned Catalog Package Layout table lists an exact root path, category dirs, and feature files for the hub plus `design-interface`, `design-foundations`, `design-motion`, and `design-audit` |
| REQ-002 | Every planned package cites sk-doc's canonical templates as its authoring contract | `plan.md` names `feature_catalog_template.md` (root scaffold) and `feature_catalog_snippet_template.md` (per-feature scaffold) for every planned file, with no invented template family |
| REQ-003 | Hub catalog entries trace to real, already-shipped source files | Planned Catalog Package Layout cites `.opencode/skills/sk-design/SKILL.md` sections and `shared/procedure_card_schema.md` as hub source evidence |
| REQ-004 | Existing `design-md-generator` catalog is audited against the Phase 003/004 procedure-card addition before being declared complete | `tasks.md` includes an explicit audit task comparing the existing catalog's 7 categories against `procedures/design_system_extraction.md`, records the missing-procedure-card gap, and names the planned fix |
| REQ-005 | ~~No `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` file is edited by this planning phase~~ Superseded 2026-07-06: operator explicitly authorized this phase to implement the five planned/audited packages instead of deferring them | `checklist.md` CHK-004 records the superseding decision; `git status` confirms only the five named `feature_catalog/**` package paths were written under `.opencode/skills/sk-design/**`, no `.opencode/skills/sk-doc/**` file was touched, and the already-complete hub/`design-interface` packages show zero changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each planned mode catalog maps to that mode's real shipped procedure cards | Planned Catalog Package Layout's per-mode feature-file list includes a procedure-card inventory feature naming the real card count and filenames found under that mode's `procedures/` directory |
| REQ-007 | Planned catalogs avoid packet-history references | `plan.md` states every planned feature entry will describe shipped behavior only, with no "Phase 002 added X" or "Phase 003 introduced Y" phrasing in catalog prose |
| REQ-008 | Verification commands are named for future implementation | `plan.md`/`tasks.md` name `validate_document.py <path> --type feature_catalog` per planned file plus a root-to-feature link-resolution check |
| REQ-009 | Rollback path is non-destructive first | `plan.md` names diff/status review before any destructive rollback and requires explicit approval before removing planned-but-already-authored content |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Result |
|-----------|--------|
| **SC-001** Phase 010 docs and metadata exist and validate as a Level 2 child packet | Met; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict` passes with Errors: 0 after metadata regeneration |
| **SC-002** All four uncataloged `sk-design` mode packages have a real, populated `feature_catalog/` package (the hub was already complete out-of-band) | Met; `find <mode>/feature_catalog -type f` shows 6 files for `design-foundations`, 5 for `design-motion`, and 5 for `design-audit`, each matching the Planned Catalog Package Layout table exactly, with 0 `validate_document.py` issues per file |
| **SC-003** The existing `design-md-generator` catalog's completeness gap (missing procedure-card entry) is closed | Met; `08--procedure-cards/md-generator-procedure-card-inventory.md` added (9 files total in the package) and root `feature_catalog.md` gained a new "9. PROCEDURE CARDS" section; sections 1-8 and categories 01-07 left unmodified in substance |
| **SC-004** Every new/updated file cites sk-doc's canonical feature_catalog templates as its authoring contract | Met; every new root catalog and per-feature file follows `feature_catalog_template.md`/`feature_catalog_snippet_template.md` shape (frontmatter, numbered H2 root sections, OVERVIEW/HOW IT WORKS/SOURCE FILES/SOURCE METADATA per-feature shape) and `validate_document.py` (auto-detect) reports 0 issues on all 18 new/changed files |
| **SC-005** Hub and `design-interface` packages (already complete out-of-band) are untouched by this remediation | Met; `git status --short` shows no modification (`M`) entries for `.opencode/skills/sk-design/feature_catalog/**` or `.opencode/skills/sk-design/design-interface/feature_catalog/**` — both remain untracked-but-unmodified from before this session |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc` feature_catalog templates remain stable | Planned file shapes could drift from the authoring contract before implementation | Cite exact template paths and re-read them at implementation time before drafting any file |
| Dependency | Phase 001-005 `sk-design` capabilities remain as currently documented | If hub/mode content changes before implementation, planned catalog entries could describe stale behavior | Implementation phase must re-read `SKILL.md`, README files, and `procedures/*.md` immediately before drafting, not rely solely on this spec's evidence |
| Risk | Catalog scope creep — documenting hypothetical future features instead of shipped behavior | Catalogs become inaccurate or misleading | Enforce the "current reality" rule from `feature_catalog_template.md` §6 in every planned entry |
| Risk | The private procedure-card system is `sk-design`-local and not yet reflected in `sk-doc` canon | A future author could invent a nonstandard template for procedure cards instead of using the existing feature_catalog contract | Plan explicitly reuses the generic `feature_catalog_snippet_template.md` shape and cites `shared/procedure_card_schema.md` as source evidence rather than proposing a new template type |
| Risk | Six catalog packages implemented in parallel could drift in category-numbering convention | Inconsistent packages across the `sk-design` family | This spec defines the layout for all six packages up front so one later phase (or a shared task) can implement them consistently |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Every planned catalog entry maps to a real source file already present in the repository (README, SKILL.md section, or `procedures/*.md` card); no planned entry describes unshipped behavior.
- **NFR-T02**: Category and feature-file names in the Planned Catalog Package Layout table are treated as the binding file list for the future implementation phase.

### Maintainability
- **NFR-M01**: Category directory numbering (`NN--category-name`) stays stable across all six packages so future readers recognize the pattern regardless of which mode they are in.
- **NFR-M02**: Per-feature filenames carry no numeric prefix, per `feature_catalog_template.md` §3, so root-catalog reordering never requires a file rename.

### Safety
- **NFR-S01**: No `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` file is edited while authoring this phase's documentation.
- **NFR-S02**: Rollback requires non-destructive diff/status inspection first and explicit approval before destructive recovery.

### Verification
- **NFR-V01**: Strict spec validation runs for this phase packet after documentation is authored and again after metadata regeneration.
- **NFR-V02**: Future implementation must run `validate_document.py --type feature_catalog` per new file and confirm root-to-feature link resolution before claiming any package complete.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **A planned mode gains or loses a procedure card before implementation**: Re-run the Glob-based card inventory in `procedures/` for that mode immediately before drafting the procedure-card feature file; do not trust this spec's card count if it is stale.
- **The hub or a mode's `SKILL.md` changes shape before implementation**: Treat this spec's cited sections as historical evidence only; re-read the live file and reconcile before writing.
- **`design-md-generator`'s existing catalog already covers procedure cards by the time implementation starts**: Confirm via Glob/Grep before adding a duplicate category; update the finding in this spec's Scope section instead of creating a redundant file.

### Error Scenarios
- **Validator fails on a future implementation file**: Fix only the file inside the owning package's `feature_catalog/` directory, then re-run `validate_document.py --type feature_catalog` before touching any other file.
- **A planned category ends up with only one feature file**: That is acceptable per the template ("Each category groups related features"); do not force an artificial second feature to fill the category.
- **Root catalog link does not resolve to a per-feature file**: Treat this as a completeness failure and fix the link or the missing file before claiming the package done.

### Concurrent Operations
- **Sibling phase 009 or 013 changes `sk-design` README/command content concurrently**: Preserve that work as unrelated context; this phase only plans catalog structure and does not depend on reading 009's or 013's output to be internally consistent.
- **Another session begins implementing one of the six planned packages**: Treat the Planned Catalog Package Layout table as the shared contract; do not silently rename categories or files without updating this spec.
- **Unrelated worktree changes appear**: Preserve them and keep Phase 010 writes scoped to this folder only.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- ~~Should the six planned packages be implemented in one follow-on phase or split per-package across several phases?~~ **Resolved 2026-07-06**: implemented in one continuous remediation pass inside this same phase, by explicit operator decision.
- ~~Should `design-md-generator`'s procedure-card category use `08--` or be renumbered?~~ **Resolved 2026-07-06**: implemented as `08--procedure-cards/`, preserving the existing `01`-`07` category numbers as originally defaulted.
- Does `009-readme-alignment` change any mode's README capability language in a way that should be re-cited before catalog entries are drafted? **Not re-verified in this remediation pass**; the README content read while authoring the four remediated packages (`design-foundations`, `design-motion`, `design-audit`, `design-md-generator`) was the live file state at authoring time. If `009-readme-alignment` changes that language afterward, a future pass should re-diff the cited README sections against the catalog prose.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Predecessor Phase**: `../009-readme-alignment/`
- **Successor Phase**: `../011-manual-testing-playbook-alignment/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Feature Catalog Templates**: `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md`, `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md`
- **Existing Catalog Under Audit**: `.opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md`
- **Procedure Card Schema**: `.opencode/skills/sk-design/shared/procedure_card_schema.md`

<!-- /ANCHOR:related-docs -->
