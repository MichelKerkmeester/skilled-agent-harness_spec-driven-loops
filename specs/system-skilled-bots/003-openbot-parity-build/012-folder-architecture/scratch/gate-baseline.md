# Gate baseline

BASE: 1937abca82319d1e985992709464c54300894ca6

Every gate ran from the worktree root at BASE before any move, and each section below copies its log lines verbatim.

## 1. Runtime suite

Command:

```text
npm --prefix .skilled/skills/system-skilled-bots/runtime test
```

Result lines:

```text
 Test Files  57 passed (57)
      Tests  794 passed (794)
```

Exit: 0

## 2. Runtime typecheck

Command:

```text
npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck
```

No result line is needed beyond the exit.

Exit: 0

## 3. Crate format

Command:

```text
cargo fmt --check --manifest-path .skilled/crates/bots-tui/Cargo.toml
```

No result line is needed beyond the exit.

Exit: 0

## 4. Crate lint

Command:

```text
cargo clippy --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings
```

Final line of the log:

```text
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 5.56s
```

Exit: 0

## 5. Crate tests

Command:

```text
cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml
```

Each `Running` target paired with the next `test result` line after it:

| Target | Result line |
|---|---|
| unittests src/lib.rs | test result: ok. 148 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 8.13s |
| unittests src/main.rs | test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s |
| tests/answer_flow.rs | test result: ok. 24 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 12.51s |
| tests/chat.rs | test result: ok. 41 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 6.32s |
| tests/cli_client.rs | test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.07s |
| tests/end_to_end.rs | test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.21s |
| tests/panes.rs | test result: ok. 51 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.03s |
| tests/pty_smoke.rs | test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.52s |
| tests/render_keys.rs | test result: ok. 17 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.07s |
| Doc-tests bots_tui | test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s |

All ten `test result` lines:

```text
test result: ok. 148 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 8.13s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 24 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 12.51s
test result: ok. 41 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 6.32s
test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.07s
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.21s
test result: ok. 51 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.03s
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.52s
test result: ok. 17 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.07s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

Exit: 0

## 6. Deep-loop executor audit tests

Command:

```text
cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/executor-audit-cli-branch-receipts.test.ts tests/executor-audit-receipts.test.ts tests/unit/executor-audit-ledger-projection.vitest.ts tests/unit/executor-audit-process-group.vitest.ts tests/unit/executor-audit-run-directory.vitest.ts tests/unit/executor-audit.vitest.ts
```

Result lines:

```text
 Test Files  6 passed (6)
      Tests  135 passed (135)
```

Exit: 0

## 7. Hub check

Command:

```text
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
```

Final line of the log:

```text
OK: parent-skill-check — all hard invariants passed, 0 warnings
```

Exit: 0

## 8. Gate inputs

Command:

```text
bash .github/scripts/check-gate-inputs.sh
```

Result lines:

```text
files=48 inputs_resolved=357 dynamic_inputs=44 twin_pairs=448 failures=0
RESULT: PASSED
```

Exit: 0

## 9. Playbook validator

Command:

```text
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots
```

Result line:

```text
PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=58 categories=17 operator=52 routing_gold_excluded=6 violations=0 warnings=0
```

Exit: 0

## 10. CLI help

Command:

```text
node .skilled/bin/bots.cjs --help
```

First line of the log:

```text
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
```

Log length: 105 lines, which is `wc -l` on the log at 106 minus the `EXIT` line.

Exit: 0

## 11. CI design diff guard

Command, the diff lines of the step `Keep the shipped design copy equal to the packet copies` in `.github/workflows/bots-runtime.yml`, run by hand:

```text
D1=specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design
D2=specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design
diff -r -x architecture.md -x contracts.md "$D1" .skilled/crates/bots-tui/design
diff "$D2/architecture.md" .skilled/crates/bots-tui/design/architecture.md
diff "$D2/contracts.md" .skilled/crates/bots-tui/design/contracts.md
for name in status activity inbox routines; do
  diff "$D2/payloads/$name.json" ".skilled/crates/bots-tui/tests/fixtures/payloads/$name.json"
done
```

Full log:

```text
Only in .skilled/crates/bots-tui/design: chat-mockups.md
```

Exit: 1

The guard fails at BASE. Commit 44216a6ad13 added .skilled/crates/bots-tui/design/chat-mockups.md, a byte-identical copy of specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md, and the guard was not taught about it. No move in this phase touches design/, so the final state must print this same line and nothing more.

## 12. Recursive strict validation

Command:

```text
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --recursive --strict
```

Counts, taken with `grep -c` over the log:

- `RESULT: PASSED` lines: 16
- `RESULT: FAILED` lines: 0

Folders whose `Summary:` line reports Warnings above 0, each with that line and the warning it counts:

```text
specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture
Summary: Errors: 0  Warnings: 1
! PLACEHOLDER_FILLED: 6 unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft

specs/system-skilled-bots/003-openbot-parity-build/015-deep-review
Summary: Errors: 0  Warnings: 1
! PLACEHOLDER_FILLED: 6 unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft
```

Every `RESULT: PASSED` line, 16 in all:

```text
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
RESULT: PASSED
```

Exit: 0

## Summary

| Gate | Result | Exit |
|---|---|---|
| 1. Runtime suite | PASS | 0 |
| 2. Runtime typecheck | PASS | 0 |
| 3. Crate format | PASS | 0 |
| 4. Crate lint | PASS | 0 |
| 5. Crate tests | PASS | 0 |
| 6. Deep-loop executor audit tests | PASS | 0 |
| 7. Hub check | PASS | 0 |
| 8. Gate inputs | PASS | 0 |
| 9. Playbook validator | PASS | 0 |
| 10. CLI help | PASS | 0 |
| 11. CI design diff guard | FAIL | 1 |
| 12. Recursive strict validation | PASS | 0 |
