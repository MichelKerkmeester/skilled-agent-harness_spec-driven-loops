---
name: graphene
description: Plan work as a graph, run it, coordinate across sessions, and ask humans for input without blocking. Use when a task decomposes into parallel pieces, when work must survive a session ending, when several agents share one job, or when an irreversible action needs a person's approval. Also use when the user pastes a bare `gn_…` id.
---

# Graphene

Graphene holds the graph you work through: what is ready, what is claimed, what
each node concluded, and who is doing what. It pushes changes to every session
attached to the same graph.

**It never calls a model and never executes a node.** It tracks; you do the
work. Nothing here decides anything for you.

## The mental model

This is not a task list and not a database. It is a **work graph over a belief
store**: every node declares what it needs and produces, and every fact you
record carries where it came from, what it rests on, and whether you currently
believe it.

You can un-believe a conclusion. You cannot un-believe an observation — you
observe again, or you record that something contradicts it.

If you take away only that paragraph, most correct usage follows.

## Run `gr status`. Do what it says. Repeat.

The procedure is deterministic, so it lives in the tool rather than in your
memory of this file. `gr status` returns a `next_action`:

| `next_action` | You do |
|---|---|
| `check` | `gr check <graph>` |
| `fix-check-errors` | read each `fix_hint`, fix, re-check |
| `review` | claim and run the review nodes ([review.md](references/review.md)) |
| `resolve-findings` | `gr findings <g> --open`, then `gr finding <gf_…> --graph <g> --resolution applied\|rejected --reason …` |
| `present-to-user` | show the plan and **wait** — do not start it yourself |
| `start` | `gr start <graph>` |
| `claim` | `gr claim <node> --graph <g> --assumes <beliefs>` |
| `report-awaiting` | tell the user which nodes need them, and stop |
| `wait` | `gr wait --graph <g>` — blocks until something happens |
| `finish` | nothing outstanding; you are done |
| `nothing` | terminal graph; `gr clone` it to run again |

Read [workflow.md](references/workflow.md) for the four situations you can be
in, and which one you are in right now.

## The four entry points

You are always in exactly one of these. Identify it before doing anything.

**Plan** — the user gave you a task.
`gr new` → draft a `task.v1` document → `gr plan` → `gr check` → instantiate the
review subgraph → run the reviews → **present the plan and wait for the user to
say go**. Never start a plan you drafted without being told to.

**Work** — you are attached to a running graph.
`gr status` → `gr claim` → do the work → `gr done` → `gr wait`. Loop.

**Resolve** — the user pasted a bare `gn_…` id.
**Run `gr node <id>` before anything else.** It returns the ask, the beliefs it
rests on, which of them have gone stale, and what each answer unblocks. Take the
user's input, then `gr resolve`.

**Join** — a new session on a graph that already exists.
`gr attach <graph>` → `gr status` → work. You are a worker; the graph outlives
you.

## Decomposition — the part that is actually hard

`gr check` catches structure. It cannot tell you whether your decomposition is
any good. That is [decomposition.md](references/decomposition.md), and it is the
most important file here.

The one test to remember:

> **A good node is boring. It does one thing, you can test it alone, and you can
> swap it out without touching anything else.**

A node that does several things is a loop with extra steps: it loses testability,
caching, retry, and replaceability all at once.

Before you fan out, ask: *where does this work split into pieces that never read
each other's results?* Split only that. Everything sequential stays in one node.

## The asymmetry

> Leftover structure is visible and cheap. A missing dependency fails silently —
> the work proceeds confidently on a premise nobody checked.
>
> **When two designs feel equally good, choose the one where a mistake is
> loud.**

## Prohibitions

These do more work than the permissions.

- **Do not start a plan you drafted.** Present it; wait for the user.
- **Do not create a node per step of your own reasoning.** A node is a unit of
  capability, not a thought.
- **Do not fan out work that does not split.** Coordinated agents beat one agent
  by ~80% on work that splits — and **every** multi-agent configuration loses,
  by 39–70%, on sequential work that needs the full picture.
- **Do not gate everything.** A rubber-stamped gate is worse than no gate: it
  manufactures assurance nobody earned.
- **Do not skip the merge owner on a fan-in.** One coordinator owning the merge
  cuts error amplification from 17.2× to 4.4×.
- **Do not leave `--assumes` empty** on a node that reads shared state.
- **Do not build a graph for trivial work.** A one-node graph is a correct
  answer. A two-node graph for a two-step task is overhead.

## Recording what you believe

Record a belief when a later decision will rest on it, and **declare what it
rests on**. That is what lets Graphene tell you, later, that your premise died.

```
gr believe --graph <g> --content "…" --source "zendesk#tickets/c17" --shared
gr believe --graph <g> --content "…" --provenance derived --derives-from <ids> --source inference
```

`--shared` marks a fact about a resource other sessions can also see. Those are
the ones that cause silent divergence, so mark them honestly.

When you write to a source, say so: `gr stale --graph <g> --source <ref>`.
Everything read from it is marked, and every conclusion resting on it becomes
contested — including a draft already sitting in front of a person.

Full rules: [beliefs.md](references/beliefs.md).

## Reference files

| File | Read it when |
|---|---|
| [workflow.md](references/workflow.md) | Deciding which entry point you are in, or what `next_action` means |
| [decomposition.md](references/decomposition.md) | **Drafting a plan.** The hard half. |
| [nodes.md](references/nodes.md) | Writing the `task.v1` document — kinds, schemas, bindings, budgets |
| [human-nodes.md](references/human-nodes.md) | Any node a person must answer |
| [beliefs.md](references/beliefs.md) | Recording facts, contradicting them, read-sets |
| [review.md](references/review.md) | Instantiating and running the review subgraph |
| [failure.md](references/failure.md) | A node failed, or a claim was refused |

`examples/` holds runnable graphs — read them as artifacts in the format you are
about to produce. They pass `gr check`, except the two named `BAD-*`, which fail
on purpose and are the lesson.
