# 005-file-preview — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.

Feature: **See and preview a file like the Claude app (full-screen viewer)** — a full-screen viewer opened from a file/code/document artifact card in the Pi Remote chat, where the relay-delivered (immutable, redacted) file is rendered for reading, panning and copying but never edited.

Mobbin (platform ios) returned **zero** results for every query — including the feature queries (`file preview mobile`, `code file viewer`, `document full screen sheet`, `diff viewer mobile`, `code block full screen chat`, `file attachment detail view`, `PDF reader full screen app`, `markdown preview editor mobile`) and a control query — so no mobbin.com URL is cited. All screens below are real Refero (refero.design) records returned by `refero_refero_search_screens` for those queries plus `source code viewer mobile`, `syntax highlighted code viewer`, `document viewer reading mode`, `artifact full screen`, `Claude artifacts`, and `git diff mobile`. No URLs are fabricated.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| Meta AI | https://refero.design/screens/fa7901f8-db92-49d7-863c-7e8c3608f20b | **Full-screen code viewer in an AI app**: dark mode, raw HTML/source with syntax highlighting, near-black (#131414) surface, minimal developer-focused chrome — the closest real capture of "full-screen file viewer launched from an AI chat." |
| Meta AI | https://refero.design/screens/af5ae5a1-2b57-4cfc-9bb7-58bf8c7d3cae | Light-mode sibling: minimalist iOS-style **code viewer modal**, pure white background, no visible borders or chrome — the ink-on-parchment light variant for the same full-screen viewer. |
| Meta AI | https://refero.design/screens/a2eb6e7f-4144-4576-8656-3529a0ea79a3 | **"Artifacts" file library**: visual grid of recent/saved files on an off-white background, soft shadows, rounded cards — precedent for a file list whose items open full-screen. |
| Claude | https://refero.design/screens/870c725f-5ba0-4810-a009-eeed635cca59 | Full-screen **article/document reading surface from the Claude app itself** on a light beige (#F5F3EB) background with dark-gray ink and a serif typeface — the closest real Claude capture and near-exactly Pi Remote's parchment reading aesthetic. |
| Claude | https://refero.design/screens/58d084f6-126a-4c45-b626-386ab11e08cd | Claude chat with a **back-arrow nav bar and centered serif title in dark brown** — shows how a file/document title anchors the header of a full-screen view pushed from chat. |
| Grok | https://refero.design/screens/3a4667e6-7886-4a36-a7f8-60aafdbe5e80 | Light-beige (#FAF9F6) chat with a `Files` pattern and hamburger nav — an AI chat surface that hosts file context, matching the beige family Pi Remote already uses. |
| Gemini | https://refero.design/screens/531535c2-274d-4639-96de-6885969d23dd | Dark-mode **code snippet + prose explanation** in an AI assistant — shows code blocks rendering inside the reading flow before any full-screen expansion. |
| Craft | https://refero.design/screens/c0a6031a-4722-4abc-90eb-4dbce4f8fae2 | Single screen combining a **code snippet viewer on top, a selected PDF document preview in the middle, and a bottom sheet of card-style options** — the exact "inline preview → full-screen" progression and the card/export affordance. |
| Craft | https://refero.design/screens/8ba36155-c199-4ac0-9057-2e5461b6db44 | **JS code editor/viewer with syntax highlighting and line numbers** on a dark code well — the line-numbered, monospaced code rendering a file viewer needs. |
| Craft | https://refero.design/screens/58971acb-7d90-4994-a66c-c2bd0f8126e2 | Dark-mode **JavaScript snippet with syntax highlighting** (teal keywords, light-blue strings) displayed prominently in the upper screen — token-color model for an ink palette code surface. |
| Dropbox | https://refero.design/screens/50c7f26c-6d60-49e9-be86-8e9904f94a00 | **Full-screen PDF viewer**: nav bar with back arrow left, filename centered, "Page 1" below it, document reading area beneath — canonical header anatomy for a document viewer. |
| Dropbox | https://refero.design/screens/98a5d1c6-b513-4d97-9a9d-dd8c2789ea39 | PDF viewer mid-document (page 2) with **back button + centered title + page indicator** — shows page-progress state persisting in the header while reading. |
| UGLYCASH | https://refero.design/screens/5a0f2052-b84e-476c-98c3-f31f5098444e | **Document reader rendering stacked pages** as full white sheets with text blocks and centered page numbers, monochrome serif layout — the "sheets of a document" reading metaphor for PDFs on parchment. |
| Bear | https://refero.design/screens/ddd09154-6bed-4c34-af6a-996ed2af57c3 | **Scanned-document preview card**: file-type label (PDF) + size (4.6 MB) with the preview centered in the top half — the metadata + tap-to-open-card pattern before entering full screen. |

## Reference-backed UI/UX direction

Concrete direction for building the full-screen file viewer in Pi Remote's ink-on-parchment system (read-only posture — rendered content is the relay's authorized, immutable, redacted artifact and is never edited on-device), grounded in the screens above.

1. **Full-screen presentation, not a new nav destination.** Meta AI's viewers (fa7901f8, af5ae5a1) and Claude's reading surface (870c725f) are pushed full-bleed views with a back-arrow header — the viewer should be a full-screen modal/push from the artifact card in the chat, with one back affordance to return to the conversation. Header anatomy follows Dropbox (50c7f26c, 98a5d1c6): back arrow left, **centered filename**, page/progress indicator beneath the title, right side reserved for close/copy only.

2. **Two rendering surfaces mapped to parchment ink.** Code files render as a syntax-highlighted, **line-numbered monospace block in a darker ink "code well"** (Meta AI fa7901f8, Craft 8ba36155/58971acb, Gemini 531535c2) — a near-black or deep-ink surface that visually brackets the parchment page. Documents/PDFs render as **stacked white/parchment sheets with centered page numbers and serif body type** (UGLYCASH 5a0f2052, Claude 870c725f) — page-turn-by-scroll, never two-up on phones.

3. **Header + metadata states.** Bear (ddd09154) and Dropbox show the file-identity chrome: type badge (PDF / code / markdown) and size near the title, so the user always knows what they opened. While an artifact is still arriving from the relay, the viewer shows the metadata header with a muted **"awaiting file…"** state in place of the body (no optimistic render — the host is authoritative); on delivery failure it shows a read-only, recoverable reason line instead of the file. No retry mutates state; re-open is user-initiated.

4. **Read-only interaction set.** All gestures are display-only: vertical scroll, horizontal pan, and **pinch-to-zoom on code** (source viewer body), plus a single **Copy** action in the header that copies the file text without persisting or editing anything. There is no edit, save, or share affordance — matching the relay's immutable-artifact contract. The viewer must render the exact redacted bytes sent by pi; the code well is non-editable by construction.

5. **Typography & palette for ink-on-parchment.** Use the beige family Claude itself uses for reading (≈ #F5F3EB / #FAF9F6 from 870c725f and Grok 3a4667e6) for the parchment page, near-black ink (#2C3E3A family) for text, and the dark code well (#131414-scale, Meta AI fa7901f8) for code blocks with the Craft token colors (teal keywords, light-blue strings) re-mapped to an ink-compatible accent. Serif for prose/PDF, monospace for code; keep ≥4.5:1 contrast.

6. **A11y & orientation.** Keep the header visible with the page indicator updated via `aria-live="polite"`; announce filename + type + page ("page 2 of 14") on open and on page change via VoiceOver. Support Dynamic Type for prose (serif line length ~66ch) and a minimum tap target ≥44pt for back/close/copy. In landscape, stack pages as full-height parchment sheets with the same header; never shrink code below a readable monospace size without a pinch-to-zoom escape.

## Coverage gaps

- **No real Claude-app full-screen *file* viewer capture.** The returned Claude screens are an article/reading surface (870c725f) and a chat (58d084f6), not a code/PDF artifact viewer. The full-screen code-viewer evidence comes from Meta AI, Craft, Gemini and Dropbox instead.
- **Mobbin returned zero results** on every query (including the control "file preview mobile"), so no mobbin.com URLs are cited; all 14 cited screens are Refero records.
- **No diff viewer found.** Queries for `diff viewer mobile` and `git diff mobile` returned irrelevant screens (video players, camera metadata, inboxes) — no real unified-diff rendering (red/green inline changes) was retrievable.
- **No reference found for:** the Pi app itself, Dot, Manus, or Copilot file-preview screens; a native markdown full-screen preview (the markdown query returned only overlays/bottom sheets); a multi-page thumbnail/page-jump control; or a dedicated screen-reader (VoiceOver) view of a file viewer.
