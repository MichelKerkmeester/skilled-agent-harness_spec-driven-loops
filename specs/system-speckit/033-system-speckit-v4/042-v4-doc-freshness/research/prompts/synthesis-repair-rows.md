DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=synthesis-repair; state_source=externalized_files; do_not_switch_mode=true

# Bounded repair: the missing README verdict rows

A synthesis of this run dropped the README defect rows that iterations 3 and 6 recorded. Produce
exactly those rows. Nothing else. Keep the whole file under 12000 bytes — a previous attempt was
truncated by an output ceiling, so be terse: no preamble, no analysis, no repeat of other sections.

## SOURCES (recover the wording and proof from these, not from memory)

  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-003.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-006.md
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-003.jsonl
  specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-006.jsonl
  README.md  (read-only; verify each line pin as you write the row)

## OUTPUT

Write exactly one file: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/readme-verdict-rows.md

Its content: a single markdown table, one row per anchor, columns
`| # | Line(s) | Exact current wording | Verified current truth with proof | Proposed replacement | Status/confidence |`,
covering these README anchors:
L45, L261, L271 (gate count and the 0.70/0.35 thresholds) · L14-16, L96-97 (pre-rename repo slug and badges)
· L59 (20 vs 13 skills) · L180 (16 vs 18 templates) · L567 (sk-code surfaces) · L607, L945 (mcp-tooling mode list)
· L640-691 (agent roster) · L839 (doctor YAML count) · L966 (dead .vscode row) · L92 (Node floor)

Apply these corrections the independent reviewer established and the orchestrator re-verified:
- L412 (advisor test counts) is CONFIRMED APPROXIMATE and gets no edit: runtime/tests holds 55 test files at
  top level (3 *.test.ts + 52 *.vitest.ts), 128 recursively, 811 it()/test() cases, against the README's
  121 files / 872 tests. Include this row with the proof and propose no replacement.
- Any "Rust" claim belongs to the changelog, not the README; do not give it a README row.
- The Related Documents section lists 12 internal link bullets, not 10, and all 12 resolve.
- Where you state a zero-count for a renamed file, say which scope it holds in (repo-rules/ versus the
  repository including historical packets).

Every row's proof is a file, a line, or a commit. No placeholders. No content outside the table.

## WRITE AUTHORITY

Only specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/readme-verdict-rows.md. Everything else is READ-ONLY.

## FINAL LINE

End with: `Repair complete: <n> README rows recovered.`
