---
title: "CX-023 -- /review TUI command"
description: "This scenario validates the /review interactive TUI command for `CX-023`. It focuses on confirming /review surfaces categorized findings against staged git changes."
version: 1.4.0.7
---

# CX-023 -- /review TUI command

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-023`.

---

## 1. OVERVIEW

This scenario validates the `/review` interactive TUI command for `CX-023`. It focuses on confirming `/review` runs inside the Codex TUI against staged git changes and produces categorized review findings without modifying files.

### Why This Matters

`/review` is the TUI-only complement to `codex exec review` (validated separately in CX-003). `references/codex-tools.md` §2 documents `/review` as one of the unique Codex capabilities. Operators who prefer the interactive TUI for pre-commit review need confidence that the slash command surface still works.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-023` and confirm the expected signals without contradictory evidence.

- Objective: Verify the `/review` interactive command's TTY precondition and, only when a TTY exists, run it against staged git changes. A non-TTY run is a documented SKIP; `exec review` is a separate contract.
- Real user request: `Try the /review slash command in the Codex TUI on my staged changes and tell me what it flags.`
- Prompt: `Run /review in the Codex TUI on a staged throwaway diff and report categories, changed-line reference, and clean exit.`
- Expected execution process: Operator checks `test -t 0` before launching Codex -> records `SKIP — /review requires a TTY` when stdin is not a terminal -> otherwise pre-creates a throwaway git repo, launches the Codex TUI, types `/review`, captures the categorized findings, exits, and confirms no files modified.
- Expected signals: With a TTY, Codex TUI launches and `/review` executes against staged changes; output contains a category heading and a staged-line reference with no file modifications. Without a TTY, the expected result is `SKIP — /review requires a TTY`; do not substitute `codex exec review`.
- Desired user-visible outcome: A pre-commit review summary the operator can quote in a PR description.
- Pass/fail: PASS only when a TTY exists and the TUI output contains the expected review evidence with no file modifications. SKIP when stdin is not a terminal. FAIL only when a TTY-capable run launches but `/review` errors or produces no review evidence.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create a throwaway git repo with one initial commit and one staged change.
2. Snapshot `git status --porcelain` and `git diff --cached`.
3. Check `test -t 0`; if false, record `SKIP — /review requires a TTY` and stop this scenario. If true, launch `codex` (no exec) in the throwaway repo.
4. Type `/review` interactively, capture the output via copy-paste or screenshot.
5. Exit cleanly and re-snapshot `git status --porcelain` to confirm no Codex modifications.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-023 | /review TUI command | Verify /review interactive command surfaces categorized findings against staged changes | `Run /review in the Codex TUI on a staged throwaway diff and report categories, changed-line reference, and clean exit.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx023 && mkdir -p /tmp/cli-codex-playbook-cx023 && cd /tmp/cli-codex-playbook-cx023 && git init -q && printf 'initial\n' > scratch.md && git add scratch.md && git commit -q -m init && printf 'initial\nadded line for /review TUI manual check\n' > scratch.md && git add scratch.md` -> 2. `bash: cd /tmp/cli-codex-playbook-cx023 && git status --porcelain > /tmp/cli-codex-cx023-pre.txt && git diff --cached > /tmp/cli-codex-cx023-diff.txt` -> 3. (interactive) `bash: if test -t 0; then cd /tmp/cli-codex-playbook-cx023 && codex; else printf 'SKIP — /review requires a TTY\n' > /tmp/cli-codex-cx023-skip.txt; fi` -> 4. (inside TUI) type `/review`, observe categorized output, copy-paste to `/tmp/cli-codex-cx023-tui-output.txt`, then quit the TUI -> 5. `bash: cd /tmp/cli-codex-playbook-cx023 && git status --porcelain > /tmp/cli-codex-cx023-post.txt && diff /tmp/cli-codex-cx023-pre.txt /tmp/cli-codex-cx023-post.txt` | Step 1: throwaway repo created with one staged change; Step 2: pre-snapshot + diff captured; Step 3: TTY run launches the TUI or records the documented SKIP; Step 4: TTY /review output includes at least one category heading and references the added line, or the SKIP file exists; Step 5: pre/post snapshots match | Throwaway repo state, pre/post snapshots, captured TUI output or SKIP record, dispatched command, observed exit | PASS if a TTY run launches, /review executes, the captured output contains a category and staged-line reference, AND post-snapshot equals pre-snapshot; SKIP if stdin is not a terminal; FAIL only for an error in a TTY run | (1) Confirm Codex CLI version supports `/review` slash command (`codex --version`); (2) verify `git diff --cached` is non-empty before launching TUI; (3) if stdin is not a terminal, record the documented SKIP and run CX-003 separately for the noninteractive review surface |

### Optional Supplemental Checks

- Repeat with `/review HEAD~1` (commit-comparison mode) and confirm the same shape (categorized findings against the named commit).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/codex-tools.md` (§2 /review Command) | Authoritative /review documentation |
| `../../references/cli-reference.md` (§7 Interactive Commands) | Documents TUI slash commands |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/codex-tools.md` | §2 Unique Capabilities - /review |
| `../../references/cli-reference.md` | §7 Interactive Commands |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CX-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `built-in-tools/review-tui-command.md`
