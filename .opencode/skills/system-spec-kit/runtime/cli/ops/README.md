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

`runtime/cli/ops/` contains deterministic shell runbooks for known spec-kit operational failure classes. `runbook.sh` still lists and dispatches to both registered failure classes, but neither `heal-*.sh` script currently completes a detect/repair/verify cycle: `heal-session-ambiguity.sh` is a deprecated stub that logs a deprecation notice and exits before running any step, and `heal-telemetry-drift.sh` parses and validates its options but always reports that its verifier was removed and exits with an error. Both wait on a replacement remediation path.

---

## 2. SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Class listing | `runbook.sh list` | Supported failure class keys |
| Runbook detail | `runbook.sh show <class>` | Human-readable runbook for one class |
| Drill execution | `runbook.sh drill <class|all> --scenario <success|escalate>` | Deprecation notice (`session-ambiguity`, exit 0) or a removed-verifier error (`telemetry-drift`, exit 1) |
| Healer execution | Failure class plus retry options | Currently a deprecation stub or a removed-verifier error, not a live detect/repair/verify sequence |

Registered classes are `session-ambiguity` and `telemetry-drift`; both healers are stubs pending a replacement remediation path (see Overview).

---

## 3. ENTRYPOINTS

- `runbook.sh list` prints supported failure classes.
- `runbook.sh show <class>` prints one class runbook.
- `runbook.sh drill <class|all> --scenario <success|escalate> --max-attempts <n>` runs bounded remediation drills.
- `heal-*.sh` scripts hold the class-specific detect, repair, and verify flow structure, but each currently stops before completing a cycle (see Overview).
- `ops-common.sh` provides shared retry, logging, and escalation helpers.
- `process-memory-harness.ts` captures process/RSS/swap/wired snapshots used by arc 009 memory evidence.
- `process-sweep.ts` emits dry-run plans and an `apply` result. No terminable process class is registered, so `apply` signals nothing and reports `no-terminable-class-registered`; termination returns only when a class is registered together with the ownership evidence that proves the process is this repository's to kill.

---

## 4. VALIDATION FROM REPO ROOT

Run ops validation from the repository root:

```bash
bash .opencode/skills/system-spec-kit/runtime/cli/ops/runbook.sh list
bash .opencode/skills/system-spec-kit/runtime/cli/ops/runbook.sh show session-ambiguity
bash .opencode/skills/system-spec-kit/runtime/cli/ops/runbook.sh drill all --scenario success --max-attempts 1
python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/runtime/cli/ops
```

---

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `ops-common.sh` | Shared retry, logging, option parsing, and escalation helpers |
| `heal-session-ambiguity.sh` | Deprecated stub: logs a deprecation notice and exits 0 before the retained (unreachable) detect/repair logic runs. Session ambiguity is now handled by the memory-save pipeline (`generate-context.js`). |
| `heal-telemetry-drift.sh` | Parses and validates its options, then always reports that its telemetry-drift verifier was removed and exits 1. No replacement verifier is wired yet. |
| `runbook.sh` | Class listing, runbook display, and drill orchestration |
| `process-memory-harness.ts` | Process inventory, memory snapshot and exact-identity classification helper |
| `process-sweep.ts` | Dry-run planner plus a report-only apply path; it signals nothing while no terminable class is registered |

Arc 009 lifecycle helper map:

| Surface | Helper |
| --- | --- |
| Deep loop runtime | `runtime//lib/deep-loop/loop-lock.ts`, `jsonl-repair.ts`, `atomic-state.ts` |
| Spec Kit runtime | `runtime/lib/memory/bounded-cache.ts`, `audit-rotation.ts`, `runtime/lib/runtime/timer-registry.ts`, `shutdown-hooks.ts` |
| Ops | `runtime/cli/ops/process-memory-harness.ts`, `runtime/cli/ops/process-sweep.ts` |

---

## 6. BOUNDARIES

- Ops scripts model known failure classes; they are not a general incident-management system.
- Healers must keep bounded retries and emit one escalation JSON line on retry exhaustion.
- Scripts should remain deterministic so drills and release gates are repeatable.

---

## 7. RELATED

- `../README.md`
- `../spec/README.md`
- `../../runtime/README.md`
