<!-- provenance: external-CLI orchestration pass; original file iter-07-grok.md -->
> **Source pass 7** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-7-grok.md`.

<!-- F4-plan-mode-tab | model=grok | lens=security-redaction | iter 7/10 | 2026-08-15T19:27:55.266Z -->

# Iteration 7 — Security-redaction lens  
**Feature:** Switch to plan mode, including a Tab / keyboard affordance  
**App:** Pi Remote (iPhone PWA)  
**Posture (fixed):** ticketed + revision-checked mutations, fail closed, redaction everywhere, host/extension-enforced plan mode

Mobbin MCP was not reachable in this session (empty MCP catalog). Mobbin citations are public flow URLs.

---

## 1. Findings (security, redaction, data-flow)

### 1.1 What this feature actually mutates

Plan mode is **not a UI theme**. It changes the host tool set: entering plan removes `edit` and `write` and blocks non-allowlisted `bash`; leaving plan restores the captured tool list; `execute` restores tools and publishes `executing-plan`, after which `bash rm -rf x` is allowed again. That is proven in the plan extension tests ([SOURCE: `extensions/pi-remote-plan/src/index.ts`](https://github.com); [SOURCE: `extensions/pi-remote-plan/tests/plan-mode.test.ts`]).

The PWA must never treat the toggle, Tab, or a slash insert as authority. Authority is: **Pi extension tool gate** + **relay `RuntimeService` confirmation of `setStatus`** + **one-use ticket** + **expected revision**. The browser reducer already refuses optimistic committed mode ([SOURCE: `apps/pi-remote-web/src/runtime.ts`]). Keep that.

### 1.2 Control plane is currently implemented as a user prompt

`RuntimeService.apply` for `set_mode` does **not** call a dedicated RPC. It sends a Pi `prompt` whose message is `/plan on` or `/plan off`, then waits up to 4s for `extension_ui_request` / `setStatus` with key `pi-remote-plan-mode` ([SOURCE: `apps/pi-remote-relay/src/runtime/runtime-service.ts`]; [SOURCE: `apps/pi-remote-relay/src/runtime/plan-status.ts`]).

That collapses two planes that Claude Code keeps apart. Official Claude Code docs: **“Asking Claude in chat to change the permission mode doesn't work.”** Mode is changed with Shift+Tab, a mode selector, or a startup flag — not by chatting ([SOURCE: https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)). Desktop: mode selector **next to the send button** ([SOURCE: https://code.claude.com/docs/en/desktop](https://code.claude.com/docs/en/desktop)).

Pi Remote’s phone toggle is the right *surface*, but the *wire* is still a prompt. Any other prompt that starts with `/plan` is a second, weaker control path.

### 1.3 Dual path: ticketed `runtime.control` vs unfiltered `/plan …` in the composer

**Path A (gated).** `POST /api/runtime/control` requires:

- valid `runtime.control` body (`set_mode` only `'build' | 'plan'`; `'executing-plan'` and `'unknown'` rejected) ([SOURCE: `packages/pi-rpc-protocol/src/guards.ts`]; [SOURCE: `packages/pi-rpc-protocol/tests/guards.test.ts`])
- one-use ticket consumed as `runtime:control` ([SOURCE: `apps/pi-remote-relay/src/http/server.ts`]; [SOURCE: `docs/feature-catalog/auth-and-boundary/one-use-tickets.md`](docs/feature-catalog/auth-and-boundary/one-use-tickets.md))
- **foreground** device (live authenticated sync socket) ([SOURCE: `apps/pi-remote-relay/src/http/server.ts`])
- rate limit **30 / 60s / device** ([SOURCE: `apps/pi-remote-relay/src/http/server.ts`])
- `expectedRevision` CAS; stale → no Pi command ([SOURCE: `apps/pi-remote-relay/src/runtime/runtime-service.ts`]; [SOURCE: `apps/pi-remote-relay/tests/runtime-control.test.ts`])
- host `setStatus` confirmation or fail closed (`plan mode was not confirmed by the host`)

**Path B (not gated as mode control).** The command catalog **intentionally exposes** `plan` to the phone (`isSlashCommandAllowed('plan') === true`; privileged-name filter does not include `plan` or `execute`) ([SOURCE: `apps/pi-remote-relay/src/commands/command-service.ts`]; [SOURCE: `apps/pi-remote-relay/tests/commands.test.ts`]). The `+` menu inserts `` `/${name} ` `` into the draft ([SOURCE: `apps/pi-remote-web/src/SessionComposer.tsx`]). `PromptService.submit` forwards `command.message` unchanged ([SOURCE: `apps/pi-remote-relay/src/prompt/prompt-service.ts`]). **`isSlashCommandAllowed` is never called from the HTTP prompt path** (definition + tests only).

Consequence: the phone can send `/plan execute` through `prompt:submit` (ticketed as a **prompt**, not as `runtime:control`, **no revision check**, **no `RuntimeOperation` allowlist**). The extension’s `execute` branch restores write tools ([SOURCE: `extensions/pi-remote-plan/src/index.ts`]; test “restores tools and hands off to execution”). Protocol forbids the client from *requesting* `executing-plan`; the slash path still *causes* it.

This is the highest-severity data-flow defect for the feature. Kimi Code’s equivalent (`ExitPlanMode`) is a **dedicated approval panel**; `--yolo` does **not** bypass plan-exit approval ([SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes](https://www.kimi.com/help/kimi-code/cli-work-modes); [SOURCE: https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/kimi-command.md](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/kimi-command.md)). Cline’s history of **model-initiated** plan→act is documented as harmful ([SOURCE: https://github.com/cline/cline/issues/10497](https://github.com/cline/cline/issues/10497); [SOURCE: https://github.com/cline/cline/pull/12054](https://github.com/cline/cline/pull/12054)). Do not copy Cline’s “just say implement.”

### 1.4 Persistent status today is lying in two host states

Composer/RuntimeStrip:

- `planActive = mode === 'plan' || mode === 'executing-plan'`
- label `'Plan · read-only'` **only** when `mode === 'plan'`
- `unknown` / missing state → selected key `'build'` ([SOURCE: `apps/pi-remote-web/src/SessionComposer.tsx`]; [SOURCE: `apps/pi-remote-web/src/RuntimeStrip.tsx`])

So:

| Host mode | Tools | What the phone paints |
|---|---|---|
| `plan` | edit/write removed; bash allowlist | Plan · read-only |
| `executing-plan` | **full tools restored** | Plan selected, **not** “read-only” — still the Plan segment |
| `error` → parsed as `unknown` | stay restricted if restore failed | **Build** selected |
| hydrate after reconnect (`mode` starts `'unknown'`; hydrate does **not** send `/plan status`) | whatever Pi still has | **Build** selected |

`parsePlanStatus` maps anything other than `build`/`plan`/`executing-plan` (including `'error'`) to `'unknown'` ([SOURCE: `apps/pi-remote-relay/src/runtime/plan-status.ts`]). A user who believes they left plan can send a write-intent prompt; tools may still be blocked (fail closed) **or**, after a successful `execute` via Path B, writes are live while the chip still looks like Plan.

Council copy already named the correct split (`executing-plan` → `Plan running`, mode changes disabled) ([SOURCE: `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)) — the running UI does not implement it.

Claude Code’s status bar uses distinct glyphs per mode (`⏸ plan mode on`, `⏵⏵ accept edits on`, …) and **approving a plan exits plan and switches permission mode** ([SOURCE: https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)). Kimi paints a blue `plan` badge and changes the prompt to `📋` ([SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes](https://www.kimi.com/help/kimi-code/cli-work-modes)). OpenCode cycles **Build/Plan agents with Tab** and denies edits in Plan except plan-markdown paths ([SOURCE: https://opencode.ai/docs/agents](https://opencode.ai/docs/agents); [SOURCE: https://github.com/sst/opencode/blob/c7b35342/packages/opencode/src/agent/agent.ts](https://github.com/sst/opencode/blob/c7b35342/packages/opencode/src/agent/agent.ts)).

### 1.5 Tab on iPhone is a security control, not a convenience key

Target-bar keybinds:

| Product | Key | What it does |
|---|---|---|
| Claude Code CLI | **Shift+Tab** | Cycle permission modes, including plan ([SOURCE: https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)) |
| Kimi Code CLI | **Shift-Tab** | Toggle plan ([SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes](https://www.kimi.com/help/kimi-code/cli-work-modes); [SOURCE: https://www.kimi.com/resources/kimi-code-cheat-sheet](https://www.kimi.com/resources/kimi-code-cheat-sheet)) |
| OpenCode | **Tab** | Cycle primary agents (Build ↔ Plan) ([SOURCE: https://opencode.ai/docs/agents](https://opencode.ai/docs/agents)) |

iOS:

- Software keyboard **has no Tab** (given).
- Hardware Tab under Full Keyboard Access is **Move forward**; Shift-Tab is **Move backward** ([SOURCE: https://support.apple.com/guide/iphone/ipha4375873f/ios](https://support.apple.com/guide/iphone/control-iphone-with-an-external-keyboard-ipha4375873f/ios)).
- WCAG 2.1.2: if Tab is stolen, focus is trapped unless a standard exit is documented ([SOURCE: https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)).
- WCAG 3.2.2: changing a control’s setting must not cause a **change of context** without prior warning ([SOURCE: https://www.w3.org/WAI/WCAG22/Understanding/on-input.html](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html)). Restoring write tools is a change of context (meaning of the session).
- Composer already binds **Enter** (send) vs **Shift+Enter** (newline) on the textarea ([SOURCE: `apps/pi-remote-web/src/SessionComposer.tsx`]). Unmodified Tab in Safari typically **leaves** the textarea (focus), it does not insert a tab.

A global `keydown` Tab → `setMode` would: (1) fight FKA, (2) fire a ticketed mutation while tabbing through RAC buttons, (3) fail WCAG 2.1.2/3.2.1. The only defensible intercept is **composer-focused + Shift+Tab + `preventDefault`**, still going through Path A, **never** execute.

Apple HIG: confirm **uncommon, non-undoable** capability expansion; do **not** alert on routine reversible actions ([SOURCE: https://developer.apple.com/design/human-interface-guidelines/alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)). **Enter plan** is capability *reduction* → no alert. **Exit plan / execute** is capability *expansion* → action sheet, not a silent Tab.

### 1.6 Redaction: what plan mode puts on the phone

Canonical policy v1, applied **before persist/broadcast** ([SOURCE: `apps/pi-remote-relay/src/store/redaction.ts`]; [SOURCE: `docs/security.md`](docs/security.md); [SOURCE: `docs/feature-catalog/transport-and-state/canonical-redaction.md`](docs/feature-catalog/transport-and-state/canonical-redaction.md)):

- Key names: path / secret / `prompt` → markers
- String scan: `key=value` secrets, Bearer, `github_pat`/`ghp`/`sk-`/`xox*`, POSIX prefixes `~` or `/Users|/home|/private|/tmp|/var|/etc|/opt|/usr|/Volumes`, Windows `X:\…`
- Runtime DTOs are **allowlisted projectors** (no raw `get_state`)

Gaps that **plan mode widens** because the agent is incentivized to `read`/`cat`/`git show`:

1. **Relative paths** (`apps/foo/secret.ts`, `.env`) are **not** redacted. Plans are mostly relative paths.
2. **File contents** of secrets that are not assignment-shaped (PEM, JSON tokens, `DATABASE_URL` without the scanned key set) survive.
3. Plan-mode bash allowlist includes `cat`, `head`, `tail`, `git show` ([SOURCE: `extensions/pi-remote-plan/src/index.ts`]). Write is blocked; **read-exfil to the phone ledger is not**. OpenCode’s default `read` policy asks on `*.env` ([SOURCE: https://github.com/sst/opencode/blob/c7b35342/packages/opencode/src/agent/agent.ts](https://github.com/sst/opencode/blob/c7b35342/packages/opencode/src/agent/agent.ts)). Pi does not.
4. `tool_result` / `file_diff` / plan item text render in the PWA as raw strings ([SOURCE: `apps/pi-remote-web/src/App.tsx`]). Copy uses the iOS general pasteboard (Universal Clipboard; iOS 16 paste prompt is **not** a substitute for not copying secrets) ([SOURCE: https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/](https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/)).
5. `extension_ui_request` is projected as a **`kind: 'plan'`** transcript card (`title` / `message` / `Extension requested ${method}`) ([SOURCE: `apps/pi-remote-relay/src/store/transcript-projector.ts`]). Control-plane `setStatus` therefore pollutes the data plane. `statusText` is not copied into that card today; `title`/`message` still go through redact-on-append only.
6. Phone-submitted prompts are projected as user text, then redacted on publish. The **`prompt` key** redaction does **not** apply to transcript `text` fields (only keys named `prompt`). User-typed `/plan execute` and pasted secrets persist as `text` modulo the string scanner.
7. Push stays `{ lookupId, attentionClass }` only ([SOURCE: `docs/feature-catalog/command-and-push/vapid-content-free-push.md`](docs/feature-catalog/command-and-push/vapid-content-free-push.md)). **Do not** put mode, plan titles, or paths in push. Plan-mode attention must reuse existing classes (`needs_input` / `finished` / `error`).

Docs already state redaction is pattern-based, not a proof ([SOURCE: `docs/security.md`](docs/security.md) §9). Plan mode increases volume of host filesystem text on a device that screenshots, AirDrops, and backgrounds without `FLAG_SECURE` (Safari/PWA has none).

### 1.7 Uploads: there is no prompt upload path; do not invent one on this feature

Observed:

- HTTP JSON bodies **16 384 bytes**; oversized bodies fail closed ([SOURCE: `apps/pi-remote-relay/src/http/server.ts`]; [SOURCE: `docs/security.md`](docs/security.md) §2).
- Prompt limiter **20 / min**; runtime control **30 / min**.
- The only `<input type="file" accept="image/*">` is **enrollment QR scan**, decoded **on device** into text; bytes are not posted to Pi ([SOURCE: `apps/pi-remote-web/src/App.tsx`]).
- Design council: attachment cards use **existing redacted data**; **no new upload/mutation lane** ([SOURCE: `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md)).
- UI map lists “future attach” in `+` ([SOURCE: `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`](docs/design-reference/mobile-chat-apps/02-current-ui-map.md)) — not shipped.

Claude iOS **does** attach images in-chat ([SOURCE: https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1)). That is a consumer-chat pattern, not a tailnet coding-agent pattern. Conduit’s “camera attachment from mobile browser” ([SOURCE: https://github.com/dibstern/conduit](https://github.com/dibstern/conduit)) is the **anti-pattern** for this posture: binary on the remote client.

OWASP unrestricted upload: allowlist types, never trust filename/Content-Type, generated names, size limits at every layer, store off webroot ([SOURCE: https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload); [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)).

**Exact safe path to the agent (if attach is ever added — not required to ship plan-mode UX):**

1. Phone never POSTs file bytes on `/api/prompt/submit` or `/api/runtime/control` (16 KiB + JSON + ledger).
2. Phone mints a **one-use `attachment:ingest` ticket** (new action; default-deny until listed in `authorizeAction`).
3. Relay opens a **host-local** ingest (loopback, not Tailscale body): stream to a generated name under a workspace temp dir the Pi child can `read`; reject >N bytes, non-allowlisted MIME+magic, path chars.
4. Ledger/sync receive only a projector DTO: `{ attachmentId, byteLength, mediaClass }` — **no path, no filename, no bytes**. Filenames go through `pathFreeToken` or `[REDACTED_PATH]`.
5. Pi is told an opaque host path **only inside the child**, never on the wire to the phone.
6. In **plan** mode, ingest is **read-context only**. It does not enable `write`/`edit` and is not an execute grant.
7. Enrollment QR stays the sole on-device file picker until that lane exists; hide attach in `+` (capability-gated, same as hidden mic).

### 1.8 How other apps signal a distinct mode (security-relevant bits)

| App | Signal | Security-relevant behavior |
|---|---|---|
| **Claude iOS** | Composer `+`, image attach, artifacts in-thread; **not** Claude Code plan mode | Chat/image flows: [text](https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57), [image](https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1), [coding input](https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b). Do not copy image-to-model as Pi attach. |
| **Claude Code** | Status bar + Shift+Tab + selector beside send | Chat cannot change mode; approve-plan **exits** plan into a named permission mode ([SOURCE: https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)). |
| **Kimi Code** | `📋` prompt + blue `plan` badge; Shift-Tab; `/plan on\|off`; **ExitPlanMode** panel | Approve / reject / revise / reject-and-exit; YOLO does not skip plan-exit ([SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes](https://www.kimi.com/help/kimi-code/cli-work-modes)). |
| **OpenCode** | Tab cycles Build/Plan | Plan **denies edit** except plan files; `plan_exit` is an explicit permission ([SOURCE: https://opencode.ai/docs/agents](https://opencode.ai/docs/agents)). |
| **Cline** | Plan/Act toggle (⌘⇧A on desktop) | Conversation context carries over; switch should be **user** gated ([SOURCE: https://docs.cline.bot/core-workflows/plan-and-act](https://docs.cline.bot/core-workflows/plan-and-act)). |
| **OpenCode WebUI PWA** | Plan/Build toggle in a mobile web UI | Same split, weaker auth than Pi Remote ([SOURCE: https://github.com/threehymns/opencode-webui](https://github.com/threehymns/opencode-webui)). |

Pi’s upstream example extension uses `ctx.ui.setStatus("plan-mode", …)` and a **select** before execute ([SOURCE: https://unpkg.com/@mariozechner/pi-coding-agent@0.68.0/docs/tui.md](https://unpkg.com/@mariozechner/pi-coding-agent@0.68.0/docs/tui.md); [SOURCE: https://app.unpkg.com/@mariozechner/pi-coding-agent@0.68.0/files/examples/extensions/plan-mode/index.ts](https://app.unpkg.com/@mariozechner/pi-coding-agent@0.68.0/files/examples/extensions/plan-mode/index.ts)). Pi Remote already pins status key `pi-remote-plan-mode` and fail-closed restore. The missing piece is **not** another toggle — it is **closing Path B and making execute a first-class, confirmed, ticketed operation**.

### 1.9 Plan → execute handoff (the dangerous edge)

Host today:

```
plan --(execute)--> executing-plan  // tools restored, bash mutations allowed
plan --(off)------> build           // tools restored
restore fail -----> status 'error'  // stay restricted
```

Phone today: no `set_mode: 'executing-plan'`; no confirm sheet; slash `/plan execute` works; toggle treats execute as Plan.

Claude: approve options **name the destination permission mode**; staying in plan is explicit **“No, keep planning”** ([SOURCE: https://code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes)). Kimi: approve vs reject vs revise vs reject-and-exit ([SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes](https://www.kimi.com/help/kimi-code/cli-work-modes)). Apple HIG: action sheet for an **intentional** multi-choice destructive-adjacent action ([SOURCE: https://developer.apple.com/design/human-interface-guidelines/action-sheets](https://developer.apple.com/design/human-interface-guidelines/action-sheets)).

For Pi Remote, execute must remain **host-enforced**. The phone may only **request** a new operation (see spec). Until that exists, **hide `/plan` from the phone catalog** and **reject leading `/plan` on `prompt:submit`** so Path B cannot restore writes.

---

## 2. Concrete spec contribution (build-executable)

### 2.1 Authority invariant (non-negotiable)

```
phone UI intent
  → POST /api/runtime/control  { type: 'runtime.control', operation, expectedRevision, ticket }
  → RuntimeService: live + revision + foreground + limiter
  → Pi: dedicated control, NOT a user-visible prompt if the host can do it;
        until then, only '/plan on' | '/plan off' from this service, never from prompt.submit
  → wait for setStatus ∈ {build, plan}  (execute: see 2.4)
  → projectRuntimeState allowlist DTO
  → client paints host-confirmed state only
```

Fail closed: `unavailable` / `stale` / `delivery-unknown` / timeout. **Never auto-retry** `delivery-unknown`. **Never** paint the requested mode before `accepted`.

### 2.2 States (host DTO `mode` × UI)

| `runtime.status` | `state.mode` | Toggle | Persistent chip (header, always visible) | `aria-live="polite"` `role="status"` |
|---|---|---|---|---|
| `checking` | — | disabled | Mode · checking | “Checking runtime” |
| `ready` | `unknown` | disabled | **Mode unknown — tap to reconcile** (not Build) | “Mode unknown” |
| `ready` | `build` | Build pressed | no chip, or quiet “Build” | “Build mode” (only on **change**) |
| `ready` | `plan` | Plan pressed | **Plan · read-only** (clay 4px bar, carbon text on bone; clay is fill/bar, not small text — AA) | “Plan mode, read-only” |
| `ready` | `executing-plan` | **disabled** | **Plan running** (distinct; not “read-only”) | “Plan running, writes enabled on host” |
| `pending` | previous | disabled | chip + “Applying…” | “Applying mode” |
| `stale` | host value | disabled until user Refresh | “Host changed — refresh” | “Host changed” |
| `error` + `deliveryUnknown` | last confirmed or unknown | disabled | “Unconfirmed — reconcile, do not retry” | same |
| restore `error` on host | parsed `unknown` | disabled | **Plan locked — host error** | “Plan restore failed, still read-only” |

Hydrate **must** send `/plan status` (or equivalent) before first paint so `unknown` is not shown as Build.

### 2.3 Entry / exit gestures (phone)

**Enter plan (capability down) — fast, no alert**

1. `+` → Mode → Plan, **or** header chip, **or** hardware **Shift+Tab** while `#session-prompt` is focused, `shiftKey && key==='Tab'`, `preventDefault`, `repeat===false`.
2. If `status!=='ready'` or `mode` is `unknown`/`executing-plan`/`error`: ignore key, no request.
3. `setMode('plan')` → Path A only.
4. Soft keyboard: no Tab; the Plan segment is the affordance (44×44 pt).

**Leave plan to build (capability up) — confirm**

1. Same controls targeting Build.
2. Present a **bottom action sheet** (HIG action sheet, not a blocking alert): title “Leave plan mode?”, body “Pi can edit and run commands again. Approvals still apply.” Actions: **Stay in plan** (cancel, default), **Switch to Build** (not styled destructive unless product wants extra friction).
3. Only **Switch to Build** calls `setMode('build')`.
4. Shift+Tab in plan: **open the same sheet** (do not mutate on keyup). Second Shift+Tab does nothing until the sheet is resolved. Escape / tap-outside = Stay.

**Unmodified Tab:** never bound. Leaves the textarea (focus) for FKA/WCAG 2.1.2. Document in the hardware-keyboard hint: `⇧⇥ Plan` (visible only when `KeyboardEvent` with `key==='Tab'` was seen this session — capability-gated, like hidden mic).

### 2.4 Plan → execute (new, or omit until wired)

Do **not** ship execute as slash text.

If the build includes handoff:

1. New `RuntimeOperation`: `{ type: 'execute_plan' }` only (still **not** `set_mode: 'executing-plan'` as a client-set enum). Guard: `hasOnlyKeys`, current host mode must be `plan`, else `unsupported`.
2. Relay sends `/plan execute` **only** from `RuntimeService`, waits for `executing-plan` **or** `error`. `error` → UI “Plan locked”, tools remain restricted (already tested).
3. Phone UI: primary on the plan card / chip overflow: **Run plan**. Action sheet: **Keep planning** | **Run plan** (destructive style: this is the uncommon non-undoable expansion). Optional third: **Switch to Build without running** → `set_mode: 'build'`.
4. Digest (optional but aligned with exact-action leases): hash redacted plan-card text into the controlId payload so a stale plan cannot be executed after a newer plan revision. If too heavy for this slice, at least bind `expectedRevision`.
5. After `executing-plan`, **disable** mode toggle until host returns `build` or `plan`. Steer/send remain ticketed prompts; protected `edit`/`write`/`bash` still hit approval leases ([SOURCE: `docs/security.md`](docs/security.md) §5–7). Execute is **not** an accept-edits grant.

Until 1–3 exist: **remove `plan` from the phone command catalog** (`PRIVILEGED_COMMAND_PATTERN` or an explicit denylist `plan`), and in `prompt:submit` reject messages whose first token is `/plan` (case-sensitive, leading whitespace stripped). Wire `isSlashCommandAllowed` into submit — the method already exists.

### 2.5 Redaction / transcript rules for this feature

1. Do **not** project `extension_ui_request` `setStatus` / `pi-remote-plan-mode` as `kind: 'plan'` cards. Filter in `TranscriptProjector` (control plane ≠ todo list). Today `turn_start` and `setStatus` both render as “Plan / todo” ([SOURCE: `apps/pi-remote-web/src/App.tsx`]) — that trains users to trust the wrong object.
2. `/plan on|off|execute` issued by `RuntimeService` must **not** appear as user bubbles. If Pi emits `message_start` for them, drop or map to a non-replay control event (`replay.eligible: false`).
3. Plan-mode `tool_result` for `cat`/`head`/`tail`/`git show`: keep canonical redact; **additionally** cap phone-visible output (e.g. 2 000 chars) and stamp `redaction.reasons` with `truncated` if you add a reason — or collapse to “Read N bytes (redacted)” when `fieldsRedacted>0`. Do not stream raw `.env` bodies to the PWA.
4. Copy on plan/tool/diff blocks: user-initiated only; no programmatic `clipboard.write` of tool output. MASVS: avoid general pasteboard for secrets ([SOURCE: https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/](https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/)).
5. `visibilitychange` → `hidden`: do not add new persistence; optional **blur** of transcript (CSS) while backgrounded. PWA cannot set FLAG_SECURE; this is mitigation, not a control.
6. Push: no mode string. If execute needs attention, use existing `needs_input` and let the authenticated fetch show the chip.

### 2.6 A11y (WCAG AA, RAC)

- Mode chip: `role="status"` `aria-live="polite"` `aria-atomic="true"`. Mode **errors** / delivery-unknown: `role="alert"` once, not on every pending.
- Toggle: RAC `ToggleButton` `aria-pressed`; group `aria-label="Build or Plan"` (already). When execute disables the group, `aria-disabled` + status text “Plan running”.
- Shift+Tab intercept only on the textarea; announce via the same live region, not a new dialog for **enter**. Exit uses the action sheet (`role="dialog"` `aria-modal="true"`).
- Do not use Tab as the only path (no keyboard trap; software keyboard users use the toggle).
- Contrast: carbon ink on bone for chip label; clay `#d97757` as 4px bar / selected fill with **carbon** label, not clay-on-bone small type.

### 2.7 Visual / motion (ink-on-parchment, no new palette)

- Idle Build: no bar.
- Confirmed Plan: 4px clay leading edge on header chip + composer tray hairline; Source Serif not required on the chip (Inter).
- Pending: opacity 0.6 on toggle, 150ms; **do not** slide the transcript.
- `executing-plan`: carbon chip, not clay (clay = read-only). Copy “Plan running”.
- `unknown`: stone chip, no Plan/Build pressed state (`selectedKeys=[]` allowed; today’s `disallowEmptySelection` + fake Build is the lie).
- iOS keyboard: keep composer pre-lift behavior; **do not** open the `+` popover on Shift+Tab (popover + keyboard = missed confirm). Shift+Tab drives the **header chip** / sheet, not the plus menu.

### 2.8 Tests the build must add (security)

- `set_mode` from UI never called when `status!=='ready'`.
- `/plan` / `/plan execute` on `prompt:submit` → 400/403; no Pi prompt.
- `isRuntimeOperation({ type:'set_mode', mode:'executing-plan' }) === false` (already).
- New `execute_plan` (if shipped) requires host `mode==='plan'`, foreground, ticket, revision.
- Projector: `setStatus`/`pi-remote-plan-mode` produces **zero** transcript blocks.
- Hydrate after fake `setStatus('plan')` shows Plan, not Build.
- Restore-fail fixture: UI not Build; tools still blocked.
- Keyboard: Tab does not call `setMode`; Shift+Tab in plan opens sheet, does not POST until confirm.
- Redaction: plan item containing `/Users/…` still `[REDACTED_PATH]` after append.

---

## 3. Divergent / minority ideas (do not converge)

1. **Phone can enter plan only; execute is host-TUI-only.** Strictest read-only remote. Matches “foreground authority” and avoids a second mutation family. Fast UX for plan; slower for handoff.
2. **Shift+Tab enters plan; leaving plan requires a **typed** confirm (`BUILD`) in the sheet.** Hostile to Claude-speed, strong against pocket/keyboard accidents.
3. **Bind OpenCode’s unmodified Tab** inside the textarea. Faster for Folio/Magic Keyboard users; **fails** FKA and WCAG 2.1.2 unless Esc is documented as “leave field.” Reject unless an explicit a11y exception is accepted.
4. **Plan-mode tool results never leave the host.** Phone sees `tool_call` names + redacted summaries only (`inputSummary` already exists). Kills read-exfil; hurts “watch the agent think.” Closest to true remote least-privilege.
5. **Kimi-style plan file on host; phone gets a redacted outline (item titles), full body only after an authenticated `plan:read` with a fresh ticket.** Extra round-trip; better for screenshot/pasteboard.
6. **Model `EnterPlanMode` (Kimi) on the phone as an approval card**, same lease machinery as tools. Lets the agent *ask* for plan; never auto-enter. Opposite of Cline issue 10497.
7. **Treat `set_mode` as an exact-action lease** (digest of `{session, epoch, mode}`) rather than runtime.control. Heavier; unifies with approvals; probably overkill for on/off, right-sized for execute.
8. **Blur + `document.visibilityState` wipe of in-memory tool_result buffers** when backgrounded. Reduces app-switcher screenshots; jarring UX.
9. **No Tab affordance at all in v1.** Hardware hint only (“use + → Plan”). Lowest a11y/security risk; misses the stated Tab goal.
10. **Dual-key: Hold ⌘ (or Control) + Tab** to avoid FKA collision. iOS Control/Command mapping on third-party keyboards is unreliable ([SOURCE: Gadget Hacks iOS shortcuts](https://ios.gadgethacks.com/how-to/tired-of-tapping-use-an-external-keyboard-on-your-iphone-and-unlock-tons-of-keyboard-shortcuts-0385569/)).

---

## 4. Open questions + risks

1. **Can Pi RPC set plan mode without a `prompt`?** If not, RuntimeService must mark those prompts non-transcript and non-LLM (slash handled as command, not steered as chat). Unverified against a live Pi child in this pass ([SOURCE: `docs/quality/pi-remote-full-access-runtime-baseline.md`](docs/quality/pi-remote-full-access-runtime-baseline.md) still pending `/plan` smoke).
2. **Does Pi treat `/plan execute` in a normal user prompt as the extension command even when mixed with prose?** If yes, a jailbreak-shaped message is Path B. Fail closed: reject any message with a leading `/plan` token from the phone.
3. **`executing-plan` vs approval family:** after execute, `filesystem`/`process` leases still apply if `PI_REMOTE_MUTATION_ENABLED=1`. Confirm execute does not imply accept-edits. Risk: operators equate “Run plan” with “auto-approve.”
4. **Read-exfil:** should plan-mode `cat` of `.env` / `id_rsa` be extension-blocked (OpenCode `read: *.env → ask`) in addition to relay redaction? Extension change is outside the PWA slice but is the real control.
5. **iOS 26 visualViewport** after keyboard dismiss mis-places fixed chrome ([SOURCE: https://developer.apple.com/forums/thread/800154](https://developer.apple.com/forums/thread/800154)). A new header chip can be clipped; not a security bug, but a confirm sheet can be un-tappable — fail closed by not sending execute if the sheet never resolved.
6. **Rate-limit DoS:** 30 `runtime.control` / min. A jammed Tab (if mis-bound) burns the window; Shift+Tab+sheet avoids this.
7. **Session resume / relay restart:** in-memory tickets and device keys die; Pi child may still be in plan. Hydrate-without-`/plan status` is the desync. Must be in the hydrate spec.
8. **Mobbin Claude iOS is not Claude Code.** Matching “Claude iOS” visually without copying Claude Code’s **control/chat split** would ship a pretty toggle on an unsafe wire.
9. **Kimi Code is a CLI**, not an iPhone app. Do not copy Kimi chat’s plus→photo upload ([SOURCE: existing Luna notes on Kimi help](https://www.kimi.com/zh-cn/help/new-user-guide/overview)) into Pi Remote.
10. **Truncation vs redaction:** adding a `truncated` reason requires a policy-version discussion (v1 is shipped). Until then, drop or collapse tool_result in the **projector**, which does not need a policy bump if the stored payload is already shorter and still redacted.

---

## 5. Sources

### This repo

- `extensions/pi-remote-plan/src/index.ts` — tool strip, bash allowlist, `on`/`off`/`execute`/`status`, fail-closed restore  
- `extensions/pi-remote-plan/tests/plan-mode.test.ts` — execute restores `rm`; restore fail stays restricted  
- `apps/pi-remote-relay/src/runtime/runtime-service.ts` — `/plan on|off` via prompt; 4s confirm; revision CAS  
- `apps/pi-remote-relay/src/runtime/plan-status.ts` — `pi-remote-plan-mode`; unknown/error mapping  
- `apps/pi-remote-relay/src/store/redaction.ts` — policy v1 + allowlist projectors  
- `apps/pi-remote-relay/src/store/transcript-projector.ts` — `extension_ui_request` → `kind: 'plan'`; prompt text projection  
- `apps/pi-remote-relay/src/prompt/prompt-service.ts` — unfiltered message; redacted publish  
- `apps/pi-remote-relay/src/commands/command-service.ts` — `plan` allowed; `isSlashCommandAllowed` unused on submit  
- `apps/pi-remote-relay/src/http/server.ts` — 16 KiB, 20 prompts/min, 30 controls/min, foreground socket  
- `apps/pi-remote-relay/src/auth/policy.ts` — `runtime:control`  
- `packages/pi-rpc-protocol/src/types.ts` / `guards.ts` / tests — `set_mode` ∈ {build, plan} only  
- `apps/pi-remote-web/src/runtime.ts` — non-optimistic reducer  
- `apps/pi-remote-web/src/SessionComposer.tsx` / `RuntimeStrip.tsx` — toggle; executing-plan as planActive; Enter/Tab gap  
- `apps/pi-remote-web/src/App.tsx` — enrollment-only file input; plan/tool renderers  
- `docs/security.md`  
- `docs/feature-catalog/transport-and-state/canonical-redaction.md`  
- `docs/feature-catalog/auth-and-boundary/one-use-tickets.md`  
- `docs/feature-catalog/approval-and-mutation/mutation-containment.md`  
- `docs/feature-catalog/command-and-push/vapid-content-free-push.md`  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`  
- `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`

### Official / standards

- https://code.claude.com/docs/en/permission-modes  
- https://code.claude.com/docs/en/permissions.md  
- https://code.claude.com/docs/en/desktop  
- https://www.kimi.com/help/kimi-code/cli-work-modes  
- https://www.kimi.com/resources/kimi-code-cheat-sheet  
- https://opencode.ai/docs/agents  
- https://docs.cline.bot/core-workflows/plan-and-act  
- https://developer.apple.com/design/human-interface-guidelines/alerts  
- https://developer.apple.com/design/human-interface-guidelines/action-sheets  
- https://support.apple.com/guide/iphone/ipha4375873f/ios  
- https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html  
- https://www.w3.org/WAI/WCAG22/Understanding/on-input.html  
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html  
- https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload  
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html  
- https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0083/  
- https://mas.owasp.org/MASTG/knowledge/ios/MASVS-PLATFORM/MASTG-KNOW-0076/

### GitHub / prior art

- https://github.com/MoonshotAI/kimi-code  
- https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/reference/kimi-command.md  
- https://github.com/sst/opencode/blob/c7b35342/packages/opencode/src/agent/agent.ts  
- https://github.com/threehymns/opencode-webui  
- https://github.com/dibstern/conduit  
- https://github.com/cline/cline  
- https://github.com/cline/cline/issues/10497  
- https://github.com/cline/cline/pull/12054  
- https://unpkg.com/@mariozechner/pi-coding-agent@0.68.0/docs/tui.md  
- https://app.unpkg.com/@mariozechner/pi-coding-agent@0.68.0/files/examples/extensions/plan-mode/index.ts  
- https://cdn.jsdelivr.net/npm/@mariozechner/pi-coding-agent@0.64.0/dist/core/extensions/types.d.ts  

### Mobbin (public flows; MCP not available this pass)

- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS text chat  
- https://mobbin.com/explore/flows/d386db15-c86c-4c9e-916a-68e2b84251e1 — Claude iOS image attach  
- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS coding input  

### Secondary

- https://dev.to/rulestack/claude-code-plan-mode-what-it-actually-blocks-what-still-runs-and-what-approving-switches-you-22m3  
- https://developer.apple.com/forums/thread/800154 — iOS 26 visualViewport after keyboard  
- https://github.com/anthropics/claude-code/issues/61501 — desktop mode picker vs engine  

**Bottom line for the build:** keep the ink-on-parchment Plan chip and a **Shift+Tab** (not Tab) affordance, but the UX is only “flawless” if Path B (`/plan` via composer) is closed, `unknown`/`executing-plan` stop impersonating Build/Plan, execute is a confirmed ticketed control (or host-only), and plan-mode reads are redacted/truncated before they hit the phone ledger. The toggle already calls `set_mode`; the leak is the **prompt channel**, not the missing key.
