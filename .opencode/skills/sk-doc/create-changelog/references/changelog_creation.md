---
title: Changelog Creation - Examples and Edge Cases
description: Supplementary examples and edge-case guidance for create-changelog, covering global and packet-local entries, version bump choices, topology placement, GitHub release prompts, and common mistakes.
trigger_phrases:
  - "changelog creation examples"
  - "create changelog edge cases"
  - "version bump decision rules"
  - "packet local changelog placement"
  - "github release changelog option"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Changelog Creation - Examples and Edge Cases

Supplementary examples and edge-case guidance for `create-changelog`. This reference is overflow detail only. The packet `SKILL.md` is the contract for the primary numbered workflow.

---

## 1. OVERVIEW

Use this file when the primary workflow is clear, but the author needs concrete examples or a decision aid for placement, version bump selection, release-note behavior, or failure modes.

**Primary sources**:
- `.opencode/skills/sk-doc/shared/assets/changelog_template.md`
- `.opencode/commands/create/assets/create_changelog_auto.yaml`
- `.opencode/commands/create/assets/create_changelog_confirm.yaml`
- `.opencode/commands/create/assets/create_changelog_presentation.txt`
- `.opencode/skills/sk-doc/changelog/v1.8.0.0.md`
- `.opencode/skills/sk-doc/changelog/v1.8.1.0.md`

**Current reality highlights**:
- global changelogs live under `.opencode/changelog/{component}/v{VERSION}.md`
- packet-local changelogs are generated through the spec-kit nested changelog generator
- global versions use four segments: `v{MAJOR}.{MINOR}.{PATCH}.{BUILD}`
- the initial global version is `v1.0.0.0`
- optional GitHub release publishing is collected as `publish_release`, but the workflow sources only define the prompt and result field, not the exact `gh` command

## 2. GLOBAL VS PACKET-LOCAL OUTPUT

Choose the output mode before thinking about version numbers.

| Output Mode | Where It Writes | Versioned? | Source Rule |
|---|---|---|---|
| Global component changelog | `.opencode/changelog/{component}/v{VERSION}.md` | Yes | Use for public component release notes |
| Packet-local root changelog | `{spec-folder}/changelog/changelog-<packet>-root.md` | No | Use for root spec-folder packet summary |
| Packet-local phase changelog | `{phase-parent}/changelog/changelog-<packet>-<phase-folder>.md` | No | Use for phase-child summary |

**Decision rule**:

```text
Is this a nested spec packet or phase-child packet changelog?
  YES -> use packet-local nested changelog output
  NO  -> resolve a global component folder and calculate a vX.Y.Z.W file
```

Topology detection from the workflow:
- `--nested` forces nested mode.
- a spec folder that is a phase child uses nested mode.
- a spec folder with direct child phase folders uses nested mode.
- a spec folder that already has `changelog/` uses nested mode.
- component and git-history sources default to global mode.

## 3. GLOBAL ENTRY EXAMPLE

This example mirrors the compact style used by `sk-doc` changelog entries such as `v1.8.0.0` and `v1.8.1.0`. It starts with the summary paragraph, not with a version heading, matching the shared changelog template.

```markdown
sk-doc's changelog creation workflow now has a dedicated packet that separates the contract from the long-form examples authors need when choosing output mode, version bump, and release behavior.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent` (Level 1)

---

## What Changed

#### Documentation

- **New `create-changelog` packet** -- changelog authoring now has its own sk-doc workflow packet instead of relying on scattered command knowledge. The packet keeps the numbered workflow short and points to this reference for examples and edge cases.
- **Overflow reference** -- the reference explains global versus packet-local placement, version bump choices, topology edge cases, and optional release publishing. This keeps the `SKILL.md` readable while preserving the nuance needed for correct output.

#### Commands

- **Workflow alignment** -- the packet follows the existing `/create:changelog` auto and confirm YAMLs: gather context, resolve component or nested output, calculate version when needed, generate content from the template, validate, then write.

## Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/sk-doc/create-changelog/SKILL.md` | Primary numbered workflow for changelog creation |
| `.opencode/skills/sk-doc/create-changelog/references/changelog_creation.md` | Worked examples and edge cases |
| `.opencode/commands/create/assets/create_changelog_auto.yaml` | Existing autonomous workflow source |
| `.opencode/commands/create/assets/create_changelog_confirm.yaml` | Existing checkpointed workflow source |

## Upgrade

No migration required.
```

**Annotations**:
- The first paragraph explains why the release matters, not only what files changed.
- The spec-folder blockquote mirrors real sk-doc entries.
- `#### Documentation` and `#### Commands` use the shared category vocabulary.
- Technical file paths stay in the table, not in the summary prose.
- This is a global example because it would write to a component changelog folder with a `vX.Y.Z.W.md` filename.

## 4. PACKET-LOCAL EXAMPLE

Packet-local changelogs do not use the global component version sequence. The YAML routes nested mode to the spec-kit generator and reads the spec-kit root or phase template instead of the global template.

```markdown
# Changelog - sk-doc parent root

This packet adds the `create-changelog` sub-skill to the sk-doc parent hub and records the work needed to keep changelog creation topology-aware.

## Summary

- Added a dedicated creation packet for changelog authoring.
- Kept the packet `SKILL.md` focused on the primary workflow.
- Moved longer examples and pitfalls into `references/changelog_creation.md`.

## Changed Files

| File | Change |
|---|---|
| `.opencode/skills/sk-doc/create-changelog/SKILL.md` | New packet contract |
| `.opencode/skills/sk-doc/create-changelog/references/changelog_creation.md` | Supplemental reference |

## Validation

- Confirmed the reference is grounded in the existing changelog template and command YAMLs.
```

**Annotations**:
- The exact packet-local shape is owned by `.opencode/skills/system-spec-kit/templates/changelog/root.md` and `phase.md`.
- Use the nested generator: `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write`.
- The output filename is deterministic, such as `changelog-<packet>-root.md` or `changelog-<packet>-<phase-folder>.md`.
- Do not invent a `vX.Y.Z.W.md` filename for packet-local output.

## 5. VERSION BUMP DECISION RULES

Version bump rules apply only to global component changelogs.

| Bump | Calculation | Use When | Concrete Example |
|---|---|---|---|
| Major | `{MAJOR+1}.0.0.0` | Breaking change, overhaul, rewrite, migration, or platform-level version shift | `v1.8.1.0` to `v2.0.0.0` for a breaking command contract rewrite |
| Minor | `{MAJOR}.{MINOR+1}.0.0` | Significant new feature or subsystem addition | `v1.8.1.0` to `v1.9.0.0` for a new `create-changelog` packet |
| Patch | `{MAJOR}.{MINOR}.{PATCH+1}.0` | Bug fix, refactor, docs update, improvement, cleanup, or incremental change | `v1.8.1.0` to `v1.8.2.0` for fixing packet validation wording |
| Build | `{MAJOR}.{MINOR}.{PATCH}.{BUILD+1}` | Hotfix, typo, or same-day correction on an already-published version | `v1.8.1.0` to `v1.8.1.1` for a release-note typo fix |

Detection order from the workflow:
- first honor a user-provided `--bump` flag
- then inspect `spec.md` title and purpose for change-type keywords
- then inspect git commit messages for conventional prefixes
- default to patch when no clear signal exists
- if the calculated version already exists, increment `BUILD` until the filename is unique

The real sk-doc entries show the shape of normal releases:
- `v1.8.0.0` records a versioning standard, engine, enforcement rollout, and hardening work.
- `v1.8.1.0` records a validator and create-machinery improvement that extended the skill-authoring contract.

## 6. TOPOLOGY EDGE CASES

### Hub Versus Packet Changelog Placement

A hub-level sk-doc release belongs in the resolved global component folder when it is release-facing. A packet-local execution summary belongs in the spec packet's `changelog/` folder when nested topology is detected.

Practical rule:
- if the changelog is for users of a component, write global
- if the changelog is for a spec packet's internal completion trail, write packet-local
- if multiple components are affected, pick the component with more than 60 percent of changed files when it dominates
- if multiple components are roughly equal, choose the highest file-count component and note the secondary components
- if nothing matches, pause and ask which component the changelog belongs to rather than guessing a folder (the real folders under `.opencode/changelog/` are plain component names; the older `00--` umbrella-folder convention is stale)

### First Entry Creation

When a global component folder exists but has no prior versions, use `v1.0.0.0`. Do not create a new component folder from the changelog workflow. The YAML says target folders must already exist.

### Back-Dating

The workflow sources set `DATE` to today's date in `YYYY-MM-DD` format. They do not define a back-dating rule. Treat back-dating as UNKNOWN unless the user provides an explicit release-management instruction.

### Source Conflicts To Watch

The shared template says global changelog files start directly with the summary paragraph and have no version header. Some YAML validation text still references H1, backlink, and version-date checks. Use the shared template as the format source for authoring examples, and treat the YAML checklist wording as stale or UNKNOWN until the packet contract resolves it.

## 7. OPTIONAL GITHUB RELEASE FLOW

The command surface supports a `--release` flag and a `publish_release` setup field.

Known behavior from sources:
- `publish_release` defaults to `false` in auto setup.
- the startup prompt asks whether to create a tag and GitHub release when `--release` is not supplied.
- the completion result includes `Release Published: yes/no/not requested`.
- the shared template says GitHub release notes can use the changelog body as-is, then append `Full changelog: .opencode/changelog/{component}/v{VERSION}.md`.

UNKNOWN from the provided workflow sources:
- the exact tag name format
- the exact `gh release create` command
- whether the release should be draft or published immediately
- whether packet-local changelogs can publish releases

Use `--release` only after the changelog file path, component, and version are resolved. Do not publish a release for a packet-local changelog unless the primary `SKILL.md` or user instruction explicitly says that is supported.

## 8. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Restating the whole workflow in this reference | The packet contract becomes duplicated and drifts | Keep numbered steps in `SKILL.md`; keep examples here |
| Applying version bumps to nested changelogs | Packet-local output uses deterministic filenames, not global release versions | Skip version calculation in nested mode |
| Creating a missing global component folder | The YAML requires the target folder to exist | Stop and ask for a valid existing component target |
| Guessing the component from conversation context | The workflow requires file path, component hint, spec path, or git evidence | Resolve against discovered `.opencode/changelog/*/` folders |
| Reusing the global template for packet-local output | Nested output uses spec-kit root or phase templates | Run the nested changelog generator |
| Overwriting an existing version file | It destroys release history and violates the workflow | Increment `BUILD` until the path is unique |
| Choosing major because the work was large | Major means breaking or architectural change, not merely high effort | Use minor for new feature work and patch for incremental repair |
| Publishing a GitHub release with guessed metadata | The exact release command is not defined in the sources | Mark unknowns or require explicit release instructions |
| Putting technical details in the summary | The template asks for plain-English value first | Move paths and function names into Files Changed |
| Using H3 category headings in compact examples | The shared template uses H4 category subsections under `## What Changed` | Use `#### Category Name` |

## 9. RELATED RESOURCES

- `.opencode/skills/sk-doc/shared/assets/changelog_template.md` - global changelog and release-note format
- `.opencode/commands/create/changelog.md` - thin router for `/create:changelog`
- `.opencode/commands/create/assets/create_changelog_presentation.txt` - setup fields, release prompt, and result display
- `.opencode/commands/create/assets/create_changelog_auto.yaml` - autonomous workflow behavior
- `.opencode/commands/create/assets/create_changelog_confirm.yaml` - checkpointed workflow behavior
- `.opencode/skills/system-spec-kit/templates/changelog/root.md` - packet-local root template
- `.opencode/skills/system-spec-kit/templates/changelog/phase.md` - packet-local phase template
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js` - packet-local generator
