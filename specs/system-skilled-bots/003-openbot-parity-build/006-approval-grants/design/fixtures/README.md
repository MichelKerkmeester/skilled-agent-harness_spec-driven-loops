---
title: "Fixtures: goldens for the approval grant"
description: "One golden per shape this phase writes, plus the classifier's kind table and the ladder's case matrix as data, with the test file that reads each and the check that every file parses."
trigger_phrases:
  - "grant fixtures"
  - "action kind table"
  - "ladder case matrix"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Goldens for the approval grant

Each file is the literal sample of one shape in [`../records.md`](../records.md) or one surface in [`../mockups.md`](../mockups.md). The clock, the identity, the operator and the bot are the packet's one data set. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "Durable records of the OpenBot parity build"]

The item goldens the packet already holds are not copied here. `contracts/fixtures/needs-you-item.today.json` is the thirteen-key item with no `grants`, and `contracts/fixtures/needs-you-item.final.json` is the nineteen-key item with a denied grant. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/README.md, section "Golden records and payloads", row `needs-you-item.today.json`]

## 1. THE FILES

| Golden | Shape | Read by | Test file |
|--------|-------|---------|-----------|
| `grant.born-open.json` | the grant object, born open | `validateNeedsYouItem` inside `item.with-grant.json` | `tests/needs-you.vitest.ts` |
| `grant.granted.json` | the grant object, granted `once` | the same validator, and the resumed prompt builder | `tests/needs-you.vitest.ts` |
| `grant.denied.json` | the grant object, denied | the same validator, and the run record's grant line | `tests/needs-you.vitest.ts` |
| `item.with-grant.json` | a full item carrying the grant | `validateNeedsYouItem` | `tests/needs-you.vitest.ts` |
| `lock.file.json` | the lock file's three keys | the lock reader in `answer.ts` | `tests/answer.vitest.ts` |
| `run-record.request-grant.json` | the request join with `grant` | `validateRunRecord` | `tests/run-record.vitest.ts` |
| `action-kinds.json` | the six kinds, their word lists, their order and nine cases | `classifyAction` | `tests/action-kind.vitest.ts` |
| `ladder-cases.json` | the four rungs, the fallback, thirteen scope cases and the 21-row matrix | `decideApproval` and the scope rule | `tests/approval-ladder.vitest.ts` |
| `inbox-line.txt` | the `bots inbox` line for one open item | the CLI's own output | `tests/cli-run.vitest.ts` |
| `inbox-json-row.json` | one `bots inbox --json` row | the CLI's own output | `tests/cli-run.vitest.ts` |
| `resumed-prompt.txt` | the resumed prompt for a denied item | `buildResumedPrompt` | `tests/needs-you.vitest.ts` |

A **record** golden is fed to the module's validator or reader. A **surface** golden is compared line by line or key by key against the verb's real output. A phase that changes a shape edits the golden in the same change.

## 2. THE TWO DATA FILES

`action-kinds.json` and `ladder-cases.json` are not samples. They are the tables a test walks, so the word lists and the case matrix live in one place rather than in a test body.

- `action-kinds.json` holds the six kinds in `classifyAction`'s order, the word list each kind is recognized by, one sample question per kind and nine cases. The cases include the two-kind question, the benign first sentence, the empty question, the quoted example, the declaration that raises a kind, the declaration that cannot lower one, the declaration outside the seven and two declarations.
- `ladder-cases.json` holds the four rungs, the `bot` fallback, the two implemented values, the three that are not, thirteen scope cases and the 21-row matrix of seven kinds by three scopes.

The matching rule the cases are read under is `../records.md` section 5.4: lower case, whole word, a phrase matched as a phrase and the declaration tokens removed before the scan. The `two declarations, the first wins` case is the one that proves the last two rules together. Its text scans as `Notify the buyer` once both declaration lines are cut out, so `notify` matches `send` and the `buy` inside `buyer` matches nothing, and the first declaration wins. A reader that matched substrings would read `pay` from the second token and a reader that scanned the declarations would read `pay` as well, so the row fails on either mistake.

## 3. THE ONE CASE THAT IS A LIMITATION

`action-kinds.json` case `a kind named only in a quoted example` expects `delete`, because the classifier reads the whole question and a quoted example is part of it. The cost is a false positive on a question that quotes a kind without meaning it. The declaration line cannot lower it, because the declaration is a floor. The trade is the one the spec makes on purpose: a benign first sentence must not hide a delete, and a bot that quotes a kind pays for that with one extra ask. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:160]

## 4. CHECK EVERY FILE PARSES

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/fixtures
for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done
node -e 'const m = JSON.parse(require("fs").readFileSync("ladder-cases.json", "utf8")); if (m.matrix.length !== 21) { console.error("matrix is " + m.matrix.length); process.exit(1); }'
node -e 'const k = JSON.parse(require("fs").readFileSync("action-kinds.json", "utf8")); if (k.order.length !== 6) { console.error("order is " + k.order.length); process.exit(1); }'
```

The first loop prints nothing when every file parses. The second prints nothing when the matrix holds 21 rows. The third prints nothing when the order holds six kinds.
