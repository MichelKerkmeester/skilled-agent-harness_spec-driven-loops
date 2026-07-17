---
title: "Implementation Summary: Create-Benchmark Resource Reorganization and Routing"
description: "Grouped 16 create-benchmark templates and guides into per-family subfolders, repointed every live consumer, repaired moved-file link depth, and added family routing vocabulary to the source contract and both hub routing files."
trigger_phrases:
  - "create benchmark reorg summary"
  - "benchmark family routing summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/001-create-benchmark-reorg-and-routing"
    last_updated_at: "2026-07-13T06:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reorg + reference migration + link repair + family routing vocab complete"
    next_safe_action: "Recursive strict validation and commit"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-create-benchmark-reorg-and-routing |
| **Completed** | 2026-07-13 |
| **Level** | 2 |
| **Actual Effort** | Reorg + reference migration + link repair + routing vocab |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Reorganized `create-benchmark` resources by benchmark family and made the four authored families durably routable, with no change to lane-owned scoring or execution. All 16 templates/guides now live under per-family subfolders (`behavior_benchmark/`, `model_benchmark/`, `skill_benchmark/`, `_shared/`) beneath the preserved top-level `assets/` and `references/` roots, so coverage is visible at a glance and `package_skill.py create-benchmark --check` still reports `PASS`. Every live consumer was repointed (136 references across 31 files), moved-file link depth was repaired, and the four benchmark families were added to both hub routing files.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `create-benchmark/assets/{_shared,behavior_benchmark,model_benchmark,skill_benchmark}/*` | Moved (`git mv`) | 9 templates grouped by family |
| `create-benchmark/references/{_shared,behavior_benchmark,model_benchmark,skill_benchmark}/*` | Moved (`git mv`) | 7 guides/overflow docs grouped by family |
| `create-benchmark/SKILL.md`, `README.md` | Modified | 50 internal reference paths repointed |
| `sk-doc/mode-registry.json`, `hub-router.json` | Modified | Added `behavior benchmark`, `skill-benchmark`, `model-benchmark`, `benchmark fixture`, `benchmark profile` |
| `/create:benchmark` command assets, `agents/markdown.md` (both), sibling `benchmark/README.md` (sk-code/sk-design/system-deep-loop), deep-improvement guides, `mcp_server/benchmarks/README.md`, `check-markdown-links.cjs` allowlist | Modified | Consumer paths repointed |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Moves were made with `git mv` to preserve history. A Node migration (`migrate-cb-paths.cjs`) repointed external `create-benchmark/`-anchored references and create-benchmark's own bare relative references in two passes (spec-folder history excluded). A second pass (`repair-cb-links.cjs`) applied 86 depth-bumps and 6 sibling-remaps so links inside the deeper-nested moved files resolve, verified against the repo's `check-markdown-links.cjs`. Routing vocabulary was added to `create-benchmark/SKILL.md` (source of truth) plus `mode-registry.json` and `hub-router.json`. Metadata was generated with `generate-description.js` and `backfill-graph-metadata.js`; the packet was gated with `validate.sh --recursive --strict`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Family vocab lives in `create-benchmark/SKILL.md` as source of truth | Workstream B regenerates the registry from SKILL.md; putting vocab there makes it survive the regen automatically |
| Historical `.opencode/specs/**` review logs left unmodified | Frozen evidence / banned write path; only live consumers repointed |
| Corrected two HEAD-dangling links (`framework.md`, `behavior-bench-run.cjs`) to their real `system-deep-loop/shared/behavior-benchmark/` home | The reorg disturbed them; making them resolve is strictly better than equivalently-dangling |
| Registry edited by hand, not regenerated | sk-doc registry has no generator; B owns the full regen |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Package | Pass | - | `package_skill.py create-benchmark --check` → `PASS` |
| JSON parse | Pass | - | `mode-registry.json` + `hub-router.json` both parse |
| Reference migration | Pass | 136/136 | `0` residual stale flat refs in live files |
| Link integrity | Pass | - | create-benchmark net broken links = HEAD (1 illustrative dangler, pre-existing) |
| Checklist | Pass | 24/24 | All P0/P1/P2 items verified |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-M01 | Resource family visible from path | Per-family subfolders | Pass |
| NFR-M02 | Routing vocabulary regeneration-safe | Vocab in SKILL.md source of truth | Pass |
| NFR-R01 | No resource content deleted/recreated | 16 `git mv` renames, 0 content change | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Top-level advisor routing** - `model-benchmark`/`benchmark fixture` phrasing still leans toward `system-deep-loop` (which *runs* Lane B); shifting the advisor descriptor (`sk-doc` `graph-metadata.json`) is deferred to workstream B / the global reindex. This hub-internal fix makes create-benchmark sections 9-11 routable within sk-doc.
2. **Illustrative template placeholder** - `assets/behavior_benchmark/behavior_benchmark_index_template.md` links `./baselines/claude-baseline.md`, which resolves only in a filled benchmark instance (dangling in the template, as in HEAD).
3. **Parent 016 pre-existing warnings** - Adding child 001 turned 016 into a phase parent, so its `checklist.md`/`tasks.md` (authored by the prior, merged `benchmark-authoring-centralization` goal) are now scanned under phase-parent strict policy and carry `PRIORITY_TAGS` (18) + `EVIDENCE_CITED` (22) warnings. These predate this workstream and are out of SCOPE-LOCK. This child packet validates `0/0`; the parent is `Errors:0`. A lean-trio conversion of 016 (relocating the prior heavy docs) is an operator decision, tracked as a follow-up.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Single swarm agent authors + implements | Agent completed the reorg + child docs then HALTED on a SKILL.md edit-string mismatch (repo HALT rule) | Orchestrator completed reference migration, link repair, routing vocab, metadata, and validation |
| Child packet only | Also added a `PHASE DOCUMENTATION MAP` to parent `016/spec.md` and a `| **Parent Spec** | ../spec.md |` back-reference in this child | `PHASE_LINKS` discipline requires parent↔child linkage once a phase child exists |

<!-- /ANCHOR:deviations -->
