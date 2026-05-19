# Iteration 009 - Test + observability coverage gaps

## Preflight reasoning
- Focus: identify what is not observable or tested after the 172-test suite passes.
- Hypotheses: unit coverage is broad, but coverage tooling is not installed in the active venv; observability lacks enough retrieval-stage counters to diagnose quality regressions.
- Evidence to gather: pytest output, coverage command failure, test grep for dimensions/multi-project/offset, observability code, protocol status fields.
- Falsification test: coverage report exists, and daemon status exposes model/config/fusion/rerank fingerprints plus candidate counters.
- Expected surprise level: medium; the suite is strong, so gaps should be specific.

## Hypotheses going in
- H1: The test suite is green but not instrumented enough to prove line/branch coverage.
- H2: Production debugging will need signals that current daemon/status responses do not expose.

## Evidence gathered
- Verification command: `.venv/bin/python -m pytest -p no:cacheprovider tests/` passed with `172 passed in 15.68s`.
- Coverage command: `.venv/bin/python -m pytest --cov=cocoindex_code --cov-report=term-missing tests/` failed with `error: unrecognized arguments: --cov=cocoindex_code --cov-report=term-missing`, indicating pytest-cov was not installed/enabled in the active venv.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:64-70` includes `pytest-cov>=4.0.0` only under the `dev` optional dependency group.
- Absence/gap grep: `rg -n "SFR|stella|2048|1024|dimension|float\\[768\\]|jina-code-embeddings|per-project|multi-project|COCOINDEX_CODE_DIR|rerank_top_k|offset|limit" tests cocoindex_code | head -80` found tests for COCOINDEX_CODE_DIR and rerank_top_k, but no test hits for SFR/Stella/non-768 runtime behavior; the non-768 hits were registry/source lines, not tests.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:61-85` logs stage duration/result_count/lane only; `:115-136` logs decode-error prefixes only when IPC debug is enabled.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:112-119` search responses include result totals/deduped aliases/unique count; `:136-140` daemon status includes version, uptime, project roots, and client disconnects only.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:767-773` has RRF fusion, `:818-824` reranker dispatch, and `:843-854` final pagination, but current status output does not expose candidate loss across those stages.

## Findings (severity-tagged)
- **FINDING-009-A** [severity: HIGH-LATENT-RISK]:
  - **What**: The suite passes, but coverage tooling is not active in the venv used for verification. That blocks a line/branch-coverage view of adapter error paths and daemon edge cases.
  - **Why deep-review couldn't catch this**: Deep-review can rely on passing tests. Deep-research asks whether the verification surface itself reveals untested paths.
  - **Evidence**: pytest pass output above; coverage command failure above; `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:64-70`.
  - **What to do**: Install/test with dev extras in CI or add a coverage job that reports `term-missing` for `cocoindex_code`.

- **FINDING-009-B** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Observability is timing-oriented, not retrieval-diagnostic. It lacks vector candidate count, FTS candidate count, overlap count, post-dedup count, rerank input/output count, boost flip count, model/config fingerprint, and reranker fallback counters.
  - **Why deep-review couldn't catch this**: Existing observability likely satisfies the packets' timeout and IPC requirements. It does not answer "why did this query miss after model swap?"
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:61-85`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:112-119`, `:136-140`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:767-773`, `:818-824`, `:843-854`.
  - **What to do**: Add per-query retrieval telemetry, opt-in JSONL traces, and daemon status fields for effective config/model fingerprint.

- **FINDING-009-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Tests cover many units, but absence searches show missing high-value integration scenarios: non-768 model runtime behavior, per-project incompatible embedder states, adversarial offset/path cost limits, and first-install global CLI drift.
  - **Why deep-review couldn't catch this**: It is a negative-space finding; no failing test exists until those scenarios are encoded.
  - **Evidence**: Absence/gap grep output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:125-142`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:149-185`, `:600-620`, `:727-728`.
  - **What to do**: Add integration tests for dimension mismatch, multi-project incompatible settings, offset/path budget refusal, and stale entrypoint doctor checks.

## Hypotheses that FAILED falsification
- The hypothesis that the active venv could produce a coverage report failed because pytest did not recognize `--cov`.
- The hypothesis that no tests mention `rerank_top_k` failed; there is explicit coverage in `tests/test_reranker.py`. The remaining gap is cutoff sensitivity benchmarking, not zero test coverage.

## Updates to research.md
- Added test/observability coverage gaps: coverage job missing in active venv, diagnostic telemetry gaps, and high-value integration test scenarios.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

