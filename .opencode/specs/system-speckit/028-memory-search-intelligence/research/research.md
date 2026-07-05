# Deep Research Synthesis: System Speckit Alignment Audit

## Current Status

Iteration 1 completed a first-pass top-down inventory for packet 028 memory-search alignment. Convergence is telemetry only for this run; stop policy remains max-iterations.

## Findings Added in Iteration 1

1. Packet 028 is an authoritative late implementation source with broad memory-search, data-quality, review-remediation, and dark-flag child scope; root docs predating its July updates should be revalidated. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:121]
2. The skill-local benchmark index is stale relative to packet 028 benchmark and flag-reckoning evidence. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:7]
3. `feature-flags.md` names `SPECKIT_RETENTION_FORGETTING_V1`, while `ENV_REFERENCE.md` and code use `SPECKIT_RETENTION_FORGETTING`. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132]
4. `MODULE_MAP.md` says feature-catalog topology has 19 categories, but current catalog/playbook surfaces include later category families through 24. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md:381] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:37]

## Open Threads for Next Iterations

- Enumerate all missing/stale feature-flag catalog entries under `feature_catalog/19--feature-flag-reference/`.
- Audit manual playbook per-flag scenarios for late packet-028 graduated, held, and deleted flags.
- Reconcile benchmark index expectations with packet 028 benchmark-status evidence.

## Findings Added in Iteration 2

1. The dedicated feature-flag catalog table is missing late packet-028 survivor flags, while packet 028 defines them as the final surviving switches. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md:31] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:17]
2. Built-but-held tail-lane flags are documented in packet/env/code sources but absent from feature-catalog flag coverage by env var name. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:73] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:994]
3. Generated-metadata/data-quality flags have a dedicated environment-reference section but no corresponding feature-catalog entries found by targeted env-var grep. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:150] [INFERENCE: targeted feature_catalog grep for the listed data-quality env vars returned no files]
4. The retention-forgetting flag-name mismatch remains high severity: packet prose names `SPECKIT_RETENTION_FORGETTING_V1`, while env/code use `SPECKIT_RETENTION_FORGETTING`. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132]

## Updated Open Threads

- Audit manual-testing scenarios for the late-028 flag and verdict set.
- Audit benchmark index/promotion flow against packet 028's corrected benchmark and phase-040 graduation evidence.
- Audit command presentation assets for envelope fidelity, requestQuality, citationPolicy, and ablation/dashboard render contracts.

## Findings Added in Iteration 3

1. Manual playbook coverage is aware of the flag drift but records it as a failure: `feature-flag-governance.md` found 17 source flags missing from the feature-flags table, including many late-028 flags. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/feature-flag-governance.md:57]
2. The EX-028 search-pipeline flag scenario is too generic to prove late-028 survivor, held, deleted, generated-metadata, or verdict-flag behavior. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/1-search-pipeline-features-speckit.md:19]
3. The release-hardening playbook index lists scenarios 439-453 but does not directly name deterministic multihop, lane champion backfill, true citation emitter, retention forgetting, or generated-metadata enforcement. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3865]
4. The ablation/reporting scenario is a broad channel-off/dashboard check and does not encode packet-028 corrected-driver details, default-routing fidelity, trigger-noise deletion, or path-specific flag-eval caveats. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/full-reporting-and-ablation-study-framework-r13-s3.md:36] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:20]

## Next Audit Angle

Command presentation assets for `/memory:search` and eval/dashboard rendering should be checked next because packet 028 graduated `requestQuality`, `citationPolicy`, and `data.envelopeRender` behavior through envelope-fidelity evidence.

## Findings Added in Iteration 4

1. `/memory:search` router and `search_presentation.txt` are aligned on current envelope-fidelity render slots: `requestQuality`, `citationPolicy`, and verbatim `data.envelopeRender` paste behavior. [SOURCE: .opencode/commands/memory/search.md:76] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:117]
2. Historical/current drift remains: phase-027 summary says default-OFF `SPECKIT_ENVELOPE_FIDELITY_V1`, while current command presentation says default-ON `SPECKIT_ENVELOPE_FIDELITY`. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement/implementation-summary.md:57] [SOURCE: .opencode/commands/memory/search.md:78]
3. The ablation presentation template is too generic for packet-028 corrected-driver evidence and still shows a trigger row despite packet 028 dropping the trigger-noise row from corrected channel ablation. [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:297] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:42]
4. The router mentions diagnostic snapshots, gate-verdict, calibration, and cold-lane payloads, but the dashboard presentation template lacks slots for those diagnostic metadata fields. [SOURCE: .opencode/commands/memory/search.md:120] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:310]

## Next Audit Angle After Iteration 4

Inspect runtime formatter/eval handler code and code READMEs to determine whether the command presentation gaps are documentation-only or runtime-output gaps.

## Findings Added in Iteration 5

1. Runtime formatter code backs the `/memory:search` `data.envelopeRender` contract by building the two-line fragment from `requestQuality` and `citationPolicy`; the envelope slot is not presentation-only. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:473] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:486]
2. A stale formatter comment still describes the envelope fragment as “gated dark” and “Off by default,” conflicting with the current command contract that says `SPECKIT_ENVELOPE_FIDELITY` is default-ON and opt-out. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1350] [SOURCE: .opencode/commands/memory/search.md:78]
3. Ablation runtime formatted output includes corpus diagnostic lanes for gate verdict, calibration, and cold-lane metrics when corpus metrics are present. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:416] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1674]
4. Reporting dashboard text output remains narrower than ablation formatted output: it renders summary, metrics, metric-channel rows, channel rows, and trends but no corpus diagnostic lane section. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:650] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:686]
5. `lib/eval/README.md` is current for diagnostic snapshots and corpus metrics, while `lib/search/README.md` omits the formatter/envelope-render surface from its key-file map. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/README.md:98] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:148]

## Next Audit Angle After Iteration 5

Audit benchmark index, benchmark README, benchmark scripts, and promotion/graduation evidence against packet 028 corrected benchmark-status and phase-040 graduation notes.

## Findings Added in Iteration 6

1. The skill-local benchmark README active table is stale even for its own folder: it lists only May 17 and May 20 rows while a May 21 MPS benchmark report exists with a HOLD verdict. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md:1]
2. Packet 028's corrected criterion-4 retrieval benchmark is not reflected in the skill-local benchmark index even though root `benchmark-status.md` records the corrected driver re-run, default-route per-flag deltas, and dropped trigger-noise row. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:20] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:42] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42]
3. Current `run-retrieval-flag-eval.mjs` aligns with the corrected benchmark narrative: per-flag runs omit `forceAllChannels`, channel ablation uses it by design, and `trigger` is excluded because it cannot be ablated through public options. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:96] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:104]
4. Phase 040 benchmark evidence is phase-local rather than skill-local; its summary points to phase-local scripts/results and records a deviation from writing verdicts to `benchmark-status.md`, while the root status later absorbed a phase-040 section. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/implementation-summary.md:84] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:232]
5. Root `benchmark-status.md` has stale internal context: one section says Track C is proposed/not run/no code landed, while a later section says 005 data-quality built thirteen switches and phase 040 ran measured verdicts. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:112] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:243]

## Next Audit Angle After Iteration 6

Audit stress-test and validation surfaces for memory-search post-028 behavior, especially embedder-degrade recall flood, daemon freshness/health truthfulness, search under-surfacing fixes, and whether stress suites/manual playbook indexes reflect those later implementation realities.

## Findings Added in Iteration 7

1. The manual playbook root index is internally stale: prose says 411 executable scenarios and scenarios 450-453 are current high-water entries, but the table already contains 454 and 455. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:193] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3881]
2. Graceful embedder-degrade is comparatively well covered: scenario 450 requires healthy and unavailable-embedder runs, lexical degraded results, `embedder_available:false`, `vector_search_skipped:true`, and names implementation/test anchors. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:11] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:79]
3. Substrate stress-harness coverage is harness hygiene rather than served behavior validation; the phase explicitly says no memory/code-graph behavior changed and verifies cleanup mechanics. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup/implementation-summary.md:56] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/timeline.md:524]
4. The live under-surfacing fix has code-level regression coverage for display floor and compact overflow, but no named manual playbook scenario was found for the under-surfacing/display-floor regression. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/before-vs-after.md:253] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/token-budget-constitutional-sync.vitest.ts:240] [INFERENCE: targeted manual_testing_playbook grep for “under-surfacing” and “display floor” returned no named scenario]
5. Post-016 daemon-side validation remains partially caveated: phase 011 verifies freshness/health fixes, while the timeline records several live-measurement gates deferred to the next daemon lease because the daemon socket was down. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness/implementation-summary.md:85] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/timeline.md:548]

## Next Audit Angle After Iteration 7

Audit feature-catalog and README coverage for the post-016 memory-search repair program: corpus identity repair, archived/tombstone exclusions, embedding coverage, trigger-quality guards, rescue authority, score-scale unification, and entity-linker noise reduction.

## Findings Added in Iteration 8

1. `lib/search/README.md` is partially current: it documents embedder-degrade lexical fallback and entity-linker `supports` down-weighting, but not detailed phase-002 shared active-row predicate, phase-006 selectable rescue modes, or phase-007 score-scale unification. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:172]
2. The schema-version feature catalog is stale for active-row uniqueness after the archived-tier rebuild: it says v28 excludes only `constitutional` and `deprecated`, while phase 002 verified the rebuilt unique index also excludes `archived`. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/schema-version-history-v28-v30.md:31] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:105]
3. The soft-delete tombstone catalog says recall surfaces do not filter tombstoned rows by default, conflicting with phase 002's shared-predicate claim that soft-delete excludes `deleted_at` rows across search, list, triggers, stats, and dedup reads. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/02--mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:20] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/implementation-summary.md:67]
4. Embedding coverage/reconcile has stronger code README coverage: `mcp_server/README.md` documents `memory_embedding_reconcile` as dry-run-default and guarded, while phase 004 records the daemon-side apply caveat. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/README.md:172] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency/implementation-summary.md:118]
5. Score-scale unification appears in scoring feature-catalog entries, but rescue-authority mode coverage is too thin: no dedicated `SPECKIT_RETRIEVAL_RESCUE_MODE`/rescue-authority catalog entry was found, and the pipeline README only names generic rescue authority. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/11--scoring-and-calibration/stage-3-effectivescore-fallback-chain.md:27] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md:28] [INFERENCE: targeted feature_catalog grep for `SPECKIT_RETRIEVAL_RESCUE_MODE`, `retrieval rescue`, and `rescue authority` returned no dedicated entry]

## Next Audit Angle After Iteration 8

Audit command, agent, and skill-reference surfaces for post-016 memory-search repair awareness: `memory_search`, `memory_health`, `memory_embedding_reconcile`, daemon lifecycle/freshness guidance, and whether user-facing commands expose the corrected contracts without stale pre-016 assumptions.

## Findings Added in Iteration 9

1. `/memory:search` is current for the inspected search contract: it routes general discovery to `memory_context`/`memory_quick_search`, reserves `memory_search` for fine-grained parameters, and presents `requestQuality`, `citationPolicy`, and default-ON `SPECKIT_ENVELOPE_FIDELITY` as sanctioned verdict/envelope extras. [SOURCE: .opencode/commands/memory/search.md:46] [SOURCE: .opencode/commands/memory/search.md:68] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:102]
2. `/memory:search` also names the recovery bridge for ablation guard failures: corpus reindex plus embedding reconcile, followed by ground-truth remap if alignment still drifts. [SOURCE: .opencode/commands/memory/search.md:118]
3. `/memory:manage` does not expose `memory_embedding_reconcile` as a first-class presentation/action route in the inspected surfaces, despite command README and system-spec-kit skill coverage for the MCP maintenance tool. [SOURCE: .opencode/commands/memory/manage.md:45] [SOURCE: .opencode/commands/memory/assets/manage_presentation.txt:34] [SOURCE: .opencode/commands/memory/README.txt:246] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:418]
4. `/doctor speckit` memory diagnostics are intentionally read-only and freshness-aware; repair ownership is routed elsewhere, and the inspected doctor command allowed-tool list omits `memory_embedding_reconcile`. [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:21] [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:42] [SOURCE: .opencode/commands/doctor/assets/doctor_memory.yaml:118] [SOURCE: .opencode/commands/doctor/speckit.md:4]
5. The context agent's inspected guidance is aligned with direct-read-first fallback: it prioritizes packet docs and direct reads, leaving memory search as supporting history rather than an unconditional primary source. [SOURCE: .opencode/agents/context.md:101] [SOURCE: .opencode/agents/context.md:110]

## Next Audit Angle After Iteration 9

Audit deep-loop and spec-kit workflow references for stale assumptions about memory-search reliability, daemon freshness, and repair routing, especially `/speckit:resume`, memory-save/generate-context guidance, and deep-loop prompt packs.

## Findings Added in Iteration 10

1. `/speckit:resume` is aligned with post-016 fallback lessons: it recovers from handover, `_memory.continuity`, supporting spec docs, graph metadata hints, `session_bootstrap()`/`memory_context()`, then anchored `memory_search()`, with MCP enrichment only when the canonical packet is still thin. [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:87] [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:151]
2. `/speckit:resume` has explicit memory transport/failure fallback: warm-only CLI exit 75 is retryable, the file ladder needs no MCP, and failed memory search proceeds only with essentials already recovered. [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:105] [SOURCE: .opencode/commands/speckit/assets/speckit_resume_auto.yaml:212]
3. `/memory:save` separates durable continuity saves from retrieval freshness: it routes through `generate-context.js`, may refresh visibility with `memory_index_scan`, and presents deferred indexing honestly. [SOURCE: .opencode/commands/memory/save.md:28] [SOURCE: .opencode/commands/memory/save.md:38] [SOURCE: .opencode/commands/memory/assets/save_presentation.txt:84]
4. `/deep:research` has a startup-vs-iteration asymmetry: startup `memory_context` handling only distinguishes found/no context in the inspected block, while later per-iteration refresh treats MCP errors/timeouts as non-fatal and the manual playbook expects advisory MCP failures. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:51] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1154] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/manual_testing_playbook.md:683]
5. Deep-research delta-path references are naming-misaligned with this packet's runner contract: YAML declares and validates `deltas/iter-{NNN}.jsonl`, while this packet writes `deltas/iteration-NNN.jsonl`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:111] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1039] [INFERENCE: based on packet-local `research/deltas/iteration-009.jsonl` and `research/deltas/iteration-010.jsonl`]

## Next Audit Angle After Iteration 10

Audit deep-review and AI-council fallback/staleness contracts for cross-mode consistency: graphless fallback gates, startup `memory_context` failure behavior, stale graph/status recovery payloads, and whether command assets prevent false-safe success when MCP sources are unavailable.

## Findings Added in Iteration 11

1. Deep-review has the same startup memory-context ambiguity found in deep-research: the auto YAML calls `memory_context` and defines found/no-context behavior, but the inspected startup block does not specify MCP error or timeout fallback. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:43] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:47] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:51]
2. Deep-review's stop-time graphless fallback contract is strong: `graphlessFallbackGate` blocks STOP for `unavailable_blocked` and requires cited fallback ledger rows when in `graphless_fallback` mode. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:599] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:674]
3. The deep-review manual playbook mirrors the anti-false-safe scenario: graphless fallback with an empty ledger must emit named `blocked_stop` evidence and recovery guidance naming fallback methods. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md:13] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md:21]
4. Deep-ai-council's startup context block is thinner than review: it declares `memory_context` for prior council context, but the inspected block lacks found/no-context behavior and MCP error/timeout fallback. [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:30] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:34]
5. Deep-ai-council graph references are strong against false-safe success: status must return recovery payloads for empty/stale/corrupt states, and convergence uses `STOP_ALLOWED`, `CONTINUE`, and `STOP_BLOCKED` rather than collapsing non-stop states into success. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/08--council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md:15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/graph_support.md:91]

## Next Audit Angle After Iteration 11

Audit runtime implementation and tests for the documented deep-review and AI-council fallback contracts: review-depth graphless fallback tests, council `status.cjs` recovery payload assembly, `convergence.cjs` three-state decisions, and whether tests are active or still TODO/manual-only.

## Findings Added in Iteration 12

1. Council `status.cjs` implements the recovery payload directly: readiness is `empty` or `ready`, source of truth is packet-local AI-council artifacts, safe actions describe derived-row replay, and the response includes counts/schema version plus signals when nodes exist. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:137] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:147] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/status.cjs:163]
2. Council convergence runtime implements the three-state anti-false-safe contract: empty graph returns `STOP_BLOCKED`; otherwise blockers, trace, and signals decide `STOP_BLOCKED`, `STOP_ALLOWED`, or `CONTINUE`. [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:171] [SOURCE: .opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:192]
3. Council graph integration tests actively cover empty/ready status and all three convergence branches: blocked empty/critical, continue, and stop allowed. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:265] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:281]
4. Review-depth graphless fallback has active coverage but the inspected convergence fixture is a workflow-YAML string assertion, not a full workflow-runner convergence execution. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:24]
5. Review-depth validator tests actively enforce evidence quality by failing missing `searchLedger`, uncited ledger rows, broken linked finding IDs, and shallow active finding details. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:153] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:157] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:171] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:186]

## Next Audit Angle After Iteration 12

Audit documentation claims around review-depth v2 test coverage and workflow-runner integration: feature catalogs, README/changelog entries, and manual playbooks that may imply fully executed graphless fallback behavior when inspected tests are mostly YAML/validator-level.

## Findings Added in Iteration 13

1. Deep-review README and quality-gates catalog accurately describe the intended nine-gate legal-stop contract, including `candidateCoverageGate` and `graphlessFallbackGate`, without explicitly claiming a workflow-runner test. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/README.md:98] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/04--severity-system/quality-gates.md:27]
2. The review-depth manual playbook root uses broad “validate” wording for graphless fallback and stop-gate blockers, while the dedicated graphless fallback scenario discloses that workflow-runner integration is pending and a manual harness is required. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/manual_testing_playbook.md:751] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/stop-gate-graphless-fallback.md:31]
3. The actual `review-depth-convergence.vitest.ts` fixture checks YAML strings for gate names, ledger requirements, `unavailable_blocked`, and blocked-stop JSON wiring rather than executing a full workflow-runner convergence path. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:24]
4. Deep-loop-runtime integration README wording can overstate review-depth convergence coverage: it describes integration tests as end-to-end script-entry coverage, then lists `review-depth-convergence.vitest.ts` as “review convergence signals.” [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/README.md:3] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/README.md:12] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/README.md:25]
5. Deep-loop-runtime feature-catalog validation rows similarly label `review-depth-convergence.vitest.ts` as integration/review-depth convergence fixture coverage under script-entry or coverage-graph surfaces, without distinguishing static workflow-contract checks from spawned script execution. [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/convergence-script.md:47] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/coverage-graph-signals.md:47]

## Next Audit Angle After Iteration 13

Audit AI-council graph documentation/test-depth claims: compare manual playbook and feature catalog claims for status recovery, convergence safety, and value-comparison scenarios against the actual council integration/value test files.

## Findings Added in Iteration 14

1. AI-council manual playbook graph-status and value-comparison claims are concrete: DAC-024 requires recovery payload/readiness with no false-safe success, and DAC-027..DAC-032 cover graph-vs-baseline value comparisons. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:337] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:357]
2. The playbook cross-reference maps graph integration scenarios to `council-graph-script.vitest.ts` and value scenarios to `council-graph-value-scenarios.vitest.ts`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:399] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409]
3. `council-graph-script.vitest.ts` actively asserts empty/ready status recovery and all three convergence branches: `STOP_BLOCKED`, `CONTINUE`, and `STOP_ALLOWED`. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:211] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:236] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:265] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts:281]
4. `council-graph-value-scenarios.vitest.ts` actively runs DAC-027..DAC-032 fixtures and compares graph answers, baseline answers, file reads, runtime calls, and ratios. [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:20] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:37] [SOURCE: .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts:40]
5. AI-council feature-catalog wording still has a precision gap: it labels the manual playbook scenario as “Automated test,” while the actual per-DAC fixture source is a thin wrapper around centralized `buildScenarioFixture`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:47] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:51] [SOURCE: .opencode/skills/deep-loop-runtime/tests/fixtures/council-value/dac-032.ts:5]

## Next Audit Angle After Iteration 14

Audit cross-skill test-reference labeling patterns: feature catalogs and playbooks that label manual scenario contracts, runtime integration fixtures, and true automated tests inconsistently across system-spec-kit, deep-loop-runtime, and deep-loop-workflows.

## Findings Added in Iteration 15

1. Deep-ai-council feature catalogs repeatedly label manual playbook scenario files as `Automated test` even when the role text says `Manual scenario contract`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/08--council-graph-integration/council-graph-status-recovery-payload-and-readiness.md:51] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/09--council-graph-value-comparison/convergence-safety-under-critical-disagreement-graph-vs-baseline.md:51]
2. The AI-council root manual playbook is more precise: it separates graph integration tests, value-scenario tests, operator A/B comparisons, and documentation reference validation. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:399] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:409] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md:411]
3. System-spec-kit feature catalogs have localized placeholder `Automated test` rows with no test path, especially in some retrieval-enhancement entries. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/15--retrieval-enhancements/dual-level-retrieval.md:43] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/15--retrieval-enhancements/graph-expanded-fallback.md:42] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/15--retrieval-enhancements/always-on-graph-context-injection.md:42]
4. System-spec-kit also has many precise automated-test rows that name actual vitest files, so the placeholder rows are localized rather than universal. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/03--discovery/health-diagnostics-memoryhealth.md:67] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/15--retrieval-enhancements/cross-document-entity-linking.md:57]
5. Deep-loop-runtime feature catalogs use broad `Integration` labels for command YAML assets or fixture coverage, which can blur command assets, static fixtures, and true script-spawn tests. [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/11--observability/single-loop-telemetry-heartbeat.md:40] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/convergence-script.md:48] [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/coverage-graph-signals.md:49]

## Next Audit Angle After Iteration 15

Audit feature-catalog generation/scaffolding sources for test-label taxonomy: templates, create-feature-catalog command assets, and any scripts that emit `Automated test`, `Integration`, or manual scenario rows.

## Findings Added in Iteration 16

1. `/create:feature-catalog` is wired to sk-doc feature-catalog creation guidance and both root/per-feature templates, making that template bundle the intended taxonomy authority for generated or updated catalogs. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:144] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:149] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:235]
2. The sk-doc per-feature template defines validation/test `Type` values as `Automated test` or `Manual playbook`; it does not define `Integration`, `Manual scenario contract`, or placeholder automated-test rows as valid type taxonomy. [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:118] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:158]
3. The root feature-catalog template mirrors the same validation table shape and type choices, so observed broader labels are not explained by an alternate root-template taxonomy. [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:226] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:230]
4. The create-feature-catalog workflow validation gate checks root validation, linked files, category names, section headers, and count consistency, while source-anchor correctness remains a manual-review requirement. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:258] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:261] [SOURCE: .opencode/skills/sk-doc/references/feature_catalog_creation.md:179]
5. A separate scaffolding mismatch exists: create-command quality standards still name `CURRENT REALITY` as a required per-feature section, while the current templates use `HOW IT WORKS`. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:163] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:166] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:87]

## Next Audit Angle After Iteration 16

Audit sk-doc and system-spec-kit validation/test surfaces for documentation-quality enforcement gaps: `validate_document.py`, markdown link checks, catalog/playbook tests, and whether any gate can detect placeholder test paths, invalid Type values, or template/command section-name drift.
