---
title: "Jev CLI Reference"
description: "The pinned `jev` command contract: subcommands, flags, state input forms, output shapes, and the exit-code taxonomy."
trigger_phrases:
  - "jev cli reference"
  - "jev flags"
  - "jev exit codes"
  - "jev noul choice score run"
  - "jev state input"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.2
---

# Jev CLI Reference

> The binary is the authority. Every claim below was read from the vendored source at
> `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`
> and then probed live against `jev 0.6.2`. Claims marked **LIVE** carry an observed command, output
> and exit status; claims marked **SOURCE** are read from that file and are re-probed after any
> version change.

---

## 1. INVOCATION

```bash
jev --version          # LIVE → stdout "jev 0.6.2", exit 0
jev --help             # LIVE → subcommands: auth, install-skills, noul, choice, score, run
```

`jev` takes exactly one subcommand and has no bare-question form. An unrecognized subcommand is an
argparse failure: **LIVE** `jev judge -q 'Is it?'` → exit 2, usage text on stderr listing the six
valid choices.

---

## 2. SUBCOMMANDS

| Subcommand | Purpose | Required flags |
|---|---|---|
| `auth set` | Store a key from a hidden prompt or stdin | `--provider` (defaults to `official`) |
| `auth status` | Report whether a key resolves | `--provider` |
| `auth test` | Send a minimal request and verify the key | `--provider` |
| `install-skills` | Install the bundled agent skill | none; `-g/--global`, `--claude` optional |
| `noul` | Yes/no question answered with a probability | `-q/--question` |
| `choice` | Select one key from an explicit option map | `-q/--question`, `-o/--option` (repeatable) |
| `score` | Score against ordered levels | `-q/--question`, `-l/--level` (repeatable) |
| `run` | Send a complete request JSON for batched questions | positional `request` |

**SOURCE**: `auth` and `install-skills` take no shared flags; `auth set|test` accept `--provider`,
`auth status` accepts it too but only reads. **SOURCE**: `install-skills` refuses to overwrite a
skill directory it does not own, recognized by its `.jev-cli-managed` marker.

---

## 3. SHARED FLAGS ON THE JUDGMENT SUBCOMMANDS

| Flag | Effect |
|---|---|
| `--provider {official,vercel,openrouter,custom}` | Selects the provider; defaults to `JEV_PROVIDER` or `official` |
| `--model MODEL` | Overrides the provider's default model |
| `--json-state` | Parses the state text as JSON before sending |
| `--pretty` | Indents the JSON response |
| `--value` | Prints only the primary answer value |
| `--endpoint URL` | Overrides the provider endpoint; **hidden from `--help`** |

**LIVE**: `jev noul --help` and `jev run --help` both list `--provider`, `--model`, `--json-state`,
`--pretty`, `--value` — and neither lists `--endpoint`. **SOURCE**: the flag is registered with
`argparse.SUPPRESS`, and `provider_endpoint()` returns the override for *any* provider before it
consults the provider table, so `official` can be redirected with a trusted proxy.

`--value` is accepted syntactically by `run` and rejected semantically. **LIVE**: with a valid
request on stdin and no key, both `jev run -` and `jev run - --value` exit 3 with the credential
error, because the value check runs on the parsed answer *after* the API call. **SOURCE**:
`primary_value()` raises `CliError("--value is available only for noul, choice, and score")` with
exit 2 once a response exists.

---

## 4. STATE INPUT

`-s/--state` accepts three forms, resolved in this order by `read_text()`:

| Form | Meaning | Live evidence |
|---|---|---|
| `-s 'text'` | The literal state string | exit 3 at the credential check, i.e. reached the request |
| `-s @path` | Read the file at `path` | **LIVE** `-s @…/absent.txt` → exit 2, `{"ok": false, "error": "cannot read state file: …"}` |
| `-s -` | Read stdin to EOF | **LIVE** exit 3, i.e. stdin was consumed without error |
| `-s` omitted | Read stdin to EOF | Same path; the default |
| nothing on a TTY | Refused | **SOURCE** `CliError("state is required as an argument, @file, or stdin")`, exit 2 |

`--json-state` parses the resolved text as JSON. **LIVE**: `-s 'not json' --json-state` → exit 2,
`{"ok": false, "error": "invalid JSON state: Expecting value: …"}`.

`run` takes the request as a positional instead: a path, or `-` for stdin. **LIVE**: `run -` with a
valid object exits 3 at the credential check; `run -` with `{"state":"x"}` exits 2 with
`{"ok": false, "error": "request must be an object containing state and questions"}`.

---

## 5. QUESTION SHAPES

Each subcommand builds the same System One request. **SOURCE** `question_request()`:

```json
{
  "state": "<state as sent>",
  "model": "<provider default or --model>",
  "questions": {
    "answer": {"type": "noul", "instructions": "<question>"}
  }
}
```

`choice` adds `criteria` as an object of `KEY → DESCRIPTION`; `score` adds `criteria` as a list of
level descriptions in ascending order. `run` sends the caller's object unchanged, adding `model`
only when absent.

The answer is read at `result["answers"]["<question name>"]["<type>"]`. **SOURCE**
`primary_value()`:

| Type | Primary value | Range |
|---|---|---|
| `noul` | `answers.answer.noul` | probability in `[0, 1]` |
| `choice` | `answers.answer.choice` | one of the submitted keys, verbatim |
| `score` | `answers.answer.score` | zero-based position; may be fractional |

**SOURCE**: the vendor's own test suite asserts a fractional score of `1.5`, so callers must not
assume an integer.

Cardinality differs by surface and this is a real trap:

| Surface | `choice` with one option | `score` with one level |
|---|---|---|
| CLI | Accepted; the request is sent | Accepted; the request is sent |
| `jev-mcp` | Refused before any request | Refused before any request |

**LIVE**: `jev choice -q 'Which?' -s x -o 'only=The only option'` → exit 3 at the credential check,
i.e. the CLI built and attempted the request. **SOURCE**: the MCP tool raises
`ToolError("choice requires an options map with at least two entries")` and
`ToolError("score requires a levels list with at least two entries")`.

---

## 6. EXIT CODES

| Exit | Class | Emitted when | Evidence |
|---|---|---|---|
| 0 | Success | A judgment printed | **LIVE** `jev --version` → 0 |
| 1 | Unexpected response | Non-object payload, unknown keys, or an HTTP status outside the mapped classes | **SOURCE** `CliError(..., 1)` and the `KeyError`/`TypeError` handler |
| 2 | Usage | Bad flags, unreadable state file, malformed JSON, `--value` with a non-judgment subcommand, `custom` without an endpoint, invalid `JEV_PROVIDER` | **LIVE** `-s @absent`, `custom` without endpoint, `--json-state` on bad JSON, missing `-q`, bad `JEV_PROVIDER`, `{"state":"x"}` on `run` — all exit 2 |
| 3 | Credential | No stored key, an empty key, an invalid credential file, or HTTP 401/403 | **LIVE** `auth status`, `auth test`, and every judgment subcommand with no key → exit 3 |
| 4 | Transport | HTTP 429/500/502/503/504, a connection failure, or a timeout | **LIVE** with a sentinel key against `http://127.0.0.1:9/v1/systemone` → exit 4, `{"ok": false, "error": "API connection failed: … Connection refused"}` |
| 130 | Interrupted | `KeyboardInterrupt` | **SOURCE** `except KeyboardInterrupt` |

Errors print one JSON object on **stderr** — `{"ok": false, "error": "<message>"}` — and leave
stdout empty. A caller parsing stdout alone therefore sees nothing on every failure, which is the
shape that makes exit-code handling mandatory.

---

## 7. AUTHENTICATION COMMANDS

```bash
jev auth status     # LIVE, no key → exit 3, {"ok": false, "error": "official API key is not stored; run: jev auth set --provider official"}
jev auth test       # LIVE, no key → exit 3, the same object; it never distinguishes stored from valid
jev auth set        # SOURCE: masked prompt on a TTY, plain stdin read otherwise
```

**SOURCE**: `auth status` prints `{"ok": true, "stored": true, "store": "<path>"}` when a key
resolves, and `auth test` prints `{"ok": true, "valid": true, "model": "<model>"}` after a live call.
Neither prints the key. On a TTY, `auth set` echoes one asterisk per character and restores the
terminal on exit; piped input is read with `.strip()`.

---

## 8. THINGS THAT LOOK LIKE BUGS AND ARE NOT

- **`auth status` exits 3 rather than reporting an unset key.** A missing credential is a failure,
  and the caller's move differs from a judgment's, so it is an error path by design.
- **A `custom` endpoint is validated before the key.** **LIVE**: with `--provider custom` and no
  endpoint the exit is 2, and with an endpoint but no key it is 3. Order: endpoint, then key, then
  request.
- **Both `-s -` and an omitted `-s` read stdin.** There is no "no state" form on a non-TTY.
