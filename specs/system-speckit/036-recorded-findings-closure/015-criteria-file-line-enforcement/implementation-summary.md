---
title: "Implementation Summary"
description: "The coverage gate can now enforce: a cutoff bounds it, the criteria document's own status activates it, and the simplification program's sixteen packets measure 77 of 77 rows covered."
trigger_phrases:
  - "acceptance criteria file line enforcement"
  - "coverage floor cutoff rollout"
  - "lifecycle activation gap"
  - "citation retrofit coverage floor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/015-criteria-file-line-enforcement"
    last_updated_at: "2026-09-07T15:05:57Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 016"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:e30e3fcb069352fbcbd7e26536eda66c6498af17a8a7d5328c9908bd59409292"
      session_id: "scaffold-015-criteria-file-line-enforcement"
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
| **Spec Folder** | 015-criteria-file-line-enforcement |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The acceptance-coverage gate could count evidence but never fail anything: its enforce switch had no rollout boundary and its lifecycle check demanded a Status row in a summary table that the simplification program's sixteen children never carry, so it printed "gate not active" on all of them and measured 21 covered rows of 77 when run by hand. The rule now carries the same cutoff pair as the closure gate, activates on the criteria document's own Status field when the summary has no row, and grants the Manual-infeasible exemption the traceability path already granted. The sixteen packets' 56 uncovered rows now cite the line of their own verification record that reports each check; two cite the artifact directly. Coverage measures 77 of 77, and with enforcement on every child validates strict with the gate reporting its count.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/rules/check-ac-coverage.sh` | Modified | Cutoff pair, criteria-status fallback, exemption clause, cutoff detail line |
| `runtime/cli/tests/check-ac-coverage.sh` | Modified | Nine cases: cutoff on both sides, undated, moved, malformed, switch off, criteria status active and draft, exemption |
| `runtime/ENV-REFERENCE.md` | Modified | `SPECKIT_AC_COVERAGE_CUTOFF` row |
| Sixteen `acceptance-criteria.md` files under packet 035, children 006 to 022 | Modified | 56 rows cite `implementation-summary.md:<line>` or the artifact |
| Their `description.json` and `graph-metadata.json`, and packet 035's | Regenerated | Fingerprints that match |
| `decision-record.md` | Created | ADR-001, the cutoff and exemption decisions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline was re-measured by sourcing the rule and running its analyzer on each file before any edit. The rule change came first with its tests, because the retrofit only means something once the gate can see it. A script then matched each uncovered row's prose to the summary line with the most words in common and wrote the citation; rows that matched no line got the section heading, and two got the artifact they named. Metadata was regenerated for every touched packet, then all seventeen children validated with the switch on and the whole program without it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cite the verification record rather than re-run commands | The checks ran in a past session; the record is the evidence that exists |
| Share the closure gate's cutoff | One boundary operators already know; enforcement is opt-in anyway |
| Port the exemption | The two counting paths should agree; the finding named the asymmetry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline measurement before any edit | 77 rows, 21 covered |
| `tests/check-ac-coverage.sh` | 25 pass |
| Re-measurement after the retrofit | 77 rows, 77 covered |
| Seventeen children `validate.sh --strict` with `SPECKIT_AC_COVERAGE_ENFORCE=true` | all PASSED; sixteen report `n/n ACs have evidence`, 008 has no criteria document |
| Packet 035 `validate.sh --strict --recursive` without the switch | 23 PASSED |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Enforcement is still opt-in.** The switch defaults to off; the cutoff decides what it may fail once turned on.
2. **Seven citations name a section, not a line.** Their checks are described in prose the matcher could not pin to one summary line.
<!-- /ANCHOR:limitations -->

---
