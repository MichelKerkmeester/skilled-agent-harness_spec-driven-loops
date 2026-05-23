# RCAF DEEP RESEARCH — ITERATION 2 — applicability mapping (P-NNN → deep-agent-improvement)

## ROLE
Expert mapper. For each of 36 catalogued patterns (P-001..P-036), classify deep-agent-improvement applicability as APPLY / SKIP / ADAPT / ALREADY-DONE with file:line evidence.

## CONTEXT

Iter 2 of 10. Iter-1 baseline:
- 36 patterns catalogued across 17 types
- Applicability hints: 11 agent-improvement-candidate / 10 bilateral / 9 research-only / 4 unknown / 2 review-only
- Type distribution: MIXED-EXECUTOR (9), FIX-PACK (5), ADJUDICATION-ITER (4), RUNTIME-RELOCATION (3), WORKFLOW-YAML (2), COLLATERAL (2), plus 11 single-pattern types

Source: `iterations/iteration-001.md` + `deltas/iter-001.jsonl`

## ACTION

**Step 1: Read iter-1 inventory**

Read both files. Note the patterns' arcs + types + applicability hints.

**Step 2: For EACH of 36 patterns, classify**

Categories:
- **APPLY**: clearly applicable to deep-agent-improvement; warrants uplift packet
- **SKIP**: deep-review/research-specific; no deep-agent-improvement analog
- **ADAPT**: applies in modified form (e.g. a review-loop pattern translated to agent-evaluator semantics)
- **ALREADY-DONE**: deep-agent-improvement already has this pattern (verify by reading skill code/docs)

For each, cite file:line evidence (where in deep-agent-improvement the pattern exists or would land).

Key surfaces to grep:
- `.opencode/skills/deep-agent-improvement/SKILL.md` (skill body)
- `.opencode/skills/deep-agent-improvement/scripts/` (executors, evaluators)
- `.opencode/skills/deep-agent-improvement/references/` (protocols)
- `.opencode/skills/deep-agent-improvement/assets/` (templates, configs)
- `.opencode/commands/improve/agent.md` (command wrapper if exists)
- Recent improvement-arc spec folders that exercised the skill

**Step 3: Aggregate priority + effort**

For APPLY + ADAPT verdicts, assign:
- Priority: P0 (blocker) / P1 (recommended) / P2 (nice-to-have)
- Effort: S / M / L

Special focus: the high-value patterns from iter-1 are:
- **MIXED-EXECUTOR (9 patterns)** — does deep-agent-improvement already use mixed-executor? Or single-executor? If single, APPLY is high priority.
- **ADJUDICATION-ITER (4 patterns)** — does deep-agent-improvement filter false-positives via an adjudication pass?
- **CONVERGENCE-TRANSPARENCY (DR-003)** — does the skill surface uncovered criteria / unscored dimensions?
- **CONTENT-HASH-DEDUP (DR-005)** — does the skill dedup duplicate evaluator findings?

**Step 4: Write findings**

`.../iterations/iteration-002.md`:
```markdown
# Iteration 2 — Applicability Mapping

## Summary
<paragraph: verdict distribution>

## Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|

## Mapping Table

| P-NNN | Type | Verdict | Priority | Effort | DAI File(s) | Evidence |

## High-Priority Uplift Candidates (APPLY + ADAPT, P0/P1)

<list>

## Already-Done Confirmations

<list with file:line>

## Next-Iter Suggestions

- Iter-3 bilateral verify: confirm each ALREADY-DONE
- Iter-4 DAI-specific gaps not surveyed in 117-122
```

`.../deltas/iter-002.jsonl`:
```jsonl
{"iter":2,"pattern_id":"P-001","verdict":"APPLY","priority":"P1","effort":"M","target":".opencode/skills/deep-agent-improvement/...","evidence":"<grep>"}
```

WRITE BOTH FILES.

## FORMAT

- file:line citations mandatory
- Verify before claiming ALREADY-DONE
- DO NOT modify outside `.../123-.../001-.../research/`

After both files, print:
`ITER-2 DONE: APPLY=<N>/ADAPT=<N>/SKIP=<N>/ALREADY-DONE=<N>, P0=<N> P1=<N> P2=<N>`
