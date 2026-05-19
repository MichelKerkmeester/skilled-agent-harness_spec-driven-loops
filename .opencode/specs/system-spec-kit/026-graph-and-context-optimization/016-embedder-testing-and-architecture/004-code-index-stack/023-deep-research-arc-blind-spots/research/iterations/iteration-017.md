# Iteration 017 - Build-vs-buy and upstream import [PASS-2]

## Pass 1 claim under attack
- NEW blind spot - orthogonal to Pass 1: upstream `cocoindex-code` and core `cocoindex` may have shipped patterns that obsolete or reshape local fork work.

## Hypotheses going in
- H1: Upstream drift is low if local fork is close to current and the relevant features are local-only.
- H2: Upstream drift is a latent risk if upstream has moved many releases ahead with embedder parameterization, stable core releases, and language support changes.

## Evidence gathered
- Local evidence: `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:9-13` declares `cocoindex-code` version `0.2.3+spec-kit-fork.0.2.0`; `:29` pins `cocoindex[litellm]==1.0.0a33`.
- Local evidence: `.opencode/skills/mcp-coco-index/NOTICE:1-8` says upstream forked version is `0.2.3`; `:16-24` lists local REQ-001..006 patches.
- GitHub API command output for `cocoindex-io/cocoindex-code`:
  - `v0.2.33`, published `2026-05-08`, `perf(cli): lazy-load server, pathspec, and protocol imports`.
  - `v0.2.32`, published `2026-05-05`, `feat: add Svelte and Vue support`.
  - `v0.2.30`, published `2026-04-25`, `refactor(embedder-params): drop dimensions knob; pass indexing kwargs into LiteLLM ctor`.
  - `v0.2.29`, published `2026-04-24`, `feat: configurable embedder indexing_params/query_params + curated defaults`.
  - `v0.2.28`, published `2026-04-22`, `chore: upgrade to cocoindex 1.0.0 stable`.
- GitHub API command output for `cocoindex-io/cocoindex`: `v1.0.6` published `2026-05-18`, with splitter, telemetry, and error-context changes; `v1.0.0` published `2026-04-22`.
- External evidence: upstream `cocoindex-code` README says latest releases are around `v0.2.32/0.2.33` and the project is Apache-2.0: `https://github.com/cocoindex-io/cocoindex-code`.

## Pass-1 attack outcome
- [ORTHOGONAL]: Pass 1 largely ignored fork currency. Upstream drift is a new risk class: local code may be solving problems already addressed upstream, while missing upstream fixes.

## Findings (severity-tagged)
- **FINDING-017-A** [severity: HIGH-LATENT-RISK] [Pass-1 relation: ORTHOGONAL]:
  - **What**: The local fork is roughly 30 upstream `cocoindex-code` releases behind (`0.2.3` fork base versus upstream `0.2.33`) while core CocoIndex moved from a local alpha pin (`1.0.0a33`) to stable `1.0.x`.
  - **Why Pass 1 / deep-review missed this**: The 013-018 arc optimized and reviewed local fork behavior, not upstream merge debt.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:9-13`, `:29`; `.opencode/skills/mcp-coco-index/NOTICE:1-8`; GitHub API command output above.
  - **What to do**: Add packet 023F: upstream rebase/import plan before large local architecture changes.

- **FINDING-017-B** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#3]:
  - **What**: Upstream already added configurable embedder `indexing_params` and `query_params` after the fork point. That is directly relevant to prompt-policy metadata.
  - **Why Pass 1 / deep-review missed this**: Pass 1 inferred a local architecture from local files and did not inspect upstream release notes since the fork.
  - **Evidence**: GitHub API command output for `v0.2.29`; local `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60` and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:314-329`.
  - **What to do**: Before designing `EmbedderPromptPolicy` from scratch, inspect upstream PR #150 and import/adapt its parameter model if compatible.

- **FINDING-017-C** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#1]:
  - **What**: Upstream `v0.2.30` dropped a dimensions knob. This may mean upstream chose provider-specific params over a generic dimension override, which should inform local dimension-flex design.
  - **Why Pass 1 / deep-review missed this**: It assumed dimension-flex means local schema/table changes only.
  - **Evidence**: GitHub API command output for `v0.2.30`; local registry non-768 count from iteration 011.
  - **What to do**: Treat dimension options as model/provider metadata, not a universal user knob.

- **FINDING-017-D** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: Upstream language support moved forward (Svelte/Vue), while the local test fixture remains dominated by the existing Python/TS/JS shapes.
  - **Why Pass 1 / deep-review missed this**: The fixture audit checked local surface, not upstream language roadmap.
  - **Evidence**: GitHub API command output for `v0.2.32`; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:136-149`.
  - **What to do**: If upstream rebase lands, expand language fixture at the same time.

## Hypotheses that FAILED falsification (valuable!)
- "Local fork is current enough that upstream cannot change recommendations" failed.
- "Prompt-policy design must be invented locally" failed provisionally; upstream release notes suggest a candidate pattern exists.

## Updates to research-pass-2.md
- Added upstream-drift section and new 023F upstream rebase packet candidate.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

