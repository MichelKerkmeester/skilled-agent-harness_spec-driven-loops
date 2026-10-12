# Iteration 7: Q11 external surface assumptions outside the hub

## Focus

Investigate Q11's external tooling and user-flow assumptions outside the sk-code router. The dispatched Q11 focus takes precedence over strategy.md's Q10 Next Focus. Scope includes catalogs, manual playbooks, quality references, advisor fixtures, benchmark reports, runtime mirrors and the first doctor failure an external user sees after deleting examples.

## Actions Taken

- Read config, state log, strategy, registry, dashboard, the preceding iteration and the round-one synthesis before searching. Config session identity is `dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z`; the state projection held six canonical iteration records and iteration-007.md plus iter-007.jsonl were absent at the pre-write check. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-config.json:35-38] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/deep-research-state.jsonl:2-10]
- Ran the trigger-index lookup and bounded `rg -n -i` searches across runtime, advisor, benchmark, command and root-document paths. The broad exact-name scan found hard references in the feature catalog, manual-testing playbooks, quality materials and OpenCode/Hermes mirrors; the category-targeted scan did not return direct hits in `.github/` or `.skilled/commands/doctor/scripts/release-update.cjs`.
- Read the feature-catalog entries, a Webflow manual scenario, quality-mode resource maps, the two runtime-mirror surface tables, one archived benchmark report, the advisor fixture and the doctor's missing-packet branch.
- No throwaway copy or test/CI run was performed. The reduced-scope retry directs skipping a copy experiment unless it is the entire focus; this iteration was a cross-cutting inventory, not an isolated deletion test. The bounded search did not prove that no other references exist. Bash's rendered responses showed matching lines but not numeric exit codes, so no search exit status is claimed.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| DOC | The sk-code feature catalog calls the registry contents the current live surface inventory and says exactly Webflow, OpenCode and Obsidian are live. After a user removes the two examples, the catalog's present-tense inventory is false even if routing works. | [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:15] [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:35] | P1 |
| BREAK | The manual Webflow-plus-Motion playbook hard-requires WEBFLOW and exact paths/assets below `sk-code-webflow`; its pass condition requires those paths to load. Removing that example makes this scenario un-runnable against the adapted tree, not a generic routing regression. | [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/webflow-plus-motion-dev.md:33-56] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/webflow-plus-motion-dev.md:88-105] | P1 |
| BREAK | The quality mode still routes Obsidian plugin work to checklists under `sk-code-obsidian`, and its frontend quality reference list points into `sk-code-webflow`. If either example is removed without relocating or retiring these consumers, those target-specific quality paths lead to missing material. | [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:113] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:129-132] [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:50-54] | P1 |
| DOC | The `.opencode` and `.hermes` sk-code mirrors still state that the hub has exactly three surfaces and list the two example packets. A mirror left unsynchronized after canonical removal would keep advertising deleted paths and its own surface count would contradict the adapted hub. This is a conditional mirror-drift risk; no mirror-refresh command was run. | [SOURCE: .opencode/skills/sk-code/SKILL.md:15] [SOURCE: .opencode/skills/sk-code/SKILL.md:36-42] [SOURCE: .hermes/skills/sk-code/SKILL.md:20] [SOURCE: .hermes/skills/sk-code/SKILL.md:41-45] | P1 |
| DOC | An archived compiled-routing benchmark report says PASS while recording zero scored/eligible rows; its two rows are `routed-to-gold (code-webflow)`. It is not a deletion test and should not be presented as evidence that an example-pruned tree passes. | [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md:5] [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md:21-27] [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/results.csv:3-4] | P2 |
| OK | The advisor plugin test's Obsidian/Webflow cases create marker files in fresh temporary workspaces and assert the `surfaceHint`; they do not require the sk-code example packet folders. Keep these detector fixtures. Likewise, the standalone `webflow cms` scorer rule routes to `mcp-code-mode`, not the sk-code surface, so removing that phrase would change unrelated MCP routing. | [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts:661-682] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:131] | P2 |
| DOC | The external user-facing missing-packet error is exactly `3c: mode "${label}" packet "${packet}" is not an existing sub-directory`. This branch emits the mismatch but no recovery step, so a user who deletes only the packet learns what failed but not how to restore, unregister or replace it. This is new direct-source confirmation of round-one F33, not a new failure mode. | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497] | P1 |

## Options and Recommendations

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Candidate: extend the existing parent-skill command for a verified surface-removal operation | Extend `/create:skill-parent update --surfaces`, currently create/update-only in its argument contract, to reconcile removal consumers and generated/mirrored outputs: `.skilled/commands/create/skill-parent.md:2-3`. | Medium: widen an existing workflow to coordinate multiple stores and gates. | Partial automation could leave a stale route or mirror while reporting success; require a final doctor/drift-gate receipt. | A checklist costs less and remains appropriate for one-off expert use, but it leaves users to synchronize registry, routes, quality/playbook references and runtime copies by hand without one success signal. Prior evidence also says the present command does not implement removal: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-006.md:33]. This is a candidate for a later controlled experiment, not a proven recommendation. |

## Questions Answered

- None fully. The scan found concrete missed cross-cutting consumers but did not exercise their behavior after deletion or establish a complete repository-wide inventory.

## Questions Remaining

- Q10: exact R1-R4 edit set and minimum scope.
- Q11: verify which located tooling actually fails after deletion, inspect any remaining runtime/release-engine hits and complete the clone-delete-add-doctor-route flow.
- Q12: challenge X1-X9 and identify new rejections.

## Ruled Out

- Treating the archived benchmark PASS as a deletion-test result: its own report has zero eligible/scored rows and routes gold to the Webflow example.
- Treating advisor Obsidian/Webflow marker fixtures as dependencies on installed sk-code packets: the test builds temporary workspaces and asserts the hint value directly.

## Dead Ends

- None established. Deletion-dependent manual and quality paths still need a bounded throwaway-copy check.

## Edge Cases

- Ambiguous input: dispatch explicitly selects Q11 while strategy Next Focus still says Q10; followed the dispatched focus.
- Contradictory evidence: none newly resolved.
- Missing dependencies: none for the source review.
- Partial success: static inventory completed; the copy deletion test and CI/test execution were intentionally deferred under the reduced-scope retry instruction.

## Sources Consulted

- `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:15,35`
- `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/webflow-plus-motion-dev.md:33-56,88-105`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:113,129-132`
- `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:50-54`
- `.opencode/skills/sk-code/SKILL.md:15,36-42`
- `.hermes/skills/sk-code/SKILL.md:20,41-45`
- `.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md:5,21-27`
- `.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/results.csv:3-4`
- `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts:661-682`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:131`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497`
- `.skilled/commands/create/skill-parent.md:2-3`

## Assessment

- New information ratio: 0.71 (three fully new cross-cutting surfaces and four partially new checks or qualifications across seven findings).
- Questions addressed: Q11 inventory slice.
- Questions answered: none in full.
- Edge cases: partial success; no deletion-copy test was run.

## Reflection

- What worked and why: an exact-name search across non-example runtime, tool and documentation paths surfaced consumers beyond the hub itself, especially the feature catalog, quality references and mirrored skill files.
- What did not work and why: no copy run means the static dependency list does not prove which playbook or quality failure is observed at runtime, and the bounded search cannot close the end-to-end journey.
- What I would do differently: use the next iteration to test the highest-risk static consumers in one fresh copy and capture the first doctor output plus one adapted routing prompt, while separately checking the remaining mirror and release-engine inventory.

## Recommended Next Focus

Run a bounded deletion check for the quality references and one Webflow manual scenario, then continue the external user path through surface registration, doctor and one routing prompt. Confirm whether `.opencode` and `.hermes` mirrors are regenerated by the same supported command before recommending automation.

## SCOPE VIOLATIONS

None. No repository source, example surface, runtime mirror, test or release file was modified. Only this iteration narrative, its delta and the append gateway's state projection are authorized writes.
