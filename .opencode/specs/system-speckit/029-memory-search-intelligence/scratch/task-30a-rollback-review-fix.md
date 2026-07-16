---
title: "Task 30A Rollback Review Fix"
description: "Rollback-simulation safety evidence for the applied packet-028 topology migration."
trigger_phrases:
  - "task 30a rollback review"
  - "rollback simulation evidence"
  - "retained topology backup"
importance_tier: "normal"
contextType: "implementation"
---
# Task 30A Rollback Review Fix

This ledger records simulation-only rollback verification. It does not authorize or claim a live rollback.

---

## Scope and mutation boundary

- Restored `scratch/topology_migration.py` from commit object `0432c51b83` by applying only its path-scoped delta.
- Allowed generated writes were `scratch/topology-migration-manifest.json`, `scratch/topology-migration-backup/backup-index.json` and `scratch/topology-migration-backup/transaction-state.json`.
- Simulation packet copies were created only below `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode` and removed by `TemporaryDirectory` cleanup.
- No topology-only or full-restore operation ran against the live packet. No backup artifact was removed.
- No unrelated file, staged state, commit or remote ref was changed.

---

## Commands and exact outcomes

| Command | Outcome |
|---|---|
| `git diff --exit-code 0432c51b83 -- .opencode/specs/system-speckit/029-memory-search-intelligence/scratch/topology_migration.py` | Exit `0`, no output; restored script is byte-identical to the commit object. |
| `PYTHONPYCACHEPREFIX=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/pycache-028 python3 -m py_compile .opencode/specs/system-speckit/029-memory-search-intelligence/scratch/topology_migration.py` | Exit `0`, no output. Bytecode stayed outside the repository. |
| `python3 .opencode/specs/system-speckit/029-memory-search-intelligence/scratch/topology_migration.py rollback` | Exit `1`: `ROLLBACK_FAIL: ambiguous live rollback is disabled; run rollback-simulate and obtain separate approval for either topology-only or full-restore execution`. The failure occurs before manifest or topology mutation. |
| `python3 .opencode/specs/system-speckit/029-memory-search-intelligence/scratch/topology_migration.py rollback-simulate` | Exit `0`: `ROLLBACK_SIMULATION_PASS topology_files=2653 backup_files=1139 phases=173 support=7 numbered=180`. |
| `python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh .opencode/specs/system-speckit/029-memory-search-intelligence/scratch/topology_migration.py` | Exit `0`, no output; zero comment-hygiene findings. An initial `bash` invocation failed because the `.sh` file has a Python shebang; rerunning it with `python3` resolved the invocation error. |
| `git diff --check -- <five allowed rollback artifacts>` | Exit `0`, no output. The path list contained the script, manifest, backup index, transaction state and Task 30A report. |
| `git diff --cached --name-status` | No output before or after the work; the index remained untouched. |

---

## Simulation evidence

- Contract tests: support alias preservation `pass`; post-migration hash preservation `pass`; duplicate destinations rejected `pass`; interruption source recovery `pass`.
- Topology-only rollback: 173 phase paths, 2,653 files, zero path mismatches, zero hash mismatches and zero forward-reapply mismatches.
- Topology-only rollback preserved 19 legitimate post-migration non-identity hash changes rather than rejecting or replacing them.
- Full restore: 173 governed phases, 7 numbered support directories and 180 numbered directories.
- Full restore: 2,653 files, zero path mismatches, zero identity hash mismatches, zero non-identity hash rejections and zero forward-reapply mismatches.
- Required identity backup coverage: 1,139 files; aggregate SHA-256 `a2ea281e6cb9f8bd4cf245f4bba5a3101c0462add6328617b9545a8c28783a6a`.
- Backup index verification time: `2026-07-12T12:34:46.665556Z`.
- Manifest rollback verification time: `2026-07-12T12:34:46.665914Z`.

---

## Live-tree invariance

The before and after digest covered every packet file except the five explicitly allowed write paths. It included current unrelated packet changes and all retained identity backup files.

| Measurement | Before simulation | After simulation |
|---|---:|---:|
| Protected files | 3,790 | 3,790 |
| Protected aggregate SHA-256 | `a960b4706dfb93a23495c66718d80aa5ea6bfab1d7f7f548a6717dea9c100b5c` | `a960b4706dfb93a23495c66718d80aa5ea6bfab1d7f7f548a6717dea9c100b5c` |
| Governed phases | 173 | 173 |
| Numbered support directories | 7 | 7 |
| Total numbered directories | 180 | 180 |
| Root phase parents | `001` through `006` | `001` through `006` |

The six root names remained `001-release-cleanup`, `002-speckit-memory`, `003-spec-data-quality`, `004-review-remediation`, `005-dark-flag-graduation` and `006-speckit-surface-alignment`.

---

## Retained transaction state

The retained backup's historical `staging` marker was stale after successful apply and retention. It now records `retained_backup_verified`, points to the generated backup index and carries the manifest's exact `simulation_only_until_separately_approved` execution policy. The original `started_at` and complete inverse map remain intact.

---

## Remaining execution policy

Ambiguous live `rollback` remains disabled. `rollback-simulate` is the only currently approved rollback command. Any live topology-only or full-restore execution requires a separate approval that explicitly selects one contract; until then, the retained backup and its index must not be removed.

---

## Latest Independent Rerun (2026-07-12)

- The earlier `topology_files=2653` result above is preserved as evidence of that earlier run.
- Latest command: `python3 scratch/topology_migration.py rollback-simulate` from the packet root context.
- Latest result: `ROLLBACK_SIMULATION_PASS topology_files=2654 backup_files=1139 phases=173 support=7 numbered=180`.
- The rerun was simulation-only. It did not mutate live topology, generated metadata, staged state, commits, remote refs or retained backups.
