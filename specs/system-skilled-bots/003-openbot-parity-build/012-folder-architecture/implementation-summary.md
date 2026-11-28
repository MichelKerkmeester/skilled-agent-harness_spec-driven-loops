---
title: "Implementation Summary"
description: "Lifted the osascript stub out of its one-file folder and gave the crates and fixture folders READMEs that say what belongs in them, with every gate unchanged."
trigger_phrases:
  - "folder architecture implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/012-folder-architecture"
    last_updated_at: "2026-11-28T17:00:00Z"
    last_updated_by: "012-orchestrator"
    recent_action: "Filled the closing record"
    next_safe_action: "Top orchestrator decides the design guard fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-folder-architecture"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-folder-architecture |
| **Completed** | Not yet, held on AC-007 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `.skilled` tree now holds one fewer one-file folder and three READMEs that say what belongs in the folders around them. Nothing behaves differently: every gate prints the same numbers it printed before the change. The one move that landed is the osascript stub, which left a folder of its own to sit beside the fixtures it serves.

### Phase 12: folder-architecture

The phase measured the tree before it touched anything. The skill held 123 one-file folders at BASE. Only one of them could move without breaking something, so the map holds 32 M rows (1 move, 31 keep) and 28 R rows (2 readme, 26 skip). Every keep row names the gate, the routing file, the cargo layout or the input shape that fixes the folder in place.

The move took the stub from `runtime/tests/fixtures/osascript-stub/osascript` to `runtime/tests/fixtures/osascript-stub.sh`. Git reads it as R100, mode 100755 kept, content unchanged. The test that runs it and the fixtures README name the new path. The README work covers what the move map could not: `.skilled/crates/README.md` is new, the crate README now carries a WHAT BELONGS HERE table and a STRUCTURE tree, and the fixtures README names `channels/` and describes its recordings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub.sh` | Moved | The stub left its one-file folder and now sits beside the fixtures it serves, mode 100755 and content unchanged |
| `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts` | Modified | Line 74 names the new stub path |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/README.md` | Modified | Names `channels/` and describes its recordings, so the folder needs no README of its own |
| `.skilled/crates/README.md` | Created | Says what belongs in the crates folder and what does not |
| `.skilled/crates/bots-tui/README.md` | Modified | Adds a WHAT BELONGS HERE table and a STRUCTURE tree naming every subfolder |
| `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/tree-baseline.md` | Created | The tree measure the move map reads |
| `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/gate-baseline.md` | Created | Every gate result at BASE, for the line by line compare |
| `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/move-map.md` | Created | 32 M rows and 28 R rows, each with a verdict and a reason |
| `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/tree-after.md` | Created | The same tree measure at FINAL |
| `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/draft-tree-measure.md` | Deleted | The opener's draft, replaced by the real record |
| `specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/draft-move-map.md` | Deleted | The opener's draft, replaced by the real record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in a fixed order. T001 measured the tree and wrote `tree-baseline.md`. T002 ran every gate at BASE and recorded the numbers in `gate-baseline.md`. T003 wrote the move map from both records. The M016 move landed as its own commit, so the rename and the two reference rewrites could be read on their own. The README workers then ran in parallel, and the final gate rerun was compared line by line with the baseline.

Every task ran on Vibe deepseek-flash workers through the launcher. No cli-pi fallback was needed.

The README rows applied the sk-doc create-readme standard by briefing each worker with its SKILL.md sections, its code-folder template and its validator, because a dispatched worker cannot run the slash command.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One move only | Every other one-file folder is fixed by a gate, a routing file, the cargo layout or the input shape a check reads, so moving it would break something |
| The stub keeps mode 100755 and its content, and the test names the new path | A move that changed the file or its assertion would be a behavior change, which the phase forbids |
| `channels/` is described by its parent README | The document validator exempts fixture trees, so a README inside `channels/` could never print VALID |
| The crate subfolders are described by the crate README's structure tree | One STRUCTURE tree naming every subfolder covers them, so each subfolder is a skip row |
| The design guard is not fixed here | Changing what CI compares is a behavior change, which this phase may not make |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every gate ran at BASE and again at FINAL with the same result.

| Check | Result |
|-------|--------|
| `npm --prefix .skilled/skills/system-skilled-bots/runtime test` | `Test Files 57 passed (57)` and `Tests 794 passed (794)` at BASE and at FINAL |
| `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` | exit 0 at BASE and at FINAL |
| `cargo fmt --check --manifest-path .skilled/crates/bots-tui/Cargo.toml` | exit 0 at BASE and at FINAL |
| `cargo clippy --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings` | exit 0 at BASE and at FINAL |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | exit 0, lib 148, main 0, answer_flow 24, chat 41, cli_client 8, end_to_end 2, panes 51 passed and 1 ignored, pty_smoke 1, render_keys 17, doc-tests 0 |
| Deep-loop executor audit tests | 6 files, 135 passed |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` | `OK: parent-skill-check` with 0 warnings |
| `bash .github/scripts/check-gate-inputs.sh` | files=48 inputs_resolved=356 dynamic_inputs=45 twin_pairs=448 failures=0 and `RESULT: PASSED` |
| Playbook validator | `PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0` |
| `node .skilled/bin/bots.cjs --help` | Output byte-identical at BASE and at FINAL |
| Recursive strict validation on the parent | 16 `RESULT: PASSED` and 0 `RESULT: FAILED` |
| `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on both README rows | `VALID` for `.skilled/crates/README.md` and for `.skilled/crates/bots-tui/README.md` |
| Rename check: `git diff -M --diff-filter=D --name-only 1937abca823 HEAD -- .skilled` | Prints nothing, so no path was deleted rather than moved |
| Old-path search: `rg -n -F` for the old full path and `rg` for the tails `osascript-stub`, `osascript` and `osascript-stub/` | Prints nothing outside `scratch/` |
| Tree measure | 123 one-file folders at BASE and 122 at FINAL. The other 122 rest on keep rows M001 to M015, M017 to M020 and M032 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CI design diff guard fails at BASE and at FINAL.** The step "Keep the shipped design copy equal to the packet copies" in `.github/workflows/bots-runtime.yml`, run by hand, prints "Only in .skilled/crates/bots-tui/design: chat-mockups.md" with exit 1 at both ends, and the two logs are byte-identical. Commit 44216a6ad13 added `design/chat-mockups.md`, a byte-identical copy of the `010-conversations/001-chat-ux-and-pane-map/design/mockups.md` file, and the guard was not taught about it. No move touched `design/`. Fixing the guard changes what CI compares, which this phase may not do, so the top orchestrator picks one of two routes: a named amendment that lets this phase fix the guard, or a supersede record that routes the fix to the deep review.
2. **`bots ui` was not opened on a built crate.** `node .skilled/bin/bots.cjs ui` on this tree refuses with "bots: ui-not-built" because no release binary is built. Opening it needs a terminal, so the pane rendering was not checked by hand.
<!-- /ANCHOR:limitations -->

---

