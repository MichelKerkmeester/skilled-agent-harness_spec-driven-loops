# Iteration 018 - Time-machine undocumented decisions [PASS-2]

## Pass 1 claim under attack
- NEW blind spot - orthogonal to Pass 1: commit history may contain implicit design decisions not captured as ADRs or packet-level rationale.

## Hypotheses going in
- H1: The git history cleanly maps every major code-level decision to a documented packet.
- H2: Rapid default churn, remediation commits, and benchmark-driven flips left decision gaps that should become ADRs.

## Evidence gathered
- Git command: `git log --all --reverse --pretty='%h %ci %s' -- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`.
- Relevant commit sequence:
  - `8f909d2299 2026-05-17 feat(coco-index): jina-code default + Metal auto-detect (018/001)`.
  - `49e3338ffa 2026-05-17 feat(coco-index): registered_embedders + INSTALL_GUIDE/README onboarding (019)`.
  - `93ba0ed8e8 2026-05-18 feat(011/003): hybrid search - SQLite FTS5 + RRF fusion, opt-in`.
  - `5b14be4daf 2026-05-18 feat(011/001): reranker - GTE cross-encoder inline opt-in`.
  - `4ec84cec26 2026-05-18 feat(004): promote COCOINDEX_HYBRID + COCOINDEX_RERANK to default-on`.
  - `c6a6493e6c 2026-05-18 fix(004): swap reranker default GTE->BGE - GTE broken on Apple Silicon MPS`.
  - `453ac5747f 2026-05-19 feat(016/004/011): Phase 2 reranker bench - Track A (BGE+path-class) + Track B (jina-v3 throwaway)`.
  - `d32e5a3b6b 2026-05-19 fix(016/004/011): rewrite jina-v3 throwaway adapter to use native rerank() API`.
  - `ee788254d1 2026-05-19 feat(016/004/017): RRF empirical recalibration - fusion is a no-op, lock latency-optimum`.
  - `38d4e2d627 2026-05-19 feat(016/004/018): rerank matrix - jina-v3 locked as production default, arc closed`.
  - `8364bdd5b7 2026-05-19 feat(016/004): promote nomic-ai/CodeRankEmbed as production embedder default`.
  - `7eba2a4535 2026-05-19 fix(016/004/020): remediate all 9 P1 findings from 019 deep-review`.
  - `5060f6f031 2026-05-19 fix(016/004/020): P2 remediation - 31/31 findings across 9 batches`.
- Local decision-record evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/decision-record.md:22-24` references ADR-020 RRF defaults and ADR-022 scaled boosts, but not a single consolidated "model governance/default churn" ADR.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:52-71` narrates the pipeline arc and default swaps.

## Pass-1 attack outcome
- [ORTHOGONAL]: Pass 1 assessed final-state risks. Time-machine analysis shows a process risk: several decisions were made under rapid benchmark pressure and should be made explicit before future maintainers repeat or undo them.

## Findings (severity-tagged)
- **FINDING-018-A** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#2]:
  - **What**: Reranker default churn moved GTE -> BGE -> Jina in about a day, with the final Jina default carrying CC BY-NC risk. The governance decision is present in benchmark prose, but not isolated as a durable ADR with license acceptance criteria.
  - **Why Pass 1 / deep-review missed this**: Pass 1 found the license risk, but not the historical reason the default became governance-sensitive.
  - **Evidence**: Git log command output above; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:63-71`, `:91-100`.
  - **What to do**: Add ADR: "Quality default versus commercial-safe default for reranking," including when Jina is acceptable.

- **FINDING-018-B** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#4]:
  - **What**: RRF was described as "fusion is a no-op, lock latency-optimum." That is a subtle decision: keep a nondiscriminative quality knob for latency reasons. It deserves a sharper ADR boundary.
  - **Why Pass 1 / deep-review missed this**: The decision is scattered across sweep results, config comments, and benchmark prose.
  - **Evidence**: Git log line `ee788254d1`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:21-24`; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:68-70`.
  - **What to do**: Add ADR criteria for changing RRF values: quality delta, latency delta, fixture size, and reranker lane.

- **FINDING-018-C** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#1]:
  - **What**: Embedder defaults moved Jina-code -> Nomic, while the registry retained larger-dimension opt-ins. The historical choice was "pipeline first, then default model," but future adapters may read it as "model swap solved retrieval."
  - **Why Pass 1 / deep-review missed this**: The benchmark report captures it, but future implementation packets need an ADR-level invariant.
  - **Evidence**: Git log lines `8f909d2299`, `8364bdd5b7`; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:52-71`.
  - **What to do**: Add ADR invariant: fix code/pipeline before model swap; adapters remain opt-in until schema/policy/bench evidence exists.

- **FINDING-018-D** [severity: LOW-CURIOSITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: The remediation commits are large aggregate commits (`9 P1`, `31/31 findings`), which weakens later archaeology unless the packet docs preserve finding-to-file mapping.
  - **Why Pass 1 / deep-review missed this**: It consumed final artifacts, not commit archaeology.
  - **Evidence**: Git log lines `7eba2a4535`, `5060f6f031`.
  - **What to do**: For future remediation arcs, include a machine-readable findings-to-commit map.

## Hypotheses that FAILED falsification (valuable!)
- "Every major default choice is already an explicit ADR" failed. Some rationale exists, but not in durable decision form.
- "Commit history adds no new information" failed; it surfaced the governance story behind default churn.

## Updates to research-pass-2.md
- Added time-machine section with ADR gaps for license defaulting, RRF no-op lock, and pipeline-before-model invariant.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

