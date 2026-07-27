---
title: "Implementation Summary: Legacy and Superseded Artifact Removal"
description: "All four approved findings were refuted at re-verification. Each proposed deleting something the repository still uses as evidence or history."
trigger_phrases:
  - "legacy removal summary"
  - "017 phase 004 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/004-legacy-and-superseded-removal"
    last_updated_at: "2026-07-27T14:28:01Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Refuted all four legacy-removal findings before dispatch"
    next_safe_action: "Begin phase 005 misplacement and layout"
    blockers: []
    key_files:
      - "approved-findings.md"
      - "refutations.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-004"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the v3.x changelogs be consolidated into a historical summary? Lossy, needs a ruling."
    answered_questions:
      - "A phase that applies nothing is a valid outcome when the evidence contradicts every candidate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-legacy-and-superseded-removal |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing was deleted, and that is the finding.

| Finding | Result | Reason |
|---------|--------|--------|
| `devin-01:F2` | REFUTED | Fixtures are cited in the file inventories of two retained 2026-07-21 benchmark reports |
| `devin-05:F2` | REFUTED | Same fixtures, same evidence |
| `devin-01:F3` | REFUTED | Eight v3.x changelogs are the release record; describing a superseded architecture is their job |
| `devin-01:F4` | REFUTED | v4.0.0.0 records a real dated step; v4.1.0.0 completing it does not erase it |

No worker was dispatched. Re-verification resolved all four before dispatch, which is the cheapest possible outcome for a phase whose every candidate was wrong.

### What the category got right and wrong

The instinct is sound — superseded artifacts do accumulate, and a release-readiness sweep should look for them. But every candidate here turned out to be either an input to permanent evidence or a historical record, and both are things whose entire value is that they describe a state the system has moved past. "Superseded" describes a relationship to the present, not a licence to delete.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Re-verification only. Each evidence command was re-run against current HEAD, then extended with the question the original finding never asked: is anything still pointing at this? For the fixtures, two archived benchmark reports were. For the changelogs, the root README and a sibling entry were, and the append-only nature of a changelog answers it regardless.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse all four rather than find something to apply | The evidence contradicted every candidate; applying one for balance would be the wrong reason to delete a file |
| Offer changelog consolidation as an alternative rather than doing it | It is lossy and it is a documentation decision, not a cleanup |
| Dispatch no workers | Re-verification settled every finding; dispatching would have burned effort to reach the same answer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixture citations in retained reports | CONFIRMED, two 2026-07-21 archives |
| Changelog references outside the folder | CONFIRMED, root README and a sibling entry |
| Containment | PASS, no repository file touched |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Changelog volume is unaddressed.** Eleven sequential version files remain. If that is a real problem, consolidation is the answer, and it needs an explicit ruling because it loses detail.
2. **The fixtures stay indefinitely.** They are inert inputs retained for provenance. If the archives they support are ever pruned, the fixtures become removable with them.
<!-- /ANCHOR:limitations -->
