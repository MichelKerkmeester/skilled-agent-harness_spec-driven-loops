DEEP-REVIEW

# Deep-Review Iteration 3 — D3 MAINTAINABILITY of the 008 doc ship

## ROLE

You are a SWE-1.6 deep-review LEAF iteration worker auditing the 008 deep-skill doc-evolution ship (commit 5f3e0a2f53). READ-ONLY. Cite EVERY finding with `file:line` evidence — inference-only findings are NOT acceptable. Before output, call sequential_thinking (>=5 thoughts) per your agent-config.

## STATE

Segment: 1 | Iteration: 3 of 5 | Dimension: D3 maintainability
Findings so far: 0 P0 / 0 P1 / 1 P2 (iter-1 correctness CLEAN; iter-2 traceability = 1 confirmed P2 [stale README Version fields]).
Next focus: D3 Maintainability — HVR style/clarity of the rewritten READMEs + references + split files; reference-doc organization quality.

Review Target: the 5 deep-* skills' docs as shipped in 5f3e0a2f53.
Iteration: 3 of 5 | Dimension this iteration: maintainability

## SEED CONTEXT (read first)

- The 5 skills: `.opencode/skills/{deep-loop-runtime,deep-research,deep-review,deep-ai-council,deep-agent-improvement}/`
- **HVR rules (the maintainability/style bar):** `.opencode/skills/sk-doc/references/global/hvr_rules.md`. In essence: human voice — active, direct, specific; NO em dashes (—), NO hedging, NO AI filler ("delve", "leverage", "seamless", "robust", "in order to", "it's worth noting"), NO weasel words. Self-documenting structure.
- DQI Style band (30 pts): `.opencode/skills/sk-doc/references/global/validation.md`.
- The 3 deep-review split files (must read coherently standalone): `references/state/state_format.md`, `references/protocol/loop_protocol.md`, `references/convergence/convergence.md`.

## PRE-PLANNING (ordered, with acceptance criteria)

1. **HVR mechanical sweep:** grep the 5 skills' README + references/ for HVR red flags — em dashes (—), and AI-filler tokens (`delve`, `leverage`, `seamless`, `robust`, `in order to`, `it's worth noting`, `boasts`). Acceptance: a list of concrete HVR violations with file:line, or "0 across N files." (Note: a stray em dash in prose is at most P2; do not over-report.)
2. **Clarity read (READMEs):** read 2-3 rewritten READMEs end to end; flag any section that is confusing, redundant, or self-contradictory for a maintainer. Acceptance: concrete clarity findings with file:line, or PASS.
3. **Split-file coherence:** read the 3 deep-review split files; confirm each reads as a coherent standalone document (clear scope, no dangling "see above" that broke when split, no orphaned cross-refs to the old monolith). Acceptance: PASS or a concrete coherence finding.
4. **Reference organization:** confirm the subfolder grouping (convergence/, state/, protocol/, etc.) is sensible and each file's placement matches its content. Acceptance: PASS or a mis-placement finding.

Stop conditions: max 12 tool calls; findings only. If clean, say so with evidence. Do NOT re-report correctness (iter-1) or traceability (iter-2) or structural gaps (009) unless a NEW maintainability angle.

## STATE FILES

- **YOUR ONLY WRITE TARGET** — `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/010-post-impl-deep-review/review/iterations/iteration-003.md`
- Do NOT write `deep-review-state.jsonl` or `deltas/` — the driver builds those.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. Read-only. Every finding carries `file:line` evidence.
- Severity calibration for DOCS maintainability: P0 = doc is actively misleading/unusable. P1 = a real clarity/maintainability gap a maintainer would stumble on. P2 = style/polish (most HVR nits are P2). Be calibrated — do not inflate style nits to P1.

## OUTPUT CONTRACT (write EXACTLY ONE file)

Write ONLY the narrative at `.../review/iterations/iteration-003.md` with H2 headings, in order: `## Focus`, `## Actions Taken`, `## Findings`, `## Coverage`, `## Next Focus`.
- Under `## Findings`, each finding gets `### P0|P1|P2 — <title>` with dimension, `file:line`, evidence (exact text), recommendation. If clean: `No maintainability findings — evidence below.`

End with a single fenced ```json block (LAST thing in the file):

```json
{"dimensions":["maintainability"],"filesReviewed":["..."],"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"status":"complete","findingDetails":[]}
```

Emit the block even with zero findings. newFindingsRatio = new findings this iter / total findings so far (you have 1 prior P2, so 1 new finding → ratio 0.5; 0 new → 0.0).
