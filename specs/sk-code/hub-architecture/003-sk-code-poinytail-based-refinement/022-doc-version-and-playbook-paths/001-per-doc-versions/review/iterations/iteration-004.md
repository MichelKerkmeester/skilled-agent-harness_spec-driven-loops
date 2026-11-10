# Deep Review - Iteration 004 (maintainability)

Dimension this iteration: **maintainability (D4)** - the three copies of the frontmatter-version document scope (the engine's `inScope()`, the packager's `_is_versioned_doc()`, the post-edit router's `isVersionedSkillDoc()`), the template version seeding in `init_skill.py` and the sk-doc README/architecture templates, and whether the accompanying tests test the change rather than mirror it.

Method: read-only. The three implementations, their class constants, their callers and their tests were read end-to-end, and the live tree was searched for paths where the copies resolve differently. No file under review was modified; no build, test or generator was run.

## Dimension

maintainability. The two focus questions:

1. Do the three scope copies agree on every directory class (changelog, scratch, node_modules, .git, dist, tests, fixtures, references, assets, feature-catalog, manual-testing-playbook, runtime, benchmark, behavior-benchmark, templates/examples)?
2. Are the tests testing the change rather than mirroring it?

## Files Reviewed

- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` - scope constants (52-63), `inScope()` (174-185), classification (187-189), explicit-target guard (191-205); no exports, `main()` runs at 587.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` - mirror comment (125-128), constants (129-132), `_is_versioned_doc()` (616-627), `_iter_versioned_docs()` (630-642), version-presence check (699-716), initial version constant (66) and inline literals (492, 588, 613, 733, 781).
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` - constants (45-54), `isVersionedSkillDoc()` (118-132), `.md` gate (175), dispatch row (191-207), export (443).
- `.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` - scope set (275-293), changelog cases (296-321), frontmatter-less skip (324-334).
- `.skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py` - scaffold-and-gate test and template scan.
- `.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` - fixture trees (27-70), discovery (87-95), gate and refusal (118-132).
- `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` - dispatch scope cases (105-212).
- `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` - seeding (66, 198-212, 489-492).
- Live searches: `tests/SKILL.md` / `fixtures/SKILL.md` under `.skilled/skills` and `.opencode/skills` (none exist); `find ... -maxdepth 4 -path '*/changelog/*.md'` (753 entries, no scanned non-4-part version); `rg -l` for consumers of the scope constants and of `isVersionedSkillDoc` (the implementation files only).

## Findings by Severity

### P0

None.

### P1

None this iteration. The prior open P1 R3-P1-001 (the packet's completion record is unwritten) remains active in the registry and is unchanged by this iteration.

### P2

1. [P2] The three scope copies claim to mirror one another and already diverge on two classes; nothing binds them (R4-P2-001, new)

- Case: three hand-written copies implement one policy. The engine's `inScope()` excludes any `changelog` directory [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:53] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:179]; the router's `isVersionedSkillDoc()` does the same [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:51] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:126]; the packager's `_is_versioned_doc()` instead treats a root-level `changelog/` as versioned - `return dirs[0] == 'changelog'` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:618-620] - and skips only nested ones, with its own tests pinning a warning for a missing or 3-part version there [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:296] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:310]. A second divergence is latent: the engine and router test `SKILL.md` before `tests`/`fixtures` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:180] [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:181] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:127] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:128], while the packager folds `name == 'SKILL.md'` into the same branch that returns False for test input [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:621-622], so `<skill>/tests/SKILL.md` is in scope for the gate and the dispatcher and out of scope for the packager.
- Concrete differing paths: `.skilled/skills/sk-doc/changelog/v2.3.7.0.md` - packager: versioned doc, requires a 4-part `version:`; engine + router: out of scope (the router test pins `changelog` as never-fires [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:200]). `.skilled/skills/<skill>/tests/SKILL.md` - engine + router: in scope; packager: out. No such file exists today, so only the changelog divergence is live.
- Class agreement: scratch, node_modules, .git, dist are excluded everywhere; references/assets/feature-catalog/manual-testing-playbook override runtime/benchmark/behavior-benchmark everywhere [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:52-54] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:129-130]; tests/fixtures and `/templates/examples/` are out everywhere [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:181-184] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:621-627] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:128-131]. 14 of the 16 asked-about classes agree; two do not.
- Why nothing stops drift: the engine exports nothing and executes its CLI at import time [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:587], so no consumer can import the policy; repo-wide searches find no consumer of `isVersionedSkillDoc` beyond the router, no consumer of `VERSION_DOC_SUBTREES`/`VERSION_SKIPPED_DIRS` beyond the two implementation files, and no test that runs one path matrix through two copies. The three helpers also have different contracts: the engine self-guards extension and containment [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:175-177], the router's exported helper relies on the caller's `.md` filter and `segments.slice(2, -1)` [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:125] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:175], and the packager's takes `(dirs, name)` with the `.md` filter in the walker [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:641].
- Claim: the "Mirrors frontmatter-version.mjs inScope()" comments [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:125] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:120-122] overstate alignment; two class treatments differ, and no shared source or parity test can catch the next drift.
- Evidence refs: the paths and tests above; the live searches recorded in Files Reviewed.
- Counterevidence sought: a shared constant or import (none); a parity test (none); a current violating entry (none - all scanned changelog entries carry 4-part versions; no tests/fixtures SKILL.md exists).
- Alternative explanation: both divergences are deliberate - the packager validates changelog release versions and delegates SKILL.md to `validate_frontmatter` (comment at 127-128). Under that reading the defect is the inaccurate mirror comments plus the missing parity coverage; the severity and the fix are the same.
- Final severity: P2. Confidence: high (all three functions read line by line; divergences pinned by each side's own tests).
- Downgrade trigger: a single-source scope table or a class-matrix parity test that encodes the two intentional exceptions, or corrected comments naming them.
- Recommendation: derive all three scope checks from one shared table (export the engine policy, or generate the copies), or add one parity test walking the class matrix (root changelog, nested changelog, tests/fixtures including SKILL.md, runtime plus doc-subtree precedence, templates/examples) through all three implementations; correct the mirror comments to name the exceptions.

## Traceability Checks

- scope_mirror_parity (maintainability): FAIL - root-level changelog (packager in; engine + router out) and `SKILL.md` under `tests`/`fixtures` (engine + router in; packager out). Recorded as R4-P2-001.
- tests_not_mirrors: PASS - every suite exercises behavior, not the implementation's shape:
  - `test-frontmatter-version.mjs` builds fixture skill trees and runs the engine CLI (`compute`, `verify`, `gate`), asserting discovery, derived versions, exit codes and out-of-scope refusal [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:62] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:91] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:123].
  - `test_package_skill_regressions.py` runs the packager over fixture trees and asserts the exact flagged set for in-scope vs out-of-scope classes [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:280] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:285] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:291].
  - `sk-code-post-edit-quality.test.cjs` drives `resolveDispatch` with path lists and asserts dispatch/no-dispatch per class [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:185] [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:206].
  - `test_template_version_seed.py` scaffolds a skill and a hub with `init_skill.py` into a temp tree, runs the engine gate over the result, and only then scans each template's first fenced block [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24]. No test re-asserts a constant or restates implementation structure.
- Carried from iteration 3 (not re-run): `spec_code` partial (REQ-005 FAIL, R3-P1-001); `checklist_evidence` FAIL as recorded (R3-P1-001); `skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` partial; `playbook_capability` partial.
- Seeding observation (ruled out, kept visible): `INITIAL_SKILL_VERSION` at `init_skill.py:66` is bypassed by inline `'version: 1.0.0.0'` literals at 492, 588, 613, 733, 781. The scaffold-and-gate test fails loudly if a covered file drifts, so this stays an observation rather than a finding; residual risk is limited to paths the engine skips.

## Verdict

This iteration: no P0, no P1, one new P2 (R4-P2-001). The three scope copies agree on 14 of the 16 asked-about classes and diverge on exactly two; the tests test behavior rather than mirroring, but no test binds the copies to one another. The prior open P1 R3-P1-001 is unchanged and remains the run's carrying condition; synthesis recomputes the release verdict from the registry.

## Next Dimension

None - all four dimensions now have coverage; iteration 5 is the convergence/synthesis pass.

Review verdict: PASS
