---
title: "Implementation Summary: Chart review remediation"
description: "What a fresh review of the chart skill found, what was fixed, and the four checker holes left recorded rather than closed."
trigger_phrases:
  - "chart remediation summary"
  - "chart review results"
  - "black cell defect"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/054-chart-review-remediation"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded what the remediation changed and what it left"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - "scratch/negative-controls.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-054-chart-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A reversed ramp is now caught by a rule rather than by a reader"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/054-chart-review-remediation |
| **Status** | Complete |
| **Delivery** | Thirty-four files in the chart skill. The corpus check passes from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The overhaul closed with every gate green, and a fresh review then found defects those gates
could not see. This packet fixes them.

The worst inverted a reading rather than blurring one. A cell holding a zero painted pure black,
darker than the maximum in the same grid, while the legend said the opposite. The cause was
arithmetic: a value is reduced by one before scaling, which sends a zero below the floor, and the
clamp guarded only the top. The band ran past the last defined fill and the browser fell back to
black. The delivery built from that form carried the same function, and a delivery is the file
someone edits.

Data past a form's stated ceiling failed the same way, because a class past the palette's
capacity has no fill either. Five forms now take a defined fill and print a notice naming the
count, following the two that already did.

Eight of twenty-seven headlines were false against their own data and are rewritten. The one the
review caught claimed a stage held a request longer than the three after it combined, where the
block says eighteen against twenty.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each defect was reproduced before it was fixed, rather than taken on the report's word.

The order was set by what a reader would see. Fixing the arithmetic first let the capacity work
assume every finite value already lands on a defined class, so its notice is about a shape the
form cannot draw rather than a colour it cannot find.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

A zero takes an explicit empty class rather than the palest step, matching the one ramp form that
already made that choice. A zero is a reading, and a reading of none is worth showing as none.

The mapping rule asserts that an indexed class carries the token of its own index. That is the
narrowest statement that catches the failure, which is a ramp reversed inside a file while the
legend, drawn from the same classes, reverses with it. The picture stays consistent with itself
and stops being consistent with the data, which is why no earlier rule saw it.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Seven mutations are kept with their output, each run twice: once with the new rule wired and once
with it unwired as the control. Without the control a passing rule proves only that the fixture
is quiet.

The corpus check passes from the final state and was run again, because a browser open can die
transiently and one red run is not a result.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Four checker holes are recorded rather than closed, each with the mutation that proves it. The
motion rule matches its guard string anywhere in a stylesheet rather than beside each animation,
so a new unguarded animation passes while another rule mentions the query. A web font declared
inside an at-rule slips the external-resource rule, which looks for an attribute rather than a
property. The accessibility rule's table half is a substring test that a commented-out attribute
satisfies. And a corner held in a variable slips the radius rule.

None was closed here because each needs a different parser rather than a wider pattern, and a
wider pattern is how a rule starts failing correct files.
<!-- /ANCHOR:limitations -->
