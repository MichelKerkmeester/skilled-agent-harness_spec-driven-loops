---
title: "MCP-008 -- Concurrent refresh_index race"
description: "This scenario validates Concurrent refresh_index race for `MCP-008`. It focuses on confirming that two simultaneous `refresh_index=true` requests against the same daemon either succeed without `ComponentContext` errors or expose the documented race so operators can switch the second query to `refresh_index=false`."
---

# MCP-008 -- Concurrent refresh_index race

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MCP-008`.

---

## 1. OVERVIEW

This scenario validates concurrent-search behavior under `refresh_index=true` for `MCP-008`. SKILL.md §4 ("Concurrent Query Sessions") documents that the daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors and instructs operators to set `refresh_index=false` after the first session query. This scenario gives that warning a deterministic test.

### Why This Matters

If the documented race silently degrades to wrong-result behavior (e.g., one query returning empty without an error), operators will not know to switch to `refresh_index=false`. The scenario must produce one of two acceptable outcomes: (a) both queries succeed cleanly, or (b) at least one query surfaces the `ComponentContext` error explicitly so the operator can act.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify the daemon either (a) handles two simultaneous `refresh_index=true` calls cleanly, or (b) surfaces a `ComponentContext` error explicitly so the operator can fall back to `refresh_index=false`.
- Real user request: `"Run two CocoIndex searches at the same time and tell me whether the refresh-index race is real."`
- Prompt: `Run two refreshing MCP CocoIndex searches concurrently and tell me whether the refresh race is real.`
- Expected execution process: dispatch two MCP `search` calls in the same shell using background subprocesses or two parallel tool invocations; collect both responses; inspect for `ComponentContext` substring; rerun second call with `refresh_index=false` to confirm clean path.
- Expected signals: both responses parse as JSON; no silent empty result when index is known non-empty; if a `ComponentContext` error appears, it is on at most one of the two responses; the follow-up `refresh_index=false` call returns a non-empty result array.
- Desired user-visible outcome: A short verdict naming which mode was observed (clean | race-with-error | unexpected silent empty), plus the recommended `refresh_index=false` follow-up confirmation.
- Pass/fail: PASS if both calls return valid result arrays OR one returns explicit `ComponentContext` error AND the `refresh_index=false` follow-up returns results; PARTIAL if one call returns empty without an error message; FAIL if both calls error or the follow-up `refresh_index=false` call also errors.


---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run two refreshing MCP CocoIndex searches concurrently and tell me whether the refresh race is real.`

### Commands

1. `bash: ccc status` — confirm index is non-empty before the race test
2. Fire two parallel MCP calls in the SAME tool-call batch:
   - Call A: `mcp__cocoindex_code__search({ "query": "error handling", "refresh_index": true, "limit": 3 })`
   - Call B: `mcp__cocoindex_code__search({ "query": "configuration loader", "refresh_index": true, "limit": 3 })`
3. Capture both responses verbatim; grep both for the literal substring `ComponentContext`
4. `mcp__cocoindex_code__search({ "query": "configuration loader", "refresh_index": false, "limit": 3 })` — confirm the recommended fallback path returns results
5. `bash: tail -50 ~/.cocoindex_code/daemon.log` — capture daemon-side evidence of either successful concurrent handling or the race

### Expected

- Step 1: status reports non-zero file and chunk counts
- Step 2: both responses return; neither hangs past the configured timeout
- Step 3: at most one response contains `ComponentContext`; the other is a valid result array OR both are valid result arrays
- Step 4: response is a valid result array (non-empty)
- Step 5: daemon log contains either both query traces (clean path) OR a `ComponentContext` traceback aligned with one of the two queries
- Client-disconnect scenarios should add zero double-traceback entries to `daemon.log`.
- During the test window, `grep -c BrokenPipeError ~/.cocoindex_code/daemon.log` should not grow.
- A single INFO disconnect line is acceptable when a client exits before reading a response.
- A Python traceback for `BrokenPipeError` or `ConnectionResetError` is not acceptable.

### Evidence

Capture both verbatim responses from step 2 with timestamps, the verbatim grep output for `ComponentContext`, the verbatim response from step 4, and the relevant tail of `daemon.log` covering the test window.

### Pass / Fail

- **Pass**: Either (a) both calls in step 2 return valid result arrays AND step 4 also returns results, OR (b) one call in step 2 surfaces an explicit `ComponentContext` error AND step 4 returns results — the documented fallback works.
- **Partial**: One call in step 2 returns an empty result array without any error message and the index is known non-empty (silent failure mode that masks the race).
- **Fail**: Both calls in step 2 error, OR step 4 (`refresh_index=false`) also errors, OR daemon process crashes.

### Failure Triage

1. If both step-2 calls error: check `~/.cocoindex_code/daemon.log` for stack traces; restart the daemon with `bash: ccc daemon stop && ccc daemon start`; rerun the scenario with a longer per-call timeout.
2. If step 4 (`refresh_index=false`) errors: the documented fallback is broken — capture the verbatim error and escalate; this regresses the SKILL.md §4 Concurrent Query Sessions contract.
3. If step-2 produces silent empty results despite a non-empty index: rerun with daemon log streaming (`bash: tail -f ~/.cocoindex_code/daemon.log &`) to capture concurrency events; report this as a doc gap because SKILL.md §4 currently only warns about the `ComponentContext` error path.
4. If `BrokenPipeError` grows during client disconnects: verify Patch 2 is present. `_safe_send_bytes` at `mcp_server/cocoindex_code/daemon.py:62` must wrap all 6 daemon send sites.
5. If the log shows duplicate disconnect tracebacks: inspect the send paths at `daemon.py:476`, `daemon.py:482`, `daemon.py:491`, `daemon.py:501`, `daemon.py:504` and `daemon.py:506`.
6. If concurrent clients fail before request handling starts: verify Patch 6 is present. `Listener(backlog=128)` at `mcp_server/cocoindex_code/daemon.py:696` is the queue-depth fix for concurrent-client storms.
7. If backlog failures persist with Patch 6 present: capture client count, timestamps, daemon PID and shell transcript so the queue-depth behavior can be reproduced.
8. If `ConnectionResetError` appears in a traceback: treat it as the same send-path regression as `BrokenPipeError`.
9. If errors start before any response-send site runs: investigate listener queue saturation before changing the search fallback guidance.
10. If the fallback search succeeds but disconnect tracebacks grow: mark search behavior PASS and socket-safety behavior FAIL.

### Optional Supplemental Checks

- If both calls succeed cleanly on first attempt: rerun the scenario 5x to bound the race-trigger probability and note the rate in evidence; a clean run is not proof the race is fixed.
- Compare wall-clock time of step-2 vs step-4 to estimate the cost of the recommended fallback.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `02--mcp-search-tool/007-no-refresh-search.md` | Sibling scenario covering the `refresh_index=false` happy path |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-coco-index/SKILL.md` | §4 "Concurrent Query Sessions" documents the race; §5 References note also flags the `ComponentContext` failure mode |
| `~/.cocoindex_code/daemon.log` | Runtime evidence of concurrent-call handling |
| `~/.cocoindex_code/daemon.sock` | IPC surface where the race manifests |

---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/008-concurrent-refresh-race.md`
