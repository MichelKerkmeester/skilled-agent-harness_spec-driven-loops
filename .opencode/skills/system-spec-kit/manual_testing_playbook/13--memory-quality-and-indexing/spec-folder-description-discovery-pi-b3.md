---
title: "042 -- Spec folder description discovery (PI-B3)"
description: "This scenario validates Spec folder description discovery (PI-B3) for `042`. It focuses on Confirm per-folder + aggregated routing."
audited_post_018: true
version: 3.6.0.17
---

# 042 -- Spec folder description discovery (PI-B3)

## 1. OVERVIEW

This scenario validates Spec folder description discovery (PI-B3) for `042`. It focuses on Confirm per-folder + aggregated routing.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm per-folder + aggregated routing.
- Real user request: `Please validate Spec folder description discovery (PI-B3) against the documented validation surface and tell me whether the expected signals are present: description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files.`
- Prompt: `Validate spec folder description discovery and description.json fallback behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails

---

## 3. TEST EXECUTION

### Prompt

```
Validate spec folder description discovery and description.json fallback behavior.
```

### Commands

1. Create spec folder via create.sh → verify description.json exists
2. Edit spec.md → verify isPerFolderDescriptionStale detects change
3. Run generateFolderDescriptions → verify per-folder files preferred over spec.md
4. Mixed mode: some folders with/without description.json → verify aggregation
5. Corrupt description.json with invalid JSON and schema-invalid field types → run generateFolderDescriptions() and verify spec.md fallback plus repaired description.json
6. Verify missing description.json falls back to spec.md without forcing a write
7. Attempt generation against an out-of-base or prefix-bypass path → verify rejection and no file written
8. Use spec.md with large YAML frontmatter and CRLF-heavy line endings → verify extracted description comes from post-frontmatter content
9. Run memory_context query → verify short-circuit folder routing

### Expected

description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files

### Evidence

`create.sh` was run against a temporary explicit path outside the workspace:

```text
description.json created in /private/tmp/speckit-pib3-manual-59211/042-spec-folder-description-discovery
(node:59334) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"BRANCH_NAME":"042-spec-folder-description-discovery","SPEC_FILE":"/private/tmp/speckit-pib3-manual-59211/042-spec-folder-description-discovery/spec.md","FEATURE_NUM":"042","DOC_LEVEL":"1","SHARDED":false,"COMPLEXITY":{"detected":false},"EXPANDED":false,"HAS_DESCRIPTION":true,"CREATED_FILES":["spec.md","plan.md","tasks.md","implementation-summary.md","description.json"]}
```

Created `description.json` content:

```json
{
  "specFolder": "042-spec-folder-description-discovery",
  "description": "Spec folder description discovery PI-B3",
  "keywords": [
    "spec",
    "folder",
    "description",
    "discovery",
    "pi-b3"
  ],
  "lastUpdated": "2026-07-02T11:47:59.321Z",
  "specId": "042",
  "folderSlug": "spec-folder-description-discovery",
  "parentChain": [],
  "memorySequence": 0,
  "memoryNameHistory": [],
  "level": "1"
}
```

Targeted automated validation covering stale detection, per-folder preference, mixed-mode aggregation, corrupt/schema-invalid fallback and repair, missing-file fallback without implicit backfill, traversal/prefix-bypass rejection, CRLF frontmatter stripping, and regenerated JSON/temp-file behavior:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  142 passed (142)
   Start at  13:47:26
   Duration  818ms (transform 80ms, setup 17ms, import 130ms, tests 549ms, environment 0ms)
```

Valid JSON and leftover temp-file check for the created folder:

```json
{
  "descriptionJsonValid": true,
  "specFolder": "042-spec-folder-description-discovery",
  "description": "Spec folder description discovery PI-B3",
  "specId": "042",
  "folderSlug": "spec-folder-description-discovery",
  "tempFiles": []
}
```

`memory_context` query for `Validate spec folder description discovery and description.json fallback behavior.` did not return folder-routing trace. MCP and daemon-backed CLI attempts both failed with session-scope validation:

```text
{
  "summary": "Error: sessionId \"memory-context:7c8464932aed2bb0\" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
  "data": {
    "error": "sessionId \"memory-context:7c8464932aed2bb0\" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "code": "E_SESSION_SCOPE",
    "details": {
      "requestId": "4aac0916-a3fd-4ee9-864c-cb193278e926",
      "layer": "L1:Orchestration",
      "mode": "deep",
      "upstream": {
        "requestedSessionId": "memory-context:7c8464932aed2bb0"
      }
    }
  },
  "hints": [
    "Omit sessionId to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context."
  ],
  "meta": {
    "tool": "memory_context",
    "tokenCount": 259,
    "cacheHit": false,
    "isError": true,
    "severity": "error",
    "tokenBudget": 3500
  }
}
```

### Pass / Fail

FAIL

Reason: the creation and folder-discovery validation surfaces passed, but the required `memory_context` folder-routing check failed with `E_SESSION_SCOPE` instead of producing routing evidence.

### Failure Triage

Verify create.sh generates description.json → Check stale detection mtime comparison → Inspect generateFolderDescriptions preference logic and repair path → Confirm missing-file fallback does not backfill unexpectedly → Verify realpath containment rejects traversal/prefix-bypass paths → Confirm frontmatter stripping happens before description extraction → Verify memory_context folder routing

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/spec-folder-description-discovery.md](../../feature_catalog/13--memory-quality-and-indexing/spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 042
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/spec-folder-description-discovery-pi-b3.md`
