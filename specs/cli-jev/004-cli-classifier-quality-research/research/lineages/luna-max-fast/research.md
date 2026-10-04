---
title: "CLI Classifier Quality Research — Luna Max Fast Lineage"
description: "Five-iteration static audit of the cli-classifier hub, cli-jev packet, shared scripts, callers, advisor routing, documentation, and measurement surfaces."
importance_tier: important
contextType: research
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->

# CLI Classifier Quality Research — Luna Max Fast Lineage

Artifact root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/004-cli-classifier-quality-research/research/lineages/luna-max-fast

## 1. QUESTIONS

This review covered seven requested axes:

1. sk-doc compliance across the cli-classifier documentation.
2. sk-code-opencode compliance of the shared scripts, tests, and callers.
3. system-skill-advisor routing vocabulary, manifests, graph metadata, and prompt reachability.
4. External-user and benchmark-operator experience.
5. Documentation accuracy against implementation.
6. Script and test defects.
7. Drift across documentation, metadata, mirrors, code, and measured-result visibility.

## 2. EXECUTIVE SUMMARY

Six P2 findings were confirmed by static source tracing. They cover one README structure omission, two documentation/code mismatches, two shared transport edge cases, and one caller-level omission of the actual answering transport from recorded benchmark calls.

No P0 or P1 issue was established. Advisor metadata, router vocabulary, and cli-jev leaf manifests align in the reviewed source. The Jev-missing path fails closed, and the benchmark instructions distinguish no-call inspection from cost-bearing live runs. A historical Pi/CLI comparison remains visible in the integration feature catalog, but the current replay has no checked-in verdict. No tests, benchmark calls, Jev or Pi calls, validators, builds, or generated tooling ran.

## 3. SCOPE

The audit followed the user-provided topic and five-pass schedule. It covered the cli-classifier hub and cli-jev packet, shared transport and scorer-report modules and tests, benchmark scripts and inputs, feature catalog, manual testing playbook, changelogs and READMEs, advisor metadata and generated graph, runtime mirror, and live caller surfaces in sk-doc, system-deep-loop, and system-spec-kit.

The review was read-only against repository sources. New iteration and synthesis artifacts were written only under this lineage root.

## 4. METHOD AND EVIDENCE

The work used source reads, repository search, directory inventory, and static branch tracing. Each finding below has repository-relative file-and-line evidence and a confirmation method. Test fixtures and assertions were inspected but not executed.

A read-only inventory enumerated 79 Markdown files under cli-classifier. An inline static scan found no unresolved ordinary relative Markdown links among those files. The scan was not a replacement for each document type's complete sk-doc checklist, so this report does not claim a full validator-equivalent pass over every document.

Measured values below are values already recorded in documentation; they are not results produced by this lineage.

## 5. SURFACE INVENTORY

- Documentation includes the root hub, cli-jev leaves, READMEs, feature-catalog entries, measurement notes, manual-testing playbook, benchmark instructions, and changelogs.
- Six transport call surfaces were found: five external imports in sk-doc, system-deep-loop, and system-spec-kit, plus the cli-classifier injection-screen scorer.
- Scorer-report is consumed by clarify-default, injection-screen, and track-narrowing scorers, and by the score-alignment-suggestion implementation; its test suite also imports it.
- The advisor graph contains cli-classifier in the CLI family. The hub router and mode registry point to cli-jev as the only current transport mode, and ROUTER.md maps four intents to five leaves in the leaf manifest.
- The Hermes mirror carries the hub's current text. No separate .agents, .claude, .codex, or .opencode cli-classifier mirror was found.

## 6. FINDINGS

### LUNA-F001 — Shared-tier README omits the required directory overview

- Severity: P2
- Axis: 1 — sk-doc compliance
- Evidence: The code-folder README template requires a directory tree when immediate subdirectories exist (.skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md:52). The shared-tier README contains no tree (.skilled/skills/cli-classifier/shared/README.md:1-9), although shared/scripts is an immediate child.
- How confirmed: Compared the template condition and README with the shared directory inventory and scripts README. This is a structure finding on the confirmed shared-tier README; it does not establish a failure in every other document.

### LUNA-F002 — Shared-tier README describes an obsolete empty state

- Severity: P2
- Axis: 5 — documentation accuracy
- Evidence: The shared-tier README says that the hub ships no shared helpers and frames them as future additions (.skilled/skills/cli-classifier/shared/README.md:8-9). The scripts README documents the existing transport and scorer-report modules (.skilled/skills/cli-classifier/shared/scripts/README.md:16-30).
- How confirmed: Cross-checked the README claim against the direct helper inventory and the scripts README.

### LUNA-F003 — A choice without its required question can reach Pi

- Severity: P2
- Axis: 6 — bugs in scripts and tests
- Evidence: cli-jev marks -q/--question as required for choice (.skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:40-48). choiceRequestFrom initializes the question to an empty string and rejects only when no option keys were parsed (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:91-92,126-127). spawnClassifierCall routes any non-null parsed request through transport selection and Pi preflight (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:528-545). The parser test does not cover options present with the question absent (.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:191-202).
- How confirmed: Static branch tracing shows that a choice with a valid option but no question remains a parsed request and can enter Pi preflight instead of preserving Jev's required-argument error. No call was run.

### LUNA-F004 — Omitting the documented optional environment prevents Pi discovery

- Severity: P2
- Axis: 6 — bugs in scripts and tests
- Evidence: spawnClassifierCall documents env as optional (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:507-509) but substitutes an empty object when it is omitted (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:511-512). Pi discovery reads PATH from that object (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:291-304), and the same object reaches route selection and preflight (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:528-545). The shared test fixture always passes an environment object (.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:124-132).
- How confirmed: Followed the omitted-env path statically. Discovery receives no PATH entries from process.env, so a process-installed Pi package is not found through the documented minimal call shape. Tests were not run.

### LUNA-F005 — Hub skill describes the wrong default for the shared transport

- Severity: P2
- Axis: 5 — documentation accuracy
- Evidence: The public hub says Pi is opt-in and Jev CLI is the default/fallback (.skilled/skills/cli-classifier/SKILL.md:114). resolveTransport returns auto when neither a per-call option nor JEV_TRANSPORT selects a route (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:55-72); supported choice and noul calls proceed to Pi preflight unless the route resolves to Jev (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:526-545). The shared README and integration catalog describe the automatic Pi preference (.skilled/skills/cli-classifier/shared/scripts/README.md:16,28; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:18-25,37-42).
- How confirmed: Compared the public hub sentence with route resolution, call flow, and the documentation that matches the implementation. The Hermes copy repeats the stale statement (.hermes/skills/cli-classifier/SKILL.md:119).

### LUNA-F006 — Clarify-default omits the answering transport from call records

- Severity: P2
- Axis: 7 — drift and measured-result visibility
- Evidence: score-clarify-default calls spawnClassifierCall without a per-call transport option (.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1265-1267). When JEV_TRANSPORT is unset, the helper resolves to auto and can return transport: pi (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:64-72,534-536,593-601). The scorer's choice record hardcodes backend: jev and has no transport field (.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1366-1380). The catalog says all five scorers record the answering route as transport (.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md:61-63; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:88-101). Its test helper forces JEV_TRANSPORT=jev, while the separate Pi test forces pi and checks the model without asserting a route field in calls.jsonl (.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs:190-193,958-984).
- How confirmed: Traced the process environment into route resolution, the returned result shape, and the scorer's exact writeCall object, then checked the documentation promise and test assertions. The result's model may hint at a provider, but the declared route is absent and backend: jev can mislead benchmark readers. No scorer or test ran.

## 7. AXIS 1 — SK-DOC COMPLIANCE

One concrete structure defect was confirmed in the shared-tier README (F001). The audit inventoried 79 Markdown documents and found no broken ordinary relative Markdown links in a static scan. It did not apply every doc-type checklist to every leaf, so global compliance remains unproven. No finding is inferred solely from a missing H1 or frontmatter because README and changelog templates can use different structures.

## 8. AXIS 2 — SK-CODE-OPENCODE COMPLIANCE

Static inspection of shared module headers and reviewed ESM/CommonJS call sites found no additional style finding. F003 and F004 are behavioral boundary defects, listed under Axis 6. The full script and test set was not executed or certified against every sk-code-opencode criterion.

## 9. AXIS 3 — SYSTEM-SKILL-ADVISOR INTEGRATION

The public hub vocabulary, graph metadata, router, mode registry, and leaf manifest agree on cli-classifier as the hub and cli-jev as the only current transport. ROUTER.md's four intents resolve to five unique leaves that match the manifest. The generated advisor graph contains the hub and its Jev signals (.skilled/skills/cli-classifier/graph-metadata.json:32-43,72-109; .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1; .skilled/skills/cli-classifier/hub-router.json:1-56; .skilled/skills/cli-classifier/mode-registry.json:1-58; .skilled/skills/cli-classifier/ROUTER.md:34-85; .skilled/skills/cli-classifier/leaf-manifest.json:1-16).

The searched labeled, holdout, and ambiguity prompt corpora had no Jev or cli-classifier examples. That leaves advisor recall unmeasured; it is not proof of a routing defect. No router replay or validator ran.

## 10. AXIS 4 — EXTERNAL-USER AND BENCHMARK-OPERATOR UX

The hub's Jev mode checks for the binary and reports the mode unavailable when Jev is missing (.skilled/skills/cli-classifier/SKILL.md:20-24,137-139; .skilled/skills/cli-classifier/cli-jev/SKILL.md:59-70). The cli-jev README includes the uv tool install command in its provenance/setup material (.skilled/skills/cli-classifier/cli-jev/README.md:125-132), though it is not in the main prerequisite block.

Benchmark documentation distinguishes zero-call inspection from live arms and explains required output directories, cost-bearing calls, outputs, and stop conditions (.skilled/skills/cli-classifier/benchmark/pi-transport/README.md:38-53,69-87). The current Pi replay documentation reports that no verdict is available (.skilled/skills/cli-classifier/benchmark/pi-transport/README.md:87; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md:30-38).

The checked-in injection-screen inputs are populated (90 labels and 30 planted sentences), but no scored report or calls file was found for the current scorer or its originating scratch packet. Historical Pi/CLI measurements remain visible in the integration entry (.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:103-106). The curated benchmark report index does not list that comparison (.skilled/skills/cli-classifier/benchmark/reports/README.md:23-36).

## 11. RECOMMENDATIONS

- Correct the shared-tier README's inventory and add the directory overview required by its code-folder template.
- Reconcile the hub's transport-default statement with the helper's automatic route.
- For clarify-default measurements, choose and document whether the Jev arm pins Jev or records the actual returned transport; then align calls.jsonl, tests, and catalog wording.
- Add tests for a choice with options but no question, and for the documented call shape with env omitted.
- Publish a current benchmark verdict when a live run is permitted; keep the existing historical comparison clearly marked as historical.

## ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| None recorded | No research path was ruled out during this read-only audit. | Iteration records contain empty ruledOut arrays. | 1-5 |

## DIVERGENCE MAP

No divergent-mode pivots, overrides, or failed pivots were recorded in this lineage. The audit covered documentation, scripts/tests, advisor routing, user/operator paths, documentation accuracy, bugs, and drift/results. The remaining frontier is runtime verification, a current scored comparison, advisor recall measurement, and full document-by-document standards coverage.

## 12. OPEN QUESTIONS

1. Do runtime tests reproduce F003, F004, and F006, and are there further issues not visible in the traced paths?
2. What does a current with-and-without Pi/CLI replay report after route attribution is explicit?
3. Does a complete, doc-type-specific sk-doc checklist review of every Markdown leaf find additional issues?
4. What is the advisor's recall for natural Jev prompts when the routing corpus includes representative examples?

## 13. AXIS 5 — DOCUMENTATION ACCURACY

Two direct documentation/code contradictions were confirmed: F002's obsolete shared-helper inventory and F005's stale default-transport description. F006 is a third reporting mismatch between the feature catalog and one scorer's call record. The shared scripts README and Pi integration entry describe the unset automatic route consistently with code. The hub's Hermes mirror repeats F005's stale sentence; no separate semantic mirror drift was established.

## 14. AXIS 6 — SCRIPT AND TEST BUGS

F003 allows a malformed choice without the required question to remain Pi-eligible. F004's optional env contract is not honored by Pi discovery when the argument is omitted. The reviewed scorer-report probability selection, abstention handling, margin, bootstrap, and empty-sample tests were aligned in the inspected code paths; no additional arithmetic defect was confirmed. This is static analysis, not a test result.

## 15. AXIS 7 — CROSS-SURFACE DRIFT AND RESULT VISIBILITY

F006 shows that the feature catalog's answering-transport claim does not hold for score-clarify-default records. Its label can say backend jev even when automatic routing can select Pi; route-level attribution is not written.

A historical Pi/CLI run is visible at .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:103-106. It records K=111, M=111, coverage 100%, agreement 95.5%, p95 values of 340/387 ms, and estimated cost 0.0022. The newer replay and injection-screen have no checked-in verdict. This lineage produced no with-and-without measurement.

## 16. LIMITATIONS AND CONVERGENCE REPORT

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 3 / 5
- Remaining questions: 2 (runtime and current benchmark evidence; exhaustive doc-specific review and advisor recall remain explicitly open)
- Last 3 iteration summaries: run 3 — advisor and hub routing (0.22); run 4 — external user and benchmark operator (0.30); run 5 — callers and cross-surface reconciliation (1.00)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; the remaining frontier is listed above.
- The ratios are telemetry only; the configured max-iterations policy controlled the stop.

This synthesis and its terminal event were confined to the lineage directory. The YAML resource-map reducer takes the spec folder and resolves a packet-level research output, so it was not run because that would write outside the user-authorized path (.skilled/commands/deep/assets/deep-research-auto.yaml:2113-2129). The YAML closeout creates a temporary event directory, then has later spec writeback, validation, and Git-staging steps; these were not run under the user's explicit path and read-only constraints (.skilled/commands/deep/assets/deep-research-auto.yaml:2166-2190,2193-2311). The synthesis event itself was submitted through append-mode-event.cjs. Reducer-owned registry, strategy, and dashboard files were not edited directly.

## 17. REFERENCES

### Findings

- F001: .skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md:52; .skilled/skills/cli-classifier/shared/README.md:1-9.
- F002: .skilled/skills/cli-classifier/shared/README.md:8-9; .skilled/skills/cli-classifier/shared/scripts/README.md:16-30.
- F003: .skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:40-48; .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:91-92,126-127,528-545; .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:191-202.
- F004: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:291-304,507-512,528-545; .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:124-132.
- F005: .skilled/skills/cli-classifier/SKILL.md:114; .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:55-72,526-545; .skilled/skills/cli-classifier/shared/scripts/README.md:16,28; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:18-25,37-42; .hermes/skills/cli-classifier/SKILL.md:119.
- F006: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1265-1267,1366-1380,1673; .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs:190-193,958-984; .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:64-72,534-536,593-601; .skilled/skills/cli-classifier/feature-catalog/feature-catalog.md:61-63; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:88-101.

### Cross-surface observations

- Advisor route: .skilled/skills/cli-classifier/graph-metadata.json:32-43,72-109; .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1; .skilled/skills/cli-classifier/hub-router.json:1-56; .skilled/skills/cli-classifier/mode-registry.json:1-58; .skilled/skills/cli-classifier/ROUTER.md:34-85; .skilled/skills/cli-classifier/leaf-manifest.json:1-16.
- User and benchmark path: .skilled/skills/cli-classifier/SKILL.md:20-24,137-139; .skilled/skills/cli-classifier/cli-jev/SKILL.md:59-70; .skilled/skills/cli-classifier/cli-jev/README.md:125-132; .skilled/skills/cli-classifier/benchmark/pi-transport/README.md:38-53,69-87; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md:30-38; .skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md:26-36; .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90; .skilled/skills/cli-classifier/benchmark/injection-screen/planted.jsonl:1-30; .skilled/skills/cli-classifier/benchmark/reports/README.md:23-36.
- Caller inventory and scorer-report: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:25; .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:28; .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:25; .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:25-26,1713-1720; .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:30; .skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:107-229; .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:525; .skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts:1003.
- Workflow confinement: .skilled/commands/deep/assets/deep-research-auto.yaml:2113-2129,2166-2190,2193-2311.
