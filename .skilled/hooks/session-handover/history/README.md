---
title: "History: Read-Only Turn Retrieval for Session Handover"
description: "Runtime-neutral engine that turns an adapter's entry list into bounded, redacted history replies for the session handover, with one CLI that redeems a printed locator."
trigger_phrases:
  - "history lookup core"
  - "bounded history retrieval"
  - "public projection"
  - "history lookup cli"
version: 1.0.0.0
---

# History: Read-Only Turn Retrieval for Session Handover

---

## 1. OVERVIEW

`history/` answers the question a compacted session leaves open: what did this session say earlier? An adapter hands the engine a neutral list of entries. The engine returns search references or whole turns, and it pages a single turn on demand. Every reply is capped before it reaches the model, and no transcript path crosses that boundary.

Current state:

- Every complete reply is serialized once and measured against a 16,384-byte cap before it is returned.
- A failed operation throws a typed error. The adapter maps that error to its own fail-open path.
- `lib/cli.ts` is the only runnable redemption path. It reads one stored locator, re-derives the `hl1_` handle and prints one bounded reply.
- A shell call that runs the CLI counts as paging, so a model's own lookups never come back in its next lookup.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                    HISTORY LOOKUP ENGINE                     │
╰──────────────────────────────────────────────────────────────╯

┌───────────────┐        ┌───────────────────────────────────┐
│ adapter       │ ─────▶ │ core.ts                           │
│ HistoryEntry[]│        │ redacts, projects, wires          │
└───────────────┘        └───────┬───────────┬───────────┬───┘
                                 ▼           ▼           ▼
                        ┌────────────┐ ┌───────────┐ ┌──────────┐
                        │navigator.ts│ │ pages.ts  │ │ loads.ts │
                        │search      │ │ text      │ │ deferred │
                        │browse      │ │ parts     │ │ items    │
                        │load        │ │ image     │ │          │
                        └─────┬──────┘ └─────┬─────┘ └────┬─────┘
                              └──────────────┼────────────┘
                                             ▼
                                  ┌─────────────────────┐
                                  │ response.ts         │
                                  │ one capped reply    │
                                  └─────────────────────┘
```

The core owns redaction and projection, and it enforces the reply bounds. No route reaches a raw entry or a transcript path after `createHistoryLookup` returns, and no reply carries a stored secret.

### Entry contract

An adapter reads its own session store, builds a `HistoryEntry[]` and calls `createHistoryLookup(entries)`. The core takes an entry list, never a raw path. No transcript path, store handle, provider client or session identity crosses the boundary, which is what keeps one retrieval implementation usable by every runtime adapter.

The core is read-only. It writes nothing, and it reads no clock and no locale, so the same entry list and input produce the same bytes. A failed operation throws a typed error, and it never returns a partial reply.

`lib/history.ts` is the executable source of truth for the entry shape. `lib/history-entry.schema.json` publishes the same shape as Draft 2020-12 JSON Schema, with `additionalProperties: false` and a `required` list equal to the non-optional type keys. Compile-time guards fail the build when the published key lists drift from the type, and the contract suite compiles the schema with Ajv to validate one typed entry fixture per role.

A failed operation throws one of these classes. Map its code to the adapter's own fail-open path rather than retrying inside the core.

| Error class | Codes | Meaning |
|---|---|---|
| `HistoryProjectionError` | `DUPLICATE_TOOL_CALL`, `ORPHAN_TOOL_RESULT`, `DUPLICATE_TOOL_RESULT`, `MISMATCHED_TOOL_RESULT`, `INCOMPLETE_TOOL_RESULTS` | The adapter entry list is not a paired transcript |
| `HistoryNavigatorError` | `INVALID_HISTORY_NAVIGATOR_INPUT`, `UNKNOWN_HISTORY_ANCHOR`, `UNKNOWN_HISTORY_ID` | The request is out of bounds or names something not public |
| `HistoryPageError` | `INVALID_PAGE_INPUT`, `UNKNOWN_HISTORY_ID`, `UNKNOWN_HISTORY_PART`, `PART_TOO_LARGE` | The part or the mode cannot answer the read |
| `HistoryResponseError` | `HISTORY_REPLY_TOO_LARGE`, `HISTORY_REPLY_UNSERIALIZABLE` | The reply would exceed the cap or cannot be serialized |

### The four operations

| Operation | Input | Reply |
|---|---|---|
| `search` | `query`, optional `files`, `tools`, `failed`, `limit` | Compact references ranked by BM25, each with `previousHistoryId` and `nextHistoryId` |
| `browse` | `direction`, optional anchor, `count` and `stride` | Anchored references in window order |
| `load` | up to 3 history ids | Whole public items in requested order, or deferred items with a working `readParts` handle |
| `page` | `historyId`, optional `part` and `mode`, `offset`, `limit` | A bounded text page with `nextOffset`, a part list or one native image attachment |

`search` and `browse` return references only. `load` and `page` return bodies. Every reply goes through one serializer that measures the complete JSON payload in UTF-8 bytes and throws before it can exceed 16,384 bytes. A text page is also capped at 2,000 UTF-16 code units, and no page boundary splits a surrogate pair.

Only `page` returns a `HistoryPageReply`, whose `content` may also hold one native image attachment. Every other operation returns a `BoundedHistoryReply`, whose `content` array holds the serialized text.

`search` matches fragments of identifiers, not only whole terms. Text is NFKC-normalized first, so full-width `ＬＩＶＥ` matches `LIVE`.

- One query token needs all of its parts, and separate tokens are alternatives. An exact mention of the whole identifier ranks above a turn that holds only its parts.
- `LIVE-MARKER-dv-2b7e` is found by its whole form or by any part such as `MARKER` or `dv-2b7e`. A plain document word such as `delivery` gets no parts, so a query matches it only as a whole word.
- A Han word is matched by its adjacent character pairs, so `検索` does not match a turn that holds only `検`.
- The preview centers on the matched identifier, so a fragment match shows what it matched.
- A model turn is indexed as its blocks in order: text as written, and each tool call as its name and arguments, such as `read_file {"path":"docs/design.md"}`. A tool call's id is not searchable.
- A query with no terms returns nothing unless it carries a filter.

Filters narrow a match after ranking. `files` keeps a turn only when every listed path equals, character for character, a path one of the turn's tool calls passed as `path`, `file`, `files`, `filepath` or `file_path`. Paths are not normalized, so a leading `./` or an absolute form makes a different value. `tools` keeps a turn that used at least one listed tool, and `failed` compares the turn's failed flag.

Input bounds are explicit. A query runs to 200 characters, and a filter holds at most 10 entries of 200 characters each. `search` returns at most 10 references, and 5 by default. `browse` takes `count` from 1 to 10 and `stride` from 1 to 10.

---

## 3. PACKAGE TOPOLOGY

The source sits in `lib/`, and the build writes `dist/` beside it at the same depth. That layout is deliberate. `lib/cli.ts` imports the spec-kit runtime build and the shared session readers by relative path, and the same relative path then resolves from the source under vitest and from the build at run time.

```text
history/
+-- lib/          # TypeScript source, rootDir for the build
+-- dist/         # compiled output, outDir, gitignored
`-- tests/        # vitest suites, outside the build
```

Allowed direction:

```text
tests/ ───▶ lib/ ───▶ spec-kit runtime build
lib/cli.ts ───▶ shared/session-readers
lib/core.ts ───▶ spec-kit shared secret scrubber
```

Disallowed direction:

```text
lib/ ───▶ tests/
tests/ ───▶ dist/
```

---

## 4. DIRECTORY TREE

```text
history/
+-- README.md
+-- package.json
+-- tsconfig.json
+-- vitest.config.ts
+-- lib/          # TypeScript source, built into dist/
+-- dist/         # compiled output, gitignored
`-- tests/        # vitest suites, with shared fixtures in _support/
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `package.json` | The package scripts and the Node engine range. The package has no dependencies of its own. |
| `tsconfig.json` | A composite project rooted at `lib/`, built to `dist/`. It references the spec-kit runtime, which builds first. |
| `vitest.config.ts` | Collects `tests/**/*.vitest.ts` inside this package. |

Every file in `lib/`:

| File | Responsibility |
|---|---|
| `cli.ts` | The redemption CLI. It re-reads one stored locator and re-derives the `hl1_` digest, then prints one bounded reply or one refusal. |
| `core.ts` | `createHistoryLookup(entries)`, the public entry that redacts and projects the list, then wires the operations. |
| `history-entry.schema.json` | Draft 2020-12 JSON Schema for the `HistoryEntry` contract. |
| `history.ts` | The `HistoryEntry` and content-block types, with the published key lists and `projectHistoryEntries`. It also holds the paging predicates. |
| `index.ts` | The barrel that re-exports history, projection, response, pages, loads, navigator and core. |
| `loads.ts` | Bounded loading of up to three entries. It loads smallest-first and returns a `BoundedHistoryReply`, deferring items that will not fit. |
| `locator-digest.ts` | `historyHandle()` and `persistHistoryLocator()`, shared by the session handover and the CLI. |
| `lookup-offer.ts` | The `## History Lookup` body and section. It holds the shell quoting and the 600-character limit the offer declares. |
| `navigator.ts` | `search` and `browse`, with BM25 ranking over whole terms and their parts, plus anchored window navigation. |
| `pages.ts` | `page`, which serves text pages and part lists, and returns one native image attachment when asked. |
| `projection.ts` | The public projection that removes thinking, signatures, paging tool calls and image bytes. |
| `response.ts` | The 16,384-byte reply serializer and the error types it throws. |

The suites in `tests/`:

| File | Responsibility |
|---|---|
| `history-byte-bound.vitest.ts` | The reply cap and the part cap. It also covers smallest-first loading. |
| `history-cursor-reconstruction.vitest.ts` | Pointers, text pages, part lists and deferred items. |
| `history-entry-contract.vitest.ts` | The entry contract and its JSON Schema parity. |
| `history-locator.vitest.ts` | Locator bounds, offer placement, runtime labels and the persistence result. |
| `history-lookup-cli.vitest.ts` | The CLI across runtime stores, including a session started in a subfolder. |
| `history-projection.vitest.ts` | Tool pairing and the public projection of turns. |
| `history-search-analyzer.vitest.ts` | Compound identifiers, Unicode terms, previews and reference size. |
| `history-search-browse.vitest.ts` | Search ranking and browse windows, plus the input bounds. |
| `history-secret-redaction.vitest.ts` | Secret redaction across text and arguments. |
| `history-vocabulary-drift.vitest.ts` | The locator vocabulary shared with the runtime schema. |
| `_support/history-fixtures.ts` | Fixture builders the suites share. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `lib/` imports the spec-kit runtime build and its shared secret scrubber. `lib/cli.ts` also loads the shared session readers by relative URL. Nothing here imports from `tests/`. |
| Exports | `lib/index.ts` re-exports seven modules, every one except `cli.ts`, `locator-digest.ts` and `lookup-offer.ts`, and `createHistoryLookup` is the entry a consumer calls. `lib/cli.ts` exports `runHistoryLookupCli` for the entry script and its suite. |
| Ownership | This folder owns retrieval, redaction, paging and the locator digest. Transcript parsing belongs to the shared readers, and the moment a locator is minted belongs to the session handover. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ model copies the printed command         │
╰───────────────────┬──────────────────────╯
                    ▼
┌──────────────────────────────────────────┐
│ bin/history-lookup.mjs                   │
│ loads the compiled core or refuses       │
└───────────────────┬──────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ cli.ts: arguments, locator, handle       │
└───────────────────┬──────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ shared reader returns the entry list     │
└───────────────────┬──────────────────────┘
                    ▼
┌──────────────────────────────────────────┐
│ core.ts builds the reply                 │
└───────────────────┬──────────────────────┘
                    ▼
╭──────────────────────────────────────────╮
│ one JSON line on stdout                  │
╰──────────────────────────────────────────╯
```

### Redaction and projection

Secret-shaped values are redacted before projection, wherever a readable string appears. Vendor keys, tokens, JWTs, bearer values, private keys and `key=value` credentials go through the spec-kit shared secret scrubber. The core adds two shapes of its own: a password inside a URL and a non-bearer `Authorization` value. It also redacts any argument stored under a credential name such as `password`, matched on the name's last words, so `x-api-key` counts, and `xAuthToken` and `api_keys` count too. Each hit becomes a typed marker such as `[REDACTED:github-token]`.

Search cannot match a secret, and every byte bound is measured on the redacted text. The stored transcript is never changed.

The projection then removes what a caller must not see:

- Assistant thinking becomes null. Provider signatures and redacted payloads become null as well.
- Paging tool calls and their results are removed. The paging names are `search_history`, `browse_history`, `load_history` and `read_context_output`, and a shell call that runs the lookup CLI counts too.
- A paging-only turn disappears. A mixed turn keeps its ordinary text and tool work.
- A null slot stays in the assistant content array, so later blocks keep their original index.
- Image bytes never become text. Text mode exposes image metadata and a read handle, and only `mode: "image"` returns one native attachment.

### Budgets and handles

- 16,384 bytes cap one complete serialized reply.
- 4,096 bytes cap one inline part description.
- 128 characters cap a history id, and 512 characters cap a part pointer.
- A text page returns at most 2,000 UTF-16 code units, and a page boundary never splits a surrogate pair.
- 66 characters cap a session id after shell quoting. A plain id may run to 64 characters, which covers the 44-character id DSH issues. The runtime's locator schema keeps its own copy of that bound because the runtime builds before this package, and the locator suite fails when the two copies disagree.
- References and continuation handles are reserved before content spends the same budget.
- A reference lists at most 6 tool names and 12 paths, and counts the rest in `omittedTools` and `omittedFiles`. `load` returns the full lists.
- Oversized reference metadata collapses to `{ historyId, detailsDeferred: true }`.
- Items load smallest-first, then the emitted `items` array is rebuilt in the caller's requested order.

A deferred item carries `id`, `kind`, `deferred: true`, a bounded `parts` list, `totalParts`, `nextPartOffset` and a `readParts` handle. Follow that handle to list more descriptions, then follow each part description's `read` handle to page the body.

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createHistoryLookup` | Function | Builds the lookup over an adapter entry list. |
| `historyHandle` | Function | Derives the `hl1_` handle from one session identity. |
| `persistHistoryLocator` | Function | Writes one locator through the hook-state writer and reports whether it was kept. |
| `buildHistoryLookupSection` | Function | Renders the `## History Lookup` section a producer injects. |
| `runHistoryLookupCli` | Function | Runs one lookup and writes one JSON line. The handover entry script calls it. |
| `lib/index.ts` | Module | The barrel a consumer imports. |

### The CLI

```bash
node .skilled/hooks/session-handover/bin/history-lookup.mjs \
  --session <session-id> \
  --handle <hl1_handle> \
  <search|browse|load|page> \
  '<json-arguments>'
```

Each call prints one JSON line on stdout. The entry lives in the handover's `bin/` folder and imports this package's `dist/cli.js`. A core that cannot load becomes `core_unavailable`, which no change to the arguments fixes.

With no arguments the command refuses. Run this from the repository root:

```bash
node .skilled/hooks/session-handover/bin/history-lookup.mjs
```

Expected output: `{"ok":false,"code":"invalid_usage"}`, with exit status 2.

The argument contract:

- `--session` and `--handle` are required, and the operation is the first positional argument.
- `load` takes a JSON array or `{"historyIds":["..."]}`. Every other operation takes one JSON object.
- Claude runs the command as printed. Every other runtime prefixes it with `SPECKIT_RUNTIME=<runtime>`, such as `SPECKIT_RUNTIME=codex` or `SPECKIT_RUNTIME=vibe`.
- The locator must be less than 30 minutes old. A future timestamp counts as clock skew and is treated as stale.
- The CLI checks the stored state, the handle, the session id, the runtime and `process.cwd()` against the locator workspace, then checks the locator age, the reader capability and the re-derived digest.
- Success writes one JSON line and exits 0. Every refusal writes one `{"ok":false,"code":"<code>"}` line and exits 2.

| Refusal code | Meaning |
|---|---|
| `invalid_usage` | A required flag or the operation is missing or malformed |
| `state_missing` | No hook state file exists for the session |
| `state_unreadable` | The state file cannot be read or parsed |
| `locator_missing` | The state file holds no `historyLocator` |
| `locator_invalid` | The stored locator fails the closed schema |
| `locator_stale` | The locator is 30 minutes old or older, or its timestamp is in the future |
| `handle_mismatch` | The supplied handle differs from the stored handle, or the re-derived digest differs |
| `session_mismatch` | The supplied session id differs from the stored locator, or the reader returned another session |
| `runtime_mismatch` | The current runtime differs from the locator runtime |
| `workspace_mismatch` | The current working directory differs from the locator workspace |
| `unsupported_runtime` | The host runtime is unlabeled, or no ready reader exists for the locator runtime |
| `session_not_found` | The reader found no session with that exact id |
| `session_ambiguous` | More than one store record claims that exact id |
| `store_unreadable` | The runtime store is missing or unreadable |
| `operation_invalid` | The operation arguments are not valid JSON, or not the accepted object or array shape |
| `core_unavailable` | The handover entry script could not load this package's build, so it needs a build |
| `unknown_history_anchor` | The browse anchor names no public reference |
| `unknown_history_id` | The history id names no public item |
| `unknown_history_part` | The part pointer names no public part |
| `part_too_large` | The requested part's description cannot fit the reply budget |
| `reply_too_large` | The reply would exceed 16,384 bytes |
| `reply_unserializable` | The reply cannot be serialized |

### Example

`createHistoryLookup(entries)` is exported from `lib/index.ts` and implemented in `lib/core.ts`. The suites import `lib/core.ts` through its compiled `.js` specifier.

```ts
const lookup = createHistoryLookup(entries);

const reply = lookup.search({ query: 'deployment', limit: 5 });
const references = JSON.parse(reply.content[0]?.text ?? '{}');

const loaded = lookup.load(['history-12', 'history-14']);
const page = lookup.page({ historyId: 'history-12', part: '/assistantMessage/content/0' });
```

---

## 8. VALIDATION

Build the spec-kit runtime first, because the CLI reads the hook state it compiles. Then build and test this package. Run from the repository root:

```bash
npm --prefix .skilled/skills/system-spec-kit/runtime run build
npm --prefix .skilled/hooks/session-handover/history run build
npm --prefix .skilled/hooks/session-handover/history test
npm --prefix .skilled/hooks/session-handover/history run typecheck
```

Expected result: the build and the typecheck exit 0 without printing errors, and vitest reports every suite passing. The suites import the source in `lib/`, but the CLI suite also loads the runtime's built hook state, so a stale runtime build shows up here.

---

## 9. RELATED

- [Session handover](../README.md): mints the locator and prints the lookup section.
- [Handover entry](../bin/README.md): the runnable command the offer names.
- [Shared session readers](../../shared/session-readers/README.md): the per-runtime transcript readers the CLI loads.
- [Session lifecycle](../../session-lifecycle/README.md): the session start, compaction and stop hooks.
