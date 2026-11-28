# Third review of the terminal screen plan, after the integration wave

**Verdict: not ready for a one-shot build.** Eight P0 findings would stop an unattended build at a gate, eleven P1 findings leave a choice to the builder, and every one has an exact fix below.

This review is fresh and read-only, apart from this file. It ran on 2026-11-25 and 2026-11-26 against the worktree at commit `0ae1643b60a`. The later commit `79519553b62` changes no file in this phase, `.skilled/bin/bots.cjs` or `.github/`, as `git diff --stat 0ae1643b60a HEAD` over those paths shows. The integration wave itself is commit `cf6bb92a5ce`, so "the old file" below means `cf6bb92a5ce^`. Paths are relative to this phase folder unless they start with `specs/`, `.skilled/` or `.github/`. Line numbers are the current lines.

Counts: P0 8, P1 11, P2 22.

How each claim was checked: every doc named in the brief was read in full or in the sections cited. Each frame was measured with a script. Each check in section 5 was run, and its output and exit status were read. A finding marked **judgment** is my reading, not something a command showed.

---

## 1. P0: blocks a one-shot build

### P0-1. The stale frames 7, 11 and 15 are not drawn from the data set, and no single rule draws all three

- **Where:** `001-ux-and-component-map/design/mockups.md` frame 7 at lines 547 to 563 and 576 to 608, frame 11 at lines 851 to 867 and 880 to 912, frame 15 at lines 1155 to 1171 and 1184 to 1216.
- **What is wrong:** frame 7 draws three rows from the old data set (`hello` needs_you, `nightly-report` working, `hello` done). It drops `digest` from Needs you and the Scheduled, Stopped, Failed and Recurring groups that `design/payloads/activity.json` carries. It draws no `›` on any row, while frames 11 and 15 draw `›` on their stale rows, and `architecture.md` line 95 says a non-empty list always has a selection. At 120x40 all three stale frames draw an empty right column with no `Detail` title, while frames 1, 2 and 3 draw the detail of the same selected rows. Frame 15 draws `streak 0` for `nightly-report` at lines 1163 and 1192, where `routines.json` carries `failureStreak: 1` and frame 3 draws `streak 1`. Frame 11 drops frame 2's `Expired items stay listed and cannot be answered.` line. `component-inventory.md` line 54 defines stale as "The rows, unchanged". `004-panes/tasks.md` T014 (line 64) compares each of these frames cell for cell, so the gate fails or the builder invents a stale rule per pane. Frame 7 also cannot fit its own note: the full data set fills all 15 list lines at 80x24.
- **Fix:** make each stale body the rows body of the same pane, with only the title changed, and state that rule once.
  1. In `mockups.md`, replace lines 547 to 563 with a copy of lines 91 to 107, then change the new line 547 from `Activity · 7 groups · 8 rows` to `Activity · stale 2m`.
  2. Replace lines 576 to 608 with a copy of lines 120 to 152. In the new line 576 replace `Activity · 7 groups · 8 rows` with `Activity · stale 2m` followed by nine more spaces, so `│Detail` stays at column 73.
  3. Replace lines 851 to 867 with a copy of lines 167 to 183, then change the new line 851 from `Inbox · 2 open · 1 expired` to `Inbox · stale 2m`.
  4. Replace lines 880 to 912 with a copy of lines 196 to 228. In the new line 880 replace `Inbox · 2 open · 1 expired` with `Inbox · stale 2m` followed by ten more spaces.
  5. Replace lines 1155 to 1171 with a copy of lines 243 to 259, then change the new line 1155 from `Routines · 2 routines` to `Routines · stale 2m`.
  6. Replace lines 1184 to 1216 with a copy of lines 272 to 304. In the new line 1184 replace `Routines · 2 routines` with `Routines · stale 2m` followed by two more spaces.
  7. In `component-inventory.md` line 54, replace the third cell with: `` The `rows` drawing unchanged, the selection and the detail column included, with the pane title reading `<Pane> · stale <n>m` in place of its counts, and the stderr line in the status row ``.
- **After the fix:** a scratch copy with this fix and the P0-2 fix applied keeps 2139 lines, so no citation moves, the AC-002 block prints `frames=53 bad=0`, the P0-2 check prints `panels-misaligned=0`, and the `│Detail` divider of the three 120x40 stale frames stays at column 73. Each copied range has the same length as its target and sits between the same rule line and the same status line. The note line `Rows from the last successful read stay on screen.` leaves the frames, because no requirement names it and frame 7 has no room for it.

### P0-2. The overlay and palette panels at 80x24 move their right border to column 80 on some lines

- **Where:** `mockups.md` line 1769 (frame 23), lines 1840 to 1845 (frame 24) and lines 1920 to 1923 (frame 25). Each is 80 characters long, while every other line of the same panel is 79 and `architecture.md` line 632 puts the panel at columns 2 to 79.
- **Why it blocks:** `005-answer-flow/tasks.md` T013 (line 75) loads the overlay frames through `tests/common/frames.rs` and compares every cell, so frames 23 and 24 fail on any renderer that draws one panel. Frame 25 is not loaded by a gate (003 types its shell blocks by hand), but a builder copying it inherits the shift. The AC-002 block passes because it checks only the widest line.
- **Fix:** on each of the eleven lines, delete one space immediately before the final `│`, so the line is 79 characters long. Then add this command to the AC-002 block in `001-ux-and-component-map/acceptance-criteria.md` after line 91, and change the AC-002 row's Verification cell to `` AC-002 block prints `frames=53 bad=0` then `panels-misaligned=0` ``:

  ````bash
  python3 - "$D/mockups.md" <<'PY'
  import re, sys
  text = open(sys.argv[1], encoding="utf-8").read()
  bad = 0
  for block in re.findall(r"```text\n(.*?)```", text, re.S):
      widths = {len(l) for l in block.split("\n") if re.match(r"^ *[┌│└]", l) and re.search(r"[┐│┘]$", l)}
      if len(widths) > 1:
          bad += 1
  print(f"panels-misaligned={bad}")
  PY
  ````

  Paste it without the two leading spaces of this list indent, so the heredoc's closing `PY` starts its line. It can sit inside the existing three-backtick `bash` fence of AC-002, because no line of it starts with backticks, the same way the AC-002 one-liner already carries backticks mid-line. It counts the text blocks whose bordered lines are not all one width.

  Run here it prints `panels-misaligned=3`, and it prints `panels-misaligned=0` once the eleven lines are fixed.

### P0-3. The frozen key types cannot draw frame 20's footer

- **Where:** `002-architecture-and-contracts/design/architecture.md` line 218 (`When`) and line 264 (`Cond`).
- **What is wrong:** the footer draws "a context's rows whose conditions hold". `n deny` carries `[NotTyping, NotGone]` and `y approve once` carries `[NoOptions, NotTyping, NotGone]`. In the `Sending` phase both conditions hold, so the footer draws `t type · n deny · y approve once · Esc close`. Frame 20 (lines 1554 and 1599) draws `Esc close` alone. `Cond` has no `sending` fact, and line 16 forbids a child from adding a variant, so 005 must stop and amend the architecture.
- **Fix:**
  1. Line 218 becomes: `pub enum When { InboxTab, NoOptions, Options, NotTyping, Typing, NotGone, NotSending }   // one condition a row needs beyond its context`
  2. In line 264 replace `` `Cond` is a plain struct of the facts a `When` reads: `inbox_tab: bool`, `has_options: bool`, `typing: bool`, `gone: bool`. `` with `` `Cond` is a plain struct of the facts a `When` reads: `inbox_tab: bool`, `has_options: bool`, `typing: bool`, `gone: bool`, `sending: bool`. ``
  3. In the same line replace ``so `y approve once` carries `[NoOptions, NotTyping, NotGone]` and frame 22, the `Gone` phase, draws only `Esc close` and the line 2 keys`` with ``so `t type` and `y approve once` carry `[NoOptions, NotTyping, NotGone, NotSending]`, `n deny` carries `[NotTyping, NotGone, NotSending]` and `1-9 pick` carries `[Options, NotGone, NotSending]`, and frames 20 and 22 draw only `Esc close` and the line 2 keys``

### P0-4. Two 002 gates cannot both pass, because the stub `/bin/true` fails the new contract check

- **Where:** `002-architecture-and-contracts/tasks.md` T026 (line 86) and the Wave 8 verify (line 173), against REQ-001 (`002-architecture-and-contracts/spec.md` line 187) and T019 (line 69).
- **What is wrong:** REQ-001 has the verb run `bots-ui --version` before exec and refuse `ui-contract-mismatch` when the number differs. T019 proves that refusal with a stub named by `BOTS_UI_BIN`, so the check runs under `BOTS_UI_BIN`. T026 then expects `BOTS_UI_BIN=/bin/true $BOTS ui --repo .` to exit 0 and `/bin/false` to exit 1. `/bin/true --version` prints no contract number, so the verb refuses with exit 4. No verb satisfies both tasks. The same applies to `acceptance-criteria.md` AC-001, whose stub "records its argv and exits 7" but is not told to answer `--version`.
- **Fix:**
  1. In T026 replace `` `BOTS_UI_BIN=/bin/true $BOTS ui --repo .` exits 0, and `BOTS_UI_BIN=/bin/false $BOTS ui --repo .` exits 1. The `ui-contract-mismatch` refusal is proven by T019's vitest case, because it needs a stub whose `--version` names another contract number. `` with `` The exit passthrough and the `ui-contract-mismatch` refusal are proven by T019's vitest cases, whose stub answers `--version` with the verb's own contract number before it records its argv and exits 7. ``
  2. In the Wave 8 verify, replace `` the three refusals exit 4 and the `BOTS_UI_BIN` passthrough exits 0 and 1 `` with `` the two refusals exit 4 and `npx vitest run tests/cli-ui.vitest.ts` prints no `failed` ``.
  3. In AC-001's Verification cell replace `the stub records its argv and exits 7` with `` the stub answers `--version` with the verb's own contract number, then records its argv and exits 7 ``.

### P0-5. Three verify commands use `\|` outside a table, which ripgrep reads as a literal pipe, so they never match

- **Where:** `002-architecture-and-contracts/tasks.md` T020 (line 70) `rg -n 'runs-on\|timeout-minutes\|actions/cache' ...`, `006-hardening-and-proof/plan.md` line 205 `rg -c '^\| .*\| (002\|003\|004\|005): ' ...` (expects 8), and `003-shell-and-navigation/plan.md` line 87 `rg -n 'Label::new\|label:' ...`.
- **Evidence:** on a two-line file holding `runs-on: x` and `timeout-minutes: 5`, the `\|` form printed nothing and exited 1, and the `|` form printed both lines and exited 0. The 006 plan form printed nothing with exit 1 against `spec.md`, while 006 `tasks.md` T004's `|` form printed `8`.
- **Second fault in T020:** `.github/workflows/bots-runtime.yml` already holds `runs-on: macos-latest` (line 79) and `timeout-minutes: 20` (line 82) in the `bots-runtime` job, so even a corrected whole-file grep passes before the `bots-tui` job exists.
- **Fix:**
  1. In T020 replace `` `rg -n 'runs-on\|timeout-minutes\|actions/cache' .github/workflows/bots-runtime.yml` prints the runner, the timeout and the cache `` with `` `awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'runs-on|timeout-minutes|actions/cache'` prints 3, which holds because the `bots-tui` job is appended as the file's last job ``. Make the same change in `002-architecture-and-contracts/acceptance-criteria.md` AC-009, writing the pipe characters as `\|` there because the command sits in a table cell.
  2. In `006-hardening-and-proof/plan.md` line 205 replace `(002\|003\|004\|005)` with `(002|003|004|005)`.
  3. In `003-shell-and-navigation/plan.md` line 87 replace `'Label::new\|label:'` with `'label:'`, because `architecture.md` section 1.9 names the field `label` and no `Label` type exists.

### P0-6. 006's design-folder gate expects four files, and 002 now ships six

- **Where:** `006-hardening-and-proof/tasks.md` T018 (line 118), `006-hardening-and-proof/acceptance-criteria.md` AC-011 (line 65), `006-hardening-and-proof/plan.md` lines 44 and 231, `006-hardening-and-proof/spec.md` REQ-020 (line 154).
- **What is wrong:** T018 says its block "prints the four names ... and nothing else on stdout". 002 T028 and the owner map (`architecture.md` line 465) copy `architecture.md` and `contracts.md` into `.skilled/crates/bots-tui/design/` as well, so `ls $CRATE/design` prints six names and T018 fails.
- **Fix:** in all five places replace the list `` `component-inventory.md`, `glyph-table.md`, `key-map.md` and `mockups.md` `` with `` `architecture.md`, `component-inventory.md`, `contracts.md`, `glyph-table.md`, `key-map.md` and `mockups.md` ``, replace "the four names" and "the four documents" with "the six names" and "the six documents", and in REQ-020 replace the clause that starts `holds the four documents` and runs through the second dash with `` holds the four documents 001 authored, `mockups.md`, `key-map.md`, `glyph-table.md` and `component-inventory.md`, plus 002's `architecture.md` and `contracts.md`, ``. That also removes the two long dashes in that row.

### P0-7. Defect check D1 greps for a key form the architecture does not use

- **Where:** `006-hardening-and-proof/tasks.md` line 148, D1: `rg -c "Char\('1'\)" $CRATE/src/keys.rs`, expecting "a digit binding in the `Overlay` context".
- **What is wrong:** `architecture.md` line 216 binds the digits with one `KeyMatch::Digit` row, and line 262 says that row holds `Pick(0)` and `resolve` returns the pressed digit. A keys.rs that follows the architecture holds no `Char('1')`, so D1 prints 0 and fails. Passing it means writing nine `Exact` rows against the frozen design.
- **Fix:** D1's Check cell becomes `` `rg -n 'enum Context' $CRATE/src/keys.rs` and `rg -n 'KeyMatch::Digit' $CRATE/src/keys.rs` ``, and its Expected cell becomes `` the context enum, and one `KeyMatch::Digit` row, inside `OVERLAY_ROWS` ``.

### P0-8. 002's client test expects an answer argv with no `--repo`

- **Where:** `002-architecture-and-contracts/tasks.md` T011 (line 61).
- **What is wrong:** T011 says the argv log carries `answer --scope once -- <id> hold` and `answer --scope deny -- <id> deny`. `cli.rs` passes `--repo <repo>` on every call (REQ-003 at `002-architecture-and-contracts/spec.md` line 189, `state-machines.md` section 4.1), so the recorded line is `answer --scope once --repo <repo> -- <id> hold` and the expectation never matches.
- **Fix:** replace `` `answer --scope once -- <id> hold` and `answer --scope deny -- <id> deny` `` with `` `answer --scope once --repo <repo> -- <id> hold` and `answer --scope deny --repo <repo> -- <id> deny` ``.

---

## 2. P1: a builder would have to decide

### P1-1. Does the screen wait for an answer in flight when it quits?

- **Conflict:** `architecture.md` section 2.5 (lines 405 to 414) and its decision row at line 675 join the worker and wait up to 30 seconds, drawing `bots-ui: waiting for the answer in flight`. `state-machines.md` OPEN 2 (line 103) and decision row 319, and `005-answer-flow/spec.md` REQ-015 (line 152), quit at once and leave the child running. The rulings give the answer flow to `state-machines.md` and threads to `architecture.md`, so neither wins by rule.
- **Recommended fix (state-machines.md's side, because the runtime writes the item before it prints, confirmed at `.skilled/bin/bots.cjs:292-301`):**
  1. `architecture.md` line 410 becomes: `2. Draws nothing more. An answer child already running is not waited for.`
  2. Line 411 becomes: `` 3. Joins the worker. The worker kills a running read, drops every queued read, starts a queued answer if one waits, and returns without waiting for any answer child, because `bots answer` writes the item before it prints and the write completes after the screen exits. `cli.rs` starts the answer child in its own process group, so a hangup sent to the screen does not reach it. ``.
  3. Line 414 becomes: `So Ctrl+D, Ctrl+C, a closed input and a signal never wait for an answer and never write a new one.`
  4. Line 675 becomes: `` | Quit never waits for an answer child and never kills one | `bots answer` writes the item before it prints, so the write completes after the screen exits, and a kill could cut it | ``
- The process-group sentence is **judgment**: it rests on how a terminal hangup is delivered to the foreground group, not on a file here.

### P1-2. The screen's own status lines have two prefixes and two texts

- **Conflict:** `state-machines.md` line 329 says every screen-side line starts `bots-ui:`. `contracts.md` lines 660, 685 and 687 write screen-side lines starting `bots:`. The read timeout is `bots-ui: <verb> timed out after 10s` at `architecture.md` line 396 and `bots: <verb> --json timed out after <n>s` at `contracts.md` line 687. The answer timeout is `bots-ui: answer timed out after 30s, it may have landed` at `architecture.md` line 396 and `bots-ui: answer timed out and was stopped, it may have been recorded` at `state-machines.md` line 303. The frames draw `bots: <verb> --json exited 1: index locked`, which wraps runtime text.
- **Fix:**
  1. `state-machines.md` line 329 becomes: `` | A line that wraps the runtime's own stderr starts `bots: <verb> --json exited <code>:`, and every other line the screen writes starts `bots-ui:` | The operator must tell a line the screen wrote from one the runtime wrote, and frames 8, 12 and 16 draw the wrapped form | ``
  2. `contracts.md` line 660: replace `` `bots: <verb> --json speaks version <n>, the screen reads version 1` `` with `` `bots-ui: <verb> --json speaks version <n>, the screen reads version 1` ``.
  3. `contracts.md` line 685: replace `` `bots: <verb> --json printed no payload: <parser message>` `` with `` `bots-ui: <verb> --json printed no payload: <parser message>` ``.
  4. `contracts.md` line 687: replace `` `bots: <verb> --json timed out after <n>s` `` with `` `bots-ui: <verb> timed out after 10s` ``.
  5. `state-machines.md` line 303: replace `` `bots-ui: answer timed out and was stopped, it may have been recorded` `` with `` `bots-ui: answer timed out after 30s, it may have landed` ``.

### P1-3. The contract number has no value, no format and no Rust owner

- **Where:** parent `spec.md` section 3A (line 189), `002-architecture-and-contracts/spec.md` REQ-001 (line 187) says `bots-ui --version` prints "the contract number `design/contracts.md` fixes". `contracts.md` fixes no contract number, only the payload `version` (section 8). `architecture.md` line 293 gives `Args` no version flag. No 002 task writes or tests `--version` in the binary, and 003 AC-010 and AC-011 cite `--lib args` tests (`mono_flag_selects_mono`, `ascii_flag_selects_the_ascii_glyphs`) "which 002 owns" that no 002 task names.
- **Fix:**
  1. `architecture.md` line 293 becomes: `pub struct Args { pub repo: PathBuf, pub skilled_tree: PathBuf, pub mono: bool, pub ascii: bool, pub version: bool }   // parsed from argv by lib.rs`, and add after it: `pub const CONTRACT: u32 = 1           // the payload contract major this binary reads, contracts.md section 8`
  2. Add after line 291: `` // with --version, run prints `bots-ui <crate version> contract <CONTRACT>` to stdout and returns 0 before the guard is installed ``
  3. `contracts.md` section 8, add a first bullet: `` - The binary's contract number is this major. `bots-ui --version` prints `bots-ui <crate version> contract 1`, and the `ui` verb compares the last field with its own copy of the number. ``
  4. `002-architecture-and-contracts/spec.md` REQ-001: replace `` the contract number `design/contracts.md` fixes `` with `` the contract number, as `bots-ui <crate version> contract <n>`, which is the payload major `design/contracts.md` section 8 fixes ``.
  5. `002-architecture-and-contracts/tasks.md` T017 (line 67), append to Verify: `` `$CRATE/target/release/bots-ui --version` prints one line ending ` contract 1`, and `cargo test --manifest-path $CRATE/Cargo.toml --lib args` names `version_flag_prints_the_contract`, `mono_flag_selects_mono` and `ascii_flag_selects_the_ascii_glyphs`. ``

### P1-4. Nobody draws the answered row of frame 27, and Enter on it has no transition

- **Where:** frame 27 (`mockups.md` lines 1997 to 2071) draws the answered row, a `1 open` title, `state approved` in the detail column and `Enter shows it is no longer open.` `view/panes.rs` is 004's with no modifier (`architecture.md` line 455), yet `004-panes/spec.md` REQ-017 (line 153) names only open and expired rows. No test loads frame 27. `state-machines.md` diagram 1 (lines 33 to 36) opens an open item in `Idle`, so Enter on the answered row would offer a second answer. The word for each answer kind is never mapped.
- **Fix:**
  1. `004-panes/spec.md` REQ-017, append: `` A row whose id has a mark in `state.answered` draws a blank gutter and its outcome word in the state column, dimmed, is not counted in the title's open count, and draws the same word as its `state` in the detail column, as frame 27 does. ``
  2. `state-machines.md`, insert after line 34: `  Closed --> Gone: Enter on an item that carries an outcome word`
  3. `architecture.md` line 361: replace `` `OpenItem` on an expired item opens in `Gone`. `` with `` `OpenItem` on an expired item, or on an item with a mark in `answered`, opens in `Gone`. ``
  4. `architecture.md` line 152, replace the comment with: `` // the word drawn on an answered row: `y` gives `approved`, `n` gives `denied`, a digit or a typed line gives `answered` ``
  5. `005-answer-flow/tasks.md` T012 (line 74): after `compare the buffer with frame 1 cell for cell` insert `` , then a second test that sends Key Alt(2), settles, sends Key Enter and Key `y`, settles, draws and compares the buffer with frame 27 cell for cell ``, and change the Verify to name `scripted_loop_draws_frame_one` and `scripted_answer_draws_frame_27`.

### P1-5. Which rows the palette lists has three answers

- **Conflict:** `architecture.md` line 262 says `palette_entries()` returns the rows of `main`, `inbox` and `list`, one per label. `state-machines.md` line 191 says an overlay row "is listed and does nothing". `003-shell-and-navigation/spec.md` REQ-015 (line 139) and `acceptance-criteria.md` AC-006 (line 60) say the palette "lists every binding".
- **Fix (architecture.md's side, because it defines the function):**
  1. `state-machines.md` line 191: replace `A row bound in another context, such as an overlay row, is listed and does nothing, like an unbound key.` with `` The palette lists the rows of `main`, `inbox` and `list`, one per label, so an overlay row is never listed. A listed row bound in another context, such as `Enter open` when the palette was opened from `main`, does nothing, like an unbound key. ``
  2. 003 REQ-015: replace `which lists every binding in the table with its label` with `` which lists the rows `keys::palette_entries` returns, those of `main`, `inbox` and `list`, one per label ``.
  3. 003 AC-006: replace `Then the palette lists every binding with its label` with `` Then the palette lists the `main`, `inbox` and `list` rows, one per label ``.

### P1-6. The choice overlay draws `1-9 pick` before `n deny`

- **Conflict:** parent REQ-010 (`spec.md` line 207), 003 REQ-010 (line 135), 005 REQ-010 (line 148) and 005 AC-003 have each overlay draw `n deny` before any approve key. Frame 24 draws `1-9 pick · n deny · Esc close` (lines 1858 and 1903). A digit answers with `--scope once`, so whether it counts as an approve key is the builder's call.
- **Fix:** keep deny first everywhere. Lines 1858 and 1903 become `n deny · 1-9 pick · Esc close`. Then one `OVERLAY_ROWS` order (`t`, `n`, the digit row, `y`, the typing rows, `Esc`) draws frames 18, 19, 21 and 24 as drawn.

### P1-7. No 002 task writes `keys.rs`'s types and `resolve`

- **Where:** the owner map (`architecture.md` line 451) gives 002 every type in section 1.9, `resolve`, `palette_entries` and the three empty slices. `002-architecture-and-contracts/tasks.md` T006 (line 49) writes "one stub file per module", and T012 (Wave 4) holds `state.rs`, whose `on_key` calls `keys::resolve`. No task holds `keys.rs` after T006.
- **Fix:** append to T006: `` `keys.rs` is complete except its rows: every type in `design/architecture.md` section 1.9, `rows`, `resolve` and `palette_entries`, with `SHELL_ROWS`, `LIST_ROWS` and `OVERLAY_ROWS` empty. `` Append to its Verify: `` `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` names `resolve_walks_the_context_stack` and `digit_row_returns_the_pressed_digit`. ``

### P1-8. No 003 task writes the tab arms, and the palette task names a filter function in the view

- **Where:** `003-shell-and-navigation/spec.md` line 98 gives `on_shell_action` the tab, palette and quit arms. T004 tests only what `keys.rs` returns, and T010 (line 60) writes only the palette arms. Wave 4 (line 117) holds `view/mod.rs` and `keys.rs` but not `state.rs`, which T010 edits. T010's `rg -n 'fn filter' $CRATE/src/view/mod.rs` puts filter logic in the view, while `architecture.md` line 125 and line 484 keep palette state in the reducer and let `view/mod.rs` only draw it.
- **Fix:**
  1. T010 opens with: `` Write `on_shell_action`: the `SelectTab`, `PrevTab` and `NextTab` arms, each calling `refresh`, then the palette's filter, its Up and Down selection, Enter and Esc, ... `` (the rest of the sentence unchanged).
  2. In T010's Verify, delete `` `rg -n 'fn filter' $CRATE/src/view/mod.rs` prints one line, `` and add `` `cargo test --manifest-path $CRATE/Cargo.toml --lib state` names `select_tab_switches_and_refreshes` ``.
  3. Wave 4's Files held cell becomes `` `$CRATE/src/state.rs` (`on_shell_action`), `$CRATE/src/view/mod.rs`, `$CRATE/src/keys.rs` ``, and drop `rg -n 'fn filter' $CRATE/src/view/mod.rs` prints one line from that wave's Verify.

### P1-9. The 005 to 006 handoff requires a file 006 writes

- **Where:** parent `spec.md` line 284 requires "the scripted pseudo-terminal run answers one item" and `cargo test --test pty_smoke` at the 005 exit. The owner map (`architecture.md` line 464) and `006-hardening-and-proof/tasks.md` T021 put `tests/pty_smoke.rs` in 006.
- **Fix:** line 284's Criteria cell becomes `The argv log matches, and Esc and closed input write nothing` and its Verification cell becomes `` `cargo test --test answer_flow` and `cargo test --test end_to_end` pass ``. Line 285's Verification cell gains a leading clause: `` `cargo test --test pty_smoke` prints `1 passed`, ``.

### P1-10. The fixture's scenario names are not fixed

- **Where:** `002-architecture-and-contracts/spec.md` REQ-008 (line 194) lists six scenario kinds and names none, except `empty` and `ok`, which tasks use. 005 needs two different refusals (`answer-not-approver` for frame 21, `item-answered-differently` for AC-014), and 004 and 005 need one verb to fail while the others succeed.
- **Fix:** append to REQ-008: `` The scenario names are `ok`, the default, `empty`, `fail-<verb>`, where that verb exits 1 with `bots: index locked` and every other verb answers as `ok`, `refuse-<reason>`, where `answer` exits 4 with `bots: <reason>`, `slow`, where every call sleeps 2 seconds first so a test with a 1 second `read_timeout` sees the kill, and `warn`, where `inbox` exits 0 and writes `bots: item <id> did not read` to stderr. ``

### P1-11. Where a refusal becomes "gone" is stated two ways, and the owner pointer is wrong

- **Conflict:** `state-machines.md` line 283 and decision row 325, and `005-answer-flow/spec.md` REQ-016 (line 153), have `cli.rs` return a class (`done`, `gone` or `refused`). `architecture.md` line 189 gives `AnswerError` only `refusal: Option<String>`, and line 353 has the reducer class "a refusal `contracts.md` classes as gone". `contracts.md` section 11 says `state-machines.md` section 4 owns the table, while parent `spec.md` line 176 gives "the refusal classes" to `contracts.md`. Line 353 also omits the rule, kept at line 363 for timeouts only and drawn for every refusal in `state-machines.md` line 53, that a non-gone refusal goes to `Gone` when the latest rows no longer list the item open.
- **Fix (keep the frozen type, class in the reducer):**
  1. `state-machines.md` line 283: replace `` `cli.rs` reads the reason token on the worker and returns one of three classes, `done`, `gone` or `refused`, with the first stderr line, so the loop never parses a message. A reason it does not know is `refused`. `` with `` `cli.rs` reads the reason token on the worker and returns it as `AnswerError.refusal` with the first stderr line, so the loop never parses a message. `overlay_on_answered` classes `item-unknown`, `item-expired` and `item-answered-differently` as gone and every other refusal, an unknown one included, as refused. ``
  2. Line 325 becomes: `` | `cli.rs` extracts the reason token on the worker, and the reducer classes it | The loop stays free of message parsing, which the plan's Data Flow promises. | ``
  3. 005 REQ-016: replace `` `cli.rs` maps the reason to that class on the worker, so the loop never parses a message. `` with `` `cli.rs` extracts the reason name on the worker and the reducer classes it, so the loop never parses a message. ``
  4. `architecture.md` line 353, third cell: `` Moves a `Sending` overlay for that id to closed on success, to `Gone` on a refusal `005-answer-flow/design/state-machines.md` section 4.2 classes as gone, or on any other refusal or a timeout when the latest inbox rows no longer list the item open, else to `Refused` ``
  5. Parent `spec.md` line 176, second cell: `The payload keys, the field tables and the refresh-on-read rule`. Line 177, second cell: `The overlay machine, the answer sequence, the answer argv, the refusal classes and the key contexts`.

---

## 3. P2: polish

- **P2-1. Citations into `mockups.md`.** Every live citation is in section 4 with its corrected line.
- **P2-2. Citations into the parent `spec.md`.** Section 3A and the Design Notes table moved the requirement, decision and defect tables by about 29 lines, and every child citation past line 168 now lands on the wrong row. The table in section 4 lists each one.
- **P2-3. Citations into `key-map.md` and `component-inventory.md`.** Nine pointers are off by one to four lines. Section 4 lists them.
- **P2-4. The applied edit lists read as pending.** `architecture.md` section 6, `contracts.md` sections 13.3 to 13.6, `state-machines.md` section 6 and `research/context-manifest.md` section 5 still list edits that commit `cf6bb92a5ce` applied, at their pre-edit lines. Add under each section heading: `The edits inside this phase were applied in commit cf6bb92a5ce. Line numbers are the pre-edit lines and are kept as a record.` Under `contracts.md` section 13, add a second sentence: `Sections 13.1 and 13.2 target packet phases 001-activity-and-actor and 002-routine-layer and are not applied yet.`
- **P2-5. Signal and generation text the wave missed.** `002-architecture-and-contracts/spec.md` line 133 ("from a signal handler"), line 239 ("a SIGTERM and SIGHUP handler that runs the same restore"), line 241 ("the loop drops a result that is not current") and `002-architecture-and-contracts/plan.md` line 69 ("installs a SIGTERM and SIGHUP handler that runs the same restore") contradict REQ-005 and REQ-006. Replace the line 133 clause with `and a SIGTERM, SIGHUP and SIGINT handler that only sets a flag`, the line 239 mitigation with `The handler only sets a flag, the event source turns it into a Terminate message, and the guard's Drop restores, proven by signal_becomes_terminate_event`, the line 241 mitigation with `Every read carries its surface's generation and the reducer drops one older than the newest issued`, and the plan:69 clause with the line 133 wording.
- **P2-6. The 16 ms edge case.** `002-architecture-and-contracts/spec.md` line 268: replace `and the frame still draws in under 16 ms` with `and the draw visits at most the body height's rows, as 004 REQ-025 proves`.
- **P2-7. Nothing proves the CI job runs the design diff (R17).** REQ-009 (line 195) says "the two `diff` checks" while SC-006 has seven, and AC-016 omits the four payload diffs. Append to T020's Verify: `` `awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'diff '` prints at least 2 ``. In REQ-009 replace `` the two `diff` checks `` with `` the `diff` checks SC-006 names ``. Append the payload clause of SC-006 to AC-016's Verification cell.
- **P2-8. Stale dependency text in 005.** `005-answer-flow/spec.md` line 46: replace `This child extends all six and creates none of them.` with `` This child extends `state.rs` and `keys.rs` in the sections the owner map gives it and reads the other four. `` Line 47 and `005-answer-flow/plan.md` line 230: replace `` the `Option<ItemId>` selection `` and `` 004's `Option<ItemId>` selection `` with `` the `PaneView<ItemId>` selection `` and `` 004's `PaneView<ItemId>` selection ``.
- **P2-9. Argv forms without `--repo`, and a check that writes.** `005-answer-flow/spec.md` line 227: replace `` `bots answer --scope once -- <item-id> <text>` `` with `` `bots answer --scope once --repo <repo> -- <item-id> <text>` ``. `002-architecture-and-contracts/plan.md` line 95 and `005-answer-flow/plan.md` line 83 verify with `node .skilled/bin/bots.cjs answer --scope deny -- <id> deny`, which answers a live item. Replace each with `` `rg -n "scope" .skilled/bin/bots.cjs` prints the `answer` verb's `--scope` option ``.
- **P2-10. Design-file wording the wave missed.** `key-map.md` line 26, third cell: `Tabs, list movement, open, palette, quit`. Line 106: replace `a selection held as an item id` with `a selection held as the pane's row key`. `component-inventory.md` line 25: replace `` `stale`, `builtAt` `` with `` `stale`, `updatedAt` or `builtAt` when it is absent `` and the Frames cell `1, 7, 17` with `1, 17`, because frame 7 no longer draws the header flag. Line 52: replace `No rows, no error, no read in flight` with `A successful read with no rows, and no error`, because `architecture.md` line 76 says `in_flight` never changes the state. Line 72: replace `Selection is an item id, never a row index` with `Selection is the pane's row key, never a row index`.
- **P2-11. Two 003 requirements disagree with the architecture.** REQ-014 (line 138): replace `A later success clears it.` with `A later clean call from the same source clears it, so a clean read never wipes an answer refusal.` REQ-017 (line 141): replace `Ctrl+C quits when no overlay is open` with `Ctrl+C quits when neither an overlay nor the palette is open`.
- **P2-12. Names that drift from section 1.** `003-shell-and-navigation/acceptance-criteria.md` AC-002 and `004-panes/plan.md` line 87 say `keys::TABLE`, which does not exist. Use `keys::rows()`. `architecture.md` line 451 says `ROWS`. Use `rows`. Lines 244 and 258 say `PaletteDelete` has no key-map row yet, but `key-map.md` line 65 carries it. Delete `, a row the key map still has to add` and the sentence that starts `` `PaletteDelete` is the one action ``. Line 39: replace `each in two groups` with `in two or three groups each`.
- **P2-13. Defect checks and dashes in 006.** D6 (`tasks.md` line 153) greps `free_text`, a name no doc defines. Make it `rg -n 'Phase::Typing' $CRATE/src/view/overlay.rs`. D2 expects `1 and 1`, but a `#[cfg(test)]` module in `keys.rs` naming `Char('[')` raises the count. Make it `at least 1 each`. `006-hardening-and-proof/spec.md` lines 153 and 207 carry em dashes. Replace each pair with commas.
- **P2-14. Two default texts disagree with their owners.** `decision-record.md` A2 (line 61) says all four read verbs refresh the index, and `contracts.md` section 10 says only `status` and `activity` do. Replace `` Every read verb the screen polls, `status`, `activity`, `inbox` and `routines` with `--json`, brings the status index up to date before it answers. `` with `` `status --json` and `activity --json` bring the status index up to date before they answer, and `inbox` and `routines` read no index. `` Line 68 says the row is drawn "rather than until the next successful read", but `architecture.md` line 342 clears marks only on a successful inbox read. Replace that sentence's end with `so the row is drawn until the next 5 second poll's successful inbox read.`
- **P2-15. An inbox read queued before the answer can drop the row at once.** Rule 3 (`architecture.md` line 395) runs an answer ahead of queued reads. An inbox read a tab switch queued behind a running read then runs after the answer, no longer lists the item, and the row vanishes with its mark unused. Add to `architecture.md` line 160: `` An inbox read that lands after `Answered` and carries the mark's own generation keeps the answered item in `inbox.rows` until the next poll's read. `` **Judgment** on the timing, from rules 1 and 3.
- **P2-16. Stale carriers.** `research/ui-references.md` line 117, row 4: Carrier `` `005-answer-flow` REQ-020 and `001-ux-and-component-map` REQ-011 ``, Status `Carried`. `004-panes/goal.md` line 102: delete `` The parent's file map still lists `src/sanitize.rs` for this child, and its defect table `` through the end of that sentence, because the parent no longer lists it.
- **P2-17. State machine wording.** `state-machines.md` lines 199 and 206 call the UI thread "the loop thread", while `architecture.md` section 2.1, the naming authority, calls it "UI thread". Line 127 says `list` keys are live "only inside `main` or `inbox` when rows exist", but `architecture.md` line 345 stacks `List` on every Activity, Routines and Inbox tab, and frames 5, 6, 9 and 10 draw the list labels with no rows. Replace `` and `list` keys are live only inside `main` or `inbox` when rows exist `` with `` and `list` keys are live on the Activity, Routines and Inbox tabs, with rows or without, and move nothing on an empty list ``.
- **P2-18. Two counts in `mockups.md`.** Line 39: replace `Each frame is exactly 24 or 40 lines` with `Each frame is exactly 24, 40 or 7 lines`. Line 2083: replace `The frame shows 17 rows at 80x24 and 33 at 120x40.` with `The frame shows 15 list lines at 80x24 and 31 at 120x40.`
- **P2-19. A 005 criterion leaves the data set.** `005-answer-flow/acceptance-criteria.md` AC-002 uses options `["ship it", "hold"]`, which no payload carries. Use digest's: replace `` `["ship it", "hold"]` `` with `` `["email", "chat"]` `` and `-- <item-id> hold` with `-- <item-id> chat`.
- **P2-20. Parent file table and phase rows.** `spec.md` line 132: Phase `002`, description `` A copy of 001's four design files plus `architecture.md` and `contracts.md` ``. Line 265 and line 283 say four pane states, and every pane draws five. Replace `loading, empty, error and stale states` with `loading, empty, rows, error and stale states` and `draws its four states` with `draws its five states`.
- **P2-21. The frames' read failures name the index for verbs that never open it.** Frames 11, 12, 15 and 16 draw `index locked` for `inbox` and `routines`, which `contracts.md` section 10 says read no index. The fixture prints what the frames show, so no builder is blocked. Add to `contracts.md` section 9: `` The frames' `index locked` line is the fixture's `fail-<verb>` text for every verb, not a runtime message for `inbox` or `routines`. ``
- **P2-22. Three small check hazards.** The 001 AC-001 and AC-011 blocks print `       4` on macOS, because BSD `wc -l` pads. Append ` | tr -d ' '` to each `wc -l`. Several AC table cells write `\|`, which renders as `|` but fails when copied from the raw file (002 AC-003 and AC-009, 004 AC-001, 006 AC-010, AC-012, C1). The three that expect nothing (002 AC-003, 004 AC-001, 006 AC rows naming `use openhuman`) pass by accident when copied raw. Move them into command blocks as 001 does. The palette panel's height, 8 rows, is drawn in frame 25 and is in no rule. Add to `architecture.md` line 647: `8 rows tall`.

---

## 4. Citations

### 4.1 Into `mockups.md`

Index rows 1 to 26 kept their lines, row 27 was inserted at line 73, lines from the old 73 on moved by +1, and lines after the too-small frame moved by +77 (+1, then 76 lines of frame 27). Inside frames 1 and 17 the body also changed shape. The two reviews (`fable-review-1.md`, `ui-review-2.md`) are records of their own commits and need no change.

| Citing line | Cites | Now points at | Correct line |
|-------------|-------|---------------|--------------|
| `005-answer-flow/design/state-machines.md:28` | `:66` | index row 20, sending | `:65`, row 19, typing. It was already one off before the wave |
| `state-machines.md:309` | `:67` | index row 21 | correct |
| `state-machines.md:413` to `:416` | `1625`, `1628`, `1662`, `1673` | applied edits | applied, now `1626`, `1629`, `1663`, `1674` (P2-4) |
| `state-machines.md:418` | `:1625` | a blank panel line of frame 21 | `:1626`, and replace `Frame 21 today draws` with `Before this edit frame 21 drew` |
| `002-architecture-and-contracts/design/architecture.md:39` | `:92-105` | frame 1 shifted by one, and the cut drops the Recurring row | `:93-107` |
| `architecture.md:123` | `:1686-1701` | frame 22's rule line to a blank panel line | `:1687-1703` |
| `architecture.md:264` | `:1705-1706` | a blank line and `Esc close` | `:1706-1707` |
| `architecture.md:389` | `:2005` | frame 27's pane title | `:2082` |
| `architecture.md:614` | `:23-33` | section 1 | correct |
| `architecture.md:636` | `:1382-1398` | frame 18's rule line to its status line | `:1383-1399` |
| `architecture.md:636` | `:1723-1739` | a blank line to frame 22's status line | `:1724-1740` |
| `architecture.md:636` | `:1918-1925` | a blank line to a blank panel line | `:1919-1926` |
| `architecture.md:636` | `:1955-1962` | a blank line to a blank panel line | `:1956-1963` |
| `architecture.md:636` | `:1399-1402` | the bottom border to line 1 of the footer | `:1400-1403` |
| `architecture.md:796` to `:800` | `78`, `93`, `128-129`, `2007`, `1933` | applied edits | applied, now `79`, `94`, `130-131`, `2084`, `1934` (P2-4) |
| `architecture.md:797` | inline `mockups.md:168` | a blank line | `mockups.md:169` |
| `architecture.md:798` | inline `mockups.md:98-101` | Scheduled to the Done row | `mockups.md:100-103` |
| `002-architecture-and-contracts/design/contracts.md:19` | `:45-72` | stops before row 27 | `:45-73` |
| `contracts.md:48` | `:201-202` | `state open` and the `at` line | `:202-203` |
| `contracts.md:73` | `:124` | the `! digest` row and `│state needs_you` | `:125` |
| `contracts.md:73` | `:201-202` | as above | `:202-203` |
| `contracts.md:326` | `:1303` | the fence line of frame 17 | `:1304` |
| `contracts.md:576` | `:1383` | frame 18's top border | `:1384` |
| `contracts.md:578` | `:1768` | `options  none` | `:1769` |
| `contracts.md:686` | `:624` | a blank line | `:625` |
| `contracts.md:965` | `:183` | a blank line | `:184` |
| `contracts.md:1011` | `:2010` | a blank line in frame 27 | `:2087` |
| `contracts.md:965` to `:1013` | section 13.6 line numbers | applied edits | applied (P2-4) |
| `research/context-manifest.md:652` | `:2016` | a blank line | `:2093`, applied |
| `research/context-manifest.md:658` | `:2032` | frame 27's tab bar | `:2109`, applied |

### 4.2 Into the parent `spec.md`

| Citing line | Cites | Now points at | Correct line |
|-------------|-------|---------------|--------------|
| `001-ux-and-component-map/design/key-map.md:82` | `:214` | a blank line | `:243` |
| `key-map.md:88` | `:215` | a divider | `:244` |
| `key-map.md:106` | `:216` | a blank line | `:245` |
| `key-map.md:154`, `:155`, `:156` | `:176`, `:177`, `:178` | Design Notes rows | `:205`, `:206`, `:207` |
| `001-ux-and-component-map/design/glyph-table.md:42`, `:54`, `:117`, `:118` | `:220` | the section 5 intro | `:249` |
| `001-ux-and-component-map/design/mockups.md:2138` | `:221` | a blank line | `:250` |
| `mockups.md:2139` | `:220` | the section 5 intro | `:249` |
| `001-ux-and-component-map/spec.md:46` | `:195-202` | section 3A | `:224-231` |
| `001-ux-and-component-map/spec.md:64` | `:214-221` | a blank line to section 5 | `:243-250` |
| `001-ux-and-component-map/spec.md:198` | `:251` | the defects anchor | `:280` |
| `003-shell-and-navigation/spec.md:46` | `:234` | a divider | `:281` |
| `003-shell-and-navigation/spec.md:128` | `:176` | a Design Notes row | `:205` |
| `004-panes/spec.md:67` | `:216`, `:218` | a blank line, the section 5 heading | `:245`, `:247` |
| `005-answer-flow/spec.md:65` | `:214` | a blank line | `:248` |
| `005-answer-flow/spec.md:112` | `:265` | phase map row 4 | `:295` |
| `005-answer-flow/spec.md:113` | `:177` | a Design Notes row | `:206` |
| `005-answer-flow/spec.md:116`, `:162` | `:201` | the REQ table header | `:230` |
| `005-answer-flow/spec.md:140` | `:175`, `:177`, `:178`, `:179` | Design Notes rows | `:204`, `:206`, `:207`, `:208` |
| `005-answer-flow/spec.md:258` | `:237` | the section 6 heading | `:250` |
| `005-answer-flow/spec.md:259` | `:266` | phase map row 5 | `:296` |

`003-shell-and-navigation/spec.md:48` (`:126`), `006-hardening-and-proof/spec.md:93` (`:66`) and the two `:241` citations in 006 (the defect table header) still land where they mean to.

### 4.3 Into `key-map.md` and `component-inventory.md`

| Citing line | Cites | Correct line |
|-------------|-------|--------------|
| `architecture.md:95` | `key-map.md:105` | `:106` |
| `architecture.md:258` | `key-map.md:40-69` | `:40-70` |
| `architecture.md:651` | `key-map.md:73` | `:74` |
| `contracts.md:90` | `component-inventory.md:77` | `:79` |
| `contracts.md:94` | `component-inventory.md:70` | `:72` |
| `004-panes/spec.md:158` | `key-map.md:102` | `:106` |
| `state-machines.md:96` | `key-map.md:69` | `:70` |
| `state-machines.md:117` | `key-map.md:97` | `:98` |
| `state-machines.md:191` | `component-inventory.md:72` | `:74` |

---

## 5. Checks run, with their output

Every command ran from the worktree root with no tty.

| Check | Output | Exit | Matches the doc |
|-------|--------|------|-----------------|
| 001 AC-001 block | `4` then `0` (padded by BSD `wc`) | 0 | yes |
| 001 AC-002 block | `frames=53 bad=0` | 0 | yes, but it cannot see P0-2 |
| 001 AC-003 block | `29` then `0` | 0 | yes |
| 001 AC-004 block | `7` then `2` | 0 | yes |
| 001 AC-005 block | `13` then `13` | 0 | yes |
| 001 AC-006 block | nothing | 1 | yes |
| 001 AC-007 block | nothing | 1 | expected while the approval is Unmet |
| 001 AC-008, AC-009, AC-010 | `4`, `5`, `11` | 0 | yes |
| 001 AC-011 block | `4` then `1` | 0 | yes |
| 001 tasks T001 to T031, every verify that reads existing files | each printed its stated value, including T023's `RESULT: PASSED (5/5 checks)` | as stated | yes |
| The `contracts.md` section 1 sample check | `4 samples match` | 0 | yes |
| 002 T010's `jq` shapes against `design/payloads/` | `.rows`, `.groups`, `.items` exit 0, `lastRun` keys `true`, `.routines \| type == "array"` `true` | 0 | yes |
| 003 T002's `jq` against `status.json` | `4` and `true` | 0 | yes |
| 006 T004 | `8` | 0 | yes |
| 006 `plan.md:205` form | nothing | 1 | no (P0-5) |
| `rg` with `\|` against a two-line sample | nothing | 1 | the bug in P0-5 |
| The border check in P0-2 | `panels-misaligned=3` | 0 | finds frames 23, 24, 25 |
| P0-1 and P0-2 applied to a scratch copy of `mockups.md`, then `wc -l`, the AC-002 block and the border check | `2139`, `frames=53 bad=0`, `panels-misaligned=0`, divider at column 73 on lines 576, 880 and 1184, 56 changed lines | 0 | yes, the fixes hold |
| 006 T011 `test -L .opencode/skills`, `test -L .opencode/bin` | none | 0 and 0 | yes |
| `validate.sh <phase> --strict --recursive` | `RESULT: PASSED` for all seven folders, `Errors: 0`, one `PLACEHOLDER_FILLED` warning in each child's `implementation-summary.md` | read per folder | yes |

Not run: any `cargo` command (no crate exists), `bots status --json` (it can build the index and apply retention), and the vitest suites.

---

## 6. The Mermaid blocks

No renderer is installed, so this is a read. **Judgment.**

- `architecture.md` 4.1 (flowchart, line 494): node ids are plain, every label with a comma, colon or parenthesis is quoted, and every edge label uses the quoted `-->|"..."|` form. No reserved id (`end`, `graph`, `subgraph`) is used. Reads as valid.
- `architecture.md` 4.2 (sequence, line 568): four participants with `as` aliases, plain `->>` and `-->>` arrows, notes with `<br/>`. No semicolon or hash character anywhere. Reads as valid, and the cycle agrees with rules 1 to 5 of section 2.3.
- `state-machines.md` 1 (state, line 30): every edge has one colon, notes close with `end note`, a self edge on `Closed` is legal. Reads as valid. It lacks the answered-row edge (P1-4).
- `state-machines.md` 2 (state, line 129): composite states `main`, `inbox` and `overlay` each hold their own `[*]`, and `state "too-small" as TooSmall` is declared after first use, which Mermaid accepts. Reads as valid. Its prose disagrees with the frames on empty lists (P2-17).
- `state-machines.md` 3 (sequence, line 201): `autonumber`, an `actor`, `alt` and `else` branches closed by `end`, a two-participant note. The `--scope` and `--` in message text sit after the colon, where Mermaid reads free text. Reads as valid.

A scan of the five blocks for semicolons, hash characters, double braces and unbalanced quotes found none.

---

## 7. Where R1 to R17 landed

| R | Where it lands | State |
|---|----------------|-------|
| R1 | `architecture.md` section 1, copied by 002 T028, linked from `spec.md` Design Notes | Landed. No 002 task writes `keys.rs`'s half (P1-7) |
| R2 | `contracts.md`, `design/payloads/*.json`, 002 REQ-008 and T010, the fixture prints the files | Partly. The runtime-side key check is written as edits to packet phases 001 and 002 (`contracts.md` 13.1 item 10, 13.2 item 4) and is not applied, by ruling 6 |
| R3 | `contracts.md` section 10, `decision-record.md` A2 | Partly. The decision landed. Its proving criterion is proposed for packet phase 001 (`contracts.md` 13.1 item 9) and is not applied, `spec.md` section 7 has no entry, and A2's text overstates it (P2-14) |
| R4 | `spec.md` handoff rows 001 and 006, `decision-record.md` A4, 006 T021 | Landed, except the 005 to 006 row (P1-9) |
| R5 | `architecture.md` section 2.3, 002 REQ-006 and REQ-013, 005 plan data flow | Landed. The quit rule conflicts (P1-1) |
| R6 | `state-machines.md` section 4, 005 REQ-003 and REQ-014 to REQ-017, parent REQ-003 | Landed, with T011's argv (P0-8) and the class location (P1-11) |
| R7 | `architecture.md` sections 3 and 3.1 | Partly. The owner map lives in the architecture, and the parent file table still has one Phase column and no "extended by" column |
| R8 | 002 T030, 004 T014, 005 T012 and T013, 006 T021 | Partly. 003 keeps typed shell blocks as a recorded deviation in `003-shell-and-navigation/goal.md`, though frames 25 and 26 are whole shell frames the loader could read. The stale frames break the one data set (P0-1) |
| R9 | 002 REQ-008 and T010, the owner map | Landed. Scenario names are open (P1-10) |
| R10 | `architecture.md` 1.4, 1.6, 1.10 and 4.3 | Landed. The between-sizes rule is in `architecture.md` 4.3, not in `mockups.md` section 1 as R10 asked |
| R11 | `architecture.md` 2.6, 002 REQ-005 and T029, `spec.md` 3A | Landed. Old text remains (P2-5) |
| R12 | the dispatch section of each child plan, 002's risk row, 006's clean-room audit | Landed |
| R13 | `research/context-manifest.md`, 006 T018, `mockups.md` sections 5 and 6 | Partly. The manifest's name differs from R13's, its fetch recipe is marked "Nobody has run it" (`context-manifest.md:160`), and most URLs point at `HEAD` or `main` rather than a pinned commit. T018's name list is wrong (P0-6) |
| R14 | `spec.md` 3A, 002 REQ-001 and REQ-009 | Partly. The contract number is undefined (P1-3) and T026 contradicts the check (P0-4) |
| R15 | 004 REQ-025 and SC-002, parent handoff row 004 | Landed. 002's edge case still says 16 ms (P2-6) |
| R16 | `research/ui-references.md` section 3.1 | Landed. Row 4 is stale (P2-16) |
| R17 | 002 REQ-009 and REQ-016 | Partly. No verify command proves the workflow runs the diff (P2-7) |

The six diagrams of the review's section 3 all exist: the module graph and the refresh timeline in `architecture.md` 4.1 and 4.2, the layout grid in 4.3, and the overlay machine, the key-context machine and the answer sequence in `state-machines.md` sections 1 to 3.

---

## 8. Not checked

- The packet folder `specs/system-skilled-bots/003-openbot-parity-build/contracts/`, committed as `79519553b62` during this review, was only scanned for a contract number, a `--version` form and a screen-side prefix. It has none. `cli-json.md` line 38 defers the four screen verbs to this phase's `contracts.md`, and `answer-seam.md` line 55 classes the same three reasons as gone that P1-11 names, so P1-2, P1-3 and P1-11 stand. The rest of that folder was not compared with this phase.
- The plans of 003 to 006 outside the sections cited above, and every child's `implementation-summary.md`.
- Any claim about the runtime beyond the lines cited.
