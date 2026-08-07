# Iteration 011 — Pi session tree and branch controls

## Focus

Does Pi really lack checkpoints and rewind?

## Evidence

- Pi documents persisted JSONL sessions plus `/tree`, `/fork`, `/clone`, and `/compact`; the session tree lets a user navigate to earlier conversation points and continue in the same file. [SOURCE: https://pi.dev/docs/latest/sessions]

## Assessment

The blanket ‘checkpoints & rewind missing’ claim is only partly true: conversation branching/navigation exists, but no workspace-file rollback was verified.

## New Signal

Separated conversation-state recovery from filesystem recovery. The preliminary convergence score is 0.28; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
