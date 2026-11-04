### .skilled/skills/system-spec-kit/references/memory/epistemic-vectors.md

- [P2] .skilled/skills/system-spec-kit/references/memory/epistemic-vectors.md:16 | 3 | The intro repeats the overview’s point about tracking uncertainty separately from confidence instead of giving a distinct hook. | Replace with `Use this reference when an assessment needs to measure uncertainty separately from confidence.`
- [P2] .skilled/skills/system-spec-kit/references/memory/epistemic-vectors.md:22 | 4 | The overview opens with “Why Uncertainty Tracking Matters” and lacks Purpose and When to Use. | Rename this heading to `### Purpose`; add `### When to Use` before `### Key Concepts` with `- Use before acting on a significant task when knowledge gaps need assessment.`

### .skilled/skills/system-spec-kit/references/memory/memory-system.md

- [P2] .skilled/skills/system-spec-kit/references/memory/memory-system.md:23 | 4 | The overview opens with an architecture explanation and lacks Purpose and When to Use. | Add `### Purpose` before the opening paragraph and `### When to Use` after it with `- Use when locating a spec folder or resuming a session.`
- [P2] .skilled/skills/system-spec-kit/references/memory/memory-system.md:175 | 7 | This paragraph combines content routing, metadata refresh, atomic writes, locking and index behavior. | Split it into bullets for routing and metadata refresh, atomic and locked updates, and the writer’s ownership and index behavior. Preserve the existing sentences.

### .skilled/skills/system-spec-kit/references/memory/save-workflow.md

- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:16 | 3 | The intro is a generic “Complete guide” description, not a hook. | Replace with `Use this reference to choose a save method and see which continuity surfaces it updates.`
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:22 | 4 | The overview opens with Core Principle and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before Core Principle; use `- Use when choosing a save method or checking which continuity surfaces it updates.` for When to Use.
- [P1] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:137 | 1 | The consecutive bold labels render as one paragraph, as reported by `render_bold_label_join`. | Replace lines 137-138 with `- **When to Use:** Manual save with AI-powered conversation analysis` and `- **Requirement:** Slash command files exist in \`.skilled/commands/speckit/\``.
- [P1] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:178 | 1 | The consecutive bold labels render as one paragraph, as reported by `render_bold_label_join`. | Replace lines 178-179 with `- **When to Use:** Testing, debugging, custom workflows, CI/CD pipelines` and `- **Requirement:** Node.js installed`.
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:253 | 7 | This paragraph combines save-mode behavior, runtime-specific sweeps and guidance for interpreting evidence. | Split it into bullets for save-mode behavior, the sweep commands by runtime and the evidence fields and their use. Preserve the existing claims.
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:267 | 7 | This paragraph combines decision-table matching, row mapping, anchor writes, phase routing, level stamping and consumed-file handling. | Split it into bullets by mechanism, preserving the existing claims and order.
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:269 | 7 | This paragraph combines source-key mapping, anchor writes, idempotence, phase routing and consumed-file handling. | Split it into bullets for those mechanisms, preserving the existing claims.
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:301 | 9 | “Phase 018” is a phase number in the body. | Replace `The Phase 018 save path is packet-first.` with `The save path is packet-first.`
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:424 | 7 | This paragraph combines retrieval sources, retrieval lanes and unsupported capabilities. | Split it into bullets for the working-tree source, the trigger-index and ripgrep lanes, and their lexical-only limits.
- [P2] .skilled/skills/system-spec-kit/references/memory/save-workflow.md:597 | 9 | The `026` labels in these headings are packet or task identifiers in the body. | Change the headings at lines 597 and 615 to `## 11. POST-SAVE QUALITY REVIEW` and `### Heuristic Calibration`.

### .skilled/skills/system-spec-kit/references/memory/trigger-config.md

- [P2] .skilled/skills/system-spec-kit/references/memory/trigger-config.md:17 | 3 | The intro repeats the frontmatter description and does not give a use hook. | Replace with `Use this reference when declaring trigger phrases or checking what the committed index can match.`
- [P2] .skilled/skills/system-spec-kit/references/memory/trigger-config.md:23 | 4 | The overview opens with Core Principle and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before Core Principle; use `- Use when declaring trigger phrases or checking trigger-index matching.` for When to Use.
- [P2] .skilled/skills/system-spec-kit/references/memory/trigger-config.md:97 | 7 | This paragraph combines lookup output, exit-status handling and index regeneration. | Split it into bullets for the returned fields, the three exit statuses and when to regenerate the index.
- [P2] .skilled/skills/system-spec-kit/references/memory/trigger-config.md:161 | 9 | `(026 Remediation)` is an ephemeral identifier in the body heading. | Replace `### Trigger Sanitization (026 Remediation)` with `### Trigger Sanitization`.

### .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md

- [P2] .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:20 | 3 | The intro is a fragment describing the invocation contract, not a distinct hook. | Replace with `Use this reference when constructing a free-text ripgrep search over spec or skill documents.`
- [P2] .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:26 | 4 | The overview opens with Core Principle and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before Core Principle; use `- Use when searching spec or skill documents by declared trigger phrases or literal text.` for When to Use.
- [P2] .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:59 | 9 | The body names `phase 002-memory-consumer-rewire` and `phase 002`. | Replace both owner phrases with `Owned by the memory consumer rewire`.
- [P2] .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:264 | 7 | This paragraph packs the judge, retrofit, validator, generator diagnostics, folder-token fallback and owner-counting mechanisms together. | Split it into bullets by mechanism, preserving the existing claims.
- [P2] .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:272 | 7 | This paragraph combines the corpus walker, ripgrep recipes and parity-test enforcement. | Split it into bullets for the two lanes and the test that enforces their coverage contract.

### .skilled/skills/system-spec-kit/references/structure/folder-routing.md

- [P2] .skilled/skills/system-spec-kit/references/structure/folder-routing.md:16 | 3 | The intro repeats the frontmatter description instead of giving a hook. | Replace with `Use this reference when a save needs to select or validate a spec-folder target.`
- [P2] .skilled/skills/system-spec-kit/references/structure/folder-routing.md:22 | 4 | The overview opens with an architecture statement and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before the opening paragraph; use `- Use when a save needs to choose or validate its target spec folder.` for When to Use.
- [P1] .skilled/skills/system-spec-kit/references/structure/folder-routing.md:109 | 5 | The explicit-target priority rule appears after the routing flow it governs. | Move this paragraph before `### Complete Routing Flow` at line 49.
- [P2] .skilled/skills/system-spec-kit/references/structure/folder-routing.md:109 | 7 | This paragraph combines explicit-target precedence, phase-parent routing, ancestor pointers and wrong-target recovery. | Split it into bullets for those mechanisms while preserving the claims.
- [P1] .skilled/skills/system-spec-kit/references/structure/folder-routing.md:299 | 5 | The archive-filtering rule appears after the interactive prompt it governs. | Move the `### Archive Filtering` block at lines 318-325 before the prompt instructions at line 301.
- [P1] .skilled/skills/system-spec-kit/references/structure/folder-routing.md:328 | 5 | The bypass options appear after the interactive prompt they can skip. | Move the Bypass Options section before Interactive Prompt and renumber those two headings as 8 and 9.

### .skilled/skills/system-spec-kit/references/structure/folder-structure.md

- [P2] .skilled/skills/system-spec-kit/references/structure/folder-structure.md:16 | 3 | The intro repeats the frontmatter description and is not a hook. | Replace with `Use this reference to name a spec folder and check which files its level requires.`
- [P2] .skilled/skills/system-spec-kit/references/structure/folder-structure.md:22 | 4 | The overview opens with a summary sentence and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before the opening sentence; use `- Use when naming a spec folder or checking required files by level.` for When to Use.
- [P1] .skilled/skills/system-spec-kit/references/structure/folder-structure.md:26 | 8 | The “Template Directory Structure” tree omits files from the directory it presents, including root `README.md`, `MIGRATION.md`, `CONTRACT.md` and `EXTENSION-GUIDE.md`, plus files under `examples/`, `changelog/` and `scratch/`. | Expand the tree to list every file returned by `rg --files .skilled/skills/system-spec-kit/templates`.
- [P2] .skilled/skills/system-spec-kit/references/structure/folder-structure.md:231 | 9 | `(post-028)` is a phase-number label in the body. | Replace `**Flat-first convention (post-028):**` with `**Flat-first convention:**`.
- [P2] .skilled/skills/system-spec-kit/references/structure/folder-structure.md:338 | 1 | “Level specifications reference” is an unlinked label in Related Resources. | Replace it with `- [spec-kit-docs.json](../../templates/spec-kit-docs.json) - Level contract resolved by create.sh`.

### .skilled/skills/system-spec-kit/references/structure/grep-convention.md

- [P2] .skilled/skills/system-spec-kit/references/structure/grep-convention.md:19 | 3 | The intro is a fragment describing the document’s subject, not a distinct hook. | Replace with `Use this reference when preparing active spec documents for precise ripgrep retrieval.`
- [P2] .skilled/skills/system-spec-kit/references/structure/grep-convention.md:25 | 4 | The overview opens with Core Principle and lacks Purpose and When to Use. | Add `### Purpose` and `### When to Use` before Core Principle; use `- Use when preparing active spec documents for literal ripgrep retrieval.` for When to Use.
- [P2] .skilled/skills/system-spec-kit/references/structure/grep-convention.md:264 | 7 | This paragraph combines the judge, retrofit, validator, generator diagnostics, fallback and owner-counting mechanisms. | Split it into bullets by mechanism, preserving the existing claims.
- [P2] .skilled/skills/system-spec-kit/references/structure/grep-convention.md:272 | 7 | This paragraph combines the two corpus lanes and the parity test that enforces their coverage. | Split it into bullets for each lane and the coverage test.