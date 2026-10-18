---
title: "Acceptance Criteria: Phase 7: install-guidance-and-setup-helper"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "install guidance and setup helper acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/007-install-guidance-and-setup-helper"
    last_updated_at: "2026-10-18T12:45:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-install-guidance-and-setup-helper"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: install-guidance-and-setup-helper

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/007-install-guidance-and-setup-helper
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-005 | Given an empty throwaway home, When `opencode-setup.sh both` runs and then runs again, Then the first run exits 0, the name `opencode` reports `1.19.3`, the name `opencode2` reports `opencode v2.0.32`, the launcher sets `OPENCODE_DB` to a path other than `opencode.db`, the second run changes no file, each step prints its rollback line, and the operator snapshot is unchanged. | The T010 and T011 commands in tasks.md, run with the environment in plan.md section 4.3. The version lines, the launcher trace, the hash comparison and the snapshot comparison (T015) are recorded in the log. | Unmet | - |
| AC-002 | REQ-003, REQ-005 | Given the throwaway layout from AC-001, When `opencode-setup.sh check` runs, Then it names both binaries, classifies `opencode` as v1 and `opencode2` as v2 by output shape, lists the database files, reports that the v2 bin directory is off PATH, exits 0, and changes no file. | The T012 command in tasks.md. The output and the hash comparison are recorded in the log. | Unmet | - |
| AC-003 | REQ-004, REQ-007, REQ-008 | Given the install reference, When sk-doc validation runs with the install guide type, Then no blocking error is reported, and the reference names the irreducible gaps and marks Homebrew as a v2-only, exclusive channel. | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md --type install_guide`, exit 0 with no blocking error. Then `rg -n 'Homebrew|irreducible' .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` shows the sections. | Unmet | - |

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

Not closeable yet. No criterion has run, and the phase has not started. Write this
paragraph when the packet is closed, not before.
<!-- /ANCHOR:closure -->
