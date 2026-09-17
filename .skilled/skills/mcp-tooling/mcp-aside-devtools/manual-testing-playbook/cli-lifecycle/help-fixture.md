---
title: "ASD-002 -- Help fixture capture"
description: "This scenario validates version-pinned command-surface capture for `ASD-002`. It focuses on saving `aside --help` output as a fixture and confirming the four documented subcommands."
version: 1.0.0.0
---

# ASD-002 -- Help fixture capture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-002`.

---

## 1. OVERVIEW

This scenario captures the installed `aside` command surface as a fixture and asserts the four documented subcommands (`account`, `exec`, `repl`, `mcp`) are present.

### Why This Matters

The Aside command surface is version-pinned evidence, and one known conflict (docs `-m provider/model` vs installed `--model`/`--provider`) can only be resolved per installed version. The fixture is the packet's authority for flag spellings; scripting flags from memory is a hard rule violation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-002` and confirm the expected signals without contradictory evidence.

- Objective: Save `aside --help` (and subcommand help) as a fixture; confirm subcommands `account`, `exec`, `repl`, `mcp`; record the option spellings actually present.
- Real user request: `"What can the aside CLI on this machine actually do?"`
- Prompt: `Capture the installed aside command surface as a fixture and list its subcommands and top-level options.`
- Expected execution process: help capture to file, subcommand grep, option transcription.
- Expected signals: non-empty help fixture; all four subcommands named; options recorded verbatim.
- Desired user-visible outcome: A fixture path plus a verbatim option list with a PASS verdict.
- Pass/fail: PASS if the fixture saves and names all four subcommands; FAIL if help errors or a documented subcommand is missing (version drift — record it).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture the installed aside command surface as a fixture and list its subcommands and top-level options.`

### Commands

1. `bash: aside --help 2>&1 | tee /tmp/aside-help-fixture.txt`
2. `bash: grep -E "account|exec|repl|mcp" /tmp/aside-help-fixture.txt`
3. `bash: aside mcp --help 2>&1 | tee /tmp/aside-mcp-help-fixture.txt`

### Expected

- Step 1: non-empty help text saved
- Step 2: all four subcommand names present
- Step 3: `aside mcp --help` shows no account/session option (boundary-rule confirmation)

### Evidence

Fixture file paths and their contents; an explicit note of which model-selection spelling the installed help shows (`-m`, `--model`/`--provider`, or both).

### Pass / Fail

- **Pass**: fixture saved AND four subcommands present.
- **Fail**: help errors, or a subcommand is missing — record as version drift and update packet docs before relying on the surface.

### Failure Triage

1. Missing subcommand: compare `aside --version` against the research-pinned `1.26.626.1517`; newer/older versions require re-baselining the reference docs.
2. `aside mcp --help` grows an account/session option: record it — the boundary rule in the CLI reference is then stale for this version.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md` | Version-pinned command surface this fixture validates |

---

## 5. SOURCE METADATA

- Group: CLI LIFECYCLE
- Playbook ID: ASD-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-lifecycle/help-fixture.md`
