---
title: "Tasks: Search and Routing Tuning Coordination Parent"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "search and routing tuning tasks"
  - "routing engine coordination tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Search and Routing Tuning Coordination Parent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Search-fusion tuning (sub-track 001)

- [ ] T001 Remove the live scoring effect of the cross-encoder length penalty; `calculateLengthPenalty()` returns `1.0` and `applyLengthPenalty()` becomes a no-op (`cross-encoder.ts`)
- [ ] T002 Add process-wide reranker cache telemetry and expose it from `getRerankerStatus()` (`stage3-rerank.ts`)
- [ ] T003 Add the internal `continuity` adaptive-fusion weight profile and a dedicated continuity MMR lambda (`adaptive-fusion.ts`)
- [ ] T004 Raise `MIN_RESULTS_FOR_RERANK` from 2 to 4 with 4-row boundary fixtures (`stage3-rerank.ts`)
- [ ] T005 Align doc surfaces with the shipped runtime: README, ARCHITECTURE, `command/memory/search`, SKILL, `mcp_server/configs/README`, feature catalog, manual testing playbook
- [ ] T006 Enrich the Tier 3 continuity prompt and add the judged 12-query continuity fixture confirming baseline K=60 (`k-value-optimization.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Content-routing accuracy (sub-track 002)

- [ ] T007 Correct the delivery-versus-progress asymmetry in Tier 1 and refresh overlapping delivery/progress prototype wording (`content-router.ts`, `routing-prototypes.json`)
- [ ] T008 Split hard drop detection from soft operational cues so genuine handover notes survive; refresh command-heavy handover prototypes (`content-router.ts`, `routing-prototypes.json`)
- [ ] T009 Wire the Tier 3 LLM classifier as a real save-path dependency behind `SPECKIT_TIER3_ROUTING=true` (`memory-save.ts`, `content-router.ts`)
- [ ] T010 Align save-path doc surfaces: `command/memory/save`, `command/memory/manage`, ARCHITECTURE, SKILL, feature catalog, playbook scenario 202
- [ ] T011 Add document-wide prevalidation for task updates so `update-in-place` refuses zero-match and multi-match writes (`anchor-merge-operation.ts`)
- [ ] T012 Enrich the Tier 3 system prompt with the 3-level resume ladder and the `metadata_only` rule; add prompt-shape assertions (`content-router.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Graph-metadata validation (sub-track 003)

- [ ] T013 Add checklist-aware `deriveStatus()` fallback so unchecked checklist items keep a packet `in_progress` (`graph-metadata-parser.ts`)
- [ ] T014 Sanitize `derived.key_files` against command-like strings, version tokens, MIME-style values, pseudo-fields, relative noise, title-like entries, and bare filenames (`graph-metadata-parser.ts`)
- [ ] T015 Deduplicate entities by name with canonical-path preference and cap trigger phrases (`graph-metadata-parser.ts`)
- [ ] T016 Tighten backfill traversal so active packets are the default corpus and `z_archive`/`z_future` need `--include-archive` (`scripts/graph/backfill-graph-metadata.ts`)
- [ ] T017 Align doc surfaces with the shipped parser: lowercase checklist-aware status, sanitized `key_files`, deduplicated entities, 12-item trigger-phrase cap, inclusive backfill (`command/memory/save`, `command/memory/manage`)
- [ ] T018 Replace file-shaped guessing with real path resolution across spec folder, repo root, workspace roots, and paired spec tracks (`graph-metadata-parser.ts`)
- [ ] T019 Raise the entity cap from 16 to 24, reject bare runtime names, and scope canonical-doc checks to the current spec folder (`graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
