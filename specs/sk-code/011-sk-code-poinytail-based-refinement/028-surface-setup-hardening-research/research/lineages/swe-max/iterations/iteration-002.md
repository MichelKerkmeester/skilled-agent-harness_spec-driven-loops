# Iteration 2: Add-surface leg — what /create:skill-parent automates, what the battery catches, and doctor coverage

## Focus

Q2 add leg + Q3 + Q4 evidence. In a provisioned copy (node_modules present), simulated exactly what `/create:skill-parent update --surfaces mystack` writes — packet scaffold, `mode-registry.json` entry, `hub-router.json` routerSignals/vocabularyClasses/tieBreak placement ahead of `sk-code-opencode`, and `generate-leaf-manifest.cjs --write` (step_4's own generator call, create-skill-parent-auto.yaml:433) — deliberately skipping the README's hand-follow-ups (symlinked references, ROUTER.md §11 maps, stack-detection markers, canary case, description.json keywords, hub SKILL.md mode-table row) to observe what the battery catches and whether each failure names its fix. Also classified which workflow steps a terminal-only user could run as scripts vs which need an AI, and mapped doctor-family coverage of the six-command verify battery.

Copy path (provisioned recipe): `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/swe-max-i2-6L2e` (`cp -cR` of the prepared base; ~25 s).

## Actions Taken

1. Read `.skilled/commands/create/skill-parent.md` (113 lines) and `assets/create-skill-parent-auto.yaml` (609 lines) — full workflow contract.
2. Read `.skilled/commands/doctor/_routes.yaml` (321 lines) — every doctor route's `script_invocations`; read `assets/doctor-update-apply.yaml:130-189` — the post-apply battery.
3. In the copy: dumped `mode-registry.json` modes (keys '0'-'4'; obsidian = modes[4], packetKind surface, evidence-base, routingClass metadata) and `hub-router.json` (tieBreak, routerSignals, vocabularyClasses shapes).
4. In the copy: created `mystack/` packet (SKILL.md, README.md, references/, changelog/), appended `modes["5"]`, pushed `mystack` into `extensions.surface-axis.surfaces`, added `routerSignals.mystack` + classes `code-mystack-aliases`/`code-mystack-runtime`, spliced `mystack` into tieBreak before `sk-code-opencode`, ran `generate-leaf-manifest.cjs --write` (exit 0, hash a41f73c3…).
5. Ran the battery: parent-skill-check EXIT 1 (5 fails), compiled-route-guard EXIT 1, compiled-route-sync --check EXIT 0, run-all-drift-guards EXIT 1. Full failing lines recorded under Findings.

## Findings

| class | claim | evidence | coverage | severity |
|---|---|---|---|---|
| JOURNEY | After a faithful `update --surfaces` run, the battery still fails three legs, and the real residual set is exactly: `5k-canary` (no canary case routes to `mystack`), `stale-manifest` on compiled-route-guard, and `doc-claims` surface counts. The workflow itself disclaims the first two: step_6 reports the canary follow-up "which this command does not run" and the hooks/re-mint follow-up verbatim. | run: `FAIL: 5k-canary: "mystack": no canary case routes to it`; `sk-code stale-manifest … Re-mint: sk-code` (guard exit 1); `FAIL check surfaces: surface counts match mode-registry.json (3 problem(s))`; create-skill-parent-auto.yaml:500-501 | NEW detail (R8 ships the handoff text; the three-leg residual was never enumerated end-to-end on an add) | P1 |
| DOC | `verify-doc-claims` check `surfaces` fails on `shared/references/phase-detection.md:16` (`"three surfaces" says 3, but mode-registry.json declares 4`), alongside README.md:23 and SKILL.md:40. The add-leg steps (README.md:1466-1472) name `stack-detection.md` but never `phase-detection.md` — a shared/ file the user is told to keep hardcodes the surface count and no step says to update it. | run: `doc-claims` FAIL listing `shared/references/phase-detection.md:16`; README.md:1466-1472 | NEW (025 F61 covered remove-leg dead links; the add-leg count claim in a shared file is unlisted) | P1 |
| AUTOMATION | No battery leg verifies the ROUTER.md §11 map edits the README's add step 3 requires: `verify-router-sync.cjs` checks 1a-4 all PASS with `mystack` absent from every RESOURCE_MAP/INTENT_SIGNALS map. The step is silently skippable — the surface routes, but its docs are unreachable through the authored maps. | run: `PASS check 1a … PASS check 4` `router-sync: 5/5 checks passed` with only SKILL.md/README/changelog inside `mystack/` | NEW (025 F61 is remove-leg; no finding recorded that add-leg map edits are unguarded) | P1 |
| OK | Doctor check 5l (027) behaves as designed: `PASS: 5l: tieBreak places no added surface after the native surface "sk-code-opencode"` — a correctly placed added surface does not trip the warning, and `5i`/`5e` also pass. | run: `PASS: 5l …` line verbatim | ALREADY-COVERED by 027 (confirmatory in a live run) | P2 |
| OK | `compiled-route-sync --check` stays green (55/55 served copies match) while `compiled-route-guard` fails stale — the two legs partition drift: guard compares hub state vs live manifest, sync compares served copy vs authored copy. Editing routing without committing leaves both manifest copies equally stale, so sync has nothing to catch. | run: guard `stale-manifest` exit 1; sync `all 55 served copies match` exit 0 | NEW emphasis (R3/R7 shipped named fixes; the guard-vs-sync partition after an uncommitted add was not recorded) | P2 |
| SHAPE | The doctor family covers only 2 of the 6 README verify legs as a routed command: `/doctor:skill-advisor parent-skill` runs `ci-skill-root-metadata.cjs` + `parent-skill-check.cjs` (_routes.yaml:140-161). `compiled-route-guard` runs only inside `/doctor:update apply` phase_5 (doctor-update-apply.yaml:157-160), gated on a release-update run. No route runs `compiled-route-sync --check`, `run-all-drift-guards.sh`, `verify-doc-claims.cjs`, `sync-skills-hermes.cjs`, `test_readme_manifest.py`, or the `compiled-route.cjs --prompt` probe. There is no single doctor entry point for the external user's verify battery. | _routes.yaml:140-161 (parent-skill route), :157-160 of update-apply asset; full route scan lines 40-257 | NEW (025 F78's automation matrix predates the routed doctor family; the per-leg coverage map was not recorded) | P1 |
| AUTOMATION | Of the `update --surfaces` workflow, every step is scriptable except two judgment pockets: (a) spec-folder governance (step_1b/step_5b, skippable via `spec_choice: D`), and (b) authoring real routing vocabulary — the `vocabularyClasses` keyword lists and mode `aliases` that decide when the surface wins a route. Packet scaffold, registry append, hub-router append with correct tieBreak placement, leaf-manifest re-mint (step_4 line 433), validation (step_5 = `parent-skill-check.cjs`, the same gate the doctor runs), and the completion follow-up list are all deterministic. A terminal script could perform the whole add and let `5k-alias`/`5k-packet` fail as named TODOs until the user fills keywords. | create-skill-parent-auto.yaml:346-509 (steps 1-6), :250/:423 (surface contract), :447 (step_5 gate == doctor gate); my simulation needed only mkdir + JSON mutation + one generator call | NEW (Q3 evidence: the add leg is a generator candidate, not inherently AI-bound) | P1 |
| BREAK | The README add step 1 tells the user to run `/create:skill-parent update --surfaces <name>` inside an AI runtime (README.md:1468); Phase 0 of the command verifies the `@markdown` agent before the YAML loads (skill-parent.md router contract + auto.yaml:14-23), so a shell-only user cannot execute the sanctioned path at all — the README offers no terminal fallback even though the mutation itself is mechanical. | README.md:1468; create-skill-parent-auto.yaml:14-23 (PREREQUISITE @markdown), :112-116 (execution_mode must be :auto) | ALREADY-COVERED by 025 F78 in substance; NEW evidence: the Phase 0 agent gate is the specific hard wall, not the mutations | P1 |
| JOURNEY | `5k-alias`/`5k-packet` failures are quality gates on routing vocabulary, not boilerplate: my stand-in's placeholder aliases failed `"mystack implementation" is not a keyword of its routerSignal classes` and `packet "mystack" is not a description keyword` — any scaffold automation must either author real keywords (judgment) or leave these as named, checkable TODOs. The check output names the defect but not the file to edit (`description.json`, the class keyword lists). | run: `FAIL: 5k-alias: "mystack": "mystack implementation" is not a keyword…`, `FAIL: 5k-packet …` | NEW (partially: R3/R7 claim messages name the fix; 5k-* names the invariant, not the target file) | P2 |

## Options and Recommendations

| option | what it changes | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| New doctor route `surface-setup` (or `sk-code`) under `/doctor:skill-advisor` | One route row in `_routes.yaml` + `assets/doctor-surface-setup.yaml` running the six README verify commands read-only and reporting a consolidated PASS/FAIL with the named fix per failure | Today a user must discover and hand-run six commands across four directories after every add/remove (P1 findings 1, 6); nothing tells them which legs exist | Additive: one YAML + one route row, `mutating: read-only`, `gate3_location: n/a`; validated by existing `route-validate.sh`; zero write authority | A `sk-code-setup` hub mode fails cheaper-test: modes require registry/router/canary/playbook surfaces of their own and a `packetKind` — setup is meta-maintenance, not a workflow or evidence base; adding it makes every battery leg verify the checker itself. A shell script in `.skilled/bin` fails on discoverability — the doctor family is where users already look for "is my install healthy" |
| README add leg: name `shared/references/phase-detection.md` (and re-run `verify-doc-claims` until `check surfaces` passes) alongside `stack-detection.md` | README.md:1469-1472, +1 line | P1 finding 2: a green-claimable battery cannot be reached following the add steps verbatim | Doc-only | Making verify-doc-claims stop counting surfaces weakens the check that caught 258 remove-leg problems in iteration 1 |
| Extend `update --surfaces` step_6 follow-up list to also print the doc-claims count-fix files (or run `verify-doc-claims --surfaces`-style check inside the workflow's step_5) | create-skill-parent-auto.yaml:495-505 | Same P1 — the command currently exits STATUS=OK while `doc-claims` is guaranteed red on any add | Small: the workflow already runs `parent-skill-check`; adding one more script call is in-pattern | Having the README say "run the battery and fix whatever is red" works but pushes discovery onto the user each run |

## Ruled Out

- None new. Iteration 1's BLOCKED directions respected: I used the provisioned copy only for the *add* leg (which needs node_modules for the generators), not to re-test the clone journey.

## Dead Ends

- Testing `sync-skills-hermes.cjs` and `test_readme_manifest.py` on the add leg: not run (clock). What would settle it: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` (or its --check equivalent) in `$X` and observe whether a new packet produces a named drift line.

## Edge Cases

- Simulation fidelity: I hand-wrote the packet/registry/router mutations to the YAML contract rather than executing the AI command. `6b` (SKILL.md mode-table row) and `5k-alias`/`5k-packet` failures are partly artifacts — the real workflow updates SKILL.md/description.json and authors vocabulary. The three confirmed residuals (canary, stale manifest, doc-claims counts) are workflow-disclaimed or guide-omitted, so the finding stands; noted so the reducer doesn't double-count the artifacts as user-facing failures.
- Partial success: Hermes/README-manifest legs unobserved; status `complete` justified — the focus's core asks (scriptable-vs-AI split, full failing lines, doctor coverage) are all evidenced.

## Sources Consulted

- `.skilled/commands/create/skill-parent.md` (full), `.skilled/commands/create/assets/create-skill-parent-auto.yaml` (full, 609 lines)
- `.skilled/commands/doctor/_routes.yaml` (full, 321 lines), `.skilled/commands/doctor/assets/doctor-update-apply.yaml:130-189`
- `README.md:1440-1485` (adapting block, add leg)
- Copy-run commands and outputs: mutations transcript, `parent-skill-check` (exit 1), `compiled-route-guard` (exit 1), `compiled-route-sync --check` (exit 0), `run-all-drift-guards.sh` (exit 1, doc-claims fail) in `runs/swe-max-i2-6L2e`
- `.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/hub-router.json` (structure dump in copy)

## Assessment

- New information ratio: 0.70 — 5 fully new findings (three-leg residual enumeration, phase-detection.md doc gap, unguarded ROUTER.md maps, doctor coverage map, scriptable-steps split), 3 partially new/confirmatory (guard-vs-sync partition, Phase-0 wall evidence, 5k fix-naming gap), 1 OK.
- Questions addressed: Q3 (automation split: scaffold is scriptable; vocabulary authoring + spec governance are the judgment pockets), Q4 (doctor family covers 2/6 legs; a new read-only route fits the existing `_routes.yaml` schema; a hub mode is the wrong shape and costlier), Q6 (coverage vs 025/026/027 recorded per row).
- Questions answered: "Q3: Which manual steps can existing automation absorb without a judgment call?" and "Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?"

## Reflection

- What worked: simulating the command's *output* rather than the command — the workflow is a spec for file mutations, so writing them directly in the copy isolated "what the battery catches post-add" from the AI-runtime gate. Reading `_routes.yaml` fully gave a definitive coverage map in one pass.
- What did not: nothing material; the drift-guards script ran long (~30 s) but completed.
- What I would do differently: run the Hermes + readme-manifest legs earlier in the same battery call; they were deferred and now cost a future iteration.

## Recommended Next Focus

Q1 residual: hand-edit blast radius on `hub-router.json`/`mode-registry.json` in a copy (e.g., a hand-placed surface *after* opencode to trip 5l; a malformed routerSignals class; Hermes/mirror `--check` legs), plus the unobserved add-leg commands (`sync-skills-hermes`, `test_readme_manifest`, `compiled-route.cjs --prompt` for the new surface's route outcome).
