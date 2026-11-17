# Skilled: Public Release

> How the public Skilled repository is laid out, what a project keeps of its own and how a release is cut.

&nbsp;

## 1. OVERVIEW

This file is for the maintainer who cuts a release. It maps the repository, says which files a project owns and walks through a release from the first commit to the GitHub release page.

The public repository is the source of truth for Skilled. Everything is authored once under `.skilled/`. Each runtime folder links into it or carries copies generated from it, next to that runtime's own config. Framework changes are made here directly, so there is no sync step before a release.

Setting Skilled up in a project is a separate job. The [install guide](INSTALL-SKILLED.md) covers it step by step.

&nbsp;

## 2. REPOSITORY LAYOUT

The authored tree sits under `.skilled/`. The runtime folders and root files sit around it:

```text
.skilled/                      Authored root
  skills/                      Skills and their mode packets
  agents/                      Agent definitions
  commands/                    Slash commands
  hooks/                       Hooks shared by every runtime
  repo-rules/                  Rule files that REPO RULES.md routes to
  scripts/                     Git hooks and maintenance scripts
  bin/                         Launchers and command-line entry points
  changelog/                   Release notes and component changelogs
  manual-testing-playbook/     Framework-level test scenarios
  specs -> ../specs            Link to the top-level specs folder
.claude/ .codex/ .cursor/      Runtime folders: links into .skilled/ or
.devin/ .dsh/ .opencode/       copies generated from it, plus each
.pi/ .vibe/                    runtime's own config
.github/                       Workflows, a shared setup action and Dependabot config
specs/                         Spec packets, one folder per track
AGENTS.md                      Instructions every runtime loads
REPO RULES.md                  Router for the rule files
opencode.json                  OpenCode config and its Code Mode registration
.utcp_config.json              The external tools Code Mode can call
.mcp.json -> .claude/mcp.json  Code Mode registration for Claude Code
```

The root also holds the four guides a reader meets first: the README, the install guide, the contributing guide and the security policy.

&nbsp;

## 3. PROJECTS THAT USE SKILLED

A project takes Skilled in one of two ways. Each way decides when a release reaches it.

A linked project points at one Skilled checkout on your machine. `/doctor:symlink link` always links `.skilled` and adds the runtime folders you pick from Claude Code, OpenCode, Codex, Cursor, Devin and Pi. DeepSeek Harness and Mistral Vibe are not linked. On request it also links the rule files, `.github`, the Code Mode config or the `.env` file. Each link gets an ignore line in `.git/info/exclude`, because it points at a path on your own machine. Never commit one. A release reaches a linked project on the next `git pull` in the checkout.

A copied project commits a copy of Skilled pinned to one commit. Its own changes live in an overlay folder, `skilled-overlays/` unless the copy names another. `/doctor:overlay repin` moves the copy to a newer commit and puts the overlays back on it, so a release reaches a copied project only when it re-pins.

Either way, the project owns its own `specs/` folder, its `AGENTS.md`, the optional `.sk-git/` rules that `/doctor:git standards` writes and its source code. `/doctor:agents-md embed` keeps the shipped sections inside the project's `AGENTS.md`. Context saves land in the `specs/` folder of the repository they run from, so run them from the project and not from the checkout. `SPEC_KIT_SPECS_DIR` names a fallback specs root and `SPEC_KIT_DB_DIR` moves the skill advisor's database. The [environment variable reference](.skilled/skills/system-spec-kit/references/config/environment-variables.md) has both.

&nbsp;

## 4. RELEASE WORKFLOW

A release moves through five steps. A typo fix or a small doc change needs none of them. It ships as a plain commit with no release entry.

### Classify The Change

Pick the release type from what changed. [Version Numbers](#5-version-numbers) maps each type to a version part and a `--bump` value.

### Write The Entry

Write the release entry with the changelog workflow:

```
/create:changelog skilled --bump <level>
```

Pass `--bump` every time. Without it the workflow guesses from the spec folder and the commit subjects. With no clear signal it falls back to a series bump. When an untagged entry is already open, the workflow extends it and keeps its version instead of starting a new one.

Then run `/create:changelog <skill>` once for each skill the release changed. Each component changelog lands in that skill's own `changelog/` folder and carries the skill's own version, which never becomes a repository tag. [Release Notes](#7-release-notes) covers the format of the entry.

### Review

> **HARD STOP:** nothing is committed until the operator has seen the changes and approved them.

```bash
git status
git diff --stat
```

### Commit And Push

Stage the release files by path. `git add -A` would also stage unrelated work.

```bash
git add .skilled/changelog/skilled/vX.X.X.X.md <other changed paths>
git commit
git push origin main
```

The commit-msg hook holds the message to the [commit template](.skilled/skills/sk-git/assets/commit-message-template.md). The subject takes the form `type(scope): summary`, such as `docs(changelog): add the vX.X.X.X release notes`. A prose body says why. The last paragraph holds the trailers: `Spec:` names the packet when the work belongs to one. The prepare-commit-msg hook stamps `Commit-Id:`. `main` and `skilled/v*` branches push without a prompt. Any other branch asks first, unless the sk-git allowlist names it.

### Publish

Publishing tags the version, pushes the tag and creates the GitHub release with the entry as its body. Commit the entry first. A tag made before that would point at a commit without it, so the workflow stops before tagging.

```
/create:changelog skilled --release
```

To publish by hand instead:

```bash
python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/build_release_notes.py \
  .skilled/changelog/skilled/vX.X.X.X.md --out notes.md
git tag -a vX.X.X.X -m "vX.X.X.X: Editorial Title"
git push origin vX.X.X.X
gh release create vX.X.X.X --title "vX.X.X.X, Editorial Title" --notes-file notes.md
```

The script drops the entry's frontmatter and title line and adds the pointer to the full changelog. A pushed tag alone does not appear on the Releases page. `gh release create` is the step that publishes it.

When an entry changes after its release is out, rebuild the notes and run `gh release edit vX.X.X.X --notes-file notes.md`. Moving a tag deletes and recreates a public ref, so it needs the operator's yes every time. To withdraw a release:

```bash
gh release delete vX.X.X.X --yes
git push --delete origin vX.X.X.X
git tag -d vX.X.X.X
```

&nbsp;

## 5. VERSION NUMBERS

A version has four parts, `MAJOR.MINOR.SERIES.PATCH`. The version is also the release's git tag, `vX.X.X.X`. The `--bump` names follow the changelog workflow, not the part names, so `patch` bumps SERIES and `build` bumps PATCH.

| Change | Part | `--bump` | Example |
| --- | --- | --- | --- |
| A breaking change that needs a migration | MAJOR | `major` | `4.0.0.0` |
| New features that stay backward compatible | MINOR | `minor` | `3.6.0.0` |
| A new theme of related changes | SERIES | `patch` | `4.0.2.0` |
| Fixes within the current series | PATCH | `build` | `4.0.0.16` |

&nbsp;

## 6. RELEASES

The latest release is v4.1.0.0, Improved Chat Automation, Search & Session Handover. Its entry is [v4.1.0.0.md](.skilled/changelog/skilled/v4.1.0.0.md). The [latest release page](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases/latest) always shows the newest one.

The current generation has four series:

| Series | Releases | Theme |
| --- | --- | --- |
| `4.0.0.x` | 4.0.0.0 to 4.0.0.16 | The foundation rebuilt: Spec Kit, deep loops and parent skills |
| `4.0.1.x` | 4.0.1.0 | Every skill routes from its own file |
| `4.0.2.x` | 4.0.2.0 | Skilled in your own project |
| `4.1.0.x` | 4.1.0.0 | Chat automation, search and session handover |

The [GitHub releases page](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases) lists the earlier releases.

&nbsp;

## 7. RELEASE NOTES

Each release has one entry, `.skilled/changelog/skilled/vX.X.X.X.md`. The 4.x entries sit at the top of that folder. Older entries are grouped by generation in `v1+/`, `v2+/` and `v3+/`. The folder does not hold one for every old tag.

Entries follow the [changelog template](.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md), the same one every component changelog uses. [v4.0.0.0](.skilled/changelog/skilled/v4.0.0.0.md) is the house-style example.

An entry opens with why the release matters, in plain words. It groups the changes into sections named for what they change and closes with its spec-folder line after the upgrade notes. A release with fewer than ten changes and no breaking change uses the compact format. Ten or more changes, a major version or a breaking change calls for the expanded format, which adds a section on how the release was checked. The template holds the voice rules, the section order and the checklist. A shape check runs on the draft before the workflow writes it.

&nbsp;

## 8. RELATED DOCUMENTS

- **[Install Guide](INSTALL-SKILLED.md)** - link or copy Skilled into your own project
- **[Contributing](CONTRIBUTING.md)** - how to propose a change
- **[Security](SECURITY.md)** - how to report a problem and what the guards cover
- **[Release Notes Folder](.skilled/changelog/skilled/)** - every framework release entry
- **[Changelog Template](.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md)** - the format every entry follows
- **[Commit Template](.skilled/skills/sk-git/assets/commit-message-template.md)** - the commit rules the git hooks enforce
- **[Git Hooks README](.skilled/scripts/git-hooks/README.md)** - each git hook gate and its bypass
- **[GitHub Repository](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops)** - the public home of Skilled
