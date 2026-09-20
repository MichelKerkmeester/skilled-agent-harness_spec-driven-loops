---
title: "Lineage Resource Map — Lower-Cost Exact Fan-Out Isolation"
resource_map_present_at_packet_init: false
lineage: "luna"
---

# Resource Map

This is the lineage-local resource map emitted because `deep-research-config.json` requested `resource_map.emit: true`. The packet-root resource map was absent at initialization (`resource_map_present: false`); this file is intentionally inside the exact lineage write surface.

## Packet measurements and decisions

| Resource | Location | Use | Evidence posture |
|---|---|---|---|
| Worktree timing and footprint | `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:98-110` | Six-lane timing, 1.6 GB/tree checkout, shared object store, isolation tally | Observed |
| Handover cost summary | `specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md:39-44` | Repeats timing and checkout footprint | Observed |
| Worktree decision | `specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:391-425` | Structural isolation rationale and provisioning cost | Observed |
| Runtime plan | `specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:65-76` | Baseline budgets, seed/link design, and worktree flow | Observed |
| Symlink/compiled-guard investigation | `specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:45-85` | Seven shared roots, self-links, 14 guard reproductions, silent no-op | Observed |

## Runtime sources

| Resource | Location | Use | Evidence posture |
|---|---|---|---|
| Shared roots and worktree lifecycle | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-183,384-507,560-751,800-846` | Seven dependency roots, Git redirector policy, self-link rewrites, create/seed/remove behavior | Observed |
| Lane path mapping | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:97-126` | Write, spawn, read, publish, and containment roots | Observed |
| Status and containment | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:282-336,637-773,1058-1074` | Explicit Git root, baseline capture, violation subtraction, preserve semantics | Observed |
| Bootstrap root resolution | `.opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs:23-73` | Realpath-based containment selection and its limits | Observed |
| Fan-out watch and churn | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3591-3651,3827-3905` | Lane sampling, shared-checkout watch, preserve latch, report-only checkout writes | Observed |
| Fan-out limits | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:683-710,785-797` | Concurrency and expanded-lineage caps | Observed |

## Iteration artifacts

| Resource | Location | Use | Evidence posture |
|---|---|---|---|
| Git-native pass | `iterations/iteration-001.md`, `deltas/iter-001.jsonl` | Sparse, partial, shallow, reference findings | Observed in lineage |
| Filesystem pass | `iterations/iteration-002.md`, `deltas/iter-002.jsonl` | Overlay, COW, sandbox, redirection findings | Observed in lineage |
| Decision pass | `iterations/iteration-003.md`, `deltas/iter-003.jsonl` | Complete matrix and recommendation | Observed in lineage |

## Authoritative external references

| Resource | URL | Use | Evidence posture |
|---|---|---|---|
| Git sparse checkout | https://git-scm.com/docs/sparse-checkout | Sparse working-tree behavior and worktree use | Observed documentation; repository savings derived |
| Git configuration | https://git-scm.com/docs/git-config | Worktree-specific configuration | Observed documentation; relocation implication derived |
| Git clone | https://git-scm.com/docs/git-clone | Partial/blobless, shallow, reference/shared, dissociate modes | Observed documentation; repository cost implication derived |
| Git worktree | https://git-scm.com/docs/git-worktree | Linked-worktree administrative state, move, and repair | Observed documentation; external-view implication derived |
| Linux OverlayFS | https://docs.kernel.org/filesystems/overlayfs.html | Lower/upper/work layer sharing and per-mount mutable state | Observed documentation; repository cost delta inferred |

## Evidence labels

- **Observed:** directly recorded packet measurement, local command result, repository source behavior, iteration artifact, or authoritative documentation statement.
- **Derived:** mechanical implication of an observed mechanism applied to the current runtime contract.
- **Inferred:** a cost or behavior hypothesis that requires the acceptance benchmark or implementation experiment named in the synthesis.
