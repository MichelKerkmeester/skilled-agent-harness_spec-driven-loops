# Tasks: Deal System Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (can run concurrently with sibling [P] tasks) |
| `[B]` | Blocked (dependency not yet satisfied) |

**Task Format**: `T### [P?] Description (file path)`

**Workstream Key**:

| Workstream | Scope | Phases |
|------------|-------|--------|
| **W-A** | System Infrastructure | Phase 1, Phase 2 |
| **W-B** | Content Enhancement | Phase 3, Phase 4 |
| **W-C** | Quality and Integration | Phase 5 |

**Priority Key**: P0 = Hard Blocker, P1 = Required, P2 = Optional

---

## Phase 1: Critical Fixes (P0) ~ 2 hours

All Phase 1 tasks are **W-A: System Infrastructure**.

- [x] T001 [P] Fix all `DT -` prefix references in AGENTS.md to `Barter deals -` (`2. Barter deals/AGENTS.md`)
  - Lines 98, 109, 113, 117, 119, 121, 124: Replace `/knowledge base/DT -` with `/knowledge base/Barter deals -`
  - Priority: P0 (routing failure without this)

- [x] T002 [P] Fix all `DT -` prefix references in System Prompt routing tables (`2. Barter deals/knowledge base/Barter deals - System Prompt.md`)
  - Audit all internal file references for `DT -` prefix and replace with `Barter deals -`
  - Verify routing table entries match actual filenames in `/knowledge base/`
  - Priority: P0 (agent cannot load files without correct paths)

- [x] T003 [P] Create `/export/`, `/context/`, `/memory/` directories if missing (`2. Barter deals/`)
  - Verify each directory exists under `2. Barter deals/`
  - Create any missing directories
  - Priority: P0 (export protocol fails without `/export/`)

- [x] T004 [P] Restore EUR values in Brand Context lines 191-199 (`2. Barter deals/knowledge base/Barter deals - Brand Context.md`)
  - Verify EUR value ranges are present for product tiers (entry, mid, premium)
  - Cross-reference with Market Data pricing for consistency
  - Priority: P0 (deal templates cannot include pricing without values)

- [x] T005 Canonicalize DEAL dimension names across System Prompt (`2. Barter deals/knowledge base/Barter deals - System Prompt.md`)
  - Canonical names: Description (6pts), Expectations (7pts), Appeal (6pts), Legitimacy (6pts)
  - Verify dimension names, point allocations, and scoring criteria are internally consistent
  - Priority: P0 (scoring rubric must be unambiguous)

- [x] T006 Update Standards.md DEAL dimensions to match System Prompt canonical names (`2. Barter deals/knowledge base/Barter deals - Standards.md`)
  - Depends on: T005 (canonical names must be established first)
  - Replace any variant naming (e.g. "Description Quality" vs "Description") with canonical form
  - Priority: P0

- [x] T007 Update DEPTH Framework DEAL dimensions to match System Prompt canonical names (`2. Barter deals/knowledge base/Barter deals - DEPTH Framework.md`)
  - Depends on: T005 (canonical names must be established first)
  - Align DEPTH scoring references with DEAL rubric
  - Update from v0.112 base to align with Pieter's v0.120 improvements where applicable
  - Priority: P0

- [x] T008 [P] Update README.md inventory and file references (`2. Barter deals/README.md`)
  - Change all "Planned" status entries to "Complete" for delivered knowledge base files
  - Fix file count to reflect 10 knowledge base files (not original count)
  - Replace all `DT -` prefixes with `Barter deals -` in inventory table and architecture section
  - Priority: P0 (README is the system map)

---

## Phase 2: HVR Harmonization (P0/P1) ~ 3 hours

All Phase 2 tasks are **W-A: System Infrastructure**.

- [x] T009 Add 15+ missing hard blocker words from LinkedIn Pieter/Nigel HVRs (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Cross-reference LinkedIn Pieter v0.130 hard blocker list against Deal Templates HVR
  - Cross-reference LinkedIn Nigel v0.100 hard blocker list against Deal Templates HVR
  - Add missing entries with category tags (AI vocabulary, corporate jargon, filler)
  - Priority: P0 (HVR gaps allow blocked words through)

- [x] T010 [P] Add 18+ missing phrase blockers (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Add multi-word patterns: "not just X, but also Y", "take it to the next level", "at the end of the day"
  - Add "In conclusion", "In summary", "It's worth noting" setup language
  - Add "whether you're a... or a..." false-inclusive pattern
  - Priority: P0 (phrase blockers are as critical as word blockers)

- [x] T011 [P] Fix all US spellings to UK English in HVR file (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Scan for: -ize (should be -ise), -or (should be -our), -er (should be -re where applicable)
  - Barter standard: UK English throughout all customer-facing content
  - Priority: P1 (voice consistency)

- [x] T012 Add emotional language prohibition section (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Define prohibited emotional escalators: "incredible", "amazing", "game-changing", "revolutionary"
  - Provide approved alternatives: specific, factual descriptors tied to product/service attributes
  - Priority: P1 (prevents salesy tone drift)

- [x] T013 [P] Reconcile Brand Context HVR blacklist with HVR master file (`2. Barter deals/knowledge base/Barter deals - Brand Context.md`)
  - Depends on: T009, T010 (HVR master must be updated first)
  - Remove any Brand Context blacklist entries that duplicate HVR master
  - Add cross-reference note pointing to HVR as single source of truth for word/phrase blockers
  - Priority: P1

- [x] T014 Add tone alignment checkpoint to HVR (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Checkpoint question: "Does this sound like a marketplace listing creators trust?"
  - Place after generation, before DEAL scoring
  - Include 4 diagnostic signals: too generic, too salesy, too vague, too restrictive
  - Priority: P1 (prevents tone drift without full rescore)

- [x] T015 [P] Fix scoring integration section to reference correct DEAL rubric (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Verify HVR references to DEAL dimensions use canonical names from T005
  - Ensure Legitimacy dimension explicitly includes HVR compliance as scoring factor
  - Priority: P1

- [x] T016 Add self-correction diagnostic matrix (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Four failure modes with symptoms and fixes:
    - Too Generic: vague benefits, no specifics -> add product/service details, cite numbers
    - Too Salesy: emotional escalators, superlatives -> replace with factual claims, remove hype
    - Too Vague: unclear deliverables, missing formats -> specify platform, count, timeline
    - Too Restrictive: excessive requirements, narrow audience -> simplify asks, broaden creator fit
  - Priority: P1

- [x] T017 Version bump HVR to v0.110 (`2. Barter deals/knowledge base/Barter deals - HVR v0.100.md`)
  - Depends on: T009, T010, T011, T012, T014, T016 (all HVR changes must be complete)
  - Update version in file header, changelog section, and filename reference in AGENTS.md
  - Note: physical filename stays `Barter deals - HVR v0.100.md` until rename is confirmed
  - Priority: P1

---

## Phase 3: Scoring and Validation Enhancement (P1) ~ 3 hours

All Phase 3 tasks are **W-B: Content Enhancement**.

- [x] T018 Add per-dimension minimums to DEAL scoring (`2. Barter deals/knowledge base/Barter deals - System Prompt.md`)
  - Minimum 3/6 for Description, Appeal, Legitimacy
  - Minimum 3/7 for Expectations
  - A template scoring 19+ overall but 1/6 on any dimension must be flagged for revision
  - Priority: P1 (prevents lopsided templates that pass on total score alone)

- [x] T019 [P] Add tiered validation thresholds (`2. Barter deals/knowledge base/Barter deals - Standards.md`)
  - Quick deals ($quick command): 17+ to ship
  - Standard deals: 19+ to ship
  - Complex deals (multi-product, high-value, industry-specific): 21+ to ship
  - Define which deal attributes trigger each tier
  - Priority: P1

- [x] T020 Fix score range 17-19 overlap in System Prompt (`2. Barter deals/knowledge base/Barter deals - System Prompt.md`)
  - Current issue: 17-19 range both "passes" and "requires strengthening"
  - Resolution: 17-18 = "Strengthen recommended" (ship only for $quick), 19+ = "Ship" (standard threshold)
  - Under 17 = "Revise required" (must improve before export)
  - Priority: P1

- [x] T021 [P] Add score-band-specific revision guidance (`2. Barter deals/knowledge base/Barter deals - System Prompt.md`)
  - 23-25: Top-tier, no changes needed
  - 19-22: Ship-ready, optional polish suggestions
  - 17-18: Strengthen band, provide 2-3 specific dimension improvements
  - 14-16: Significant revision, provide per-dimension rewrite guidance
  - Under 14: Restart from brief, template is structurally unsound
  - Priority: P1

- [x] T022 [P] Add value-proportionate scoring calibration (`2. Barter deals/knowledge base/Barter deals - Standards.md`)
  - EUR 0-50 deals: standard threshold applies (19+)
  - EUR 50-150 deals: standard threshold applies (19+)
  - EUR 150-500 deals: elevated threshold (21+), more detail expected in Description and Legitimacy
  - EUR 500+ deals: premium threshold (22+), comprehensive deliverables and terms required
  - Priority: P2 (enhancement, not blocking)

- [x] T023 Resolve variation scaling contradiction (`2. Barter deals/knowledge base/Barter deals - Standards.md`)
  - System Prompt uses tier-based model (Quick/Standard/Complex)
  - Standards.md uses length-based model (word count ranges)
  - Resolution: consolidate to tier-based model in System Prompt, Standards.md provides word count targets per tier
  - Single source of truth: Standards.md for word counts, System Prompt for tier routing
  - Depends on: T019 (tiered thresholds must be defined first)
  - Priority: P1

- [x] T024 [P] Standardise word count targets across all files (`2. Barter deals/knowledge base/Barter deals - Standards.md`)
  - Current contradiction: 50-150 (System Prompt) vs 50-120 (Standards) vs 60-150 (Deal Type files)
  - Resolution: Standards.md becomes single source of truth
  - Proposed canonical ranges: Description 60-120 words, Deliverables 40-80 words, Full template 150-300 words
  - Update System Prompt and Deal Type files to cross-reference Standards.md
  - Priority: P1

- [x] T025 [P] Standardise "Creator Requirements" vs "What we ask in return" header (`2. Barter deals/knowledge base/Barter deals - Standards.md`)
  - Audit all files for variant headers
  - Pick canonical header: "What we ask in return" (matches Barter marketplace voice)
  - Update Standards.md, Deal Type Product, Deal Type Service to use canonical header
  - Priority: P1

---

## Phase 4: Content Expansion (P1/P2) ~ 4 hours

All Phase 4 tasks are **W-B: Content Enhancement**.

- [x] T026 Add failing deal template example to Deal Type Product (`2. Barter deals/knowledge base/Barter deals - Deal Type Product.md`)
  - Create example scoring 14-16 with specific dimension failures
  - Annotate what went wrong per dimension
  - Show revised version scoring 19+ with improvement notes
  - Priority: P1 (calibration requires failure examples)

- [x] T027 [P] Add tech, food/beverage, home goods product examples (`2. Barter deals/knowledge base/Barter deals - Deal Type Product.md`)
  - Current coverage: only 3 Dutch brand examples (beauty/wellness skew)
  - Add: consumer tech product, Dutch food/beverage brand, home goods brand
  - Each example must include DEAL score breakdown
  - Priority: P1

- [x] T028 [P] Add multi-product deal guidance (`2. Barter deals/knowledge base/Barter deals - Deal Type Product.md`)
  - When a brand offers multiple products in one deal (e.g. full skincare set)
  - How to structure Description to cover range without becoming generic
  - Deliverable scaling: additional products may require additional content pieces
  - Priority: P1

- [x] T029 [P] Add surprise box and seasonal pick handling (`2. Barter deals/knowledge base/Barter deals - Deal Type Product.md`)
  - Surprise/mystery box deals where exact products are unknown
  - Seasonal or limited-edition product deals with time constraints
  - How to maintain Description specificity when product details are partially unknown
  - Priority: P2

- [x] T030 Add service value ranges section to Deal Type Service (`2. Barter deals/knowledge base/Barter deals - Deal Type Service.md`)
  - Currently relies on cross-reference to Market Data with no inline guidance
  - Add value range table: budget (EUR 25-75), mid-range (EUR 75-200), premium (EUR 200-500), luxury (EUR 500+)
  - Include how value tier affects deliverable expectations
  - Priority: P1

- [x] T031 [P] Add non-Amsterdam service examples (`2. Barter deals/knowledge base/Barter deals - Deal Type Service.md`)
  - Current coverage: all 3 examples are Amsterdam dining/wellness
  - Add: Rotterdam experience, Utrecht service, online/remote service
  - Each example must include DEAL score breakdown
  - Priority: P1

- [x] T032 [P] Fix atmosphere template 3-item niche violation (`2. Barter deals/knowledge base/Barter deals - Deal Type Service.md`)
  - HVR prohibits exactly 3-item enumerations as AI signature pattern
  - Identify atmosphere template sections using 3-item lists
  - Rewrite to use 2 items, 4 items, or flowing prose instead
  - Priority: P0 (HVR violation in reference material)

- [x] T033 [P] Add solo experience and time-sensitive deal guidance (`2. Barter deals/knowledge base/Barter deals - Deal Type Service.md`)
  - Solo experiences: spa, workshop, course (vs group dining, couples activities)
  - Time-sensitive deals: seasonal menus, limited-run events, holiday specials
  - WeTransfer as delivery standard: add rationale note
  - Priority: P1

- [x] T034 Add 3 new industry modules (`2. Barter deals/knowledge base/Barter deals - Industry Modules.md`)
  - Automotive and travel: car accessories, travel experiences, luggage brands
  - Education and courses: online courses, workshops, educational tools
  - Entertainment and events: concert tickets, festival passes, streaming subscriptions
  - Each module: vertical overview, key terminology, example deal snippet, common pitfalls
  - Priority: P1

- [x] T035 [P] Add freshness dates and Dutch-specific benchmarks to Market Data (`2. Barter deals/knowledge base/Barter deals - Market Data.md`)
  - Add "Last verified" date to every data point
  - Add Dutch/European-specific creator rate benchmarks
  - Add platform comparison data beyond TikTok (Instagram Reels, YouTube Shorts pricing)
  - Flag competitor pricing as "approximate, verify before citing"
  - Priority: P1

- [x] T036 [P] Add multi-brand, non-EUR, digital-only edge cases to Interactive Mode (`2. Barter deals/knowledge base/Barter deals - Interactive Mode.md`)
  - Multi-brand/co-branded deals: how to handle two brands in one template
  - Non-EUR currency deals: conversion handling, display format
  - Digital-only deals: no physical product, download/access-based
  - Solo experiences: single-person service deals
  - Priority: P1

- [x] T037 Add $batch command to System Prompt for multi-deal sessions (`2. Barter deals/knowledge base/Barter deals - System Prompt.md`)
  - Command: `$batch [count] [type]` (e.g. `$batch 5 product`)
  - Behaviour: generates multiple deals sequentially, exports each to `/export/`
  - Session state: maintains deal counter across batch
  - Include hybrid deal type routing for deals that are both product and service
  - Priority: P2

---

## Phase 5: Integration Testing (P0) ~ 2 hours

All Phase 5 tasks are **W-C: Quality and Integration**.

- [x] T038 Generate 3 product deal templates and score against refined rubric
  - Depends on: T005, T018, T019, T020, T026, T027 (scoring and examples must be complete)
  - Generate: tech product, beauty product, food product
  - Score each against refined DEAL rubric with per-dimension minimums
  - All must achieve 19+ overall and 3+ per dimension
  - Priority: P0

- [x] T039 [P] Generate 3 service deal templates and score against refined rubric
  - Depends on: T005, T018, T019, T020, T030, T031 (scoring and examples must be complete)
  - Generate: Amsterdam dining, Rotterdam wellness, online course
  - Score each against refined DEAL rubric with per-dimension minimums
  - All must achieve 19+ overall and 3+ per dimension
  - Priority: P0

- [x] T040 [P] HVR compliance audit on all generated templates
  - Depends on: T038, T039 (templates must be generated first)
  - Run every generated template against updated HVR v0.110 word and phrase blockers
  - Check UK English throughout
  - Verify no 3-item enumerations, no em dashes, no semicolons
  - Zero violations required to pass
  - Priority: P0

- [x] T041 Cross-system voice audit vs LinkedIn Pieter and Nigel
  - Depends on: T038, T039 (templates must be generated first)
  - Compare generated deal template voice against LinkedIn Pieter v0.130 output samples
  - Compare against LinkedIn Nigel v0.100 output samples
  - Verify consistent Barter voice across systems (factual, direct, creator-first)
  - Document any divergence with recommended alignment action
  - Priority: P1

- [x] T042 [P] Full end-to-end workflow test under 2 minutes
  - Test sequence: user prompt -> routing -> file loading -> generation -> DEAL scoring -> HVR check -> export
  - Measure: total interaction time from prompt to exported file
  - Target: under 2 minutes for standard deal, under 3 minutes for complex deal
  - Priority: P0

- [x] T043 Context window line count verification
  - Count total lines across all knowledge base files
  - Target: under 2,500 lines total for always-loaded + standard deal path
  - If over target: identify files for compression or splitting
  - Document final line count per file
  - Priority: P1

---

## Completion Criteria

- [x] All 43 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All P0 tasks verified with evidence
- [x] All P1 tasks verified with evidence or deferred with approval
- [x] Phase 5 integration tests passing (T038-T042)
- [x] Context window under 2,500 lines (T043)

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [ ] Load `spec.md` (in parent 001 folder if applicable) and verify scope alignment
2. [ ] Load `tasks.md` and find next uncompleted task
3. [ ] Verify task dependencies are satisfied (check all "Depends on" references)
4. [ ] Load relevant knowledge base file(s) for the task
5. [ ] Identify the workstream (W-A, W-B, or W-C) and confirm phase alignment
6. [ ] Check for blocking issues from prior tasks
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm understanding of success criteria for this specific task
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order within each phase |
| TASK-PAR | Tasks marked [P] within the same phase can run concurrently |
| TASK-SCOPE | Stay within task boundary, flag scope creep as new task |
| TASK-VERIFY | Verify each task against its acceptance criteria before marking complete |
| TASK-DOC | Update task status immediately on completion |
| TASK-PHASE | Complete all P0 tasks in a phase before moving to next phase |
| TASK-CROSS | Cross-reference checklist.md for verification items tied to each task |

### Status Reporting Format

```
## Status Update - [YYYY-MM-DD HH:MM]
- **Task**: T### - [Description]
- **Workstream**: W-[A/B/C]
- **Phase**: [1-5]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED | DEFERRED]
- **Evidence**: [File path, line numbers, or test output]
- **Blockers**: [None | Description with blocking task reference]
- **Next**: T### - [Next task description]
```

---

## Workstream Organization

### W-A: System Infrastructure (Phases 1-2)

**Scope**: System Prompt, HVR, Standards, AGENTS.md, README.md, Brand Context

| Task | Phase | Priority | Parallelizable | Description |
|------|-------|----------|---------------|-------------|
| T001 | 1 | P0 | Yes | Fix AGENTS.md file references |
| T002 | 1 | P0 | Yes | Fix System Prompt routing references |
| T003 | 1 | P0 | Yes | Create missing directories |
| T004 | 1 | P0 | Yes | Restore EUR values in Brand Context |
| T005 | 1 | P0 | No | Canonicalize DEAL dimension names |
| T006 | 1 | P0 | No | Update Standards.md dimensions |
| T007 | 1 | P0 | No | Update DEPTH Framework dimensions |
| T008 | 1 | P0 | Yes | Update README.md inventory |
| T009 | 2 | P0 | No | Add 15+ hard blocker words |
| T010 | 2 | P0 | Yes | Add 18+ phrase blockers |
| T011 | 2 | P1 | Yes | Fix US to UK English |
| T012 | 2 | P1 | No | Add emotional language prohibition |
| T013 | 2 | P1 | Yes | Reconcile Brand Context blacklist |
| T014 | 2 | P1 | No | Add tone alignment checkpoint |
| T015 | 2 | P1 | Yes | Fix scoring integration references |
| T016 | 2 | P1 | No | Add self-correction diagnostic matrix |
| T017 | 2 | P1 | No | Version bump HVR to v0.110 |

### W-B: Content Enhancement (Phases 3-4)

**Scope**: Deal Type Product, Deal Type Service, Industry Modules, Market Data, DEPTH Framework, Interactive Mode

| Task | Phase | Priority | Parallelizable | Description |
|------|-------|----------|---------------|-------------|
| T018 | 3 | P1 | No | Add per-dimension scoring minimums |
| T019 | 3 | P1 | Yes | Add tiered validation thresholds |
| T020 | 3 | P1 | No | Fix score range 17-19 overlap |
| T021 | 3 | P1 | Yes | Add score-band revision guidance |
| T022 | 3 | P2 | Yes | Add value-proportionate calibration |
| T023 | 3 | P1 | No | Resolve variation scaling contradiction |
| T024 | 3 | P1 | Yes | Standardise word count targets |
| T025 | 3 | P1 | Yes | Standardise section headers |
| T026 | 4 | P1 | No | Add failing product example |
| T027 | 4 | P1 | Yes | Add tech/food/home product examples |
| T028 | 4 | P1 | Yes | Add multi-product deal guidance |
| T029 | 4 | P2 | Yes | Add surprise box/seasonal handling |
| T030 | 4 | P1 | No | Add service value ranges section |
| T031 | 4 | P1 | Yes | Add non-Amsterdam service examples |
| T032 | 4 | P0 | Yes | Fix 3-item niche HVR violation |
| T033 | 4 | P1 | Yes | Add solo/time-sensitive deal guidance |
| T034 | 4 | P1 | No | Add 3 new industry modules |
| T035 | 4 | P1 | Yes | Add freshness dates and benchmarks |
| T036 | 4 | P1 | Yes | Add edge cases to Interactive Mode |
| T037 | 4 | P2 | No | Add $batch command |

### W-C: Quality and Integration (Phase 5)

**Scope**: Cross-system audit on all 12 files

| Task | Phase | Priority | Parallelizable | Description |
|------|-------|----------|---------------|-------------|
| T038 | 5 | P0 | No | Generate and score 3 product templates |
| T039 | 5 | P0 | Yes | Generate and score 3 service templates |
| T040 | 5 | P0 | Yes | HVR compliance audit |
| T041 | 5 | P1 | No | Cross-system voice audit |
| T042 | 5 | P0 | Yes | End-to-end workflow test |
| T043 | 5 | P1 | No | Context window line count verification |

---

## Dependency Graph

```
Phase 1 (all P0):
  T001 ──┐
  T002 ──┤
  T003 ──┤── can run in parallel
  T004 ──┤
  T008 ──┘
  T005 ──> T006 ──> (Phase 2)
       └─> T007 ──> (Phase 2)

Phase 2 (P0/P1):
  T009 ──┐
  T010 ──┤── can run in parallel
  T011 ──┤
  T015 ──┘
  T009 + T010 ──> T013 (reconcile after HVR updates)
  T012 ──> T014 ──> T016 (sequential: build on each other)
  T009 + T010 + T011 + T012 + T014 + T016 ──> T017 (version bump last)

Phase 3 (P1):
  T018 ──┐
  T020 ──┤── scoring fixes
  T021 ──┘
  T019 ──> T023 (tiers before scaling resolution)
  T024 ──┐
  T025 ──┘── can run in parallel

Phase 4 (P1/P2):
  T026 ──┐
  T027 ──┤
  T028 ──┤── product tasks, mostly parallel
  T029 ──┘
  T030 ──┐
  T031 ──┤
  T032 ──┤── service tasks, mostly parallel
  T033 ──┘
  T034, T035, T036, T037 ── independent

Phase 5 (P0/P1):
  T038 + T039 ──> T040 (audit after generation)
  T038 + T039 ──> T041 (voice audit after generation)
  T042 ──── independent (can run in parallel with T040/T041)
  T043 ──── independent
```

---

## Cross-References

- **Specification**: See `specs/002-barter-deals/002-deal-templates/001-initial-creation/spec.md`
- **Checklist**: See `checklist.md` (this subfolder)
- **Implementation Summary**: See `implementation-summary.md` (this subfolder)
- **Prior Work**: See `specs/002-barter-deals/002-deal-templates/001-initial-creation/` for initial system creation docs
