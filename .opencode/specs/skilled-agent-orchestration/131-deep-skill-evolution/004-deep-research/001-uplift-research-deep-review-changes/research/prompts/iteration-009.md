# RCAF DEEP RESEARCH — ITERATION 9 — synthesis quality pass

## ROLE
Senior synthesizer (cli-codex gpt-5.5 high reasoning). Read all 8 prior iters + adjudication, produce a coherent uplift recommendation. Strict precision: every claim cited.

## CONTEXT

Iter 9 of 10. Prior 8 iters were cli-devin SWE-1.6. Now switching to gpt-5.5 high for synthesis quality.

Cumulative iter outcomes:
- Iter-1 (catalog): 47 changes from 118 deep-review arc cataloged
- Iter-2 (mapping): 3 APPLY P1 / 7 ADAPT (4 P1 + 3 P2) / 10 SKIP / 27 ALREADY-DONE
- Iter-3 (bilateral verify): 27/27 ALREADY-DONE confirmed
- Iter-4 (DR-specific gaps): DR-001..005 (3 P1 + 2 P2)
- Iter-5 (adversarial on code): DR-006..008 (1 P1 + 2 P2)
- Iter-6 (changelog): 0/0/0 — clean
- Iter-7 (adjudication of ~11 P1s): 2 CONFIRMED / 4 OUTDATED / 2 MISCATEGORIZED / 9 FALSE-POSITIVE
- Iter-8 (final adversarial): 2 P1 + 3 P2

## ACTION

**Step 1: Read every iter narrative + delta**

Read `iterations/iteration-001.md` through `iteration-008.md` + `deltas/iter-{001..008}.jsonl`.

**Step 2: De-duplicate findings + apply iter-7 adjudication**

For each finding F-NNN / DR-NNN / C-NNN, determine final status:
- If iter-7 marked CONFIRMED: keep at original severity
- If iter-7 marked OUTDATED: drop
- If iter-7 marked MISCATEGORIZED: reclassify to P2
- If iter-7 marked FALSE-POSITIVE: drop
- If not yet adjudicated (iter-4/5 P2s + iter-8 findings): keep at original severity

**Step 3: Group remaining findings by uplift theme**

Cluster the final findings into 3-5 themes (e.g. "documentation accuracy", "code correctness", "DRPV semantics gap"). Each theme becomes a candidate follow-on packet.

**Step 4: Prioritize**

For each theme:
- Severity: count P0 / P1 / P2
- Effort estimate: S/M/L
- Dependency: does it block anything else?
- Risk: what breaks if NOT fixed

**Step 5: Write synthesis**

`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/031-deep-research-uplift-research-deep-review-changes/research/research-report.md`:

```markdown
---
title: "Deep-Research Uplift from Deep-Review Learnings — Research Report"
description: "Final synthesis of 10-iter deep-research investigation. Verdict: 118 deep-review upgrades mostly already shipped for deep-research; small uplift queue remaining."
verdict: "PASS-WITH-UPLIFT"
total_iters: 10
recommendation_packets: <N>
---

# Research Report

## Executive Summary
<paragraph>

## Methodology
<table: 8 devin iters + iter-9-10 codex synthesis>

## Findings Summary (after adjudication)
<final P0/P1/P2 counts>

## Uplift Themes
### Theme A — <title>
- Findings: <list>
- Effort: <S/M/L>
- Priority: <P0/P1/P2>
- Recommended packet: <name>

### Theme B — ...
...

## Cross-References
- All iter files
- 118 arc spec packet
- deep-research v1.12.0.0 changelog

## Recommendation
<final go-forward plan: which themes to ship as packets, in what order, with what dependencies>
```

`.opencode/specs/.../research/deltas/iter-009.jsonl`:
```jsonl
{"iter":9,"type":"synthesis","themes":<N>,"final_P0":0,"final_P1":<N>,"final_P2":<N>,"recommended_packets":<N>}
```

After writing both:
`ITER-9 DONE: themes=<N>, final P1=<N>, final P2=<N>, packets=<N>`

## CONSTRAINTS

- READ-ONLY everywhere except the listed output files
- Sandbox workspace-write; approval policy never
- LEAF only

Strict claim discipline: every uplift candidate cites the iter that surfaced it + the iter that confirmed it (or note if unconfirmed).
