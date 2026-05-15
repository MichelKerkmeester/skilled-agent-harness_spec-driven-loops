# Iter 042 — Track 11 (gpt-5.5 medium) — adversarial review of phase-parent classifications

You are a senior architect. Your lens: adversarial — challenge the SWE-1.6 per-phase-parent classifications and merge proposals.

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

The 4 SWE-1.6 phase-parent deep-reads:

- Track 2 (014-local-llama-cpp): `iteration-007.md`, `008.md`, `009.md`, `010.md`
- Track 3 (013-doctor-update-orchestrator): `iteration-011.md` through `014.md`
- Track 4 (007-code-graph): `iteration-015.md` through `018.md`
- Track 5 (009-hook-parity): `iteration-019.md` through `022.md`

All under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/`.

## Task

For each of the 4 phase parents, challenge SWE-1.6's:

1. **Catalog completeness:** Did SWE-1.6 miss any nested children? (Spot-check by listing the actual directory)
2. **Classification accuracy:** Are the per-packet classifications grounded in real evidence or surface-level reading?
3. **Overlap detection:** Did SWE-1.6 surface ALL overlaps within the phase parent, or miss some?
4. **Proposed phase-list quality:** Does the proposed consolidated phase-list actually reduce the phase parent's recall friction, or just shuffle the same problems?

For any flag, cite the iter number + file:line.

## Cross-reference with directory state

For each phase parent, run:

```bash
ls -1 .opencode/specs/system-spec-kit/026-graph-and-context-optimization/<NNN>-name/ | grep -E '^[0-9]{3}-' | wc -l
```

Compare to SWE-1.6's catalog count. If different, flag.

## Output contract

Print to stdout. Required heading structure:

```
# Iter 042 — Track 11: adversarial review of phase-parent classifications

## Per-parent adversarial findings
### 014-local-llama-cpp (iter 007-010)
- Catalog completeness check: <pass | miss-N-children>
- Classification accuracy check: <pass | flags>
- Overlap detection check: <pass | missed-overlap>
- Phase-list quality: <effective | shuffles-problems | weak>
- Evidence per flag: <file:line>

### 013-doctor-update-orchestrator (iter 011-014)
<same>

### 007-code-graph (iter 015-018)
<same>

### 009-hook-parity (iter 019-022)
<same>

## Summary
- Phase parents reviewed: 4
- Per-parent verdict: accept / override / flag-for-review
- Highest-impact corrections needed: <top-3>

## JSONL delta row
{"iter_id": "042", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "findings_count": <int>, "overrides_count": <int>, "primary_evidence_files": ["iter-007..022"]}
```

## Stop conditions

Emit then exit.

## Context

Companion to iter 041 — that was top-level; this is phase-parent. Together they validate SWE-1.6's classification stack before track 9 synthesizes the target-state proposal.
