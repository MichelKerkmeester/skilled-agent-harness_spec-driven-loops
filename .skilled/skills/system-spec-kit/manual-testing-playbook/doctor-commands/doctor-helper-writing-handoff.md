---
title: "DOC-394 -- Doctor helper hands a writing pick back and offers the fallback"
description: "Manual scenario validating that /doctor:helper prints a writing command as one line for the operator to run, never runs it, never adds a flag, and falls back to the read-only setup command when nothing matches."
version: 1.0.0.0
id: doctor-commands-doctor-helper-writing-handoff
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-394 -- Doctor helper hands a writing pick back and offers the fallback

## 1. OVERVIEW

This scenario validates the two paths where `/doctor:helper` must not act. A candidate whose class is `add-only` or `mutates` is printed as the exact line the operator runs, and the helper stops there, so that command's plan and its own approval govern the change. A problem that matches nothing offers the read-only `/doctor:setup` fallback and prints the no-match status.

On this path nothing is written, no approval is asked on another command's behalf, and no argument is appended to any printed line.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a writing pick is handed back rather than run, and that a problem with no candidate falls back to the read-only setup command.
- Playbook ID: DOC-394.
- Real user request: `My pre-commit hook keeps rejecting my commit.` followed by `Write me a poem about cats.`
- Prompt: `My pre-commit hook keeps rejecting my commit.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, a Node runtime that resolves the `yaml` package from the repository root, and git hook settings left exactly as they were found.
- Expected execution process: Record the working tree state and the current `speckit.hooks` configuration, run the helper with the writing problem, choose the writing candidate, capture what the helper prints, run the no-match problem, and compare both the configuration and the working tree state.
- Expected signals: The ranked line for the git hooks route carries the class `mutates`. Choosing it prints the exact line `/doctor:git hooks` and closes on `STATUS=OK ACTION=handoff`, with no hook setting changed and no approval requested. The printed line carries no argument beyond the command and its target. The no-match problem closes on `STATUS=NO_MATCH FALLBACK=/doctor:setup` and offers that read-only command. The `git status --porcelain` output and the hook configuration are unchanged.
- Desired user-visible outcome: The writing command named exactly, ready to paste, with the change still waiting for its own gate, and a clear next step when nothing matches.
- Pass/fail: PASS if the writing pick is printed and not run, no flag is appended, and the no-match path names the setup fallback. FAIL if the helper runs a writing command, appends an argument, asks for an approval, or changes any setting.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
My pre-commit hook keeps rejecting my commit.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. Record `git status --porcelain` and `git config --get-regexp '^speckit\.hooks\.'`.
3. Run `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "my pre-commit hook keeps rejecting my commit"`, and confirm the first candidate line starts `1) /doctor:git hooks` and carries the class `mutates`.
4. Run `/doctor:helper my pre-commit hook keeps rejecting my commit` through the real runtime, choose that candidate, and capture the printed line and the status line.
5. Confirm the printed line is the command and its target only, with no argument appended, and that no approval was requested.
6. Run `/doctor:helper write me a poem about cats`, and capture the no-match template and its status line.
7. Record `git status --porcelain` and `git config --get-regexp '^speckit\.hooks\.'` again, and compare both with step 2.

### Expected

The writing candidate carries the manifest's `mutates` class on its line. Choosing it prints the exact runnable line and stops with `STATUS=OK ACTION=handoff`: the helper loads no writing workflow, asks for no approval and appends no argument, so the target's own gate is untouched.

The no-match problem returns no candidate above the floor, so the helper offers the read-only setup command, which lists every doctor command and writes nothing, and closes on `STATUS=NO_MATCH FALLBACK=/doctor:setup`.

### Evidence

- The baseline and final `git status --porcelain` outputs.
- The baseline and final `speckit.hooks` configuration.
- The ranked list with the `mutates` class on the git hooks line.
- The printed hand-off line and its `STATUS=OK ACTION=handoff` status.
- The no-match template and its `STATUS=NO_MATCH FALLBACK=/doctor:setup` status.

### Pass / Fail

- **Pass**: The writing pick is printed and not run, no flag is appended, the no-match path names the setup fallback, and neither the working tree nor the hook configuration changes.
- **Fail**: A writing command runs, an argument is appended, an approval is requested, or any setting changes.

### Failure Triage

If a writing command runs, the pick was routed through the read-only path, so inspect the class comparison in the command workflow. If an argument appears on the printed line, read the hand-off rule in the presentation contract. If the no-match path prints no fallback, run the matcher directly with the same text and read its exit code, because exit 1 is the one that carries the fallback.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/helper.md](../../../../commands/doctor/helper.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-helper.yaml](../../../../commands/doctor/assets/doctor-helper.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-helper-presentation.txt](../../../../commands/doctor/assets/doctor-helper-presentation.txt)
- Matcher: [.skilled/commands/doctor/scripts/doctor-helper-match.cjs](../../../../commands/doctor/scripts/doctor-helper-match.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:helper

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-394
- Feature name: Doctor helper hands a writing pick back and offers the fallback
- Command mode: `/doctor:helper <problem in plain words>`
- YAML asset: `doctor-helper.yaml`
- Mutation boundary: read-only at the helper. A writing pick is printed as one line, and that command's own plan and approval run under its own frontmatter.
- Feature file path: `doctor-commands/doctor-helper-writing-handoff.md`
