---
title: "Implementation Plan: The Framework Document Describes The Gate That Exists"
description: "Run the gate, compare each claim to what it prints, correct what disagrees."
trigger_phrases:
  - "framework doc matches behaviour"
  - "agents md validation claims"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/005-framework-doc-matches-behaviour"
    last_updated_at: "2026-08-29T21:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected the framework doc's validation claims to match the gate"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: The Framework Document Describes The Gate That Exists
# Implementation Plan: The Framework Document Describes The Gate That Exists

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Test each claim against the running gate rather than against memory of what the
gate used to do, then rewrite only what disagrees.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each corrected sentence is backed by an observed exit code or printed line.
- No claim survives that names a mechanism with no implementation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

None. This phase changes prose in one always-loaded document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Test the claims

A warnings-only packet under strict, the freshness rule with its flag off, and a
search for the grandfather mechanism the document promised.

### Phase 2: Correct

Two sentences, rewritten to describe what those commands printed.

### Phase 3: Check the neighbouring claims

The git rules were read and verified rather than assumed stale, and needed
nothing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each claim is a command. A warnings-only packet exits 0. The freshness rule
prints that it is skipped when its flag is off. The grandfather mechanism
matches nothing in the rule that was said to honour it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The behaviour changed by the earlier phases of this packet.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Two sentences in one document. Reverting the commit restores the previous text.
<!-- /ANCHOR:rollback -->
