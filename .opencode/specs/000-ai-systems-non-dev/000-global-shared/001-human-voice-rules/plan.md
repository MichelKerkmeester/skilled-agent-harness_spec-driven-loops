# Plan: Human Voice Rules Refinement

## Metadata
| Field | Value |
|---|---|
| Spec ID | 004 |
| Plan Version | 0.1.0 |
| Status | Draft |
| Created | 2026-02-10 |

## 1. Approach

This plan follows a 4-phase approach: Global first, then extensions, then validation, then version control. The Global HVR file is the single source of truth. All changes start there. Extensions are then reviewed for consistency and conflicts with the updated global rules.

### Guiding Principles
- Changes flow top-down: Global HVR first, extensions second
- Preserve all existing numbering (use Part 0, do not renumber)
- Preserve all extension override mechanics (Pieter em dash, Nigel semicolon, Nigel formal transitions)
- Every new word/phrase gets a replacement suggestion (never ban without offering an alternative)
- Cross-validate after every phase

## 2. Phases

### Phase 1: Global HVR Updates (Primary)
**Duration estimate:** 1-2 hours
**Risk:** Medium (largest scope of change)

#### Step 1.1: Add Part 0 - Voice Directives
Insert a new section before the existing Part 1. This section defines the positive voice to aim for:

Content to include:
- Active voice directive with before/after examples
- Direct reader address ("you"/"your") directive
- Conciseness and clarity directive
- Natural/conversational tone directive
- Sentence rhythm rule (vary short, medium, long)
- Authenticity directive (keep it real)
- Practical focus directive (actionable content)
- Conditional language principle (prefer certainty when facts support it)
- Data-backed claims directive (use evidence and examples)

Format: Match the existing YAML code block style used throughout the document.

#### Step 1.2: Add New Hard Blocker Words
Add to Section 4 (extended blockers):
- enlightening (use "helpful" or "informative" instead)
- esteemed (use "respected" or remove entirely)
- skyrocket / skyrocketing (use "increase" or "grow" with specific numbers)
- utilize / utilizing (use "use" instead)
- remarkable (use "notable" or state what makes it notable)

#### Step 1.3: Add New Soft Deduction -2 Words
Add to Section 7:
- discover (when used as hype: "discover our new..." Use "find" or "see" instead)
- "remains to be seen" (use "we don't know yet" or state what is uncertain)
- "glimpse into" (use "look at" or "overview of")
- "you're not alone" / "not alone" (as AI comfort phrase. State the specific commonality)

#### Step 1.4: Add New Soft Deduction -1 Words
Add to Section 8:
- stark (use "clear" or "sharp")
- boost (when used as hype filler. Use "increase" or "improve")
- powerful (when used as filler adjective. Use "effective" or state the specific capability)
- inquiries (use "questions")
- "opened up" (use specific verb: "created", "enabled", "started")
- probably (state confidence level directly or remove)
- imagine (as setup phrase: "Imagine a world where...". State directly)
- exciting (as AI enthusiasm. State the specific reason for interest)

#### Step 1.5: Add New Phrase Blockers
Add to Section 5:
- "In a world where" (-5, already in banned metaphors but needs explicit phrase blocker listing)
- "You're not alone" (-5, AI comfort phrase)

#### Step 1.6: Add Word Form Variants
- Add "crafting" to the existing "craft" entry in Section 7 (-2 deductions)
- Add "exciting" as a new context flag in Section 9 (alongside existing "excited" flag)

#### Step 1.7: Update Pre-Publish Checklist
Add to Section 10 under a new "voice" category:
- "Active voice used throughout"
- "Reader addressed directly where appropriate"
- "Sentences vary in length (not all same pattern)"
- "No hedging when certainty is possible"

### Phase 2: Extension Review (Secondary)
**Duration estimate:** 30-60 minutes
**Risk:** Low (mostly consistency checks)

#### Step 2.1: Copywriter Extension Review
- Check: Does the existing tone guidance ("Professional but accessible B2B marketing copy. Direct statements, specific claims with evidence, active voice.") align with the new Part 0?
- Expected result: Already aligned. No changes needed.

#### Step 2.2: Barter Deals Extension Review
- Check: Do the violation examples align with new voice directives?
- Check: Are any new hard blockers used in the existing examples?
- Expected result: No changes needed.

#### Step 2.3: Nigel de Lange Extension Review
- Check: Does the formal transition allowance (however, furthermore, moreover) conflict with the new conditional language principle?
- Resolution: No conflict. The conditional language principle is about hedging (could, might, may), not formal transitions.
- Check: Are any new hard blockers present in Nigel's additional blockers?
- Expected result: No changes needed. Nigel already has additional hard blockers that overlap with the new global ones.

#### Step 2.4: TikTok Extension Review
- Check: Does "casual, conversational tone" align with new global Voice Directives?
- Consider: Add bullet point guidance for TikTok-specific content
- Expected result: Minor addition possible (bullet points note).

#### Step 2.5: Pieter Bertram Extension Review
- Check: Does the em dash override still make sense with new voice directives?
- Resolution: Yes. Voice directives are about tone and clarity, not punctuation. Pieter's override is unaffected.
- Check: Are any new hard blockers already listed in Pieter's additional blockers?
- Expected result: No changes needed.

### Phase 3: Cross-Validation
**Duration estimate:** 30 minutes
**Risk:** Low

#### Step 3.1: Conflict Detection
- Run through every extension override and verify it still makes sense after global changes
- Verify no new global hard blocker word appears in any extension's allowed/override list
- Verify the conditional language principle does not conflict with Nigel's formal transition allowance

#### Step 3.2: Example Validation
- Check all new before/after examples for compliance with the full HVR rule set
- Ensure no example text contains a hard blocker word
- Ensure no example text uses banned punctuation (unless demonstrating a "wrong" example)

#### Step 3.3: Completeness Check
- Verify every new word has a replacement suggestion
- Verify every new rule has at least one example
- Verify the pre-publish checklist covers all new rules

### Phase 4: Version Control
**Duration estimate:** 15 minutes
**Risk:** Low

#### Step 4.1: Version Bump
- Global HVR: v0.100 to v0.101
- Extensions: Only bump versions for files that receive changes

#### Step 4.2: Changelog Entry
- Document all changes made in this refinement
- Reference this spec (004) in the changelog

#### Step 4.3: Table of Contents Update
- Update the Global HVR table of contents to include new Part 0
- Verify all section references still work

## 3. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| Global HVR must be updated before extension review | Sequential | Extensions reference global rules |
| All new words need replacement suggestions | Prerequisite | Part of the word addition steps |
| Extension reviews are independent of each other | Parallel | Steps 2.1-2.5 run in parallel |
| Cross-validation requires all Phase 1-2 changes | Sequential | Phase 3 depends on Phase 1 and Phase 2 |

## 4. Rollback Strategy

If changes cause issues:
1. Revert Global HVR to v0.100 (current version)
2. Revert any modified extensions to their current versions
3. Document the issue in this spec folder for future reference

All changes are in Markdown files with no runtime dependencies. Rollback is a file-level revert.

## 5. Non-Functional Requirements

### Backward Compatibility
- All existing extension overrides must continue to function
- No existing scoring integration should break
- The MEQT, DEAL and CONTENT scoring formulas do not change

### Maintainability
- New Part 0 follows the same YAML code block format as existing parts
- New words follow the exact same entry format as existing words in their sections
- Pre-publish checklist additions use the same format as existing items

### Documentation Quality
- Every new rule has at least 1 concrete example
- Every new banned word has a suggested replacement
- All examples follow the existing "wrong/right" format
