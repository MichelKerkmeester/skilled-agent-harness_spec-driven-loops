---
title: "099 -- Real-time filesystem watching (P1-7)"
description: "This scenario validates Real-time filesystem watching (P1-7) for `099`. It focuses on Confirm file watcher debounce, hash seeding, and ENOENT grace."
version: 3.6.0.15
id: tooling-and-scripts-real-time-filesystem-watching-p1-7
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 099 -- Real-time filesystem watching (P1-7)

## 1. OVERVIEW

This scenario validates Real-time filesystem watching (P1-7) for `099`. It focuses on Confirm file watcher debounce, hash seeding, and ENOENT grace.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm file watcher debounce, hash seeding, and ENOENT grace.
- Real user request: `Please validate Real-time filesystem watching (P1-7) against SPECKIT_FILE_WATCHER=true and tell me whether the expected signals are present: File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash.`
- Prompt: `Validate Real-time filesystem watching (P1-7) against SPECKIT_FILE_WATCHER=true and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if debounce works, hash dedup prevents redundant reindex, and ENOENT is handled silently

---

## 3. TEST EXECUTION

### Prompt

```
Validate Real-time filesystem watching (P1-7) against SPECKIT_FILE_WATCHER=true and report cited pass/fail evidence.
```

### Commands

1. set `SPECKIT_FILE_WATCHER=true` and start server
2. create a new `.md` file in a watched spec directory → verify `add` event seeds the hash cache
3. modify the file → verify reindex triggers after 2s debounce
4. modify with identical content → verify NO redundant reindex (hash dedup)
5. rapidly create then delete a file → verify no ENOENT crash (graceful handling)

### Expected

File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash

### Evidence

BLOCKED before executing filesystem watcher commands because the required Commands section needs writes outside the only allowed write path:

```
39: 2. create a new `.md` file in a watched spec directory → verify `add` event seeds the hash cache
40: 3. modify the file → verify reindex triggers after 2s debounce
41: 4. modify with identical content → verify NO redundant reindex (hash dedup)
42: 5. rapidly create then delete a file → verify no ENOENT crash (graceful handling)
```

The active task constraints only allow this file to be modified:

```
.opencode/skills/system-spec-kit/manual_testing_playbook/tooling_and_scripts/real_time_filesystem_watching_p1_7.md
```

No watched spec file was created, modified, or deleted, so no real `[file-watcher]` add/debounce/dedup/ENOENT transcript could be collected without violating the allowed write path constraint.

### Pass / Fail

- **BLOCKED**: Commands 2-5 require creating, modifying, and deleting watched spec files outside the single allowed write path, so the expected watcher signals could not be verified under the active constraints.

### Failure Triage

Inspect `lib/ops/file-watcher.ts` for `seedHash`, `scheduleReindex`, and ENOENT catch

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/real_time_filesystem_watching_with_chokidar.md](../../feature_catalog/tooling_and_scripts/real_time_filesystem_watching_with_chokidar.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 099
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/real_time_filesystem_watching_p1_7.md`
