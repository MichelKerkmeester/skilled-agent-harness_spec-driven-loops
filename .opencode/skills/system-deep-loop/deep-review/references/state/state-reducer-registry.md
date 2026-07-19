---
title: "Deep Review State Reducer And Registry"
description: "Focused reference for reducer ownership, findings registry semantics, fail-closed behavior, and reconstruction rules."
trigger_phrases:
  - "deep review reducer registry"
  - "review findings registry"
  - "deep review reducer ownership"
  - "review state reconstruction"
importance_tier: important
contextType: implementation
version: 1.11.0.4
---

# Deep Review State Reducer And Registry

The reducer is the single writer for derived review state. Iteration agents append evidence; the reducer reconciles it into registry, dashboard, and strategy views.

---

## 1. OVERVIEW

The reducer turns append-only review evidence into the current findings registry, dashboard, and strategy state. It is the authority for derived outputs, not a second source of truth.

---

## 2. OWNERSHIP

| Surface | Writer | Rule |
|---------|--------|------|
| JSONL state | Workflow plus validated iteration append | Append-only |
| Findings registry | `scripts/reduce-state.cjs` | Regenerate from JSONL |
| Dashboard | `scripts/reduce-state.cjs` | Regenerate from registry and latest events |
| Strategy machine sections | `scripts/reduce-state.cjs` | Update from coverage and findings |
| Iteration markdown | Review iteration agent | Write-once |
| Review report | Synthesis | Final handoff |

No agent should hand-edit reducer-owned derived state as the authoritative fix. Repair JSONL or rerun the reducer.

---

## 3. FINDINGS REGISTRY

The registry groups findings into:

- Active findings.
- Resolved findings.
- Repeated findings.
- Blocked or disputed findings.
- Claim-adjudicated severity changes.

Each active finding needs severity, category, file:line evidence, finding class, content hash, first-seen iteration, and latest-seen iteration.

---

## 4. FAIL-CLOSED BEHAVIOR

The reducer must refuse to publish derived state when JSONL is corrupt in strict mode. That protects dashboards and verdict previews from silently losing findings.

Recovery order:

1. Identify the malformed JSONL line.
2. Repair or remove only the invalid appended record with an audit note.
3. Re-run the reducer.
4. Confirm registry and dashboard regenerate from the repaired log.

---

## 5. RECONSTRUCTION

When derived files are missing but JSONL and iteration markdown exist:

1. Rebuild the registry from JSONL finding details.
2. Rebuild dashboard metrics from registry and latest convergence events.
3. Rebuild strategy from completed dimensions and active findings.
4. Re-run synthesis only after reducer outputs are consistent.

If JSONL is incomplete but iteration files exist, recovery is manual and must be recorded before release readiness is claimed.

---

## 6. FINDING DEDUPLICATION

The reducer deduplicates findings at synthesis time using a two-tier match.

### Two-Tier Match

1. **PRIMARY: content_hash** = `sha256(file_path + line_range + finding_type + normalized_description_80chars)`
   - `file_path`: repo-relative path of the finding
   - `line_range`: e.g., `"42"` or `"42-56"`
   - `finding_type`: one of `security`, `correctness`, `performance`, `maintainability`, `test_quality`, `contract_safety`, `removal`
   - `normalized_description_80chars`: first 80 characters of the description, whitespace-collapsed and lowercased
2. **FALLBACK (legacy records): file:line + normalized_title** - applied when one or both records lack a `content_hash`, preserving existing behavior unchanged.

### Synthesis Behavior

When the same `content_hash` appears across iterations from different dimensions, synthesis collapses them to ONE entry with `dimensions: [<all dimensions that emitted it>]` rather than emitting multiple records. Records without `content_hash` fall back to `file:line + normalized_title`; no migration is required for existing JSONL state.

### Emission Requirement

Every finding emitted into the JSONL delta (`findingDetails[]`) MUST include a `content_hash` field computed per the two-tier match. `reduce-state.cjs` reads this field for synthesis dedup.

---

## 7. RELATED RESOURCES

- `scripts/reduce-state.cjs` is the reducer implementation.
- `references/state/state-format.md` defines state records.
- `references/state/state-outputs.md` defines operator-visible outputs.
- `references/convergence/convergence-signals.md` defines STOP fields reducer views display.
