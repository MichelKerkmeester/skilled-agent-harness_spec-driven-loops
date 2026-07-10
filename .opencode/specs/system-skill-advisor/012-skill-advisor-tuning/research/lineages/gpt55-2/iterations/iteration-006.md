# Iteration 6: Atomic Reindex and Rebaseline Runbook

## Focus

Investigate charter angle 6: reindex, re-baseline, and ratchet-recapture as one atomic operation.

## Findings

1. The 001 root packet explicitly says pre-Layer-1b numbers are not comparable and that a fresh 193-row baseline is required after metadata lands [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/001-scorer-saturation-root-fix/implementation-summary.md:104].
2. 007's ratchet baseline carries fixture hashes, corpus hash, holdout hash, and ambiguity hash, so any legitimate metadata change must recapture rather than silently drift [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:3].
3. 008 avoids live daemon vector DB access for semantic-shadow ablation because of native-ABI/SIGBUS fragility [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:95].
4. The projection fallback distinguishes absent DB, SQLite failure, and filesystem fallback, so runbook evidence should record `projection.source` on each measurement [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:695].

## Sources Consulted

- `001-scorer-saturation-root-fix/implementation-summary.md`
- `scripts/routing-accuracy/scorer-eval-baseline.json`
- `008-semantic-shadow-prove-or-freeze/implementation-summary.md`
- `lib/scorer/projection.ts`

## Assessment

- newInfoRatio: 0.38
- Novelty: converted scattered cautions into a concrete ordering proposal.
- Confidence: medium-high; exact commands should be finalized by the implementation owner.

## Reflection

- Worked: using prior packet constraints as hard ordering requirements.
- Failed: no command execution, by request.
- Ruled out: rebaseline before metadata changes.

## Recommended Next Focus

Define `conflicts_with` authoring criteria.
