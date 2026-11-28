---
title: "Implementation Summary"
description: "A bot can now use a stored secret by name. The value reaches only the child environment and is caught if the child prints it."
trigger_phrases:
  - "vault implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/008-vault"
    last_updated_at: "2026-11-28T00:30:00Z"
    last_updated_by: "008-vault-orchestrator"
    recent_action: "Built the vault and closed every acceptance row"
    next_safe_action: "Merge the unit branch into system-skilled-bots"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-vault"
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
| **Spec Folder** | 008-vault |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot that declares `secrets: demo` now gets `SKILLED_BOT_SECRET_DEMO` in its child environment and nowhere else. If the child prints the value in any of its common encodings, the run folder and the re-emitted stderr carry `[redacted: demo]` instead and the delivery is withheld.

### Phase 8: vault

You store a value once with `bots secret set demo`, and it never appears in an argv, a record or a run folder. `bots secret list` shows the name, its backend and its two timestamps. `bots secret forget demo` removes both the value and its entry, and a second forget says the name was not held. A value lives in the macOS keychain or the Linux secret service when the host has one, or in a 0600 file under the identity's `secrets` folder. A small 0600 index records which backend holds each name and who set it.

Every surface that already refused a literal secret now checks against the vault too: the body, a request prompt, a resumed question or answer, an operator answer and a delivery message. A vault that cannot be read refuses rather than checking the environment alone. The boundary is the OS user. Any bot child can read a value file, and the grant only decides which key is injected.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Created | The store: names and keys, the index and its lock, the file and keychain backends, and the set, list, forget and resolve verbs |
| `.skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts` | Created | The one-pass multi-value matcher lifted from Rakazo under Apache-2.0 |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified | `collectAllKnownSecrets`, a one-pass `findSecretLiteral` and the captured `stderr` on `DispatchOutcome` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | Resolves the declared name, injects its key on `extraEnv`, and runs the post-run scan that redacts and records `secret-in-output` |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modified | Withholds a send for a leaked run or an unreadable vault, and checks the message against the vault |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modified | Checks an operator answer against the vault and fails closed |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | Optional `posture.secretsUsed` and the `secret-in-output` post-run cause |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modified | Refuses a `secrets` name outside the name grammar as `secret-name-invalid` |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modified | The identity's `secrets` folder, made owner-only with the rest |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | An optional `onStderr` sink, so a caller can redact the child's stderr before it is written |
| `.skilled/bin/bots.cjs` | Modified | The `secret` verb group, and remember's check against the vault |
| `.skilled/skills/system-skilled-bots/runtime/tests/secrets.vitest.ts` | Created | 43 tests over the store, the run and the CLI behind a fake keychain |
| `.skilled/skills/system-skilled-bots/runtime/tests/secret-matcher.vitest.ts` | Created | The two lifted matcher cases and a one-pass check |
| `.skilled/skills/system-skilled-bots/runtime/tests/state-root.vitest.ts`, `runner.vitest.ts`, `apps.vitest.ts` | Modified | Pins that now include the `secrets` folder and `secretsUsed: []` |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Modified | The `## 008-vault` section with the Apache-2.0 license text |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt`, `bots-author/references/bot-definition.md`, `feature-catalog/definition/bot-definition-contract.md`, `runtime/lib/README.md` | Modified | The docs now name the verb, the key and the refusal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Vibe workers on deepseek-flash wrote the code and the tests in five internal waves of file-disjoint tasks. The orchestrator wrote the briefs and reran every verify. Wave 1 laid the matcher, the state folder, the definition check, the record fields, `onStderr` and the docs. Wave 2 built `secrets.ts` in two slots and the dispatch matcher. Wave 3 added `collectAllKnownSecrets` and the store tests. Wave 4 wired the runner, delivery, answer and the CLI. Wave 5 appended the run and CLI tests. One wave 4 change failed its verify and passed on a cli-pi retry. Two live cli-codex runs of the fixture closed the rows that read a real record.

The evidence is the working-tree diff against the base `0ae023ff836`, committed as one unit commit on `worktrees/566-openbot-008-vault`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Every keychain call is synchronous through `spawnSync` with a 10 s kill | It keeps every store verb and the pre-dispatch resolve synchronous, and the kill still bounds a hung program. `design/backends.md` says `child_process.spawn`, and this is the one deviation from it |
| Every stored value joins the known-secret map, not only the declared one | Any child can read any value file as the same OS user, so a check that knows only the declared value would pass another stored one |
| `secret set` and `secret forget` refuse inside a bot child, and `list` stays open | A child that rewrites the vault could plant a value it later reads. Listing carries no value |
| A message's own literal is reported before a leaked run or an unreadable vault | Naming the key the message holds is the evidence an operator acts on |
| `posture.secretsUsed` is optional on the record | A record written before this phase still validates |
| The resolve sits after the apps step rather than straight after posture | The record seed takes the honored apps first and then the secret names. A bot that fails both checks reports the apps refusal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime `npm test` | PASS: 49 files and 634 tests against the 47 and 588 floor. The two new files add 3 and 43 tests |
| Runtime `npm run typecheck` | PASS: exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: exit 0 |
| Deep-loop executor tests | PASS: 11 files, 241 passed and 2 skipped, equal to the floor |
| Deep-loop `npm run typecheck` | PASS: exit 0 |
| CLI fixture checks for AC-001 to AC-006, AC-010, AC-023 and AC-025 | PASS: each printed its expected line and exit code |
| Live cli-codex run of `pb-vault` with `secrets: demo` | PASS: converged, `secretsUsed` is `["demo"]`, and no value in the run folder, the record or the bots streams |
| Live cli-codex run of `pb-reader` with no `secrets` | PASS: the child read the value file and the record names no secret |
| `security find-generic-password -s skilled-bots` after the suite | PASS: `exit=44` |
| Acceptance criteria | PASS: 28 of 28 `Met` |

Finding classes: the delivery branch order was `instance-only`, since one function chose the evidence. The state-root folder pin was `test-isolation`, a pinned list in one test.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The grant is not a wall.** Any bot child can read any value file or keychain item as the same OS user. Run a bot you do not trust under a separate user.
2. **Some plan greps cannot pass as written.** `collectAllKnownSecrets` in the runner, delivery and answer, and `createSecretMatcher` in dispatch, each count 2 with an import line and a call line. `timingSafeEqual` in `secrets.ts` counts 2 the same way.
3. **Catalogue gaps outside this unit.** `contracts/refusals.md` section 3.4 lacks `remember-fact-too-long`, and section 3.7 lacks `secret-keychain-unavailable`, which the verb exits 2 on. Task T001 says 20 REQ rows while CHK-001 says 19. The spec has 20.
4. **AC-027's `agent-logs` scan needs a scheduled job.** A manual run writes no `agent-logs` file, so the live check scanned the bots process's own stderr instead.
<!-- /ANCHOR:limitations -->
