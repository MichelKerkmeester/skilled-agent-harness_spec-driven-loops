---
title: Agent Mirror Crosswalk
description: How one agent declaration translates into each of the six runtime agent trees, which differences are sanctioned, and what stands in place of a declaration a runtime cannot carry.
trigger_phrases:
  - "agent mirror crosswalk"
  - "agent frontmatter translation"
  - "runtime mirror drift"
  - "agent declaration parity"
importance_tier: important
contextType: implementation
version: 1.17.0.0
---

# Agent Mirror Crosswalk

Six runtime trees ship the same twelve agents: `.opencode/agents/`, `.claude/agents/`,
`.cursor/agents/`, `.pi/agents/`, `.codex/agents/` and `.devin/agents/`. Each tree speaks a
different dialect, so a declaration made once lands six different ways — or does not land at all.
This document is the contract between them: for each source key it names where the declaration
ends up in every tree, and what stands in its place when the runtime cannot carry it. A frontmatter
change without a matching row here is an untranslated declaration, and the tree that silently drops
it is the failure mode this document exists to prevent.

---

## 1. THE SIX TREES

| Tree | Shape | What it is | How to change it |
|------|-------|------------|------------------|
| `.opencode/agents/` | `<name>.md` | authored source of truth, with the `permission:` map | edit directly |
| `.claude/agents/` | `<name>.md` | authored fork in the Claude dialect (`tools:` CSV) | edit the `.opencode` twin in the same change |
| `.cursor/agents/` | `<name>.md` | symlink onto the `.claude` file | never — edit `.claude` instead |
| `.devin/agents/` | `<name>/AGENT.md` | symlink onto the `.claude` file | never — edit `.claude` instead |
| `.codex/agents/` | `<name>.toml` | generated from `.opencode` | edit `.opencode`, then run the Codex generator |
| `.pi/agents/` | `<name>.md` | generated from `.opencode` | edit `.opencode`, then run the Pi generator |

There are two upstreams, deliberately: `.opencode` is canonical for `.codex` and `.pi`, while
`.claude` is canonical for `.cursor` and `.devin` because those runtimes parse the Claude dialect.
`.claude` is itself kept in step with `.opencode` by hand. `.opencode/agents/` and `.claude/agents/`
are the only two trees that carry a `README.txt`; the other four have none.

A generated tree is never hand-edited — write mode prunes anything the canonical tree no longer
justifies, so an edit there survives only until the next sync:

```bash
node .opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs
node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs
```

What fails when a mirror drifts:

- `node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all`
  compares every agent body and declared tool surface from `.opencode` to `.claude` and `.codex`,
  and fails on a missing or orphaned mirror.
- `node .opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` and
  `node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` fail when a
  generated tree is stale against its canonical source.
- `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` fails when a runtime is
  missing an agent, when a `.cursor`/`.devin` entry stops being a symlink onto `.claude`, or when a
  mirror survives an agent the repository no longer defines.

---

## 2. SOURCE KEYS AND WHERE THEY LAND

### 2.1 `permission` — the allow/deny half

`.opencode` is the only tree that carries a permission map, and the only one where it is enforced
by the runtime. Each agent declares its own vocabulary of `read`, `write`, `edit`, `bash`, `grep`,
`glob`, `webfetch`, `chrome_devtools`, `task`, `list`, `patch` and `external_directory`, each
`allow` or `deny`.

| Tree | The allow half lands as | The deny half stands in as |
|------|-------------------------|----------------------------|
| `.opencode` | the `permission:` map itself, enforced by the runtime | the same map; the runtime refuses the tool |
| `.claude` | a `tools:` CSV of TitleCase names; `task` becomes `Agent` | the tool is absent from that list, and the body's prose restates the important denials ("never runs shell commands", "READ-ONLY file access") |
| `.cursor` | the `.claude` file, unchanged | as `.claude` |
| `.devin` | the `.claude` file, unchanged | as `.claude` |
| `.pi` | a lowercase `tools:` list; `glob` becomes `find` and `list` becomes `ls` | the key is absent from the list; a denied key is never named anywhere |
| `.codex` | `sandbox_mode` — a filesystem boundary, not a tool list | `sandbox_mode = "read-only"` when the map grants no `write`, `edit` or `bash`; otherwise `workspace-write` and the body's prose carries the scope |

Three permission keys have no counterpart in the Claude dialect — `list`, `patch` and
`external_directory` — and four have none in Pi's toolset — `webfetch`, `task`, `patch` and
`external_directory` — which is exactly the set the Pi comment records. `list` maps only in Pi,
to `ls`; `chrome_devtools` is denied in every map that carries it; and `.codex` declares no tools
at all.

**The `.pi` unmapped rule, stated as the contract it is.** The Pi generator maps `read`, `write`,
`edit`, `bash` and `grep` by name, `glob` to `find`, and `list` to `ls`. Every other key that is
`allow` in the `.opencode` map has no Pi tool, so the generator writes it into a single
`# Unmapped OpenCode permission keys:` comment in the generated frontmatter. A key is therefore
commented exactly when it is `allow` in `.opencode` and absent from Pi's toolset — denied keys are
simply omitted. The comment is generated, never hand-written: `PERMISSION_TOOL_MAP` and
`mapPermissions()` in `sync-agents-pi.cjs` are the implementation, and the `tools:` list is always
emitted (even empty) so a Pi loader can never fall back to its full built-in tool set.

**The `.codex` boundary.** The Codex generator owns the translation: `deriveSandboxMode()` grants
`workspace-write` when the frontmatter grants `write`, `edit` or `bash`, and `read-only` otherwise.
Its per-agent settings table pins the boundary for the twelve shipped agents and for two effort
tiers, and a new agent falls through to the derivation. `sandbox_mode` is coarser than the
permission map: it confines what the agent may touch, not which tools it may call.

### 2.2 `temperature`

`.opencode` frontmatter sets `temperature` per agent — `0.1` for most, `0.2` for `debug`,
`deep-improvement` and `design`.

| Tree | Lands as |
|------|----------|
| `.opencode` | the `temperature:` key, read by the runtime |
| `.claude`, `.cursor`, `.devin` | no key; `ai-council` alone keeps the prose sentence about operating at a chosen temperature |
| `.pi` | nothing — the generator emits `name`, `description` and `tools` only |
| `.codex` | a different knob: `model_reasoning_effort`, not a sampling temperature |

This is the declaration with the largest sanctioned loss. A dispatched route that needs determinism
states it in the dispatch; a manual invocation runs at the runtime default, and no artifact in this
repository promises otherwise.

### 2.3 `mode` — the role

`.opencode` declares `mode: subagent` for ten agents, `mode: all` for `markdown` and
`mode: primary` for `orchestrate`.

| Tree | Lands as |
|------|----------|
| `.opencode` | the `mode:` key; it decides how the agent can be reached |
| `.claude`, `.cursor`, `.devin` | no key; the role survives only as description prose where the body states it |
| `.pi` | nothing |
| `.codex` | nothing |

The role key translates nowhere as a key. Routing that depends on it must be read from the
`.opencode` tree.

### 2.4 `tools` — the lexicon

There is no `tools:` key in the source: the `.opencode` permission map *is* the tool surface, and
each dialect re-expresses it.

| Tree | Lexicon |
|------|---------|
| `.opencode` | the `permission:` map (see 2.1) |
| `.claude`, `.cursor`, `.devin` | `Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, Agent` — TitleCase CSV; only `ai-council` and `orchestrate` carry `Agent`, which is how nested delegation is granted |
| `.pi` | `read, write, edit, bash, grep, find, ls` — lowercase list, `find` replaces `glob` and `ls` replaces `list` |
| `.codex` | none; confinement is `sandbox_mode` and the body's prose |

Provenance markers exist in one tree: every `.codex` agent opens with `# Agent: <name>` and
`# Converted from: .opencode/agents/<name>.md`, so a reader of the TOML can find its source.

### 2.5 `model`

No agent file in `.opencode`, `.claude`, `.pi`, `.cursor` or `.devin` declares a model. `.codex`
pins one on all twelve: `model = "gpt-5.5"` with `model_reasoning_effort` — `high` for most,
`low` for `context` and `medium` for `markdown` — alongside `sandbox_mode`.

Model and effort are dispatch decisions, not agent declarations. A dispatched route passes both
explicitly, so the pin in `.codex` governs only invocation that reads the agent file directly.

---

## 3. WHAT MAY LEGITIMATELY DIFFER

The mirror gate compares bodies after normalizing exactly these differences, so anything else that
differs is drift and fails the gate:

- **Frontmatter dialect.** The `.opencode` `mode` / `temperature` / `permission` block, the
  `.claude` `tools:` line, and the `.codex` TOML keys are translations of each other, not copies.
- **Per-runtime agent paths.** Each tree's body refers to its own agents directory
  (`.opencode/agents/*.md`, `.claude/agents/*.md`); a path reference is normalized before
  comparison. A `.cursor` or `.devin` agent carries the `.claude` spelling because that is the
  file it is.
- **Per-runtime self-description.** A mirror may describe itself — for example a parenthetical
  saying the canonical source lives in another tree. The clause is dropped before comparison.
- **The generated dialects.** The `.pi` frontmatter is single-key-per-line with a quoted name and
  a lowercase tool list; the `.codex` body lives in a triple-quoted `developer_instructions`
  string behind the two provenance comments.

Everything else in the body — duties, checklists, prohibitions, output contracts — is expected to
be the same text in every tree. When the gate reports drift, fix the tree that is out of step
rather than widening the normalization.

---

## 4. MANUAL INVOCATION

A dispatched route passes model and effort explicitly, so the drift surface is manual invocation
alone. Read the silence correctly: a tree that declares no model means "no pin", not "unowned
setting". `.codex` is the only tree that pins one, and only a manual invocation of a Codex agent
reads that pin; the other five trees run whatever the runtime default is for the invoking session.
Manual invokers who need a specific model or effort should pass it at invocation time instead of
expecting an agent file to carry it.

---

## 5. ADDING OR CHANGING AN AGENT

1. Edit `.opencode/agents/<name>.md` — the canonical declaration.
2. Mirror the same body change into `.claude/agents/<name>.md` in the same change, including its
   `tools:` line when the permission map changed; `.cursor` and `.devin` follow by symlink.
3. Regenerate both generated trees with the two sync scripts above.
4. Add the agent to both `README.txt` rosters.
5. Run the three gates from section 1 — they are also wired into the pre-commit and CI paths, so a
   missed step fails there rather than at dispatch time.

---

## 6. RELATED DOCUMENTS

- `.opencode/agents/README.txt` and `.claude/agents/README.txt` — the human rosters, which point
  back at this crosswalk.
- `.claude/SYNC.md`, `.codex/SYNC.md` and `.pi/SYNC.md` — the per-runtime sync manifests: which
  surfaces are symlinks, which are generated, and which command regenerates them.
- `references/agent-improvement/mirror-drift-policy.md` — how mirror drift is handled during a
  promotion, and why it is not evaluator evidence.
