# Tasks: Human Voice Rules Refinement

## Metadata
| Field | Value |
|---|---|
| Spec ID | 004 |
| Total Tasks | 15 |
| Status | Draft |
| Created | 2026-02-10 |

## Phase 1: Global HVR Updates

### T1: Add Part 0 - Voice Directives Section
**Priority:** P0 (Blocker)
**Depends on:** None
**Estimate:** 30 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add a new "Part 0: Voice Directives" section before the existing Part 1. This is the highest-impact change: it transforms the HVR from a purely restrictive document into one that also defines the target voice.

**Content to create:**
- Section header: "# PART 0: VOICE DIRECTIVES"
- Sub-section: "## 0. Voice Directives"
- 9 directives in YAML code block format matching existing document style:
  1. Active voice (with passive voice detection guidance)
  2. Direct reader address ("you"/"your")
  3. Conciseness (be direct, cut fluff)
  4. Simple language (prefer common words)
  5. Clarity focus (one idea per sentence)
  6. Natural/conversational tone
  7. Authenticity (honest, real, no marketing hype)
  8. Practical focus (actionable insights, data-backed claims)
  9. Sentence rhythm (vary short/medium/long)
- Conditional language principle as sub-section 0.2

**Acceptance Criteria:**
- [ ] Part 0 appears before Part 1 in the document
- [ ] All 9 directives have at least 1 before/after example
- [ ] YAML code block format matches existing document style
- [ ] Conditional language principle is stated with examples
- [ ] No existing section numbering is changed

### T2: Add Sentence Rhythm Rule (Detail for T1 Item 9)
**Priority:** P1 (Required)
**Depends on:** T1 (T1 creates the Part 0 skeleton with all 9 directives. T2 expands directive #9 with detailed YAML content, guidance and examples.)
**Estimate:** 10 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Expand the sentence rhythm directive created in T1 with detailed YAML content. T1 establishes the directive as one of 9 items. T2 fills in the specific guidance, word count ranges and before/after examples.

**Content:**
```yaml
sentence_rhythm:
  directive: "Vary sentence lengths to create rhythm"
  guidance:
    - "Mix short sentences (under 8 words) with medium (8-15) and long (15-25)"
    - "Use a short sentence after a complex idea for impact"
    - "Read your text aloud. If it sounds monotonous, vary the lengths."
  examples:
    - monotonous: "The platform processes data efficiently. The platform handles millions of requests daily. The platform scales automatically when needed."
      improved: "The platform processes data efficiently. Millions of requests daily. It scales when load increases, without manual intervention."
```

**Acceptance Criteria:**
- [ ] Rule is included in Part 0
- [ ] Has concrete before/after examples
- [ ] Guidance is practical, not abstract

### T3: Add New Hard Blocker Words
**Priority:** P0 (Blocker)
**Depends on:** None
**Estimate:** 15 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add 5 new words to the hard blocker list in Section 4 (extended blockers) and the alphabetical list in Section 12.

**Words to add:**
| Word | Replacement | Rationale |
|---|---|---|
| enlightening | "helpful" or "informative" | AI-typical enthusiasm word |
| esteemed | "respected" or remove | Formal AI language |
| skyrocket | "increase" or "grow" + number | Hype verb |
| utilize / utilizing | "use" | Unnecessarily formal |
| remarkable | "notable" or state specifics | Marketing filler |

**Acceptance Criteria:**
- [ ] All 5 words added to Section 4 extended blockers with # comment for replacement
- [ ] All 5 words added to Section 12 alphabetical list in correct position
- [ ] Quick Fix Table (Section 11) updated with entries for each new word

### T4: Add New Soft Deduction -2 Words
**Priority:** P1 (Required)
**Depends on:** None
**Estimate:** 15 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add 4 new entries to Section 7 (Soft Deductions -2).

**Words/phrases to add:**
| Word/Phrase | Note | Replacement |
|---|---|---|
| discover | When used as hype ("discover our new...") | "find" or "see" |
| "remains to be seen" | Classic AI hedging phrase | "we don't know yet" or state uncertainty directly |
| "glimpse into" | AI-typical phrasing | "look at" or "overview of" |
| "you're not alone" | AI comfort/empathy phrase | State the specific commonality instead |

**Acceptance Criteria:**
- [ ] All 4 entries added to Section 7 with note and replacement
- [ ] Format matches existing entries in that section

### T5: Add New Soft Deduction -1 Words
**Priority:** P1 (Required)
**Depends on:** None
**Estimate:** 15 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add 8 new entries to Section 8 (Soft Deductions -1).

**Words to add:**
| Word | Category | Note |
|---|---|---|
| stark | weak_adjectives | Use "clear" or "sharp" instead |
| boost | buzzwords | When used as hype. Use "increase" or "improve" |
| powerful | weak_adjectives | When used as filler. Use "effective" or state capability |
| inquiries | buzzwords | Use "questions" instead |
| "opened up" | vague_verbs | Use specific verb: "created", "enabled", "started" |
| probably | hedging | State confidence directly or remove |
| imagine | ai_phrases | As setup phrase. State directly instead |
| exciting | ai_phrases | As AI enthusiasm. State specific reason for interest |

**Acceptance Criteria:**
- [ ] All 8 entries added to Section 8 in appropriate sub-categories
- [ ] Format matches existing entries
- [ ] Each has a note explaining context and replacement

### T6: Add New Phrase Blockers
**Priority:** P1 (Required)
**Depends on:** None
**Estimate:** 10 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add 2 new entries to Section 5 (Phrase Hard Blockers) and the alphabetical list in Section 12.

**Phrases to add:**
- "In a world where" (already in banned metaphors Section 3.1 but needs explicit listing as phrase blocker)
- "You're not alone" (AI comfort phrase)

**Acceptance Criteria:**
- [ ] Both phrases added to Section 5 YAML list
- [ ] Both phrases added to Section 12 alphabetical phrase list
- [ ] Quick Fix Table (Section 11) updated with entries

### T7: Strengthen Conditional Language Principle
**Priority:** P1 (Required)
**Depends on:** T1 (placed within Part 0)
**Estimate:** 10 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add a sub-section within Part 0 that elevates the conditional language guidance from word-level deductions to a stated principle.

**Content:**
```yaml
certainty_principle:
  directive: "Prefer certainty when facts support it"
  rationale: "Hedging weakens claims. When you know something is true, state it directly."
  examples:
    - hedging: "This approach might improve results."
      direct: "This approach improves results."
    - hedging: "Users could potentially save time."
      direct: "Users save an average of 2 hours per week."
    - acceptable_hedge: "Early data suggests a 15% improvement, pending final results."
  note: "Hedging is acceptable when genuine uncertainty exists. The rule targets unnecessary hedging, not honest uncertainty."
```

**Acceptance Criteria:**
- [ ] Principle stated clearly with rationale
- [ ] Has wrong/right examples
- [ ] Includes note about acceptable hedging (genuine uncertainty)

### T8: Add Word Form Variants
**Priority:** P2 (Optional)
**Depends on:** None
**Estimate:** 5 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add missing word form variants to existing entries:
- Add "crafting" to the existing "craft" entry in Section 7
- Add "exciting" as a new context flag in Section 9 alongside existing "excited" flag

**Acceptance Criteria:**
- [ ] "crafting" listed alongside "craft" in Section 7
- [ ] "exciting" added as context flag in Section 9 with guidance

### T9: Update Pre-Publish Checklist
**Priority:** P1 (Required)
**Depends on:** T1
**Estimate:** 10 min
**File:** `0. Global (Shared)/rules/Rules - Human Voice - v0.100.md`

**Description:**
Add a new "voice" category to the pre-publish checklist in Section 10.

**Items to add:**
```yaml
voice:
  - "Active voice used throughout (no passive constructions)"
  - "Reader addressed directly where appropriate (you/your)"
  - "Sentences vary in length (not all same pattern)"
  - "No hedging when certainty is possible"
  - "Claims backed by data or examples where possible"
```

**Acceptance Criteria:**
- [ ] New "voice" category added to Section 10
- [ ] 5 items listed in the same format as existing checklist items

## Phase 2: Extension Reviews

### T10: Review Copywriter Extension
**Priority:** P2 (Optional)
**Depends on:** Phase 1 complete
**Estimate:** 10 min
**File:** `1. Copywriter/knowledge base/rules/Copywriter - Rules - Human Voice Extensions - v0.102.md`

**Description:**
Verify the existing tone guidance aligns with the new Part 0 voice directives. Check that no new hard blocker words appear in existing content.

**Acceptance Criteria:**
- [ ] Tone guidance reviewed for consistency
- [ ] No conflicts detected (or conflicts documented and resolved)
- [ ] Decision: change or no-change documented

### T11: Review Barter Deals Extension
**Priority:** P2 (Optional)
**Depends on:** Phase 1 complete
**Estimate:** 10 min
**File:** `2. Barter deals/knowledge base/rules/Barter deals - Rules - Human Voice Extensions - v0.100.md`

**Description:**
Verify violation examples don't contain any newly-banned words. Check consistency with new voice directives.

**Acceptance Criteria:**
- [ ] Examples reviewed for new hard blocker words
- [ ] No conflicts detected (or conflicts documented)
- [ ] Decision: change or no-change documented

### T12: Review Nigel de Lange Extension
**Priority:** P1 (Required)
**Depends on:** Phase 1 complete
**Estimate:** 15 min
**File:** `3. LinkedIn/Nigel de Lange/knowledge base/rules/Nigel de Lange - Rules - Human Voice Extensions - v0.100.md`

**Description:**
Critical review: Nigel's formal transition allowance (however, furthermore, moreover) must not conflict with the new conditional language principle. Also check if new hard blockers overlap with Nigel's additional blockers.

**Acceptance Criteria:**
- [ ] Formal transition allowance confirmed as non-conflicting with conditional language principle
- [ ] Overlap between new global hard blockers and Nigel's additional blockers identified
- [ ] Any duplicates noted (Nigel's become redundant if already in global)
- [ ] Decision: change or no-change documented

### T13: Review TikTok Extension
**Priority:** P2 (Optional)
**Depends on:** Phase 1 complete
**Estimate:** 10 min
**File:** `4. TikTok SEO & Creative Strategy/knowledge base/rules/TikTok - Rules - Human Voice Extensions - v0.100.md`

**Description:**
Review casual tone alignment with new global voice directives. Consider adding bullet point guidance for TikTok-specific content.

**Acceptance Criteria:**
- [ ] Casual tone confirmed as compatible with global directives
- [ ] Bullet point guidance considered (add or document why not)
- [ ] Decision: change or no-change documented

### T14: Review Pieter Bertram Extension
**Priority:** P2 (Optional)
**Depends on:** Phase 1 complete
**Estimate:** 10 min
**File:** `3. LinkedIn/Pieter Bertram/knowledge base/rules/Pieter Bertram - Rules - Human Voice Extensions - v0.100.md`

**Description:**
Verify em dash override is unaffected by new voice directives. Check new hard blocker overlap with Pieter's additional blockers.

**Acceptance Criteria:**
- [ ] Em dash override confirmed as unaffected
- [ ] Hard blocker overlap with Pieter's list identified
- [ ] Any duplicates noted (Pieter's become redundant if already in global)
- [ ] Decision: change or no-change documented

## Phase 3: Validation and Version Control

### T15: Cross-Validate and Version Bump
**Priority:** P0 (Blocker)
**Depends on:** All previous tasks
**Estimate:** 20 min
**Files:** All modified files

**Description:**
Final validation pass across all files. Then apply version bumps.

**Validation checks:**
1. No extension override conflicts with new global rules
2. No new hard blocker appears in any extension's allowed/override list
3. All new examples comply with the full HVR rule set
4. Every new word has a replacement suggestion
5. Table of Contents updated for new Part 0
6. Section 12 (alphabetical list) is correctly sorted after additions

**Version bumps:**
- Global HVR: v0.100 to v0.101
- Extensions: only if modified (bump by 0.001)

**Acceptance Criteria:**
- [ ] All 6 validation checks pass
- [ ] Version numbers updated in file headers
- [ ] Table of Contents accurate
- [ ] Alphabetical list correctly sorted
