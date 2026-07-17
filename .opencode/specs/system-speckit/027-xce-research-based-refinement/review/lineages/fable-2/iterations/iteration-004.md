# Iteration 004 — Maintainability

Session: `fanout-fable-2-1781112180955-4japyt` | Dimension: maintainability | Status: complete

## Scope Reviewed

`changelog/README.md` + changelog folder inventory, `timeline.md`, `before-vs-after.md`, parent `_memory.continuity` frontmatter, phase-parent content discipline, 000-release-cleanup child statuses.

## Findings

### F007 — P2 — Parent `_memory.continuity` stale on every progress field

The parent frontmatter records `recent_action: "Added OpenLTM phases 008/009 + amended 002/003/005 from research 010"` and `next_safe_action: "Plan 008/009 or implement 002 secret-redaction amendment"` as of 2026-06-08 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:24-27], but 008, 009, and 002 are all now Complete (iteration 1 evidence) — the suggested next action is already-finished work. `completion_pct: 0` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:44] contradicts a packet whose changelog index reports ten shipped tracks. The metadata table's `Updated: 2026-06-04` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:73] also lags the frontmatter's own 2026-06-08 stamp. A `/speckit:resume` reader is routed to stale work.
`finding_class: stale-continuity-handoff`

### F008 — P2 — Changelog index internally inconsistent: 000 track shipped-but-unlisted; 001 vocabulary conflict

The changelog index asserts "two planned tracks (000 release cleanup and 011 command presentation) that are scaffolded but not yet implemented" and "Every shipped phase has a packet-local changelog" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:14], with the 000 row reading "planned / 0 leaf changelogs / (scaffolded, not implemented)" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:20]. On disk, 000's children are Completed with implementation summaries: 001-public-root-readme [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/001-public-root-readme/spec.md:48], 005-mcp-cli-stress-tests [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/005-mcp-cli-stress-tests/spec.md:47], 008-agents-md-alignment [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/008-agents-md-alignment/spec.md:47], and no `changelog/000-release-cleanup/` folder exists (verified by directory listing) — so the "every shipped phase has a changelog" claim is currently false. Additionally the index marks track 001 "shipped" with 7 leaf changelogs [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:21] while the 001 child spec says `In Progress` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/spec.md:57].
`finding_class: status-vocabulary-drift`

### F002 refinement (existing P1, evidence widened)

The changelog index "ten implemented phase tracks (001 through 010)" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:14] and the freshly generated timeline (2026-06-10T15:14:18Z [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/timeline.md:24]) confirm the parent spec map is the stale surface: its "Spec-scaffolded" rows for 002/008/009 lag the shipped reality by all other packet surfaces. Severity unchanged (P1).

## Positive Verifications (no finding)

- Phase-parent content discipline: parent spec.md carries NO forbidden consolidation/migration narratives; reorganization history correctly lives in `context-index.md` per the content-discipline header [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:51-60].
- `timeline.md` is current (regenerated 2026-06-10T15:14:18Z) and self-describes its generation contract; `before-vs-after.md` matches shipped behavior recorded in 002's checklist/tasks (scrubber, auto-* cap, retention tier checks). Minor: timeline header's "Numbers (`000`–`007`...)" range is outdated (children now reach 011+), a generated-prose nit folded into F008's remediation rather than a separate finding.

## Adversarial Self-Check

No P0 candidates. F008 kept at P2 (not P1): the changelog index is an auxiliary navigation surface, the per-track rollups it links are accurate, and the contradiction is between status vocabulary on summary rows, not missing audit content for shipped tracks 001–010. F007 kept at P2 consistent with severity criteria (degraded resume guidance, no incorrect behavior claim).

## Next Focus

Iteration 5 — stabilization: replay all 8 active findings across all four dimensions; re-check 012–015 concurrent-churn watch item.

Review verdict: PASS
