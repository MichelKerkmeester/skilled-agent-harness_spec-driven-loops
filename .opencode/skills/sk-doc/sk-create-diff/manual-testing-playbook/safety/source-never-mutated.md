---
title: "SAFE-003 -- Source file never mutated"
description: "This scenario validates the source-never-mutated invariant for `SAFE-003`. It focuses on confirming that neither `snapshot` nor `compare` nor `compare-pair` ever writes to a source document."
stage: routing
version: 1.0.0.0
---

# SAFE-003 -- Source file never mutated

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SAFE-003`.

---

## 1. OVERVIEW

This scenario validates the source-never-mutated invariant for `SAFE-003`. It focuses on confirming that neither `snapshot` nor `compare` nor `compare-pair` ever writes to a source document.

### Why This Matters

Users point this tool at their real working documents, often the very files they are actively editing. If any subcommand wrote back to a source file — even to normalize line endings — it could corrupt work in progress or destroy the baseline the user was trying to protect. The invariant is absolute: sources are read, never written. This scenario checksums the inputs, runs every mutating-looking subcommand, and re-checksums to prove byte-for-byte the source is untouched.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAFE-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm that `snapshot`, `compare`, and `compare-pair` all read source documents and never write to them
- Real user request: `Confirm the tool never changes my original files.`
- Prompt: `Confirm the tool never changes my original files.`
- Expected execution process: the operator checksums the input files, runs `snapshot`, then `compare`, then `compare-pair` across those inputs, and re-checksums; the checksums are byte-identical because the engine only reads sources.
- Expected signals: identical before/after checksums for every source file after all three subcommands have run.
- Desired user-visible outcome: identical checksums before and after every operation.
- Pass/fail: PASS if every source checksum after the operations equals its value before them; FAIL if any source checksum changes after any subcommand.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Confirm the tool never changes my original files.`

### Commands

1. `shasum -a 256 /tmp/a.md /tmp/b.md`
2. `python3 scripts/create_diff.py snapshot /tmp/a.md --state-dir /tmp/cd-store`
3. `python3 scripts/create_diff.py compare /tmp/a.md --state-dir /tmp/cd-store --report /tmp/c.html`
4. `python3 scripts/create_diff.py compare-pair --before /tmp/a.md --after /tmp/b.md --report /tmp/p.html`
5. `shasum -a 256 /tmp/a.md /tmp/b.md`

### Expected

Step 1 records the baseline checksums of both source files. Steps 2-4 run `snapshot`, `compare`, and `compare-pair` over those sources (each exiting `0`, writing only to the state store and the report paths). Step 5 recomputes the checksums and produces values byte-identical to step 1, proving no source file was written.

### Evidence

Capture the step 1 checksum output, the exit codes and any stdout from steps 2-4, and the step 5 checksum output. Place the step 1 and step 5 checksums side by side and confirm they match for every source file; note the report/state-store paths that were written (those are expected outputs, not sources).

### Pass / Fail

- **Pass**: the step 5 checksums are byte-identical to the step 1 checksums for every source file.
- **Fail**: any source file's checksum in step 5 differs from its step 1 value.

### Failure Triage

1. Identify which specific file's checksum changed and after which subcommand by re-running steps 2-4 individually with a `shasum` check between each.
2. Confirm the `--state-dir` and `--report` paths point outside the source files' locations so an output was not accidentally directed at a source path.
3. Confirm no other process (an editor auto-save, a formatter, a sync client) touched the files during the run before attributing a checksum change to the engine.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/snapshot-lifecycle/baseline-snapshot-and-compare.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: SAFETY
- Playbook ID: SAFE-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `safety/source-never-mutated.md`
