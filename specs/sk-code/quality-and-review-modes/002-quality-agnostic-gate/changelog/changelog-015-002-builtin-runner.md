---
title: "Changelog: Phase 2: builtin-runner [015-quality-agnostic-gate/002-builtin-runner]"
description: "Chronological changelog for the Phase 2: builtin-runner phase."
trigger_phrases:
  - "quality agnostic gate builtin runner changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/sk-code/015-quality-agnostic-gate/002-builtin-runner` (Level 2)
> Parent packet: `specs/sk-code/015-quality-agnostic-gate`

### Summary

The quality gate now runs as one command in any repository. `quality-gate.cjs` reads a change, runs the checks it can prove, prints one verdict and writes no file. A Go repository with a spec label in a comment reads `BLOCKED` with surface `unknown`, and this repository's own checker file reads `NO_BLOCKER_FOUND` with the SKILLED surface resolved.

### Added

- The runner reads a change from the worktree, a base ref or a list of named files, and reports findings on the changed lines.
- Built-in sensors look for conflict markers, secrets and debug leftovers. No part of a secret ever reaches the output, and a parser message from a file that holds one is withheld.
- A parse floor checks JSON, JavaScript, Python, YAML, TOML and shell, choosing the language by shebang before extension.
- The runner reports which layers enforce comment hygiene in the repository: the pre-commit hook, CI and the post-edit hook.
- Output comes as JSON, text or the `code-quality/v1` envelope.
- The runner contract describes the CLI, the exit codes, the states, the verdict schema and the envelope grammar.
- A missing `python3` never reads as clean. The checks that need it read `SKIPPED_ABSENT`, and the run reports `UNVERIFIED`.
- The gate never reports a pass. `NO_BLOCKER_FOUND` says only that nothing blocks and every required check produced evidence, and the agent still owns the judgment items.

### Changed

- The SKILLED and `sk-code-ci` surfaces declare the checklists the gate lists for their files, and the registry compiler refuses a malformed declaration.
- The surface reader exposes path markers and content markers separately, so the runner can resolve a file's surface with the same rules stack detection uses.

### Fixed

- Nothing. The runner is new in this phase.

### Verification

- A Go repository change with a spec label in a comment reads `BLOCKED`, exit 1.
- This repository's own checker file reads `NO_BLOCKER_FOUND`, exit 0, with the SKILLED surface.
- The runner's own test suite passes.

### Files Changed

| File | Purpose |
|------|---------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | The runner |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Argv spawns, deadlines and the workspace guard |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | The shipped base layer |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | The runner contract |
| `.skilled/skills/sk-code/mode-registry.json` | The surface checklist declarations |

### Follow-Ups

- A repository config that names its own checks came in the next phase.
