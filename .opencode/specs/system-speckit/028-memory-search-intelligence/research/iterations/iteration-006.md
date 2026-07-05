# Iteration 6: Benchmark Index and Promotion Flow Alignment

## Focus

This iteration broadened from runtime formatter/eval presentation into benchmark index and promotion-flow alignment. It investigated whether packet 028 corrected benchmark evidence, phase-040 graduation evidence, and skill-local benchmark indexes tell a consistent story. The narrow selected focus was benchmark documentation and harness evidence, not running benchmarks or changing any benchmark asset.

## Findings

1. The skill-local benchmark README active table is stale even within the benchmark folder it indexes: it lists only May 17 and May 20 rows, while a checked-in May 21 MPS benchmark report exists and records a HOLD verdict. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:45] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md:1] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md:47]
2. Packet 028's corrected criterion-4 retrieval benchmark has no corresponding skill-local benchmark row: root `benchmark-status.md` records a corrected driver re-run, default-route per-flag Recall@20 deltas, and a trigger-noise row dropped from channel ablation, while the skill-local index remains May-only. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:20] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:29] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:42] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42]
3. The live eval script now matches the corrected benchmark narrative: per-flag search options intentionally omit `forceAllChannels`, and channel ablation intentionally keeps `forceAllChannels: true` while filtering out the un-ablatable `trigger` lane. This means the main corrected-driver gap is documentation/index promotion, not a script-code mismatch in the inspected driver. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:96] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:104] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:121] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:138]
4. Phase 040's benchmark evidence is phase-local rather than skill-local: the implementation summary says the harness and raw report live under the phase folder and explicitly deviated from writing verdicts to `benchmark-status.md` / `keep-off-flag-roadmap.md`; later root `benchmark-status.md` absorbed a section for those results. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/implementation-summary.md:84] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/implementation-summary.md:101] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:232]
5. Root `benchmark-status.md` carries an internal stale-context contradiction: Track C still says the data-quality program is research-only, scaffolded, not measured, and with no code landed, but a later section says the `005-spec-data-quality` build landed thirteen real switches and phase 040 ran measured graduation verdicts. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:112] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:114] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:232] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:243]

## Ruled Out

- Runtime driver mismatch as the primary cause of corrected benchmark drift: the current `run-retrieval-flag-eval.mjs` comments and option builders encode the corrected default-route and trigger-drop behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:104]
- Treating phase-040 benchmark evidence as absent: the phase folder has `benchmark-results.md` and the root status has a later phase-040 section; the gap is promotion/index consistency and stale earlier context. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md:14] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:232]

## Dead Ends

- The skill-local benchmarks README did not provide a complete promotion ledger for either post-May skill-local benchmark folders or packet-028 corrected/graduation benchmarks, so it cannot be used as the sole benchmark index for this audit slice. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42]

## Edge Cases

- Ambiguous input: “benchmark index/promotion flow” could mean the skill-local benchmark folder, packet-root status, phase-local benchmark artifacts, or eval scripts. This iteration selected all four narrowly enough to answer whether the gap was docs-only or code/harness-related.
- Contradictory evidence: root `benchmark-status.md` both says Track C is proposed/not run and later says 005 data-quality built thirteen switches and ran phase-040 measured verdicts. The later phase-040 section is better supported by phase-local implementation summary and benchmark-results evidence, but the earlier Track-C section remains stale. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:112] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/implementation-summary.md:56]
- Missing dependencies: Code graph remains unavailable/stale; direct file evidence was used.
- Partial success: The benchmark index and corrected-driver slice was answered; stress-test and broader benchmark-folder validation remain for later iterations.

## Sources Consulted

- .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42
- .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-21-spec-memory-mps/benchmark_report.md:1
- .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:20
- .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:112
- .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:232
- .opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-retrieval-flag-eval.mjs:96
- .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/implementation-summary.md:56
- .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md:14

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which benchmarks and stress tests describe outdated or missing behavior?
  - Where do docs claim coverage that benchmark evidence no longer supports?
  - Where does implemented behavior lack corresponding benchmark or README coverage?
- Questions answered:
  - The skill-local benchmark README is stale as an index and does not capture post-May benchmark folders or packet-028 benchmark evidence.
  - The corrected retrieval flag eval script aligns with the corrected benchmark narrative in the inspected areas.
  - Root benchmark-status has an internal stale-context contradiction around the data-quality Track C / phase-040 measured verdict state.

## Reflection

- What worked and why: Comparing packet-root status, phase-local benchmark results, the skill-local benchmark README, and the actual eval driver separated stale promotion/index docs from runtime script behavior.
- What did not work and why: The broad glob of implementation summaries produced too much noise; targeted reads of phase 040 and benchmark-status were more useful.
- What I would do differently: Next iteration should move from benchmark indexes to stress-test/playbook validation surfaces, especially whether post-028 live fixes and daemon-side caveats have corresponding stress coverage.

## Recommended Next Focus

Audit stress-test and validation surfaces for memory-search post-028 behavior: embedder-degrade recall flood, daemon freshness/health truthfulness, search under-surfacing fixes, and whether stress suites/manual playbook indexes reflect those later implementation realities.
