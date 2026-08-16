<!-- provenance: external-CLI orchestration pass; original file iter-07-grok.md -->
> **Source pass 7** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-7-grok.md`.

<!-- F3-slash-commands | model=grok | lens=security-redaction | iter 7/10 | 2026-08-15T19:03:12.467Z -->

# Iteration 7 — Security, redaction, and data-flow for typed `/` commands

**Lens:** what the inline catalog exposes, how to keep the read-only / fail-closed / redaction posture, and the only safe upload path to the agent.  
**Stack:** installable iPhone PWA (React 19, Vite, Tailwind 4, react-aria-components), ink-on-parchment, WCAG AA.  
**Mobbin MCP:** not callable in this session (empty MCP catalog). Mobbin evidence below is from public flow URLs.

---

## 1. Findings for this lens

### 1.1 What typing `/` actually exposes

The phone does not talk to Pi. It talks to the loopback relay, which already owns `get_commands`, projects a bounded DTO, then name-filters privileged rows.

**Host RPC (untrusted raw shape).** Pi documents `get_commands` as returning extension / prompt-template / skill rows with `name`, `description`, `source`, optional `location` (`user` | `project` | `path`), and optional absolute `path`. Example payloads include `/home/user/.pi/agent/extensions/session.ts` and `/home/user/myproject/.pi/agent/prompts/fix-tests.md`. Built-in TUI commands (`/settings`, `/hotkeys`, …) are **not** in this list and would not execute if sent via `prompt`. ([Pi RPC `get_commands`](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

**Relay projector (allowlist, not regex).** `projectCommandCatalog` is an explicit allowlist: it emits only `name`, `description`, `source`, `enabled`, `disabledReason`, `requiresConfirmation`, caps at 500 rows, drops path-like **names**, and structurally omits `path` / `location` / unknown keys. A leak of `path` is meant to be “structurally impossible rather than pattern-dependent.” (`apps/pi-remote-relay/src/store/redaction.ts`; tests in `apps/pi-remote-relay/tests/runtime-control.test.ts` assert `/Users/`, `path`, and `/usr/bin/evil` never appear in the serialized catalog.)

**Protocol fail-closed.** `isCommandDescriptorDto` uses `hasOnlyKeys` on those six fields. Adding `argHint` / `usage` / `examples` without a protocol change is rejected. Names must be path-free tokens (no `/` or `\`, ≤200 chars). Descriptions ≤2000 chars; `disabledReason` ≤500. (`packages/pi-rpc-protocol/src/guards.ts`)

**Name denylist (phone convenience, not a boundary).** `CommandService` hides names matching `credential|password|secret|token|api[-_]?key|authoriz|login|logout|session|reload|share|install|uninstall|package|trust|revoke|reset|delete|shutdown|exit|quit`, plus empty names, `!` prefix, `$`, or spaces. Comment in source: discovery must never widen what a remote device can reach beyond the ticketed prompt path. (`apps/pi-remote-relay/src/commands/command-service.ts`)

**What the PWA therefore sees today:** a capability map of **live host commands** (names + free-text descriptions + `source` ∈ {`extension`,`prompt`,`skill`} + enabled/disabled + confirmation flag). That is already more than a cosmetic picker: `skill:brave-search` style names advertise which skills are loaded; `source` distinguishes extension vs project prompt vs skill. `location` and filesystem paths are correctly stripped. Tests pin `plan` + `model` surviving while `login`, `reload`, `install`, `!`, path-names, and `revoke-device` do not. (`apps/pi-remote-relay/tests/commands.test.ts`)

### 1.2 The catalog filter is not the execution filter (P0)

`CommandService.isSlashCommandAllowed(name)` re-fetches `get_commands`, rebuilds `allowedNames`, and returns membership. **Nothing in `/api/prompt/submit` calls it.** Submit only checks session cookie, exact Origin, one-use ticket, 20 prompts/min, and `isPromptSubmitCommand` (non-empty `message`). (`apps/pi-remote-relay/src/http/server.ts`, `packages/pi-rpc-protocol/src/guards.ts`)

Pi’s own contract: slash commands are invoked **by sending `/name` as the `prompt` message**. Skill commands and prompt templates are **expanded before** send/queue. Extension commands (e.g. `/plan`) **execute immediately even during streaming**. Steer/follow-up **forbid** extension commands. ([Pi RPC prompting](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))

Consequence: hiding `/login` from the list does not stop a typed `/login …` from reaching Pi if that command exists on the host. This matches a documented Claude Code remote-control failure mode: autocomplete omits worker skills, but typing the full name still routes. ([anthropics/claude-code#62482](https://github.com/anthropics/claude-code/issues/62482), [#32051](https://github.com/anthropics/claude-code/issues/32051))

Kimi’s TUI does the opposite of fail-closed: unmatched `/…` is sent as a **regular agent message**. ([Kimi Code slash commands](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html)) That is unsafe here for **hidden-but-real** host names.

### 1.3 Descriptions are not redacted (P0 adjacent)

Canonical policy v1 redacts path keys, secret keys, `prompt` keys, secret assignments, `Bearer`, token prefixes, POSIX `/Users|/home|…` paths, and Windows paths — **on envelopes**, before SQLite/broadcast. (`docs/security.md`, `apps/pi-remote-relay/src/store/redaction.ts`)

Command **names** go through `pathFreeToken`. Command **descriptions** and **disabledReason** go through `boundedString` only. A host description `Reads /Users/you/.ssh/id_rsa` or `token: ghp_…` would be delivered to the phone JSON, rendered in the list, and is not in the offline transcript cache today — but it **is** in RAM, screenshots, and VoiceOver.

The projector comment that “unknown nested shapes could slip a secret or path past” generic scanning is why catalogs use an allowlist. The allowlist then **skips** `redactString` on the one free-text field operators will actually read.

`requiresConfirmation` is projected and unused in `CommandPalette` / `SessionComposer`. Confirmation at **insert** is the wrong gate; confirmation belongs at **submit**, after relay revalidation.

### 1.4 Data-flow of the list itself (read path)

| Hop | Authority | Ticket? | Foreground WS? | Side effect |
|---|---|---|---|---|
| PWA `useCommands` → `POST /api/commands/list` empty body | Session cookie + exact Origin + `commands:list` | No | No | Yes: RPC write of `{type:"get_commands"}` on the **single** Pi stdin chain |
| Relay `listCommands` | Host child | n/a | n/a | Bumps catalog `revision`; replaces `allowedNames` |
| PWA React state | Memory only | n/a | n/a | Not written to `pi-remote.read-only.v1` |

`/api/commands/list` is correctly a **read** in the HTTP policy (`commands:list` in `apps/pi-remote-relay/src/auth/policy.ts`). It is **not** a free read on the host: `RpcSupervisor` serializes every command on one stdin. Opening `/` must **not** refetch per keystroke. Current `useCommands` fetches once on mount (`apps/pi-remote-web/src/commands.ts`). Keep that. Refresh on: session/epoch change, catalog `revision` if you add a push, foreground return, or explicit pull-to-refresh — not on each character.

Fetch already uses `cache: 'no-store'` (`apps/pi-remote-web/src/relay.ts`). The service worker ignores non-GET and ignores `/api/` (`apps/pi-remote-web/public/service-worker.js`). Offline `localStorage` cache holds sessions + redacted transcript blocks only (`apps/pi-remote-web/src/cache.ts`). **Do not** persist the command catalog there. After logout/revocation the phone must not still show last host’s skill names.

Global HTTP limit is 120 req/principal/min; there is **no** dedicated `get_commands` limiter (unlike 20/min prompts and 30/min runtime control). A naïve “refresh catalog whenever `/` opens” can stall the agent behind catalog RPCs. (`apps/pi-remote-relay/src/http/server.ts`, `docs/security.md`)

### 1.5 Submit path vs insert path (mutation boundary)

Inserting `/name ` into the composer is **local state**. It is not a mutation. The existing `+` palette already inserts and “NEVER submits” (`apps/pi-remote-web/src/CommandPalette.tsx`). The inline `/` list must keep that invariant.

The **only** write remains `POST /api/prompt/submit` with a fresh one-use ticket. User text is projected as a `text` user block, then `redactEnvelope` runs on persist. The private-text key is named `prompt`, not `text`, so user messages are **pattern-scanned** (paths/tokens) rather than wholesale `[REDACTED_PRIVATE_TEXT]`. Slash args that look like POSIX paths or `sk-` tokens will be redacted in the **ledger/replay**, not in the bytes sent to Pi. (`prompt-service.ts`, `transcript-projector.ts`, `redaction.ts`)

`isPromptSubmitCommand` allowlists keys: `type`, `submissionId`, `sessionId`, `message`, `ticket`, `streamingBehavior`. Extra keys (including `images`, `commandName`, `catalogRevision`) fail closed today. (`packages/pi-rpc-protocol/src/guards.ts`)

**Steer vs extension commands (P1 UX/security).** While a turn is running, `SessionComposer` sends `streamingBehavior: 'steer'`. Pi: extension commands are **not allowed** on steer/follow-up; they must go as `prompt`, and they execute **immediately even during streaming**. (`rpc.md` Prompting). `/plan` from the phone during a run is the wrong RPC shape. The list must not offer `source === 'extension'` rows as “send now” while `status === 'running'`, or the composer must idle-send them as a real `prompt` without `steer`/`followUp`.

Plan mode itself is host/extension-enforced (`extensions/pi-remote-plan/src/index.ts`: strips `edit`/`write`, allowlists read-only bash). Inserting `/plan ` is not a plan-mode toggle. Sending `/plan` **is**. Runtime Build/Plan in the `+` menu is a **ticketed, revision-checked** `runtime.control` — a different lane. Do not collapse `/plan` insert into an optimistic local mode change.

### 1.6 Argument hints: the host does not have them

Pi `registerCommand` is `(name, { description, handler(args: string) })`. `get_commands` documents **no** `argHint`, schema, or option list. (`rpc.md`; this repo’s plan command parses `'' | on | off | execute | status` in the handler.)

Deriving hints by reading `path` / `SKILL.md` / prompt markdown would reintroduce the exact fields the projector exists to drop. **Forbidden.**

Until the host grows a bounded hint field, the safe UX is:

- Insert `/name ` (trailing space = empty arg slot), never auto-submit.
- Show **description** after `redactString` (see spec).
- Optional: a **pinned client table** only for this repo’s own extension names already in the filtered catalog (e.g. `plan` → `[on|off|execute|status]`). That table is source in *this* tree, not host filesystem.

Claude Remote Control’s mobile pattern is the same class of constraint: some commands are local-TUI-only; others accept `key=value` as **text arguments** instead of opening a desktop picker (`/model sonnet`, `/config` lists keys on mobile). ([Claude Remote Control limitations](https://code.claude.com/docs/en/remote-control)) Pi Remote should likewise only list commands that `get_commands` says are prompt-invokable, and show args as text, not fake native pickers that imply extra RPC.

### 1.7 Uploads — the exact safe path (and why `/` must not grow one)

**Current posture (correct fail-closed).**

- Pi RPC `prompt` / `steer` / `follow_up` accept optional `images: [{ type:"image", data:<base64>, mimeType }]`. ([rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md))
- Pi Remote `PromptSubmitCommand` **does not** include `images`; extra keys are rejected.
- HTTP body cap is **16_384 bytes** (`MAX_HTTP_BODY_BYTES`). A JPEG will not fit.
- Council already forbids a dead Attach affordance. (`docs/design-reference/mobile-chat-apps/council-gpt-sol.md`)
- iOS PWA **can** pick files via `<input type="file">`; it **cannot** use File System Access on the public FS. Filename is available; real path is not. ([firt.dev iOS PWA matrix](https://firt.dev/notes/pwa-ios))

**Claude’s remote-control split (do not copy blindly).** Photos become message-visible images. **Other files are downloaded onto the host machine and passed as `@` file references.** Execution stays on the machine; the transcript is stored on Anthropic servers. ([Remote Control](https://code.claude.com/docs/en/remote-control)) Pi Remote’s redaction posture forbids shipping host paths to the phone **and** forbids the phone inventing host paths. An `@/Users/…` mention UI would be a redaction bypass.

**The only safe attach lane, if/when product asks for it (not this `/` feature):**

1. **Never** a new disk-write `/api/upload`. Never `webkitdirectory`. Never `file.path`. Never `@workspace` strings generated on the phone.
2. **Images only**, MIME allowlist `image/jpeg|image/png|image/webp|image/gif`, decoded then re-encoded in the relay (do not trust client `mimeType`), pixel/byte cap, strip EXIF.
3. Phone: `<input type="file" accept="image/*" capture="environment">` optional; read `ArrayBuffer` in memory; **do not** put bytes in the slash list, IndexedDB, or the read-only transcript cache.
4. New **ticketed** route, e.g. `POST /api/prompt/attach` (`prompt:submit` or a new `prompt:attach` action), one-use ticket, foreground WS required (same as abort/runtime), **its own** body cap (hundreds of KiB, not 16 KiB — a deliberate security review, not a silent bump of `MAX_HTTP_BODY_BYTES` for all routes).
5. Relay stores an **opaque `attachmentId`** in process memory (not SQLite). Prompt submit then references `{ attachmentIds: ["att_…"] }` (protocol change with `hasOnlyKeys`). Relay injects Pi `images[]` on the RPC `prompt` only. Ledger stores a redacted user block: `image · [REDACTED_PATH]` / count / MIME class — **not** base64, not filename if it looks like a path.
6. Non-image files: **out of scope** until there is an approval-family path that writes a workspace file under containment. That is a mutation family, not a composer convenience.

Slash-command UX must not pretend Attach exists. `+` stays tools; `/` stays command names. Mixing `@` file search into the `/` list (OpenCode’s `@` vs `/` split, Kimi’s explicit separation) would pull workspace paths onto the phone. ([Kimi interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction.html); [OpenCode `$`/`@`/`/` issue](https://github.com/anomalyco/opencode/issues/20982))

### 1.8 Client-side list security (iPhone PWA)

**Do not use a second `<input>` as the filter field for the inline trigger.** Today’s palette is a RAC `ComboBox` *inside* the `+` popover. Inline `/` must filter the **composer textarea** (first character `/`). A nested ComboBox fights iOS keyboard, autofill heuristics, and the form’s Enter→submit. RAC ComboBox historically submitted the wrapping form on Enter until patched; RAC docs still warn `menuTrigger` is a desktop concern and mobile ComboBox behavior differs. ([react-spectrum#1646](https://github.com/adobe/react-spectrum/issues/1646); [RAC ComboBox](https://react-spectrum.adobe.com/react-aria/ComboBox.html))

Current composer: Enter without Shift **always** `preventDefault` + `submit()` (`SessionComposer.tsx`). With the list open, that is an auto-submit. WAI-ARIA combobox: Enter **accepts the suggestion into the field** (or a documented default action). For this product the default action is **insert, never send**. Prefer APG “list autocomplete with **manual** selection,” not automatic selection, so focus-loss / first-row highlight cannot send. ([APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/))

Discord’s lesson: autocomplete suggestions are **client-side**; the application still validates on submit. Discord also documents that autocomplete options are **not** confined to the suggestion list. ([Discord application commands](https://docs.discord.com/developers/interactions/application-commands); [Slash Commands FAQ](https://support-apps.discord.com/hc/en-us/articles/26501837786775-Slash-Commands-FAQ)) Pi Remote must validate on the relay even if the UI only offers filtered rows.

**iOS keyboard / viewport.** There is no Virtual Keyboard API on iOS PWA. Position the list with `window.visualViewport` (height/offsetTop) so it sits **above** the composer and **above** the software keyboard, not under it. ([HIG virtual keyboards](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards); [Martijn Hols, detecting iOS keyboard](https://martijnhols.nl/blog/how-to-detect-the-on-screen-keyboard-in-ios-safari); WebKit `position:fixed` + keyboard: [WebKit #191204](https://bugs.webkit.org/show_bug.cgi?id=191204) / [DEV write-up](https://dev.to/deanliu/the-ios-safari-keyboard-scroll-bug-fixed-with-one-line-of-css-1353))

**Autofill / keyboard learning.** Command names are a host capability map. MDN: `autocomplete="off"` is the documented hint that the UA must not fill; browsers may ignore it on login fields. Composer is not a login field — still set `autocomplete="off"`, `autocorrect="off"`, `autocapitalize="none"`, `spellcheck={false}` **while the draft starts with `/`**, and avoid `name`/`id`/`placeholder` tokens like `name`, `email`, `country` that Safari heuristically autofills. ([MDN turning off autocompletion](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Turning_off_form_autocompletion); [MDN `autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete); [OWASP AASVS 9.1](https://owasp-aasvs.readthedocs.io/en/latest/requirement-9.1.html))

**Rendering.** Descriptions as React text nodes only (already the case). No `dangerouslySetInnerHTML`. No markdown in descriptions (host markdown could include images/URLs).

**First-character rule.** Continue CLI and Kimi both treat `/` as a command **only as the first character** (Kimi: `/` after leading whitespace is normal text). ([continue `slashCommands.ts`](https://github.com/continuedev/continue/blob/d0a3c0b6/extensions/cli/src/slashCommands.ts); [Kimi interaction](https://moonshotai.github.io/kimi-code/en/guides/interaction.html)) Claude Code desktop is first-char only; mid-prompt `/` is a requested feature, not the mobile bar. ([anthropics/claude-code#55173](https://github.com/anthropics/claude-code/issues/55173)) For Pi Remote, first-char-only also prevents `@path` / URL / `https://` false opens and avoids treating `/Users/…` typed mid-sentence as a command (names with `/` are already dropped).

**Do not add `!` shell mode.** Names starting `!` are already stripped. Kimi/OpenCode-style bang-shell would be a mutation lane around approval/plan. Out of scope.

### 1.9 Target-bar apps, security-relevant not visual

**Claude iOS (consumer chat)** — Mobbin text/coding/image composer flows; plus menu for tools/images; no documented `/` catalog in the consumer composer. ([Mobbin Claude text](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57), [coding](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b), [image](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1))  
**Claude Code in the Claude iOS app** — `/` autocomplete on mobile is incomplete vs desktop; local-only commands are excluded; args are typed text. Treat “match Claude iOS” as: list **above** composer, **insert** then type args, **never** run TUI-only commands, **never** auto-send. ([mobile docs](https://code.claude.com/docs/en/mobile); [RC limitations](https://code.claude.com/docs/en/remote-control))  
**Kimi Code** — `/` opens a filterable list; Enter executes in the TUI; unmatched `/` becomes a normal message; `/` after whitespace is text; fuzzy includes description. Web changelog: close the panel on blur/session switch; do not leave it open. ([Kimi slash docs](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html); [CHANGELOG](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)) For Pi Remote, **Enter must not execute**; close on blur/session switch **does** apply.  
**Slack iOS slash** — type `/`, suggestions, then execute. ([Mobbin Slack shortcut command](https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc)) Execute-on-select is the anti-pattern for this app.  
**Discord iOS** — `/` filter + Tab/Enter to fill; validation before send. ([FAQ](https://support-apps.discord.com/hc/en-us/articles/26501837786775-Slash-Commands-FAQ); [Mobbin Discord chat](https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7))

OpenCode’s server-side translation (client inserts `/name`; server expands stored prompt) is the right **authority** split: UI never expands files. ([opencode#299](https://github.com/anomalyco/opencode/issues/299)) Pi already expands skills/templates **inside the host** on `prompt`. The phone must send the slash string, not a pre-expanded template (expansion would put prompt-file body on the wire twice and skip host policy).

---

## 2. Concrete spec contribution (build-executable)

### 2.0 Invariants (fail closed)

1. Catalog rows on the device ⊆ `projectCommandCatalog` ∩ `isSafeCommand`. No `path`, `location`, extra keys.
2. `description` and `disabledReason` pass `redactString` (policy v1) **before** HTTP JSON. If redaction empties the description, send `null`. If a row’s **name** fails `pathFreeToken` after NFC normalization, drop the row.
3. Insert never submits. Submit never bypasses ticket + Origin + session.
4. **Relay revalidation (new, required):** if `message` matches `^/([^\s]+)` (after NFC), `CommandService.isSlashCommandAllowed(name)` must be true on a **fresh** `get_commands` (or a catalog fetched for this submit with matching `revision`). Else **403/409** `slash_command_denied` and **do not** call Pi. Hidden real commands and unknown `/foo` both deny (unlike Kimi).
5. Optional but recommended protocol field `expectedCatalogRevision` on `prompt.submit`. Stale → `stale` outcome; UI refreshes list; no Pi call. Same compare-and-swap idea as `runtime.control`.
6. `source === 'extension'` + `status === 'running'` → insert allowed, **Send** disabled until idle **or** send as `prompt` without `steer`/`followUp` (host: extension commands execute immediately on `prompt`). Do not silently steer `/plan`.
7. No `@` file picker, no `!` shell trigger, no Attach in the `/` list.
8. Catalog never enters `localStorage`, Cache Storage, or demo fixtures that include real host paths.
9. Filter **client-side** on the already-downloaded catalog. Do not send the filter string to the host.

### 2.1 States

| State | Composer value | List | Send | a11y |
|---|---|---|---|---|
| `idle` | empty or non-`/` | closed | normal | textarea `aria-expanded=false`, no `aria-controls` |
| `slash-loading` | `/` while catalog `status==='loading'` | 3-row parchment skeleton, no names | disabled | `aria-busy=true` |
| `slash-open` | `/` + optional query, **no** space yet **or** still on the name token | open above composer | **disabled** while list open (prevents Return-send) | combobox pattern on textarea |
| `slash-empty` | name token matches 0 rows | open, “No commands” | still disabled until list dismissed | live region polite |
| `slash-error` | catalog `error` | open, “Commands unavailable — using + menu later”; no stale names | send of **non-slash** text allowed; leading `/` blocked | alert |
| `slash-inserted` | `/name ` (space inserted) | **closed** | enabled if `canSubmit` | announcement: “Inserted /name. Add arguments, then send.” |
| `slash-args` | `/name ` + args | closed (do not reopen unless user deletes back to name token) | enabled | normal textarea |
| `slash-denied` (after submit) | draft preserved | closed | error inline | `slash_command_denied` copy: “That command isn’t available from this phone.” |
| `disabled` | connection≠live, snapshot barrier, sending | cannot open | existing rules | unchanged |

**Open rule (strict):** list opens iff `prompt` matches `^/[^\n]*$` **and** the first token has no space yet, **and** there is no leading whitespace (Kimi rule). Deleting `/` closes. Space after name closes and inserts. Escape / iOS swipe-down / tap transcript closes **without** sending.

**Catalog freshness:** use in-memory catalog from mount. If `revision` older than 60s **and** list opens, one background `listCommands` (debounce 60s, share in-flight promise). Never N RPCs for N keystrokes.

### 2.2 Gestures and keyboard

- **Type `/` as first character:** open list (no extra tap). Same catalog as `+` → Commands.
- **Type query:** client fuzzy filter on `name` + **redacted** `description` (Kimi-like). Do not filter on raw pre-redaction text.
- **Tap row / Space with a highlighted row:** insert `/name ` , close list, keep keyboard up, caret after space. **Never submit.**
- **Return/Enter while list open:** insert highlighted row if any; if none, **do nothing** (do not send, do not send unmatched `/foo`). Hardware keyboard included.
- **Return/Enter while list closed:** existing send/steer behavior, after relay slash check.
- **Shift+Enter:** newline; if that makes first char no longer `/`-only-line, close list.
- **Escape / two-finger dismiss:** close list, leave typed text.
- **ArrowUp/Down / iOS Bluetooth keyboard:** move highlight; do not move caret except when list closed.
- **VoiceOver rotor:** textarea is the combobox; listbox is `aria-activedescendant`, not a second tab stop (APG: popup not in tab order).
- **Touch:** 44×44 pt rows (Apple hit-target; WCAG 2.2 2.5.8 24px min is the floor, not the iPhone target). ([Apple design tips](https://developer.apple.com/design/tips/); [HIG accessibility control size](https://developer.apple.com/design/human-interface-guidelines/accessibility); [WCAG 2.5.8](https://www.w3.org/TR/wcag2mobile-22/))
- **Scroll:** list max-height = `min(40vh, visualViewport.height - composerHeight - 12)` ; `-webkit-overflow-scrolling: touch`; overscroll does not scroll the transcript through.

### 2.3 Visual / motion (fixed DS, security-adjacent)

- Surface: bone `#f8f8f6` / dark ink panel, 1px carbon hairline, 12–16px radius, Source Serif **not** required in the list (Inter 15/20 name, 13/18 muted description). Clay `#d97757` only for the `/` prefix of the **highlighted** row (not every row — reduces screenshot “this is a privileged menu” loudness).
- Disabled rows (`enabled===false`): 40% opacity, not insertable; show redacted `disabledReason` or “Unavailable”.
- `source` shown as a 10px muted token `ext` / `prompt` / `skill` — useful, and it **is** a capability leak; acceptable on an enrolled tailnet device; do not add `location`.
- Motion: 120ms fade+8px rise; respect `prefers-reduced-motion` (instant). No layout jump of the transcript: list is overlayed in the composer region, not a new flow row.
- Pin list to `visualViewport` so it stays glued to the tray when iOS resizes. Safe-area: `max(12px, env(safe-area-inset-bottom))` already on tray; list uses `bottom: composerHeight + 8` in visual-viewport coordinates.

### 2.4 a11y

- Textarea: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls={listId}`, `aria-activedescendant` when open; `aria-label` stays “Message Pi”.
- List: `role="listbox"`, each row `role="option"`. Name is accessible name; description is `aria-describedby` on the option (so VO does not lose the name).
- Do **not** use APG automatic selection (highlighted first row must not become the value on blur).
- Contrast: muted description vs parchment ≥ 4.5:1 in both themes (AA).
- `aria-live="polite"` on count: “12 commands” / “No commands”.
- Form: `onSubmit` no-ops while `slash-open|slash-empty|slash-loading`.

### 2.5 Relay / protocol deltas (security)

1. `projectCommandDescriptor`: `description: redactBoundedString(row.description, 2000)`, same for `disabledReason`. Reuse `redactString` internals; do not persist catalogs to SQLite.
2. NFC-normalize names; reject names with C0 controls, combining-char soup, or homoglyph `/` (already slash-less).
3. Wire `isSlashCommandAllowed` into `prompt.submit` as in 2.0.4. Rate-limit: this extra `get_commands` **is** the submit-time TOCTOU close; do not also call it on every list open.
4. Dedicated limiter: max **6** `get_commands` RPCs per device per minute (list refresh + submit revalidation).
5. Tests: canary description `/Users/x/secret` and `Bearer abc` never leave `listCommands()`; `/login` HTTP submit 403; `/plan` 202; `steer`+`/plan` either 409 `extension_command_not_steerable` or auto-promoted to idle `prompt` (pick one, document, test).
6. `CommandPalette` and inline list share one `filterCommands(catalog, query)` and one insert helper `insertSlash(name) => '/' + name + ' '`.

### 2.6 Uploads (only if a later slice adds Attach)

Follow §1.7. Until that lane exists: **no paperclip, no slash command named `attach`/`upload`/`image` even if the host lists one** — add those tokens to `PRIVILEGED_COMMAND_PATTERN` or a dedicated denylist so a host `/upload` cannot be a back door. Current pattern already includes `install`/`share`/`session` but **not** `upload`/`attach`/`image`/`photo`. **Add `upload|attach|image|photo|file|blob|write|edit|bash|fetch` to the phone denylist** unless product explicitly wants those as prompt-templates (they are still revalidated, but should not be *suggested*).

---

## 3. Divergent / minority ideas (do not converge)

1. **Revision-bound submit.** Every prompt carries `expectedCatalogRevision`. Heavier than name revalidation; closest to existing runtime CAS. Worth it if catalogs churn (skills loaded mid-session).
2. **Never execute extension commands from the phone.** List `prompt`+`skill` only; `/plan` only via ticketed `runtime.control`. Shrinks the remote command ISA to “expand templates,” matching Claude’s local-only command split. Conflicts with “actual available host commands.”
3. **Deny-by-default unknown `/` vs send-as-chat.** Spec §2.0.4 denies. Minority: if name is **not** in the **unfiltered** host catalog, send as plain text (Kimi); if it **is** in host catalog but filtered, deny. Distinguishes `/shrug` chat from `/login` smuggle. Requires the relay to keep both sets in memory without sending the privileged set to the phone.
4. **Hashed catalog.** Phone receives `{id: hmac(name), description}` and inserts via id; names never on the device. Hostile UX, kills fuzzy-on-name, probably overkill on a single-operator tailnet.
5. **Screenshot / task-switcher hide.** `visibilitychange` → unmount list; CSS `content-visibility` won’t stop iOS app-switcher captures. Minority: `-webkit-touch-callout: none` + no list while `document.hidden`.
6. **Mid-prompt `/` (Codex-style).** Useful for chaining skills; explodes false positives on paths and URLs; Continue/Kimi/Claude Code default is first-char. Resist for v1.
7. **Server-side fuzzy.** Every keystroke → RPC. Violates stdin serialization and leaks intent to logs. Reject.
8. **Arg chips from description regex** (`[on|off]` parsed from English). Fragile; can highlight secrets. Prefer pinned table for `plan` only.
9. **Two-step confirm for `requiresConfirmation`.** After insert, Send morphs to “Send /name” with extra tap. Does not replace relay checks; may reduce accidental extension execution during streaming.
10. **Drop `source` and `skill:` prefix from the UI** (show `brave-search` only) to reduce inventory leakage; keep full name on the wire because that is what Pi expands.
11. **Opaque attachment lane as a slash command `/image`.** Convenient, but trains users to put binary in the command channel and blows the 16 KiB cap. Keep Attach on `+` only.
12. **Execute-on-select like Slack/Kimi TUI.** Faster on a phone; violates “never auto-submits” and makes argument hints impossible. Reject for this product.

---

## 4. Open questions + risks

1. **Does live Pi 0.84.1 match the documented `get_commands` shape** (`path` vs newer `sourceInfo` in older `rpc-types.d.ts`)? Projector already accepts array-or-`{commands:[]}` and ignores unknown keys — verify against the pinned binary before assuming `location` exists. ([0.68 unpkg rpc.md](https://unpkg.com/@mariozechner/pi-coding-agent@0.68.0/docs/rpc.md); [0.64 rpc-types](https://cdn.jsdelivr.net/npm/@mariozechner/pi-coding-agent@0.64.0/dist/modes/rpc/rpc-types.d.ts))
2. **Homoglyph / Unicode names.** `pathFreeToken` allows colons (`skill:…`) and most Unicode. A lookalike `plan` could bypass a client allowlist but not a relay `Set` of exact host strings — unless the host itself registers it.
3. **TOCTOU:** skill unloaded between list and send → deny on revalidation (good). Skill **added** and typed blindly → deny until refresh (good). Operator confusion needs copy.
4. **`get_commands` during an in-flight turn** queues on the same stdin. Submit-time revalidation can delay steering. Consider caching `allowedNames` for ≤5s to bound this, accepting a 5s TOCTOU window — **document the window**.
5. **Prompt-template expansion** may in-line file contents on the **host** after submit; those bytes then stream back through transcript projection/redaction. Expansion is host-side (good). Risk: expanded prompt contains secrets that pattern-redaction misses (`docs/security.md`: redaction is not a proof).
6. **16 KiB body** vs long `/skill:…` plus pasted args. Slash deny/allow happens after body parse; huge pastes already fail. Don’t raise the global cap for this feature.
7. **iOS autofill ignoring `autocomplete=off`.** Residual risk: command names in QuickType. Accept; don’t rename the textarea to random ids (hurts a11y).
8. **VoiceOver + software keyboard + overlay list** on iOS Safari is historically buggy with RAC popovers. Prefer APG combobox on the textarea, `Popover` from RAC only if it uses the same focus trap tests on iPhone.
9. **Privileged-pattern false positives.** `session` hides any `session-*` command (host example `session-name`). That is intentional conservatism; product may want a tighter denylist. Do not loosen without a threat review.
10. **Missing denylist terms** `upload|attach|bash|write|edit` — see §2.6.
11. **Mobbin of Kimi Code iOS** was not retrieved (MCP unauthenticated; web search did not yield a Kimi Code iOS flow). Visual match to Kimi Code is inferred from CLI/web docs, not a phone screenshot.
12. **Plan `/plan execute`** restores mutating tools on the host. Phone showing `execute` as a hint is an **authority** issue: it is a text arg, still goes through prompt, still subject to approval extension if mutation family is on. Do not special-case a second client-side execute button.

---

## 5. Sources

### This repository (evidence, not opinions)

- `apps/pi-remote-relay/src/commands/command-service.ts` — filter, `isSlashCommandAllowed`
- `apps/pi-remote-relay/src/store/redaction.ts` — `projectCommandCatalog`, policy v1
- `apps/pi-remote-relay/src/http/server.ts` — `/api/commands/list`, `/api/prompt/submit`, `MAX_HTTP_BODY_BYTES = 16384`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` — ticketed prompt → Pi `prompt`
- `apps/pi-remote-relay/src/auth/policy.ts` — `commands:list` vs `prompt:submit`
- `apps/pi-remote-relay/tests/commands.test.ts`, `tests/runtime-control.test.ts`
- `packages/pi-rpc-protocol/src/types.ts`, `guards.ts` — DTO allowlists; no `images` on submit
- `apps/pi-remote-web/src/CommandPalette.tsx`, `SessionComposer.tsx`, `commands.ts`, `relay.ts`, `cache.ts`, `public/service-worker.js`
- `extensions/pi-remote-plan/src/index.ts` — `/plan` args; host-enforced plan mode
- `docs/security.md`, `docs/feature-catalog/transport-and-state/canonical-redaction.md`
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`

### Host / agent RPC

- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md
- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md
- https://unpkg.com/@mariozechner/pi-coding-agent@0.68.0/docs/rpc.md
- https://cdn.jsdelivr.net/npm/@mariozechner/pi-coding-agent@0.64.0/dist/modes/rpc/rpc-types.d.ts
- https://github.com/dnouri/pi-coding-agent/issues/143 — `get_commands` is not the TUI `/commands` list

### Claude iOS / Remote Control (target bar)

- https://code.claude.com/docs/en/mobile
- https://code.claude.com/docs/en/remote-control
- https://support.anthropic.com/en/articles/10263469-using-claude-app-intents-and-shortcuts-on-ios
- https://github.com/anthropics/claude-code/issues/32051
- https://github.com/anthropics/claude-code/issues/62482
- https://github.com/anthropics/claude-code/issues/55173
- https://github.com/anthropics/claude-code/issues/60167
- https://github.com/anthropics/claude-code/issues/44060

### Kimi Code (target bar)

- https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html
- https://moonshotai.github.io/kimi-code/en/guides/interaction.html
- https://moonshotai.github.io/kimi-cli/en/reference/slash-commands.html
- https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md
- https://www.kimi.com/resources/kimi-code-cheat-sheet

### Other coding-agent / chat prior art

- https://github.com/continuedev/continue/blob/d0a3c0b6/extensions/cli/src/slashCommands.ts
- https://github.com/anomalyco/opencode — `/` + `@` composer; plan/build agents
- https://github.com/anomalyco/opencode/issues/20982
- https://github.com/anomalyco/opencode/issues/299
- https://docs.discord.com/developers/interactions/application-commands
- https://support-apps.discord.com/hc/en-us/articles/26501837786775-Slash-Commands-FAQ
- https://github.com/discord/discord-api-docs/blob/main/developers/interactions/application-commands.mdx

### Apple / WCAG / PWA / a11y / privacy

- https://developer.apple.com/design/tips/ — 44×44 pt
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- https://www.w3.org/TR/wcag2mobile-22/
- https://react-spectrum.adobe.com/react-aria/ComboBox.html
- https://github.com/adobe/react-spectrum/issues/1646
- https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Turning_off_form_autocompletion
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
- https://owasp-aasvs.readthedocs.io/en/latest/requirement-9.1.html
- https://firt.dev/notes/pwa-ios
- https://martijnhols.nl/blog/how-to-detect-the-on-screen-keyboard-in-ios-safari
- https://dev.to/deanliu/the-ios-safari-keyboard-scroll-bug-fixed-with-one-line-of-css-1353

### Mobbin screens / flows

- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS text composer
- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS coding input
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image attach
- https://mobbin.com/explore/flows/c367fe4e-3662-4f6f-870a-93f97e5110cc — Slack iOS slash/shortcut (execute-on-select anti-pattern)
- https://mobbin.com/explore/screens/041a4291-f46b-48cd-8b08-dc87cceea3f7 — Discord iOS chat + composer
