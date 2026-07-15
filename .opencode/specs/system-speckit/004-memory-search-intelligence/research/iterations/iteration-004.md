# Iteration 4: Command presentation alignment for `/memory:search` envelope and eval outputs

## Focus
This iteration broadened from manual playbook coverage into command-facing presentation assets. I audited `/memory:search` router and `search_presentation.txt` against packet-028 envelope-fidelity and benchmark-status evidence, focusing on `requestQuality`, `citationPolicy`, `data.envelopeRender`, ablation, and dashboard rendering.

## Findings
1. `/memory:search` command docs and `search_presentation.txt` are aligned with the current default-on envelope-fidelity contract: both say `requestQuality` and `citationPolicy` are conditionally mandatory when present, and both instruct renderers to paste `data.envelopeRender` verbatim when the tool ships it. [SOURCE: .opencode/commands/memory/search.md:76] [SOURCE: .opencode/commands/memory/search.md:78] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:102] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:117]
2. There is a cross-spec historical mismatch around the envelope-fidelity flag name and default. The phase-027 implementation summary says the feature shipped behind default-OFF `SPECKIT_ENVELOPE_FIDELITY_V1` and required a clean grandfather report before default-on graduation; current `/memory:search` docs and presentation asset say `SPECKIT_ENVELOPE_FIDELITY` is default-ON and can be opted out with `false`, `0`, or `off`. The current docs may reflect a later graduation, but the implementation-summary continuity still points at the old flag/default, so readers following the phase summary can be misled. [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement/implementation-summary.md:57] [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement/implementation-summary.md:65] [SOURCE: .opencode/commands/memory/search.md:78] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:117]
3. The command-level ablation and dashboard render templates are now too shallow for packet-028 benchmark evidence. `search_presentation.txt` renders ablation as generic Recall@K channel deltas including a `trigger` row, while packet 028 says the corrected driver dropped the trigger-noise row and distinguished production default-routing per-flag results from forced all-channel ablation. [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:297] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:304] [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/benchmark-status.md:20] [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/benchmark-status.md:42]
4. `/memory:search` router text does include newer diagnostic baseline concepts for ablation/dashboard (`diagnostic snapshots`, `gate-verdict`, `calibration`, and `cold-lane payload`), but the presentation asset's visible dashboard template only shows sprint trends and channel performance. That creates a presentation gap: the router promises diagnostic baseline metadata that the render template has no slot for. [SOURCE: .opencode/commands/memory/search.md:115] [SOURCE: .opencode/commands/memory/search.md:120] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:310] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:315]
5. The MCP memory trigger context call timed out this iteration, so I relied on direct file evidence. This did not block the command-presentation audit because all required sources were packet-local or command-local files. [INFERENCE: based on the memory_match_triggers timeout result and subsequent Read/Grep file evidence]

## Ruled Out
- Treating `/memory:search` as stale for envelope rendering was ruled out: the command and presentation asset both include the required-when-present and `data.envelopeRender` language. [SOURCE: .opencode/commands/memory/search.md:146] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:117]
- Treating generic ablation display as sufficient for packet 028 was ruled out because packet 028 requires corrected-driver distinctions that the display template cannot show. [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/benchmark-status.md:51]

## Dead Ends
- MCP memory trigger retrieval timed out and was not retried; direct file reads were the narrower, in-scope fallback for this iteration.

## Edge Cases
- Ambiguous input: Command presentation assets include router markdown, presentation txt, README summaries, and formatter code. I selected router markdown plus presentation asset first because iteration 3's next focus named command-visible render slots.
- Contradictory evidence: Phase-027 implementation summary names `SPECKIT_ENVELOPE_FIDELITY_V1` default-OFF, while current command docs use `SPECKIT_ENVELOPE_FIDELITY` default-ON. I preserved both claims and treated this as historical/current documentation drift needing reconciliation.
- Missing dependencies: `memory_match_triggers` timed out. Direct Grep/Read evidence was sufficient.
- Partial success: This pass did not inspect formatter code or eval handlers; it focused on command/presentation contracts.

## Sources Consulted
- `.opencode/commands/memory/search.md:76`
- `.opencode/commands/memory/search.md:115`
- `.opencode/commands/memory/assets/search_presentation.txt:102`
- `.opencode/commands/memory/assets/search_presentation.txt:297`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement/implementation-summary.md:57`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/benchmark-status.md:20`

## Assessment
- New information ratio: 1.0
- Questions addressed:
  - Which command surfaces describe outdated or missing behavior?
  - Where do docs claim coverage that command presentations do not render?
  - Which gaps affect MCP/tool contracts and memory retrieval output?
- Questions answered:
  - `/memory:search` is current for envelope-fidelity render slots but conflicts with older phase-027 continuity about flag name/default.
  - Ablation/dashboard presentation remains too generic for packet-028 corrected benchmark and diagnostic metadata evidence.

## Reflection
- What worked and why: Reading the command router and presentation asset together exposed both alignment (envelope render slots) and gaps (eval/diagnostic display depth).
- What did not work and why: Memory context retrieval timed out; it added no evidence and direct file sources were better for this command-contract slice.
- What I would do differently: Next iteration should inspect formatter and eval handler code/README surfaces to decide whether the presentation gaps are docs-only or also runtime-output gaps.

## Recommended Next Focus
Audit `mcp_server/formatters/search-results.ts`, eval-reporting handlers, and related code READMEs for runtime support of `data.envelopeRender`, requestQuality/citationPolicy preservation, ablation diagnostic snapshots, and dashboard diagnostic metadata.
