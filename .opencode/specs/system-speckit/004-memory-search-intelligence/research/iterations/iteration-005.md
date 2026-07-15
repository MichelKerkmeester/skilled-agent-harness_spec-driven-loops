# Iteration 5: Runtime Formatter and Eval Handler Alignment

## Focus

This iteration investigated whether the command presentation gaps from iteration 4 are documentation-only gaps or runtime-output gaps by checking runtime formatter/eval handler code and code READMEs. The selected interpretation was narrow: inspect `/memory:search` envelope rendering, ablation formatted output, reporting-dashboard output, and adjacent code README coverage. Deferred alternatives include benchmark-index promotion flow and stress-test coverage.

## Findings

1. The search runtime does build the current `data.envelopeRender` fragment from the same `requestQuality` label and `citationPolicy` values that the command contract expects, so the envelope-render slot is not merely a command-template invention. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:473] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:486] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1360]
2. A stale runtime-adjacent comment remains in `search-results.ts`: it still describes the envelope fragment as “gated dark” and “Off by default,” while the current command contract says `SPECKIT_ENVELOPE_FIDELITY` is default-ON with opt-out values. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1350] [SOURCE: .opencode/commands/memory/search.md:78]
3. The ablation handler enables diagnostic snapshots for `eval_run_ablation`, returns the raw report, and includes `formatAblationReport()` when formatted output is requested; the ablation formatter itself has a visible `Corpus Diagnostic Lanes` section for gate verdict, calibration, and cold-lane metrics. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:408] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:431] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1674]
4. The reporting-dashboard text formatter remains a narrower runtime surface: it renders summary, metric rows, metric-channel rows, channel rows, and trends, but no corpus diagnostic lane section analogous to ablation formatted output. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:650] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:686] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:716]
5. Code README coverage is mixed: `lib/eval/README.md` documents gate verdict, calibration, cold-start diagnostics, and diagnostic snapshots, but `lib/search/README.md` key files focus on pipeline/vector/search modules and do not list the formatter surface that owns `requestQuality`, `citationPolicy`, or `envelopeRender`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/README.md:98] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/README.md:111] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:148]

## Ruled Out

- Treating `/memory:search` envelope rendering as presentation-only drift: runtime code confirms the ready-to-paste fragment is emitted when envelope fidelity is enabled. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1353]
- Treating ablation diagnostic metadata as absent from runtime formatted output: `formatAblationReport()` explicitly emits corpus diagnostic lanes when `report.corpusMetrics` is present. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1674]

## Dead Ends

- The dashboard runtime formatter did not resolve the diagnostic-display gap; it confirmed the gap is specific to dashboard/reporting output rather than ablation formatted output. Reducer should keep this as an open documentation/runtime-surface split, not mark the whole eval surface stale. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:650]

## Edge Cases

- Ambiguous input: The broad “runtime formatter/eval handler/code README” focus could include many eval/search modules; this iteration selected the narrow command-presentation follow-up from iteration 4 and deferred benchmark-index/runtime-stress audit.
- Contradictory evidence: Current command docs say envelope fidelity is default-ON, while an in-code formatter comment still says the fragment is “gated dark” and “Off by default.” Runtime code gates emission through `isEnvelopeFidelityEnabled()`, so the contradiction is between current contract/comment wording, not between formatter construction and command rendering. [SOURCE: .opencode/commands/memory/search.md:78] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1350]
- Missing dependencies: Code graph remains stale; direct file evidence was used instead.
- Partial success: The runtime slice answered the command-presentation follow-up, but benchmark/stress-test alignment remains uninspected in this iteration.

## Sources Consulted

- .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:473
- .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1350
- .opencode/commands/memory/search.md:78
- .opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:408
- .opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1594
- .opencode/skills/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:650
- .opencode/skills/system-spec-kit/mcp_server/lib/eval/README.md:98
- .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:148

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Where do docs claim coverage that tests, benchmarks, stress cases, or code no longer support?
  - Where does implemented behavior lack corresponding catalog, playbook, README, skill, benchmark, or stress-test coverage?
  - Which misalignments affect command routing, MCP/tool contracts, or memory retrieval output?
- Questions answered:
  - The `/memory:search` envelope-render command surface is backed by runtime formatter code.
  - The ablation formatted report includes corpus diagnostic lanes, but the reporting dashboard text formatter does not.
  - Eval README coverage is current for diagnostics, while search README coverage omits the formatter-owned envelope surface.

## Reflection

- What worked and why: Following iteration 4’s command-template gaps into runtime code separated true runtime-display gaps from stale presentation/documentation gaps.
- What did not work and why: The stale code graph could not be used for structural routing, so direct line-level reads were necessary.
- What I would do differently: Next iteration should switch away from envelope/eval presentation and inspect benchmark index/promotion flow against packet 028 corrected benchmark and phase-040 graduation evidence.

## Recommended Next Focus

Audit benchmark index, benchmark README, benchmark scripts, and promotion/graduation evidence against packet 028 corrected benchmark-status and phase-040 graduation notes to determine whether stale benchmark surfaces are docs-only or runtime/evidence-chain gaps.
