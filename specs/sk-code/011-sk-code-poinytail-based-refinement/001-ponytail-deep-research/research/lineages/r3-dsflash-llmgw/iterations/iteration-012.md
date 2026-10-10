# Iteration 12: sk-code-quality fresh pass

## Focus

Part 3 opens with the quality mode: its SKILL claims against the scripts on disk and against the corrected hook naming elsewhere in the tree, its stale packet vocabulary, and the in-flight items it must not be charged for. This is the first Part 3 iteration and follows Part 2's Recommended Next Focus.

## Actions Taken

1. Read `sk-code-quality/SKILL.md` §§2-3 (resource levels, target-path map, gates, router projection) and the scripts README.
2. Verified every path in the resource-level table and the target-path map against disk.
3. Compared the comment-hygiene gate table with the corrected hook naming in the OpenCode universal-patterns file.
4. Read the observed `core.hooksPath` value for the hook-identity question.
5. Counted the stale packet-name rows and checked the ceiling-report situation against phase 009's declared scope.

## Findings

1. **The quality mode — the mode that owns the comment-hygiene gate — points operators at the legacy hooks, and the shared universal standard repeats the same stale names.** `sk-code-quality/SKILL.md` names the write-time warning as `scripts/hooks/claude-posttooluse.sh` and the pre-commit block as `.skilled/hooks/git/pre-commit` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:130] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:131], and `code-quality-standards.md` §7 says the same [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:138] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:139]. The OpenCode naming file states the opposite: the installed hook is `.skilled/scripts/git-hooks/pre-commit` (the `core.hooksPath` selection) and the live write-time adapter is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, while the two older files "remain compatibility helpers for direct tests only; neither is an installed runtime hook" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:243] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:246]. Both files exist on disk, so a reader cannot tell which statement is current without the third document. Reproducing case: `rg -n "claude-posttooluse.sh|hooks/git/pre-commit" .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md` prints two claims that cannot both be current. NEW, P1 (the gate an operator is told will block a commit may not be the gate that runs; one naming sweep fixes both files).
2. **The quality mode carries the same pre-rename packet vocabulary as the review mode, at higher volume.** `code-webflow` / `code-opencode` appear as the surface skill names and `code-review` as the findings mode in 39 rows of `sk-code-quality/SKILL.md` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:15] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:39] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:50]. The canonical keys are `sk-code-webflow`, `sk-code-opencode`, `sk-code-review` [SOURCE: .skilled/skills/sk-code/mode-registry.json:61] [SOURCE: .skilled/skills/sk-code/mode-registry.json:79] [SOURCE: .skilled/skills/sk-code/mode-registry.json:42]. Reproducing case: `rg -c "code-webflow|code-opencode|code-review" .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints 39, and none of those keys exists in `mode-registry.json`. NEW, P2 (same class as f-iter006-003, now confirmed as a mode-wide rename miss rather than a review-mode slip).
3. **The ceiling report's absence from this SKILL is phase 009's declared scope, recorded as in-flight.** `rg -n -i "ceiling"` over `sk-code-quality/SKILL.md` exits 1 while the report and its test ship in `scripts/` and the scripts README lists them [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/README.md:23]. Phase 009 child 002 lists the ceiling report in this SKILL with a version bump (steer ruling 2). IN-FLIGHT, no action, no further budget.
4. **The mode's resource paths all resolve.** Every path in the resource-level table and the target-path map exists on disk, including the system-spec-kit spec-folder checklist and all nine OpenCode authoring checklists [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:103]. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- None fully. Part 3's quality leg is mapped; the hook-naming contradiction is the actionable item.

## Questions Remaining

- The same fresh pass over `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`, the hub files, `benchmark/` and the root playbook.

## Ruled Out

- **"File the ceiling-report absence."** It is phase 009 child 002's scope; recorded in-flight above.
- **"Treat the legacy hook files' existence as evidence they are live."** Existence proves only that the compatibility helpers were kept, which the naming file states.
- **"Re-run the comment-hygiene checker."** Phase 004/007 already exercised it; the finding is about which gate the docs name, not the checker's behaviour.

## Dead Ends

- The quality mode's thin prompt-intent router block is explicitly documentation of a retired benchmark lane; its `RESOURCE_MAP` matches the router guard's expectations. No finding.
- `scripts/hooks/README.md` and `scripts/lib/README.md` exist and match their folders; no orphan.

## Edge Cases

- Ambiguous input: whether an operator follows the quality SKILL's names or the naming file's. Chosen interpretation: the naming file is the corrected statement because it names the `core.hooksPath` selection; the quality SKILL is the stale one.
- Contradictory evidence: none beyond Finding 1, filed.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-quality/SKILL.md`
- `.skilled/skills/sk-code/sk-code-quality/scripts/README.md`
- `.skilled/skills/sk-code/sk-code-quality/scripts/{check-comment-hygiene.sh,check-dist-staleness.sh,ceiling-report.sh}` (existence and README rows)
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
- `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`
- `.skilled/skills/sk-code/mode-registry.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.85 (two fully new findings, one IN-FLIGHT record, one ALREADY-ADOPTED path check).
- Questions addressed: none closed.
- Questions answered: none.

## Reflection

- What worked and why: reading the mode that owns a gate next to the file that corrected the gate's naming. The contradiction needed both documents in the same read.
- What did not work and why: the first sweep looked for broken paths and found none; the value was in checking the paths' *claims*, not their existence.
- What I would do differently: for every enforced gate a document names, resolve the named file and ask which other document names a different file for the same gate.

## Recommended Next Focus

`sk-code-webflow`: the checker's known-bad coverage, the assets and templates the resource map loads, and any stale claims after the Motion overlay consolidation.
