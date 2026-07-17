---
title: "004 -- SHA-256 content-hash deduplication (TM-02)"
description: "This scenario validates SHA-256 content-hash deduplication (TM-02) for `004`. It focuses on Confirm identical re-save skips embedding."
audited_post_018: true
version: 3.6.0.17
id: bug-fixes-and-data-integrity-sha-256-content-hash-deduplication-tm-02
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 004 -- SHA-256 content-hash deduplication (TM-02)

## 1. OVERVIEW

This scenario validates SHA-256 content-hash deduplication (TM-02) for `004`. It focuses on Confirm identical re-save skips embedding.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm identical re-save skips embedding and the save-path SQL stays on exact-match predicates.
- Real user request: `` Please validate SHA-256 content-hash deduplication (TM-02) against / and tell me whether the expected signals are present: Second save returns skip/no-op status; no new embedding row created; content hash matches; SQL shape contains direct `canonical_file_path = ?` / `file_path = ?` probes and exact scope clauses such as `tenant_id = ?` or `user_id IS NULL`. ``
- Prompt: `Validate SHA-256 content-hash deduplication (TM-02) and confirm identical re-saves skip embeddings with exact-match SQL probes.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Second save returns skip/no-op status; no new embedding row created; content hash matches; SQL shape contains direct `canonical_file_path = ?` / `file_path = ?` probes and exact scope clauses such as `tenant_id = ?` or `user_id IS NULL`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Re-save skips embedding, reports duplicate, and emits exact-match SQL without nullable OR scope predicates; FAIL: Duplicate embedding created, hash mismatch, or SQL still depends on nullable OR predicates

---

## 3. TEST EXECUTION

### Prompt

```
Validate SHA-256 content-hash deduplication (TM-02) and confirm identical re-saves skip embeddings with exact-match SQL probes.
```

### Commands

1. Save once
2. Save identical payload
3. Verify embedding skipped
4. Capture SQL-shape evidence for the unchanged-save and content-hash probes

### Expected

Second save returns skip/no-op status; no new embedding row created; content hash matches; SQL shape contains direct `canonical_file_path = ?` / `file_path = ?` probes and exact scope clauses such as `tenant_id = ?` or `user_id IS NULL`

### Evidence

Save output for both calls + DB query showing single embedding row + SQL/test evidence showing no `(canonical_file_path = ? OR file_path = ?)` and no `? IS NULL` predicates

### Pass / Fail

- **Pass**: Re-save skips embedding, reports duplicate, and emits exact-match SQL without nullable OR scope predicates
- **Fail**: Duplicate embedding created, hash mismatch, or SQL still depends on nullable OR predicates

### Failure Triage

Verify SHA-256 hash computation → Check content normalization before hashing → Inspect dedup lookup query shape (`T320-1`, `T320-2`)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [bug_fixes_and_data_integrity/sha_256_content_hash_deduplication.md](../../feature_catalog/bug_fixes_and_data_integrity/sha_256_content_hash_deduplication.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `bug_fixes_and_data_integrity/sha_256_content_hash_deduplication_tm_02.md`
