# T011 — live `devin -p` smoke dispatch on `glm-5-2`

Run 2026-08-18T19:40:13Z by the orchestrator, on the operator's authenticated
Devin account. This discharges the deferral that blocked T011 and CHK-021.

## Pre-flight (per the cli-devin auth contract)

```
$ devin auth status
Logged in (via Devin).

Credentials:
  File:              ~/.local/share/devin/credentials.toml
  API server:        https://server.codeium.com
  Devin webapp:      https://app.devin.ai
```

`DEVIN_AUTH_OK=1` → cleared to dispatch.

## Dispatch

Run from an empty scratch directory, deliberately outside the repository, so a
misbehaving dispatch could not reach tracked files.

```
$ devin -p --respect-workspace-trust false \
    --model glm-5-2 --permission-mode accept-edits \
    -- "Reply with exactly this line and nothing else: DEVIN_SMOKE_OK glm-5-2"

DEVIN_SMOKE_OK glm-5-2
exit_code: 0
```

- Model: `glm-5-2` — the model named by the task.
- CLI: `devin 3000.4.25 (7e8e528a)`.
- Round-trip: 2.26s wall.
- Output matched the requested string exactly, proving a real model response
  rather than a CLI-local echo or a cached reply.

## Red-before observation

The first attempt, without `--respect-workspace-trust false`, failed closed:

```
Error: Refusing to run in an untrusted workspace: <scratch dir>
```

That is the same workspace-trust gate the sibling devin-CLI repair identified on
this CLI version. The failure is a useful negative control: it shows the flag is
load-bearing for any non-interactive dispatch into a directory the operator has
not opened `devin` in by hand, and that the passing run above was not a no-op.

## Scope note

This exercises the raw `devin -p` transport that T011 names. The runtime's own
execution adapter is covered separately by the landed unit and adapter suites
(`vitest run -t "devin"` 9 passed; both adapter files 198 passed), so this run
closes the one gap those suites cannot reach: a live account round-trip.
