---
title: "Deep Review Iteration 011 — system-spec-kit ↔ system-deep-loop contract surface"
trigger_phrases: []
---

# Iteration 11: Correctness — cross-skill contract surface

## Focus

Dimension: **correctness** (cross-skill). Slice: the shared contracts between `system-spec-kit`
and `system-deep-loop` — `shared/review-research-paths.cjs` (artifact root, containment, packet
resolution), the deep-review contract-parity suite's pinned assertions replicated read-only, and
the deep-review runtime-capability matrix (`runtime-capabilities.cjs`) executed against the
mirror files it names.

## Files Reviewed

- `.skilled/skills/system-spec-kit/shared/review-research-paths.cjs` (resolution and containment paths, lines 30-180, 326-446)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts` (assertion inventory; replicated)
- `.skilled/skills/system-deep-loop/deep-review/scripts/runtime-capabilities.cjs` (executed)
- `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml`
- `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`
- Executed: `resolveArtifactRoot()` for this packet; capability matrix load and resolve; 43 replicated parity assertions

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

None new. Carried: F003-F007 remain active (unchanged this iteration).

## Claim Adjudication

No new findings. The parity suite was replicated rather than run: vitest would write caches and
temp fixtures outside the lineage, so its assertions were re-executed as plain string checks
against the same file lists — same inputs, same predicates, no runner.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | carried partial (iteration 8) | Unchanged this iteration. |
| `checklist_evidence` | carried partial (iteration 8) | Unchanged this iteration. |
| `skill_agent` | carried surface pass (iteration 9) | Unchanged. |

## Ruled Out

- "A child-phase artifact root can be mis-resolved or escape its packet": ruled out by execution — `resolveArtifactRoot('specs/system-speckit/033-system-speckit-v4/068-…', 'review')` returns the flat `…/068-…/review` with `subfolder: null`, matching the observed layout; the resolver normalizes the stored config value before comparison (`review-research-paths.cjs:106-136, 150-164`) and guards shell metacharacters plus approved-root containment before any path is returned (`:332-360`).
- "The release's own deep-review contract-parity assertions fail on this tree": ruled out by replication — 43 of 43 checks pass: deferred lifecycle branches present and `on_fork` absent in both YAMLs, the lazy guarded archive move present and no eager archive mkdir, canonical `agent_file` in both, all four dimensions tracked in the findings-registry seeds, the `step_graph_upsert` blocks identical between auto and confirm with `graphEvents` optional, and the generated contract using `{artifact_dir}` paths only.
- "The runtime-capability matrix names mirrors that no longer exist": ruled out by execution — `listRuntimeCapabilityIds()` returns `['opencode','claude','codex']`, all three mirror paths exist (`.skilled/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`), and `resolveRuntimeCapability()` succeeds for each.

## Dead Ends

- Running the parity suite itself (vitest): not attempted — runner caches and fixtures write outside the lineage; the replication above covers the assertions the suite makes about these files.

## Assessment

- New findings ratio: 0.0 (no new findings; weighted new = weighted total = 0)
- Dimensions addressed: correctness (cross-skill slice)
- Novelty justification: this slice re-executed the release's own cross-skill assertions and the capability matrix rather than reading them, and verified the shared resolver's output for this packet. All three checks pass; the negative results are recorded with their commands so the synthesis can cite them.

## Next Focus

Dimension: traceability (overlay). Focus area: `feature_catalog_code` and `playbook_capability` in this lineage's areas — pick catalog entries and playbook scenarios for changed runtime files and check their claims against the implementations they name. Required evidence: one row per claim with file:line. Rotations status: traceability pass 2 of 2.

Review verdict: CONDITIONAL
