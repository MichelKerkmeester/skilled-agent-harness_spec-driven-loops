---
title: "233 -- Completion Verification Workflow"
description: "This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses."
version: 3.6.0.12
---

# 233 -- Completion Verification Workflow

## 1. OVERVIEW

This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm advisory handling, COMPLETE status, and evidence-aware blocking for `check-completion.sh`.
- Real user request: `Please validate Completion Verification Workflow against the documented validation surface and tell me whether the expected signals are present: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status.`
- Prompt: `Validate Completion Verification Workflow against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if advisory, COMPLETE, and blocking outcomes match the fixture state and exit codes remain consistent with the script contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate Completion Verification Workflow against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1`
2. `bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
3. `TMP_DIR="$(mktemp -d /tmp/speckit-completion-XXXXXX)"`
4. `cp -R .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 "$TMP_DIR/level3-missing-evidence"`
5. `perl -0pi -e 's/ \\[EVIDENCE:[^\\n]+\\]//' "$TMP_DIR/level3-missing-evidence/checklist.md"`
6. `bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --json || true`
7. `bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --strict || true`

### Expected

Level 1 fixture returns advisory exit 0; compliant Level 3 fixture reports COMPLETE; degraded fixture reports blocking status such as EVIDENCE_MISSING or another non-pass status with non-zero exit

### Evidence

Command 1:

```text
$ bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1
⚠ No checklist.md found in .opencode/skills/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1
  This may be a Level 1 spec (checklist not required).
  Create checklist.md for Level 2+ enforcement.
EXIT_CODE=0
```

Command 2:

```json
{
  "folder": ".opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3",
  "status": "EVIDENCE_MISSING",
  "passed": false,
  "strict": false,
  "summary": {
    "total": 36,
    "completed": 36,
    "percentage": 100
  },
  "priorities": {
    "p0": { "total": 12, "completed": 12 },
    "p1": { "total": 20, "completed": 20 },
    "p2": { "total": 4, "completed": 4 },
    "untagged": { "total": 0, "completed": 0 }
  },
  "qualityGates": {
    "priorityContextMissing": 0,
    "p0MissingEvidence": 12,
    "p1MissingEvidence": 20
  }
}
EXIT_CODE=1
```

Commands 3-7 and temp fixture evidence:

```text
TMP_DIR=/tmp/speckit-completion-tl1LPK
JSON_AS_WRITTEN:
{
  "folder": "/tmp/speckit-completion-tl1LPK/level3-missing-evidence",
  "status": "EVIDENCE_MISSING",
  "passed": false,
  "strict": false,
  "summary": {
    "total": 36,
    "completed": 36,
    "percentage": 100
  },
  "priorities": {
    "p0": { "total": 12, "completed": 12 },
    "p1": { "total": 20, "completed": 20 },
    "p2": { "total": 4, "completed": 4 },
    "untagged": { "total": 0, "completed": 0 }
  },
  "qualityGates": {
    "priorityContextMissing": 0,
    "p0MissingEvidence": 12,
    "p1MissingEvidence": 20
  }
}
JSON_AS_WRITTEN_EXIT_CODE=0
JSON_DIRECT_EXIT_CHECK:
{
  "folder": "/tmp/speckit-completion-tl1LPK/level3-missing-evidence",
  "status": "EVIDENCE_MISSING",
  "passed": false,
  "strict": false,
  "summary": {
    "total": 36,
    "completed": 36,
    "percentage": 100
  },
  "priorities": {
    "p0": { "total": 12, "completed": 12 },
    "p1": { "total": 20, "completed": 20 },
    "p2": { "total": 4, "completed": 4 },
    "untagged": { "total": 0, "completed": 0 }
  },
  "qualityGates": {
    "priorityContextMissing": 0,
    "p0MissingEvidence": 12,
    "p1MissingEvidence": 20
  }
}
JSON_DIRECT_EXIT_CODE=1
STRICT_AS_WRITTEN:

───────────────────────────────────────────────────────────────

  Checklist Completion Check
───────────────────────────────────────────────────────────────


  Folder: /tmp/speckit-completion-tl1LPK/level3-missing-evidence
  Mode:   Strict (P2 required)

───────────────────────────────────────────────────────────────


  Priority Breakdown:
    ✓ [P0] Critical: 12/12 complete
    ✓ [P1] High: 20/20 complete
    ✓ [P2] Medium: 4/4 complete
    ✓ Priority context present for all checklist items

───────────────────────────────────────────────────────────────


  Summary: 36/36 items (100%)

  RESULT: BLOCKED

STRICT_AS_WRITTEN_EXIT_CODE=0
STRICT_DIRECT_EXIT_CHECK:
    ✗ Evidence on completed P0/P1: missing on 32 item(s) (BLOCKING)
  Completed P0/P1 items are missing evidence markers. Add [EVIDENCE:] before claiming completion.

───────────────────────────────────────────────────────────────

  Checklist Completion Check
───────────────────────────────────────────────────────────────


  Folder: /tmp/speckit-completion-tl1LPK/level3-missing-evidence
  Mode:   Strict (P2 required)

───────────────────────────────────────────────────────────────


  Priority Breakdown:
    ✓ [P0] Critical: 12/12 complete
    ✓ [P1] High: 20/20 complete
    ✓ [P2] Medium: 4/4 complete
    ✓ Priority context present for all checklist items

───────────────────────────────────────────────────────────────


  Summary: 36/36 items (100%)

  RESULT: BLOCKED

STRICT_DIRECT_EXIT_CODE=1
DIFF_EXIT_CHECK:
    ✗ Evidence on completed P0/P1: missing on 32 item(s) (BLOCKING)
  Completed P0/P1 items are missing evidence markers. Add [EVIDENCE:] before claiming completion.
DIFF_EXIT_CODE=0
```

Additional fixture check:

```text
$ grep EVIDENCE .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3/checklist.md
No files found
```

The expected `COMPLETE` signal for the compliant Level 3 fixture was not present. The fixture already lacks `[EVIDENCE:...]` markers, so the perl degradation command produced no checklist diff (`DIFF_EXIT_CODE=0`) and both compliant and degraded Level 3 checks reported `EVIDENCE_MISSING`.

### Pass / Fail

- **Fail**: The lightweight fixture returned advisory exit 0, but the compliant Level 3 fixture returned `status: "EVIDENCE_MISSING"`, `passed: false`, and `EXIT_CODE=1` instead of reporting `COMPLETE`; the pass condition is not met.

### Failure Triage

Inspect `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh`, especially checklist parsing, inherited priority logic, and evidence marker detection

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/completion-verification-workflow.md](../../feature_catalog/16--tooling-and-scripts/completion-verification-workflow.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 233
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/completion-verification-workflow.md`
