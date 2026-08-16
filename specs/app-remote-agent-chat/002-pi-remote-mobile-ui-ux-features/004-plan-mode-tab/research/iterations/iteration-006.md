<!-- provenance: external-CLI orchestration pass; original file iter-06-grok.md -->
> **Source pass 6** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-6-grok.md`.

<!-- F4-plan-mode-tab | model=grok | lens=prior-art-github | iter 6/10 | 2026-08-15T19:27:13.371Z -->

# Prior-art GitHub pass — plan-mode entry/exit + Tab affordance (iteration 6)

**Lens:** remote-CLI / terminal / coding-agent chat apps and mobile clients on GitHub (plus official docs those repos cite).  
**Constraint this pass respects:** Pi Remote is an installable iPhone PWA (React 19 + Vite + Tailwind 4 + react-aria-components). Mutations are ticketed, revision-checked, fail-closed. Host/extension enforces plan. Soft keyboards have no Tab.

**Mobbin access this pass:** Code Mode MCP catalog was empty; `https://mobbin.com/apps/claude-ios` timed out. Mobile visual claims below are therefore grounded in official Claude mobile docs, GitHub issue screenshots of the Claude iOS Code tab, and OpenCode Manager’s published PWA docs — not live Mobbin screen IDs.

---

## 1. Findings for this lens

### 1.1 The field is not one “Tab toggle.” It is four incompatible models

Shipped GitHub/docs implementations disagree on what “plan mode” *is*. Copying the wrong model into Pi Remote will produce a fast toggle that still fails the handoff.

| Model | What the control actually changes | Canonical GitHub / docs | Keyboard | Handoff |
|---|---|---|---|---|
| **A. Permission-mode cycle** | One enum: Manual / Accept edits / Plan / Auto / Bypass | [anthropics/claude-code](https://github.com/anthropics/claude-code) via [permission-modes](https://code.claude.com/docs/en/permission-modes) | `Shift+Tab` (Windows historically `Alt+M`) | Approving a plan **exits plan** and lands in the permission mode the approve option names |
| **B. Primary-agent swap** | Swap the whole agent (tools + prompt + often model) | [anomalyco/opencode](https://github.com/anomalyco/opencode) ([agents](https://opencode.ai/docs/agents/), [keybinds](https://opencode.ai/docs/keybinds/)) | `Tab` / `Shift+Tab` (`agent_cycle` / `agent_cycle_reverse`) | User hits Tab again, then types “implement this” |
| **C. Dual Plan/Act with context carry** | Same conversation, tool mask flips | [cline/cline](https://github.com/cline/cline) ([Plan & Act](https://docs.cline.bot/features/plan-and-act), [CLI interactive](https://github.com/cline/cline/blob/main/docs/cline-cli/interactive-mode.mdx)) | CLI: `Tab`. VS Code webview: `Cmd/Ctrl+Shift+A` | Switch to Act; history is kept; optional per-mode model |
| **D. Dedicated Plan agent + Implement** | Separate chat agent; plan is a file; execute is a named action | [microsoft/vscode-docs](https://github.com/microsoft/vscode-docs/blob/main/docs/copilot/agents/planning.md); [Cursor Plan Mode](https://cursor.com/docs/agent/plan-mode); [openai/codex#4769](https://github.com/openai/codex/pull/4769) | Cursor/Copilot CLI/Codex TUI: `Shift+Tab`. Copilot Chat: agent dropdown + `/plan` | Explicit **Implement / Build** — not merely leaving the mode |

Pi Remote’s protocol is closest to **A∩B with a third host-only state**: `set_mode` accepts only `'build' | 'plan'` ([`packages/pi-rpc-protocol/src/types.ts`](packages/pi-rpc-protocol/src/types.ts)); `executing-plan` is published by the extension after `/plan execute` and is **rejected** as a client operation ([`guards.test.ts`](packages/pi-rpc-protocol/tests/guards.test.ts) asserts `set_mode: executing-plan` is false). The relay maps the client op to a host prompt: `'/plan on'` or `'/plan off'` ([`runtime-service.ts`](apps/pi-remote-relay/src/runtime/runtime-service.ts)). That is not Claude’s approve-and-land, not Copilot’s Implement, and not OpenCode’s agent swap.

**Do not collapse `plan` and `executing-plan` in the segmented control.** Today both `SessionComposer` and `RuntimeStrip` set `planActive = mode === 'plan' || mode === 'executing-plan'`, so the toggle cannot represent the handoff the extension already implements.

### 1.2 Target-bar apps: Claude iOS Code tab vs Kimi Code CLI (they are not the same UX)

**Claude iOS (Code tab)** is a remote client, not a local agent. Official mobile docs: cloud sessions expose **Accept edits / Plan / Auto** in a **mode dropdown**; Remote Control sessions expose **Manual / Accept edits / Plan**; Bypass is never selectable from the app; Auto is not selectable for Remote Control ([Claude Code on mobile](https://code.claude.com/docs/en/mobile); [permission-modes → Web/mobile](https://code.claude.com/docs/en/permission-modes)). The same page places the control **next to the prompt box**, not inside a buried menu. Desktop/VS Code use a **mode indicator at the bottom of the prompt box** with labels Manual / Edit automatically / Plan / Auto ([permission-modes](https://code.claude.com/docs/en/permission-modes)).

Claude iOS GitHub issues confirm the composer is the fragile surface: dictation leaves the keyboard covering Send ([#61930](https://github.com/anthropics/claude-code/issues/61930)); a growing textarea plus keyboard hides the previous message with no dismiss/scroll ([#16503](https://github.com/anthropics/claude-code/issues/16503)). Matching Claude’s bar therefore means: **mode control visible beside the composer, not only in `+`**, and **composer height must not eat the transcript or the primary action**.

Claude CLI status copy is load-bearing: `⏸ plan mode on`, `⏵⏵ accept edits on`, `⏸ manual mode on` ([permission-modes](https://code.claude.com/docs/en/permission-modes)). Plan is **not sticky** in the desktop selector: picking Plan applies to the current session only; Manual/Auto persist per folder ([permission-modes](https://code.claude.com/docs/en/permission-modes)). Approving a plan **exits plan** into Auto / accept-edits / bypass depending on the option ([permission-modes](https://code.claude.com/docs/en/permission-modes)). `/plan` as a **prompt prefix** applies plan to one prompt without changing the session ([permission-modes](https://code.claude.com/docs/en/permission-modes); [DEV write-up of the cycle](https://dev.to/rulestack/claude-code-plan-mode-what-it-actually-blocks-what-still-runs-and-what-approving-switches-you-into-22m3)).

**Kimi Code** (the other named bar) is a **binary toggle**, not a cycle: `Shift-Tab` on/off; `/plan on|off|view|clear`; `kimi --plan`; `default_plan_mode`; AI may call `EnterPlanMode` ([Kimi work modes](https://www.kimi.com/help/kimi-code/cli-work-modes); [interaction.md](https://github.com/MoonshotAI/kimi-cli/blob/8283d785/docs/en/guides/interaction.md); [cheat sheet](https://www.kimi.com/resources/kimi-code-cheat-sheet); [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code)). When active: prompt becomes `📋` and a **blue `plan` badge** appears in the status bar. Handoff is an **`ExitPlanMode` approval panel**: Approve (or pick Option A/B), Reject (stay in plan), Revise, Reject-and-Exit; `Ctrl-E` opens a fullscreen pager ([interaction.md](https://github.com/MoonshotAI/kimi-cli/blob/8283d785/docs/en/guides/interaction.md)). YOLO / auto-permissions are **orthogonal** (`/yolo`, `/auto`) — not members of the plan cycle ([cheat sheet](https://www.kimi.com/resources/kimi-code-cheat-sheet)).

Pi Remote already matches Kimi’s binary `/plan on|off` more than Claude’s five-way cycle. Matching Claude iOS still requires a **persistent, composer-adjacent Plan chip**, which the in-repo council note already specified and the current `+` popover does not deliver ([`council-gpt-sol.md`](docs/design-reference/mobile-chat-apps/council-gpt-sol.md): “When Plan is active, show one compact `Plan · read-only` status chip beside `+`”).

### 1.3 Closest GitHub mobile/PWA remotes (same job as Pi Remote)

These are the actual prior-art clients: phone UI over a host agent, often via Tailscale.

**Happy — [slopus/happy](https://github.com/slopus/happy)** (Expo iOS/Android + web; App Store “Happy - Claude Code Client”). Permission mode is a **single enum** `default | acceptEdits | bypassPermissions | plan | read-only | safe-yolo | yolo`. The mobile control is `PermissionModeSelector`: **tap-to-cycle** through `['default','acceptEdits','plan','bypassPermissions']` with a haptic ([commit bb7a117](https://github.com/slopus/happy/commit/bb7a1173c39f6db07963d4a3adc38be5ea2493fd)). Labels/icons in that commit: Default = “Ask for permissions” / shield; Accept Edits = create icon; Plan = list icon “Plan before executing”; Bypass = flash “Yolo”. **Issue [#961](https://github.com/slopus/happy/issues/961)** is the structural warning: modeling plan and bypass as one enum makes them mutually exclusive; Claude can run `--dangerously-skip-permissions` *while* in plan. Pi Remote’s fail-closed posture should keep **workflow mode (build/plan) orthogonal to any future approval policy** — do not add YOLO into the same segmented control. Handoff: `PermissionFooter` special-cases `ExitPlanMode` / `exit_plan_mode` with “Yes, allow everything during this session” ([PR #1017](https://github.com/slopus/happy/pull/1017), [commit ccc24cf](https://github.com/slopus/happy/commit/ccc24cfae58e27de49568b02acc6e883eb84aa60)). That YOLO-after-approve path **conflicts** with this app’s ticketed fail-closed rule; the reusable piece is the **dedicated ExitPlanMode sheet**, not the bypass button.

**OpenCode Manager — [chriswritescode-dev/opencode-manager](https://github.com/chriswritescode-dev/opencode-manager)** (React + Vite PWA; closest stack twin). Features list a **Plan/Build Mode Toggle**. Chat docs: toggle lives in the **chat header**, Plan = read-only, Build = full access ([chat](https://chriswritescode-dev.github.io/opencode-manager/features/chat/)). Mobile docs are explicit: *“Mobile keyboards have limited shortcut support. Use the toolbar buttons instead: … Toggle modes with the mode selector.”* iOS PWA install is Safari-only; 44×44 pt targets; Enter on mobile **closes the keyboard and sends** ([mobile](https://chriswritescode-dev.github.io/opencode-manager/features/mobile/)). Keyboard-shortcut table for the web UI lists Enter / Shift+Enter / ↑ / `/` / `@` / Escape — **no Tab, no Shift+Tab**. That is the honest PWA answer: **visible selector is the product; shortcuts are desktop-only.**

**OpenCode Mobile — [dzianisv/opencode-mobile](https://github.com/dzianisv/opencode-mobile)** (React Native / Expo, Tailscale/ngrok). Ships streaming, diffs, **tool-call approval**, biometric unlock. README does **not** document a Plan/Build toggle. Tradeoff: per-tool approval can substitute for a mode, but it is slower than a session-level read-only lock (which Pi already has in [`extensions/pi-remote-plan`](extensions/pi-remote-plan/src/index.ts)).

**Rove — [AleksandreJavakhishvili/Rove](https://github.com/AleksandreJavakhishvili/Rove)** (Expo + web, Tailscale, Claude Agent SDK). Approval prompts as **bottom sheets**; diffs inline. No documented plan-mode control. Tradeoff: zero-cloud Tailscale path matches Pi Remote; mode UX is underspecified.

**remote-agent — [d-kimuson/remote-agent](https://github.com/d-kimuson/remote-agent)** (SPA/PWA, `npx … serve --tailscale`). Provider table includes **`pi-coding-agent`**. PWA-over-Tailscale is the recommended install. No documented plan toggle in the README excerpt; the prior art is **installable HTTPS PWA on the tailnet**, not the mode widget.

**GhostTerm — [chengwaye/ghostterm](https://github.com/chengwaye/ghostterm)** (mobile web terminal, Tailscale, node-pty). Killer feature is the opposite of this app: one-tap `claude --dangerously-skip-permissions` because tapping “y” on a phone is tedious. **Do not copy.** It proves remote UIs that omit a persistent read-only mode will push users toward bypass.

**247 — [QuivrHQ/247-claude-code-remote](https://github.com/QuivrHQ/247-claude-code-remote)** (Next 15 + xterm.js + tmux PWA). Full terminal, not a chat composer. Mode switching then becomes **sending `Shift+Tab` into the PTY**. That is a different product; Pi Remote is structured RPC, not a tty.

**CCR Expo — [gldc/claude-code-remote-app](https://github.com/gldc/claude-code-remote-app)** (Expo, Tailscale). Session CRUD, live stream, **tool approval**, slash commands. Again: approval, not plan-mode.

**ai-or-die — [animeshkundu/ai-or-die](https://github.com/animeshkundu/ai-or-die)** (commit [a52ecad](https://github.com/animeshkundu/ai-or-die/commit/a52ecadb4ee46677b8687dbda4d59f4a4066f14a)). The most useful *iPhone* finding in this pass: **two input modes**. Compose = keyboard up, native textarea, extra-keys bar for specials. Control = keyboard down, keys panel sends bytes without focusing the terminal (no flicker). Completeness test: every TUI key (Esc, Ctrl+C, **Tab = `\t`, Shift+Tab = `\x1b[Z`**, arrows) has a reachable affordance. Claude Code issue [#13300](https://github.com/anthropics/claude-code/issues/13300) documents the same failure from iPad SSH (Prompt 3 / WebSSH): **Shift+Tab / Ctrl chords do not survive soft keyboards.** If Pi Remote ever needed to drive a TUI, it would need this extra-keys bar. Because Pi Remote uses RPC `set_mode`, the extra-keys lesson still applies: **Tab must have a visible twin.**

### 1.4 Desktop/TUI agents (what Tab/Shift+Tab actually bind to)

**OpenCode TUI** ([anomalyco/opencode](https://github.com/anomalyco/opencode)): `agent_cycle: "tab"`, `agent_cycle_reverse: "shift+tab"` ([keybinds](https://opencode.ai/docs/keybinds/)). Same JSON also binds `prompt.autocomplete.complete: "tab"`. That collision is real: GitHub issues report Tab moving focus or firing twice; Desktop v1.18 hid the Plan/Build toggle until Settings → **Show agent** ([#37070](https://github.com/anomalyco/opencode/issues/37070), [#37430](https://github.com/anomalyco/opencode/issues/37430)). Docs intro: switch with Tab; indicator in the **lower right**; switch back with Tab then ask it to make the changes ([opencode.ai/docs](https://opencode.ai/docs/)). Plan agent: `edit`/`bash` default to **ask** or **deny** depending on doc vintage ([agents](https://opencode.ai/docs/agents/); older [open-code.ai modes](https://open-code.ai/en/docs/modes) listed write/edit/patch/bash disabled). OpenCode School warns Plan is **an instruction, not a hard sandbox** ([opencode.school/agents](https://opencode.school/lessons/agents/)). Pi Remote’s extension is the opposite: it **strips `edit`/`write` and blocks non-allowlisted bash** ([`extensions/pi-remote-plan/src/index.ts`](extensions/pi-remote-plan/src/index.ts)). Keep that; do not regress to prompt-only.

**Claude Code TUI:** `Shift+Tab` cycles `default → acceptEdits → plan` (then optional bypass, then auto). From auto, first press returns to default. Status bar strings above. Windows: years of `Shift+Tab` vs `Alt+M` breakage ([#3390](https://github.com/anthropics/claude-code/issues/3390), [#17304](https://github.com/anthropics/claude-code/issues/17304), [#17344](https://github.com/anthropics/claude-code/issues/17344), [#18144](https://github.com/anthropics/claude-code/issues/18144)). **Do not ship a shortcut that only works on one keyboard layout.**

**Cline:** VS Code webview shortcut is **hardcoded** `Meta+Shift+A`, not a VS Code keybinding — Linux/Windows Meta is Super, so the shortcut silently dies ([#8974](https://github.com/cline/cline/issues/8974), fix [PR #9614](https://github.com/cline/cline/pull/9614) maps Meta→Ctrl off-Mac). CLI: `Tab` = Plan/Act, `Shift+Tab` = auto-approve ([interactive-mode.mdx](https://github.com/cline/cline/blob/main/docs/cline-cli/interactive-mode.mdx)). Per-mode models and `/deep-planning` ([Plan & Act](https://docs.cline.bot/features/plan-and-act)). Lesson: **do not bind Meta on iOS**; Command is `metaKey`, Control is `ctrlKey`, and iOS will also steal Tab (below).

**Roo Code — [RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code):** five personas (Code / Ask / Architect / Debug / Orchestrator). Switch: dropdown left of chat, slash `/architect` etc., or **⌘/. / Ctrl+.** cycle ([using-modes](https://docs.roocode.com/basic-usage/using-modes)). Architect: `read` + `mcp` + **markdown-only edit**. Sticky model per mode. This is a **cycle of many modes**, not a binary. ⌘+. is Apple-legal (custom shortcut with Command) and does not steal Tab.

**Cursor:** `Shift+Tab` from chat input **rotates** to Plan; also mode picker; “Click to build” ([plan-mode](https://cursor.com/docs/agent/plan-mode)). Auto-suggests Plan on complex-task keywords. Plans are files (home dir, optional “Save to workspace”). Handoff is **Build**, not toggle-off.

**Copilot:** Chat **Plan agent** in the agents dropdown or `/plan …`; plan saved under session memory / `.copilot/plans/`; **Implement plan** hands off to Agent ([vscode-docs planning.md](https://github.com/microsoft/vscode-docs/blob/main/docs/copilot/agents/planning.md); [VS Plan agent](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-plan-agent)). Copilot CLI: `Shift+Tab` in/out of plan; `ask_user`; dedicated plan panel ([GitHub changelog 2026-01-21](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/)).

**Codex — [openai/codex](https://github.com/openai/codex):** PR [#4769](https://github.com/openai/codex/pull/4769) added TUI Plan Mode: `Shift+Tab` (BackTab) toggle; Enter in plan submits a **read-only planning turn** and **stays in plan** across turns; `/plan-model` for planner model/effort; implement = Shift+Tab off then “start with step 1”. Later, **Codex App abandoned Shift+Tab because it stole focus** — maintainer: *“Shift-tab created problems for accessibility”*; replacement `⌘⇧P`, which users then could not discover ([#10991](https://github.com/openai/codex/issues/10991), [#11157](https://github.com/openai/codex/issues/11157), [#32147](https://github.com/openai/codex/issues/32147)). **This is the single most important keyboard finding for an iPhone PWA using react-aria-components:** stealing Tab/Shift+Tab from focus order will fail WCAG 2.1.1 / 2.4.3 and iOS Full Keyboard Access. Codex already paid that cost.

**Gemini CLI — [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli):** [`docs/cli/plan-mode.md`](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md). `Shift+Tab` cycles Default → Auto-Edit → Plan; **Plan is removed from the rotation while processing or showing confirmation**. `/plan [goal]` **switches and submits**. Agent can call `enter_plan_mode` / `exit_plan_mode`. Approve options include auto-accept vs manual. **Non-interactive exit switches to YOLO** — incompatible with Pi Remote’s fail-closed default. Plan writes only under a plans directory; `Ctrl+X` opens the plan in `$EDITOR`. Model routing: Pro while planning, Flash while implementing. Hooks on `enter_plan_mode` **do not fire** for keyboard/`/plan` toggles — only agent-initiated transitions.

**Continue — [continuedev/continue](https://github.com/continuedev/continue):** Plan sits between Chat (no tools) and Agent (all tools); built-in tools filtered to read-only; **MCP tools are not filtered** ([how-it-works.mdx](https://github.com/continuedev/continue/blob/main/docs/ide-extensions/plan/how-it-works.mdx)). Execution = switch to Agent. The MCP hole is a warning: Pi’s extension must keep blocking `edit`/`write`/mutating bash even if MCP is added later.

**Crush — [charmbracelet/crush](https://github.com/charmbracelet/crush):** [PR #2822](https://github.com/charmbracelet/crush/pull/2822) / [discussion #2947](https://github.com/charmbracelet/crush/discussions/2947). Plan is prompt-critical-rules plus a question tool; community insisted on a **hard write block except `~/.crush/plans`**. End of plan: *ask the user to switch to code mode and confirm*. Prompt-only plan is weaker than Pi’s host filter.

**Aider — [Aider-AI/aider](https://github.com/Aider-AI/aider):** `/ask` `/code` `/architect` `/help`; prompt prefix changes (`ask>`, `architect>`). Architect is **not read-only** — it is a two-model execute pipeline ([modes.md](https://github.com/Aider-AI/aider/blob/5dc9490b/aider/website/docs/usage/modes.md)). Do not name Pi’s mode “Architect” if it is read-only.

**pi itself — Mario Zechner:** *“pi does not and will not have a built-in plan mode”*; file-based plans; `--tools read,grep,find,ls` for a crude read-only mask ([post](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)). Pi Remote’s extension is therefore **product surface the upstream CLI refused**. Treat `/plan execute` as the first-class handoff the CLI omitted.

### 1.5 iPhone + PWA + RAC: Tab is a hostile key

Facts, not taste:

1. **iOS software keyboards have no Tab.** OpenCode Manager documents this and routes to a mode selector ([mobile](https://chriswritescode-dev.github.io/opencode-manager/features/mobile/)).
2. **Hardware Tab is often never delivered to a focused `<textarea>` on iOS.** Documented for Bluetooth keyboards: Tab is captured for form navigation; Option+Tab may reach JS ([Stack Overflow / stackguides](https://stackguides.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event)). WKWebView OpenRadar [24071444](https://github.com/lionheart/openradar-mirror/issues/7090): Tab and cursor keys fire no `keydown`/`keypress` on contenteditable.
3. **PWAs cannot hide or replace the iOS accessory bar** (Prev/Next = Tab/Shift+Tab, Done) ([Ionic keyboard guide](https://ionicframework.com/docs/developing/keyboard); [rdar://27763084](https://openradar.appspot.com/27763084)). Native `UIKeyCommand` Command-hold HUD ([WWDC20 10109](https://developer.apple.com/videos/play/wwdc2020/10109/), [HIG Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)) **does not exist in Safari/PWA**. Discoverability must be on-screen.
4. **Apple HIG:** Tab / Shift-Tab **navigate controls**; do not repurpose standard shortcuts; custom shortcuts should use Command; support Full Keyboard Access; on iPadOS avoid making buttons Tab-stops — FKA does that ([HIG Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards) via [everest.mt mirror](https://apple-docs.everest.mt/docs/design/human-interface-guidelines/keyboards/); [agent-skills keyboards.md](https://github.com/christophacham/agent-skills-library/blob/main/skills/git/hig-inputs/references/keyboards.md)).
5. **WCAG 2.1.1 Keyboard (A):** all functionality operable via a keyboard interface; follow platform conventions as a best practice; F54 = pointer-only handlers ([Understanding 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)). A mode switch that exists only as a Tab steal, with no focusable control, fails both HIG and WCAG.
6. **Codex App explicitly dropped Shift+Tab for a11y** ([#10991](https://github.com/openai/codex/issues/10991)).
7. **react-aria-components** (this stack) uses Tab for focus. `ToggleButtonGroup` in `ComposerTools` already participates in that. Binding Tab globally will fight RAC.
8. **Blink.sh** ([blinksh/blink](https://github.com/blinksh/blink)): Smart Keys extra bar is **shown with the software keyboard and hidden with a hardware keyboard** ([docs.blink.sh](https://docs.blink.sh/)); hardware users get Command-hold shortcuts. Pi Remote should invert that: **soft keyboard → visible Plan chip; hardware keyboard → chip + optional Tab/Shift+Tab if the event actually arrives.**

### 1.6 How other mobile chat apps signal a distinct mode (composer-adjacent, not buried)

Without live Mobbin: ChatGPT’s composer is documented as a **capability switcher** (Think / Research / tools in a dropdown; active tools as dismissible chips) vs Claude consumer chat as **context-first** ([AI UX Playground](https://aiuxplayground.substack.com/p/claude-vs-chatgpt-a-deep-dive-into)). Claude **Code** on iOS breaks that pattern: it **does** expose a mode dropdown next to the prompt ([mobile](https://code.claude.com/docs/en/mobile)). Kimi CLI uses a **status-bar badge + prompt glyph**, not a composer chip ([interaction.md](https://github.com/MoonshotAI/kimi-cli/blob/8283d785/docs/en/guides/interaction.md)). Happy uses a **tappable mode control with icon+label**, not a two-segment Build/Plan ([bb7a117](https://github.com/slopus/happy/commit/bb7a1173c39f6db07963d4a3adc38be5ea2493fd)). OpenCode Manager puts the selector in the **chat header** ([chat](https://chriswritescode-dev.github.io/opencode-manager/features/chat/)).

For ink-on-parchment: a **clay chip that appears only when Plan is host-confirmed** matches Claude Code’s “Plan is session-only / visually exceptional” rule and the council note, without a permanent Build/Plan strip.

### 1.7 Plan → execute handoff: prior art vs this repo

| Product | Exit of plan | What happens to tools | User confirmation |
|---|---|---|---|
| Claude | Approve options **or** Shift+Tab leave without approving | Lands in Auto / acceptEdits / bypass / manual | Required for execute; Shift+Tab leave is silent |
| Kimi | `ExitPlanMode` panel | Leaves plan; executes chosen path | Approve / Reject / Revise |
| Gemini | Approve (auto or manual edits) | Non-interactive → YOLO | Required in TUI |
| Copilot / Cursor | **Implement / Build** | New agent/mode runs the plan file | Required |
| Codex TUI | Shift+Tab off, then user types “start with step 1” | Restores write sandbox | Implicit |
| Cline | Tab to Act | Same thread, tools restored | None beyond the toggle |
| OpenCode | Tab to Build | Agent swap | None |
| Continue | Switch to Agent | Tool list restored | None |
| Happy | ExitPlanMode footer | Optional yolo | Required |
| **Pi Remote (host)** | `/plan execute` restores captured tools, publishes `executing-plan`; `/plan off` restores and returns to `build` | Host-enforced | **Client has no execute UI** |

Relay `set_mode` only sends `/plan on` or `/plan off`. There is **no** `runtime.control` op for execute. A flawless handoff therefore needs either (a) a ticketed prompt `/plan execute` after user confirmation, or (b) a new `set_mode`-class op that the protocol currently forbids for `executing-plan`. (a) matches existing slash-command insertion; (b) is cleaner but is a protocol change.

Mario’s file-based-plan argument still applies: if execute only flips tools and does not attach a plan artifact, the agent can “execute” with no plan. Gemini/Copilot/Kimi all treat the **plan file + approve** as the handoff object. Pi Remote’s transcript already has a `plan` block type in the council TurnEvidenceStack list — promote that card and hang **Run plan** on it.

---

## 2. Concrete spec contribution (build-phase executable)

### 2.1 States (host-authoritative; no optimistic labels)

| `runtime.state.mode` | Visible | Composer chrome | `setMode` | Tab shortcut |
|---|---|---|---|---|
| `build` | No chip. `+` > Mode shows Build selected | Default parchment tray | enabled if `runtime.status === 'ready'` | toggles to plan |
| `plan` | Chip `Plan · read-only` (clay `#d97757` on bone; dark: clay that still meets AA vs carbon) | Tray hairline uses clay 1px; placeholder unchanged | enabled | toggles to build (`/plan off`) |
| `executing-plan` | Chip `Plan running` (clay, quiet pulse opacity 1.0↔0.72, 1200ms, `prefers-reduced-motion: no pulse`) | Same clay hairline; primary action unchanged | **disabled** | **no-op**; announce “Plan is running” |
| `unknown` / parse error | Chip `Plan · unknown` + `role="alert"` | Controls disabled | disabled | no-op |
| `runtime.status` `pending` | Chip stays at last **confirmed** mode; trailing `Applying…` in `aria-live="polite"` | Both segments disabled | disabled | no-op |
| `checking` / `stale` / `error` | No mode mutation | Match existing RuntimeStrip disable rules | disabled | no-op |

`set_mode` remains `{ mode: 'build' | 'plan' }` only. Never send `executing-plan`.

### 2.2 Entry / exit (touch)

1. **Persistent chip (required to match Claude iOS + council).** When `mode` is `plan` or `executing-plan`, render a chip **immediately right of `+`**, 44×32 pt min, `Button` from RAC. Tap (if not executing-plan) opens the same Mode popover as `+` > Mode. Chip is **not** a silent toggle — Claude iOS uses a dropdown, Happy uses tap-to-cycle; for two values a popover with two `ToggleButton`s is clearer than cycling.
2. **`+` popover** keeps the existing `ToggleButtonGroup` (`selectionMode="single"`, `disallowEmptySelection`). Relabel Plan button: idle `Plan`; confirmed plan `Plan · read-only`. Do not mark Plan selected for `executing-plan`; show a third disabled row `Plan running` instead.
3. **Slash:** inserting `/plan ` remains. Do not auto-submit (existing CommandPalette contract).
4. **Fail-closed:** on `setMode` rejection / timeout (“plan mode was not confirmed by the host”), keep previous confirmed chip, surface the existing `tools-status` / `runtime-status` error string, do not flip the segment.

### 2.3 Hardware-keyboard Tab affordance (iPhone PWA)

**Product rule:** Tab is a *bonus* for Magic Keyboard / Folio sessions. The chip is the real control. If `keydown` for Tab never arrives, the feature is still complete.

**Bind Shift+Tab as the primary chord, Tab as a gated secondary.** Rationale: Claude, Kimi, Cursor, Copilot CLI, Gemini CLI, and Codex TUI all standardized on **Shift+Tab**; OpenCode’s bare Tab collides with autocomplete and RAC focus; Codex App had to *remove* Shift+Tab from a GUI for a11y. On a PWA we cannot show the iOS Command HUD, so the chip tooltip/title must name the chord.

Implementation (composer `<textarea>` + RAC `useKeyboard` on the tray, not `window`):

```
if runtime.status !== 'ready' or mode is executing-plan or pending: ignore
if slash/command autocomplete open: let Tab complete (OpenCode collision)
if event.key === 'Tab' && event.shiftKey:
  preventDefault(); stopPropagation();
  setMode(mode === 'plan' ? 'build' : 'plan')
if event.key === 'Tab' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey:
  if composer value is empty AND document.activeElement is the textarea:
    preventDefault(); setMode(...)
  else:
    do not steal Tab (indent / focus / FKA)
```

**Why empty-only for bare Tab:** Cline CLI can steal Tab because there is no other focus target. A React Aria dialog + `+` button + chip + send control *is* a focus cycle. Empty composer + Tab ≈ “I am not indenting; I am switching mode,” which is the OpenCode TUI muscle memory without breaking filled-text editing.

**Option+Tab:** if `event.altKey && event.key === 'Tab'` arrives (the iOS Bluetooth workaround), treat it as Shift+Tab. Document it in the chip `title`: `Shift+Tab or Option+Tab — switch Plan`.

**Do not use:** `Meta+Shift+A` (Cline; Meta is unreliable), `Alt+M` (Claude Windows graveyard), `⌘⇧P` (Codex; on iOS that is the share sheet / print-adjacent; undiscoverable in a PWA).

**Hardware detection (optional enhancement):** `navigator.keyboard` is sparse on iOS. Do not hide the chip when a keyboard is attached (Blink hides Smart Keys; that is wrong for a PWA that cannot offer a Command HUD).

### 2.4 Plan → execute handoff

New composer-adjacent action, visible **only** when `mode === 'plan'` **and** the latest turn contains a `plan` block (or `/plan status` says a plan exists):

- Chip overflow / long-press, **and** a primary text button on the plan card: **`Run plan`**.
- Activation sends a ticketed prompt `/plan execute` (same path as other prompts; redaction unchanged). Do not invent `set_mode: executing-plan`.
- Until host publishes `executing-plan` or returns `build`, show pending on that button only.
- After `executing-plan`: chip `Plan running`; `Run plan` hidden; mode toggle disabled.
- **No YOLO / bypass** option on this sheet (reject Happy #1017 and Gemini non-interactive YOLO). If the user wants tools back without executing, they choose **Build** (`/plan off`), which restores tools without the execute flag.

Optional second action on the plan card: **Keep planning** (no-op, focus composer) — Kimi’s Reject-stay-in-plan.

### 2.5 A11y

- Chip: `role="button"`, `aria-pressed={mode==='plan'}`, name `Plan mode, read-only` / `Plan running` / `Plan mode unknown`.
- Mode group: keep `aria-label="Build or Plan"`.
- `aria-live="polite"` on a single status node: `Plan mode on, read-only.` / `Build mode on.` / `Plan running.` / `Could not change mode.`
- Do not use `aria-live="assertive"` for successful toggles.
- Focus: after popover close, return focus to textarea (existing command-insert pattern). After Tab shortcut, keep focus in textarea.
- Contrast: clay `#d97757` on `#f8f8f6` for filled chip text needs a **carbon label on clay fill** or **clay outline + carbon text** — clay-on-bone as *text* may miss AA; use clay as fill and carbon (`#1a1a1a` or current ink token) as label. Dark: invert (clay outline, bone text) and re-check AA.
- Touch: 44×44 for `+` and chip (OpenCode Manager; HIG).
- Reduced motion: no pulse on `Plan running`.
- VoiceOver: chip before textarea in accessibility order so the mode is discoverable without opening `+`.

### 2.6 Visual / motion (fixed DS)

- Chip: 1px carbon/10 hairline, 999px pill, Inter 12/14 medium, clay fill at 12% in light / 18% in dark, clay left-edge 2px bar (Kimi’s “badge” without a blue token).
- Enter plan: chip `transform: scale(0.96→1)` 160ms `ease-out`; tray border-color interpolates to clay 160ms. No layout jump: chip is `width: auto` but reserved `min-width: 0` with `+` not shifting more than 8px (use `flex` with chip in-flow).
- Exit plan: reverse; chip unmounts after 120ms.
- Pending: chip opacity 0.6, no label change.
- Do not recolor the whole screen. Distinct mode = chip + hairline, matching Claude’s prompt-box indicator, not a theme swap.

### 2.7 Gestures (iPhone)

| Input | Action |
|---|---|
| Tap chip | Open Mode popover |
| Long-press chip (plan only) | Action sheet: Keep planning / Switch to Build / Run plan (if plan artifact) |
| Tap `+` > Mode | Existing segmented control |
| Swipe on composer | **None** for mode (avoid conflict with iOS edge-swipe / OpenCode Manager’s 30px left-edge back swipe) |
| Hardware Shift+Tab / empty Tab / Option+Tab | §2.3 |
| Soft keyboard | No Tab; chip is sufficient (OpenCode Manager) |

---

## 3. Divergent / minority ideas (do not converge yet)

1. **Refuse bare Tab entirely.** Ship only Shift+Tab + chip. Codex’s a11y reversal plus iOS FKA plus RAC is a strong case. Empty-Tab is a compromise with OpenCode muscle memory; it may still fail WCAG focus order.
2. **Happy tap-to-cycle chip, no popover.** One control, haptic, cycles Build↔Plan. Faster thumb; worse than a two-state group for a11y (`aria-pressed` vs mystery cycle). Fits 44pt better than a segmented control in the tray.
3. **Header selector (OpenCode Manager)** instead of composer chip. Frees the tray; loses Claude’s “mode lives next to Send” pattern; competes with the centered model title already in `SessionHeader`.
4. **Plan as a document pane, not a mode.** Copilot/Cursor/Gemini: plan file + Implement. Pi already has plan blocks. Minority: entering “plan” only *creates* a plan card; Build/Plan toggle goes away; **Run plan** is the only execute. Aligns with Mario’s “no plan mode, just a file.”
5. **`/plan` one-shot prefix (Claude)** without flipping session mode. Useful for “plan this one question.” Would need host support beyond `/plan on`.
6. **Agent-initiated `EnterPlanMode` (Kimi/Gemini)** with an accept/decline sheet. Powerful; conflicts with “asking Claude to change permission mode doesn’t work” ([permission-modes](https://code.claude.com/docs/en/permission-modes)). For Pi, only safe if the extension exposes a tool the host already gates.
7. **Extra-keys bar (ai-or-die / Blink Smart Keys)** with a `Plan` key above the software keyboard. PWA cannot replace the accessory bar, but a **custom row above the tray** (not the system accessory) can host Plan / `/` / `@`. Costs vertical space on 390px; Claude iOS already loses Send under the keyboard.
8. **⌘+. cycle (Roo)** instead of Tab. HIG-legal; PWA may receive `metaKey + '.'` from a hardware keyboard. Completely non-obvious without a HUD.
9. **Default to Plan (OpenCode School, Gemini “Plan Mode is enabled by default”).** Matches fail-closed; fights “fast build” users. Could be a session-start choice, not a hidden default.
10. **Orthogonal axes (Happy #961, Claude #5466):** Mode ∈ {build, plan} × Approval ∈ {ask, accept-reads, …}. Do not merge. Pi should not grow a YOLO segment.
11. **Per-mode model (Cline, Roo sticky, Codex `/plan-model`, Gemini Pro→Flash).** Out of scope for this feature but the chip could later show `Plan · Opus`. Do not switch models implicitly in v1 (violates host-confirmed labels).
12. **Aider prompt-prefix `plan>`** in the placeholder. Cheap signal; clashes with `Reply to Pi`.
13. **Live Activity / Dynamic Island for `Plan running`.** Native-only; PWA cannot. Skip.
14. **GhostTerm-style skip-permissions for remote.** Explicitly anti-spec.
15. **Drive the TUI over PTY (247 / GhostTerm / ai-or-die)** and send `\x1b[Z` for Shift+Tab. Would duplicate Claude Code remote terminals and throw away RPC fail-closed. Not this app.

---

## 4. Open questions + risks

1. **Does iOS Safari in an installed PWA deliver `Tab` `keydown` to a focused textarea at all?** Prior art says often no. Must be measured on a real iPhone + Magic Keyboard before calling the Tab affordance done. Fallback: chip-only is still spec-complete.
2. **Should execute be a new RPC op?** Today `/plan execute` is a prompt. A ticketed `runtime.control` would be cleaner but `executing-plan` is intentionally not a client-settable mode. Risk: treating execute as `setMode('build')` would restore tools **without** the executing-plan status the extension publishes.
3. **Plan artifact detection.** Without a reliable `plan` block or `/plan status` payload, `Run plan` cannot be gated and users will execute an empty plan. Confirm what the host emits.
4. **`waitForMode` timeout vs slash `/plan`.** Relay waits for host `setStatus`. If Tab fires twice (OpenCode bug class), two ticketed mutations race. Disable the shortcut while `pending`.
5. **Autocomplete vs Tab.** If `/` palette uses Tab to complete (RAC ComboBox often does), empty-Tab-to-toggle must be off whenever the listbox is open.
6. **WCAG vs muscle memory.** Shipping Tab-as-mode in a RAC app may fail FKA. Decide with a VoiceOver + FKA pass, not with TUI nostalgia.
7. **Claude iOS keyboard covering Send** is a live bug in the target bar. Pi’s tray must use `visualViewport` (OpenCode Manager; Ionic) so chip + send stay above the keyboard.
8. **Mobbin gap.** Re-run screen capture when Mobbin MCP OAuth is available: Claude iOS Code tab composer, ChatGPT iOS tool chips, Kimi iOS if a Code client exists (consumer Kimi thinking-effort is **not** plan mode).
9. **Kimi iOS app ≠ Kimi Code.** Do not copy the consumer thinking-effort sheet as plan UX.
10. **Continue’s MCP-not-filtered hole** and OpenCode School’s “Plan is not a sandbox”: keep the extension as the authority; UI is only a mirror.

---

## 5. Sources

### GitHub repos (clients / agents)

- https://github.com/anomalyco/opencode  
- https://github.com/sst/opencode/pull/1049 (Shift+Tab reverse cycle; `switch_mode` compatibility)  
- https://github.com/chriswritescode-dev/opencode-manager  
- https://github.com/dzianisv/opencode-mobile  
- https://github.com/slopus/happy  
- https://github.com/slopus/happy/issues/961  
- https://github.com/slopus/happy/pull/1017  
- https://github.com/slopus/happy/commit/bb7a1173c39f6db07963d4a3adc38be5ea2493fd  
- https://github.com/slopus/happy/commit/ccc24cfae58e27de49568b02acc6e883eb84aa60  
- https://github.com/d-kimuson/remote-agent  
- https://github.com/AleksandreJavakhishvili/Rove  
- https://github.com/QuivrHQ/247-claude-code-remote  
- https://github.com/gldc/claude-code-remote-app  
- https://github.com/chengwaye/ghostterm  
- https://github.com/animeshkundu/ai-or-die/commit/a52ecadb4ee46677b8687dbda4d59f4a4066f14a  
- https://github.com/cline/cline  
- https://github.com/cline/cline/issues/8974  
- https://github.com/cline/cline/pull/9614  
- https://github.com/RooCodeInc/Roo-Code  
- https://github.com/continuedev/continue  
- https://github.com/continuedev/continue/blob/main/docs/ide-extensions/plan/how-it-works.mdx  
- https://github.com/google-gemini/gemini-cli  
- https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md  
- https://github.com/openai/codex  
- https://github.com/openai/codex/pull/4769  
- https://github.com/openai/codex/issues/10991  
- https://github.com/openai/codex/issues/11157  
- https://github.com/openai/codex/issues/32147  
- https://github.com/MoonshotAI/kimi-code  
- https://github.com/MoonshotAI/kimi-cli  
- https://github.com/MoonshotAI/kimi-cli/blob/8283d785/docs/en/guides/interaction.md  
- https://github.com/Aider-AI/aider  
- https://github.com/Aider-AI/aider/blob/5dc9490b/aider/website/docs/usage/modes.md  
- https://github.com/charmbracelet/crush/pull/2822  
- https://github.com/charmbracelet/crush/discussions/2947  
- https://github.com/microsoft/vscode-docs/blob/main/docs/copilot/agents/planning.md  
- https://github.com/anthropics/claude-code/issues/3390  
- https://github.com/anthropics/claude-code/issues/5466  
- https://github.com/anthropics/claude-code/issues/13300  
- https://github.com/anthropics/claude-code/issues/16503  
- https://github.com/anthropics/claude-code/issues/17304  
- https://github.com/anthropics/claude-code/issues/17344  
- https://github.com/anthropics/claude-code/issues/18144  
- https://github.com/anthropics/claude-code/issues/61930  
- https://github.com/blinksh/blink  
- https://github.com/blinksh/blink/discussions/1941  
- https://github.com/blinksh/blink/issues/1513  
- https://github.com/lionheart/openradar-mirror/issues/7090  

### Official docs / design

- https://code.claude.com/docs/en/permission-modes  
- https://code.claude.com/docs/en/interactive-mode  
- https://code.claude.com/docs/en/mobile  
- https://opencode.ai/docs/  
- https://opencode.ai/docs/keybinds/  
- https://opencode.ai/docs/agents/  
- https://opencode.school/lessons/agents/  
- https://chriswritescode-dev.github.io/opencode-manager/features/chat/  
- https://chriswritescode-dev.github.io/opencode-manager/features/mobile/  
- https://docs.cline.bot/features/plan-and-act  
- https://github.com/cline/cline/blob/main/docs/cline-cli/interactive-mode.mdx  
- https://docs.roocode.com/basic-usage/using-modes  
- https://cursor.com/docs/agent/plan-mode  
- https://www.kimi.com/help/kimi-code/cli-work-modes  
- https://www.kimi.com/resources/kimi-code-cheat-sheet  
- https://learn.microsoft.com/en-us/visualstudio/ide/copilot-plan-agent  
- https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/  
- https://aider.chat/docs/usage/modes.html  
- https://mariozechner.at/posts/2025-11-30-pi-coding-agent/  
- https://developer.apple.com/design/human-interface-guidelines/keyboards  
- https://apple-docs.everest.mt/docs/design/human-interface-guidelines/keyboards/  
- https://developer.apple.com/videos/play/wwdc2020/10109/  
- https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html  
- https://ionicframework.com/docs/developing/keyboard  
- https://docs.blink.sh/  
- https://openradar.appspot.com/27763084  
- https://stackguides.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event  
- https://dev.to/rulestack/claude-code-plan-mode-what-it-actually-blocks-what-still-runs-and-what-approving-switches-you-into-22m3  
- https://aiuxplayground.substack.com/p/claude-vs-chatgpt-a-deep-dive-into  
- https://blog.sondera.ai/p/claude-codes-plan-mode-isnt-read  

### Mobbin

- Attempted: https://mobbin.com/apps/claude-ios (timeout this pass). Re-query when Mobbin MCP is authenticated: Claude iOS **Code** tab composer + mode dropdown; ChatGPT iOS composer tool chips; any Kimi **Code** client screens (not consumer chat thinking).

### This repo (ground truth, not prior art)

- `apps/pi-remote-web/src/SessionComposer.tsx` — `+` popover Build/Plan; `planActive` includes `executing-plan`  
- `apps/pi-remote-web/src/RuntimeStrip.tsx` — same collapse  
- `extensions/pi-remote-plan/src/index.ts` — `/plan` `on|off|execute|status`; tool strip; fail-closed restore  
- `apps/pi-remote-relay/src/runtime/runtime-service.ts` — `set_mode` → `/plan on|off` + `waitForMode`  
- `packages/pi-rpc-protocol/src/types.ts` — `set_mode` only `'build' | 'plan'`  
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md` — Plan chip + `Plan running`
