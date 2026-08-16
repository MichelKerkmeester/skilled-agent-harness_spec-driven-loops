<!-- provenance: external-CLI orchestration pass; original file iter-10-grok.md -->
> **Source pass 10** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-10-grok.md`.

<!-- F7-rich-content-blocks | model=grok | lens=interaction-gesture | iter 10/10 | 2026-08-16T04:32:50.609Z -->

# Deep-research pass 10/10 — Interaction + gesture design

Lens: every state and transition, touch targets, long-press, swipe, keyboard, focus order, and micro-interactions for Claude-parity **Command/Output**, **code**, and **text-artifact** cards on an installable iPhone PWA (React 19 + Vite + Tailwind 4 + `react-aria-components` `^1.11.0`). Read-only over already-redacted content. Reuse the F6 viewer shell.

**Method notes.** Mobbin MCP was not callable in this session (empty MCP catalog). Screen/flow citations use public Mobbin URLs. Kimi Code is a terminal TUI, not a native iOS chat app; its documented shortcuts are used as interaction analogs, not as pixel-for-pixel UI.

---

## 1. Findings (interaction-gesture)

### 1.1 The current client already fails the iPhone press model

The transcript virtualizer groups `thinking` / `tool_call` / non-error `tool_result` / `usage` into one collapsed React Aria `Disclosure` labelled `Worked · N tools` (`ActivityGroup`, default collapsed). Bash-like command and output therefore never occupy a dedicated press surface. Assistant text is a serif `<p>`; Copy/Share exist only on the whole answer via `AssistantActions`. Tool bodies are a nested `<pre>` with `max-height: 26rem; overflow: auto`. [SOURCE: `apps/pi-remote-web/src/App.tsx` ~1175–1568; `apps/pi-remote-web/src/style.css` ~1836–2052]

That nested `<pre>` is a second scrollport inside `#transcript-scroll`. On iOS, a vertical pan that starts on the pre is claimed by the inner scroller; rubber-banding at the inner edge then chains into the transcript. Expanding a card in-place also forces `@tanstack/react-virtual` to `measureElement`, which jumps the live edge. Full-screen (F6) is the only expand path that does not fight the virtualizer.

Existing targets are below Apple’s 44×44 pt recommendation and below WCAG 2.5.5 (AAA 44 CSS px), though they may still pass WCAG 2.5.8 (AA 24 CSS px) if spaced:

| Control | Computed min-height | Apple HIG 44×44 pt | WCAG 2.5.8 AA |
|---|---|---|---|
| `.turn-action` (Copy / Share) | `2rem` ≈ 32px | Fail | Pass if isolated |
| `.evidence-trigger` (Activity) | `2.25rem` ≈ 36px | Fail | Pass if isolated |
| `.scroll-to-latest` | `2.75rem` ≈ 44px | Pass | Pass |

Apple’s button guidance and Dos and Don’ts both require a 44×44 pt hit target. WCAG 2.2 AA only requires 24×24 CSS px (2.5.8); 44×44 is 2.5.5 AAA. Pi Remote’s locked bar is WCAG AA **and** iPhone-native, so **44×44 CSS px is the build floor**, not 24. [SOURCE: https://developer.apple.com/design/tips/ ; https://developer.apple.com/design/human-interface-guidelines/accessibility ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum ; https://accessibility.build/wcag/2-5-5]

`button { touch-action: manipulation; }` is already global. That removes the 300 ms tap delay and **disables double-tap-to-zoom on buttons**. Do not invent a double-tap-to-expand on the card chrome; iOS users also use double-tap to extend a text selection. [SOURCE: `apps/pi-remote-web/src/style.css` ~202–204]

`index.html` viewport is `width=device-width, initial-scale=1.0` with **no `viewport-fit=cover`**. F6 already requires `viewport-fit=cover` plus React Aria `--visual-viewport-height` (fallback `100dvh` → `100svh`). Without it, a full-screen viewer’s Close/Copy sit under the home indicator / Dynamic Island. `#root { min-height: 100dvh }` does not shrink with the software keyboard; React Aria documents `--visual-viewport-height` on `ModalOverlay` for exactly this. [SOURCE: `apps/pi-remote-web/index.html` L5; `specs/002/F6-file-preview/spec.md` L134–135; https://react-aria.adobe.com/Modal ]

Copy today calls `navigator.clipboard.writeText` then `.catch(() => undefined)` — silent failure, and the `await` sits after React state work. Safari/WebKit require **transient user activation** for clipboard writes; an intervening `await` (fetch, highlight worker, `setState`) expires that window and yields `NotAllowedError`. [SOURCE: `App.tsx` ~1403–1410; https://webkit.org/blog/10855/async-clipboard-api/ ; https://webkit.org/blog/13862/the-user-activation-api/ ; https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText ]

### 1.2 F6’s “one Button card” must not be copied onto code/command cards

F6 file cards are **one** React Aria `Button`, `onPress` on release, cancel when the pointer leaves, **no nested Copy/Share/More**, **no custom long-press**, **no swipe-down dismiss**. That is correct for a metadata card whose body is not selectable text. [SOURCE: `specs/002/F6-file-preview/spec.md` L116–127, L61–65, L199–204]

This feature’s bodies **are** selectable redacted text. Wrapping them in `usePress` / RAC `Button` is a known conflict: React Aria disables text selection on touch during press, and `useLongPress` always disables `user-select` and **suppresses the OS context/callout menu**. Adobe maintainers state the conflict explicitly: long-press *is* the iOS text-selection gesture. [SOURCE: https://react-aria.adobe.com/usePress ; https://react-aria.adobe.com/useLongPress ; https://github.com/adobe/react-spectrum/issues/2956 ; https://github.com/adobe/react-spectrum/issues/6226 ]

iOS’s native edit menu (Copy / Select / Select All) is the platform affordance ChatGPT-class apps still use for message text; Mobbin catalogs ChatGPT’s “copy / select text / …” options sheet. A PWA cannot host `UIEditMenuInteraction`, but it **can** leave the body as real DOM text so Safari’s callout appears. [SOURCE: https://developer.apple.com/documentation/uikit/uieditmenuinteraction ; https://developer.apple.com/videos/play/wwdc2022/10071/ ; https://mobbin.com/explore/screens/3e124db4-ecdb-4c3f-9101-e1c55420e1ff ]

**Implication:** toolbar Copy + Expand are RAC `Button`s; the Command/Output/`<pre>` body is **not** a button. F6’s single-button rule stays for file-preview cards only.

### 1.3 Hover-only Copy bars are a desktop pattern that fails iPhone

LibreChat added a `FloatingCodeBar` that appears **on hover or keyboard focus**. Open WebUI’s `CodeBlock.svelte` puts Copy/Collapse/Run in a persistent header. Continue’s Unified Terminal combined command+output, collapsed long logs to last N lines, and put Copy on a toolbar — then maintainers argued Copy was “not that useful in Agent mode,” which is a desktop-agent bias. [SOURCE: https://github.com/danny-avila/LibreChat/pull/11113 ; https://github.com/open-webui/open-webui/blob/9bd84258/src/lib/components/chat/Messages/CodeBlock.svelte ; https://github.com/continuedev/continue/pull/7383 ]

iPhone has no hover. WCAG 1.4.13 (Content on Hover or Focus) also forbids information that exists only while hovered. **Always-visible 44×44 toolbar** is the only pattern that survives this stack.

Claude Code’s own iOS client still lacks a per-response Copy icon (users must select text) and blanks long-running Bash cards until completion — both are documented defects, not models to copy. [SOURCE: https://github.com/anthropics/claude-code/issues/61891 ; https://github.com/anthropics/claude-code/issues/38260 ]

Mobbin’s Claude **iOS** flows are chat send/coding-input, not a published iOS artifact-viewer flow. Claude **Web** artifact/code-preview screens exist (publish dialog, code+preview, coding interface). Treat web artifacts as layout prior art; do not claim iOS parity from them. [SOURCE: https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 ; https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b ; https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 ; https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 ; https://mobbin.com/explore/screens/74973eed-0934-4bad-b8e8-504a3afe20b8 ]

### 1.4 Swipe-to-dismiss is the highest-conflict gesture on this surface

F6 forbids custom swipe-down because it collides with scrolling, selection, PDF, and image pan/zoom. Native iOS sheets have a multi-year bug: starting a drag on a `Button` inside a scroll view inside a dismissible sheet **fires the button on release**. Recreating that in CSS (`touch-action` + pointer-capture on the overlay) will reproduce it. [SOURCE: `specs/002/F6-file-preview/spec.md` L7, L65, L199–202; https://developer.apple.com/forums/thread/763436 ; https://developer.apple.com/forums/thread/775266 ; https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller ]

WCAG 2.5.1 (Pointer Gestures, A): any path-based swipe must have a **single-pointer, non-path** alternative (Close). WCAG 2.5.7 (Dragging Movements, AA): a drag-to-dismiss sheet also needs a non-drag alternative. Apple HIG Accessibility: “if you use a swipe gesture to dismiss a view, also make a button available.” iOS edge-back / browser Back is a **user-agent** gesture and is out of 2.5.1’s author scope — F6 already binds it via `history.pushState` + `popstate`. [SOURCE: https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures ; https://developer.apple.com/design/human-interface-guidelines/accessibility ; `specs/002/F6-file-preview/spec.md` L129–140 ]

PWA standalone: left-edge back exists **only if there is history**. F6’s “push one child history entry” is what makes edge-back close the viewer instead of leaving the session. Horizontal code pan must use `overscroll-behavior-x: contain` so it does not steal that edge gesture. [SOURCE: https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14 ]

### 1.5 Press cancellation, not “tap,” is the native feel

WCAG 2.5.2 (Pointer Cancellation, A) requires activation on the **up-event**, abort if the pointer leaves. React Aria `usePress` / RAC `Button` already: press starts on down, `onPress` fires on release over the target, scroll cancels press. F6 specified scale `.985` for 90–120ms, activation on release, cancel on pointer exit — match that on Copy/Expand. Current CSS already styles `button[data-pressed]`. [SOURCE: https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation ; https://react-aria.adobe.com/usePress ; `specs/002/F6-file-preview/spec.md` L125 ; `apps/pi-remote-web/src/style.css` ~213–214 ]

Do **not** complete Copy or Open on `pointerdown`. Do **not** use a custom `useLongPress` on the body (500 ms default, kills selection and the Safari callout). [SOURCE: https://react-aria.adobe.com/useLongPress ]

### 1.6 Clipboard, Share, and haptics on iOS Safari / PWA

- `writeText` must be invoked **synchronously in the press handler** with the already-in-memory redacted string. If bytes are not in memory, use `clipboard.write([new ClipboardItem({ 'text/plain': promiseToBlob })])` so the promise is inside the `ClipboardItem`, not awaited before `write`. [SOURCE: https://kian.org.uk/writing-to-clipboard-in-safari-transient-activation/ ; https://github.com/github/gh-aw/pull/2441 ]
- `navigator.permissions.query({ name: 'clipboard-write' })` throws on iOS Safari — do not gate the button on it. Feature-detect `navigator.clipboard?.writeText` as `AssistantActions` already does. [SOURCE: https://juanchi.dev/en/blog/clipboard-api-typescript-fails-undocumented-cases-copytext ]
- `navigator.share` **consumes** transient activation; Copy then Share in one gesture fails. Keep them separate presses. [SOURCE: https://webkit.org/blog/13862/the-user-activation-api/ ]
- `Navigator.vibrate` is not implemented in iOS Safari. There is no `UIImpactFeedbackGenerator` in a PWA. “Copied” must be visual + `role="status"`, never a haptic. Claude Code iOS feature request explicitly wanted “toast or haptic”; only the first is available here. [SOURCE: https://github.com/anthropics/claude-code/issues/61891 ]

Continue’s terminal copy PR also forbids prepending `$ ` to copied command text (shell-agnostic, and copy must equal received bytes). Same rule: copy the relay string, not the chrome. [SOURCE: https://github.com/continuedev/continue/pull/11429 ]

### 1.7 Bash cards must leave Activity; streaming needs a scroll latch

LibreChat groups consecutive tools into “Used N tools”; Continue groups after streaming completes and **always shows** `RunTerminalCommand` output (no chevron-only hide). Pi Remote currently hides successful bash inside Activity — that is the opposite of Claude/Kimi command visibility. Kimi Code’s documented analog is `Ctrl-O` collapse/expand **tool output**, with `Esc` closing a popup. [SOURCE: https://github.com/danny-avila/LibreChat/pull/12163 ; https://github.com/continuedev/continue/blob/d0a3c0b6/gui/src/pages/gui/ToolCallDiv/index.tsx ; https://www.kimi.com/help/kimi-code/cli-getting-started ]

Claude Code iOS: Bash cards stay blank until the command finishes. A read-only remote cannot fix host streaming, but the **UI** must still show a live region, elapsed state, and a scroll latch: follow the tail iff the output scroller is within 96 px of bottom (same constant as `TranscriptList`). [SOURCE: https://github.com/anthropics/claude-code/issues/38260 ; `App.tsx` ~1171 ]

### 1.8 Keyboard, VoiceOver, and focus — iPhone-specific

Hardware keyboard (Magic Keyboard / iPad, rare iPhone): RAC `Dialog` traps Tab; Escape closes (F6: menus first, then viewer). Do not bind Space to Close (F6). `⌘/Ctrl+C` must copy **native selection** when one exists; otherwise the focused card’s Copy. `⌘/Ctrl+F` is F6 Find on text/code. `+`/`-`/`0` are F6 image zoom only. [SOURCE: `specs/002/F6-file-preview/spec.md` L199–205 ; https://react-aria.adobe.com/Modal ]

VoiceOver two-finger Z-scrub dismisses a modal; F6 already lists it. Focus traps that listen only for `keydown` fail: VoiceOver swipe walks the accessibility tree. React Aria hides background content (`inert` / `aria-hidden`); keep that. Do not put the full document in `aria-describedby`. [SOURCE: `specs/002/F6-file-preview/spec.md` L199–206 ; https://react-aria.adobe.com/Modal ]

Apple HIG: every gesture-only action needs an on-screen control. React Aria `useLongPress` docs: the hook has **no keyboard equivalent**; authors must supply one. [SOURCE: https://developer.apple.com/design/human-interface-guidelines/accessibility ; https://react-aria.adobe.com/useLongPress ]

### 1.9 Motion budget (locked tokens)

Existing tokens: `--duration-fast: 120ms`, `--duration-state: 220ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`. F6 viewer: enter overlay + `translateY(8px→0)` 220 ms; exit 180 ms; reduced motion opacity-only ≤100 ms or instant. Press scale must stay in 0.95–1.0 (F6 `.985`; design packet forbids below `0.95`). Chevron rotation already uses `--duration-state`. [SOURCE: `apps/pi-remote-web/src/style.css` ~88–90, 1893–1901; `specs/002/F6-file-preview/spec.md` L210 ; `.claude/skills/sk-design/sk-design-interface/references/motion/micro-interactions.md` ]

Native mobile clients (Conduit / Open WebUI) get haptics; this PWA does not. Do not fake a “spring bounce” on card press. [SOURCE: https://github.com/cogwheel0/conduit ]

---

## 2. Concrete spec contribution (build-executable)

### 2.0 Hit-testing architecture (non-negotiable)

Do **not** make the card a single RAC `Button`. Structure:

```
<article class="content-card" data-kind="bash|code|artifact">  <!-- not pressable -->
  <header class="content-card-toolbar">                       <!-- 44px row -->
    <h3>…label…</h3>                                          <!-- not a button -->
    <Button Copy>  <Button Expand>                            <!-- RAC Buttons, 44×44 -->
  </header>
  <div class="content-card-body">                             <!-- selectable; overflow auto -->
    … Command <pre>, Output <pre>, code <pre><code>, artifact preview …
    [optional] <Button class="content-card-open-more">Open full screen</Button>  <!-- fade overlay -->
  </div>
</article>
```

- Body: `user-select: text`; `-webkit-touch-callout: default`; **no** `usePress` / `useLongPress`.
- Toolbar buttons: RAC `Button`, `onPress` (up-event), `shouldCancelOnPointerExit` equivalent (RAC default: leave-and-return restarts press; set cancel-on-exit **true** for Copy/Expand so a slide-off aborts).
- Whole-card tap does **nothing**. Expand is explicit.
- F6 file-preview cards remain one-button; this feature does not change that.

### 2.1 Promote bash out of Activity

Change `isEvidenceBlock` so `tool_call` + `tool_result` whose `toolName` is bash/shell/command (relay-authored allowlist, not inferred from prose) are **standalone** `RenderItem`s, same as `file_diff` / errors. Remaining grep/read/usage may stay in Activity. Continue’s split (“simple tools chevron, terminal always visible”) is the prior art. [SOURCE: https://github.com/continuedev/continue/pull/5858 ]

### 2.2 State machines

#### A. Shared card chrome

| State | Presentation | Pointer | AT |
|---|---|---|---|
| `idle` | Toolbar visible; body preview | Copy / Expand enabled if payload present | Name includes kind, language/tool, truncated/redacted |
| `pressed` | `data-pressed` on **that** button only; scale `.985` 90–120 ms | Finger down on Copy or Expand | none |
| `press-cancelled` | Return to idle | Pointer left target or scroll started | none |
| `copying` | Copy `aria-busy`; label stays “Copy” (no width jump — LibreChat lesson) | Ignore second press | polite “Copying” only if >300 ms |
| `copied` | Label “Copied” 1500 ms (existing `AssistantActions` timing); icon crossfade 180 ms | Copy disabled until revert | `role="status"`: “Copied N lines” / “Copied command” / “Copied output” |
| `copy-failed` | Label “Couldn’t copy”; 2000 ms then idle | Retry enabled | `role="alert"` once |
| `truncated-preview` | Last 8–12 lines + opaque fade; `Open full screen` 44×44 overlay button | Overlay `onPress` → viewer | Overlay name “Open full screen, {label}” |
| `opening` | Hand off to F6 `ArtifactViewerProvider` | Card inert | polite “Opening…” |
| `viewer-*` | F6 table unchanged (`closed`…`exiting`) | F6 | F6 |

Copy payload = **frozen displayed revision**, already redacted, **no `$ ` prefix**, no line-number gutter, no syntax spans. If `window.getSelection()` is non-collapsed **and** the selection is inside this card, Copy copies the selection; otherwise the whole buffer. Announce which.

Clipboard call: first line of `onPress` is `navigator.clipboard.writeText(payload)` (payload already in closure). No `await fetch`, no highlight-worker wait. If payload is a `ClipboardItem` promise (oversized, still in RAM), use `clipboard.write([item])`. On `NotAllowedError` / missing API → `copy-failed`. Never `execCommand` unless `writeText` is absent (legacy). Secure-context only (existing PWA HTTPS/tailnet).

#### B. Bash Command/Output card

| State | Command pane | Output pane | Gestures |
|---|---|---|---|
| `pending` | Command visible, wrap on | “Running…” status, empty pre, blinking caret CSS (reduced-motion: static) | Expand opens viewer on command; Copy copies command |
| `streaming` | frozen command | append-only pre; auto-scroll iff `nearBottom < 96px` | Vertical pan on output does **not** copy/open; Copy copies **current** buffer (transient activation still the press) |
| `settled` | same | full output, wrap on, `max-height: 12rem` then fade+Open | Expand opens viewer focused on Output region |
| `error` | same | `isError` styling (existing `.error-output`) | same; never folded into Activity |
| `empty-output` | command | “No output” | Copy still copies command; Expand still opens |

Command and Output are **two labelled regions**, not one mashed `<pre>`. Continue Unified Terminal is the visual analog; copy actions are **two** 44×44 buttons (“Copy command”, “Copy output”) plus one Expand. Do not put Run / Apply / Open-in-terminal — mutation / host FS is out of scope.

Viewer mapping: reuse F6 **code** renderer for command (language `bash`/`sh` if relay says so, else plain) and **text** renderer for output, **or** one shell with a RAC `ToggleButtonGroup` / tabs `Command | Output` (see §3). Default tab = Output if non-empty, else Command.

#### C. Fenced code card (assistant markdown / dedicated code block)

In-thread: language label (Inter 12/16) + Copy + Expand. Body `<pre><code>` wrap **off** (F6), `overflow-x: auto`, `overscroll-behavior-x: contain`, `touch-action: pan-x pan-y`. Syntax highlight is paint-only (`aria-hidden` on token spans if they split words; F6: decorative tokens ignored by AT). Line-number gutter `aria-hidden`, `user-select: none`.

Do not open viewer on body tap. Expand only.

#### D. Text / goal-prompt artifact card

Label (e.g. “Prompt”, “Note”, relay-authored) + 3-line clamp (`-webkit-line-clamp: 3`) + Copy + Expand. Preview is **not** a button. Clamp is CSS; full text stays in DOM for Copy (Copy must not copy only the clamped visible fragment — copy the frozen string).

### 2.3 Gesture exclusivity matrix

| Gesture | Transcript | Card toolbar | Card body | Viewer (reuse F6) |
|---|---|---|---|---|
| Tap/release | scroll-to-latest etc. | Copy / Expand | no-op (or Open-more overlay only) | Close / Copy / Wrap / Find |
| Press-and-slide-off | n/a | **cancel** | native scroll | cancel control |
| Vertical pan | transcript virtualizer | n/a | inner pre scroll; chain only at edge | content scroller; **no** dismiss |
| Horizontal pan | none | none | code: pan-x; `overscroll-behavior-x: contain` | code: pan-x; never paging artifacts (F6) |
| Long-press ≥500 ms | none | none | **native iOS selection + callout** | native selection |
| Double-tap | none (manipulation on buttons) | none | native select-word | F6 image zoom only |
| Pinch | none | none | none (browser zoom still allowed; do not `user-scalable=no`) | F6 image 1×–4× |
| iOS edge-back | session pop | n/a | n/a | F6 `popstate` close |
| VoiceOver Z-scrub | n/a | n/a | n/a | F6 dismiss |
| Escape (keyboard) | close sheets | n/a | n/a | menu then viewer |
| Swipe-down on overlay | **forbidden v1** (F6) | — | — | **forbidden v1** |

Every gesture-only path has a 44×44 visible control (WCAG 2.5.1 + HIG).

### 2.4 Touch targets and layout (390 CSS px)

- Toolbar height: `44px + env(safe-area-inset-*)` not required in-thread; in viewer use F6 56px + top inset.
- Copy and Expand: `min-width/min-height: 44px`; hit area **equals** visual bounds (Deque: expanding only the recognizer fails the spirit of the rule).
- Spacing between Copy and Expand: ≥8 px (`--space-2`) so 24 px WCAG circles cannot intersect even if a future icon shrinks.
- In-thread card radius 16px, padding 12px, min height 68px — match F6 file card chrome so the system feels one family.
- 200% text: toolbar wraps to two rows (actions row 1, title row 2) — F6 header rule reused on the card.
- `viewport-fit=cover` on the viewport meta (currently missing).

### 2.5 Keyboard and focus order

**In-thread card (Tab):** `Copy` → `Expand` → (`Open full screen` if truncated) → next card / composer. Body is not tabbable (native scroll, not a widget). Activity disclosure, if still wrapping other tools, stays a RAC `Disclosure` trigger **before** the promoted bash card.

**Viewer (F6 order, extended):** visible title (initial focus) → Close → Copy → (Share if allowed) → status actions → Command/Output tabs if any → Wrap/Find → document region. Tab wrap inside dialog. Do not bind Space to Close. Arrow keys scroll the focused scroller or move between tabs only when the tablist is focused.

**Copy shortcut:** if selection inside the dialog/card, `⌘/Ctrl+C` is native (do not `preventDefault`). If no selection and focus is on Copy or the dialog, Copy handler runs **only** when the event target is not an input.

### 2.6 Accessibility names and live regions

- Copy: `Copy command`, `Copy output`, `Copy {language} code`, `Copy {label}`; after success `Copied` (existing pattern).
- Expand: `Open {label} full screen`.
- Bash article: `Command and output, {toolName}, {pending|running|finished|failed}`.
- One throttled `role="status"` for copied / opening / streaming “Still running”. One `role="alert"` for copy-failed / F6 terminal errors.
- Streaming output: `aria-live="polite"` **off** on the pre itself (too noisy); announce at most every 5 s or on settle (“Command finished, {n} lines”).
- Background chat `inert` while viewer open (RAC Modal).
- VoiceOver custom actions (Safari limited): prefer real buttons over `aria-actions`. Do not rely on undocumented VO custom actions.

### 2.7 Visual / motion (locked ink-on-parchment)

- Card fill `--surface`, border `--line`, no Material elevation.
- Code well `--surface-code` (already); command/output share that well with a 1 px `--line` split.
- Clay `#d97757` is **not** the sole focus, error, or “running” signal (F6). Running = existing streaming dots / Inter 12 muted “Running”.
- Press: background `--surface-muted` + scale `.985` / `--duration-fast`.
- Copied: icon swap opacity+scale 180 ms `cubic-bezier(0.2, 0, 0, 1)` (design packet icon-swap); **no** blur filter on iPhone (compositor cost).
- Viewer enter/exit: F6 220 / 180 ms. Reduced motion: opacity ≤100 ms, scale 1.
- Chevron (if Command/Output in-thread collapse of output only): reuse `.evidence-chevron` 90° / `--duration-state`.
- No haptic. No confetti. No toast covering the composer; status is on the button + `sr-only` live region.

### 2.8 Viewer reuse (gesture contract)

`ArtifactViewerProvider` already specified: one modal, history-backed, focus restore to originating **control** (Expand button, then card heading, then message, then transcript). Virtualization may unmount the card — F6 fallback chain is mandatory.

`isDismissable={false}` (no backdrop tap). `isKeyboardDismissDisabled={false}`. Height: `var(--visual-viewport-height, 100dvh)`. Blur composer before open.

### 2.9 What not to build (gesture edition)

- Custom `useLongPress` to Copy or Open.
- Hover-only / opacity-0 Copy until `:hover`.
- Whole-card `onPress`.
- Swipe-down dismiss in v1.
- Horizontal swipe between artifacts.
- Double-tap expand.
- `user-scalable=no` / disabling selection.
- Vibration / fake 3D Touch peek.
- Copy after an await on a syntax-highlight worker.
- Prefixed `$ ` or line numbers in clipboard.

---

## 3. Divergent / minority ideas (do not converge yet)

1. **Header-only sheet dismiss (text/code only).** A 20 pt grabber on the viewer header with `touch-action: none`, pointer captured, vertical drag > 80 px + velocity → close; **content scrollers never attached**. F6 forbade this because of PDF/image; a **text/code-only** viewer could allow it. Native sheet+button bugs (Apple Forums) are the reason to keep it v2 and behind reduced-motion-off. Still requires Close (2.5.1 / 2.5.7).

2. **Two-step expand.** First Expand grows in-place to `min(70vh, content)` (remeasure virtualizer); second Expand or “Full screen” pushes F6. Minority because virtualizer jump is real; majority should skip to F6.

3. **Command | Output as a swipeable `TabList`.** Horizontal swipe between panes inside the viewer (not the transcript). RAC `Tabs` + keyboard arrows. Conflicts with code `pan-x` — only enable swipe when wrap is **on** and overflow-x is hidden. Kimi `Ctrl-O` analog.

4. **Selection-first, Copy-as-equivalent.** Hide the Copy button when `getSelection` is non-empty and the iOS callout is showing, to avoid two Copy affordances. Risky: callout is UA chrome the page cannot detect reliably.

5. **Always-copy-selection.** Copy button copies selection if any in-card, else all (specified above as majority). Minority inverse: Copy **always** copies all; selection uses the callout only — closer to desktop IDEs, worse on iPhone.

6. **Pin-from-Activity.** Keep bash in Activity; long-press the evidence trigger to “Show as card.” Directly violates React Aria long-press vs selection and HIG “simple gestures for frequent actions.” Reject for v1; listed to stop it reappearing.

7. **Conduit-style native haptics.** Only if a later native shell exists. PWA cannot.

8. **`contextmenu` event (iPad pointer / long-press).** RAC `Menu` with Copy / Open / Wrap. On iPhone, `contextmenu` is inconsistent with the text callout. Could be an iPad-only progressive enhancement.

9. **Sticky bottom Copy in the viewer** (LibreChat floating bar, but always visible and bottom-safe-area). Frees the header on 200% zoom. Conflicts with Find field. Worth a layout variant, not a second gesture language.

10. **Live-output “detach” chip.** When the user pans up during streaming, a 44×44 “Jump to latest” clones the transcript control inside the card. High payoff for bash; extra chrome.

11. **Do not promote bash out of Activity; instead auto-expand Activity while a command is running.** Quieter transcript, worse Claude-parity. Record as an A/B, not the default.

12. **Medium detent (80%) instead of full-screen** for short artifacts. F6 locked full-screen for every renderer on iPhone. A short 6-line prompt in a 80% sheet feels more iOS; a 2 000-line log does not. Could branch on `byteLength < 4 KiB`.

---

## 4. Open questions + risks

| ID | Question / risk | Why it blocks “flawless” |
|---|---|---|
| Q1 | Relay: is bash identity a stable `toolName` allowlist, or must the client pair consecutive `tool_call`+`tool_result`? | Wrong pairing = Copy copies the wrong buffer. |
| Q2 | Are fenced code blocks in `text` markdown, or a future block kind? | Gesture spec assumes a card; markdown-inline code cannot host a 44×44 toolbar without breaking serif prose. |
| Q3 | Viewer history vs session route: one extra `pushState` while a composer sheet is open — which pops first on edge-back? | Can close the session instead of the artifact. |
| Q4 | Virtualizer unmount during `copied` 1500 ms — live region and button state die. | Need copied state on the provider, not the row. |
| Q5 | Streaming `tool_result.output` replacement vs append. | Auto-scroll latch and Copy-during-stream semantics. |
| Q6 | Truncation: copy full relay string or visible excerpt? F6 copies received content and banners excerpts. | Must match redaction policy; never reconstruct. |
| Q7 | `viewport-fit=cover` + `apple-mobile-web-app-status-bar-style: default` vs `black-translucent`. | Close button vs status bar overlap in standalone. |
| Q8 | iOS 18+ button-inside-scroll-inside-sheet bug if v2 adds swipe-down. | High; keep v1 Close-only. |
| Q9 | Syntax highlighter mutating DOM after Copy snapshot. | Copy must read the frozen string, not `innerText`. |
| Q10 | Nested `overflow: auto` + iOS scroll chaining: should in-thread pre be **non-scrolling** (clamp + Open only)? | Eliminates the worst gesture bug at the cost of in-thread readability. Strong v1 option. |
| Q11 | Hardware keyboard `⌘C` vs VoiceOver + selection. | Test on real device; cannot be simulated in jsdom. |
| Q12 | Mobbin Claude iOS artifact screens were not inspectable via MCP this pass. | Visual chrome (icon placement) still needs a locked screenshot pass against Claude iOS / Kimi chat iOS if that is the literal bar. |
| R1 | Current Copy swallows errors — shipping the same pattern on every card hides Safari activation failures. | |
| R2 | 32 px Copy on answers already violates the iPhone bar; new cards must not inherit `.turn-action`. | |
| R3 | Activity collapse is the primary reason bash never feels like Claude, regardless of motion polish. | |

---

## 5. Sources

### Product / codebase
- `specs/002/F6-file-preview/spec.md`
- `apps/pi-remote-web/src/App.tsx`
- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/index.html`
- `apps/pi-remote-web/package.json` (`react-aria-components` ^1.11.0)
- `packages/pi-rpc-protocol/src/types.ts` (`tool_call` / `tool_result` / `file_diff`)

### Apple / iOS
- https://developer.apple.com/design/tips/
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/human-interface-guidelines/components/menus-and-actions/buttons
- https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller
- https://developer.apple.com/documentation/uikit/uieditmenuinteraction
- https://developer.apple.com/videos/play/wwdc2022/10071/
- https://developer.apple.com/videos/play/wwdc2021/10063/
- https://developer.apple.com/forums/thread/763436
- https://developer.apple.com/forums/thread/775266
- https://docs.deque.com/devtools-mobile/2025.7.2/en/ios-touch-target-size/

### WCAG / ARIA
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures
- https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation
- https://accessibility.build/wcag/2-5-5
- https://accessibility.build/wcag/2-5-8

### React Aria / WebKit / Clipboard
- https://react-aria.adobe.com/Modal
- https://react-aria.adobe.com/usePress
- https://react-aria.adobe.com/useLongPress
- https://github.com/adobe/react-spectrum/issues/2956
- https://github.com/adobe/react-spectrum/issues/6226
- https://webkit.org/blog/10855/async-clipboard-api/
- https://webkit.org/blog/13862/the-user-activation-api/
- https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
- https://w3c.github.io/clipboard-apis/
- https://kian.org.uk/writing-to-clipboard-in-safari-transient-activation/
- https://github.com/github/gh-aw/pull/2441
- https://gist.github.com/fozzedout/5e77925381991a9570151550992baf14

### Mobbin (public catalog; MCP unauthenticated this pass)
- https://mobbin.com/explore/flows/9a6c28e2-9e3a-43e6-9025-ee08ce863f57 — Claude iOS chatting (text)
- https://mobbin.com/explore/flows/b29dd132-8270-4d13-996f-aa4a4a881b5b — Claude iOS chatting (coding input)
- https://mobbin.com/explore/screens/36894d50-1a68-4142-8907-ad5623a47fc7 — Claude Web publish artifact
- https://mobbin.com/explore/screens/1a33eaae-c123-4c39-82bc-e42df38209d3 — Claude Web code preview
- https://mobbin.com/explore/screens/74973eed-0934-4bad-b8e8-504a3afe20b8 — Claude Web coding interface
- https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1 — ChatGPT iOS chat
- https://mobbin.com/explore/flows/c10d00f2-0cf7-44e1-b6c0-cb5826f8e227 — ChatGPT iOS share flow
- https://mobbin.com/explore/screens/f39d9ae0-cd9d-4117-af0f-bc5391bbe733 — ChatGPT iOS share options
- https://mobbin.com/explore/screens/3e124db4-ecdb-4c3f-9101-e1c55420e1ff — ChatGPT Android copy/select options

### Coding-agent / chat clients (GitHub + docs)
- https://github.com/open-webui/open-webui/blob/9bd84258/src/lib/components/chat/Messages/CodeBlock.svelte
- https://github.com/danny-avila/LibreChat/pull/11113
- https://github.com/danny-avila/LibreChat/pull/12163
- https://github.com/danny-avila/LibreChat/discussions/9602
- https://github.com/continuedev/continue/blob/d0a3c0b6/gui/src/pages/gui/ToolCallDiv/index.tsx
- https://github.com/continuedev/continue/pull/5858
- https://github.com/continuedev/continue/pull/7383
- https://github.com/continuedev/continue/pull/4565
- https://github.com/continuedev/continue/pull/11429
- https://github.com/cogwheel0/conduit
- https://github.com/anthropics/claude-code/issues/61891
- https://github.com/anthropics/claude-code/issues/38260
- https://code.claude.com/docs/en/artifacts
- https://github.com/MoonshotAI/kimi-code
- https://www.kimi.com/help/kimi-code/cli-getting-started
- https://www.kimi.com/code
