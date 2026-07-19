---
title: "092 -- Implemented: auto entity extraction (R10)"
description: "This scenario validates Implemented: auto entity extraction (R10) for `092`. It focuses on Confirm deferred->implemented status."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-implemented-auto-entity-extraction-r10
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 092 -- Implemented: auto entity extraction (R10)

## 1. OVERVIEW

This scenario validates Implemented: auto entity extraction (R10) for `092`. It focuses on Confirm deferred->implemented status.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm deferred->implemented status.
- Real user request: `Please validate Implemented: auto entity extraction (R10) against the documented validation surface and tell me whether the expected signals are present: Entities automatically extracted on save; entity outputs contain expected entity types; default extraction settings are applied.`
- Prompt: `Validate implemented auto entity extraction defaults and output types.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Entities automatically extracted on save; entity outputs contain expected entity types; default extraction settings are applied
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if entity extraction runs automatically on save and produces correctly typed entities with default settings

---

## 3. TEST EXECUTION

### Prompt

```
Validate implemented auto entity extraction defaults and output types.
```

### Commands

1. save entity-rich memory
2. inspect entity outputs
3. verify defaults

### Expected

Entities automatically extracted on save; entity outputs contain expected entity types; default extraction settings are applied

### Evidence

Executed 2026-07-02 against the live repo.

Save command output (`memory_index_scan`, scoped to `system-speckit/031-manual-playbook-execution-sweep`, `force: true`, `includeSpecDocs: true`, `incremental: false`):

```json
{
  "summary": "Scan complete: 7 indexed, 0 updated, 0 unchanged, 0 deleted, 0 orphan swept, 0 failed",
  "data": {
    "status": "complete_with_pending_vectors",
    "pendingVectors": 7,
    "scanKey": "92f55c0222973080",
    "batchSize": 5,
    "scanned": 7,
    "indexed": 7,
    "updated": 0,
    "unchanged": 0,
    "failed": 0,
    "deferred": 7,
    "postInsertEnrichmentRepaired": 4,
    "files": [
      { "file": "checklist.md", "id": 38625, "status": "deferred", "isConstitutional": false },
      { "file": "decision-record.md", "id": 38626, "status": "deferred", "isConstitutional": false },
      { "file": "description.json", "id": 38627, "status": "deferred", "isConstitutional": false },
      { "file": "plan.md", "id": 38628, "status": "deferred", "isConstitutional": false },
      { "file": "spec.md", "id": 38629, "status": "deferred", "isConstitutional": false },
      { "file": "tasks.md", "id": 38630, "status": "deferred", "isConstitutional": false },
      { "file": "graph-metadata.json", "id": 38631, "status": "deferred", "isConstitutional": false }
    ],
    "warnings": [
      "Metadata edge promoter: parentChain system-speckit: Target packet could not be resolved"
    ]
  }
}
```

Entity output query:

```bash
sqlite3 -header -column ".opencode/skills/system-spec-kit/mcp-server/database/context-index.sqlite" "SELECT memory_id, COUNT(*) AS entity_count, GROUP_CONCAT(DISTINCT entity_type) AS entity_types FROM memory_entities WHERE memory_id BETWEEN 38625 AND 38631 GROUP BY memory_id ORDER BY memory_id;"
```

```text
memory_id  entity_count  entity_types                         
---------  ------------  -------------------------------------
38625      38            proper_noun,key_phrase,heading,quoted
38626      39            proper_noun,key_phrase,heading,quoted
38628      45            proper_noun,key_phrase,heading,quoted
38629      63            proper_noun,key_phrase,heading,quoted
38630      22            proper_noun,key_phrase,heading,quoted
38631      6             proper_noun                          
```

Typed entity sample for saved `spec.md` memory ID `38629`:

```bash
sqlite3 -header -column ".opencode/skills/system-spec-kit/mcp-server/database/context-index.sqlite" "SELECT memory_id, entity_text, entity_type, frequency, created_by FROM memory_entities WHERE memory_id = 38629 AND entity_text IN ('Manual Testing Playbook Execution Sweep','GPT-5.5','OpenCode','Feature Specification','Executive Summary','Problem Statement') ORDER BY entity_text;"
```

```text
memory_id  entity_text                              entity_type  frequency  created_by
---------  ---------------------------------------  -----------  ---------  ----------
38629      Feature Specification                    proper_noun  1          auto      
38629      Manual Testing Playbook Execution Sweep  proper_noun  1          auto      
38629      Problem Statement                        heading      1          auto      
```

Catalog output query:

```bash
sqlite3 -header -column ".opencode/skills/system-spec-kit/mcp-server/database/context-index.sqlite" "SELECT canonical_name, entity_type, memory_count FROM entity_catalog WHERE canonical_name IN ('manual testing playbook execution sweep','feature specification','executive summary','problem statement') ORDER BY canonical_name;"
```

```text
canonical_name                           entity_type  memory_count
---------------------------------------  -----------  ------------
executive summary                        heading      674         
feature specification                    proper_noun  3423        
manual testing playbook execution sweep  proper_noun  11          
problem statement                        heading      2778        
```

Default configuration evidence from `.opencode/skills/system-spec-kit/mcp-server/lib/search/search-flags.ts`:

```text
347: /**
348:  * Auto entity extraction (rule-based noun-phrase extraction at save time).
349:  * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
350:  */
351: export function isAutoEntitiesEnabled(): boolean {
352:   return isFeatureEnabled('SPECKIT_AUTO_ENTITIES');
353: }
```

Default rollout policy evidence from `.opencode/skills/system-spec-kit/mcp-server/lib/cognitive/rollout-policy.ts`:

```text
53: /** Check if a feature flag is enabled. Treats undefined/missing as enabled (default ON).
54:  * Explicitly set 'false' or '0' to disable. Rollout gating applies when percent < 100.
55:  * @param flagName - Environment variable name (e.g., SPECKIT_HYDE)
56:  * @param identity - Optional identity for deterministic rollout bucketing
57:  * @returns true if the feature is enabled for this identity
58:  */
59: function isFeatureEnabled(flagName: string, identity?: string): boolean {
60:   const rawFlag = process.env[flagName]?.toLowerCase()?.trim();
61:   // Treat 'false' and '0' as explicitly disabled; everything else (including undefined) is enabled
62:   if (rawFlag === 'false' || rawFlag === '0') return false;
63: 
64:   const rolloutPercent = getRolloutPercent();
65:   if (rolloutPercent >= 100) return true;
```

Environment check:

```bash
printenv SPECKIT_AUTO_ENTITIES; printenv SPECKIT_ROLLOUT_PERCENT
```

```text
(no output)
```

### Pass / Fail

- **PASS**: entity extraction ran during the save/index path (`created_by` = `auto` rows appeared for saved memory IDs 38625-38631), produced expected typed entities (`proper_noun`, `key_phrase`, `heading`, `quoted`), populated `entity_catalog`, and default settings are ON because `SPECKIT_AUTO_ENTITIES` and `SPECKIT_ROLLOUT_PERCENT` were unset while the implementation treats missing flags as enabled.

### Failure Triage

Verify entity extraction pipeline is wired into save handler; check entity type classification; inspect default extraction configuration

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/auto-entity-extraction.md](../../feature-catalog/memory-quality-and-indexing/auto-entity-extraction.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 092
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/implemented-auto-entity-extraction-r10.md`
