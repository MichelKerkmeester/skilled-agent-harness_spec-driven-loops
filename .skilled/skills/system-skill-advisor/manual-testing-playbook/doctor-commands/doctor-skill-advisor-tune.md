---
title: "DOC-362 -- Doctor skill-advisor tune"
description: "Manual scenario validating that /doctor:skill-advisor tune re-tunes the scoring lanes only after a per-skill review, rebuilds the graph, verifies the result and leaves a working per-run rollback script."
version: 1.1.0.0
id: doctor-commands-doctor-skill-advisor-tune
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-362 -- Doctor skill-advisor tune

## 1. OVERVIEW

This scenario validates `/doctor:skill-advisor tune`, which audits the skill fleet, proposes scoring-lane changes per skill, and applies them only after the operator reviews and approves each one. The workflow runs discovery, analysis, proposal, apply and verify with an approval gate between the phases. Confirm mode may write only `explicit.ts`, `lexical.ts` and the skill `graph-metadata.json` files.

The per-skill review is the point of the target. A proposal that reaches a file before the operator approves that skill is a failure of this scenario regardless of how good the tuning result looks.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the tune workflow proposes per-skill changes, waits for per-skill approval, applies only the approved lane changes, verifies them, and leaves a rollback script that restores the modified files.
- Playbook ID: DOC-362.
- Real user request: `The advisor recommends the wrong skill. Re-tune the scoring lanes.`
- Prompt: `The advisor recommends the wrong skill. Re-tune the scoring lanes.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, with a built advisor runtime and an existing `skill-graph.sqlite`. A clean working tree on the scoring-lane paths. At least one skill carries a gap in the chosen lane so the proposal set is not empty.
- Expected execution process: Run `/doctor:skill-advisor tune` in the environment, choose the explicit lane at the scope prompt, filter the proposal to one skill at the analysis gate, approve that skill in the per-skill review, run the verification, then run the generated rollback script and confirm the modified files return to their pre-run content.
- Expected signals: The setup dashboard shows `Target: tune`, `Mutation class: mutates` and `Execution mode: INTERACTIVE`. Phase 0 reports `skill_count`, `graph_health`, `cli_availability` and `repo_context`. The analysis gate prints `ANALYSIS COMPLETE` with the coverage breakdown, and the selected skill filter narrows the proposal to that skill. The proposal gate prints its summary and the diff lands at `<packet_scratch>/skill-advisor-proposal-{timestamp}.md`. The per-skill loop names the skill with its confidence percentage and offers approve, reject, edit and skip. The apply gate prints `APPLY COMPLETE` with the modified file list, `Build status: success` and the rollback script path. The final gate prints `VERIFICATION COMPLETE` with `node_count`, `edge_count`, the test counts and `Status: PASS`. The explicit lane source differs, while `lexical.ts`, `weights-config.ts`, every `SKILL.md` and every `graph-metadata.json` keep their pre-run checksums. Running `bash <rollback_script_path>` restores the modified source to its pre-run checksum.
- Desired user-visible outcome: A per-skill review the operator can act on, a summary that names the files it changed, and a rollback script that works.
- Pass/fail: PASS if no scored file changes before the per-skill approval, no lane outside the requested scope changes, the verification reports PASS, and the rollback script restores the modified file.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
The advisor recommends the wrong skill. Re-tune the scoring lanes.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. In the environment, record `shasum -a 256` for `explicit.ts`, `lexical.ts`, `weights-config.ts`, each `SKILL.md` under the skills root, and each `graph-metadata.json`.
2. If the environment has no dependencies yet, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .worktrees/.doctor-test-environment`.
3. Run `/doctor:skill-advisor tune`. Answer `2` (explicit) at the `Which scoring lanes should be checked?` prompt. Confirm the setup dashboard shows `Target: tune`, `Workflow: .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml`, `Mutation class: mutates` and `Execution mode: INTERACTIVE`.
4. Confirm Phase 0 lists the skills and reports `skill_count`, `graph_health` and `cli_availability` (either `available` or `retryable-unavailable`) plus the repo context summary.
5. At the `ANALYSIS COMPLETE` gate, answer `B <skill-id>` with one real skill id that the coverage breakdown marks as having a gap. Confirm the proposal set is then limited to that skill.
6. At the proposal gate, answer `B` to review per skill. Confirm the diff path prints and the file exists under the packet scratch directory.
7. In the per-skill loop, answer `A` to approve the named skill. Confirm the panel prints the skill name and its confidence percentage.
8. At the `APPLY COMPLETE` gate, answer `A` to run the advisor rebuild and the advisor tests. Confirm the gate names the modified files, `Build status: success` and the rollback script path.
9. Confirm the `VERIFICATION COMPLETE` panel prints the graph scan counts, the test counts and `Status: PASS`.
10. Compare the checksums. The explicit lane source differs. Confirm `lexical.ts`, `weights-config.ts`, every `SKILL.md` and every `graph-metadata.json` keep their pre-run checksums.
11. Run `bash <rollback_script_path>` and confirm the modified source returns to its pre-run checksum. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

Phase 0 reports the fleet and the graph health, allows for a retryable-unavailable CLI, and continues with the filesystem inventory. Phase 1 reads the scoring tables and the graph metadata and displays coverage. Phase 2 proposes per skill and per lane, filters to the requested scope and skill, and validates the proposal schema before the apply gate. Phase 3 validates its targets, captures the baseline, generates the rollback script, applies the approved diff, rebuilds the distribution and reports the modified files. Phase 4 rebuilds the graph, validates it, runs the tests and folds the result into the verification status.

No scored file changes while the operator is still reviewing. A skill below the medium confidence threshold proceeds only through explicit per-skill approval, and the counters add up to the number of skills that reached the loop.

### Evidence

- The setup dashboard and the Phase 0 summary.
- The `ANALYSIS COMPLETE` panel and the proposal gate output, including the diff path.
- The per-skill review panel with the skill name and its confidence.
- The `APPLY COMPLETE` panel with the modified file list and the rollback script path.
- The `VERIFICATION COMPLETE` panel with the graph counts, the test counts and the status.
- Checksums from steps 1, 10 and 11.
- The final `git status --porcelain` output.

### Pass / Fail

- **Pass**: The per-skill review runs before any write, only the approved lane source changes, the verification reports PASS, and the rollback script restores the modified file.
- **Fail**: A scored file changes before the per-skill approval, a lane outside the requested scope changes, `weights-config.ts` or any `SKILL.md` changes, the verification reports FAIL, or the rollback script leaves the modified file changed.

### Failure Triage

If a write happens before the review, inspect `phase_2_proposal` and `phase_3_apply` STEP 1 in `doctor-skill-advisor-tune.yaml`. If the per-skill loop never appears, inspect the `pre_phase_3` `per_skill_loop` block in the same asset. If the rollback script fails to restore a file, inspect STEP 3 `generate_rollback_script` and confirm the resolved file list. If Phase 4 reports a graph validation problem, inspect the validation payload fields `is_valid`, `error_count` and `warning_count`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml](../../../../commands/doctor/assets/doctor-skill-advisor-tune.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md)

Provenance: manual only - /doctor:skill-advisor tune

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-362
- Feature name: Doctor skill-advisor tune
- Command mode: `/doctor:skill-advisor tune`
- YAML asset: `doctor-skill-advisor-tune.yaml`
- Mutation boundary: `explicit.ts`, `lexical.ts` and the skill `graph-metadata.json` files, and only after per-skill approval. `SKILL.md` content, `weights-config.ts` and the fusion or daemon code stay read-only. The environment is restored after the run.
- Feature file path: `doctor-commands/doctor-skill-advisor-tune.md`
