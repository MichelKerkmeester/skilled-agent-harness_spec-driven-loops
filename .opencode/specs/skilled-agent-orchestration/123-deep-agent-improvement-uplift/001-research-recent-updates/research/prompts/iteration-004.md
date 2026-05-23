# RCAF DEEP RESEARCH — ITERATION 4 — deep-agent-improvement-specific gaps

## ROLE
Expert researcher identifying deep-agent-improvement-specific quality gaps that 117-122 patterns wouldn't surface. Find issues PARTICULAR to evaluator-first agent improvement semantics.

## CONTEXT

Iter 4 of 10. Prior:
- Iter-1: 36 patterns catalogued
- Iter-2: 8 APPLY / 2 ADAPT / 22 SKIP / 4 ALREADY-DONE; 3 P0 / 5 P1 / 2 P2
- Iter-3: 0/3 P0s confirmed (all reclassified to P1); 3/4 ALREADY-DONE confirmed

Cumulative uplift queue (post-adjudication): ~0 P0 / ~8 P1 (5 + 3 reclassified) / ~2 P2.

## ACTION

This iter pivots: **what does deep-agent-improvement need that 117-122 audits wouldn't catch?**

Agent-improvement-specific surfaces:
- 5-dimensional scoring rubric
- Dynamic profiling (per-task agent profile selection)
- Packet-local candidate proposals
- Guarded promotion (acceptance gates before agent definition lands)
- Evaluator-first design (eval before mutate)

**Step 1: Read deep-agent-improvement skill end-to-end**

Read:
- `.opencode/skills/deep-agent-improvement/SKILL.md` (full, not skim)
- `.opencode/skills/deep-agent-improvement/scripts/` (1-2 representative scripts)
- `.opencode/skills/deep-agent-improvement/references/` (1-2 protocol docs)
- `.opencode/skills/deep-agent-improvement/assets/` (1-2 templates)

Look for:
- 5-dim scoring implementation: is each dimension well-defined? Reproducible? Comparable across runs?
- Dynamic profiling: how is the profile selected? Is the selection logic stable / auditable?
- Packet-local candidates: where do candidates land? Are they discoverable post-run?
- Guarded promotion: what are the gates? Manual approval? Automated thresholds?
- Evaluator-first: when is the evaluator run vs when is the mutation proposed?

**Step 2: Identify gaps the recent-arc patterns don't address**

Possible agent-improvement-specific gaps:
- Stale agent definitions across runtimes (Claude/Codex/Gemini/OpenCode mirrors not synced after improvement)
- Promotion threshold drift (gate values not codified per-dimension)
- Candidate dedup (similar improvement proposals across runs accumulate)
- Cross-runtime A/B (improvement validated on Claude but not Codex/Gemini)
- Rubric drift (5-dim definitions change but scores from old runs claim new-rubric semantics)
- Per-task profile selection accuracy (was the right profile chosen?)

**Step 3: Sample-check past agent improvement runs**

Look for recent spec packets that used `/improve:agent` OR dispatched `@deep-agent-improvement`. Sample 1-2 runs. Verify:
- Did the 5-dim scoring produce coherent results?
- Was the proposal coherent + scoped?
- Did the promotion gate work as designed?

**Step 4: Compare deep-agent-improvement skill structure vs deep-review/research peers**

- Does deep-agent-improvement have feature_catalog/ + manual_testing_playbook/ + references/ + graph-metadata.json at the same depth as the post-118 deep-loop-runtime canonical companion set?
- Are the surfaces sk-doc DQI ≥ 80?

**Step 5: Write findings**

`.../iterations/iteration-004.md` + `.../deltas/iter-004.jsonl`. Use DAI-NNN finding IDs.

```jsonl
{"iter":4,"finding_id":"DAI-001","type":"agent-improvement-specific-gap","severity":"P1|P2","scope":"<area>","file":"<path>","evidence":"<quote>","fix":"<rec>"}
```

After both files:
`ITER-4 DONE: <P0>/<P1>/<P2>, dimensions=DAI-specific-gaps`
