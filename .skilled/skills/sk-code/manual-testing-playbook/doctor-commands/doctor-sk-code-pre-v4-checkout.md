---
title: "DOC-383 -- Doctor sk-code on a pre-v4 checkout"
description: "Manual scenario validating that /doctor:sk-code setup on a pre-v4 checkout runs no leg, fails provisioning with the v4-layout repair, reports seven SKIP legs, exits 1 and writes nothing."
version: 1.0.0.0
id: doctor-commands-doctor-sk-code-pre-v4-checkout
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-383 -- Doctor sk-code on a pre-v4 checkout

## 1. OVERVIEW

This scenario validates `/doctor:sk-code setup` on a checkout that predates the v4 layout, such as a shallow clone of release tag `v3.6.0.0`, which ships `.opencode/` and no `.skilled/` tree. The battery checks for `.skilled/skills/sk-code/SKILL.md` before running any leg, so on such a checkout it runs no leg at all: the provisioning leg fails with the v4-layout repair and the other seven legs are reported as SKIP with the reason `needs the v4 layout`.

The fixture is a throwaway clone the scenario builds and deletes, and both runs write nothing. The rerun with `SPECKIT_COMPILED_ROUTING=0` prints the same output, because the v4-layout check runs before the probe reads the flag.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the battery on a pre-v4 checkout runs no leg, fails provisioning with the v4-layout repair, reports the other seven legs as SKIP, exits 1 in well under a second, prints the same output under `SPECKIT_COMPILED_ROUTING=0`, and writes no file.
- Playbook ID: DOC-383.
- Real user request: `Run the doctor sk-code setup check in a checkout that predates the v4 layout and tell me what it reports.`
- Prompt: `Run the doctor sk-code setup check in a checkout that predates the v4 layout and tell me what it reports.`
- Preconditions: Network access to GitHub, because the fixture is a shallow clone of release tag `v3.6.0.0` from the public skilled-agent-harness repository, plus `git` and `node` on PATH. The current checkout carries the doctor command under `.skilled/commands/doctor/` to copy into the fixture. The fixture needs no dependencies, because no leg runs.
- Expected execution process: Make a temp dir with `mktemp -d`, shallow-clone `v3.6.0.0` into it, confirm `.skilled` is absent, copy the command, its assets and its script into the clone's `.opencode/commands/doctor/`, commit the copy as a baseline with a throwaway identity, run the battery, confirm `git status --porcelain` is empty, rerun with `SPECKIT_COMPILED_ROUTING=0`, confirm the tree is still clean and delete the temp dir.
- Expected signals: Both runs print the header line `/doctor:sk-code setup (read-only; writes nothing)`, one `FAIL  provisioning` line whose detail names the missing `.skilled/skills/sk-code/SKILL.md` and whose repair line names the v4-layout fix, seven `SKIP` lines (parent-skill, root-metadata, guard, sync, drift-guards, derived-freshness and probe) that each read `needs the v4 layout`, and the last line `STATUS=FAIL failed=1 skipped=7`. Both exit 1 in well under a second, because no leg runs, and `git status --porcelain` prints nothing after each run.
- Desired user-visible outcome: A report that names the checkout as pre-v4, gives the v4-layout repair and lists the seven skipped legs, with a final status that matches the run's exit code.
- Pass/fail: PASS if both runs exit 1 with `STATUS=FAIL failed=1 skipped=7`, the output carries the provisioning failure with its v4-layout repair and the seven SKIP lines, no leg runs, and no file is written.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when the fixture clone cannot reach GitHub, a network blocker outside the operator's control. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run the doctor sk-code setup check in a checkout that predates the v4 layout and tell me what it reports.
```

### Commands

1. Run `TMP_DIR="$(mktemp -d)"` and `CLONE="$TMP_DIR/skilled-v3.6.0.0"`, then clone the fixture: `git clone --depth 1 --branch v3.6.0.0 https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$CLONE"`.
2. Confirm the fixture predates the v4 layout: run `cd "$CLONE"` and then `test ! -e .skilled`, which exits 0.
3. Copy the command in from the current checkout: run `mkdir -p .opencode/commands/doctor/assets .opencode/commands/doctor/scripts`, then `cp <checkout>/.skilled/commands/doctor/sk-code.md .opencode/commands/doctor/sk-code.md`, `cp <checkout>/.skilled/commands/doctor/assets/doctor-sk-code-* .opencode/commands/doctor/assets/` and `cp <checkout>/.skilled/commands/doctor/scripts/sk-code-setup-check.cjs .opencode/commands/doctor/scripts/`, where `<checkout>` is the repository root of the current checkout.
4. Commit the copy as a baseline with a throwaway identity: run `git add -A` and `git -c user.name=Fixture -c user.email=fixture@test.invalid commit -m "baseline: doctor sk-code command"`, then confirm `git status --porcelain` prints nothing.
5. Run `node .opencode/commands/doctor/scripts/sk-code-setup-check.cjs` and capture the full output and the exit code.
6. Confirm `git status --porcelain` prints nothing after the run.
7. Run `SPECKIT_COMPILED_ROUTING=0 node .opencode/commands/doctor/scripts/sk-code-setup-check.cjs` and capture the full output and the exit code.
8. Confirm `git status --porcelain` prints nothing after the rerun.
9. Delete the fixture: run `cd ..` and `rm -rf "$TMP_DIR"`.

### Expected

The fixture predates the v4 layout, so the battery returns before running any leg and prints its verdict in one pass, well under a second. The FAIL line names the missing `.skilled/skills/sk-code/SKILL.md`, its repair line names the v4-layout fix, and each of the other seven legs is reported as SKIP with `needs the v4 layout` instead of a leg command. The run exits 1.

The rerun with `SPECKIT_COMPILED_ROUTING=0` prints the same output and exits 1, because the v4-layout check runs before the probe leg reads the flag. No step writes a file, so the working tree is identical after each run. The exact output of both runs:

```text
/doctor:sk-code setup (read-only; writes nothing)
FAIL  provisioning        require.resolve('@spec-kit/shared/frontmatter/parse-frontmatter.js')
      .skilled/skills/sk-code/SKILL.md is missing, so this checkout predates the v4 layout or never installed sk-code
      repair: install the .skilled/ tree from a v4 release, run /doctor:update compat, then rerun this check
SKIP  parent-skill        needs the v4 layout
SKIP  root-metadata       needs the v4 layout
SKIP  guard               needs the v4 layout
SKIP  sync                needs the v4 layout
SKIP  drift-guards        needs the v4 layout
SKIP  derived-freshness   needs the v4 layout
SKIP  probe               needs the v4 layout
STATUS=FAIL failed=1 skipped=7
```

### Evidence

- The full output and exit code of both runs.
- The timing of each run, proving no leg ran (well under a second).
- The `git status --porcelain` output after each run.
- The fixture's `test ! -e .skilled` check and the baseline commit hash.

### Pass / Fail

- **Pass**: Both runs exit 1 with `STATUS=FAIL failed=1 skipped=7`, the provisioning failure carries the v4-layout repair, the other seven legs are SKIP lines reading `needs the v4 layout`, no leg runs, and no file is written.
- **Fail**: A leg runs or passes, the FAIL detail or repair line differs, the SKIP lines do not read `needs the v4 layout`, either run exits with any other code, or any step writes a file.

### Failure Triage

If the battery reaches a leg, confirm the fixture lacks `.skilled/skills/sk-code/SKILL.md` and inspect the v4-layout branch in `sk-code-setup-check.cjs`. If the clone fails, the fixture could not reach GitHub, so record `SKIP` with that blocker. If the output differs from the expected lines, compare the fixture against the `v3.6.0.0` tag and inspect the script's v4-layout check. If `git status --porcelain` is not empty, inspect what the run wrote and restore the fixture.

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
- Playbook ID: DOC-383
- Feature name: Doctor sk-code on a pre-v4 checkout
- Command mode: `/doctor:sk-code setup`
- YAML asset: `doctor-sk-code-setup.yaml`
- Mutation boundary: none. The fixture is a throwaway clone the scenario creates and deletes, and the battery runs in its check-only form and writes nothing.
- Feature file path: `doctor-commands/doctor-sk-code-pre-v4-checkout.md`
