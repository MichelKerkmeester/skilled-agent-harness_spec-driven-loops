# Iteration 1: In-session model switching — baseline gap and reference patterns

## Focus

Q1: How should Pi Remote expose in-session model switching on iPhone (placement, active-model visibility, relay/RPC wiring) without breaking desktop-parity full-access mode or redaction?

## Actions Taken

1. Read current compose/session UI and protocol: `App.tsx` session toolbar + `prompt-composer`, `relay.ts` prompt submit, `pi-rpc-protocol` command union.
2. Read compose and prompt-steering feature docs.
3. Consult Claude and ChatGPT mobile/web model-picker guides; Cursor IDE model-picker layout (no official Cursor mobile app).
4. Consult pi official RPC docs for `set_model` / `get_available_models` / `get_state`.

## Findings

### F-001: Pi Remote has no model control surface today

- **Source:** [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1050-1114] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/pwa/compose-box.md]
- **Pattern (current):** Session chrome shows Back, freshness, compact session id, agent running/idle state, and a single textarea + Send. No model name, no picker, no settings chip.
- **Why it matters:** Operators cannot see or change which model is answering; desktop-parity full-access mode still needs phone-visible model identity for trust and task matching.
- **Apply:** Add a compose-adjacent control that always shows the *active* model short label (provider + id nick), not buried in Settings.

### F-002: Leading apps put the model control next to the send field and keep history intact on switch

- **Source:** [SOURCE: https://usingclaude.com/en/guides/features/claude-app-model-effort-thinking-settings] [SOURCE: https://suneelmaghani.com/how-to-switch-claude-ai-models/] [SOURCE: https://help.openai.com/en/articles/11909943-gpt-5-] [SOURCE: https://www.tonyreviewsthings.com/chatgpt-model-picker-simplified/]
- **Pattern:** Claude: model-name button beside the send field opens a menu (model + effort + thinking). ChatGPT mobile: picker at top of conversation / composer; options increasingly named Instant/Medium/High rather than raw model SKUs. Switch applies to *next* turn; chat history remains.
- **Why it helps:** One-thumb reach, always-visible active selection, mid-conversation change without restart.
- **Apply:** Prefer Claude-style **composer-adjacent** `Button`/`Menu` (React Aria) over a Settings-only path. Label shows current model nick; menu lists `get_available_models` results. Do not clear transcript on switch.

### F-003: Cursor separates model identity from effort — keep model name visible

- **Source:** [SOURCE: https://forum.cursor.com/t/bug-report-the-model-dropdown-is-showing-the-wrong-list-high-low-medium-instead-of-the-models/167238]
- **Pattern:** Cursor’s newer picker opens on High/Medium/Low effort first; model list is a secondary row. Users complain when the active model name disappears.
- **Why it helps (negative lesson):** Effort-first without a persistent model label hurts glanceability.
- **Apply:** For Pi Remote, always show **model nick as the closed-button label**; put effort in a sibling chip or nested submenu — never replace the model name with only “High/Medium/Low”.

### F-004: Pi RPC already exposes model selection; Pi Remote protocol does not forward it

- **Source:** [SOURCE: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md] (`set_model`, `get_available_models`, `get_state`) [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/packages/pi-rpc-protocol/src/types.ts:63-69]
- **Pattern:** Headless pi accepts `{"type":"set_model","provider":"...","modelId":"..."}` and `get_available_models`. Pi Remote’s `PiRpcCommand` union today is only prompt/steer/follow_up/abort/read-state/get_entries — no model commands. Phone→relay path is `prompt.submit` only.
- **Why it helps:** Wiring is an allowlisted relay RPC forward, not a new agent capability.
- **Apply (concrete stack):**
  1. Extend `pi-rpc-protocol` with phone→relay DTOs: `model.list`, `model.set` (opaque ids only; never embed API keys).
  2. Relay supervisor forwards to child `get_available_models` / `set_model` on the existing serialized write chain.
  3. Project active model from `get_state` (or set_model response) into session card / session chrome as redacted labels (provider + model nick), no paths/secrets.
  4. UI: React Aria `Menu` from composer footer; disable while `awaitingSnapshot` or non-live connection (same guards as compose-box).
  5. Keep mutation approval path unchanged — model switch is session config, not a host mutation.

### F-005: Ruled out — Settings-only model page as primary affordance

- **Source:** Claude/ChatGPT place picker in-chat; 044 research already stressed action-first session UX. [SOURCE: file:specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md]
- **Why ruled out:** Settings-only hides the active model during steering and adds navigation cost on a one-handed PWA.
- **Do instead:** In-composer picker + optional Settings for defaults/scoped favorites later.

## Sources Consulted

- Pi Remote: `App.tsx`, `relay.ts`, `types.ts`, compose-box.md, prompt-steering-transport.md
- Prior: 044 research.md (compose Send/Steer patterns)
- External: usingclaude model/effort guide; Claude mobile switch guides; OpenAI GPT-5.6 help; ChatGPT picker simplification; Cursor forum model-picker layout; pi `rpc.md`

## Assessment

- **newInfoRatio:** 0.92
- **Novelty justification:** First evidence that the gap is total (no UI + no protocol forward) while pi RPC already has `set_model`/`get_available_models`, plus a concrete composer-adjacent pattern with Cursor’s negative lesson on hiding model names.
- **Confidence:** High on gap and RPC mapping; medium on exact `get_state` field names for model nick (confirm against live child `get_state` shape in a later wiring task).

## Reflection

- **Worked:** Pairing current compose UI with official pi RPC docs immediately produced an adoptable wiring plan.
- **Failed:** Attempting to treat Cursor mobile as a peer — there is no official Cursor mobile chat app; used IDE picker as coding-agent reference only.
- **Ruled out:** Settings-only primary model control.

## Recommended Next Focus

Q2: Effort / thinking-level switching — map Claude effort menu + Cursor High/Medium/Low + pi `set_thinking_level` / `get_available_thinking_levels` / `cycle_thinking_level` onto a sibling chip that never eclipses the model label.
