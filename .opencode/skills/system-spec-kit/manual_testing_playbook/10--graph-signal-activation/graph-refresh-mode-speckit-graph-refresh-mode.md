---
title: "156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE)"
description: "This scenario validates graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) for `156`. It focuses on enabling write_local mode, saving a spec-doc record, and verifying dirty-node tracking fires."
audited_post_018: true
---

# 156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE)

## 1. OVERVIEW

This scenario validates graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) for `156`. It focuses on enabling write_local mode, saving a spec-doc record, and verifying dirty-node tracking fires.

---

## 2. SCENARIO CONTRACT


- Objective: Verify dirty-node tracking fires in write_local mode.
- Real user request: `Please validate Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) against SPECKIT_GRAPH_REFRESH_MODE=write_local and tell me whether the expected signals are present: markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute.`
- Prompt: `Validate graph refresh write-local mode and cite dirty-node tracking, local recompute, component size estimation, and cleanup.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if onWrite() returns mode='write_local', localRecomputed=true, dirtyNodes >= 1, and skipped=false; FAIL if dirty-node set remains empty or localRecomputed=false

---

## 3. TEST EXECUTION

### Prompt

```
Validate graph refresh write-local mode and cite dirty-node tracking, local recompute, component size estimation, and cleanup.
```

### Commands

1. `SPECKIT_GRAPH_REFRESH_MODE=write_local`
2. `memory_save({ ... })` with content containing entity relationships
3. Verify `onWrite()` return shape
4. `npx vitest run tests/graph-lifecycle.vitest.ts`

### Expected

markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute

### Evidence

GraphRefreshResult output with mode='write_local', dirtyNodes >= 1, localRecomputed=true + test transcript

### Pass / Fail

- **Pass**: onWrite() returns mode='write_local', localRecomputed=true, dirtyNodes >= 1, and skipped=false
- **Fail**: dirty-node set remains empty or localRecomputed=false

### Failure Triage

Check resolveGraphRefreshMode() → Verify SPECKIT_GRAPH_REFRESH_MODE env is set → Inspect markDirty() input nodeIds → Check estimateComponentSize() threshold (default 50)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/graph-lifecycle-refresh.md](../../feature_catalog/10--graph-signal-activation/graph-lifecycle-refresh.md)
- Feature flag reference: [19--feature-flag-reference/1-search-pipeline-features-speckit.md](../19--feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/graph-lifecycle.ts`

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 156
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/graph-refresh-mode-speckit-graph-refresh-mode.md`
