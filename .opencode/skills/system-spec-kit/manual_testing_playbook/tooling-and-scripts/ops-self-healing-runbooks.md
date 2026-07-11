---
title: "234 -- Ops Self-Healing Runbooks"
description: "This scenario validates ops self-healing runbooks for `234`. It focuses on confirming the runbook dispatcher, metadata surfaces, successful drills, and bounded escalation behavior."
version: 3.6.0.12
---

# 234 -- Ops Self-Healing Runbooks

## 1. OVERVIEW

This scenario validates ops self-healing runbooks for `234`. It focuses on confirming the runbook dispatcher, metadata surfaces, successful drills, and bounded escalation behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm runbook listing, metadata lookup, success drills, and escalation drills.
- Real user request: `` Please validate Ops Self-Healing Runbooks against the documented validation surface and tell me whether the expected signals are present: `list` prints four classes; `show` prints trigger, owner, escalation, and drill command; supported success drills emit recovery payloads; degraded drills emit escalation payloads or non-zero aggregate status. ``
- Prompt: `Validate Ops Self-Healing Runbooks against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `list` prints four classes; `show` prints trigger, owner, escalation, and drill command; supported success drills emit recovery payloads; degraded drills emit escalation payloads or non-zero aggregate status
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the dispatcher and metadata surface behave deterministically and the drill outcomes match the current degraded-versus-supported reality

---

## 3. TEST EXECUTION

### Prompt

```
Validate Ops Self-Healing Runbooks against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh list`
2. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh show index-drift`
3. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill index-drift --scenario success --max-attempts 3`
4. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill ledger-mismatch --scenario success --max-attempts 3`
5. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill telemetry-drift --scenario escalate --max-attempts 2 || true`
6. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 2 || true`

### Expected

Four failure classes listed; `show` prints trigger, owner, escalation, and drill fields; supported drills emit `RECOVERY_COMPLETE`; degraded classes surface `ESCALATION` or non-zero aggregate drill status

### Evidence

Observed on 2026-07-02 from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

1. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh list`

```text
index-drift
session-ambiguity
ledger-mismatch
telemetry-drift

EXIT_CODE=0
```

2. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh show index-drift`

```text
CLASS: index-drift
TRIGGER: index parity check fails or retrieval health loop reports divergence
OWNER: Engineering Lead
ESCALATION: Engineering Lead -> Operations Lead
DRILL: ./runbook.sh drill index-drift --scenario success

EXIT_CODE=0
```

3. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill index-drift --scenario success --max-attempts 3`

```text
2026-07-02T21:36:24Z | STATE | class=index-drift scenario=success max_attempts=3
2026-07-02T21:36:24Z | ACTION | class=index-drift step=detect-divergence attempt=1/3 command=node dist/memory/reindex-embeddings.js --health-check --target index
2026-07-02T21:36:24Z | WARN | class=index-drift step=detect-divergence outcome=retryable-failure
2026-07-02T21:36:24Z | ACTION | class=index-drift step=detect-divergence attempt=2/3 command=node dist/memory/reindex-embeddings.js --health-check --target index
2026-07-02T21:36:24Z | OK | class=index-drift step=detect-divergence outcome=success
2026-07-02T21:36:24Z | ACTION | class=index-drift step=rebuild-index attempt=1/3 command=node dist/memory/reindex-embeddings.js --rebuild --target index
2026-07-02T21:36:24Z | OK | class=index-drift step=rebuild-index outcome=success
2026-07-02T21:36:24Z | ACTION | class=index-drift step=verify-parity attempt=1/3 command=node dist/memory/reindex-embeddings.js --verify --target index
2026-07-02T21:36:24Z | OK | class=index-drift step=verify-parity outcome=success
{"event":"RECOVERY_COMPLETE","failure_class":"index-drift","owner":"Engineering Lead","summary":"index parity restored and verified","timestamp":"2026-07-02T21:36:24Z"}

EXIT_CODE=0
```

4. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill ledger-mismatch --scenario success --max-attempts 3`

```text
2026-07-02T21:36:24Z | STATE | class=ledger-mismatch scenario=success max_attempts=3
2026-07-02T21:36:24Z | ACTION | class=ledger-mismatch step=detect-ledger-divergence attempt=1/3 command=node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict
2026-07-02T21:36:24Z | WARN | class=ledger-mismatch step=detect-ledger-divergence outcome=retryable-failure
2026-07-02T21:36:24Z | ACTION | class=ledger-mismatch step=detect-ledger-divergence attempt=2/3 command=node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict
2026-07-02T21:36:24Z | OK | class=ledger-mismatch step=detect-ledger-divergence outcome=success
2026-07-02T21:36:24Z | ACTION | class=ledger-mismatch step=replay-ledger attempt=1/3 command=node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay
2026-07-02T21:36:24Z | OK | class=ledger-mismatch step=replay-ledger outcome=success
{"event":"RECOVERY_COMPLETE","failure_class":"ledger-mismatch","owner":"Engineering Lead","summary":"ledger replay consistency restored","timestamp":"2026-07-02T21:36:24Z"}

EXIT_CODE=0
```

5. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill telemetry-drift --scenario escalate --max-attempts 2 || true`

```text
2026-07-02T21:36:24Z | STATE | class=telemetry-drift scenario=escalate max_attempts=2
2026-07-02T21:36:24Z | ERROR | Deprecated telemetry drift runner was removed; wire a supported schema-doc parity workflow before using this remediation script

EXIT_CODE=0
```

Raw status check without `|| true` for the same degraded drill:

```text
2026-07-02T21:36:56Z | STATE | class=telemetry-drift scenario=escalate max_attempts=2
2026-07-02T21:36:56Z | ERROR | Deprecated telemetry drift runner was removed; wire a supported schema-doc parity workflow before using this remediation script

RAW_EXIT_CODE=1
```

6. `bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 2 || true`

```text
2026-07-02T21:36:24Z | STATE | class=index-drift scenario=success max_attempts=2
2026-07-02T21:36:24Z | ACTION | class=index-drift step=detect-divergence attempt=1/2 command=node dist/memory/reindex-embeddings.js --health-check --target index
2026-07-02T21:36:24Z | WARN | class=index-drift step=detect-divergence outcome=retryable-failure
2026-07-02T21:36:24Z | ACTION | class=index-drift step=detect-divergence attempt=2/2 command=node dist/memory/reindex-embeddings.js --health-check --target index
2026-07-02T21:36:24Z | OK | class=index-drift step=detect-divergence outcome=success
2026-07-02T21:36:24Z | ACTION | class=index-drift step=rebuild-index attempt=1/2 command=node dist/memory/reindex-embeddings.js --rebuild --target index
2026-07-02T21:36:24Z | OK | class=index-drift step=rebuild-index outcome=success
2026-07-02T21:36:24Z | ACTION | class=index-drift step=verify-parity attempt=1/2 command=node dist/memory/reindex-embeddings.js --verify --target index
2026-07-02T21:36:24Z | OK | class=index-drift step=verify-parity outcome=success
{"event":"RECOVERY_COMPLETE","failure_class":"index-drift","owner":"Engineering Lead","summary":"index parity restored and verified","timestamp":"2026-07-02T21:36:24Z"}
[DEPRECATED] heal-session-ambiguity.sh is deprecated. Session ambiguity is now handled by the memory-save pipeline.
2026-07-02T21:36:24Z | STATE | class=ledger-mismatch scenario=success max_attempts=2
2026-07-02T21:36:24Z | ACTION | class=ledger-mismatch step=detect-ledger-divergence attempt=1/2 command=node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict
2026-07-02T21:36:24Z | WARN | class=ledger-mismatch step=detect-ledger-divergence outcome=retryable-failure
2026-07-02T21:36:24Z | ACTION | class=ledger-mismatch step=detect-ledger-divergence attempt=2/2 command=node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict
2026-07-02T21:36:24Z | OK | class=ledger-mismatch step=detect-ledger-divergence outcome=success
2026-07-02T21:36:24Z | ACTION | class=ledger-mismatch step=replay-ledger attempt=1/2 command=node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay
2026-07-02T21:36:24Z | OK | class=ledger-mismatch step=replay-ledger outcome=success
{"event":"RECOVERY_COMPLETE","failure_class":"ledger-mismatch","owner":"Engineering Lead","summary":"ledger replay consistency restored","timestamp":"2026-07-02T21:36:24Z"}
2026-07-02T21:36:24Z | STATE | class=telemetry-drift scenario=success max_attempts=2
2026-07-02T21:36:24Z | ERROR | Deprecated telemetry drift runner was removed; wire a supported schema-doc parity workflow before using this remediation script

EXIT_CODE=0
```

Raw status check without `|| true` for the same aggregate drill:

```text
2026-07-02T21:36:56Z | STATE | class=index-drift scenario=success max_attempts=2
2026-07-02T21:36:56Z | ACTION | class=index-drift step=detect-divergence attempt=1/2 command=node dist/memory/reindex-embeddings.js --health-check --target index
2026-07-02T21:36:56Z | WARN | class=index-drift step=detect-divergence outcome=retryable-failure
2026-07-02T21:36:56Z | ACTION | class=index-drift step=detect-divergence attempt=2/2 command=node dist/memory/reindex-embeddings.js --health-check --target index
2026-07-02T21:36:56Z | OK | class=index-drift step=detect-divergence outcome=success
2026-07-02T21:36:56Z | ACTION | class=index-drift step=rebuild-index attempt=1/2 command=node dist/memory/reindex-embeddings.js --rebuild --target index
2026-07-02T21:36:56Z | OK | class=index-drift step=rebuild-index outcome=success
2026-07-02T21:36:56Z | ACTION | class=index-drift step=verify-parity attempt=1/2 command=node dist/memory/reindex-embeddings.js --verify --target index
2026-07-02T21:36:56Z | OK | class=index-drift step=verify-parity outcome=success
{"event":"RECOVERY_COMPLETE","failure_class":"index-drift","owner":"Engineering Lead","summary":"index parity restored and verified","timestamp":"2026-07-02T21:36:56Z"}
[DEPRECATED] heal-session-ambiguity.sh is deprecated. Session ambiguity is now handled by the memory-save pipeline.
2026-07-02T21:36:56Z | STATE | class=ledger-mismatch scenario=success max_attempts=2
2026-07-02T21:36:56Z | ACTION | class=ledger-mismatch step=detect-ledger-divergence attempt=1/2 command=node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict
2026-07-02T21:36:56Z | WARN | class=ledger-mismatch step=detect-ledger-divergence outcome=retryable-failure
2026-07-02T21:36:56Z | ACTION | class=ledger-mismatch step=detect-ledger-divergence attempt=2/2 command=node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict
2026-07-02T21:36:56Z | OK | class=ledger-mismatch step=detect-ledger-divergence outcome=success
2026-07-02T21:36:56Z | ACTION | class=ledger-mismatch step=replay-ledger attempt=1/2 command=node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay
2026-07-02T21:36:56Z | OK | class=ledger-mismatch step=replay-ledger outcome=success
{"event":"RECOVERY_COMPLETE","failure_class":"ledger-mismatch","owner":"Engineering Lead","summary":"ledger replay consistency restored","timestamp":"2026-07-02T21:36:56Z"}
2026-07-02T21:36:56Z | STATE | class=telemetry-drift scenario=success max_attempts=2
2026-07-02T21:36:56Z | ERROR | Deprecated telemetry drift runner was removed; wire a supported schema-doc parity workflow before using this remediation script

RAW_EXIT_CODE=1
```

### Pass / Fail

- **PASS**: listing printed four classes; metadata lookup printed `TRIGGER`, `OWNER`, `ESCALATION`, and `DRILL`; supported `index-drift` and `ledger-mismatch` drills emitted `RECOVERY_COMPLETE`; degraded `telemetry-drift` and aggregate drills returned raw non-zero status `1`.

### Failure Triage

Inspect `runbook.sh`, `ops-common.sh`, and the individual `heal-*.sh` runners if a class is missing, misrouted, or emits the wrong payload shape

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling-and-scripts/ops-self-healing-runbooks.md](../../feature_catalog/tooling-and-scripts/ops-self-healing-runbooks.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 234
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/ops-self-healing-runbooks.md`
