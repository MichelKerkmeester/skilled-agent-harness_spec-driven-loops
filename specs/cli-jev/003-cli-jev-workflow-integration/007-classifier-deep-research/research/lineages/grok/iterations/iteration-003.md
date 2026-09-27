# Iteration 3: grok-03: Outside patterns for context reduction

## Focus

Questions C and B. Which vendored pattern reduces what the main AI reads, which round-2 drop was latency or egress alone, and whether Deem's MCP tools are the right shape. BASE2 section 7 is quoted as BASE2's verdict. The code lines below were opened in this iteration.

Independent: no round-3 sibling file read.

Prefix `P` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`. Prefix `R` = `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's`. Prefix `B2` = `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md`.

## Findings

### What each pattern reduces

| Pattern | What the main model stops reading | Judgment | Vendored line | BASE2 section 7 |
|---|---|---|---|---|
| pi-jev-context history hiding | Older messages, hidden from the next request, not deleted | `noul` keep probability, default threshold 0.8 | `R/pi-jev-context-main/src/index.ts:264-270`; `R/pi-jev-context-main/README.md:14`, `:48` | Refuse. Row 44. Section 7 line 417 |
| npm `route` | Free-text dispatch becomes one handler plus closed args, so the main model does not invent the call | `choice`, plus a `none` key | `R/jev-cli-main/src/core/route.ts:110-116`; `R/jev-cli-main/docs/route.md:11` | Adopt the `none` key. Section 7 line 402 |
| npm `rerank` | Search hits the main model does not open | one `noul` per candidate, then a sort | `R/jev-cli-main/docs/rerank.md:3`, `:11`; `R/jev-cli-main/src/core/rerank.ts:70-81` | Refuse the missing-as-0 and the input-order tie. Rows at section 7 lines 412-413. Drop row 47 |
| npm `compact` | Stale tool calls and stale tool outputs. User and assistant text stay | two `noul` questions per call: keep the call, keep the result | `R/jev-cli-main/docs/compact.md:3`; `R/jev-cli-main/src/vendor/compaction/compact.ts:58-68` | Adopt the question asked from the character count, the 0.25 `worth_it` line, and the pinned head. Section 7 lines 405-407 |
| claude-jev path refuse | Files the reader never opens | no model call. A filename regex | `R/claude-jev-main/src/infrastructure/fs-source-reader.ts:16-33` | Refuse as a redaction fix. Row 49. Section 7 line 419 |
| Deem MCP `classify` / `score` / `check` | Nothing by itself. The main model must send `state` in the tool call | `choice`, `score`, `noul` | `P/context/deem-main/serve/deem_mcp.py:9-11`, `:94-119` | BASE2 has no MCP row. A search of `B2` for `MCP` returned no matches |

### Bytes the main AI would load

The tool schemas the MCP server returns from `tools/list` are the Python objects at `deem_mcp.py:46-120` (`CLASSIFY_SCHEMA`, `SCORE_SCHEMA`, `CHECK_SCHEMA`, `TOOLS`). That source slice is 2,225 bytes (75 lines, file is 8,872 bytes). Counted by reading the file and measuring `lines[45:120]` encoded as UTF-8. The JSON on the wire is a different encoding and was not produced, because producing it means executing Deem's module. 2,225 is the source-text size of the schema block, not the wire size.

A hook that prunes before the model request adds zero tool-schema bytes. The main AI never sees a tool definition. pi-jev-context does this inside the host's `context` event (`index.ts:264-270`), not as a tool the model chooses to call.

MCP is the wrong shape for a context reduction here. To call `classify`, the main model has to place `state` in the tool arguments (`deem_mcp.py:60`, required `state`). That writes the text you hoped to avoid into the tool call. A hook or a script reads the transcript itself and returns a shorter message list. The model does not decide to call it and does not copy the state into an argument.

### Which drops were latency or egress, and which were not

Quoted from BASE2, then checked against the lines BASE2 cites.

- Row 44 (`B2:794`) drops pi-jev-context's per-request filter. BASE2's reason is the await before every model request, the README warning that filtering can invalidate the prompt cache, and pruning that keeps applying after an API error. Those lines are `README.md:85` and `:87`, opened here: "Scans add latency and API usage, and filtering can invalidate your model provider's prompt cache." and "On an API error, judging pauses but previously saved pruning still applies." Egress is also real (`README.md:37`: history goes to `api.typesafe.ai`). The row does not rest on latency or egress alone. A local 60 ms call removes the API charge and the egress. It does not remove cache invalidation or a saved prune that survives an error. `LOCAL:50` still marks hook spawn cost as unmeasured, so the latency half is not closed either.
- Row 47 (`B2:797`) drops npm `rerank` because a missing answer becomes 0 and ties follow input order (`rerank.ts:77`, `:81`, opened here). That is a default standing in for a missing value, not a latency or egress drop. A local backend keeps the bug.
- Row 49 (`B2:799`) drops claude-jev's path regex as a redaction fix because it never sees file content (`fs-source-reader.ts:16-33`). Not a latency drop. Not a context-reduction win. The regex is a refuse list, and a classifier does not make it see inside the file.

The compact path BASE2 adopted has a fail-open this section-7 table does not cite. `compact.ts:284-285` does `answers.get(call.id) ?? { keepCall: 1, keepResult: 1 }`. A missing batch answer keeps the call and the full result. That is the opposite of `rerank.ts:77`, which stores a missing `noul` as 0, and the opposite of the "missing answer throws" rule BASE2 adopted at section 7 line 400. New against section 7: the adopted compact questions still default a hole to "keep everything."

The 9B card's long-state line, 3,200+ tokens at P50 788 ms (`P/context/deem-main/docs/MODEL_CARD_9B.md:35-36`), is a vendor claim about the 9B. It is not a measurement of the served 0.8B. It does not show that local context reduction is cheap on long history.

### Adopt, anti-pattern, kill

| Pattern | Here | Kill criterion |
|---|---|---|
| pi-jev per-request hide | Anti-pattern as a live filter. The off-by-default switch (`README.md:95-98`) is the part to keep | A counted session where cache-read tokens fall by more than the tokens hidden, on the same prompts, with spawn cost included. Until that count exists, do not build the per-request form |
| `route` with `none` | Adopt the `none` key only inside an offline census, not as a live router. No gold counted in this iteration | Gold for handler picks below a pre-registered agreement. mimo owns usage counts |
| `rerank` missing-as-0 and input-order ties | Anti-pattern. Do not port | Already killed by `rerank.ts:77` and `:81`. A local model does not change those lines |
| `compact` two `noul`s | Adopt only with the missing-answer throw BASE2 already requires, which means deleting the `?? { keepCall: 1, keepResult: 1 }` default | A fixture where a missing batch answer keeps a stale tool result the next turn treats as current. That fixture failing closed (throw, no prune) is the keep. The current default fails that test by construction (`compact.ts:285`) |
| Path regex refuse | Anti-pattern as a substitute for reading content | Not a classifier idea |
| Deem MCP tools | Anti-pattern for reduction | Wire JSON of `tools/list` at or above the 2,225-byte source slice, or any schema that requires the model to send `state`. A hook at zero schema bytes wins |

### Idea N-grok-03-1

- **Idea:** `N-grok-03-1`. Do not expose Deem `classify` / `score` / `check` as MCP tools for context reduction. Type: those three, which are `choice`, `score`, and `noul`.
- **Question:** C
- **Builds on:** new. BASE2 has no MCP row. The lead's grok-03 refinement asked for the byte count.
- **Value:** avoids loading tool schemas and avoids making the main model copy state into a tool call.
- **Seam:** `P/context/deem-main/serve/deem_mcp.py:94-119` and `:141-142` (`tools/list` returns `TOOLS`).
- **Metric, baseline, harness:** schema bytes added to the tool list. Baseline: 2,225 source bytes for lines 46-120, versus 0 for a hook. Harness: the one-liner that sliced the file. Wire JSON UNKNOWN until someone serializes `TOOLS` without booting the server.
- **Savings:** the saving is not calling MCP. Tokens saved versus a hook: the schema bytes plus the tool-call argument. Per week UNKNOWN. This iteration did not count sessions.
- **Cost, latency, privacy:** an MCP call still hits the local server if the model invokes it. State stays on the machine only if the server is Deem. The schema load happens even when the model never calls the tool.
- **Two-backend gate:** no switch, because the idea is to not add the tools. With neither backend, behavior is exactly today's: no Deem MCP server in the tool list.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed for the source-byte count and for `state` being required. Inferred that the wire JSON is the same order of magnitude.
- **Kill criterion:** a measured `tools/list` payload of 0 bytes is impossible while the three tools are registered. The drop stands while the tools are how the model is supposed to ask.

### Idea N-grok-03-2

- **Idea:** `N-grok-03-2`. A compaction keep/drop that asks the two `noul` questions in `questionsFor`, runs only at a compaction boundary, and throws when an answer is missing. Prefer Deem when the health check passes, because the transcript stays local. Type: `noul`.
- **Question:** C, B
- **Builds on:** BASE2 section 7 lines 405-407 and row 44. R19 is BASE2's compaction arm. This iteration adds the fail-open at `compact.ts:285`.
- **Value:** the main model rereads less stale tool output, without a per-request filter.
- **Seam:** `R/jev-cli-main/src/vendor/compaction/compact.ts:58-68` and `:284-285`. The repository seam those lines would port into is phase 005, not opened in this iteration.
- **Metric, baseline, harness:** tokens removed per compaction, and the false-keep rate on a labeled set. Baseline UNKNOWN here. `docs/compact.md:30` says `worth_it` below 0.25 reduction is the vendor's own kill. LOCAL p95 is 62.8 to 78.5 ms per question (`P/context/deem-local.md:34-38`) and each call is two `noul`s, so a batch is not one 60 ms call. Spawn cost UNKNOWN (`deem-local.md:50`).
- **Savings:** estimate. No transcript count in this iteration.
- **Cost, latency, privacy:** two `noul`s per candidate call (`compact.ts:58-68`), batched. Jev sends the fitted transcript off the machine (`docs/compact.md:36`). Deem keeps it local. The Python `jev-cli` `call` timeout of 60 s is the wrong client for a hook (iteration 2).
- **Two-backend gate:** its own switch, default off, matching `README.md:95` (`"enabled": false`) as the shape, not as a Pi install. Jev available when `jev auth status --provider <p>` exits 0. Deem available when the health check deepseek-01 defines passes. Prefer Deem when both pass, because the payload is transcript text. When neither passes, the compactor does not run and today's summary path is unchanged. A malformed answer throws and does not prune. A slow answer past the hook deadline does not prune.
- **Rough LOC:** not sized. swe-04 owns the slice. The bugfix against `compact.ts:285` is the part this lineage insists on.
- **Verdict:** later. Row 44 does not flip into a per-request filter. The compaction-boundary form is the one BASE2 already ranked as R19, and it still needs gold and the throw.
- **Confidence:** confirmed that the default keep exists. Inferred that a local backend would make the privacy half acceptable. A labeled keep/drop set would confirm the accuracy half.
- **Kill criterion:** on a fixed transcript fixture, a missing answer keeps a tool result (today's `compact.ts:285`), or a measured cache-read loss exceeds the tokens removed. Either printed result drops the live form. An offline census that only records the two probabilities and does not edit the transcript survives that kill.

## Sources Consulted

- `R/pi-jev-context-main/README.md:14-37`, `:48-65`, `:80-105`
- `R/pi-jev-context-main/src/index.ts:255-275`
- `R/jev-cli-main/docs/route.md:1-38`
- `R/jev-cli-main/docs/rerank.md:1-26`
- `R/jev-cli-main/docs/compact.md:1-37`
- `R/jev-cli-main/src/core/route.ts:110-128`
- `R/jev-cli-main/src/core/rerank.ts:70-81`
- `R/jev-cli-main/src/core/compact.ts:60-75`
- `R/jev-cli-main/src/vendor/compaction/compact.ts:58-70`, `:111-114`, `:284-285`
- `R/claude-jev-main/src/infrastructure/fs-source-reader.ts:10-33`
- `P/context/deem-main/serve/deem_mcp.py:1-22`, `:46-142`
- `P/context/deem-main/docs/MODEL_CARD_9B.md:35-36`
- `P/context/deem-local.md:34-38`, `:50-52`
- `B2:394-421`, `:794`, `:797`, `:799`
- Byte count: Python read of `deem_mcp.py` lines 46-120, 2,225 bytes. No Deem process.
- No `steer.md`.

## Assessment

newInfoRatio: 0.85

Novelty: the 2,225-byte schema count and the fail-open at `compact.ts:285` are not in BASE2 section 7. Rows 44, 47, and 49 are quoted as BASE2's and then reopened on the cited lines. The reopen of row 44 (cache and error persistence, not latency alone) is new evidence on a known drop.

Confidence: the byte count and the `?? { keepCall: 1 }` line are confirmed. Savings per week are UNKNOWN.

Convergence telemetry: ratios 0.90, 0.95, 0.85. Mean of the last three is 0.90, above 0.05. Mode is off. Continue to wave 2.

## Reflection

What worked: counting the schema slice instead of arguing that MCP is "heavy" without a number. Reading the default on the line after the question BASE2 adopted.

What failed: wire JSON of `tools/list` is not measured. Executing `deem_mcp.py` is out of bounds.

Ruled out: Deem MCP as the context-reduction seam. Ruled out: flipping row 44 into a per-request filter because the call is now local. Ruled out: porting `rerank.ts:77`. Ruled out: using the 9B long-state vendor claim as evidence about the served 0.8B.

## Recommended Next Focus

grok-04, wave 2. Read the newest sibling iteration of each other lineage first, then classify every round-1 and round-2 drop by its load-bearing reason.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| MCP tool schemas are 2,225 source bytes versus 0 for a hook, and `state` is a required argument | new | `deem_mcp.py:46-120`, byte count |
| BASE2 has no MCP row | new | search of `B2` for `MCP` |
| `compact.ts:285` fail-opens a missing answer to keep the call and the result | new | `compact.ts:284-285`. BASE2 section 7 cites `:58-69`, not `:285` |
| Row 44 does not rest on latency or egress alone | confirms BASE2 with the README lines opened | `B2:794`, `README.md:85`, `:87` |
| Row 47 is a default-zero bug, not a latency drop | confirms BASE2 with `rerank.ts:77` opened | `B2:797` |
| 9B long-state 788 ms is not a 0.8B measurement | restated as a vendor claim, applied to this question | `MODEL_CARD_9B.md:35-36` |

## Hand-off

- grok-04 should treat row 44 as not flipped by the 60 ms figure. Cache invalidation and post-error pruning remain.
- The compact fail-open is the anti-pattern swe-04 should delete if it slices R19.
- Wire size of `tools/list` is still UNKNOWN. Do not quote 2,225 as the JSON payload.
