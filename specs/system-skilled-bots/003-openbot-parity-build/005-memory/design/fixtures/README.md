---
title: "Fixtures: memory files, payloads and prompt blocks"
description: "One golden file per shape this phase writes, with the byte count each one carries, the test that reads it and the contract section it proves."
trigger_phrases:
  - "memory fixtures"
  - "memory golden files"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Memory fixtures

Each file is a literal sample on the packet's one data set: clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, operator `ada`, bot `hello`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:34] The byte counts in the payloads are the real sizes of the files beside them, so a test can compare both.

| File | What it is | Bytes | Read by | Proves |
|------|------------|-------|---------|--------|
| `shared.md` | The shared memory file with two entries, the first holding a pipe in its text | 169 | `parseMemory`, `readMemoryFile` | The five-field line and the split on the first four delimiters |
| `hello.md` | A per-bot memory file with one entry | 68 | `parseMemory`, `readMemoryFile` | The per-bot path and the same grammar |
| `shared-torn.md` | The shared file with a line that has no dash prefix and a torn last line that splits into four fields | 239 | `parseMemory` | Two skipped lines, two parsed entries and a file with no trailing newline |
| `remember-list.json` | The `--list --json` payload for `shared.md` | - | The type check of `bots remember --list --json` | `cli-json.md` section 3.2 |
| `remember-list-bot.json` | The same payload for `hello.md` with `--bot hello` | - | The type check of the per-bot form | `botId` and the per-bot path |
| `remember-list-torn.json` | The same payload for `shared-torn.md` | - | The type check of `skippedLines` | A non-zero `skippedLines` with the file's real `byteCount` |
| `proposal-item.json` | A `memory-proposal` needs-you item, open and unanswered | - | `validateNeedsYouItem` after this phase | The four keys, the sentinel and the two options |
| `prompt-with-memory.txt` | The whole prompt for a bot whose two files hold one entry each | - | `buildBotPrompt` | The two blocks at the memory position |
| `prompt-without-memory.txt` | The whole prompt for the same bot with no memory file | - | `buildBotPrompt` | Today's prompt, byte for byte |

## How a test reads them

A **file** fixture is fed to the parser or the reader as the file's text. A **payload** fixture is compared key by key and type by type against the verb's real `--json` output. A **prompt** fixture is compared as one string.

The two prompt fixtures differ by exactly the two memory blocks, so a test can assert that removing them from `prompt-with-memory.txt` yields `prompt-without-memory.txt`. That is the absent-block rule in one comparison. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:228]

## The remember line samples

The `[REMEMBER]` grammar has no file of its own because each case is one line. These are the cases `runner.vitest.ts` feeds to the parser.

| Line | Outcome |
|------|---------|
| `[REMEMBER] user Prefers ISO dates.` | An item with `proposalType` `user` and `proposalFact` `Prefers ISO dates.` |
| `[REMEMBER] Prefers ISO dates.` | No item, `remember-type-invalid` |
| `[REMEMBER] maybe Prefers ISO dates.` | No item, `remember-type-invalid` |
| `[REMEMBER] user ` | No item, `remember-type-invalid` |
| `[REMEMBER] user Prefers ISO dates.` twice | One item, from the first line |
| `[NEEDS-DECISION] Ship it?` then `[REMEMBER] user Prefers ISO dates.` | The run parks, no item is written |

## Check every file parses

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/005-memory/design/fixtures
for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done
wc -c shared.md hello.md shared-torn.md
```

The three byte counts must print 169, 68 and 239, which are the `byteCount` values the three payloads carry.
