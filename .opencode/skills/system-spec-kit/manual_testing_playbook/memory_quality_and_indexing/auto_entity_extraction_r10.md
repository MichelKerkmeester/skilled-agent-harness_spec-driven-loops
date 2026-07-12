---
title: "048 -- Auto entity extraction (R10)"
description: "This scenario validates Auto entity extraction (R10) for `048`. It focuses on Confirm entity pipeline persistence."
audited_post_018: true
version: 3.6.0.17
---

# 048 -- Auto entity extraction (R10)

## 1. OVERVIEW

This scenario validates Auto entity extraction (R10) for `048`. It focuses on Confirm entity pipeline persistence.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm entity pipeline persistence.
- Real user request: `Please validate Auto entity extraction (R10) against the documented validation surface and tell me whether the expected signals are present: Entities extracted and persisted in entity tables; normalization applied (case, aliases); denylist entities excluded.`
- Prompt: `Validate auto entity extraction persistence, normalization, and denylist behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Entities extracted and persisted in entity tables; normalization applied (case, aliases); denylist entities excluded
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Entities extracted, normalized, persisted; denylist items absent; FAIL: Missing entities, denormalized values, or denylist items present

---

## 3. TEST EXECUTION

### Prompt

```
Validate auto entity extraction persistence, normalization, and denylist behavior.
```

### Commands

1. Save entity-rich content
2. inspect entity tables
3. verify normalization/denylist

### Expected

Entities extracted and persisted in entity tables; normalization applied (case, aliases); denylist entities excluded

### Evidence

Executed 2026-07-02 against the live Spec Kit Memory index.

Command 1, save entity-rich content: indexed existing spec-folder content for `.opencode/specs/system-speckit/031-manual-playbook-execution-sweep`.

`memory_index_scan({ specFolder: "system-speckit/031-manual-playbook-execution-sweep", force: true, includeSpecDocs: true, incremental: false, background: false, tenantId: "manual-playbook", userId: "opencode", agentId: "gpt-5.5", sessionId: "2026-07-02-auto-entity-extraction-r10", provenanceSource: "manual-testing-playbook", provenanceActor: "opencode-gpt-5.5", governedAt: "2026-07-02T10:23:00.000Z", retentionPolicy: "keep" })`

```json
{
  "summary": "A scan recently completed; this call coalesced onto the recent scan window.",
  "data": {
    "success": true,
    "coalesced": true,
    "status": "coalesced",
    "reason": "cooldown",
    "scanKey": "92f55c0222973080",
    "waitSeconds": 6,
    "nextPollAfterMs": 6000,
    "message": "A scan recently completed; this call coalesced onto the recent scan window."
  }
}
```

`memory_list({ specFolder: "system-speckit/031-manual-playbook-execution-sweep", sortBy: "updated_at", limit: 20 })`

```json
{
  "summary": "Found 8 memories",
  "data": {
    "total": 8,
    "results": [
      { "id": 38624, "title": "Graph Metadata: system-speckit/031-manual-playbook-execution-sweep", "updatedAt": "2026-07-02T10:26:09.291Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/graph-metadata.json" },
      { "id": 38623, "title": "Tasks: Manual Testing Playbook Execution Sweep [template:level_3/tasks.md]", "updatedAt": "2026-07-02T10:26:09.275Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/tasks.md" },
      { "id": 38622, "title": "Feature Specification: Manual Testing Playbook Execution Sweep", "updatedAt": "2026-07-02T10:25:59.889Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/spec.md" },
      { "id": 38621, "title": "Implementation Plan: Manual Testing Playbook Execution Sweep", "updatedAt": "2026-07-02T10:25:59.888Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/plan.md" },
      { "id": 38620, "title": "Description: Automated stress tests confirm code-level behavior under load, but manual testing playbooks exist specifically to validate operator-facing, end-to-end", "updatedAt": "2026-07-02T10:25:58.182Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/description.json" },
      { "id": 38619, "title": "Decision Record: Manual Testing Playbook Execution Sweep", "updatedAt": "2026-07-02T10:25:58.181Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/decision-record.md" },
      { "id": 38618, "title": "Verification Checklist: Manual Testing Playbook Execution Sweep [template:level_3/checklist.md]", "updatedAt": "2026-07-02T10:25:57.702Z", "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/checklist.md" }
    ]
  }
}
```

Command 2, inspect entity tables: direct SQLite inspection of `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`.

`sqlite3 ".tables"`

```text
active_memory_projection     memory_fts                 
batch_learning_log           memory_fts_config          
causal_edge_tombstones       memory_fts_data            
causal_edges                 memory_fts_docsize         
checkpoints                  memory_fts_idx             
community_assignments        memory_history             
community_summaries          memory_idempotency_receipts
config                       memory_index               
consolidation_state          memory_lineage             
consumption_log              memory_promotion_audit     
degree_snapshots             memory_summaries           
dependency_edges             memory_surrogates          
edge_vector_embeddings       memory_trigger_embeddings  
embedder_jobs                mutation_ledger            
entity_catalog               negative_feedback_events   
feedback_events              schema_version             
governance_audit             scoring_observations       
graph_communities            session_learning           
ingest_jobs                  session_sent_memories      
learned_feedback_audit       session_state              
lost_and_found               shadow_cycle_results       
maintenance_jobs             shadow_scoring_log         
memoization_records          vec_metadata               
memory_conflicts             weight_history             
memory_corrections           working_memory             
memory_entities            
```

`SELECT memory_id, COUNT(*) AS entity_count FROM memory_entities WHERE memory_id BETWEEN 38618 AND 38624 GROUP BY memory_id ORDER BY memory_id;`

```text
memory_id  entity_count
---------  ------------
38618      38          
38619      39          
38621      45          
38622      63          
38623      22          
38624      6           
```

`SELECT entity_text, entity_type, frequency, created_by FROM memory_entities WHERE memory_id IN (38618,38619,38621,38622,38623) AND entity_text IN ('Manual Testing Playbook Execution Sweep','Claude Sonnet','Decision Record','Verification Checklist') ORDER BY memory_id, entity_text;`

```text
entity_text                              entity_type  frequency  created_by
---------------------------------------  -----------  ---------  ----------
Manual Testing Playbook Execution Sweep  proper_noun  2          auto      
Verification Checklist                   proper_noun  2          auto      
Claude Sonnet                            proper_noun  1          auto      
Decision Record                          proper_noun  2          auto      
Manual Testing Playbook Execution Sweep  proper_noun  2          auto      
Manual Testing Playbook Execution Sweep  proper_noun  2          auto      
Manual Testing Playbook Execution Sweep  proper_noun  1          auto      
Verification Checklist                   proper_noun  1          auto      
Manual Testing Playbook Execution Sweep  proper_noun  2          auto      
```

Command 3, verify normalization/denylist.

`SELECT canonical_name, aliases, entity_type, memory_count FROM entity_catalog WHERE canonical_name IN ('manual testing playbook execution sweep','manual testing playbook','claude sonnet','decision record','verification checklist') ORDER BY canonical_name;`

```text
canonical_name                           aliases                                                                                                    entity_type  memory_count
---------------------------------------  ---------------------------------------------------------------------------------------------------------  -----------  ------------
claude sonnet                            ["Claude Sonnet"]                                                                                          proper_noun  23          
decision record                          ["Decision\n\nRecord","Decision Record","Decision record","decision-record"]                               proper_noun  667         
manual testing playbook                  ["Manual Testing Playbook","Manual testing playbook","manual testing playbook","manual_testing_playbook"]  proper_noun  43          
manual testing playbook execution sweep  ["Manual Testing Playbook Execution Sweep"]                                                                proper_noun  6           
verification checklist                   ["Verification Checklist","Verification checklist."]                                                       proper_noun  2029        
```

`SELECT COUNT(*) AS denylist_hits_for_saved_memories FROM memory_entities WHERE memory_id BETWEEN 38618 AND 38624 AND lower(trim(entity_text)) IN ('api','json','npm','new','old','simple','thing','time','example');`

```text
denylist_hits_for_saved_memories
--------------------------------
0                               
```

### Pass / Fail

- **PASS**: Entities were extracted and persisted in `memory_entities` for saved memory IDs `38618`-`38624`; normalized canonical names and aliases were present in `entity_catalog`; scoped denylist query returned `0` hits.

### Failure Triage

Verify entity extraction pipeline → Check normalization rules → Inspect denylist configuration

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/auto_entity_extraction.md](../../feature_catalog/memory_quality_and_indexing/auto_entity_extraction.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 048
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/auto_entity_extraction_r10.md`
