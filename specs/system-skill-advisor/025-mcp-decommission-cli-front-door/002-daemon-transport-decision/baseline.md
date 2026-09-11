---
title: "Baseline: advisor prompt-path latency before the transport removal"
description: "Measured pre-change latency for the Claude prompt hook, the CLI front door, cold daemon start and the Python shim, with the daemon decision the numbers support."
trigger_phrases:
  - "advisor latency baseline"
  - "hook latency baseline"
  - "advisor cold start"
  - "daemon versus stateless"
importance_tier: "important"
contextType: "reference"
---
# Baseline: advisor prompt-path latency before the transport removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Taken at `6012ec5c7d` on `skilled/v4.0.0.0`, on the host that runs this repository, against
> the live skill graph. Every figure below is wall-clock around a real process invocation.

---

## 1. MEASUREMENTS

One prompt was used throughout: *refactor the authentication middleware and add tests*. It
routes to `sk-code` at confidence 0.82 on every path, so the paths are doing comparable work.

| Path | n | min | p50 | p95 | max |
|------|---|-----|-----|-----|-----|
| Claude prompt hook, end to end, warm daemon | 10 | 1714 | **2096** | 2415 | 2845 |
| CLI `advisor_recommend`, live warm daemon | 10 | 684 | **823** | 998 | 1466 |
| CLI `advisor_recommend`, isolated warm daemon | 8 | 755 | **926** | 1029 | 1029 |
| CLI `advisor_recommend`, cold, first call spawns the daemon | 1 | - | **3008** | - | - |
| Python shim, per call | 6 | 2612 | **2810** | - | 3024 |

All values in milliseconds. The isolated runs used a separate socket directory and a copied
database so the live daemon was never touched; their agreement with the live numbers, 926
against 823 at p50, is what makes the cold figure trustworthy.

---

## 2. WHAT THE NUMBERS SAY

**The daemon is worth about two seconds on first contact.** Cold start costs 3008 ms against a
warm p50 of 926 ms on the same daemon. That 2082 ms is what a session pays once today, and what
it would pay on *every* call if nothing stayed resident.

**The CLI front door is faster than the path the Claude hook uses today.** The hook costs 2096 ms
at p50; the CLI costs 823 ms. This is not a same-workload comparison, because the hook also runs
directive-lifecycle dedup, brief rendering and metrics on top of the routing call. It is still
the comparison that matters for D4, since it is what the caller actually pays.

**The Python shim is not a stateless scorer.** Its output carries `source: native` and the reason
*Matched by native advisor_recommend*, so it spawns and then delegates to the same daemon. Its
2810 ms is the cost of reaching the scorer from a fresh Python process, not the cost of scoring
without a daemon.

---

## 3. THE DAEMON DECISION

**Keep the resident daemon.** The decision is robust, because both routes to it agree.

*On the evidence:* the only measured no-daemon figure is the 3008 ms cold call, which is an upper
bound on what a stateless design would pay per call. A stateless CLI would skip the daemon
handshake but still open SQLite and load the embedder on every invocation, so its true cost sits
between 926 and 3008 ms, against 926 ms for the resident design. Nothing in that range beats
keeping the daemon.

*On the rule:* D3 says an inconclusive measurement keeps the daemon. A true stateless prototype
was not built, so the comparison is a proxy rather than a head-to-head. Under D3 that is
inconclusive, and inconclusive keeps the daemon.

Both readings land in the same place, so the daemon survives whether or not the proxy is
accepted as sufficient. **No stateless prototype needs to be built.**

---

## 4. THE LATENCY BUDGET

Phase 008 reports the post-change delta against these figures.

| Gate | Budget |
|------|--------|
| CLI `advisor_recommend`, warm | p50 must not exceed 1100 ms, which is the live warm p50 plus one third |
| Claude prompt hook, end to end, warm | p50 must not exceed 2096 ms, the current figure. The rewire is expected to lower it, not raise it |
| Cold first call | must not exceed 3500 ms |

A breach is reported as a number, not absorbed.

---

## 5. WHAT REMAINS OPEN IN THIS PHASE

- The socket protocol contract that replaces the MCP JSON-RPC framing, including framing, error
  shape and version negotiation.
- The session warm mechanism per runtime. The CLI already has a warm-only mode; what invokes it
  once no MCP client connection starts the daemon is undecided.

---

## 6. METHOD NOTES

- A first attempt to isolate the daemon under the session scratchpad failed: the socket path
  exceeded the Darwin `sun_path` limit of 104 characters and the CLI refused with exit 69. Those
  runs returned in 87 ms and measured only the error path. They are excluded. The retry used a
  short path under `/tmp` and is what section 1 reports.
- The isolated daemon and its temporary database were removed after the run.
