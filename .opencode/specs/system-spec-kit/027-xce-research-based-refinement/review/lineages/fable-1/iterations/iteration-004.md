# Iteration 004: Maintainability

## Focus

Parent continuity freshness, phase-parent content discipline, and cross-surface status coherence between the parent spec map, the changelog index, and child spec statuses.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=1 (F002 scope widened) P2=0
- New findings ratio: 0.35

## Review Actions

1. Phase-parent content discipline scan (`consolidat*`, `merged from`, `renamed from`, `migrated from`, `ported from`, `relocated`) over the parent spec: only hits are the discipline comment itself [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:53-54]. Clean — migration history correctly lives in `context-index.md`.
2. Changelog index audit: claims tracks 001–010 all "shipped" with leaf-changelog counts [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:18-31].
3. Verified the changelog's claims against children: `006-gem-team-adoption/001-typed-agent-io-adapter` records `**Status** | Implemented` with implementation-summary.md/checklist.md on disk [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/001-typed-agent-io-adapter/spec.md:65]; `007-memclaw-derived-memory-hardening/001-provenance-and-audit` records `**Status** | Implemented` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit/spec.md:43]. The changelog is right; the parent spec map note "All three programs are scaffolded and planned, not implemented" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:141] is wrong → **F002 scope widened** beyond status cells to the narrative note.
4. Parent continuity freshness check (below).

## Findings

### P0, Blocker

None.

### P1, Required (refinement)

- **F002 (refined, severity unchanged P1)**: Scope widened. In addition to the stale status cells for 000/002/008/009, the parent map's narrative note asserts the 001/006/007 programs are "scaffolded and planned, not implemented" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:141], contradicted by Implemented leaf children in 006 and 007 and by the changelog index recording tracks 001–010 as shipped [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:14, :18-31]. The parent control surface now misstates program state for most rows.

### P2, Suggestion

- **F007**: Parent `_memory.continuity` block is stale on every progress field: `recent_action` and `next_safe_action` ("Plan 008/009 or implement 002 secret-redaction amendment", 2026-06-08) describe work that has since completed — 008 and 009 are Complete and 002 shipped the secret-redaction amendment [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:24-28 vs .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/spec.md:45; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:60]. `completion_pct` is 0 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:44] and the METADATA table's `Updated` field (2026-06-04) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:74] disagrees with the frontmatter `last_updated_at` (2026-06-08) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:25]. Resume flows reading the parent ladder get a misleading handoff.

- **F008**: Cross-surface status vocabulary is inconsistent in a direction that cannot be explained by parent staleness alone: the changelog index marks track 001 "shipped" with 7 leaf changelogs [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:21] while `001-peck-teachings-adoption/spec.md` records `**Status** | In Progress` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/spec.md:57]. Phase-parent tracks 003/004/005 use the structural value `phase-parent` as their Status [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/spec.md:35; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:34; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/spec.md:34], so no per-track progress field exists for them outside the changelog. One of `001`'s two surfaces (spec status vs changelog) needs reconciliation, and the program lacks a single authoritative aggregate-progress surface.

## Adversarial Self-Check

- F002 refinement — counterevidence sought: perhaps spec.md:141 means "scaffolded and planned" was true when written and the map is explicitly historical. Rebuttal: the map carries a Status column updated as recently as 010's completion, and the packet's own Phase Transition Rules require the parent to track aggregate progress. No P0 escalation: operational resume tooling reads child statuses and graph metadata, which are correct; impact is misleading documentation, not broken behavior.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:141 vs changelog/README.md:18-31 vs child Implemented statuses | F002 widened |

## Assessment

- New findings ratio: 0.35
- Dimensions addressed: maintainability
- Novelty justification: two new advisories plus a material widening of F002's scope; content-discipline check came back clean (positive evidence).

## Ruled Out

- Phase-parent content-discipline violations in parent spec.md — ruled out by pattern scan (only the discipline comment matches).
- Changelog index overstating shipped work — ruled out for 006/007 by Implemented leaf children with full doc sets; 001 is the one surface conflict (captured as F008).

## Dead Ends

- None this pass.

## Recommended Next Focus

Stabilization pass: re-verify all active findings still hold, spot-check timeline.md coherence, confirm no new findings across all four dimensions, then proceed to synthesis.

Review verdict: CONDITIONAL
