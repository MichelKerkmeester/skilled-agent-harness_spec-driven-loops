---
title: "Ops Helpers"
description: "Process inventory and sweep helpers for the spec-kit runtime, plus the one-time grep-convention retrofit."
trigger_phrases:
  - "ops helpers"
  - "process sweep"
  - "memory harness"
  - "grep convention retrofit"
---

# Ops Helpers

## 1. OVERVIEW

`runtime/cli/ops/` holds the maintenance tools that are not part of a save or a validation: the process inventory and sweep helpers the session-cleanup plugin calls, and the manifest-frozen retrofit that applied the grep convention across the corpus. The self-healing runbook that used to live here shipped two healers that never completed a cycle, one a deprecation stub and one whose verifier had been removed, so the runbook, both healers and their shared helper were retired rather than left as a drill that could only report their absence.

---

## 2. SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Process inventory | `process-memory-harness.ts` | Process, RSS, swap and wired snapshots with exact-identity classification |
| Process sweep | `process-sweep.ts` with `dry-run` or `apply` | A plan, or `no-terminable-class-registered` while no class is registered |
| Grep-convention retrofit | `retrofit-convention.mjs enumerate|dry-run|process|rescan` | A frozen manifest, a dry-run report, rewritten documents, a rescan report |

---

## 3. ENTRYPOINTS

- `retrofit-convention.mjs enumerate|dry-run|process|rescan` is the one-time grep-convention retrofit over the spec corpus. Each stage reads the manifest `enumerate` froze, so `process` never sees a document that changed after enumeration. It imports `../retrieval/lib/` and `../retrieval/rg-wrapper.mjs`; run it from the repository root.
- `process-memory-harness.ts` captures process/RSS/swap/wired snapshots used by arc 009 memory evidence.
- `process-sweep.ts` emits dry-run plans and an `apply` result. No terminable process class is registered, so `apply` signals nothing and reports `no-terminable-class-registered`; termination returns only when a class is registered together with the ownership evidence that proves the process is this repository's to kill.

---

## 4. VALIDATION FROM REPO ROOT

Run ops validation from the repository root:

```bash
npx tsx .opencode/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts dry-run
node .opencode/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs --help
python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/runtime/cli/ops
```

---

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `retrofit-convention.mjs` | Manifest-frozen enumerate/dry-run/process/rescan pipeline that applied the grep convention across the corpus once; kept for a repeat run, not for lookup time |
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

- Ops scripts are maintenance tools, not a general incident-management system.
- The sweep terminates nothing until a process class is registered with ownership evidence.
- Scripts stay deterministic so a rerun reproduces the same report.

---

## 7. RELATED

- `../README.md`
- `../spec/README.md`
- `../../runtime/README.md`
