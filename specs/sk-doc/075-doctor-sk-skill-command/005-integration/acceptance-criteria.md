---
title: "Acceptance Criteria: Phase 5: integration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "integration acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/005-integration"
    last_updated_at: "2026-10-30T07:30:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/005-integration
**Level:** 2
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a temp repo with `HERMES_SKILLS_OUTPUT_DIR` set, When convert finishes, Then `sync-skills-hermes.cjs --check` passes | Command output | Unmet | - |
| AC-002 | REQ-002 | Given the temp repo with `SKILL_GRAPH_FRESHNESS_ROOT` set, When convert finishes, Then `skill-graph-freshness.cjs --strict` exits 0 | Exit status | Unmet | - |
| AC-003 | REQ-003 | Given a converted skill, When `readlink .skilled/changelog/<name>` runs, Then it prints `../skills/<name>/changelog` and that folder holds `v<version>.md` | Command output and `ls` | Unmet | - |
| AC-004 | REQ-004 | Given fleet reach output captured before and after the change, When `cmp` compares them, Then it prints nothing | `cmp` output | Unmet | - |
| AC-005 | REQ-005 | Given no `.hermes/`, When convert runs I5, Then it reports n/a and `.hermes/` still does not exist | Test case | Unmet | - |
| AC-006 | REQ-006 | Given an adopter skill, When I4 runs, Then `skill-advisor-regression-cases.jsonl` is byte-identical and the output holds the rows and the `--dataset` command | Test case | Unmet | - |
| AC-008 | REQ-008 | Given a converted adopter fixture, When I4 runs, Then `benchmark/advisor-cases.jsonl` holds the rows, `package_skill.py --check --strict` prints `Result: PASS` and `skill_advisor_regression.py --dataset` on the file exits 0 | Test case and command output | Unmet | - |
| AC-007 | REQ-007 | Given any convert run, When I1 runs, Then no `advisor_rebuild` call is made and `/doctor:skill-advisor rebuild` is printed as the fallback | Traced test case | Unmet | - |

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

The phase is planned and no criterion has been verified yet.
<!-- /ANCHOR:closure -->
