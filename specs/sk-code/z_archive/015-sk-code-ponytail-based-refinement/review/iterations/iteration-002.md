# Review Iteration 2 — seat rv-2 (openai/gpt-5.5-fast, variant high)

- Dimension: mirror-normalizer-and-context-fix
- Status: complete | exit=0 | duration=132s | P0=0 P1=1 P2=0
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only)

## Seat output

P1 finding: normalizer is not conservative.

- `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs:84` replaces every bare `.md`, `.toml`, or `.mdc` extension anywhere in body text, not only runtime mirror self-references.
- `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs:91-109` then tokenizes normalized text and treats equal token sets as in sync.
- Concrete missed drift: canonical body `Use config.md for docs` vs mirror body `Use config.toml for docs` now returns `matches: true` with zero missing/unexpected tokens. That is real body drift if the instruction is format-specific.
- The ordering comment is correct: path rules run first at `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs:71-74`, then extension collapsing at line 84. It matters because reversing them would break the literal-extension path matches.
- The parenthetical rule at `.opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs:79` is bounded to the first `)`. It can span newlines because `[^)]` includes newline, but it is anchored to a very specific parenthetical prefix. I do not see this as the primary over-mask risk.
- Context fix is exact: `.codex/agents/context.toml:62-63` matches canonical `.opencode/agents/context.md:76-77` for the restored `code_graph_query plus Grep` row and following `memory_match_triggers` row.
- Verification ran: `node .opencode/skills/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` -> `agent-mirror-sync: 12 agent(s) checked - all mirrors in sync - OK`.

```json
{"seat":"rv-2","dimension":"mirror-normalizer-and-context-fix","findings":[{"id":"F1","severity":"P1","title":"Extension normalizer masks real format-specific body drift","file":".opencode/skills/deep-improvement/scripts/lib/mirror-sync-verify.cjs","line":"84","evidence":"The new regex collapses every bare .md/.toml/.mdc mention before token comparison; compareBodyTokens then compares only normalized token sets, so `Use config.md for docs` and `Use config.toml for docs` now match with zero missing/unexpected tokens.","recommendation":"Limit extension normalization to known runtime self-reference patterns, or preserve filename+extension tokens outside mirror path/self-description clauses."}],"severityCounts":{"P0":0,"P1":1,"P2":0},"newInfoRatio":0.2}
```