---
title: "BOT-044 -- The inbox pane answers with y and n and a closed input writes nothing"
description: "This scenario proves that the inbox pane lists every open and expired item, that `y` writes `bots answer --scope once` and `n` writes `bots answer --scope deny` with no other key denying, and that a closed input while an item is selected writes no answer and leaves the item open."
version: 1.0.1.0
---

# BOT-044 -- The inbox pane answers with y and n and a closed input writes nothing

This document is the execution contract for `BOT-044`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator runs the crate's answer-flow test, which drives the loop from a supplied event source and reads the argv the fake CLI recorded. The test proves that `y` writes one answer with the scope `once`, that `n` writes one with the scope `deny`, that no other key denies, and that a closed input writes nothing. The operator then reads the JSON inbox to confirm the item a closed input left behind is still open.

### Why This Matters

A screen that answers on the wrong key approves work the operator meant to refuse, and the operator never sees it happen. A closed input that writes an answer is the same failure with no key at all, which is why the loop takes its events from a source the caller supplies: the closed-input case has to be provable without a terminal.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the two answer keys, the absence of a third denying key and the closed-input case.
- Real user request: `Show me that y approves and n refuses, that nothing else refuses, and that closing the screen answers nothing.`
- Prompt: `Show me that y approves and n refuses, that nothing else refuses, and that closing the screen answers nothing.`
- Expected execution process: run the answer-flow test, read its output, read the argv log it leaves, then read the JSON inbox for the item the closed-input case selected.
- Expected signals: the test passes, the argv log holds one `--scope once` line for `y` and one `--scope deny` line for `n`, no other key produces an answer line, and the closed-input case leaves the item open.
- Desired user-visible outcome: the operator sees two answers with the right scopes and one selection that wrote nothing.
- Pass/fail: PASS if the test passes, the two scopes appear on the right keys, no third key answers and the closed input writes nothing. FAIL if a key writes another scope, a third key answers or the closed input writes an answer.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me that y approves and n refuses, that nothing else refuses, and that closing the screen answers nothing.`

> **No tty.** The loop takes its events from a source the caller supplies, so every case here runs from a pipe with no terminal. That is the property the test exists to prove, not a workaround.

> **No live state.** The fake CLI at `.skilled/crates/bots-tui/tests/fixtures/bots` prints the payloads under `tests/fixtures/payloads/` and records its argv, so no test reads a live state root.

### Commands

Run from the repository root in a POSIX shell. One block, five turns.

```bash
# 1. Build a throwaway world holding one open item, so the inbox read has a subject.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-ask" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nAsk a question.\nSTUB:decide=Ship the release notes now or wait for review?\nSTUB:option=ship now\nSTUB:option=wait for review\n' > "$W/checkout/bots/pb-ask/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "asking bot"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 2. Turn 1: run the answer-flow test.
cargo test --manifest-path "$REPO_ROOT/.skilled/crates/bots-tui/Cargo.toml" --test answer_flow; echo "exit=$?"
# 3. Turn 2: read the argv the fake CLI recorded.
find "$REPO_ROOT/.skilled/crates/bots-tui/tests" -name '*argv*' -newer "$REPO_ROOT/.skilled/crates/bots-tui/Cargo.toml" | sort
rg -n 'answer' "$REPO_ROOT/.skilled/crates/bots-tui/tests" -g '*argv*' | head -20
# 4. Turn 3: read the two scopes the test asserts.
rg -n 'scope once|scope deny' "$REPO_ROOT/.skilled/crates/bots-tui/tests/answer_flow.rs"
# 5. Turn 4: park an item and read the JSON inbox the pane draws from.
pbots chat pb-ask --message "Ask a question."; echo "exit=$?"
pbots inbox --json; echo "exit=$?"
# 6. Turn 5: the item is still open, because the closed-input case wrote nothing.
pbots inbox --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);for(const i of o.items)console.log([i.id,i.state,JSON.stringify(i.answer)].join(" | "))})'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- the answer-flow test passes

- Expected: `cargo test` prints `running` lines for `answer_flow`, then `test result: ok` and `exit=0`.

### Turn 2 -- the argv log holds the answer calls

- Expected: at least one path printed, and the `rg` lines naming `answer` with `--scope once` and `--scope deny`.

### Turn 3 -- the two scopes are asserted in the test

- Expected: two matches, one for `scope once` and one for `scope deny`, and no match for a third denying key.

### Turn 4 -- the pane's payload lists the open item

- Expected: `exit=5` on the park, then a JSON object whose `items` array holds one row with `state` reading `open`.

### Turn 5 -- the closed input left the item open

- Expected: one row, `state` reading `open` and `answer` reading `null`.

### Expected

- `test result: ok` and `exit=0` on the answer-flow test.
- One `--scope once` line and one `--scope deny` line in the argv log.
- No third denying key in the test.
- One open row with a null answer after the closed-input case.

### Evidence

The whole `cargo test` output with its exit, the argv log path and its answer lines, the two scope matches, the park line and both JSON inbox reads.

### Pass / Fail

- **Pass**: the test passes, the two scopes appear on the right keys, no third key answers and the closed input writes nothing.
- **Fail**: a key writes another scope, a third key answers, the closed input writes an answer or the item reads answered.
- **Skip**: only when `cargo` is unavailable, when `.skilled/crates/bots-tui` is missing because phase 003 has not landed, or when the `answer_flow` test file is absent, naming the missing piece and phase 003 as the blocker.

### Failure Triage

1. `error: manifest path ... does not exist`: phase 003 has not landed. Read the crate list in the phase 003 spec.
2. `no test target named answer_flow`: the test file is missing. Read the phase 003 file table.
3. The test fails on the `y` case: the approve key writes another scope. Read the key map in `state.rs`.
4. The test fails on the `n` case: the deny key writes another scope. Read the same map and confirm `n` is the only denying key.
5. The test fails on the closed-input case: the loop answers on end of input. Read the event source and confirm a closed input is one event that writes no effect.
6. The item reads answered after the closed-input case: the fixture recorded an answer. Read the argv log and find the call.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `terminal-screen/inbox-pane-answers.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/crates/bots-tui/src/state.rs` | The pure reducer that maps a key to an effect |
| `.skilled/crates/bots-tui/src/cli.rs` | The only module that spawns `bots answer` |
| `.skilled/crates/bots-tui/tests/answer_flow.rs` | The argv log, Esc and closed-input cases |
| `.skilled/crates/bots-tui/tests/fixtures/bots` | The fake CLI that records its argv |

The inbox pane and its two keys are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:206]. The closed-input rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:208].

---

## 5. SOURCE METADATA

- Group: Terminal Screen
- Playbook ID: BOT-044
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `terminal-screen/inbox-pane-answers.md`
