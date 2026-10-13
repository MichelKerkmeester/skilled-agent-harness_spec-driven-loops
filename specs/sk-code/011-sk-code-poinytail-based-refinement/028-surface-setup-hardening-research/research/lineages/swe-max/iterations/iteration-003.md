# Iteration 3: The fresh-clone provisioning gap has an existing one-command fix — and the mode-registry shape claim was wrong

## Focus

Dispatch focus: (a) find every existing provisioning entry point a new user could run after `git clone` and test in a fresh-clone simulation whether one command brings `parent-skill-check` and `ci-skill-root-metadata.cjs` to exit 0; (b) classify each mechanical step of the README's REMOVE leg (README.md:1454-1464) as scriptable-without-judgment or needs-judgment, naming the file:line that would own the script; (c) verify iteration 1's claim that `mode-registry.json` `modes` is a numerically keyed object and whether any doctor message names the re-keying.

## Actions Taken

Copy path (fresh-clone recipe): `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/swe-max-i3-BlBc/x` (`git clone -q <base>` into mktemp subdir; tracked files only, no `node_modules`).

1. Enumerated provisioning surfaces: `ls .skilled/scripts .skilled/bin` (no provision script under either; `install-git-hooks.sh`, `worktree-*.sh`, `compiled-route-*.cjs` only), root `package.json` does not exist (no npm-scripts entry point), grep `provision` over `.skilled/{bin,scripts,skills/sk-git}` located `worktree-naming.sh provision [dir]` (worktree-naming.sh:515-559, usage :581) driven by `worktree-provision-paths.txt`.
2. Read `worktree-provision-paths.txt` (45 lines): lists `.`, `.skilled`, `system-spec-kit`, `system-spec-kit/shared`, `system-spec-kit/runtime` (build `dist/api/index.js`), `runtime/cli` (build `dist/continuity/generate-context.js`), `system-skill-advisor/runtime` (build `dist/runtime/lib/policy-plan.js`), `system-deep-loop`, `system-deep-loop/runtime`, `sk-doc` — install order, `npm ci` when a lockfile exists (worktree-naming.sh:533-535).
3. In the clone ran `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision "$PWD"` → `provisioning .skilled (ci)` … `provisioned: 6 installed, 3 built, 3 already present, 0 failed`, **PROV_EXIT=0**.
4. Re-ran the battery legs that failed in iteration 1: `parent-skill-check .skilled/skills/sk-code` → **PSC=0** (`all hard invariants passed, 0 warnings`); `ci-skill-root-metadata.cjs` → **CIM=0** (`checked=14 passed=14 failed=0`); `compiled-route-guard.cjs` → **GRD=0** (`All hubs fresh or excused`).
5. Verified shape claim: `mode-registry.json:22` is `"modes": [` — a JSON **array** of objects, not a numerically keyed map; check 3d iterates `ctx.rawModes.forEach` and reports `modes[i] is not an object` (parent-skill-check.cjs:767-770). Grep found no doctor message naming re-keying, splicing, or dense indices.

## Findings

| class | claim | evidence | coverage | severity |
|---|---|---|---|---|
| AUTOMATION | The provisioning gap iteration 1 scored P0 is closed by one existing command: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <dir>`. On a true `git clone` (no node_modules, no dist) it exits 0 (6 installed, 3 built), after which `parent-skill-check`=0, `ci-skill-root-metadata`=0 (14/14), `compiled-route-guard`=0. It is idempotent (worktree-naming.sh:516-517), uses `npm ci` under lockfiles (:533-535), and covers ten roots including `.` and `.skilled` (worktree-provision-paths.txt:15,18) that README §4's four manual steps (README.md:169-178) never install. | clone run: `PROV_EXIT=0`, `PSC=0`, `CIM=0`, `GRD=0` in `runs/swe-max-i3-BlBc/x`; worktree-naming.sh:515-559, :581; worktree-provision-paths.txt:1-45; README.md:164-183 | NEW (iteration 1 found the gap and no entry point; this verifies the entry point end-to-end on the real clone path) | P1 |
| DOC | The provisioner is documented only as a worktree facility: its usage line reads `provision [dir]  Install the dependency trees a worktree needs` (worktree-naming.sh:581), the narrative is sk-git's worktree bullet (SKILL.md:296), and neither README §4 (README.md:164-183) nor the adapting block's "Before you start" (README.md:1449-1452) names it — §4 teaches four npm commands that are a strict subset of what `provision` runs. An external user has no path to discovering the one command that fixes their clone. | worktree-naming.sh:581; .skilled/skills/sk-git/SKILL.md:296; README.md:164-183, :1449-1452 | NEW | P1 |
| BREAK | Correction to iteration 1 finding 3: `modes` is an **array** (`"modes": [` mode-registry.json:22), not a numerically keyed object — `Object.keys()` returns `'0'..'4'` on an array identically, so iteration 1's shape claim was wrong. The observed `3d: modes[2] is not an object (got null)` came from `delete arr[i]` leaving a hole that `JSON.stringify` serializes as `null`. A user hand-editing the JSON, or running `jq 'del(.modes[2])'` (which compacts), never produces `null`; README step 2's "delete the mode's `modes` entry" (README.md:1457) is unambiguous for hand edits. The residual doc gap is smaller than scored: it matters only for programmatic removal (a script must splice, not `delete`). | mode-registry.json:22-40; parent-skill-check.cjs:767-770; README.md:1457; iteration-001.md finding 3 vs its own `Object.keys` evidence | NEW (corrects iteration 1; 025 F61 had no shape claim to supersede) | P1 |
| DOC | No doctor message names re-keying or splicing: check 3d reports the defect (`modes[${index}] is not an object (got ${describeJson(mode)})`, parent-skill-check.cjs:769) and nothing more. Under the corrected array shape, a `null` element only arises from a programmatic `delete` — i.e., the one producer of this failure is future automation, which should splice instead; the doctor message would then never fire for users at all. | parent-skill-check.cjs:767-770 (no re-key/dense/sparse wording anywhere in the file) | NEW | P2 |
| AUTOMATION | REMOVE leg classification (README.md:1454-1464), per step: **scriptable without judgment** — step 1 `rm -rf` the packet dir (:1456, owner: none today; trivial); step 2 registry+router scrub (:1457, delete named keys from `modes[]`, `extensions.surface-axis.surfaces`, `routerPolicy.tieBreak`, `routerSignals`, two `vocabularyClasses`; owner: none — a `.skilled/bin/` sibling of `compiled-route-manifest.cjs`, and it must **splice** the array per the correction above); step 3 `generate-leaf-manifest.cjs --write` (:1458, already a script); step 8 `test_readme_manifest.py --write` + `sync-skills-hermes.cjs` (:1463, already scripts); step 9 manifest refresh + copy (:1464, `compiled-route-manifest.cjs refresh --hub sk-code` + `cp`, already named verbatim); **mixed** — step 4 ROUTER.md §11 (:1459: deleting `RESOURCE_MAP` paths under `<mode>/` and now-empty keys is mechanical; "trim the prose map rows and sections above" needs judgment); step 5 SKILL.md/stack-detection.md/README lines (:1460: deleting lines that name the mode is mechanical; prose edits need judgment); step 6 fixture/scenario removal (:1461: named-file deletion scriptable; "delete or adjust" and canary authored-twin copy mechanical but multi-path); **needs judgment** — step 7 `verify-doc-claims` fixes (:1462: running it is scripted; dead-path deletion is mechanical, stale-count/prose repair is judgment). Net: ~5 of 9 steps are pure script execution or mechanical deletion; the only missing *machinery* is one scrub script owning steps 1-2 plus the mechanical half of 4-6 — the rest is sequencing already-named commands. | README.md:1454-1464; existing script paths cited in-line; `compiled-route-manifest.cjs` at `.skilled/bin/compiled-route-manifest.cjs` | NEW detail (iteration 2 classified the ADD leg; the REMOVE leg's per-step split was never recorded) | P1 |
| OK | Post-provision the clone's full baseline battery is green without any adaptation edits — confirming the iteration-1 failures were provisioning-only, and `provision` (not content changes) is the missing step. | clone run exits: PSC=0, CIM=0, GRD=0; iteration-001.md baseline PSC=1/CIM=1 | partially new (extends iteration 1's baseline after the fix) | P2 |

## Options and Recommendations

| option | what it changes | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| Point the adapting block and §4 at `worktree-naming.sh provision <dir>` as the clone provisioning step | README.md:1449-1452 and/or README.md:164-183, ~2 lines naming the existing command | Iteration-1 P0: fresh-clone `parent-skill-check`/`ci-skill-root-metadata` fail with a raw module-not-found crash; verified fixed by this command this iteration | Doc-only, zero blast radius | Keeping the four manual npm steps (README.md:169-178): they omit the `.` and `.skilled` roots the paths file lists (worktree-provision-paths.txt:15,18) and diverge on `install` vs `ci`; a parallel manual list rots against the maintained path list |
| A remove-surface scrub script (e.g. `.skilled/bin/sk-code-remove-surface.cjs`) owning README steps 1-2 + mechanical halves of 4-6: splice `modes[]`, drop named keys from `extensions.surface-axis.surfaces`, `tieBreak`, `routerSignals`, the two named `vocabularyClasses`; delete the packet dir and named fixtures; then invoke the existing generators (leaf manifest, activation refresh, readme manifest, hermes sync) | new file beside `.skilled/bin/compiled-route-manifest.cjs`; README step list shrinks to "run it, then fix prose" | The iteration-1 evidence: following the manual recipe produced a 97-problem ROUTER.md failure and a 258-problem doc-claims failure; a script also prevents the `delete`-vs-splice `null` failure automation would otherwise produce | One script + its own battery leg; blast radius contained to deletions of paths it enumerates | Extending `/create:skill-parent` with a remove leg fails: its Phase 0 requires the `@markdown` agent inside an AI runtime (create-skill-parent-auto.yaml:14-23), unreachable by the shell-only evaluator — the same hard wall iteration 2 recorded for the add leg. A jq one-liner in the README fails on `hub-router.json`'s named-class indirection and the fixture copy step |
| Doctor-side pointer: when `parent-skill-check`/`ci-skill-root-metadata` fail on `Cannot find module '@spec-kit/shared/…'`, print `run: bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision` | the require-time failure path (root-router-contract.cjs:65 load site) | The raw-crash P0 from iteration 1 survives as a UX gap even with the README line, for users who run doctor before reading install docs | Small: one catch-and-advise around the contract load | Only fixing the README fails for the doctor-first user; wrapping the require is cheap and names the verified fix |

Rejected this iteration: (a) relaxing check 3d for sparse keys — moot under the array shape and would weaken a real corruption signal; (b) a `remove` mode inside `/create:skill-parent` — AI-runtime-gated, fails the shell-only user (Q5 evidence); (c) hand-rolled `jq` snippets in README — no single line covers both registries plus fixture twin copy.

## SCOPE VIOLATIONS

None. All mutation experiments ran inside the throwaway clone `runs/swe-max-i3-BlBc/x`; the worktree was only read.

## Questions Answered

- Dispatch (a): yes — `worktree-naming.sh provision <dir>` brings `parent-skill-check` and `ci-skill-root-metadata` to exit 0 on a true clone (verified: PSC=0, CIM=0, GRD=0).
- Dispatch (b): classified — ~5 of 9 remove steps pure-scriptable, 3 mixed, 1 judgment; only missing machinery is one registry/router/fixture scrub script.
- Dispatch (c): verified — `modes` is an array, not a numerically keyed object; no doctor message names re-keying.
- Strategy questions: none ticked — Q1's fresh-clone leg advanced but advisor-graph/canary/catalog legs remain; Q5 gained two rejections but is not exhausted.

## Questions Remaining

- Q1 legs unprobed this iteration: skill-advisor graph metadata/scorer boosts, Hermes copies, runtime mirrors, canary/benchmark/catalog surfaces under hand edits.
- Whether the `.` and `.skilled` provision roots are individually required for the failing checks, or only for test/conformance paths (the battery passed after full provision; the subset was not isolated).
- `sync-skills-hermes.cjs` / `test_readme_manifest.py` behavior on the add leg (carried from iteration 2's dead end — not retried, still unobserved).

## Sources Consulted

- `worktree-naming.sh:397-425, 515-559, 578-612` (provision command, usage, ci/install mode selection)
- `worktree-provision-paths.txt:1-45` (ten provision roots + build outputs)
- `.skilled/skills/sk-git/SKILL.md:296` (worktree-only documentation of provision)
- `README.md:154-214` (§4 install/hooks), `README.md:1445-1485` (adapting block, remove leg :1454-1464)
- `.skilled/skills/sk-code/mode-registry.json:22-40` (modes array shape)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:767-770, 1537-1548` (3d message; manifest modes[] wording)
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:14-23` (Phase-0 agent gate, cited for the rejected option)
- Clone run `runs/swe-max-i3-BlBc/x`: `worktree-naming.sh provision` exit 0; `parent-skill-check` exit 0; `ci-skill-root-metadata` exit 0; `compiled-route-guard` exit 0
- `.skilled/bin` and `.skilled/scripts` directory listings; root `package.json` absent

## Assessment

- New information ratio: 0.9 — 5 fully new findings (verified one-command provisioner, modes-array correction, remove-leg split, provisioner discoverability, 3d-no-fix-message), 1 partially new (post-provision green baseline).
- Questions addressed: dispatch (a)/(b)/(c) in full; strategy Q1 fresh-clone leg, Q3 remove-leg evidence, Q5 rejections, Q6 classification per row.
- Questions answered: none marked at strategy level (partial legs only).

## Reflection

- What worked: the dispatch hint "the worktree provisioning that printed 'provisioning .skilled (ci)'" led straight to `worktree-naming.sh`; running it on a *true clone* rather than a worktree proved the fix transfers — one command replaced README §4's four.
- What did not: iteration 1's `Object.keys(mr.modes)` evidence was shape-ambiguous (arrays and maps read identically); this iteration's read of the file itself corrected it. Lesson: verify JSON container types by looking at the literal, not via JS key enumeration.
- What I would do differently: isolate which provision roots the two failing checks actually need (binary-search the paths list) if a future iteration wants the minimal provisioning claim.

## Recommended Next Focus

Q1 residual, non-clone legs: hand-edit blast radius on `hub-router.json`/`mode-registry.json` beyond tie order (e.g., a malformed `routerSignals` class or a renamed `workflowMode`) and whether compiled-route-guard/parent-skill-check name the fix for each; plus the still-unobserved `sync-skills-hermes.cjs` and `test_readme_manifest.py` legs.
