Deep-research iter 9/10 cross-validation pass for packet 027.

ITER 9 FOCUS: IRQ9 — LLM-enrichment dispatch shape (Phase 003 P1).

READ FIRST:
- 027/003-code-graph-impact-analysis/spec.md (P1 REQ-007 enrichWithLLM=true flag + Phase 6 of plan.md "Optional LLM enrichment")
- .opencode/skills/cli-opencode/SKILL.md (full file — provider list, default invocation, ALWAYS rule 5 stdin handling)
- .opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md (097 fix context)
- .opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md (existing 2-fix CHANGELOG)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-005.md (subprocess reliability findings — same dispatch path)
- 027/research/findings.md SKIP-2 (mcp.xanther.ai SaaS hosting — what we explicitly REJECTED) and SKIP-3 (centralized xanther.ai dependency)

QUESTION: Phase 003 P1 REQ-007 says "optional `enrichWithLLM: true` flag triggers LLM narrative." Where does the LLM call go, and how do we prevent SaaS dependency leakage?
- Local-first dispatch options:
  1. cli-opencode subprocess (consistent with rest of stack; uses 097's </dev/null fix; same provider auth chain)
  2. Direct provider API (deepseek-direct, openai-direct) — bypasses cli-opencode but adds bespoke auth + retry
  3. The mcp_server's existing LLM client if any (probably none — the MCP server is data-layer, not LLM-layer)
- cli-opencode default provider per memory `feedback_opencode_provider_fallback` is `opencode-go` gateway. opencode-go ROUTES to providers, but is itself a SaaS gateway. Is `opencode-go` SaaS?
- Direct `deepseek/deepseek-v4-pro` model name (per 097 fix discoveries) bypasses opencode-go and goes to DeepSeek's own API. That's still SaaS (DeepSeek is a hosted service), just not opencode-go's hosted gateway.
- TRUE local-first: only `node-llama-cpp` (which is in `optionalDependencies` of mcp_server/package.json — read it) plus `@huggingface/transformers` (already a hard dep). Both run model inference locally. Latency would be much higher than gpt-5.5 / deepseek but completely SaaS-free.
- For Phase 003 enrichWithLLM, what's the right default?
  - Option A: cli-opencode subprocess via opencode-go gateway → SaaS dependency through gateway
  - Option B: cli-opencode subprocess via deepseek/* direct → SaaS dependency to DeepSeek
  - Option C: Local llama-cpp via @huggingface/transformers → local-first, slower
  - Option D: No default; user MUST explicitly configure provider; spec just defines the contract
- The 027 findings.md SKIP-2 explicitly REJECTS SaaS hosting model. Does Option A/B contradict this rejection? Or is "SaaS" only about endpoint dependency, and per-task LLM calls to provider APIs are different?
- Auth: each enrichWithLLM call needs an auth context. Where does it live? `~/.local/share/opencode/auth.json` (per cli-opencode) is shared across processes, but Phase 003's MCP server runs in-process to opencode, so reaching it requires file IO or env vars.
- Cost concern: if each impact analysis call triggers LLM enrichment, and a session calls impact 100x, that's 100 LLM calls. Need rate-limiting or opt-in-only.

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-009.md` (Focus, Actions with file:line, Findings with verdicts, Q-Answered, Q-Remaining, Next Focus = IRQ10)
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ9"}
3. WRITE `pt-02/deltas/iter-009.jsonl` (1 iter record + ≥3 finding records)

CONSTRAINTS: LEAF, ≤12 tools, READ-ONLY 027/* + skills/cli-opencode/, WRITE pt-02/ ONLY, file:line cites required.

NEXT: IRQ10 — Phasing-order optimization (recommended order 004 → 001 → {002,003} parallel → 005; hidden coupling? Does 003 actually need 001's HLD layer info?).
