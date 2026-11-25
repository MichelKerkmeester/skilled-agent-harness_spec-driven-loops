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
| **Handoff Criteria** | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` exit 0 in `crates/bots-tui`; the licence grep finds no GPL text and no copied openhuman code; `crates/bots-tui/README.md` names the build, the run, every bound key and the design reference; `validate.sh --strict` prints `RESULT: PASSED` for this child, which is the last of the six and so the row the parent's `--recursive` run reads last |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: This phase writes two files, `crates/bots-tui/README.md` and one line in `.skilled/skills/system-skilled-bots/SKILL.md`, and repairs only the lines a gate names. It adds no module, no option and no dependency.

**Dependencies**:
- `002-architecture-and-contracts` for the crate, the fixture and the `bots-tui` CI job this phase reads.
- `003-shell-and-navigation` for `keys.rs`, `theme.rs` and the shell views the key and glyph checks read.
- `004-panes` for `sanitize.rs` and `view/panes.rs`, which carry two of the eight defect fixes.
- `005-answer-flow` for `view/overlay.rs`, which carries the free-text fix, and for the hand proof this phase does not repeat.

**Deliverables**:
- One gate run over the crate: formatter, linter, crate suite and runtime suite.
- One licence proof: MIT in the manifest, no GPL text, no copied openhuman code, and every design pointer resolving.
- One crate README: build, run, keys, glyphs with the ASCII fallback, the design reference and the no-code statement.
- One hub line naming `bots ui` as a status surface, with the mirror proof.
- One defect audit: eight checks, one per defect the expansion fixes.
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
- Prove the licence boundary: `license = "MIT"` in the manifest, no GPL header anywhere in the crate, no copied openhuman function, and every `file:line` pointer in `design/` resolving to a real line.
- Write `crates/bots-tui/README.md`: the build command, the run command, every bound key, the eight glyphs with their ASCII fallback, the design reference and the statement that no code or text was copied.
- Name `bots ui` as a status surface in one line in `.skilled/skills/system-skilled-bots/SKILL.md`, and prove the `.opencode/skills` mirror is a symlink so the line lands once.
- Audit the eight defects the expansion fixes, one command per defect, so the hardening claim is evidence rather than assertion.
- Read the `bots-tui` CI job and report a gate set that differs from the local one, without editing the workflow.
- Validate this child with `--strict`, which is the row the parent's `--recursive` run reads last.

### Out of Scope
- The `bots-tui` CI job and its toolchain step - `002-architecture-and-contracts` owns `.github/workflows/bots-runtime.yml`, so this phase reads the job and reports a mismatch rather than editing it.
- The hand proof and the closed-input test - `005-answer-flow` owns both, and the parent's handoff row names them as its exit.
- Any new module, option or dependency - this phase adds no behaviour, and a gate that needs a behaviour change is reported to the child that owns the module.
- `THIRD_PARTY_NOTICES.md` - no third-party code is copied, so there is nothing to notice; the design reference is recorded in the crate README instead.
- The design mockups and the screenshots - `001-ux-and-component-map` owns `design/`, and this phase reads it for the pointer check and links it from the README.
- A `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out, and none is needed to prove a gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/README.md` | Create | Build, run, keys, glyphs with the ASCII fallback, the design reference and the no-code statement |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | One line naming `bots ui` as a status surface |
| `crates/bots-tui/src/**` | Modify | Only the file and line a gate names: a formatting change, a lint fix, or a test the suite reports |
| `crates/bots-tui/tests/**` | Modify | Only the test a gate names, and never a lowered assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0, so every module and test file the five children wrote is formatted, and the run rewrites no file. |
| REQ-002 | `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0, so the library, the binary, the integration tests and the doc examples are lint-clean at the deny level rather than at the default warn level. |
| REQ-003 | `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`, including the doc tests `cargo test` runs by default. |
| REQ-004 | `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1` prints `"license":"MIT"`, and `rg -n 'GNU GENERAL PUBLIC LICENSE\|GPL-3' crates/bots-tui` matches nothing, so no file the crate ships carries the design reference's licence. [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] |
| REQ-005 | `rg -n 'openhuman' crates/bots-tui/src` matches only comment lines that name the design reference, and no file in the crate carries a copied openhuman function. The crate takes the RAII terminal guard, the minimum-size screen, the footer key line, the banner above the input and the System and Mono palettes as design, and writes each in its own words. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/terminal.rs:75-118] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:26-35] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:99] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:221-229] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82] |
| REQ-006 | `crates/bots-tui/README.md` names the release build command, the run command, every bound key the key table carries, the eight glyphs with their ASCII fallback, openhuman as the design reference with its GPL-3.0 licence, and the statement that no code or text was copied. The key list includes `[` and `]` beside Alt+1..4 and Ctrl+C beside Ctrl+D, because those are the bindings the expansion adds. |
| REQ-007 | Each of the eight defects the parent's §6 lists carries one check in `tasks.md`'s Defect Audit table, and every check prints its expected output. The checks are greps and suite runs, so the audit needs no terminal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:210] |
| REQ-008 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`, so this child's own documents are complete and consistent. The parent's `--recursive` run is the parent's closure step, not this child's, because it fails on the five sibling scaffolds until each of them is written. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`, so the `ui` verb's tests still pass after the crate's repairs. |
| REQ-010 | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line naming the verb as a status surface, and `test -L .opencode/skills` exits 0, so the edited line lands once rather than in two copies. |
| REQ-011 | Every `file:line` pointer in `crates/bots-tui/design/` resolves to a real line in the cited source under `specs/system-skilled-bots/context/`, and the folder names openhuman as the design reference with its GPL-3.0 licence. A pointer that dangles is a broken citation, not a design note. |
| REQ-012 | The `bots-tui` job in `.github/workflows/bots-runtime.yml` runs the same three gates this phase runs, and `rg -c 'bots-tui' .github/workflows/bots-runtime.yml` prints 3. A job that runs a different gate set is reported to `002-architecture-and-contracts` and recorded in `goal.md`, never edited here. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` all exit 0 in `crates/bots-tui`, and the runtime suite prints no `failed`.
- **SC-002**: `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui` prints nothing, `cargo metadata` prints `"license":"MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
- **SC-003**: `crates/bots-tui/README.md` names the build command, the run command, every bound key, the eight glyphs with their ASCII fallback, and openhuman as the design reference with no code copied.
- **SC-004**: the eight rows of the Defect Audit table each print their expected output, so every defect the expansion fixes has a check that passes.
- **SC-005**: `validate.sh --strict` on this child prints `RESULT: PASSED`, and the parent's `--recursive` run reads this child's line last.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003`, `004` and `005` land the modules and tests this phase gates | High: a missing target makes a gate fail on a path rather than on a defect | The gate runs against whatever exists and reports the missing target by name; the phase does not pass a gate it could not run |
| Dependency | `002` lands the crate, the fixture and the `bots-tui` CI job | Medium: no manifest means no gate | The measured-behavior block records the absent manifest, and the phase starts only after 002's handoff row passes |
| Risk | A gate failure tempts a rewrite of a module another child owns | High: a behaviour change in a hardening phase is invisible to the child that owns the module | Repair only the line the gate names, and record a deviation in `goal.md` when the repair changes behaviour |
| Risk | The GPL grep is a text match, so a paraphrased copy passes it | Medium: the licence proof would be weaker than it reads | Pair the grep with the design-pointer check and a human read of the diff, and say in the log that the pair is the evidence |
| Risk | A `cargo clippy` release changes the lint set under a pinned toolchain | Low: the gate fails on a lint the crate never had | The CI job pins the toolchain, and the local run records `cargo clippy --version` in the log |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The three crate gates finish in under 120 s on the CI runner, so the `bots-tui` job stays inside its timeout.
- **NFR-P02**: `crates/bots-tui/README.md` stays under 200 lines, so a reader reaches the keys without scrolling past a manual.

### Security
- **NFR-S01**: No gate command reads a credential or the state root; every test reads `crates/bots-tui/tests/fixtures/bots`.
- **NFR-S02**: The licence grep covers every file the crate ships, including `design/`, `tests/` and `Cargo.toml`, not only `src/`.
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: A failing gate names the file and the line, so a repair needs no second run to locate it.
- **NFR-R02**: The phase is idempotent: running the gates twice prints the same verdict and rewrites no file.

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
- Should the licence grep run in CI? Decision: yes, as a step in `002`'s `bots-tui` job; this phase proves the command and 002 owns the job.
- Does the phase fix a lint by changing behaviour? Decision: no. A lint that needs a behaviour change is reported to the child that owns the module, and the phase records the deviation.
- Is `cargo test --doc` in scope? Decision: yes, because `cargo test` runs it by default and a doc example that fails is a gate failure.
<!-- /ANCHOR:questions -->

---
