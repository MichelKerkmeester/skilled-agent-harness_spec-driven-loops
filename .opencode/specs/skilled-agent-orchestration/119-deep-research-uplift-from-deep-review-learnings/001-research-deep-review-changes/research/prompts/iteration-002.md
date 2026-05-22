# RCAF DEEP RESEARCH — ITERATION 2 — applicability mapping

## ROLE
Expert researcher mapping deep-review 118 arc changes to deep-research applicability. You produce a structured mapping table classifying each catalogued change as APPLY / SKIP / ADAPT / ALREADY-DONE for deep-research.

## CONTEXT

Iter 2 of 10 on the question: which 118 deep-review upgrades should propagate to deep-research?

Iter-1 catalogued 47 changes (C-001..C-047) at `.opencode/specs/skilled-agent-orchestration/119-deep-research-uplift-from-deep-review-learnings/001-research-deep-review-changes/research/deltas/iter-001.jsonl`. Types: RUNTIME-RELOCATION, MCP-REMOVAL, SCRIPT-SHIM, WORKFLOW-YAML, COLLATERAL, TEST-MIGRATION, DOC-COMPLIANCE, CANONICAL-COMPANIONS, FIX-PACK, VERSION-BUMP, plus derived.

18 changes were marked `bilateral: true` (apply to both deep-review and deep-research).

## ACTION

**Step 1: Read iter-1 inventory**
- Read `iterations/iteration-001.md` for context
- Read `deltas/iter-001.jsonl` for the full list of 47 C-NNN records

**Step 2: For EACH of 47 changes, classify deep-research applicability**

Verdict categories:
- **APPLY**: clearly applicable to deep-research; an uplift packet should propagate this change. Cite evidence: which deep-research file would change.
- **SKIP**: deep-review-specific; deep-research has no analog or doesn't need it.
- **ADAPT**: applies in modified form (e.g. a deep-review test pattern translated to deep-research's research dimensions).
- **ALREADY-DONE**: the change ALREADY shipped for deep-research (e.g. C-008 workflow YAML updated for BOTH deep-review_*.yaml AND deep-research_*.yaml in commit 107c522599; C-???: deep-research changelog v1.12.0.0).

For each verdict, cite evidence. **Verify with grep** before classifying — don't assume bilateral changes actually touched deep-research.

Key surfaces to grep:
- `.opencode/skills/deep-research/` (skill body)
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_*.yaml`
- `.opencode/skills/deep-loop-runtime/` (shared runtime — deep-research consumes this per v1.12.0.0 changelog)
- Recent commits touching deep-research: `git log --oneline -- .opencode/skills/deep-research/`

**Step 3: Aggregate priority + impact**

For APPLY + ADAPT verdicts, assign:
- Priority: P0 (blocker — workflow currently broken without it) / P1 (recommended) / P2 (nice-to-have)
- Effort: S (single edit) / M (small fix-pack) / L (multi-file refactor)

**Step 4: Write iteration-002.md + iter-002.jsonl**

`.opencode/specs/skilled-agent-orchestration/119-deep-research-uplift-from-deep-review-learnings/001-research-deep-review-changes/research/iterations/iteration-002.md`:

```markdown
# Iteration 2 — Applicability Mapping (cli-devin swe-1.6)

## Summary
<paragraph: verdict distribution; e.g. 12 APPLY / 15 SKIP / 8 ADAPT / 12 ALREADY-DONE>

## Verdict Distribution

| Verdict | Count | % |
|---------|-------|---|
| APPLY | N | % |
| ADAPT | N | % |
| SKIP | N | % |
| ALREADY-DONE | N | % |

## Mapping Table

| C-NNN | Type | Verdict | Priority | Effort | Deep-Research File(s) | Evidence |
|-------|------|---------|----------|--------|------------------------|----------|
| C-001 | RUNTIME-RELOCATION | ... | ... | ... | ... | ... |
| C-002 | ... | ... | ... | ... | ... | ... |
| ...

## High-Priority Uplift Candidates (APPLY + ADAPT, P0/P1)

<list with file:line + recommended action>

## Already-Done Confirmations (with evidence)

<list with file:line proving deep-research already received this change>

## Next-Iter Suggestions

- Verify the 18 bilateral changes from iter-1 actually landed for deep-research (iter-3 focus)
- Identify deep-research-specific gaps not covered by 118 (iter-4)

## Convergence Signal

- newFindings (verdicts): N=47 (one per iter-1 C-NNN; all classified)
- coverage gate: PASS/FAIL (all 47 mapped?)
```

`.opencode/specs/.../research/deltas/iter-002.jsonl`:
```jsonl
{"iter":2,"change_id":"C-001","verdict":"APPLY","priority":"P1","effort":"M","target":".opencode/skills/deep-research/lib/...","evidence":"<grep>"}
{"iter":2,"change_id":"C-002","verdict":"ALREADY-DONE","priority":null,"effort":null,"target":".opencode/skills/deep-research/SKILL.md","evidence":"v1.12.0.0 changelog confirms"}
...
```

WRITE BOTH FILES via tool calls.

## FORMAT

- file:line citations mandatory for evidence
- Direct grep output / file path, not paraphrase
- Verify before claiming ALREADY-DONE
- DO NOT modify files outside `.../119-.../001-.../research/`

After writing both files, print:
`ITER-2 DONE: <APPLY count>/<ADAPT count>/<SKIP count>/<ALREADY-DONE count>, P0=<N> P1=<N> P2=<N>`
