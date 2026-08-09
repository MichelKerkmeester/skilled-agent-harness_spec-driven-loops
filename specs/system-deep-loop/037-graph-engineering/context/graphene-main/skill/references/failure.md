# When things go wrong

Two different things happen and they are not the same. **A refusal is a result.
A failure is an outcome.**

## Refusals

Exit code 0, structured JSON, and **every one names what to do instead**. That is
enforced by a totality test, so you can always act on the `suggestion` field
without parsing prose.

```json
{
  "refused": {
    "code": "stale-premise",
    "suggestion": "rebind-and-reclaim",
    "reason": "…",
    "detail": { "stale": [{ "belief": "gb_…", "state": "out" }] }
  }
}
```

| Code | Suggestion | Do |
|---|---|---|
| `already-claimed` | `claim-another` / `wait-for-release` | take a different node |
| `stale-premise` | `rebind-and-reclaim` | re-read the named beliefs, claim again |
| `claim-revoked` | `rebind-and-reclaim` | your lease lapsed or you were preempted — stop writing, re-claim |
| `not-claimable` | — | the node is not `ready`; `gr status` |
| `bad-graph-state` | `advance-graph-state` | the graph has not reached `running` |
| `output-schema-violation` | — | your output does not match the node's declared schema |
| `budget-exhausted` | `reduce-scope-or-raise-budget` | **stop and tell the user which dimension ran out** |
| `type-forbidden` | `contradict` | you tried to retract an observation |
| `no-observation-proof` | `observe-again` | superseding an observation needs a fresh one |
| `same-source-corroboration` | `corroborate-from-distinct-source` | one source twice is one witness |
| `would-cycle` | — | this `derives-from` closes a loop |
| `would-complete-nogood` | `drop-a-member` | this derivation completes a recorded impossibility |
| `not-found` | — | wrong id or wrong graph |
| `already-applied` | `already-applied` | no-op; carry on |

**Never retry a refusal unchanged.** It already told you what to fix. Retrying a
`stale-premise` without re-reading is how you do the work on a dead premise
anyway.

**Read the payload, not the exit code.** A refusal exits 0 on purpose, so
`gr done … && echo ok` prints `ok` for work that was never recorded. If you must
branch on the exit code, pass `--quiet`, where a refusal exits **5**.

## Failures

```
gr fail <node> --graph <g> --reason "zendesk returned 503 on three attempts" --retryable
```

`--retryable` is your judgment about the *cause*, not your appetite for trying
again:

- **retryable** — transient. Rate limit, timeout, 5xx, a lock held elsewhere.
- **not retryable** — the plan is wrong. Missing permission, an endpoint that
  does not exist, a schema that cannot be satisfied, an assumption that is false.

Calling a plan error retryable buys three identical failures and a bigger bill.

Write the reason for whoever reads it cold — what you tried, what came back. It
lands in the log and in the UI.

## After a failure

Dependents do not run; nothing downstream silently proceeds on missing input.
`gr status` tells you what is still claimable — usually plenty, because the
independent branches are unaffected.

If the failure invalidates something you recorded, say so:

```
gr contradict <belief> --graph <g> --reason "the source returned an error, not data" --evidence <job-belief>
```

## When the plan itself is wrong

Do not patch around it. Two commands exist for this:

```
gr amend <graph> --reason "…"    # derive a new graph, carrying completed outputs forward
gr cancel <graph> --reason "…"   # stop; outstanding work skipped, claims released
```

`amend` is the one you want when the shape was wrong but the work done so far is
still good. Completed outputs come forward; you replan the rest. The original
graph stays in the log — the record of what was attempted is not erased by
correcting it.

## When your lease lapses

`gr checkpoint <node> --graph <g> --state '<progress>'` at every edge crossing.
It renews the lease and records where you got to.

If you are preempted, another session picks the node up from your last
checkpoint rather than from nothing. A long node with no checkpoints is a long
node that restarts from zero.

## When the graph outlives you

It is designed to. `gr attach` from a new session, `gr status`, and keep going.
The store is the truth; the server only carries the push. Killing the server
costs you notification latency, not data.
