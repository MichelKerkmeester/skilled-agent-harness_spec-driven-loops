# Beliefs

A belief is a fact with a receipt. Three axes, never collapsed.

## 1. Provenance — where it came from. Immutable.

| Provenance | Meaning | You may retract it |
|---|---|---|
| `user-instruction` | the operator's words | **no** |
| `tool-observation` | what a system returned | **no** — contradict, or observe again |
| `derived` | an inference over other beliefs | yes |
| `hypothesis` | provisional, expected to be wrong | yes |
| `artifact` | document or file content | yes |
| `job` | a node execution record | **no** |
| `journal` | a durable lesson | **no** — supersede |

Set at creation and never changed. It is structural — it comes from *how you got
the fact*, never from what the fact says.

The retraction column is the core rule (I6):

> You can un-believe a conclusion. You cannot un-believe an observation — you
> observe again, or you record that something contradicts it.

An agent that could delete an inconvenient observation could talk itself into
anything. `gr retract` on an observation refuses with `type-forbidden` and points
you at `gr contradict`.

## 2. Fidelity — how well established. Rises only with a *distinct* source.

`guessed < claimed < confirmed`

```
gr corroborate <id> --graph <g> --by <the-corroborating-gb_…>
```

`--by` is **another belief**, not a source string. Graphene reads that belief's
source and refuses (`same-source-corroboration`) if it matches one already
supporting the claim — so corroboration is checked rather than asserted.
Re-reading the same API twice is one witness, not two.

Fidelity never falls, and a derived belief takes the **minimum** over its
support. One guess in the chain and the conclusion is a guess.

Sensitivity takes the **maximum**. You cannot launder a restricted fact by
inferring from it.

## 3. Truth state — computed. You never write it.

| State | Means |
|---|---|
| `IN` | believed |
| `OUT` | not believed — retracted, or its support was withdrawn |
| `BOTH` | contested — evidence on both sides |
| `NEITHER` | undetermined — support unresolved |

The fold derives these from the event log, so every state has a derivation you
can print. `gr why <id> --graph <g>` shows it.

`BOTH` **propagates without bound.** A conclusion resting on a contested premise
is contested, and so is everything resting on that, all the way down. A
refutation sitting next to a claim does not neutralize it — that is the whole
point of a four-valued lattice.

## Recording

```
gr believe --graph <g> --content "…" --source "zendesk#tickets/c17"
gr believe --graph <g> --content "…" --provenance derived --derives-from <ids> --source "inference"
gr believe --graph <g> --content "…" --shared --source "salesforce#account/8871"
```

Two rules that make the rest work:

**Declare what it rests on.** `--derives-from` is what lets Graphene tell you,
later, that your premise died. A derived belief with no support is a belief
nothing can invalidate — which sounds convenient and is the bug.

**Mark shared facts `--shared`.** A fact about a resource other sessions can also
see is the one that causes silent divergence: two sessions both locally correct,
globally inconsistent. Marking it is what makes the cascade reach the other
session.

## Changing your mind

**Evidence disagrees.** The belief stays and becomes `BOTH`:

```
gr contradict <id> --graph <g> --reason "…" --evidence <ids>
gr uncontradict <id> --graph <g> --reason "the disagreement resolved in its favour"
```

**A conclusion no longer holds.** Refused on observations:

```
gr retract <id> --graph <g> --reason "…" --evidence <ids>
gr reinstate <id> --graph <g> --reason "it should be believed again"
```

**A corrected version replaces it**, or a set cannot all be true:

```
gr supersede <id> --graph <g> --content "…" --reason "…"
gr nogood --graph <g> --members <two-or-more-ids> --note "…"
```

`gr supersede` on a `tool-observation` requires `--observation-proof` — a plain
sentence saying how you re-observed, like `"re-queried db#schema at 12:04"`.
Without it you get `no-observation-proof`, because superseding an observation
from reasoning alone is exactly the laundering I6 forbids.

`gr nogood` records an impossibility so it stops being re-proposed. Any later
derivation that would complete the set is refused with `would-complete-nogood`.

## After you write to a source

```
gr stale --graph <g> --source "salesforce#report/churn-q3"
```

Everything read from that source is marked, and every conclusion resting on it
becomes contested — **including a draft already sitting in front of a person**.
`gr node <id>` will show it, which is how the human gate stops approving a plan
built on data that moved underneath it.

## Before you claim

`gr claim <node> --graph <g> --assumes <belief-ids>` asserts the read-set. If any
of them is no longer `IN`, the claim is refused with `stale-premise` and the
dead ones are named. Re-read them, then claim again.

Leaving `--assumes` empty on a node that reads shared state is how two sessions
diverge without either noticing.

## Inspecting

```
gr belief <id> --graph <g>       # the full record
gr why <id> --graph <g>          # what it rests on, and what falls with it
gr dependents <id> --graph <g>   # what would fall if this went
gr contested <graph>             # everything currently BOTH
gr history <id> --graph <g>      # every event touching it, in order
```

Run `gr contested` before you present anything to a person. If something they
are about to approve rests on contested ground, that is the first thing you tell
them.

## The honest limit

Graphene detects divergence over facts **someone wrote down**. Two sessions that
each silently assume something, and never record it, will still diverge — and
nothing here will catch it. That is why `--assumes` and `--shared` are habits and
not options.
