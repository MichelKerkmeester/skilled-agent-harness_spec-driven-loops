---
title: "133 -- Dry-run preflight for memory_save"
description: "This scenario validates Dry-run preflight for memory_save for `133`. It focuses on Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects."
audited_post_018: true
version: 3.6.0.17
---

# 133 -- Dry-run preflight for memory_save

## 1. OVERVIEW

This scenario validates Dry-run preflight for memory_save for `133`. It focuses on Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects.
- Real user request: `` Please validate Dry-run preflight for memory_save against memory_stats() and tell me whether the expected signals are present: Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file. ``
- Prompt: `Validate dry-run preflight for memory_save without indexing side effects.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable

---

## 3. TEST EXECUTION

### Prompt

```
Validate dry-run preflight for memory_save without indexing side effects.
```

### Commands

1. Create a rich sandbox memory file and a thin sandbox memory file
2. `memory_stats()` and capture baseline totals
3. `memory_save({filePath:"<thin-sandbox-file>", dryRun:true})` and verify preflight details, `qualityLoop`, `sufficiency`, and `rejectionCode:"INSUFFICIENT_CONTEXT_ABORT"`
4. `memory_stats()` and `memory_search({query:"<thin title>"})` to verify no new indexed record from dry-run
5. `memory_save({filePath:"<thin-sandbox-file>", force:true})` and verify it still rejects before indexing
6. `memory_save({filePath:"<rich-sandbox-file>", dryRun:true})` and verify `would_pass:true` with no side effects
7. `memory_save({filePath:"<rich-sandbox-file>", dryRun:false})` and verify the spec-doc record becomes searchable

### Expected

Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file

### Evidence

BLOCKED before TEST EXECUTION command 1.

Observed scenario command requiring writes outside the allowed path:

```text
1. Create a rich sandbox memory file and a thin sandbox memory file
```

Observed user-scoped write constraint for this run:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
Do NOT touch any other manual testing playbook scenario file.

ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/dry_run_preflight_for_memory_save.md (this file only)
```

No `memory_stats()`, `memory_save()`, or `memory_search()` scenario command was run because command 1 is a required setup step and cannot be performed under the allowed write path constraint without creating files outside the single permitted file.

### Pass / Fail

- **Blocked**: Required sandbox setup is missing and cannot be created because this run permits writes only to `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/dry_run_preflight_for_memory_save.md`.

### Failure Triage

Inspect `handlers/memory-save.ts` dryRun and insufficiency branches, `shared/parsing/memory-sufficiency.ts`, `handlers/quality-loop.ts`, and `lib/validation/preflight.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/dry_run_preflight_for_memory_save.md](../../feature_catalog/memory_quality_and_indexing/dry_run_preflight_for_memory_save.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 133
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/dry_run_preflight_for_memory_save.md`
