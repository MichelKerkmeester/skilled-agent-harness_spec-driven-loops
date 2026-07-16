# Iteration 7: Stress-Test and Validation Surface Alignment

## Focus

This iteration broadened from benchmark index alignment to stress-test and validation surfaces for post-028 memory-search behavior. It checked whether manual playbook indexes, stress harness notes, runtime regression tests, and late packet summaries align on embedder-degrade, live under-surfacing, daemon freshness, and daemon-side caveats. The selected interpretation was limited to research and evidence mapping; no stress suites were run.

## Findings

1. The manual testing playbook root index is internally stale: its prose says the deterministic executable-scenario count is 411 and scenarios 450-453 are the current high-water entries, but the same index table already contains scenario 454 and 455 rows. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:193] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:194] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3880] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3881]
2. Graceful embedder-degrade is comparatively well covered in the manual playbook: scenario 450 requires a healthy baseline, an unavailable-embedder run, lexical non-empty degraded results, `embedder_available:false`, `vector_search_skipped:true`, and typed Stage 1 input errors, with implementation/test anchors named. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:11] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:20] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:76] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:79]
3. The substrate stress-harness coverage in packet 028 is explicitly harness hygiene, not served memory-search behavior: the implementation summary says it changes cleanup only, keeps the write location unchanged, and verifies sandbox cleanup via `node --check`, comment hygiene, standalone `--clean`, and `npm run stress:substrate`. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup/implementation-summary.md:56] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup/implementation-summary.md:85] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup/implementation-summary.md:110] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/timeline.md:524]
4. The live memory-search under-surfacing fix is covered by code-level regression tests for display floor and compact overflow, but this iteration found no named manual playbook scenario for the user-visible under-surfacing/display-floor regression itself. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/before-vs-after.md:245] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/before-vs-after.md:253] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/token-budget-constitutional-sync.vitest.ts:240] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/token-budget-constitutional-sync.vitest.ts:296] [INFERENCE: targeted manual_testing_playbook grep for “under-surfacing” and “display floor” returned no named scenario]
5. Late post-016 daemon-side validation remains only partially represented in manual/stress surfaces: phase 011 verifies dist freshness, CLI argv exemptions, `memory_health`, and 20/20 dist-freshness tests, while the packet timeline explicitly says several live-measurement gates apply only when the daemon next leases up because the daemon socket was down. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness/implementation-summary.md:85] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness/implementation-summary.md:107] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness/implementation-summary.md:120] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/timeline.md:548]

## Ruled Out

- Treating all stress-suite mentions as product-behavior validation: the substrate stress-harness cleanup phase is explicitly no served-behavior change and validates harness cleanup mechanics. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup/implementation-summary.md:56]
- Treating embedder-degrade as an uncovered manual-playbook gap: scenario 450 exists, is indexed, and names implementation/test anchors. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3876]

## Dead Ends

- A manual-playbook search for post-016 live-measurement caveat strings such as `sub-800ms`, `sub-6KB`, and `daemon-side` did not yield a matching scenario for the daemon-lease-gated measurements, so the next iteration should inspect command/README surfaces or post-016 phase READMEs rather than repeat manual-playbook grep. [INFERENCE: targeted manual_testing_playbook grep for those caveat terms returned no direct scenario]

## Edge Cases

- Ambiguous input: “stress-test and validation surfaces” could mean automated tests, manual playbook scenarios, stress harnesses, or packet summaries. This iteration sampled all four, then narrowed claims to observed gaps.
- Contradictory evidence: The manual playbook root says scenarios 450-453 are current high-water entries while the table includes 454 and 455; this is an internal index/prose conflict, not a missing file. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:194] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3881]
- Missing dependencies: Code graph remains stale; direct file evidence and targeted grep were used.
- Partial success: This answered stress/playbook alignment for sampled post-028 surfaces, but did not execute stress suites or audit every post-016 phase.

## Sources Consulted

- .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:193
- .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3876
- .opencode/skills/system-spec-kit/manual_testing_playbook/bug-fixes-and-data-integrity/graceful-embedder-degrade-to-lexical.md:11
- .opencode/specs/system-speckit/029-memory-search-intelligence/timeline.md:524
- .opencode/specs/system-speckit/029-memory-search-intelligence/timeline.md:548
- .opencode/specs/system-speckit/029-memory-search-intelligence/before-vs-after.md:253
- .opencode/skills/system-spec-kit/mcp_server/tests/token-budget-constitutional-sync.vitest.ts:240
- .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup/implementation-summary.md:56
- .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness/implementation-summary.md:85

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which manual testing playbooks and stress tests describe outdated or missing behavior?
  - Where do docs claim coverage that tests or stress cases do not fully support?
  - Where does implemented behavior lack corresponding playbook or stress-test coverage?
- Questions answered:
  - The manual playbook root index has an internal high-water/count staleness conflict.
  - Embedder-degrade has a direct manual scenario with implementation/test anchors.
  - Live under-surfacing has code regression coverage but lacks a named manual scenario in the inspected playbook surface.
  - Some post-016 daemon-side live measurements remain documented caveats rather than replayed manual/stress validations.

## Reflection

- What worked and why: Cross-reading packet summaries, manual playbook root/index rows, a concrete manual scenario, and a runtime regression test separated real coverage from stale index prose.
- What did not work and why: Broad stress grep returned many unrelated daemon/CLI scenarios; targeted terms around the latest post-016 caveats produced sharper negative evidence.
- What I would do differently: Next iteration should inspect feature-catalog and README surfaces for post-016 memory-search repairs, especially whether corpus-healing, active-row predicates, score-scale unification, and entity-linker down-weighting are documented outside phase summaries.

## Recommended Next Focus

Audit feature-catalog and README coverage for the post-016 memory-search repair program: corpus identity repair, archived/tombstone exclusions, embedding coverage, trigger-quality guards, rescue authority, score-scale unification, and entity-linker noise reduction.
