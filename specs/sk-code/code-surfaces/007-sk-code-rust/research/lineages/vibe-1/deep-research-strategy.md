---
title: Deep Research Strategy - rust-anything as a source for sk-code Rust standards
description: Lineage strategy for the vibe-1 fan-out lineage of the 007-sk-code-rust research run.
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - rust-anything as a source for sk-code Rust standards

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage

- **Init:** populated with Topic, Key Questions, Known Context, and Research Boundaries.
- **Per iteration:** the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** analyst-owned sections remain stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

rust-anything (specs/z_external-repo-library/rust-anything-main, read-only) as a source for sk-code's Rust standards. Questions: (1) How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md? (2) What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original? (3) How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges? (4) How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port? (5) For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks? Cite file:line for every claim. End with a ranked edit list, each naming the target sk-code Rust part, the change and the rust-anything source line.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?
- [x] What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- [x] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- [x] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- [x] For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not editing rust-anything. It is read-only source material.
- Not editing the sk-code Rust set from inside this lineage. The lineage produces a ranked edit list; the parent run applies it.
- Not re-deciding D1-D4 of the durable directive (Rust stays in sk-code-skilled; three lineages; rust-anything read-only; napi-rs/WASM parity keeps its meaning).
- Not copying rust-anything files into sk-code. Rules are restated in sk-code's own words with a source line.

---

## 5. STOP CONDITIONS

- Convergence: newInfoRatio below 0.05 after the minIterations floor of 3.
- Iteration cap: 8.
- Stuck: 3 consecutive iterations without productive avenues.
- All five key questions answered with cited evidence and a ranked edit list assembled.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?
- What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the manifest and `CLAUDE.md` first gave a checklist of exactly the surfaces the question names, so each later read had a target. Counting greps (`grep -rl | wc -l`) turned "does sk-code cover this" into a number instead of an impression, which is why the cover/contradict/lack verdicts are defensible. (iteration 1)
- reading the pipeline diagram and the loop table before the prose gave the six stage names as a checklist, so each later grep tested a named thing. Reading `DECISIONS.md` after `how-it-works.md` supplied the *reason* for each stage, which is what makes a rule portable to sk-code rather than a copied command name. (iteration 2)
- reading the "How to read the tables" preamble before any table gave the four verdict words (`Port type`, `serde_json::Value`, `refused`, `Option<T>`) as the search terms, so the sk-code comparison tested concepts rather than type names. That is why finding 4 and finding 6 surfaced at all. (iteration 3)
- reading the skill as a procedure rather than as a reference list made the difference. The stop gates, the write-surface rule and the stall detector are all *sequencing* constructs, and they only become visible when you read the file in order and notice where it tells the agent to stop. (iteration 4)
- counting the verdicts instead of listing them turned 41 findings into one number, and the 32-to-6 lack ratio is what justifies a large edit rather than a patch. Grepping the app-style concerns as a batch also separated the gaps rust-anything can fill (clap, exit codes, trycmd cases, replay report, fallback rate) from the gaps it cannot (ratatui, signals, `is_terminal`, `NO_COLOR`, progress). (iteration 5)
- reading the target files' heading listings before writing any row meant every target names a section that exists, which is what makes the list applicable rather than aspirational. Ranking by verdict rather than by file put the three contradictions at the top, where a wrong rule does the most damage. (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first attempt to read the topic's rust-anything path failed because the repository is not in this worktree. The recovery was a filesystem search, which found the Trash copy; the cost was one wasted call. (iteration 1)
- nothing failed this iteration. The one judgement call was deferring `docs/whole-apps.md`; reading it here would have blurred key question 2 into key question 4. (iteration 2)
- the topic's PyO3 premise did not survive contact with the file. The recovery was to grep the website docs, which found the bridge row and turned a dead end into finding 10. (iteration 3)
- nothing failed. The one judgement call was deferring `docs/whole-apps.md`; the skill's own `whole-app.md` answered the question the topic asked, so the longer doc would have been redundant here. (iteration 4)
- the `tty` grep returned 21 files and looked like terminal coverage until the hits were read; every one was the substring inside "pretty". A substring grep on a short token is not evidence. (iteration 5)
- nothing failed. The one discipline that mattered was refusing to invent a rust-anything line for ratatui, signals, `is_terminal` and progress; rank 25 names them as out-of-source instead, which is the honest form. (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Claiming rust-anything supplies a ratatui or signal standard: it does not, and saying so would have produced a false edit target. Both are recorded as gaps in both surfaces. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Claiming rust-anything supplies a ratatui or signal standard: it does not, and saying so would have produced a false edit target. Both are recorded as gaps in both surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming rust-anything supplies a ratatui or signal standard: it does not, and saying so would have produced a false edit target. Both are recorded as gaps in both surfaces.

### Grepping the sk-code Rust set for `ask the user`, `wait for`, `approval` and `go-ahead`: only the checklist severity legend matched. Confirmed absence of stop gates; later iterations need not re-run it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Grepping the sk-code Rust set for `ask the user`, `wait for`, `approval` and `go-ahead`: only the checklist severity legend matched. Confirmed absence of stop gates; later iterations need not re-run it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the sk-code Rust set for `ask the user`, `wait for`, `approval` and `go-ahead`: only the checklist severity legend matched. Confirmed absence of stop gates; later iterations need not re-run it.

### Grepping the sk-code Rust set for `ratatui`, `crossterm`, `clap`, `signal`, `SIGINT`, `Ctrl-C`, `is_terminal`, `NO_COLOR`, `progress`: all zero. Confirmed absences. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Grepping the sk-code Rust set for `ratatui`, `crossterm`, `clap`, `signal`, `SIGINT`, `Ctrl-C`, `is_terminal`, `NO_COLOR`, `progress`: all zero. Confirmed absences.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the sk-code Rust set for `ratatui`, `crossterm`, `clap`, `signal`, `SIGINT`, `Ctrl-C`, `is_terminal`, `NO_COLOR`, `progress`: all zero. Confirmed absences.

### Grepping the sk-code Rust set for `shadow`, `stale`, `RULES.md`, `known-diffs`, `recorded-literal` and `fingerprint`: all zero. Confirmed absences; later iterations need not re-run them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Grepping the sk-code Rust set for `shadow`, `stale`, `RULES.md`, `known-diffs`, `recorded-literal` and `fingerprint`: all zero. Confirmed absences; later iterations need not re-run them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the sk-code Rust set for `shadow`, `stale`, `RULES.md`, `known-diffs`, `recorded-literal` and `fingerprint`: all zero. Confirmed absences; later iterations need not re-run them.

### Grepping the sk-code Rust set for `std::ffi`, `c_int`, `c_char`, `repr(C)`, `PyO3`, `serde_json::Value` and `refused`: all zero. Confirmed absences; later iterations need not re-run them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Grepping the sk-code Rust set for `std::ffi`, `c_int`, `c_char`, `repr(C)`, `PyO3`, `serde_json::Value` and `refused`: all zero. Confirmed absences; later iterations need not re-run them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the sk-code Rust set for `std::ffi`, `c_int`, `c_char`, `repr(C)`, `PyO3`, `serde_json::Value` and `refused`: all zero. Confirmed absences; later iterations need not re-run them.

### Grepping the sk-code Rust set for `tty`: 21 files matched, but every hit is the substring inside "pretty". Recorded so a later iteration does not mistake it for terminal coverage. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Grepping the sk-code Rust set for `tty`: 21 files matched, but every hit is the substring inside "pretty". Recorded so a later iteration does not mistake it for terminal coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the sk-code Rust set for `tty`: 21 files matched, but every hit is the substring inside "pretty". Recorded so a later iteration does not mistake it for terminal coverage.

### Inventing a rust-anything source line for ratatui, signals, `is_terminal` or progress: none exists, so rank 25 names them as out-of-source instead. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Inventing a rust-anything source line for ratatui, signals, `is_terminal` or progress: none exists, so rank 25 names them as out-of-source instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inventing a rust-anything source line for ratatui, signals, `is_terminal` or progress: none exists, so rank 25 names them as out-of-source instead.

### None this iteration. Every row resolves to a section that exists in the target file, checked against the heading listing. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None this iteration. Every row resolves to a section that exists in the target file, checked against the heading listing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. Every row resolves to a section that exists in the target file, checked against the heading listing.

### Ranking by file instead of by verdict: the topic asks for a ranked list, and a file-ordered list would bury the three contradictions under the 32 lacks. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Ranking by file instead of by verdict: the topic asks for a ranked list, and a file-ordered list would bury the three contradictions under the 32 lacks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking by file instead of by verdict: the topic asks for a ranked list, and a file-ordered list would bury the three contradictions under the 32 lacks.

### Reading `docs/whole-apps.md` (347 lines) in this iteration: `skills/rust-anything/whole-app.md` is the agent-facing steering document the question names, and it already carries the map, the claim protocol and the interview. The longer doc is the human-facing frame and belongs to key question 5's app-style gap. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading `docs/whole-apps.md` (347 lines) in this iteration: `skills/rust-anything/whole-app.md` is the agent-facing steering document the question names, and it already carries the map, the claim protocol and the interview. The longer doc is the human-facing frame and belongs to key question 5's app-style gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `docs/whole-apps.md` (347 lines) in this iteration: `skills/rust-anything/whole-app.md` is the agent-facing steering document the question names, and it already carries the map, the claim protocol and the interview. The longer doc is the human-facing frame and belongs to key question 5's app-style gap.

### Reading `docs/whole-apps.md` §Servers and §Libraries in full: the CLI frame in §Port a whole app already supplies the app-style findings, and the server and library frames repeat the same replay and fallback machinery. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading `docs/whole-apps.md` §Servers and §Libraries in full: the CLI frame in §Port a whole app already supplies the app-style findings, and the server and library frames repeat the same replay and fallback machinery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `docs/whole-apps.md` §Servers and §Libraries in full: the CLI frame in §Port a whole app already supplies the app-style findings, and the server and library frames repeat the same replay and fallback machinery.

### Reading `docs/whole-apps.md` in this iteration: it is the whole-app frame, which belongs to key question 4's steering question and to the app-style gap in key question 5. Deferred rather than read shallowly here. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading `docs/whole-apps.md` in this iteration: it is the whole-app frame, which belongs to key question 4's steering question and to the app-style gap in key question 5. Deferred rather than read shallowly here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `docs/whole-apps.md` in this iteration: it is the whole-app frame, which belongs to key question 4's steering question and to the app-style gap in key question 5. Deferred rather than read shallowly here.

### Reading `specs/z_external-repo-library/rust-anything-main` directly: the path does not exist in this worktree (`ls` returned "No such file or directory"). Fell back to the Trash copy rather than reporting the question unanswered. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `specs/z_external-repo-library/rust-anything-main` directly: the path does not exist in this worktree (`ls` returned "No such file or directory"). Fell back to the Trash copy rather than reporting the question unanswered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `specs/z_external-repo-library/rust-anything-main` directly: the path does not exist in this worktree (`ls` returned "No such file or directory"). Fell back to the Trash copy rather than reporting the question unanswered.

### Reading the Go, Java, Kotlin, C#, Ruby, PHP and PowerShell sections in full: their headings confirm the same table shape, and the C section already supplies the ABI-width lesson the topic asks about. Reading seven more tables would have spent the budget without changing a verdict. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the Go, Java, Kotlin, C#, Ruby, PHP and PowerShell sections in full: their headings confirm the same table shape, and the C section already supplies the ABI-width lesson the topic asks about. Reading seven more tables would have spent the budget without changing a verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the Go, Java, Kotlin, C#, Ruby, PHP and PowerShell sections in full: their headings confirm the same table shape, and the C section already supplies the ABI-width lesson the topic asks about. Reading seven more tables would have spent the budget without changing a verdict.

### Searching `docs/types.md` for PyO3: zero hits. The bridge name lives in the website docs only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching `docs/types.md` for PyO3: zero hits. The bridge name lives in the website docs only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `docs/types.md` for PyO3: zero hits. The bridge name lives in the website docs only.

### Searching the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `float_roundtrip`, `preserve_order`, `deny_unknown_fields`, `tests/fixtures` and `integration test`: all returned zero files. These are confirmed absences, not search misses, so later iterations need not re-run them. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `float_roundtrip`, `preserve_order`, `deny_unknown_fields`, `tests/fixtures` and `integration test`: all returned zero files. These are confirmed absences, not search misses, so later iterations need not re-run them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the sk-code Rust set for `clap`, `ratatui`, `crossterm`, `float_roundtrip`, `preserve_order`, `deny_unknown_fields`, `tests/fixtures` and `integration test`: all returned zero files. These are confirmed absences, not search misses, so later iterations need not re-run them.

### Treating `Result<T, String>` as a rule to copy into sk-code: it is a scaffold convention for generated code whose error text is deliberately not compared, so copying it would weaken sk-code's typed-error rule. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `Result<T, String>` as a rule to copy into sk-code: it is a scaffold convention for generated code whose error text is deliberately not compared, so copying it would weaken sk-code's typed-error rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `Result<T, String>` as a rule to copy into sk-code: it is a scaffold convention for generated code whose error text is deliberately not compared, so copying it would weaken sk-code's typed-error rule.

### Treating rust-anything's `anyhow` usage as a sk-code contradiction to be resolved by weakening the sk-code rule: the sk-code rule is correct for a binding core, so the finding is recorded as a scope gap (app-shaped crates need a different default), not as a sk-code error. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating rust-anything's `anyhow` usage as a sk-code contradiction to be resolved by weakening the sk-code rule: the sk-code rule is correct for a binding core, so the finding is recorded as a scope gap (app-shaped crates need a different default), not as a sk-code error.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating rust-anything's `anyhow` usage as a sk-code contradiction to be resolved by weakening the sk-code rule: the sk-code rule is correct for a binding core, so the finding is recorded as a scope gap (app-shaped crates need a different default), not as a sk-code error.

### Treating the `// INFALLIBLE:` marker as a contradiction of sk-code's clippy denial: the two are compatible (deny by default, mark the exception), so it is recorded as a missing escape hatch, not a conflict. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the `// INFALLIBLE:` marker as a contradiction of sk-code's clippy denial: the two are compatible (deny by default, mark the exception), so it is recorded as a missing escape hatch, not a conflict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `// INFALLIBLE:` marker as a contradiction of sk-code's clippy denial: the two are compatible (deny by default, mark the exception), so it is recorded as a missing escape hatch, not a conflict.

### Treating the stop gates as a conflict with sk-code's autonomous workflow doctrine: sk-code's doctrine governs its own implement/debug/verify loop, not a port against an external original, so the gates are recorded as a missing construct rather than a contradiction. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the stop gates as a conflict with sk-code's autonomous workflow doctrine: sk-code's doctrine governs its own implement/debug/verify loop, not a port against an external original, so the gates are recorded as a missing construct rather than a contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the stop gates as a conflict with sk-code's autonomous workflow doctrine: sk-code's doctrine governs its own implement/debug/verify loop, not a port against an external original, so the gates are recorded as a missing construct rather than a contradiction.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: rust-anything lives at `specs/z_external-repo-library/rust-anything-main` per the topic, but that path is absent from this worktree; the only readable copy is `/Users/michelkerkmeester/.Trash/rust-anything-main`. Treat the Trash copy as the read-only source and cite it by its absolute path.
- sk-code Rust set: `.skilled/skills/sk-code/sk-code-skilled/references/rust/` holds `quality-standards/`, `quick-reference/`, `style-guide/`; `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/` holds `overview-and-p0-parity.md`, `p0-safety-and-boundary-discipline.md`, `p1-required.md`, `p2-evidence-validation-and-resources.md`.
- Integration points: the ranked edit list must name a target sk-code Rust part per row, so the parent run can apply it without re-deriving the mapping.
- Constraints and risks: rust-anything is a napi-rs/PyO3/C-ABI binding library plus a CLI, so its own Rust is app-shaped in places and binding-shaped in others; the sk-code set is binding-shaped today, which is the gap the topic asks about.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` (live); `fork` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-26T12:00:29Z
