DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=synthesis; state_source=externalized_files; do_not_switch_mode=true

# Synthesis step — deep-research run 042

You are the synthesis step of a finished ten-iteration research run. Synthesize what the run
found into ONE canonical report. This is not new research: consolidate, deduplicate, and
preserve every unique finding. Do not introduce a claim no iteration file supports.

## RESEARCH TOPIC

Do specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md and the root README.md still tell the truth after the last ~100 commits - the .skilled source-root migration (041), the deep-loop fixes (049-050: ledger/protocol/admission), the retirements and moves, the orca packet, and the recent documentation-correction commits? Produce claim-by-claim verdicts with cited evidence.

## RUN FACTS (authoritative — use these verbatim in the Convergence Report, invent nothing)

- Session: rsr-2026-09-19T18-45-00Z, generation 1
- Total iterations: 10 (stop policy: max-iterations, so the run closed on its ceiling)
- Stop reason: maxIterationsReached
- newInfoRatio sequence: 0.72, 0.66, 0.62, 0.50, 0.50, 0.50, 0.40, 0.32, 0.22, 0.23
- Convergence threshold: 0.05 (convergence was telemetry only on this run; it was never allowed to stop the loop)
- Findings registry at close: 35 key findings, 5 tracked key questions, 31 carried-forward questions
- Graph at close: 112 nodes, 106 edges

## INPUTS (read all of them)

Iteration narratives:
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-001.md (9923B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-002.md (6607B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-003.md (10123B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-004.md (7973B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-005.md (8352B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-006.md (7738B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-007.md (10056B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-008.md (9974B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-009.md (20347B)
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md (11145B)
Structured deltas (per-iteration records, findings, observations, graph events, ruled-out directions):
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-001.jsonl ... iter-010.jsonl
Running state:
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/findings-registry.json
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-dashboard.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-state.jsonl
The two documents under audit (read for context, never edit):
  specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md
  README.md

## OUTPUT CONTRACT

Write exactly one file: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md

It must contain:
1. A short orientation section: the topic, the run shape (ten iterations, the ceiling stop), and what the run does and does not establish.
2. **The verdict tables, preserved and consolidated** — they are the primary deliverable. Iterations 9 and 10 produced a changelog table (23 rows) and a README table (17 rows); reproduce them with every row carrying: line reference, exact current wording, verified current truth with its proof, proposed replacement text, and status/confidence. Keep the confirmed / fell / narrowed / unverified distinction. Do not silently drop a row.
3. The apply list per document: exactly which rows iteration 10 marked for application, and which it marked do-not-apply and why.
4. `## Eliminated Alternatives` — directions the run ruled out or that were proven to hold, so a later reader does not re-litigate them.
5. `## Divergence Map` — saturated directions, pivots taken or not taken, and the remaining frontier.
6. `## Open Questions` — what the run did not settle, including any row iteration 10 left unresolved.
7. `## References` — the commits, files and line anchors the findings rest on.
8. `## Convergence Report` as an appendix, using the RUN FACTS block above.

## CITATION AND QUALITY RULES

- Every finding carries a source: `[SOURCE: relative/path:line]` or `[SOURCE: commit <sha>]` or `[SOURCE: url]`. A finding with no source is dropped, not softened.
- No placeholder residue anywhere: no TBD, TODO, "to be determined", or bracket placeholders.
- Where iterations disagreed, say which one you followed and why. Iteration 8 revised earlier claims; iteration 10 re-verified; the later, re-verified value wins, and you name the superseded one.
- Mark clearly which statements are confirmed against the live tree versus which remain unverified.

## WRITE AUTHORITY

You may write ONLY this file: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md
Every researched file and the two target documents are READ-ONLY. Do not edit, rename, delete or
move anything else. Do not run builds, tests, git writes, or repository-wide scripts.

## FINAL LINE

End the file with a single line: `Synthesis complete: <n> changelog rows, <n> README rows, <n> open questions.`
