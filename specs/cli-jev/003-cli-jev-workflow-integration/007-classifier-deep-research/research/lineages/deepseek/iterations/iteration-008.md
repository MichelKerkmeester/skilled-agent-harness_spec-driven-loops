---
title: "Iteration 8 — deepseek-08: A live Deem seam: warm or cold, and the precompute route"
trigger_phrases: []
---

# Iteration 8 — deepseek-08: A live Deem seam

## Focus

Angle **deepseek-08** (W3): *A live Deem seam: warm or cold, and the precompute route.* Maps to questions C and G; answers angle questions 1 to 5. W3: the newest sibling files were read in iteration 7 and the relevant ones are named in the Sibling check.

## Actions Taken

1. Read the host's `session.compact` function-hook contract in the vendored types: `context/external repo's/jev-cli-main/plugin/hooks/types/claude-code.d.ts:3310-3325` (the event and the `precompute` example), `:7196-7218` (what is kept on `precompute`), `:7258-7270` (skip semantics), `:7278-7287` (the trigger union and "installs nothing").
2. Re-read `SSK/runtime/hooks/claude/compact-inject.ts:237-239`, `:440-463`, `:488-497`, `:519-531` and `shared.ts:11-16` for the PreCompact budget (iteration 4 F2).
3. Re-read `.claude/settings.json:215-222` (command hook only) and searched the repo for `session.compact`/function-hook use (none in source; only benchmark text).
4. Read `.skilled/bin/lib/model-server-supervision.cjs:224-234` and `launcher-model-server-idle-eviction.vitest.ts:139-152` (idle eviction as the repo's own pattern; iteration 2 F7).
5. Cited `LOCAL` by line for the footprint, RSS, startup and control-table facts (per the steer: no re-derivation).
6. Nothing was started, stopped or called.

## Sibling check

- `grok/iterations/iteration-010.md` (newest): its stop lines for Deem (flip above 0.10, commit-pair change) and its one-phase order are quoted as grok's; this iteration adds the lifecycle the live form would need, not an order.
- `mimo/iterations/iteration-001.md`: its context baseline is what a precompute pass would have to beat; quoted as mimo's.
- `swe/iterations/iteration-002.md` and `glm/iterations/iteration-001.md`: read in iteration 7; neither touches the precompute contract. No contest.

## Findings

**F1 (new; answers angle question 1). A live seam needs a warm server or it does not fire, and "warm" costs a permanent 3,368 MB footprint.** Warm: connect + p50 60.2-60.5 ms / p95 62.8-78.5 ms per primitive (`LOCAL:34-38`), inside every budget iteration 4 measured (advisor 2,200 ms, PreCompact 1,800 ms). Cold: about 10 s to healthy (`LOCAL:44`), so a hook that meets a stopped server waits out its timeout or gets refused immediately — either way it skips. Idle: the server holds 3,368 MB physical / 814 MB RSS for as long as it runs (`LOCAL:42-43`); the repo evicts its own embedder only when the operator enables `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` (`model-server-supervision.cjs:224-234`; test `:139-152`), and Deem has no eviction because it is operator-owned (iteration 2 F7, N-deepseek-02-4). An update restart (`deem-ctl:160-173`) is the same cold case for about 10 s plus the smoke call. [SOURCE: `LOCAL:34-44`; `.skilled/bin/lib/model-server-supervision.cjs:224-234`; `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:139-152`; `~/.local/share/deem/bin/deem-ctl:160-173`]

**F2 (new; answers angle question 2). The host's precompute route is real and exactly right in shape: a `session.compact` dispatch with `trigger: "precompute"` runs ahead of the compaction, computes nothing on a skip, and keeps its result only "if the conversation it ran over still leads."** The vendored types describe `session.compact` firing on `/compact`, the threshold, a plugin, or "ahead of time", with `trigger` passed through (`claude-code.d.ts:3310-3323`); the trigger union includes `precompute` and states it "is the one dispatch that installs nothing: its result is kept for the compaction that comes, if the conversation it ran over still leads" (`:7278-7287`); `tokensAfter` is absent on precompute (`:7209-7214`); and a skip on precompute "nothing is computed or kept" (`:7261-7265`). That last clause is a staleness rule the repo can mirror: a precomputed classifier result is used only while the session it ran over is still the one compacting. [SOURCE: `context/external repo's/jev-cli-main/plugin/hooks/types/claude-code.d.ts:3310-3325`, `:7196-7218`, `:7258-7287`]

**F3 (new; answers angle question 2's availability half). The repo has no route to that dispatch today: `session.compact` is a function-hook event, the installed settings carry only command hooks, and the vendored plugin that uses it is refused.** `.claude/settings.json:215-222` registers one PreCompact command hook (`compact-inject.js`); a search of source (excluding benchmarks and fixtures) finds no `session.compact` registration anywhere in `.skilled`. The vendored npm plugin is research material only (BASE2 rows 6 and 43), and function hooks are early access (BASE1 row 5's note). So a precompute route here cannot be a host dispatch unless a plugin ships; what the repo can build instead is a **background pass**: an async command hook (the `Stop` hooks already run async with 10 s, `settings.json:158-178`) or an agent-invoked script computes a candidate result and stores it in hook state with the session id; `compact-inject` reads it only when the session still matches. That is the same shape as the host's contract, minus the host dispatch. [SOURCE: `.claude/settings.json:158-178`, `:215-222`; iteration 4 F2; BASE1 row 5; BASE2 rows 6 and 43]

**F4 (new; answers angle question 4). The exact lines the main AI sees, per backend state, are the iteration-1 skip lines, with the cold and restart cases folding into "not reachable".**

| State | Probe result | Printed line |
|---|---|---|
| No server / refused / timeout | transport failure | `deem arm skipped: server not reachable` |
| Warming up (~10 s) or mid-update restart | refused while the port is unbound | `deem arm skipped: server not reachable` |
| Stub backend on 8300 | `backend: stub` | `deem arm skipped: stub backend` |
| Real backend, unexpected id | `model` mismatch | `deem arm skipped: unexpected model <found>` |
| Non-JSON or non-object answer | parse failure | `deem arm skipped: health response malformed` |
| Server stopped mid-session after a cached pass | call refused | the row is `unmeasured`; the next probe prints the skip line |

No path starts, restarts or keeps the server; no path retries inside a hook (iteration 4 F8). [SOURCE: iteration 1 F1-F6; iteration 4 F8; F1]

**F5 (new; answers angle question 5). The kill criterion for any live form, as printed results.** A live form dies when (a) its measured connect+call p95 (with the seam's normal work in place) exceeds the remaining budget after spend (`kill: latency` — measured, not estimated); (b) its skip rate on the target seam exceeds a pre-registered ceiling because the server is cold or absent (`kill: cold <n>%` from the arm's own log); or (c) its judgment loses to the no-model baseline on the seeded labels (`kill: accuracy`). The advisor form (row 1) additionally dies unless R1 prints `keep` (iteration 5). The precompute form dies if no host dispatch exists and the background pass's cache is stale more often than it is used (`kill: stale cache`), mirroring the host's "still leads" rule. [SOURCE: F2; F3; iteration 4 N-deepseek-04-1; iteration 5 F8]

**F6 (new; the recommendation). No live PreCompact command-hook form ships; the precompute-shaped background pass is the only live compaction home, and the advisor form stays conditional on iteration 5's gate.** The command hook's merge spend is still uncounted (iteration 4 F6), while the background pass moves the call off the critical path entirely and inherits the host's staleness contract (F2-F3). The advisor form remains the one conditional flip: Node-native connect+call, R1 `keep`, measured p95 with the advisor's compiled-route work in place. [SOURCE: iteration 4 F6; iteration 5 F8; F2-F5]

## Per-Idea Records

### N-deepseek-08-1: The background precompute pass

- **Idea:** A pass invoked off the compaction path (async `Stop` hook or a script the agent runs) that computes the classifier's candidate result for the current session and stores it in hook state keyed by session id and input hash; `compact-inject` uses it only when the key still matches, else it drops it and follows today's path. No host plugin, no new hook event, no server start.
- **Question:** C, G.
- **Builds on:** F2-F3; `compact-inject.ts:519-545` (state updates and budget guards).
- **Value:** A local call fits any deadline when it is not on the deadline; the compaction brief then costs a state read.
- **Seam:** A new async pass beside the Stop hooks (`settings.json:158-178`); reader in `compact-inject.ts`.
- **Metric, baseline, harness:** Metric: cache hit rate and staleness rate per boundary; baseline: UNKNOWN (R19's census produces boundary counts); harness: the census plus a fixture that changes the session between pass and compaction (must drop).
- **Savings:** Moves the call off the critical path; token savings are R19's question, not claimed here.
- **Cost, latency, privacy:** One local call per pass attempt; no egress; the pass must not keep a server warm.
- **Two-backend gate:** The pass probes per iteration 1/4; no server → it writes nothing and the compaction path is byte-identical. Jev only with a key and the same skip.
- **Rough LOC:** 80-150 (pass + state schema + reader guard + fixtures).
- **Verdict:** **next, conditional on R19's census and a measured accuracy set** (no quality number exists; `LOCAL:52`).
- **Confidence:** Confirmed: the host contract, the budget mechanics and the staleness clause. Inferred: that the background pass's cache survives long enough to be used.

### N-deepseek-08-2: Kill lines as printed results (F5)

- **Idea:** Freeze the four kill lines (`kill: latency`, `kill: cold <n>%`, `kill: accuracy`, `kill: stale cache`) so every live form reports why it died.
- **Question:** H.
- **Builds on:** F5; iteration 9's failure table.
- **Value:** The synthesis and the operator read one vocabulary for shutting a form down.
- **Seam:** Each arm's log; no new file.
- **Metric, baseline, harness:** The arm's own measured p95, skip rate, accuracy and staleness, each already printed.
- **Savings:** None; it bounds the experiment.
- **Cost, latency, privacy:** None.
- **Two-backend gate:** The lines print regardless of backend; with neither, the form never starts.
- **Rough LOC:** ~4 constants.
- **Verdict:** **build-now as contract text.**
- **Confidence:** Confirmed from the mechanics.

### Dropped: installing the vendored plugin to get a host precompute dispatch

- **Idea:** Register `session.compact` `precompute` through the vendored npm plugin so the host schedules the pass.
- **Reason:** Rows 6 and 43 refuse the vendored plugin, and function hooks are early access (BASE1 row 5); the background pass reproduces the shape without it. Dropped.
- **Confidence:** Confirmed from BASE2 rows 6/43 and F3.

### Dropped: a warm-keeper or auto-start for Deem

- **Idea:** Keep the server warm from a hook or restart it when cold.
- **Reason:** Operator-owned (D3), 3,368 MB held idle (`LOCAL:43`), and a hook that starts daemons breaks the containment the research runs under. Dropped; the skip line is the design.
- **Confidence:** Confirmed from `LOCAL:43`, iteration 2 F7, parent D3.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| The host `session.compact`/`precompute` contract, with the "still leads" staleness clause | new (types opened) | `claude-code.d.ts:3310-3325`, `:7196-7218`, `:7258-7287` |
| No repo route to a host precompute dispatch; function hooks early access; vendored plugin refused | new | `settings.json:158-178`, `:215-222`; BASE1 row 5; BASE2 rows 6/43 |
| Warm/cold/update-restart lines and costs | new analysis over LOCAL + deem-ctl | F1; F4 |
| Four printed kill lines per live form | new | F5; N-deepseek-08-2 |
| Background pass as the only live compaction home | new | F6 |
| Jev gate | restated (BASE2 §11) | — |

## Hand-off

- deepseek-09: F4's state table and F5's kill lines are the Deem half of the failure and kill table.
- deepseek-10: 005's amendment carries N-deepseek-08-1 and the "no command-hook live form" rule; 002 carries the advisor form's condition.
- Synthesis: the precompute form is `next`, conditional on census counts and a measured accuracy set; nothing here is build-now.
