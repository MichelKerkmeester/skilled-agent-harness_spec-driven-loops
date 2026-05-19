# Iteration 019 - Migration-path stress test [PASS-2]

## Pass 1 claim under attack
- NEW blind spot - orthogonal to Pass 1: recommended packet stack 023A-E needs migration cost, rollback, and ROI estimates.

## Hypotheses going in
- H1: 023A is the obvious first packet because it carries the highest severity.
- H2: A lower-cost packet may have higher immediate value if it has a concrete repro and small rollback surface.

## Evidence gathered
- Code surface command output:
  - Core files likely touched by 023A/023C/023E are large: `query.py 854`, `daemon.py 1055`, `config.py 749`, `cli.py 616`, `server.py 536`, `indexer.py 392`, `settings.py 365`, `protocol.py 198`, `observability.py 136`, `registered_embedders.py 175`.
  - Related tests include `test_config.py 528`, `test_e2e_daemon.py 390`, `test_reranker.py 339`, `test_fts_index.py 327`, `test_daemon.py 244`, `test_dedup_mirrors.py 195`, `test_registered_embedders.py 89`, `test_observability.py 39`.
- Benchmark harness surface command output: phase2 bench has `96` files; key scripts/fixture total `1821` LOC (`run-phase2-smoke.sh`, `sweep-rrf.py`, `sweep-rrf.sh`, `rerank-matrix-analyze.py`, `README.md`, corrected fixture).
- Iteration 015 evidence: request-budget bug has a concrete `21.59s` repro and localized validation path.
- Iteration 017 evidence: upstream rebase may obsolete local prompt/dimension work; local fork is `0.2.3+spec-kit-fork.0.2.0` versus upstream `0.2.33`.

## Pass-1 attack outcome
- [ORTHOGONAL]: Pass 1 proposed a severity-ordered stack. Migration stress says the first engineering move should balance risk, cost, and upstream import timing.

## Findings (severity-tagged)
- **FINDING-019-A** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#5]:
  - **What**: Highest immediate ROI is 023E request-budget clamps, not 023A. It has a live repro, likely 4-6 code files, focused tests, and straightforward rollback via config defaults.
  - **Why Pass 1 / deep-review missed this**: Pass 1 sorted by latent architectural severity, not cost-to-risk-reduction.
  - **Evidence**: Iteration 015 timing output; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:727-728`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:139-148`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:381-388`.
  - **What to do**: Do 023E first as a small hardening packet: central `SearchBudget`, shared CLI/MCP validation, and regression tests for KNN fast-fail plus path-fullscan refusal.

- **FINDING-019-B** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#1]:
  - **What**: 023A remains strategically important but is high migration risk. It touches schema, index metadata, daemon compatibility, settings/config, docs, and rollback.
  - **Why Pass 1 / deep-review missed this**: Pass 1 labeled the severity but did not walk implementation steps.
  - **Evidence**: Code surface LOC output above; iteration 011 schema and registry evidence; iteration 017 upstream drift evidence.
  - **What to do**: Split 023A into 023A1 metadata/fingerprint checks, 023A2 prompt/license registry fields, and 023A3 optional multi-dimension storage.

- **FINDING-019-C** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#5]:
  - **What**: 023C observability should move before broad 023B calibration. Without candidate counts and boost/rerank/fallback telemetry, expanded fixtures will produce more numbers but not more diagnosis.
  - **Why Pass 1 / deep-review missed this**: The original stack put calibration before observability.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:61-85`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:112-140`; iteration 014 new probe misses.
  - **What to do**: Run 023C immediately after 023E, then expand fixture/calibration.

- **FINDING-019-D** [severity: LOW-CURIOSITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: 023F upstream rebase is a prerequisite check before 023A heavy architecture, because upstream may already provide embedder query/index params.
  - **Why Pass 1 / deep-review missed this**: Upstream was out of Pass 1's structural plan.
  - **Evidence**: Iteration 017 GitHub API output.
  - **What to do**: Add a short rebase spike before committing to local prompt/dimension abstractions.

## Hypotheses that FAILED falsification (valuable!)
- "Highest severity should always be first" failed under migration ROI analysis.
- "023A can be a single packet" failed; it should be phased.

## Updates to research-pass-2.md
- Added migration cost matrix and changed recommended packet order by ROI: 023E, 023C, 023F, 023A1/2/3, 023B, 023D.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

