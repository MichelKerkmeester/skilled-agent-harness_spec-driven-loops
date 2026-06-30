DEEP-REVIEW

# Deep-Review Iteration 1 — D1 CORRECTNESS (sk-doc conformance) of the 008 doc ship

## ROLE

You are a SWE-1.6 deep-review LEAF iteration worker auditing a just-shipped documentation arc (the 008 deep-skill doc-evolution, commit 5f3e0a2f53) for P0/P1/P2 issues. READ-ONLY. Cite EVERY finding with `file:line` evidence — inference-only findings are NOT acceptable. Before producing output, call the sequential_thinking tool (>=5 thoughts) to plan, read evidence, extract findings, identify gaps, and compose the output, per your agent-config.

## STATE

Segment: 1 | Iteration: 1 of 5 | Dimension: D1 correctness
Findings so far: 0 P0 / 0 P1 / 0 P2
Next focus: D1 Correctness — sk-doc conformance of the 5 deep-* skills' SKILL.md + README (required-section presence, template-anchor presence, structure) + a fast re-confirm that internal links resolve. The 009 backstop already proved 0 dangling/orphan/stale-path; do NOT re-report those unless you find a NEW concrete instance.

Review Target: the 5 deep-* skills' docs as shipped in 5f3e0a2f53.
Iteration: 1 of 5
Dimension this iteration: correctness

## SEED CONTEXT (read first)

- The 5 skills: `.opencode/skills/deep-loop-runtime/`, `.opencode/skills/deep-research/`, `.opencode/skills/deep-review/`, `.opencode/skills/deep-ai-council/`, `.opencode/skills/deep-agent-improvement/`
- sk-doc standard (what "conformant" means):
  - SKILL.md template: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`; README template: `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` (9 sections); reference template: `skill_reference_template.md`; smart-router: `skill_smart_router.md`.
  - DQI: `.opencode/skills/sk-doc/references/global/validation.md` (Structure 40 + Content 30 + Style 30; pass >=75).
- 008 audit record: `../../001-spec-and-resource-map/resource-map.yaml`
- 009 backstop (0 structural gaps — out of scope to re-litigate): `../../009-deep-research-gap-backstop/research/iterations/iteration-002.md`

## PRE-PLANNING (ordered, with acceptance criteria)

1. Read the sk-doc SKILL.md + README templates to internalize required sections + smart-router shape. Acceptance: you know the conformance bar.
2. For each of the 5 skills, read SKILL.md: confirm required sections present (frontmatter, smart-router/intent table, references map), and the smart-router resource paths point at real subfolders. Acceptance: per-skill PASS or a concrete missing/wrong section with file:line.
3. For each of the 5 skills, read README: confirm the 9 template sections are present and the STRUCTURE tree matches the on-disk references layout. Acceptance: per-skill PASS or a concrete structural deviation with file:line.
4. Spot-check the 3 deep-review split files (state/, protocol/, convergence/ subfolders) have proper H1 + intro + section structure (not orphaned fragments). Acceptance: PASS or a concrete structural finding.
5. Fast link re-confirm (grep a sample of `references/` links per skill resolve). Acceptance: confirm 009's negative holds, or a NEW concrete dangling link with file:line.

Stop conditions: max 12 tool calls; findings only (no fixes). If a dimension is clean, say so explicitly with the evidence that proves it (negative knowledge backed by reads, not by citing resource-map.yaml).

## STATE FILES

All paths relative to repo root.
- **YOUR ONLY WRITE TARGET** — iteration narrative: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/010-post-impl-deep-review/review/iterations/iteration-001.md`
- Do NOT write to `deep-review-state.jsonl` or `deltas/` — the loop driver builds those from your narrative's JSON block.

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Max 12 tool calls. Read-only.
- Every finding MUST carry `file:line` evidence (the exact line that shows the issue). No inference-only findings.
- Severity: P0 = broken/wrong (a reader is actively misled or a required structure is absent). P1 = a real conformance gap that should be fixed. P2 = minor/polish.

## OUTPUT CONTRACT (write EXACTLY ONE file)

Write ONLY the iteration narrative at `.../review/iterations/iteration-001.md`. The narrative MUST have these H2 headings, in order: `## Focus`, `## Actions Taken`, `## Findings`, `## Coverage`, `## Next Focus`.
- Under `## Findings`, give EACH finding its own `### P0|P1|P2 — <title>` subheading with: dimension, `file:line`, evidence (the exact text), and recommendation. If the dimension is clean, write `No correctness findings — sk-doc conformance holds (evidence below).`

End the file with a single fenced ```json block (the LAST thing in the file) — the driver parses it verbatim into the state record + delta:

```json
{"dimensions":["correctness"],"filesReviewed":["skill:file:line", "..."],"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"status":"complete","findingDetails":[{"id":"F-iter1-001","severity":"P2","title":"<short>","dimension":"correctness","file":"<path:line>","evidence":"<exact text>","recommendation":"<fix>"}]}
```

Emit the block even with zero findings (`"findingDetails":[]`, all counts 0, `newFindingsRatio` 0.0). newFindingsRatio = new findings this iter / total findings so far (1.0 if all-new; 0.0 if none).
