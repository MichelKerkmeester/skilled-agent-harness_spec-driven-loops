# Resource Map — fable-2 review lineage (emitted from converged delta evidence)

Scope: files cited as finding evidence or independently verified during the 5-iteration deep review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`.

> Status vocabulary: `OK` (exists on disk) · `STALE` (exists but carries claims contradicted by other live surfaces).

## Reviewed Surfaces

| Path | Role | Status | Findings |
|------|------|--------|----------|
| `spec.md` (parent) | Phase-parent control doc | STALE | F002, F007 (map cells healed for 011–015 mid-review by concurrent session) |
| `description.json` (parent) | Mandatory metadata | STALE | F001 (children stops at 010; disk has 16 children) |
| `graph-metadata.json` (parent) | Mandatory metadata | OK | — (children_ids current through 015; last_active_child_id null) |
| `resource-map.md` (parent) | Packet inventory baseline | STALE | F005 (scope-frozen 2026-06-04; stale last-active-child claim) |
| `context-index.md` | Migration bridge | STALE | F006 (current-folder column double-booked/self-inconsistent) |
| `changelog/README.md` | Shipped-state index | STALE | F008 (000 shipped-but-listed-planned; 001 vocabulary conflict) |
| `timeline.md` | Generated chronology | OK | — (regenerated 2026-06-10T15:14:18Z, current) |
| `before-vs-after.md` | User-facing overview | OK | — (matches shipped 002 behavior) |
| `002-memory-write-safety/{spec,checklist,tasks}.md` | checklist_evidence sample | OK | F003 (description.json only) |
| `008-openltm-retrieval-observability/spec.md` + `description.json` | Status drift evidence | STALE | F002, F003 |
| `009-openltm-continuity-resilience/spec.md` | Status drift evidence | STALE | F002 |
| `011-command-presentation-workflow-separation/spec.md` | Inventory omission evidence | OK | F001 |
| `006-gem-team-adoption/001-typed-agent-io-adapter/spec.md` | Implemented-leaf evidence | OK | F002 |
| `007-memclaw-derived-memory-hardening/001-provenance-and-audit/spec.md` | Implemented-leaf evidence | OK | F002 |
| `000-release-cleanup/{001,005,008}/spec.md` | Completed-children evidence | OK | F002, F008 |
| `010-mcp-to-cli-tool-transition/004-release-and-program-cleanup/checklist.md` | checklist_evidence sample | OK | — (fully evidenced, 0 unchecked) |
| `research/**/prompts/*.err`, `**/research/**` state files | Dispatch byproducts | OK | F004 (home-path disclosure; escape `*.log` ignore) |
| `.gitignore` (repo root) | Exposure analysis | OK | F004 evidence |
| `.opencode/skills/system-spec-kit/mcp_server/tests/secret-scrubber.vitest.ts` | CHK-030 verification | OK | — (canonical example fixtures confirmed) |

## Phase-5 Augmentation (novel logic gaps)

- Partial multi-surface inventory updates are the recurring failure mode: the mid-review concurrent fix updated 2 of 3 mandatory parent surfaces (spec.md, graph-metadata.json) and skipped description.json — exactly the drift class F001 describes (iteration 5 evidence).
- Phases 012–015 appeared on disk at 2026-06-10 ~17:48 UTC during this review; any merged report consuming this lineage should treat parent-inventory line numbers as volatile.
