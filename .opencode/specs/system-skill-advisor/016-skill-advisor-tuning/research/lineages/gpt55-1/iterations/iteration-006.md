# Iteration 6: Angle 6 - Reindex, Rebaseline, Ratchet-Recapture Runbook

## Focus

Propose the safe operation order after metadata cleanup, considering native SQLite/vector fragility and fixture-pinned ratchets.

## Findings

1. The 007 ratchet intentionally freezes eval under filesystem projection by setting an empty `MK_SKILL_ADVISOR_DB_DIR`, disabling builtin semantic, and forcing local behavior. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:90]
2. 007's baseline fails on both regressions and unrecaptured improvements; legitimate metadata fixes must run `capture-scorer-eval-baseline.mjs --write` rather than drift silently. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:132]
3. 008 explicitly avoided live daemon vector DB fragility by scoring against a fixture projection. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:95]
4. 003 used a read-only backup copy of `skill-graph.sqlite` and in-memory overlay for conflict measurements, never live-corpus mutation. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/results/metrics.json:9]
5. Proposed atomic sequence: metadata patch -> graph metadata validation -> `skill_graph_scan` -> `advisor_rebuild` -> parent-hub cross-collision report -> projection-surface guard -> scorer ratchet -> parent-hub ambiguity capture -> optional live advisor validation -> commit.

## Sources Consulted

- `scorer-eval-baseline-ratchet.vitest.ts`
- `008-semantic-shadow-prove-or-freeze/implementation-summary.md`
- `003-advisor-rrf-fusion/results/metrics.json`

## Assessment

`newInfoRatio: 0.58`

Novelty justification: combined measurement and operational constraints into one no-partial-state runbook.

Confidence: high.

## Reflection

Worked: using existing packets' operational choices as evidence.

Failed: treating reindex and recapture as separable follow-ups; they must be one reviewed operation.

Ruled out: direct live DB experiment mutation.

## Recommended Next Focus

Evaluate `conflicts_with` as a measured authoring seam, not as a blanket disambiguator.
