---
title: "Progress: shared progress-record type and pair validator"
description: "Shared additive progress_record JSONL event type, completion reducer allowlist and started/completed pair validator for every deep-loop mode."
---

# Progress

---

## 1. OVERVIEW

Shared `progress_record` type, completion reducer allowlist and started/completed pair validator, cross-cutting across every deep-loop mode (council, context, review, research, improvement). Every completion reducer imports this folder so the allowlist that separates completion-bearing state events from watchdog-resetting progress heartbeats lives in one place. `validateProgressRecordPair` rejects zero-delta no-op pairs so a heartbeat cannot mask a genuine stall.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `progress-record.cjs` | Defines `PROGRESS_RECORD_TYPE`/`PROGRESS_RECORD_EVENT` discriminators, the `COMPLETION_BEARING_TYPES` allowlist, `filterCompletionBearingRecords` and `validateProgressRecordPair`, which requires a completed record to carry a positive `progress_delta` or a non-empty `artifact_path`. |
| `progress-record.test.cjs` | Asserts a reducer fed only progress lines returns null or zero for completion math, that a zero-delta started/completed pair is rejected and that a real work-anchored pair is accepted. |

## 3. CONSUMERS

- `deep-research/scripts/reduce-state.cjs`
- `runtime/scripts/reduce-state.cjs`
- `runtime/scripts/compile-command-contracts.cjs`
- `deep-ai-council/scripts/lib/persist-artifacts.cjs`
- `runtime/lib/write-set-conflict-graph/shipped-census.ts`

## 4. VALIDATION

```bash
node .opencode/skills/system-deep-loop/shared/progress/progress-record.test.cjs
```

Expected: `[progress-record] 13/13 assertions passed`.
