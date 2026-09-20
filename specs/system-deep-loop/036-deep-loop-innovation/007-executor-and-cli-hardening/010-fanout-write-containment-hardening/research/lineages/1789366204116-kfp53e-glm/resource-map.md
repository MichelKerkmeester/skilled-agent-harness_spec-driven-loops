# Resource Map — lineage glm (fanout-glm-1789366204116-kfp53e)

Emitted from this lineage's converged deltas (the `sourcesQueried` of iterations 1–3). The workflow's `reduce-state.cjs --emit-resource-map` targets the packet root — outside this lineage's write surface — so the lineage reducer emitted this map inline from the same deltas; it lists what this lineage actually read, not the whole packet.

## Research packet (specs/system-deep-loop/045-fanout-write-containment-hardening)

| Resource | Role | Anchors |
|---|---|---|
| implementation-summary.md:98-110 + Verification | the measured baseline (16.5/149.7 s; 1.6 GB; the worktree phase's GREEN evidence; the production-probe precedent) | it1, it2, it3 |
| research/alternatives/synthesis.md | the three-lane prior synthesis this lineage challenges (lines 21-28 cost; 34-47 mechanisms; 51-58 what-breaks; 62-64 the unmeasured + instrument) | it1–it3 |
| research/worktree-symlinks/synthesis.md:95-112,160-166 | the symlink/dependency contract: 4 self-links, the 14-site guard, "absolute, wholesale today", the open fork | it1, it2 |
| research/fanout-attribution.md + research/lineages/1789363775244-64o2qi-{deepseek,luna,swe2}/ | the prior lanes' records, publish manifests, and the attribution-unknown evidence | it1, it3 |
| research/orchestration-summary.json | the prior run's summary: 3 lanes, isolation {isolated:3}, the timestamp-anomaly window (tolerance 120 s) | it3 |
| decision-record.md:234-320 | ADR-003 (detached ephemeral lane, 6→7 provisions, seed/copy-back/sweep; scored alternatives) | it1 |

## Runtime code (.opencode/skills/system-deep-loop/runtime)

| Resource | Role | Anchors |
|---|---|---|
| lib/deep-loop/worktree-lifecycle.ts | provisioning, create/seed/remove, the 7 shared paths, the GIT_* strip, zero timing | 141-183, 545-779, 592-593 |
| lib/deep-loop/write-containment.ts | the detector: porcelain + per-dirty hash + unattributable-exempt + baseline capture | 689-780 |
| scripts/fanout-run.cjs | lane prep, attempt-named worktrees, seed paths, forced teardown, sweep, (unfound) attribution writer | 2800-2854, 2926, 514-519, 2812-2815, 2882, 3132, 3155-3157, 3476-3569 |
| scripts/verify-iteration.cjs | this lane's mechanical gate (and the route-proof contract) | 7-18, 128-142, 196-320 |
| scripts/append-mode-event.cjs + lib/{mode-append-gateway,authority-root,ledger} | the state-record gateway; the legacy-V1 projection; the receipt/ledger | used 4×, exit 0 ×4 |

## This lane's runner state

`.fanout-worktree.lock` (path-free lease) · `.git` (MAIN-anchored pointer) · locks-and-fencing-v1/218e…/{coordinator-state.json, grant-journal.jsonl} (path-free fencing) · .legacy-projection-watermarks/research-state.json (path-free watermark) · invocation-metadata.json · deep-research-{ledger,audit-ledger,effect-ledger}/frames.

## Gaps (read but not deep-cited)

`.opencode/agents/deep-research.md` (38,170 B — head verified: LEAF, read/write/bash-allow) — the definition this lane's route-proof asserts. Not read in this lineage: luna/swe2's iterations in full, the divergence-pivot modules, convergence.cjs, upsert.cjs, the spec-kit runtime internals (the gateway resolved them through the provisioned links; nothing needed reading).
