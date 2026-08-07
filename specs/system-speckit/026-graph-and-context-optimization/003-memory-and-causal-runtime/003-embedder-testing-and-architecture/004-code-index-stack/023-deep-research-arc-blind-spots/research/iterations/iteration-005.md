# Iteration 005 - Adversarial / red-team surface

## Preflight reasoning
- Focus: input shapes that stress asymptotics, escaping, filesystem traversal, and chunking.
- Hypotheses: FTS injection is mostly hardened, but path-filtered scans, offsets, and chunk pathology still create resource or recall hazards.
- Evidence to gather: query fetch sizing, path-filtered vector scan behavior, FTS escaping, chunker fallbacks, mirror path normalization, and timeout settings.
- Falsification test: hard input clamps and full-path canonicalization already bound all expensive paths.
- Expected surprise level: medium because many P1/P2 security closures are already verified.

## Hypotheses going in
- H1: Large `limit+offset`, broad language filters, or path filters can multiply candidate work before rerank.
- H2: FTS escaping is likely safe against SQL injection, but recall/injection-adjacent query semantics still deserve fuzzing.

## Evidence gathered
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:727-728` sets `unique_k = max(limit + offset, 1)` and `fetch_k = unique_k * 4`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:149-185` uses a full scan when path filters are present; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:600-620` fans out per-language KNN and uses `fetch_k` per language.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-29` defines `SearchRequest` fields for query/languages/paths/limit/offset; no protocol-level max limit/offset appears there.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:15-18` defaults MCP request timeout to 10s with max 600s; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:704-714` enforces per-request timeout.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:11-13` uses a token regex; `:89-97` quotes normalized terms; `:100-140` binds the FTS `MATCH ?` parameter.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/code_aware.py:51-94` falls back on parser errors or root errors and splits oversized top-level chunks only when `len(chunk.text) > chunk_size * 2`; `:115-124` only considers top-level children for definition ranges.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py:12-26` rejects nulls, backslashes, unsupported chars, and `..` in mirror prefixes; `:64-100` chooses canonical mirror copies by configured prefixes rather than realpath equivalence.

## Findings (severity-tagged)
- **FINDING-005-A** [severity: HIGH-LATENT-RISK]:
  - **What**: Search cost can scale unexpectedly with `offset`, `limit`, path filters, and language fanout. Path-filtered vector search takes a full scan path, while multi-language search can apply `fetch_k` per language.
  - **Why deep-review couldn't catch this**: The reviewed fixture uses small top-5 style searches. It does not exercise adversarial offset/limit/path combinations on a 100k-file corpus.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:149-185`, `:600-620`, `:727-728`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-29`; timeout enforcement at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:704-714`.
  - **What to do**: Add request clamps and explicit cost accounting: max offset, max effective candidate count, max paths, and a refusal/error that reports the reason before work starts.

- **FINDING-005-B** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Tree-sitter chunking handles parser failures, but top-level-only definition detection plus the `2 * chunk_size` oversized threshold leaves room for pathological chunks that are semantically broad yet not large enough to trigger fallback splitting.
  - **Why deep-review couldn't catch this**: Stage B tests can validate standard parser paths without exploring adversarial nested definitions, generated code, or very large literals near threshold.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/chunkers/code_aware.py:51-94`, `:115-124`.
  - **What to do**: Add fuzz/property tests for nested functions, huge object literals, minified files, generated code, and files just below/above the fallback threshold.

- **FINDING-005-C** [severity: LOW-CURIOSITY]:
  - **What**: FTS SQL injection looks substantially mitigated by tokenization, quoting, and bound parameters. The residual issue is more likely recall degradation for punctuation-heavy code queries than SQL injection.
  - **Why deep-review couldn't catch this**: Security review verified quote escaping; deep-research reframes this as an adversarial recall and fuzzing question.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:11-13`, `:89-97`, `:100-140`.
  - **What to do**: Monitor only for injection. Add a punctuation-heavy recall fixture for symbols like `::`, `->`, `<T>`, decorator names, and SQL snippets.

## Hypotheses that FAILED falsification
- The hypothesis that FTS `MATCH` is built by unsafe string interpolation failed. The query uses a bound parameter and normalized quoted tokens.
- I'M UNCERTAIN ABOUT THIS: the hypothesis that symlink chains can bypass mirror dedup is only partially supported. Mirror canonicalization is prefix-based, but source realpaths are also stored; a targeted symlink fixture is needed before claiming exploitability.

## Updates to research.md
- Added adversarial surfaces: request-cost clamps, path-filtered scan risk, chunking fuzz cases, and FTS recall fuzzing.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

