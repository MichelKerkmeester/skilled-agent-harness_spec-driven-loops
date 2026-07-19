---
title: "001 ensure-ready selective reindex"
description: "Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior."
trigger_phrases:
  - "001"
  - "ensure ready selective reindex"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: ensure-ready-selective-reindex
category: read_path_freshness
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual-testing-playbook/read-path-freshness/ensure-ready-selective-reindex.md
---
# 001 ensure-ready selective reindex

Prompt: Validate that code_graph can selectively reindex and repair a single stale tracked file without triggering an unrequested full scan.

## 1. OVERVIEW

Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.
- Real user request: `Validate that code_graph can repair a single stale tracked file without triggering an unrequested full scan.`
- Operator prompt: `Validate selective code-graph readiness in a disposable workspace. Show that one stale tracked file repairs without an unrequested full scan and return PASS/FAIL with command evidence and JSON excerpts.`
- Expected execution process: Create a disposable workspace, run a full scan, touch one indexed TypeScript file, call `code_graph_query` for the touched file and capture readiness fields from the response.
- Expected signals: Response shows `status:"ok"` plus readiness or self-heal evidence such as `inlineIndexPerformed:true` or `selfHealResult:"ok"`, with no transcript line showing an unrequested full `code_graph_scan`.
- Desired user-visible outcome: A concise verdict explaining whether selective reindex repaired the stale file without broad scan behavior.
- Pass/fail: PASS if the stale file is repaired and no hidden full scan appears. FAIL if the call blocks unexpectedly, performs an unrequested full scan or omits readiness evidence.

---

## 3. TEST EXECUTION

### Commands

1. Create a disposable copy and run `code_graph_scan({"rootDir":"$WORK","incremental":false})`.
2. Touch one indexed TypeScript file.
3. Call `code_graph_query({"operation":"outline","subject":"<touched-file>","limit":20})`.
4. Capture readiness fields from the response.

### Expected Output / Verification

Response shows `status:"ok"` and readiness/self-heal evidence such as `inlineIndexPerformed:true` or `selfHealResult:"ok"`. No transcript line shows an unrequested full `code_graph_scan`.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Repeat with `allowInlineIndex:false` through `detect_changes` and confirm it blocks instead.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual-testing-playbook.md` | Root playbook index |
| `../../feature-catalog/feature-catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 001
- Canonical root source: `manual-testing-playbook.md`

---

## 6. EVIDENCE

### Command 1: verify temp parent

```text
$ ls "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode"
filter-config-contract.4XNOQy
filter-config-contract.VpgvjB
filter-config-contract.aemz4O
filter-config-contract.dG1fc7
filter-config-contract.kOAxJg
filter-config-contract.zA30NF
stale-audit.VRJFUN
stale-audit.ZPCmmr
tool-ownership.LuMGaC
```

### Command 2: inspect CLI scan schema

```text
$ node .opencode/bin/code-index.cjs code_graph_scan --help
code-index code_graph_scan

Description:
  [L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.

Aliases:
  code_graph_scan, code-graph-scan, codeGraphScan

Input schema:
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rootDir": {
      "type": "string",
      "description": "Root directory to scan (default: workspace root)"
    },
    "includeGlobs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Glob patterns for files to include"
    },
    "excludeGlobs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Additional glob patterns to exclude"
    },
    "incremental": {
      "type": "boolean",
      "default": true,
      "description": "Skip unchanged files (default: true)"
    },
    "includeSkills": {
      "oneOf": [
        {
          "type": "boolean"
        },
        {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^sk-[a-z0-9-]+$"
          }
        }
      ],
      "default": false,
      "description": "Include all .opencode/skills files with true, or only named sk-* skills with an array; default false keeps end-user code scope"
    },
    "includeAgents": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/agent files in this scan; default false keeps end-user code scope"
    },
    "includeCommands": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/command files in this scan; default false keeps end-user code scope"
    },
    "includeSpecs": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/specs files in this scan; default false keeps end-user code scope"
    },
    "includePlugins": {
      "type": "boolean",
      "default": false,
      "description": "Include .opencode/plugins files in this scan; default false keeps end-user code scope"
    },
    "verify": {
      "type": "boolean",
      "default": false,
      "description": "Run the gold-query verification battery after an explicit full scan (default: false)"
    },
    "persistBaseline": {
      "type": "boolean",
      "default": false,
      "description": "Persist the current edge-distribution baseline after a full scan even when one already exists"
    },
    "forceZeroNodeReset": {
      "type": "boolean",
      "default": false,
      "description": "Allow an explicit destructive reset when a full scan produces zero indexed nodes over a populated graph"
    },
    "forceScopeChange": {
      "type": "boolean",
      "default": false,
      "description": "Allow replacing a populated code graph with a full scan from a different scope fingerprint"
    }
  },
  "required": []
}
```

### Command 3: inspect CLI query schema

```text
$ node .opencode/bin/code-index.cjs code_graph_query --help
code-index code_graph_query

Description:
  [L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph), and blast_radius (reverse import impact). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.

Aliases:
  code_graph_query, code-graph-query, codeGraphQuery

Input schema:
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "operation": {
      "type": "string",
      "enum": [
        "outline",
        "calls_from",
        "calls_to",
        "imports_from",
        "imports_to",
        "blast_radius"
      ],
      "description": "Query operation (required)"
    },
    "subject": {
      "type": "string",
      "minLength": 1,
      "description": "File path, symbol name, or symbolId to query (required)"
    },
    "subjects": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional additional file paths or symbols for blast-radius union mode"
    },
    "unionMode": {
      "type": "string",
      "enum": [
        "single",
        "multi"
      ],
      "description": "Blast-radius subject handling mode; use multi to union subject + subjects"
    },
    "edgeType": {
      "type": "string",
      "description": "Filter by edge type (optional)"
    },
    "limit": {
      "type": "number",
      "minimum": 1,
      "maximum": 1000,
      "default": 50,
      "description": "Max results (handler clamps to 1000)"
    },
    "includeTransitive": {
      "type": "boolean",
      "default": false,
      "description": "Enable multi-hop BFS traversal (follows edges transitively)"
    },
    "maxDepth": {
      "type": "number",
      "minimum": 1,
      "maximum": 20,
      "default": 3,
      "description": "Max traversal depth when includeTransitive is true (handler clamps to 20)"
    },
    "minConfidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Minimum confidence threshold (0-1) for blast_radius dependency edges; defaults to 0 (include all). Filters import-edge confidences before blast-radius assembly."
    },
    "includeTrace": {
      "type": "boolean",
      "description": "Include trace metadata in response for debugging"
    },
    "asOf": {
      "type": "number",
      "minimum": 0,
      "description": "Optional graph generation for a time-travel read of calls_from, calls_to, imports_from, and imports_to. Omit for the current graph. Requires the bitemporal-reads flag to surface preserved history, falls back to the live read when the flag is off."
    }
  },
  "required": [
    "operation",
    "subject"
  ]
}
```

### Command 4: create disposable copy and run required scan

```text
$ WORK=$(mktemp -d "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex.XXXXXX") && DB_DIR=$(mktemp -d "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex-db.XXXXXX") && cp -R ".opencode/skills/system-code-graph/." "$WORK/" && TOUCHED="$WORK/mcp-server/handlers/query.ts" && printf 'WORK=%s\nDB_DIR=%s\nTOUCHED=%s\n' "$WORK" "$DB_DIR" "$TOUCHED" && printf '\nCOMMAND 1: SPECKIT_CODE_GRAPH_DB_DIR="$DB_DIR" node .opencode/bin/code-index.cjs code_graph_scan --json {"rootDir":"$WORK","incremental":false}\n' && SPECKIT_CODE_GRAPH_DB_DIR="$DB_DIR" node .opencode/bin/code-index.cjs code_graph_scan --json "{\"rootDir\":\"$WORK\",\"incremental\":false}" --format json && printf '\nCOMMAND 2: touch "$TOUCHED"\n' && touch "$TOUCHED" && stat -f 'TOUCHED_MTIME=%Sm' "$TOUCHED" && printf '\nCOMMAND 3: SPECKIT_CODE_GRAPH_DB_DIR="$DB_DIR" node .opencode/bin/code-index.cjs code_graph_query --json {"operation":"outline","subject":"$TOUCHED","limit":20}\n' && SPECKIT_CODE_GRAPH_DB_DIR="$DB_DIR" node .opencode/bin/code-index.cjs code_graph_query --json "{\"operation\":\"outline\",\"subject\":\"$TOUCHED\",\"limit\":20}" --format json && printf '\nCOMMAND 4: rm -rf "$WORK" "$DB_DIR"\n' && rm -rf "$WORK" "$DB_DIR" && printf 'CLEANUP_DONE=1\n'
WORK=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex.0adOML
DB_DIR=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex-db.qdS9DD
TOUCHED=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex.0adOML/mcp-server/handlers/query.ts

COMMAND 1: SPECKIT_CODE_GRAPH_DB_DIR="$DB_DIR" node .opencode/bin/code-index.cjs code_graph_scan --json {"rootDir":"$WORK","incremental":false}
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

### Command 5: cleanup after blocked scan attempt

```text
$ rm -rf "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex.0adOML" "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/ensure-ready-selective-reindex-db.qdS9DD" && printf 'CLEANUP_DONE=1\n'
CLEANUP_DONE=1
```

### Command 6: check code-index CLI status

```text
$ node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 3000
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

### Command 7: check code graph plugin bridge status

```text
$ mk_code_graph_status()
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp-server/plugin-bridges/mk-code-graph-bridge.mjs
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

### Command 8: inspect CLI launcher/help path

```text
$ node .opencode/bin/code-index.cjs --help
code-index - daemon-backed CLI for mk-code-index

Usage:
  code-index list-tools [--format json|text|jsonl] [--compact|--names-only]
  code-index completion bash|zsh
  code-index <tool_name> [--json '{...}'] [--format json|text|jsonl] [--timeout-ms N] [--warm-only]
  code-index <tool_name> --param value [--another-param value]

Examples:
  code-index list-tools --format text
  code-index list-tools --compact
  code-index completion zsh
  code-index code_graph_status --format json
  code-index code_graph_query --operation outline --subject .opencode/skills/system-code-graph/mcp-server/index.ts
  code-index detect_changes --json '{"diff":"diff --git a/a.ts b/a.ts
"}' --warm-only --timeout-ms 2000

Exit codes:
  0 success, 1 runtime error, 64 usage/schema error, 69 protocol/dist mismatch, 75 retryable daemon error

Exit code notes:
  detect_changes status:"parse_error" (malformed diff input) exits 64.
  status:"blocked" readiness refusals exit 0 deliberately: blocked is an
  actionable answer (run the surfaced requiredAction), not a CLI failure.
```

### Command 9: attempt launcher entrypoint

```text
$ node .opencode/bin/mk-code-index-launcher.cjs --help
[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] liveOwnerDetected: ownerPid=92774 classification=live-owner
LEASE_HELD_BY:92774 startedAt=2026-06-29T09:35:48.872Z (dead-socket-recheck)
```

Observed result: the required `code_graph_scan({"rootDir":"$WORK","incremental":false})` did not execute successfully because the code-index backend socket was unavailable. Because the scan precondition failed, the scenario could not reach the touch/query/readiness-evidence steps.

---

## 7. PASS/FAIL

BLOCKED: the code-index backend/socket precondition is broken in the current repo state; `code_graph_scan` returned `status:"error"`, `exitCode:75`, and `backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock` before any selective reindex evidence could be produced.
