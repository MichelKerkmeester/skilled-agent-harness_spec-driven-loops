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
