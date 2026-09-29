---
title: "Jev Integration Patterns"
description: "The four shipped judgment patterns — gate, triage, branch and batch — with the command shape, the exit-code handling and the boundary each one respects."
trigger_phrases:
  - "jev integration pattern"
  - "jev gate"
  - "jev triage"
  - "jev batch questions"
  - "jev judgment dispatch"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.2
---

# Jev Integration Patterns

> Jev returns one typed value. Every pattern below is a way of turning that value into a decision
> without letting the judgment outrank the caller's own rules. The command shapes are the pinned
> contract from `references/cli-reference.md`; the discipline is the hub's `transport-axis` rule
> that a transport pairs with a workflow before any effecting operation.

---

## 1. THE GATE

**Use when** a step must clear a threshold before proceeding and the threshold is the caller's.

```bash
command -v jev >/dev/null || { echo "jev unavailable"; exit 1; }

p=$(jev noul -q 'Does this change introduce an unrecoverable data loss?' \
        -s @"$CHANGE_FILE" --value </dev/null)
rc=$?
if [ "$rc" -ne 0 ]; then echo "no judgment (exit $rc)"; exit "$rc"; fi

awk -v p="$p" 'BEGIN { exit (p >= 0.7) ? 0 : 1 }' || { echo "gate refused at p=$p"; exit 1; }
```

Three properties make this pattern work: `--value` yields a scalar
`awk` can compare, stdin is closed so the call cannot hang, and a nonzero exit is handled *before*
the comparison so exit-4 transport noise can never be read as a probability of zero.

**The threshold belongs to the caller.** Moving it into the question text turns a policy into a
model opinion, which is the failure this pattern exists to avoid.

---

## 2. TRIAGE

**Use when** something has to land in one of a known set of buckets.

```bash
jev choice -q 'Which queue should own this request?' -s @"$REQUEST" \
  --pretty </dev/null \
  -o billing='Payment, charge, refund, or invoice' \
  -o access='Authentication, permissions, or account state' \
  -o technical='Bug, integration failure, or degraded service' \
  -o other='None of the above'
```

Rules that keep the answer usable:

- **Keys are output values.** The returned key is echoed verbatim, so name the key after the thing
  you will do, not after a sentence: `billing`, not `billing-team-should-handle-this`.
- **Descriptions decide the boundary.** The model picks by comparing the state to the descriptions,
  so overlapping descriptions produce a defensible answer on both sides of the overlap. Make them
  mutually exclusive, and make them cover the space, or the model is choosing from a bad list.
- **Two is the floor.** The CLI will send a single-option `choice`; do not. One option is not a
  choice, and the packet refuses it.

Prefer `choice` over `noul` whenever the caller needs a category: a probability threshold forces the
caller to invent a cut line where the model already had to decide the same question.

---

## 3. BRANCH ON AN ORDERED LEVEL

**Use when** the answer is a degree rather than a category, and several thresholds act on it.

```bash
score=$(jev score -q 'How severe is this incident?' -s @"$INCIDENT" --value </dev/null) || exit $?
case "$score" in
  0|1) echo "routine" ;;
  2)   echo "escalate one tier" ;;
  3)   echo "page the on-call" ;;
  *)   echo "unexpected score=$score, treating as highest" ;;
esac
```

Two cautions from the pinned contract:

- **Levels ascend lowest to highest**, and the answer is the zero-based position in that list. A
  list written in descending order silently inverts every downstream comparison.
- **The position may be fractional.** `case` with integer patterns will not match `1.5`; use a
  `*)` fallback that fails safe toward higher severity, or compare numerically.

---

## 4. BATCH

**Use when** several questions genuinely apply to one state and one round trip is cheaper than four.

```json
{
  "state": "<the text or JSON the questions are answered against>",
  "questions": {
    "urgent":   {"type": "noul",   "instructions": "Does this request express urgency?"},
    "owner":    {"type": "choice", "instructions": "Which queue owns it?",
                 "criteria": {"billing": "…", "technical": "…"}},
    "severity": {"type": "score",  "instructions": "How severe?",
                 "criteria": ["no impact", "degraded", "outage"]},
    "routine":  {"type": "noul",   "instructions": "Is this a routine renewal?"}
  }
}
```

```bash
jev run @"$REQUEST_JSON" --pretty </dev/null
```

- **Keys are caller-chosen and name where each answer appears**: the reply carries
  `answers.urgent.noul`, `answers.owner.choice`, `answers.severity.score` and so on. A key that
  collides with a type name makes the reply harder to read, not wrong to parse.
- **`--value` is unavailable here** and the CLI says so only after a successful call, so do not
  reach for it in a batch.
- **Keep the batch coherent.** Questions answered against one state share that state's context;
  bundling unrelated decisions into one call invites a confident answer about something the state
  does not contain.

---

## 5. WHAT NOT TO DO

| Anti-pattern | Why it fails |
|---|---|
| Asking a question this repository can answer | A grep or a test settles it; a judgment about it is a guess in JSON clothing |
| Sending a file "because it might help" | The state is forwarded verbatim to the provider; scope it to what the question needs |
| Treating exit 4 as a negative answer | A 429 is not a judgment, and a gate that reads it as `false` fails open or closed by accident |
| Letting the judgment perform the action | Jev has no file or process tools; the workflow mode that owns the consequence performs it |
| Pinning a model id in the question | Model ids move; the provider default is the durable choice, and `--model` exists for a deliberate override |
| Retrying exit 3 | A missing or rejected key does not resolve by retrying; it is an operator step |

---

## 6. WHERE THIS SITS IN A DISPATCH

A typical composition:

1. A **workflow mode** (`cli-codex`, `cli-claude-code`, `cli-pi`, …) produces or edits an artefact.
2. This **transport** judges the result — is it in the right category, how severe is the finding —
   with a question the caller drafted, not one the model invented.
3. The **caller** acts on the value under its own authorization, and records the judgment alongside
   the action so the decision is auditable.

Steps 1 and 2 are independent dispatches with different contracts; neither inherits the other's
authorization, and a transport never becomes the actor.
