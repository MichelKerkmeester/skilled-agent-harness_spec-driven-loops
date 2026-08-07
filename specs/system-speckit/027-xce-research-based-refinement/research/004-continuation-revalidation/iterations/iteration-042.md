# Iteration 042 — XCE Signal and Noise

## Focus
Reread `external/xce-mcp` and classify portable local ideas versus non-portable SaaS, marketing, benchmark, and PRAT claims.

## Findings
1. Portable local idea: architecture-context packaging is useful as a pattern, not a dependency. XCE publicly exposes HLD, LLD, component descriptions, relationships, and call-graph-style context; local Spec Kit can adapt that as structured context assembly for memory/spec surfaces. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:22-29] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:201-208]
2. Portable local idea: semantic search is the transferable signal for 027's hybrid trigger work, but only as a bounded fallback because XCE's public docs describe semantic retrieval by meaning without exposing local precision controls. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:24-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:192-199]
3. Portable local idea with guardrails: pre-change impact analysis is valuable, but XCE's public shape is high-level affected modules, downstream dependencies, and risk assessment; local adoption should use existing graph/memory evidence and avoid pretending to have XCE's closed server internals. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:220-227] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245]
4. Non-portable noise: SaaS dependency and pricing are not adoption candidates for 027. XCE setup requires an API key, remote SSE endpoint, dashboard, hosted server, query quotas, and paid plans, while the continuation strategy explicitly excludes XCE SaaS adoption. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:51-61] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:70-97] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:262-271] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:7-12]
5. Non-portable/noisy claim: benchmark and PRAT statements are directional only. XCE reports SWE-bench gains and names PRAT, but the public README gives no reproducible PRAT algorithm or benchmark harness details; use these as inspiration for local evaluation questions, not as implementation requirements. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:31-48] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245]
6. Non-portable steering as written: XCE's steering files say to always call XCE before reading files and prefer it over grep, but local Spec Kit should adapt the first-action heuristic dynamically rather than copying unconditional vendor-first instructions. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:101-120] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/steering/opencode-prompt.txt:1-4] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/steering/CLAUDE.md:5-12]

## Ruled Out
- Direct SaaS integration was ruled out because the README requires hosted `https://mcp.xanther.ai/sse` plus bearer auth and the strategy says no XCE SaaS adoption. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:70-97] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:10]
- Copying PRAT internals was ruled out because the public corpus names PRAT but exposes only a high-level diagram and four-step flow. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245]

## Edge Cases
- Ambiguous input: “XCE signal” can mean tool UX, algorithm, benchmarks, or SaaS; this iteration narrowed it to portable local design lessons for 027.
- Contradictory evidence: none; public XCE claims are broad but not internally contradictory.
- Missing dependencies: no web fetch was necessary because the local `external/xce-mcp` corpus contains the relevant public surface.
- Partial success: complete for classification; source-level verification of Xanther CLI internals is unavailable in this corpus.

## Sources Consulted
- specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:20-48
- specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:51-120
- specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:190-245
- specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:262-283
- specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/steering/opencode-prompt.txt:1-4
- specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/steering/CLAUDE.md:5-12
- specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:7-12

## Assessment with `newInfoRatio`
newInfoRatio: 0.75. The local reread confirms three portable patterns and three non-portable boundaries. The highest-value portable ideas are structured context packaging, semantic fallback retrieval, and impact preflight; the highest-risk noise is SaaS dependence, unreproducible benchmark claims, and opaque PRAT internals.

## Recommended Next Focus
Move to iteration 043 peck T3/T4/T2 with the drift fixes in mind: cite current `001-peck-teachings-adoption` paths and avoid importing XCE SaaS or unconditional steering assumptions into peck-derived Spec Kit process work.
