# Implementation Summary: Human Voice Rules Refinement

## Metadata
| Field | Value |
|---|---|
| Spec ID | 004 |
| Status | Complete (Phase 1 + Phase 2) |
| Date | 2026-02-10 |
| Global HVR Version | v0.100 → v0.101 |
| Extensions Modified | 0 of 5 |

## Overview

This implementation addressed the styling differences between a source writing-style document and the Barter Human Voice Rules (HVR) system. The core gap was that the HVR was entirely avoidance-based (what NOT to do) with no positive voice directives (what TO do). Additionally, approximately 20 banned words/phrases from the source were missing from the HVR.

All changes were applied to the Global HVR file. No extensions required modification.

## Changes Applied

### Phase 1: Global HVR Updates (T1-T9)

#### T1 + T2 + T7: Part 0 Voice Directives (NEW SECTION)
**Impact: HIGH — Structural addition**

Added `# PART 0: VOICE DIRECTIVES` before existing Part 1. This is the single largest change, transforming the HVR from a purely restrictive document into one that also defines the target voice.

**Content added:**
- **Section 0.1 — Voice Principles** (9 directives in YAML format):
  1. Active voice (subject before verb)
  2. Direct address (you/your)
  3. Conciseness (cut fluff, fewer words)
  4. Simple language (common words preferred)
  5. Clarity (one idea per sentence)
  6. Conversational tone (read aloud test)
  7. Authenticity (honest, no marketing spin)
  8. Practical focus (actionable, data-backed)
  9. Sentence rhythm (vary short/medium/long)

- **Section 0.2 — Certainty Principle:**
  "Prefer certainty when facts support it." Targets unnecessary hedging while explicitly allowing honest uncertainty. Includes acceptable hedge example.

- **Table of Contents** updated with Part 0 entry.

Each directive includes at least 2 before/after examples in the same YAML code block format used throughout the document.

#### T3: New Hard Blocker Words (-5 points each)
**Impact: MEDIUM — 7 new entries**

Added to Section 4 (extended list). Previously also added to Sections 11 and 12, which were later removed in Phase 2:

| Word | Replacement |
|---|---|
| enlightening | "helpful" or "informative" |
| esteemed | "respected" or remove |
| remarkable | "notable" or state specifics |
| skyrocket | "increase" or "grow" + number |
| skyrocketing | "increasing" or "growing" + number |
| utilize | "use" |
| utilizing | "using" |

#### T4: New Soft Deductions -2
**Impact: LOW — 4 new entries**

Added to Section 7:

| Word/Phrase | Context |
|---|---|
| discover | When used as hype ("discover our new...") |
| "remains to be seen" | Classic AI hedging phrase |
| "glimpse into" | AI-typical phrasing |
| "you're not alone" | AI comfort phrase |

#### T5: New Soft Deductions -1
**Impact: LOW — 8 new entries**

Added to Section 8 across appropriate sub-categories:

| Word | Sub-Category |
|---|---|
| probably | hedging |
| stark | weak_adjectives |
| powerful | weak_adjectives |
| opened up | vague_verbs |
| imagine | ai_phrases |
| exciting | ai_phrases |
| boost | buzzwords |
| inquiries | buzzwords |

#### T6: New Phrase Blockers (-5 points each)
**Impact: LOW — 2 new entries**

Added to Section 5 and Section 12:
- "In a world where"
- "You're not alone"

#### T8: Word Form Variants
**Impact: MINIMAL**

- Updated "craft" to "craft / crafting" in Section 7
- Added cross-reference to "excited" entry in Section 9 pointing to "exciting" in Section 8

#### T9: Pre-Publish Checklist Update
**Impact: MEDIUM — New checklist category**

Added `voice:` category to Section 10 with 5 items:
1. Active voice used throughout
2. Reader addressed directly where appropriate
3. Sentences vary in length
4. No hedging when certainty is possible
5. Claims backed by data or examples

### Phase 2: Extension Reviews (T10-T14)

All 5 extensions were reviewed for conflicts with the new global rules.

| Extension | Version | Conflicts | Changes |
|---|---|---|---|
| Copywriter | v0.102 | None | No change |
| Barter Deals | v0.100 | None | No change |
| Nigel de Lange | v0.100 | None | No change |
| TikTok | v0.110 | None | No change |
| Pieter Bertram | v0.100 | None | No change |

**Key findings:**
- Nigel's formal transition allowance (however, furthermore, moreover) confirmed NON-CONFLICTING with certainty principle — transitions are structural connectors, not hedging
- Pieter's em dash override confirmed UNAFFECTED — voice directives don't touch punctuation rules
- TikTok's "short, punchy sentences" COMPLEMENTS the global sentence rhythm directive
- Nigel has 4 redundant hard blockers (already in global) — optional cleanup
- Pieter has 9 redundant hard blockers (already in global) — optional cleanup

### Phase 3: Validation (T15)

#### Cross-Validation Results

| Check | Result |
|---|---|
| No extension override conflicts | PASS |
| No new hard blocker in examples | FAIL → FIXED |
| All Part 0 examples comply with HVR | PASS |
| Every new word has replacement | PASS |
| Table of Contents accuracy | PASS |
| Section 12 alphabetical sort | PASS |

**Issue found and fixed:** The existing "right:" example in Section 3.3 (Unnecessary Modifiers) contained "The results were remarkable." Since "remarkable" is now a hard blocker, this was changed to "The results were significant."

#### Version Bump
- Global HVR: v0.100 → v0.101
- File renamed: `Rules - Human Voice - v0.101.md`
- No extension version bumps needed

## Architectural Decisions Followed

| ADR | Decision | Outcome |
|---|---|---|
| ADR-001 | Use "Part 0" numbering (no renumbering) | All existing Part 1-6 references preserved |
| ADR-002 | Use existing 3-tier severity system | New words classified as hard/-5, soft/-2, or soft/-1 |
| ADR-003 | Do NOT ban can/may/that/it | Certainty principle addresses intent without banning fundamental words |
| ADR-004 | Preserve all extension overrides | Pieter em dashes, Nigel semicolons + formal transitions all confirmed unaffected |

## Phase 2: Token Reduction

### Approach

After Phase 1 expanded the file to ~962 lines / ~7,800 tokens, the user chose **Option C: Aggressive reduction (~45% target)**. The goal was to eliminate redundancy and compress verbose formatting without losing any rule content.

### Changes Applied

| # | Edit | What Changed | Lines Saved |
|---|---|---|---|
| 1 | **Removed Section 12** (Alphabetical Memorise List) | Pure duplicate of Sections 4+5. Every word/phrase already existed elsewhere. | ~100 |
| 2 | **Removed Section 11** (Quick Fix Table) | Near-duplicate of Sections 2-5. Compensated by adding `# replacement` comments to all 15 core hard blocker entries in Section 4. | ~50 |
| 3 | **Removed Section 2.4** (Setup Replacement Examples) | Redundant with Section 2.3 (banned setup phrases list) + Section 5 (phrase blockers). | ~15 |
| 4 | **Trimmed Part 0 examples** | Reduced from 2 examples per directive to 1. Fixed duplicate "35% across 12 pilot companies" example (kept in authenticity, replaced in practical_focus with "Acme Corp" example). | ~30 |
| 5 | **Compressed Section 6** | Converted 5-line-per-entry verbose format to 1-line inline `# blocked: X \| allowed: Y` comments. | ~25 |
| 6 | **Compressed Section 3.1** | Converted `pattern:` + `fix:` two-line YAML format to compact `"phrase" → "fix"` inline format. | ~10 |
| 7 | **Updated TOC** | Removed Section 11 and 12 references. Part 6 now only contains Section 10 (Pre-Publish Checklist). | ~5 |

### Verification Results

All 7 edits verified against final file:

| Check | Status |
|---|---|
| Part 0 has 9 directives with 1 example each + certainty principle | PASS |
| Section 2.4 removed (no "Replacement Examples" sub-section) | PASS |
| Section 3.1 uses compact `"phrase" → "fix"` format | PASS |
| Section 4 core_15 entries all have `# replacement` comments (15/15) | PASS |
| Section 6 uses compact 1-line inline format | PASS |
| Section 10 (Pre-Publish Checklist) intact with `voice:` category | PASS |
| Sections 11 and 12 completely removed | PASS |
| TOC only references Section 10 under Part 6 | PASS |
| No formatting artifacts or broken YAML | PASS |

### Final Metrics

| Metric | Before Phase 1 | After Phase 1 | After Phase 2 | Change |
|---|---|---|---|---|
| Lines | ~788 | ~962 | 735 | -24% from Phase 1 peak; -7% from original |
| Words | — | — | 3,611 | — |
| Characters | — | — | 25,645 | — |
| Est. tokens | ~6,400 | ~7,800 | ~5,500 | -29% from Phase 1 peak |

**Note:** The 45% reduction target was optimistic. The actual reduction from the Phase 1 peak was ~29%. The remaining content is dense rule definitions with little further compressibility without removing actual rules. The file is now leaner than the original pre-Phase-1 baseline while containing significantly more content (Part 0 voice directives, 21 new word/phrase entries, certainty principle, voice checklist items).

---

## Quantitative Summary

| Metric | Value |
|---|---|
| Lines added to Global HVR | ~174 |
| New sections created | 1 (Part 0: 3 sub-sections) |
| New hard blocker words | 7 |
| New soft -2 entries | 4 |
| New soft -1 entries | 8 |
| New phrase blockers | 2 |
| New checklist items | 5 |
| New quick fix entries | 7 |
| Word entries updated | 2 (craft, excited) |
| Existing examples fixed | 1 (remarkable → significant) |
| Extensions requiring changes | 0 |
| Validation checks passed | 6/6 (1 after fix) |

## Items NOT Implemented (Deliberately Rejected)

Per spec.md Section 5:
- Banning "can", "may", "that", "it" globally
- "Avoid markdown" rule
- Casual grammar simplification
- Broad dash ban (en dashes, hyphens)
- "Use bullet points in social media" as global rule

## Optional Follow-Up Work

These are non-urgent improvements identified during extension reviews:
1. **Nigel extension cleanup:** Remove 4 redundant hard blockers (nurture, resonate, empower, curate) that are now global
2. **Pieter extension cleanup:** Remove 9 redundant hard blockers (leverage, foster, nurture, resonate, harness, elevate, robust, paradigm, seamless) that are now global
3. **TikTok version note:** Active version is v0.110 (not v0.100 as originally scoped)

## Success Criteria Verification

| Criterion | Status |
|---|---|
| Global HVR has Part 0 Voice Directives with A1-A11 adapted | ✅ |
| Sentence rhythm rule with concrete examples | ✅ |
| All 5+ new hard blocker words added to Section 4 | ✅ (7 added) |
| All 4+ new soft -2 words/phrases added to Section 7 | ✅ (4 added) |
| All 8+ new soft -1 words added to Section 8 | ✅ (8 added) |
| New phrase blockers added to Section 5 | ✅ (2 added) |
| Conditional language principle stated in Voice Directives | ✅ |
| Word form variants (crafting, exciting) added | ✅ |
| All 5 extensions reviewed for consistency | ✅ |
| No extension override conflicts introduced | ✅ |
| Version bump to v0.101 applied | ✅ |
| Pre-publish checklist updated with voice directive checks | ✅ |

**All 12 success criteria met.**
