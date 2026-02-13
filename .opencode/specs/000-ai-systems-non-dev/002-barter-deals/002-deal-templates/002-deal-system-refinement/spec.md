# Barter Deal Templates — Deal System Refinement Specification

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Owner** | Michel Kerkmeester |
| **Created** | 2026-02-07 |
| **Last Updated** | 2026-02-07 |
| **Revision Note** | v1.0.0 — Initial specification for Deal System Refinement. Addresses 22 issues across P0/P1/P2 priorities discovered during cross-system analysis. |
| **Documentation Level** | Level 3+ (16 sections) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Metadata](#2-metadata)
3. [Problem and Purpose](#3-problem-and-purpose)
4. [Scope](#4-scope)
5. [Requirements](#5-requirements)
6. [Success Criteria](#6-success-criteria)
7. [Risks and Dependencies](#7-risks-and-dependencies)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Edge Cases](#9-edge-cases)
10. [Complexity Assessment](#10-complexity-assessment)
11. [Risk Matrix](#11-risk-matrix)
12. [User Stories](#12-user-stories)
13. [Approval Workflow](#13-approval-workflow)
14. [Compliance Checkpoints](#14-compliance-checkpoints)
15. [Stakeholder Matrix](#15-stakeholder-matrix)
16. [Change Log](#16-change-log)

---

## Executive Summary

The Barter Deal Templates system (v1.0, built in `001-initial-creation`) has 4 critical blockers, 9 high-priority gaps, and 9 medium-priority improvements identified through a 10-agent cross-system analysis. Critical issues include broken file cross-references that prevent the AI from loading knowledge base files, inconsistent DEAL dimension definitions between System Prompt and Standards, missing EUR values in Brand Context, and empty operational directories that will cause the export protocol to fail on first use. This refinement brings the system into alignment with the LinkedIn Pieter v0.130 and LinkedIn Nigel v0.100 systems, adds missing quality validation infrastructure (per-dimension scoring floors, tiered thresholds, self-correction diagnostics), and expands content coverage across industries and deal edge cases.

**Key Decisions:**
- Harmonize HVR across all Barter AI systems to eliminate divergence (ADR-001)
- Add per-dimension minimum floors to DEAL scoring to prevent one strong dimension from masking weaknesses (ADR-002)
- Adopt tiered validation thresholds scaled by deal complexity (ADR-003)
- Add self-correction diagnostic matrix for systematic failure mode resolution (ADR-004)
- Standardize file naming convention across all Barter AI systems (ADR-005)

**Critical Dependencies:**
- LinkedIn Pieter v0.130 HVR as the authoritative source for hard blocker harmonization
- LinkedIn Nigel v0.100 scoring framework as reference for per-dimension minimums and tiered thresholds
- Completion of 001-initial-creation phases 4-5 is NOT required (this refinement can proceed independently)

---

## 2. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 (4 critical blockers must be resolved before system is usable) |
| **Status** | Draft |
| **Created** | 2026-02-07 |
| **Parent Spec** | `001-initial-creation` (v1.1.0, phases 1-3 complete, phases 4-5 pending) |
| **Branch** | `002-deal-system-refinement` |

---

## 3. Problem and Purpose

### Problem Statement

The Barter Deal Templates system built in `001-initial-creation` has 4 critical blockers that prevent reliable operation: the AGENTS.md and README.md reference files using a `DT -` prefix (e.g., `DT - System Prompt.md`) while actual filenames use `Barter deals -` prefix (e.g., `Barter deals - System Prompt.md`), causing every routing instruction to fail. The export protocol references directories that exist but are empty with no persistence mechanism. Brand Context has EUR values stripped (showing `...` where amounts should be). The DEAL scoring dimensions are defined inconsistently between the System Prompt (D=Description, E=Expectations, A=Appeal, L=Legitimacy) and Standards.md (D=Description quality, E=Effectiveness, A=Authenticity, L=Listing quality), creating scoring ambiguity.

Beyond blockers, the system diverges significantly from sibling Barter AI systems (LinkedIn Pieter v0.130, LinkedIn Nigel v0.100) in HVR enforcement, scoring granularity, and validation methodology, creating an inconsistent quality baseline across the ecosystem.

### Purpose

Resolve all critical blockers so the Deal Templates system is operationally functional, harmonize quality standards with sibling Barter AI systems, and add missing validation infrastructure (per-dimension scoring floors, tiered thresholds, self-correction diagnostics) to match the sophistication of the LinkedIn systems.

---

## 4. Scope

### In Scope

- Fix 4 P0 critical blockers (cross-references, directories, EUR values, DEAL dimensions)
- Harmonize HVR with LinkedIn Pieter/Nigel systems (hard blockers, phrase blockers, UK English)
- Add per-dimension minimum floors and tiered validation thresholds to DEAL scoring
- Add self-correction diagnostic matrix and revision guidance by score band
- Add tone alignment checkpoint for marketplace authenticity
- Expand industry modules from 5 to 10+ verticals
- Add failing deal template examples alongside passing ones
- Add edge cases for multi-brand, non-EUR, and digital-only scenarios
- Update market data with freshness dates and Dutch-specific benchmarks
- Add template fields for timeline, shipping, content approval, exclusivity, geography, minimum followers
- Update all 12 files in the knowledge base directory

### Out of Scope (with Reasons)

| Exclusion | Reason |
|-----------|--------|
| Multi-language support (Dutch/English) | Deferred per DR-014 in 001-initial-creation; requires separate design effort |
| Event/subscription deal types | Deferred from initial creation; insufficient template examples available |
| Platform API integration | Infrastructure dependency outside content system scope |
| Completion of 001-initial-creation phases 4-5 | Independent work tracked in that subfolder |
| Barter Copywriter v0.821 modifications | Upstream system; changes there require separate spec |

### Files to Change

| # | Path | Change Type | Description |
|---|------|-------------|-------------|
| 1 | `2. Barter deals/knowledge base/Barter deals - System Prompt.md` | Modify | Fix routing references, DEAL dimension definitions, variation scaling contradictions, add batch command |
| 2 | `2. Barter deals/knowledge base/Barter deals - HVR v0.100.md` | Modify | Harmonize with LinkedIn HVRs, add ~15 hard blockers, ~18 phrase blockers, enforce UK English |
| 3 | `2. Barter deals/knowledge base/Barter deals - Standards.md` | Modify | Fix dimension names to match System Prompt, resolve word count contradictions, add multi-brand rules |
| 4 | `2. Barter deals/knowledge base/Barter deals - Brand Context.md` | Modify | Restore EUR values at lines 191-199, update HVR blacklist alignment |
| 5 | `2. Barter deals/knowledge base/Barter deals - Deal Type Product.md` | Modify | Add failing examples, multi-product guidance, expand verticals |
| 6 | `2. Barter deals/knowledge base/Barter deals - Deal Type Service.md` | Modify | Add value ranges, more examples, fix HVR violations in existing templates |
| 7 | `2. Barter deals/knowledge base/Barter deals - DEPTH Framework.md` | Modify | Align with Pieter v0.120 improvements, update from v0.112 base |
| 8 | `2. Barter deals/knowledge base/Barter deals - Industry Modules.md` | Modify | Add automotive, travel, education, sports, entertainment verticals |
| 9 | `2. Barter deals/knowledge base/Barter deals - Market Data.md` | Modify | Add freshness dates, Dutch-specific data, platform comparisons |
| 10 | `2. Barter deals/knowledge base/Barter deals - Interactive Mode.md` | Modify | Add edge cases for multi-brand, non-EUR, digital-only scenarios |
| 11 | `2. Barter deals/AGENTS.md` | Modify | Fix file references from `DT -` prefix to `Barter deals -` prefix |
| 12 | `2. Barter deals/README.md` | Modify | Update inventory to show all 10 files as Active, fix statuses |

---

## 5. Requirements

### P0 Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix file cross-references in AGENTS.md, README.md, and System Prompt | Every file reference resolves to an existing file. Zero broken references across all 12 files. Manual verification by opening each referenced path. |
| REQ-002 | Ensure export directory has functional persistence | Export protocol executes without filesystem errors. At least one test deal template saved to `/export/` with correct naming convention `[###] - deal-[type]-[brand].md`. |
| REQ-003 | Restore EUR values in Brand Context | Lines 191-199 contain specific EUR amounts (not `...`). Values match Barter marketplace pricing benchmarks for product and service deals. |
| REQ-004 | Unify DEAL dimension definitions | System Prompt and Standards.md use identical dimension names and descriptions. Single canonical definition: D=Description (6pts), E=Expectations (7pts), A=Appeal (6pts), L=Legitimacy (6pts). |

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update README file inventory | All 10 knowledge base files listed as Active with correct filenames. No files listed as Planned. Line counts updated to actuals. |
| REQ-006 | Harmonize HVR hard blockers with LinkedIn systems | Deals HVR contains all hard blockers present in LinkedIn Pieter v0.130 and LinkedIn Nigel v0.100. At least 15 additional hard blocker words added. At least 18 phrase blockers added. |
| REQ-007 | Enforce UK English in Deals HVR | All US spellings replaced with UK equivalents (e.g., optimize -> optimise, color -> colour). Spelling standard explicitly declared in HVR header. |
| REQ-008 | Resolve variation scaling contradiction | Single source of truth for variation scaling: either word count tiers (System Prompt) or description length (Standards.md). One definition removed, the other updated and cross-referenced. |
| REQ-009 | Add per-dimension minimum floors to DEAL scoring | Each DEAL dimension has a minimum floor score. A deal cannot pass with 19+/25 total if any single dimension is below its floor. Floors documented with rationale. |
| REQ-010 | Add tiered validation thresholds by deal complexity | Simple deals: 19/25 threshold. Standard deals: 21/25 threshold. Complex deals (multi-product, high value, service bundles): 23/25 threshold. Complexity classification rules documented. |
| REQ-011 | Add tone alignment checkpoint | Explicit checkpoint in scoring flow: "Does this sound like a real marketplace listing?" Concrete evaluation criteria documented (not subjective). |
| REQ-012 | Add self-correction diagnostic matrix | Matrix mapping common failure modes to root causes and corrective actions. At least 10 failure mode patterns documented. |
| REQ-013 | Add revision guidance by score band | Score bands (14-18, 19-21, 22-24, 25) each have specific improvement guidance with examples. |

### P2 Medium

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-014 | Expand industry modules from 5 to 10+ verticals | Automotive, travel, education, sports, and entertainment verticals added. Each with key vocabulary, brand examples, and content types matching existing vertical format. |
| REQ-015 | Add freshness dates to market data | Every pricing benchmark has a `Last Verified` date. Data older than 6 months flagged for review. Currency and source documented per data point. |
| REQ-016 | Add failing deal template examples | At least 2 failing examples per deal type (product and service). Each with score breakdown, HVR violations listed, and corrected version. |
| REQ-017 | Add hybrid/mixed deal type support | Guidance for deals combining product and service elements. Scoring adjustments documented. At least 1 annotated hybrid example. |
| REQ-018 | Add missing template fields | Timeline, shipping, content approval, exclusivity, geography, and minimum follower fields added to both deal type templates. Fields marked as optional/required per deal type. |
| REQ-019 | Add Interactive Mode edge cases | Multi-brand collaboration, non-EUR currency, digital-only product, and seasonal/limited-time deal scenarios documented with question flows. |
| REQ-020 | Add export protocol sequential numbering | Export file numbering persists across sessions. Numbering logic documented. Edge cases (gaps, resets) addressed. |
| REQ-021 | Add value-proportionate scoring weights | Scoring rubric accounts for deal value ranges. Higher-value deals (EUR 500+) have stricter legitimacy requirements. Weighting rationale documented. |
| REQ-022 | Update DEPTH Framework alignment | DEPTH updated from v0.112 base to align with Pieter v0.120 improvements. Quality gates updated. Cognitive rigor techniques expanded. |

---

## 6. Success Criteria

| ID | Criterion | Measurement |
|----|-----------|-------------|
| SC-001 | Zero broken cross-references | Automated grep for all file references across 12 files returns zero mismatches |
| SC-002 | HVR parity with LinkedIn systems | Side-by-side diff of hard blockers and phrase blockers shows no gaps vs LinkedIn Pieter v0.130 |
| SC-003 | DEAL scoring produces consistent results | Same deal template scored independently by System Prompt definitions and Standards.md definitions yields identical scores |
| SC-004 | Export protocol works end-to-end | 3 test deals (1 product, 1 service, 1 hybrid) generated, scored, validated, and saved to `/export/` without manual intervention |
| SC-005 | Cross-system voice consistency | 5 sample deal templates pass HVR validation when checked against LinkedIn Pieter and LinkedIn Nigel HVR rules |
| SC-006 | Self-correction matrix covers common failures | 10+ failure modes documented, each with at least one real deal template example that exhibits the failure |

---

## 7. Risks and Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LinkedIn Pieter v0.130 HVR as authoritative source | Cannot harmonize without it | Access confirmed; file available in Barter ecosystem |
| Dependency | LinkedIn Nigel v0.100 scoring framework | Cannot design tiered thresholds without reference | Access confirmed; file available in Barter ecosystem |
| Risk | HVR harmonization breaks existing passing templates | Templates that passed before may fail after stricter rules | Audit all existing examples against new rules before committing |
| Risk | EUR values in Brand Context are unknown/changed | Cannot restore if original values are lost | Cross-reference with Barter marketplace listings and Copywriter Brand Context |
| Risk | Expanding industry modules without domain expertise | Low-quality industry vocabulary undermines credibility | Source terminology from actual marketplace listings in each vertical |
| Risk | DEAL scoring changes invalidate 001-initial-creation examples | Examples in spec show specific scores that may shift | Re-score all examples after changes and update documentation |
| Technical | Context window budget increase from added content | More content per file increases always-loaded footprint | Monitor line counts; keep always-loaded total under 2,000 lines |
| Process | Parallel work with 001-initial-creation phases 4-5 | Potential merge conflicts if both run simultaneously | Coordinate timing; this refinement completes independently |

---

## 8. Non-Functional Requirements

### Content Quality

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-Q01 | All deal templates pass HVR validation with zero hard blocker violations | 100% compliance rate |
| NFR-Q02 | Deal templates are indistinguishable from human-written marketplace listings | Tone alignment checkpoint pass rate above 95% |
| NFR-Q03 | DEAL scoring rubric produces reproducible results | Same template scores within 1 point across independent evaluations |

### Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P01 | Always-loaded knowledge base files remain under context budget | Total always-loaded lines under 2,000 |
| NFR-P02 | On-demand file loading adds no perceptible delay | Files load within standard AI tool response time |
| NFR-P03 | Export protocol completes before response is sent | Zero cases of template displayed before export confirmed |

### Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-M01 | All cross-references between files are resolvable | Zero broken references at any point |
| NFR-M02 | Market data has freshness dates for every data point | 100% of pricing benchmarks have Last Verified date |
| NFR-M03 | HVR changes propagate to all Barter AI systems simultaneously | Single source update, documented propagation procedure |

---

## 9. Edge Cases

### Data Boundaries

| Scenario | Expected Behaviour |
|----------|-------------------|
| Deal with no EUR value specified | Interactive Mode triggers, asks for value range. Default fallback uses Market Data median for the vertical. |
| Deal description exceeds maximum word count tier | Variation scaling trims to target tier. Warning logged in Processing Summary. |
| Brand not in any industry module | Cross-industry defaults applied. Interactive Mode asks for vertical classification. |
| Multi-brand deal (2+ brands collaborating) | Both brands listed in title. Requirements merged. Higher complexity threshold (23/25) triggered. |
| Non-EUR currency specified | Convert to EUR equivalent using market rates. Display both currencies. Flag for manual review. |
| Digital-only product (no shipping) | Shipping field omitted. Geography field scoped to content delivery regions. Template structure adapted. |

### Error Scenarios

| Scenario | Expected Behaviour |
|----------|-------------------|
| DEAL score below 14/25 (restart threshold) | Template is not exported. Diagnostic matrix consulted. Full restart recommended with specific guidance per failing dimensions. |
| All DEAL dimensions pass total but one is below floor | Template flagged as conditional. Specific dimension improvement guidance provided. Re-evaluation required after revision. |
| Export directory does not exist or is not writable | Error surfaced in Processing Summary before any response. AI does not display template in chat. Manual intervention flagged. |
| HVR validation finds hard blocker after DEAL scoring passes | Template blocked regardless of DEAL score. Specific violations listed. Auto-correction suggested where possible. |

---

## 10. Complexity Assessment

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Scope** | 22/25 | 12 files to modify, 22 distinct requirements across 3 priority levels, all touching interconnected knowledge base documents |
| **Risk** | 20/25 | HVR harmonization may break existing passing templates. DEAL scoring changes affect all downstream examples. Cross-system dependencies create ripple effects. |
| **Research** | 15/20 | Requires analysis of LinkedIn Pieter v0.130 and LinkedIn Nigel v0.100 for HVR and scoring patterns. Industry expansion needs domain research for 5 new verticals. |
| **Multi-Agent** | 13/15 | 10 analysis agents already deployed. Implementation requires coordinated multi-agent execution across 3 workstreams touching shared files. |
| **Coordination** | 13/15 | Cross-system alignment with 3 sibling AI systems. Parent spec folder (001) has pending phases. Stakeholder review required for scoring changes. |
| **Total** | **83/100** | High complexity. Multi-agent execution with workstream coordination required. |

---

## 11. Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | HVR harmonization makes existing deal examples fail HVR validation | High | High | Audit all examples against new HVR rules before committing. Prepare corrected versions in parallel. |
| R-002 | DEAL dimension rename breaks scoring references in multiple files | High | Medium | Use search-and-replace across all 12 files. Verify with automated grep for old dimension names. |
| R-003 | EUR values cannot be recovered for Brand Context lines 191-199 | Medium | Low | Cross-reference with Copywriter Brand Context, Barter marketplace listings, and Market Data file. |
| R-004 | Context window budget exceeded after content expansion | Medium | Medium | Track line counts during implementation. Set hard cap at 2,000 lines for always-loaded files. Trim on-demand files if needed. |
| R-005 | Industry module expansion contains inaccurate vertical terminology | Medium | Medium | Source terms from actual Barter marketplace listings. Flag unverified terms for manual review. |
| R-006 | Tiered validation thresholds are set too high, blocking valid deals | High | Medium | Start conservative (proposed thresholds), then calibrate with 10+ test deals across all tiers. Include override mechanism. |
| R-007 | Self-correction diagnostic matrix is too generic to be actionable | Medium | Low | Ground every failure mode in a real deal template example. Test matrix against historical scoring failures. |
| R-008 | Parallel execution of refinement and 001-initial-creation phases 4-5 causes merge conflicts | Low | Medium | Communicate timing. This refinement modifies file content; phases 4-5 add validation. Minimal overlap expected. |
| R-009 | Stakeholder disagreement on scoring changes delays approval | Medium | Low | Present scoring changes with data (test deal results) rather than theory. Include rollback path. |

---

## 12. User Stories

### US-001: Operator Fixes Broken System

**As a** Barter content operations manager,
**I want** all file cross-references to resolve correctly and the export protocol to work on first use,
**So that** I can deploy the Deal Templates AI agent without manual debugging.

**Acceptance Criteria:**
- **Given** the AI agent loads AGENTS.md
- **When** it follows the reading instructions to load knowledge base files
- **Then** every referenced file is found and loaded without error

---

### US-002: Operator Gets Consistent Scoring

**As a** Barter content operations manager,
**I want** the DEAL scoring dimensions to be defined consistently across all files,
**So that** scoring results are reproducible and not dependent on which file the AI reads first.

**Acceptance Criteria:**
- **Given** a deal template is scored
- **When** the DEAL rubric is applied using definitions from any file in the knowledge base
- **Then** the score is identical regardless of which file's definitions were used

---

### US-003: Creator Receives High-Quality Deal Listings

**As a** Barter creator browsing deal listings,
**I want** every deal description to sound like it was written by a real person and contain all the information I need,
**So that** I can quickly evaluate whether a deal is worth applying to.

**Acceptance Criteria:**
- **Given** a published deal listing
- **When** I read the description
- **Then** it contains clear value proposition, specific requirements, realistic expectations, and no AI-detectable language

---

### US-004: Operator Uses Diagnostic Matrix for Low-Scoring Deals

**As a** Barter content operations manager,
**I want** a diagnostic matrix that tells me exactly why a deal template scored low and how to fix it,
**So that** I can improve templates systematically instead of guessing.

**Acceptance Criteria:**
- **Given** a deal template scores below the threshold
- **When** I consult the diagnostic matrix
- **Then** I find the specific failure mode pattern, its root cause, and a concrete corrective action with an example

---

### US-005: Creator Sees Marketplace-Authentic Tone

**As a** Barter creator,
**I want** deal listings to sound like genuine marketplace posts, not corporate marketing copy,
**So that** I trust the deals are real and worth my time.

**Acceptance Criteria:**
- **Given** a deal template passes the tone alignment checkpoint
- **When** compared to real marketplace listings on similar platforms
- **Then** the template is indistinguishable in tone, structure, and vocabulary

---

## 13. Approval Workflow

| Checkpoint | Approver | Role | Status | Date |
|------------|----------|------|--------|------|
| Spec Review | Pieter Bertram | Founder, Barter | Pending | — |
| HVR Harmonization Review | Pieter Bertram | Founder, Barter | Pending | — |
| DEAL Scoring Changes Review | Pieter Bertram | Founder, Barter | Pending | — |
| Implementation Review | Michel Kerkmeester | Technical Lead | Pending | — |
| Cross-System Voice Audit | Pieter Bertram | Founder, Barter | Pending | — |
| Launch Approval | Pieter Bertram | Founder, Barter | Pending | — |

### Approval Rules

- P0 critical fixes (REQ-001 through REQ-004) may proceed without waiting for full spec approval, as they resolve blockers.
- DEAL scoring changes (REQ-009, REQ-010) require explicit Founder approval before implementation, as they change the quality baseline.
- HVR harmonization (REQ-006, REQ-007) requires Founder review to confirm alignment with ecosystem-wide voice standards.
- All changes require Technical Lead implementation review before merging.

---

## 14. Compliance Checkpoints

### Content Quality Compliance

| Check | Standard | Verification Method |
|-------|----------|-------------------|
| HVR hard blocker compliance | Zero hard blocker violations in any template | Automated word-level scan against complete blocker list |
| HVR phrase blocker compliance | Zero phrase blocker violations in any template | Automated phrase-level scan against complete blocker list |
| UK English compliance | All text uses UK English spelling | Spelling check with UK English dictionary |
| Tone authenticity | Templates pass marketplace tone alignment checkpoint | Structured evaluation against 5 tone criteria (see REQ-011) |

### Scoring System Compliance

| Check | Standard | Verification Method |
|-------|----------|-------------------|
| Dimension definition consistency | DEAL dimensions identical across all files | Automated diff of dimension definitions in System Prompt vs Standards.md |
| Per-dimension floor enforcement | No dimension below minimum floor in passing templates | Score breakdown verification on 10+ test templates |
| Tiered threshold calibration | Thresholds produce expected pass/fail distribution | Test suite of 15+ templates across simple/standard/complex tiers |

### Cross-System Compliance

| Check | Standard | Verification Method |
|-------|----------|-------------------|
| HVR parity | Deals HVR contains all blockers from LinkedIn Pieter v0.130 | Side-by-side diff of blocker lists |
| Voice consistency | Deal templates match ecosystem voice profile | 5 templates validated against Copywriter, LinkedIn Pieter, and LinkedIn Nigel voice rules |
| File reference integrity | All cross-references resolve | Automated grep for file references, verify each resolves to existing file |

---

## 15. Stakeholder Matrix

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Pieter Bertram | Founder, Barter | Final authority on voice standards, scoring thresholds, and ecosystem-wide consistency. Approves all changes that affect deal quality baseline. | Per-phase review. Approval required for scoring and HVR changes. |
| Nigel (LinkedIn System) | Reference System | Provides scoring methodology patterns (component floors, tiered thresholds, diagnostic matrices). Source for best practices. | Read-only reference. No direct communication required. |
| Michel Kerkmeester | Technical Lead | Implements all changes. Ensures technical consistency across knowledge base files. Validates cross-references and context window budgets. | Daily during implementation. Reviews all file changes. |
| Content Operations Team | End Users | Primary users of the Deal Templates system. Need reliable template generation, clear scoring, and actionable diagnostics. | Post-implementation training. Feedback collection after first 20 deals generated. |
| Barter Creators | Indirect Users | Consume deal listings generated by the system. Quality of their experience depends on template quality. | No direct communication. Quality measured through application rates and feedback. |

---

## 16. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-07 | Initial specification. 22 requirements across P0/P1/P2. 5 ADRs proposed. 12 files in scope. |

---

## Open Questions

| # | Question | Status | Owner |
|---|----------|--------|-------|
| OQ-001 | What are the exact EUR values that should appear in Brand Context lines 191-199? | Open | Pieter Bertram |
| OQ-002 | Should the tiered validation thresholds (19/21/23) be configurable per brand, or fixed system-wide? | Open | Pieter Bertram |
| OQ-003 | Should HVR harmonization be applied to the Copywriter system simultaneously, or only to Deal Templates first? | Open | Pieter Bertram |
| OQ-004 | What is the desired export file numbering persistence mechanism (file-based counter, directory scan, or manual)? | Open | Michel Kerkmeester |
| OQ-005 | Should failing deal template examples include real brand names, or use fictional brands to avoid confusion? | Open | Pieter Bertram |

---

## Related Documents

- [plan.md](./plan.md) — Implementation plan with 5 phases and 3 workstreams
- [decision-record.md](./decision-record.md) — 5 Architecture Decision Records
- Parent: [001-initial-creation/spec.md](../001-initial-creation/spec.md) — Original system specification
- Parent: [001-initial-creation/decision-record.md](../001-initial-creation/decision-record.md) — 18 original decisions
