# Iteration 6: Safe Cleanup and Deprecation Sequencing

## Focus
This iteration classified the safe order for deprecating standalone `deep-context` and the dependency constraints that make some cleanup steps unsafe to do early. The selected interpretation was deprecation sequencing only, not implementation. The focus followed the dispatcher override and the remaining key question about which cleanup steps are safe now, which need redirect/archive staging, and which internal runtime cleanup should be deferred behind tests.

## Findings
1. The first safe step is a public redirect/stub for `/deep:context`, not deletion: the live command still renders `deep/context` through `render-command-contract.cjs`, the renderer still treats `deep/context` as a supported command, and the command contract generator still defines `deep/context` with `runtimeLoopType: 'context'`, context YAML assets, the nested skill, and the `deep-context` agent. [SOURCE: .opencode/commands/deep/context.md:2] [SOURCE: .opencode/commands/deep/context.md:4] [SOURCE: .opencode/commands/deep/context.md:9] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:56] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:33] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:39]
2. Replacement documentation must land before removing the context packet because the hub still advertises context as one of the five workflow modes and says the hub routes by `workflowMode` through `mode-registry.json`, while the existing context synthesis is the documented producer of the reuse-first Context Report and machine-readable companion consumed by downstream planning/implementation. [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:4] [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12] [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:22] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:718] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:733] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:734]
3. Registry/advisor cleanup has to be staged as metadata cleanup plus an index refresh, not projection-map cleanup alone: `mode-registry.json` still registers `workflowMode: "context"`, `artifactRoot: "context/"`, context aliases, and metadata routing, while the hub `graph-metadata.json` still carries deep-context trigger phrases and `deep-context/SKILL.md` as a key file. The advisor freshness signature hashes each skill's `SKILL.md` and `graph-metadata.json`, and `skill_graph_scan` / `advisor_rebuild` are the trusted index-refresh paths. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:20] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:26] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:27] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:125] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:159] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:173] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:49] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:89]
4. Agent and mirror deprecation should follow redirect/advisor cleanup, because both OpenCode and Claude mirrors define `deep-context` as a read-only analyzer seat, while the active YAML still names `agent: deep-context` and points to `.opencode/agents/deep-context.md`; deleting agents first would break any still-routable context workflow before users receive the redirect path. [SOURCE: .opencode/agents/deep-context.md:2] [SOURCE: .opencode/agents/deep-context.md:35] [SOURCE: .claude/agents/deep-context.md:2] [SOURCE: .claude/agents/deep-context.md:17] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:99] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:100]
5. Packet archive/delete is later than command and metadata cleanup because command-contract generation still lists `deep-context/SKILL.md`, context protocol/state/convergence references, config/report templates, and the agent as source paths for `deep/context`; removing the packet while `compile-command-contracts.cjs` still expects those files would create broken generated-contract inputs. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:44] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:55] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:58] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:59] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60]
6. Internal runtime cleanup should be last or deferred behind focused tests: shared runtime code still validates `context` as a legal loop type, computes context-specific convergence signals, selects `deep-context` skill/agent in fanout prompts, enforces context artifact-root validation by joining `{specFolder}/{loopType}`, expects `context-report.md` as the lineage artifact, and dispatches context signal computation in coverage-graph signals. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:730] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:483] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:932] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:935] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012]
7. Test cleanup is a hard dependency, not a cosmetic follow-up: runtime-loop YAML parity tests explicitly include `deep_context_auto.yaml` and `deep_context_confirm.yaml`, fanout tests assert review and context keep the 0.1 default threshold and map `context` to `deep-context`, and convergence integration tests create a `loopType: 'context'` namespace. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts:21] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts:22] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:592] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:125] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:126]
8. The recommended staging order is: (1) redirect/stub `/deep:context`; (2) publish replacement docs in the hub and destination loops; (3) remove or retag registry/advisor metadata and refresh the trusted index; (4) deprecate native agent mirrors and analyzer-seat prompts; (5) archive/delete the packet and generated-contract inputs after command-contract sources are updated; (6) remove or quarantine internal runtime `context` support only after tests/fixtures are rewritten or explicitly retained as archive coverage. [INFERENCE: based on Findings 1-7]

## Ruled Out
- Deleting `.opencode/skills/deep-loop-workflows/deep-context/` before command-contract source cleanup was ruled out because `compile-command-contracts.cjs` still lists that packet's skill, references, assets, and agent as source paths. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60]
- Projection-map-only cleanup was ruled out again for sequencing because context is metadata-routed and still discoverable through hub graph metadata. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76]
- Early runtime loop-type removal was ruled out because `convergence.cjs`, `fanout-run.cjs`, coverage-graph signals, and tests still encode `context` as a live runtime-loop branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568]

## Dead Ends
- No new evidence source was exhausted. Candidate reducer promotion: treat “delete packet before redirect + registry/advisor cleanup + contract-generator cleanup” as blocked.
- Candidate reducer promotion: internal runtime cleanup should be deferred behind a test rewrite/removal decision rather than grouped with public deprecation edits.

## Edge Cases
- Ambiguous input: The focus could mean an implementation plan or a research-only sequencing classification; this iteration used the narrower research-only interpretation because the dispatcher explicitly said “Research only; no implementation edits.”
- Contradictory evidence: `fanout-merge.cjs` accepts `loopType === 'context'`, but its non-review registry/state-log fallback still names deep-research files, which conflicts with stronger context-specific support in `fanout-run.cjs` and `convergence.cjs`; classify this as a defer-and-test runtime cleanup issue, not as safe immediate removal. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:910] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:931] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:933] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:730]
- Missing dependencies: none; the required state and targeted local sources were readable.
- Partial success: none; the iteration answered the sequencing focus with source-backed constraints.

## Sources Consulted
- .opencode/commands/deep/context.md:2
- .opencode/commands/deep/context.md:4
- .opencode/commands/deep/context.md:9
- .opencode/commands/deep/assets/deep_context_auto.yaml:99
- .opencode/commands/deep/assets/deep_context_auto.yaml:100
- .opencode/commands/deep/assets/deep_context_auto.yaml:718
- .opencode/commands/deep/assets/deep_context_auto.yaml:733
- .opencode/commands/deep/assets/deep_context_auto.yaml:734
- .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:33
- .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:39
- .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:44
- .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54
- .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17
- .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:56
- .opencode/skills/deep-loop-workflows/mode-registry.json:20
- .opencode/skills/deep-loop-workflows/mode-registry.json:26
- .opencode/skills/deep-loop-workflows/mode-registry.json:29
- .opencode/skills/deep-loop-workflows/SKILL.md:12
- .opencode/skills/deep-loop-workflows/SKILL.md:22
- .opencode/skills/deep-loop-workflows/graph-metadata.json:76
- .opencode/skills/deep-loop-workflows/graph-metadata.json:125
- .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:49
- .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:89
- .opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:159
- .opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts:173
- .opencode/agents/deep-context.md:2
- .opencode/agents/deep-context.md:35
- .claude/agents/deep-context.md:2
- .claude/agents/deep-context.md:17
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:483
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:932
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:935
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:730
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:910
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:931
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:933
- .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012
- .opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts:20
- .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568
- .opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:125

## Assessment
- New information ratio: 0.91
- Questions addressed:
  - Which cleanup steps are safe now, which should be staged as redirect/archive, and which internal runtime cleanup should be deferred behind tests?
  - Which references are active runtime behavior versus generated metadata, tests/fixtures, mirrors, historical archives, or false positives?
- Questions answered:
  - Safe order is redirect/stub, replacement docs, registry/advisor cleanup with index refresh, agent/mirror deprecation, packet archive/delete, then internal runtime cleanup/defer.
  - Internal runtime `context` support and tests are active behavior/guards and should not be removed in the public-deprecation stage.

## Reflection
- What worked and why: Exact-path reads plus narrow greps worked because the sequencing constraints are encoded in source-of-truth command contracts, registry metadata, hub docs, runtime branches, and tests.
- What did not work and why: Treating cleanup as a single delete list did not work because the public command, advisor metadata, contract generator, agent mirrors, packet assets, and runtime tests have different dependency directions.
- What I would do differently: In the next pass, verify historical/archive and generated compiled surfaces separately so the final synthesis can separate “must update before merge” from “leave archived for traceability.”

## Recommended Next Focus
Classify generated/mirrored/historical cleanup boundaries: compiled command contracts, legacy command bodies, archived specs, README references, manual testing playbooks, and package metadata should be separated into regenerate, deprecate-in-place, archive-only, or leave-as-history buckets.
