# First review of the terminal screen children

Fresh Opus high review, read-only, at commit 6b4031c150e. Paths are relative to this phase folder. The operator approves the key map (key-map.md, 001 AC-007) only after these fixes, because approval freezes the contract.

## Operator decisions (2026-11-25)

- Colour and glyph mode: the `bots ui` verb reads NO_COLOR and passes `--mono`, and passes `--ascii` when asked, to the binary. The binary reads no environment variable, so every no-env::var check holds. 003 must stop reading NO_COLOR in the binary, and 002 adds `--mono` and `--ascii` to the verb.
- Grants in the overlay: draw grant kind and rung only when the item carries them, and nothing otherwise, so the screen builds before packet phase 006 and lights up after. spec.md:125 ("reads no grants") becomes "reads grants when present".
- After this fix pass, one more fresh review, then commit.

## P0
- U1-P0-1 `1` still means approve once: parent REQ-010 (spec.md:178) wants the inbox footer to show `1-9 y n Esc` and the overlay `1`; 005 REQ-013 (005/spec.md:149) and AC-003, AC-005 (005/acceptance-criteria.md:59,61) assert `1 approve once`, against key-map.md:54-56 and section 3.1. REQ-013 also says deny first but lists approve first. Fix: amend REQ-010, REQ-013, AC-003, AC-005 to the key map, deny first.
- U1-P0-2 NO_COLOR route conflict (001/spec.md:249-250 and glyph-table section 5 versus 003/spec.md:146,181,209, with the no-env::var checks in 002 tasks.md:245, 005 tasks.md:169, 006 tasks.md:216). Fix per the decision above; 002 spec.md:182 adds the two flags.
- U1-P0-3 006 REQ-004 and its goal require `rg 'GNU GENERAL PUBLIC LICENSE|GPL-3' crates/bots-tui` to match nothing while REQ-006 and REQ-011 (006/spec.md:143,153) require README and design/ to name GPL-3.0. Fix: the grep targets code only (crates/bots-tui/src and Cargo files) and searches for the licence header text, not the name.

## P1
- U1-P1-1 Inventory row 8 and every overlay frame draw grant kind and rung from packet phase 006: apply the "only when present" decision in component-inventory.md, mockups.md and the 005 specs, with a frame for both cases.
- U1-P1-2 004 edits src/view.rs (004/spec.md:131,242, T013) while 003 creates src/view/mod.rs (003/spec.md:113). Fix: one view root, src/view/mod.rs, everywhere.
- U1-P1-3 003 AC-004 asserts `stale 2m` but stale_label comes from 004 (004/spec.md:243, CHK-042), and 004 CHK-050 forbids editing header.rs. Fix: 003 owns stale_label and the header, 004 uses it.
- U1-P1-4 005 T001 (005/tasks.md:60) expects --scope and inbox --json to be missing, but packet phase 001 adds both first. Fix: re-baseline on the packet 001 surface.
- U1-P1-5 No task copies design/ into the crate (001/spec.md:194,248 say 002 does), and 006 T018 passes on a missing folder because sed -n past the end exits 0. Fix: 002 gets the copy task, 006 T018 checks the files exist.
- U1-P1-6 Free text cannot start with y or n (key-map.md:54,55,57 despite :65). Fix: a drawn key enters text mode (for example `t` or Enter on the text row), and y and n are shortcuts only outside text mode.
- U1-P1-7 Mockups: the 80x24 idle, sending, refused and gone overlay frames are byte-identical (mockups.md:836,912,988,1064); both sizes draw `y approve once · n deny` while sending, gone and typing; the expired row uses the working glyph `·` (:160,189) against glyph-table section 4; inbox footers omit Ctrl+P and ?. Fix all.
- U1-P1-8 The inventory says its state lists are closed but gives Inbox and Routines no loading or error state, and 004 asks for 32 snapshots (004/plan.md:88) of states with no frame. Fix: add the states and frames, or cut the snapshot count to drawn frames.
- U1-P1-9 `Resize terminal · Ctrl+D exits` is openhuman's exact string (render.rs:32) and 003 T009 greps for it, breaking 001 REQ-006 (no copied text). Write our own wording. Rename theme::safe_text, whose name and behaviour mirror openhuman theme.rs:88, to our own name.
- U1-P1-10 Tasks in two children: the glyph table (003 theme.rs and 004 panes.rs), the sanitizer (003 replaces controls with `?` in AC-012, 004 strips them in REQ-021), the chat line (003 T007 and 004 T009). Fix: one owner each (003 owns theme, glyphs and the sanitizer, one behaviour; 004 owns the chat line).
- U1-P1-11 003 tests strings the design never draws: `Ctrl+P help` (AC-003), `bots 3` and `status failed` (AC-004). Fix: test the strings the mockups draw, or add them to the mockups.

## P2
- U1-P2-1 After a refresh selection moves to the nearest row (key-map.md:91) or clears (004 REQ-022): pick nearest row everywhere.
- U1-P2-2 001/decision-record.md exists, but spec.md:196, key-map.md:120 and AC:149 say it does not: fix the claims.
- U1-P2-3 Count drift: the key table has 24 rows but AC-003, the plan and the goal say 23; SC-002 expects 18 frames per size and there are 17. Align with the files.
- U1-P2-4 The legacy .opencode/bin symlink check (legacy T019) and the signal-restore task were dropped: restore them in 006 and 002.
- U1-P2-5 006 reuses the parent's REQ ids with other meanings (its REQ-002 is clippy): give 006 its own ids or match the parent wording.
- U1-P2-6 Goals: the parent log says "Child goals authored: Pending" and 004 cites six findings that now read 0; the parent criteria leave out 001's key-map approval and run --strict without --recursive. Fix the logs and criteria.
- U1-P2-7 dtolnay/rust-toolchain@stable is not pinned: pin a toolchain version.
