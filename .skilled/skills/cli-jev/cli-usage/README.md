---
title: cli-usage
description: The cli-jev hub's first transport mode - a TypedSafe Jev judgment bridge that returns a probability, a chosen key, an ordered score, or a batch of typed answers instead of prose.
trigger_phrases:
  - "jev cli"
  - "jev judgment"
  - "typesafe jev"
  - "noul probability"
  - "choice judgment"
  - "score judgment"
  - "jev-mcp"
  - "typed judgment transport"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

# cli-usage

> The first mode of the `cli-jev` hub, and its only `packetKind: "transport"`. Jev reads
> state, prints a typed judgment, and exits; it edits nothing and runs nothing. Pair it with a
> workflow mode whenever the judgment feeds an action.

---

## 1. WHAT THIS PACKET IS

`cli-usage` bridges the `jev` CLI and the `jev-mcp` stdio server into the hub's routing layer. A
request that needs a decision a script can consume — is this urgent, which queue owns it, how severe
is it, several of those at once — resolves here, and the packet supplies the contract: the command
shape, the four providers, the exit-code taxonomy, the question-shaping discipline, and the rule
that a judgment is never itself an authorization.

The classification is deliberate. Jev classifies nothing about a codebase, chooses no provider for a
task, and conducts no session. It answers one narrow question about the state it is handed. That is
what `transport` means in this hub, and it is the reason the mode is registered with
`mutatesWorkspace: false` and with `Write`, `Edit` and `Task` forbidden.

---

## 2. THE THREE PRIMITIVES

| Primitive | Answers with | Range | Use it when |
|---|---|---|---|
| `noul` | A probability | `[0, 1]` | You will compare against a threshold you own |
| `choice` | One submitted option key | One of your keys, verbatim | You will branch on a category |
| `score` | An ordered position | Zero-based, may be fractional | You will escalate or rank by degree |
| `run` | Several typed answers | One per caller-named key | One state answers several questions |

```bash
jev noul   -q 'Does this message express urgency?' -s 'Please restore service today.' --value </dev/null
jev choice -q 'Which queue owns this?' -s @request.txt -o billing='Payment or refund' -o technical='Bug or failure'
jev score  -q 'How severe is this?' -s @incident.txt -l 'no impact' -l 'degraded' -l 'outage'
jev run    @request.json --pretty
```

---

## 3. THE DISPATCH RULES

Eight hard rules are declared in `SKILL.md` and enforced before a command is spawned, each with an
implemented check in the runtime-neutral dispatch engine:

| Rule | Severity | Refuses |
|---|---|---|
| `jev-availability-required` | error | Dispatching when `jev` does not resolve on `PATH` |
| `jev-stdin-bounded` | error | A stdin-reading judgment with nothing feeding or closing stdin |
| `jev-choice-option-cardinality` | error | `choice` with fewer than two options |
| `jev-score-level-cardinality` | error | `score` with fewer than two levels |
| `jev-value-not-with-run` | error | `--value` combined with `run` |
| `jev-custom-endpoint-required` | error | `--provider custom` without an endpoint |
| `jev-no-inline-credential` | warn | An API key literal on the command line |
| `jev-mcp-host-only` | warn | Running `jev-mcp` from a shell |

---

## 4. WHAT IT CANNOT DO

- **No workspace mutation.** No `Write`, no `Edit`, no `Task`; the mode is declared
  `mutatesWorkspace: false`.
- **No lineage.** Jev has no iteration model, no stop policy and no file tools, so it is not a
  deep-loop `ExecutorKind` and cannot run a `/deep:research` or `/deep:review` fan-out.
- **No prose.** Every answer is a value, and a caller that needs an explanation dispatches a
  workflow mode instead.
- **No MCP registration from this repo.** `jev-mcp` ships in the same package and is documented in
  `references/mcp-server.md`; wiring it into a host is an operator step, and no repository MCP config
  carries it.

---

## 5. LAYOUT

```text
cli-usage/
  SKILL.md                             # the contract: when to use, dispatch shape, eight hard rules
  README.md                            # this file
  references/
    cli-reference.md                   # subcommands, flags, input forms, exit codes, output shapes
    providers-and-models.md             # the four providers, key variables, endpoints, translation
    integration-patterns.md            # gate, triage, branch and batch patterns
    mcp-server.md                      # jev-mcp tools, host-only rule, operator step
  assets/
    question-shaping-card.md           # drafting the question so the value is usable
  changelog/
  benchmark/
  manual-testing-playbook/
  feature-catalog/
```

---

## 6. PROVENANCE

The contract is pinned against `jev-cli` 0.6.2, installed with `uv tool install jev-cli` (rollback:
`uv tool uninstall jev-cli`). Every claim in the references is tagged **LIVE** (observed command,
output and exit status) or **SOURCE** (read from the vendored tree at
`specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/`). No authenticated
call was made: the workspace holds no Jev provider key, so the live response body of each provider
remains unconfirmed and is tagged as such rather than asserted.

Source packet: `specs/cli-jev/001-cli-jev-creation/`.
