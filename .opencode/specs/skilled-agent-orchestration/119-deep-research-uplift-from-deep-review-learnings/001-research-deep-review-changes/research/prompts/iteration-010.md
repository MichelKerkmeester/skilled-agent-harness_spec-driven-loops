# RCAF DEEP RESEARCH — ITERATION 10 — final convergence claim + packet roadmap

## ROLE
Final adjudicator (cli-codex gpt-5.5 high reasoning). Test the convergence claim. Produce the recommended follow-on packet roadmap with concrete spec-folder names + scope.

## CONTEXT

Iter 10 of 10 (FINAL). Iter-9 synthesis (cli-codex):
- Verdict: PASS-WITH-UPLIFT
- 3 recommended packets
- Final actionable queue: 2 P1 (DR-003 convergence detection, DR-006 lexical sort bug) + 3 P2 (C-008 workflow YAML symmetry, DR-005 negative knowledge tracking, DR-008 stale allowed-tools)
- Major learning: 27/27 changes from 118 already shipped to deep-research; majority of findings were false-positives or outdated

Research report at `iterations/.../research/research-report.md`. Iter-9 synthesis at `iterations/iteration-009.md` (likely written too).

## ACTION

**Step 1: Convergence claim test**
- Confirm newFindingsRatio < 0.10 sustained across iters 5-8 (iter-5 = 3/52 ≈ 0.058; iter-6 = 0; iter-8 ≈ 5/57 ≈ 0.087). PASS / FAIL?
- Confirm 3 quality gates: evidence (file:line on every finding), scope (all findings in deep-research / deep-loop-runtime / consumer surfaces), coverage (all 4 research dimensions: applicability mapping / bilateral verify / DR-specific gaps / adversarial)

**Step 2: Packet roadmap**

For each of the 3 recommended packets identified in iter-9 synthesis, write:
- **Name**: `skilled-agent-orchestration/NNN-<short-name>/`
- **Scope**: which findings (DR-NNN / C-NNN) it closes
- **Level**: 1 / 2 / 3
- **Effort**: S / M / L
- **Dependencies**: blocks-on (any other packet that must ship first?)
- **Risk if NOT shipped**: what breaks / what stays broken

Suggested packets (refine in synthesis):
1. **120 deep-research-DR-fixes** (P1+P2 inline fix-pack) — 1 commit, addresses DR-003, DR-006, plus P2 follow-ups inline
2. **121 deep-research-uplift-doc-companions** (sk-doc canonical companions for deep-research IF GAPS exist) — only ship if iter-4/5 identified missing surfaces
3. **122 deep-research-test-coverage** (test coverage parity with deep-loop-runtime's 21-file test surface) — only ship if iter-4 identified gaps

The actual count may differ — let the iter-9 synthesis drive the final count.

**Step 3: Write final iter-10 narrative**

`.../iterations/iteration-010.md`:

```markdown
# Iteration 10 — Final Convergence Claim + Packet Roadmap

## Summary
<paragraph>

## Quality Gates
- Evidence: PASS — <evidence>
- Scope: PASS — <evidence>
- Coverage: PASS — <evidence>

## Convergence Math
- newFindings per iter: 4, 5, 10, 4, 1, 1, 4, 1, 0 (iter-9 was synthesis), 0 (this)
- Average iters 5-10: ~0.05 — converged
- Adjudicated stable

## Final Verdict

**PASS hasAdvisories=true** — 5 actionable items remaining (2 P1 + 3 P2)

## Recommended Packets

### Packet 1: <name>
- Spec folder: `skilled-agent-orchestration/120-<slug>/`
- Closes: <DR-NNN / C-NNN list>
- Level: <N>
- Effort: <S/M/L>
- Dependencies: <list or "none">
- Risk if NOT shipped: <text>

### Packet 2: <name>
...

### Packet 3: <name>
...

## Cross-References
- iter-9 synthesis: research-report.md
- 8 prior iter narratives
```

`.../deltas/iter-010.jsonl`:
```jsonl
{"iter":10,"type":"verdict","verdict":"PASS","hasAdvisories":true,"P1_actionable":2,"P2_actionable":3,"recommended_packets":<N>,"convergence":"sustained"}
```

After both:
`ITER-10 DONE: verdict=PASS hasAdvisories=true, packets=<N>, P1=2, P2=3`
