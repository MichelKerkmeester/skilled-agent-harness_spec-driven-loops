---
title: "Implementation Summary: File Placement and Layout Correction"
description: "Three placement fixes applied, two refuted against the benchmark archive contract, three routed to the phases that own their decisions."
trigger_phrases:
  - "misplacement layout summary"
  - "017 phase 005 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/005-misplacement-and-layout"
    last_updated_at: "2026-07-27T14:35:33Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Applied three placement fixes via a three-worker LUNA swarm"
    next_safe_action: "Begin phase 006 hub documentation and runtime drift"
    blockers: []
    key_files:
      - "approved-findings.md"
      - "refutations.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-005"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "319 committed files embed an absolute workstation path; worth a scoped audit."
    answered_questions:
      - "Archived run-labels are never renamed; the naming standard applies to new runs only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-misplacement-and-layout |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A script that only ran on one machine now runs anywhere, personal keyboard configuration left the shared repository without leaving the operator's disk, and a hub layout diagram matches what is actually on disk.

| Finding | Result |
|---------|--------|
| `fanout:SOL-09` | APPLIED — `.scan-one.sh` derives `REPO_ROOT` from its own location instead of hardcoding a homedir |
| `devin-04:F7` | APPLIED — `karabiner.json` untracked and ignored, file preserved on disk |
| `devin-01:F13` | APPLIED — sk-doc layout block now lists `feature-catalog/` |
| `devin-01:F18` | REFUTED — the changelog is imprecise about location, not false; routed to 006 |
| `devin-05:F3` | REFUTED — renaming archived run-labels violates the never-repurpose contract |
| `devin-03:F9`, `devin-03:F10` | ROUTED to 006 — real runner gaps, but wiring versus removing is a decision |
| `fanout:SOL-06` | ROUTED to 007 — generated routing topology belongs with contract drift |

### The karabiner decision

The finding said personal configuration does not belong in a shared repository, which is right. Hard-deleting it would also have taken the operator's working shortcuts with it, since the file lives at the repository root. Untracking plus ignoring achieves the stated goal and costs the operator nothing. This also resolves the shortcut finding phase 003 deferred: once the file is untracked, a broken reference inside it stops being a repository concern.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three GPT-5.6-LUNA workers at xhigh effort in one wave. Each change was verified independently afterwards: the rewritten path resolution was walked by hand to confirm `REPO_ROOT` lands on the repository root and that both derived paths exist, the karabiner change was checked on all three axes at once (ignored, untracked, still on disk), and the SKILL.md diff was inspected to confirm it touched exactly one line.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Untrack karabiner.json rather than delete it | Achieves the finding's goal without destroying the operator's local configuration |
| Refuse the run-label rename | Third phase in which the additive, never-repurposed archive contract stopped a proposed change |
| Route the two runner gaps rather than resolve them | Both tests exist and neither runs; wiring or removing is a decision beyond a placement pass |
| Fix one absolute-path script, flag the other 319 | Widening the phase silently would have been scope creep; the number deserves its own audit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.scan-one.sh` free of absolute paths | PASS, zero `/Users/` matches, `bash -n` clean |
| Resolved `REPO_ROOT` targets exist | PASS, `validate.sh` and `.opencode/specs` both resolve |
| karabiner untracked, ignored, on disk | PASS on all three |
| sk-doc layout diff scope | PASS, one line changed |
| Containment | PASS, concurrent-session paths untouched |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **319 committed files still embed an absolute workstation path.** Many are benchmark reports where recording the run-time path is legitimate, so the real defect count is lower — but it needs a scoped audit to separate the two.
2. **Two test directories still have no runner.** Routed, not fixed.
3. **The karabiner file remains on disk untracked.** If the operator wants it gone entirely, that is a local deletion, not a repository change.
<!-- /ANCHOR:limitations -->
