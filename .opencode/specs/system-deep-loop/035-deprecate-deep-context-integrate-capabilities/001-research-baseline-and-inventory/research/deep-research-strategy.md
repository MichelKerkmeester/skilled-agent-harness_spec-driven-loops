---
title: Deep Research Strategy - Deep Context Deprecation Impact
description: Research strategy for inventorying standalone deep-context surfaces and replacement-capability migration into deep-research and deep-review.
---

# Deep Research Strategy - Deep Context Deprecation Impact

## 1. OVERVIEW

### Purpose

Run a 10-iteration investigation into every live, generated, mirrored, test, advisor, and documentation surface implicated by standalone `deep-context` deprecation before implementation changes start.

### Usage

The workflow manager reads this file before each iteration. The leaf iteration agent writes only iteration files, JSONL records, and progressive synthesis. Reducer-owned sections may be refreshed from append-only state after each iteration.

---

## 2. TOPIC

standalone deep-context deprecation impact and connected surfaces

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which live command, YAML, agent, nested skill, registry, advisor, runtime, test, and docs surfaces still expose or depend on standalone `deep-context`?
- [ ] Which references are active runtime behavior versus generated metadata, tests/fixtures, mirrors, historical archives, or false positives?
- [ ] What unique `deep-context` capabilities must be migrated into `deep-research` and what artifact/schema changes would carry them safely?
- [ ] What unique `deep-context` capabilities must be migrated into `deep-review` and what verdict/report changes would carry them safely?
- [ ] Which cleanup steps are safe now, which should be staged as redirect/archive, and which internal runtime cleanup should be deferred behind tests?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement deprecation changes during this research run.
- Do not rewrite historical archived specs only to remove old mentions.
- Do not deprecate the separate one-shot `@context` retrieval agent.
- Do not delete `deep-context` internals before replacement behavior and routing checks are mapped.

---

## 5. STOP CONDITIONS

- Complete 10 iterations because the operator requested 10 iterations first.
- Stop early only for a hard workflow/state error, unreachable packet state, or a safety issue.
- Produce a synthesis that classifies implicated surfaces and recommends an implementation order.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Exact-path reads and narrow grep over command/runtime assets worked because the dispatcher supplied the primary surface list, enabling line-cited classification without noisy broad search. (iteration 1)
- Reading the mode registry, alias projection code, Python compatibility projection, graph metadata, and drift guard together worked because these sources define the entire advisor discoverability path and its validation boundaries. (iteration 2)
- Targeted grep over the supplied exact surfaces worked because capability names are explicit in `SKILL.md`, report templates, state references, command YAML output sections, and analyzer-agent contracts. (iteration 3)
- Exact-path reads plus targeted greps worked because the destination surfaces are explicitly declared in the agent contract, YAML state paths, prompt pack, command contract, and resource-map feature file. (iteration 4)
- Exact-path reads worked because review destination surfaces are explicitly declared in command YAML, the LEAF agent contract, state-output docs, report synthesis steps, and severity/verdict feature docs. (iteration 5)
- Exact-path reads plus narrow greps worked because the sequencing constraints are encoded in source-of-truth command contracts, registry metadata, hub docs, runtime branches, and tests. (iteration 6)
- Targeted Grep over the dispatcher-named surfaces worked because the cleanup distinction is encoded in paths and document ownership markers: compiled assets, mirrors, live READMEs, packet internals, fixtures, and archives all reveal different maintenance contracts. (iteration 7)
- targeted grep by surface class worked because test, fixture, benchmark, command-contract, runtime, and advisor-gate files carry explicit markers such as `mode: "context"`, `deep_context`, `context-report`, and `advisorLane: "deep-context"`. (iteration 8)
- reading progressive synthesis plus the exact command/package sources worked because prior iterations had already classified surfaces, allowing this pass to convert findings into stage gates without violating the blocked whole-repo sweep rule. (iteration 9)
- Targeted searches over the dispatcher-named surface classes worked because prior iterations had already reduced the problem to source-owned commands, hub metadata, runtime branches, packet internals, docs/mirrors, and fixtures. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- This pass did not classify every file under the nested skill subtree because that would dilute the active-entrypoint inventory and exceed a single-iteration evidence budget. (iteration 1)
- A live advisor prompt probe was not used; it would show current ranking behavior but would not replace the static routing contract, and the iteration budget favored source-of-truth metadata. (iteration 2)
- The `resource-map` angle did not resolve to a confirmed `deep-context` artifact in targeted sources; the only confirmed packet evidence says `resource-map.md` was absent for this research run. (iteration 3)
- Treating resource-map as a semantic context report did not work because the confirmed feature contract defines it as a citation-derived coverage ledger rather than a reuse/integration/convention schema. (iteration 4)
- Broad deep-review subtree enumeration produced too much noise; focused reads after scoped grep yielded better evidence for destination mapping. (iteration 5)
- Treating cleanup as a single delete list did not work because the public command, advisor metadata, contract generator, agent mirrors, packet assets, and runtime tests have different dependency directions. (iteration 6)
- Treating grep output as an exhaustive edit list did not work because command/skill/spec trees contain more matches than a single iteration can inspect without repeating the blocked whole-repo sweep pattern. (iteration 7)
- broad fixture searches still returned generic `context_loading_contract` noise; the root cause is that `context` is overloaded across design-manifest and deep-loop semantics. (iteration 8)
- exact end-to-end CI lane names for skill-benchmark and advisor live probes still need implementation-time confirmation because package scripts expose core tests, while some benchmark runs are standalone script invocations rather than top-level package scripts. (iteration 9)
- A complete grep-driven edit list was not attempted because the strategy blocks broad sweeps and generated/docs/history surfaces require different ownership decisions. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A whole-repo `deep-context` reference sweep was not attempted in this iteration because the dispatcher provided exact priority files and the iteration budget was reserved for cited entrypoint classification. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A whole-repo `deep-context` reference sweep was not attempted in this iteration because the dispatcher provided exact priority files and the iteration budget was reserved for cited entrypoint classification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A whole-repo `deep-context` reference sweep was not attempted in this iteration because the dispatcher provided exact priority files and the iteration budget was reserved for cited entrypoint classification.

### A whole-repo `deep-context` reference sweep was not retried; the strategy marks broad sweeps as blocked, and this pass used prior findings plus targeted source anchors for a verification matrix. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:95] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:319] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A whole-repo `deep-context` reference sweep was not retried; the strategy marks broad sweeps as blocked, and this pass used prior findings plus targeted source anchors for a verification matrix. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:95] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:319]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A whole-repo `deep-context` reference sweep was not retried; the strategy marks broad sweeps as blocked, and this pass used prior findings plus targeted source anchors for a verification matrix. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:95] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:319]

### A whole-repo `deep-context` reference sweep was not retried; this iteration used the dispatcher-specified targeted searches over tests, fixtures, benchmarks/playbooks, command-contract sources, advisor tests, package scripts, and runtime branches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:93] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A whole-repo `deep-context` reference sweep was not retried; this iteration used the dispatcher-specified targeted searches over tests, fixtures, benchmarks/playbooks, command-contract sources, advisor tests, package scripts, and runtime branches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:93]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A whole-repo `deep-context` reference sweep was not retried; this iteration used the dispatcher-specified targeted searches over tests, fixtures, benchmarks/playbooks, command-contract sources, advisor tests, package scripts, and runtime branches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:93]

### A whole-repo `deep-context` sweep was not retried because strategy marks broad whole-repo sweeps as blocked; this pass used the dispatcher-provided surface classes and targeted searches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:90] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A whole-repo `deep-context` sweep was not retried because strategy marks broad whole-repo sweeps as blocked; this pass used the dispatcher-provided surface classes and targeted searches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:90]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A whole-repo `deep-context` sweep was not retried because strategy marks broad whole-repo sweeps as blocked; this pass used the dispatcher-provided surface classes and targeted searches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:90]

### Candidate reducer promotion: do not remove runtime `context` validators in the public redirect stage; keep them until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1379] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Candidate reducer promotion: do not remove runtime `context` validators in the public redirect stage; keep them until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1379] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate reducer promotion: do not remove runtime `context` validators in the public redirect stage; keep them until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1379] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012]

### Candidate reducer promotion: do not run dedicated CXB behavior benchmarks as replacement-loop validation after redirect; archive/retire them or mark them old-standalone evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Candidate reducer promotion: do not run dedicated CXB behavior benchmarks as replacement-loop validation after redirect; archive/retire them or mark them old-standalone evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate reducer promotion: do not run dedicated CXB behavior benchmarks as replacement-loop validation after redirect; archive/retire them or mark them old-standalone evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4]

### Candidate reducer promotion: internal runtime cleanup should be deferred behind a test rewrite/removal decision rather than grouped with public deprecation edits. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Candidate reducer promotion: internal runtime cleanup should be deferred behind a test rewrite/removal decision rather than grouped with public deprecation edits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Candidate reducer promotion: internal runtime cleanup should be deferred behind a test rewrite/removal decision rather than grouped with public deprecation edits.

### Carrying `deep-context` convergence thresholds directly into sibling loops is a dead end because the context loop uses reuse-first saturation and agreement/relevance guards, while this research run's protocol separately warns that deep-loop thresholds are mode-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/feature_catalog/04--convergence-detection/context-coverage-signals.md:22] [INFERENCE: based on the deep-research agent convergence-threshold contract] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Carrying `deep-context` convergence thresholds directly into sibling loops is a dead end because the context loop uses reuse-first saturation and agreement/relevance guards, while this research run's protocol separately warns that deep-loop thresholds are mode-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/feature_catalog/04--convergence-detection/context-coverage-signals.md:22] [INFERENCE: based on the deep-research agent convergence-threshold contract]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Carrying `deep-context` convergence thresholds directly into sibling loops is a dead end because the context loop uses reuse-first saturation and agreement/relevance guards, while this research run's protocol separately warns that deep-loop thresholds are mode-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/feature_catalog/04--convergence-detection/context-coverage-signals.md:22] [INFERENCE: based on the deep-research agent convergence-threshold contract]

### Deleting `.opencode/skills/deep-loop-workflows/deep-context/` before command-contract source cleanup was ruled out because `compile-command-contracts.cjs` still lists that packet's skill, references, assets, and agent as source paths. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Deleting `.opencode/skills/deep-loop-workflows/deep-context/` before command-contract source cleanup was ruled out because `compile-command-contracts.cjs` still lists that packet's skill, references, assets, and agent as source paths. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting `.opencode/skills/deep-loop-workflows/deep-context/` before command-contract source cleanup was ruled out because `compile-command-contracts.cjs` still lists that packet's skill, references, assets, and agent as source paths. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60]

### Did not exhaustively read every manual testing scenario; targeted summary and exact capability lines were sufficient for this taxonomy, while detailed test-migration classification remains separate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/changelog/v1.0.0.0.md:43] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/05--context-report-synthesis/context-report-assembly.md:15] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Did not exhaustively read every manual testing scenario; targeted summary and exact capability lines were sufficient for this taxonomy, while detailed test-migration classification remains separate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/changelog/v1.0.0.0.md:43] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/05--context-report-synthesis/context-report-assembly.md:15]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not exhaustively read every manual testing scenario; targeted summary and exact capability lines were sufficient for this taxonomy, while detailed test-migration classification remains separate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/changelog/v1.0.0.0.md:43] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/05--context-report-synthesis/context-report-assembly.md:15]

### Did not perform a whole-repo `deep-context` reference sweep because strategy marks broad whole-repo searching as blocked for this run stage; this pass used targeted advisor/projection/metadata paths instead. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:80] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:82] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Did not perform a whole-repo `deep-context` reference sweep because strategy marks broad whole-repo searching as blocked for this run stage; this pass used targeted advisor/projection/metadata paths instead. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:80] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:82]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not perform a whole-repo `deep-context` reference sweep because strategy marks broad whole-repo searching as blocked for this run stage; this pass used targeted advisor/projection/metadata paths instead. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:80] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:82]

### Did not run a whole-repo `deep-context` reference sweep because the strategy marks that broad approach blocked for this run stage; this pass used the dispatcher-provided exact capability surfaces. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:83] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:84] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Did not run a whole-repo `deep-context` reference sweep because the strategy marks that broad approach blocked for this run stage; this pass used the dispatcher-provided exact capability surfaces. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:83] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:84]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not run a whole-repo `deep-context` reference sweep because the strategy marks that broad approach blocked for this run stage; this pass used the dispatcher-provided exact capability surfaces. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:83] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:84]

### Did not run live `advisor_recommend` prompt probes; static projection, graph metadata, and drift-guard sources directly answer the discoverability-path question, while live ranking confidence can be sampled in a later verification pass. [INFERENCE: based on .opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/projection.md:26 and .opencode/skills/deep-loop-workflows/graph-metadata.json:76] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Did not run live `advisor_recommend` prompt probes; static projection, graph metadata, and drift-guard sources directly answer the discoverability-path question, while live ranking confidence can be sampled in a later verification pass. [INFERENCE: based on .opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/projection.md:26 and .opencode/skills/deep-loop-workflows/graph-metadata.json:76]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not run live `advisor_recommend` prompt probes; static projection, graph metadata, and drift-guard sources directly answer the discoverability-path question, while live ranking confidence can be sampled in a later verification pass. [INFERENCE: based on .opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/projection.md:26 and .opencode/skills/deep-loop-workflows/graph-metadata.json:76]

### Did not treat compiled generated command contracts as primary evidence because this iteration focused on advisor projection and graph metadata rather than command-contract output. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:87] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Did not treat compiled generated command contracts as primary evidence because this iteration focused on advisor projection and graph metadata rather than command-contract output. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:87]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not treat compiled generated command contracts as primary evidence because this iteration focused on advisor projection and graph metadata rather than command-contract output. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:87]

### Did not use compiled generated command contracts as primary evidence because source YAML sections already define the active output paths and events for this capability classification. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:99] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:686] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Did not use compiled generated command contracts as primary evidence because source YAML sections already define the active output paths and events for this capability classification. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:99] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:686]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not use compiled generated command contracts as primary evidence because source YAML sections already define the active output paths and events for this capability classification. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:99] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:686]

### Do not migrate standalone context analyzer seats, dedicated context packet directories, or literal `lowConfidence`/agreement-gate reducer buckets as first-class `deep-research` artifacts; keep their useful outputs as methodology/confidence/gap annotations. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:35] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/references/state/state_reducer_registry.md:134] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Do not migrate standalone context analyzer seats, dedicated context packet directories, or literal `lowConfidence`/agreement-gate reducer buckets as first-class `deep-research` artifacts; keep their useful outputs as methodology/confidence/gap annotations. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:35] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/references/state/state_reducer_registry.md:134]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not migrate standalone context analyzer seats, dedicated context packet directories, or literal `lowConfidence`/agreement-gate reducer buckets as first-class `deep-research` artifacts; keep their useful outputs as methodology/confidence/gap annotations. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:35] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/references/state/state_reducer_registry.md:134]

### Do not promote `resource-map.md` into a semantic Context Report replacement; the confirmed live design is a citation-derived coverage ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:21] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Do not promote `resource-map.md` into a semantic Context Report replacement; the confirmed live design is a citation-derived coverage ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:21]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not promote `resource-map.md` into a semantic Context Report replacement; the confirmed live design is a citation-derived coverage ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:21]

### Drift-guard-only validation is insufficient for metadata-routed context deprecation, because the projection freshness hash excludes metadata modes. [INFERENCE: based on .opencode/skills/deep-loop-workflows/mode-registry.json:29 and .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:160] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Drift-guard-only validation is insufficient for metadata-routed context deprecation, because the projection freshness hash excludes metadata modes. [INFERENCE: based on .opencode/skills/deep-loop-workflows/mode-registry.json:29 and .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:160]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Drift-guard-only validation is insufficient for metadata-routed context deprecation, because the projection freshness hash excludes metadata modes. [INFERENCE: based on .opencode/skills/deep-loop-workflows/mode-registry.json:29 and .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:160]

### Early runtime loop-type removal was ruled out because `convergence.cjs`, `fanout-run.cjs`, coverage-graph signals, and tests still encode `context` as a live runtime-loop branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Early runtime loop-type removal was ruled out because `convergence.cjs`, `fanout-run.cjs`, coverage-graph signals, and tests still encode `context` as a live runtime-loop branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Early runtime loop-type removal was ruled out because `convergence.cjs`, `fanout-run.cjs`, coverage-graph signals, and tests still encode `context` as a live runtime-loop branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568]

### Executing implementation edits or generated-contract writes in this iteration was ruled out because the dispatch explicitly said research only. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:40] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Executing implementation edits or generated-contract writes in this iteration was ruled out because the dispatch explicitly said research only. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:40]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing implementation edits or generated-contract writes in this iteration was ruled out because the dispatch explicitly said research only. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:40]

### Generated compiled contracts under `.opencode/commands/deep/assets/compiled/` were not read because the active source mapping is already established by `render-command-contract.cjs` and `compile-command-contracts.cjs` in this focused pass. [INFERENCE: based on .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17 and .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:46] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Generated compiled contracts under `.opencode/commands/deep/assets/compiled/` were not read because the active source mapping is already established by `render-command-contract.cjs` and `compile-command-contracts.cjs` in this focused pass. [INFERENCE: based on .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17 and .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:46]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generated compiled contracts under `.opencode/commands/deep/assets/compiled/` were not read because the active source mapping is already established by `render-command-contract.cjs` and `compile-command-contracts.cjs` in this focused pass. [INFERENCE: based on .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17 and .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:46]

### Hand-editing compiled command contracts was ruled out because the compiled contract lists source assets and packet inputs; source changes should regenerate compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Hand-editing compiled command contracts was ruled out because the compiled contract lists source assets and packet inputs; source changes should regenerate compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing compiled command contracts was ruled out because the compiled contract lists source assets and packet inputs; source changes should regenerate compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]

### Hand-editing compiled generated command contracts: compiled output lists source inputs and must be regenerated after source changes. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Hand-editing compiled generated command contracts: compiled output lists source inputs and must be regenerated after source changes. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing compiled generated command contracts: compiled output lists source inputs and must be regenerated after source changes. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24]

### Hand-editing compiled generated contracts was ruled out again; the relevant evidence points to source compile/render mappings and regeneration. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:37] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:20] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Hand-editing compiled generated contracts was ruled out again; the relevant evidence points to source compile/render mappings and regeneration. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:37] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:20]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing compiled generated contracts was ruled out again; the relevant evidence points to source compile/render mappings and regeneration. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:37] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:20]

### Hand-editing compiled generated contracts was ruled out; the compiler exposes `--write` and generated output paths, so implementation should edit sources and regenerate. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:791] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:803] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Hand-editing compiled generated contracts was ruled out; the compiler exposes `--write` and generated output paths, so implementation should edit sources and regenerate. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:791] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:803]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing compiled generated contracts was ruled out; the compiler exposes `--write` and generated output paths, so implementation should edit sources and regenerate. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:791] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:803]

### Migrating `deep-context` agreement/relevance thresholds into `deep-review` verdict or convergence was ruled out because review verdicts are severity/gate based and claim confidence is finding-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/verdicts.md:25] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/claim-adjudication.md:25] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Migrating `deep-context` agreement/relevance thresholds into `deep-review` verdict or convergence was ruled out because review verdicts are severity/gate based and claim confidence is finding-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/verdicts.md:25] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/claim-adjudication.md:25]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Migrating `deep-context` agreement/relevance thresholds into `deep-review` verdict or convergence was ruled out because review verdicts are severity/gate based and claim confidence is finding-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/verdicts.md:25] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/claim-adjudication.md:25]

### Migrating `deep-context` relevance/agreement thresholds directly into `deep-research` convergence was ruled out because the strategy marks threshold transfer as blocked and the `deep-research` agent defines a different newInfoRatio convergence semantic. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:91] [SOURCE: .opencode/agents/deep-research.md:49] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Migrating `deep-context` relevance/agreement thresholds directly into `deep-research` convergence was ruled out because the strategy marks threshold transfer as blocked and the `deep-research` agent defines a different newInfoRatio convergence semantic. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:91] [SOURCE: .opencode/agents/deep-research.md:49]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Migrating `deep-context` relevance/agreement thresholds directly into `deep-research` convergence was ruled out because the strategy marks threshold transfer as blocked and the `deep-research` agent defines a different newInfoRatio convergence semantic. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:91] [SOURCE: .opencode/agents/deep-research.md:49]

### No dead-end evidence source was exhausted. Candidate for later reducer consideration: treat “manual whole-repo search before source-mapped entrypoints are classified” as low-yield for this focus. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No dead-end evidence source was exhausted. Candidate for later reducer consideration: treat “manual whole-repo search before source-mapped entrypoints are classified” as low-yield for this focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No dead-end evidence source was exhausted. Candidate for later reducer consideration: treat “manual whole-repo search before source-mapped entrypoints are classified” as low-yield for this focus.

### No new dead-end evidence source was exhausted. Candidate reducer promotion: do not migrate `context-report.json` or raw REUSE Catalog tables as mandatory `deep-review` artifacts; map only the subset that supports review scope, findings, gates, report seeds, or traceability. [INFERENCE: based on Findings 2-7] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new dead-end evidence source was exhausted. Candidate reducer promotion: do not migrate `context-report.json` or raw REUSE Catalog tables as mandatory `deep-review` artifacts; map only the subset that supports review scope, findings, gates, report seeds, or traceability. [INFERENCE: based on Findings 2-7]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end evidence source was exhausted. Candidate reducer promotion: do not migrate `context-report.json` or raw REUSE Catalog tables as mandatory `deep-review` artifacts; map only the subset that supports review scope, findings, gates, report seeds, or traceability. [INFERENCE: based on Findings 2-7]

### No new evidence source was exhausted. Candidate reducer promotion: treat “delete packet before redirect + registry/advisor cleanup + contract-generator cleanup” as blocked. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No new evidence source was exhausted. Candidate reducer promotion: treat “delete packet before redirect + registry/advisor cleanup + contract-generator cleanup” as blocked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new evidence source was exhausted. Candidate reducer promotion: treat “delete packet before redirect + registry/advisor cleanup + contract-generator cleanup” as blocked.

### Projection-map-only cleanup is a dead end for deprecating standalone `deep-context`: the mode is metadata-routed and excluded from alias projections, so generated alias projection edits alone would leave graph metadata discoverability intact. [INFERENCE: based on .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:106, .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2545, and .opencode/skills/deep-loop-workflows/graph-metadata.json:76] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Projection-map-only cleanup is a dead end for deprecating standalone `deep-context`: the mode is metadata-routed and excluded from alias projections, so generated alias projection edits alone would leave graph metadata discoverability intact. [INFERENCE: based on .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:106, .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2545, and .opencode/skills/deep-loop-workflows/graph-metadata.json:76]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Projection-map-only cleanup is a dead end for deprecating standalone `deep-context`: the mode is metadata-routed and excluded from alias projections, so generated alias projection edits alone would leave graph metadata discoverability intact. [INFERENCE: based on .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:106, .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2545, and .opencode/skills/deep-loop-workflows/graph-metadata.json:76]

### Projection-map-only cleanup was ruled out again for sequencing because context is metadata-routed and still discoverable through hub graph metadata. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Projection-map-only cleanup was ruled out again for sequencing because context is metadata-routed and still discoverable through hub graph metadata. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Projection-map-only cleanup was ruled out again for sequencing because context is metadata-routed and still discoverable through hub graph metadata. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76]

### Public-patch removal of internal runtime `context` support: runtime scripts/tests still accept it. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Public-patch removal of internal runtime `context` support: runtime scripts/tests still accept it. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Public-patch removal of internal runtime `context` support: runtime scripts/tests still accept it. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25]

### Removing internal runtime `context` support in the public redirect patch remains a dead end until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:22] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Removing internal runtime `context` support in the public redirect patch remains a dead end until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:22]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing internal runtime `context` support in the public redirect patch remains a dead end until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:22]

### Removing only command or advisor projection surfaces is not enough to preserve behavior; the unique capabilities live in report schema, registry buckets, confidence/coverage signals, state artifacts, and downstream consumer contracts. [INFERENCE: based on Findings 1-6] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Removing only command or advisor projection surfaces is not enough to preserve behavior; the unique capabilities live in report schema, registry buckets, confidence/coverage signals, state artifacts, and downstream consumer contracts. [INFERENCE: based on Findings 1-6]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing only command or advisor projection surfaces is not enough to preserve behavior; the unique capabilities live in report schema, registry buckets, confidence/coverage signals, state artifacts, and downstream consumer contracts. [INFERENCE: based on Findings 1-6]

### Sweeping historical spec packets was ruled out because they are records of prior decisions and implementation history rather than live command/docs surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Sweeping historical spec packets was ruled out because they are records of prior decisions and implementation history rather than live command/docs surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sweeping historical spec packets was ruled out because they are records of prior decisions and implementation history rather than live command/docs surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47]

### Treating `review/resource-map.md` as a semantic Context Report was ruled out because the confirmed review contract emits it from review deltas as a per-file evidence ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/synthesis-save-and-guardrails/resource-map-emission.md:15] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1382] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating `review/resource-map.md` as a semantic Context Report was ruled out because the confirmed review contract emits it from review deltas as a per-file evidence ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/synthesis-save-and-guardrails/resource-map-emission.md:15] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1382]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `review/resource-map.md` as a semantic Context Report was ruled out because the confirmed review contract emits it from review deltas as a per-file evidence ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/synthesis-save-and-guardrails/resource-map-emission.md:15] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1382]

### Treating advisor projection drift as the only metadata cleanup gate remains a dead end because context is a metadata-routed mode and hub graph metadata still carries `deep context`, `context loop`, and `deep-context` triggers. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating advisor projection drift as the only metadata cleanup gate remains a dead end because context is a metadata-routed mode and hub graph metadata still carries `deep context`, `context loop`, and `deep-context` triggers. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating advisor projection drift as the only metadata cleanup gate remains a dead end because context is a metadata-routed mode and hub graph metadata still carries `deep context`, `context loop`, and `deep-context` triggers. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76]

### Treating dedicated CXB behavior benchmarks as replacement-loop acceptance remains a dead end; archive them as old standalone evidence after redirect. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating dedicated CXB behavior benchmarks as replacement-loop acceptance remains a dead end; archive them as old standalone evidence after redirect. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating dedicated CXB behavior benchmarks as replacement-loop acceptance remains a dead end; archive them as old standalone evidence after redirect. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32]

### Treating dedicated CXB behavior benchmarks as replacement-loop validation remains a dead end; use them as old-standalone archive evidence after redirect rather than as current acceptance gates. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:21] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating dedicated CXB behavior benchmarks as replacement-loop validation remains a dead end; use them as old-standalone archive evidence after redirect rather than as current acceptance gates. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:21]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating dedicated CXB behavior benchmarks as replacement-loop validation remains a dead end; use them as old-standalone archive evidence after redirect rather than as current acceptance gates. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:21]

### Treating every `context_loading_contract` fixture as a standalone `/deep:context` hit was ruled out; the matching sk-design fixtures encode a design context manifest, not the deep-loop context mode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating every `context_loading_contract` fixture as a standalone `/deep:context` hit was ruled out; the matching sk-design fixtures encode a design context manifest, not the deep-loop context mode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every `context_loading_contract` fixture as a standalone `/deep:context` hit was ruled out; the matching sk-design fixtures encode a design context manifest, not the deep-loop context mode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52]

### Treating every `context` substring as a standalone deep-context cleanup target remains a dead end; generic context manifest fixtures are false positives. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:68] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating every `context` substring as a standalone deep-context cleanup target remains a dead end; generic context manifest fixtures are false positives. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:68]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every `context` substring as a standalone deep-context cleanup target remains a dead end; generic context manifest fixtures are false positives. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:68]

### Treating every `context` substring as standalone `deep-context` cleanup is a dead end; active sk-design fixture references to `context_loading_contract.md` and `contextManifestDigest` are unrelated false positives. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating every `context` substring as standalone `deep-context` cleanup is a dead end; active sk-design fixture references to `context_loading_contract.md` and `contextManifestDigest` are unrelated false positives. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every `context` substring as standalone `deep-context` cleanup is a dead end; active sk-design fixture references to `context_loading_contract.md` and `contextManifestDigest` are unrelated false positives. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52]

### Treating runtime mirrors as independent cleanup targets is a dead end; the skill declares OpenCode canonical plus Claude mirror and requires sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating runtime mirrors as independent cleanup targets is a dead end; the skill declares OpenCode canonical plus Claude mirror and requires sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating runtime mirrors as independent cleanup targets is a dead end; the skill declares OpenCode canonical plus Claude mirror and requires sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284]

### Treating the compiled generated command contract as the primary source was avoided because the strategy already blocks using compiled contracts as primary evidence for active output paths; it was used only as corroborating command-surface evidence for setup/default fields. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:116] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:168] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the compiled generated command contract as the primary source was avoided because the strategy already blocks using compiled contracts as primary evidence for active output paths; it was used only as corroborating command-surface evidence for setup/default fields. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:116] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:168]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the compiled generated command contract as the primary source was avoided because the strategy already blocks using compiled contracts as primary evidence for active output paths; it was used only as corroborating command-surface evidence for setup/default fields. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:116] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:168]

### Using compiled generated contracts as primary evidence was avoided because strategy already marks compiled contracts as blocked for active output-path classification; this iteration used the generated router only to confirm `/deep:review` command dispatch shape. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:118] [SOURCE: .opencode/commands/deep/review.md:9] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Using compiled generated contracts as primary evidence was avoided because strategy already marks compiled contracts as blocked for active output-path classification; this iteration used the generated router only to confirm `/deep:review` command dispatch shape. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:118] [SOURCE: .opencode/commands/deep/review.md:9]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using compiled generated contracts as primary evidence was avoided because strategy already marks compiled contracts as blocked for active output-path classification; this iteration used the generated router only to confirm `/deep:review` command dispatch shape. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:118] [SOURCE: .opencode/commands/deep/review.md:9]

### Whole-repo `deep-context` reference sweep: strategy marks this blocked, so this pass used targeted command, hub, runtime, packet, fixture, and mirror checks. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:97] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Whole-repo `deep-context` reference sweep: strategy marks this blocked, so this pass used targeted command, hub, runtime, packet, fixture, and mirror checks. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:97]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Whole-repo `deep-context` reference sweep: strategy marks this blocked, so this pass used targeted command, hub, runtime, packet, fixture, and mirror checks. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:97]

### Writing migrated semantic fields into config was ruled out because the command contract uses config for run controls and resource-map toggles, while YAML state paths identify separate output artifacts for research and resource maps. [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:118] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:119] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Writing migrated semantic fields into config was ruled out because the command contract uses config for run controls and resource-map toggles, while YAML state paths identify separate output artifacts for research and resource maps. [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:118] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:119]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Writing migrated semantic fields into config was ruled out because the command contract uses config for run controls and resource-map toggles, while YAML state paths identify separate output artifacts for research and resource maps. [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:118] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:119]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A whole-repo `deep-context` reference sweep was not attempted in this iteration because the dispatcher provided exact priority files and the iteration budget was reserved for cited entrypoint classification. (iteration 1)
- Generated compiled contracts under `.opencode/commands/deep/assets/compiled/` were not read because the active source mapping is already established by `render-command-contract.cjs` and `compile-command-contracts.cjs` in this focused pass. [INFERENCE: based on .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17 and .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:46] (iteration 1)
- No dead-end evidence source was exhausted. Candidate for later reducer consideration: treat “manual whole-repo search before source-mapped entrypoints are classified” as low-yield for this focus. (iteration 1)
- Did not perform a whole-repo `deep-context` reference sweep because strategy marks broad whole-repo searching as blocked for this run stage; this pass used targeted advisor/projection/metadata paths instead. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:80] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:82] (iteration 2)
- Did not run live `advisor_recommend` prompt probes; static projection, graph metadata, and drift-guard sources directly answer the discoverability-path question, while live ranking confidence can be sampled in a later verification pass. [INFERENCE: based on .opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/projection.md:26 and .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 2)
- Did not treat compiled generated command contracts as primary evidence because this iteration focused on advisor projection and graph metadata rather than command-contract output. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:87] (iteration 2)
- Drift-guard-only validation is insufficient for metadata-routed context deprecation, because the projection freshness hash excludes metadata modes. [INFERENCE: based on .opencode/skills/deep-loop-workflows/mode-registry.json:29 and .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:160] (iteration 2)
- Projection-map-only cleanup is a dead end for deprecating standalone `deep-context`: the mode is metadata-routed and excluded from alias projections, so generated alias projection edits alone would leave graph metadata discoverability intact. [INFERENCE: based on .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:106, .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2545, and .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 2)
- Carrying `deep-context` convergence thresholds directly into sibling loops is a dead end because the context loop uses reuse-first saturation and agreement/relevance guards, while this research run's protocol separately warns that deep-loop thresholds are mode-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/feature_catalog/04--convergence-detection/context-coverage-signals.md:22] [INFERENCE: based on the deep-research agent convergence-threshold contract] (iteration 3)
- Did not exhaustively read every manual testing scenario; targeted summary and exact capability lines were sufficient for this taxonomy, while detailed test-migration classification remains separate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/changelog/v1.0.0.0.md:43] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/05--context-report-synthesis/context-report-assembly.md:15] (iteration 3)
- Did not run a whole-repo `deep-context` reference sweep because the strategy marks that broad approach blocked for this run stage; this pass used the dispatcher-provided exact capability surfaces. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:83] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:84] (iteration 3)
- Did not use compiled generated command contracts as primary evidence because source YAML sections already define the active output paths and events for this capability classification. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:99] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:686] (iteration 3)
- Removing only command or advisor projection surfaces is not enough to preserve behavior; the unique capabilities live in report schema, registry buckets, confidence/coverage signals, state artifacts, and downstream consumer contracts. [INFERENCE: based on Findings 1-6] (iteration 3)
- Do not migrate standalone context analyzer seats, dedicated context packet directories, or literal `lowConfidence`/agreement-gate reducer buckets as first-class `deep-research` artifacts; keep their useful outputs as methodology/confidence/gap annotations. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:35] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/references/state/state_reducer_registry.md:134] (iteration 4)
- Do not promote `resource-map.md` into a semantic Context Report replacement; the confirmed live design is a citation-derived coverage ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:21] (iteration 4)
- Migrating `deep-context` relevance/agreement thresholds directly into `deep-research` convergence was ruled out because the strategy marks threshold transfer as blocked and the `deep-research` agent defines a different newInfoRatio convergence semantic. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:91] [SOURCE: .opencode/agents/deep-research.md:49] (iteration 4)
- Treating the compiled generated command contract as the primary source was avoided because the strategy already blocks using compiled contracts as primary evidence for active output paths; it was used only as corroborating command-surface evidence for setup/default fields. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:116] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:168] (iteration 4)
- Writing migrated semantic fields into config was ruled out because the command contract uses config for run controls and resource-map toggles, while YAML state paths identify separate output artifacts for research and resource maps. [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:118] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:119] (iteration 4)
- Migrating `deep-context` agreement/relevance thresholds into `deep-review` verdict or convergence was ruled out because review verdicts are severity/gate based and claim confidence is finding-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/verdicts.md:25] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/claim-adjudication.md:25] (iteration 5)
- No new dead-end evidence source was exhausted. Candidate reducer promotion: do not migrate `context-report.json` or raw REUSE Catalog tables as mandatory `deep-review` artifacts; map only the subset that supports review scope, findings, gates, report seeds, or traceability. [INFERENCE: based on Findings 2-7] (iteration 5)
- Treating `review/resource-map.md` as a semantic Context Report was ruled out because the confirmed review contract emits it from review deltas as a per-file evidence ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/synthesis-save-and-guardrails/resource-map-emission.md:15] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1382] (iteration 5)
- Using compiled generated contracts as primary evidence was avoided because strategy already marks compiled contracts as blocked for active output-path classification; this iteration used the generated router only to confirm `/deep:review` command dispatch shape. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:118] [SOURCE: .opencode/commands/deep/review.md:9] (iteration 5)
- Candidate reducer promotion: internal runtime cleanup should be deferred behind a test rewrite/removal decision rather than grouped with public deprecation edits. (iteration 6)
- Deleting `.opencode/skills/deep-loop-workflows/deep-context/` before command-contract source cleanup was ruled out because `compile-command-contracts.cjs` still lists that packet's skill, references, assets, and agent as source paths. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60] (iteration 6)
- Early runtime loop-type removal was ruled out because `convergence.cjs`, `fanout-run.cjs`, coverage-graph signals, and tests still encode `context` as a live runtime-loop branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568] (iteration 6)
- No new evidence source was exhausted. Candidate reducer promotion: treat “delete packet before redirect + registry/advisor cleanup + contract-generator cleanup” as blocked. (iteration 6)
- Projection-map-only cleanup was ruled out again for sequencing because context is metadata-routed and still discoverable through hub graph metadata. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 6)
- A whole-repo `deep-context` sweep was not retried because strategy marks broad whole-repo sweeps as blocked; this pass used the dispatcher-provided surface classes and targeted searches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:90] (iteration 7)
- Hand-editing compiled command contracts was ruled out because the compiled contract lists source assets and packet inputs; source changes should regenerate compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] (iteration 7)
- Sweeping historical spec packets was ruled out because they are records of prior decisions and implementation history rather than live command/docs surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47] (iteration 7)
- Treating every `context` substring as standalone `deep-context` cleanup is a dead end; active sk-design fixture references to `context_loading_contract.md` and `contextManifestDigest` are unrelated false positives. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] (iteration 7)
- Treating runtime mirrors as independent cleanup targets is a dead end; the skill declares OpenCode canonical plus Claude mirror and requires sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284] (iteration 7)
- A whole-repo `deep-context` reference sweep was not retried; this iteration used the dispatcher-specified targeted searches over tests, fixtures, benchmarks/playbooks, command-contract sources, advisor tests, package scripts, and runtime branches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:93] (iteration 8)
- Candidate reducer promotion: do not remove runtime `context` validators in the public redirect stage; keep them until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1379] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] (iteration 8)
- Candidate reducer promotion: do not run dedicated CXB behavior benchmarks as replacement-loop validation after redirect; archive/retire them or mark them old-standalone evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4] (iteration 8)
- Hand-editing compiled generated contracts was ruled out again; the relevant evidence points to source compile/render mappings and regeneration. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:37] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:20] (iteration 8)
- Treating every `context_loading_contract` fixture as a standalone `/deep:context` hit was ruled out; the matching sk-design fixtures encode a design context manifest, not the deep-loop context mode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] (iteration 8)
- A whole-repo `deep-context` reference sweep was not retried; the strategy marks broad sweeps as blocked, and this pass used prior findings plus targeted source anchors for a verification matrix. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:95] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:319] (iteration 9)
- Executing implementation edits or generated-contract writes in this iteration was ruled out because the dispatch explicitly said research only. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:40] (iteration 9)
- Hand-editing compiled generated contracts was ruled out; the compiler exposes `--write` and generated output paths, so implementation should edit sources and regenerate. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:791] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:803] (iteration 9)
- Removing internal runtime `context` support in the public redirect patch remains a dead end until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:22] (iteration 9)
- Treating advisor projection drift as the only metadata cleanup gate remains a dead end because context is a metadata-routed mode and hub graph metadata still carries `deep context`, `context loop`, and `deep-context` triggers. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 9)
- Treating dedicated CXB behavior benchmarks as replacement-loop validation remains a dead end; use them as old-standalone archive evidence after redirect rather than as current acceptance gates. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:21] (iteration 9)
- Hand-editing compiled generated command contracts: compiled output lists source inputs and must be regenerated after source changes. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] (iteration 10)
- Public-patch removal of internal runtime `context` support: runtime scripts/tests still accept it. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25] (iteration 10)
- Treating dedicated CXB behavior benchmarks as replacement-loop acceptance remains a dead end; archive them as old standalone evidence after redirect. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32] (iteration 10)
- Treating every `context` substring as a standalone deep-context cleanup target remains a dead end; generic context manifest fixtures are false positives. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:68] (iteration 10)
- Whole-repo `deep-context` reference sweep: strategy marks this blocked, so this pass used targeted command, hub, runtime, packet, fixture, and mirror checks. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:97] (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: Active fixtures/tests/benchmarks split cleanly: dedicated CXB behavior benchmarks are archive/retire candidates, active deep-loop benchmark fixtures that assert standalone context need rewrite/drop after replacement r...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Packet-local spec docs are the canonical starting context for this run.
- `resource-map.md` was not present at initialization; skipping coverage gate.
- Spec memory warm-only retrieval was unavailable at initialization; use repo evidence and packet docs as the confirmed source base.
- Existing packet plan says implementation is pending and Phase 1 requires active-reference inventory before public deprecation edits.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Research packet: `.opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A after reduction
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-07-04T11:20:19Z
