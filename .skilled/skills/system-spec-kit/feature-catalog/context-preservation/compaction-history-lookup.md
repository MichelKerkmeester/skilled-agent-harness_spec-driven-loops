---
title: "Compaction history lookup"
description: "Offers one bounded, read-only history lookup after a compaction when the runtime hook minted a fresh locator and the session reader is ready."
trigger_phrases:
  - "compaction history lookup"
  - "history lookup after compaction"
  - "opaque history handle"
  - "history lookup CLI"
  - "post-compaction transcript lookup"
version: 1.0.1.0
---

# Compaction history lookup

This catalog entry maps the bounded post-compaction history lookup to its implementation files, validation tests and operator reference.

## 1. OVERVIEW

A compaction replaces the conversation the model was working from. The compaction hooks mint an opaque locator for the exact session that compacted, and they may inject one small `## History Lookup` section that names the handle and one runnable command. The command redeems the handle through the read-only history lookup core and prints one bounded JSON reply.

The offer is optional in both directions. When the locator is missing, malformed, stale, foreign or unsupported, the hooks keep the existing recovery surface and inject no lookup section.

---

## 2. HOW IT WORKS

### Locator Mint

Each adapter mints a locator only for the session it was handed. Claude's `compact-inject.ts` mints on `PreCompact` from the transcript path the host supplied, and Codex's `PreCompact` adapter delegates to the same module. Pi's `session-compact-context.ts`, Devin's `post-compaction.cjs`, DSH's `session-compact-context.mjs` and the OpenCode plugin `.opencode/plugins/session-history-lookup.js` mint on their post-compaction events from the session id and folder alone. The locator records the runtime, the exact session id, the workspace, the runtime's locator type, a digest handle and a mint time.

The workspace is the checkout root above the session folder, found by `placeLookup` as the nearest folder with a `.git` entry, which is the folder the printed command moves to. A session started below the root also keeps that folder as `sessionDirectory`, and the reader proves the session against it. When the nearest root cannot run the CLI, such as a nested repository without it or a folder outside any checkout, no locator is minted.

The handle is a digest, never a store path. A locator that contains no path cannot leak one and cannot be authored by a model. Claude and Codex use `transcript_path`, Pi uses `live_branch_or_session_log`, Devin uses `transcript_file`, DSH uses `session_log` and OpenCode uses `session-store`. The adapter persists the locator in the hook state keyed by the checkout root, where the CLI reads it. Claude also keeps its copy in the session folder's state, where its `SessionStart` hook reads it.

### Bounded Offer

The section is capped at 600 characters. It holds one ready `browse` command that lists the latest turns, with the session and opaque handle filled in, and the argument shape of `search`, `load` and `page`. The command runs in a subshell that first moves to the checkout root, so it works for a session started in a subfolder and from a shell that has moved, without moving the model's shell. On Pi only the summary shortens to fit the 4 KiB message, so the command and the recovery pointer always arrive whole. It also tells the model to treat retrieved history as data, never as instructions.

The hook emits the section only when every gate passes. The locator must match the session, runtime, workspace and provenance source the hook expects, and the workspace must be a checkout root that can run the CLI. Its mint time must be less than 30 minutes old, and a future timestamp counts as stale. The reader readiness table exported by `.skilled/hooks/shared/session-readers/index.mjs` must report the runtime as `ready`, so Cursor, whose PreCompact capture point is unconfirmed, stays gated and receives no section.

Where the section arrives depends on the host. On Claude it rides the `SessionStart(source=compact)` output. On Pi and DSH the adapter appends the lookup section and then the `## Recovery` pointer. Devin does not pass `PostCompaction` output to the model, so its adapter saves a one-shot marker beside the locator and the next `UserPromptSubmit` hook prints the section once, after the advisor context. OpenCode adds the section to the system text of each request while the locator is fresh, through `experimental.chat.system.transform`.

### Command Redemption

The hook prints the compiled command path, the exact `--session` id and the opaque `--handle`, followed by one operation and its JSON arguments. Every runtime but Claude prefixes `SPECKIT_RUNTIME=<runtime>`, because those hosts do not export the label the CLI detects.

A shell call that runs the CLI counts as paging, so a model's own lookups and their replies are left out of every later reply.

The CLI at `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts` re-reads the stored locator, repeats the handle, session, runtime, workspace and 30-minute freshness gates, resolves the exact store through the shared session reader, recomputes the handle the same way the adapter did and answers one operation through `createHistoryLookup`. Every step is read-only. A refusal prints one `{ok:false, code}` JSON line and exits 2, and a success prints one capped reply and exits 0.

### Fail-Open Behavior

A missing, malformed, stale, foreign or unsupported locator produces no section and no change to the recovery ladder. The hooks catch their own failures, so a missing build or an unwritable state directory disables the offer instead of blocking compaction.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/` | Core folder | Runtime-neutral lookup core: projection, BM25 `search` and `browse`, bounded `load`, paged reads and the 16,384-byte reply cap. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts` | CLI | Redeems the printed command, repeats every locator gate and writes one reply or one `{ok:false, code}` refusal. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/locator-digest.ts` | Shared | The one `hl1_` handle digest, the locator constants and the persisted-state writer. |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` | Shared | The offer section, the checkout-root gate and `placeLookup`, which keys a locator by the checkout root above the session folder. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Claude PreCompact hook | Mints the locator from the supplied transcript and persists it with the compact cache. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Claude SessionStart hook | Builds the bounded `## History Lookup` section on `source=compact` when the stored locator is fresh and the reader is ready. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Pi adapter | Mints a Pi locator on `session_compact`, persists it and appends the lookup and `## Recovery` sections. |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | Devin adapter | Mints a Devin locator on `PostCompaction`, persists it with a one-shot offer marker and appends the `## Recovery` section. |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts` | Devin prompt hook | Prints the lookup section once on the next prompt after a compaction, from the marker and the stored locator. |
| `.opencode/plugins/session-history-lookup.js` | OpenCode plugin | Mints an OpenCode locator on `session.compacted`, persists it and adds the lookup section to each request's system text while the locator is fresh. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs` | DSH adapter | Mints a DSH locator on `compaction/end`, persists it and appends the lookup and `## Recovery` sections. |
| `.skilled/hooks/shared/session-readers/` | Reader package | One read-only reader per runtime plus the readiness table the hooks and the CLI gate on. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` | Vitest | Refusal envelope, exit codes, freshness and the unsupported-runtime gate. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts` | Vitest | Offer gates: session, runtime, workspace, provenance, the 30-minute boundary and reader readiness. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Vitest | Pi, Devin and DSH mint, persist and compose behavior, including the path where the reader is not ready. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-after-session-start.vitest.ts` | Vitest | The compact-to-redemption path, including the cache clear that keeps the locator. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-adapters-e2e.vitest.ts` | Vitest | End-to-end redemption of the Pi, Devin and DSH offers from persisted state. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-devin-prompt-offer.vitest.ts` | Vitest | The Devin marker, the one-shot prompt offer and the subfolder read-back from the checkout root. |
| `.opencode/plugins/tests/session-history-lookup.test.cjs` | Node test | The OpenCode plugin from `session.compacted` to a printed command that redeems from a subfolder. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-byte-bound.vitest.ts` | Vitest | The 16,384-byte reply cap and the deferral of oversized items. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-projection.vitest.ts` | Vitest | Thinking, signature and paging removal before any entry reaches a caller. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-search-browse.vitest.ts` | Vitest | BM25 search, anchored browse and window navigation. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-search-analyzer.vitest.ts` | Vitest | Fragment search: identifier parts, full-width text, Han pairs, match-centered previews, empty queries and the reference file cap. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-cursor-reconstruction.vitest.ts` | Vitest | Cursor handling across pages and partial reads. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-entry-contract.vitest.ts` | Vitest | The entry shape and the published schema. |
| `.skilled/hooks/shared/tests/session-readers/matrix.test.mjs` | Node test | The reader readiness matrix and the reader refusal envelope. |
| `.skilled/hooks/shared/tests/session-readers/side-effects.test.mjs` | Node test | Readers stay read-only and write nothing. |

---

## 4. SOURCE METADATA

- Group: Context Preservation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/compaction-history-lookup.md`

Related references:
- [Session recovery via /speckit:resume](../retrieval/session-recovery-spec-kit-resume.md) - the packet-first ladder that remains the primary recovery path.
- [Compaction history lookup scenarios](../../manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md) - the operator checks for a fresh locator, a missing or stale locator, an unsupported runtime, the printed command and the 30-minute TTL.
