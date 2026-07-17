---
title: "207 -- Watcher delete/rename cleanup"
description: "This scenario validates watcher delete/rename cleanup for `207`. It focuses on confirming stale index entries are purged on delete and rename."
version: 3.6.0.11
id: tooling-and-scripts-watcher-delete-rename-cleanup
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 207 -- Watcher delete/rename cleanup

## 1. OVERVIEW

This scenario validates watcher delete/rename cleanup for `207`. It focuses on confirming stale index entries are purged on delete and rename.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm delete and rename cleanup remove stale index state.
- Real user request: `Please validate Watcher delete/rename cleanup against the documented validation surface and tell me whether the expected signals are present: unlink events call removeFn for deleted markdown files; rename removes the old path and indexes the new path; the default 2-second debounce window collapses rapid rename/change bursts to one stable reindex; burst renames keep only the final path indexed; concurrent renames remove all stale paths and keep all renamed paths indexed.`
- Prompt: `Validate Watcher delete/rename cleanup against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: unlink events call removeFn for deleted markdown files; rename removes the old path and indexes the new path; the default 2-second debounce window collapses rapid rename/change bursts to one stable reindex; burst renames keep only the final path indexed; concurrent renames remove all stale paths and keep all renamed paths indexed
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if stale paths are removed, renamed paths are reindexed, and no orphaned entries remain after delete, rename, burst-rename, or concurrent-rename flows

---

## 3. TEST EXECUTION

### Prompt

```
Validate Watcher delete/rename cleanup against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. run the file-watcher Vitest suite and capture the delete/unlink scenario where removeFn is called for a deleted markdown file
2. capture the rename lifecycle scenario showing unlink on the old path and add on the new path
3. capture the default-window debounce scenario proving rapid changes within the 2-second window coalesce to one reindex
4. capture the burst-rename scenario showing only the final path remains indexed
5. capture the concurrent-rename scenario showing every stale path is removed and every renamed path is indexed

### Expected

unlink events call removeFn for deleted markdown files; rename removes the old path and indexes the new path; the default 2-second debounce window collapses rapid rename/change bursts to one stable reindex; burst renames keep only the final path indexed; concurrent renames remove all stale paths and keep all renamed paths indexed

### Evidence

Command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server`:

```text
npm run test:file-watcher

> @spec-kit/mcp-server@1.8.0 test:file-watcher
> vitest run tests/file-watcher.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  00:22:18
   Duration  128ms (transform 33ms, setup 12ms, import 31ms, tests 27ms, environment 0ms)
```

Verbose evidence command run from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/file-watcher.vitest.ts --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > calls removeFn when a markdown file is deleted
[file-watcher] Removed indexed entries for sample.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > removes old entry and indexes new entry on file rename
[file-watcher] Removed indexed entries for rename-old.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > removes old entry and indexes new entry on file rename
[file-watcher] Reindexed rename-new.md in 0ms (total: 6 files, avg: 500ms)

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > debounces rapid changes within the 2-second default window to one reindex
[file-watcher] Reindexed debounce-default-window.md in 0ms (total: 7 files, avg: 429ms)

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles burst renames and keeps only final path indexed
[file-watcher] Removed indexed entries for burst-0.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles burst renames and keeps only final path indexed
[file-watcher] Removed indexed entries for burst-1.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles burst renames and keeps only final path indexed
[file-watcher] Removed indexed entries for burst-2.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles burst renames and keeps only final path indexed
[file-watcher] Reindexed burst-3.md in 0ms (total: 8 files, avg: 375ms)

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files
[file-watcher] Removed indexed entries for alpha.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files
[file-watcher] Removed indexed entries for beta.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files
[file-watcher] Removed indexed entries for gamma.md

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files
[file-watcher] Reindexed alpha-renamed.md in 0ms (total: 9 files, avg: 333ms)

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files
[file-watcher] Reindexed beta-renamed.md in 0ms (total: 10 files, avg: 300ms)

stderr | mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files
[file-watcher] Reindexed gamma-renamed.md in 0ms (total: 11 files, avg: 273ms)

 ✓ mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > calls removeFn when a markdown file is deleted 1ms
 ✓ mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > removes old entry and indexes new entry on file rename 2ms
 ✓ mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > debounces rapid changes within the 2-second default window to one reindex 3ms
 ✓ mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles burst renames and keeps only final path indexed 1ms
 ✓ mcp_server/tests/file-watcher.vitest.ts > file-watcher runtime behavior > handles concurrent renames across multiple files 2ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  00:22:32
   Duration  132ms (transform 33ms, setup 12ms, import 30ms, tests 29ms, environment 0ms)
```

### Pass / Fail

- **PASS**: `npm run test:file-watcher` passed with `Test Files  1 passed (1)` and `Tests  22 passed (22)`; the verbose run showed the required delete/unlink, rename lifecycle, default debounce, burst-rename, and concurrent-rename cases all passed with stale-path removal and renamed/final-path reindex logs.

### Failure Triage

Inspect `mcp_server/lib/ops/file-watcher.ts` debounce scheduling, unlink handling, and `removeFn` wiring if stale entries persist or rename paths duplicate

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/watcher_delete_rename_cleanup.md](../../feature_catalog/tooling_and_scripts/watcher_delete_rename_cleanup.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 207
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/watcher_delete_rename_cleanup.md`
