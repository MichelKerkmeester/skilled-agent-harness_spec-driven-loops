# Iteration 002 - Security Review

Mode: review | Dimension: security (D2) | Iteration 2 of 5
Target: the ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde.

## Dimension

Security - injection through the changed tooling, containment of file writes and reads, validation-gate integrity, and integrity of the bulk version-line strip.

Threat model for this change set: local developer and CI tooling, run by repository operators over repository content. The change set adds no network surface and no new subprocess invocation; the security questions are whether an edited path, skill name, manifest entry or doc-authored string can reach a shell, escape the intended root, disclose local file state, or make a changed gate skip what it claims to enforce.

Primary questions: (1) can an edited path or skill name reach a shell through the post-edit router; (2) can a versioning pass write outside the skills root; (3) do the new doc-path checks read, execute or disclose anything outside the repository; (4) do the changed gates skip cases they claim to enforce; (5) did the 2,845-file strip alter anything beyond the version line.

## Files Reviewed

- Router: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs ([SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131], :198, :202, :351, :407)
- Gate wrapper: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh ([SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:12])
- Engine: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs ([SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:196], :203, :225, :278, :306, :376)
- Citation scanner and helper: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs ([SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:765]); .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs ([SOURCE: .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118])
- Catalog validator: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:425], :564, :586)
- Playbook validator: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:387], :399, :401, :884)
- Packager: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py ([SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:124])
- Standard and pins: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md ([SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:65]); the three live activation manifests ([SOURCE: .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1]); the resolver ([SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:118])
- Diff arithmetic target: commit 31888d05bb (the 2,845-file version-line strip)

## Verification Evidence

- Full diff of the seven tooling files read in place: 114 insertions / 68 deletions; every changed hunk traced to its immediate callers and callees. No new subprocess invocation, no new network call, no new write path.
- Strip integrity by git arithmetic: `git show --numstat 31888d05bb` totals 2,845 files, 0 additions, 2,845 deletions; of all removed lines, 0 lack `version:`; `git diff --summary` shows no mode changes and no symlinks in the change set. Every stripped file lost exactly one line, and it was a version line.
- Router spawn sites: [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:351] calls `spawnSync(entry.checkerPath, args, ...)` with an argv array, and [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:407] does the same for the single-checker path; no `shell: true` and no string command lines exist in the file. The skill argument is one path segment passed as a separate argv entry [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:202].
- Wrapper read in full (12 lines): every expansion is quoted and the script execs node directly [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:12].
- Engine write containment: [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:280] refuses any resolved target outside the skills root before writing; discovery only admits real files, so a symlinked SKILL.md is never walked [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:225].
- Playbook backtick check: it probes doc-authored tokens with `fs.existsSync` only, and a resolved token `continue`s past the warning [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:399]; absolute, `~`-rooted, scheme'd, placeholder, glob and runtime-output tokens are skipped [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:379]. A hit is silent, so the output records non-resolution, never the existence of a path outside the listed bases.
- Catalog path classification: candidates outside the repository return missing before any git call [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:425]; link targets outside the repository are never read. Its git invocations are argv lists with a `--` separator, so no cell content reaches a shell. The two-column widening changes which rows are checked, not what checking can do [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:586].
- Overlap advisory: the comparison tokenizes sentence and window into exact Sets [SOURCE: .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118]; no RegExp is constructed from document text, and the new regexes are fixed and linear.
- Version gate semantics: a SKILL.md with no frontmatter is skipped by name (`skip-no-frontmatter`) and reported as a skip, not an ok [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:387]. This is the documented contract of the rewritten standard [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:65], and the change set did not alter it.
- Activation pins: the bump commit updated `effectivePolicyHash` in all live manifests; the runtime resolver compares the routed policy hash against the selected pin when a route is served [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:118].

## Findings by Severity

### P0 - None

### P1 - None

### P2 - None new

Four P2 findings from iteration 1 remain open and advisory: R1-P2-001 (templates asset still lists version as a required field for two child-doc classes), R1-P2-002 (post-edit quality README documents the pre-change dispatch scope), R1-P2-003 (dead child-doc derivation branch in the engine), R1-P2-004 (versioning-standard example cites a superseded version). None is a security regression, and no new finding is raised this iteration.

## Ruled Out This Iteration

- Command injection through the post-edit router: every spawn uses an argv array with no shell, and the only new attacker-influenced input (a directory name) travels as one argv entry.
- Shell-expansion hazards in the gate wrapper: the wrapper is a quoted `exec node` line with no eval, no command substitution on dynamic input, and no unquoted expansion.
- A versioning pass writing outside the skills root: the containment guard is fail-closed for resolved targets, and git-free discovery never admits symlinked files. A symlink passed explicitly through `--paths`/`--from-manifest` could still be written through (lexical, not realpath, containment); that path is pre-existing, requires an operator-supplied manifest, and is not introduced by this change set.
- Reading or executing doc-authored paths in the two validators: both probe existence only, with no read, no execution, and no write; outside-root candidates yield non-existence, and hits are silent, so neither check yields a usable existence oracle.
- Regex injection and catastrophic backtracking from document text: the added and adjacent patterns are fixed and linear, and the overlap decision is exact Set membership.
- Gate bypass by deleting a SKILL.md frontmatter block: the skip is the standard's documented behavior and is reported as a skip rather than a pass; unchanged by this change set.
- The 2,845-file strip altering non-version content: the git arithmetic shows exactly one removed line per file, every removed line a version line, with no additions and no mode or symlink changes.

## Deferred

- Recomputing the updated `effectivePolicyHash` values against the compiled policy snapshot: the activation directory carries only the pin and fence state, and recomputation needs the compiled-routing tooling the review prompt keeps out of scope. The runtime comparison at serve time is verified; recomputation is deferred to the compiled-routing test suite.

## Claim Adjudication

No P0 or P1 findings this iteration, so no claim-adjudication packets are required.

## Traceability Checks

- spec_code: the engine's narrowed scope (SKILL.md only) matches the rewritten standard's document classes and the gate description [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:81]; the router mirror states the same rule [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131].
- checklist_evidence: the security evidence above was reproduced by command output in this iteration (diff read, numstat arithmetic, spawn-site reads); no checklist tick is claimed from iteration 1.
- skill_agent: the router's fail-open contract (never blocks the observed edit, never writes to stdout/stderr) is intact at the changed predicate.
- agent_cross_runtime: the Claude hook and OpenCode plugin share one router; the spawn policy is runtime-neutral argv arrays, unchanged by the scope narrowing.
- feature_catalog_code: the catalog validator's docstring contract for path extraction matches the observed behavior of `_extract_checkable_path` and its call site.
- playbook_capability: the backtick check emits warning-level issues only, so the strict exit-code path is unchanged in meaning; the `process.exitCode` fix preserves the report when piped.

## SCOPE VIOLATIONS

None. Only the iteration narrative, the delta JSONL and the gateway's own ledger writes were made; the reviewed tree stayed read-only.

## Verdict

No P0, no P1, no new P2. Zero new security findings; the four open P2 advisories from iteration 1 carry forward. Per the iteration contract this is PASS with hasAdvisories=true.

## Next Dimension

traceability - focus candidates: the spec.md and changelog claims against the shipped change set; the rewritten standard and templates against the engine's actual scope and anchor rule; the five skill bumps against their changelog anchors; the corrected citations against their claimed targets.

Review verdict: PASS
