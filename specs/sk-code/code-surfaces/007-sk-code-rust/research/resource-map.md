---
title: "Resource Map — rust-anything (specs/z_external-repo-library/rust-anything-main, read-only) as a source for sk-code's Rust standards. Questions: (1) How is its own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md? (2) What are its record, bridge, diff, bench, shadow and gate method (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original? (3) How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges? (4) How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port? (5) For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks? Cite file:line for every claim. End with a ranked edit list, each naming the target sk-code Rust part, the change and the rust-anything source line."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 91
- **By category**: READMEs=0, Documents=16, Commands=0, Agents=0, Skills=28, Specs=40, Scripts=0, Tests=3, Config=2, Meta=2
- **Missing on disk**: 44
- **Scope**: research convergence output for 007-sk-code-rust
- **Generated**: 2026-11-26T12:31:20.493Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md | Cited | OK | Citations=3; Iterations=3 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/src/crates.rs | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs | Cited | OK | Citations=3; Iterations=3 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/website/pages/en/docs/concepts/bridge.md | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/deep-research-dashboard.md | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/iterations/iteration-006.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:32,44 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:168,190 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:123,156 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:124-219,276-284 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:124,178 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:147-148,276-278 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md:118-137,140-153,212-247,248-368 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md:118,140,212,248,361 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/ROUTER.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/SKILL.md | Cited | OK | Citations=3; Iterations=3 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/code-surfaces/007-sk-code-rust/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-1/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-1/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-1/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-1/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/Cargo.toml | Cited | MISSING | Citations=5; Iterations=5 |
| specs/z_external-repo-library/rust-anything-main/Cargo.toml:1-2,15,26,28-29 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/Cargo.toml:15,16,26,28-29 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/Cargo.toml:15,29 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/DECISIONS.md | Cited | MISSING | Citations=4; Iterations=4 |
| specs/z_external-repo-library/rust-anything-main/docs/how-it-works.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/docs/pitfalls.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/docs/types.md | Cited | MISSING | Citations=3; Iterations=3 |
| specs/z_external-repo-library/rust-anything-main/docs/types.md:123-127,155,167,188,217,242 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/docs/types.md:123,155,167,188,217,242 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/hk.pkl | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/SKILL.md | Cited | MISSING | Citations=4; Iterations=4 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/SKILL.md:138-152,245-246 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/SKILL.md:142,147,150,151,245-246 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md | Cited | MISSING | Citations=4; Iterations=4 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136-155,230-265 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136,143,148,152,232,238,247 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136,148,152,238 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/bridge.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/error_paths.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/gate.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/main.rs | Cited | MISSING | Citations=5; Iterations=5 |
| specs/z_external-repo-library/rust-anything-main/src/main.rs:1-30,45-60,815-840 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/main.rs:6-7,824,829 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/main.rs:6,25,52,824,829 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/main.rs:7,21,829 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/src/recording.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/tests/ | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/tests/common/mod.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/tests/fixtures/ | Cited | MISSING | Citations=1; Iterations=1 |
| specs/z_external-repo-library/rust-anything-main/tests/rules.rs | Cited | MISSING | Citations=2; Iterations=2 |
| specs/z_external-repo-library/rust-anything-main/tests/switch.rs | Cited | MISSING | Citations=2; Iterations=2 |
| specs/z_external-repo-library/rust-anything-main/tests/tools.rs | Cited | MISSING | Citations=2; Iterations=2 |
| specs/z_external-repo-library/rust-anything-main/tests/types_doc.rs | Cited | MISSING | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/.Trash/rust-anything-main/tests/ | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/tests/common/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/findings-registry.json | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/.Trash/rust-anything-main/CLAUDE.md | Cited | OK | Citations=2; Iterations=2 |
| specs/z_external-repo-library/rust-anything-main/CLAUDE.md | Cited | MISSING | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| vibe-1 | lineages/vibe-1/deltas/iter-001.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-002.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-003.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-004.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-005.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-006.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-001.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-001.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-002.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-003.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-004.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-005.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-006.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-007.jsonl |
| vibe-3 | lineages/vibe-3/deltas/iter-008.jsonl |
