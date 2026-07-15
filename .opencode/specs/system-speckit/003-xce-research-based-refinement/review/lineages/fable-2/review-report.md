# Deep Review Report — 003-xce-research-based-refinement (fable-2 lineage)

Session: `fanout-fable-2-1781112180955-4japyt` | Generation 1 | Executor: cli-claude-code / claude-fable-5 | Completed: 2026-06-10T18:25:00Z

## 1. Executive Summary

**Verdict: CONDITIONAL** (no P0; 3 active P1; 5 active P2; `hasAdvisories: true`). Release readiness: `in-progress`.

The packet's *implementation* evidence is strong — checklist evidence verified clean in two sampled children, no secrets anywhere, content discipline respected. What fails is the packet's *self-description*: the parent control surfaces (phase-map status cells, description.json child inventory, resource map, context-index bridge, changelog index summary rows, continuity frontmatter) systematically lag the shipped reality recorded in the children. Every P1 is a stale-inventory/stale-status defect on a navigation-critical surface; none blocks runtime behavior, all degrade resume/wayfinding.

Scope reviewed: parent control docs, all 12→16 phase children's status surfaces, changelog/timeline/before-vs-after, research artifact hygiene, two checklist-evidence samples, repo-level exposure rules. Notable run event: a concurrent session created phases 012–015 and partially refreshed the parent inventory mid-review; findings were re-verified against the live state at stabilization.

## 2. Planning Trigger

CONDITIONAL verdict routes to `/speckit:plan` for a small metadata-reconciliation workstream. The fixes are mechanical (status cells, child arrays, map regeneration, index rows) and should land before the packet claims program-level completion, because three independent surfaces currently give a resuming agent three different pictures of what remains.

## 3. Active Finding Registry

| ID | Sev | Dimension | Finding | Key evidence |
|----|-----|-----------|---------|--------------|
| F001 | P1 | correctness | Parent `description.json` `children` stops at 010; disk has 16 children (011–015 missing). spec.md map + graph-metadata healed mid-review; description.json is the lone lagging surface | `description.json:28-38`, `spec.md:140-144`, `graph-metadata.json:18-22` |
| F002 | P1 | correctness | Phase-map Status cells (002/008/009 "Spec-scaffolded", 000 "Placeholder") + "scaffolded and planned, not implemented" narrative (now spec.md:146) contradict child statuses (Complete/Implemented) and the changelog's ten shipped tracks | `spec.md:131,137-138,146`, `002/spec.md:60`, `008/spec.md:45`, `009/spec.md:45`, `changelog/README.md:14` |
| F005 | P1 | traceability | Parent `resource-map.md` scope-frozen 2026-06-04; omits implementation surfaces for phases 002–015; "last active child is 002" claim contradicts `last_active_child_id: null` | `resource-map.md:30-34,74`, `graph-metadata.json:240` |
| F003 | P2 | correctness | 002 `description.json` "spec-scaffolded" vs spec Complete; 008/009/011 description.json missing status key, divergent schema vintage | `002/description.json:13`, `008/description.json:1-30` |
| F004 | P2 | security | Home paths in dispatch artifacts (`.err`/`.out`/state JSON) escape the `*.log` ignore rule in a public repo (username-only disclosure) | `research/006-.../prompts/iteration-018.err:1`, `.gitignore:125,168` |
| F006 | P2 | traceability | `context-index.md` current-folder column stale/self-inconsistent after 003 consolidation (double-booked 004/005 slots) | `context-index.md:35-40` |
| F007 | P2 | maintainability | Parent `_memory.continuity` stale on every progress field (next_safe_action already done; completion_pct 0) | `spec.md:24-27,44,73` |
| F008 | P2 | maintainability | Changelog index: 000 shipped-but-listed-planned, no changelog folder ("every shipped phase has a changelog" false); 001 "shipped" vs "In Progress" | `changelog/README.md:14,20-21`, `000/001/spec.md:48`, `001/spec.md:57` |

All paths relative to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/` except `.gitignore`.

## 4. Remediation Workstreams

**W1 — Parent inventory reconciliation (F001, F002, F007; P1 lane).** One pass over parent `spec.md` + `description.json`: regenerate the children array to 000–015, set truthful Status cells (002/008/009 → Complete; 000 → reflect its Completed children; 001 → In Progress), delete or rewrite the spec.md:146 "not implemented" narrative, and refresh the `_memory.continuity` block via `/memory:save`. Note: `generate-context.js` refreshes description.json/graph-metadata automatically — one canonical save likely clears F001/F007 together.

**W2 — Resource map refresh (F005; P1 lane).** Regenerate or explicitly re-scope the parent `resource-map.md`: either extend it with phase 002–015 implementation surfaces or restamp it as a 001-only historical map and remove the stale graph-metadata claims (line 74).

**W3 — Bridge/index hygiene (F003, F006, F008; P2 lane).** Fix context-index current-folder column for the 003 consolidation; reconcile changelog README's 000/001 rows (add `changelog/000-release-cleanup/` leaves or correct the "every shipped phase" claim); backfill status keys in 008/009/011 description.json.

**W4 — Exposure trim (F004; P2 lane).** Add ignore rules for `**/prompts/*.err`, `**/prompts/*.out`, and `**/logs/*.out` (or scrub home paths from tracked dispatch artifacts).

## 5. Spec Seed

> **Title:** 027 parent-surface status reconciliation
> **Problem:** The 027 phase-parent's six navigation surfaces (phase map, description.json, resource map, context-index, changelog index, continuity block) disagree about child inventory and shipped status, mis-routing resume and review work.
> **In scope:** Parent spec.md map cells + narrative, parent/child description.json, resource-map.md, context-index.md current-folder column, changelog/README.md track rows, continuity frontmatter, gitignore rules for dispatch byproducts.
> **Out of scope:** Any child implementation content; changelog leaf bodies; research artifacts' content.
> **AC:** All three mandatory parent surfaces list identical child sets; no Status cell contradicts its child spec; changelog index claims match on-disk changelog folders; `validate.sh --strict` exits 0.

## 6. Plan Seed

1. Run one canonical `/memory:save` on the parent (clears description.json children + continuity in a single generate-context.js pass) — verify F001/F007.
2. Hand-edit parent map Status cells + line-146 narrative (W1 residue) — verify F002.
3. Regenerate resource-map.md with current phase surfaces, or restamp scope — verify F005.
4. Patch context-index table, changelog README rows, 008/009/011 description.json status keys — verify F003/F006/F008.
5. Add the three ignore patterns — verify F004.
6. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement --strict` and re-run a single-pass review of the parent surfaces.

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core/hard | **partial** | F001 (description.json inventory), F002 (status cells) keep this from pass |
| `checklist_evidence` | core/hard | **pass** | 002 CHK-030/CHK-065 independently re-verified (fixtures use canonical AWS/RFC examples; zero live tokens packet-wide); 010/004 fully evidenced, 0 unchecked; parent checklist absent by lean-trio design |
| `feature_catalog_code` | overlay/advisory | **partial** | Resource map omits 002–015 surfaces (F005) |
| `playbook_capability` | overlay/advisory | **n/a** | Spec-folder target owns no playbook surface |

Unresolved gap: none beyond the registered findings; `applied/T-*.md` cross-check N/A (no `applied/` directory).

## 8. Deferred Items

- **012–015 deep audit**: phases created mid-review (2026-06-10 ~17:48 UTC) by a concurrent session; only their inventory wiring was reviewed, not their content. A follow-up pass should review them once stable.
- **Timeline header range nit** ("Numbers `000`–`007`") — generated prose; fixes itself on regeneration.
- **F004 remediation choice** (ignore-rule vs scrub) — operator decision; advisory only.
- P2 advisories F003/F006/F008 — batchable into W3 at any time; none blocks shipping.

## 9. Audit Appendix

- **Iterations:** 5 (dimensions: correctness → security → traceability → maintainability → stabilization replay). newFindingsRatio: 0.60, 0.15, 0.45, 0.20, 0.05.
- **Stop reason:** `maxIterationsReachedWithFullDimensionCoverage` (rolling avg of last two ratios 0.125, above 0.08 stop threshold, so convergence did not trigger early STOP; max iterations bound the run). Convergence score 0.79.
- **Coverage:** 4/4 dimensions + mandatory resource-map pass + stabilization (minStabilizationPasses=1 satisfied; no new P0/P1 at replay).
- **Adversarial replay:** No P0 recorded at any point (two candidates considered and rejected with rationale in iterations 1 and 3). All 8 findings re-read against live files at iteration 5; zero downgrades; F001/F005 refined due to concurrent-session churn.
- **Acceptance-coverage signal:** `AC_COVERAGE` is default-off INFO; not evaluated for the phase-parent target (no parent checklist by design); advisory only, no effect on verdict.
- **Lineage state:** `deep-review-state.jsonl` (config + 5 iterations + 2 adjudications + synthesis), `deltas/iteration-00{1..5}.json`, `iterations/iteration-00{1..5}.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, lineage `resource-map.md`.

## Resource Map Coverage Gate

`resource_map_present: true` at init → the parent `resource-map.md` was treated as the packet inventory baseline and audited as a first-class angle (iteration 3, mandatory pass).

- **Entries touched (by later work):** the 11 Specs entries (parent metadata + 001 children) — present but with stale notes (line 74 contradicts live graph-metadata).
- **Entries not touched — expected-by-scope:** the 16 Skills entries (declared read-only evidence/implementation candidates for later phases).
- **Entries not touched — gap:** none in the map itself (all 27 entries exist on disk; "Missing on disk: 0" verified).
- **Implementation paths absent from the map (gap):** all phase 002–015 work surfaces — e.g. 002's `mcp_server/lib/parsing/secret-scrubber.ts` (named by its own tasks.md:78), OpenLTM 008/009 surfaces, the 010 dual-stack CLI bins, and the new 012–015 packets. Registered as F005 (`resource-map-coverage` category, P1).

Review verdict: CONDITIONAL
