---
title: "Feature Specification: Phase 6: hardening-and-proof"
description: "The gate phase of the terminal screen: it runs the formatter, the linter, the crate and runtime suites, proves the MIT boundary against the GPL-3.0 design reference, writes the crate README and the hub line, and audits the eight defects the expansion fixes."
trigger_phrases:
  - "hardening and proof"
  - "phase 6 hardening and proof"
  - "bots ui gates"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: hardening-and-proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-skilled-bots/003-openbot-parity-build` |
| **Phase** | 6 of 6 |
| **Predecessor** | `005-answer-flow` |
| **Successor** | None |
| **Handoff Criteria** | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` exit 0 in `crates/bots-tui`. `cargo test --release --test pty_smoke` prints `1 passed`, so the answer path is proven without a person. The licence grep finds no GPL header in the code or the manifest and no copied openhuman code. `crates/bots-tui/README.md` names the build, the run, every bound key and the design reference. `validate.sh --strict` prints `RESULT: PASSED` for this child, which is the last of the six and so the row the parent's `--recursive` run reads last |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: This phase writes two files, `crates/bots-tui/README.md` and one line in `.skilled/skills/system-skilled-bots/SKILL.md`, and repairs only the lines a gate names. It adds no module, no option and no dependency.

**Dependencies**:
- `002-architecture-and-contracts` for the crate, the fixture and the `bots-tui` CI job this phase reads.
- `003-shell-and-navigation` for `keys.rs`, `theme.rs` and the shell views the key, glyph and sanitize checks read. `theme.rs` carries `printable`, the one control-character filter, and the crate holds no `sanitize.rs`.
- `004-panes` for `view/panes.rs` and the chat line, which the pane and selection checks read.
- `005-answer-flow` for `view/overlay.rs`, which carries the free-text fix. The hand proof is the operator's step after this phase, and the scripted pseudo-terminal run here proves the same path without a person.

**Deliverables**:
- One gate run over the crate: formatter, linter, crate suite and runtime suite.
- One licence proof: MIT in the manifest, no GPL text, no copied openhuman code, and every design pointer resolving.
- One crate README: build, run, keys, glyphs with the ASCII fallback, the design reference and the no-code statement.
- One hub line naming `bots ui` as a status surface, with the mirror proof.
- One defect audit: eight checks, one per defect the expansion fixes.
- One scripted pseudo-terminal run: the release binary against the fixture, answering one item.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five children before this one each add a surface, and each one's own tests prove only its own surface. Nothing yet proves the crate as a whole: no formatter or linter has run over the modules five workers wrote, no check proves the GPL-3.0 design reference was copied as design rather than code, and no README tells a reader how to build, run or read the screen. A crate that passes five separate suites can still fail `cargo fmt --check`, carry a copied function, or ship with no way in.

### Purpose
One gate run that proves the crate is formatted, lint-clean, tested, licence-clean and documented, and one README that lets a reader build and drive it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check
`cargo metadata` exited with an error: error: manifest path `crates/bots-tui/Cargo.toml` does not exist
EXIT=1

$ cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings
error: manifest path `crates/bots-tui/Cargo.toml` does not exist

$ rg -n 'openhuman' crates/bots-tui/src
rg: crates/bots-tui/src: IO error for operation on crates/bots-tui/src: No such file or directory (os error 2)
EXIT=2

$ rg -c 'bots-tui' .github/workflows/bots-runtime.yml
EXIT=1

$ ls crates/bots-tui/README.md
ls: crates/bots-tui/README.md: No such file or directory
EXIT=1
```

Every gate this phase runs has nothing to run against today: the manifest, the source tree, the README and the CI job are all absent, so each command fails on a missing path rather than on a defect. That is the measured gap, and it is why the phase is written against the crate the five children land rather than against a crate that exists. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:66]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the three crate gates and the runtime suite, and repair only the lines they name, so `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test` and the runtime suite all pass.
- Prove the licence boundary: `license = "MIT"` in the manifest, no GPL header in the crate's code or manifest, no copied openhuman function, and every `file:line` pointer in `design/` resolving to a real line when the gitignored reference folder is present, with a named skip when it is not.
- Write `crates/bots-tui/README.md`: the build command, the run command, every bound key, the eight glyphs with their ASCII fallback and the two flags that select it, the design reference and the statement that no code or text was copied.
- Name `bots ui` as a status surface in one line in `.skilled/skills/system-skilled-bots/SKILL.md`, and prove both hub mirrors, `.opencode/skills` and `.opencode/bin`, are symlinks so the line and the verb each land once.
- Audit the eight defects the expansion fixes, one command per defect, so the hardening claim is evidence rather than assertion.
- Read the `bots-tui` CI job and report a gate set that differs from the local one, without editing the workflow.
- Validate this child with `--strict`, which is the row the parent's `--recursive` run reads last.

### Out of Scope
- The `bots-tui` CI job and its toolchain step - `002-architecture-and-contracts` owns `.github/workflows/bots-runtime.yml`, so this phase reads the job and reports a mismatch rather than editing it.
- The hand proof - it is the operator's final acceptance step after this phase, and the scripted pseudo-terminal run here proves the same path without a person. The closed-input test stays `005-answer-flow`'s.
- Any new module, option or dependency - this phase adds no behaviour, and a gate that needs a behaviour change is reported to the child that owns the module.
- `THIRD_PARTY_NOTICES.md` - no third-party code is copied, so there is nothing to notice. The design reference is recorded in the crate README instead.
- The design mockups and the screenshots - `001-ux-and-component-map` owns `design/`, and this phase reads it for the pointer check and links it from the README.
- A `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out, and none is needed to prove a gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/README.md` | Create | Build, run, keys, glyphs with the ASCII fallback, the design reference and the no-code statement |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | One line naming `bots ui` as a status surface |
| `crates/bots-tui/src/**` | Modify | Only the file and line a gate names: a formatting change, a lint fix, or a test the suite reports |
| `crates/bots-tui/tests/**` | Modify | Only the test a gate names, and never a lowered assertion |
| `crates/bots-tui/tests/pty_smoke.rs` | Create | The release binary in a pseudo-terminal against the fixture, answering one item |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ-002 is inherited from the parent and keeps its id and its wording, so a citation from another phase still resolves. This child's own requirements start at REQ-012, the highest parent id plus one, and run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-002 | `crates/bots-tui/Cargo.toml` declares `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` matches only comment lines that name the design reference. No file in the crate carries a GPL header or a copied openhuman function. |
| REQ-012 | `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0, so every module and test file the five children wrote is formatted, and the run rewrites no file. |
| REQ-013 | `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0, so the library, the binary, the integration tests and the doc examples are lint-clean at the deny level rather than at the default warn level. |
| REQ-014 | `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`, including the doc tests `cargo test` runs by default. |
| REQ-015 | `crates/bots-tui/README.md` names the release build command, the run command, every bound key the key table carries, the eight glyphs with their ASCII fallback and the `--mono` and `--ascii` flags that select the Mono palette and the ASCII set, openhuman as the design reference with its GPL-3.0 licence, and the statement that no code or text was copied. The key list includes `[` and `]` beside Alt+1..4 and Ctrl+C beside Ctrl+D, because those are the bindings the expansion adds. |
| REQ-016 | Each of the eight defects the parent's §6 lists carries one check in `tasks.md`'s Defect Audit table, and every check prints its expected output. The checks are greps and suite runs, so the audit needs no terminal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:241] |
| REQ-017 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`, so this child's own documents are complete and consistent. The parent's `--recursive` run is the parent's closure step, not this child's, because it fails on the five sibling scaffolds until each of them is written. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-018 | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`, so the `ui` verb's tests still pass after the crate's repairs. |
| REQ-019 | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line naming the verb as a status surface, and both hub mirrors are symlinks, `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0, so the edited line and the edited verb each land once rather than in two copies. `rg -c 'ui' .opencode/bin/bots.cjs` prints the same count as `.skilled/bin/bots.cjs`. |
| REQ-020 | `crates/bots-tui/design/` holds the four documents 001 authored, `mockups.md`, `key-map.md`, `glyph-table.md` and `component-inventory.md`, plus 002's `architecture.md` and `contracts.md`, and every `file:line` pointer in them resolves to a real line in the cited source under `specs/system-skilled-bots/context/` whenever that gitignored folder is present, the check names its skip when it is absent, and the folder names openhuman as the design reference with its GPL-3.0 licence. A pointer that dangles is a broken citation, not a design note, and a missing design folder is a failed check rather than an empty one. |
| REQ-021 | The `bots-tui` job in `.github/workflows/bots-runtime.yml` runs the same three gates this phase runs, and `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2. A job that runs a different gate set is reported to `002-architecture-and-contracts` and recorded in `goal.md`, never edited here. |
| REQ-022 | `cargo test --manifest-path crates/bots-tui/Cargo.toml --release --test pty_smoke` starts the release binary in a pseudo-terminal against the fixture, sends the keys that answer one item and reads the drawn screen, so the answer path is proven without a person. The test resolves the binary with `env!("CARGO_BIN_EXE_bots-ui")`, which cargo sets for an integration test, so no path is typed and no build step is assumed. It builds a temp skilled tree whose `.skilled/bin/bots.cjs` is a small Node shim that spawns the fixture with the argv it is given, so the release binary's one fixed program path reaches the fixture without an environment variable. The test has no skip branch: a missing binary or a missing shim fails the test rather than passing it. |

### What REQ-002 means as design

The crate takes the RAII terminal guard, the minimum-size screen, the footer key line, the banner above the input and the System and Mono palettes as design, and writes each in its own words. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/terminal.rs:75-118] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:26-35] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:99] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:221-229] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82]

The clean-room rule keeps those sources out of the briefs of the workers that write the matching modules. A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets our design files and MIT or Apache references only. The openhuman and tinychannels paths appear in design documents as provenance, never in a worker brief. The orchestrator compares the finished guard and the overlay with the openhuman files by eye and records that it did, because a copied function would carry neither the `openhuman` string nor the GPL header the greps look for.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` all exit 0 in `crates/bots-tui`, and the runtime suite prints no `failed`.
- **SC-002**: `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing, `cargo metadata` prints `"license":"MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
- **SC-003**: `crates/bots-tui/README.md` names the build command, the run command, every bound key, the eight glyphs with their ASCII fallback, and openhuman as the design reference with no code copied.
- **SC-004**: the eight rows of the Defect Audit table each print their expected output, so every defect the expansion fixes has a check that passes.
- **SC-005**: `validate.sh --strict` on this child prints `RESULT: PASSED`, and the parent's `--recursive` run reads this child's line last.
- **SC-006**: `cargo test --release --test pty_smoke` prints `1 passed`, so the release binary answers one item in a pseudo-terminal and the fixture records the `answer` argv.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003`, `004` and `005` land the modules and tests this phase gates | High: a missing target makes a gate fail on a path rather than on a defect | The gate runs against whatever exists and reports the missing target by name. The phase does not pass a gate it could not run |
| Dependency | `002` lands the crate, the fixture and the `bots-tui` CI job | Medium: no manifest means no gate | The measured-behavior block records the absent manifest, and the phase starts only after 002's handoff row passes |
| Risk | A gate failure tempts a rewrite of a module another child owns | High: a behaviour change in a hardening phase is invisible to the child that owns the module | Repair only the line the gate names, and record a deviation in `goal.md` when the repair changes behaviour |
| Risk | The GPL grep is a text match, so a paraphrased copy passes it | Medium: the licence proof would be weaker than it reads | Pair the grep with the design-pointer check, the clean-room rule that keeps the GPL sources out of the worker briefs, and a recorded human read of the guard and the overlay, and say in the log that the three are the evidence |
| Risk | The pseudo-terminal run needs a release binary the CI job may not have built | Medium: the test would skip and the answer path would go unproven | The test resolves the binary with `env!("CARGO_BIN_EXE_bots-ui")` and runs under `cargo test --release`, so cargo builds it, and the test has no skip branch, so a missing binary fails rather than passes |
| Risk | A `cargo clippy` release changes the lint set under a pinned toolchain | Low: the gate fails on a lint the crate never had | The CI job pins the toolchain, and the local run records `cargo clippy --version` in the log |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The three crate gates finish in under 120 s on the CI runner, so the `bots-tui` job stays inside its timeout.
- **NFR-P02**: `crates/bots-tui/README.md` stays under 200 lines, so a reader reaches the keys without scrolling past a manual.

### Security
- **NFR-S01**: No gate command reads a credential or the state root. Every test reads `crates/bots-tui/tests/fixtures/bots`.
- **NFR-S02**: The licence grep covers every file the crate ships that carries code, `src/` and the two Cargo files, and searches for the licence header text rather than the licence name. `README.md` and `design/` name the reference's GPL-3.0 licence by design, so they are outside the grep and a match there is not a failure.

### Reliability
- **NFR-R01**: A failing gate names the file and the line, so a repair needs no second run to locate it.
- **NFR-R02**: The phase is idempotent: running the gates twice prints the same verdict and rewrites no file.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a crate with no integration test target still passes `cargo test` with `running 0 tests`, and the gate reports the count rather than treating an empty run as a pass.
- Maximum input: the 2,000-row pane fixture `004-panes` ships is the largest buffer the gates draw, and `cargo test` runs it inside the default test timeout.
- Failure path: a lint error exits 101 from `cargo clippy`, and the phase records the file and line in `goal.md` rather than lowering `-D warnings`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two files written, one line edited, and repairs limited to what a gate names |
| Risk | 6/25 | No behaviour change, but a repair touches a module another child owns |
| Research | 4/20 | The gates, the defect list and the design reference are all named by the parent |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the README belong to the crate or to the skill? Decision: the crate, because a reader of `crates/bots-tui/` finds it without leaving the crate, and the skill's line points at the verb rather than at the build.
- Should the licence grep run in CI? Decision: no. The grep runs in this phase's gate wave, and the CI job runs fmt, clippy and test only.
- Does the phase fix a lint by changing behaviour? Decision: no. A lint that needs a behaviour change is reported to the child that owns the module, and the phase records the deviation.
- Is `cargo test --doc` in scope? Decision: yes, because `cargo test` runs it by default and a doc example that fails is a gate failure.
<!-- /ANCHOR:questions -->

---
