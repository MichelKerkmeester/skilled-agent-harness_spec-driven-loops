# Ops Self-Healing Scripts

Deterministic runbook automation helpers for four failure classes:

1. `index-drift`
2. `session-ambiguity`
3. `ledger-mismatch`
4. `telemetry-drift`

All class handlers use bounded retry. On retry exhaustion they emit a single-line escalation JSON payload and return non-zero.

## Files

- `ops-common.sh` shared retry, logging, and escalation helpers
- `heal-index-drift.sh`
- `heal-session-ambiguity.sh`
- `heal-ledger-mismatch.sh`
- `heal-telemetry-drift.sh`
- `runbook.sh` helper for listing classes, runbook lookup, and drill execution

## Retry and Escalation Contract

- Retries are deterministic and configured per step.
- `--max-attempts` sets the hard upper bound for retries.
- `--scenario success` runs a bounded-success profile.
- `--scenario escalate` forces retry exhaustion for escalation drills.
- Escalation payload shape:

```json
{"event":"ESCALATION","failure_class":"telemetry-drift","step":"verify-release-gate","attempts":2,"owner":"Operations Lead","reason":"bounded-retry-exhausted","next_action":"operator-ack-required","command":"node ...","timestamp":"2026-02-22T00:00:00Z"}
```

## Runbook Helper

List supported classes:

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh list
```

Show one class runbook details:

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh show index-drift
```

Run deterministic drills for all classes:

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 3
```

Run escalation drill for one class:

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill telemetry-drift --scenario escalate --max-attempts 2
```

## Class Handler Help

Each class script supports `--help` and the same control options:

- `--scenario <success|escalate>`
- `--max-attempts <n>`
- `--backoff-seconds <n>`
- `--detect-failures <n>`
- `--repair-failures <n>`
- `--verify-failures <n>`

