# Iteration 7: skill/mode READMEs (part 2: remaining modes + sk-code surfaces)

> dimension: accuracy+conformance | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Quick-start commands cannot target the repository skill directory from a consistent working directory**

  `.opencode/skills/sk-doc/create-skill/README.md:45`

  Evidence: From the repository root, `.opencode/skills` exists but `scripts/init_skill.py` does not. From the packet directory, `scripts/init_skill.py` exists but `.opencode/skills` resolves inside the packet. Lines 53 and 61 repeat the same mismatch for validation and packaging.

  Fix: Use repository-root-relative executable paths throughout, for example `python3 .opencode/skills/sk-doc/create-skill/scripts/init_skill.py my-skill --path .opencode/skills`.

- **[P1] Feature-catalog README overstates what the validator proves**

  `.opencode/skills/sk-doc/create-feature-catalog/README.md:54`

  Evidence: The README says validation proves category sections are present and leaf files carry all required sections. In `template-rules.json`, root catalogs use the `readme` rules, whose only required section is `overview`; `feature_catalog` leaves have `requiredSections: []` and explicitly validate only the Validation And Tests table taxonomy and placeholders.

  Fix: State that automated validation checks the README structural floor and leaf validation table. Move category presence, full leaf structure and root/leaf parity to the documented manual checks.

- **[P1] Manual-playbook README presents an incomplete verification gate**

  `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:55`

  Evidence: Quick Start and the verification table run only `validate_document.py`. The governing `SKILL.md:343-376` requires the new-content naming guard, `validate_document.py`, `extract_structure.py`, link and feature-ID checks, plus manual checks for leaf frontmatter, numbered sections, dividers and prompt synchronization.

  Fix: Add all three required commands and summarize the mandatory manual leaf checks in `## 8. VERIFICATION`.

- **[P1] DQI is incorrectly described as a publication-readiness and Quick Start blocker**

  `.opencode/skills/sk-doc/create-quality-control/README.md:69`

  Evidence: `quick_start` is recommended, not required, under the README rules. Running `extract_structure.py` on `code-opencode/README.md`, which has no Quick Start, produced DQI 79 and no Quick Start checklist failure; the README checklist only tested title, H1 emoji, blockquote, TOC and H2 numbering. Line 14 also incorrectly implies one numerical command establishes publish readiness, while the workflow separately requires validation and HVR review.

  Fix: Describe DQI as one quality signal. Remove the Quick Start blocker example and state that readiness combines extraction, document validation and manual/HVR review.

- **[P1] create-diff’s FAQ makes two false differentiation claims**

  `.opencode/skills/sk-doc/create-diff/README.md:118`

  Evidence: `git diff --no-index /dev/null <file>` successfully compared a file without repository history, contradicting “Git needs the file under version control.” Line 122 claims everything uses the Python standard library, but `create_diff.py:364-405` requires external `pdftotext`, `pypdf` or `pdfplumber` for PDFs.

  Fix: Explain that `--no-index` can compare arbitrary plain files, while create-diff adds snapshots, document extraction, fidelity warnings and HTML reporting. Qualify the standard-library claim with the PDF dependencies.

- **[P1] Surface READMEs assign work to nonexistent workflow modes**

  `.opencode/skills/sk-code/code-webflow/README.md:23`

  `.opencode/skills/sk-code/code-opencode/README.md:24`

  Evidence: The Webflow README calls implement/debug/verify a “workflow mode,” and both READMEs say a paired workflow mode owns edits, tests and commits. The parent `SKILL.md:23-37` defines only `quality` and `code-review` as workflow modes and explicitly calls implement/debug/verify phases, not modes. `mode-registry.json:18` says the acting agent applies surface doctrine, while Git commits route to `sk-git`.

  Fix: Say the surface supplies read-only evidence and phase doctrine to the acting agent; remove workflow-mode ownership of edits/tests/commits.

- **[P1] Both surface inventories omit supported evidence families**

  `.opencode/skills/sk-code/code-opencode/README.md:36`

  `.opencode/skills/sk-code/code-webflow/README.md:36`

  Evidence: The OpenCode summary omits JavaScript and claims one language trio is selected, although its own layout lists `javascript/` and `SKILL.md:18-34` explicitly routes `.js`/`.cjs`/`.mjs`. The Webflow summary and layout omit the Motion.dev overlay and `references/animation/`, both explicitly part of its contract at `code-webflow/SKILL.md:38-39`.

  Fix: Add JavaScript and describe routing as the touched-language set. Add Motion.dev and `references/animation/` to the Webflow inventory.
