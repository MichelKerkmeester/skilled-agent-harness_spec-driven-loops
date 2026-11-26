---
title: "BOT-043 -- The ui verb refuses a missing crate and a missing binary, and the crate is MIT"
description: "This scenario proves that `bots ui` refuses `ui-unavailable` with exit 4 when the skilled tree holds no crate, refuses `ui-not-built` with exit 4 and the build command when the crate is present and the binary is absent, passes a stub binary's exit code through, and that the crate declares the MIT licence with no GPL header."
version: 1.0.0.0
---

# BOT-043 -- The ui verb refuses a missing crate and a missing binary, and the crate is MIT

This document is the execution contract for `BOT-043`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator points the ui verb at a temp skilled tree with no crate and is refused with the name of the missing piece. The operator creates the crate folder and is refused again, this time with the command that builds it. The operator names a stub binary and the verb passes its exit code through. The operator then reads the crate's licence line and searches its source for a copied header.

### Why This Matters

A screen that starts and then fails leaves the terminal in a raw state the operator has to repair by hand. Both refusals happen before any terminal is touched, so a missing build is a message rather than a broken session. The licence check matters because the crate is lifted from another project, and a copied header is the one thing that turns a design reference into a licence problem.

---

## 2. SCENARIO CONTRACT

- Objective: Prove both ui refusals, the exit passthrough and the licence line.
- Real user request: `Show me what happens when the screen is not built, and prove the crate carries the right licence.`
- Prompt: `Show me what happens when the screen is not built, and prove the crate carries the right licence.`
- Expected execution process: run the ui verb against an empty temp tree, create the crate folder and run it again, run it with a stub binary named in the environment, then read the licence line and search the source.
- Expected signals: the first run exits 4 with `ui-unavailable`, the second exits 4 with `ui-not-built` and the build command, the stub run exits with the stub's own code, the licence line reads `license = "MIT"` and the source search matches only comment lines.
- Desired user-visible outcome: the operator sees two named refusals, one passthrough and a clean licence.
- Pass/fail: PASS if both refusals exit 4 with their names, the stub's code passes through and the licence line reads MIT. FAIL if a refusal exits 0, the build command is missing, the exit code is swallowed or a GPL header appears.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me what happens when the screen is not built, and prove the crate carries the right licence.`

> **No tty.** Every command here runs from a script or a pipe. The two refusals happen before the terminal guard, and the stub binary is a shell script, so nothing here needs a terminal.

> **No build.** The scenario never runs `cargo build`. The stub binary stands in for the built screen, so the passthrough is proved without compiling anything.

### Commands

Run from the repository root in a POSIX shell. One block, five turns.

```bash
# 1. Build a throwaway skilled tree with no crate and a stub binary.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/tree" "$W/bin"
printf '#!/bin/sh\necho "stub argv: $*"\nexit 7\n' > "$W/bin/bots-tui"
chmod +x "$W/bin/bots-tui"
# 2. Turn 1: the tree holds no crate.
"$NODE" "$BOTS_CLI" ui --repo "$REPO_ROOT" --skilled-tree "$W/tree"; echo "exit=$?"
# 3. Turn 2: the crate folder exists and the binary does not.
mkdir -p "$W/tree/crates/bots-tui"
"$NODE" "$BOTS_CLI" ui --repo "$REPO_ROOT" --skilled-tree "$W/tree"; echo "exit=$?"
# 4. Turn 3: a stub binary named in the environment passes its exit code through.
BOTS_UI_BIN="$W/bin/bots-tui" "$NODE" "$BOTS_CLI" ui --repo "$REPO_ROOT" --skilled-tree "$W/tree"; echo "exit=$?"
# 5. Turn 4: the crate declares its licence.
rg -n '^license' "$REPO_ROOT/crates/bots-tui/Cargo.toml"; echo "exit=$?"
# 6. Turn 5: no copied header in the source.
rg -n 'openhuman' "$REPO_ROOT/crates/bots-tui/src"; echo "exit=$?"
rg -c 'GNU General Public License|GPL-' "$REPO_ROOT/crates/bots-tui/src"; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W"
```

### Turn 1 -- a missing crate is refused by name

- Expected: `bots: ui-unavailable` and `exit=4`, with no terminal touched.

### Turn 2 -- a missing binary is refused with the build command

- Expected: `bots: ui-not-built` and `exit=4`, then a line naming `cargo build --release --manifest-path crates/bots-tui/Cargo.toml`.

### Turn 3 -- the stub's exit code passes through

- Expected: `stub argv: --repo <repo> --skilled-tree <tree>` and `exit=7`, so the verb returns the stub's own code rather than its own.

### Turn 4 -- the licence line reads MIT

- Expected: `license = "MIT"` and `exit=0`.

### Turn 5 -- the source carries no copied header

- Expected: the `openhuman` search matches only comment lines, each naming the design reference.
- Expected: the GPL search prints no match and exits 1.

### Expected

- `bots: ui-unavailable` and `exit=4` on turn 1.
- `bots: ui-not-built` and `exit=4` with the build command on turn 2.
- `exit=7` on turn 3, matching the stub.
- `license = "MIT"` on turn 4.
- Only comment lines for `openhuman` and no GPL match on turn 5.

### Evidence

Both refusal lines with their exits, the build command line, the stub's argv line with its exit, the licence line and both source searches with their exits.

### Pass / Fail

- **Pass**: both refusals exit 4 with their names, the stub's code passes through and the licence line reads MIT with no GPL header.
- **Fail**: a refusal exits 0, the build command is missing, the exit code is swallowed, the licence reads another value or a GPL header appears.
- **Skip**: only when `node` or `git` is unavailable, or when the `ui` verb is missing from the CLI's verb table, naming the missing verb and phase 003 as the blocker.

### Failure Triage

1. `bots: unknown verb: ui`: phase 003 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. Turn 1 exits 0: the crate check is missing. Read the binary resolution branch.
3. Turn 2 exits 0: the binary check is missing. Read the same branch and confirm it tests the binary path after the crate path.
4. The build command is absent: the refusal prints the name only. Read the message and add the command.
5. Turn 3 exits 4: the verb ignores `BOTS_UI_BIN`. Read the resolution order and put the environment variable first.
6. Turn 3 exits 0: the verb swallows the child's code. Read the exec branch and return the child's status.
7. The licence line reads another value: read `Cargo.toml` and set `license = "MIT"`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `terminal-screen/screen-refuses-without-binary.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the ui verb, its resolution order and its two refusals |
| `$REPO_ROOT/crates/bots-tui/Cargo.toml` | Declares the licence |
| `crates/bots-tui/src/lib.rs` | The library root the source search reads |
| `crates/bots-tui/tests/cli_client.rs` | The integration tests against the fixture |

The licence and the copied-header rule are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:203]. The read and write surface is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:204].

---

## 5. SOURCE METADATA

- Group: Terminal Screen
- Playbook ID: BOT-043
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `terminal-screen/screen-refuses-without-binary.md`
