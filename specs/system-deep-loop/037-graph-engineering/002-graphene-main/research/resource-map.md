# Resource Map — graphene-main-sol-high

## Lineage Artifacts

| Resource | Role | Status |
|---|---|---|
| `deep-research-config.json` | Fixed run parameters, lineage identity, executor, and completion status | Complete; fixed effective parameters preserved. [SOURCE: deep-research-config.json:1-49] |
| `deep-research-state.jsonl` | Append-only config, spec check, 20 iteration records, and terminal synthesis events | Complete; stop authority is `maxIterationsReached`. [SOURCE: deep-research-state.jsonl:1-22] |
| `deep-research-strategy.md` | P1-P7 question ledger, worked/failed/exhausted directions, and final frontier | Complete and exhausted. [SOURCE: deep-research-strategy.md:11-105] |
| `iterations/iteration-001.md` … `iterations/iteration-020.md` | Full research narratives | 20/20 read and synthesized. [SOURCE: iterations/iteration-020.md:119-139] |
| `deltas/iter-001.jsonl` … `deltas/iter-020.jsonl` | Append-only per-iteration deltas/findings | 20/20 read and retained. [SOURCE: deltas/iter-020.jsonl:1] |
| `research.md` | Final additive synthesis and implementation decision record | Complete. [SOURCE: research.md:1] |
| `findings-registry.json` | Machine-readable P1-P7 decisions, findings, ruled-out directions, and metrics | Complete. [SOURCE: findings-registry.json:1] |
| `deep-research-dashboard.md` | Human-readable terminal dashboard | Complete. [SOURCE: deep-research-dashboard.md:1] |

## Baseline and Orientation

| Resource | Use in synthesis |
|---|---|
| `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md` | Graphene implementation map, discrepancies, candidate deltas, and P1-P7 research angles. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:1-99] |
| `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md` | Repo-1 typed graph, authority, parity, replay, human gate, organization/work, and hybrid retrieval baseline. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:13-95] |

## Current System-Deep-Loop and 036 Authority Sources

| Resource | Evidence used |
|---|---|
| `.opencode/skills/system-deep-loop/SKILL.md` | Registry-driven hub, mode/backend discriminator, shared runtime, and no per-mode hub logic. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:36-105] |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Existing public modes, runtime loop types, backend kinds, packets, commands, agents, and artifact roots. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-200] |
| `runtime/lib/authorized-ledger/authorized-ledger-types.ts` | Independent ledger heads, authorization references, frames, authority states, request and decision identities. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:147-159] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:212-275] |
| `runtime/lib/authorized-ledger/deterministic-reducer.ts` | Exact reducer registration and repeated deterministic rebuild. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/deterministic-reducer.ts:43-135] |
| `runtime/lib/authorized-ledger/transition-authorization-gateway.ts` | Durable allow/deny, stale-head/epoch denial, and immutable decision record. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-775] |
| `runtime/lib/coverage-graph/coverage-graph-signals.ts` | Existing claim verification and contradiction-density telemetry seam. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:581-630] |
| `runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts` | Canonical multi-resource order and commit-time current-fence verification. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:432-488] |
| `runtime/lib/locks-and-fencing/fenced-state-store.ts` | Atomic expected-version and fence-protected replacement. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts:96-177] |
| `runtime/lib/shadow-parity/shadow-parity-types.ts` | Required observation classes, isolation context, divergence taxonomy, and earliest mismatch record. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:20-56] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:112-200] |
| `runtime/lib/receipts-and-effect-recovery/effect-gateway.ts` | Durable effect intent, independently observed confirmation, reconciliation, and operator resolution. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:451-506] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:617-688] |
| `036/.../transition-versioning-and-rollback-policy.md` | Per-mode authority states, legal CAS edges, rollback windows, retention, and fail-closed closure. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:174-237] |
| `036/.../003-replay-fingerprints/spec.md` | Closed range, replay-contract identity, component digests, immutable attestation, and fail-closed verification. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:52-116] |
| `036/.../003-shadow-parity-harness/spec.md` | Sealed equal inputs, isolated paths, declared observations, exact legacy bytes, blocking divergences, and no authority movement. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:55-148] |
| `036/.../006-locks-and-fencing/spec.md` | Canonical resources, monotonic fences, atomic mutation checks, unsupported-domain failure, and stale-writer tests. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:75-124] |

## Graphene Sources

| Resource | Evidence used |
|---|---|
| `context/graphene-main/crates/graphene-core/src/belief.rs` | Four-valued truth, usable premise, provenance/fidelity/validity/staleness/support fields. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:136-205] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:368-445] |
| `context/graphene-main/crates/graphene-core/src/fold.rs` | Supersession/nogood fold, bounded settlement, premise invalidation, and staleness cascade. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:561-628] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:693-777] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:888-935] |
| `context/graphene-main/crates/graphene-core/src/time.rs` | Observation-time ordering with sequence tie-break and validity closure. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/time.rs:84-129] |
| `context/graphene-main/crates/graphene-core/src/refusal.rs` | Structured refusal codes, details, and suggested alternatives. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:1-169] |
| `context/graphene-main/crates/graphene-exec/src/lib.rs` | Transaction-scoped claim checks, node completion, human gate resolution, and timeout sweep. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:245-335] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:450-515] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:599-705] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:828-890] |
| `context/graphene-main/crates/graphene-store/src/lib.rs` | Transactional append/mutate, point-in-time replay, disposable rebuild, and destructive fold-equivalent compaction. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:157-229] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:342-395] |
| `context/graphene-main/crates/graphene-core/tests/golden.rs` and fixtures | Fold/rebuild/point-in-time corpus and filename coverage; incomplete semantic adversarial coverage motivates P3. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs:49-127] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:61-69] |

## Twelve Blog Sources

All twelve sources were used as supporting corpus and are cited individually in `research.md`; none was treated as authority over code or 036 contracts. [SOURCE: research.md:1]

1. `Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md`
2. `From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md`
3. `Graph Engineering Roadmap.md`
4. `Graph Engineering explained: what it is, when to use it and when not to.md`
5. `Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md`
6. `Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md`
7. `Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`
8. `Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md`
9. `How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md`
10. `How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md`
11. `LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md`
12. `What is Graph Engineering.md`

## Scope Boundary

This resource map records research inputs and proposed implementation seams only. No source outside this lineage was modified, no authority state was changed, no memory/index operation was invoked, and no deployment, staging, commit, or push occurred. [INFERENCE: final scoped status and diff verification are required before handoff]
