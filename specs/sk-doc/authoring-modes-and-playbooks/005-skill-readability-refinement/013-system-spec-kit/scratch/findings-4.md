### .skilled/skills/system-spec-kit/references/structure/phase-definitions.md

- [P2] .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:17 | 3 | The intro inventories the document’s topics instead of giving a hook; some of those topics are absent from the overview. | Move the taxonomy, scoring, folder structure, lifecycle and validation coverage into the overview, then replace the intro with “Open this reference when deciding whether a specification qualifies for phase decomposition.”
- [P2] .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:23 | 4 | The overview starts with “What Are Phases?” instead of Purpose and When to Use. | Rename the first two H3s to `### Purpose` and `### When to Use`.
- [P2] .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:142 | 7 | This paragraph packs the parent requirements, child documents, optional decision record, save routing and metadata fields together. | Split it into bullets covering the lean trio, child-only documents, optional parent decision record, full-auto versus local save routing, the parent spec map and graph-metadata rollup.

### .skilled/skills/system-spec-kit/references/structure/phase-system.md

- [P2] .skilled/skills/system-spec-kit/references/structure/phase-system.md:17 | 3 | The intro summarizes the system rather than telling readers when to open the reference; its distinction between documentation levels and work decomposition is absent from the overview. | Add that distinction to the overview, then replace the intro with “Open this reference when checking whether work qualifies for phase decomposition.”
- [P2] .skilled/skills/system-spec-kit/references/structure/phase-system.md:23 | 4 | The overview has no Purpose or When to Use subsections. | Split its opening into `### Purpose` using the existing behavioral-overlay claim and `### When to Use` stating the two thresholds in §2; retain the existing coverage details after them.

### .skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md

- [P2] .skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md:16 | 3 | The intro restates the purpose instead of acting as a hook. | Replace it with “Open this reference when deciding whether to organize another iteration in a versioned sub-folder.”
- [P2] .skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md:26 | 4 | Important Note interrupts the required Purpose, then When to Use order. | Move lines 26–28 to after the When to Use list at line 35.
- [P2] .skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md:28 | 7 | This paragraph packs the suggestion trigger, generated folder contents, retired memory artifacts and root-document archival rules together. | Split it into bullets for the AI suggestion, `create.sh --subfolder` outputs, retired `[spec]/memory/*.md` artifacts and explicit root-document archival.
- [P2] .skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md:124 | 9 | Concrete numbered spec paths appear in the examples at lines 124, 132, 153, 207, 213–214 and 223. | Replace `specs/007-auth-system/` with `<spec-folder>/` and the numbered nested paths with `<parent>/<child>` placeholders.

### .skilled/skills/system-spec-kit/references/templates/level-selection-guide.md

- [P2] .skilled/skills/system-spec-kit/references/templates/level-selection-guide.md:16 | 3 | The intro repeats the title’s description instead of giving a hook. | Replace it with “Use this guide when choosing documentation depth for a task.”
- [P2] .skilled/skills/system-spec-kit/references/templates/level-selection-guide.md:22 | 4 | The overview starts with a command, without Purpose and When to Use subsections. | Add `### Purpose` with “Choose documentation depth from task complexity.” and `### When to Use` with “Use this guide when deciding whether to follow the complexity recommendation or set `--level N` directly.”

### .skilled/skills/system-spec-kit/references/templates/level-specifications.md

- [P2] .skilled/skills/system-spec-kit/references/templates/level-specifications.md:16 | 3 | The intro repeats the title and description rather than giving a hook. | Replace it with “Use this reference when checking which documents each spec level requires.”
- [P2] .skilled/skills/system-spec-kit/references/templates/level-specifications.md:22 | 4 | The overview starts with Template Architecture, without Purpose and When to Use subsections. | Add `### Purpose` with “Compare the requirements and template contents for each documentation level.” and `### When to Use` with “Use this reference when selecting or checking a spec’s documentation level.”
- [P2] .skilled/skills/system-spec-kit/references/templates/level-specifications.md:524 | 9 | Concrete spec-folder identifiers appear at line 257 and in the `specs/042-feature/` command examples at lines 524, 527, 530, 533 and 555. | Replace `012-user-profile-api/` and each `specs/042-feature/` with `<spec-folder>`.

### .skilled/skills/system-spec-kit/references/templates/template-guide.md

- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:16 | 3 | The intro restates the title and does not tell readers when to open the guide. | Put the selection, copying, adaptation and quality-standard scope in the overview, then replace the intro with “Open this guide when selecting a template set or adapting a rendered template.”
- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:22 | 4 | The overview starts with the progressive model, without Purpose and When to Use subsections. | Add `### Purpose` with “Use the manifest-backed templates to select, copy and adapt spec documents consistently.” and `### When to Use` with “Use this guide when choosing a template set or adapting one.”
- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:1011 | 2 | The adjacent bold labels “Parent Spec” and “Purpose” render as one paragraph. | Replace lines 1010–1011 with `- **Parent Spec:** \`<parent-spec-folder>/\`` and `- **Purpose:** Standardize all skills across the project`.
- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:182 | 7 | This paragraph combines scaffold flags, their level scope and the phase-specific goal behavior. | Replace it with separate bullets for `--with-lazy-addons`, `--with-goal`, their availability at every level, the `--phase` behavior and `/create:goal`.
- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:242 | 7 | The coordination-root exception packs five separate instructions into one paragraph. | Keep “If the spec is a coordination-root packet:” and put each action in its own bullet: replace the executive summary, include snapshot metadata, include the phase map, cross-reference the ADR and skip dependency graphs in favor of phase links.
- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:612 | 7 | This paragraph combines the retired memory surface, the writer’s role, recovery behavior and indexing behavior. | Split it into bullets for the retired standalone surface, `generate-context.js` updates, direct recovery reads, no re-indexing and no database marker.
- [P2] .skilled/skills/system-spec-kit/references/templates/template-guide.md:620 | 9 | Concrete spec paths appear at lines 620, 706, 763, 766, 774, 787, 792, 930, 985, 1010 and 1015. | Replace `specs/007-feature` and `specs/042-feature/` with `<spec-folder>`; replace `specs/122-skill-standardization/` with `<parent-spec-folder>` and its child path with `<parent>/<child>`.

### .skilled/skills/system-spec-kit/references/templates/template-style-guide.md

- [P2] .skilled/skills/system-spec-kit/references/templates/template-style-guide.md:16 | 3 | The intro repeats the description rather than giving a hook. | Replace it with “Open this guide when creating, editing or validating a system-spec-kit template.”
- [P2] .skilled/skills/system-spec-kit/references/templates/template-style-guide.md:22 | 4 | The overview starts with Core Principle, and When to Use follows it; Purpose is missing. | Add a Purpose subsection before the existing When to Use subsection, move When to Use above Core Principle and retain the inventory after them.

### .skilled/skills/system-spec-kit/references/validation/decision-format.md

- [P2] .skilled/skills/system-spec-kit/references/validation/decision-format.md:17 | 3 | The intro repeats the description instead of giving a hook. | Replace it with “Use this reference when recording a workflow gate decision and its evidence.”
- [P2] .skilled/skills/system-spec-kit/references/validation/decision-format.md:23 | 4 | The overview has no Purpose or When to Use subsections. | Add `### Purpose` with “Record gate decisions in a consistent, auditable format.” and `### When to Use` with “Use this format when documenting a workflow gate outcome and its evidence.”
- [P2] .skilled/skills/system-spec-kit/references/validation/decision-format.md:302 | 5 | The dual-threshold decision rule appears after the examples it governs. | Move the entire Dual-Threshold Validation section before Examples; renumber it to §4, Examples to §5 and Session Decision Log to §6.
- [P2] .skilled/skills/system-spec-kit/references/validation/decision-format.md:272 | 7 | The Session Decision Log paragraphs bundle several independent rules about optionality, template scaffolding, save behavior, anchors and ADR checks. | Split lines 272–273 into bullets covering optionality, authoring-only status, template scaffolding, each table’s anchor and contents, the ADR-check exclusion and the save-workflow source.
- [P2] .skilled/skills/system-spec-kit/references/validation/decision-format.md:158 | 9 | Concrete spec paths appear in examples at lines 158, 198, 212 and 235–237. | Replace those paths with `<spec-folder>` placeholders; preserve the dated Session Decision Log entries.