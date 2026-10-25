---
title: "DOC-382 -- Doctor sk-code setup"
description: "Manual scenario validating that /doctor:sk-code setup runs the eight-leg read-only setup battery, maps its exit codes to STATUS=OK, STATUS=FAIL and STATUS=ERROR, and writes nothing."
version: 1.1.1.0
id: doctor-commands-doctor-sk-code-setup
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-382 -- Doctor sk-code setup

## 1. OVERVIEW

This scenario validates `/doctor:sk-code setup`, the read-only battery that reports whether the sk-code surface can route end to end. The battery runs eight legs in order: the shared frontmatter package resolves (provisioning), the parent hub passes its structural invariants (parent-skill), the root metadata manifests are fresh (root-metadata), the compiled-route guard finds no stale or drifted hub (guard), the served runtime copies match their authored closure (sync), the sk-code drift guards pass (drift-guards), the derived metadata is fresh (derived-freshness), and a probe prompt actually routes through the compiled router (probe).

Every leg runs in its check-only form, and each failing leg prints the command that repairs it instead of applying one, so the run writes nothing. The probe is the one leg whose exit code proves nothing on its own, because the legacy stub also exits 0, so it passes only on a parsed `action: "route"` decision.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the clean battery maps exit 0 to `STATUS=OK legs=8`, the prompt flag reaches the probe line, a bad argument maps exit 2 to a usage error, a nested metadata file makes the parent-skill leg fail, the compiled-routing kill-switch makes the probe leg fail, and no run writes a file.
- Playbook ID: DOC-382.
- Real user request: `Run the doctor sk-code setup check and tell me whether the sk-code surface passes its setup battery.`
- Prompt: `Run the doctor sk-code setup check and tell me whether the sk-code surface passes its setup battery.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, and provisioned once so the built runtime and dependencies are present. The tree is clean, so all eight legs pass, and no probe file exists at the nested metadata path.
- Expected execution process: Run the battery on the clean tree and capture its eight PASS lines, its last line and its exit code, repeat it with an operator prompt, pass an unknown argument, add a nested `graph-metadata.json` and rerun, remove the probe, run once with `SPECKIT_COMPILED_ROUTING=0`, and confirm the tree is unchanged after every step.
- Expected signals: The clean run exits 0 with the header line `/doctor:sk-code setup (read-only; writes nothing)`, eight PASS lines in the order provisioning, parent-skill, root-metadata, guard, sync, drift-guards, derived-freshness and probe, and the last line `STATUS=OK legs=8`. With `--prompt=<text>` the probe line ends with `--prompt "<text>"` and the run still exits 0. Any other argument prints `Usage: node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs [--prompt=<text>]` and exits 2 with no battery output. Through the real slash command a bad argument is rejected by the router before the battery runs, printing the presentation's argument failure ending `STATUS=FAIL ERROR="unknown_argument"`, and the script's own exit 2 maps to `STATUS=ERROR` only when it is run directly. A nested `graph-metadata.json` makes the parent-skill leg report its failing invariants, print the `repair:` line `fix each FAIL line above, then rerun node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`, and end `STATUS=FAIL failed=1 skipped=0` with exit 1. With `SPECKIT_COMPILED_ROUTING=0` the probe leg reports `served the legacy stub because SPECKIT_COMPILED_ROUTING="0" switches compiled routing off`, prints the `repair:` line `unset SPECKIT_COMPILED_ROUTING, then rerun node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs`, and ends `STATUS=FAIL failed=1 skipped=0` with exit 1. Exit 0 maps to `STATUS=OK`, exit 1 to `STATUS=FAIL` and exit 2 to `STATUS=ERROR`. `git status --porcelain` prints nothing after every step, and each battery run takes about 35 seconds.
- Desired user-visible outcome: One per-leg result table rendered through the presentation contract, a final status that matches the battery's exit code, and a named repair command for each failing leg.
- Pass/fail: PASS if the clean run exits 0 with `STATUS=OK legs=8`, the prompt flag reaches the probe line, the bad argument exits 2 with the usage line, both failure runs exit 1 with their named `repair:` lines, and no file is written.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run the doctor sk-code setup check and tell me whether the sk-code surface passes its setup battery.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Run every step below inside the environment.
2. If the environment has no dependencies yet, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .`.
3. Run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` and capture the header line, the eight PASS lines, the last line and the exit code.
4. Run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs --prompt="review my typescript module for jank"` and confirm the probe line carries the prompt.
5. Run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs --bogus` and capture the usage line and the exit code.
6. Add the probe: run `echo '{}' > .skilled/skills/sk-code/sk-code-skilled/graph-metadata.json`.
7. Rerun `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` and capture the parent-skill failure, its `repair:` line and the exit code.
8. Restore: run `rm .skilled/skills/sk-code/sk-code-skilled/graph-metadata.json` and confirm the battery returns to `STATUS=OK legs=8`.
9. Run `SPECKIT_COMPILED_ROUTING=0 node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` and capture the probe failure, its `repair:` line and the exit code.
10. Confirm `git status --porcelain` prints nothing after every step.

### Expected

The battery runs its eight legs in order from the repository root and prints one verdict line per leg with the command it ran. The parent-skill leg prints `PASS: 3b: mode-registry.json declares 3 modes` and `PASS: 3g: all 1 surface packet(s) are read-only evidence-base and advisor-invisible` for `sk-code-quality`, `sk-code-review` and `sk-code-skilled`. The clean tree passes every leg, so the run ends `STATUS=OK legs=8` and the route exits 0. The prompt flag is the only accepted argument, and the probe line shows the operator's own prompt.

A bad argument fails before any leg runs, prints the usage line on standard error and exits 2, which the route maps to `STATUS=ERROR`. The nested metadata probe is reported rather than deleted, the repair command names the checker to rerun, and the restore step returns the tree to its passing state. The kill-switch run keeps the other seven legs passing and fails only the probe, because the flag deliberately serves the legacy stub. No step writes a file, so the working tree is identical after the run.

Through the slash command the router rejects a bad argument before the workflow loads and prints the presentation's argument failure ending `STATUS=FAIL ERROR="unknown_argument"`, while the script's own exit 2 maps to `STATUS=ERROR` only when it is run directly.

### Evidence

- The clean run's header line, eight PASS lines, `STATUS=OK legs=8` line and exit code.
- The probe line from the `--prompt` run and its exit code.
- The usage line and exit code from the bad-argument run.
- The parent-skill failure output with its FAIL detail lines and `repair:` line, and its exit code.
- The kill-switch run's probe detail, `repair:` line and exit code.
- The `git status --porcelain` output after every step.

### Pass / Fail

- **Pass**: The clean run exits 0 with `STATUS=OK legs=8`, the prompt flag reaches the probe line, the bad argument exits 2 with the usage line, the nested metadata probe and the kill-switch run each exit 1 with their named `repair:` lines, and no file is written.
- **Fail**: A leg fails on the clean tree, the prompt flag is ignored or rejected, the bad argument runs the battery or exits with any other code, a failure run omits its `repair:` line or ends with a different status line, or any step writes a file.

### Failure Triage

If a leg fails on a clean tree, run the `repair:` command the battery printed under that leg and rerun the battery. If the probe serves the legacy stub with the flag unset, run the manifest refresh and copy commands the repair line names. If the prompt flag does not reach the probe line, inspect the argument parsing in `sk-code-setup-check.cjs`. If the nested metadata file does not fail the parent-skill leg, inspect `parent-skill-check.cjs` and the metadata contract in the skill authoring references. If the kill-switch run does not name the flag, inspect the probe judge's legacy branch.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/sk-code.md](../../../../commands/doctor/sk-code.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml](../../../../commands/doctor/assets/doctor-sk-code-setup.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt](../../../../commands/doctor/assets/doctor-sk-code-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Setup battery: [.skilled/commands/doctor/scripts/sk-code-setup-check.cjs](../../../../commands/doctor/scripts/sk-code-setup-check.cjs)
- Environment guide: [doctor-commands README](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md)

Provenance: manual only - /doctor:sk-code

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-382
- Feature name: Doctor sk-code setup
- Command mode: `/doctor:sk-code setup`
- YAML asset: `doctor-sk-code-setup.yaml`
- Mutation boundary: none. Every leg runs in its check-only form, each failure prints a repair command instead of applying one, and the restore step removes the probe file the scenario adds.
- Feature file path: `doctor-commands/doctor-sk-code-setup.md`
