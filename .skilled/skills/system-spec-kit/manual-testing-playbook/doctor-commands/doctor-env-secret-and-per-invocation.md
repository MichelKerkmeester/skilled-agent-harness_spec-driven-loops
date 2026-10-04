---
title: "DOC-356 -- Doctor env secret and per-invocation"
description: "Manual scenario validating that /doctor:env never asks for or saves a secret switch value and that a per-invocation switch is shown only as a one-command prefix."
version: 1.1.0.0
id: doctor-commands-doctor-env-secret-and-per-invocation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-356 -- Doctor env secret and per-invocation

## 1. OVERVIEW

This scenario validates the two class-specific paths of `/doctor:env`. A secret-classified row must show `[redacted]` as its default, presence only per source, and no value prompt or save prompt. A per-invocation switch from the git-hook marker section must show the one-command prefix form, state that it will not be saved, and write nothing.

The committed reference classifies no row as secret today, so the scenario appends one fixture row to the environment's reference to exercise the secret path. Two further selectors prove the boundaries around that path, one for a threshold whose name carries a text-token segment and one for a provider key the reference names only in prose. The run changes no file other than the fixture inside the environment.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a secret switch is never requested, displayed or saved, and that a per-invocation switch is shown as a one-command prefix and never persisted.
- Playbook ID: DOC-356.
- Real user request: `Show me how the environment switches handle a secret and a switch that only applies to one command.`
- Prompt: `Show me how the environment switches handle a secret and a switch that only applies to one command.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, permission to append one fixture row to the environment's `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, and a runtime that can execute `/doctor:env` with Bash access.
- Expected execution process: Append the fixture secret row, run the secret selector, the text-token threshold selector, an undocumented provider key selector and the per-invocation selector, capture every display and terminal status, and compare every inspected file's checksum before and after.
- Expected signals: The fixture row appears in the inventory table with `[redacted]` in its Default cell and a secret class, and its source-state row holds only `set`, `unset` or `unreadable`. Its selected block prints the variable name, the `Set in:` line, `The value is hidden and will not be requested, read for display, or changed.`, and the note that `.env` is the loading location for Code Mode provider credentials while other readers need an export. No value prompt, destination menu or confirmation follows, and the run ends with `STATUS=OK`. `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` stays a visible preference with `Default: 0.45` and `Type: number (0..1)`. `/doctor:env OPENAI_API_KEY` returns `STATUS=FAIL ERROR="no matching section or variable"` and asks for no value. `SPECKIT_SKIP_COMMENT_HYGIENE` prints `Per-invocation switch: SPECKIT_SKIP_COMMENT_HYGIENE`, `Default: unset`, `Type: =1`, a `Does:` line carrying the documented description, `Documented source: .skilled/scripts/git-hooks/pre-commit`, the one-command form `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit` as a prefix, and `This switch will not be saved.`, plus the pointer to `/doctor:git hooks (saved in git config, not in this file)`. No destination menu, confirmation or write follows, and the run ends with `STATUS=OK`. Every recorded checksum is unchanged at the end.
- Desired user-visible outcome: A secret shown by name and location only, a text threshold that keeps its visible default, and a one-command prefix that is never stored.
- Pass/fail: PASS if the secret path shows no value and asks nothing, the text-token threshold keeps its visible default, the undocumented provider key is refused with the no-match error, the per-invocation switch is shown as a prefix and not saved, and no inspected file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Show me how the environment switches handle a secret and a switch that only applies to one command.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. In the environment, append one fixture row to the last modern table row of section 3 in `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, immediately after the `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` row:

```
| `SPECKIT_DOCTOR_FIXTURE_API_KEY` | (unset) | string | Fixture provider API key used only by this scenario inside the environment. | `shared/config.ts` |
```

3. Record the sha256 of `.env`, `.claude/settings.local.json` and `.skilled/hooks/hook-flags.env` where each exists, and record each missing one as absent.
4. Run `/doctor:env SPECKIT_DOCTOR_FIXTURE_API_KEY` through the real runtime.
5. Capture the fixture's inventory row and source-state row. Confirm the Default cell reads `[redacted]`, the class is secret, and each source cell holds exactly one of `set`, `unset` or `unreadable`.
6. Capture the selected block. Confirm it names the variable, prints the `Set in:` line, the hidden-value statement and the Code Mode `.env` note, and then ends with `STATUS=OK` without a value prompt, a destination menu or a confirmation.
7. Run `/doctor:env SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD`, capture `Default: 0.45` and `Type: number (0..1)`, then reply `cancel` at the value prompt and capture the terminal status.
8. Run `/doctor:env OPENAI_API_KEY` and capture its terminal status and error.
9. Run `/doctor:env SPECKIT_SKIP_COMMENT_HYGIENE` and capture the per-invocation block, the one-command form, the not-saved line, the git-hooks pointer line and the terminal status.
10. Record the checksums from step 3 again and compare them.
11. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

A secret row never carries a value. The fixture row shows `[redacted]` for its default, its source-state cells are limited to set, unset or unreadable, and its selected block names the variable, the sources where it is set and the hidden-value statement, then continues without asking for anything. The `.env` note explains that Code Mode loads provider credentials from that file and that other readers need an export.

A name segment that counts text tokens is not a credential, so `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` keeps its visible default and type and ends at `STATUS=CANCELLED ACTION=cancelled` when the operator cancels at the value prompt. A provider key the reference names only in prose is not part of the parsed inventory, so the selector returns `STATUS=FAIL ERROR="no matching section or variable"` instead of asking for a value.

The per-invocation switch is described as a prefix for one command, states that it will not be saved, and points to `/doctor:git hooks` for a lasting gate setting. No destination menu, confirmation or write follows, and the run ends with `STATUS=OK`.

### Evidence

- The fixture row as appended, with its immediately preceding row visible for placement.
- The fixture's inventory row and source-state row.
- The selected secret block with the hidden-value statement and the Code Mode `.env` note, and its terminal status.
- The threshold display with its default and type, and its terminal status.
- The no-match error output for the provider key.
- The per-invocation block with the one-command prefix, the not-saved line and the git-hooks pointer line.
- The baseline and final checksums of every inspected file.
- The final `git status --porcelain` output.

### Pass / Fail

- **Pass**: The secret path shows `[redacted]`, requests no value and offers no destination, the threshold keeps its visible default, the provider key is refused with the no-match error, the per-invocation switch is shown as a prefix and not saved, and no file changes.
- **Fail**: A secret default or value is displayed, the secret path asks for a value or offers a save, the threshold is redacted, the provider key is resolved instead of refused, the per-invocation switch is written or offered a destination, or any file changes beyond the fixture row.

### Failure Triage

If the fixture row is not parsed, inspect the appended row's cell count against the modern header in `doctor-env.yaml`. If a secret default or value appears, inspect the secret classification and the presence-only probe rule. If the secret path asks for a value or shows a destination menu, inspect the secret handling branch. If the threshold is redacted, inspect the text-token exclusion list in the secret metadata rule. If the per-invocation block offers a destination or a confirmation, inspect the per-invocation handling branch and the one-command form in the presentation contract.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/env.md](../../../../commands/doctor/env.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-env.yaml](../../../../commands/doctor/assets/doctor-env.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-env-presentation.txt](../../../../commands/doctor/assets/doctor-env-presentation.txt)
- Inventory source of truth: [.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md](../../runtime/ENV-REFERENCE.md)
- Environment guide: [doctor-commands README](README.md)

The `/doctor:env` route is a standalone companion with no entry in the doctor route manifest.

Provenance: manual only - /doctor:env

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-356
- Feature name: Doctor env secret and per-invocation
- Command mode: `/doctor:env`
- YAML asset: `doctor-env.yaml`
- Mutation boundary: the doctor writes nothing. A secret value is never requested or stored and a per-invocation switch has no destination. The scenario's only edit is one fixture row in the environment's reference, and the environment is restored at the end.
- Feature file path: `doctor-commands/doctor-env-secret-and-per-invocation.md`
