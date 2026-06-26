---
title: "DAC-025 -- Derived projection rebuilds from artifacts"
description: "This scenario validates that deleting `council-graph.sqlite` rows for a session and replaying upserts from `ai-council/**` artifacts restores graph state without touching the artifacts. Anchors to ADR-001 derived-projection contract and checklist CHK-028."
version: 2.3.0.11
---

# DAC-025 -- Derived projection rebuilds from artifacts

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-025`.

---

## 1. OVERVIEW

This scenario validates the derived-projection contract: council graph rows can be deleted (scoped to one `(specFolder, sessionId)`) and rebuilt by replaying upserts from packet-local `ai-council/**` artifacts. The artifacts remain authoritative throughout — they are never read-modified during recovery.

### Why This Matters

ADR-001 explicitly chose a derived projection over deep-loop graph reuse precisely so council audit history (in `ai-council-state.jsonl` and packet artifacts) stays append-only and trustworthy. Without an exercised replay path, the derived contract is asserted by docs only. This scenario proves the path works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-025` and confirm the expected signals without contradictory evidence.

- Objective: Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts.
- Real user request: Wipe the council graph for one session and rebuild it from the council artifacts; confirm artifacts are untouched.
- Prompt: `As a council-graph integration validator, capture pre-deletion graph counts, delete derived rows for one (specFolder, sessionId), replay upserts from ai-council/** artifacts, then assert post-rebuild counts match and artifacts were never modified.`
- Expected execution process: Snapshot `runtime status CLI` counts + `ai-council/**` artifact mtimes for one session; delete the session's derived rows (via SQL or scripted helper); replay upserts from the artifact tree; re-run status; compare.
- Expected signals: Post-rebuild counts equal pre-deletion counts; `ai-council/**` artifact mtimes unchanged; no error during replay.
- Desired user-visible outcome: The user sees that derived state is fully replayable from artifacts and that artifacts are append-only.
- Pass/fail: PASS if rebuild matches and artifacts untouched; FAIL if counts diverge or any artifact mtime changes.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a healthy session with persisted artifacts (e.g., `specFolder='sandbox/dac-025', sessionId='dac-025-run-01'`); confirm `ai-council/ai-council-state.jsonl` exists with rows.
2. Snapshot `runtime status CLI` counts.
3. Snapshot artifact mtimes: `bash: stat -f '%m %N' <spec-folder>**/*`.
4. Delete derived rows scoped to `(sandbox/dac-025, dac-025-run-01)` via direct SQL or `runtime status CLI` `recovery` payload guidance.
5. Replay upserts with `node .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs --spec-folder <spec-folder> --session-id dac-025-run-01`, then pipe the emitted payload to `runtime upsert CLI`.
6. Re-run `runtime status CLI`; compare counts to step 2.
7. Re-snapshot artifact mtimes; compare to step 3.

### Prompt

`As a council-graph integration validator, capture pre-deletion graph counts, delete derived rows for one (specFolder, sessionId), replay upserts from ai-council/** artifacts, then assert post-rebuild counts match and artifacts were never modified.`

### Commands

1. `tool: runtime status CLI({ specFolder: 'sandbox/dac-025', sessionId: 'dac-025-run-01' })`
2. `bash: stat -f '%m %N' <spec-folder>**/* | sort > /tmp/dac-025-pre-mtimes.txt`
3. `bash: # delete derived rows scoped to namespace (helper script or direct SQL per recovery payload guidance)`
4. `bash: node .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs --spec-folder <spec-folder> --session-id dac-025-run-01 > /tmp/dac-025-upsert.json`
5. `tool: runtime status CLI({ specFolder: 'sandbox/dac-025', sessionId: 'dac-025-run-01' })`
6. `bash: stat -f '%m %N' <spec-folder>**/* | sort > /tmp/dac-025-post-mtimes.txt`
7. `bash: diff /tmp/dac-025-pre-mtimes.txt /tmp/dac-025-post-mtimes.txt`

### Expected

Step 5 status counts equal step 1 counts. Step 7 diff returns no differences (artifacts untouched).

### Evidence

Capture pre/post status responses, the two mtime snapshots, and the diff result.

### Pass / Fail

- **Pass**: Counts match exactly; artifact mtimes unchanged.
- **Fail**: Counts diverge after replay; any artifact mtime changes during replay.

### Failure Triage

If counts diverge, inspect the replay loop for missing event types or out-of-order processing. If artifact mtimes change, the replay path or upsert handler is incorrectly writing back into `ai-council/**` — inspect `scripts/upsert.cjs` and the replay helper for write boundaries.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-025 | Derived projection rebuilds from artifacts | Verify replay restores graph state and never modifies artifacts | `As a council-graph integration validator, capture pre-deletion graph counts, delete derived rows for one (specFolder, sessionId), replay upserts from ai-council/** artifacts, then assert post-rebuild counts match and artifacts were never modified.` | status -> mtime snap -> delete -> replay -> status -> mtime snap -> diff | Counts match; artifact mtimes unchanged | 2 status responses + 2 mtime snapshots + diff | PASS if counts match and artifacts untouched | Inspect replay loop + upsert write boundaries |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| Internal design notes | ADR-001 derived-projection contract |
| Internal design notes | CHK-028 rollback path |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/graph_support.md` §5 | Recovery and rollback contract |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Namespace-scoped delete + upsert |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md`
