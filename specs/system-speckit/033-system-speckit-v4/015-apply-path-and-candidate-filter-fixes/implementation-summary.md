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
    packet_pointer: "system-speckit/033-system-speckit-v4/015-apply-path-and-candidate-filter-fixes"
    last_updated_at: "2026-08-31T04:50:04Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the P1 set and made termination opt-in at the operator layer"
    next_safe_action: "Verify what apply does with the shared memory daemon before enabling the sweep anywhere"
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
| **Spec Folder** | 015-apply-path-and-candidate-filter-fixes |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Terminating is now opt-in at the operator layer too. An unset switch previously meant "sweep", so any machine that had never heard of this feature would begin terminating daemons the moment it shipped. A live dry-run made that concrete: three processes were flagged eligible, one of them the shared memory daemon holding the production database open, on a host that had configured nothing. Both the sweep and the session-start plugin now require an explicit on value.

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

The opt-in flip was verified against the compiled CLI, not just the source, after rebuilding the package that owns it — the first rebuild targeted the wrong package and left the old default in place, which would have made a green test meaningless. 16 tests pass, including a new guard asserting that a host which never opted in never reaches the apply command.

Both code fixes rest on a control observed failing first: pre-fix, the omitted-decision case signalled and the parent-died case returned an empty `appliedPids`. Post-fix both pass, and 14 tests are green across the two phase suites.

The live-parent safety property still refuses, now with `classification-not-reapable` recorded rather than the row being filtered out unseen — an explicit refusal is stronger evidence than silence, so that assertion was tightened rather than relaxed to accommodate the change.

Two pre-existing tests broke on the fail-closed default and were made explicit. They had been passing because of the very default this packet removed, which is worth stating plainly: the old suite was green partly by accident.

Playbook contract validator PASS with 0 violations; comment hygiene clean across the changed code.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### The P2 set, judged rather than swept

`P2-007` was fixed: the isolation guard read test context from environment variables alone, so a worker spawned without inheriting them read as production and would quietly resolve the live database. Same fail-open class as the kill-switch finding. It now also consults the runner's own in-process marker, which survives an environment gap.

The rest were read and deliberately not fixed:

- `P2-002` (socket filter broadened by an empty path) — the ownership evidence carries no per-daemon socket path, so there is nothing to narrow with, and the broad check errs toward refusing to terminate. Wrong direction to "fix".
- `P2-005` (rotation can lose the older copy) — one retained generation is what the phase specified. Two rapid rotations discarding the oldest is the retention policy behaving as designed.
- `P2-001` (wall-clock grace vs NTP), `P2-004` (CRC32 lock-key collisions), `P2-006` (lock TOCTOU), `P2-003` (default timeout tuning), `P2-008` (symlinked dirname in the root walk) — all real, all low-consequence relative to their fix cost. Each would widen this packet past the finding that motivated it.

### The dry-run finding, resolved

The live dry-run flagged three processes as eligible, including the shared memory daemon holding the production database. Running the real apply predicate against the real process table — with a recording stub in place of the signal, so nothing could be terminated — showed it signals nothing at all:

    WOULD SIGNAL: []
    15372  ownership-evidence-unavailable
    74254  ownership-evidence-unavailable
    76554  ownership-evidence-unavailable
    18939  classification-not-reapable

The ownership-evidence gate is what protects the daemon: no valid owner lease means no termination, however orphaned the process looks from the outside. The plan stage is deliberately permissive and the apply stage is strict, and that split is doing its job.

This means the opt-in default was defence in depth rather than a rescue. It stays, because a feature that begins terminating daemons on every host the moment it ships is wrong independently of whether its gates happen to hold — but the gates did hold, and claiming otherwise would overstate what was found.

### Other

These fixes postdate the review's terminal pass, so they are unreviewed by the loop that motivated them, and their controls are mine — the exact pattern the review caught. A future pass should treat this packet as unaudited.
<!-- /ANCHOR:limitations -->

---


