# Iteration 2: Re-verify update --surfaces against hand-added surface doctor gaps

## Focus
Q9: determine whether `/create:skill-parent update --surfaces` fills the five doctor gaps caused by a hand-added `sk-code-myapp` surface, and where its route priority lands. The exact key-question text was read from the lineage strategy and registry.

## Actions Taken
- State-first read: config, state log, strategy, findings registry, previous iteration, and the `/create:skill-parent` router and owned workflow assets. The configured lineage session ID is `dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z`.
- Throwaway copy 1: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i2.38jE`, cloned from the prepared base with `cp -cR <prepared-base>/. <copy>/` (exit 0). In the copy, I minimally registered `sk-code-myapp` from the existing Webflow mode, created its packet directory with only `SKILL.md`, inserted it before `sk-code-opencode` in `routerPolicy.tieBreak`, and ran `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` (exit 1). The targeted five legs failed; the diagnostic showed what a low-effort clone also misses: unique aliases, router vocabulary classes, and a refreshed manifest.
- Throwaway copy 2: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i2.38jE`, a fresh clone from the same prepared base (copy exit 0). I followed the documented update-generation activities by hand for the model-generated edits: registered a surface packet, added `SKILL.md`, `README.md`, and `changelog/`, added its hub mode-table row and description keywords, updated its router signal/vocabulary registration and tieBreak, then ran `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code` (exit 0). Then `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exited 1. This was a YAML-driven simulation, not invocation of a slash-command runtime; model-authored file content was written by hand as the prompt directs.
- The update entrypoint advertises `--surfaces` and routes the omitted mode to the confirm workflow. The YAML says surfaces get a read-only evidence-base packet, router signals, tieBreak coverage, and a scoped manifest refresh [SOURCE: .skilled/commands/create/skill-parent.md:3] [SOURCE: .skilled/commands/create/skill-parent.md:55] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:467] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:471].
- Remaining targeted failures after the YAML-driven simulation: 6b, 5k-canary. The second-copy tieBreak was `['sk-code-quality', 'sk-code-review', 'sk-code-myapp', 'sk-code-opencode', 'sk-code-obsidian', 'sk-code-webflow']`.

## Findings
| class | claim | evidence | severity |
|---|---|---|---|
| ORDER | The workflow-generated tieBreak places sk-code-myapp before sk-code-opencode; the doctor accepts the ordering with its 5e check. | throwaway copy /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i2.38jE: parent-skill-check command exit 1; tieBreak=['sk-code-quality', 'sk-code-review', 'sk-code-myapp', 'sk-code-opencode', 'sk-code-obsidian', 'sk-code-webflow']; PASS: 5e: tieBreak orders workflow modes before surface/transport modes [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462] | P1 |
| BREAK | A minimal hand registration reproduced the five targeted failures: 3d-files, 6b, 5k-alias, 5k-packet, and 5k-canary; it also had extra alias, vocabulary-class, and stale-manifest failures because the probe copied Webflow metadata. | node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code EXIT 1; FAIL: 3d-files: packet "sk-code-myapp" is missing companion README.md; FAIL: 3d-files: packet "sk-code-myapp" is missing a changelog/ directory; FAIL: 6b: mode(s) registered but absent from the hub SKILL.md mode table: [sk-code-myapp]; FAIL: 5k-alias: "sk-code-myapp": "myapp implementation" is not a keyword of its routerSignal classes; FAIL: 5k-packet: "sk-code-myapp": packet "sk-code-myapp" is not a description keyword; FAIL: 5k-canary: "sk-code-myapp": no canary case routes to it; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:572] | P1 |
| OK | The update YAML creates surface packet companions and runs the scoped leaf-manifest generator; the fresh-copy simulation completed those steps and the generator exit was 0. | update workflow simulation in /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-luna-max-fast-r2-i2.38jE; generate-leaf-manifest.cjs --write EXIT 0; parent doctor EXIT 1; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:467] | P2 |
| BREAK | After the update steps, doctor still reports these targeted legs: 6b, 5k-canary. Exact remaining diagnostics: FAIL: 6b: mode(s) registered but absent from the hub SKILL.md mode table: [sk-code-myapp]; FAIL: 5k-canary: \"sk-code-myapp\": no canary case routes to it | fresh-copy parent-skill-check EXIT 1; FAIL: 6b: mode(s) registered but absent from the hub SKILL.md mode table: [sk-code-myapp]; FAIL: 5k-canary: "sk-code-myapp": no canary case routes to it; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1273] | P1 |
| DOC | The remaining doctor message names the missing evidence but supplies no repair command; the workflow recovery text only says Fix and re-run validation before completion. | FAIL: 5k-canary: "sk-code-myapp": no canary case routes to it; workflow recovery: Fix and re-run validation before completion [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:577] | P1 |

| option | Extend the existing /create:skill-parent update --surfaces path to produce or invoke the missing compiled-route parity/canary refresh, then rerun its existing parent-skill gate (.skilled/commands/create/assets/create-skill-parent-confirm.yaml:467) | Medium: generator wiring plus fixture ownership | Medium: must keep authored route sources and generated artifacts in sync | Cheaper move: tell users to hand-edit a checklist; it leaves the canonical doctor gate red and the canary message does not name the source or next command. |

## Questions Answered
- Q9: `/create:skill-parent update --surfaces` repairs 3d-files, 5k-alias, 5k-packet of the five targeted legs in this simulation and leaves 6b, 5k-canary. The custom surface lands before `sk-code-opencode` in tieBreak.

## Questions Remaining
- Q8: re-mint source dependency and repair cost.
- Q10: exact R1-R4 edits and minimum scope.
- Q11: other example assumptions and end-to-end external-user flow.
- Q12: challenge X1-X9 and identify new rejections.

## Ruled Out
- Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs.
- Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest.

## Dead Ends
- No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes.

## Edge Cases
- Ambiguous input: none; omitted execution mode resolves to `:confirm` in the command router.
- Contradictory evidence: none.
- Missing dependencies: no slash-command runtime was invoked; YAML side effects were simulated and the named generator and canonical doctor were run.
- Partial success: none for Q9; the test established the exact targeted pass/fail set.

## Sources Consulted
- `.skilled/commands/create/skill-parent.md:3,42-48,55-57,71-73`
- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:456-471,485-498,570-577`
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml` (parallel workflow contract)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:567-579,1271-1284,1384-1407`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`
- First and second throwaway-copy doctor outputs recorded above.

## Assessment
- New information ratio: 0.90 (four fully new findings; the hand-add failure pattern is a partial re-verification of F18).
- Questions addressed: Q9.
- Questions answered: Q9, with the explicit limitation that file generation was simulated from the YAML rather than dispatched through a slash-command runtime.

## Reflection
- What worked and why: a fresh full-tree clone isolates the doctor output while retaining the compiled-routing closure and baseline files.
- What did not work and why: a mechanical Webflow clone is not a valid authored surface; the doctor correctly exposed duplicate aliases, missing vocabulary declarations, and stale generated metadata in addition to the expected five.
- What I would do differently: in the next iteration, test the update command's route re-mint dependency against the authored closure before proposing broader automation.

## Recommended Next Focus
Q8, F20: quantify the cost and blast radius of retaining versus removing the compiled-routing re-mint dependency on `specs/sk-doc/z_archive/019-skill-routing-refactor/`.

## SCOPE VIOLATIONS
None. Progressive synthesis is configured on, but `research.md` is outside the explicit three-artifact write allowlist for this dispatched run and was not modified.
