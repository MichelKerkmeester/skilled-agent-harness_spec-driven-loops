# Iter 003 — z_archive doc/test propagation audit

## Focus
Constitutional rules under .opencode/skills/system-spec-kit/constitutional/ for z_archive exclusion claims

## New findings (not in baseline + not in prior iters)

| File:Line | Severity | Snippet | Suggested fix |
|-----------|----------|---------|---------------|
| (none) | - | - | - |

## Confirmed-already-known
- No z_archive mentions found in constitutional/ directory (README.md, gate-enforcement.md, gate-tool-routing.md)

## Gaps for next iter
- 9 remaining baseline STALE-INVARIANT hits not spot-checked: checklist.md:73, implementation-summary.md:152, decision-record.md:125+347, review/iteration-001.md:27
- 2 remaining baseline STALE-DESCRIPTIVE hits not spot-checked: doctor_update.yaml:314-316+349, memory-save.ts:220
- Search for additional config files, CLI docs, and skill docs that might reference old exclusion logic
- Check if any other test files have length checks or count assertions that might break

## JSONL delta row (pasted for verification)
```json
{"type":"iteration","iteration":3,"newInfoRatio":0.0,"newHits":0,"status":"converged","focus":"constitutional rules audit","timestamp":"2026-05-16T11:05:00Z"}
```
