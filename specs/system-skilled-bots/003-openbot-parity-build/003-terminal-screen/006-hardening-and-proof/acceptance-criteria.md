---
title: "Acceptance Criteria: Phase 6: hardening-and-proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hardening and proof acceptance criteria"
  - "bots ui gates acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof"
    last_updated_at: "2026-11-25T22:43:40Z"
    last_updated_by: "integration-wave"
    recent_action: "Added AC-013 for the pseudo-terminal run and cited T018 in AC-011"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-006-hardening-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: hardening-and-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every command runs from the repository root. The Verification column names the block below that proves the row. The blocks carry the commands, because a command with a pipe in it cannot live in a table cell and still be copyable.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-012 | Given the crate `002` to `005` land, When `cargo fmt --check` runs, Then it exits 0 and rewrites no file | `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0, and `git status --porcelain crates/bots-tui` lists no file the run rewrote. Observed: exit 0 at the start and from the final state, and `git status --porcelain crates/bots-tui` lists only the files this child wrote on purpose | Met | - |
| AC-002 | REQ-013 | Given the same crate, When the linter runs over every target at the deny level, Then it exits 0 | `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0. Observed: exit 0 from the final state | Met | - |
| AC-003 | REQ-014 | Given the same crate, When the suite runs, Then every target reports `ok` and no target reports `FAILED` | `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`. Observed: lib 120, main 0, answer_flow 24, cli_client 8, end_to_end 2, panes 53 with 1 ignored, pty_smoke 1, render_keys 16 and doc 0, every target `ok` and no `FAILED` | Met | - |
| AC-004 | REQ-002 | Given the crate's manifest and the files it ships that carry code, When the licence is read, Then the manifest declares MIT and no code file carries the design reference's licence header | AC-004 block prints `MIT` then nothing, because `README.md` and `design/` name the licence by design. Observed: `MIT`, then no output from the GPL grep, exit 1 | Met | - |
| AC-005 | REQ-002 | Given the crate's sources, When the design reference is grepped, Then every match is a comment naming it and no copied function is present | AC-005 block prints only comment lines, then nothing, then `1`, the row the orchestrator records the comparison in. Observed: both greps print nothing, so no line names the reference at all, and the `Clean-room read` count prints 1 on the recorded comparison | Met | - |
| AC-006 | REQ-015 | Given the crate README, When a reader looks for the way in, Then it names the build, the run, every bound key, the eight glyphs with their ASCII fallback and the two flags that select it, the design reference and the no-code statement | AC-006 block prints at least one line for each of the five greps. Observed: the five greps print 1, 4, 4, 1 and 1 lines | Met | - |
| AC-007 | REQ-016 | Given the eight defects the parent lists, When the audit runs, Then each row prints its expected output | AC-007 block prints `8`, and each row of the Defect Audit table prints its expected output, so no defect is audited by assertion alone. Observed: `8`, and each row prints its expected output as `goal.md` section 4 records, with D4 on its amended check | Met | - |
| AC-008 | REQ-017 | Given this child's documents, When strict validation runs, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`. Observed: `RESULT: PASSED` | Met | - |
| AC-009 | REQ-018 | Given the runtime's tests, When the suite runs after the crate's repairs, Then no test fails | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`. Observed: `Test Files 43 passed (43)` and `Tests 548 passed (548)`, exit 0 | Met | - |
| AC-010 | REQ-019 | Given the skill document and both hub mirrors, When the verb is grepped, Then one line names it and each mirror is a symlink | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line, `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0, and `rg -c 'ui' .opencode/bin/bots.cjs` prints the same count as `.skilled/bin/bots.cjs`. Observed: line 33 alone, both `test -L` exit 0, and both `bots.cjs` paths count 35 | Met | - |
| AC-011 | REQ-020 | Given the design folder, When every pointer is resolved, Then the six documents are there, none dangles and the folder names the reference and its licence | `ls crates/bots-tui/design` prints `architecture.md`, `component-inventory.md`, `contracts.md`, `glyph-table.md`, `key-map.md` and `mockups.md`, the T018 block in `tasks.md` prints no `DANGLING` line, or, when `specs/system-skilled-bots/context` is absent, writes one `SKIP context-absent:` line to stderr, and `rg -n 'GPL-3.0' crates/bots-tui/design` prints one line. Observed: the six names, no `DANGLING` line over 31 unique pointers with the reference folder present, and one `GPL-3.0` line in `design/mockups.md` | Met | - |
| AC-012 | REQ-021 | Given the CI job, When its gate set is read, Then it runs the same three gates this phase runs | AC-012 block prints one line, then `2`, then the three gate steps. Observed: line 128, then `2`, then the `cargo fmt --check`, `cargo clippy --locked` and `cargo test --locked` steps at lines 158, 161 and 164 beside one comment line | Met | - |
| AC-013 | REQ-022 | Given the release binary T017 builds and the fixture, When the pseudo-terminal run sends the keys that answer one item, Then the screen draws the outcome and the fixture records one `answer` argv | `cargo test --manifest-path crates/bots-tui/Cargo.toml --release --test pty_smoke` prints `test result: ok. 1 passed` and names `answers_one_item_in_a_pseudo_terminal`. Observed: `test result: ok. 1 passed` naming `answers_one_item_in_a_pseudo_terminal`, three runs in a row, and the fixture log holds the one `answer --scope once` line | Met | - |
| AC-014 | REQ-014 | Given a status read that lists a second checkout's identity, When the rows reach the panes, Then every foreign row is dropped and a foreign item cannot be answered | `cargo test --locked --manifest-path crates/bots-tui/Cargo.toml --lib -- foreign_ unknown_identity_keeps_every_row` prints `3 passed`, and both foreign tests fail when the filter is stubbed. Observed: `3 passed`, and with `keep_own_rows` returning at once both foreign tests FAILED | Met | - |
| AC-015 | REQ-014 | Given an answer whose child sleeps past the quit, When the screen quits, Then the loop returns without the child's exit and the child's stdout is null | `cargo test --locked --manifest-path crates/bots-tui/Cargo.toml --test answer_flow quit` prints `2 passed`. Observed: `2 passed`, and with stdout piped again `quit_does_not_wait_for_answer` FAILED on its `stdout=null` assert | Met | - |

### The commands

**AC-004**: the manifest declares MIT, and no file the crate ships that carries code carries the reference's licence header.

```bash
cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'
rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock
```

**AC-005**: every match names the design reference in a comment, no import of the reference's crate appears, and the clean-room read is recorded.

```bash
rg -n 'openhuman' crates/bots-tui/src
rg -n 'use openhuman|openhuman_tui::' crates/bots-tui/src
rg -c 'Clean-room read' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/goal.md
```

**AC-006**: the README names the way in.

```bash
rg -n 'cargo build --release' crates/bots-tui/README.md
rg -n 'Ctrl\+C' crates/bots-tui/README.md
rg -n 'ASCII|--ascii|--mono' crates/bots-tui/README.md
rg -n 'openhuman' crates/bots-tui/README.md
rg -n 'no code' crates/bots-tui/README.md
```

**AC-007**: eight defect rows, and each prints its expected output.

```bash
rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md
```

**AC-012**: the CI job is in place and runs the three gates this phase runs.

```bash
rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml
rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml
rg -n 'cargo fmt|cargo clippy|cargo test' .github/workflows/bots-runtime.yml
```

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

Every row is Met with the evidence its Verification cell names. Nothing is waived or superseded, so no decision record carries a closure ADR. AC-014 and AC-015 cover the two tasks the build orchestrator added. The operator's hand answer from the overlay stays the acceptance step after the merge, and no row here waits on it.
<!-- /ANCHOR:closure -->
