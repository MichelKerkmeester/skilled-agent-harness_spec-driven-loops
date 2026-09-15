---
title: "Hermes Runtime Folder And Prompt Sync"
description: "The repository's `.hermes/` folder carries an agents link, one generated markdown-only SKILL.md copy per canonical skill and per shared agent, generated command-prompt stubs, one project plugin and a sync manifest, and nothing that pretends to configure Hermes."
trigger_phrases:
  - "hermes runtime folder and prompt sync"
  - "sync-prompts-hermes"
  - "hermes project skills trust"
  - "hermes SYNC manifest"
version: 1.0.0.0
---

# Hermes Runtime Folder And Prompt Sync (sync-prompts-hermes.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The repository's `.hermes/` folder carries an agents link, one generated markdown-only SKILL.md copy per canonical skill and per shared agent, generated command-prompt stubs, one project plugin and a sync manifest, and nothing that pretends to configure Hermes.

The folder is deliberately smaller than its siblings for the other runtimes, because Hermes reads far less from a project than they do.

---

## 2. HOW IT WORKS

### Curated Skill Links

Hermes loads project skills only after the operator grants trust from the repository root, and it follows a symlinked skills tree, flattens it, and runs its static security scanner over everything it can reach at every session start. Linking the whole skills tree therefore costs minutes per session and quarantines the hubs it scans. The folder holds one directory link per curated skill instead, each loaded by name on the dispatch, and whole directories only, because a link resolving outside a skill directory is flagged as a traversal and quarantine is per directory and fail-closed.

### Generated Prompt Stubs

The prompt stubs are generated from the repository's command tree by a sync script. The name of each stub is the flattened command path, the same rule the sibling runtimes use, and the script's check mode reports drift while its write mode prunes stale output. A stub is used as the query file for a oneshot run, with the caller's request appended below the template.

### The Manifest And The Operator Boundary

The sync manifest records each surface, how it is produced, and whether it can drift; it also lists the steps that stay in the operator's own configuration, namely the provider block and its credential, the trust grant, the project-plugin enablement, and any MCP server. No repository file performs those, and no dispatch does either. There is no agent surface in the folder at all, because Hermes has no flag that loads an agent file, which is why personas are inlined into the prompt instead.

### The Write Guard

Hermes's own file tools treat a write whose immediate parent directory is the runtime dotfolder as a protected write needing approval. The files in this folder are therefore authored from outside a Hermes session.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs` | Script | Generates and prunes the prompt stubs from the command tree; `--check` reports drift. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/hermes-tools.md` | Handler | Project-skill loading, the trust grant, the scanner behavior and the write guard. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Handler | The dispatch-side rules that depend on this folder's contents. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Operator scenarios covering trust, skill loading and the prompt stubs. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md` | Reference | The operator steps this folder deliberately does not carry. |

---

## 4. SOURCE METADATA

- Group: Runtime surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runtime-surface/hermes-runtime-folder.md`

Related references:
- [repo-guards-project-plugin.md](repo-guards-project-plugin.md) - the one plugin this folder carries.
- [../prompt-contract/prompt-card-and-improver-eligibility.md](../prompt-contract/prompt-card-and-improver-eligibility.md) - the prompt contract the generated stubs are composed under.
