---
title: "Bot Runs: The Approval Ladder"
description: "The four rungs that decide whether a bot asks before it acts, the six kinds of action that ask in every edition, the two scopes an answer can grant and the one token a bot may declare."
trigger_phrases:
  - "approval ladder"
  - "why did the bot ask"
  - "grant scope"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Bot Runs: The Approval Ladder

A bot asks the operator before it acts when the ladder says the action is worth asking about. This reference names the four rungs in order, the six kinds of action that ask in every edition, the two scopes an answer can grant and the one token a bot may put in its question to raise the rung.

---

## 1. THE ORDER

The first answer wins: a kind beats a rule and a rule beats auto-review. A later rung never overrides an earlier one, so a rule that allows an action cannot silence a kind that asks about it.

1. A kind of action. The question names one of the six kinds, so the bot asks.
2. A rule. A stored rule matches the action and answers allow or deny.
3. Auto-review. A reviewer reads the action before it runs.
4. Extra vigilant. The bot asks about everything it would otherwise do.

---

## 2. RUNG 1, KINDS OF ACTION

A kind asks in every edition, so no setting turns rung 1 off. The kinds are tested in table order over the whole question, and the first kind found wins.

| Kind | Words that recognize it |
|------|-------------------------|
| `pay` | pay, payment, buy, purchase, checkout, refund, transfer, payout, withdraw, withdrawal, charge, order, invoice, payroll, subscribe, subscription, upgrade, downgrade, plan change |
| `credentials` | password, passphrase, credential, credentials, two-factor, 2fa, api key, secret key, access token, security setting, sign in as |
| `delete` | delete, trash, destroy, erase, purge, wipe, discard, remove, archive |
| `send` | send, reply, forward, respond, notify, broadcast, invite, comment, message, email |
| `share` | share, sharing, shared link, permission, permissions, collaborator, collaborators, grant access, add people |
| `post` | post, publish, tweet, repost, release, go live |

A payment that also deletes reads as `pay`. A benign first sentence cannot hide a delete, because the whole question is read and not just its opening. Words match as whole words only, so a word inside a longer word does not count. No kind found reads `other`.

---

## 3. RUNGS 2 TO 4

- **Rule.** A stored rule matches the action and answers allow or deny. It is not implemented in this phase.
- **Auto-review.** A reviewer reads the action and answers before it runs. It is not implemented in this phase.
- **Extra vigilant.** The bot asks about everything it would otherwise do. It is not implemented in this phase.

No store supplies these three rungs, so they are never recorded. A grant names rung 1 or the fallback and nothing else.

---

## 4. THE FALLBACK

When no kind of action is found, the bot asks at the `bot` rung. It is where the ladder ends rather than a fifth rung, so a question with no recognizable kind still asks and still records a grant.

---

## 5. THE TWO SCOPES

An answer grants one of two scopes.

- `once` records that the action may run this time only.
- `deny` records that the action must not run.

A NO records `deny`. A text of `deny`, `no`, `n` or `reject`, trimmed and in any case, records `deny` even when the answer asks for `once`, so a refusal is never recorded as an approval. On a memory-proposal review item, `reject` records `deny` and `confirm` records `once` whatever the answer asks for.

`always` and `conversation` are refused `grant-scope-unsupported`, because no rule store lands in this phase. Any other value is refused as a scope that takes `once` or `deny`.

---

## 6. THE STRICTEST RULE WITHIN RUNG 2

Rung 2 is not implemented in this phase. The rule is written now so the order is complete.

When more than one rule matches one action, the strictest rule wins, so a deny rule beats an allow rule. A standing allow attaches to a kind of action and never to a phrase, so the same words in another context do not inherit it. A standing allow on an action whose kind is `other` would be refused `grant-kind-unknown`, because there is no kind to attach it to.

---

## 7. WHAT A BOT MAY DECLARE

A bot may put one `[ACTION: <kind>]` token in its question, naming one of the seven kinds. The seven are the six kinds of action and `other`. The grammar is one token holding one kind, and the first token wins while the rest are ignored.

The token is a floor and never an override. The grant records the stricter of the declared kind and the kind the word lists find, where stricter means earlier in the order. `[ACTION: other]` on a question naming a delete records `delete`, so a declaration cannot lower a kind.

A token naming a kind outside the seven fails the run `action-kind-invalid` and writes no item.
