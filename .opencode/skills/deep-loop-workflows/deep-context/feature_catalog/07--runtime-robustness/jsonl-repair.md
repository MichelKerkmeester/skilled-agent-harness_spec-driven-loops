---
title: "JSONL Repair"
description: "reduce-state.cjs runs repairJsonlTail on the state log before reading it, truncating any trailing malformed content caused by a mid-write crash and recording the outcome in registry.stateLogRepair."
trigger_phrases:
  - "jsonl repair"
  - "repairJsonlTail"
  - "stateLogRepair"
  - "truncate malformed jsonl"
  - "droppedBytes"
  - "partial write recovery"
  - "jsonl tail truncation"
version: 1.2.0.3
---

# JSONL Repair

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Before reading the append-only state log, `reduce-state.cjs` repairs any trailing malformed content caused by a mid-write crash, ensuring that the reducer always operates on valid JSONL.

`repairJsonlTail` scans the state log from the beginning, keeping all complete valid JSON lines, and truncates anything after the last valid record. The repair outcome (`repaired`, `droppedBytes`) is captured in `registry.stateLogRepair` so operators know whether and how much data was trimmed.

---

## 2. HOW IT WORKS

### Repair Invocation

Inside `reduceContextState()`, `loadStateSafety()` is called first to obtain the repair helper. The returned `stateSafety.repairJsonlTail` is then invoked on `stateLogPath` before the state log is read:

```
const stateLogRepair = stateSafety.repairJsonlTail(stateLogPath);
```

This call is idempotent: if the file is already clean, it returns `{ repaired: false, droppedBytes: 0 }` without modifying the file.

### Inline Fallback

When the TypeScript toolchain is unavailable, `loadStateSafety` uses `repairJsonlTailInline`, which implements the same scan-and-truncate algorithm in pure Node.js CJS.

### Runtime Contract

`repairJsonlTail` in `jsonl-repair.ts`:
- Returns early if the file does not exist or is empty
- Calls `validPrefixByteLength(content)` to find the byte offset of the last valid newline-terminated JSON record
- If `droppedBytes > 0`, truncates the file with `truncateSync(path, keepBytes)`
- Returns `{ repaired: boolean, droppedBytes: number }`

### Registry Surface

`registry.stateLogRepair` is set to the repair result and flows into the final return value of `reduceContextState`. It also appears in the per-run summary emitted to the caller:

```
stateLogRepaired: result.stateLogRepair.repaired,
stateLogDroppedBytes: result.stateLogRepair.droppedBytes,
```

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Script | `repairJsonlTailInline` (fallback), `loadStateSafety` (loader); invokes `stateSafety.repairJsonlTail` before state-log read; sets `registry.stateLogRepair` |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Shared | `repairJsonlTail` — scan + truncate export; `JsonlRepairResult` type; `appendJsonlRecord` helper |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/07--runtime-robustness/jsonl-repair.md` | Manual playbook | Verifies `repairJsonlTail` and `stateLogRepair` are present in `reduce-state.cjs`; confirms the inline fallback is also present |

---

## 4. SOURCE METADATA

- Group: Runtime Robustness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--runtime-robustness/jsonl-repair.md`

Related references:
- [atomic-state.md](atomic-state.md) — loaded by the same `loadStateSafety` call as `repairJsonlTail`
- [reduce-state-merge.md](../05--context-report-synthesis/reduce-state-merge.md) — broader `reduceContextState` flow that invokes repair before reading
