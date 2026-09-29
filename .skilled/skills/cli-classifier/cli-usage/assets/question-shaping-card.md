---
title: "Question Shaping Card"
description: "Draft a jev question so the returned value is usable: pick the type first, scope the state, write mutually exclusive criteria, and know when not to ask."
trigger_phrases:
  - "jev question shaping"
  - "how to phrase a jev question"
  - "jev prompt card"
  - "choice criteria"
  - "score levels"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# Question Shaping Card

> A jev call is two inputs and one output. The state is what the model reads; the question is what it
> answers. Most bad judgments are bad inputs, and the failure is quiet: a fluent answer to a question
> nobody meant to ask comes back with exit 0.

---

## 1. PICK THE TYPE BEFORE THE WORDS

| You will do this with the answer | Ask | Because |
|---|---|---|
| Compare to a threshold you own | `noul` | You get a probability and set the cut line |
| Switch on a category | `choice` | You get a key you can branch on, and the categories are explicit |
| Rank, escalate by degree, or bucket into tiers | `score` | You get an ordered position you can map to tiers |
| Decide several things about one state | `run` | One round trip, several typed answers, keys you chose |

Flipping the table is the common mistake: reaching for `noul` and then inventing a threshold where a
`choice` was the real question, or reaching for `choice` where the useful answer was a degree.

---

## 2. SCOPE THE STATE

- **Send what answers the question and nothing else.** The state travels verbatim to a provider.
- **Prefer a file over an inline string** once the state is longer than a line: `-s @path` keeps the
  shell out of the payload and keeps the transcript readable.
- **`--json-state` means what it says.** Use it when the caller will compare structure; leave it off
  for prose, because a stray brace turns a judgeable paragraph into a parse error at exit 2.
- **Strip secrets and private records first.** Authorization to send the state is the caller's, and
  a judgment is not worth a leak.

---

## 3. WRITE THE QUESTION

A question that produces a usable value has four properties:

1. **One decision.** "Is this urgent, and who owns it?" is two questions wearing one sentence; use
   `run` with two entries, or ask the important one.
2. **Second person, no hedging.** "Does this message express urgency?" beats "Would it perhaps be
   reasonable to think this might be urgent?" — the hedges become part of what is judged.
3. **Name the subject the state contains.** A question about "this incident" over a state that is a
   stack trace invites an answer about the stack trace, which may not be the incident.
4. **No answer in the question.** "Confirm that this is a billing issue, not a technical one" has
   asked for agreement. Ask the open form and let the model choose.

---

## 4. WRITE THE CRITERIA

### For `choice`

- **Two to five options.** Below two there is no choice; above five, options start collapsing into
  each other and the model picks by feel.
- **Descriptions, not labels.** `billing='Payment, charge, refund, or invoice'` is answerable;
  `billing='Billing'` is a guess.
- **Mutually exclusive and covering.** Overlapping descriptions produce a defensible answer on
  either side of the overlap. Add an explicit escape option (`other='None of the above'`) rather than
  leaving a gap.
- **Keys are the output.** They are returned verbatim, so name them for the branch you will take.

### For `score`

- **Ascending, lowest first.** The answer is the zero-based position, so a descending list inverts
  every comparison downstream.
- **Describe the boundary, not the number.** `'degraded: some users affected, workaround exists'`
  beats `'2'`.
- **Three to five levels.** Two is a `noul` with extra steps; more than five and adjacent levels blur.
- **Expect fractions.** The returned position may be fractional; compare numerically, and give the
  fallback branch the safer outcome.

---

## 5. CHECK BEFORE YOU SPEND THE CALL

- [ ] The type matches what I will do with the value.
- [ ] Exactly one decision is being asked.
- [ ] `choice` has at least two mutually exclusive, described options.
- [ ] `score` levels ascend and at least two exist.
- [ ] The state contains what the question asks about, and nothing private.
- [ ] stdin is closed or fed, and `--value` is not combined with `run`.
- [ ] The exit code will be read before the payload.
- [ ] The consequence stays behind my own authorization.

---

## 6. WHEN NOT TO ASK AT ALL

- **The repository can answer it.** A grep, a test run or a read is evidence; a judgment about it is
  a guess that happens to be printed as JSON.
- **The question has no consequence.** If both answers lead to the same next step, the call buys
  nothing.
- **The caller is asking for permission.** A model's answer is not an authorization, and a
  `choice` for "should I do this?" is a decision laundered through a third party.
- **The state cannot be sent.** If the state is the secret, there is no safe framing; ask a different
  question or none.
