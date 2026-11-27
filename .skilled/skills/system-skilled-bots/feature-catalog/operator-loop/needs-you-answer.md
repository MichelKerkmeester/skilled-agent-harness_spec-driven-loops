---
title: "Needs-you answer"
description: "Records the operator's answer on a needs-you item and queues one resume request so the parked run continues."
trigger_phrases:
  - "needs-you answer"
  - "bots answer"
  - "answer the bot"
  - "resume a parked bot run"
version: 1.0.0.1
---

# Needs-you answer (bots answer)

## 1. OVERVIEW

Records the operator's answer on a needs-you item and queues one resume request so the parked run continues.

`bots answer <item-id> <text>` belongs to the run mode, and the item id comes from `bots inbox`. The answer itself starts nothing: the drain picks up the resume request and runs the bot again with the question and the answer in its prompt.

---

## 2. HOW IT WORKS

An expired item, an unknown item, a missing text or a different answer to an answered item is refused. The answer is checked for secret literals first, because it reaches the resumed run's prompt. It is then written on the item, a `resume` request keyed by the item id is enqueued and the generation stamp advances. Writing the answer before the enqueue means that by the time any drain claims the request, the item no longer holds the bot. A crash between the two leaves an answered item with no request, and running the same answer again sends it. Because the key is the item id, sending it twice stores it once.

Every item carries one `grants` object holding `kind`, `action`, `rung`, `scope`, `grantedBy` and `grantedAt`. The first three are set when the item is written and the last three are null while it is open. The answer writes `grants.scope`, `grants.grantedBy` and `grants.grantedAt` in the same write as the answer itself, so `grants.scope` always equals `answer.scope`, `grantedBy` equals `answer.by` and `grantedAt` equals `answer.answeredAt`. An item written before the field existed reads `grants: null` and still lists in `bots inbox`.

`--scope` takes `once` or `deny`. No `--scope` records `once`, except a NO: a text of `deny`, `no`, `n` or `reject`, trimmed and in any case, records `deny` even when `--scope once` is given, so a refusal is never recorded as an approval. A review item decides its own scope, so on a memory-proposal item `reject` records `deny` and `confirm` records `once` whatever `--scope` says. `--scope always` and `--scope conversation` exit 2 with `bots: grant-scope-unsupported: no rule store lands in this phase`. Any other value exits 2 with `bots: --scope takes once or deny`.

The answer's identity is its text and its scope together, so a second answer with another text or another scope exits 4 with `bots: item-answered-differently: answered at <instant>`, and the recorded answer stands. The write takes an exclusive lock file beside the item, `<item-id>.lock` in the needs-you folder, holding the writer's pid, a nonce and its creation instant. A lock whose owner pid is gone, or older than 60 seconds, is reclaimed, so a killed process never blocks the next answer. A lock held by a live process is waited on for up to 2,000 ms, then the answer exits 4 with `bots: item-busy: held by pid <pid> since <instant>`, and retrying the same answer is safe. Two answers that race land one, and the loser is refused `item-answered-differently`.

The resumed run's prompt is the parked run's own prompt, then the question, any offered options and the answer, with an instruction to continue from where that run stopped. It binds the same spec folder and reopens a kept worktree. A resumed run whose posture changed since it parked is refused as `resume-posture-changed`, and one whose answer holds a secret is refused naming the key. A resume is an unattended run, so a `BOT.md` or `bots/config.json` changed since approval refuses it as `definition-drifted`.

From the answer until the resume has run, the bot's scheduled and queued runs wait as `awaiting-resume-hold`, and the drain puts such a request back for a later pass. The resume therefore finds the lease free and no newer question in its way.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Shared | Secret check, answer write, resume enqueue and generation stamp |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Shared | Builds the resumed prompt from the answered item and finds an answered item still waiting for its resume |
| `.skilled/bin/bots.cjs` | Handler | The `answer` and `inbox` verbs |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Vitest | A repeated answer stored once, answer-before-enqueue order and the refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts` | Vitest | Two resume sends drain into one run, a failing resume retries to the bound and other runs wait for the resume |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/run-answer-question.md` | Manual playbook | Routes an answer request to the run mode |

---

## 4. SOURCE METADATA

- Group: Operator loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `operator-loop/needs-you-answer.md`

Related references:
- [needs-you-items.md](needs-you-items.md) - the item an answer resolves
- [../requests/queue-drain.md](../requests/queue-drain.md) - the pass that runs the resume request
