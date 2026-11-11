---
title: "Acceptance Criteria: Phase 9: overlay-write-checks-follow-up"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "overlay write checks follow up acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up"
    last_updated_at: "2026-11-11T19:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Wrote the criteria"
    next_safe_action: "Run task T003, the baseline"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-overlay-write-checks-follow-up-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: overlay-write-checks-follow-up

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-overlay-write-checks-follow-up
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Each row is Unmet until its task in `tasks.md` is done and the Verification cell names what was observed.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `references/overlays.md` with 8 trigger phrases, When the Skill Doc Frontmatter workflow runs on `main`, Then it concludes `success` | Pending | Unmet | - |
| AC-002 | REQ-002 | Given a lock file naming a pid that does not exist, When `apply` runs, Then it prints one line naming the dead owner and proceeds, and a lock naming a live pid, no pid or a malformed line exits 2 | Pending | Unmet | - |
| AC-003 | REQ-003 | Given a manifest whose layout link target changed after an apply, When `apply` runs, Then the link points at the new target, and a link the state file does not record stays a problem | Pending | Unmet | - |
| AC-004 | REQ-004 | Given an `appendItems` overlay that dropped one item it added earlier, When `apply` runs, Then the item leaves the live file, and a dropped item edited by hand stays and is reported | Pending | Unmet | - |
| AC-005 | REQ-005 | Given the glob `a/**/x.json`, When the guard judges `a/x.json`, `a/b/x.json` and `a/my-x.json`, Then the first two are allowed and the third is refused | Pending | Unmet | - |
| AC-006 | REQ-006 | Given `strictWrites` true and a `repin.exclude` folder, When `--guard` and `pre-commit` judge a path under it, Then both allow it | Pending | Unmet | - |
| AC-007 | REQ-007 | Given a staged CRLF copy of an upstream LF file, When `pre-commit` runs, Then it exits 0 | Pending | Unmet | - |
| AC-008 | REQ-008 | Given the changed engine, When `node --test tests/` runs in the doctor scripts folder, Then it prints `fail 0` with at least 1,100 passes | Pending | Unmet | - |
| AC-009 | REQ-009 | Given a `repin.rootFiles` overlay whose upstream file changed, When `status` runs, Then it prints one line naming the file and exits 1 | Pending | Unmet | - |
| AC-010 | REQ-010 | Given one overlay source off the layout, When `status` runs, Then it prints one line naming the source and where it belongs, and the exit code is what it was without the line | Pending | Unmet | - |
| AC-011 | REQ-011 | Given off-layout sources of each scope, When `relayout` runs, Then each sits at its layout path, the manifest names the new paths, a backup of each moved path exists and each old and new path is printed. With a target present it exits 2 and moves nothing | Pending | Unmet | - |
| AC-012 | REQ-012 | Given an unowned vendored file that differs from upstream and an upstream link the tree lacks, When `status --audit` runs, Then both are listed, and an owned or generated path is not | Pending | Unmet | - |
| AC-013 | REQ-013 | Given the OpenCode adapter and a tree with `strictWrites` true, When a write tool targets an unowned vendored path, Then the adapter throws the engine's refusal line. With no manifest it does nothing | Pending | Unmet | - |
| AC-014 | REQ-014 | Given the four groups of paths the review named, When the strict-writes test file runs, Then each group has a passing test, and a CI workflow file names the `overlay-guard` tests | Pending | Unmet | - |
| AC-015 | REQ-015 | Given the changed command documents, When `route-validate.sh` and the contract test run, Then both pass | Pending | Unmet | - |
| AC-016 | REQ-016 | Given the pushed implementation, When `/deep:review` has run 5 iterations and a fresh Opus agent has written the synthesis, Then every P0 and P1 finding is fixed or rejected with evidence in `implementation-summary.md` | Pending | Unmet | - |
| AC-017 | REQ-017 | Given the final commit on `main`, When the release is republished, Then on origin the `v4.0.2.1` tag and `main` name one commit and the release body equals the built notes | Pending | Unmet | - |

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

No criterion is Met yet. The work has not started.
<!-- /ANCHOR:closure -->
