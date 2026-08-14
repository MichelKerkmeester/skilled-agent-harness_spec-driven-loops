# Deep Research Synthesis — 036 Phase Consolidation Research (ds-a fanout lineage)

> Detached fan-out lineage `ds-a`. Scope: `specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-a`. Research/proposal only — nothing outside the lineage dir was modified.

## 1. Executive Summary

The 036 phase-parent has **44 direct child folders** (`^[0-9]{3}-`) plus the 057 host. Consolidating them into fewer, larger multi-phase parents is **feasible and beneficial for the dependency-spine groups, marginal for the independent remediation leaves, and safe only when a chronological `timeline.md` is generated and committed BEFORE any rename**. The recommended target is **7 group parents** (000/010/020/030/040/050/060 bands). The hard cost is not the 45 `git mv` operations — it is the **15-surface reference/migration checklist**, led by the hardcoded child manifest + sha256 embedded in `validate.sh`.

## 2. Background & Context

- 036 is a phase-parent packet (`specs/system-deep-loop/036-deep-loop-innovation`) with a lean trio (spec.md, description.json, graph-metadata.json).
- Parent `graph-metadata.json` `children_ids` holds exactly 44 entries; on-disk census matches exactly (no orphans, no stale IDs).
- 13 children are themselves phase parents (004, 006-014, 047, 048, 049) with inner `NNN-` sub-children; 31 are leaves with plan/tasks/checklist.
- Numbering has gaps (034, 036-046 absent); a root file `dispositions.md` coexists with folder `033-identity-and-lock-ownership-hardening/` (explicitly distinct per spec.md:209).

## 3. Key Findings

1. **Census clean** — 44 children, in sync with parent children_ids. [SOURCE: iteration-001.md; graph-metadata.json:6-51]
2. **Two structural kinds** — 13 phase-parents (with 2-8 sub-children each) vs 31 leaves. Confirmed per-folder sub-child counts. [SOURCE: iteration-001.md]
3. **validate.sh hardcodes a 40-child manifest for exactly this parent** with embedded sha256 `f6cf1e94...` (validate.sh:216-219); hash verified against recompute. 053-056 are missing from it today; it passes only because exact-disk-set is gated behind `SPECKIT_CHILD_MANIFEST_FILE`. [SOURCE: iteration-001.md; validate.sh:182-297]
4. **Parent spec.md PHASE DOCUMENTATION MAP** lists all 44 with status copied from child graph-metadata; already stale for 053-056 (053 shows Planned vs complete; 054-056 Metadata pending though graph-metadata exists). `sync-phase-map-status.ts` exists but not applied to these. [SOURCE: iteration-005.md; spec.md:255-258]
5. **manifest/phase-tree.json covers only 001-017** though it declares `live_direct_children: 44`. [SOURCE: iteration-002.md; manifest/phase-tree.json]
6. **specs/descriptions.json** (repo index, 3207 entries) has 133 entries referencing 036 paths; must be regenerated, not hand-edited. [SOURCE: iteration-001.md]
7. **98 non-036 files** reference `036-deep-loop-innovation`, including runtime code/tests that use the **legacy `.opencode/specs/...` path spelling** (graph.ts, shipped-census.ts, cutover-certificate.vitest.ts, legacy-real-log.ts). The sweep must handle both `specs/` and `.opencode/specs/` spellings. [SOURCE: iteration-005.md]
8. **Git first-add timestamps** (via `git log --all --follow --diff-filter=A`, surviving the `.opencode/specs → specs/` flip at 606e55cb8a9) plus graph-metadata created_at/last_save_at reveal **numbering ≠ work order** in the 02x-05x range. [SOURCE: iteration-004.md]

## 4. Analysis & Rationale

### Feasibility (KQ1)
- Spec-kit already supports arbitrary phase-parent depth (proof: 004/006-014/047-049; `has_phase_children` and recursive traversal in validate.sh are depth-agnostic).
- Context optimization is real where children form a dependency spine: Group B (005-011, 7 children) and Group C (012-015, 4 children) load as one map.
- Marginal for independent leaves (019-032, 033/035/047-052); a parent adds a hop with little shared context.
- Option 2 (flat renumber, no groups) yields zero benefit at equal cost — rejected.

### Grouping (KQ2) — the 7-group shape
| Band | Group parent | Children |
|------|--------------|----------|
| 000 | foundation-and-planning | 001, 002, 003, 004 |
| 010 | substrate-and-orchestration | 005, 006, 007, 008, 009, 010, 011 |
| 020 | mode-migration-and-cutover | 012, 013, 014, 015 |
| 030 | gate-closeout-and-drift | 016, 017, 018 |
| 040 | runtime-hygiene-and-remediation | 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032 |
| 050 | hardening-and-repair | 033, 035, 047, 048, 049, 050, 051, 052 |
| 060 | review-and-conformance | 053, 054, 055, 056 |

Inner children of the 13 existing parents become third-level (e.g., `020/002-mode-and-lane-migrations/001-deep-research`). `dispositions.md` stays at root.

### Migration plan (KQ3)
Full 44-row old→new mapping in iteration-003.md §2. Reference surfaces (checklist):
1. Parent graph-metadata `children_ids` → 7 group parents.
2. Parent spec.md phase maps (PHASE MAP & OUTCOMES + PHASE DOCUMENTATION MAP + invariants) rewrite.
3. Parent description.json — regenerate.
4. manifest/phase-tree.json — extend or document as original-program record.
5. handover.md — update child-path references.
6. Child graph-metadata — parent_id/spec_folder/packet_id; children_ids for the 13 parents.
7. Child spec.md adjacency lines ("Sibling phase adjacency" ×5, "Phase adjacency"/"predecessor" ×19/23).
8. Child description.json — regenerate.
9. Child docs (implementation-summary/handover/tasks/plan/checklist) with embedded old paths.
10. validate.sh hardcoded manifest + **recomputed sha256** (validate.sh:216-219, hash via `printf '%s' | sha256sum`).
11. recursive-child-manifest.vitest.ts — update in lockstep with validate.sh.
12. specs/descriptions.json — regenerate whole index.
13. 98 cross-repo files (runtime code/tests, other spec packets) — grep+sed sweep, both path spellings.
14. Memory DB — re-ingest (`memory_index_scan`/`generate-context.js`) so search stops serving stale paths.
15. `dispositions.md` disambiguation note preserved.

Execution order: freeze+snapshot → timeline.md → per-group `git mv` commits → validate.sh+vitest in lockstep → metadata/adjacency → regenerate descriptions.json + memory re-ingest → 98-file sweep → `validate.sh --strict --recursive` green + zero stale-path grep.

### timeline.md (KQ4)
- Root: `specs/system-deep-loop/036-deep-loop-innovation/timeline.md`; per-group copies after consolidation.
- Schema: append-only table with `chrono_id` (stable T001… key), folder_slug, band, created_at, git_first_add, last_save_at, status, worked_order, notes.
- Invariants: chrono_id assigned once in original git-first-add order (tie-broken by folder number for the planning batch); renames update only slug/band cells; append-only.
- Worked order (44): 001 → 002-017 batch → 018 → 050 → 019/020 → 022-032 → 021 → 033 → 035 → 047-049 → 051 → 052 → 053-056. 050 precedes 019/020; 021 follows 022-032 — both invisible in current numbering.

## 5. Recommendations

1. **Proceed with the 7-group consolidation** as a dedicated execution packet, adopting the iteration-3 mapping and the safe-do sequence (timeline-first).
2. **Generate + commit timeline.md before any rename** (mandatory gate).
3. **Fix the three pre-existing staleness bugs** during the same program: validate.sh 40-vs-44 manifest, spec.md phase-map statuses for 053-056 (run sync-phase-map-status.ts), phase-tree.json 17-vs-44.
4. **Do not flatten**; keep the 13 existing inner parents intact as third-level structures.
5. **Treat the 98-file cross-repo sweep (both path spellings) and the memory re-ingest as blocking** — they are where silent drift hides.

## 6. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Full-repo git log for chronology | Timed out; unusable at repo scale | bash | 1 |
| git log without --follow | Silent no-op after specs path flip | git log | 1 |
| Flat 5-group split | Ignores that 13 children are already parents | iteration-002.md | 2 |
| Flat renumber, no group parents | No context win at equal cost | iteration-003.md | 3 |
| Folder number as chronological order | Numbering ≠ work order in 02x-05x | iteration-004.md | 4 |
| One-level consolidation of all 44 | Zero benefit, same migration cost | iteration-005.md | 5 |

## 7. Open Questions

1. Should group-parent slug bands use `000/010/...` (collision-risk with inner 0NN) or a distinct scheme (e.g., `a1-a7`)? Iteration-3 recommends keeping `NNN-` bands and accepting grandchild depth; a reviewer should confirm no tooling assumes one-level depth.
2. Should 040-runtime-hygiene-and-remediation (14 leaves) be split further at execution time if per-group context still high? (Proposal keeps it whole; easy to split later.)
3. Ownership: which packet executes the migration, and is `sync-phase-map-status.ts` extended to cover group parents?

## 8. References

- All evidence lives in `research/lineages/ds-a/iterations/iteration-00{1..5}.md`.
- On-disk ground truth: `specs/system-deep-loop/036-deep-loop-innovation/` (children, spec.md, graph-metadata.json, manifest/phase-tree.json, description.json).
- `specs/descriptions.json` (repo index).
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
- `.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts`.
- `.opencode/skills/system-deep-loop/runtime/` (write-set-conflict-graph, tests).
