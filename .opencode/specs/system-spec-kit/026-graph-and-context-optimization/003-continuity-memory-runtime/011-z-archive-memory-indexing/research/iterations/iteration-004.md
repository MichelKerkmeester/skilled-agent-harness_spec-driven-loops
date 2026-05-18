# Iter 004 — z_archive doc/test propagation audit

## Focus
Audit recent packets under 026 (007, 008, 010, 011, 012, 013, 014) for z_archive memory indexing exclusion claims

## New findings (not in baseline + not in prior iters)

| File:Line | Severity | Snippet | Suggested fix |
|-----------|----------|---------|---------------|
| (none) | - | - | - |

## Confirmed-already-known
- 005-code-graph: 50 z_archive references all relate to code-graph scan excludes (separate system from memory indexing)
- 006-skill-advisor: 100 z_archive references are mostly historical path citations to archived packets or research questions about skill-graph daemon behavior
- 008-template-levels: 17 z_archive references are about archive marker validation sweeps, not memory indexing
- 011-cocoindex-daemon-resilience: 0 matches
- 009-causal-graph-channel-routing: 0 matches
- 010-doctor-update-orchestrator: 4 z_archive references are about archival records and crash handling, not memory indexing exclusion
- 014-local-embeddings-migration: 46 z_archive references are within test corpus embedded content, not code claims

## Gaps for next iter
- 9 remaining baseline STALE-INVARIANT hits not spot-checked: checklist.md:73, implementation-summary.md:152, decision-record.md:125+347, review/iteration-001.md:27
- 2 remaining baseline STALE-DESCRIPTIVE hits not spot-checked: doctor_update.yaml:314-316+349, memory-save.ts:220
- Search for additional config files, CLI docs, and skill docs that might reference old exclusion logic
- Check if any other test files have length checks or count assertions that might break

## JSONL delta row (pasted for verification)
```json
{"type":"iteration","iteration":4,"newInfoRatio":0.0,"newHits":0,"status":"converged","focus":"recent packets under 026 audit","timestamp":"2026-05-16T11:06:00Z"}
```
