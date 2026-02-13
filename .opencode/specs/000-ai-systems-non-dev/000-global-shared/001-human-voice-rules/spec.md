# Spec: Human Voice Rules Refinement

## Metadata
| Field | Value |
|---|---|
| Spec ID | 004 |
| Title | Human Voice Rules Refinement |
| Status | Draft |
| Level | 3 |
| Created | 2026-02-10 |
| Author | Orchestrator |
| Version | 0.1.0 |

## 1. Problem Statement

The Barter Human Voice Rules (HVR) system is strong on avoidance patterns (what NOT to do) but has no section defining positive voice directives (what TO do). A source document containing writing style prompts was analyzed and compared against the full HVR system (1 global file + 5 extensions). The analysis reveals 4 major gaps and approximately 20 new words/phrases that should be added to the blocker and deduction lists.

The current HVR v0.100 contains 6 parts across 12 sections, covering punctuation, structural patterns, content patterns, word-level rules, scoring framework and a quick reference. It governs all 6 Barter content systems. However, it tells content systems what to avoid without ever defining the target voice to aim for.

## 2. Scope

### In Scope
- Global HVR file: Rules - Human Voice - v0.100.md
- Copywriter extension: v0.102
- Barter deals extension: v0.100
- Nigel de Lange extension: v0.100
- TikTok extension: v0.100
- Pieter Bertram extension: v0.100

### Out of Scope
- Creating new extension files
- Changing scoring framework architecture
- Modifying MEQT, DEAL or CONTENT scoring integrations
- Changing extension override mechanics (e.g., Pieter's em dash allowance)

## 3. Source Document Analysis

The source document was categorized into 6 areas:

### 3.1 Voice and Tone Rules (Positive Directives)
| Rule ID | Directive | Example |
|---|---|---|
| A1 | Use active voice, avoid passive | "Management canceled the meeting." not "The meeting was canceled by management." |
| A2 | Address readers with "you" and "your" | "You'll find these strategies save time." |
| A3 | Be direct and concise | "Call me at 3pm." |
| A4 | Use simple language | "We need to fix this problem." |
| A5 | Stay away from fluff | "The project failed." |
| A6 | Focus on clarity | "Submit your expense report by Friday." |
| A7 | Maintain natural/conversational tone | "But that's not how it works in real life." |
| A8 | Keep it real / authentic | "This approach has problems." |
| A9 | Friendly tone of voice | Implicit throughout |
| A10 | Spartan and informative | Combined with A3/A5 |
| A11 | Focus on practical, actionable insights | Implicit throughout |

### 3.2 Sentence Structure Rules
| Rule ID | Directive | Example |
|---|---|---|
| B1 | Vary sentence structures for rhythm | "Stop. Think about what happened. Consider how we might prevent similar issues in the future." |
| B2 | Use short, impactful sentences | Combined with B1 |

### 3.3 Content Approach Rules
| Rule ID | Directive | Note |
|---|---|---|
| C1 | Use bullet point lists in social media | Platform-specific, not global |
| C2 | Use data and examples to support claims | Aligns with existing generalisation fixes |

### 3.4 Avoidance Rules (18 items)
Most already covered by Global HVR. See Gap Analysis (Section 4) for exceptions.

### 3.5 Banned Words (from source)
Full list: can, may, just, that, very, really, literally, actually, certainly, probably, basically, could, maybe, delve, embark, enlightening, esteemed, shed light, craft, crafting, imagine, realm, game-changer, unlock, discover, skyrocket, abyss, not alone, in a world where, revolutionize, disruptive, utilize, utilizing, dive deep, tapestry, illuminate, unveil, pivotal, intricate, elucidate, hence, furthermore, realm, however, harness, exciting, groundbreaking, cutting-edge, remarkable, it, remains to be seen, glimpse into, navigating, landscape, stark, testament, in summary, in conclusion, moreover, boost, skyrocketing, opened up, powerful, inquiries, ever-evolving

### 3.6 Formatting Rules
Avoid: em dashes, semicolons, oxford commas, asterisks, markdown, hashtags, emojis, dashes.

## 4. Gap Analysis

### 4.1 MAJOR GAP: No Positive Voice Directives Section
**Severity: HIGH**
The entire Global HVR is avoidance-based. It defines what to eliminate but never states what voice to aim for. Rules A1 through A11 from the source have no equivalent in the Global HVR. The Copywriter and TikTok extensions have partial tone guidance, but nothing exists at the global level.

**Recommendation:** Add a new "Part 0: Voice Directives" section to Global HVR, placed BEFORE the current Part 1 (Punctuation Rules). This establishes the target before defining restrictions.

### 4.2 MAJOR GAP: No Sentence Rhythm Rule
**Severity: MEDIUM**
Rule B1 ("Vary sentence structures for rhythm") has no equivalent anywhere in the HVR system. The TikTok extension mentions "short, punchy sentences" but the principle of varying length for rhythm is absent.

**Recommendation:** Add to the new Voice Directives section as a structural writing quality rule.

### 4.3 MAJOR GAP: Missing Banned Words/Phrases
**Severity: HIGH**
The following words from the source document are NOT present in any HVR file at any severity level:

**Proposed as Hard Blockers (-5):**
- enlightening
- esteemed
- skyrocket / skyrocketing
- utilize / utilizing
- remarkable (in marketing/hype context)

**Proposed as Soft Deductions (-2):**
- discover (when used as hype: "discover our new...")
- "remains to be seen" (classic AI hedging phrase)
- "glimpse into" (AI-typical phrasing)
- "you're not alone" / "not alone" (AI comfort phrase)

**Proposed as Soft Deductions (-1):**
- stark
- boost (when used as hype filler)
- powerful (when used as filler adjective)
- inquiries (use "questions" instead)
- "opened up" (vague verb phrase)
- probably
- imagine (as setup: "Imagine a world where...")
- exciting (adjective form, "excited" already flagged as context flag)

**Proposed as New Phrase Blockers (-5):**
- "In a world where" (partially covered in banned metaphors but not in phrase blockers list)
- "You're not alone" (AI comfort phrase)

### 4.4 MODERATE GAP: Conditional Language Principle
**Severity: MEDIUM**
The source document states: "Avoid conditional language (could, might, may) when certainty is possible." The HVR has "might" and "could potentially" as -1 soft deductions, but the overarching PRINCIPLE of preferring certainty is not stated. This is a principle-level enhancement, not a word-level one.

**Recommendation:** Add a principle statement to the new Voice Directives section: "Prefer certainty. When you know something is true, state it directly. Avoid hedging with could, might, or may when the facts support a direct claim."

### 4.5 MINOR GAP: Word Form Variants
**Severity: LOW**
- "crafting" (gerund) not explicitly listed alongside "craft" in the -2 deductions
- "exciting" (adjective) not listed alongside "excited" (context flag)

**Recommendation:** Add these variants to their existing entries.

## 5. Rejected Recommendations

The following source document rules were analyzed and deliberately NOT recommended for adoption:

| Rule | Reason for Rejection |
|---|---|
| Ban "can" globally | Too fundamental. "Can" is standard English. Would cripple normal writing. |
| Ban "may" globally | Same as "can". Standard for permissions and possibility. |
| Ban "that" globally | Too fundamental. Removing unnecessary "that" is a style note, not a ban. |
| Ban "it" globally | Already handled correctly via context-dependent flag (check antecedent). |
| "Avoid markdown" | Conflicts with Barter's Markdown-based authoring architecture. |
| "Simplify grammar" (casual) | Too informal for most Barter systems. TikTok extension already allows casual tone where appropriate. |
| Ban dashes broadly | Em dashes already banned. En dashes and hyphens serve legitimate purposes. |
| "Use bullet points in social media" | Platform-specific. TikTok extension should note this if needed. Not global. |

## 6. Impact Assessment

### Files to Modify

| File | Changes | Version Bump |
|---|---|---|
| Global HVR (v0.100) | Add Part 0 Voice Directives, new banned words/phrases, sentence rhythm rule, conditional language principle, word form variants | v0.100 to v0.101 |
| Copywriter ext (v0.102) | Review tone guidance for consistency with new global directives | No change expected |
| Barter deals ext (v0.100) | Review for consistency | No change expected |
| Nigel ext (v0.100) | Review formal transition allowances against new conditional language principle | Possible minor update |
| TikTok ext (v0.100) | Consider adding bullet point guidance, review casual tone alignment | Possible minor update |
| Pieter ext (v0.100) | Review for consistency | No change expected |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| New voice directives conflict with extension overrides | Low | Medium | Cross-validate each extension after global changes |
| New banned words are too aggressive for some contexts | Medium | Low | Use context-dependent flags for borderline words |
| Sentence rhythm rule is too subjective | Low | Low | Provide concrete examples, make it a guideline not a hard rule |
| "Prefer certainty" principle conflicts with legitimate uncertainty | Medium | Medium | Add qualifier: "when the facts support a direct claim" |

## 7. Architecture Decision

### ADR-001: Positive Voice Directives Placement

**Decision:** Add new "Part 0: Voice Directives" section BEFORE existing Part 1 (Punctuation Rules).

**Rationale:** Establishing what voice to aim for should come before defining restrictions. This follows the principle of "positive before negative" in style guides. Renumbering Parts 1-6 to 2-7 would break all internal references across extensions and scoring integrations. Using "Part 0" preserves all existing numbering while placing directives first.

**Alternatives Considered:**
1. Append as Part 7 at the end: Rejected. Voice directives should be the first thing read.
2. Insert as new Part 1 and renumber everything: Rejected. Would break existing references to "Section 1.1" etc.
3. Add as Part 0: Selected. Preserves all existing numbering while placing directives first.

### ADR-002: New Word Severity Classification

**Decision:** Classify new words using the existing 3-tier severity system (hard blocker -5, soft -2, soft -1) rather than creating new tiers.

**Rationale:** The existing system is well-established and understood across all extensions. Adding new severity levels would require updating all extension scoring integrations.

### ADR-003: Rejected Word Bans

**Decision:** Do NOT ban "can", "may", "that", or "it" at any severity level. These are fundamental English words. The conditional language PRINCIPLE (prefer certainty) addresses the intent without banning the words themselves.

**Alternatives Considered:** Banning as hard blockers (too disruptive), banning as soft deductions (too many false positives), context-dependent flags (already done for "it").

### ADR-004: Extension Override Preservation

**Decision:** Preserve all existing extension overrides (Pieter em dashes, Nigel semicolons and formal transitions). New voice directives address tone and content, not punctuation. No conflict exists.

**Rationale:** The conditional language principle targets hedging (could, might, may), not formal transitions (however, furthermore, moreover). Nigel's allowance is explicitly non-conflicting.

> Full ADR details with consequences in `decision-record.md`.

## 8. Success Criteria

- [ ] Global HVR has a "Part 0: Voice Directives" section with rules A1-A11 adapted
- [ ] Sentence rhythm rule exists with concrete examples
- [ ] All 5+ new hard blocker words added to Section 4
- [ ] All 4+ new soft deduction -2 words/phrases added to Section 7
- [ ] All 8+ new soft deduction -1 words added to Section 8
- [ ] New phrase blockers added to Section 5
- [ ] Conditional language principle stated in Voice Directives
- [ ] Word form variants (crafting, exciting) added to existing entries
- [ ] All 5 extensions reviewed for consistency with changes
- [ ] No extension override conflicts introduced
- [ ] Version bump to v0.101 applied
- [ ] Pre-publish checklist (Section 10) updated to include voice directive checks
