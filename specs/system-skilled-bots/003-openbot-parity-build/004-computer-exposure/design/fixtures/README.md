---
title: "Fixtures: the goldens of computer exposure"
description: "One golden per shape this phase writes, with the section that fixes it, the test that reads it and how a test compares it, plus the check that every file parses."
trigger_phrases:
  - "computer exposure fixtures"
  - "working place goldens"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Goldens of computer exposure

Each file is the literal sample of one section of [`../records.md`](../records.md) or [`../status-row.md`](../status-row.md), on the contracts' one data set: clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, checkout `/Users/ada/code/hello`, operator `ada`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:33-35]

These are this phase's own goldens. The packet's shared set is [`contracts/fixtures/`](../../../contracts/fixtures/README.md), and the full run record lives there as `run-record.additions.json`. This folder holds the twelve goldens for the shapes this phase owns and does not duplicate that record.

A test reads a golden in one of three ways. A **record fragment** is fed to the module's reader or compared field by field. A **payload fragment** is compared key by key and type by type against the verb's real output. A **text golden** is compared line by line against the string the runtime produced.

| Golden | Section | Read by | Test file | Comparison |
|--------|---------|---------|-----------|------------|
| `evidence.shared-branch.json` | records 1.1 | `summarizeRecord` and the record reader | `status-index.vitest.ts` | Field by field |
| `evidence.worktree-branch.json` | records 1.1 | The same | `status-index.vitest.ts` | Field by field |
| `evidence.detached.json` | records 1.1 | The same | `status-index.vitest.ts` | Field by field |
| `run-summary.with-fields.json` | records 2 | `lastRunOf` through a fixture index | `status-index.vitest.ts` | Field by field |
| `run-summary.without-fields.json` | records 2.1 | `lastRunOf` through a fixture index | `status-index.vitest.ts` | Both fields read back null |
| `lastrun.worktree.json` | records 3 | `bots status --json` | `status.vitest.ts` | Key set and types |
| `lastrun.shared.json` | records 3 | The same | `status.vitest.ts` | Key set and types |
| `lastrun.old-index.json` | records 2.1 | The same | `status.vitest.ts` | Both keys present and null |
| `status-rows.txt` | status-row 3 | `formatStatus` | `status.vitest.ts` | Line by line |
| `prompt.shared.txt` | prompt-line 2.2 | `buildBotPrompt` | `dispatch.vitest.ts` | Line by line |
| `prompt.worktree.txt` | prompt-line 2.2 | The same | `dispatch.vitest.ts` | Line by line |
| `prompt.detached.txt` | prompt-line 2.2 | The same | `dispatch.vitest.ts` | Line by line |

## 1. `status-rows.txt`

Seven lines, one row each, in this order. A test reads the file, splits on newline and compares each line against the row `formatStatus` produced for the matching fixture row.

| Line | Row shape | Parts |
|------|-----------|-------|
| 1 | A shared run before this phase, which is also a detached HEAD after it | 5 |
| 2 | A shared run after this phase | 6 |
| 3 | A worktree run after this phase | 7 |
| 4 | A run on a detached HEAD after this phase, byte-identical to line 1 | 5 |
| 5 | A bot that never ran | 5 |
| 6 | A row that already carries every part, so the two new parts are the last two | 12 |
| 7 | A needs-you row, which gains neither part | 7 |

Lines 1 and 4 are the same text on purpose. That equality is the proof that a detached HEAD costs the operator nothing.

## 2. `prompt.*.txt`

Each file is the composed prompt with the body shortened to the literal `<the BOT.md body>`. A test builds the prompt with the same inputs and compares line by line, so the line's index and its exact text are both asserted.

| File | Working place | Checkout line | Lines |
|------|---------------|---------------|-------|
| `prompt.shared.txt` | The checkout on `main` | Absent | 6 |
| `prompt.worktree.txt` | The tree on its branch | Present | 7 |
| `prompt.detached.txt` | The checkout, no branch clause | Absent | 6 |

The checkout line in `prompt.worktree.txt` keeps the semicolon the runtime's own text carries. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:306-308]

## 3. The parse check

Every JSON file parses and every text file is UTF-8 with no trailing whitespace on a line:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design/fixtures
for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done
rg -n ' +$' . || echo "no trailing whitespace"
```
