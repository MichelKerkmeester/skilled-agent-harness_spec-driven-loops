# Iteration 13: The crate's fixture is a contract four phases change

## Focus

003 terminal screen, the last uncovered surface: whether its acceptance criteria and the CI workflow agree on how the Rust crate is built and tested, and whether the crate's fixture seam survives the JSON contracts the other phases change. The frontier is drained, so the focus comes from iteration 12's recommended next focus. Evidence: 003's spec, plan, tasks and acceptance criteria against `.github/workflows/bots-runtime.yml`, the four phases that change a `--json` shape, and the local toolchain.

## Findings

1. **P1 — the crate's fixture is a shared contract that four phases change and only one lists, so 003's integration tests keep passing against shapes the runtime no longer emits.** 003 creates `crates/bots-tui/tests/fixtures/bots` as "the fake CLI: canned JSON per verb, records its argv" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:140], and 010 lists it as `Modify` for the chat payload [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:124]. Three other phases change a `--json` shape the fixture serves and none lists it: 001 adds `bots activity --json` and `bots inbox --json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:49-50], 002 adds `bots routines --json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:109], and 006 adds `grants` to the inbox item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156]. A grep for the fixture path across the eleven phases returns only 003 and 010 [SOURCE: rg -n "crates/bots-tui/tests/fixtures" specs/system-skilled-bots/003-openbot-parity-build/0*/ → 003 spec.md:140, 010 spec.md:124, 010 tasks.md:68]. **Edit:** add `crates/bots-tui/tests/fixtures/bots` as `Modify` to 001, 002 and 006's Files to Change with the exact payload each adds, and add one line to `003/spec.md` §3: "the fixture is the copy of every `--json` contract the screen reads, and a phase that changes one updates it in the same change".

2. **P1 — `bots ui` resolves the binary inside the skilled tree, so a packaged install has no crate and the verb refuses for every user who did not clone the repository.** REQ-001 execs `<skilled-tree>/crates/bots-tui/target/release/bots-ui` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:161], and the crate lives at the repository root [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:127], outside `.skilled/skills/system-skilled-bots/`. The skill is also distributed as a plugin package, and a package carries the skill's own files rather than the repository root, so `crates/` is absent from it. The phase's missing-binary refusal covers a crate that was never built, not a tree that never had one, and the two cases need different messages because only one of them is fixable by running `cargo build`. **Edit:** in `003/spec.md` REQ-001 add "when the crate directory is absent the verb refuses `ui-unavailable` and says the screen ships only in a source checkout, naming the build command; when the crate is present and the binary is absent it refuses `ui-not-built` with the same command"; add both cases to `cli-ui.vitest.ts` and one line to the crate README.

3. **P2 — the CI task's verify proves the job's name appears three times and nothing about its steps, so a job with no toolchain step and no `cargo test` passes its own task.** T024 adds the `bots-tui` job and the two path entries and verifies with `rg -n 'bots-tui' .github/workflows/bots-runtime.yml` printing three lines [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md:72]. The two path entries and the job name are exactly three matches, so the verify passes whether or not the job has a toolchain step or runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test`, which the spec requires [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:112]. The existing workflow has no Rust step at all [SOURCE: .github/workflows/bots-runtime.yml:96-118]. **Edit:** in `003/tasks.md:72` change the verify to `rg -n 'rust-toolchain|cargo fmt --check|cargo clippy|cargo test' .github/workflows/bots-runtime.yml` printing four lines, and add an acceptance criterion that the job's steps name the three commands and a toolchain action.

4. **P2 — the fixture is spawned as a program but no task sets its executable bit, and the task's own verify uses `bash` so it passes without one.** T012 writes the fixture and verifies with `bash $CRATE/tests/fixtures/bots status --json` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md:60], which runs the file through an interpreter and needs no mode. The crate's client spawns the fixture as a program, so a fresh clone without the executable bit fails the integration test with a permission error while T012 passes. A grep for `chmod`, `executable` or `+x` across 003 returns nothing [SOURCE: rg -n "chmod|executable|mode 755|\+x" specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen → no matches]. **Edit:** in `003/tasks.md:60` add "and `chmod +x $CRATE/tests/fixtures/bots`" to the task, change the verify to `$CRATE/tests/fixtures/bots status --json` without `bash`, and add one line to the crate README that the fixture is committed executable.

## Ruled Out

- Looking for an unrunnable verify command: `cargo` and `rustc` are installed here, so `cargo test`, `cargo clippy` and `cargo fmt --check` run in this checkout. The gap is the CI job, not the local commands.
- Looking for a missing path entry: the two entries are one per trigger list, which is what the workflow needs, and `crates/bots-tui/**` covers the lock file.
- Looking for a crate that copies openhuman code: REQ-002 refuses it by grep and the licence is MIT [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162].

## Dead Ends

- Looking for a second language toolchain problem: the local toolchain exists and the phase confirms it in T002, so the only toolchain gap is the CI step, which iteration 5 recorded.
- Looking for a `.opencode` mirror row that cannot be done: iteration 5 recorded that the tree is symlinked, and 003's two mirror rows are the same no-op.

## Edge Cases

- Ambiguous input: "the fixture" could mean the canned payloads or the script that serves them. Both are one file here, so the finding covers both.
- Contradictory evidence: none. The phase's requirements are consistent; the gap is the fixture's ownership across phases.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:112,127,140,147,161,162
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md:43,60,72
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:49-50
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:109
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:124, tasks.md:68
- .github/workflows/bots-runtime.yml:10-63,96-118
- which cargo rustc → /Users/michelkerkmeester/.cargo/bin/cargo, /Users/michelkerkmeester/.cargo/bin/rustc

## Assessment

- New information ratio: 0.88
- Questions addressed: do 003's criteria and the workflow agree on how the crate is built and tested, and does the fixture seam survive the other phases' JSON changes
- Questions answered: the fixture is a shared contract only two phases list, the binary path assumes a source checkout, the CI task's verify cannot fail, and the fixture's mode is unset

## Reflection

- What worked and why: grepping the fixture path across all eleven phases answered the ownership question in one command, and the asymmetry between 010 listing it and 001, 002 and 006 not listing it is the finding. The same grep shape found the missing `chmod`.
- What did not work and why: the first pass expected the workflow to lack the crate's path entries and found them specified. The real gap was the verify's strength, which only shows when the task's command is read as a test rather than as a description.
- What I would do differently: for every task whose verify is a `rg` count, ask what a wrong implementation would print. Here a job with no steps prints the same three lines as a correct one.

## Recommended Next Focus

The frontier is drained and the iteration budget is spent, so the next step is synthesis: assemble the cross-phase conflict list from iterations 1 to 13, rank the findings by phase and severity, and write `research.md` with the convergence report. The conflict list has seven entries: the parent's ten-versus-eleven scope, the notices owner list, the shared-host mode, the approver check placement, the answer grammar, the schema version, and the fixture ownership.
