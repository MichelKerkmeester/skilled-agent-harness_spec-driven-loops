---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: rust-anything (specs/z_external-repo-library/rust-anything-main, read-only) as a source for sk-code's Rust standards. Questions: (1) How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md? (2) What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original? (3) How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges? (4) How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port? (5) For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks? Cite file:line for every claim. End with a ranked edit list, each naming the target sk-code Rust part, the change and the rust-anything source line.
- Started: 2026-11-26T12:00:30Z
- Status: INITIALIZED
- Iteration: 8 of 8
- Session ID: fanout-vibe-3-1795694320828-so5yva
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | rust-anything's own Rust style — manifest, layout, errors, CLI, serde, tests, finish gate | rust-style | 1.00 | 11 | complete |
| 2 | the record, bridge, diff, bench, shadow and gate method — and which parts apply to any Rust port checked against an original | verification-method | 1.00 | 15 | complete |
| 3 | how docs/types.md maps values across napi-rs, PyO3, the C ABI and the other bridges | type-mapping | 1.00 | 15 | complete |
| 4 | how skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port | agent-steering | 1.00 | 16 | complete |
| 5 | Coverage pass: for each finding, does the sk-code Rust set cover, contradict or lack it, and what does an app-style Rust project (CLI, ratatui screen) need that the set lacks | coverage-pass | 0.85 | 15 | complete |
| 6 | The ranked edit list: each row names the target sk-code Rust part by file and section, the change in sk-code own words, and the rust-anything file:line that sources it | edit-list | 0.75 | 17 | complete |
| 7 | Verification of the seventeen-row edit list against the target sections and the rust-anything source lines, plus closing the three key questions the reducer still holds open | verification | 0.30 | 11 | complete |
| 8 | The convergence position: what the lineage established, what it verified, and what it could not establish, stated from prior packet evidence only | convergence | 0.05 | 9 | thought |

- iterationsCompleted: 8
- keyFindings: 109
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?
- [x] What are rust-anything's record, bridge, diff, bench, shadow and gate methods (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- [x] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- [x] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- [x] For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████████▇▇▆▆▆▅▄▂▁
- score sparkline: ███████████▇▇▆▆▆▅▄▂▁
- Last 3 ratios: 0.85 -> 0.75 -> 0.30
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.05
- coverageBySources: {"code":121,"other":14}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Counting `unwrap`/`expect` in `src/` as a style signal.** `grep -rn "\.unwrap()\|\.expect(" src | wc -l` = 859, but the count is dominated by test modules inside the same files and by `Regex::new(...).expect("valid regex")` on compile-time-constant patterns. The count says nothing about the policy; the policy is the `PANICS` list in `error_paths.rs`, which is finding 8. Do not re-derive a panic rate from a raw grep. (iteration 1)
- **Reading the manifest as a workspace.** The first pass assumed a `[workspace]` root because sk-code's reference is written entirely in workspace terms. `grep -n "\[workspace\]" Cargo.toml` returns nothing; the package is the root. Recorded as finding 1 rather than retried. (iteration 1)
- **Treating `anyhow` in `src/` as a violation to report.** sk-code's P2 clause explicitly permits it in an application shell, and rust-anything is an application. The finding was re-scoped to the library-module half, where the contradiction is real. (iteration 1)
- **Deriving the cheat guard from `diff`.** `diff` compares recorded cases and cannot see that the port hard-coded them; the guard needs a separate comparison against the original's source text and against a saved test baseline. Any attempt to fold the guard into the diff step is a dead end by construction. [SOURCE: specs/z_external-repo-library/rust-anything-main/DECISIONS.md:48] (iteration 2)
- **Reading `gate` as a single command.** The first pass looked for one gate implementation. `gate.rs` is a dispatcher that pushes a `Check` per concern and returns a `GateOutcome`; the checks are the unit of design, not the command. Recorded as finding 2 rather than retried. (iteration 2)
- **Treating `bench` as a gate check.** `DECISIONS.md:59` says explicitly that it is not, and gives the reason. Recorded as finding 6. (iteration 2)
- **Using `grep -ril "cheat"` as evidence that sk-code has a cheat guard.** The single hit is the heading `## 2. NAMING CHEAT SHEET` in `quick-reference/naming-ordering-and-signatures.md:33`, which is unrelated. Do not re-run this grep expecting a different answer. (iteration 2)
- **Expecting the checklist to carry the type tables.** The checklist's P0 and P1 sections are organised by discipline (DTO and ABI parity, stable error shape, no panic across the boundary, unsafe forbidden in the pure core, golden provenance), not by type. The type mapping has no checklist home, which is itself part of the gap. (iteration 3)
- **Reading `docs/types.md` as a bridge table.** The first pass looked for napi-rs, PyO3 and C ABI sections and found none, because the document's axis is the source language. Re-read on the correct axis; recorded as finding 1 rather than reported as a missing section. (iteration 3)
- **Searching sk-code for a C ABI mapping under a different name.** `c_int`, `c_long`, `size_t`, `repr(C)`, `extern "C"` and the literal phrase `C ABI` all return zero across `references/rust/` and the checklist. There is no C ABI content under any name; do not re-search. (iteration 3)
- **Treating the `Result<T, String>` signature as a defect to fix in sk-code.** It is a scaffold signature, and sk-code's typed-error rule governs the shipped boundary. Recorded as finding 14 with the scope resolution rather than as a contradiction to resolve in sk-code's favour. (iteration 3)
- **Expecting the router to reach an app-style Rust request.** The `RUST` keyword set is `rust`, `.rs`, `cargo.toml`, `cargo.lock`, `napi-rs`, `napi_rs`, `#[napi]`, `wasm-bindgen`, `wasm_bindgen`, `#[wasm_bindgen]`, `wasi`, `cdylib`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/ROUTER.md:81] A request naming `clap`, `ratatui`, `crossterm`, `tokio` or `axum` matches none of the specific terms. (iteration 4)
- **Looking for a Rust app path in sk-code's `SKILL.md`.** The Rust section is a file list of seventeen references and four checklist parts, and the one behavioural statement about Rust is "Rust preserves the TypeScript contract. Rust napi-rs, WASM/WASI, and sidecar modules are compatibility implementations, not independent behavior authorities." [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:139] There is no app path to find; the framing excludes it by construction. Do not re-search for one. (iteration 4)
- **Reading the two skill files as reference documentation.** The first pass looked for rules and found prose. They are steering documents: their unit is the agent's next action, not a fact. Re-read on that axis; the findings above are all about behaviour, not knowledge. (iteration 4)
- **Treating the `#[allow]` versus `#[expect]` difference as a style preference.** It is not: `#[expect]` expires and `#[allow]` does not, so the difference decides whether a stale suppression is ever noticed. Recorded as finding 9 with a recommendation. (iteration 4)
- **Concluding that `clap`, `ratatui` and `crossterm` were forgotten.** The scope statement excludes them by name. Recorded as finding 1 rather than as an omission. (iteration 5)
- **Recommending `forbid` over `deny` for the clippy lints.** sk-code's reason — a reviewed local suppression must remain possible — is correct for a lint that a legitimate case can need. Recorded as finding 5. (iteration 5)
- **Searching for an app-style section under a different name.** The 17 reference files are seven style-guide parts, five quality-standards parts and five quick-reference parts, and the four checklist parts are overview/P0, P0 safety, P1 and P2. There is no app section under any heading; the scope statement is the reason. Do not re-search. (iteration 5)
- **Treating the `rg` panic probe as a panic policy.** `rg -n '\.(unwrap|expect)\(|panic!\(|partial_cmp\([^)]*\)\.unwrap\(\)|\[[^]]+\]' --glob '*.rs'` finds candidates for review; the policy is the clippy deny list in `p1-required.md:171-179`. Reading the probe as the policy understates the set, which is what iteration 1 did. (iteration 5)
- **Adding `forbid` anywhere in the edit list.** sk-code's `deny` has a stated reason and row 11 composes with it rather than replacing it. (iteration 6)
- **Looking for a rust-anything TUI or terminal module.** None exists; the dependency list confirms it. Do not re-search. (iteration 6)
- **Recommending `assert_cmd` or `trycmd` for CLI tests.** rust-anything uses neither and `env!("CARGO_BIN_EXE_...")` with `std::process::Command` covers the same ground with no dependency. Recorded as finding 13. (iteration 6)
- **Sourcing the ratatui rules from rust-anything anyway.** Zero hits across the repository. Recorded as finding 17 rather than stretched to a nearby line. (iteration 6)
- **Treating the app rules as absent from rust-anything.** They are in `whole-app.md`, not in `skills/rust-anything/SKILL.md`. Searching only the per-function skill is what produced iteration 5's "the set lacks app content" framing; the correct statement is that rust-anything carries the app rules in its workflow document and sk-code carries none at all. (iteration 6)
- **Looking for a `SIGPIPE` handler in rust-anything.** There is none; the `say!` macro discards the write error instead. Do not search for a signal-handling module. (iteration 7)
- **Re-verifying the fifteen sk-code sections by reading each in full.** The heading grep establishes existence and line range, which is what the rows claim. Reading each in full would spend the budget without testing a different claim. (iteration 7)
- **Treating the three open questions as unanswered research.** They are answered; the record text was the problem. Recorded as finding 11 rather than re-researched. (iteration 7)
- **Expecting the reducer to declare convergence on its own before maxIterations.** It reports a score, not a stop; the loop's legal end here is maxIterations, and the score's trend is the evidence that the run converged in substance. (iteration 8)
- **Looking for a rust-anything TUI, terminal or signal-handling module.** None exists. Do not re-search. (iteration 8)
- **Opening new research in the final iteration.** The five questions are answered and the list is verified; a new thread would leave the synthesis with an unverified claim. (iteration 8)
- **Stretching a rust-anything citation for the ratatui row.** Zero hits. Recorded as finding 6. (iteration 8)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
