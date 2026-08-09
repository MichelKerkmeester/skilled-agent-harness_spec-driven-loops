# Graphene · 09 · The skill

## 1. The skill is half the product

A CLI an agent does not know when to use will not get used. **Nothing in training
rewards decomposing work into a graph**, and there is no prior for "coordinate
through a work-graph tool."

So the skill is not documentation. It is the component that makes the tool work
at all, and the CLI is the easy half.

Three layers, each carrying what it is suited to:

| Layer | Carries | Because |
|---|---|---|
| **`gr status`** | the procedure | state → next action is deterministic ([07](07-cli.md) §7.1) |
| **Prose** | the judgment | decomposition, granularity, gate placement |
| **Examples** | the pattern vocabulary | shapes are learned from artifacts, not descriptions |

## 2. Structure

```
graphene/
  SKILL.md                      always loaded; small
  references/
    workflow.md                 the four entry points, state-driven
    decomposition.md            how to build a good graph — the hard part
    nodes.md                    kinds, schemas, bindings, budgets
    human-nodes.md              when, and how to write an answerable ask
    beliefs.md                  what to record, and read-set discipline
    review.md                   the lenses
    failure.md                  retry, escalate, or fail
  templates/
    review-subgraph.json        instantiated into every plan
  examples/
    *.json                      runnable graphs (§6)
```

Progressive disclosure: `SKILL.md` stays small and always loaded; references are
pulled at the moment they apply.

## 3. The workflow is state-driven, not a script

A numbered script breaks the moment an agent joins an existing graph, resumes
after a crash, gets a claim refused, or is a fresh session resolving a pasted
ID — which is **most** of the time, since sessions are workers that come and go.

So the procedural instruction is one line:

> **Run `gr status`. Do what `next_action` says. Repeat.**

with a table mapping each `next_action` to the concrete command, and prose only
for the ones needing judgment (`fix_check_errors`, `resolve_findings`,
`rebind_and_reclaim`).

### 3.1 The four entry points

An agent must know which situation it is in. Naming them explicitly is what makes
that reliable.

| Entry | Trigger | Opening move |
|---|---|---|
| **Plan** | user gives a task | `gr new` → draft → `gr check` → review nodes → present → wait for start |
| **Work** | attached to a running graph | `gr status` → `gr claim` → work → `gr done` → `gr wait` |
| **Resolve** | **user pasted a bare `gn_…`** | `gr node <id>` **first**, before anything else |
| **Join** | new session, existing graph | `gr attach` → `gr status` → work |

**Resolve is the one to get right.** A fresh session, a cold agent, a user who
pasted an opaque string. The instruction is unambiguous: recognise the `gn_`
prefix, run `gr node <id>`, and let the returned context — the ask, the beliefs,
the consequences — carry everything else.

## 4. Decomposition — the hard half

The highest-value prose in the system. `gr check` cannot touch any of it.

### 4.1 The test

> *"A good node is boring. It does one thing, you can test it alone, and you can
> swap it out without touching anything else."*

With the failure mode named: a multi-function node is *"a loop with extra
steps"* — it loses testability, caching, retry, and replaceability all at once.

### 4.2 What the prose must teach

- **Find where work splits.** *Where does this decompose into pieces that never
  read each other's results?* Split only that. Everything sequential stays in one
  node. More nodes is not a strategy.
- **The stop rule, with its numbers.** Coordinated teams beat a single agent ~80%
  on splittable work; **every** multi-agent configuration lost 39–70% on
  sequential work needing the full picture. Uncoordinated agents amplified errors
  **17.2×**; one coordinator owning the merge, **4.4×**.
- **Draw an edge only when B's prompt contains A's output.** Every "and then" is
  a suspect. Most hand-built pipelines carry two or three fake edges.
- **The diamond** — split, parallel workers, **separate verifier contexts**, one
  owned merge. The verifier being separate is the entire point: a model grading
  its own work in its own window has already committed to its reasoning.
- **Gate where a mistake is expensive to undo**, not on every step. Gating
  everything makes the human a rubber stamp, which is worse than no gate because
  it manufactures false assurance.
- **Put budget in the state.** Tokens, dollars, wall-clock — declared per node,
  enforced at edges.
- **Watch for shared implicit assumptions.** If two nodes both need to know
  whether the migration ran, they are not independent and the fact should come
  from a node. This is the multi-session divergence risk at its root
  ([02](02-belief-layer.md) §5).

### 4.3 The prohibitions

Prohibitions do more work than permissions once an agent has noticed a new tool:

- Do not create a node per step of your own reasoning.
- Do not fan out work that does not split.
- Do not gate everything.
- Do not skip the merge owner on a fan-in.
- Do not leave `--assumes` empty on a node that reads shared state.

## 5. Review lenses

`gr review` does not exist. **The review is nodes in the plan** — the agent
instantiates `templates/review-subgraph.json` into every graph it drafts, and
Graphene verifies only that they completed and their findings were resolved
([01](01-graph-model.md) §2.1).

Why this rather than a command: Graphene has no model, the lenses are editable
prose rather than compiled behaviour, and review becomes observable and budgeted
work — visible in the UI, costed, with findings as node outputs.

Each lens runs in a **fresh context** seeing only the draft. Six of them:

| Lens | Question |
|---|---|
| **Granularity** | "Which nodes do more than one thing? For each, propose the split." |
| **Dependency** | "For each edge — does the target actually need the source's *output*? Name the edges you'd delete." |
| **Gate placement** | "Which nodes have irreversible effects? Is the gate where a mistake is expensive to undo — or everywhere, or nowhere?" |
| **Completeness** | "Given the original task, what did the planner not think of?" |
| **Stop rule** | "Which nodes share an implicit assumption that is not an explicit dependency?" |
| **Failure** | "For each node, what happens when it fails? Is the blast radius acceptable?" |

Findings are structured, target a node id, and **one `merge` node owns the
resolution** — the stop rule applied to the review of the thing that teaches the
stop rule.

### 5.1 Findings are events, not node output

A lens reports `{"findings":[{target, severity, body, suggestion?}]}` and
`gr done` turns each entry into a `ReviewFinding` event. Leaving them as opaque
node output was the original defect: `state.findings` stayed empty, so
`findings_open` was always zero and `resolve-findings` could never fire. The
lenses ran, produced real findings, and Graphene said review was complete.

A finding whose `target` names no node is refused — one that cannot be applied
would hold the graph forever.

`gr finding <gf_…> --resolution applied|rejected --reason <r>` closes each one,
and `--reason` is required: an unexplained rejection is indistinguishable from
not having read it.

### 5.2 The owner counts toward review completion

`review_owner` is identified structurally — the merge node whose every dependency
is a lens — not by name. Counting only the lenses declared review complete while
the node that resolves their findings was still `ready`. The owner is also
claimable in `checked`, for the same reason the lenses are: requiring `running`
would deadlock.

Two properties this has that a rule-based linter never could: the lenses are
**observable** (you can see which caught what) and **improvable** (one that never
fires gets cut; a class of miss becomes a new lens).

## 6. Examples are runnable, not described

**Ship graphs, not paragraphs about graphs.**

```
examples/
  research-competitors.json     fan-out, no side effects, one merge
  refactor-module.json          serial, one writer, tests as a deterministic edge
  churn-outreach.json           discover-then-fan-out, human gate before send
  deploy-service.json           diamond, three verifiers, irreversible tail
  investigate-incident.json     model-decided edges, shape unknown up front
  BAD-monolith.json             one fat node — fails review, and why
  BAD-fake-edges.json           serial chain that should be parallel — fails check
```

Every one passes `gr check` except the two that are meant to fail, which is the
lesson. The agent reads **artifacts in the format it is about to produce** and
can diff its draft against a known-good shape of the same class.

Chosen to span **shapes, not domains** — fan-out, serial, diamond,
discover-then-fan-out, unknown-shape — because the shape vocabulary is what an
agent needs to acquire.

## 7. Improving the skill from evidence

Because completed graphs accumulate ([03](03-store.md) §8), the skill has a
feedback loop most prompting layers do not:

| Signal | Tells you |
|---|---|
| Nodes that fail most | a decomposition pattern that does not survive contact |
| Gates approved 100% of the time | that gate is misplaced |
| Plans needing the most amendments | a task shape the guidance handles badly |
| Fake edges caught per plan | whether the dependency prose is landing |
| Abandoned graphs | a shape that should not be recommended |

This is how §4 stops being guesswork.

## 8. What the skill must not do

- ❌ **Imply Graphene runs anything.** It coordinates; the agent executes.
- ❌ **Imply Graphene decides anything.** It records and validates.
- ❌ **Encourage graph-building for trivial work.** A one-node graph is a correct
  answer, and a two-node graph for a two-step task is overhead.
- ❌ **Praise a large graph.** Any phrasing that rewards node count produces an
  agent that fragments work to look thorough.
- ❌ **Assume Genera.** The skill must read correctly for someone who has never
  heard of the rest of this system — that is the entire point of shipping it
  separately.

## 9. Open questions

- **OPEN** — Whether driving and teaching split into two skills. One file risks
  being too long to stay loaded; two risks the teaching half never being read.
- **OPEN** — Whether the review subgraph is always instantiated or only above a
  node-count threshold. Six reviewer contexts on a three-node plan is waste;
  skipping review on a plan that grows is worse.
- **OPEN** — Whether `SKILL.md` should embed a compact `next_action` table or
  defer entirely to `gr status`. Embedding costs tokens on every load; deferring
  costs a round-trip before the agent knows what to do.
