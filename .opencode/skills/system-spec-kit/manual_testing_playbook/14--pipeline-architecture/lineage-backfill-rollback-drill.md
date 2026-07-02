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


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:01:00
   Duration  481ms (transform 272ms, setup 14ms, import 353ms, tests 50ms, environment 0ms)
```

The transcript shows the targeted suite passed, but it does not show dry-run plan counts, successful backfill application, idempotent rerun/zero-change rerun, or checkpoint restore rollback/post-restore empty lineage tables.

### Pass / Fail

- **Verdict**: FAIL
- **Reason**: `memory-lineage-backfill.vitest.ts` completed with all tests passing, but the observed transcript did not show the required execution and rollback evidence.

### Failure Triage

Re-run `npm test -- --run tests/memory-lineage-backfill.vitest.ts -t rollback`; inspect `lib/storage/lineage-state.ts` and `scripts/migrations/*checkpoint*.ts` if backfill or restore assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 130
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/lineage-backfill-rollback-drill.md`
