# iter-007 — DOCUMENTATION

**Dimension**: Documentation — sk-doc compliance across all 16 packets; README accuracy; cross-references valid
**Date**: 2026-05-15
**Files Reviewed**: README.md, INSTALL_GUIDE.md, SET-UP_GUIDE.md, all 16 child implementation-summaries, feature catalog references, manual testing playbooks

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| D-001 | P2 | Parent `spec.md` still describes children 002-006 as "NOT YET scaffolded" — all are actually shipped | `013/009/spec.md:83-91` | documentation/stale-status |
| D-002 | P2 | Parent `spec.md` `_memory.continuity.completion_pct` shows 0 — line is 100% shipped | `013/009/spec.md:27` | documentation/stale-metadata |
| D-003 | P2 | Parent `handover.md` §1 status says "in_progress (60 vitest + hook smoke failures)" — both resolved | `013/009/handover.md:53` | documentation/stale-status |
| D-004 | P2 | Child 007 `spec.md` still references old launcher path `skill-advisor-launcher.cjs` (pre-015 rename) | `007-skill-graph-db-rename/spec.md:108` | documentation/stale-ref |
| D-005 | P2 | Feature catalog files in 008 child contain `system_skill_advisor` references (historical pre-015 state) | `feature_catalog/` within `008-move-skill-graph-tools-to-advisor/` | documentation/stale-ref |

## Analysis

### Live advisor docs: PASS

The active skill package documentation is clean:
- **README.md**: Correct server id (`mk_skill_advisor`), all 8 tools documented, accurate directory tree, boundaries clearly stated, validation commands reference standalone package paths. Uses `dist/system-skill-advisor/mcp_server/compat/index.js` — correct (updated per Tier 2).
- **INSTALL_GUIDE.md**: Correct launcher path (`mk-skill-advisor-launcher.cjs`), correct server id, all 8 tools in verification section.
- **Zero stale references** in live advisor package markdown (outside of historical spec folders).

### Spec folder docs: STALE in non-live context

The parent `spec.md` and `handover.md` contain historical status values that were accurate when written but are now stale:
- D-001: Parent spec.md lists children 002-006 as "NOT YET scaffolded" — they all shipped.
- D-002: `completion_pct: 0` in frontmatter — the extraction line completed at 100%.
- D-003: Handover §1 says "in_progress" — the final session notes already document completion in later sections.

These are in the "plan-then-build" spec folder pattern where the parent's original spec is a planning artifact and the handover continuously updates status. The stale status is visible in the frontmatter and early sections, but the document body (handover §6-10) is current. This is a **documentation maintainability issue** — the handover has grown to 10 sections with append-only updates; early sections aren't retroactively corrected.

### Historical spec docs: EXPECTED

The 16 child packet spec docs contain `system_skill_advisor` because they were authored before/during the 015 rename. This is expected for historical records. The live surfaces (runtime configs, source code, current advisor docs) are clean.

## Verdict: PASS with 5 P2 advisories
