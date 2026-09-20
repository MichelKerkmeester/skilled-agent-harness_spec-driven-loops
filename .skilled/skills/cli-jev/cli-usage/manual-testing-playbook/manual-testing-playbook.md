---
title: "cli-usage: Manual Testing Playbook"
description: "Operator-facing directory for the cli-usage transport: execution policy, evidence rules, the 22-scenario index, the run record and failure triage."
trigger_phrases:
  - "cli-usage playbook"
  - "jev manual testing"
  - "jev validation scenarios"
  - "jev exit code checks"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.2
---

# cli-usage: Manual Testing Playbook

> **EXECUTION POLICY**: Every executable scenario MUST be executed for real — not mocked and not
> classified as an unsupported automation case. An agent executing these scenarios runs the actual
> `jev` command, inspects the real output, and captures stdout, stderr, exit code and elapsed
> seconds. **Exit code alone is never proof**: `jev` can exit 0 having produced a payload the caller
> misreads, and it prints *nothing* on stdout for every failure, so each check also names the content
> it reads. Every judgment command also closes stdin — `</dev/null`, a pipe into `jev`, or a
> heredoc — because the dispatch preflight refuses a judgment whose state is not an unquoted inline
> value and whose stdin is left open, and because a command that really does read stdin blocks until
> it is fed. The only acceptable verdicts are PASS, FAIL, or SKIP with a specific blocker.

> **PROVIDER BOUNDARY**: At authoring time no provider credential existed in this workspace, so the
> scenarios whose observable needs an authenticated call were recorded as SKIP with that named
> blocker rather than as inferred passes. An operator credential for the `official` provider has
> since been stored in the machine's credential store, and those rows now carry observed PASS
> verdicts in the authenticated verification report. A machine with no stored key still reproduces
> every no-key row by pointing `XDG_CONFIG_HOME` at an empty directory, which leaves the run at the
> credential check. Everything below the credential line — availability, usage errors, cardinality,
> the endpoint rule, the credential check, the transport error class, the MCP handshake and the
> guard behavior — is executable on any machine and is executed.

> **TRANSPORT BOUNDARY**: `jev` writes nothing and runs nothing. No scenario in this playbook may
> assert a workspace mutation, and a scenario that produces one has found a defect.

> **RESULT PERSISTENCE** (`MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT`): a scenario is only
> recorded as executed when its command, its named provider-variable state, its streams and its exit
> status are written down together. The run records for the playbook live in
> `../benchmark/reports/` — the unauthenticated pass, the authenticated verification that closed the
> two credential rows, and the post-migration re-verification that re-ran all 22 from the mode's new
> home — and this file does not restate their verdicts, so the two cannot drift.

---

## 1. HOW TO RUN

```bash
command -v jev && jev --version          # the binary is the precondition for every scenario
```

Each scenario is its own file under a category directory and carries its full execution truth: the
prompt, the command, the expected observable, the 9-column contract table, the recorded result, the
source anchors and the failure triage. 22 deterministic scenarios across 5 categories.

Categories:

- `cli-invocation/` — binary discovery, the version pin, the help surfaces, and one judgment per type.
- `exit-codes/` — the taxonomy: 0, 2, 3, 4, and the shapes that must never read as a judgment.
- `dispatch-guards/` — the dispatch audit shape and the eight declared hard rules.
- `providers/` — provider selection, the key resolution order, the endpoint rule and the auth surface.
- `mcp-server/` — the `jev-mcp` handshake, its four tools, and the host-only rule.

---

## 2. EVIDENCE RULES

Every executed scenario records four things and nothing else counts:

1. The exact command, including every flag.
2. The provider keys unset or set for that run, named.
3. stdout, stderr and the exit status, as observed.
4. The observable the check reads — a printed value, a substring, a file, or a live process state.

A scenario whose exit status was read but whose stdout was not is not executed. A scenario run with
a provider key present that the row did not name is not reproducible and is recorded as FAIL.

---

## 3. SCENARIO INDEX

| ID | Scenario | Category | Observable | Blocker |
|---|---|---|---|---|
| [JEV-001](cli-invocation/binary-resolves-and-pins-version.md) | `jev` resolves on `PATH` and prints the pinned version | cli-invocation | `jev 0.6.2` on stdout, exit 0 | — |
| [JEV-002](cli-invocation/root-help-lists-six-subcommands.md) | Root help lists all six subcommands | cli-invocation | `auth, install-skills, noul, choice, score, run` | — |
| [JEV-003](cli-invocation/judgment-help-omits-hidden-endpoint-flag.md) | Judgment help lists the shared flags and not `--endpoint` | cli-invocation | `--value` present, `--endpoint` absent | — |
| [JEV-004](exit-codes/no-key-exits-3-with-structured-json.md) | A judgment with no key exits 3 with JSON on stderr | exit-codes | empty stdout, credential error, exit 3 | — |
| [JEV-005](exit-codes/unreadable-state-file-exits-2.md) | A missing state file exits 2 before any request | exit-codes | `cannot read state file`, exit 2 | — |
| [JEV-006](exit-codes/malformed-json-state-exits-2.md) | Malformed JSON state exits 2 | exit-codes | `invalid JSON state`, exit 2 | — |
| [JEV-007](exit-codes/missing-required-flag-is-argparse-failure.md) | A missing required flag is an argparse failure | exit-codes | usage text naming the flag, exit 2 | — |
| [JEV-008](exit-codes/unknown-subcommand-is-argparse-failure.md) | An unknown subcommand is an argparse failure | exit-codes | six valid choices listed, exit 2 | — |
| [JEV-009](providers/custom-provider-requires-endpoint.md) | `--provider custom` without an endpoint exits 2, with one exits 3 | providers | endpoint error then credential error | — |
| [JEV-010](exit-codes/refused-connection-exits-4.md) | A refused connection exits 4, never 0 | exit-codes | `API connection failed`, exit 4 | — |
| [JEV-011](exit-codes/key-never-echoed-on-error-path.md) | The key is never echoed on the error path | exit-codes | sentinel search count `0` | — |
| [JEV-012](exit-codes/choice-single-option-not-refused.md) | `choice` with one option reaches the request | exit-codes | exit 3 at the credential check | — |
| [JEV-013](exit-codes/score-single-level-not-refused.md) | `score` with one level reaches the request | exit-codes | exit 3 at the credential check | — |
| [JEV-014](providers/invalid-provider-env-exits-2.md) | An invalid `JEV_PROVIDER` exits 2 before provider access | providers | `invalid JEV_PROVIDER`, exit 2 | — |
| [JEV-015](exit-codes/batch-request-with-no-key-exits-3.md) | A valid batch request with no key exits 3 | exit-codes | credential error, exit 3 for both forms | — |
| [JEV-016](exit-codes/request-without-questions-exits-2.md) | A request missing `questions` exits 2 | exit-codes | required-members message, exit 2 | — |
| [JEV-017](dispatch-guards/dispatch-resolves-from-command.md) | The audit resolves `jev noul …` to `cli-jev` | dispatch-guards | `resolveDispatchPacket().skill === 'cli-jev'` | — |
| [JEV-018](dispatch-guards/prose-mention-is-not-a-dispatch.md) | The audit does not resolve `jev` mentioned in prose | dispatch-guards | `resolveDispatchPacket() === null` | — |
| [JEV-019](dispatch-guards/declared-hard-rules-refuse-violations.md) | Each declared hard rule refuses its violating command | dispatch-guards | the fixture pair flips the check | — |
| [JEV-020](mcp-server/handshake-and-four-tools.md) | `jev-mcp` answers a handshake and lists four tools | mcp-server | `noul`, `choice`, `score`, `run` | — |
| [JEV-021](providers/auth-status-reports-key-state.md) | `auth status` reports the key state without printing it | providers | `ok` and a store path, or exit 3 | — (key stored) |
| [JEV-022](cli-invocation/one-judgment-per-type-returns-typed-answer.md) | One judgment per type returns a typed answer | cli-invocation | a probability, a key, a position | — (key stored) |

---

## 4. RUN RECORD

The recorded runs live under `../benchmark/reports/`: the phase-004 unauthenticated pass, the
authenticated verification that closed the two credential rows, and the post-migration
re-verification. Their verdicts and per-scenario evidence are there; this file does not restate
them, so they cannot drift.

| Run | Date | Scenarios | Verdict | Report |
|---|---|---|---|---|
| post-migration re-verification | 2026-09-20 | JEV-001 … JEV-022 | 22 PASS, 0 FAIL, 0 SKIP | [`2026-09-20-post-migration-reverification/`](../benchmark/reports/2026-09-20-post-migration-reverification/) |

The gateway-key question lives in [providers-and-models.md](../references/providers-and-models.md)
§4: the operator's existing gateway credential is not a Jev credential under any provider, the
request and response are the native System One contract rather than chat completions, and the
translating-proxy path that would change that answer was never built or probed.

---

## 5. FAILURE TRIAGE

| Symptom | Most likely cause | Next check |
|---|---|---|
| Exit 127 or `command not found` | `jev` is not on `PATH` for this shell | `uv tool list`, then `command -v jev` |
| Exit 3 with a key exported | The key is set for a different provider than `--provider` selects | `jev auth status --provider <name>` |
| Exit 3 with `auth status` reporting stored | The stored value is empty, or the credential file is malformed | Read the store's shape, not its value |
| Exit 4 on every call | Network egress blocked, or a `custom` endpoint that is not listening | Re-probe against a known-refused port |
| Exit 2 on a command that looks right | A flag conflict (`--value` with `run`) or a state form the CLI does not accept | Compare against `../references/cli-reference.md` §3 |
| A judgment that reads as `false` | Exit 4 was treated as the value | Handle the exit status before parsing anything |
| A hang with no output | State defaulted to stdin and stdin is a terminal | Add `</dev/null` or pass `-s` inline |
