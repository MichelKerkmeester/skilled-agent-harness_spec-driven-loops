# Iteration 015 - Search-cost pathological payload [PASS-2]

## Pass 1 claim under attack
- HIGH-LATENT-RISK #5 / FINDING-005-A: search cost can grow unexpectedly under offset/path/language fanout.

## Hypotheses going in
- H1: The claim is overstated if valid high-offset inputs are rejected quickly by lower-level KNN caps.
- H2: The claim survives if path-filtered full scans breach the 10s request budget with valid inputs.

## Evidence gathered
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:149-185` implements path-filtered full scans with `vec_distance_L2`; `:600-620` sends path-filtered hybrid search to `_full_scan_query_with_ids`; `:727-728` computes `fetch_k = (limit + offset) * 4`.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:139-148` caps MCP `limit` at 100 but leaves `offset` unbounded.
- Code evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:381-388` exposes CLI `--limit` and `--offset` without visible bounds.
- Timing probe output:
  - Baseline: `.venv/bin/ccc search 'prompt policy invariant' --limit 5` exited `0` in `1.147s`.
  - High-offset KNN: `--limit 5 --offset 20000` exited `1` in `0.823s` with `RuntimeError: k value in knn query too large, provided 80020 and the limit is 4096`.
  - Path full-scan high-offset: `--path '*' --limit 100 --offset 20000` exited `0` in `21.59s`, printed `dedupedAliases: 56512 | uniqueResultCount: 100`.
- Timeout evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:15-18` defines default MCP request timeout as `10_000ms`, but the CLI probe completed after 21.59s.

## Pass-1 attack outcome
- [STRENGTHENED]: The path-filtered payload proves the risk with valid inputs: `21.59s` on this repo.
- [FALSIFIED]: Pure high-offset KNN does not run unbounded; sqlite-vec rejects `k=80020` against its `4096` limit in under one second.

## Findings (severity-tagged)
- **FINDING-015-A** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#5]:
  - **What**: Valid path-filtered queries can exceed 10s. The repro `--path '*' --limit 100 --offset 20000` took `21.59s` and deduped `56,512` aliases.
  - **Why Pass 1 / deep-review missed this**: Pass 1 reasoned from code. It did not attach a concrete pathological payload with wall-clock timing.
  - **Evidence**: Timing probe output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:149-185`, `:600-620`, `:727-728`.
  - **What to do**: Implement request budget validation before embedding/search: max offset, max `limit + offset`, max path glob fanout, and path-fullscan refusal unless explicitly forced.

- **FINDING-015-B** [severity: LOW-CURIOSITY] [Pass-1 relation: FALSIFIES-#5]:
  - **What**: The pure KNN path has a hidden hard cap from sqlite-vec. A high-offset KNN payload fails fast rather than burning CPU.
  - **Why Pass 1 / deep-review missed this**: The lower-level sqlite-vec cap is not visible in local protocol/config code.
  - **Evidence**: Timing probe output above: `k value in knn query too large, provided 80020 and the limit is 4096`.
  - **What to do**: Surface this as a friendly validation error instead of letting the backend raise.

- **FINDING-015-C** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: ORTHOGONAL]:
  - **What**: CLI and MCP have different guard surfaces. MCP caps `limit` at 100, while CLI does not visibly cap `limit`; neither caps `offset`.
  - **Why Pass 1 / deep-review missed this**: The analysis cited protocol fields but did not compare server and CLI input validation.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:139-148`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:381-388`.
  - **What to do**: Centralize `SearchBudget` validation and use it from MCP, CLI, daemon, and tests.

## Hypotheses that FAILED falsification (valuable!)
- "Any high offset is dangerous" failed for KNN-only because backend K caps reject it.
- "The request-cost risk is merely theoretical" failed with a 21.59s valid path-filtered query.

## Updates to research-pass-2.md
- Added concrete pathological payload, wall-clock timings, and CLI/MCP validation mismatch.

## NO-EARLY-STOP confirmation
- Iteration <= 20: continuing to next iter.

