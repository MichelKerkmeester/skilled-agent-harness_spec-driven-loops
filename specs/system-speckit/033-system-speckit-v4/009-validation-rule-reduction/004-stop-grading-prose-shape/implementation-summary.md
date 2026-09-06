---
title: "Implementation Summary: Stop Grading Prose Against A Moving Target"
description: "Two rules that graded prose against a weekly-changing template are gone; the one with real consumers was narrowed to serve them."
trigger_phrases:
  - "stop grading prose shape"
  - "template conformance removed"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/004-stop-grading-prose-shape"
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
# Implementation Summary: Stop Grading Prose Against A Moving Target

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-stop-grading-prose-shape |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Heading-shape grading is gone, along with the section-count rule that duplicated
it and three rule scripts no code path could reach. Anchor checking stayed, but
now asserts integrity rather than conformance: ids are unique, every open has a
close, and anchors are present in documents whose template defines them.

The distinction came from tracing consumers rather than from taste. Nothing
machine-readable reads heading text. Anchors are read by three things — merging
generated content into a document, chunking it for retrieval, and search
metadata — so deleting that rule would have broken retrieval quietly. The
instinct to delete both was wrong, and the trace is what caught it.

The registry went from 46 rules to 44, and the rule inventory on disk from 37
scripts to 34.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

By measuring what still blocked packets rather than following the plan. The
phase scheduled next would have stopped storing derived facts as prose; the
measurement showed those rules had nearly stopped blocking anything once
warnings became advisory, while headings and anchors dominated. The plan was
reordered on that evidence.

The replacement was too strict three times over, and each was caught by
measurement rather than review: it demanded anchors in documents with no
template, then in templates that define none, then in phase parents that had
always been exempt. Each was narrowed until the comparison showed no regression.

One measurement had to be discarded. The sampling rebuilt its list on every run,
so adding packets shifted every position and the before-and-after sets diverged
— it reported 160 regressions alongside a higher pass rate, which is
self-contradictory. The sample is now pinned to a fixed list.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Decide each rule by who reads its subject | Headings are read by people and anchors by code, so one could go and one could not |
| Narrow rather than delete the anchor rule | Its subject is load-bearing; only its comparison against a moving template was the problem |
| Keep the phase-parent exemption | Widening coverage is a different decision from reducing what is asserted, and mixing them hides both |
| Do not restore the checklist title check | No machine reads a title. It was enforced by the deleted rule, and this work rewrote 384 titles to satisfy it, which is the better argument for questioning a rule than for keeping it |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Pass rate on a pinned sample | PASS | 74.0% to 79.0% across an identical 300-packet set |
| No regressions | PASS | 15 recovered, 0 moved from pass to fail |
| Anchor faults still caught | PASS | Duplicate, unclosed and absent anchors each produce an error |
| Chained validation suite | PASS | 114, 39 and 106 cases, all green |
| No stale references | PASS | Registry, script registry, both shell suites and the vitest suites cleaned |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The checklist title is no longer checked anywhere.** That is deliberate,
   and it means the 384 titles corrected earlier in this work are now held only
   by convention.
2. **Phase parents remain exempt from anchor checking.** Roughly three hundred
   of them, unchanged from before. Extending coverage there is a separate
   decision with its own blast radius.

<!-- /ANCHOR:limitations -->
