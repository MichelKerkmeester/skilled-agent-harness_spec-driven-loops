---
title: "Ops Self-Healing Scripts"
description: "Deterministic runbook helpers for spec-kit operational failure classes with bounded retry and escalation output."
trigger_phrases:
  - "ops runbook"
  - "self-healing scripts"
  - "index drift remediation"
  - "telemetry drift drill"
---

# Ops Self-Healing Scripts

## 1. OVERVIEW

`scripts/ops/` contains deterministic shell runbooks for known spec-kit operational failure classes. Each healer runs detect, repair, and verify steps with bounded retry behavior and emits a structured escalation payload when retry budget is exhausted.

## 2. SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Class listing | `runbook.sh list` | Supported failure class keys |
| Runbook detail | `runbook.sh show <class>` | Human-readable runbook for one class |
| Drill execution | `runbook.sh drill <class|all> --scenario <success|escalate>` | Success output or escalation JSON |
| Healer execution | Failure class plus retry options | Deterministic detect, repair, and verify sequence |

Supported classes are `index-drift`, `session-ambiguity`, `ledger-mismatch`, and `telemetry-drift`.

## 3. ENTRYPOINTS

- `runbook.sh list` prints supported failure classes.
- `runbook.sh show <class>` prints one class runbook.
- `runbook.sh drill <class|all> --scenario <success|escalate> --max-attempts <n>` runs bounded remediation drills.
- `heal-*.sh` scripts run class-specific detect, repair, and verify flows.
- `ops-common.sh` provides shared retry, logging, and escalation helpers.
- `process-memory-harness.ts` captures process/RSS/swap/wired snapshots used by arc 009 memory evidence.
- `process-sweep.ts` emits non-destructive termination plans from exact ownership evidence; no live apply command exists.

## 4. VALIDATION FROM REPO ROOT

Run ops validation from the repository root:

```bash
bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh list
bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh show index-drift
bash .opencode/skills/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 1
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/scripts/ops
```

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `ops-common.sh` | Shared retry, logging, option parsing, and escalation helpers |
| `heal-index-drift.sh` | Remediation workflow for index drift failures |
| `heal-session-ambiguity.sh` | Remediation workflow for session ambiguity failures |
| `heal-ledger-mismatch.sh` | Remediation workflow for ledger mismatch failures |
| `heal-telemetry-drift.sh` | Remediation workflow for telemetry drift failures |
| `runbook.sh` | Class listing, runbook display, and drill orchestration |
| `process-memory-harness.ts` | Process inventory, memory snapshot and exact-identity classification helper |
| `process-sweep.ts` | Dry-run sweep planner; emits `eligibleForTermination` evidence but never sends signals |

Arc 009 lifecycle helper map:

| Surface | Helper |
| --- | --- |
| Deep loop runtime | `deep-loop-runtime/lib/deep-loop/loop-lock.ts`, `jsonl-repair.ts`, `atomic-state.ts` |
| Code Graph | `system-code-graph/mcp_server/lib/owner-lease.ts`, `canonical-db-dir.ts`, `close-db-assertion.ts` |
| Spec Kit runtime | `mcp_server/lib/memory/bounded-cache.ts`, `audit-rotation.ts`, `mcp_server/lib/runtime/timer-registry.ts`, `shutdown-hooks.ts` |
| Ops | `scripts/ops/process-memory-harness.ts`, `scripts/ops/process-sweep.ts` |

## 6. BOUNDARIES

- Ops scripts model known failure classes; they are not a general incident-management system.
- Healers must keep bounded retries and emit one escalation JSON line on retry exhaustion.
- Scripts should remain deterministic so drills and release gates are repeatable.

## 7. RELATED

- `../README.md`
- `../spec/README.md`
- `../../mcp_server/README.md`
