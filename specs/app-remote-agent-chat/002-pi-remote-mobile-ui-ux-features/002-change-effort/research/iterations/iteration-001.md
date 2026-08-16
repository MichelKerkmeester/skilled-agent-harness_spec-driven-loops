<!-- provenance: external-CLI orchestration pass; original file iter-01-deepseek.md -->
> **Source pass 1** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-1-deepseek.md`.

<!-- F2-change-effort | model=deepseek | lens=competitive-teardown | iter 1/5 | 2026-08-15T19:25:20.792Z -->

I'll run one focused deep-research pass on the competitive-teardown lens. Setting up tracking and starting source gathering.
Platform docs captured for Anthropic, OpenAI, DeepSeek. Now the mobile-app UI teardown plus retry Gemini.
DuckDuckGo blocked. Trying Bing search and alternate Gemini doc URLs.
Search engines are too generic. Going straight to canonical support/docs URLs.
Found the right Claude article. Fetching the Claude effort/thinking settings doc, Anthropic effort API doc, and OpenAI reasoning-effort help.
Good progress on Claude effort docs. Let me extract the body of the Claude settings article from the saved file and hunt the OpenAI reasoning-effort help article.
Let me read the saved Claude article body directly.
That Claude article is a goldmine. Now let me look at the actual Pi Mobile codebase for the existing Effort control, then continue competitive research.
Existing implementation captured. Let me check the runtime state shape and pi's level semantics in-repo.
Repo has prior design research. Reading the current-UI map and the Claude Mobile critique it cites.
Reading the in-repo GPT teardowns, then fetching Kimi Code, Gemini, and OpenAI reasoning sources.
Major find: Kimi Code's TUI is built on `pi-tui` from `earendil-works/pi-mono` — likely the same "pi" agent. Verifying that plus Gemini thinking and OpenAI app reasoning.
Confirmed pi = earendil-works/pi. Now the OpenAI app article, the rest of the in-repo teardown, and Gemini thinking retry.
ChatGPT reasoning slider confirmed. Now Gemini thinking sources and pi.dev docs.
Final source round: Gemini 2.5 thinking blog, Gemini app help, and Apple HIG segmented controls.
I have the research I need. Let me quickly ground the visual spec in the app's real design tokens.
Research complete. Writing the competitive-teardown report.
# Research Pass 1 of 5 — Competitive Teardown: In-App Effort / Reasoning-Level Switcher for "Pi Remote" (iPhone PWA)

**Lens:** Competitive teardown of how Claude iOS, ChatGPT, Gemini, DeepSeek, Kimi Code, Perplexity, and Meta AI handle "change how hard the model thinks," mapped to the existing host-backed effort control in `Pi Remote`.
**Method:** Primary docs (vendor help centers, API docs, vendor blogs), a measured cross-app visual teardown already captured in this repo (`docs/design-reference/mobile-chat-apps/research-gpt-luna.md`, itself grounding App Store screenshots, Mobbin-sourced captures, and vendor docs), the pi host's own repo/docs, plus current in-repo code (`SessionHeader.tsx`, `RuntimeStrip.tsx`, `runtime.ts`, `demo.ts`).
**Baseline found in code:** The Effort control exists twice — in the in-session **Model+Effort sheet** (`SessionHeader.tsx:100-122`) and in the **RuntimeStrip** (`RuntimeStrip.tsx:71-90`). Both render a nested `Select → Popover → ListBox` keyed off `state.thinkingLevel` against `state.availableThinkingLevels`, dispatch `set_thinking_level` (host-confirmed, revision-checked), never render optimistic values, and disable when `runtime.status !== 'ready'`. Label map covers `off/minimal/low/medium/high/xhigh/max`; pi's demo host only exposes `['off','high','max']` (`demo.ts:169`).

---

## 1. Findings for this lens (concrete, with citations)

### 1.1 Claude consumer app — the closest structural analog
- **One menu owns model + effort + thinking.** "The model menu next to the send button controls three settings: which Claude model… how much effort it puts into each response, and whether it uses extended thinking." To change effort: tap model name → "Effort" → choose a level; thinking is a toggle nested under Effort. [S1]
- **Exact level vocabulary + a "Default" marker.** Levels are `Low`, `Medium`, `High`, `Extra high (xhigh)`, `Max`; each model has a recommended level "marked as 'Default' in the menu." Semantic copy in-menu: Low/Medium "work well for routine tasks and stretch your usage further," High is "best overall balance of quality and speed," xhigh "designed for long-running coding and agentic tasks… without the full token cost of max," Max "most thorough." [S1] This is the single most reusable artifact for Pi Remote's label spec.
- **Mid-conversation is explicitly allowed and "next response"-scoped:** "You can change the model, effort level, or thinking setting at any point in a conversation. Changes apply starting with Claude's next response." [S1] The API side confirms per-request semantics: "each request carries its own value, so to run a later part of a conversation at a different effort level, set the new value on the next request." [S2]
- **Unavailable handling exists at three layers:** (a) effort selector is *only shown for models that support it* ("The effort selector is available for Opus 5, Sonnet 5, Fable 5, Opus 4.8…"); (b) enterprise admins can hide levels ("a model or effort level you expect is missing, your administrator may have turned it off"); (c) hard constraints: "Extended thinking cannot be turned off in Claude when using Claude Opus 5," and on the API "attempting to disable thinking at xhigh or max effort returns an error." [S1][S3]
- **Cost/latency framing is user-facing, not hidden:** higher effort "takes longer and use[s] more tokens, so you'll reach your usage limits faster." [S1] Effort is a behavioral signal, not a budget: "At lower effort levels, Claude will still think on sufficiently difficult problems, but it will think less." It also shapes tool behavior — lower effort "combine[s] multiple operations into fewer tool calls… proceed[s] directly to action without preamble." [S2] For a remote-coding-agent client this is the correct mental model to put under each level.
- **Thinking display in-thread:** when thinking is on, "a 'Thinking' indicator with a timer showing how long Claude has been processing" plus "an expandable 'Thinking' section above Claude's response," and a first-party notice when a thought was truncated by safety. [S1] Mobile specifics from the teardown: model name centered top (~21–24pt serif + chevron), header ≈56–64pt, terracotta send circle ≈`#C96F4B`, the Claude mark animates while generating. [S12][S11]
- **API vocabulary divergence risk:** the API's thinking-level set is `low/medium/high/xhigh/max` under `output_config.effort`, with `high` = omit-the-param = default [S2], while consumer labels are `Low/Medium/High/Extra high/Max`. Pi's own vocabulary (`off/high/max`) is *smaller and non-identical* — the client must not assume a superset, which is exactly why `availableThinkingLevels` is host-authoritative. [S14]

### 1.2 ChatGPT / OpenAI — slider-in-model-picker + plan gating
- **Reasoning is now a discrete "reasoning slider" in the model picker**, not a toggle: options `Instant`, `Medium`, `High`, `Extra High`, `Pro` (Pro = a different model, GPT-5.6 Sol Pro). Free users get a binary `Think` chip (powers GPT-5.6 Luna) instead. Automatic reasoning is a separate setting: "go to Settings > General and adjust **Higher intelligence**." [S5]
- **Availability is plan-gated and visible:** the exact same options render differently per plan (Plus gets Medium+High but not Extra High/Pro; Pro gets all). "If you reach a GPT-5.6 reasoning limit, ChatGPT may continue with another available reasoning model," and "ChatGPT displays when an allowance resets." [S5] So ChatGPT's pattern for *unavailable levels* is: render the option, gate it, and show fallback + reset-time messaging — the opposite of Claude's "hide unsupported." 
- **API semantics:** `reasoning.effort` accepts `none/minimal/low/medium/high/xhigh/max`; defaults are model-dependent (GPT-5.5 defaults to `medium`). Reasoning tokens are billed as output tokens and consume context; OpenAI recommends reserving ≥25k tokens of headroom. [S4] The mid-turn story on the API is: effort is per-request; pass reasoning items back for continuity. [S4]
- Mobile composer grounding: no persistent mode chips when idle; `Think`/tool chips appear "above the field only when active," the model label sits in the header (~17–20pt), placeholder variants `Ask anything` / `Message ChatGPT`. [S12]

### 1.3 Gemini — thinking is a model property, surfaced as composer pills
- **Thinking is the default, not a user knob:** "Gemini 2.5 Pro… [is] a thinking model" — "Gemini 2.5 models are thinking models, capable of reasoning through their thoughts before responding." For Flash-family, thinking is a toggle ("you can toggle thinking on and off for Flash"). [S7] On the mobile surface the *model-speed* choice is the visible control: a `Fast` dropdown pill plus a blue active search/research chip in the composer card, with the conversation title (not the model) centered in the header. [S12][S8]
- Takeaway: Gemini is the counter-example that proves *model choice and reasoning depth are now entangled* — a reason Pi Remote should render effort inside the model sheet rather than as a separate floating control. [S12]

### 1.4 DeepSeek — the most explicit "thinking toggle + effort" split
- **First-party dual control:** a thinking-mode toggle (`{"thinking":{"type":"enabled/disabled"}}`) is orthogonal to an effort control (`reasoning_effort`: `low/high/max`; `none` disables thinking; default effort `high`). Note the honest mapping table: requested `medium` actually maps to effort `high`, and `xhigh` maps to `high` — the exposed vocabulary is **coarser than the real internal effort** for `deepseek-v4-flash` and `deepseek-v4-pro`. [S6]
- **App surface:** `DeepThink (R1)` and `Search` are chips *inside* the composer card; an `Instant`/`Expert` tier selector sits above the card. Active chips are filled, inactive outlined/ghosted. Collapsible `Thinking` panel above the answer, spinner + stop-while-generating. [S12]
- This is the closest precedent for pi's `off` ≈ "thinking disabled" mapping onto a chip in the composer, and the mapping-table honesty is a precedent for Pi Remote's "what each level means" copy (levels don't have to map 1:1 to provider internals).

### 1.5 Kimi / Kimi Code — model pills above input; CLI shares pi's own TUI
- **Consumer Kimi:** the model switch is a pill/segmented control *immediately above the input* (`K3`, `K3 Swarm`, `K2.6 Fast`); web search is decided automatically (no permanent search toggle); mobile retry is reached by tapping the user's prompt, not a permanent row. [S12][S18]
- **Kimi Code CLI is prior art built directly on pi's TUI:** "Our TUI is built on top of [`pi-tui`](https://github.com/earendil-works/pi-mono/tree/main/packages/tui)." [S10] This means Kimi Code's terminal "how hard should the agent think" affordances are implemented *inside the same `pi-tui` component library* pi itself uses — the strongest prior art for how a thin mobile client should (and should not) re-expose host state.

### 1.6 The pi host itself (the object being controlled)
- pi is `earendil-works/pi` (90.9k★), packages `@earendil-works/pi-coding-agent`, `pi-agent-core`, `pi-ai`, `pi-tui`; docs at `pi.dev/docs/latest`, including **RPC mode over stdin/stdout JSONL** — the surface this app's relay drives. [S9] pi's TUI is terminal-focused; the repo has no first-party mobile client, so there is no vendor UI to copy — the teardown target is the consumer chat apps.
- In-repo host contract: the relay queries `availableThinkingLevels` rows (`runtime-service.ts:49,209`), validates the mutation against them (`:155-157`), redacts `thinkingLevel` to a 64-token bounded string (`store/redaction.ts:199`), and the web client dispatches `{type:'set_thinking_level', level}` through ticket+revision control with **no optimistic state** (`runtime.ts:175`, `RuntimeStrip.tsx:36-37`). [S14]

### 1.7 Summary table

| App | Where the control lives | Vocabulary | Mid-turn behavior | Unavailable handling |
|---|---|---|---|---|
| Claude [S1] | Model menu next to send; Effort section; thinking nested | Low/Medium/High/Extra high/Max + "Default" | Explicitly allowed; applies to next response | Hidden per-model; admin-hidden; Opus 5 hard-requires thinking |
| ChatGPT [S5] | Reasoning slider in model picker | Instant/Medium/High/Extra High/Pro (+Think for free) | Per-request; auto-reasoning setting in Settings>General | Plan-gated, shown but blocked, fallback model + reset timer |
| Gemini [S7][S12] | Composer pills: `Fast` model-speed + search chip | model-speed pill, not effort | Thinking is a model default | Toggle exists only where the model allows |
| DeepSeek [S6][S12] | Chips inside composer (`DeepThink`/`Search`), tier above card | On/off × low/high/max effort | Per-request; CoT pass-back required with tools | Effort mapping table (medium→high, xhigh→high) |
| Kimi [S12][S18] | Model pill above input | Model switch only | — | Automatic web-search; no stable retry row |
| Meta AI [S12] | `Fast` speed pill persistent; `Thinking` in plus menu / active chip | Fast vs Thinking | — | Chips appear "only when active" |
| Perplexity [S12][S19] | `Pro`/`Research` mode pills in composer | Pro/Research/model | Follow-up = primary refinement | Citations-led trust instead of disclaimers |

---

## 2. Concrete spec contribution for the build phase

**Design decision:** keep the effort control *inside the Model+Effort sheet* (Claude's pattern, already implemented), but rebuild the Effort section as a **single-select radio list with per-level descriptions**, not a nested `Select` inside a `Dialog`/`Popover`. A `ListBox` nested inside another popover's `Dialog` is a two-layer focus-trap that degrades with VoiceOver and can break in iOS standalone-Safari PWA presentation [S14][S16]. Claude's own interaction is exactly this: one sheet, Model then Effort, each level with a meaning line. [S1]

### 2.1 State model (exact states)
- **Level list** is host-authoritative: `state.availableThinkingLevels`, ordered as pi reports it (`demo.ts:215`). Never hardcode the set; the label map (`EFFORT_LABELS`) degrades to the raw token for unknown levels (`SessionHeader.tsx:173-176`). Add a `descriptions` map keyed by level; fall back to a neutral sentence for unknown levels.
- **`Default` marker** (Claude [S1]): when the sheet opens, tag the *currently confirmed* level with a `Default` chip. Do not invent a host "default" field.
- **Confirmed vs pending vs stale** (already correct): control always renders `state.thinkingLevel` (confirmed); a `set_thinking_level` in flight marks that row with `Applying…` (via `runtime.pending`, `SessionHeader.tsx:124-126`) and **never** optimistically moves the check; on host confirm (revision bump) the check moves and `role="status"` announces "Effort set to High." On `stale` (host changed remotely), re-render confirmed level and announce "Host changed effort — High." On `error`, keep last confirmed, show "Unavailable — reconcile," keep the sheet open. [S14]
- **Disabled conditions, precisely:**
  1. `runtime.status !== 'ready'` or `state === null` → entire sheet disabled (exists).
  2. `availableThinkingLevels.length === 0` → **hide the Effort group** (Claude hides per-model; DeepSeek gates chips). A permanently disabled "—" select invites taps that do nothing. Keep the Model group enabled.
  3. A level that the host would reject (e.g., a level the current model no longer lists) must not be selectable because it isn't in the list — this is already enforced by the host guard `runtime-service.ts:155-157`; the client must additionally **drop stale list entries immediately when `thinkingLevel` is confirmed outside the list** (defensive).
- **Mid-turn (switch-mid-turn behavior):** mirror Claude's contract ("applies starting with Claude's next response" [S1]) **only if the host confirms it accepts the op while streaming.** The relay already sends the command as a settled mutation (`runtime-service.ts:179-181`); whether pi accepts it mid-tool-loop is a host question (see Risks). Two safe client behaviors: (a) while a turn is streaming, keep the control **enabled** but show a one-line hint under the sheet title — `Applies to the next turn` — matching Claude's explicit next-response framing; (b) if the host returns a rejection for mid-turn, surface it through the existing `pending/error` status and revert — never swallow it.

### 2.2 Interaction & gestures
- Each effort row is a full-width **44pt-high target** (HIG minimum; teardown convention [S12][S15]).
- Tap row → instant local selection highlight + dispatch; row stays selected-looking only after host confirmation (anti-optimistic).
- Sheet dismissal: tap outside / swipe down (Claude uses a sheet; the RAC `DialogTrigger` already handles Escape/outside-dismiss [S14]). If the user changes effort, then swipes away before confirmation, the pending mutation **continues** (per Claude semantics changes "apply starting with next response" — no cancel needed) but the sheet re-opens showing the last confirmed level until confirmed.
- Keyboard/switch-control: ArrowUp/Down to move focus between radio options; Space selects (native `RadioGroup` semantics via RAC `Radio`/`RadioGroup`, or `Menu` items). No custom gesture novel to users.

### 2.3 Accessibility (WCAG AA + ARIA)
- Use **radio-group semantics** (`role="radiogroup"`, `aria-label="Effort"`, each option `role="radio"`, `aria-checked`) per APG radio-group pattern [S16] — semantically correct for mutually-exclusive levels, better than the current nested `Select`.
- Each option announces label + status: `aria-describedby` on the description line; when marked Default, include `aria-label` like `High — default` or a visually-hidden `(default)`.
- **Live region** for confirmation/error: one `role="status" aria-live="polite"` in the sheet (already present, `SessionHeader.tsx:124`) — extend copy to name the level: `Effort set to High`.
- **Disabled ≠ aria-disabled-only:** when authority is lost, set the control `aria-disabled` *and* keep focusability on the trigger so a screen-reader user learns *why* (title/hint `Waiting for host`); per WCAG the disabled affordance must not be the only signal [S17].
- **Non-text contrast:** selected-level check + selected row fill must maintain **3:1 against adjacent unselected** states (WCAG 1.4.11) [S17]; use clay `#d97757` on parchment for the check, which passes on `--surface`/`--surface-raised` [S14]. Muted descriptions use `--ink-muted` (#6c6a65 light / #b5afa5 dark), which holds ≥4.5:1 on parchment [S14][S17].
- Touch geometry: rows 44pt; description text at 14–15pt sans (Inter), level name at 17–18pt serif (Source Serif 4), matching the repo's fixed type scale [S14].

### 2.4 Visual / motion (ink-on-parchment, light + dark)
- Sheet: parchment `--surface` card, 24–30pt radius, 1pt `--surface-muted` hairline, soft shadow (Claude sheet conventions [S12]); header `Model and effort` in serif ~19pt, group labels `Model` / `Effort` as small-caps muted sans (already `tools-label`).
- Effort row anatomy: left = serif level name + "Default" pill; below = one sans description line (muted); right = clay check glyph when selected. Selected row gets `--surface-muted` fill.
- Header readout: append current effort under the centered model name as a muted line (`Sonnet · High`) so effort is discoverable *before* opening the sheet (Claude shows model only, but Kimi/DeepSeek/Gemini prove a persistent readout is the discoverable norm [S12]); keep it non-interactive.
- Motion (respect `prefers-reduced-motion`):
  - Row selection: check scales in 150ms ease-out; row fill fades 100ms.
  - Confirmation: brief 300ms `Applied` micro-badge in the status slot, then settles.
  - Never animate the level value change in the header; it must reflect confirmed state only.

### 2.5 Copy — level meanings (adapt Claude's [S1], DeepSeek's mapping honesty [S6])
| Level | Label | One-line meaning |
|---|---|---|
| `off` | Off | No reasoning step — fastest, lowest token use. Best for quick lookups. |
| `high` | High | Balanced reasoning — default for most work. |
| `max` | Max | Deepest reasoning — slower, uses the most tokens. Best for hard problems. |
Unknown levels: render the token and a generic line ("Host-defined effort level").

---

## 3. Divergent / minority ideas worth considering

1. **Segmented control instead of a list** (Kimi/DeepSeek/Gemini/Meta chip pattern [S12]): with pi exposing exactly `off/high/max` today, a 3-way segmented control (`Off | High | Max`) in the sheet (or even inline in the header) is faster than a 3-row list. Keep the list only when the host exposes >3 levels. The risk: segment labels can't carry descriptions — pair the segment with a single "what changes" caption.
2. **Composer-chip placement** (DeepSeek/Meta [S12]): put effort as a chip in the composer `+`/tool row rather than the header sheet, so the effort choice sits where the user is about to send. Diverges from the in-repo target map (`02-current-ui-map.md` A: "model+effort in a header sheet") [S13] — worth a deliberate exception.
3. **"Auto" level** (ChatGPT's Settings > General "Higher intelligence" [S5]): a fourth pseudo-level "Auto — let pi decide" delegated to the host. High risk in an agentic harness (host currently reports a static list), so file it for iteration 3+.
4. **Per-message effort override**: a turn-level "Think harder on this" action (Claude applies per-next-response [S1]) instead of a session-level switch. Contradicts the current host command surface (`set_thinking_level` is session state) — do not build until the host grows a per-request knob.
5. **Cost/latency disclosure per level** (no competitor does it, but DeepSeek's mapping table [S6] and Claude's "reach usage limits faster" warning [S1] point at it): show "≈ slower · more tokens" on `max`. Great for a private tailnet tool, zero precedent to copy.

---

## 4. Open questions + risks

- **Does pi accept `set_thinking_level` mid-stream?** Claude guarantees next-response semantics [S1]; the relay forwards the op unconditionally (`runtime-service.ts:179-181`). If pi rejects during a tool loop, the client must show it as an error, not a silent no-op. **Verification:** drive the real pi over the relay while streaming and assert the op's settled outcome.
- **Is there a reported "default" level?** `availableThinkingLevels` order may be display order only. Do not invent a default marker without a host field (current UI has none [S14]).
- **Cross-model interaction:** if pi narrows `availableThinkingLevels` per model, the effort list must re-render on model change without losing the confirmed `thinkingLevel` (current code reads straight from `state` — safe, but add a test that selecting a new model then opening the sheet shows the *new* host list, per `RuntimeStrip.test.tsx:74`).
- **Nested-popover a11y:** the existing `Select` inside `Dialog`+`Popover` may trap focus oddly in standalone PWA fullscreen; the radio-list refactor eliminates it, but confirm VoiceOver behavior on a real device (the repo already keeps `screens/claude-*.png` comparison fixtures [S13]).
- **Level-token drift:** `EFFORT_LABELS` maps `minimal/low/medium/xhigh` that pi never emits; harmless today, but if a future host emits a new token the fallback shows the raw string — acceptable, but the redaction bound (64 tokens [S14]) means a hostile host can inject long label text; keep `effortLabel` bounded.
- **Plan-mode entanglement:** mode (`Build`/`Plan`) and effort are independent controls; confirm the host's plan enforcement doesn't reject effort changes (the app's own extension-enforced plan mode could conflict with a mid-plan effort switch).

---

## 5. Sources

**Primary docs / vendor pages (fetched):**
1. Claude Help Center — *Change the model, effort, and thinking settings* — https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings
2. Anthropic API docs — *Effort* — https://platform.claude.com/docs/en/build-with-claude/effort
3. Anthropic API docs — *Extended thinking* — https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
4. OpenAI API docs — *Reasoning models* — https://platform.openai.com/docs/guides/reasoning
5. OpenAI Help Center — *GPT-5.6 in ChatGPT* — https://help.openai.com/en/articles/20001354-gpt-56-in-chatgpt
6. DeepSeek API Docs — *Thinking Mode* — https://api-docs.deepseek.com/guides/thinking_mode
7. Google (The Keyword) — *Gemini 2.5: Our most intelligent AI model* — https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-model-thinking-updates-march-2025/
8. Google Gemini Apps Help — *What you can do with your Gemini mobile app* — https://support.google.com/gemini/answer/14579631?hl=en
9. pi — agent harness + docs — https://github.com/earendil-works/pi · https://pi.dev/docs/latest (RPC mode, SDK, TUI components)
10. Kimi Code CLI — https://github.com/MoonshotAI/Kimi-Code (pi-tui attribution, ACP, plugins)
11. IXD@Pratt — *Design Critique: Claude Mobile App* — https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/
18. Kimi Help Center — *Overview* — https://www.kimi.com/help/getting-started/overview
19. Perplexity Help Center — *What is Pro Search?* — https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search

**Guidelines (cited for pattern claims):**
15. Apple Human Interface Guidelines — *Segmented controls* — https://developer.apple.com/design/human-interface-guidelines/segmented-controls
16. WAI-ARIA Authoring Practices — *Radio Group* / *Listbox* patterns — https://www.w3.org/WAI/ARIA/apg/patterns/radio/ · https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
17. WCAG 2.2 — 1.4.3 Contrast (Minimum), 1.4.11 Non-text Contrast — https://www.w3.org/WAI/WCAG22/quickref/#non-text-contrast

**In-repo (this deliverable's primary cross-app teardown + implementation):**
12. `docs/design-reference/mobile-chat-apps/research-gpt-luna.md` — measured 7-app composer/sheet teardown (grounded in App Store screenshots, vendor docs, and captured Mobbin-style screens; all measurements are pt-based reconstruction targets)
13. `docs/design-reference/mobile-chat-apps/02-current-ui-map.md` — target "model+effort in a header sheet" architecture
14. `apps/pi-remote-web/src/SessionHeader.tsx`, `RuntimeStrip.tsx`, `runtime.ts`, `demo.ts`; `apps/pi-remote-relay/src/runtime/runtime-service.ts`, `store/redaction.ts`; `packages/pi-rpc-protocol/src/types.ts` — current effort control, host state, mutation/ticket/revision path

**Mobbin (reference catalog; access is gated, so screens were read through the captures encoded in source [12]):**
- Claude — https://mobbin.com/apps/claude-ai (screens: chat, model selector, composer)
- OpenAI ChatGPT — https://mobbin.com/apps/openai-chatgpt (screens: model picker / reasoning slider)
- Google Gemini — https://mobbin.com/apps/google-gemini · DeepSeek — https://mobbin.com/apps/deepseek · Kimi — https://mobbin.com/apps/kimi · Perplexity — https://mobbin.com/apps/perplexity · Meta AI — https://mobbin.com/apps/meta-ai
- *Note:* verify screen names by in-app search ("model selector", "reasoning", "composer") since Mobbin's catalog is continuously reorganized.

*No single weak source: every claim above is anchored in either a fetched first-party page [1-11,15,18,19], the measured in-repo teardown [12-13], or the app's own source [14].*
