---
title: "Design: the memory module contract and write protocol"
description: "The memory.ts exports with their inputs, returns and refusals, the append and forget write protocol with its concurrency rules, the parser and renderer rules, the secret check hook, the buildBotPrompt input change and the remember verb grammar."
trigger_phrases:
  - "memory module contract"
  - "memory write protocol"
  - "append forget race"
  - "buildBotPrompt input"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The memory module contract and write protocol

One module owns the entry line, so no caller can write an entry the reader cannot read. This note fixes its exports, its two writes and the one prompt input it feeds. A builder implements this note and makes no choice of its own.

The module's place in the runtime is fixed by the packet: `memory.ts` sits in the contracts and state group and imports `state-root` and nothing else from `lib/`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md:48] `dispatch.ts` does not import it, because the runner reads and renders and the builder joins and bounds. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md:319]

---

## 1. THE EXPORTS

| Export | Input | Returns | Refusals |
|--------|-------|---------|----------|
| `MEMORY_LIMITS` | none | `{ entries: 60, bytes: 3600, text: 400 }`, frozen | none |
| `MEMORY_TYPES` | none | `['user', 'general', 'feedback', 'reference']`, frozen | none |
| `sharedMemoryFile` | the state root | The absolute path of `<stateRoot>/memory/shared.md` | none |
| `botMemoryFile` | the state root, the identity, the bot id | The absolute path of `<stateRoot>/<identityKey>/memory/<botId>.md` | `bot-id-invalid` for an id that is not a safe segment |
| `collapseText` | one string | The string with every whitespace run replaced by one space and both ends trimmed | none |
| `serializeEntry` | one entry object | One line in the contract's five-field form, ending in one newline | none |
| `parseMemory` | the file's text | `{ entries, skippedLines }`, entries in file order with 1-based indexes | none |
| `readMemoryFile` | the absolute path | `{ entries, skippedLines, byteCount }`, all empty and zero for an absent file | none |
| `renderMemoryBlock` | the absolute path, the entries | The block text, or `null` when the entries are empty | none |
| `appendMemoryEntry` | the absolute path, one entry object | `{ index, entryCount, byteCount }` | `memory-full`, `memory-entry-too-long` |
| `forgetMemoryEntry` | the absolute path, a 1-based index | `{ entryCount, byteCount }` | `memory-entry-unknown` |

Every function returns the runtime's `Result<T>`, so a refusal is a value and never a throw. The module prints nothing and holds no `console` call.

**Why `appendMemoryEntry` does not refuse `memory-secret`.** The known-secret map lives in `dispatch.ts` and `secrets.ts`, and a contracts module may import only its own group. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:39] So the caller checks the fact before it calls the append, and the three callers are `bots.cjs` for the verb, `answer.ts` for the settle and `runner.ts` for the proposal.

**Why `memory-entry-too-long` is unreachable from the two non-CLI callers.** `bots.cjs` checks the argument's length before any file is read, which is why the refusal exits 2. The item's validator caps `proposalFact` at 400 characters, so the settle path cannot reach the check. The append keeps it as a backstop and a test asserts the CLI path.

---

## 2. THE APPEND

One append is one `appendFileSync` of one whole line, opened with the append flag, after one read that decides the bound.

| Step | Action | On failure |
|------|--------|------------|
| 1 | Resolve the path. For a per-bot file, check the bot id is a safe segment | `bot-id-invalid` |
| 2 | Read the file. An absent file reads as empty and is not created | none |
| 3 | Parse it, so the entry count and the skipped count are known | none |
| 4 | Refuse when the parsed entry count is already 60 or more | `memory-full` |
| 5 | Serialize the new line and measure the file's size plus the line's byte length | none |
| 6 | Refuse when that sum is greater than 3,600 | `memory-full` |
| 7 | Create the folder with mode 0700 when it is absent, then append the line with mode 0600 | A throw, which the caller reports as exit 1 |
| 8 | Return the new entry's index, the new entry count and the new byte count | none |

The refusal's detail is `<path> (<n> entries, <b> bytes)`, where `n` and `b` are the counts the check saw. A refused append writes nothing, so the file is byte for byte unchanged.

**Why one write and not a rewrite.** A rewrite would need a read, a temp file and a rename, and two concurrent rewrites would lose one of the two facts. One append of one line is atomic against a concurrent append on a POSIX file opened with the append flag, because the kernel places the whole write at the end of the file in one operation. A line is at most about 500 bytes, far below the 4,096-byte pipe buffer that bounds the guarantee.

---

## 3. THE FORGET

A forget is a read, a removal, a temp file and a rename, with one copy-forward step that preserves an append that landed during the forget.

| Step | Action | On failure |
|------|--------|------------|
| 1 | Resolve the path and read the file, recording its byte length `L` | none |
| 2 | Parse it. Refuse when the index is below 1 or above the parsed entry count | `memory-entry-unknown` |
| 3 | Build the new content from every entry except the one at the index, in file order | none |
| 4 | Write the new content to `<path>.tmp` with mode 0600 | A throw, exit 1 |
| 5 | Stat the original. When its size is greater than `L`, read the bytes from offset `L` to the end, append them to the temp file and set `L` to the new size. Repeat at most three times | none |
| 6 | Rename the temp file over the original | A throw, exit 1 |
| 7 | Return the new entry count and the new byte count | none |

Step 5 is what makes an append during a forget survive. The appended bytes are copied forward into the temp file before the rename, so the rename replaces the file with a copy that holds both the removal and the append.

**The residual window.** An append that lands between the final stat of step 5 and the rename of step 6 is lost, because the rename replaces the file with a copy that predates it. The window is one syscall wide and the verb is an operator action, so the phase accepts it and states it rather than adding a lock that the append would also have to take. A lock on the append would make it two writes and lose the atomicity section 2 relies on.

**Why the temp file is not `writeStateAtomic`.** That helper writes through a temp file and a rename and passes no mode to its write, so the file would carry the process umask. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:628] The memory file must be 0600, so the forget writes its own temp file with that mode and renames it.

---

## 4. THE CONCURRENCY RULES

| Case | What happens | Bound | Test |
|------|--------------|-------|------|
| Two appends at once | Both read the same count, both pass the bound, both append. The file ends with both lines in some order | The file can exceed 60 entries or 3,600 bytes by one line per racing writer | `memory.vitest.ts`, `two appends` |
| An append during a forget | The forget copies the appended bytes forward before its rename, so the append survives | None beyond the residual window in section 3 | `memory.vitest.ts`, `append during forget` |
| Two forgets at once | Both read the same file, both write a temp file, the second rename wins and the first removal is lost | One removal per racing forget | Not tested. The verb is an operator action and two operators forgetting at the same instant is out of the phase's scope |
| A read during an append | The read sees the file with or without the new line, never a half line, because the append is one write | None | `memory.vitest.ts`, `torn line` |

The entry-count overshoot is bounded and harmless because the byte bound is the one that bounds the prompt. A file at 60 entries and 400 characters each would be 24,000 bytes, so the 3,600-byte bound refuses long before the entry bound does. The entry bound is a readability bound and the byte bound is the prompt bound.

---

## 5. THE PARSER

| Rule | Behaviour |
|------|-----------|
| Line prefix | A line that does not start with `- ` is skipped |
| Field count | A line that splits into fewer than five fields on ` \| ` is skipped |
| Type | A type outside the four is skipped |
| Date | A date that is not `YYYY-MM-DD` is skipped |
| Actor | An empty actor is skipped |
| Source | An empty source is skipped |
| Text | An empty text is skipped |
| Trailing newline | A final newline is not a line, so a file ending in one has no empty last entry |
| Torn last line | A last line with no trailing newline is parsed like any other. When it does not split into five fields it is skipped and counted, which is the torn-line case |
| Count | Every skipped line increments `skippedLines`, and the count is reported by `--list` and by the payload |

A skipped line is never printed and never repaired. The file is the operator's, and a verb that rewrote a line it did not understand would be a verb that guessed.

---

## 6. THE RENDERER

`renderMemoryBlock` returns `null` for an empty entry list, which is the absent-block rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:228] Otherwise it returns the block the contract fixes, with one entry line per entry in file order. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:71]

| Part | Text |
|------|------|
| Opening tag | `<memory file="<absolute path>">` |
| Label | The two sentences the contract fixes, on the line after the opening tag |
| Entries | One serialized line per entry, escaped by the contract's rule |
| Closing tag | `</memory>` |

The escape is applied at render time and never to the stored file, so `--list` prints the text verbatim. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:166] The block is one element of the builder's line list, so it adds no blank line around itself.

---

## 7. THE SECRET CHECK HOOK

The runner already checks a list of labelled texts before dispatch. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:942] This phase adds one entry per rendered memory block, labelled `memory <absolute path>`.

| Check | Where | Refusal | Detail |
|-------|-------|---------|--------|
| The rendered block | `runner.ts`, in the existing text list | `body-secret`, class `author`, exit 4 | `memory <path> holds a literal of <kind> <name>` |
| A `[REMEMBER]` fact | `runner.ts`, before the item is written | `memory-proposal-secret`, a post-run cause, the run's own exit | The key name, never the value |
| A fact `bots remember` would append | `bots.cjs`, before the append | `memory-secret`, exit 4 | The key name, never the value |
| A fact `bots answer confirm` would append | `answer.ts`, in the review settle | `memory-secret`, exit 4 | The key name, never the value |

The block check runs on the rendered block, so it covers the label and the tags as well as the entries. A match in the label is impossible, and a match in an entry is the case the check exists for.

---

## 8. THE `buildBotPrompt` INPUT

The builder gains the rendered blocks and the request prompt as inputs and does the header join itself, so the budget check sees the conversation. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:243]

| Input | Type | Required | Meaning |
|-------|------|----------|---------|
| `body` | string | yes | The BOT.md body |
| `specFolder` | string or null | yes | The bound spec folder |
| `checkoutRoot` | string or null | no | The checkout line, for a child that starts outside the tree |
| `workingPlace` | string or null | no | 004's line |
| `memoryBlocks` | string array | no | The rendered `<memory>` blocks, the shared file's first |
| `skillBlocks` | string array | no | The rendered `<skill_content>` blocks, in the order the `skills` list names them |
| `requestPrompt` | string or null | no | The request prompt, which the builder wraps in the header |

The return type becomes `Result<string>`. The success value is the joined prompt. The refusal is `prompt-over-budget` with the detail `<block> at <n> of 32000 characters`, where the block is the first one whose running total exceeds the bound. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:214]

The join order is the contract's nine blocks. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md:71] The builder adds no line of its own, so a bot with no memory, no skills and no request prompt gets the string it gets today, byte for byte.

---

## 9. THE `remember` VERB GRAMMAR

| Form | Positional | Options | Exit |
|------|------------|---------|------|
| `bots remember <text>` | one, the fact | `--bot`, `--type`, `--as` | 0, or a refusal |
| `bots remember --list` | none | `--bot`, `--json` | 0, or a refusal |
| `bots remember --forget <n>` | none | `--bot` | 0, or a refusal |

| Option | Takes a value | Rule |
|--------|---------------|------|
| `--bot <id>` | yes | A safe segment. Refused `bot-id-invalid`, exit 2 |
| `--type <type>` | yes | One of the four. Refused `bots: --type takes user, general, feedback or reference`, exit 2 |
| `--as <name>` | yes | A non-empty actor name. Refused `bots: --as takes a name`, exit 2. No tty rule, because 001's tty refusal covers `bots answer` and `bots run` only |
| `--forget <n>` | yes | A whole number of 1 or more. Refused `bots: --forget takes a whole number`, exit 2 |
| `--list` | no, a switch | Takes no fact |
| `--json` | no, a switch | Only with `--list` |

| Argument combination | Refusal | Exit |
|----------------------|---------|------|
| No fact and neither `--list` nor `--forget` | `bots: remember needs a fact` | 2 |
| `--list` with a fact | `bots: remember --list takes no fact` | 2 |
| `--forget` with a fact | `bots: remember --forget takes no fact` | 2 |
| `--list` and `--forget` together | `bots: remember takes --list or --forget, not both` | 2 |
| `--json` without `--list` | `bots: --json needs --list` | 2 |
| Two positionals | `bots: unexpected argument: <second>` | 2 |

The verb lives in the run mode, because it writes state. The status mode keeps its two read commands. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md:24]

---

## 10. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The append is one `appendFileSync` and takes no lock | A lock would make the append two writes and lose the atomicity that keeps two appends from interleaving |
| The forget copies a concurrent append forward before its rename | The alternative is a lock the append must also take, and the copy-forward closes the window without one |
| The forget writes its own temp file with mode 0600 instead of calling `writeStateAtomic` | That helper sets no explicit mode, and the memory file must be 0600 |
| The entry-count overshoot from two racing appends is accepted and bounded | The byte bound is the one that bounds the prompt, and it refuses long before the entry bound does |
| `appendMemoryEntry` does not check for secrets | The known-secret map lives outside the contracts group, so the caller checks and the module writes |
| `buildBotPrompt` returns `Result<string>` | The budget refusal has to reach the caller, and a throw would be reported as exit 1 rather than as a refusal |
| The builder takes the rendered blocks rather than the files | `dispatch.ts` may not import `memory.ts`, and the runner already reads and renders |
| `--as` on `remember` has no tty rule | 001's tty refusal covers `bots answer` and `bots run`, and a fact's actor is worth recording in a script |
