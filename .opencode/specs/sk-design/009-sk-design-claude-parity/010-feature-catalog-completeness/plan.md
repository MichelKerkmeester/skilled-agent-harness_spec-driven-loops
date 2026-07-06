---
title: "Implementation Plan: Phase 010 — Feature Catalog and Snippet Completeness"
description: "Level 2 plan for auditing sk-design's feature-catalog coverage and defining the file layout for five new feature_catalog/ packages plus one completeness fix, all authored template-first against sk-doc's canonical scaffolds."
trigger_phrases:
  - "implementation plan"
  - "feature catalog completeness"
  - "sk-design feature catalog"
  - "phase 010"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-agent"
    recent_action: "Closed all Definition of Done items after the catalog remediation."
    next_safe_action: "Complete: no further action needed for Phase 010."
---
# Implementation Plan: Phase 010 — Feature Catalog and Snippet Completeness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `sk-design` documentation completeness: `feature_catalog/` packages under the hub and its five mode packets |
| **Primary Area** | `.opencode/skills/sk-design/feature_catalog/` (new) and each mode's `feature_catalog/` (new for 4 modes, audited for `design-md-generator`) |
| **Spec Level** | 2 |
| **Testing** | Strict spec validation for this phase; `sk-doc`'s `validate_document.py --type feature_catalog` named as the future per-file gate |
| **Mutation Policy** | Documentation-only; no `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` write in this phase |

### Overview
This plan defines how Phase 010 audits the current feature-catalog coverage across all six `sk-design` packages and produces a binding file-layout contract — root catalog path, category directories, and per-feature filenames — for the five packages that need new or augmented catalogs. No catalog file is written by this phase; the plan hands a ready-to-execute file list and source-evidence map to whichever session implements it next.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 010 documentation scope is explicit and confined to this folder for this authoring task.
- [x] Current feature-catalog coverage across all six `sk-design` packages has been inspected (one existing package found, five missing).
- [x] `sk-doc`'s feature_catalog templates have been read and are cited as the authoring contract.
- [x] Each mode's shipped capability surface (README, SKILL.md, `procedures/*.md`, `references/*.md`) has been reviewed to ground the catalog entries in real source files.
- [x] Phase 009 (`readme-alignment`) dependency resolved as non-blocking: README content was read live at authoring time for this remediation; see `spec.md` §9 Open Questions for the residual re-diff note if 009 changes wording afterward.

### Definition of Done
- [x] Every one of the five uncataloged/audited packages has a binding root/category/feature file list in `spec.md`, and the four fully-new packages (`design-foundations`, `design-motion`, `design-audit`) plus the `design-md-generator` augmentation now exist on disk exactly matching that list.
- [x] The existing `design-md-generator` catalog's completeness gap (missing procedure-card entry) is closed: `08--procedure-cards/md-generator-procedure-card-inventory.md` exists and root `feature_catalog.md` has a new "9. PROCEDURE CARDS" section.
- [x] Every new/updated file cites `feature_catalog_template.md` or `feature_catalog_snippet_template.md` as its authoring contract (frontmatter + numbered-section shape verified against both DONE reference packages).
- [x] `tasks.md` and `checklist.md` reflect the completed, implementation-included state with evidence citations (superseding the original planning-only scope, per the operator's 2026-07-06 decision).
- [x] Strict spec validation passes for this phase folder after metadata regeneration (`Errors: 0`, see `checklist.md` CHK-020).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Root-catalog-plus-per-feature-file pattern, per `sk-doc`'s `feature_catalog_template.md`: each package gets exactly one `feature_catalog.md` root document (frontmatter, H1 intro, numbered all-caps H2 sections summarizing each capability area) plus one per-feature reference file per catalog entry, grouped under numbered category directories (`NN--category-name/`). This phase plans that layout for six packages; it does not implement any of them.

### Key Components
- **Hub package**: Documents the parent-hub manager-shell contract (Phase 002) and the private procedure-card system (Phase 003) as two categories.
- **Per-mode packages** (`design-interface`, `design-foundations`, `design-motion`, `design-audit`): Each documents that mode's distinctive process/capability areas plus a procedure-card inventory category naming its owned cards.
- **Existing package audit** (`design-md-generator`): Confirms the 7 existing categories are current and adds the one identified gap — a procedure-card category — without disturbing the existing 7.
- **Source evidence map**: Every planned entry in `spec.md`'s Planned Catalog Package Layout table cites a real, already-shipped source file (README section, `SKILL.md` section, or `procedures/*.md` card) so implementation does not have to re-derive scope.

### Data Flow
1. Inventory current feature-catalog coverage across all six `sk-design` packages (Glob for `feature_catalog/` directories).
2. Read `sk-doc`'s root and per-feature templates to fix the authoring contract.
3. Read the hub `SKILL.md` and `shared/procedure_card_schema.md` for hub-catalog evidence.
4. Read each mode's `README.md`, `SKILL.md`, and `procedures/*.md` for that mode's catalog evidence.
5. Read the existing `design-md-generator` catalog and compare its 7 categories against current capability evidence and the Phase 003 procedure-card addition.
6. Draft the binding Planned Catalog Package Layout table in `spec.md`, naming every root path, category dir, feature file, and source citation.
7. Run strict spec validation for this phase, then regenerate `description.json`/`graph-metadata.json` last.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory current `feature_catalog/` coverage across all six `sk-design` packages (hub + `design-interface` already complete out-of-band; `design-foundations` had a root file only; `design-motion`/`design-audit` were empty category shells; `design-md-generator` had categories 01-07 only).
- [x] Read `feature_catalog_template.md` and `feature_catalog_snippet_template.md`.
- [x] Read hub `SKILL.md`-derived `feature_catalog.md` and `design-interface/feature_catalog.md` as the DONE reference shape.
- [x] Read each remaining mode's README/SKILL.md/`procedures/*.md`/references and the existing `design-md-generator` catalog.

### Phase 2: Implementation (Remediation Authoring)
- [x] Author the `design-foundations` package: 5 new per-feature files under `01--token-system/`, `02--adaptation-and-data/`, `03--procedure-cards/` (root `feature_catalog.md` already existed).
- [x] Author the `design-motion` package: new root `feature_catalog.md` + 4 new per-feature files under `01--restraint-gate-and-choreography/`, `02--build-cards/`, `03--procedure-cards/`.
- [x] Author the `design-audit` package: new root `feature_catalog.md` + 4 new per-feature files under `01--findings-first-review/`, `02--ai-tell-catalog/`, `03--procedure-cards/`.
- [x] Author the `design-md-generator` completeness fix: new `08--procedure-cards/md-generator-procedure-card-inventory.md` plus a new root "9. PROCEDURE CARDS" section (sections 1-8 and categories 01-07 left unmodified in substance).
- [x] Cite real source evidence (README/SKILL.md/references/procedures paths) in every new file's Source Files sections.

### Phase 3: Verification
- [x] Confirm every new root entry maps 1:1 to a per-feature file (18 new/changed files match the spec.md layout table exactly; verified via `find <package>/feature_catalog -type f`).
- [x] Confirm prose uses "current reality" phrasing with no packet/phase-number references.
- [x] Confirm only the five named `feature_catalog/**` package paths were written under `.opencode/skills/sk-design/**`, and no `.opencode/skills/sk-doc/**` file was touched (`git status --short` reviewed; hub/`design-interface` show zero modifications).
- [x] Run `validate_document.py` (auto-detect) on all 18 new/changed files — 0 issues on every file.

### Phase 4: Verification and Handoff
- [x] Run strict spec validation for this phase folder.
- [x] Update `checklist.md` P0/P1/P2 rows with evidence.
- [x] Reconcile `spec.md`/`plan.md`/`tasks.md`/`checklist.md` to the completed state and author `implementation-summary.md`.
- [x] Record handoff criteria for Phase 011 (`manual-testing-playbook-alignment`).
- [x] Regenerate `description.json`/`graph-metadata.json` last, then re-run strict validation.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required metadata | `validate.sh --strict` |
| Template-contract review | Every planned file cites a real sk-doc template path | Manual review of `spec.md` Planned Catalog Package Layout against `feature_catalog_template.md`/`feature_catalog_snippet_template.md` |
| Source-evidence review | Every planned entry maps to a real, existing source file | Read/Grep/Glob against cited `README.md`/`SKILL.md`/`procedures/*.md` paths |
| Completeness-gap review | The existing `design-md-generator` catalog's gap is real and correctly scoped | Compare its 7 categories against `procedures/design_system_extraction.md` and current `SKILL.md` capability list |
| Per-file validation gate (run for this remediation) | Validation for each new/changed catalog file | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <path>` (auto-detect; the CLI has no literal `--type feature_catalog` choice — per-feature files auto-detect as `feature_catalog`, root catalogs auto-detect as `readme`). Result: 0 issues on all 18 new/changed files. |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc` feature_catalog templates | Documentation contract | Read and cited in this phase | Planned file shapes would be unverified against the canonical scaffold |
| Current `sk-design` hub/mode capability evidence | Evidence | Read in this phase (Phase 001-005 closed state) | Planned catalog entries could target stale behavior if hub/mode content changes before implementation |
| `009-readme-alignment` | Roadmap sequencing | Not verified in this phase; folder does not exist yet in the repository | Catalog entries may need to reconcile README capability language once that phase lands, but this plan does not block on it |
| Existing `design-md-generator/feature_catalog/` | Audit target | Read and compared against current evidence in this phase | A stale audit finding could misdirect the planned fix |
| Strict spec validation | Documentation | Required after write and after metadata regeneration | Structural errors must be fixed or reported before this phase is considered ready for approval |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A reviewer finds the planned layout inconsistent with sk-doc's template contract, a planned entry cites a source file that does not exist, or any write touched `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` during this documentation-only phase.
- **Procedure**: Stop; keep worktree state unchanged; revise or remove only the affected rows in this phase's `spec.md`/`plan.md`/`tasks.md`/`checklist.md` after explicit approval; preserve unrelated user and sibling-phase work.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Coverage Inventory ──> Template + Evidence Read ──> Layout Drafting ──> Verification ──> Metadata + Handoff
        │                                                                                    │
        └──────────── implementation of any package waits for this contract ────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Coverage Inventory | This phase's own read pass | Template + Evidence Read |
| Template + Evidence Read | Coverage Inventory | Layout Drafting |
| Layout Drafting | Template + Evidence Read | Verification |
| Verification | Layout Drafting | Metadata + Handoff |
| Metadata + Handoff | Verification | Future implementation phase(s) for the six planned/audited packages |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (coverage inventory + reads) | Low | 30-50 minutes |
| Implementation (layout drafting) | Medium | 60-100 minutes |
| Verification | Low | 20-35 minutes |
| Verification and Handoff | Low | 20-35 minutes |
| **Total** | | **2.2-3.7 hours for this planning phase** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Current feature-catalog coverage across all six packages is read before drafting.
- [ ] sk-doc's root and per-feature templates are read before drafting.
- [ ] Every planned entry's source-evidence file is confirmed to exist.
- [ ] Non-destructive rollback path is named.
- [ ] This phase's writable scope excludes `.opencode/skills/sk-design/**` and `.opencode/skills/sk-doc/**`.

### Rollback Procedure
1. **Immediate**: Stop drafting and preserve current worktree state.
2. **Document**: Record which invariant failed — template mismatch, missing source evidence, wrong writable-scope, or a stale completeness-gap finding.
3. **Preserve**: Avoid stash/reset/revert until unrelated work ownership is clear.
4. **Recover**: Revise or remove only the affected planning rows after approval.
5. **Re-verify**: Re-run strict spec validation before resuming.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes can be removed by deleting this phase folder; no other file is touched by this phase, so no further reversal is needed.

<!-- /ANCHOR:l2-rollback -->
