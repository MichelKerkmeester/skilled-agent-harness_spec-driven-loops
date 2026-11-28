---
title: "BOT-045 -- Every bound key is drawn in the frame that binds it"
description: "This scenario proves that the footer names `Alt+1..4`, `[` `]`, `Ctrl+P` and `Ctrl+D`, that the inbox footer names `Enter open`, that the decision overlay names `t`, `n`, `y` and `Esc` with `n deny` drawn before any approve key, that the choice overlay names `1-9`, `n` and `Esc`, and that the tab bar holds the four tabs."
version: 1.0.1.0
---

# BOT-045 -- Every bound key is drawn in the frame that binds it

This document is the execution contract for `BOT-045`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs the crate's render-keys test, which draws each frame into a test backend and asserts that every bound key appears in it, at 67 columns and narrower. The operator runs the panes test, which asserts the four tabs. The operator then searches the source for the footer strings the tests assert.

### Why This Matters

A key the operator cannot see is a key they will not press, and a key they find by accident is one they press without knowing what it does. Drawing `n deny` before any approve key is the difference between a refusal the operator can find and one they discover after approving something. The narrower width matters because a footer that drops a key at 60 columns drops it exactly when the operator has the least room to read it.

---

## 2. SCENARIO CONTRACT

- Objective: Prove every bound key is drawn in its frame at both widths and the tab bar holds four tabs.
- Real user request: `Show me every key the screen binds is on the screen, and that the four tabs are there.`
- Prompt: `Show me every key the screen binds is on the screen, and that the four tabs are there.`
- Expected execution process: run the render-keys test, run the panes test, then search the source for the footer and overlay strings.
- Expected signals: both tests pass, the source search finds the four footer labels, the `Enter open` label, the decision overlay's four keys with `n deny` first and the choice overlay's three labels.
- Desired user-visible outcome: the operator sees a screen whose every key is written where they will look for it.
- Pass/fail: PASS if both tests pass and every named label is present in the source. FAIL if a test fails, a label is missing or `n deny` is drawn after an approve key.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me every key the screen binds is on the screen, and that the four tabs are there.`

> **No tty.** The render-keys test draws into a test backend rather than a terminal, so every assertion here runs from a pipe with no terminal.

> **No live state.** The fake CLI at `.skilled/crates/bots-tui/tests/fixtures/bots` prints the payloads under `tests/fixtures/payloads/`, so no test reads a live state root.

### Commands

Run from the repository root in a POSIX shell. One block, five turns.

```bash
# 1. Turn 1: run the render-keys test.
REPO_ROOT="$(git rev-parse --show-toplevel)"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
cargo test --manifest-path "$REPO_ROOT/.skilled/crates/bots-tui/Cargo.toml" --test render_keys; echo "exit=$?"
# 2. Turn 2: run the panes test, which asserts the four tabs.
cargo test --manifest-path "$REPO_ROOT/.skilled/crates/bots-tui/Cargo.toml" --test panes; echo "exit=$?"
# 3. Turn 3: compare the footer labels against the fixed list.
printf '%s\n' 'Alt+1' 'Alt+2' 'Alt+3' 'Alt+4' 'Ctrl+P' 'Ctrl+D' | sort > "$W/footer.txt"
rg -o 'Alt\+[1-4]|Ctrl\+[PD]' "$REPO_ROOT/.skilled/crates/bots-tui/src" | cut -d: -f2- | sort -u > "$W/footer-seen.txt"
diff "$W/footer.txt" "$W/footer-seen.txt"; echo "exit=$?"
# 4. Turn 4: compare the inbox footer and the two overlays against the fixed list.
printf '%s\n' 'Enter open' 'n deny' '1-9' | sort > "$W/overlay.txt"
rg -o 'Enter open|n deny|1-9' "$REPO_ROOT/.skilled/crates/bots-tui/src" | cut -d: -f2- | sort -u > "$W/overlay-seen.txt"
diff "$W/overlay.txt" "$W/overlay-seen.txt"; echo "exit=$?"
# 5. Turn 5: read the tab labels in the tab bar.
rg -n 'activity|inbox|routines|chat' "$REPO_ROOT/.skilled/crates/bots-tui/src/tabs.rs" 2>/dev/null || rg -n 'Alt\+1 activity|Alt\+2 inbox|Alt\+3 routines|Alt\+4 chat' "$REPO_ROOT/.skilled/crates/bots-tui/src"; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W"
```

### Turn 1 -- every bound key is drawn

- Expected: `test result: ok` for `render_keys` and `exit=0`, with one passing case per frame at 67 columns and one at a narrower width.

### Turn 2 -- the four tabs are drawn

- Expected: `test result: ok` for `panes` and `exit=0`.

### Turn 3 -- the footer names the six navigation keys

- Expected: `diff` prints nothing and `exit=0`, so the source holds exactly `Alt+1` to `Alt+4`, `Ctrl+P` and `Ctrl+D` and no other label in that shape.

### Turn 4 -- the inbox footer and both overlays name their keys

- Expected: `diff` prints nothing and `exit=0`, so the source holds exactly `Enter open`, `n deny` and `1-9`.
- Expected: the `n deny` match sits before any approve label in the same string, so the refusal is drawn first.

### Turn 5 -- the tab bar names the four tabs

- Expected: four matches, one per tab, in the order activity, inbox, routines, chat.

### Expected

- `test result: ok` on both tests.
- Both `diff` runs printing nothing with `exit=0`.
- `Enter open`, `n deny` and `1-9` each present.
- Four tab labels in the documented order.

### Evidence

Both `cargo test` outputs with their exits, both `diff` exits with their empty output and the four tab matches.

### Pass / Fail

- **Pass**: both tests pass and every named label is present in the source with `n deny` drawn first.
- **Fail**: a test fails, a label is missing, `n deny` is drawn after an approve key or the tab order differs.
- **Skip**: only when `cargo` is unavailable, when `.skilled/crates/bots-tui` is missing because phase 003 has not landed, or when the `render_keys` test file is absent, naming the missing piece and phase 003 as the blocker.

### Failure Triage

1. `error: manifest path ... does not exist`: phase 003 has not landed. Read the crate list in the phase 003 spec.
2. `no test target named render_keys`: the test file is missing. Read the phase 003 file table.
3. The test fails at 67 columns: a footer label is missing. Read the footer builder and add the label.
4. The test fails at the narrower width: the footer drops a label rather than shortening it. Read the narrow branch.
5. `n deny` is absent: the overlay draws the approve keys only. Read the overlay builder and draw the refusal first.
6. The tab order differs: the tab list is built from a map. Read the tab constant and make it a fixed list.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `terminal-screen/banner-and-overlay.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/crates/bots-tui/src/app.rs` | Draws one frame per message |
| `.skilled/crates/bots-tui/src/state.rs` | Holds the tab and overlay state the frame reads |
| `.skilled/crates/bots-tui/tests/render_keys.rs` | The test-backend assertions that every bound key is drawn |
| `.skilled/crates/bots-tui/tests/panes.rs` | One buffer snapshot per pane per state at both sizes |

The four tabs and the palette keys are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:205]. The drawn-key rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:207].

---

## 5. SOURCE METADATA

- Group: Terminal Screen
- Playbook ID: BOT-045
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `terminal-screen/banner-and-overlay.md`
