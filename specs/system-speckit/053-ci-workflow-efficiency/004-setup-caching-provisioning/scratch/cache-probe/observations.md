# Cache probe raw observations

Probe branch: `branches/031-probe-provision-cache`, created with `worktree-naming.sh create-branch probe-provision-cache origin/main`. Base `78b171b005`. Probe worktree under the session scratchpad, removed afterwards.

| Run | Commit | Workflow run id | Result |
|-----|--------|-----------------|--------|
| Cold | `474eaf6357` ci(cache-probe): measure the cold provision | 40104579813 | success, job started 14:54:31Z, ended 14:56:26Z (115 s) |
| Warm | `0c19bb2514` ci(cache-probe): measure the warm cache hit | 40104779129 | success, job started 14:57:22Z, ended 14:58:46Z (84 s) |

The Message Contract workflow ran on both commits and passed (runs 40104579823 and 40104779093).

## Cold run log excerpts

```text
Cache not found for input keys: provision-Linux-node22-bac1642e158c1acd8ac63a330366510e8b558c0923d4ce9e0336dc2ae1ec1f45
cache-hit=
provisioned: 11 installed, 5 built, 3 already present, 0 failed
provision_seconds=35
Cache saved with key: provision-Linux-node22-bac1642e158c1acd8ac63a330366510e8b558c0923d4ce9e0336dc2ae1ec1f45
```

`cache-hit=` printed an empty value on the miss with v4.3.0 rather than `false`, and the save condition `!= 'true'` handled it.

## Warm run log excerpts

```text
Cache Size: ~1219 MB (1278641883 B)
Cache restored successfully
Cache restored from key: provision-Linux-node22-bac1642e158c1acd8ac63a330366510e8b558c0923d4ce9e0336dc2ae1ec1f45
cache-hit=true
provisioned: 0 installed, 0 built, 14 already present, 0 failed
provision_seconds=1
```

The save step was skipped on the warm run (2 s window, no save log line).

## Step timings (UTC, seconds)

| Step | Cold | Warm |
|------|------|------|
| checkout | 48 | 51 |
| Setup Node | 6 | 1 |
| cache restore | 6 | 24 |
| Install bun | 5 | 4 |
| Provision | 35 | 2 |
| Save the cache | 14 | skipped |

## Per-tree sizes after the cold provision (du -sk, KiB)

```text
510720   .skilled/node_modules
63852    .opencode/node_modules
100456   .skilled/skills/sk-vision/vision-runtime/node_modules
871056   .skilled/skills/system-spec-kit/node_modules
795184   .skilled/skills/system-skill-advisor/runtime/node_modules
12       .skilled/skills/system-deep-loop/node_modules
71988    .skilled/skills/system-deep-loop/runtime/node_modules
12       .skilled/skills/sk-doc/node_modules
199592   .pi/extensions/pi-cache-optimizer/node_modules
238716   .pi/extensions/pi-fast-mode-w-subagent-support/node_modules
94064    .skilled/skills/sk-design/sk-design-md-generator/backend/node_modules
```

## Probe handling notes

- The local pre-commit hook blocked the first probe commit in the fresh probe worktree with `BLOCKED [gate:mirror-parity]` and a `Cannot find module 'js-yaml'` warning, because the new worktree held no dependency trees. No bypass switch was used. The worktree was provisioned with `provision_worktree` (26 s, `10 installed, 5 built, 4 already present, 0 failed`) and the unchanged hook then passed.
- The pre-push hook refused to create the remote probe branch (`Branches stay local unless a person approves publishing them`). The push used the hook's own one-off form `SPECKIT_ALLOW_REMOTE_PUSH=branches/031-probe-provision-cache`, which names the branch, under the recorded operator approval for probe branches.
- `gh run list --workflow cache-probe.yml` returns HTTP 404 for a workflow that exists only on a non-default branch. The runs were listed with `--branch` instead.
- The cache entry was created on the probe branch ref, so it is unreachable from `main`. It was deleted after the numbers were recorded, to return 1.28 GB of the 10 GB budget.
