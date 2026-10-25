# Deep Review Iteration 4

## Dispatcher

- Target: specs/sk-code/013-private-surface-skills (spec-folder)
- Mode: review
- Executor: cli-codex, gpt-6-luna
- Dimension: maintainability
- steer.md was checked and absent. State, registry, configuration, and strategy were read before this pass.

## Dimension

Maintainability: compared the declared scanner inventory with active generator and CI root enumeration, and checked whether duplicated containment helpers drift.

## Files Reviewed

- specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md — scanner inventory, lines 164–185.
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs — independent root scan, lines 44–54.
- .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs — reusable root list and private-name exclusion, lines 213–217.
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs — explicit local-* exclusion, lines 143–147.
- .github/workflows/routing-registry-drift.yml — freshness gate invocation, line 202.
- .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts and .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py — parallel containment helpers.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Packet completion status contradicts active phase records** — specs/sk-code/013-private-surface-skills/spec.md:50 — Carried from iteration 1 and confirmed against phase 2 AC-014 in iteration 3. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:70]
   Finding ID: LUNA-R1-P1-001
   Finding class: phase_status_drift
   Scope proof: The conflicting completion records are in the target parent and child documents.
   Affected surface hints: packet-status, phase-transition, completion-gate
   Case: The root says Complete while phase 2's closure criterion is Unmet.

### P2 Findings

1. **Staged type-change paths bypass the local-skill guard** — .skilled/scripts/git-hooks/pre-commit:111 — Carried from iteration 2. [SOURCE: .skilled/scripts/git-hooks/pre-commit:111]
   Finding ID: LUNA-R2-P2-001
   Finding class: commit_guard_diff_filter_gap
   Scope proof: The hook and its guard contract are in the declared scope.
   Affected surface hints: pre-commit-guard, private-skill-path, publication-boundary
   Case: A previously tracked local-* path changes file type and private content is staged at the same name.

2. **The scanner inventory omits the derived-freshness root scan** — specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164 — The spec claims sixteen top-level skill-root scans and lists the regenerator, but the CI derived-freshness gate separately enumerates the same SKILLS_DIR and is invoked by the routing-registry-drift workflow. The gate filters only real directories and does not exclude local-* by name, unlike the reusable regenerator root list. The current symlink layout skips it only because Dirent.isDirectory returns false for a symlink. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:181] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:51] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:52] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:215] [SOURCE: .github/workflows/routing-registry-drift.yml:202]
   Finding ID: LUNA-R4-P2-001
   Finding class: scanner_inventory_omission
   Scope proof: The missing inventory entry and the gate are both within the declared review scope.
   Affected surface hints: scanner-inventory, local-skill-exclusion, derived-freshness-gate
   Case: A private local-* skill is materialized as a real directory; the CI freshness gate scans it while the documented regenerator excludes it, and the inventory does not tell maintainers this gate is a separate path.

## Traceability Checks

- spec_code: fail — the phase 3 inventory omits a workflow-invoked skill-root gate.
- checklist_evidence: fail — the phase 2 Unmet closure criterion remains open against parent completion claims.
- skill_agent and agent_cross_runtime: partial — TypeScript and Python containment helpers are similar, but generators maintain separate root enumerators.
- feature_catalog_code and playbook_capability: pending for stabilization.

## Integration Evidence

The routing-registry-drift workflow runs ci-skill-derived-freshness.cjs. That script builds its own root list instead of calling regenerate-skill-derived.cjs listSkillRoots, which explicitly excludes local-* names. [SOURCE: .github/workflows/routing-registry-drift.yml:202] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:51] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:213] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:215]

## Edge Cases

- Under the selected symlink layout, Dirent.isDirectory skips the local-* links in this CI gate; the behavioral divergence appears for a local-* real directory.
- The separate TypeScript and Python helpers remain necessary language-specific implementations, and their path-boundary calculations align.

## Confirmed-Clean Surfaces

- ci-skill-root-metadata.cjs and regenerate-skill-derived.cjs explicitly exclude local-* before examining skill contents.
- The shared TypeScript helper and Python mirror reject parent traversal using canonical relative paths.

## Ruled Out

- Static path-prefix escape caused by differing TypeScript and Python relative-path rules was not found.

## Next Dimension

Stabilization review across all dimensions, with attention to remaining producer/consumer paths and active finding persistence.

## Next Focus

- Dimension: maintainability
- Focus area: recheck active findings against the wider retrieval and routing consumers, and verify each has a precise source reference and consistent status.
- Reason: four dimensions have been covered; the fifth pass is required by the max-iterations policy and should broaden the cross-surface angle.
- Rotation status: stabilization
- Blocked/productive carry-forward: scanner inventory comparison found an omitted live gate; graph traversal remains unavailable under lineage scope.
- Required evidence: remaining high-risk readers and the final active finding registry.

## SCOPE VIOLATIONS

- The YAML graph seed and per-iteration graph upsert target packet-root graph metadata outside the bound lineage path. Those writes remain skipped; this pass used graphless search coverage.
- The prior out-of-scope continuity write is recorded in iteration 1; no new outside-lineage write was made in this pass.

## Verdict

The carried P1 remains confirmed and two P2 findings remain active. No P0 was found.

Review verdict: CONDITIONAL
