---
title: "Implementation Plan: A Level For Research"
description: "Model the level on review, then follow each failure to the enumeration that caused it."
trigger_phrases:
  - "research level plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/008-a-level-for-research"
    last_updated_at: "2026-08-30T12:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a research level and taught every level enumeration about it"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: A Level For Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add the level to the manifest modelled on `review`, declare it on one real
packet, and follow each resulting failure to the enumeration that produced it
until the declaration works end to end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The contract is set from measured corpus shape, not from what looks tidy.
- Each enumeration is found by a real failure, not by guessing where they are.
- No packet regresses on the pinned sample.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`spec-kit-docs.json` is the contract: each level names its `requiredCoreDocs`,
and both the TypeScript resolver and the shell rule's node helper read it. So
the manifest entry is the substance and the code changes are only about which
level strings are accepted.

Six places decide that: the `SpecKitLevel` type, two `VALID_LEVELS` sets, two
`normalizeLevel` functions, the `SPECKIT_LEVEL` marker regex, and a third
normalizer in the shell rule's helper. A level is not usable until all of them
agree, which is why the work was driven by following failures rather than by
editing one file and assuming.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Set the contract from measurement

Of 104 leaf packets missing plan or tasks, 11 carry `research/research.md`, 8 a
`review/` without a top-level report, 7 a `research/` without research.md, 2 a
proper `review/review-report.md`, and 76 neither. So the level is worth adding
for the ~28 with research or review output, and is not the answer for the 76.

A first draft made `research/research.md` a required core doc. That pulled it
into shape grading and it failed on anchors, so the draft was corrected:
research.md stays a lazy addon, exactly as it is at levels 1 and 2.

### Phase 2: Follow the failures

Declaring the level produced, in order: an unsupported-level throw from the
orchestrator, a second throw from the spec-doc structure module, an unresolved
contract from the shell rule's node helper, and an invalid-level report from the
shell rule itself. Each named its own source.

### Phase 3: Apply and measure

Declare the level on the packets whose shape it describes, regenerate their
metadata, and compare the pinned sample before and after.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each step was a negative control by construction: the packet was validated
before the change, the specific failure recorded, the change made, and the same
command re-run. The level was proven on one packet before being applied to the
rest.

Regression is measured per packet on the pinned 300-packet sample, because an
aggregate can hide equal numbers of gains and losses.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The manifest and its two readers, which already supported a non-numeric level
  in the shape of `review`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the commit removes the manifest entry and the six acceptances
together. Any packet still declaring the level would then report an unsupported
level, so a partial revert of the code without the packet declarations is the
one combination to avoid.
<!-- /ANCHOR:rollback -->
