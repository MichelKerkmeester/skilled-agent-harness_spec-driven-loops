# Deep Review Iteration 002

## Dispatcher

- Mode: review, agent `@deep-review`, run 2, session `2026-10-13T09:30:10.618Z`, generation 1, lineageMode new.
- Target: commits `8f59b9bd0a` and `1895122d37` on branch `worktrees/129-surface-guide` (diff `d99ddaff7d..1895122d37`); scope files per `deep-review-config.json`.
- Focus: security (D2) - destructive or unsafe instructions, hook installer provenance and trust behavior, copy-over-authored direction, Hermes copy parity, release-note safety.
- Budget profile: verify; 13 calls, at the hard cap.

## Dimension

D2 Security: trust boundaries, destructive side effects and work-loss paths of the guide as an operational instruction set.

## Files Reviewed

- `README.md:1451` (hooks and manual manifest fallback), `:1452` (prune rule), `:1456` (delete step), `:1461` (canary fixture copy), `:1384` (replace wording), `:203` (other-clone hook trust) [SOURCE: README.md:1456]
- `.skilled/scripts/install-git-hooks.sh:112` (`--status`), `:152` (`--uninstall`; bare invocation falls through to install), `:204` (linked-worktree warning) [SOURCE: .skilled/scripts/install-git-hooks.sh:112]
- `.skilled/scripts/git-hooks/pre-commit:44` (trust block), `:541` (authored mirror), `:640` (runtime-to-authored copy), `:647` (stages both) [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]
- `.skilled/bin/compiled-route-manifest.cjs:29` (usage: `mint|refresh|freshness`) [SOURCE: .skilled/bin/compiled-route-manifest.cjs:29]
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:500` (canary follow-up contract) [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:500]
- `.skilled/skills/sk-code/SKILL.md:40` and `.hermes/skills/sk-code/SKILL.md:45` (surface sentence parity) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]
- `.skilled/changelog/skilled/v4.0.0.5.md` (release note, read whole) [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Removal recipe deletes the example folder without a work-loss preflight, and an in-place-adapted example is lost** -- README.md:1456 -- Step 1 of the removal recipe deletes `.skilled/skills/sk-code/<mode>/` outright. `<mode>` is a shipped example name, and the same README invites replacement in place ("remove or replace the optional example ... with your own", README.md:1384), so a user who adapted an example instead of adding a packet has no warning that distinguishes their work from the shipped copy.
   - Case: a user who followed the README's replace wording by adapting `sk-code-webflow/` in place later runs the removal recipe (the block repeats it for each dropped surface) and step 1 deletes their adapted packet together with any uncommitted work in it.
   - File: README.md:1456
   - Evidence: the delete step names only the folder [SOURCE: README.md:1456]; replacement in place is invited by the R4 bullet [SOURCE: README.md:1384]; the recipe carries no commit-first or keep-if-adapted preflight, and the add path scaffolds a new packet name rather than reusing the example name.
   - Counterevidence sought: a committed deletion is recoverable from git; the add recipe scaffolds a new packet, so the default path is safe; step 7's verify battery lists stale references after the delete. None of these protect uncommitted, in-place work.
   - Alternative explanation: users follow the add recipe and leave examples untouched, making the delete harmless; the finding applies only to the in-place replacement path that the same README's wording invites.
   - User impact: a user can lose their own surface packet and uncommitted edits while following a recipe meant to remove a shipped example.
   - Finding class: class-of-bug
   - Scope proof: the two shipped example names are the only `<mode>` values, and the add path creates a new name; no step or check flags a modified example before deletion.
   - Affected surface hints: ["removal recipe step 1", "README replacement wording", "example surface folders"]
   - Recommendation: add a preflight line to the removal recipe: commit your work first, and if you adapted an example in place, keep it and skip the delete step for it.
   - Confidence: medium; downgrade trigger: if a preflight or wording already treats an adapted-in-place example as the user's surface to keep, this collapses to editorial polish.

## Traceability Checks

- `spec_code` (core): pass for this dimension - the guide's hook, manifest and fixture instructions match the shipped gate behavior [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]; carried from iteration 1 for the R4 roles.
- `checklist_evidence` (core): partial - acceptance rows P11-1..P11-4 and P11-6 remain for the traceability iteration; P11-5 was covered in iteration 1.
- `skill_agent` (overlay): partial - no agent definition is in scope; the hub `SKILL.md` surface sentence was unchanged by this iteration's checks.
- `agent_cross_runtime` (overlay): partial - the changed surface sentence is identical in the Hermes mirror (source line 40, mirror line 45) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]; the removal-path mirror gap stays R1-P2-001.
- `feature_catalog_code` (overlay): partial - unchanged from iteration 1; hub catalog docs sit inside the verify-doc-claims walk.
- `playbook_capability` (overlay): partial - unchanged from iteration 1; step 6's playbook pointers and the canary contract match [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:500].

## Integration Evidence

- Caller: `/deep:review` single-iteration dispatch; LEAF-only, no sub-agents.
- Surfaces checked: `.skilled/scripts/install-git-hooks.sh` (bare invocation installs; only `--status`/`--uninstall` are special [SOURCE: .skilled/scripts/install-git-hooks.sh:112]); `pre-commit` trust block keyed to the checkout's git common dir or a local `skilled.trustRepoHooks=true`, with a loud NOTICE when skipped [SOURCE: .skilled/scripts/git-hooks/pre-commit:44]; route-remint gate copies the runtime manifest to its authored copy and stages both [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]; `.hermes/skills/sk-code/SKILL.md` regenerated mirror; `.opencode/skills -> ../.skilled/skills` symlink present.

## Edge Cases

- Authored-vs-runtime wording: README.md:1452 calls the specs directory "the authored source of compiled routing" while the gate calls the authored manifest a mirror of the runtime tree [SOURCE: .skilled/scripts/git-hooks/pre-commit:541] and copies runtime to authored [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]. Skeptic pass: the label describes the archived routing-program directory, the guide never tells a user to edit the manifest, and the copy direction matches the gate's contract. Ruled out as a finding; recorded under Ruled Out.
- Hook trust for other clones: the installer prints the `skilled.trustRepoHooks` flag for other clones, and the root README documents it [SOURCE: README.md:203]; the adaptation block's own checkout is trusted by git common dir. Not a gap for the stated path.
- Linked worktrees: the installer warns that installed symlinks point into this worktree and dangle if it is removed [SOURCE: .skilled/scripts/install-git-hooks.sh:204]; the guide does not repeat the warning, but the installer does. Not a finding.
- Manifest and canary twins are currently byte-identical (cmp on both pairs returned IDENTICAL), so the copy steps are a sync, not a divergence repair.

## Confirmed-Clean Surfaces

- Hooks step points at the right installer: `.skilled/scripts/install-git-hooks.sh` exists and installs with no argument; ownership checks govern symlink replacement; other-clone trust is explicit.
- The remint claim in README.md:1451 matches the gate: staged routing inputs trigger a re-mint, the runtime manifest is copied over the authored copy, and both are staged [SOURCE: .skilled/scripts/git-hooks/pre-commit:647].
- Manual fallback direction matches the gate (`refresh --hub sk-code --skill-root ...`, then copy runtime to authored) [SOURCE: README.md:1451].
- Hermes copy parity: the surface sentence is identical across source and mirror; the full-file diff is the generated banner plus deliberate relative-path rewrites.
- No instruction handles secrets, tokens or credentials; the check battery is local; the release note promises no destructive action.

## Ruled Out

- Wrong hook installer or silently inert hooks (iteration 2; evidence: installer action parsing, trust block, README.md:203).
- Manifest-over-authored copy as a direction inversion (iteration 2; evidence: pre-commit:640 and :541; guide matches gate).
- Canary fixture copy direction (iteration 2; evidence: create-skill-parent-auto.yaml:500 contract; twins byte-identical).
- "Authored source" wording as a data-loss trap (iteration 2; evidence: no edit instruction exists; directory-level label).
- Unsafe release-note promise (iteration 2; evidence: claims are behavioral or deferred traceability checks).
- Hermes mirror drift on the changed sentence (iteration 2; evidence: line-level comparison).

## Verdict

PASS with advisories: 0 P0, 0 P1, 1 new P2 (R2-P2-001). Two prior P2 advisories (R1-P2-001, R1-P2-002) remain active; none of them block.

## Next Dimension

Traceability (D3).

## Next Focus

- Dimension: traceability (D3).
- Focus area: the deferred v4.0.0.5 behavioral claims against the shipped code - guard failure-message wording, pruned-`specs/` failure in sync and guard, doctor 13a and ROUTER version neutrality - plus acceptance rows P11-1..P11-4 and P11-6.
- Reason: D1 and D2 are complete; traceability is the next uncovered dimension and owns the deferred release-note claims.
- Rotation status: D2 complete, D3 next.
- Blocked/productive carry-forward: R1-P2-001, R1-P2-002 and R2-P2-001 remain active P2 advisories.
- Required evidence: `.skilled/bin/compiled-route-guard.cjs` failure messages, `.skilled/bin/compiled-route-sync.cjs` pruned-`specs/` path, `.skilled/commands/doctor/scripts/parent-skill-check.cjs` check 13a, `ROUTER.md` version lines, changelog claims.

Review verdict: PASS
