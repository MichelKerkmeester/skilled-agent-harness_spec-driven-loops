# Iteration 6: Q10 R3/R4 removal and documentation stress test

## Focus

Q10 R3/R4: exact surface-removal checklist, doctor repair diagnostics, and the README/SKILL.md wording that marks Webflow and Obsidian as optional examples while preserving OpenCode as native. State-first reads found five completed iterations, three unresolved questions, and a config session ID `dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z`. Strategy's Next Focus names Q12, but dispatch explicitly selects Q10, so Q10 governs this iteration; no strategy edits were made. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:15-16] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-state.jsonl:2-10] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-strategy.md:191-194]

## Actions Taken

- Trigger-index lookup exit 0; top candidates were the deep-research README and system-spec-kit stress-test README.
- Read config, state, strategy, registry and iteration 5. The prior iteration is R2-focused and documents a deletion-only copy probe; it explicitly says that the retained registry, hub router and docs mean it was not a complete external-user migration. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-005.md:14-16]
- Read the current doctor repair text, exact parent-skill-check 3c diagnostic, current `/create:skill-parent` command contract, the overengineering rule, root README passages and hub README/SKILL.md. A line-based search found the authoritative surface counts and example references listed below, plus packet-local documentation references.
- Attempted the permitted COPY_A probe at `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i6-a`, using the required literal `cd <copy> && test "$(pwd)" = "<copy>"` guard. The Node harness failed to parse before its body ran: exit 1, `[stdin]:45 SyntaxError: Unexpected identifier '$'`. Therefore no directories were deleted and none of the requested gates ran in this iteration. The full checklist experiment is deferred; no test result is inferred from the failed harness.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| DOC | The root README calls all three surfaces “ready” and tells a user to replace OpenCode along with the two personal examples; the hub canonical sentence likewise says it has “exactly three” surfaces. These statements hide the distinction between native OpenCode and optional examples. Exact proposed replacements: README.md:800 → `- The shipped sk-code hub has one native surface, OpenCode (.skilled/ system code), and two optional examples, Webflow and Obsidian. Remove or replace only the examples; keep OpenCode for work in .skilled/.`; README.md:1384 → `- Keep the native OpenCode surface for this repository's .skilled/ code; remove or replace the optional Webflow and Obsidian examples with your stack's own surfaces.`; README.md:1447 → `1. Keep sk-code-opencode/ for .skilled/ work; remove or replace the optional example packets (sk-code-webflow/ and sk-code-obsidian/) with your stack's packet(s).` [SOURCE: README.md:800] [SOURCE: README.md:1384] [SOURCE: README.md:1447] [SOURCE: .skilled/skills/sk-code/SKILL.md:40] | P1 |
| DOC | The hub SKILL.md and README need a matching, explicit example distinction. Replace SKILL.md:40 with `**Surface list.** The shipped hub has one native surface (OPENCODE, sk-code-opencode) and two optional example surfaces (WEBFLOW, sk-code-webflow; OBSIDIAN, sk-code-obsidian). External users may remove or replace the examples; add user surfaces before sk-code-opencode in routerPolicy.tieBreak.` Replace README.md:23 and :90's “three surfaces” phrasing with `registered surface packets declared in the hub SKILL.md, including the native OpenCode surface and optional examples`; label README.md:55 and :57 `optional example`, and :56 `native surface`. The README request example at :69 should say it is an optional Webflow example, not a guaranteed installed route. Remove related-doc rows :138 and :140 after packet removal rather than leave broken links. [SOURCE: .skilled/skills/sk-code/SKILL.md:15] [SOURCE: .skilled/skills/sk-code/SKILL.md:36-40] [SOURCE: .skilled/skills/sk-code/SKILL.md:70-74] [SOURCE: .skilled/skills/sk-code/SKILL.md:82] [SOURCE: .skilled/skills/sk-code/SKILL.md:139] [SOURCE: .skilled/skills/sk-code/SKILL.md:164-173] [SOURCE: .skilled/skills/sk-code/SKILL.md:203] [SOURCE: .skilled/skills/sk-code/README.md:23] [SOURCE: .skilled/skills/sk-code/README.md:55-57] [SOURCE: .skilled/skills/sk-code/README.md:69] [SOURCE: .skilled/skills/sk-code/README.md:90] [SOURCE: .skilled/skills/sk-code/README.md:138-140] | P1 |
| DOC | The doctor’s exact 3c message is `FAIL: 3c: mode "${label}" packet "${packet}" is not an existing sub-directory`; it diagnoses but gives no next action. Its compiled-route repair says to refresh the served manifest and rerun the guard, omitting the authored-copy step. Proposed replacement text: `With approval, for each stale hub run node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>; copy .skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json to specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/<hub>/manifest.json; then rerun node .skilled/bin/compiled-route-guard.cjs and node .skilled/bin/compiled-route-sync.cjs --check. This requires the authored routing closure under specs/sk-doc/z_archive/019-skill-routing-refactor/; if absent, report that prerequisite rather than claiming repair.` Proposed 3c replacement: `FAIL: 3c: mode "${label}" packet "${packet}" is not an existing sub-directory. Restore the packet, or remove its registration and every router/documentation reference, regenerate leaf manifests, re-mint compiled routing including the authored copy, then rerun parent-skill-check; see the sk-code surface-removal procedure.` R3 must create that referenced procedure before shipping this wording. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:157-160] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research.md:67-70] | P1 |
| OK | R3's exact removal checklist is: (1) remove both example modes and aliases from mode-registry.json; (2) remove their routerSignals and vocabulary entries from hub-router.json; (3) remove them from routerPolicy.tieBreak; (4) remove their packet leaves from ROUTER.md RESOURCE_MAP and review shared controls for remaining references; (5) update SKILL.md tables, counts, prose, examples, layout and surface inventory; (6) remove their detection markers/paths from shared/references/stack-detection.md without disturbing native OpenCode or UNKNOWN behavior; (7) remove/replace example canary cases and make shared routing tests synthetic/data-driven; (8) regenerate leaf manifests/aliases; (9) re-mint compiled routing and copy the generated activation manifest back to the authored closure; (10) run parent-skill-check, compiled-route-guard, compiled-route-sync --check, run-all-drift-guards.sh, ci-skill-root-metadata.cjs, and compiled-route probes for deleted and retained surfaces. These steps synthesize R3 and the recorded break layers; they were not executed as a full migration in this iteration. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research.md:67-70] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research.md:134-135] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-005.md:22-27] | P1 |
| BREAK | A folder-only deletion is not evidence that removal is supported: prior copy evidence showed dead routes and doc-path failures when the mode registry/router/docs were left intact. The current experiment did not run because its Node harness failed to parse, so there are no new gate results to report. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-005.md:14-16] | P1 |

## R4 README/SKILL.md Surface-Line Inventory

The hub/root lines that count or identify the surfaces are: `README.md:800,1384,1447`; `.skilled/skills/sk-code/README.md:23,55-57,69,90,138-140`; `.skilled/skills/sk-code/SKILL.md:15,36,38,40,70,74,82,139,164-166,173,203`. Exact proposed replacements for the count/adaptation/table lines are in the DOC rows above. On `.skilled/skills/sk-code/SKILL.md:15`, replace the hard-coded “three read-only evidence packets” sentence with: `The surface axis is the set of registered read-only evidence packets bundled alongside a workflow mode; the shipped tree has native OpenCode plus optional Webflow and Obsidian examples.` On :74, replace “detection precedence” with: `Bundled surfaces follow routerPolicy.tieBreak; the configured order is not the path-based surface-detection precedence.` On :139, use: `Surface detection recognizes native OPENCODE, optional WEBFLOW and OBSIDIAN examples, and UNKNOWN; detection precedence is a separate path-based rule, while bundle order is routerPolicy.tieBreak.` Lines :70, :82, :164-166, :173 and :203 are inventory/layout examples, not a count; mark the two packet names as optional examples and remove them from the active file list when deleted. The broad search also found packet-local README/SKILL references in sk-code-quality, sk-code-review, sk-code-webflow, sk-code-obsidian, sk-code-opencode and shared/; those are R3's stale-reference/path-validation surface, not additional canonical counts.

## Options and Recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R3 documented removal procedure | Add the ten-step procedure and link it from `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496` and `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`. | Low documentation cost; still requires the verification gates. | Users can miss generated/authored mirrors or fixtures; a checklist alone does not prove success. | “Delete the directory and rerun doctor” is cheaper but prior F14-F20 evidence shows stale registry, routes, drift and authored-manifest failures. |
| Extend `/create:skill-parent update --surfaces` with symmetric removal | Extend its existing create/update workflow to reconcile registry, signals/vocabulary/tieBreak, ROUTER/SKILL docs, stack detection, canaries, leaf manifests, compiled re-mint and authored copy; run the existing gates. Current command declares create/update and `--surfaces` but no removal flag. [SOURCE: .skilled/commands/create/skill-parent.md:2-3,13-17] | Medium; expands an existing command and its generated-file updates. | Broad mutation surface; partial automation is more dangerous than leaving explicit steps. | A separate wizard/command is more indirection. A checklist is cheaper initially but leaves a multi-store manual sync with no single success signal. Rule: extend in place only after naming what fails at the smaller move. [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45-65] |
| R4 example labels | Correct central README/SKILL statements above; keep packet-local evidence docs specific and let R3 remove dangling links. | Low prose-only change. | Must not imply native OpenCode is disposable. | README-only leaves canonical SKILL.md:40 as an authoritative but misleading surface count. [SOURCE: .skilled/skills/sk-code/SKILL.md:40] |

## Ruled Out

- Treating the failed COPY_A harness as a successful deletion or full-checklist test.
- Treating the current `/create:skill-parent update --surfaces` command as a complete removal path; its command contract has no removal option, and the earlier simulations did not clear all doctor legs.

## Dead Ends

- None established. The complete R3 migration remains untested.

## Edge Cases

- Ambiguous focus: strategy Next Focus says Q12, while the dispatch explicitly selects Q10; followed the dispatch.
- Contradictory evidence: none newly resolved.
- Missing dependencies: none for source reads.
- Partial success: exact source review completed; the copy harness failed before any copy mutation and the full removal experiment remains open.

## Questions Answered

- No full key question closed; evidence supports the R3/R4 subquestions only.

## Questions Remaining

- Q10: run all R3 edits in a fresh copy and adjudicate each required check and routing prompt.
- Q11: survey other tooling assumptions and the complete external-user flow.
- Q12: challenge X1-X9 and identify additional rejected options.

## Next Focus

Execute the complete removal checklist in fresh COPY_B, including authored routing-data edits, leaf-manifest regeneration, compiled-route refresh plus authored copy, all six requested gates and Webflow/Obsidian/OpenCode routing prompts. Record exact residual failures before recommending the external-user path.

## Assessment

- New information ratio: 0.60 (directly clarified the exact doctor/user-facing text and the complete central-doc touch set; the checklist consolidates prior findings, and no full experiment ran).
- Questions addressed: Q10 R3/R4 sub-slices.
- Questions answered: none in full.
- Edge cases: partial success; copy experiment blocked by a harness syntax error.

## Reflection

- What worked and why: rereading the exact doctor and hub docs isolated the external-user dead ends: the packet error has no recovery guidance, and the repair omits the authored-manifest copy.
- What did not work and why: the copy harness failed to parse (`Unexpected identifier '$'`) before executing, so the requested checks were not run.
- What I would do differently: use a smaller, syntax-checked script in COPY_B, first apply the checklist, then capture each gate's exit and decisive output independently.

## Sources Consulted

- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:157-160`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:481-499`
- `README.md:800,1384,1447-1451`
- `.skilled/skills/sk-code/SKILL.md:15,36-40,70-74,82,139,164-173,203`
- `.skilled/skills/sk-code/README.md:23,51-57,65-70,90,138-140`
- `.skilled/commands/create/skill-parent.md:2-3,13-17`
- `.skilled/repo-rules/prevent-overengineering.md:45-65`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research.md:67-70,134-135`
- COPY_A harness attempt: exit 1, Node parse error before mutation.

## Recommended Next Focus

Run the full R3 COPY_B removal experiment; retain Q11 and Q12 as open.

## Output Verification

The append gateway and required verifier run after this narrative and delta are written; their observed results are reported in the dispatcher completion summary.

## SCOPE VIOLATIONS

None. No research target or repository source file was modified. The COPY_A script failed before mutation; the only intended repository writes are this iteration narrative, its delta, and the append gateway's state projection.
