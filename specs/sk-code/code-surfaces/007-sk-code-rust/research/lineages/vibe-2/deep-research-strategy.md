---
title: Deep Research Strategy - vibe-2 lineage
description: Runtime strategy for the vibe-2 fan-out lineage researching rust-anything as a source for sk-code's Rust standards.
trigger_phrases:
  - "deep research strategy"
  - "rust-anything lineage"
  - "sk-code rust standards"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - vibe-2 Lineage

Fan-out lineage `vibe-2` of the `007-sk-code-rust` research run. Artifact directory is the lineage directory itself.

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage

- **Init:** written by the lineage executor from the workflow template.
- **Per iteration:** the executor reads Next Focus, writes iteration evidence, and the reducer refreshes the machine-owned sections.
- **Mutability:** mutable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

rust-anything (specs/z_external-repo-library/rust-anything-main, read-only) as a source for sk-code's Rust standards. Questions: (1) How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md? (2) What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original? (3) How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges? (4) How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port? (5) For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks? Cite file:line for every claim. End with a ranked edit list, each naming the target sk-code Rust part, the change and the rust-anything source line.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, and the test layout and fixtures under tests/?
- [ ] What are rust-anything's record, bridge, diff, bench, shadow and gate methods in docs/how-it-works.md, docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?
- [ ] How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?
- [ ] How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?
- [ ] For each finding, does the existing sk-code Rust set under references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Editing rust-anything. It is read-only source material.
- Editing the sk-code Rust reference set. This lineage produces a ranked edit list only; the merge and the lead apply it.
- Re-deciding the surface placement (D1) or the fan-out shape (D2).

---

## 5. STOP CONDITIONS

- Convergence at newInfoRatio 0.05 or below after the 3-iteration floor.
- The 8-iteration cap.
- All five key questions answered with cited evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, and the test layout and fixtures under tests/?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- splitting the `.unwrap()` count at each file's first `#[cfg(test)]` line turned a misleading 809 into a defensible 1. Counting attributes rather than reading files gave the serde shape in one call. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first attempt to read `build-and-organization.md` through `sed | cat -n | awk` renumbered the lines and produced citations that would not resolve. Re-reading with `grep -n` for the exact phrases fixed it; every citation above was confirmed by `grep -n` or by a direct `sed` range whose offset was known. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Reading `src/main.rs` end to end (2227 lines) to characterise the CLI. The derive attributes at 25-50 and the `main`/`run` split at 824-834 carry the contract; the remaining 2000 lines are per-subcommand bodies that repeat the same `say!` and `ExitCode` pattern. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `src/main.rs` end to end (2227 lines) to characterise the CLI. The derive attributes at 25-50 and the `main`/`run` split at 824-834 carry the contract; the remaining 2000 lines are per-subcommand bodies that repeat the same `say!` and `ExitCode` pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `src/main.rs` end to end (2227 lines) to characterise the CLI. The derive attributes at 25-50 and the `main`/`run` split at 824-834 carry the contract; the remaining 2000 lines are per-subcommand bodies that repeat the same `say!` and `ExitCode` pattern.

### Searching for a `[workspace]` table or a `rust-toolchain.toml` in rust-anything. Neither exists, so the workspace-inheritance rules sk-code mandates have no counterpart here and cannot be cited as covered. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a `[workspace]` table or a `rust-toolchain.toml` in rust-anything. Neither exists, so the workspace-inheritance rules sk-code mandates have no counterpart here and cannot be cited as covered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `[workspace]` table or a `rust-toolchain.toml` in rust-anything. Neither exists, so the workspace-inheritance rules sk-code mandates have no counterpart here and cannot be cited as covered.

### Treating the 809 `.unwrap()` count as a production-code smell. Splitting at each file's first `#[cfg(test)]` line reduced it to one, so the raw count was a measurement artefact. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the 809 `.unwrap()` count as a production-code smell. Splitting at each file's first `#[cfg(test)]` line reduced it to one, so the raw count was a measurement artefact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 809 `.unwrap()` count as a production-code smell. Splitting at each file's first `#[cfg(test)]` line reduced it to one, so the raw count was a measurement artefact.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Reading `src/main.rs` end to end (2227 lines) to characterise the CLI. The derive attributes at 25-50 and the `main`/`run` split at 824-834 carry the contract; the remaining 2000 lines are per-subcommand bodies that repeat the same `say!` and `ExitCode` pattern. (iteration 1)
- Searching for a `[workspace]` table or a `rust-toolchain.toml` in rust-anything. Neither exists, so the workspace-inheritance rules sk-code mandates have no counterpart here and cannot be cited as covered. (iteration 1)
- Treating the 809 `.unwrap()` count as a production-code smell. Splitting at each file's first `#[cfg(test)]` line reduced it to one, so the raw count was a measurement artefact. (iteration 1)

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
Key question 2: the record, bridge, diff, bench, shadow and gate methods in `docs/how-it-works.md`, `docs/pitfalls.md` and `DECISIONS.md`, and which of them apply to any Rust port checked against an original.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `specs/z_external-repo-library/rust-anything-main` resolves outside this worktree, at `/Users/michelkerkmeester/MEGA/Development/Skilled/specs/z_external-repo-library/rust-anything-main`. Read-only.
- Reuse candidates: `.skilled/skills/sk-code/sk-code-skilled/references/rust/` (3 subfolders, 15 files) and `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/` (4 files).
- Integration points: the ranked edit list in this lineage's `research.md`, consumed by the fan-out merge into `specs/sk-code/code-surfaces/007-sk-code-rust/research/research.md`.
- Constraints and risks: rust-anything is a large tree (76 `src/` entries, 48 `tests/` entries); the lineage budget is 8 iterations, so each iteration must read narrowly and cite exactly.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: this lineage's `research.md` is written by this lineage's synthesis phase
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue`
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `inbox.jsonl` in this lineage directory
- Canonical pause sentinel: `.deep-research-pause` in this lineage directory
- Current generation: 1
- Started: 2026-11-26T12:00:29Z
