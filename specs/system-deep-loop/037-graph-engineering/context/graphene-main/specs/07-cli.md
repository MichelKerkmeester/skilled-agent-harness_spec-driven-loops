# Graphene · 07 · The CLI

## 1. Shape

**Subcommand verbs, JSON payloads, over stdio. No daemon involved.**

The verb is a subcommand because agents are excellent at shell and it needs no
transport. The payload is JSON because CLI flags are lossy for structured data —
a plan with typed schemas cannot pass through `argv` without pain.

```
gr <verb> [target] [--flags]        JSON on stdout
gr apply < events.jsonl             JSON in, JSON out
```

Global: `--store <path>` · `--session <id>` · `--human` (tables, for people) ·
`--quiet`.

## 2. Output discipline

- **JSON on stdout by default.** The primary consumer is an agent.
- **Refusals are results, not errors.** A refusal is structured JSON on stdout
  with exit 0 — the caller is meant to read and act on it. Non-zero exit is
  reserved for genuine failure: store unreachable, malformed input, protocol
  mismatch.
- **Every write echoes its event.** A caller always knows exactly what was
  recorded, and can pipe it.
- **`--human` renders tables.** For a person at a terminal, never the default.

```json
{ "refused": "stale_premise",
  "stale": [{ "id": "gb_b2", "state": "BOTH", "contradicted_by": "gb_x9" }],
  "suggestion": "re-read the source, then re-claim" }
```

## 3. Graphs

```
gr new  --task <text> [--title <t>] [--description <d>]   → gg_…
gr plan gg_… < plan.json          # add or replace nodes while in draft
gr capabilities [--register <names>] [--gated]   # 06 §4.1; additive, gating one-way
gr check [gg_…]                   # 06; blocks draft → checked
gr approve gg_…                   # explicit; reviewed → approved
gr start gg_…                     # approved → running
gr cancel gg_… --reason <r>
gr amend gg_… < diff.json         # → a NEW graph with parent set
gr clone gg_… [--params <json>]   # template instantiation
gr list [--all] [--state <s>] [--tag <t>]
gr show gg_…
gr export gg_… [--format jsonl]
```

`gr capabilities` reads and extends `capabilities.json` beside the store. A
workspace's capabilities are not knowable to Graphene, and without a way to
declare them C1 rejects every real plan. Registering is additive and gating is
one-way ([06](06-check.md) §4.1).

`gr list` defaults to graphs not yet `done` — the pending set is what a session
needs on attach; `--all` widens it.

## 4. Nodes

```
gr node <gn_…>                    # everything; the cold-context entry point
gr nodes gg_… [--state <s>] [--kind <k>]
gr next [--session <id>] [--limit <n>]
gr claim <gn_…> --session <id> --assumes <gb,…> [--lease <secs>]
gr renew <gc_…>
gr release <gc_…> --reason <r>
gr checkpoint <gn_…> --state <json>
gr done <gn_…> --output <json>    # validated against outputs_schema; fails closed
gr fail <gn_…> --reason <r> [--retryable]
```

`gr node <id>` is the most important read in the surface: it is what a **cold
agent in a fresh session** runs when a human pastes an ID. It must be
self-contained — the ask, the inputs, the `why()` trail on its context, the
consequence of each answer, the output schema ([04](04-execution.md) §4.1).

## 5. Human nodes

```
gr await <gn_…> --ask <text> --context <gb,…> --options <a,b,c>
                [--on-timeout <policy>]
gr awaiting [gg_…]                # everything waiting on a person
gr resolve <gn_…> --by <actor> --choice <c> [--input <json>]
```

## 6. Beliefs

```
gr believe --provenance <p> --content <text> [--summary <s>]
           [--source <ref>] [--observed-at <ts>] [--shared]
           [--derives-from <gb,…>] [--produced-by <gn_…>] [--scoped-to <id>]
gr retract    <gb_…> --reason <r> [--evidence <gb,…>]
gr contradict <gb_…> --reason <r> [--evidence <gb,…>]
gr uncontradict <gb_…> --reason <r>
gr corroborate <gb_…> --by <gb_…>
gr supersede  <gb_…> --content <text> --reason <r> [--observation-proof <json>]
gr reinstate  <gb_…> --reason <r>
gr stale --source <ref>
gr nogood <gb_…> <gb_…>… --note <n>
gr belief <gb_…>
gr why <gb_…|gn_…> [--depth 3]
gr dependents <gb_…>
gr contested [gg_…]
gr history <id>
```

`gr retract` on a `tool-observation` refuses with `suggestion: "contradict"` —
never a bare error ([02](02-belief-layer.md) §3).

## 7. Sessions and waiting

```
gr attach gg_… --session <id> [--label <l>]     # starts the server if needed
gr detach --session <id>
gr sessions [gg_…]
gr status [gg_…] [--session <id>]
gr wait --session <id> [--timeout <s>] [--on <events>]
```

### 7.1 `gr status` carries the workflow

State → next action is a **lookup**, so it belongs in code rather than in prose
the agent has to remember ([09](09-skill.md) §3):

```json
{ "graph": "gg_…", "state": "running",
  "nodes": { "done": 12, "running": 2, "ready": 3, "awaiting": 1,
             "blocked": 4, "failed": 0 },
  "sessions": [{ "id": "s1", "holding": ["gn_a…"] },
               { "id": "s2", "holding": [] }],
  "budget": { "tokens": { "used": 41200, "limit": 200000 } },
  "next_action": { "do": "claim", "nodes": ["gn_b…", "gn_c…"],
                   "why": "3 nodes ready and you hold none" } }
```

`next_action` values: `check` · `fix_check_errors` · `review` ·
`resolve_findings` · `present_to_user` · `start` · `claim` · `rebind_and_reclaim`
· `report_awaiting` · `wait` · `finish`.

## 8. Integrity

```
gr validate [gg_…]                # every gate; non-zero exit on failure
gr rebuild                        # truncate fold, replay log
gr fold --up-to <seq>             # state at a point, into a scratch store
gr replay <log> [--live]
gr compact                        # fold-preserving; self-verifying
gr bench --bmb <path>             # 10 §2
```

## 9. UI

```
gr ui [gg_…]                      # opens the browser at the running server
gr serve [--foreground]           # debugging; attach starts it normally
```

## 10. Raw

```
gr apply < events.jsonl           # the honest interface: the log is the truth
```

Every subcommand above is sugar that constructs one event and calls the same
internal `apply`. Exposing it directly keeps the surface honest, makes batch
import and replay trivial, and means no subcommand can do something the event
log cannot express.

## 11. Exit codes

| Code | Meaning |
|---|---|
| 0 | success **or a structured refusal** |
| 1 | usage error — bad flags, malformed JSON |
| 2 | store error — unreachable, locked, corrupt |
| 3 | `gr check` / `gr validate` failed |
| 5 | a refusal, **under `--quiet` only** — with output a refusal is readable and exits 0 |
| 4 | protocol mismatch with a running server |

## 12. What the CLI must never gain

Each would breach a boundary:

- ❌ **any flag that calls a model** — no `--auto-plan`, no `--summarize`
- ❌ **any flag that executes a node** — Graphene coordinates, never runs
- ❌ **a remote store URL** — one local store; a knowledge base is a different
  component
- ❌ **tenant, user, or role flags** — sensitivity labels are carried as opaque
  data, never interpreted as policy
- ❌ **a scoring or ranking flag** — relevance belongs to the caller
- ❌ **a write path from the UI** — [08](08-ui.md) §1

## 13. Open questions

- **OPEN** — Whether `gr plan` takes a whole plan document or incremental node
  additions. Whole-document is simpler to check and diff; incremental is easier
  to author across turns. Probably both, with whole-document canonical.
- **OPEN** — Whether `gr next` should reserve nodes briefly to reduce claim
  races, or stay a pure read with the SQL unique index as the arbiter. Leaning
  pure read — the index already makes races correct, and reservation adds state.
