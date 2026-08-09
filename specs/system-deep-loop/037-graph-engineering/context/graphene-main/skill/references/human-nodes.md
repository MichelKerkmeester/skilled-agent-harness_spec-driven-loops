# Human nodes

A human node blocks **its dependents**. It does not block the graph. Everything
not downstream of it keeps running while the person is at lunch.

## Posing the question

```
gr await <node> --graph <g> \
  --ask "Send this to 47 churned customers?" \
  --options approve,revise,cancel \
  --context <belief-ids> \
  --unblocks approve=<send-node> \
  --unblocks revise=<redraft-node> \
  --unblocks cancel= \
  --on-timeout escalate:86400000
```

## `--unblocks` is what makes the gate a gate

Without it, **every answer releases every dependent** — the person says "cancel"
and the send node is claimable anyway. `gr check` refuses a plan whose human node
has dependents and does not say what each answer releases (`ungated-choice`).

An option mapped to nothing is how "no" is expressed: `--unblocks cancel=` skips
every dependent. In a `task.v1` document the same thing is `ask.unblocks`, by
local name:

```json
{ "id": "approve-send", "job": "human",
  "needs": ["draft"],
  "ask": { "question": "Send it?", "options": ["send", "cancel"],
           "unblocks": { "send": ["send-email"], "cancel": [] },
           "on_timeout": "escalate:86400000" } }
```

`--on-timeout` has **no default**, and that is deliberate: silence must never be
indistinguishable from approval.

| Value | Meaning |
|---|---|
| `wait` | wait indefinitely |
| `expire:<ms>` | after the deadline the node fails; dependents do not run |
| `escalate:<ms>` | after the deadline it is raised, still unanswered |

Choose by what happens if nobody answers. If proceeding without an answer is
wrong, never use anything that lets the work continue.

## `--context` is the whole design

A person reading `gn_7f3a…` in Slack has no context and will not go get any. So
the context travels with the ask.

`gr node <id>` returns, for a pasted id:

- the ask and the options
- the beliefs it rests on, each with its current truth state
- **which of them are stale or contested**
- what each answer unblocks

Pass every belief the decision depends on. A gate whose premises are invisible is
a rubber stamp, and a rubber stamp is worse than no gate.

## The cold-context protocol

The user pastes an id. Do this, in this order:

1. `gr node <gn_…>` — **first**, before you say anything
2. If any context belief is `BOTH` (contested) or stale, **say so up front.**
   *"The draft is ready, but the churn list it was built from was rewritten after
   this was drafted."* That sentence is the product.
3. Present the ask and the options in the user's terms
4. `gr resolve <node> --graph <g> --by <who> --choice <option> --input '{…}'`

`--choice` must be one of the declared options. `--input` carries any structured
answer the node's schema asks for.

## Placing them

Gate where a mistake is expensive to undo, and nowhere else.

Every irreversible capability needs a human node on **every** path to it —
`gr check` enforces that part. What it cannot enforce is that the gate is
meaningful: a gate on a step nobody can evaluate is theatre.

Put the gate where the person can actually see the consequence. Immediately
before the send, with the draft and the recipient list in `--context`. Not three
nodes earlier where the thing being approved does not exist yet.

## While waiting

`gr awaiting <graph>` lists everything a person owes you. When `gr status`
returns `report-awaiting`, tell the user exactly which decisions are outstanding
and **stop** — do not answer on their behalf, and do not pick the option that
lets you keep going.
