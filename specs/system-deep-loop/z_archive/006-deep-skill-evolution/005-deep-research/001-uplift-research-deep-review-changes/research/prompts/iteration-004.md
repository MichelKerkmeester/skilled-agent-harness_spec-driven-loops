# RCAF DEEP RESEARCH — ITERATION 4 — deep-research-specific gaps

## ROLE
Expert researcher identifying deep-research-specific quality gaps that the 118 deep-review audit didn't cover. Find issues PARTICULAR to deep-research's research-loop semantics that wouldn't surface in a review-loop audit.

## CONTEXT

Iter 4 of 10. Prior:
- Iter-1: 47 catalogued changes
- Iter-2: 3 APPLY P1 / 7 ADAPT (4 P1 + 3 P2) / 10 SKIP / 27 ALREADY-DONE
- Iter-3: 27/27 ALREADY-DONE confirmed, 0 reclassifications. Strong convergence on the inventory side.

Cumulative real uplift queue: **10 candidates** (3 APPLY + 7 ADAPT).

This iter pivots: **what does deep-research need that the 118 deep-review audit wouldn't have surfaced?**

## ACTION

**Step 1: Catalog deep-research-specific surfaces**

Research-loop semantics differ from review-loop:
- Research uses `iterations/iteration-NNN.md` with research dimensions (single-dimension by design per the v1.11.0.0 changelog)
- Research has different convergence rules (uncovered claims vs new-findings ratio)
- Research has different SKILL.md trigger phrases
- Research reduces to `research.md` synthesis (progressive)

Identify deep-research files where:
- Behavior differs intentionally from deep-review (don't flag as drift)
- Behavior differs UNINTENTIONALLY (real drift; flag as P1)
- Behavior is identical to deep-review but should be specialized for research (flag as ADAPT)

Sample at least:
- `.opencode/skills/deep-research/SKILL.md`
- `.opencode/skills/deep-research/assets/` (templates, configs)
- `.opencode/skills/deep-research/scripts/reduce-state.cjs` (research's state reducer)
- `.opencode/skills/deep-research/references/` (research's protocol docs)
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`

**Step 2: Sample deep-research run artifacts**

Look at recent deep-research packets:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/006-research/002-automation-reality-supplemental-research/` (recent run)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-deep-research-arc-investigations/research-005-arc-status-check/` (per memory)
- Verify they look healthy + spot any patterns that suggest deep-research-specific gaps

**Step 3: Compare deep-research vs deep-review skill structure**

- Does deep-research have feature_catalog/? manual_testing_playbook/? references/? graph-metadata.json?
- Are they at the same depth as deep-review's?
- DQI on deep-research's main docs (SKILL.md, README.md, latest changelog) — compare to deep-review's post-118 DQI scores (95 / 98 / 75-77)

**Step 4: Identify deep-research-specific bugs that wouldn't be caught by deep-review audit**

Look for:
- Research-only constructs: progressive `research.md` synthesis, claim adjudication, uncovered-question tracking
- Single-dimension constraint enforcement
- Cross-iter context carry-over

## OUTPUT

`.../iterations/iteration-004.md` + `.../deltas/iter-004.jsonl`.

```jsonl
{"iter":4,"finding_id":"DR-NNN","type":"deep-research-specific-gap","severity":"P1|P2","scope":"<area>","file":"<path>","evidence":"<quote>","fix":"<rec>"}
```

After both files, print:
`ITER-4 DONE: <P0>/<P1>/<P2>, dimensions=deep-research-specific-gaps`
