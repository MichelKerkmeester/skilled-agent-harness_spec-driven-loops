---
title: "Resource Map — swe2 detached lineage"
trigger_phrases: []
---
# Resource Map — swe2 detached lineage

This map was emitted at synthesis. No parent `resource-map.md` was present at phase initialization, so this lineage treated the source inventory below as newly discovered evidence rather than as a pre-existing exclusion set.

## Runtime implementation (primary grounding)

| Resource | Role | Iterations |
|---|---|---:|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts` | Create/link/seed/remove; split-link self-link rewrite; shared-path list; lease ordering | 1, 2, 3 |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts` | Per-kind directory levers (directory-flag / spawn-directory / read-root); write vs publish tree separation | 1, 3 |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lease.ts` | Ownership lease, liveness proof, reclaim states | 1, 2 |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-publish.ts` | Run-keyed stage+rename publication, manifest-last, attic | 1, 3 |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts` | Startup sweep, prefix lease, resumable-label exclusions | 1, 2 |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Detection contract: git-status tree diff, baseline subtraction, preserve/restore, carve-outs | 2, 3 |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | sandboxMode→OS-confinement map; churnThreshold default 3; concurrency ≤8; 256-lineage cap | 3 |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Provisioning call chain, churn sampler, checkout watch, containment call, settle order | 1, 2, 3 |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Iteration artifact contract used to self-verify each iteration | 1, 2, 3 |

## Packet documents (measurements and prior decisions)

| Resource | Role | Iterations |
|---|---|---:|
| `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md` | 2026-09-08 incident; REQ-004 churn spec (12/window or 40 cumulative); §7 rationale | 1, 3 |
| `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md` | Measured 1.6 GB/tree, 149.7 s vs 16.5 s at six lanes | 1, 2, 3 |
| `specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md` | Scored alternatives (shared worktree 3/10, watch-and-remedy 4/10); flip rationale | 3 |
| `specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md` | CHK-112/113 measurement evidence | 1 |
| `specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md` | Self-link re-anchoring defect, entry-point guard no-op, relative-link relocation requirement | 2 |
| `specs/system-deep-loop/045-fanout-write-containment-hardening/research/open-questions/synthesis.md` | Liveness proof, publish ordering, verification gap | 1, 3 |

## Direct measurements (this lane's checkout)

| Resource | Role | Iterations |
|---|---|---:|
| `du -sh` on the lane tree | 1.6 GB total; `specs/` = 1.3 GB; packet = 872 KB; `.opencode` = 253 MB | 1, 2 |
| `git ls-files` count | 82,393 tracked files; 64,280 under `specs/` | 1 |
| `diskutil info /` | APFS — native clonefile/`cp -c` | 2 |
| `.git` entry size | 4 KB worktree pointer — object store already shared | 1, 2 |

## Mechanism references (external semantics)

| Resource | Role | Iterations |
|---|---|---:|
| APFS clonefile / `cp -Rc` semantics | CoW extent sharing; write-time split; same-volume move preserves sharing | 2, 3 |
| git sparse-checkout / `--no-checkout` | Cone materialization; skip-worktree bits; per-worktree index | 1, 3 |
| overlayfs / `cp --reflink` (btrfs/xfs) | Union mount vs file-level CoW; live-lower attribution failure | 2, 3 |
| macOS seatbelt (`sandbox-exec`) / Landlock | OS write denial for the single-checkout option | 3 |
| EndpointSecurity / fanotify / eBPF | Observe-by-PID attribution; entitlement/privilege gating | 3 |
