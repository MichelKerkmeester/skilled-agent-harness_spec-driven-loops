<!-- provenance: external-CLI orchestration pass; original file iter-04-sol.md -->
> **Source pass 4** — executor: GPT 5.6 SOL high (--search, cli-codex). Independent, cited pass under a rotating lens. Migrated from `iter-4-sol.md`.

<!-- F4-plan-mode-tab | model=sol | lens=edge-failure | iter 4/10 | 2026-08-15T19:38:26.702Z -->

# 1. Findings for the edge-failure lens

## Plan mode is a safety state, not a cosmetic toggle

Pi Remote must display only host-confirmed mode. The UI may show a pending intent—“Switching to Plan…”—but must not display “Plan · read-only” until the extension has removed mutating tools and published the confirmed state. HTTP conditional mutations exist specifically to prevent lost updates; a revision mismatch should return the current authority rather than repeat the old write ([RFC 9110, `If-Match`](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match), [MDN: 412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/412)).

The current four-value runtime model—`build`, `plan`, `executing-plan`, `unknown`—must not be reduced to a binary selected/unselected presentation:

- `plan` means mutations are blocked.
- `executing-plan` means tools have been restored and therefore is **not read-only**.
- `unknown` means the client cannot make either safety claim.
- `build` is the normal host-confirmed mode.

Presenting `executing-plan` as selected “Plan” would be materially misleading. Claude has had real failures where a rejected plan exit was later interpreted as approval and implementation began without consent ([Claude Code issue #50176](https://github.com/anthropics/claude-code/issues/50176)); another report documents plan approval unexpectedly enabling auto-accept ([issue #2988](https://github.com/anthropics/claude-code/issues/2988)). The handoff therefore needs its own explicit state and approval record.

Upstream Pi does not provide a built-in permission system and recommends external sandboxing or extension enforcement ([Pi repository](https://github.com/badlogic/pi-mono#permissions--containerization)). “Read-only” is truthful only if the plan extension blocks every mutation-capable built-in and custom tool, including future extensions—not merely `edit`, `write`, and selected shell commands.

## Copy the graphical mode pattern, not the terminal key map

Claude Code CLI and Kimi Code CLI use `Shift+Tab`; both keep the active mode visible in the prompt/status region. Kimi changes the prompt to a clipboard symbol and shows a blue `plan` badge ([Kimi keyboard reference](https://moonshotai.github.io/kimi-cli/en/reference/keyboard.html)). Its web UI puts the toggle in the input toolbar and adds a dashed composer border while Plan is active ([Kimi Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)).

Claude’s graphical Code client instead places a named mode selector beside the send control, and explicitly states that terminal `Shift+Tab` does not apply in Desktop ([Claude Code Desktop](https://code.claude.com/docs/en/desktop)). Claude’s mobile deep-link contract also treats `plan` and `code` as named modes, while documenting that an unavailable mode may be ignored ([Claude mobile deep links](https://support.claude.com/en/articles/14898120-open-the-claude-mobile-app-with-a-link)). Pi Remote should improve on that last behavior: unsupported Plan must be visible, never silently ignored.

A web PWA should not globally steal `Tab` or `Shift+Tab`. Apple defines `Shift+Tab` as reverse control navigation and advises against repurposing standard shortcuts ([Apple HIG: Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)). The safe hardware-keyboard affordance is:

1. `Tab` moves focus from the composer to the persistent mode control.
2. `Space` or `Enter` activates it.
3. A direct app shortcut uses `Command+Shift+P`.
4. Optional CLI-parity `Shift+Tab` may be user-enabled, but must not be the only route.

This also solves the soft-keyboard gap: touch users tap the same persistent control; no synthetic Tab key is needed.

## Offline and disconnected are not equivalent to Build

`navigator.onLine` is explicitly unreliable and must only be treated as a hint; a device can report online while the relay, tailnet, or host remains unreachable ([MDN: `Navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)). Therefore:

- Never select Build merely because hydration failed.
- Never queue a mode mutation for later replay.
- Keep the last confirmed mode visible only as stale history: “Last confirmed Plan · 4m ago.”
- Require a fresh runtime read before re-enabling Send or the mode control.

This matters especially on iPhone: hidden pages throttle timers, and foreground restoration must be treated as a resynchronization boundary ([MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)). WebKit has also recorded standalone-PWA WebSocket instability and backgrounding failures ([WebKit #298616](https://bugs.webkit.org/show_bug.cgi?id=298616), [WebKit #211018](https://bugs.webkit.org/show_bug.cgi?id=211018)). A socket’s former `open` state is not evidence of current authority after resume.

Remote-client prior art reinforces this. Happy performs explicit disconnect handling, reconnects, and sequence-based message catch-up rather than assuming continuity ([Happy reconnect implementation](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/api/apiSession.ts)). It has also experienced stale permission-mode propagation between app and host ([Happy issue #625](https://github.com/slopus/happy/issues/625)) and modes surviving reset incorrectly ([issue #521](https://github.com/slopus/happy/issues/521)). Mode must therefore be session-scoped, revisioned, and rehydrated on every authority boundary.

## Permission-denied must be distinguished from transport failure

At least four visually distinct failures are required:

- **Offline/tailnet unreachable:** retain cached transcript, offer “Try connection.”
- **Application session expired or revoked:** “Reconnect securely”; do not keep retrying.
- **Tailnet/device permission denied:** explain that this device is not authorized and direct the user to Tailscale/device administration.
- **Plan extension unsupported or unhealthy:** show “Plan unavailable on host”; keep the confirmed current mode but disable Plan.

Tailscale device approval prevents an unapproved device from sending or receiving any tailnet traffic ([Tailscale device approval](https://tailscale.com/docs/features/access-control/device-management/device-approval)). A healthy tailnet also does not imply a healthy Pi service: Tailscale documents that the destination service, firewall rules, and ACLs remain separate requirements ([Tailscale: Connect to devices](https://tailscale.com/kb/1452/connect-to-devices)). Generic “Offline” copy would make these failures unnecessarily difficult to repair.

## Plan exit is riskier than plan entry

Entering Plan reduces authority; leaving it restores authority. The UI should therefore be intentionally asymmetric:

- Enter Plan: one tap when idle.
- Leave Plan: named choice—“Execute reviewed plan,” “Return to Build without executing,” or “Stay in Plan.”
- Never interpret “not currently in Plan” as approval.
- Never restore a previous higher-permission mode implicitly.

Kimi preserves this boundary: a completed plan can be approved, rejected, or revised, and plan exit normally still requires confirmation even when ordinary tool confirmations are bypassed ([Kimi interaction guide](https://moonshotai.github.io/kimi-cli/en/guides/interaction.html)). Kimi’s `ExitPlanMode` also reads the current plan and presents it for approval ([Kimi built-in tools](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html)). Kimi requires secondary confirmation when exiting during a streamed response ([Kimi VS Code operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)).

## Mobbin evidence limitation

Mobbin’s relevant screen catalog is authenticated and its API requires a paid workspace/API key; search results normally return app names, image URLs, and Mobbin screen links ([Mobbin API quick start](https://docs.mobbin.com/api/quickstart), [Mobbin MCP](https://mobbin.com/mcp)). No authenticated Mobbin catalog was available for this pass, and no stable public Claude Code plan-mode screen was exposed by its public index. No Mobbin screenshot is therefore treated as evidence; the competitive claims above use current first-party product documentation rather than fabricated screen references.

# 2. Concrete build specification

## Persistent control

Place a 44×44-point minimum mode pill inside the composer bar, immediately after the textarea in DOM focus order and before the `+` control. Apple recommends at least 44×44-point touch targets ([Apple UI design tips](https://developer.apple.com/design/tips/)).

| Confirmed state | Visible pill | Composer treatment | Accessible value |
|---|---|---|---|
| `build` | Hammer icon + **Build** | Normal solid border | “Build mode, selected” |
| `plan` | Document icon + **Plan · read-only** | 1px dashed clay border plus clay-tinted pill | “Plan mode, selected, read-only” |
| `executing-plan` | Play/document icon + **Executing plan** | Solid clay leading stripe; never dashed | “Executing reviewed plan; changes may occur” |
| `unknown` | Question/shield icon + **Mode unknown** | Neutral dotted border | “Mode unknown; sending is unavailable” |

Color cannot carry the distinction alone; WCAG requires an additional text, shape, or pattern cue ([WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)).

The mode pill remains visible when the `+` popover is closed. The popover may retain the full Build/Plan selector, but it is secondary.

## State machine

| UI state | Required behavior |
|---|---|
| `hydrating` | Show “Checking mode…” skeleton/pill. Draft remains editable. Send and all mode mutations are disabled. Do not preselect Build. |
| `ready.build` | One tap on the pill requests Plan. |
| `ready.plan` | Tap opens the plan-exit sheet; it does not immediately restore Build. |
| `ready.executing-plan` | Mode control opens status/details, not a misleading Plan toggle. “Stop run” remains available. |
| `switching(target)` | Keep the previous confirmed label visible and append “Switching to Plan…” or “Switching to Build…”. Disable additional mode presses while retaining focus. |
| `stale` | Replace local state with the higher authoritative revision. Announce: “Mode changed on another device; now Plan.” Never repeat the rejected intent automatically. |
| `delivery-unknown` | Show “Change not confirmed · Checking host…”. Perform a read-only runtime refresh. Do not resend the mutation. |
| `offline` | Show “Offline · Last confirmed Plan at 14:32.” Disable Send and mode changes. Preserve draft and cached transcript. |
| `permission-denied` | Show a persistent alert with “Reconnect securely” or “Device needs tailnet approval,” based on the server reason. Do not retry in the background. |
| `unsupported` | Show “Plan unavailable on this host.” Keep the confirmed Build state and expose diagnostic copy without paths, tokens, or host secrets. |
| `streaming-locked` | Keep current mode visible. Disable switching with the explanation “Stop the current turn to change mode.” This avoids implying that already-started work has become read-only. |
| `extension-error` | Display “Plan safety could not be confirmed.” Treat mode as unknown, disable Send, and retain/re-establish the safest host restrictions. |

## Mutation algorithm

Every mode change must execute this sequence:

1. Require a live session, idle agent, authoritative runtime state, known revision, and no mutation in flight.
2. Obtain a fresh one-use ticket only after the user activates the control.
3. Send `set_mode` with `expectedRevision`.
4. Preserve the last confirmed mode visually; show only the pending target.
5. On `accepted`, render the returned host-confirmed state and revision.
6. On `stale`, render the returned current state and require a fresh user action.
7. On `unsupported` or permission denial, stop and show the repair action.
8. On `delivery-unknown`, perform one read-only reconciliation fetch; never replay the mutation.
9. Ignore any hydration or response whose revision is lower than the highest already rendered revision.
10. On `visibilitychange` back to `visible`, WebSocket reconnect, or app resume, abort obsolete reads and hydrate again before re-enabling controls.

Use a unique control ID plus single-flight UI gating. Holding a key, double-tapping, tapping while a keyboard event fires, or two React event paths must still create exactly one mutation. `AbortSignal` supports explicit cancellation and timeout differentiation, but an aborted fetch does not prove the server failed to apply the request ([MDN: AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)); it must enter `delivery-unknown`.

## Keyboard behavior

Default behavior:

- `Tab`: move focus from textarea → mode pill → `+` → Later/Send.
- `Shift+Tab`: standard reverse focus.
- `Space`/`Enter` on the mode pill: activate it.
- `Command+Shift+P`: direct Plan/Build command when no modal is open.
- `Escape`: close the mode sheet and return focus to the pill.

Optional “CLI shortcuts” setting:

- `Shift+Tab` may cycle Build/Plan only after explicit opt-in.
- Ignore the event when `isComposing`, `repeat`, `metaKey`, `altKey`, or `ctrlKey` is true; when a dialog/listbox is open; when runtime state is not ready; or when a turn is running.
- Preserve draft, selection, scroll position, and focus after a successful shortcut.
- Never bind plain `Tab` to a mutation.

`KeyboardEvent.isComposing` and `repeat` exist specifically to distinguish IME composition and held-key repetition ([MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)). The native OpenCode iOS client similarly calls out allowing Chinese/Japanese IME composition to commit normally ([OpenCode iOS client](https://github.com/grapeot/opencode_ios_client)).

## Plan → execute handoff

A completed plan must become an immutable review target for the approval attempt. Add a dedicated ticketed operation rather than overloading `set_mode('build')`:

```text
execute_plan {
  sessionId,
  expectedRuntimeRevision,
  planBlockId,
  expectedPlanRevision,
  redactedPlanDigest,
  ticket
}
```

The host accepts it only when:

- The agent is idle.
- Current mode is exactly `plan`.
- The plan block and revision still exist.
- The digest matches the reviewed plan.
- Tool restoration succeeds.
- The ticket, session, principal, and runtime revision are current.

The review sheet contains:

1. **Execute with normal approvals** — primary; never enables auto-accept.
2. **Revise plan** — stays in Plan and focuses the composer.
3. **Return to Build without executing** — explicit destructive-of-intent secondary action.
4. **Cancel** — closes the sheet and remains in Plan.

If the plan is empty, still streaming, changed on another client, or superseded, Execute is unavailable with the exact reason. On a revision mismatch: “The plan changed after you opened this review. Review the latest version.”

After acceptance, display `Executing plan`, not `Plan · read-only`. Transition back to Build only on an explicit host event after the execution turn settles; a client timer must never infer completion. Community Pi plan-mode prior art similarly separates “implement stored plan” from plain exit and fails closed when no plan is stored ([pi-plan-mode repository](https://github.com/narumiruna/pi-extensions/blob/main/extensions/pi-plan-mode/README.md)).

## Accessibility and feedback

- Keep the Build/Plan selector as a controlled, single-selection `ToggleButtonGroup`; React Spectrum documents controlled `selectedKeys` and `disallowEmptySelection` for this pattern ([ToggleButtonGroup](https://react-spectrum.adobe.com/ToggleButtonGroup)).
- Use text that names the state. Do not change only the icon or clay color.
- Keep focus on the initiating control while pending. React Aria’s pending button behavior disables repeated presses while preserving focus and announcing progress ([React Aria Button pending state](https://reactspectrum.blob.core.windows.net/reactspectrum/4d5eaec3b860a3d88320504c04489591f84abbae/docs/react-aria/Button.html)).
- Use one pre-mounted `role="status" aria-live="polite"` for pending/success. Use a separate pre-mounted `role="alert" aria-atomic="true"` only for permission loss, delivery uncertainty, or safety failure. W3C specifically notes that pre-existing atomic alert containers improve repeated VoiceOver announcements on iOS ([W3C ARIA19](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19)).
- Never combine `role="alert"` and redundant `aria-live` because that can double-speak in iOS VoiceOver ([MDN live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)).
- Visible focus ring: 2px minimum, offset 2px, AA contrast in both themes.
- Plan state animation: 120ms border/pill crossfade. Pending spinner appears only after 300ms to avoid flicker.
- Under `prefers-reduced-motion: reduce`, remove spinner rotation and use static ellipsis/text. Apple recommends replacing meaningful motion with a nonmoving cue rather than removing the status information ([Apple Reduced Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)).

## Pass/fail verification matrix

The build is complete only if automated or device tests prove:

- Initial hydration never flashes Build.
- Airplane mode preserves the draft and last-confirmed timestamp but cannot queue a mode change.
- Returning from background requires fresh hydration before Send is enabled.
- Double-tap, held shortcut, and simultaneous tap/keyboard activation produce one request.
- Two clients changing mode at the same revision produce one accepted result and one stale reconciliation.
- Ticket expiry or replay leaves the UI on its last confirmed state.
- A lost response never triggers an automatic second mutation.
- `401`, `403`, unsupported extension, offline, timeout, and malformed response render distinct states.
- Switching is blocked during streaming.
- Plan revision change invalidates an already-open Execute sheet.
- Failed tool restoration remains Plan/unknown; it never becomes Build or Executing plan.
- `executing-plan` is never labelled read-only.
- Tab and Shift+Tab traverse normally with CLI shortcuts disabled.
- IME composition and key repeat do not change mode.
- VoiceOver announces one pending message and one final outcome without moving focus.
- All text, focus, borders, and icons pass AA in bone/carbon/clay light and dark themes.
- Error and diagnostic copy contains no ticket, path, principal, host name, plan body, or unredacted tool argument.

# 3. Divergent / minority ideas worth considering

## Make Plan entry a one-turn safety latch

Instead of a persistent session mode, offer “Plan next reply” beside Send. It enters Plan, submits one prompt, and remains Plan until the user reviews the result. This greatly reduces accidental mode inheritance across resumed sessions, but is less convenient for multi-turn plan refinement.

## Require a physical gesture to leave Plan

Entering Plan remains one tap; leaving without executing requires a press-and-hold or swipe confirmation. This is intentionally asymmetric because exit restores authority. It is slower than Claude/Kimi, but safer for a remote-control surface where a mistaken tap can affect another machine.

## Keep Build unavailable until the first prompt

New remote sessions could start in Plan unconditionally and reveal Build only after a plan or explicit “Skip planning” action. This fits the fixed read-only-default posture, but experienced users may perceive it as ceremony.

## Treat execution as a new child run

Rather than mutating the current session from Plan to execution, fork a new execution run that references the approved plan digest. The original Plan conversation remains immutable evidence. This provides the cleanest audit trail and avoids stale-mode bleed, but adds session-management complexity.

## Allow offline plan drafting—but never offline mode changes

While offline, preserve a local “planning prompt” draft and label it “Not sent.” On reconnect, require explicit review before entering Plan and submitting it. Do not queue either action automatically. This provides useful degraded functionality without replaying a security-sensitive intent.

# 4. Open questions and risks

- **What ends `executing-plan`?** The host needs a deterministic event that returns it to Build; otherwise the status can remain stale indefinitely.
- **Does Plan block every custom tool?** Upstream Pi has no universal mutability metadata. A future extension tool could write files or call an external mutation while the UI still says read-only.
- **Can a running turn be safely interrupted at a tool boundary?** If not, all mode changes must remain idle-only.
- **Is there a stable, revisioned plan artifact?** If only rendered prose exists, `execute_plan` needs a canonical plan block ID, revision, and digest before it can be safely implemented.
- **Should Build exit discard or retain the plan?** The UI and audit log must state this explicitly.
- **Is `Shift+Tab` mandatory despite the web-platform conflict?** If required for parity, make it an opt-in “CLI shortcuts” preference and test Full Keyboard Access and VoiceOver before enabling it by default.
- **Can the relay distinguish application authorization, Tailscale ACL denial, unapproved device, expired TLS certificate, and host process outage?** Without structured reason codes, the UI can only offer generic recovery.
- **What is the safe behavior when runtime hydration succeeds but plan-status confirmation is missing?** Recommendation: mode `unknown`, Send disabled, no Build fallback.
- **What happens when another device exits Plan while an Execute review sheet is open?** The sheet must close or invalidate immediately on the higher revision.
- **Does plan approval authorize only the plan transition, or every later mutation?** It should authorize only the exact handoff; normal per-action approval policy must remain unchanged.
- **Tailscale HTTPS lifecycle:** manually provisioned certificates require renewal and may expire independently of tailnet connectivity ([Tailscale HTTPS](https://tailscale.com/docs/how-to/set-up-https-certificates)). The UI needs a recoverable certificate/secure-context failure path.

# 5. Sources

- [Apple Human Interface Guidelines — Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)
- [Apple Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)
- [WCAG 2.2 — Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C ARIA19 — Live regions for errors](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19)
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [MDN — `Navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [MDN — Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN — KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [MDN — AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [React Spectrum — ToggleButtonGroup](https://react-spectrum.adobe.com/ToggleButtonGroup)
- [React Aria — Button pending state](https://reactspectrum.blob.core.windows.net/reactspectrum/4d5eaec3b860a3d88320504c04489591f84abbae/docs/react-aria/Button.html)
- [Claude Code Desktop — modes and graphical shortcuts](https://code.claude.com/docs/en/desktop)
- [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode)
- [Claude mobile deep links](https://support.claude.com/en/articles/14898120-open-the-claude-mobile-app-with-a-link)
- [Claude Code issue #50176 — silent Plan exit](https://github.com/anthropics/claude-code/issues/50176)
- [Claude Code issue #2988 — unexpected auto-accept after Plan](https://github.com/anthropics/claude-code/issues/2988)
- [Kimi Code keyboard shortcuts](https://moonshotai.github.io/kimi-cli/en/reference/keyboard.html)
- [Kimi Code interaction and Plan approval](https://moonshotai.github.io/kimi-cli/en/guides/interaction.html)
- [Kimi Code Web UI](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)
- [Kimi Code built-in Plan tools](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/tools.html)
- [Kimi Code VS Code operations](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)
- [Pi agent repository](https://github.com/badlogic/pi-mono)
- [Pi plan-mode extension prior art](https://github.com/narumiruna/pi-extensions/blob/main/extensions/pi-plan-mode/README.md)
- [Happy mobile/web coding-agent client](https://github.com/slopus/happy)
- [Happy reconnect implementation](https://github.com/slopus/happy/blob/main/packages/happy-cli/src/api/apiSession.ts)
- [Happy issue #521 — stale permission mode](https://github.com/slopus/happy/issues/521)
- [Happy issue #625 — mode propagation failure](https://github.com/slopus/happy/issues/625)
- [CC Pocket mobile coding-agent client](https://github.com/K9i-0/ccpocket)
- [OpenCode native iOS client](https://github.com/grapeot/opencode_ios_client)
- [OpenCode Mobile PWA](https://github.com/newlandjia/opencode-mobile)
- [WebKit #298616 — standalone WebSocket instability](https://bugs.webkit.org/show_bug.cgi?id=298616)
- [WebKit #211018 — PWA background freeze](https://bugs.webkit.org/show_bug.cgi?id=211018)
- [Tailscale device approval](https://tailscale.com/docs/features/access-control/device-management/device-approval)
- [Tailscale — Connect to devices](https://tailscale.com/kb/1452/connect-to-devices)
- [Tailscale HTTPS certificates](https://tailscale.com/docs/how-to/set-up-https-certificates)
- [Mobbin MCP](https://mobbin.com/mcp)
- [Mobbin API quick start](https://docs.mobbin.com/api/quickstart)
