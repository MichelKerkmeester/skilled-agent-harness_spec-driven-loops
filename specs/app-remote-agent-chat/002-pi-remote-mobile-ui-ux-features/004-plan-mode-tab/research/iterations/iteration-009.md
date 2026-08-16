<!-- provenance: external-CLI orchestration pass; original file iter-09-grok.md -->
> **Source pass 9** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-9-grok.md`.

<!-- F4-plan-mode-tab | model=grok | lens=competitive-teardown | iter 9/10 | 2026-08-15T19:39:36.532Z -->

# Iteration 9 — Competitive teardown: plan-mode entry/exit, status, Tab, and plan→execute

Lens: how Claude iOS, Kimi Code, ChatGPT, Perplexity, DeepSeek, Gemini, and Meta AI (plus coding-agent prior art) actually signal a distinct mode, expose a hardware-keyboard affordance, and hand off plan → execute. Grounded in first-party docs, this repo’s current composer, published Mobbin flow/screen URLs, and GitHub remote-CLI clients. Mobbin MCP was not attached in this session (empty MCP catalog), so Mobbin citations are public flow/screen URLs, not pixel-measured MCP captures.

---

## 1. Findings for this lens

### 1.1 Pi Remote’s current gap, in competitor terms

The live composer is already Claude-shaped: one tray, `+` at left (`2.5rem` / 40px circle), morphing circular send at right. Build/Plan lives **inside** that `+` popover as a `ToggleButtonGroup` labeled “Build or Plan,” and Plan’s selected label becomes `Plan · read-only` when `state.mode === 'plan'`. `executing-plan` is treated as plan-active for selection, but there is **no persistent chip**, **no keyboard handler for Tab / Shift+Tab**, and **no plan→execute sheet**. The textarea only intercepts Enter (send) / Shift+Enter is not special-cased (Enter without Shift submits). [SOURCE: `apps/pi-remote-web/src/SessionComposer.tsx`] [SOURCE: `apps/pi-remote-web/src/style.css` `.composer-plus`]

The protocol is stricter than the UI: `set_mode` accepts only `'build' | 'plan'`. `executing-plan` is a host-published `RuntimeMode`, not a client-writable operation. Execute is a separate extension command (`/plan execute`) that restores tools and publishes `executing-plan`. Toggling the segmented control to Build is **exit without execute**. [SOURCE: `packages/pi-rpc-protocol/src/types.ts` `RUNTIME_MODES`, `RuntimeOperation`] [SOURCE: `extensions/pi-remote-plan/src/index.ts`]

The in-repo design council already specified the Claude-like missing piece and it is **not shipped**: Build implicit; when Plan is on, one compact `Plan · read-only` chip beside `+`; `executing-plan` shows as `Plan running` and disables mode changes. [SOURCE: `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`]

That is the same silhouette Claude’s consumer Research mode and Claude Code’s mobile mode dropdown both use: **quiet default, loud when the dangerous/slow mode is on, host-confirmed, not optimistic.**

---

### 1.2 Two different “Claude iOS” products — do not mix them

**A. Consumer Claude chat (non-Code)** has no coding Plan mode. Distinct capabilities are **Web search**, **extended thinking**, and **Research**. Official help: tap `+` at bottom-left, then **Research**. “A blue indicator will appear on the bottom of the chat window. Click the indicator again to disable research.” Research requires web search on; it is paid (Pro/Max/Team/Enterprise) on web, Desktop, and Mobile. [SOURCE: https://support.claude.com/en/articles/11088861-use-research-on-claude] [SOURCE: https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research]

Sequence (consumer Research):

1. Composer idle: `+` only; no Research chrome.
2. Tap `+` → sheet/menu → **Research**.
3. Blue **persistent indicator** docks to the bottom of the chat window (composer-adjacent, not a transcript card).
4. User sends a normal prompt. Claude runs a multi-search agentic loop (minutes, citations).
5. Tap the blue indicator to exit. No Tab. No plan-approval card. Exit is instantaneous and local to the client toggle.

Get-started copy also documents `+` **or** typing `/` for extra options; model + effort + thinking live in the **header model control on mobile**, not in the composer. [SOURCE: https://support.claude.com/en/articles/8114491-get-started-with-claude]

Local teardown (~390pt): composer radius ~22–26px; `+` left; mic + **40–44pt circular primary** right; placeholder `Reply to Claude`; send fill ~`#C96F4B` (clay analog). [SOURCE: `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`] [SOURCE: `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`] [SOURCE: https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57] [SOURCE: https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8]

**B. Claude iOS Code tab / Remote Control** *does* have Plan. Official permission-mode doc: “Use the mode dropdown next to the prompt box on claude.ai/code or in the mobile app.” Remote Control sessions expose **Manual, Accept edits, and Plan** (not Auto, not Bypass). Cloud sessions expose **Accept edits, Plan, Auto**. Asking the model in chat does **not** change the mode. [SOURCE: https://code.claude.com/docs/en/permission-modes] [SOURCE: https://code.claude.com/docs/en/mobile]

CLI muscle memory the dropdown replaces: `Shift+Tab` cycles `default` (UI: Manual, status `⏸ manual mode on`) → `acceptEdits` (`⏵⏵ accept edits on`) → `plan` (`⏸ plan mode on`). `/plan` as a **prompt prefix** applies plan to one turn. `Shift+Tab` again leaves plan **without** approving. [SOURCE: https://code.claude.com/docs/en/permission-modes] [SOURCE: https://code.claude.com/docs/en/interactive-mode]

This is the closest shipped analog to Pi Remote: a **phone client driving a local coding agent**, with a **mode control next to the prompt**, and host-enforced read-only. GitHub still records the failure mode Pi must not copy: iOS Remote Control sometimes shows a Plan toggle that **does not propagate**, and ExitPlanMode prompts that only appear on the desktop TTY. [SOURCE: https://github.com/anthropics/claude-code/issues/28427] [SOURCE: https://github.com/anthropics/claude-code/issues/29319]

---

### 1.3 Kimi Code (the coding-agent bar) vs Kimi iOS (the consumer app)

**Kimi Code CLI** is the product that actually has Plan mode. Official help:

| Action | Control |
|---|---|
| Enter | `kimi --plan`, `Shift-Tab`, `/plan` or `/plan on`, or model-initiated `EnterPlanMode` |
| Status | Prompt glyph becomes `📋`; bottom status bar shows a **blue `plan` badge** |
| Tools while planning | Only `Glob`, `Grep`, `ReadFile` — no file writes, no commands |
| Handoff | Agent writes a plan file, then `ExitPlanMode`. Panel: Approve (or pick Plan A/B Recommended) / Reject (stay in plan) / Reject and Exit / Revise. `Ctrl-E` full-screen pager |
| Exit without execute | `/plan off` or `Shift-Tab` |
| Clear | `/plan clear` only while idle |

Exiting Plan still requires confirmation even if YOLO is on; Auto mode auto-approves plan exits and stamps “Auto-approved” in the transcript. [SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes] [SOURCE: https://moonshotai.github.io/kimi-code/en/guides/interaction.html] [SOURCE: https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html] [SOURCE: https://www.kimi.com/resources/kimi-code-cheat-sheet]

Keyboard surface (Kimi Code): `Shift-Tab` = plan toggle; approval panel uses `↑/↓`, `Enter`, `1–9`, `Esc`/`Ctrl-C`/`Ctrl-D` = reject. Status bar also shows YOLO (yellow) and AFK (orange) badges beside the blue plan badge — **mode is a badge cluster, not a composer takeover**. [SOURCE: https://kimi-cli.vercel.app/en/reference/keyboard.html]

**Kimi consumer iOS** (“Kimi – Kimi K3 is Live”) is a different app: Agent / Office Pilot / Swarm, model pills **above** the input (`K3` / `K3 Swarm` / `K2.6`), `+` for files, mic + circular send. It does **not** document Shift-Tab or a coding Plan/Act pair. Do not copy consumer-Kimi’s model strip as Plan status. [SOURCE: https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312] [SOURCE: https://www.kimi.com/help/getting-started/overview] [SOURCE: https://www.kimi.com/zh-cn/help/new-user-guide/overview]

No public Mobbin hit for Kimi iOS composer Plan was found this pass.

---

### 1.4 ChatGPT iOS — token-in-composer, not a permission mode

Study Mode (closest “distinct mode” on consumer ChatGPT iOS):

1. Tap **attachment `+`** → tools sheet → **Study** (or type `@study`; `/study` is documented as an iOS fallback).
2. A **Study token** sits in the composer.
3. Exit: on iOS, **select Study again** in the tools sheet; on desktop web, Backspace/Delete the token or tap `×`.
4. Not available in GPT or Project conversations.

[SOURCE: https://help.openai.com/en/articles/11780217-using-study-mode-in-chatgpt]

That is a **composer token** pattern: mode is an inline chip *inside* the draft field, dismissible like an attachment. It is **not** host-enforced read-only. Thinking (Standard vs Extended) is a separate reasoning-depth toggle on Plus/Pro, not a plan/execute gate. [SOURCE: ChatGPT Thinking Mode mobile rollout coverage, 2025–2026]

**Codex inside ChatGPT iOS** is the coding analog. Official: Plan mode via `/plan [description]` or **Shift+Tab** to cycle collaboration modes. Read-only filesystem permission is a **second axis** (`/permissions` → Read-only), not a synonym for Plan. Handoff copy in the TUI: **“Yes, implement this plan”** (same thread, switch to Default, submit `Implement the plan.`) and, in a later PR, **“Yes, clear context and implement.”** [SOURCE: https://developers.openai.com/codex/learn/best-practices] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/collaboration-mode-templates/templates/plan.md] [SOURCE: https://github.com/openai/codex/pull/17499]

Mobile risk, measured in production: after accept, iOS can keep showing **“Implement this plan?”**, blocking steer even while the checklist is 4/5 done. Compaction has also surfaced that card when Plan was not in use. [SOURCE: https://github.com/openai/codex/issues/23066] [SOURCE: https://github.com/openai/codex/issues/22773] [SOURCE: https://openai.com/index/work-with-codex-from-anywhere/]

Mobbin composer refs (ChatGPT iOS, not Codex-specific): [https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1) · [https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4](https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4) · [https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b](https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b)

---

### 1.5 Gemini iOS — the only consumer app with a literal plan→execute card

Deep Research on iPhone (official):

1. In the text box, tap **Add Files → Deep Research**.
2. Optional Sources (Search default-on; Gmail/Drive gradually rolling out).
3. Type prompt → Submit.
4. Gemini **creates a research plan**.
5. User may **Edit plan**.
6. User taps **Start research**.
7. 5–10 minutes typical; user can leave; **lock-screen notification** when ready; tap **Open**.

[SOURCE: https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en]

This is **not** a session-wide read-only coding mode. It is a **two-step artifact**: plan card in the transcript, then an explicit execute CTA. The in-repo capture `screens/gemini-research-plan.png` is indexed as “Plan card, action row, disclaimer, tool-toggle chip in composer.” Local measurements: composer ~348–356pt wide, ~100–116pt tall, 28–32pt top radius; **blue active search/research pill** on the toolbar after `+`; `Fast` dropdown ~72–88pt wide, 44–48pt high; placeholder in research mode `What do you want to research?`; disclaimer `Gemini is AI and can make mistakes.` [SOURCE: `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`] [SOURCE: `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`]

Later Gemini mobile moved standalone chips into a **Tools** sheet (haptic on tap) listing Deep Research, Canvas, Guided Learning, image/video. After selection, the **active tool remains as a chip** (clearable). [SOURCE: https://9to5google.com/2025/09/15/gemini-tools-redesign-android-ios/] [SOURCE: https://support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DiOS]

Mobbin: [https://mobbin.com/explore/screens/2ec379b4-48e9-46bd-a332-d84086092f78](https://mobbin.com/explore/screens/2ec379b4-48e9-46bd-a332-d84086092f78) (home) · [https://mobbin.com/explore/flows/4d2bf214-4b16-4b9c-b411-353db138d464](https://mobbin.com/explore/flows/4d2bf214-4b16-4b9c-b411-353db138d464) (Live — not Deep Research).

**Gemini CLI** (coding, not the consumer app) *does* match Claude/Kimi: `Shift+Tab` cycles Default → Auto-Edit → Plan; approval **Yes, automatically accept edits** / **Yes, manually accept edits**; Esc cancels. Shift+Tab is removed from the rotation while Gemini is processing or showing a confirmation. [SOURCE: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md]

---

### 1.6 DeepSeek iOS — always-visible dual pills (highest-status, lowest-hide)

DeepSeek’s composer is the category’s most explicit mode UI: a **toggle row above the input pill**, not behind `+`.

Published reconstruction (pt):

| Token | Off | On |
|---|---|---|
| Shape | pill, 999pt radius | same |
| Fill / border / text | `#1A1B1E` / 1pt `#2E2F33` / `#9A9BA0` | `#1E2240` / 1pt `#4D6BFE` / `#4D6BFE` |
| Icon | 14pt (brain / magnifier) | same, recolored |
| Type | Inter 13pt w600 | same |
| Padding | 7pt / 13pt | same |
| Motion | 150ms ease fill+border+text | same |
| Gap | 8pt between pills, 8pt above input | |

Input pill: 50pt tall, 25pt radius, placeholder `Message DeepSeek`. Send: 36pt circle `#4D6BFE` → stop `#E5484D`. [SOURCE: https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/deepseek/DESIGN.md] [SOURCE: https://api-docs.deepseek.com/news/news250115/] [SOURCE: https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349]

2026 V4 behavior: DeepThink is a **thinking parameter on the same model**, not a separate R1 model ID; Search is orthogonal and combinable. No plan file, no execute gate, no Tab. [SOURCE: https://deepseekai.guide/guides/deepseek-on-iphone/]

Mobbin: [https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4](https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4)

For Pi: DeepSeek proves **mode chips can live permanently in the composer** without looking like a settings row — but DeepThink is not a security boundary. Copy the **visibility**, not the semantics.

---

### 1.7 Perplexity iOS — modes appear only when the field is focused

Official-adjacent iPhone guides (consistent across 2026 writeups):

1. Home is a search bar, not a chat tray.
2. **Tap the search bar** → a row appears **above the keyboard**: Focus, **Pro** toggle, attach, voice.
3. Pro must be set **before** submit (blue/highlighted = on).
4. Focus: globe icon → sheet of Academic / YouTube / Reddit / News / Wolfram; swipe left for overflow icons. Default **All**. Hidden when the bar is blurred.
5. Deep Research: `+` / feature selector under the focused field → **Deep Research** → 1–3 min report.

[SOURCE: https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search] [SOURCE: https://wisechecker.com/perplexity-focus-selector-hidden-mobile-show/] [SOURCE: https://perplexityaimagazine.com/perplexity-hub/how-to-use-perplexity-ai-on-iphone/]

Desktop-only extra: `Ctrl+Shift+P` toggles Pro. No iOS Tab. [SOURCE: https://wisechecker.com/perplexity-pro-search-vs-quick-search-key-differences/]

Mobbin: [https://mobbin.com/explore/flows/036b8308-ccd9-4efe-9b47-4d203ff6f53e](https://mobbin.com/explore/flows/036b8308-ccd9-4efe-9b47-4d203ff6f53e) (“Asking Perplexity (Perplexity Research)”) · [https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462](https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462)

Perplexity is a **negative example** for Pi’s “persistent status” goal: Focus/Pro vanish when the keyboard closes. A coding agent’s read-only mode must remain visible **with the keyboard down**.

---

### 1.8 Meta AI iOS — mode as a bottom-right label on the composer

Official: tap **Ask Meta AI…**, then tap **the current mode in the bottom right**, then pick:

- **Instant** — quicker, everyday
- **Thinking** — in-depth / complex reasoning
- **Shopping** — concierge

[SOURCE: https://www.meta.com/help/artificial-intelligence/943942350800511/] [SOURCE: https://apps.apple.com/us/app/meta-ai/id1558240027]

Local capture: composer ~348–356 × 104–120pt, 28–32pt top radius; right cluster `Fast ⌄` pill ~80–92 × 40–44pt → mic 48pt → waveform 48pt; placeholder `Ask anything…`. [SOURCE: `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`] [SOURCE: `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`]

Mobbin: [https://mobbin.com/explore/screens/5d784612-55db-4241-a110-0a5d66cf5711](https://mobbin.com/explore/screens/5d784612-55db-4241-a110-0a5d66cf5711)

Meta’s Instant/Thinking is a **latency/depth** switch, like DeepSeek DeepThink or Claude effort — **not** a write-block. Useful as a layout: a **single 40–44pt labeled pill** at composer-right, always showing the active mode, tapping to switch. Pi already spends that right slot on send/stop; Meta proves a mode pill can sit **immediately left of send**. That conflicts with Claude’s empty-right-except-primary rule. For Pi, left-of-`+` or between `+` and the field is safer.

---

### 1.9 Tab vs Shift+Tab — the industry is split, and iOS is hostile to both

| Product | Key | What it does | Status chrome |
|---|---|---|---|
| Claude Code CLI | **Shift+Tab** (Alt+M on some Windows) | Cycle Manual → acceptEdits → plan (then optional bypass/auto) | `⏸ plan mode on` |
| Kimi Code | **Shift+Tab** | Toggle plan on/off | `📋` prompt + blue `plan` badge |
| OpenAI Codex | **Shift+Tab** | Cycle collaboration modes including Plan | mode indicator |
| Gemini CLI | **Shift+Tab** | Default → Auto-Edit → Plan | status; disabled during confirmations |
| Qwen Code | **Shift+Tab** (Tab on Windows) | plan → default → auto-edit → auto → yolo | `⏸ plan mode` |
| **Cline TUI / VS Code** | **Tab** | Toggle **Plan / Act** | Plan/Act in status; **Shift+Tab** is auto-approve |

[SOURCE: https://code.claude.com/docs/en/interactive-mode] [SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes] [SOURCE: https://developers.openai.com/codex/learn/best-practices] [SOURCE: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md] [SOURCE: https://qwenlm.github.io/qwen-code-docs/en/users/features/approval-mode/] [SOURCE: https://docs.cline.bot/usage/tui] [SOURCE: https://github.com/cline/cline/blob/fd8cecdd/docs/cline-cli/interactive-mode.mdx] [SOURCE: https://docs.cline.bot/core-workflows/plan-and-act]

Cline is the only major coding agent that uses **bare Tab** for Plan/Act. That is the literal reading of this feature’s “Tab affordance.” Claude/Kimi/Codex — the stated target bar — all use **Shift+Tab**. Binding bare Tab on iPhone would fight:

- **No Tab key on the iOS software keyboard.** Prev/next arrows in the keyboard accessory do **not** emit `keydown` Tab. [SOURCE: https://stackoverflow.com/questions/38385197/how-to-prevent-tab-action-triggered-by-ios-uikeyboard-arrows]
- **Hardware Tab is focus navigation.** HIG: Tab moves among focus groups; Shift+Tab moves backward. Full Keyboard Access on iPhone: Tab = move forward, Shift+Tab = move backward, Space = activate. [SOURCE: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection] [SOURCE: https://support.apple.com/en-au/guide/iphone/ipha4375873f/ios] [SOURCE: https://support.apple.com/guide/ipad/use-shortcuts-ipaddf61a0c2/ipados]
- **Safari/WebKit often does not deliver Tab to a focused textarea** with a Bluetooth keyboard; the document may see it, the input may not. [SOURCE: https://stackoverflow.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event]
- WWDC21: if an app’s custom Tab command collides with the focus system, remap it or set `wantsPriorityOverSystemBehavior` (UIKit only — **unavailable to a Safari PWA**). [SOURCE: https://developer.apple.com/videos/play/wwdc2021/10260/]

Remote-CLI PWAs that actually need Tab on a phone **draw a fake Tab key**:

- `claude-remote-controller`: “mobile keys bar adds ESC / **TAB** / CTRL / ALT / Ctrl-C / Ctrl-Z / arrows”; first-run chooser for Bypass / Default / **Plan**. [SOURCE: https://github.com/Arose-Niazi/claude-remote-controller]
- `d-kimuson/remote-agent`: PWA over Tailscale HTTPS; “model and mode controls” in the UI, not a key steal. [SOURCE: https://github.com/d-kimuson/remote-agent]
- `Kujirafu/AgentRune`: Android command center with a **Plan panel** and `planMode` synced to CLI flags. [SOURCE: https://github.com/Kujirafu/AgentRune]

None of the consumer AI apps (Claude chat, ChatGPT, Gemini, Perplexity, DeepSeek, Meta AI) bind Tab or Shift+Tab on iOS. Keyboard-mode switching is a **coding-agent TUI** convention that Claude’s own iOS Code tab replaced with a **dropdown next to the prompt**.

---

### 1.10 Plan → execute: four incompatible handoff models

Pi currently has (3) plus a hidden (1):

| Model | Who | Handoff UI | Lands in |
|---|---|---|---|
| **1. Approve-and-switch-permission** | Claude Code `ExitPlanMode` | `Yes, and use auto mode` / `Yes, auto-accept edits` / `Yes, and bypass permissions` · `Yes, manually approve edits` · `No, keep planning`. `Ctrl+G` edits the plan file. Approving **exits plan** into the named permission mode. Plan is a staging area, not a home. Desktop: Plan pick is **session-only, not sticky**. | `auto` / `acceptEdits` / `default` |
| **2. Approve-or-revise panel** | Kimi Code `ExitPlanMode` | Approve / pick Plan A–B / Reject (stay) / Reject and Exit / Revise. Number keys 1–9. YOLO still confirms plan exit. | implementation, still in agent mode |
| **3. Mode toggle, context carries** | Cline Plan ↔ Act | **Tab** (or bottom toggle). No approval modal required. History carries over. Optional separate Plan vs Act models. `/deep-planning` for large tasks. | Act, same thread |
| **4. Artifact card then CTA** | Gemini Deep Research; Codex ` <proposed_plan>` + “Implement this plan?” | Gemini: **Edit plan** → **Start research**. Codex: do not ask “should I proceed?” in prose; the client renders the block and the user leaves Plan or taps implement. Second path: clear context then implement. | research run / Default collab mode |

[SOURCE: https://code.claude.com/docs/en/permission-modes] [SOURCE: https://www.kimi.com/help/kimi-code/cli-work-modes] [SOURCE: https://docs.cline.bot/core-workflows/plan-and-act] [SOURCE: https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS] [SOURCE: https://github.com/openai/codex/blob/main/codex-rs/collaboration-mode-templates/templates/plan.md]

Pi’s extension already implements Kimi-like **on / off / execute / status**, but the PWA only exposes on/off via `set_mode`. `execute` is unreachable except by typing `/plan execute` in the command combo. That is the functional hole relative to Claude iOS Code + Kimi Code.

Security constraint unique to this app: execute must stay **ticketed, revision-checked, fail-closed, host-confirmed**. Codex’s stale “Implement this plan?” card is the anti-pattern: a client card that outlives host state. Pi’s `waitForMode` already rejects if the host does not confirm within timeout (`plan mode was not confirmed by the host`). The execute CTA must wait for `executing-plan` the same way. [SOURCE: `apps/pi-remote-relay/src/runtime/runtime-service.ts`] [SOURCE: https://github.com/openai/codex/issues/23066]

---

### 1.11 Category pattern language (what “flawless” actually copies)

Across the seven consumer apps, a **distinct mode** is signaled by **one persistent composer-adjacent chip**, never by a stacked settings row:

| App | Hidden entry | Visible-while-on | Clear |
|---|---|---|---|
| Claude chat Research | `+` → Research | Blue indicator, bottom of chat | Tap indicator |
| Claude Code iOS | Mode dropdown next to prompt | Dropdown label Plan / Manual / Accept edits | Pick another mode |
| ChatGPT Study | `+` tools sheet / `@study` | Study token in composer | Toggle again / delete token |
| Gemini Deep Research | Tools / Add Files | Blue tool chip + plan card in transcript | Chip `×` / finish report |
| DeepSeek DeepThink | *(not hidden)* | Filled blue pill above field | Tap pill off |
| Perplexity Pro/Focus | Appear on focus only | Row above keyboard | Blur / toggle off |
| Meta Instant/Thinking | Bottom-right mode label | The label itself | Pick another mode |

Coding-agent extras the consumer set lacks: **Shift+Tab**, **status-bar badge**, **ExitPlanMode numbered panel**, **session-only Plan (not sticky)**.

Pi’s council spec (chip beside `+`, Build implicit) is exactly Claude Research + Claude Code dropdown, translated into ink-on-parchment. The unshipped work is that chip, a hardware-keyboard twin of Shift+Tab (not Tab), and a host-confirmed execute sheet.

---

## 2. Concrete spec contribution (build-phase executable)

Design tokens stay locked: canvas bone `#f8f8f6` / dark inverse; ink carbon; accent clay `#d97757`; Inter UI / Source Serif 4 prose; WCAG AA. Clay-on-bone is **~2.8:1** — **do not use clay text on parchment**. Clay is a 2pt leading bar, a 6pt status dot, or the send fill only.

### 2.1 States (host-authoritative; no optimistic labels)

| State id | Host `RuntimeStateDto.mode` | Composer chrome | Mode control | Primary send |
|---|---|---|---|---|
| `S0_build` | `build` | No chip. Placeholder `Reply to Pi` | `+` → Mode → Build selected | send / steer / stop as today |
| `S1_pending_enter` | previous, `runtime.status === 'pending'` | Chip skeleton, `aria-busy` | Both toggles disabled | unchanged |
| `S2_plan` | `plan` | Chip **Plan · read-only** | Plan selected; chip reopens menu | send stays send (read-only is host-side) |
| `S3_plan_ready` | `plan` + plan artifact in transcript (when the host/extension exposes one) | Chip + **Execute** on the plan card | same as S2 | send = revise (“keep planning”) |
| `S4_pending_execute` | pending toward `executing-plan` | Chip **Plan · applying…** | disabled | disabled |
| `S5_executing` | `executing-plan` | Chip **Plan running** | disabled until host leaves this mode | steer/stop only |
| `S6_pending_exit` | pending toward `build` | Chip remains until confirm | disabled | unchanged |
| `S7_stale_or_error` | `unknown` / runtime `stale`/`error` | Chip **Plan · host unverified** or hide chip | disabled; “Unavailable — reconcile” | fail closed |

`setMode('plan'|'build')` remains the only composer mutation. **Never** `set_mode: 'executing-plan'` (protocol rejects it). Execute = existing `/plan execute` through the same ticketed prompt path as slash commands, then wait for host `executing-plan`. If wait times out, stay on `plan`, announce error, do not flip the chip. [SOURCE: `packages/pi-rpc-protocol/src/types.ts`] [SOURCE: `extensions/pi-remote-plan/src/index.ts`]

### 2.2 Layout (390pt session, React Aria)

Keep `SessionComposer` tray. Add **one** chip in `.composer-left` **after** `.composer-plus` (40×40px already).

Chip (`PlanStatusChip`):

- Visual height 32pt, **hit target 44×44pt** (padding, not a smaller glyph).
- Radius 999pt (match plus/send).
- Hairline `var(--line)`; 2pt clay leading bar; Inter 13pt w600 carbon `Plan · read-only`.
- Dark: same bar, ink inverted; still AA on the dark canvas.
- Hidden in `S0_build`. Visible `S2–S6`.
- `aria-pressed={true}` in S2/S3; `aria-disabled` in S4–S6; `aria-keyshortcuts="Shift+Tab"`; `aria-label="Plan mode, read-only. Opens mode menu."`
- Tap/Space: reopen the existing tools `Popover` with Mode focused (`autoFocus` on the Plan `ToggleButton`).
- Do **not** add a second segmented control on the tray (that recreates `RuntimeStrip`).

Plan card (S3, Gemini/Kimi hybrid, only if the transcript already has a `plan` block type):

- Parchment surface, 16pt radius, 16pt padding, Source Serif title ~20pt, Inter body 16/24.
- Actions, 44pt min, clay **Execute plan** (filled) + outline **Keep planning** + quiet **Exit plan**.
- Execute → insert/submit `/plan execute` via the existing command path (do not invent a new RPC).
- Keep planning → focus textarea, placeholder `Revise the plan…`.
- Exit plan → `setMode('build')` (restore tools, no execute).

### 2.3 Gestures and keyboard

| Input | Binding | Notes |
|---|---|---|
| Touch | `+` → Mode → Plan/Build | Keep current `ToggleButtonGroup`, `disallowEmptySelection` |
| Touch | Chip tap | Reopen mode menu |
| Touch | Plan card Execute / Keep / Exit | §2.2 |
| Hardware keyboard, composer focused | **Shift+Tab** | Toggle `plan` ↔ `build` IFF `runtime.status === 'ready'` and mode is not `executing-plan`. `preventDefault` **only** when the listener actually handles it |
| Hardware keyboard | **Tab** (no Shift) | **Do not handle.** Let WebKit/VoiceOver/Full Keyboard Access move focus |
| Hardware keyboard | `/plan` `on`/`off`/`execute` | Already in command combo |
| Software keyboard | none | No Tab key; chip is the affordance |
| Discoverability | After first successful Shift+Tab | One-shot Inter 12pt hint under disclaimer: `⇧⇥ Plan` — never persistent chrome |

Implementation (this stack): attach the listener with **capture on `window`**, not only the textarea — iOS often swallows Tab on focused inputs. Ignore the event unless `document.activeElement` is `#session-prompt` or inside `.composer-tray`. Require `event.shiftKey && event.key === 'Tab'`. Skip if `event.repeat`. Skip if Full Keyboard Access is likely (`event.metaKey` / `event.altKey` already down). React Aria: do not put `Tab` in `Keyboard` on the `ToggleButtonGroup` (that group already uses arrow keys per ARIA radio). [SOURCE: https://stackoverflow.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event] [SOURCE: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection]

Optional hardware-keyboard detection for the hint only: first `keydown` with `event.key` length === 1 or `'Tab'`/`'Shift'` while `matchMedia('(hover: hover) and (pointer: fine)').matches` is **not** reliable on iPhone + Magic Keyboard; prefer “show hint once after Shift+Tab succeeds.”

### 2.4 Motion

- Chip mount/unmount: 150ms ease opacity + 6pt clip (DeepSeek toggle timing), `prefers-reduced-motion: reduce` → 0ms.
- Mode change: no tray height jump; chip width may animate 150ms.
- Pending: Inter 12pt `Applying…` in the existing `role="status"` live region (RuntimeStrip already has this pattern); 1.5s pulse on the clay bar, 4.5:1 still holds because the bar is decorative, text stays carbon.
- Execute: plan card primary button shows the same spinner glyph as send (`SpinnerGlyph`), then the card yields to `S5` chip.

### 2.5 Accessibility

- WCAG 2.1.1 Keyboard: Plan reachable without Tab-as-command (chip is in tab order after `+`).
- 2.1.2 No Keyboard Trap: Shift+Tab must not eat Tab; VoiceOver rotor and FKA keep Tab.
- 2.4.7 Focus Visible: existing 2px `var(--focus)` outline on plus/chip (`style.css` already).
- 4.1.2 Name, Role, Value: `ToggleButtonGroup` `aria-label="Build or Plan"` stays; chip `role="button"` + pressed.
- 3.2.2 On Input: changing mode **must not submit** the draft (today’s popover already doesn’t).
- Live region: on confirmed enter, polite `Plan mode on, read-only`. On execute, `Executing plan`. On fail, assertive `Plan change not confirmed`.
- Contrast: chip text carbon on bone; do not color the word Plan in clay.
- 200% zoom: chip may wrap to a second composer-bar row **before** send wraps; send stays 40×40 on the trailing edge.

### 2.6 Interaction sequences (acceptance)

**Enter, thumb only**

1. `S0`, tap `+` (40×40).
2. Popover, section Mode, tap Plan.
3. Buttons disable; status `Applying…`.
4. Host confirms `plan` → chip appears; popover may close; VoiceOver hears the live region.
5. Fail → no chip, assertive error, selection snaps back to Build.

**Enter, Magic Keyboard**

1. Focus `#session-prompt`.
2. Shift+Tab → same pending/confirm as above.
3. If WebKit never fires the event (common): chip/`+` still work; no silent failure besides the missing shortcut.

**Execute**

1. In `S2`/`S3`, user reviews the plan in the transcript.
2. Tap **Execute plan** (or `/plan execute`).
3. `S4` until host `executing-plan`; chip **Plan running**; Mode locked.
4. When host returns to `build` (or a later defined post-execute mode), chip dismisses. Do **not** client-timeout into Build.

**Exit without execute**

1. Chip → Mode → Build, or Shift+Tab from `S2`.
2. Same pending/confirm. Tools restore on host; if restore fails, extension stays in plan and publishes `error` — UI must remain on Plan (`plan-mode.test.ts` “stays in plan mode when restoring tools fails”). [SOURCE: `extensions/pi-remote-plan/tests/plan-mode.test.ts`]

**Soft keyboard**

1. iPhone IME open: no Tab, no Shift+Tab.
2. Chip (if on) and `+` remain above `env(safe-area-inset-bottom)` and the IME (visual viewport).

---

## 3. Divergent / minority ideas (do not converge yet)

1. **Cline-style bare Tab = Plan/Act.** Matches the feature title literally. Conflicts with FKA/VoiceOver and iOS WebKit Tab delivery. Only viable if limited to `navigator.userAgent` desktop and never iPhone.
2. **On-screen TAB key** in a 44pt accessory row (ESC / TAB / ⇧⇥ / CTRL) as in `claude-remote-controller`. Ugly next to Claude composure; best-in-class for TTY parity and the only reliable “Tab” on a software keyboard.
3. **DeepSeek always-on Plan pill**, even in Build, labeled `Build` | `Plan` as two pills above the field. Highest discoverability; the council explicitly rejected stacking this in the reading path. A *single* idle `Plan` outline pill (tap to enter) is the compromise DeepSeek would pick.
4. **ChatGPT Study token** inside the textarea (`Plan` as a backspace-deletable chip). Hardware-keyboard native; disastrous with IME composition and with Pi’s `/command` combo.
5. **Gemini two-step only** (no session mode): every plan is a card with Edit / Start. Fights the already-shipped host session mode and the extension’s sticky `plan` until `/plan off`.
6. **Codex split axes**: Plan (collaboration) × Read-only (permissions). Pi already fused them. Splitting would mean a Plan chip *and* a lock glyph — more honest if bash classifier holes appear, more chrome than Claude iOS.
7. **Meta mode label left of send** (`Plan ⌄` 80×44pt). Steals the send cluster; Claude’s morphing primary is the silhouette authority.
8. **Perplexity reveal-on-focus**: Mode row only while the IME is up. Fails the persistent-status requirement the moment the keyboard closes.
9. **Kimi numbered 1–9 execute panel** as a full-screen sheet. Excellent for hardware keyboards; heavy for a 390pt PWA. A three-button card is enough unless plans grow Plan A/B paths.
10. **Cline separate Plan vs Act models.** Out of scope (host model is already a header Select) but a future `setModel` on execute is a real Kimi/Cline move.
11. **AI-initiated `EnterPlanMode`.** Kimi/Claude allow the model to request plan. Pi’s extension has no such tool. Adding it would need a permission prompt on the phone — the exact Remote Control bug Claude still has.
12. **Sticky vs session-only Plan.** Claude Desktop: Plan is **not** remembered per folder; Manual/Auto are. Pi’s extension keeps `mode` in process memory for the session — already session-only. Do not persist Plan in `localStorage`.
13. **`/plan` prefix for one turn** (Claude v2.1+). Pi’s `/plan` toggles session mode. One-shot plan would need a new host operation; do not fake it by toggling on then off after one send.
14. **Don’t bind any Tab variant.** Only chip + `/plan`. Most iOS-correct. Weakest for users coming from Claude Code / Kimi Code muscle memory — unless the chip tooltip teaches `⇧⇥` for the subset of sessions where the event actually fires.

---

## 4. Open questions + risks

1. **Does Safari on iOS 26 + Magic Keyboard ever deliver `keydown` Shift+Tab to a PWA textarea?** Public evidence says Tab is often eaten. Must be measured on a physical iPhone before calling the shortcut “done.” Fallback is the chip; treat shortcut as progressive enhancement.
2. **Full Keyboard Access** uses Shift+Tab = move backward. Stealing it while the composer is focused will strand FKA users inside the textarea. Need a kill-switch if `event.key === 'Tab'` would be the only way out of the field (today plus/send are after the textarea in DOM order — Tab-without-shift should reach them).
3. **How does `/plan execute` travel?** If it is a slash command in the prompt, it consumes a user turn and must go through redaction + tickets. If it is only an extension command via `setActiveTools`, the PWA needs an explicit ticketed command, not `setMode`. Confirm before wiring the Execute button.
4. **When does `executing-plan` end?** Tests show execute restores tools and publishes `executing-plan`, then a later toggle returns to `build`. If the host never leaves `executing-plan`, the chip stays **Plan running** forever (Codex stale-card class of bug).
5. **Claude iOS Code dropdown vs consumer Research chip.** Target bar names both “Claude iOS” and “Kimi Code.” Implement **Code-tab dropdown semantics** (host permission mode) with **Research-chip visibility** (persistent indicator). Do not implement consumer Research’s blue search agent.
6. **Plan artifact rendering.** Gemini/Kimi/Codex all need a *thing* to approve. If Pi’s transcript does not yet promote `plan` blocks to a card, Execute has nothing to attach to — then the chip + `/plan execute` is the whole handoff (Cline-like). That is a product fork, not a polish item.
7. **Remote-control desync.** Claude’s own iOS Remote Control still ships a mode control that sometimes does not propagate. Pi’s `waitForMode` is the correct antidote; the UI must never look like Plan if the host said no.
8. **Mobbin pixel measurements** for 2026 Claude Code-tab / Codex-in-ChatGPT / Kimi Code web were not inspectable this pass (MCP unauthenticated). Re-run Mobbin `search_screens` / `search_flows` after OAuth before locking 2pt metrics that are not already in `01-visual-teardown.md` or DeepSeek’s DESIGN.md.
9. **Kimi consumer vs Kimi Code.** Matching “Kimi Code” means Shift-Tab + blue plan badge + ExitPlanMode, not K3 Swarm pills.
10. **WCAG vs clay chip.** A filled clay chip with white text on `#d97757` may pass for large text if the fill is the 40pt send; a 13pt label on clay fill likely fails AA. Prefer carbon label + clay bar.

---

## 5. Sources

### First-party — Claude / Anthropic

- https://support.claude.com/en/articles/11088861-use-research-on-claude
- https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research
- https://support.claude.com/en/articles/8114491-get-started-with-claude
- https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile
- https://code.claude.com/docs/en/permission-modes
- https://code.claude.com/docs/en/interactive-mode
- https://code.claude.com/docs/en/mobile
- https://code.claude.com/docs/en/remote-control
- https://apps.apple.com/us/app/claude-by-anthropic/id6473753684
- https://github.com/anthropics/claude-code/issues/28427
- https://github.com/anthropics/claude-code/issues/29319

### First-party — Kimi / Moonshot

- https://www.kimi.com/help/kimi-code/cli-work-modes
- https://moonshotai.github.io/kimi-code/en/guides/interaction.html
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html
- https://www.kimi.com/resources/kimi-code-cheat-sheet
- https://www.kimi.com/resources/kimi-code-introduction
- https://kimi-cli.vercel.app/en/reference/keyboard.html
- https://github.com/MoonshotAI/kimi-code
- https://apps.apple.com/us/app/kimi-kimi-k3-is-live/id6474233312
- https://www.kimi.com/help/getting-started/overview

### First-party — ChatGPT / Codex / OpenAI

- https://help.openai.com/en/articles/11780217-using-study-mode-in-chatgpt
- https://developers.openai.com/codex/learn/best-practices
- https://developers.openai.com/codex/remote-connections
- https://github.com/openai/codex/blob/main/codex-rs/collaboration-mode-templates/templates/plan.md
- https://github.com/openai/codex/pull/17499
- https://github.com/openai/codex/issues/23066
- https://github.com/openai/codex/issues/22773
- https://openai.com/index/work-with-codex-from-anywhere/

### First-party — Gemini / Google

- https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en
- https://support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DiOS
- https://gemini.google/overview/deep-research/
- https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/plan-mode.md
- https://9to5google.com/2025/09/15/gemini-tools-redesign-android-ios/

### First-party — DeepSeek / Perplexity / Meta

- https://api-docs.deepseek.com/news/news250115/
- https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349
- https://github.com/Meliwat/awesome-ios-design-md/blob/main/design-md/misc/deepseek/DESIGN.md
- https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search
- https://www.meta.com/help/artificial-intelligence/943942350800511/
- https://apps.apple.com/us/app/meta-ai/id1558240027

### Apple HIG / iOS keyboard

- https://developer.apple.com/design/human-interface-guidelines/focus-and-selection
- https://support.apple.com/en-au/guide/iphone/ipha4375873f/ios
- https://support.apple.com/guide/ipad/use-shortcuts-ipaddf61a0c2/ipados
- https://developer.apple.com/videos/play/wwdc2020/10109/
- https://developer.apple.com/videos/play/wwdc2021/10260/
- https://developer.apple.com/videos/play/wwdc2021/10120/
- https://stackoverflow.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event
- https://stackoverflow.com/questions/38385197/how-to-prevent-tab-action-triggered-by-ios-uikeyboard-arrows

### Coding-agent prior art (GitHub)

- https://docs.cline.bot/core-workflows/plan-and-act
- https://docs.cline.bot/usage/tui
- https://github.com/cline/cline/blob/fd8cecdd/docs/cline-cli/interactive-mode.mdx
- https://qwenlm.github.io/qwen-code-docs/en/users/features/approval-mode/
- https://github.com/Arose-Niazi/claude-remote-controller
- https://github.com/d-kimuson/remote-agent
- https://github.com/Kujirafu/AgentRune
- https://github.com/Windy3f3f3f3f/how-claude-code-works/blob/main/en/docs/10-plan-mode.md

### Mobbin (public URLs; MCP not authenticated this pass)

- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS, chatting / text input
- https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8 — Claude iOS chat detail
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS chat / composer
- https://mobbin.com/explore/screens/56bc3623-9899-444c-bfba-58a6335d5cf4 — ChatGPT iOS keyboard input
- https://mobbin.com/explore/screens/e05bba7c-01ab-4c15-9e98-a04e2943690b — ChatGPT iOS message input
- https://mobbin.com/explore/flows/036b8308-ccd9-4efe-9b47-4d203ff6f53e — Perplexity iOS Research flow
- https://mobbin.com/explore/screens/67ff18d6-4a29-418d-9f55-b51010e0b462 — Perplexity iOS chat bot
- https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4 — DeepSeek iOS chat
- https://mobbin.com/explore/screens/2ec379b4-48e9-46bd-a332-d84086092f78 — Gemini iOS home
- https://mobbin.com/explore/flows/4d2bf214-4b16-4b9c-b411-353db138d464 — Gemini iOS Live
- https://mobbin.com/explore/screens/5d784612-55db-4241-a110-0a5d66cf5711 — Meta AI iOS

### This repo (current UI + enforcement)

- `apps/pi-remote-web/src/SessionComposer.tsx`
- `apps/pi-remote-web/src/RuntimeStrip.tsx`
- `apps/pi-remote-web/src/style.css` (`.composer-plus` 2.5rem)
- `packages/pi-rpc-protocol/src/types.ts` (`RUNTIME_MODES`, `set_mode`)
- `extensions/pi-remote-plan/src/index.ts`
- `extensions/pi-remote-plan/tests/plan-mode.test.ts`
- `apps/pi-remote-relay/src/runtime/runtime-service.ts`
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md` (incl. `gemini-research-plan.png` index)
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`
