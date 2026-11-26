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
- Started: 2026-11-26T12:00:29Z
- Status: INITIALIZED
- Iteration: 1 of 8
- Session ID: fanout-vibe-2-1795694320828-so5yva
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | rust-anything's own Rust: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, and the test layout and fixtures under tests/ | own-rust | 1.00 | 20 | complete |

- iterationsCompleted: 1
- keyFindings: 18
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, and the test layout and fixtures under tests/?
- [ ] What are rust-anything's record, bridge, diff, bench, shadow and gate methods in docs/how-it-works.md, docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original? [legacy-import]
- [ ] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges? [legacy-import]
- [ ] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port? [legacy-import]
- [ ] For each finding, does the existing sk-code Rust set under references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] What are rust-anything's record, bridge, diff, bench, shadow and gate methods in docs/how-it-works.md, docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- [ ] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- [ ] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- [ ] For each finding, does the existing sk-code Rust set under references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":22}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading `src/main.rs` end to end (2227 lines) to characterise the CLI. The derive attributes at 25-50 and the `main`/`run` split at 824-834 carry the contract; the remaining 2000 lines are per-subcommand bodies that repeat the same `say!` and `ExitCode` pattern. (iteration 1)
- Searching for a `[workspace]` table or a `rust-toolchain.toml` in rust-anything. Neither exists, so the workspace-inheritance rules sk-code mandates have no counterpart here and cannot be cited as covered. (iteration 1)
- Treating the 809 `.unwrap()` count as a production-code smell. Splitting at each file's first `#[cfg(test)]` line reduced it to one, so the raw count was a measurement artefact. (iteration 1)

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
Key question 2: the record, bridge, diff, bench, shadow and gate methods in `docs/how-it-works.md`, `docs/pitfalls.md` and `DECISIONS.md`, and which of them apply to any Rust port checked against an original.

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
