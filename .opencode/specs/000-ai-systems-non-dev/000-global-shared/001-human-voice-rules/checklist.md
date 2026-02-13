# Checklist: Human Voice Rules Refinement

## Metadata
| Field | Value |
|---|---|
| Spec ID | 004 |
| Created | 2026-02-10 |
| Status | Draft |

## P0 - Blockers (MUST complete)

### Global HVR Structure
- [ ] Part 0: Voice Directives section exists before Part 1
- [ ] Part 0 contains all 9 voice directives with examples
- [ ] Conditional language principle stated with examples
- [ ] Sentence rhythm rule included with before/after examples
- [ ] Existing Part 1-6 numbering unchanged

### New Hard Blockers
- [ ] "enlightening" added to Section 4 extended blockers
- [ ] "esteemed" added to Section 4 extended blockers
- [ ] "skyrocket" added to Section 4 extended blockers
- [ ] "utilize" / "utilizing" added to Section 4 extended blockers
- [ ] "remarkable" added to Section 4 extended blockers
- [ ] All 5 words added to Section 12 alphabetical list
- [ ] All 5 words have replacement suggestions (# comment)

### Cross-Validation
- [ ] No extension override conflicts with new global rules
- [ ] No new hard blocker appears in any extension's allowed list
- [ ] Table of Contents updated for Part 0
- [ ] Version bump applied: v0.100 to v0.101

## P1 - Required (MUST complete OR user-approved deferral)

### New Soft Deductions
- [ ] 4 new -2 entries added to Section 7 (discover, remains to be seen, glimpse into, you're not alone)
- [ ] 8 new -1 entries added to Section 8 (stark, boost, powerful, inquiries, opened up, probably, imagine, exciting)
- [ ] All new entries have notes explaining context and replacement
- [ ] Format matches existing entries in each section

### New Phrase Blockers
- [ ] "In a world where" added to Section 5
- [ ] "You're not alone" added to Section 5
- [ ] Both added to Section 12 alphabetical phrase list
- [ ] Quick Fix Table (Section 11) updated with new entries

### Pre-Publish Checklist Update
- [ ] New "voice" category added to Section 10
- [ ] Contains: active voice, direct address, sentence variety, no hedging, data-backed claims
- [ ] Format matches existing checklist categories

### Conditional Language Principle
- [ ] Principle stated in Part 0 (not just word-level deductions)
- [ ] Includes acceptable hedging note (genuine uncertainty is OK)
- [ ] Has before/after examples

### Extension Reviews
- [ ] Copywriter extension reviewed (conflict check)
- [ ] Barter deals extension reviewed (example check)
- [ ] Nigel extension reviewed (formal transitions vs conditional language)
- [ ] TikTok extension reviewed (casual tone alignment)
- [ ] Pieter extension reviewed (em dash override unaffected)

## P2 - Optional (Can defer without approval)

### Word Form Variants
- [ ] "crafting" added alongside "craft" in Section 7
- [ ] "exciting" added as context flag in Section 9

### Documentation Polish
- [ ] All new YAML examples follow existing indentation style
- [ ] No typos in new content
- [ ] Section 12 alphabetical list correctly sorted after additions
- [ ] Quick Fix Table entries have consistent formatting

### Extension Enhancements
- [ ] TikTok: bullet point guidance considered
- [ ] Nigel: redundant hard blockers noted (now covered by global)
- [ ] Pieter: redundant hard blockers noted (now covered by global)

## Verification Notes

### How to Verify Cross-Validation
1. List all new hard blocker words
2. Search each extension file for those words
3. Confirm none appear in "allowed" or "override" sections
4. Confirm Nigel's formal transition words (however, furthermore, moreover) are NOT affected by the conditional language principle (they are transitions, not hedges)

### How to Verify Table of Contents
1. Check that Part 0 header appears in TOC
2. Check that all Part 0 sub-section anchors link correctly
3. Check that existing Part 1-6 links still work

### Rejected Items (documented, NOT to implement)
- Do NOT ban "can", "may", "that", "it" globally
- Do NOT add "avoid markdown" rule
- Do NOT add casual grammar simplification to global rules
- Do NOT ban dashes broadly (only em dashes are banned)
- See spec.md Section 5 for full rejection rationale
