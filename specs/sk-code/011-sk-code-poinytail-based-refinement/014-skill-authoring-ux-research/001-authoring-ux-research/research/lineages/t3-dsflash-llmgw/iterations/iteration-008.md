# Iteration 8: the external-author surface and the audience map for every fix

## Focus
Which of the E1-E5 fixes ship to an external user who authors skills in their own repository, and which are toolchain-only. The in-package completion gate is validate_skill_package.py; the scaffold is init_skill.py; the packaging contract is package_skill.py. This iteration maps fixes to audiences before synthesis.

## Actions Taken
- Read validate_skill_package.py's check assembly for standalone and parent kinds.
- Read init_skill.py's scaffold behavior around generated files and its post-scaffold gate.
- Read package_skill.py's version-related checks to see what the packaging contract covers.
- Compared with the CI fleet gates that cover the standalone class.

## Findings
1. [VERIFIED] The in-package validator is kind-aware: every kind runs package_skill.py --check; a parent additionally runs compiled-routing readiness and the toolchain's parent-skill-check.cjs; a standalone runs only the package check (plus a hard partial-declaration error when only one of mode-registry.json/hub-router.json exists). [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:247-288]
2. [VERIFIED] Because parent-skill-check contains the E5 rules (5e, 5i, 13a-13d) and the leaf byte-drift rule 10b, an external hub author who runs the validator already gets those rules — at packaging time, which is the external avatar of E5: the check exists, the cadence does not match the edit. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:271-288]
3. [VERIFIED] Standalone skills have a real gap: the validator runs no leaf-manifest freshness and no derived-block freshness step for them, and the fleet gates that do cover standalone roots (ci-skill-root-metadata, ci-leaf-manifest-freshness, ci-skill-derived-freshness) are not called from the validator. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:247-288]
4. [VERIFIED] package_skill.py --check enforces structural and frontmatter contracts including the four-part version format on doc-class files, but it does not compare a committed leaf-manifest.json against a fresh build or check carrier parity — so it cannot close the standalone gap by itself. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:55-56,119-122,619-668]
5. [VERIFIED] init_skill.py already applies the auto-mint pattern at creation time: after scaffolding it runs ci-skill-root-metadata.cjs --fix scoped to the new root and asserts leaf-manifest.json (and leaf-aliases.json for standalone) exists before returning. The drift problem is therefore strictly post-creation. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:249-275]
6. [VERIFIED] The scaffolded leaf-manifest.config.json carries a note naming its regeneration command (`ci-skill-root-metadata.cjs --fix`), so the fix instruction ships inside the artifact itself. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:368-375]
7. [VERIFIED] A fresh hub is born stage1-only with version 1.0.0.0 across its carriers and a changelog directory; version parity has a defined starting point. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:471-499,587-612]
8. [INFERRED] Audience map for the fix inventory: shipped-in-the-package fixes (they travel with sk-create-skill into a user's repo) are the leaf generator/checker messages, the version-bump command extension, the intent-signals carry generator, and the scaffold note; toolchain-only fixes (they require this repository's hook/CI/doctor wiring) are the pre-commit auto-mint extension, the CI gate wiring, the parent-skill-check warn-set values, and the advisor surface-hint pass-through. For standalone external users the cheapest completion-gate improvement is one more check entry in validate_skill_package.py that runs the shipped leaf generator --check (an in-place extension of the existing check list); for hub users the validator already carries the doctor rules, so the remaining external work is cadence documentation, not new machinery.

## Ruled Out
- Bundling every fix into one new external "authoring gate" command: the validator is exactly that command for the package; a second one splits the surface.
- Making the advisor daemon a prerequisite for external single-repo users: it is toolchain infrastructure; the shipped vocabulary carry generator plus docs covers the authoring-time side.
- Re-running the fleet CI gates from the package validator: they are repo-scale checks; per-skill calls are the same cost class as parent-skill-check and belong in toolchain CI, not in a package a user unpacks.

## Dead Ends
- A search of package_skill.py for manifest-freshness logic found only frontmatter version rules; recorded so the standalone gap is not re-hunted.

## Edge Cases
- Contradictory evidence: none; the kind-based dispatch is explicit in main().
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py
- .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py
- .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py
- .github/workflows/routing-registry-drift.yml

## Assessment
- New information ratio: 0.88
- Questions addressed: all five classes' audience mapping (no new key question)
- Questions answered: none new (Q1-Q5 already answered); the audience split is completed.

## Reflection
- What worked and why: reading the validator's main() answered the audience question in one place — what ships is whatever a user can run inside their own checkout, and the validator is that surface.
- What did not work and why: none this iteration.
- What I would do differently: for future classes, check the in-package validator earlier; it would have shortened the audience analysis for E1-E5.

## Recommended Next Focus
Iteration 9: cross-class consolidation — one root-cause statement that covers all five classes, the master rejected-ideas list, and a draft phase ranking by classes prevented per unit of cost, each phase naming the file it changes and the check that proves it; plus a citation-resolvability pass over the lines the synthesis will carry.
