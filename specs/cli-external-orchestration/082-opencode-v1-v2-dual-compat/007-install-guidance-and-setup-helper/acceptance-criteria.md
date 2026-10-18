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
    recent_action: "All three criteria Met with observed evidence"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-install-guidance-and-setup-helper"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-005 | Given an empty throwaway home, When `opencode-setup.sh both` runs and then runs again, Then the first run exits 0, the name `opencode` reports `1.19.3`, the name `opencode2` reports `opencode v2.0.32`, the launcher sets `OPENCODE_DB` to a path other than `opencode.db`, the second run changes no file, each step prints its rollback line, and the operator snapshot is unchanged. | Observed: `scratch/final/both-1.txt`, exit 0, `opencode -> 1.19.3 [v1]` and `opencode2 -> opencode v2.0.32 [v2]`. `scratch/final/launcher-trace.txt` shows `: opencode-v2.db` and `export OPENCODE_DB`. `scratch/final/both-2.txt` skips both pinned installs, leaves the launcher unchanged and prints each rollback line. `scratch/final/idempotence.txt:2-7`: tree hash c3084e25dcecce17, 13 files, after run 1 and after run 2. `scratch/bracket/before-after.diff:1-8` shows no difference caused by the proof: it names only `opencode.db-shm` and `opencode-next.db-shm`, which also moved between two snapshots taken with nothing of the orchestrator's running (`scratch/old-proofs/fix3/bracket/noise-1.txt:26` against `scratch/old-proofs/fix3/bracket/noise-2.txt:26`, and the same for line 32, decision 16). | Met | - |
| AC-002 | REQ-003, REQ-005 | Given the throwaway layout from AC-001, When `opencode-setup.sh check` runs, Then it names both binaries, classifies `opencode` as v1 and `opencode2` as v2 by output shape, lists the database files, reports that the v2 bin directory is off PATH, exits 0, and changes no file. | Observed: `scratch/final/check.txt:7`, exit 0 (`scratch/final/check.txt:26`), names both binaries, shapes v1 (`scratch/final/check.txt:11`) and v2 (`scratch/final/check.txt:17`), lists the database folder (`scratch/final/check.txt:21`), reports the v2 bin folder off PATH (`scratch/final/check.txt:24`). The tree hash is unchanged after check and `scratch/final/files-changed-by-check.txt` is empty, because the probes point `XDG_DATA_HOME` at a temporary folder (decisions 18 and 19). | Met | - |
| AC-003 | REQ-004, REQ-007, REQ-008 | Given the install reference, When sk-doc validation runs with the install guide type, Then no blocking error is reported, and the reference names the irreducible gaps and marks Homebrew as a v2-only, exclusive channel. | Observed: `scratch/final/validator.txt:4`, 0 issues, exit 0 (`scratch/final/validator.txt:5`), run with the validator's real path `.skilled/skills/sk-doc/shared/scripts/validate_document.py`. `scratch/final/static-checks.txt:44` and `scratch/final/static-checks.txt:48` show the Homebrew section at line 168 ("Homebrew Is v2-Only and Exclusive") and the gaps section "Gaps That No Recipe Closes" at line 388; the regex `irreducible` has no hit because the heading says it in plain words (decision 18). | Met | - |

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

All three criteria are Met with observed evidence. The helper builds the side-by-side pair in a throwaway HOME, a second run and `check` leave the tree hash unchanged, the operator's installs show only the two shared-memory files the live service moves by itself, and the install reference validates with 0 issues. The one design change on the way, probing with a temporary data folder so the v2 log stays out of HOME, is recorded in `scratch/decisions.txt` 18 and 19.
<!-- /ANCHOR:closure -->
