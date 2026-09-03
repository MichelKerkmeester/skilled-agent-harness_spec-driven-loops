---
title: "A mode the authority order blessed and the CLI could not write"
trigger_phrases: []
---
# A mode the authority order blessed and the CLI could not write

## What was measured

The fleet phase recorded a finding that one mode had no working name on the append CLI, and routed
the fix back here because two of its four named sites are gateway surfaces this phase owns. The
finding was re-measured by execution before anything was changed, because a finding is a hypothesis
until its symptom is reproduced.

Four spellings, same run directory, same minimal event payload:

| `--mode` | exit | phase | reason |
| -------- | ---- | ----- | ------ |
| `improvement` | 2 | authority | `Mode 'deep-improvement' is not in the frozen authority order` |
| `deep-improvement` | 2 | authority | same |
| `deep-improvement-common` | 1 | runtime | `Unsupported mode: deep-improvement-common` |
| `agent-improvement` | 1 | runtime | `Unrecognized event format` |

The fourth row is the control. It clears both the adapter and the authority gate and fails only on
the deliberately minimal payload, which is what a routable mode looks like. Exactly one of the seven
fleet modes could not be written through the canonical path, and it is third in the fleet order, so
a fleet run stops there.

## Root cause

The CLI's `normalizeMode` mapped `improvement` and `deep-improvement` to the private string
`deep-improvement`, and the adapter switch was keyed on that same string. The frozen authority order
spells the mode `deep-improvement-common`. Each layer was self-consistent and the two disagreed, so
every spelling was refused by whichever layer the other spelling satisfied.

The authority order is the canonical vocabulary. The private alias is the thing that was wrong.

## Why the gateway had to change with it

The gateway's surface resolution had an explicit line for `deep-improvement` and `improvement`. Left
alone, the renamed mode would fall past it into the generic tail, which strips the `deep-` prefix and
yields `improvement-common-state` — a surface id that does not exist. The write would not have
failed; it would have landed somewhere else. This was derived independently twice, once before the
edit and once by the implementing executor, and both derivations agreed.

The projection manifest was deliberately left alone. Its `legacyWriter` names the historical writer,
not a routing key, and a coverage guard classifies surface ownership by the `improvement-` prefix.
The adjudication subsystem's own `deep-improvement` constant was checked rather than assumed: it is a
decision kind in a separate registry, and needed no change.

## The suite was asserting the defect

The unknown-mode test passed `--mode deep-improvement` as its example of an unrecognized mode and
asserted `AUTHORITY_DENIED`. That test could only pass while a mode existed that the adapter accepted
and the order refused — which is precisely the bug. Fixing the routing turned it red.

It could not be repaired by substituting another unknown mode. The adapter runs before the authority
check, and once the adapter's mode set and the frozen order hold the same eight modes, nothing the
adapter accepts can be refused by the order. The authority-order branch is now unreachable from the
CLI. Resurrecting the old assertion would have required inventing a mode with an adapter case and no
authority entry — fabricating a state the system cannot be in. The test now asserts what the CLI
actually does with an unrecognized mode, and records why the other branch cannot be reached.

## Two assertions were prescribed wrong

The replacement test was first told to assert the reason contained `Unrecognized event format`, a
string measured under a bare payload while the test uses a full sample event. It was then told to
assert the mode produces the same reason as a routable control. Both were wrong, and for the same
underlying reason: each mode's own ledger schema rejects the shared sample payload at its own stage,
so there is no cross-mode uniformity to assert.

| mode | reason with the sample payload |
| ---- | ------------------------------ |
| `deep-improvement-common` | `Envelope field must be a bounded non-empty string` |
| `agent-improvement` | `Agent Improvement events require the agent-improvement variant.` |

Both are past the adapter and past the order — the actual property — but at different depths. The
test now asserts that property directly: a present, non-empty reason that names neither refusal. The
non-empty assertion is what gives the two absence checks force, since a missing reason would satisfy
both by containing nothing.

## The guard that would have caught it

A test now walks the frozen authority order and requires every mode in it to route. The order is the
canonical vocabulary, so a mode it names that the CLI cannot reach is unreachable in production.

## Negative control

The CLI's normalization was reverted to the private spelling and the CLI suite re-run.

    baseline (before any change)   17 passed
    after fix                      19 passed
    defect reintroduced             2 failed, 6 passed
    restored                       19 passed

The guard failed naming the mode that drifted:

    mode 'deep-improvement-common' must be routable through the CLI:
    expected 'Unsupported mode: deep-improvement-co…' not to contain 'Unsupported mode'

The perturbed file was restored from a copy taken before the edit and confirmed byte-identical by
hash.

## Adversarial review, and what it changed

The change was handed to an independent reviewer instructed to refute rather than confirm, with the
code inline and no file access. It returned two findings. Both were treated as hypotheses and tested.

**Upheld, and it was right.** The frozen-order guard asserted only two absences against the CLI's
reason string and never asserted a reason was present. A run that produced no reason stringifies to
`undefined`, which contains neither forbidden phrase, so both absence checks pass and the guard
reports a mode routed when it was not. The routing test beside it already closed exactly that vacuum;
the guard meant to generalise it had dropped the defense.

Adding the presence check then failed, and the failure was informative rather than annoying:

    mode 'deep-research' must report a reason: expected 'undefined' to be 'string'

The sample payload the loop feeds every mode is a valid deep-research event, so for that one mode the
CLI **succeeds** — no reason, because there is nothing to explain. A completed write is the strongest
evidence of routability available, and the assertion had been written as though refusal were the only
outcome. The guard now takes both branches explicitly: the write completed, or it was refused for a
reason of its own that is neither of the two refusals meaning the mode never reached its schema.

Both branches were then proven red separately.

| perturbation | branch exercised | result |
| ------------ | ---------------- | ------ |
| old spelling restored in the CLI | routing | `mode 'deep-improvement-common' must be routable through the CLI` |
| `reason` deleted from every emission | presence | `mode 'deep-review' must report a reason: expected 'undefined' to be 'string'` |
| restored, hash-identical | — | 8 passed |

**Challenged an assertion that had not been shown.** The reviewer noted the claim that the renamed
mode falls to the generic tail was asserted, not demonstrated: the manifest lookup ahead of the tail
might have matched. That was fair, and it is now measured rather than argued — the manifest holds
zero entries matching any of that lookup's five arms for this mode, and no surface named
`improvement-common-state` exists at all. The claim stands, on evidence instead of on reasoning.

**Recorded, not acted on.** The reviewer observed that `normalizeMode` is exported, so its changed
return value is visible beyond the CLI. Checked: nothing in the repository imports that module, so no
in-repo caller compares against the old literal. The residual exposure is limited to callers outside
this repository, which cannot be ruled out from here.

It also observed that a check proving a consumer exists and starts is weaker than the word
reachability suggests — a gutted stub that exits zero would still pass. True, and the check's own
description now claims exactly that and no more, with the deeper contract carried as an explicit
unanswered question rather than folded into this one.

## A capture that had to be discarded

The full suite was started before this work settled, and kept running while the test file was edited
and the CLI was twice perturbed and restored for the controls above. Those measurements describe a
tree that moved underneath them, so the capture was quarantined rather than used. This is the same
property the whole-system gate's frozen-candidate check exists to enforce, arrived at from the other
direction. The suite was re-run only once no runtime path was dirty.
