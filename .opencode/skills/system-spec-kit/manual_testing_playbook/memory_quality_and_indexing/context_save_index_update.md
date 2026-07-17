---
title: "M-003 -- Context Save + Index Update"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`."
audited_post_018: true
version: 3.6.0.22
id: memory-quality-and-indexing-context-save-index-update
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-003 -- Context Save + Index Update

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`.
- Real user request: `` Please validate Context Save + Index Update against node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec> and tell me whether the expected signals are present: Saved context artifacts are discoverable via `memory_search` / `memory_context` after the scan; `memory_index_scan` produces no `E_LINEAGE` errors on cross-file sibling docs (packet 001 — cross-file `UPDATE` / `REINFORCE` now downgrade to `CREATE` when `SimilarMemory.canonical_file_path` differs from the target); `memory_index_scan` produces no `candidate_changed` false-positives on scan-originated saves (packet 001 — scan saves carry `fromScan: true` and skip only the transactional complement recheck); Cleanup verify reports `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0` (packet 002 invariant); No row appears in the indexed set for paths under `z_future/` or `/external/` (packet 002 permanent exclusions); The constitutional `README.md` stays excluded from the spec-doc record index (ADR-005); A poisoned checkpoint or existing row for `.opencode/skills/system-spec-kit/constitutional/README.md` is downgraded to `important` and emits `tier_downgrade_non_constitutional_path`; `memory_save` on an excluded path returns `E_MEMORY_INDEX_SCOPE_EXCLUDED` with `canonicalPath`; `memory_index_scan` and `code_graph_scan` return structured `warnings` and `capExceeded` metadata when walker caps trigger. ``
- Prompt: `Validate Context Save + Index Update against generate-context.js and memory_index_scan.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Saved context artifacts are discoverable via `memory_search` / `memory_context` after the scan; `memory_index_scan` produces no `E_LINEAGE` errors on cross-file sibling docs (packet 001 — cross-file `UPDATE` / `REINFORCE` now downgrade to `CREATE` when `SimilarMemory.canonical_file_path` differs from the target); `memory_index_scan` produces no `candidate_changed` false-positives on scan-originated saves (packet 001 — scan saves carry `fromScan: true` and skip only the transactional complement recheck); Cleanup verify reports `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0` (packet 002 invariant); No row appears in the indexed set for paths under `z_future/` or `/external/` (packet 002 permanent exclusions); The constitutional `README.md` stays excluded from the spec-doc record index (ADR-005); A poisoned checkpoint or existing row for `.opencode/skills/system-spec-kit/constitutional/README.md` is downgraded to `important` and emits `tier_downgrade_non_constitutional_path`; `memory_save` on an excluded path returns `E_MEMORY_INDEX_SCOPE_EXCLUDED` with `canonicalPath`; `memory_index_scan` and `code_graph_scan` return structured `warnings` and `capExceeded` metadata when walker caps trigger
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: context appears in retrieval post-index, cleanup verify counts match, no scan-originated regressions fire, and the tier-invariant spot-check downgrades as documented; FAIL: any scan-originated `E_LINEAGE` / `candidate_changed` false-positive recurs, cleanup verify counts deviate (especially `z_future_rows != 0` or `external_rows != 0`), or a non-constitutional path persists as `constitutional`

---

## 3. TEST EXECUTION

### Commands
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js --verify`

### Expected

- Saved context artifacts are discoverable via `memory_search` / `memory_context` after the scan
- `memory_index_scan` produces no `E_LINEAGE` errors on cross-file sibling docs (packet 001 — cross-file `UPDATE` / `REINFORCE` now downgrade to `CREATE` when `SimilarMemory.canonical_file_path` differs from the target)
- `memory_index_scan` produces no `candidate_changed` false-positives on scan-originated saves (packet 001 — scan saves carry `fromScan: true` and skip only the transactional complement recheck)
- Cleanup verify reports `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0` (packet 002 invariant)
- No row appears in the indexed set for paths under `z_future/` or `/external/` (packet 002 permanent exclusions)
- The constitutional `README.md` stays excluded from the spec-doc record index (ADR-005)
- A poisoned checkpoint or existing row for `.opencode/skills/system-spec-kit/constitutional/README.md` is downgraded to `important` and emits `tier_downgrade_non_constitutional_path`
- `memory_save` on an excluded path returns `E_MEMORY_INDEX_SCOPE_EXCLUDED` with `canonicalPath`
- `memory_index_scan` and `code_graph_scan` return structured `warnings` and `capExceeded` metadata when walker caps trigger

### Evidence

- Command: `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js "/tmp/save-context-data-031-manual-playbook-execution-sweep.json" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep"`

```text
Starting memory skill...

{"timestamp":"2026-07-02T10:41:31.545Z","level":"info","message":"Starting memory skill workflow...\n","component":"workflow"}
{"timestamp":"2026-07-02T10:41:31.545Z","level":"info","message":"Step 1: Loading collected data...","component":"workflow"}
(node:98797) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"timestamp":"2026-07-02T10:41:31.546Z","level":"error","message":"Data file not found","filePath":"/tmp/save-context-data-031-manual-playbook-execution-sweep.json","error":"ENOENT: no such file or directory, open '/private/tmp/save-context-data-031-manual-playbook-execution-sweep.json'"}
Unexpected Error: EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: /tmp/save-context-data-031-manual-playbook-execution-sweep.json
Error: EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: /tmp/save-context-data-031-manual-playbook-execution-sweep.json
    at loadCollectedData (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/dist/loaders/data-loader.js:75:19)
    at async file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/dist/core/workflow.js:676:30
    at async withWorkflowRunLock (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/dist/core/workflow.js:308:16)
    at async main (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:742:13)
```

- Command: `memory_index_scan({ specFolder: ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" })`

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E040",
    "details": {
      "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
      "force": false,
      "includeConstitutional": false,
      "includeSpecDocs": true,
      "incremental": true,
      "background": false,
      "tenantId": "",
      "userId": "",
      "agentId": "",
      "sessionId": "",
      "provenanceSource": "",
      "provenanceActor": "",
      "governedAt": "",
      "retentionPolicy": "keep",
      "deleteAfter": ""
    }
  },
  "hints": [
    "Search operation failed.",
    "Try simplifying your query",
    "Check memory_health() for system status",
    "If vector search failed, results may still include BM25 matches",
    "memory_health()"
  ],
  "meta": {
    "tool": "memory_index_scan",
    "isError": true,
    "severity": "medium"
  }
}
```

- Command: `node .opencode/skills/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js --verify`

```text
[cleanup-index-scope-violations] Error: Missing required database path. Pass --db <path> or set MEMORY_DB_PATH. Active-profile default would be: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite
```

- `memory_search` / `memory_context` discoverability was not reached because the context save command failed before producing saved context artifacts.
- Tier-invariant spot-check, cleanup apply/rollback, restore validation, walker DoS, and promotion bypass checks were not reached because the documented command sequence was blocked before the expected cleanup counts and saved-artifact retrieval could be verified.

### Pass/Fail

- **Blocked**: required input file `/tmp/save-context-data-031-manual-playbook-execution-sweep.json` was missing, `memory_index_scan` returned `E040`, and `cleanup-index-scope-violations.js --verify` could not run without `--db` or `MEMORY_DB_PATH`; the Expected signals could not be evaluated.

### Failure Triage

- Discoverability fails → rerun save, inspect path/permissions, confirm `memory_index_scan` ran against the correct `specFolder`
- Scan-originated regression fires → confirm the dist build is current (`scripts/dist/memory/cleanup-index-scope-violations.js` exists and matches source) and that MCP clients were restarted after the last build; check `mcp_server/handlers/save/pe-orchestration.ts` + `handlers/memory-save.ts` for the `canonical_file_path` and `fromScan` wiring
- Invariant counts deviate → run `cleanup-index-scope-violations.js --apply` and re-verify; if non-zero counts persist, inspect `mcp_server/lib/utils/index-scope.ts` for drift from the shared policy

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [mutation/memory_indexing_memorysave.md](../../feature_catalog/mutation/memory_indexing_memorysave.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/context_save_index_update.md`
