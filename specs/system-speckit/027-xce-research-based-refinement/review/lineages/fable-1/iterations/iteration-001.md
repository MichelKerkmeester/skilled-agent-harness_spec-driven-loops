# Iteration 001: Correctness

## Focus

Parent phase-inventory and status-claim correctness: the PHASE DOCUMENTATION MAP in the parent spec, `description.json.children`, `graph-metadata.json.children_ids`, and the actual child folders/statuses on disk.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 9
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: Parent child inventory omits live phase 011. The parent PHASE DOCUMENTATION MAP enumerates only phases 000–010 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140] and `description.json.children` likewise stops at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-39]. Yet `graph-metadata.json.children_ids` contains `011-command-presentation-workflow-separation` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:18] and the child exists on disk as a planned phase parent with four family children [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:10, :56]. Resume wayfinding and memory search that consume the spec map or description children will not see 011.

- **F002**: Parent phase-map status column contradicts on-disk child statuses for at least four children. The map lists `002-memory-write-safety` as "Spec-scaffolded" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:131], but the child records `**Status** | Complete (2026-06-10)` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:60] with `completion_pct: 100` and a shipped implementation summary [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/implementation-summary.md:1-30]. The map lists 008 and 009 as "Spec-scaffolded" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:137-138], but both children record `**Status** | Complete` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/spec.md:45; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-openltm-continuity-resilience/spec.md:45] and both carry implementation-summary.md on disk. The map lists 000 as "Placeholder release cleanup shell / Placeholder" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:129], but 000 is now a phase parent with eight populated sub-phases (`001-public-root-readme` … `008-agents-md-alignment`) and status `planned`/`phase-parent` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:10, :55; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/description.json:13]. The parent's own Phase Transition Rules state "Parent spec tracks aggregate progress via this map" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:157-162], so the stale column violates the packet's stated contract and misroutes planning (e.g. the satisfied 002→005 handoff still reads as not-started).

### P2, Suggestion

- **F003**: Child 002 internal metadata drift: `002-memory-write-safety/description.json` still records `"status": "spec-scaffolded"` (and a nested `"status": "planned"`) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:13, :23] while the child spec records Complete (2026-06-10) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:60]. `description.json` is what memory search surfaces, so the completed phase is indexed as scaffolded. A canonical `generate-context.js` save on 002 would refresh it.

## Adversarial Self-Check (P1)

- **F001** — counterevidence sought: an explicit exclusion of 011 from parent scope, or a non-live marker on the child. None found; the child is `status: planned` with real children, and graph-metadata includes it. Alternative explanation: 011 was scaffolded (2026-06-10) after the parent map's last update (2026-06-04) and only graph-metadata was refreshed. Explains the drift, does not remove it. Severity holds at P1 (not P0: no executable behavior breaks; wayfinding/metadata surfaces disagree). Downgrade trigger: if all resume tooling exclusively consumes graph-metadata children_ids, impact drops to P2.
- **F002** — counterevidence sought: a convention that the parent map records status-at-decomposition-time rather than current status. Contradicted by the packet's own Phase Transition Rules ("Parent spec tracks aggregate progress via this map") and by the map having been updated before (010 marked "Complete"). Severity holds at P1.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:127-140 vs graph-metadata.json:6-19 vs disk | Inventory and status drift (F001, F002) |

## Assessment

- New findings ratio: 0.60
- Dimensions addressed: correctness
- Novelty justification: first pass; two P1 contradictions on the parent's authoritative control surfaces plus one child-metadata advisory.

## Ruled Out

- Missing 011 on disk — ruled out: child exists with 4 family children and valid lean-trio files.
- 002/008/009 statuses being aspirational claims without evidence — ruled out: all three carry implementation-summary.md; 002 records 60 passing focused tests.

## Dead Ends

- Looking for an explicit "map is frozen at decomposition" disclaimer in the parent spec — none exists.

## Recommended Next Focus

Security: scan parent-level documents and child control surfaces for secrets, credentials, unsafe path references, or security-relevant claims (002 shipped a secret-redaction feature — verify the parent-level narrative does not leak examples).

Review verdict: CONDITIONAL
