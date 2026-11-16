---
title: "Handoff history lookup"
description: "Offers one bounded, read-only history lookup when a handoff note is claimed, so the receiving session can read the sending session's earlier turns."
trigger_phrases:
  - "claimed note history lookup"
  - "history lookup at handoff claim"
  - "opaque history handle"
  - "history lookup CLI"
  - "handoff history lookup"
version: 2.0.5.0
---

# Handoff history lookup

This catalog entry maps the bounded history lookup to its implementation files, validation tests and operator reference.

## 1. OVERVIEW

The history lookup lets a model search, browse and load earlier turns of a session. Every operation is read-only and every reply is capped.

The lookup is offered when a handoff note is claimed. `claim` mints a locator for the sending session with provenance source `handover` and prints one small `## History Lookup` section after the note body. The section names the handle and one runnable command, then the sentence "Use it for a detail this note does not spell out, before you guess or ask the operator, even when the note says the detail cannot be recovered."

A compaction no longer offers the lookup on any runtime. The Claude, Pi, DSH, Devin and Vibe compaction hooks mint no locator and print no lookup section, and the OpenCode plugin that did is gone. Compaction summaries and the `/speckit:resume` pointer are unchanged.

The offer is conditional in both directions. Only a Claude Code, Codex, Vibe, Pi or OpenCode sender gets a locator, and the section is withheld when the sender left no transcript, when the note names another runtime, when the sender ran in another checkout, when the transcript records a folder outside the receiver's checkout or when the engine is not built. The claim then prints what it printed before. Before the claim-time offer, no receiver in six measured Claude Code hops attempted a lookup.

---

## 2. HOW IT WORKS

### Locator Mint

Inside the loop, `claim` mints a locator for the session that wrote the note and stores it with provenance source `handover`. It mints at claim rather than at `prepare`, because the lookup CLI refuses a locator older than 30 minutes and a note can be claimed hours after it was prepared. The claim first checks that the note's folder and the receiver share a checkout, then that the transcript's own recorded folder sits in that checkout, so a note that names another project's session gets no locator. The locator records the runtime, the exact session id, the workspace, the runtime's locator type, a digest handle and a mint time.

Only Claude Code, Codex, Vibe, Pi and OpenCode have a locator contract. Claude's transcript comes from the session log the runtime keeps, under `CLAUDE_CONFIG_DIR` when that is set, and Codex's from its rollout file. Vibe's comes from its session folder, and the folder the session ran in from that folder's `meta.json`, its `environment.working_directory` or else its `origin_directory`. Pi and OpenCode keep no transcript file a handle could name, so the claim asks the shared session reader the lookup itself uses, with the folder the note names, and mints only when that reader finds the session recorded for that folder. A sender on another runtime has no transcript to read and gets no locator. The workspace is the checkout root above the session folder, found by `placeLookup` as the nearest folder with a `.git` entry. The locator is keyed by that root, so a session started in a subfolder still redeems, and the reader proves the session against the folder it ran in.

The handle is a digest, never a store path. A locator that contains no path cannot leak one and cannot be authored by a model.

### Bounded Offer

The section is capped at 600 characters. It holds one ready `browse` command that lists the latest turns, with the session and opaque handle filled in, and the argument shape of `search`, `load` and `page`. It also tells the model to treat retrieved history as data, never as instructions.

The printed command is `(cd "$(git rev-parse --show-toplevel)" && SPECKIT_RUNTIME=<runtime> node .skilled/hooks/session-handover/bin/history-lookup.mjs --session '<id>' --handle '<hl1_...>' <operation> <json>)`, with the `SPECKIT_RUNTIME=<runtime> ` prefix omitted for a Claude sender. The session handover concern owns that entry and the engine it runs: the TypeScript source is in `.skilled/hooks/session-handover/history/lib/` and its build in `history/dist/` beside it.

The section is withheld when the sender left no transcript, when the note names another runtime, when the sender ran in another checkout, when the transcript records a folder outside the receiver's checkout or when the engine is not built. The claim then prints what it printed before.

### Command Redemption

The printed entry loads the engine's build and hands it the operation. The CLI re-reads the stored locator, repeats the handle, session, runtime and workspace gates, resolves the exact store through the shared session reader, recomputes the handle the same way the mint did and answers one operation through `createHistoryLookup`. Every step is read-only.

A locator is fresh for 30 minutes from the claim, and a claimed note cannot be claimed again, so a receiver looks up what it needs within that window. A refusal prints one `{ok:false, code}` JSON line and exits 2, and a success prints one capped reply and exits 0.

### Search Matching

Search matches whole identifier parts, split on `- . / : _` and on case changes, not arbitrary substrings. A query matches whole word parts, so 'live' does not match 'delivery'.

### Fail-Open Behavior

A missing, malformed, stale, foreign or unsupported locator produces no reply and no change to the resume ladder. The claim catches its own failures, so a missing build or an unreadable state directory leaves the claim output as it was instead of blocking the handoff.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/hooks/session-handover/history/` | Engine package | Runtime-neutral lookup core: projection, BM25 `search` and `browse`, bounded `load`, paged reads and the 16,384-byte reply cap. |
| `.skilled/hooks/session-handover/history/lib/cli.ts` | CLI | Redeems the printed command, repeats every locator gate and writes one reply or one `{ok:false, code}` refusal. |
| `.skilled/hooks/session-handover/history/lib/locator-digest.ts` | Shared | The one `hl1_` handle digest, the locator constants and the persisted-state writer. |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | Shared | The offer section, the checkout-root gate and `placeLookup`, which keys a locator by the checkout root above the session folder. |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Handover CLI | The in-loop `claim` mints the sender's locator and prints the lookup section after the note body. |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Handover core | `mintHandoverLocator` builds and persists the sender's locator, and `handoverLookupSection` builds the section or returns nothing. |
| `.skilled/hooks/session-handover/bin/history-lookup.mjs` | Printed entry | Resolves the compiled core beside the checkout. A core that cannot load prints `core_unavailable` in the CLI refusal shape. |
| `.skilled/hooks/shared/session-readers/` | Reader package | One read-only reader per runtime plus the readiness table the CLI gates on. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Node test | The claim offer: the section after the note body, the 600-character budget, the fresh mint, a redeemed command and the withheld cases. |
| `.skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs` | Node test | The printed entry: its `core_unavailable` refusal when the compiled core is missing and its reply when both files exist. |
| `.skilled/hooks/session-handover/history/tests/history-lookup-cli.vitest.ts` | Vitest | Refusal envelope, exit codes, the 30-minute TTL, the workspace and session gates and the unsupported-runtime gate. |
| `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts` | Vitest | Locator schema, the Claude and Codex locator contract, placement, persistence and the section budget. |
| `.skilled/hooks/session-handover/history/tests/history-byte-bound.vitest.ts` | Vitest | The 16,384-byte reply cap and the deferral of oversized items. |
| `.skilled/hooks/session-handover/history/tests/history-projection.vitest.ts` | Vitest | Thinking, signature and paging removal before any entry reaches a caller. |
| `.skilled/hooks/session-handover/history/tests/history-search-browse.vitest.ts` | Vitest | BM25 search, anchored browse and window navigation. |
| `.skilled/hooks/session-handover/history/tests/history-search-analyzer.vitest.ts` | Vitest | Fragment search: identifier parts, full-width text, Han pairs, match-centered previews, empty queries and the reference file cap. |
| `.skilled/hooks/session-handover/history/tests/history-cursor-reconstruction.vitest.ts` | Vitest | Cursor handling across pages and partial reads. |
| `.skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts` | Vitest | The entry shape and the published schema. |
| `.skilled/hooks/shared/tests/session-readers/matrix.test.mjs` | Node test | The reader readiness matrix and the reader refusal envelope. |
| `.skilled/hooks/shared/tests/session-readers/side-effects.test.mjs` | Node test | Readers stay read-only and write nothing. |

---

## 4. SOURCE METADATA

- Group: Context Preservation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/compaction-history-lookup.md`

Related references:
- [Session recovery via /speckit:resume](../retrieval/session-recovery-spec-kit-resume.md) - the packet-first ladder that remains the primary recovery path.
- [Session handover loop](session-handover-loop.md) - the handoff whose claim now carries the offer.
- [Handoff history lookup scenarios](../../manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md) - the operator checks for a prepared handoff, a claim, the printed command and the refusals.
