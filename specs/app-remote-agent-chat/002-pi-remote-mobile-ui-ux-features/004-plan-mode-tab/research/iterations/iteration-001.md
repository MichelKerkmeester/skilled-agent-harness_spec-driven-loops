<!-- provenance: external-CLI orchestration pass; original file iter-01-sol.md -->
> **Source pass 1** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-1-sol.md`.

<!-- F4-plan-mode-tab | model=sol | lens=competitive-teardown | iter 1/10 | 2026-08-15T19:18:53.883Z -->

# 1. Findings for the competitive-teardown lens

## Evidence boundary

Mobbin’s protected catalog could not be queried in this pass: its screen-search API requires a Team/Enterprise API key, while MCP screen retrieval requires a paid account and OAuth. Its public search index did not expose stable screen permalinks for the requested mode states, so no dimensions below are falsely attributed to Mobbin. Mobbin itself documents that search results normally include screen images and Mobbin links. ([Mobbin MCP](https://mobbin.com/mcp), [API quick start](https://docs.mobbin.com/api/quickstart), [MCP introduction](https://docs.mobbin.com/mcp/introduction))

An independent real-device archive contains 80 Claude iOS screens from version 1.260514.0, but that capture predates or omits the relevant Code-mode screens. It is useful only as confirmation of Claude’s general bottom-composer and modal-picker vocabulary, not as evidence for its Plan control. ([Claude iOS screen archive](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots))

## Competitive comparison

| Product | Entry and persistent signal | Plan → action handoff | Transferable lesson |
|---|---|---|---|
| **Claude iOS / Claude Code Remote Control** | The Code tab places a mode dropdown next to the send button. A remotely controlled local session exposes **Manual**, **Accept edits**, and **Plan**; the displayed mode follows changes made either in the app or terminal. The terminal uses `Shift+Tab` to cycle modes. Claude also supports `claude://code/new?mode=plan`, allowing an iOS Shortcut or deep link to open a new Plan session. ([permission modes](https://code.claude.com/docs/en/permission-modes), [mobile deep links](https://support.claude.com/en/articles/14898120-open-the-claude-mobile-app-with-a-link)) | The completed-plan prompt offers approval into an execution permission mode or **No, keep planning**. Approving both accepts the plan and changes the session’s permission mode before editing begins. ([permission modes](https://code.claude.com/docs/en/permission-modes)) | Mode is an authoritative session property, visible beside the primary action—not a transient toast or buried preference. The handoff names the post-plan permission posture. |
| **Kimi Code CLI and web UI** | `Shift+Tab` toggles Plan; `/plan`, `/plan on`, a startup flag, and agent-requested entry are also supported. The TUI changes its prompt symbol and shows a blue `plan` status badge. The web UI puts the toggle in the prompt toolbar and adds a dashed blue composer border while active. ([keyboard reference](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/keyboard), [interaction guide](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md), [web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)) | The review surface shows the complete plan. A single approach gets **Approve**; multiple approaches become two or three labeled choices. Other paths are **Reject**, **Reject and Exit**, and **Revise**. Approval exits Plan and begins execution; revision stays in Plan. ([interaction guide](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md)) | This is the closest precedent for Pi Remote: redundant touch/keyboard entry, persistent decoration around the composer, and an explicit review state rather than treating mode exit as execution. |
| **ChatGPT iOS** | ChatGPT has no documented read-only coding-plan mode. Its relevant mobile pattern is progressive disclosure: individual tool icons were consolidated into a sliders-style button that opens a bottom sheet, preserving composer space. Agent mode historically entered through that menu or `/agent`; current documentation says that product mode has been retired in favor of ChatGPT Work. ([mobile release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), [agent documentation](https://help.openai.com/en/articles/11752874-chatgpt-agen)) | No public plan-review-to-code transition comparable to Claude or Kimi. | A bottom sheet is appropriate for secondary options, but not for the only indicator of a safety-relevant session mode. Pi Remote’s current `+`-popover-only control is therefore below the target bar. |
| **Perplexity** | **Research** is selected from a mode selector inside the search box on mobile, web, and Mac. The selected mode determines the processing path before submission. ([Research mode](https://www.perplexity.ai/help-center/en/articles/10738684-what-is-research-mode)) | Submission starts research immediately; there is no approval boundary between a produced plan and consequential execution. | Good precedent for keeping mode selection attached to the composer, but insufficient for a mutation-gating workflow. |
| **DeepSeek** | The official app exposes **Deep-Think** and web search as pre-send modes. Published app imagery treats these as compact composer-level controls rather than separate destinations. ([official app announcement](https://api-docs.deepseek.com/news/news250115/)) | Deep-Think changes response behavior but does not produce an independently approved execution plan. | Compact, visibly selected chips work well for mutually composable capabilities. Pi’s Build/Plan modes are mutually exclusive and should instead use a single-selection control. |
| **Gemini iOS** | In the text box, the user taps **Tools → Deep Research**, optionally selects sources, enters a prompt, and submits. ([Gemini iPhone/iPad help](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en)) | Gemini first creates a research plan. The user may choose **Edit plan**, then must choose **Start research**; the completed artifact is opened separately. Mobile notification handles the potentially 5–10 minute run. ([Gemini iPhone/iPad help](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en)) | Strong non-coding precedent for a two-commit interaction: submit intent, inspect/edit plan, then explicitly start the expensive work. |
| **Meta AI** | Meta’s public materials emphasize voice/text entry, research, recurring tasks, and live steering. They do not document a persistent pre-execution Plan switch or a plan-approval control. ([Meta AI app launch](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/), [agentic update](https://about.fb.com/news/2026/07/meta-ai-muse-spark-doesnt-just-think-it-acts/amp/)) | Users can steer reports, presentations, and plans while generation is underway; finished artifacts are collected for later access. | Live steering is valuable after execution begins, but it does not replace the explicit safety boundary required here. |

## Prior art from coding-agent mobile clients

The space is converging on synchronized session state rather than phone-as-terminal emulation:

- GitHub Mobile’s Copilot remote control can switch between interactive and Plan modes, approve or reject plans, answer permission prompts, and synchronize with the local CLI in real time. ([GitHub remote control](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control))
- OpenCode Manager is an installable, iOS-optimized React/Vite PWA with Plan/Build modes, streaming sessions, and push notifications—architecturally close to Pi Remote. ([repository](https://github.com/chriswritescode-dev/opencode-manager))
- Happy uses a mobile/web client plus a local CLI wrapper and emphasizes encrypted state synchronization, permission notifications, and instant device handoff. ([repository](https://github.com/slopus/happy))
- Pi core deliberately omits native Plan mode, while community extensions add read-only tools, persistent `plan active`/`plan ready` states, review, revision, and explicit implementation actions. This validates keeping enforcement in the host extension rather than trusting UI presentation. ([Pi Plan extension](https://github.com/narumiruna/pi-extensions/tree/main/extensions/pi-plan-mode), [Pi example extension](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts))

## Resulting product direction

The strongest pattern is a hybrid of Claude and Kimi:

1. A visible, composer-adjacent mode control.
2. A second persistent status cue that survives transcript scrolling.
3. `Shift+Tab` parity for terminal-trained hardware-keyboard users.
4. A distinct `plan_ready` review state.
5. An explicit, revision-checked **Execute plan** mutation—not “switch to Build and hope the next message means execute.”

Plain `Tab` must remain focus navigation. Intercepting it would conflict with logical focus order and keyboard-trap guidance. `Shift+Tab` is the competitive shortcut, but should be narrowly scoped because it ordinarily navigates backward. ([WCAG focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), [No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html))

# 2. Concrete spec contribution a build phase can execute

## 2.1 Information architecture

### Persistent header indicator

Place a noninteractive status pill in the sticky session header:

- Build: hammer icon + `Build`
- Plan: lock/document icon + `Plan · read-only`
- Plan ready: document-check icon + `Plan ready`
- Executing: play icon + `Executing plan`
- Unknown/stale: warning icon + `Mode unavailable`

Visual height: 28 px; padded hit/announcement region: 44 px if made interactive. It must remain visible while the transcript scrolls.

### Composer mode control

Move the canonical control out of the `+` popover and into a 44 px-high toolbar immediately above the textarea:

```text
┌────────────────────────────────────┐
│ [ Build ] [ Plan ]      model · … │
│                                    │
│ Message pi…                     ↑  │
└────────────────────────────────────┘
```

Use `ToggleButtonGroup` with:

- `selectionMode="single"`
- `disallowEmptySelection`
- buttons `Build` and `Plan`
- accessible group name `Agent mode`
- controlled selection derived from acknowledged host state

React Aria toggle controls support keyboard, touch, and `aria-pressed` semantics. ([React Aria/Spectrum ToggleButton](https://react-spectrum.adobe.com/v3/ToggleButton.html))

Each segment:

- Minimum interactive size: 44 × 44 CSS px.
- Visible capsule may be 32 px high inside that region.
- Label must remain visible; do not collapse Plan to an icon on 320 px-wide screens.
- The old `+` menu item should be removed or changed to a read-only shortcut leading focus to this control—two independently mutable controls invite stale presentation.

Apple recommends at least 44 × 44 pt for touch controls and an explicit pressed state. ([Apple buttons](https://developer.apple.com/design/human-interface-guidelines/buttons))

## 2.2 Authoritative state model

| State | UI | Allowed action |
|---|---|---|
| `build` | Build selected; normal carbon composer border | Request Plan |
| `requesting_plan` | Existing Build state remains authoritative; Plan segment shows spinner; send disabled | Cancel only if protocol supports cancellation |
| `plan` | Plan selected; header says `Plan · read-only`; clay inset border around composer | Send planning prompts; request exit |
| `plan_ready` | Plan remains selected; review dock replaces normal send action | Execute, revise, keep planning, or leave |
| `requesting_execute` | Execute button shows progress; Plan remains authoritative | No second mutation |
| `executing` | Build selected only after host acknowledgment; progress label shown | Stop/steer under existing rules |
| `requesting_build` | Plan remains selected until acknowledgment | No duplicate request |
| `offline` | Last acknowledged mode shown with `Offline`; mutations disabled | Reconnect |
| `stale_or_conflict` | Warning status; no selected mode is guessed | Refresh authoritative session state |

Rules:

- Never optimistically paint Plan or Build as active.
- Every mutation carries a one-use ticket and expected session revision.
- Disable repeat activation while a ticket is outstanding.
- On timeout, ticket rejection, revision conflict, or malformed reply, query authoritative state and remain fail-closed.
- A resumed PWA must render `Mode unavailable` until fresh session state arrives; cached Build state must never authorize mutation.

## 2.3 Touch and gesture sequence

### Enter Plan

1. Tap `Plan`.
2. Send one ticketed `set_mode(plan, expectedRevision)` request.
3. While pending, keep Build visibly authoritative and show progress inside the Plan segment.
4. On acknowledgment, select Plan, update both status locations, apply the composer border, and announce: `Plan mode on. Pi is read-only.`
5. Keep textarea focus and the draft unchanged.

No confirmation is required for entering the safer mode.

### Leave an empty or unfinished Plan

- If no plan artifact is ready, tapping Build sends `set_mode(build, expectedRevision)` directly.
- If a plan is ready, tapping Build opens a bottom sheet:

  - Title: `Leave plan mode?`
  - Body: `The current plan will not run.`
  - Actions: `Keep planning` and `Leave without running`

This distinguishes abandoning a plan from approving it.

### Plan-ready handoff

When the extension emits a versioned plan artifact, render:

```text
┌ Plan ready · revision 7 ───────────┐
│ 5 steps · 3 files · read-only      │
│ [View full plan]                    │
└─────────────────────────────────────┘

[ Execute plan ]  [ Keep planning ]
         Add revision feedback…
```

- `View full plan` opens a full-height sheet with the complete plan, not a truncated modal.
- `Keep planning` restores/focuses the composer.
- Feedback is sent as a normal planning turn and retains Plan mode.
- `Execute plan` invokes a single atomic host operation containing the plan identifier/hash, expected session revision, desired execution mode, and one-use ticket.
- Only a successful acknowledgment may change the UI to Build/Executing.
- A plan-revision conflict returns: `The plan changed on another client. Review the latest version.` The old Execute control becomes inert.

Avoid implementing execution as independent `set_mode(build)` followed by `send("execute")`; a disconnect between those calls could leave the session writable without starting the reviewed plan.

## 2.4 Hardware-keyboard affordance

### Required behavior

- `Shift+Tab` toggles Build ↔ Plan to match Claude Code and Kimi.
- Never intercept bare `Tab`; it must continue sequential focus navigation.
- Handle the shortcut only when:

  - focus is in the composer textarea;
  - no menu, sheet, dialog, or approval surface is open;
  - `event.isComposing` is false;
  - the event is not a repeat;
  - the session is connected and idle;
  - no mode mutation is pending.

- In `plan_ready`, `Shift+Tab` must open the leave-without-running sheet, not silently discard or execute the plan.
- If focus is outside the composer, preserve normal `Shift+Tab` backward navigation.
- Show `⇧ Tab` as a keycap hint in the Plan segment’s long-press/help sheet. Do not reserve horizontal space for it in the default 320 px layout.
- Also support `/plan` and `/plan off` as discoverable textual fallbacks if slash commands already exist.

Apple recommends Command as the primary modifier for custom application shortcuts; therefore add `⌘⇧P` as a non-Tab alternative and document both. ([Apple keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards))

### Keyboard acceptance checks

- Bare `Tab` visits Build, Plan, textarea, attachments, and send in logical DOM order.
- `Shift+Tab` from any element except the textarea navigates backward.
- `Shift+Tab` from the textarea issues exactly one mode request.
- Escape closes the leave-plan sheet and returns focus to the control that opened it.
- VoiceOver plus hardware keyboard can reach and activate both mode buttons without the shortcut.

## 2.5 Visual specification

### Light mode

- Page: bone `#f8f8f6`
- Primary text: carbon
- Plan-selected segment: clay `#d97757` fill with carbon text
- Active composer: 2 px clay inset border plus `Plan · read-only`
- Build-selected segment: carbon fill with bone text
- Inactive segments: transparent with 1 px carbon at reduced opacity

Do not render clay text directly on bone: the pair measures approximately **2.94:1**, below WCAG AA for normal text. Clay with near-carbon text is approximately **5.74:1**.

### Dark mode

- Near-carbon surface with bone text.
- Plan may use clay text or border against carbon; the approximate **5.74:1** contrast is suitable for normal text.
- Preserve icon and text labels so color is never the sole mode indicator.

### Typography

- Mode labels: Inter, 14 px/20 px, weight 600.
- Explanatory text and plan body: Source Serif 4, minimum 16 px/24 px.
- Header status: Inter, 13 px/18 px, weight 600.
- Plan title: Source Serif 4, 20 px/26 px.

## 2.6 Motion and feedback

- Acknowledged mode transition: 140 ms border/fill crossfade.
- No scale bounce: this is a security state, not a celebratory action.
- Pending spinner: 700–900 ms linear rotation.
- Plan-review dock: 180 ms opacity/translate of no more than 8 px.
- Under `prefers-reduced-motion: reduce`, remove translation and spinner rotation; use a static progress glyph.
- Haptic feedback is unavailable to a normal PWA, so never rely on it.
- Do not use a toast as the only confirmation. The selected control and header status are durable.

## 2.7 Accessibility

- Mode group accessible name: `Agent mode`.
- Button names remain `Build` and `Plan`; state is exposed through `aria-pressed`.
- Persistent status uses `role="status"` with concise announcements:

  - `Plan mode on. Pi is read-only.`
  - `Build mode on. Pi may request changes.`
  - `Mode change failed. Plan mode remains on.`
  - `Session state changed elsewhere. Review the latest plan.`

- The Plan explanation is associated with the Plan control using `aria-describedby`.
- Focus rings: at least 2 px, visually distinct in both themes.
- Do not move focus after a successful mode switch.
- When the plan-ready dock replaces composer actions, focus remains in the textarea unless the agent—not a user keypress—caused the transition; in that case announce the state without stealing focus.
- Full plan sheet uses a dialog with trapped modal focus, Escape dismissal, and focus restoration. The surrounding page becomes inert while open.
- Preserve logical DOM order rather than using positive `tabindex`, consistent with ARIA keyboard guidance. ([WAI keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/), [WCAG focus order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html))

## 2.8 Objective build checks

- On 320, 375, 390, and 430 px-wide iPhone viewports, both labels remain visible and every target is at least 44 × 44 px.
- Opening the iOS software keyboard leaves the mode control and send action visible above the keyboard.
- A successful Plan request updates both control and header only after acknowledgment.
- Timeout, offline, consumed ticket, wrong revision, and malformed acknowledgment never render Build or Plan optimistically.
- Ten rapid taps produce at most one in-flight mutation.
- Bare `Tab` is never canceled.
- Plan execution cannot occur with a stale plan hash or session revision.
- Light and dark text combinations meet WCAG AA; clay-on-bone normal text is rejected by automated contrast tests.
- VoiceOver announces label, pressed state, description, pending state, and errors.
- Reduced-motion mode contains no position animation.
- Reloading offline never restores a cached writable state as authoritative.

# 3. Divergent / minority ideas worth considering

## Turn-scoped Plan instead of a session mode

Add `Plan this request` to a send-button long press. It would produce one read-only turn and automatically return to the prior mode after review. This reduces forgotten-mode errors and resembles Claude’s `/plan` prefix, but weakens the persistent conversational planning workflow.

## Plan-first as the default

Start every new remote session in Plan and require explicit execution approval. This is slower but strongly aligned with the product’s read-only default and mobile’s high risk of accidental taps. Kimi supports `default_plan_mode`; Claude supports a Plan default in settings. ([Kimi configuration](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/configuration/config-files.md), [Claude permission modes](https://code.claude.com/docs/en/permission-modes))

## Fork at execution

Keep the planning conversation immutable and execute the approved artifact in a child session. This creates excellent auditability and prevents planning chatter from contaminating implementation context. It also follows Pi core’s minority philosophy of planning in one session and implementing in a fresh one. The cost is more session-management complexity.

## Do not ship `Shift+Tab` by default

Use `⌘⇧P` globally and expose `Shift+Tab` behind a `Terminal-compatible shortcuts` preference. This better preserves web focus conventions and follows Apple’s modifier guidance, but misses immediate muscle-memory parity with Claude and Kimi.

## Dedicated Plan key above the software keyboard

Render a small `Plan` command strip attached to the composer whenever the software keyboard is visible. This treats touch users as first-class rather than presenting the keyboard shortcut as the feature. It consumes scarce vertical space but may outperform the permanent two-segment control in one-handed tests.

## Deep-link entry

Support a route such as `/session/new?mode=plan` or an app-specific URL. An iOS Shortcut, Home Screen quick action, or bookmarked URL could then open directly into a read-only planning session, following Claude’s `mode=plan` deep-link precedent.

# 4. Open questions + risks

1. **What is authoritative during reconnect?** The host extension must publish mode plus session revision on initial subscription and every change. A client-local boolean is insufficient.

2. **Can the current protocol make plan approval atomic?** If it exposes only `set_mode`, the plan-to-execute boundary needs a new host operation. Sequential mode-switch and prompt-send calls create a writable intermediate state.

3. **What exactly does Build authorize?** “Build” may imply automatic mutation even if approvals remain required. If it merely leaves read-only Plan, consider `Work` or `Normal` and show the actual permission policy separately.

4. **What happens during streaming?** Kimi requires extra confirmation before leaving Plan during an active response. Pi Remote should either disable switching while busy or define “apply next turn”; it must not imply that an already-running tool call changed policy retroactively.

5. **How are plans versioned?** The execution request needs an immutable plan identifier or hash, not only the mutable session revision.

6. **Is the shortcut acceptable under assistive keyboard navigation?** Scoping `Shift+Tab` to the composer prevents a complete keyboard trap because bare Tab still exits, but it removes backward navigation from that one control. This requires VoiceOver, Full Keyboard Access, and switch-control testing on physical iPhone hardware.

7. **Hardware-keyboard detection is unreliable in a PWA.** Do not condition essential UI on detecting a keyboard. The touch control must always exist; the keycap hint can remain secondary.

8. **Does plan state persist per session, repo, or device?** Claude treats Plan as current-session state in several surfaces; Kimi can default it globally. Remote control favors per-session authoritative state, with no device-local override.

9. **What survives “Leave without running”?** Decide whether the plan remains viewable, becomes an archived transcript artifact, or is discarded. The copy must match the actual retention behavior.

10. **Mobbin validation remains outstanding.** Before visual sign-off, retrieve current Claude Code, ChatGPT tools, Perplexity Research, Gemini Deep Research, DeepSeek DeepThink, and Meta AI Research flows from authenticated Mobbin and measure actual spacing, sheets, selected-state treatment, and iPhone safe-area behavior.

# 5. Sources

- [Mobbin MCP](https://mobbin.com/mcp)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
- [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)
- [Claude iOS real-device screen archive](https://techdevnotes.com/apps/ios/claude/6473753684/screenshots)
- [Claude Code permission modes](https://code.claude.com/docs/en/permission-modes)
- [Claude mobile deep links](https://support.claude.com/en/articles/14898120-open-the-claude-mobile-app-with-a-link)
- [Kimi Code keyboard shortcuts](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/keyboard)
- [Kimi Code interaction and Plan mode](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/guides/interaction.md)
- [Kimi Code web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code configuration](https://github.com/MoonshotAI/kimi-cli/blob/main/docs/en/configuration/config-files.md)
- [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [ChatGPT agent documentation](https://help.openai.com/en/articles/11752874-chatgpt-agen)
- [Perplexity Research mode](https://www.perplexity.ai/help-center/en/articles/10738684-what-is-research-mode)
- [DeepSeek app announcement](https://api-docs.deepseek.com/news/news250115/)
- [Gemini Deep Research on iPhone and iPad](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en)
- [Meta AI app launch](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/)
- [Meta AI agentic tasks and live steering](https://about.fb.com/news/2026/07/meta-ai-muse-spark-doesnt-just-think-it-acts/amp/)
- [GitHub Copilot CLI remote control](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control)
- [OpenCode Manager](https://github.com/chriswritescode-dev/opencode-manager)
- [Happy mobile coding-agent client](https://github.com/slopus/happy)
- [CC Pocket](https://github.com/K9i-0/ccpocket)
- [Yep Anywhere](https://github.com/kzahel/yepanywhere)
- [Pi Plan-mode extension](https://github.com/narumiruna/pi-extensions/tree/main/extensions/pi-plan-mode)
- [Pi example Plan-mode extension](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/plan-mode/index.ts)
- [Apple Human Interface Guidelines: Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Apple Human Interface Guidelines: Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [React Aria/Spectrum ToggleButton](https://react-spectrum.adobe.com/v3/ToggleButton.html)
- [WAI-ARIA keyboard interface guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [WCAG Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [WCAG No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html)
