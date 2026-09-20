# W2b brief: integration drafts for packets 046-050

You are drafting the integration text for a structural merge. Ten top-level packets are being nested as
phase children of `specs/system-deep-loop/036-deep-loop-innovation/`. You draft; the orchestrator composes
and owns the committed documents. You are read-only: write no files, run no shell commands. Return the
full draft text in your reply.

## Ground truth (fixed; do not re-derive)

| Packet | Former path | New path | Dest # | stable_id | seq |
|--------|-------------|----------|-------:|-----------|----:|
| 046-synthesis-chat-presentation | `system-deep-loop/046-synthesis-chat-presentation` | `system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/005-synthesis-chat-presentation` | 5 in 003 | `synthesis-chat-presentation` | 69 |
| 047-deprecate-skill-benchmark | `system-deep-loop/047-deprecate-skill-benchmark` | `.../003-mode-contracts-migration-and-cutover/006-deprecate-skill-benchmark` | 6 in 003 | `deprecate-skill-benchmark` | 70 |
| 048-fanout-convergence-mode-flag | `system-deep-loop/048-fanout-convergence-mode-flag` | `.../002-substrate-and-orchestration/008-fanout-convergence-mode-flag` | 8 in 002 | `fanout-convergence-mode-flag` | 71 |
| 049-deep-loop-alignment-review | `system-deep-loop/049-deep-loop-alignment-review` | `.../006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review` | 13 in 006 | `deep-loop-alignment-review` | 72 |
| 050-spec-protocol-ledger-events | `system-deep-loop/050-spec-protocol-ledger-events` | `.../002-substrate-and-orchestration/009-spec-protocol-ledger-events` | 9 in 002 | `spec-protocol-ledger-events` | 73 |

Merge date: **2026-09-20**. Destination parents live under
`specs/system-deep-loop/036-deep-loop-innovation/`.

Parent-table state you must match (the rows below are current; the orchestrator applies them):

- `003-mode-contracts-migration-and-cutover`: last row `| 4 | \`004-legacy-writer-retirement\` | planned | predecessor \`003-staged-state-migration-and-authority-cutover\`; successor \`none\` |`. Appended rows renumber from 5; row 4's successor becomes `005-synthesis-chat-presentation`.
- `002-substrate-and-orchestration`: last row `| 7 | \`007-convergence-termination-and-health\` | in_progress | predecessor \`006-novelty-claims-continuity-and-projections\`; successor \`none\` |`. Appended rows renumber from 8; row 7's successor becomes `008-fanout-convergence-mode-flag`.
- `006-runtime-docs-and-integrity-hardening`: last row `| 11 | \`011-identity-and-lock-ownership-hardening\` | complete | predecessor \`010-docs-drift-and-p2-batch\`; successor \`none\` |`. Row 12 is a sibling merge (`012-deep-loop-test-debt`, drafted in the other lane), so your 049 row is `| 13 | \`013-deep-loop-alignment-review\` | <status> | predecessor \`012-deep-loop-test-debt\`; successor \`none\` |`.

## Style sources (read these to match voice; do not copy old content)

- `specs/system-deep-loop/036-deep-loop-innovation/timeline.md` rows 45-63 and the narrative after them.
- `specs/system-deep-loop/036-deep-loop-innovation/changelog.md` (the `## 2026-08-24` entry, and the `## What's New at a Glance` bullets).
- `specs/system-deep-loop/036-deep-loop-innovation/before-and-after.md` (the `## What happened after the switch-over` section, especially the `**The three merged packets, 026 to 028.**` bullet).
- Each destination parent's `spec.md` PHASE DOCUMENTATION MAP table.

## Deliverables per packet (all five, in the table's order)

1. **Timeline row**, exactly this shape (keep the pipe formatting):
   `| <seq> | \`<stable_id>\` | <created_at> | <git_first_add> | \`system-deep-loop/<old-slug>\` (merged 2026-09-20) | <status> | <evidence-column> |`
   Fill `created_at` / `git_first_add` from this brief: 046 `2026-09-11T14:03:05Z` / `2026-09-11T19:44:00+02:00`; 047 `2026-09-11T17:07:53Z` / `2026-09-11T19:53:21+02:00`; 048 `2026-09-11T20:55:35.915Z` / `2026-09-11T22:55:50+02:00`; 049 `2026-09-15T09:48:33Z` / `2026-09-15T11:50:15+02:00`; 050 `2026-09-19T06:34:57Z` / `2026-09-19T08:37:14+02:00`. The precedent rows end with `confirmed`; propose that value when the status is evidenced, otherwise say why not.
2. **Status**: read the packet `spec.md` METADATA `**Status**` row and the `implementation-summary.md`; if an `acceptance-criteria.md` exists, check whether its closure rows are Met. Report the status value with `file:line` evidence, and flag any contradiction between `spec.md`, `acceptance-criteria.md` and `graph-metadata.json`. Packet 046 reads `Draft` in `spec.md`: confirm or refute against its own documents.
3. **Changelog block** (2-4 lines of prose, no bullets) for a new `## 2026-09-20` entry: what the packet did, why it mattered, in the changelog's plain-language voice. Every factual claim needs a `file:line` citation from the packet docs.
4. **At-a-glance bullet** (one line, `**Bold label** — explanation`) for the `What's New at a Glance` list.
5. **Before-and-after addendum** (2-3 sentences) for a new bullet in `What happened after the switch-over`.
6. **Parent phase-map row(s)**: the exact `| N | \`<folder>\` | <status> | predecessor \`<prev>\`; successor \`<next>\` |` line(s) for the destination parent, adjacency chained as shown above (last new child gets `successor \`none\``).
7. **Contradictions / exceptions**: any place where the packet's own documents disagree with the recorded status, or where a fact could not be evidenced. Write `UNKNOWN` rather than guessing.

## Boundaries

- Read-only toolset (`read`, `grep`, `find`, `ls`). No writes, no shell.
- Cite `file:line` for every factual claim; a claim without a citation is `UNKNOWN`.
- Do not restate the whole packet; these drafts are short by design.
- Close with the line `W2B DRAFT RETURN COMPLETE` and nothing after it.
