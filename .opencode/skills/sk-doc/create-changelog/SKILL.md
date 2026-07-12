---
name: create-changelog
description: Author global or packet-local changelogs with topology detection, versions, and release notes.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.1.0
---

<!-- Keywords: create-changelog, /create:changelog, changelog, release notes, global changelog, packet-local changelog, semantic version, nested changelog -->

# create-changelog

`create-changelog` is the changelog-authoring workflow packet of the `sk-doc` family. It creates global component changelog files under `.opencode/changelog/{component}/v{VERSION}.md` or packet-local nested changelogs under a spec packet's `changelog/` folder, depending on source topology.

The executable contract lives here: resolve the work source, detect global vs packet-local output, calculate the version when global versioning applies, generate content from the canonical format, validate, then write the file. Use `../shared/assets/changelog_template.md` as the shared global changelog template and the `references/` set (routed by `references/README.md`) only for supplementary worked examples or edge cases.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the task involves:

1. Creating a global component changelog for `.opencode/changelog/{component}/v{VERSION}.md`.
2. Creating a packet-local nested changelog for a spec folder or phase child.
3. Running or supporting `/create:changelog`.
4. Resolving a changed spec folder, component hint, or recent git history into a changelog target.
5. Calculating the next four-part semantic version for a global changelog.
6. Preparing GitHub release notes from the generated global changelog content.

Keyword triggers: `create changelog`, `/create:changelog`, `release notes`, `global changelog`, `packet-local changelog`, `nested changelog`, `--bump`, `--release`, `vX.Y.Z.B`.

### When NOT to Use

Skip this workflow when:

1. The user only wants a generic release plan with no file output.
2. The target is a README, install guide, agent, command, benchmark report, flowchart, or feature catalog.
3. The work source is too ambiguous to resolve to a spec folder, component hint, or recent git history.
4. The request is only to review an existing changelog without authoring or updating it.
5. The user asks for Git branch, commit, PR, or release mechanics beyond preparing release-note content.

Use `sk-git` for Git workflow ownership. This packet may prepare release notes when `/create:changelog --release` is requested, but release mechanics are only present in the source as an optional command route and body-format contract.

---

## 2. SMART ROUTING

### Family Boundary

This is a nested workflow packet under `sk-doc`. It owns changelog authoring only. The single advisor identity lives at the `sk-doc` hub root; never add packet-local `graph-metadata.json`.

### Output-Mode Routing

Route the resolved work source to one of two output modes before generating content:

1. **Global component mode** -- write to `.opencode/changelog/{component}/v{VERSION}.md` with four-part semantic versioning when the source resolves to a component hint, git history, or a non-phased spec folder without an existing `changelog/`.
2. **Packet-local nested mode** -- write through the spec-kit nested generator into the packet `changelog/` folder when `--nested` is set, or when the spec folder is a phase child, has direct child phase folders, or already has a `changelog/` folder.

The full detection and target-resolution logic lives in HOW IT WORKS and TOPOLOGY AND TARGET RESOLUTION below.

---

## 3. REQUIRED INPUTS

At least one source input is required:

| Input | Required | Source meaning |
| --- | --- | --- |
| `source_type` | Yes | One of `spec_folder`, `component`, or `git_history` |
| `spec_folder` | When `source_type = spec_folder` | Path to the spec folder to summarize |
| `component_hint` | When `source_type = component` | Component name or keyword to match against discovered changelog folders |
| `version_bump` | Optional | One of `major`, `minor`, `patch`, `build`, or `auto`; default is `auto` |
| `--nested` | Optional | Forces packet-local nested changelog mode |
| `--release` | Optional | Requests matching GitHub release-note body after changelog generation |

Input handling rules:

1. `source_type` must resolve before writing.
2. `version_bump` defaults to `auto`.
3. Changelog root defaults to `.opencode/changelog/` for global output.
4. Version format is `v{MAJOR}.{MINOR}.{PATCH}.{BUILD}`.
5. Initial global version is `v1.0.0.0` when no prior version exists.
6. Dates use `YYYY-MM-DD` when date output is needed.

Confidence rules from the source workflow:

1. Proceed normally at 80-100 percent confidence with citable source evidence.
2. Proceed cautiously at 40-79 percent confidence and document assumptions.
3. Stop and ask with A/B/C options below 40 percent confidence.

---

## 4. HOW IT WORKS (HOW_IT_WORKS): CHANGELOG OUTPUT MODES

### Global Component Changelog

Global changelogs live at:

```text
.opencode/changelog/{component}/v{VERSION}.md
```

Global mode uses four-part semantic versions:

```text
v{MAJOR}.{MINOR}.{PATCH}.{BUILD}
```

Version bump rules:

| Bump | Calculation | Source trigger intent |
| --- | --- | --- |
| `major` | `{MAJOR+1}.0.0.0` | Breaking, overhaul, rewrite, migration, platform version jump |
| `minor` | `{MAJOR}.{MINOR+1}.0.0` | Significant new feature or subsystem addition |
| `patch` | `{MAJOR}.{MINOR}.{PATCH+1}.0` | Incremental improvement, bug fix, refactor, docs, cleanup |
| `build` | `{MAJOR}.{MINOR}.{PATCH}.{BUILD+1}` | Hotfix, typo, same-day build on an already-published version |

Auto detection order:

1. Use the explicit `--bump` flag first when present.
2. Check `spec.md` title and purpose for change-type keywords.
3. Check git commit messages for conventional commit prefixes.
4. Default to `patch` if no clear signal exists.
5. If the calculated file already exists, increment the build segment until unique.

### Packet-Local Nested Changelog

Packet-local changelogs are a separate output mode. They do not use global component folders or four-part release versioning.

Nested output paths from the shared template:

1. Root spec folders write to `changelog/changelog-<packet>-root.md`.
2. Phase child folders write to `../changelog/changelog-<packet>-<phase-folder>.md`.

Nested mode uses the spec-kit generator and templates:

```bash
node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write
```

Canonical nested templates are `.opencode/skills/system-spec-kit/templates/changelog/root.md` and `.opencode/skills/system-spec-kit/templates/changelog/phase.md`.

---

## 5. CHANGELOG FORMAT CONTRACT

Read `../shared/assets/changelog_template.md` before generating global changelog content. It defines compact and expanded formats.

### Shared Format Facts

The shared template states:

1. Global changelog files start directly with the summary paragraph.
2. There is no version header or boilerplate at the top of the file.
3. The summary leads with why the release matters, not technical stats.
4. The spec folder line is a blockquote: `> Spec folder: `{path}` (Level {N})`.
5. Use compact format under 10 changes unless the release is major or breaking.
6. Use expanded format for 10 or more changes, major releases, audit results, major refactors, or breaking changes.

### Compact Format

Use compact format for hotfixes, feature releases under 10 changes, and small refactors.

Required shape:

```markdown
{One-paragraph summary explaining what this release does and why it matters.}

> Spec folder: `{path}` (Level {N})

---

## What Changed

#### {Category Name}

- **{Feature/Fix name}** -- {What was broken or missing}. {What we did}. {Why it matters}.

## Files Changed

| File           | What changed      |
| -------------- | ----------------- |
| `path/to/file` | Brief description |

## Upgrade

No migration required.
```

### Expanded Format

Use expanded format when individual fixes need full explanation.

Required shape:

```markdown
{One-paragraph summary explaining what this release does and why it matters. Include the scope, test impact, and approach.}

> Spec folder: `{path}` (Level {N})

---

## {Category Name}

{Optional 1-2 sentence introduction for the category.}

#### {Short heading}

{One flowing paragraph explaining the broken or missing behavior and what changed.}

&nbsp;

#### {Next heading}

{Same pattern for the next item.}

---

## Test Impact

| Metric            | Before | After |
| ----------------- | ------ | ----- |
| Tests passing     | {N}    | {N}   |
| Test files        | {N}    | {N}   |
| TypeScript errors | 0      | 0     |

{One sentence about new tests added and existing tests updated.}

---

## Schema Changes (if applicable)

| Change         | Details                         |
| -------------- | ------------------------------- |
| Schema version | {old} to {new}                  |
| New indexes    | {count} ({list})                |
| New columns    | {name} on {table} for {purpose} |

{One sentence confirming backward compatibility.}

---

<details>
<summary>Technical Details: Files Changed ({total} total)</summary>

### Source ({count} files)

| File           | Changes                                                  |
| -------------- | -------------------------------------------------------- |
| `path/to/file` | {What changed -- function names, behaviors, SQL queries} |

### Tests ({count} files)

{One sentence about test coverage.}

### Documentation ({count} files)

{One sentence about doc updates.}

</details>

---

## Upgrade

{Migration instructions or "No migration required."}

{List any behavioral changes users should be aware of.}
```

### Section Vocabulary

Use plain category names from the shared template:

1. `Search`
2. `Saving Memories`
3. `Security`
4. `Documentation`
5. `Testing`
6. `Commands`
7. `New Features`
8. `Bug Fixes`
9. `Architecture`
10. `Breaking Changes`

The shared template does not define `Added`, `Changed`, `Fixed`, or `Removed` as canonical section names. If a caller asks for those headings, translate the content into the template's plain category vocabulary unless the user explicitly requires a different external format.

### Source Contract Mismatch

The auto workflow contains older validation snippets that require `# v{VERSION}`, a version-date header, and `###` highlight headings. The shared template is the newer detailed format source for global changelog prose and says files start directly with the summary paragraph, use H4 category subsections in compact format, and use H4 item headings in expanded format. When these conflict, follow `../shared/assets/changelog_template.md` and record the YAML mismatch as a source inconsistency rather than inventing a hybrid format.

---

## 6. TOPOLOGY AND TARGET RESOLUTION

### Mode Detection

When `source_type = spec_folder`, read these files when present:

1. `{spec_folder}/implementation-summary.md` as the primary source.
2. `{spec_folder}/tasks.md` for completed tasks.
3. `{spec_folder}/spec.md` for title, purpose, requirements, and level.

Then detect output mode:

1. If `--nested` is present, use nested mode.
2. Else if the spec folder is a phase child, has direct child phase folders, or already has `changelog/`, use nested mode.
3. Else use global mode.

When `source_type = component`, use the component hint, recent commits, and component file patterns. This is global mode.

When `source_type = git_history`, use recent git log and diff stats. This is global mode.

### Global Component Discovery

Discover component folders dynamically from the actual repository. Do not hardcode the component table.

```bash
ls -d .opencode/changelog/*/ 2>/dev/null | sort
```

Resolution strategy:

1. Treat each discovered folder as a plain component name (e.g. `sk-doc`, `system-spec-kit`, `sk-code`). The real folders under `.opencode/changelog/` are not numerically prefixed. The auto workflow's older `NN--component-name` / `00--` fallback pattern is stale — match on the plain folder names as they exist on disk.
2. Match changed file paths against discovered component names.
3. Match `.opencode/skills/{name}/**` to the folder named `{name}` when possible.
4. Match `.opencode/commands/**` to the folder that owns those commands when possible.
5. Match `.opencode/agents/**` to the folder that owns those agents when possible.
6. Match `component_hint` against discovered folder names by substring.
7. Match spec path segments against discovered folder names as a tiebreaker.
8. If no folder matches, do not invent or default to a fallback folder — pause and ask which component this changelog belongs to.

Component selection rules:

1. If one component accounts for more than 60 percent of changed files, choose it as primary.
2. If several components are roughly equal, list all affected components and choose primary by file count.
3. If no component matches, pause and ask rather than writing to a guessed folder.
4. Verify the chosen target folder exists before writing.
5. Never create a missing global changelog component folder as part of this workflow.

---

## 7. CREATION WORKFLOW

Complete these seven steps in order. The SKILL.md is the primary workflow contract.

1. **Analyze context.** Determine source type from the request or setup output. For a spec folder, read implementation summary, tasks, and spec files, then extract work summary, files changed, change type, level, and output mode. For a component hint, gather recent commits and affected files for that component. For git history, inspect recent commits and diff stats. Compile `work_context` with summary, files, change type, and source.
2. **Resolve output target.** If nested mode, run the nested changelog generator with `--json`, read the root or phase nested template, extract the output path, and skip global component mapping. If global mode, discover `.opencode/changelog/*/`, parse component folders, match changed files and hints, choose the primary component, list secondary components, and verify `.opencode/changelog/{resolved_folder}/` exists.
3. **Determine version.** If nested mode, skip version calculation. If global mode, list existing files in the target folder, parse the latest `vX.Y.Z.B` version, choose bump type from explicit `--bump` or auto-detection, calculate the next version, and increment the build segment if the file already exists.
4. **Generate content.** Read `../shared/assets/changelog_template.md` for global mode or the spec-kit nested template for nested mode. Set date when needed. Select compact format for fewer than 10 non-major changes. Select expanded format for 10 or more changes, major changes, or breaking changes. Write a 1-3 sentence summary that leads with why the release matters. Generate category sections, files-changed detail, test impact when applicable, schema changes when applicable, and upgrade guidance.
5. **Validate quality.** Check format, version, and content before writing. Confirm required sections are present, version is strictly greater than the latest global version, no target file exists, summary is non-empty, files changed are real paths, and upgrade guidance is present. Auto-fix small missing sections when safe, then revalidate.
6. **Write the file.** If nested mode, run `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js {spec_folder} --write` and verify the output path. If global mode, write `.opencode/changelog/{primary_component}/v{next_version}.md` and read back the first lines to verify creation. If secondary components exist, note them as additional changelog candidates rather than writing extra files silently.
7. **Report and preserve context.** Report status, path, component, version, bump type, summary, section count, and files tracked. If a spec folder was the source, note that context can be preserved through the normal memory save workflow. Do not claim completion until the written file has been verified.

Hard gates:

1. Source context and resolution inputs must be present.
2. Global mode must resolve to an existing changelog component folder before writing.
3. Global mode must calculate a unique sequential version before writing.
4. Generated content must validate before writing.

Pause conditions:

1. Confidence drops below 40 percent.
2. Component resolution is ambiguous with multiple equally likely targets.
3. Version calculation produces an unexpected result.
4. Generated content has empty required sections.

---

## 8. NOTATION AND FORMAT RULES

### Voice

1. Write for a smart person who is not a developer.
2. Lead with why the release matters, not technical stats.
3. Explain every fix as what was broken, what changed, and why it matters.
4. Explain jargon on first use with parenthetical definitions.
5. Put file paths, line numbers, function names, SQL syntax, and other technical specifics in Files Changed, not in user-facing descriptions.

### Structure

1. Use short bullet points, 1-3 sentences each, in compact format.
2. Use one merged paragraph per item in expanded format.
3. Do not use `**Problem:**` and `**Fix:**` labels in expanded format when following the shared template.
4. Use short expanded-format subheadings, 2-5 words, easy to scan.
5. Do not use packet IDs, numbering, or sentence-length headings unless sequence is load-bearing.
6. Use H4 (`####`) for category subsections and item headings where the shared template shows H4.
7. Use `&nbsp;` between H4 subsections within the same H2.
8. Use `---` only between H2 sections.
9. Do not place `---` or `&nbsp;` between an H2 or intro paragraph and its first H4.
10. Avoid metrics soup. Do not pack many numbers into one sentence.
11. Follow shared HVR style: no Oxford commas, em dashes, or semicolons.

### Release Notes

For GitHub release notes, the shared template says to use the changelog file content as-is, then append:

```text
Full changelog: `.opencode/changelog/{component}/v{VERSION}.md`
```

The source router exposes `--release` as an optional path, but the exact GitHub CLI command is not defined in the files read for this packet. Do not invent release mechanics beyond preparing the body and applying the optional release-note appendix unless another workflow supplies the Git operation.

---

## 9. VALIDATION

Before delivery, validate target, version, and content.

Global changelog checks:

1. Target path is `.opencode/changelog/{component}/v{VERSION}.md`.
2. Target component folder exists before writing.
3. Version follows `vX.Y.Z.B`.
4. Version is strictly greater than the latest existing version in that folder.
5. No file already exists at the target version path.
6. File starts with a summary paragraph, not a version header, per the shared template.
7. Spec folder blockquote is present when source is a spec folder.
8. Compact files include `## What Changed`, category H4s, `## Files Changed`, and `## Upgrade`.
9. Expanded files include category sections, item H4s, Test Impact when relevant, Technical Details when files changed are listed, and `## Upgrade`.
10. The summary is concise, plain English, and explains why the release matters.
11. Every changed file path in tables is valid or clearly marked as inferred from git history.

Nested changelog checks:

1. Output path resolves inside the target packet's `changelog/` folder.
2. Root spec folder output uses `changelog/changelog-<packet>-root.md`.
3. Phase child output uses `../changelog/changelog-<packet>-<phase-folder>.md`.
4. The spec-kit nested generator is the write path.
5. Global version rules are not applied.

Suggested shared markdown checks after writing authored markdown:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <written-file>
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <written-file>
```

If validation fails, fix blocking issues before delivery or report the exact blocker and command output.

---

## 10. RULES

### ALWAYS

1. Always follow the seven-step workflow in order.
2. Always read `../shared/assets/changelog_template.md` before generating global changelog content.
3. Always dynamically discover global changelog component folders from `.opencode/changelog/`.
4. Always resolve global mode to an existing component folder before writing.
5. Always validate global version sequencing before writing.
6. Always keep global version numbers four-part: `vX.Y.Z.B`.
7. Always choose compact vs expanded format from change count and release type.
8. Always use the spec-kit nested changelog generator for packet-local output.
9. Always list secondary affected components when detected.
10. Always verify the written file before claiming completion.
11. Always keep this packet self-contained and leave advisor graph identity at the `sk-doc` hub root.

### NEVER

1. Never add packet-local `graph-metadata.json`.
2. Never skip version validation for global changelogs.
3. Never overwrite an existing changelog file.
4. Never use a version number that already exists.
5. Never guess a component folder without file path, hint, spec path, or fallback analysis.
6. Never create missing global changelog folders inside this workflow.
7. Never write a changelog with an empty summary or empty required sections.
8. Never apply global component versioning rules to nested packet-local changelogs.
9. Never make the command router or YAML reference the only workflow contract for this packet.
10. Never hide source-format conflicts; mark them clearly and prefer the canonical template when formatting prose.

### ESCALATE IF

1. Source context cannot be found in a spec folder, component history, or git history.
2. Component resolution remains ambiguous after file-count and path-segment analysis.
3. The calculated version is unexpected or cannot be made unique by build increment.
4. Required changelog sections would be empty.
5. The user requests a GitHub release action but no Git release workflow or command context is available.
6. Validation fails after safe local fixes.

---

## 11. REFERENCES

Use these only when the core path above is not enough:

1. `../shared/assets/changelog_template.md` for the canonical global changelog and release-note format.
2. `references/README.md` route-map to the overflow set: `references/worked_examples.md` (filled-in global and packet-local entries), `references/version_bump_rules.md` (concrete four-part version choices), and `references/topology_edge_cases.md` (placement, back-dating, source conflicts, and the optional GitHub release flow).
3. `.opencode/commands/create/changelog.md` for the thin `/create:changelog` router boundary.
4. `.opencode/commands/create/assets/create_changelog_auto.yaml` and `create_changelog_confirm.yaml` for the source workflows this packet inlines. `/create:changelog` runs `:auto` (autonomous) or `:confirm` (interactive checkpoints); both resolve to this same packet contract.

---

## 12. SUCCESS CRITERIA

The workflow is successful when:

1. The output mode is correctly classified as global or packet-local nested.
2. Global output is written to `.opencode/changelog/{component}/v{VERSION}.md`, or nested output is written through the spec-kit nested generator to the packet `changelog/` path.
3. Global versioning is sequential, unique, and four-part.
4. The file follows the compact or expanded shape from `../shared/assets/changelog_template.md`.
5. The changelog explains what changed, why it matters, files changed, test or schema impact when applicable, and upgrade guidance.
6. Optional release-note body uses the changelog content and appends the full changelog path when `--release` is requested.
7. Validation passes, or any remaining issue is escalated with exact evidence.
8. No other files are modified unless the user explicitly requested them.
