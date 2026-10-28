---
title: "sk-code Setup And Quality Doctor"
description: "/doctor:sk-code runs the read-only nine-leg setup battery by default, and its quality target shows, checks and once creates the repository quality config."
trigger_phrases:
  - "sk-code setup and quality doctor"
  - "/doctor:sk-code"
  - "sk-code setup battery"
  - "doctor sk-code quality"
version: 1.0.3.0
---

# sk-code Setup And Quality Doctor (/doctor:sk-code)

## 1. OVERVIEW

/doctor:sk-code runs the read-only nine-leg setup battery by default, and its quality target shows, checks and once creates the repository quality config.

The command is a thin router over two workflows. `setup` is the default target and only reads. `quality` writes `repository/quality.json` in the `sk-code-quality` packet only after the workflow prints its plan and the operator approves, and never over an existing file.

---

## 2. HOW IT WORKS

### Setup Battery

`/doctor:sk-code` and `/doctor:sk-code setup` both run the battery. It runs nine legs in order, provisioning, parent-skill, root-metadata, guard, sync, drift-guards, derived-freshness, probe and quality, and names the repair command for each failing leg. The quality leg checks that `python3` is on PATH, that the runner and checker are executable, that the quality tables parse, that the quality tests pass and that a quality prompt routes to `sk-code-quality`. `--prompt=<text>` replaces the default prompt the route probe sends.

### Quality Target

`/doctor:sk-code quality` drives the config script in three modes. `status` reports the config source, its errors, the trust state, a probe of each tool a check names, the hygiene layers and a `Hygiene:` line that names the core rules the config switches off. It then shows what the gate would apply: each checklist with the seat that declared it (`default`, `repo-config`, `hub-surface` or `outside-skill`), its override rows or the reasons its section was refused, each same-level conflict and a `Hygiene rules:` line for the rules in force. The doctor asks the runner for this through `--explain` over a sample of one file per first three folders and extension, in batches of 500 files, and starts no check; it also checks each repository `checklists[]` row the sample did not reach. A refused section, an unknown rule id or a missing checklist fails the status with `CONFIG_INVALID` or `CHECKLIST_MISSING`, because every gate run that loads it stops with exit 3. A conflict is listed and does not fail it, because the gate reads `UNVERIFIED` and still runs. The sample is not the whole tree: a path selector deeper than three folders or a content marker can miss every sampled file, so a hub or outside-skill checklist the sample misses goes unlisted. `check` validates the config and reports its errors and trust state with no tool probe. `init` prints the template filled with the suggested checks and writes nothing, and in a repository with no `specs/` folder it also suggests the 15 spec-kit vocabulary rules for `commentHygiene.disableRules` without writing them, and its apply step creates the file once and refuses with `CONFIG_EXISTS` when one exists. `--dry-run` shows the init plan and stops before the write. The doctor never runs a configured command.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/doctor/sk-code.md` | Handler | The command router and its targets |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Script | The nine-leg setup battery |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Script | The `status`, `check` and `init` modes of the quality target |
| `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` | Shared | The setup workflow |
| `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` | Shared | The quality workflow and its approval step |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | Node test | The battery legs, their verdicts and repairs |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | Node test | The quality modes and the one-time init write |

---

## 4. SOURCE METADATA

- Group: Doctor Commands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-commands/sk-code-setup-and-quality-doctor.md`

Related references:
- [repository-quality-config.md](../quality-gate/repository-quality-config.md) for the file the quality target creates.
- [ci-workflow-doctor-and-switches.md](ci-workflow-doctor-and-switches.md) for the CI doctor.
