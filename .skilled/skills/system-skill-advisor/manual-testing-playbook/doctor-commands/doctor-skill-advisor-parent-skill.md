---
title: "DOC-366 -- Doctor skill-advisor parent skill"
description: "Manual scenario validating that /doctor:skill-advisor parent-skill runs the fleet root-metadata gate and the selected hub checker read-only, reports each exit code, and maps them to the documented statuses."
version: 1.1.0.0
id: doctor-commands-doctor-skill-advisor-parent-skill
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-366 -- Doctor skill-advisor parent skill

## 1. OVERVIEW

This scenario validates `/doctor:skill-advisor parent-skill`, the read-only structural audit that runs the fleet-wide root-metadata gate and then a deep check of one selected parent hub. The fleet gate starts from `SKILL.md`, so it is the only check that can report a metadata file a root never wrote. The per-hub checker then verifies the selected hub's registry and directory consistency, mode routing contract, changelog shape, root description, playbook, benchmark baseline and routing-version consistency.

Both checks are read-only. The fleet gate runs with no fix flag, and the parent checker runs even when the fleet gate reports findings.

---

## 2. SCENARIO CONTRACT

- Objective: Prove both checks run read-only with separate exit codes, a clean copy maps both exits 0 to `STATUS=OK`, and a prohibited nested metadata file makes the parent checker fail.
- Playbook ID: DOC-366.
- Real user request: `Audit a parent skill hub for mode-registry and graph-metadata drift.`
- Prompt: `Audit a parent skill hub for mode-registry and graph-metadata drift.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, whose skill roots and selected hub satisfy the metadata contract, with a hub under `.skilled/skills/` that carries a mode registry and one `graph-metadata.json` per mode packet.
- Expected execution process: Run the target in the environment and answer the directory prompt, repeat it with an explicit directory, then add a nested `graph-metadata.json` inside one mode packet, re-run the parent checker with and without the strict setting, and remove the probe.
- Expected signals: The workflow executes the fleet gate with no fix flag and the parent checker with the selected directory as the first positional argument, even when the fleet gate reports findings. Both reports print with their own exit codes. Both exits 0 map to `STATUS=OK`, any exit 1 maps to `STATUS=FAIL ERROR="parent-skill invariant failed"`, and any exit 2 maps to `STATUS=ERROR ERROR="parent-skill audit could not run"`. A mode packet may use packet kind `workflow`, `surface` or `transport`, while a nested `graph-metadata.json` or `description.json` is prohibited and makes the parent checker report a failing invariant with exit 1. With `PARENT_HUB_CHECK_STRICT=0` the hard failure remains a failure. No audited file changes.
- Desired user-visible outcome: Two reports, each with its exit code, and one final status that matches the documented mapping.
- Pass/fail: PASS if the clean environment maps both exits 0 to `STATUS=OK`, the nested metadata probe makes the parent checker exit 1 and maps to `STATUS=FAIL`, and no audited file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Audit a parent skill hub for mode-registry and graph-metadata drift.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Run every step below inside the environment.
2. If the environment has no dependencies yet, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .worktrees/.doctor-test-environment`.
3. Run `/doctor:skill-advisor parent-skill`. Answer the `Which parent skill hub should be audited?` prompt with a hub directory under `.skilled/skills/`. Confirm the fleet gate ran first and with no fix flag.
4. Confirm both reports print with separate exit codes and the final status follows the mapping. Both checks exit 0 here, so the run ends `STATUS=OK`.
5. Run `/doctor:skill-advisor parent-skill --dir=<hub-dir>`. Confirm the directory prompt is skipped and both checks run again.
6. Record the checksums of the selected hub, then add a nested `graph-metadata.json` inside one of its mode packets.
7. Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs "<hub-dir>"`. Confirm the parent checker reports the failing invariant and exits 1.
8. Repeat the parent checker with `PARENT_HUB_CHECK_STRICT=0`. Confirm the hard failure remains a failure.
9. Remove the probe file, confirm the checks return to exit 0, compare the checksums with step 6, restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

Phase 0 resolves the directory, runs the fleet gate with no fix flag, then runs the parent checker with the directory as the first positional argument even when the fleet gate reports findings. Both standard outputs and both exit codes are captured separately. Phase 1 prints both reports and maps the codes to the final status exactly as documented. The nested metadata probe is reported rather than deleted, and the strict setting never turns a hard failure into a pass.

### Evidence

- Both reports and both exit codes from step 4 and step 5.
- The nested probe path and the failing invariant line from step 7.
- The exit code from the `PARENT_HUB_CHECK_STRICT=0` run.
- The checksums from steps 6 and 9.
- The final `git status --porcelain` output.

### Pass / Fail

- **Pass**: The clean environment prints both reports with their exit codes and maps both to `STATUS=OK`, the nested metadata probe exits 1 and maps to `STATUS=FAIL`, the strict setting does not downgrade the hard failure, and no audited file changes.
- **Fail**: A check does not run, an exit code loses its mapping, the parent checker skips the audit when the fleet gate reports findings, or `PARENT_HUB_CHECK_STRICT=0` downgrades a hard failure.

### Failure Triage

If only one report prints, inspect the phase 0 activity order in `doctor-parent-skill.yaml` and confirm the parent checker is not skipped after fleet findings. If an exit code does not map to the documented status, inspect the phase 1 mapping. If the nested metadata file does not fail, inspect `parent-skill-check.cjs` and the current metadata contract in the skill authoring references.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-parent-skill.yaml](../../../../commands/doctor/assets/doctor-parent-skill.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md)

Provenance: manual only - /doctor:skill-advisor parent-skill

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-366
- Feature name: Doctor skill-advisor parent skill
- Command mode: `/doctor:skill-advisor parent-skill`
- YAML asset: `doctor-parent-skill.yaml`
- Mutation boundary: read-only. The audit reports and never edits the audited skill, re-indexes a database or mutates graph metadata.
- Feature file path: `doctor-commands/doctor-skill-advisor-parent-skill.md`
