# Snapshot window

Top-level window from `scratch/runs-after.json`: 2026-10-24T14:27:40Z to 2026-10-25T20:19:19Z (29.86 h, 1000 runs).
Per-workflow spans come from each `scratch/jobs/<workflow>/index.json`, the newest 40 runs, floored at 1 h.

| Workflow | Runs | Oldest createdAt | Newest createdAt | Hours |
|---|---|---|---|---|
| `advisory-checks.yml` | 40 | 2026-10-24T22:10:54Z | 2026-10-25T20:17:22Z | 22.11 |
| `changed-packet-validation.yml` | 40 | 2026-10-24T22:10:54Z | 2026-10-25T20:17:22Z | 22.11 |
| `command-tree-parity.yml` | 40 | 2026-10-23T16:37:23Z | 2026-10-25T19:48:16Z | 51.18 (path-filtered on push, so its newest 40 runs span more than 48 h; not a re-snapshot) |
| `dispatch-enforcement-guard.yml` | 40 | 2026-10-24T22:10:54Z | 2026-10-25T20:17:22Z | 22.11 |
| `gate-inputs.yml` | 40 | 2026-10-24T22:10:54Z | 2026-10-25T20:17:22Z | 22.11 |
| `message-contract.yml` | 40 | 2026-10-25T01:11:13Z | 2026-10-25T20:17:22Z | 19.1 |
| `playbook-operator-contract.yml` | 40 | 2026-10-24T22:31:16Z | 2026-10-25T20:17:22Z | 21.77 |
| `rule-canary-sync.yml` | 40 | 2026-10-24T22:10:53Z | 2026-10-25T20:17:22Z | 22.11 |
| `sk-doc-script-tests.yml` | 40 | 2026-10-24T22:10:54Z | 2026-10-25T20:17:22Z | 22.11 |

## Timing against the last workflow change

- The last commit to touch any of the nine files is `9480d99e6d` (2026-10-25T01:11:09Z, `ci(workflows): gate every job behind a repository switch`), read with `git log -1 --format='%h %cI' -- .github/workflows/<file>.yml` for each of the nine. It adds a job-level `if:` and changes no step.
- The snapshot was taken at 2026-10-25T20:19Z, about 19 h after that commit, not the 24 h the task asks for. The newest 40 runs of eight of the nine start at 2026-10-24T22:10Z or later, after `ea39cd7b2c` (2026-10-24T19:40:26Z), the last commit that changed a step in one of them (the `rule-canary-sync.yml` checkout). `command-tree-parity.yml`'s 40 runs reach back to 2026-10-23T16:37Z.
- The gap is recorded, not closed: under the D8 answer `no` the numbers inform the record and gate no file change.
