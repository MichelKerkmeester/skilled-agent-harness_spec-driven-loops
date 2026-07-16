# Iteration 3: Manual testing playbook coverage for late 028 flags and verdict behavior

## Focus
This iteration broadened from feature-catalog omissions into the manual testing playbook. I checked whether operator-facing scenarios cover the late packet-028 feature-flag, verdict, generated-metadata, and eval behavior identified in iterations 1-2. The selected interpretation is manual-playbook coverage for the same late-028 memory-search flag set; benchmark and command presentation assets remain deferred.

## Findings
1. The manual playbook already contains a governance scenario that explicitly fails the flag-coverage invariant: it scanned `search-flags.ts`, found 17 `SPECKIT_*` tokens missing from the feature-flags table, and names many late-028 flags including `SPECKIT_CITE_WITH_CAVEAT`, `SPECKIT_CONFIDENCE_CALIBRATION`, `SPECKIT_DERIVED_ID_PROVENANCE`, `SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_EVIDENCE_GAP_VERDICT`, `SPECKIT_LANE_CHAMPION_BACKFILL`, `SPECKIT_LEXICAL_GROUNDING`, `SPECKIT_NOISE_FLOOR_SUBTRACTION`, `SPECKIT_RETENTION_FORGETTING`, `SPECKIT_TRUE_CITATION_EMITTER`, and `SPECKIT_WORLD_SUMMARY_PRELUDE`. This confirms the catalog drift is also an acknowledged manual-test failure, not just a researcher inference. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/governance/feature-flag-governance.md:52] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/governance/feature-flag-governance.md:57] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/governance/feature-flag-governance.md:100]
2. The dedicated manual scenario for `EX-028 -- 1. Search Pipeline Features (SPECKIT_*)` is too generic for late-028 validation: its expected signals are only active/inert/retired classification and retired-topic cleanup, and its evidence section is a placeholder (`Search/context outputs + catalog cross-check notes`) rather than concrete assertions for survivor, held, deleted, or data-quality flags. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/1-search-pipeline-features-speckit.md:19] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/1-search-pipeline-features-speckit.md:23] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/1-search-pipeline-features-speckit.md:46]
3. The root playbook's release-hardening index covers scenarios 439-448 for semantic triggers, idempotency, tombstones, feedback retention, retrieval observability, and governance guards, but it does not list direct scenarios for packet-028 tail-lane flags, verdict flags, retention forgetting, or generated-metadata enforcement; this makes late-028 coverage indirect at best. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:194] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3865] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3879] [INFERENCE: release-hardening index entries 439-453 do not name deterministic multihop, lane champion backfill, true citation emitter, retention forgetting, or generated-metadata enforcement]
4. The manual playbook's ablation/reporting scenario is still a broad R13-S3 check (`Run ablation channel-off`, `Check snapshots`, `Validate dashboard`) and does not encode the corrected packet-028 benchmark driver details: default routing path, aligned golden set, dropped trigger-noise row, or the finding that only two flags were exercised by Recall@20 while other paths need path-specific evals. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/evaluation-and-measurement/full-reporting-and-ablation-study-framework-r13-s3.md:18] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/evaluation-and-measurement/full-reporting-and-ablation-study-framework-r13-s3.md:36] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:20] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:38]
5. Some verdict/envelope terms appear in older or adjacent playbook files, but not as direct late-028 graduation scenarios: grep found `requestQuality`, `citationPolicy`, `envelopeRender`, and `evidenceGapDetected` in feature-flag and UX/retrieval scenarios, while packet 028 specifically says `SPECKIT_CITE_WITH_CAVEAT`, `SPECKIT_EVIDENCE_GAP_VERDICT`, and `SPECKIT_ENVELOPE_FIDELITY` graduated from fixture re-benchmarks. That is a coverage gap: the playbook can observe these fields, but does not appear to validate their graduated 028 before/after fixtures by flag name. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md:125] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md:127] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/3-mcp-configuration.md:87] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/empty-result-recovery-speckit-empty-result-recovery-v1.md:168]

## Ruled Out
- Treating the manual playbook as wholly unaware of late-028 drift was ruled out: `feature-flag-governance.md` explicitly records the missing flags and marks the scenario FAIL. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/governance/feature-flag-governance.md:96]
- Treating field-level mentions of `requestQuality`, `citationPolicy`, or `envelopeRender` as full coverage was ruled out because packet 028's graduated behavior is flag-specific and fixture-benchmark-specific. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md:125]

## Dead Ends
- Direct env-var grep is productive for named flag coverage, but it cannot prove semantic playbook coverage when a scenario validates behavior without naming the flag. Future passes should pair grep with targeted reads of likely retrieval/verdict scenarios.

## Edge Cases
- Ambiguous input: Manual coverage could mean root scenario index, individual scenario files, or actual transcript evidence. I used root index plus targeted scenario files because this leaf is research-only and does not execute manual scenarios.
- Contradictory evidence: The playbook both contains a scenario for feature-flag governance and records that the scenario fails. I preserved that distinction: existence of a scenario is not coverage success.
- Missing dependencies: No manual scenario execution transcript was generated in this research-only pass; findings are based on playbook source content and packet evidence.
- Partial success: This pass did not audit every manual scenario file. It focused on late-028 flag/verdict terms and the likely feature-flag/eval/governance scenarios.

## Sources Consulted
- `.opencode/skills/system-spec-kit/manual_testing_playbook/governance/feature-flag-governance.md:52`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/1-search-pipeline-features-speckit.md:19`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3865`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/evaluation-and-measurement/full-reporting-and-ablation-study-framework-r13-s3.md:36`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:20`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md:125`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/3-mcp-configuration.md:87`

## Assessment
- New information ratio: 1.0
- Questions addressed:
  - Which manual testing playbooks describe outdated or missing behavior?
  - Where do docs claim coverage that tests/playbooks no longer support?
  - Where does implemented behavior lack corresponding playbook coverage?
- Questions answered:
  - Manual playbook coverage is not absent, but the key governance scenario currently records FAIL for missing flag documentation.
  - Existing manual scenarios do not directly validate the late-028 corrected benchmark, tail-lane flags, verdict graduations, generated-metadata enforcement, or retention-forgetting behavior.

## Reflection
- What worked and why: Grepping the manual playbook for late-028 env vars immediately surfaced an existing governance-failure scenario that corroborates the feature-catalog drift.
- What did not work and why: Field-level grep for verdict terms found many adjacent scenarios, but those terms are shared across features and do not isolate the 028 graduation contract.
- What I would do differently: Next pass should move from playbook coverage to command presentation assets for `/memory:search` and eval/dashboard rendering, because envelope-fidelity graduation specifically changed render slots and command-visible fields.

## Recommended Next Focus
Audit command presentation and router assets for `/memory:search`, especially `search_presentation.txt`, `/memory:search` command docs, `eval_run_ablation`, `eval_reporting_dashboard`, `requestQuality`, `citationPolicy`, and `data.envelopeRender` handling against packet-028 envelope-fidelity and benchmark-status evidence.
