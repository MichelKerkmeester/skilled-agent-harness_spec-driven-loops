---
title: "Implementation Plan: The Scaffold Passes Its Own Gate"
description: "Reproduce the day-zero failure, fix each cause in the generator, then lock it with a test."
trigger_phrases:
  - "scaffold parity"
  - "fresh scaffold passes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/003-scaffold-parity"
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
# Implementation Plan: The Scaffold Passes Its Own Gate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Create a folder, change nothing, validate it. Fix whatever it reports in the
generator rather than in the rules, because the packet is not wrong — the thing
that made it is. Then keep it fixed with a test that scaffolds and validates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Zero errors from an untouched scaffold at levels 1, 2 and 3.
- The test fails when any fixed defect is reintroduced.
- No packet in the sample changes verdict.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two of the causes were templates that shipped placeholders where a value was
already known. The third was the generator writing its own guess at derived
metadata; it now runs the deriver instead, which is the same tool the gate uses
to decide whether that metadata is right.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reproduce

Scaffold, validate, record every finding.

### Phase 2: Fix the generator

A real default status instead of a menu; the author field the generator already
knows; the deriver run over the documents just written.

### Phase 3: Tolerate the one deliberate marker

A fresh packet is marked as not yet filed. That is intentional and is already
caught elsewhere if it survives to completion, so the path rule accepts it.

### Phase 4: Lock it

A test scaffolds at each level and asserts zero errors, verified by
reintroducing a defect and watching it fail.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The test is the deliverable as much as the fix is. It was confirmed against the
unfixed generator first: with the status menu restored, three of its five cases
fail. Without that confirmation the test would only assert a hope.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The document contract, which decides what a level scaffolds.
- The graph deriver, now run by the generator.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Two template edits, one generator step, one rule branch. Reverting the commit
restores the previous behaviour; no existing packet was touched.
<!-- /ANCHOR:rollback -->
