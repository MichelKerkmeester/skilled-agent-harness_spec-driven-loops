---
title: "Implementation Summary: The Scaffold Passes Its Own Gate"
description: "Five errors on an untouched scaffold became zero, and a test now holds the line."
trigger_phrases:
  - "scaffold parity"
  - "fresh scaffold passes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/003-scaffold-parity"
    last_updated_at: "2026-08-29T19:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Made a fresh scaffold pass the gate it ships with"
    next_safe_action: "Begin the next phase: stop copying derived facts into authored prose"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/skills/system-spec-kit/templates/core/spec.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: The Scaffold Passes Its Own Gate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-scaffold-parity |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A packet created with no human input now reports zero errors at every level the
generator offers. It previously reported five, which meant an author's first
encounter with the gate was being told their untouched scaffold was wrong.

Three defects, all in the generator rather than the rules. The status field was
scaffolded as a menu listing every value; because that menu contains the word
Complete, the status classifier read a new folder as a finished one and fired
the rule that objects to scaffold markers in a completed packet. The closure
document carried an author placeholder that the generator substitutes everywhere
else. And the generator persisted its own guess at graph metadata rather than
running the deriver, so a packet disagreed with its own deriver on creation.

One rule changed rather than the generator: a fresh packet carries a deliberate
marker saying it is not yet filed, and the path rule now accepts it. That marker
is still caught if it survives into a packet claiming completion, which is the
rule that exists for it.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

By creating a folder, changing nothing, and reading what the gate said. Each
finding was then traced to whichever side of the generator-grader pair was
actually wrong, and in three of four cases that was the generator.

One reported cause had already been fixed. The scaffolder was said to omit the
closure document entirely, and it did when that was measured; concurrent work
had corrected it in the interval, and the rebase picked it up. Re-checking cost
one command and avoided rewriting something that already worked.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Fix the generator, not the rules | The packet was not wrong; the thing that made it was |
| Scaffold a real status instead of a menu | A scaffold should produce a valid document, not a list of options the grader then reads as a value |
| Run the deriver rather than guess | The generator and the gate now use the same tool to decide what the metadata should be, so they cannot disagree |
| Accept the not-yet-filed marker | It is deliberate, and a different rule already catches it if it outlives the scaffold |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Day-zero failure reproduced | PASS | Untouched Level 2 scaffold, five errors |
| Scaffold passes at every level | PASS | Levels 1, 2 and 3 each report zero errors |
| The test catches a regression | PASS | Restoring the status menu fails three of five cases; reverting passes all five |
| No packet regressed | PASS | Same 250-packet sample, zero moved from pass to fail |
| No residue | PASS | No untracked probe folder after the suite runs |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fresh scaffold still attracts warnings.** Three of them, all observing
   that the document is untouched. That is the gate working rather than a
   defect, and the phase deliberately did not silence them.
2. **The test scaffolds into the real specs root.** The generator resolves its
   own location, so the test removes only what it created, and only under that
   root.

<!-- /ANCHOR:limitations -->
