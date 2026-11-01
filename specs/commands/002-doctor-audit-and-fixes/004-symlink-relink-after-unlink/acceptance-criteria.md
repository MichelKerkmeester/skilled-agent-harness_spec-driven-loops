---
title: "Acceptance Criteria: Phase 4: symlink-relink-after-unlink"
description: "The eight criteria and their observed evidence for giving each symlink apply its own run folder."
trigger_phrases:
  - "symlink relink after unlink acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/004-symlink-relink-after-unlink"
    last_updated_at: "2026-11-01T09:10:00Z"
    last_updated_by: "opus-medium"
    recent_action: "Closed the acceptance criteria from verified evidence"
    next_safe_action: "Operator reviews and commits the uncommitted change"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/symlink-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-symlink-relink-after-unlink"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: symlink-relink-after-unlink

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-symlink-relink-after-unlink
**Level:** 2
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture linked by `apply` and undone by `unlink --yes`, When the same tree is planned and `apply --plan-digest <same digest>` runs, Then it exits 0 and prints a run directory different from the first | `scratch/red-before-change.md` (exit 2, `EEXIST`, before); `scratch/verification-evidence.md` (relink test `pass 1`, after) | Met | - |
| AC-002 | REQ-002 | Given the first run's `manifest.json` read after the unlink, When the relink apply finishes, Then the file is byte-identical | `symlink-engine.test.cjs` relink test (`fs.readFileSync` equality); `scratch/verification-evidence.md` (`pass 1`) | Met | - |
| AC-003 | REQ-003 | Given any apply, When it claims a run folder, Then the folder name starts with the first 16 hex characters of the digest, and the first run of a digest takes the plain prefix | Relink test `startsWith` assertion; `scratch/red-before-change.md` shows the first run at `doctor-symlink/5a04d2913a6c3745` | Met | - |
| AC-004 | REQ-004 | Given the numbered relink run, When `unlink --run <it> --yes` runs, Then it exits 0 and the `.skilled` link is gone | Relink test second unlink; `scratch/verification-evidence.md` | Met | - |
| AC-005 | REQ-004 | Given copies of a run folder named `<prefix>-x`, `<prefix>-0` and `copied-run`, When `unlink --run <copy> --yes` runs, Then each exits 2 with `does not match the recorded source and digest` and the target is unchanged | Edge test `unlink refuses a run folder`; `scratch/verification-evidence.md` (`pass 1`) | Met | - |
| AC-006 | REQ-005 | Given the final tree, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then it exits 0 with `7 suite(s) passed, 0 failed` | `scratch/verification-evidence.md` (exit 0; node aggregate 1001 pass, 0 fail, against a 999 baseline) | Met | - |
| AC-007 | REQ-006 | Given the docs, When `rg -c "prefix>-2"` runs over `symlink.md`, `assets/doctor-symlink-link.yaml` and `_routes.yaml`, Then each prints 1, and `doctor-symlink-contract.test.cjs` still passes | `scratch/verification-evidence.md` (three counts of 1; contract `pass 34`) | Met | - |
| AC-008 | REQ-002 | Given the changed engine, When `rg -n "slice\(0, 16\)"` runs over it, Then it prints no line, so no fixed run-folder derivation is left | `scratch/verification-evidence.md` (exit 1, no line) | Met | - |

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

All eight criteria are Met with the evidence cited in the table. The change is uncommitted; the operator approves the commit separately.
<!-- /ANCHOR:closure -->
