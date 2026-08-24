---
title: Mobile AI Chat UI/UX Research
description: Compares major mobile AI conversation screens to derive composer, message, action-row, and streaming targets for Pi Remote.
trigger_phrases:
  - 'cross-app mobile chat patterns'
  - 'Claude composer measurements'
  - 'AI chat action-row behavior'
importance_tier: normal
contextType: general
version: 1.2.0.3
---

# Mobile AI chat UI/UX research: conversation screen + composer

Research snapshot: 2026-08-15. Priority order follows the brief, with Claude treated as the primary reference.

This report focuses on the in-thread conversation view and the message composer, not onboarding, navigation architecture, or feature breadth. App UI varies by account, plan, locale, theme, app version, and rollout cohort, so measurements are reconstruction targets rather than private implementation specs.

### How to read the measurements

- Values are approximate iPhone logical points (pt), which are the useful design-unit equivalent of pixels for an iOS build. A 44 pt control is approximately 44 px at 1x or 88 px in a 2x screenshot.
- `Observed` means visible in a current or recent screen capture, App Store screenshot, or explicit vendor documentation. `Inferred` means a measured visual estimate or a stable iOS convention where the vendor does not publish numbers.
- A practical tolerance of ±2–4 pt is appropriate for the values below. Touch targets should stay at least 44 × 44 pt even when the glyph is smaller.

## 1. Anthropic Claude iOS app (PRIMARY)

Claude is the strongest reference for a calm, reading-first conversation: an off-white canvas, serif assistant typography, no assistant bubble, a compact action row, and a large floating composer. Anthropic’s own help describes a model selector at the top of mobile chats, a plus button for additional options, microphone dictation, and a waveform button for two-way voice. A recent visual critique confirms the greeting, `Chat with Claude` placeholder, plus, microphone, waveform, animated Claude mark, and model selector.

### Composer / input anatomy

- **Overall frame — observed/inferred:** a floating white or warm-white rounded rectangle, approximately 346–352 pt wide on a 390–393 pt viewport, with a 28–32 pt corner radius. One-line height is roughly 88–96 pt. The visible capture has a very subtle 1 pt warm-gray edge and soft shadow rather than a strong border. Use a 16–20 pt horizontal inset from the screen edge and 14–16 pt internal vertical padding.
- **Text area:** 17–18 pt sans text, about 24 pt line-height. The text begins around 18–20 pt from the left edge and 14–16 pt below the top edge. The toolbar is pinned to the bottom of the card, so multiline input grows upward while the plus and voice/send controls stay aligned on the last row. A useful implementation cap is 5–6 lines, approximately 184–220 pt tall; beyond that, scroll the text internally.
- **Left affordance:** a plus glyph, visually about 20–22 pt, inside a 44 pt hit area at the lower-left. It opens camera, photos, files, and conversational/tool options. Anthropic explicitly documents the plus as the entry point for additional options; the mobile critique calls out files, images, style preferences, web search, research, and health modes behind it.
- **Right affordance order:** `microphone` → `voice/live waveform` when the field is empty. The microphone is a 44 pt hit target with a roughly 20–22 pt outline glyph. The live voice control is a filled circular button, approximately 40–44 pt diameter, with a white waveform glyph. Anthropic describes the waveform as the voice-mode entry point next to the microphone.
- **Typed state:** once text exists, the rightmost live-wave control changes to a filled circular send button. The inspected light-theme capture uses a warm terracotta/orange fill, approximately `#C96F4B`, with a white 20–22 pt arrow-up glyph. The microphone remains immediately to its left. The reliable state recipe is therefore `+` / text / mic / filled send-circle.
- **Dictation state:** microphone recording is a text-transcription mode, not a voice call. After speech is converted to text, the user sends with an arrow-up button; an `X` cancels. This is explicitly documented by Anthropic.
- **Placeholder:** new chat uses `Chat with Claude`; an in-progress conversation uses `Reply to Claude`. The latter is a particularly good conversational cue because it communicates that the composer is a reply field rather than a generic search box.
- **Inline chips:** no persistent chip is required inside the idle composer. The model selector sits in the header, while tools and upload options appear from the plus menu. Artifacts, documents, and tool cards appear in the message stream rather than taking over the composer.

### Message layout

- **User turn — observed/inferred:** compact right-aligned rounded bubble rather than full-width prose. Target a maximum width of 78–84% of the content column, 14–18 pt horizontal padding, 10–14 pt vertical padding, and a 16–20 pt radius. A pale neutral or slightly warm fill keeps the user visually distinct without competing with the answer.
- **Assistant turn — observed:** plain, left-aligned prose on the canvas; no assistant bubble and no persistent avatar/name label. The content column is approximately 24–28 pt from the leading edge and 20–24 pt from the trailing edge.
- **Typography:** the signature is a serif body, visually close to New York/Tiempos. Use approximately 19–21 pt body size with 29–32 pt line-height; headings are approximately 24–27 pt with 31–35 pt line-height. Paragraph spacing is roughly 12–16 pt. This generous line length and rhythm are a major part of Claude’s “thinking partner” feel.
- **Lists and code:** numbered/bulleted lists use a 28–36 pt hanging indent and roughly 10–14 pt between items. Code uses a monospaced face in a lightly tinted, rounded block with 12–16 pt internal padding; horizontal overflow should scroll rather than wrap long identifiers.
- **Turn rhythm:** approximately 22–30 pt between the end of a user bubble and the start of the assistant answer; 24–36 pt between completed turns. Keep the action row visually attached to the answer with a 14–18 pt gap.

### Per-message action row

- **Observed order in the current conversation capture:** copy (overlapping squares), share/export (arrow from tray), play/read aloud (triangle), thumbs up, thumbs down, regenerate (circular arrow).
- **Sizing:** 20–23 pt glyphs, 44 pt hit areas, with approximately 14–18 pt visible gap between glyphs. The row is low-contrast gray so it supports the answer instead of becoming a second toolbar.
- **Visibility:** shown under a completed assistant answer in the inspected capture; the safest product rule is to render it for the latest completed assistant turn and reveal older rows on tap/long-press or when they are the active answer. Do not put the row under user bubbles.
- **Interaction model:** copy and read-aloud are immediate; share opens the system share sheet; thumbs provide feedback; regenerate re-runs the latest answer. During streaming, replace the row with a stop control or hide it until the response completes.

### Header / top bar

- **Height:** approximately 56–64 pt below the iOS safe-area/status region; total top occupied area is about 100–110 pt on a Face ID iPhone.
- **Left:** back arrow in a 44–48 pt circular or rounded hit target. In the root chat list, this becomes a hamburger/sidebar control.
- **Center:** active model name, e.g. `Sonnet 4.5`, in a serif or high-contrast display style around 21–24 pt, followed by a 16–18 pt downward chevron. Anthropic says the mobile model is shown at the top of the screen and opens the model selector.
- **Right:** an orange Claude mark with a plus/new-chat affordance, visually inside a 44–48 pt light circular target. Keep it aligned to the left control rather than treating it as a third text label.

### Signature details

- **Disclaimer:** `Claude can make mistakes. Please double check responses.` In the inspected capture it is a two-line, right-aligned or center-right block immediately below the action row and above the composer. Use 14–16 pt sans, 19–21 pt line-height, and a maximum width of roughly 240–270 pt.
- **Scroll-to-bottom:** a floating white circular button, approximately 44–48 pt diameter, with a dark down chevron. It sits near the bottom center of the content viewport, often overlapping the last answer but remaining above the composer by about 12–20 pt.
- **Streaming/generating:** the orange Claude starburst/asterisk mark animates near the answer/action area. It is more distinctive than generic three dots and should occupy about 24–32 pt, with the animation stopping when the answer completes.
- **Empty/new chat:** a centered orange Claude mark, followed by a time-sensitive greeting such as `How can I help you this evening`. The greeting is large and serif, approximately 28–32 pt. The composer sits below it with `Chat with Claude`; suggestions can be rendered as lightweight prompt rows/cards between the greeting and composer, but they should not crowd the first typing action.

### Source grounding

- [Claude Help Center: Get started with Claude](https://support.claude.com/en/articles/8114491-get-started-with-claude) — mobile model selector and plus/options behavior.
- [Claude Help Center: Use dictation on Claude Mobile](https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile) — microphone, arrow-to-send, and cancel behavior.
- [Claude Help Center: Use voice mode](https://support.claude.com/en/articles/11101966-use-voice-mode) — waveform next to microphone, voice-mode transition, and voice controls.
- [IXD@Pratt: Design Critique — Claude Mobile App](https://ixd.prattsi.org/2026/02/design-critique-claude-mobile-app/) — greeting, `Chat with Claude`, plus, model selector, waveform, and thinking mark.
- [Claude by Anthropic on the App Store](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) — current iOS listing and screenshots.

## 2. Moonshot Kimi

Kimi is a more tool-forward, model-forward design. Its current mobile guidance puts the model switch above the input and exposes attachments and voice from the bottom composer. The latest App Store listing is Kimi K3, while the help center names K3, K3 Swarm, and K2.6 as the principal model choices. The exact English copy varies by locale; the Chinese UI is the most consistently documented visual reference.

### Composer / input anatomy

- **Overall frame — observed/inferred:** a rounded rectangular input card or bar at the bottom, approximately 344–352 pt wide. The simple one-line state is around 52–60 pt high; with the tool row and mode controls visible, plan for 88–112 pt. Use a 20–24 pt radius, 1 pt neutral border, and a light-gray/white fill in light mode or charcoal fill in dark mode. Shadow is minimal; Kimi reads more like a utility tray than a floating glass card.
- **Padding:** 16–20 pt horizontal inset; 12–14 pt top/bottom padding around the text; 8–12 pt between the text line and the lower tool row. Body input is approximately 16–17 pt with 23–25 pt line-height. Multiline input grows upward to about 5 lines, approximately 180–220 pt maximum, while the tool row remains at the bottom.
- **Left affordance:** plus/paperclip, approximately 20–22 pt glyph in a 44 pt hit target. Kimi’s mobile help explicitly lists file, photo, local-file, and WeChat-file upload behind the plus button.
- **Right affordance order:** the stable documented order is `voice/microphone` plus a send arrow in the bottom toolbar. In text mode, the send arrow is rightmost and becomes active after text is entered; use a blue or dark filled 40–44 pt circle with a white arrow-up glyph. The microphone/voice control remains a separate 44 pt control rather than being hidden in the keyboard.
- **Voice/live distinction:** Kimi supports voice calls as a capability, but first-party mobile documentation most clearly describes the mic as voice input. Treat a waveform/live-voice control as an optional second state, not as a required persistent third button until the product surface is confirmed for the target locale.
- **Placeholder:** Chinese captures and the official App Store feedback consistently use `有什么问题尽管问我` (“Ask me anything / Ask whatever you have a question about”). English copy is localized and should be treated as a string variant, not hard-coded from the Chinese UI.
- **Inline chips:** the active model selector is positioned immediately above the input: current options are `K3`, `K3 Swarm`, and `K2.6`/`K2.6 Fast`. Kimi’s current help says web search is decided automatically, so do not assume a permanent search toggle in the composer. Taskbar/tool modes can appear above the field for Slides, Websites, files, and agent workflows.

### Message layout

- **User turn — observed in mobile visual references:** right-aligned blue or blue-gray rounded bubble, usually 75–85% max width, with 14–18 pt horizontal padding, 10–14 pt vertical padding, and a 16–20 pt radius.
- **Assistant turn:** left-aligned readable response, either plain on the canvas or inside a very light neutral answer surface. Kimi is sans-first: approximately 16–17 pt body size, 25–28 pt line-height, with 10–14 pt paragraph spacing. Chinese text should use the system CJK face (PingFang SC or equivalent) rather than a decorative Latin font.
- **Rich output:** headings and lists are standard markdown; files, generated documents, search findings, and agent progress should become structured cards/rows that can scroll horizontally or vertically. Code uses a monospaced font in a tinted block with 12–16 pt padding.
- **Turn rhythm:** 12–16 pt inside a bubble, 24–32 pt between user and assistant turns. Avoid an avatar/name row unless a multi-agent or group-chat mode is active; the default single-assistant thread does not need one.

### Per-message action row

- **Important difference:** Kimi’s consumer mobile app does not have a stable, always-visible regenerate row under every assistant message in the sources reviewed. A Kimi forum response explains that mobile regeneration is reached by tapping the user’s previous prompt, then confirming or editing it; the same thread asks for a dedicated retry button because it was missing.
- **Recommended reconstruction:** keep the default assistant row compact: copy plus a low-emphasis overflow/feedback affordance, 20–22 pt glyphs in 44 pt targets. Put retry/regenerate behind the user-prompt edit state or overflow rather than assuming six permanent buttons.
- **Web comparison:** Kimi Code’s documented web UI has Copy and Fork actions, but that is a separate product surface and should not be copied wholesale into the consumer iOS chat.
- **Read aloud:** Kimi has voice-call capability, but a per-answer play button is not consistently documented for the consumer mobile UI. Treat it as an optional overflow action rather than a guaranteed row item.

### Header / top bar

- **Height:** approximately 56–64 pt below the safe area.
- **Left:** hamburger/sidebar in a 44 pt hit target for history and settings.
- **Center:** branded `Kimi` or the active mode/model. The current help center places model switching above the input, so the header should not be treated as the only model selector.
- **Right:** new chat, voice/settings, or profile/overflow controls vary by app build and locale. Keep two 44 pt targets at most; the conversation title should remain visually secondary to the active task.
- **Model placement principle:** if `K3`, `K3 Swarm`, and `K2.6 Fast` are visible, put them in a pill or segmented control immediately above the composer, with 14–16 pt labels and an 8–12 pt gap from the field.

### Signature details

- **Disclaimer:** older Chinese mobile references show `内容由 AI 大模型生成，请仔细甄别` (“Content generated by AI; please verify carefully”) below the composer or answer. A persistent English equivalent is not established by the current first-party sources, so treat this as locale/version-dependent.
- **Scroll-to-bottom:** no stable Kimi-specific affordance is documented. Use a standard 44–48 pt floating down-chevron only when the user is materially away from the latest answer; hide it at the bottom.
- **Streaming/generating:** expect an animated Kimi mark, spinner, or compact progress state, especially for K3/agent work. Keep it within the assistant answer column and reserve the composer’s rightmost control for stop/cancel while streaming.
- **Empty/new chat:** Chinese visual references use a friendly greeting such as `Hi，我是 Kimi~很高兴遇见你` and prompt users to send a URL or document. A strong layout is centered greeting/mark, 2–5 suggestion rows, then the composer anchored to the bottom. Keep the welcome block below the header and above the tool/model strip.

### Source grounding

- [Kimi Help Center: Overview](https://www.kimi.com/help/getting-started/overview) — models, automatic web-search decision, voice calls, file handling, and mobile surface.
- [Kimi Help Center: New-user guide](https://www.kimi.com/zh-cn/help/new-user-guide/overview) — mobile model switch above the input, plus attachments, voice input, and sidebar placement.
- [Kimi on the App Store](https://apps.apple.com/ca/app/kimi-kimi-k3-is-live/id6474233312) — current K3 mobile listing and supported platforms.
- [Moonshot community: Feedback on Kimi chat and phone app](https://forum.moonshot.ai/t/feedback-on-the-kimi-chat-web-version-and-the-phone-app/40) — current mobile retry/regenerate limitation and prompt-edit path.
- [Kimi Code Web UI reference](https://moonshotai.github.io/kimi-cli/en/reference/kimi-web.html) — Copy/Fork action pattern for the separate Kimi Code surface.

## 3. OpenAI ChatGPT iOS app

ChatGPT’s current iOS pattern is a neutral, low-chrome prompt bar with a plus affordance, dictation microphone, and integrated Voice control. OpenAI explicitly documents Voice as a control in the message bar, an add button for images while Voice is active, typing inside a live voice conversation, thumbs-down reporting under a message, and sharing from the top-right of the chat. The exact visual color and whether the live-wave button remains beside send vary during rollout.

### Composer / input anatomy

- **Overall frame — observed/inferred:** a light-gray or white floating rounded card, approximately 350–360 pt wide with 16–20 pt side margins. One-line height is about 52–60 pt; with the lower tool row and attachments, the usable card is closer to 84–104 pt. Use a 24–28 pt radius, a 1 pt neutral edge or very soft shadow, 16–18 pt horizontal padding, and 10–12 pt vertical padding.
- **Input typography:** SF Pro or equivalent sans at 16–17 pt, around 23–25 pt line-height. Multiline input grows upward to 5–6 lines, about 180–220 pt; pin the toolbar to the bottom and let long text scroll internally.
- **Left affordance:** plus/add, 44 pt hit target, 20–22 pt glyph. OpenAI documents this add button for attaching images during Live; the broader iOS composer also uses it for camera, photos, files, and tools.
- **Right affordance order — empty state:** `microphone/dictation` followed by the integrated `Voice` waveform control at the far right. OpenAI’s Voice FAQ describes the message-bar voice control and shows the voice button next to the microphone.
- **Right affordance order — typed state:** a circular send control appears once text exists. Current visual references generally use a dark charcoal/black filled circle, approximately 40–44 pt, with a white arrow-up glyph. The dictation control may collapse or be replaced by send; the live-wave control can remain as the far-right voice entry point in some rollouts. Treat this as a state machine, not a fixed four-icon row.
- **Recording state:** the composer becomes a short recording/transcription strip with waveform/timer, `X` cancel, and check/arrow confirm. OpenAI distinguishes Voice from Dictation: Dictation is for recording, reviewing/editing the transcript, and then sending as text.
- **Placeholder:** current variants include `Ask anything` and the familiar `Message ChatGPT`. Use the latter when the product wants explicit messaging language; use the former when starter prompts and search/tool behavior are central.
- **Inline chips:** model and tools are increasingly exposed through the composer/toolbar, but OpenAI’s iOS documentation does not promise one fixed chip order. Put tool chips such as `Search`, `Think`, `Deep research`, or file/image context above the field only when active; keep the idle state visually quiet. Starter prompts are more reliable on the empty state than permanent mode pills.

### Message layout

- **User turn:** right-aligned, compact light-gray neutral bubble or rounded text surface, typically 78–84% max width, 14–16 pt horizontal padding, 10–14 pt vertical padding, 16–20 pt radius. Do not give the user full-width assistant typography.
- **Assistant turn:** plain left-aligned sans prose without a name/avatar row. Use 16–17 pt body, 24–26 pt line-height, 12–16 pt paragraph spacing, and 20–24 pt bold headings. Lists use 26–32 pt indent; code uses 13–14 pt monospaced text in a tinted rounded block with 12–16 pt padding.
- **Vertical rhythm:** 8–12 pt between consecutive paragraphs, 20–28 pt between a user bubble and the answer, and 24–32 pt between completed turns. Keep citations, charts, and tool cards attached to the answer with 12–16 pt spacing.

### Per-message action row

- **Core actions:** copy, share, regenerate/try again, thumbs up, thumbs down, and read aloud or `Speak` through a response menu/selection UI. OpenAI documents thumbs-down directly beneath a mobile message for reporting. On iOS, long-press exposes Copy, Select Text, Speak, Share, and feedback actions; share links can also be created from the top-right or an individual assistant response.
- **Sizing:** 20–22 pt glyphs in 44 pt hit targets; 14–18 pt visible spacing. Keep the row low-contrast and aligned to the assistant column.
- **When shown:** the most current completed assistant answer is the safest always-visible target. Older messages should reveal actions on tap/long-press to reduce repetitive chrome. During streaming, show stop/cancel instead of retry and feedback.
- **Regenerate scope:** the latest response is the primary target. If the product supports editing an earlier user message, make the resulting branch explicit rather than silently replacing the conversation.

### Header / top bar

- **Height:** approximately 56–64 pt below the safe area; use a 44 pt control grid.
- **Left:** hamburger/sidebar button, 44 pt hit area, for history and settings.
- **Center:** active model name or `ChatGPT` with a small chevron, generally 17–20 pt sans. In model-heavy builds, the label can be `GPT-5.x` or a mode name; keep it tappable but not visually dominant.
- **Right:** share, new chat, or overflow. OpenAI documents a share button at the top-right of the chat screen; on some builds new chat and overflow are combined. Use 2 × 44 pt hit targets with 12–16 pt gap.

### Signature details

- **Disclaimer:** OpenAI’s canonical wording is `ChatGPT can make mistakes. Check important information...`. It is not a guaranteed persistent footer under every current iOS answer; it appears in product/voice guidance and may be surfaced contextually. If a persistent footer is desired, use 14 pt gray text, 18–20 pt line-height, centered under the last assistant answer and above the composer.
- **Scroll-to-bottom:** common mobile behavior is a 44–48 pt floating circular down-chevron that appears only when the user is away from the latest answer. Place it centered above the composer, 12–20 pt clear of the input card.
- **Streaming/generating:** use a blinking caret, animated dot, or compact shimmer/`Thinking` indicator in the assistant column. Stop/cancel must be reachable in the composer while the response is streaming.
- **Empty/new chat:** centered ChatGPT mark with a short greeting such as `How can I help you today?`, then 3–4 starter prompt chips or cards. OpenAI’s release notes explicitly call out examples shown at the beginning of a new chat. Keep the composer fixed to the bottom so the first prompt is always reachable.

### Source grounding

- [OpenAI Help Center: ChatGPT Voice](https://help.openai.com/en/articles/20001274-chatgpt-voice) — Voice in the message bar, add button, typing during Live, and voice states.
- [OpenAI Help Center: Voice Mode FAQ](https://help.openai.com/en/articles/8400625-voice-mode) — bottom-right Voice control next to microphone and integrated/separate Voice rollout.
- [OpenAI Help Center: ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) — iOS attachment/composer changes, large-paste attachment behavior, and new-chat examples.
- [OpenAI Help Center: Reporting content in ChatGPT](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms) — thumbs-down action under a mobile message.
- [OpenAI Help Center: Shared Links FAQ](https://help.openai.com/en/articles/7925741-chatgpt-shared-links-faq) — top-right share and individual-response sharing.
- [ChatGPT on the App Store](https://apps.apple.com/us/app/chatgpt/id6448311069) — current iOS listing and screenshots.

## 4. Perplexity

Perplexity is the search-first version of the chat pattern. Its composer is simultaneously a prompt field, search-mode switcher, source selector, model selector, attachment target, and voice entry point. The answer surface is also different: citations, source cards, and follow-up suggestions are part of the message rhythm rather than post-processing.

### Composer / input anatomy

- **Overall frame — observed/inferred:** rounded search/chat field at the bottom, approximately 350–360 pt wide, 48–60 pt high in the simplest state and 88–116 pt when the mode/source toolbar is expanded. Use a 20–24 pt radius, 1 pt border, and a white or very dark fill depending on theme. The original iOS visual language used a minimalist, high-contrast search bar; newer builds layer mode controls inside or immediately above it.
- **Padding:** 16–18 pt horizontal inset, 12–14 pt vertical padding, 16–17 pt input text, 23–25 pt line-height. Multiline prompts grow upward to 5–6 lines, with attachments and chips forming additional rows inside the card.
- **Left affordance:** plus/attachment or camera/file entry in a 44 pt hit target. Perplexity’s own session documentation lists file attachment as a first-class query input.
- **Right affordance order:** the default text pattern is `microphone/voice` and then the circular send arrow once text exists. The voice assistant is launched by tapping the voice icon in the input box; in visual references it appears as a waveform or sound-wave button next to `Ask anything`. Use a 40–44 pt circle for the active voice/send affordance.
- **Placeholder:** new search commonly uses `Ask anything…` / `Ask anything`; a follow-up thread uses `Ask a follow up` or an equivalent `Ask a follow-up…` string. The placeholder should change after the first answer to reinforce continuity.
- **Inline chips:** this is Perplexity’s signature. Put `Pro`, `Research`, or `Create files and apps` near the left/center of the toolbar; model selection and source/focus selection can sit above or inside the field. First-party session guidance names Pro, Research, Create files and apps, model choice, Web/Academic/Finance/Files sources, attachment, and microphone as composer controls.
- **Mode state:** make the active search mode a visible pill, not an icon-only toggle. A 72–112 pt chip at 32–36 pt height with 14–15 pt label is a good target; keep the send circle at the far right.

### Message layout

- **User turn:** right-aligned compact neutral bubble or rounded prompt surface, approximately 78–84% max width, 14–18 pt horizontal padding, 10–14 pt vertical padding, and 16–20 pt radius.
- **Assistant turn:** left-aligned sans prose, generally no assistant bubble or avatar. Use 16–17 pt body and 24–27 pt line-height. Source citations are small inline numbered links or compact source chips; source cards should be 12–16 pt rounded surfaces with 12–16 pt internal padding.
- **Search result rhythm:** answer summary → source/citation row → source cards or expandable references → related follow-up prompts. Keep 12–16 pt between these blocks and 24–32 pt before the next user turn.
- **Lists/headings/code:** standard markdown rendering; headings 20–22 pt semibold, lists with 26–32 pt indent, code in a horizontally scrollable monospaced card. Use enough width for citations without making prose lines excessively long.

### Per-message action row

- **Observed/reference actions:** thumbs up, thumbs down, and comment/feedback controls appear beneath answers in older iOS visual references. Current product behavior also needs copy, share, and overflow for a response; read aloud is more likely in the voice assistant or overflow than in the default row.
- **Sizing:** 20–22 pt glyphs, 44 pt hit areas, 14–18 pt spacing. Keep actions beneath the answer and before the related-question chips.
- **When shown:** display on completed answers, especially the latest answer; collapse older action rows behind an overflow or long-press. Perplexity’s answer is source-heavy, so keep the action row visually quieter than the citations.
- **Regenerate:** not as central as in ChatGPT/Claude. A follow-up is the primary refinement pattern; if retry is supported, place it in overflow next to copy/share.

### Header / top bar

- **Height:** approximately 56–64 pt below the safe area.
- **Left:** account/sidebar/back control, 44 pt target. In a thread, use a back arrow or session/library affordance.
- **Center:** session title or a compact search mode label; do not force a model name into the center if the active mode is more important.
- **Right:** share session and overflow/new chat, each in a 44 pt target. The current help center documents sharing from the session; keep it visible in a thread.
- **Voice assistant:** when voice mode opens, a settings/gear control may appear at the top; the voice state should visually separate itself from the normal text thread without losing the transcript.

### Signature details

- **Disclaimer:** no stable, persistent `Perplexity can make mistakes` footer was established in the current first-party sources. Perplexity’s signature trust cue is source citation/transparency rather than a disclaimer. If Luna uses a disclaimer, keep it below citations and above the composer in 14 pt gray, not inside the answer body.
- **Scroll-to-bottom:** use the common 44–48 pt floating down-chevron only when away from the latest answer; keep it above the composer and below source cards.
- **Streaming/generating:** search progress is more informative than a generic shimmer. Use a compact `Searching…`/source-fetch progress row, spinner, or animated source strip before the answer, then transition to normal prose and citations.
- **Empty/new chat:** a dark or light home canvas with `Where knowledge begins`/`Ask anything`, a few popular or suggested queries, and bottom navigation for Home, Discover, and Library. Treat suggested queries as tappable rows/cards, not as assistant messages.

### Source grounding

- [Perplexity Help Center: What is a Session?](https://www.perplexity.ai/help-center/en/articles/10354769-what-is-a-thread) — search box, follow-up context, search modes, model/source selection, attachments, and microphone.
- [Perplexity Help Center: How to use the Perplexity Voice Assistant for iOS](https://www.perplexity.ai/help-center/en/articles/11132456-how-to-use-the-perplexity-voice-assistant-for-ios) — voice icon in the input box and voice-session entry.
- [Perplexity Help Center: What is Pro Search?](https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search) — model selection, sources, citations, and conversational refinement.
- [Perplexity on the App Store](https://apps.apple.com/us/app/perplexity-ai-search-chat/id1668000334) — current iOS feature set and voice/source positioning.
- [Voicebot: Perplexity iOS app screenshots](https://voicebot.ai/2023/03/28/perplexity-ai-raises-25-6m-and-launches-conversational-search-engine-ios-app/) — answer/source/action-row visual reference.

## 5. DeepSeek

DeepSeek’s mobile composer is the most explicit about capability modes. The current visual teardown shows an `Instant`/`Expert` tier choice above a centered composer card, with `DeepThink` and `Search` chips inside the card. The official app documentation confirms web search, Deep-Think mode, and file upload; current App Store notes also mention vision and photo/file upload improvements.

### Composer / input anatomy

- **Overall frame — observed/inferred:** centered rounded card on a mostly blank canvas in the new-chat state. Target approximately 342–354 pt wide and 96–124 pt high with the mode chips visible. Use a 18–24 pt radius, a 1 pt cool-gray border, white/light-gray fill in light mode or charcoal fill in dark mode, and little or no drop shadow.
- **Padding:** 16–20 pt horizontal, 14–16 pt top, 10–14 pt bottom. Text is approximately 16–17 pt with 23–25 pt line-height. Multiline input grows upward; cap the text area at 5–6 lines, roughly 180–220 pt total, while keeping mode chips visible below it.
- **Left affordance:** plus/paperclip in a 44 pt hit target, with a 20–22 pt glyph. It opens file, photo, or document attachment; official DeepSeek documentation names file upload/text extraction and current App Store notes mention photo/file improvements.
- **Right affordance:** send arrow is the primary rightmost action. Use a 40–44 pt dark-blue or charcoal filled circle with white arrow-up when the prompt is non-empty; keep it disabled/ghosted when empty. Unlike Claude/ChatGPT/Gemini, a dedicated live-voice wave button is not a stable DeepSeek signature in the first-party sources reviewed. If dictation is offered, treat it as a microphone control or iOS keyboard affordance, not as a full-duplex assistant mode.
- **Placeholder:** English visual references use `Message DeepSeek`; Chinese captures use `给 DeepSeek 发送消息`.
- **Inline chips:** `DeepThink (R1)` and `Search` sit inside the composer card. The current teardown also describes an `Instant`/`Expert` toggle above the card. In the Instant tier, Search may be armed by default; make active chips clearly filled/highlighted and inactive chips outlined/ghosted.
- **Tool placement:** mode chips belong in the card because they change the next send. Model tier belongs just above the card because it changes the response lane. Avoid putting both controls in a hidden plus menu.

### Message layout

- **User turn:** right-aligned compact bubble, normally pale blue/gray in light mode or a slightly brighter charcoal in dark mode; max width about 80–86%, 14–18 pt horizontal padding, 10–14 pt vertical padding, 16–20 pt radius.
- **Assistant turn:** left-aligned sans prose on the canvas. Use 16–17 pt body, 24–26 pt line-height, and 12–16 pt paragraph spacing. DeepThink responses add a collapsible `Thinking`/reasoning panel before or above the final answer; give it a lightly tinted surface, 16–20 pt radius, and 12–16 pt padding.
- **Rich content:** headings 20–22 pt semibold; lists with 26–32 pt indent; code in monospaced rounded cards; tables should scroll horizontally or become stacked cards on narrow screens. Search results and file parsing should use small status rows rather than injecting tool logs into the main prose.
- **Turn rhythm:** 12–16 pt inside a bubble, 20–28 pt between user and assistant, 24–32 pt between turns. Keep the `Thinking` panel attached to its answer with 8–12 pt spacing.

### Per-message action row

- **Core actions:** copy/select text and like/dislike are the most stable mobile actions. Retry/regenerate is often reached by tapping/editing the user’s prompt rather than from a permanent button under the assistant response.
- **Sizing:** 20–22 pt glyphs, 44 pt hit areas, 14–18 pt gaps. A compact copy/feedback/overflow row is preferable to a long Claude-style six-button strip.
- **When shown:** use the row for the latest completed answer or show it after tap/long-press. Keep `DeepThink` reasoning controls out of the action row; they belong in the response panel.
- **Read aloud:** not a stable first-party consumer-mobile action in the sources reviewed. Do not reserve a permanent play icon unless the target build demonstrates it.

### Header / top bar

- **Height:** approximately 56–64 pt below the safe area.
- **Left:** hamburger/sidebar or back button in a 44 pt target.
- **Center:** `New chat`/conversation title or the DeepSeek whale/brand mark; the active tier (`Instant`/`Expert`) is more useful than an opaque model ID.
- **Right:** new chat, history, or overflow in one or two 44 pt targets. Keep the mode/tier selector visually tied to the composer rather than making the header a dense settings bar.

### Signature details

- **Disclaimer:** Chinese visual references show `内容由 AI 生成，请仔细甄别` (“Content generated by AI; please verify carefully”). A stable current English footer was not found in first-party docs. If implemented, use 14 pt gray text and place it below the last answer or immediately above the composer.
- **Scroll-to-bottom:** no DeepSeek-specific floating affordance is consistently documented. Use the common 44–48 pt down-chevron only when needed.
- **Streaming/generating:** the visible signature is an expanding/collapsing `Thinking` panel, plus a spinner or progressive text reveal. During generation, replace send with stop/cancel and keep DeepThink/Search state visible.
- **Empty/new chat:** whale logo/mark, `Hi, I’m DeepSeek` or `嗨！我是 DeepSeek`, and a one-line capability invitation about searching, answering, and writing. Place `DeepThink` and `Search` directly above or inside the composer so the first mode choice is obvious.

### Source grounding

- [DeepSeek API Docs: Introducing DeepSeek App](https://api-docs.deepseek.com/news/news250115/) — official app, web search, Deep-Think mode, file upload, and cross-platform history.
- [DeepSeek on the App Store](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349) — current iOS listing, photo/file updates, vision mode, and history search.
- [AI UX Playground: DeepSeek composer UX](https://aiuxplayground.com/teardowns/deepseek/composer/) — current Instant/Expert tier, DeepThink/Search chip placement, active states, and centered card pattern.
- [MacRumors: DeepSeek iOS app interface](https://www.macrumors.com/2025/01/27/deepseek-ai-app-top-app-store-ios/) — mobile screenshot reference for `Message DeepSeek`, `DeepThink (R1)`, and `Search`.

## 6. Google Gemini

Gemini’s mobile chat is a conventional Google-style document surface with a compact top app bar and a large bottom composer card. The strongest signature is the combination of a mode pill such as `Fast`, a blue active search/research chip, a microphone, and a separate `Live` voice path. Google’s iOS help confirms Keyboard, Microphone, Live, and Send states; the inspected current capture shows the exact visual hierarchy.

### Composer / input anatomy

- **Overall frame — observed:** a white bottom card/sheet spanning most of the width, approximately 348–356 pt wide on a 390–393 pt viewport. It is roughly 100–116 pt tall with a 28–32 pt top-corner radius; the bottom may continue behind the tab bar or safe area. Use a subtle 1 pt border/shadow and a white or very light blue-gray fill.
- **Padding:** 20–22 pt horizontal, 14–16 pt top, 10–14 pt bottom. Placeholder/input is approximately 18–20 pt with 24–26 pt line-height. Multiline text grows upward; keep the control row at the bottom and cap the text area around 5 lines.
- **Left affordance:** plus glyph around 20–22 pt in a pale circular 48 pt hit target. Use it for attachments, camera, files, and the current tool/context menu.
- **Right affordance order in the inspected capture:** blue active search/research pill → `Fast` dropdown pill → microphone circle. Each is approximately 44–48 pt high. The `Fast` pill is ghost/outlined or light-filled, about 72–88 pt wide, with a 14–16 pt label and 16 pt chevron. The mic is a 48 pt outlined/light circle with a 20–22 pt glyph.
- **Live voice:** Google’s iOS help describes `Live` as a separate bottom action or swipe-left path, not necessarily the same microphone used for dictation. Keep Live as a distinct voice mode; do not conflate a one-shot mic transcript with full-duplex Live.
- **Typed state:** `Send` appears after text is entered, per Google’s iOS help. Use a 40–44 pt filled circular arrow-up button, with a blue/Google accent or dark neutral fill depending on theme. If send replaces mic, preserve Live as a separate mode control so the user does not lose voice access.
- **Placeholder:** context-specific copy is common: `What do you want to research?` in research mode; generic builds use `Ask Gemini` or `What can I help you with?`. Keep the placeholder action-oriented rather than model-oriented.
- **Inline chips:** Gemini visibly exposes active search/research and `Fast`/model-speed selection in the composer. Chips sit on the bottom toolbar after the plus, not above the message stream. Use 32–36 pt chip height, 14–16 pt labels, 12–16 pt gaps.

### Message layout

- **User turn:** compact right-aligned light-neutral bubble/surface, roughly 78–84% max width, 14–16 pt padding, 16–20 pt radius.
- **Assistant turn:** plain sans prose plus structured Google-style answer cards. Use Google Sans/Roboto-like typography around 16–18 pt body, 24–27 pt line-height, 12–16 pt paragraph spacing. Headings are 20–22 pt bold; lists use 26–32 pt indent.
- **Structured answers:** research plans, timelines, images, citations, and interactive results use light blue-gray cards with 18–22 pt radius and 16–20 pt padding. Keep action buttons inside the card only when they operate on that artifact; keep message feedback outside it.
- **Turn rhythm:** 20–28 pt from user bubble to answer, 12–16 pt between answer paragraphs/cards, 24–32 pt between turns. No persistent assistant avatar/name is required in a standard thread.

### Per-message action row

- **Observed capture:** thumbs up, thumbs down, and vertical overflow below the answer/card. Use 20–23 pt glyphs, 44 pt hit targets, and 18–24 pt visible gaps.
- **Current documented behavior:** Gemini can regenerate only the most recent response. On mobile, the documented path is `More` → `Other drafts` → `Regenerate`; this means retry is a latest-answer action, not a permanent button under every old message.
- **Other actions:** copy, share, listen/read aloud, and export belong in `More` or the response/card menu. Keep the default row to feedback plus overflow to preserve the clean Google document feel.
- **When shown:** always for the latest completed response; older answers can reveal actions on tap or long-press. During generation, show a stop/progress state and defer feedback until completion.

### Header / top bar

- **Height:** approximately 56–64 pt below the safe area.
- **Left:** hamburger/sidebar, 44 pt target.
- **Center:** conversation title, often truncated to one line at approximately 17–19 pt; the inspected capture shows a title such as `Coffee Business Resear…`, not a model name.
- **Right:** edit/new-chat icon, share icon, and overflow, each around 44 pt hit area with 16–20 pt glyphs. A three-action right cluster is acceptable because the header is otherwise sparse.
- **Design implication:** Gemini is a counterexample to “model name centered.” Put the conversation title in the center and make `Fast`/model selection part of the composer.

### Signature details

- **Disclaimer:** exact visible copy is `Gemini is AI and can make mistakes.` The inspected capture places it below the answer action row and directly above the composer, in approximately 14–16 pt gray sans with 20 pt line-height.
- **Scroll-to-bottom:** use a 44–48 pt floating down-chevron above the composer when the thread is not at the latest response; it should not compete with the bottom card.
- **Streaming/generating:** use a subtle Google/Gemini sparkle, spinner, or progressive answer-card state. In research mode, show `Ready in a few mins`/progress information as part of the plan card rather than only a generic shimmer.
- **Empty/new chat:** greeting and prompt suggestions can be centered or shown as task chips. Keep the large composer card visible from first launch; Google’s official flow supports Keyboard, Microphone, Live, and Send as parallel entry paths.

### Source grounding

- [Google Gemini Help: Get started with the Gemini mobile app — iPhone/iPad](https://support.google.com/gemini/answer/14554984?co=GENIE.Platform%3DiOS&hl=en) — Keyboard, Microphone, Live, Send, and voice state behavior.
- [Google Gemini Help: Talk naturally with Gemini Live — iPhone/iPad](https://support.google.com/gemini/answer/15274899?co=GENIE.Platform%3AiOS&hl=en) — Live entry, hold/end, transcript, and switching between Live/text.
- [Google Gemini Help: Regenerate or modify responses — iPhone/iPad](https://support.google.com/gemini/answer/14262426?co=GENIE.Platform%3AiOS&hl=en-GB) — latest-response-only regeneration path.
- [Google Gemini Help: What you can do with your Gemini mobile app](https://support.google.com/gemini/answer/14579631?co=GENIE.Platform%3AiOS&hl=en) — text, voice, photos, camera, and Live capabilities.
- [Google Gemini on the App Store](https://apps.apple.com/us/app/google-gemini/id6477489729) — current iOS listing and screenshots.

## 7. Meta AI

Meta AI is the most voice-first and discovery-oriented of the group. The standalone app pairs a prompt composer with a Discover feed, personalized conversation starters, and a visible microphone-in-use state. The current app listing also names text/voice, Thinking, file uploads, threading, better formatting, and conversation recall. A current visual capture shows a bottom composer with `Ask anything…`, `Fast`, microphone, and waveform controls above a tab bar.

### Composer / input anatomy

- **Overall frame — observed:** a white bottom sheet/card that is wider and taller than a simple text field, approximately 348–356 pt wide and 104–120 pt high, with 28–32 pt top-corner radius. It has a 1 pt light-gray divider/border and very little shadow. A bottom navigation strip begins immediately below it.
- **Padding:** 20–22 pt horizontal; 14–16 pt top; 10–14 pt bottom. Placeholder is approximately 18–20 pt gray sans with 24–26 pt line-height. Multiline text grows upward while the utility row remains anchored to the bottom; cap at 5–6 lines, approximately 190–220 pt total.
- **Left affordance:** plus in a pale circular 48 pt target, 20–22 pt black glyph. It is the attachment/context entry for photos, documents, spreadsheets, and other multimodal input.
- **Right affordance order in the inspected capture:** `Fast` dropdown pill → microphone circle → live waveform circle. `Fast` is a pale filled pill around 80–92 pt wide, 40–44 pt high, with 16–17 pt semibold label and down chevron. The mic and waveform are pale 48 pt circles with 20–22 pt dark glyphs.
- **Typed state:** a filled circular send arrow should appear after text is entered, generally replacing the voice/live control that is least relevant to the current mode. Keep one voice entry point available so the composer never becomes text-only by accident. Meta’s product direction makes it reasonable to keep Live visibly one tap away in the empty state.
- **Placeholder:** `Ask anything…` in the standalone app. Other Meta surfaces may use `Ask Meta AI anything` or `Message`; use the standalone wording for the Luna-style full-screen chat.
- **Inline chips:** `Fast` is a persistent speed/model pill; `Thinking` is a mode that can be exposed in the plus/tool menu or as an active chip. Keep only one speed/mode chip visible at a time to avoid turning the composer into a settings shelf.

### Message layout

- **User turn:** right-aligned light neutral bubble, 78–84% max width, 14–18 pt horizontal padding, 10–14 pt vertical padding, 16–20 pt radius.
- **Assistant turn:** left-aligned sans prose, normally unbubbled. Use 16–17 pt body, 24–26 pt line-height, 12–16 pt paragraph spacing, and 20–22 pt headings. Generated images/videos and shopping/discovery cards can use 18–24 pt rounded surfaces.
- **Conversation identity:** no assistant name/avatar row is required in the default thread; the gradient Meta AI mark, voice state, or generated-media card can provide identity when needed.
- **Turn rhythm:** 20–28 pt between user and answer, 12–16 pt between paragraphs/cards, 24–32 pt between turns. Keep Discover/social metadata outside the ordinary conversational turn so it does not look like assistant prose.

### Per-message action row

- **Documented actions:** thumbs up and thumbs down are explicit response feedback controls. Meta says thumbs-down opens reason choices such as not relevant, not accurate, harmful/offensive, too repetitive, or other.
- **Recommended visible row:** copy, share, thumbs up, thumbs down, and overflow when the answer is complete. Use 20–22 pt glyphs, 44 pt targets, and 14–18 pt gaps. Read aloud is naturally available through voice mode rather than necessarily as a per-message triangle.
- **When shown:** latest completed assistant answer by default; older rows can be revealed on tap/long-press. Keep feedback outside generated-media cards unless it rates the media itself.
- **Retry:** prefer a follow-up or overflow action. Meta’s documented refinement pattern is conversational (“change this,” “make it darker,” “adjust the plan”), so a permanent regenerate icon is less essential than in DeepSeek or Gemini.

### Header / top bar

- **Height:** approximately 56–64 pt below the safe area.
- **Left:** hamburger/sidebar in a 44 pt target.
- **Center:** on the empty home, there may be no centered model title; the screen uses a personal greeting and a top-right identity/device pill. In an active chat, use a simple title or Meta AI mark rather than forcing a model dropdown.
- **Right:** profile, connected-glasses/device status, share, or overflow. Keep device state visually separate from conversation controls; a 44 pt pill/target is appropriate for the glasses/battery status.
- **Bottom navigation:** Home/Discover/History/Devices may remain visible under the composer. Reserve a 48–56 pt tab bar and a 1 pt divider; the conversation composer should float above it rather than obscure it.

### Signature details

- **Disclaimer:** no stable `Meta AI can make mistakes` footer was found in the current official launch post, app listing, or usage guide. Meta emphasizes response feedback and user control instead. If Luna needs a disclaimer, use a compact 14 pt gray line above the composer rather than adding a new permanent panel.
- **Scroll-to-bottom:** use the common 44–48 pt floating down-chevron above the composer only when away from the latest answer.
- **Streaming/generating:** voice mode should show a gradient orb/waveform or listening animation; Meta’s launch post explicitly calls out a visible icon when the microphone is in use. Text generation can use a small animated gradient mark or shimmer in the answer column.
- **Empty/new chat:** a large time-sensitive or personalized greeting such as `What are you thinking this afternoon?`/`Good morning, Alex!`, followed by 4–6 suggestion rows with thumbnail images or small icons. The composer remains anchored at the bottom with `Ask anything…` and the voice-first controls.

### Source grounding

- [Meta Newsroom: Introducing the Meta AI app](https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/) — standalone app, voice-first direction, visible mic-in-use state, Discover feed, and text/voice conversation.
- [AI at Meta: How to use Meta AI](https://ai.meta.com/learn/ai-basics/how-to-use-meta-ai/) — text, visual, audio, file inputs, conversational refinement, and thumbs-up/down reasons.
- [Meta AI on the App Store](https://apps.apple.com/us/app/meta-ai/id1558240027) — current iOS listing for Thinking, attachments, threading, formatting, recall, text, and voice.
- [Android Central: Meta AI app interface](https://www.androidcentral.com/apps-software/meta/new-meta-ai-app-provides-a-llama-4-powered-challenge-to-gemini) — visual reference for the voice-first home, history, Discover, and prompt bar.

## Synthesis: the cross-app composer + message recipe

Across the seven apps, the shared pattern is a bottom-anchored, stateful input card paired with assistant prose that is intentionally less “chat bubble” than the user turn. The differences are mostly where capability selection lives: Claude hides tools behind plus, Gemini exposes `Fast` and search in the card, DeepSeek exposes reasoning/search chips, Perplexity exposes search modes and sources, and Meta exposes voice/speed as the primary affordances.

### Recommended composer recipe for a Luna-style iOS chat

| Element | Recommended baseline | State change |
| --- | --- | --- |
| Outer card | 350–360 pt wide; 24–30 pt radius; 1 pt low-contrast border; soft 0–2 pt shadow | 88–104 pt one-line card with toolbar; grow upward to 184–220 pt for 5–6 lines |
| Text | 16–17 pt sans; 23–25 pt line-height; 16–20 pt horizontal inset | Scroll internally after max height; keep toolbar pinned to bottom |
| Left control | Plus/paperclip, 20–22 pt glyph, 44–48 pt hit area | Opens photos, files, camera, tools, and mode menu |
| Empty right controls | Mic/dictation followed by Live/waveform | Live is filled/strong; dictation is outline/neutral |
| Typed right controls | Optional mic/dictation followed by filled send circle | Send is 40–44 pt, arrow-up glyph 20–22 pt, filled dark or accent color |
| Mode chips | One or two max, 32–36 pt high, 14–16 pt labels | Show only active search/reasoning/model state; avoid permanent tool clutter |
| Placeholder | `Reply to Luna` in a thread; `Ask anything…` on empty state | Change to `Stop generating`/stop affordance while streaming |
| Touch geometry | Every icon control at least 44 × 44 pt; visible glyphs 18–23 pt | Keep hit areas stable when icons swap |

### Recommended message recipe

1. **User turn:** right-aligned compact bubble, 78–84% max width, 14–18 pt horizontal padding, 10–14 pt vertical padding, 16–20 pt radius, neutral tinted fill. Keep it visually subordinate to the answer’s reading surface.
2. **Assistant turn:** left-aligned, full-width prose with no repeated avatar/name. Default to 16–17 pt sans, 24–26 pt line-height, 12–16 pt paragraph spacing, 20–22 pt headings, 26–32 pt list indent, and 12–16 pt code-card padding.
3. **Claude-inspired premium variant:** use a 19–21 pt serif assistant body with 29–32 pt line-height and 24–27 pt headings. This is the clearest way to create a more reflective, editorial reading experience.
4. **Between turns:** 20–28 pt from user bubble to assistant answer; 24–32 pt between completed turns. Keep citations, tool cards, and reasoning panels attached to their answer with 8–16 pt gaps.
5. **Action row:** 20–22 pt low-contrast icons in 44 pt targets; copy, share, read aloud, thumbs up/down, and retry/overflow. Show under the latest completed assistant turn; reveal older rows on tap/long-press.
6. **Footer:** if a disclaimer is used, place a single 14 pt gray line or two short lines immediately above the composer. The source apps demonstrate two strong variants: explicit copy (`Gemini is AI and can make mistakes.`) and citation-led trust (Perplexity).
7. **Streaming:** replace the action row with stop/cancel; show one unmistakable animated indicator in the assistant column; keep the composer controls visible but prevent duplicate sends.
8. **Empty state:** centered greeting or brand mark, 3–5 suggestion rows/chips, then a composer that is already in its final bottom position. Suggestion rows should be tappable prompts, not fake messages in the thread.

### The most reusable rule

Use the composer as a small state machine:

`empty → typing → multiline → recording → streaming → complete`

Only the right-side action should change aggressively. Keep the card’s position, left attachment affordance, text baseline, and 44 pt hit geometry stable. That stability is the common usability win shared by Claude, ChatGPT, Gemini, Perplexity, DeepSeek, Kimi, and Meta AI even though their visual personalities differ.
