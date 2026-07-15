# Deep Review Strategy — fable-2 lineage

Session: `fanout-fable-2-1781112180955-4japyt` | Mode: review | Generation: 1 | Lineage: new

## Review Target

`.opencode/specs/system-spec-kit/027-xce-research-based-refinement` (spec-folder, phase parent with 12 children 000–011)

## Files Under Review

| # | Path | Role | Status |
|---|------|------|--------|
| 1 | `spec.md` (parent) | Phase-parent control doc | pending |
| 2 | `description.json` / `graph-metadata.json` (parent) | Mandatory metadata | pending |
| 3 | `000-release-cleanup/` … `011-command-presentation-workflow-separation/` | 12 phase children (spec.md + metadata) | pending |
| 4 | `resource-map.md` (parent) | Resource-map coverage gate input | pending |
| 5 | `context-index.md`, `timeline.md`, `before-vs-after.md` | Cross-cutting bridge docs | pending |
| 6 | `changelog/README.md` + track folders | Shipped-state index | pending |
| 7 | `research/` | Research artifact hygiene (security slice) | pending |
| 8 | `002-memory-write-safety/` checklist + tasks + implementation-summary | checklist_evidence protocol sample | pending |

## Cross-Reference Status

### Core protocols (hard gates)

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | pending | Parent phase map vs on-disk child statuses vs graph metadata |
| `checklist_evidence` | pending | Sample child checklists; verify evidence claims independently |

### Overlay protocols (advisory)

| Protocol | Status | Notes |
|----------|--------|-------|
| `feature_catalog_code` | pending | Resource-map coverage of phases vs map entries |
| `playbook_capability` | pending | Likely N/A for spec-folder target; confirm |

## Known Context

- Target is a phase parent (lean trio policy: spec.md + description.json + graph-metadata.json at root; heavy docs live in children).
- `resource-map.md` IS present at init → `resource_map_present: true`; Resource Map Coverage is a mandatory audit angle with at least one dedicated pass.
- Resource-map snapshot: parent `resource-map.md` exists at spec root; coverage vs phases 000–011 to be classified into touched / not-touched (expected-by-scope vs gap) / unmapped-implementation-paths.
- 12 phase children on disk: 000, 001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011.
- Sibling lineages exist under `review/lineages/`; this lineage reviews independently and writes ONLY under `review/lineages/fable-2/`.
- Current repo branch is `028-mcp-to-cli-tool-transition`; child 010 shares the same topic slug — verify status/handoff coherence between child 010 and live work.

## Review Boundaries

- READ-ONLY on all target files; no fixes during review.
- All writes confined to `review/lineages/fable-2/`.
- Findings require `[SOURCE: file:line]` evidence; inference-only findings rejected.
- P0 requires re-read of cited lines plus adversarial self-check before recording.
- TCB: 8–11 tool calls per iteration (max 12).

## Iteration Plan / Next Focus

| Iter | Dimension | Slice |
|------|-----------|-------|
| 1 | correctness | Parent control docs vs on-disk children (phase map, metadata, child statuses) |
| 2 | security | research/ + scratch/ artifact hygiene, secrets/path exposure, fixture safety claims |
| 3 | traceability | spec_code + checklist_evidence protocols; resource-map coverage gate (mandatory) |
| 4 | maintainability | changelog index, timeline/before-vs-after coherence, continuity frontmatter, content discipline |
| 5 | stabilization | Replay all active findings across all four dimensions |

## Findings Ledger

| ID | Sev | Dim | Title | Status |
|----|-----|-----|-------|--------|
| F001 | P1 | correctness | Parent inventory omits live phase 011 | active |
| F002 | P1 | correctness | Phase-map Status column + §141 narrative stale | active |
| F003 | P2 | correctness | Child metadata stale / schema-inconsistent (002, 008/009/011) | active |
| F004 | P2 | security | Home paths in dispatch artifacts escape `*.log` ignore rule (public repo) | active |
| F005 | P1 | traceability | Resource map scope-frozen 2026-06-04; omits 002–011 surfaces; stale last-active-child claim | active |
| F006 | P2 | traceability | context-index current-folder column stale/self-inconsistent after 003 consolidation | active |
| F007 | P2 | maintainability | Parent _memory.continuity stale on every progress field | active |
| F008 | P2 | maintainability | Changelog index inconsistent: 000 shipped-but-listed-planned, no changelog folder; 001 vocabulary conflict | active |

Coverage: correctness ✅ (1), security ✅ (2), traceability ✅ (3), maintainability ✅ (4). Protocols: `spec_code` partial (F001/F002), `checklist_evidence` pass, `feature_catalog_code` partial (F005), `playbook_capability` n/a. Resource-map coverage gate executed (mandatory pass). F002 evidence widened in iter 4 (changelog + timeline confirm parent map is the stale surface).
Watch item resolved at iteration 5: concurrent session updated spec.md map + graph-metadata to 015; description.json still lags (F001 narrowed, not closed).

**RUN COMPLETE** — 5/5 iterations, stabilization replay clean (no new findings, no downgrades). Verdict: **CONDITIONAL** (0 P0 / 3 P1 / 5 P2, hasAdvisories). Stop reason: maxIterationsReachedWithFullDimensionCoverage. See `review-report.md`.
