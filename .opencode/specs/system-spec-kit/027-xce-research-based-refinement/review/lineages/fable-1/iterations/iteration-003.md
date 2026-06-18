# Iteration 003: Traceability + Resource Map Coverage Gate

## Focus

Formal core traceability protocols (`spec_code`, `checklist_evidence`), the mandatory resource-map coverage gate (`resource_map_present: true` at init), and the `context-index.md` migration bridge.

## Scorecard

- Dimensions covered: traceability (incl. resource-map coverage)
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.45

## Resource Map Coverage Gate

`{spec_folder}/resource-map.md` (generated 2026-06-04) declares a deliberately narrow scope: "renumbered metadata and the peck-derived feature under `001-peck-teachings-adoption/`" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:33].

**Bucket 1 — entries touched/verified:** Spot-checked 4 of 27 entries on disk (`check-phase-parent-content.sh`, `spec.md.tmpl`, `validator-registry.json`, plus parent metadata trio): all exist. The map's "Missing on disk: 0" claim [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:32] holds for the sample.

**Bucket 2 — entries not touched by later work:** the 16 skill paths are read-only evidence candidates — `expected-by-scope`.

**Bucket 3 — implementation paths absent from the map (gaps):** the map predates and omits every phase from 002 onward. Concretely: 002's shipped implementation surface (e.g. `mcp_server/lib/parsing/secret-scrubber.ts`, named in [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/tasks.md:78] and verified on disk), completed phases 008/009/010, and the live 011 scaffold have no resource-map representation. The map also asserts "last active child is `002-memory-write-safety`" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:74], which contradicts the current `graph-metadata.json` value `"last_active_child_id": null` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:236].

## Findings

### P0, Blocker

None.

### P1, Required

- **F005** (category: resource-map-coverage): Parent `resource-map.md` is scope-frozen at 2026-06-04 and no longer represents the packet. It covers only renumbered parent metadata + phase 001 peck provenance + 16 skill evidence paths [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:30-34], while phases 002–011 — including the shipped implementation surfaces of completed phases 002, 008, 009, and 010 — are entirely absent, and its graph-metadata claims are stale [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:72-74 vs .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:236]. As the packet's declared inventory baseline, it materially under-reports the parent-aggregate scope it claims ("parent-aggregate map for ... 027-xce-research-based-refinement/" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:33]).

### P2, Suggestion

- **F006** (category: traceability): `context-index.md`'s second renumbering table labels its right-hand column "Current 027 child folder" but four of its rows point at folders that no longer exist at packet root: `003-incremental-index-foundation/`, `004-causal-edge-tombstones/`, `005-metadata-edge-promoter/`, `006-write-path-reconciliation/` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:31-40]. Those phases were subsequently folded under `003-memory-index-causal-lifecycle/001-004` per the parent phase map [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:132]. A dated addendum row (like the existing "MCP to CLI Workstream Placement" entry at [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:42-44]) would restore the bridge's accuracy.

## Adversarial Self-Check (P1)

- **F005** — counterevidence sought: the map self-describes as scoped to the renumber + peck task ("this task did not edit them", Author Instructions). If the map is read as a task-scoped artifact, partial coverage is by design. Rebuttal: deep-review's coverage gate treats `{spec_folder}/resource-map.md` as the packet inventory baseline, the file's own Summary claims parent-aggregate scope for the whole packet, and the SKILL contract requires classifying untouched implementation paths as gaps. The stale last-active-child claim is factually wrong today regardless of scope reading. Severity holds at P1 (degraded/incomplete packet surface), not P0 (no contradiction with executable behavior). Downgrade trigger: if the operator regenerates the map at synthesis (the loop's own `--no-resource-map`-gated emission) and the stale file is explicitly superseded, this drops to P2 historical note.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:127-140; graph-metadata.json:6-19; description.json:27-39 | F001/F002 inventory + status drift carried from iteration 1 |
| checklist_evidence | pass | hard | 002-memory-write-safety/checklist.md:100, :115 | Parent has no checklist (lean trio, by design — skipped at parent); child 002 evidence claims spot-verified true |
| feature_catalog_code | partial | advisory | resource-map.md:30-34, :72-74 | F005 resource-map gaps |
| playbook_capability | n/a | advisory | — | Spec-folder target owns no playbook surface; explicitly N/A |

## Assessment

- New findings ratio: 0.45
- Dimensions addressed: traceability + resource-map coverage (mandatory gate satisfied)
- Novelty justification: the resource-map gap is a packet-level P1 not visible from the parent spec alone.

## Ruled Out

- Resource-map "MISSING on disk" claims being false — ruled out by 4/4 sampled paths existing.
- context-index first table (027→028 split) being stale — its old/new mapping is historical by construction and 028 references remain coherent with the 010 relocation note.

## Dead Ends

- Looking for a newer regenerated resource-map elsewhere in the packet (e.g. under review/ from prior runs) — sibling lineage emissions exist but none is the canonical packet-root map.

## Recommended Next Focus

Maintainability: parent continuity freshness (`_memory.continuity` vs actual phase states), phase-parent content discipline (forbidden consolidation narratives), timeline.md / changelog coherence, and graph-metadata derived-staleness.

Review verdict: CONDITIONAL
