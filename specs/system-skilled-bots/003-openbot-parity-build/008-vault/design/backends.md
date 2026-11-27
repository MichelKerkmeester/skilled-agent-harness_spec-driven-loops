---
title: "Design: the three backends and their exact commands"
description: "How the vault picks a backend, the exact macOS security and Linux secret-tool write, read and delete commands with the value kept out of argv, the line bound that keeps security -i from splitting a value, the 0600 file backend, the timeout for a locked keychain, the backend transition rules and the measured probes behind each choice."
trigger_phrases:
  - "vault keychain commands"
  - "security add-generic-password stdin"
  - "secret-tool store lookup clear"
  - "keychain line bound"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The three backends and their exact commands

This note closes gap 3 of the plan-depth research: the read, write and delete command for each backend and the rule for a backend that changes. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:156] The index records one of two backend values, `keychain` or `file` (`contracts/records.md` section 8). `keychain` means the host's OS keychain: the macOS keychain through `security`, or the Linux Secret Service through `secret-tool`. The index never names the program, because one host has only one.

Every claim marked **measured** was observed on this host on 2026-11-25 against a throwaway keychain created with `security create-keychain` in a scratch folder, with dummy values and no real secret. Every claim marked **inferred** rests on a manual page and was not run here.

---

## 1. WHICH BACKEND `set` USES

| Condition, checked in this order | Backend | Program |
|----------------------------------|---------|---------|
| `--store file` | `file` | none |
| `--store keychain` and the host has a keychain program (rows 3 and 4) | `keychain` | that program |
| `--store keychain` and the host has none | refused in `bots.cjs`: `bots: --store keychain: no keychain program on this host`, exit 2 | none |
| no `--store`, `process.platform === 'darwin'` and `security` resolves on `PATH` | `keychain` | `security` |
| no `--store`, `process.platform === 'linux'`, `secret-tool` resolves on `PATH` and `DBUS_SESSION_BUS_ADDRESS` is non-empty | `keychain` | `secret-tool` |
| otherwise | `file` | none |

"Resolves on `PATH`" means a file with the execute bit in one of the `PATH` folders of the environment `bots.cjs` runs under. No other verb chooses: `resolve`, `list` and `forget` read the backend from the index entry (section 5).

---

## 2. MACOS: `security`

### 2.1 The value form

The keychain item's password is **the lowercase hex of the value's UTF-8 bytes**, never the raw value. The vault writes that hex text and decodes it on read.

Why: `security find-generic-password -w` prints a printable ASCII password as it is, and prints any other password as lowercase hex. **Measured**: the value `tab<TAB>and é` read back as `74616209616e6420c3a9`, while `0x4142probe` read back as `0x4142probe`. A raw value that happens to be even-length hex text could not be told apart from a hex-printed one. Storing hex text makes every read printable ASCII, so `-w` prints it unchanged and the decode is the only rule. **Measured**: a value holding a tab, `é`, a double quote and a backslash, written in hex form, read back as hex and decoded equal to the original.

### 2.2 The three commands

`<account>` is `<name>@<scope>` from `names-and-keys.md` section 3. `<hex>` is the value's hex form. Every spawn uses `child_process.spawn` with an argv array and no shell, captures stdout and stderr into memory and prints neither.

| Operation | argv | stdin | Outcome |
|-----------|------|-------|---------|
| write | `security -q -i` | exactly one line, `add-generic-password -a <account> -s skilled-bots -U -w <hex>` and a newline, then end of input | exit 0 stored. Any other exit, or the timeout, is a dropped write |
| read | `security find-generic-password -a <account> -s skilled-bots -w` | closed | exit 0 with stdout `<hex>` and a newline. Exit 44 is absent. **Measured**: a missing item exits 44 with `The specified item could not be found in the keychain.` on stderr |
| delete | `security delete-generic-password -a <account> -s skilled-bots` | closed | exit 0 deleted, exit 44 absent. **Measured**: a second delete of the same item exits 44 |

The value travels only in the write's stdin. The argv of every `security` call holds the account and the service, which are names. The read's stdout holds the hex form inside the pipe to the runtime. **Measured**: `security -i` with one well-formed line exits with that command's own status, 0 on success and 44 on a missing item, and prints nothing on stdout under `-q`.

`-U` makes the write replace an item that exists. **Measured**: a second write with `-U` replaced the value and the next read returned the new one.

**Decoding a read.** Strip one trailing `\n`. The rest must match `^([0-9a-f]{2})+$`. A match is decoded with `Buffer.from(hex, 'hex').toString('utf8')`. A read that does not match is an item the vault did not write, and resolves as `secret-store-unreadable` with the detail `keychain item for <name> is not in the vault's form`, never as the value.

### 2.3 The line bound

`security -i` reads its commands in lines of at most 4,096 bytes including the newline. **Measured**: a line of exactly 4,096 bytes stored its full value, and a value one byte longer did not. A longer line is not refused. It is split, and each piece runs as its own command. **Measured** twice: the first piece ran as an `add-generic-password` without its keychain argument and wrote a truncated item into the default login keychain, and the later pieces were printed to stderr as `security: unknown command "<piece of the value>"`. So an over-long line both writes a wrong value to the wrong keychain and echoes part of the value.

The rule, checked in `secrets.ts` before the spawn:

- Build the exact line, including any test-only keychain argument from section 7.
- When its UTF-8 length without the newline is over 4,095 bytes, spawn nothing and refuse `secret-too-long` with exit 2 and the detail `the keychain holds at most 1984 bytes for one value, use --store file`.

The production line is `add-generic-password -a ` (24 bytes), the account (at most 77 bytes), ` -s skilled-bots -U -w ` (23 bytes) and the hex form. So any value of at most 1,984 UTF-8 bytes fits under the longest name: 24 + 77 + 23 + 3,968 is 4,092. The tests assert the computed check, not the number, because a test keychain argument shortens the room. The file backend and the Linux keychain keep the 16,384 character bound (`leak-checks.md` section 1 and the spec's edge cases).

### 2.4 A locked keychain

A locked keychain makes `security` wait for an unlock dialog with no limit. **Measured**: the scratch keychain locked itself after its 300 second idle timeout, and the next `add-generic-password` blocked until it was killed at 120 seconds. `security show-keychain-info` on the same keychain blocked too, until an `alarm` of 5 seconds killed it with exit 142.

The rule: every `security` and `secret-tool` spawn has a timeout of 10,000 ms, after which the runtime sends `SIGKILL`. A timed-out read is `secret-store-unreadable` with the detail `keychain did not answer within 10 s, unlock it and try again`. A timed-out write is `secret-write-dropped` with the same detail. **Measured**: 20 reads in a row of an unlocked keychain took 0.315 s, so the timeout is 600 times a normal read.

### 2.5 The forms this phase does not use

| Form | Why not | Evidence |
|------|---------|----------|
| `add-generic-password ... -w <value>` in argv | The value is in the process table for as long as `security` runs | the manual page itself: "Use of the -p or -w options is insecure" |
| The prompting form, `-w` as the last option | `security` then reads through `getpass`. **Measured** with `security create-keychain`, which prompts through the same import: with no terminal it read stdin, asked twice (`password for new keychain:` and `retype password for new keychain:`), and kept only the first 128 characters of a 200-character password. With a terminal it reads `/dev/tty`, which would compete with the CLI's own prompt. It also cannot name a test keychain, because any argument after `-w` is taken as the password | `security help add-generic-password` says "Specify -w as the last option to be prompted", and `nm -u /usr/bin/security` lists `_getpass` |
| `-w "<raw value>"` quoted on the `-i` line | Works for quoting, but a raw value reads back in hex when it is not printable ASCII, so the read is ambiguous (section 2.1) | measured |
| `-X <hex>` | Stores the raw bytes, so the read has the same ambiguity | measured: `-g` printed `password: 0x...` for one value and `password: "..."` for another |

The prompting form is still the operator's own way to put a value in the keychain by hand. The vault does not read such an item: it is not in hex form, so it resolves `secret-store-unreadable` (section 2.2).

---

## 3. LINUX: `secret-tool`

Every row here is **inferred** from `secret-tool(1)` in libsecret. This host has no `secret-tool`, and `command -v secret-tool` exits 1 here. The builder's tests drive these commands through a fake `secret-tool` on `PATH` (section 7).

| Operation | argv | stdin | Outcome |
|-----------|------|-------|---------|
| write | `secret-tool store --label "skilled-bots <account>" service skilled-bots account <account>`, the label one argv element | the hex form with no newline, then end of input | exit 0 stored. `secret-tool` reads the secret from stdin when stdin is not a terminal |
| read | `secret-tool lookup service skilled-bots account <account>` | closed | exit 0 with the hex form on stdout. Exit 1 with empty stderr is absent. Exit 1 with stderr is an error |
| delete | `secret-tool clear service skilled-bots account <account>` | closed | exit 0. `clear` does not say whether an item matched, so `forget` runs the read after it and treats absent as deleted |

The label is one argv element after `--label`. Split in two, the account would be read as the first attribute name and every attribute pair would shift, and the fake `secret-tool` would not notice, so a unit test asserts the argv array of the write exactly. The hex form is used here too, so one decode rule serves both programs. No line bound applies, because the value is the whole of stdin.

---

## 4. THE FILE BACKEND

| Operation | Steps | Outcome |
|-----------|-------|---------|
| write | Write the value's UTF-8 bytes, with no newline, to `secrets/.<name>.value.<pid>.<6 random bytes hex>.tmp` with `flag: 'wx'` and `mode: 0o600`, then `renameSync` it to `secrets/<name>.value`. On a failed rename, remove the temp file and rethrow. This is the queue's write-through-temp pattern [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:89-97] | stored. A throw is a dropped write |
| read | `readFileSync(path, 'utf8')` | the value. `ENOENT` is absent. Any other error code is unreadable |
| delete | `rmSync(path)` | deleted. `ENOENT` is absent |

The file holds the raw value, because a file has no line bound and no printing rule. It is 0600 inside the 0700 `secrets/` folder (`contracts/runtime-architecture.md` section 2.1). `set` and `forget` reset the folder to 0700 and the index to 0600 with `chmodSync` before they write, so a folder an operator widened is narrowed again on the next write. A run never changes a mode and never refuses for one.

---

## 5. TRANSITIONS

| Case | Rule |
|------|------|
| `set` of a new name | Write to the chosen backend, read back, write the index. Order and lock in `index-and-writes.md` section 2 |
| `set` of a name already held in the same backend | The same steps. The write replaces the value. `createdAt` is kept and `updatedAt` moves |
| `set` of a name already held in the other backend | Write and read back in the new backend, write the index naming the new backend, then delete the value from the old backend. A failed old delete prints `bots: secret set: <name> stored in <new>, the old <old> value was not removed, run bots secret forget <name> and set it again` on stderr and still exits 0, because the new value is stored and the index names it. The old value is then an orphan (`index-and-writes.md` section 3) |
| `forget` | Uses the backend the index records. `forget` takes no `--store`: `bots secret forget demo --store file` is refused `bots: secret forget takes no --store` with exit 2, which is why no refusal for a backend mismatch exists. After the index write and the recorded backend's delete, `forget` also deletes the name from the other backend when the host has it, so an orphan left by an earlier stop is removed. A name the index does not hold still runs both deletes, so an orphan with no index entry is removed too |
| `resolve` or `knownSecretValues` on a host without the recorded program | `secret-store-unreadable` with the detail `<name> is in the keychain and this host has no keychain program` |
| A moved state root | The scope in the account changes, so every keychain entry reads as absent and resolves `secret-unknown`. File entries move with the folder and still read |

---

## 6. OUTCOME MAP

What each backend result becomes. Every reason is a row of `contracts/refusals.md` section 3.7.

| Operation | Absent | Error or timeout | Read-back differs |
|-----------|--------|------------------|-------------------|
| `set` write | not applicable | `secret-write-dropped`, exit 4 | `secret-write-dropped`, exit 4, compared with Node's `crypto.timingSafeEqual` over the two values' UTF-8 buffers, after a byte-length check that treats a different length as a mismatch |
| `resolve` at run time | `secret-unknown`, exit 4, class `operator`, detail `<name> is not stored, run bots secret set <name>` | `secret-store-unreadable`, exit 4, class `environment` | not applicable |
| `knownSecretValues` | the entry adds no value | `secret-store-unreadable` for a run, and for the answer and delivery checks the error detail named in `leak-checks.md` section 3 | not applicable |
| `forget` delete | not held, exit 0 | the index entry is already gone, so the CLI prints `bots: secret forget: <name> left the index, its <backend> value was not removed (<reason>), run forget again` and exits 1 | not applicable |

**The detail phrases.** Each cause prints one fixed phrase. A phrase may carry a name, a path, an exit code or an errno code such as `EACCES`, and nothing else. It never carries captured stdout or stderr, because the keychain program can echo pieces of a value (section 2.3).

| Cause | Detail |
|-------|--------|
| A keychain read or write that did not answer within 10 s | `keychain did not answer within 10 s, unlock it and try again` |
| A keychain read that exited with a code other than 0 and the absent code | `keychain read for <name> exited <code>` |
| A keychain item not in the vault's hex form | `keychain item for <name> is not in the vault's form` |
| A keychain entry on a host with no keychain program | `<name> is in the keychain and this host has no keychain program` |
| A keychain write that exited non-zero | `keychain write for <name> exited <code>` |
| A read-back that differs from the value written | `read-back of <name> did not match` |
| A value file read error other than `ENOENT` | `secret file for <name> unreadable: <code>` |
| A value file write that threw | `secret file for <name> not written: <code>` |
| An index the reader refuses | the `index-invalid` and `index unreadable` phrases of `index-and-writes.md` section 1 |
| A `forget` delete that failed, the `<reason>` in its line | `<backend> delete exited <code>`, or the errno code for the file backend |

**One timeout per read of the map.** `knownSecretValues` reads the entries in name order and stops at the first keychain entry that fails or times out, returning `secret-store-unreadable` for the whole map. A locked keychain therefore costs one 10 s timeout per run, not one per entry. The map is read for every bot, a bot whose `BOT.md` names no secret included, so a vault that cannot be read refuses every run of every bot in that identity. That is the fail-closed rule of `leak-checks.md` section 2, stated here so its cost is plain.

An index that cannot be read on `set`, `list` or `forget` prints `bots: secret-store-unreadable: <detail>` with exit 4, the exit the layer rule gives a refusal that comes back from a runtime call (`contracts/refusals.md` section 2). `refusals.md` section 3.7 names `secret-store-unreadable` as a run refusal and as a verb refusal on `secret set`, `secret list`, `secret forget` and `answer`, so this verb use is the contract's own.

---

## 7. TEST SEAMS

No test may write to the operator's login keychain. Two seams make that hold.

1. **A fake program on `PATH`.** `tests/secrets.vitest.ts` writes a small `security` and a small `secret-tool` script into a temp `bin/` and prepends it to `PATH`. Each script appends its argv and its stdin, as JSON, to a log file, keeps items in a temp folder keyed by account, and answers the three commands with the exits in sections 2.2 and 3. The argv-leak check reads that log: no argv element may contain the planted value or its hex form. A "dropped" mode stores nothing and exits 0, which is AC-011's backend.
2. **A real scratch keychain, macOS only.** One test, skipped unless `process.platform === 'darwin'`, creates a keychain in a temp folder with `security create-keychain -p <dummy> <path>`, unlocks it before each call, passes its path through the `keychainPath` option that the three keychain functions in `secrets.ts` accept, and deletes it in `afterAll`. The path is appended as the last argument, quoted with `\` and `"` escaped on the `-i` line, and counted in the line bound. `bots.cjs` never sets the option, so production always uses the default keychain.

A test that reaches `security` with neither seam is a bug. `tests/secrets.vitest.ts` asserts, in `beforeAll`, that `PATH`'s first `security` is the fake unless the scratch keychain test is the one running.

---

## 8. VERIFY

Each command runs here with no tty, uses dummy values in a throwaway keychain, bounds every `security` call with `perl -e 'alarm N; exec @ARGV'` and removes what it made. None reads the login keychain's passwords.

**The round trip of the hex form.** Paste as one block.

```sh
D=$(mktemp -d) && K="$D/probe.keychain-db" && T() { perl -e 'alarm 10; exec @ARGV' "$@"; }
T security create-keychain -p probe "$K" && echo "create=$?"
V="$(printf 'tab\there é "q" back\\slash')"; H=$(printf '%s' "$V" | xxd -p | tr -d '\n')
printf 'add-generic-password -a probe@000000000000 -s skilled-bots -U -w %s "%s"\n' "$H" "$K" | T security -q -i; echo "add=$?"
OUT=$(T security find-generic-password -a probe@000000000000 -s skilled-bots -w "$K")
printf '%s' "$OUT" | grep -Eq '^([0-9a-f]{2})+$' && echo "shape=hex"
[ "$(printf '%s' "$OUT" | xxd -r -p)" = "$V" ] && echo "roundtrip=equal"
T security delete-generic-password -a probe@000000000000 -s skilled-bots "$K" >/dev/null 2>&1; echo "delete=$?"
T security delete-generic-password -a probe@000000000000 -s skilled-bots "$K" >/dev/null 2>&1; echo "delete-again=$?"
T security delete-keychain "$K"; echo "removed=$?"; rm -rf "$D"
```

Prints `create=0`, `add=0`, `shape=hex`, `roundtrip=equal`, `delete=0`, `delete-again=44` and `removed=0`.

**The 4,096 byte line.** Not run as a verify command. An over-long line writes into the default login keychain (section 2.3), which is exactly what a verify command must never do. The bound is proved by the unit test on the computed line instead.

| Claim | Command | Prints |
|-------|---------|--------|
| `security` prompts through `getpass` | `nm -u /usr/bin/security \| grep -c _getpass` | `3` |
| The two prompts the prompting form asks | `strings /usr/bin/security \| grep -c 'for new item: '` | `2` |
| No Linux keychain on this host | `command -v secret-tool; echo "exit=$?"` | `exit=1` |
| No timeout today, so section 2.4 is new | `rg -c 'security' .skilled/skills/system-skilled-bots/runtime/lib` | exits 1, until `secrets.ts` lands |
