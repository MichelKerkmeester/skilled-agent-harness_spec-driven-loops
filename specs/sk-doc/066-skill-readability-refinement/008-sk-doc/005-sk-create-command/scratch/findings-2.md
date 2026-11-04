### .skilled/skills/sk-doc/sk-create-command/references/common-pitfalls.md
- [P2] .skilled/skills/sk-doc/sk-create-command/references/common-pitfalls.md:23 | 4 | The OVERVIEW is a single paragraph with no Purpose or When to Use subsection, and its first sentence nests two failure modes and four defect examples behind two colons; the reference template's overview opens with Purpose and When to Use. | Replace line 23 with:

  ```markdown
  ### Purpose

  This reference guards two failure modes: the wrong component and the recurring command-authoring defects. A draft that passes this check is the right component, gates its required input, lists only the tools it needs, keeps `description` on one line, and leaves display wording to the presentation asset.

  ### When to Use

  - Before drafting, to confirm the workflow belongs in a command rather than a skill or an agent
  - After drafting, to review the draft against the mistakes table
  ```

### .skilled/skills/sk-doc/sk-create-command/references/router-presentation-split.md
- [P2] .skilled/skills/sk-doc/sk-create-command/references/router-presentation-split.md:23 | 4 | The OVERVIEW is one contents sentence that lists what the file covers; it states neither the outcome nor when to open the file, and it has no Purpose or When to Use subsection. | Replace line 23 with:

  ```markdown
  ### Purpose

  This reference expands the router/presentation separation named in SKILL.md Step 11: what the router owns, what the presentation asset owns, the mechanical before/after transformation, and the rule that a split must never change behavior.

  ### When to Use

  - Refactoring a mode-based command into a thin router plus a presentation asset
  - Checking that a split preserved routing, gates, modes, and `allowed-tools`
  ```

- [P2] .skilled/skills/sk-doc/sk-create-command/references/router-presentation-split.md:76 | 5 | The behavior-preserving trust rule sits in section 4, after the before/after transformation in section 3 that it governs, so a reader can perform the split before learning the constraint. | Move the `## 4. BEHAVIOR-PRESERVING RULE` block (current lines 74-79) to before the divider above `## 3. BEFORE / AFTER TRANSFORMATION` (current line 44); renumber the moved heading to `## 3.` and the current `## 3.` to `## 4.`.

### .skilled/skills/sk-doc/sk-create-command/references/worked-example.md
- [P2] .skilled/skills/sk-doc/sk-create-command/references/worked-example.md:17 | 3 | The intro runs to three sentences and ends with a pure pointer, "This file shows what the finished output package looks like so you can model the shape"; the reference template caps the intro at two short sentences and the intro rule rejects pointer sentences. | Replace line 17 with: `A concrete end-to-end example of a mode-based namespace command. \`sk-create-command/SKILL.md\` owns the numbered workflow.`

- [P2] .skilled/skills/sk-doc/sk-create-command/references/worked-example.md:23 | 4 | The OVERVIEW states the Purpose and the illustrative-only trust rule but has no When to Use subsection, so the reader is not told which task sends them here. | Replace line 23 with:

  ```markdown
  ### Purpose

  This reference is a single worked example: the canonical command file contract and its invariants, then a full mode-based split showing both the router `.md` and its presentation `.txt`.

  ### When to Use

  - Modeling the output package shape for a mode-based namespace command
  - Seeing the router and presentation contract applied end to end

  **Illustrative only:** this is overflow for SKILL.md Steps 5 and 11; model the shape and do not treat `/review:packet` as a live command.
  ```
