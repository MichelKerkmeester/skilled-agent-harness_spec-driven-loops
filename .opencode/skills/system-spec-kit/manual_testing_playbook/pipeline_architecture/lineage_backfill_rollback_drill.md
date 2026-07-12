---
title: "130 -- Lineage backfill rollback drill"
description: "This scenario validates Lineage backfill rollback drill for `130`. It focuses on Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout."
audited_post_018: true
version: 3.6.0.17
---

# 130 -- Lineage backfill rollback drill

## 1. OVERVIEW

This scenario validates Lineage backfill rollback drill for `130`. It focuses on Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout.

---

## 2. SCENARIO CONTRACT


- Objective: Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout.
- Real user request: `Please validate Lineage backfill rollback drill against cd .opencode/skills/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback.`
- Prompt: `Validate the lineage backfill rollback drill in the MCP server and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `memory-lineage-backfill.vitest.ts` completes with all tests passing and shows both execution and rollback evidence

---

## 3. TEST EXECUTION

### Prompt

```
Validate the lineage backfill rollback drill in the MCP server and return pass/fail with cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server`
2. `npm test -- --run tests/memory-lineage-backfill.vitest.ts`
3. Inspect the output for dry-run counts, successful execution, zero-change rerun, and post-restore empty lineage tables

### Expected

Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
npm test -- --run tests/memory-lineage-backfill.vitest.ts
```

Observed transcript:

```text
> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/memory-lineage-backfill.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

{
  "drill": "lineage-backfill-rollback",
  "checkpointCreated": {
    "ok": true,
    "schemaVersion": 41,
    "sizeBytes": 581632
  },
  "dryRunPlan": {
    "dryRun": true,
    "totalGroups": 2,
    "scanned": 3,
    "seeded": 3,
    "skipped": 0,
    "lineageRowsBeforeBackfill": 0
  },
  "appliedBackfill": {
    "dryRun": false,
    "seeded": 3,
    "skipped": 0,
    "lineageRowsAfterBackfill": 3,
    "activeMemoryId": 2,
    "activeVersionNumber": 2,
    "transitionCounts": {
      "CREATE": 0,
      "UPDATE": 0,
      "SUPERSEDE": 0,
      "BACKFILL": 2
    }
  },
  "idempotentRerun": {
    "seeded": 0,
    "skipped": 3
  },
  "postRestore": {
    "lineageRows": 0,
    "activeProjectionRows": 0
  }
}

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  13:10:20
   Duration  592ms (transform 334ms, setup 18ms, import 439ms, tests 61ms, environment 0ms)
```

The transcript shows the targeted suite passed and captures the dry-run plan counts, successful backfill application, idempotent rerun/zero-change rerun, and checkpoint restore rollback/post-restore empty lineage tables.

### Pass / Fail

- **Verdict**: PASS
- **Reason**: `memory-lineage-backfill.vitest.ts` completed with all tests passing and the observed transcript shows dry-run planning (`seeded: 3`, `skipped: 0`), applied backfill (`lineageRowsAfterBackfill: 3`), idempotent rerun (`seeded: 0`, `skipped: 3`), and checkpoint restore rollback (`lineageRows: 0`, `activeProjectionRows: 0`).

### Failure Triage

If this scenario regresses, re-run `npm test -- --run tests/memory-lineage-backfill.vitest.ts -t rollback`; inspect `lib/storage/lineage-state.ts` and `scripts/migrations/*checkpoint*.ts` if backfill or restore assertions drift.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md](../../feature_catalog/pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 130
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/lineage_backfill_rollback_drill.md`
