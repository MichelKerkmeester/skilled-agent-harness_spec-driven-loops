---
title: "Implementation Summary"
description: "One conformance suite runs the five rules over all 25 cells of the capability matrix, each real transport over a fake platform, plus three hardening cases, the notices section, the operator reference and the catalog lines."
trigger_phrases:
  - "conformance hardening and proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof"
    last_updated_at: "2026-11-28T18:00:00Z"
    last_updated_by: "unit-orchestrator-011-007"
    recent_action: "Built and verified the conformance suite, the notices section and the operator documents"
    next_safe_action: "Merge the unit branch, then open phase 012"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-conformance-hardening-and-proof"
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
| **Spec Folder** | 007-conformance-hardening-and-proof |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The messaging channels phase now closes on one suite instead of five separate claims. `tests/channel-conformance.vitest.ts` sends every operation to every transport, the real module each time, over a fake platform that stands where the provider's API stands. An operator can now set up any of the four chat providers from one page.

### Phase 7: conformance-hardening-and-proof

You get 25 rule cases, one per cell of the capability matrix. 18 undeclared cases prove the explicit unsupported result and no wire call of any kind. 7 declared cases prove a receipt, a matching call under the intent's one key and the platform message ids. A guard test checks that the driver yields those 25 names and that each real transport declares exactly what the design table says. The driver holds its own copy of the design table, so the suite checks the code against the design and not against itself. Three hardening cases cover three paths:

- A press from a sender the link does not name sends nothing.
- A prompt holding a stored secret is withheld.
- A 5,000 character Telegram send makes two calls under one key.

No transport carries the idempotency key on the wire. So the fake platform tags each message call made during a send with that send's key, and `keyedAdapter` lets a drain pass the queue entry's own key the same way.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-support.ts` | Modified | Section 5, the capability-matrix driver (`capabilityMatrix`, `conformanceCases`), and section 6, the fake platform, the conformance transports, `keyedAdapter` and `conformanceIntent` |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-conformance.vitest.ts` | Created | The guard, the 25 rule cases and the three hardening cases, 29 tests |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Modified | The `## 011-messaging-channels` section, which says nothing was lifted |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modified | Nine `Channels` rows, one per `channel*.ts` module |
| `.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` | Created | The operator reference built from the runbook and the derived secret-name table |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modified | The `bots channel` sentence and the reference bullet |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modified | The `bots channel` line under When to Use |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md` | Created | The feature entry |
| `.skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` | Modified | The Messaging channels row between Run delivery and Stop switches |
| `.skilled/skills/system-skilled-bots/leaf-manifest.json` | Regenerated | The new reference leaf under `bots-run`, which the commit hook requires |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twelve Vibe workers on `deepseek-flash` wrote every file. Each finished with `exit_code` 0 and `outcome` `finished`, and none needed the `cli-pi` fallback. The orchestrator ran every verify itself after each worker.

| Wave | Worker | Writes | Executor | Outcome |
|------|--------|--------|----------|---------|
| 0 | `w0-setup` (T001 to T003) | none | Vibe `deepseek-flash` | finished, all three checks printed what they say |
| 1, test slot | `t004-driver` | `channel-support.ts` section 5 | Vibe `deepseek-flash` | finished, verified |
| 1, test slot | `t004-platform` | `channel-support.ts` section 6 | Vibe `deepseek-flash` | finished, verified |
| 1, test slot | `t005-rules` | `channel-conformance.vitest.ts`, guard and 25 cases | Vibe `deepseek-flash` | finished, verified |
| 1, test slot | `t005-hardening` | `channel-conformance.vitest.ts`, three hardening cases | Vibe `deepseek-flash` | finished, verified |
| 1, beside the test slot | `t006-notices`, `t007-readme`, `t008-reference`, `t009-runskill`, `t009-hubskill`, `t010-entry`, `t010-catalog` | one file each | Vibe `deepseek-flash`, seven at once | all finished, all verified |

The four test briefs ran one after another in one slot, because they share two files. The seven docs workers started together with the first test brief, so eight workers ran at once.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The 18 undeclared cases sit in a describe whose name starts `R2 `, and the declared and hardening cases sit in describes that do not | Vitest matches `-t` against the describe name and then the test name, with no file prefix. A probe file showed `^R2 ` selects only such a describe, so this is the one layout where both `-t "^R2 "` and CHK-011's literal `it('<channel> ...` count hold |
| 25 literal `it` lines, each looking its case up from `conformanceCases()` by name | CHK-011 counts source lines, and a loop would count 1. A literal name the driver does not yield fails, so the matrix still drives every case |
| The fake platform keeps two logs: every call, and the calls that carried a message | R2 means no call of any kind. The press hardening case must allow Telegram's `answerCallbackQuery`, which stops the client's spinner on receipt and carries no message |
| The press hardening case asserts the silent `channel-unlinked` drop, not `answer-not-approver` | The frozen 001 catalog section 2 and `resolveLink` refuse a sender mismatch in silence. An `answer-not-approver` refusal would queue an M14 reply that a drain sends, so REQ-030's two clauses cannot both hold. D2 bars a transport change |
| The notices section says nothing was lifted | 011.005 wrote its transports from its own wire notes and 011.006 lifted nothing under MIT or Apache-2.0. The spec's open question says an empty section that says so meets REQ-018 |
| The feature entry keeps the template heading `## 3. SOURCE FILES` | Every sibling entry and the sk-doc template use it. T010's case-sensitive `Source Files` grep is task drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/channel-conformance.vitest.ts` | PASS: `Tests  29 passed (29)` |
| `-t "^R2 "` | PASS: `Tests  18 passed \| 11 skipped (29)` |
| `-t "^hardening "` | PASS: `Tests  3 passed \| 26 skipped (29)` |
| `npm test` in the runtime | PASS: `Test Files  57 passed (57)`, `Tests  794 passed (794)`, exit 0. The floor was 56 files and 765 tests, so this unit adds one file and 29 tests and loses none |
| `npm run typecheck` | PASS: exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: exit 0, lib 148, answer_flow 24, chat 41, cli_client 8, end_to_end 2, panes 51 with 1 ignored, pty_smoke 1, render_keys 17, the same as the floor |
| `parent-skill-check.cjs .skilled/skills/system-skilled-bots` | PASS: `OK: ... all hard invariants passed, 0 warnings`, after the leaf manifest was regenerated |
| Playbook validator, package `system-skilled-bots` | PASS: `scenarios=58 ... violations=0 warnings=0`, unchanged |
| T006, T007, T008, T009, T011 and CHK-031 | PASS: one heading line and `tinychannels` exit 1. 9 README rows. 12 check rows and one `may be lost` line. 2 SKILL files. No missing secret name. Credential grep exit 1 |
| CHK-010 and CHK-050 | PASS: `git diff --stat -- runtime/lib/*.ts` is empty. Only the nine owner paths and `leaf-manifest.json` changed |
| Temp folders | PASS: zero `bots-*` folders under `$TMPDIR` before and after the conformance file alone and the whole suite |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The key clause of R4 is as strong as the fake's tagging.** No transport sends the key, so the fake tags calls with the key of the send in flight. A call made outside a send is tagged `null` and fails R4. A transport that repeated a message inside one send would still carry the one key, so a repeat shows only in the call count, which the chunked hardening case pins at two.
2. **The two known transport defects stay for 015.** No case starts a transport, so the Slack `stop()` inside the socket factory and a `failed` status that arrives while an entry is still `sending` are neither exposed nor fixed here.
3. **Lines outside this folder need their owners.** For 014:
   - REQ-030 and AC-030 should name `channel-unlinked` with detail `sender mismatch` for a press from another sender, and so should `../002-adapter-and-record-contracts/design/conformance-rules.md` section 2.
   - T010's verify should match `SOURCE FILES`.
   - In `runtime/lib/README.md`, the `delivery.ts` row still reads "The one channel is `desktop`" and the Boundaries row still says only `delivery.ts` sends a notice.
   - The feature catalog's Run delivery entry still lists only `local-only` and the desktop notice.
   - `bots-run/ROUTER.md` still says the packet has one reference leaf, and it has three.
<!-- /ANCHOR:limitations -->
