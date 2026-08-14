# Iteration 1: Census + Feasibility of Grouping the 036 Phase Children

## Focus
Establish the complete grounded census of the 036 phase-parent children and their metadata, identify every constraint surface that a merge/regroup would touch, and judge whether grouping into fewer larger multi-phase parents is feasible and beneficial for context optimization.

## Findings

### F1.1 — Exact census (confirmed from on-disk folders + metadata)
The 036 parent (`specs/system-deep-loop/036-deep-loop-innovation/`) has **45 on-disk child directories** matching `^[0-9]{3}-`: phases 001-033, 035, 047-057. [SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation (directory listing)]

- **13 are already phase-parents** (have their own `NNN-` children): 004(3), 006(4), 007(7), 008(5), 009(7), 010(5), 011(5), 012(4), 013(8), 014(3), 047(5), 048(3), 049(2). [SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/{004,006,007,008,009,010,011,012,013,014,047,048,049}/graph-metadata.json]
- **32 are leaf phases** (no children): 001-003, 005, 015-033, 035, 050-057. [SOURCE: file:.../graph-metadata.json per child]
- **61 nested grandchildren** across the 13 parents. Total leaf spec folders under the parent ≈ 45 + 61 = 106 (excluding the parent itself).
- Parent `graph-metadata.json` `children_ids` currently lists **44** entries (all on-disk children except 057 — the new research host is not yet registered). [SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json]

### F1.2 — The tooling already classifies 036 as unhealthy (decisive feasibility signal)
`is-phase-parent.ts` / `assessPhaseParentHealth()` defines `PHASE_PARENT_WARNING_THRESHOLD = 20` and `PHASE_PARENT_ERROR_THRESHOLD = 40`. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:24-25]

Running the health CLI on the live parent returns:
```
error	45	45 children exceeds error threshold (40). Split into nested phase parents or move historical phases under z_archive/ to keep the manifest readable.
```
[SOURCE: command `node .opencode/skills/system-spec-kit/scripts/dist/spec/is-phase-parent.js health specs/system-deep-loop/036-deep-loop-innovation`]

**Interpretation:** The spec-kit's own manifest-health model treats a 45-child direct listing as an *error* and explicitly recommends "Split into nested phase parents". This is tooling-backed evidence that grouping the children into fewer, larger multi-phase parents is not merely feasible — it is the *canonically recommended* remediation for a manifest of this size. This converts the research question from "is it allowed?" to "how should it be done correctly".

### F1.3 — Constraint surfaces a merge MUST update in lockstep (grounded inventory)
A renumber/regroup is not a directory rename; these machine-readable surfaces must be updated atomically or validation breaks:

1. **Parent `graph-metadata.json` `children_ids`** — the 44-entry array of `system-deep-loop/036-deep-loop-innovation/{slug}` paths. [SOURCE: file:.../graph-metadata.json:6-51]
2. **Each child's `graph-metadata.json`** — `packet_id`, `spec_folder`, `parent_id` (if stored), and `derived.last_active_child_id` for parents. [SOURCE: file:.../{child}/graph-metadata.json]
3. **Each child's `description.json`** — `specFolder`, `parentChain`, `specId`, `folderSlug`, `memoryNameHistory`. [SOURCE: file:.../003-baseline-taxonomy-and-state-census/description.json]
4. **Parent `spec.md` PHASE DOCUMENTATION MAP + Phase Map table + handoff criteria** — rows keyed by `NNN-folder-slug`. [SOURCE: file:.../spec.md:213-258]
5. **Parent `manifest/phase-tree.json`** — `phases[]` entries and `live_direct_children` (currently 44). [SOURCE: file:.../manifest/phase-tree.json]
6. **`validate.sh` hardcoded child manifest** — a **40-entry, sha256-hash-locked** list for the canonical 036 path (001-033, 035, 047-052). **053-056 are on disk but NOT in the manifest** — pre-existing drift that also must be reconciled. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/validate.sh:217-218]
7. **`specs/descriptions.json`** — the repo-wide spec-folder index (every child appears). [SOURCE: file:specs/descriptions.json:23296+]
8. **`.opencode/specs` symlink → `../specs`** — recursive validator references `.opencode/specs/...` paths; the symlink means both spellings resolve. [SOURCE: file:.opencode/specs (symlink)]
9. **`recursive-child-manifest.vitest.ts`** — references `.opencode/specs/system-deep-loop/036-deep-loop-innovation/...` child paths. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts:16-24]
10. **Cross-references in parent-level docs**: `handover.md`, `goal.md`, `goal-plan-review.md`, `cutover-execution-plan.md`, `dispositions.md`, `before-and-after.md`, `execution-sequencing-strategy.md`, `goal-prompt.md`. [SOURCE: file:.../ (parent directory listing)]
11. **Cross-references in sibling/other packets**: e.g. `specs/sk-doc/022-code-readme-coverage/{spec.md,tasks.md}` and `specs/sk-doc/023-feature-catalog-integrity/*/tasks.md` cite 036 children. [SOURCE: file:specs/sk-doc/022-code-readme-coverage/spec.md, file:specs/sk-doc/023-feature-catalog-integrity/spec.md]

### F1.4 — Precedent: 036 was already renumbered once (034 <-> 036)
Git history shows commit `8d3b5b21d57` on 2026-07-17: `docs(specs): renumber system-deep-loop packets 034<->036`. [SOURCE: git log for specs/system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research/]
This is a confirmed, real precedent that renumbering of this packet family already happened, and reinforces the CRITICAL requirement for a timeline.md design (research sub-question Q4) — the numeric prefix is NOT a trustworthy chronology.

### F1.5 — Context-optimization benefit is real and measurable
- The parent `spec.md` phase map is ~50 table rows and the parent-level docs (goal.md 41KB, handover.md 46KB, spec.md 33KB) must be read into context to resume the packet. [SOURCE: file:.../spec.md, goal.md, handover.md (sizes)]
- A 45-child manifest + 61 grandchildren means any `memory_context`/`@context` surface for "resume 036" pulls a very wide net. Grouping into ~6-8 multi-phase parents with 4-9 children each gets every level under the healthy threshold (both parents and grandparents), cutting the direct listing per level from 45 to <20 and each phase map to a scannable size.
- The `is-phase-parent` health check would flip from `error` to `ok` for every new group. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:125-145]

## Sources Consulted
- specs/system-deep-loop/036-deep-loop-innovation/ (directory + graph-metadata.json + spec.md + manifest/phase-tree.json + description.json)
- Child graph-metadata.json and description.json files (001-057)
- .opencode/skills/system-spec-kit/scripts/spec/validate.sh (load_child_manifest)
- .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts
- Command: node .opencode/skills/system-spec-kit/scripts/dist/spec/is-phase-parent.js health specs/system-deep-loop/036-deep-loop-innovation
- specs/descriptions.json, .opencode/specs symlink, recursive-child-manifest.vitest.ts
- git log for 036 child paths

## Assessment
- **newInfoRatio:** 0.95
- **noveltyJustification:** First iteration of this lineage; established the full grounded census (45 dirs / 13 parents / 61 grandchildren), the tooling's error-classification of the manifest, the complete constraint surface, and the 034<->036 renumber precedent — nearly all of it net-new to this packet.
- **Confidence:** Confirmed (on-disk + metadata + tool output read directly).

## Reflection
- What worked: reading the actual validate.sh manifest block and running the phase-parent health CLI gave decisive, citable feasibility evidence rather than speculation.
- What failed: nothing this iteration.
- Ruled out: "grouping is unnecessary / manifest is fine" — REFUTED by the tool's own error classification.

## Recommended Next Focus
Iteration 2: Design the concrete cluster set for the original program (001-017) and the remediation tree (018-033) — which children become children of which new multi-phase parents, with dependency-aware ordering and optimized names.
