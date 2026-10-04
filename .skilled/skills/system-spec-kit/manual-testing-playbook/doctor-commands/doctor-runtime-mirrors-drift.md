---
title: "DOC-353 -- Doctor runtime mirrors drift"
description: "Manual scenario validating that /doctor:runtime-mirrors reports a drifted mirror surface with its repair command and writes nothing."
version: 1.1.0.0
id: doctor-commands-doctor-runtime-mirrors-drift
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-353 -- Doctor runtime mirrors drift

## 1. OVERVIEW

This scenario validates `/doctor:runtime-mirrors` when one mirror surface has drifted. In the environment, one generated Pi prompt stub is removed so the Pi prompts checker fails while every other surface stays in sync.

The doctor reports the drifting surface with its own verdict and names the repair command. The diagnostic itself still writes nothing, and running the named repair command restores the environment.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a drifted surface is reported with its own verdict and repair command, and that the diagnostic writes nothing.
- Playbook ID: DOC-353.
- Real user request: `Some runtime mirrors look out of sync. Check which ones and how to repair them.`
- Prompt: `Some runtime mirrors look out of sync. Check which ones and how to repair them.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, whose mirrors start fully in sync, and a user-global Codex hooks configuration that matches the repository's `.codex/hooks.json`.
- Expected execution process: Confirm the environment starts in sync, remove one generated Pi prompt stub, run `/doctor:runtime-mirrors`, capture the drifting row and the summary, then run the named repair command and confirm the environment is in sync again.
- Expected signals: The Pi prompts checker exits 1 for the missing stub. The per-checker table marks that surface DRIFT with the repair command `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs`. Every other surface stays in sync. The summary shows `Target: runtime-mirrors`, `Status: DRIFT`, and `STATUS=DRIFT` with the repair command as the recommendation. The run itself writes nothing, so `git status --porcelain` lists only the removed file.
- Desired user-visible outcome: A per-surface table that isolates the drifting mirror and names the command that repairs it.
- Pass/fail: PASS if only the expected surface is reported drifting, its repair command is named, and the diagnostic run changes nothing else.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Some runtime mirrors look out of sync. Check which ones and how to repair them.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. Confirm the environment starts in sync: run `/doctor:runtime-mirrors` once and confirm `Status: OK`.
3. Record `git status --porcelain`.
4. Remove one generated Pi prompt stub, for example `rm .pi/prompts/create-command.md`, and confirm the removal with `git status --porcelain`.
5. Run `/doctor:runtime-mirrors` through the real runtime.
6. Capture the per-checker table and confirm the Pi prompts row shows DRIFT with the repair command, while every other row stays in sync.
7. Capture the summary block and confirm `Status: DRIFT` and `STATUS=DRIFT`.
8. Record `git status --porcelain` again and confirm it lists only the removed file, proving the diagnostic wrote nothing else.
9. Restore the environment: run `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs`, confirm the stub exists again, rerun `/doctor:runtime-mirrors` to confirm `Status: OK`, and confirm `git status --porcelain` prints nothing.

### Expected

The removal of one generated stub makes exactly one checker fail. The Pi prompts row reports DRIFT and names the repair command from the workflow's repair list. Every other surface reports in sync, so the aggregate stays honest per surface rather than collapsing into one verdict.

The summary reports DRIFT with the repair command as the recommendation. The diagnostic run itself writes nothing, because every checker is invoked in its check-only form. The repair is performed separately by the operator, and the closing rerun reports OK.

### Evidence

- The baseline doctor run with `Status: OK`.
- The baseline `git status --porcelain` and the removal command with the resulting listing.
- The drifting Pi prompts row with its repair command.
- The summary block with `Status: DRIFT` and `STATUS=DRIFT`.
- The post-repair stub listing, the closing doctor run with `Status: OK`, and the final `git status --porcelain` output.

### Pass / Fail

- **Pass**: Only the expected surface is reported drifting, its repair command is named, and the diagnostic run changes nothing else.
- **Fail**: Additional surfaces drift, the drifting row names no repair command, the summary is not DRIFT, or the run changes a file beyond the removed stub.

### Failure Triage

If more than one surface drifts, confirm the removed stub is covered by exactly one checker and choose a different generated stub. If the drifting row names no repair command, inspect the repair list in `doctor-runtime-mirrors.yaml`. If the working tree changes beyond the removed file, inspect the check-only flags in the execution steps, because a diagnostic must never regenerate, create a link, or install a hook.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/runtime-mirrors.md](../../../../commands/doctor/runtime-mirrors.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml](../../../../commands/doctor/assets/doctor-runtime-mirrors.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-runtime-mirrors-presentation.txt](../../../../commands/doctor/assets/doctor-runtime-mirrors-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:runtime-mirrors

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-353
- Feature name: Doctor runtime mirrors drift
- Command mode: `/doctor:runtime-mirrors`
- YAML asset: `doctor-runtime-mirrors.yaml`
- Mutation boundary: read-only. The diagnostic writes nothing, and the repair is a separate operator action. The environment is restored after the repair.
- Feature file path: `doctor-commands/doctor-runtime-mirrors-drift.md`
