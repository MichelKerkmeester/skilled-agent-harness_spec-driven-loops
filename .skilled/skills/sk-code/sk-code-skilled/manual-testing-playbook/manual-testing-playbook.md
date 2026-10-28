---
title: "sk-code-skilled: Manual Testing Playbook"
description: "Routing-recall corpus for the sk-code-skilled surface: scenarios that exercise its intent signals, resource map and SKILLED surface detection."
version: 1.1.0.1
---

# sk-code-skilled: Manual Testing Playbook

This document combines the routing-recall validation contract for the `sk-code-skilled` packet into one
operator reference. The root playbook holds the package directory, the review protocol and the grading
rules. The per-feature files under the category folders hold the scenario-specific execution contract for
each scenario.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are recorded into
> `sk-code-skilled/benchmark/reports/<dated-run-label>/`.

---

## 1. OVERVIEW

Routing-recall corpus for the `sk-code-skilled` surface. These scenarios exercise the machine-readable
intent signals and resource map in `SKILL.md` §6, and the surface detection (`SKILLED`, work under
`.skilled/`) that causes the hub to bundle this packet. The corpus is derived from the walked tree
below, split into three category folders by resource domain.

Coverage note: the corpus covers each prompt intent that `SKILL.md` §6 declares machine-readably, one
scenario per intent, across the packet's three resource domains. `JAVASCRIPT` is the one declared intent
that has no scenario yet, so a JavaScript-routed prompt stays uncovered here.

### Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | Language Standards | `language-standards/` | OC-001 .. OC-003, OC-009 |
| 2 | Config and Hooks | `config-hooks/` | OC-004 .. OC-005 |
| 3 | Authoring and Verification | `authoring-verification/` | OC-006 .. OC-008 |

### Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | OC-001 | TYPESCRIPT | [typescript-standards.md](language-standards/typescript-standards.md) |
| 2 | OC-002 | PYTHON | [python-standards.md](language-standards/python-standards.md) |
| 3 | OC-003 | SHELL | [shell-standards.md](language-standards/shell-standards.md) |
| 4 | OC-004 | CONFIG | [config-schema.md](config-hooks/config-schema.md) |
| 5 | OC-005 | HOOKS | [hooks-wiring.md](config-hooks/hooks-wiring.md) |
| 6 | OC-006 | IMPLEMENTATION | [implementation-authoring.md](authoring-verification/implementation-authoring.md) |
| 7 | OC-007 | CODE_QUALITY | [code-quality-gate.md](authoring-verification/code-quality-gate.md) |
| 8 | OC-008 | VERIFICATION | [verification-alignment.md](authoring-verification/verification-alignment.md) |
| 9 | OC-009 | RUST | [rust-standards.md](language-standards/rust-standards.md) |

Every scenario assumes the hub's surface detection has already resolved **SKILLED** (work under
`.skilled/`, per `SKILL.md` §1) and bundled this packet behind a workflow mode; the scenario then
exercises which reference/asset set the sample prompt's intent should load. A scenario's verdict is
`PASS` when every path in its `expected_resources` resolves under the skill root and its frontmatter
surface/intent agree with the table above, `FAIL` when either check fails, and `SKIP` only when a
specific sandbox or runtime blocker prevents the check from running.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` resolves on disk.
3. `SKILL.md` section 2b resolves, carrying the machine-readable `INTENT_SIGNALS` and `RESOURCE_MAP` blocks.
4. Every path a scenario lists under `expected_resources` resolves under the packet root.
5. No scenario in this playbook is destructive. Each one reads files and writes nothing.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, including exit status where a command is executed
- User request used
- Exact prompt used
- The resolved frontmatter block and the `INTENT_SIGNALS` excerpt the prompt matched
- Output snippets for each path check in `expected_resources`
- Scenario verdict with rationale: PASS, FAIL, or SKIP
- The dated report label the outcome was recorded under

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.
- Paths in a scenario are relative to the repository root unless the scenario names the packet root.
- Resource paths in a scenario are relative to `.skilled/skills/sk-code/sk-code-skilled/`.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map, section 11
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions in section 2 were satisfied.
2. Prompt and command sequence were executed as written.
3. The frontmatter surface and intent agree with the root index in section 11.
4. Every path in `expected_resources` resolves under the packet root.
5. Evidence is complete and readable.
6. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: every path in `expected_resources` resolves under the skill root and the frontmatter surface and intent agree with the table above
- `FAIL`: a listed path is missing, or the frontmatter surface or intent disagrees
- `SKIP`: a specific sandbox or runtime blocker prevents the check from running

### Feature Verdict Rules

- `PASS`: every mapped scenario for the feature is `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. Every scenario in the root index has a per-feature file behind it.
3. Coverage is complete for the index in section 11 (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put scenario-specific acceptance caveats in the matching
per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning for the routing-recall package. It is not a runtime support matrix by
itself.

### Operational Rules

1. The package is small enough for one operator in one wave.
2. Pre-assign each scenario ID and its per-feature file before execution.
3. Save the evidence for each scenario before recording its verdict.
4. Record the evidence paths and the dated report label in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field
- Expected surface and intent
- Expected resource set, path by path
- Desired user-visible outcome
- Feature-specific acceptance caveats

---

## 7. LANGUAGE STANDARDS (OC-001..OC-003, OC-009)

### OC-001 | TypeScript standards routing

Confirms a TypeScript implementation prompt classifies as `TYPESCRIPT` and loads the strict-mode style
guide, the type-system quality standards and the tsconfig and module quick reference, instead of a
generic implementation checklist.

> **Feature File:** [OC-001](language-standards/typescript-standards.md)

### OC-002 | Python standards routing

Confirms a `.py` argparse and docstring review prompt classifies as `PYTHON` and loads the Python style
guide, quality standards and quick reference triad, instead of a generic implementation checklist.

> **Feature File:** [OC-002](language-standards/python-standards.md)

### OC-003 | Shell standards routing

Confirms a bash `.sh` review prompt classifies as `SHELL` and loads the shell style guide, the quality
standards with their priority blockers and shellcheck checks, and the shell quick reference, instead of
a generic checklist.

> **Feature File:** [OC-003](language-standards/shell-standards.md)

### OC-009 | Rust standards routing

Confirms a napi-rs and WASM prompt classifies as `RUST` and loads the full Rust style guide, quality
standards and quick reference trio, including the interop-model and TypeScript-parity anchors, instead
of a partial or generic resource set.

> **Feature File:** [OC-009](language-standards/rust-standards.md)

---

## 8. CONFIG AND HOOKS (OC-004..OC-005)

### OC-004 | Config schema routing

Confirms a JSONC descriptor and config-schema review prompt classifies as `CONFIG` and loads the config
style guide, quality standards, quick reference and config checklist, instead of a generic implementation
checklist.

> **Feature File:** [OC-004](config-hooks/config-schema.md)

### OC-005 | Hooks wiring routing

Confirms a session-prime and pre-tool-use wiring prompt classifies as `HOOKS` and loads the single
maintained hook-entrypoint reference, instead of a broader implementation or config resource set.

> **Feature File:** [OC-005](config-hooks/hooks-wiring.md)

---

## 9. AUTHORING AND VERIFICATION (OC-006..OC-008)

### OC-006 | Implementation authoring routing

Confirms a new skill-authoring module prompt classifies as `IMPLEMENTATION` and loads the
language-agnostic universal-patterns and code-organization tier plus all four authoring checklists,
instead of a single-checklist subset.

> **Feature File:** [OC-006](authoring-verification/implementation-authoring.md)

### OC-007 | Code quality gate routing

Confirms a lint, format, naming and code-smell prompt classifies as `CODE_QUALITY` and loads the full
nine-file authoring checklist set, rather than a single-language subset.

> **Feature File:** [OC-007](authoring-verification/code-quality-gate.md)

### OC-008 | Verification alignment routing

Confirms a completion-claim, type-check and alignment-drift prompt classifies as `VERIFICATION` and
loads the alignment-verification-automation reference and the drift-guard scripts README, instead of a
generic implementation or quality resource.

> **Feature File:** [OC-008](authoring-verification/verification-alignment.md)

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `assets/scripts/verify-router-sync.cjs` | Check 4 replays every scenario prompt through the router and fails when a listed expected resource is not emitted by it | OC-001 .. OC-009 |

The guard's own test lives at `scripts/tests/verify-router-sync.test.cjs`. It drives the other checks
against a throwaway hub and does not exercise check 4, so check 4 is covered only by running the guard
over the live tree with `--checks 4`.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| OC-001 | TypeScript standards routing | LANGUAGE STANDARDS | [OC-001](language-standards/typescript-standards.md) |
| OC-002 | Python standards routing | LANGUAGE STANDARDS | [OC-002](language-standards/python-standards.md) |
| OC-003 | Shell standards routing | LANGUAGE STANDARDS | [OC-003](language-standards/shell-standards.md) |
| OC-004 | Config schema routing | CONFIG AND HOOKS | [OC-004](config-hooks/config-schema.md) |
| OC-005 | Hooks wiring routing | CONFIG AND HOOKS | [OC-005](config-hooks/hooks-wiring.md) |
| OC-006 | Implementation authoring routing | AUTHORING AND VERIFICATION | [OC-006](authoring-verification/implementation-authoring.md) |
| OC-007 | Code quality gate routing | AUTHORING AND VERIFICATION | [OC-007](authoring-verification/code-quality-gate.md) |
| OC-008 | Verification alignment routing | AUTHORING AND VERIFICATION | [OC-008](authoring-verification/verification-alignment.md) |
| OC-009 | Rust standards routing | LANGUAGE STANDARDS | [OC-009](language-standards/rust-standards.md) |
