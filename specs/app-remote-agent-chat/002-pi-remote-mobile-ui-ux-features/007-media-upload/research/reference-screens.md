# 007-media-upload — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.
> Mobbin (`mobbin_search_screens`, platform "ios") returned zero results for every query tried — including a plain control query — so no Mobbin URLs are cited below. All cited screens are Refero records with their canonical `refero.design/screens/<id>` URLs, returned directly by `refero_refero_search_screens`.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| Claude | https://refero.design/screens/bc1d1323-3d75-40f2-9fac-d0414f015280 | AI chat on an off-white parchment surface (#F5F5DC), serif titles in dark brown ink (#4B3B2B) — the closest real-world precedent to Pi Remote's ink-on-parchment chat canvas. |
| Claude | https://refero.design/screens/e8005c23-7a67-4c7e-9b27-948d4feea4f6 | Warm beige (#F0EDE6) AI chat home with dark-brown ink text and a large serif greeting — confirms parchment tone + serif editorial type works for an AI surface. |
| Dot | https://refero.design/screens/e1611b40-1310-4d6d-93b9-2e2ce075184c | Dot AI chat: warm, soft-gradient background, serif message type, composer + keyboard visible — the attach affordance must live inside this kind of calm editorial composer. |
| Dot | https://refero.design/screens/65e1554a-a952-4bc5-be79-de2e1ddbbf06 | Dot chat with a small rounded inline pop-up menu appearing directly above the keyboard (a two-option action menu, camera-style choices) — precedent for a lightweight, inline attach action sheet that doesn't cover the thread. |
| ChatGPT | https://refero.design/screens/6b970686-78ea-485e-84fe-200e2f50db29 | Sent message containing a small attached image thumbnail labelled "Selection" inline in the chat bubble — the transcript representation of a sent image. |
| ChatGPT | https://refero.design/screens/c0e16fdb-3f6f-41d5-af60-7247945b0f7c | Horizontal scrollable gallery row of three rounded-corner thumbnails in the message area — multi-image layout inside an AI chat. |
| Grok | https://refero.design/screens/c49c717d-a429-4540-b0e8-77276c95a006 | Grok chat with two images placed side by side inline and a Chat/Voice segmented control in the header — inline media grid + composer in a reference AI app. |
| Comet | https://refero.design/screens/a5464674-b14c-43c7-b1a4-72fd853e47cb | Full-screen AI assistant composer with a visible **attachments row at the top** and the message composer anchored above the keyboard — the exact "attach, then type/send" composition anatomy. |
| Comet | https://refero.design/screens/ccbe41de-97b6-4671-8ed2-a98f05ba9c78 | Composer overlay with an **"Attachments" label + three rounded thumbnails showing spinner placeholders and small remove (×) badges** — the pre-send preview + upload-in-progress + remove interaction, all in one screen. |
| WhatsApp | https://refero.design/screens/dbab9d90-eb62-434f-808c-f9e5d7b75a3d | Photos/media picker as a bottom sheet expanded over a dimmed conversation (warm beige palette #C2C1BA) — gallery picker overlay on top of chat. |
| Telegram | https://refero.design/screens/43d2b4e9-6879-4419-a089-aacb52c2bb51 | In-chat media picker for selecting images/videos to share — grid + selection mode + share affordance inside the conversation context. |
| Telegram | https://refero.design/screens/ddfa1c9f-0afd-4ae6-9184-401168744ac1 | Photo being uploaded in a chat thread (upload & download pattern in a green-bubble conversation) — per-message upload progress in the thread. |
| Perplexity | https://refero.design/screens/2b2311f2-8387-47a5-a66a-91e90f8acc67 | Thread with a horizontal media gallery of images with captions and source links — media-with-metadata layout in a reference AI app. |
| Superlist | https://refero.design/screens/1ea3866b-18df-49b9-9926-6fcf30c032f7 | Message containing a large inline image **plus a document attachment chip showing a truncated filename and size (233 KB)** — the file-chip pattern for showing an attachment without rendering its raw content. |

## Reference-backed UI/UX direction

Concrete direction for an ink-on-parchment, security-safe gallery upload, grounded in the screens above.

1. **Composer attach affordance (Comet `a5464674`, Dot `65e1554a`).** Put a quiet ink "+" inside a hairline circle at the left of the text field. Tap opens a small inline action sheet anchored just above the keyboard (Dot's inline menu precedent), never a full-screen takeover — rows in ink: "Camera", "Photo Library", "Cancel", with a one-line muted-sepia caption naming the max size/type. Because this feature crosses the read-only posture, this is the moment the user explicitly opts in; no implicit permission is ever assumed.

2. **Gallery picker as a bounded parchment sheet (WhatsApp `dbab9d90`, Telegram `43d2b4e9`).** Present the iOS photo library in a bottom sheet over a dimmed parchment-bleed scrim (warm-tinted dim, not flat black). Grid of thumbnails; tap to multi-select; selection marked with an ink check in a hairline ring; a send bar carries the running count ("Send 3"). Keep the sheet ~70% height with a drag handle so the thread stays contextually visible.

3. **Pre-send previews with per-item remove (Comet `ccbe41de`).** Render chosen media as rounded thumbnail cards in an attachments row above the text field, each with a small circular ink "×" remove badge. While the host upload is in flight, show a thin ink progress line (ruling-pen motif) instead of a spinner, plus a muted "uploading…" caption; the send action stays disabled until the host confirms every attachment landed. On failure, show a one-line ink warning with Retry / Remove.

4. **Transcript redaction that keeps the surface safe (Superlist `1ea3866b`, ChatGPT `6b970686`).** Once delivered, the sent message shows the image inline as a thumbnail — but when the raw bytes must not be retained/replayed (read-only security posture), render the attachment as an ink chip with a truncated filename, type, and size (Superlist's file-chip), or a "[image attached]" placeholder with an ink "view" action that pulls bytes only on demand. The transcript therefore never re-hosts media it doesn't need to.

5. **Multi-image layout (ChatGPT `c0e16fdb`, Grok `c49c717d`, Perplexity `2b2311f2`).** Stack multiple images as a horizontal scrollable gallery or a 2-up grid, each thumbnail framed in a hairline parchment rule rather than a colored bubble. Long-press opens a full-screen viewer on the parchment canvas with an ink "Close".

6. **Confirm-before-send language (Dot `65e1554a`).** Since upload reaches pi across the read-only boundary, every path ends in an explicit, confirmable send (the sheet's send bar, or a Send button in the composer), mirroring Dot's staged, confirm-first inline actions. A cancelled/failed upload is removed silently with no state left in the thread.

7. **Accessibility (all screens).** Never icon-only: each attach control carries a visible ink label ("Attach", "Remove", "Send 3") plus accessibilityLabel; thumbnails expose alt text (type, size, name) so VoiceOver reads what was attached; sheet, picker, and viewer all honor Dynamic Type with the serif ink stack and meet 4.5:1 contrast on parchment.

## Coverage gaps

- **No priority AI app capture shows the exact gallery-picker-inside-AI-composer step.** The closest AI-app references (Claude, Dot, ChatGPT, Grok, Perplexity) show either the composer or the sent attachment; the true picker sheets come from WhatsApp/Telegram. The composition (Comet) is the only AI-adjacent screen that shows the full attach→preview→send anatomy.
- **No real screen found for a security-safe / read-only "redacted attachment placeholder"** in an AI chat; Superlist's filename+size chip is the closest analogue and the direction above extrapolates from it.
- **No animated upload-progress reference within an AI chat composer** — Comet shows only static spinner placeholders; the in-thread progress pattern comes from Telegram.
- **No screens from Pi, Meta AI, Manus, Genie, or Microsoft Copilot** showed a gallery-upload interaction for this feature.
- **Mobbin returned zero results for every query** (including a control query), so this file cites Refero URLs only.
