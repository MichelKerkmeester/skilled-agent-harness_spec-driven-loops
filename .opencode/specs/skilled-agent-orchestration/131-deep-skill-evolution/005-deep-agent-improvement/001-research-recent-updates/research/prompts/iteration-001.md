# RCAF DEEP RESEARCH — ITERATION 1 — survey of recent deep-review + deep-research updates

## ROLE
Expert researcher cataloging recent updates (arcs 117-122) shipped for deep-review + deep-research, and characterizing the TYPE / SCOPE / PATTERN of each so subsequent iters can map applicability to deep-agent-improvement.

## CONTEXT

This is ITERATION 1 of 10 on: **which recent updates to deep-review + deep-research should propagate to the deep-agent-improvement skill?**

The packets to survey (origin/main commits, most recent first):
- `156c514989` chore(119): memory:save metadata refresh
- `5fe6cc4c1e` chore(119+121+122): folder rename + path-ref update
- `21a9a9ad73` feat(121+122): DR-003 uncovered-questions + hygiene fix-pack
- `d35834d321` fix(120): DR-006 numeric sort
- `f02c9425c8` research(119): 10-iter deep-research complete
- `56456514ce` fix(118): deep-review fix-pack — close P1/P2 advisories
- `aa593eb897` review(118): cli-devin deep-review iters 3-10 + synthesis
- `f8f3bdcac6` review(118): cli-devin SWE-1.6 deep-review iters 1-2
- `d485837718` chore(118): deferred-items closure
- `14b40f23b3` chore(118/008): closeout
- `71042e1a33` chore(118): sk-doc canonical companions
- `1a32678e7b` chore(118): sk-doc conformance pass on SKILL.md + README.md
- `be2e777a4f` feat(118/007): split tests by responsibility
- `e590c12e19` feat(118/006): /doctor + system-code-graph collateral updates
- `107c522599` feat(118/002-005): deep-loop FULL_ISOLATE transition
- `954702a8f4` feat(118/001): scaffold deep-loop-runtime/ skeleton
- `bd77886d0a` feat(118): scaffold deep-loop FULL_ISOLATE_NO_MCP phased arc
- `1e35680075` decision(117): AI Council SPLIT ruling

Target skill to potentially uplift:
- `.opencode/skills/deep-agent-improvement/SKILL.md` — Evaluator-first 5-dim agent scoring with guarded promotion
- `.opencode/skills/deep-agent-improvement/{scripts,assets,references,manual_testing_playbook,feature_catalog,changelog}/`

## ACTION

**Step 1: Catalog patterns + findings + decisions across arcs 117-122**

For each pattern/finding/decision shipped, capture:

| Field | Description |
|-------|-------------|
| pattern_id | P-NNN sequential |
| arc | 117 / 118 / 119 / 120 / 121 / 122 |
| type | one of: RUNTIME-RELOCATION / MCP-REMOVAL / SCRIPT-SHIM / WORKFLOW-YAML / COLLATERAL / TEST-MIGRATION / DOC-COMPLIANCE / CANONICAL-COMPANIONS / FIX-PACK / VERSION-BUMP / MIXED-EXECUTOR / ADJUDICATION-ITER / CONVERGENCE-TRANSPARENCY / FOLDER-NAMING / CONTENT-HASH-DEDUP / YAML-SCRIPT-VERIFY / NUMERIC-SORT-FIX |
| description | one-sentence summary |
| evidence | file:line or commit reference |
| sibling_applicability_hint | "review-only" / "research-only" / "bilateral" / "agent-improvement-candidate" / "unknown" — your best guess |

Aim for ≥30 patterns catalogued.

**Step 2: Read deep-agent-improvement skill briefly**

Skim:
- `.opencode/skills/deep-agent-improvement/SKILL.md` (top-level structure + what it does)
- 1-2 reference docs from `references/`
- 1 sample agent improvement run (search specs for any 026/* arc that used `/improve:agent`)

Note: what does deep-agent-improvement DO? Iterative? Single-shot? Scored? Per-iter dispatch?

**Step 3: Write iter-001.md + iter-001.jsonl**

`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/037-deep-agent-improvement-research-recent-updates/research/iterations/iteration-001.md`:

```markdown
# Iteration 1 — Survey of Recent Deep-Review + Deep-Research Updates

## Summary
<one paragraph: total N patterns catalogued across M arcs; brief read of deep-agent-improvement>

## Pattern Inventory

### P-001 — <title>
- Arc: <arc>
- Type: <TYPE>
- Description: <one-sentence>
- Evidence: <commit + file:line>
- Sibling applicability hint: <review-only / research-only / bilateral / agent-improvement-candidate / unknown>

### P-002 — ...
...

## Type Distribution

| Type | Count | Agent-improvement-candidate count |
|------|-------|-----------------------------------|
| ...

## Deep-Agent-Improvement Skill Read

<paragraph: what does the skill do? iterative? scored? per-iter dispatch?>

## Next-Iter Suggestions

<bullet list: areas iter-2+ should probe>

## Convergence Signal (self-report)

- newPatterns catalogued: <N>
- coverage gate: PASS/FAIL (all 18 commits surveyed)
```

`.../research/deltas/iter-001.jsonl`:
```jsonl
{"iter":1,"pattern_id":"P-001","arc":"117","type":"...","description":"...","evidence":"commit 1e35680075","sibling_applicability_hint":"unknown"}
...
```

WRITE BOTH FILES via tool calls.

## FORMAT

- file:line citations mandatory
- evidence direct (commit + path), not paraphrase
- this iter is INVENTORY ONLY; save applicability mapping for iter-2+
- DO NOT modify files outside `.../123-.../001-.../research/`

After writing both files, print:
`ITER-1 DONE: <N patterns catalogued>, types=<distinct count>, agent-improvement-candidate=<count>`
