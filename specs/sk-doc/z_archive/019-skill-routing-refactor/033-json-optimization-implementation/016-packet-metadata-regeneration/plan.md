---
title: "Implementation Plan: Packet Metadata Regeneration"
description: "Resolve the stale phase map, stale continuity blocks, planned derived status and absent source fingerprints with one close-time generator pass rather than four hand-edits, propagating whatever completion state the upstream honesty phase est"
trigger_phrases:
  - "metadata regeneration implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/016-packet-metadata-regeneration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Regenerated packet metadata; fixed phase map"
    next_safe_action: "Proceed to phase 017"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/016-packet-metadata-regeneration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Packet Metadata Regeneration

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Resolve the stale phase map, stale continuity blocks, planned derived status and absent source fingerprints with one close-time generator pass rather than four hand-edits, propagating whatever completion state the upstream honesty phase established as true.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

One generator pass resolves all four symptoms; propagated status matches the reconciled truth rather than an assumed Complete; the generated-metadata integrity check passes across every folder; the frontmatter errors are attributed to a cause; and a diff review confirms no authored content was overwritten.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Four separately-reported findings share one cause: the close-time metadata generator was never run. The phase map, the continuity blocks, the parent's derived status and the missing fingerprints are all outputs of that one pass. Treating them as four fixes invites four partial hand-edits that drift apart again.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup commits the packet so any generator overwrite is recoverable, and examines the frontmatter errors on the affected children to establish whether they share the same cause. Implementation runs the generator pass. Verification diffs the result for overwritten authored content and confirms the integrity check passes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The integrity check across all folders is the primary test. The diff review is the secondary and is not optional, because a generator that rewrites authored prose would pass the integrity check while destroying content.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phases 013 and 015 both block this phase. Running it early would set every status row to Complete over an unresolved regression, converting a visible inconsistency into an invisible one.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The packet is committed before the pass runs, so the entire regeneration reverts as one commit. Any authored content the generator would rewrite is identified in the diff review before the result is accepted.
<!-- /ANCHOR:rollback -->
