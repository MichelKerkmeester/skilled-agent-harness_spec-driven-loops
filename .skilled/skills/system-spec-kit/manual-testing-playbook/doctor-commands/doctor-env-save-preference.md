---
title: "DOC-355 -- Doctor env save preference"
description: "Manual scenario validating that /doctor:env saves a preference only after it shows the exact destination line and the operator answers an unambiguous yes, and that a dry run writes nothing."
version: 1.2.0.0
id: doctor-commands-doctor-env-save-preference
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-355 -- Doctor env save preference

## 1. OVERVIEW

This scenario validates the confirmed-write path of `/doctor:env`. It selects the skill-advisor kill switch, a preference the hook-flags.env reader consumes, and walks the destination choice, the exact preview and the confirmation. The first confirmation is answered with an ambiguous word and must write nothing. The second is answered yes, and must write the one assignment, re-read it and finish with a terminal status.

A dry-run run then shows the identical preview, asks for no confirmation and leaves the file's checksum unchanged. The environment is restored at the end, and the live working copy keeps the committed state where `.skilled/hooks/hook-flags.env` is absent.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the preference write happens only after the exact destination line is shown and an unambiguous yes is given, and that a dry run performs no write.
- Playbook ID: DOC-355.
- Real user request: `Disable the skill advisor hook and save that preference for this checkout.`
- Prompt: `Disable the skill advisor hook and save that preference for this checkout.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, where `.skilled/hooks/hook-flags.env` is absent, alongside the committed template `.skilled/hooks/hook-flags.env.example`, and a runtime that can execute `/doctor:env` with Bash access.
- Expected execution process: Select the switch, supply `1` as the value, choose the hook-flags.env destination, answer the confirmation with an ambiguous word and then with yes, capture the written line, then repeat the same inputs under `--dry-run` and compare the file checksum before and after each run.
- Expected signals: The selected block names the variable and its documented source. The destination menu offers the hook-flags.env option because the hook reader consumes the switch, and the shell-profile option states that no profile is written. The proposed change block names `.skilled/hooks/hook-flags.env`, states the create-from-template operation, names `.skilled/hooks/hook-flags.env.example` as the initialization source, and shows the exact line `SYSTEM_SKILL_ADVISOR_DISABLED=1`. An ambiguous answer makes no write, leaves the file absent, and returns `STATUS=CANCELLED ACTION=cancelled`. An unambiguous yes writes only that assignment, and the re-read block `Verified from .skilled/hooks/hook-flags.env:` shows the written line with no surrounding file content, then the next-step prompt and `STATUS=OK`. The dry-run run shows the same destination and exact lines, asks for no confirmation, notes that no file was written, and returns `STATUS=OK` with the file's sha256 unchanged. Every other file keeps its checksum.
- Desired user-visible outcome: A preview that names the file and the exact line before any write, a refusal to write on an ambiguous answer, one written line after a clear yes, and a dry run that changes nothing.
- Pass/fail: PASS if the preview names the exact destination and line, the ambiguous answer writes nothing, the confirmed write stores exactly the assignment that was shown, the re-read shows it, the dry run leaves the checksum unchanged, and the environment is restored.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Disable the skill advisor hook and save that preference for this checkout.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Confirm `.skilled/hooks/hook-flags.env` is absent and record that absence as the baseline.
2. Run `/doctor:env SYSTEM_SKILL_ADVISOR_DISABLED` through the real runtime.
3. Capture the source-state table and the selected block, then reply `1` at the value prompt.
4. Capture the destination menu. Confirm the hook-flags.env option is offered and that the shell-profile option states that no profile is written. Choose the hook-flags.env option.
5. Capture the proposed change block. Confirm it names `.skilled/hooks/hook-flags.env`, states the create-from-template operation, names `.skilled/hooks/hook-flags.env.example` as the initialization source, and shows the exact line `SYSTEM_SKILL_ADVISOR_DISABLED=1`.
6. Answer `maybe` at the confirmation. Capture the terminal status and confirm the destination file is still absent.
7. Run the same selector again, repeat steps 3 to 5 with the same inputs, and answer `yes` at the confirmation.
8. Capture the re-read block `Verified from .skilled/hooks/hook-flags.env:` and the written line, then the next-step prompt and the terminal status. Record the file's sha256 and compare its content with the exact lines from step 5.
9. Run `/doctor:env SYSTEM_SKILL_ADVISOR_DISABLED --dry-run`, reply `1`, choose the same destination, and confirm the preview matches the one captured in step 7, that no confirmation is asked, that the dry-run note appears in its place, and that the terminal status is `STATUS=OK`.
10. Record the sha256 again and compare it with step 8.
11. Restore the pre-scenario state by deleting `.skilled/hooks/hook-flags.env`, because the environment started without it. Confirm the file is absent, then record `git status --porcelain` and confirm no other file changed.
12. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

The run first shows the source state and the selected block, then asks for a value. A valid answer produces the destination menu, where the hook-flags.env option appears because the reader of that file consumes this switch. Choosing it produces the proposed change block with the exact destination, the create-from-template operation, the initialization source and the exact assignment line.

The confirmation appears immediately before the mutation. An answer that is not an unambiguous yes makes no write and returns `STATUS=CANCELLED ACTION=cancelled`, with the file still absent. An unambiguous yes writes only the assignment, and the re-read block shows the written line. No surrounding file content is printed. The run then shows the next-step prompt and the terminal status `STATUS=OK`.

The dry-run run shows the identical destination and exact lines, asks for no confirmation, notes that no file was written, and ends with `STATUS=OK`. The file's sha256 is identical before and after that run.

### Evidence

- The selected block and value prompt for the switch.
- The destination menu with the hook-flags.env option.
- The proposed change block with the exact destination and line.
- The terminal status and the destination state after the ambiguous answer.
- The written file content and the re-read block after the yes.
- The checksum before and after the dry-run run.
- The restore check on the environment and the final `git status --porcelain` output.

### Pass / Fail

- **Pass**: The preview names the exact destination and line, the ambiguous answer writes nothing, the confirmed write stores exactly the line that was shown, the re-read shows it, the dry run leaves the checksum unchanged, and the destination is restored.
- **Fail**: A write happens without an unambiguous yes, the written line differs from the preview, the re-read is missing, the dry run changes the file, surrounding file content is printed, or another file changes.

### Failure Triage

If the destination menu omits the hook-flags.env option, inspect the eligibility rule against the hook kill-switch reader and the examples in `hook-flags.env.example`. If a write happens without an unambiguous yes, inspect the confirmation policy in `doctor-env.yaml`. If the dry run writes, inspect the dry-run branch of the preference handling. If the run reports the documented type is ambiguous, record a FAIL and inspect how a truthy disable flag maps to the boolean family in the type validation table.

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
- Playbook ID: DOC-355
- Feature name: Doctor env save preference
- Command mode: `/doctor:env`
- YAML asset: `doctor-env.yaml`
- Mutation boundary: one approved write to `.skilled/hooks/hook-flags.env` inside the environment, initialized from `.skilled/hooks/hook-flags.env.example`. The `.env` file, shell profiles and every other file stay read-only, and the environment is restored at the end.
- Feature file path: `doctor-commands/doctor-env-save-preference.md`
