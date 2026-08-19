# Playbook procedure, followed literally

## What was missing

The manual-testing playbook documents four script entry points across 55 files
and mentioned the append gateway **zero** times — the sanctioned path by which
every canonical record reaches a mode's state log had no procedure at all. The
feature catalog had the same gap.

Added, following the pair convention the other entries use:

- `manual-testing-playbook/script-entry-points/append-mode-event-script.md` (DLR-055)
- `feature-catalog/script-entry-points/append-mode-event-script.md` (F055)

## Followed literally, from a clean directory

Every documented signal in steps 4-6 held:

| Documented | Observed |
|---|---|
| exit 0, `"ok": true` | yes |
| receipt with `ledger_id`, `sequence`, `event_id`, `event_type`, `canonicalEventHash`, `recordHash` | all present |
| `event_type` is `deep-research.ledger.run-initialized` | matched |
| `authorizationRef` with `audit_ledger_id`, `audit_sequence`, `decision_digest`, `policy_digest` | all present |
| ledger frame, audit frame, projected legacy file, watermark, fence grant journal | all five present |
| projected record `{"type":"config","topic":"run-probe-1","maxIterations":10,...}` | matched |
| watermark `ledger_sequence` 1, `projection_version` `legacy-research-state@1`, `reducer_version` `deep-research-state-reducer@1` | matched |
| no authority record written | confirmed |

The procedure exercises the gateway. It is not a direct file write, and it works
under legacy authority, before any cutover.

## Following it literally falsified two of its own claims

This is the reason the check is "followed literally" rather than "reviewed".

**Claim 1, wrong.** "A bare (unprefixed) stem is rejected as an unrecognized
event format." A bare stem actually yields `Envelope field must be a bounded
non-empty string`. The *unrecognized event format* error belongs to input
carrying neither a stem nor an event_type — a different case entirely.

**Claim 2, wrong.** "An unknown mode is denied at admission." An unresolvable
mode name is a script error at exit 1, before authority is ever consulted.
Admission denial is a different thing and exits 2.

Both were corrected against measured output, and the Failure Modes section now
separates exit 1 (script error, never reached authority) from exit 2 (refused at
the authority boundary), quoting the real reason strings.

## A near-miss worth recording

Those exit-1 results almost became a second false alarm. The `refusal_handling`
line shipped in ten workflow assets reads "halt on exit 2", and three failing
cases exiting 1 looked like that guidance was wrong.

It is not. Exit 2 is genuinely the refusal path, confirmed by driving one:
`--mode deep-improvement` resolves but sits outside the frozen authority order,
and returns exit 2 with `AUTHORITY_DENIED` and no state written. Exit 1 covers
input errors that never reach authority. The shipped guidance is correct; the
three cases simply were not refusals.

That also re-confirms the improvement mode has no working name on this CLI:
`deep-improvement` is not in the frozen order, whose members are deep-research,
deep-review, deep-ai-council, deep-improvement-common, agent-improvement,
model-benchmark, skill-benchmark and deep-alignment.
