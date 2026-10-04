---
title: "DOC-365 -- Doctor skill-advisor skill budget"
description: "Manual scenario validating that /doctor:skill-advisor skill-budget audits description character counts read-only, offers the fail-over checkpoint, and prints the documented OK and exceeded-threshold statuses."
version: 1.0.0.0
id: doctor-commands-doctor-skill-advisor-skill-budget
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-365 -- Doctor skill-advisor skill budget

## 1. OVERVIEW

This scenario validates `/doctor:skill-advisor skill-budget`, the read-only audit of the authored skill, command and agent description budget. It reports per-item character counts, the most bloated items, the project total and the headroom under the configured ceiling.

The audit never edits frontmatter, never re-indexes the advisor and never writes to spec packet docs. The only decision it asks for is whether to also run a fail-over check.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the budget audit prints the per-item counts, the top-N items, the project total and the headroom, offers the fail-over checkpoint, and prints the documented status for both the passing and the over-threshold exit codes.
- Playbook ID: DOC-365.
- Real user request: `Is any skill description over its character budget?`
- Prompt: `Is any skill description over its character budget?`
- Preconditions: The repository carries a readable `skill-contract.json` with the 1,536 character hard cap, and no single item currently exceeds that hard cap.
- Expected execution process: Run the audit with a raised project ceiling and close out at the checkpoint, then run it with a ceiling of one and take the fail-over branch so the audit exits 1.
- Expected signals: Phase 0 reports the advisor CLI availability, freshness and trust state when the warm socket answers, or reports `retryable-unavailable` and continues when it does not. The text report lists per-item character counts, the top-N bloated items, the project total and the headroom under the configured ceiling. The checkpoint asks `Run --fail-over=[project_ceiling] check now?` with options A and B. Answering B when the audit exits 0 returns `STATUS=OK`. Answering A re-runs the audit with `--fail-over=[project_ceiling]` and surfaces its exit code. A run whose fail-over threshold is exceeded exits 1 and prints `STATUS=FAIL ERROR="description budget exceeded threshold"`. An audit that cannot run exits 2 and prints `STATUS=FAIL ERROR="description audit could not run"` with its stderr or JSON error. `--json` surfaces the machine-readable report and `--top-n` limits the bloated list. No frontmatter and no packet doc changes.
- Desired user-visible outcome: A budget report the operator can act on, with the total and the remaining headroom, and a final status that matches the audit exit code.
- Pass/fail: PASS if the report carries the counts, the total and the headroom, the checkpoint re-run uses the resolved ceiling, and the exit 0 and exit 1 paths print their documented status lines.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Is any skill description over its character budget?
```

### Commands

1. Run `/doctor:skill-advisor skill-budget --project-ceiling=100000`. Confirm the CLI availability line and the report fields. The documented exit is 0, because no item exceeds the hard cap and no fail-over threshold was requested.
2. At `Run --fail-over=100000 check now?` answer `B`. Confirm `STATUS=OK`.
3. Run `/doctor:skill-advisor skill-budget --json --top-n=5 --project-ceiling=1`. Confirm the JSON report is surfaced and record the exit code. The documented exit is again 0, because the ceiling alone is not a fail-over threshold.
4. At the checkpoint answer `A`. Confirm the re-run passes `--fail-over=1`, exits 1, and prints `STATUS=FAIL ERROR="description budget exceeded threshold"`.
5. Confirm `git status --porcelain` is unchanged and no `SKILL.md`, command or agent frontmatter was edited.

### Expected

Phase 0 applies the warm-only policy, runs the CLI health command only when the warm socket answers, and continues the read-only audit when the CLI is retryable-unavailable. The audit walks the authored surfaces and prints the per-item counts, the top-N items, the project total and the headroom. Phase 1 presents the report and asks the checkpoint question. The exit code decides the final status, and the checkpoint re-run uses the resolved project ceiling as the fail-over threshold.

### Evidence

- The two reports and their exit codes.
- The checkpoint prompt and the answer given for each run.
- The `STATUS=OK` and `STATUS=FAIL` lines.
- `git status --porcelain` from step 5.

### Pass / Fail

- **Pass**: The report carries the counts, the total and the headroom, the checkpoint re-run uses the resolved ceiling, and the exit 0 and exit 1 paths print their documented status lines.
- **Fail**: The audit edits frontmatter or packet docs, the report omits the total or the headroom, the checkpoint re-run ignores the ceiling, or an exit code does not produce its documented status.

### Failure Triage

If the audit exits 2, inspect its stderr or JSON error, because exit 2 means zero items found, bad arguments or a malformed `skill-contract.json`. If the checkpoint never re-runs, inspect `phase_1_checkpoint` in `doctor-skill-budget.yaml`. If the report omits the project total or the headroom, inspect `audit_descriptions.py`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-skill-budget.yaml](../../../../commands/doctor/assets/doctor-skill-budget.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:skill-advisor skill-budget

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-365
- Feature name: Doctor skill-advisor skill budget
- Command mode: `/doctor:skill-advisor skill-budget`
- YAML asset: `doctor-skill-budget.yaml`
- Mutation boundary: read-only. The audit never modifies frontmatter, never re-indexes the advisor and never writes to spec packet docs.
- Feature file path: `doctor-commands/doctor-skill-advisor-skill-budget.md`
