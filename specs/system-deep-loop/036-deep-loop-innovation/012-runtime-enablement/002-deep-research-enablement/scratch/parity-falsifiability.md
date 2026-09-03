---
title: "Can the parity gate be turned red?"
trigger_phrases: []
---
# Can the parity gate be turned red?

## Why this was asked

The parity gate is the safety margin for moving authority. A gate that returns green but cannot be
made to return red proves nothing. This records an attempt to make it fail on purpose, and the
result, including a hypothesis of mine that the evidence refuted.

## The hypothesis, and why it was wrong

Reading the source suggested the gate could not fail on its authority conditions. The certificate
issuance guard refuses when any of these hold:

    openDivergenceCount !== 0
    authorityMutation
    authorityState !== 'legacy_authoritative'
    runs.length < 2

On the success result those first three fields carry literal types fixed to exactly the values the
guard tests for, and the harness constructs them with those literals. The same shape appears in the
divergence-closure guard. No test drives any of the three: the two refusals that do exist come from
certificate verification, a null certificate and a tampered digest, and never reach issuance.

From that I inferred the three conditions were structurally unreachable. That inference was wrong.
A literal type constrains what the compiler will accept; it does not make a runtime branch dead.
The check reads the value that actually flows through, and the value can differ from what the type
promises.

## The measurement

Baseline, unmodified tree, research parity plus the core harness suite:

    103 passed / 103, exit 0, 438s

Then the success path was perturbed to report that the run had mutated authority, the single
condition a parity pass must never carry:

    authorityMutation: false   ->   authorityMutation: true

Same two suites:

    30 failed / 73 passed, exit 1, 438s

The failures are verdict flips, four of them reading `expected 'blocked' to be 'green'`, alongside
assertions that expected a pass status and a green exit status. The gate did not warn or ignore
the condition. It blocked.

Restored afterwards; the working tree is byte-identical, `git status` empty.

## Conclusion

The parity gate is falsifiable on the condition that matters most. A parity run that claimed an
authority mutation is refused rather than certified, and the refusal changes the verdict to
blocked. This is evidence the green means something.

One narrower observation stands and is separate from the above. No module in the parity subsystem
imports the authority registry: each per-mode harness returns a frozen authority snapshot, and the
core harness pins its own authority state as a constant. The two are not even consistent with each
other, since the per-mode adapters say shadowing while the core says legacy authoritative. So the
parity gate checks the flag its own run reports, not the state of the durable record.

That is defensible, because the durable record is checked where authority actually moves rather
than in the comparison harness, and the harness runs in a sandbox where authority is not expected
to change. It is recorded because a reader could otherwise mistake the parity gate for a check on
real authority state, which it is not.
