---
title: "Research: surface setup hardening for external sk-code users"
description: "Two five-iteration cli-devin lineages and a five-agent verification fan-out on what still breaks the rule that only sk-code-opencode and sk-code-review matter to an external user, the setup journey from clone to a green battery, and a doctor command versus a sk-code hub mode."
trigger_phrases:
  - "surface setup hardening research synthesis"
  - "doctor sk-code setup"
importance_tier: "normal"
contextType: "research"
---
# Research: surface setup hardening for external sk-code users

## 1. Verdict

The rule holds where 025 to 027 put it: the scaffold places a new surface ahead of `sk-code-opencode`, check 5l reports a declared surface placed after it, and the README refresh-and-copy path makes a hand-added surface route first. The weak points sit around that core, on the way in and in what the battery can see.

1. **A fresh clone cannot reach a green battery by following the adapting block.** `parent-skill-check` and `ci-skill-root-metadata.cjs` fail on a missing `@spec-kit/shared` build before any adaptation, the second with a raw Node stack. One existing command fixes it, `worktree-naming.sh provision`, and no adapting doc names it for a clone (F1, F2). A clone also needs `skilled.trustRepoHooks` before the hooks that re-mint the manifest will run, and the block leaves that out (F3).
2. **The battery has two legs that cannot say what to do or cannot fail.** The guard's stale-manifest branch prints only `Re-mint: sk-code` (F5), and the last leg, the route probe, exits 0 on the legacy stub, so "each of these must exit 0" passes a hub that routes nothing (F7).
3. **The removal and add recipes miss three things the tree enforces.** Dead example paths in the hub's `graph-metadata.json` are pruned by a regenerator the block never names, while the block tells the user to fix them by hand (F16). A packet copied from an example, which the block invites, hits `MODE_LEAF_SET_COLLISION` against a `leaf-scopes.json` no doc names (F10). The feature catalog still presents the examples as live (F17).

**Doctor command versus hub mode: a doctor command.** Name it `/doctor:sk-code`, with one read-only target, `setup`, so the operator's `/doctor sk-code-setup` becomes `/doctor:sk-code setup`. A `sk-code-setup` mode is rejected: the registry admits only `workflow` and `surface` packets, and no setup prompt would route to it (section 5).

Nothing below re-recommends what 025, 026 or 027 shipped. Every F row was checked by the orchestrator with a file read or a command in its own throwaway copy.

---

## 2. Method

| Item | Value |
|------|-------|
| Workflow | `/deep:research :auto`, fan-out of two lineages, five iterations each, stop policy `max-iterations`, concurrency 2 (both lineages dispatched together each round) |
| Lineage `deepseek-max` | `cli-devin`, `deepseek-v4-1-flash-max`, `--permission-mode dangerous`, five iterations, all receipts exit 0 |
| Lineage `swe-max` | `cli-devin`, `swe-2-max`, `--permission-mode dangerous`, five iterations, all receipts exit 0; iteration 5 was cut at the 560 s limit after writing its narrative and delta, and the orchestrator recorded the leaf's own iteration record through the gateway |
| Fallback | None used; Devin never returned `resource_exhausted` |
| Verification fan-out | Five concurrent `cli-devin` `deepseek-v4-1-flash-max` agents, one area each (provisioning, compiled routing, doctor family, leftover references, scaffold and advisor), each writing a CONFIRMED or REJECTED table outside the repository |
| Orchestrator checks | Every F row reread at its cited line; six copy experiments under the scratchpad's `028/` folder (E1 fresh clone and provision, E2 hand-add then refresh and copy, E3 copied example, E4 undeclared name after opencode, E5 derived-metadata regeneration, E6 timed pristine battery) |
| Base | A full-tree APFS copy with provisioned `node_modules` and `specs/` holding only the compiled-routing closure; control battery green (parent-skill-check, guard, sync `--check`, drift guards all exit 0) |

---

## 3. Findings

Class: BREAK (the assumption still breaks), JOURNEY (friction on the clone-to-green path), AUTOMATION (a step tooling could absorb, or already does), SHAPE (doctor versus mode evidence), DOC (documentation that misleads), OK (checked and holds). Coverage names the 025 id or the 026/027 build when a row is not new.

| F | Class | Claim | Evidence | Coverage | Verdict | Lineage |
|---|-------|-------|----------|----------|---------|---------|
| F1 | JOURNEY | In a fresh clone (no `node_modules`), `parent-skill-check` exits 1 on `12-lib: ... Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'` and `ci-skill-root-metadata.cjs` exits 1 with a raw `MODULE_NOT_FOUND` stack that names no fix | `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65`; orchestrator E1: both exit 1; verifier V1.1 | NEW | CONFIRMED | swe-max |
| F2 | AUTOMATION | `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <clone>` turns that clone green: exit 0 (`6 installed, 3 built`), then both checks exit 0. Its usage calls it a worktree facility and the README names it only for worktrees, never in the adapting block's "Before you start" | `.skilled/skills/sk-git/scripts/worktree-naming.sh:581`; `README.md:1363`; `README.md:1449-1452`; E1 and V1.2 | NEW | CONFIRMED | swe-max |
| F3 | JOURNEY | Another clone runs the hooks only after `git config --local skilled.trustRepoHooks true`, so the commit-time re-mint never fires there; the adapting block's hook step does not say so | `README.md:203`; `README.md:1451`; V1.5 | NEW | CONFIRMED | swe-max |
| F4 | BREAK | Claim: deleting a `modes` entry leaves a sparse numerically keyed map that fails 3d, so the README step is ambiguous. Rejected: `modes` is a JSON array and a hand delete compacts it; only a script that uses `delete` leaves the `null` hole | `.skilled/skills/sk-code/mode-registry.json:22`; corrected by the same lineage in iteration 3; V5.3 | NEW | REJECTED | swe-max |
| F5 | BREAK | After a hand add, `compiled-route-guard.cjs` exits 1 with `stale-manifest` and its only fix text is `Re-mint: sk-code`, a verb with no command; the refresh-and-copy pair lives only in the README | `.skilled/bin/compiled-route-guard.cjs:174`; `README.md:1451`; E2: guard exit 1; V2.1, V2.4 | NEW | CONFIRMED | deepseek-max |
| F6 | BREAK | In the same stale state `compiled-route-sync.cjs --check` exits 0, because it compares served copies with authored copies, not with the hub | E2: sync exit 0; `.skilled/bin/compiled-route-sync.cjs:1035` | ALREADY-COVERED (025 F53, X17) | CONFIRMED | both |
| F7 | BREAK | The README battery's last leg, `compiled-route.cjs --prompt`, exits 0 while printing only `{"servingAuthority":"legacy","hubId":"sk-code"}`, so "each of these must exit 0" passes a hub that serves no compiled route; the stub itself is the designed fail-safe 025 kept | `README.md:1474`; E2 probe exit 0; V2.2 | NEW | CONFIRMED | deepseek-max |
| F8 | OK | Following the README refresh-and-copy step after a hand add brings guard and sync to exit 0 and routes a stack prompt with `action:"route"` and `targets[0]` the new surface | `README.md:1451`; E2: refresh exit 0, copy, guard 0, sync 0, `packetId":"sk-code-voltgrid"`; V2.3 | ALREADY-COVERED (025 F84, 026 R9) | CONFIRMED | deepseek-max |
| F9 | BREAK | Claim: after a complete hand add no tool mints the activation manifest, sync fails `MOVE-SIMULATION FAILED`, and the surface stays invisible. Rejected: `compiled-route-manifest.cjs refresh` mints it and the copy makes it serve (F8); the branch exists but did not fire in three independent runs | `.skilled/bin/compiled-route-sync.cjs:728-733`; E2; V2.3; deepseek-max iteration 5 | NEW | REJECTED | swe-max |
| F10 | BREAK | Copying an example packet as a model, which the block invites ("keep them as models"), makes `generate-leaf-manifest.cjs --write` exit 2 with `MODE_LEAF_SET_COLLISION ... give each mode its own leafScopes in leaf-scopes.json`; no README names `leaf-scopes.json` | `README.md:1447`; E3: exit 2, hash `9c4f5ae2a7c9`; V4.6 | NEW | CONFIRMED | deepseek-max |
| F11 | BREAK | A name placed after `sk-code-opencode` in `tieBreak` but absent from `mode-registry.json` passes 5l; only 5e fails, as a permutation extra with no tie-order hint | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171`; E4: `FAIL: 5e ... extras: [sk-code-ghost]`, `PASS: 5l`; V4.5 | NEW | CONFIRMED | deepseek-max |
| F12 | OK | A declared surface placed after `sk-code-opencode` fails 5l with the fix named, and 5l is FAIL by default (WARN only under `PARENT_HUB_CHECK_STRICT=0`) | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1173`; `.skilled/commands/doctor/scripts/parent-skill-check.cjs:185-188`; V4.5 | ALREADY-COVERED (027) | CONFIRMED | deepseek-max |
| F13 | DOC | `.hermes/skills/sk-code-obsidian/` and `sk-code-webflow/` exist in the tree, contradicting 025 F69's "no mirror files exist"; after removal `sync-skills-hermes.cjs --check` reports both STALE and a write run prunes them, which the README removal step already prescribes | `.hermes/skills/sk-code/SKILL.md:11`; `README.md:1463`; V4.1 | NEW | CONFIRMED | deepseek-max |
| F14 | OK | The six other runtime mirrors carry no example name: `rg` over `.opencode .claude .codex .cursor .devin .pi` returns no file | orchestrator `rg -l "sk-code-(obsidian\|webflow)"`, no hits; the one `sk-code-opencode` mention in those trees is a link at `.pi/extensions/README.md:172` | ALREADY-COVERED (025 F70) | CONFIRMED | deepseek-max |
| F15 | BREAK | A bare delete of both examples fails parent-skill-check with about 113 invariants, and 3c names the README block as the way to finish | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496`; deepseek-max iteration 2 copy run | ALREADY-COVERED (025 F14, 026 R3) | CONFIRMED | deepseek-max |
| F16 | AUTOMATION | After removal the hub's `graph-metadata.json` keeps 17 dead `key_files`/`source_docs` paths and one entity; `ci-skill-derived-freshness.cjs` reports it STALE and CI runs that gate, and `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` prunes them. The README instead says to fix `graph-metadata.json` from `verify-doc-claims` output, which does not read that file. The authored `causal_summary` still names the examples afterwards | `README.md:1462`; `.github/workflows/routing-registry-drift.yml:203`; `.skilled/skills/sk-code/graph-metadata.json:282`; E5: `STALE sk-code: key_files: pruned 10 ... source_docs: pruned 7 ... entities: pruned 1` | NEW | CONFIRMED | deepseek-max |
| F17 | DOC | The sk-code feature catalog presents both examples as live surfaces; the removal recipe never names it and no gate compares it with the registry | `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:15`; `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:35`; `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:26`; V4.3 | NEW | CONFIRMED | deepseek-max |
| F18 | OK | 21 playbook files name the examples, and removal step 6 already names those scenarios and their rows | `README.md:1461`; orchestrator `rg -l` count 21 | ALREADY-COVERED (026 R9) | CONFIRMED | deepseek-max |
| F19 | DOC | After an add, `verify-doc-claims` flags the surface count in `shared/references/phase-detection.md:16`, `README.md:23` and `SKILL.md:40`; the add steps name `stack-detection.md` but not these, though the Verify step's drift guards list them | `.skilled/skills/sk-code/shared/references/phase-detection.md:16`; `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:46`; `README.md:1470`; V4.4, V5.6 | NEW | CONFIRMED | swe-max |
| F20 | AUTOMATION | The 5k-canary leg reports only router-signal modes no case routes to; cases that name a removed mode never fail it, so canary cleanup on removal is a documented step, not a gate | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1252-1261`; V4.7 | NEW | CONFIRMED | deepseek-max |
| F21 | SHAPE | Only two of the six README battery commands have a doctor route (`/doctor:skill-advisor parent-skill`); the guard runs only inside `/doctor:update apply`; sync `--check` and the drift guards run under no doctor command | `.skilled/commands/doctor/_routes.yaml:140-153`; `.skilled/commands/doctor/assets/doctor-update-apply.yaml:159`; V3.2 | NEW | CONFIRMED | both |
| F22 | SHAPE | A doctor target is added by a documented recipe (append a route, list it in the router and presentation, rerun `route-validate.sh`), and the validator enforces a read-only route's YAML declaring no write (K1) | `.skilled/commands/doctor/_routes.yaml:35-36`; `.skilled/commands/doctor/scripts/route-validate.sh:189-190`; V3.1, V3.7 | NEW | CONFIRMED | deepseek-max |
| F23 | SHAPE | The doctor family is "one per owner" and `/doctor:skill-advisor` is scoped to routing, the skill graph and parent-skill structure, so a sk-code setup battery belongs to its own command | `.skilled/commands/README.txt:157`; `.skilled/commands/README.txt:162`; V3.4 | NEW | CONFIRMED | swe-max |
| F24 | SHAPE | A hub mode cannot hold setup: `packetKind` is only `workflow` (acts on code) or `surface` (read-only evidence); hub-identity vocabulary scores zero modes and defers; doctor dispatch is menu or argv driven, so neither shape gains advisor reach | `.skilled/skills/sk-code/mode-registry.json:8`; `.skilled/skills/sk-code/hub-router.json:17-18`; `.skilled/commands/doctor/_routes.yaml:17-20`; V3.5, V3.6 | NEW | CONFIRMED | both |
| F25 | SHAPE | The sk-code hub has no `/doctor:` reference today; its README has a VERIFICATION section that a doctor command row fits | `.skilled/skills/sk-code/README.md:116-122`; orchestrator `rg -n "/doctor:"` over SKILL.md, README.md, ROUTER.md, no hits; V3.8 | NEW | CONFIRMED | deepseek-max |
| F26 | AUTOMATION | The add path is `/create:skill-parent update --surfaces` in an AI runtime: its Phase 0 requires the `@markdown` agent, and the README offers no terminal path; the mutations themselves are mechanical apart from authoring routing vocabulary | `.skilled/commands/create/assets/create-skill-parent-auto.yaml:14-23`; `README.md:1468`; V5.1 | ALREADY-COVERED (025 F78, X8, X11) | CONFIRMED | swe-max |
| F27 | OK | The scaffold's completion report names the canary and re-mint follow-ups, and names none of `verify-doc-claims`, `phase-detection.md` or `leaf-scopes.json` | `.skilled/commands/create/assets/create-skill-parent-auto.yaml:500-501`; V5.2 | ALREADY-COVERED (026 R8) | CONFIRMED | swe-max |
| F28 | OK | Surfaces are advisor-invisible by contract; the advisor routes the single identity `sk-code`, so `sk-code-opencode` cannot steal a stack prompt at advisor level; a verifier measured `sk-code` at 0.82 for a Rails prompt with and without added keywords | `.skilled/skills/sk-code/mode-registry.json:5`; V5.4 (the orchestrator's own advisor probe could not bind a socket under the scratchpad's long path) | NEW | CONFIRMED | swe-max |
| F29 | OK | R5's cost is inside the hub only: every routerSignal weighs 4, `code-opencode-runtime` carries typescript, python, shell and json, and a tie goes to the `tieBreak` order, so a user surface ahead of opencode wins; the pristine tree defers a generic backend prompt such as "add a postgres migration for users" | `.skilled/skills/sk-code/hub-router.json:7`; `.skilled/skills/sk-code/hub-router.json:83`; E6: `"action":"defer"` | ALREADY-COVERED (025 R5, 027) | CONFIRMED | swe-max |
| F30 | OK | The pristine six-command battery runs green in about 15 s | `README.md:1476-1483`; E6: six exits 0, `real 0m15.306s` | NEW | CONFIRMED | deepseek-max |
| F31 | OK | The sk-code benchmark tree is a retired frozen lane and cannot fail on a removal | `.skilled/skills/sk-code/benchmark/README.md:13`; deepseek-max iteration 2 | NEW | CONFIRMED | deepseek-max |
| F32 | JOURNEY | With hooks installed, a commit after an add blocks at `gate:mirror-parity` until the Hermes copies are refreshed, and the gate names the command; the README orders the Hermes refresh before the commit | `.skilled/scripts/git-hooks/pre-commit:254`; `README.md:1472`; deepseek-max iteration 5 copy run | NEW | CONFIRMED | deepseek-max |

---

## 4. The external user's journey, clone to green

Observed in fresh-clone simulations (E1, swe-max iterations 1 and 3) and provisioned copies (E2 to E6).

| Step | What happens today | Friction | Finding |
|------|--------------------|----------|---------|
| 1. `git clone` | Tracked files only | None | |
| 2. Run any battery command | `parent-skill-check` and `ci-skill-root-metadata.cjs` exit 1 on a missing build; the second prints a raw stack | The block's "Before you start" names no install step; README section 4 lists a manual subset | F1, F2 |
| 3. Install hooks | Hooks install, but do not run in a clone until it is trusted | `trustRepoHooks` is outside the block | F3 |
| 4. Remove the examples | The recipe works; the Hermes, playbook and canary steps are covered | The graph-metadata step points at the wrong tool; the feature catalog is not listed | F13, F16, F17, F18 |
| 5. Add a surface | AI-runtime command only; copying an example as a model collides | `leaf-scopes.json` unnamed; surface-count files unnamed | F10, F19, F26 |
| 6. Refresh or commit | Hand refresh-and-copy works; commit works once Hermes is synced | Guard says `Re-mint: sk-code` without a command | F5, F8, F32 |
| 7. Verify | Six commands, about 15 s | The probe leg exits 0 on the legacy stub; sync is green while the guard is red | F6, F7, F30 |

---

## 5. Doctor command versus hub mode

**Answer: a new doctor command, `/doctor:sk-code`, with one read-only target, `setup`.** It turns the operator's `/doctor sk-code-setup` into the family's own grammar (`/doctor:<owner> <target>`), and the owner is the sk-code hub, which the "one per owner" rule asks for (F23).

| | Doctor command `/doctor:sk-code setup` | Hub mode `sk-code-setup` |
|---|---|---|
| Fits the contract | Yes: a documented add recipe and a validator that enforces read-only routes (F22) | No: `packetKind` is `workflow` or `surface`, and setup is neither (F24) |
| Reachable by the user | Typed directly, listed in the doctor menu, named in the README block | No setup prompt routes to it; hub-identity words defer and the advisor sees only `sk-code` (F24) |
| What it runs | The six README legs in order, plus the derived-metadata freshness gate and a provisioning precheck, and it asserts the probe returned `action:"route"` rather than exit 0 | Nothing a mode can run: surfaces are read-only evidence, workflow modes act on code |
| Writes | None. It prints the repair command for each failing leg | Not applicable |
| Files | `.skilled/commands/doctor/sk-code.md`, a `_routes.yaml` row, `assets/doctor-sk-code-setup.yaml` and its presentation file, the doctor index in `.skilled/commands/README.txt:46`, `:102`, `:157-169`; runtime mirrors sync by script | 15 or more: registry, router, leaf manifest, ROUTER.md, SKILL.md, canary and authored twin, re-mint, metadata, playbook, plus a third `packetKind` |
| Referenced from | The README block's Verify step (`README.md:1474`), the sk-code README VERIFICATION table (`.skilled/skills/sk-code/README.md:116-122`), and the hub's surface-list sentence (`.skilled/skills/sk-code/SKILL.md:40`) | The SKILL.md mode table, where it would mislead |
| Blast radius | The doctor family and one index file | Every routing gate of the hub |

Names weighed: `/doctor:sk-code setup` (chosen); `/doctor:skill-advisor surface-setup` (wrong owner, F23, and a name the external user would never guess); `/doctor:sk-code surfaces` (narrower than what it checks, since it also covers provisioning); `sk-code-setup` as a mode (rejected, X1).

Why build it at all, under the restraint rule: the failures it prevents are F5 (the guard names no command), F7 (the last leg cannot fail) and F16 (the derived-metadata gate is in CI but not in the battery). Fixing the README alone fails F7, because a human must still read the probe output, and does not reach a user who starts from a failing check. Extending the existing `parent-skill` target fails because its contract is a structural audit, and compiled-routing failures would report under that name (X3).

---

## 6. Ranked recommendations

| R | Recommendation | Failure it prevents today | Smallest change and target files | Cheaper move and why it fails | Verdict | Coverage |
|---|----------------|---------------------------|-----------------------------------|-------------------------------|---------|----------|
| R1 | Add two "Before you start" lines to the adapting block: run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` after a clone, and set `git config --local skilled.trustRepoHooks true` in a clone that should run the hooks | F1, F3: every battery leg that loads the contract library is red on a fresh clone, one with a raw stack, and the re-mint hook never runs in a clone | Two list items at `README.md:1449-1452`; optionally retitle the usage line at `.skilled/skills/sk-git/scripts/worktree-naming.sh:581` so it does not read as worktree-only | Building nothing fails (E1: exit 1); pointing at README section 4 fails because its four manual steps are a subset of the provision list (F2) | Recommend | NEW |
| R2 | Make the guard's stale-manifest line name the commands: the `compiled-route-manifest.cjs refresh` call and the copy to the authored path, or "commit with the hooks installed" | F5: a user whose guard is red after an add reads `Re-mint: sk-code` and nothing else | One output string at `.skilled/bin/compiled-route-guard.cjs:174`, plus its test | The README already holds the commands (`README.md:1451`), but a user starting from the failing output never sees them; 026 R3 fixed the authored-drift line, not this branch | Recommend | NEW |
| R3 | Add `/doctor:sk-code` with a read-only `setup` target that runs the six README legs plus `ci-skill-derived-freshness.cjs` and a provisioning precheck, asserts the probe's `action` is `route`, and prints one repair command per failing leg | F7, F16, and the six-command copy-paste: the last leg passes a hub that routes nothing, and the derived-metadata gate CI runs is missing from the user's battery | New `.skilled/commands/doctor/sk-code.md`, a route row in `.skilled/commands/doctor/_routes.yaml`, `assets/doctor-sk-code-setup.yaml` with presentation, index rows at `.skilled/commands/README.txt:46`, `:102`, `:157-169`, and one reference each at `README.md:1474`, `.skilled/skills/sk-code/README.md:116-122` and `.skilled/skills/sk-code/SKILL.md:40` | A target under `/doctor:skill-advisor` fails the one-per-owner rule (F23); folding the legs into `parent-skill` changes that route's contract (X3); a README-only fix leaves F7 to a human reading JSON | Recommend | NEW |
| R4 | Correct the adapting block where the tree disagrees: step 7 runs `regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write` for `graph-metadata.json` and keeps a hand edit only for `causal_summary`; step 6 adds the feature catalog; the add steps name `leaf-scopes.json` for a packet copied from an example and the surface-count files `verify-doc-claims` lists | F16, F17, F10, F19: the user is sent to the wrong tool, misses a stale catalog, and meets a collision against a file no doc names | Line edits in `README.md:1461-1462` and `README.md:1466-1472` | Making `verify-doc-claims` read `graph-metadata.json` duplicates the regenerator and its CI gate; a new gate for the catalog costs a check for one prose file | Recommend | NEW |
| R5 | Give the contract-library load a named failure: when `@spec-kit/shared` cannot be resolved, print the provision command instead of a stack | F1's raw stack in `ci-skill-root-metadata.cjs`, the one battery state that names no fix | One guarded `require` at `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65`, plus one test | R1 and R3 cover a user who reads the block or runs the doctor; a user or script that calls the checker directly still gets the stack | Recommend, lowest rank | NEW |

Already shipped and not repeated: scaffold placement ahead of opencode (025 R1, 026), example-tolerant drift guards (R2, 026), doctor, guard and sync messages on the covered branches (R3, R7, 026), the scaffold handoff (R8, 026), the example markers and the README block (R4, R9, 026), check 5l (027).

---

## 7. Rejected ideas

| X | Idea | Evidence | Reason |
|---|------|----------|--------|
| X1 | A `sk-code-setup` hub mode | `.skilled/skills/sk-code/mode-registry.json:8`; `.skilled/skills/sk-code/hub-router.json:17-18` | Setup is neither a workflow nor a surface, no setup prompt routes to it, and it costs 15 or more files plus a contract change (F24) |
| X2 | A `surface-setup` target under `/doctor:skill-advisor` | `.skilled/commands/README.txt:157`; `.skilled/commands/README.txt:162` | Wrong owner under the one-per-owner rule, and a name an external user would not find (F23) |
| X3 | Extending the existing `parent-skill` route with the battery | `.skilled/commands/doctor/_routes.yaml:140-153` | Its contract is a structural audit; compiled-routing and drift failures would report under that name and change what a passing `parent-skill` means |
| X4 | Mutating repairs inside the doctor command (provision, refresh and copy, Hermes sync, leaf regeneration) | `.skilled/commands/doctor/scripts/route-validate.sh:189-190` | A read-only route may not write (K1), the collision repair needs an authored `leaf-scopes.json`, and printing the exact command is enough once R2 and R3 name it |
| X5 | Teaching 5l to flag an undeclared name after `sk-code-opencode` | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171` | 5e already fails that state loudly (F11), and an undeclared name cannot route at all |
| X6 | A terminal script that removes or adds a surface | `.skilled/commands/create/assets/create-skill-parent-auto.yaml:14-23` | 025 X11 stands: after the registry scrub, the ROUTER.md map, prose and vocabulary need judgment; a second mutation path serves one caller class |
| X7 | Minting the activation manifest inside `update --surfaces` | `.skilled/scripts/git-hooks/pre-commit:207` | 025 X14 stands: the commit hook and the README pair already mint it (F8), and the command would gain a dependency on the authored closure |
| X8 | Naming a fix on the `MOVE-SIMULATION FAILED` branch of sync | `.skilled/bin/compiled-route-sync.cjs:728-733` | No caller reached it in three add runs (F9); its trigger is a serving path under `.opencode/specs` or an unresolved closure, not a surface add |
| X9 | Documenting a re-key of `modes` after a delete | `.skilled/skills/sk-code/mode-registry.json:22` | `modes` is an array; a hand delete is already correct (F4) |
| X10 | Changing sk-code-opencode's generic keywords | `.skilled/skills/sk-code/hub-router.json:83` | Operator ruling R5; the cost is confined to ties and a user surface placed ahead wins them (F29) |
| X11 | Making the advisor aware of individual surfaces | `.skilled/skills/sk-code/mode-registry.json:5` | No failure: the advisor already routes stack prompts to `sk-code` and the hub picks the surface (F28) |

---

## 8. Proposed build phases

| P | Phase | Recommendations | Files | Phase gate | Depends on |
|---|-------|-----------------|-------|------------|------------|
| P1 | Clone path and message fixes | R1, R2, R4, R5 | `README.md:1449-1452`, `:1461-1462`, `:1466-1472`; `.skilled/bin/compiled-route-guard.cjs:174`; `root-router-contract.cjs:65`; their tests | In a fresh clone, following only the block reaches a green battery; the guard's stale line names the commands; an unprovisioned checker prints the provision command | None |
| P2 | `/doctor:sk-code setup` | R3 | `.skilled/commands/doctor/sk-code.md`, `_routes.yaml`, `assets/doctor-sk-code-setup.yaml` and presentation, `.skilled/commands/README.txt`, three reference lines | `route-validate.sh` exit 0; the target exits 0 on a pristine copy and reports each failing leg with its repair command after a hand add | P1 for the repair texts it prints |

#### Goal sketch: P1

**Objective:** An external user who clones the repository and follows only the README adapting block reaches a green battery, and every failure on the way names its fix.

- In a fresh-clone copy, the provision command in the block exits 0, then `parent-skill-check.cjs .skilled/skills/sk-code` and `ci-skill-root-metadata.cjs` exit 0.
- In a copy with a hand-added surface, `compiled-route-guard.cjs` exits 1 and prints the refresh command and the authored copy path.
- In an unprovisioned clone, `ci-skill-root-metadata.cjs` exits 1 with one line naming the provision command and no stack.
- `grep -c "regenerate-skill-derived" README.md` prints 1 or more and `grep -c "leaf-scopes.json" README.md` prints 1 or more.
- `validate.sh <phase folder> --strict` prints RESULT: PASSED.

#### Goal sketch: P2

**Objective:** One read-only doctor command runs the external user's verify battery and names the repair for each failing leg.

- `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the `/doctor:sk-code` `setup` route present.
- On a pristine copy the `setup` target reports every leg passing; after a hand add without a refresh it reports the stale guard leg with the refresh command and fails the probe assertion on the legacy stub.
- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` and `command-catalog-mirror-check.cjs` exit 0.
- `grep -c "/doctor:sk-code" README.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/SKILL.md` prints 1 or more for each file.
- `validate.sh <phase folder> --strict` prints RESULT: PASSED.

---

## 9. Where the lineages disagreed

| Point | deepseek-max | swe-max | Ruling and evidence |
|-------|--------------|---------|---------------------|
| Does a hand-added surface become routable | Yes, after refresh and copy (iteration 5) | No tool mints the manifest; the surface stays invisible (iteration 4, P0) | deepseek-max: E2 and V2.3 route the stand-in first (F8, F9) |
| `modes` shape | Not raised | Numerically keyed map (iteration 1), corrected to array (iteration 3) | Array, `.skilled/skills/sk-code/mode-registry.json:22` (F4) |
| Doctor target owner | Standalone `/doctor:sk-code` (iterations 3, 4) | Target under `/doctor:skill-advisor` (iterations 2, 4), then `/doctor:sk-code setup` (iteration 5) | `/doctor:sk-code setup`, by the one-per-owner rule (F23) |
| Bare delete versus the drift guards | Guards fail after a bare delete, read as contradicting 026's tolerance | Not raised | Consistent: the tolerance covers the documented removal, not a bare `rm` (F15) |

---

## 10. Eliminated Alternatives

Section 7 holds the rejected ideas. Directions the lineages closed without a row: a repository-wide name grep (dominated by spec archives), and rerunning the provisioned copy for the clone journey (it hides the provisioning gap).

## 11. Divergence Map

No divergent pivots ran (convergence mode `default`, stop policy `max-iterations`). Saturated directions: none recorded. Remaining frontier: which of the ten provision roots the two failing checks need, and the README-manifest refresh on the add leg; neither changes a recommendation.

## 12. Open Questions

- Whether `/doctor:sk-code setup` should also run `test_readme_manifest.py` in check mode; decide while building P2.
- The orchestrator's own advisor probe could not bind a socket under the scratchpad's long path; F28 rests on the contract line and a verifier's run.

## 13. Convergence Report

- Stop reason: maxIterationsReached (stop policy `max-iterations`)
- Total iterations: 10 (five per lineage)
- Questions answered: Q1 to Q6, in sections 3 to 7
- newInfoRatio by iteration: deepseek-max 0.33, 0.87, 0.72, 0.9, 0.79; swe-max 0.6, 0.7, 0.9, 0.75, 0.4
- Convergence threshold: 0.05
