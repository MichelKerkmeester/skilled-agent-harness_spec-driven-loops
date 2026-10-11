# Iteration 004 - Maintainability Review

Mode: review | Dimension: maintainability (D4) | Iteration 4 of 5
Target: the ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde (0039903bde..d867ba976b).

## Dimension

Maintainability: whether the ten commits leave the versioned-doc rule and its guards in a shape a future maintainer can change once. Single-sourced policy, no dead surface left by the narrowing, no duplicated predicates, and tests that pin behavior rather than vestigial helpers.

Core protocols: `spec_code`, `checklist_evidence`. Overlays: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

## Files Reviewed

- Engine and gate: `frontmatter-version.mjs` (full, 455 lines), `check-frontmatter-versions.sh` (full)
- Router: `post-edit-router.cjs` (full, 455 lines)
- Validators and scanner: `validate_catalog_package.py` (changed hunks 286-310 and 564-624), `validate-playbook-package.cjs` (changed hunks 368-408 and 879-884), `cite-drift-scan.mjs` (changed hunks 356-394, 735-766, 1341, 1392-1400), `package_skill.py` (changed hunk 121-129, plus `validate_resource_frontmatter` 627-690)
- Tests: `test-frontmatter-version.mjs` (full), `test_package_skill_regressions.py` (version-class cases 255-345), `test-root-name-consumer-matrix.cjs` (full), `test_validate_catalog_package.py` (two-column case 179-191), `validate-playbook-package.test.cjs` (outline, piped regression), `test-cite-drift-scan.mjs` (outline: overlap and runtime/scripts cases)
- Docs: `frontmatter-versioning.md` (full), `sk-doc/changelog/v2.3.5.0.md` (full), packet `spec.md` (full)
- Censuses: usage scan for the router scope surface across `.skilled`, `.opencode` and the runtime mirrors; `openIdx` reader scan; comment-hygiene scan of the six changed scripts; changelog version-line census over the tree

## Verification Evidence

- Router scope surface has no production caller: `rg -n 'canonicalSkillScopeSubtree|SKILL_SCOPE_SUBTREES' .skilled .opencode` returns the router's own definition and export lines plus `test-root-name-consumer-matrix.cjs:73-81`; the same scan over `.hermes .claude .codex .cursor .pi` returns nothing; `resolveDispatch()` [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:152] never calls it.
- Engine residue: `classify()` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:196] and `inScope()` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:203] are the same one-line basename check, each keeps an unused `skillsRoot` parameter, `assertExplicitTargets()` evaluates both in one condition [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:219], `computeForFile()` re-derives the predicate inline [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:254], and `openIdx` is returned [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:143] and read nowhere.
- Two-column catalog support is implemented and tested: the walker yields '' for a missing third cell [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:310], the path check passes `min_cells=2` [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:591], and a negative regression covers the dead path in a two-column table.
- Comment hygiene scan of the six changed scripts for `ADR-`/`REQ-`/`CHK-`/`specs/` patterns returns nothing (only bare basenames inside `SPEC_DOC_BASENAMES`).
- Versioned-doc membership split is documented, not accidental: the standard carves out changelog entries and names the packager as their checker [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:32], and DV-R7 records the split as a deliberate build-nothing [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:134]. The tree agrees: 21 files under `sk-doc/changelog/` carry `version:` lines, the five new changelog entries are pure additions, and the strip commit `31888d05bb` touched no changelog file.
- `package_skill.py` narrows `VERSIONED_DOC_SUBTREES` to `changelog` and the regression tests pin both directions: a child doc without a version passes strict, a changelog entry with a non-4-part version is flagged.

## Findings by Severity

### P0 - None

### P1 - None

### P2 - 2 new, 5 carried

**R4-P2-001 - The router keeps a catalog/playbook scope mapper and table with no production caller after the SKILL.md-only narrowing**

- Claim: commit `c071e01662` narrowed `isVersionedSkillDoc()` to `basename === 'SKILL.md'`, which removed the last production caller of `canonicalSkillScopeSubtree()`. The function, `CANONICAL_SKILL_SCOPE_SUBTREES` and `SKILL_SCOPE_SUBTREES` remain in the module [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:48], [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:120], and the only surviving reference is the consumer-matrix test, which still asserts the mapping [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:73]. The narrowed function keeps two parameters (`absFilePath`, `segments`) that its body no longer reads [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131].
- Evidence refs: the usage census above; [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:429], [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:443], [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:198].
- Counterevidence sought: a consumer in another runtime mirror (none); a production path through `resolveDispatch` (none); a wiring in the engine's explicit-target guard (it uses its own inline normalized `startsWith` check, not this mapper).
- Alternative explanation: the mapper is a deliberate hook for the in-flight `feature_catalog`/`feature-catalog` naming migration. Plausible, and the test's own comment shows the file was curated to keep only live consumers; but then the hook needs a named owner or a wiring point, because nothing reads it today.
- Impact: a maintainer who adds a subtree to the Map expects dispatch to honor it, yet no code path consults the Map; the test suite pins a mapping no production path exercises, so it can pass while the real predicate drifts.
- Finding class: dead policy surface. Final severity: P2. Confidence: high.
- Downgrade trigger: a production call site appears (the migration wires the mapper back in), or the surface and its test checks are deleted.
- Recommendation: delete `canonicalSkillScopeSubtree`, both constants, the two unused exports and the two test checks, or annotate them as reserved for the naming migration with the owning phase named.

**R4-P2-002 - The narrowing left the SKILL.md predicate spelled five ways in the engine, with vestigial parameters and an unread openIdx field**

- Claim: after the narrowing the rule `basename === 'SKILL.md'` is expressed in `classify()` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:197], in `inScope()` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:204], twice in the single condition at `assertExplicitTargets()` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:219], and once more inline in `computeForFile()` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:257]. Both helpers keep a now-unused `skillsRoot` parameter, and `parseFrontmatter()` returns an `openIdx` field no caller reads [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:143], which the no-frontmatter return does not even carry [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:133].
- Evidence refs: the `openIdx` reader census above; the six spot reads listed in Verification Evidence.
- Counterevidence sought: an external consumer destructuring `openIdx` (none); an exemption for these call sites in the strategy's non-goals (the non-goal covers option parsing only, and the known-context note explains the dead W branch, not these signatures).
- Alternative explanation: minimal-diff discipline to keep the change line-disjoint with the sibling phase's parser edit, as the spec's risk table requires [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md:170]. Plausible as sequencing, and it argues for recording the redundancy as accepted rather than leaving it unremarked.
- Impact: the next scope change must find five spellings in a 455-line file, and the tandem condition at line 219 is where one helper can be changed without the other. A parser-phase rewrite that renames or moves the helpers can silently leave an inline predicate behind.
- Finding class: duplicated rule, dead parameters. Final severity: P2. Confidence: high on the mechanics, medium on impact.
- Downgrade trigger: the sibling engine phase collapses the predicate or a comment records the acceptance; either resolves it with no separate action.
- Recommendation: when the sibling phase lands, collapse the predicate to one helper used by both call sites, drop the unused parameters, and remove the `openIdx` field or give it a reader.

Carried open from prior iterations (unchanged by this dimension's review, not re-adjudicated here): R3-P1-001 (goal D5 bump gate), R1-P2-001 (templates list `version` in the README and Feature Catalog rows), R1-P2-002 (post-edit README describes the pre-change dispatch scope), R1-P2-003 (dead child-doc derivation branch and git-walk machinery in the engine), R1-P2-004 (standard example cites 2.7.10.0), R3-P2-001 (completion ledger still scaffold).

## Ruled Out This Iteration

- Comment hygiene in the changed scripts: no artifact ids or spec paths appear in the six changed scripts' comments.
- Two-column catalog path checking: the walker guard and the `min_cells=2` call are correct at the changed lines, and a negative regression test covers the dead-path case.
- Test coverage of the new behaviors: the SKILL.md-only dispatch predicate, the piped playbook report, the overlap advisory, the runtime/scripts resolution bases, and the engine's child-doc exclusion each carry a named regression test.
- Versioned-doc membership divergence across standard, engine, router and packager: documented as deliberate (standard line 32, DV-R7), with the remaining template gap already tracked as R1-P2-001.
- The changelog carve-out in `package_skill.py`: changelog entries in the tree carry 4-part versions, the strip commit touched none of them, and the strict package check stays green.
- Playbook backtick checker scope: warning-level only, `maskFencedCode` shields fenced content, placeholders and runtime output are skipped by `isExpectedUnresolved`, and the strict exit-code path is unchanged at the changed lines.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass (with carry) | The change set's membership claims hold across standard, engine, router, packager and playbook validator at the reviewed lines; R3-P1-001 remains open on the goal's bump gate and is not re-adjudicated in maintainability |
| `checklist_evidence` | core | not applicable this iteration | Packet ledger is traceability-owned (R3-P2-001) |
| `skill_agent` | overlay | inherited pass (iteration 3) | 14/14 `SKILL.md` versions equal their top changelog entry; five bumps ripple through metadata |
| `agent_cross_runtime` | overlay | pass | No consumer of the router's scope surface outside `.skilled`/`.opencode`; `.hermes`/`.claude` scans return nothing |
| `feature_catalog_code` | overlay | pass | Two-column File-table path check implemented and regression-tested |
| `playbook_capability` | overlay | pass | Backtick warnings report-only; piped report preserved via `process.exitCode` |

## Verdict

No P0 or P1 findings this iteration. Two new maintainability P2 findings, both about surface left behind by the narrowing rather than behavior: the router's test-only scope mapper (R4-P2-001) and the engine's five-way predicate spelling (R4-P2-002). Per the iteration mapping, P2-only resolves as PASS. Carried R3-P1-001 stays active in the findings registry and keeps its run-level CONDITIONAL weight there; its resolution remains the traceability gate's decision.

## Next Dimension

None remaining: all four dimensions are now covered (correctness, security, traceability, maintainability). Iteration 5 of 5 is the final coverage and convergence sweep over the open registry: R3-P1-001, R1-P2-001 to R1-P2-004, R3-P2-001, and the two new R4 P2s.

Review verdict: PASS
