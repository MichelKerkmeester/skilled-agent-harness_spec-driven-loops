# Iteration 4: Surface overrides, detection edges, and registry vocabulary

## Focus

Part 1, fourth slice, and the first Part 3 probe: what the surface packets actually override from the shared universal tier, which detection edge cases have no test (mixed stacks, two-surface collisions), and whether the registry files describe the surface set they carry. This follows iteration 3's Recommended Next Focus.

## Actions Taken

1. Read `mode-registry.json` end to end; checked each `toolSurface` against the packet `allowed-tools` frontmatter.
2. Read the canary corpus (`canary-cases.v1.json`) case by case and counted the surface-detection scenarios.
3. Swept `stack-detection.md` §4 test rows and the three surface `SKILL.md` precedence statements.
4. Read two surface files that carry standards of their own: `sk-code-webflow/references/shared/enforcement.md` and `sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`.
5. Followed the comment-quantity rule from the OpenCode universal-patterns file through every language guide and checklist that repeats it, and checked whether any checker enforces it.

## Findings

1. **The OpenCode surface enforces a comment budget the shared universal tier does not have, and nothing measures it.** The rule "Maximum 3 comments per 10 lines of code" appears in `sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:170` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:170], in every language style guide (JavaScript, TypeScript, Python, Shell, config), and in five checklists as "max 3 comments per 10 LOC" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/checklists/typescript-checklist.md:113]. The shared universal guide, which the hub calls the contract the surface checklists implement [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:122], has no quantity rule at all — it defaults to no comments and requires a comment only for hidden constraints and invariants [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:109]. The comment-hygiene checker tests content, never counts. Reproducing case: a 10-line security block with four durable WHY comments (the shape `code-style-guide.md` §4 requires) passes comment hygiene, passes the universal guide, and violates the checklist row; `rg -n "3 comments per 10|max 3 comments per 10" .skilled/skills/sk-code --glob "!benchmark/**"` prints fourteen rows across thirteen files, and `rg -n "comment.*count|count.*comment" .skilled/skills/sk-code/sk-code-quality/scripts/` finds no enforcing script. NEW, P2 (a surface rule with no owner in the shared contract, no gate, and a direction opposite to the durable-WHY floor it sits beside).
2. **A live OpenCode reference still carries a packet-number pointer in its own prose.** `naming-and-commenting.md:283` reads "Carry-over from 139: keep rule constants centralized and test imports referencing those constants" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:283]. The file's own §4 declares ephemeral-artifact pointers forbidden in comments and calls that gate a HARD BLOCK [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:235] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:239]; the pointer is in documentation, not a code comment, so no hook scans it, but it is exactly the dangling-reference class the rule exists to stop. Reproducing case: `rg -n "Carry-over from" .skilled/skills/sk-code --glob "!benchmark/**"` prints this one row and no other. NEW, P2.
3. **The mode registry's own description omits the third surface it registers.** `mode-registry.json` line 5 describes the surface axis as "(sk-code-webflow/sk-code-opencode)" [SOURCE: .skilled/skills/sk-code/mode-registry.json:5] while the `extensions.surface-axis.surfaces` array three lines later lists all three including sk-code-obsidian [SOURCE: .skilled/skills/sk-code/mode-registry.json:19], and the modes array carries its full entry [SOURCE: .skilled/skills/sk-code/mode-registry.json:98]. The same stale two-surface phrasing recurs in `shared/README.md:17` (filed in iteration 1). Reproducing case: `rg -n "sk-code-webflow/sk-code-opencode" .skilled/skills/sk-code/mode-registry.json` prints line 5; `rg -n "sk-code-obsidian" .skilled/skills/sk-code/mode-registry.json` prints lines 19, 98, 107-110. NEW, P2 (documentation drift in the routing source of truth).
4. **No test covers an OBSIDIAN-versus-WEBFLOW collision, the one precedence decision that needs it.** `stack-detection.md` §4 has rows for a Webflow repo, an Obsidian repo, mixed `.skilled/` targets and mixed Webflow-library targets [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:131], but none where a single target set satisfies both the Obsidian repo-root markers and a Webflow marker, which is the case the "OBSIDIAN sits above WEBFLOW" rationale exists for [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:77]. The canary corpus's eleven cases include two surface bundles and one Obsidian single, but no prompt or target set with both marker families [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:58]. Reproducing case: `python3 - <<'EOF'` over the fixture's `cases[].id` prints surface-bundle-reference, surface-bundle-obsidian, single-webflow, single-obsidian and no collision case; the stack-detection §4 table's eleven rows likewise carry no combined row. NEW, P2 (untested precedence edge; a wrong order here would route either an Obsidian plugin review through Webflow standards or a Webflow repo through Obsidian evidence, both silent).
5. **A Webflow enforcement file keeps a stale link label while pointing at the right target.** `enforcement.md:310` renders `[../../../assets/webflow/checklists/code-quality-checklist.md](../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md)` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md:310]. The target resolves (the checklist file exists under `sk-code-quality/assets/code-quality-checklist/`), but the label text is the pre-move path, so every reader who copies the label lands on a missing file. Reproducing case: `test -f .skilled/skills/sk-code/assets/webflow/checklists/code-quality-checklist.md` returns no; the rendered link's target exists. NEW, P2 (stale-label residue of the same legacy family iteration 2 filed for the shared tier).

## Questions Answered

- Key question 4 is answered for the collision and override legs: the registry and packets agree on tool surfaces and precedence today (no silent override conflict found beyond the comment-budget rule), and the missing test is named. One leg remains open — whether any surface overrides a *shared* rule with a weaker one beyond the comment budget.

## Questions Remaining

- Do the Webflow `references/shared/cross-language-rules.md` rules restate or contradict the universal style guide the same way the OpenCode naming file does?
- Which of the two "universal" tiers wins when both load on one OpenCode quality route — the shared `universal/*` contract or the packet's `references/shared/universal-patterns/*`?

## Ruled Out

- **"Report the 3-per-10 cap as a P0 gate defect."** No checker gates comments by count, so nothing can fail on it; the finding is that the rule is unowned, not that a gate is broken.
- **"Report the toolSurface entries as conflicting with the packet frontmatter."** `sk-code-quality` (Read/Edit/Bash/Grep/Glob, no Write) and `sk-code-review` (Read/Bash/Grep/Glob/Write, no Edit) match their SKILL.md frontmatter exactly [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:4] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:4].
- **"Count the stale two-surface phrasing as a wording relic only."** It is filed because `mode-registry.json` is the routing source of truth the hub reads at runtime; the sentence is read by operators far more often than the modes array.

## Dead Ends

- The compiled-routing library's scoring internals were not opened; the canary corpus is the contract surface the run watches, and it was checked directly.
- `sk-code-obsidian/SKILL.md`'s precedence statement matches the shared order [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:31]; no conflict there.

## Edge Cases

- Ambiguous input: whether a checklist row that says "max 3 comments per 10 LOC" is a gate or advice. Chosen interpretation: the checklists are gates, which is why Finding 1 is filed against the contract rather than the checker.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/mode-registry.json`
- `.skilled/skills/sk-code/hub-router.json`
- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/shared/references/stack-detection.md`
- `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`
- `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/typescript-checklist.md`
- `.skilled/skills/sk-code/sk-code-webflow/references/shared/enforcement.md`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.90 (five fully new findings, no reconfirmations).
- Questions addressed: key question 4 (collision and override legs).
- Questions answered: key question 4, with one leg deferred to the next iteration.

## Reflection

- What worked and why: following one rule (the comment budget) from its statement through every repetition to the absence of a checker. The repetition count is what makes the finding real; one row alone would be a style preference.
- What did not work and why: the first sweep for surface overrides searched for the word "override" and found only the review mode's `surface_overrides` list; the actual overrides are implicit repeats, which is why the comment budget was found by reading a surface standards file rather than by grep.
- What I would do differently: build the override inventory by diffing shared standards against each surface's standards file section by section, not by keyword.

## Recommended Next Focus

The remaining Part 1 leg: read `sk-code-webflow/references/shared/cross-language-rules.md` and `sk-code-opencode/references/shared/*` against the shared universal tier to finish the override inventory, then close Part 1's open questions.
