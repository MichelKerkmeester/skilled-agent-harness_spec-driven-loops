# W2a brief: integration drafts for packets 041-045

You are drafting the integration text for a structural merge. Ten top-level packets are being nested as
phase children of `specs/system-deep-loop/036-deep-loop-innovation/`. You draft; the orchestrator composes
and owns the committed documents. You are read-only: write no files, run no shell commands. Return the
full draft text in your reply.

## Ground truth (fixed; do not re-derive)

| Packet | Former path | New path | Dest # | stable_id | seq |
|--------|-------------|----------|-------:|-----------|----:|
| 041-cli-pi-devpass-glm-route | `system-deep-loop/041-cli-pi-devpass-glm-route` | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/008-cli-pi-devpass-glm-route` | 8 in 007 | `cli-pi-devpass-glm-route` | 64 |
| 042-deep-loop-test-debt | `system-deep-loop/042-deep-loop-test-debt` | `.../006-runtime-docs-and-integrity-hardening/012-deep-loop-test-debt` | 12 in 006 | `deep-loop-test-debt` | 65 |
| 043-review-leaf-protocol | `system-deep-loop/043-review-leaf-protocol` | `.../008-review-and-rollback-followup/005-review-leaf-protocol` | 5 in 008 | `review-leaf-protocol` | 66 |
| 044-cli-pi-devpass-deepseek-route | `system-deep-loop/044-cli-pi-devpass-deepseek-route` | `.../007-executor-and-cli-hardening/009-cli-pi-devpass-deepseek-route` | 9 in 007 | `cli-pi-devpass-deepseek-route` | 67 |
| 045-fanout-write-containment-hardening | `system-deep-loop/045-fanout-write-containment-hardening` | `.../007-executor-and-cli-hardening/010-fanout-write-containment-hardening` | 10 in 007 | `fanout-write-containment-hardening` | 68 |

Merge date: **2026-09-20**. Destination parents live under
`specs/system-deep-loop/036-deep-loop-innovation/`.

Parent-table state you must match (the rows below are current; the orchestrator applies them):

- `007-executor-and-cli-hardening`: last row `| 7 | \`007-cli-devin-executor-repair\` | complete | predecessor \`006-residual-finding-closeouts\`; successor \`none\` |`. Appended rows renumber from 8; row 7's successor becomes `008-cli-pi-devpass-glm-route`.
- `006-runtime-docs-and-integrity-hardening`: last row `| 11 | \`011-identity-and-lock-ownership-hardening\` | complete | predecessor \`010-docs-drift-and-p2-batch\`; successor \`none\` |`. Appended rows renumber from 12; row 11's successor becomes `012-deep-loop-test-debt`.
- `008-review-and-rollback-followup`: last row `| 4 | \`004-review-containment-exemption\` | complete | predecessor \`003-rollback-candidate-hash-hardening\`; successor \`none\` |`. Appended row is 5; row 4's successor becomes `005-review-leaf-protocol`.

## Style sources (read these to match voice; do not copy old content)

- `specs/system-deep-loop/036-deep-loop-innovation/timeline.md` rows 45-63 and the narrative after them.
- `specs/system-deep-loop/036-deep-loop-innovation/changelog.md` (the `## 2026-08-24` entry, and the `## What's New at a Glance` bullets).
- `specs/system-deep-loop/036-deep-loop-innovation/before-and-after.md` (the `## What happened after the switch-over` section, especially the `**The three merged packets, 026 to 028.**` bullet).
- Each destination parent's `spec.md` PHASE DOCUMENTATION MAP table.

## Deliverables per packet (all five, in the table's order)

1. **Timeline row**, exactly this shape (keep the pipe formatting):
   `| <seq> | \`<stable_id>\` | <created_at> | <git_first_add> | \`system-deep-loop/<old-slug>\` (merged 2026-09-20) | <status> | <evidence-column> |`
   Fill `created_at` / `git_first_add` from this brief: 041 `2026-09-05T10:59:12Z` / `2026-09-05T16:34:20+02:00`; 042 `2026-09-05T11:40:23Z` / `2026-09-05T15:36:51+02:00`; 043 `2026-09-05T19:16:55Z` / `2026-09-05T21:47:58+02:00`; 044 `2026-09-07T04:48:14.616Z` / `2026-09-07T06:51:51+02:00`; 045 `2026-09-08T17:47:19Z` / `2026-09-08T20:00:51+02:00`. The precedent rows end with `confirmed`; propose that value when the status is evidenced, otherwise say why not.
2. **Status**: read the packet `spec.md` METADATA `**Status**` row and the `implementation-summary.md`; if an `acceptance-criteria.md` exists, check whether its closure rows are Met. Report the status value with `file:line` evidence, and flag any contradiction between `spec.md`, `acceptance-criteria.md` and `graph-metadata.json`.
3. **Changelog block** (2-4 lines of prose, no bullets) for a new `## 2026-09-20` entry: what the packet did, why it mattered, in the changelog's plain-language voice. Every factual claim needs a `file:line` citation from the packet docs.
4. **At-a-glance bullet** (one line, `**Bold label** — explanation`) for the `What's New at a Glance` list.
5. **Before-and-after addendum** (2-3 sentences) for a new bullet in `What happened after the switch-over`.
6. **Parent phase-map row(s)**: the exact `| N | \`<folder>\` | <status> | predecessor \`<prev>\`; successor \`<next>\` |` line(s) for the destination parent, adjacency chained as shown above (last new child gets `successor \`none\``).
7. **Contradictions / exceptions**: any place where the packet's own documents disagree with the recorded status, or where a fact could not be evidenced. Write `UNKNOWN` rather than guessing.

## Boundaries

- Read-only toolset (`read`, `grep`, `find`, `ls`). No writes, no shell.
- Cite `file:line` for every factual claim; a claim without a citation is `UNKNOWN`.
- Do not restate the whole packet; these drafts are short by design.
- Close with the line `W2A DRAFT RETURN COMPLETE` and nothing after it.
