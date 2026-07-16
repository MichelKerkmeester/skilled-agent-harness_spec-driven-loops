# Deep Review Report — 028-xce-research-based-refinement (lineage fable-1)

Lineage: `fanout-fable-1-1781112180955-4japyt` | Executor: cli-claude-code / claude-fable-5 | Iterations: 5/5 | Generated: 2026-06-10T18:05:00Z

## 1. Executive Summary

**Verdict: CONDITIONAL** — 0 active P0, 3 active P1, 5 active P2 (`hasAdvisories: true`). Release readiness: `in-progress`.

The target is the 027 phase-parent packet (12 child phase tracks on disk). The implemented work itself audits well where sampled: child 002's security checklist evidence independently re-verified, the user-facing `before-vs-after.md` narrative matches shipped 002 behavior, and phase-parent content discipline in the parent spec is clean. The packet's problem is **coherence between its control surfaces**: the parent spec's phase map, `description.json`, `resource-map.md`, `context-index.md`, the changelog index, and child statuses tell materially different stories about what exists and what has shipped. No finding indicates broken executable behavior; all three P1s are authoritative-surface drift that misleads resume, planning, and release accounting.

Scope reviewed: parent control trio (spec.md / description.json / graph-metadata.json), resource-map.md, context-index.md, timeline.md, before-vs-after.md, changelog index, and child control surfaces for tracks 000, 001, 002, 003, 004, 005, 006, 007, 008, 009, 011, plus packet-wide secret scans.

## 2. Planning Trigger

CONDITIONAL verdict with P1 findings present → route to `/speckit:plan` for a small documentation-reconciliation packet (or fold into the existing `000-release-cleanup` track, which already owns release-hygiene work). No P0 blockers; no code changes required — every remediation is a doc/metadata update.

## 3. Active Finding Registry

| ID | Sev | Category | Title | Primary evidence |
|----|-----|----------|-------|------------------|
| F001 | P1 | correctness | Parent child inventory omits live phase 011 (spec map + description.json vs graph-metadata + disk) | spec.md:127-140; description.json:27-39; graph-metadata.json:18 |
| F002 | P1 | correctness | Phase-map status column + ":141 note" contradict child reality (000 "Placeholder" has 8 populated sub-phases; 002/008/009 "Spec-scaffolded" are Complete; "scaffolded and planned, not implemented" vs Implemented 006/007 leaves) | spec.md:129,131,137-138,141 vs child spec.md statuses |
| F005 | P1 | resource-map-coverage | resource-map.md scope-frozen at 2026-06-04: omits phases 002–011 incl. shipped implementation surfaces; "last active child" claim contradicts graph-metadata | resource-map.md:30-34,72-74; graph-metadata.json:236 |
| F003 | P2 | correctness | Child 002 description.json says `spec-scaffolded`; child spec says Complete | 002/description.json:13 vs 002/spec.md:60 |
| F004 | P2 | security | Home-directory paths (username) in research dispatch logs — local-only, packet is git-untracked | research/010-…/prompts/iteration-001.out:2 |
| F006 | P2 | traceability | context-index.md "Current 027 child folder" column stale for phases folded into 003-memory-index-causal-lifecycle | context-index.md:31-40 |
| F007 | P2 | maintainability | Parent `_memory.continuity` stale on all progress fields (next_safe_action already done; completion_pct 0; Updated-date mismatch) | spec.md:24-28,44,74 |
| F008 | P2 | maintainability | Changelog index coherence: 001 "shipped" vs child "In Progress"; 000 "planned/0 changelogs" vs Completed 000 children | changelog/README.md:14,20-21 vs child statuses |

All findings carry `[SOURCE: file:line]` evidence in their iteration narratives (`iterations/iteration-001.md` … `iteration-005.md`); none is inference-only.

## 4. Remediation Workstreams

**W1 — Parent control-surface refresh (F001, F002, F007; closes the P1 core)**
Single editing pass on the parent packet: add phase 011 to the PHASE DOCUMENTATION MAP and `description.json.children`; update the Status column for 000/001/002/008/009 (and the :141 note) to current reality; refresh `_memory.continuity` (recent_action, next_safe_action, completion_pct) and the METADATA `Updated` field. A canonical `/memory:save` via `generate-context.js` on the parent regenerates description.json consistently.

**W2 — Resource map regeneration (F005)**
Regenerate or extend `resource-map.md` to parent-aggregate reality: per-track rows for 002–011 (implementation surfaces for completed tracks; scaffold pointers for 000/011), and correct the stale graph-metadata claims. The lineage emission at `review/lineages/fable-1/resource-map.md` can seed the per-track skeleton.

**W3 — Cross-surface status reconciliation (F003, F006, F008)**
Run `generate-context.js` on 002 to refresh its description.json; add a dated addendum row to `context-index.md` for the 003-lifecycle fold; reconcile track 001's status (changelog "shipped" vs spec "In Progress") and add the now-due 000 changelogs per the index's own convention (README.md:47).

**W4 — Research-log hygiene (F004, advisory)**
No action required while spec packets stay untracked. If packets ever become tracked/synced, exclude or path-scrub `research/*/prompts/*.{out,err}` and research state JSONL.

## 5. Spec Seed

> **Title:** 027 control-surface reconciliation (docs-only)
> **Problem:** The 027 parent packet's authoritative surfaces (phase map, description.json, resource-map.md, context-index.md, changelog index, child metadata) disagree on child inventory (011), per-track status (000/001/002/008/009), and packet resource coverage (002–011 absent from the map).
> **In scope:** parent spec.md phase map + continuity frontmatter; parent description.json; resource-map.md; context-index.md addendum; changelog/README.md track rows + 000 changelogs; 002/description.json refresh.
> **Out of scope:** any code change; child phase implementation content; graph-metadata.json children_ids (already correct).
> **Acceptance:** every child track shows one consistent status across parent map, changelog index, and child spec; 011 present in all three inventory surfaces; resource map covers all 12 tracks or explicitly scopes itself per-track.

## 6. Plan Seed

1. Update parent `spec.md`: add 011 row, correct status cells (000, 001, 002, 008, 009), rewrite the :141 note to current reality (T: 30 min).
2. Refresh parent continuity (`_memory.continuity` + METADATA Updated) and run `/memory:save` on the parent to regenerate `description.json` (children incl. 011) (T: 15 min).
3. Run `generate-context.js` on `002-memory-write-safety` to refresh its description.json (T: 5 min).
4. Add dated `context-index.md` addendum for the 003-lifecycle fold (T: 10 min).
5. Author 000 leaf changelogs (or a 000 rollup) and flip the index row; reconcile track 001 status direction with its owner (T: 45 min).
6. Regenerate `resource-map.md` parent-aggregate (T: 30 min).
7. Re-run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement --strict` and spot-verify the three P1s closed.

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core (hard) | **partial** | Parent map vs graph metadata vs disk: F001/F002 active |
| checklist_evidence | core (hard) | **pass** | Parent checklist skipped by lean-trio design; child 002 CHK-030/CHK-065 evidence independently re-verified by scan |
| feature_catalog_code | overlay (advisory) | **partial** | Resource map omits phases 002–011 (F005) |
| playbook_capability | overlay (advisory) | **n/a** | Spec-folder target owns no playbook surface |

Unresolved gap: no single surface currently gives a correct aggregate program status; the changelog index is closest but has two stale rows (000, 001).

## 8. Deferred Items

- **F004** (P2): research-log path hygiene — deferred unless packet tracking policy changes.
- timeline.md header prose says numbers span `000`–`007` while tracks now reach 011 — cosmetic, below severity threshold; fold into W1 if convenient (timeline.md:32).
- `AC_COVERAGE`: not evaluated — the parent is a phase parent with no checklist by design (lifecycle predicate inactive); per-child AC coverage belongs to child-level reviews.
- Per-child deep review of implemented tracks (003/004/005/006/007 internals) — out of scope for this parent-level audit; consider targeted child reviews before any external release tag.

## 9. Audit Appendix

**Coverage:** 4/4 dimensions covered (correctness iter 1, security iter 2, traceability + mandatory resource-map gate iter 3, maintainability iter 4, stabilization replay iter 5). Core traceability protocols executed in iterations 3 and 5.

**Convergence evidence:** newFindingsRatio sequence 0.60 → 0.15 → 0.45 → 0.35 → 0.08. Final rolling average (0.215) above the 0.08 stop threshold at iteration 4; iteration 5 (0.08, zero new findings) was the stabilization pass. Stop reason: `maxIterationsReachedWithFullDimensionCoverage` (cap 5). No false-positive STOP.

**Adversarial replay:** no P0 candidates arose. All three P1s re-challenged: F001 (alternative: post-map scaffold timing — explains, doesn't excuse), F002 (alternative: map-as-historical-record — contradicted by the packet's own Phase Transition Rules), F005 (alternative: task-scoped map by design — contradicted by the map's own parent-aggregate scope claim). Each P1 rests on ≥2 independent surfaces read this session. One candidate finding was affirmatively refuted and discarded: timeline.md `impl` tags are contextType markers, not status claims.

**Verdict mapping:** P1 present, no P0 → CONDITIONAL (per contract). `riskScore` not used; advisory only if present.

**State files:** `deep-review-config.json`, `deep-review-state.jsonl` (config + 5 iteration records + adjudication + synthesis events), `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `iterations/iteration-001..005.md`, `deltas/iteration-001..005.json`, `resource-map.md` (lineage emission).

## Resource Map Coverage Gate

`resource_map_present: true` at init → the gate ran as a mandatory pass (iteration 3).

- **Entries touched/verified:** 4 of 27 sampled on disk — all exist; the map's "Missing on disk: 0" claim held for the sample.
- **Entries not touched (expected-by-scope):** the 16 `.opencode/skills/system-spec-kit/**` evidence paths — read-only candidates by the map's own scope note.
- **Entries not touched (gap):** none in the map itself; the gap is inverse (below).
- **Implementation paths absent from the map:** all of phases 002–011 — including shipped surfaces of completed tracks (e.g. `mcp_server/lib/parsing/secret-scrubber.ts` from 002) and the live 000/011 scaffolds. Plus one stale factual claim ("last active child is 002-memory-write-safety" vs `last_active_child_id: null`).

Findings from this gate carry category `resource-map-coverage` (F005, P1). The lineage emission `review/lineages/fable-1/resource-map.md` records the per-track coverage skeleton derived from review evidence.

---
Review verdict: CONDITIONAL
