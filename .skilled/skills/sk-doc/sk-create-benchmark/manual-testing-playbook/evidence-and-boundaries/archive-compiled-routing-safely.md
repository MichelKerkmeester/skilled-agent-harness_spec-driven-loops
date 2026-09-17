---
title: "BMR-006 -- Archive compiled-routing evidence safely"
description: "This scenario validates compiled-routing evidence capture for BMR-006. Serving snapshots use the V1 schema and archives fail closed on collisions, shadow candidates and manifest changes."
version: 1.5.0.3
---

# BMR-006 -- Archive compiled-routing evidence safely

This document captures the operator contract for durable compiled-routing evidence.

## 1. OVERVIEW

This scenario validates compiled-routing evidence capture for `BMR-006`. It focuses on the exact serving snapshot schema and the archive safety boundary.

### Why This Matters

Live serving state is spread across an activation manifest, flag state, fence state and parity anchors. The serving snapshot joins that state into a fixed V1 object. The archive path must also refuse collisions and shadow candidates so evidence cannot be attributed to the wrong serving decision.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-006` and confirm the expected safety checks.

- Objective: capture or validate serving state and archive a compiled-routing report without overwriting evidence
- Realistic user request: `Archive the compiled-routing parity result for this hub. Keep the evidence portable and do not replace an existing run.`
- Prompt: `Validate the hub's serving snapshot and archive this compiled-routing parity report. Refuse an occupied label, a shadow candidate or a manifest that changes during the archive.`
- Expected execution process: `references/skill-benchmark/serving-snapshot-schema.md` is read, the V1 fields and repo-relative paths are checked, the active manifest is used and the archive command is run with a new label.
- Expected signals: the snapshot contains `schemaVersion`, `hubId`, `capturedAt`, `flag`, `manifest`, `liveConfigHash`, `freshness`, `engineResolverPath`, `parityBaseline` and `realModelLast`. The archive refuses a duplicate, shadow candidate or digest change.
- Desired user-visible outcome: a portable report pair with a fail-closed archive decision.
- Pass/fail: PASS if the active manifest, schema fields and refusal cases are evidenced. FAIL if an archive overwrites a label, stores an absolute root path or accepts a shadow candidate.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Validate the hub's serving snapshot and archive this compiled-routing parity report. Refuse an occupied label, a shadow candidate or a manifest that changes during the archive.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-006 | Archive compiled-routing evidence safely | Validate the V1 snapshot and fail closed on archive hazards | `Validate the hub's serving snapshot and archive this compiled-routing parity report. Refuse an occupied label, a shadow candidate or a manifest that changes during the archive.` | 1. `agent: Read references/skill-benchmark/serving-snapshot-schema.md sections 2 through 4` -> 2. `bash: node .opencode/skills/sk-doc/sk-create-benchmark/scripts/render-serving-snapshot.cjs --hub sk-code --validate` -> 3. `agent: List the archive refusal cases and portable provenance fields` -> 4. `bash: node .opencode/skills/sk-doc/sk-create-benchmark/scripts/archive-compiled-routing.cjs --help` | Step 1 lists the fixed V1 fields. Step 2 validates or reports the hub snapshot. Step 3 names collision, shadow-candidate and manifest-digest refusal plus `rootRel`. Step 4 exits 0 and shows required archive arguments | Exact prompt, schema fields, validation output and exit status, refusal list, provenance fields and help output | PASS if the active manifest and fail-closed rules are explicit. FAIL if absolute checkout paths are accepted or an occupied label can be overwritten | 1. Confirm the active manifest is the source. 2. Check `rootRel` replaces an absolute root. 3. Re-read the collision and shadow-candidate rules |

### Commands

1. `agent: Read references/skill-benchmark/serving-snapshot-schema.md sections 2 through 4`
2. `bash: node .opencode/skills/sk-doc/sk-create-benchmark/scripts/render-serving-snapshot.cjs --hub sk-code --validate`
3. `agent: List the archive refusal cases and portable provenance fields`
4. `bash: node .opencode/skills/sk-doc/sk-create-benchmark/scripts/archive-compiled-routing.cjs --help`

### Expected

The V1 snapshot has exactly the fields named in the schema. Validation reads the active manifest. Archive labels are additive and fail closed if occupied. A shadow-candidate source is refused. Manifest changes between reads abort the archive. Archived provenance uses repo-relative paths.

### Evidence

Capture the prompt, schema field list, validation transcript and exit status, archive help output and the refusal and provenance statements.

### Pass / Fail

- **Pass**: the run validates the active serving state and preserves archive integrity and portable provenance.
- **Fail**: an existing label is overwritten, a shadow candidate is archived or an absolute checkout path is retained as the portable root.

### Failure Triage

1. Check the manifest source and the second read before archive commit.
2. Confirm the label collision rule is fail closed.
3. Confirm the shadow-candidate refusal.
4. Inspect provenance for `rootRel` and remove absolute checkout paths.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/skill-benchmark/serving-snapshot-schema.md`](../../references/skill-benchmark/serving-snapshot-schema.md) | Snapshot schema and archive rules |
| [`scripts/render-serving-snapshot.cjs`](../../scripts/render-serving-snapshot.cjs) | Snapshot validation command |
| [`scripts/archive-compiled-routing.cjs`](../../scripts/archive-compiled-routing.cjs) | Fail-closed archive command |

---

## 5. SOURCE METADATA

- Group: EVIDENCE AND BOUNDARIES
- Playbook ID: BMR-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `evidence-and-boundaries/archive-compiled-routing-safely.md`
