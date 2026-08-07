# Iteration 1: Q1 Install Guide Sweep

## Focus

Q1 install guides: inventory every `.opencode/skills/**/INSTALL_GUIDE.md`, sweep for removed CocoIndex/`ccc`/daemon/`.venv`/`.cocoindex_code` references and removed reranker/cross-encoder/sidecar install guidance, then classify each hit as STALE-LIVE, HISTORICAL/OK, or CORRECT.

## Actions Taken

1. Inventoried install guides with `rg --files -g 'INSTALL_GUIDE.md' .opencode/skills`.
2. Grepped all five guides for `cocoindex`, `ccc`, `coco-daemon`, `.venv`, `.cocoindex_code`, `cross-encoder`, `CodeRankEmbed`, `rerank`, `sidecar`, `RERANKER_LOCAL`, `SPECKIT_CROSS_ENCODER`, and `Voyage.*rerank`.
3. Read every hit in context and cross-checked the current Spec Kit Memory rerank implementation where the install guide claimed cross-encoder behavior.
4. Confirmed no hits in the Chrome DevTools, Code Mode, and System Code Graph install guides.

Install guide inventory:

- `.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md`
- `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md`
- `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md`
- `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`

## Findings

> One finding per top-level bullet (reducer counts each `- ` line in this section as a distinct finding). Severity + classification are bracketed at the start; evidence is inline.

- **[P1 / STALE-LIVE]** `system-spec-kit/mcp_server/INSTALL_GUIDE.md:718-720` — live feature section `### Cross-Encoder Reranking` still states "Cross-encoder reranking is enabled by default... second-pass scoring over the top-K candidates." Current `lib/search/pipeline/stage3-rerank.ts:109-116` removed model-based cross-encoder/local-GGUF reranking (comment "(removed) model-based cross-encoder reranking", `const rerankApplied = false`, `const rerankProvider = 'none'`). An operator trusting the guide would believe a removed feature is active by default. **Fix target.**
- **[INFO / CORRECT]** `system-spec-kit/mcp_server/INSTALL_GUIDE.md:93-94` — architecture diagram's generic "Graph-aware reranking" is NOT stale: Stage 3 still performs algorithmic MMR diversity reranking (`stage3-rerank.ts:94`). Only the cross-encoder/default claim above is the miss; no edit needed here.
- **[INFO / HISTORICAL]** `system-spec-kit/mcp_server/INSTALL_GUIDE.md:1197` — `## VERSION HISTORY` row "v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default" is changelog-style history; keep as-is.
- **[INFO / CORRECT]** `system-skill-advisor/INSTALL_GUIDE.md:384,405` — the `sidecar` hit refers to the hf-local embedding Python sidecar (its own MPS/CUDA/CPU device-resolution chain), NOT the removed rerank sidecar; the guide instructs no removed-component install.
- **[INFO / CORRECT]** `system-code-graph/INSTALL_GUIDE.md:17,43,56,65-70` — aligned with native structural reality: identity `mk_code_index`, `MCP tools | 8`, runtime-standalone, explicitly "mk-spec-memory is NOT a prerequisite"; zero stale-pattern hits.
- **[INFO / CORRECT]** `mcp-chrome-devtools/INSTALL_GUIDE.md` + `mcp-code-mode/INSTALL_GUIDE.md` — install prompts cover only browser-debugger-cli / Code Mode + UTCP external MCP config; zero CocoIndex/ccc/reranker/sidecar hits.

## Ruled Out

- No `INSTALL_GUIDE.md` across the 5 swept guides tells operators to install or run CocoIndex, the `ccc` CLI, a coco-daemon, `.venv`, or `.cocoindex_code` — install-guide CocoIndex/ccc install residue is ruled out for this surface.

## Questions Answered

- Q1 is partially answered for the install-guide surface: five install guides exist; no guide tells operators to install CocoIndex, `ccc`, a coco daemon, `.venv`, or `.cocoindex_code`.
- Q1 found one live stale reranker miss: Spec Kit Memory still claims cross-encoder reranking is enabled by default.
- Q1 ruled out a likely false positive: Skill Advisor's `sidecar` mention is hf-local embedding device handling, not the removed rerank sidecar.

## Questions Remaining

- Q2: setup/launcher/hook/copy scripts still need the same stale-reference sweep.
- Q3: `/doctor` command routes and repair scripts still need auditing for removed coco/ccc/rerank checks.
- Q4: 116 deep-skill-evolution impact still needs a targeted sweep across install/scripts/doctor surfaces.
- Q5: cross-runtime consistency still needs checking after Q2-Q4 identify the live surfaces.

## Next Focus

Q2 scripts: sweep `.opencode/scripts/`, skill scripts, launcher scripts, hook installers, and copy/bridge scripts for CocoIndex/`ccc`/rerank-sidecar/`.venv`/`.cocoindex_code` setup or health-check residue.
