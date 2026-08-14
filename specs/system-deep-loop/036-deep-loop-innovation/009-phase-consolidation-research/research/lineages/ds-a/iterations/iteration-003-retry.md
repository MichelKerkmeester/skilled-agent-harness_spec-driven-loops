# Iteration 3 (Retry): Full Migration Plan — Rename Mapping + Every Reference Surface

## Focus
Re-verify the existing `iteration-003.md` evidence for the migration plan (KQ3): the old→new rename mapping and EVERY reference surface. This is a YAML-authorized conformance retry — it repairs the missing route-proof/delta contract, does not broaden scope, and does not overwrite the prior iteration narrative or state row. Prior `iteration-003.md` remains immutable evidence.

## Actions Taken
- Read the deep-research agent definition (`.opencode/agents/deep-research.md`) before acting.
- Read prior state: `deep-research-state.jsonl` (runs 1-5 + retry runs 1-2), `deep-research-config.json`, `deep-research-strategy.md`, and the prior `iteration-003.md`.
- Verified boundary: confirmed `iteration-003-retry.md` and `deltas/iter-003.jsonl` were absent (deltas dir held only `iter-001.jsonl`, `iter-002.jsonl`), and confirmed write targets stay inside the ds-a lineage packet.
- Independently re-verified on-disk census: 45 dirs matching `^[0-9]{3}-`, 44 non-host children; parent `graph-metadata.json` `children_ids` = 44.
- Independently re-verified `validate.sh:216-219`: embedded 40-entry child manifest (001-033, 035, 047-052) with `expected_hash=f6cf1e94...`; confirmed the hash mechanism at `validate.sh:157-164` (`child_manifest_hash` via `sha256sum`/`shasum -a 256`) and mismatch → exit 2 at `validate.sh:239-246`.
- Independently re-derived the 98 non-036 reference count and its breakdown (79 specs + 19 `.opencode`).
- Inspected the vitest lockstep fixture and discovered a NEW surface detail (legacy path prefix).

## Findings

### 1. Rename mapping retained unchanged (confirmed)
The 44-row old→new mapping in `iteration-003.md` (7 group parents: `000-foundation-and-planning`, `010-substrate-and-orchestration`, `020-mode-migration-and-cutover`, `030-gate-closeout-and-drift`, `040-runtime-hygiene-and-remediation`, `050-hardening-and-repair`, `060-review-and-conformance`) is complete and consistent with the on-disk census: all 44 non-host children appear exactly once. Option 1 (group parents, inner children become second/third level) remains recommended; `has_phase_children` (`validate.sh:145`) globs `[0-9][0-9][0-9]-*/` and works at any depth. [SOURCE: iteration-003.md:8-66] [SOURCE: ls of specs/system-deep-loop/036-deep-loop-innovation/]

### 2. validate.sh embedded manifest (confirmed, with mechanism detail)
`validate.sh:216-219` hardcodes the 40-child branch for `*/specs/system-deep-loop/036-deep-loop-innovation` with `expected_hash=f6cf1e94...`. The hash is verified via `child_manifest_hash` (`validate.sh:157-164`, `printf '%s' | sha256sum`, macOS fallback `shasum -a 256`) at `validate.sh:239-246`; mismatch returns exit 2, blocking every `--strict` run until recomputed. The list remains stale today (omits 053-056). Consolidation is the moment to replace this branch with the 7 group-parent names + recomputed hash, or drop the hardcoded branch for the generic glob. [SOURCE: validate.sh:216-219] [SOURCE: validate.sh:157-164,239-246]

### 3. 98-file cross-repo reference count (confirmed, now with breakdown)
`git grep -l "036-deep-loop-innovation"` excluding the 036 tree returns exactly **98** files: **79 under `specs/`** + **19 under `.opencode/`**. The 19 `.opencode` files are the runtime code/tests (`runtime/lib/write-set-conflict-graph/graph.ts`, `shipped-census.ts`, 14 vitest/test files under `runtime/tests/`), plus `validate.sh` and `recursive-child-manifest.vitest.ts`. The 79 specs files are dominated by `037-graph-engineering` research lineage artifacts (~51 machine-generated logs/prompts/deltas/iterations), plus real spec references in `sk-code`, `sk-design`, `sk-doc`, `system-speckit`, `system-skill-advisor`, and the shared `specs/descriptions.json` index. Implication for the migration checklist: a large share of the 98 are historical research artifacts that do not need hand-editing — the editable reference surfaces are the runtime code/tests, validate.sh+vitest, the other spec packets' graph-metadata/spec.md/tasks.md, and descriptions.json. [SOURCE: git grep -l (observed output)]

### 4. NEW: vitest lockstep fixture uses the legacy `.opencode/specs/` prefix
`recursive-child-manifest.vitest.ts:14-24` resolves both `check-goal-file-manifest.sh` and `goal-file-manifest.txt` under `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/` and asserts child `001-deep-loop-market-research` — i.e. the test fixture references the **legacy `.opencode/specs/` symlink prefix**, not `specs/`. The migration's vitest lockstep update must therefore also repoint these fixture paths to the legacy-prefix location of the relocated children (or to the `specs/` canonical path if the fixture is modernized in the same change). This was not called out in the prior iteration and is a new reference surface for the checklist. [SOURCE: recursive-child-manifest.vitest.ts:14-24]

### 5. All other prior reference surfaces retained (confirmed)
Parent packet: `graph-metadata.json` `children_ids` (44 → 7 group parents), `spec.md` PHASE MAP / PHASE DOCUMENTATION MAP tables, `description.json` regeneration, `manifest/phase-tree.json` (17-vs-44 coverage gap), `handover.md`. Children: `parent_id`/`spec_folder`/`packet_id`, sibling-adjacency lines, per-child description.json, embedded-path prose in implementation-summary/tasks/plan/checklist. DB: memory re-ingest (`memory_index_scan`) + `generate-context.js` refresh. These remain valid as recorded. [SOURCE: iteration-003.md:68-107]

## Questions Answered
- KQ3: Full migration plan confirmed (rename mapping + every reference surface). New surface added: the vitest fixture's legacy `.opencode/specs/` prefix; the 98-file count is now quantitatively broken into editable vs. historical-artifact surfaces.

## Questions Remaining
- None new. Execution-time detail still deferred: exact per-file edit counts inside each runtime file (grep sweep at execution time), and whether to modernize the vitest fixture to `specs/` or keep the legacy prefix (a migration-decision, not research).

## Ruled Out
- None. This was a conformance retry; no new directions were explored per the saturation record.

## Edge Cases
- Contradictory evidence: none found. All re-verified claims agree with the prior iteration.
- Missing dependencies: none. Git grep and on-disk reads were sufficient.
- Partial success: none — all planned verification actions completed.

## Sources Consulted
- `.opencode/agents/deep-research.md` (agent contract)
- `specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-a/deep-research-state.jsonl`
- `specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-a/deep-research-config.json`
- `specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-a/deep-research-strategy.md`
- `specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-a/iterations/iteration-003.md`
- `specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json` (children_ids=44)
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:157-164,216-219,239-246`
- `.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts:14-24`
- `git grep -l "036-deep-loop-innovation"` output (observed)

## Assessment
- New information ratio: 0.40
- Questions addressed: KQ3 (re-verified)
- Questions answered: KQ3 (retained answer + 1 new surface)

## Reflection
- What worked and why: reading the exact fixture lines of `recursive-child-manifest.vitest.ts` (rather than relying on the prior narrative's "lockstep" note) surfaced the legacy `.opencode/specs/` prefix — a concrete new reference surface.
- What did not work and why: nothing failed; the conformance retry is confirmation-dominant by design.
- What I would do differently: the delta file missing in the prior iteration was the root conformance defect — the reducer should validate delta presence immediately after each dispatch, not only at iteration close.

## Recommended Next Focus
No new focus. The migration plan (KQ3) is fully verified; synthesis (iteration 5 evidence + retry confirmations) is the next reducer action.

## SCOPE VIOLATIONS
None. All writes were confined to the three allowed paths: `iterations/iteration-003-retry.md`, `deep-research-state.jsonl` (one append), `deltas/iter-003.jsonl`.
