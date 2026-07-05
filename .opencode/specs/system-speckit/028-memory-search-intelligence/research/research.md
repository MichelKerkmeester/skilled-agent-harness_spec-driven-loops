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
