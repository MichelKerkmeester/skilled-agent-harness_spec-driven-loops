---
title: "Iter 4 — P1-Group-3 Observability (commit ba6816a49 re-review)"
iter_number: 4
dimension: p1-group-3-observability
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ba6816a490b1a20d4f74135179c10096c5348921
---

# Iter 4 — P1-Group-3 Observability

## 1. SCOPED ANGLE

Re-review of commit ba6816a49 which claims to close P1-Group-3 "Observability & logging" by adding structured audit/error/rescue-telemetry logs. This iteration evaluates:
- Structured logging format (object payload vs free-text)
- Unique stable event tokens for greppability
- Sensitive data exposure in log messages
- Log-level appropriateness
- Rate-limiting concerns (high-volume telemetry)
- Dead code detection (unreachable log paths)
- Test coverage of log behavior

## 2. REFERENCES READ

- `git show ba6816a49` — Full commit diff showing all 8 new logger call sites across 6 files
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:78-84` — embedder_swap info log
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:299-306` — embedder_reindex_failed error log
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:383-389` — retrieval_rescue_cap_would_apply info log
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:414-421` — retrieval_rescue_hit_rate debug log
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:425-432` — stage2_retrieval_rescue_success debug log
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:64-68` — invalid device warning log
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:132-135` — missing root path warning log
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:147-151` — unknown embedding model warning log
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:127` — logger import (no calls)
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/deep-review-remediation.vitest.ts` — Test coverage check
- `.opencode/skills/system-spec-kit/mcp_server/tests/search/deep-review-remediation.vitest.ts` — Test coverage check

## 3. FINDINGS

### Log-call audit table

| file:line | event token | level | structured? | leaks sensitive? | rate concern? | verdict |
|---|---|---|---|---|---|---|
| embedder-set.ts:78-84 | embedder_swap | info | YES | NO | NO | PASS |
| reindex.ts:299-306 | embedder_reindex_failed | error | YES | NO | NO | PASS |
| retrieval-rescue.ts:383-389 | retrieval_rescue_cap_would_apply | info | YES | NO | NO | P2 (dead code) |
| retrieval-rescue.ts:414-421 | retrieval_rescue_hit_rate | debug | YES | NO | NO | PASS |
| stage2-fusion.ts:425-432 | stage2_retrieval_rescue_success | debug | YES | NO | NO | PASS |
| config.py:64-68 | NONE | warning | NO (values in message via %r) | YES (actual env_override value) | NO | P1 |
| config.py:132-135 | NONE | warning | NO (values in message via %r) | YES (actual root_path_str) | NO | P1 |
| config.py:147-151 | NONE | warning | NO (values in message via %r) | YES (actual embedding_model) | NO | P1 |
| registered_embedders.py:127 | N/A | N/A | N/A | N/A | N/A | N/A (import only) |

### NEW P0 / P1 / P2 findings (if any)

**P1 findings (3 total):**

1. **config.py:64-68 — Unstructured logging with sensitive data exposure**
   - The Python log uses `%r` placeholder format which embeds the actual `env_override` value into the log message string via `repr()`, not as a structured field
   - This makes it difficult to parse with structured-log tools (no event token, no key=value fields)
   - Logs the actual environment variable value which could contain sensitive configuration data
   - Evidence: `logger.warning("Ignoring invalid COCOINDEX_CODE_DEVICE=%r; expected one of %s", env_override, sorted(_VALID_DEVICES))` at <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="64-68" />

2. **config.py:132-135 — Unstructured logging with deployment layout leak**
   - Same `%r` format issue - values embedded in message string, not structured fields
   - No event token for greppability
   - Logs the actual `root_path_str` which could reveal deployment directory structure/layout
   - Evidence: `logger.warning("Ignoring COCOINDEX_CODE_ROOT_PATH=%r because it does not exist; falling back to discovery", root_path_str)` at <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="132-135" />

3. **config.py:147-151 — Unstructured logging with embedder name leak**
   - Same `%r` format issue - values embedded in message string, not structured fields
   - No event token for greppability
   - Logs the actual `embedding_model` value which could include API URLs or tokens in the model name (though current manifest uses safe sbert/ prefixes)
   - Evidence: `logger.warning("Ignoring unknown COCOINDEX_CODE_EMBEDDING_MODEL=%r; falling back to %r", embedding_model, _DEFAULT_MODEL)` at <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="147-151" />

**P2 findings (1 total):**

1. **retrieval-rescue.ts:383-389 — Dead code telemetry log**
   - The `retrieval_rescue_cap_would_apply` log fires when `wouldHaveBeenCapped` is true
   - With `RESCUE_SCORE_CAP = 1.0`, the formula `Math.min(baseScore, 1) * 0.03 + rescueScore * 0.78` has a maximum value of `1 * 0.03 + 1 * 0.78 = 0.81`
   - Since `0.81 < 1.0`, the condition `uncapped > RESCUE_SCORE_CAP` (line 200) is mathematically impossible to satisfy
   - This log path is unreachable dead code - the cap-counter telemetry never fires
   - Evidence: `computeRescueLayerScore` function at <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts" lines="195-202" /> and log call at <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts" lines="383-389" />

**Test coverage observation:**
- The vitest cases in `deep-review-remediation.vitest.ts` assert against `telemetryCounters` values (e.g., `__testables.telemetryCounters.rescueRuns`) but do NOT assert against logger calls
- The logs are documentation only, not tested behavior
- This is acceptable for telemetry logs, but means log format changes could go undetected

## 4. POSITIVE OBSERVATIONS

- All TypeScript logs use proper structured object payloads with explicit `event: '...'` tokens
- All TypeScript event tokens are unique and stable (embedder_swap, embedder_reindex_failed, retrieval_rescue_cap_would_apply, retrieval_rescue_hit_rate, stage2_retrieval_rescue_success)
- TypeScript logs do not expose sensitive data (embedder names are public metadata, jobIds are internal IDs)
- Log levels are appropriate: info for customer-visible events (embedder swap), error for failures, debug for per-query telemetry
- Rate concerns are well-managed: embedder logs fire rarely (swap/failure), rescue logs fire once per query
- The Python logs do use the standard Python logging module correctly (just need structured format improvement)

## 5. JSONL DELTA ROW

```json
{"ts":"2026-05-17T21:32:00.000Z","event":"iter_complete","iter":4,"dimension":"p1-group-3-observability","p0_count":0,"p1_count":3,"p2_count":1,"refs_read_count":11,"new_log_sites":8,"structured_pct":0.625,"unique_event_tokens":5,"sensitive_data_leaks":3,"verdict_so_far":"P1-Group-3 partially closed: TS logs are well-structured, but Python logs need structured format + event tokens. Dead code telemetry (P2) should be removed or the cap logic fixed."}
```

