# Iteration 001 - Correctness Review

Mode: review | Dimension: correctness (D1) | Iteration 1 of 5
Target: the ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde.

## Dimension

Correctness - logic errors, wrong return values, broken invariants, and whether the change set's own claims hold in the tree. Primary questions: (1) does anything still gate child docs for a version after the fleet strip; (2) are the two validator extensions correct on the tables and spans they now read; (3) do the new citation bases and the overlap advisory flag what they claim; (4) does the piped-report fix preserve exit codes; (5) do the rewritten standard and templates agree with the engine.

## Files Reviewed

- Engine and gate: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs; .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh
- Consumers: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs; .skilled/hooks/post-edit-quality/README.md; .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py
- Validators: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py; .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs
- Scanner: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs; .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs
- Standard and templates: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md; .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md; .skilled/skills/sk-doc/changelog/v2.3.5.0.md
- Tests: test-frontmatter-version.mjs; test_package_skill_regressions.py; sk-code-post-edit-quality.test.cjs; test-root-name-consumer-matrix.cjs (diff); validate-playbook-package.test.cjs; test_validate_catalog_package.py; test-cite-drift-scan.mjs
- Corrected docs and strip sample: the four playbook/catalog files named in the review scope, plus sampled stripped child docs.

## Verification Evidence

- frontmatter-version.mjs verify -> exit 0: '[verify] 57 files | ok=57' (authoritative fleet check, includes the five bumped skills)
- frontmatter-version.mjs gate -> exit 0: '[gate] 57 files | ok=57'
- test-frontmatter-version.mjs -> exit 0, 'PASS - 15 passed, 0 failed'
- validate-playbook-package.test.cjs -> exit 0: fixture suite PASS; clean PASS; contract regressions PASS (8); prompt sync PASS (8); piped report regression PASS (2)
- test_validate_catalog_package.py -> exit 0, ALL PASS (includes the two-column dead-path case)
- test-cite-drift-scan.mjs -> exit 0, 67 pass / 0 fail (includes the --overlap advisory case)
- test_package_skill_regressions.py -> exit 0
- sk-code-post-edit-quality.test.cjs -> exit 0, 43 pass / 0 fail
- Spot checks of c9e5af45f2 corrections: create.sh lines 1060 and 1636 carry PROVIDE-DESCRIPTIVE-SLUG; .skilled/commands/design/diagram.md and .skilled/commands/speckit/save.md exist; research.md:157, deep-research/SKILL.md:411-413, advisor-status.ts:342-345 and advisor-tool-schemas.ts:268 match their corrected claims.
- 225 of 225 changelog entries still carry a version; a stripped child doc sample lost only the version line.

## Findings by Severity

### P0 - None

### P1 - None

### P2 - 4

**R1-P2-001 - Templates asset still lists version as a Required Field for two child-doc classes**

- Claim: [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:480] declares 'Required Fields: title, description, trigger_phrases, version' for the Skill README template while the same section states it carries no version; [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:514] declares the same four fields for the Feature Catalog template while its leaf example carries none and [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:134] states version lives on SKILL.md only.
- Counterevidence sought: a validator might still require catalog or README versions. Searched the catalog validator for 'version' - no matches; package_skill.py versions changelog entries only [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:127]; the engine's scope is SKILL.md only [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:203].
- Alternative explanation: the lines might cover root-index or legacy shapes. Rejected: neither catalog shape includes version (they differ by last_updated only) and the README prose explicitly disclaims it.
- Impact: authors following the template would re-add the version line the change set just stripped from 2,845 child docs; the changelog claim at [SOURCE: .skilled/skills/sk-doc/changelog/v2.3.5.0.md:26] ('keeps version on the SKILL.md template only') is falsified by these lines.
- Final severity: P2. Confidence: high. Downgrade trigger: already P2; would rise if any validator starts reading version from these lines.

**R1-P2-002 - Post-edit quality README still documents the pre-change dispatch scope**

- Claim: [SOURCE: .skilled/hooks/post-edit-quality/README.md:50] says the frontmatter-versions checker fires for 'SKILL.md, README.md adjacent to a SKILL.md, or any file under references/assets/feature-catalog/manual-testing-playbook', while the router now fires only for SKILL.md [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131] and the updated test asserts child docs dispatch nothing [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:181].
- Counterevidence sought: the README might have been updated elsewhere in the ten commits - 'git diff 0039903bde..HEAD --stat' for the README is empty.
- Impact: operators and reviewers are misled about what the post-edit hook checks; the behavior is stricter than documented.
- Final severity: P2. Confidence: high.

**R1-P2-003 - Dead child-doc derivation branch and unreachable git-walk machinery remain in the engine**

- Claim: computeForFile [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:249] keeps a non-SKILL.md path that calls realEditCount [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:68], but the branch is unreachable: inScope admits SKILL.md only [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:203] and assertExplicitTargets refuses explicit non-SKILL.md targets [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:219].
- Counterevidence sought: --from-manifest could carry rows produced before the change. assertExplicitTargets runs over from-manifest rows too, so such manifests are refused rather than processed.
- Impact: roughly 35 lines of dead git-walking code imply child docs remain derivable; a future edit could wrongly rely on it.
- Final severity: P2. Confidence: high.

**R1-P2-004 - Versioning standard example cites a superseded system-spec-kit version the same change set bumped**

- Claim: the standard's worked example [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:95] shows system-spec-kit frontmatter '2.7.10.0' with highest changelog 'v2.7.10.0.md', while the same change set bumped the skill to 2.7.11.0 [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:5]; the newest changelog entry is v2.7.11.0.md.
- Counterevidence sought: the table might illustrate a historical moment - its column header is 'Frontmatter', reading as current state, and the file calls itself the single source of truth.
- Impact: a reader comparing the example with the tree sees a contradiction shipped by one PR; minor documentation trust cost.
- Final severity: P2. Confidence: high.

## Ruled Out This Iteration

- Child docs still gated after the strip: the wrapper execs the engine; gate and verify exit 0 over all 57 SKILL.md files.
- Two-column catalog tables unguarded: covered by a negative regression test; min_cells=2 applies only to the path-existence check.
- Piped playbook report truncated: process.exitCode plus a dedicated piped-report regression test, green.
- New runtime//scripts/ citation bases changing prior resolutions: bases are appended after the existing skill-root candidate; 67 scanner tests green.
- Overlap advisory false positives on path-only sentences: identifierTokens drops target-path components and returns no tokens when none remain.
- The c9e5af45f2 corrections being themselves wrong: spot checks all resolve to the claimed content.

## Traceability Checks

- spec_code: engine scope and anchor rule match the rewritten standard; verify/gate green over the full SKILL.md population.
- checklist_evidence: the change set's verification claims reproduced by command output in this iteration.
- skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability: see traceabilityChecks in the iteration record; template and README gaps recorded as R1-P2-001/002.

## SCOPE VIOLATIONS

None. Only the iteration narrative, the delta JSONL and the gateway's own ledger writes were made; the reviewed tree stayed read-only.

## Verdict

Four P2 findings, no P0 or P1. Per the iteration contract this is PASS with hasAdvisories=true.

## Next Dimension

security - focus candidates: the playbook backtick scanner's filesystem probing with path.resolve over untrusted tokens; the catalog validator's gitignore-driven path checks; the engine's --from-manifest JSON read path; and the citation scanner's subprocess and environment handling (jev stub, credential gating).

Review verdict: PASS
