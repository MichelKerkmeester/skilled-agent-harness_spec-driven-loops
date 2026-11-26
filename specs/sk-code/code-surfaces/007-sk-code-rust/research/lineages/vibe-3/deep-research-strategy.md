---
title: Deep Research Strategy - vibe-3 lineage
description: Runtime strategy for the vibe-3 fan-out lineage researching rust-anything as a source for sk-code's Rust standards.
trigger_phrases:
  - "deep research strategy"
  - "vibe-3 lineage strategy"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - vibe-3 Lineage

Runtime strategy for the `vibe-3` fan-out lineage of the `007-sk-code-rust` research run.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read by the executor at every iteration.

### Usage

- **Init:** populated from the run config and the fan-out research topic.
- **Per iteration:** the executor reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
rust-anything (specs/z_external-repo-library/rust-anything-main, read-only) as a source for sk-code's Rust standards. Questions: (1) How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md? (2) What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original? (3) How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges? (4) How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port? (5) For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks? Cite file:line for every claim. End with a ranked edit list, each naming the target sk-code Rust part, the change and the rust-anything source line.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?
- [x] What are rust-anything's record, bridge, diff, bench, shadow and gate methods (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- [x] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- [x] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- [x] For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing rust-anything. It is read-only; every rule is restated in sk-code's own words with a source line.
- Creating a new sk-code surface packet. Rust stays inside `sk-code-skilled`.
- Changing stack detection in `stack-detection.md`.
- Weakening the napi-rs and WASM parity rules.
- Running the repo's build, test or validation tooling. This lineage writes only inside its own directory.

---

## 5. STOP CONDITIONS
- Convergence: `newInfoRatio` at or below `0.05` for the trailing window after `minIterations` 3.
- `maxIterations` 8 reached.
- All five key questions answered with cited evidence and a ranked edit list produced.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?
- What are rust-anything's record, bridge, diff, bench, shadow and gate methods (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the manifest and `CLAUDE.md` first gave a one-screen map of the crate's declared policy, so every later grep had a target to confirm or contradict. The `grep -ril` coverage matrix over `references/rust/` and the checklist was the highest-value single call: it turned "does sk-code cover this" from a judgement into a count, and the zeros (`clap`, `ratatui`, `crossterm`, `ExitCode`, `float_roundtrip`, `preserve_order`) are the findings that will drive the edit list. (iteration 1)
- reading `DECISIONS.md` before `gate.rs` was the right order. The decision table states the reason for each check in one sentence, so when `gate.rs` was read afterwards every constant had a motive attached — `MAX_GROWTH = 3.0` is not an arbitrary number once `DECISIONS.md:48` explains that over-growth means hand-rolled crate code. Reading the implementation first would have produced a list of checks with no argument for adopting them. (iteration 2)
- reading the document's own "How to read the tables" preamble first (lines 7-20) gave the four conventions — port type, `serde_json::Value`, refused, default-becomes-`Option` — before any table, so every row afterwards was read against a stated rule rather than as an isolated fact. That preamble is also where the executable-doc rule lives, which turned out to be finding 4 and the most reusable practice in the file. (iteration 3)
- reading the two files end to end rather than grepping them was necessary, because their value is in ordering and emphasis — the completion criterion is line 9, the capability limits are lines 20-24, the trap list is lines 114-152, the report contract is lines 253-258. A grep for "must" or "never" would have returned the same sentences stripped of the position that gives them force. (iteration 4)
- reading the checklist's Scope section first, before any coverage grep, produced the finding that explains every other one. The scope statement is the set's own statement of what it is for, and once it was read the zeros stopped being a list of omissions and became a single decision. That is the difference between a coverage pass that produces forty edits and one that produces a scope edit plus a short list. (iteration 5)
- reading `whole-app.md` before writing the list changed the list. Iteration 5 had concluded that the app content was missing; it is not missing from rust-anything, it is in the workflow document rather than the per-function skill. That reframing turned four rows from "invent a rule" into "restate a rule that exists", which is what D3 requires and what makes the list traceable. (iteration 6)
- verifying the four source anchors that iteration 6 cited but never read — `src/main.rs` lines 6-12, 21-52 and 824-834 — produced all three refinements. The rows were directionally right and imprecise in the way that matters for a rule: "a documented non-zero code" cannot be asserted by a test, and "2" can. Citing a line range is not the same as reading it, and the difference showed up in exactly the rows where the rule had to be operational. (iteration 7)
- reading the target's own scope statement before grepping for terms. It converted a list of forty apparent omissions into one scope decision plus a short edit list, and it is the reason the list is seventeen rows rather than a rewrite proposal. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the raw `unwrap`/`expect` count produced a number with no meaning, because test modules and compile-time-constant `expect` calls dominate it. Counting occurrences is not the same as reading a policy. (iteration 1)
- the `grep -ril "cheat"` coverage probe returned a false positive from a "CHEAT SHEET" heading. A case-insensitive single-word grep over prose is not a reliable coverage test; the reliable form is to grep for the distinctive token the rule would use (`recorded-literal`, `INFALLIBLE`, `SAFETY:`), which is what the other probes did. (iteration 2)
- the first pass searched for bridge names and concluded the document was incomplete. It was not incomplete; it was organised on a different axis. A document's section list is evidence about its axis, and skipping it cost a pass. (iteration 3)
- the first pass tried to classify each sentence as a rule and produced a flat list with no structure. The structure is the document's own: entry point, limits, per-unit loop, proof, ship, report. Once the findings were grouped by that skeleton, the gaps in sk-code became obvious — it has the proof and none of the other five. (iteration 4)
- three earlier findings were overstated because they were derived from lowercase crate-name greps and from reading a probe as a policy. `indexmap` versus `IndexMap`, and the `rg` panic probe versus the clippy deny list, are both cases where the grep answered a narrower question than the one asked. The corrections cost a third of this iteration and were worth it. (iteration 5)
- the first four iterations read `skills/rust-anything/SKILL.md` and `whole-app.md` as one document. They are two documents with different units — the skill is per-function rules, the workflow is per-app phases — and reading them together hid the app rules behind the function rules. The cost was iteration 5's overstatement. (iteration 6)
- nothing failed this iteration, which is itself informative. Iteration 5's corrections came from greps that answered a narrower question than the one asked; this iteration asked the narrow question deliberately and got clean answers. (iteration 7)
- the first four iterations read `skills/rust-anything/SKILL.md` and `whole-app.md` as one document. They have different units — per-function rules versus per-app phases — and reading them together hid the app rules behind the function rules, which cost iteration 5 a correction. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Adding `forbid` anywhere in the edit list.** sk-code's `deny` has a stated reason and row 11 composes with it rather than replacing it. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Adding `forbid` anywhere in the edit list.** sk-code's `deny` has a stated reason and row 11 composes with it rather than replacing it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding `forbid` anywhere in the edit list.** sk-code's `deny` has a stated reason and row 11 composes with it rather than replacing it.

### **Concluding that `clap`, `ratatui` and `crossterm` were forgotten.** The scope statement excludes them by name. Recorded as finding 1 rather than as an omission. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Concluding that `clap`, `ratatui` and `crossterm` were forgotten.** The scope statement excludes them by name. Recorded as finding 1 rather than as an omission.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Concluding that `clap`, `ratatui` and `crossterm` were forgotten.** The scope statement excludes them by name. Recorded as finding 1 rather than as an omission.

### **Counting `unwrap`/`expect` in `src/` as a style signal.** `grep -rn "\.unwrap()\|\.expect(" src | wc -l` = 859, but the count is dominated by test modules inside the same files and by `Regex::new(...).expect("valid regex")` on compile-time-constant patterns. The count says nothing about the policy; the policy is the `PANICS` list in `error_paths.rs`, which is finding 8. Do not re-derive a panic rate from a raw grep. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Counting `unwrap`/`expect` in `src/` as a style signal.** `grep -rn "\.unwrap()\|\.expect(" src | wc -l` = 859, but the count is dominated by test modules inside the same files and by `Regex::new(...).expect("valid regex")` on compile-time-constant patterns. The count says nothing about the policy; the policy is the `PANICS` list in `error_paths.rs`, which is finding 8. Do not re-derive a panic rate from a raw grep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting `unwrap`/`expect` in `src/` as a style signal.** `grep -rn "\.unwrap()\|\.expect(" src | wc -l` = 859, but the count is dominated by test modules inside the same files and by `Regex::new(...).expect("valid regex")` on compile-time-constant patterns. The count says nothing about the policy; the policy is the `PANICS` list in `error_paths.rs`, which is finding 8. Do not re-derive a panic rate from a raw grep.

### **Deriving the cheat guard from `diff`.** `diff` compares recorded cases and cannot see that the port hard-coded them; the guard needs a separate comparison against the original's source text and against a saved test baseline. Any attempt to fold the guard into the diff step is a dead end by construction. [SOURCE: specs/z_external-repo-library/rust-anything-main/DECISIONS.md:48] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Deriving the cheat guard from `diff`.** `diff` compares recorded cases and cannot see that the port hard-coded them; the guard needs a separate comparison against the original's source text and against a saved test baseline. Any attempt to fold the guard into the diff step is a dead end by construction. [SOURCE: specs/z_external-repo-library/rust-anything-main/DECISIONS.md:48]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the cheat guard from `diff`.** `diff` compares recorded cases and cannot see that the port hard-coded them; the guard needs a separate comparison against the original's source text and against a saved test baseline. Any attempt to fold the guard into the diff step is a dead end by construction. [SOURCE: specs/z_external-repo-library/rust-anything-main/DECISIONS.md:48]

### **Expecting the checklist to carry the type tables.** The checklist's P0 and P1 sections are organised by discipline (DTO and ABI parity, stable error shape, no panic across the boundary, unsafe forbidden in the pure core, golden provenance), not by type. The type mapping has no checklist home, which is itself part of the gap. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Expecting the checklist to carry the type tables.** The checklist's P0 and P1 sections are organised by discipline (DTO and ABI parity, stable error shape, no panic across the boundary, unsafe forbidden in the pure core, golden provenance), not by type. The type mapping has no checklist home, which is itself part of the gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Expecting the checklist to carry the type tables.** The checklist's P0 and P1 sections are organised by discipline (DTO and ABI parity, stable error shape, no panic across the boundary, unsafe forbidden in the pure core, golden provenance), not by type. The type mapping has no checklist home, which is itself part of the gap.

### **Expecting the reducer to declare convergence on its own before maxIterations.** It reports a score, not a stop; the loop's legal end here is maxIterations, and the score's trend is the evidence that the run converged in substance. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Expecting the reducer to declare convergence on its own before maxIterations.** It reports a score, not a stop; the loop's legal end here is maxIterations, and the score's trend is the evidence that the run converged in substance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Expecting the reducer to declare convergence on its own before maxIterations.** It reports a score, not a stop; the loop's legal end here is maxIterations, and the score's trend is the evidence that the run converged in substance.

### **Expecting the router to reach an app-style Rust request.** The `RUST` keyword set is `rust`, `.rs`, `cargo.toml`, `cargo.lock`, `napi-rs`, `napi_rs`, `#[napi]`, `wasm-bindgen`, `wasm_bindgen`, `#[wasm_bindgen]`, `wasi`, `cdylib`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/ROUTER.md:81] A request naming `clap`, `ratatui`, `crossterm`, `tokio` or `axum` matches none of the specific terms. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Expecting the router to reach an app-style Rust request.** The `RUST` keyword set is `rust`, `.rs`, `cargo.toml`, `cargo.lock`, `napi-rs`, `napi_rs`, `#[napi]`, `wasm-bindgen`, `wasm_bindgen`, `#[wasm_bindgen]`, `wasi`, `cdylib`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/ROUTER.md:81] A request naming `clap`, `ratatui`, `crossterm`, `tokio` or `axum` matches none of the specific terms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Expecting the router to reach an app-style Rust request.** The `RUST` keyword set is `rust`, `.rs`, `cargo.toml`, `cargo.lock`, `napi-rs`, `napi_rs`, `#[napi]`, `wasm-bindgen`, `wasm_bindgen`, `#[wasm_bindgen]`, `wasi`, `cdylib`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/ROUTER.md:81] A request naming `clap`, `ratatui`, `crossterm`, `tokio` or `axum` matches none of the specific terms.

### **Looking for a `SIGPIPE` handler in rust-anything.** There is none; the `say!` macro discards the write error instead. Do not search for a signal-handling module. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Looking for a `SIGPIPE` handler in rust-anything.** There is none; the `say!` macro discards the write error instead. Do not search for a signal-handling module.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a `SIGPIPE` handler in rust-anything.** There is none; the `say!` macro discards the write error instead. Do not search for a signal-handling module.

### **Looking for a Rust app path in sk-code's `SKILL.md`.** The Rust section is a file list of seventeen references and four checklist parts, and the one behavioural statement about Rust is "Rust preserves the TypeScript contract. Rust napi-rs, WASM/WASI, and sidecar modules are compatibility implementations, not independent behavior authorities." [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:139] There is no app path to find; the framing excludes it by construction. Do not re-search for one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for a Rust app path in sk-code's `SKILL.md`.** The Rust section is a file list of seventeen references and four checklist parts, and the one behavioural statement about Rust is "Rust preserves the TypeScript contract. Rust napi-rs, WASM/WASI, and sidecar modules are compatibility implementations, not independent behavior authorities." [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:139] There is no app path to find; the framing excludes it by construction. Do not re-search for one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a Rust app path in sk-code's `SKILL.md`.** The Rust section is a file list of seventeen references and four checklist parts, and the one behavioural statement about Rust is "Rust preserves the TypeScript contract. Rust napi-rs, WASM/WASI, and sidecar modules are compatibility implementations, not independent behavior authorities." [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:139] There is no app path to find; the framing excludes it by construction. Do not re-search for one.

### **Looking for a rust-anything TUI or terminal module.** None exists; the dependency list confirms it. Do not re-search. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Looking for a rust-anything TUI or terminal module.** None exists; the dependency list confirms it. Do not re-search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a rust-anything TUI or terminal module.** None exists; the dependency list confirms it. Do not re-search.

### **Looking for a rust-anything TUI, terminal or signal-handling module.** None exists. Do not re-search. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Looking for a rust-anything TUI, terminal or signal-handling module.** None exists. Do not re-search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a rust-anything TUI, terminal or signal-handling module.** None exists. Do not re-search.

### **Opening new research in the final iteration.** The five questions are answered and the list is verified; a new thread would leave the synthesis with an unverified claim. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Opening new research in the final iteration.** The five questions are answered and the list is verified; a new thread would leave the synthesis with an unverified claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Opening new research in the final iteration.** The five questions are answered and the list is verified; a new thread would leave the synthesis with an unverified claim.

### **Re-verifying the fifteen sk-code sections by reading each in full.** The heading grep establishes existence and line range, which is what the rows claim. Reading each in full would spend the budget without testing a different claim. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Re-verifying the fifteen sk-code sections by reading each in full.** The heading grep establishes existence and line range, which is what the rows claim. Reading each in full would spend the budget without testing a different claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-verifying the fifteen sk-code sections by reading each in full.** The heading grep establishes existence and line range, which is what the rows claim. Reading each in full would spend the budget without testing a different claim.

### **Reading `docs/types.md` as a bridge table.** The first pass looked for napi-rs, PyO3 and C ABI sections and found none, because the document's axis is the source language. Re-read on the correct axis; recorded as finding 1 rather than reported as a missing section. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading `docs/types.md` as a bridge table.** The first pass looked for napi-rs, PyO3 and C ABI sections and found none, because the document's axis is the source language. Re-read on the correct axis; recorded as finding 1 rather than reported as a missing section.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `docs/types.md` as a bridge table.** The first pass looked for napi-rs, PyO3 and C ABI sections and found none, because the document's axis is the source language. Re-read on the correct axis; recorded as finding 1 rather than reported as a missing section.

### **Reading `gate` as a single command.** The first pass looked for one gate implementation. `gate.rs` is a dispatcher that pushes a `Check` per concern and returns a `GateOutcome`; the checks are the unit of design, not the command. Recorded as finding 2 rather than retried. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reading `gate` as a single command.** The first pass looked for one gate implementation. `gate.rs` is a dispatcher that pushes a `Check` per concern and returns a `GateOutcome`; the checks are the unit of design, not the command. Recorded as finding 2 rather than retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `gate` as a single command.** The first pass looked for one gate implementation. `gate.rs` is a dispatcher that pushes a `Check` per concern and returns a `GateOutcome`; the checks are the unit of design, not the command. Recorded as finding 2 rather than retried.

### **Reading the manifest as a workspace.** The first pass assumed a `[workspace]` root because sk-code's reference is written entirely in workspace terms. `grep -n "\[workspace\]" Cargo.toml` returns nothing; the package is the root. Recorded as finding 1 rather than retried. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading the manifest as a workspace.** The first pass assumed a `[workspace]` root because sk-code's reference is written entirely in workspace terms. `grep -n "\[workspace\]" Cargo.toml` returns nothing; the package is the root. Recorded as finding 1 rather than retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the manifest as a workspace.** The first pass assumed a `[workspace]` root because sk-code's reference is written entirely in workspace terms. `grep -n "\[workspace\]" Cargo.toml` returns nothing; the package is the root. Recorded as finding 1 rather than retried.

### **Reading the two skill files as reference documentation.** The first pass looked for rules and found prose. They are steering documents: their unit is the agent's next action, not a fact. Re-read on that axis; the findings above are all about behaviour, not knowledge. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading the two skill files as reference documentation.** The first pass looked for rules and found prose. They are steering documents: their unit is the agent's next action, not a fact. Re-read on that axis; the findings above are all about behaviour, not knowledge.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the two skill files as reference documentation.** The first pass looked for rules and found prose. They are steering documents: their unit is the agent's next action, not a fact. Re-read on that axis; the findings above are all about behaviour, not knowledge.

### **Recommending `assert_cmd` or `trycmd` for CLI tests.** rust-anything uses neither and `env!("CARGO_BIN_EXE_...")` with `std::process::Command` covers the same ground with no dependency. Recorded as finding 13. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Recommending `assert_cmd` or `trycmd` for CLI tests.** rust-anything uses neither and `env!("CARGO_BIN_EXE_...")` with `std::process::Command` covers the same ground with no dependency. Recorded as finding 13.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recommending `assert_cmd` or `trycmd` for CLI tests.** rust-anything uses neither and `env!("CARGO_BIN_EXE_...")` with `std::process::Command` covers the same ground with no dependency. Recorded as finding 13.

### **Recommending `forbid` over `deny` for the clippy lints.** sk-code's reason — a reviewed local suppression must remain possible — is correct for a lint that a legitimate case can need. Recorded as finding 5. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Recommending `forbid` over `deny` for the clippy lints.** sk-code's reason — a reviewed local suppression must remain possible — is correct for a lint that a legitimate case can need. Recorded as finding 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recommending `forbid` over `deny` for the clippy lints.** sk-code's reason — a reviewed local suppression must remain possible — is correct for a lint that a legitimate case can need. Recorded as finding 5.

### **Searching for an app-style section under a different name.** The 17 reference files are seven style-guide parts, five quality-standards parts and five quick-reference parts, and the four checklist parts are overview/P0, P0 safety, P1 and P2. There is no app section under any heading; the scope statement is the reason. Do not re-search. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Searching for an app-style section under a different name.** The 17 reference files are seven style-guide parts, five quality-standards parts and five quick-reference parts, and the four checklist parts are overview/P0, P0 safety, P1 and P2. There is no app section under any heading; the scope statement is the reason. Do not re-search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for an app-style section under a different name.** The 17 reference files are seven style-guide parts, five quality-standards parts and five quick-reference parts, and the four checklist parts are overview/P0, P0 safety, P1 and P2. There is no app section under any heading; the scope statement is the reason. Do not re-search.

### **Searching sk-code for a C ABI mapping under a different name.** `c_int`, `c_long`, `size_t`, `repr(C)`, `extern "C"` and the literal phrase `C ABI` all return zero across `references/rust/` and the checklist. There is no C ABI content under any name; do not re-search. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Searching sk-code for a C ABI mapping under a different name.** `c_int`, `c_long`, `size_t`, `repr(C)`, `extern "C"` and the literal phrase `C ABI` all return zero across `references/rust/` and the checklist. There is no C ABI content under any name; do not re-search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching sk-code for a C ABI mapping under a different name.** `c_int`, `c_long`, `size_t`, `repr(C)`, `extern "C"` and the literal phrase `C ABI` all return zero across `references/rust/` and the checklist. There is no C ABI content under any name; do not re-search.

### **Sourcing the ratatui rules from rust-anything anyway.** Zero hits across the repository. Recorded as finding 17 rather than stretched to a nearby line. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Sourcing the ratatui rules from rust-anything anyway.** Zero hits across the repository. Recorded as finding 17 rather than stretched to a nearby line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Sourcing the ratatui rules from rust-anything anyway.** Zero hits across the repository. Recorded as finding 17 rather than stretched to a nearby line.

### **Stretching a rust-anything citation for the ratatui row.** Zero hits. Recorded as finding 6. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Stretching a rust-anything citation for the ratatui row.** Zero hits. Recorded as finding 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stretching a rust-anything citation for the ratatui row.** Zero hits. Recorded as finding 6.

### **Treating `anyhow` in `src/` as a violation to report.** sk-code's P2 clause explicitly permits it in an application shell, and rust-anything is an application. The finding was re-scoped to the library-module half, where the contradiction is real. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating `anyhow` in `src/` as a violation to report.** sk-code's P2 clause explicitly permits it in an application shell, and rust-anything is an application. The finding was re-scoped to the library-module half, where the contradiction is real.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `anyhow` in `src/` as a violation to report.** sk-code's P2 clause explicitly permits it in an application shell, and rust-anything is an application. The finding was re-scoped to the library-module half, where the contradiction is real.

### **Treating `bench` as a gate check.** `DECISIONS.md:59` says explicitly that it is not, and gives the reason. Recorded as finding 6. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating `bench` as a gate check.** `DECISIONS.md:59` says explicitly that it is not, and gives the reason. Recorded as finding 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `bench` as a gate check.** `DECISIONS.md:59` says explicitly that it is not, and gives the reason. Recorded as finding 6.

### **Treating the `#[allow]` versus `#[expect]` difference as a style preference.** It is not: `#[expect]` expires and `#[allow]` does not, so the difference decides whether a stale suppression is ever noticed. Recorded as finding 9 with a recommendation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating the `#[allow]` versus `#[expect]` difference as a style preference.** It is not: `#[expect]` expires and `#[allow]` does not, so the difference decides whether a stale suppression is ever noticed. Recorded as finding 9 with a recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `#[allow]` versus `#[expect]` difference as a style preference.** It is not: `#[expect]` expires and `#[allow]` does not, so the difference decides whether a stale suppression is ever noticed. Recorded as finding 9 with a recommendation.

### **Treating the `Result<T, String>` signature as a defect to fix in sk-code.** It is a scaffold signature, and sk-code's typed-error rule governs the shipped boundary. Recorded as finding 14 with the scope resolution rather than as a contradiction to resolve in sk-code's favour. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the `Result<T, String>` signature as a defect to fix in sk-code.** It is a scaffold signature, and sk-code's typed-error rule governs the shipped boundary. Recorded as finding 14 with the scope resolution rather than as a contradiction to resolve in sk-code's favour.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `Result<T, String>` signature as a defect to fix in sk-code.** It is a scaffold signature, and sk-code's typed-error rule governs the shipped boundary. Recorded as finding 14 with the scope resolution rather than as a contradiction to resolve in sk-code's favour.

### **Treating the `rg` panic probe as a panic policy.** `rg -n '\.(unwrap|expect)\(|panic!\(|partial_cmp\([^)]*\)\.unwrap\(\)|\[[^]]+\]' --glob '*.rs'` finds candidates for review; the policy is the clippy deny list in `p1-required.md:171-179`. Reading the probe as the policy understates the set, which is what iteration 1 did. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating the `rg` panic probe as a panic policy.** `rg -n '\.(unwrap|expect)\(|panic!\(|partial_cmp\([^)]*\)\.unwrap\(\)|\[[^]]+\]' --glob '*.rs'` finds candidates for review; the policy is the clippy deny list in `p1-required.md:171-179`. Reading the probe as the policy understates the set, which is what iteration 1 did.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `rg` panic probe as a panic policy.** `rg -n '\.(unwrap|expect)\(|panic!\(|partial_cmp\([^)]*\)\.unwrap\(\)|\[[^]]+\]' --glob '*.rs'` finds candidates for review; the policy is the clippy deny list in `p1-required.md:171-179`. Reading the probe as the policy understates the set, which is what iteration 1 did.

### **Treating the app rules as absent from rust-anything.** They are in `whole-app.md`, not in `skills/rust-anything/SKILL.md`. Searching only the per-function skill is what produced iteration 5's "the set lacks app content" framing; the correct statement is that rust-anything carries the app rules in its workflow document and sk-code carries none at all. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the app rules as absent from rust-anything.** They are in `whole-app.md`, not in `skills/rust-anything/SKILL.md`. Searching only the per-function skill is what produced iteration 5's "the set lacks app content" framing; the correct statement is that rust-anything carries the app rules in its workflow document and sk-code carries none at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the app rules as absent from rust-anything.** They are in `whole-app.md`, not in `skills/rust-anything/SKILL.md`. Searching only the per-function skill is what produced iteration 5's "the set lacks app content" framing; the correct statement is that rust-anything carries the app rules in its workflow document and sk-code carries none at all.

### **Treating the three open questions as unanswered research.** They are answered; the record text was the problem. Recorded as finding 11 rather than re-researched. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Treating the three open questions as unanswered research.** They are answered; the record text was the problem. Recorded as finding 11 rather than re-researched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the three open questions as unanswered research.** They are answered; the record text was the problem. Recorded as finding 11 rather than re-researched.

### **Using `grep -ril "cheat"` as evidence that sk-code has a cheat guard.** The single hit is the heading `## 2. NAMING CHEAT SHEET` in `quick-reference/naming-ordering-and-signatures.md:33`, which is unrelated. Do not re-run this grep expecting a different answer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Using `grep -ril "cheat"` as evidence that sk-code has a cheat guard.** The single hit is the heading `## 2. NAMING CHEAT SHEET` in `quick-reference/naming-ordering-and-signatures.md:33`, which is unrelated. Do not re-run this grep expecting a different answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using `grep -ril "cheat"` as evidence that sk-code has a cheat guard.** The single hit is the heading `## 2. NAMING CHEAT SHEET` in `quick-reference/naming-ordering-and-signatures.md:33`, which is unrelated. Do not re-run this grep expecting a different answer.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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
None from the continuity ladder. The packet's own `goal.md`, `spec.md` and `plan.md` carry the durable directive; the fan-out topic carries the five questions.

### Bounded Context Snapshot

- Source pointers: `specs/z_external-repo-library/rust-anything-main` (read-only, gitignored local checkout), `.skilled/skills/sk-code/sk-code-skilled/references/rust/`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/`.
- Reuse candidates: the existing Rust reference set and checklist are the edit targets; no new surface packet.
- Integration points: `SKILL.md` version and changelog, `verify-router-sync.cjs`, `validate.sh --strict`.
- Constraints and risks: rust-anything is absent from the canonical path at run start (see iteration 1 edge case); the lineage may read anywhere but writes only inside its own directory.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/sk-code/code-surfaces/007-sk-code-rust/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-26T12:00:30Z
