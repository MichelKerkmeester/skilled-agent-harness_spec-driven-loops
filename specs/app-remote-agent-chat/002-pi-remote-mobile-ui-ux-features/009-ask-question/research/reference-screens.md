# 009-ask-question — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.

Real-screen evidence for pi's ask-question extension surface (inline terminal-style question card with selectable options + free text), gathered from Refero (platform ios) via the code-mode `call_tool_chain` (Mobbin `mobbin_search_screens` was queried for all seven queries below and returned **zero** results on every one, including a control query, so no Mobbin URLs are cited — nothing is fabricated). All 14 cited screens below are Refero records with their canonical `refero.design/screens/…` URLs.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| Chance AI | https://refero.design/screens/7e6f655c-8ea5-48c5-b2b9-497c3761ce70 | **Inline question card with choice options.** Bolded serif question ("Need a specialist eye?") + one explanatory line, then two horizontally elongated rounded option cards ("agent" choices incl. a skip path). The closest real capture of an agent asking the user a question mid-flow. |
| Flo | https://refero.design/screens/167ba376-9401-4354-a5b3-c2d75822659d | **Chat-based question: agent asks choice inside the transcript.** Symptom-checker conversation where the assistant's bubble is followed by tappable choice options (Select + Chat Bot), the user picks, and the chat continues. |
| Fable | https://refero.design/screens/3c659c24-a5e1-440d-bcab-d550f6564000 | **Free-text question with pill multi-select options.** Large serif question ("What do you usually like to read?") with rounded pill buttons; some filled/selected, others outlined — a clear selected-state precedent for option rows. |
| Grok | https://refero.design/screens/a0adc2f0-e148-4950-85f6-2ab5a8d6c5c2 | **AI chat with inline selectable choices.** Chat + Voice segmented top bar, user bubble, then multi-line AI answer with a "Select" pattern — shows an option surface living inline in an AI conversation. |
| Rewind | https://refero.design/screens/d97afd4c-66ad-4ec7-a757-804e96f64a7d | **"Ask" surface: question + input.** "Ask Rewind" mode with a bold question title and a text input area anchored above the keyboard — the direct precedent for ask-question free-text entry. |
| Meta AI | https://refero.design/screens/d64c8144-60b7-4f07-a9cc-4f2f14c7e5ad | **Inline bottom-sheet action card (permission-style).** Large rounded card prompting the user to "connect Gmail" — an assistant asking for a decision with a primary action, over a dimmed/scrim chat surface. |
| Genie | https://refero.design/screens/e0f5f23c-991e-41a5-90b3-2db267ed171d | **Permission / confirmation ask.** Editorial, centered AI-permission page (pure light surface, strong ink type, understated chrome) — precedent for asking a consequential question with calm, high-contrast microcopy. |
| Revolut | https://refero.design/screens/0ab3cc34-a1c1-4703-80c5-c2cecbdb9e09 | **Question modal over blurred surface.** "How was your chat?" bottom sheet with drag handle and three option choices; the dimmed/blurred backdrop keeps focus on the single question — applicable to an ask card overlay. |
| Claude | https://refero.design/screens/ae30091c-0a6b-4316-b7c2-8f1506ca88ae | **Warm parchment chat aesthetic.** Light beige surface (#F0EDE6), serif prompt text, minimal chrome, one accent (orange asterisk) — the closest colorway to Pi Remote's ink-on-parchment system; validates the serif-on-warm-paper look. |
| WURRD | https://refero.design/screens/0a64c469-0028-4199-9ca0-a214529cab92 | **Quiz question card on textured warm background.** Beige textured surface, warm-brown palette, serif question with selectable answer rows — typographic, chromatic-poor, high-contrast option selection. |
| Airbnb | https://refero.design/screens/77ea7b13-0d13-43df-82d2-7c6f589c0e95 | **"Ask" modal with free-text.** "Ask Olivia" question + one large rounded text area with placeholder and hint ("Make sure to introduce yourself.") — free-text ask with guiding microcopy. |
| BoldVoice | https://refero.design/screens/cee551de-75f4-426d-aeb7-acd1a7a3c9db | **Agent chat with task-list + progress + confirmation.** Conversational UI where the assistant presents a structured task/instruction box and a progress indicator, with refresh/close affordances — stateful agent-initiated ask. |
| Kin | https://refero.design/screens/a2eb19b9-e18b-45ae-ae81-bad865d414d5 | **Chatbot on soft beige surface.** Clean minimal chat on #FFF8F5 beige with pill-shaped elements — another warm-paper chat precedent and a calm option-bubble layout. |
| Coinbase | https://refero.design/screens/d2b32a76-ef17-497f-b2ed-444a1e1a2f4c | **Virtual-assistant chat with answer options.** Customer-support AI chat where assistant messages are followed by tappable reply options — the "assistant asks, user picks one" interaction in a transcript. |

## Reference-backed UI/UX direction

Concrete direction for an ink-on-parchment ask-question card, grounded in the screens above and constrained by the fixed design system (bone `#f8f8f6` / carbon ink / clay `#d97757`; Inter + Source Serif 4; light + dark; WCAG AA) and read-only-by-default security posture.

1. **Render the ask as an inline parchment panel in the transcript (not a blocking modal).** Follow Chance AI, Flo, and Grok: the question arrives as a card inside the message stream. Card = bordered (hairline ink) parchment panel with a small prompt marker; question in Source Serif 4 (serif display), the explanatory line and options in Inter — matching Claude's and WURRD's serif-question-on-warm-paper look rather than a floating dialog. The underlying chat stays readable; nothing disappears behind a scrim (contrast with Revolut's full scrim modal).

2. **Options as full-width tappable rows with a typographic selected state.** One option per row, thumb-sized (≥44pt hit area), using the Fable pill and Revolut/Duolingo-style choice lists: unselected = hairline-ink outline; selected = filled ink + ink check, never a chromatic fill, so hierarchy stays typographic (WCAG AA on both bone and ink surfaces). Prefer rows/pills to a compact dropdown so every option is a direct, one-tap target.

3. **Free-text where allowed, inside the same card.** When the ask allows free text, embed one bordered input beneath the options (Airbnb "Ask Olivia", Rewind "Ask Rewind"): label/placeholder in muted ink, input in Inter, and a primary clay submit affordance that is disabled until the text is non-empty. Keyboard entry and the hardware keyboard return key submit; do not auto-submit on blur.

4. **Keyboard/great-thumb navigation without focus magic.** Because options are rows, Up/Down (and Tab/Shift+Tab) move the selected row; Enter/Space confirm; the free-text field is reachable as the final stop. The currently selected row gets a clay focus ring. All of this degrades cleanly to pure touch. No auto-advance: submission is explicit and host-confirmed.

5. **Explicit host-confirmed submission and honest states.** Ties directly to the read-only posture: the card shows a quiet "submitting…" ink state with a thin progress hairline while the host confirms the answer; on success the card collapses to a compact "answered" line that stays in the transcript (host-projected, immutable); on failure an inline clay-toned error line re-enables the options and the card stays open — never optimistically cleared. No mutation is sent except via the one-use ticketed path.

6. **Keep read-only defaults visible, not hidden.** When the question could imply a state change, surface a one-line, muted ink "read-only until confirmed" hint in the card footer (Genie/Meta AI permission-card precedent), so the user understands why selection alone does nothing until the host's confirmation completes.

7. **A11y and reduced motion.** Announce the arriving ask with a polite live region; focus moves to the card's first option so a screen-reader user hears the question and options in order; option selection and submission states are exposed via `aria-pressed`/status text, not color alone. Both light and dark parchment variants must pass AA for the serif question text and the muted explanatory line (WURRD and Claude maintain this contrast on warm surfaces).

## Coverage gaps

- **No Mobbin captures.** Mobbin's daemon returned zero results on every query (including the seven listed above and a "onboarding signup" control), so all evidence is Refero-only; no mobbin.com URLs are cited.
- **No true terminal-style (CLI) ask-question screens.** OpenCode/Codex-style keyboard prompt UIs live in desktop terminals and are not captured in mobile reference libraries; the mobile adaptation (inline card + option rows) is derived, not directly screenshotted.
- **No direct captures of the named reference apps Dot, Manus, or Pi** surfaced in these queries; the closest task-list/agent-ask precedents are BoldVoice and Genie. A later pass could try app-specific Mobbin/Refero queries once Mobbin returns data.
- **No evidence for keyboard-based (arrow/Tab) option navigation** in any mobile capture, nor for the specific "host-confirmed ticket" state machine; both remain spec-design decisions grounded only in the adjacent patterns above.
