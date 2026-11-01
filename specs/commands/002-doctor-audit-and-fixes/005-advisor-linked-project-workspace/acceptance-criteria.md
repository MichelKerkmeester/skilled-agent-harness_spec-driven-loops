---
title: "Acceptance Criteria: Phase 5: advisor-linked-project-workspace"
description: "The seven criteria and their observed evidence for letting the advisor serve a project linked to its source tree."
trigger_phrases:
  - "advisor linked project workspace acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/005-advisor-linked-project-workspace"
    last_updated_at: "2026-11-01T11:30:00Z"
    last_updated_by: "opus-low"
    recent_action: "Closed the acceptance criteria from verified evidence"
    next_safe_action: "Operator reviews and commits the uncommitted change"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-advisor-linked-project-workspace"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: advisor-linked-project-workspace

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-advisor-linked-project-workspace
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
| AC-001 | REQ-001 | Given a source tree and a project whose `.skilled` links to it, When `isWiredToSourceTree()` checks the project, a subdirectory of it and the source itself, Then each returns true | Admit test: `scratch/red-before-change.md` (failed before); `scratch/verification-evidence.md` (`18 passed`, after) | Met | - |
| AC-002 | REQ-002 | Given an unlinked directory, a `.skilled` linking to another source, a copied tree and the empty string, When `isWiredToSourceTree()` checks each, Then each returns false | Refuse test; `scratch/verification-evidence.md` (`18 passed`) | Met | - |
| AC-003 | REQ-002 | Given the rebuilt `dist/`, When `isAllowedWorkspaceRoot('/etc')` runs, Then it returns false, and an unlinked scratch directory is not wired | `scratch/verification-evidence.md` (`wired(plain)= false wired(/etc)= false`) | Met | - |
| AC-004 | REQ-003 | Given a scratch project that links only `.skilled` to this checkout and a daemon restarted on the new build, When `advisor_status --workspace-root "$PWD" --format json` runs from it, Then it exits 0 with `"status": "ok"` | `scratch/verification-evidence.md` (exit 0, `status: ok`; the scratchpad sits under the tmp prefix, so the dist check `wired(project)= true` carries the discriminating half) | Met | - |
| AC-005 | REQ-004 | Given the final tree, When the advisor suite runs, Then it exits 0 with `1361 passed, 8 skipped`, against a baseline of `2 failed, 1359 passed` | `scratch/red-before-change.md`; `scratch/verification-evidence.md` | Met | - |
| AC-006 | REQ-004 | Given the final tree, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then it exits 0 with `7 suite(s) passed, 0 failed`, as before | `scratch/red-before-change.md`; `scratch/verification-evidence.md` | Met | - |
| AC-007 | REQ-005 | Given the docs, When `rg -n "links to this source tree"` runs over the schema, `ENV-REFERENCE.md` and `advisor-recommend.md`, Then it prints one line in each | tasks T005 | Met | - |

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

All seven criteria are Met with the evidence cited in the table. The change is uncommitted; the operator approves the commit separately.
<!-- /ANCHOR:closure -->
