# Deep Review - Iteration 002 (security)

BINDING: target=main..HEAD (8 T4 commits) on worktrees/096-feature-catalog-anchor-deprecation
BINDING: maxIterations=5
BINDING: convergence=0.10
BINDING: mode=review
BINDING: dimensions=security
BINDING: specFolder=specs/sk-doc/066-feature-catalog-template-anchor-deprecation/008-remediation-deep-review

## Dimension
security. Scope of this pass: the three renamed sk-code-skilled guard assets and their runner (require resolution, path handling, spawn, shell quoting, reads outside the hub), the write/apply paths of every phase scratch script, untrusted or instruction-like content introduced into docs by the range, and the WARN_PACKAGE_IDS narrowing in validate_catalog_package.py for fail-open risk.

## Files Reviewed
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9] - require of ./router-replay-lib.cjs; fixed SKCODE/SKILLS_ROOT/REPO_ROOT constants; no spawn, no writes (grep: child_process/writeFile absent from the three assets).
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:74] and [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:114] - --root is operator-supplied and read-only; relative doc refs are gated by insideHub; symlinked files are skipped because entry.isFile() is false for them.
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:194] - cross-skill contract require is a fixed path inside .skilled/skills and wrapped in try/catch with a null fallback.
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:30] and [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:31] - runner resolves paths from BASH_SOURCE, quotes every expansion, and run_guard forwards with "$@"; set -euo pipefail.
- [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:68] and [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:53] - renamed tests spawn node via spawnSync(process.execPath, [script, ...args]) list-form; fixture writes go to test temp dirs.
- [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/remove_packet_history_lines.py:59] / [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/remove_packet_history_lines.py:115] and [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/normalize_validation_types.py:83] / [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/normalize_validation_types.py:210] - rglob-based selection, --apply-gated writes.
- [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/scratch/add_changelog_version_keys.py:60] - glob-based changelog selection; writes on every invocation, idempotent (already_had short-circuits).
- [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/scratch/remove_template_anchor.py:52] / [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/scratch/remove_template_anchor.py:118] and [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/004-leftover-template-comments/scratch/remove_leftover_template_comments.py:49] / [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/004-leftover-template-comments/scratch/remove_leftover_template_comments.py:90] - tracked-file enumeration and byte-preserving writes.
- [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/sync_leaf_frontmatter.py:213], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/link_phantom_rows.py:265] - validator-report-driven writes, --apply-gated.
- [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/007-sk-code-script-kebab-names/scratch/rename_kebab_scripts.py:104] - fixed rename list, precondition checks, git mv with list argv, no shell.
- [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63] and [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791] - warn-tier set and severity mapping.

## Findings by Severity

### P0 (Blockers)
None.

### P1 (Required)
None.

### P2 (Suggestions)
**R2-P2-001 - Write-capable scratch scripts enumerate the working tree instead of tracked files (latent re-run scope drift)**
- Files: [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/remove_packet_history_lines.py:59], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/normalize_validation_types.py:83], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/scratch/add_changelog_version_keys.py:60]
- Claim: remove_packet_history_lines.py and normalize_validation_types.py select targets with Path.rglob("*.md") over .skilled/skills, and add_changelog_version_keys.py selects with folder.glob(CHANGELOG_GLOB); none of the three refuses symlinked paths or limits itself to tracked files before opening them for write. Under the environment Python (3.9.6, so rglob still recurses through symlinked directories), a re-run after a symlinked directory resolving into a feature-catalog path - or after an untracked .md is added under one - would read and rewrite files the phase audit never covered. The 002 and 004 scripts avoid the class by pinning to git ls-files output ([SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/scratch/remove_template_anchor.py:52], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/004-leftover-template-comments/scratch/remove_leftover_template_comments.py:49]).
- Evidence refs: [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/remove_packet_history_lines.py:59], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/normalize_validation_types.py:83], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/scratch/add_changelog_version_keys.py:60], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/scratch/remove_template_anchor.py:52], [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/004-leftover-template-comments/scratch/remove_leftover_template_comments.py:49]. Population checks: find .skilled/skills -path "*feature-catalog*" -type l -> 0 matches; git status --porcelain -- .skilled/skills -> empty; the only .skilled symlink whose path contains feature-catalog sits under .skilled/changelog/, outside the scripts .skilled/skills root.
- Counterevidence sought: searched the tree for a symlinked directory under .skilled/skills that could resolve into a feature-catalog component (only system-spec-kit/system-deep-loop/system-skill-advisor runtime and node_modules links exist); checked the worktree for untracked files under .skilled/skills (none). No realized impact in the committed range.
- Alternative explanation: rglob/glob may have been chosen deliberately to sweep every catalog doc including untracked ones; a Python 3.13+ interpreter changes rglob symlink recursion to opt-in, which would remove the directory-follow half of the mechanism.
- finalSeverity: P2. Confidence: high on the mechanism and high that it is currently unrealized. downgradeTrigger: none required at the P2 floor; resolve if these scripts are promoted out of scratch/ into reusable tooling without tracked-file enumeration or a symlink guard.
- Recommendation (report-only): if re-run, either enumerate with git ls-files as the 002/004 scripts do, or reject path.is_symlink() targets; the committed artifacts need no change.

## Traceability Checks
- spec_code: PASS for the security-relevant phase-7 claims, independently corroborated: verify-router-sync.cjs requires ./router-replay-lib.cjs at its new name and the file exists ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9]); the runner points at both kebab-case guards ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:30], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:31]).
- checklist_evidence: PASS for phase-7 verification rows re-checked this iteration (runner references, test spawn form); the phase-5 receipt (217 changed / 145 already_had / 0 no_frontmatter) remains consistent with the tracked changelog population audited in iteration 1.
- feature_catalog_code: PASS for the fail-open question: the ccf25fdd56 narrowing of WARN_PACKAGE_IDS moves 19 package ids from warn to fail and the comment promises fresh packages fail closed ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63]); severity mapping is a direct membership test ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791]). No weakening found. The known environment gap (3 expected sk-vision fails) still precludes a full validator rerun.
- skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration - no agent mirrors, cross-runtime agent definitions, or playbook capability docs were read beyond the deep-review persona definition.

## Search Ledger (security)
- SL-001 command_injection: no child_process or write calls in the three shipped assets; runner quotes every expansion and uses "$@"; Python subprocess calls are list-argv with no shell - ruled_out.
- SL-002 path_traversal / reads outside the hub: verify-doc-claims resolves relative refs only when insideHub, --root is operator-chosen and read-only, symlinked files are skipped - ruled_out.
- SL-003 write_confinement: filesystem enumeration in three scratch scripts can reach untracked or symlink-target files on re-run - finding R2-P2-001 (see above).
- SL-004 fail_open: narrowed WARN_PACKAGE_IDS is fail-closed, not fail-open - ruled_out.
- SL-005 untrusted_content: added-line scan for instruction-like text and invisible Unicode across all changed .md files returned no matches; added HTML comments are standard SPECKIT_TEMPLATE_SOURCE / HVR_REFERENCE / ANCHOR scaffolding - ruled_out.

## Confirmed-Clean Surfaces
- The three renamed assets and router-replay-lib.cjs perform no writes and spawn nothing; they read fixed paths under .skilled/skills (or an operator-passed --root) and report only.
- run-all-drift-guards.sh has no eval/source/backtick interpolation and no unquoted variable expansion; failure counting is arithmetic-safe under set -e because run_guard tests with if "$@".
- All scratch subprocess calls (validator runs, git ls-files, git rev-parse, git mv) use list argv; no shell=True anywhere.
- The removed template markers and packet-history lines carried no executable or directive content; the diff added no new HTML comment outside packet scaffolding.

## Ruled Out
- Shell injection in the renames, runner, guards or scratch scripts: no shell-form subprocess and no child_process in shipped assets.
- Reads outside the hub by the guards: relative-ref resolution is hub-gated; the one cross-skill require is a fixed in-repo path inside .skilled/skills.
- Fail-open risk from the validator warn-tier narrowing: reversed - unlisted packages now fail instead of warn.
- Untrusted instruction-like content introduced by the range: absent (two-scan check above).
- Write outside .skilled by the bulk scripts: every write target derives from .skilled-relative enumeration or repo_root-relative validator output; no path escapes the repo working tree.

## Edge Cases
- The renamed test files were inspected for spawn form and name constants only; behavioral parity against pre-rename content was not re-run (repo tooling runs are outside iteration constraints). Iteration 1 established the names and loads; no security-relevant delta is visible in the 4/8/10-line rename hunks.
- The symlink/untracked mechanism in R2-P2-001 is interpreter-sensitive (Python 3.9.6 here; 3.13 defaults recurse_symlinks to false). The finding stands on the environment the scripts ran in.

## SCOPE VIOLATIONS
None. All writes stayed inside the review packet (iteration narrative, delta, strategy) and every other path was read-only.

## Verdict
PASS with one new advisory P2 (hasAdvisories=true). No active P0 or P1; no binary security gate failed. Evidence and scope gates pass; the security dimension is covered end to end. Prior finding R1-P2-001 (system-deep-loop/runtime changelog version keys, correctness) remains active and is untouched by this pass.

## Next Dimension
Traceability (D3), starting from the per-commit claim tables in the 001-007 phase docs.

Review verdict: PASS
