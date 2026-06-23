---
title: "418 -- Graph-metadata and lineage repair runner"
description: "This scenario validates the direct-run repair runner that normalizes graph-metadata.json to v1, maps legacy importance_tier values to the accepted enum, compacts V8-rejected archived metadata, and realigns stale memory_lineage logical keys with current memory_index identities."
audited_post_018: true
version: 3.6.0.3
---

# 418 -- Graph-metadata and lineage repair runner

## 1. OVERVIEW

This scenario validates `mcp_server/scripts/repair-graph-metadata.mjs`. The runner is the canonical maintenance tool for three structural failure classes that accumulate from folder renames and schema evolution: stale `memory_lineage.logical_key` rows that produce `E_LINEAGE` failures, graph-metadata.json files on the v0 schema or carrying invalid `importance_tier` values, and archived graph-metadata that fails V-rule V8.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the runner is idempotent on re-run, writes backups before any real mutation, repairs the three failure classes, and that a follow-up `memory_index_scan` reports zero failures for the targeted classes.
- Real user request: `` My memory_index_scan keeps reporting hundreds of failures across E_LINEAGE, invalid graph metadata, importance_tier check constraint, and V8 hard-block buckets after a bunch of folder renames. I want to run the repair runner end-to-end, verify it actually fixes things, and confirm a re-run is a no-op. Please run the dry-run first, then the real run, then a second dry-run for idempotency, and finally a memory_index_scan to confirm the targeted failure counts drop to 0. ``
- RCAF Prompt: `As a memory-maintenance operator, validate the repair-graph-metadata.mjs runner against a real scan log and confirm idempotency.`
- Expected execution process: Capture a baseline `memory_index_scan` snapshot, run the runner with `--dry-run` to preview, run for real, re-run `--dry-run` to assert idempotency, re-run the scan, and return a pass/fail verdict with cited evidence.
- Expected signals: dry-run report lists target files and a non-zero `graphFilesNeedingRepairBefore`; real run touches the same file count and writes backups to `/tmp/repair-graph-metadata-*`; second dry-run reports `graphMetadata.changed: 0` and `lineage.changed: 0`; follow-up scan reports `failed: 0` across `INSUFFICIENT_CONTEXT_ABORT`, `E_LINEAGE`, invalid graph schema, invalid importance_tier, and V8 buckets.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the runner is idempotent, backups exist, and the follow-up scan shows zero failures in the targeted classes. FAIL if the runner mutates manual fields on healthy active packets, if the second dry-run reports non-zero changes, or if the follow-up scan still shows the targeted failure classes.

---

## 3. TEST EXECUTION

### Prompt

```
Validate the graph-metadata and lineage repair runner: dry-run, real run, idempotency re-check, follow-up scan.
```

### Commands

**Block A: baseline scan**

1. Capture a baseline `memory_index_scan` via the launcher stdio bridge. Save the JSON-RPC response to `/tmp/scan-before.log`.
2. Count failures per category:
   ```
   python3 -c "import json,re; t=open('/tmp/scan-before.log').read(); m=re.search(r'\"id\":1,.*$',t,re.DOTALL); ..."
   ```
3. Record the baseline counts for the 5 buckets: `INSUFFICIENT_CONTEXT_ABORT`, `E_LINEAGE`, invalid graph schema, invalid importance_tier, V8.

**Block B: dry-run preview**

4. From repo root:
   ```
   node .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs --dry-run --scan-log /tmp/scan-before.log
   ```
5. Capture the structured JSON report. Confirm `graphMetadata.scanned > 0`, `graphMetadata.changed > 0` (matching the baseline failure count), and `lineage.candidates > 0`.

**Block C: real run**

6. Run the same command without `--dry-run`:
   ```
   node .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs --scan-log /tmp/scan-before.log
   ```
7. Confirm the runner reports `backupDir: /tmp/repair-graph-metadata-<timestamp>` and that the backup dir contains the mutated files plus copies of the SQLite database files.
8. Verify the runner does NOT touch graph-metadata.json files that were not in the scan log's failure list (active healthy packets retain their `manual.depends_on`, `manual.related_to`, `entities`, and authored `trigger_phrases`).

**Block D: idempotency**

9. Re-run with `--dry-run`:
   ```
   node .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs --dry-run --scan-log /tmp/scan-before.log
   ```
10. Assert `graphMetadata.changed: 0` and `lineage.changed: 0`.

**Block E: follow-up scan**

11. Restart the daemon to pick up the repaired metadata baseline.
12. Capture a new `memory_index_scan` JSON-RPC response.
13. Count failures per category. Assert all 5 buckets drop to 0 (or that residual failures are clearly out of scope, e.g. malformed `description.json` files for packets explicitly excluded from the runner's mutation surface).

### Expected

- Block A: baseline counts captured for 5 failure buckets.
- Block B: dry-run identifies the same files the baseline scan rejected.
- Block C: real run writes backups, mutates only flagged files, leaves healthy active packets untouched.
- Block D: second dry-run reports zero changes (idempotency holds).
- Block E: follow-up scan shows zero failures for the targeted classes; any residual is documented out-of-scope.

### Evidence

Saved baseline + follow-up scan responses, dry-run + real-run + idempotency-check JSON reports, listing of the backup dir contents, and a diff sample showing that one healthy active packet (e.g. an arbitrary 016/002/* graph-metadata.json that was NOT in the scan failure list) remains byte-equal between before and after the real run.

### Pass / Fail

- **Pass**: Block A through E all succeed, with Block C demonstrating scope-strict mutation (healthy packets untouched) and Block D demonstrating idempotency.
- **Fail**: Block C mutates a healthy packet's `manual.*` fields, OR Block D reports non-zero changes (idempotency broken), OR Block E shows residual failures in the 4 targeted classes.

### Failure Triage

- Block C scope-creep: inspect the v8 compaction branch in `repairGraphMetadata`. The `compactForV8` flag must derive from the scan log, not from a heuristic on the file itself. Healthy active packets without a V8 rejection in the scan log must skip the compaction branch entirely.
- Block D non-idempotent: confirm the runner's writeback path produces byte-identical output when given the same input file. Compare a sample file's before/after content after the second dry-run.
- Block E residual failures: inspect the residual files individually. If they are `description.json` files outside the runner's mutation surface, document as out-of-scope. If they are graph-metadata.json files, audit the runner's classification logic.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/graph-metadata-and-lineage-repair-runner.md](../../feature_catalog/13--memory-quality-and-indexing/graph-metadata-and-lineage-repair-runner.md)
- Source files: `mcp_server/scripts/repair-graph-metadata.mjs`, `mcp_server/lib/graph/graph-metadata-schema.ts`, `shared/embeddings/factory.ts`
- Shipping packet: `016/002/019-lineage-and-metadata-repair-runner`

---

## 5. SOURCE METADATA
- Spec doc identifier: `418`
- Group: Memory Quality And Indexing
- Canonical playbook source: `manual_testing_playbook.md`
