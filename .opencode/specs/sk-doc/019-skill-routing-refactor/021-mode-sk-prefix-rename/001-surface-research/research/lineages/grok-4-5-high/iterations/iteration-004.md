# Iteration 004 — Commands, agents, runtime mirrors

## Focus
Command routers/bindings, agent definitions, and runtime skill mirrors that hardcode packet paths or mode keys.

## Actions Taken
1. Grepped `.opencode/commands` for packet path and `workflowMode=` literals.
2. Grepped agent definitions across `.opencode/agents`, `.claude/agents`, `.codex/agents`.
3. Inspected sk-design `command-metadata.json` `ownerMode` bindings.
4. Checked `.claude/skills`, `.cursor/skills`, `.codex/skills`, `.devin/skills` for mirrored packet directories.

## Findings

### F16 — Consumer class: slash-command routers with path + mode literals
- **Class:** Command markdown routers under `.opencode/commands/**`
- **Classification mixed:**
  - **Path positions:** references like `design-interface/assets/...`, `.opencode/skills/sk-doc/create-skill/...` asset paths
  - **Typed-ish literals:** `workflowMode=interface` / `workflowMode=md-generator` in command contracts
  - **Requires-judgment:** surrounding prose using English "quality" / "interface" (e.g. design.md quality preflight wording)
- **Evidence:**
  - [SOURCE: .opencode/commands/interface/design.md:9,24,55] `workflowMode=interface` + `design-interface/assets/interface-preflight-card.md`
  - [SOURCE: .opencode/commands/interface/design-reference.md:9,52] `workflowMode=md-generator`
  - [SOURCE: .opencode/commands/create/skill.md / skill-parent.md] paths under `create-skill/` assets (path positions; slash commands `/create:skill` are command IDs — separate from workflowMode rename unless explicitly remapped)

### F17 — Consumer class: command-metadata.json ownerMode
- **Class:** Typed JSON `ownerMode` equal to workflowMode
- **Classification:** typed / safe-to-sweep
- **Evidence:** [SOURCE: .opencode/skills/sk-design/command-metadata.json] `"ownerMode": "interface"` for `/interface:design`

### F18 — Consumer class: agent definitions with packet template paths
- **Class:** Agent docs/tomls that cite sk-doc create-skill template paths and prompt-improve packet
- **Classification:** path positions (update path strings after directory rename); workflowMode mentions for system-deep-loop are out of scope
- **Evidence:**
  - [SOURCE: .opencode/agents/markdown.md] and mirrors under `.claude/agents/markdown.md`, `.codex/agents/markdown.toml` — template paths into `sk-doc/create-skill/assets/...`
  - [SOURCE: .opencode/agents/prompt-improver.md] / `.claude` / `.codex` mirrors — bind to `sk-prompt/prompt-improve`

### F19 — Consumer class: runtime skill mirrors
- **Class:** Runtime-visible skill trees
- **Observed:** `.claude/skills/sk-code/` (and nested `code-quality/`) exist as real directories (not symlinks in this worktree). `.cursor/skills/sk-code`, `.codex/skills/sk-code`, `.devin/skills/sk-code` are **absent** here.
- **Classification:** path/mirror sync surface — after renaming `.opencode/skills/...` packets, mirrors must be regenerated or re-synced; treat as generated/sync artifact, not independent hand-edit unless a mirror is the sole live copy
- **Collision risk:** N/A for directory sync; stale mirrors would keep old names and break runtime discovery
- **Verification lever:** list/diff mirror trees against `.opencode/skills/{hub}/{newPacket}` after sync; parent packet risks call out `.claude/.cursor/.codex/.devin` explicitly [SOURCE: parent spec.md risks]

### F20 — Slash command IDs vs workflowMode
- Command strings like `/create:skill`, `/interface:design`, `/doc:quality` are bound in mode-registry `command` fields. Renaming workflowMode does **not** automatically rename slash commands unless a later phase chooses to. Record as a dependent-but-distinct surface: update `command` field only if command paths change; otherwise leave command IDs stable and only rewrite `workflowMode`/`packet`.

## Questions Answered
- Extended Q1 with commands/agents/mirrors
- Extended Q2 classifications for those classes
- Partial Q3: mirrors behave as sync/generated; command-metadata typed authored

## Ruled Out / Dead Ends
- Ruled out assuming all four runtime mirrors exist in this worktree — only `.claude/skills` present for sk-code; others missing here. Absence is an environment fact, not proof they never exist on other checkouts. [SOURCE: ls of .cursor/.codex/.devin skills]

## Next Focus
Ordering constraints + verification matrix across all classes; DB/cache open question; templates under create-skill parent-skill assets.

## SCOPE VIOLATIONS
None.
