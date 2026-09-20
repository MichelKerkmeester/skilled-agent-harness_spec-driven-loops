DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=synthesis-pass-2; state_source=externalized_files; do_not_switch_mode=true

# Synthesis pass 2 — correcting a first pass an independent reviewer took apart

You already wrote a synthesis of this ten-iteration run. A fresh reviewer from another model family
checked it against the primary sources and found defects. This pass rewrites
specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md so the report matches its own evidence.

Read first: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/review-of-synthesis.md — it names each defect with evidence.

## RESEARCH TOPIC

Do specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md and the root README.md still tell the truth after the last ~100 commits - the .skilled source-root migration (041), the deep-loop fixes (049-050: ledger/protocol/admission), the retirements and moves, the orca packet, and the recent documentation-correction commits? Produce claim-by-claim verdicts with cited evidence.

## RUN FACTS (authoritative — invent nothing)

- Session: rsr-2026-09-19T18-45-00Z
- Total iterations: 10, stop policy max-iterations (the run closed on its ceiling; convergence was telemetry only)
- Stop reason: maxIterationsReached — cite it to specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md §13, NOT to the state log, which carries no stop-reason field
- newInfoRatio sequence: 0.72, 0.66, 0.62, 0.50, 0.50, 0.50, 0.40, 0.32, 0.22, 0.23
- Convergence threshold 0.05 (never allowed to stop the loop)
- Registry at close: 35 key findings, 5 tracked key questions, 31 carried-forward questions
- Graph at close: 112 nodes, 106 edges

## DEFECTS YOU MUST FIX (each verified by the reviewer and re-checked by the orchestrator)

1. **The README table is materially incomplete.** You carried six README rows and then wrote that Q3 was
   "Closed… bounded to rows B1-B5 and B14". That is false against your own sources. Iteration 3 filed ten
   README findings and iteration 6 filed a line-exact fourteen-row defect set. The README table MUST carry
   one row for each of these anchors, recovering the wording and proof from
   specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-003.md, specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-006.md and the matching deltas:
   L45, L261, L271 (gate count and the 0.70/0.35 thresholds), L14-16, L96-97 (pre-rename repo slug and badges),
   L59 (20 vs 13 skills), L180 (16 vs 18 templates), L567 (sk-code surfaces), L607, L945 (mcp-tooling mode list),
   L640-691 (agent roster), L839 (doctor YAML count), L966 (dead .vscode row), L92 (Node floor).
   State the row count in the section heading. Do not describe the README work as closed or bounded.
2. **Drop row B2's proposed replacement.** The README's "121 advisor test files, 872 tests" is approximately
   correct and must not be edited. Ground truth, counted by the orchestrator: runtime/tests holds 55 test files
   at top level (3 *.test.ts plus 52 *.vitest.ts) and 128 recursively, with 811 it()/test() cases. The
   iteration-8 census that produced "3 test files" used a glob that missed the .vitest.ts convention. Record
   the row as CONFIRMED-APPROXIMATE with that evidence and propose no edit.
3. **Remove row B16 as written.** It quotes "Rust Joins the Code" as README L447, but that heading is in the
   CHANGELOG at L447; README L447 is a diagram line and the README contains no Rust text. If a Rust claim
   deserves a row it belongs to the changelog table.
4. **B6: the section lists 12 internal link bullets, not 10**, and all 12 resolve.
5. **A14's zero-count is scoped.** The old rule names appear zero times in repo-rules/ (the live rule set),
   but they do appear in the rename packets' own historical records. Say which scope the zero holds.
6. **A7: 18 bridged packages is sound by count** (22 package directories, four stay-outs named in
   .hermes/SYNC.md), but the identity of the non-literal 18th bridge is UNRESOLVED — the string
   session-lifecycle appears in neither SYNC.md nor the plugin source. Do not present an identity as confirmed.
7. **Reference date:** commit c34e1bd73b is 2026-09-19, not 2026-09-18.

## INPUTS

Iteration narratives and deltas (the authority):
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-001.md ... iteration-010.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-001.jsonl ... iter-010.jsonl
State: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md, findings-registry.json, deep-research-dashboard.md
The two documents under audit (read-only): specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md, README.md

## OUTPUT CONTRACT

Write exactly one file: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md

Sections: (1) Orientation, stating the full adjudicated set honestly rather than a "closed" claim;
(2) Verdict tables — changelog rows and README rows, each row with line reference, exact current wording,
verified current truth and proof, proposed replacement, status/confidence; the README heading states its row
count; (3) Apply list per document; (4) `## Eliminated Alternatives`; (5) `## Divergence Map`;
(6) `## Open Questions`; (7) `## References`; (8) `## Appendix: Convergence Report`.

Every finding carries `[SOURCE: relative/path:line]`, `[SOURCE: commit <sha>]` or `[SOURCE: url]`.
No placeholder residue anywhere. Where iterations disagreed, name the value you kept and the one you superseded.

## WRITE AUTHORITY

Only specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md. Everything else, including the two target documents, is READ-ONLY.
No builds, no tests, no git writes.

## FINAL LINE

End with: `Synthesis pass 2 complete: <n> changelog rows, <n> README rows, <n> open questions, <n> reviewer defects fixed.`
