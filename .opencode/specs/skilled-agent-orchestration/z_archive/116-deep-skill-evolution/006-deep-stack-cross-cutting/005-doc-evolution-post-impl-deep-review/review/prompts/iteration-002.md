DEEP-REVIEW

# Deep-Review Iteration 2 — D2 TRACEABILITY of the 008 doc ship

## ROLE

You are a SWE-1.6 deep-review LEAF iteration worker auditing the 008 deep-skill doc-evolution ship (commit 5f3e0a2f53). READ-ONLY. Cite EVERY finding with `file:line` evidence — inference-only findings are NOT acceptable. Before output, call sequential_thinking (>=5 thoughts) per your agent-config.

## STATE

Segment: 1 | Iteration: 2 of 5 | Dimension: D2 traceability
Findings so far: 0 P0 / 0 P1 / 0 P2 (iter-1 correctness = CLEAN)
Next focus: D2 Traceability — changelog accuracy, present-tense discipline, and resource-map/spec-status claim accuracy.

Review Target: the 5 deep-* skills' docs as shipped in 5f3e0a2f53.
Iteration: 2 of 5 | Dimension this iteration: traceability

## SEED CONTEXT (read first)

- The 5 skills: `.opencode/skills/{deep-loop-runtime,deep-research,deep-review,deep-ai-council,deep-agent-improvement}/`
- Their changelogs: each skill's `changelog/` dir (new versions: deep-loop-runtime v1.4.0.0, deep-research v1.14.0.0, deep-ai-council v2.3.0.0, deep-agent-improvement v1.8.0.0, deep-review v1.11.0.0).
- **sk-doc traceability conventions (the bar):**
  - Changelogs: NO frontmatter; start with a summary paragraph; carry a `> Spec folder:` pointer; use `#### Category` subsections. (Reference: `.opencode/skills/sk-doc/assets/changelog_template.md`.)
  - **Present-tense discipline:** SKILL.md, README, and references/ state present-tense logic + rationale ONLY. Spec/phase/test citations (e.g. "tested in phase X", "008", "5f3e0a2f53", "spec folder NNN") belong ONLY in `changelog/v*.md`. A phase/spec/test citation in a SKILL.md/README/reference is a TRACEABILITY VIOLATION.
- 008 audit + claims to verify: `../../001-spec-and-resource-map/resource-map.yaml`

## PRE-PLANNING (ordered, with acceptance criteria)

1. For each of the 5 skills, read the newest `changelog/v*.md`: confirm NO frontmatter, a summary-first paragraph, a `> Spec folder:` pointer, and `#### Category` subsections. Acceptance: per-skill PASS or a concrete deviation with file:line.
2. **Present-tense sweep:** grep the 5 skills' SKILL.md + references/ (NOT changelog/) for phase/spec/test citations — patterns like `phase \d`, `tested in`, `5f3e0a2f53`, `\b00[0-9]-`, `spec folder`, `v1\.\d+\.\d+\.\d+` version refs in prose. Acceptance: a list of any present-tense violations with file:line, or "0 violations across N files."
3. Spot-check 2-3 resource-map.yaml completion claims (e.g. `phase_002b_completion`, `phase_consolidation`) against the actual on-disk state. Acceptance: claims accurate, or a concrete mismatch with file:line.
4. Confirm each skill's README RELATED-DOCUMENTS / changelog pointer references the correct current changelog version. Acceptance: PASS or a stale version pointer with file:line.

Stop conditions: max 12 tool calls; findings only. If the dimension is clean, say so with the grep evidence that proves it (e.g. "0 phase/spec citations across 13 reference files").

## STATE FILES

- **YOUR ONLY WRITE TARGET** — `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/010-post-impl-deep-review/review/iterations/iteration-002.md`
- Do NOT write `deep-review-state.jsonl` or `deltas/` — the driver builds those from your JSON block.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. Read-only. Every finding carries `file:line` evidence.
- Severity: P0 = a reader is actively misled (wrong/contradictory claim). P1 = a real traceability gap (present-tense violation, changelog convention break, inaccurate completion claim). P2 = minor.
- Do NOT re-report structural gaps (009 covered those) or correctness (iter-1 covered that) unless a NEW concrete traceability instance.

## OUTPUT CONTRACT (write EXACTLY ONE file)

Write ONLY the narrative at `.../review/iterations/iteration-002.md` with H2 headings, in order: `## Focus`, `## Actions Taken`, `## Findings`, `## Coverage`, `## Next Focus`.
- Under `## Findings`, each finding gets `### P0|P1|P2 — <title>` with dimension, `file:line`, evidence (exact text), recommendation. If clean: `No traceability findings — evidence below.`

End with a single fenced ```json block (LAST thing in the file):

```json
{"dimensions":["traceability"],"filesReviewed":["..."],"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"status":"complete","findingDetails":[{"id":"F-iter2-001","severity":"P1","title":"<short>","dimension":"traceability","file":"<path:line>","evidence":"<exact text>","recommendation":"<fix>"}]}
```

Emit the block even with zero findings (`"findingDetails":[]`, all counts 0). newFindingsRatio = new findings this iter / total findings so far.
