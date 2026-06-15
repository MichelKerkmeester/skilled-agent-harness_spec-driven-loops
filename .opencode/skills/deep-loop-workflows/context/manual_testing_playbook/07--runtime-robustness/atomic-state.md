---
title: "RUNTIME-001 -- Atomic State"
description: "This scenario validates Atomic State for `RUNTIME-001`. It focuses on `writeStateAtomic` and `writeTextAtomic` being present in `reduce-state.cjs`, the `loadStateSafety` export, and the temp+fsync+rename pattern in `atomic-state.ts`."
---

# RUNTIME-001 -- Atomic State

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RUNTIME-001`.

---

## 1. OVERVIEW

This scenario validates Atomic State for `RUNTIME-001`. It focuses on `reduce-state.cjs` implementing the atomic temp+fsync+rename write pattern for both `findings-registry.json` (via the runtime `writeStateAtomic` loaded by `loadStateSafety`) and `deep-context-dashboard.md` (via the inline `writeTextAtomic`). Both paths prevent readers from ever observing a half-written output file.

### Why This Matters

The findings registry and dashboard are written at the end of every `reduceContextState` call. A mid-write crash without atomic writes would leave downstream readers (report assembly, convergence check) with a truncated or partially updated JSON file, silently corrupting the agreement metrics. Verifying the atomic-write path prevents silent corruption that would only manifest as wrong convergence decisions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RUNTIME-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `reduce-state.cjs` implements atomic writes for both the registry and dashboard, and that `atomic-state.ts` exports `writeStateAtomic` with the temp+fsync+rename pattern.
- Real user request: `Verify that the deep-context state reducer writes the registry and dashboard atomically to prevent half-written files.`
- Prompt: `As a manual-testing orchestrator, validate the atomic-state write contract for deep-context against reduce-state.cjs and the runtime atomic-state.ts module. Verify writeStateAtomic and writeTextAtomic are present in reduce-state.cjs; loadStateSafety is exported; atomic-state.ts exports writeStateAtomic with temp+fsync+rename. Return a concise verdict.`
- Expected execution process: Run `node --check` on reduce-state.cjs; grep for `writeStateAtomic`, `writeTextAtomic`, and `loadStateSafety` in reduce-state.cjs; grep for `writeStateAtomic` export and `fsyncSync|renameSync` in atomic-state.ts.
- Expected signals: `node --check` exits 0; `writeStateAtomic` and `writeTextAtomic` found in reduce-state.cjs; `loadStateSafety` exported from reduce-state.cjs; `export function writeStateAtomic` found in atomic-state.ts; `fsyncSync` and `renameSync` appear in atomic-state.ts.
- Desired user-visible outcome: The registry and dashboard are always written atomically, so a crash between iterations never leaves a corrupt file visible to downstream readers.
- Pass/fail: PASS if `node --check` exits 0 and all grep checks return the expected tokens; FAIL if the syntax check fails or any atomic-write symbol is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; run syntax check and grep both files.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RUNTIME-001 | Atomic State | Verify atomic write pattern in reduce-state.cjs and atomic-state.ts | `Verify that the deep-context state reducer writes the registry and dashboard atomically to prevent half-written files.` | 1. `node --check .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 2. `rg "writeStateAtomic\|writeTextAtomic" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 3. `rg "loadStateSafety" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 4. `rg "export function writeStateAtomic" .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` -> 5. `rg "fsyncSync\|renameSync" .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Step 1: exits 0; Step 2: both writeStateAtomic and writeTextAtomic found; Step 3: loadStateSafety found; Step 4: export found; Step 5: both fsync and rename found | Exit code from step 1; grep outputs from steps 2-5 | PASS if step 1 exits 0 and steps 2-5 all return expected tokens; FAIL if syntax check fails or any atomic-write symbol is absent | 1. Confirm `loadStateSafety` is in `module.exports` at the bottom of reduce-state.cjs. 2. Check that `writeStateAtomicInline` (inline fallback) also exists for the no-tsx path. 3. Confirm `atomic-state.ts` uses `makeTempPath` before `writeFileSync` to ensure the write targets a temp path. |

### Optional Supplemental Checks

Verify the inline fallback `writeStateAtomicInline` is present (used when tsx toolchain is unavailable):

```bash
rg "writeStateAtomicInline" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs
```

Verify `loadStateSafety` returns an object with both `writeStateAtomic` and `repairJsonlTail` fields:

```bash
rg "writeStateAtomic.*repairJsonlTail\|repairJsonlTail.*writeStateAtomic\|_stateSafety" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--runtime-robustness/atomic-state.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` | `writeTextAtomic`, `writeStateAtomicInline`, `loadStateSafety`, `reduceContextState` — all atomic write paths |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | `writeStateAtomic` — temp+fsync+rename runtime export loaded by `loadStateSafety` |

---

## 5. SOURCE METADATA

- Group: Runtime Robustness
- Playbook ID: RUNTIME-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-robustness/atomic-state.md`
