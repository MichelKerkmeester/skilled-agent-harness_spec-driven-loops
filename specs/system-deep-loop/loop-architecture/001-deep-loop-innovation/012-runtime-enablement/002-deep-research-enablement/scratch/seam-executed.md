---
title: "The declared seam, executed"
trigger_phrases: []
---
# The declared seam, executed

## What was in doubt

`CHK-002` and `CHK-005` were held open on the same reservation: the workflow
assets *declare* the gateway in a `state_write_protocol` block, but a YAML
workflow is agent-executed, so the manifest-to-gateway link was recorded as
declared rather than executed. A declaration nobody has ever run is a claim.

## What was run

The command string the block instructs agents to use, verbatim, with a real
deep-research event and no modification:

```
node .opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs \
  --mode research --run-directory <run> --event-json <record file>
```

Exit 0, `ok: true`. Receipt saved at `scratch/seam-execution-receipt.json`.

## What it produced

The write was authorized, ordered, receipted, and projected:

| Artifact | Meaning |
|----------|---------|
| `deep-research-ledger/frames/0000000000000001.frame` | the event is durable in the ledger |
| `deep-research-audit-ledger/frames/0000000000000001.frame` | an authorization decision was recorded, with a policy digest |
| `research/deep-research-state.jsonl` | the legacy file consumers read |
| `.legacy-projection-watermarks/research-state.json` | projection provenance |
| `locks-and-fencing-v1/.../grant-journal.jsonl` | the write went through the fence |

The projected legacy record is the shape consumers expect:

```
{"type":"config","topic":"run-probe-1","maxIterations":10,"generation":1,"timestamp":"..."}
```

The watermark ties it back to the ledger: `ledger_sequence: 1`, a
`ledger_record_hash`, `projection_version: legacy-research-state@1`, and
`reducer_version: deep-research-state-reducer@1`.

## Two things this establishes

**The seam is real, not aspirational.** The declared command runs end to end and
lands a record in both the ledger and the legacy file, with a receipt and an
audit decision behind it.

**It works before the flip.** No authority record was written during the run, so
the mode was on the synthesized `legacy_authoritative` throughout. The gateway
accepted the write and projected it anyway. An agent pointed at this command
today gets a durable, authorized, projected write — which is why removing the
direct-append guidance ahead of the flip is safe.

## What it does not establish

`CHK-002` asks that *both command variants* be proven by execution to reach one
shared seam. This proves the seam and the command; it does not run either
workflow variant as an agent, so the step from a manifest directive to this
command is still declared. Both items stay open, on narrower grounds than before.

## Correction

An earlier probe of this same command failed and was nearly reported as a broken
instruction. The fault was the probe's: it passed a bare `run_initialized` stem
where the schema keys are prefixed (`deep_research.run_initialized`). With the
correct stem the command succeeds. The command was never broken.
