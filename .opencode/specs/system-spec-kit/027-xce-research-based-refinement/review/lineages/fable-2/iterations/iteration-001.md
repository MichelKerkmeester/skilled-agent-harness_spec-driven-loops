# Iteration 001 — Correctness

Session: `fanout-fable-2-1781112180955-4japyt` | Dimension: correctness | Status: insight

## Scope Reviewed

Parent control surface vs on-disk children: `spec.md` (parent), `description.json` (parent), `graph-metadata.json` (parent), Status rows of all 12 child `spec.md` files, leaf statuses in 006/007, child `description.json` statuses for 000/002/008/009/011.

## Findings

### F001 — P1 — Parent child inventory omits live phase 011

The parent Phase Documentation Map enumerates phases 000–010 only [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127-140] and the parent `description.json` `children` array likewise stops at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27-39]. But `011-command-presentation-workflow-separation` exists on disk with an authored spec (Status: Planned) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/spec.md:56] and IS registered in `graph-metadata.json` `children_ids` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:18]. The three mandatory parent surfaces disagree about the packet's child set; resume wayfinding from spec.md or description.json cannot reach phase 011.
`finding_class: spec-metadata-drift`

### F002 — P1 — Phase-map Status column and §141 narrative stale against on-disk child statuses

The parent map claims 002/008/009 are "Spec-scaffolded" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:131,137,138], but the children declare: 002 `Complete (2026-06-10)` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:60], 008 `Complete` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/spec.md:45], 009 `Complete` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-openltm-continuity-resilience/spec.md:45]. The map's row 000 says "Placeholder" while the child is an authored Planned packet with its own phase map [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:55,120]. The post-map narrative "All three programs are scaffolded and planned, not implemented" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:141] is contradicted by Implemented leaves 006/001 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/001-typed-agent-io-adapter/spec.md:65] and 007/001 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit/spec.md:43], and by 001's `In Progress` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/spec.md:57]. The parent's own Phase Transition Rules state "Parent spec tracks aggregate progress via this map" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:160], so the staleness breaks the doc's stated contract.
`finding_class: stale-status-claim`

### F003 — P2 — Child metadata stale or schema-inconsistent

002's `description.json` still says `"status": "spec-scaffolded"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:13] vs the child spec's `Complete (2026-06-10)` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:60]. 008/009/011 `description.json` files carry NO status key at all and use a divergent schema vintage — string `"level": "1"`, `.opencode/specs/...`-prefixed `specFolder`, path-segment `parentChain` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-openltm-retrieval-observability/description.json:1-30] — unlike the parent's bare-packet-id form [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:21-40]. Derived-status fallbacks will classify these children inconsistently.
`finding_class: spec-metadata-drift`

## Adversarial Self-Check

No P0 recorded. F001/F002 considered for P0 ("spec contradiction") but the contradictions are status-tracking drift on a control document, not behavior-bearing spec content; phases remain independently resumable via graph-metadata. P1 is the correct ceiling. Counter-hypothesis "map frozen intentionally at Updated 2026-06-04" rejected: the map's own contract (spec.md:160) requires it to track aggregate progress, and `_memory.continuity.last_updated_at` is 2026-06-08 (spec.md:24), after which 011 already existed in graph-metadata.

## Traceability Notes

Formal `spec_code` / `checklist_evidence` protocol execution scheduled for iteration 3; this pass seeds `spec_code` with F001/F002.

## Next Focus

Iteration 2 — security (research/ artifact hygiene, secrets/path exposure, fixture-safety claims).

Review verdict: CONDITIONAL
