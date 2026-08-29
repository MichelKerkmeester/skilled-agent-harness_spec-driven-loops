---
title: "Implementation Plan: Stop Grading Prose Against A Moving Target"
description: "Trace the consumers, delete what has none, narrow what does, and measure against a pinned sample."
trigger_phrases:
  - "stop grading prose shape"
  - "template conformance removed"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/004-stop-grading-prose-shape"
    last_updated_at: "2026-08-29T20:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Replaced template-shape grading with anchor integrity"
    next_safe_action: "Packet phases complete; merge to the release branches"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Stop Grading Prose Against A Moving Target

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Decide each rule by what reads its subject. Headings are read by people, so the
rule that grades them goes. Anchors are read by code, so the rule that checks
them stays and is narrowed to what that code needs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Zero regressions on a pinned sample of the same packets before and after.
- The duplicate, unclosed and missing-anchor cases still fail.
- No reference to a deleted rule anywhere outside history.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The replacement reads no template to decide whether a document is well formed;
it only consults one to decide whether that document is expected to carry
anchors at all. That is the difference between a contract and a moving target.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Trace consumers

Anchors turned out to be read by merge, chunking and search metadata. Headings
by nothing.

### Phase 2: Replace and delete

Anchor integrity replaces anchor template-matching. Heading grading and the
section-count rule that duplicated it are removed, along with the rule scripts
no code path could reach.

### Phase 3: Converge on zero regressions

The first replacement was stricter than what it replaced in three separate ways.
Each was found by measurement, traced, and narrowed.

### Phase 4: Clean the references

Registry, script registry, both shell suites and the vitest suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A pinned list of packets, reused verbatim, because the previous sampling rebuilt
its sample each run and drifted as the corpus changed — which produced a
contradictory reading that had to be thrown away.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The anchor consumers: merge, chunking, search metadata.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One validator function, three deleted scripts, registry entries and test
expectations. Reverting the commit restores the previous behaviour; no packet
content was touched.
<!-- /ANCHOR:rollback -->
