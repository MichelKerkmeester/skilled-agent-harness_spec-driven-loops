# Iteration 1: E1 narrowest slice — leaf-manifest generation and its freshness gate inside sk-create-skill

## Focus
E1, first slice: the `leaf-manifest.json` family — the generator (who mints, who checks), the fleet freshness gate, and the authoring loop that must remember to re-mint after editing a skill's references/assets corpus. Evidence base: the 007-follow-up-fixes/002-leaf-generator-ignores child and the repo's own hook/CI surfaces as they stand now.

## Actions Taken
- Read the leaf generator and its freshness gate end to end.
- Ran the fleet freshness gate read-only to measure the current state (exit 0).
- Read the git-hook framework's pre-commit and pre-push, and the CI workflow that carries the leaf gate, to locate the authoring-time surface.
- Read the 007/002 implementation summary for the probe evidence on the __pycache__ false-drift fix.

## Findings
1. [VERIFIED] The leaf generator exposes both modes and its check message already names the fix: `runCheck` byte-compares the committed manifest against a fresh build and on drift exits 1 with "Re-run with --write to regenerate." [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:533-551]
2. [VERIFIED] The fleet gate `ci-leaf-manifest-freshness.cjs` walks every committed manifest, regenerates each through the same generator, and fails on any byte drift; exit codes 0/1/2 separate fresh, stale, and cannot-run. Ran it this iteration: `checked=14 fresh=14 failed=0`, exit 0, ~9.5s wall. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:93-111,165-170]
3. [VERIFIED] The generated contract is already documented where authors read: "Regenerate rather than hand-edit; a stale manifest fails 10b-byte-drift" and "Never hand-edited"; the v4 upgrade path prints the exact `--write` command, and the reference-only create branch already runs the scoped `--check`. So missing knowledge is not the failure. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md:44,115] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:170]
4. [VERIFIED] The repo's global pre-commit hook already auto-re-mints two sibling derived families at commit time: compiled-route manifests for staged hub routing inputs (it regenerates, copies to the authored copy, `git add`s, and proves the index holds the new bytes) and spec graph-metadata/description for staged spec docs. Hermes skill copies are byte-checked at the same stage. The pattern for "generated artifact drifts after an edit" is therefore established in-repo, not hypothetical. [SOURCE: .skilled/scripts/git-hooks/pre-commit:352-549] [SOURCE: .skilled/scripts/git-hooks/pre-commit:554-700] [SOURCE: .skilled/scripts/git-hooks/pre-commit:259-267]
5. [VERIFIED] The leaf corpus is excluded from that auto-mint trigger. `ROUTE_PATHS` names only SKILL.md, hub-router.json, mode-registry.json (and mode SKILL.md); the mirror checks do not include the leaf gate. Editing `references/**` or `assets/**` runs nothing until CI's routing-registry-drift job or a push. [SOURCE: .skilled/scripts/git-hooks/pre-commit:439-449] [SOURCE: .github/workflows/routing-registry-drift.yml:196]
6. [VERIFIED] The 007/002 fix removed a false-drift producer, not the mint timing: the walk now ends in `dropGitIgnoredLeaves` with name-rule fallback, so a stray __pycache__ no longer forces STALE; the probe evidence shows 14/13/1 before and 14/14/0 after. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:94-134] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/implementation-summary.md:48,94]
7. [INFERRED] Root cause: leaf-manifest is a stored derived artifact whose regeneration trigger sits outside the author's edit loop. The author is in their editor changing a reference doc; nothing on the write path re-mints, and every gate that would catch it (scoped --check, fleet CI, pre-push routing parity) runs after the edit or on another machine. The repo already solved this shape for route manifests and spec metadata via a commit-time auto-re-mint; the leaf family is the omission, which is why manual re-mints read as a UX defect rather than a missing capability.
8. [INFERRED] Smallest fix, ranked by reversal cost (.skilled/repo-rules/prevent-overengineering.md order): (a) build nothing fails — docs and the error message already say "regenerate", yet drift is the recorded class; (b) change a value fails — no value governs mint timing; (c) extend the existing pre-commit function in place is the cheapest working move: add the skill's declared leaf roots (references/, assets/) to the route-remint trigger and re-mint `leaf-manifest.json` through the existing scoped generator for the affected skill, staging and confirming it like the route manifests; (d) a new standalone hook file is unnecessary because the hook framework exists; (e) a generic derived-artifact registry abstraction fails the cheaper move until a third family needs it. For external authors the shipped `--check`/fleet gate plus generator message already serve; the remaining gap there is a scaffolded CI line, a docs change rather than code. Proof: re-run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` (exit 0 today) and the scoped `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check <skillDir>` after an edit; the 007/002 probe shows the stale flip to exit 1. Audience: maintainers (fleet gate plus one commit-time auto-fix), external authors (scoped check and message that names the fix).

## Ruled Out
- Pre-commit hook as a NEW file: the hook framework and its auto-re-mint precedent already exist, so the cost is one trigger edit, not a new file; rejected as a costlier shape than extending in place. Also this hook install is machine-global, so externals never inherit it — not the fix for the second audience.
- Derive the manifest on read instead of storing it: rejected — the manifest is the stable typed (workflowMode, leafResourceId) keying surface and a replay input; per-query derivation adds runtime cost and a new abstraction for a per-commit event.
- Re-derive the whole fleet on every commit: rejected — the fleet gate measures ~9.5s for 14 manifests, and the route-remint precedent scopes to affected hubs; a scoped per-skill mint is strictly cheaper.
- Just improving docs again: rejected — docs already say "regenerate rather than hand-edit" and the drift still occurred; a build-nothing move.

## Dead Ends
- None definitively eliminated this iteration; the check-vs-docs angle is answered, and the remaining E1 surfaces (hub-router/mode-registry regen, compiled-route guard, Hermes sync, trigger index) are deferred to iteration 2.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none; CI, pre-push and the generator all agree on the same byte-compare.
- Missing dependencies: none; all reads local.
- Partial success: iteration scoped to the leaf-manifest slice; the other E1 surfaces are carried forward.

## Sources Consulted
- .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
- .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md
- .skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md
- .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md
- .skilled/scripts/git-hooks/pre-commit
- .skilled/scripts/git-hooks/pre-push
- .github/workflows/routing-registry-drift.yml
- specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/implementation-summary.md

## Assessment
- New information ratio: 0.93
- Questions addressed: Q1 (leaf-manifest slice only), Q5 (partial: hook placement evidence)
- Questions answered: none yet

## Reflection
- What worked and why: reading the hook framework after the generator paid off — the fix ranking became concrete because the repo already auto-re-mints two sibling families, so "extend in place" is demonstrably cheaper and proven.
- What did not work and why: an initial assumption that no hook surface existed was wrong; the hooks are installed from .skilled/scripts/git-hooks to a user-global core.hooksPath, so absence of a repo-local .githooks dir says nothing. Corrected in Finding 4.
- What I would do differently: measure the scoped generator cost next, since the fleet gate's 9.5s is CI-scale and the hook fix must scope to one skill.

## Recommended Next Focus
Iteration 2, E1 continued: hub-router.json / mode-registry.json versus SKILL.md and ROUTER.md, the compiled-route manifest guard (fresh vs stale-manifest), Hermes mirror drift, and the trigger index — who regenerates each, which check catches it where, and whether the route-remint precedent covers every one of them.
