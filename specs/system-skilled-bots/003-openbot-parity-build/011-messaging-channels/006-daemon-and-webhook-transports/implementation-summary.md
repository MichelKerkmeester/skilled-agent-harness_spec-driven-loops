---
title: "Implementation Summary"
description: "Signal through a local signal-cli daemon and WhatsApp through a loopback webhook listener, with the signature checked before any parse and an uncertain send never repeated."
trigger_phrases:
  - "daemon and webhook transports implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports"
    last_updated_at: "2026-11-28T15:30:00Z"
    last_updated_by: "unit-orchestrator-011-006"
    recent_action: "Built and verified the Signal and WhatsApp transports and their listen rows"
    next_safe_action: "Merge the unit branch, then open child 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-daemon-and-webhook-transports"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-daemon-and-webhook-transports |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A person can now answer a bot from Signal and from WhatsApp. `bots channel listen signal` talks to the operator's own `signal-cli` daemon on loopback, and `bots channel listen whatsapp` binds a loopback listener behind the operator's tunnel and refuses any body whose signature does not match before a single byte of it is parsed.

### Phase 6: daemon-and-webhook-transports

You get two transports on the adapter contract, each running the same inbound order as child 005's. Signal reads Server-Sent Events from `/api/v1/events`, names each message `<sender>:<timestamp>`, sends through JSON-RPC `send` on `/api/v1/rpc` in 2,000 code point chunks and reconnects after 2 s, doubling to 60 s. A daemon that refuses the connection is `channel-daemon-unreachable` and the queue keeps the entry, while any send that may have landed is `unknown` and never repeated, because the JSON-RPC id is no idempotency key. A group answer from a linked sender gets the M16 reply in the group and answers nothing. WhatsApp counts body bytes as they arrive and answers `413` past 2 MiB, checks `X-Hub-Signature-256` over the raw bytes with `timingSafeEqual`, answers `401` the same way for a missing, malformed or wrong signature, drops a delivery for any number but the served one and writes `200` only after every message in the body has its seen record. The handshake echoes `hub.challenge` for the stored verify token and answers `403` otherwise. A send goes to Graph `v23.0` in 4,096 code point chunks, a `429` retries by the queue's backoff, a `408`, a `5xx` or a lost answer is `unknown`, and a later `failed` status for a sent message moves its queue entry and the run record's delivery row to `failed`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts` | Created | The probe on `/api/v1/check`, the SSE reader with the 2 s to 60 s reconnect, the inbound pipeline with the group refusal and the JSON-RPC send with its error sort |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-whatsapp.ts` | Created | The loopback listener, the size bound, the signature before parse, the handshake, the served-number filter, the failed-status mapping and the Graph send |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` | Modified, outside the Files to Change table | The sent record that maps a platform message id to its queue key, and `failDeliveredEntry`, the one move out of `delivered` |
| `.skilled/bin/bots.cjs` | Modified | The `signal` and `whatsapp` listen rows, the `announces` flag for a transport that prints its own ready line, the `channel-daemon-unreachable` probe branch with exit 4 and the two injected loopback addresses |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` | Modified | The `transport signal` and `transport whatsapp` blocks with seven tests, and Signal and WhatsApp sections inside the shared token, injection and golden tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels/` | Modified | Eleven recorded Signal and WhatsApp bodies, invented data only |
| `design/wire-notes.md` | Created | The Signal and WhatsApp wire facts in this plan's own words, one source per fact, written by the one worker that read the reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twelve Vibe workers on `deepseek-flash` wrote every file, and none needed the `cli-pi` fallback. Wave 0 ran the wire notes worker beside the queue worker: the notes worker wrote the Signal half, then the WhatsApp half in a second brief, and it is the only worker whose brief named the reference. Wave 1 started each worker the moment its inputs were verified: the Signal transport once the Signal half passed, then the WhatsApp module's listener and the fixtures side by side once the WhatsApp half passed, then the handshake and Graph send in the WhatsApp slot beside the `bots.cjs` rows. None of the transport briefs named a reference path, and each told the worker not to open the reference folder. Wave 2 wrote the test file in three sequential briefs: the Signal block, the WhatsApp block, then the shared extensions. The first Signal test run failed one case and its worker traced the cause to `runChannelVerb`, which rebuilt the io object without the two new address keys, so a one-line follow-up on `bots.cjs` forwarded them. The orchestrator ran every verify command itself after each brief, then every acceptance filter, the whole suite, the typecheck, the crate tests and the checklist commands.

| Wave | Worker | Writes | Executor | Outcome |
|------|--------|--------|----------|---------|
| 0 | notes, Signal half | `design/wire-notes.md` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 0 | queue export | `lib/channel-queue.ts` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 0 | notes, WhatsApp half | `design/wire-notes.md` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 1 | Signal transport | `lib/channel-signal.ts` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 1 | WhatsApp listener | `lib/channel-whatsapp.ts` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 1 | fixtures | `tests/fixtures/channels/` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 1 | WhatsApp handshake and send | `lib/channel-whatsapp.ts` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 2 | listen rows | `bin/bots.cjs` | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 2 | Signal tests | the test file | Vibe `deepseek-flash` | `0` / `finished`, one case failed on the missed io forward |
| 2 | io forward | `bin/bots.cjs` | Vibe `deepseek-flash` | `0` / `finished`, verify passed, the Signal block then passed |
| 2 | WhatsApp tests | the test file | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
| 2 | shared extensions | the test file | Vibe `deepseek-flash` | `0` / `finished`, verify passed |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `channel-queue.ts` gains a sent record and `failDeliveredEntry`, outside the Files to Change table | REQ-012 maps a `failed` status for a platform message id the queue knows, but no entry kept a platform id and `delivered` was terminal. The transports may not import `run-record.ts`, so only the queue module could write the run record's delivery row. The new export moves `delivered` to `failed` directly and leaves the forward-only table as it was |
| A Signal group conversation id is `group:<groupId>`, and a send to it passes `groupId` instead of `recipient` | The M16 reply has to reach the group that asked, and the daemon addresses a group by its bare id |
| A Signal group line is judged by the sender's own direct link | A group is never linked, because a code sent from a group links nothing. A linked sender's reply line gets M16 and answers nothing. Any other group line starts no run, and a stranger in a group gets no reply at all |
| A refused connection to the daemon is `channel-daemon-unreachable` with `sentBeforeError` false, and any other Signal failure that may have landed is `unknown` | The Wire Table keeps the entry queued when the daemon does not answer. The wire notes record that the reference counts a refused connection as possibly sent. The plan wins, because a refused connection never carried a byte |
| A WhatsApp `429` retries, and a signed body for another number answers `200` with nothing taken | Both follow the Wire Table and the spec edge cases. The wire notes record that the reference marks `429` final and rejects a delivery addressed only to other numbers |
| The WhatsApp probe resolves all four secrets and binds nothing, and the transport prints `bots: whatsapp listening on <host>:<port>` itself once it has bound | AC-027 needs `secret-unknown` before the bind and the ready line only after it. The listen row's `announces` flag tells `listen` to print no line of its own |
| One `parseJson` option holds the module's only `JSON.parse` | CHK-011 allows one parse on the webhook path, and a test passes a spy there to prove an unsigned body is never parsed |
| Both transports keep a `stopped` flag that only `stop` sets | `listen` calls `stop` before `start` when its signal is already aborted, and a `start` that sets its running flag again would never return. Child 005's Slack transport has a related defect, left for 015, and neither new transport shares the pattern |
| The shared tests gained Signal and WhatsApp sections, not new tests | The `transport shared` block is not table driven, so adding transports covered nothing by itself. D6 needs the token, injection and golden cases to run over both new transports |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  56 passed (56)`, `Tests  765 passed (765)`, exit 0. The floor after 011.005 is 56 files and 758 tests, so this unit adds seven tests to an existing file and loses none |
| `npm run typecheck` | PASS: exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: exit 0, lib 148, answer_flow 24, chat 41, cli_client 8, end_to_end 2, panes 51 with 1 ignored, pty_smoke 1 and render_keys 17, the same as the floor. This unit writes no crate file |
| Every acceptance filter | PASS: all seven printed `Tests  1 passed | 22 skipped (23)`, `-t "^transport signal "` printed 3, `-t "^transport whatsapp "` 4, `-t "^transport shared "` 8 and `-t "^transport "` printed `Tests  23 passed (23)` |
| CHK-011, CHK-012, CHK-022, CHK-031, CHK-032 | PASS: one `JSON.parse` in `channel-whatsapp.ts`, no ephemeral label in either module, two loopback `listen(0, '127.0.0.1'` lines in the test file, no `0.0.0.0` or `::` in the listener, no `EAA` token in a fixture |
| Import edges | Both modules import only the eight modules their row names, and no sibling transport |
| Temp folders | 12,724 `bots-*` folders before and after a run of the transport test file alone, so the new tests leave none. The servers they open are closed in teardown |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Whether `signal-cli` keeps events for a disconnected client is still UNKNOWN.** A message sent while `listen signal` is down may be lost. Settling it needs a live daemon, so the runbook's warning stands.
2. **A WhatsApp listener a test started stays bound when an assertion fails before its stop.** Each test stops its transport as its last statement, not in a `finally`. A green run closes everything.
3. **A `failed` status that arrives before the drain marks the entry `delivered` moves nothing.** The sent record is written as each chunk lands, but the entry is still `sending` until the send returns. Meta reports `sent` first, so the window is small.
4. **Lines outside this folder need their owners.** For 014: `contracts/records.md` has no row for the sent record under `channels/sent/<channel>/` or for the `platform-failed` error kind, and section 14 still reads `delivered` as final. `contracts/refusals.md` section 3.10 names `channel-daemon-unreachable` for `channel send` only, while `listen signal` now prints `bots: channel-daemon-unreachable: <detail>` with exit 4. A signed WhatsApp body that is not JSON answers `400`, which no row names. `tests/fixtures/README.md` still does not list `channels/`. For 011.007: no MIT or Apache-2.0 code was lifted, and the GPL reference was read for the wire notes only, so `THIRD_PARTY_NOTICES.md` needs no new section from this child.
5. **Two task literals were stale.** T009 expected `Tests  22 passed` and T015 `Tests  7 passed`, while child 005 left 16 transport tests and eight shared ones, so the real counts are 23 and 8.
6. **The `sent/` folder grows like `seen/`.** One record per delivered WhatsApp chunk is kept for good, the same unbounded growth the phase parent records for the seen folder.
<!-- /ANCHOR:limitations -->

---
