# Deep Research: Standalone Deep Context Deprecation Impact

<!-- ANCHOR:research-synthesis -->

## Status

Converged after 10 iterations. Runtime implementation has not started. [SOURCE: research/deep-research-state.jsonl:12]

- Stop reason: max iterations reached after the operator requested convergence. [SOURCE: research/deep-research-state.jsonl:12]
- Iterations completed: 10 of 10. [SOURCE: research/deep-research-state.jsonl:11]
- State validation: reducer reported `iterationsCompleted: 10` and `corruptionCount: 0`. [SOURCE: research/deep-research-state.jsonl:12]
- Resource-map emission: skipped because the run produced no delta files; no resource map is claimed. [SOURCE: research/deep-research-state.jsonl:12]
- Memory context: warm-only Spec Memory retrieval was unavailable at initialization with exit code 75, so findings are grounded in packet-local docs and repository evidence. [SOURCE: research/deep-research-strategy.md:80]

## Executive Synthesis

Standalone `deep-context` is still a live public workflow surface, not just historical documentation. The active route includes `/deep:context`, auto/confirm YAML, generated command-contract mappings, OpenCode and Claude agents, the nested `deep-context` packet, mode registry metadata, hub graph metadata, runtime `context` branches, active docs, active benchmarks/fixtures, and advisor discoverability metadata. [SOURCE: research/iterations/iteration-001.md:7] [SOURCE: research/iterations/iteration-001.md:10] [SOURCE: research/iterations/iteration-002.md:7] [SOURCE: research/iterations/iteration-006.md:12]

Deprecation should be staged. The safe first implementation stage is a public `/deep:context` redirect/stub plus replacement guidance in `deep-research` and `deep-review`. Do not delete the nested packet, agents, or runtime `context` branches until generated command contracts, metadata/index refresh, active docs/mirrors, and tests prove that no live route still depends on them. [SOURCE: research/iterations/iteration-006.md:7] [SOURCE: research/iterations/iteration-006.md:14] [SOURCE: research/iterations/iteration-009.md:7]

The unique value to preserve is the reuse-first Context Report shape: reuse candidates, integration points, conventions, dependencies, gaps, touch list, dependency subgraph, prior-art/decision notes, and evidence-backed methodology/confidence. In `deep-research`, these belong in strategy Known Context, iteration findings, final `research.md`, and citation/resource-map coverage surfaces. In `deep-review`, they belong in strategy Known Context, review iteration evidence, report traceability/planning/deferred-item sections, and review-native confidence/gate surfaces. [SOURCE: research/iterations/iteration-003.md:7] [SOURCE: research/iterations/iteration-003.md:8] [SOURCE: research/iterations/iteration-004.md:7] [SOURCE: research/iterations/iteration-005.md:7]

Do not migrate the standalone context loop's machinery wholesale. Analyzer seats, dedicated `{spec_folder}/context/` state packets, context-specific convergence thresholds, same-scope agreement gates, and `lowConfidence` buckets should either be archived or adapted only as methodology/gap/confidence notes. `deep-research` keeps `newInfoRatio` semantics; `deep-review` keeps severity/gate/claim-adjudication semantics. [SOURCE: research/iterations/iteration-003.md:9] [SOURCE: research/iterations/iteration-004.md:15] [SOURCE: research/iterations/iteration-005.md:19]

## Confirmed Active Surface Classes

| Surface Class | Decision | Evidence |
| --- | --- | --- |
| `/deep:context` command/router | Redirect/stub first | Live command renders `deep/context` through command-contract runtime. [SOURCE: research/iterations/iteration-001.md:7] |
| `deep_context_*` YAML/presentation assets | Deprecate source assets before regeneration | Auto/confirm YAML own standalone loop state and context-report outputs. [SOURCE: research/iterations/iteration-001.md:10] |
| Compiled command contract | Regenerate only | Compiled contract lists source inputs; do not hand-edit. [SOURCE: research/iterations/iteration-007.md:8] |
| Mode registry and hub graph metadata | Remove/retag standalone discoverability after replacement guidance | Context is metadata-routed; graph metadata still has context triggers/key file. [SOURCE: research/iterations/iteration-002.md:7] [SOURCE: research/iterations/iteration-002.md:10] |
| Advisor projection/index | Refresh graph/advisor index; projection-only changes are insufficient | Deep-context is excluded from alias projection and exposed through metadata. [SOURCE: research/iterations/iteration-002.md:8] [SOURCE: research/iterations/iteration-002.md:12] |
| OpenCode/Claude agents | Mirror-sync deprecation/removal | Canonical OpenCode agent plus Claude mirror still exist. [SOURCE: research/iterations/iteration-007.md:9] |
| Nested `deep-context` packet | Archive/retire after redirect and source cleanup | Packet still owns standalone context-report contract. [SOURCE: research/iterations/iteration-003.md:12] [SOURCE: research/iterations/iteration-010.md:11] |
| Runtime `context` branches | Defer removal | Runtime scripts/tests still accept `context`. [SOURCE: research/iterations/iteration-008.md:7] [SOURCE: research/iterations/iteration-010.md:13] |
| Active docs and orchestrator guidance | Edit in place | README/AGENTS/orchestrator docs still advertise deep context. [SOURCE: research/iterations/iteration-007.md:7] [SOURCE: research/iterations/iteration-007.md:9] |
| Active fixtures/benchmarks | Rewrite/drop active fixture; archive dedicated CXB benchmarks | `dlw-context-001` is active; CXB scenarios validate old standalone behavior. [SOURCE: research/iterations/iteration-008.md:10] |
| Historical specs/archives | Leave as history | Historical references are records, not active surfaces. [SOURCE: research/iterations/iteration-007.md:12] |
| Generic `context_loading_contract` / context manifest hits | False positives | These belong to design context manifests, not standalone deep-context. [SOURCE: research/iterations/iteration-008.md:11] |

## Replacement Capability Map

### Deep Research

- Strategy Known Context should carry run-level snapshots: resource-map presence/absence, section counts, theme summaries, prior context summaries, scope assumptions, and already-reviewed inventory. [SOURCE: research/iterations/iteration-004.md:7]
- Iteration files and final `research.md` should carry semantic Context Report fields: reuse candidates, integration points, touch list, conventions, dependency subgraph, prior art, gaps, and methodology/confidence. [SOURCE: research/iterations/iteration-004.md:9]
- JSONL should remain state/convergence metadata plus optional graph events, not a dumped `context-report.json` replacement. [SOURCE: research/iterations/iteration-004.md:11]
- Config and command docs should expose controls and destination promises, not the migrated context payload. [SOURCE: research/iterations/iteration-004.md:13]

### Deep Review

- Strategy Known Context and Review Charter should carry prior context summaries, resource-map status, inventory baseline, scope assumptions, and dimension-ordering rationale. [SOURCE: research/iterations/iteration-005.md:7]
- Review iteration markdown and JSONL should carry context only when it affects concrete findings, clean-surface claims, scope proof, or integration evidence. [SOURCE: research/iterations/iteration-005.md:10]
- `review-report.md` should receive context through release-readiness, planning seeds, traceability, deferred items, search ledger, and audit appendix surfaces. [SOURCE: research/iterations/iteration-005.md:13]
- `review/resource-map.md` should remain a per-file evidence ledger, not a semantic Context Report replacement. [SOURCE: research/iterations/iteration-005.md:16]
- Verdict confidence remains review-native through P0/P1/P2, quality gates, and claim-adjudication packets. [SOURCE: research/iterations/iteration-005.md:19]

## Implementation Order

1. Replace `/deep:context` behavior with a redirect/stub that cannot launch legacy standalone YAML.
2. Publish replacement guidance and context-snapshot destination docs in `deep-research`, `deep-review`, and the deep-loop hub.
3. Update command-contract source mappings and regenerate compiled command contracts; do not hand-edit compiled output.
4. Remove or retag standalone context mode/metadata discoverability in `mode-registry.json` and hub `graph-metadata.json`.
5. Run trusted skill graph/advisor refresh and advisor tests/probes.
6. Update active README/AGENTS/orchestrator docs and sync OpenCode/Claude agent mirrors.
7. Rewrite/drop active deep-loop benchmark fixtures that assert standalone context; archive dedicated CXB/manual-playbook scenarios.
8. Archive or delete the nested `deep-context` packet only after redirect, generated-contract, metadata, and mirror checks pass.
9. Treat internal runtime `context` branch removal as a separate final phase with its own tests and rollback.

## Verification Matrix

| Stage | Minimum Verification |
| --- | --- |
| Redirect/stub | Render `/deep:context` and confirm it shows replacement guidance and no legacy YAML execution. |
| Generated contracts | Run command-contract compiler with write/diff flow and inspect generated contract changes. |
| Replacement docs | Grep/read `deep-research` and `deep-review` surfaces for Known Context, resource-map, report, and context-snapshot destination guidance. |
| Registry/metadata | Grep `mode-registry.json` and hub `graph-metadata.json` for stale standalone context discoverability. |
| Advisor/index | Run trusted skill graph/advisor refresh, then advisor status/recommendation probes and system-skill-advisor tests. |
| Runtime compatibility | Run deep-loop-runtime typecheck/tests before and after any runtime `context` branch removal. |
| Fixtures/benchmarks | Rewrite/drop active `dlw-context-001`; run the relevant skill-benchmark lane only after fixture changes. |
| Docs/mirrors | Grep active README/AGENTS/orchestrator/agent files for unsupported standalone `/deep:context` claims. |
| Spec packet | Run strict SpecKit validation for this packet after research/document updates. |

## Rollback And Deferral Boundaries

- If redirect rendering or contract generation fails, restore `/deep:context` router/contract mappings while keeping this research packet intact.
- If replacement docs are incomplete, keep standalone docs discoverable but clearly deprecated; do not delete the old packet.
- If advisor status stays stale after trusted refresh, restore registry/graph metadata changes and debug the index separately.
- If fixture/benchmark changes regress, roll those back independently; do not roll back public redirect unless user-facing routing breaks.
- If runtime tests fail after removing `context` branches, restore runtime `context` support and keep public deprecation in place.

## Residual Gaps

- Exact post-edit match counts are implementation-time evidence; run targeted greps after changes.
- Live advisor ranking/status still needs verification after graph metadata/index refresh.
- Runtime `context` branch removal remains a separate compatibility decision.
- Generated compiled contracts must be regenerated and diffed after source edits.
- Resource-map emission skipped in this research run because there were no delta files; do not claim a generated resource-map artifact from this run.

## References

- `research/iterations/iteration-001.md` - active entrypoint inventory.
- `research/iterations/iteration-002.md` - advisor and metadata discoverability.
- `research/iterations/iteration-003.md` - unique capability taxonomy.
- `research/iterations/iteration-004.md` - deep-research destination map.
- `research/iterations/iteration-005.md` - deep-review destination map.
- `research/iterations/iteration-006.md` - sequencing and dependency constraints.
- `research/iterations/iteration-007.md` - generated/mirror/history boundaries.
- `research/iterations/iteration-008.md` - tests, fixtures, benchmarks, runtime gates.
- `research/iterations/iteration-009.md` - verification matrix and rollback/defer decisions.
- `research/iterations/iteration-010.md` - final cross-check and implementation checklist.
<!-- /ANCHOR:research-synthesis -->
