# Iteration 5: Feasibility Verdict (KQ1) + Synthesis Input

## Focus
Consolidate all iterations into a final recommendation: is consolidation into fewer larger multi-phase parents feasible and beneficial, which shape, and what must be true to do it safely.

## Findings

### 1. Verdict: FEASIBLE and BENEFICIAL, with strong scope caveats
Consolidation of the 44 direct children into 7 group parents is mechanically feasible (the spec-kit already supports arbitrary phase-parent depth — proven by 004/006-014/047-049 and `has_phase_children`/recursive traversal in validate.sh) and beneficial **specifically for the dependency-spine groups** (B and C). It is *not* uniformly beneficial for the independent leaf remediation wave.

- **Where the context win is real:** Group B (`010-substrate-and-orchestration`, 7 children 005-011) and Group C (`020-mode-migration-and-cutover`, 4 children 012-015) are pure dependency chains. One parent loads the whole spine's map without walking 11 folders; a single `spec.md` at the group level plus per-child leaves is exactly the "multi-phase parent" pattern the phase documentation map already sketches.
- **Where the win is small:** Group E1 (019-032 remediation leaves) and E2 (033/035/047-052) are mostly independent defect/hardening items. A parent adds one navigation hop and one more metadata file per group with little shared-context payoff. **Recommendation:** consolidate E2's already-parented 047/048/049 *only* (they're already parents; grouping them under `050-hardening-and-repair` is nearly free), and treat E1 as a light "bucket" parent purely for organizational hygiene, accepting the marginal cost.
- **Do NOT flatten.** Option 2 (renumber all 44 into one level) yields zero benefit and the same cost.

### 2. The hard part is NOT the renames — it's the reference surfaces
45 `git mv` operations are trivial. The expensive, error-prone part is the 15-surface checklist (iteration 3 §3): validate.sh embedded manifest + recomputed sha256, `recursive-child-manifest.vitest.ts` fixture, `specs/descriptions.json` regeneration, 98 cross-repo files, parent + child `graph-metadata.json` (`parent_id`, `children_ids`, `spec_folder`, `packet_id`), child spec.md adjacency lines, handover/docs, and memory DB re-ingest. Any one of these left stale produces either a `--strict` failure or silent stale-path drift.

### 3. Three pre-existing staleness bugs surface for free
- **validate.sh hardcoded manifest lists 40 children but 44 exist** (053-056 missing); it only passes today because the exact-disk-set requirement is gated behind `SPECKIT_CHILD_MANIFEST_FILE`. [SOURCE: validate.sh:216-219 vs disk]
- **Parent spec.md PHASE DOCUMENTATION MAP statuses are stale for 053-056**: 053 shows "Planned" while its graph-metadata says `complete`; 054-056 show "Metadata pending" but their graph-metadata files exist (all `complete`). The `sync-phase-map-status.ts` script exists but hasn't been run for these. [SOURCE: spec.md:255-258 vs child graph-metadata]
- **`manifest/phase-tree.json` covers only 001-017** though it claims `live_direct_children: 44`. [SOURCE: manifest/phase-tree.json]

These are evidence that the tree's metadata is already drifting under 44 flat children — a supporting argument that consolidation (with a sync/timeline discipline) improves maintainability.

### 4. Runtime code references the LEGACY path `.opencode/specs/...`
`.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:45-59` and `shipped-census.ts`, plus runtime tests (`cutover-certificate.vitest.ts:101`, `legacy-real-log.ts:19-21`), reference `.opencode/specs/system-deep-loop/036-deep-loop-innovation/...` and child sub-paths (018, 024, 016). The `.opencode/specs` → `specs/` symlink makes these resolve today, but a rename of the underlying folder breaks the resolved path. The migration sweep must handle BOTH path spellings. [SOURCE: git grep + file reads]

### 5. Chronology must be recorded before the move (KQ4 is the gate)
The numbering already diverges from work order in the 02x-05x range (050 worked 07-27 before 019/020 on 07-29; 021 after 022-032; 047-049 after 033). The `timeline.md` design from iteration 4 is the mandatory precondition — generate it, review it, commit it, THEN rename. After the move it is the only place the original order survives.

### 6. Final recommended shape (7 group parents)
- `000-foundation-and-planning` → 001, 002, 003, 004
- `010-substrate-and-orchestration` → 005, 006, 007, 008, 009, 010, 011
- `020-mode-migration-and-cutover` → 012, 013, 014, 015
- `030-gate-closeout-and-drift` → 016, 017, 018
- `040-runtime-hygiene-and-remediation` → 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032
- `050-hardening-and-repair` → 033, 035, 047, 048, 049, 050, 051, 052
- `060-review-and-conformance` → 053, 054, 055, 056

Inner children of the 13 existing parents become third-level (e.g., `020/002-mode-and-lane-migrations/001-deep-research`). `dispositions.md` stays at root (its disambiguation note survives).

### 7. Safe-do conditions (definition of "beneficial" honored)
The consolidation is worthwhile ONLY if the migration runs as one disciplined sequence: timeline.md first → per-group `git mv` commits → validate.sh manifest+hash+vitest in lockstep → metadata/adjacency updates → descriptions.json + memory re-ingest → 98-file sweep → `validate.sh --strict --recursive` green + zero `git grep 036-deep-loop-innovation/0\d\d` hits. Without that, the context win is outweighed by drift risk.

## Assessment
- newInfoRatio: 0.55
- Novelty justification: Delivered the feasibility verdict with scope-specific benefit analysis, surfaced the legacy `.opencode/specs/` path references in runtime code/tests, confirmed the three pre-existing staleness bugs, and stated the safe-do conditions. Lower ratio because it consolidates prior findings.
- Confidence: High (verdict grounded in on-disk structure, validate.sh mechanics, and reference census).

## Reflection
- What worked: tracing runtime code references revealed the legacy-path spelling must be in the sweep.
- What failed / ruled out: a single flat consolidation (no win); consolidation without timeline-first (loses lineage).

## Recommended Next Focus
Synthesis phase: produce `research.md` (17-section compile), `resource-map.md`, convergence report, dashboard, and the `timeline.md` reference design artifact.
