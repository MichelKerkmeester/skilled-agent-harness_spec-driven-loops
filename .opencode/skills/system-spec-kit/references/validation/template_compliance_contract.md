---
title: Template Compliance Contract
description: Canonical structural contract defining exact heading and anchor requirements for all spec folder documents at each documentation level (L1-L3+).
trigger_phrases:
  - "template compliance contract"
  - "heading anchor requirements"
  - "canonical structural contract"
  - "level contract headings"
importance_tier: important
contextType: implementation
version: 3.6.0.16
---

# Template Compliance Contract

Defines the exact heading hierarchy, required anchors, and content minimums for spec folder documents at each documentation level.

---

## 1. OVERVIEW

### Core Principle

> Every spec folder document must match its level-specific structural contract — the exact heading hierarchy, required anchors, and content minimums — as defined by this reference and enforced by `validate.sh`.

### Source of Truth

- **Generator:** `template-structure.js` `loadTemplateContract()` output (`scripts/utils/template-structure.js`)
- **Applies to:** `distributed-governance spec authoring` agent definitions across all CLIs

### When to Use

- **Before writing** any spec folder `.md` file — consult the contract for the target level
- **After writing** any spec folder `.md` file — run `validate.sh --strict`
- **When syncing** agent definitions after template changes — follow the Sync Protocol (§9)

---

## 2. ENFORCEMENT

After writing ANY spec folder `.md` file, immediately run:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER> --strict
```

Fix ALL errors before proceeding to the next file or workflow step.

---

## 3. LEVEL 1 CONTRACT

Level 1 covers 4 document types using the same core anchors as Level 2 but without L2 addenda sections.

### spec.md — `# Feature Specification: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## 7. OPEN QUESTIONS |

### plan.md — `# Implementation Plan: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| summary | ## 1. SUMMARY |
| quality-gates | ## 2. QUALITY GATES |
| architecture | ## 3. ARCHITECTURE |
| phases | ## 4. IMPLEMENTATION PHASES |
| testing | ## 5. TESTING STRATEGY |
| dependencies | ## 6. DEPENDENCIES |
| rollback | ## 7. ROLLBACK PLAN |

### tasks.md — `# Tasks: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

### implementation-summary.md — `# Implementation Summary`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

---

## 4. LEVEL 2 CONTRACT

MANDATORY: Every spec document MUST follow the exact anchor + header structure below.
Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.

### spec.md — `# Feature Specification: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## OPEN QUESTIONS (number varies by level; see note below) |

L2 addenda (after core): `nfr` (## L2: NON-FUNCTIONAL REQUIREMENTS), `edge-cases` (## L2: EDGE CASES), `complexity` (## L2: COMPLEXITY ASSESSMENT)

OPEN QUESTIONS numbering varies by level:
- Level 1: `## 7. OPEN QUESTIONS`
- Level 2: `## 10. OPEN QUESTIONS`
- Level 3: `## 12. OPEN QUESTIONS`
- Level 3+: `## 16. OPEN QUESTIONS`

### plan.md — `# Implementation Plan: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| summary | ## 1. SUMMARY |
| quality-gates | ## 2. QUALITY GATES |
| architecture | ## 3. ARCHITECTURE |
| phases | ## 4. IMPLEMENTATION PHASES |
| testing | ## 5. TESTING STRATEGY |
| dependencies | ## 6. DEPENDENCIES |
| rollback | ## 7. ROLLBACK PLAN |

L2 addenda (after core): `phase-deps` (## L2: PHASE DEPENDENCIES), `effort` (## L2: EFFORT ESTIMATION), `enhanced-rollback` (## L2: ENHANCED ROLLBACK)

### tasks.md — `# Tasks: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

### checklist.md — `# Verification Checklist: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| protocol | ## Verification Protocol |
| pre-impl | ## Pre-Implementation |
| code-quality | ## Code Quality |
| testing | ## Testing |
| fix-completeness | ## Fix Completeness |
| security | ## Security |
| docs | ## Documentation |
| file-org | ## File Organization |
| summary | ## Verification Summary |

### implementation-summary.md — `# Implementation Summary`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

---

## 5. LEVEL 3 CONTRACT

All Level 2 documents retain their contracts above. Level 3 adds:

### decision-record.md — `# Decision Record: [Title]`

Each ADR uses parametric anchors. Replace `NNN` with the ADR number (e.g., 001):

| Anchor Pattern | Required Content |
|----------------|-----------------|
| adr-NNN | Wraps the entire ADR section |
| adr-NNN-context | ## Context subsection |
| adr-NNN-decision | ## Decision subsection |
| adr-NNN-alternatives | ## Alternatives Considered subsection |
| adr-NNN-consequences | ## Consequences subsection |
| adr-NNN-five-checks | ## Five Checks subsection |
| adr-NNN-impl | ## Implementation Notes subsection |

These sub-anchors are template-provided and allowed by the contract engine (`buildDecisionRecordContract()` lists them in `allowedAnchors`), but they are not currently enforced as required (`requiredAnchors: []`). The order shown above matches the template scaffold.

---

## 6. LEVEL 3+ CONTRACT

Level 3+ retains the full Level 3 structural contract and adds a governance layer on top.

### Governance Expansion (Level 3+ only)

`spec-kit-docs.json` assigns Level 3+ the `governance-expansion` capability in addition to Level 3's `implementation`, `qa-verification`, and `architecture-decisions` presets. This activates Level-3+-only section gates across `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` (anchors gated with `"3+"` in their `sectionGates` arrays) that are absent at Level 3.

Other extended governance requirements (approval tracking, compliance checkpoints, extended checklists) are content-level concerns enforced by quality-audit.sh, not by structural template contracts.

---

## 7. CONTENT MINIMUMS

Beyond structural compliance, `validate.sh` enforces minimum content quantities.
Agents MUST meet these thresholds to avoid warnings:

| Metric | Level 1 | Level 2 | Level 3/3+ |
|--------|---------|---------|------------|
| spec.md H2 sections | ≥ 5 | ≥ 7 | ≥ 10 |
| plan.md H2 sections | ≥ 4 | ≥ 6 | ≥ 8 |
| Requirements (`REQ-*` in spec.md) | ≥ 3 | ≥ 5 | ≥ 8 |
| Acceptance scenarios (`**Given**` in spec.md) | ≥ 2 | ≥ 4 | ≥ 6 |

**Requirements format**: Use `REQ-001`, `REQ-002`, etc. in the Requirements section.
**Acceptance scenario format**: Use `**Given** [context], **When** [action], **Then** [outcome]` in the Success Criteria or Edge Cases section.

---

## 8. PHASE FOLDER ADDENDA

Phase **children** (e.g., `specs/NNN-name/001-phase/`) inherit the base contract for their level plus phase-specific addenda. These are enforced automatically by `validate.sh` via `inferPhaseSpecAddenda()` in `template-structure.js`. No additional agent knowledge is needed for children — follow the base contract and validate after writing.

Phase **parents** are NOT subject to Level 1–3+ structural contracts. When a folder qualifies as a phase parent (≥1 direct child matching `^[0-9]{3}-[a-z0-9-]+$` AND ≥1 such child has `spec.md` OR `description.json`), the parent uses the lean phase-parent template at `templates/manifest/phase-parent.spec.md.tmpl` exclusively and only requires the lean trio: `spec.md` + `description.json` + `graph-metadata.json`. Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live in the children, not at the parent. The validator's phase-parent branch in `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh`, and `check-template-headers.sh` automatically skips Level-N expectations when `is_phase_parent($folder)` returns true.

Phase-parent `spec.md` content discipline is enforced by the advisory `PHASE_PARENT_CONTENT` rule (severity: warn): the parent must avoid consolidation/merge/migration narratives. Required content is root purpose + sub-phase control file + what-needs-done. Migration history goes into an optional `context-index.md` rendered from `templates/manifest/context-index.md.tmpl` if needed. Tolerant policy preserves legacy phase parents that retain heavy docs.

---

## 8.5. DISCOVERING A LEVEL'S CONTRACT (DO NOT GUESS)

Before authoring (or fixing) a spec folder to pass `validate.sh --strict`, ask the contract engine directly rather than copying `templates/examples/level_N/` (whose anchor ids and section order **differ** from what the validator enforces). Two checks are independent: **required anchors** (presence) and **header order** — a doc can have every anchor yet still fail on ordering.

```bash
cd .opencode/skills/system-spec-kit/scripts/utils

# Required anchors + section gates for a level (the ANCHORS_VALID source of truth):
node template-structure.js level-contract 3

# Required headers + their ORDER + required anchors for ONE doc type:
node template-structure.js contract 3 spec.md

# Compare an in-progress doc against the contract (missing / out-of-order / extras):
node template-structure.js compare 3 spec.md <abs-path-to>/spec.md all
```

Notes that bite if ignored:
- **Two sources, both must pass.** Required anchors come from `templates/manifest/spec-kit-docs.json` (`levels.<N>.sectionGates`); required-header *order* comes from `template-structure.js` against `templates/manifest/<doc>.md.tmpl`. They are checked separately.
- **Section numbering is cosmetic** — the checker strips a leading `N. ` before matching, so renumbering headers never fixes (or breaks) order; only the relative sequence matters.
- **Level-3 spec.md ordering gotcha:** `OPEN QUESTIONS` comes LAST (after `RISK MATRIX` and `USER STORIES`), even though the `questions` anchor is listed earlier in the gate set.
- **decision-record.md** needs an `adr-001` wrapper anchor enclosing the per-ADR sub-anchors (`adr-001-context/-decision/-alternatives/-consequences/-five-checks/-impl`).
- Put the maintained `_memory.continuity` frontmatter block in `implementation-summary.md` when that file exists; `spec.md` is the fallback host only when the implementation summary is absent. Resume reads the continuity tier from `implementation-summary.md`, so do not add stale continuity blocks to plan, tasks, or checklist files.
- If a header looks correct yet still flags as out-of-order with the same message repeated, the file likely has hidden duplicated content — overwrite the whole doc with one clean write instead of chasing edits.

---

## 9. SYNC PROTOCOL

When templates in `templates/manifest/` change:

1. Run the relevant template and validation tests for the changed doc type
2. Update this file with the new headers/anchors
3. Update any distributed-governance spec-authoring flow definitions that embed compact contracts
4. Bump the `version` and `last_synced` fields in the Version History below
5. Run `validate.sh` on a sample spec folder to confirm the updated contract is correct

---

## 10. VERSION HISTORY

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-22 | Initial creation from template-structure.js contract output |
| 1.1.0 | 2026-03-25 | Aligned to skill reference template; relocated to references/validation/ |

---

## 11. RELATED RESOURCES

### References
- [validation_rules.md](./validation_rules.md) — Complete rule reference for all validation checks
- [phase_checklists.md](./phase_checklists.md) — Priority-based checklists per phase
- [path_scoped_rules.md](./path_scoped_rules.md) — Path scoping for validation rules
- [decision_format.md](./decision_format.md) — Standard format for documenting decisions

### Scripts
- [validate.sh](../../scripts/spec/validate.sh) — Validation orchestrator enforcing these contracts
- [template-structure.js](../../scripts/utils/template-structure.js) — Contract extraction engine; run `level-contract`, `contract`, or `compare` (see §8.5) to discover required anchors + header order instead of guessing

### Templates
- [template_guide.md](../templates/template_guide.md) — Template usage and composition rules
