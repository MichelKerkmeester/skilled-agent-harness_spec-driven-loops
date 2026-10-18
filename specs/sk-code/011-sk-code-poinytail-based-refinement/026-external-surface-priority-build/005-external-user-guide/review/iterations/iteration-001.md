# Deep Review Iteration 001

## Dispatcher

- Mode: review, agent `@deep-review`, run 1, session `2026-10-13T09:30:10.618Z`, generation 1, lineageMode new.
- Target: commits `8f59b9bd0a` and `1895122d37` on branch `worktrees/129-surface-guide` (diff `d99ddaff7d..1895122d37`); review scope files listed in `deep-review-config.json`.
- Focus: correctness - the README block "What Adapting `sk-code` Looks Like" as executable instructions (paths, commands, flags, step order, removal completeness) and the R4 lines against the routing registries.
- Budget profile: verify (12 tool calls, within soft max).

## Dimension

D1 Correctness: logic of the guide as an instruction set, edge cases a user hits while adapting, and observable intent (a green check battery, truthful surface roles).

## Files Reviewed

- `README.md:800`, `:1384` (R4 feature bullet and template list), `:1445`-`:1483` (adaptation block; anchors `:1451`, `:1452`, `:1454`, `:1461`, `:1466`, `:1474`) [SOURCE: README.md:1445]
- `.skilled/skills/sk-code/SKILL.md:40` [SOURCE: .skilled/skills/sk-code/SKILL.md:40]
- `.skilled/skills/sk-code/README.md:23`, `:55-57`, `:90` [SOURCE: .skilled/skills/sk-code/README.md:23]
- `.hermes/skills/sk-code/SKILL.md` (regenerated mirror in the diff) [SOURCE: .hermes/skills/sk-code/SKILL.md:1]
- `.skilled/changelog/skilled/v4.0.0.5.md` [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1]
- `.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/hub-router.json` [SOURCE: .skilled/skills/sk-code/mode-registry.json:1]
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423` (step_4), `:500` (step_6) [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:423]
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:496]
- `.skilled/scripts/git-hooks/pre-commit:207` (mirror parity gate), `:480` (route-remint gate) [SOURCE: .skilled/scripts/git-hooks/pre-commit:207]
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:122` (walk scope), `:322` (surface count source) [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:122]
- `.hermes/skills/sk-code-webflow/SKILL.md`, `.hermes/skills/sk-code-obsidian/SKILL.md` [SOURCE: .hermes/skills/sk-code-webflow/SKILL.md:1]
- Spec and goal: `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:72` (R4 requirement), `goal.md` D1 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:72]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Removal and add recipes leave the `.hermes` runtime mirror packets untouched, and only the pre-commit mirror gate catches the deletion** -- README.md:1461 -- The removal recipe's "files written for the example" step enumerates hub-rooted artifacts, but `.hermes/skills/sk-code-webflow/` and `.hermes/skills/sk-code-obsidian/` are materialized copies. Their `.opencode/skills` sibling is a symlink and updates itself, so the recipe's silence is only harmless for symlinked runtimes. The hub-rooted doc sweep cannot see the mirror tree and none of the six battery commands checks it.
   - Case: a user deletes `.skilled/skills/sk-code/sk-code-webflow/`, follows removal steps 1-8, and commits with hooks installed; `.hermes/skills/sk-code-webflow/SKILL.md` still registers the removed surface for Hermes users until a mirror sync runs.
   - File: README.md:1461
   - Evidence: the mirror packets exist as real directories [SOURCE: .hermes/skills/sk-code-webflow/SKILL.md:1]; the hub-rooted walk reads only `.md` and `.json` under the hub [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:122]; the pre-commit mirror-parity gate lists `.hermes/skills` and runs a `sync-skills-hermes.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:207]; the Verify block names no mirror command [SOURCE: README.md:1474].
   - User impact: the removed example remains discoverable in the Hermes runtime, and a hook-enabled commit blocks on a mirror sync the guide never names (the gate is the only surface that mentions it).
   - Finding class: class-of-bug
   - Scope proof: `rg -l "sk-code-webflow|sk-code-obsidian"` outside `.skilled/skills/sk-code/` and `.hermes/` returns fixtures, tests and unrelated docs the battery never resolves against the sk-code surface set; the Hermes mirror is the only runtime copy the removal recipe misses.
   - Affected surface hints: ["removal recipe step 6", "add recipe step 5", ".hermes/skills", "pre-commit mirror parity gate"]
   - Recommendation: name the runtime-mirror regeneration (`sync-skills-hermes.cjs`) in both recipes, or state that the pre-commit mirror gate will drive it, so the Hermes copy is never silently stale.
   - Confidence: medium-high; downgrade trigger: if `sync-skills-hermes.cjs --check` proves not to compare hub skill packets, this collapses to documentation polish - the guide gap itself stands.

2. **Root README R4 lines go stale after example removal, and the hub-rooted sweep cannot flag them** -- README.md:1384 -- The adaptation block's fix-everything step runs `verify-doc-claims.cjs`, whose `--root` defaults to the hub directory. The two R4 lines that describe the shipped surface set live in the root README, outside the walk, so a user who removes an example keeps text that advertises it.
   - Case: a user removes the Webflow example and runs the verify battery; `README.md:800` and `README.md:1384` still say "two optional examples" naming Webflow and Obsidian.
   - File: README.md:1384
   - Evidence: hub-rooted walk [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:122]; the two lines sit outside `.skilled/skills/sk-code/` [SOURCE: README.md:800]; no battery command walks the root README [SOURCE: README.md:1474].
   - User impact: the adapted repository's own README contradicts the adapted tree, and no check on the way names the fix.
   - Finding class: instance-only
   - Scope proof: the hub docs that carry surface counts are covered by the hub walk; only the root README's own R4 lines sit outside it.
   - Affected surface hints: ["removal recipe step 7", "README.md:800", "README.md:1384"]
   - Recommendation: add "and the two surface lines in the root README" to removal step 7's fix list.
   - Confidence: high.

## Traceability Checks

- `spec_code` (core): pass - R4 requirement `spec.md:72` verified against the actual lines. `README.md:800` and `:1384` mark OPENCODE native and Webflow/Obsidian optional examples; `.skilled/skills/sk-code/SKILL.md:40` states three surfaces with OPENCODE native; hub README rows `:23`, `:55-57`, `:90` carry matching roles. No line tells the user to replace OpenCode. Goal D1's six block parts are all present in the rewritten block.
- `checklist_evidence` (core): partial - acceptance row P11-5 (R4 lines read and quoted) is effectively covered by this iteration; P11-1 to P11-4 and P11-6 were not executed here.
- `skill_agent` (overlay): partial - the hub `SKILL.md` surface sentence and README rows were verified; no agent definition file is in scope.
- `agent_cross_runtime` (overlay): partial - the regenerated `.hermes/skills/sk-code/SKILL.md` carries the same roles, but the removal path leaves example mirror packets behind (finding R1-P2-001).
- `feature_catalog_code` (overlay): partial - hub feature-catalog docs sit inside the verify-doc-claims walk; not individually read.
- `playbook_capability` (overlay): partial - removal step 6 correctly names the playbook scenarios and rows; the canary fixture and its authored twin exist.

## Integration Evidence

- Caller: `/deep:review` single-iteration dispatch; LEAF-only, no sub-agents.
- Surfaces named and checked: `create-skill-parent-auto.yaml` step_4 (`:423`) and step_6 (`:500`); `parent-skill-check.cjs` doctor 3c (`:496`); pre-commit mirror-parity gate (`:207`) and route-remint gate (`:480`); `compiled-route-manifest.cjs` usage; `generate-leaf-manifest.cjs --write` usage; `compiled-route-sync.cjs --check` usage; `compiled-route-guard.cjs` manifest freshness; `verify-doc-claims.cjs` walk and surface-count source; `install-git-hooks.sh` presence.

## Edge Cases

- Ambiguity recorded: removal step 2 says "delete the two `vocabularyClasses` that entry names", while the signal entry's field is `classes` and `vocabularyClasses` is the top-level map. Decipherable with the file open; ruled out as a finding.
- Deferred evidence: three v4.0.0.5 behavioral claims were not verified inside this iteration (guard failure-message wording, pruned-`specs/` failure in sync and guard, doctor 13a plus ROUTER version neutrality). Deferred to the traceability iteration.
- Stale anchor, not a defect: `spec.md:41` still scopes the block as `README.md:1445-1452`; the rewritten block runs to about `:1483`. Start anchor is correct.

## Confirmed-Clean Surfaces

- Every path named in the guide exists (28 of 28 checked): the three surface packets, hook installer, `compiled-route-manifest.cjs`, both activation-manifest paths, the `.opencode/skills` symlink, the authored router program under `specs/`, registry, hub router, `ROUTER.md`, `stack-detection.md`, playbook, `sk-code-quality`, both test/fixture twins, `verify-doc-claims.cjs`, `test_readme_manifest.py`, `create-skill-parent-auto.yaml`, both generators, doctor, guard, sync, route CLI and the drift-guard script.
- Every battery command matches its script's usage contract (`parent-skill-check.cjs [<skill-dir>]`, no-arg metadata check, no-arg guard, `--check` sync, drift script, `--hub`/`--prompt` route CLI).
- "Before you start" step 1 is true: the pre-commit route-remint gate re-mints the activation manifest and stages both the runtime and authored copies [SOURCE: .skilled/scripts/git-hooks/pre-commit:480].
- Removal step 7 is true as written for the hub: `verify-doc-claims.cjs` walks `.md` and `.json` under its root, so the hub `README.md` and `graph-metadata.json` are in scope [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:122], and its surface count comes from `mode-registry.json` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:322].
- Add recipe is true against the workflow: step_4 places a new surface after the workflow modes and ahead of the existing surfaces; step_6 names the canary case with its fixture copy and the commit-with-hooks follow-up [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:500]; the shared workflow symlinks in `sk-code-skilled/references/` match step 2.
- Doctor 3c names the README block for a deliberately removed surface [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:496].
- R4 registry truth: `mode-registry.json` `extensions.surface-axis.surfaces` declares exactly `sk-code-webflow`, `sk-code-skilled`, `sk-code-obsidian`; `hub-router.json` `routerPolicy.tieBreak` is quality, review, opencode, obsidian, webflow; each removable example's signal entry names exactly two classes in `vocabularyClasses`.

## Ruled Out

- Wrong path, command or flag in the guide: all 28 referenced paths exist and every command line matches its script's usage (iteration 1; evidence: existence sweep plus usage strings).
- Removal recipe missing a step needed for the six-command battery: battery-relevant artifacts are covered; doctor 3c points at the README block, and the commit path re-mints and stages both manifests (iteration 1; evidence: `parent-skill-check.cjs:496`, pre-commit route-remint gate).
- R4 lines misstating the surface set or telling the user to replace OpenCode: all lines match the registries and every shipped line uses native/optional-example roles (iteration 1; evidence: registry probes plus doc reads).
- `hub-router` wording (`classes` versus `vocabularyClasses`) as a defect: decipherable with the file open (iteration 1).
- Release-note claim that the doctor names the README block: true (iteration 1; evidence: `parent-skill-check.cjs:496`).

## Verdict

PASS with advisories: 0 P0, 0 P1, 2 P2. The guide is executable as written and the six-command battery is reachable; both advisories concern artifacts the hub-rooted sweep cannot see.

## Next Dimension

Security (D2).

## Next Focus

- Dimension: security (D2).
- Focus area: the guide's operational instructions - installing repo git hooks, copying manifests over authored paths, running the scaffold command; confirm no instruction exposes secrets, trusts unreviewed content, or directs a destructive operation, and that hook-trust behavior is described accurately.
- Reason: dimension rotation after a clean correctness pass.
- Rotation status: D1 complete, D2 next.
- Blocked/productive carry-forward: the deferred v4.0.0.5 behavioral claims (guard wording, pruned-`specs/` failure, doctor 13a) stay queued for the traceability iteration; the two out-of-hub sweep gaps remain active P2 advisories.
- Required evidence: `.skilled/scripts/install-git-hooks.sh` trust logic, the pre-commit hook-trust block, the README hook instruction, and security-adjacent release-note lines.

Review verdict: PASS
