# Deep Review Report: Doc and Catalog Truth

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is CONDITIONAL, so advisories are not flagged separately)
- **Active findings:** P0 0, P1 1, P2 8
- **Scope:** the ten commits on `worktrees/114-rem-doc-catalog-truth` since `0039903bde`: the frontmatter-version engine, packager and post-edit router narrowed to `SKILL.md`; the `version:` line removed from 2,845 child docs; the versioning standard and template asset rewritten; the catalog, citation and playbook checks widened; the PC-R7 doc corrections; and the five skill bumps. 22 files were in the declared scope.
- **Run:** five iterations, executor cli-pi with `deepseek-v4.1-flash` at max reasoning effort, stop policy max-iterations, so convergence was telemetry only. All four dimensions were covered. Every iteration passed `verify-iteration.cjs` on the first dispatch.
- **Stop reason:** maxIterationsReached.

## 2. Planning Trigger

`/speckit:plan` is not required. The one P1 is about how the phase's bump rule is read, not about code, and the eight P2s are small fixes inside the phase's own scope. The builder fixes them in this phase.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": ["R3-P1-001", "R1-P2-001", "R1-P2-002", "R1-P2-003", "R1-P2-004", "R3-P2-001", "R4-P2-001", "R4-P2-002", "R5-P2-001"],
    "remediationWorkstreams": ["WS1 bump-rule reading", "WS2 doc contract drift", "WS3 dead code after the narrowing", "WS4 completion evidence"],
    "specSeed": ["Record the bump-rule reading in the goal log"],
    "planSeed": ["Fix the template, README and standard lines", "Remove the dead engine and router code", "Write the ledger and Tests table"],
    "findingClasses": ["spec_mismatch", "doc_contract_drift", "dead_code_after_narrowing", "duplicated_policy_surface", "missing_completion_evidence"],
    "affectedSurfacesSeed": [
      ".skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs",
      ".skilled/hooks/post-edit-quality/lib/post-edit-router.cjs",
      ".skilled/hooks/post-edit-quality/README.md",
      ".skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md",
      ".skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md",
      "specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md",
      "specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/implementation-summary.md"
    ],
    "fixCompletenessRequired": true
  }
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Fix recommendation |
|----|-----|-------|-----------|-----------|--------------------|
| R3-P1-001 | P1 | Goal D5 bump gate fails: 9 of the 14 touched skills have no bump or changelog entry | traceability | `goal.md:48`, `goal.md:61` | Bump the nine skills, or record an amendment of D5 and criterion 4 with the deviation in the goal log |
| R1-P2-001 | P2 | The template asset lists `version` as a required field for the Skill README and Feature Catalog templates | correctness | `frontmatter-templates.md:480`, `:514` | Drop `version` from both Required Fields lines |
| R1-P2-002 | P2 | The post-edit quality README still describes the old dispatch scope | correctness | `.skilled/hooks/post-edit-quality/README.md:50` | Say the checker fires for `SKILL.md` only |
| R1-P2-003 | P2 | A dead child-doc derivation branch and its git walk remain in the engine | correctness | `frontmatter-version.mjs:68`, `:249` | Remove the branch, `realEditCount` and `W_CAP` |
| R1-P2-004 | P2 | The standard's worked example cites system-spec-kit 2.7.10.0, which this change set bumped to 2.7.11.0 | correctness | `frontmatter-versioning.md:95` | Update the example |
| R3-P2-001 | P2 | The completion ledger is still the template scaffold | traceability | `implementation-summary.md` | Write the 17 ledger rows and the Tests table |
| R4-P2-001 | P2 | The router's catalog and playbook scope mapper has no production caller | maintainability | `post-edit-router.cjs:48`, `:120` | Delete the mapper, its constants and exports, and its test checks |
| R4-P2-002 | P2 | The `SKILL.md` predicate is spelled five ways, with unused `skillsRoot` parameters and an unread `openIdx` field | maintainability | `frontmatter-version.mjs:143`, `:196`, `:203`, `:219`, `:257` | Use one predicate, drop the unused parameters and field |
| R5-P2-001 | P2 | The standard says every other document MUST NOT carry `version`, but 47 child docs outside the engine's old scope still do | maintainability | `frontmatter-versioning.md:30` | Strip them, or narrow the sentence and name the excluded classes |

Each finding's claim, evidence, counterevidence, alternative explanation and downgrade trigger is in `iterations/iteration-NNN.md`. Reproduction commands, run by the review orchestrator after the loop:

- R3-P1-001: the goal's criterion 4 loop prints nine skills: cli-classifier, cli-external-orchestration, cli-orca, mcp-code-mode, mcp-tooling, sk-code, sk-git, sk-prompt and sk-vision.
- R1-P2-001: `grep -n "Required Fields" frontmatter-templates.md` shows `version` at lines 480 and 514.
- R1-P2-002: line 50 of the README names `README.md`, `references`, `assets`, `feature-catalog` and `manual-testing-playbook`.
- R1-P2-003 and R4-P2-002: `realEditCount`, `W_CAP` and `openIdx` occur only inside `frontmatter-version.mjs`, and `computeForFile` still branches on `base === 'SKILL.md'`.
- R1-P2-004: line 95 of the standard reads `2.7.10.0`.
- R4-P2-001: `canonicalSkillScopeSubtree` is referenced only by the router's own exports and by `test-root-name-consumer-matrix.cjs`.
- R5-P2-001: a census of tracked `.md` files under `.skilled/skills` that carry a frontmatter `version:`, excluding `SKILL.md` and changelog entries, prints 61 files. 7 are `ROUTER.md`, 7 are under `.state/`, and the rest are benchmark reports, component READMEs, examples, hooks docs and one test fixture.
- R3-P2-001: the goal's criterion 1 prints 0.

## 4. Remediation Workstreams

1. **WS1, P1, bump-rule reading (R3-P1-001).** The orchestrator ruled that the fleet-wide line removal is housekeeping the sk-doc contract owns. sk-doc is bumped and its changelog explains the removal, and skills touched only by the removal are not bumped. The builder records this in the goal log. Under the finding's own downgrade trigger, the operator still has to approve the amendment.
2. **WS2, P2, doc contract drift (R1-P2-001, R1-P2-002, R1-P2-004, R5-P2-001).** Plain doc edits to the template asset, the post-edit README and the standard.
3. **WS3, P2, dead code after the narrowing (R1-P2-003, R4-P2-001, R4-P2-002).** Remove the unreachable engine branch and router mapper, and keep one `SKILL.md` predicate.
4. **WS4, P2, completion evidence (R3-P2-001).** Write the ledger and the Tests table at close.

## 5. Spec Seed

- Record the bump-rule reading and its criterion 4 consequence in the goal log's deviations table.
- Note that the standard's out-of-scope sentence governs the doc classes the engine used to version.

## 6. Plan Seed

- Remove `version` from the README and Feature Catalog Required Fields lines in `frontmatter-templates.md`.
- Update the frontmatter-versions row in the post-edit quality README.
- Update the standard's worked example to 2.7.11.0, and narrow its out-of-scope sentence.
- Delete `realEditCount`, `W_CAP`, the derivation branch and the `openIdx` field. Use one `SKILL.md` predicate and drop the unused parameters.
- Delete the router's scope mapper, its constants and exports, and the matrix test's checks of it.
- Fill `implementation-summary.md`.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-001 holds (`verify` exits 0). REQ-005 conflicts with the bump reading (R3-P1-001). REQ-002 to REQ-004 were unrecorded at review time (R3-P2-001) |
| `checklist_evidence` | partial | Goal criterion 5 passes. Criteria 1, 3 and 4 failed at review time. Criterion 6 is run at close |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | On all 14 skills, the `SKILL.md` version equals the newest changelog entry |
| `agent_cross_runtime` | pass | The `.hermes` mirror matches, and no other runtime mirror describes the old scope |
| `feature_catalog_code` | pass | The corrected anchors resolve: `mutex.ts:22`, `advisor-tool-schemas.ts:268`, `advisor-status.ts:342-345`, `skill-advisor-cli.ts:1495-1515` |
| `playbook_capability` | pass | The corrected citation ranges resolve |

`AC_COVERAGE`: exempt (a Level 1 packet).

Resource Map Coverage: `resource-map.md` is not present in the packet, so this gate is skipped. The reducer emitted `review/resource-map.md` from the iteration deltas.

## 8. Deferred Items

- SL-210 (iteration 2, security): recomputing the compiled-routing activation manifest hashes needs the compiled-routing tooling. The review compared the runtime values instead, and the pre-commit `gate:route-remint` hook re-minted the manifests on the bump commit.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none recorded. Remaining frontier: none recorded.

## 9. Search Ledger

- Required bug classes: spec_mismatch, missing_completion_evidence, doc_contract_drift, version_anchor_drift, bulk_mutation_integrity, incomplete_refactor.
- Covered: spec_mismatch, missing_completion_evidence, doc_contract_drift. Ruled out: version_anchor_drift, bulk_mutation_integrity, incomplete_refactor.
- 28 ruled-out candidates carry clean-search proof in `deep-review-findings-registry.json`.
- hasSearchDebt: true. The one debt row is SL-210 under Deferred Items. The verdict is CONDITIONAL in any case, because of the P1.
- Graph coverage mode: graphless_fallback.

## 10. Audit Appendix

### Convergence

| Iteration | Dimension | New findings | newFindingsRatio |
|-----------|-----------|--------------|------------------|
| 1 | correctness | P2 4 | 1.0 |
| 2 | security | none | 0.0 |
| 3 | traceability | P1 1, P2 1 | 0.33 |
| 4 | maintainability | P2 2 | 0.25 |
| 5 | correctness, second pass | P2 1 (P1 re-confirmed) | 0.11 |

### Coverage

Dimensions covered: correctness, security, traceability and maintainability (4 of 4). The 22 scope files are listed in `deep-review-config.json`.

### Ruled-out claims

Security found no injection, path traversal or secret exposure in the new path-resolving code. The backticked-path check only reads files. The version-line strip was confirmed as one-line-per-file and byte-preserving. The re-anchored sk-code citations resolve. See each iteration's Ruled Out section.

### Sources reviewed

The 22 scope files, the ten commits' diffs, the goal and spec of this packet, and the two research documents named in `deep-review-strategy.md`.
