---
title: "CFG-005 -- Chunking env-var overrides"
description: "This scenario validates the chunking env-var override surface for `CFG-005`. It focuses on confirming that `COCOINDEX_CODE_CHUNK_SIZE`, `COCOINDEX_CODE_CHUNK_OVERLAP`, and `COCOINDEX_CODE_MIN_CHUNK_SIZE` are honored at index time and produce a measurable chunk-count delta against the documented default (1500/200/250)."
---

# CFG-005 -- Chunking env-var overrides

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CFG-005`.

---

## 1. OVERVIEW

This scenario validates the chunking env-var override surface for `CFG-005`. `config.py` exposes three bounded int env vars — `COCOINDEX_CODE_CHUNK_SIZE` (100-8000, default 1500), `COCOINDEX_CODE_CHUNK_OVERLAP` (0-1000, default 200), and `COCOINDEX_CODE_MIN_CHUNK_SIZE` (50-1000, default 250) — that the indexer reads per-call so operators can tune chunk granularity without code changes. This scenario verifies that bumping `COCOINDEX_CODE_CHUNK_SIZE` to a larger value (e.g. 2000) on a clean reindex produces a strictly smaller chunk count than the 1500 default against the same source tree.

### Why This Matters

Chunk size directly drives retrieval quality and storage cost. Operators tuning recall on large monorepos rely on these overrides to grow chunks (fewer, larger spans) or shrink them (more, smaller spans). If the env vars are silently ignored — for example, because the config singleton was cached before the env var was set, or because the indexer fell back to module constants — operators will believe they re-tuned the index when the on-disk artefact is unchanged. This scenario detects that silent-no-op failure mode.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CFG-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `COCOINDEX_CODE_CHUNK_SIZE` (and by extension the two sibling chunk env vars) override the documented defaults; a clean reindex with `COCOINDEX_CODE_CHUNK_SIZE=2000` produces fewer chunks than the same reindex at the 1500 default against the same source tree.
- Real user request: `"I want to bump chunk size to 2000 to reduce chunk count — does the env var actually take effect or do I need to edit code?"`
- Prompt: `Reindex with COCOINDEX_CODE_CHUNK_SIZE=2000 and verify the chunk count drops vs the 1500 default.`
- Expected execution process: capture the baseline chunk count at the documented 1500 default with a clean reset+reindex; clean-reset again; export `COCOINDEX_CODE_CHUNK_SIZE=2000`; reindex; capture the new chunk count; diff the two counts and confirm the override produced a measurable reduction (~25-30% fewer chunks on a typical mixed-language tree).
- Expected signals: BASELINE `ccc status` reports chunk count at the 1500-default; PINNED `ccc status` after `COCOINDEX_CODE_CHUNK_SIZE=2000` reports a strictly smaller chunk count; file count is unchanged between runs; daemon log shows no `Ignoring invalid COCOINDEX_CODE_CHUNK_SIZE` warning.
- Desired user-visible outcome: A short verdict naming BASELINE and PINNED chunk counts, the percentage delta, and PASS confirming the env var took effect.
- Pass/fail: PASS if PINNED chunk count is strictly less than BASELINE AND file count is unchanged AND no warn-on-invalid log line fired; FAIL if PINNED equals BASELINE (env var silently ignored) OR PINNED is greater than BASELINE (override took the wrong direction) OR the warn-on-invalid fallback fired.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Reindex with COCOINDEX_CODE_CHUNK_SIZE=2000 and verify the chunk count drops vs the 1500 default.`

### Commands

1. `bash: unset COCOINDEX_CODE_CHUNK_SIZE COCOINDEX_CODE_CHUNK_OVERLAP COCOINDEX_CODE_MIN_CHUNK_SIZE` — clear any inherited overrides so the BASELINE is the documented default
2. `bash: ccc reset --force && ccc index` — clean BASELINE reindex at the 1500 default
3. `bash: ccc status` — capture BASELINE file count and chunk count
4. `bash: ccc reset --force` — clear the index so the PINNED reindex starts from zero
5. `bash: export COCOINDEX_CODE_CHUNK_SIZE=2000 && ccc index` — PINNED reindex with the override exported in the same shell as the indexer
6. `bash: ccc status` — capture PINNED file count and chunk count
7. `bash: tail -100 ~/.cocoindex_code/daemon.log | grep -i chunk` — capture indexer-side evidence and confirm no `Ignoring invalid COCOINDEX_CODE_CHUNK_SIZE` warning was emitted

### Expected

- Step 3: BASELINE reports non-zero file count and a chunk count corresponding to the 1500-default segmentation
- Step 5: indexer completes without error; no `Ignoring invalid` warning for the chunk env vars
- Step 6: PINNED file count equals BASELINE file count; PINNED chunk count is strictly less than BASELINE chunk count (~25-30% reduction expected on a typical mixed-language tree, exact delta depends on source distribution)
- Step 7: daemon log lines reference chunk sizing without any warn-on-invalid fallback message

### Evidence

Capture verbatim outputs of all six steps with the env-var value visible (`echo $COCOINDEX_CODE_CHUNK_SIZE` between steps where state changes). Record BASELINE and PINNED counts side by side and compute the percentage delta. Include the `tail -100 daemon.log | grep -i chunk` excerpt to prove the indexer honored the override.

### Pass / Fail

- **Pass**: PINNED chunk count < BASELINE chunk count AND PINNED file count = BASELINE file count AND no `Ignoring invalid COCOINDEX_CODE_CHUNK_SIZE` warning in daemon.log.
- **Fail**: PINNED chunk count >= BASELINE chunk count (override ignored or applied in the wrong direction) OR file count diverged (reset did not fully clear) OR the warn-on-invalid fallback fired (value rejected as out-of-range despite being inside 100-8000).

### Failure Triage

1. If PINNED equals BASELINE: confirm the env var is exported, not just set (`bash: env | grep COCOINDEX_CODE_CHUNK_SIZE`); confirm the daemon picked up the new env (`bash: ccc daemon stop && ccc daemon start && ccc index`); verify the value is inside the documented 100-8000 bounds.
2. If PINNED > BASELINE: this would be a logic regression — capture daemon.log around the index call and escalate.
3. If the warn-on-invalid fallback fires with a value clearly inside bounds: inspect `_parse_int_env` in `cocoindex_code/config.py` for a regression; capture the exact warning verbatim.
4. If file count diverged: rerun `bash: ccc reset --force` and confirm `ccc status` reports zero files before the PINNED reindex.

### Optional Supplemental Checks

- Repeat with `COCOINDEX_CODE_CHUNK_SIZE=8001` (above max) and confirm the warn-on-invalid fallback fires and the index uses 1500.
- Repeat with `COCOINDEX_CODE_CHUNK_SIZE=99` (below min) and confirm the same warn-on-invalid fallback path.
- Pair with `COCOINDEX_CODE_CHUNK_OVERLAP=400` to verify the overlap override also tracks; the chunk count delta should be smaller than chunk-size alone since overlap tightens span boundaries.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `03--configuration/004-root-path-env-var-override.md` | Sibling env-var-override scenario (root-path) |
| `03--configuration/003-status-verification.md` | Sibling scenario covering baseline `ccc status` shape |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | `_parse_int_env` + `COCOINDEX_CODE_CHUNK_*` declarations with bounds |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Per-call Config lookup with module constants as defaults |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | `TestChunkConfigValidation` unit coverage |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of indexer chunk sizing and warn-on-invalid fallbacks |

---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/005-chunking-env-override.md`
