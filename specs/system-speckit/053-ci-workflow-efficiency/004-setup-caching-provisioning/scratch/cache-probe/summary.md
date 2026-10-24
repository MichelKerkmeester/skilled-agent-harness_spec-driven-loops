# Cache probe summary

size_gb=1.28
restore_seconds=24
provision_seconds_cold=35
provision_seconds_warm=1
verdict=go

## Basis

| Measure | Value | Source |
|---------|-------|--------|
| Entry size | 1,278,641,883 bytes (1.28 GB decimal, 1.19 GiB, the action logs `~1219 MB`) | `caches-raw.json`, the cold run's save and the warm run's restore log |
| Entries in the cache for `provision-` | 1, so the total equals the largest entry | `caches-raw.json` |
| Restore step, warm hit | 24 s (14:58:15 to 14:58:39), the download ran at about 226 MB/s | warm job step timestamps |
| Restore step, cold miss | 6 s (lookup only, no download) | cold job step timestamps |
| `provision_worktree`, cold | 35 s, `11 installed, 5 built, 3 already present, 0 failed` | cold run log, `provision_seconds=35` |
| `provision_worktree`, warm | 1 s, `0 installed, 0 built, 14 already present, 0 failed` | warm run log, `provision_seconds=1` |
| Bun install step | 5 s cold, 4 s warm | job step timestamps |
| Save step, cold only | 14 s | cold job step timestamps |

## Verdict against the thresholds

The largest entry is 1.28 GB against the 2 GB ceiling and the total is 1.28 GB against the 5 GB ceiling, and both sit far inside the 10 GB repository budget. The verdict is `go`.

## What the numbers say about the saving

The warm hit skips every install and every build, because the restored stamps make all 14 provisioned paths count as already present. The restore itself costs 24 s, so a warm job spends 24 s restoring, 4 s on bun and 1 s on the walk, about 29 s, against about 40 s for an uncached job (5 s bun, 35 s walk). The measured saving per job is about 10 s, well under the roughly 40 s the plan assumed. The download of 1.2 GB is the new cost and the install it replaces is only 35 s. Later install substitutions face the 10 s bar in the plan's frozen decision and may land at or under it.
