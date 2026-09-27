# OpenCode Dev Environment - Public Release

The **Public repo** is the source of truth for the OpenCode framework. Projects like your-project.com consume it via a `.opencode/` symlink — `.skilled/` is the authored root and `.opencode/` links into it, so edits to `.skilled/` affect all linked projects instantly.

---

## 1. ARCHITECTURE

```text
Public Repo (source of truth)
  specs/                         ← Project specs (subfolders gitignored per-project), top-level, real
  .skilled/                     ← Framework: skills, agents, commands, scripts
     skill/
     agent/
     command/
     scripts/
     specs -> ../specs           ← Legacy compat symlink, kept for older references
     ...
  .claude/                      ← Claude Code runtime adapter (agents, mcp.json)

your-project.com (consumer project)
  .opencode -> Public/.opencode  ← SYMLINK (framework; specs reachable through the compat symlink)
	  .opencode-local/               ← Project-specific runtime data
	    database/                   ← Per-project database dir (SPEC_KIT_DB_DIR)
	    specs/                      ← Optional: only if this project opted out via SPEC_KIT_SPECS_DIR
  opencode.json                  ← MCP config (sets SPEC_KIT_DB_DIR, optionally SPEC_KIT_SPECS_DIR)
  AGENTS.md                      ← Project-specific AI instructions
```

### Key Design Decision: `SPEC_KIT_DB_DIR`

When `.opencode/` is a symlink, Node.js `__dirname` in CommonJS resolves to the **real path** (Public), not the symlink path (project). The `SPEC_KIT_DB_DIR` environment variable in `opencode.json` overrides the database path to keep each project's database isolated in `.opencode-local/database/`.

### Key Design Decision: `SPEC_KIT_SPECS_DIR` (opt-in)

`specs/` is shared by default — a project's spec packets land in the Public repo's shared `specs/<project-name>/`, gitignored per-project (Section 3), exactly like today. A project that wants to own its specs in its own repo instead (not possible through the symlinked `.opencode`, since git cannot track anything behind a symlink) sets `SPEC_KIT_SPECS_DIR` (alias `SPECKIT_SPECS_DIR`) in its own `opencode.json` to a real, non-symlinked, project-local path — e.g. `.opencode-local/specs` — and adds a matching `!.opencode-local/specs/` negation to its own `.gitignore`. Mirrors the `SPEC_KIT_DB_DIR` mechanism above; resolved the same way (`path.resolve(process.cwd(), override)`).

---

## 2. REPOSITORY LOCATIONS

| Location                    | Path/URL                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **Public Release (local)**  | `~/your-project/`                                                                   |
| **Public Release (GitHub)** | https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops |

---

## 3. SHARED VS PROJECT-SPECIFIC

### Shared (via symlink — lives in Public repo)

| Component      | Path                        |
| -------------- | --------------------------- |
| Skills         | `.opencode/skills/`          |
| Commands       | `.opencode/commands/`        |
| Scripts        | `.opencode/scripts/`        |
| Agents         | `.opencode/agents/`          |

### Project-Specific (gitignored per-subfolder in Public)

| Component                                       | Location                                | Reason                                                  |
| ------------------------------------------------ | ---------------------------------------- | -------------------------------------------------------- |
| `specs/NNN-*/` (default) or via `.opencode/specs/NNN-*/` compat symlink | Through symlink | Project-specific documentation, shared by default        |
| `.opencode-local/specs/` (opt-in only, via `SPEC_KIT_SPECS_DIR`) | Project root, real (not symlinked) | Project owns its specs in its own repo instead of sharing |
| `.opencode-local/database/`                     | Project root                            | Per-project SQLite databases                            |
| `opencode.json`                                 | Project root                            | MCP config with `SPEC_KIT_DB_DIR`, optionally `SPEC_KIT_SPECS_DIR` |
| `.utcp_config.json`                             | Project root                            | Code Mode configuration                                 |
| `AGENTS.md`                                     | Project root                            | Project-specific AI instructions                        |
| `src/`                                          | Project root                            | Project source code                                     |

---

## 4. RELEASE WORKFLOW

Since `.opencode/` is a symlink, the old "sync" step is eliminated. Changes to the framework are made directly in the Public repo.

### Workflow Overview

```text
Changes Made in Public/.skilled/
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
    │        │ PHASE 2  │ ─── Release notes + CHANGELOGs
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
    │   PHASE 4   │ ─── git add, commit, push
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

| Change Type                          | Release Type   | Version Impact |
| ------------------------------------ | -------------- | -------------- |
| Typo fixes, minor doc updates        | **No Release** | None           |
| Bug fixes within current series      | **Patch**      | `x.x.x.+1`     |
| New feature or thematic changes      | **Series**     | `x.x.+1.0`     |
| Breaking changes requiring migration | **Major**      | `x.+1.0.0`     |

### Phase 2: DOCUMENT (Full Release Only)

1. **Determine the version number** using Section 8
2. **Write the release entry** with `/create:changelog skilled`, which writes `.skilled/changelog/skilled/vX.X.X.X.md` from the template in Section 7
3. **Write a component changelog** for each skill the release changed, with `/create:changelog <skill>`. Each lands in that skill's own `changelog/` folder, versioned by the skill

### Phase 3: REVIEW

> **HARD STOP:** Do NOT proceed without user approval.

```bash
cd ~/your-project/
git status
git diff --stat
```

### Phase 4: COMMIT

```bash
cd ~/your-project/
git add -A
git commit -m "vX.X.X.X: [Release title]"
git push origin main
```

### Phase 5: PUBLISH (Full Release Only)

The release step of `/create:changelog skilled --release` runs all three steps below: it tags the version written in Phase 2, pushes the tag and publishes the GitHub release with the entry as its body. To publish by hand instead:

```bash
cd ~/your-project/

# 1. Create annotated tag
git tag -a vX.X.X.X -m "vX.X.X.X: Release description"

# 2. Push tag
git push origin vX.X.X.X

# 3. Create the GitHub release (MANDATORY: tags alone do NOT appear as releases)
#    notes.md is the release entry with its YAML frontmatter and H1 title removed
gh release create vX.X.X.X \
  --title "vX.X.X.X — Editorial Title" \
  --notes-file notes.md
```

> **CRITICAL**: `git push origin vX.X.X.X` only pushes the tag — it does NOT create a GitHub Release. You MUST run `gh release create` to make the release visible on the GitHub Releases page with formatted notes and downloadable assets.

---

## 5. CURRENT RELEASE

| Field              | Value                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Version**        | v4.0.0.1                                                                                                  |
| **Release Date**   | 2026-09-25                                                                                                |
| **GitHub**         | https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops                       |
| **Latest Release** | https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases/latest       |
| **Release Notes**  | https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/releases/tag/v4.0.0.1 |

### Release Notes

Release notes for each version are stored as individual files in `.skilled/changelog/skilled/vX.X.X.X.md`, one per release, formatted per the template in Section 7. Older entries are grouped by generation in `v1+/`, `v2+/` and `v3+/`. The GitHub release body is the entry with its YAML frontmatter and H1 title removed.

**Latest**: See `.skilled/changelog/skilled/v4.0.0.1.md`

---

## 6. ADDING A NEW PROJECT

To connect a new project to the shared OpenCode framework:

```bash
# 1. Create symlink to shared framework
ln -s ~/your-project/.opencode .opencode

# 2. Create project-local directory for database
mkdir -p .opencode-local/database

# 3. Copy opencode.json (already has SPEC_KIT_DB_DIR set)
cp ~/your-project/opencode.json .

# 4. Confirm the shared specs location resolves (specs/ is real in Public;
#    .opencode/specs is a compat symlink to it, resolved through your own
#    .opencode symlink -- no local directory to create)
ls .opencode/specs

# 5. Add spec subfolder to Public .gitignore (each project gets its own entry)
# Edit Public/.gitignore and add: specs/NNN-your-project/

# 6. Add to project .gitignore
echo ".opencode" >> .gitignore
echo ".opencode-local/" >> .gitignore

# 7. OPTIONAL -- opt out of the shared specs/ tree and own your specs in this
#    repo instead (see "Key Design Decision: SPEC_KIT_SPECS_DIR" above):
#    - Set SPEC_KIT_SPECS_DIR=".opencode-local/specs" in opencode.json
#    - mkdir -p .opencode-local/specs
#    - echo "!.opencode-local/specs/" >> .gitignore
```

---

## 7. RELEASE NOTES TEMPLATE

Release entries follow the sk-create-changelog template, the same one every component changelog uses.

- **Template:** `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`
- **House style:** `.skilled/changelog/skilled/v4.0.0.0.md`, the canonical exemplar
- **Workflow:** `/create:changelog skilled` writes the entry, and `--release` also tags it and publishes the GitHub release

In short, open with why the release matters in plain English, group the changes into topical sections named for what they change, and end with the upgrade notes. Use the compact format for fewer than 10 changes, and the expanded format for 10 or more changes, a major version or a breaking change. The template carries the voice rules, the section order and the checklist.

---

## 8. VERSIONING SCHEME

Releases use a 4-part versioning scheme: `MAJOR.MINOR.SERIES.PATCH`. The version is also the release's git tag, `vX.X.X.X`.

| Part       | Meaning                                    | Example   |
| ---------- | ------------------------------------------ | --------- |
| **MAJOR**  | Breaking changes requiring migration       | `2.0.0.0` |
| **MINOR**  | New features (backward compatible)         | `1.1.0.0` |
| **SERIES** | Thematic grouping (e.g., Narsil migration) | `1.0.1.0` |
| **PATCH**  | Bug fixes within a series                  | `1.0.1.2` |

`/create:changelog skilled --bump <level>` increments the same four positions under different names: `major` bumps MAJOR, `minor` bumps MINOR, `patch` bumps SERIES and `build` bumps PATCH. Pass `--bump` explicitly for a release entry, because the auto-detected bump follows the workflow's own meaning for each name.

### Series History

| Series    | Range     | Theme                                                                                                                           |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `1.0.0.x` | 1.0.0.0-8 | Initial release (LEANN-based)                                                                                                   |
| `1.0.1.x` | 1.0.1.0-7 | Narsil migration (unified code intel)                                                                                           |
| `1.0.2.x` | 1.0.2.0-9 | Skill audit + Figma MCP                                                                                                         |
| `1.1.0.x` | 1.1.0.0-1 | Cognitive Memory + Agent System                                                                                                 |
| `1.2.0.x` | 1.2.0.0-3 | Causal Memory & Command Consolidation                                                                                           |
| `1.2.1.x` | 1.2.1.0   | workflows-code--opencode + Narsil removal                                                                                       |
| `1.2.2.x` | 1.2.2.0-2 | Coding Analysis Lenses + MCP bug fixes                                                                                          |
| `1.2.3.x` | 1.2.3.0   | Ecosystem remediation + schema unification                                                                                      |
| `1.2.4.x` | 1.2.4.0-1 | Orchestrate agent Context Window Budget                                                                                         |
| `1.2.5.x` | 1.2.5.0   | workflows-code--opencode Phase 17 alignment                                                                                     |
| `1.3.0.x` | 1.3.0.0   | Agent fleet overhaul + @context                                                                                                 |
| `1.3.1.x` | 1.3.1.0   | @context prompt compression                                                                                                     |
| `1.3.2.x` | 1.3.2.0   | distributed-governance exclusivity + governance rules                                                                                         |
| `1.3.3.x` | 1.3.3.0   | Claude Code subagents + orchestrate.md improvements                                                                             |
| `2.0.0.x` | 2.0.0.0-7 | JS→TS migration, Spec Kit script automation, architectural refactoring                                                          |
| `2.0.1.x` | 2.0.1.0-5 | Documentation alignment, security fixes & optimization (specs 008, 111-118)                                                     |
| `2.0.2.x` | 2.0.2.0-3 | Agent routing compliance + changelog reorganization (spec 014)                                                                  |
| `2.1.0.x` | 2.1.0.0   | Spec-doc indexing highlight promotion                                                                                           |
| `2.1.1.x` | 2.1.1.0   | Aggregate unreleased framework changes                                                                                          |
| `2.1.2.x` | 2.1.2.0   | Gate enforcement + skill reference indexing (Source #6)                                                                         |
| `2.1.3.x` | 2.1.3.0-6 | Agent model upgrade to Sonnet 4.6 + MCP recovery hardening + release-doc clarifications                                         |
| `2.1.4.x` | 2.1.4.0   | HVR integration across documentation templates                                                                                  |
| `2.2.0.x` | 2.2.0.0-2 | System Spec Kit verification hardening + release-doc refresh (deferred-suite activation, CHK-336 closure, README/metadata sync) |
| `2.2.1.x` | 2.2.1.0   | Context overload prevention for orchestrator agents                                                                             |
| `2.2.2.x` | 2.2.2.0   | TOML commands + MCP server config                                                                                              |
| `2.4.0.x` | 2.4.0.0-3 | SpecKit/Review/Agents consolidation + @ultra-think agent + sk-git commit logic                                                  |
| `3.0.0.x` | 3.0.0.0-4 | Hybrid RAG Fusion platform release: 5-channel retrieval, review mode, 23 README rewrites, 4 CLI skills, 57 component releases   |
| `3.1.0.x` | 3.1.0.0   | Plain-English release notes style, freshness audit, spec folder pass-through rule                                               |
| `3.1.1.x` | 3.1.1.0-1 | ESM module compliance: 5-phase migration for shared + mcp-server, scripts interop, test sweep                                   |
| `3.1.2.x` | 3.1.2.0   | Deep review remediation: 18 findings fixed across runtime, security, reliability, performance                                   |

---

## 9. NOTES

- **Source of truth**: Public repo contains the authoritative OpenCode framework
- **Symlink model**: Projects consume the framework via `.opencode/` symlink
- **Database isolation**: Each project has its own database in `.opencode-local/database/`
- **Never shared**: Database files (`*.sqlite`) and project-specific spec subfolders (`specs/NNN-*/` gitignored per-project by default; a project can opt out entirely via `SPEC_KIT_SPECS_DIR` -- see Section 1)
- **Instant propagation**: Framework changes in Public are immediately available to all linked projects
