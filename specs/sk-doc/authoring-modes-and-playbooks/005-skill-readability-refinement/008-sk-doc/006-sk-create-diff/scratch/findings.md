### .skilled/skills/sk-doc/sk-create-diff/README.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/README.md:100 | 6 | The only skip guidance (`Skip it for code...`, visual, single-document scoring) sits under `INTEGRATION & NAVIGATION`, after Quick Start and How It Works, so a reader can run the wrong tool before meeting the boundary. | Move lines 100-102 to after line 35 (end of `### What It Does`), keeping the `### When To Use This Skill` heading.
- [P2] .skilled/skills/sk-doc/sk-create-diff/README.md:102 | 7 | The moved paragraph packs the use case and three `Skip it for` clauses into one block. | Replace with: `Use create-diff when:` + bullets `- An AI or a person edited a document outside Git and you need proof of what changed.`, `- You want a baseline captured before a risky edit.`, `- A pre-composed multi-file bundle needs its transitions to stay visible in review.`, then `Skip it when:` + bullets `- The files are code or already tracked in Git (\`sk-git\` owns that).`, `- The comparison is visual or pixel-level (out of scope: create-diff compares extracted text only).`, `- You are scoring a single document with no second state to compare (\`create-quality-control\` owns that).`
- [P2] .skilled/skills/sk-doc/sk-create-diff/README.md:90 | 7 | One 120-word paragraph carries the invariant, three commands and the shared diff pipeline, so the three lifecycle paths are invisible on a scan. | Keep the invariant sentence, then split the rest into bullets beginning: `- \`snapshot\` copies the current file...`, `- Once the edit is done, \`compare\` diffs...`, `- When no baseline exists or you already have two explicit versions, \`compare-pair\` skips the store entirely...`, `- Either path ends the same way: ...` (sentences verbatim).
- [P2] .skilled/skills/sk-doc/sk-create-diff/README.md:167 | 8 | The `RELATED DOCUMENTS` table lists every reference doc except `references/worked-example.md`, though `SKILL.md` §10 and the fixtures both point to it. | Insert before the fixtures row: `| [\`references/worked-example.md\`](./references/worked-example.md) | End-to-end walkthrough using the shipped fixtures |`

### .skilled/skills/sk-doc/sk-create-diff/ROUTER.md

- [P1] .skilled/skills/sk-doc/sk-create-diff/ROUTER.md:55 | 1 | `pick the workflow shape in section 3` points at `MACHINE ROUTER`, which holds only pseudocode; the two shapes are defined in §2 `INTENT MODEL` and in `SKILL.md` §3, so the pointer sends a reader to the wrong place. | Replace the bullet with: `- If the request clearly asks for a before/after document review, route here and pick the workflow shape in [\`SKILL.md\` §3](./SKILL.md) (automatic baseline vs. explicit pair).`

### .skilled/skills/sk-doc/sk-create-diff/SKILL.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/SKILL.md:216 | 10 | `RELATED RESOURCES` is followed by `REFERENCES`, so the related-resources section is not last; `validate_document.py` reports `render_section_order` at line 216. | Swap the two sections and renumber: move lines 216-223 after line 235, set `## 9. REFERENCES` on the former §10 and `## 10. RELATED RESOURCES` on the moved section.
- [P2] .skilled/skills/sk-doc/sk-create-diff/SKILL.md:223 | 9 | The last `RELATED RESOURCES` bullet carries a spec path and phase id (`.opencode/specs/sk-doc/016-create-diff-mode/`, phase `006-opencode-skill-and-accessibility`), the only packet bookkeeping in the body. | Delete the `Engine and mode design:` bullet; the durable claim (the packet is a registered sk-doc mode) already stands in §8.
- [P2] .skilled/skills/sk-doc/sk-create-diff/SKILL.md:173 | 1 | The third RULES subsection is `### ⚠️ ESCALATE`; the SKILL.md template and every sibling `sk-doc` packet name it `ESCALATE IF` (or `ESCALATE WHEN`). | Replace the heading with `### ⚠️ ESCALATE IF`.

### .skilled/skills/sk-doc/sk-create-diff/references/README.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/references/README.md:14 | 3 | No intro after the H1: the file goes straight from `# create-diff, reference route-map` to `## 1. OVERVIEW`. | Insert after line 10: `Each concern has exactly one file, so a reader can stop after the row that answers the question.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/README.md:14 | 4 | §1 `OVERVIEW` fuses the purpose and the load-one rule in a single sentence, with no `Purpose` and `When to Use` subsections. | Replace line 14 with `### Purpose`, then `Overflow guidance beyond \`SKILL.md\`, split into single-concern files.`, then `### When to Use`, then `- A question is narrower than the \`SKILL.md\` workflow and one concern needs the depth a single file carries.` and `- You are choosing a reference: load the one that matches the concern, not everything by default.`

### .skilled/skills/sk-doc/sk-create-diff/references/accessibility-contract.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/references/accessibility-contract.md:14 | 3 | No intro after the H1; the document opens directly on `## 1. OVERVIEW`. | Insert after line 14: `Open this when a review asks what the generated HTML guarantees with scripting off, or before changing anything the validator checks.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/accessibility-contract.md:18 | 4 | §1 `OVERVIEW` is a single paragraph with no `Purpose` or `When to Use`, against the reference template's body skeleton. | Insert `### Purpose` above line 18 (the existing two sentences become its body), then `### When to Use` with bullets: `- Checking a report against the guarantees a reviewer exercises: scripting disabled, offline, keyboard-only or colour-blind.` and `- Confirming what \`scripts/validate_report.py\` enforces before trusting a \`PASS\`.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/accessibility-contract.md:20 | 10 | Four H2s are unnumbered among numbered peers: `Self-containment (validated)` (20), `Accessibility` (27), `Views` (38), `What is not guaranteed` (45); `validate_document.py` reports four `render_h2_numbering` warnings. | Renumber them `## 2. Self-containment (validated)`, `## 3. Accessibility`, `## 4. Views`, `## 5. What is not guaranteed`.
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/accessibility-contract.md:34 | 7 | One bullet packs typography units, unified-view wrapping, the side-by-side scroll container and its keyboard operability. | Split into four bullets at the existing sentence boundaries: lead sentence, `In the **unified** view...`, `The **side-by-side** view...`, `That scroll container is keyboard-operable...` (text verbatim).
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/accessibility-contract.md:36 | 7 | One bullet packs boundary visibility, the `START`/`END` semantics, the spacer row and the section-label reset. | Split into four bullets at the existing sentence boundaries: lead sentence, `\`START FILE\` is the strongest transition...`, `Every file after the first receives...`, `Boundary rows also reset Markdown section context...` (text verbatim).

### .skilled/skills/sk-doc/sk-create-diff/references/capabilities-and-fidelity.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/references/capabilities-and-fidelity.md:14 | 3 | No intro after the H1; the document opens directly on `## 1. OVERVIEW`. | Insert after line 14: `Reach for this before quoting a tier to a user, so the claim matches what the extractor can actually read.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/capabilities-and-fidelity.md:18 | 4 | §1 `OVERVIEW` is one paragraph with no `Purpose` or `When to Use`. | Insert `### Purpose` above line 18 (the first two sentences become its body), then `### When to Use` with `- Describing what a comparison can and cannot see, before the result is trusted.` and `- Checking which format, extension or byte sequence the engine refuses.`, leaving the `Run \`python3 ../scripts/create_diff.py capabilities\`...` sentence verbatim below the list.
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/capabilities-and-fidelity.md:43 | 7 | One paragraph carries four separate refusal rules (unknown text-like, known binary, NUL byte, invalid UTF-8), so the exit-`3` conditions blur together. | Split into four bullets at the existing sentence boundaries: lead sentence, `Known binary or unsupported extensions...`, `An *unknown* extension whose first 8 KB...`, `A file that is not valid UTF-8...` (text verbatim).
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/capabilities-and-fidelity.md:67 | 7 | One paragraph packs the three canonicalizations, the logical-line rules and the Markdown caveat. | Convert the canonicalization clause to bullets (`- Unicode NFC.`, `- \`\r\n\`/\`\r\` → \`\n\`.`, `- Trailing whitespace stripped per line.`), convert the logical-line clause to bullets (`- An empty file is zero lines (not one phantom blank line).`, `- A single trailing newline is not treated as an extra blank line, so an empty-vs-content diff reads as a pure addition and a trailing-newline-only change is not reported as a spurious edit.`, `- Interior blank lines are preserved.`), and leave the Markdown sentence as its own paragraph.

### .skilled/skills/sk-doc/sk-create-diff/references/cli-reference.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/references/cli-reference.md:14 | 3 | No intro after the H1; the document opens directly on `## 1. OVERVIEW`. | Insert after line 14: `Use this when a command needs an exact flag, or when a non-zero exit has to become a message a user can act on.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/cli-reference.md:18 | 4 | §1 `OVERVIEW` is one engine-facts sentence with no `Purpose` or `When to Use`. | Insert above line 18: `### Purpose` + `The complete command surface of \`scripts/create_diff.py\`: every subcommand, flag, JSON summary shape and exit code.` + `### When to Use` + `- Looking up a subcommand or flag before running the engine.` + `- Mapping a non-zero exit onto the failure it reports.`; keep the existing `Engine: ...` sentence verbatim below the list.
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/cli-reference.md:87 | 5 | The destructive default (`With no --older-than, all matching snapshots are removed`) and the preview advice sit after the command block they govern. | Move line 87 to directly after line 80 (`Remove stored baselines.`), before the fenced block.

### .skilled/skills/sk-doc/sk-create-diff/references/worked-example.md

- [P2] .skilled/skills/sk-doc/sk-create-diff/references/worked-example.md:14 | 3 | No intro after the H1; the document opens directly on `## 1. OVERVIEW`. | Insert after line 14: `Follow it once before pointing the engine at a document you care about, so the report shape holds no surprises.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/worked-example.md:18 | 4 | §1 `OVERVIEW` describes the fixtures but has no `Purpose` or `When to Use`. | Insert `### Purpose` above line 18 (both existing sentences become its body), then `### When to Use` with `- Before a first real review, to see the summary line and the two views.`, `- To check what the summary line's additions, changes and unchanged counts are telling you.`, and `- To copy a working \`compare-pair\` or \`snapshot\`/\`compare\` invocation.`

### .skilled/skills/sk-doc/sk-create-diff/references/workflow.md

- [P1] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:20 | 10 (render gate, rubric 2) | Six H2s are unnumbered and the validator reports `render_h2_numbering` at lines 20, 36, 49, 73, 79 and 93; numbering them without ALL-CAPS titles and `---` separators only swaps those warnings for blocking `h2_not_uppercase` and `general_h2_separator` errors. | Replace the six heading lines with `## 2. AUTOMATIC FLOW (SNAPSHOT-BACKED)` (line 20), `## 3. EXPLICIT-PAIR FLOW (FALLBACK)` (36), `## 4. PRE-COMPOSED AGGREGATE PAIRS` (49), `## 5. WHERE SNAPSHOTS LIVE` (73), `## 6. LIFECYCLE` (79), `## 7. AFTER GENERATING A REPORT` (93), and insert a `---` line above each heading, with a blank line above and below the rule.
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:16 | 3 | The H1 at line 14 is followed directly by `## 1. OVERVIEW`; there is no intro, and the template requires a 1-2 sentence hook. | Insert after line 14: `Reach for this reference before a document changes, or when both versions are already in hand and the baseline is missing.`
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:18 | 4 | `## 1. OVERVIEW` opens with an unlabelled paragraph that is a core-principle statement; it has no Purpose and no When to Use, so the overview never says what the reference produces or when to open it. | Replace line 18 with:
  ```
  ### Purpose

  Give every review a real before-state, so a change is judged against what the document actually said.

  ### When to Use

  - You control the moment before an edit and want the engine to hold the baseline.
  - No baseline exists, or you are comparing two arbitrary versions.
  - One review needs to cover multiple files.
  - You need to inspect or prune stored baselines.

  ### Core Principle

  The core invariant: **capture the baseline before the edit.** A before/after review needs a real before-state, and once a file is overwritten the original is gone. `create-diff` never mutates the source — capture copies it into a local store.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:75 | 7 | One paragraph packs five separate storage mechanisms: store location, hash-keyed per-file subdirectory, manifest contents, atomic writes, and the read-only source guarantee. | Replace line 75 with:
  ```
  Baselines are stored under a `.create-diff/` directory in the current working directory (override with `--state-dir DIR`).

  - Each source path gets its own subdirectory, keyed by a hash of its absolute path.
  - That subdirectory holds the copied blobs plus a `manifest.json` recording capture time, size, and SHA-256.
  - Writes are atomic (temp file + rename).
  - The source is only ever read.
  ```
- [P2] .skilled/skills/sk-doc/sk-create-diff/references/workflow.md:93 | 6 | Report validation is the last step of every run, yet it is separated from the three comparison sections by the storage and cleanup maintenance sections, so the run's steps are not contiguous. | Move lines 93-101 to after line 71; renumber the moved section `## 5. AFTER GENERATING A REPORT`, and renumber `## 6. WHERE SNAPSHOTS LIVE` / `## 7. LIFECYCLE` accordingly, keeping the `---` separator above each.

