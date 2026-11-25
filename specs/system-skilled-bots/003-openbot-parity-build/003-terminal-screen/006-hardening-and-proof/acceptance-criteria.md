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
    last_updated_at: "2026-11-25T21:20:29Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Applied the ui-review-1 findings that edit this child"
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

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-012 | Given the crate `002` to `005` land, When `cargo fmt --check` runs, Then it exits 0 and rewrites no file | `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0, and `git status --porcelain crates/bots-tui` lists no file the run rewrote | Unmet | - |
| AC-002 | REQ-013 | Given the same crate, When the linter runs over every target at the deny level, Then it exits 0 | `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 | Unmet | - |
| AC-003 | REQ-014 | Given the same crate, When the suite runs, Then every target reports `ok` and no target reports `FAILED` | `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED` | Unmet | - |
| AC-004 | REQ-002 | Given the crate's manifest and the files it ships that carry code, When the licence is read, Then the manifest declares MIT and no code file carries the design reference's licence header | `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1 \| jq -r '.packages[0].license'` prints `MIT`, and `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing, because `README.md` and `design/` name the licence by design | Unmet | - |
| AC-005 | REQ-002 | Given the crate's sources, When the design reference is grepped, Then every match is a comment naming it and no copied function is present | `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines, and `rg -n 'use openhuman\|openhuman_tui::' crates/bots-tui/src` prints nothing, because a copied function would arrive through an import of the reference's crate | Unmet | - |
| AC-006 | REQ-015 | Given the crate README, When a reader looks for the way in, Then it names the build, the run, every bound key, the eight glyphs with their ASCII fallback and the two flags that select it, the design reference and the no-code statement | `rg -n 'cargo build --release' crates/bots-tui/README.md`, `rg -n 'Ctrl\+C' crates/bots-tui/README.md`, `rg -n 'ASCII\|--ascii\|--mono' crates/bots-tui/README.md`, `rg -n 'openhuman' crates/bots-tui/README.md` and `rg -n 'no code' crates/bots-tui/README.md` each print at least one line | Unmet | - |
| AC-007 | REQ-016 | Given the eight defects the parent lists, When the audit runs, Then each row prints its expected output | `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8, and each row of the Defect Audit table prints its expected output, so no defect is audited by assertion alone | Unmet | - |
| AC-008 | REQ-017 | Given this child's documents, When strict validation runs, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED` | Unmet | - |
| AC-009 | REQ-018 | Given the runtime's tests, When the suite runs after the crate's repairs, Then no test fails | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed` | Unmet | - |
| AC-010 | REQ-019 | Given the skill document and both hub mirrors, When the verb is grepped, Then one line names it and each mirror is a symlink | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line, `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0, and `rg -c 'ui' .opencode/bin/bots.cjs` prints the same count as `.skilled/bin/bots.cjs` | Unmet | - |
| AC-011 | REQ-020 | Given the design folder, When every pointer is resolved, Then the four documents are there, none dangles and the folder names the reference and its licence | `ls crates/bots-tui/design` prints `component-inventory.md`, `glyph-table.md`, `key-map.md` and `mockups.md`, `rg -o --no-filename 'specs/system-skilled-bots/context/[^ :]+:[0-9]+' crates/bots-tui/design \| sort -u \| while IFS=: read -r p l; do test -f "$p" && test "$l" -le "$(awk 'END{print NR}' "$p")" \|\| printf 'DANGLING %s:%s\n' "$p" "$l"; done` prints nothing, and `rg -n 'GPL-3.0' crates/bots-tui/design` prints one line | Unmet | - |
| AC-012 | REQ-021 | Given the CI job, When its gate set is read, Then it runs the same three gates this phase runs | `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `rg -n 'cargo fmt\|cargo clippy\|cargo test' .github/workflows/bots-runtime.yml` prints the three gate steps | Unmet | - |

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

The crate does not exist yet, so AC-001 is unmet and every gate criterion depends on it. Nothing is waived, so no decision record carries a closure ADR.
<!-- /ANCHOR:closure -->
