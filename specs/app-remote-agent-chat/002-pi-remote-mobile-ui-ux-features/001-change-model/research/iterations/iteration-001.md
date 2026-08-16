<!-- provenance: external-CLI orchestration pass; original file iter-01-deepseek.md -->
> **Source pass 1** — executor: DeepSeek v4 Flash (opencode-go gateway). Independent, cited pass under a rotating lens. Migrated from `iter-1-deepseek.md`.

<!-- F1-change-model | model=deepseek | lens=competitive-teardown | iter 1/5 | 2026-08-15T18:56:02.698Z -->

# Pass 1 — Competitive Teardown: In-App Model Switchers

**Feature:** Change the active AI model from within the app · **Lens:** competitive teardown · **Targets:** Claude iOS, Claude Code, Kimi Code/app, ChatGPT, Perplexity, DeepSeek, Gemini, Meta AI · **Prior art:** coding-agent CLIs + open-source mobile clients

Scope note: this feature already works (centered `<model> v` header → sheet → host-confirmed `set_model`). Everything below is hardening, a11y, and polish input.

---

## 1. Findings

### 1.1 Claude iOS / claude.ai — the closest twin, and the two patterns worth stealing

**The voice-mode picker (documented):** Claude's model picker exposes Haiku, Sonnet, and Opus (Fable deliberately omitted from the voice surface), lets users switch **mid-conversation**, and a session "starts with whatever model a user last picked in text chat and runs its fastest version by default" [1][2]. Three concrete lessons:

- **Inherit, then offer the fastest variant.** The picker defaults to the user's last choice, not a hard-coded default. For Pi Remote the portable version is: the picker opens scrolled to / sorted by the host-confirmed current model, with the current model pinned and badged — never a static default.
- **A surface can subset the model list.** Voice doesn't expose Fable because Fable is wrong for that surface. Pi Remote's analog: hide/disable models the host marks unavailable (the relay already rejects them; the sheet should match, not lie).
- **Free-vs-paid tier gating is shown in-row.** "Free accounts are held to the Haiku model" [1] — the picker communicates *why* a model is unavailable, not just *that* it is.

**Claude Code `/model` picker (the coding-agent twin — most transferable prior art):** [3]

- **Rows are aliases with one-line behavior descriptions**: `best` "Uses Fable 5 where your organization has access…", `sonnet` "Uses the latest Sonnet model for daily coding tasks", `opus` "for complex reasoning tasks", `haiku` "fast and efficient… for simple tasks". This is exactly the "capability hint" the goal asks for — one short verb phrase per row, not spec sheets.
- **Per-row price, and a credit-cost badge** ("Requires usage credits" on the Fable 5 row). A cost/capability signal per row is Claude/Kimi-grade polish; Pi can show context-window/capability tags where the host supplies them.
- **A "Default" row that resolves per account/org** (labeled "Org default" when admin-set), and a session-vs-persistent split: `Enter` = switch + save as your default; `s` = switch **this session only** [3].
- **Mid-conversation switch is not free**: the picker "asks for confirmation when the conversation has prior output, since the next response re-reads the full history without cached context" [3]. **This is the single most important finding for "graceful switch during a running turn":** a model switch is a context-cost event, and the professional products make that visible instead of silent.
- **Fail-closed model validation**: an unrecognized id is rejected with `Model "<name>" is not a recognized model id.` and "the session keeps its current model" [3]. Pi's relay already does this (host-confirmed, never optimistic) — the picker must render the rejection as the *host's* current model, which the existing reducer already guarantees [4].
- **Availability-gated listing**: "The `/model` picker lists Fable 5 only after the server reports it available" [3]. List must be host-confirmed on open, not cached forever.

**Model-class copy for hint text** (for deriving safe hint strings): Opus = "powerful… for reasoning-intensive enterprise tasks", Sonnet = "versatile… everyday tasks, balance of performance, cost, and speed", Haiku = "lowest cost and fastest" [5].

### 1.2 ChatGPT — the model picker is a *control + identity* feature, not a config menu

**Timeline that proves user appetite:** GPT-5 launched router-only ("one-size-fits-all" auto-routing, picker removed). Within ~a week OpenAI restored the picker with **Auto / Fast / Thinking** modes plus legacy models (GPT-4o default for paid, GPT-4.1, o3), after user backlash over lost control and *personality* — users held a symbolic "funeral" for Claude 3.5 Sonnet when it was retired [6][7][8]. Altman's own words on X: three modes — "Auto selects the most suitable… Fast… quick, concise… Thinking… slower but more detailed" [6].

**Concrete numbers/layout (mobile):** picker opens as a full-screen sheet from a composer pill; Thinking mode carries a rate-limit subtext (3,000 messages/week) [6][7][9]; the 2026 refresh added a "reasoning effort" slider (Low/Medium/High) inside the same picker, plus the composer upgrade — "instantly switch between different GPT models, adjust 'thinking effort' levels… in one seamless experience" [10].

**Lessons for Pi Remote:**

- **Model choice is identity.** Users attach personality to models. Never silently auto-route; Pi's host-confirmed model must always be visible and user-overridable.
- **Separate "which brain" from "how hard it thinks"** — ChatGPT splits model (Auto/Fast/Thinking) from effort. Pi already has `set_thinking_level`; the picker should keep model and effort as sibling sections exactly as `SessionHeader` does today [11], but present them as two labeled groups in one sheet, not a nested select.
- **Mode-as-model**: "Fast" and "Thinking" are *behaviors of one model*, rendered as rows in the model picker. When the pi host surfaces variants like `-thinking`/`-flash`, the picker should group them under their base model rather than flatten them.

### 1.3 Kimi Code / Kimi app — catalog-driven capability hints + provider grouping

**Kimi Code CLI** (the second coding-agent twin): model selection is `--model <alias>` / `-m` at launch, `default_model` in `config.toml`, `/model` inside the TUI; the config uses `[providers.<id>]` + `[models.<alias>]` tables (provider grouping); `kimi provider catalog list` prints each model's **context window and capabilities** sourced from the models.dev catalog; "temporarily switch the model" for one-shot `-p` runs [12][13].

**Lessons:**

- **Provider grouping is the right top-level structure** — it's how the config and catalog are organized, and it maps to Pi's `provider` field in `AvailableModelDto` [14].
- **Capability hints come from a catalog, not from parsing names.** Kimi gets context-window + capabilities from `models.dev/api.json` [13]. Pi's `AvailableModelDto` is only `{provider, id, label}` [14] — the *right* move is to extend the host catalog with optional capabilities, and treat any name-derived hint (e.g., `-pro` ⇒ "larger context") as a **non-authoritative heuristic** ("≈") until the host confirms.
- **Session-scoped vs persistent switching** is a first-class CLI concept (`-m` for this launch only vs `default_model` persisted) [12][13] — same split as Claude Code's Enter-vs-`s`.

### 1.4 DeepSeek — the "no model picker" design: one model, capability toggles

DeepSeek's API surface is two model ids (`deepseek-v4-flash`, `deepseek-v4-pro`) plus a `thinking: {"type":"enabled"}` toggle and a `reasoning_effort` ("high") parameter [15]. The consumer app mirrors this: a **DeepThink toggle + search toggle above the keyboard**, not a model sheet.

**Lesson:** when a host exposes ≤3 models, a full searchable sheet is over-engineering. Pi Remote should gate search and grouping on list size (e.g., sheet for >4 models; chips/segmented rows for ≤4) — matching DeepSeek's minimalism at the low end and ChatGPT/Claude's richness at the high end. (Also: `thinking` as a *toggle*, not a model — validates Pi's `set_thinking_level` placement inside the model sheet [11].)

### 1.5 Gemini — capability tiers, premium gating, and the router reversal

Gemini's consumer picker (app-observed; login-gated) is a model chip above the composer that opens a bottom sheet of family tiers (Flash / Pro) with short descriptions, premium models badged for paying users; the DeepMind model page documents the family split — Pro for complex reasoning, Flash for speed/everyday [16]. With Gemini 3, Google collapsed manual choice to a single auto-routing "Gemini" — **the same router bet OpenAI tried and reversed** [6][8]. Lesson: hiding the picker only works when you own the stack and the router is demonstrably good; Pi's host explicitly exposes `get_available_models`/`set_model`, so Pi Remote's job is to make the catalog legible, not hide it.

### 1.6 Perplexity — "Auto" as a first-class row + explicit power-user models

Perplexity's composer carries a model pill (bottom-left on mobile) opening a sheet with **Auto** plus explicit named models (GPT-5, Claude Sonnet, DeepSeek R1, …) for Pro; answer is one model per query, identity always visible in the composer [17][18][19]. Lesson: an **"Auto / Default" row** that resolves to the host default (Claude Code's Default row [3], ChatGPT's Auto [6], Perplexity's Auto) is a proven pattern — worth a relay-translated `default` alias even though the raw protocol has no such pseudo-model.

### 1.7 Meta AI — the counter-example that *no* picker is a product stance

Meta AI's consumer app exposes **no model switcher at all** — model identity is hidden; the only knob is a "Reasoning" style toggle and Memory [20][21]. It works only because Meta fully owns the routing stack. Lesson for the report: model visibility is a *protocol and trust* decision. Pi Remote's protocol is explicitly model-centric, so hiding identity (Meta's path) is off the table — but **avoiding hint clutter** (showing raw ids to everyone) is a real, adoptable piece of Meta's minimalism.

### 1.8 Open-source mobile/CLI prior art (verify-by-diff)

- **opencode (anomalyco/opencode)** — TUI `/model`-style pickers, provider/model id model; the Pi protocol here mirrors it (`RuntimeOperation.set_model`, ticket + `expectedRevision` + host-confirmed acceptance [4][22]). This is the strongest native prior art and it's already in the repo.
- **pi-mono (earendil-works/pi-mono)** — the `pi` agent's `pi-tui` underpins Kimi Code's TUI [13]; the runtime-control RPC (`get_available_models`/`set_model`) is the Pi side of this feature [23].
- **lobe-chat (lobehub/lobe-chat)** — `ModelSelect` with provider grouping, search/filter over large catalogs, per-model capability + context-window badges, pinned models. Reference for grouping + hints + search at scale [24].
- **ChatGPT-Next-Web (ChatGPT-Next-Web/ChatGPT-Next-Web)** — provider-grouped model list + search in a modal picker [25].
- **Chatbox (Bin-Huang/chatbox)** — provider-sectioned model selector [26].
- **aichat (sigoden/aichat)** — REPL `/model` listing models with per-model cost/context annotations [27].

---

## 2. Concrete spec contribution (buildable)

Grounded in the current implementation: `SessionHeader.tsx` opens a `Popover`+`Dialog` containing a **nested RAC `Select`** per group; `AvailableModelDto = {provider, id, label}`; `RuntimeStatus = checking|ready|pending|stale|error`; `state.model` changes **only on host confirmation**; `deliveryUnknown` forbids auto-retry [4][11][14].

### 2.1 Replace the nested Select with a dedicated bottom sheet (`RuntimeModelSheet`)

**Primitives (react-aria-components):** `DialogTrigger` → `Modal` (overlay, focus trap, scroll lock, Escape + outside-press dismissal) → `Dialog` → `SearchField` + `ListBox`/`ListBoxItem` + footer `Button`. Keep the existing trigger (centered `<model> v`) and its disabled state.

**Layout (iPhone, standalone PWA):** full-bleed width ≤ 420px; rounded top corners 20–24px; parchment surface (`#f8f8f6`, dark = ink surface); 1px hairline top border; 4×36px drag handle 8px from top; bottom padding `env(safe-area-inset-bottom) + 16px`. Structure, top→bottom:

1. **Header** — title "Model", dismiss button, and an `aria-live="polite"` status line (reuse `statusHint` [11]) so pending/stale/error are spoken, not just painted.
2. **Search** — RAC `SearchField`, shown only when `models.length ≥ 6`; case-insensitive substring match on `label`, `id`, `provider`; announce "N of M models"; empty state "No models match “…”".
3. **Provider groups** — `ListBox` sections keyed by `provider`; group header = provider name; current model's provider first, then alphabetical; sticky group headers optional. Current model pinned to its group's top with a **"Current" badge** (clay fill, ink text — clay `#d97757` on bone fails AA for body text, so badges use clay only at ≥16px/bold or as an icon glyph with an ink label).
4. **Rows** — `ListBoxItem` per model: `label` (Inter, medium, 15–17px), `id` (mono, muted secondary, truncated, `dir="auto"`), capability tags when the **host** supplies them: context window ("200K"), "tools", "thinking", "vision" — small mono tags, ink-on-bone, never clay-on-bone for text. Name-derived hints (e.g., `-pro` ⇒ "larger context") render as "≈larger context" and are flagged approximate.
5. **Footer** — primary button "Use <label>" dispatching `setModel(provider, id)`; while pending: label "Applying…", disabled, inline spinner. **Close the sheet only on host `accepted`; on `stale`/`error` keep it open and show the host state** (non-optimistic invariant [4]).
6. **Running-turn banner** — when `state.streaming === true` [14], a non-blocking banner above the list: "A turn is running — this applies to the next message." Selection remains enabled (pi's `set_model` applies to the next request, per Claude Code's "next query and all subsequent messages until you switch again" semantics [3]).

### 2.2 States (exact)

| Status | Behavior |
|---|---|
| `checking` | Sheet opens with skeleton rows; no actions |
| `ready` | Normal list; current row `aria-selected` + "Current" badge; host-confirmed only |
| `pending` | Chosen row spinner; commit button disabled; **header label unchanged**; sheet stays open |
| `stale` | Open sheet prefilled with host's refreshed state + "Refreshed — host changed" notice; prior target shows "Changed on host"; user re-picks |
| `error` / `unsupported` / `unavailable` | Inline error with `outcome.reason`; retry only on explicit tap; `deliveryUnknown` ⇒ **never auto-repeat** [4] |

**Revalidation:** re-fetch `get_available_models` on open and on app `visibilitychange`→visible (long-lived PWA staleness); dedupe with hydrate to avoid flicker; explicit Refresh affordance on stale/error.

### 2.3 A11y

- Modal dialog semantics: `role="dialog"`, labelled via `aria-label="Change model"`, focus trap, initial focus on search (when present) else current model row, **focus restored to the header trigger on close**.
- Rows: roving tabindex, arrow-key nav, `aria-selected` on current, `aria-current="true"` on the current row; per-row `aria-label` = "<label>, <provider>, current model / <hints>".
- Status line `role="status"`; search results count announced; no-result announced.
- Touch targets ≥ 44pt (Apple HIG [28]); body text ink-on-parchment AA ≥ 4.5:1; clay reserved for large/bold or ≥3:1 iconography.
- `prefers-reduced-motion`: no slide — instant fade only.

### 2.4 Visual/motion

Sheet rises with a single `cubic-bezier(0.32, 0.72, 0, 1)` over ~320ms, 16–24px translate; backdrop fade ~200ms (overlay ≈ 40% ink, optional backdrop-blur); no spring/parallax. Honest to ink-on-parchment: chrome is quiet, only the current-model row and the running-turn banner use clay.

---

## 3. Divergent / minority ideas

1. **Chip row instead of a sheet** (DeepSeek/Gemini pattern): for ≤4 models, render a horizontal chip row above the composer; reserve the sheet for large catalogs. Diverges from "always a sheet" but matches the low-end reality of most hosts.
2. **First-class "Auto / Default" row** (ChatGPT Auto, Perplexity Auto, Claude Default [3][6][18]): relay translates a `default` alias to the host default model. Diverges from today's strict pass-through, but is the strongest single adoption from competitors.
3. **Blocking confirm on mid-conversation switch** (Claude Code's prior-output confirmation [3]): minority because for a remote agent the cache cost is host-side — recommend the hint-banner instead, but log this as the "enterprise-grade" variant.
4. **Per-session memory in the PWA**: cache last-picked model per `sessionId` locally so reopening a session restores the picker to that choice even if the host reverted.
5. **Personality copy**: one idiomatic line per model (ChatGPT's personality lesson [6][7]) instead of dry capability tags — divergent copy direction.
6. **"Run next turn on two models"** comparison mode (ChatGPT A/B, Perplexity's multi-model output) — highest effort, most divergent.
7. **Hide ids entirely** (Meta AI minimalism [20]): only labels + hints for non-technical users, ids behind a "Details" disclosure.

---

## 4. Open questions + risks

- **Mid-turn semantics unverified:** does the pi host *apply* `set_model` to the next request while a turn streams, or reject it? The "hint, not block" banner depends on this. Verify in `runtime-service.ts`/relay before building.
- **Session-scoped switching needs a protocol change:** "this session only" (Claude `s`, Kimi `-m` [3][12]) has no wire equivalent today — requires `SetModelCommand` extension + guards + relay change. Scope risk.
- **Capability hints have no host source:** `AvailableModelDto` is `{provider, id, label}` [14]; extending `RuntimeModelCatalogDto` is clean, but name-heuristics risk wrong/misleading hints and must stay flagged "≈".
- **Sheet-vs-popover on iOS Safari:** RAC `Modal` on standalone-Safari PWA needs real-device QA (scroll lock, safe areas, keyboard avoidance while search is focused).
- **Large catalogs:** hosts modeled on models.dev can expose 50+ models; search + grouping need virtualization or a fetch limit to protect low-end iPhones.
- **Redaction:** model labels/ids flow from the host; the PWA must render only the catalog's declared fields so nothing leaks past the relay's redaction policy.
- **`streaming` flag trustworthiness:** if the relay's `streaming` is flaky, the running-turn banner misleads; verify before relying on it.
- **Haptics:** iOS Safari exposes no haptics to PWAs — skip or gate to a capability check; Gemini's haptics are a native-app advantage.

---

## 5. Sources

**Docs / web**
1. Unite.AI — "Anthropic Brings Opus and Sonnet to Claude Voice Mode" (model picker, inherit-last-model, Haiku-free default): https://www.unite.ai/anthropic-brings-opus-and-sonnet-to-claude-voice-mode/
2. Anthropic support — "Use Voice Mode" (mid-conversation model picker): https://support.claude.com/en/articles/11101966-use-voice-mode
3. Claude Code docs — "Model configuration" (aliases, behavior copy, `/model` confirmation on prior output, Enter/`s`, price + "Requires usage credits" rows, availability-gated listing, fail-closed id check, Default/Org-default rows): https://code.claude.com/docs/en/model-config
4. This repo — `apps/pi-remote-web/src/runtime.ts` (non-optimistic reducer, `deliveryUnknown` invariant, statuses): local
5. Claude — "Claude models explained: choosing the best model for your use case" (Opus/Sonnet/Haiku class copy): https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case
6. AutoGPT — "GPT-5 Reintroduces ChatGPT's Model Picker" (Auto/Fast/Thinking modes, legacy models, 3,000/wk cap, 3.5 Sonnet "funeral"): https://autogpt.net/gpt-5-reintroduces-chatgpts-model-picker/
7. AI Shortlist — "ChatGPT's Model Picker Returns with GPT-5 Update" (mode descriptions, GPT-4o default): https://aishortlist.tech/blog/chatgpt-model-picker
8. TechBuzz — "OpenAI backtracks: GPT-5 model picker returns after user revolt" (timeline, 3,000 msgs/wk): https://www.techbuzz.ai/articles/openai-backtracks-gpt-5-model-picker-returns-after-user-revolt
9. MacRumors — "Claude Voice Mode Gains Opus and Sonnet Model Support": https://www.macrumors.com/2026/07/24/claude-voice-mode-opus-sonnet-model-support/
10. VFuture — "ChatGPT Model Picker 2026: thinking effort features" (2026 picker + composer, reasoning-effort levels): https://vfuturemedia.com/ai/chatgpt/model-picker-2026-thinking-effort-features/ (title verified via search; page fetch 404 — treat details as secondary)
11. This repo — `apps/pi-remote-web/src/SessionHeader.tsx` (current nested-Select sheet, effort group, statusHint): local
12. Kimi Code CLI — README (`--model`, `default_model`, `/model`): https://github.com/MoonshotAI/kimi-code
13. Kimi Code CLI — `kimi` command reference (`-m`/`--model`, session-vs-persistent, `provider catalog` with context window + capabilities from models.dev, pi-tui acknowledgement): https://moonshotai.github.io/kimi-code/en/reference/kimi-command.html
14. This repo — `packages/pi-rpc-protocol/src/types.ts` (`AvailableModelDto`, `RuntimeStateDto.streaming`, `set_model` operation): local
15. DeepSeek API Docs — models `deepseek-v4-flash`/`deepseek-v4-pro`, `thinking` toggle, `reasoning_effort` ("high"): https://api-docs.deepseek.com/
16. Google DeepMind — "Gemini" model page (Pro vs Flash family split): https://deepmind.google/models/gemini/
17. Perplexity Help Center — collections index (AI Models & Content Generation): https://www.perplexity.ai/hub (page is JS-gated; model-selection specifics are app-observed)
18. Perplexity — "AI for the Curious" hub (Auto + Pro model selection): https://www.perplexity.ai/hub
19. Perplexity — official app/site (composer model pill): https://www.perplexity.ai
20. Meta AI — help/site (no consumer model switcher; Reasoning-style toggle + Memory; app-observed): https://www.meta.ai
21. Meta AI reasoning-model rollout context (app-observed "Think longer" toggle): https://ai.meta.com/
22. This repo — `apps/pi-remote-relay/src/runtime/runtime-service.ts` + `apps/pi-remote-relay/tests/runtime-control.test.ts` (ticketed, revision-checked `set_model`, host-confirmed acceptance): local
23. This repo — `goal-prompt.md`/`goal.md` (pi child RPC: `get_available_models`/`set_model`): local
24. LobeChat — provider-grouped `ModelSelect` with search, capability + context badges, pinning: https://github.com/lobehub/lobe-chat
25. ChatGPT-Next-Web — provider-grouped model picker: https://github.com/ChatGPT-Next-Web/ChatGPT-Next-Web
26. Chatbox — provider-sectioned model selector: https://github.com/Bin-Huang/chatbox
27. aichat — REPL `/model` with per-model cost/context annotations: https://github.com/sigoden/aichat
28. Apple HIG — touch targets/accessibility + sheets: https://developer.apple.com/design/human-interface-guidelines/ and https://developer.apple.com/design/human-interface-guidelines/accessibility/

**Mobbin reference flows (login-gated pointers; screen-level URLs require an account, treat as "where to look", not verified screens):** mobbin.com apps — OpenAI ChatGPT ("Model selection" flows), Anthropic Claude ("Model switcher", "Voice mode"), Google Gemini ("Model picker"), Moonshot Kimi, Perplexity ("Model selector"). Not fetchable in this pass; the findings above are independently documented except where explicitly marked "app-observed".

**Confidence flags:** 1.5 Gemini, 1.6 Perplexity, and 1.7 Meta AI sheet-level UI details are app-observed and could not be doc-verified this pass (login-gated / JS-gated); everything else is cited from fetched primary/secondary sources.
