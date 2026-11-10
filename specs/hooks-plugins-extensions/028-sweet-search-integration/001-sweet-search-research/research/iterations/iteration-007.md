# Iteration 7: Independent Evidence and Built-in Agent Search

## Focus

Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.

This iteration asks only Q7. It does not reopen Q1–Q6 and does not re-derive the integration recommendation; it tests the usefulness premise against evidence produced by parties other than sweet-search.

## Actions Taken

- Read the required config, state projection, and strategy before selecting focus, then read iterations 2, 3, and 6 to reuse their evidence instead of repeating it.
- Read the current documented tool surfaces of Codex and OpenCode, and Anthropic's own published guidance on agentic versus semantic search.
- Collected independent measurements of semantic, structural, and symbol-level retrieval from Cursor, CodeRAG-Bench, a structural-index ablation paper, and a pilot LSP-versus-grep token study.
- Collected independent evidence on when lexical search was found sufficient: an Augment-built SWE-bench agent interview and a vendor index's own grep-versus-index comparison.
- No tool was installed, no agent benchmark was run, and no upstream source was modified. This matches the strategy's non-goal of re-benchmarking end to end.

## Findings

1. **The maker of Claude Code tried semantic indexing for code search, rejected it, and still recommends agentic search first.** Boris Cherny, who created Claude Code, states that early Claude versions indexed the codebase with Voyage embeddings, and that the team "eventually landed on just agentic search" because it "outperformed everything else by a lot", with index drift and the security liability of hosting the index as the other reasons. Anthropic's own Agent SDK guidance keeps that position: semantic search "is usually faster than agentic search, but less accurate, more difficult to maintain, and less transparent", and it recommends "starting with agentic search, and only adding semantic search if you need faster results or more variations". This undercuts any claim that adding an index is a general upgrade for the harness sweet-search benchmarks most heavily. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk] [SOURCE: https://officechai.com/ai/claude-researcher-explains-how-agentic-search-performed-better-than-rag-for-code-generation/]

2. **All three named agents already ship lexical search, and two of them ship symbol-level navigation; none ships a semantic index, so sweet-search's differentiator is hybrid ranking rather than search capability itself.** Codex bundles ripgrep as a first-class `rg` tool beside `glob_file_search`, and its separate `codex_file_search` crate does fuzzy filename matching over the `ignore` walker with `nucleo-matcher`. OpenCode documents `grep` (ripgrep-backed, regex or literal), `glob`, and an `lsp` tool exposing `goToDefinition`, `findReferences`, `workspaceSymbol`, and incoming/outgoing call hierarchy. Claude Code's documented design is agentic search over the filesystem with `grep` and similar tools. The practical consequence for Q7 is that sweet-search's `trace` and repo-map claims overlap functionality that OpenCode already exposes through LSP, while its genuinely additive capability is ranked semantic-plus-lexical retrieval over natural-language queries. [SOURCE: https://codex.danielvaughan.com/2026/06/03/codex-cli-built-in-tool-surface-complete-reference-shell-file-search-image-multi-agent/] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/file-search/README.md] [SOURCE: https://opencode.ai/docs/tools/] [SOURCE: https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/lsp.ts] [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk]

3. **Independent measurements support a real but conditional retrieval gain, concentrated where the codebase is large or lexically noisy; none of them reproduces sweet-search's magnitude.** Four separate sources point the same direction with different mechanisms: Cursor reports that its semantic search adds on average 12.5% accuracy (6.5%–23.5% depending on model) over grep alone, with the gain growing as the codebase grows, using an embedding model it trained on agent traces; CodeRAG-Bench shows dense retrieval clearly ahead of BM25 on repository-level retrieval (SWE-Bench-L 46.4–67.4 versus 43) while both sit near ceiling on function-level tasks; a structural-index ablation reports resolve moving from 41.9% to 50.4% and acc@5 from 44.3% to 84.5% with no per-cell cost penalty and lower cost per solve against an agentic-grep comparator; and a pilot LSP-versus-grep study finds the verdict flips with lexical noise, with ΔF1 of +0.000 on a clean TypeScript repo versus +0.246 on a noisy one, where the semantic tool was also 12% cheaper. The common value condition is a large tree plus a natural-language query whose identifier the asker does not know plus noisy vocabulary. That is the code surface of a large repository, not Skilled's markdown, skill, and spec trees. [SOURCE: https://cursor.com/blog/semsearch] [SOURCE: https://www.sota2.com/research/sota/retrieval-on-coderag-bench] [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417] [SOURCE: https://github.com/Poytr1/lsp-vs-grep-token-study]

4. **Independent evidence undercuts an accuracy thesis and supports only a cost or latency thesis, which is the shape sweet-search actually claims.** An Augment engineer building a top SWE-bench Verified agent reports that "for SweeBench tasks this was not the bottleneck — grep and find were sufficient", with embedding retrieval failing to add value because agent persistence compensated for simple tools. A vendor that sells a semantic index publishes its own comparison showing 92.0% correct answers with grep alone and 92.0% with its index installed, while the index cuts the tokens needed to reach the first right file from a median of 15,491 to 224 and raises top-10 file hit rate from 47.0% to 76.8%. That is accuracy parity with a large token-efficiency gain, and it matches the shape of sweet-search's own reported result (5–33% cheaper runs with no significant solve-rate change). The mechanism is therefore credible while the accuracy upside is not. The same pilot study also records the counter-case: on symbol-named localization the semantic tool cost tokens (+6% on one model, +118% on another), and on multi-file renames grep solved 100% of cases against 67% for a location-only semantic tool. [SOURCE: https://jxnl.co/writing/2025/09/11/why-grep-beat-embeddings-in-our-swe-bench-agent-lessons-from-augment/] [SOURCE: https://semlith.com/docs/guides/claude-code-grep-vs-semantic-search] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:16] [SOURCE: https://github.com/Poytr1/lsp-vs-grep-token-study]

5. **No independent party has measured sweet-search, and the closest analogues differ in exactly the two variables that drive the gain: embedding quality and index lifecycle.** Cursor's advantage comes from an embedding model trained on its own agent traces, not a generic local model, and its documented lifecycle is the cost side Anthropic named: the index syncs roughly every five minutes, semantic search is unavailable until at least 80% of indexing completes, and a large repository can take hours to first query. Sweet-search avoids the remote-hosting and privacy liability by keeping the index local, but it inherits the staleness and cold-start costs. **Inference:** the defensible reading of the independent record is that sweet-search's direction is plausible and its magnitude is unverified, and that its value is bounded by the same noise-and-scale condition that decides every other semantic retrieval tool. An independent measurement of sweet-search on a large noisy repository, compared with the built-in agent path on the same tasks, would confirm or refute this; nothing in the collected record substitutes for it. [SOURCE: https://cursor.com/blog/semsearch] [SOURCE: https://cursor.com/blog/secure-codebase-indexing] [SOURCE: https://cursor.com/help/customization/indexing.md] [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk]

## Questions Answered

- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.

## Questions Remaining

- Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)?
- Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?
- Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

## Ruled Out

- Treating Cursor's 12.5% accuracy figure as transferable to sweet-search. Cursor's gain is attributed to a custom embedding model trained on agent traces, so the number describes that model, not local embeddings in general. [SOURCE: https://cursor.com/blog/semsearch]
- Treating Anthropic's reversal as proof that no code index can help. The published reasons are maintenance, transparency, accuracy, and index-hosting liability for their own product; they do not measure third-party indexes against their harness. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk]
- Using the CodeRAG-Bench and structural-index results as direct support for sweet-search. Both evaluate retrieval or localisation components, not sweet-search's specific tool contract, and CodeRAG-Bench's repository slice is document retrieval for generation rather than agentic tool use. [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417]

## Dead Ends

- Searching for an independent third-party evaluation of sweet-search itself produced none; every quantitative claim about it still traces to its own checked-in eval data, consistent with iteration 2.
- The public evidence base on "semantic retrieval for coding agents" is dominated by vendors measuring their own product (Cursor, Zilliz's claude-context, Semlith) or by small pilots; there is no neutral, large-scale, cross-tool benchmark of the kind Q7 would ideally cite.

## Edge Cases

- Ambiguous input: "independent evidence" was read as evidence not produced by sweet-search's authors, which includes vendor measurements of other tools and third-party studies. Both were used, and vendor-authored numbers are labelled as such in each finding.
- Contradictory evidence: Anthropic reports agentic search beating its own RAG implementation while Cursor reports semantic search beating grep by 12.5%; the LSP pilot's noise-dependence result reconciles them, and the contradiction is preserved rather than collapsed. Resolution status: partially resolved as a condition, not as a single verdict.
- Missing dependencies: no neutral cross-tool benchmark of sweet-search exists to consult; the absence is recorded in Dead Ends and limits finding 5 to an inference.
- Partial success: built-in surfaces were confirmed from primary documentation for Codex and OpenCode, and from Anthropic's own design article for Claude Code rather than a fetched tool reference; the Claude Code tool list is therefore described at design level, not enumerated tool by tool.

## SCOPE VIOLATIONS

- `progressiveSynthesis` is true in config, but this dispatch allowlists only the iteration narrative, the delta, and append-gateway writes. `research/research.md` was not created or modified.

## Sources Consulted

- https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk
- https://officechai.com/ai/claude-researcher-explains-how-agentic-search-performed-better-than-rag-for-code-generation/
- https://codex.danielvaughan.com/2026/06/03/codex-cli-built-in-tool-surface-complete-reference-shell-file-search-image-multi-agent/
- https://github.com/openai/codex/blob/main/codex-rs/file-search/README.md
- https://opencode.ai/docs/tools/
- https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/lsp.ts
- https://cursor.com/blog/semsearch
- https://cursor.com/blog/secure-codebase-indexing
- https://cursor.com/help/customization/indexing.md
- https://code-rag-bench.github.io/
- https://www.sota2.com/research/sota/retrieval-on-coderag-bench
- https://arxiv.org/html/2606.22417
- https://github.com/Poytr1/lsp-vs-grep-token-study
- https://jxnl.co/writing/2025/09/11/why-grep-beat-embeddings-in-our-swe-bench-agent-lessons-from-augment/
- https://semlith.com/docs/guides/claude-code-grep-vs-semantic-search
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-003.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md

## Assessment

- New information ratio: 0.80. Three fully new findings (Anthropic's documented position, the built-in tool surfaces, the independent measurement set) and two partially new ones (the cost-versus-accuracy split and the sweet-search-specific measurement gap) that extend iteration 2's eval analysis and iteration 6's countertest with external sources.
- Questions addressed: Q7.
- Questions answered: Q7.

## Reflection

- What worked and why: reading the agent makers' own documentation and design articles exposed the built-in baseline directly, and searching for measurement studies rather than product pages surfaced the noise-dependence result that reconciles the conflicting vendor claims.
- What did not work and why: there is no neutral third-party evaluation of sweet-search, so the iteration can bound the plausibility of its claims but cannot confirm its numbers; every magnitude still traces back to its own eval.
- What I would do differently: for the phase-2 design question, treat the noise-and-scale condition as the acceptance test rather than the cost percentage, because the independent record says the gain appears there and is absent elsewhere.

## Recommended Next Focus

Q8: External-repo UX walkthrough, including absent, half-installed, stale, and unsupported-platform states.

**Status: complete.** Q7 is answered with external evidence. The verdict for the integration question is unchanged in direction and now better bounded: independent evidence supports a conditional retrieval gain on large, lexically noisy codebases, does not confirm sweet-search's magnitude, and shows the accuracy upside is near zero.
