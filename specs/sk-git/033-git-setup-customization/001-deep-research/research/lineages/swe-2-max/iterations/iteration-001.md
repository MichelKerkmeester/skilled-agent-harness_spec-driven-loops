---
title: "Iteration 1: The /doctor:sk-code setup precedent — router, route manifest, workflow, battery, presentation, adaptation guide"
trigger_phrases: []
---
# Iteration 1: The /doctor:sk-code setup precedent

## Focus

Establish exactly how `/doctor:sk-code setup` works mechanically — the command router, the `_routes.yaml` entry, the workflow YAML, the check-script battery contract (legs, verdicts, repairs, exit codes), the presentation contract, and the adaptation guide in README.md that names the battery as its Verify step.

## Actions Taken

- Read `.skilled/commands/doctor/sk-code.md` (router contract, owned assets, mode routing, execution targets, presentation boundary).
- Read `.skilled/commands/doctor/_routes.yaml` in full (route schema + every route row, including the two existing `/doctor:git` targets).
- Read `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` (operating mode, mutation boundaries, execution steps, output contract).
- Read `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` (argument failure, per-leg table, result templates, troubleshooting).
- Read `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` in full (369 lines).
- Read the adaptation guide: `README.md` "What Adapting `sk-code` Looks Like" block (lines 1447-1491).
- Located the 026/029 spec packets that produced the surface (both exist under `specs/sk-code/011-sk-code-poinytail-based-refinement/`).

## Findings

1. `/doctor:sk-code` is a thin router, not an implementation: `sk-code.md` binds the route whose `command` is `/doctor:sk-code` out of `_routes.yaml`, loads the route's workflow YAML plus the presentation contract, and forbids agent dispatch or YAML edits from the Markdown. Its only target is `setup` (default when no positional is given); the only accepted flag is `--prompt=<text>`; anything else fails before YAML load. [SOURCE: .skilled/commands/doctor/sk-code.md:10-36]

2. The route manifest `_routes.yaml` is the canonical routing and mutation-class manifest. Each route carries `command`, `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating` (`read-only | add-only | mutates`), `gate3_location`, `mcp_tools`, `script_invocations`, `trigger_phrases`. The sk-code route is `mutating: read-only` with `gate3_location: "n/a (read-only setup battery … writes nothing)"`. [SOURCE: .skilled/commands/doctor/_routes.yaml:23-37,220-234]

3. The workflow `doctor-sk-code-setup.yaml` is single-step and hard-pinned read-only: `mutation_boundaries.read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]`, with the invariant that every leg runs check-only and "Repair is an explicit operator action, never a side effect of a diagnostic." Exit code maps 0→STATUS=OK, 1→STATUS=FAIL, 2→STATUS=ERROR. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:23-28,46-60]

4. The battery `sk-code-setup-check.cjs` is a self-contained node script with four parts: a `LEGS` array (each leg = `{id, command(), run()}` spawning a child check from the repo root), a `JUDGES` map (leg result → `{ok, details[], repairs[]}`), a `report()` that prints `PASS|FAIL|SKIP  <leg>  <command>` lines plus indented `repair:` lines under failures and a final `STATUS=OK legs=8` / `STATUS=FAIL failed=<n> skipped=<n>`, and `main()` returning exit 0/1/2. `SK_CODE_SETUP_ROOT` overrides the repo root so the battery can be pointed at a fixture tree. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:39-41,83-149,155-311,331-369]

5. The eight legs are: `provisioning` (in-process `require.resolve('@spec-kit/shared/frontmatter/parse-frontmatter.js')`, no child), `parent-skill` (`parent-skill-check.cjs .skilled/skills/sk-code`), `root-metadata` (`ci-skill-root-metadata.cjs`), `guard` (`compiled-route-guard.cjs --json`), `sync` (`compiled-route-sync.cjs --check`), `drift-guards` (`run-all-drift-guards.sh`), `derived-freshness` (`ci-skill-derived-freshness.cjs --format json`), and `probe` (`compiled-route.cjs --hub sk-code --prompt <text>` must parse a final JSON line with `action:"route"` — the legacy stub exits 0 too, so exit code alone proves nothing). [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:97-148,252-280; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:49]

6. The battery is dependency-aware, not fail-fast: `PROVISION_DEPENDENTS = {parent-skill, root-metadata}` report SKIP (not FAIL) when provisioning fails, and a missing `.skilled/skills/sk-code/SKILL.md` reports provisioning FAIL with a "predates the v4 layout" repair while every other leg reports `SKIP … needs the v4 layout`. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:69,339-361]

7. Every FAIL leg prints the exact command that repairs it rather than fixing anything: provisioning→`bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .`, sync→`node .skilled/bin/compiled-route-sync.cjs`, derived-freshness→per-root `regenerate-skill-derived.cjs --root <name> --write`, probe-legacy→the guard's own `staleFix(hub)` text. Repairs are data in `JUDGES`, not actions. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:64,183-185,198-280]

8. The sk-code adaptation guide is the README block "What Adapting `sk-code` Looks Like": four before-you-start steps (provision, `git config --local skilled.trustRepoHooks true`, `bash .skilled/scripts/install-git-hooks.sh`, keep the authored routing source + `.opencode/skills` link), a 9-step remove-an-example recipe, a 5-step add-your-own-surface recipe (`/create:skill-parent update --surfaces <name>` + hand edits + canary fixture), and a Verify block listing the same six commands the battery wraps plus `/doctor:sk-code setup` itself. [SOURCE: README.md:1447-1489]

9. The sk-code battery's own provisioning repair is an sk-git script (`worktree-naming.sh provision .`), and its trust step is `skilled.trustRepoHooks` — the setup-check concept already crosses the sk-code/sk-git boundary, so an sk-git battery has precedent for checking shared infrastructure owned partly by other surfaces. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:64; README.md:1453-1454]

10. `/doctor:git` already exists with two `mutating: mutates` targets — `hooks` (dry-run plan over `git config speckit.hooks.<key>` then `--apply` after approval) and `standards` (status/init/set/disable/check over a `.sk-git/` contract dir named by `git config skgit.contractDir`, plus `validate-message.mjs --explain`). sk-git already has a doctor surface AND a per-repo override mechanism; a read-only setup target would be the route family's third member, not a new command family. [SOURCE: .skilled/commands/doctor/_routes.yaml:236-274]

## Questions Answered

- How does `/doctor:sk-code setup` work mechanically? Five layers: router .md → `_routes.yaml` route row → workflow YAML (read-only boundary) → `.cjs` battery (LEGS/JUDGES/report, PASS|FAIL|SKIP + `repair:` lines + STATUS line + 0/1/2 exit) → presentation .txt. The README adaptation guide names the battery as its Verify step.
- What does a leg consist of? A named check command run from the repo root, a judge that maps its output to pass/fail + human-readable repair commands, and SKIP semantics when a prerequisite leg failed.

## Questions Remaining

- What did packets 026/029 decide about check scope and placement (why a battery under `/doctor:` rather than inside the skill)?  → Iteration 2.
- What is sk-git's actual customization inventory and where does each value live? → Iterations 3-4.
- What do `git-standards.cjs` and `git-hook-gates.cjs` already cover, and how does `/doctor:git` route? → Iteration 4.

## Ruled Out

- Reading the full git-standards/git-hook-gates scripts this iteration — deferred to iteration 4 where they belong topically; `_routes.yaml` already fixed their contract surface.

## Dead Ends

- None. Every named file in the dispatch topic resolved.

## Edge Cases

- Ambiguous input: "the sk-code adaptation guide" has no literal filename; resolved to the README "What Adapting `sk-code` Looks Like" block because the 029/026 packets name that block as the guide (spec 005-external-user-guide §R9).
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none — all planned reads succeeded.

## Sources Consulted

- .skilled/commands/doctor/sk-code.md:1-61
- .skilled/commands/doctor/_routes.yaml:1-338
- .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:1-60
- .skilled/commands/doctor/assets/doctor-sk-code-presentation.txt:1-58
- .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:1-369
- README.md:1447-1491
- specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:60-95 (guide scope citation)

## Assessment

- `newInfoRatio`: `0.90`
- Novelty justification: 9 of 10 findings were fully new evidence (command/route/workflow/battery/presentation mechanics); finding 10 is partially new (the /doctor:git route rows were confirmed but their scripts are unread).
- Confidence: high — every claim is cited to a file:line read this iteration.

## Reflection

- Worked: reading the battery script whole gave the exact leg/judge/report contract rather than a paraphrase; `_routes.yaml` answered the placement question's "where would a new route go" before the question was formally reached.
- Did not work: nothing.
- Would do differently: nothing — order matched the topic's own sequencing.

## Recommended Next Focus

Iteration 2: the design rationale — `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build` and `029-surface-setup-build` packet specs, especially `029/002-doctor-sk-code-setup` (the battery's own packet) and the 028 research it builds on.
