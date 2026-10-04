---
title: "DOC-363 -- Doctor skill-advisor graph freshness"
description: "Manual scenario validating that /doctor:skill-advisor skill-graph-freshness diffs the compiled, sqlite and on-disk skill graphs, names a deliberately introduced missing identity, always exits 0 and writes nothing."
version: 1.1.0.0
id: doctor-commands-doctor-skill-advisor-graph-freshness
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-363 -- Doctor skill-advisor graph freshness

## 1. OVERVIEW

This scenario validates `/doctor:skill-advisor skill-graph-freshness`, the read-only three-way diff of the skill-graph representations: the compiled `scripts/skill-graph.json`, the `skill-graph.sqlite` the daemon reads, and the on-disk `graph-metadata.json` files that are the source of truth. Drift between reindexes is expected, and undetected drift is not. The diagnostic names the stale set and never repairs it, because the canonical reindex stays operator-owned.

The scenario introduces one new identity on disk inside the environment, so the drift report has a deterministic finding to name, and then removes it.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the freshness diagnostic names the drift classes, reports a new on-disk identity as missing from both other sources, always exits 0, and changes no graph representation.
- Playbook ID: DOC-363.
- Real user request: `Compiled, sqlite and disk skill graphs disagree. Check the skill-graph freshness.`
- Prompt: `Compiled, sqlite and disk skill graphs disagree. Check the skill-graph freshness.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, with the compiled graph, the sqlite database and the on-disk metadata all present, plus a writable probe directory under `.skilled/skills/`.
- Expected execution process: Record the checksums of the three representations, run `/doctor:skill-advisor skill-graph-freshness`, add one probe identity on disk and run it again, then remove the probe and run it once more.
- Expected signals: Each run exits 0 and prints `STATUS=OK`. The report prints the source sizes, the scan rule, the stale-compiled and degraded lines, and the unreadable, zombie, ghost, family-mismatch, missing and null-stamp sets. The probe identity appears in the missing set while the probe folder exists, because it is on disk yet absent from sqlite and from the compiled json, and it disappears after the folder is removed. Family comparison lines print as `skill <id> (family disk=<f> ...)`. All three representations keep their pre-run checksums after every run. A `/doctor` run sets neither `SKILL_GRAPH_FRESHNESS_ROOT` nor `SYSTEM_SKILL_ADVISOR_DB_DIR`.
- Desired user-visible outcome: A drift report a human can read, with every finding marked report-only and the canonical reindex named as operator-gated.
- Pass/fail: PASS if every run exits 0 with `STATUS=OK`, the probe identity is reported where the invariant says, and no representation changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Compiled, sqlite and disk skill graphs disagree. Check the skill-graph freshness.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. In the environment, record `shasum -a 256` for `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` and `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`, and record the skill metadata files under `.skilled/skills/` with their checksums.
2. If the environment has no dependencies yet, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .worktrees/.doctor-test-environment`.
3. Run `/doctor:skill-advisor skill-graph-freshness` and capture the report, its exit code and the `STATUS=OK` line.
4. Confirm the report shows the source sizes, the depth-1 scan rule, the stale-compiled and degraded lines, and the unreadable, zombie, ghost, family-mismatch, missing and null-stamp sets.
5. Copy one existing `graph-metadata.json` into a new depth-1 probe folder under `.skilled/skills/` and change its `skill_id` to a new value.
6. Run the target again. Confirm the new id appears in the missing set for both comparisons, and that the run still exits 0 with `STATUS=OK`.
7. Remove the probe folder and run the target once more. Confirm the probe id is gone from the report.
8. Compare the checksums and the metadata list with step 1. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

The diagnostic reads the sqlite database through the standard library in read-only mode, scans only the direct children of `.skilled/skills`, and prints one report that separates the drift classes. A missing identity on disk is listed as absent from sqlite and absent from the compiled json. Nothing is repaired, re-indexed or self-healed, so the report describes the same drift before and after the probe is removed.

### Evidence

- The three run reports and their exit codes.
- The checksums and the metadata list from steps 1 and 8.
- The probe folder path and the probe id as printed in the missing set, including its absence after step 7.
- The `STATUS=OK` line from each run.
- The final `git status --porcelain` output.

### Pass / Fail

- **Pass**: Every run exits 0 with `STATUS=OK`, the probe identity is reported as missing from both other sources, and all three representations keep their checksums.
- **Fail**: A run exits non-zero, the report omits a drift class it found, the probe identity is reported as a zombie or a ghost, or any representation changes.

### Failure Triage

If a run exits non-zero, inspect the standard-library sqlite read and the missing-source handling in the phase 0 activity of `doctor-skill-graph-freshness.yaml`. If the probe identity is not reported, confirm the scan stays depth-1 under `.skilled/skills` and that the probe file carries a string `skill_id`. If a representation changed, inspect the read-only mutation boundary in the same asset.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml](../../../../commands/doctor/assets/doctor-skill-graph-freshness.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md)

Provenance: manual only - /doctor:skill-advisor skill-graph-freshness

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-363
- Feature name: Doctor skill-advisor graph freshness
- Command mode: `/doctor:skill-advisor skill-graph-freshness`
- YAML asset: `doctor-skill-graph-freshness.yaml`
- Mutation boundary: the compiled graph, the sqlite database and every on-disk `graph-metadata.json` stay read-only. The diagnostic never re-indexes and never self-heals.
- Feature file path: `doctor-commands/doctor-skill-advisor-graph-freshness.md`
