---
title: "Implementation Summary: Review Remediation"
description: "Closing the three P1 findings that survived four review iterations, each code fix proven by a control observed failing first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-review-remediation"
    last_updated_at: "2026-08-31T04:50:04Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the three surviving P1 findings"
    next_safe_action: "Judge the outstanding P2 set from the review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

**Status:** Complete

| Field | Value |
|-------|-------|
| **Spec Folder** | 047-review-remediation |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sweep now requires an explicit enable decision. It previously tested for an explicit disable, so an omitted decision meant execute — a process-killer defaulting to kill. An omission and a deliberate disable are reported distinctly, because one is a caller bug and the other is an operator choice.

Reapability is now derived from parent evidence read at decision time. The snapshot's verdict no longer excludes a candidate before evaluation, so a daemon orphaned between the scan and the decision is collected on that pass instead of surviving to the next. Every other gate — ownership, start-time match, startup grace, socket peer — is unchanged and still has to pass, so re-reading only ever admits processes that are genuinely parentless now.

The cli-devin playbook precondition is version-scoped and agrees with the audit banner above it. It previously told readers not to treat `smart` as valid while the banner recorded it as accepted.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

[How was this tested, verified and shipped? What was the rollout approach?]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| [What was decided] | [Active-voice rationale with specific reasoning] |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Both code fixes rest on a control observed failing first: pre-fix, the omitted-decision case signalled and the parent-died case returned an empty `appliedPids`. Post-fix both pass, and 14 tests are green across the two phase suites.

The live-parent safety property still refuses, now with `classification-not-reapable` recorded rather than the row being filtered out unseen — an explicit refusal is stronger evidence than silence, so that assertion was tightened rather than relaxed to accommodate the change.

Two pre-existing tests broke on the fail-closed default and were made explicit. They had been passing because of the very default this packet removed, which is worth stating plainly: the old suite was green partly by accident.

Playbook contract validator PASS with 0 violations; comment hygiene clean across the changed code.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The P2 findings from the review are untouched. Each needs its own judgement and none blocks closure.

These fixes postdate the review's terminal pass, so they are unreviewed by the loop that motivated them. The controls are mine, and the review's core lesson was that tests written alongside the code they guard can agree with it by construction.
<!-- /ANCHOR:limitations -->

---


