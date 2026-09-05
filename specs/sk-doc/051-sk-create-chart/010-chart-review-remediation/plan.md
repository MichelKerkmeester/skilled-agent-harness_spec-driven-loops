---
title: "Implementation Plan: Chart review remediation"
description: "How the defects a fresh review found were fixed, in the order that put the ones a reader would see first."
trigger_phrases:
  - "chart remediation plan"
  - "chart review fixes"
  - "black cell fix plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/010-chart-review-remediation"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the approach the remediation took"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-054-chart-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A zero takes the palest step rather than an empty class, because zero is a reading"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:approach -->
## 1. APPROACH

The order was set by what a reader would see, not by what was easiest.

A cell painting pure black came first, because it inverts the reading: the lowest value in the
grid drew darker than the highest while the legend said the opposite. The arithmetic was the
cause. Subtracting one from a value before scaling sends a zero below the floor, and the clamp
guarded only the top end, so the band ran past the last defined fill and the browser fell back
to black. Clamping both ends fixes every finite input at once, which is why the requirement is
written about defined fills rather than about zero.

Data past a stated ceiling had the same shape and the same remedy. A class past the palette's
capacity has no fill, so the mark paints black and nothing says why. Two forms already grew
their frame and printed a notice, so that was the pattern rather than a new invention.

The headlines were checked by arithmetic rather than by reading. Every claim was recomputed
from the block in the same file, which is the only way to catch one that sounds right.

The checks came last on purpose. A check written before the defect is understood tends to
encode the symptom.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:steps -->
## 2. STEPS

1. Clamp the band arithmetic in the matrix form and in the delivery that carries the same
   function, then probe a zero, a negative and a fraction under a render.
2. Give the five capacity-bearing forms a defined fill past the ceiling and a notice naming the
   count, following the two forms that already do it.
3. Recompute all twenty-seven headlines against their own blocks and rewrite the false ones.
4. Give the data table the pan the figure already had, and measure the two overflowing files.
5. Measure the axis collisions by bounding box, fix, and measure again.
6. Add a rule that an indexed class carries the token of its own index, and cover the helper
   path the type scale was blind to.
7. Record every hole left open with the mutation that proves it.
<!-- /ANCHOR:steps -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

Every rule written here was watched failing on a mutated copy with the rule unwired as the
control, so a pass proves the rule and not the fixture. Seven mutations are kept with their
output. The corpus check runs from the final state and is re-run once, because a browser open
can die transiently and a single red run is not a result.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:ai-protocol -->
## 4. AI EXECUTION PROTOCOL

**Read before acting:** the review findings, then the file each names, before any edit.
**Prove before trusting:** a new rule is watched failing on a mutation, restored from a kept
copy rather than from the last commit.
**Measure rather than assert:** a count is re-derived from the tree, and a rendered claim is
made against a render.
**Stop at the boundary:** a hole that needs a design decision is recorded with its cost rather
than guessed at.
<!-- /ANCHOR:ai-protocol -->
