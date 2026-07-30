---
title: "Implementation Plan: Authority Path and Contract Corrections"
description: "Correct the dead create-skill authority citations, bring the skill-root metadata contract document in line with the deliberate command-metadata reversal the implementation already made, label the tracked scratch artifact, and record the sch"
trigger_phrases:
  - "authority corrections implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/017-authority-path-corrections"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/017-authority-path-corrections"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Authority Path and Contract Corrections

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Correct the dead create-skill authority citations, bring the skill-root metadata contract document in line with the deliberate command-metadata reversal the implementation already made, label the tracked scratch artifact, and record the schema-conflation correction so the false routing-consequence claim does not propagate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

No dead citation remains and every corrected path resolves on disk; the contract document and the implementing module agree with the deciding packet referenced; the scratch artifact cannot be mistaken for live state; and the schema-conflation correction is written where a future reader will find it.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three documentation defects and one correction of the record. The dead paths sit in spec-folder metadata, which is an unrelated schema that merely shares a filename with skill-root metadata — so despite an earlier claim to the contrary, they have no routing consequence. The contract document is stale against an implementation that is authority, because the requirement reversal was deliberate and is documented in a sibling packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the dead paths appear only in spec-folder metadata and not in skill-root metadata. Implementation corrects the citations, updates the contract document, and dispositions the scratch artifact. Verification confirms every corrected path resolves.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A search for the dead path across the packet returning zero hits is the primary check, with each corrected path confirmed to exist on disk. The contract change is checked by reading it against the implementing module.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. This phase is independent of the other five and can run in parallel with any of them.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are documentation edits, revertible as one commit. Historical evidence blocks keep their original text and are out of scope, so no record of what was true at the time is altered.
<!-- /ANCHOR:rollback -->
