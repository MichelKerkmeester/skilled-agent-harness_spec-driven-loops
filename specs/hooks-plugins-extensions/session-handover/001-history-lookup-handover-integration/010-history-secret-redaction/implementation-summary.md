---
title: "Implementation Summary"
description: "The history lookup now redacts API keys, tokens, private keys, auth headers and URL passwords before any reply or search sees them, so a claiming session reads typed markers instead of the sender's secrets."
trigger_phrases:
  - "history secret redaction implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/010-history-secret-redaction"
    last_updated_at: "2026-11-15T20:47:50Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified history lookup intake redaction"
    next_safe_action: "Run the sk-git commit and merge of worktree 421 once approved"
    packet_purpose: "Purpose: A claiming session reads typed markers such as `[REDACTED:github-token]` wherever the sender's transcript held a secret, and the stored transcript stays as it was."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/history/lib/core.ts"
      - ".skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts"
      - ".skilled/hooks/session-handover/history/README.md"
    session_dedup:
      fingerprint: "sha256:39cfc979cf7501ca185f2022aa53baa0e221e1f2b79ade585f0245455b9d3bf1"
      session_id: "scaffold-010-history-secret-redaction"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "87e90d42-7a99-4147-b5e1-353501784430"
      workspace: "/Users/michelkerkmeester/worktrees/public/421-history-secret-redaction"
      savedAt: "2026-11-15T20:47:50Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-history-secret-redaction |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session that claims a handoff no longer reads the sender's secrets back. Every history lookup reply now carries a typed marker such as `[REDACTED:github-token]` where the transcript held a key, a token, a private key, an `Authorization` value or a URL password, and a search for the secret finds nothing.

### Phase 10: history-secret-redaction

The lookup core redacts each entry once, as it arrives and before projection. Because every operation reads the same redacted items, search cannot match a secret, and the 16,384-byte reply bound and the 2,000-unit page offsets are measured on the text you receive. A secret that straddles a page edge is already gone before paging splits it. The stored transcript is never touched, because the lookup only reads.

Most shapes come from the spec-kit shared secret scrubber. The core adds the three your scope named that it lacks: a password inside a URL, a non-bearer `Authorization` value with a digit or mixed case, and a tool-call argument stored under a credential name such as `password`. A shell variable reference such as `$GITHUB_TOKEN` stays, because it names a secret without holding one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/history/lib/core.ts` | Modified | Redact text, thinking and tool-call arguments in every entry before projection |
| `.skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts` | Created | Four cases: every operation, search on a secret, a secret across a page edge, paging exclusion with ordinary text |
| `.skilled/hooks/session-handover/history/README.md` | Modified | One bullet in the public projection section |
| `scratch/repro-secret-leak.mjs` | Created | The repro behind the Measured Behavior block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The leak was reproduced first against the unchanged build, where all six fixture secrets came back and a search on the AWS key found its turn. The fix landed in worktree 421, then the repro, the redaction suite with a negative control, the four regression suites, the typecheck, the build and one run through the real CLI path confirmed it. Fixture secrets are assembled from fragments at run time, so no test file holds a credential signature for the secret scanners.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Redact at intake in `createHistoryLookup`, not on each reply | Every operation reads the projected items, so one transform covers all four. Scrubbing replies would let search match a secret, would miss a secret split across two pages, and would leave page offsets pointing into text the caller never saw. |
| Reuse the shared scrubber instead of a new pattern list | It already covers vendor keys, tokens, JWTs, bearer values, private keys and `key=value` credentials, with tested guards against skill slugs and placeholders. |
| Keep the three extra shapes local to the engine | The shared scrubber also serves the continuity writer. Adding patterns there changes a contract this phase does not own, so the move is recorded as a follow-up. |
| Leave `cli.ts` alone | A scrubber failure throws inside `createHistoryLookup`, and the CLI's catch already turns it into `operation_invalid` with no reply, so the lookup fails closed. Worktree 420 is editing `cli.ts`. |
| Leave image bytes, ids and tool names untouched | A pattern hit inside base64 would corrupt the image, and pairing and paging detection depend on the ids and names. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repro `node scratch/repro-secret-leak.mjs <engine>/dist/core.js` | Before: `load` leaked `ant,gh,aws,pem,auth,url`. After: `leaked: none` for all four replies |
| Engine suite `npm --prefix .skilled/hooks/session-handover/history test` | PASS, 144/144, exit 0 (baseline 140) |
| Engine typecheck and build | PASS, exit 0 both |
| Negative control, intake call removed | 3 failed, 1 passed. Restored: 4/4 |
| Hooks vitest tree | PASS, 501/501, exit 0 (baseline 501) |
| Session readers `node --test` | PASS, 103 pass, 0 fail, exit 0 (baseline 103) |
| Handover `node --test` (CLI, entry, hop-history, relaunch-core) | PASS, 390 pass, 0 fail, exit 0 (baseline 390) |
| Real CLI path, throwaway copy of the CLI suite | PASS, 1 passed: both markers present, neither secret, copy deleted |
| Quality gate on `core.ts` and the new suite | `NO_BLOCKER_FOUND`, 0 findings |
| Quality gate on the whole worktree change, scratch repro included | `NO_BLOCKER_FOUND`, 0 findings, exit 0 |
| Runtime mirrors `sync-runtime-mirrors.cjs --check` | PASS, 257 mirrors across 10 trees in sync, exit 0 |
| Redaction cost, 219.1 MB real transcript, 12,960 items, `009/scratch/measure-real-transcript.mjs`, two runs each | Building the lookup went from 54 to 57 ms to 225 to 232 ms, about 170 ms more. Lookup heap went from 17.0 to 19.1 MB. First search stayed at 1.1 to 1.2 s, the index at 95.4 MB and the process peak at 1.09 GB. |
| Acceptance verification | Level 1, so there is no `acceptance-criteria.md`. REQ-001 to REQ-005 are each met by the rows above. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Redaction is a floor, not a guarantee.** A secret with no vendor prefix, no fixed shape and no credential context, such as a bare random password in prose, still passes through. A new shape is one pattern in the shared scrubber.
2. **A token glued to word characters is missed.** The vendor patterns need a word boundary, so `xghp_...` with no separator is not redacted. Real transcripts nearly always separate a token with a space, quote, `=` or newline.
3. **Two shapes live outside the shared scrubber.** The URL password and `Authorization` patterns cover the history lookup only, until they move into the shared scrubber as a follow-up.
<!-- /ANCHOR:limitations -->

---
