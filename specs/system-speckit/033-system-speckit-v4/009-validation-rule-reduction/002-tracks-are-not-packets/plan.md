---
title: "Implementation Plan: Tracks Are Not Packets"
description: "Measure the claim, define track identity narrowly, prove no packet takes the exemption."
trigger_phrases:
  - "tracks are not packets"
  - "track directory exemption"
  - "three digit prefix rule"
  - "no packet takes exemption"
  - "measure the track claim"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/002-tracks-are-not-packets"
    last_updated_at: "2026-08-29T19:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Exempted track directories from packet rules"
    next_safe_action: "Begin the next phase: delete the rules that encode taste"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Tracks Are Not Packets

# Implementation Plan: Tracks Are Not Packets

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Check the premise before writing code, then define track identity as narrowly as
the evidence allows, then prove the definition cannot swallow a packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All fourteen tracks pass.
- No packet in the sample changes verdict.
- A numbered packet placed where a track sits is still graded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Track identity is decided from the path and the absence of a spec, before any
level is detected. A track has no level, so nothing downstream needs to know
about the case.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Test the premise

The phase was scoped to two problems. The archive half did not reproduce and was
dropped rather than implemented.

### Phase 2: Define identity narrowly

Three conditions, all required. The first draft used two and immediately
exempted a test fixture that was a genuine packet, which is what the third
condition exists to prevent.

### Phase 3: Prove the negative

A test asserts that a numbered packet in the same position is still graded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two tests: a track passes, and a packet in a track's position does not. The
second is the one that matters, because the failure mode of an exemption is
silence.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The specs root layout: packets are filed under tracks.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One guard function and its call site. Reverting restores the previous behaviour;
no packet content was touched.
<!-- /ANCHOR:rollback -->
