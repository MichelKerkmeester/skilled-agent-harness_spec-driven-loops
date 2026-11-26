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
- Status: COMPLETE
- Iteration: 6 of 8
- Session ID: fanout-vibe-1-1795694320828-so5yva
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | How rust-anything's own Rust is written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in CLAUDE.md | own-rust | 1.00 | 9 | complete |
| 2 | The record, bridge, diff, bench, shadow and gate method in docs/how-it-works.md, docs/pitfalls.md and DECISIONS.md, and which of those methods apply to any Rust port checked against an original | port-method | 1.00 | 12 | complete |
| 3 | How docs/types.md maps values across napi-rs, PyO3, the C ABI and the other bridges | type-mapping | 1.00 | 10 | complete |
| 4 | How skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port | agent-steering | 1.00 | 10 | complete |
| 5 | The cover/contradict/lack table across iterations 1-4 and the app-style gap: what a CLI or ratatui terminal screen needs that the sk-code Rust set lacks | app-style-gap | 0.75 | 12 | complete |
| 6 | The ranked edit list: 25 rows, each naming the target sk-code Rust part, the change and the rust-anything source line | edit-list | 0.50 | 25 | insight |

- iterationsCompleted: 6
- keyFindings: 78
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?
- [x] What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- [x] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- [x] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- [x] For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████████████▇▇▆▅▄▃▂▁
- score sparkline: ████████████▇▇▆▅▄▃▂▁
- Last 3 ratios: 1.00 -> 0.75 -> 0.50
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.50
- coverageBySources: {"other":37}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading `specs/z_external-repo-library/rust-anything-main` directly: the path does not exist in this worktree (`ls` returned "No such file or directory"). Fell back to the Trash copy rather than reporting the question unanswered. (iteration 1)
- Searching the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `float_roundtrip`, `preserve_order`, `deny_unknown_fields`, `tests/fixtures` and `integration test`: all returned zero files. These are confirmed absences, not search misses, so later iterations need not re-run them. (iteration 1)
- Treating rust-anything's `anyhow` usage as a sk-code contradiction to be resolved by weakening the sk-code rule: the sk-code rule is correct for a binding core, so the finding is recorded as a scope gap (app-shaped crates need a different default), not as a sk-code error. (iteration 1)
- Grepping the sk-code Rust set for `shadow`, `stale`, `RULES.md`, `known-diffs`, `recorded-literal` and `fingerprint`: all zero. Confirmed absences; later iterations need not re-run them. (iteration 2)
- Reading `docs/whole-apps.md` in this iteration: it is the whole-app frame, which belongs to key question 4's steering question and to the app-style gap in key question 5. Deferred rather than read shallowly here. (iteration 2)
- Treating the `// INFALLIBLE:` marker as a contradiction of sk-code's clippy denial: the two are compatible (deny by default, mark the exception), so it is recorded as a missing escape hatch, not a conflict. (iteration 2)
- Grepping the sk-code Rust set for `std::ffi`, `c_int`, `c_char`, `repr(C)`, `PyO3`, `serde_json::Value` and `refused`: all zero. Confirmed absences; later iterations need not re-run them. (iteration 3)
- Reading the Go, Java, Kotlin, C#, Ruby, PHP and PowerShell sections in full: their headings confirm the same table shape, and the C section already supplies the ABI-width lesson the topic asks about. Reading seven more tables would have spent the budget without changing a verdict. (iteration 3)
- Searching `docs/types.md` for PyO3: zero hits. The bridge name lives in the website docs only. (iteration 3)
- Treating `Result<T, String>` as a rule to copy into sk-code: it is a scaffold convention for generated code whose error text is deliberately not compared, so copying it would weaken sk-code's typed-error rule. (iteration 3)
- Grepping the sk-code Rust set for `ask the user`, `wait for`, `approval` and `go-ahead`: only the checklist severity legend matched. Confirmed absence of stop gates; later iterations need not re-run it. (iteration 4)
- Reading `docs/whole-apps.md` (347 lines) in this iteration: `skills/rust-anything/whole-app.md` is the agent-facing steering document the question names, and it already carries the map, the claim protocol and the interview. The longer doc is the human-facing frame and belongs to key question 5's app-style gap. (iteration 4)
- Treating the stop gates as a conflict with sk-code's autonomous workflow doctrine: sk-code's doctrine governs its own implement/debug/verify loop, not a port against an external original, so the gates are recorded as a missing construct rather than a contradiction. (iteration 4)
- Claiming rust-anything supplies a ratatui or signal standard: it does not, and saying so would have produced a false edit target. Both are recorded as gaps in both surfaces. (iteration 5)
- Grepping the sk-code Rust set for `ratatui`, `crossterm`, `clap`, `signal`, `SIGINT`, `Ctrl-C`, `is_terminal`, `NO_COLOR`, `progress`: all zero. Confirmed absences. (iteration 5)
- Grepping the sk-code Rust set for `tty`: 21 files matched, but every hit is the substring inside "pretty". Recorded so a later iteration does not mistake it for terminal coverage. (iteration 5)
- Reading `docs/whole-apps.md` §Servers and §Libraries in full: the CLI frame in §Port a whole app already supplies the app-style findings, and the server and library frames repeat the same replay and fallback machinery. (iteration 5)
- Inventing a rust-anything source line for ratatui, signals, `is_terminal` or progress: none exists, so rank 25 names them as out-of-source instead. (iteration 6)
- None this iteration. Every row resolves to a section that exists in the target file, checked against the heading listing. (iteration 6)
- Ranking by file instead of by verdict: the topic asks for a ranked list, and a file-ordered list would bury the three contradictions under the 32 lacks. (iteration 6)

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
