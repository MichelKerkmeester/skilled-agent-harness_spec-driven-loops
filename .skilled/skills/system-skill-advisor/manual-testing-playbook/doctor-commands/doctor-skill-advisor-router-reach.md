---
title: "DOC-364 -- Doctor skill-advisor router reach"
description: "Manual scenario validating that /doctor:skill-advisor router-reach probes each declared phrase against the live advisor, prints the per-hub reach report with the literal RESULT line, and writes nothing."
version: 1.0.0.0
id: doctor-commands-doctor-skill-advisor-router-reach
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-364 -- Doctor skill-advisor router reach

## 1. OVERVIEW

This scenario validates `/doctor:skill-advisor router-reach`, which asks the live advisor whether every multi-word phrase a hub's `ROUTER.md` advertises actually reaches that hub. Routing runs in two stages, so a phrase the advisor has never heard of is a capability the fleet has and cannot be asked for. Only the live advisor settles that, because a diff of the two vocabularies cannot separate a real gap from the many deliberate differences.

The target is read-only. It must not edit a router, add or remove a signal, rebuild the advisor, or amend the allowlist to make a failing phrase pass.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the reach diagnostic probes declared phrases against the live advisor, reports the per-hub counts and every failing phrase with the hub that took it, states the advisor generation, prints the literal RESULT line, and changes no routing artifact.
- Playbook ID: DOC-364.
- Real user request: `A declared router phrase reaches the wrong hub. Check router reach.`
- Prompt: `A declared router phrase reaches the wrong hub. Check router reach.`
- Preconditions: A working tree with the advisor reachable. The declared phrases currently reach their hubs, or every failing row is a known ownership dispute pinned in the reach allowlist.
- Expected execution process: Run the target for one hub with an explicit concurrency, then run it for the whole fleet without flags, and compare the routing artifacts before and after.
- Expected signals: The single-hub run prints the per-hub counts and every failing phrase with the hub that took it instead, states the advisor generation, and prints a literal `RESULT:` line. The whole-fleet run probes at the script default concurrency and asks no scope question. Each row is sorted as wrong-hub, outranked, no-reach, allowed or probe-error. A no-reach row is reported and never fails the run. `RESULT: PASSED` with exit 0 appears when every declared phrase reaches its hub or is an allowed dispute, and `RESULT: FAILED` with exit 1 appears on any wrong-hub, outranked or probe-error row. Exit 2 means the run was refused rather than failed, which today means a sampled inventory under CI. Single-word declarations are skipped by design. Every `ROUTER.md`, every `graph-metadata.json` and the allowlist keep their checksums.
- Desired user-visible outcome: A reach report that names each failing phrase and the hub that took it, with the advisor generation noted so the numbers can be compared after a rebuild.
- Pass/fail: PASS if the report carries the literal RESULT line with its exit status, no-reach rows are not treated as failures, the advisor generation is stated, and no router, signal or allowlist changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
A declared router phrase reaches the wrong hub. Check router reach.
```

### Commands

1. Record `git status --porcelain` and `shasum -a 256 .skilled/skills/sk-doc/sk-create-skill/scripts/router-reach-allowlist.json`.
2. Run `/doctor:skill-advisor router-reach --hub=<skill-id> --concurrency=4`. Use a hub directory under `.skilled/skills/` that carries both `ROUTER.md` and `mode-registry.json`. The run probes concurrently and takes minutes, not seconds.
3. Confirm the report prints the per-hub counts, every failing phrase with the hub that took it instead, the advisor generation, and the literal `RESULT:` line. Record the exit code.
4. Run `/doctor:skill-advisor router-reach` with no flags. Confirm the whole fleet is probed at the script default concurrency and no scope question is asked.
5. Categorize each printed row as wrong-hub, outranked, no-reach, allowed or probe-error and confirm the exit status matches the documented rule for the rows observed. A run that printed no rule output has failed, not passed.
6. Compare `git status --porcelain` and the allowlist checksum with step 1. Confirm no router and no `graph-metadata.json` was edited.

### Expected

Phase 0 probes every declared phrase against the live advisor and captures the standard output and the exit code. Phase 1 prints the per-hub counts and every failing phrase with the hub that took it, states the advisor generation the numbers were taken at, and requires the literal RESULT line. The allowlist is read as context and never amended to turn a failing phrase green.

### Evidence

- The single-hub report and the whole-fleet report.
- The recorded exit codes and the literal `RESULT:` line from each run.
- The advisor generation named in the report.
- `git status --porcelain` and the allowlist checksum from steps 1 and 6.

### Pass / Fail

- **Pass**: The report carries the literal RESULT line with its exit status, no-reach rows do not fail the run, the advisor generation is stated, and no router, signal or allowlist changes.
- **Fail**: The report omits the RESULT line, a no-reach row fails the run, a probe error is rendered as a pass, a single-word declaration is reported as a failure, or the allowlist or a router changes.

### Failure Triage

If no RESULT line prints, inspect `phase_1_report` in `doctor-router-reach.yaml`. If a probe error is treated as a pass, inspect the probe path in `ci-router-vocabulary-reach.cjs` and confirm the advisor answered each request. If a known ownership dispute fails, inspect `router-reach-allowlist.json` and confirm the entry still pins the same winning hub.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-router-reach.yaml](../../../../commands/doctor/assets/doctor-router-reach.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:skill-advisor router-reach

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-364
- Feature name: Doctor skill-advisor router reach
- Command mode: `/doctor:skill-advisor router-reach`
- YAML asset: `doctor-router-reach.yaml`
- Mutation boundary: read-only. The diagnostic probes the advisor and prints the result. It must not edit a router, add or remove a signal, rebuild the advisor, or amend the reach allowlist.
- Feature file path: `doctor-commands/doctor-skill-advisor-router-reach.md`
