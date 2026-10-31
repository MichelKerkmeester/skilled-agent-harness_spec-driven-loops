---
title: "DOC-399 -- Doctor install"
description: "Manual scenario validating that /doctor:install list prints the five ordered setup steps, and that a guided run with --root and --runtimes prints the two build checks, the symlink check lines for the target repo and the checklist with each step's class, then stops without writing anything."
version: 1.0.0.0
id: doctor-commands-doctor-install
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-399 -- Doctor install

## 1. OVERVIEW

This scenario validates the one read-only target of `/doctor:install`, the `guide` target, which `/doctor:install` alone binds. The guide reports whether the two builds the runtimes load are present, asks for the answers it still needs in one prompt, runs the symlink engine's read-only check against the target repo, and prints the ordered setup commands with each command's class and one line of why. Each printed step writes when the operator runs it, and none of them runs here.

The scenario covers both entry points. `list` prints the five steps with no build check and no inspection. A guided run with `--root` and `--runtimes` supplied prints the build check, the symlink check lines and the checklist, and stops there. Both are proved to write nothing by comparing the scratch target folder and the checkout's `git status --porcelain` with their baselines.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that `list` prints the five ordered steps with their classes and why lines, that a guided run with `--root` and `--runtimes` prints the build check, the engine's check lines for that root and the checklist, asks only for the answers the flags left open, and writes nothing.
- Playbook ID: DOC-399.
- Real user request: `Get Skilled into my own project. Tell me the steps.`
- Prompt: `Get Skilled into my own project. Tell me the steps.`
- Preconditions: The Skilled checkout on the current branch with `.skilled/commands/doctor/install.md`, `.skilled/commands/doctor/assets/doctor-install.yaml`, `.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `.skilled/commands/doctor/scripts/symlink-engine.cjs` and `.skilled/commands/doctor/_routes.yaml` in place, plus a runtime that can execute `/doctor:install` with Bash access. Node and git available. A scratch target folder the operator can create under a temporary directory. No network access needed.
- Expected execution process: Confirm the checkout assets and record the checkout's `git status --porcelain`. Create the scratch target folder and record its listing. Run `/doctor:install list` and capture the five steps. Confirm the scratch folder and the checkout are unchanged. Run `/doctor:install --root <scratch> --runtimes claude`, answer the open questions with `auto, embed`, and capture the build check, the prompt, the symlink check block, the checklist header, the five steps with their classes, the caveat line and the result summary. Compare both baselines with the state after the run.
- Expected signals: `list` prints the five steps of the presentation contract in order, each with its exact command, its class and its `Why:` line: `/doctor:symlink link --root <dir> --runtimes <list> --mode <shape>`, `/doctor:agents-md embed --root <dir>`, `/doctor:mcp install`, `/doctor:git setup` and `/doctor:setup`, with `<dir>`, `<list>` and `<shape>` left as they stand. It prints no build block and inspects nothing. The guided run prints `DOCTOR INSTALL — BUILDS`, `Source: <the checkout>`, `Spec Kit build: found at .skilled/skills/system-spec-kit/runtime/dist` and `Advisor CLI: answers list-tools` on a checkout where both builds are present, and prints the four `npm` commands as step 0 when one is missing. It asks once, for the link shape and the instruction file only, because `--root` and `--runtimes` already answered the first two questions, and it takes `auto` and `embed`. It then prints `DOCTOR INSTALL — WHAT IS ALREADY THERE`, `Root: <the scratch path>` and the engine's entry lines verbatim, without re-sorting or re-wording them, which on an empty scratch folder with `--runtimes claude` reads `missing` for `.skilled`, `.claude` and `.mcp.json`. It prints the checklist under `DOCTOR INSTALL — <the scratch path>`, `Source:`, and one `Runtimes: claude   Link shape: auto   Instruction file: embed` line. Each of the five steps carries the class of the route that owns it, read from `_routes.yaml`: `mutates` for steps 1, 2 and 3 and `read-only` for steps 4 and 5. The fixed caveat line follows the steps word for word, then `DOCTOR INSTALL RESULT` with `Builds: both found`, `Steps: 5 printed, 3 of them write`, `Next: run step 1 from the Skilled checkout, then the rest in order` and `STATUS=OK STEPS=5`, and the presentation closes on `What would you like to do next?`.
- Desired user-visible outcome: A short checklist the operator can run themselves, with each command's class visible, the target repo already checked, and nothing changed by the guide.
- Pass/fail: PASS if `list` prints the five ordered steps with their classes and why lines, the guided run prints the build check, the engine's check lines for the target root and the five steps with classes `mutates`, `mutates`, `mutates`, `read-only` and `read-only`, asks only for the link shape and the instruction file, prints the caveat line and ends `STATUS=OK`, and both the scratch folder and the checkout match their baselines afterwards. FAIL if the run executes a printed step instead of printing it, asks again for the root or the runtime list, re-words or re-sorts an engine line, drops a step, a class or the caveat line, or writes anything to the scratch folder or the checkout.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Get Skilled into my own project. Tell me the steps.
```

### Commands

1. Confirm the checkout assets exist: `.skilled/commands/doctor/install.md`, `.skilled/commands/doctor/assets/doctor-install.yaml`, `.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `.skilled/commands/doctor/scripts/symlink-engine.cjs` and `.skilled/commands/doctor/_routes.yaml`. Record the checkout root and its `git status --porcelain` as the checkout baseline.

2. Create the scratch target folder and record its baseline:
   ```bash
   SCRATCH="$(mktemp -d)/scratch-project"
   mkdir -p "$SCRATCH"
   ls -A "$SCRATCH"
   ```

3. Run `/doctor:install list` through the real runtime. Capture every line it prints.

4. Confirm the listing run inspected nothing and wrote nothing: run `ls -A "$SCRATCH"` again and compare `git status --porcelain` in the checkout with the baseline from step 1.

5. Run `/doctor:install --root "$SCRATCH" --runtimes claude` through the real runtime. When the prompt appears, answer `auto, embed` in one reply. Capture the build block, the prompt as it prints, the symlink check block, the checklist header, the five steps, the caveat line, the result summary and the closing line.

6. Record the engine's own check output for the same root, to compare the lines the guide quoted:
   ```bash
   node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "$SCRATCH" --runtimes claude
   ```

7. Confirm the guided run wrote nothing: compare `ls -A "$SCRATCH"` and the checkout's `git status --porcelain` with the baselines from steps 1 and 2, and confirm no run directory appeared under `.skilled/output/doctor-symlink/`.

8. Read the class of each printed step from `.skilled/commands/doctor/_routes.yaml` and compare it with the class on the printed line: `link` under `/doctor:symlink` is `mutates`, `embed` under `/doctor:agents-md` is `mutates`, `install` under `/doctor:mcp` is `mutates`, `setup` under `/doctor:git` is `read-only`, and `setup` under `/doctor:setup` is `read-only`.

### Expected

`list` prints the five steps of the checklist and stops. Each step carries its exact command with `<dir>`, `<list>` and `<shape>` still standing as placeholders, its class and one `Why:` line. No build block, no prompt, no symlink check and no inspection of anything appears, and the scratch folder and the checkout stay as they were.

The guided run prints the build block first. On a provisioned checkout both builds report present, in the `found at .skilled/skills/system-spec-kit/runtime/dist` and `answers list-tools` forms, and no step 0 appears. On a checkout missing a build the block names it as missing and the four `npm` commands print as step 0, which is reported rather than hidden and does not stop the guide.

The prompt asks once for the link shape and the instruction file, because `--root` and `--runtimes` already answered the root and the runtime list. It never asks for those two again. The answer `auto, embed` binds `--mode auto` and keeps step 2 in the checklist.

The symlink check block renders the engine's entry lines for the scratch root verbatim, in the engine's order, with its indented detail lines and its repository-level warnings untouched. On an empty scratch folder with `--runtimes claude` those lines read `missing` for `.skilled`, `.claude` and `.mcp.json`, and the check exits 0, because a `missing` line is work for step 1 rather than a failure.

The checklist prints under its header, with the runtime list, the link shape and the instruction file on one line. The five steps stay in order and each class matches the owning route in `_routes.yaml`, so steps 1 to 3 read `mutates` and steps 4 and 5 read `read-only`. The class is the route's own `mutating` value, never guessed, and a printed command with no route of its own would read `n/a`.

The caveat line follows the steps word for word, and the result summary reports both builds found, five steps printed, three of them writing, and `STATUS=OK STEPS=5`. The run then closes on `What would you like to do next?`.

Nothing is written. The scratch folder is still empty, the checkout's `git status --porcelain` matches its baseline, and no run directory appears under `.skilled/output/doctor-symlink/`, because the only command the guide runs is the engine's read-only check and every writing command is printed for the operator.

### Evidence

- The preflight observations for the five checkout assets, the checkout root and the checkout baseline.
- The scratch folder path and its baseline listing.
- The full `list` output with the five steps, their commands, their classes and their why lines.
- The scratch listing and checkout `git status --porcelain` from step 4, showing the listing run inspected and wrote nothing.
- The guided run's build block, prompt as printed, symlink check block, checklist header, five step lines, caveat line, result summary and closing line.
- The direct engine check output from step 6, compared line by line with the lines the guide quoted.
- The class comparison from step 8 between each printed step and `_routes.yaml`.
- The scratch listing, the checkout `git status --porcelain` and the empty `.skilled/output/doctor-symlink/` check from step 7.

### Pass / Fail

- **Pass**: `list` prints the five ordered steps with their commands, classes and why lines and inspects nothing, the guided run prints the build block, the engine's check lines for the target root and the five steps with classes `mutates`, `mutates`, `mutates`, `read-only` and `read-only`, asks only for the link shape and the instruction file, prints the caveat line verbatim, ends `STATUS=OK`, and leaves the scratch folder and the checkout at their baselines.
- **Fail**: The guide runs a writing command rather than printing it, asks again for the root or the runtime list, re-words, re-sorts or sums the engine's lines, drops a step, a class or the caveat line, prints prose around a `--json` style single object when none was asked for, or changes the scratch folder, the checkout or `.skilled/output/doctor-symlink/`.

### Failure Triage

If the engine exits 2 with `ERROR:` while the guide checks the target, the root is absent, is the checkout, sits inside it or holds it, and the guide asks for question 1 again rather than guessing. If a step prints `n/a` as its class, that printed command has no route in `_routes.yaml`, and the command still works. If the build block reports a missing build, run the four `npm` commands the guide printed as step 0 from the checkout and rerun the guide, and read the missing build as a checkout condition rather than a guide failure. If the caveat line is missing or shortened, the run departed from the presentation contract, which fixes that line word for word. If the checklist prints a class other than the one in `_routes.yaml`, the run guessed a class instead of reading the route table. If the scratch folder or the checkout changed, the guide crossed its read-only boundary, which is a failure of the mutation class in `_routes.yaml`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/install.md](../../commands/doctor/install.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-install.yaml](../../commands/doctor/assets/doctor-install.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-install-presentation.txt](../../commands/doctor/assets/doctor-install-presentation.txt)
- Engine the guide checks with: [.skilled/commands/doctor/scripts/symlink-engine.cjs](../../commands/doctor/scripts/symlink-engine.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:install guide

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-399
- Feature name: Doctor install
- Command mode: `/doctor:install` and `/doctor:install list`
- YAML asset: `doctor-install.yaml`
- Mutation boundary: Read-only. The guide checks the two builds, asks its one prompt and runs `symlink-engine.cjs check` against the target root, which writes nothing. Every writing step is printed with its exact command and left for the operator to run, each of those steps showing its own plan and asking its own yes.
- Feature file path: `doctor-commands/doctor-install.md`
