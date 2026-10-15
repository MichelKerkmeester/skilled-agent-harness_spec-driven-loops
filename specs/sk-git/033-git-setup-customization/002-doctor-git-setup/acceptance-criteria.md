---
title: "Acceptance Criteria: Phase 2: doctor-git-setup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor git setup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-doctor-git-setup"
    last_updated_at: "2026-10-15T06:52:16Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: doctor-git-setup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/033-git-setup-customization/002-doctor-git-setup
**Level:** 2
**Status:** Draft
**Date:** 2026-10-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new route row, When `route-validate.sh` runs, Then it passes and lists `setup` under `/doctor:git` as read-only | `route-validate.sh` output | Unmet | - |
| AC-002 | REQ-002 | Given a fixture repository, When the battery runs, Then it prints eleven result rows, a repair line for each FAIL and a final `STATUS=` line, and exits 0 when all pass and 1 when one fails | `git-setup-check.test.cjs` | Unmet | - |
| AC-003 | REQ-002 | Given no git repository, When the battery runs, Then it exits 2 with a usage message | `git-setup-check.test.cjs` | Unmet | - |
| AC-004 | REQ-003 | Given a fixture repository, When the battery runs, Then its file tree, `git config --list` and git directory are unchanged | No-write test in `git-setup-check.test.cjs` | Unmet | - |
| AC-005 | REQ-004 | Given an untrusted fixture clone with a planted helper under its own `.skilled/`, When the battery runs, Then the planted helper never runs and the trust check reports SKIP | Planted-helper test | Unmet | - |
| AC-006 | REQ-005 | Given no contract, an enforced contract and a malformed rules block, When the standards check runs, Then it reports not enforced, PASS and FAIL in turn | Standards fixtures | Unmet | - |
| AC-007 | REQ-006 | Given a run from one AI tool, When the advisory hook check runs, Then it reports that tool's registration and SKIP with file paths for the others | Advisory fixture | Unmet | - |
| AC-008 | REQ-007 | Given `--json`, When the battery runs, Then it prints one parseable object with id, result, source, details and repair per check | JSON test | Unmet | - |
| AC-009 | REQ-008 | Given a `hard-rules.json` rule naming an unknown check, When the advisory rules check runs, Then it fails and names the rule | Advisory rules fixture | Unmet | - |
| AC-010 | REQ-009 | Given every target list in scope, When searched for `/doctor:git` targets, Then each names `setup`, and the playbook holds one setup scenario | `rg` over the scoped files | Unmet | - |
| AC-011 | REQ-010 | Given the root README, When a reader reaches the adaptation guide, Then an sk-git section points to `/doctor:git setup` as the proof step | `README.md` section | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
