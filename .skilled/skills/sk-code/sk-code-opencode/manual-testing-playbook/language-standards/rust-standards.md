---
id: OC-009
category: language_standards
title: 'Rust standards routing'
description: "This scenario validates RUST routing for `OC-009`. It confirms a napi-rs/WASM prompt loads the full seventeen-file Rust style-guide, quality-standards, and quick-reference trio, including the interop-model and TypeScript-parity anchors, instead of a partial or generic resource set."
expected_surface: OPENCODE
expected_intent: RUST
expected_resources:
  - references/rust/style-guide/overview-and-file-header.md
  - references/rust/style-guide/toolchain-and-project-structure.md
  - references/rust/style-guide/naming-conventions.md
  - references/rust/style-guide/formatting-and-imports.md
  - references/rust/style-guide/commenting-and-rustdoc.md
  - references/rust/style-guide/interop-model.md
  - references/rust/style-guide/interop-errors-and-parity.md
  - references/rust/quality-standards/overview-and-data-ownership.md
  - references/rust/quality-standards/modeling-collections-and-api.md
  - references/rust/quality-standards/docs-errors-and-async.md
  - references/rust/quality-standards/build-and-organization.md
  - references/rust/quality-standards/determinism-and-parity.md
  - references/rust/quick-reference/overview-and-boundary-template.md
  - references/rust/quick-reference/naming-ordering-and-signatures.md
  - references/rust/quick-reference/collections-imports-and-errors.md
  - references/rust/quick-reference/rustdoc-and-cargo.md
  - references/rust/quick-reference/determinism-parity-and-related.md
version: 1.0.0.0
---

# OC-009: Rust standards routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-009`.

---

## 1. OVERVIEW

This scenario validates `RUST` routing for `OC-009`. It focuses on confirming that the exact prompt
below classifies as `RUST` and loads the full 17-file resource set instead of a generic or mismatched
resource set, per `SKILL.md` §2b's machine-readable router.

### Why This Matters

Per `SKILL.md` §3, Rust napi-rs/WASM/sidecar modules are compatibility implementations, not independent behavior authorities — JS-visible bytes, six-decimal numeric behavior, comparator tie-breaks, deterministic IDs, and error shapes must stay identical to the TypeScript oracle. Dropping the interop-model or interop-errors-and-parity files from the routed set would let a Rust change diverge from that oracle without any standard catching it.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-009` classifies as `RUST` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OPENCODE`, intent `RUST`, and every path in
  `expected_resources`.
- Real user request: `For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.`
- Prompt: `For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.`

**Exact prompt**:
```text
For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.
```

- Expected execution process: the hub detects `OPENCODE` (work under `.opencode/`), the `RUST`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-opencode/`, and each one
  documents `RUST` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow cites the routed `RUST` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OPENCODE`/
  `RUST`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook/language-standards/rust-standards.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | grep -F '"RUST"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-opencode/SKILL.md | sed -n '/"RUST": \[/,/\],/p'`
4. `for p in references/rust/style-guide/overview-and-file-header.md references/rust/style-guide/toolchain-and-project-structure.md references/rust/style-guide/naming-conventions.md references/rust/style-guide/formatting-and-imports.md references/rust/style-guide/commenting-and-rustdoc.md references/rust/style-guide/interop-model.md references/rust/style-guide/interop-errors-and-parity.md references/rust/quality-standards/overview-and-data-ownership.md references/rust/quality-standards/modeling-collections-and-api.md references/rust/quality-standards/docs-errors-and-async.md references/rust/quality-standards/build-and-organization.md references/rust/quality-standards/determinism-and-parity.md references/rust/quick-reference/overview-and-boundary-template.md references/rust/quick-reference/naming-ordering-and-signatures.md references/rust/quick-reference/collections-imports-and-errors.md references/rust/quick-reference/rustdoc-and-cargo.md references/rust/quick-reference/determinism-parity-and-related.md; do test -e ".opencode/skills/sk-code/sk-code-opencode/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: RUST` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["RUST"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["RUST"]` array this scenario's list should mirror. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["RUST"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `RUST`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `RUST`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/rust/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["RUST"]` excerpt to see
   whether the drift is a stale scenario file or a stale `SKILL.md` map.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `RUST` resource set |
| [SKILL.md](../../SKILL.md) §3 | The Rust-preserves-the-TypeScript-contract rule this scenario's interop files enforce |

---

## 5. SOURCE METADATA

- Group: code-opencode routing
- Playbook ID: OC-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `language-standards/rust-standards.md`
