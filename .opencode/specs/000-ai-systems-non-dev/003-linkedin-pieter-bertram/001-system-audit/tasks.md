<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: standard-v2 -->

# Tasks: LinkedIn Ghostwriter System Audit Fixes

## Task Overview

| Phase | Tasks | Priority | Status |
|-------|-------|----------|--------|
| Phase 1: Canonicalization | T01-T07 | P0 | Completed |
| Phase 2: Validation Hardening | T08-T11 | P1 | Completed |
| Phase 3: Synchronization | T12-T16 | P2 | Completed |
| Phase 4: Strategic | T17-T19 | P3 | Partial (T19 deferred) |

---

## Phase 1: Canonicalization (P0)

### T01: Compile Master Hard Blocker List
- [x] Extract all hard blockers from Voice DNA (~30 terms)
- [x] Extract all hard blockers from Quality Validators (~17 terms in blocker_10)
- [x] Extract all hard blockers from HVE (~9 terms)
- [x] Deduplicate into single master list
- [x] Categorize: AI vocabulary, corporate jargon, bro-culture, performative
- **Acceptance:** Single list with 35-40 unique terms, no duplicates
- **Completed:** QV v0.123 — 7 terms added to blocker_10, master list consolidated

### T02: Write Canonical Hard Blocker Section in QV
- [x] Replace QV blocker_10 with full master list
- [x] Remove "leverage" from Warning Flags (now only in hard blockers)
- [x] Add "nurture" and "resonate" from HVE
- [x] Add missing DNA terms: "hustle", "grind", "10X", "let me tell you", "you won't believe"
- [x] Verify all terms have replacement suggestions
- **Depends on:** T01
- **Acceptance:** QV contains complete hard blocker list; no term appears in both hard blockers AND warning flags
- **Completed:** QV v0.123 — duplicate "leverage" removed from Warning Flags

### T03: Update Voice DNA Hard Blocker Section
- [x] Replace current hard blocker list with reference: "See Quality Validators for canonical hard blocker list"
- [x] Keep vocabulary alternatives table (it adds value)
- [x] Verify no orphaned references
- **Depends on:** T02
- **Acceptance:** Voice DNA references QV, does not maintain independent hard blocker list
- **Completed:** Voice DNA v0.123 — HVE precedence rule fixed, references QV canonical list

### T04: Update HVE Hard Blocker Section + Precedence Rule
- [x] Replace hard blocker list with: "See QV for canonical list. Pieter-ADDITIONAL hard blockers below:"
- [x] Keep only genuinely Pieter-specific additions (if any beyond the canonical list)
- [x] Change precedence rule: "HVE may ADD rules and EXTEND penalties but NEVER downgrade QV hard blockers"
- [x] Change "It's worth noting" / "It's important to note" from -1 penalty to reference QV hard blocker
- **Depends on:** T02
- **Acceptance:** HVE cannot downgrade any hard blocker; precedence rule is explicit
- **Completed:** HVE v0.101 — precedence rule added, hard blocker reference to QV canonical list

### T05: Fix PRELOAD_GROUPS Keys
- [x] Rename existing keys to match detect_mode() output
- [x] Add missing groups: leadership_group, feature_group, creator_group, interactive_group
- [x] Define correct file sets for each new group
- [x] Test: verify all 11 modes resolve to correct group
- **Acceptance:** 11/11 modes match a PRELOAD_GROUPS key
- **Completed:** System Prompt v0.131 — all 11 PRELOAD_GROUPS keys aligned with detect_mode()

### T06: Canonicalize Pieter Test
- [x] Confirm canonical version in System Prompt (5 questions: Groundedness/Authenticity/Contribution/Coffee/Boldness)
- [x] In Interactive Mode: replace lines 587-594 with cross-reference to System Prompt
- [x] In DEPTH Framework: verify alignment, add cross-reference note
- **Acceptance:** Pieter Test defined in exactly 1 file; other files reference it
- **Completed:** System Prompt canonical; Interactive Mode v0.122 + DEPTH v0.122 reference it

### T07: Canonicalize Perspective Minimums
- [x] Define canonical table in System Prompt: Raw=0, Quick=2, Standard=3, Deep=5
- [x] In DEPTH Framework: replace local table with reference
- [x] In Interactive Mode: remove blanket "minimum 3", replace with reference
- **Acceptance:** Perspective table exists in exactly 1 file
- **Completed:** System Prompt canonical; Interactive Mode v0.122 + DEPTH v0.122 reference it

---

## Phase 2: Validation Hardening (P1)

### T08: Add 3-Item List Detection to QV
- [x] Add soft deduction rule: "Exactly 3-item list/sequence: -2 per occurrence"
- [x] Add guidance note: "Prefer 2, 4, or 5 items"
- [x] Add detection heuristic: "3 parallel phrases, 3 arrows, 3 one-word sentences"
- **Acceptance:** QV scores deduct for 3-item patterns
- **Completed:** QV v0.123 — 3-item list detection added as -2 deduction

### T09: Define Missing State Machine States
- [x] Add `engagement_routing` state: loads Engagement Rules, transitions to question or delivery
- [x] Add `optimize_routing` state: loads Platform Strategy, transitions to analysis or delivery
- [x] Verify both have actions, nextState, and waitForInput defined
- **Acceptance:** All state machine routes resolve to defined states
- **Completed:** Interactive Mode v0.122 — both routing states defined with full transitions

### T10: Resolve "influencer" Contradiction
- [x] Amend Hard Blocker 1 with exception clause for historical context usage
- [x] Add example in QV showing permitted vs rejected usage
- **Acceptance:** Clear rule with exception; no ambiguity
- **Completed:** QV v0.123 — influencer exception added for historical/factual context

### T11: Fix $feature Fallback Chain
- [x] Change fallback: "feature" → ["Context - Industry Extensions", "Voice DNA"]
- [x] Verify Section 3.1 SYMPATHETIC PATH alignment
- **Acceptance:** Feature fallback loads industry context
- **Completed:** Covered in T05 — System Prompt v0.131 PRELOAD_GROUPS fix

---

## Phase 3: Synchronization (P2)

### T12: Create Single Formatting Constraint Table
- [x] Define in Content Standards: arrows (2-5), hashtags (2-5), complete banned emoji list (7), CTA per energy level
- [x] Update QV scoring to reference this table
- [x] Update Voice DNA to reference this table
- **Acceptance:** One table, all files reference it, no conflicts
- **Completed:** Content Standards v0.123 — canonical formatting constraints table created

### T13: Fix Interactive Mode Section Reference
- [x] Line 40: "Section 4 Command Shortcuts" → "Section 3.1"
- [x] Line 749: Same fix
- **Acceptance:** Cross-reference points to correct section
- **Completed:** Interactive Mode v0.122 — section references corrected to 3.1

### T14: Fix System Prompt Filename References
- [x] "Context - Brand" → "Context - Brand Extensions"
- [x] "Context - Industry" → "Context - Industry Extensions"
- [x] Remove stale HTML comment (line 2) re: Canonical Stats Registry
- **Acceptance:** All referenced filenames match files on disk
- **Completed:** Covered in T05 — System Prompt v0.131

### T15: Fix "founder" Keyword Routing
- [x] Remove "founder" from $feature keywords in detect_mode()
- [x] Add "founder" to $personal keywords (or personal_journey synonyms)
- [x] Add replacement keywords for $feature: "startup spotlight", "celebrate founder"
- **Acceptance:** "Write about my founder journey" routes to $personal
- **Completed:** Covered in T05 — System Prompt v0.131

### T16: Fix AGENTS.md $raw Exception
- [x] Line 151: "except $quick" → "except $quick/$raw"
- **Acceptance:** $raw mode correctly exempted from wait-for-input rule
- **Completed:** AGENTS.md updated — $raw exception added

---

## Phase 4: Strategic (P3)

### T17: Add Cognitive Framework Arbitration Rule
- [x] Add to AGENTS.md: "Sequential Thinking Protocol = system reasoning. DEPTH = content creation."
- **Acceptance:** Clear scope boundary documented
- **Completed:** AGENTS.md updated — cognitive framework arbitration rule added

### T18: Clean Up Dead Code / Minor Issues
- [x] Remove unreachable Raw path in Interactive Mode processing state
- [x] Add `resetTo: start` in complete state
- [x] Add Voice DNA dependency note in DEPTH Framework
- [x] Fix topic-to-template mapping documentation
- **Acceptance:** No dead code; all states have explicit transitions
- **Completed:** Interactive Mode v0.122 dead code removed; DEPTH v0.122 Voice DNA dependency note added

### T19: CORINA Questionnaire Data Collection — DEFERRED
- [ ] Schedule session with Pieter
- [ ] Fill all sections of CORINA → MISSING_CONTEXT.md
- [ ] Update Context - Personal with verified data
- [ ] Version bump Context - Personal
- **Acceptance:** All CORINA fields populated with verified data
- **Status:** DEFERRED — requires Pieter's availability for data collection session
