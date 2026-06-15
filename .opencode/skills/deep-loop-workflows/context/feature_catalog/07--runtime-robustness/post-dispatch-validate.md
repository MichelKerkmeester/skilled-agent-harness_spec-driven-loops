---
title: "Post-Dispatch Validate (Seat Validation)"
description: "reduce-state.cjs validates each seat finding before merge using validateSeatFinding: known kind, at least one of path/symbol, and numeric relevance when present. Invalid findings are surfaced in registry.seatValidationWarnings rather than silently merged."
trigger_phrases:
  - "post-dispatch validate"
  - "validateSeatFinding"
  - "seatValidationWarnings"
  - "seat finding validation"
  - "invalid finding"
  - "unknown kind"
  - "missing path symbol"
---

# Post-Dispatch Validate (Seat Validation)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Before merging seat findings into the registry, `reduce-state.cjs` validates each raw finding against a minimal structural contract: known `kind`, at least one of `path` or `symbol`, and a numeric `relevance` when present. Findings that fail validation are captured in `registry.seatValidationWarnings` rather than silently dropped or merged.

This mirrors the runtime `post-dispatch-validate` discipline applied in the mature deep-loop runtime for iteration-level outputs, adapted for context-loop seat findings.

---

## 2. HOW IT WORKS

### Validation Contract

`validateSeatFinding(raw)` applies three checks:
1. **Known kind** — `raw.kind` (normalized to lowercase, defaulting to `'reuse_candidate'`) must exist in `VALID_FINDING_KINDS` (the set of keys from `KIND_TO_BUCKET`).
2. **Path or symbol** — at least one of `raw.path` or `raw.symbol` must be non-empty after normalization.
3. **Numeric relevance** — when `raw.relevance` is non-null, it must be `Number.isFinite(Number(raw.relevance))`.

Returns `null` on a valid finding or a non-empty reason string on failure.

### Integration Point

`validateSeatFinding` is called inside `loadSeatFindings` for every raw finding read from a seat's `iter-{NNN}/*.json` file:

```
const reason = validateSeatFinding(raw);
if (reason) {
  validationWarnings.push({ seat: label, reason, symbol, path });
  continue; // invalid finding skipped — never merged
}
findings.push({ ...raw, producedBy: label });
```

`collectAllSeatFindings` aggregates warnings across all iterations and returns them in `validationWarnings`.

### Registry Surface

`registry.seatValidationWarnings` is set to the accumulated list before `reduceContextState` writes the registry. The count also appears in the per-run summary:

```
seatValidationWarnings: result.seatValidationWarnings.length,
```

### Runtime Counterpart

The runtime `post-dispatch-validate.ts` module provides the full iteration-level validation contract (JSONL state-log checks, iteration-file presence, required-field verification) used by the mature deep-review and deep-research loops. The context-loop's `validateSeatFinding` is a scoped analog for the finding level.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` | Script | `validateSeatFinding` (finding-level validator), `loadSeatFindings` (caller), `collectAllSeatFindings` (aggregator); `registry.seatValidationWarnings` surface |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Shared | `validateIterationOutputs`, `validateOrThrow` — full iteration-level runtime counterpart; `PostDispatchValidationError` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/07--runtime-robustness/post-dispatch-validate.md` | Manual playbook | Verifies `validateSeatFinding` and `seatValidationWarnings` are present in `reduce-state.cjs` |

---

## 4. SOURCE METADATA

- Group: Runtime Robustness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--runtime-robustness/post-dispatch-validate.md`

Related references:
- [finding-dedup-by-symbol.md](../03--agreement-merge/finding-dedup-by-symbol.md) — only validated findings reach the dedup/agreement layer
- [reduce-state-merge.md](../05--context-report-synthesis/reduce-state-merge.md) — broader `reduceContextState` flow within which validation runs
