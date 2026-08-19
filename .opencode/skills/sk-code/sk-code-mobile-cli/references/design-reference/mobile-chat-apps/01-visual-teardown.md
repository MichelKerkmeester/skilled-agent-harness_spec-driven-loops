# Mobile AI Chat — Visual Teardown

Ground-truth analysis of real reference screens (staged in `./screens/`). The primary
target is the **Claude iOS app**; Kimi/ChatGPT/Gemini/Meta AI are corroborating sources.
Numbers are read off the screenshots at ~390pt logical width and are targets, not measurements.

---

## Reference index

| File | App | What it shows |
|------|-----|---------------|
| `screens/claude-conversation-actions.png` | Claude | Assistant turn: serif prose, artifact card, **action row**, disclaimer, composer |
| `screens/claude-composer-keyboard.png` | Claude | Composer with text + keyboard, **send/voice toggle**, scroll-to-bottom chevron |
| `screens/meta-ai-home.png` | Meta AI | Empty/greeting state, suggestion rows, composer with model+mic+voice |
| `screens/gemini-research-plan.png` | Gemini | Plan card, action row, disclaimer, tool-toggle chip in composer |
| `screens/00-current-pi-remote.png` | **Pi Remote (ours)** | The screen we are replacing |

---

## 1. Claude app — the primary target

### 1.1 Header (top bar)
- **Three-slot layout, model name centered.** Left: back chevron `‹` inside a soft circular
  button (~36px, faint fill). Center: **`Sonnet 4.5 ⌄`** — model name in medium sans with a
  small down-chevron; tapping it is the model switcher. Right: a **clay-filled circle with `+`**
  (new chat), ~36px.
- Very subtle concentric-ring glow bleeds down from behind the header — soft, low-contrast.
- No visible title/breadcrumb text other than the model name. The header is quiet.

### 1.2 Conversation / message flow
- **Assistant replies are SERIF prose, no bubble, no avatar.** Source-Serif-like face,
  ~19–20px, line-height ~1.5–1.6, paragraph gap ~14–16px. Reads like a document, not a chat log.
- **Numbered/bulleted lists stay in serif**, hanging indent, generous line spacing
  (`1. Change the topic - Adapt the content…`). List marker is the same ink as body.
- **Inline cards** (artifacts) sit in the flow: rounded ~16px, hairline border, near-canvas
  fill, title (medium) + muted subtitle (`Piano MIDI Player` / `Interactive artifact`) + a
  small tilted thumbnail/icon at the right. A `1 artifact` pill can sit centered above the turn.
- **Per-message action row** under the assistant message: a single horizontal row of
  outline glyphs, evenly spaced (~22–26px gap), muted ink, ~20px each, in this order:
  **copy · share · play(read-aloud) · thumbs-up · thumbs-down · retry**. No labels, no container.
- Below the row, left-aligned, the **clay starburst/asterisk brand mark** (also the streaming glyph).
- **Disclaimer**, muted, small (~12–13px), right-aligned near the composer:
  *"Claude can make mistakes. Please double check responses."*

### 1.3 Composer (input) — the centerpiece
- **One rounded container**, radius ~22–26px, fill slightly lighter than canvas, hairline
  border + a soft shadow. Comfortable padding (~14px), grows with multiline.
- **Placeholder** `Reply to Claude`, muted.
- **Bottom-inside control row**: `+` on the LEFT (attach/tools). On the RIGHT a mic glyph and
  **one circular action button**.
- **Send ↔ voice toggle (critical detail):**
  - Empty input → the right circle is **dark (carbon) with a voice-waveform glyph** (live voice).
  - Text present → the right circle becomes **clay with an up-arrow `↑`** (send).
  - So the primary button *morphs by state*; it is never a full-width bar.
- **Floating scroll-to-bottom chevron** `↓` — a soft circular button, centered, appears
  mid-screen when scrolled up.

### 1.4 What makes it read as "Claude"
1. Serif body prose for the assistant (biggest single signal).
2. Quiet, centered model-name header — no chrome, no nav clutter in the chat.
3. The morphing circular send/voice button (never a rectangular "Send" bar).
4. Restrained monochrome action row that appears under the message, not floating controls.
5. Warm bone canvas + a single clay accent used sparingly (send button, brand mark, `+`).

---

## 2. Corroborating patterns (Kimi / ChatGPT / Gemini / Meta AI)

Common recipe across the category — our composer + flow should converge here:

- **Composer is a single rounded "island"** with a `+` on the left and a small cluster on the
  right. The rightmost primary is a **circular send** (arrow-up), filled in brand color, that
  **replaces** a mic/voice control when the field has text. Nobody uses a full-width Send bar.
- **Model / speed selector lives OUT of the message flow** — either centered in the header
  (Claude) or as a small pill inside/above the composer (Meta AI `Fast ⌄`, Gemini `Fast`).
- **Tool toggles** (search, plan, attach) are chips near the `+`, not stacked text rows
  (Gemini's blue search chip with an `✕` to clear).
- **User vs assistant asymmetry**: user turns are compact (often a light bubble), assistant
  turns are full-width prose. Assistant is the reading surface; user is a quiet echo.
- **One-line disclaimer** under the last assistant message: *"<App> can make mistakes."*
- **Action row** = monochrome outline icons, shown on assistant turns.
- **Empty state** = a short greeting + tappable suggestion rows (thumbnail + label).

---

## 3. Our current screen (`00-current-pi-remote.png`) — the gap

What's wrong, mapped to the target:

| Area | Ours now | Target |
|------|----------|--------|
| Model / Effort / Build·Plan / `/command` | **Plain text rows stacked in the message flow**, above the composer | Out of the flow — model+effort in a header sheet, plan + slash in the composer `+` menu |
| Assistant text | Plain sans paragraph | Source Serif prose, ~19–20px, roomy line-height |
| User text | (same plain treatment) | Compact quiet bubble |
| Per-message actions | **None** | Monochrome action row (copy · retry …) under assistant turns |
| Composer primary | **Full-width clay "Send" bar** + "STEER PI" eyebrow | Rounded island, `+` left, mic + **circular morphing send** right |
| Disclaimer | None | "pi can make mistakes…" muted line |
| Scroll-to-bottom | Text pill "N new ↓" | Soft circular `↓` chevron |
| Header | pi logo + Inbox/Review + theme toggle | Quiet; model name + chevron centered (in-session) |

**Conclusion:** the single highest-leverage move is the **composer** (island + morphing
circular send + relocate the four controls into `+`/header), immediately followed by
**assistant serif prose + an action row**. Those three changes alone close most of the gap.
