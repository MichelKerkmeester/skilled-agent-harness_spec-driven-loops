---
name: sk-create-changelog
description: Author global or packet-local changelogs in the v4 narrative style, with topology detection, versions, voice enforcement, omission rules, and release notes.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.1.0.0
---

<!-- Keywords: create-changelog, /create:changelog, changelog, release notes, global changelog, packet-local changelog, semantic version, nested changelog -->

# create-changelog

`create-changelog` is the changelog-authoring workflow packet of the `sk-doc` family. It creates global component changelog files under `.skilled/changelog/{component}/v{VERSION}.md` or packet-local nested changelogs under a spec packet's `changelog/` folder, depending on source topology.

The executable contract lives here: resolve the work source, detect global vs packet-local output, calculate the version when global versioning applies, generate content from the canonical format, validate, then write the file. Use `assets/changelog-template.md` as the shared global changelog template and the `references/` set (routed by `references/README.md`) only for supplementary worked examples or edge cases.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the task involves:

1. Creating a global component changelog for `.skilled/changelog/{component}/v{VERSION}.md`.
2. Creating a packet-local nested changelog for a spec folder or phase child.
3. Running or supporting `/create:changelog`.
4. Resolving a changed spec folder, component hint, or recent git history into a changelog target.
5. Calculating the next four-part semantic version for a global changelog.
6. Preparing GitHub release notes from the generated global changelog content.

Keyword triggers: `create changelog`, `/create:changelog`, `changelog`, `changelog entry`, `release notes`, `global changelog`, `packet-local changelog`, `nested changelog`, `since the last version`, `--bump`, `--release`, `vX.Y.Z.B`.

### When NOT to Use

Use another `sk-doc` packet when:

1. The user only wants a generic release plan with no file output.
2. The target is a README. Use `create-readme`.
3. The target is an agent, command, benchmark package, flowchart, feature catalog, manual testing playbook, or skill. Use `create-agent`, `create-command`, `create-benchmark`, `create-flowchart`, `create-feature-catalog`, `create-manual-testing-playbook`, or `create-skill`.
4. The user wants to audit, validate, score, or optimize an existing changelog. Use `create-quality-control`.
5. The work source is too ambiguous to resolve to a spec folder, component hint, or recent git history.
6. The user asks for Git branch, commit or PR work, or for release mechanics beyond the `--release` tag and GitHub release.

Use `sk-git` for Git workflow ownership. This packet may prepare release notes when `/create:changelog --release` is requested. The tag and GitHub release themselves run in the command YAMLs' release step (§8).

---

## 2. SMART ROUTING

### Family Boundary

This is a nested workflow packet under `sk-doc`. It owns changelog authoring only. The single advisor identity lives at the `sk-doc` hub root, so never add packet-local `graph-metadata.json`.

### Output-Mode Routing

Route the resolved work source to one of two output modes before generating content:

1. **Global component mode** -- write to `.skilled/changelog/{component}/v{VERSION}.md` with four-part semantic versioning when the source resolves to a component hint, git history, or a non-phased spec folder without an existing `changelog/`.
2. **Packet-local nested mode** -- write through the spec-kit nested generator into the packet `changelog/` folder when `--nested` is set, or when the spec folder is a phase child, has direct child phase folders, or already has a `changelog/` folder.

The full detection and target-resolution logic lives in HOW IT WORKS and TOPOLOGY AND TARGET RESOLUTION below.

### Router Resilience

This packet routes by source topology and the resulting global or packet-local output mode. It does not use runtime keyed resource discovery through `references/<key>/` because its references are flat.

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when source topology or output mode is unclear.
- Ask for the missing source type, target component or packet, or version intent instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the two output modes, and returns a
disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two output modes; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "global_component": {"weight": 4, "keywords": ["global changelog", "release notes", "component", "--release", "--bump"]},
    "packet_local": {"weight": 4, "keywords": ["packet-local changelog", "nested changelog", "--nested", "phase child"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the change source (component hint, git history, or spec folder)",
    "Confirm global vs packet-local (nested) output mode",
    "Confirm the four-part version and whether --bump/--release applies",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_changelog_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear source/mode
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    output_mode = max(scores, key=scores.get)                # Tier 2: global vs packet-local
    # Flat resource topology: no references/<key>/ subdirectories. The mode selects the
    # generator target documented below, not a keyed subtree; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"output_mode": output_mode, "resources": loaded}
```

---

## 3. REQUIRED INPUTS

At least one source input is required:

| Input | Required | Source meaning |
| --- | --- | --- |
| `source_type` | Yes | One of `spec_folder`, `component`, or `git_history` |
| `spec_folder` | When `source_type = spec_folder` | Path to the spec folder to summarize |
| `component_hint` | When `source_type = component` | Component name or keyword to match against discovered changelog folders |
| `version_bump` | Optional | One of `major`, `minor`, `patch`, `build`, or `auto` (default) |
| `--nested` | Optional | Forces packet-local nested changelog mode |
| `--release` | Optional | After a global changelog is written, tags the version and publishes the GitHub release with the changelog as its body (§8) |

Input handling rules:

1. `source_type` must resolve before writing.
2. `version_bump` defaults to `auto`.
3. Changelog root defaults to `.skilled/changelog/` for global output.
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
.skilled/changelog/{component}/v{VERSION}.md
```

Resolve `{component}` as a lowercase kebab-case segment matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Reject ambiguous component hints rather than emitting a guessed or underscore-bearing directory. The `v{VERSION}.md` filename is an exact version contract and is not slug-normalized.

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

`<packet>` and `<phase-folder>` are validated lowercase kebab-case segments. Preserve the fixed `changelog-` prefix and `-root.md` suffix, and reject an input whose semantic slug cannot be resolved without collision.

Nested mode uses the spec-kit generator and templates:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <spec-folder> --write
```

Canonical nested templates are `.skilled/skills/system-spec-kit/templates/changelog/root.md` and `.skilled/skills/system-spec-kit/templates/changelog/phase.md`.

---

## 5. CHANGELOG FORMAT CONTRACT

Read `assets/changelog-template.md` before generating global changelog content. It defines the two-tier narrative format, the voice rules, the omission decision-aid, and the conciseness caps. The canonical exemplar every generated changelog must be able to sit beside is `.skilled/changelog/system-spec-kit/v4.0.0.0.md`.

### Shared Format Facts

The shared template states:

1. Global changelog files open with the summary narrative. YAML frontmatter and the editorial title (the exemplar's shape) may precede it. No version header, no backlink, no version-date line.
2. The summary leads with why the release matters, not technical stats.
3. When the release has a spec folder, the spec folder line is a blockquote: `> Spec folder: `{path}` (Level {N})`.
4. Compact format is a lean narrative: summary, at-a-glance bullets, Upgrade. Add a short Why This Release section when the motivation is not obvious.
5. Expanded format is the full v4 narrative: opening narrative, Why This Release, What's New at a Glance, topical H2 sections with benefit-led H4 story items, and Upgrade Notes.
6. Files Changed tables, test-metric tables and schema tables are not default sections. A table appears only when the numbers themselves are the story (the omission rules in the template govern this).
7. Use compact format under 10 changes when the release is not major and has no breaking change. Use expanded format for 10 or more changes, a major bump, or any breaking change.

### Compact Format

Required shape:

```markdown
{Summary paragraph: 1-3 sentences. What the release does and why it matters.}

> Spec folder: `{path}` (Level {N}) (only when the release has a spec folder)

## What's New at a Glance

- **{The change, stated as a short sentence.}** {One or two plain sentences on what it means for the reader.}

## Upgrade

{Migration steps, or "No migration required."}
```

### Expanded Format

Required shape:

```markdown
{Opening narrative: 1-5 paragraphs, plain prose, no headers.}

> Spec folder: `{path}` (Level {N}) (only when the release has a spec folder)

## Why This Release

{The motivation in one to three short paragraphs, or bullets with bold lead-ins stating the practical gain.}

## What's New at a Glance

- **{The theme, stated as a short sentence.}** {One or two plain sentences on what changed.}

---

## {Topical Domain}

{Optional 1-2 sentence introduction.}

#### {Benefit-led heading, usually 2-7 words}

{One to three flowing paragraphs, seven at most: what was broken, what changed, why it matters.}

&nbsp;

#### {Next heading}

{Same pattern. Inline **Breaking:** markers where a change breaks something.}

---

## Upgrade Notes

- **Adopt.** {renames and new things to use}
- **Repoint.** {moved paths}
- **Drop.** {removed surfaces}
```

### Section Naming

Name H2 sections for the domain they change, the way the exemplar names sections `Spec Kit`, `Safer Git`, `Documentation as a System`. Pick one to five domains per release. A release the size of the exemplar legitimately spans more, provided every domain earns its section. Do not use fixed change-type labels (`New Features`, `Bug Fixes`) when a domain name says more. The template's old fixed vocabulary (`Search`, `Saving Memories` and similar) is retired.

### Source Contract Mismatch

The auto workflow YAML previously carried older snippets that required `# v{VERSION}`, a version-date header, and `###` highlight headings. Those snippets are reconciled with this contract. When any source nevertheless conflicts with `assets/changelog-template.md`, follow the template, write in the narrative format, and record the mismatch rather than inventing a hybrid format.

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
ls -d .skilled/changelog/*/ 2>/dev/null | sort
```

Resolution strategy:

1. Treat each discovered folder as a plain component name (e.g. `sk-doc`, `system-spec-kit`, `sk-code`). The real folders under `.skilled/changelog/` are not numerically prefixed. The auto workflow's older `NN--component-name` / `00--` fallback pattern is stale, so match on the plain folder names as they exist on disk.
2. Match changed file paths against discovered component names.
3. Match `.skilled/skills/{name}/**` to the folder named `{name}` when possible.
4. Match `.skilled/commands/**` to the folder that owns those commands when possible.
5. Match `.skilled/agents/**` to the folder that owns those agents when possible.
6. Match `component_hint` against discovered folder names by substring.
7. Match spec path segments against discovered folder names as a tiebreaker.
8. If no folder matches, do not invent or default to a fallback folder. Pause and ask which component this changelog belongs to.

Component selection rules:

1. If one component accounts for more than 60 percent of changed files, choose it as primary.
2. If several components are roughly equal, list all affected components and choose primary by file count.
3. If no component matches, pause and ask rather than writing to a guessed folder.
4. Verify the chosen target folder exists before writing.
5. Never create a missing global changelog component folder as part of this workflow.

---

## 7. CREATION WORKFLOW

Complete these seven steps in order. The SKILL.md is the primary workflow contract. The command YAMLs number the same workflow as eight steps, because they run the optional GitHub release as its own step 7 between writing the file and reporting.

After resolving a component, packet, or phase slug and before writing, validate that authored slug with the shared checker. Exact version filenames remain governed by the version contract, and frozen changelog paths remain exempt under the filesystem-naming canon.

```bash
python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <component-or-phase-slug>
```

1. **Analyze context.** Determine source type from the request or setup output. For a spec folder, read implementation summary, tasks, and spec files, then extract work summary, files changed, change type, level, and output mode. For a component hint, gather recent commits and affected files for that component. For git history, inspect recent commits and diff stats. Compile `work_context` with summary, files, change type, and source.
2. **Resolve output target.** If nested mode, run the nested changelog generator with `--json`, read the root or phase nested template, extract the output path, and skip global component mapping. If global mode, discover `.skilled/changelog/*/`, parse component folders, match changed files and hints, choose the primary component, list secondary components, and verify `.skilled/changelog/{resolved_folder}/` exists.
3. **Determine version.** If nested mode, skip version calculation. If global mode, list existing files in the target folder, parse the latest `vX.Y.Z.B` version, choose bump type from explicit `--bump` or auto-detection, calculate the next version, and increment the build segment if the file already exists.
4. **Generate content.** Read `assets/changelog-template.md` for global mode or the spec-kit nested template for nested mode. Set date when needed. Select compact format for fewer than 10 non-breaking, non-major changes and expanded format for 10 or more changes, a major bump, or any breaking change. Write the narrative opening that leads with why the release matters. Apply the omission decision-aid: drop file inventories, test metrics, schema churn and mid-cycle internal experiments by default, and compress reverted work to one story sentence. Add tables only when the numbers themselves are the story. Generate the topical sections, at-a-glance bullets, and upgrade notes with bold lead-ins.
5. **Validate quality.** Check format, version, and content before writing. Confirm required sections are present, version is strictly greater than the latest global version, no target file exists, summary is non-empty, every path the changelog names exists, and upgrade guidance is present. Auto-fix small missing sections when safe, then revalidate.
6. **Write the file.** If nested mode, run `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js {spec_folder} --write` and verify the output path. If global mode, write `.skilled/changelog/{primary_component}/v{next_version}.md` and read back the first lines to verify creation. If secondary components exist, note them as additional changelog candidates rather than writing extra files silently.
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
3. Explain every change as what was broken, what changed, and why it matters.
4. One idea per sentence, active voice, no hedging.
5. Explain jargon on first use with parenthetical definitions.
6. Keep file inventories, line numbers and machinery names the user never touches out of the narrative. The spec packet holds the file map. Identifiers the reader must act on (skill names, paths, commands) appear where the reader needs them.
7. Follow the HVR rules: no Oxford commas, em dashes, or semicolons.

### Omission Decision-Aid

Apply before writing, not during cleanup. The full keep/drop list lives in `assets/changelog-template.md` Section 3. The operating rules are:

1. Keep user-visible behavior, breaking changes with their migration step, anything the user must do, and honest corrections of wrong claims.
2. Drop file-by-file inventories, test pass counts and metric tables, schema internals, counts of review passes, validation rounds or line-count deltas, and internal machinery names the user never touches.
3. Compress work that was tried and reverted during the cycle to one story sentence, or drop it entirely.
4. A table appears only when the numbers themselves are the story. Most changelogs contain zero tables.
5. When in doubt, ask whether a curious reader can find the detail in the spec packet. If yes, it does not belong in the changelog.

### Structure

1. Open each at-a-glance bullet with a bold lead-in sentence, then one or two plain sentences, all on one list line.
2. Use one to three flowing paragraphs per item in expanded format, seven at most for a dense item. Never `**Problem:**` and `**Fix:**` labels.
3. Use short benefit-led H4 subheadings, 2-7 words for most and 10 at most, easy to scan. No packet IDs, no numbering, no sentence-length headings unless sequence is load-bearing.
4. Name H2 sections for the domain they change, not the change type.
5. Use H4 (`####`) for item headings. Never H3.
6. Use `&nbsp;` between H4 items within the same H2.
7. Use `---` only between H2 sections. Never place `---` or `&nbsp;` between an H2, or its intro paragraph, and the first H4.
8. Mark breaking changes inline with `**Breaking:**` at the point they are described.
9. Avoid metrics soup. Do not pack many numbers into one sentence.
10. Respect the conciseness caps in the template: 3-sentence summary, Why This Release within 3 short paragraphs or 4 sentences, 12 at-a-glance bullets, 7 paragraphs per H4 item, 10 words per H4 heading, 40 prose lines for a compact file.

### Release Notes

For GitHub release notes, use the changelog content with any YAML frontmatter and the editorial title H1 removed, then append:

```text
Full changelog: `.skilled/changelog/{component}/v{VERSION}.md`
```

The command YAMLs own the release itself, as `step_7_publish_release`, and run it only when `publish_release` is explicitly true. The tag is `v{next_version}`, the version just written. The step checks for a tag collision and for an authenticated `gh`, then runs `git tag -a`, `git push origin {release_tag}` and `gh release create {release_tag} --notes-file {notes_file}`, which publishes immediately with no draft stage. `:confirm` shows the exact commands and runs them only after approval. A packet-local changelog never releases, because it has no repo-wide version to tag. This packet prepares the release body and nothing more.

---

## 9. VALIDATION

Before delivery, validate target, version, and content.

Global changelog checks:

1. Target path is `.skilled/changelog/{component}/v{VERSION}.md`.
2. Target component folder exists before writing.
3. Version follows `vX.Y.Z.B`.
4. Version is strictly greater than the latest existing version in that folder.
5. No file already exists at the target version path.
6. The prose opens with the summary narrative, not a machine version header, per the shared template. Frontmatter and the editorial title, the exemplar's shape, are allowed.
7. Spec folder blockquote is present when source is a spec folder.
8. Compact files include the summary narrative, `## What's New at a Glance` and `## Upgrade`.
9. Expanded files include the opening narrative, `## Why This Release`, `## What's New at a Glance`, at least one topical H2 section with H4 items, and `## Upgrade Notes`.
10. No default Files Changed, Test Impact or Schema Changes section is present. Any table present passes the earned-evidence rule: the numbers themselves are the story.
11. The summary is concise, plain English, and explains why the release matters.
12. Omission rules applied: no file-by-file inventories, no test-metric tables, no schema tables, no mid-cycle experiment detail beyond a one-line story sentence, and no counts of review passes, validation rounds or line-count deltas.
13. Conciseness caps respected: summary within 3 sentences, Why This Release within 3 short paragraphs or 4 sentences, at-a-glance within 12 bullets, no H4 item beyond 7 paragraphs, compact files within 40 prose lines.
14. H4 headings are benefit-led and 10 words at most, with most at 2-7. No numbered headings, no sentence-length headings, no H3 inside topical sections.

Voice and structural enforcement, run on the draft before writing:

```bash
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <draft-file>
```

The scan must report zero hard blockers. Mechanical deductions below the hard-blocker threshold are acceptable. A hard blocker (banned punctuation, banned words) blocks the write until fixed. If the scanner is unavailable, apply the HVR rules manually and record that the scan was skipped.

Structural checks complement the scanner: bold lead-ins on at-a-glance bullets, `&nbsp;` between H4 items within a section, `---` only between H2 sections, no `**Problem:**`/`**Fix:**` labels, and inline `**Breaking:**` markers rather than a separate section when context permits.

Nested changelog checks:

1. Output path resolves inside the target packet's `changelog/` folder.
2. Root spec folder output uses `changelog/changelog-<packet>-root.md`.
3. Phase child output uses `../changelog/changelog-<packet>-<phase-folder>.md`.
4. The spec-kit nested generator is the write path.
5. Global version rules are not applied.

Suggested shared markdown checks after writing authored markdown:

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <written-file>
python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <written-file>
```

If validation fails, fix blocking issues before delivery or report the exact blocker and command output.

---

## 10. RULES

### ✅ ALWAYS

1. Always follow the seven-step workflow in order.
2. Always read `assets/changelog-template.md` before generating global changelog content.
3. Always dynamically discover global changelog component folders from `.skilled/changelog/`.
4. Always resolve global mode to an existing component folder before writing.
5. Always validate global version sequencing before writing.
6. Always keep global version numbers four-part: `vX.Y.Z.B`.
7. Always choose compact vs expanded format from change count and release type.
8. Always use the spec-kit nested changelog generator for packet-local output.
9. Always list secondary affected components when detected.
10. Always verify the written file before claiming completion.
11. Always keep this packet self-contained and leave advisor graph identity at the `sk-doc` hub root.

### ⛔ NEVER

1. Never add packet-local `graph-metadata.json`.
2. Never skip version validation for global changelogs.
3. Never overwrite an existing changelog file.
4. Never use a version number that already exists.
5. Never guess a component folder without file path, hint, spec path, or fallback analysis.
6. Never create missing global changelog folders inside this workflow.
7. Never write a changelog with an empty summary or empty required sections.
8. Never apply global component versioning rules to nested packet-local changelogs.
9. Never make the command router or YAML reference the only workflow contract for this packet.
10. Never hide source-format conflicts. Mark them clearly and prefer the canonical template when formatting prose.

### ⚠️ ESCALATE IF

1. Source context cannot be found in a spec folder, component history, or git history.
2. Component resolution remains ambiguous after file-count and path-segment analysis.
3. The calculated version is unexpected or cannot be made unique by build increment.
4. Required changelog sections would be empty.
5. The user requests a GitHub release action but no Git release workflow or command context is available.
6. Validation fails after safe local fixes.

---

## 11. REFERENCES

Use these only when the core path above is not enough:

1. `assets/changelog-template.md` for the canonical global changelog and release-note format.
2. `references/README.md` route-map to the overflow set: `references/worked-examples.md` (filled-in global and packet-local entries), `references/version-bump-rules.md` (concrete four-part version choices), and `references/topology-edge-cases.md` (placement, back-dating, source conflicts, and the optional GitHub release flow).
3. `.skilled/commands/create/changelog.md` for the thin `/create:changelog` router boundary.
4. `.skilled/commands/create/assets/create-changelog-auto.yaml` and `create-changelog-confirm.yaml` for the source workflows this packet inlines. `/create:changelog` runs `:auto` (autonomous) or `:confirm` (interactive checkpoints), and both resolve to this same packet contract.

---

## 12. SUCCESS CRITERIA

The workflow is successful when:

1. The output mode is correctly classified as global or packet-local nested.
2. Global output is written to `.skilled/changelog/{component}/v{VERSION}.md`, or nested output is written through the spec-kit nested generator to the packet `changelog/` path.
3. Global versioning is sequential, unique, and four-part.
4. The file follows the compact or expanded shape from `assets/changelog-template.md`.
5. The changelog reads in the v4 narrative style: why-first opening, benefit-led headings, omission rules applied, upgrade notes with bold lead-ins.
6. Optional release-note body uses the changelog content and appends the full changelog path when `--release` is requested.
7. Validation passes, or any remaining issue is escalated with exact evidence.
8. No other files are modified unless the user explicitly requested them.
