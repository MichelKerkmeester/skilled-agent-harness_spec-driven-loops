---
title: "Acceptance Criteria: Phase 12: folder-architecture"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "folder architecture acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/012-folder-architecture"
    last_updated_at: "2026-11-28T11:26:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-folder-architecture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: folder-architecture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/012-folder-architecture
**Level:** 2
**Status:** Draft
**Date:** 2026-11-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 011.007, 010.003 and every runtime unit merged on `main`, When the phase opens, Then `scratch/tree-baseline.md` records `BASE` and, for each in-scope root, its file count, folder count, one-file folders and deepest path | `rg -n 'BASE' scratch/tree-baseline.md` prints the commit and `rg -c '^\| ' scratch/tree-baseline.md` prints at least 6 | Unmet | - |
| AC-002 | REQ-002 | Given the baseline, When the map is written, Then every candidate is a row with an id, an old path, a verdict, a new path for a move and a non-empty reason, and no move lands that the map does not list | `rg -n '^\| M[0-9]{3} \|[^|]*\|[^|]*\|[^|]*\| *\|' scratch/move-map.md` prints nothing, and every renamed path in `git diff -M --name-status $BASE HEAD -- .skilled` is a `move` row | Unmet | - |
| AC-003 | REQ-003 | Given the landed moves, When git compares `BASE` with the final commit, Then every move reads as a rename and no file under an in-scope root reads as deleted | `git diff -M --diff-filter=D --name-only $BASE HEAD -- .skilled` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given each `move` row, When the repository is searched for its old path, Then no file names it outside this phase's `scratch/` | `rg -n -F '<old path>' . -g '!specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/**'` prints nothing for every `move` row | Unmet | - |
| AC-005 | REQ-005 | Given the final state, When the runtime gates run, Then they print the baseline counts and fail nothing | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints the `Test Files` and `Tests` counts in `scratch/gate-baseline.md` with no `failed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0 | Unmet | - |
| AC-006 | REQ-006 | Given the final state, When the crate gates run, Then each passes with the baseline counts | `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings` and `cargo test --locked`, each with `--manifest-path .skilled/crates/bots-tui/Cargo.toml`, exit 0 and every `test result: ok` line matches the baseline's passed and ignored counts | Unmet | - |
| AC-007 | REQ-007 | Given the final state, When the executor audit tests and the CI design diff guard run, Then both pass | The executor audit tests print the baseline counts, and the guard's `diff` commands from `.github/workflows/bots-runtime.yml` print nothing | Unmet | - |
| AC-008 | REQ-008 | Given the final state, When the playbook validator runs, Then the package still holds all 58 scenarios with no violation | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0` | Unmet | - |
| AC-009 | REQ-009 | Given the final state, When the hub check runs, Then the hub and its mode routing stay valid | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` prints `OK: parent-skill-check`, and every path in the hub's `mode-registry.json` and `hub-router.json` exists | Unmet | - |
| AC-010 | REQ-010 | Given the final state, When the gate-input check runs, Then every workflow path it reads resolves and every filter names both roots | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` | Unmet | - |
| AC-011 | REQ-011 | Given the final state, When the tree is measured again, Then the skill holds fewer one-file folders than the baseline, or the keep rows give the reason it does not | `scratch/tree-after.md` repeats the baseline's measures, and its one-file folder count under the skill is lower than the one in `scratch/tree-baseline.md` or names the keep rows that hold it | Unmet | - |

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

All eleven criteria are Unmet, because the phase opens only after 011.007, 010.003 and every runtime unit have merged.
<!-- /ANCHOR:closure -->
