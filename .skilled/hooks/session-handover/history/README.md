---
title: "History Lookup Engine"
description: "The read-only engine behind the session handover's History Lookup section: the lookup core, the locator and offer helpers and the redemption CLI, with its own build and tests."
trigger_phrases:
  - "history lookup core"
  - "bounded history retrieval"
  - "public projection"
  - "history lookup cli"
version: 1.0.0.0
---

# History Lookup Engine

---

## 1. OVERVIEW

This package is the engine behind the session handover's History Lookup section. It lives in the hook folder that prints the section, and the [handover README](../README.md) explains when the claim prints it and why. The engine itself is runtime-neutral. An adapter reads its own store, projects a `HistoryEntry[]` and calls `createHistoryLookup(entries)`. The core answers `search`, `browse`, `load` and `page` without exposing the raw transcript, and it never writes.

Current state:

- Every complete reply is serialized and measured against one 16,384-byte cap before it is returned.
- A failed operation throws a typed error, and the adapter maps it to its own fail-open path.
- `cli.ts` is the only runnable redemption path. It reads one persisted locator, re-derives the handle and prints one bounded reply.
- `lookup-offer.ts` owns the model-visible `## History Lookup` section and its 600-character budget, and the session handover prints it only after the locator write persisted. `claim` mints a locator for the sending session with provenance source `handover` and prints the section after the note body. It mints only when the transcript records a folder in the receiver's checkout. `placeLookup` keys each locator by the checkout root above the session folder, where the printed command runs, and keeps that folder as `sessionDirectory` when the session started below the root. A folder whose nearest root cannot run the CLI gets no locator and no section.
- A shell call that runs the CLI counts as paging, like a dedicated pager tool, so a model's own lookups never come back in its next lookup.
- `locator-digest.ts` owns the `hl1_` handle and the locator write the session handover shares.

---

## 2. CONTRACT

An adapter reads its own session store, builds a `HistoryEntry[]` and calls `createHistoryLookup(entries)`. The core takes **an entry list, never a raw path**. No transcript path, store handle, provider client or session identity crosses the boundary. That rule is what keeps one retrieval implementation usable by every runtime adapter.

The core is read-only. It performs no file, database or network write. It reads no clock, randomness or locale and returns the same bytes for the same entry list and input. A failed operation throws a typed error, and it never returns a partial or silently truncated reply. The adapter maps that error to its own fail-open path.

`history.ts` is the executable source of truth for the entry shape. `history-entry.schema.json` publishes the same shape as Draft 2020-12 JSON Schema, with `additionalProperties: false` and a `required` list equal to the non-optional type keys. The reader package's test suite and the history contract suite compile that schema with Ajv and validate projected entries against it. In production, `projectEntries` validates tool pairing and block shape in code, and the core adds input bounds only.

---

## 3. FILES

The source sits in `lib/`, and the build writes `dist/` beside it at the same depth. That is deliberate: the CLI imports the spec-kit runtime's compiled hook state and the shared session readers by relative path, and the same path then resolves from the source under vitest and from the build at run time.

```text
history/
+-- README.md
+-- package.json
+-- tsconfig.json
+-- vitest.config.ts
+-- lib/        TypeScript source: cli.ts, core.ts, history.ts and their helpers
+-- dist/       the build, gitignored
`-- tests/      vitest suites, with shared fixtures in _support/
```

| File | Responsibility |
|---|---|
| `package.json` | The package's build, typecheck and test scripts. It has no dependencies of its own. |
| `tsconfig.json` | A composite project rooted at `lib/`. It references the spec-kit runtime, which builds first. |
| `vitest.config.ts` | Collects `tests/**/*.vitest.ts` inside this package. |
| `tests/` | The vitest suites and their shared fixtures in `tests/_support/`. |
| `README.md` | This orientation page. |

Every file in `lib/`:

| File | Responsibility |
|---|---|
| `cli.ts` | The redemption CLI. It re-reads one stored locator, re-derives the `hl1_` digest and prints one bounded reply or one refusal. |
| `core.ts` | `createHistoryLookup(entries)`, the public entry that wires projection, navigation, loads, pages and the reply bound. |
| `history-entry.schema.json` | Draft 2020-12 JSON Schema for the `HistoryEntry` contract. |
| `history.ts` | The `HistoryEntry` and content-block types, the published key lists, `projectHistoryEntries` and the paging-tool predicates. |
| `index.ts` | The barrel that re-exports history, projection, response, pages, loads, navigator and core. |
| `loads.ts` | Bounded loading of one to three entries, including smallest-first selection, deferred handles and `BoundedHistoryReply`. |
| `locator-digest.ts` | `historyHandle()` and `persistHistoryLocator()`, shared by the session handover and the CLI. |
| `lookup-offer.ts` | The shared `## History Lookup` body and section, the shell quoting and the 600-character bound. |
| `navigator.ts` | `search` and `browse`, including BM25 ranking, anchors and window navigation. |
| `pages.ts` | `page`, including text pages, part lists and native image attachments under the reply budget. |
| `projection.ts` | The public projection that removes thinking, signatures, paging tool calls and image bytes. |
| `response.ts` | The 16,384-byte reply serializer and the error types it throws. |

---

## 4. THE FOUR OPERATIONS

| Operation | Input | Reply |
|---|---|---|
| `search` | `query`, optional `files`, `tools`, `failed`, `limit` | Compact references ranked by BM25, each with `previousHistoryId` and `nextHistoryId` |
| `browse` | `direction` (`backward`, `forward`, `around`), optional anchor and page shape | Anchored references in window order |
| `load` | One to three history ids | Whole public items in requested order, or deferred items with a working `readParts` handle |
| `page` | One history id, optional part handle, `mode` (`text`, `parts`, `image`), `offset`, `limit` | A bounded text page with `nextOffset`, a part list or one native image attachment |

`search` and `browse` return references only. `load` and `page` return bodies. Every reply is built through one serializer that measures the complete JSON payload in UTF-8 bytes and throws before it can exceed 16,384 bytes. A text page is also capped at 2,000 UTF-16 code units, and no cursor ever splits a surrogate pair.

`search`, `browse` and `load` return a `BoundedHistoryReply`, whose `content` array holds the serialized text. `page` returns a `HistoryPageReply`, whose `content` may also hold one native image attachment.

`search` matches fragments of identifiers, not only whole terms. A query matches whole word parts, so 'live' does not match 'delivery'.

- Text is NFKC-normalized first, so full-width `ＬＩＶＥ` matches `LIVE`.
- A term that splits on `-`, `.`, `/`, `:`, `_` or a case change is indexed whole and by its parts of two or more characters. `LIVE-MARKER-dv-2b7e` is found by `LIVE-MARKER`, `MARKER` or `dv-2b7e`, `bm25Score` by `score`, and a path by any folder or file name in it. A plain word gets no parts, so it matches only as a whole word.
- One query token needs all of its parts, and separate query tokens are alternatives. An exact mention of the whole identifier ranks above a turn that holds only its parts.
- A Han word is matched by its adjacent character pairs, so `検索` does not match a turn that holds only `検`.
- The preview centers on the matched identifier, so a fragment match shows what it matched.
- A model turn is indexed and previewed as its blocks in order: text as written, and each tool call as its name and arguments, such as `read_file {"path":"docs/design.md"}`. A tool call's id is not searchable.
- A query with no terms returns nothing unless it carries a `files`, `tools` or `failed` filter, which then lists the matching turns.

---

## 5. PUBLIC PROJECTION

The core projects every entry before a caller can see it:

- Secret-shaped values are redacted first, in text, thinking and tool-call arguments. Vendor keys, tokens, JWTs, bearer values, private keys and `key=value` credentials go through the spec-kit shared secret scrubber. The core adds a URL password, a non-bearer `Authorization` value and an argument stored under a credential name such as `password`. Each becomes a typed marker such as `[REDACTED:github-token]`. Search cannot match a secret, and every bound and page offset is measured on the redacted text. The stored transcript is never changed.
- Assistant thinking, provider signatures and redacted payloads become `null`.
- Paging tool calls (`search_history`, `browse_history`, `load_history`, `read_context_output`) and their results are removed.
- A paging-only turn disappears entirely. A mixed turn keeps its ordinary text and tool work.
- A `null` slot stays in the assistant content array so `contentIndex` still addresses the original position.
- Image bytes never become text. Text mode exposes image metadata and an image read handle. Only `mode: "image"` returns one native attachment.

No route can reach the raw entry list after `createHistoryLookup` returns.

---

## 6. BUDGET AND HANDLES

- 16,384 bytes cap one complete serialized reply.
- 4,096 bytes cap one inline part description.
- 128 characters cap a history id, and 512 characters cap a part pointer.
- 66 characters cap a locator session id after shell quoting, so the full lookup command fits the 600-character offer section. A plain id may run to 64 characters, which covers the 44-character ids DSH issues. The runtime's locator schema keeps its own copy of this bound, because the runtime builds before this package and cannot import it. `history-locator.vitest.ts` fails if the two copies disagree.
- References and continuation handles are reserved before content spends the same budget.
- A reference lists at most 6 tool names and 12 paths, and counts the rest in `omittedTools` and `omittedFiles`. `load` returns the full lists.
- Oversized reference metadata collapses to `{ historyId, detailsDeferred: true }`.
- Items load smallest-first, then the emitted `items` array is rebuilt in the caller's requested order.

A deferred item carries `id`, `kind`, `deferred: true`, a bounded `parts` list, `totalParts`, `nextPartOffset` and a `readParts` handle. Follow the handle to list more descriptions, then follow each part description's `read` handle to page the body.

---

## 7. CLI

```bash
node .skilled/hooks/session-handover/bin/history-lookup.mjs \
  --session <session-id> \
  --handle <hl1_handle> \
  <search|browse|load|page> \
  '<json-arguments>'
```

The entry lives in the handover's `bin/` folder and imports this package's `dist/cli.js`.

The argument contract:

- `--session` and `--handle` are required, and the operation is the first positional argument.
- `search`, `browse` and `page` take one JSON object. `load` takes a JSON array or `{"historyIds":["..."]}`.
- Claude runs the command as printed. Codex and Vibe prefix it with `SPECKIT_RUNTIME=codex` or `SPECKIT_RUNTIME=vibe`.
- The locator must be less than 30 minutes old. A future timestamp counts as clock skew and is treated as stale.
- The CLI checks the stored state, the handle, the session id, the runtime and `process.cwd()` against the locator workspace. It then checks the reader capability, resolves the exact session and re-derives the digest.
- Success writes one JSON line and exits 0. Every refusal writes one `{"ok":false,"code":"<code>"}` line and exits 2.

| Refusal code | Meaning |
|---|---|
| `invalid_usage` | A required flag or the operation is missing or malformed |
| `state_missing` | No hook state file exists for the session |
| `state_unreadable` | The state file cannot be read or parsed |
| `locator_missing` | The state file holds no `historyLocator` |
| `locator_invalid` | The stored locator fails the closed schema |
| `locator_stale` | The locator is 30 minutes old or older, or its timestamp is in the future |
| `handle_mismatch` | The supplied handle differs from the stored handle |
| `session_mismatch` | The supplied session id differs from the stored locator |
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
| `part_too_large` | The requested part exceeds the inline part cap |
| `reply_too_large` | The reply would exceed 16,384 bytes |
| `reply_unserializable` | The reply cannot be serialized |

---

## 8. FAIL-OPEN MAPPING

Map every failure to the adapter's own fail-open path rather than retrying inside the core.

| Error class | Codes | Meaning |
|---|---|---|
| `HistoryProjectionError` | `DUPLICATE_TOOL_CALL`, `ORPHAN_TOOL_RESULT`, `DUPLICATE_TOOL_RESULT`, `MISMATCHED_TOOL_RESULT`, `INCOMPLETE_TOOL_RESULTS` | The adapter entry list is not a paired transcript |
| `HistoryNavigatorError` | `INVALID_HISTORY_NAVIGATOR_INPUT`, `UNKNOWN_HISTORY_ANCHOR`, `UNKNOWN_HISTORY_ID` | The request is out of bounds or names something not public |
| `HistoryPageError` | `INVALID_PAGE_INPUT`, `UNKNOWN_HISTORY_ID`, `UNKNOWN_HISTORY_PART`, `PART_TOO_LARGE` | The part, mode or cursor cannot answer the read |
| `HistoryResponseError` | `HISTORY_REPLY_TOO_LARGE`, `HISTORY_REPLY_UNSERIALIZABLE` | The reply would exceed the cap or cannot be serialized |

---

## 9. EXAMPLE

`createHistoryLookup(entries)` is exported from `index.ts` and implemented in `core.ts`. The history suites import `core.ts` through its compiled `.js` specifier.

```ts
const lookup = createHistoryLookup(entries);

const reply = lookup.search({ query: 'deployment', limit: 5 });
const references = JSON.parse(reply.content[0]?.text ?? '{}');

const loaded = lookup.load(['history-12', 'history-14']);
const page = lookup.page({ historyId: 'history-12', part: '/assistantMessage/content/0' });
```

---

## 10. VALIDATION

Build the spec-kit runtime first, because the CLI reads the hook state it compiles. Then build and test this package. Run from the repository root:

```bash
npm --prefix .skilled/skills/system-spec-kit/runtime run build
npm --prefix .skilled/hooks/session-handover/history run build
npm --prefix .skilled/hooks/session-handover/history test
npm --prefix .skilled/hooks/session-handover/history run typecheck
```

Expected result: the build and the typecheck exit 0 and every history suite passes. The suites import the source in `lib/`, but the CLI suite also loads the runtime's built hook state, so a stale runtime build shows up here.

---

## 11. RELATED

- [`../README.md`](../README.md): the session handover, which mints the locator and prints the section at a claim.
- [`../bin/README.md`](../bin/README.md): the runnable entry the printed command names.
- [`../../shared/session-readers/README.md`](../../shared/session-readers/README.md): the per-runtime transcript readers the CLI loads.
- [`../../session-lifecycle/README.md`](../../session-lifecycle/README.md): the reader capability matrix.
