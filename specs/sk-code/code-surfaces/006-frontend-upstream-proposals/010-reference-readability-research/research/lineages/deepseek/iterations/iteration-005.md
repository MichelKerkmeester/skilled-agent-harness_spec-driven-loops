# Iteration 5: sk-code-review References and Assets

## Focus

Audit `.skilled/skills/sk-code/sk-code-review/` — `SKILL.md`, `ROUTER.md`, four references and six checklist assets — for split link sections, mixed numbering, index omissions and missing closing sections.

## Actions Taken

1. Read `pr-state-dedup.md` and `quick-reference.md` end to end.
2. Extracted the heading map of `review-core.md`, `review-ux-single-pass.md` and the six assets.
3. Read `SKILL.md` §5-§9 to compare its two link sections and the position of the related section.
4. Read the tails of the three checklists that appeared to lack a closing section, to avoid a false omission finding.

## Findings

1. `SKILL.md` carries two separate link inventories and puts the related section before live content: `## 5. REFERENCES` at 262 lists ten files, `## 8. RELATED RESOURCES` at 324 lists a second entry path, and `## 9. PR-STATE EFFICIENCY GATES` at 342 follows the related section. A reader looking for the PR-state gate is sent past the "related resources" close, and the same file list appears twice. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:262] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:324] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:342]

2. `pr-state-dedup.md` mixes one numbered section with a run of unnumbered peers: `## 1. OVERVIEW` at 17 is followed by `## Signature Computation` (21), `## Cache Format` (42), `## Pathspec Scope` (59), `## Retention` (71), `## Skip Behavior` (78), `## Cache Write` (90) and `## Cache Location Rationale` (94). The document implies a numbered structure and then abandons it after the first section. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:17] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:21] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:42]

3. `quick-reference.md`'s `## 3. SUPPORTING CHECKLISTS` table lists five checklists but omits `fix-completeness-checklist.md`, which exists in `assets/` and is listed in `SKILL.md` §5. The index that promises to route consumers to the correct checklist therefore cannot route them to the fix-completeness one. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/quick-reference.md:44] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/quick-reference.md:48] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:272]

4. `pr-state-dedup.md` ends on `## Cache Location Rationale` (94) with no Related Resources section, even though it is the reference `SKILL.md` §9.1 points at; the reader reaches the last bullet with no link back to `review-core.md` or `quick-reference.md`. [SOURCE: .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:94] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:342]

## Ruled Out

- Claiming the three checklist assets lack a closing related section: their tails carry link lists under a related heading, so the omission is specific to `pr-state-dedup.md`.
- Treating `review-core.md` §9's long Python resolver as misplaced: it is an executable contract the section names, not unrelated prose.
- Treating `quick-reference.md`'s `### Usage` heading as a template violation on its own: the deeper defect is the incomplete table, not the heading name.

## Dead Ends

- Looking for adjacent bold labels in the review references: the packet uses bullets and tables, so the class is absent here.

## Edge Cases

- Ambiguous input: `SKILL.md` §5 and §8 could be read as "core references" versus "related resources"; the finding only claims the duplication and the placement before §9, not that either section is redundant on its own.
- Contradictory evidence: `quick-reference.md` claims to be the routing index while `SKILL.md` §5 is the fuller list, so the two indexes disagree on coverage.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/SKILL.md:255-419`
- `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:1-99`
- `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md:1-63`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md:16-405`
- `.skilled/skills/sk-code/sk-code-review/assets/*.md` heading maps and tails

## Assessment

- New information ratio: 0.80
- Questions addressed: review reference and asset structure, index completeness, closing sections.
- Questions answered: "Which sk-code-review references and assets carry the enumerated rendering defects or structural divergence, and at which exact lines?"

## Reflection

- What worked and why: comparing the index table against the assets directory found an omission a heading scan cannot see, because the omitted file has no row to inspect.
- What did not work and why: the first pass suspected three assets of missing related sections; reading their tails showed link lists under a heading the truncated map had hidden, so the claim was narrowed to one file.
- What I would do differently: diff every index table against `ls` of the directory it claims to index, in every family.

## Recommended Next Focus

Iteration 6: `sk-code-skilled`, the largest family (~45 references and ~20 checklist assets), to test whether the defects are systematic across a file family.
