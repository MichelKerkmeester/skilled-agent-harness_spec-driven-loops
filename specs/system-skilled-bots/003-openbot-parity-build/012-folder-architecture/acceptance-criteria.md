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
    last_updated_at: "2026-11-28T18:00:00Z"
    last_updated_by: "012-orchestrator"
    recent_action: "Met AC-007 after the guard fix"
    next_safe_action: "Merge gate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-folder-architecture"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 011.007, 010.003 and every runtime unit merged on `system-skilled-bots`, When the phase opens, Then `scratch/tree-baseline.md` records `BASE` and, for each in-scope root, its file count, folder count, one-file folders and deepest path | `rg -n 'BASE' scratch/tree-baseline.md` prints the commit and `rg -c '^\| ' scratch/tree-baseline.md` prints at least 6. Observed 2026-11-28: `scratch/tree-baseline.md` records BASE `1937abca82319d1e985992709464c54300894ca6`, short `1937abca823`, and the skill held 123 one-file folders at that commit. | Met | - |
| AC-002 | REQ-002 | Given the baseline, When the map is written, Then every candidate is a row with an id, an old path, a verdict, a new path for a move and a non-empty reason, and no move lands that the map does not list | `rg -n '^\| M[0-9]{3} \|[^\|]*\|[^\|]*\|[^\|]*\| *\|' scratch/move-map.md` prints nothing, and every renamed path in `git diff -M --name-status $BASE HEAD -- .skilled` is a `move` row. Observed 2026-11-28: `scratch/move-map.md` holds 32 M rows, 1 move and 31 keep, and 28 R rows, 2 readme and 26 skip. The one move is row M016, `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub/osascript` to `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub.sh`, landed by `git mv` with mode 100755 kept and read by git as R100. | Met | - |
| AC-003 | REQ-003 | Given the landed moves, When git compares `BASE` with the final commit, Then every move reads as a rename and no file under an in-scope root reads as deleted | `git diff -M --diff-filter=D --name-only $BASE HEAD -- .skilled` prints nothing. Observed 2026-11-28: `git diff -M --diff-filter=D --name-only 1937abca823 HEAD -- .skilled` prints nothing, and the one move reads as R100. | Met | - |
| AC-004 | REQ-004 | Given each `move` row, When the repository is searched for its old path, Then no file names it outside this phase's `scratch/` | `rg -n -F '<old path>' . -g '!specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/**'` prints nothing for every `move` row. Observed 2026-11-28: `rg -n -F` for the old full path and `rg` for the tails `osascript-stub`, `osascript` and `osascript-stub/` print nothing outside `scratch/`. `runtime/tests/delivery.vitest.ts` line 74 and `runtime/tests/fixtures/README.md` name the new path. | Met | - |
| AC-005 | REQ-005 | Given the final state, When the runtime gates run, Then they print the baseline counts and fail nothing | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints the `Test Files` and `Tests` counts in `scratch/gate-baseline.md` with no `failed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0. Observed 2026-11-28: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints `Test Files 57 passed (57)` and `Tests 794 passed (794)` with no `failed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0. Both ran at BASE and again at FINAL with the same result. | Met | - |
| AC-006 | REQ-006 | Given the final state, When the crate gates run, Then each passes with the baseline counts | `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings` and `cargo test --locked`, each with `--manifest-path .skilled/crates/bots-tui/Cargo.toml`, exit 0 and every `test result: ok` line matches the baseline's passed and ignored counts. Observed 2026-11-28: `cargo fmt --check` exits 0, `cargo clippy --locked --all-targets -- -D warnings` exits 0 and `cargo test --locked` exits 0 with lib 148, main 0, answer_flow 24, chat 41, cli_client 8, end_to_end 2, panes 51 passed and 1 ignored, pty_smoke 1, render_keys 17 and doc-tests 0. Each ran at BASE and again at FINAL with the same result. | Met | - |
| AC-007 | REQ-007 | Given the final state, When the executor audit tests and the CI design diff guard run, Then both pass | The executor audit tests print the baseline counts, and the guard's `diff` commands from `.github/workflows/bots-runtime.yml` print nothing. Observed 2026-11-28: the executor audit tests pass with the baseline counts, 6 files and 135 passed. The guard printed the pre-existing chat-mockups.md line with exit 1 at BASE, cause 44216a6ad13. After the amendment of decision Q030 the guard step, run by hand from the YAML, exits 0 and prints nothing, and check-gate-inputs.sh prints RESULT: PASSED. | Met | - |
| AC-008 | REQ-008 | Given the final state, When the playbook validator runs, Then the package still holds all 58 scenarios with no violation | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0`. Observed 2026-11-28: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0`. | Met | - |
| AC-009 | REQ-009 | Given the final state, When the hub check runs, Then the hub and its mode routing stay valid | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` prints `OK: parent-skill-check`, and every path in the hub's `mode-registry.json` and `hub-router.json` exists. Observed 2026-11-28: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` prints `OK: parent-skill-check` with 0 warnings, and every file path in `mode-registry.json` and `hub-router.json` exists. The strings that do not resolve, `bots-cli`, `bots/config.json` and `bot.md`, are a backend kind and routing keywords, not paths. | Met | - |
| AC-010 | REQ-010 | Given the final state, When the gate-input check runs, Then every workflow path it reads resolves and every filter names both roots | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`. Observed 2026-11-28: `bash .github/scripts/check-gate-inputs.sh` prints `files=48 inputs_resolved=356 dynamic_inputs=45 twin_pairs=448 failures=0` and `RESULT: PASSED`. After the guard amendment it prints inputs_resolved=358 dynamic_inputs=44 failures=0 and RESULT: PASSED. | Met | - |
| AC-011 | REQ-011 | Given the final state, When the tree is measured again, Then the skill holds fewer one-file folders than the baseline, or the keep rows give the reason it does not | `scratch/tree-after.md` repeats the baseline's measures, and its one-file folder count under the skill is lower than the one in `scratch/tree-baseline.md` or names the keep rows that hold it. Observed 2026-11-28: `scratch/tree-after.md` records the final measures and the skill holds 122 one-file folders against 123 at BASE. The other 122 rest on keep rows M001 to M015, M017 to M020 and M032. | Met | - |
| AC-012 | REQ-012 | Given the landed moves, When the README task has run, Then `.skilled/crates/`, `.skilled/crates/bots-tui/` and every folder the move map's README table marks `readme` hold a `README.md` authored through `/create:readme` that says what belongs in the folder and what does not | `test -f .skilled/crates/README.md && test -f .skilled/crates/bots-tui/README.md` exits 0 from the repository root, `rg -c '^. R[0-9]{3} .' specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/move-map.md` prints at least 2, `for d in $(rg -N -o -r '$1' '^. R[0-9]{3} . ([^ ]+) . readme ' specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/move-map.md); do test -f "$d/README.md" && continue; echo "missing $d"; done` prints nothing and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <folder>/README.md` prints `VALID` for both named folders and every `readme` row. Observed 2026-11-28: `test -f .skilled/crates/README.md && test -f .skilled/crates/bots-tui/README.md` exits 0, `rg -c '^. R[0-9]{3} .' specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/move-map.md` prints 28, the missing-folder loop prints nothing and both readme rows print `VALID` from `validate_document.py`. `.skilled/crates/README.md` was created. `.skilled/crates/bots-tui/README.md` carries a WHAT BELONGS HERE table and a STRUCTURE tree naming every subfolder, so its subfolders are skip rows. `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/README.md` names `channels/` and describes its recordings, so `channels/` is a skip row, because the document validator exempts fixture trees and a README inside `channels/` could never print `VALID`. | Met | - |

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

All twelve criteria are Met, AC-007 after the guard amendment the operator chose as decision Q030.
<!-- /ANCHOR:closure -->
