---
title: "CFG-006 -- Hybrid search opt-in"
description: "This scenario validates the hybrid-search opt-in surface for `CFG-006`. It focuses on confirming that `COCOINDEX_HYBRID=true` activates SQLite FTS5 + RRF fusion and that the response payload carries the `fts5_score` and `rrf_score` fields that are absent in vector-only mode."
---

# CFG-006 -- Hybrid search opt-in

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CFG-006`.

---

## 1. OVERVIEW

This scenario validates the hybrid-search opt-in surface for `CFG-006`. `config.py` declares `COCOINDEX_HYBRID` (default `false`) plus three tuning env vars — `COCOINDEX_HYBRID_VECTOR_WEIGHT` (default 0.7), `COCOINDEX_HYBRID_FTS5_WEIGHT` (default 0.7), and `COCOINDEX_HYBRID_RRF_K` (default 60). When hybrid is enabled, `query.py` runs the vector and FTS5 channels sequentially and fuses them with RRF, then stamps `fts5_score` and `rrf_score` on every returned result for auditability. This scenario verifies that flipping the env var on and off toggles the presence of those fields in the response.

### Why This Matters

Operators evaluating hybrid retrieval need a deterministic way to confirm the hybrid path actually ran rather than a silent fallback to vector-only. The `fts5_score` and `rrf_score` fields on the response are the canonical proof of opt-in: vector-only responses leave them `null`, hybrid responses populate them. If the env var is silently ignored — for example because the daemon cached config before the env was set — the operator will believe they are measuring hybrid behavior while comparing two vector-only runs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CFG-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `COCOINDEX_HYBRID=true` activates the FTS5 + RRF hybrid lane; sample MCP search responses then carry non-null `fts5_score` and `rrf_score` on every result, while the same query with `COCOINDEX_HYBRID=false` (or unset) leaves both fields null.
- Real user request: `"I turned on hybrid search but I can't tell if it's actually running — how do I prove the response came from the hybrid lane?"`
- Prompt: `Flip COCOINDEX_HYBRID on, run a sample MCP search, and confirm fts5_score and rrf_score are populated.`
- Expected execution process: confirm vector-only baseline by running a sample search with `COCOINDEX_HYBRID` unset and recording that `fts5_score`/`rrf_score` are absent or null; export `COCOINDEX_HYBRID=true`; restart the daemon so the env reaches the worker process; rerun the same sample search; verify every returned result carries non-null floats in both fields; unset the env, restart the daemon, rerun to confirm the fields drop back to null.
- Expected signals: HYBRID-OFF response leaves `fts5_score` and `rrf_score` as null or missing on every result; HYBRID-ON response populates both fields with non-null floats on every result; daemon log lines reference the hybrid lane after the env flip (telemetry tags `lane=hybrid_rrf` vs `lane=vector_only`); no `Ignoring invalid COCOINDEX_HYBRID` warning is logged.
- Desired user-visible outcome: A short verdict naming the HYBRID-OFF response shape, the HYBRID-ON response shape with sample `fts5_score`/`rrf_score` values, and PASS confirming the env var toggled the lane.
- Pass/fail: PASS if HYBRID-ON populates both fields on every result AND HYBRID-OFF leaves them null AND the daemon log records the lane switch; FAIL if HYBRID-ON leaves the fields null (env var silently ignored) OR HYBRID-OFF populates them (env defaults inverted) OR the warn-on-invalid fallback fired for a clean boolean value.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Flip COCOINDEX_HYBRID on, run a sample MCP search, and confirm fts5_score and rrf_score are populated.`

### Commands

1. `bash: ccc status` — confirm the index is non-empty before sampling responses
2. `bash: unset COCOINDEX_HYBRID && ccc daemon stop && ccc daemon start` — establish a clean HYBRID-OFF baseline; restart the daemon to flush any cached config
3. `mcp__cocoindex_code__search({ "query": "error handling", "limit": 3, "refresh_index": false })` — capture HYBRID-OFF response; inspect each result for `fts5_score` and `rrf_score`
4. `bash: export COCOINDEX_HYBRID=true && ccc daemon stop && ccc daemon start` — flip hybrid on; restart so the env reaches the daemon worker
5. `mcp__cocoindex_code__search({ "query": "error handling", "limit": 3, "refresh_index": false })` — capture HYBRID-ON response; inspect each result for `fts5_score` and `rrf_score`
6. `bash: tail -100 ~/.cocoindex_code/daemon.log | grep -Ei "hybrid|lane="` — confirm the daemon log shows the lane switch and no warn-on-invalid fallback
7. `bash: unset COCOINDEX_HYBRID && ccc daemon stop && ccc daemon start` — reset to HYBRID-OFF for subsequent scenarios (cleanup)

### Expected

- Step 1: status reports non-zero file and chunk counts
- Step 3: every result in the HYBRID-OFF response leaves `fts5_score` and `rrf_score` as `null` (or omits the keys entirely depending on serialization)
- Step 5: every result in the HYBRID-ON response carries non-null floats in both `fts5_score` and `rrf_score`
- Step 6: daemon log shows telemetry tag `lane=hybrid_rrf` for the step-5 query and `lane=vector_only` for the step-3 query; no `Ignoring invalid COCOINDEX_HYBRID` warning appears

### Evidence

Capture both verbatim MCP responses (steps 3 and 5) with the `fts5_score`/`rrf_score` keys highlighted. Include `echo $COCOINDEX_HYBRID` output between steps where state changes. Include the `daemon.log` excerpt covering the lane switch.

### Pass / Fail

- **Pass**: Step-5 results all populate `fts5_score` and `rrf_score` AND step-3 results leave both null AND daemon.log records the lane switch with no warn-on-invalid fallback.
- **Fail**: Step-5 results leave `fts5_score` or `rrf_score` null (env var ignored or hybrid path failed to run) OR step-3 results populate those fields (env-default inversion) OR the daemon crashes after the env flip OR a warn-on-invalid fallback fires for the clean `true` value.

### Failure Triage

1. If step-5 leaves the fields null: confirm the env was exported before the daemon restart (`bash: env | grep COCOINDEX_HYBRID`); confirm the daemon actually restarted (`bash: ccc daemon status`); inspect daemon.log for a startup line confirming the hybrid lane is active.
2. If a warn-on-invalid fallback fires for `true`: inspect `_parse_bool_env` in `cocoindex_code/config.py` for a regression; capture the exact warning.
3. If only some results carry the fields: hybrid may have partial-failed mid-batch — inspect daemon.log for FTS5 errors and capture the full response payload for triage.
4. If the daemon crashes on restart with hybrid on: check that the FTS5 virtual table was created (`bash: sqlite3 ~/.cocoindex_code/<db> ".schema code_chunks_fts"`); rebuild the index with `bash: ccc reset --force && ccc index` if the FTS table is missing.

### Optional Supplemental Checks

- Pair with `COCOINDEX_HYBRID_VECTOR_WEIGHT=1.0` and `COCOINDEX_HYBRID_FTS5_WEIGHT=0.0` to confirm the fused `rrf_score` collapses toward the vector-only ordering.
- Pair with `COCOINDEX_HYBRID_RRF_K=10` (low end) and `=500` (high end) to confirm the RRF constant changes the fused score distribution.
- Cross-check against scenario `MCP-00N hybrid-search-behavior` (search-tool category) for end-to-end ordering effects rather than just the response-shape contract validated here.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `03--configuration/005-chunking-env-override.md` | Sibling env-var-override scenario (chunking) |
| `03--configuration/007-reranker-opt-in.md` | Sibling opt-in scenario (reranker) |
| `02--mcp-search-tool/001-basic-semantic-search.md` | Sibling search-shape scenario for the vector-only baseline |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `COCOINDEX_HYBRID*` declarations with defaults and bounds |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py` | `code_chunks_fts` virtual table and FTS5 query helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py` | `rrf_fuse()` and per-channel min-max normalization |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Hybrid dispatch on `COCOINDEX_HYBRID`; telemetry lane tagging |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | `fts5_score` and `rrf_score` response fields |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py` | FTS5 virtual-table and query coverage |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of the lane switch |

---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/006-hybrid-search-opt-in.md`
