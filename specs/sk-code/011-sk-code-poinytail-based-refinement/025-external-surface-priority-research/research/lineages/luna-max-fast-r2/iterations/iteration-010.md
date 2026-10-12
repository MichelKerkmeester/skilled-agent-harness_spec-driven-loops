# Iteration 10: Adversarial re-verification of surface priority findings

## Focus
Re-opened the highest-impact round-one claims F10, F18, F19 and F20, and checked the exact R1–R4 edit locations against the current tree. The bounded run did not complete a line-by-line audit of every finding and recommendation from iterations 1–9, the full add-surface workflow, or the external-user journey. Those gaps remain explicit below.

## Actions Taken
- Read the lineage config, all nine state records, and strategy. The config names session `dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z`, enables progressive synthesis and sets the lineage at its 10-iteration limit. The strategy leaves Q10 and Q11 open. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:15-19] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:35-49] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-state.jsonl:2-10] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-strategy.md:47-54]
- Re-opened the round-one synthesis and extracted prior evidence from iterations 5–9. An initial filename pattern omitted zero-padding; the corrected search output was capped before iterations 1–4 could be fully inspected. Therefore this is a focused re-verification, not the requested exhaustive sweep.
- Read current ROUTER, create-skill-parent auto/confirm YAML, root README, sk-code README and SKILL, doctor repair YAML, compiled-route-sync source and the surface-hint test.
- Throwaway probe: `cd /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i10-a && test "$(pwd)" = "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i10-a" && node -e 'require("node:fs").rmSync("specs", { recursive: true, force: true }); console.log("pruned specs/ in throwaway copy")' && node .skilled/bin/compiled-route-sync.cjs` — exit 1. Output: `pruned specs/ in throwaway copy`, then `ENOENT: no such file or directory, lstat '.../i10-a/specs'` from `compiled-route-sync.cjs:39`. The deletion was confined to COPY_A. No other copy command was run.
- The `/create:skill-parent update --surfaces` slash workflow was not executable through the exposed Bash/tool surface, so no disposable end-to-end add run occurred. The YAML contract was inspected, but static workflow text is not a runtime result.

## Findings
| PRESENCE | F10 remains directionally supported: the current IMPLEMENTATION map begins with one shared universal leaf, then a long Webflow-specific list, while OpenCode leaves appear later. The earlier exact 22:9 count and “almost nothing” behavior were not recomputed in this pass; a fresh route probe after deleting Webflow is still needed. | [SOURCE: .skilled/skills/sk-code/ROUTER.md:352-379]; round-one claim [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:53] | P1 |
| BREAK | F20 is freshly reproduced. After pruning `specs/` in COPY_A, `compiled-route-sync.cjs` exits 1 before re-minting because its expected `specs/` path is absent. The source also explicitly requires an authored resolver and throws when it is missing. This confirms that deleting the authored closure removes re-mint capability. | COPY_A command above, exit 1, `ENOENT .../specs`; [SOURCE: .skilled/bin/compiled-route-sync.cjs:763-768] | P1 |
| DOC | F19's repair-text gap still exists: the doctor repair says to refresh the served manifest and rerun the guard, but does not name copying the generated manifest back to the authored closure. The prior observed guard failure after refresh was not rerun in this pass. | [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:157-160]; prior behavior [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:69-70] | P1 |
| DOC | F18 is not settled by the source text. Both auto and confirm workflows generate `--surfaces` packets and a leaf manifest, and name `parent-skill-check` as the structural gate. The text does not itself demonstrate that the five specific doctor legs pass after a real update; that remains unverified because the slash workflow could not be run. | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:417-447] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:456-497] | P1 |
| DOC | R1's minimal insertion instruction remains absent from both workflow twins: each says `tieBreak` must cover every mode, but neither says a user surface must precede OpenCode. R4 is also still needed: the root README calls the three surfaces ready and tells users to replace all three, while the canonical SKILL says the hub has exactly three surfaces. | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:422-428] [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:461-467] [SOURCE: README.md:798-802] [SOURCE: README.md:1381-1386] [SOURCE: README.md:1445-1451] [SOURCE: .skilled/skills/sk-code/SKILL.md:34-42] | P1 |
| DOC | The shared surface-hint test still asserts a Webflow-first hinted bundle and a Webflow/Obsidian collision. That is a concrete example-identity dependency outside the prose docs; it should use synthetic or registry-derived surface fixtures if it is intended to remain stack-agnostic. | [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-76] | P1 |

## Options
| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R1: Add the exact rule, “When adding a surface, place it before `sk-code-opencode` in `routerPolicy.tieBreak`.” | Both YAML twins at auto:423 and confirm:462, root adaptation step at README:1447, and nested-packet checklist at its existing surface-add row. | Low, four targeted documentation edits. | The twins can drift if only one is updated. | A README-only line is cheaper but leaves the workflow templates silent; their current `tieBreak` requirement only says to cover every mode. |
| R2: Make example-dependent stack-agnostic checks registry-driven and test ordering with synthetic or registry-derived surfaces. | `verify-router-sync.cjs` and `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`; prior exact guard evidence is in iteration 5 lines 22–27. | Medium, one existing guard and one test fixture. | Filtering only installed packets can hide a registered-but-missing surface. | Keeping the hard-coded examples is cheaper but continues to break or mislead when an external user removes them. |
| R3: Document removal as a checklist, retain the existing doctor/drift gates, and correct the doctor repair pointer to include the authored-copy step. | Existing adaptation guide and `.skilled/commands/doctor/assets/doctor-update-apply.yaml:157-160`; the checklist must cover registrations, router maps, detection, manifests and re-mint. | Low-to-medium, focused edits to existing docs and repair text. | Manual edits can drift and a checklist alone cannot prove the migrated tree passes. | “Delete the folders and rerun doctor” is cheaper but prior COPY_B evidence recorded 113 doctor failures after directory-only deletion: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-008.md:13-14]. |
| R4: Label Webflow and Obsidian as optional examples while retaining OpenCode as native. | Canonical sentence `.skilled/skills/sk-code/SKILL.md:40`; root README `:800`, `:1384`, `:1447`; sk-code README table `:23`, `:55-57`, `:90`. | Low, coordinated prose edits in existing authoritative surfaces. | Packet-local examples can still become broken links after removal; R3 must handle those references. | Root README alone is cheaper but leaves the canonical SKILL sentence claiming exactly three surfaces, which downstream docs defer to. |
| R7: Document the authored `specs/sk-doc/z_archive/019-skill-routing-refactor/` closure as a re-mint prerequisite; do not relocate it in this change. | Existing adaptation/repair docs; the compiler currently resolves its authored implementation under `specs/`, and the COPY_A probe fails when that tree is pruned. | Low for an explicit limitation; moving the source closure would be a broad compiler, generator, test and CI migration. That broader cost is an inference until its consumers are inventoried. | Documentation does not let a user re-mint after pruning `specs/`. | “Just document it” fails if spec pruning is a required supported flow; in that case a separate cross-hub relocation change is necessary. No current evidence justifies making that broad change inside this research pass. |

## Questions Answered
- No strategy key question is fully closed by this pass. F20 is freshly confirmed, but the cost comparison remains conditional on whether external users must re-mint after pruning `specs/`.

## Questions Remaining
- Q10 remains partial: exact locations and candidate wording for R1/R4 were checked, but the complete file-by-file R1–R4 diff and residual validation matrix were not re-opened end to end.
- Q11 remains open: no complete survey of benchmarks, playbooks, feature catalogs, advisor fixtures, runtime mirrors, CI, install guides, release-engine keep-local rules, or clone-delete-add-doctor-route flow was performed.
- The prior X1–X9 rejection evidence was not independently re-run in this pass. Iterations 1–4 were not fully re-opened, and the five F18 doctor legs were not observed after a real slash-workflow update.

## Next Focus
This lineage has reached its configured iteration limit. A follow-up pass should first run `/create:skill-parent update --surfaces` in a disposable full-tree copy, capture the five doctor legs and a post-update route prompt, then finish the Q10/Q11 cross-file audit and re-open the omitted iteration 1–4 sources. If re-mint after pruning `specs/` is a required user journey, inventory compiler consumers before proposing a source relocation.

## Assessment
- New information ratio: 0.30.
- Novelty basis: three findings gained fresh partial evidence, principally the direct F20 reproduction and current source confirmation; the remaining findings restate known dependencies. The exhaustive lineage audit and workflow execution were not completed.
- Questions answered: none fully.
- Questions remaining: Q10, Q11 and the independent recheck of X1–X9.
- Edge cases: partial success; the command-driven add workflow was unavailable from this tool surface.
- Ruled out: treating static YAML as proof of the F18 doctor legs; treating the F20 re-mint path as available after `specs/` is removed.

## Reflection
- What worked and why: the isolated COPY_A deletion directly tested the known `specs/` dependency without touching the repository, and the current source reads distinguished static workflow promises from observed command behavior.
- What did not work and why: the initial iteration filename pattern omitted zero-padding, and the corrected multi-file search output truncated before all prior records could be reviewed. The slash command has no exposed direct executor here, so the required end-to-end `--surfaces` run could not be observed.
- What I would do differently: open each zero-padded iteration file individually and execute the exact auto/confirm workflow in a fresh full-tree copy before drawing conclusions about the five doctor legs.

## Sources Consulted
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:53,69-70`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:15-19,35-49`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-state.jsonl:2-10`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-strategy.md:47-54`
- `.skilled/skills/sk-code/ROUTER.md:352-379`
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:417-447`
- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:456-497`
- `README.md:798-802,1381-1386,1445-1451`
- `.skilled/skills/sk-code/SKILL.md:34-42`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:157-160`
- `.skilled/bin/compiled-route-sync.cjs:763-768`
- `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-76`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-005.md:22-27`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-008.md:13-14`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-009.md:16-29,34-40`

## SCOPE VIOLATIONS
None. The only mutation outside the repository was pruning `specs/` inside the authorized COPY_A throwaway tree. Repository writes are limited to this iteration file, its delta and the append gateway's state projection.
