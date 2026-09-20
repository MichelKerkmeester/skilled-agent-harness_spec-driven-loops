---
name: cli-usage
description: "TypeSafe Jev CLI transport for typed judgments: noul probabilities, choice selections, ordered scores, and batched run requests."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.2.0
hard_rules:
  - id: jev-availability-required
    check: command-v-jev-required
    message: "Run `command -v jev` before every judgment; if it fails, refuse the route without constructing or launching a command. An absent binary never becomes routable, and the hub advertises the mode only when the CLI resolves on PATH."
    severity: error
  - id: jev-stdin-bounded
    check: jev-stdin-bounded
    message: "A judgment whose state comes from stdin (`-s -`, an omitted state flag, or `run -`) MUST feed or close stdin with `</dev/null`, a pipe, or a heredoc. Jev reads stdin to EOF by default, so an inherited terminal stdin blocks until the operator types something that never arrives, and the hang reads as a slow model rather than a deadlock."
    severity: error
  - id: jev-choice-option-cardinality
    check: jev-choice-option-cardinality
    message: "A `jev choice` dispatch MUST pass at least two `-o KEY=DESCRIPTION` options. The CLI accepts a single option, but one option is not a choice: the answer is a foregone conclusion, and the model bills for a decision nobody made. The MCP tool refuses the same input at two."
    severity: error
  - id: jev-score-level-cardinality
    check: jev-score-level-cardinality
    message: "A `jev score` dispatch MUST pass at least two `-l DESCRIPTION` levels. The CLI accepts a single level, but one level is not a scale, and the returned zero-based position carries no information. The MCP tool refuses the same input at two."
    severity: error
  - id: jev-value-not-with-run
    check: jev-value-not-with-run
    message: "Never combine `--value` with `run`. Batched requests answer several questions under caller-defined keys, so no single primary value exists; the CLI rejects the combination only after a successful billed call, which spends quota to learn a flag conflict."
    severity: error
  - id: jev-custom-endpoint-required
    check: jev-custom-endpoint-required
    message: "A `--provider custom` judgment MUST pass `--endpoint <url>` or carry `JEV_ENDPOINT` in the command's environment. Without one the CLI exits 2 before any request, and the endpoint it does receive is sent the `JEV_API_KEY` bearer, so use a trusted HTTPS origin only."
    severity: error
  - id: jev-no-inline-credential
    check: jev-no-inline-credential
    message: "Never put an API key literal on a jev command line (`TYPESAFE_API_KEY=... jev ...`). Shell history, process arguments and transcripts all retain it. Export the variable for the session, pipe it to `jev auth set` once, or let the credential store supply it."
    severity: warn
  - id: jev-mcp-host-only
    check: jev-mcp-host-only
    message: "Never run `jev-mcp` from a shell. Its stdin and stdout carry MCP protocol frames, so a hand-started server writes JSON-RPC into the transcript and answers nothing. Start it only from an MCP host configuration, and read `references/mcp-server.md` for the block."
    severity: warn
---

<!-- Keywords: cli-usage, cli-jev, jev cli, typesafe jev, jev judgment, noul, choice judgment, score judgment, jev run, jev-mcp, typed judgment, classification instead of prose, probability, yes-no judgment, ordered score, batched questions -->

# TypeSafe Jev CLI Transport - Typed Judgments for Dispatch

> **Transport, not executor.** `cli-usage` is the hub's first `packetKind: "transport"` mode: it bridges
> the `jev` CLI and its judgment contract. Jev reads state, prints a typed judgment, and exits. It has
> no file tools, no loop and no lineage, so it never mutates this workspace and never completes a task
> on its own. Pair it with a workflow mode whenever the judgment feeds an edit.

Orchestrate `jev` for decisions a script can consume: a yes/no probability, one key from explicit
options, an ordered level, or several typed answers in one request. Jev returns a small
machine-readable object where prose generation would return a paragraph, which makes it the right
tool when the caller needs a value to branch on rather than text to read.

**Core principle**: send only the state the judgment needs, choose the narrowest question type that
answers the question, read the exit code before the payload, and keep every consequence behind the
caller's own authorization.

---

## 1. WHEN TO USE

### Activation Triggers

- **Typed judgment**: a task needs a probability, a category from a known set, or an ordered level
  rather than generated text.
- **Branch input**: a script, hook or gate needs a value it can compare, so `--value` and the exit
  code are the whole interface.
- **Batched classification**: several unrelated questions apply to one state, answered together by
  `run` instead of by several calls.
- **Judgment transport discovery**: a request names `jev`, Jev, TypeSafe Jev, `noul`, `choice`,
  `score`, or `jev-mcp`.

### When NOT to Use

- **The state is a secret or private record.** Jev forwards the state verbatim to the selected
  provider. Authorization to send it is the caller's to hold, and a judgment is not worth a leak.
- **The question is a fact this repository can answer.** A grep, a test run or a read settles those,
  and a model opinion about them is a guess wearing JSON.
- **The request needs an edit, a build or a test.** Jev has no file or process tools; dispatch a
  workflow mode instead, and use this packet only for the judgment that steers it.
- **No credential resolves for the selected provider.** Without one every call exits 3 with no
  judgment, so the route is unavailable rather than degraded; `auth status` is the check, not an
  assumption about the machine.
- **A prose answer is the deliverable.** Use a dispatched CLI session; Jev deliberately returns no
  explanation.

---

## 2. SMART ROUTING

### Prerequisite Detection

Run these before constructing a command:

```bash
command -v jev && jev --version      # jev 0.6.2 at the pinned contract
jev auth status                      # {"ok": true, "stored": true, "store": "..."} or exit 3
```

`command -v jev` decides whether the route exists. `auth status` decides whether a judgment is
possible, and it never prints the key. Use `jev auth test` when the key must be proven accepted: it
sends a minimal request and reports `{"ok": true, "valid": true, "model": "..."}`.

### Transport Guard

Jev does not dispatch itself. Two bounds apply unchanged by this packet:

- **No fan-out lineage and no repeated dispatch stack.** The shared runtime refuses both, and a
  transport is not an exemption.
- **A transport pairs with a workflow before any effecting operation.** The judgment selects; the
  workflow acts. A `choice` answer is evidence about the caller's options, never permission.

### Resource Loading Levels

- **First slice** (always, on activation): `references/cli-reference.md` +
  `references/integration-patterns.md`.
- **On demand**: `references/providers-and-models.md` when the provider or model matters,
  `references/mcp-server.md` when an MCP host is the caller, `assets/question-shaping-card.md` when
  the question itself needs drafting.

### Smart Router

| Request shape | Loads |
|---|---|
| "ask jev whether this is urgent" | `references/cli-reference.md` + `references/integration-patterns.md` |
| "which of these two queues" / "pick one" | the first slice + `assets/question-shaping-card.md` |
| "which provider / which model id" | `references/providers-and-models.md` |
| "expose jev judgments to my MCP host" | `references/mcp-server.md` |
| "batch several questions over one state" | `references/cli-reference.md` (`run` section) + `assets/question-shaping-card.md` |

---

## 3. HOW IT WORKS

### Execution Ownership

The calling agent owns the question, the state and the consequence. Jev owns one thing: the typed
answer. Nothing in this packet decides what to do with it.

### The Dispatch Shape

```bash
jev noul -q 'Does this message express urgency?' -s 'Please restore service today.' --value </dev/null
jev choice -q 'Which team should handle this?' -s @state.txt \
  -o billing='Payment, charge, or refund issues' -o technical='Bugs or integration failures' --pretty
jev score -q 'How severe is this incident?' -s @state.txt \
  -l 'no user impact' -l 'degraded' -l 'outage' --value
jev run @request.json --pretty
```

The grammar is positional and small: one subcommand, `-q/--question`, a state from
`-s/--state` (text, `@file`, or `-`), and the type-specific criteria (`-o` pairs for `choice`, `-l`
levels for `score`, a JSON request for `run`). `--provider`, `--model`, `--json-state`, `--pretty`
and `--value` are shared across the judgment subcommands; `--endpoint` exists but is hidden from
help.

### Output Contract

Default output is compact JSON on stdout, `--pretty` indents it, and `--value` prints only the
primary answer (`noul` → probability, `choice` → the selected key, `score` → the zero-based
position, which may be fractional). Errors are structured JSON on **stderr** with `ok: false`, and
the process exit code carries the class.

| Exit | Meaning | Caller's move |
|---|---|---|
| 0 | A judgment was produced | Read the payload; it is a judgment, not a fact |
| 1 | Unexpected or unclassified API response | Do not retry blindly; inspect the body |
| 2 | Usage error: bad flags, unreadable state, malformed JSON, or `--value` with `run` | Fix the command; no quota was spent |
| 3 | Credential missing, empty or rejected (401/403) | Operator step: set the key, then re-run |
| 4 | Retryable transport: 429, 5xx, connection or timeout | Back off and retry; never read as a judgment |
| 130 | Interrupted | Operator aborted |

### Dispatch-Critical Gotchas

1. **State defaults to stdin.** Omit `-s` and Jev reads stdin to EOF; on an inherited terminal that
   is a hang with no output. Every non-interactive dispatch closes or feeds stdin.
2. **`--value` is unavailable with `run`** and the CLI only says so *after* a successful call,
   because the check runs on the parsed answer. Batched requests always need the JSON.
3. **Cardinality is enforced by the MCP tools, not by the CLI.** `choice` with one option and
   `score` with one level both reach the provider from the shell and both are refused by `jev-mcp`.
   Treat two as the floor in either direction.
4. **The credential store is the CLI's own.** `~/.config/jev-cli/credentials.json` (or
   `$XDG_CONFIG_HOME/jev-cli/credentials.json`), directory `0700`, file `0600`, written atomically.
   It is not shared with any other tool that uses the same upstream key.
5. **`custom` sends its bearer to whatever endpoint you name.** Point it at a trusted HTTPS origin,
   and expect the native System One request and response shape, not chat completions.
6. **`vercel` is translated.** The client rewrites `noul` to `boolean`, moves the model id into an
   `ai-model-id` header and normalizes the answer back, so a response you compare across providers
   is the normalized one, not the wire one.

---

## 4. RULES

### ✅ ALWAYS

- Run `command -v jev && jev --version` before the first dispatch of a session, and `jev auth status`
  before the first judgment.
- Choose the narrowest question type: `noul` for a yes/no probability, `choice` for one key from
  explicit options, `score` for an ordered level, `run` only for several questions at once.
- Close or feed stdin whenever the state arrives from stdin.
- Give `choice` keys that are stable output values and descriptions that make the categories
  mutually exclusive; give `score` levels in ascending order from lowest to highest.
- Read the exit code before the payload, and treat exit 4 as retryable transport rather than an
  answer.
- Send only the state the judgment needs, stripped of credentials and private records.
- Keep the consequence behind the caller's authorization; a judgment is input to a decision, not the
  decision.

### ⛔ NEVER

- Never inline an API key on the command line, print it, or commit it.
- Never run `jev-mcp` by hand, and never claim a repo file wires an MCP host.
- Never pass `--value` with `run`, and never pass a single option or level where the type requires
  a choice or a scale.
- Never let a judgment stand in for a repository fact this repo can answer directly.
- Never claim a provider is reachable without a key that resolves: `auth status` or `auth test` is
  the evidence.

### ⚠️ ESCALATE IF

- No provider credential exists for the selected provider: report the operator step rather than
  routing around it.
- The selected provider returns 401/403 after a key was believed present: the key is stale, and
  rotation is the operator's.
- A `custom` endpoint must be reached: confirm the operator trusts the origin, because the bearer
  travels with the request.
- A judgment would drive an irreversible action: the operator owns that call, not the model.

---

## 5. REFERENCES

### Core References

- `references/cli-reference.md` — every subcommand, flag, input form, exit code and output shape.
- `references/providers-and-models.md` — the four providers, their key variables, endpoints, default
  models and translation behavior.
- `references/integration-patterns.md` — the shipped judgment patterns: gate, triage, branch, batch.
- `references/mcp-server.md` — the `jev-mcp` stdio server, its four tools, and the host-only rule.

### Templates and Assets

- `assets/question-shaping-card.md` — how to phrase a jev question so the answer is usable.
- `manual-testing-playbook/manual-testing-playbook.md` — deterministic scenarios with expected
  observables.
- `feature-catalog/feature-catalog.md` — the capability index with source anchors.

### Evidence Base

- Contract pin: `specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/implementation-summary.md`,
  with the captured probes beside it at `scratch/probe-matrix.txt` and `scratch/probe-surface.txt`.
- Vendored source: `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/`
  (read-only; `src/jev_cli/__init__.py` is the CLI contract and `src/jev_cli/mcp_server.py` the MCP
  contract).

---

## 6. SUCCESS CRITERIA

### Dispatch Completion

A judgment dispatch is complete when it exits 0, the payload parses, the answer shape matches the
question type (`noul` a number in `[0, 1]`, `choice` one of the submitted keys, `score` a position
in the submitted list), and the caller has recorded which provider and model produced it.

### Packet Quality

A reader can decide whether to use Jev, compose a correct command for all four judgment types, wire
a provider, recognize every exit class, and know that `jev-mcp` belongs to a host — without opening
another packet.

---

## 7. INTEGRATION POINTS

### Hub Integration

`cli-usage` is the first mode of the `cli-jev` hub and its only transport. It is declared
in `mode-registry.json` as `packetKind: "transport"` under the `transport-axis` extension,
`mutatesWorkspace: false`, forbidding `Write`, `Edit` and `Task`, and it routes by hub membership
like every other mode. `hub-router.json` carries its intent signal and `leaf-manifest.json` its
leaf set; the hub's `ROUTER.md` is the stage-two control map, declared `stage1-only` and empty until
stage two.

### Not a Deep-Loop Executor

Jev cannot run a lineage: it has no file tools, no iteration model and no stop policy. `/deep:research`
and `/deep:review` do not accept it, and no `ExecutorKind` exists for it. A lineage that needs a
judgment gets one from a workflow executor and reads the result.

### Code and Spec Integration

- A gate or hook may call `jev noul --value` and compare the number to its own threshold; the
  threshold is the gate's, and the judgment is only one input to it.
- A triage step may call `jev choice` or `jev score` and switch on the returned key or position.
- Nothing here writes to a spec packet, and the judgment is not evidence until a human or a check
  confirms the consequence.

### Tool Roles

- **Bash**: runs `jev`; the only surface this packet uses.
- **Read / Glob / Grep**: read the state file, the request JSON, and this packet's references.
- **Write / Edit / Task**: forbidden. A transport that edits is a workflow wearing the wrong
  `packetKind`.

---

## 8. REFERENCES AND RELATED RESOURCES

- Upstream project: `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/README.md`.
- Upstream bundled skill: the same tree's `skills/jev-cli/SKILL.md` — the vendor's own guidance,
  which this packet supersedes for repo dispatch behavior.
- Hub router: `hub-router.json`; stage-two control map: `ROUTER.md`; registry: `mode-registry.json`.
- Structural precedent for a transport packet: the hub doctrine's `transport-axis` extension in
  `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`.
