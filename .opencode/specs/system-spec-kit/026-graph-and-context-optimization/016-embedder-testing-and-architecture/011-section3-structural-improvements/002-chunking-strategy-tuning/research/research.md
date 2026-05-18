# Research Synthesis: 016/011/002 Chunking Strategy Tuning

> **Status**: DEFERRED — cli-devin daily quota exhausted before iter 5 could run (2026-05-18T05:18Z). Resume when quota refreshes.

## Question

What chunking strategy (size, overlap, semantic vs syntactic, code-aware splitters) maximizes hit-rate on the 18-pair fixture for our mixed TS/MD/Python corpus?

## State

3 iters were planned (5, 6, 7) covering:
- **iter 5** (current-chunker-analysis): read cocoindex_code chunker logic + settings.py, document current behavior, identify weaknesses
- **iter 6** (chunking-strategy-survey): literature survey of chunk-size sweeps, overlap, semantic vs syntactic chunking, code-aware splitters (tree-sitter, AST)
- **iter 7** (chunking-synthesis): synthesize 5-6 into concrete recommendation for our mixed corpus (TS 75% + MD 4% + Python 4% + JS 12%)

None of these executed due to cli-devin daily quota exhaustion (error: "Your daily usage quota has been exhausted").

## Next steps when resuming

1. Re-dispatch via cli-devin SWE-1.6 (verify quota refreshed)
2. Use the prompts at `/tmp/devin-research-011-{5,6,7}.md` (rebuild via `python3 /tmp/build-research-iters.py` if /tmp cleared)
3. Recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
4. Dispatch pattern: `devin -p --prompt-file /tmp/devin-research-011-N.md --agent-config <recipe> --permission-mode dangerous`
5. Extract via `python3 /tmp/extract-research-iters.py 5 6 7`

## Open questions (carry forward)

- Is the current CocoIndex chunker optimal for our 8,427-file / 127K-chunk corpus, or is there headroom?
- Tree-sitter integration cost vs lift
- Whether chunk_overlap matters for code (vs prose)
- Per-language chunk strategies (TS function-level vs MD section-level)
