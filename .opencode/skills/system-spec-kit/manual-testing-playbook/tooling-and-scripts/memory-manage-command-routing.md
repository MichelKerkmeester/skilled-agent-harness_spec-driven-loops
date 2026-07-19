---
title: "186 -- /memory:manage command routing"
description: "This scenario validates /memory:manage command routing for `186`. It focuses on verifying the command's default stats mode and supported subcommand routing: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest."
version: 3.6.0.16
id: tooling-and-scripts-memory-manage-command-routing
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/memory/memory-system.md
---

# 186 -- /memory:manage command routing

## 1. OVERVIEW

This scenario validates /memory:manage command routing for `186`. It focuses on Verify the command's default stats mode and key subcommand routing: scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, and ingest.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `/memory:manage` default stats dashboard and subcommand routing for the currently supported management modes.
- Real user request: `` Please validate /memory:manage command routing against /memory:manage and tell me whether the expected signals are present: No-args shows stats dashboard via `memory_stats()` + `memory_list()`; scan routes to `memory_index_scan()`; health routes to `memory_health()`; checkpoint subcommands route to checkpoint tools; ingest subcommands route to ingest tools; unrecognized mode returns STATUS=FAIL. ``
- Prompt: `Validate /memory:manage command routing against /memory:manage and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: No-args shows stats dashboard via `memory_stats()` + `memory_list()`; scan routes to `memory_index_scan()`; health routes to `memory_health()`; checkpoint subcommands route to checkpoint tools; ingest subcommands route to ingest tools; unrecognized mode returns STATUS=FAIL
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly; FAIL: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error

---

## 3. TEST EXECUTION

### Prompt

```
Validate /memory:manage command routing against /memory:manage and report cited pass/fail evidence.
```

### Commands

1. Invoke `/memory:manage` with no arguments and verify the stats dashboard appears showing total, size, indexed date, tier distribution, and top folders via `memory_stats()` + `memory_list({ limit: 10, sortBy: "updated_at" })`
2. Invoke `/memory:manage scan` and verify `memory_index_scan()` is called
3. Invoke `/memory:manage scan --force` and verify force re-index is triggered
4. Invoke `/memory:manage health` and verify `memory_health()` is called
5. Invoke `/memory:manage checkpoint list` and verify `checkpoint_list()` is called
6. Invoke `/memory:manage checkpoint create test-snap` and verify `checkpoint_create()` is called
7. Invoke `/memory:manage ingest status abc-123` and verify `memory_ingest_status()` is called
8. Invoke `/memory:manage delete 42` and verify confirmation prompt appears before `memory_delete()`
9. Invoke `/memory:manage bulk-delete temporary --older-than 30` and verify confirmation prompt appears before `memory_bulk_delete()`
10. Invoke `/memory:manage invalid-mode` and verify `STATUS=FAIL ERROR="Unknown mode"` is returned

### Expected

No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns STATUS=FAIL error

### Evidence

Observed 2026-07-02 while executing this scenario with the user constraint `ALLOWED WRITE PATHS` limited to this scenario file only.

1. `/memory:manage` no arguments, routed as documented to `memory_stats()` plus `memory_list({ limit: 10, sortBy: "updated_at" })`.

`memory_stats()` output:

```json
{
  "summary": "Memory system: 32629 memories across 3818 folders",
  "data": {
    "totalMemories": 32629,
    "byStatus": {
      "pending": 8177,
      "success": 14458,
      "failed": 2036,
      "retry": 1083,
      "partial": 0
    },
    "oldestMemory": "2026-06-04T07:01:02.965Z",
    "newestMemory": "2026-07-02T21:02:13.539Z",
    "topFolders": [
      { "folder": "system-spec-kit", "count": 69 },
      { "folder": "skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment", "count": 49 },
      { "folder": "skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism", "count": 47 },
      { "folder": "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation", "count": 38 },
      { "folder": "anobel.com/002-link-card-button-and-mobile-animation", "count": 37 },
      { "folder": "skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research", "count": 36 },
      { "folder": "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-small-model", "count": 34 },
      { "folder": "anobel.com/003-slider-refactor", "count": 32 },
      { "folder": "skilled-agent-orchestration/149-kimi-k2-7-code-support/005-filename-underscore-alignment", "count": 29 },
      { "folder": "skilled-agent-orchestration/149-kimi-k2-7-code-support/001-model-registration", "count": 28 }
    ],
    "totalSpecFolders": 3818,
    "limit": 10,
    "totalTriggerPhrases": 164249,
    "vectorSearchEnabled": true,
    "folderRanking": "count",
    "tierBreakdown": {
      "constitutional": 69,
      "critical": 948,
      "deprecated": 6846,
      "important": 11758,
      "normal": 13003,
      "temporary": 5
    },
    "databaseSizeBytes": 1317191680,
    "lastIndexedAt": "2026-07-02T21:24:26.742Z"
  }
}
```

`memory_list({ limit: 10, offset: 0, specFolder: "", sortBy: "updated_at", includeChunks: false })` output:

```json
{
  "summary": "Found 10 memories",
  "data": {
    "total": 32629,
    "offset": 0,
    "limit": 10,
    "sortBy": "updated_at",
    "includeChunks": false,
    "count": 10,
    "results": [
      {
        "id": 29901,
        "specFolder": "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/008-remove-sk-doc-legacy-template-debt",
        "title": "Implementation Plan: sk-doc Legacy Template Debt Cleanup [template:level-2/plan.md]",
        "createdAt": "2026-06-30T11:18:14.500Z",
        "updatedAt": "2026-07-02T21:24:26.742Z",
        "importanceWeight": 0.7,
        "triggerCount": 3,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/008-remove-sk-doc-legacy-template-debt/plan.md"
      }
    ],
    "constitutionalCount": 0
  },
  "meta": {
    "tool": "memory_list",
    "tokenBudgetTruncated": true,
    "originalResultCount": 10,
    "returnedResultCount": 10
  }
}
```

2. `/memory:manage scan` and `/memory:manage scan --force` could not be executed without violating the user constraint that no files other than this scenario file may be modified. The command contract says `scan` uses `memory_index_scan`; that MCP tool indexes files and mutates the indexed-continuity store.

3. `/memory:manage health`, routed to `memory_health()`, repeatedly returned this MCP transport output:

```text
MCP error -32001: backend recycled; retry
```

Warm CLI fallback attempted with:

```bash
node ".opencode/bin/spec-memory.cjs" memory_health --json '{"reportMode":"full","includeFullReport":false,"limit":10,"specFolder":"","autoRepair":false,"confirmed":false,"cleanFiles":false}' --format json --timeout-ms 3000 --warm-only
```

CLI output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build
```

4. `/memory:manage checkpoint list`, routed to `checkpoint_list()`, returned:

```json
{
  "summary": "Found 3 checkpoint(s)",
  "data": {
    "count": 3,
    "checkpoints": [
      {
        "id": 3,
        "name": "pre-ex021-causal-unlink",
        "createdAt": "2026-07-02T06:21:32.219Z",
        "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
        "snapshotSize": 37390965,
        "snapshotFormat": "v1",
        "snapshotPath": null
      },
      {
        "id": 2,
        "name": "ex-015-manual-sweep-2026-07-02-gpt55",
        "createdAt": "2026-07-02T05:27:42.682Z",
        "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
        "snapshotSize": 37368509,
        "snapshotFormat": "v1",
        "snapshotPath": null
      },
      {
        "id": 1,
        "name": "pre-bulk-delete-important-2026-06-15T18-14-59",
        "createdAt": "2026-06-15T18:14:59.820Z",
        "specFolder": "skilled-agent-orchestration/142-cli-devin-deprecation",
        "snapshotSize": 1388888,
        "snapshotFormat": "v1",
        "snapshotPath": null
      }
    ]
  }
}
```

5. `/memory:manage checkpoint create test-snap` could not be executed without violating the user constraint that no files other than this scenario file may be created or modified. The command contract says `checkpoint create` uses `checkpoint_create`, which creates checkpoint state.

6. `/memory:manage ingest status abc-123`, routed to `memory_ingest_status({ jobId: "abc-123" })`, returned:

```json
{
  "summary": "Error: Ingest job not found: abc-123",
  "data": {
    "error": "Ingest job not found: abc-123",
    "code": "E404",
    "details": {
      "jobId": "abc-123"
    }
  },
  "hints": [
    "Verify the jobId and retry.",
    "Call memory_ingest_start to create a new ingest job"
  ]
}
```

7. `/memory:manage delete 42` was not executed past confirmation. The presentation contract for delete contains the required prompt:

```text
Confirm: [y] delete | [n] cancel
STATUS=AWAITING_INPUT ACTION=delete
```

8. `/memory:manage bulk-delete temporary --older-than 30` was not executed past confirmation. The presentation contract for bulk-delete contains the required prompt:

```text
Confirm: [y] delete all | [n] cancel
STATUS=AWAITING_INPUT ACTION=bulk-delete
```

9. `/memory:manage invalid-mode` could not be invoked through a slash-command executor in this tool session. The command contract states:

```text
On an unknown mode, return `STATUS=FAIL ERROR="Unknown mode: <mode>"` and list the valid modes.
```

### Pass / Fail

- **Blocked**: The full scenario could not be completed because required commands include mutating MCP operations (`memory_index_scan` and `checkpoint_create`) that would modify files or state outside the single allowed write path, and `memory_health()` repeatedly returned `MCP error -32001: backend recycled; retry` with the warm CLI fallback reporting `@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp-server && npm run build`.

### Failure Triage

Verify argument routing logic in Section 4 of manage.md → Check mode parsing in mandatory first action → Confirm tool-to-mode mapping → Inspect confirmation gates on destructive operations (delete, bulk-delete, checkpoint restore)

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/constitutional-memory-manager-command.md](../../feature-catalog/tooling-and-scripts/constitutional-memory-manager-command.md)
- Command file: [.opencode/commands/memory/manage.md](../../../../commands/memory/manage.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 186
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/memory-manage-command-routing.md`
