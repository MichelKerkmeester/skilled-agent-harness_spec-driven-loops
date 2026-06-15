---
title: "Atomic State"
description: "reduce-state.cjs writes the findings registry and markdown dashboard via atomic temp+fsync+rename, falling back to an inline implementation when the runtime TypeScript helper is unavailable."
trigger_phrases:
  - "atomic state"
  - "writeStateAtomic"
  - "writeTextAtomic"
  - "atomic write registry"
  - "fsync rename"
  - "half-written registry"
  - "loadStateSafety"
---

# Atomic State

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Writes the `findings-registry.json` and `deep-context-dashboard.md` atomically so a reader never sees a half-written file. Every write goes through a temp file that is fsynced before being renamed onto the target path.

`reduce-state.cjs` uses two complementary mechanisms: for JSON state it delegates to `writeStateAtomic` from `atomic-state.ts` (loaded via `loadStateSafety`); for the markdown dashboard it applies an identical `writeTextAtomic` implemented inline. This dual-path design ensures atomic writes even when the TypeScript runtime toolchain is unavailable.

---

## 2. HOW IT WORKS

### Runtime Helper Path

`loadStateSafety()` in `reduce-state.cjs` attempts to require the tsx CJS register and then `atomic-state.ts` at runtime. When successful, `_stateSafety.writeStateAtomic` is the runtime `writeStateAtomic` export (temp + fsync + rename). The `source` field is set to `'runtime'` in this case.

### Inline Fallback Path

When the TypeScript toolchain is unavailable, `loadStateSafety` falls back to `writeStateAtomicInline`, which mirrors the runtime contract using Node.js `fs` calls directly: write to a `.tmp.<pid>.<ts>.<random>` path, then `fs.renameSync` onto the target. The dashboard always goes through `writeTextAtomic` (the inline equivalent for text files).

### Write Sequence

At the end of `reduceContextState()`:
1. `stateSafety.writeStateAtomic(registryPath, registry)` — atomic JSON write for `findings-registry.json`
2. `writeTextAtomic(dashboardPath, dashboard)` — atomic text write for `deep-context-dashboard.md`

Both writes complete before the function returns, so the caller sees a consistent pair.

### Runtime Contract

`writeStateAtomic` in `atomic-state.ts`:
- Writes to `${targetPath}.tmp.<pid>.<ts>.<random>`
- Calls `fsyncSync(fd)` on the temp file (data durability)
- Calls `renameSync(tempPath, path)` (atomic on POSIX)
- Attempts `fsyncPath(dirname(path))` (directory-entry durability, best-effort)
- Removes the temp file on error before re-throwing

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Script | `writeTextAtomic` (inline), `writeStateAtomicInline` (fallback), `loadStateSafety` (runtime/fallback loader); calls `stateSafety.writeStateAtomic` for registry and `writeTextAtomic` for dashboard |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Shared | `writeStateAtomic` — temp+fsync+rename export loaded by `loadStateSafety` at runtime |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/07--runtime-robustness/atomic-state.md` | Manual playbook | Verifies `writeStateAtomic` and `writeTextAtomic` are present in `reduce-state.cjs`; confirms `loadStateSafety` export; confirms `atomic-state.ts` contains the temp+fsync+rename pattern |

---

## 4. SOURCE METADATA

- Group: Runtime Robustness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--runtime-robustness/atomic-state.md`

Related references:
- [jsonl-repair.md](jsonl-repair.md) — companion safety mechanism loaded by the same `loadStateSafety` call
- [reduce-state-merge.md](../05--context-report-synthesis/reduce-state-merge.md) — broader context of how `reduceContextState` uses atomic writes
