# create-changelog

Create a global or packet-local changelog entry with correct four-part versioning, topology-aware placement, and the shared changelog format — with an optional GitHub release.

## 1. OVERVIEW

This workflow packet turns a "what changed" request into a correctly versioned, correctly placed changelog entry, using the shared changelog template and the packet-local workflow instead of inventing a structure from scratch. It is the sub-skill behind `/create:changelog`.

## 2. WHEN TO USE

Use this packet when a request is about recording changes as a changelog: a new version entry for a project, skill, or packet; a release note; or a version bump decision (major / minor / patch / build).

Do not use it for authoring prose docs, READMEs, skills, agents, or commands — those belong in the matching `create-*` packet — or for editing source code. Writing the changelog is the deliverable here, not the change itself.

## 3. WHAT'S INSIDE

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Authoritative packet contract for `/create:changelog`: the inline creation workflow, versioning rules, topology-awareness, and the entry format. |
| `references/` | Overflow detail, routed by `references/README.md`: `worked_examples.md` (fully worked global and packet-local entries), `version_bump_rules.md` (four-part version choices), and `topology_edge_cases.md` (placement, back-dating, source conflicts, and the GitHub-release flow). |
| `changelog/.gitkeep` | Placeholder for this packet's own changelog history. |
| `assets/` | Not present. The changelog template is a shared standard at `../shared/assets/changelog_template.md`. |
| `scripts/` | Not present. Use the shared sk-doc validators from `../shared/scripts/`. |

## 4. QUICK START

1. Read `SKILL.md` for the packet contract and the inline workflow.
2. Read `../shared/assets/changelog_template.md` for the entry format before writing.
3. Decide topology: is this a global/project changelog or a packet-local one? Place the entry accordingly.
4. Choose the version bump (major / minor / patch / build) from the nature of the change.
5. Write the entry in the shared format; keep it grounded in what actually changed.
6. Validate the final file with the shared sk-doc validators.

Example validation:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <changelog-file> --type changelog
```

## 5. RELATED

- Shared format: `../shared/assets/changelog_template.md`
- Shared standards: `../shared/references/global/`
- Command entry point: `/create:changelog`
