# Skilled: Public Release

How the public Skilled repository is laid out, how a project uses it and how a release is cut.

---

## 1. OVERVIEW

The public repository is the source of truth for Skilled. You author everything under `.skilled/`. Each runtime folder holds links into `.skilled/` plus that runtime's own config.

A project uses Skilled in one of two ways. It links to one Skilled checkout, or it commits its own copy. [INSTALL-SKILLED.md](INSTALL-SKILLED.md) is the setup guide for both. This file covers the repository layout and the release process.

---

## 2. ARCHITECTURE

```text
Public repo (source of truth)
  .skilled/                      Authored root
     skills/                     Skills and their mode packets
     agents/                     Agent definitions
     commands/                   Slash commands
     hooks/                      Hooks shared by every runtime
     repo-rules/                 Rule files that REPO RULES.md routes to
     scripts/                    Git hooks and maintenance scripts
     bin/                        Launchers and command-line entry points
     changelog/                  Release notes and component changelogs
     manual-testing-playbook/    Framework-level test scenarios
     specs -> ../specs           Link to the top-level specs folder
  .claude/ .codex/ .cursor/      Runtime folders: links into .skilled/
  .devin/ .dsh/ .opencode/ .pi/  plus each runtime's own config
  .github/                       Workflows and Dependabot config
  specs/                         Spec packets, one folder per track
  AGENTS.md                      Instructions every runtime loads
  REPO RULES.md                  Router for the rule files
  INSTALL-SKILLED.md             Setup guide: link or copy
  opencode.json                  OpenCode config
  .utcp_config.json              Code Mode tool config
  .mcp.json -> .claude/mcp.json  MCP wiring for Claude Code

Linked project
  .skilled, .claude, ...         Links to the checkout, kept out of git
  specs/                         The project's own spec packets
  AGENTS.md                      The project's instructions, with the shipped sections embedded or linked

Copied project
  .skilled/, .claude/, ...       A committed copy, pinned to one Skilled commit
  skilled-overlays/              The project's changes, applied on top of the copy
  specs/                         The project's own spec packets
```

### Link or Copy

| | Link | Copy |
| --- | --- | --- |
| **Set up with** | `/doctor:install`, then `/doctor:symlink link` | `git archive` of one commit, then `/doctor:overlay apply` |
| **Updates** | One `git pull` in the checkout updates every linked project | `/doctor:overlay repin` moves the copy to a newer commit |
| **Project changes** | Live in the project's own files, next to the links | Live in the overlay folder and go back on after each re-pin |

A framework change in the public repository reaches a linked project on the next `git pull` of the checkout. A copied project picks it up when it re-pins.

### Where Project Data Lives

- **Spec packets.** `/speckit:save` writes to the `specs/` folder of the repository you run it from. Run it from your project, not from the checkout.
- **Overrides.** `SPEC_KIT_SPECS_DIR` names a fallback specs root and `SPEC_KIT_DB_DIR` moves the skill advisor's database. Both are listed in the [environment variable reference](.skilled/skills/system-spec-kit/references/config/environment-variables.md).

---

## 3. REPOSITORY LOCATIONS

| Location | Path or URL |
| --- | --- |
| **Public release (local)** | Your Skilled checkout, for example `~/skilled/` |
| **Public release (GitHub)** | [MichelKerkmeester/skilled-agent-harness_spec-driven-loops](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops) |

---

## 4. SHARED VS PROJECT-SPECIFIC

### Shared (Lives in the Public Repository)

| Component | Path |
| --- | --- |
| Skills | `.skilled/skills/` |
| Commands | `.skilled/commands/` |
| Agents | `.skilled/agents/` |
| Hooks | `.skilled/hooks/` |
| Rule files | `.skilled/repo-rules/` |
| Scripts and launchers | `.skilled/scripts/`, `.skilled/bin/` |
| Runtime folders | `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.dsh/`, `.opencode/`, `.pi/` |

`/doctor:symlink link` always links `.skilled` and links the runtime folders you pick. `.github`, `.utcp_config.json`, `.env` and the `repo-rules` folder are linked only on request with `--include`.

### Project-Specific (Lives in the Project)

| Component | Reason |
| --- | --- |
| `specs/` | The project's own spec packets |
| `AGENTS.md` | The project's instructions. `/doctor:agents-md embed` adds the shipped sections to it |
| `.sk-git/` | Optional commit, PR and branch rules the project owns, written by `/doctor:git standards` |
| `skilled-overlays/` | Copied projects only: the overlay manifest and overlay files |
| Source code | The project itself |

Links point at your machine's checkout, so `link` writes an ignore line for each one to `.git/info/exclude`. Never commit them.

---

## 5. RELEASE WORKFLOW

You make framework changes directly in the public repository. No sync step exists.

### Workflow Overview

```text
Changes made in .skilled/
         │
         ▼
┌─────────────────────┐
│  PHASE 1: CLASSIFY  │ ─── Determine release type
└──────────┬──────────┘
           │
      ┌────┴────┐
      │ Release │
      │  Type?  │
      └────┬────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
No Release   Full Release
(commit)          │
    │        ┌────┴─────┐
    │        │ PHASE 2  │ ─── Release notes + changelogs
    │        │ DOCUMENT │
    │        └────┬─────┘
    │             │
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │   PHASE 3   │ ─── Show changes, get approval
    │   REVIEW    │<--- STOP: User approval required
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │   PHASE 4   │ ─── Stage, commit, push
    │   COMMIT    │
    └──────┬──────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
  Done       ┌────┴─────┐
             │ PHASE 5  │ ─── Tag, GitHub release
             │ PUBLISH  │
             └────┬─────┘
                  │
                  ▼
                Done
         (Full Release)
```

### Phase 1: CLASSIFY

| Change Type | Release Type | Version Impact | `--bump` |
| --- | --- | --- | --- |
| Typo fixes, minor doc updates | **No Release** | None | None |
| Bug fixes within the current series | **Patch** | `x.x.x.+1` | `build` |
| A new theme of related changes | **Series** | `x.x.+1.0` | `patch` |
| New features, backward compatible | **Minor** | `x.+1.0.0` | `minor` |
| Breaking changes requiring migration | **Major** | `+1.0.0.0` | `major` |

### Phase 2: DOCUMENT (Full Release Only)

1. **Determine the version number** using Section 9.
2. **Write the release entry** with `/create:changelog skilled`. It writes `.skilled/changelog/skilled/vX.X.X.X.md` from the template in Section 8.
3. **Write a component changelog** for each skill the release changed, with `/create:changelog <skill>`. Each lands in `.skilled/skills/<skill>/changelog/` and carries the skill's own version. The same folder is reachable as `.skilled/changelog/<skill>/`.

### Phase 3: REVIEW

> **HARD STOP:** Do NOT proceed without user approval.

```bash
git status
git diff --stat
```

### Phase 4: COMMIT

Stage the files the release changed by path. Leave `git add -A` out, because it also stages unrelated work.

```bash
git add .skilled/changelog/skilled/vX.X.X.X.md <other changed paths>
git commit
git push origin main
```

The `commit-msg` hook checks the message against the rules in `.skilled/skills/sk-git/assets/commit-message-template.md`. The subject takes the form `type(scope): summary`, for example `docs(skilled): add the vX.X.X.X release notes`. `main` and `skilled/v*` branches push without a permission prompt. Every other branch asks first.

### Phase 5: PUBLISH (Full Release Only)

`/create:changelog skilled --release` runs all three steps below. It tags the version written in Phase 2, pushes the tag and publishes the GitHub release with the entry as its body. To publish by hand instead:

```bash
# 1. Create annotated tag
git tag -a vX.X.X.X -m "vX.X.X.X: Release description"

# 2. Push tag
git push origin vX.X.X.X

# 3. Create the GitHub release (MANDATORY: tags alone do NOT appear as releases)
#    notes.md is the release entry with its YAML frontmatter and H1 title removed
gh release create vX.X.X.X \
  --title "vX.X.X.X, Editorial Title" \
  --notes-file notes.md
```

> **CRITICAL**: `git push origin vX.X.X.X` only pushes the tag. It does NOT create a GitHub Release. You MUST run `gh release create` to show the release on the GitHub Releases page with formatted notes.

---

## 6. CURRENT RELEASE

| Field | Value |
| --- | --- |
| **Version** | v4.0.2.0, Skilled in Your Own Project |
| **Release Date** | 2026-11-08 |
| **GitHub** | [Repository](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops) |
| **Latest Release** | [releases/latest](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases/latest) |
| **Release Notes** | [releases/tag/v4.0.2.0](https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases/tag/v4.0.2.0) |

### Release Notes

Each release has one file, `.skilled/changelog/skilled/vX.X.X.X.md`, formatted per the template in Section 8. The 4.x entries sit at the top level of that folder. Older entries are grouped by generation in `v1+/`, `v2+/` and `v3+/`. The GitHub release body is the entry with its YAML frontmatter and H1 title removed.

**Latest**: See `.skilled/changelog/skilled/v4.0.2.0.md`

---

## 7. ADDING A NEW PROJECT

Follow [INSTALL-SKILLED.md](INSTALL-SKILLED.md). Each command that writes shows a plan first and waits for your yes, and each one prints how to undo it.

**To link a project**, open your Skilled checkout in your runtime and run `/doctor:install`. It asks for the target repository, the runtimes, the link shape and the instruction-file mode. It writes nothing. It prints these steps with your paths filled in:

| Step | Command | Run it from |
| --- | --- | --- |
| 1 | `/doctor:symlink link --root <dir> --runtimes <list> --mode auto` | The checkout |
| 2 | `/doctor:agents-md embed --root <dir>` | The checkout |
| 3 | `/doctor:mcp install` | The checkout |
| 4 | `/doctor:git setup` | Your project |
| 5 | `/doctor:setup` | Your project |

**To copy Skilled into a project**, export `.skilled` and the runtime folders you use from one commit with `git archive`, commit the result and note the commit as your pin. Put your changes in `skilled-overlays/` and run `/doctor:overlay apply`. `/doctor:overlay status` reports drift and `/doctor:overlay repin` moves the copy to a newer commit.

---

## 8. RELEASE NOTES TEMPLATE

Release entries follow the sk-create-changelog template, the same one every component changelog uses.

- **Template:** `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`
- **House style:** `.skilled/changelog/skilled/v4.0.0.0.md`, the canonical exemplar
- **Workflow:** `/create:changelog skilled` writes the entry, and `--release` also tags it and publishes the GitHub release

In short, open with why the release matters in plain English, group the changes into topical sections named for what they change and end with the upgrade notes. Use the compact format for fewer than 10 changes. Use the expanded format for 10 or more changes, a major version or a breaking change. The template carries the voice rules, the section order and the checklist.

---

## 9. VERSIONING SCHEME

Releases use a 4-part versioning scheme: `MAJOR.MINOR.SERIES.PATCH`. The version is also the release's git tag, `vX.X.X.X`.

| Part | Meaning | Example |
| --- | --- | --- |
| **MAJOR** | Breaking changes requiring migration | `4.0.0.0` |
| **MINOR** | New features (backward compatible) | `3.6.0.0` |
| **SERIES** | Thematic grouping | `4.0.2.0` |
| **PATCH** | Bug fixes within a series | `4.0.0.16` |

`/create:changelog skilled --bump <level>` increments the same four positions under different names: `major` bumps MAJOR, `minor` bumps MINOR, `patch` bumps SERIES and `build` bumps PATCH. Pass `--bump` explicitly for a release entry, because the auto-detected bump follows the workflow's own meaning for each name.

### Series History

| Series | Range | Theme |
| --- | --- | --- |
| `1.0.0.x` | 1.0.0.0-8 | Initial release (LEANN-based) |
| `1.0.1.x` | 1.0.1.0-7 | Narsil migration (unified code intel) |
| `1.0.2.x` | 1.0.2.0-9 | Skill audit + Figma MCP |
| `1.1.0.x` | 1.1.0.0-1 | Cognitive Memory + Agent System |
| `1.2.0.x` | 1.2.0.0-3 | Causal Memory & Command Consolidation |
| `1.2.1.x` | 1.2.1.0 | workflows-code--opencode + Narsil removal |
| `1.2.2.x` | 1.2.2.0-2 | Coding Analysis Lenses + MCP bug fixes |
| `1.2.3.x` | 1.2.3.0 | Ecosystem remediation + schema unification |
| `1.2.4.x` | 1.2.4.0-1 | Orchestrate agent Context Window Budget |
| `1.2.5.x` | 1.2.5.0 | workflows-code--opencode Phase 17 alignment |
| `1.3.0.x` | 1.3.0.0 | Agent fleet overhaul + @context |
| `1.3.1.x` | 1.3.1.0 | @context prompt compression |
| `1.3.2.x` | 1.3.2.0 | distributed-governance exclusivity + governance rules |
| `1.3.3.x` | 1.3.3.0 | Claude Code subagents + orchestrate.md improvements |
| `2.0.0.x` | 2.0.0.0-7 | JS→TS migration, Spec Kit script automation, architectural refactoring |
| `2.0.1.x` | 2.0.1.0-5 | Documentation alignment, security fixes & optimization (specs 008, 111-118) |
| `2.0.2.x` | 2.0.2.0-3 | Agent routing compliance + changelog reorganization (spec 014) |
| `2.1.0.x` | 2.1.0.0 | Spec-doc indexing highlight promotion |
| `2.1.1.x` | 2.1.1.0 | Aggregate unreleased framework changes |
| `2.1.2.x` | 2.1.2.0 | Gate enforcement + skill reference indexing (Source #6) |
| `2.1.3.x` | 2.1.3.0-6 | Agent model upgrade to Sonnet 4.6 + MCP recovery hardening + release-doc clarifications |
| `2.1.4.x` | 2.1.4.0 | HVR integration across documentation templates |
| `2.2.0.x` | 2.2.0.0-2 | System Spec Kit verification hardening + release-doc refresh (deferred-suite activation, CHK-336 closure, README/metadata sync) |
| `2.2.1.x` | 2.2.1.0 | Context overload prevention for orchestrator agents |
| `2.2.2.x` | 2.2.2.0 | TOML commands + MCP server config |
| `2.4.0.x` | 2.4.0.0-3 | SpecKit/Review/Agents consolidation + @ultra-think agent + sk-git commit logic |
| `3.0.0.x` | 3.0.0.0-4 | Hybrid RAG Fusion platform release: 5-channel retrieval, review mode, 23 README rewrites, 4 CLI skills, 57 component releases |
| `3.1.0.x` | 3.1.0.0 | Plain-English release notes style, freshness audit, spec folder pass-through rule |
| `3.1.1.x` | 3.1.1.0-1 | ESM module compliance: 5-phase migration for shared + mcp-server, scripts interop, test sweep |
| `3.1.2.x` | 3.1.2.0-1 | Deep review remediation: 18 findings fixed across runtime, security, reliability, performance |
| `3.1.3.x` | 3.1.3.0 | Memory search pipeline fixes |
| `3.1.4.x` | 3.1.4.0 | Search optimizations + review fixes |
| `3.1.5.x` | 3.1.5.0 | Frontmatter compliance, memory indexing and search retrieval quality fixes |
| `3.2.0.x` | 3.2.0.0-1 | ESM module compliance + compact code graph |
| `3.2.1.x` | 3.2.1.0 | System Spec Kit release |
| `3.2.2.x` | 3.2.2.0 | Implicit feedback signal pipeline |
| `3.3.0.x` | 3.3.0.0-1 | Compact code graph + agent improver skill |
| `3.4.0.x` | 3.4.0.0 | Memory that actually sticks |
| `3.4.1.x` | 3.4.1.0 | Now you can watch it run |
| `3.5.0.x` | 3.5.0.0-4 | Memory that maintains itself |
| `3.6.0.x` | 3.6.0.0 | Harder core, longer reach |
| `4.0.0.x` | 4.0.0.0-16 | The foundation rebuilt: Spec Kit, deep loops and parent skills |
| `4.0.1.x` | 4.0.1.0 | Every skill routes from its own file |
| `4.0.2.x` | 4.0.2.0 | Skilled in your own project |

---

## 10. NOTES

- **Source of truth**: The public repository holds the authored framework under `.skilled/`
- **Two ways in**: A project links to a checkout or commits a pinned copy with overlays
- **Never committed**: Links to a checkout, `.env` files and the project spec folders this repository's `.gitignore` lists
- **Propagation**: A linked project gets framework changes on the next `git pull` of the checkout. A copied project gets them on its next re-pin
