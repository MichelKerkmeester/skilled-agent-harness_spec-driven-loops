# Iteration 1: How rust-anything's own Rust is written

## Focus

Key question 1: Cargo.toml lints, edition and rust-version, module layout across `src/`, error handling, the clap CLI, serde settings, test layout and fixtures under `tests/`, and the `cargo fmt` / `cargo clippy` / `cargo test` finish gate in `CLAUDE.md`. For each item, whether the sk-code Rust set covers it, contradicts it or lacks it.

**Source path note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist in this worktree. The only readable copy is `/Users/michelkerkmeester/.Trash/rust-anything-main`; every rust-anything citation below uses that absolute path so the claim can be checked. This is recorded as a missing-dependency edge case.

## Actions Taken

1. Read `Cargo.toml` and `CLAUDE.md` end to end.
2. Listed `src/` (74 entries) and `tests/` (46 entries) and read `src/lib.rs` and `src/main.rs`.
3. Counted error-handling and serde-attribute usage across `src/*.rs`.
4. Grepped the sk-code Rust set for each rust-anything practice to classify cover / contradict / lack.

## Findings

1. **rust-anything pins its lint policy inside the single crate's own manifest, not a workspace.** `[lints.rust] unsafe_code = "forbid"` and `[lints.clippy] all = { level = "warn", priority = -1 }` sit in the package manifest itself. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:42-46] The sk-code set shows only the workspace form `[workspace.lints.rust]` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md:119] and never shows a single-crate `[lints.*]` block. **LACKS** for an app-style crate.

2. **Edition 2024 and `rust-version = "1.97"`, with the MSRV read back as a compile-time constant.** `pub(crate) const MIN_RUST: &str = env!("CARGO_PKG_RUST_VERSION");` makes the declared MSRV the single source of truth instead of a duplicated string. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:4] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:8] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs:8] The sk-code set requires edition 2024 and a declared `rust-version` with a 1.85 example [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:40-46], so the declaration is **COVERED**; the `env!("CARGO_PKG_RUST_VERSION")` single-source pattern is **LACKED**.

3. **A single crate with a lib+bin split, not a workspace.** `src/lib.rs` declares 69 `pub mod` items plus two private modules (`mime`, and `js_number` behind `#[cfg(test)]`) [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs:10-78], and `src/main.rs` is a thin front end that imports `rust_anything::{analyze, app, app_shadow, bridge, drift, front_door, gate, harness, lift, mcp, report, shadow}` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:21-23]. The sk-code set's only layout is a five-crate workspace whose binary lives in a separate `sidecar` crate [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:235-262]. **LACKS** a single-crate lib+bin layout, which is what a CLI app actually is.

4. **Error handling is `anyhow` at every layer, not only at `main`.** `anyhow = "1"` is a direct dependency [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:15]; 54 of the 74 files in `src/` import it, and `src/*.rs` carries 462 `bail!` / `.context(` / `with_context(` call sites. `thiserror` is not a dependency at all — it appears only as a string in the crate-recommendation table [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/crates.rs:227]. The sk-code set makes this a **P0 violation**: "Do not use `anyhow` in pure-core public APIs or exported functions" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:147], and the P1 checklist requires "Core errors use typed `thiserror` enums" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:109]. **CONTRADICTS** for an app-shaped crate: the sk-code rule is written for a binding whose core is consumed by adapters, and applied literally it flags rust-anything's own `src/` as a P0 failure.

5. **`serde_json` is configured for bit-exact float parity.** `serde_json = { version = "1", features = ["float_roundtrip", "preserve_order", "unbounded_depth"] }` with the inline comment "float_roundtrip: recorded floats must survive parsing bit for bit." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:28-29] The sk-code set warns that `serde_json` does not match JavaScript number spelling [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:65] but never names the `float_roundtrip` feature, `preserve_order` or `unbounded_depth`. **LACKS** the feature-flag remedy for the hazard it already names.

6. **serde struct conventions are explicit and uniform.** Report enums carry `#[serde(rename_all = "kebab-case")]` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs:25] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs:49]; optional and empty fields carry `skip_serializing_if` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs:123] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs:126]; input fields carry `#[serde(default)]` for forward compatibility [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs:89-116]; and the config struct carries `#[serde(deny_unknown_fields)]` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs:152]. The sk-code set has zero hits for `deny_unknown_fields`, `skip_serializing_if` or `rename_all`. **LACKS** the whole serde-attribute convention.

7. **The clap CLI is derive-first with doc comments as help text.** `#[derive(Parser)]` plus `#[command(name, version, about, after_help)]` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:25-31]; a `#[derive(Subcommand)]` enum whose variant doc comments become the subcommand help [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:52-54]; `ValueEnum` for closed sets [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:37-50]; and `#[arg(default_value = ".")]` on the root positional [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:57-58]. The sk-code set has zero hits for `clap`. **LACKS** CLI argument design entirely.

8. **Test layout is 46 top-level integration files, one shared helper module, and 30 fixture directories.** `tests/` holds 46 entries including `common/mod.rs` and `fixtures/` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/common/mod.rs:1], and `tests/fixtures/` holds 30 language-named fixture trees. The sk-code set covers `tests/*.rs` and `tests/common/mod.rs` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:163-164] — **COVERED** — but has zero hits for `tests/fixtures`, so the fixture-tree convention is **LACKED**.

9. **The finish gate is four commands, and one of them is a doc update.** `CLAUDE.md` says: "Before finishing a change: `cargo fmt`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, and update `docs/STATUS.md` when what works changed." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/CLAUDE.md:6-7] The sk-code set carries the clippy form with `--workspace --all-targets --locked -- -D warnings` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:78] — **COVERED** — but has no rule that a change which alters observable behaviour must update a status document. **LACKS** the documentation half of the gate.

## Ruled Out

- Reading `specs/z_external-repo-library/rust-anything-main` directly: the path does not exist in this worktree (`ls` returned "No such file or directory"). Fell back to the Trash copy rather than reporting the question unanswered.
- Treating rust-anything's `anyhow` usage as a sk-code contradiction to be resolved by weakening the sk-code rule: the sk-code rule is correct for a binding core, so the finding is recorded as a scope gap (app-shaped crates need a different default), not as a sk-code error.

## Dead Ends

- Searching the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `float_roundtrip`, `preserve_order`, `deny_unknown_fields`, `tests/fixtures` and `integration test`: all returned zero files. These are confirmed absences, not search misses, so later iterations need not re-run them.

## Edge Cases

- Ambiguous input: none. Key question 1 is a single enumerated list.
- Contradictory evidence: finding 4. rust-anything's practice and sk-code's P0 rule are incompatible for an app-shaped crate. Both are cited; the resolution proposed is a scope split (binding core keeps typed errors, app shell may use `anyhow` throughout), not a claim that either side is wrong.
- Missing dependencies: the topic's rust-anything path is absent; the Trash copy is used and named in every citation.
- Partial success: none. All nine findings are backed by a read or a counted grep.

## Sources Consulted

- /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml
- /Users/michelkerkmeester/.Trash/rust-anything-main/CLAUDE.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/crates.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/tests/ (listing)
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md

## Assessment

- New information ratio: 1.0
- Questions addressed: key question 1
- Questions answered: key question 1

## Reflection

- What worked and why: reading the manifest and `CLAUDE.md` first gave a checklist of exactly the surfaces the question names, so each later read had a target. Counting greps (`grep -rl | wc -l`) turned "does sk-code cover this" into a number instead of an impression, which is why the cover/contradict/lack verdicts are defensible.
- What did not work and why: the first attempt to read the topic's rust-anything path failed because the repository is not in this worktree. The recovery was a filesystem search, which found the Trash copy; the cost was one wasted call.
- What I would do differently: check the source path exists before planning reads around it, and prefer one `find` over a `ls` on a path the topic asserts.

## Recommended Next Focus

Key question 2: the record, bridge, diff, bench, shadow and gate method in `docs/how-it-works.md`, `docs/pitfalls.md` and `DECISIONS.md`, and which of those methods apply to any Rust port checked against an original. Read `docs/how-it-works.md` first because it names the six stages, then `docs/pitfalls.md` for the failure catalogue, then `DECISIONS.md` for the reasons behind each stage.
