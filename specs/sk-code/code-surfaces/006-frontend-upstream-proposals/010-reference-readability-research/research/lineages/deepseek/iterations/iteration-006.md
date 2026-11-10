# Iteration 6: sk-code-skilled References and Checklist Assets

## Focus

Audit the largest family — `.skilled/skills/sk-code/sk-code-skilled/` with roughly 45 references and 20 checklist assets — for systematic divergence across a file family, using the boilerplate signal found by the corpus-wide scan.

## Actions Taken

1. Extracted heading maps for `SKILL.md`, `ROUTER.md`, the rust split-reference sets and the checklist assets.
2. Read the OVERVIEW block of all seven rust style-guide files and compared them.
3. Counted the boilerplate purpose sentence and the shared When-to-Use bullet across the reference tree.
4. Read `alignment-verification-automation.md` §4-§6 and the shell style guide around the repeated evidence labels.
5. Read one rust checklist asset to test whether the boilerplate reaches the assets too.

## Findings

1. The rust split references repeat a content-free overview: 14 files carry the sentence "Provides focused Rust guidance for <topic> in the OpenCode development environment" followed by the same three When-to-Use bullets ("Implementing or reviewing Rust code covered by this topic", "Preserving TypeScript interoperability and deterministic behavior", "Applying the corresponding Rust standards at an implementation boundary"). Thirteen of the fourteen say nothing a reader could not infer from the file name; only `rust/style-guide/overview-and-file-header.md` states a specific purpose and specific triggers. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/naming-conventions.md:22] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md:22] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:22] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md:22]

2. `sk-code-skilled/SKILL.md` repeats the `2b` numbering defect seen in `sk-code-ci`: `## 2b. SMART ROUTING` sits between §2 and §3 at line 110, so the same authoring-history habit appears in two packets rather than once. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:110] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:37] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:120]

3. The same skill body welds qualifiers into H2 headings: `## 4. ASSETS AND OTHER SURFACE AREAS — ON-DEMAND` at line 148 combines three concepts (assets, other surface areas, on-demand loading) in one heading, so the table of contents gives no single reader task for the section. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:148]

4. `alignment-verification-automation.md` puts `## 5. RELATED RESOURCES` at line 139 and then continues with `## 6. ALIGNMENT AUTHORITY INTERFACE` at 148, so the related section interrupts the document's authority contract rather than closing it. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:139] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:148]

5. `shell/style-guide/overview-structure-and-naming.md` renders two consecutive `**Evidence**:` label paragraphs for one rule at lines 170 and 172, with no blank-line separation issue but no merge either; the reader sees the same label twice and has to infer that both paths prove the same exception. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:170] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:172]

## Ruled Out

- Treating the repeated `### Scope`, `### Exempted Standards` and `### What Still Applies` headings in `security-testing-and-exemptions.md` as duplication: the repeat is deliberate parallel structure for two exemption tiers, and both instances carry distinct content.
- Treating the same `**Evidence**:` path in `overview-modules-and-docs.md:137` and `:155` as a duplicate paragraph: two different rules cite the same implementation file, which is legitimate shared evidence.
- Treating the checklist assets as boilerplate: their Purpose paragraphs are specific (`This split checklist protects DTO, error, panic, unsafe-code ... boundaries`), so the boilerplate is confined to the references.

## Dead Ends

- A file-by-file read of all 45 skilled references: the boilerplate and heading signals are dense enough to characterize the family, and reading every rule body would not change the structural verdict.

## Edge Cases

- Ambiguous input: "systematic across a file family" was operationalized as a repeated phrase or heading pattern in at least five files of one split family; the rust set meets it with fourteen.
- Contradictory evidence: the same rust reference set has one specific overview (`overview-and-file-header.md`), so the family is not uniformly boilerplate even though the majority is.
- Missing dependencies: none.
- Partial success: the audit sampled the rust, shell and shared families and did not read every typescript or python rule body; the count-based claim is corpus-wide, the line-level citations are sampled.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/*.md` (all seven OVERVIEW blocks)
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/*.md` and `rust/quick-reference/*.md` (boilerplate count)
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:130-160`
- `.skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:160-180`
- `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md:195-270`
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md:15-30`
- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md:11-198`

## Assessment

- New information ratio: 0.70
- Questions addressed: skilled reference family systematization, skill-body numbering, related placement.
- Questions answered: "Which sk-code-skilled references and checklist assets carry the enumerated defects, and is the divergence systematic across a file family?"

## Reflection

- What worked and why: counting a boilerplate sentence across the tree turned a suspicion into a family-level finding with an exact numerator (14 files) and a named exception.
- What did not work and why: the heading scan alone could not distinguish deliberate parallel structure from duplication; reading the two exemption tiers was needed to avoid a false positive.
- What I would do differently: run the phrase-count check on every family at the start, because boilerplate is the cheapest systematic-defect signal in a large corpus.

## Recommended Next Focus

Iteration 7: the validator and template gap — read `validate_document.py`, the sk-doc authoring guidance and the sk-create-skill scripts to trace, check by check, why each confirmed defect class passed validation.
