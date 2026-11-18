---
title: "Pi CLI: Runtime Sync Manifest"
description: "How .pi derives from .skilled: the generated agent and prompt trees, the rendered extension entries, the authored settings and the checks that catch drift."
trigger_phrases:
  - "pi sync manifest"
  - "pi runtime surfaces"
  - "pi extension drift"
---

# Pi CLI Sync Manifest

> Three generators carry `.skilled/` into Pi: two write the agent and prompt trees, and one renders the extension entries.

---

## 1. OVERVIEW

Pi reads `AGENTS.md` from the working directory and the folders above it, so the root [`AGENTS.md`](../AGENTS.md) reaches a session with no copy in this folder. `--no-context-files` turns that read off. Pi also loads the project settings in `settings.json` and reads the prompt templates in `prompts/`. It scans the top-level `*.ts` files in `extensions/` for entries. The `code_mode` server comes from `mcp.json`.

Two generators in `.skilled/skills/system-spec-kit/runtime/cli/pi/` write `agents/` and `prompts/` as flat files. The folder also holds four links: `skills`, `repo-rules` and `manual-testing-playbook`, plus the adapter file at `extensions/lib/claude-hook-adapter.ts`. `sync-hook-registrations.cjs` renders the extension entries from one template. The settings files and the folder documents are written here.

An entry imports an adapter under `.skilled/` inside its factory. The adapter calls the core that owns the policy. A guard change lands in the core, so an entry needs no edit. When the adapter cannot load, because the Skilled checkout is missing or out of date, the entry turns its hook off and Pi shows one notice for the whole session instead of one load error per entry. An adapter that throws while it registers still fails as a Pi load error, because that is a bug in the adapter.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `agents/*.md` | generated | `.skilled/agents/*.md` | Yes. `sync-agents-pi.cjs --check` reports drift file by file |
| `prompts/*.md` | generated stub | `.skilled/commands/**/*.md` | Yes. `sync-prompts-pi.cjs --check` reports drift file by file |
| `prompts/goal-pi.md` | authored native command | none | No. `command-scope.cjs` names it, so the generator never writes or prunes it |
| `extensions/*.ts` | rendered from one template | the adapter it names under `.skilled/` | Yes. `sync-hook-registrations.cjs --check` reports an entry that differs from the template or names an adapter that does not exist |
| `extensions/lib/claude-hook-adapter.ts` | relative symlink | `.skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts` | Yes, if the target moves. No check reads the link |
| `extensions/pi-cache-optimizer/` | authored local package | none | No. Pi loads it from the `packages` list |
| `extensions/pi-fast-mode-w-subagent-support/` | authored local package | none | No. Pi loads it from the `packages` list |
| `mcp.json` | authored | none | No. It registers the `code_mode` server |
| `settings.json` | authored | none | No. It holds the project settings and the `packages` list |
| `models.json` | authored | none | No. It holds the provider blocks Pi merges over its own catalog |
| `pi-blackhole-config.json` | authored project override | none | No. The package merges it over the global config |
| `pi-cache-optimizer-config.json` | authored | none | No. The package keeps its setting under the Pi agent directory |
| `pi-fast-mode-w-subagent-support-config.json` | local state, git-ignored | none | No. The package writes it at run time |
| `deep-pi-stats.json` | local state, git-ignored | none | No. `.gitignore` excludes it, and no sync check reads it |
| `statusline.sh` | authored | none | No. `settings.json` names it as the status line command |
| `custom-providers.md` | authored | none | No |
| `PLUGINS.md` | authored | none | No |
| `README.md` | authored | none | No |
| `SYNC.md` | authored | none | Yes, this table. No drift check reads it |
| `skills` | relative symlink | `../.skilled/skills` | No. The link holds no content |
| `repo-rules` | relative symlink | `../.skilled/repo-rules` | No. The link holds no content |
| `manual-testing-playbook` | relative symlink | `../.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook` | No. The link holds no content |
| `types/` | authored declarations | none | No. `tsconfig.pi.json` lists `node-globals.d.ts` and `pi-coding-agent.d.ts` |
| `git/` | install output, git-ignored | none | No. A package install writes it |
| `npm/` | install output, git-ignored | none | No. A package install writes it |

---

## 3. WHAT THIS FOLDER NEVER HOLDS

| Kept out | Where it lives | Why |
|---|---|---|
| A copy of the shared instructions | `../AGENTS.md` | Pi reads the root file from the working directory and its ancestors |
| A skills tree | `.skilled/skills/` | The `skills` link is the only copy. A fix to a skill lands once |
| A guard rule | `.skilled/hooks/` | An entry imports an adapter. The adapter calls the core that owns the rule |
| Keys and login state | `~/.pi/agent/auth.json` and `~/.pi/agent/models-store.json` | `models.json` reads `${LLMGATEWAY_API_KEY}` from the environment and holds no secret |

---

## 4. WHEN TO SYNC

- An agent is added or renamed under `.skilled/agents/` → run `sync-agents-pi.cjs`. A write run adds the new file and prunes the old one.
- A command is added or renamed under `.skilled/commands/` → run `sync-prompts-pi.cjs`. A write run prunes a stub whose source is gone and leaves `goal-pi.md` alone.
- A hook joins or leaves `hook-registry.json` → add or edit its entry here, then run `sync-hook-registrations.cjs --check`.
- A guard core changes under `.skilled/` → nothing to run. The entry and the adapter resolve at load time, so the next session reads the new core.
- A package joins the `packages` list in `settings.json` → run `pi update --extensions --approve` from the repository root so `.pi/npm` carries it.

---

## 5. SYNC WORKFLOW

```bash
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs
```

With both trees in step, the first prints `[pi-agent-sync] Wrote 0 of 11 generated agents.` and the second prints `[pi-prompt-sync] Wrote 0 of 46 generated prompts.` Both exit 0. A write run prunes a generated file whose source is gone. It also refuses to write through a symlink at an output path.

---

## 6. FORMAT CONTRACT

`sync-agents-pi.cjs` writes Pi's agent frontmatter. The name and description are quoted. `tools` holds lowercase Pi built-in names.

```yaml
---
name: "review"
description: "Code review specialist that applies the sk-code review mode's floor and lens, with a severity-based verdict and an advisory score, for PRs and code changes"
tools:
  - read
  - bash
  - grep
  - find
  - ls
# Unmapped OpenCode permission keys: external_directory
---
```

The tool list is derived and lossy. A permission outside `PERMISSION_TOOL_MAP` survives only as a YAML comment. An empty list is still written so a loader never falls back to the full tool set. The generated file cannot round-trip to its source.

Each prompt is a stub that names the canonical command file and passes the arguments through.

```markdown
<!-- Generated by sync-prompts-pi.cjs from .skilled/commands/create/agent.md — do not edit by hand. -->
# Pi entry: /create-agent

This is the Pi runtime entry point for the `/create-agent` command. The canonical, authoritative command definition lives in the OpenCode tree at:

`.skilled/commands/create/agent.md`
```

The stub copies the command name and the canonical path. It does not copy the command body, so an edit to the body needs no regeneration. The slash command name is the command path with each slash turned into a dash.

---

## 7. REQUIRED PARITY

- Every canonical agent has a file in `agents/`. `agent-roster-mirror-check.cjs` compares the runtime surfaces and prints `OK   pi        11/11 present`.
- Every canonical command has a stub in `prompts/`. `goal-pi.md` stands beside them. `sync-prompts-pi.cjs --check` is authoritative.
- Every Pi binding in `hook-registry.json` has an entry in `extensions/`. `sync-hook-registrations.cjs --check` is authoritative.
- Every prompt stub names a canonical path that the generator derived. A deleted source leaves an extra stub, which the prompt check reports.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Generated agents | `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` | 0 ok / 1 drift |
| Generated prompts | `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` | 0 ok / 1 drift |
| Extension entries | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | 0 ok / 1 drift / 2 usage or registry error |
| Roster coverage | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 covered / 1 drift / 2 checker error |
| Mirror, generator and roster checks for every runtime | `/doctor-runtime-mirrors` | read-only |

Each check prints a pass line or one line for each problem it finds. The agents check prints `[pi-agent-sync] PASS: 11 agents are in sync.` The prompts check prints `[pi-prompt-sync] PASS: 46 prompts are in sync.` The extension check prints `[hook-registration-sync] PASS: 4 registration files match the 36-hook registry; 22 Pi extensions resolve.` The roster check ends with `STATUS=OK agent-roster-mirror: every runtime covers the canonical roster`.

---

## 9. KNOWN GAPS

- **No surface loads the generated agents.** Pi core has no agent flag. The package that used to find these profiles is gone. The files stay generated and checked as a ready deliverable.
- **The tool list loses permissions.** A permission outside `PERMISSION_TOOL_MAP` has no Pi equivalent, so it survives only as a comment and the generated file cannot be round-tripped.
- **The extension check reads shape, not behavior.** `sync-hook-registrations.cjs --check` proves each entry matches the template byte for byte and names an adapter that exists. A change in a shared core shows up at run time or in the Pi suites under `.skilled/hooks/*/pi/`.
- **A failed adapter import is quiet by design.** An entry whose adapter cannot load registers nothing but the session notice. `/doctor:setup` and `hook-wiring-check.cjs` name the entry and the missing file.
- **The adapter link has no check.** The two session bridges import the real path under `.skilled/`, so `extensions/lib/claude-hook-adapter.ts` is there for browsing. A moved target leaves a dangling link that no check reports.
- **The type declarations run in no gate.** No CI workflow or git hook runs `tsc -p tsconfig.pi.json`, so a declaration that falls behind an adapter is caught only by hand. That config checks the entry template through three entries whose adapters it already includes.
- **The cache-optimizer config here is not the one the package reads.** `extensions/pi-cache-optimizer/index.ts` reads `pi-cache-optimizer-config.json` from Pi's agent directory, so a change to the copy in this folder has no effect.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a session here receives and the checks that confirm it |
| [`extensions/README.md`](./extensions/README.md) | Each entry, the adapter it imports and the switches that silence it |
| [`types/README.md`](./types/README.md) | The declarations behind `tsconfig.pi.json` |
| [`../.skilled/skills/system-spec-kit/runtime/cli/pi/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/pi/README.md) | The two generators and their `--check` mode |
| [`../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md) | The hook registry, the renderer and the entry check |
| [`../.skilled/hooks/README.md`](../.skilled/hooks/README.md) | The shared guard cores and the coverage matrix |
| [`../.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md`](../.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md) | Executable scenarios for this runtime |
| [`../.claude/SYNC.md`](../.claude/SYNC.md), [`../.codex/SYNC.md`](../.codex/SYNC.md), [`../.cursor/SYNC.md`](../.cursor/SYNC.md), [`../.devin/SYNC.md`](../.devin/SYNC.md), [`../.opencode/SYNC.md`](../.opencode/SYNC.md), [`../.vibe/SYNC.md`](../.vibe/SYNC.md) | Sibling runtime manifests |
