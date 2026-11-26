---
title: "Research: rust-anything as a source for sk-code's Rust standards"
description: "The merged synthesis of a three-lineage Vibe deep-research run over rust-anything: what its Rust teaches, where sk-code's Rust set already covers it, where it lacks it, and the ranked edits that make the set cover a Rust app as well as a Rust binding."
trigger_phrases:
  - "rust anything research synthesis"
  - "sk code rust ranked edits"
importance_tier: "normal"
contextType: "research"
---

# rust-anything as a source for sk-code's Rust standards

## 1. Run

- **Command:** `/deep:research :auto` fan-out, three `cli-mistral-vibe` lineages on `deepseek-flash` (thinking pinned to max in `.vibe/config.toml`), up to 8 iterations each, convergence stop policy.
- **vibe-1:** 6 iterations, converged, 5 of 5 questions answered. Synthesis at `lineages/vibe-1/research.md`.
- **vibe-3:** 8 iterations, 109 findings, 5 of 5 questions answered. The runner marked it failed because its state log holds no terminal stop row, although its log ends `FANOUT_LINEAGE_COMPLETE:vibe-3` and its synthesis is complete. Synthesis at `lineages/vibe-3/research.md`.
- **vibe-2:** 1 iteration. Its model call stalled for 27 minutes with a conversation of about 521,000 tokens, so the orchestrator stopped it. Its one iteration is kept and adds nothing the other two lack.
- **Merge:** `fanout-merge.cjs` merged 207 key findings and flagged vibe-2 and vibe-3 as untrusted, so every row below was re-checked by the orchestrator against the source line.
- **Source copy:** the canonical path is gitignored and absent from the worktree, so the lineages read `~/.Trash/rust-anything-main`. `diff -rq` of that copy against `specs/z_external-repo-library/rust-anything-main` in the main checkout prints nothing, so every cited line holds for the canonical copy.

Both lineages run on one model family, so their agreement is not corroboration. Every rust-anything line a row below rests on was opened by the orchestrator, and each row records it.

## 2. The finding that governs the rest

The app gap is a scope decision. The Rust checklist's scope lists only binding shapes and says TypeScript owns "daemon and CLI wiring" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:42]. sk-code-skilled's own rule says Rust modules are "compatibility implementations, not independent behavior authorities" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:139]. A rule added under that scope would be a rule the checklist says does not apply, so the scope sentence changes first.

rust-anything's app rules sit in `skills/rust-anything/whole-app.md`, not in `SKILL.md`: the app owns the entry point and the argument parser, and a CLI's contract is its output and exit code [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136-143].

## 3. What the set already covers

These need no edit, which the lineages first missed or overstated:

- The finish gate. fmt, check, clippy with `-D warnings`, test, doc and release build are in `build-and-organization.md` §Required Verification, with `--locked` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:119-127].
- Edition 2024 and a declared `rust-version` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:38-44].
- The six-lint clippy deny list and its reason for `deny` over `forbid` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:168-188].
- `anyhow` is not banned outright. It is already allowed at P2 in "a sidecar `main`, build tool, or outermost non-ABI application shell" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:148]. vibe-1 called this a contradiction, and it is a partial cover: what is missing is a crate that has no ABI boundary at all.
- `forbid(unsafe_code)` in a pure core [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md:211-214].

## 4. Ranked edits

Each row names the target part, the change in sk-code's own words and the rust-anything line it rests on. The orchestrator opened every source line on 2026-11-26.

### Rank 1: open the scope to app-style Rust

| # | Target | Change | Source |
|---|--------|--------|--------|
| 1 | `assets/checklists/rust-checklist/overview-and-p0-parity.md` §Scope | Add app-style Rust to the scope: a binary that owns its entry point, a CLI or a terminal screen, with no TypeScript oracle. Scope the TypeScript-ownership sentence to a project where a TypeScript backend owns the process | `whole-app.md:136-143` |
| 2 | Same file, §Protected Contracts | Add one row: the process contract, meaning exit code and the bytes on stdout and stderr for each outcome | `whole-app.md:142-143` |
| 3 | `SKILL.md` §4, the "Rust preserves the TypeScript contract" rule | Scope it to Rust that has a TypeScript oracle, and say an app with none is the authority for its own observable surface | `whole-app.md:136-143` |

### Rank 2: the app's own mechanics

| # | Target | Change | Source |
|---|--------|--------|--------|
| 4 | `references/rust/quality-standards/docs-errors-and-async.md` §Typed Core Errors | Widen the P2 `anyhow` line to a crate with no ABI boundary, where `anyhow` may run through every layer | `Cargo.toml:15`, `src/bridge.rs:11` |
| 5 | Same file, new §Application Entry Point | `fn main() -> ExitCode` wrapping `fn run() -> Result<ExitCode>`, the error path printing the whole context chain to stderr and returning a fixed failure code, and one print macro that discards a closed-stdout write error so `prog \| head` exits quietly | `src/main.rs:6-12`, `src/main.rs:824-834` |
| 6 | `references/rust/quality-standards/build-and-organization.md` §Workspace Layout | Add the single-crate application layout: a library with the logic and a thin binary whose clap derive parser only parses and dispatches. Name ratatui and crossterm as the terminal screen case and say the set holds no rendering rules, because rust-anything has none | `src/main.rs:25-107`, `whole-app.md:148` |
| 7 | Same file, §Clippy Baseline | Show the single-crate form, `[lints.rust]` and `[lints.clippy]`, beside the workspace form | `Cargo.toml:42-46` |
| 8 | Same file, §Testing Layout | A binary's tests run the built executable through `env!("CARGO_BIN_EXE_<name>")` and `std::process::Command` and assert on stdout, stderr and exit status. Recorded CLI cases can be trycmd files of argv, env, exit code, stdin, stdout and stderr | `tests/rules.rs:11`, `docs/whole-apps.md:97-99` |
| 9 | Same file, §Testing Layout | A child process's stdout goes to stderr or a pipe, never to a stream the parent's protocol owns | `docs/pitfalls.md:65-66` |

### Rank 3: proving a port against an original

| # | Target | Change | Source |
|---|--------|--------|--------|
| 10 | `references/rust/quality-standards/determinism-and-parity.md`, new §Porting Against a Recorded Original | Record the original's behaviour as cases, compare the port against them, and treat a mismatch as a bug in the port, changing a case only with approval and a recorded reason. `cargo test` passing with no tests proves nothing, the recorded cases do. Break the port once to see the check fail. Commit the replay report and run `git diff --exit-code` on it in CI. The fallback rate of a half-ported app only goes down | `whole-app.md:232-236`, `SKILL.md:149-150`, `docs/pitfalls.md:112-116`, `docs/whole-apps.md:120-123`, `whole-app.md:152` |
| 11 | Same new section | The three cheat checks: no recorded literals in the port, no fewer tests or assertions than at the last pass, no edited recorded case, with `// recorded-literal: <reason>` as the escape for a real library constant | `docs/how-it-works.md:225-241`, `DECISIONS.md:48` |
| 12 | Same new section | A float tolerance forgives rounding only: integers, strings and formatting still match exactly, and a tolerance is never widened to hide a mismatch | `SKILL.md:210-214` |
| 13 | `determinism-and-parity.md` §Serialized Output | When the oracle is JavaScript, enable `float_roundtrip`, `preserve_order` and `unbounded_depth` on `serde_json` | `Cargo.toml:28-29` |
| 14 | `references/rust/quality-standards/modeling-collections-and-api.md` §Collection Selection | Regex lookaround or backreferences need `fancy-regex`. `\w`, `\b`, `\d` and case-insensitive matching treat non-ASCII text differently from the source engine, so set `unicode(false)` or spell out ASCII classes where the original is ASCII-only | `SKILL.md:142-147` |
| 15 | Same file, §Conversion Policies | A Java `char` or `Character` is a UTF-16 code unit, so refuse mapping it to Rust `char` | `docs/types.md:188` |
| 16 | Same file, §4, a new §C ABI Contract after §Sidecar Contract | At the C ABI keep the scalar's width and sign (`std::ffi::c_int`), an `enum` is `c_int`, a scalar `typedef` is its scalar, a by-value all-scalar struct is `#[repr(C)]`, and `const char *` is `Option<&[u8]>` | `docs/types.md:123-127`, `docs/types.md:155`, `docs/types.md:167`, `SKILL.md:138` |

### Rank 4: lint discipline

| # | Target | Change | Source |
|---|--------|--------|--------|
| 17 | `assets/checklists/rust-checklist/p1-required.md` §Narrow Lint Suppressions, and the example in `build-and-organization.md` §Clippy Baseline | Prefer `#[expect(lint, reason = "...")]` over `#[allow]`, so a suppression is flagged once it no longer applies | `SKILL.md:151-152` |
| 18 | `p1-required.md` §CI Clippy Deny List | The deny list's one escape for a state the original also treats as impossible is a `// INFALLIBLE: <why>` comment | `SKILL.md:243-245` |

## 5. Edits not taken

- **Router keywords for clap, ratatui and crossterm** (vibe-3 row 3). A `.rs` file inside Skilled already loads the Rust set through stack detection, so the keywords change nothing a file does not, and the packet's decision D1 keeps detection unchanged.
- **A new `cli-and-app-shape.md` part** (vibe-1 rank 11). Rows 5 to 9 fit existing sections, so a new file would add a router entry and a place readers must look with no topic left homeless.
- **A terminal-state contract row and the five terminal-screen rules** (vibe-3 rows 4 and 17, vibe-1 rank 25). rust-anything holds no ratatui or crossterm code: `grep -rl "ratatui\|crossterm"` over the repository prints nothing. Restoring raw mode on every exit path is a real need for a terminal screen such as bots-tui, but it has no source here, so row 6 names the gap instead of inventing a rule. Sourcing it from ratatui's own documentation is a later packet.
- **Signal handling, `is_terminal` and `NO_COLOR`, progress reporting** (vibe-1). No rust-anything source.
- **Port workflow steps** (vibe-1 ranks 21 to 24: stall detector, rules file, session map, interview) and **the 3x line budget**. They steer an agent running the rust-anything tool and are not Rust standards.
- **An executable mapping-table test and a PyO3 row** (vibe-1 ranks 4 and parts of 3). Skilled ships no PyO3 bridge, and the test is a tool feature.
- **A shadow-mode rollout** (vibe-1 rank 19). A server cutover practice with no server in this set's scope.

### Changed while applying

A review of the rows before they were written found four that would give wrong guidance as worded above. Each was applied in the form below.

- **Row 16, dropped.** `docs/types.md` maps a source type to the safe Rust function behind a generated shim, not to the `extern "C"` signature, and an `extern "C" fn` taking `Option<&[u8]>` is not FFI-safe. The checklist scope names no C ABI binding either, so by the reasoning of section 2 the rule would apply to nothing. It is dropped like the PyO3 row.
- **Row 13, narrowed.** Only `float_roundtrip` has a reason in the source (`Cargo.toml:28`), and it is kept. `preserve_order` is kept with a warning, because Cargo turns a feature on for every crate in the build. `unbounded_depth` is dropped. It does nothing until `disable_recursion_limit()` is called, and then it removes the guard that keeps a deep input from overflowing the stack, which would break the P0 that failures return errors.
- **Row 17, example changed.** Clippy's `float_cmp` does not fire on a comparison with zero, so `#[expect(clippy::float_cmp)]` on the old `is_negative_zero` example fails `-D warnings` as `unfulfilled_lint_expectations`. A `cargo clippy` run on 2026-11-26 confirmed it. The example now compares two values.
- **Row 18, restated.** A `// INFALLIBLE:` comment does not satisfy a clippy `deny`. rust-anything's own `gate` command reads it, and Skilled has no such command. The rule names `#[expect(clippy::expect_used, reason = "infallible: <why>")]` instead, and the anchor is `SKILL.md:245-246`.
- **Rows 8, 10 and 12, scoped.** The rule that expected outputs come only from the TypeScript oracle is scoped to where TypeScript is the oracle. The Acceptance Standard gains a pointer to the new section, and the float tolerance never applies at a napi-rs, WASM or sidecar boundary.

## 6. The completion criterion on clap, ratatui and crossterm

Row 6 names all three in `build-and-organization.md`. `clap` carries a sourced rule. `ratatui` and `crossterm` are named only to say the set has no rendering rules for them, because rust-anything, the source every new rule here traces to, has no terminal UI.

## 7. Sources

- `specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136-152, 232-238`
- `specs/z_external-repo-library/rust-anything-main/skills/rust-anything/SKILL.md:138-152, 205-214, 240-250`
- `specs/z_external-repo-library/rust-anything-main/DECISIONS.md:48`
- `specs/z_external-repo-library/rust-anything-main/docs/how-it-works.md:225-241`
- `specs/z_external-repo-library/rust-anything-main/docs/types.md:123-127, 155, 167, 188`
- `specs/z_external-repo-library/rust-anything-main/docs/pitfalls.md:65-67, 112-117`
- `specs/z_external-repo-library/rust-anything-main/docs/whole-apps.md:98-100, 120-123`
- `specs/z_external-repo-library/rust-anything-main/Cargo.toml:15, 26-29, 42-46`
- `specs/z_external-repo-library/rust-anything-main/src/main.rs:6-12, 25-107, 824-834`
- `specs/z_external-repo-library/rust-anything-main/tests/rules.rs:11`
- The two lineage syntheses, `lineages/vibe-1/research.md` and `lineages/vibe-3/research.md`, and the merged registry `findings-registry.json`
