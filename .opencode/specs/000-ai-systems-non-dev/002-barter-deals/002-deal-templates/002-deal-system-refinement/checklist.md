# Verification Checklist: Deal System Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3plus-govern | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence formats**: `[File: path:line]`, `[Test: command - result]`, `[Diff: before/after]`, `[Count: metric]`

---

## Pre-Implementation (P0)

- [ ] CHK-PRE-001 [P0] Requirements documented: all 30 refinement items catalogued with file paths and line references
- [ ] CHK-PRE-002 [P0] Dependencies identified: LinkedIn Pieter v0.130 HVR list available, LinkedIn Nigel v0.100 HVR list available
- [ ] CHK-PRE-003 [P0] Prior spec reviewed: `specs/002-barter-deals/002-deal-templates/001-initial-creation/spec.md` read and cross-referenced
- [ ] CHK-PRE-004 [P0] Cross-system inventory complete: all 12 files confirmed present in `2. Barter deals/` with current line counts

---

## Phase 1 Verification: Critical Fixes (P0)

- [ ] CHK-P1-001 [P0] AGENTS.md contains zero instances of `DT -` prefix (T001)
  - Verify: search `2. Barter deals/AGENTS.md` for string "DT -", expect 0 matches
  - All references use `Barter deals -` prefix matching actual filenames

- [ ] CHK-P1-002 [P0] System Prompt routing table references match actual filenames (T002)
  - Verify: every file path in routing table exists in `2. Barter deals/knowledge base/`
  - No `DT -` prefix remaining in System Prompt

- [ ] CHK-P1-003 [P0] Directories `/export/`, `/context/`, `/memory/` exist under `2. Barter deals/` (T003)
  - Verify: `ls -d` on each directory returns success

- [ ] CHK-P1-004 [P0] Brand Context EUR values present and complete for all product tiers (T004)
  - Verify: lines 191-199 of `Barter deals - Brand Context.md` contain EUR ranges
  - Cross-check: EUR values are consistent with Market Data pricing

- [ ] CHK-P1-005 [P0] DEAL dimensions in System Prompt use canonical names (T005)
  - Canonical: Description (6pts), Expectations (7pts), Appeal (6pts), Legitimacy (6pts)
  - Verify: no variant names ("Description Quality", "Creator Appeal", etc.) remain

- [ ] CHK-P1-006 [P0] Standards.md DEAL dimensions match System Prompt exactly (T006)
  - Verify: dimension names, point allocations, and criteria descriptions are identical
  - Cross-reference: System Prompt section headers match Standards.md section headers

- [ ] CHK-P1-007 [P0] DEPTH Framework DEAL references match System Prompt exactly (T007)
  - Verify: all DEAL scoring mentions use canonical dimension names
  - DEPTH version aligned with v0.120 improvements where applicable

- [ ] CHK-P1-008 [P0] README.md shows all 10 knowledge base files as "Complete" (T008)
  - Verify: zero "Planned" entries remain in file inventory table
  - File count in README matches actual file count in `/knowledge base/`

- [ ] CHK-P1-009 [P0] README.md contains zero instances of `DT -` prefix (T008)
  - Verify: search `2. Barter deals/README.md` for string "DT -", expect 0 matches

- [ ] CHK-P1-010 [P0] All 12 target files load without error in agent session
  - Verify: agent can read each file path listed in AGENTS.md reading instructions

- [ ] CHK-P1-011 [P0] DEAL scoring rubric totals 25 points (6+7+6+6) in all files that reference it
  - Verify: System Prompt, Standards, DEPTH Framework all show same point allocation

- [ ] CHK-P1-012 [P0] No cross-file dimension name conflicts remain
  - Verify: grep all knowledge base files for dimension names, confirm single canonical set

---

## Phase 2 Verification: HVR Harmonization (P0/P1)

- [ ] CHK-P2-001 [P0] HVR contains at least 15 additional hard blocker words beyond v0.100 baseline (T009)
  - Verify: diff HVR v0.100 original against updated version, count new word entries
  - Each new entry sourced from LinkedIn Pieter v0.130 or Nigel v0.100

- [ ] CHK-P2-002 [P0] HVR contains at least 18 phrase blockers (T010)
  - Verify: phrase blocker section exists with multi-word patterns
  - Includes: "not just X, but also Y", setup language, false-inclusive patterns

- [ ] CHK-P2-003 [P1] Zero US English spellings remain in HVR file (T011)
  - Verify: search for common US patterns (-ize, -or where UK uses -our, -er where UK uses -re)
  - Barter standard: UK English throughout

- [ ] CHK-P2-004 [P1] Emotional language prohibition section present in HVR (T012)
  - Verify: section exists with prohibited words and approved alternatives
  - Minimum 8 prohibited emotional escalators listed

- [ ] CHK-P2-005 [P1] Brand Context blacklist cross-references HVR as source of truth (T013)
  - Verify: Brand Context does not maintain independent blocker list
  - Single cross-reference note points to HVR master file

- [ ] CHK-P2-006 [P1] Tone alignment checkpoint present in HVR (T014)
  - Verify: checkpoint question "Does this sound like a marketplace listing creators trust?" exists
  - Placement: after generation, before DEAL scoring

- [ ] CHK-P2-007 [P1] HVR scoring integration uses canonical DEAL dimension names (T015)
  - Verify: Legitimacy dimension explicitly includes HVR compliance as factor
  - No orphaned or variant dimension names in scoring section

- [ ] CHK-P2-008 [P1] Self-correction diagnostic matrix present with 4 failure modes (T016)
  - Verify: Too Generic, Too Salesy, Too Vague, Too Restrictive all defined
  - Each mode has: symptoms (2+), fixes (2+)

- [ ] CHK-P2-009 [P1] HVR version header reads v0.110 (T017)
  - Verify: file header contains version v0.110
  - Changelog entry documents all Phase 2 changes

- [ ] CHK-P2-010 [P0] No em dashes or semicolons in any HVR example text
  - Verify: search HVR file for em dash (---) and semicolon (;) in example/template sections

- [ ] CHK-P2-011 [P0] No 3-item enumerations in HVR example text
  - Verify: all example lists use 2, 4, or 5+ items, or flowing prose

- [ ] CHK-P2-012 [P1] HVR hard blockers sorted alphabetically or by category with clear grouping
  - Verify: blocker list is scannable and organised, not appended haphazardly

- [ ] CHK-P2-013 [P1] All new HVR entries include category tag (AI vocabulary, corporate jargon, filler, emotional)
  - Verify: each blocker word/phrase has a category annotation

- [ ] CHK-P2-014 [P0] LinkedIn Pieter v0.130 blocker coverage: every Pieter hard blocker either present in Deal Templates HVR or documented as intentionally excluded
  - Verify: cross-reference spreadsheet or diff

- [ ] CHK-P2-015 [P0] LinkedIn Nigel v0.100 blocker coverage: every Nigel hard blocker either present in Deal Templates HVR or documented as intentionally excluded
  - Verify: cross-reference spreadsheet or diff

---

## Phase 3 Verification: Scoring Enhancement (P1)

- [ ] CHK-P3-001 [P1] Per-dimension minimums documented in System Prompt (T018)
  - Verify: minimum 3/6 for D, A, L and 3/7 for E stated in scoring section
  - Flagging rule: overall 19+ but any dimension below minimum triggers revision

- [ ] CHK-P3-002 [P1] Tiered validation thresholds documented in Standards.md (T019)
  - Verify: Quick (17+), Standard (19+), Complex (21+) thresholds with trigger criteria

- [ ] CHK-P3-003 [P1] Score range 17-19 has no overlap in System Prompt (T020)
  - Verify: 17-18 = "Strengthen", 19+ = "Ship" are distinct bands with no contradiction
  - Under 17 = "Revise required" is clearly stated

- [ ] CHK-P3-004 [P1] Score-band revision guidance present for all 5 bands (T021)
  - Verify: 23-25, 19-22, 17-18, 14-16, under 14 each have specific guidance
  - Lower bands include per-dimension improvement suggestions

- [ ] CHK-P3-005 [P2] Value-proportionate calibration table present in Standards.md (T022)
  - Verify: EUR threshold ranges (0-50, 50-150, 150-500, 500+) with corresponding score requirements

- [ ] CHK-P3-006 [P1] Variation scaling uses single model across all files (T023)
  - Verify: System Prompt uses tier-based model
  - Standards.md provides word count targets per tier
  - No competing length-based model remains

- [ ] CHK-P3-007 [P1] Word count targets consistent across all files (T024)
  - Verify: Standards.md is single source of truth
  - System Prompt, Deal Type Product, Deal Type Service all cross-reference Standards.md
  - No conflicting ranges (50-150, 50-120, 60-150) remain

- [ ] CHK-P3-008 [P1] Section header "What we ask in return" used consistently (T025)
  - Verify: search all knowledge base files for "Creator Requirements" header, expect 0 matches
  - Canonical header used in Standards, Deal Type Product, Deal Type Service

- [ ] CHK-P3-009 [P1] System Prompt scoring section is internally consistent
  - Verify: dimension names, point totals, threshold bands, and revision guidance form coherent system

- [ ] CHK-P3-010 [P1] Standards.md scoring section is internally consistent
  - Verify: word counts, tier thresholds, and formatting rules align with System Prompt

- [ ] CHK-P3-011 [P1] DEAL rubric total remains 25 points after all Phase 3 changes
  - Verify: no dimension point reallocation changed the total

- [ ] CHK-P3-012 [P1] Quick deal ($quick command) threshold documented as 17+ in both System Prompt and Standards.md
  - Verify: $quick command section and tiered threshold section are aligned

---

## Phase 4 Verification: Content Expansion (P1/P2)

- [ ] CHK-P4-001 [P1] Deal Type Product contains at least 1 failing example scoring 14-16 (T026)
  - Verify: example present with per-dimension scores and failure annotations
  - Revised version also present scoring 19+

- [ ] CHK-P4-002 [P1] Deal Type Product covers at least 6 brand examples across 4+ verticals (T027)
  - Verify: beauty/wellness, tech, food/beverage, and home goods represented
  - Each example has DEAL score breakdown

- [ ] CHK-P4-003 [P1] Multi-product deal guidance section present in Deal Type Product (T028)
  - Verify: section addresses multiple products in single deal, Description structuring, deliverable scaling

- [ ] CHK-P4-004 [P2] Surprise box and seasonal pick handling section present (T029)
  - Verify: guidance for unknown product details and time-constrained deals

- [ ] CHK-P4-005 [P1] Deal Type Service contains inline value ranges table (T030)
  - Verify: EUR ranges for budget, mid-range, premium, luxury tiers
  - Deliverable expectations scale with value tier

- [ ] CHK-P4-006 [P1] Deal Type Service contains at least 6 examples across 3+ cities (T031)
  - Verify: Amsterdam, Rotterdam, Utrecht (or other non-Amsterdam) represented
  - Each example has DEAL score breakdown

- [ ] CHK-P4-007 [P0] Zero 3-item enumerations remain in Deal Type Service atmosphere templates (T032)
  - Verify: all lists use 2, 4, 5+ items or prose
  - HVR compliance: no AI signature patterns in reference material

- [ ] CHK-P4-008 [P1] Solo experience and time-sensitive deal guidance present in Deal Type Service (T033)
  - Verify: sections address single-person services, seasonal/limited-run deals
  - WeTransfer standard includes rationale note

- [ ] CHK-P4-009 [P1] Industry Modules contains automotive/travel, education/courses, entertainment/events (T034)
  - Verify: 3 new modules present with overview, terminology, example snippet, common pitfalls
  - Total module count: original modules + 3 new

- [ ] CHK-P4-010 [P1] Market Data has freshness dates on every data point (T035)
  - Verify: "Last verified" date present for each pricing/benchmark entry
  - Competitor pricing flagged as approximate

- [ ] CHK-P4-011 [P1] Market Data contains Dutch/European-specific benchmarks (T035)
  - Verify: creator rate data for NL/EU market, not just global averages
  - Platform comparison includes Instagram Reels and YouTube Shorts

- [ ] CHK-P4-012 [P1] Interactive Mode covers multi-brand, non-EUR, digital-only, solo edge cases (T036)
  - Verify: question templates for each edge case type
  - At least 2 example prompts per edge case

- [ ] CHK-P4-013 [P2] $batch command documented in System Prompt (T037)
  - Verify: command syntax, behaviour description, session state handling
  - Hybrid deal type routing addressed

- [ ] CHK-P4-014 [P1] All new examples comply with HVR v0.110
  - Verify: no hard blocker words, no phrase blockers, UK English, no 3-item lists in new content

- [ ] CHK-P4-015 [P1] All new content uses canonical DEAL dimension names
  - Verify: new sections reference Description, Expectations, Appeal, Legitimacy (no variants)

---

## Phase 5 Verification: Integration (P0)

- [ ] CHK-P5-001 [P0] 3 product deal templates generated and scored 19+ overall (T038)
  - Verify: tech, beauty, food product templates exported to `/export/`
  - DEAL score breakdown present for each, all dimensions meet minimum

- [ ] CHK-P5-002 [P0] 3 service deal templates generated and scored 19+ overall (T039)
  - Verify: Amsterdam dining, Rotterdam wellness, online course templates exported
  - DEAL score breakdown present for each, all dimensions meet minimum

- [ ] CHK-P5-003 [P0] All 6 generated templates pass HVR v0.110 compliance audit (T040)
  - Verify: zero hard blocker violations, zero phrase blocker violations
  - UK English throughout, no em dashes, no semicolons, no 3-item lists

- [ ] CHK-P5-004 [P1] Cross-system voice audit completed with documented findings (T041)
  - Verify: comparison against LinkedIn Pieter v0.130 and Nigel v0.100 output samples
  - Any divergence documented with recommended alignment action

- [ ] CHK-P5-005 [P0] End-to-end workflow completes in under 2 minutes for standard deal (T042)
  - Verify: timed test from user prompt to exported file
  - Complex deal completes in under 3 minutes

- [ ] CHK-P5-006 [P1] Context window total under 2,500 lines for standard deal path (T043)
  - Verify: line count for always-loaded files + standard deal type file + Standards
  - Per-file line counts documented

- [ ] CHK-P5-007 [P0] Agent successfully routes product deal request to correct files
  - Verify: product keyword triggers loading of Deal Type Product, not Service

- [ ] CHK-P5-008 [P0] Agent successfully routes service deal request to correct files
  - Verify: service keyword triggers loading of Deal Type Service, not Product

---

## L3+: Architecture Verification

- [ ] CHK-L3-ARCH-001 [P1] Architecture decision: DEAL canonical naming documented in decision-record.md (ADR-006)
  - Rationale for chosen dimension names over alternatives

- [ ] CHK-L3-ARCH-002 [P1] Architecture decision: tiered scoring model documented in decision-record.md (ADR-007)
  - Rationale for Quick/Standard/Complex tier split

- [ ] CHK-L3-ARCH-003 [P1] Architecture decision: HVR as single source of truth for voice rules documented (ADR-008)
  - Rationale for consolidating blockers from Brand Context into HVR

- [ ] CHK-L3-ARCH-004 [P1] Architecture decision: Standards.md as single source of truth for word counts documented (ADR-009)
  - Rationale for consolidating conflicting ranges into one file

---

## L3+: Cross-System Compliance

- [ ] CHK-L3-CROSS-001 [P1] Deal Templates HVR is superset of LinkedIn Pieter v0.130 hard blockers
  - Or: intentional exclusions documented with rationale

- [ ] CHK-L3-CROSS-002 [P1] Deal Templates HVR is superset of LinkedIn Nigel v0.100 hard blockers
  - Or: intentional exclusions documented with rationale

- [ ] CHK-L3-CROSS-003 [P1] DEPTH Framework version aligned across Deal Templates and other Barter systems
  - Verify: no version conflicts between systems

- [ ] CHK-L3-CROSS-004 [P1] Export protocol consistent with Copywriter v0.821 and TikTok SEO v0.121 patterns
  - Verify: same `/export/` directory convention, same file naming pattern

---

## L3+: Documentation Verification

- [ ] CHK-L3-DOC-001 [P1] All spec documents synchronised (tasks.md, checklist.md, implementation-summary.md)
  - Task count matches, phase numbering consistent, cross-references valid

- [ ] CHK-L3-DOC-002 [P1] Memory folder updated with session context after implementation
  - At least one memory file in `specs/002-barter-deals/002-deal-templates/002-deal-system-refinement/memory/`

- [ ] CHK-L3-DOC-003 [P2] Implementation summary completed with actual results post-implementation
  - Files changed table filled, verification results recorded

- [ ] CHK-L3-DOC-004 [P1] README.md in `2. Barter deals/` reflects final state of all files
  - Version numbers, file counts, status entries all current

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation (P0) | 4 | 0/4 |
| Phase 1 - Critical Fixes (P0) | 12 | 0/12 |
| Phase 2 - HVR Harmonization (P0/P1) | 15 | 0/15 |
| Phase 3 - Scoring Enhancement (P1) | 12 | 0/12 |
| Phase 4 - Content Expansion (P1/P2) | 15 | 0/15 |
| Phase 5 - Integration (P0) | 8 | 0/8 |
| L3+ Architecture | 4 | 0/4 |
| L3+ Cross-System | 4 | 0/4 |
| L3+ Documentation | 4 | 0/4 |
| **Total** | **78** | **0/78** |

**P0 items**: 30
**P1 items**: 42
**P2 items**: 6

**Verification Date**: Not yet started

---

## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pieter Bertram | Founder/CEO - Content quality approval | [ ] Approved | |
| Technical Lead | System architecture approval | [ ] Approved | |
| Content Operations | Operational readiness approval | [ ] Approved | |
