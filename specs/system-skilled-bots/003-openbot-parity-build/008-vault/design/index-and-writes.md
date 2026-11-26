---
title: "Design: the secrets index, its write rule and the orphan rule"
description: "How the vault reads and validates the secrets index the contract fixes, the lock that serializes every set and forget, the write order of each verb, what is on disk when a process stops at any step, the orphan rule and the concurrent and interrupted cases the tests cover."
trigger_phrases:
  - "secrets index write rule"
  - "vault orphan rule"
  - "secrets index lock"
  - "interrupted secret set"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The secrets index, its write rule and the orphan rule

This note closes gaps 4 and 5 of the plan-depth research: the index shape and its write rule. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:157-158] The shape is the contract's and is not restated here: keys, types, null rules and the sample are `contracts/records.md` section 8, and the golden file is `contracts/fixtures/secrets-index.json`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "8. SECRETS INDEX"] This note adds how the index is read, written and kept true.

---

## 1. READING THE INDEX

`readSecretsIndex(secretsFolder)` in `secrets.ts` returns the index or a reason. It is the only reader.

| On disk | Result |
|---------|--------|
| No `index.json` | `{ schemaVersion: 1, entries: {} }`, the contract's "absent reads as" |
| A file that does not parse as JSON | unreadable, detail `index-invalid: not JSON` |
| `schemaVersion` not an integer | unreadable, detail `index-invalid: schemaVersion` |
| `schemaVersion` above 1 | unreadable, detail `index schemaVersion <n> is newer than this runtime reads`, per `contracts/versioning.md` rule 2 |
| `entries` not a plain object | unreadable, detail `index-invalid: entries` |
| An entry key outside the name grammar | unreadable, detail `index-invalid: name <key>` |
| An entry whose `backend` is not `keychain` or `file`, or whose `createdAt` or `updatedAt` is not a string `Date.parse` accepts | unreadable, detail `index-invalid: <name>.<key>` |
| An entry whose `setBy` is present and is neither a string nor `null` | unreadable, detail `index-invalid: <name>.setBy` |
| A read error other than `ENOENT` | unreadable, detail `index unreadable: <code>` |
| Any other key, at the top or in an entry | kept as read and written back unchanged, per `contracts/versioning.md` rule 1 |

"Unreadable" is `secret-store-unreadable`: a run refusal with class `environment` and exit 4, and on `set`, `list` and `forget` the verb line `bots: secret-store-unreadable: <detail>` with exit 4 (`backends.md` section 6). An unreadable index is never treated as an empty one, which is NFR-R01.

**Serialization.** `JSON.stringify(index, null, 2)` plus a newline, with `entries` rebuilt in name order so two writes of the same content give the same bytes. Timestamps are `new Date().toISOString()`.

---

## 2. THE WRITE RULE

### 2.1 One lock for every change

`set` and `forget` hold `secrets/index.lock` from before they read the index until after their last backend call. It has the same form as the item lock in `contracts/answer-seam.md` step 6: created exclusively (`flag: 'wx'`, mode 0600), holding the pid, a nonce and the instant, and reclaimed by rename when its owner is gone or it is older than 60 s. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 6]

One rule differs. The item lock waits 2,000 ms for a live owner and then refuses `item-busy`. The index lock has no refusal of its own in `contracts/refusals.md` section 3.7, so it waits, polling every 25 ms, until the owner is gone or the lock is 60 s old. A holder makes at most three backend calls (write, read-back and the old backend's delete), each capped at 10 s by `backends.md` section 2.4, so a holder that is alive finishes inside the 60 s and is never reclaimed from under itself. The lock is removed in a `finally` on every exit after it is taken.

Reads do not take the lock. `resolveSecret`, `knownSecretValues` and `listSecrets` read `index.json` once, and the rename below means they see either the old file or the new one, never a partial one.

### 2.2 The index write

The new index is written to `secrets/.index.json.<pid>.<6 random bytes hex>.tmp` with `flag: 'wx'` and `mode: 0o600`, then renamed over `secrets/index.json`. A failed rename removes the temp file and rethrows. This is the queue's write-through-temp pattern. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:89-97]

### 2.3 The order of each verb

**`set <name>`**, after the value is read and checked (`leak-checks.md` section 1):

1. Take the lock. Narrow the folder to 0700 and the index to 0600.
2. Read the index.
3. Write the value to the chosen backend (`backends.md` section 1).
4. Read it back and compare in constant time. A missing or different value refuses `secret-write-dropped` with exit 4, and the index is not written.
5. Write the index with the entry `{ backend, createdAt, updatedAt, setBy }`, `createdAt` kept from an existing entry and `setBy` the actor `resolveActor` returned, the OS user or the pinned operator.
6. When the existing entry named the other backend, delete the value there (`backends.md` section 5).
7. Remove every `secrets/.*.tmp` file. The lock is held, so any such file is left by a writer that stopped.
8. Release the lock.

**`forget <name>`**:

1. Take the lock and read the index.
2. When the index holds the name, write the index without it.
3. Delete the value from the backend the entry recorded.
4. Delete the value from the other backend when the host has it, absent counting as done.
5. Remove every `secrets/.*.tmp` file and release the lock.

The index write is the commit point of both verbs. On `set` it comes after the value is proved stored, so the index never names a value that is not there. On `forget` it comes before the delete, so a stop never leaves a name the index still offers to a run after the operator asked for it gone.

---

## 3. THE ORPHAN RULE

An **orphan** is a value with no index entry naming its backend: a `secrets/<name>.value` file whose index entry is absent or says `keychain`, or a keychain item whose entry is absent or says `file`.

- `list` shows only index entries, so an orphan is never listed.
- `resolveSecret` reads the index first, so an orphan is never resolved. Its name resolves `secret-unknown` when the index has no entry.
- `knownSecretValues` reads only index entries, so an orphan is not on the known-secret map. The post-run scan therefore cannot redact an orphan's value. `threat-model.md` row T8 records this.
- The next `set` of that name overwrites it, or removes it when the backends differ. The next `forget` of that name removes it from both backends whether or not the index holds the name.
- A temp file is removed by the next `set` or `forget` of any name.

---

## 4. A STOP AT EACH STEP

What is on disk when the process is killed right after a step, and what the next command sees.

| Verb | Stopped after | On disk | Next `list` | Next run of a bot naming it | Repaired by |
|------|---------------|---------|-------------|----------------------------|-------------|
| `set`, new name | 1, lock | a lock file | blocks until the lock is reclaimable, then lists | not affected, a run does not take the lock | the next `set` or `forget` reclaims it |
| `set`, new name | 3, value written | the value and a lock | omits the name | `secret-unknown` | the next `set` overwrites, the next `forget` removes |
| `set`, new name | 4, read back | the same | the same | the same | the same |
| `set`, new name | 5, index written | value, index entry and a lock | lists it | resolves | done, the lock is reclaimed later |
| `set`, other backend | 5 | new value, index naming the new backend, old value | lists the new backend | resolves the new value | the old value is an orphan until `forget` |
| `set`, any | during the temp write of 3 or 5 | a `.tmp` file, which may hold the value | unchanged | unchanged | the next `set` or `forget` of any name |
| `forget` | 2, index written | the value with no entry, and a lock | omits the name | `secret-unknown` | the next `forget` of the name |
| `forget` | 3, recorded backend deleted | maybe the other backend's orphan | omits the name | `secret-unknown` | the next `forget` |

---

## 5. CONCURRENT CALLS

| Case | Outcome the tests assert |
|------|--------------------------|
| Two `set` of different names at once | Both exit 0 and the index holds both entries. Without the lock the second rename would drop the first entry |
| Two `set` of the same name with different values | Both exit 0. The index entry and the stored value are those of whichever took the lock second, and neither reports `secret-write-dropped`, because each read-back runs inside its own lock |
| `set` and `forget` of the same name | The final state is either "held, the `set` value" or "not held", matching the order the two took the lock, never an entry with no value |
| `set` while a run resolves the name | The run sees the old entry and old value, or the new entry and new value. A run that read the old entry before a backend change and then reads the old backend after its delete gets absent and refuses `secret-unknown`, which a retry clears |
| `forget` while a run resolves the name | The run resolves the value, or refuses `secret-unknown` |

`tests/secrets.vitest.ts` drives the first three cases with two child processes started on one barrier file, each calling `setSecret` or `forgetSecret` from `secrets.ts` against the same temp state root with the file backend and with the fake `security`.

---

## 6. VERIFY

| Claim | Command | Prints |
|-------|---------|--------|
| The contract fixes the index keys | `rg -c 'entries\.<name>\.' specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` | `3` |
| The golden file exists | `jq -r '.entries.demo.backend' specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/secrets-index.json` | `file` |
| The temp and rename pattern this note reuses | `rg -n 'function writeThroughTmp' .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | one line, 89 |
| The lock form this note reuses | `rg -c 'needs-you/<item-id>.lock' specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md` | `1` |
