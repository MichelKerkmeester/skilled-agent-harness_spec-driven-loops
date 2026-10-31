# Iteration 5: A5 — Runtime-by-runtime surface and identity map (D5)

## Focus

Build the per-runtime feasibility map: session identity source, command surface, hook surface, injection
cap, and ship-or-defer — including whether Claude Code and Codex expose a native goal command. Angle A5 /
decision D5 (charter `../../deep-research-strategy.md`:54).

## Actions Taken

1. Read the goal hub's own per-runtime delivery table.
2. Inventoried each runtime directory (`.pi`, `.cursor`, `.devin`, `.claude`, `.codex`) for goal artifacts.
3. Inspected the two host-level native goal stores (Claude memory goals, Codex goals SQLite).
4. Verified the charter's cited contract path.

## Findings

### F1. The hub's delivery table is the current contract, and it names two by-design absences

`[SOURCE: .opencode/hooks/goal/README.md:96]` documents: **Pi** — `input` + `session_start` + `turn_end`,
registers `/goal-pi` discovered via `.pi/extensions/`, identity `ctx.sessionManager.getSessionId()`,
workspace `ctx.cwd`; delivery is an additive `{action: "transform", text}` transform per turn plus
`pi.sendMessage` on session start and turn end. **Cursor** — `sessionStart` only, identity `session_id`
then `conversation_id` fallback, workspace `workspace_roots[0]`, delivery
`{permission: 'allow', agent_message: brief}`; injection-only, with no management, no mid-session refresh,
no verify, and model-visibility recorded as evidence rather than a proven guarantee
(`[SOURCE: .opencode/hooks/goal/README.md:99]`). **OpenCode** — the native plugin, a separate
implementation that shares the kill switch and state-directory contract but "does not import this core"
(`[SOURCE: .opencode/hooks/goal/README.md:100]`, `[SOURCE: .opencode/hooks/goal/README.md:31]`).
**Claude** and **Codex** — `by-design` absences: "goal state ships only on native session-bound goal
surfaces. No adapter in this core" (`[SOURCE: .opencode/hooks/goal/README.md:102]`,
`[SOURCE: .opencode/hooks/goal/README.md:103]`).

### F2. The absence is real in the filesystem, not just declared

- `.devin/` contains hooks (`[SOURCE: .devin/hooks.v1.json:1]` lists `SessionStart` and
  `UserPromptSubmit` chains that shell into `system-spec-kit` adapters) but a search for any goal artifact
  under `.devin` returns nothing — no goal command, no goal hook. Devin's hook payloads do carry a
  `session_id` (the devin `PostCompaction` adapter is documented as receiving `session_id` plus a possibly
  null summary, `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/devin/README.md:42]`), so the
  identity question is answerable; the command surface is what is missing.
- `.claude/hooks/` holds session-prime/session-stop/compact-inject hooks
  (`[SOURCE: .claude/hooks/session-prime.js]` region: directory listing) and no goal adapter.

### F3. Claude Code's native goal surface is a memory file, not a command

44 files named `goal_*.md` exist under `~/.claude/projects/*/memory/`. A representative file carries YAML
frontmatter `name`, `description`, and `metadata: {node_type: memory, type: project, originSessionId}`,
and its body is a narrative goal record (goal statement, delivered work, open follow-ups). No `/goal`
command exists in `~/.claude/commands`. So "Claude Code keeps its native goal command" resolves, in this
environment, to **a runtime-private memory store keyed by project and stamped with `originSessionId`** —
not to a command this repo can invoke.

### F4. Codex's native goal surface is a local SQLite store

`~/.codex/goals_1.sqlite` (plus a `~/.codex/sqlite/` copy and WAL/SHM sidecars) exists, together with
`~/.codex/prompts/goal_opencode.md`. Codex therefore has a first-class goals store and a goal prompt
surface, both private to the host. A hook in this repo cannot write them; only the runtime (or its prompt
surface) can.

### F5. Identity availability per runtime, as the goal core requires it

The core requires `workspace + runtime + sessionId` and throws `MISSING_SESSION_ID` without it
(`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:174]`). Mapping that requirement onto the runtimes:

| Runtime | Identity source (evidence) | Command surface | Hook surface | Injection cap | Ship / defer |
|---------|---------------------------|-----------------|--------------|---------------|--------------|
| **pi** | `ctx.sessionManager.getSessionId()`, `ctx.cwd` (`goal-context.ts:70-79`) | `/goal-pi` (`goal-context.ts:178`) + manage CLI (`--runtime --session --workspace`) | `input`, `session_start`, `turn_end` (README:96) | core-enforced 4800 (`goal-core.cjs:62`); host cap UNKNOWN | **ship** |
| **opencode** | `ctx.sessionID` / `properties.sessionID`, `ctx.directory` (plugin:334, :281) | native plugin tools + `/goal-opencode`, whitelisted by speckit commands | plugin lifecycle + prompt transform | 4000 objective / 4000 prompt / 4800 inject (plugin:29-31) | **ship** |
| **cursor** | `session_id` → `conversation_id`, `workspace_roots[0]` (README:99) | `.cursor/commands/goal-cursor.md` (refuses without session identity) | `sessionStart` only | `agent_message`; host cap UNKNOWN | **ship, degraded** (no refresh, no management) |
| **devin** | hook payload `session_id` (devin README:42) | **none found** in repo | `SessionStart`, `UserPromptSubmit` (`.devin/hooks.v1.json`) | UNKNOWN | **defer** — hook surface exists, command surface does not |
| **claude-code** | runtime-private memory store, `originSessionId` (goal_*.md frontmatter) | no `/goal` command; native memory goal | `.claude/hooks/*` session-prime/session-stop | UNKNOWN | **defer to native**; nesting reached through speckit commands or conversation (frozen constraint) |
| **codex** | runtime-private `goals_1.sqlite` + session history | `~/.codex/prompts/goal_opencode.md` | `.codex/hooks/*` completion-evidence-stop | UNKNOWN | **defer to native**; same speckit path |

### F6. The charter's contract citation does not resolve

The charter lists `.opencode/hooks/hooks/injection-contract.md`. The file is actually
`.opencode/hooks/injection-contract.md` (one path segment shallower); the sibling
`.opencode/skills/system-spec-kit/references/config/hook-system.md` does resolve. Any design note that
inherits the charter's path will cite a missing file — recorded so the synthesis uses the real path.

### F7. The two implementations are the primary drift risk, and D5 cannot fix it alone

The hub states the OpenCode plugin "does not import this core" while sharing the kill switch and
state-directory contract (`[SOURCE: .opencode/hooks/goal/README.md:31]`), and both render byte-compatible
blocks (iteration 2, F1). A goal-unification design that changes the durable slice for pi/cursor/opencode
must either change both renderers or accept a drift window that only shows up when an operator compares
runtimes.

## Assessment

- `newInfoRatio`: 0.65 — the hub delivery table was in Known Context in outline; the filesystem absence for
  devin, the Claude memory-file store with `originSessionId`, the Codex goals SQLite, and the stale
  charter path are new.
- Confidence: high on F1-F4 and F6 (files read / filesystem enumerated). Host injection caps for pi,
  cursor, devin, claude, codex are **UNKNOWN** — confirming them needs runtime documentation outside this
  repo; the design must therefore keep the core's own cap as the only enforced one.
- One sentence: pi, opencode, and cursor can ship a packet-backed goal with identity they already supply,
  while devin lacks only a command surface and Claude/Codex reach the packet goal through speckit
  commands rather than a hook.

## Reflection

- What worked: enumerating host directories rather than reading documentation — three of the six runtimes
  revealed their native goal store only on disk.
- What failed: the charter's injection-contract path does not exist as written (F6); the real path is one
  level up.
- Ruled out: treating devin's hook surface as sufficient for shipping (no command surface, no identity
  plumbing in the core today); treating Claude/Codex as reachable by a repo hook (their goal stores are
  host-private).

## Sources Consulted

- `.opencode/hooks/goal/README.md` (31, 96, 99, 100, 102, 103)
- `.opencode/hooks/goal/lib/goal-core.cjs` (62, 174)
- `.opencode/hooks/goal/pi/goal-context.ts` (70, 178)
- `.opencode/plugins/opencode-goal.js` (29-31, 281, 334)
- `.devin/hooks.v1.json`, `.devin/` inventory, `.claude/hooks/`, `.codex/hooks/`, `~/.codex/`, `~/.claude/projects/*/memory/`
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md:42`

## Recommended Next Focus

Iteration 6 (A6 / KQ6 / D7): read the isolation packet and name exactly what shared state it removed and
why, so a packet-shared `goal.md` does not re-introduce it.
