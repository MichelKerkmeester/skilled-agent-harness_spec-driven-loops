# Iteration 3: Typed commands — slash surface and safe mapping

## Focus

Q3: How should typed slash commands / quick actions be discoverable and auto-completed while mapping safely to pi commands?

## Actions Taken

1. Read pi `get_commands` + prompt `/name` invocation rules from rpc.md.
2. Study Claude Code mobile slash autocomplete gap issues (negative lessons).
3. Check Pi Remote compose submit path (only free-text `prompt.submit`).
4. Note rpc.md: built-in TUI commands are NOT in `get_commands` and won’t execute via `prompt`.

## Findings

### F-010: Inventory commands via `get_commands`; invoke via existing prompt channel

- **Source:** [SOURCE: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md] (`get_commands`; invoke with `/name` through `prompt`; extension commands run even during streaming; skills/templates expand before queue)
- **Pattern:** Commands have `name`, `description`, `source` (`extension`|`prompt`|`skill`). Phone should list only what RPC returns — never invent a parallel command catalog.
- **Why it helps:** Single source of truth stays with the pi child; desktop and phone stay in parity.
- **Apply:** Relay `commands.list` → cache in session state (names+descriptions only, redact paths in `sourceInfo` if any). Typing `/` at start of compose opens filtered list; selecting inserts `/name ` or submits `/name` for zero-arg extension commands.

### F-011: Mobile needs typeahead + quick-action chips; typing alone fails

- **Source:** [SOURCE: https://github.com/anthropics/claude-code/issues/32051] [SOURCE: https://github.com/anthropics/claude-code/issues/56204] [SOURCE: https://github.com/anthropics/claude-code/issues/60167]
- **Pattern:** Claude Code mobile users report `/` does nothing — must memorize names. Requests: searchable dropdown on `/`, plus optional quick-action tiles/FAB for frequent commands.
- **Why it helps:** Phone keyboards make slash+long-name entry costly; discoverability is the feature.
- **Apply:**
  1. On `value.startsWith('/')`, show React Aria `ListBox`/`ComboBox` overlay above composer (max ~6 rows, filter by prefix).
  2. Pin 2–4 “quick actions” derived from allowlisted high-frequency names (e.g. `/plan`, `/todos` when present) as chips above the textarea — chips fill draft or submit; never bypass relay.
  3. Empty-state of new session can show the same chips (044 empty-state guidance).

### F-012: Safety — treat slash as prompt text through the same ticketed path; allowlist dangerous families

- **Source:** [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/command-and-push/prompt-steering-transport.md] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md] (redaction + foreground authority) [SOURCE: rpc.md note that TUI-only builtins won’t execute]
- **Pattern:** All slash invocations still go through `prompt.submit` + ticket + single-flight. Do not add a separate “execute command” HTTP verb that skips projection/redaction.
- **Why it helps:** Prevents a second, weaker command authority on the phone.
- **Apply:**
  - Allowlist UI presentation of `extension`/`prompt`/`skill` from `get_commands` only.
  - Show `source` badge in autocomplete (Extension / Prompt / Skill).
  - If a command would trigger host mutation tools, existing approval card remains the gate — slash does not auto-approve.
  - Never surface raw filesystem paths from `sourceInfo` in the PWA (redact to location tier: user/project).
  - Document that TUI-only commands absent from `get_commands` are intentionally unavailable on phone.

### F-013: Ruled out — free-form mid-prompt slash autocomplete as v1

- **Source:** Mid-input slash is a desktop power-user request; mobile Claude gaps focus on start-of-input. [SOURCE: https://github.com/anthropics/claude-code/issues/44488]
- **Why ruled out for v1:** Complex caret math on iOS Safari; start-of-input covers extension toggles (`/plan`) and templates.
- **Defer:** Mid-input `/` detection to a later pass.

## Assessment

- **newInfoRatio:** 0.84
- **Novelty justification:** Concrete safety rule (same ticketed prompt path + redacted command inventory) plus mobile typeahead/quick-chips addressing documented Claude Code mobile failures.
- **Confidence:** High.

## Recommended Next Focus

Q4: Plan-mode toggle — `/plan` + `--plan` flag, persistent active-mode chrome, Claude/Cursor Shift+Tab analogies adapted for touch.
