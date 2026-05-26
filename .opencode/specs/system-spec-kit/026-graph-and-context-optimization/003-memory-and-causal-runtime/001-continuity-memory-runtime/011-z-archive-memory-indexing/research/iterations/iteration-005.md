# Iter 005 — z_archive doc/test propagation audit

## Focus
Training fixtures + ground-truth JSON for z_archive expectations

## New findings (not in baseline + not in prior iters)

| File:Line | Severity | Snippet | Suggested fix |
|-----------|----------|---------|---------------|
| (none) | - | - | - |

## Confirmed-already-known
- No z_archive mentions found in .opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json
- No z_archive mentions found in .opencode/skills/system-spec-kit/mcp_server/lib/eval directory
- The only "archive" mentions in ground-truth.json (queries 625, 705) refer to memory lifecycle states (HOT WARM COLD DORMANT ARCHIVED) and memory archiving decisions, not z_archive folder exclusion
- The eval system is focused on retrieval quality measurement using ground-truth query fixtures, not on indexing scope decisions

## Gaps for next iter
- 9 remaining baseline STALE-INVARIANT hits not spot-checked: checklist.md:73, implementation-summary.md:152, decision-record.md:125+347, review/iteration-001.md:27
- 2 remaining baseline STALE-DESCRIPTIVE hits not spot-checked: doctor_update.yaml:314-316+349, memory-save.ts:220
- Search for additional config files, CLI docs, and skill docs that might reference old exclusion logic
- Check if any other test files have length checks or count assertions that might break

## JSONL delta row (pasted for verification)
```json
{"type":"iteration","iteration":5,"newInfoRatio":0.0,"newHits":0,"status":"converged","focus":"training fixtures + ground-truth JSON","timestamp":"2026-05-16T11:07:00Z"}
```
