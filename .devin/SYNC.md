---
title: "Devin CLI — Runtime Sync Manifest"
description: "How .devin derives from .opencode and .claude: nested symlink shapes for agents and commands, the strict-YAML constraint, inherited rules, and how to detect drift."
---

# Devin CLI Sync Manifest

> Devin needs the same files as its siblings but at **different paths and in a nested shape**. Every mirror here is a symlink onto a canonical file; only `hooks.v1.json` is authored in this directory.

---

## 1. OVERVIEW

Devin's failure mode with shared content is a **discovery-path** limitation, not a format one. The identical file Devin ignores under `.claude/agents/` registers correctly once it is reachable at `.devin/agents/<name>/AGENT.md`. Its parser accepts Claude's `tools:` frontmatter as-is, so no per-agent translation is needed — only a symlink at the path Devin actually scans.

This matters historically: Devin's own docs claim `.claude/agents/*.md` is auto-imported. A live probe on 3000.2.17 proved that false — the directory was found, none of its profiles were dispatchable. Do not rely on that claim.

Two naming quirks to internalise:

- Devin's **"skills" are its slash-command surface**. `.devin/skills/` mirrors `.opencode/commands/`, *not* `.opencode/skills/`. The repo's actual skill packets are discovered separately and directly.
- Agents source from `.claude/agents/` (Claude dialect); commands source from `.opencode/commands/`.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Target shape |
|---|---|---|---|
| `agents/<name>/AGENT.md` (13) | symlink | `.claude/agents/<name>.md` | `../../../.claude/agents/<name>.md` |
| `skills/<flat>/SKILL.md` (35) | symlink | `.opencode/commands/<path>.md` | `../../../.opencode/commands/<path>.md` |
| `hooks/*` (19) | symlink | scattered `.opencode/**` | discovery mirror only |
| `hooks.v1.json` | **hand-authored** | — | — |
| `config.local.json` | operator-local | — | gitignored, never synced |
| `rules/` | **absent by design** | — | see §5 |

Both mirror trees are **nested one directory per item** — the directory name is the identifier, and the file inside carries the fixed name Devin looks for (`AGENT.md` / `SKILL.md`).

Devin also discovers the 12 `.opencode/skills/` packets on its own, with no mirror required, exposing them as `/sk-doc`, `/sk-git` and so on.

---

## 3. WHEN TO SYNC

- An agent is added or removed in `.claude/agents/` → re-run the mirror generator.
- A command is added, renamed or removed in `.opencode/commands/` → re-run the mirror generator.
- A hook is registered in `hooks.v1.json` → re-run the generator; this tree fell six symlinks behind its own config before the generator existed.
- Skill routing changes → edit `.cursor/rules/skill-routing.md`; Devin reads it (see §5).

---

## 4. SYNC WORKFLOW

```bash
# Refresh every symlink tree (devin agents + skills + hooks, and the cursor trees)
node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs

# Verify roster coverage across all five runtime surfaces
node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

---

## 5. FORMAT CONTRACT

### Strict YAML — the constraint that bites

Devin's frontmatter parser is **stricter than Claude's or OpenCode's**. An unquoted `description:` containing a colon is invalid YAML, and Devin silently drops the **entire file** rather than erroring:

```yaml
description: Autonomous deep-research loop: iterative investigation   # DROPPED — bare colon
description: "Autonomous deep-research loop: iterative investigation" # loads
```

This hid 12 of 36 commands from Devin while the other 24 registered normally, with no warning anywhere. **Any mirrored file must survive a strict YAML parse.** Lenient parsers accepting it is not evidence.

### Rules are inherited, not local

There is no `.devin/rules/`. `devin rules paths` reports Devin's own directory as `.windsurf/rules/*.md` (absent here), and that it also reads `.cursor/rules/*.md`. `devin rules list` confirms what actually loads:

```
skill-routing [Cursor] · CLAUDE [Claude] · AGENTS [Standard] · global_rules [Windsurf]
```

So Devin inherits the repo's Cursor rule plus root `CLAUDE.md`/`AGENTS.md`. That is why no rules file exists here — the asymmetry with Cursor is inheritance, not an omission.

### Hooks and permission modes

`hooks.v1.json` puts the **eight event names at the top level** with no `hooks` wrapper; version lives in the filename. Entries are nested `{matcher, hooks: [...]}` and matchers are **anchored regex** (`^exec$`, `^edit$`, `^run_subagent$`). It is the only runtime with `PermissionRequest` and `PostCompaction`.

Valid `--permission-mode` values are `normal` (alias `auto`, default), `accept-edits`, `dangerous` (aliases `yolo`, `bypass`) and `autonomous` (requires `--sandbox`). `--help` also advertises `smart`, which the binary **rejects** — a real doc/runtime mismatch.

**This repo dispatches with `--permission-mode bypass`.** Under bypass, `PermissionRequest` is never raised, so the adapter registered for it is inert. Guard coverage is intact regardless: **`PreToolUse` still fires under bypass**, verified directly, so the spec-gate and dispatch guards remain active. Only the approval prompt that bypass exists to skip is absent.

---

## 6. REQUIRED PARITY

- 13 agents and 35 commands, names matching the canonical trees. The command count moves as commands are added or retired; the drift checks below are authoritative, not this number.
- Every `AGENT.md` / `SKILL.md` is a symlink resolving into the canonical tree; a real file there is a silent fork.
- Every `.opencode/**` script `hooks.v1.json` invokes has a matching symlink in `hooks/`.
- Every mirrored file parses as strict YAML.

---

## 7. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Symlink trees incl. `hooks/` | `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 ok / 1 drift |
| Roster coverage | `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 ok / 1 drift |
| Everything at once | `/doctor runtime-mirrors` | read-only |

Live confirmation, which file checks cannot give you:

```bash
devin skills list                                                   # expect 35 commands + 12 skill packets
devin --permission-mode bypass -p "List ONLY subagent profile names, one per line."   # expect 13 + 2 built-ins
```

A command missing from `devin skills list` while present on disk is almost always the strict-YAML failure in §5.

---

## 8. KNOWN GAPS

- **`hooks.v1.json` is hand-authored and unmirrorable.** Its event set is genuinely different — `PermissionRequest` and `PostCompaction` exist nowhere else.
- **No strict-YAML gate.** Nothing blocks a colon-bearing unquoted `description:` from being committed to a canonical file; it only surfaces as a silently missing command in Devin.
- **`PostCompaction` has never been observed firing.** It needs a session long enough to trigger real compaction, which a scenario-sized dispatch cannot force.
- **`PermissionRequest` is inert under `bypass`**, the mode this repo uses. Documented rather than worked around, because `PreToolUse` still covers the guard path.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`hooks/README.md`](hooks/README.md) | Why the mirror is discovery-only |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Dispatch contract, roster parity, and the auto-import correction |
| `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/` | 20 executable scenarios covering these surfaces |
| [`../.cursor/rules/skill-routing.md`](../.cursor/rules/skill-routing.md) | The routing rule Devin inherits |
| [`../.claude/SYNC.md`](../.claude/SYNC.md) · [`../.codex/SYNC.md`](../.codex/SYNC.md) · [`../.cursor/SYNC.md`](../.cursor/SYNC.md) | Sibling runtime manifests |
