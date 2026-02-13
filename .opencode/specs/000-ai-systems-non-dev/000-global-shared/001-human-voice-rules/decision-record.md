# Decision Record: Human Voice Rules Refinement

## Metadata
| Field | Value |
|---|---|
| Spec ID | 004 |
| Created | 2026-02-10 |
| Status | Draft |

## ADR-001: Part 0 Placement Strategy

**Date:** 2026-02-10
**Status:** Proposed
**Context:** The Global HVR needs positive voice directives but currently has 6 numbered parts (Part 1 through Part 6). Adding new content requires deciding where to place it.

**Decision:** Use "Part 0: Voice Directives" placed before existing Part 1. Do NOT renumber existing parts.

**Rationale:**
- Voice directives should be the first thing read (establishes the target before restrictions)
- Renumbering Parts 1-6 would break all internal references (Section 1.1, Section 2.3, etc.)
- "Part 0" is unconventional but preserves all existing numbering

**Alternatives Rejected:**
1. Append as Part 7: Voice directives buried at the end. Wrong priority signal.
2. Insert as Part 1, renumber 1-6 to 2-7: Breaks all existing section references in extensions and scoring integrations.
3. Add as a preamble without Part number: Inconsistent with document structure.

**Consequences:**
- Positive: All existing references preserved. Extensions need no numbering updates.
- Negative: "Part 0" looks unusual. Future document restructures should consider proper renumbering.

## ADR-002: New Word Severity Classification

**Date:** 2026-02-10
**Status:** Proposed
**Context:** Approximately 20 new words from the source document need severity classification. Options: use existing 3-tier system or create new tiers.

**Decision:** Use the existing 3-tier system (hard blocker -5, soft -2, soft -1).

**Rationale:**
- Existing system is well-established across all 6 extensions
- All scoring integrations (MEQT, DEAL, CONTENT) reference these tiers
- Adding new tiers would require updates to every scoring integration
- The 3 existing tiers are sufficient for the new words

**Consequences:**
- Positive: No scoring integration changes needed. Consistent with existing pattern.
- Negative: Some words might deserve intermediate severity (e.g., -3 or -4). The 3-tier system lacks granularity.

## ADR-003: Rejected Word Bans

**Date:** 2026-02-10
**Status:** Accepted
**Context:** The source document bans several common English words (can, may, that, it) that would be too disruptive to ban globally.

**Decision:** Do NOT ban "can", "may", "that", or "it" at any severity level.

**Rationale:**
- "can" and "may" are fundamental English. Banning them would make natural writing impossible.
- "that" appears in standard sentence constructions. Removing unnecessary "that" is a style note, not a ban.
- "it" is already handled correctly as a context-dependent flag (check antecedent).
- The conditional language PRINCIPLE (prefer certainty) addresses the intent without banning the words themselves.

**Consequences:**
- Positive: Natural English preserved. No false positives in scoring.
- Negative: Some AI-detectable hedging patterns using these words will not be caught by word-level scanning. The conditional language principle covers this at the style level instead.

## ADR-004: Extension Override Preservation

**Date:** 2026-02-10
**Status:** Accepted
**Context:** Extensions have specific overrides (Pieter: em dashes allowed, Nigel: semicolons allowed + formal transitions). New global rules must not conflict.

**Decision:** Preserve all existing extension overrides. New voice directives address tone and content, not punctuation. No conflict exists.

**Rationale:**
- Extension overrides are personality-specific and well-documented
- Voice directives (Part 0) operate at a different level than punctuation overrides
- The conditional language principle targets hedging (could, might, may), not formal transitions (however, furthermore, moreover)
- Nigel's formal transition allowance is explicitly non-conflicting

**Consequences:**
- Positive: No extension changes required for override mechanics.
- Negative: None identified.
