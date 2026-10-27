---
title: "Acceptance Criteria: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "quality resolver acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/004-quality-resolver"
    last_updated_at: "2026-10-27T23:00:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed test runs against the HEAD and the changed runner"
    next_safe_action: "Conductor merges the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/references/runner-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "quality-resolver-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `004-quality-resolver`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a SKILLED file and a foreign file, When `--explain a b` and `--explain a --explain b` run, Then both exit 2 with equal `files` arrays of two entries, SKILLED for the first and UNKNOWN for the second | Case `explain several files` passes; against the `HEAD` runner it fails. Before: `--explain README.md AGENTS.md` printed `USAGE: unknown argument AGENTS.md`, exit 3. After: exit 2, two `files` entries. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2576` | Met | - |
| AC-002 | REQ-002 | Given an outside surface reached through a `local-*` link with no quality block, When explain runs with the link's target inside `SPECKIT_PRIVATE_SKILL_ROOTS` and again without it, Then the first names the link folder with owner `outside-skill` and the second reads `UNKNOWN` with no folder | Case `explain outside surface: a trusted private link` passes; fails against `HEAD`. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2550` | Met | - |
| AC-003 | REQ-003 | Given rows from the base layer, the repository config, a hub surface and an outside skill, When explain runs, Then each row's `source` and `sources` name that seat | Cases `explain several files` (`default`, `hub-surface`, `repo-config`) and `explain outside surface with a quality block` (`outside-skill`) pass; both fail against `HEAD`. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:1178` | Met | - |
| AC-004 | REQ-004 | Given a repository checklist with a valid override section and one that drops `secret.aws-access-key`, When explain runs, Then the first reads `refused: false` with its two rows and the second `refused: true` with a hard-floor error at line 7 | Case `explain overrides` passes; fails against `HEAD`. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2542` | Met | - |
| AC-005 | REQ-005 | Given a trusted configured command and a spy `python3` that each write a canary, When explain runs on two files under the snapshot guard, Then neither canary exists and no file changed | Case `explain starts nothing` passes; every new case wraps its calls in `assertSnapshotUnchanged`. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2588` | Met | - |
| AC-006 | REQ-006 | Given one path, When the `HEAD` runner and the changed runner explain it, Then the output is identical once `files`, `surface_skills`, `source`, `sources` and `overrides` are removed | `SAME` on four real files: `quality-gate.cjs`, `README.md`, `.github/workflows/advisory-checks.yml`, the parent `spec.md`, both exit 2; case `explain one file` pins the key order. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2585` | Met | - |
| AC-007 | REQ-007 | Given the runner contract, When it is validated, Then it documents the multi-file shape and every new field with 0 issues | `validate_document.py --json` `"total_issues": 0`. Text: `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:175` | Met | - |
| AC-008 | REQ-008 | Given the quality runner tests, When `node --test *.test.cjs` runs, Then every case passes | Baseline `tests 123 pass 123 fail 0`. After: `tests 129 pass 129 fail 0`, exit 0. Cases: `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:822` | Met | - |
| AC-009 | REQ-009 | Given the changelog entry and the Hermes copies, When they are checked, Then the entry has 0 issues and the copies are in sync | `validate_document.py --json` `"total_issues": 0` for `v1.13.3.0.md`; `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`. Carrier: `.skilled/skills/sk-code/sk-code-quality/SKILL.md:5` | Met | - |

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

**Closeable:** Yes

Every criterion is met with observed runs against the `HEAD` runner and the changed one.
<!-- /ANCHOR:closure -->
