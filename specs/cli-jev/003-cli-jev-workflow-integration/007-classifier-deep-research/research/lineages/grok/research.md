# grok lineage synthesis

Label: grok. Session: fanout-grok-1790490452777-942a1f. Stop: maxIterationsReached. Ten iterations, angles grok-01 through grok-10. Convergence mode was off. The last-three mean at iteration 10 was 0.67, above 0.05, and was not used as a stop.

This file answers questions A–H from this lineage only. Sibling files were read from wave 2 onward and are named in each iteration's sibling check. mimo and glm had no iteration file at the wave-4 reads.

## Order

Zero-call census first; no new client unless D3 is amended; one-question flip next and only on a pinned commit; no judgment arm until that flip is at most 0.10; Jev arms stay on their existing kill rules.

No idea in this lineage is build-now.

## A. Context

A classifier cuts context only where it replaces a block the main AI would otherwise read, and only after a measured answer on the served commit. That measurement does not exist (`P/context/deem-local.md:52`).

The Deem MCP tool schemas are about 2,225 source bytes and require `state` (`serve/deem_mcp.py:46-120`, iteration 3). A hook adds zero tool-schema bytes. MCP is the wrong shape for a context cut (N-grok-03-1, drop).

`compact.ts:284-285` fail-opens a missing answer to keep both the call and the result. A two-noul at the compaction boundary is the one later seam (N-grok-03-2), and only if a missing answer throws. It does not ship on the 0.8B card's 96.3%.

The server pads each batch to the longest row and has no input-length cap (`serve/deem_server.py:203-211`). LOCAL p50 near 60 ms is for short synthetic inputs. Transcript-sized latency is UNKNOWN. Warm p95 does not revive a live hook (N-grok-04-1). Rows 1 and 5 stay unknown until a spawn-included p95 exists, per the lead note on iteration 4. This synthesis does not harden that to a no.

## B. Manual review

Design review findings need a file and a line (`sk-design` review checklist, iteration 6). jev-review's five nouls return probabilities, not that shape. A classifier on a checklist is dropped (N-grok-06-2).

`classify_intents` and `select_intents` are not defined in a runtime module under `.skilled` (iteration 9 search). N-grok-06-1 stays dropped, and the premise "deterministic code already does this" is not confirmed.

## C. Tool output

Row 47 maps a missing noul to 0 (`rerank.ts:77`). That is a default score. It stays dropped. Row 44's compaction filter is not a per-request filter, and it is not revived by latency alone (iteration 3). Row 38 (PostToolUse Bash) is unknown: local inference removes the egress objection, and whether a command hook can replace tool output was not settled here.

## D. Gates

A classifier advisory is not a closure gate. deepseek-03 says the closure gate stays the acceptance-criteria check. This lineage agrees and did not reopen `validate.sh`.

## E. Prompt frameworks

The skill text claims seven frameworks. The registry holds five ids (iteration 5). `sweep-benchmark.cjs:45-48` is the runtime reader of that registry found in this search. N-grok-05-1's context-savings claim falls. CLEAR is a 50-point sum, not a label set (N-grok-05-2, drop).

## F. Design routing

The design hub has no archived routing-accuracy run (iteration 6). Fifty-three playbook files are a procedure count, not a routing error rate. No classifier phase replaces the hub router.

## G. Two backends

Python `jev-cli` always sends a bearer token and exits 3 without a key. Deem's server does no auth (`deem_server.py` CORS and health, iteration 7). Choice and score bodies use `options` and `levels` on Deem and `criteria` on jev. `criteria` is not rendered into Deem's prompt (`format.py:298-303`).

The Deem transport is its own client: post Deem's body, send no bearer token, translate answer keys, refuse a stub backend by reading `backend` (ALL-4), store the `deem-ctl status` commit pair, and do not threshold (N-grok-07-1, later). Patching `jev-cli` is a fork (N-grok-02-1's home is withdrawn). jevctl is a different package (N-grok-02-2, drop).

D2 says derive `cli-deem` from `cli-jev`, and the same sentence says the research decides the shape (`goal.md:50`). This lineage derives the printed contract, not the HTTP call. D3 says the 0.8B server is what gets built and nothing else (`goal.md:51`). The client waits on an amendment.

Health returns status, model, and backend (`deem_server.py:772-777`). It does not name the calibration file. `deem-ctl update` has no pin (iteration 7). No calibration file names `deem-0.8-v1` (iteration 1). Do not threshold raw temperature 1.0 (N-grok-01-2, later).

## H. What not to copy, and what stops the work

Tare's permutation flip is option-order stability. R1's 0.10 is rerun stability of one pick (`B2:233`). The conditioned gate passes a uniform guesser (`eval/tare/metrics.py:462-468`). Do not replace R1's cap with it (N-grok-08-1, drop). The improvement harness returns a perfect coefficient when the mean is 0 (`benchmark-stability.cjs:102-108`). That is a third statistic. Do not merge them.

JevBench hard Jev 74.1 versus Deem 9B 65.8 is a vendor row for the 9B (`docs/MODEL_CARD_9B.md:27-30`). It is not the served model. deem-v2's flip 0.968 is not the release. The serve README's 11.3 ms table is an older checkpoint. LOCAL speed and memory are measurements. They are not accuracy.

Stop Deem judgment arms when a three-rerun flip on one fixed choice is above 0.10, or the commit pair changes during those calls (N-grok-08-2). Stop Jev's remaining arms when R1's keep rule prints kill. With neither backend, behavior stays today's (`goal.md:49`).

## Ideas

| Id | Verdict |
|---|---|
| N-grok-01-1 | drop (restates D3; do not lean on it) |
| N-grok-01-2 | later |
| N-grok-02-1 | home withdrawn; the field rewrite lives in N-grok-07-1 |
| N-grok-02-2 | drop |
| N-grok-03-1 | drop |
| N-grok-03-2 | later |
| N-grok-04-1 | drop as a hook revival; rows 1 and 5 stay unknown pending spawn |
| N-grok-04-2 | later |
| N-grok-05-1 | later; savings claim fallen |
| N-grok-05-2 | drop |
| N-grok-06-1 | drop; "code already does this" unverified |
| N-grok-06-2 | drop |
| N-grok-07-1 | later |
| N-grok-08-1 | drop |
| N-grok-08-2 | later |
| N-grok-09-1 | drop (the table is not a phase) |
| N-grok-10-1 | drop as a build; the order line stands |
