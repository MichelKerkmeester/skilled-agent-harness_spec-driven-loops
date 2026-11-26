# rust-anything as a Source for sk-code's Rust Standards

Lineage `vibe-1` of the `007-sk-code-rust` fan-out research run.

## 1. Research Metadata

| Field | Value |
|---|---|
| Spec folder | `specs/sk-code/code-surfaces/007-sk-code-rust` |
| Lineage | `vibe-1` |
| Session id | `fanout-vibe-1-1795694320828-so5yva` |
| Loop type | research |
| Stop policy | convergence (threshold 0.05) |
| Iterations run | 6 of a maximum of 8 |
| Terminal stop | `converged` / `all_questions_answered` |
| Questions answered | 5 of 5 |
| Findings recorded | 78 across six iterations |
| Source repository | `/Users/michelkerkmeester/.Trash/rust-anything-main` (read-only) |
| Target surface | `.skilled/skills/sk-code/sk-code-skilled/` |

**Source path note.** The research topic names `specs/z_external-repo-library/rust-anything-main`. That path does not exist in this worktree; `ls` returns "No such file or directory". The only readable copy is `/Users/michelkerkmeester/.Trash/rust-anything-main`, and every rust-anything citation below uses that absolute path. This is recorded as a `missing-dependency` edge case in all six iterations rather than treated as a reason to leave the questions unanswered.

## 2. Executive Summary

rust-anything is a single-crate Rust library plus CLI that ports JavaScript, TypeScript, Python, Go, Java, Kotlin, C#, Ruby, PHP, PowerShell and C code into Rust and proves each port against the original by replaying recorded cases. Its own Rust is app-shaped: one crate, a `lib.rs` with 69 public modules, a thin `main.rs` clap front end, `anyhow` at every layer, and a four-command finish gate.

The sk-code Rust set is binding-shaped. It is written for a napi-rs or WASM binding whose core is consumed by adapters, and it is good at that. Measured against rust-anything's 41 distinct rules, the set **covers none of them, partially covers six, contradicts three, and lacks thirty-two**.

The three contradictions are the highest-value output of this research, because each one is a rule that would flag a correct app-shaped port as a violation:

1. The P0 ban on `anyhow` in exported functions flags rust-anything's own `src/` — 54 of 74 files, 462 call sites — as a failure, when `anyhow` is the right default for a binary.
2. The requirement that core errors use typed `thiserror` enums has no answer for a port whose error text is deliberately not compared.
3. The typed-error rule as written has no scope clause, so it cannot distinguish a shipped public API from a generated port module.

The single most portable rule in the source repository is not about Rust at all: **a documented mapping table must be executable**, so a row that no longer matches the code fails the build (`docs/types.md:16`, `tests/types_doc.rs:1-5`). The second most portable is the **cheat guard** — three named checks that stop a port passing without porting (`docs/how-it-works.md:225-241`).

Four app-style gaps are absent from **both** surfaces and cannot be sourced from rust-anything: terminal rendering (ratatui, crossterm), signal handling, `is_terminal`/`NO_COLOR`, and progress reporting. They must be sourced from the ratatui and crossterm documentation, and this document says so rather than inventing a citation.

Section 11 ranks 25 edits. Ranks 1-6 are P0, 7-14 are P1, 15-25 are P2, and rank 25 names the out-of-source gaps.

## 3. Research Question & Objectives

The run had five key questions:

1. How is rust-anything's own Rust written — `Cargo.toml` lints, edition and `rust-version`, module layout across `src/`, error handling, the clap CLI, serde settings, test layout and fixtures under `tests/`, and the `cargo fmt` / `clippy` / `test` finish gate in its `CLAUDE.md`?
2. What are its record, bridge, diff, bench, shadow and gate method (`docs/how-it-works.md`), `docs/pitfalls.md` and `DECISIONS.md`, and which of them apply to any Rust port checked against an original?
3. How does `docs/types.md` map values across napi-rs, PyO3, the C ABI and the other bridges?
4. How do `skills/rust-anything/SKILL.md` and `whole-app.md` steer a coding agent through a port?
5. For each finding, does the existing sk-code Rust set under `references/rust/` and `assets/checklists/rust-checklist/` cover it, contradict it or lack it, by file and section — and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

The objective is a ranked edit list in which every row names a target sk-code Rust part, the change, and a rust-anything `file:line`.

## 4. Method

Six iterations, each with one focus, each writing an iteration file, a delta, and one record through the append gateway. The reducer refreshed strategy, registry and dashboard after every iteration; the graph upsert built the question-to-finding-to-source coverage graph.

| Iteration | Focus | Findings | newInfoRatio | Status |
|---|---|---|---|---|
| 1 | rust-anything's own Rust (Q1) | 9 | 1.0 | complete |
| 2 | The port method (Q2) | 12 | 1.0 | complete |
| 3 | Value mapping across bridges (Q3) | 10 | 1.0 | complete |
| 4 | How the skill steers an agent (Q4) | 10 | 1.0 | complete |
| 5 | Coverage verdict and app-style gaps (Q5) | 12 | 0.75 | complete |
| 6 | The ranked edit list | 25 | 0.5 | insight |

Evidence came from reading the source repository directly, grepping the sk-code Rust set for each candidate term, and reading the target files' heading listings so every edit row names a section that exists. Every finding carries a `[SOURCE: path:line]` or `[INFERENCE: ...]` marker.

Convergence fired at iteration 6: all five questions answered, source diversity 2.0, evidence depth 2.0, question coverage 1.0, no blockers.

## 5. How rust-anything's Own Rust Is Written (Q1)

**Lints live in the package manifest, not a workspace.** `[lints.rust] unsafe_code = "forbid"` and `[lints.clippy] all = { level = "warn", priority = -1 }` sit in the single crate's own `Cargo.toml` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:42-46]. The sk-code set shows only the workspace form `[workspace.lints.rust]` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md:119] and never a single-crate `[lints.*]` block. **LACKS** for an app-style crate.

**Edition 2024, `rust-version = "1.97"`, and the MSRV read back as a constant.** `pub(crate) const MIN_RUST: &str = env!("CARGO_PKG_RUST_VERSION");` makes the declared MSRV the single source of truth instead of a duplicated string [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:4] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:8] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs:8]. The sk-code set requires edition 2024 and a declared `rust-version` with a 1.85 example [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:40-46], so the declaration is **COVERED**; the `env!("CARGO_PKG_RUST_VERSION")` pattern is **LACKED**.

**A single crate with a lib+bin split.** `src/lib.rs` declares 69 `pub mod` items plus two private modules [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs:10-78], and `src/main.rs` is a thin front end importing twelve library modules [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:21-23]. The sk-code set's only layout is a five-crate workspace whose binary lives in a separate `sidecar` crate [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:235-262]. **LACKS** a single-crate lib+bin layout, which is what a CLI app actually is.

**`anyhow` at every layer.** `anyhow = "1"` is a direct dependency [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:15]; 54 of 74 files in `src/` import it, with 462 `bail!` / `.context(` / `with_context(` call sites. `thiserror` is not a dependency at all — it appears only as a string in the crate-recommendation table [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/crates.rs:227]. The sk-code set makes this a **P0 violation**: "Do not use `anyhow` in pure-core public APIs or exported functions" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:147], and the P1 checklist requires "Core errors use typed `thiserror` enums" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:109]. **CONTRADICTS** for an app-shaped crate: applied literally, the rule flags rust-anything's own `src/` as a P0 failure.

**`serde_json` is configured for bit-exact float parity.** `serde_json = { version = "1", features = ["float_roundtrip", "preserve_order", "unbounded_depth"] }` with the inline comment "float_roundtrip: recorded floats must survive parsing bit for bit" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:28-29]. The sk-code set warns that `serde_json` does not match JavaScript number spelling [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:65] but never names the three features. **LACKS**.

**serde struct conventions are explicit and uniform.** Report enums carry `#[serde(rename_all = "kebab-case")]` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs:25]; optional and empty fields carry `skip_serializing_if` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs:123]; input structs carry `serde(default)` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs:89-116] and `deny_unknown_fields` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs:152]. **LACKS** the attribute convention.

**The clap CLI is derive-first with doc comments as help text.** `#[derive(Parser)]` plus `#[command(name, version, about, after_help)]` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:25-31]; a `#[derive(Subcommand)]` enum whose variant doc comments become subcommand help [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:37-50]; typed args with `value_parser` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:52-54]. **LACKS** — the sk-code set has zero hits for `clap`.

**Test layout is 46 top-level integration files, one shared helper module, and 30 fixture directories.** `tests/` holds 46 entries including `common/mod.rs` and `fixtures/` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/common/mod.rs:1], and `tests/fixtures/` holds 30 language-named directories. The sk-code set mentions integration tests [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:163-164] but not the fixture-tree convention. **PARTIAL**.

**The finish gate is four commands, and one of them is a doc update.** "Before finishing a change: `cargo fmt`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, and update `docs/STATUS.md` when what works changed" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/CLAUDE.md:6-7]. The sk-code set has the three commands [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:78] but not the status-doc clause. **PARTIAL**.

## 6. The Port Method: record, bridge, diff, bench, shadow, gate (Q2)

**The method is a nine-stage pipeline with the original as the source of truth.** `profile → analyze → bridge → record → port.rs → diff → bench → shadow → gate`, and the invariant is stated plainly: "The original stays the source of truth: `record` runs it on edge cases (and your own inputs)" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:7-14] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:16-18]. The sk-code set has a parity section [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:38] but no pipeline. **LACKS**.

**`record` generates deterministic edge-case inputs from parameter types plus per-parameter semantic traps.** The traps named are "string length and case, signed division, overflow edges, float printing, map and sort order", saved to `cases.jsonl` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:38]. The sk-code set requires parity tests [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:236] but not the trap list. **LACKS**.

**`diff` reports where the first difference is, not just that one exists.** Each mismatch carries `return`, `throw` or `call N`, the JSON path such as `$.items[2].name`, the kind of difference, and for text the character with context; distinct differences are grouped under a short stable id [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:40]. **LACKS**.

**`gate` is a composite pass/fail, and two of its clauses have no sk-code equivalent.** The gate covers fmt, clippy `-D warnings`, tests, an `unsafe` audit, nothing unported, a recorded failing case for every error path of the original, no `unwrap`/`expect`/`panic!` where the original returns an error, and the `// INFALLIBLE:` escape [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:42]. The sk-code set has the fmt/clippy/test trio [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:78] and the unwrap denial [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:171] but not the escape marker or the error-path clause. **PARTIAL**.

**The cheat guard is the most transferable rule in the repository: three named checks that stop a port passing without porting.** `literals` fails a port whose own files carry three or more string literals of 8+ characters or numbers of 5+ significant digits that equal a recorded argument or result the original never spells out, with `// recorded-literal: <reason>` as the escape; `tests` fails a port with fewer `#[test]` functions or assertions, or more `#[ignore]`s, than at the last passing gate; `recording` fails a port whose recorded line was edited or removed [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:225-241] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:49]. **LACKS** — and this is the rule that most directly prevents a false pass.

**`shadow` runs both implementations in production, returns the original's result, and never lets a Rust error reach a caller.** `RUST_ANYTHING_MODE=old|shadow|new` selects the mode, and the decision records the reason: "Shipping shadow code must not change behavior; only the report sees Rust" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:44] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:44]. **LACKS**.

**`bench` is deliberately outside `gate`, because speed decides shipping but is not correctness.** "`bench` is a separate step, not part of `gate`. Speed is not correctness, but it decides whether a port should ship: every x18n core port was correct and slower" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:60]. The sk-code set has a benchmarking section [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:218] but not the separation. **PARTIAL**.

**A stale recording fails the gate, so an upstream change cannot pass silently.** `record` saves a fingerprint of the unit's files in `recorded-from.json`; when the original changes, `diff` reports a stale recording and exits non-zero, and `gate` fails until the unit is recorded again [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:318-322] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:262-264]. **LACKS**.

**Corrections the user makes during a port are committed as port rules and injected into every later prompt.** They live in `rust/RULES.md`, one bullet each, added with `rules --add`, and "`go` puts them in `TASK.md`, and the MCP server's prompts and instructions carry them, so every later unit a" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:244-248] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:49]. **LACKS**.

**"Keep the original's shape" is an explicit port rule.** "A port keeps the original's units, names and public API: one crate per unit, the same exported functions and classes, the same arguments and errors. The front door keeps the original's commands and flags. … Change the design after the po" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:310-316]. **LACKS**.

**A pitfall records that a broken port passed because its case was never recorded, and the remedy is to prove the test can fail.** Recording silently drops a case whose result JSON cannot hold; the only input exercising `&#39;` also decoded `&nbsp;`, so a port that wrongly decoded `&#39;` passed [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:112-117]. **LACKS**.

**A pitfall records that a CLI's recorded writes were invisible because the fixture already held them.** "A CLI that regenerates project files was recorded on a project it had just generated, so every case rewrote files with the bytes they already had, and a front door that wrote nothing passed" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:88-93]. **LACKS**.

## 7. Value Mapping Across Bridges (Q3)

**`docs/types.md` is a per-language source-type → port-type table, and the contract is stated up front.** "`bridge` reads each exported function's types from the source and writes the port's signature in `port.rs` from them. This page lists, per language, what a source type becomes there, and whi…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:3-5]. **LACKS** the table shape.

**The port error contract is uniform and untyped: `Result<T, String>`.** "A port function returns `Result<T, String>` and the table gives the `T`; in C it returns `T`, as the C function does" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:10]. The sk-code set requires typed errors [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:109] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:147]. **CONTRADICTS** — but the resolution is a scope clause, not a deletion: `Result<T, String>` is a scaffold convention for generated code whose error text is deliberately not compared, so copying it into sk-code would weaken the typed-error rule.

**`serde_json::Value` is the explicit escape hatch for anything the mapping does not know.** "`serde_json::Value` means the value crosses as JSON as it is: objects, maps, unions of different types and anything the mapping does not know" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:12]. **LACKS**.

**"refused" is a first-class outcome, not a failure.** "`refused` means the function stays in its language. The note is the reason `bridge` prints, where it names the type" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:13]. TypeScript refuses `(x: number) => number` and `RegExp` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:44-46]; Python refuses `*args`/`**kwargs` and decorators [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:88-90]. **LACKS** — and this is the rule that makes a partial port honest instead of silently wrong.

**A defaulted parameter becomes `Option<T>`, with one per-language exception.** "A parameter with a default becomes `Option<T>`, unless the default is a literal Rust can write (a number, `true`/`false` or a plain string), in Python, Ruby, PHP and C#. In TypeScript and JavaScript every parameter w…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:14]. **LACKS**.

**The mapping table is executable, so it cannot drift from the code.** "`cargo test --test types_doc` checks every row against the mapping, so a row that no longer matches the code fails the build" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:16]. The test does it by `include_str!("../docs/types.md")` and iterating the documented rows against `bridge::param_type` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs:1-5] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs:16]. **LACKS** — and this is the most portable single rule in the file, because it applies to any standards document that carries a table.

**The C ABI keeps width and sign through `std::ffi`.** `int` → `std::ffi::c_int`, `long` → `std::ffi::c_long` with the note "32 bits on Windows", `size_t`/`uintptr_t` → `usize`, `ssize_t`/`ptrdiff_t`/`intptr_t` → `isize`, `float` → `f32`, `double` → `f64`, `bool`/`_Bool` → `bool`, and `long double`/`wchar_t` refused as "not a C scalar the bridge knows". Specifiers may come in any order, `const` and `volatile` are ignored, an `enum` is `std::ffi::c_int`, and a project `typedef` of a scalar is that scalar [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:123-152]. The sk-code set has zero hits for `std::ffi`, `c_int` or `c_char`. **LACKS** the C ABI entirely.

**C pointers are mapped by their neighbouring parameter, and every other pointer is refused with a named design question.** `const char *` → `Option<&[u8]>`; a const byte pointer followed by an integer length → `&[u8]` with the length left out of the port; a writable byte pointer with a size → `&mut [u8]`; a pointer to a scalar the function writes → `Option<&mut T>`; `char **` pointing into a string parameter → `Option<&mut Option<usize>>`; a by-value all-scalar struct → a `#[repr(C)]` struct. "Any other pointer, array or function pointer parameter is refused ('ownership must be designed'), and so are any other returned pointer ('who frees it must be designed') and variadic functions" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:154-168]. The sk-code set has zero hits for `repr(C)`. **LACKS** — and the refusal wording is the valuable part, because it turns pointer ownership into a design decision instead of a guess.

**The integer mapping is per source language, not global.** TypeScript `number` → `f64` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:28] while Python `int` → `i64` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:68]. The sk-code set mentions `f64` in 18 files and `i64` in 3, but never frames the choice as a per-source-language decision. **PARTIAL**.

**`docs/types.md` has no PyO3 section, so the topic's premise overstates the source.** The Python section maps Python source types to Rust port types and never names PyO3 [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:64-91]; PyO3 appears only as the Python bridge in the website docs — "Python | PyO3 (abi3), direct conversion, typed exceptions" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/website/pages/en/docs/concepts/bridge.md:27]. The sk-code set also has zero hits for `PyO3`. **CONTRADICTS** the topic's framing: there is no PyO3 value-class mapping to import, only a bridge name. The honest edit is to add a PyO3 bridge row to sk-code's interop model, not a value table.

## 8. How the Skill Steers an Agent Through a Port (Q4)

**The skill opens with an operating contract in two sentences, and it names the completion test.** "rust-anything gives you ground truth; you write the Rust. Port one unit at a time, even when the goal is the whole app, and call a port done only when `gate` passes" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:9-11]. The sk-code `SKILL.md` has surface standards [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:29-164] but no operating contract. **LACKS**.

**The skill is a numbered procedure with explicit stop gates.** Step 1 ends "**Wait for the user's approval of the plan and of the first unit.**" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:88] and step 5 ends "**wait for their go-ahead before the nex…**" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:250]. The sk-code checklist has severity gates [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:62] but no approval gates. **LACKS**.

**The skill names the one file the agent may write, and the command that regenerates the rest.** "Write the port in `src/port.rs` only; `src/lib.rs` and the wrappers are generated. After changing a signature in `port.rs`, run `rust-anything refresh <crate>`" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:107-108]. **LACKS** the write-surface rule.

**Port rules are read before writing and appended the moment the user corrects behaviour.** "Before writing code, run `rust-anything rules <repo>` and follow every rule it lists: behavior the user already corrected in an earlier unit. Each time the user corrects how the port behaves, add it right…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:110-113]. **LACKS**.

**The skill carries a per-source-language trap list that a general Rust standard would never contain.** UTF-16 vs UTF-8 string offsets ("JS and Java index UTF-16 code units, Rust UTF-8 bytes: use `src/utf16.rs`"); `char::is_alphanumeric` taking more than Java's `Character.isLetterOrDigit` or Python's `isalpha`; int-vs-float round-tripping; the regex `\w` ASCII trap [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:115-140]. The sk-code set has a numeric-contract section [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:66] but not the trap list. **LACKS**.

**The skill names the two agent failure modes and forbids them in one line each.** "Add Rust unit tests in `port.rs` for the cases you reason about. `cargo test` passing with no tests proves nothing: the recorded cases are the proof" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:141-142] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:196]. **LACKS**.

**The skill has a stall detector and a prescribed response.** "When `diff` says the port is stalled (its `trend.stalled`: three changes to `port.rs` in a row gained no matching case), stop editing. Show the user the remaining mismatches and ask: they may know the rule you are missing, or decide t…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:205-208]. **LACKS**.

**The skill forbids widening a tolerance to make a mismatch disappear.** "Never widen a tolerance to make a mismatch go away: a difference beyond it is a bug in the port" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:214]. The sk-code set has no float-tolerance rule. **LACKS**.

**`whole-app.md` is a session-spanning protocol built on a claimable map.** "A whole-app port outlasts one session, so `rust/MAP.md` carries it between sessions: the goal, an index of the ADRs in `DECISIONS.md`, every unit of the plan with its state (`open`, `claimed by <session> <date>`, `done`)…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:17-25]. **LACKS**.

**`whole-app.md` opens with a structured interview whose shape is a design tree asked in rounds.** "Interview the user until every decision the port depends on is settled. Map them as a **design tree**: each decision branches into the ones that hang off it. Ask in **rounds**: a round is the whol…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:37-46] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:58-66]. **LACKS**.

## 9. Coverage Verdict Against the sk-code Rust Set (Q5)

The verdict table across iterations 1-4 is **41 findings: 0 covered, 6 partial, 3 contradictions, 32 lacks**. Per iteration: iteration 1 gave 9 findings (0 covered, 3 partial, 1 contradiction, 5 lacks), iteration 2 gave 12 (0, 1, 0, 11), iteration 3 gave 10 (0, 1, 2, 7), iteration 4 gave 10 (0, 1, 0, 9). Iteration 5 added 12 app-style findings and iteration 6 added the 25-row ranked list.

| Verdict | Count | Meaning |
|---|---|---|
| COVERED | 0 | The sk-code set already states the rule |
| PARTIAL | 6 | The set has an adjacent rule but not this one |
| CONTRADICTS | 3 | The set states the opposite, or the topic's premise overstates the source |
| LACKS | 32 | The set has no rule at all |

The three contradictions, in the order they do damage:

1. **`anyhow` at every layer** — sk-code's P0 ban [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:147] versus rust-anything's 462 call sites [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:15]. Resolution: a scope clause, not a deletion.
2. **`Result<T, String>`** — sk-code's typed-error requirement [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:109] versus the port contract [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:10]. Resolution: scope the typed rule to a shipped public API.
3. **No PyO3 section** — the topic assumes a PyO3 value table exists [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/website/pages/en/docs/concepts/bridge.md:27]. Resolution: add a PyO3 bridge row, not a value table.

The six partials are: edition/MSRV declaration, integration-test layout, the fmt/clippy/test trio, the gate's unwrap clause, the benchmarking section, and the per-source-language integer mapping.

## 10. What an App-Style Rust Project Needs That the Set Lacks (Q5, app half)

**No CLI argument design at all.** Zero hits for `clap` across `references/rust/` and `assets/checklists/rust-checklist/`. rust-anything supplies both halves: its own CLI is derive-first with `#[derive(Parser)]`, `#[command(name, version, about, after_help)]`, a `#[derive(Subcommand)]` enum [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:25-107], and `docs/whole-apps.md` states the front-door rule [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:134-136].

**No terminal rendering, and rust-anything does not supply it either.** Zero hits for `ratatui` and `crossterm` in the sk-code set; the only `terminal` matches are "terminal key" in sort-comparator prose [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md:253]. rust-anything's own output is plain `writeln!` through a `say!` macro [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:6-11]. **Out-of-source gap.**

**No exit-code contract for a binary.** The only mention is inside a sidecar-protocol rule: "Sidecar protocols must define framing, encoding, field order, newline behavior, exit codes, and stderr behavior" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md:363]. rust-anything's trycmd cases carry the exit code [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:136] and its front door maps errors to codes [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:108-109].

**No signal handling, and rust-anything does not supply it either.** Zero hits for `signal`, `SIGINT` or `Ctrl-C`. rust-anything's nearest rule is about child processes, not signals: "Run every outside program through `crate::process`, which closes stdin and stops it at a…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:77-79]. **Out-of-source gap.**

**No stdout/stderr split rule.** Zero hits for `stdout` or `stderr` outside the sidecar line. rust-anything has a hard-won rule: "A test command's output corrupted the MCP stream. The child wrote to the server's stdout. Send every child's stdout to stderr or a pipe, never…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:65-67].

**No `is_terminal` or `NO_COLOR` rule, and rust-anything does not supply it either.** Zero hits for both. **Out-of-source gap.**

**No progress-reporting rule, and rust-anything does not supply it either.** Zero hits for `progress`. **Out-of-source gap.**

**No size budget for a port, which matters more for an app than for a binding.** rust-anything's gate fails a port "at most 3x the original's lines plus 50 for imports and signatures (over that, use the crates `analyze` lists and fold repeated code)" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:243-245].

**No CLI golden-case format, and rust-anything's is directly reusable.** rust-anything's app cases are trycmd files in `rust/app-cases/`: "`<case>.toml` (argv, env, exit code), `.stdin`, `.stdout`, `.stderr`, `.in/` (files in) and `.out/` (files written). Read and edit t…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:98-100].

**No rule that a replay report is a committed CI artifact.** rust-anything commits `replay-report.md` and runs `git diff --exit-code rust/app-cases/replay-report.md` in CI, so "a half-ported app fails CI on any change in what passes, better or worse, until the report is…" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:120-123].

**No fallback-rate metric, which is the only progress signal a half-ported app has.** rust-anything's front door counts each fallback to the original and reports the rate, and `app replay` reports it for any build that appends to `RUST_ANYTHING_FALLBACK_LOG` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:110-112] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:136-138].

## 11. Recommendations — the Ranked Edit List

Ranked by verdict severity first (contradictions, then P0, then P1, then P2), because that is the order in which a wrong rule does damage. Every row names the target sk-code Rust part, the change, and the rust-anything source line.

| Rank | Target sk-code Rust part | Change | rust-anything source |
|---|---|---|---|
| 1 | `references/rust/quality-standards/docs-errors-and-async.md` §Typed Core Errors (line 126) | Add a scope clause: the typed-error rule governs a shipped public API consumed by adapters; a generated or scaffolded port module may use `anyhow` or `Result<T, String>` internally provided the exported function maps to the typed error | `docs/types.md:10`, `Cargo.toml:15` |
| 2 | `assets/checklists/rust-checklist/p1-required.md` §Complete Rust Quality Gate (line 158) | Add the three cheat-guard checks — `literals`, `tests`, `recording` — with `// recorded-literal: <reason>` as the escape | `docs/how-it-works.md:225-241`, `DECISIONS.md:49` |
| 3 | `references/rust/quality-standards/determinism-and-parity.md` §Acceptance Standard (line 36) | Add the `refused` verdict: a function whose types cannot be faithfully bridged stays in the original language with the reason recorded, and list the refusal classes | `docs/types.md:13`, `docs/types.md:44-46` |
| 4 | `references/rust/quick-reference/overview-and-boundary-template.md` §2 (line 59) | Add an executable source-type → Rust-type table with the `serde_json::Value` fallback and the `Option<T>` default rule, plus a test that reads the document and checks every row | `docs/types.md:3-5`, `docs/types.md:12`, `docs/types.md:16`, `tests/types_doc.rs:1-5` |
| 5 | `references/rust/style-guide/interop-model.md` §2 (line 35) | Add the C ABI value mapping: the `std::ffi` width-and-sign table, the pointer-by-neighbour rule, and the two refusal wordings | `docs/types.md:123-152`, `docs/types.md:154-168` |
| 6 | `SKILL.md` §4 SURFACE STANDARDS (line 125) | Add the two-sentence operating contract naming the completion test, and the two stop gates | `skills/rust-anything/SKILL.md:9-11`, `:88`, `:250` |
| 7 | `references/rust/quality-standards/build-and-organization.md` §Edition, Toolchain, and MSRV (line 36) | Add the single-crate `[lints.rust]`/`[lints.clippy]` block and the `env!("CARGO_PKG_RUST_VERSION")` single-source pattern | `Cargo.toml:42-46`, `src/lib.rs:8` |
| 8 | `references/rust/quality-standards/build-and-organization.md` §Workspace Layout (line 228) | Add a single-crate lib+bin layout beside the existing five-crate workspace | `src/lib.rs:10-78`, `src/main.rs:21-23` |
| 9 | `references/rust/quality-standards/determinism-and-parity.md` §Serialized Output (line 190) | Add the serde parity settings (`float_roundtrip`, `preserve_order`, `unbounded_depth`) and the attribute convention (`rename_all`, `skip_serializing_if`, `serde(default)`, `deny_unknown_fields`) | `Cargo.toml:28-29`, `src/analyze.rs:25`, `src/app.rs:152` |
| 10 | `references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136) | Add the `tests/fixtures/` tree convention and the trycmd CLI case format | `docs/whole-apps.md:98-100` |
| 11 | New file `references/rust/quality-standards/cli-and-app-shape.md` | Cover clap derive conventions, the exit-code contract, the stdout/stderr split, `is_terminal`/`NO_COLOR`, and progress reporting | `src/main.rs:25-107`, `docs/whole-apps.md:134-136`, `docs/pitfalls.md:65-67` |
| 12 | `assets/checklists/rust-checklist/p1-required.md` §Complete Rust Quality Gate (line 158) | Scope the `unwrap`/`expect`/`panic!` denial to "where the original returns an error", add the `// INFALLIBLE: <why>` marker, and add the 3x-plus-50 line budget | `docs/how-it-works.md:42`, `skills/rust-anything/SKILL.md:243-245` |
| 13 | `references/rust/quality-standards/determinism-and-parity.md` §Required Parity Test Inventory (line 238) | Add the recording fingerprint that fails the gate when the original changed, and the committed replay report checked with `git diff --exit-code` in CI | `docs/how-it-works.md:318-322`, `docs/whole-apps.md:120-123` |
| 14 | `references/rust/quality-standards/build-and-organization.md` §Benchmarking (line 214) | Add that a port is timed against the original before it ships, and that speed is not correctness so the timing is a separate gate | `DECISIONS.md:60` |
| 15 | `references/rust/quick-reference/naming-ordering-and-signatures.md` | Add "keep the original's shape": a port keeps the original's units, names and public API, and design changes wait until after the port matches | `docs/how-it-works.md:310-316` |
| 16 | `references/rust/quality-standards/build-and-organization.md` §Required Verification (line 119) | Add that a change which alters observable behaviour updates the status document in the same change | `CLAUDE.md:6-7` |
| 17 | `references/rust/quality-standards/determinism-and-parity.md` §Numeric Contracts (line 51) | Add that a tolerance forgives rounding only, never formatting, and that widening it to hide a mismatch is a bug in the port | `skills/rust-anything/SKILL.md:214` |
| 18 | `references/rust/quality-standards/determinism-and-parity.md` §Required Parity Test Inventory (line 238) | Add "prove the check can fail" and the fixture-staleness rule | `docs/pitfalls.md:112-117`, `docs/pitfalls.md:88-93` |
| 19 | `references/rust/quality-standards/determinism-and-parity.md` §Acceptance Standard (line 36) | Add the shadow-mode staged rollout: a port may ship returning the original's result and never letting a Rust error reach a caller before it is switched on | `docs/how-it-works.md:44`, `DECISIONS.md:44` |
| 20 | `references/rust/quality-standards/determinism-and-parity.md` §Numeric Contracts (line 51) | Add the per-source-language trap list: UTF-16 vs UTF-8 offsets, `is_alphanumeric` vs `isLetterOrDigit` vs `isalpha`, int-vs-float round-tripping, the regex ASCII trap | `skills/rust-anything/SKILL.md:115-140` |
| 21 | `references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136) | Add the stall detector: three consecutive edits with no newly matching case means stop editing and surface the remaining mismatches | `skills/rust-anything/SKILL.md:205-208` |
| 22 | `references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136) | Add the port-rules file: a correction the user makes during a port is committed as one bullet and read before the next unit | `docs/how-it-works.md:244-248`, `skills/rust-anything/SKILL.md:110-113` |
| 23 | `references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136) | Add the session map and claim protocol: per-unit state of `open`, `claimed by <session> <date>`, or `done`, claimed before starting | `skills/rust-anything/whole-app.md:17-25` |
| 24 | `references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136) | Add the design-tree interview: a whole-app port opens with an interview asked in rounds, each question numbered with a recommended answer | `skills/rust-anything/whole-app.md:37-46` |
| 25 | The out-of-source gaps | Terminal rendering (ratatui, crossterm), signal handling, `is_terminal`/`NO_COLOR` and progress reporting are absent from both surfaces. Source them from the ratatui and crossterm documentation; no rust-anything line can fill them | none — see §10 |

**Reading the list.** Ranks 1-6 are P0: three contradictions resolved by scope clauses and three rules that prevent a false pass. Ranks 7-14 are P1: the app-shape and parity machinery a CLI needs. Ranks 15-25 are P2: process discipline and polish. Rank 25 is the only row with no rust-anything source, and it says so.

**Two parent-run completion criteria depend on this list.** The `grep -rl` criterion over `references/rust` for `clap`, `ratatui` and `crossterm` is satisfied by rank 11 for `clap` and by rank 25 for `ratatui` and `crossterm` — but rank 25 sources them from outside rust-anything, so the criterion's "or research.md names why one is absent" clause is the one that applies to those two. The SKILL.md version bump above 2.2.3.0 plus a matching changelog entry is not itself a research finding; it is the bookkeeping the parent run must do when it applies rank 6.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Reading `specs/z_external-repo-library/rust-anything-main` directly | The path does not exist in this worktree; `ls` returned "No such file or directory". Fell back to the Trash copy rather than leaving the question unanswered | `ls` output; every citation uses the Trash path | 1 |
| Searching the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `float_roundtrip`, `preserve_order`, `deny_unknown_fields`, `tests/fixtures`, `integration test` | All returned zero files. Confirmed absences, not search misses, so later iterations need not re-run them | zero-hit greps | 1 |
| Resolving the `anyhow` contradiction by weakening the sk-code rule | The sk-code rule is correct for a binding core; the finding is a scope gap, not a sk-code error | `docs-errors-and-async.md:147` vs `Cargo.toml:15` | 1 |
| Searching the sk-code Rust set for `shadow`, `stale`, `RULES.md`, `known-diffs`, `recorded-literal`, `fingerprint` | All zero. Confirmed absences | zero-hit greps | 2 |
| Reading `docs/whole-apps.md` during iteration 2 | It is the whole-app frame, which belongs to Q4's steering question and Q5's app-style gap. Deferred rather than read shallowly | — | 2 |
| Treating the `// INFALLIBLE:` marker as a contradiction of sk-code's clippy denial | The two are compatible (deny by default, mark the exception), so it is a missing escape hatch, not a conflict | `docs/how-it-works.md:42` | 2 |
| Searching the sk-code Rust set for `std::ffi`, `c_int`, `c_char`, `repr(C)`, `PyO3`, `serde_json::Value`, `refused` | All zero. Confirmed absences | zero-hit greps | 3 |
| Reading the Go, Java, Kotlin, C#, Ruby, PHP and PowerShell sections of `docs/types.md` in full | Their headings confirm the same table shape, and the C section already supplies the ABI-width lesson. Seven more tables would have spent the budget without changing a verdict | `docs/types.md` headings | 3 |
| Searching `docs/types.md` for PyO3 | Zero hits. The bridge name lives in the website docs only | `website/pages/en/docs/concepts/bridge.md:27` | 3 |
| Copying `Result<T, String>` into sk-code as a rule | It is a scaffold convention for generated code whose error text is deliberately not compared; copying it would weaken the typed-error rule | `docs/types.md:10` | 3 |
| Searching the sk-code Rust set for `ask the user`, `wait for`, `approval`, `go-ahead` | Only the checklist severity legend matched. Confirmed absence of stop gates | zero-hit greps | 4 |
| Reading `docs/whole-apps.md` (347 lines) during iteration 4 | `skills/rust-anything/whole-app.md` is the agent-facing steering document the question names and already carries the map, claim protocol and interview | — | 4 |
| Treating the stop gates as a conflict with sk-code's autonomous workflow doctrine | sk-code's doctrine governs its own implement/debug/verify loop, not a port against an external original, so the gates are a missing construct | `skills/rust-anything/SKILL.md:88` | 4 |
| Claiming rust-anything supplies a ratatui or signal standard | It does not, and saying so would have produced a false edit target. Both are recorded as gaps in both surfaces | `src/main.rs:6-11` | 5 |
| Searching the sk-code Rust set for `ratatui`, `crossterm`, `clap`, `signal`, `SIGINT`, `Ctrl-C`, `is_terminal`, `NO_COLOR`, `progress` | All zero. Confirmed absences | zero-hit greps | 5 |
| Searching the sk-code Rust set for `tty` | 21 files matched, but every hit is the substring inside "pretty". Recorded so a later iteration does not mistake it for terminal coverage | grep output | 5 |
| Reading `docs/whole-apps.md` §Servers and §Libraries in full | The CLI frame in §Port a whole app already supplies the app-style findings; the server and library frames repeat the same replay and fallback machinery | — | 5 |
| Inventing a rust-anything source line for ratatui, signals, `is_terminal` or progress | None exists, so rank 25 names them as out-of-source rather than fabricating a citation | — | 6 |
| Ranking by file instead of by verdict | The topic asks for a ranked list, and a file-ordered list would bury the three contradictions under the 32 lacks | — | 6 |

## Divergence Map

The registry records no pivots for this lineage: `started`, `completed`, `failed`, `overrides` and `saturatedDirections` are all empty, and `remainingFrontier` is empty. The run was a single-track investigation of five pre-declared questions, not a divergent search, so there is no pivot lineage to report.

| Field | Value |
|---|---|
| Completed pivots | 0 |
| Failed pivots | 0 |
| Audited overrides | 0 |
| Saturated directions | none |
| Remaining frontier | none |

**Directions that saturated.** All five key questions reached full coverage by iteration 5, and iteration 6 was a synthesis pass rather than new evidence gathering. The two directions that saturated earliest were the sk-code absence greps (iterations 1, 2, 3 and 5 each confirmed a block of zero-hit terms) and the `docs/types.md` per-language tables (iteration 3 established the shape from the TypeScript, Python and C sections and declined to read seven more).

**Breadth caveat.** This map documents that the run did not broaden its frontier, not that the topic is exhausted. A divergent run would have opened adjacent questions — how ratatui and crossterm document terminal layout, what the napi-rs and WASM parity rules already say about the same value classes, whether sk-code's non-Rust surfaces carry a CLI standard worth restating. None of those were investigated, and rank 25 names the first as out-of-source.

## Open Questions

None of the five key questions remains open. Four narrower questions were opened by the evidence and deliberately left for the parent run or a later lineage:

1. **Where should the ratatui, crossterm, signal, `is_terminal`/`NO_COLOR` and progress rules come from?** They are absent from both surfaces. The next evidence needed is the ratatui and crossterm documentation, plus a decision on whether sk-code's Rust set should carry terminal guidance at all or defer to a separate surface.
2. **Does sk-code's napi-rs and WASM parity material already cover the value classes that rank 4 and rank 5 would add?** Decision D4 freezes those rules' meaning, so the edit must not restate them. The next evidence needed is a read of the existing napi-rs and WASM parity sections against the `docs/types.md` table.
3. **Should rank 11 be a new file or a section inside an existing one?** The ranked list proposes `cli-and-app-shape.md` because the content spans five topics that do not belong together in any current file. The next evidence needed is the router and reference-index conventions, which this lineage did not read.
4. **Does the `grep -rl` completion criterion intend `clap`, `ratatui` and `crossterm` to be sourced from rust-anything?** Rank 25 establishes that two of the three cannot be. The criterion's "or research.md names why one is absent" clause covers it, but the parent run should confirm that reading before treating the criterion as met.

## Risks & Caveats

- **The source path in the topic is wrong.** Every citation uses `/Users/michelkerkmeester/.Trash/rust-anything-main`. If that copy differs from the intended `specs/z_external-repo-library/rust-anything-main`, line numbers may not transfer. The parent run should re-verify a sample of citations against the canonical copy before applying edits.
- **The Trash copy is not a stable reference.** A Trash directory can be emptied. The findings are durable in this document and in the iteration files, but the citations are not re-checkable once the copy is gone.
- **The verdict counts are per finding, not per rule.** Several findings restate the same underlying rule from different angles (the cheat guard appears in iterations 2 and 6; the `refused` verdict in iterations 3 and 6). The 41-finding tally in §9 counts findings, so it overstates the number of distinct rules by roughly a third.
- **Rank 25 is the only row without a rust-anything source.** It is included because the topic explicitly asks what an app-style project needs that the set lacks, and four of those needs have no source in either repository. Treating it as a sourced edit would be a misreading.
- **No edit was applied.** This is research output. The ranked list names targets and changes; applying them, bumping `SKILL.md` above 2.2.3.0, adding the changelog entry and running `verify-router-sync.cjs` are the parent run's work.
- **The `anyhow` contradiction is a scope question, not a correctness question.** Ranks 1 and 12 both resolve by narrowing a rule rather than deleting it. A reader who applies rank 1 as "allow `anyhow` everywhere" has inverted its meaning.

## Appendix: Convergence Report

- Stop reason: `converged` / `all_questions_answered`
- Total iterations: 6 of a maximum of 8
- Questions answered: 5 / 5
- Remaining questions: 0 tracked; 4 narrower questions opened by the evidence and listed in Open Questions
- Last 3 iteration summaries:
  - Iteration 4 — how `SKILL.md` and `whole-app.md` steer an agent: the operating contract, the two stop gates, the write-surface rule, the port-rules file, the per-language trap list, the stall detector, the tolerance ban, the session map and the design-tree interview. 10 findings, ratio 1.0.
  - Iteration 5 — the coverage verdict and the app-style gaps: 41 findings tallied as 0 covered / 6 partial / 3 contradictions / 32 lacks, plus eleven app-style gaps of which four are out-of-source. 12 findings, ratio 0.75.
  - Iteration 6 — the ranked edit list: 25 rows, each naming a target sk-code part, the change and a rust-anything source line. 25 findings, ratio 0.5, status `insight`.
- Convergence threshold: 0.05
- Convergence signals at stop: question coverage 1.0, claim verification rate 1.0, contradiction density 0.0, source diversity 2.0, evidence depth 2.0, composite score 0.86
- Quality guards: source diversity passed, focus alignment passed, single-weak-source `notEvaluated`
- Graph at stop: 117 nodes, 204 edges, no blockers
- Divergence summary: no pivots taken, no saturated directions, no remaining frontier — see Divergence Map
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report

## References

**rust-anything (read-only source, `/Users/michelkerkmeester/.Trash/rust-anything-main`)**

- `Cargo.toml:4`, `:8`, `:15`, `:28-29`, `:42-46`
- `src/lib.rs:8`, `:10-78`
- `src/main.rs:6-11`, `:21-23`, `:25-107`
- `src/analyze.rs:25`, `:49`, `:123`, `:126`
- `src/app.rs:89-116`, `:152`
- `src/crates.rs:227`
- `tests/common/mod.rs:1`
- `tests/types_doc.rs:1-5`, `:16`
- `docs/how-it-works.md:7-14`, `:16-18`, `:38`, `:40`, `:42`, `:44`, `:225-241`, `:244-248`, `:262-264`, `:310-316`, `:318-322`
- `docs/types.md:3-5`, `:10`, `:12`, `:13`, `:14`, `:16`, `:28`, `:44-46`, `:64-91`, `:68`, `:88-90`, `:123-152`, `:154-168`
- `docs/whole-apps.md:98-100`, `:108-109`, `:110-112`, `:120-123`, `:134-136`, `:136-138`
- `docs/pitfalls.md:65-67`, `:77-79`, `:88-93`, `:112-117`
- `DECISIONS.md:44`, `:49`, `:60`
- `CLAUDE.md:6-7`
- `skills/rust-anything/SKILL.md:9-11`, `:88`, `:107-108`, `:110-113`, `:115-140`, `:141-142`, `:196`, `:205-208`, `:214`, `:243-245`, `:250`
- `skills/rust-anything/whole-app.md:17-25`, `:37-46`, `:58-66`
- `website/pages/en/docs/concepts/bridge.md:27`

**sk-code Rust set (`.skilled/skills/sk-code/sk-code-skilled/`)**

- `SKILL.md:29-164`, `:125`
- `references/rust/quality-standards/build-and-organization.md:40-46`, `:78`, `:119`, `:136`, `:163-164`, `:214`, `:218`, `:228`, `:235-262`
- `references/rust/quality-standards/determinism-and-parity.md:36`, `:38`, `:51`, `:65`, `:66`, `:190`, `:236`, `:238`
- `references/rust/quality-standards/docs-errors-and-async.md:126`, `:147`
- `references/rust/quality-standards/modeling-collections-and-api.md:363`
- `references/rust/style-guide/interop-model.md:35`
- `references/rust/style-guide/formatting-and-imports.md:253`
- `references/rust/quick-reference/overview-and-boundary-template.md:59`
- `references/rust/quick-reference/naming-ordering-and-signatures.md`
- `references/rust/quick-reference/rustdoc-and-cargo.md:119`
- `assets/checklists/rust-checklist/overview-and-p0-parity.md:62`
- `assets/checklists/rust-checklist/p1-required.md:109`, `:158`, `:171`

**Lineage artifacts**

- `iterations/iteration-001.md` … `iteration-006.md`
- `deltas/iter-001.jsonl` … `iter-006.jsonl`
- `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`

`resource-map.md` was not present at init (`resource_map_present: false`), so no resource-map citation is made.
