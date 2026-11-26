# Iteration 1: rust-anything's own Rust — manifest, lints, module layout, error handling, clap, serde, tests

## Focus

Key question 1: how rust-anything writes its own Rust — `Cargo.toml` lints, edition and `rust-version`, module layout across `src/`, error handling, the clap CLI, serde settings, and the test layout and fixtures under `tests/`. Chosen because the reducer's Next Focus named it and because every later port rule has to be checked against a real crate that ships.

**Path resolution note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist inside this worktree. The tree resolves outside it at `/Users/michelkerkmeester/MEGA/Development/Skilled/specs/z_external-repo-library/rust-anything-main`. Citations below keep the topic-relative form the dispatcher asked for; the absolute prefix is that MEGA path. This is a missing-dependency edge case, not a scope violation: the tree was read only.

## Actions Taken

1. Read `Cargo.toml`, `CLAUDE.md`, `mise.toml` and `hk.pkl` in full.
2. Read `src/lib.rs` in full and `src/main.rs` head (1-140) and tail (2150-2227), plus the `main`/`run` split at 820-860.
3. Counted `.unwrap()` occurrences per `src/*.rs` file, split at each file's first `#[cfg(test)]` line, to separate production from test code.
4. Counted and classified `#[serde(...)]` attributes across `src/`.
5. Read `tests/common/mod.rs` (1-60), counted `tests/*.rs` files and listed `tests/fixtures/`.
6. Grepped the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `ExitCode`, `float_roundtrip`, `preserve_order`, `SIGPIPE`, `unwrap`, `tests/`, `fixture` to establish coverage.

## Findings

1. **rust-anything is a single-package crate with no workspace to inherit from.** `Cargo.toml` opens with `[package]` at line 1 and carries no `[workspace]` table; `edition = "2024"` sits at line 4 and `rust-version = "1.97"` at line 8, both written directly on the package. [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:1] [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:4] [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:8]

2. **The lint policy is two lines and uses `forbid`, not `deny`.** `[lints.rust] unsafe_code = "forbid"` at `Cargo.toml:42-43`, and `[lints.clippy] all = { level = "warn", priority = -1 }` at `Cargo.toml:45-46`. The `priority = -1` is what lets a later, more specific clippy entry override the group without a conflict. [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:42] [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:45]

3. **sk-code contradicts itself on `deny` versus `forbid`, and rust-anything sides with `forbid`.** sk-code's toolchain reference sets `unsafe_code = "deny"` at line 61, its build reference says "Use `deny`, not `forbid`, so a narrow reviewed local exception remains possible" at line 102, and the same toolchain file's worked example opens with `#![forbid(unsafe_code)]` at line 196. rust-anything's `forbid` at `Cargo.toml:43` matches line 196 and contradicts line 102. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:61] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:102] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:196]

4. **The finish gate is four commands plus a documentation obligation, and it is wired into a pre-commit hook.** `CLAUDE.md:6-7` reads "Before finishing a change: `cargo fmt`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, and update `docs/STATUS.md` when what works changed." `hk.pkl:7-15` encodes the first two as `cargo fmt --check` (with `fix = "cargo fmt"`) and `cargo clippy --all-targets --quiet -- -D warnings`, globbed over `src/**/*.rs`, `tests/**/*.rs`, `build.rs` and `Cargo.toml`. [SOURCE: specs/z_external-repo-library/rust-anything-main/CLAUDE.md:6] [SOURCE: specs/z_external-repo-library/rust-anything-main/hk.pkl:7] [SOURCE: specs/z_external-repo-library/rust-anything-main/hk.pkl:12]

5. **sk-code's gate is a superset of rust-anything's on flags but lacks the status-doc rule and the hook.** sk-code requires `cargo fmt --all -- --check`, `cargo check --workspace --all-targets --locked`, `cargo clippy --workspace --all-targets --locked -- -D warnings`, `cargo test --workspace --locked`, `RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked` and `cargo build --workspace --release --locked` at lines 122-127, and says to use `--locked` at line 131. rust-anything uses no `--locked` in `CLAUDE.md` and no rustdoc step. Neither the "update the status document when behaviour changed" obligation nor a pre-commit hook appears anywhere in the sk-code Rust set. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:122] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:131]

6. **Error handling is one `anyhow::Result` funnel with a two-code exit contract.** `fn main() -> ExitCode` matches on `run() -> Result<ExitCode>`; the `Err` arm prints `error: {e:#}` and returns `ExitCode::from(2)` at `main.rs:824-834`. A check that ran and failed returns `ExitCode::FAILURE` instead, at `main.rs:1393-1394` and `main.rs:1213`. Context is attached with `.with_context(|| format!("analyzing {}", root.display()))` at `main.rs:851` and `main.rs:867`, and hard stops use `anyhow::bail!` at `main.rs:848`. [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:824] [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:828] [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:1393]

7. **sk-code has no exit-code contract at all.** `ExitCode` appears in zero files under `references/rust/` and `assets/checklists/rust-checklist/`; the phrase "exit code" appears in one. A CLI that must distinguish "the tool broke" (2) from "the check failed" (1) has nothing to follow. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:182]

8. **`unwrap` is confined to test modules by discipline, not by a lint.** Across all `src/*.rs`, exactly one `.unwrap()` sits before the file's first `#[cfg(test)]` line — in `error_paths.rs` — while 809 occur in total once test modules are counted. rust-anything's clippy set is `all = "warn"` only, so `unwrap_used` is not enabled. sk-code already covers this ground and is stricter: `unwrap_used = "deny"`, `expect_used = "deny"`, `panic = "deny"` at `build-and-organization.md:85-87`. [SOURCE: specs/z_external-repo-library/rust-anything-main/src/error_paths.rs:1] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:85]

9. **serde is configured for bit-exact round-tripping, not for convenience.** `serde_json` is pulled with `features = ["float_roundtrip", "preserve_order", "unbounded_depth"]` at `Cargo.toml:29`, and the comment on line 28 states the reason: "recorded floats must survive parsing bit for bit." Across `src/` there are 152 `#[serde(...)]` attributes, dominated by `#[serde(default, skip_serializing_if = "Option::is_none")]` and `skip_serializing_if = "Vec::is_empty"`, plus `#[serde(rename = "fn")]` where a Rust keyword collides with a wire name. [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:28] [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:29]

10. **sk-code never names the serde_json features that make a recorded value survive a round trip.** `float_roundtrip` and `preserve_order` appear in zero files under `references/rust/` and `assets/checklists/rust-checklist/`, although `serde_json` itself appears in seven. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:61]

11. **The crate root is a flat module list, not a nested tree.** `src/lib.rs:10-79` is 68 consecutive `pub mod` lines with three exceptions: `#[cfg(test)] mod js_number;` at lines 55-56, private `mod mime;` at line 62, and the three directories that do nest — `src/lang/`, `src/ts/`, `src/package/`. `#![recursion_limit = "256"]` sits at line 6 and `pub(crate) const MIN_RUST: &str = env!("CARGO_PKG_RUST_VERSION");` at line 8, so the declared MSRV is readable from code. [SOURCE: specs/z_external-repo-library/rust-anything-main/src/lib.rs:6] [SOURCE: specs/z_external-repo-library/rust-anything-main/src/lib.rs:8] [SOURCE: specs/z_external-repo-library/rust-anything-main/src/lib.rs:55]

12. **sk-code's layout rules stop at the file boundary.** The section-order table at `toolchain-and-project-structure.md:104-112` governs dividers inside one file; nothing states how a crate root should list modules, when a module earns a directory, or how to expose the declared MSRV to code. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:104]

13. **The clap CLI is derive-only and pushes every closed set into a `ValueEnum`.** `#[derive(Parser)]` with `#[command(name, version, about, after_help)]` at `main.rs:25-31`; `#[derive(Subcommand)]` with doc comments as help text at `main.rs:52-72`; `#[derive(Clone, Copy, ValueEnum)]` for `KindArg` and `Profile` at `main.rs:37-50`; `value_parser = absolute` at `main.rs:111`; `#[arg(long = "node-arg", allow_hyphen_values = true)]` at `main.rs:137`. [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:25] [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:52] [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:137]

14. **sk-code says nothing about clap.** `clap` appears in zero files under `references/rust/` and `assets/checklists/rust-checklist/`. The same is true of `ratatui` and `crossterm`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md:1]

15. **A CLI that writes to stdout must survive a closed pipe, and rust-anything does it with a macro.** `say!` and `say_raw!` at `main.rs:6-17` wrap `writeln!`/`write!` on `std::io::stdout().lock()` and discard the result with `let _ =`, documented as "`println!` that stops quietly when stdout is closed (`rust-anything ... | head`)". [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:6]

16. **sk-code has no broken-pipe rule.** "broken pipe" and "SIGPIPE" appear in zero files under `references/rust/` and `assets/checklists/rust-checklist/`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:113]

17. **The test tree is 44 integration files plus a shared helper that turns a missing runtime into a skip or a failure on request.** `tests/*.rs` holds 44 files; `tests/common/mod.rs` opens with `#![allow(dead_code)]` at line 7 and defines `required(runtime)` reading `RUST_ANYTHING_REQUIRE` at lines 11-17, `missing(runtime, why)` which asserts when the runtime is required and otherwise prints `skipped: ...` at lines 34-41, and `have(program)` at lines 43-46. Fixtures live under `tests/fixtures/` in 30-plus per-language directories. [SOURCE: specs/z_external-repo-library/rust-anything-main/tests/common/mod.rs:7] [SOURCE: specs/z_external-repo-library/rust-anything-main/tests/common/mod.rs:11] [SOURCE: specs/z_external-repo-library/rust-anything-main/tests/common/mod.rs:34]

18. **sk-code covers the test file layout but not the skip-versus-fail decision.** `build-and-organization.md:163` says to put public-contract tests in `tests/*.rs` and line 164 says to put shared integration helpers in `tests/common/mod.rs`, which matches rust-anything exactly. Nothing in the set says how a test that needs an absent external runtime should behave, so the `RUST_ANYTHING_REQUIRE` pattern has no sk-code equivalent. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:163] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:164]

## Questions Answered

- Key question 1 is answered for the manifest, lint, module-layout, error-handling, clap, serde and test-layout parts, with the coverage verdict recorded per finding.

## Questions Remaining

- Key questions 2, 3, 4 and 5 are untouched.

## Ruled Out

- Reading `src/main.rs` end to end (2227 lines) to characterise the CLI. The derive attributes at 25-50 and the `main`/`run` split at 824-834 carry the contract; the remaining 2000 lines are per-subcommand bodies that repeat the same `say!` and `ExitCode` pattern.
- Treating the 809 `.unwrap()` count as a production-code smell. Splitting at each file's first `#[cfg(test)]` line reduced it to one, so the raw count was a measurement artefact.

## Dead Ends

- Searching for a `[workspace]` table or a `rust-toolchain.toml` in rust-anything. Neither exists, so the workspace-inheritance rules sk-code mandates have no counterpart here and cannot be cited as covered.

## Edge Cases

- **Missing dependency:** the topic path `specs/z_external-repo-library/rust-anything-main` is absent from this worktree; the tree was located at the MEGA path and read there. Fallback used, confidence unaffected.
- **Contradictory evidence:** sk-code's own `deny`-not-`forbid` rule at `build-and-organization.md:102` conflicts with its example at `toolchain-and-project-structure.md:196`. Both are cited; the conflict is recorded as finding 3 and left unresolved for the lead, because resolving it changes an existing sk-code rule rather than adding one.
- **Ambiguous input:** "module layout across `src/`" could mean in-file section order or crate-level module tree. Both were read; the crate-level reading is reported because the in-file reading is already covered by sk-code.
- **Partial success:** none. Every planned action returned evidence.

## Sources Consulted

- specs/z_external-repo-library/rust-anything-main/Cargo.toml:1-46
- specs/z_external-repo-library/rust-anything-main/CLAUDE.md:1-7
- specs/z_external-repo-library/rust-anything-main/hk.pkl:1-16
- specs/z_external-repo-library/rust-anything-main/mise.toml:1-12
- specs/z_external-repo-library/rust-anything-main/src/lib.rs:1-79
- specs/z_external-repo-library/rust-anything-main/src/main.rs:1-140, 820-860, 2150-2227
- specs/z_external-repo-library/rust-anything-main/src/error_paths.rs:1
- specs/z_external-repo-library/rust-anything-main/tests/common/mod.rs:1-60
- .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:38-112, 196
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:66-131, 163-164
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:113, 182
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:61

## Assessment

- New information ratio: 1.0
- Questions addressed: key question 1
- Questions answered: key question 1

## Reflection

- What worked and why: splitting the `.unwrap()` count at each file's first `#[cfg(test)]` line turned a misleading 809 into a defensible 1. Counting attributes rather than reading files gave the serde shape in one call.
- What did not work and why: the first attempt to read `build-and-organization.md` through `sed | cat -n | awk` renumbered the lines and produced citations that would not resolve. Re-reading with `grep -n` for the exact phrases fixed it; every citation above was confirmed by `grep -n` or by a direct `sed` range whose offset was known.
- What I would do differently: confirm each citation line with `grep -n` before writing the narrative, not after.

## Recommended Next Focus

Key question 2: the record, bridge, diff, bench, shadow and gate methods in `docs/how-it-works.md`, `docs/pitfalls.md` and `DECISIONS.md`, and which of them apply to any Rust port checked against an original.
