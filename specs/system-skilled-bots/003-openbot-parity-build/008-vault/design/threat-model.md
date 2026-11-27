---
title: "Design: vault threat model"
description: "What the vault protects, who can reach a value and by which path, the control for each path, the residual each control leaves and the test or decision that pins it."
trigger_phrases:
  - "vault threat model"
  - "secret store threats"
  - "same-user boundary"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Vault threat model

**The asset.** A stored secret value. Its name, its backend and its timestamps are not secret: `bots secret list` prints them and the run record carries the name.

**The boundary.** The OS user. Every bot child runs as the operator's own user, so the vault separates bots by not injecting a name and never by file permissions. This is decision D6, confirmed as designed. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D6] Inside that boundary the vault's job is narrower: keep each value out of every surface the runtime itself writes or sends, and catch a child that prints one.

**Actors.**

| Actor | Can | Cannot, by design |
|-------|-----|-------------------|
| The operator | set, list and forget values, run bots | nothing is withheld from the operator |
| A bot author, through `BOT.md` | name one secret for the bot | read a value, or name one the store does not hold without the run refusing |
| A bot child | read its own `SKILLED_BOT_SECRET_<NAME>`, and as the same OS user read any `.value` file and any keychain item `security` can read | receive a second name's key through the dispatch environment |
| Another OS user on the host | nothing the 0700 folder and the user keychain protect | |
| A backup or sync tool | copy the state root | read a keychain value from the copied state root |

---

## THREATS

| ID | Threat | Path | Control | Residual | Pinned by |
|----|--------|------|---------|----------|-----------|
| T1 | The value lands in shell history or the process table of the CLI | an argument | The value is read from stdin only. `--value` is an unknown option (`leak-checks.md` section 1) | none on the CLI | AC-001, AC-016 |
| T2 | The value lands in the process table of `security` or `secret-tool` | the keychain program's argv | The value goes on the program's stdin, in hex form (`backends.md` sections 2.2 and 3) | A process that can read the program's stdin pipe is the same user | AC-016, the fake program's argv log |
| T3 | A long value is split by `security -i` into pieces that run as separate commands, write a truncated item to the default keychain and echo the rest to stderr | the 4,096 byte line limit | The line is measured before the spawn and a long one refuses `secret-too-long` (`backends.md` section 2.3). The program's stdout and stderr are never printed | none once the check holds. Observed twice while this design was probed | AC-018 |
| T4 | A locked keychain hangs a run or a `set` with no end | the unlock dialog | A 10 s timeout and `SIGKILL` on every keychain spawn, mapped to `secret-store-unreadable` or `secret-write-dropped` (`backends.md` section 2.4) | While the keychain is locked, every run of every bot in the identity refuses, a bot that names no secret included, because the known-secret map cannot be built. Each run spends one 10 s timeout first. The installed jobs run in the `gui/<uid>` domain, so they reach the login keychain while the operator is logged in [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:327] | AC-019 |
| T5 | One identity's `forget`, or a test, deletes or overwrites another identity's value | a keychain item keyed by the bare name | The account is `<name>@<scope>`, scoped to the identity's `secrets/` folder (`names-and-keys.md` section 3). Tests never reach the login keychain (`backends.md` section 7) | Two state roots that resolve to one real path share items, which is the same store | AC-020 |
| T6 | A child writes the value to a file, a commit or the network | the child's own I/O | None in this phase. The record names the secret, so the operator knows which bot held which key | Accepted for the small-team model (`spec.md` risk table) | the risk table |
| T7 | A child prints a transformed value | output that is not the plain, lowercase hex, base64 or URL-encoded form | The post-run scan matches those four forms only, base64 with or without padding (`leak-checks.md` section 3.1) | A deliberate transform passes. The scan catches mistakes, not a hostile child | AC-014 |
| T8 | A value left by a stopped `set` or `forget` is printed and not caught | an orphan is not on the known-secret map | The next `set` or `forget` of the name removes it (`index-and-writes.md` section 3) | Between the stop and the repair, the orphan's value is not redacted | AC-021 |
| T9 | A value shorter than 8 characters passes every literal check | `MIN_SECRET_LENGTH` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:54] | none. `contracts/refusals.md` has no refusal for a short value | Accepted. A real key is longer than 8 characters | stated in `spec.md` edge cases |
| T10 | A child reads another name's value file or keychain item | same OS user | none by permission. The grant is enforced by not injecting a name. D6 | Accepted, D6 | AC-015 |
| T11 | A value reaches the prompt, the precheck, a resumed answer, a request prompt or a delivery | the runtime's own surfaces | Every stored value joins the known-secret map (`leak-checks.md` section 2). The value is resolved after the precheck has run, and only `dispatchEnv` carries it | none for values of 8 or more characters | AC-009, AC-007 |
| T12 | A second `SKILLED_BOT_SECRET_*` key reaches a child, or a caller names `PATH` or any other key by listing it | a widened dispatch-env gate | `dispatchEnvKeys` names exactly the one resolved key per dispatch, and the gate admits an entry of that list only when it equals `UTCP_CONFIG_FILE` or matches `^SKILLED_BOT_SECRET_[A-Z0-9_]+$`, so anything else throws [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1507-1516] | none | AC-007, T023, T053 |
| T13 | The 0600 value file is copied by a backup or sync tool | the state root | The file lives under the user-level state root, never the checkout. The keychain backend is the default on macOS | A file-backend value is as safe as the backup. Accepted | the risk table |
| T14 | A temp file written during a stopped `set` keeps a value on disk | the temp-and-rename write | The next `set` or `forget` removes every `secrets/.*.tmp` under the lock (`index-and-writes.md` section 2.3) | Between the stop and the repair | AC-021 |
| T15 | An index an operator edited by hand names a value that is not there, or is malformed | the index file | Every read validates the index and refuses `secret-store-unreadable`, never reads it as empty (`index-and-writes.md` section 1) | none | AC-017 |

---

## WHAT WOULD CHANGE THIS MODEL

A per-bot OS user, or a keychain item whose access list names one bot's executor, would close T10. Both are a later packet's, as `spec.md` records. A refusal for a short value would close T9, and needs a row in `contracts/refusals.md` first.
