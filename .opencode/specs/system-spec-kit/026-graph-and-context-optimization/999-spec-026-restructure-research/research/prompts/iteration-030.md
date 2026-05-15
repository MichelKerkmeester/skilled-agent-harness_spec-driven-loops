Framework: BUILD

# Iter 030 — Track 7 (stale-context detection) — consolidated delete-candidate list

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Consolidate findings from iter 027 (completed-unreferenced), iter 028 (superseded), iter 029 (orphans) into a single delete-candidate list with reason per delete.

**Steps:**

1. Read iter 027 + 028 + 029.
2. De-duplicate: a packet may appear in multiple lists; consolidate into one row with reason="completed-unreferenced + superseded" etc.
3. Per delete-candidate: rank by confidence (HIGH if multiple signals, MEDIUM if one strong signal, LOW if marginal).
4. Estimate total size reduction if all HIGH+MEDIUM deletes execute.

**Acceptance criteria per step:**

- De-duplicated list
- Per packet: reason(s) + confidence + size
- Numeric reduction calculated
- JSONL row appended

**Stop condition:** Emit iteration-030.md then exit.

**Verification:** Consolidated list. JSONL row appended.

## Research Question (scoped)

Across 026:

1. Final delete-candidate list with reason(s) + confidence per row
2. HIGH-confidence count
3. MEDIUM-confidence count
4. Total size reduction if all HIGH+MEDIUM executed

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md`

**Required heading structure:**

```
# Iter 030 — Track 7: consolidated delete-candidate list

## Question / Evidence / Findings
### Delete-candidates
| Packet | Reasons | Confidence | Size |
### Totals
- HIGH: N | MEDIUM: M | LOW: L | Combined size reduction: ~X LOC
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=7, iter_id="030".

## Context

Track 7 closes here. Feeds track 9 (target-state proposal).
