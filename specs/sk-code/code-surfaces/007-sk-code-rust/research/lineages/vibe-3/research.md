# Rust standards in sk-code, informed by rust-anything

**Lineage:** vibe-3 · **Session:** `fanout-vibe-3-1795694320828-so5yva` · **Iterations:** 8 of 8 · **Findings:** 109 · **Open questions:** 0

**Source:** `specs/z_external-repo-library/rust-anything-main` (read-only). The canonical path is gitignored and was absent at run start; every iteration read the working copy at `~/.Trash/rust-anything-main` and cited the canonical path. This is the one condition that touched all eight iterations and it prevented no finding.

---

## 1. The finding that governs the rest

The app-style gap in sk-code's Rust set is a **scope decision, not an oversight**.

`assets/checklists/rust-checklist/overview-and-p0-parity.md:42` assigns "daemon and CLI wiring" to TypeScript by name, and the Scope section lists only binding shapes as in-scope: pure Rust compute kernels behind a TypeScript backend, napi-rs addons, wasm-bindgen or napi-rs WASI fallbacks, sidecars exchanging deterministic bytes, and Rust code whose output is observable from TypeScript. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:32] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:42]

Everything else follows from that sentence:

| Symptom | Where | Consequence |
|---|---|---|
| `clap`, `ratatui`, `crossterm` absent | 17 references, 4 checklist parts, 6,642 lines | A CLI or TUI has no rule to follow |
| Contract table is 8 parity rows | `overview-and-p0-parity.md:44-51` | An app has no contract to be held to |
| 20 validation commands, all workspace-shaped | `p2-evidence-validation-and-resources.md:158-222` | No `--help` snapshot, exit-code assertion, or stdin/stdout test |
| 9 of 12 router keywords name a binding | `ROUTER.md:81` | An app request matches only `rust`, `.rs` or `cargo.toml` |
| One behavioural statement about Rust | `SKILL.md:139` | "compatibility implementations, not independent behavior authorities" |

**The edit is a scope edit first and a content edit second.** A rule added under a scope that excludes its subject is a rule the checklist says does not apply.

## 2. The reframing that makes the edits traceable

The app rules are **not missing from rust-anything**. They are in `skills/rust-anything/whole-app.md` — the whole-app workflow — rather than `skills/rust-anything/SKILL.md`, the per-function rules. Reading the two as one document is what produced the earlier conclusion that the app content was absent.

| Rule | rust-anything source |
|---|---|
| The app owns the entry point, argument parser, config loading and server setup | `whole-app.md:136` |
| A CLI fallback passes the original's output and exit code through | `whole-app.md:143` |
| `app front-door` scaffolds a clap parser or an axum app | `whole-app.md:148` |
| The fallback rate only goes down | `whole-app.md:152` |
| Replay after every change; drift in CI; a mismatch is a bug in the port, never in the cases | `whole-app.md:232-238` |
| Shadow live traffic before a server cutover | `whole-app.md:247` |

[SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136] [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:148] [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:152] [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:238]

## 3. The ranked edit list

Seventeen rows in four tiers. Every rank 1 to 3 row names a target section that exists at the stated line range and a rust-anything line that says what the row claims; both were verified in iteration 7.

### Rank 1 — unblocks the app case

| # | Target sk-code part | The change, in sk-code's own words | rust-anything source |
|---|---|---|---|
| 1 | `assets/checklists/rust-checklist/overview-and-p0-parity.md` §1 OVERVIEW → §Scope (32-42) | "**App-style Rust.** A Rust binary that owns its own entry point — a CLI, a terminal screen, or a long-running process — is in scope when the project has no TypeScript oracle. Its contracts are the process's observable surface: the exit code, the bytes on stdout and stderr, the `--help` and `--version` text, and the terminal state on exit. The parity sections below apply only where an oracle exists; the app sections apply where it does not." | `whole-app.md:136` |
| 2 | `SKILL.md:139` | "**Rust preserves the TypeScript contract when there is one.** ... A Rust application with no TypeScript oracle is the authority for its own behaviour; its contract is its observable surface, and the parity rules apply to it only where a port is checked against an original." | `whole-app.md:136`; `Cargo.toml:1-2` (a `[package]` with a binary, no `cdylib`) |
| 3 | `ROUTER.md:81` | Append `clap`, `ratatui`, `crossterm`, `axum`, `tokio` to the `RUST` keyword list | `whole-app.md:148` |
| 4 | `overview-and-p0-parity.md` §Protected Contracts (44-51) | Add three rows: "Exit-code contract \| The process exits with the documented code for each outcome \| P0"; "Fallback rate \| The share of cases the original still answers only goes down \| P1"; "Terminal state \| Raw mode and the alternate screen are restored on every exit path, including panic \| P0" | `whole-app.md:143`, `whole-app.md:152` |

### Rank 2 — correctness risk

| # | Target sk-code part | The change | rust-anything source |
|---|---|---|---|
| 5 | `p2-evidence-validation-and-resources.md` §4 VALIDATION COMMANDS (156-222), §3 REVIEW EVIDENCE TEMPLATE (123-155) | "Fail a port that writes three or more recorded values the original never spells out, mentions the recording files, has fewer tests or assertions than at the last passing gate, or runs on a `cases.jsonl` whose recorded lines changed. One or two such literals only get named, and `// recorded-literal: <reason>` lets a library constant stay." | `DECISIONS.md:48` |
| 6 | `modeling-collections-and-api.md` §Collection Selection (140-153); `determinism-and-parity.md` §Acceptance Standard (36-50) | "Regex lookaround or backreferences: `fancy-regex`, not `regex`. Either way, `\w`, `\b`, `\d` and case-insensitive matching treat non-ASCII text differently from the source language's engine: passing the recorded cases is not enough. Set `unicode(false)` or spell out ASCII classes (`[A-Za-z0-9_]`) where the original's `\w` is ASCII-only." | `skills/rust-anything/SKILL.md:142-147` |
| 7 | `modeling-collections-and-api.md` §Conversion Policies (118-137) | "A JavaScript `char`, `Character` or `Char` is a UTF-16 code unit, not a Unicode scalar. Refuse the conversion rather than mapping it to Rust `char`: a lone surrogate has no `char`, and a non-BMP character is two code units and one `char`. Where the original indexes by code unit, index a `Vec<u16>`." | `docs/types.md:188`, `:217`, `:242` |
| 8 | `modeling-collections-and-api.md` §4 PUBLIC API AND ABI CONTRACTS (248-368) — new §C ABI Contract after §Sidecar Contract (361) | "At the C ABI, keep the original scalar's width and sign: `int` is `std::ffi::c_int`, an `enum` is `c_int`, a project `typedef` of a scalar is that scalar, and a struct passed by value whose fields are all scalars becomes a `#[repr(C)]` struct. A `const char *` is `Option<&[u8]>`, which costs a `strlen` per argument." | `docs/types.md:123-127`, `:155`, `:167`; `SKILL.md:138` |
| 9 | `modeling-collections-and-api.md` §Canonical Serialization (212-247) | "Enable `float_roundtrip`, `preserve_order` and `unbounded_depth` on `serde_json` when the oracle is JavaScript: `float_roundtrip` keeps a recorded float bit-for-bit through a parse and a write, `preserve_order` keeps insertion order instead of sorting keys, and `unbounded_depth` removes the recursion limit." | `Cargo.toml:28-29` |
| 10 | `p1-required.md` §CI Clippy Deny List (168-179); `docs-errors-and-async.md` §Panic Policy (178-208) | "The deny list has one documented escape: a `// INFALLIBLE: <why>` comment on a function whose original also treats the state as impossible. Without the marker, `unwrap`, `expect` and `panic!` are denied in any function whose original returns an error." | `skills/rust-anything/SKILL.md:245-246` |
| 11 | `p1-required.md` §Narrow Lint Suppressions (190-211) | "Use `#[expect(lint, reason = \"...\")]`, not `#[allow]`, so the suppression is flagged once it no longer applies." | `skills/rust-anything/SKILL.md:151-152` |
| 12 | `p2-evidence-validation-and-resources.md` §4; `build-and-organization.md` §Testing Layout (136-169) | "`cargo test` passing with no tests proves nothing: the recorded cases are the proof." | `skills/rust-anything/SKILL.md:150-151` |

### Rank 3 — app mechanics

| # | Target sk-code part | The change | rust-anything source |
|---|---|---|---|
| 13 | `build-and-organization.md` §Testing Layout (136-169) | "A binary's tests invoke the built executable through `env!(\"CARGO_BIN_EXE_<name>\")` and `std::process::Command`, asserting on stdout, stderr and the exit status. No extra test crate is needed." | `tests/rules.rs:11` (also `switch.rs:295`, `tools.rs:11`, `recording.rs:29`) |
| 14 | `docs-errors-and-async.md` §3 ERROR AND PANIC TRANSLATION (124-219) — new §Application Entry Point | "`fn main() -> ExitCode` with an inner `fn run() -> Result<ExitCode>`; the error path prints the whole context chain to stderr and returns exit code 2." | `src/main.rs:824-834` |
| 15 | `docs-errors-and-async.md` §Panic Policy (178-208) | "A closed stdout is not an error: route every print through one macro that discards the write error, so `prog \| head` exits quietly instead of panicking." | `src/main.rs:6-12` |
| 16 | `p2-evidence-validation-and-resources.md` §4 VALIDATION COMMANDS (156-222) | "An app is proved at its edges: replay every recorded case against the built binary after any change, run the drift check in CI, and for a server shadow live traffic before cutover. A mismatch is a bug in the port, never in the cases." | `whole-app.md:232-238`, `:247` |

### Rank 4 — unsourced, and it must be said so

| # | Target sk-code part | The change | rust-anything source |
|---|---|---|---|
| 17 | `references/rust/` — a new file, or a section in `modeling-collections-and-api.md` | The five TUI rules: ratatui plus crossterm as the rendering and terminal-control pair; terminal state restored on panic and early return; a render loop testable without a terminal through a `TestBackend` buffer; terminal size and resize tolerance; a cell-grid-after-events oracle instead of byte parity | **None.** `grep -rl "ratatui\|crossterm"` over the whole repository returns zero files; the dependency list is `anyhow`, `clap`, `ignore`, `json5`, the `oxc_*` family, `percent-encoding`, `regex`, `serde`, `serde_json`, `toml_edit` and the `tree-sitter` grammars |

**Row 17 cannot satisfy the objective's traceability requirement.** The objective says every new rule is traced to a line of rust-anything; a TUI rule has no such line. The packet's completion criterion allows the alternative — "or research.md names why one is absent" — and the reason is that rust-anything has no terminal UI. The honest options are to source the TUI rules from ratatui's own documentation in a later packet, or to leave `ratatui` and `crossterm` out and let the criterion's clause stand.

## 4. What the set already does better than rust-anything

The work is additive. Four places where sk-code's set is stronger, and the edit list touches none of them:

- **The six-lint clippy deny list** — `unwrap_used`, `expect_used`, `panic`, `float_cmp`, `as_conversions`, `indexing_slicing` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:171]
- **`--locked` on every dependency-resolving command** [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:162]
- **`cargo deny` / `audit` / `vet` as a supply-chain gate** [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:196]
- **The golden-provenance record** — oracle commit, generator command, encoding, comparison mode, SHA-256s [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:212]

Also preserved: byte-for-byte parity with a forbidden semantic shortcut, the eight-row protected-contract table, `SAFETY:` on every `unsafe`, and the `CI=true INSTA_UPDATE=no` snapshot guard.

## 5. Corrections this lineage made to itself

Recorded so no edit rests on an overstated claim.

| Claim | Correction | Resolution |
|---|---|---|
| Iteration 1: sk-code has no panic policy | It does — the clippy deny list denies `unwrap_used`, `expect_used`, `panic`, `float_cmp`, `as_conversions`, `indexing_slicing` (`p1-required.md:168-179`) | The gap is the `INFALLIBLE:` marker and the "where the original returns an error" scoping, not the deny list |
| Iteration 1: `forbid` is strictly stronger than `deny` | sk-code's `deny` has a stated reason — "so an exceptional local suppression remains possible after review" (`p1-required.md:188`) | `forbid` is right for `unsafe_code` in a crate shipping no `unsafe`; `deny` is right for clippy lints. Both correct for their lint |
| Iteration 4: `IndexMap` is absent | It is present in the collection selection table (`modeling-collections-and-api.md:149`) and two reference files | `fancy-regex` is genuinely absent; the `IndexMap` claim came from a lowercase crate-name grep |
| Iteration 5: the app content is missing from rust-anything | It is in `whole-app.md`, the whole-app workflow, not `SKILL.md`, the per-function rules | This reframing is what makes rows 1-4 and 16 traceable |

## 6. Convergence

| Iteration | Focus | Ratio | Findings |
|---|---|---|---|
| 1 | rust-anything's own Rust style | 1.00 | 11 |
| 2 | record / bridge / diff / bench / shadow / gate method | 1.00 | 15 |
| 3 | `docs/types.md` cross-bridge mapping | 1.00 | 15 |
| 4 | `SKILL.md` and `whole-app.md` agent steering | 1.00 | 16 |
| 5 | Coverage pass over the sk-code set | 0.85 | 15 |
| 6 | The ranked edit list | 0.75 | 17 |
| 7 | Verification of the list | 0.30 | 11 |
| 8 | The convergence position | 0.05 | 9 |

109 findings, 5 of 5 key questions resolved, 0 open, 0 uncovered, 0 corruption warnings, 0 rejected patterns. The ratio fell because the questions ran out, not because the search narrowed.

**Two recording defects worth knowing when reading these numbers.** The reducer resolves a key question only on an exact text match, so questions 1, 2 and 5 looked unanswered for five iterations after they were answered; the convergence score was understated for that reason alone. And three of iteration 1's findings were overstated because they came from lowercase crate-name greps and from reading an `rg` probe as a policy.

## 7. What the merge should carry

1. **The scope statement as the root cause** — `overview-and-p0-parity.md:42` is the sentence to change first, and no content edit survives it unchanged.
2. **The seventeen-row list with its four tiers** — rank 1 unblocks the app case, rank 2 is correctness risk, rank 3 is app mechanics, rank 4 is unsourced.
3. **Row 17 marked unsourced with the reason named, not cited** — rust-anything has no terminal UI, and the completion criterion's "or names why one is absent" clause is the route.
4. **The four places the set is already stronger** — the edit list is additive and must not weaken the deny list, `--locked`, the supply-chain gate, or the golden-provenance record.
5. **The four self-corrections** — so no applied edit inherits an overstated claim.

## Sources

- `specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136-155, 230-265`
- `specs/z_external-repo-library/rust-anything-main/skills/rust-anything/SKILL.md:138-152, 245-246`
- `specs/z_external-repo-library/rust-anything-main/DECISIONS.md:48`
- `specs/z_external-repo-library/rust-anything-main/docs/types.md:123-127, 155, 167, 188, 217, 242`
- `specs/z_external-repo-library/rust-anything-main/Cargo.toml:1-2, 15, 16, 26, 28-29`
- `specs/z_external-repo-library/rust-anything-main/src/main.rs:6-12, 21-52, 824-834`
- `specs/z_external-repo-library/rust-anything-main/tests/rules.rs:11`, `switch.rs:295`, `tools.rs:11`, `recording.rs:29`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:32-51`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:168-211`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:123-222`
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md:118-137, 140-153, 212-247, 248-368`
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:36-50`
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:124-219, 276-284`
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:136-169, 196`
- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md:139`
- `.skilled/skills/sk-code/sk-code-skilled/ROUTER.md:81`
- `specs/sk-code/code-surfaces/007-sk-code-rust/goal.md:56`
