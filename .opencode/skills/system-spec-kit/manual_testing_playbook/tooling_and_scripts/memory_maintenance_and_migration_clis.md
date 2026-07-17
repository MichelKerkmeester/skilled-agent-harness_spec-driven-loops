---
title: "239 -- Memory Maintenance and Migration CLIs"
description: "This scenario validates memory maintenance and migration CLIs for `239`. It focuses on confirming dry-run reporting, cleanup and parser regression coverage, and ranking output."
version: 3.6.0.12
id: tooling-and-scripts-memory-maintenance-and-migration-clis
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 239 -- Memory Maintenance and Migration CLIs

## 1. OVERVIEW

This scenario validates memory maintenance and migration CLIs for `239`. It focuses on confirming dry-run reporting, cleanup and parser regression coverage, and ranking output.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm dry-run migration reporting, cleanup/parser regression coverage, and ranking output.
- Real user request: `Please validate Memory Maintenance and Migration CLIs against node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json and tell me whether the expected signals are present: backfill dry-run writes a JSON report; cleanup and parser regression scripts pass; rank-memories prints a structured summary for the sample JSON input.`
- Prompt: `Validate Memory Maintenance and Migration CLIs against node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: backfill dry-run writes a JSON report; cleanup and parser regression scripts pass; rank-memories prints a structured summary for the sample JSON input
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the maintenance surface behaves deterministically in dry-run and regression-driven validation modes

---

## 3. TEST EXECUTION

### Prompt

```
Validate Memory Maintenance and Migration CLIs against node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json and report cited pass/fail evidence.
```

### Commands

1. `node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json`
2. `node .opencode/skills/system-spec-kit/scripts/tests/test-frontmatter-backfill.js`
3. `node .opencode/skills/system-spec-kit/scripts/tests/test-cleanup-orphaned-vectors.js`
4. `node .opencode/skills/system-spec-kit/scripts/tests/test-ast-parser.js`
5. `printf '[{\"path\":\"memory/demo.md\",\"title\":\"Demo Memory\",\"importance_tier\":\"important\",\"updated_at\":\"2026-03-26T00:00:00.000Z\"}]' > /tmp/memories.json`
6. `node .opencode/skills/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json`

### Expected

Backfill dry-run succeeds and writes `/tmp/frontmatter-dry-run.json`; cleanup and parser scripts pass; rank-memories prints structured ranking output for the sample dataset

### Evidence

Command 1 output:

```text
=== Frontmatter Migration Summary ===
Mode:      dry-run
Total:     62212
Changed:   57534
Unchanged: 4182
Failed:    496
Malformed: 496
Skipped:   0

By kind:
  memory:memory -> 6/6 changed
  spec_doc:checklist -> 7415/8080 changed
  spec_doc:decision_record -> 2398/2795 changed
  spec_doc:handover -> 377/454 changed
  spec_doc:implementation_summary -> 11023/11546 changed
  spec_doc:plan -> 11204/12035 changed
  spec_doc:research -> 1296/1380 changed
  spec_doc:spec -> 12720/13567 changed
  spec_doc:tasks -> 11083/11820 changed
  template:template -> 12/33 changed

Report: /tmp/frontmatter-dry-run.json
```

Observed `/tmp/frontmatter-dry-run.json` excerpt:

```json
{
  "generatedAt": "2026-07-02T21:22:56.389Z",
  "mode": "dry-run",
  "options": {
    "includeArchive": true,
    "skipTemplates": false,
    "allowMalformed": false
  },
  "summary": {
    "total": 62212,
    "changed": 57534,
    "unchanged": 4182,
    "failed": 496,
    "malformedSkipped": 496,
    "skippedDirs": 0
  }
}
```

Command 2 output:

```text
=== Frontmatter Backfill Tests ===
  [PASS] T-FMB-001: Thematic separator after comments is not frontmatter
         detectFrontmatter().found === false
  [PASS] T-FMB-002: Unknown keys preserved
         custom_meta retained in output frontmatter
  [PASS] T-FMB-003: Truncated title keeps suffix
         length=116
  [PASS] T-FMB-004: CLI idempotency
         dry-run after apply reports 0 changed
  [PASS] T-FMB-005: Managed keys normalize case-insensitively
         legacy key casing collapsed into canonical managed keys
  [PASS] T-FMB-006: Inline arrays preserve quoted commas
         quoted comma value retained as single trigger phrase
  [PASS] T-FMB-007: Strict malformed handling reports and fails
         malformed=1, failed=1, unchanged=true
  [PASS] T-FMB-008: Template-path coverage included by default
         template files processed=33, skipTemplates=false
  [PASS] T-FMB-009: Malformed in-block list is skipped
         malformedFrontmatter=true and content unchanged
  [PASS] T-FMB-010: Inline arrays support trailing comments
         array parsed before YAML comment
  [PASS] T-FMB-T239-001: Nested YAML objects preserved
         custom_nested sub-keys retained
  [PASS] T-FMB-T239-002: Empty trigger_phrases array handled
         frontmatter output valid
  [PASS] T-FMB-T239-003: Duplicate casing collapses to one key
         trigger_phrases count=1
  [PASS] T-FMB-T239-004: No opening delimiter is not frontmatter
         detectFrontmatter().found=false
  [PASS] T-FMB-T239-005: Unicode content preserved in frontmatter
         Unicode chars retained

Summary: pass=15, fail=0
```

Command 3 output:

```text
📊 TEST SUMMARY
=============================================
✅ Passed:  53
❌ Failed:  0
⏭️  Skipped: 1
📝 Total:   54

🎉 ALL TESTS PASSED!
```

Command 4 output:

```text
PASS: exports parseMarkdownSections
PASS: re-exports chunkMarkdown
PASS: re-exports splitIntoBlocks
PASS: returns section array
PASS: returns multiple structured sections
PASS: captures heading section
PASS: captures code section
PASS: captures table section
PASS: extracts heading titles

Result: passed=9 failed=0
```

Command 5 output:

```text
(no output)
```

Command 6 output:

```json
{
  "constitutional": [],
  "recentlyActive": [
    {
      "folder": "unknown",
      "simplified": "unknown",
      "score": 0.64,
      "memoryCount": 1,
      "lastUpdate": "2026-07-02T21:23:42.275Z",
      "lastUpdateRelative": "just now",
      "topTier": "normal",
      "isArchived": false
    }
  ],
  "highImportance": [],
  "recentMemories": [
    {
      "id": 0,
      "title": "Demo Memory",
      "specFolder": "unknown",
      "simplified": "unknown",
      "updatedAt": "2026-07-02T21:23:42.275Z",
      "updatedAtRelative": "just now",
      "tier": "normal"
    }
  ],
  "stats": {
    "totalMemories": 1,
    "totalFolders": 1,
    "activeFolders": 1,
    "archivedFolders": 0,
    "showingArchived": false
  }
}
```

### Pass / Fail

- **PASS**: the dry-run/report path wrote `/tmp/frontmatter-dry-run.json`, the frontmatter/cleanup/parser regression scripts reported `fail=0` or `Failed:  0`, and `rank-memories.js` produced structured JSON output for the sample dataset.

### Failure Triage

Inspect `scripts/memory/backfill-frontmatter.ts`, `cleanup-orphaned-vectors.ts`, `ast-parser.ts`, and `rank-memories.ts` if one command fails or returns malformed output

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/memory_maintenance_and_migration_clis.md](../../feature_catalog/tooling_and_scripts/memory_maintenance_and_migration_clis.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 239
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/memory_maintenance_and_migration_clis.md`
