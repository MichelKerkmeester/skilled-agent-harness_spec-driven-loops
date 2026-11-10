# Iteration 4: sk-code-quality References

## Focus

Audit `.skilled/skills/sk-code/sk-code-quality/` references — `code-style-guide.md`, `quality-config.md`, `runner-contract.md` — plus `SKILL.md` and `ROUTER.md` for structural divergence, wall-of-text layout and missing closing sections.

## Actions Taken

1. Extracted the heading map of the three references, `SKILL.md` and `ROUTER.md`.
2. Read `quality-config.md` §1-§3 including the fenced `## Rule overrides` example.
3. Read `code-style-guide.md` §1 and the commenting section around lines 110-125.
4. Measured paragraph lengths in both files and read the tail of `runner-contract.md` to confirm whether a Related Resources section exists.

## Findings

1. Two of the three quality references end without a Related Resources section: `runner-contract.md` stops at the dist adapter (`## 8. DIST ADAPTER`, 269) and `quality-config.md` stops at `## 10. KNOWN LIMITS` (196), while only `code-style-guide.md` closes with `## 7. RELATED RESOURCES` (189). The asset template says a related section, when present, must be last; a 278-line contract with no next-step links leaves the reader at the end of the deepest file in the packet. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:269] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/quality-config.md:196] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md:189] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166]

2. `runner-contract.md` renders as walls of text: single prose lines reach 1,296 characters at line 53, 780 at 55, 971 at 103, 1,657 at 113 and 815 at 118. Each is one paragraph in the rendered page, and the longest mixes the guard's hash inputs, the ignored-path measurement and the reason for the bound in one block, so a reader cannot scan the option-to-effect mapping the section is supposed to provide. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:113] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:118]

3. `quality-config.md`'s entire OVERVIEW is one 121-word paragraph at line 18 with no `### Purpose` and no `### When to Use`, so the first section states behavior, scope, CI interaction and failure mode in a single block before the reader knows whether the file applies to them. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/quality-config.md:16] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/quality-config.md:18]

4. `code-style-guide.md` compresses a rule id, its rationale, and a before/after pair into one 408-character paragraph at line 116: `**CHK-CMT-07 (P1):** ... Before: `// this check used to live in the old loader`. After: `// skips blank lines so the count stays true`.` The template's before/after pattern expects a code block, so the contrast the rule depends on is buried mid-paragraph. [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md:114] [SOURCE: .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md:116]

## Ruled Out

- `quality-config.md:99` looked like a stray unnumbered `## Rule overrides` heading, but it sits inside a fenced markdown example; the fence-aware scan excludes it.
- Counting `SKILL.md` §8 REFERENCES AND RELATED RESOURCES as misplaced: it is the last section of the skill body, which matches the skill template's expectation.
- Treating the `runner-contract.md` CLI tables as the overview: they are the section content, which is the defect, not evidence that an overview exists.

## Dead Ends

- Looking for bare URLs or adjacent bold labels in this family: none at HEAD, because these documents use bullets and tables rather than label paragraphs.

## Edge Cases

- Ambiguous input: "related section" for the quality packet could point at the shared rule-overrides contract or the parent router; the finding only claims the section is absent, not which target it should name.
- Contradictory evidence: `code-style-guide.md` has a related section while its two siblings do not, so the packet is internally inconsistent rather than uniformly missing it.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:1-278`
- `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md:1-204`
- `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md:1-195`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:10-324`
- `.skilled/skills/sk-code/sk-code-quality/ROUTER.md:14-116`
- `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:166`

## Assessment

- New information ratio: 0.80
- Questions addressed: quality reference structure, layout and closing-section coverage.
- Questions answered: "Which sk-code-quality references carry the enumerated rendering defects or structural divergence, and at which exact lines?"

## Reflection

- What worked and why: measuring line length turned a vague "dense" impression into exact evidence and separated a real layout defect from a stylistic preference.
- What did not work and why: the heading scan cannot see missing sections, because an absent heading produces no row; reading the file tails was required.
- What I would do differently: check for the closing related section in every family before scanning headings, since omission is invisible to a heading-based detector.

## Recommended Next Focus

Iteration 5: `sk-code-review` references and assets, where iteration 1 already found RELATED RESOURCES before a later `9. PR-STATE EFFICIENCY GATES` section and a second link list at `## 5. REFERENCES`.
