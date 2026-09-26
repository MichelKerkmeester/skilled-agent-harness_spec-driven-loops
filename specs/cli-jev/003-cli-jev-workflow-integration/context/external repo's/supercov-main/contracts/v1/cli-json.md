# CLI and agent JSON contract v1

The executable is `supercov`. With no installed dependency the canonical UX is
`npx supercov -- <test command>`. `--help` and `-h` are aliases for `help`.
Every invocation is finite; there is no `serve` command.

Resource queries follow this hierarchy:

```text
supercov runs [--limit N] [--json]
supercov runs <run-id> [selectors] [--json]
supercov runs <run-id> kinds|runners|scope|files|gaps [selectors]
supercov runs <run-id> file <path> [selectors]
supercov runs <run-id> line <path:line> [selectors]
supercov runs <run-id> decision <id|path:line> [selectors]
supercov runs <run-id> test <id|name> [selectors]
supercov runs <run-id> minimize [selectors]
supercov diff <older-run> <newer-run> [--json]
supercov merge <run-id> <run-id> [...]
supercov runs clean [--keep N] [--dry-run]
```

`latest` resolves to the newest published run. Paginated resources default to
20 items and accept non-negative `--offset` plus positive `--limit`.

Outcome summaries contain `passed`, `failed`, `flaky`, `skipped`, `timedOut`,
`interrupted`, `unknown`, and `unstarted`. The last category is a selected test
that never began because fail-fast stopped the runner; it has no invented
attempt or coverage evidence.

`--json` writes exactly one newline-terminated JSON object to stdout and no
prose. Success is:

```json
{"schemaVersion":1,"ok":true,"command":"coverage.summary","data":{}}
```

Failure is:

```json
{"schemaVersion":1,"ok":false,"command":"coverage.file","error":{"code":"SOURCE_NOT_FOUND","message":"...","retryable":false}}
```

Pagination, when present, is `{offset,limit,returned,total,hasMore,nextOffset}`.
The complete stable error-code list is in `contract.json`. Responses are at
most 65,536 UTF-8 bytes. Oversized success responses become
`RESPONSE_TOO_LARGE`; oversized failures are safely truncated. Argument/query
errors exit 2. A wrapped test command otherwise retains its status, except an
explicit Supercov timeout exits 124.
