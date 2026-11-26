---
title: "Third review: fresh Opus high review of the advisor 2.0.1.0 on main"
description: "A read-only Opus high review of the skill advisor as shipped at 2.0.1.0, with the findings it returned and what the session confirmed by rerunning them."
trigger_phrases:
  - "advisor 2.0.1.0 third review"
importance_tier: "normal"
contextType: "review"
---
# Third review: fresh Opus high review of the advisor 2.0.1.0 on main

A fresh native Opus high subagent reviewed the skill advisor read-only on main. It covered the 2.0.1.0 fixes and the three deep-loop commits another session shipped under the same version (`314eba8c199`, `d5f69f4e82e`, `b447c3b8ba2`, with `e21bcbd3b65` beside them). It found no P0, two P1 and five P2.

## Findings as reported

1. **P1, confirmed by the reviewer.** The Python native bridge env list carries only the two location keys. The launcher also forwards the lane weights, the two shadow switches, the shadow delta switch, the two thresholds, the doc trigger switch, compiled routing and the private skill roots. A lane-weights override left the bridge's result unchanged, and adding the key to the list in memory changed it. The changelog's "Documented settings now reach every process that reads them" is false for the bridge.
2. **P1, confirmed by the reviewer.** Bare `iterative`, `iteratively` and `iterations` in the loop wording open a deep-loop run when they only describe the subject. "review the code for the iterative solver" got `/deep:review`, and the same prompt with "recursive" got none.
3. **P2, confirmed by the reviewer.** The Python fallback has none of the deep-loop gating. It offers a run row for a stuck-run complaint and tops the loop hub for a piece written about the loop.
4. **P2, confirmed by the reviewer.** A route-exclusion change never reaches a daemon that is already running. The loader caches the list for the life of the process.
5. **P2, confirmed by the reviewer.** `ENV-REFERENCE.md` lacks four keys `.env.example` documents: the BM25 lexical shadow, the feedback calibration shadow, the feedback calibration path and the route exclusions folder.
6. **P2, inferred by the reviewer.** The new tests check the filtered env list rather than behavior, and no test or corpus row uses `iterative` as an adjective.
7. **P2, confirmed by the reviewer.** "do one more iteration of the review" got no command.

## What the session confirmed

| Finding | Session check | Result |
|---|---|---|
| 1 | Compared the bridge list with the launcher list in `skill_advisor.py` and `system-skill-advisor-launcher.cjs` | Confirmed. Nine scorer keys and the private skill roots are launcher-only |
| 2 | Ran the minimal pairs through `skill-advisor.cjs` | Confirmed. "the iterative solver" got `/deep:review` with the loop hub on top, "the recursive solver" got sk-code with no command |
| 4 | Read `runtime/lib/route-exclusions.ts` | Confirmed from the code. The set is loaded once per process, and the prompt cache key does not cover the file |
| 7 | Ran four phrasings through `skill-advisor.cjs` on main | Not reproduced. Every phrasing got `/deep:review`. The `one` count came in with `e21bcbd3b65`, so the finding predates it |

The reviewer's full report is the source of the requirements REQ-012 to REQ-016 in `spec.md`.
