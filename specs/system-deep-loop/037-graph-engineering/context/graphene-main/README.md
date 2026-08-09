<div align="center">

<img src="ui/logo.svg" width="88" alt="Graphene">

# Graphene

**A work-graph engine for agents.**

Graphene holds the graph an agent works through — what is ready, what is claimed,
what each node concluded, and who is doing what — and pushes changes to every
session attached to it.

It never calls a model and never executes a node. It tracks; the agent works.

[![ci](https://github.com/4tyone/graphene/actions/workflows/ci.yml/badge.svg)](https://github.com/4tyone/graphene/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

</div>

---

## Why

Give an agent a long job and it will hold the plan in its head. That works until
the session ends, or a second agent joins, or a person needs to approve
something, or the data it started from changes underneath it.

Graphene makes the plan a durable object instead:

- **Work survives the session.** A crashed agent's claim lapses and the node
  returns to the pool. A new session attaches and carries on.
- **A person can be in the loop without blocking it.** A human node blocks its
  own dependents and nothing else. The rest of the graph keeps running.
- **A dead premise is loud.** Every fact carries where it came from and what it
  rests on. Write to a source and everything read from it is marked — including
  a draft already sitting in front of someone for approval.
- **Two agents cannot take the same node.** Exclusivity is a primary key, not a
  convention.

---

## Install

You need [Rust](https://rustup.rs). Nothing else — no database server, no Node,
no network at build or run time.

The toolchain is pinned in `rust-toolchain.toml`, so `rustup` fetches the right
version for you the first time you build. Earlier versions may well work; 1.97.1
is the one that is tested.

```bash
git clone https://github.com/4tyone/graphene
cd graphene
cargo build --release
```

The binary is `target/release/gr`. Put it somewhere on your `PATH`:

```bash
# option 1 — install into ~/.cargo/bin, which rustup already puts on PATH
cargo install --path crates/graphene-cli

# option 2 — symlink it
ln -s "$PWD/target/release/gr" /usr/local/bin/gr
```

<details>
<summary><b>Or add an alias instead</b></summary>

If you would rather not install it, point an alias at the build. Add to
`~/.zshrc` (or `~/.bashrc`):

```bash
alias gr="$HOME/path/to/graphene/target/release/gr"
```

Then `source ~/.zshrc`. Verify with:

```bash
gr --version
```

An alias is not visible to scripts or to other programs that shell out. If an
agent will be running `gr` for you, prefer `cargo install`.

</details>

---

## Set up a repository

Run this once, in the repository you want to work in:

```bash
cd ~/code/your-project
gr init .
```

That does two things:

1. Writes the **agent skill** to `.claude/skills/graphene/` — the prose that
   teaches an agent what `gr` is for and what order to call it in.
2. Creates the store at `.graphene/store.db`.

```
your-project/
├── .claude/skills/graphene/     ← the skill: SKILL.md, references, examples
└── .graphene/store.db           ← the store. This is the truth.
```

`gr init` never overwrites a skill file you have edited. Pass `--force` if you
want the shipped version back.

**Add `.graphene/` to your `.gitignore`** unless you want the work log in version
control. Some teams do — `gr export` produces a diffable JSONL log on purpose.

---

## Your first graph

Graphene is built to be driven by an agent, but everything it does is a command
you can run yourself.

```bash
# 1. say what your workspace can do. Graphene ships knowing `agent`, `human`,
#    `review`, `merge`, `function`, `retrieval`, `read`, `query` and the eight
#    irreversible ones; anything else is yours to declare, once.
gr capabilities --register read_web,read_repo,write_repo
gr capabilities --register deploy --gated          # needs a person on every path

# 2. describe the task
gr new --task "Compare our three competitors on pricing and positioning"

# 3. write a plan, then compile and check it
gr plan <graph-id> --file plan.json
gr check <graph-id>

# 4. when it passes, approve and start
gr approve <graph-id>
gr start <graph-id>

# 5. from here on, one command tells you what to do next
gr status <graph-id>
```

Skip step 1 and `gr check` will tell you: `unknown-capability`. That is the point
— Graphene cannot know what your systems can do, so it refuses to guess. The set
lives in `.graphene/capabilities.json`, a file you can diff and review.

**Gating is one-way.** Registering `send_email` does not un-gate it. Otherwise
registration would be a supported way to delete every gate in front of the one
capability gates exist for.

`gr status` returns a `next_action`. **Do what it says, then run it again.** That
loop is the whole procedure — it is deterministic, so it lives in the tool rather
than in anyone's memory:

| `next_action` | Means |
|---|---|
| `check` | validate the plan |
| `fix-check-errors` | each finding names its own remedy |
| `review` | run the review lenses over your own plan |
| `resolve-findings` | apply or reject each finding, with a reason |
| `present-to-user` | show the plan and **wait** |
| `claim` | take a node and do the work |
| `report-awaiting` | a person owes you an answer; stop |
| `wait` | block until something happens |
| `finish` | nothing outstanding |

A plan looks like this — you write local names, Graphene derives the ids:

```json
{
  "graph": "task.v1",
  "nodes": [
    { "id": "scope", "job": "agent",
      "prompt": "Name the three competitors and the dimensions that matter.",
      "outputs": { "type": "object",
        "properties": { "competitors": { "type": "array", "items": { "type": "string" } } },
        "required": ["competitors"] } },

    { "id": "research", "job": "read_web",
      "prompt": "Research one competitor.",
      "needs": ["scope"],
      "inputs": { "type": "object",
        "properties": { "name": { "type": "string" } }, "required": ["name"] },
      "outputs": { "type": "object",
        "properties": { "finding": { "type": "string" } }, "required": ["finding"] },
      "for_each": { "from": "scope", "select": "$.competitors",
                    "as_field": "name", "max": 5 } }
  ]
}
```

More shapes, all runnable, in [`skill/examples/`](skill/examples) — including two
named `BAD-*` that fail `gr check` on purpose, because the failure is the lesson.

---

## The viewer

```bash
gr ui
```

Opens a read-only view at `127.0.0.1`. It is an **inbox first and a dashboard
second**: the left rail is what a person has to decide, and each card shows the
premises that decision rests on — with the ones that have gone stale or contested
called out, because that is the thing you would otherwise approve without
noticing.

There is no write path. The only way out of the UI is a copy button for a node
id, which you paste back to your agent.

---

## What makes it different

**A gate that gates.** A human node declares what each answer releases. Answer
"cancel" and the irreversible node is *skipped*, not left claimable. `gr check`
refuses a plan whose gate does not say what its answers do.

**Beliefs, not just data.** Three axes that never collapse into one: where a fact
came from (immutable), how well established it is (rises only with a distinct
second source), and whether it is currently believed (computed, four-valued —
`IN`, `OUT`, `BOTH`, `NEITHER`).

You can un-believe a conclusion. **You cannot un-believe an observation** — you
observe again, or record that something contradicts it. An agent that could
delete an inconvenient observation could talk itself into anything.

**Contradiction propagates.** A conclusion resting on a contested premise is
contested, and so is everything resting on that. No depth limit.

**Refusals are results.** Exit 0, structured JSON, and every one names what to do
instead — enforced by a test, not by discipline.

**The skill is half the product.** Nothing in training rewards decomposing work
into a graph. `gr status` carries the procedure, prose carries the judgment, and
runnable examples carry the pattern vocabulary.

---

## Commands

`gr --help` lists everything. The ones you will actually use:

| | |
|---|---|
| `gr init .` | set a repository up |
| `gr status [graph]` | where things are, and what to do next |
| `gr node <gn_…>` | **everything about one node** — run this first when someone pastes you an id |
| `gr next <graph>` | what is claimable right now |
| `gr claim <node> --graph <g> --assumes <beliefs>` | take a node |
| `gr done <node> --graph <g> --output '{…}'` | report a result |
| `gr await` / `gr resolve` | ask a person; record their answer |
| `gr believe` / `gr contradict` / `gr stale` | record what you know, and what changed |
| `gr wait --graph <g>` | block until something happens |
| `gr validate <graph>` | run all eleven integrity gates |
| `gr evidence` | what the accumulated graphs say about the guidance |
| `gr export <graph>` | the log as JSONL, for git |

---

## Verification

```bash
cargo test              # everything
cargo clippy --all-targets -- -D warnings
```

308 tests. What they cover, and why each exists, is
[spec 10](specs/10-verification.md):

- **11 integrity gates**, each with an adversarial case — a crafted event stream
  that a caller could not produce through the CLI, asserted to be caught anyway.
- **13 properties** over seeded generated logs. The seed is the whole
  reproduction.
- **10 golden logs** with their folds asserted exactly, so a change to fold
  semantics is deliberate or it is a failure.
- **Concurrency** proven by racing real OS threads against a real SQLite file.
- **Skill consistency** — the CLI surface is derived from the compiled command
  tree, so prose naming a command the binary does not have fails the build.

### The belief benchmark

```bash
gr bench --bmb
```

Graphene's belief layer scores **38/39** on the categories it claims in
[MnemeBrain's BMB](https://github.com/mnemebrain/mnemebrain-benchmark): 100%
belief revision, 100% evidence tracking, 91.7% contradiction.

Five of the eight categories are **skipped, not failed** — temporal decay,
counterfactual sandboxing, consolidation, multi-hop retrieval and pattern
separation are not in Graphene's design. The one remaining check is a deliberate
divergence, recorded with its reason in
[`bench/score.json`](bench/score.json). Setup in [`bench/README.md`](bench/README.md).

---

## How it is put together

| Crate | Does |
|---|---|
| `graphene-core` | the model and the fold. No I/O, no clock, no randomness, no async |
| `graphene-store` | SQLite: the event log, and caches that can be thrown away |
| `graphene-check` | plan validation and the integrity gates |
| `graphene-exec` | claims, leases, the execution protocol |
| `graphene-server` | the WebSocket hub and the embedded UI |
| `graphene-cli` | `gr` |

**SQLite is the truth.** The server observes and notifies; kill it and you lose
push, not data. `gr wait` works either way — you can only tell by the latency.

Design decisions and their reasoning live in [`specs/`](specs), eleven documents
that were written before the code and updated when the code disagreed with them.

---

## License

[Apache 2.0](LICENSE).
