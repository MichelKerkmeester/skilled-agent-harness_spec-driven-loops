# Iteration 9: Surface automation, guides, and rejected ideas

## Focus
Assess the existing surface-add command against the manual add/remove checklist, choose the smallest external-user guide and doctor pointers, and challenge X1-X9 plus one new candidate rejection. Q10 and Q11 remain broader than this iteration's bounded evidence pass.

## Actions Taken
- Read the lineage config, eight-record state log, strategy, prior synthesis and prevent-overengineering rule before selecting the focus. Config says progressive synthesis is enabled, but this dispatch permits only the iteration, delta and gateway-owned state writes, so research.md was left untouched.
- Read both /create:skill-parent workflow YAMLs, its router, /doctor:update and its apply workflow, the parent-skill check, sk-code router/registry and related README passages.
- A first rg query failed with exit 2 because its leading --surfaces pattern was parsed as an option. The corrected rg query returned the listed YAML, doctor, README and generator anchors. A second targeted rg query returned the router, runtime hint and stack-detection anchors.
- Copy boundary: COPY_A=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i9-a; COPY_B=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i9-b. No command was run in either copy. This runtime did not expose a direct slash-workflow execution tool, so the model-driven /create workflow could not be observed end to end here. Settle this with an isolated invocation of both :auto and :confirm against a disposable hub in a fresh copy, then inspect its generated files and run the parent-skill check. No repository source file was changed.
- Shell command evidence: trigger-index lookup returned a deep-research match; its result output was valid JSON. The first rg command exited 2 with “unrecognized flag”; corrected rg commands returned matching paths and lines. No copy command was executed. The gateway receipt and verifier output are recorded after artifact creation below.

## Findings
| class | claim | evidence | priority |
|---|---|---|---|
| DOC | The existing /create:skill-parent command already scaffolds surface packets and updates registry/router data, runs the scoped leaf-manifest generator and gates on parent-skill-check. This is strong static evidence for addition, not an observed successful add-surface run. | [SOURCE: .skilled/commands/create/skill-parent.md:3,15-18]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:421-447]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462-497] | P1 |
| DOC | The workflow requires tieBreak to cover every mode, but gives no user-surface-before-OpenCode rule. For an active root ROUTER.md it selects unchanged, so it does not establish that stage-two leaf maps are rebuilt. | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:423-428]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462-467] | P1 |
| DOC | /doctor:update is a release workflow, not surface migration. Its compiled-route repair refreshes the served manifest and reruns a guard, but the repair text omits the authored-manifest copy required by the prior observed repair. | [SOURCE: .skilled/commands/doctor/update.md:38-48]; [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:146-160]; prior evidence: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:69-70] | P1 |
| DOC | The README still says to replace all three surfaces, including native OpenCode. The sk-code README repeats the three named surfaces as a general scope statement. An adaptation guide should correct both entry points rather than add a separate manual. | [SOURCE: README.md:800,1384,1447-1453]; [SOURCE: .skilled/skills/sk-code/README.md:23,90,138-140] | P1 |
| OK | X1 remains rejected. A rank field would duplicate explicit tieBreak precedence without a demonstrated second caller. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4,7]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:144] | P2 |
| OK | X2 remains rejected. A single native/fallback flag cannot order several user surfaces and risks changing the operator's own order. | [SOURCE: .skilled/skills/sk-code/mode-registry.json:19]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:145] | P2 |
| OK | X3 remains rejected. Packet presence does not express preference among several surfaces; tieBreak already does. | [SOURCE: .skilled/skills/sk-code/hub-router.json:7]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:146] | P2 |
| OK | X4 remains rejected as the default. surfaceHint runs after the decision and reorders only matched surfaces, so callers without it still use tieBreak. | [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99-107]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:147] | P2 |
| OK | X5 remains rejected. Removing examples from the shipped operator tree is not the same as producing an external starter, and the prior synthesis found no publisher boundary. | [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:148] | P2 |
| OK | X6 remains rejected. No consumer for a separate operator/external config was found; it would duplicate the existing order policy. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-7]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:149] | P2 |
| OK | X7 remains rejected as a new guard. The parent-skill check already reports a registered mode whose packet directory is missing. That structural failure does not tell users how to repair an intentional removal. | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:481-500]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:150] | P2 |
| DOC | X8 is narrowed, not overturned. A separate wizard is redundant for addition because /create:skill-parent accepts --surfaces, generates packets and a leaf manifest, and invokes the canonical structural gate. Its contract does not document complete removal or promise external-surface priority. | [SOURCE: .skilled/commands/create/skill-parent.md:3,15-18]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:428,433,447]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:467,471,489] | P1 |
| OK | X9 remains rejected. OpenCode is selected from resolved target/CWD paths inside the hub's own .skilled directory; reversing precedence would misroute genuine hub work in mixed-marker repositories. | [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:39,65]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:152] | P2 |
| OK | New rejection: do not add a standalone general-purpose surface-management command now. The existing parent-skill workflow already owns package generation and validation. Extending its bounded update flow plus a guide is cheaper; a second command has no evidenced independent caller. | [SOURCE: .skilled/commands/create/skill-parent.md:3,15-18]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:421-447]; [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45-65,94-100] | P2 |

## Ranked Recommendations
| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R1 | Add the exact instruction “When adding a surface, place it before sk-code-skilled in routerPolicy.tieBreak.” to both create-skill-parent YAML twins at auto:423 and confirm:462, README adaptation step at README.md:1448, and the nested-packet checklist at parent-skills-nested-packets.md:224. | Four short doc edits. | If omitted, a new surface can lose keyword ties to OpenCode. | Build nothing fails because the command only requires tieBreak to cover modes, not this insertion position. |
| R2 | Make verify-router-sync read the mode registry instead of naming example surfaces, and stop the surface-hint test from pinning live Webflow order. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31-32]; [.skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-65] | One guard and one test fixture change. | Registry-driven checks could miss stale maps if they only test membership. | Docs alone fail because deleted packet paths still break the guard. |
| R3 | Add a removal checklist and a pointer in the 3c doctor message. Proposed suffix for 3c, 6b and 5k alias/packet/canary errors: “For the sk-code surface add/remove checklist, see README.md#adapt-sk-code-to-your-stack.” The checklist must cover registry, router signals/vocabulary, tieBreak, ROUTER maps, hub SKILL table, description keywords, canaries, leaf manifest, compiled-route refresh, authored-copy synchronization and a route prompt. | A subsection in the existing root README plus message links; no new command. | Users can still make a partial edit and leave stale generated artifacts. | A removal command costs more for one known caller. Prose alone also fails unless it names the authored-copy step, since the existing doctor repair only refreshes the served copy. |
| R4 | Mark Webflow and Obsidian as examples while retaining OpenCode as native in .skilled/skills/sk-code/SKILL.md:40, README.md:800,1384,1447 and .skilled/skills/sk-code/README.md:23,90,138-140. Proposed sentence: “Webflow and Obsidian are example surfaces; OpenCode is the native surface for this repository.” | Small coordinated doc edits. | A single page can remain misleading if its dependents repeat the old count. | A root README-only edit fails because the canonical hub SKILL.md still defines the surfaces for downstream readers. |
| R5 | Keep the operator's generic OpenCode vocabulary unchanged by operator ruling. [SOURCE: .skilled/skills/sk-code/hub-router.json:83]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:136] | No change. | External users may still bundle OpenCode on generic language prompts. | Narrowing it now fails the operator's stated scope and has no newly evidenced external caller. |
| R6 | Carry forward the stack-agnostic intent coverage fix from Q7: replace Webflow-only dependencies with existing shared/OpenCode leaves where they truly cover the intent. [SOURCE: .skilled/skills/sk-code/ROUTER.md:41,352]; prior coverage evidence: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:53] | Leaf-map review and precise map edits. | Mapping a generic intent to an unrelated leaf misleads routing. | Build nothing fails because the prior F10 evidence shows those generic intents lose most or all mapped leaves when Webflow is removed. |
| R7 | Keep the re-mint prerequisite explicit in the guide: retain the authored compiled-routing closure under specs/sk-doc/z_archive/019-skill-routing-refactor/ when regeneration is needed; document the authored-copy step after refresh. [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:157-160]; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:69-70,183] | One guide caveat and repair-text correction. | A user who prunes specs cannot re-mint; this remains a real limit. | Moving the closure is a cross-hub change with a wider blast radius; no evidence in this iteration justifies paying that cost for one external-user path. |
| R8 | Add “Adapt sk-code to your stack” to the existing root README adoption section near 1447, then link it from the sk-code README and the doctor errors. Cover native-versus-example status, delete/add steps, all authored maps and tables, exact re-mint plus authored copy, doctor checks, canaries and a representative route prompt. | One existing guide section and short cross-links. | A guide cannot make the manual path mechanically safe. | A new standalone manual duplicates existing adoption docs; a command is not justified until a repeat caller or verified automation gap is shown. |

## Questions Answered
- Q12: X1-X7 and X9 remain rejected on the inspected prior evidence. X8 remains rejected only as a case for a separate wizard; the existing command is a partial add path, not a complete remove path. Reject a second general-purpose manager for now. The guide and an update to the existing command are the cheaper next steps.

## Questions Remaining
- Q10: exact R1-R4 file set and wording still need reconciliation against the current complete repo tree, especially both YAML twins, the README tables and sk-code README.
- Q11: benchmarks, playbooks, feature catalog, CI, runtime mirrors, install guides and full clone-delete-add-doctor-route flow were not exercised in this iteration.
- The --surfaces workflow was not run in a throwaway copy. Static YAML is not proof that the five F18 doctor legs pass.

## Sources Consulted
- Lineage config, state log and strategy.
- Prior synthesis: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md.
- /create:skill-parent router and :auto/:confirm YAML.
- /doctor:update router, apply YAML and parent-skill-check.cjs.
- sk-code hub-router.json, mode-registry.json, stack-detection.md, compiled-route runtime, root README and sk-code README.
- .skilled/repo-rules/prevent-overengineering.md.

## Assessment
- New information ratio: 0.21 (two new command-contract facts and two partial refinements, weighted against fourteen findings).
- Questions addressed: Q12.
- Questions answered: Q12.
- Status: complete for Q12 review only. Q10 and Q11 remain open.

## Reflection
- What worked and why: reading both workflow twins side by side exposed which add steps already exist and which promises are absent.
- What did not work and why: no slash-command executor was available in the exposed tool surface, so the requested disposable add-surface run and five-leg observation remain unverified.
- What I would do differently: run the actual :auto and :confirm branches in independent disposable copies and inspect every doctor leg before calling the automation complete.

## Recommended Next Focus
Resolve Q10's exact edit set and Q11's missed consumers. Then run both parent-skill update branches in fresh throwaway copies, route an external surface prompt and record the exact doctor output.

## Verification
- Iteration file and delta file were written as new files.
- Gateway and required verifier command results are reported in the dispatcher response.
- No repository file outside the allowed iteration artifacts was changed.
