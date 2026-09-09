---
title: "Implementation Summary"
description: "Every family the corpus check registers now has a mutation case, and the suite fails if that stops being true."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/031-full-family-coverage"
    last_updated_at: "2026-09-09T20:32:05Z"
    last_updated_by: "claude-conductor"
    recent_action: "Gave every checker family a case and made the suite assert its own completeness"
    next_safe_action: "Nothing outstanding in this line of work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-031-full-family-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-full-family-coverage |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The suite shipped covering twelve of forty-seven families — the ones this line of work had repaired
or added. The rest were enforced by nobody having broken them, and nothing required a new family to
arrive with a case, so it would have decayed as soon as attention moved.

Thirty more cases, and a guard that keeps the count honest.

### The guard

The suite reads the families the checker registers, reads the families its own cases name, and
fails on the difference. A family may sit outside only by being named with the reason it needs a
browser. Two more checks keep that from rotting: a case naming a family that no longer exists fails,
and so does an exemption that outlives the family it excuses.

### A second route

Not every family runs on an extra file. Several are scoped to the shipped directories, and one trips
on any copy at all, because two files then declare the same identity and the rule answers about that
before anything else. Those cases mutate the file where it lives inside a package copy, so the rule
sees a corpus member rather than a visitor.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/tests/corpus-mutations.test.cjs` | Modify | Thirty cases, the in-place route, the completeness guard |
| `changelog/v1.15.0.0.md`, `SKILL.md`, `README.md` | Create / Modify | Version 1.15.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Most of the work was finding out what each rule actually reads, and the harness did the finding.
Nine mutations broke something adjacent to the assertion rather than the assertion itself, and each
was refused rather than passing: the tooltip rule skips a file whose attribute is gone, so removing
it proved nothing; the catalog's system column is a different column from the one I changed; the
corner rule watches stylesheets and mark attributes rather than arbitrary code; one family fires on
any copied file, so it cannot be tested by copying.

The guard was then checked in both directions, by adding a family with no case and by renaming a
family a case depends on.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The suite asserts its own completeness | Coverage written once follows the work that prompted it and then rots quietly. The only version of this that survives is one that fails when it stops being true. |
| Browser families are exempt by name, with a reason each | An exemption list with no reasons is a list of things nobody looked at. Naming the reason makes a stale one visible. |
| One case per family, not per assertion | A floor, stated rather than implied. A family with six assertions is held against one of them, which catches the family going silent but not one assertion inside it drifting. |
| The in-place route was added rather than replacing the extra route | The extra route is faster and already covers thirty-five cases. Rewriting them to prove the same things would have been motion. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Coverage | 47 families registered, 42 covered by a case, 5 exempt with a reason, 0 uncovered. |
| `node --test scripts/tests/` | PASS. 80 tests, 0 failures, 0 skipped. |
| The guard, both directions | PASS. A family added with no case fails by name; a case naming a family that does not exist fails. |
| Harness refusals | 9 mutations rejected on the way in for breaking something adjacent to the assertion. |
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0`. |
| Render gate and captures | PASS. 40 rendered, 0 failed, 0 stale. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One case per family is a floor, not a proof of the family.** A family with several assertions is held against one of them. That catches the family going silent, which is the failure this whole line of work kept hitting, and does not catch one assertion inside a family drifting while its neighbours still fire.
2. **Five families need a browser and have no case.** They are named with the reason. The render gate exercises them, but nothing proves they would fail if they stopped working.
<!-- /ANCHOR:limitations -->

---


