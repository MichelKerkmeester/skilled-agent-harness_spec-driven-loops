<!-- provenance: external-CLI orchestration pass; original file iter-08-grok.md -->
> **Source pass 8** — executor: Grok 4.6 xhigh (cli-cursor). Independent, cited pass under a rotating lens. Migrated from `iter-8-grok.md`.

<!-- F4-plan-mode-tab | model=grok | lens=visual-motion | iter 8/10 | 2026-08-15T20:43:06.338Z -->

# Visual-motion research — plan mode (iteration 8 of 10)

Lens: how Pi Remote should **look and move** in the locked ink-on-parchment system (light + dark, WCAG AA, React 19 + Vite + Tailwind 4 + react-aria-components) so plan entry/exit, persistent status, a hardware-keyboard Tab affordance, and the plan → execute handoff reach Claude iOS / Kimi Code quality. Security and protocol are treated as fixed; this pass only specifies the visual/motion surface.

---

## 1. Findings for this lens

### 1.1 The target bar is not “Claude chat.” It is Claude Code + Kimi Code

The consumer Claude iOS chat app (serif prose, clay send circle, `+` tools, no assistant bubble) is the **silhouette** for Pi Remote’s composer, but it does **not** expose a coding plan mode. Anthropic documents plus/options, dictation, and voice on mobile chat — not a Build/Plan switch. ([Claude Help: Get started](https://support.claude.com/en/articles/8114491-get-started-with-claude); [IXD@Pratt Claude Mobile critique](https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/); Mobbin Claude chat-detail: [screen 63d3bc73](https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8).)

The **mode signal** to copy lives on the coding surfaces:

| Surface | Where mode lives | What “Plan” looks like | Motion / persistence |
|---|---|---|---|
| Claude Code CLI | Bottom status bar | Gray `⏸ plan mode on` (pause glyph + words) | Instant on `Shift+Tab`; no layout animation ([permission-modes](https://code.claude.com/docs/en/permission-modes)) |
| Claude Desktop / claude.ai / **mobile Remote Control** | **Mode dropdown next to the send control** | Label `Plan`; Plan is **session-only** (other modes remember per folder) | Selector, not a wash ([desktop](https://code.claude.com/docs/en/desktop); [permission-modes](https://code.claude.com/docs/en/permission-modes) mobile tab) |
| Kimi Code TUI | Prompt glyph + status bar | Prompt becomes `📋`; **blue `plan` badge** in the status bar | `Shift-Tab` toggle ([Kimi work modes](https://www.kimi.com/help/kimi-code/cli-work-modes); [interaction](https://www.kimi-cli.com/en/guides/interaction.html)) |
| Kimi Code **Web UI** (the mobile-relevant peer) | Input toolbar + composer chrome | Mutually exclusive **plan/goal pills left of input**, dismiss with `×`; **dashed blue border on the composer** while plan is active; work-status pills **above** the field, restyled borderless-rounded | Pill arms immediately; **mode takes effect on send** ([kimi-web.html](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html) § Prompt toolbar; [CHANGELOG #2922](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)) |
| OpenCode | Bottom of chat, next to model | Build / Plan selector; **Tab** switches agents | Users treat a missing toggle as a P0 ([opencode README](https://github.com/anomalyco/opencode); [issue #37070](https://github.com/anomalyco/opencode/issues/37070)) |
| Cline | Slider on the chat textarea | Plan = VS Code **warning-badge yellow**; Act = **focus-border blue** | Color-only. Filed as a11y failures in high-contrast and for screen readers ([cline#9179](https://github.com/cline/cline/issues/9179), [cline#4932](https://github.com/cline/cline/issues/4932)) |

**Implication:** matching “Claude iOS + Kimi Code” means Claude’s **quiet composer** plus Kimi/Claude Code’s **always-visible mode chrome**. It does **not** mean flooding the parchment canvas with clay.

### 1.2 Mobile AI apps signal “a distinct mode” with a chip in the composer toolbar — never with a page theme

Grounded mobile pattern (same 390 pt column Pi Remote targets):

- **Gemini iOS:** active search/research is a **blue pill in the composer toolbar** (after `+`), dismissible, sitting beside a ghost `Fast` speed pill. Plan/research artifacts are **cards in the transcript**, not a restyled app shell. Local teardown: `docs/design-reference/mobile-chat-apps/01-visual-teardown.md` (`screens/gemini-research-plan.png`); help: [Gemini iPhone get started](https://support.google.com/gemini/answer/14554984?co=GENIE.Platform%3DiOS); Mobbin Gemini home: [screen 2ec379b4](https://mobbin.com/explore/screens/2ec379b4-48e9-46bd-a332-d84086092f78).
- **ChatGPT iOS:** idle composer is quiet; tool/mode chips (`Search`, `Think`, `Deep research`) appear **only when armed**, above/inside the field. ([research-gpt-luna.md](docs/design-reference/mobile-chat-apps/research-gpt-luna.md); Mobbin composer: [screen f7e6514e](https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1).)
- **DeepSeek iOS:** `DeepThink` and `Search` sit **directly above/inside the composer** as persistent toggles. ([AI UX Playground DeepSeek composer](https://aiuxplayground.com/teardowns/deepseek/composer/); Mobbin: [screen 9fa85a22](https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4).)
- **Meta AI iOS:** `Fast` speed pill lives in the composer’s right cluster. (Local teardown §2.)

Common recipe: **one compact chip, attached to the composer, absent in the default idle state, never a full-screen tint.** That matches the council already on file: Build is visually implicit; Plan shows one `Plan · read-only` chip beside `+`. ([council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md) §3.)

### 1.3 Clay cannot carry plan mode — the token system already spent it

Locked palette (`apps/pi-remote-web/src/style.css`):

| Token | Light | Dark | Current job |
|---|---|---|---|
| `--accent` `#d97757` | clay | clay | **Send circle fill** (`.composer-primary.is-send`) |
| `--accent-ink` `#8a452f` / `#f0b19a` | clay text | peach text | Plan-block headers, agent-running icon |
| `--accent-soft` `#f3e4de` / `#3a2720` | peach wash | dark clay wash | **Also `--warning-soft`** |
| `--warning` | **identical to `--accent-ink`** | same | Warnings |
| `--action-bg` | carbon `#121212` / bone `#f4f1eb` | Stop circle |

Three collisions:

1. **Send vs Plan.** Apple HIG: keep prominent (accent-filled) buttons to **one or two per view**. ([HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons).) The send circle already owns clay. A clay-filled plan chip next to it reads as a second primary.
2. **Plan vs Warning.** `--warning` / `--warning-soft` are the same hexes as `--accent-ink` / `--accent-soft`. A clay plan chip is indistinguishable from an error/warning pill.
3. **Dark-mode disappearance.** Proposed chip fill `--accent-soft` `#3a2720` on tray `--surface` `#24221f` is two near-black browns (≈1.1:1). WCAG 1.4.11 needs **3:1** for component boundaries. ([Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).) Light fill `#f3e4de` on tray `#ffffff` is equally weak as a silhouette unless a **1 px border** is added. Contrast tests already prove `--accent-ink` on **canvas** (`#f8f8f6` / `#181715`) ≥ 4.5:1 (`apps/pi-remote-web/tests/contrast.test.tsx`) — they do **not** prove chip-fill vs tray.

Cline already burned this exact mistake: Plan = warning yellow, Act = focus blue, **color as the only differentiator**, then filed a11y bugs. ([cline#9179](https://github.com/cline/cline/issues/9179); Apple [Differentiate Without Color](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/differentiate-without-color-alone-evaluation-criteria/).)

Kimi’s strongest **non-color** signal is the one to translate: **a dashed composer border** ([kimi-web.html](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html)). Pi Remote already has dashed parchment language for empty states (`.empty-state { border: 1px dashed var(--line-strong) }` in `style.css`). Reuse that stroke on `.composer-tray[data-mode='plan']` — carbon dashed, **not** Kimi blue, **not** clay fill.

### 1.4 Current UI: the visual system for plan mode is half-built and unstyled

| Fact | Evidence |
|---|---|
| Build/Plan lives only inside the `+` popover | `SessionComposer.tsx` `ComposerTools` — `ToggleButtonGroup` `aria-label="Build or Plan"` |
| `plan` and `executing-plan` share one visual | `planActive = state?.mode === 'plan' \|\| state?.mode === 'executing-plan'` in both `SessionComposer.tsx` and `RuntimeStrip.tsx` |
| Persistent chip CSS exists, **is never mounted** | `.composer-plan-chip` in `style.css` (~1426); **zero TSX references** |
| Segmented control has **no CSS** | `className="tools-mode"` is not defined anywhere in `style.css` |
| Host-confirmed, not optimistic | `RuntimeStrip` comment; council: no optimistic labels |
| `RuntimeStrip` is unmounted from the session screen | `App.tsx` renders `SessionComposer` only; strip remains in tests |
| Plus hit target is **40 px** (`2.5rem`), under iOS 44 pt | `.composer-plus` 2.5rem; HIG default 44×44 pt ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)) |
| Chip type is **11.5 px / 650** | `.composer-plan-chip { font-size: 0.72rem }` — below 12 px and below Apple’s 17 pt small-text band that still requires 4.5:1 |
| Transcript plan list already uses clay **numbers**, not a mode banner | `.plan-list li > span { color: var(--accent-ink) }` |
| Reduced-motion nuke already exists | `@media (prefers-reduced-motion: reduce)` sets `animation/transition-duration: 0.01ms` globally (`style.css` ~2287) |
| Motion tokens already match the Product register | `--duration-fast: 120ms`; `--duration-state: 220ms`; `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (= motion-strategy ease-out-quint). Product dial: **150–250 ms state transitions, no page-load choreography** (sk-design register) |
| A second status strip already exists | `.session-statusline` (0.75 rem muted, centered, agent-dot). Duplicating “Plan” here **and** as a chip is two persistent statuses |

Council already specified the missing chip and `executing-plan` → `Plan running` (disabled). That step is listed, not shipped. ([council-gpt-sol.md](docs/design-reference/mobile-chat-apps/council-gpt-sol.md) lines 45–47, 362.)

### 1.5 Motion: frequency + keyboard rule say almost none; Kimi/Claude agree

sk-design animation gate (must run before easing):

- **100+/day or keyboard-initiated → no animation.** Tab/Shift-Tab is a power-user shortcut. Animating it is a delay inserted where the user asked for none. ([animation-decision-framework.md](`.claude/skills/sk-design/sk-design-interface/references/motion/animation-decision-framework.md`) §§2–3.)
- Product surface budget: **150–250 ms** for pointer-driven state, compositor props only (`transform`/`opacity`; color allowed if short and bounded). ([motion-strategy.md](`.claude/skills/sk-design/sk-design-interface/references/motion/motion-strategy.md`); [performance-reduced-motion.md](`.claude/skills/sk-design/sk-design-interface/references/motion/performance-reduced-motion.md`).)
- Apple: do not use motion for its own sake; Reduce Motion must replace **scale/spin/parallax/z-depth** with **cross-fade / color / dissolve 0.15–0.2 s**, not delete meaning. ([HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility); [App Store Reduce Motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/); WWDC19 Visual Design and Accessibility.)
- WCAG 2.3.3 (AAA): interaction-triggered motion must be disableable unless essential. Honoring `prefers-reduced-motion` is the documented technique. ([Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).) Pi Remote already does this globally.

Claude CLI and OpenCode **do not animate** mode changes. Kimi Web’s dashed border is a **paint change**, not a layout move. That is the correct register.

**Do not** scale the tray, slide a banner from the top, pulse clay, or FLIP the send button into a lock. Those fail the frequency gate, Apple vestibular rules, and the parchment voice.

### 1.6 Tab on iPhone is a visual problem, not just a keybinding problem

- iOS soft keyboards have **no Tab** (given).
- With a hardware keyboard, **Tab inside a focused `<textarea>` is often swallowed by iOS** (system focus navigation); `keydown` for Tab may not reach the page. Long-standing reports: [iOS Bluetooth keyboard Tab](https://stackguides.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event); related iOS key-event gaps in web editors ([Monaco#293](https://github.com/microsoft/monaco-editor/issues/293)).
- Claude Code uses **`Shift+Tab`** (status-bar cycle). OpenCode and Cline use **`Tab`**. Kimi uses **`Shift-Tab`**. Pi’s own upstream has **no built-in plan mode**; the community package `@kmiyh/pi-plan-mode` binds **`Ctrl+Alt+P`**, not Tab ([npm](https://www.npmjs.com/package/@kmiyh/pi-plan-mode); [pi-mono](https://github.com/badlogic/pi-mono)).
- Showing a permanent `⇥ Tab` kbd hint in the iPhone composer is **false affordance** for the 90% soft-keyboard sessions. Kimi Web keeps 16 px input to avoid iOS auto-zoom and does **not** paint keyboard chords in the mobile composer ([CHANGELOG: 16 px inputs](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)).

Visual rule: **the chip and dashed border are the always-on status.** The Tab hint is a **caption inside the tools popover** (and a `aria-keyshortcuts` on the group), revealed as a one-line toast **only after a hardware Tab event is actually received**. Never decorate the idle iPhone tray with a shortcut the OS will not deliver.

### 1.7 Plan → execute is a **card + verb**, not a mode animation

Kimi Web: `ExitPlanMode` opens an **approval panel** with plan body + 2–3 labeled approaches; Approve exits plan and runs; Reject stays; Revise resubmits; `Ctrl-E` full-screen pager. ([work modes](https://www.kimi.com/help/kimi-code/cli-work-modes).) Changelog: “Show the plan body and approach choices in the **plan review card** when exiting plan mode.” ([#1101](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md).)

Claude Code: research, write a plan, **no source edits** until approve; `Ctrl+G` opens the plan in an editor; Plan is session-scoped. Status stays `⏸ plan mode on` until exit. ([permission-modes](https://code.claude.com/docs/en/permission-modes); [common-workflows](https://code.claude.com/docs/en/common-workflows).)

Pi Remote already has three host modes: `build` | `plan` | `executing-plan` (`RUNTIME_MODES` in `packages/pi-rpc-protocol/src/types.ts`). The visual gap is that **plan and executing-plan render identically**. The handoff should be:

- **Plan (read-only):** dashed tray + chip `Plan` + transcript `.block-plan` as a **document** (serif body already on assistant prose).
- **Handoff:** the plan **card** grows a single carbon (`--action-bg`) **Execute** control — not a second clay send. Host `set_mode('build')` / `executing-plan` is the mutation; UI waits for host confirmation (existing fail-closed rule).
- **Executing:** dashed → **solid** `--ink` 1.5 px (stroke language: dashed = cannot write, solid = writing). Chip copy `Plan running`, control disabled. Reuse existing `.agent-dot.agent-running` (already clay) rather than a new spinner on the chip.
- **Done:** solid → default hairline; chip unmounts. No confetti, no canvas flash.

Kimi’s “arm pill, activate on send” is a **different state machine** than Pi’s host-confirmed session mode. Do not copy the arming delay into visuals unless protocol changes; the chip must reflect **host** `runtime.state.mode` only.

### 1.8 Typography and spacing that actually match this system

Measured Claude composer (local research): 17–18 pt sans in the field, 28–32 pt tray radius, 44 pt hits, 14–16 pt internal pad. Pi today: `.composer-input` **1.0625 rem (17 px)** Inter, tray radius **1.75 rem (28 px)**, plus **40 px**. Kimi Web explicitly keeps inputs at **16 px** on iOS to prevent auto-zoom ([CHANGELOG](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)) — Pi is already at 17 px, which is the safe side.

Plan-mode type roles:

| Role | Face | Size / weight | Why |
|---|---|---|---|
| Composer input | Inter (`--font-sans`) | 1.0625 rem / 400, line-height 1.5 | Unchanged. Serif in the field fights the send cluster and triggers iOS zoom if dropped below 16 px |
| Plan chip label | Inter | **0.75 rem (12 px) / 600**, not 0.72 rem / 650 | 12 px is the floor for AA UI type; 600 not 650 avoids “all-caps HUD” next to `.tools-label` which is already 0.68 rem uppercase |
| Tools popover “Mode” eyebrow | Inter | 0.68 rem / 680 / 0.04 em / uppercase | Keep — this is the section label, not the status |
| Placeholder in plan | Inter italic **or** Source Serif 4 at same 17 px | Copy change > face change | Copy is the non-color signal: `Ask for a plan · read-only` |
| Disclaimer in plan | Inter | 0.75 rem / `--ink-muted` | Replace always-on “actions stay read-only” (true in every mode) with `Plan mode · Pi cannot edit files` |
| Plan artifact in transcript | Source Serif 4 on assistant prose (already 1.1875 rem / 1.62) + Inter for the card header | Keep clay **only** on step indices | Document in the flow, control in the tray — Claude’s split |
| Tab hint in popover | Inter tabular, 0.6875 rem | Render as a 20×20 kbd (`border: 1px solid var(--control-border); border-radius: 4px`) | Hardware-only caption |

Spacing (4 px grid already in tokens `--space-1`…`--space-4`):

- Chip: `min-height: 44px` on `(pointer: coarse)`; visual height 28 px on fine pointer (Apple allows 28 pt minimum, 44 pt default).
- Gap `+` → chip: `--space-2` (8 px). Centers of plus (44) and chip (≥44) stay ≥ 60 pt apart if the chip is not jammed into the plus — HIG asks 60 pt center spacing for look-at targets on some platforms; on iPhone thumb-row, **8 px gap + 44 hits** is the Claude/Gemini toolbar rhythm.
- Do not let the chip wrap under the textarea; pin it in `.composer-left` with `flex-wrap: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 42vw`.

---

## 2. Concrete spec a build phase can execute

**Register:** Product. **Motion dial:** 120 ms feedback / 220 ms pointer state / **0 ms keyboard**. **Color strategy:** Restrained — clay stays send-only. **Proof:** 390×844 light + dark, idle / plan / pending / executing-plan / reduced-motion, plus VoiceOver on the chip.

### 2.1 States (host-confirmed only)

Bind `data-mode` on `.composer-tray` and `data-runtime-status` from `runtime.status`. Never paint `plan` until `runtime.state.mode` says so.

| `mode` | `runtime.status` | Tray | Chip (in `.composer-left`, after `+`) | Placeholder | Disclaimer | Mode control |
|---|---|---|---|---|---|---|
| `build` or `unknown` | ready | Solid `1px var(--line-strong)`, `--surface` fill, radius 1.75 rem (unchanged) | **Unmounted** | `Reply to Pi` | `Pi can make mistakes · actions stay read-only` | Popover segment: Build selected |
| `plan` | pending (set_mode in flight) | Keep **previous** `data-mode` (no optimistic dash) | Keep previous chip; `aria-busy="true"`; opacity 0.55 | Unchanged | Unchanged | Both segments disabled |
| `plan` | ready | `border: 1.5px dashed var(--control-border)` | Outlined pill, mounted | `Ask for a plan` | `Plan mode · Pi cannot edit files` | Plan selected; label `Plan · read-only` |
| `executing-plan` | ready | `border: 1.5px solid var(--ink)` (dashed → solid) | Same pill, copy `Plan running` | `Steer Pi, or send after this turn` (existing running copy) | `Executing plan · still host-confirmed` | Group **disabled** until host returns to `build` or `plan` |
| any | stale / error | Unchanged geometry | Chip if last confirmed was plan; 1 px `--danger` hairline on chip only | Unchanged | Unchanged | Disabled; `tools-status` already has `Unavailable — reconcile` |

**Pending is opacity, not a spinner on the chip.** The send control already owns the spinner (`.composer-spinner`). Two spinners violate “one focal motion.”

### 2.2 Chip anatomy (replace unused `.composer-plan-chip`)

```
[+ 44]  [ lock 12  "Plan" ]     …     [send 44]
         outlined pill
```

CSS (token-exact):

```css
.composer-plan-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 2.75rem;          /* 44px */
  padding: 0 var(--space-3);
  border: 1px solid var(--control-border);
  border-radius: 999px;
  background: var(--canvas-subtle);   /* NOT accent-soft */
  color: var(--ink);                  /* NOT accent-ink */
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
}
.composer-plan-chip[data-executing] {
  border-color: var(--ink);
  color: var(--ink-secondary);
}
.composer-plan-chip .plan-lock { width: 12px; height: 12px; }
```

- **Lock glyph** (14×14, 1.5 px stroke, currentColor) — non-color status. Apple: symbols, not color alone.
- **No × on the chip.** Gemini’s search chip uses × because search is a tool overlay. Plan is a **session permission**. Dismissing with × would look like Kimi’s *armed-but-not-sent* pill and fight fail-closed `set_mode`. Tap/click the chip → **reopen** `ComposerTools` (council). Long-press is not required.
- Contrast pairs to add to `contrast.test.tsx`: `--ink` on `--canvas-subtle` (light `#121212`/`#efeeeb`, dark `#f4f1eb`/`#1f1e1b`); `--control-border` on `--canvas-subtle` ≥ 3:1.

### 2.3 Tools popover segmented control (currently unstyled)

`.tools-mode` must become a 44 px-tall RAC `ToggleButtonGroup`:

- Track: `--surface-muted`, radius `--radius-control` (0.625 rem), padding 2 px, `display: grid; grid-template-columns: 1fr 1fr`.
- Unselected: transparent, `--ink-muted`, weight 500.
- Selected (`[data-selected]`): `--surface-raised`, `--ink`, weight 600, **1 px `--line`**, **no clay fill**. Optional 12 px book/list glyph on Plan only.
- Pressed: background `--canvas-subtle` (not the same as selected — Cline’s hover/selected collision).
- Focus-visible: existing 2 px `--focus` offset 2 px.
- Helper under the group, 0.72 rem `--ink-muted`: `Hardware keyboard: Tab` (see 2.6). Do not put `Shift+Tab` unless that is the bound key; OpenCode/user bar is Tab.

### 2.4 Gestures / input

| Input | Behavior | Motion |
|---|---|---|
| Tap `+` | Open tools popover (`placement="top start"`, existing) | Pointer: 220 ms opacity 0→1, **no Y translate**, `--ease-out`. Keyboard/VO: **instant** |
| Tap Build / Plan in group | `setMode`; popover may stay open until host confirms, then close | Instant label; tray/chip wait for host |
| Tap chip | Reopen tools popover | Same as `+` |
| Hardware `Tab` (capture on `window`, not only textarea) | Toggle plan ↔ build via `setMode`; `preventDefault` only if the event fired and target is the session composer | **0 ms**. Then host-confirmed paint |
| Soft keyboard | No Tab. Chip + `+` only | — |
| Plan card primary | `Execute plan` → `setMode('build')` after host path; do not submit the composer | Instant disable + pending opacity on the card button |

### 2.5 Motion table (pointer vs keyboard vs reduced)

| Event | Pointer / touch | Hardware Tab | `prefers-reduced-motion: reduce` |
|---|---|---|---|
| Chip mount | 220 ms opacity only (no `translate`, no `scale`) | Skip enter; chip appears in the next frame | Instant (existing 0.01 ms nuke) |
| Tray solid → dashed | 220 ms `border-color` + `border-style` (paint) | Instant | Instant |
| Dashed → solid (executing) | 220 ms `border-style`/`border-color` | Instant | Instant |
| Chip unmount | 160 ms opacity (≈75% of enter, per motion-strategy) | Instant | Instant |
| Send press | existing 120 ms background | n/a | Instant |
| Decorative pulse / shimmer / clay wash / tray scale | **Forbidden** | Forbidden | Forbidden |

Properties: `opacity`, `border-color`, `background-color` only. **Never** `transition: all`. **Never** `filter`/`blur` (Apple Reduce Motion: avoid animating into blurs). Backdrop-filter on `.session-header` stays; do not add it to the tray.

### 2.6 Tab affordance (visual only)

1. `aria-keyshortcuts="Tab"` on the mode `ToggleButtonGroup`.
2. Popover caption: `Tab toggles Plan on a hardware keyboard.`
3. After a **successful** host-confirmed toggle that originated from `keydown.key === 'Tab'`, show a 1.2 s status in existing `.tools-status` / `role="status"`: `Plan on` / `Build on`. No extra toast layer.
4. Do **not** render `<kbd>Tab</kbd>` in the tray on `(pointer: coarse)` unless a Tab keydown was seen this session (`data-has-hardware-tab` on `<main>`).
5. If Tab is swallowed (no event), the chip is still the status; no dead hint.

### 2.7 A11y

- Group: RAC `ToggleButtonGroup` `selectionMode="single"` `disallowEmptySelection` (already) — this is the radiogroup pattern Cline is migrating to ([cline#4932](https://github.com/cline/cline/issues/4932)).
- Chip: `<button>` (or RAC `Button`) `aria-pressed="true"` `aria-label="Plan mode, read-only. Open mode menu."` Executing: `aria-disabled="true"` `aria-label="Plan running. Mode locked until the host finishes."`
- Live region: existing `.tools-status` `aria-live="polite"` announces `Plan on` / `Plan running` / `Build on`. Do not add a second live region (statusline already `aria-live="polite"`).
- Differentiate without color: lock glyph + the word Plan + dashed vs solid stroke.
- Hit targets: plus and chip 44×44 on coarse pointer; bump `.composer-plus` from 2.5 rem to 2.75 rem.
- Focus: chip is in tab order after plus, before textarea, so hardware Tab-as-shortcut must be captured in **capture phase** and not steal focus from the field.
- Contrast: chip text 4.5:1; chip outline 3:1; dashed tray border uses `--control-border` which is already tested ≥ 3:1 vs canvas.

### 2.8 Light / dark (exact)

| Element | Light | Dark |
|---|---|---|
| Tray fill | `--surface` `#ffffff` | `--surface` `#24221f` |
| Plan dash | `--control-border` `#7b7974` | `--control-border` `#807a70` |
| Executing solid | `--ink` `#121212` | `--ink` `#f4f1eb` |
| Chip fill | `--canvas-subtle` `#efeeeb` | `--canvas-subtle` `#1f1e1b` |
| Chip text | `--ink` `#121212` | `--ink` `#f4f1eb` |
| Send (unchanged) | clay `#d97757` + `#fff` | clay `#d97757` + `#fff` |
| Execute on plan card | `--action-bg` / `--action-fg` (carbon, inverse of theme) | same tokens |

Do not introduce a new hue. Do not use `--success` for executing (that color means **done** in `.plan-list .done`).

### 2.9 Plan artifact + Execute (handoff)

`.block-plan` stays a promoted card (council). Add a footer **only when** `mode === 'plan'` and the block is the latest plan:

- Button label: `Execute this plan`
- Visual: full-width-in-card, height 44, radius `--radius-control`, `--action-bg` fill, `--action-fg` label, Inter 0.875 rem / 600. **Not clay.**
- Helper: `Leaves plan mode. Host must confirm.` 0.72 rem `--ink-muted`.
- Motion: none beyond existing disabled opacity 0.4.
- After host `executing-plan`, replace the button with a quiet line `Running on host…` (no spinner; agent-dot in the statusline already runs).

### 2.10 What not to build

- Clay wash / parchment-to-peach canvas.
- Header “PLAN” eyebrow in Source Serif.
- Mode selector next to send (Claude Desktop). On this tray the send circle is the only clay; crowding it fails HIG “one prominent button.”
- Kimi “arm on /plan, activate on send” unless protocol grows an armed state.
- Sliding banners, haptic-looking CSS shakes, looping dashed-offset animation (`stroke-dashoffset` march fails Reduce Motion and 2.3.3).

---

## 3. Divergent / minority ideas worth considering

These resist the chip-beside-plus default. Each is grounded; none is the recommended ship path without an extra decision.

**A. Manuscript margin instead of a chip.** A 3 px `--ink` bar on the **leading edge** of `.composer-tray` (like a notebook rule). Zero extra hit target, zero wrapping at 320 px. Weaker discoverability (OpenCode users could not find a hidden toggle). Pair with placeholder copy if tried.

**B. Put the mode selector next to send, Claude Code Desktop style.** Official: “mode selector next to the send button” on desktop and “dropdown next to the prompt box” on claude.ai / mobile Remote Control. ([desktop](https://code.claude.com/docs/en/desktop); [permission-modes](https://code.claude.com/docs/en/permission-modes).) On Pi Remote this fights the clay send morph (send/steer/stop). Only viable if send becomes carbon and clay moves to the mode chip — a brand inversion.

**C. Kimi arm-then-send pills.** Plan is a removable pill; host mode flips only when the message is sent ([CHANGELOG #2922](https://github.com/MoonshotAI/kimi-code/blob/main/apps/kimi-code/CHANGELOG.md)). Better for “this one prompt is a plan.” **Conflicts** with extension-enforced session plan mode (tools already stripped). Would need an `armed` client state the host does not have.

**D. Serif placeholder / serif chip.** Source Serif 4 on `Ask for a plan` would rhyme with assistant prose. Risk: iOS still fine at 17 px, but the field would look like the model is already speaking. Stronger as a **one-line plan title** above the tray (Kimi work-status pills) than inside the input.

**E. Statusline takeover.** Paint `Plan · read-only` in `.session-statusline` (already `aria-live`) and skip the chip. Matches Claude CLI’s bottom bar. On a phone, the statusline is easy to miss under the header blur; Gemini/Claude chat put mode on the **composer**, not the top.

**F. Execute as composer send relabel.** While a plan card is on screen, the clay circle becomes `Execute` (still clay). One thumb target. High mis-tap risk vs “send a planning question.” Kimi keeps Approve **off** the composer, on the review card.

**G. Bind `Shift+Tab` (Claude/Kimi) instead of Tab (OpenCode).** `Shift+Tab` is less likely to be stolen for focus navigation, and matches the agents this PWA remotes. The user asked for Tab; treat Shift+Tab as the **fallback** if capture-phase Tab never fires on iPhone hardware keyboards.

**H. Pi community shortcut `Ctrl+Alt+P`.** [@kmiyh/pi-plan-mode](https://www.npmjs.com/package/@kmiyh/pi-plan-mode). Honest to the host agent, terrible on iPhone (no Control/Alt on soft keyboard; Magic Keyboard possible). Offer it only as `aria-keyshortcuts` alongside Tab for connected desktop-class keyboards.

**I. Inverse tray in dark plan mode.** Dark tray becomes `--canvas` `#181715` with `--ink` dash — a “lights down” read-only room. Extra theme, extra contrast QA. Minority because Product register forbids decorative color dosage.

**J. Plan as a sheet, not a chip.** `+` → `Run mode` bottom sheet (council’s older two-step). More iOS-native; one extra tap vs Gemini’s in-toolbar chip. Worse for “fast entry/exit.”

---

## 4. Open questions + risks

1. **Does iOS Safari/PWA deliver `Tab` to a focused textarea on iPhone + Magic Keyboard?** Historical evidence says no. If unverified on device, shipping a Tab-only hint is a lying control. Need a 5-minute hardware check; keep Shift+Tab and chip as fallbacks.
2. **`executing-plan` duration and who flips it.** If the host stays in `executing-plan` for a long run, a disabled mode group + solid border must remain legible for minutes, not 220 ms. Confirm with `plan-status.ts` / extension that the third state is actually published to the phone.
3. **Execute vs existing approval cards.** Pi Remote already has ticketed mutation approvals. If Execute is another mutation, the carbon button must enter that lane visually (same card language as approval), not a third style. Unresolved in this lens.
4. **Disclaimer copy collision.** Today the disclaimer always says read-only. Plan-mode copy that also says read-only is redundant unless Build is **not** fully read-only on the phone (full-access opt-in exists). Confirm which sentence is true in default vs `--full-access`.
5. **Chip wrapping at 320 px** with `Later` visible (running + draft). Spec caps chip at 42 vw; still need a 320 px screenshot in executing + draft.
6. **White-on-clay send (`#fff` / `#d97757`) is not in `contrast.test.tsx`.** Out of scope, but if Execute were clay it would inherit the same unproven pair. Another reason Execute is carbon.
7. **RAC Popover motion** is unstyled (no enter/exit). Adding 220 ms opacity must not fight iOS keyboard avoidance (Kimi spent multiple releases on safe-area / keyboard / 16 px zoom). Keyboard-open plan toggle is the risky frame.
8. **Mobbin MCP was not callable** this pass (no Code Mode tools in-session; OAuth still operator-gated per `mcp-mobbin`). Screen URLs above are public Mobbin explore links, not authenticated `search_screens` hits. Treat image-level measurements as local teardown + help docs, not Mobbin pixel metrics.
9. **OpenCode’s Tab vs Claude’s Shift+Tab vs this app’s `+`.** Three grammars. Pick one and put it in the popover caption; do not print all three.

---

## 5. Sources

### This repo (ground truth)

- `apps/pi-remote-web/src/style.css` — tokens, `.composer-tray`, `.composer-plus` 2.5 rem, `.composer-plan-chip` unused, `.tools-mode` missing, dashed `.empty-state`, reduced-motion nuke, `.session-statusline`
- `apps/pi-remote-web/src/SessionComposer.tsx` — `+` popover Build/Plan; `planActive` lumps `executing-plan`
- `apps/pi-remote-web/src/RuntimeStrip.tsx` — same toggle; unmounted from session
- `apps/pi-remote-web/tests/contrast.test.tsx` — AA pairs; no chip-fill-vs-tray
- `packages/pi-rpc-protocol/src/types.ts` — `build` \| `plan` \| `executing-plan` \| `unknown`
- `docs/design-reference/mobile-chat-apps/01-visual-teardown.md`
- `docs/design-reference/mobile-chat-apps/02-current-ui-map.md`
- `docs/design-reference/mobile-chat-apps/council-gpt-sol.md`
- `docs/design-reference/mobile-chat-apps/research-gpt-luna.md`
- sk-design: register, animation-decision-framework, motion-strategy, performance-reduced-motion

### Official docs / HIG / WCAG

- https://code.claude.com/docs/en/permission-modes
- https://code.claude.com/docs/en/common-workflows
- https://code.claude.com/docs/en/desktop
- https://support.claude.com/en/articles/8114491-get-started-with-claude
- https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile
- https://www.kimi.com/help/kimi-code/cli-work-modes
- https://www.kimi-cli.com/en/guides/interaction.html
- https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html
- https://www.kimi.com/help/getting-started/overview
- https://support.google.com/gemini/answer/14554984?co=GENIE.Platform%3DiOS
- https://developer.apple.com/design/human-interface-guidelines/buttons
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/differentiate-without-color-alone-evaluation-criteria/
- https://developer.apple.com/videos/play/wwdc2019/244/
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

### GitHub / packages (prior art)

- https://github.com/MoonshotAI/kimi-code (web plan pills, dashed composer, iOS 16 px, plan review card — CHANGELOG #2922, #1101, #1459, #1159)
- https://github.com/anomalyco/opencode (Tab = Build/Plan; toggle disappearance #37070, #37158)
- https://github.com/cline/cline (Plan/Act colors; a11y #9179, #4932, #2444; contrast PR #8747)
- https://github.com/badlogic/pi-mono (core: no built-in plan mode)
- https://www.npmjs.com/package/@kmiyh/pi-plan-mode (`Ctrl+Alt+P`, progress widget)
- https://stackguides.com/questions/46248686/ios-bluetooth-keyboard-inputs-tab-event
- https://github.com/microsoft/monaco-editor/issues/293

### Mobbin screens (public explore URLs; MCP not authenticated this pass)

- Claude iOS chat detail: https://mobbin.com/explore/screens/63d3bc73-3bc9-4f4d-b8fe-f6732303a9b8
- ChatGPT iOS composer: https://mobbin.com/explore/screens/f7e6514e-4106-4b5a-8c37-1b86aa42a9f1
- ChatGPT iOS chat: https://mobbin.com/explore/screens/c176ae9f-5a25-45b6-acda-5620364105df
- Gemini iOS home: https://mobbin.com/explore/screens/2ec379b4-48e9-46bd-a332-d84086092f78
- DeepSeek iOS chat: https://mobbin.com/explore/screens/9fa85a22-a24c-4224-a3db-6c40827c1db4

### Design write-ups

- https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/
- https://aiuxplayground.com/teardowns/deepseek/composer/
- https://arsentev.ai/guides/claude-code-plan-mode
- https://open-code.ai/en/docs/modes
- https://deepwiki.com/cline/cline/3.4-plan-and-act-modes
